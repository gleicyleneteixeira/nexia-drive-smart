import { useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from "recharts";

interface StateData {
  uf: string;
  teorica: number;
  pratica: number;
}

const rawData: StateData[] = [
  { uf: "MG", teorica: 48.0, pratica: 60.0 },
  { uf: "RJ", teorica: 42.5, pratica: 46.7 },
  { uf: "SP", teorica: 38.0, pratica: 42.0 },
  { uf: "MT", teorica: 35.0, pratica: 39.7 },
  { uf: "PR", teorica: 36.0, pratica: 38.5 },
  { uf: "RS", teorica: 34.0, pratica: 37.0 },
  { uf: "BA", teorica: 40.0, pratica: 36.5 },
  { uf: "PE", teorica: 37.0, pratica: 35.0 },
  { uf: "CE", teorica: 35.5, pratica: 34.0 },
  { uf: "GO", teorica: 33.0, pratica: 32.5 },
  { uf: "SC", teorica: 31.0, pratica: 31.0 },
  { uf: "ES", teorica: 30.0, pratica: 29.5 },
  { uf: "DF", teorica: 32.0, pratica: 28.0 },
  { uf: "MA", teorica: 33.0, pratica: 27.0 },
  { uf: "PB", teorica: 29.0, pratica: 26.0 },
  { uf: "PA", teorica: 31.0, pratica: 25.0 },
  { uf: "MS", teorica: 28.0, pratica: 24.0 },
  { uf: "RN", teorica: 27.0, pratica: 23.0 },
  { uf: "AL", teorica: 29.0, pratica: 22.0 },
  { uf: "PI", teorica: 26.0, pratica: 20.0 },
  { uf: "TO", teorica: 25.0, pratica: 20.0 },
  { uf: "SE", teorica: 26.0, pratica: 19.0 },
  { uf: "RO", teorica: 24.0, pratica: 18.0 },
  { uf: "AM", teorica: 25.0, pratica: 17.0 },
  { uf: "AC", teorica: 22.0, pratica: 15.0 },
  { uf: "AP", teorica: 20.0, pratica: 12.0 },
  { uf: "RR", teorica: 18.0, pratica: 10.0 },
];

export function RankingReprovacao({ userUF = "MG" }: { userUF?: string }) {
  const [activeTab, setActiveTab] = useState<"teorica" | "pratica">("teorica");
  const [showTable, setShowTable] = useState(false);

  const sortedData = [...rawData].sort((a, b) => b[activeTab] - a[activeTab]);
  const metricLabel =
    activeTab === "teorica" ? "Reprovação Teórica" : "Reprovação Prática";

  return (
    <section className="glass rounded-3xl p-5 md:p-6 shadow-card space-y-4">
      {/* Cabeçalho + abas */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-display font-bold flex items-center gap-2">
            <span>📊</span> Ranking de Reprovação no DETRAN
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Índice médio por Estado. Seu estado ({userUF}) está destacado em
            dourado.
          </p>
        </div>

        <div className="flex bg-black/30 p-1 rounded-xl border border-border/20">
          <button
            onClick={() => setActiveTab("teorica")}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "teorica"
                ? "bg-amber-500 text-slate-950 shadow-md"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            1º Prova Teórica
          </button>
          <button
            onClick={() => setActiveTab("pratica")}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "pratica"
                ? "bg-rose-500 text-white shadow-md"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            2º Prova Prática
          </button>
        </div>
      </div>

      {/* Gráfico */}
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={sortedData}
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
              contentStyle={{
                background: "#0f172a",
                border: "1px solid #334155",
                borderRadius: 12,
                color: "#fff",
                fontSize: 12,
              }}
              formatter={(value: number) => [`${value}%`, metricLabel]}
            />
            <Bar dataKey={activeTab} radius={[4, 4, 0, 0]} maxBarSize={26}>
              {sortedData.map((d) => (
                <Cell
                  key={d.uf}
                  fill={d.uf === userUF ? "#f59e0b" : "url(#rankingBar)"}
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
                  <th className="px-3 py-2 text-right font-semibold">Teórica</th>
                  <th className="px-3 py-2 text-right font-semibold">Prática</th>
                </tr>
              </thead>
              <tbody>
                {sortedData.map((d, i) => (
                  <tr
                    key={d.uf}
                    className={
                      d.uf === userUF
                        ? "bg-amber-500/15 text-amber-300"
                        : "text-muted-foreground"
                    }
                  >
                    <td className="px-3 py-1.5">{i + 1}</td>
                    <td className="px-3 py-1.5 font-semibold">
                      {d.uf}
                      {d.uf === userUF && " ★"}
                    </td>
                    <td className="px-3 py-1.5 text-right">{d.teorica}%</td>
                    <td className="px-3 py-1.5 text-right">{d.pratica}%</td>
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
