import { createFileRoute } from "@tanstack/react-router";
import { RequireAuth } from "@/components/RequireAuth";
import { PdfReader } from "@/components/PdfReader";

export const Route = createFileRoute("/livro")({
  component: LivroPage,
  head: () => ({ meta: [{ title: "Leitor de PDF — NEXIA DRIVE" }] }),
});

function LivroPage() {
  return (
    <RequireAuth>
      <div className="mx-auto max-w-7xl px-2 sm:px-4 py-3 min-h-[85vh] flex flex-col">
        <h1 className="text-sm font-semibold text-muted-foreground mb-2">Leitor de Livros PDF</h1>
        <PdfReader className="flex-1" />
      </div>
    </RequireAuth>
  );
}
