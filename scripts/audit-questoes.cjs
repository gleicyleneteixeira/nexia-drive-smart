// Auditoria automática do banco de questões (QUESTIONS em src/data/questions.ts).
// Uso: node scripts/audit-questoes.cjs
// Gera: audit-questoes-relatorio.txt (listas completas por tipo de problema).
const fs = require("fs");
const path = require("path");

const FILE = path.join(__dirname, "..", "src", "data", "questions.ts");
const src = fs.readFileSync(FILE, "utf8");

// ---------- extração de arrays (scanner que respeita strings e comentários) ----------
function extractArray(marker) {
  const mStart = src.indexOf(marker);
  if (mStart < 0) throw new Error("marker nao encontrado: " + marker);
  let i = mStart + marker.length - 1; // aponta para o '['
  let depth = 0, inStr = null, esc = false, end = -1;
  for (; i < src.length; i++) {
    const c = src[i];
    if (inStr) {
      if (esc) { esc = false; continue; }
      if (c === "\\") { esc = true; continue; }
      if (c === inStr) inStr = null;
      continue;
    }
    if (c === "/" && src[i + 1] === "/") { while (i < src.length && src[i] !== "\n") i++; continue; }
    if (c === "/" && src[i + 1] === "*") { i += 2; while (i < src.length && !(src[i] === "*" && src[i + 1] === "/")) i++; i++; continue; }
    if (c === '"' || c === "'" || c === "`") { inStr = c; continue; }
    if (c === "[") depth++;
    else if (c === "]") { depth--; if (depth === 0) { end = i; break; } }
  }
  return new Function("return " + src.slice(mStart + marker.length - 1, end + 1))();
}
const QUESTIONS = extractArray("export const QUESTIONS: Question[] = [");
// REAL_EXAM_IDS: mistura de strings (referencias) + objetos inline de prova real
const REAL_INLINE = extractArray("export const REAL_EXAM_IDS = [").filter((e) => typeof e === "object" && e && e.id);
const ALL = QUESTIONS.concat(REAL_INLINE);
console.log(`Questoes carregadas: ${ALL.length} (QUESTIONS ${QUESTIONS.length} + prova real inline ${REAL_INLINE.length})`);

// ---------- helpers ----------
const norm = (s) => (s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
const len = (s) => (s || "").replace(/[*_]/g, "").trim().length;
const tokens = (s) => new Set(norm(s).split(" ").filter((w) => w.length > 2));
const trigrams = (s) => { const t = norm(s); const g = new Set(); for (let k = 0; k + 3 <= t.length; k += 1) g.add(t.slice(k, k + 3)); return g; };
const jac = (a, b) => { let inter = 0; a.forEach((x) => { if (b.has(x)) inter++; }); const uni = a.size + b.size - inter; return uni ? inter / uni : 0; };

const A = { // alertas
  estrutura: [], placasSemImagem: [], semRecursoVisual: [], tamanho: [],
  obvias: [], duplicadas: [], resumo: [], gabarito: [],
};
const add = (k, id, msg) => A[k].push(`${id}: ${msg}`);

// ---------- A. estrutura ----------
const seen = new Map();
const IDX = { altissima: 1, alta: 1, media: 1, baixa: 1 };
for (const q of ALL) {
  if (seen.has(q.id)) add("estrutura", q.id, `id duplicado (tambem em ${seen.get(q.id)})`);
  seen.set(q.id, true);
  if (!Array.isArray(q.options) || q.options.length !== 4) add("estrutura", q.id, `options com ${q.options ? q.options.length : 0} itens (esperado 4)`);
  if (!Number.isInteger(q.correctIndex) || q.correctIndex < 0 || q.correctIndex > 3) add("estrutura", q.id, `correctIndex invalido: ${q.correctIndex}`);
  if (!q.statement || len(q.statement) < 25) add("estrutura", q.id, "enunciado vazio ou curto demais");
  if (!q.explanation || len(q.explanation) < 25) add("estrutura", q.id, "explicacao ausente ou curta demais");
  if (!IDX[q.incidence]) add("estrutura", q.id, `incidence invalida: ${q.incidence}`);
  if (![1, 2, 3].includes(q.difficulty)) add("estrutura", q.id, `difficulty invalida: ${q.difficulty}`);
  if (Array.isArray(q.options)) q.options.forEach((o, k) => { if (!o || len(o) < 2) add("estrutura", q.id, `alternativa ${k} vazia`); });
}

// ---------- B. placas sem imagem (prioridade) ----------
const CODE_RE = /\b([RABCDESP]-\d{1,3}[a-z]{0,2}|I-[A-Za-z]+)\b/g;
const VISUAL_CTX_RE = /\b(placa|placas|sinal(iza|izaç|izaçao|ização)?\s*(de|vertical)?|simbolo|símbolo|adesivo)\b/i;
const MISSING_IMG_RE = /\b(figura|imagem|ilustra[çc][ãa]o|foto|gr[aá]fico|tabela|desenho (abaixo|acima|ao lado)|placa apresentada|placa mostrada)\b/i;
const PLACA_IDS = new Set(["R-1","R-2","R-6a","R-6b","R-19","R-25a","R-25d","A-1a","A-2b","A-13a","A-32b","A-33a","I-Hospital","I-Posto"]);
for (const q of ALL) {
  const hasVisual = !!(q.placa || q.image_url);
  const codes = [...new Set(((q.statement || "") + " " + (q.options || []).join(" ")).match(CODE_RE) || [])];
  const noCodigoDisponivel = codes.filter((c) => !PLACA_IDS.has(c));
  if (codes.length && !hasVisual) {
    if (VISUAL_CTX_RE.test(q.statement)) {
      A.placasSemImagem.push(`${q.id}: codigos ${codes.join(", ")} sem campo placa/image_url | enunciado: ${norm(q.statement).slice(0, 110)}`);
    } else {
      add("semRecursoVisual", q.id, `cita codigo de placa ${codes.join(", ")} mas nao exige imagem e nao tem recurso`);
    }
  }
  if (MISSING_IMG_RE.test(q.statement || "") && !hasVisual) {
    A.semRecursoVisual.push(`${q.id}: enunciado referencia imagem/figura sem recurso visual | ${norm(q.statement).slice(0, 110)}`);
  }
  if (q.placa && !PLACA_IDS.has(q.placa)) add("estrutura", q.id, `campo placa "${q.placa}" fora do catalogo do componente Placa`);
  if (codes.length && hasVisual && q.placa && !codes.some((c) => c === q.placa)) {
    add("estrutura", q.id, `codigo no texto (${codes.join(",")}) difere do campo placa (${q.placa})`);
  }
}

// ---------- C. tamanho desbalanceado ----------
for (const q of ALL) {
  if (!Array.isArray(q.options) || q.options.length !== 4 || !Number.isInteger(q.correctIndex)) continue;
  const ls = q.options.map(len);
  const ci = q.correctIndex;
  const cor = ls[ci];
  const outras = ls.filter((_, k) => k !== ci);
  const media = outras.reduce((a, b) => a + b, 0) / outras.length;
  const maxOutra = Math.max(...outras);
  const ehMaior = cor > maxOutra;
  const ratio = media ? cor / media : 0;
  if (ehMaior && ratio >= 2.0) {
    const nivel = ratio >= 2.5 ? "CRITICO" : "medio";
    A.tamanho.push(`${nivel} ${q.id}: correta ${cor} chars vs media ${Math.round(media)} (x${ratio.toFixed(2)}), maior ${maxOutra} | alt ${ci}: ${norm(q.options[ci]).slice(0, 90)}`);
  }
}

// ---------- D. obvias / distratores ----------
for (const q of ALL) {
  if (!Array.isArray(q.options) || q.options.length !== 4) continue;
  const norms = q.options.map(norm);
  for (let a = 0; a < 4; a++) for (let b = a + 1; b < 4; b++) {
    if (norms[a] && norms[a] === norms[b]) A.obvias.push(`${q.id}: alternativas ${a} e ${b} identicas`);
    else if (jac(tokens(q.options[a]), tokens(q.options[b])) > 0.9) A.obvias.push(`${q.id}: alternativas ${a} e ${b} quase equivalentes`);
  }
  const stTok = tokens(q.statement);
  const ci = q.correctIndex;
  const corTok = tokens(q.options[ci] || "");
  if (corTok.size) {
    let hit = 0; corTok.forEach((t) => { if (stTok.has(t)) hit++; });
    if (hit / corTok.size >= 0.9 && len(q.options[ci]) > 40) A.obvias.push(`${q.id}: enunciado praticamente repete a alternativa correta`);
  }
  const ls = q.options.map(len);
  const cor = ls[ci] ?? 0;
  const outras = ls.filter((_, k) => k !== ci);
  if (cor > Math.max(...outras) && outras.every((l) => l <= 55) && cor >= 130) {
    A.obvias.push(`${q.id}: correta longa (${cor}) vs distratores muito curtos (${outras.join("/")})`);
  }
}

// ---------- E. distribuicao de gabaritos ----------
const dist = { 0: 0, 1: 0, 2: 0, 3: 0 };
let runIdx = 0, runLen = 1, worstRun = { len: 1, id: ALL[0] ? ALL[0].id : "-", idx: 0 };
for (const q of ALL) {
  if (!Number.isInteger(q.correctIndex)) continue;
  dist[q.correctIndex]++;
  if (q.correctIndex === runIdx) { runLen++; if (runLen > worstRun.len) worstRun = { len: runLen, id: q.id, idx: runIdx }; }
  else { runIdx = q.correctIndex; runLen = 1; }
}
const total = Object.values(dist).reduce((a, b) => a + b, 0);
const distLinha = Object.entries(dist).map(([k, v]) => `${["A","B","C","D"][k]}=${v} (${((v/total)*100).toFixed(1)}%)`).join("  ");
A.resumo.push(`Distribuicao dos gabaritos no arquivo: ${distLinha}`);
A.resumo.push(`Maior sequencia com a mesma posicao: ${worstRun.len}x seguidas (posicao ${["A","B","C","D"][worstRun.idx]}, terminando em ${worstRun.id})`);
A.resumo.push("Obs.: o app embaralha alternativas em runtime (shuffleOptions) e remapeia o gabarito por ID interno -> o padrao de posicao NAO chega ao usuario no simulado.");

// ---------- F. duplicatas ----------
const byStmt = new Map();
for (const q of ALL) { const n = norm(q.statement); if (!byStmt.has(n)) byStmt.set(n, []); byStmt.get(n).push(q.id); }
for (const [n, ids] of byStmt) if (ids.length > 1) A.duplicadas.push(`ENUNCIADO IDENTICO: ${ids.join(" + ")}`);
const pares = [];
for (let a = 0; a < ALL.length; a++) {
  const ga = trigrams(ALL[a].statement);
  for (let b = a + 1; b < ALL.length; b++) {
    if (ALL[a].category !== ALL[b].category) continue;
    if (ALL[a].group && ALL[a].group === ALL[b].group) continue;
    const j = jac(ga, trigrams(ALL[b].statement));
    if (j >= 0.6) pares.push(`${j.toFixed(2)} ${ALL[a].id} x ${ALL[b].id}: ${norm(ALL[a].statement).slice(0, 70)} <> ${norm(ALL[b].statement).slice(0, 70)}`);
  }
}
A.duplicadas.push(...pares);

// ---------- G. gabarito x explicacao (claim explicito no inicio do texto) ----------
const ORD_CLAIM = { primeira: 0, segunda: 1, terceira: 2, quarta: 3, "1a": 0, "2a": 1, "3a": 2, "4a": 3 };
const LTR_CLAIM = { a: 0, b: 1, c: 2, d: 3, "1": 0, "2": 1, "3": 2, "4": 3 };
function claimedIndex(text) {
  if (!text) return null;
  const t = text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, " ").trim();
  let m;
  // "Correta a terceira/opcao 2 ..."
  if ((m = t.match(/^correta\s+(?:a\s+|ao\s+)?(?:alternativa\s+|opcao\s+|resposta\s+)?(primeira|segunda|terceira|quarta|1[ªa]|2[ªa]|3[ªa]|4[ªa])(?![a-z0-9])/i))) {
    const k = m[1].toLowerCase();
    return k[0] >= "1" && k[0] <= "4" ? "1234".indexOf(k[0]) : ORD_CLAIM[k];
  }
  // "Correta a alternativa A", "Correta letra B", "Correta opcao C"
  if ((m = t.match(/^correta\s+(?:a\s+|ao\s+)?(?:alternativa|letra|opcao|resposta)\s*[:\-]?\s*([a-d1-4])(?![a-z0-9])(?!\s*-\s*\d)/i))) return LTR_CLAIM[m[1].toLowerCase()];
  // letra solta (so caixa alta; evita falso "Correta: a permissao" e "Correta: A-28")
  if ((m = t.match(/^correta\s+([a-d])(?![a-z0-9])(?!\s*-\s*\d)/i)) && m[1] === m[1].toUpperCase()) return LTR_CLAIM[m[1].toLowerCase()];
  if ((m = t.match(/^correta\s*[:\-]\s*([a-d])(?![a-z0-9])(?!\s*-\s*\d)/i)) && m[1] === m[1].toUpperCase()) return LTR_CLAIM[m[1].toLowerCase()];
  // "A alternativa D esta correta", "A B esta correta", "A B e a resposta"
  if ((m = t.match(/^(?:a\s+)?alternativa\s+([a-d1-4])\s+(?:e|esta|seria)\s+(?:a\s+)?correta/i))) return LTR_CLAIM[m[1].toLowerCase()];
  if ((m = t.match(/^(?:a\s+)?([a-d])\s+(?:e|esta|seria)\s+(?:a\s+)?(?:correta|resposta)(?![a-z])/i))) return LTR_CLAIM[m[1].toLowerCase()];
  // "A segunda alternativa esta correta"
  if ((m = t.match(/^(?:a\s+)?(primeira|segunda|terceira|quarta)\s+(?:alternativa|opcao)\s+(?:e|esta|seria)\s+(?:a\s+)?correta/i))) return ORD_CLAIM[m[1].toLowerCase()];
  // "Resposta correta: B", "Gabarito: D"
  if ((m = t.match(/^(?:a\s+)?(?:resposta|gabarito)(?:\s+(?:correta|certa))?\s*(?:e|:)\s*(?:a\s+)?(?:alternativa\s+|opcao\s+)?([a-d1-4])(?![a-z0-9])(?!\s*-\s*\d)/i)) && m[1] === m[1].toUpperCase()) return LTR_CLAIM[m[1].toLowerCase()];
  return null;
}
let gClaims = 0;
for (const q of ALL) {
  for (const field of ["explanation", "detailedExplanation"]) {
    const c = claimedIndex(q[field]);
    if (c === null) continue;
    gClaims++;
    if (c !== q.correctIndex) {
      add("gabarito", q.id, `${field} aponta alternativa ${c + 1} ("${(q.options[c] || "").slice(0, 70)}") mas correctIndex=${q.correctIndex} ("${(q.options[q.correctIndex] || "").slice(0, 70)}")`);
    }
  }
}
A.resumo.push(`claims verificados pelo criterio G: ${gClaims} de ${ALL.length} questoes`);

// ---------- relatorio ----------
const secoes = [
  ["A. ESTRUTURA / GABARITO AUSENTE", A.estrutura],
  ["B. PLACAS SEM IMAGEM (prioridade)", A.placasSemImagem],
  ["B2. REFERENCIA VISUAL SEM RECURSO (nao respondivel)", A.semRecursoVisual],
  ["C. ALTERNATIVA CORRETA MUITO MAIOR", A.tamanho],
  ["D. RESPOSTA OBVIA / DISTRATORES FRACOS", A.obvias],
  ["F. DUPLICAS / MUITO SEMELHANTES", A.duplicadas],
  ["G. GABARITO X EXPLICACAO (claim explicito)", A.gabarito],
  ["E. DISTRIBUICAO (info)", A.resumo],
];
let out = `Auditoria de ${ALL.length} questoes - ${new Date().toISOString()}\r\n`;
for (const [titulo, lista] of secoes) {
  out += `\r\n===== ${titulo}: ${lista.length} =====\r\n`;
  out += lista.sort().join("\r\n") + "\r\n";
}
fs.writeFileSync(path.join(__dirname, "..", "audit-questoes-relatorio.txt"), out, "utf8");
for (const [titulo, lista] of secoes) console.log(`${titulo}: ${lista.length}`);
console.log("Relatorio completo em audit-questoes-relatorio.txt");
