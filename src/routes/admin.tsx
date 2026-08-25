import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchLibraryItems, checkIsAdmin, SUPER_ADMIN_EMAIL, type LibraryItem, type LibraryItemType } from "@/lib/library";
import { SimuladoEspelho } from "@/components/SimuladoEspelho";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2, Upload, Trash2, Pencil, LogOut, ArrowLeft, ArrowUpDown, ArrowUp, ArrowDown, Search, Download, Users, KeyRound, UserX, XCircle, Star, Heart, Volume2, CheckCircle2, Settings, ExternalLink, ShoppingBag, MessageCircle, LockOpen, Video, BadgeDollarSign, Gift, CheckCheck, CalendarClock, Lock, ChevronUp, ChevronDown, GripVertical } from "lucide-react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import * as XLSX from "xlsx";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useServerFn } from "@tanstack/react-start";
import { adminResetUserPassword, getSalesReport, type SalesReportProfile } from "@/lib/admin-users.functions";
import { sendPasswordReset, deleteUser, deactivateUser } from "@/lib/admin-operations.server";
import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";

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
  const [tab, setTab] = useState("sales");
  const [categoryFilter, setCategoryFilter] = useState<"all" | "teorico" | "psicotecnico" | "direcao">("all");
  const isSuper = email === SUPER_ADMIN_EMAIL;
  
  const [showRankingModal, setShowRankingModal] = useState(false);
  const [rankingTexto, setRankingTexto] = useState<string>("");

  // Function to copy to clipboard
  const copiarParaClipboard = (texto: string) => {
    navigator.clipboard.writeText(texto).then(() => {
      toast.success("Ranking copiado para a área de!");
    }).catch(() => {
      toast.error("Falha ao copiar para a área de transferência");
    });
  };

  // Filter items by selected category
  const filteredItems = categoryFilter === "all"
    ? items
    : items.filter((item) => item.module_type === categoryFilter);

  async function onDelete(item: LibraryItem) {
    if (!confirm(`Apagar "${item.title}"?`)) return;
    const { error } = await supabase.from("library_items").delete().eq("id", item.id);
    if (error) return toast.error(error.message);
    toast.success("Apagado");
    qc.invalidateQueries({ queryKey: ["library"] });
  }

  async function handleOnDragEnd(result: DropResult) {
    if (!result.destination) return;
    if (result.source.index === result.destination.index) return;

    const newItems = Array.from(items);
    const [movedItem] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, movedItem);

    // Update sort_order based on new positions
    const updatedItems = newItems.map((item, index) => ({
      ...item,
      sort_order: index + 1,
    }));

    // Instant UI update
    qc.setQueryData(["library", "all"], updatedItems);

    // Persist to Supabase
    try {
      const updates = updatedItems.map((item) =>
        supabase.from("library_items").update({ sort_order: item.sort_order }).eq("id", item.id)
      );
      await Promise.all(updates);
    } catch (error) {
      console.error("Erro ao salvar ordem:", error);
      qc.setQueryData(["library", "all"], items); // Revert on error
    }
  }

  return (
    <div className="mx-auto max-w-full px-4 lg:px-8 py-8 space-y-6">
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
        <Button
          onClick={() => setShowRankingModal(true)}
          className="ml-3 py-2 px-4 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
          <span>📊</span> Copiar Ranking do Dia
        </Button>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 w-full">
          <TabsTrigger value="sales" className="gap-2 whitespace-nowrap"><ShoppingBag className="h-4 w-4" /> Vendas</TabsTrigger>
          <TabsTrigger value="users" className="gap-2 whitespace-nowrap"><Users className="h-4 w-4" /> Usuários</TabsTrigger>
          <TabsTrigger value="library" className="gap-2 whitespace-nowrap"><Upload className="h-4 w-4" /> Biblioteca</TabsTrigger>
          <TabsTrigger value="ratings" className="gap-2 whitespace-nowrap"><Star className="h-4 w-4" /> Avaliações</TabsTrigger>
          <TabsTrigger value="settings" className="gap-2 whitespace-nowrap"><Settings className="h-4 w-4" /> Configurações</TabsTrigger>
          {isSuper ? (
            <TabsTrigger value="espelho" className="gap-2 whitespace-nowrap"><Video className="h-4 w-4" /> Simulado p/ divulgação</TabsTrigger>
          ) : (
            <div className="hidden md:block" />
          )}
        </TabsList>
        <TabsContent value="espelho" className="mt-4">
          <SimuladoEspelho onExit={() => setTab("sales")} />
        </TabsContent>
        <TabsContent value="sales" className="mt-4">
          <SalesPanel />
        </TabsContent>
        <TabsContent value="users" className="mt-4">
          <UsersPanel />
        </TabsContent>
        <TabsContent value="ratings" className="mt-4">
          <RatingsPanel />
        </TabsContent>
        <TabsContent value="settings" className="mt-4">
          <SettingsPanel />
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
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display font-bold">Itens ({filteredItems.length})</h2>
              <Tabs value={categoryFilter} onValueChange={(v) => setCategoryFilter(v as "all" | "teorico" | "psicotecnico" | "direcao")} className="flex-1 max-w-md">
                <TabsList className="grid grid-cols-4">
                  <TabsTrigger value="all">Todos</TabsTrigger>
                  <TabsTrigger value="teorico">Teórico</TabsTrigger>
                  <TabsTrigger value="psicotecnico">Psicotécnico</TabsTrigger>
                  <TabsTrigger value="direcao">Prático</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <DragDropContext onDragEnd={handleOnDragEnd}>
              <Droppable droppableId="library-items">
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="space-y-2"
                  >
                    {filteredItems.map((item, index) => (
                      <Draggable key={item.id} draggableId={item.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`flex items-center justify-between gap-3 p-3 rounded-xl bg-background/50 transition-shadow ${
                              snapshot.isDragging ? "shadow-xl ring-2 ring-primary" : ""
                            }`}
                          >
                            <div
                              {...provided.dragHandleProps}
                              className="cursor-grab active:cursor-grabbing text-muted-foreground/50 hover:text-muted-foreground p-2"
                              aria-label="Arrastar para reordenar"
                            >
                              <GripVertical className="h-5 w-5" />
                            </div>
                            <div className="flex items-center gap-2">
                              <p className="font-semibold truncate">{item.title}</p>
                              <Badge variant="secondary" className="text-xs">
                                {item.module_type === "teorico" ? "Teórico" :
                                 item.module_type === "psicotecnico" ? "Psicotécnico" :
                                 item.module_type === "direcao" ? "Prático" : item.module_type}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              {item.item_type.toUpperCase()} · {item.published ? "Publicado" : "Rascunho"}
                              {item.is_paid && ` · R$ ${((item.price_cents ?? 0) / 100).toFixed(2)}`}
                            </p>
                            <div className="flex items-center gap-1">
                              <Button size="icon" variant="ghost" onClick={() => setEditing(item)}><Pencil className="h-4 w-4" /></Button>
                              <Button size="icon" variant="ghost" onClick={() => onDelete(item)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
            {filteredItems.length === 0 && <p className="text-sm text-muted-foreground text-center py-6">Nenhum item encontrado. Adicione abaixo ou altere o filtro.</p>}
          </div>
        </TabsContent>
        {/* Ranking do Dia para WhatsApp Modal */}
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" role="dialog" aria-modal="true" onClick={(e) => { if (e.target === e.currentTarget) setShowRankingModal(false); }}>
          <div className="bg-card rounded-2xl p-6 max-w-md w-full mx-8 transform scale-100 transition-transform" style={{ WebkitTransform: 'scale(1)' }} onClick={(e) => e.stopPropagation()}>
            <h3 className="font-display font-bold text-lg mb-3">Copiar Ranking do Dia para WhatsApp</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Gerar ranking dos top 3 alunos do dia para enviar em grupos do WhatsApp.
            </p>
            <textarea
              ref={rankingTexto ? null : undefined}
              readOnly
              className="w-full h-32 rounded-lg border border-border/30 p-3 font-mono text-sm resize-none {rankingTexto ? 'bg-primary/5 text-primary' : 'bg-background'}"
              value={rankingTexto || 'Carregando...'}
            ></textarea>
            <div className="mt-4 flex gap-2">
              <Button
                onClick={() => {
                  if (rankingTexto) {
                    copiarParaClipboard(rankingTexto);
                    setShowRankingModal(false);
                  }
                }}
                className="flex-1 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                Copiar
              </Button>
              <Button
                onClick={() => {
                  // Generate new ranking
                  const rankingFn = useServerFn(gerarTextoRankingWhatsApp);
                  rankingFn({ data: { data: new Date().toISOString().split('T')[0] } }).then(({ texto, copia }) => {
                    if (copia && texto) {
                      setRankingTexto(texto);
                      setShowRankingModal(true);
                    }
                  });
                }}
                className="flex-1 py-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/90 transition-colors">
                Gerar
              </Button>
            </div>
          </div>
        </div>
      </Tabs>
    </div>
  );
}

const salesChartConfig = {
  vendas: { label: "Vendas", color: "var(--chart-1)" },
  vendasHoje: { label: "Vendas hoje", color: "var(--chart-2)" },
} satisfies ChartConfig;

type SaleRow = {
  id: string;
  user_id: string;
  amount: number | null;
  plan_type: string | null;
  status: string;
  created_at: string;
};

const PLAN_SALES_LABELS: Record<string, string> = {
  "1_month": "Plano Intensivo (30 dias)",
  "3_months": "Plano Trimestral (90 dias)",
  "6_months": "Combo CNH Aprovada (6 meses)",
};

function salesPlanLabel(plan: string | null): string {
  return plan ? PLAN_SALES_LABELS[plan] ?? plan : "—";
}

function phoneForWhatsApp(phone: string | null): string {
  if (!phone) return "";
  const digits = phone.replace(/\D/g, "");
  if (!digits) return "";
  return digits.startsWith("55") ? digits : "55" + digits;
}

function dayKey(iso: string): string {
  const d = new Date(iso);
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

function SalesPanel() {
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const salesFn = useServerFn(getSalesReport);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "sales"],
    queryFn: async () => {
      const result = await salesFn({ data: undefined });
      const buyers = new Map<string, SalesReportProfile>(
        (result.profiles ?? []).map((p) => [p.id, p]),
      );
      return { sales: result.sales ?? [], buyers };
    },
  });

  function withinRange(iso: string): boolean {
    if (!dateFrom && !dateTo) return true;
    const t = new Date(iso).getTime();
    if (dateFrom && t < new Date(dateFrom + "T00:00:00").getTime()) return false;
    if (dateTo && t > new Date(dateTo + "T23:59:59").getTime()) return false;
    return true;
  }

  const filtered = (data?.sales ?? []).filter((s) => withinRange(s.created_at));
  const totalSales = filtered.length;
  const revenue = filtered.reduce((acc, s) => acc + (s.amount ?? 0), 0);
  const uniqueBuyers = new Set(filtered.map((s) => s.user_id)).size;

  const byDay = new Map<string, number>();
  for (const s of filtered) {
    const k = dayKey(s.created_at);
    byDay.set(k, (byDay.get(k) ?? 0) + 1);
  }
  const todayKey = dayKey(new Date().toISOString());
  const chartData = Array.from(byDay.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([k, count]) => {
      const [, m, d] = k.split("-").map(Number);
      return {
        label: `${String(d).padStart(2, "0")}/${String(m).padStart(2, "0")}`,
        vendas: count,
        isHoje: k === todayKey,
      };
    });

  function applyPreset(preset: "hoje" | "7" | "30" | "tudo") {
    if (preset === "tudo") {
      setDateFrom("");
      setDateTo("");
      return;
    }
    const today = new Date();
    const from = new Date(today);
    if (preset === "7") from.setDate(today.getDate() - 6);
    else if (preset === "30") from.setDate(today.getDate() - 29);
    const fmt = (dt: Date) =>
      `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;
    setDateFrom(fmt(from));
    setDateTo(fmt(today));
  }

  const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

  if (isLoading) {
    return <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  }

  return (
    <div className="space-y-4">
      <div className="glass rounded-2xl p-4 flex flex-wrap items-end gap-3">
        <div>
          <Label className="text-xs">De</Label>
          <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="w-40" />
        </div>
        <div>
          <Label className="text-xs">Até</Label>
          <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="w-40" />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {(["hoje", "7", "30", "tudo"] as const).map((p) => {
            const label = p === "hoje" ? "Hoje" : p === "7" ? "Últimos 7 dias" : p === "30" ? "Últimos 30 dias" : "Tudo";
            return (
              <Button key={p} size="sm" variant="outline" onClick={() => applyPreset(p)}>
                {label}
              </Button>
            );
          })}
        </div>
        <p className="text-xs text-muted-foreground ml-auto">
          Compradores com Pix confirmado (status CONCLUÍDA).
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-4">
        <div className="glass rounded-2xl p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Vendas</p>
          <p className="text-3xl font-display font-bold mt-1 text-primary">{totalSales}</p>
        </div>
        <div className="glass rounded-2xl p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Receita</p>
          <p className="text-3xl font-display font-bold mt-1 text-success">{currency.format(revenue)}</p>
        </div>
        <div className="glass rounded-2xl p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Compradores únicos</p>
          <p className="text-3xl font-display font-bold mt-1 text-warning">{uniqueBuyers}</p>
        </div>
        <div className="glass rounded-2xl p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Dias com venda</p>
          <p className="text-3xl font-display font-bold mt-1 text-primary-glow">{chartData.filter((c) => c.vendas > 0).length}</p>
        </div>
      </div>

      <div className="glass rounded-2xl p-4">
        <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
          <h2 className="font-display font-bold">Vendas por dia</h2>
          <span className="text-xs text-muted-foreground">Passe o mouse nas barras para detalhes.</span>
        </div>
        {chartData.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-10">Nenhuma venda no período selecionado.</p>
        ) : (
          <ChartContainer config={salesChartConfig} className="aspect-auto h-[260px] w-full">
            <BarChart data={chartData}>
              <defs>
                <linearGradient id="fillVendas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-vendas)" />
                  <stop offset="100%" stopColor="var(--color-vendas)" stopOpacity={0.35} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="var(--border)" />
              <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={30} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent nameKey="vendas" />} />
              <Bar dataKey="vendas" radius={[6, 6, 2, 2]}>
                {chartData.map((entry) => (
                  <Cell key={entry.label} fill={entry.isHoje ? "var(--color-vendasHoje)" : "url(#fillVendas)"} />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        )}
      </div>

      <div className="glass rounded-2xl p-4">
        <h2 className="font-display font-bold mb-3">Compradores ({filtered.length})</h2>
        <div className="overflow-x-auto rounded-lg border border-border/40">
          <table className="w-full text-sm">
            <thead className="bg-background/50 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="text-left px-3 py-2">Nome</th>
                <th className="text-left px-3 py-2">E-mail</th>
                <th className="text-left px-3 py-2">Telefone</th>
                <th className="text-left px-3 py-2">Plano</th>
                <th className="text-left px-3 py-2">Valor</th>
                <th className="text-left px-3 py-2">Data</th>
                <th className="text-right px-3 py-2">WhatsApp</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((sale) => {
                const buyer = data?.buyers.get(sale.user_id);
                const wa = phoneForWhatsApp(buyer?.phone ?? null);
                return (
                  <tr key={sale.id} className="border-t border-border/30">
                    <td className="px-3 py-2">{buyer?.display_name ?? "—"}</td>
                    <td className="px-3 py-2">{buyer?.email ?? "—"}</td>
                    <td className="px-3 py-2 whitespace-nowrap">{buyer?.phone ?? "—"}</td>
                    <td className="px-3 py-2">{salesPlanLabel(sale.plan_type)}</td>
                    <td className="px-3 py-2 whitespace-nowrap">{currency.format(sale.amount ?? 0)}</td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      {new Date(sale.created_at).toLocaleDateString("pt-BR")}{" "}
                      <span className="text-muted-foreground">
                        {new Date(sale.created_at).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-right whitespace-nowrap">
                      {wa ? (
                        <a
                          href={`https://wa.me/${wa}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-success bg-success/10 border border-success/30 px-2.5 py-1 rounded-full hover:bg-success/20 transition-colors"
                          title={`Chamar ${buyer?.display_name ?? "cliente"} no WhatsApp`}
                        >
                          <MessageCircle className="h-3.5 w-3.5" /> Chamar
                        </a>
                      ) : (
                        <span className="text-[11px] text-muted-foreground">Sem telefone</span>
                      )}
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center text-muted-foreground py-6">Nenhuma venda encontrada.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
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
  needs_new_password: boolean | null;
  access_status?: string | null;
  access_reason?: string | null;
  free_trial_enabled?: boolean | null;
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

const PAGE_SIZES = [10, 20, 50, 100, 500, 1000, 99999] as const;

function UsersPanel() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [passwordFilter, setPasswordFilter] = useState<string>("all");
  const [blockFilter, setBlockFilter] = useState<string>("all");
  const [createdFrom, setCreatedFrom] = useState("");
  const [createdTo, setCreatedTo] = useState("");
  const [expiresFrom, setExpiresFrom] = useState("");
  const [expiresTo, setExpiresTo] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [sortField, setSortField] = useState<"name" | "email" | "status" | "password" | "block" | "created" | "expires">("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [resetUser, setResetUser] = useState<ProfileRow | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [releaseTarget, setReleaseTarget] = useState<ProfileRow | null>(null);
  const [releaseReason, setReleaseReason] = useState<string>("pago");
  const [releaseDate, setReleaseDate] = useState<string>("");
  const [releaseLoading, setReleaseLoading] = useState(false);
  const [pixTarget, setPixTarget] = useState<ProfileRow | null>(null);
  const [pixAmount, setPixAmount] = useState<string>("19.90");
  const [pixPlan, setPixPlan] = useState<string>("1_month");
  const [pixDate, setPixDate] = useState<string>("");
  const [pixLoading, setPixLoading] = useState(false);
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

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkModal, setBulkModal] = useState<null | "release" | "expiry" | "expire" | "block" | "unblock" | "delete">(null);
  const [bulkReason, setBulkReason] = useState<string>("pago");
  const [bulkReleaseDate, setBulkReleaseDate] = useState<string>("");
  const [bulkExpiryDate, setBulkExpiryDate] = useState<string>("");
  const [bulkLoading, setBulkLoading] = useState(false);

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["admin", "profiles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, display_name, email, cpf, phone, employment_status, employment_other, status, expires_at, created_at, needs_new_password, access_status, access_reason, free_trial_enabled")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as ProfileRow[];
    },
  });

  const { data: paidTx = [] } = useQuery({
    queryKey: ["admin", "paidTx"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pix_transactions")
        .select("user_id")
        .eq("status", "CONCLUIDA");
      if (error) throw error;
      return (data ?? []) as { user_id: string }[];
    },
  });

  const paidUserIds = new Set(paidTx.map((t) => t.user_id));
  const isPaid = (u: ProfileRow) => u.access_reason === "pago" || paidUserIds.has(u.id);

  const filtered = users.filter((u) => {
    if (filter !== "all" && u.employment_status !== filter) return false;
    if (statusFilter === "pago_real" && !(u.status === "ativo" && isPaid(u))) return false;
    if (statusFilter === "liberado" && !(u.status === "ativo" && !isPaid(u))) return false;
    if (statusFilter !== "all" && statusFilter !== "pago_real" && statusFilter !== "liberado" && u.status !== statusFilter) return false;
    if (passwordFilter === "sem_senha" && (u.needs_new_password !== true)) return false;
    if (passwordFilter === "com_senha" && u.needs_new_password === true) return false;
    if (blockFilter === "bloqueados" && u.access_status !== "blocked") return false;
    if (blockFilter === "ativos" && u.access_status === "blocked") return false;
    if (createdFrom || createdTo) {
      const t = new Date(u.created_at).getTime();
      if (createdFrom && t < new Date(createdFrom + "T00:00:00").getTime()) return false;
      if (createdTo && t > new Date(createdTo + "T23:59:59").getTime()) return false;
    }
    if (expiresFrom || expiresTo) {
      if (!u.expires_at) return false;
      const t = new Date(u.expires_at).getTime();
      if (expiresFrom && t < new Date(expiresFrom + "T00:00:00").getTime()) return false;
      if (expiresTo && t > new Date(expiresTo + "T23:59:59").getTime()) return false;
    }
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      (u.display_name ?? "").toLowerCase().includes(q) ||
      (u.email ?? "").toLowerCase().includes(q) ||
      (u.cpf ?? "").toLowerCase().includes(q) ||
      (u.phone ?? "").toLowerCase().includes(q)
    );
  }).sort((a, b) => {
    function valueOf(u: typeof a): string {
      switch (sortField) {
        case "email": return u.email ?? "";
        case "status":
          return u.status === "ativo" && isPaid(u)
            ? "pago"
            : u.status === "ativo"
              ? "liberado gratis"
              : u.status === "pendente_pagamento" ? "pendente" : (u.status ?? "");
        case "password": return u.needs_new_password === true ? "sem senha" : "ok";
        case "block": return u.access_status === "blocked" ? "bloqueado" : "ativo";
        case "created": return u.created_at ?? "";
        case "expires": return u.expires_at ?? "";
        default: return u.display_name ?? "";
      }
    }
    const cmp = valueOf(a).localeCompare(valueOf(b));
    return sortDir === "asc" ? cmp : -cmp;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paginatedUsers = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  const allOnPageSelected = paginatedUsers.length > 0 && paginatedUsers.every((u) => selected.has(u.id));
  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };
  const toggleSelectAllPage = () => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (allOnPageSelected) {
        paginatedUsers.forEach((u) => next.delete(u.id));
      } else {
        paginatedUsers.forEach((u) => next.add(u.id));
      }
      return next;
    });
  };
  const selectedUsers = filtered.filter((u) => selected.has(u.id));
  const bulkSelectedIds = () => Array.from(selected);

  async function runBulk(action: "release" | "expiry" | "expire" | "block" | "unblock" | "delete") {
    if (selected.size === 0) return;
    setBulkLoading(true);
    try {
      const ops = await import("@/lib/admin-operations.server");
      if (action === "release") {
        await ops.bulkReleaseUserAccess({
          data: {
            userIds: bulkSelectedIds(),
            reason: bulkReason,
            expiresAt: bulkReleaseDate ? `${bulkReleaseDate}T23:59:59` : null,
          },
        });
      }
      if (action === "expiry") {
        await ops.bulkSetExpiry({
          data: { userIds: bulkSelectedIds(), expiresAt: bulkExpiryDate ? `${bulkExpiryDate}T23:59:59` : null },
        });
      }
      if (action === "expire") await ops.bulkExpireUsers({ data: { userIds: bulkSelectedIds() } });
      if (action === "block") await ops.bulkBlockUsers({ data: { userIds: bulkSelectedIds() } });
      if (action === "unblock") await ops.bulkUnblockUsers({ data: { userIds: bulkSelectedIds() } });
      if (action === "delete") await ops.bulkDeleteUsers({ data: { userIds: bulkSelectedIds() } });

      toast.success(`Ação aplicada a ${selected.size} usuário(s).`);
      setSelected(new Set());
      setBulkModal(null);
      qc.invalidateQueries({ queryKey: ["admin", "profiles"] });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao executar ação em massa.");
    } finally {
      setBulkLoading(false);
    }
  }

  function buildRows() {
    return filtered.map((u) => ({
      Nome: u.display_name ?? "",
      "E-mail": u.email ?? "",
      CPF: u.cpf ?? "",
      Telefone: u.phone ?? "",
      Motivo: u.status === "ativo" && isPaid(u)
        ? "Pago"
        : u.status === "ativo"
          ? "Liberado grátis/campanha"
          : u.status === "pendente_pagamento" ? "Pendente de pagamento" : (u.status ?? ""),
      "Situação profissional":
        u.employment_status === "outro"
          ? `Outros: ${u.employment_other ?? ""}`
          : EMPLOYMENT_LABELS[u.employment_status ?? ""] ?? (u.employment_status ?? ""),
      "Data de cadastro": new Date(u.created_at).toLocaleString("pt-BR"),
      "Data de expiração": u.expires_at ? new Date(u.expires_at).toLocaleString("pt-BR") : "",
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

  function SortableTh({ field, label, className }: {
    field: "name" | "email" | "status" | "password" | "block" | "created" | "expires";
    label: string;
    className?: string;
  }) {
    return (
      <th className={`px-3 py-2 ${className ?? "text-left"}`}>
        <button
          onClick={() => {
            if (sortField === field) setSortDir((d) => d === "asc" ? "desc" : "asc");
            else { setSortField(field); setSortDir("asc"); }
          }}
          className={`inline-flex items-center gap-1 hover:text-foreground transition-colors ${className === "text-right" ? "flex-row-reverse" : ""}`}
        >
          {label}
          {sortField === field ? (
            sortDir === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
          ) : <ArrowUpDown className="h-3 w-3 opacity-40" />}
        </button>
      </th>
    );
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
            className="flex h-9 w-full rounded-md border border-border/20 bg-card/60 backdrop-blur-md px-3 py-1 text-sm text-foreground shadow-sm">
            <option className="bg-card text-foreground" value="all">Todas</option>
            <option className="bg-card text-foreground" value="clt">CLT</option>
            <option className="bg-card text-foreground" value="autonomo">Autônomo(a)</option>
            <option className="bg-card text-foreground" value="estudante">Estudante</option>
            <option className="bg-card text-foreground" value="trabalha_estuda">Trabalha e Estuda</option>
            <option className="bg-card text-foreground" value="desempregado">Desempregado(a)</option>
            <option className="bg-card text-foreground" value="outro">Outros</option>
          </select>
        </div>
        <div className="min-w-[140px]">
          <Label className="text-xs">Motivo</Label>
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="flex h-9 w-full rounded-md border border-border/20 bg-card/60 backdrop-blur-md px-3 py-1 text-sm text-foreground shadow-sm">
            <option className="bg-card text-foreground" value="all">Todos</option>
            <option className="bg-card text-foreground" value="pago_real">Pago (Pix confirmado)</option>
            <option className="bg-card text-foreground" value="liberado">Liberado grátis/campanha</option>
            <option className="bg-card text-foreground" value="ativo">Ativo</option>
            <option className="bg-card text-foreground" value="pendente_pagamento">Pendente</option>
          </select>
        </div>
        <div className="min-w-[140px]">
          <Label className="text-xs">Senha</Label>
          <select value={passwordFilter} onChange={(e) => { setPasswordFilter(e.target.value); setPage(1); }}
            className="flex h-9 w-full rounded-md border border-border/20 bg-card/60 backdrop-blur-md px-3 py-1 text-sm text-foreground shadow-sm">
            <option className="bg-card text-foreground" value="all">Todos</option>
            <option className="bg-card text-foreground" value="sem_senha">Sem senha</option>
            <option className="bg-card text-foreground" value="com_senha">Com senha</option>
          </select>
        </div>
        <div className="min-w-[140px]">
          <Label className="text-xs">Situação</Label>
          <select value={blockFilter} onChange={(e) => { setBlockFilter(e.target.value); setPage(1); }}
            className="flex h-9 w-full rounded-md border border-border/20 bg-card/60 backdrop-blur-md px-3 py-1 text-sm text-foreground shadow-sm">
            <option className="bg-card text-foreground" value="all">Todas</option>
            <option className="bg-card text-foreground" value="bloqueados">Bloqueadas</option>
            <option className="bg-card text-foreground" value="ativos">Ativas</option>
          </select>
        </div>
        <div className="min-w-[90px]">
          <Label className="text-xs">Por página</Label>
          <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
            className="flex h-9 w-full rounded-md border border-border/20 bg-card/60 backdrop-blur-md px-3 py-1 text-sm text-foreground shadow-sm">
            {PAGE_SIZES.map((size) => (
              <option className="bg-card text-foreground" key={size} value={size}>{size === 99999 ? "Todos" : size}</option>
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

      <div className="flex flex-wrap items-end gap-3 border-t border-border/20 pt-3">
        <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold self-center">Filtro por data</p>
        <div>
          <Label className="text-xs">Cadastro de</Label>
          <Input type="date" value={createdFrom} onChange={(e) => { setCreatedFrom(e.target.value); setPage(1); }} className="w-40" />
        </div>
        <div>
          <Label className="text-xs">Cadastro até</Label>
          <Input type="date" value={createdTo} onChange={(e) => { setCreatedTo(e.target.value); setPage(1); }} className="w-40" />
        </div>
        <div>
          <Label className="text-xs">Expiração de</Label>
          <Input type="date" value={expiresFrom} onChange={(e) => { setExpiresFrom(e.target.value); setPage(1); }} className="w-40" />
        </div>
        <div>
          <Label className="text-xs">Expiração até</Label>
          <Input type="date" value={expiresTo} onChange={(e) => { setExpiresTo(e.target.value); setPage(1); }} className="w-40" />
        </div>
        {(createdFrom || createdTo || expiresFrom || expiresTo) && (
          <Button variant="ghost" size="sm" onClick={() => { setCreatedFrom(""); setCreatedTo(""); setExpiresFrom(""); setExpiresTo(""); setPage(1); }}>
            Limpar datas
          </Button>
        )}
      </div>

      <div className="text-xs text-muted-foreground">
        {isLoading ? "Carregando…" : (
          <span>
            {filtered.length} de {users.length} usuários &middot;
            <span className="text-success font-semibold"> {users.filter(u => u.status === "ativo" && isPaid(u)).length} pago</span>
            &middot;
            <span className="text-warning"> {users.filter(u => u.status === "ativo" && !isPaid(u)).length} liberado grátis/campanha</span>
            &middot;
            <span className="text-warning"> {users.filter(u => u.status === "pendente_pagamento").length} pendente</span>
            &middot;
            <span className="text-destructive"> {users.filter(u => u.needs_new_password === true).length} sem senha</span>
            &middot;
            <span className="text-destructive font-semibold"> {users.filter(u => u.access_status === "blocked").length} bloqueados</span>
          </span>
        )}
      </div>

      {selected.size > 0 && (
        <div className="flex flex-wrap items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 p-2.5">
          <span className="text-sm font-semibold text-primary px-1">
            <CheckCheck className="inline h-4 w-4 mr-1 -mt-0.5" />
            {selected.size} selecionado(s)
          </span>
          <Button variant="outline" size="sm" onClick={() => { setBulkReason("pago"); setBulkReleaseDate(""); setBulkModal("release"); }}>
            <CheckCircle2 className="h-4 w-4 mr-1" /> Liberar acesso
          </Button>
          <Button variant="outline" size="sm" onClick={() => { setBulkExpiryDate(""); setBulkModal("expiry"); }}>
            <CalendarClock className="h-4 w-4 mr-1" /> Data de expiração
          </Button>
          <Button variant="outline" size="sm" onClick={() => { if (window.confirm(`Expirar/desativar ${selected.size} usuário(s)?`)) setBulkModal("expire"); }}>
            <XCircle className="h-4 w-4 mr-1" /> Expirar
          </Button>
          <Button variant="outline" size="sm" onClick={() => { if (window.confirm(`Bloquear ${selected.size} usuário(s)?`)) setBulkModal("block"); }}>
            <Lock className="h-4 w-4 mr-1" /> Bloquear
          </Button>
          <Button variant="outline" size="sm" onClick={() => { if (window.confirm(`Desbloquear ${selected.size} usuário(s)?`)) setBulkModal("unblock"); }}>
            <LockOpen className="h-4 w-4 mr-1" /> Desbloquear
          </Button>
          <Button variant="destructive" size="sm" onClick={() => { if (window.confirm(`Excluir ${selected.size} usuário(s)? Esta ação não pode ser desfeita.`)) setBulkModal("delete"); }}>
            <Trash2 className="h-4 w-4 mr-1" /> Excluir
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setSelected(new Set())}>
            Limpar
          </Button>
        </div>
      )}

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
              <th className="px-3 py-2 w-10">
                <input
                  type="checkbox"
                  checked={allOnPageSelected}
                  onChange={toggleSelectAllPage}
                  title="Selecionar todos da página"
                />
              </th>
              <SortableTh field="name" label="Nome" />
              <SortableTh field="email" label="E-mail" />
              <th className="text-left px-3 py-2">CPF</th>
              <th className="text-left px-3 py-2">Telefone</th>
              <SortableTh field="status" label="Motivo" />
              <SortableTh field="password" label="Senha" />
              <SortableTh field="block" label="Situação" />
              <th className="text-left px-3 py-2">Ocupação</th>
              <SortableTh field="created" label="Cadastro" />
              <SortableTh field="expires" label="Expiração" />
              <th className="text-right px-3 py-2">Ações</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((u) => (
              <tr key={u.id} className="border-t border-border/30">
                <td className="px-3 py-2 w-10">
                  <input type="checkbox" checked={selected.has(u.id)} onChange={() => toggleSelect(u.id)} />
                </td>
                <td className="px-3 py-2">{u.display_name ?? "—"}</td>
                <td className="px-3 py-2">{u.email ?? "—"}</td>
                <td className="px-3 py-2 whitespace-nowrap">{u.cpf ?? "—"}</td>
                <td className="px-3 py-2">{u.phone ?? "—"}</td>
                <td className="px-3 py-2 whitespace-nowrap">
                  {u.status === "ativo" && isPaid(u) ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-success bg-success/10 border border-success/30 px-2 py-0.5 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-success" />
                      Pago
                    </span>
                  ) : u.status === "ativo" && !isPaid(u) ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-warning bg-warning/10 border border-warning/30 px-2 py-0.5 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-warning" />
                      Liberado grátis
                    </span>
                  ) : u.status === "pendente_pagamento" ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-muted-foreground bg-muted/40 border border-border/40 px-2 py-0.5 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
                      Pendente de pagamento
                    </span>
                  ) : (
                    <span className="text-[11px] text-muted-foreground">{u.status ?? "—"}</span>
                  )}
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  {u.needs_new_password === true ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-destructive bg-destructive/10 border border-destructive/30 px-2 py-0.5 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-destructive" />
                      Sem senha
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-success bg-success/10 border border-success/30 px-2 py-0.5 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-success" />
                      OK
                    </span>
                  )}
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  {u.access_status === "blocked" ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-destructive bg-destructive/10 border border-destructive/30 px-2 py-0.5 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-destructive animate-pulse" />
                      Bloqueado
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-success bg-success/10 border border-success/30 px-2 py-0.5 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-success" />
                      Ativo
                    </span>
                  )}
                </td>
                <td className="px-3 py-2">
                  {u.employment_status === "outro"
                    ? `Outro: ${u.employment_other ?? ""}`
                    : EMPLOYMENT_LABELS[u.employment_status ?? ""] ?? (u.employment_status ?? "—")}
                </td>
                <td className="px-3 py-2 whitespace-nowrap">{new Date(u.created_at).toLocaleDateString("pt-BR")}</td>
                <td className="px-3 py-2 whitespace-nowrap">{u.expires_at ? new Date(u.expires_at).toLocaleDateString("pt-BR") : "—"}</td>
                <td className="px-3 py-2 text-right whitespace-nowrap">
                  {u.status === "ativo" ? (
                    <button
                      title="Usuário ativo — clique para desativar"
                      onClick={async () => {
                        if (!window.confirm(`Tem certeza que deseja DESATIVAR "${u.display_name ?? u.email}"?`)) return;
                        try {
                          await deactivateUser({ data: { userId: u.id } });
                          toast.success("Usuário desativado");
                          qc.invalidateQueries({ queryKey: ["admin", "profiles"] });
                        } catch (err) {
                          toast.error(err instanceof Error ? err.message : "Erro ao desativar");
                        }
                      }}
                      className="inline-flex items-center justify-center h-8 w-8 rounded-md text-success hover:text-success/80 hover:bg-success/10"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                    </button>
                  ) : (
                    <button
                      title="Usuário inativo — clique para liberar acesso"
                      onClick={() => {
                        setReleaseReason(u.access_reason ?? "pago");
                        setReleaseDate(u.expires_at ? new Date(u.expires_at).toISOString().slice(0, 10) : "");
                        setReleaseTarget(u);
                      }}
                      className="inline-flex items-center justify-center h-8 w-8 rounded-md text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                    >
                      <XCircle className="h-4 w-4" />
                    </button>
                  )}
                  {u.access_status === "blocked" ? (
                    <button
                      title="Desbloquear conta"
                      onClick={() => {
                        setReleaseReason(u.access_reason ?? "pago");
                        setReleaseDate(u.expires_at ? new Date(u.expires_at).toISOString().slice(0, 10) : "");
                        setReleaseTarget(u);
                      }}
                      className="inline-flex items-center justify-center h-8 w-8 rounded-md text-warning hover:text-warning/80 hover:bg-warning/10"
                    >
                      <LockOpen className="h-4 w-4" />
                    </button>
                  ) : null}
                  <button
                    title="Baixa por confirmação de Pix"
                    onClick={() => {
                      setPixAmount("19.90");
                      setPixPlan("1_month");
                      setPixDate(u.expires_at ? new Date(u.expires_at).toISOString().slice(0, 10) : "");
                      setPixTarget(u);
                    }}
                    className="inline-flex items-center justify-center h-8 w-8 rounded-md text-muted-foreground hover:text-success hover:bg-success/10"
                  >
                    <BadgeDollarSign className="h-4 w-4" />
                  </button>
                  <button
                    title={u.free_trial_enabled === true ? "Teste grátis liberado — clique para remover" : u.free_trial_enabled === false ? "Teste grátis negado — clique para seguir config global" : "Liberar teste grátis para este usuário"}
                    onClick={async () => {
                      try {
                        const next = u.free_trial_enabled === true ? null : true;
                        await supabase.from("profiles").update({ free_trial_enabled: next }).eq("id", u.id);
                        toast.success(next === true ? "Teste grátis liberado para este usuário" : "Teste grátis removido do usuário");
                        qc.invalidateQueries({ queryKey: ["admin", "profiles"] });
                      } catch (err) {
                        toast.error(err instanceof Error ? err.message : "Erro ao atualizar");
                      }
                    }}
                    className={`inline-flex items-center justify-center h-8 w-8 rounded-md ${
                      u.free_trial_enabled === true
                        ? "text-primary hover:text-primary/80 hover:bg-primary/10"
                        : "text-muted-foreground hover:text-primary hover:bg-primary/10"
                    }`}
                  >
                    <Gift className="h-4 w-4" />
                  </button>
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
              <tr><td colSpan={13} className="text-center text-muted-foreground py-6">Nenhum usuário encontrado.</td></tr>
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

      <Dialog open={!!releaseTarget} onOpenChange={(o) => { if (!o) { setReleaseTarget(null); } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Liberar acesso</DialogTitle>
            <DialogDescription>
              Liberar acesso para <strong>{releaseTarget?.display_name ?? releaseTarget?.email}</strong>.
              Informe o motivo e até quando o acesso vale.
            </DialogDescription>
          </DialogHeader>
          <form
            className="space-y-4"
            onSubmit={async (e) => {
              e.preventDefault();
              if (!releaseTarget) return;
              setReleaseLoading(true);
              try {
                const { releaseUserAccess } = await import("@/lib/admin-operations.server");
                await releaseUserAccess({
                  data: {
                    userId: releaseTarget.id,
                    reason: releaseReason,
                    expiresAt: releaseDate ? `${releaseDate}T23:59:59` : null,
                  },
                });
                toast.success("Acesso liberado com sucesso!");
                setReleaseTarget(null);
                qc.invalidateQueries({ queryKey: ["admin", "profiles"] });
              } catch (err) {
                toast.error(err instanceof Error ? err.message : "Erro ao liberar acesso");
              } finally {
                setReleaseLoading(false);
              }
            }}
          >
            <div>
              <Label htmlFor="release-reason">Motivo da liberação</Label>
              <Select value={releaseReason} onValueChange={setReleaseReason}>
                <SelectTrigger id="release-reason" className="w-full">
                  <SelectValue placeholder="Selecione o motivo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pago">Pagou</SelectItem>
                  <SelectItem value="interno">Liberado internamente</SelectItem>
                  <SelectItem value="campanha">Campanha</SelectItem>
                  <SelectItem value="sorteio">Sorteio</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="release-date">Até qual data (opcional)</Label>
              <Input
                id="release-date"
                type="date"
                value={releaseDate}
                onChange={(e) => setReleaseDate(e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Deixe em branco para manter a data atual ou calcular pelo plano.
              </p>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={releaseLoading} className="w-full">
                {releaseLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Liberar acesso
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!pixTarget} onOpenChange={(o) => { if (!o) { setPixTarget(null); } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Baixa por confirmação de Pix</DialogTitle>
            <DialogDescription>
              Registrar que <strong>{pixTarget?.display_name ?? pixTarget?.email}</strong> pagou, mesmo sem o comprovante automático
              (caso de pagamento feito durante o desenvolvimento). Isso cria a transação como CONCLUÍDA e libera o acesso.
            </DialogDescription>
          </DialogHeader>
          <form
            className="space-y-4"
            onSubmit={async (e) => {
              e.preventDefault();
              if (!pixTarget) return;
              setPixLoading(true);
              try {
                const { registerPixPayment } = await import("@/lib/admin-operations.server");
                const parsed = parseFloat(pixAmount.replace(",", "."));
                await registerPixPayment({
                  data: {
                    userId: pixTarget.id,
                    amount: isNaN(parsed) ? undefined : parsed,
                    planType: pixPlan,
                    expiresAt: pixDate ? `${pixDate}T23:59:59` : null,
                  },
                });
                toast.success("Pagamento registrado e acesso liberado!");
                setPixTarget(null);
                qc.invalidateQueries({ queryKey: ["admin", "profiles"] });
                qc.invalidateQueries({ queryKey: ["admin", "paidTx"] });
              } catch (err) {
                toast.error(err instanceof Error ? err.message : "Erro ao registrar pagamento");
              } finally {
                setPixLoading(false);
              }
            }}
          >
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="pix-amount">Valor (R$)</Label>
                <Input
                  id="pix-amount"
                  type="text"
                  inputMode="decimal"
                  value={pixAmount}
                  onChange={(e) => setPixAmount(e.target.value)}
                  placeholder="19.90"
                />
              </div>
              <div>
                <Label htmlFor="pix-plan">Plano</Label>
                <Select value={pixPlan} onValueChange={setPixPlan}>
                  <SelectTrigger id="pix-plan" className="w-full">
                    <SelectValue placeholder="Plano" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1_month">1 mês (R$ 19,90)</SelectItem>
                    <SelectItem value="6_months">6 meses (R$ 29,90)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="pix-date">Data de expiração (opcional)</Label>
              <Input
                id="pix-date"
                type="date"
                value={pixDate}
                onChange={(e) => setPixDate(e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Em branco = calculada automaticamente pelo plano escolhido.
              </p>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={pixLoading} className="w-full">
                {pixLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Confirmar baixa
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={bulkModal !== null} onOpenChange={(o) => { if (!o) setBulkModal(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {bulkModal === "release" && "Liberar acesso em massa"}
              {bulkModal === "expiry" && "Atualizar data de expiração em massa"}
              {bulkModal === "expire" && "Expirar acesso em massa"}
              {bulkModal === "block" && "Bloquear usuários em massa"}
              {bulkModal === "unblock" && "Desbloquear usuários em massa"}
              {bulkModal === "delete" && "Excluir usuários em massa"}
            </DialogTitle>
            <DialogDescription>
              {selected.size > 0 && `Aplicando a ${selected.size} usuário(s) selecionado(s).`}
            </DialogDescription>
          </DialogHeader>
          {bulkModal === "release" && (
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); runBulk("release"); }}>
              <div>
                <Label>Motivo da liberação</Label>
                <Select value={bulkReason} onValueChange={setBulkReason}>
                  <SelectTrigger className="w-full"><SelectValue placeholder="Selecione o motivo" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pago">Pagou</SelectItem>
                    <SelectItem value="interno">Liberado internamente</SelectItem>
                    <SelectItem value="campanha">Campanha</SelectItem>
                    <SelectItem value="sorteio">Sorteio</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="bulk-release-date">Até qual data (opcional)</Label>
                <Input id="bulk-release-date" type="date" value={bulkReleaseDate} onChange={(e) => setBulkReleaseDate(e.target.value)} />
                <p className="text-xs text-muted-foreground mt-1">Em branco = calcula 6 meses a partir de hoje.</p>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={bulkLoading} className="w-full">
                  {bulkLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Liberar acesso
                </Button>
              </DialogFooter>
            </form>
          )}
          {bulkModal === "expiry" && (
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); runBulk("expiry"); }}>
              <div>
                <Label htmlFor="bulk-expiry-date">Nova data de expiração</Label>
                <Input id="bulk-expiry-date" type="date" value={bulkExpiryDate} onChange={(e) => setBulkExpiryDate(e.target.value)} />
                <p className="text-xs text-muted-foreground mt-1">Deixe em branco para remover a expiração (acesso sem data limite).</p>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={bulkLoading} className="w-full">
                  {bulkLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Atualizar data
                </Button>
              </DialogFooter>
            </form>
          )}
          {bulkModal === "expire" && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Os usuários selecionados terão o acesso expirado (status pendente de pagamento).</p>
              <DialogFooter>
                <Button variant="destructive" disabled={bulkLoading} className="w-full" onClick={() => runBulk("expire")}>
                  {bulkLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Confirmar expiração
                </Button>
              </DialogFooter>
            </div>
          )}
          {bulkModal === "block" && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Bloquear o login dos usuários selecionados?</p>
              <DialogFooter>
                <Button variant="destructive" disabled={bulkLoading} className="w-full" onClick={() => runBulk("block")}>
                  {bulkLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Confirmar bloqueio
                </Button>
              </DialogFooter>
            </div>
          )}
          {bulkModal === "unblock" && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Desbloquear o login dos usuários selecionados?</p>
              <DialogFooter>
                <Button disabled={bulkLoading} className="w-full" onClick={() => runBulk("unblock")}>
                  {bulkLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Confirmar desbloqueio
                </Button>
              </DialogFooter>
            </div>
          )}
          {bulkModal === "delete" && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Excluir definitivamente <strong>{selected.size}</strong> usuário(s)? Esta ação <strong>não pode ser desfeita</strong>.
              </p>
              <DialogFooter>
                <Button variant="destructive" disabled={bulkLoading} className="w-full" onClick={() => runBulk("delete")}>
                  {bulkLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Excluir definitivamente
                </Button>
              </DialogFooter>
            </div>
          )}
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

function SettingsPanel() {
  const qc = useQueryClient();
  const [saving, setSaving] = useState(false);
  const [groupLink, setGroupLink] = useState("");
  const [supportLink, setSupportLink] = useState("");
  const [tiktokLink, setTiktokLink] = useState("");
  const [showPopup, setShowPopup] = useState(true);
  const [showTiktokPopup, setShowTiktokPopup] = useState(true);
  const [showButton, setShowButton] = useState(true);
  const [freeTrialEnabled, setFreeTrialEnabled] = useState(true);
  const [freeTrialQuestions, setFreeTrialQuestions] = useState(7);
  const [loaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useQuery({
    queryKey: ["admin", "settings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("app_settings").select("key, value");
      if (error) {
        setLoadError(error.message);
        throw error;
      }
      const map = Object.fromEntries((data ?? []).map((r) => [r.key, r.value]));
      setGroupLink(map.whatsapp_group_link ?? "");
      setSupportLink(map.whatsapp_support_link ?? "https://wa.link/6sc2qc");
      setTiktokLink(map.tiktok_group_link ?? "");
      setShowPopup(map.show_group_popup !== "false");
      setShowTiktokPopup(map.show_tiktok_popup !== "false");
      setShowButton(map.show_whatsapp_button !== "false");
      setFreeTrialEnabled(map.free_trial_enabled !== "false");
      setFreeTrialQuestions(map.free_trial_questions ? parseInt(map.free_trial_questions, 10) : 7);
      setLoaded(true);
      return map;
    },
  });

  async function handleSave() {
    setSaving(true);
    try {
      const settings = [
        { key: "whatsapp_support_link", value: supportLink },
        { key: "show_whatsapp_button", value: showButton ? "true" : "false" },
        { key: "whatsapp_group_link", value: groupLink },
        { key: "show_group_popup", value: showPopup ? "true" : "false" },
        { key: "tiktok_group_link", value: tiktokLink },
        { key: "show_tiktok_popup", value: showTiktokPopup ? "true" : "false" },
        { key: "free_trial_enabled", value: freeTrialEnabled ? "true" : "false" },
        { key: "free_trial_questions", value: String(freeTrialQuestions) },
      ];
      for (const s of settings) {
        const { error } = await supabase.from("app_settings").upsert(s, { onConflict: "key" });
        if (error) throw error;
      }
      qc.invalidateQueries({ queryKey: ["admin", "settings"] });
      toast.success("Configurações salvas!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao salvar");
    } finally {
      setSaving(false);
    }
  }

  if (loadError) {
    return (
      <div className="glass rounded-2xl p-6 max-w-2xl">
        <p className="text-sm text-destructive mb-2">Erro ao carregar configurações.</p>
        <p className="text-xs text-muted-foreground mb-4">{loadError}</p>
        <p className="text-xs text-muted-foreground">
          Verifique se a migration <code className="text-primary">20260731000001_add_app_settings.sql</code> foi executada no SQL Editor do Supabase.
        </p>
      </div>
    );
  }

  if (!loaded) return <div className="text-sm text-muted-foreground py-8 text-center">Carregando configurações…</div>;

  return (
    <div className="glass rounded-2xl p-6 max-w-2xl space-y-8">
      <div>
        <h2 className="font-display font-bold text-lg">Configurações do WhatsApp</h2>
        <p className="text-sm text-muted-foreground">Links e exibição dos canais de comunicação do app.</p>
      </div>

      <div className="space-y-4">
        <h3 className="font-display font-bold text-sm">Botão de Suporte (todas as telas)</h3>
        <div className="space-y-2">
          <Label className="text-xs font-semibold">Link de Suporte</Label>
          <div className="flex gap-2">
            <Input value={supportLink} onChange={(e) => setSupportLink(e.target.value)} placeholder="https://wa.me/55…" className="flex-1" />
            <Button variant="outline" size="icon" onClick={() => window.open(supportLink, "_blank")} title="Abrir link">
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-xs font-semibold">Exibir Botão Flutuante do WhatsApp</Label>
            <p className="text-xs text-muted-foreground">Mostrar botão de suporte do WhatsApp no canto da tela.</p>
          </div>
          <Switch checked={showButton} onCheckedChange={setShowButton} />
        </div>
      </div>

      <div className="space-y-4 border-t border-border/40 pt-6">
        <h3 className="font-display font-bold text-sm">Grupo de Alunos</h3>
        <div className="space-y-2">
          <Label className="text-xs font-semibold">Link do Grupo</Label>
          <div className="flex gap-2">
            <Input value={groupLink} onChange={(e) => setGroupLink(e.target.value)} placeholder="https://chat.whatsapp.com/…" className="flex-1" />
            <Button variant="outline" size="icon" onClick={() => window.open(groupLink, "_blank")} title="Abrir link">
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-xs font-semibold">Exibir Pop-up do Grupo</Label>
            <p className="text-xs text-muted-foreground">Mostrar modal de convite do WhatsApp para alunos ativos.</p>
          </div>
          <Switch checked={showPopup} onCheckedChange={setShowPopup} />
        </div>
      </div>

      <div className="space-y-4 border-t border-border/40 pt-6">
        <h3 className="font-display font-bold text-sm">Grupo de Conversa (TikTok)</h3>
        <div className="space-y-2">
          <Label className="text-xs font-semibold">Link do Grupo</Label>
          <div className="flex gap-2">
            <Input value={tiktokLink} onChange={(e) => setTiktokLink(e.target.value)} placeholder="https://tiktok.me/group/…" className="flex-1" />
            <Button variant="outline" size="icon" onClick={() => window.open(tiktokLink, "_blank")} title="Abrir link">
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-xs font-semibold">Exibir Pop-up do Grupo</Label>
            <p className="text-xs text-muted-foreground">Mostrar modal de convite do grupo de conversa para alunos ativos.</p>
          </div>
          <Switch checked={showTiktokPopup} onCheckedChange={setShowTiktokPopup} />
        </div>
      </div>

      <div className="space-y-4 border-t border-border/40 pt-6">
        <h3 className="font-display font-bold text-sm">Teste Grátis no Cadastro</h3>
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-xs font-semibold">Oferecer teste grátis</Label>
            <p className="text-xs text-muted-foreground">
              Quando ativo, quem se cadastra tem a opção de fazer o simulado grátis antes de ver os planos. Quando inativo, vai direto para o checkout. Você também pode liberar individualmente na lista de usuários.
            </p>
          </div>
          <Switch checked={freeTrialEnabled} onCheckedChange={setFreeTrialEnabled} />
        </div>

        <div className="flex items-center justify-between pt-2">
          <div>
            <Label className="text-xs font-semibold">Número de questões do teste grátis</Label>
            <p className="text-xs text-muted-foreground">Quantas questões o aluno responde no simulado grátis (máximo 7).</p>
          </div>
          <div className="flex items-center gap-1.5">
            {[3, 5, 7].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setFreeTrialQuestions(n)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors border ${
                  freeTrialQuestions === n
                    ? "bg-primary text-primary-foreground border-primary shadow-glow"
                    : "bg-secondary/40 text-muted-foreground border-border/40 hover:bg-secondary/70"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-2">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          Salvar Configurações
        </Button>
      </div>
    </div>
  );
}
