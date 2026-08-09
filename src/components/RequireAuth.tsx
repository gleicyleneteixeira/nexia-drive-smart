import { useAuth } from "@/hooks/use-auth";
import { useNavigate, useLocation } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { isProfileExpired } from "@/lib/subscription";
import { supabase } from "@/integrations/supabase/client";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, profile, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;

  // Evita o "pisca e fica em branco" logo após cadastro/login: se ainda não
  // temos o user no contexto mas a sessão já existe no Supabase, esperamos o
  // sincronismo em vez de mandar de volta para o /cadastro.
  const [bounced, setBounced] = useState(false);
  const bounceUser = useCallback(async () => {
    const { data } = await supabase.auth.getSession();
    if (data.session) return;
    navigate({ to: "/cadastro", replace: true });
    setBounced(true);
  }, [navigate]);

  useEffect(() => {
    if (!loading && !user && !bounced) {
      bounceUser();
    }
  }, [loading, user, bounced, bounceUser]);

  const trialCompleted = typeof window !== "undefined" && user ? localStorage.getItem(`nexia:trial_completed:${user.id}`) === "true" : false;
  const isTrialSimulado = pathname === "/simulado-demo" && !trialCompleted;

  useEffect(() => {
    if (loading) return;
    if (!user) {
      // O redirect para o cadastro é feito pelo bounceUser acima (com checagem
      // de sessão), então não seguimos adiante aqui.
      return;
    }
    // Se for admin, ignora a cobrança e vai direto pro app
    if (isAdmin) {
      if (pathname.startsWith("/checkout")) {
        navigate({ to: "/app", replace: true });
      }
      return;
    }

    if (profile) {
      if (profile.needs_new_password) {
        navigate({ to: "/reset-password", replace: true });
        return;
      }

      if (isProfileExpired(profile)) {
        // Se logado pendente de pagamento (ou expirado), força ir para o checkout
        if (!pathname.startsWith("/checkout")) {
          if (isTrialSimulado) {
            // Permitir acesso ao simulado para fazer o teste grátis
          } else {
            navigate({ to: "/checkout", replace: true });
          }
        }
      } else {
        // Se ativo e tentar acessar checkout, vai direto pro app
        if (pathname.startsWith("/checkout")) {
          navigate({ to: "/app", replace: true });
        }
      }
    }
  }, [user, profile, isAdmin, loading, pathname, navigate, isTrialSimulado]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-sm text-muted-foreground">Carregando seus dados...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  // Se for admin, libera tudo
  if (isAdmin) {
    return <>{children}</>;
  }

  // Bloqueia renderização das rotas se estiver no status pendente ou expirado tentando acessar o app
  if (profile && isProfileExpired(profile) && !pathname.startsWith("/checkout") && !isTrialSimulado) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-sm text-muted-foreground">Redirecionando...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}


