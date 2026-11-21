import { useQuery } from "@tanstack/react-query";
import { Loader2, Trophy } from "lucide-react";
import { fetchUserPointsRanking } from "@/lib/ranking.functions";

export function RankingUsuarios() {
  const { data: ranking = [], isLoading, isError } = useQuery({
    queryKey: ["ranking-usuarios-pontos"],
    queryFn: () => fetchUserPointsRanking(),
  });

  return (
    <section className="glass mx-auto max-w-4xl space-y-3 rounded-3xl p-4 shadow-card sm:p-5">
      <div>
        <h2 className="flex items-center gap-2 font-display text-lg font-bold">
          <Trophy className="h-5 w-5 text-warning" />
          Ranking de usuários
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Classificação pelo total de pontos acumulados.
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-4">
          <Loader2 className="h-5 w-5 animate-spin text-primary" aria-label="Carregando ranking" />
        </div>
      ) : isError ? (
        <p role="alert" className="rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-xs text-muted-foreground">
          Não foi possível carregar o ranking agora.
        </p>
      ) : ranking.length === 0 ? (
        <p className="rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-muted-foreground">
          Ainda não há pontos acumulados.
        </p>
      ) : (
        <ol className="space-y-2">
          {ranking.map((entry, index) => (
            <li
              key={entry.userId}
              className={`flex items-center gap-3 rounded-2xl border p-3 ${
                entry.isCurrentUser
                  ? "border-primary/40 bg-primary/10"
                  : "border-white/10 bg-white/5"
              }`}
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white/10 text-sm font-bold">
                {index + 1}
              </span>
              <span className="min-w-0 flex-1 truncate text-sm font-semibold">
                {entry.displayName}
                {entry.isCurrentUser && (
                  <span className="ml-2 text-[10px] font-bold uppercase text-primary">Você</span>
                )}
              </span>
              <span className="shrink-0 text-sm font-bold text-primary">
                {entry.points.toLocaleString("pt-BR")} pts
              </span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
