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
      <div className="mx-auto max-w-6xl px-4 py-6 min-h-[80vh] flex flex-col">
        <h1 className="text-xl font-display font-bold mb-4">Leitor de Livros PDF</h1>
        <PdfReader className="flex-1" />
      </div>
    </RequireAuth>
  );
}
