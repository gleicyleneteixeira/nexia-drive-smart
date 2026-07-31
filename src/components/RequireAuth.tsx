import { useAuth } from "@/hooks/use-auth";
import { useNavigate, useLocation } from "@tanstack/react-router";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { isProfileExpired } from "@/lib/subscription";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, profile, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Redireciona para cadastro se não logado
        navigate({ to: "/cadastro", replace: true });
      } else {
        // Se for admin, ignora a cobrança e vai direto pro app
        if (isAdmin) {
          if (pathname.startsWith("/checkout")) {
            navigate({ to: "/app", replace: true });
          }
          return;
        }

        if (profile) {
          if (isProfileExpired(profile)) {
            // Se logado pendente de pagamento (ou expirado), força ir para o checkout
            if (!pathname.startsWith("/checkout")) {
              navigate({ to: "/checkout", replace: true });
            }
          } else {
            // Se ativo e tentar acessar checkout, vai direto pro app
            if (pathname.startsWith("/checkout")) {
              navigate({ to: "/app", replace: true });
            }
          }
        }
      }
    }
  }, [user, profile, isAdmin, loading, pathname, navigate]);

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
  if (profile && isProfileExpired(profile) && !pathname.startsWith("/checkout")) {
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


