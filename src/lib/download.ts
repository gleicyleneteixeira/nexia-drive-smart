/**
 * Download de arquivos da biblioteca.
 *
 * As URLs do Storage são assinadas e cross-origin, então o atributo `download`
 * de um <a> é ignorado pelo navegador. Baixamos como blob e disparamos um
 * <a download> de verdade; se o fetch falhar (rede/CORS), caímos para abrir a
 * URL em nova aba — o usuário ainda consegue salvar o arquivo.
 */

function dispararDownload(blob: Blob, nomeArquivo: string) {
  const objectUrl = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = objectUrl;
  a.download = nomeArquivo;
  document.body.appendChild(a);
  a.click();
  a.remove();
  // Revoga depois do navegador começar o download (evita vazamento de memória).
  setTimeout(() => URL.revokeObjectURL(objectUrl), 10_000);
}

/** Baixa `url` como `nomeArquivo`. Nunca lança — silencia e faz fallback. */
export async function baixarArquivo(url: string, nomeArquivo: string): Promise<void> {
  if (!url) return;
  try {
    const resp = await fetch(url);
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const blob = await resp.blob();
    if (blob.size > 0) {
      dispararDownload(blob, nomeArquivo);
      return;
    }
    throw new Error("arquivo vazio");
  } catch {
    // Fallback: abre em nova aba (o navegador permite "Salvar como").
    window.open(url, "_blank", "noreferrer");
  }
}

/** Nome de arquivo seguro a partir do título do material (ex.: "Apostila CTB.pdf"). */
export function nomeArquivoPdf(titulo: string): string {
  const base = (titulo || "material")
    .trim()
    .replace(/[\\/:*?"<>|]+/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  const nome = base || "material";
  return /\.pdf$/i.test(nome) ? nome : `${nome}.pdf`;
}
