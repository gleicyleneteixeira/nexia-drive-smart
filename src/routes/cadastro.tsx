import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Loader2, Eye, EyeOff, User, LogIn, ArrowLeft, Sparkles } from "lucide-react";
import { formatCpf, isValidCpf } from "@/lib/cpf";
import { formatPhone } from "@/lib/phone";
import { useAuth } from "@/hooks/use-auth";
import { isProfileExpired } from "@/lib/subscription";

export const Route = createFileRoute("/cadastro")({
  component: CadastroPage,
  head: () => ({ meta: [{ title: "Criar Conta — Nexia DETRAN" }] }),
});

type Employment =
  | "carteira_assinada"
  | "autonomo"
  | "estudante"
  | "trabalha_estuda"
  | "desempregado"
  | "outro";

const EMPLOYMENT_LABELS: Record<Employment, string> = {
  carteira_assinada: "CLT (Carteira Assinada)",
  autonomo: "Autônomo(a)",
  estudante: "Estudante",
  trabalha_estuda: "Trabalha e Estuda",
  desempregado: "Desempregado(a)",
  outro: "Outros",
};

const employmentToDb: Record<Employment, string> = {
  carteira_assinada: "carteira_assinada",
  autonomo: "autonomo",
  estudante: "nao_trabalha",
  trabalha_estuda: "carteira_assinada",
  desempregado: "nao_trabalha",
  outro: "nao_trabalha",
};

function maskEmail(email: string): string {
  if (!email) return "";
  const parts = email.split("@");
  if (parts.length !== 2) return email;
  const [local, domain] = parts;
  if (local.length <= 3) {
    return local[0] + "***@" + domain;
  }
  return local.slice(0, 2) + "*".repeat(local.length - 3) + local[local.length - 1] + "@" + domain;
}

function CadastroPage() {
  const navigate = useNavigate();
  const { user, profile, loading: authLoading } = useAuth();
  
  const [mode, setMode] = useState<"signup" | "login">("signup");
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
  const [forgotStep, setForgotStep] = useState<"choose" | "phone_input" | "phone_confirm" | "cpf_input" | "cpf_confirm" | "email_input">("choose");
  const [forgotPhone, setForgotPhone] = useState("");
  const [forgotPhoneLoading, setForgotPhoneLoading] = useState(false);
  const [forgotPhoneResult, setForgotPhoneResult] = useState<{ last4: string; email: string } | null>(null);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotCpf, setForgotCpf] = useState("");
  const [forgotCpfLoading, setForgotCpfLoading] = useState(false);
  const [forgotCpfResult, setForgotCpfResult] = useState<{ email: string; last4Phone: string } | null>(null);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [legacyUserModal, setLegacyUserModal] = useState(false);
  const [legacyEmail, setLegacyEmail] = useState("");
  const [legacyPassword, setLegacyPassword] = useState("");
  const [legacyConfirmPassword, setLegacyConfirmPassword] = useState("");
  const [legacyLoading, setLegacyLoading] = useState(false);
  const [showLegacyPw, setShowLegacyPw] = useState(false);
  const [showLegacyConfirmPw, setShowLegacyConfirmPw] = useState(false);

  // Redirect if user is already logged in
  useEffect(() => {
    if (!authLoading && user && profile) {
      const isMigrated = !!(profile as any).is_migrated;
      const hasActiveAccess = isMigrated || (profile as any).access_status === "active";
      if (hasActiveAccess || (profile.status === "ativo" && !isProfileExpired(profile))) {
        navigate({ to: "/app", replace: true });
      } else if (profile.status === "pendente_pagamento" || isProfileExpired(profile)) {
        navigate({ to: "/checkout", replace: true });
      }
    }
  }, [user, profile, authLoading, navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    
    try {
      if (mode === "signup") {
        if (typeof window !== "undefined") localStorage.removeItem("nexia:gift_opened");
        if (!name.trim() || !cpf.trim() || !phone.trim() || !email.trim() || !password.trim()) {
          throw new Error("Preencha todos os campos obrigatórios.");
        }
        if (!isValidCpf(cpf)) {
          throw new Error("CPF inválido. Verifique os números digitados.");
        }
        if (!employment) {
          throw new Error("Selecione sua situação profissional.");
        }
        if (employment === "outro" && !employmentOther.trim()) {
          throw new Error("Descreva sua situação profissional.");
        }

        // Pre-check: CPF already exists?
        try {
          const { checkCpfExists } = await import("@/lib/admin-operations.server");
          const { exists } = await checkCpfExists({ data: { cpf } });
          if (exists) {
            throw new Error("Este CPF já está cadastrado. Utilize outro CPF ou faça login com a conta existente.");
          }
        } catch (cpfErr) {
          if (cpfErr instanceof Error && cpfErr.message.includes("CPF já está cadastrado")) throw cpfErr;
          console.error("Erro ao verificar CPF:", cpfErr);
        }
        
        // Pre-check: Email already exists in profiles (legacy client check)?
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
          console.error("Erro ao verificar email existente:", checkErr);
        }

        if (isLegacyEmail) {
          setLegacyEmail(legacyUserEmail);
          setLegacyPassword("");
          setLegacyConfirmPassword("");
          setLegacyUserModal(true);
          setLoading(false);
          return;
        }
        
        // Register in Supabase auth with mock fallback
        let signUpData = null;
        let authError: any = null;

        try {
          const res = await supabase.auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo: window.location.origin,
              data: {
                display_name: name,
                cpf,
                phone,
                employment_status: employmentToDb[employment as Employment] ?? employment,
                employment_other: employment === "outro" ? employmentOther.trim() : null,
                status: "pendente_pagamento"
              },
            },
          });
          signUpData = res.data;
          authError = res.error;
        } catch (err) {
          authError = err;
        }
        
        if (authError) {
          const rawMsg = authError?.message || authError?.error_description || "";
          let msg: string;
          let isLegacyUser = false;
          if (rawMsg.includes("CPF") || rawMsg.includes("profiles_cpf_unique")) {
            msg = "Este CPF já está cadastrado. Utilize outro CPF ou faça login com a conta existente.";
          } else if (rawMsg.includes("already registered") || rawMsg.includes("already been registered")) {
            isLegacyUser = true;
            try {
              await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`
              });
            } catch (resetErr) {
              console.error("Erro ao enviar reset de senha:", resetErr);
            }
            msg = "Seu e-mail já possui cadastro em nosso sistema de alunos! Enviamos uma notificação para o seu e-mail com instruções para você criar/redefinir sua nova senha. Verifique sua caixa de entrada e de spam.";
          } else if (rawMsg.includes("Database error") || rawMsg.includes("500")) {
            msg = "Erro ao criar conta. Verifique se seus dados não estão duplicados ou tente novamente.";
          } else {
            msg = rawMsg || "Erro ao criar conta. Tente novamente.";
          }
          setErrorMsg(msg);
          if (isLegacyUser) {
            toast.info(msg, { duration: 8000 });
          } else {
            toast.error(msg);
          }
          setLoading(false);
          return;
        }

        if (signUpData?.user && signUpData?.session) {
          const createdAt = new Date(signUpData.user.created_at).getTime();
          const now = Date.now();
          if (now - createdAt > 10000) {
            await supabase.auth.signOut();
            setErrorMsg("Este e-mail já está cadastrado. Faça login ou use outro e-mail.");
            toast.error("Este e-mail já está cadastrado.");
            setMode("login");
            setPassword("");
            setLoading(false);
            return;
          }
          toast.success("Cadastro realizado com sucesso!");
          navigate({ to: "/checkout" });
          setLoading(false);
          return;
        }

        if (signUpData?.user && !signUpData?.session) {
          const hasIdentities = signUpData.user.identities && signUpData.user.identities.length > 0;
          if (!hasIdentities) {
            setErrorMsg("Este e-mail já está cadastrado. Faça login ou use outro e-mail.");
            toast.error("Este e-mail já está cadastrado.");
            setMode("login");
            setPassword("");
            setLoading(false);
            return;
          }

          // Auto-confirm email and sign in
          try {
            const { autoConfirmEmail } = await import("@/lib/admin-operations.server");
            await autoConfirmEmail({ data: { userId: signUpData.user.id } });
          } catch (confirmErr) {
            console.error("Auto-confirm error:", confirmErr);
          }

          const { error: signInErr } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (signInErr) {
            toast.success("Conta criada! Verifique seu e-mail para confirmar.");
            setMode("login");
            setPassword("");
            setLoading(false);
            return;
          }

          toast.success("Cadastro realizado com sucesso!");
          navigate({ to: "/checkout" });
          setLoading(false);
          return;
        }

          toast.success("Cadastro realizado com sucesso!");
          if (typeof window !== "undefined") {
            localStorage.removeItem("nexia:gift_opened");
          }
          navigate({ to: "/checkout" });
      } else {
        // Pre-check for legacy/migrated users who need a new password
        let isLegacyNeedsPassword = false;
        let legacyUserEmail = email;
        try {
          const { checkLegacyAccessSecure } = await import("@/lib/admin-operations.server");
          const status = await checkLegacyAccessSecure({ data: { input: email } });
          if (status.found && status.isMigratedUser && status.needsFirstAccess) {
            isLegacyNeedsPassword = true;
            legacyUserEmail = status.userEmail || email;
          }
        } catch (checkErr) {
          console.error("Erro ao verificar status de migração:", checkErr);
        }

        if (isLegacyNeedsPassword) {
          setLegacyEmail(legacyUserEmail);
          setLegacyPassword("");
          setLegacyConfirmPassword("");
          setLegacyUserModal(true);
          setLoading(false);
          return;
        }

        // Resolve email dynamically from CPF if login input matches CPF
        let loginEmail = email;
        try {
          const { checkLegacyAccessSecure } = await import("@/lib/admin-operations.server");
          const status = await checkLegacyAccessSecure({ data: { input: email } });
          if (status.found && status.userEmail) {
            loginEmail = status.userEmail;
          }
        } catch (err) {
          console.error("Erro ao resolver e-mail do CPF:", err);
        }

        // Sign in with resolved e-mail
        let signInError: any = null;
        try {
          const { error } = await supabase.auth.signInWithPassword({ email: loginEmail, password });
          signInError = error;
        } catch (err) {
          signInError = err;
        }

        if (signInError) {
          const isInvalidCredentials =
            signInError.status === 400 ||
            signInError.message?.toLowerCase().includes("credentials") ||
            signInError.message?.toLowerCase().includes("grant") ||
            signInError.code === "invalid_credentials" ||
            signInError.code === "invalid_grant";

          if (isInvalidCredentials) {
            try {
              const { checkLegacyAccessSecure } = await import("@/lib/admin-operations.server");
              const status = await checkLegacyAccessSecure({ data: { input: email } });

              if (status.found && status.isMigratedUser && status.needsFirstAccess) {
                setLegacyEmail(status.userEmail);
                setLegacyPassword("");
                setLegacyConfirmPassword("");
                setLegacyUserModal(true);
                setLoading(false);
                return;
              } else {
                const { checkIfEmailExists } = await import("@/lib/admin-operations.server");
                const { exists } = await checkIfEmailExists({ data: { email: loginEmail } });
                if (exists) {
                  const msg = "E-mail/CPF ou senha incorretos.";
                  setErrorMsg(msg);
                  toast.error(msg);
                  setLoading(false);
                  return;
                }
              }
            } catch (checkErr) {
              console.error("Erro ao verificar email existente:", checkErr);
            }

            const msg = "Não encontramos nenhum cadastro com este e-mail. Preencha seus dados abaixo para criar sua conta!";
            toast.info(msg, { duration: 6000 });
            setMode("signup");
            setLoading(false);
            return;
          }

          const msg = "Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.";
          setErrorMsg(msg);
          toast.error(msg);
          setLoading(false);
          return;
        }
        
        toast.success("Bem-vinda(o) de volta!");
        // Navigation will be handled by useEffect above
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Ocorreu um erro no processamento.";
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  async function onForgot(e: React.FormEvent) {
    e.preventDefault();
    setForgotLoading(true);
    try {
      const { sendMigrationResetEmail } = await import("@/lib/admin-operations.server");
      await sendMigrationResetEmail({ data: { email: forgotEmail, origin: window.location.origin } });
      toast.success("Enviamos um link de redefinição para seu e-mail.");
      setForgotOpen(false);
      resetForgotState();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro");
    } finally {
      setForgotLoading(false);
    }
  }

  async function onForgotPhoneLookup(e: React.FormEvent) {
    e.preventDefault();
    setForgotPhoneLoading(true);
    try {
      const { lookupPhoneForReset } = await import("@/lib/admin-operations.server");
      const result = await lookupPhoneForReset({ data: { phone: forgotPhone } });
      if (!result.found) {
        toast.error("Telefone não encontrado. Tente recuperar via e-mail.");
        setForgotStep("choose");
        setForgotPhone("");
        return;
      }
      setForgotPhoneResult({ last4: result.last4, email: result.email });
      setForgotStep("phone_confirm");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao buscar telefone.");
    } finally {
      setForgotPhoneLoading(false);
    }
  }

  async function onForgotPhoneSend() {
    if (!forgotPhoneResult) return;
    setForgotLoading(true);
    try {
      const { sendMigrationResetEmail } = await import("@/lib/admin-operations.server");
      await sendMigrationResetEmail({ data: { email: forgotPhoneResult.email, origin: window.location.origin } });
      toast.success("Link de redefinição enviado com sucesso para o e-mail cadastrado!");
      setForgotOpen(false);
      resetForgotState();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao enviar e-mail.");
    } finally {
      setForgotLoading(false);
    }
  }

  async function onForgotCpfLookup(e: React.FormEvent) {
    e.preventDefault();
    setForgotCpfLoading(true);
    try {
      const { lookupCpfForReset } = await import("@/lib/admin-operations.server");
      const result = await lookupCpfForReset({ data: { cpf: forgotCpf } });
      if (!result.found) {
        toast.error("CPF não encontrado. Tente recuperar por outro método.");
        setForgotStep("choose");
        setForgotCpf("");
        return;
      }
      setForgotCpfResult({ email: result.email, last4Phone: result.last4Phone });
      setForgotStep("cpf_confirm");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao buscar CPF.");
    } finally {
      setForgotCpfLoading(false);
    }
  }

  async function onForgotCpfSend() {
    if (!forgotCpfResult) return;
    setForgotLoading(true);
    try {
      const { sendMigrationResetEmail } = await import("@/lib/admin-operations.server");
      await sendMigrationResetEmail({ data: { email: forgotCpfResult.email, origin: window.location.origin } });
      toast.success("Link de redefinição enviado com sucesso para o e-mail cadastrado!");
      setForgotOpen(false);
      resetForgotState();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao enviar e-mail.");
    } finally {
      setForgotLoading(false);
    }
  }

  async function handleDefinePassword(e: React.FormEvent) {
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

      // Log in immediately
      const { error: signInErr } = await supabase.auth.signInWithPassword({
        email: legacyEmail,
        password: legacyPassword
      });

      if (signInErr) throw signInErr;

      toast.success("Senha cadastrada com sucesso! Bem-vindo(a)!");
      setLegacyUserModal(false);
      navigate({ to: "/app" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao atualizar senha.");
    } finally {
      setLegacyLoading(false);
    }
  }

  function resetForgotState() {
    setForgotStep("choose");
    setForgotPhone("");
    setForgotPhoneResult(null);
    setForgotEmail("");
    setForgotCpf("");
    setForgotCpfResult(null);
  }

  return (
    <div className="mx-auto max-w-md px-4 py-10 md:py-16">
      <Link to="/" className="text-xs text-muted-foreground flex items-center gap-1 mb-6 hover:text-foreground">
        <ArrowLeft className="h-3 w-3" /> Voltar para o início
      </Link>

      <div className="glass rounded-3xl p-7 md:p-8 shadow-card border border-border/40">
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary-glow">
              {mode === "signup" ? <User className="h-6 w-6" /> : <LogIn className="h-6 w-6" />}
            </div>
          </div>

          <h1 className="text-2xl md:text-3xl font-display font-bold text-center mb-1">
            {mode === "signup" ? "Criar Conta" : "Fazer Login"}
          </h1>
        <p className="text-sm text-muted-foreground text-center mb-6">
          {mode === "signup" ? "Cadastre-se para acessar o simulador" : "Insira seus dados para continuar"}
        </p>

        {errorMsg && (
          <div className="mb-4 text-xs text-destructive bg-destructive/10 rounded-xl px-4 py-3 border border-destructive/20 font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          {mode === "signup" && (
            <>
              <div>
                <Label htmlFor="name">Nome completo *</Label>
                <Input 
                  id="name" 
                  required 
                  placeholder="Seu nome"
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  className="bg-background/40 border-border/30"
                />
              </div>
              <div>
                <Label htmlFor="cpf">CPF *</Label>
                <Input 
                  id="cpf" 
                  required 
                  inputMode="numeric" 
                  placeholder="000.000.000-00" 
                  maxLength={14}
                  value={formatCpf(cpf)} 
                  onChange={(e) => setCpf(e.target.value)} 
                  className="bg-background/40 border-border/30"
                />
              </div>
              <div>
                <Label htmlFor="phone">WhatsApp (Telefone) *</Label>
                <Input 
                  id="phone" 
                  required 
                  inputMode="tel" 
                  placeholder="(00) 90000-0000"
                  maxLength={15}
                  value={formatPhone(phone)} 
                  onChange={(e) => setPhone(e.target.value)} 
                  className="bg-background/40 border-border/30"
                />
              </div>
              <div>
                <Label htmlFor="employment">Situação profissional *</Label>
                <Select value={employment} onValueChange={(v) => setEmployment(v as Employment)}>
                  <SelectTrigger id="employment" className="h-11 w-full bg-background/40 border-border/30">
                    <SelectValue placeholder="Selecione…" />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(EMPLOYMENT_LABELS) as Employment[]).map((key) => (
                      <SelectItem key={key} value={key}>
                        {EMPLOYMENT_LABELS[key]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {employment === "outro" && (
                <div>
                  <Label htmlFor="employmentOther">Descreva sua situação *</Label>
                  <Input
                    id="employmentOther"
                    value={employmentOther}
                    onChange={(e) => setEmploymentOther(e.target.value)}
                    placeholder="Descreva sua situação"
                    className="bg-background/40 border-border/30"
                  />
                </div>
              )}
            </>
          )}

          <div>
            <Label htmlFor="email">
              {mode === "signup" ? "E-mail *" : "CPF ou E-mail *"}
            </Label>
            <Input 
              id="email" 
              type={mode === "signup" ? "email" : "text"} 
              required 
              placeholder={mode === "signup" ? "seuemail@exemplo.com" : "000.000.000-00 ou seuemail@exemplo.com"}
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="bg-background/40 border-border/30"
            />
          </div>

          <div>
            <Label htmlFor="password">Senha *</Label>
            <div className="relative">
              <Input 
                id="password" 
                type={showPw ? "text" : "password"} 
                required 
                placeholder={mode === "signup" ? "Crie uma senha" : "Digite sua senha"}
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="bg-background/40 border-border/30"
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {mode === "login" && (
              <button type="button" onClick={() => { setForgotEmail(email); setForgotStep("choose"); setForgotPhone(""); setForgotPhoneResult(null); setForgotOpen(true); }}
                className="mt-2 text-xs text-primary hover:underline cursor-pointer">
                Esqueceu sua senha?
              </button>
            )}
          </div>

          <Button type="submit" disabled={loading} className="w-full h-12 rounded-xl font-bold cursor-pointer mt-2">
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin mx-auto" />
            ) : mode === "signup" ? (
              "Cadastrar e Ir para o Simulador"
            ) : (
              "Acessar Minha Conta"
            )}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm border-t border-border/20 pt-5">
          {mode === "signup" ? (
            <p className="text-muted-foreground">
              Já tem uma conta?{" "}
              <button onClick={() => setMode("login")} className="text-primary hover:underline font-semibold cursor-pointer">
                Fazer login
              </button>
            </p>
          ) : (
            <p className="text-muted-foreground">
              Não tem uma conta ainda?{" "}
              <button onClick={() => setMode("signup")} className="text-primary hover:underline font-semibold cursor-pointer">
                Cadastrar-se
              </button>
            </p>
          )}
        </div>

        {typeof window !== "undefined" && 
          (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" || import.meta.env.DEV) && (
          <div className="mt-6 border-t border-border/20 pt-4 text-center">
            <p className="text-xs text-warning mb-2 font-semibold">⚠️ Modo de Desenvolvimento Ativo</p>
            <Button
              type="button"
              variant="outline"
              className="w-full text-xs text-warning border-warning/30 hover:bg-warning/10 cursor-pointer"
              onClick={() => {
                localStorage.setItem("nexia:use_mock_mode", "true");
                const mockId = "00000000-0000-0000-0000-" + Math.floor(Math.random() * 100000000000).toString().padStart(12, "0");
                const mockUser = { id: mockId, email: "tester@nexiadrive.com.br" };
                const mockProfile = {
                  id: mockId,
                  display_name: "Testador Nexia",
                  email: "tester@nexiadrive.com.br",
                  phone: "(11) 99999-9999",
                  cpf: "000.000.000-00",
                  status: "ativo",
                };
                localStorage.setItem("nexia:mock_user", JSON.stringify(mockUser));
                localStorage.setItem("nexia:mock_profile", JSON.stringify(mockProfile));
                localStorage.setItem("nexia:mock_is_admin", "false");
                toast.success("Modo Simulação offline ativado!");
                window.location.href = "/app";
              }}
            >
              Entrar em Modo Simulação (Bypass Login)
            </Button>
          </div>
        )}
      </div>

      <Dialog open={forgotOpen} onOpenChange={(open) => { setForgotOpen(open); if (!open) resetForgotState(); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Recuperar senha</DialogTitle>
            <DialogDescription>
              {forgotStep === "choose" && "Escolha como deseja recuperar sua senha."}
              {forgotStep === "phone_input" && "Informe o telefone que você cadastrou."}
              {forgotStep === "phone_confirm" && "Confirme seus dados abaixo."}
              {forgotStep === "cpf_input" && "Informe o CPF que você cadastrou."}
              {forgotStep === "cpf_confirm" && "Confirme seus dados abaixo."}
              {forgotStep === "email_input" && "Informe seu e-mail. Enviaremos um link seguro para redefinir sua senha."}
            </DialogDescription>
          </DialogHeader>

          {forgotStep === "choose" && (
            <div className="space-y-3 pt-2">
              <button type="button" onClick={() => setForgotStep("phone_input")}
                className="w-full flex items-center gap-3 p-4 rounded-xl border border-border/40 bg-background/40 hover:bg-accent/50 transition-colors text-left cursor-pointer">
                <span className="text-2xl">📱</span>
                <div>
                  <p className="font-semibold text-sm">Recuperar via Telefone</p>
                  <p className="text-xs text-muted-foreground">Informe o telefone cadastrado</p>
                </div>
              </button>
              <button type="button" onClick={() => setForgotStep("cpf_input")}
                className="w-full flex items-center gap-3 p-4 rounded-xl border border-border/40 bg-background/40 hover:bg-accent/50 transition-colors text-left cursor-pointer">
                <span className="text-2xl">🪪</span>
                <div>
                  <p className="font-semibold text-sm">Recuperar via CPF</p>
                  <p className="text-xs text-muted-foreground">Informe o CPF cadastrado</p>
                </div>
              </button>
              <button type="button" onClick={() => setForgotStep("email_input")}
                className="w-full flex items-center gap-3 p-4 rounded-xl border border-border/40 bg-background/40 hover:bg-accent/50 transition-colors text-left cursor-pointer">
                <span className="text-2xl">📧</span>
                <div>
                  <p className="font-semibold text-sm">Recuperar via E-mail</p>
                  <p className="text-xs text-muted-foreground">Receba o link no seu e-mail</p>
                </div>
              </button>
            </div>
          )}

          {forgotStep === "phone_input" && (
            <form onSubmit={onForgotPhoneLookup} className="space-y-4">
              <div>
                <Label htmlFor="forgotPhone">Telefone</Label>
                <Input id="forgotPhone" type="tel" required placeholder="(00) 00000-0000"
                  value={forgotPhone} onChange={(e) => setForgotPhone(e.target.value)} />
              </div>
              <DialogFooter className="gap-2 sm:gap-0">
                <Button type="button" variant="outline" onClick={() => setForgotStep("choose")}>Voltar</Button>
                <Button type="submit" disabled={forgotPhoneLoading}>
                  {forgotPhoneLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Buscar
                </Button>
              </DialogFooter>
            </form>
          )}

          {forgotStep === "phone_confirm" && forgotPhoneResult && (
            <div className="space-y-4">
              <div className="rounded-xl bg-background/40 border border-border/30 p-4 space-y-2">
                <p className="text-sm text-muted-foreground">Últimos 4 dígitos do telefone:</p>
                <p className="text-lg font-bold tracking-widest">****{forgotPhoneResult.last4}</p>
                <p className="text-sm text-muted-foreground mt-2">Link será enviado para o e-mail:</p>
                <p className="text-sm font-semibold">{maskEmail(forgotPhoneResult.email)}</p>
              </div>
              <DialogFooter className="gap-2 sm:gap-0">
                <Button type="button" variant="outline" onClick={() => { setForgotStep("phone_input"); setForgotPhoneResult(null); }}>Outro telefone</Button>
                <Button type="button" disabled={forgotLoading} onClick={onForgotPhoneSend}>
                  {forgotLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Enviar link
                </Button>
              </DialogFooter>
            </div>
          )}

          {forgotStep === "cpf_input" && (
            <form onSubmit={onForgotCpfLookup} className="space-y-4">
              <div>
                <Label htmlFor="forgotCpf">CPF</Label>
                <Input id="forgotCpf" type="text" required placeholder="000.000.000-00" maxLength={14}
                  value={formatCpf(forgotCpf)} onChange={(e) => setForgotCpf(e.target.value)} />
              </div>
              <DialogFooter className="gap-2 sm:gap-0">
                <Button type="button" variant="outline" onClick={() => setForgotStep("choose")}>Voltar</Button>
                <Button type="submit" disabled={forgotCpfLoading}>
                  {forgotCpfLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Buscar
                </Button>
              </DialogFooter>
            </form>
          )}

          {forgotStep === "cpf_confirm" && forgotCpfResult && (
            <div className="space-y-4">
              <div className="rounded-xl bg-background/40 border border-border/30 p-4 space-y-2">
                <p className="text-sm text-muted-foreground">Telefone de contato associado:</p>
                <p className="text-md font-semibold">****{forgotCpfResult.last4Phone}</p>
                <p className="text-sm text-muted-foreground mt-2">Link será enviado para o e-mail:</p>
                <p className="text-sm font-semibold">{maskEmail(forgotCpfResult.email)}</p>
              </div>
              <DialogFooter className="gap-2 sm:gap-0">
                <Button type="button" variant="outline" onClick={() => { setForgotStep("cpf_input"); setForgotCpfResult(null); }}>Outro CPF</Button>
                <Button type="button" disabled={forgotLoading} onClick={onForgotCpfSend}>
                  {forgotLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Enviar link
                </Button>
              </DialogFooter>
            </div>
          )}

          {forgotStep === "email_input" && (
            <form onSubmit={onForgot} className="space-y-4">
              <div>
                <Label htmlFor="forgotEmail">E-mail</Label>
                <Input id="forgotEmail" type="email" required
                  value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} />
              </div>
              <DialogFooter className="gap-2 sm:gap-0">
                <Button type="button" variant="outline" onClick={() => setForgotStep("choose")}>Voltar</Button>
                <Button type="submit" disabled={forgotLoading}>
                  {forgotLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Enviar link
                </Button>
              </DialogFooter>
            </form>
          )}
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

          <form onSubmit={handleDefinePassword} className="space-y-4 text-left">
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
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer animate-fade-in"
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
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer animate-fade-in"
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
