import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Eye, EyeOff, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/reset-password")({
  component: ResetPasswordPage,
  head: () => ({ meta: [{ title: "Redefinir senha — Nexia DETRAN" }] }),
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        toast.error("Link inválido ou expirado. Solicite um novo.");
      }
      setReady(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      toast.error("As senhas não coincidem.");
      return;
    }
    if (password.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres.");
      return;
    }
    setLoading(true);
    try {
      const { data: { user }, error: userErr } = await supabase.auth.getUser();
      if (userErr || !user) throw new Error("Sessão inválida. Solicite um novo link.");

      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;

      const { error: profileErr } = await supabase
        .from("profiles")
        .update({ needs_new_password: false, is_first_access: false })
        .eq("id", user.id);

      if (profileErr) {
        console.error("Erro ao atualizar perfil:", profileErr);
        throw new Error("Senha salva, mas erro ao atualizar perfil. Tente novamente.");
      }

      toast.success("Senha atualizada com sucesso!");

      const { data: profile } = await supabase
        .from("profiles")
        .select("status, is_migrated")
        .eq("id", user.id)
        .maybeSingle();

      const isMigrated = !!profile?.is_migrated;
      if (isMigrated || profile?.status === "ativo") {
        navigate({ to: "/app", replace: true });
      } else {
        navigate({ to: "/checkout", replace: true });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao redefinir senha.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <Link to="/cadastro" className="text-xs text-muted-foreground flex items-center gap-1 mb-3 hover:text-foreground">
        <ArrowLeft className="h-3 w-3" /> Voltar
      </Link>
      <div className="glass rounded-3xl p-8 shadow-card">
        <h1 className="text-2xl font-display font-bold mb-1">Nova senha</h1>
        <p className="text-sm text-muted-foreground mb-6">Defina sua nova senha de acesso.</p>
        {!ready ? (
          <div className="flex justify-center py-6"><Loader2 className="h-5 w-5 animate-spin" /></div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <Label htmlFor="pw">Nova senha</Label>
              <div className="relative">
                <Input id="pw" type={showPw ? "text" : "password"} required minLength={6}
                  value={password} onChange={(e) => setPassword(e.target.value)} className="pr-10" />
                <button type="button" onClick={() => setShowPw((s) => !s)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div>
              <Label htmlFor="pw2">Confirmar senha</Label>
              <Input id="pw2" type={showPw ? "text" : "password"} required minLength={6}
                value={confirm} onChange={(e) => setConfirm(e.target.value)} />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Salvar nova senha
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
