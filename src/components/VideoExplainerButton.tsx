import { ExternalLink } from "lucide-react";

type VideoPlatform = "YouTube" | "TikTok" | "Instagram";

function detectPlatform(url: string): VideoPlatform | null {
  try {
    const host = new URL(url).hostname.toLowerCase().replace(/^www\./, "");
    if (host === "youtu.be" || host.endsWith("youtube.com")) return "YouTube";
    if (host === "tiktok.com" || host.endsWith(".tiktok.com")) return "TikTok";
    if (host === "instagram.com" || host.endsWith(".instagram.com")) return "Instagram";
  } catch {
    return null;
  }
  return null;
}

export function VideoExplainerButton({ url }: { url?: string }) {
  const trimmedUrl = url?.trim();
  if (!trimmedUrl) return null;

  const platform = detectPlatform(trimmedUrl);
  if (!platform) return null;

  return (
    <a
      href={trimmedUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/10 px-3 py-2 text-xs font-semibold text-primary transition-colors hover:bg-primary/15"
    >
      <span aria-hidden="true">🎥</span>
      <span>Ver vídeo explicativo · {platform}</span>
      <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
    </a>
  );
}
