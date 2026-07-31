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
  head: () => ({ meta: [{ title: "Checkout Pix — NEXIA DRIVE Simulado" }] }),
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
 
  const [discountTimeLeft, setDiscountTimeLeft] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem("nexia:discount_timer");
      if (saved) {
        const remaining = Math.max(0, Math.floor((Number(saved) - Date.now()) / 1000));
        return remaining;
      }
      const expiry = Date.now() + 120 * 60 * 1000;
      sessionStorage.setItem("nexia:discount_timer", String(expiry));
      return 120 * 60;
    }
    return 120 * 60;
  });
 
  useEffect(() => {
    if (!isGiftOpened) return;
    const interval = setInterval(() => {
      setDiscountTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isGiftOpened]);
 
  const [showRouletteDialog, setShowRouletteDialog] = useState(false);
  const [hasSpunRoulette, setHasSpunRoulette] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("nexia:roulette_spun") === "true";
    }
    return false;
  });
  const [rouletteDiscount, setRouletteDiscount] = useState<number | null>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("nexia:roulette_discount");
      return saved ? Number(saved) : null;
    }
    return null;
  });
 
  const [wheelAngle, setWheelAngle] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinningCompleted, setSpinningCompleted] = useState(false);
 
  useEffect(() => {
    if (isGiftOpened && discountTimeLeft === 0 && !hasSpunRoulette) {
      setShowRouletteDialog(true);
    }
  }, [isGiftOpened, discountTimeLeft, hasSpunRoulette]);
 
  const spinWheel = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    
    // Slices: 30%, 20%, 31%, 25%, 33%.
    // Slice 5 (33%) center is at 324 degrees.
    const finalAngle = 1800 + 324;
    setWheelAngle(finalAngle);
 
    setTimeout(() => {
      setIsSpinning(false);
      setSpinningCompleted(true);
      setRouletteDiscount(33);
      if (typeof window !== "undefined") {
        localStorage.setItem("nexia:roulette_spun", "true");
        localStorage.setItem("nexia:roulette_discount", "33");
      }
      setHasSpunRoulette(true);
      playWinChime();
      startConfetti();
    }, 4000);
  };
 
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
      toast.error(err instanceof Error ? err.message : "Erro ao gerar o Pix.");
      setModalOpen(false);
    } finally { setPixLoading(false); }
  };

  const copyToClipboard = () => {
    if (!pixData) return;
    navigator.clipboard.writeText(pixData.pixCopiaECola);
    setCopied(true); toast.success("Código Pix copiado!");
    setTimeout(() => setCopied(false), 2000);
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) {
      return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  const giftOfferActive = isGiftOpened && discountTimeLeft > 0;

  const plans = [
    {
      id: "1_month" as const,
      name: "Plano Intensivo (30 Dias)",
      description: "Para quem já está na reta final e quer apenas revisar.",
      price: (() => {
        if (isGiftOpened && discountTimeLeft > 0) return 19.90;
        if (isGiftOpened && rouletteDiscount) return 19.90;
        return 29.90;
      })(),
      oldPrice: 29.90,
      discount: (() => {
        if (isGiftOpened && discountTimeLeft > 0) return "33% OFF";
        if (isGiftOpened && rouletteDiscount) return `${rouletteDiscount}% OFF`;
        return "";
      })(),
      badge: "PLANO RÁPIDO",
      bulletPoints: [
        "Acesso completo por 30 dias",
        "Simulados inteligentes ilimitados",
        "Banco de questões atualizado do DETRAN",
        "Histórico de desempenho e erros",
      ],
      buttonText: "Liberar Acesso 30 Dias",
      priceLegend: "Pagamento único no Pix (30 dias de acesso)",
    },
    {
      id: "6_months" as const,
      name: "Combo CNH Aprovada (6 Meses)",
      description: "O guia definitivo para não reprovar no Teórico, Psicotécnico e Prática.",
      price: (() => {
        if (isGiftOpened && discountTimeLeft > 0) return 29.90;
        if (isGiftOpened && rouletteDiscount) {
          return Number((59.90 * (1 - rouletteDiscount / 100)).toFixed(2));
        }
        return 59.90;
      })(),
      oldPrice: 59.90,
      discount: (() => {
        if (isGiftOpened && discountTimeLeft > 0) return "50% OFF";
        if (isGiftOpened && rouletteDiscount) return `${rouletteDiscount}% OFF`;
        return "";
      })(),
      badge: "MAIS VENDIDO",
      bulletPoints: [
        "Acesso total por 180 dias (sem pressa de vencer)",
        "Simulados inteligentes ilimitados",
        "Módulo Psicotécnico Completo (Atenção, memória e teste dos palitinhos)",
        "Guia da Prova Prática (Dicas de baliza e erros que reprovam)",
        "Suporte prioritário via WhatsApp",
        "Atualizações gratuitas de legislação",
      ],
      buttonText: "Liberar Combo Completo",
      priceLegend: "Pagamento único no Pix (180 dias de acesso)",
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

      {/* Gift activation banner — ONLY after reveal and while timer is active */}
      {isGiftOpened && discountTimeLeft > 0 && (
        <div className="animate-slide-down max-w-2xl mx-auto p-4 rounded-2xl border border-success/30 bg-success/5 text-center space-y-2">
          <p className="text-sm font-semibold text-success flex items-center justify-center gap-2">
            <Sparkles className="h-4 w-4 text-warning fill-warning" />
            ⚡ Oferta Relâmpago: Super Desconto Ativado! ⚡
            <Sparkles className="h-4 w-4 text-warning fill-warning" />
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Seus planos foram promovidos com <strong className="text-success">até 50% de desconto extra</strong>! Aproveite!
          </p>
          <p className="text-[10px] text-warning font-semibold flex items-center justify-center gap-1.5 animate-pulse">
            <Clock className="h-3.5 w-3.5" />
            Esta oferta especial expira em: <span className="font-mono text-xs bg-warning/20 border border-warning/40 px-2 py-0.5 rounded font-bold">{formatTime(discountTimeLeft)}</span>
          </p>
        </div>
      )}
 
      {/* Roulette activation banner — ONLY after spin */}
      {isGiftOpened && discountTimeLeft === 0 && rouletteDiscount && (
        <div className="animate-slide-down max-w-2xl mx-auto p-4 rounded-2xl border border-primary/30 bg-primary/5 text-center space-y-2">
          <p className="text-sm font-semibold text-primary-glow flex items-center justify-center gap-2">
            <Sparkles className="h-4 w-4 text-warning fill-warning" />
            ⚡ Oportunidade Única: Desconto de {rouletteDiscount}% Ativado! ⚡
            <Sparkles className="h-4 w-4 text-warning fill-warning" />
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Como seu tempo expirou, garantimos uma última chance com <strong className="text-primary-glow">{rouletteDiscount}% de desconto extra</strong> nos planos! Aproveite agora!
          </p>
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
              Clique no presente para destravar seu <strong className="text-success">Super Desconto</strong> nos planos!
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
 
      {/* ROULETTE DIALOG — interactive wheel of fortune fallback */}
      <Dialog open={showRouletteDialog} onOpenChange={(open) => {
        if (!open && !hasSpunRoulette) return;
        setShowRouletteDialog(open);
      }}>
        <DialogContent
          hideClose
          className="sm:max-w-md p-0 border-0 bg-transparent shadow-none"
        >
          <div className="glass p-8 md:p-10 rounded-3xl border border-primary/30 max-w-md w-full mx-auto space-y-6 text-center bg-gradient-to-b from-primary/10 to-background/5 shadow-glow">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-warning/10 border border-warning/20 text-[10px] font-bold text-warning animate-pulse">
                <Sparkles className="h-3 w-3" /> ÚLTIMA CHANCE!
              </span>
              <h2 className="text-xl font-bold font-display text-primary-glow">O tempo da sua oferta expirou!</h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Não queremos que você fique de fora. Gire a roleta abaixo para tentar resgatar uma nova oportunidade de desconto nos planos!
              </p>
            </div>
 
            {/* Canvas/SVG Roulette Wheel */}
            <div className="relative w-60 h-60 mx-auto flex items-center justify-center">
              {/* Outer light animation frame */}
              <div className="absolute inset-0 rounded-full border-4 border-primary/40 bg-background/5 shadow-glow pointer-events-none z-10" />
              
              {/* Spinning SVG circle */}
              <svg
                viewBox="0 0 200 200"
                className="w-full h-full rounded-full transition-transform duration-[4000ms] ease-out"
                style={{
                  transform: `rotate(-${wheelAngle}deg)`,
                  transitionTimingFunction: "cubic-bezier(0.2, 0.8, 0.2, 1)"
                }}
              >
                {/* Slice 1: 30% */}
                <g transform="rotate(0 100 100)">
                  <path d="M100,100 L100,0 A100,100 0 0,1 195.1,69.1 Z" fill="#2563eb" />
                  <text x="140" y="60" fill="#ffffff" fontWeight="bold" fontSize="11" transform="rotate(36 140 60)">30%</text>
                </g>
 
                {/* Slice 2: 20% */}
                <g transform="rotate(72 100 100)">
                  <path d="M100,100 L100,0 A100,100 0 0,1 195.1,69.1 Z" fill="#1d4ed8" />
                  <text x="140" y="60" fill="#ffffff" fontWeight="bold" fontSize="11" transform="rotate(36 140 60)">20%</text>
                </g>
 
                {/* Slice 3: 31% */}
                <g transform="rotate(144 100 100)">
                  <path d="M100,100 L100,0 A100,100 0 0,1 195.1,69.1 Z" fill="#3b82f6" />
                  <text x="140" y="60" fill="#ffffff" fontWeight="bold" fontSize="11" transform="rotate(36 140 60)">31%</text>
                </g>
 
                {/* Slice 4: 25% */}
                <g transform="rotate(216 100 100)">
                  <path d="M100,100 L100,0 A100,100 0 0,1 195.1,69.1 Z" fill="#1e40af" />
                  <text x="140" y="60" fill="#ffffff" fontWeight="bold" fontSize="11" transform="rotate(36 140 60)">25%</text>
                </g>
 
                {/* Slice 5: 33% */}
                <g transform="rotate(288 100 100)">
                  <path d="M100,100 L100,0 A100,100 0 0,1 195.1,69.1 Z" fill="#eab308" />
                  <text x="140" y="60" fill="#000000" fontWeight="bold" fontSize="11" transform="rotate(36 140 60)">33%</text>
                </g>
 
                {/* Center peg */}
                <circle cx="100" cy="100" r="16" fill="#ffffff" stroke="#2563eb" strokeWidth="3" />
                <circle cx="100" cy="100" r="7" fill="#2563eb" />
              </svg>
 
              {/* Indicator pointer pointing downwards at the top center */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 z-20">
                <svg viewBox="0 0 24 24" className="w-full h-full fill-warning drop-shadow-[0_2px_8px_rgba(234,179,8,0.7)]">
                  <path d="M12 21l-8-14h16z" />
                </svg>
              </div>
            </div>
 
            {spinningCompleted ? (
              <div className="space-y-4 animate-slide-down">
                <div className="p-3 rounded-2xl bg-success/15 border border-success/30 text-success text-center">
                  <p className="text-sm font-bold">🎉 Incrível! Você ganhou 33% de desconto!</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">O desconto extra foi aplicado automaticamente nos planos abaixo.</p>
                </div>
                <Button
                  onClick={() => setShowRouletteDialog(false)}
                  className="w-full h-11 rounded-xl font-bold gradient-primary text-primary-foreground shadow-glow cursor-pointer"
                >
                  Ver Planos com Desconto
                </Button>
              </div>
            ) : (
              <Button
                onClick={spinWheel}
                disabled={isSpinning}
                className="w-full h-11 rounded-xl font-bold gradient-primary text-primary-foreground shadow-glow cursor-pointer"
              >
                {isSpinning ? "Girando a roleta..." : "Girar Roleta"}
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
 
        {/* Plans grid */}
        <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`glass relative overflow-hidden flex flex-col justify-between transition-all duration-300 ${
                flashCards ? "flash-card" : ""
              } ${
                plan.id === "6_months"
                  ? "border-primary/50 shadow-glow scale-[1.01]"
                  : "border-border/40 hover:border-primary/20"
              }`}
            >
              <CardHeader className="pb-4 pt-6">
                {giftOfferActive && plan.id === "1_month" ? (
                  <div className="self-start inline-block mb-3 border text-[10px] font-bold px-2.5 py-0.5 rounded-full tracking-wider w-max bg-success/20 border-success/40 text-success">
                    🎁 GANHOU +30 DIAS BÔNUS (LEVE 2 MESES PELO PREÇO DE 1)
                  </div>
                ) : giftOfferActive && plan.id === "6_months" ? (
                  <div className="self-start inline-block mb-3 border text-[10px] font-bold px-2.5 py-0.5 rounded-full tracking-wider w-max bg-warning/20 border-warning/40 text-warning">
                    🏆 MAIOR ECONOMIA
                  </div>
                ) : plan.badge && (
                  <div className={`self-start inline-block mb-3 border text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider w-max ${
                    plan.id === "6_months"
                      ? "bg-warning/20 border-warning/40 text-warning"
                      : "bg-primary/10 border-primary/20 text-primary-glow"
                  }`}>
                    {plan.badge}
                  </div>
                )}
                <CardTitle className="text-xl flex items-center gap-1.5">
                  {plan.name}
                  {isGiftOpened && (
                    <Sparkles className="h-4 w-4 text-warning fill-warning" />
                  )}
                </CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
 
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  {giftOfferActive && plan.id === "1_month" ? (
                    <div className="flex flex-col">
                      <span className="text-[11px] text-muted-foreground line-through">
                        De R$ {plan.oldPrice.toFixed(2).replace(".", ",")}
                      </span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold font-display text-primary-glow">
                          R$ 9,95
                        </span>
                        <span className="text-sm font-medium text-muted-foreground">/mês</span>
                        <span className="inline-block text-[10px] font-bold text-success bg-success/15 border border-success/30 px-1.5 py-0.5 rounded">
                          {plan.discount}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground mt-1">
                        Total a pagar: R$ 19,90 (Cobrança única de 2 meses de acesso)
                      </span>
                    </div>
                  ) : giftOfferActive && plan.id === "6_months" ? (
                    <div className="flex flex-col">
                      <span className="text-[11px] text-muted-foreground line-through">
                        De R$ {plan.oldPrice.toFixed(2).replace(".", ",")}
                      </span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold font-display text-primary-glow">
                          R$ 4,98
                        </span>
                        <span className="text-sm font-medium text-muted-foreground">/mês</span>
                        <span className="inline-block text-[10px] font-bold text-success bg-success/15 border border-success/30 px-1.5 py-0.5 rounded">
                          {plan.discount}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground mt-1">
                        Total a pagar: R$ 29,90 (Cobrança única de 6 meses de acesso)
                      </span>
                    </div>
                  ) : isGiftOpened ? (
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
                  {!giftOfferActive && (
                    <span className="text-xs text-muted-foreground block mt-1">
                      {plan.priceLegend}
                    </span>
                  )}
                </div>
                <ul className="text-sm text-muted-foreground space-y-2 pt-2 border-t border-border/10">
                  {plan.bulletPoints.map((bp, index) => {
                    let text = bp;
                    if (giftOfferActive && plan.id === "1_month" && index === 0) {
                      text = "Acesso completo por 60 dias";
                    }
                    return (
                      <li key={index} className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                        {text}
                      </li>
                    );
                  })}
                </ul>
              </CardContent>
 
              <CardFooter className="pt-4">
                <Button
                  onClick={() => handleSelectPlan(plan.id, plan.price, plan.name)}
                  className="w-full h-11 rounded-xl font-bold cursor-pointer gradient-primary text-primary-foreground shadow-glow"
                >
                  {giftOfferActive && plan.id === "1_month" ? "Liberar Acesso 60 Dias" : plan.buttonText}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>



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
                    <div className="w-full h-full bg-slate-100 flex flex-col items-center justify-center text-[10px] text-destructive font-mono text-center px-2">
                      <CreditCard className="h-8 w-8 text-destructive mb-1" />
                      <span className="font-bold">QR Code não disponível</span>
                      <span className="text-[8px] mt-1 text-slate-500">Utilize a chave Copia e Cola abaixo para pagar.</span>
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
                <span className="text-xs text-muted-foreground">Aguardando confirmação de pagamento do Pix...</span>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
