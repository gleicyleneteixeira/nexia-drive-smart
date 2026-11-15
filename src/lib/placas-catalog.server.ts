// Catálogo rápido de imagens de placas enviado pelo painel.
//
// Toda imagem que sobe em `library/images` pelo admin também é registrada em
// src/data/placas-catalog-named.json — assim, nas próximas sessões, dá para
// achar a imagem tanto pelo nome da placa quanto pelo código, sem precisar
// listar o bucket. No dev local (repositório na mesma máquina) o arquivo é
// atualizado a cada upload; em produção o handler falha de forma controlada e
// o catálogo é ressincronizado no dev seguinte.
import { createServerFn } from "@tanstack/react-start";
import fs from "node:fs";
import path from "node:path";

export type EntradaCatalogoInput = {
  /** Nome do arquivo dentro de library/images/ (ex.: placa-cruzamento-de-vias-A-6.png) */
  file: string;
  publicUrl: string;
  bytes?: number;
  /** Nome original (sem extensão) do arquivo escolhido no computador */
  nomeOriginal?: string;
  origem?: string;
};

type EntradaCatalogo = Record<string, unknown> & {
  file: string;
  public_url?: string;
  code?: string | null;
  name?: string | null;
};

/** `placa-cruzamento-de-vias-A-6` -> `A-6` (código oficial no fim do nome). */
function extrairCodigo(file: string): string | null {
  const m = file.replace(/\.[^.]+$/, "").match(/^placa-.+-([A-Za-z]{1,4}-\d{1,2}[a-zA-Z]?)$/);
  return m ? m[1] : null;
}

function arquivoCatalogo(): string {
  // cwd = raiz do repositório no dev local (vite/nitro); em produção o caminho
  // não existe e o catch devolve { ok: false } sem derrubar o upload.
  return path.resolve(process.cwd(), "src/data/placas-catalog-named.json");
}

export const registrarImagemNoCatalogo = createServerFn({ method: "POST" })
  .inputValidator((d: EntradaCatalogoInput) => d)
  .handler(async ({ data: d }) => {
    try {
      const caminho = arquivoCatalogo();
      let entradas: EntradaCatalogo[] = [];
      try {
        entradas = JSON.parse(fs.readFileSync(caminho, "utf8"));
        if (!Array.isArray(entradas)) entradas = [];
      } catch {
        entradas = [];
      }

      const codigo = extrairCodigo(d.file);
      const i = entradas.findIndex((e) => e.file === d.file);
      const anterior: EntradaCatalogo | undefined = i >= 0 ? entradas[i] : undefined;
      const nova: EntradaCatalogo = {
        ...anterior,
        code: (anterior?.code as string | null | undefined) ?? codigo,
        name:
          (anterior?.name as string | null | undefined) ?? d.nomeOriginal?.trim() ?? d.file,
        category: (anterior?.category as string | null | undefined) ?? null,
        ext: d.file.includes(".") ? d.file.split(".").pop()! : null,
        file: d.file,
        public_url: d.publicUrl,
        bytes: d.bytes ?? (anterior?.bytes as number | undefined) ?? null,
        source: "painel",
        origem: d.origem ?? null,
        uploadedAt: new Date().toISOString(),
      };

      if (i >= 0) entradas[i] = nova;
      else entradas.push(nova);

      fs.writeFileSync(caminho, JSON.stringify(entradas, null, 2) + "\n", "utf8");
      return { ok: true as const, arquivo: caminho, total: entradas.length };
    } catch (err) {
      return { ok: false as const, motivo: err instanceof Error ? err.message : String(err) };
    }
  });

/**
 * Remove a entrada de um arquivo que saiu do bucket (ex.: rename no painel
 * reenvia com outro nome e apaga o antigo — o catálogo acompanha).
 */
export const removerImagemDoCatalogo = createServerFn({ method: "POST" })
  .inputValidator((d: { file: string }) => d)
  .handler(async ({ data }) => {
    try {
      const caminho = arquivoCatalogo();
      const entradas: EntradaCatalogo[] = JSON.parse(fs.readFileSync(caminho, "utf8"));
      const restantes = entradas.filter((e) => e.file !== data.file);
      if (restantes.length === entradas.length) return { ok: true as const, removido: false };
      fs.writeFileSync(caminho, JSON.stringify(restantes, null, 2) + "\n", "utf8");
      return { ok: true as const, removido: true, total: restantes.length };
    } catch (err) {
      return { ok: false as const, motivo: err instanceof Error ? err.message : String(err) };
    }
  });
