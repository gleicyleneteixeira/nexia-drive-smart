import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchLibraryItems, checkIsAdmin, type LibraryItem, type LibraryItemType } from "@/lib/library";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Loader2, Upload, Trash2, Pencil, LogOut, ArrowLeft, Search, Download, Users, KeyRound, UserX, XCircle, Star, Heart, Volume2 } from "lucide-react";
import * as XLSX from "xlsx";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useServerFn } from "@tanstack/react-start";
import { adminResetUserPassword } from "@/lib/admin-users.functions";
import { sendPasswordReset, deleteUser, activateUser, deactivateUser } from "@/lib/admin-operations.server";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
  head: () => ({ meta: [{ title: "Admin — Biblioteca" }] }),
});

function AdminPage() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate({ to: "/auth" });
        return;
      }
      setUserEmail(user.email ?? null);
      const ok = await checkIsAdmin();
      setIsAdmin(ok);
      setChecking(false);
    })();
  }, [navigate]);

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  }

  if (checking) {
    return <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  }

  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <div className="glass rounded-3xl p-8">
          <h1 className="text-xl font-display font-bold mb-2">Acesso restrito</h1>
          <p className="text-sm text-muted-foreground mb-4">
            Sua conta ({userEmail}) ainda não é administradora.
            Peça pro suporte liberar acesso admin.
          </p>
          <Button variant="outline" onClick={signOut} className="w-full">
            <LogOut className="h-4 w-4 mr-2" /> Sair
          </Button>
          <Link to="/" className="block mt-3 text-xs text-muted-foreground">← Voltar ao início</Link>
        </div>
      </div>
    );
  }

  return <AdminDashboard email={userEmail} onSignOut={signOut} />;
}

function AdminDashboard({ email, onSignOut }: { email: string | null; onSignOut: () => void }) {
  const qc = useQueryClient();
  const { data: items = [], refetch } = useQuery({
    queryKey: ["library", "all"],
    queryFn: () => fetchLibraryItems(true),
  });
  const [editing, setEditing] = useState<LibraryItem | null>(null);

  async function onDelete(item: LibraryItem) {
    if (!confirm(`Apagar "${item.title}"?`)) return;
    const { error } = await supabase.from("library_items").delete().eq("id", item.id);
    if (error) return toast.error(error.message);
    toast.success("Apagado");
    qc.invalidateQueries({ queryKey: ["library"] });
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 space-y-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <Link to="/" className="text-xs text-muted-foreground flex items-center gap-1 hover:text-foreground">
            <ArrowLeft className="h-3 w-3" /> Início
          </Link>
          <h1 className="text-2xl font-display font-bold">Painel Admin</h1>
          <p className="text-sm text-muted-foreground">{email}</p>
        </div>
        <Button variant="outline" onClick={onSignOut} size="sm">
          <LogOut className="h-4 w-4 mr-2" /> Sair
        </Button>
      </div>

      <Tabs defaultValue="users">
        <TabsList className="grid grid-cols-3 w-full max-w-lg">
          <TabsTrigger value="users" className="gap-2"><Users className="h-4 w-4" /> Usuários</TabsTrigger>
          <TabsTrigger value="library" className="gap-2"><Upload className="h-4 w-4" /> Biblioteca</TabsTrigger>
          <TabsTrigger value="ratings" className="gap-2"><Star className="h-4 w-4" /> Avaliações</TabsTrigger>
        </TabsList>
        <TabsContent value="users" className="mt-4">
          <UsersPanel />
        </TabsContent>
        <TabsContent value="ratings" className="mt-4">
          <RatingsPanel />
        </TabsContent>
        <TabsContent value="library" className="mt-4 space-y-6">
          <ItemForm
            editing={editing}
            onDone={() => {
              setEditing(null);
              refetch();
              qc.invalidateQueries({ queryKey: ["library"] });
            }}
          />
          <div className="glass rounded-2xl p-4">
            <h2 className="font-display font-bold mb-3">Itens ({items.length})</h2>
            <div className="space-y-2">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-background/50">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{item.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.item_type.toUpperCase()} · {item.published ? "Publicado" : "Rascunho"}
                      {item.is_paid && ` · R$ ${((item.price_cents ?? 0) / 100).toFixed(2)}`}
                    </p>
                  </div>
                  <Button size="icon" variant="ghost" onClick={() => setEditing(item)}><Pencil className="h-4 w-4" /></Button>
                  <Button size="icon" variant="ghost" onClick={() => onDelete(item)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </div>
              ))}
              {items.length === 0 && <p className="text-sm text-muted-foreground text-center py-6">Nenhum item ainda. Adicione abaixo.</p>}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

type ProfileRow = {
  id: string;
  display_name: string | null;
  email: string | null;
  cpf: string | null;
  phone: string | null;
  employment_status: string | null;
  employment_other: string | null;
  status: string | null;
  expires_at: string | null;
  created_at: string;
};

const EMPLOYMENT_LABELS: Record<string, string> = {
  clt: "CLT",
  carteira_assinada: "CLT",
  autonomo: "Autônomo(a)",
  estudante: "Estudante",
  trabalha_estuda: "Trabalha e Estuda",
  desempregado: "Desempregado(a)",
  nao_trabalha: "Não trabalha",
  outro: "Outros",
};

const PAGE_SIZES = [10, 20, 50, 100] as const;

function UsersPanel() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [resetUser, setResetUser] = useState<ProfileRow | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const resetPasswordFn = useServerFn(adminResetUserPassword);

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    if (!resetUser) return;
    setResetLoading(true);
    try {
      await resetPasswordFn({ data: { userId: resetUser.id, newPassword } });
      toast.success(`Senha de ${resetUser.display_name ?? resetUser.email} redefinida.`);
      setResetUser(null);
      setNewPassword("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao redefinir senha.");
    } finally {
      setResetLoading(false);
    }
  }

  const [deleteTarget, setDeleteTarget] = useState<ProfileRow | null>(null);
  const [deleting, setDeleting] = useState(false);

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["admin", "profiles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, display_name, email, cpf, phone, employment_status, employment_other, status, expires_at, created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as ProfileRow[];
    },
  });

  const filtered = users.filter((u) => {
    if (filter !== "all" && u.employment_status !== filter) return false;
    if (statusFilter !== "all" && u.status !== statusFilter) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      (u.display_name ?? "").toLowerCase().includes(q) ||
      (u.email ?? "").toLowerCase().includes(q) ||
      (u.cpf ?? "").toLowerCase().includes(q) ||
      (u.phone ?? "").toLowerCase().includes(q)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paginatedUsers = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  function buildRows() {
    return filtered.map((u) => ({
      Nome: u.display_name ?? "",
      "E-mail": u.email ?? "",
      CPF: u.cpf ?? "",
      Telefone: u.phone ?? "",
      Pagamento: u.status === "ativo" ? "Pago" : u.status === "pendente_pagamento" ? "Pendente" : (u.status ?? ""),
      "Situação profissional":
        u.employment_status === "outro"
          ? `Outros: ${u.employment_other ?? ""}`
          : EMPLOYMENT_LABELS[u.employment_status ?? ""] ?? (u.employment_status ?? ""),
      "Data de cadastro": new Date(u.created_at).toLocaleString("pt-BR"),
    }));
  }

  function exportXlsx() {
    const ws = XLSX.utils.json_to_sheet(buildRows());
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Usuários");
    XLSX.writeFile(wb, `usuarios-${new Date().toISOString().slice(0, 10)}.xlsx`);
  }

  function exportCsv() {
    const rows = buildRows();
    if (!rows.length) return;
    const headers = Object.keys(rows[0]);
    const escape = (v: unknown) => {
      const s = String(v ?? "");
      return /[",\n;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const csv =
      headers.join(",") + "\n" +
      rows.map((r) => headers.map((h) => escape((r as Record<string, unknown>)[h])).join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `usuarios-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="glass rounded-2xl p-4 space-y-4">
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex-1 min-w-[200px]">
          <Label htmlFor="search" className="text-xs">Pesquisar</Label>
          <div className="relative">
            <Search className="h-4 w-4 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input id="search" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Nome, e-mail, CPF ou telefone" className="pl-8" />
          </div>
        </div>
        <div className="min-w-[160px]">
          <Label className="text-xs">Situação</Label>
          <select value={filter} onChange={(e) => { setFilter(e.target.value); setPage(1); }}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm">
            <option value="all">Todas</option>
            <option value="clt">CLT</option>
            <option value="autonomo">Autônomo(a)</option>
            <option value="estudante">Estudante</option>
            <option value="trabalha_estuda">Trabalha e Estuda</option>
            <option value="desempregado">Desempregado(a)</option>
            <option value="outro">Outros</option>
          </select>
        </div>
        <div className="min-w-[140px]">
          <Label className="text-xs">Pagamento</Label>
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm">
            <option value="all">Todos</option>
            <option value="ativo">Pago (Ativo)</option>
            <option value="pendente_pagamento">Pendente</option>
          </select>
        </div>
        <div className="min-w-[90px]">
          <Label className="text-xs">Por página</Label>
          <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm">
            {PAGE_SIZES.map((size) => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={exportCsv} disabled={!filtered.length}>
            <Download className="h-4 w-4 mr-1" /> CSV
          </Button>
          <Button size="sm" onClick={exportXlsx} disabled={!filtered.length}>
            <Download className="h-4 w-4 mr-1" /> Excel
          </Button>
        </div>
      </div>

      <div className="text-xs text-muted-foreground">
        {isLoading ? "Carregando…" : (
          <span>
            {filtered.length} de {users.length} usuários &middot;
            <span className="text-success"> {users.filter(u => u.status === "ativo").length} pago</span>
            &middot;
            <span className="text-warning"> {users.filter(u => u.status === "pendente_pagamento").length} pendente</span>
          </span>
        )}
      </div>

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setDeleteTarget(null)}>
          <div className="bg-card rounded-2xl p-6 max-w-sm w-full mx-4 shadow-xl border" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-display font-bold text-lg mb-2 text-destructive">Excluir usuário</h3>
            <p className="text-sm text-muted-foreground mb-1">
              Tem certeza? Esta ação <strong>não pode ser desfeita</strong>.
            </p>
            <p className="text-sm mb-4">
              {deleteTarget.display_name} &lt;{deleteTarget.email}&gt;
            </p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setDeleteTarget(null)} disabled={deleting}>
                Cancelar
              </Button>
              <Button variant="destructive" className="flex-1" disabled={deleting} onClick={async () => {
                setDeleting(true);
                try {
                  await deleteUser({ data: { userId: deleteTarget.id } });
                  toast.success("Usuário excluído");
                  setDeleteTarget(null);
                  qc.invalidateQueries({ queryKey: ["admin", "profiles"] });
                } catch (err) {
                  toast.error(err instanceof Error ? err.message : "Erro");
                } finally {
                  setDeleting(false);
                }
              }}>
                {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Excluir"}
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border border-border/40">
        <table className="w-full text-sm">
          <thead className="bg-background/50 text-xs uppercase text-muted-foreground">
            <tr>
              <th className="text-left px-3 py-2">Nome</th>
              <th className="text-left px-3 py-2">E-mail</th>
              <th className="text-left px-3 py-2">CPF</th>
              <th className="text-left px-3 py-2">Telefone</th>
              <th className="text-left px-3 py-2">Pagamento</th>
              <th className="text-left px-3 py-2">Situação</th>
              <th className="text-left px-3 py-2">Cadastro</th>
              <th className="text-right px-3 py-2">Ações</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((u) => (
              <tr key={u.id} className="border-t border-border/30">
                <td className="px-3 py-2">{u.display_name ?? "—"}</td>
                <td className="px-3 py-2">{u.email ?? "—"}</td>
                <td className="px-3 py-2 whitespace-nowrap">{u.cpf ?? "—"}</td>
                <td className="px-3 py-2">{u.phone ?? "—"}</td>
                <td className="px-3 py-2 whitespace-nowrap">
                  {u.status === "ativo" ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-success bg-success/10 border border-success/30 px-2 py-0.5 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-success" />
                      Ativo
                    </span>
                  ) : u.status === "pendente_pagamento" ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-warning bg-warning/10 border border-warning/30 px-2 py-0.5 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-warning" />
                      Pendente
                    </span>
                  ) : (
                    <span className="text-[11px] text-muted-foreground">{u.status ?? "—"}</span>
                  )}
                  {u.status === "ativo" && u.expires_at && (
                    <span className="block text-[10px] text-muted-foreground mt-0.5">
                      Expira: {new Date(u.expires_at).toLocaleDateString("pt-BR")}
                    </span>
                  )}
                </td>
                <td className="px-3 py-2">
                  {u.employment_status === "outro"
                    ? `Outro: ${u.employment_other ?? ""}`
                    : EMPLOYMENT_LABELS[u.employment_status ?? ""] ?? (u.employment_status ?? "—")}
                </td>
                <td className="px-3 py-2 whitespace-nowrap">{new Date(u.created_at).toLocaleDateString("pt-BR")}</td>
                <td className="px-3 py-2 text-right whitespace-nowrap">
                  {u.status !== "ativo" ? (
                    <button
                      title="Ativar usuário"
                      onClick={async () => {
                        try {
                          const result = await activateUser({ data: { userId: u.id } });
                          toast.success(`Usuário ativado (plano: ${result.planType})`);
                          qc.invalidateQueries({ queryKey: ["admin", "profiles"] });
                        } catch (err) {
                          toast.error(err instanceof Error ? err.message : "Erro ao ativar");
                        }
                      }}
                      className="inline-flex items-center justify-center h-8 w-8 rounded-md text-success hover:text-success/80 hover:bg-success/10"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                    </button>
                  ) : (
                    <button
                      title="Desativar usuário"
                      onClick={async () => {
                        try {
                          await deactivateUser({ data: { userId: u.id } });
                          toast.success("Usuário desativado");
                          qc.invalidateQueries({ queryKey: ["admin", "profiles"] });
                        } catch (err) {
                          toast.error(err instanceof Error ? err.message : "Erro ao desativar");
                        }
                      }}
                      className="inline-flex items-center justify-center h-8 w-8 rounded-md text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                    >
                      <XCircle className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    title="Redefinir senha"
                    onClick={() => { setResetUser(u); setNewPassword(""); }}
                    className="inline-flex items-center justify-center h-8 w-8 rounded-md text-muted-foreground hover:text-foreground hover:bg-background/80"
                  >
                    <KeyRound className="h-4 w-4" />
                  </button>
                  <button
                    title="Excluir usuário"
                    onClick={() => setDeleteTarget(u)}
                    className="inline-flex items-center justify-center h-8 w-8 rounded-md text-muted-foreground hover:text-destructive hover:bg-background/80"
                  >
                    <UserX className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
            {!isLoading && filtered.length === 0 && (
              <tr><td colSpan={8} className="text-center text-muted-foreground py-6">Nenhum usuário encontrado.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {filtered.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
          <div className="text-muted-foreground">
            Página {safePage} de {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={safePage <= 1}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage >= totalPages}
            >
              Próxima
            </Button>
          </div>
        </div>
      )}

      <Dialog open={!!resetUser} onOpenChange={(o) => { if (!o) { setResetUser(null); setNewPassword(""); } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Redefinir senha</DialogTitle>
            <DialogDescription>
              Nova senha para <strong>{resetUser?.display_name ?? resetUser?.email}</strong>. A pessoa poderá entrar imediatamente com esta senha.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleReset} className="space-y-4">
            <div>
              <Label htmlFor="newpw">Nova senha (mínimo 6 caracteres)</Label>
              <Input id="newpw" type="text" required minLength={6} maxLength={72}
                value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Ex: Nexi@2026!" />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={resetLoading} className="w-full">
                {resetLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Confirmar
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ItemForm({ editing, onDone }: { editing: LibraryItem | null; onDone: () => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [itemType, setItemType] = useState<LibraryItemType>("pdf");
  const [url, setUrl] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [isPaid, setIsPaid] = useState(false);
  const [priceCents, setPriceCents] = useState("");
  const [published, setPublished] = useState(true);
  const [moduleType, setModuleType] = useState<"teorico" | "psicotecnico" | "direcao">("teorico");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [slides, setSlides] = useState<{ id: string; file: File | null; image_url: string; text: string; audioFile?: File | null; audio_url?: string }[]>([
    { id: Math.random().toString(), file: null, image_url: "", text: "", audioFile: null, audio_url: "" },
  ]);
  const [narrated, setNarrated] = useState(false);

  // Carregar rascunho do localStorage ao montar
  useEffect(() => {
    if (!editing && typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("nexia:admin:draft_library_item");
        if (raw) {
          const draft = JSON.parse(raw);
          if (draft.title) setTitle(draft.title);
          if (draft.description) setDescription(draft.description);
          if (draft.itemType) setItemType(draft.itemType);
          if (draft.url) setUrl(draft.url);
          if (draft.coverUrl) setCoverUrl(draft.coverUrl);
          if (draft.isPaid !== undefined) setIsPaid(draft.isPaid);
          if (draft.priceCents) setPriceCents(draft.priceCents);
          if (draft.published !== undefined) setPublished(draft.published);
          if (draft.moduleType) setModuleType(draft.moduleType);
          if (draft.narrated !== undefined) setNarrated(draft.narrated);
          if (draft.slides) {
            setSlides(draft.slides.map((s: any) => ({ ...s, id: s.id || Math.random().toString(), file: null, audioFile: null })));
          }
        }
      } catch (err) {
        console.error("Failed to load draft from localStorage", err);
      }
    }
  }, [editing]);

  // Salvar rascunho no localStorage a cada alteração
  useEffect(() => {
    if (!editing && typeof window !== "undefined") {
      const draft = {
        title,
        description,
        itemType,
        url,
        coverUrl,
        isPaid,
        priceCents,
        published,
        moduleType,
        narrated,
        slides: slides.map((s) => ({ id: s.id, image_url: s.image_url, text: s.text, audio_url: s.audio_url })),
      };
      localStorage.setItem("nexia:admin:draft_library_item", JSON.stringify(draft));
    }
  }, [editing, title, description, itemType, url, coverUrl, isPaid, priceCents, published, moduleType, narrated, slides]);

  useEffect(() => {
    if (editing) {
      setTitle(editing.title);
      setDescription(editing.description ?? "");
      setItemType(editing.item_type);
      setUrl(editing.url);
      setCoverUrl(editing.cover_url ?? "");
      setIsPaid(editing.is_paid);
      setPriceCents(editing.price_cents ? String(editing.price_cents) : "");
      setPublished(editing.published);
      setModuleType((editing.module_type as "teorico" | "psicotecnico" | "direcao") || "teorico");
      setNarrated(editing.narrated ?? false);
      if (editing.item_type === "carousel" && Array.isArray(editing.slides)) {
        setSlides(
          editing.slides.map((s: any) => ({
            id: Math.random().toString(),
            file: null,
            image_url: s.image_url ?? "",
            text: s.text ?? "",
            audioFile: null,
            audio_url: s.audio_url ?? "",
          }))
        );
      } else {
        setSlides([{ id: Math.random().toString(), file: null, image_url: "", text: "", audioFile: null, audio_url: "" }]);
      }
    }
  }, [editing]);

  function reset() {
    setTitle(""); setDescription(""); setItemType("pdf"); setUrl("");
    setCoverUrl(""); setIsPaid(false); setPriceCents(""); setPublished(true);
    setPdfFile(null); setCoverFile(null); setModuleType("teorico");
    setSlides([{ id: Math.random().toString(), file: null, image_url: "", text: "", audioFile: null, audio_url: "" }]);
    setNarrated(false);
    if (typeof window !== "undefined") {
      localStorage.removeItem("nexia:admin:draft_library_item");
    }
  }

  async function uploadToBucket(file: File, folder: string): Promise<string> {
    const ext = file.name.split(".").pop() ?? "bin";
    const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from("library").upload(path, file);
    if (error) throw error;
    const { data } = supabase.storage.from("library").getPublicUrl(path);
    return data.publicUrl;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      let finalUrl = url;
      let finalCover = coverUrl;
      let finalSlides: any = null;

      if (itemType === "pdf" && pdfFile) {
        finalUrl = await uploadToBucket(pdfFile, "pdfs");
      }
      if (itemType === "image" && pdfFile) {
        finalUrl = await uploadToBucket(pdfFile, "images");
      }
      if (itemType === "carousel") {
        const uploadedSlides = [];
        for (const slide of slides) {
          let imageUrl = slide.image_url;
          if (slide.file) {
            imageUrl = await uploadToBucket(slide.file, "slides");
          }
          if (!imageUrl) {
            throw new Error("Cada slide do carrossel precisa de uma imagem.");
          }

          let audioUrl = slide.audio_url ?? "";
          if (slide.audioFile) {
            audioUrl = await uploadToBucket(slide.audioFile, "slides_audios");
          }

          uploadedSlides.push({ image_url: imageUrl, text: slide.text, audio_url: audioUrl });
        }
        if (uploadedSlides.length === 0) {
          throw new Error("Adicione pelo menos um slide no carrossel.");
        }
        finalSlides = uploadedSlides;
        finalUrl = uploadedSlides[0].image_url;
      }
      if (coverFile) {
        finalCover = await uploadToBucket(coverFile, "covers");
      }

      if (!finalUrl) throw new Error("Informe a URL ou faça upload do arquivo");

      const payload = {
        title,
        description: description || null,
        item_type: itemType,
        url: finalUrl,
        cover_url: finalCover || null,
        is_paid: isPaid,
        price_cents: isPaid && priceCents ? parseInt(priceCents, 10) : null,
        published,
        module_type: moduleType,
        slides: finalSlides,
        narrated,
      };

      if (editing) {
        const { error } = await supabase.from("library_items").update(payload).eq("id", editing.id);
        if (error) throw error;
        toast.success("Atualizado");
      } else {
        const { data: { user } } = await supabase.auth.getUser();
        const { error } = await supabase.from("library_items").insert({ ...payload, created_by: user?.id });
        if (error) throw error;
        toast.success("Item adicionado");
      }
      reset();
      onDone();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="glass rounded-2xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display font-bold">{editing ? "Editar item" : "Adicionar item"}</h2>
        {editing && (
          <Button type="button" variant="ghost" size="sm" onClick={() => { reset(); onDone(); }}>
            Cancelar edição
          </Button>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <Label>Título *</Label>
          <Input required value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          <Label>Tipo *</Label>
          <Select value={itemType} onValueChange={(v) => setItemType(v as LibraryItemType)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="pdf">Livrinho (PDF — vira página)</SelectItem>
              <SelectItem value="heyzine">Embed Heyzine (link de flipbook)</SelectItem>
              <SelectItem value="video">Vídeo (YouTube/Vimeo)</SelectItem>
              <SelectItem value="image">Imagem (foto/ilustração)</SelectItem>
              <SelectItem value="link">Link externo (site)</SelectItem>
              <SelectItem value="carousel">Carrossel de Imagens</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Categoria *</Label>
          <Select value={moduleType} onValueChange={(v) => setModuleType(v as "teorico" | "psicotecnico" | "direcao")}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="teorico">Teórico</SelectItem>
              <SelectItem value="psicotecnico">Psicotécnico</SelectItem>
              <SelectItem value="direcao">Direção</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label>Descrição</Label>
        <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} />
      </div>

      {itemType === "pdf" && (
        <div>
          <Label>Arquivo PDF {editing ? "(opcional — manter atual se vazio)" : "*"}</Label>
          <Input
            type="file"
            accept="application/pdf"
            onChange={(e) => setPdfFile(e.target.files?.[0] ?? null)}
          />
          {editing && url && <p className="text-xs text-muted-foreground mt-1">Atual: {url.split("/").pop()}</p>}
        </div>
      )}

      {(itemType === "heyzine" || itemType === "video" || itemType === "link") && (
        <div>
          <Label>URL {itemType === "heyzine" ? "(ex: https://heyzine.com/flip-book/xxx.html)" : "(site externo)"} *</Label>
          <Input required={!editing} value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." />
        </div>
      )}

      {itemType === "image" && (
        <div>
          <Label>Arquivo de Imagem {editing ? "(opcional — manter atual se vazio)" : "*"}</Label>
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => setPdfFile(e.target.files?.[0] ?? null)}
          />
          {editing && url && <p className="text-xs text-muted-foreground mt-1">Atual: {url}</p>}
        </div>
      )}

      {itemType === "carousel" && (
        <div className="space-y-4 border border-border/20 rounded-2xl p-4 bg-background/20">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Slides do Carrossel</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                setSlides([
                  ...slides,
                  { id: Math.random().toString(), file: null, image_url: "", text: "" },
                ])
              }
            >
              + Adicionar Slide
            </Button>
          </div>

          {slides.map((slide, idx) => (
            <div key={slide.id} className="p-3 bg-background/40 border border-border/10 rounded-xl space-y-3 relative">
              <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold">
                <span>Slide #{idx + 1}</span>
                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 p-0 flex items-center justify-center"
                    disabled={idx === 0}
                    onClick={() => {
                      const copy = [...slides];
                      const temp = copy[idx];
                      copy[idx] = copy[idx - 1];
                      copy[idx - 1] = temp;
                      setSlides(copy);
                    }}
                  >
                    ↑
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 p-0 flex items-center justify-center"
                    disabled={idx === slides.length - 1}
                    onClick={() => {
                      const copy = [...slides];
                      const temp = copy[idx];
                      copy[idx] = copy[idx + 1];
                      copy[idx + 1] = temp;
                      setSlides(copy);
                    }}
                  >
                    ↓
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 p-0 flex items-center justify-center text-destructive hover:text-destructive"
                    disabled={slides.length === 1}
                    onClick={() => {
                      setSlides(slides.filter((s) => s.id !== slide.id));
                    }}
                  >
                    X
                  </Button>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-3">
                <div>
                  <Label className="text-xs">Imagem do Slide {slide.image_url ? "(opcional)" : "*"}</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0] ?? null;
                      const copy = [...slides];
                      copy[idx].file = file;
                      setSlides(copy);
                    }}
                  />
                  {slide.image_url && !slide.file && (
                    <div className="mt-1 flex items-center gap-2">
                      <img src={slide.image_url} className="h-10 w-10 object-cover rounded" />
                      <span className="text-[10px] text-muted-foreground truncate max-w-[200px]">Imagem atual definida</span>
                    </div>
                  )}
                </div>
                <div>
                  <Label className="text-xs">Áudio Narração (Opcional)</Label>
                  <Input
                    type="file"
                    accept="audio/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0] ?? null;
                      const copy = [...slides];
                      copy[idx].audioFile = file;
                      setSlides(copy);
                    }}
                  />
                  {slide.audio_url && !slide.audioFile && (
                    <div className="mt-1">
                      <button
                        type="button"
                        onClick={() => {
                          const a = new Audio(slide.audio_url);
                          a.play().catch(() => {});
                        }}
                        className="text-[10px] text-primary hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        🔊 Ouvir áudio salvo
                      </button>
                    </div>
                  )}
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <Label className="text-xs">Texto de Narração / Legenda</Label>
                    {slide.text && (
                      <button
                        type="button"
                        onClick={() => {
                          if (typeof window !== "undefined") {
                            window.speechSynthesis.cancel();
                            const u = new SpeechSynthesisUtterance(slide.text);
                            u.lang = "pt-BR";
                            u.rate = 1.05;
                            window.speechSynthesis.speak(u);
                          }
                        }}
                        className="text-xs text-primary hover:text-primary-glow flex items-center gap-1 cursor-pointer"
                        title="Ouvir teste de voz"
                      >
                        <Volume2 className="h-3.5 w-3.5" /> Ouvir teste
                      </button>
                    )}
                  </div>
                  <Textarea
                    rows={1}
                    placeholder="Digite o texto que será narrado..."
                    value={slide.text}
                    onChange={(e) => {
                      const copy = [...slides];
                      copy[idx].text = e.target.value;
                      setSlides(copy);
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div>
        <Label>Capa (imagem — opcional)</Label>
        <Input type="file" accept="image/*" onChange={(e) => setCoverFile(e.target.files?.[0] ?? null)} />
        {coverUrl && !coverFile && <p className="text-xs text-muted-foreground mt-1">Capa atual definida.</p>}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-end">
        <div className="flex items-center gap-2">
          <Switch checked={isPaid} onCheckedChange={setIsPaid} id="paid" />
          <Label htmlFor="paid">Conteúdo pago</Label>
        </div>
        {isPaid && (
          <div>
            <Label>Preço (centavos)</Label>
            <Input type="number" value={priceCents} onChange={(e) => setPriceCents(e.target.value)} placeholder="ex: 1990 = R$ 19,90" />
          </div>
        )}
        <div className="flex items-center gap-2">
          <Switch checked={published} onCheckedChange={setPublished} id="pub" />
          <Label htmlFor="pub">Publicado</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch checked={narrated} onCheckedChange={setNarrated} id="narrated" />
          <Label htmlFor="narrated">Narrado por voz</Label>
        </div>
      </div>

      <Button type="submit" disabled={saving} className="w-full">
        {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}
        {editing ? "Salvar alterações" : "Adicionar à biblioteca"}
      </Button>
    </form>
  );
}

type RatingRow = {
  user_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  updated_at: string;
};

function RatingsPanel() {
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");

  function withinDateRange(iso: string): boolean {
    if (!dateFrom && !dateTo) return true;
    const t = new Date(iso).getTime();
    if (dateFrom) {
      const from = new Date(dateFrom + "T00:00:00").getTime();
      if (t < from) return false;
    }
    if (dateTo) {
      const to = new Date(dateTo + "T23:59:59").getTime();
      if (t > to) return false;
    }
    return true;
  }

  const { data: ratings = [], isLoading } = useQuery({
    queryKey: ["admin", "ratings"],
    queryFn: async (): Promise<Array<RatingRow & { display_name: string | null; email: string | null }>> => {
      const { data: r, error } = await supabase
        .from("app_ratings")
        .select("user_id, rating, comment, created_at, updated_at")
        .order("updated_at", { ascending: false });
      if (error) throw error;
      const rows = (r ?? []) as RatingRow[];
      if (rows.length === 0) return [];
      const ids = rows.map((x) => x.user_id);
      const { data: profs } = await supabase
        .from("profiles")
        .select("id, display_name, email")
        .in("id", ids);
      const byId = new Map((profs ?? []).map((p) => [p.id, p]));
      return rows.map((row) => ({
        ...row,
        display_name: byId.get(row.user_id)?.display_name ?? null,
        email: byId.get(row.user_id)?.email ?? null,
      }));
    },
  });
  const [filter, setFilter] = useState<number | "all">("all");

  const dateFilteredRatings = ratings.filter((r) => withinDateRange(r.updated_at));
  const total = dateFilteredRatings.length;
  const avg = total > 0 ? dateFilteredRatings.reduce((s, r) => s + r.rating, 0) / total : 0;
  const dist = [5, 4, 3, 2, 1].map((n) => ({
    n,
    count: dateFilteredRatings.filter((r) => r.rating === n).length,
  }));
  const filtered =
    filter === "all" ? dateFilteredRatings : dateFilteredRatings.filter((r) => r.rating === filter);

  function exportXlsx() {
    const rows = filtered.map((r) => ({
      Nome: r.display_name ?? "",
      Email: r.email ?? "",
      Nota: r.rating,
      Comentário: r.comment ?? "",
      "Atualizado em": new Date(r.updated_at).toLocaleString("pt-BR"),
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Avaliações");
    XLSX.writeFile(wb, `avaliacoes-${new Date().toISOString().slice(0, 10)}.xlsx`);
  }

  if (isLoading) {
    return <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  }

  return (
    <div className="space-y-4">
      <div className="glass rounded-2xl p-4 flex flex-wrap items-end gap-3">
        <div>
          <Label className="text-xs">De</Label>
          <Input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="w-40"
          />
        </div>
        <div>
          <Label className="text-xs">Até</Label>
          <Input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="w-40"
          />
        </div>
        {(dateFrom || dateTo) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setDateFrom("");
              setDateTo("");
            }}
          >
            Limpar filtro
          </Button>
        )}
        <p className="text-xs text-muted-foreground ml-auto">
          Filtro de data aplica em avaliações e contribuições.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <div className="glass rounded-2xl p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Média geral</p>
          <p className="text-3xl font-display font-bold flex items-center gap-2 mt-1">
            {avg.toFixed(1)}
            <Star className="h-6 w-6 fill-warning text-warning" />
          </p>
          <p className="text-xs text-muted-foreground mt-1">{total} avaliação{total === 1 ? "" : "ões"}</p>
        </div>
        <div className="glass rounded-2xl p-4 md:col-span-2">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Distribuição</p>
          <div className="space-y-1.5">
            {dist.map((d) => {
              const pct = total > 0 ? (d.count / total) * 100 : 0;
              return (
                <div key={d.n} className="flex items-center gap-2 text-xs">
                  <span className="w-8 text-right font-semibold">{d.n}★</span>
                  <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
                    <div className="h-full bg-warning" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="w-8 text-muted-foreground">{d.count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="glass rounded-2xl p-4">
        <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
          <div className="flex items-center gap-2">
            <Select value={String(filter)} onValueChange={(v) => setFilter(v === "all" ? "all" : Number(v))}>
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as notas</SelectItem>
                {[5, 4, 3, 2, 1].map((n) => (
                  <SelectItem key={n} value={String(n)}>{n} estrela{n > 1 ? "s" : ""}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-xs text-muted-foreground">{filtered.length} resultado{filtered.length === 1 ? "" : "s"}</span>
          </div>
          <Button size="sm" variant="outline" onClick={exportXlsx} disabled={filtered.length === 0}>
            <Download className="h-4 w-4 mr-2" /> Exportar Excel
          </Button>
        </div>

        <div className="space-y-2">
          {filtered.map((r) => (
            <div key={r.user_id} className="p-3 rounded-xl bg-background/50 border border-border/40">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-semibold text-sm truncate">{r.display_name ?? "Sem nome"}</p>
                  <p className="text-xs text-muted-foreground truncate">{r.email ?? "—"}</p>
                </div>
                <div className="flex items-center gap-0.5 shrink-0">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Star key={n} className={`h-4 w-4 ${n <= r.rating ? "fill-warning text-warning" : "text-muted-foreground/30"}`} />
                  ))}
                </div>
              </div>
              {r.comment && (
                <p className="mt-2 text-sm text-foreground/90 whitespace-pre-wrap">{r.comment}</p>
              )}
              <p className="mt-2 text-[10px] uppercase tracking-wider text-muted-foreground">
                {new Date(r.updated_at).toLocaleString("pt-BR")}
              </p>
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-6">Nenhuma avaliação ainda.</p>
          )}
        </div>
      </div>

      <ContributionsPanel dateFrom={dateFrom} dateTo={dateTo} />
    </div>
  );
}

type ContributionRow = {
  id: string;
  user_id: string;
  clicked_at: string;
};

function ContributionsPanel({ dateFrom, dateTo }: { dateFrom: string; dateTo: string }) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(10);

  const { data: clicks = [], isLoading } = useQuery({
    queryKey: ["admin", "contribution_clicks"],
    queryFn: async (): Promise<Array<ContributionRow & { display_name: string | null; email: string | null }>> => {
      const { data: rows, error } = await supabase
        .from("contribution_clicks")
        .select("id, user_id, clicked_at")
        .order("clicked_at", { ascending: false });
      if (error) throw error;
      const list = (rows ?? []) as ContributionRow[];
      if (list.length === 0) return [];
      const ids = Array.from(new Set(list.map((r) => r.user_id)));
      const { data: profs } = await supabase
        .from("profiles")
        .select("id, display_name, email")
        .in("id", ids);
      const byId = new Map((profs ?? []).map((p) => [p.id, p]));
      return list.map((row) => ({
        ...row,
        display_name: byId.get(row.user_id)?.display_name ?? null,
        email: byId.get(row.user_id)?.email ?? null,
      }));
    },
  });

  function within(iso: string): boolean {
    if (!dateFrom && !dateTo) return true;
    const t = new Date(iso).getTime();
    if (dateFrom && t < new Date(dateFrom + "T00:00:00").getTime()) return false;
    if (dateTo && t > new Date(dateTo + "T23:59:59").getTime()) return false;
    return true;
  }

  const filtered = clicks.filter((c) => within(c.clicked_at));
  const total = filtered.length;
  const now = Date.now();
  const last7 = filtered.filter(
    (c) => now - new Date(c.clicked_at).getTime() < 1000 * 60 * 60 * 24 * 7,
  ).length;
  const uniqueUsers = new Set(filtered.map((c) => c.user_id)).size;

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  function exportXlsx() {
    const rows = filtered.map((c) => ({
      Nome: c.display_name ?? "",
      Email: c.email ?? "",
      "Data do clique": new Date(c.clicked_at).toLocaleString("pt-BR"),
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Contribuições");
    XLSX.writeFile(wb, `contribuicoes-${new Date().toISOString().slice(0, 10)}.xlsx`);
  }

  return (
    <div className="glass rounded-2xl p-4 space-y-4">
      <div className="flex items-center gap-2">
        <Heart className="h-4 w-4 text-pink-500" />
        <h2 className="font-display font-bold">Histórico de Cliques em Contribuição</h2>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded-xl p-3 bg-background/50 border border-border/40">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Total de cliques</p>
          <p className="text-2xl font-display font-bold mt-1">{total}</p>
        </div>
        <div className="rounded-xl p-3 bg-background/50 border border-border/40">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Últimos 7 dias</p>
          <p className="text-2xl font-display font-bold mt-1">{last7}</p>
        </div>
        <div className="rounded-xl p-3 bg-background/50 border border-border/40">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Usuários únicos</p>
          <p className="text-2xl font-display font-bold mt-1">{uniqueUsers}</p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <Label className="text-xs">Por página</Label>
          <select
            value={pageSize}
            onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
            className="flex h-9 rounded-md border border-input bg-transparent px-2 py-1 text-sm"
          >
            {PAGE_SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <Button size="sm" variant="outline" onClick={exportXlsx} disabled={filtered.length === 0}>
          <Download className="h-4 w-4 mr-2" /> Exportar Excel
        </Button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border/40">
        <table className="w-full text-sm">
          <thead className="bg-background/50 text-xs uppercase text-muted-foreground">
            <tr>
              <th className="text-left px-3 py-2">Nome</th>
              <th className="text-left px-3 py-2">E-mail</th>
              <th className="text-left px-3 py-2">Data / Hora do clique</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((c) => (
              <tr key={c.id} className="border-t border-border/30">
                <td className="px-3 py-2">{c.display_name ?? "—"}</td>
                <td className="px-3 py-2">{c.email ?? "—"}</td>
                <td className="px-3 py-2 whitespace-nowrap">{new Date(c.clicked_at).toLocaleString("pt-BR")}</td>
              </tr>
            ))}
            {!isLoading && filtered.length === 0 && (
              <tr><td colSpan={3} className="text-center text-muted-foreground py-6">Nenhum clique registrado ainda.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {filtered.length > 0 && (
        <div className="flex items-center justify-between gap-3 text-sm">
          <div className="text-muted-foreground">Página {safePage} de {totalPages}</div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={safePage <= 1}>
              Anterior
            </Button>
            <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={safePage >= totalPages}>
              Próxima
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
