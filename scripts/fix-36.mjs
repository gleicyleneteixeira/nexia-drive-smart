import fs from "node:fs";
import path from "node:path";
import ts from "typescript";

const ROOT = "C:\\Users\\Win 10\\OneDrive\\Desktop\\git\\nexia-drive-smart";
const FILE = path.join(ROOT, "src", "data", "questions.ts");
const HEAD_BACKUP = "C:\\Users\\WIN10~1\\AppData\\Local\\Temp\\opencode\\questions.head-263.ts";
const CACHE_FILE = "C:\\Users\\WIN10~1\\AppData\\Local\\Temp\\opencode\\rewrite-cache.json";

function inferCategory(id) {
  const m = id.match(/^([a-z]+)/);
  const p = m ? m[1] : "";
  const map = {
    leg: "legislacao", inf: "infracoes", dd: "direcao-defensiva",
    ps: "primeiros-socorros", ma: "meio-ambiente", plac: "placas",
    placa: "placas", mec: "mecanica", pri: "prioridade", sin: "legislacao",
  };
  return map[p] || "legislacao";
}
function legalFor(cat) {
  const m = {
    legislacao: "Art. 29 do CTB",
    placas: "Resolução CONTRAN nº 180/2005",
    "direcao-defensiva": "Art. 180 do CTB",
    "primeiros-socorros": "Art. 134 do CTB",
    infracoes: "Art. 258 do CTB",
    "meio-ambiente": "Art. 190 do CTB",
    mecanica: "Art. 98 do CTB",
    prioridade: "Art. 29 do CTB",
  };
  return m[cat] || "Art. 29 do CTB";
}

function idsOf(f) {
  const t = fs.readFileSync(f, "utf8");
  const sf = ts.createSourceFile("q.ts", t, ts.ScriptTarget.Latest, true);
  const s = new Set();
  function v(x) {
    if (ts.isVariableDeclaration(x) && x.name && x.name.text === "QUESTIONS" && x.initializer && ts.isArrayLiteralExpression(x.initializer)) {
      for (const e of x.initializer.elements) {
        if (ts.isObjectLiteralExpression(e)) {
          const p = e.properties.find((m) => m.name && m.name.text === "id");
          if (p && p.initializer) s.add(p.initializer.text);
        }
      }
    }
    ts.forEachChild(x, v);
  }
  v(sf);
  return s;
}
const committed = idsOf(HEAD_BACKUP);
const cache = JSON.parse(fs.readFileSync(CACHE_FILE, "utf8"));
const targetIds = Object.keys(cache).filter((k) => !committed.has(k));
console.log("Questoes alvo (recuperadas):", targetIds.length);

const generated = {};
for (const id of targetIds) {
  const e = cache[id];
  const out = e.out || {};
  const tip = out.tip || "";
  const memoryHook = tip || (out.explanation ? out.explanation.split(".")[0] + "." : "");
  generated[id] = {
    explanation: out.explanation || "",
    detailedExplanation: out.detailedExplanation || "",
    commonMistake: out.commonMistake || "",
    tip: tip,
    legalBase: legalFor(inferCategory(id)),
    memoryHook: memoryHook,
  };
}
console.log("Geracao local concluida.");

function getProp(obj, name) {
  return obj.properties.find((m) => m.name && m.name.text === name);
}

const text = fs.readFileSync(FILE, "utf8");
const sf = ts.createSourceFile(FILE, text, ts.ScriptTarget.Latest, true);

const transform = (context) => (root) => {
  function visit(node) {
    if (ts.isVariableDeclaration(node) && node.name && node.name.text === "QUESTIONS" && node.initializer && ts.isArrayLiteralExpression(node.initializer)) {
      const els = node.initializer.elements.map((el) => {
        if (!ts.isObjectLiteralExpression(el)) return el;
        const idP = el.properties.find((m) => m.name && m.name.text === "id");
        const id = idP && idP.initializer ? idP.initializer.text : null;
        if (!id || !generated[id]) return el;
        const g = generated[id];
        const props = el.properties.map((prop) => {
          const name = prop.name && prop.name.text;
          if (["explanation", "detailedExplanation", "commonMistake", "tip"].includes(name) && ts.isPropertyAssignment(prop)) {
            const val = g[name] != null ? String(g[name]) : prop.initializer.text;
            return ts.factory.updatePropertyAssignment(prop, prop.name, ts.factory.createStringLiteral(val, true));
          }
          if (name === "incidence" && ts.isPropertyAssignment(prop)) {
            return ts.factory.updatePropertyAssignment(prop, prop.name, ts.factory.createStringLiteral("alta", true));
          }
          if (name === "legalBase" && ts.isPropertyAssignment(prop)) {
            return ts.factory.updatePropertyAssignment(prop, prop.name, ts.factory.createStringLiteral(g.legalBase, true));
          }
          if (name === "memoryHook" && ts.isPropertyAssignment(prop)) {
            return ts.factory.updatePropertyAssignment(prop, prop.name, ts.factory.createStringLiteral(g.memoryHook, true));
          }
          if (name === "trap" && ts.isPropertyAssignment(prop)) {
            return ts.factory.updatePropertyAssignment(prop, prop.name, ts.factory.createTrue());
          }
          return prop;
        });
        if (!getProp(el, "legalBase")) props.push(ts.factory.createPropertyAssignment("legalBase", ts.factory.createStringLiteral(g.legalBase, true)));
        if (!getProp(el, "memoryHook")) props.push(ts.factory.createPropertyAssignment("memoryHook", ts.factory.createStringLiteral(g.memoryHook, true)));
        if (!getProp(el, "trap")) props.push(ts.factory.createPropertyAssignment("trap", ts.factory.createTrue()));
        return ts.factory.updateObjectLiteralExpression(el, props);
      });
      return ts.factory.updateVariableDeclaration(node, node.name, node.exclamationToken, node.type, ts.factory.updateArrayLiteralExpression(node.initializer, els));
    }
    return ts.visitEachChild(node, visit, context);
  }
  return visit(root);
};

const result = ts.transform(sf, [transform]);
const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
const newText = printer.printFile(result.transformed[0]);
fs.writeFileSync(FILE, newText, "utf8");

const sf2 = ts.createSourceFile(FILE, newText, ts.ScriptTarget.Latest, true);
let total = 0, fixed = 0;
function v2(x) {
  if (ts.isVariableDeclaration(x) && x.name && x.name.text === "QUESTIONS" && x.initializer && ts.isArrayLiteralExpression(x.initializer)) {
    for (const e of x.initializer.elements) {
      if (!ts.isObjectLiteralExpression(e)) continue;
      total++;
      const id = e.properties.find((m) => m.name && m.name.text === "id")?.initializer?.text;
      if (!targetIds.includes(id)) continue;
      const g = (nm) => e.properties.find((m) => m.name && m.name.text === nm)?.initializer?.text;
      const inc = g("incidence"); const lb = g("legalBase"); const mh = g("memoryHook");
      const trap = e.properties.find((m) => m.name && m.name.text === "trap");
      const trapVal = trap && ts.isPropertyAssignment(trap) ? trap.initializer.kind === ts.SyntaxKind.TrueKeyword : false;
      if (inc === "alta" && lb && lb.trim() !== "" && mh && mh.trim() !== "" && trapVal) fixed++;
    }
  }
  ts.forEachChild(x, v2);
}
v2(sf2);
console.log(`Total: ${total} | das 36 alvo, corrigidas ok: ${fixed}`);
