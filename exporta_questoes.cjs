// Exporta todas as questões de src/data/questions.ts para Excel (.xlsx)
const fs = require("fs");
const XLSX = require("xlsx");

const src = fs.readFileSync("src/data/questions.ts", "utf8");
const linhas = src.split(/\r?\n/);

const ini = linhas.findIndex((l) => l.includes("export const QUESTIONS"));
const fim = linhas.findIndex((l, i) => i > ini && l.includes("export const REAL_EXAM_IDS"));
if (ini < 0 || fim < 0) { console.log("janela nao encontrada"); process.exit(1); }

const blocos = [];
let atual = null, startIdx = -1;
for (let i = ini; i < fim; i++) {
  const l = linhas[i];
  if (/^    \{$/.test(l)) { atual = []; startIdx = i; }
  else if (atual) {
    atual.push(l);
    if (/^    \},?$/.test(l)) { blocos.push(atual); atual = null; }
  }
}

const peg = (t, re) => { const m = t.match(re); return m ? m[1] : null; };
const CATS = {
  legislacao: "Legislação", placas: "Placas", "direcao-defensiva": "Direção Defensiva",
  "primeiros-socorros": "Primeiros Socorros", infracoes: "Infrações",
  "meio-ambiente": "Meio Ambiente", mecanica: "Mecânica Básica", prioridade: "Prioridade de Passagem",
};
const INC = { altissima: "Altíssima", alta: "Alta", media: "Média", baixa: "Baixa" };
const LETRAS = ["A", "B", "C", "D"];

const rows = blocos.map((b) => {
  const t = b.join("\n");
  const optsTxt = peg(t, /options:\s*\[([\s\S]*?)\],\s*\n\s*correctIndex/);
  const opts = optsTxt ? [...optsTxt.matchAll(/"((?:[^"\\]|\\.)*)"/g)].map((m) => m[1]) : [];
  const ci = Number(peg(t, /correctIndex:\s*(\d+)/));
  const unesc = (s) => (s ? s.replace(/\\"/g, '"').replace(/\\n/g, " ") : "");
  return {
    ID: peg(t, /^\s{8}id:\s*"([^"]+)"/m) || "",
    Categoria: CATS[peg(t, /category:\s*"([^"]+)"/)] || peg(t, /category:\s*"([^"]+)"/) || "",
    Enunciado: unesc(peg(t, /statement:\s*"((?:[^"\\]|\\.)*)"/)),
    "Alternativa A": unesc(opts[0]) || "",
    "Alternativa B": unesc(opts[1]) || "",
    "Alternativa C": unesc(opts[2]) || "",
    "Alternativa D": unesc(opts[3]) || "",
    Gabarito: LETRAS[ci] || "",
    "Resposta correta": unesc(opts[ci]) || "",
    Explicação: unesc(peg(t, /explanation:\s*"((?:[^"\\]|\\.)*)"/)),
    "Explicação detalhada": unesc(peg(t, /detailedExplanation:\s*"((?:[^"\\]|\\.)*)"/)),
    "Base legal": unesc(peg(t, /legalBase:\s*"((?:[^"\\]|\\.)*)"/)),
    "Erro comum": unesc(peg(t, /commonMistake:\s*"((?:[^"\\]|\\.)*)"/)),
    Dica: unesc(peg(t, /tip:\s*"((?:[^"\\]|\\.)*)"/)),
    "Gancho mnemônico": unesc(peg(t, /memoryHook:\s*"((?:[^"\\]|\\.)*)"/)),
    Incidência: INC[peg(t, /incidence:\s*"([^"]+)"/)] || "",
    Dificuldade: peg(t, /difficulty:\s*(\d+)/) || "",
    Pegadinha: /trap:\s*true/.test(t) ? "Sim" : "Não",
    Origem: peg(t, /origin:\s*"([^"]+)"/) || "",
    Grupo: peg(t, /group:\s*"([^"]+)"/) || "",
    Placa: peg(t, /placa:\s*"([^"]+)"/) || "",
    "URL imagem": peg(t, /image_url:\s*"([^"]+)"/) || "",
    "Linha no código": startIdx === -1 ? "" : "",
  };
});

// Linha real no arquivo (para rastrear)
let bi = 0;
for (let i = ini; i < fim; i++) {
  if (/^    \{$/.test(linhas[i])) { if (rows[bi]) rows[bi]["Linha no código"] = i + 1; bi++; }
}

const wb = XLSX.utils.book_new();
const ws = XLSX.utils.json_to_sheet(rows);
ws["!cols"] = [
  { wch: 34 }, { wch: 20 }, { wch: 70 }, { wch: 45 }, { wch: 45 }, { wch: 45 }, { wch: 45 },
  { wch: 8 }, { wch: 45 }, { wch: 60 }, { wch: 60 }, { wch: 35 }, { wch: 45 }, { wch: 40 },
  { wch: 45 }, { wch: 12 }, { wch: 12 }, { wch: 11 }, { wch: 10 }, { wch: 24 }, { wch: 14 },
  { wch: 50 }, { wch: 14 },
];
XLSX.utils.book_append_sheet(wb, ws, "Questões");

// Aba resumo
const porCat = {}, porOrig = {};
rows.forEach((r) => {
  porCat[r.Categoria] = (porCat[r.Categoria] || 0) + 1;
  const o = r.Origem || "(sem)"; porOrig[o] = (porOrig[o] || 0) + 1;
});
const resumo = [
  { Item: "TOTAL de questões", Valor: rows.length },
  { Item: "", Valor: "" },
  ...Object.entries(porCat).map(([k, v]) => ({ Item: `Categoria: ${k}`, Valor: v })),
  { Item: "", Valor: "" },
  ...Object.entries(porOrig).map(([k, v]) => ({ Item: `Origem: ${k}`, Valor: v })),
];
const ws2 = XLSX.utils.json_to_sheet(resumo);
ws2["!cols"] = [{ wch: 40 }, { wch: 12 }];
XLSX.utils.book_append_sheet(wb, ws2, "Resumo");

const out = "banco-de-questoes-nexia.xlsx";
XLSX.writeFile(wb, out);
const kb = Math.round(fs.statSync(out).size / 1024);
console.log(`OK: ${out} (${kb} KB)`);
console.log(`Questões exportadas: ${rows.length}`);
console.log(`Sem gabarito: ${rows.filter((r) => !r.Gabarito).length} | Sem alternativa: ${rows.filter((r) => !r["Alternativa D"]).length}`);
