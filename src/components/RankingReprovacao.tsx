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

export function RankingReprovacao({ userUF = "MG" }: { userUF?: string }) {
  const [activeTab, setActiveTab] = useState<"teorica" | "pratica">("teorica");
  const [showTable, setShowTable] = useState(false);
  const [data, setData] = useState<StateData[]>(rawData);

  // Preferir dados do banco (detran_stats); cai no hardcoded se vazio/falhar
  useEffect(() => {
    let active = true;
    supabase
      .from("detran_stats")
      .select("uf, nome, teorica, pratica")
      .order("uf", { ascending: true })
      .then(({ data: db }) => {
        if (active && db && db.length > 0) setData(db as StateData[]);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const sortedData = [...data].sort((a, b) => b[activeTab] - a[activeTab]);

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
              content={({ active, payload }: TooltipProps<number, string>) => {
                if (active && payload && payload.length) {
                  const d = payload[0].payload as StateData;
                  const valor = activeTab === "teorica" ? d.teorica : d.pratica;
                  return (
                    <div className="bg-slate-950 border border-slate-700 p-3 rounded-xl shadow-2xl">
                      <p className="text-sm font-bold text-white mb-1">
                        {d.nome}{" "}
                        <span className="text-amber-400">({d.uf})</span>
                      </p>
                      <p className="text-xs font-semibold text-slate-200">
                        {activeTab === "teorica" ? "Prova Teórica" : "Prova Prática"}:{" "}
                        <span className="text-emerald-400 font-extrabold">
                          {valor}%
                        </span>
                      </p>
                    </div>
                  );
                }
                return null;
              }}
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
