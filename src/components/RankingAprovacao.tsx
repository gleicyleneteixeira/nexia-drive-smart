import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  type TooltipProps,
  CartesianGrid,
  Cell,
} from "recharts";

interface StateData {
  uf: string;
  nome: string;
  teorica: number;
  pratica: number;
  updated_at?: string;
}

const rawData: StateData[] = [
  { uf: "MG", nome: "Minas Gerais", teorica: 48.0, pratica: 60.0 },
  { uf: "RJ", nome: "Rio de Janeiro", teorica: 42.5, pratica: 46.7 },
  { uf: "SP", nome: "São Paulo", teorica: 38.0, pratica: 42.0 },
  { uf: "MT", nome: "Mato Grosso", teorica: 35.0, pratica: 39.7 },
  { uf: "PR", nome: "Paraná", teorica: 36.0, pratica: 38.5 },
  { uf: "RS", nome: "Rio Grande do Sul", teorica: 34.0, pratica: 37.0 },
  { uf: "BA", nome: "Bahia", teorica: 40.0, pratica: 36.5 },
  { uf: "PE", nome: "Pernambuco", teorica: 37.0, pratica: 35.0 },
  { uf: "CE", nome: "Ceará", teorica: 35.5, pratica: 34.0 },
  { uf: "GO", nome: "Goiás", teorica: 33.0, pratica: 32.5 },
  { uf: "SC", nome: "Santa Catarina", teorica: 31.0, pratica: 31.0 },
  { uf: "ES", nome: "Espírito Santo", teorica: 30.0, pratica: 29.5 },
  { uf: "DF", nome: "Distrito Federal", teorica: 32.0, pratica: 28.0 },
  { uf: "MA", nome: "Maranhão", teorica: 33.0, pratica: 27.0 },
  { uf: "PB", nome: "Paraíba", teorica: 29.0, pratica: 26.0 },
  { uf: "PA", nome: "Pará", teorica: 31.0, pratica: 25.0 },
  { uf: "MS", nome: "Mato Grosso do Sul", teorica: 28.0, pratica: 24.0 },
  { uf: "RN", nome: "Rio Grande do Norte", teorica: 27.0, pratica: 23.0 },
  { uf: "AL", nome: "Alagoas", teorica: 29.0, pratica: 22.0 },
  { uf: "PI", nome: "Piauí", teorica: 26.0, pratica: 20.0 },
  { uf: "TO", nome: "Tocantins", teorica: 25.0, pratica: 20.0 },
  { uf: "SE", nome: "Sergipe", teorica: 26.0, pratica: 19.0 },
  { uf: "RO", nome: "Rondônia", teorica: 24.0, pratica: 18.0 },
  { uf: "AM", nome: "Amazonas", teorica: 25.0, pratica: 17.0 },
  { uf: "AC", nome: "Acre", teorica: 22.0, pratica: 15.0 },
  { uf: "AP", nome: "Amapá", teorica: 20.0, pratica: 12.0 },
  { uf: "RR", nome: "Roraima", teorica: 18.0, pratica: 10.0 },
];

export function RankingAprovacao({ userUF }: { userUF?: string | null }) {
  const [activeTab, setActiveTab] = useState<"teorica" | "pratica">("teorica");
  const [metric, setMetric] = useState<"aprovacao" | "reprovacao">("reprovacao");
  const [showTable, setShowTable] = useState(false);
  const [data, setData] = useState<StateData[]>(rawData);
  const [dataSource, setDataSource] = useState<"loading" | "database" | "reference" | "error">("loading");

  useEffect(() => {
    let active = true;
    const loadData = async () => {
      const { data: db, error } = await supabase
        .from("detran_stats")
        .select("uf, nome, teorica, pratica, updated_at")
        .order("uf", { ascending: true });

      if (!active) return;
      if (error) {
        console.error("Falha ao carregar os índices estaduais:", error);
        setDataSource("error");
        return;
      }
      if (db && db.length > 0) {
        setData(db);
        setDataSource("database");
      } else {
        setDataSource("reference");
      }
    };

    void loadData().catch((error: unknown) => {
      if (!active) return;
      console.error("Falha ao carregar os índices estaduais:", error);
      setDataSource("error");
    });
    return () => {
      active = false;
    };
  }, []);

  // Os índices foram cadastrados nas colunas trocadas; normaliza para a prova exibida.
  const getSourceValue = (state: StateData, exam: "teorica" | "pratica") =>
    state[exam === "teorica" ? "pratica" : "teorica"];
  const getMetricValue = (state: StateData, exam = activeTab) => {
    const sourceValue = getSourceValue(state, exam);
    return metric === "aprovacao" ? 100 - sourceValue : sourceValue;
  };
  const sortedData = [...data].sort(
    (a, b) => getMetricValue(b) - getMetricValue(a),
  );
  const chartData = sortedData.map((state) => ({
    ...state,
    indice: getMetricValue(state),
  }));
  const latestUpdatedAt = data.reduce<string | null>(
    (latest, state) =>
      state.updated_at && (!latest || state.updated_at > latest)
        ? state.updated_at
        : latest,
    null,
  );
  const latestUpdateLabel = latestUpdatedAt
    ? new Date(latestUpdatedAt).toLocaleDateString("pt-BR")
    : null;
  const userStateDescription = userUF
    ? `Seu estado da prova (${userUF}) está destacado em dourado.`
    : "Informe a UF da prova no Perfil para destacar seu estado.";

  return (
    <section className="glass rounded-3xl p-4 shadow-card space-y-3 sm:p-5">
      {/* Cabeçalho + abas */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-display font-bold flex items-center gap-2">
            <span>📊</span> Ranking de {metric === "aprovacao" ? "Aprovação" : "Reprovação"} por Estado
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Percentual de candidatos {metric === "aprovacao" ? "aprovados" : "reprovados"}.{" "}
            {userStateDescription}
          </p>
          <p className="mt-1 text-[10px] text-muted-foreground">
            {dataSource === "database"
              ? latestUpdateLabel
                ? `Cadastro interno atualizado em ${latestUpdateLabel}; fonte externa não registrada.`
                : "Cadastro interno sem data ou fonte registrada."
              : dataSource === "error"
                ? "Falha ao carregar dados atuais; exibindo valores de referência."
                : dataSource === "reference"
                  ? "Exibindo valores de referência, sem fonte ou data oficial."
                  : "Verificando atualização dos dados..."}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <div className="flex rounded-xl border border-border/20 bg-black/30 p-1" aria-label="Tipo de índice">
            <button
              onClick={() => setMetric("aprovacao")}
              aria-pressed={metric === "aprovacao"}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                metric === "aprovacao"
                  ? "bg-emerald-500 text-slate-950 shadow-md"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Aprovação
            </button>
            <button
              onClick={() => setMetric("reprovacao")}
              aria-pressed={metric === "reprovacao"}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                metric === "reprovacao"
                  ? "bg-rose-500 text-slate-950 shadow-md"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Reprovação
            </button>
          </div>
          <div className="flex rounded-xl border border-border/20 bg-black/30 p-1" aria-label="Tipo de prova">
            <button
              onClick={() => setActiveTab("teorica")}
              aria-pressed={activeTab === "teorica"}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                activeTab === "teorica"
                  ? "bg-amber-500 text-slate-950 shadow-md"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Teórica
            </button>
            <button
              onClick={() => setActiveTab("pratica")}
              aria-pressed={activeTab === "pratica"}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                activeTab === "pratica"
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Prática
            </button>
          </div>
        </div>
      </div>

      {/* Gráfico */}
      <div className="h-48 w-full sm:h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
          >
            <defs>
              <linearGradient id="rankingBar" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
            <XAxis
              dataKey="uf"
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              tickLine={false}
              axisLine={false}
              interval={0}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              tickLine={false}
              axisLine={false}
              unit="%"
            />
            <Tooltip
              cursor={{ fill: "rgba(255,255,255,0.06)" }}
              content={({ active, payload }: TooltipProps<number, string>) => {
                if (active && payload && payload.length) {
                  const d = payload[0].payload as StateData & { indice: number };
                  const valor = getMetricValue(d);
                  const metricLabel = metric === "aprovacao" ? "Aprovação" : "Reprovação";
                  const metricColor = metric === "aprovacao" ? "text-emerald-400" : "text-rose-400";
                  return (
                    <div className="bg-slate-950 border border-slate-700 p-3 rounded-xl shadow-2xl">
                      <p className="text-sm font-bold text-white mb-1">
                        {d.nome}{" "}
                        <span className="text-amber-400">({d.uf})</span>
                      </p>
                      <p className="text-xs font-semibold text-slate-200">
                        {metricLabel} {activeTab === "teorica" ? "teórica" : "prática"}:{" "}
                        <span className={`${metricColor} font-extrabold`}>
                          {valor}%
                        </span>
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="indice" radius={[4, 4, 0, 0]} maxBarSize={26}>
              {chartData.map((d) => (
                <Cell
                  key={d.uf}
                  fill={userUF && d.uf === userUF ? "#f59e0b" : "url(#rankingBar)"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Accordion Tabela */}
      <div>
        <button
          onClick={() => setShowTable((v) => !v)}
          className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl glass text-xs font-semibold hover:bg-accent/30 transition-colors"
        >
          <span>
            {showTable ? "Ocultar Tabela Completa" : "Ver Tabela Completa"}
          </span>
          <ChevronDown
            className={`h-4 w-4 transition-transform ${
              showTable ? "rotate-180" : ""
            }`}
          />
        </button>

        {showTable && (
          <div className="mt-3 overflow-hidden rounded-xl border border-border/20">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-black/40 text-muted-foreground">
                  <th className="px-3 py-2 text-left font-semibold">#</th>
                  <th className="px-3 py-2 text-left font-semibold">UF</th>
                  <th className="px-3 py-2 text-right font-semibold">
                    {metric === "aprovacao" ? "Aprovação" : "Reprovação"} teórica
                  </th>
                  <th className="px-3 py-2 text-right font-semibold">
                    {metric === "aprovacao" ? "Aprovação" : "Reprovação"} prática
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedData.map((d, i) => (
                  <tr
                    key={d.uf}
                    className={
                      userUF && d.uf === userUF
                        ? "bg-amber-500/15 text-amber-300"
                        : "text-muted-foreground"
                    }
                  >
                    <td className="px-3 py-1.5">{i + 1}</td>
                    <td className="px-3 py-1.5 font-semibold">
                      {d.uf}
                      {userUF && d.uf === userUF && " ★"}
                    </td>
                    <td className="px-3 py-1.5 text-right">{getMetricValue(d, "teorica")}%</td>
                    <td className="px-3 py-1.5 text-right">{getMetricValue(d, "pratica")}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
