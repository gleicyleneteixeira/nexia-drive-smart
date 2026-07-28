import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { isProfileExpired } from "@/lib/subscription";
import { 
  Sparkles, 
  Flame, 
  Zap, 
  TrafficCone, 
  Trophy, 
  Target, 
  Brain, 
  Library, 
  ArrowRight, 
  CheckCircle, 
  Star,
  Users,
  Award,
} from "lucide-react";

export const Route = createFileRoute("/")({
  component: LandingPage,
  head: () => ({
    meta: [
      { title: "Nexia DETRAN — Passe de Primeira na Prova Teórica e Psicotécnico" },
      {
        name: "description",
        content: "Simulador inteligente da prova teórica e psicotécnico do DETRAN. Macetes exclusivos, simulados dinâmicos e aprovação garantida.",
      },
    ],
  }),
});

function LandingPage() {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  // Redirect if already logged in based on status
  useEffect(() => {
    if (!loading && user && profile) {
      if (profile.status === "ativo" && !isProfileExpired(profile)) {
        navigate({ to: "/app", replace: true });
      } else if (profile.status === "pendente_pagamento" || isProfileExpired(profile)) {
        navigate({ to: "/checkout", replace: true });
      }
    }
  }, [user, profile, loading, navigate]);

  return (
    <div className="relative overflow-hidden min-h-screen">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[10%] w-[40vw] h-[40vw] rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute top-[20%] right-[10%] w-[35vw] h-[35vw] rounded-full bg-success/10 blur-[100px]" />
      </div>

      {/* Hero Section */}
      <section className="mx-auto max-w-5xl px-4 pt-16 pb-20 text-center relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary-glow">
            <Sparkles className="h-3 w-3" />
            Método Inteligente e Atualizado 2026
          </div>

          <h1 className="text-4xl md:text-6xl font-display font-bold leading-tight max-w-4xl mx-auto">
            Passe na <span className="gradient-text">Prova Teórica</span> e no <span className="gradient-text">Psicotécnico</span> do Detran de Primeira
          </h1>

          <p className="text-muted-foreground text-base md:text-xl max-w-2xl mx-auto font-sans leading-relaxed">
            Simulador inteligente atualizado com as questões reais do exame, jogos de fixação rápidos e vídeos explicativos com macetes exclusivos.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link
              to="/cadastro"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl gradient-primary text-primary-foreground font-bold shadow-glow hover:scale-[1.03] active:scale-98 transition-all duration-200"
            >
              CRIAR CONTA E ACESSAR AGORA
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              to="/auth"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl glass font-semibold hover:bg-accent/25 transition-all duration-200"
            >
              Já tenho uma conta
            </Link>
          </div>

          {/* Micro social proof under CTA */}
          <div className="pt-6 flex justify-center items-center gap-6 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4 text-success" />
              98.4% de Aprovação
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-4 w-4 text-primary-glow" />
              +3 mil Usuários
            </span>
          </div>
        </motion.div>
      </section>

      {/* Product Mockup Section */}
      <section className="max-w-5xl mx-auto px-4 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="glass rounded-3xl p-4 md:p-6 shadow-glow border border-primary/20 relative overflow-hidden"
        >
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          
          {/* Header Mockup */}
          <div className="flex items-center justify-between border-b border-border/30 pb-4 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-destructive/60" />
              <div className="w-3 h-3 rounded-full bg-warning/60" />
              <div className="w-3 h-3 rounded-full bg-success/60" />
            </div>
            <div className="px-4 py-1 rounded-lg bg-background/50 border border-border/20 text-xs text-muted-foreground font-mono">
              nexiadetran.com.br/app
            </div>
            <div className="w-12 h-2 rounded bg-muted-foreground/20" />
          </div>

          {/* Content Mockup Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <div className="p-6 rounded-2xl bg-background/40 border border-border/10 space-y-4">
                <div className="h-4 w-24 rounded bg-primary/20" />
                <div className="h-8 w-3/4 rounded bg-foreground/10" />
                <div className="h-4 w-1/2 rounded bg-muted-foreground/20" />
                <div className="flex gap-2 pt-2">
                  <div className="h-10 w-32 rounded-xl bg-primary/30" />
                  <div className="h-10 w-24 rounded-xl bg-secondary" />
                </div>
              </div>

              {/* Performance charts mock */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-background/40 border border-border/10 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-muted-foreground">Progresso Geral</span>
                    <h4 className="text-xl font-bold mt-1">76% Acertos</h4>
                  </div>
                  <div className="w-12 h-12 rounded-full border-4 border-primary border-r-transparent animate-pulse" />
                </div>
                <div className="p-4 rounded-2xl bg-background/40 border border-border/10 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-muted-foreground">Exame Simulado</span>
                    <h4 className="text-xl font-bold mt-1">30 Questões</h4>
                  </div>
                  <Sparkles className="h-8 w-8 text-warning" />
                </div>
              </div>
            </div>

            {/* Sidebar mock */}
            <div className="p-6 rounded-2xl bg-background/40 border border-border/10 space-y-4">
              <h4 className="text-sm font-bold text-primary-glow flex items-center gap-1.5">
                <Award className="h-4 w-4" />
                Pontos Fracos
              </h4>
              <div className="space-y-3">
                {[
                  { n: "Legislação", p: 85, c: "bg-success" },
                  { n: "Placas de Trânsito", p: 92, c: "bg-success" },
                  { n: "Primeiros Socorros", p: 58, c: "bg-destructive" },
                  { n: "Direção Defensiva", p: 71, c: "bg-warning" },
                ].map((item) => (
                  <div key={item.n} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>{item.n}</span>
                      <span className="text-muted-foreground">{item.p}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                      <div className={`h-full rounded-full ${item.c}`} style={{ width: `${item.p}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Feature Grid */}
      <section className="bg-card/30 border-y border-border/40 py-20 relative">
        <div className="max-w-5xl mx-auto px-4 space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-3">
            <h2 className="text-3xl font-display font-bold">O que você vai ter acesso</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Tudo o que é necessário para passar na prova teórica do DETRAN e perder o medo do psicotécnico.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            <FeatureCard 
              icon={Sparkles}
              title="Simulados Inteligentes"
              desc="Simulados atualizados no mesmo formato da prova oficial do DETRAN de todos os estados."
            />
            <FeatureCard 
              icon={Brain}
              title="Macetes do Psicotécnico"
              desc="Vídeos explicativos e dicas dos testes psicotécnicos mais comuns como palográfico e atenção."
            />
            <FeatureCard 
              icon={TrafficCone}
              title="Memorização de Placas"
              desc="Treinamento rápido com game de placas para acertar todas as questões de sinalização."
            />
            <FeatureCard 
              icon={Zap}
              title="Revisão Turbo"
              desc="Modo rápido de revisão com perguntas e respostas diretas para fixar na memória."
            />
            <FeatureCard 
              icon={Library}
              title="Biblioteca CNH"
              desc="Resumos em PDF, apostilas atualizadas e o manual oficial de direção defensiva para baixar."
            />
            <FeatureCard 
              icon={Trophy}
              title="Ranking e Medalhas"
              desc="Monitore seu progresso e ganhe conquistas à medida que melhora sua taxa de acerto."
            />
          </div>
        </div>
      </section>

      {/* Social Proof & Testimonials (Infinite Marquee Stories/Reels) */}
      <section className="py-24 space-y-12 overflow-hidden relative">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-3">
          <h2 className="text-3xl md:text-4xl font-display font-bold">Quem usou, passou de primeira 🚀</h2>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-xl mx-auto">
            Mais de 97% de aprovação. Veja o que nossos alunos dizem sobre o método.
          </p>
        </div>

        {/* Continuous conveyor belt marquee */}
        <div className="relative flex overflow-x-hidden w-full select-none py-4 border-y border-border/10 bg-card/25 backdrop-blur-sm">
          {/* Faders to blend edges smoothly */}
          <div className="absolute top-0 left-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute top-0 right-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

          <div className="animate-marquee flex gap-6 px-3">
            {TESTIMONIALS.map((item) => (
              <div
                key={item.id + "-1"}
                className="w-72 shrink-0 rounded-2xl overflow-hidden glass relative group border border-border/20 hover:border-primary/40 transition-all hover:scale-[1.02] text-left flex flex-col justify-between p-5 shadow-card"
              >
                {/* Background blur cover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-10 group-hover:opacity-20 transition-opacity`} />
                
                {/* Header info */}
                <div className="relative z-10 flex items-center justify-end w-full">
                  <div className="flex text-warning">
                    {Array.from({ length: item.stars }).map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-warning" />
                    ))}
                  </div>
                </div>

                {/* Comment */}
                <div className="relative z-10 my-4">
                  <p className="text-sm font-medium text-foreground line-clamp-4 italic leading-relaxed">
                    "{item.comment}"
                  </p>
                </div>

                {/* Student details */}
                <div className="relative z-10 flex items-center gap-2 pt-3 border-t border-border/10">
                  <div className={`w-8 h-8 shrink-0 rounded-full bg-gradient-to-br ${item.gradient} flex items-center justify-center font-bold text-xs text-white`}>
                    {item.avatar}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-semibold text-xs truncate">{item.name}</h4>
                    <span className="text-[10px] text-muted-foreground block truncate">{item.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Duplicated list for seamless looping */}
          <div className="animate-marquee flex gap-6 px-3" aria-hidden="true">
            {TESTIMONIALS.map((item) => (
              <div
                key={item.id + "-2"}
                className="w-72 shrink-0 rounded-2xl overflow-hidden glass relative group border border-border/20 hover:border-primary/40 transition-all hover:scale-[1.02] text-left flex flex-col justify-between p-5 shadow-card"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-10 group-hover:opacity-20 transition-opacity`} />
                
                <div className="relative z-10 flex items-center justify-end w-full">
                  <div className="flex text-warning">
                    {Array.from({ length: item.stars }).map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-warning" />
                    ))}
                  </div>
                </div>

                <div className="relative z-10 my-4">
                  <p className="text-sm font-medium text-foreground line-clamp-4 italic leading-relaxed">
                    "{item.comment}"
                  </p>
                </div>

                <div className="relative z-10 flex items-center gap-2 pt-3 border-t border-border/10">
                  <div className={`w-8 h-8 shrink-0 rounded-full bg-gradient-to-br ${item.gradient} flex items-center justify-center font-bold text-xs text-white`}>
                    {item.avatar}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-semibold text-xs truncate">{item.name}</h4>
                    <span className="text-[10px] text-muted-foreground block truncate">{item.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="max-w-4xl mx-auto px-4 pb-24 text-center">
        <div className="glass rounded-3xl p-8 md:p-12 shadow-glow border border-primary/25 space-y-6 relative overflow-hidden">
          <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-primary/10 blur-[80px]" />
          
          <h2 className="text-3xl md:text-4xl font-display font-bold">Garanta sua aprovação hoje</h2>
          <p className="text-muted-foreground text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            Não corra o risco de reprovar e pagar taxas extras de remarcação que passam de R$ 200. Cadastre-se e libere seu acesso agora mesmo!
          </p>
          <div className="pt-2">
            <Link
              to="/cadastro"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl gradient-primary text-primary-foreground font-bold shadow-glow hover:scale-[1.03] active:scale-98 transition-transform"
            >
              Criar Conta e Acessar
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc }: { icon: any; title: string; desc: string }) {
  return (
    <div className="glass rounded-2xl p-6 border border-border/10 space-y-3 hover:border-primary/30 transition-all duration-300">
      <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center text-primary-glow">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
    </div>
  );
}

const TESTIMONIALS = [
  {
    id: "glei",
    name: "Gleicilene Teixeira",
    role: "Aprovada DETRAN-MG",
    comment: "Estudei só 5 dias! Os vídeos explicativos e os simulados salvaram minha aprovação.",
    gradient: "from-purple-600 to-indigo-600",
    avatar: "GT",
    stars: 5,
  },
  {
    id: "marcos",
    name: "Marcos Vinícius",
    role: "Aprovado DETRAN-SP",
    comment: "O game de memorização de placas é sensacional. Acertei tudo de sinalização!",
    gradient: "from-blue-600 to-cyan-600",
    avatar: "MV",
    stars: 5,
  },
  {
    id: "mari",
    name: "Mariana Souza",
    role: "Aprovada DETRAN-RJ",
    comment: "Aprovada com 27/30! Eu tinha muito medo do psicotécnico. Os macetes e vídeos de dicas me deram muita calma.",
    gradient: "from-pink-600 to-rose-600",
    avatar: "MS",
    stars: 5,
  },
  {
    id: "roberto",
    name: "Roberto Costa",
    role: "Aprovado DETRAN-BA",
    comment: "Aprovado com 28/30! Simulador super direto ao ponto. Estudei pelo celular indo para o trabalho e deu certo!",
    gradient: "from-amber-600 to-orange-600",
    avatar: "RC",
    stars: 5,
  },
  {
    id: "aline",
    name: "Aline Barbosa",
    role: "Aprovada DETRAN-PR",
    comment: "Aprovada com 30/30! Gabaritei a prova teórica! A revisão turbo me ajudou a fixar os pontos mais importantes.",
    gradient: "from-emerald-600 to-teal-600",
    avatar: "AB",
    stars: 5,
  },
  {
    id: "lucas",
    name: "Lucas Mendes",
    role: "Aprovado DETRAN-RS",
    comment: "Aprovado com 29/30! As dicas do teste de atenção concentrada caíram como uma luva. Recomendo de olhos fechados.",
    gradient: "from-indigo-600 to-blue-600",
    avatar: "LM",
    stars: 5,
  },
  {
    id: "patricia",
    name: "Patricia Lima",
    role: "Aprovada DETRAN-CE",
    comment: "Muito prático! O visual limpo e os vídeos de dicas ajudam muito quem tem o dia corrido.",
    gradient: "from-red-600 to-pink-600",
    avatar: "PL",
    stars: 5,
  },
  {
    id: "felipe",
    name: "Felipe Ramos",
    role: "Aprovado DETRAN-PE",
    comment: "Aprovado com 27/30! Gostei muito dos simulados cronometrados. No dia da prova eu já estava acostumado com o tempo.",
    gradient: "from-violet-600 to-fuchsia-600",
    avatar: "FR",
    stars: 5,
  }
];
