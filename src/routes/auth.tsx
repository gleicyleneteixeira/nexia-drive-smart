import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Loader2, Eye, EyeOff, User, ShieldCheck, ArrowLeft } from "lucide-react";
import { formatCpf, isValidCpf } from "@/lib/cpf";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
  head: () => ({ meta: [{ title: "Entrar — Nexia DETRAN" }] }),
});

type Employment = "carteira_assinada" | "autonomo" | "estudante" | "trabalha_estuda" | "desempregado" | "outro";

const employmentToDb: Record<string, string> = {
  carteira_assinada: "carteira_assinada",
  autonomo: "autonomo",
  estudante: "nao_trabalha",
  trabalha_estuda: "carteira_assinada",
  desempregado: "nao_trabalha",
  outro: "nao_trabalha",
};

function AuthPage() {
  const navigate = useNavigate();
  const [portal, setPortal] = useState<"user" | "admin">("user");
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [name, setName] = useState("");
  const [cpf, setCpf] = useState("");
  const [phone, setPhone] = useState("");
  const [employment, setEmployment] = useState<Employment | "">("");
  const [employmentOther, setEmploymentOther] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [legacyUserModal, setLegacyUserModal] = useState(false);
  const [legacyEmail, setLegacyEmail] = useState("");
  const [legacyPassword, setLegacyPassword] = useState("");
  const [legacyConfirmPassword, setLegacyConfirmPassword] = useState("");
  const [legacyLoading, setLegacyLoading] = useState(false);
  const [showLegacyPw, setShowLegacyPw] = useState(false);
  const [showLegacyConfirmPw, setShowLegacyConfirmPw] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: portal === "admin" ? "/admin" : "/" });
    });
  }, [navigate, portal]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    try {
      if (mode === "signup") {
        if (!name.trim() || !cpf.trim() || !phone.trim() || !employment) {
          throw new Error("Preencha todos os campos obrigatórios.");
        }
        if (!isValidCpf(cpf)) {
          throw new Error("CPF inválido. Verifique os números digitados.");
        }
        if (employment === "outro" && !employmentOther.trim()) {
          throw new Error("Descreva sua situação profissional.");
        }

        let isLegacyEmail = false;
        let legacyUserEmail = email;
        try {
          const { checkLegacyAccessSecure } = await import("@/lib/admin-operations.server");
          const status = await checkLegacyAccessSecure({ data: { input: email } });
          if (status.found && status.isMigratedUser && status.needsFirstAccess) {
            isLegacyEmail = true;
            legacyUserEmail = status.userEmail || email;
          }
        } catch (checkErr) {
          console.error("Erro ao verificar email:", checkErr);
        }

        if (isLegacyEmail) {
          setLegacyEmail(legacyUserEmail);
          setLegacyPassword("");
          setLegacyConfirmPassword("");
          setLegacyUserModal(true);
          setLoading(false);
          return;
        }

        // Creates the account without a confirmation email (admin API with
        // email_confirm: true), then signs in to get an immediate session.
        const { createUserWithoutConfirmation } = await import("@/lib/admin-operations.server");
        const createRes = await createUserWithoutConfirmation({
          data: {
            email,
            password,
            display_name: name.trim().toUpperCase(),
            cpf,
            phone: phone || null,
            employment_status: employmentToDb[employment] ?? employment,
            employment_other: employment === "outro" ? employmentOther : null,
          },
        });
        if (!createRes.success) {
          if (createRes.alreadyRegistered) {
            throw new Error("Este e-mail já está cadastrado. Faça login.");
          }
          throw new Error(createRes.error || "Erro ao criar conta. Tente novamente.");
        }
        const sessionRes = await supabase.auth.signInWithPassword({ email, password });
        if (sessionRes.error) {
          throw sessionRes.error;
        }
        toast.success("Conta criada! Bem-vinda(o).");
        navigate({ to: "/" });
      } else {
        const { checkLoginBlockSecure } = await import("@/lib/admin-operations.server");
        const blockCheck = await checkLoginBlockSecure({ data: { input: email } });
        if (blockCheck.blocked) {
          throw new Error("Usuário bloqueado por excesso de tentativas de login incorretas. Redefina sua senha ou entre em contato com o suporte.");
        }

        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          const isInvalidCredentials =
            error.status === 400 ||
            error.message?.toLowerCase().includes("credentials") ||
            error.message?.toLowerCase().includes("grant") ||
            error.code === "invalid_credentials" ||
            error.code === "invalid_grant";

          if (isInvalidCredentials) {
            try {
              const { recordFailedLoginAttempt } = await import("@/lib/admin-operations.server");
              const res = await recordFailedLoginAttempt({ data: { input: email } });
              if (res.blocked) {
                throw new Error("Usuário bloqueado por excesso de tentativas de login incorretas. Redefina sua senha ou entre em contato com o suporte.");
              } else {
                const remaining = 3 - res.attempts;
                throw new Error(`E-mail/CPF ou senha incorretos. Você tem mais ${remaining} tentativa${remaining > 1 ? "s" : ""}.`);
              }
            } catch (blockErr) {
              console.error("Erro ao gravar tentativa de login:", blockErr);
              if (blockErr instanceof Error) {
                throw blockErr;
              }
            }

            setLoading(false);
            try {
              const { checkLegacyAccessSecure } = await import("@/lib/admin-operations.server");
              const status = await checkLegacyAccessSecure({ data: { input: email } });

              if (status.found && status.isMigratedUser && (status.needsNewPassword ?? status.needsFirstAccess)) {
                setLegacyEmail(status.userEmail);
                setLegacyPassword("");
                setLegacyConfirmPassword("");
                setLegacyUserModal(true);
                return;
              }
            } catch (checkErr) {
              console.error("Erro ao verificar status de migração:", checkErr);
            }
          }
          throw error;
        }

        // Reset attempts on successful login
        try {
          const { data: userData } = await supabase.auth.getUser();
          if (userData?.user?.id) {
            const { resetFailedLoginAttempts } = await import("@/lib/admin-operations.server");
            await resetFailedLoginAttempts({ data: { userId: userData.user.id } });
          }
        } catch (resetErr) {
          console.error("Erro ao resetar tentativas de login:", resetErr);
        }

        toast.success("Bem-vinda(o) de volta!");
        navigate({ to: portal === "admin" ? "/admin" : "/" });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro";
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  async function handleLegacyDefinePassword(e: React.FormEvent) {
    e.preventDefault();
    if (!legacyPassword || !legacyConfirmPassword) {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
      return;
    }
    if (legacyPassword !== legacyConfirmPassword) {
      toast.error("As senhas não coincidem.");
      return;
    }
    if (legacyPassword.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setLegacyLoading(true);
    try {
      const { registerLegacyUser } = await import("@/lib/admin-operations.server");
      const res = await registerLegacyUser({ data: { email: legacyEmail, password: legacyPassword } });

      if (!res.success) {
        throw new Error(res.error || "Erro ao definir senha.");
      }

      const { error: signInErr } = await supabase.auth.signInWithPassword({
        email: legacyEmail,
        password: legacyPassword,
      });

      if (signInErr) throw signInErr;

      // Fallback: ensure profile flags are cleared client-side
      await supabase
        .from("profiles")
        .update({ needs_new_password: false, is_first_access: false })
        .eq("id", (await supabase.auth.getUser()).data.user?.id ?? "");

      toast.success("Senha cadastrada com sucesso! Bem-vindo(a)!");
      setLegacyUserModal(false);
      navigate({ to: portal === "admin" ? "/admin" : "/" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao atualizar senha.");
    } finally {
      setLegacyLoading(false);
    }
  }

  async function onForgot(e: React.FormEvent) {
    e.preventDefault();
    setForgotLoading(true);
    try {
      const { requestPasswordResetSecure } = await import("@/lib/admin-operations.server");
      await requestPasswordResetSecure({ data: { input: forgotEmail } });
      toast.success("Senha temporária gerada e enviada para o seu e-mail!");
      setForgotOpen(false);
      setForgotEmail("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao redefinir senha.");
    } finally {
      setForgotLoading(false);
    }
  }

  const isAdminPortal = portal === "admin";

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <Link to="/" className="text-xs text-muted-foreground flex items-center gap-1 mb-3 hover:text-foreground">
        <ArrowLeft className="h-3 w-3" /> Início
      </Link>
      <Tabs value={portal} onValueChange={(v) => { setPortal(v as "user" | "admin"); setMode("login"); }}>
        <TabsList className="grid grid-cols-2 w-full h-11 mb-4">
          <TabsTrigger value="user" className="gap-2"><User className="h-4 w-4" /> Usuário</TabsTrigger>
          <TabsTrigger value="admin" className="gap-2"><ShieldCheck className="h-4 w-4" /> Gestão</TabsTrigger>
        </TabsList>

        <TabsContent value="user" />
        <TabsContent value="admin" />
      </Tabs>

      <div className={`glass rounded-3xl p-7 shadow-card border ${isAdminPortal ? "border-primary/40" : "border-border/40"}`}>
        {isAdminPortal && (
          <div className="mb-4 flex items-center gap-2 text-xs text-primary bg-primary/10 rounded-lg px-3 py-2">
            <ShieldCheck className="h-4 w-4" /> Acesso restrito à equipe de gestão.
          </div>
        )}
        <h1 className="text-2xl font-display font-bold mb-1">
          {mode === "login" ? "Entrar" : "Criar conta"}
        </h1>
        <p className="text-sm text-muted-foreground mb-5">
          {isAdminPortal
            ? "Acesso administrativo"
            : mode === "login"
            ? "Acesse sua conta"
            : "Cadastro rápido — comece agora"}
        </p>
        <form onSubmit={onSubmit} className="space-y-4">
          {mode === "signup" && !isAdminPortal && (
            <>
              <div>
                <Label htmlFor="name">Nome completo *</Label>
                <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="cpf">CPF *</Label>
                <Input id="cpf" required inputMode="numeric" placeholder="000.000.000-00" maxLength={14}
                  value={formatCpf(cpf)} onChange={(e) => setCpf(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="phone">Telefone *</Label>
                <Input id="phone" required inputMode="tel" placeholder="(00) 00000-0000"
                  value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="employment">Situação profissional *</Label>
                <Select value={employment} onValueChange={(v) => setEmployment(v as Employment)}>
                  <SelectTrigger id="employment" className="h-9 w-full text-base md:text-sm">
                    <SelectValue placeholder="Selecione…" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="carteira_assinada">CLT</SelectItem>
                    <SelectItem value="autonomo">Autônomo(a)</SelectItem>
                    <SelectItem value="estudante">Estudante</SelectItem>
                    <SelectItem value="trabalha_estuda">Trabalha e Estuda</SelectItem>
                    <SelectItem value="desempregado">Desempregado(a)</SelectItem>
                    <SelectItem value="outro">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {employment === "outro" && (
                <div>
                  <Label htmlFor="empOther">Descreva *</Label>
                  <Input id="empOther" required value={employmentOther}
                    onChange={(e) => setEmploymentOther(e.target.value)} />
                </div>
              )}

            </>
          )}
          <div>
            <Label htmlFor="email">E-mail *</Label>
            <Input id="email" type="email" required autoComplete="email"
              value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="password">Senha *</Label>
            <div className="relative">
              <Input id="password" type={showPw ? "text" : "password"} required minLength={6}
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                value={password} onChange={(e) => setPassword(e.target.value)} className="pr-10" />
              <button type="button" onClick={() => setShowPw((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={showPw ? "Ocultar senha" : "Mostrar senha"}>
                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {mode === "login" && (
              <button type="button" onClick={() => { setForgotEmail(email); setForgotOpen(true); }}
                className="mt-2 text-xs text-primary hover:underline">
                Esqueceu sua senha?
              </button>
            )}
          </div>
          {errorMsg && (
            <div role="alert" className="rounded-lg border border-destructive/40 bg-destructive/10 text-destructive text-sm px-3 py-2">
              {errorMsg}
            </div>
          )}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {mode === "login" ? "Entrar" : "Criar conta"}
          </Button>
        </form>
        {!isAdminPortal && (
          <button type="button" onClick={() => setMode(mode === "login" ? "signup" : "login")}
            className="mt-4 text-sm text-muted-foreground hover:text-foreground w-full text-center">
            {mode === "login" ? "Não tem conta? Criar uma" : "Já tem conta? Entrar"}
          </button>
        )}
      </div>

      <Dialog open={forgotOpen} onOpenChange={setForgotOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Recuperar senha</DialogTitle>
            <DialogDescription>
              Informe seu e-mail. Enviaremos um link seguro para você redefinir sua senha.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={onForgot} className="space-y-4">
            <div>
              <Label htmlFor="forgotEmail">E-mail</Label>
              <Input id="forgotEmail" type="email" required
                value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={forgotLoading} className="w-full">
                {forgotLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Enviar link
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={legacyUserModal} onOpenChange={setLegacyUserModal}>
        <DialogContent className="max-w-md rounded-3xl p-6 bg-[#0E111E] border border-zinc-800 text-center space-y-4">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold font-display flex items-center justify-center gap-2">
              Atualização de Sistema ⚡
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground pt-1 leading-relaxed">
              Olá! Identificamos que você é nosso aluno. O sistema passou por uma atualização. Por favor, crie uma senha de acesso para esta nova versão da plataforma.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleLegacyDefinePassword} className="space-y-4 text-left">
            <div>
              <Label htmlFor="legacyPassword">Nova Senha *</Label>
              <div className="relative mt-1">
                <Input
                  id="legacyPassword"
                  type={showLegacyPw ? "text" : "password"}
                  required
                  placeholder="Mínimo 6 caracteres"
                  value={legacyPassword}
                  onChange={(e) => setLegacyPassword(e.target.value)}
                  className="bg-background/40 border-border/30 pr-10"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowLegacyPw(!showLegacyPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  {showLegacyPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div>
              <Label htmlFor="legacyConfirmPassword">Confirme a Nova Senha *</Label>
              <div className="relative mt-1">
                <Input
                  id="legacyConfirmPassword"
                  type={showLegacyConfirmPw ? "text" : "password"}
                  required
                  placeholder="Repita a nova senha"
                  value={legacyConfirmPassword}
                  onChange={(e) => setLegacyConfirmPassword(e.target.value)}
                  className="bg-background/40 border-border/30 pr-10"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowLegacyConfirmPw(!showLegacyConfirmPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  {showLegacyConfirmPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" disabled={legacyLoading} className="w-full h-11 rounded-xl font-bold cursor-pointer mt-4">
              {legacyLoading ? (
                <Loader2 className="h-5 w-5 animate-spin mx-auto" />
              ) : (
                "Salvar e Acessar Plataforma"
              )}
            </Button>
          </form>

          <DialogFooter className="sm:justify-center">
            <Button variant="ghost" onClick={() => setLegacyUserModal(false)} className="text-xs cursor-pointer">
              Cancelar e voltar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
