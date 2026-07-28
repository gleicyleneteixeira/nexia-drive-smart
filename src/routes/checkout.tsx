import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Loader2, CheckCircle2, Copy, Clock, CreditCard, Sparkles, Terminal } from "lucide-react";
import { getExpiryDate, isProfileExpired } from "@/lib/subscription";

export const Route = createFileRoute("/checkout")({
  component: CheckoutPage,
  head: () => ({ meta: [{ title: "Checkout Pix — Nexia DETRAN" }] }),
});

function playWinChime() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + idx * 0.12);
      gain.gain.setValueAtTime(0.12, now + idx * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.5);
      osc.connect(gain); gain.connect(ctx.destination);
      osc.start(now + idx * 0.12); osc.stop(now + idx * 0.12 + 0.5);
    });
  } catch (e) { console.warn("Failed to play audio chime:", e); }
}

function startConfetti() {
  const canvas = document.createElement("canvas");
  canvas.id = "confetti-canvas";
  canvas.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999";
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const width = canvas.width = window.innerWidth;
  const height = canvas.height = window.innerHeight;
  const colors = ["#2563eb", "#3b82f6", "#eab308", "#10b981", "#ef4444", "#a855f7"];
  const particles: Array<{
    x: number; y: number; size: number; color: string;
    speedX: number; speedY: number; rotation: number; rotationSpeed: number;
  }> = [];
  for (let i = 0; i < 150; i++) {
    const isLeft = Math.random() > 0.5;
    particles.push({
      x: isLeft ? 0 : width, y: height - 50,
      size: Math.random() * 8 + 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      speedX: (isLeft ? 1 : -1) * (Math.random() * 15 + 8),
      speedY: -(Math.random() * 20 + 15),
      rotation: Math.random() * 360,
      rotationSpeed: Math.random() * 10 - 5,
    });
  }
  function update() {
    let alive = false;
    ctx!.clearRect(0, 0, width, height);
    particles.forEach(p => {
      p.x += p.speedX; p.y += p.speedY; p.speedY += 0.5; p.speedX *= 0.98; p.rotation += p.rotationSpeed;
      ctx!.save(); ctx!.translate(p.x, p.y); ctx!.rotate((p.rotation * Math.PI) / 180);
      ctx!.fillStyle = p.color; ctx!.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      ctx!.restore();
      if (p.y < height + 50 && p.x > -50 && p.x < width + 50) alive = true;
    });
    if (alive) requestAnimationFrame(update); else canvas.remove();
  }
  requestAnimationFrame(update);
}

function CheckoutPage() {
  const navigate = useNavigate();
  const { user, profile, loading: authLoading, refreshProfile } = useAuth();

  const isLocalEnv = typeof window !== "undefined" && (
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1" ||
    window.location.hostname.startsWith("192.168.") ||
    window.location.hostname.endsWith(".local")
  );

  const [selectedPlan, setSelectedPlan] = useState<{ id: "1_month" | "3_months" | "6_months"; price: number; name: string } | null>(null);
  const [pixLoading, setPixLoading] = useState(false);
  const [pixData, setPixData] = useState<{
    txid: string; pixCopiaECola: string; qrcodeBase64: string | null;
  } | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(3600);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);

  const [isGiftOpened, setIsGiftOpened] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("nexia:gift_opened") === "true";
    }
    return false;
  });
  const [isOpening, setIsOpening] = useState(false);
  const [flashCards, setFlashCards] = useState(false);
  const [showGiftDialog, setShowGiftDialog] = useState(false);

  const pollingRef = useRef<NodeJS.Timeout | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isGiftOpened) {
      const timer = setTimeout(() => setShowGiftDialog(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleOpenGift = () => {
    if (isGiftOpened || isOpening) return;
    setIsOpening(true);
    playWinChime();
    startConfetti();
    setTimeout(() => {
      setIsGiftOpened(true);
      setFlashCards(true);
      if (typeof window !== "undefined") {
        localStorage.setItem("nexia:gift_opened", "true");
      }
      setTimeout(() => setFlashCards(false), 800);
    }, 600);
  };

  useEffect(() => {
    if (!authLoading && user && profile && !paymentConfirmed) {
      if (profile.status === "ativo" && !isProfileExpired(profile)) {
        navigate({ to: "/app", replace: true });
      }
    }
  }, [user, profile, authLoading, navigate, paymentConfirmed]);

  useEffect(() => {
    return () => { stopTimer(); stopPolling(); };
  }, []);

  const startTimer = () => {
    stopTimer(); setTimeLeft(3600);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) { stopTimer(); stopPolling(); setPixData(null); setModalOpen(false); toast.error("O código Pix expirou. Gere uma nova cobrança."); return 0; }
        return prev - 1;
      });
    }, 1000);
  };
  const stopTimer = () => { if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; } };

  const startPolling = (txid: string) => {
    stopPolling();
    if (typeof window !== "undefined" && localStorage.getItem("nexia:use_mock_mode") === "true") return;
    pollingRef.current = setInterval(async () => {
      try {
        const response = await fetch(`/api/pix/status?txid=${txid}`);
        if (!response.ok) throw new Error("Erro ao consultar status");
        const data = await response.json();
        if (data.status === "CONCLUIDA" || data.status === "paid") {
          await refreshProfile();
          stopPolling(); stopTimer(); setPaymentConfirmed(true);
          toast.success("Pagamento confirmado com sucesso!");
          setTimeout(() => { navigate({ to: "/app", replace: true }); }, 2000);
        }
      } catch (err) { console.error("Erro no polling:", err); }
    }, 3000);
  };
  const stopPolling = () => { if (pollingRef.current) { clearInterval(pollingRef.current); pollingRef.current = null; } };

  const handleSelectPlan = async (planId: "1_month" | "3_months" | "6_months", price: number, planName: string) => {
    if (!user) return;
    setSelectedPlan({ id: planId, price, name: planName });
    setPixLoading(true); setPixData(null); setModalOpen(true);
    try {
      const response = await fetch("/api/pix/create", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, planType: planId, amount: price }),
      });
      if (!response.ok) throw new Error("Não foi possível gerar a cobrança Pix.");
      const data = await response.json();
      setPixData({ txid: data.txid, pixCopiaECola: data.pixCopiaECola, qrcodeBase64: data.qrcodeBase64 || null });
      startTimer(); startPolling(data.txid);
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Erro ao gerar o Pix. Usando simulação.");
      const mockTxid = "mock_" + Math.random().toString(36).substring(2, 15);
      setPixData({
        txid: mockTxid,
        pixCopiaECola: "00020101021226990014BR.GOV.BCB.PIX2577mockpixcopiaecola" + mockTxid + "5204000053039865405" + price.toFixed(2) + "5802BR5913NexiaDetran6009SAOPAULO62070503***6304",
        qrcodeBase64: null,
      });
      startTimer(); startPolling(mockTxid);
    } finally { setPixLoading(false); }
  };

  const copyToClipboard = () => {
    if (!pixData) return;
    navigator.clipboard.writeText(pixData.pixCopiaECola);
    setCopied(true); toast.success("Código Pix copiado!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulateSuccess = async () => {
    if (!isLocalEnv) {
      toast.error("Simulação não permitida em ambiente de produção.");
      return;
    }
    setPixLoading(true);
    try {
      if (typeof window !== "undefined" && localStorage.getItem("nexia:use_mock_mode") === "true") {
        const mockProfileStr = localStorage.getItem("nexia:mock_profile");
        if (mockProfileStr) {
          const profileObj = JSON.parse(mockProfileStr);
          profileObj.status = "ativo";
          profileObj.expires_at = getExpiryDate("1_month").toISOString();
          localStorage.setItem("nexia:mock_profile", JSON.stringify(profileObj));
        }
        await refreshProfile();
        stopPolling(); stopTimer(); setPaymentConfirmed(true);
        toast.success("Simulação de pagamento ativa!");
        setTimeout(() => { navigate({ to: "/app", replace: true }); }, 1500);
        return;
      }
      if (!user?.id) throw new Error("Usuário não autenticado");
      const { error } = await supabase
        .from("profiles").upsert({
          id: user.id,
          email: user.email,
          status: "ativo",
          expires_at: getExpiryDate("1_month").toISOString(),
        }, { onConflict: "id" });
      if (error) throw error;
      await refreshProfile();
      stopPolling(); stopTimer(); setPaymentConfirmed(true);
      toast.success("Simulação de pagamento ativa!");
      setTimeout(() => { navigate({ to: "/app", replace: true }); }, 1500);
    } catch (err) {
      toast.error("Erro ao simular pagamento: " + (err instanceof Error ? err.message : ""));
    } finally { setPixLoading(false); }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60); const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  const plans = [
    {
      id: "1_month" as const,
      name: isGiftOpened ? "Plano 60 Dias (Leve 2 Pague 1)" : "Plano 1 Mês",
      description: isGiftOpened ? "Ganha +30 dias grátis de acesso!" : "Acesso completo por 30 dias",
      price: isGiftOpened ? 14.99 : 79.90,
      oldPrice: 79.90,
      discount: "81% de Desconto",
      badge: isGiftOpened ? "Pague 1, Leve 2" : undefined,
      bulletPoints: isGiftOpened ? [
        "Acesso completo por 60 dias",
        "Ganha +1 Mês de Bônus Grátis",
        "Simulados inteligentes ilimitados",
        "Vídeos explicativos do psicotécnico",
      ] : [
        "Acesso completo por 30 dias",
        "Simulados inteligentes ilimitados",
        "Vídeos explicativos do psicotécnico",
        "Suporte padrão via chat",
      ],
      buttonText: isGiftOpened ? "Liberar Acesso 60 Dias" : "Liberar Acesso 1 Mês",
    },
    {
      id: "3_months" as const,
      name: "Plano 3 Meses",
      description: "Tempo ideal para passar sem pressa",
      price: isGiftOpened ? 19.90 : 99.90,
      oldPrice: 99.90,
      discount: "80% de Desconto",
      badge: isGiftOpened ? "Mais Vendido" : undefined,
      bulletPoints: [
        "Acesso completo por 90 dias",
        "Tudo do plano de 1 Mês",
        "Suporte prioritário via WhatsApp",
        "Atualizações de questões gratuitas",
      ],
      buttonText: "Liberar Acesso 3 Meses",
    },
    {
      id: "6_months" as const,
      name: "Plano 6 Meses",
      description: "Tempo completo até sua aprovação",
      price: isGiftOpened ? 49.90 : 249.90,
      oldPrice: 249.90,
      discount: "80% de Desconto",
      badge: isGiftOpened ? "Melhor Valor" : undefined,
      bulletPoints: [
        "Acesso completo por 180 dias",
        "Tudo do plano de 3 Meses",
        "Material complementar para download",
        "Garantia incondicional de aprovação",
      ],
      buttonText: "Liberar Acesso 6 Meses",
    },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 md:py-16 space-y-8">
      <style>{`
        @keyframes flash-reveal {
          0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(34,197,94,0); }
          30% { transform: scale(1.03); box-shadow: 0 0 20px 4px rgba(34,197,94,0.3); }
          60% { transform: scale(0.99); box-shadow: 0 0 10px 2px rgba(34,197,94,0.15); }
          100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(34,197,94,0); }
        }
        .flash-card { animation: flash-reveal 0.7s ease-out; }
        @keyframes slide-down-fade {
          from { opacity: 0; transform: translateY(-12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-down { animation: slide-down-fade 0.5s ease-out; }
        @keyframes float-gentle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-float { animation: float-gentle 3s ease-in-out infinite; }
        @keyframes gift-open {
          0% { transform: scale(1) rotate(0deg); }
          20% { transform: scale(1.12) rotate(-6deg); }
          40% { transform: scale(0.92) rotate(4deg); }
          60% { transform: scale(1.06) rotate(-2deg); }
          100% { transform: scale(0) rotate(10deg); opacity: 0; }
        }
        .animate-gift-open { animation: gift-open 0.6s ease-in forwards; }
        @keyframes gift-entrance {
          from { opacity: 0; transform: scale(0.6) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-gift-entrance { animation: gift-entrance 0.6s cubic-bezier(0.34, 1.56, 0.64, 1); }
        @keyframes check-entrance {
          from { opacity: 0; transform: scale(0); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-check-entrance { animation: check-entrance 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.3s both; }
      `}</style>

      {/* Top banner — ONLY after gift reveal */}
      {isGiftOpened && (
        <div className="animate-slide-down glass rounded-2xl p-5 border-primary/20 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-primary-glow">Cadastro Realizado com Sucesso!</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Conta criada para <strong className="text-foreground">{user?.email}</strong>. Falta apenas liberar seu acesso para usar o simulador.
            </p>
          </div>
          <div className="px-3 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-xs font-semibold text-primary">
            Aguardando Pagamento
          </div>
        </div>
      )}

      <div className="text-center space-y-3 max-w-lg mx-auto">
        <h1 className="text-3xl font-display font-bold">Escolha seu plano de estudos</h1>
        <p className="text-sm text-muted-foreground">
          Acesso imediato com simulados inteligentes, vídeos explicativos de dicas do psicotécnico e jogos interativos.
        </p>
      </div>

      {/* Gift activation banner — ONLY after reveal */}
      {isGiftOpened && (
        <div className="animate-slide-down max-w-2xl mx-auto p-4 rounded-2xl border border-success/30 bg-success/5 text-center space-y-2">
          <p className="text-sm font-semibold text-success flex items-center justify-center gap-2">
            <Sparkles className="h-4 w-4" />
            Ganhe +30 Dias Grátis!
            <Sparkles className="h-4 w-4" />
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Todos os planos estão com desconto especial de até <strong className="text-success">81% OFF</strong>!
            O Plano de 1 Mês foi promovido para <strong className="text-foreground">60 Dias (Pague 1, Leve 2)</strong> por apenas <strong className="text-foreground">R$ 14,99</strong>.
          </p>
          <p className="text-[10px] text-warning font-semibold">⚠️ Esta oferta expira em 24 horas.</p>
        </div>
      )}

      {/* Plans grid with gift box dialog on top */}
      <div className="max-w-4xl mx-auto">

      {/* GIFT BOX DIALOG — centered modal with glassmorphism */}
      <Dialog open={showGiftDialog && !isGiftOpened} onOpenChange={(open) => {
        if (!open && !isGiftOpened) {
          return;
        }
        setShowGiftDialog(open);
      }}>
        <DialogContent
          hideClose
          className="sm:max-w-sm p-0 border-0 bg-transparent shadow-none"
        >
          <div className={`glass p-8 md:p-10 rounded-3xl border border-primary/30 max-w-sm w-full mx-auto space-y-5 text-center bg-gradient-to-b from-primary/10 to-background/5 shadow-glow ${isOpening ? "" : "animate-gift-entrance"}`}>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-warning/10 border border-warning/20 text-[10px] font-bold text-warning animate-pulse">
              <Sparkles className="h-3 w-3" /> Presente de Boas-Vindas!
            </span>

            {/* Animated SVG Gift Box */}
            <div className="py-2">
              <div className="relative mx-auto w-28 h-28 flex items-center justify-center">
                <div className={`relative w-24 h-24 animate-float ${isOpening ? "animate-gift-open" : ""}`}>
                  <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_10px_20px_rgba(37,99,235,0.35)]">
                    <g>
                      <rect x="22" y="32" width="56" height="12" rx="3" fill="url(#gLid)" stroke="#2563eb" strokeWidth="1.5" />
                      <rect x="45" y="32" width="10" height="12" fill="#eab308" />
                      <path d="M50 32 C38 20, 36 28, 48 32 Z" fill="#eab308" stroke="#ca8a04" strokeWidth="1" />
                      <path d="M50 32 C62 20, 64 28, 52 32 Z" fill="#eab308" stroke="#ca8a04" strokeWidth="1" />
                    </g>
                    <g>
                      <rect x="25" y="44" width="50" height="42" rx="5" fill="url(#gBody)" stroke="#2563eb" strokeWidth="1.5" />
                      <rect x="45" y="44" width="10" height="42" fill="#eab308" />
                      <rect x="25" y="60" width="50" height="6" fill="#eab308" />
                      <circle cx="50" cy="63" r="7" fill="#eab308" stroke="#ca8a04" strokeWidth="1" />
                      <path d="M50 59 L52 62 L55 63 L53 65 L54 68 L50 66 L46 68 L47 65 L45 63 L48 62 Z" fill="#ffffff" />
                    </g>
                    <defs>
                      <linearGradient id="gLid" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#1d4ed8" />
                      </linearGradient>
                      <linearGradient id="gBody" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#60a5fa" />
                        <stop offset="100%" stopColor="#2563eb" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 pointer-events-none">
                    <Sparkles className="absolute -top-2 left-0 h-4 w-4 text-warning animate-bounce" />
                    <Sparkles className="absolute -bottom-1 right-0 h-3.5 w-3.5 text-warning animate-ping" />
                    <Sparkles className="absolute top-5 -right-3 h-4 w-4 text-warning animate-pulse" />
                  </div>
                </div>
              </div>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              Clique no presente para destravar <strong className="text-success">até 81% de desconto</strong> em todos os planos!
            </p>
            <p className="text-[10px] text-warning font-semibold">⚠️ Oferta especial expira em 24 horas.</p>

            <Button
              onClick={handleOpenGift}
              disabled={isOpening}
              className="w-full h-11 rounded-xl font-bold gradient-primary text-primary-foreground shadow-glow cursor-pointer"
            >
              {isOpening ? "Abrindo..." : "Abrir"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

        {/* Plans grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`glass relative overflow-hidden flex flex-col justify-between transition-all duration-300 ${
                flashCards ? "flash-card" : ""
              } ${
                plan.badge === "Pague 1, Leve 2" || plan.badge === "Mais Vendido"
                  ? "border-primary/50 shadow-glow scale-[1.01]"
                  : "border-border/40 hover:border-primary/20"
              }`}
            >
              {plan.badge && (
                <div className={`absolute top-3 right-3 border text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                  plan.badge.includes("Leve 2")
                    ? "bg-success/20 border-success/40 text-success"
                    : "bg-primary/20 border-primary/40 text-primary-glow"
                }`}>
                  {plan.badge}
                </div>
              )}

              <CardHeader className="pb-4">
                <CardTitle className="text-xl flex items-center gap-1.5">
                  {plan.name}
                  {plan.id === "1_month" && isGiftOpened && (
                    <Sparkles className="h-4 w-4 text-warning fill-warning" />
                  )}
                </CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-1">
                  {isGiftOpened ? (
                    <div className="flex flex-col">
                      <span className="text-[11px] text-muted-foreground line-through">
                        De R$ {plan.oldPrice.toFixed(2).replace(".", ",")}
                      </span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold font-display text-primary-glow">
                          R$ {plan.price.toFixed(2).replace(".", ",")}
                        </span>
                        <span className="inline-block text-[10px] font-bold text-success bg-success/15 border border-success/30 px-1.5 py-0.5 rounded">
                          {plan.discount}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <span className="text-3xl font-bold font-display text-muted-foreground">
                      R$ {plan.price.toFixed(2).replace(".", ",")}
                    </span>
                  )}
                  <span className="text-xs text-muted-foreground block mt-1">
                    {plan.id === "1_month" && isGiftOpened
                      ? "Pagamento único (60 dias de acesso!)"
                      : "Pagamento único no Pix"}
                  </span>
                </div>
                <ul className="text-sm text-muted-foreground space-y-2 pt-2 border-t border-border/10">
                  {plan.bulletPoints.map((bp, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                      {bp}
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter className="pt-4">
                <Button
                  onClick={() => handleSelectPlan(plan.id, plan.price, plan.name)}
                  className={`w-full h-11 rounded-xl font-bold cursor-pointer ${
                    plan.badge === "Pague 1, Leve 2" || plan.badge === "Mais Vendido"
                      ? "gradient-primary text-primary-foreground shadow-glow"
                      : ""
                  }`}
                >
                  {plan.buttonText}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* Developer Mode Bypass */}
      {isLocalEnv && (
        <div className="max-w-2xl mx-auto p-4 rounded-xl border border-warning/20 bg-warning/5 text-center space-y-3">
          <p className="text-xs text-warning flex items-center justify-center gap-1.5">
            <Terminal className="h-4 w-4" />
            Ambiente de Desenvolvimento
          </p>
          <p className="text-xs text-muted-foreground">
            Você pode simular um pagamento Pix de sucesso imediatamente para ver o simulador funcionando.
          </p>
          <Button
            onClick={handleSimulateSuccess}
            variant="outline"
            className="h-9 px-4 text-xs font-semibold text-warning hover:bg-warning/10 cursor-pointer"
          >
            Simular Sucesso do Pagamento (Liberar Acesso)
          </Button>
        </div>
      )}

      {/* Payment Modal */}
      <Dialog open={modalOpen} onOpenChange={(open) => {
        setModalOpen(open);
        if (!open) { stopTimer(); stopPolling(); }
      }}>
        <DialogContent className="sm:max-w-md glass border-border/40">
          <DialogHeader>
            <DialogTitle className="text-center font-display text-xl">Pagamento via Pix</DialogTitle>
            <DialogDescription className="text-center">
              Acesse o app do seu banco e escaneie o QR Code ou copie a chave abaixo.
            </DialogDescription>
          </DialogHeader>

          {pixLoading ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Gerando cobrança Pix...</p>
            </div>
          ) : paymentConfirmed ? (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-success/15 border border-success/40 flex items-center justify-center text-success animate-bounce">
                <CheckCircle2 className="h-10 w-10" />
              </div>
              <h3 className="text-lg font-bold">Pagamento Confirmado!</h3>
              <p className="text-sm text-muted-foreground">
                Liberando seu acesso e redirecionando para a plataforma...
              </p>
            </div>
          ) : pixData ? (
            <div className="space-y-5 pt-3">
              <div className="flex flex-col items-center justify-center">
                <div className="p-3 bg-white rounded-2xl w-48 h-48 flex items-center justify-center shadow-card relative border border-border/20">
                  {pixData.qrcodeBase64 ? (
                    <img src={pixData.qrcodeBase64} alt="QR Code Pix" className="w-full h-full" />
                  ) : (
                    <div className="w-full h-full bg-slate-100 flex flex-col items-center justify-center text-[10px] text-muted-foreground font-mono text-center px-2">
                      <CreditCard className="h-8 w-8 text-primary mb-1" />
                      <span>Simulador Pix Ativo</span>
                      <span className="text-[8px] mt-1 text-slate-400">Escaneie pelo Copia e Cola</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-4 font-mono">
                  <Clock className="h-3.5 w-3.5" />
                  <span>Código expira em: </span>
                  <span className="font-semibold text-foreground">{formatTime(timeLeft)}</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground block font-medium">Chave Pix Copia e Cola:</label>
                <div className="flex gap-2">
                  <input
                    type="text" readOnly value={pixData.pixCopiaECola}
                    className="flex-1 px-3 py-2 text-xs rounded-xl bg-background/50 border border-border/20 text-muted-foreground font-mono truncate"
                  />
                  <Button onClick={copyToClipboard} className="shrink-0 h-9 px-3 rounded-xl cursor-pointer">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-primary/5 border border-primary/10 flex items-center gap-3">
                <Loader2 className="h-4 w-4 animate-spin text-primary shrink-0" />
                <span className="text-xs text-muted-foreground">Aguardando pagamento... O simulador será liberado na hora.</span>
              </div>
              <div className="pt-2 border-t border-border/10 text-center">
                <button onClick={handleSimulateSuccess} className="text-xs text-warning hover:underline font-semibold cursor-pointer">
                  [ Testar ] Simular Confirmação Pix
                </button>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
