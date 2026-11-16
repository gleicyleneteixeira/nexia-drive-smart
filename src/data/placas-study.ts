import type { PlacaId } from "@/components/Placa";

// ==========================================
// ESTUDO (significados escritos para placas-chave)
// ==========================================

export interface PlacaStudyItem {
  id: PlacaId;
  title: string;
  type: "regulamentacao" | "advertencia" | "indicacao";
  meaning: string;
  tip: string;
  legalBase?: string;
}

export const PLACA_STUDY_DATA: PlacaStudyItem[] = [
  {
    id: "R-1",
    title: "R-1 — Parada Obrigatória",
    type: "regulamentacao",
    meaning: "Informa ao condutor que a parada do veículo é obrigatória antes de entrar ou cruzar a via transversal.",
    tip: "A parada deve ser COMPLETA (rodas totalmente paradas), e não apenas uma redução lenta de velocidade. Desrespeitar é infração gravíssima.",
    legalBase: "Art. 208 do CTB",
  },
  {
    id: "R-2",
    title: "R-2 — Dê a Preferência",
    type: "regulamentacao",
    meaning: "Indica ao condutor a obrigatoriedade de dar preferência de passagem ao veículo que circula pela via transversal.",
    tip: "Não exige a parada obrigatória se a via estiver livre, mas exige que você reduza a velocidade e pare se houver tráfego vindo.",
    legalBase: "Anexo II do CTB",
  },
  {
    id: "R-6a",
    title: "R-6a — Proibido Estacionar",
    type: "regulamentacao",
    meaning: "Assinala ao condutor a proibição de estacionar o veículo no trecho abrangido pela sinalização.",
    tip: "Permite a PARADA rápida apenas pelo tempo estritamente necessário para embarque ou desembarque de passageiros, sem interromper o fluxo.",
    legalBase: "Art. 181 do CTB",
  },
  {
    id: "R-6b",
    title: "R-6b — Proibido Parar e Estacionar",
    type: "regulamentacao",
    meaning: "Informa ao condutor que é proibida tanto a parada rápida quanto o estacionamento de veículos no trecho.",
    tip: "Pegadinha comum: aqui você não pode parar nem para um desembarque de 3 segundos! A proibição é absoluta.",
    legalBase: "Art. 181, VIII do CTB",
  },
  {
    id: "R-19",
    title: "R-19 — Velocidade Máxima Regulamentada",
    type: "regulamentacao",
    meaning: "Estabelece o limite máximo de velocidade em km/h permitido para a via.",
    tip: "O limite é válido a partir do ponto onde a placa está instalada até que haja outra placa de limite ou fim da regulamentação.",
    legalBase: "Art. 218 do CTB",
  },
  {
    id: "R-25a",
    title: "R-25a — Vire à Esquerda",
    type: "regulamentacao",
    meaning: "Regulamenta a obrigatoriedade de o condutor realizar a conversão à esquerda na interseção.",
    tip: "Garante que o sentido de fluxo da via transversal requer obrigatoriamente a conversão à esquerda por motivos de segurança.",
    legalBase: "Anexo II do CTB",
  },
  {
    id: "R-25d",
    title: "R-25d — Siga em Frente",
    type: "regulamentacao",
    meaning: "Assinala ao condutor que o único sentido de direção permitido é seguir em linha reta na interseção.",
    tip: "Diferente de vias de mão única, esta placa obriga você a continuar em frente na próxima bifurcação ou cruzamento.",
    legalBase: "Anexo II do CTB",
  },
  {
    id: "A-1a",
    title: "A-1a — Curva Acentuada à Esquerda",
    type: "advertencia",
    meaning: "Adverte o condutor sobre a proximidade de uma curva acentuada e perigosa para a esquerda à frente.",
    tip: "Reduza a velocidade na aproximação, antes da curva, para manter o centro de gravidade estável e evitar derrapagens.",
    legalBase: "Manual de Sinalização do CONTRAN",
  },
  {
    id: "A-2b",
    title: "A-2b — Curva à Direita",
    type: "advertencia",
    meaning: "Alerta o condutor sobre a existência de uma curva para a direita à frente na via.",
    tip: "Possui raio de curvatura maior que o da curva acentuada, mas ainda requer atenção e adequação de velocidade segura.",
    legalBase: "Manual de Sinalização do CONTRAN",
  },
  {
    id: "A-13a",
    title: "A-13a — Confluência à Esquerda",
    type: "advertencia",
    meaning: "Adverte o condutor sobre a junção de outra via à esquerda, onde há entrada de novos fluxos de tráfego.",
    tip: "Atenção ao retrovisor esquerdo e reduza a velocidade para facilitar a integração segura de outros veículos à sua pista.",
    legalBase: "Manual de Sinalização do CONTRAN",
  },
  {
    id: "A-32b",
    title: "A-32b — Passagem Sinalizada de Pedestres",
    type: "advertencia",
    meaning: "Alerta sobre a existência de faixa de travessia sinalizada para pedestres logo à frente.",
    tip: "Reduza a velocidade. Lembre-se: o pedestre que iniciou a travessia na faixa tem prioridade absoluta de passagem sobre o veículo.",
    legalBase: "Art. 70 do CTB",
  },
  {
    id: "A-33a",
    title: "A-33a — Área Escolar",
    type: "advertencia",
    meaning: "Adverte o condutor sobre a proximidade de trecho com trânsito frequente de escolares e crianças.",
    tip: "Redobre o cuidado, reduza a velocidade significativamente e prepare o pé no freio para imobilização de emergência.",
    legalBase: "Art. 220, XIV do CTB",
  },
  {
    id: "I-Hospital",
    title: "S-1 — Serviço de Hospital",
    type: "indicacao",
    meaning: "Indica a localização ou direção para acesso a serviços hospitalares de saúde e pronto-socorro.",
    tip: "Ao passar próximo a hospitais, evite o uso de buzinas e mantenha o ruído do motor sob controle para o conforto dos pacientes.",
    legalBase: "Art. 227 do CTB",
  },
  {
    id: "I-Posto",
    title: "S-13 — Posto de Abastecimento",
    type: "indicacao",
    meaning: "Indica a proximidade ou acesso de postos de combustível para abastecimento do veículo.",
    tip: "Muito útil para planejar viagens longas e evitar a infração de pane seca por falta de combustível na estrada.",
    legalBase: "Manual de Sinalização de Indicação",
  },
];
