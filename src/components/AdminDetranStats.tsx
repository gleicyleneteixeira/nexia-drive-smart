import { useState, useEffect, useRef, type ChangeEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface StateData {
  uf: string;
  nome: string;
  teorica: number;
  pratica: number;
}

// Parser de CSV que respeita aspas (nomes de estado com espaços/vírgulas)
function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === "," && !inQuotes) {
      result.push(cur);
      cur = "";
    } else {
      cur += ch;
    }
  }
  result.push(cur);
  return result;
}

export function AdminDetranStats() {
  const [stats, setStats] = useState<StateData[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingUf, setSavingUf] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchStats = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("detran_stats")
      .select("*")
      .order("uf", { ascending: true });
    if (!error && data && data.length > 0) {
      setStats(data as StateData[]);
    } else if (error) {
      toast.error(`Erro ao carregar: ${error.message}`);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // Alteração manual na tabela
  const handleChange = (
    uf: string,
    field: "teorica" | "pratica",
    value: string
  ) => {
    const numValue = parseFloat(value.replace(",", ".")) || 0;
    setStats((prev) =>
      prev.map((item) =>
        item.uf === uf ? { ...item, [field]: numValue } : item
      )
    );
  };

  // Salvar um estado individual
  const handleSaveState = async (item: StateData) => {
    setSavingUf(item.uf);
    const { error } = await supabase.from("detran_stats").upsert({
      uf: item.uf,
      nome: item.nome,
      teorica: item.teorica,
      pratica: item.pratica,
      updated_at: new Date().toISOString(),
    });
    setSavingUf(null);
    if (error) {
      toast.error(`Erro ao salvar ${item.uf}: ${error.message}`);
    } else {
      toast.success(
        `Índices de ${item.nome} (${item.uf}) atualizados!`
      );
    }
  };

  // 📥 EXPORTAR PLANILHA (CSV)
  const handleExportCSV = () => {
    if (stats.length === 0) {
      toast.error("Nenhum dado disponível para exportar.");
      return;
    }
    const headers = ["uf", "nome", "teorica", "pratica"];
    const rows = stats.map(
      (s) => `"${s.uf}","${s.nome}",${s.teorica},${s.pratica}`
    );
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `modelo_indices_detran_${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // 📤 IMPORTAR PLANILHA (CSV)
  const handleImportCSV = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text
          .split("\n")
          .map((l) => l.trim())
          .filter((l) => l.length > 0);

        // Remove o cabeçalho
        const dataLines = lines.slice(1);
        const parsedData: StateData[] = [];

        for (const line of dataLines) {
          const cols = parseCsvLine(line).map((c) => c.trim());
          if (cols.length >= 4) {
            parsedData.push({
              uf: cols[0].toUpperCase(),
              nome: cols[1],
              teorica: parseFloat(cols[2].replace(",", ".")) || 0,
              pratica: parseFloat(cols[3].replace(",", ".")) || 0,
            });
          }
        }

        if (parsedData.length === 0) {
          toast.error("O arquivo CSV é inválido ou está vazio.");
          setIsUploading(false);
          return;
        }

        // Upsert em lote no Supabase
        const { error } = await supabase.from("detran_stats").upsert(
          parsedData.map((item) => ({
            ...item,
            updated_at: new Date().toISOString(),
          }))
        );

        if (error) {
          toast.error(`Erro ao importar lote: ${error.message}`);
        } else {
          toast.success(
            `Sucesso! ${parsedData.length} estados atualizados via planilha.`
          );
          fetchStats(); // Recarrega a tabela
        }
      } catch {
        toast.error("Erro ao processar o arquivo CSV. Verifique a formatação.");
      } finally {
        setIsUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    };

    reader.readAsText(file);
  };

  if (loading)
    return (
      <div className="p-6 text-white text-center">
        Carregando estatísticas do Detran...
      </div>
    );

  return (
    <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800 shadow-xl">
      {/* Cabeçalho com Ações de Importação e Exportação */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4 border-b border-slate-800 pb-5">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            ⚙️ Gerenciador de Índices de Reprovação (DETRAN)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Edite manualmente abaixo ou utilize a importação/exportação por
            planilha.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-2"
          >
            📥 Baixar Modelo / Planilha
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold transition flex items-center gap-2 disabled:opacity-50"
          >
            📤 {isUploading ? "Importando..." : "Subir Planilha Atualizada"}
          </button>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImportCSV}
            accept=".csv"
            className="hidden"
          />
        </div>
      </div>

      {/* Tabela de Edição Manual */}
      <div className="overflow-x-auto max-h-[550px] overflow-y-auto rounded-xl border border-slate-800">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-800 text-slate-400 sticky top-0 z-10">
            <tr>
              <th className="p-3.5">Estado (UF)</th>
              <th className="p-3.5 text-center">Reprovação Teórica (%)</th>
              <th className="p-3.5 text-center">Reprovação Prática (%)</th>
              <th className="p-3.5 text-right">Ação Individual</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {stats.map((item) => (
              <tr key={item.uf} className="hover:bg-slate-800/50 transition">
                <td className="p-3.5 font-semibold text-white">
                  {item.nome}{" "}
                  <span className="text-amber-400">({item.uf})</span>
                </td>
                <td className="p-3.5 text-center">
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={item.teorica}
                    onChange={(e) =>
                      handleChange(item.uf, "teorica", e.target.value)
                    }
                    className="w-24 px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-center text-amber-400 font-bold focus:outline-none focus:border-amber-500"
                  />{" "}
                  %
                </td>
                <td className="p-3.5 text-center">
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={item.pratica}
                    onChange={(e) =>
                      handleChange(item.uf, "pratica", e.target.value)
                    }
                    className="w-24 px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-center text-rose-400 font-bold focus:outline-none focus:border-rose-500"
                  />{" "}
                  %
                </td>
                <td className="p-3.5 text-right">
                  <button
                    onClick={() => handleSaveState(item)}
                    disabled={savingUf === item.uf}
                    className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg text-xs transition-all disabled:opacity-50"
                  >
                    {savingUf === item.uf ? "Salvando..." : "Salvar"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
