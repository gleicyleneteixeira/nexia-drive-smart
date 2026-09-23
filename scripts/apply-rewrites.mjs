import fs from "node:fs";
import path from "node:path";
import ts from "typescript";

const ROOT = "C:\\Users\\Win 10\\OneDrive\\Desktop\\git\\nexia-drive-smart";
const FILE = path.join(ROOT, "src", "data", "questions.ts");
const CACHE_FILE = "C:\\Users\\WIN10~1\\AppData\\Local\\Temp\\opencode\\rewrite-cache.json";
const OUT = path.join(ROOT, "src", "data", "questions.new.ts");

const TARGETS = ["explanation", "detailedExplanation", "commonMistake", "tip"];

const cache = JSON.parse(fs.readFileSync(CACHE_FILE, "utf8"));

// ---------- reconstrói as 36 perdidas a partir do cache ----------
function inferCategory(id) {
  const m = id.match(/^([a-z]+)/);
  const p = m ? m[1] : "";
  const map = {
    leg: "legislacao",
    inf: "infracoes",
    dd: "direcao-defensiva",
    ps: "primeiros-socorros",
    ma: "meio-ambiente",
    plac: "placas",
    placa: "placas",
    mec: "mecanica",
    pri: "prioridade",
    sin: "legislacao",
  };
  return map[p] || "legislacao";
}
function inferDifficulty(id) {
  if (id.includes("_n3_")) return 3;
  if (id.includes("_n2_")) return 2;
  return 1;
}

const reconstructed = [];
for (const [id, entry] of Object.entries(cache)) {
  const sig = entry.sig ? JSON.parse(entry.sig) : {};
  const out = entry.out || {};
  if (!sig.statement) continue;
  // só reconstrói se não estiver no arquivo atual (checado depois)
  reconstructed.push({
    id,
    category: inferCategory(id),
    statement: sig.statement,
    options: sig.options || [],
    correctIndex: typeof sig.correctIndex === "number" ? sig.correctIndex : 0,
    explanation: out.explanation || "",
    detailedExplanation: out.detailedExplanation || undefined,
    commonMistake: out.commonMistake || undefined,
    tip: out.tip || undefined,
    incidence: "media",
    difficulty: inferDifficulty(id),
    trap: false,
  });
}

// ---------- lê o arquivo atual (263 commitadas) ----------
const text = fs.readFileSync(FILE, "utf8");
const sf = ts.createSourceFile(FILE, text, ts.ScriptTarget.Latest, true);

// coleta ids já presentes para não duplicar as reconstrúdas
const presentIds = new Set();
function collectIds(node) {
  if (
    ts.isVariableDeclaration(node) &&
    node.name &&
    node.name.text === "QUESTIONS" &&
    node.initializer &&
    ts.isArrayLiteralExpression(node.initializer)
  ) {
    for (const el of node.initializer.elements) {
      if (ts.isObjectLiteralExpression(el)) {
        const p = el.properties.find((m) => m.name && m.name.text === "id");
        if (p && p.initializer) presentIds.add(p.initializer.text);
      }
    }
  }
  ts.forEachChild(node, collectIds);
}
collectIds(sf);

const toAppend = reconstructed.filter((q) => !presentIds.has(q.id));
console.log(`Reconstrúdas a adicionar: ${toAppend.length}`);

// ---------- transform: aplica rewrites nas 263 e anexa as 36 ----------
const transform = (context) => (root) => {
  function visit(node) {
    if (
      ts.isVariableDeclaration(node) &&
      node.name &&
      node.name.text === "QUESTIONS" &&
      node.initializer &&
      ts.isArrayLiteralExpression(node.initializer)
    ) {
      const newElements = node.initializer.elements.map((el) => {
        if (!ts.isObjectLiteralExpression(el)) return el;
        const idProp = el.properties.find((m) => m.name && m.name.text === "id");
        const id = idProp && idProp.initializer ? idProp.initializer.text : null;
        const out = id ? cache[id] && cache[id].out : null;
        if (!out) return el;
        const newProps = el.properties.map((prop) => {
          const name = prop.name && prop.name.text;
          if (
            name &&
            TARGETS.includes(name) &&
            ts.isPropertyAssignment(prop) &&
            (ts.isStringLiteral(prop.initializer) ||
              ts.isNoSubstitutionTemplateLiteral(prop.initializer))
          ) {
            const val = out[name] != null ? String(out[name]) : "";
            return ts.factory.updatePropertyAssignment(
              prop,
              prop.name,
              ts.factory.createStringLiteral(val, true)
            );
          }
          return prop;
        });
        return ts.factory.updateObjectLiteralExpression(el, newProps);
      });

      // anexa as reconstrúdas
      const appended = toAppend.map((q) => {
        const props = [
          ts.factory.createPropertyAssignment("id", ts.factory.createStringLiteral(q.id, true)),
          ts.factory.createPropertyAssignment("category", ts.factory.createStringLiteral(q.category, true)),
          ts.factory.createPropertyAssignment("statement", ts.factory.createStringLiteral(q.statement, true)),
          ts.factory.createPropertyAssignment(
            "options",
            ts.factory.createArrayLiteralExpression(
              q.options.map((o) => ts.factory.createStringLiteral(o, true)),
              true
            )
          ),
          ts.factory.createPropertyAssignment("correctIndex", ts.factory.createNumericLiteral(String(q.correctIndex))),
          ts.factory.createPropertyAssignment("explanation", ts.factory.createStringLiteral(q.explanation, true)),
        ];
        if (q.detailedExplanation)
          props.push(ts.factory.createPropertyAssignment("detailedExplanation", ts.factory.createStringLiteral(q.detailedExplanation, true)));
        if (q.commonMistake)
          props.push(ts.factory.createPropertyAssignment("commonMistake", ts.factory.createStringLiteral(q.commonMistake, true)));
        if (q.tip)
          props.push(ts.factory.createPropertyAssignment("tip", ts.factory.createStringLiteral(q.tip, true)));
        props.push(ts.factory.createPropertyAssignment("incidence", ts.factory.createStringLiteral(q.incidence, true)));
        props.push(ts.factory.createPropertyAssignment("difficulty", ts.factory.createNumericLiteral(String(q.difficulty))));
        if (q.trap)
          props.push(ts.factory.createPropertyAssignment("trap", ts.factory.createTrue()));
        return ts.factory.createObjectLiteralExpression(props, true);
      });

      return ts.factory.updateVariableDeclaration(
        node,
        node.name,
        node.exclamationToken,
        node.type,
        ts.factory.updateArrayLiteralExpression(node.initializer, [...newElements, ...appended])
      );
    }
    return ts.visitEachChild(node, visit, context);
  }
  return visit(root);
};

const result = ts.transform(sf, [transform]);
const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
const newText = printer.printFile(result.transformed[0]);

fs.writeFileSync(OUT, newText, "utf8");

// ---------- verificação ----------
const sf2 = ts.createSourceFile(OUT, newText, ts.ScriptTarget.Latest, true);
let count = 0;
function countQ(node) {
  if (ts.isVariableDeclaration(node) && node.name && node.name.text === "QUESTIONS" && node.initializer && ts.isArrayLiteralExpression(node.initializer)) {
    count = node.initializer.elements.filter((e) => ts.isObjectLiteralExpression(e)).length;
  }
  ts.forEachChild(node, countQ);
}
countQ(sf2);
console.log(`Total de questões em ${path.basename(OUT)}: ${count}`);
console.log(`Salvo em: ${OUT}`);
