import type { PlacaId } from "@/components/Placa";
import { supabase } from "@/integrations/supabase/client";

export type Incidence = "altissima" | "alta" | "media" | "baixa";
export type Category =
  | "legislacao"
  | "placas"
  | "direcao-defensiva"
  | "primeiros-socorros"
  | "infracoes"
  | "meio-ambiente"
  | "mecanica"
  | "prioridade";

export interface Question {
  id: string;
  category: Category;
  statement: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  detailedExplanation?: string; // texto longo para fixação e revisão
  legalBase?: string; // ex: "Art. 218 do CTB"
  commonMistake?: string; // qual pegadinha as bancas usam
  tip?: string;
  memoryHook?: string; // gancho mnemônico para memorização (frase-chave, rima, sigla, imagem mental)
  incidence: Incidence;
  trap?: boolean; // pegadinha clássica
  difficulty: 1 | 2 | 3;
  placa?: PlacaId; // placa visual oficial para questões de identificação
}

export const CATEGORY_LABELS: Record<Category, string> = {
  legislacao: "Legislação",
  placas: "Placas",
  "direcao-defensiva": "Direção Defensiva",
  "primeiros-socorros": "Primeiros Socorros",
  infracoes: "Infrações",
  "meio-ambiente": "Meio Ambiente",
  mecanica: "Mecânica Básica",
  prioridade: "Prioridade de Passagem",
};

export const INCIDENCE_META: Record<
  Incidence,
  { label: string; emoji: string; className: string; weight: number }
> = {
  altissima: {
    label: "Altíssima incidência",
    emoji: "🔴",
    className: "bg-destructive/15 text-destructive border-destructive/30",
    weight: 8,
  },
  alta: {
    label: "Cai muito",
    emoji: "🟠",
    className: "bg-warning/15 text-warning border-warning/30",
    weight: 5,
  },
  media: {
    label: "Importante",
    emoji: "🟡",
    className: "bg-warning/10 text-warning border-warning/20",
    weight: 3,
  },
  baixa: {
    label: "Revisão rápida",
    emoji: "🟢",
    className: "bg-success/15 text-success border-success/30",
    weight: 1,
  },
};

export const QUESTIONS: Question[] = [
  {
    id: "q1",
    category: "legislacao",
    statement:
      "Um cidadão aprovado em todos os exames do processo de habilitação recebe a Permissão para Dirigir (PPD) na categoria B. De acordo com as normas de trânsito vigentes no CTB, essa categoria de habilitação concede a ele o direito de conduzir exclusivamente:",
    options: [
      "Veículos motorizados cujo Peso Bruto Total (PBT) não exceda a 3.500 kg e cuja lotação não exceda a 8 passageiros, excluído o motorista.",
      "Veículos motorizados destinado ao transporte de passageiros com lotação máxima de 8 pessoas, incluindo obrigatoriamente o motorista.",
      "Veículos motorizados com ou sem reboque acoplado, desde que o peso do reboque não ultrapasse 1.000 kg e a lotação seja inferior a 8 lugares.",
      "Veículos de carga de qualquer espécie, desde que não ultrapassem o limite de capacidade máxima de tração de 3,5 toneladas.",
    ],
    correctIndex: 0,
    explanation:
      "A Categoria B autoriza veículos de até 3.500 kg de PBT e lotação de até 8 passageiros (excluído o condutor).",
    detailedExplanation:
      "A categoria B é a mais comum e habilita a dirigir automóveis de passeio, utilitários, camionetas, caminhonetes e furgões — desde que o peso bruto total (PBT) não ultrapasse 3.500 kg e a lotação seja de no máximo 8 passageiros, sem contar o motorista (regra do 8 + 1). Motocicletas exigem categoria A. Veículos acima de 3.500 kg exigem categoria C. Mais de 8 passageiros exige D. Veículos articulados ou com reboque pesado exigem E.",
    legalBase: "Art. 143 do CTB",
    commonMistake:
      "A banca costuma trocar '8 passageiros além do motorista' por '8 passageiros no total' — fique atento: são 8 + 1.",
    tip: "Decore: B = até 3.500 kg e 8 + 1.",
    incidence: "altissima",
    difficulty: 3,
  },
  {
    id: "q2",
    category: "placas",
    statement:
      "As sinalizações verticais exercem papel fundamental na regulamentação das vias públicas brasileiras. No que tange especificamente às placas de regulamentação, assinale a alternativa que define corretamente sua principal finalidade técnica, formato padrão predominante e cores obrigatórias:",
    options: [
      "Advertir sobre perigos potenciais na via, possuindo formato de losango e cores amarela e preta.",
      "Impor obrigações, limitações, proibições ou restrições de uso da via, possuindo formato circular com orla vermelha, fundo branco e símbolo preto.",
      "Indicar direções, distâncias e serviços auxiliares aos usuários da via, possuindo formato retangular e cores azul e branca.",
      "Orientar fluxos turísticos e áreas de preservação ambiental, possuindo formato retangular e cores marrom e branca.",
    ],
    correctIndex: 1,
    explanation:
      "Placas de regulamentação são circulares, vermelhas, brancas e pretas, e impõem proibições ou obrigações.",
    detailedExplanation:
      "As placas de regulamentação (série R) são CIRCULARES, com fundo branco, orla e tarja vermelhas e símbolo preto. Comunicam ordens e proibições — desobedecer é infração de trânsito. Exceções de formato: a placa PARE (R-1) é OCTOGONAL e a 'Dê a preferência' (R-2) é um TRIÂNGULO INVERTIDO. Mesmo com formato diferente, ambas pertencem ao grupo de regulamentação.",
    commonMistake:
      "Muitos candidatos confundem com as de advertência (losango amarelo). Regra de ouro: vermelho = obrigação; amarelo = aviso.",
    tip: "Vermelho = você é OBRIGADO a obedecer.",
    incidence: "altissima",
    difficulty: 3,
  },
  {
    id: "q3",
    category: "direcao-defensiva",
    statement:
      "Ao transitar por uma via urbana de pista dupla e tráfego rápido, o condutor visualiza um pedestre iniciando a travessia fora da faixa de segurança. Sob a perspectiva da Direção Defensiva e dos preceitos legais de preferência previstos no CTB, qual deve ser a conduta prioritária imediata do motorista?",
    options: [
      "Manter a velocidade regular e acionar buzina de forma contínua para alertar o pedestre de sua imprudência.",
      "Efetuar aceleração preventiva para desobstruir a via antes que o pedestre interponha-se na trajetória do veículo.",
      "Reduzir a velocidade de maneira segura, sinalizar aos demais veículos e conceder a preferência de passagem ao pedestre.",
      "Desviar bruscamente para a faixa adjacente sem alterar a velocidade do fluxo de veículos.",
    ],
    correctIndex: 2,
    explanation:
      "O pedestre tem prioridade absoluta em vias terrestres e sua proteção é dever imposto aos veículos maiores pelo CTB.",
    detailedExplanation:
      "O CTB classifica o pedestre como o usuário mais vulnerável da via e atribui a ele preferência absoluta, ainda que esteja em local proibido. O condutor deve reduzir a velocidade, parar se necessário e só prosseguir quando a travessia terminar. A responsabilidade pela preservação da vida é sempre do condutor — o erro do pedestre não autoriza o motorista a atropelá-lo.",
    legalBase: "Art. 29, §2º do CTB",
    commonMistake:
      "Pegadinha clássica: a banca sugere que, por estar fora da faixa, o pedestre 'perde' a preferência. ERRADO — ele continua tendo prioridade.",
    incidence: "alta",
    trap: true,
    difficulty: 3,
  },
  {
    id: "qe01",
    category: "legislacao",
    statement:
      "Um jovem candidato de 18 anos deseja iniciar o procedimento formal para a obtenção de sua primeira Carteira Nacional de Habilitação (CNH). De acordo com as diretrizes do CTB e resoluções do CONTRAN, o ato de cadastramento inicial e abertura do Registro Nacional de Carteiras de Habilitação (RENACH) deve ocorrer obrigatoriamente no:",
    options: [
      "Órgão executivo de trânsito do Estado ou do Distrito Federal (DETRAN) correspondente ao domicílio ou residência do candidato.",
      "Conselho Nacional de Trânsito (CONTRAN), por se tratar do órgão máximo normativo e consultivo do SNT.",
      "Centro de Formação de Condutores (CFC) credenciado, que possui autonomia jurídica delegada para expedição de registro.",
      "Ministério dos Transportes, através da Secretaria Nacional de Trânsito (SENATRAN), de forma unificada nacionalmente.",
    ],
    correctIndex: 0,
    explanation:
      "A abertura do RENACH é competência do órgão executivo estadual (DETRAN) da residência do candidato.",
    detailedExplanation:
      "O RENACH (Registro Nacional de Carteiras de Habilitação) é o banco de dados nacional que unifica os registros de condutores. O processo de habilitação começa no DETRAN do estado onde o candidato reside, pois cada DETRAN é o órgão executivo de trânsito estadual responsável por emitir a CNH. Iniciar em outro estado ou órgão não seria válido, já que o RENACH é alimentado localmente e integrado ao sistema nacional. Tentar abrir em local diferente pode gerar inconsistências no prontuário e atrasar o processo.",
    legalBase: "Res. CONTRAN 168/2004",
    incidence: "alta",
    difficulty: 3,
  },
  {
    id: "qe02",
    category: "legislacao",
    statement:
      "A Permissão para Dirigir (PPD) é o documento que atesta a aprovação do candidato nos exames teóricos e práticos de direção veicular. Sob a ótica do Código de Trânsito Brasileiro (CTB), qual é o período de vigência probatória desse documento que antecede a CNH definitiva?",
    options: [
      "Doze meses, contados a partir da data de sua efetiva expedição física ou digital.",
      "Seis meses, prorrogáveis caso o condutor não seja reincidente em infrações leves.",
      "Dois anos, idêntico ao prazo de validade padrão das avaliações psicológicas especiais.",
      "Cinco anos, correspondente ao período máximo de carência dos exames de aptidão física.",
    ],
    correctIndex: 0,
    explanation: "A PPD tem validade de um ano (doze meses) como período de avaliação probatória.",
    detailedExplanation:
      "A Permissão para Dirigir (PPD) é a primeira fase da habilitação, com validade de 1 ano. Durante esse período, o condutor é avaliado na prática: se cometer infração grave, gravíssima ou for reincidente em infração média, a CNH definitiva não é emitida e o processo recomeça do zero. Esse período probatório existe para garantir que o condutor novato desenvolva responsabilidade no trânsito antes de obter o documento definitivo.",
    legalBase: "Art. 148, §3º CTB",
    incidence: "altissima",
    difficulty: 3,
  },
  {
    id: "qe03",
    category: "legislacao",
    statement:
      "Um motorista profissional acumula diversas pontuações em seu prontuário no intervalo de doze meses, sem cometer nenhuma infração gravíssima. De acordo com as alterações inseridas no CTB pela Lei 14.071/2020, o limite máximo de pontos para que seja instaurado o processo de suspensão de seu direito de dirigir é de:",
    options: [
      "40 pontos, desde que não conste nenhuma infração gravíssima no período de doze meses.",
      "30 pontos, na hipótese de constar apenas uma infração de natureza grave e nenhuma gravíssima no período.",
      "20 pontos, limite aplicável independentemente da natureza ou gravidade das infrações acumuladas.",
      "14 pontos, caso o condutor exerça atividade remunerada e seja reincidente em infrações médias.",
    ],
    correctIndex: 0,
    explanation:
      "Sem infrações gravíssimas, a suspensão do direito de dirigir ocorre quando o condutor atinge o limite de 40 pontos.",
    detailedExplanation:
      "A Lei 14.071/2021 alterou o sistema de pontuação para suspensão da CNH. Atualmente, o limite varia conforme a gravidade das infrações cometidas: se não houver nenhuma infração gravíssima no período, o limite é de 40 pontos; com uma gravíssima, cai para 30 pontos; com duas ou mais gravíssimas, o limite é de 20 pontos. A regra anterior dos '20 pontos fixos' não vale mais desde 2021 — por isso é importante atualizar os estudos com a nova lei.",
    legalBase: "Art. 261 CTB",
    commonMistake: "A regra mudou: não é mais 20 pontos fixos.",
    incidence: "altissima",
    trap: true,
    difficulty: 3,
  },
  {
    id: "qe04",
    category: "legislacao",
    statement:
      "Um taxista que possui a observação de exercício de atividade remunerada (EAR) em sua habilitação acumula pontos por infrações leves e médias no período de doze meses. Pelas regras específicas do CTB para condutores EAR, o limite de pontos aplicável para a suspensão do direito de dirigir é:",
    options: [
      "40 pontos fixos, independentemente da natureza ou gravidade das infrações cometidas no período.",
      "20 pontos, sofrendo redução imediata caso cometa qualquer infração de trânsito de natureza média.",
      "30 pontos, caso conste uma infração grave ou gravíssima em seu prontuário veicular.",
      "25 pontos, mediante abertura de processo de reciclagem obrigatório quando atingir 20 pontos.",
    ],
    correctIndex: 0,
    explanation:
      "Para condutores com EAR (atividade remunerada), o limite é sempre de 40 pontos, independentemente da gravidade das infrações.",
    detailedExplanation:
      "Antes da Lei 14.071/2021, condutores que exercem atividade remunerada (EAR) — como motoristas de táxi, aplicativo, ônibus e caminhão — tinham um limite de pontos diferenciado. Hoje, o limite de pontos para EAR é o mesmo dos demais condutores (até 40 pontos sem gravíssimas). A diferença está na obrigatoriedade do exame toxicológico periódico para EAR, que não se aplica a condutores comuns das categorias A e B.",
    incidence: "alta",
    difficulty: 3,
  },
  {
    id: "qe05",
    category: "legislacao",
    statement:
      "Durante fiscalização de trânsito rotineira realizada pela Polícia Rodoviária Federal, o condutor é solicitado a apresentar os documentos obrigatórios. De acordo com a legislação e resoluções do CONTRAN, constitui documento de porte obrigatório pelo condutor do veículo:",
    options: [
      "A CNH (física ou digital) e o Certificado de Licenciamento Anual (CLA/CRLV-e), cuja apresentação em formato digital é válida por lei.",
      "O Certificado de Registro de Veículo (CRV) e o comprovante de pagamento do Imposto sobre a Propriedade de Veículos Automotores (IPVA).",
      "O documento de identidade civil (RG) e a carteira de vacinação obrigatória do condutor.",
      "Apenas o comprovante de aprovação nos exames de aptidão física e mental do corrente ano.",
    ],
    correctIndex: 0,
    explanation:
      "A CNH (ou PPD) e o CLA/CRLV-e são os documentos obrigatórios de porte, dispensados se o agente puder consultar o sistema.",
    detailedExplanation:
      "Para circular legalmente, o condutor precisa portar dois documentos: a CNH (Carteira Nacional de Habilitação, que comprova sua aptidão para dirigir) e o CRLV (Certificado de Registro e Licenciamento do Veículo, que comprova que o veículo está regular). Ambos podem ser apresentados na versão digital (CDT e CRLV-e) através do aplicativo oficial, com o mesmo valor legal do documento impresso. Estar sem um deles resulta em infração e remoção do veículo.",
    legalBase: "Art. 159 CTB",
    incidence: "alta",
    difficulty: 3,
  },
  {
    id: "qe06",
    category: "legislacao",
    statement:
      "Um condutor obteve aprovação exclusiva para a categoria de habilitação 'A'. De acordo com as definições de categorias contidas no Art. 143 do CTB, esse documento autoriza a condução de quais tipos de veículos nas vias públicas?",
    options: [
      "Veículos motorizados de duas ou três rodas, com ou sem carro lateral (sidecar).",
      "Veículos de transporte coletivo de passageiros cuja lotação não exceda a 8 lugares.",
      "Qualquer espécie de veículo motorizado cujo peso bruto total não ultrapasse 3.500 kg.",
      "Veículos motorizados de duas rodas com potência limitada a no máximo 50 cilindradas.",
    ],
    correctIndex: 0,
    explanation:
      "A categoria 'A' destina-se a veículos motorizados de 2 ou 3 rodas (motos, triciclos), com ou sem sidecar.",
    detailedExplanation:
      "O CTB divide as categorias de habilitação por tipo de veículo. A categoria A é destinada exclusivamente a veículos de duas ou três rodas: motocicletas, motonetas, ciclomotores e triciclos. Carros de passeio exigem categoria B, caminhões exigem C, veículos com mais de 8 passageiros exigem D, e combinações de veículos com reboque pesado exigem E. Cada categoria tem requisitos de idade e tempo de habilitação específicos.",
    legalBase: "Art. 143 CTB",
    incidence: "alta",
    difficulty: 3,
  },
  {
    id: "qe07",
    category: "legislacao",
    statement:
      "Um indivíduo é flagrado por agentes de trânsito conduzindo um veículo automotor sem nunca ter sido habilitado ou possuir qualquer permissão. Sob a perspectiva administrativa e punitiva do Código de Trânsito Brasileiro, essa conduta configura infração de natureza:",
    options: [
      "Gravíssima, punida com multa multiplicada por três vezes e retenção do veículo até a apresentação de condutor habilitado.",
      "Grave, gerando apreensão automática e leilão imediato do veículo em 30 dias.",
      "Média, punida apenas com advertência pedagógica por escrito se o veículo estiver licenciado.",
      "Crime de trânsito incondicionado com detenção imediata de seis meses a um ano.",
    ],
    correctIndex: 0,
    explanation:
      "Dirigir sem habilitação é infração gravíssima com fator multiplicador 3 e medida administrativa de retenção do veículo.",
    detailedExplanation:
      "Dirigir sem possuir CNH ou Permissão para Dirigir é uma das infrações mais graves do CTB, classificada como GRAVÍSSIMA, com multa multiplicada por 3 e retenção do veículo até a apresentação de um condutor habilitado. A lógica é simples: se a pessoa não foi aprovada nos exames teórico e prático, ela não tem comprovação de que sabe dirigir com segurança, colocando em risco a própria vida e a dos outros.",
    legalBase: "Art. 162, I CTB",
    incidence: "altissima",
    difficulty: 3,
  },
  {
    id: "qe08",
    category: "legislacao",
    statement:
      "O Código de Trânsito Brasileiro prevê a aplicação de penalidades administrativas aos condutores infratores. Dentre elas, a submissão obrigatória a curso de reciclagem será imposta ao condutor quando:",
    options: [
      "Tiver seu direito de dirigir suspenso, se envolver em acidente grave para o qual haja contribuído ou for condenado judicialmente por delito de trânsito.",
      "Cometer qualquer infração de natureza média ou leve no período probatório da PPD.",
      "Estacionar o veículo em vaga regulamentada de idoso sem a devida credencial de identificação.",
      "Ultrapassar em local proibido sinalizado por linha dupla amarela contínua.",
    ],
    correctIndex: 0,
    explanation:
      "O curso de reciclagem é imposto nos casos de suspensão do direito de dirigir, envolvimento em acidente grave ou condenação judicial por crime de trânsito.",
    detailedExplanation:
      "O curso de reciclagem é uma medida educativa obrigatória para quem teve o direito de dirigir suspenso ou cassado. O objetivo é reeducar o condutor, atualizando seus conhecimentos sobre legislação, direção defensiva, primeiros socorros e meio ambiente. O curso tem carga horária definida pelo CONTRAN e, ao final, o condutor precisa ser aprovado em avaliação para reaver a CNH. Não se trata de punição, mas de oportunidade de aprendizado e correção de comportamento.",
    legalBase: "Art. 268 CTB",
    incidence: "alta",
    difficulty: 3,
  },
  {
    id: "qe09",
    category: "legislacao",
    statement:
      "Um condutor habilitado na categoria 'B' há mais de um ano deseja alterar sua habilitação para a categoria 'C' para conduzir veículos de carga. Conforme os requisitos específicos previstos no Art. 143 do CTB, para realizar essa mudança, ele não pode ter cometido no último ano:",
    options: [
      "Mais de uma infração de trânsito de natureza gravíssima em seu prontuário.",
      "Mais do que uma infração média e nenhuma infração grave no prontuário.",
      "Qualquer infração grave ou gravíssima, ou ser reincidente em infrações médias.",
      "Nenhuma infração leve ou média que resulte em pontuação no prontuário do condutor.",
    ],
    correctIndex: 0,
    explanation:
      "Para mudar de B para C, o condutor deve estar habilitado há pelo menos 1 ano na categoria B e não ter cometido mais de uma infração gravíssima nos últimos 12 meses.",
    detailedExplanation:
      "Com as alterações trazidas pela Lei 14.071/2020, as exigências para mudança de categoria (C, D e E) foram flexibilizadas. Atualmente, o condutor não pode ter cometido mais de uma infração gravíssima nos últimos 12 meses (ou seja, é permitido ter no máximo uma). As restrições antigas sobre infrações graves ou reincidência em médias foram revogadas para esse processo.",
    legalBase: "Art. 143, §1º do CTB",
    commonMistake:
      "Achar que ainda vigora a regra antiga que proibia qualquer infração grave/gravíssima ou reincidência em média. A nova lei permite até uma gravíssima e não restringe graves ou médias para a mudança de categoria.",
    tip: "Mudança de categoria = até 1 gravíssima permitida nos últimos 12 meses.",
    incidence: "media",
    difficulty: 3,
  },
  {
    id: "qe10",
    category: "legislacao",
    statement:
      "O direito de iniciar o processo de habilitação para condução de veículos automotores e elétricos é assegurado pelo ordenamento jurídico nacional. Sob o ponto de vista penal e civil, o requisito essencial de idade mínima exigido baseia-se na condição de o candidato ser:",
    options: [
      "Penalmente imputável (maior de 18 anos), de forma a responder civil e penalmente pelos seus atos.",
      "Maior de 16 anos emancipado, com autorização expressa em cartório público pelos genitores.",
      "Eleitor regularmente alistado perante a Justiça Eleitoral, possuindo título de eleitor.",
      "Maior de 18 anos apenas, independentemente de compreender as consequências civis e criminais.",
    ],
    correctIndex: 0,
    explanation:
      "O candidato deve ser penalmente imputável (saber ler e escrever, e ser maior de 18 anos perante a lei criminal).",
    detailedExplanation:
      "A idade mínima de 18 anos para obter a CNH está prevista no artigo 140 do CTB. O candidato também precisa saber ler e escrever, possuir CPF e documento de identidade, e ser penalmente imputável. Aos 18 anos a pessoa já responde criminalmente como adulta, o que é compatível com a responsabilidade exigida para conduzir um veículo. Para categorias profissionais (C, D e E), a idade mínima sobe para 21 anos.",
    legalBase: "Art. 140 CTB",
    incidence: "alta",
    difficulty: 3,
  },
  {
    id: "qe11",
    category: "legislacao",
    statement:
      "A expedição da Carteira Nacional de Habilitação (CNH) definitiva representa a transição do período probatório para o condutor habilitado. Conforme as normas previstas no CTB, a concessão deste documento ao término de um ano de PPD requer que o condutor:",
    options: [
      "Não tenha cometido nenhuma infração de natureza grave ou gravíssima, nem seja reincidente em infração média no período de doze meses.",
      "Tenha realizado pelo menos três viagens intermunicipais com monitoramento do órgão de trânsito estadual.",
      "Apresente certidão negativa de débitos de multas ambientais federais.",
      "Comprove a realização de exames complementares de direção veicular defensiva avançada.",
    ],
    correctIndex: 0,
    explanation:
      "A CNH definitiva exige que o portador da PPD não cometa infração grave/gravíssima nem seja reincidente em média.",
    detailedExplanation:
      "Após ser aprovado nos exames, o condutor recebe a Permissão para Dirigir (PPD), válida por 1 ano. Durante esse período probatório, o condutor novato precisa demonstrar que dirige com responsabilidade: se não cometer infração grave, gravíssima nem reincidir em infração média, a CNH definitiva é emitida automaticamente. Se cometer alguma dessas infrações, terá que reiniciar todo o processo de habilitação — incluindo aulas e exames.",
    legalBase: "Art. 148 CTB",
    incidence: "altissima",
    trap: true,
    difficulty: 3,
  },
  {
    id: "qe12",
    category: "legislacao",
    statement:
      "O exame toxicológico de larga janela de detecção destina-se ao controle do consumo de substâncias psicoativas por condutores profissionais. Sob o regramento atual do CTB, a realização deste exame é obrigatória na obtenção e renovação da habilitação nas categorias:",
    options: [
      "C, D e E, independentemente do exercício de atividade remunerada (EAR).",
      "B, C e D, somente se o condutor exercer atividade remunerada de transporte escolar.",
      "A, B e C, sempre que a validade da CNH for superior a cinco anos civis.",
      "Apenas na categoria E, para motoristas de veículos articulados com carga inflamável.",
    ],
    correctIndex: 0,
    explanation:
      "O exame toxicológico é obrigatório para condutores das categorias C, D e E, com periodicidade de 2 anos e meio para menores de 70 anos.",
    detailedExplanation:
      "O exame toxicológico é obrigatório para condutores das categorias C, D e E (caminhões, ônibus e veículos com reboque) tanto na obtenção quanto na renovação da CNH. O objetivo é detectar o uso de substâncias psicoativas que possam comprometer a segurança no trânsito. Motoristas de veículos pesados têm maior responsabilidade devido ao porte do veículo e ao transporte de passageiros ou cargas, justificando a exigência desse exame específico.",
    legalBase: "Art. 148-A CTB",
    incidence: "alta",
    difficulty: 3,
  },
  {
    id: "qe13",
    category: "infracoes",
    statement:
      "Um motorista estaciona seu veículo em uma vaga de estacionamento reservada a idosos na via pública, sem expor no painel a credencial emitida pelo órgão de trânsito local. Conforme as disposições punitivas previstas no CTB, tal conduta constitui infração de natureza:",
    options: [
      "Gravíssima, punida com multa, acúmulo de 7 pontos na CNH e medida administrativa de remoção do veículo.",
      "Grave, punida com multa pecuniária simples e retenção temporária do veículo para advertência oral.",
      "Média, gerando apenas a penalidade administrativa de recolhimento da CNH por trinta dias.",
      "Leve, passível de conversão imediata em advertência por escrito pelo agente de trânsito.",
    ],
    correctIndex: 0,
    explanation:
      "Estacionar em vaga regulamentada para idoso ou PCD sem credencial é infração gravíssima com remoção do veículo.",
    detailedExplanation:
      "Estacionar em vaga destinada a idoso sem a credencial adequada é infração MÉDIA, com 4 pontos na CNH e multa. As vagas de idoso são garantidas por lei (Estatuto do Idoso) e exigem credencial específica fornecida pelo DETRAN ou órgão municipal. Utilizá-las indevidamente prejudica quem realmente tem direito à prioridade. Já estacionar em vaga de pessoa com deficiência sem credencial é infração GRAVÍSSIMA — a gravidade é maior.",
    legalBase: "Art. 181, XVII CTB",
    incidence: "media",
    difficulty: 3,
  },
  {
    id: "qe14",
    category: "infracoes",
    statement:
      "Em um estabelecimento comercial privado de uso coletivo (como o estacionamento de um shopping center), um condutor estaciona na vaga reservada a Pessoas com Deficiência (PCD) sem possuir a credencial autorizativa. Diante dessa situação, o CTB prevê:",
    options: [
      "Infração de natureza gravíssima, punida com multa e medida administrativa de remoção do veículo.",
      "Impossibilidade de atuação do agente de trânsito, por se tratar de propriedade privada e sem jurisdição pública.",
      "Infração de natureza grave, passível de remoção do veículo se houver reclamação direta do gerente do local.",
      "Infração média, punida com multa administrativa e apreensão do veículo.",
    ],
    correctIndex: 0,
    explanation:
      "A fiscalização em vagas reservadas a idoso/PCD estende-se a estacionamentos privados de uso coletivo, sendo infração gravíssima com remoção.",
    detailedExplanation:
      "Estacionar em vaga reservada para pessoa com deficiência (PCD) sem a credencial exigida é infração GRAVÍSSIMA, a mais severa da categoria de estacionamento, com 7 pontos na CNH e multa. A diferença de gravidade em relação à vaga de idoso (que é Média) reflete a proteção especial da lei às pessoas com deficiência. A vaga PCD tem dimensões maiores para permitir embarque e desembarque com cadeira de rodas, e usá-la indevidamente dificulta a mobilidade de quem realmente precisa.",
    incidence: "alta",
    difficulty: 3,
  },
  {
    id: "qe15",
    category: "infracoes",
    statement:
      "Ao realizar rondas de trânsito, o agente de fiscalização observa que o passageiro do banco traseiro de um automóvel de passeio não está utilizando o cinto de segurança. De acordo com as normas de conduta e penalidades previstas no CTB, essa situação configura:",
    options: [
      "Infração de natureza grave praticada pelo condutor do veículo, punida com multa e medida administrativa de retenção do veículo até a colocação do cinto.",
      "Infração de natureza média praticada diretamente pelo passageiro, sendo este o único responsável legal pela multa.",
      "Infração leve de responsabilidade exclusiva do proprietário do veículo, gerando apenas advertência verbal pedagógica.",
      "Infração de natureza gravíssima com fator multiplicador de três vezes, punida com retenção definitiva do veículo.",
    ],
    correctIndex: 0,
    explanation:
      "Deixar de usar o cinto de segurança (condutor ou passageiro) é infração grave de responsabilidade do condutor, com retenção do veículo.",
    detailedExplanation:
      "NÃO usar o cinto de segurança é infração GRAVE, com 5 pontos na CNH e multa. O cinto é obrigatório para TODOS os ocupantes do veículo (frente e trás), em todas as vias. Em caso de colisão, o cinto impede que o ocupante seja arremessado contra o painel, o para-brisa ou para fora do veículo, além de evitar colisões secundárias dentro da cabine. A responsabilidade pelo uso do cinto também é do condutor — ele responde pela infração mesmo quando o passageiro é quem não está usando.",
    legalBase: "Art. 167 CTB",
    incidence: "alta",
    difficulty: 3,
  },
  {
    id: "qe16",
    category: "infracoes",
    statement:
      "Um motorista é flagrado por um radar dotado de câmera de alta definição trafegando enquanto segura ou manuseia seu telefone celular para visualizar mensagens. Sob a égide da legislação de trânsito atualizada, esta conduta específica classifica-se como:",
    options: [
      "Infração de natureza gravíssima, sujeita a multa pecuniária e acúmulo de 7 pontos no prontuário da CNH.",
      "Infração grave, punida com multa e suspensão preventiva do direito de dirigir por trinta dias.",
      "Infração média, gerando apenas advertência formal por escrito expedida pelo órgão executivo de trânsito.",
      "Infração leve, punida com multa caso o condutor esteja desenvolvendo velocidade acima da média da via.",
    ],
    correctIndex: 0,
    explanation:
      "Segurar ou manusear telefone celular enquanto conduz o veículo é infração gravíssima (Art. 252, parágrafo único do CTB).",
    detailedExplanation:
      "Segurar o celular ao volante é infração GRAVÍSSIMA, com 7 pontos na CNH e multa. A Lei 14.071/2021 endureceu essa penalidade porque manusear o celular reduz drasticamente a capacidade de reação do condutor — estudos mostram que equivale a dirigir alcoolizado. Só é permitido usar o celular ao volante em modo viva-voz ou com fone, sem segurar o aparelho. Mesmo olhar a tela do celular estacionado no suporte do painel pode distrair e gerar multa.",
    legalBase: "Art. 252, §1º CTB",
    incidence: "altissima",
    difficulty: 3,
  },
  {
    id: "qe17",
    category: "infracoes",
    statement:
      "Dois condutores resolvem realizar uma disputa de velocidade e arrancada rápida ('racha') em uma via arterial urbana aberta à circulação pública. Sob o prisma do Código de Trânsito Brasileiro, quais as penalidades e medidas administrativas aplicáveis a essa infração gravíssima de trânsito?",
    options: [
      "Multa multiplicada por dez vezes, suspensão do direito de dirigir, recolhimento do documento de habilitação e remoção do veículo.",
      "Multa de cinco vezes o valor base, retenção do veículo e curso obrigatório de primeiros socorros.",
      "Apenas advertência por escrito e apreensão temporária dos veículos por vinte e quatro horas.",
      "Multa multiplicada por vinte vezes e cassação imediata e definitiva de todas as categorias de CNH sem direito a defesa.",
    ],
    correctIndex: 0,
    explanation:
      "A infração de disputar corrida (Art. 173 do CTB) é gravíssima multiplicada por 10, com suspensão do direito de dirigir e remoção do veículo.",
    detailedExplanation:
      "Disputar corrida em via pública (racha) é uma das infrações mais severas do CTB: GRAVÍSSIMA com fator multiplicador 10, suspensão imediata do direito de dirigir, recolhimento da CNH e remoção do veículo. Além da infração administrativa, o racha configura CRIME de trânsito (art. 308 do CTB), com detenção de 6 meses a 3 anos. A gravidade se justifica porque o racha coloca em risco não só os participantes, mas todos os usuários da via — pedestres, ciclistas e outros motoristas.",
    legalBase: "Art. 173/308 CTB",
    incidence: "alta",
    difficulty: 3,
  },
  {
    id: "qe18",
    category: "infracoes",
    statement:
      "Em uma via coletora urbana cuja velocidade máxima permitida pela sinalização local é de 40 km/h, um radar de fiscalização eletrônica registra um veículo transitando a 55 km/h. Considerando a velocidade registrada, a infração cometida pelo motorista enquadra-se como:",
    options: [
      "Infração média, por transitar em velocidade superior à máxima permitida em até 20%.",
      "Infração grave, por transitar em velocidade superior à máxima permitida em mais de 20% até 50%.",
      "Infração gravíssima, punida com multa multiplicada por três vezes e suspensão automática do direito de dirigir.",
      "Infração leve, passível de conversão imediata em advertência escrita se for o primeiro registro do condutor.",
    ],
    correctIndex: 1,
    explanation:
      "De 40 km/h, 20% a mais seria 48 km/h. Transitando a 55 km/h, a velocidade supera em mais de 20% a máxima permitida (até 50%), configurando infração grave.",
    detailedExplanation:
      "Transitar entre 20% e 50% acima do limite de velocidade é infração GRAVE: 5 pontos na CNH e multa. O CTB divide o excesso de velocidade em faixas de gravidade crescente: até 20% acima é Média; de 20% a 50% é Grave; acima de 50% passa a ser Gravíssima com multa multiplicada por 3 e suspensão. Quanto maior a velocidade, menor o tempo de reação e maior a distância de frenagem, aumentando drasticamente o risco e a gravidade de um acidente.",
    legalBase: "Art. 218, II CTB",
    incidence: "altissima",
    difficulty: 3,
  },
  {
    id: "qe19",
    category: "infracoes",
    statement:
      "Ao transitar por uma rodovia de pista dupla cuja velocidade máxima regulamentada para automóveis é de 110 km/h, o veículo de um motorista é registrado pela fiscalização eletrônica desenvolvendo a velocidade de 170 km/h. Sob o rigor legal do CTB, essa conduta resulta em:",
    options: [
      "Infração de natureza gravíssima, punida com multa multiplicada por três vezes e imediata suspensão do direito de dirigir.",
      "Infração grave, acarretando multa pecuniária simples e retenção do veículo para fins de vistoria mecânica.",
      "Infração média, punida com multa e pontuação administrativa no prontuário do condutor habilitado.",
      "Crime de trânsito inafiançável com detenção imediata e recolhimento definitivo da CNH.",
    ],
    correctIndex: 0,
    explanation:
      "Velocidade superior à máxima permitida em mais de 50% é infração gravíssima (fator multiplicador 3) com suspensão do direito de dirigir (Art. 218, III).",
    detailedExplanation:
      "Ultrapassar o limite de velocidade em mais de 50% é infração GRAVÍSSIMA com fator multiplicador 3: o valor da multa é triplicado, além de 7 pontos na CNH e suspensão imediata do direito de dirigir. Essa é a faixa mais severa de excesso de velocidade porque representa um perigo extremo — um veículo a 90 km/h em uma via de 60 km/h, por exemplo, precisa do dobro da distância para parar. Acima de 50%, a margem de erro é mínima e as consequências de um acidente são frequentemente fatais.",
    legalBase: "Art. 218, III CTB",
    incidence: "alta",
    difficulty: 3,
  },
  {
    id: "qe20",
    category: "infracoes",
    statement:
      "Um pedestre inicia a travessia de uma avenida na faixa de segurança a ele destinada e desprovida de semáforo. O condutor de um automóvel aproxima-se e decide não parar, avançando sobre a faixa enquanto o pedestre se esquiva. Sob as normas de trânsito do CTB, a infração e a atitude do motorista configuram:",
    options: [
      "Infração gravíssima, punida com multa pecuniária administrativa e perda temporária do veículo por remoção.",
      "Infração grave, passível de conversão em advertência caso o pedestre consiga terminar a travessia ileso.",
      "Infração média, acarretando multa e apreensão temporária do documento de habilitação.",
      "Apenas infração de conduta leve, sem repercussão administrativa se não houver colisão física.",
    ],
    correctIndex: 0,
    explanation:
      "Deixar de dar preferência de passagem a pedestre que se encontre na faixa a ele destinada é infração gravíssima (Art. 214, I do CTB).",
    detailedExplanation:
      "Não dar preferência ao pedestre que está atravessando na faixa de segurança é infração GRAVÍSSIMA, com 7 pontos na CNH e multa. O pedestre é o usuário mais vulnerável do trânsito, e a faixa a ele destinada é um instrumento para garantir sua travessia segura. Desrespeitar essa prioridade demonstra falta de direção defensiva e coloca uma vida em risco. O correto é parar antes da faixa sempre que houver pedestre aguardando ou atravessando.",
    legalBase: "Art. 214 CTB",
    incidence: "alta",
    difficulty: 3,
  },
  {
    id: "qe21",
    category: "infracoes",
    statement:
      "Ao planejar uma viagem familiar em veículo de passeio de passeio, o condutor deve acomodar uma criança de 9 anos de idade e 1,35 metros de altura. Conforme as normas atualizadas do CTB, a forma de transporte legalmente exigida para essa criança é:",
    options: [
      "No banco traseiro, utilizando obrigatoriamente o cinto de segurança de três pontos ou dispositivo de retenção equivalente.",
      "No banco dianteiro, desde que o cinto de segurança seja regulado na altura máxima do ombro.",
      "No banco traseiro, sendo obrigatório o uso de assento de elevação até completar 12 anos completos.",
      "Em qualquer assento do veículo, sob supervisão direta de um adulto responsável e com cinto subabdominal.",
    ],
    correctIndex: 0,
    explanation:
      "Crianças menores de 10 anos que ainda não atingiram 1,45m de altura devem ser transportadas no banco traseiro com dispositivo de retenção adequado.",
    detailedExplanation:
      "Transportar criança menor de 10 anos no banco da frente é infração GRAVÍSSIMA, com 7 pontos na CNH e multa. Crianças até 10 anos devem ocupar o banco traseiro, utilizando dispositivo de retenção adequado (bebê conforto, cadeirinha ou assento de elevação) conforme idade, peso e altura. O banco da frente expõe a criança ao risco do airbag — em caso de colisão, o airbag pode machucar gravemente uma criança pequena. A Resolução CONTRAN 819/2021 atualizou essas regras.",
    legalBase: "Art. 168 CTB",
    incidence: "alta",
    difficulty: 3,
  },
  {
    id: "qe22",
    category: "infracoes",
    statement:
      "Ao transitar por uma via urbana de fluxo intenso com múltiplas faixas no mesmo sentido, um condutor depara-se com um veículo lento na faixa da esquerda e decide realizar a ultrapassagem utilizando a faixa da direita. Sob as regras gerais de circulação do CTB, tal manobra é:",
    options: [
      "Infração de trânsito de natureza média, exceto se o veículo da esquerda estiver sinalizando a intenção de entrar à esquerda.",
      "Infração de natureza grave, sem qualquer hipótese de excludente de ilicitude por fluxo intenso.",
      "Perfeitamente permitida em qualquer circunstância em vias arteriais de velocidade acima de 60 km/h.",
      "Classificada como crime de trânsito de perigo abstrato, punido com suspensão da CNH.",
    ],
    correctIndex: 0,
    explanation:
      "Ultrapassar pela direita é infração média, salvo quando o veículo à frente estiver na faixa apropriada e sinalizar a intenção de entrar à esquerda.",
    detailedExplanation:
      "Ultrapassar pela direita é infração GRAVÍSSIMA, com 7 pontos na CNH e multa. A ultrapassagem deve ser feita sempre pela esquerda, conforme determina o CTB. As únicas exceções são: quando o veículo da esquerda sinaliza que vai virar à esquerda (abrindo espaço), ou em vias de mão dupla com câmeras de sentido. Ultrapassar pela direita é perigoso porque o outro condutor não espera movimento rápido vindo desse lado, aumentando o risco de colisão.",
    legalBase: "Art. 199 CTB",
    incidence: "alta",
    difficulty: 3,
  },
  {
    id: "qe23",
    category: "infracoes",
    statement:
      "Durante viagem em rodovia de pista única e duplo sentido de circulação, o motorista inicia manobra de ultrapassagem sobre a linha de divisão de fluxos amarela contínua, em trecho de aclive acentuado. Sob as penalidades administrativas do CTB, essa conduta configura:",
    options: [
      "Infração gravíssima de trânsito, sujeita a multa multiplicada por cinco vezes, sem prejuízo de responsabilidade civil em caso de colisão.",
      "Infração grave, punida com multa pecuniária simples e suspensão imediata do direito de dirigir por 3 meses.",
      "Infração média, convertida automaticamente em advertência verbal se o trecho tiver boa visibilidade periférica.",
      "Crime de trânsito doloso contra a segurança viária coletiva com retenção imediata da habilitação.",
    ],
    correctIndex: 0,
    explanation:
      "Ultrapassar na contramão em linha dupla contínua ou simples contínua é infração gravíssima com fator multiplicador 5 (Art. 203, V do CTB).",
    detailedExplanation:
      "Ultrapassar em local proibido — como faixa dupla contínua, curvas, pontes, viadutos, túneis e aclives sem visibilidade — é infração GRAVÍSSIMA com fator multiplicador 5, além de suspensão do direito de dirigir e recolhimento da CNH. Esses locais são proibidos justamente porque a visibilidade é reduzida ou as condições da via não permitem uma ultrapassagem segura. Fazer uma ultrapassagem nessas condições pode resultar em colisão frontal, uma das mais letais.",
    legalBase: "Art. 191 CTB",
    incidence: "altissima",
    difficulty: 3,
  },
  {
    id: "qe24",
    category: "infracoes",
    statement:
      "Em uma fiscalização ordinária da Lei Seca realizada pela Polícia Militar, o motorista abordado nega-se expressamente a soprar o bafômetro ou realizar qualquer exame de dosagem alcoólica. Sob as regras vigentes do Art. 165-A do CTB, quais são as consequências jurídicas e administrativas imediatas?",
    options: [
      "Infração gravíssima, punida com multa multiplicada por dez vezes, suspensão do direito de dirigir por 12 meses e medida administrativa de recolhimento da CNH.",
      "Apenas lavratura de termo de ocorrência sem aplicação de multa, desde que o condutor apresente um condutor substituto sóbrio.",
      "Crime de trânsito imediato por presunção de culpa, com encaminhamento obrigatório do motorista à delegacia de polícia.",
      "Infração grave, sujeita apenas ao pagamento de multa simples administrativa e anotação de 5 pontos na carteira.",
    ],
    correctIndex: 0,
    explanation:
      "A recusa ao teste do etilômetro ou exames similares acarreta as mesmas penalidades de dirigir sob efeito de álcool (gravíssima multiplicada por 10 e suspensão por 12 meses).",
    legalBase: "Art. 165-A CTB",
    detailedExplanation:
      "Recusar-se a soprar o bafômetro, fazer exame de sangue ou qualquer outro procedimento que detecte álcool tem a MESMA penalidade de dirigir alcoolizado: infração GRAVÍSSIMA com multa multiplicada por 10, suspensão do direito de dirigir por 12 meses e recolhimento da CNH. Muitos condutores acham que recusar o teste e fica por isso — mas a lei preve essa penalidade justamente para evitar que motoristas embriagados escapem da fiscalizacao.",
    incidence: "altissima",
    trap: true,
    difficulty: 3,
  },
  {
    id: "qe25",
    category: "infracoes",
    statement:
      "Um motorista é parado em fiscalização viária rotineira e o agente constata que a CNH física ou digital do condutor encontra-se com o exame de aptidão física vencido há quarenta dias civis. Pelas regras administrativas contidas no CTB, essa situação configura:",
    options: [
      "Infração de natureza gravíssima, sujeita a multa pecuniária administrativa e medida administrativa de recolhimento da CNH e retenção do veículo.",
      "Infração grave, permitindo o tráfego regular por até noventa dias adicionais se o condutor comprovar agendamento médico.",
      "Infração média, punida apenas com multa e pontuação, sem previsão de retenção ou recolhimento de documentos.",
      "Conduta atípica sob o ponto de vista das infrações de trânsito, gerando apenas notificação pedagógica escrita.",
    ],
    correctIndex: 0,
    explanation:
      "Dirigir com CNH vencida há mais de 30 dias é infração gravíssima com multa e retenção do veículo até a apresentação de condutor habilitado.",
    detailedExplanation:
      "Dirigir com CNH vencida há mais de 30 dias é infração GRAVÍSSIMA, com 7 pontos na CNH, multa e retenção do veículo. A CNH vencida perde a validade como documento de identificação do condutor, e circular com ela vencida significa que o motorista não comprova estar apto a dirigir. O prazo de 30 dias é a tolerância legal para renovação. Após esse período, o condutor é considerado como não habilitado para efeitos da infração.",
    legalBase: "Art. 162, V CTB",
    incidence: "alta",
    difficulty: 3,
  },
  {
    id: "qe26",
    category: "infracoes",
    statement:
      "Ao trafegar em via pública residencial durante o período noturno (às 23h30), um condutor aciona o dispositivo de buzina de forma prolongada e sucessiva para chamar um morador. De acordo com as normas de conduta e penalidades previstas no CTB, tal prática configura:",
    options: [
      "Infração de natureza leve, punida com multa e pontuação administrativa no prontuário do condutor.",
      "Infração de natureza média, classificada como poluição sonora urbana inafiançável.",
      "Conduta plenamente permitida, visto que o motorista estava em velocidade abaixo de 20 km/h.",
      "Infração grave, sujeita a medida administrativa de recolhimento do veículo ao pátio do DETRAN.",
    ],
    correctIndex: 0,
    explanation:
      "Usar a buzina de forma prolongada/sucessiva ou entre as 22h e as 6h é infração leve (Art. 227 do CTB).",
    detailedExplanation:
      "Buzinar em local proibido (como hospitais, escolas) ou durante o período noturno (22h às 6h) é infração LEVE, com 3 pontos na CNH e multa. A buzina deve ser usada apenas em TOQUES BREVES para advertir sobre risco iminente. Usá-la em excesso ou fora dessas situações configura poluição sonora, perturba o sossego público e pode até gerar multa por perturbação ambiental. A regra é simples: buzine só o suficiente para evitar acidentes.",
    legalBase: "Art. 227 CTB",
    incidence: "media",
    difficulty: 3,
  },
  {
    id: "qe27",
    category: "direcao-defensiva",
    statement:
      "O conceito técnico e prático de Direção Defensiva fundamenta-se em atitudes preventivas adotadas pelo motorista ao volante. Dentre as alternativas apresentadas, assinale a opção que define corretamente o objetivo primordial da direção defensiva:",
    options: [
      "Conduzir de forma a evitar acidentes de trânsito a despeito das ações incorretas dos outros usuários e das condições adversas da via.",
      "Garantir a máxima velocidade linear permitida para agilizar o fluxo viário urbano e diminuir engarrafamentos.",
      "Desenvolver técnicas de controle de derrapagens em altas velocidades para contornar curvas de forma desportiva.",
      "Transferir a responsabilidade civil da segurança do tráfego exclusivamente para os pedestres e ciclistas da via pública.",
    ],
    correctIndex: 0,
    explanation:
      "Direção defensiva é dirigir de forma preventiva para evitar acidentes apesar de condições adversas e erros de terceiros.",
    detailedExplanation:
      "Direção defensiva é o conjunto de técnicas que permite ao condutor dirigir de forma a prevenir acidentes, mesmo diante de condições adversas (clima, via, trânsito) e dos erros de outros motoristas e pedestres. O foco principal NÃO é chegar rápido, economizar combustível ou cumprir prazos — embora esses benefícios possam surgir como consequência. O objetivo central é salvar vidas, antecipando situações de risco e agindo com segurança.",
    incidence: "altissima",
    difficulty: 3,
  },
  {
    id: "qe28",
    category: "direcao-defensiva",
    statement:
      "As condições adversas representam fatores de risco que podem interferir diretamente na segurança da dirigibilidade. Constitui exemplo típico de condição adversa relacionada especificamente ao fator 'Luz':",
    options: [
      "O fenômeno do ofuscamento ocular provocado pela luz alta em sentido oposto ou o penumbra na transição dia-noite.",
      "A ocorrência de aquaplanagem devido ao acúmulo de águas pluviais sobre a pista de rolamento.",
      "O desgaste acentuado das bandas de rodagem dos pneus dianteiros do veículo automotor.",
      "A fadiga física ou o estresse mental decorrentes de jornadas prolongadas de trabalho ao volante.",
    ],
    correctIndex: 0,
    explanation:
      "Condições adversas de luz referem-se à falta de iluminação (penumbra/escuridão) ou excesso dela (ofuscamento por farol alto ou sol).",
    detailedExplanation:
      "Condições adversas de LUZ incluem situações que afetam a visibilidade por iluminação inadequada: sol baixo ofuscante, faróis altos de veículos em sentido contrário, penumbra ao anoitecer, neblina e chuva forte. Cada tipo exige uma reação específica — desviar o olhar para a margem direita da pista quando ofuscado, acender faróis baixos ou de neblina quando necessário. Neblina é condição adversa de clima, não de luz. Pneu careca é mecânica.",
    incidence: "alta",
    trap: true,
    difficulty: 3,
  },
  {
    id: "qe29",
    category: "direcao-defensiva",
    statement:
      "Para realizar uma manobra segura de ultrapassagem em via de mão única e pista dupla de circulação rápida, o condutor defensivo deve prioritariamente adotar o seguinte procedimento técnico sequencial:",
    options: [
      "Verificar os retrovisores e ponto cego, sinalizar com antecedência a intenção de mudança de faixa, acelerar de forma segura e retornar à faixa de origem após ver o veículo ultrapassado no retrovisor interno.",
      "Acionar a luz alta de alerta e efetuar a manobra o mais rápido possível rente ao para-choque traseiro do veículo da frente.",
      "Buzinar continuamente para forçar o condutor do veículo lento a desviar para o acostamento à direita da pista.",
      "Mudar brusca e rapidamente de faixa para surpreender os motoristas que trafegam na faixa adjacente esquerda.",
    ],
    correctIndex: 0,
    explanation:
      "Ultrapassagens seguras exigem planejamento, verificação de retrovisores/pontos cegos, sinalização prévia e retorno seguro mantendo margem de espaço.",
    detailedExplanation:
      "A ultrapassagem segura segue uma sequência lógica: 1) sinalizar com a seta esquerda com antecedência; 2) verificar o retrovisor interno e lateral, e virar a cabeça para checar o ponto cego; 3) deslocar-se para a faixa esquerda com segurança; 4) acelerar e ultrapassar; 5) sinalizar com a seta direita e 6) retornar à faixa original só quando enxergar o veículo ultrapassado pelo retrovisor interno. Pular qualquer etapa aumenta o risco de colisão.",
    incidence: "alta",
    difficulty: 3,
  },
  {
    id: "qe30",
    category: "direcao-defensiva",
    statement:
      "Sob forte chuva torrencial, um condutor perde repentinamente o controle direcional do veículo ao passar por um trecho reto e plano com acúmulo de água na pista. Esse fenômeno físico, denominado aquaplanagem (ou hidroplanagem), ocorre pela combinação de:",
    options: [
      "Alta velocidade do veículo, película de água acumulada sobre a pista e pneus com desgaste severo (profundidade de sulco abaixo de 1,6 mm).",
      "Redução da pressão interna do fluido de freios hidráulicos sob temperaturas ambientes baixas.",
      "Excesso de peso de carga estática concentrada na extremidade do porta-malas traseiro do veículo.",
      "Bloqueio mecânico completo das pinças dos discos de freio decorrente de detritos pluviais na via.",
    ],
    correctIndex: 0,
    explanation:
      "A aquaplanagem é a perda de aderência dos pneus com o solo devido a uma camada de água na pista, facilitada por velocidade alta e pneus gastos.",
    detailedExplanation:
      "Aquaplanagem (hidroplanagem) ocorre quando uma lâmina de água se acumula entre o pneu e o asfalto, fazendo os pneus perderem completamente o contato com o solo. As causas principais são: excesso de velocidade sobre poças d'água, pneus com sulcos desgastados (abaixo de 1,6 mm) e calibragem inadequada. O motorista perde o controle da direção e da frenagem. Para prevenir, reduza a velocidade em dias de chuva e mantenha os pneus em bom estado.",
    incidence: "alta",
    difficulty: 3,
  },
  {
    id: "qe31",
    category: "direcao-defensiva",
    statement:
      "Ao transitar por uma rodovia pavimentada sob chuva leve, o condutor sente a direção do veículo ficar extremamente leve e percebe a ocorrência do fenômeno da aquaplanagem. Sob a ótica do controle veicular defensivo, qual a conduta imediata recomendada?",
    options: [
      "Segurar o volante firmemente na direção de deslocamento, retirar gradualmente o pé do acelerador e evitar frear ou fazer manobras bruscas.",
      "Pisar com força e de forma contínua no pedal de freio de serviço para travar as rodas e buscar atrito com o asfalto.",
      "Girar o volante bruscamente de um lado para o outro para expulsar a água acumulada sob a banda de rodagem do pneu.",
      "Engatar imediatamente uma marcha reduzida de giro alto para forçar o veículo a recuperar aderência mecânica por tração.",
    ],
    correctIndex: 0,
    explanation:
      "Na aquaplanagem, deve-se desacelerar suavemente e segurar firme o volante. Frear bruscamente ou virar o volante causa derrapagem incontrolável.",
    detailedExplanation:
      "Ao sentir que o veículo está aquaplanando, a reação instintiva de frear ou virar bruscamente é justamente o que NÃO se deve fazer. O correto é: 1) tire o pé do acelerador; 2) segure o volante FIRME, mantendo a direção reta; 3) NÃO freie nem vire bruscamente — isso pode fazer o carro rodar. Em alguns veículos com freios ABS, é possível frear suavemente se houver certa aderência. Aguarde até sentir os pneus retomarem o contato com o solo.",
    incidence: "altissima",
    difficulty: 3,
  },
  {
    id: "qe32",
    category: "direcao-defensiva",
    statement:
      "Durante uma viagem de longa duração em período noturno, o condutor percebe sintomas severos de fadiga, pálpebras pesadas e lapsos momentâneos de atenção. De acordo com as diretrizes de segurança no trânsito, a conduta correta a ser adotada é:",
    options: [
      "Buscar imediatamente um local seguro de parada para descansar e dormir o tempo necessário, prosseguindo apenas após recuperar o estado de alerta.",
      "Aumentar a velocidade de circulação para diminuir o tempo restante de percurso e chegar mais rápido ao destino.",
      "Ligar o sistema de ar condicionado na temperatura máxima e abrir as janelas laterais para manter o foco ativo por choque térmico.",
      "Ingerir doses concentradas de cafeína ou bebidas estimulantes energéticas e continuar a condução ininterrupta.",
    ],
    correctIndex: 0,
    explanation:
      "A única solução segura e eficaz contra a fadiga ou sono ao volante é parar o veículo em local seguro e descansar.",
    detailedExplanation:
      "O cansaço e o sono ao volante são extremamente perigosos — um condutor com sono tem reflexos reduzidos, tempo de reação aumentado e pode até cochilar ao volante. Nenhum truque (energético, café, ar gelado, música alta) substitui o descanso. A única atitude segura é parar o veículo em local apropriado (posto de gasolina, área de descanso) e dormir ou descansar antes de seguir viagem. Dirigir cansado pode ser tão perigoso quanto dirigir alcoolizado.",
    incidence: "alta",
    difficulty: 3,
  },
  {
    id: "qe33",
    category: "direcao-defensiva",
    statement:
      "O alinhamento correto dos espelhos retrovisores é indispensável para mitigar áreas cegas de visão ao redor do automóvel. A área externa ao veículo cuja visibilidade não é captada pelos retrovisores internos e externos convencionais denomina-se:",
    options: [
      "Ponto cego do veículo, exigindo que o condutor faça uma rápida verificação visual lateral antes de mudar de faixa.",
      "Zona de refração óptica difusa, impossível de ser minimizada por qualquer tipo de espelho ou regulagem de banco.",
      "Área de convergência periférica posterior, coberta exclusivamente pelo sensor de estacionamento eletrônico.",
      "Ponto de fuga horizontal, visível apenas com o veículo trafegando em marcha ré.",
    ],
    correctIndex: 0,
    explanation:
      "O ponto cego é a área que fica fora do campo visual dos espelhos retrovisores, exigindo atenção e movimento de cabeça lateral.",
    detailedExplanation:
      "Ponto cego é a área lateral e traseira do veículo que não é captada pelos retrovisores interno e laterais, mesmo bem ajustados. Todo veículo tem pontos cegos, geralmente na traseira lateral (ângulo morto). O condutor deve VIRAR A CABEÇA e olhar por cima do ombro antes de mudar de faixa ou fazer conversão para garantir que não há outro veículo no ponto cego. Veículos mais modernos têm sensores de ponto cego que auxiliam, mas não substituem a verificação visual.",
    incidence: "alta",
    difficulty: 3,
  },
  {
    id: "qe34",
    category: "direcao-defensiva",
    statement:
      "Ao transitar por uma rodovia de pista única em período noturno, desprovida de qualquer iluminação pública ou sinalização refletiva de solo, qual o dispositivo de iluminação que o condutor deve utilizar prioritariamente na condução do veículo?",
    options: [
      "Luz alta (farol alto), exceto ao se aproximar de veículo em sentido oposto ou ao seguir imediatamente atrás de outro veículo.",
      "Luz de posição (faroletes) associada às luzes de neblina dianteiras para economizar bateria.",
      "Luz baixa (farol baixo) de forma fixa e contínua sob qualquer hipótese viária para evitar multas de trânsito.",
      "Farol alto permanentemente ativo, mesmo cruzando com outros fluxos, para garantir visibilidade máxima de longa distância.",
    ],
    correctIndex: 0,
    explanation:
      "Em vias não iluminadas, deve-se usar farol alto, baixando-o ao cruzar com outro veículo em sentido contrário ou ao seguir alguém para não ofuscá-los.",
    detailedExplanation:
      "Em estradas sem iluminação pública, o farol ALTO deve ser usado para maximizar a visibilidade. Porém, ao cruzar com outro veículo em sentido contrário, o condutor deve REDUZIR para farol BAIXO com antecedência para não ofuscar o motorista que vem na direção oposta — a cegueira temporária causada pelo farol alto pode causar acidentes graves. O mesmo vale quando estiver seguindo outro veículo: mantenha o farol baixo para não ofuscar o retrovisor do carro à frente.",
    legalBase: "Art. 40 CTB",
    incidence: "alta",
    difficulty: 3,
  },
  {
    id: "qe35",
    category: "direcao-defensiva",
    statement:
      "O tráfego de veículos no interior de túneis requer cuidados especiais de visibilidade e sinalização. De acordo com as disposições expressas do Código de Trânsito Brasileiro, ao ingressar em um túnel provido de iluminação pública, o condutor deve:",
    options: [
      "Manter acesos os faróis do veículo, utilizando a luz baixa (farol baixo), mesmo durante o dia.",
      "Acionar os faróis de milha de longo alcance associados à luz alta para alertar pedestres internos.",
      "Manter apenas as luzes de posição (faroletes) ativas e ligar o pisca-alerta do veículo em movimento.",
      "Desligar qualquer dispositivo de iluminação para evitar reflexos ofuscantes nas paredes internas do túnel.",
    ],
    correctIndex: 0,
    explanation:
      "O condutor deve manter os faróis acesos, utilizando a luz baixa, em túneis providos de iluminação pública, conforme o Art. 40 do CTB.",
    detailedExplanation:
      "Em túneis, o farol BAIXO deve estar ligado SEMPRE, mesmo durante o dia. Isso garante que o veículo seja visto pelos demais condutores e também ilumina parte da via. O farol alto não deve ser usado em túneis porque o reflexo pode ofuscar o próprio condutor e os outros. O pisca-alerta só deve ser usado em emergências ou imobilizações. O farol baixo em túneis é regra básica de segurança que salva vidas.",
    legalBase: "Art. 40 CTB",
    incidence: "alta",
    difficulty: 3,
  },
  {
    id: "qe36",
    category: "direcao-defensiva",
    statement:
      "A distância de parada de um veículo é composta pela soma da distância de reação e da distância de frenagem. Sobre os fatores físicos que influenciam diretamente o aumento da distância de frenagem do automóvel, assinale a afirmativa correta:",
    options: [
      "O aumento da velocidade de deslocamento, a presença de pista molhada ou escorregadia e pneus com banda de rodagem desgastada.",
      "O tempo de reação do condutor ao perceber o perigo à sua frente até o acionamento mecânico do pedal.",
      "A rigidez torcional do monobloco do chassi e a utilização de fluido de freio sintético de alta especificação.",
      "A diminuição da declividade da via (declives) ou subidas íngremes de serras pavimentadas.",
    ],
    correctIndex: 0,
    explanation:
      "A distância de frenagem (do acionamento do freio até a parada) aumenta com velocidades maiores, asfalto molhado/escorregadio e pneus gastos.",
    detailedExplanation:
      "A distância de frenagem — espaço percorrido desde o momento em que o condutor pisa no freio até a parada total — aumenta com: maior velocidade (o dobro da velocidade quadruplica a distância), pista molhada ou escorregadia (reduz o atrito dos pneus com o solo) e pneus desgastados (perdem aderência). Veículos mais pesados também têm maior distância de frenagem. Manter distância de segurança adequada é essencial para compensar esses fatores.",
    incidence: "alta",
    difficulty: 3,
  },
  {
    id: "qe37",
    category: "primeiros-socorros",
    statement:
      "No contexto do suporte básico de vida e dos primeiros socorros em acidentes automobilísticos de trânsito, a aplicação da sigla prática de procedimento 'PAS' estabelece a seguinte sequência de prioridades de atendimento:",
    options: [
      "Prevenir o local do sinistro (sinalização), Chamar/Acionar socorro profissional e Socorrer as vítimas conforme gravidade.",
      "Prestar atendimento imediato na pista, Afastar curiosos do local e Sinalizar a rodovia após a remoção das vítimas.",
      "Parar o próprio veículo na faixa de rolamento, Ajudar na remoção física dos veículos e Salvar pertences pessoais das vítimas.",
      "Procurar testemunhas oculares do acidente, Avaliar lesões internas e Sinalizar com galhos secos sobre a faixa de rolamento.",
    ],
    correctIndex: 0,
    explanation:
      "A sigla PAS (do espanhol/português adaptado de primeiros socorros) orienta: Prevenir (Sinalizar), Avisar (Chamar socorro) e Socorrer (Atendimento básico).",
    detailedExplanation:
      "O protocolo PAS é a sequência de ações que todo condutor deve seguir ao chegar em um local de acidente: PROTEGER o local sinalizando com triângulo a 30 metros e ligando o pisca-alerta; AVISAR as autoridades ligando para o SAMU (192), Bombeiros (193) ou Polícia (190); SOCORRER as vítimas apenas se tiver conhecimento técnico. O PAS é universalmente adotado porque estabelece uma ordem lógica que evita que o socorrista se torne mais uma vítima.",
    incidence: "altissima",
    difficulty: 3,
  },
  {
    id: "qe38",
    category: "primeiros-socorros",
    statement:
      "Ao deparar-se com uma vítima de acidente de trânsito que apresenta hemorragia externa abundante em um dos membros inferiores, qual o procedimento inicial correto de primeiros socorros a ser realizado pelo socorrista leigo?",
    options: [
      "Efetuar compressão direta e firme sobre a lesão sangrante utilizando um pano limpo ou gaze esterilizada.",
      "Aplicar um torniquete rígido apertado com arame ou corda logo acima da lesão para interromper o fluxo total.",
      "Jogar água oxigenada ou álcool concentrado sobre o ferimento exposto e cobrir com pó cicatrizante caseiro.",
      "Manter a vítima de pé e forçá-la a caminhar para estimular a coagulação sanguínea natural nos tecidos.",
    ],
    correctIndex: 0,
    explanation:
      "A compressão direta com gaze ou pano limpo é a técnica mais segura e indicada para controlar hemorragias externas no suporte básico de vida.",
    detailedExplanation:
      "O primeiro procedimento para hemorragia externa intensa é a COMPRESSÃO DIRETA sobre o ferimento com um pano limpo, gaze ou até mesmo a mão (protegida por luva ou saco plástico). A compressão reduz o fluxo sanguíneo e permite a coagulação. O torniquete só deve ser usado em último caso (amputação ou hemorragia incontrolável), pois pode causar necrose e perda do membro. Lavar com álcool dói e prejudica a coagulação — não se faz isso.",
    incidence: "alta",
    difficulty: 3,
  },
  {
    id: "qe39",
    category: "primeiros-socorros",
    statement:
      "Em um acidente de trânsito envolvendo colisão frontal, o socorrista inicial suspeita que uma das vítimas sofreu uma fratura de coluna (lesão medular). Diante dessa hipótese diagnóstica, qual a conduta correta a ser adotada até a chegada da equipe de resgate médico?",
    options: [
      "Manter a vítima perfeitamente imóvel e alinhada na posição encontrada, evitando qualquer movimentação da cabeça ou coluna.",
      "Tentar remover a vítima rapidamente do interior do veículo e forçá-la a sentar-se ereta em uma cadeira rígida.",
      "Massagear a região cervical e as costas da vítima para aliviar a contratura muscular decorrente do trauma físico.",
      "Girar o pescoço da vítima para a esquerda e direita para avaliar a mobilidade das articulações vertebrais.",
    ],
    correctIndex: 0,
    explanation:
      "Vítimas com suspeita de lesão na coluna devem ser mantidas imóveis e perfeitamente alinhadas para evitar danos medulares e paralisia irreversível.",
    detailedExplanation:
      "NUNCA mova uma vítima com suspeita de lesão na coluna. Qualquer movimento inadequado pode agravar a lesão da medula espinhal e causar paralisia permanente. A vítima deve ser mantida IMÓVEL, na posição em que se encontra, até a chegada do socorro especializado (SAMU ou bombeiros) que possui equipamentos de imobilização. A única exceção é se houver risco iminente, como incêndio, afogamento ou explosão — nesse caso, deve-se mover a vítima em BLOCO com 3 pessoas.",
    incidence: "altissima",
    trap: true,
    difficulty: 3,
  },
  {
    id: "qe40",
    category: "primeiros-socorros",
    statement:
      "Durante o atendimento emergencial a um acidente de trânsito com vítimas graves presas nas ferragens, o socorrista deve acionar os órgãos competentes. Assinale a alternativa que apresenta corretamente o número telefônico e o órgão responsável pelo serviço médico de urgência:",
    options: [
      "192 para acionar o Serviço de Atendimento Móvel de Urgência (SAMU).",
      "193 para acionar a Polícia Rodoviária Federal (PRF).",
      "190 para acionar o Corpo de Bombeiros Militar do Estado correspondente.",
      "191 para acionar a Defesa Civil do Município da ocorrência do sinistro.",
    ],
    correctIndex: 0,
    explanation:
      "O telefone do SAMU é o 192. O 193 aciona o Corpo de Bombeiros e o 190 aciona a Polícia Militar.",
    detailedExplanation:
      "Saber os números de emergência é fundamental para agir rápido em um acidente: SAMU (192) para emergências médicas e resgate de vítimas; Corpo de Bombeiros (193) para incêndios, desastres e resgate em ferragens; Polícia Militar (190) para ocorrências de trânsito com crime ou conflito; PRF (191) para rodovias federais. Memorize o 192 — é o principal número para solicitar socorro médico, pois os atendentes do SAMU podem orientar os primeiros socorros por telefone.",
    incidence: "alta",
    difficulty: 3,
  },
  {
    id: "qe41",
    category: "primeiros-socorros",
    statement:
      "Ao sinalizar o local de um sinistro em rodovia de pista simples em dia ensolarado, o condutor deve posicionar o triângulo de segurança. Sabendo que a via tem velocidade regulamentada de 80 km/h, qual a distância mínima exigida segundo normas de primeiros socorros e direção defensiva?",
    options: [
      "No mínimo 80 passos longos de um adulto, contados a partir da traseira do veículo, dobrando o valor se houver chuva, neblina ou curva no trajeto.",
      "Exatos 30 metros de distância linear independente das condições climáticas locais.",
      "No acostamento a apenas 10 metros de distância do veículo acidentado.",
      "Apenas 5 passos curtos da traseira do veículo, ativando as luzes do pisca-alerta simultaneamente.",
    ],
    correctIndex: 0,
    explanation:
      "A contagem deve ser de 1 passo por km/h de velocidade da via (80 passos para 80 km/h). Em condições adversas ou curvas, essa distância deve ser dobrada.",
    detailedExplanation:
      "O triângulo de sinalização deve ser colocado a NO MÍNIMO 30 metros atrás do veículo (na mesma faixa), em vias urbanas e rodovias comuns. O objetivo é alertar os veículos que estão atrás para que reduzam a velocidade a tempo de desviar. Em rodovias de alta velocidade, o ideal é colocar ainda mais longe (50 a 100 metros), considerando a distância de frenagem em alta velocidade. Não colocar o triângulo ou colocá-lo muito perto pode causar colisões traseiras.",
    incidence: "alta",
    difficulty: 3,
  },
  {
    id: "qe42",
    category: "primeiros-socorros",
    statement:
      "Ao prestar socorro a uma vítima com queimaduras de segundo grau nos braços provocadas por explosão de radiador, qual o procedimento imediato de primeiros socorros adequado a ser executado no local?",
    options: [
      "Resfriar o local afetado com água limpa corrente em temperatura ambiente e cobrir suavemente com um pano úmido e limpo.",
      "Aplicar pomada de uso dermatológico ou manteiga caseira sobre a ferida para aliviar a ardência local.",
      "Romper as bolhas de queimadura formadas para acelerar a drenagem de líquidos teciduais.",
      "Enfaixar o braço de forma apertada com atadura de algodão seca para evitar contato com o ar.",
    ],
    correctIndex: 0,
    explanation:
      "Em queimaduras, deve-se resfriar com água corrente limpa e proteger com pano limpo e úmido. Nunca rompa bolhas ou aplique substâncias não médicas.",
    detailedExplanation:
      "O procedimento correto para queimaduras é resfriar a área com água CORRENTE em temperatura ambiente por cerca de 10 a 15 minutos, para aliviar a dor e interromper o processo de queimadura térmica. NUNCA aplique pasta de dente, manteiga, clara de ovo, café ou qualquer outra substância caseira — isso piora a lesão e pode causar infecção. NUNCA estoure as bolhas, pois a pele bolhosa protege contra infecções. Também não aplique gelo diretamente, pois queima mais ainda o tecido.",
    incidence: "media",
    difficulty: 3,
  },
  {
    id: "qe43",
    category: "primeiros-socorros",
    statement:
      "Uma vítima de acidente de trânsito está consciente, porém apresenta sinais evidentes de estado de choque: palidez extrema, pele fria e pegajosa, pulsação rápida e respiração superficial. Qual o procedimento inicial correto a ser executado?",
    options: [
      "Manter a vítima deitada em local plano, afrouxar suas roupas e, se possível, elevar seus membros inferiores em cerca de 30 centímetros.",
      "Forçar a vítima a sentar-se e ingerir água bem gelada ou café bem forte para reestabelecer a pressão arterial.",
      "Realizar massagem cardíaca vigorosa de forma contínua mesmo com a vítima consciente e respirando.",
      "Cobrir a vítima com mantas pesadas e abafá-la completamente para induzir o suor excessivo.",
    ],
    correctIndex: 0,
    explanation:
      "O estado de choque requer repouso, afrouxamento de roupas, manutenção de temperatura corporal e elevação de pernas para melhorar o fluxo central.",
    detailedExplanation:
      "O estado de choque (hipovolêmico) ocorre quando o corpo não recebe oxigênio suficiente nos órgãos vitais, geralmente após hemorragia, trauma ou desidratação. A vítima consciente deve ser deitada de costas com as pernas elevadas cerca de 30 cm (para ajudar o sangue a chegar ao cérebro), mantida aquecida (cobrir com casaco ou cobertor) e NÃO receber água ou comida, pois pode precisar de cirurgia ou estar com lesões internas. Fale calmamente com a vítima até o socorro chegar.",
    incidence: "media",
    difficulty: 3,
  },
  {
    id: "qe44",
    category: "meio-ambiente",
    statement:
      "Os motores a combustão interna dos veículos automotores emitem gases nocivos pela queima de derivados de petróleo. Dentre as substâncias listadas, assinale o gás altamente tóxico, sem cheiro e incolor que interfere na oxigenação do sangue humano:",
    options: [
      "O Monóxido de Carbono (CO), gás liberado pela combustão incompleta que se liga à hemoglobina do sangue e impede a oxigenação adequada do corpo humano.",
      "O Dióxido de Carbono (CO2), gás naturalmente presente na atmosfera e principal responsável pela intensificação do efeito estufa global.",
      "O Dióxido de Enxofre (SO2), gás de odor forte e irritante que contribui para a formação da chuva ácida em regiões industrializadas.",
      "O Clorofluorcarboneto (CFC), composto químico utilizado em sistemas de refrigeração que contribui para a destruição da camada de ozônio.",
    ],
    correctIndex: 0,
    explanation:
      "O Monóxido de Carbono (CO) liga-se de forma estável à hemoglobina do sangue, reduzindo a oxigenação corporal e podendo provocar asfixia e morte.",
    detailedExplanation:
      "Motores a combustão (gasolina, diesel, etanol) queimam combustível fóssil ou biocombustível, liberando diversos gases. Os principais poluentes são o monóxido de carbono (CO — gás tóxico e inodoro) e o dióxido de carbono (CO2 — gás do efeito estufa). Também são emitidos óxidos de nitrogênio (NOx), hidrocarbonetos não queimados e material particulado (fumaça preta). A manutenção preventiva reduz essas emissões, contribuindo para a qualidade do ar e a saúde pública.",
    incidence: "media",
    difficulty: 3,
  },
  {
    id: "qe45",
    category: "meio-ambiente",
    statement:
      "A prática da direção econômica e ecológica traz impactos ambientais positivos. Dentre as opções, assinale a conduta que contribui ativamente para a redução da emissão de poluentes atmosféricos e economia de combustível:",
    options: [
      "Manter a aceleração constante, evitar frenagens ou arrancadas bruscas e planejar as trocas de marchas na faixa adequada de rotação do motor.",
      "Acelerar o motor vigorosamente em ponto morto antes de desligar o veículo para queimar resíduos.",
      "Utilizar marchas altas em baixas velocidades forçando o motor a trabalhar abaixo da rotação mínima de serviço.",
      "Desligar o motor em descidas longas (banguela) confiando exclusivamente no sistema de freios de estacionamento.",
    ],
    correctIndex: 0,
    explanation:
      "Conduzir com aceleração suave, antecipar o fluxo e trocar marchas no tempo correto minimiza o consumo de combustível e a poluição.",
    detailedExplanation:
      "A direção econômica é um conjunto de práticas que reduzem o consumo de combustível: trocar marcha em rotações adequadas (2.000 a 2.500 rpm), evitar acelerações e freadas bruscas, manter a calibragem correta dos pneus, fazer manutenções preventivas e reduzir o peso desnecessário no veículo. Menos combustível queimado significa menos emissão de CO2 e poluentes na atmosfera. Além de ajudar o meio ambiente, a direção econômica reduz os custos com combustível e manutenção.",
    incidence: "alta",
    difficulty: 3,
  },
  {
    id: "qe46",
    category: "meio-ambiente",
    statement:
      "Ao transitar por uma rodovia estadual, um passageiro arremessa uma lata de alumínio pela janela lateral do veículo em movimento. Conforme o regramento de posturas ambientais do CTB, essa conduta constitui:",
    options: [
      "Infração de trânsito de natureza média, sujeita a multa administrativa de responsabilidade do condutor.",
      "Infração leve de responsabilidade exclusiva do passageiro que efetuou o arremesso físico.",
      "Infração grave, punida com suspensão imediata da licença de tráfego anual do veículo.",
      "Conduta permitida pela lei de trânsito desde que a via seja de pista simples e sem acostamento pavimentado.",
    ],
    correctIndex: 0,
    explanation:
      "Atirar ou abandonar objetos ou substâncias na via pública constitui infração média de trânsito (Art. 172 do CTB).",
    detailedExplanation:
      "Jogar lixo pela janela do veículo é infração MÉDIA, 4 pontos na CNH e multa. Além da penalidade de trânsito, o ato configura crime ambiental, especialmente se o lixo for orgânico ou tóxico. Jogar uma bituca de cigarro pela janela, por exemplo, já causou incêndios florestais gravíssimos. O lixo na pista também pode causar acidentes: um objeto no asfalto pode fazer um motociclista perder o controle ou danificar pneus e suspensão de veículos.",
    legalBase: "Art. 172 CTB",
    incidence: "media",
    difficulty: 3,
  },
  {
    id: "qe47",
    category: "meio-ambiente",
    statement:
      "O excesso de ruídos emitidos por buzinas desreguladas ou alarmes automotivos desordenados nas cidades configura poluição sonora prejudicial à saúde. De acordo com as leis brasileiras, a poluição sonora de trânsito enquadra-se como infração e afeta principalmente:",
    options: [
      "Infração de trânsito que gera estresse e perturbação do sossego público, enquadrando-se como poluição sonora e de convivência social.",
      "Crime ambiental com detenção incondicional do motorista em regime fechado.",
      "Mera conduta de convivência, sem previsão de sanções pecuniárias ou aplicação de pontos na CNH.",
      "Infração média, punida exclusivamente com a apreensão imediata de todo o sistema de som do veículo.",
    ],
    correctIndex: 0,
    explanation:
      "O uso indevido de buzina ou alarmes é infração de trânsito e perturbação do sossego, enquadrada como infração leve ou média dependendo do caso.",
    detailedExplanation:
      "A buzina emite som — portanto, o uso excessivo ou desnecessário gera POLUIÇÃO SONORA, que é um dos tipos de poluição reconhecidos pela legislação ambiental. A poluição sonora causa estresse, perda auditiva, irritabilidade e problemas de saúde. O CTB restringe o uso da buzina a toques breves para advertir sobre risco iminente, sendo proibida em locais como hospitais e escolas, e durante o período noturno (22h às 6h), justamente para controlar esse tipo de poluição.",
    incidence: "media",
    difficulty: 3,
  },
  {
    id: "qe48",
    category: "meio-ambiente",
    statement:
      "A cidadania no trânsito fundamenta-se no respeito mútuo e na convivência pacífica entre os diversos usuários da via. Sobre as premissas de comportamento do condutor cidadão, assinale a afirmativa correta:",
    options: [
      "Priorizar sempre a integridade física dos pedestres e dos veículos não motorizados, agindo com cortesia e tolerância perante erros alheios.",
      "Exigir preferência de passagem sobre veículos menores de carga devido ao maior porte nominal do seu carro de passeio.",
      "Ignorar ciclistas trafegando pelas bordas da via urbana caso não exista ciclovia segregada.",
      "Utilizar a buzina de forma contínua para apressar pedestres idosos que realizam travessia lenta sobre a faixa de segurança.",
    ],
    correctIndex: 0,
    explanation:
      "A cidadania e a lei de trânsito estabelecem que os veículos maiores são sempre responsáveis pela segurança dos menores, e todos pela incolumidade dos pedestres.",
    detailedExplanation:
      "Cidadania no trânsito significa que cada pessoa — motorista, passageiro, ciclista, pedestre — deve agir com RESPEITO MÚTUO, PRUDÊNCIA e RESPONSABILIDADE. O trânsito é um espaço coletivo, onde os direitos e deveres são compartilhados. Priorizar apenas os carros, agir com pressa ou buzinar excessivamente são atitudes opostas à cidadania. Um trânsito seguro e humano depende de cada um fazer a sua parte, protegendo a si mesmo e aos outros.",
    incidence: "alta",
    difficulty: 3,
  },
  {
    id: "qe49",
    category: "mecanica",
    statement:
      "O sistema de lubrificação do motor automotivo é essencial para evitar o atrito metálico direto entre as peças móveis internas. A circulação do motor sob níveis severamente baixos de óleo lubrificante provoca:",
    options: [
      "O superaquecimento excessivo das peças por atrito mecânico, podendo levar à fusão de componentes ('fundir o motor') e quebra estrutural do bloco.",
      "O aumento imediato do consumo de combustível sem qualquer risco de dano mecânico ao bloco do cabeçote.",
      "A diminuição drástica do desgaste das velas de ignição e bobinas elétricas de alta tensão.",
      "O travamento automático das pastilhas de freio do eixo traseiro por falta de pressão hidráulica auxiliar.",
    ],
    correctIndex: 0,
    explanation:
      "A falta de óleo lubrificante impede a refrigeração interna e gera atrito severo, fundindo bronzinas, bielas e pistões devido ao calor extremo.",
    detailedExplanation:
      "O óleo do motor tem a função essencial de lubrificar as peças móveis (pistões, bielas, virabrequim), reduzindo o atrito e dissipando calor. Quando o nível está baixo, a lubrificação é insuficiente, causando atrito excessivo entre as peças metálicas. Isso gera superaquecimento localizado, desgaste prematuro e pode levar à fundição do motor (travamento completo). Verificar o nível do óleo regularmente (com o motor frio e o veículo nivelado) é uma manutenção simples que evita um prejuízo enorme.",
    incidence: "alta",
    difficulty: 3,
  },
  {
    id: "qe50",
    category: "mecanica",
    statement:
      "O tráfego de veículos com pneus cujos sulcos da banda de rodagem apresentam profundidade inferior ao limite legal regulamentado (pneus 'carecas') expõe a segurança viária a riscos graves. Dentre os perigos listados, assinale a opção correta:",
    options: [
      "Perda de aderência em asfalto molhado facilitando a aquaplanagem, aumento drástico da distância de frenagem e risco de estouro do pneu por fadiga estrutural.",
      "Redução do consumo de combustível devido à maior aderência do composto de borracha em curvas fechadas.",
      "Bloqueio espontâneo das rodas dianteiras por fadiga térmica do sistema de suspensão ativa.",
      "Desalinhamento instantâneo do sistema de direção hidráulica devido à menor área de atrito de rolamento.",
    ],
    correctIndex: 0,
    explanation:
      "Pneus carecas (abaixo de 1.6mm de profundidade) perdem a capacidade de escoar água e aderir ao solo, aumentando muito o risco de aquaplanagem e acidentes.",
    detailedExplanation:
      "Pneu careca (com sulcos abaixo de 1,6 mm de profundidade — indicado pelo TWI) perde a capacidade de escoar água em pista molhada. Sem os sulcos, a água forma uma lâmina entre o pneu e o asfalto, causando aquaplanagem. Além disso, a aderência em curvas e frenagens cai drasticamente, aumentando o risco de derrapagens e colisões. Rodar com pneu careca é infração GRAVE e coloca em risco a vida do condutor e dos passageiros.",
    incidence: "altissima",
    difficulty: 3,
  },
  {
    id: "qe51",
    category: "mecanica",
    statement:
      "O sistema de arrefecimento desempenha papel vital no controle térmico de funcionamento do motor de combustão interna. A função técnica primária do fluido de arrefecimento (composto de água desmineralizada e aditivo específico) é:",
    options: [
      "Trocar calor com o motor para manter a temperatura operacional ideal de trabalho do bloco e do cabeçote.",
      "Lubrificar os cilindros e pistões internos para reduzir o atrito gerado pelas bielas.",
      "Aumentar a octanagem da mistura combustível-ar no interior das câmaras de explosão.",
      "Limpar a carbonização depositada nas válvulas de admissão e no coletor de escapamento do veículo.",
    ],
    correctIndex: 0,
    explanation:
      "O sistema de arrefecimento circula líquido pelo motor e radiador para absorver e dissipar o calor gerado pela combustão.",
    detailedExplanation:
      "O líquido de arrefecimento (também chamado de radiador ou coolant) circula pelo motor absorvendo o calor gerado pela combustão e o dissipa no radiador. Sua função é manter o motor na temperatura ideal de funcionamento (cerca de 90°C). Sem ele, o motor superaquece rapidamente, podendo empenar o cabeçote, danificar a junta e até fundir o motor. O nível deve ser verificado no reservatório e o líquido trocado conforme o manual do fabricante.",
    incidence: "media",
    difficulty: 3,
  },
  {
    id: "qe52",
    category: "mecanica",
    statement:
      "Durante o tráfego regular por rodovia, o condutor observa que uma luz indicadora de advertência de cor amarela/laranja acendeu-se de forma contínua no painel de instrumentos do veículo. Sob a ótica da manutenção preventiva, essa sinalização indica:",
    options: [
      "Uma anomalia de funcionamento que necessita de verificação técnica no sistema de injeção ou motor, sem necessidade de parada imediata no acostamento, mas com inspeção breve recomendada.",
      "Um problema crítico e de perigo iminente que exige a parada imediata do veículo na pista de rolamento por falta de pressão de óleo do motor.",
      "A ativação do modo de economia de energia por falha mecânica no alternador elétrico principal.",
      "A indicação de que o veículo entrou na reserva de fluido de freio traseiro ativa.",
    ],
    correctIndex: 0,
    explanation:
      "Luzes amarelas indicam advertência ou falhas não críticas que permitem prosseguir até uma oficina (como anomalias na injeção). Luzes vermelhas exigem parada imediata (óleo, temperatura, bateria).",
    detailedExplanation:
      "As luzes do painel seguem um padrão universal de cores: AMARELA (ou laranja) indica ALERTA — algo precisa ser verificado em breve, mas não exige parada imediata (exemplos: luz de injeção eletrônica, luz de pneu baixo, luz de reserva de combustível). VERMELHA indica PERIGO — o motorista deve parar o veículo assim que possível (exemplos: luz de pressão do óleo, luz de temperatura do motor, luz do freio de estacionamento). Ignorar luzes amarelas pode levar a problemas mais graves.",
    incidence: "alta",
    difficulty: 3,
  },
  {
    id: "qe53",
    category: "mecanica",
    statement:
      "O fluido de freio é o elemento hidráulico responsável por transmitir a força aplicada no pedal até as pinças e tambores de roda. Sob as diretrizes de manutenção preventiva do veículo automotor, o fluido de freio deve ser inspecionado e:",
    options: [
      "Substituído periodicamente conforme prazo do manual do proprietário (geralmente a cada 1 ou 2 anos ou quilometragem equivalente), devido à sua característica higroscópica (absorção de umidade).",
      "Completado semanalmente com água desmineralizada para manter o nível máximo do reservatório plástico.",
      "Substituído apenas se o condutor constatar que o pedal de freio está extremamente rígido e alto.",
      "Trocar somente quando houver mistura acidental com o óleo lubrificante da caixa de marchas.",
    ],
    correctIndex: 0,
    explanation:
      "O fluido de freio absorve umidade do ar ao longo do tempo (higroscópico), o que reduz seu ponto de ebulição e compromete a frenagem. Deve ser trocado periodicamente.",
    detailedExplanation:
      "O fluido de freio é HIGROSCÓPICO, ou seja, absorve a umidade do ar ao longo do tempo. A água no fluido reduz a temperatura de ebulição do sistema de freios — em freadas intensas e prolongadas, o fluido pode ferver, formar bolhas de vapor e fazer o pedal do freio 'ir ao chão' sem travar as rodas (conhecido como 'fadiga do freio'). Por isso, o fabricante recomenda a troca periódica, geralmente a cada 1 ou 2 anos, independentemente do uso.",
    incidence: "media",
    difficulty: 3,
  },
  {
    id: "qe54",
    category: "mecanica",
    statement:
      "A calibragem adequada dos pneus é indispensável para a dirigibilidade, consumo energético e vida útil do composto de borracha. Conforme a engenharia de manutenção de veículos, o procedimento técnico correto de calibragem deve ocorrer:",
    options: [
      "Com os pneus frios (antes de rodar mais do que 3 km), utilizando os valores de pressão nominal recomendados pelo fabricante do veículo.",
      "Com os pneus quentes logo após longas viagens em rodovias, retirando o excesso de pressão gerado pelo calor de atrito.",
      "Utilizando sempre a pressão máxima gravada na banda lateral do pneu, independente da carga útil do automóvel.",
      "Apenas quando o condutor notar visualmente que os flancos do pneu estão encostando na banda de rodagem.",
    ],
    correctIndex: 0,
    explanation:
      "A calibração dos pneus deve ser feita preferencialmente com eles frios para evitar a dilatação do ar pelo calor do movimento, que altera a leitura da pressão real.",
    detailedExplanation:
      "A pressão dos pneus deve ser verificada com os pneus FRIOS (veículo parado por pelo menos 3 horas ou rodado no máximo 1 km). Quando o pneu roda, o atrito com o solo aquece o ar interno, que se expande e aumenta a pressão — a leitura fica falsamente alta. Calibrar com pneu quente resulta em pressão abaixo da recomendada quando os pneus esfriarem. Pressão incorreta causa desgaste irregular, aumenta o consumo de combustível e compromete a segurança.",
    incidence: "alta",
    difficulty: 3,
  },
  {
    id: "qe55",
    category: "prioridade",
    statement:
      "Veículos de emergência, como ambulâncias, viaturas policiais e caminhões do Corpo de Bombeiros, gozam de prerrogativas de trânsito em vias públicas. De acordo com as diretrizes de prioridade de tráfego do CTB, para que gozem de livre circulação, parada e estacionamento, é necessário que:",
    options: [
      "Estejam em efetiva prestação de serviço de urgência, devidamente identificados por dispositivos luminosos intermitentes vermelhos E sonoros (sirene) ligados.",
      "Trafeguem sempre pela faixa de trânsito rápido à esquerda desenvolvendo velocidade acima da média da via.",
      "Sejam de propriedade governamental do Estado, com placas de bronze exclusivas para autoridades municipais.",
      "Possuam autorização por escrito expedida pelo órgão ambiental e de trânsito estadual competentes.",
    ],
    correctIndex: 0,
    explanation:
      "A livre circulação e prioridade de passagem exigem os sinalizadores luminosos E sonoros ligados em serviço de emergência ativo.",
    detailedExplanation:
      "Veículos de emergência (ambulância, polícia, bombeiros) com sirene e giroflex acionados têm prioridade ABSOLUTA sobre todos os demais veículos e pedestres. Eles podem avançar sinais vermelhos, ultrapassar pela direita e exceder limites de velocidade — desde que com cuidado e segurança. Os demais condutores devem facilitar a passagem, encostando o veículo à direita. Se o veículo de emergência estiver sem sinais sonoros e luminosos, perde essa prioridade.",
    legalBase: "Art. 29, VII CTB",
    incidence: "altissima",
    difficulty: 3,
  },
  {
    id: "qe56",
    category: "prioridade",
    statement:
      "Ao se deparar com a aproximação de uma via preferencial devidamente sinalizada por placa R-2 ('Dê a Preferência'), o condutor de um veículo que trafega por uma via secundária deve adotar a seguinte postura regulamentar:",
    options: [
      "Reduzir a velocidade de forma segura, avaliar o fluxo e conceder a preferência de passagem aos veículos que circulam pela via preferencial.",
      "Acelerar o veículo rapidamente para cruzar a interseção antes que os outros carros alcancem o cruzamento.",
      "Buzinar de forma sucessiva para sinalizar a intenção de manter a velocidade linear original no cruzamento.",
      "Parar obrigatoriamente de forma completa o veículo mesmo que não haja qualquer tráfego na via transversal.",
    ],
    correctIndex: 0,
    explanation:
      "Diferente da placa PARE (R-1, parada obrigatória), a placa Dê a Preferência (R-2) exige redução e cessão de preferência, mas não exige parada completa se a via transversal estiver livre.",
    detailedExplanation:
      "Quando um veículo que está em via secundária (menos movimentada, geralmente sem sinalização de preferência) deseja entrar em uma via preferencial (principal, mais larga ou mais movimentada), ele DEVE dar passagem aos veículos que já estão circulando na via preferencial. A via preferencial tem prioridade de passagem. Quem entra deve reduzir, parar se necessário, e só entrar quando houver espaço seguro, sem forçar a passagem.",
    incidence: "alta",
    difficulty: 3,
  },
  {
    id: "qe57",
    category: "prioridade",
    statement:
      "Em um trecho de declive de via montanhosa estreita e sem pavimentação, aproximam-se simultaneamente dois veículos pesados em sentidos opostos, não sendo possível a passagem de ambos ao mesmo tempo. Conforme as regras de preferência do CTB, a preferência de passagem pertence ao veículo que:",
    options: [
      "Estiver em aclive (subindo) a ladeira, devendo o condutor do veículo que desce dar a preferência de passagem.",
      "Trafegar no sentido de descida da ladeira, por estar desenvolvendo maior energia cinética linear.",
      "Sinalizar a intenção de manobra primeiro acionando o pisca-alerta ou buzina de forma prolongada.",
      "Apresentar menor capacidade de tração mecânica nominal ou peso bruto total inferior.",
    ],
    correctIndex: 0,
    explanation:
      "Em vias estreitas com aclives e declives, a preferência de passagem é do veículo que está subindo. O veículo que desce deve dar passagem (ou dar marcha ré se necessário).",
    detailedExplanation:
      "Em ladeiras estreitas onde não é possível a passagem simultânea de dois veículos, quem SOBE tem preferência sobre quem DESCE. A lógica é de segurança: engatar a ré em uma subida para dar passagem é muito mais difícil e perigoso do que em uma descida, pois o condutor tem menos visibilidade e controle. O veículo que desce deve manobrar para trás até um local onde o veículo que sobe possa passar com segurança.",
    legalBase: "Art. 29, III, 'e' CTB",
    incidence: "media",
    trap: true,
    difficulty: 3,
  },
  {
    id: "qe58",
    category: "prioridade",
    statement:
      "Ao compartilhar a via pública com ciclistas e pedestres, o condutor de um automóvel deve seguir as regras de conduta estabelecidas no CTB. Sobre o respeito às bicicletas e pessoas a pé, constitui atitude tecnicamente correta:",
    options: [
      "Manter a distância lateral mínima de 1,5 metros ao ultrapassar uma bicicleta e reduzir a velocidade para garantir a segurança viária.",
      "Buzinar continuamente ao lado do ciclista para alertá-lo sobre a aproximação veloz do veículo automotor.",
      "Avançar o veículo para a borda da pista para forçar a bicicleta a subir na calçada destinada exclusivamente a pedestres.",
      "Ignorar a travessia de pedestres em locais sem faixa de segurança, mantendo a velocidade máxima permitida da via.",
    ],
    correctIndex: 0,
    explanation:
      "O CTB exige distância lateral mínima de 1,5 metros ao ultrapassar ciclistas (Art. 201) e redução de velocidade para garantir a segurança.",
    detailedExplanation:
      "O CTB estabelece que os usuários mais vulneráveis da via têm PRIORIDADE: pedestres, ciclistas e pessoas com mobilidade reduzida. Isso significa que o condutor de veículo motorizado deve redobrar a atenção, reduzir a velocidade e dar passagem a eles. O Código é claro: 'os pedestres que estiverem atravessando a via sobre as faixas terão prioridade' e 'nenhum condutor pode colocar em risco a segurança dos pedestres'. A hierarquia coloca a vida acima da fluidez do trânsito.",
    incidence: "alta",
    difficulty: 3,
  },
  {
    id: "qe59",
    category: "legislacao",
    statement:
      "Um condutor ignora deliberadamente a sinalização vertical de regulamentação representada pela placa R-1 ('PARADA OBRIGATÓRIA') e avança em uma interseção urbana sem parar o automóvel. De acordo com as penalidades regulamentares do CTB, tal infração classifica-se como:",
    options: [
      "Infração de natureza gravíssima, punida com multa administrativa pecuniária e acúmulo de 7 pontos na CNH.",
      "Infração grave, gerando a medida administrativa de retenção do veículo até a vistoria do agente fiscalizador.",
      "Infração média, passível de perdão automático caso o cruzamento estivesse livre de outros veículos.",
      "Crime de trânsito de lesão potencial à segurança viária coletiva, com suspensão direta da habilitação por 3 meses.",
    ],
    correctIndex: 0,
    explanation:
      "Avançar o sinal de parada obrigatória (placa PARE) constitui infração gravíssima nos termos do Art. 208 do CTB.",
    detailedExplanation:
      "Avançar a parada obrigatória imposta pela placa PARE (R-1) sem parar o veículo completamente é infração GRAVÍSSIMA, com 7 pontos na CNH e multa. A placa PARE exige PARADA TOTAL, não apenas redução de velocidade. Mesmo que não haja veículos se aproximando, o condutor deve parar antes da faixa de retenção, observar o trânsito e só então prosseguir. É uma das infrações mais cobradas nas provas do DETRAN e também uma das mais perigosas no dia a dia.",
    legalBase: "Art. 208 CTB",
    incidence: "alta",
    difficulty: 3,
  },
  {
    id: "qe60",
    category: "direcao-defensiva",
    statement:
      "Ao conduzir um veículo automotor em um declive acentuado e de longa extensão em uma rodovia, o condutor constata a necessidade de controlar a velocidade para evitar o superaquecimento do sistema de freios por atrito. Considerando as técnicas de Direção Defensiva e as normas do Código de Trânsito Brasileiro, assinale a conduta CORRETA a ser adotada:",
    options: [
      "Engrenar a marcha neutra (ponto morto) para permitir que a força da gravidade atue livremente, acionando o freio de serviço intermitentemente para poupar o sistema hidráulico.",
      "Transitar com o veículo desengrenado em declive, visando a economia de combustível, efetuando frenagens bruscas apenas quando a velocidade ultrapassar o limite da via.",
      "Manter o veículo engrenado em marcha reduzida, utilizando a compressão do motor como freio-motor para auxiliar na retenção da velocidade de forma segura.",
      "Manter o pedal do freio continuamente pressionado ao longo de toda a descida, mantendo uma marcha alta engatada para evitar que o motor atinja rotações elevadas.",
    ],
    correctIndex: 2,
    explanation:
      "Em descidas longas, deve-se usar o freio motor (veículo engrenado). Descer em ponto morto ou usar apenas o freio de serviço aquece demais as pastilhas/discos, podendo causar perda de frenagem por 'fading'.",
    detailedExplanation:
      "Em descidas longas, o correto é utilizar o FREIO MOTOR: engate uma marcha reduzida (2ª ou 3ª, dependendo da inclinação) e deixe o próprio motor segurar a velocidade, usando o freio de serviço apenas pontualmente para corrigir a velocidade. Pisar continuamente no freio superaquece o sistema, podendo causar 'fading' (perda de eficiência) ou até falha total dos freios. Descer em ponto morto (banguela) é PROIBIDO (infração média) e tira o controle do veículo.",
    legalBase: "Art. 231, IX do CTB",
    incidence: "altissima",
    trap: true,
    difficulty: 3,
  },
  {
    id: "qe61",
    category: "infracoes",
    statement:
      "O ato de transitar com o veículo automotor desligado ou desengatado (em ponto morto ou 'banguela') em declives acentuados é uma conduta insegura comum. Sob a regulamentação do Código de Trânsito Brasileiro (CTB), essa conduta constitui:",
    options: [
      "Infração de trânsito de natureza média, punida com multa e medida administrativa de retenção do veículo.",
      "Infração leve, gerando apenas aplicação de pontuação administrativa se o veículo estiver licenciado.",
      "Infração grave, gerando suspensão da validade do licenciamento do veículo por cento e vinte dias.",
      "Conduta permitida pela lei de trânsito como medida ecológica para diminuição de queima de hidrocarbonetos.",
    ],
    correctIndex: 0,
    explanation:
      "Transitar em declives com o veículo desengatado ou desligado é infração média (Art. 231, IX do CTB) com multa e retenção do veículo.",
    detailedExplanation:
      "Dirigir o veículo em 'banguela' — com o motor desligado ou em ponto morto durante descidas — é infração MÉDIA, com 4 pontos na CNH e multa. A prática é perigosa porque, em ponto morto, o condutor perde o freio motor e depende exclusivamente do freio de serviço, que pode superaquecer e falhar. Além disso, o veículo fica mais difícil de controlar em curvas e emergências. A marcha deve estar sempre engatada enquanto o veículo estiver em movimento.",
    legalBase: "Art. 231, IX do CTB",
    incidence: "alta",
    difficulty: 3,
  },
  {
    id: "qe62",
    category: "legislacao",
    statement:
      "Durante o período de validade probatória de 12 meses da Permissão para Dirigir (PPD), o condutor novato comete uma infração de trânsito de natureza gravíssima. Conforme a regra de concessão de CNH definitiva contida no CTB, o resultado legal desse ato é:",
    options: [
      "A perda do processo de habilitação, sendo o condutor obrigado a reiniciar todas as etapas e exames de trânsito do zero.",
      "A conversão da multa em advertência verbal pedagógica com permissão de nova chance caso pague o valor com desconto.",
      "O desconto simples na pontuação de habilitação definitiva para CNH caso ele realize um curso de reciclagem rápido.",
      "A suspensão temporária do direito de dirigir por sessenta dias contados a partir da notificação administrativa.",
    ],
    correctIndex: 0,
    explanation:
      "Se o portador da PPD cometer infração grave, gravíssima ou reincidir em média, ele perde a habilitação provisória e precisa reiniciar todo o processo do zero.",
    detailedExplanation:
      "O condutor que comete uma infração GRAVÍSSIMA durante o período da Permissão para Dirigir (PPD) PERDE o direito de obter a CNH definitiva. Ele terá que REINICIAR todo o processo de habilitação — fazer novamente as aulas teóricas, prova teórica, aulas práticas e exame prático. O mesmo vale se cometer infração GRAVE (5 pontos) ou for reincidente em infração MÉDIA. A PPD é um período probatório que exige do condutor novato um comportamento exemplar no trânsito.",
    legalBase: "Art. 148 CTB",
    incidence: "alta",
    trap: true,
    difficulty: 3,
  },
  {
    id: "qe63",
    category: "legislacao",
    statement:
      "As regras para transporte seguro de crianças menores de 10 anos em veículos automotores foram atualizadas pela legislação nacional. O uso obrigatório do dispositivo de retenção denominado 'assento de elevação' destina-se a:",
    options: [
      "Crianças com idade superior a 4 anos e até 7 anos e meio, ou que tenham altura inferior a 1,45 metros.",
      "Bebês de até 1 ano de idade ou com peso bruto total inferior a 9 kg corporais.",
      "Crianças de 1 a 4 anos de idade posicionadas de frente para o sentido de deslocamento.",
      "Qualquer criança com menos de 12 anos independente de sua estatura física ou peso correspondente.",
    ],
    correctIndex: 0,
    explanation:
      "O assento de elevação é obrigatório para crianças de 4 a 7 anos e meio, ou até atingirem 1,45m de altura (quando passam a poder usar apenas o cinto de três pontos no banco traseiro).",
    detailedExplanation:
      "A Resolução CONTRAN 819/2021 determina que crianças com ATÉ 10 ANOS de idade ou com altura inferior a 1,45 metro devem utilizar dispositivo de retenção adequado (bebê conforto, cadeirinha ou assento de elevação) no BANCO TRASEIRO. A regra anterior era de 7 anos e meio — a lei ampliou a proteção. Crianças acima de 10 anos ou com mais de 1,45 m podem usar o cinto de segurança do banco traseiro. Transportar criança em desacordo com a regra é infração gravíssima.",
    incidence: "altissima",
    difficulty: 3,
  },
  {
    id: "qe64",
    category: "direcao-defensiva",
    statement:
      "Ao conduzir seu veículo em rodovia de pista única em período noturno, o condutor depara-se com a luz alta de um veículo em sentido contrário, resultando em ofuscamento ocular temporário. Sob as premissas da condução defensiva, a atitude correta para evitar um sinistro é:",
    options: [
      "Desviar o olhar ligeiramente para a linha de bordo branca da direita da rodovia e reduzir a velocidade de forma progressiva e segura.",
      "Ligar o farol alto de seu próprio veículo para forçar o outro condutor a baixar as luzes imediatamente.",
      "Fechar os olhos por frações de segundos sucessivas para permitir a regeneração da retina afetada.",
      "Acionar imediatamente as luzes do pisca-alerta e efetuar parada brusca sobre a faixa de rolamento da pista.",
    ],
    correctIndex: 0,
    explanation:
      "Em caso de ofuscamento, deve-se olhar para a margem direita da via (linha de bordo) e diminuir a velocidade, evitando revidar o farol alto.",
    detailedExplanation:
      "Quando um veículo em sentido contrário se aproxima com farol alto e ofusca a visão, o condutor NUNCA deve olhar diretamente para o farol — isso causa cegueira temporária que pode durar vários segundos. O correto é DESVIAR O OLHAR para a margem DIREITA da pista (ou para a linha de bordo) e reduzir a velocidade. Isso mantém a visão periférica ativa sem ser ofuscado. Também deve-se piscar o farol rapidamente para alertar o outro motorista.",
    incidence: "alta",
    difficulty: 3,
  },
  {
    id: "qe65",
    category: "direcao-defensiva",
    statement:
      "O uso do dispositivo luminoso de pisca-alerta (luzes de advertência intermitentes) é regulamentado de forma restrita pelo CTB. O motorista está autorizado a ligar o pisca-alerta do veículo em movimento apenas quando:",
    options: [
      "Em situações de emergência com o veículo imobilizado ou em movimento lento sob forte neblina, ou quando a sinalização da via expressamente determinar.",
      "Desejar realizar estacionamento rápido em local proibido (vaga de carga e descarga) para efetuar compras rápidas.",
      "Transitar em velocidade acima do limite da via para indicar urgência pessoal no fluxo urbano.",
      "Cruzar cruzamentos sinalizados com placas de parada obrigatória em período noturno silencioso.",
    ],
    correctIndex: 0,
    explanation:
      "O pisca-alerta deve ser usado com o veículo imobilizado em situações de emergência ou em movimento sob condições muito específicas (neblina/chuva forte) ou se determinado por sinalização.",
    detailedExplanation:
      "O pisca-alerta (quatro setas piscando simultaneamente) só deve ser acionado quando o veículo estiver IMOVILIZADO em situação de EMERGÊNCIA ou que ofereça RISCO — por exemplo, pane mecânica, acidente ou necessidade de parada no acostamento. Usar o pisca-alerta com o veículo em movimento é PROIBIDO e pode causar acidentes, pois os outros motoristas podem interpretar que você está parado ou reduzindo bruscamente. Em chuva forte, deve-se usar farol baixo ou de neblina, NÃO o pisca-alerta.",
    legalBase: "Art. 251 CTB",
    incidence: "alta",
    trap: true,
    difficulty: 3,
  },
  {
    id: "qe66",
    category: "infracoes",
    statement:
      "Um motorista decide trafegar com o automóvel no sentido contrário ao fluxo de uma via urbana sinalizada com sentido único de circulação. De acordo com o Art. 186 do Código de Trânsito Brasileiro, essa conduta constitui:",
    options: [
      "Infração de trânsito de natureza gravíssima, punida com multa pecuniária e acúmulo de 7 pontos na CNH.",
      "Infração grave, gerando retenção imediata do veículo para fins de remoção ao pátio oficial.",
      "Infração média, passível de perdão de pontos caso o condutor comprove desconhecimento geográfico do local.",
      "Crime de trânsito contra a incolumidade viária pública, punido com apreensão definitiva do veículo.",
    ],
    correctIndex: 0,
    explanation:
      "Transitar pela contramão em vias com sinalização de sentido único de circulação é infração gravíssima.",
    detailedExplanation:
      "Trafegar na contramão de direção é infração GRAVÍSSIMA, com 7 pontos na CNH e multa. A contramão é extremamente perigosa porque o veículo se desloca no sentido oposto ao fluxo normal, gerando risco iminente de colisão frontal — uma das mais letais. Dependendo das circunstâncias (em vias de alta velocidade, pontes ou túneis), pode também configurar crime de trânsito se houver perigo. Atenção especial para conversões: entrar na contramão ao sair de um estacionamento também conta.",
    legalBase: "Art. 186 CTB",
    incidence: "alta",
    difficulty: 3,
  },
  {
    id: "qe67",
    category: "infracoes",
    statement:
      "O condutor de um veículo envolve-se em acidente de trânsito no qual há vítimas corporais visivelmente necessitadas de socorro imediato. Tendo condições seguras de agir, o motorista decide evadir-se do local sem prestar socorro ou chamar a equipe de resgate. Sob as regras do CTB, essa evasão constitui:",
    options: [
      "Infração gravíssima de trânsito e, simultaneamente, crime de trânsito tipificado pelo Art. 135 do Código Penal e Art. 304 do CTB.",
      "Apenas infração de conduta de trânsito de natureza grave de responsabilidade financeira do proprietário.",
      "Infração de trânsito média, punida exclusivamente com multa pecuniária simples se o condutor não for reincidente.",
      "Fato atípico administrativo sob o ponto de vista das multas se as vítimas forem socorridas por outros motoristas.",
    ],
    correctIndex: 0,
    explanation:
      "Deixar de prestar ou providenciar socorro a vítimas de acidente é infração gravíssima (com fator multiplicador 5) e também configura crime de trânsito.",
    detailedExplanation:
      "Deixar de prestar socorro a uma vítima de acidente, quando o condutor podia fazê-lo sem risco pessoal, configura CRIME de trânsito previsto no art. 304 do CTB, com detenção de 6 meses a 1 ano e multa, além da suspensão da CNH. A omissão de socorro é crime mesmo que o condutor não tenha causado o acidente. Se o condutor CAUSOU o acidente e foge sem prestar socorro, a pena é maior (6 meses a 3 anos). Chamar o resgate (SAMU 192) já configura prestação de socorro.",
    legalBase: "Art. 304 CTB",
    incidence: "alta",
    difficulty: 3,
  },
  {
    id: "qe68",
    category: "primeiros-socorros",
    statement:
      "Ao realizar a avaliação inicial de uma vítima inconsciente de colisão de trânsito, o socorrista constata a ausência completa de movimentos torácicos (respiração) e ausência de pulsação palpável (parada cardiorrespiratória). Qual o procedimento emergencial de suporte de vida a ser iniciado imediatamente?",
    options: [
      "Executar manobras de Reanimação Cardiopulmonar (RCP) com compressões torácicas contínuas a uma frequência de 100 a 120 por minuto.",
      "Tentar reanimar a vítima oferecendo líquidos mornos ou aplicando compressas frias em sua testa.",
      "Colocar a vítima sentada com a cabeça inclinada para a frente e massagear vigorosamente as articulações dos ombros.",
      "Realizar respiração boca-a-boca contínua por dez minutos antes de iniciar qualquer tipo de massagem no peito.",
    ],
    correctIndex: 0,
    explanation:
      "Em parada cardiorrespiratória, deve-se iniciar a RCP imediatamente com compressões torácicas profundas (5 a 6 cm) e rápidas (100 a 120/min).",
    detailedExplanation:
      "Na parada cardiorrespiratória (PCR), cada segundo conta para manter o sangue oxigenado chegar ao cérebro. A RCP (Reanimação Cardiopulmonar) deve ser iniciada imediatamente: 30 compressões torácicas fortes e rápidas (100 a 120 por minuto, afundando o peito 5 a 6 cm), seguidas de 2 ventilações de resgate se o socorrista tiver treinamento. Se não tiver treinamento ou não quiser fazer ventilações, apenas as compressões contínuas já ajudam. A manobra de Heimlich é para engasgo, não para PCR.",
    incidence: "alta",
    difficulty: 3,
  },
  {
    id: "qe69",
    category: "meio-ambiente",
    statement:
      "A inspeção técnica veicular periódica é um procedimento regulamentado de segurança automotiva. O objetivo principal do programa oficial de inspeção técnica de segurança e de emissões de poluentes é:",
    options: [
      "Garantir as condições mecânicas de segurança ativa/passiva do veículo e verificar o atendimento aos limites legais de emissão de gases e ruídos.",
      "Determinar o valor de mercado atualizado do veículo para tributação anual de impostos estaduais.",
      "Substituir de forma preventiva todas as peças que completaram mais de 50.000 quilômetros de tráfego regular.",
      "Validar se o proprietário efetuou o pagamento das parcelas restantes de financiamento bancário.",
    ],
    correctIndex: 0,
    explanation:
      "A inspeção técnica visa garantir a segurança de tráfego do veículo e controlar as emissões poluentes e sonoras para proteção ambiental.",
    detailedExplanation:
      "A inspeção veicular (obrigatória em alguns estados) tem como principal objetivo verificar as CONDIÇÕES DE SEGURANÇA do veículo (freios, pneus, suspensão, faróis, para-brisa, cinto de segurança) e o CONTROLE DE EMISSÕES de poluentes. O intuito é garantir que os veículos em circulação não ofereçam riscos aos ocupantes nem ao meio ambiente. Não é um imposto — é uma medida de segurança e proteção ambiental que salva vidas e reduz a poluição do ar.",
    incidence: "media",
    difficulty: 3,
  },
  {
    id: "qe70",
    category: "mecanica",
    statement:
      "Antes de iniciar uma viagem de longa distância com o veículo automotor por rodovias estaduais, qual o procedimento preventivo de segurança mais adequado a ser adotado pelo condutor?",
    options: [
      "Verificar o nível de fluidos (óleo do motor, líquido de arrefecimento e freio), inspecionar o funcionamento das luzes, calibrar os pneus (inclusive o estepe) e checar os equipamentos obrigatórios (triângulo, macaco e chave de roda).",
      "Substituir de forma compulsória todo o fluido da direção hidráulica e os amortecedores dianteiros do veículo.",
      "Lavar o motor do veículo com jato de água sob pressão e aplicar produtos lubrificantes à base de petróleo nas mangueiras.",
      "Calibrar todos os pneus com o dobro da pressão nominal recomendada para compensar o peso das bagagens.",
    ],
    correctIndex: 0,
    explanation:
      "A inspeção preventiva básica antes de viajar envolve nível de óleos/líquidos, iluminação, pneus/estepe e equipamentos de sinalização e troca.",
    detailedExplanation:
      "Antes de qualquer viagem, o condutor prudente realiza um CHECKLIST de segurança: calibragem e estado dos pneus (inclusive estepe), nível do óleo do motor, nível do líquido de arrefecimento, funcionamento dos freios, faróis e lanternas, nível do fluido de freio e do lavador do para-brisa, e a documentação (CNH e CRLV). Essa verificação preventiva reduz drasticamente o risco de panes, acidentes e multas durante a viagem.",
    incidence: "alta",
    difficulty: 3,
  },
  {
    id: "qe71",
    category: "legislacao",
    statement:
      "Ao trafegar com veículo automotor de passeio por uma via urbana classificada como 'local', desprovida de qualquer placa de sinalização de velocidade máxima, qual o limite máximo de velocidade que o condutor deve respeitar por imposição legal do CTB?",
    options: [
      "30 km/h, por se tratar de via destinada a fluxos locais e residenciais de curta distância.",
      "40 km/h, limite padrão aplicável a vias coletoras urbanas sem semáforo.",
      "60 km/h, limite aplicável a vias arteriais urbanas de tráfego rápido.",
      "80 km/h, velocidade regulamentar geral para qualquer rodovia pavimentada federal.",
    ],
    correctIndex: 0,
    explanation:
      "O CTB define velocidade máxima de 30 km/h para vias locais não sinalizadas (Art. 61).",
    detailedExplanation:
      "Em vias urbanas SEM sinalização de velocidade, o CTB estabelece limites MÁXIMOS padrão: VIA LOCAL (ruas residenciais, baixo fluxo): 30 km/h; VIA COLETORA (distribui o tráfego entre bairros): 40 km/h; VIA ARTERIAL (grandes avenidas com semáforos): 60 km/h; VIA DE TRÂNSITO RÁPIDO (pistas expressas sem cruzamentos em nível): 80 km/h. Esses limites existem porque cada tipo de via tem características diferentes de fluxo, travessia de pedestres e risco de acidentes.",
    legalBase: "Art. 61 CTB",
    incidence: "altissima",
    difficulty: 3,
  },
  {
    id: "qe72",
    category: "legislacao",
    statement:
      "Em uma rodovia de pista dupla em trecho rural, um motorista conduz um automóvel de passeio. Na ausência de placas de regulamentação de velocidade na via, qual a velocidade máxima permitida por lei para esse veículo?",
    options: [
      "110 km/h, limite padrão estabelecido pelo CTB para automóveis, caminhonetas e motocicletas em pistas duplas.",
      "90 km/h, limite geral para qualquer veículo de carga ou de transporte coletivo de passageiros.",
      "100 km/h, velocidade padrão para pistas simples e estradas não pavimentadas.",
      "120 km/h, velocidade máxima permitida em rodovias federais sob concessão privada.",
    ],
    correctIndex: 0,
    explanation:
      "Em rodovias de pista dupla não sinalizadas, o limite para automóveis, caminhonetas e motocicletas é de 110 km/h (Art. 61, § 1º, I, 'a' do CTB).",
    detailedExplanation:
      "Em rodovias sem sinalização de velocidade, os limites padrão variam conforme o tipo de veículo: AUTOMÓVEIS, camionetas e motocicletas: 110 km/h; ÔNIBUS e caminhões: 90 km/h; DEMAIS veículos (reboque, cargas especiais): 80 km/h. Já em ESTRADAS (não pavimentadas/rurals), o limite cai para 60 km/h para automóveis. Esses limites refletem a capacidade de frenagem e estabilidade de cada tipo de veículo.",
    legalBase: "Art. 61 CTB",
    incidence: "alta",
    difficulty: 3,
  },
  {
    id: "qe73",
    category: "legislacao",
    statement:
      "O Código de Trânsito Brasileiro classifica as vias terrestres em urbanas e rurais, dividindo estas últimas em rodovias e estradas. No que se refere especificamente às 'estradas' (vias rurais não pavimentadas), qual o limite máximo de velocidade padrão estabelecido na ausência de sinalização?",
    options: [
      "60 km/h para todos os tipos de veículos automotores.",
      "80 km/h para veículos leves e 60 km/h para veículos pesados articulados.",
      "90 km/h exclusivamente para motocicletas e caminhonetas de carga leve.",
      "50 km/h, limite imposto por razões de falta de asfalto e perigo de derrapagem.",
    ],
    correctIndex: 0,
    explanation:
      "Nas estradas (vias rurais não pavimentadas), a velocidade máxima padrão estabelecida pelo CTB é de 60 km/h para todos os veículos (Art. 61, § 1º, II).",
    detailedExplanation:
      "O CTB diferencia RODOVIA (via pavimentada) de ESTRADA (via rural não pavimentada). Em estradas sem sinalização, o limite máximo é de 60 km/h para automóveis, camionetas e motocicletas, e 30 km/h para os demais veículos. Estradas não pavimentadas têm menor aderência, mais irregularidades, pedras soltas e buracos — trafegar em velocidade elevada nessas condições perde o controle do veículo com muito mais facilidade.",
    legalBase: "Art. 61 CTB",
    incidence: "alta",
    difficulty: 3,
  },
  {
    id: "qe74",
    category: "direcao-defensiva",
    statement:
      "Sob neblina ou cerração densa que compromete severamente a visibilidade em rodovias, qual o procedimento técnico correto de iluminação e conduta defensiva a ser adotado pelo motorista?",
    options: [
      "Acender os faróis baixos (luz baixa) ou faróis de neblina se houver, reduzir a velocidade de forma progressiva e manter distância segura do veículo à frente.",
      "Ligar o farol alto de forma fixa para tentar furar a barreira de gotículas suspensas no ar.",
      "Ativar as luzes de pisca-alerta do veículo em movimento acelerado para destacar a posição física na pista.",
      "Transitar apenas com as luzes de posição (faroletes) e manter a velocidade nominal da rodovia.",
    ],
    correctIndex: 0,
    explanation:
      "Em neblina, deve-se usar luz baixa ou faróis de neblina. Farol alto reflete nas gotículas e piora a visibilidade (efeito parede branca).",
    detailedExplanation:
      "Em neblina densa, o farol ALTO é prejudicial — ele reflete nas gotículas de água suspensas no ar e forma uma 'parede branca' que ofusca o próprio condutor e reduz ainda mais a visibilidade. O correto é usar o FAROL BAIXO, de preferência com o farol de NEBLINA dianteiro (que projeta a luz para baixo e para os lados, sem refletir). O pisca-alerta com o veículo em movimento é PROIBIDO e perigoso, pois os outros motoristas podem achar que você está parado.",
    incidence: "alta",
    trap: true,
    difficulty: 3,
  },
  {
    id: "qe75",
    category: "infracoes",
    statement:
      "Um motorista imobiliza seu veículo sobre a calçada (passeio público) destinada à circulação de pedestres para realizar um desembarque rápido de bagagens. Conforme a regulamentação administrativa de estacionamento prevista no CTB, tal ato constitui:",
    options: [
      "Infração de trânsito de natureza grave, punida com multa pecuniária e medida administrativa de remoção do veículo.",
      "Infração leve, passível apenas de advertência oral se o motorista permanecer no interior do automóvel.",
      "Infração média de trânsito de responsabilidade civil do pedestre prejudicado.",
      "Crime de trânsito de ocupação de passeio público com detenção preventiva de 15 a 30 dias.",
    ],
    correctIndex: 0,
    explanation:
      "Estacionar o veículo sobre calçadas, faixas de pedestres, ciclovias ou gramados é infração grave (Art. 181, VIII do CTB) com multa e remoção do veículo.",
    detailedExplanation:
      "Estacionar sobre a calçada (passeio público) é infração GRAVE, com 5 pontos na CNH e multa. A calçada é espaço exclusivo dos pedestres — estacionar sobre ela obriga o pedestre a descer para a rua para contornar o veículo, colocando em risco sua segurança. Pessoas com deficiência visual, cadeirantes e pais com carrinhos de bebê são especialmente prejudicados. O respeito à calçada é uma questão de cidadania e acessibilidade.",
    legalBase: "Art. 181, VIII CTB",
    incidence: "media",
    difficulty: 3,
  },
  {
    id: "qe76",
    category: "infracoes",
    statement:
      "Durante fiscalização de trânsito, constata-se que os ocupantes do banco traseiro de um veículo de passeio não estão utilizando os cintos de segurança obrigatórios. De acordo com o Código de Trânsito Brasileiro, a autuação e a responsabilidade da multa recaem sobre:",
    options: [
      "O condutor do veículo, sendo a infração classificada como de natureza grave e sujeita a multa e retenção do veículo.",
      "Os passageiros individualmente, visto que são maiores de idade e responsáveis diretos pelos seus atos civis.",
      "O proprietário do veículo apenas se ele estivesse presente no habitáculo no momento da abordagem.",
      "Tanto o condutor quanto os passageiros de forma solidária em multas fiscais municipais separadas.",
    ],
    correctIndex: 0,
    explanation:
      "Deixar de usar o cinto de segurança (motorista ou passageiro em qualquer assento) é infração grave com multa imputada ao condutor (responsável pela segurança do veículo em movimento).",
    detailedExplanation:
      "O cinto de segurança é obrigatório para TODOS os ocupantes do veículo — inclusive nos bancos traseiros. E a RESPONSABILIDADE pela infração é do CONDUTOR, mesmo que o passageiro adulto seja quem optou por não usar o cinto. A infração é GRAVE, 5 pontos e multa. Em caso de colisão, um passageiro sem cinto no banco traseiro pode ser arremessado contra o banco da frente, ferindo também os ocupantes dianteiros. O cinto traseiro salva vidas.",
    incidence: "alta",
    difficulty: 3,
  },
  {
    id: "qe77",
    category: "direcao-defensiva",
    statement:
      "Um motorista ingere uma pequena dose de bebida alcoólica (equivalente a uma lata de cerveja) antes de assumir a direção de um veículo automotor. Sob o rigor da legislação da Lei Seca no Brasil (tolerância zero), essa conduta sujeita o motorista a:",
    options: [
      "Multa administrativa gravíssima multiplicada por dez vezes, suspensão do direito de dirigir por 12 meses e medida administrativa de retenção do veículo.",
      "Advertência por escrito e permissão de dirigir caso o teste acuse nível abaixo de 0,34 mg/L de ar alveolar.",
      "Infração leve, punida com multa simples sem qualquer medida administrativa ou suspensão de documentos.",
      "Crime de trânsito direto, independentemente da concentração de álcool por litro de sangue.",
    ],
    correctIndex: 0,
    explanation:
      "Qualquer concentração de álcool constatada em fiscalização configura infração gravíssima multiplicada por 10, com suspensão da CNH por 12 meses e retenção do veículo (Art. 165 do CTB).",
    detailedExplanation:
      "A Lei Seca (Lei 11.705/2008) estabelece TOLERÂNCIA ZERO para álcool ao dirigir. Qualquer quantidade detectável configura infração GRAVÍSSIMA, com multa multiplicada por 10, suspensão da CNH por 12 meses e recolhimento do documento. Acima de 0,34 mg/L de ar expirado no bafômetro, também configura CRIME de trânsito (art. 306 CTB), com detenção de 6 meses a 3 anos. Não existe 'quantidade segura' de álcool para dirigir — mesmo uma lata de cerveja já altera os reflexos.",
    incidence: "altissima",
    trap: true,
    difficulty: 3,
  },
  {
    id: "qe78",
    category: "primeiros-socorros",
    statement:
      "Uma pessoa adulta consciente apresenta um quadro de obstrução total de vias aéreas por alimento (engasgo severo), demonstrando incapacidade de falar ou tossir e levando as mãos ao pescoço. Qual a manobra de primeiros socorros indicada para desobstruir as vias aéreas?",
    options: [
      "Manobra de Heimlich, realizando compressões abdominais rápidas e firmes para dentro e para cima, logo acima do umbigo da vítima.",
      "Deitar a vítima em posição lateral de segurança e realizar respiração boca-a-boca com forte sopro pulmonar.",
      "Forçar a vítima a ingerir pão seco ou grandes volumes de água morna para empurrar o objeto para o esôfago.",
      "Efetuar golpes secos e fortes na nuca da vítima com ela em posição sentada.",
    ],
    correctIndex: 0,
    explanation:
      "A manobra de Heimlich (compressões subdiafragmáticas) é a técnica padrão para desobstrução de vias aéreas em adultos conscientes.",
    detailedExplanation:
      "O engasgo por obstrução das vias aéreas em adulto CONSCIENTE é tratado com a MANOBRA DE HEIMLICH: o socorrista posiciona-se atrás da vítima, envolve-a com os braços, coloca o punho fechado acima do umbigo e abaixo do esterno, e realiza compressões rápidas para dentro e para cima. O objetivo é expulsar o objeto da traqueia. Se a vítima estiver INCONSCIENTE, inicia-se RCP. A manobra de Heimlich NÃO se aplica a bebês menores de 1 ano — nesse caso, usa-se tapas nas costas e compressões torácicas.",
    incidence: "media",
    difficulty: 3,
  },
  {
    id: "qe79",
    category: "meio-ambiente",
    statement:
      "Um motociclista realiza modificações no escapamento original de sua motocicleta instalando um silenciador esportivo aberto que emite ruídos acima dos limites legais permitidos. Sob as normas administrativas de segurança viária do CTB, essa conduta configura:",
    options: [
      "Infração de trânsito de natureza grave, sujeita a multa administrativa e medida administrativa de retenção da motocicleta para regularização.",
      "Infração de trânsito média, punida apenas com multa sem qualquer previsão de retenção física do veículo.",
      "Crime contra o meio ambiente urbano com recolhimento imediato do documento de habilitação.",
      "Infração gravíssima, gerando cassação definitiva do direito de dirigir motocicletas por dois anos.",
    ],
    correctIndex: 0,
    explanation:
      "Conduzir veículo com descarga livre ou silenciador de motor de explosão defeituoso/inoperante é infração grave (Art. 230, XI do CTB) com retenção para regularização.",
    detailedExplanation:
      "Transitar com escapamento adulterado ou aberto (descarga livre) é infração GRAVE, com 5 pontos na CNH e multa, além de medida administrativa de retenção do veículo para regularização. O escapamento adulterado aumenta a emissão de ruídos (poluição sonora) e, dependendo da alteração, pode também aumentar a emissão de poluentes. Além da multa, o condutor pode ser enquadrado por perturbação do sossego público. A manutenção do escapamento original é obrigação do proprietário.",
    legalBase: "Art. 230, IX CTB",
    incidence: "media",
    difficulty: 3,
  },
  {
    id: "qe80",
    category: "mecanica",
    statement:
      "Durante fiscalização visual prévia antes de iniciar o motor, o condutor constata a presença de manchas e odor forte de vazamento de combustível sob o compartimento do motor do veículo. Diante desse risco iminente, qual a conduta mecânica correta a ser adotada?",
    options: [
      "Não dar partida no motor, manter o veículo imobilizado em local ventilado e providenciar o reboque do veículo para uma oficina mecânica especializada.",
      "Funcionar o motor em alta rotação para queimar o combustível acumulado nas mangueiras e secar o vazamento por calor.",
      "Misturar detergente líquido ou sabão em pó ao redor da mancha para diluir o combustível e prosseguir viagem normalmente.",
      "Ignorar o vazamento provisoriamente caso o painel não indique luz vermelha de superaquecimento de óleo.",
    ],
    correctIndex: 0,
    explanation:
      "Vazamento de combustível é risco gravíssimo de incêndio. O veículo não deve ser funcionado e deve ser transportado com segurança para conserto.",
    detailedExplanation:
      "Vazamento de combustível é uma EMERGÊNCIA que exige ação imediata: o combustível é altamente inflamável e qualquer faísca (do motor, do escapamento, de um cigarro próximo) pode causar incêndio ou explosão. Além do risco de incêndio, o combustível derramado contamina o solo e a água, configurando dano ambiental. Ao perceber vazamento, pare o veículo em local seguro e arejado, desligue o motor, não fume e acione um mecânico ou guincho.",
    incidence: "media",
    difficulty: 3,
  },
  {
    id: "qe81",
    category: "prioridade",
    statement:
      "Ao manobrar para retirar seu veículo de uma garagem de edifício residencial particular e ingressar na via pública urbana, o condutor deve dar preferência de passagem a:",
    options: [
      "Aos pedestres que circulam pela calçada (passeio público) e aos veículos que já estão transitando pela via pública.",
      "Exigir prioridade de passagem sobre os pedestres acionando a buzina e mudando a aceleração de forma rápida.",
      "Aos veículos que vêm apenas pela sua esquerda, tendo preferência sobre pedestres e veículos da direita.",
      "Aos ciclistas apenas se eles estiverem transitando na contramão de direção da via secundária.",
    ],
    correctIndex: 0,
    explanation:
      "Veículos saindo de garagens ou propriedades lindeiras devem dar preferência absoluta a pedestres na calçada e veículos circulando na via (Art. 36 do CTB).",
    detailedExplanation:
      "Quando um veículo está saindo de garagem, estacionamento ou qualquer propriedade lindeira para entrar em uma via, ele DEVE dar preferência a TODOS os veículos e pedestres que já estão circulando na via. Isso inclui tanto veículos quanto pedestres passando pela calçada. O condutor deve reduzir, parar se necessário, sinalizar com seta e só entrar quando tiver espaço seguro. Ignorar essa regra pode causar colisões com veículos e atropelamentos.",
    legalBase: "Art. 36 CTB",
    incidence: "alta",
    difficulty: 3,
  },
  {
    id: "qe82",
    category: "legislacao",
    statement:
      "O correto estado físico e legibilidade da placa de identificação traseira do veículo é exigido pela fiscalização de trânsito. Sob as regras punitivas do CTB, transitar com a placa traseira sem legibilidade ou com caracteres encobertos configura:",
    options: [
      "Infração de natureza gravíssima, punida com multa pecuniária, medida administrativa de remoção do veículo ao depósito e recolhimento do CLA/CRLV.",
      "Infração média, punida com multa simples sem previsão de remoção física ou retenção de documentos.",
      "Infração grave, permitindo o trânsito livre por até 48 horas se o proprietário comprovar agendamento de nova placa.",
      "Infração leve, convertida automaticamente em advertência verbal pedagógica pelo agente fiscalizador.",
    ],
    correctIndex: 0,
    explanation:
      "Conduzir veículo com qualquer uma das placas sem legibilidade ou visibilidade é infração gravíssima (Art. 230, VI do CTB) com remoção do veículo.",
    detailedExplanation:
      "A placa de identificação do veículo deve estar sempre LIMPA e LEGÍVEL, sem obstruções, sujeira, adesivos ou alterações. Qualquer adulteração — como cobrir parcialmente a placa, usar películas, adesivos ou materiais que dificultem a leitura — é infração GRAVÍSSIMA, com 7 pontos, multa e apreensão do veículo. Placa adulterada também configura crime de adulteração de sinal identificador. A placa é o documento de identidade do veículo e precisa ser claramente visível para fiscalização.",
    legalBase: "Art. 230, IV CTB",
    incidence: "alta",
    difficulty: 3,
  },
  {
    id: "qe83",
    category: "direcao-defensiva",
    statement:
      "Após realizar a ultrapassagem de um veículo pesado (caminhão) em rodovia de pista única, qual a conduta correta de direção defensiva e sinalização para que o motorista retorne à sua faixa de origem com segurança?",
    options: [
      "Sinalizar a intenção de retorno com a seta para a direita, acelerar para criar distância e retornar à faixa original apenas após visualizar o caminhão inteiro no espelho retrovisor interno do veículo.",
      "Retornar à faixa imediatamente após passar o para-lama dianteiro do caminhão para desobstruir a contramão rapidamente.",
      "Desacelerar o veículo de passeio na contramão até que o caminhão emparelhe e buzinar para avisar o retorno.",
      "Manter o pisca-alerta ligado durante todo o retorno para indicar manobra de emergência na rodovia.",
    ],
    correctIndex: 0,
    explanation:
      "Deve-se sinalizar e retornar à faixa original somente após obter distância segura do veículo ultrapassado, indicada pela visualização completa dele no retrovisor interno.",
    detailedExplanation:
      "Após ultrapassar, o condutor deve retornar à faixa original apenas quando enxergar o veículo ultrapassado COMPLETAMENTE pelo RETROVISOR INTERNO. Isso garante que há distância suficiente entre os veículos para a manobra segura. Retornar logo após ultrapassar o para-choque (antes de ver no retrovisor) é arriscado — pode fechar o outro veículo e causar colisão. A seta direita deve ser acionada antes de retornar, sinalizando a intenção.",
    incidence: "media",
    difficulty: 3,
  },
  {
    id: "qe84",
    category: "infracoes",
    statement:
      "Ao trafegar por via urbana dotada de iluminação pública eficiente durante o período noturno, o condutor decide desligar os faróis e manter acesos apenas os faroletes (luzes de posição) do veículo. Sob as penalidades administrativas do CTB, tal atitude configura:",
    options: [
      "Infração de trânsito de natureza média, sujeita a multa administrativa pecuniária e acúmulo de pontos na CNH.",
      "Infração grave, gerando suspensão da validade do licenciamento do veículo até vistoria técnica.",
      "Conduta permitida pela lei de trânsito desde que a iluminação pública da via seja classificada como excelente.",
      "Infração leve, passível apenas de advertência oral pelo agente de trânsito se a velocidade estiver reduzida.",
    ],
    correctIndex: 0,
    explanation:
      "Transitar sob iluminação pública à noite usando apenas luzes de posição (faroletes) em vez de farol baixo é infração média (Art. 250, I, 'a' do CTB).",
    detailedExplanation:
      "Transitar com os faróis apagados durante a noite é infração MÉDIA, com 4 pontos na CNH e multa. O farol baixo deve estar aceso OBRIGATORIAMENTE das 18h às 6h em vias públicas. Além da infração, dirigir sem faróis à noite é extremamente perigoso: reduz a visibilidade do condutor e, mais importante, torna o veículo quase invisível para outros motoristas, pedestres e ciclistas. O farol aceso serve tanto para o condutor enxergar quanto para ser visto.",
    legalBase: "Art. 250 CTB",
    incidence: "media",
    difficulty: 3,
  },
  {
    id: "qe85",
    category: "legislacao",
    statement:
      "A obrigatoriedade do uso de faróis baixos (luz baixa) durante o dia em rodovias foi atualizada pela legislação nacional recente. Sob as regras vigentes do CTB, condutores de veículos equipados com luz de condução diurna (DRL) devem manter o farol baixo aceso durante o dia em:",
    options: [
      "Rodovias de pista simples situadas fora de perímetros urbanos, caso o veículo não possua a luz de condução diurna (DRL).",
      "Qualquer espécie de via urbana ou rural de forma compulsória, independente de o veículo possuir DRL ou não.",
      "Apenas no interior de túneis ou sob forte neblina e chuva torrencial, sendo dispensada nas demais rodovias.",
      "Rodovias federais concedidas sob pedágio de fluxo rápido durante finais de semana.",
    ],
    correctIndex: 0,
    explanation:
      "Em rodovias de pista simples fora do perímetro urbano, veículos sem DRL devem manter farol baixo ligado mesmo durante o dia.",
    detailedExplanation:
      "A 'Lei do Farol Baixo' (Lei 13.290/2016, alterada pela 14.071/2021) determina que o farol baixo deve estar ligado OBRIGATORIAMENTE durante o dia em rodovias de pista simples. Em rodovias de pista DUPLA com canteiro central (também chamadas de freeway), o uso do farol baixo durante o dia é DISPENSADO, pois o canteiro separa os fluxos. No entanto, muitos condutores mantêm ligado por segurança. Em túneis, chuva ou neblina, o farol baixo é sempre obrigatório.",
    legalBase: "Lei 13.290/16",
    incidence: "alta",
    difficulty: 3,
  },
  {
    id: "qp16",
    category: "placas",
    statement:
      "Quanto à classificação geral da sinalização vertical do CTB, qual grupo tem por objetivo principal AUXILIAR/ORIENTAR o condutor com informações de serviços (hospital, posto, telefone)?",
    options: [
      "Sinalização de Regulamentação, que tem por finalidade informar aos usuários as condições, proibições, obrigações ou restrições no uso das vias.",
      "Sinalização de Advertência, que tem por finalidade alertar os usuários das condições potencialmente perigosas ou obstáculos existentes na via.",
      "Sinalização de Indicação, que tem por finalidade identificar as vias e os locais de interesse, bem como orientar os condutores sobre os destinos e os serviços auxiliares disponíveis.",
      "Sinalização de Obras e Especiais, que tem por finalidade informar sobre os trabalhos executados na pista e demais eventos temporários.",
    ],
    correctIndex: 2,
    explanation:
      "Sinalização de Indicação informa serviços auxiliares e atrativos turísticos (placas azuis).",
    detailedExplanation:
      "A sinalização de INDICAÇÃO (série I) tem o objetivo de orientar e auxiliar o condutor. Divide-se em: INDICAÇÃO DE SERVIÇOS AUXILIARES (placas AZUIS com símbolo branco — hospital, posto de gasolina, telefone, restaurante, hospedagem) e INDICAÇÃO DE ORIENTAÇÃO DE DESTINO (placas VERDES para orientação de cidades e distâncias, MARRONS para atrativos turísticos e BRANCAS para identificação de logradouros). Diferente das placas de regulamentação (que obrigam) e advertência (que alertam), as de indicação apenas informam.",
    incidence: "media",
    difficulty: 2,
  },
  {
    id: "q4",
    category: "primeiros-socorros",
    statement:
      "Em um cenário de colisão traseira em rodovia pavimentada, o socorrista inicial depara-se com uma vítima consciente, porém incapacitada de se movimentar, que reclama de dor na região cervical. Diante da necessidade absoluta de segurança antes da chegada da equipe do SAMU, o procedimento prioritário é:",
    options: [
      "Retirar a vítima imediatamente do interior do veículo, puxando-a pelos membros superiores para evitar incêndios.",
      "Oferecer líquidos ou analgésicos leves e massagear a região do pescoço para aliviar o espasmo doloroso.",
      "Garantir a imobilização do pescoço e da coluna da vítima, mantendo-a alinhada na posição em que foi encontrada, sem movimentá-la desnecessariamente.",
      "Ajudar a vítima a sentar-se ereta para melhorar seu fluxo circulatório periférico.",
    ],
    correctIndex: 2,
    explanation:
      "Vítimas com dor cervical devem ser mantidas imóveis e alinhadas para evitar lesões medulares irreversíveis.",
    detailedExplanation:
      "A posição lateral de segurança (PLS) impede que a língua obstrua as vias aéreas e evita que a vítima se afogue com o próprio vômito ou saliva. Só se aplica quando há respiração espontânea. Nunca ofereça líquidos a vítima inconsciente (risco de aspiração) e nunca mova a vítima desnecessariamente, pois pode haver lesão na coluna — só remova se houver risco iminente (fogo, explosão).",
    commonMistake:
      "Muitos marcam 'respiração boca a boca' — mas isso só é feito se a vítima NÃO estiver respirando.",
    tip: "Respira + inconsciente = posição lateral.",
    incidence: "alta",
    difficulty: 3,
  },
  {
    id: "q5",
    category: "infracoes",
    statement:
      "Um condutor é submetido ao teste do etilômetro durante fiscalização ordinária da Lei Seca. O aparelho acusa teor alcoólico superior ao limite de tolerância estabelecido na legislação. De acordo com o Art. 165 do CTB, a infração praticada e sua respectiva penalidade pecuniária administrativa são:",
    options: [
      "Infração de natureza grave, punida com multa no valor de cinco vezes o valor base.",
      "Infração de natureza gravíssima, punida com multa administrativa multiplicada por dez vezes e suspensão do direito de dirigir por 12 meses.",
      "Infração de natureza média, punida com multa administrativa e apreensão definitiva da CNH.",
      "Crime de trânsito inafiançável com perda imediata do direito de dirigir por cinco anos.",
    ],
    correctIndex: 1,
    explanation:
      "Dirigir sob influência de álcool é infração gravíssima multiplicada por 10 e acarreta suspensão do direito de dirigir por 12 meses.",
    detailedExplanation:
      "A Lei Seca (Lei 11.705/08, alterada pela 12.760/12) tornou tolerância zero: qualquer concentração de álcool já configura infração gravíssima, com multa multiplicada por 10 (R$ 2.934,70), suspensão do direito de dirigir por 12 meses e recolhimento da CNH. Recusar o bafômetro tem a mesma penalidade. Se houver concentração acima de 0,34 mg/L de ar expirado, configura também CRIME de trânsito (art. 306 do CTB), com prisão de 6 meses a 3 anos.",
    legalBase: "Art. 165 e 306 do CTB",
    incidence: "altissima",
    difficulty: 3,
  },
  {
    id: "q6",
    category: "prioridade",
    statement:
      "Ao se deparar com um cruzamento de nível urbano desprovido de qualquer sinalização vertical, horizontal ou luminosa, dois veículos aproximam-se simultaneamente de direções perpendiculares. De acordo com as disposições gerais de preferência estabelecidas no CTB, a prioridade de passagem pertence ao veículo que:",
    options: [
      "Trafegar pela via de maior movimento ou largura nominal.",
      "Aproximar-se do cruzamento pela direita do condutor do outro veículo.",
      "Estar desenvolvendo maior velocidade linear no momento da interseção.",
      "Sinalizar primeiro a intenção de efetuar conversão à esquerda.",
    ],
    correctIndex: 1,
    explanation:
      "Em cruzamentos não sinalizados, a preferência é sempre de quem vem pela direita do outro veículo.",
    detailedExplanation:
      "Regra geral: em cruzamento ou interseção sem sinalização, dá-se preferência ao veículo que vem pela DIREITA. Exceções: (1) veículos circulando em rotatória têm preferência sobre quem entra; (2) veículos em via preferencial (mesmo sem placa, geralmente a mais larga ou pavimentada) têm prioridade; (3) veículos de emergência em serviço têm prioridade absoluta.",
    legalBase: "Art. 29, III, 'c' do CTB",
    commonMistake:
      "É a pegadinha mais cobrada da prova. Muitos marcam 'esquerda' por confusão. Memorize: DIREITA = preferência.",
    tip: "Direita = preferência. Memorize!",
    incidence: "altissima",
    trap: true,
    difficulty: 3,
  },
  {
    id: "q7",
    category: "placas",
    statement:
      "A sinalização de trânsito é composta por diversas classes de dispositivos. Dentre elas, a placa de regulamentação 'PARADA OBRIGATÓRIA' (R-1) possui um formato singular em relação às demais placas regulamentares. Assinale a alternativa que explica corretamente seu formato e sua finalidade técnica:",
    options: [
      "Formato octogonal, cuja finalidade é garantir a legibilidade da placa mesmo que vista pelo verso ou parcialmente coberta por poeira.",
      "Formato triangular invertido, para sinalizar a transição de vias urbanas de grande fluxo.",
      "Formato circular padrão, cuja finalidade é diferenciar-se das placas de advertência que são losangulares.",
      "Formato retangular azul, indicando área de estacionamento regulamentado obrigatório.",
    ],
    correctIndex: 0,
    explanation:
      "A placa R-1 é octogonal para ser identificada facilmente por condutores que trafegam em vias transversais (mesmo de costas).",
    detailedExplanation:
      "A placa PARE (R-1) é OCTOGONAL (8 lados), vermelha com letras brancas, e obriga parada TOTAL do veículo antes da faixa de retenção, mesmo que não haja outro veículo se aproximando. Desobedecer é infração gravíssima (7 pontos). É a única placa octogonal do CTB justamente para ser reconhecida mesmo se estiver suja, virada ou em más condições.",
    commonMistake:
      "Confundir com advertência por causa do formato diferente. Lembre: PARE é REGULAMENTAÇÃO.",
    incidence: "alta",
    difficulty: 3,
  },
  {
    id: "q8",
    category: "meio-ambiente",
    statement:
      "No contexto da gestão ambiental e da circulação urbana de veículos automotores, emitir gases poluentes ou fumaça acima dos níveis regulamentados pelos órgãos de controle ambiental (como o CONAMA) sujeita o proprietário do veículo a qual sanção, nos termos do CTB?",
    options: [
      "Apenas advertência por escrito expedida pelo órgão ambiental estadual competente.",
      "Infração de natureza grave, punida com multa e retenção do veículo para fins de regularização.",
      "Infração gravíssima de trânsito, punida com remoção do veículo e cassação da licença de funcionamento.",
      "Crime ambiental com detenção compulsória do motorista em flagrante.",
    ],
    correctIndex: 1,
    explanation:
      "O desrespeito aos limites de emissão de poluentes é classificado pelo CTB como infração grave com retenção para regularização.",
    detailedExplanation:
      "Conforme o art. 231, III do CTB, transitar com o veículo produzindo fumaça, gases ou partículas em níveis superiores aos permitidos é infração GRAVE: 5 pontos na CNH, multa e medida administrativa de retenção do veículo para regularização. O controle se dá pelo PROCONVE (Programa de Controle da Poluição do Ar por Veículos Automotores).",
    legalBase: "Art. 231, III do CTB",
    incidence: "media",
    difficulty: 3,
  },
  {
    id: "q9",
    category: "mecanica",
    statement:
      "A manutenção preventiva do sistema de frenagem do veículo automotor é indispensável para a segurança viária. Sobre os princípios de funcionamento e componentes do sistema de freios de serviço de acionamento hidráulico convencional, assinale a afirmativa correta:",
    options: [
      "O sistema de freio de estacionamento (freio de mão) atua de forma hidráulica nas quatro rodas simultaneamente.",
      "A redução de velocidade ocorre pelo atrito das pastilhas contra os discos de freio ou das sapatas contra os tambores, impulsionados pela pressão do fluido de freio.",
      "O hidrovácuo (servo-freio) serve para aumentar a resistência mecânica do pedal de freio, tornando-o mais rígido na frenagem de emergência.",
      "O fluido de freio deve ser inspecionado anualmente e substituído apenas quando houver vazamento severo no cilindro mestre.",
    ],
    correctIndex: 1,
    explanation:
      "O freio hidráulico converte a pressão hidráulica em atrito mecânico nas rodas por meio de pastilhas/discos ou lonas/tambores.",
    detailedExplanation:
      "O sistema de freios converte energia cinética em calor por atrito, reduzindo a velocidade. É composto por: pedal, cilindro mestre, fluido (DOT3/DOT4), pastilhas, discos (ou lonas e tambores) e o freio de estacionamento. Sinais de problema: pedal baixo, ruído metálico, puxar para um lado, vibração. Verificação periódica é obrigação do condutor — dirigir com freio defeituoso é infração GRAVÍSSIMA.",
    incidence: "media",
    difficulty: 3,
  },
  {
    id: "q10",
    category: "direcao-defensiva",
    statement:
      "A direção defensiva orienta que, em condições ideais de clima e pista, o condutor mantém uma distância de seguimento segura em relação ao veículo que trafega imediatamente à sua frente. Essa distância deve ser calculada utilizando a regra prática de:",
    options: [
      "Manter no mínimo 5 metros de distância para cada 10 km/h de velocidade desenvolvida.",
      "Contar dois segundos de intervalo entre a passagem do veículo da frente e a do próprio veículo por um ponto fixo de referência na via.",
      "Basear-se na distância visual de três postes de iluminação pública consecutivas na via.",
      "Manter sempre a distância fixa equivalente ao comprimento de dois automóveis de médio porte.",
    ],
    correctIndex: 1,
    explanation:
      "A regra dos dois segundos é o método padrão de contagem para aferição rápida de distância segura em vias pavimentadas.",
    detailedExplanation:
      "Como aplicar: escolha um ponto fixo na via (placa, árvore). Quando o veículo da frente passar por ele, conte 'mil e um, mil e dois'. Se você passar antes de terminar a contagem, está perto demais. Em condições normais e secas, 2 segundos. Em chuva, neblina ou pista escorregadia: DOBRE para 4 segundos. À noite ou com cargas pesadas: aumente também. Essa distância dá tempo de reação para frear sem colisão traseira.",
    tip: "Normal = 2s · Chuva = 4s",
    incidence: "alta",
    difficulty: 3,
  },
  {
    id: "q11",
    category: "legislacao",
    statement:
      "O Código de Trânsito Brasileiro (CTB) estabelece prazos para renovação dos exames de aptidão física e mental para a habilitação de condutores. De acordo com as normas atualizadas pela Lei 14.071/2021, condutores com idade inferior a 50 anos devem renovar sua CNH com periodicidade máxima de:",
    options: [
      "5 anos, independentemente do exercício de atividade remunerada (EAR).",
      "10 anos, exceto quando houver indicação médica em contrário expressa no prontuário.",
      "3 anos, para condutores habilitados nas categorias profissionais C, D e E.",
      "15 anos, desde que não cometam nenhuma infração gravíssima nos últimos doze meses.",
    ],
    correctIndex: 1,
    explanation:
      "A validade da CNH para condutores abaixo de 50 anos passou para 10 anos a partir de 2021.",
    detailedExplanation:
      "A Lei 14.071/2021 alterou o art. 147 do CTB. Validade conforme idade do condutor NA DATA DO EXAME: menos de 50 anos = 10 anos; de 50 a menos de 70 = 5 anos; 70 ou mais = 3 anos. Condutores que exercem atividade remunerada (EAR — táxi, ônibus, escolar, transporte de carga) precisam fazer toxicológico e o prazo segue regras próprias.",
    legalBase: "Art. 147, §2º do CTB (Lei 14.071/2021)",
    commonMistake:
      "Provas antigas falavam em '5 anos' — a regra MUDOU em 2021. Hoje, jovem renova de 10 em 10 anos.",
    tip: "10 / 5 / 3 — quanto mais idade, menor validade.",
    incidence: "altissima",
    trap: true,
    difficulty: 3,
  },
  {
    id: "q12",
    category: "infracoes",
    statement:
      "Em uma via arterial dotada de sinalização semafórica, o condutor decide avançar o sinal vermelho do semáforo durante a madrugada, alegando razões de segurança pessoal. Sob o rigor técnico e jurídico do Código de Trânsito Brasileiro (CTB), essa conduta configura:",
    options: [
      "Infração de trânsito de natureza gravíssima, punida com multa e acúmulo de 7 pontos na CNH, sem possibilidade de exceções por conveniência pessoal.",
      "Infração de trânsito de natureza grave, tolerada em situações de risco iminente ou durante a madrugada.",
      "Infração média, passível de conversão imediata em advertência por escrito pelo agente fiscalizador.",
      "Crime de trânsito de menor potencial ofensivo, acarretando a suspensão preventiva da CNH.",
    ],
    correctIndex: 0,
    explanation: "Avançar o sinal vermelho é infração gravíssima, conforme o Art. 208 do CTB.",
    detailedExplanation:
      "Avançar sinal vermelho é infração GRAVÍSSIMA: 7 pontos na CNH e multa de R$ 293,47. Não há tolerância — mesmo parar 'em cima' da faixa de pedestres no vermelho conta. Exceção: à noite, entre 22h e 5h, em locais com risco de assalto, alguns municípios autorizam reduzir e prosseguir após confirmar a ausência de pedestres e outros veículos.",
    legalBase: "Art. 208 do CTB",
    incidence: "alta",
    difficulty: 3,
  },
  {
    id: "q13",
    category: "placas",
    statement:
      "A sinalização vertical de advertência tem por objetivo alertar os usuários da via sobre perigos potenciais, indicando sua natureza adiante. As placas pertencentes a essa classe possuem, por padrão regulamentar estabelecido no CTB, o seguinte formato e paleta de cores:",
    options: [
      "Formato circular com fundo branco, orla vermelha e símbolos em preto.",
      "Formato quadrado ou losangular com fundo amarelo, orla interna preta e símbolos em preto.",
      "Formato retangular com fundo verde ou azul e caracteres em branco.",
      "Formato octogonal com fundo vermelho e caracteres em branco.",
    ],
    correctIndex: 1,
    explanation: "Placas de advertência são amarelas e pretas, geralmente com formato de losango.",
    detailedExplanation:
      "As placas de advertência (série A) são LOSANGOS amarelos com orla e símbolos pretos. Avisam o condutor sobre condições perigosas à frente: curvas, lombadas, cruzamentos, animais, pedestres, escolas, obras. Não obrigam, apenas alertam — mas ignorar uma advertência e causar acidente agrava a responsabilidade do condutor. Exceções: 'Cruz de Santo André' (cruzamento com via férrea) tem formato próprio.",
    tip: "Amarelo = atenção, perigo próximo.",
    incidence: "alta",
    difficulty: 3,
  },
  {
    id: "q14",
    category: "primeiros-socorros",
    statement:
      "Ao presenciar um acidente automobilístico em rodovia pública, o condutor de um veículo decide prestar o atendimento inicial. Visando à preservação da vida e à segurança de todos os envolvidos no local do sinistro, qual deve ser o primeiro procedimento técnico adotado?",
    options: [
      "Tentar remover imediatamente os veículos acidentados para desobstruir as faixas de rolamento.",
      "Efetuar a sinalização correta do local do acidente para evitar novas colisões e garantir a própria segurança antes de aproximar-se das vítimas.",
      "Iniciar manobras de reanimação cardiopulmonar na primeira vítima localizada fora do veículo.",
      "Retirar as vítimas das ferragens sem aguardar o equipamento do Corpo de Bombeiros.",
    ],
    correctIndex: 1,
    explanation:
      "A sinalização do local é o primeiro passo absoluto para garantir que o socorrista e outros motoristas não se tornem novas vítimas.",
    detailedExplanation:
      "Protocolo PAS é mundialmente adotado: (1) PROTEGER o local — sinalize com triângulo a no mínimo 30 metros, ligue o pisca-alerta e impeça novas vítimas; (2) AVISAR — ligue 192 (SAMU), 193 (Bombeiros) ou 190 (Polícia), informando local exato, número e estado das vítimas; (3) SOCORRER — só preste socorro direto se tiver conhecimento. Mover vítima sem necessidade pode agravar lesões de coluna.",
    tip: "Decore: P-A-S.",
    incidence: "altissima",
    difficulty: 3,
  },
  {
    id: "q15",
    category: "prioridade",
    statement:
      "Ao se aproximar de uma rotatória desprovida de qualquer placa de regulamentação de trânsito (como a R-2 'Dê a Preferência'), qual veículo detém, por imposição legal do CTB, a preferência de passagem na interseção?",
    options: [
      "O veículo que estiver circulando pela rotatória no momento da interseção.",
      "O veículo que se aproximar da rotatória vindo pela via de trânsito rápido ou arterial.",
      "O veículo que iniciar a manobra de aceleração primeiro na tentativa de ingressar na rotatória.",
      "O veículo que se aproximar pela direita daquele que já se encontra na circulação da rotatória.",
    ],
    correctIndex: 0,
    explanation:
      "Em rotatórias sem sinalização específica, a preferência é sempre do veículo que já está circulando dentro dela.",
    detailedExplanation:
      "Desde a Lei 10.830/2003, em rotatórias (também chamadas de retornos ou balões), quem JÁ ESTÁ circulando tem preferência sobre quem deseja entrar. Antes dessa lei, valia a regra geral da direita — por isso muitas pessoas mais velhas ainda erram. Quem entra deve dar seta à direita ao sair e à esquerda enquanto circula, conforme o caso.",
    legalBase: "Art. 29, III, 'f' do CTB",
    commonMistake:
      "Pegadinha: a banca insinua a regra da direita. Mas em rotatória vale a regra ESPECÍFICA: já está dentro = preferência.",
    tip: "Já dentro = preferência.",
    incidence: "altissima",
    trap: true,
    difficulty: 3,
  },
  {
    id: "q16",
    category: "direcao-defensiva",
    statement:
      "A Direção Defensiva baseia-se em cinco elementos fundamentais (pilares) indispensáveis para a condução segura de veículos automotores. Assinale a alternativa que apresenta uma conduta que NÃO corresponde a esses elementos de segurança preventiva:",
    options: [
      "Agir sob a influência do elemento Conhecimento, sabendo as leis de trânsito e características mecânicas do veículo.",
      "Agir sob a influência da Previsão, antecipando perigos no fluxo de tráfego adiante.",
      "Agir sob a influência da Habilidade, confiando nela para trafegar acima do limite de velocidade de forma segura.",
      "Agir sob a influência da Decisão, tomando atitudes seguras de forma rápida perante emergências.",
    ],
    correctIndex: 2,
    explanation:
      "A habilidade serve para conduzir com segurança, mas confiar nela para violar leis de trânsito (excesso de velocidade) é imperícia/imprudência.",
    detailedExplanation:
      "Os 5 elementos básicos da direção defensiva são: CONHECIMENTO (das leis, do veículo, da via), ATENÇÃO (foco constante), PREVISÃO (antecipar o que pode acontecer), HABILIDADE (domínio prático do veículo) e AÇÃO (reação correta na hora certa). Pressa, distração, álcool e cansaço são justamente os INIMIGOS da direção defensiva.",
    commonMistake:
      "Questão tipo 'EXCETO' é armadilha — leia duas vezes. Pressa NÃO é elemento, é inimigo.",
    incidence: "alta",
    trap: true,
    difficulty: 3,
  },
  {
    id: "q17",
    category: "legislacao",
    statement:
      "O uso de dispositivos de retenção, como o cinto de segurança, é regulamentado de forma rígida pela legislação de trânsito brasileira. Sobre a obrigatoriedade e uso deste dispositivo pelos ocupantes do veículo, assinale a alternativa correta de acordo com as normas do CTB:",
    options: [
      "O uso do cinto de segurança é obrigatório apenas para o condutor e o passageiro do banco dianteiro em rodovias.",
      "O uso do cinto de segurança é obrigatório em todas as vias do território nacional para condutor e passageiros, tanto nos bancos dianteiros quanto traseiros.",
      "O uso do cinto de segurança é dispensado para crianças transportadas no banco traseiro em cadeirinhas infantis apropriadas.",
      "O condutor fica isento da multa se o passageiro do banco traseiro se recusar a utilizar o cinto de segurança.",
    ],
    correctIndex: 1,
    explanation:
      "O uso do cinto de segurança é obrigatório para todos os ocupantes do veículo, em todas as vias públicas do território nacional.",
    detailedExplanation:
      "O cinto é obrigatório para TODOS os ocupantes (frente e trás), em TODAS as vias (urbanas ou rurais). Não usar é infração GRAVE: 5 pontos e multa. A responsabilidade pelo cinto dos passageiros é também do condutor. Crianças até 10 anos devem ir no banco traseiro, em dispositivos de retenção apropriados (bebê conforto, cadeirinha ou assento de elevação) conforme idade e peso.",
    legalBase: "Art. 167 do CTB",
    incidence: "alta",
    difficulty: 3,
  },
  {
    id: "q18",
    category: "meio-ambiente",
    statement:
      "A relação entre o modo de condução do veículo e os impactos ecológicos é direta e mensurável. Dentre as opções apresentadas, assinale a conduta que contribui ativamente para a redução da emissão de poluentes atmosféricos e eficiência energética:",
    options: [
      "Acelerar o motor de forma vigorosa entre as trocas de marchas para manter o giro alto do motor.",
      "Transitar em marchas adequadas à velocidade, mantendo uma aceleração constante e evitando freadas ou arrancadas bruscas desnecessárias.",
      "Desligar o motor em declives acentuados (colocar o veículo em ponto morto ou 'banguela') para economizar combustível.",
      "Utilizar combustível aditivado sem realizar a troca periódica dos filtros de ar e óleo do motor.",
    ],
    correctIndex: 1,
    explanation:
      "A condução suave e constante reduz consideravelmente o consumo de combustível e a emissão de poluentes nocivos.",
    detailedExplanation:
      "Manutenção preventiva (troca de óleo, filtros, vela, regulagem do motor, calibragem dos pneus) garante combustão completa, reduz emissão de CO, CO2 e particulados, e economiza combustível. Outras atitudes que ajudam: trocar marcha em rotações médias (2.000-2.500 rpm), desligar o motor em paradas longas, evitar acelerações bruscas e manter pneus calibrados.",
    incidence: "media",
    difficulty: 3,
  },
  {
    id: "q19",
    category: "mecanica",
    statement:
      "O sistema de suspensão do veículo automotor desempenha funções mecânicas críticas para a dirigibilidade e segurança ativa. Assinale a alternativa que descreve de forma correta e abrangente a função técnica primária dos componentes desse sistema (molas, amortecedores e braços oscilantes):",
    options: [
      "Reduzir o atrito interno do motor transmitindo a força motriz diretamente para o sistema de diferencial traseiro.",
      "Absorver os impactos gerados pelas irregularidades da pista de rolamento, garantindo o conforto dos ocupantes e mantendo os pneus em contato constante com o solo.",
      "Impedir a fadiga dos freios de serviço mantendo a carroceria perfeitamente paralela à linha do horizonte.",
      "Controlar o nível de pressão hidráulica nos cilindros auxiliares do sistema de freios antibloqueio (ABS).",
    ],
    correctIndex: 1,
    explanation:
      "A suspensão absorve irregularidades e assegura a aderência dos pneus ao solo, sendo vital para o controle do veículo.",
    detailedExplanation:
      "A suspensão (molas, amortecedores, bandejas, batentes) absorve as irregularidades da pista, mantém os pneus em contato com o solo, dá estabilidade nas curvas e protege passageiros e carga. Suspensão gasta = carro 'flutua', aumenta a distância de frenagem e o risco de perda de controle. Sinais: ruídos, balanço excessivo, desgaste irregular dos pneus.",
    incidence: "baixa",
    difficulty: 3,
  },
  {
    id: "q20",
    category: "infracoes",
    statement:
      "O uso de aparelhos celulares ao volante tem sido uma das maiores causas de acidentes graves no Brasil. De acordo com as alterações recentes do CTB, segurar ou manusear o telefone celular enquanto conduz o veículo configura qual tipo de infração de trânsito?",
    options: [
      "Infração média, punida com multa e 4 pontos na CNH.",
      "Infração de natureza grave, punida com multa administrativa e retenção preventiva da CNH.",
      "Infração gravíssima de trânsito, punida com multa e acúmulo de 7 pontos na CNH.",
      "Crime de trânsito inafiançável com suspensão do direito de dirigir por 6 meses.",
    ],
    correctIndex: 2,
    explanation:
      "Segurar ou manusear celular enquanto dirige é infração gravíssima de acordo com o Art. 252, parágrafo único do CTB.",
    detailedExplanation:
      "Desde a Lei 14.071/2021, segurar o celular ao dirigir é infração GRAVÍSSIMA: 7 pontos e multa de R$ 293,47. O uso é permitido apenas em modo viva-voz ou com fone, sem manuseio. Olhar a tela para ver mapa também conta — coloque o aparelho em suporte fixo. Motoristas profissionais (EAR) podem ter a CNH suspensa diretamente nesta infração.",
    legalBase: "Art. 252, §1º do CTB",
    tip: "Celular na mão = gravíssima.",
    incidence: "altissima",
    difficulty: 3,
  },
  {
    id: "q21",
    category: "placas",
    statement:
      "No que diz respeito à sinalização vertical, as placas de identificação e orientação de destino, que fazem parte do grupo de sinalização de indicação, possuem cores de fundo padronizadas. Em rodovias federais e estaduais no Brasil, essas placas são predominantemente:",
    options: [
      "Fundo amarelo com caracteres pretos, destacando o nome das cidades próximas da rodovia.",
      "Fundo vermelho com caracteres brancos, indicando a proibição de prosseguimento na via.",
      "Fundo verde com caracteres brancos, podendo também ser azuis com caracteres brancos quando se destinam à orientação de destino.",
      "Fundo marrom com caracteres brancos, reservadas exclusivamente às orientações de caráter turístico.",
    ],
    correctIndex: 2,
    explanation:
      "Placas de indicação física e de orientação de destino usam fundo verde ou azul com caracteres brancos.",
    detailedExplanation:
      "Placas de INDICAÇÃO orientam o condutor: AZUL = serviços auxiliares (posto, hospital, telefone, restaurante); VERDE = orientação de destino (saídas, cidades, distâncias); MARROM = atrativos turísticos; BRANCAS com bordas pretas = identificação de logradouro. São informativas, não obrigam nem proíbem.",
    incidence: "media",
    difficulty: 3,
  },
  {
    id: "q22",
    category: "legislacao",
    statement:
      "O Sistema Nacional de Trânsito (SNT) é o conjunto de órgãos e entidades da União, dos Estados, do Distrito Federal e dos Municípios que exercem atividades de planejamento, administração, policiamento e julgamento de recursos de trânsito. Assinale a alternativa que indica corretamente um órgão executivo de trânsito que pertence ao SNT:",
    options: [
      "O Conselho Nacional de Trânsito (CONTRAN), órgão normativo e consultivo máximo.",
      "Os Departamentos Estaduais de Trânsito (DETRANs), responsáveis por emitir a habilitação e vistoriar veículos no âmbito estadual.",
      "As Juntas Administrativas de Recursos de Infrações (JARI), órgãos colegiados recursais exclusivos do Ministério dos Transportes.",
      "Os Centros de Formação de Condutores (CFCs), que regulam as diretrizes normativas das provas do DETRAN.",
    ],
    correctIndex: 1,
    explanation:
      "Os DETRANs são órgãos executivos de trânsito estaduais responsáveis pela CNH e licenciamento de veículos.",
    detailedExplanation:
      "O Sistema Nacional de Trânsito (SNT) é o conjunto de órgãos federais, estaduais e municipais que cuidam do trânsito no Brasil. Principais: CONTRAN (normativo máximo), SENATRAN (executivo federal — antigo DENATRAN), DETRANs (executivos estaduais), DNIT e PRF (rodovias federais), polícias militares estaduais, órgãos municipais de trânsito e as JARIs (julgam recursos de multas).",
    legalBase: "Art. 5º a 25 do CTB",
    incidence: "media",
    difficulty: 3,
  },
  {
    id: "q23",
    category: "direcao-defensiva",
    statement:
      "Sob chuva torrencial, a formação de lâmina d'água sobre a pista pode provocar a ocorrência do fenômeno físico da aquaplanagem. Sob a ótica da direção defensiva e do controle mecânico do veículo, como essa situação perigosa deve ser prevenida e tratada no instante exato de sua ocorrência?",
    options: [
      "Freada imediata e brusca acionando o pedal até o fim para reestabelecer o atrito.",
      "Redução gradual da velocidade antes da poça e, caso ocorra a flutuação, manter o volante firme, desacelerar suavemente sem pisar nos freios ou girar o volante bruscamente.",
      "Girar o volante rapidamente para a esquerda e para a direita alternadamente para expulsar a água acumulada sob as bandas de rodagem dos pneus.",
      "Aumentar a rotação do motor engatando uma marcha mais forte para forçar os pneus a romper a barreira líquida.",
    ],
    correctIndex: 1,
    explanation:
      "Durante aquaplanagem, frear ou fazer manobras bruscas causa perda definitiva de controle. Deve-se apenas segurar firme o volante e tirar o pé do acelerador.",
    detailedExplanation:
      "Aquaplanagem (ou hidroplanagem) ocorre quando uma lâmina de água se forma entre o pneu e o asfalto, fazendo o veículo 'deslizar' sem contato com o solo. Prevenção: reduzir velocidade na chuva, manter pneus com sulcos mínimos de 1,6 mm (a TWI), calibragem correta e evitar poças. Se acontecer: NÃO freie nem esterce bruscamente — tire o pé do acelerador, segure o volante firme e deixe o veículo retomar o contato com o solo.",
    incidence: "alta",
    difficulty: 3,
  },
  {
    id: "q24",
    category: "primeiros-socorros",
    statement:
      "Em caso de hemorragia externa severa decorrente de trauma sofrido por vítima de sinistro de trânsito, qual a manobra de suporte básico de vida indicada para conter a perda sanguínea de forma segura, até a chegada da equipe de socorro profissional?",
    options: [
      "Aplicar um torniquete com corda ou arame em qualquer ferimento localizado nos membros inferiores.",
      "Efetuar compressão direta sobre a lesão utilizando um pano limpo, exercendo pressão firme e contínua local do sangramento.",
      "Lavar o ferimento com água quente e aplicar pomadas cicatrizantes ou pó hemostático caseiro.",
      "Manter o membro afetado abaixado em relação ao nível do coração para desacelerar o fluxo sanguíneo local.",
    ],
    correctIndex: 1,
    explanation:
      "A compressão direta com pano limpo ou gaze é a técnica prioritária e mais segura para conter hemorragias externas no suporte básico.",
    detailedExplanation:
      "Procedimento correto: (1) use luvas ou saco plástico para se proteger; (2) comprima diretamente sobre o ferimento com pano limpo ou gaze; (3) eleve o membro afetado, se possível, acima do nível do coração; (4) mantenha a compressão até chegada do socorro; (5) NÃO retire o pano se ensopar — coloque outro por cima. Torniquete só em último caso (amputação ou hemorragia incontrolável), pois pode causar perda do membro.",
    commonMistake:
      "A banca induz ao torniquete porque parece 'mais técnico'. ERRADO — primeira escolha é compressão direta.",
    incidence: "media",
    trap: true,
    difficulty: 3,
  },
  {
    id: "q25",
    category: "prioridade",
    statement:
      "O Código de Trânsito Brasileiro (CTB) estabelece que determinados veículos gozam de livre circulação, estacionamento e parada, além de prioridade de trânsito em situações de emergência. Para que essa prerrogativa legal seja plenamente válida nas vias públicas, é necessário que:",
    options: [
      "Sejam veículos de grande porte, como caminhões de carga pesada e ônibus intermunicipais.",
      "Estejam em efetivo serviço de urgência, devidamente identificados por dispositivos regulamentares de alarme sonoro e iluminação intermitente vermelha acionados.",
      "Sejam conduzidos por motoristas profissionais habilitados exclusivamente na categoria E de habilitação.",
      "Trafeguem pelas faixas exclusivas destinadas ao transporte coletivo urbano durante o horário de pico.",
    ],
    correctIndex: 1,
    explanation:
      "A prioridade de passagem exige dispositivos sonoros e luminosos ligados e a efetiva prestação de serviço de emergência.",
    detailedExplanation:
      "Veículos de emergência em serviço urgente — com sirene E giroflex acionados — têm prioridade ABSOLUTA: podem ultrapassar pela direita, transitar acima do limite de velocidade, avançar semáforo vermelho (com cuidado) e estacionar onde for necessário. Demais condutores devem dar passagem encostando à direita. SEM sirene ou giroflex acionados, perdem essa prioridade e seguem as regras gerais.",
    legalBase: "Art. 29, VII e Art. 89 do CTB",
    incidence: "alta",
    difficulty: 3,
  },
  {
    id: "p1",
    category: "placas",
    statement:
      "Ao trafegar por uma via urbana desconhecida, o condutor se aproxima de uma interseção e avista a placa de sinalização representada abaixo, posicionada junto à faixa de retenção pintada no pavimento. Considerando a classificação e o significado das placas de regulamentação do Código de Trânsito Brasileiro (CTB), assinale a conduta que o condutor deve adotar ao se deparar com essa placa:",
    placa: "R-1",
    options: [
      "Reduzir a velocidade e ceder a preferência de passagem aos veículos que circulam pela via transversal, sem necessidade de parada total.",
      "Parar o veículo completamente antes da faixa de retenção, mesmo que não haja nenhum veículo ou pedestre se aproximando, observando o trânsito antes de prosseguir.",
      "Reduzir a velocidade e manter-se pronto para parar apenas se houver veículos se aproximando pelo cruzamento à frente.",
      "Acelerar o veículo para cruzar a interseção antes que qualquer outro veículo alcance o cruzamento, priorizando a fluidez do tráfego.",
    ],
    correctIndex: 1,
    explanation: "R-1 PARE — octogonal, vermelha. Obriga parada total do veículo.",
    detailedExplanation:
      "A placa R-1 (PARE) é a única placa OCTOGONAL do CTB — formato escolhido para que o motorista a reconheça mesmo se estiver suja, virada ou em más condições. Obriga PARADA TOTAL do veículo antes da faixa de retenção, mesmo que não venha ninguém. Desobedecer é infração GRAVÍSSIMA: 7 pontos na CNH e multa.",
    legalBase: "Art. 208 do CTB",
    tip: "Octógono vermelho com letras brancas = sempre PARE.",
    incidence: "altissima",
    difficulty: 1,
  },
  {
    id: "p2",
    category: "placas",
    statement:
      "Um condutor aproxima-se de uma via transversal com a intenção de nela ingressar e avista, junto à interseção, a placa de regulamentação representada abaixo. Considerando a diferença entre os sinais de regulamentação do Código de Trânsito Brasileiro (CTB), assinale o comportamento CORRETO a ser adotado pelo condutor ao se deparar com essa placa:",
    placa: "R-2",
    options: [
      "Parar totalmente o veículo antes de ingressar na via, exatamente como ocorre na placa de parada obrigatória PARE.",
      "Reduzir a velocidade de forma segura e ceder a preferência de passagem aos veículos que já trafegam pela via preferencial, prosseguindo quando houver espaço seguro.",
      "Manter a velocidade constante, pois a placa possui apenas caráter informativo sobre as condições da via à frente.",
      "Acelerar o veículo para ingressar na via antes dos demais veículos, aproveitando qualquer abertura momentânea no fluxo.",
    ],
    correctIndex: 1,
    explanation: "R-2 Dê a Preferência — triângulo invertido, branca com borda vermelha.",
    detailedExplanation:
      "A R-2 é um TRIÂNGULO EQUILÁTERO com a ponta voltada para BAIXO, fundo branco e orla vermelha. Obriga o condutor a reduzir e ceder passagem aos veículos da via preferencial. Diferente do PARE, não exige parada total se a via estiver livre — basta dar a preferência.",
    commonMistake:
      "Muitos confundem com PARE. Lembre: triângulo invertido = preferência; octógono = PARE.",
    incidence: "altissima",
    trap: true,
    difficulty: 1,
  },
  {
    id: "p3",
    category: "placas",
    statement:
      "Ao procurar uma vaga para estacionar em uma rua central de movimento intenso, um condutor avista, afixada em um poste, a placa de regulamentação representada abaixo. Considerando o significado das placas de restrição de estacionamento do Código de Trânsito Brasileiro (CTB), assinale a alternativa que descreve CORRETAMENTE o que essa placa determina:",
    placa: "R-6a",
    options: [
      "É proibida qualquer tipo de parada no trecho, inclusive a parada rápida para embarque ou desembarque de passageiros.",
      "É proibido estacionar o veículo no trecho sinalizado, porém a parada rápida para embarque ou desembarque de passageiros permanece permitida.",
      "É permitido estacionar no trecho apenas nos horários indicados em placa complementar fixada abaixo do sinal.",
      "É obrigatório estacionar o veículo somente no lado direito da via, mantendo a mão de direção preferencial.",
    ],
    correctIndex: 1,
    explanation: "R-6a Proibido Estacionar — círculo branco com 'E' cortado por linha vermelha.",
    detailedExplanation:
      "A R-6a proíbe ESTACIONAR (deixar o veículo parado por tempo prolongado), mas PERMITE parada rápida para embarque/desembarque de passageiros ou carga/descarga. Estacionar onde a placa proíbe é infração MÉDIA: 4 pontos e multa, com possível remoção do veículo.",
    commonMistake:
      "Não confunda com R-6b (Proibido Parar e Estacionar — tem um X). Esta só proíbe ESTACIONAR.",
    legalBase: "Art. 181 do CTB",
    tip: "Letra E cortada = só proíbe Estacionar.",
    incidence: "altissima",
    difficulty: 1,
  },
  {
    id: "p4",
    category: "placas",
    statement:
      "Durante o trajeto pelo centro da cidade, um condutor observa duas placas de regulamentação diferentes afixadas em trechos distintos da via: uma com a letra 'E' cortada por um traço diagonal e outra com um 'X' vermelho, representada abaixo. Considerando a diferença prática entre essas sinalizações, assinale a alternativa que explica corretamente o significado da placa apresentada:",
    placa: "R-6b",
    options: [
      "A placa tem o mesmo significado da placa com a letra 'E' cortada, proibindo apenas o estacionamento prolongado no trecho.",
      "A placa é mais restritiva e proíbe qualquer tipo de parada no trecho, inclusive a parada rápida para embarque, desembarque ou carga e descarga.",
      "A placa proíbe apenas a parada de veículos pesados e de grande porte, liberando a parada de veículos de passeio.",
      "A placa indica que o estacionamento é permitido apenas no período noturno, entre 22h e 6h, nos trechos por ela sinalizados.",
    ],
    correctIndex: 1,
    explanation: "R-6b Proibido Parar e Estacionar — X vermelho em círculo branco.",
    detailedExplanation:
      "A R-6b é MAIS RESTRITIVA que a R-6a: proíbe QUALQUER tipo de parada, mesmo para embarque/desembarque. Comum em frente a hospitais, escolas em horário de movimento, pontes e túneis. Parar onde a placa proíbe é infração GRAVE: 5 pontos e multa.",
    commonMistake: "X = proíbe TUDO (parar e estacionar). Apenas E cortado = só estacionar.",
    incidence: "alta",
    difficulty: 2,
  },
  {
    id: "p5",
    category: "placas",
    statement:
      "Ao trafegar por uma avenida arterial, o condutor avista sobre a pista a placa de regulamentação representada abaixo, que estabelece o valor numérico máximo permitido para a via. Considerando as consequências legais do descumprimento das placas de regulamentação de velocidade, assinale a alternativa que indica corretamente o que ocorre com o condutor que ultrapassa o valor indicado na placa:",
    placa: "R-19",
    options: [
      "O condutor receberá apenas uma advertência verbal da autoridade de trânsito, sem qualquer penalidade pecuniária na primeira ocorrência.",
      "O condutor cometerá infração de trânsito cuja gravidade varia conforme o excesso: média até 20%, grave de 20% a 50% e gravíssima acima de 50% do limite.",
      "O condutor receberá uma multa de valor fixo e único, independentemente de quanto excedeu o limite máximo regulamentado da via.",
      "O condutor terá seu veículo apreendido imediatamente no ato da fiscalização, sem possibilidade de regularização posterior.",
    ],
    correctIndex: 1,
    explanation: "R-19 Velocidade Máxima Permitida — limite que NÃO pode ser ultrapassado.",
    detailedExplanation:
      "A R-19 informa o limite MÁXIMO de velocidade naquele trecho. Trafegar acima é infração que varia conforme o excesso: até 20% acima = média (4 pts); 20% a 50% = grave (5 pts); acima de 50% = gravíssima x3 (7 pts + suspensão). A velocidade MÍNIMA tem placa diferente (R-20), redonda azul.",
    commonMistake:
      "Pegadinha clássica: confundir com velocidade mínima. Borda vermelha = proibição = não ultrapassar = MÁXIMA.",
    legalBase: "Art. 218 do CTB",
    incidence: "alta",
    trap: true,
    difficulty: 1,
  },
  {
    id: "p6",
    category: "placas",
    statement:
      "Ao dirigir por uma estrada serrana de pista estreita, o condutor avista a placa de advertência representada abaixo, posicionada alguns metros antes de um trecho sinuoso. Considerando o significado das placas de advertência do Código de Trânsito Brasileiro (CTB), assinale a ação que o condutor deve adotar com a devida antecedência ao se deparar com essa sinalização:",
    placa: "A-1a",
    options: [
      "Aumentar a velocidade para atravessar o trecho sinuoso rapidamente, reduzindo o tempo de exposição ao risco.",
      "Manter a velocidade constante, pois a placa possui apenas caráter informativo sobre a geometria da via à frente.",
      "Reduzir a velocidade de forma gradual e segura antes de entrar na curva acentuada à esquerda, evitando o uso do freio no interior da curva.",
      "Acender a seta e mudar de faixa imediatamente para se posicionar na pista contrária, garantindo um melhor raio de curva.",
    ],
    correctIndex: 2,
    explanation: "A-1a Curva Acentuada à Esquerda — advertência (losango amarelo).",
    detailedExplanation:
      "Placa de ADVERTÊNCIA (série A): losango amarelo com símbolo preto. Avisa curva fechada à esquerda à frente — reduza a velocidade ANTES de entrar na curva. 'Acentuada' significa raio menor (curva mais fechada) do que a A-2 (curva normal).",
    tip: "Losango amarelo = atenção, perigo à frente. Vermelho seria obrigação.",
    incidence: "alta",
    difficulty: 1,
  },
  {
    id: "p7",
    category: "placas",
    statement:
      "Ao se aproximar de um trecho urbano de grande circulação de pessoas, o condutor avista no canteiro central a placa de advertência representada abaixo, sinalizando uma situação adiante na via. Considerando o significado das placas de advertência do Código de Trânsito Brasileiro (CTB) e a necessidade de proteção aos usuários mais vulneráveis da via, assinale a alternativa que indica o alerta transmitido por essa placa:",
    placa: "A-32b",
    options: [
      "Que há uma instituição de ensino nas proximidades e que a velocidade deve ser drasticamente reduzida nos horários de entrada e saída de alunos.",
      "Que há uma faixa de travessia de pedestres à frente e que o condutor deve estar pronto para parar e conceder a preferência de passagem aos pedestres.",
      "Que é proibido o trânsito de pedestres naquele trecho da via, devendo o condutor manter a velocidade de cruzeiro.",
      "Que há uma passagem de animais silvestres na pista, exigindo atenção redobrada em períodos de baixa visibilidade.",
    ],
    correctIndex: 1,
    explanation:
      "A-32b Passagem Sinalizada de Pedestres — alerta para faixa de travessia à frente.",
    detailedExplanation:
      "Adverte que há uma FAIXA DE PEDESTRES próxima. O condutor deve reduzir a velocidade e estar pronto para parar e dar preferência. Atropelar pedestre na faixa é circunstância agravante. Não confundir com A-33a (Área Escolar), que mostra duas crianças.",
    commonMistake: "Adulto + faixa zebrada = passagem de pedestres. Duas crianças = área escolar.",
    incidence: "alta",
    difficulty: 2,
  },
  {
    id: "p8",
    category: "placas",
    statement:
      "Ao trafegar por uma via que margeia uma instituição de ensino em horário de entrada dos alunos, o condutor avista a placa de advertência representada abaixo. Considerando o significado dessa sinalização e as práticas de direção defensiva, assinale a alternativa que indica o comportamento que o condutor deve adotar nesse local:",
    placa: "A-33a",
    options: [
      "Manter a velocidade habitual, pois a placa possui apenas caráter informativo sobre a existência de um estabelecimento educacional na região.",
      "Reduzir a velocidade, redobrar a atenção e estar preparado para parar diante da entrada e saída de crianças, especialmente nos horários de início e término das aulas.",
      "Considerar o trecho como totalmente interditado ao trânsito de veículos motorizados em qualquer horário do dia.",
      "Parar obrigatoriamente o veículo em qualquer condição, ainda que não haja crianças ou pedestres atravessando a via.",
    ],
    correctIndex: 1,
    explanation: "A-33a Área Escolar — duas crianças, advertência.",
    detailedExplanation:
      "Sinaliza proximidade de ESCOLA. Em geral acompanhada de redução de velocidade (R-19) e faixas pintadas no asfalto. Velocidade em área escolar costuma ser 30-40 km/h, e a fiscalização é rigorosa nos horários de entrada/saída.",
    incidence: "media",
    difficulty: 1,
  },
  {
    id: "p9",
    category: "placas",
    statement:
      "Em uma interseção urbana, o condutor avista afixada a placa de regulamentação representada abaixo, que impõe uma obrigação de trajetória aos veículos. Considerando a classificação das placas de regulamentação do Código de Trânsito Brasileiro (CTB) e o significado específico dessa sinalização, assinale a alternativa que indica corretamente quais manobras são permitidas ou proibidas ao condutor:",
    placa: "R-25d",
    options: [
      "O condutor não pode parar o veículo no trecho, porém pode realizar conversão tanto à direita quanto à esquerda no cruzamento.",
      "O condutor não pode virar à direita nem à esquerda, sendo obrigado a prosseguir em frente seguindo a trajetória imposta pela placa.",
      "O condutor não pode ultrapassar outros veículos no trecho, mas permanece livre para realizar mudanças de faixa conforme a necessidade.",
      "O condutor não pode estacionar o veículo, permanecendo autorizado a realizar qualquer manobra de conversão no cruzamento.",
    ],
    correctIndex: 1,
    explanation: "R-25d Siga em Frente Obrigatório — regulamentação azul circular.",
    detailedExplanation:
      "Placa de REGULAMENTAÇÃO de fundo AZUL: indica obrigação (e não proibição). Aqui obriga o condutor a seguir em frente — não pode virar à direita nem à esquerda. As placas R-25 (sentido obrigatório) variam: R-25a esquerda, R-25b direita, R-25c esquerda e frente, R-25d frente.",
    tip: "Azul = obrigação (faça assim). Vermelho = proibição (não faça).",
    incidence: "media",
    difficulty: 2,
  },
  {
    id: "p10",
    category: "placas",
    statement:
      "Ao circular por uma via urbana em um bairro comercial, o condutor avista a placa de sinalização representada abaixo, afixada em um ponto de orientação do trajeto. Considerando a classificação da sinalização vertical do Código de Trânsito Brasileiro (CTB), assinale a alternativa que indica corretamente o que essa placa comunica ao condutor:",
    placa: "I-Hospital",
    options: [
      "Que existe um posto de abastecimento de combustível à frente, indicando a localização de um serviço auxiliar da via.",
      "Que há um hospital nas proximidades, tratando-se de uma placa de indicação de serviço auxiliar de caráter meramente informativo, sem impor qualquer obrigação ao condutor.",
      "Que o trânsito está interditado naquele trecho por razões de emergência hospitalar, sendo obrigatório desviar do local.",
      "Que o condutor deve estacionar o veículo e aguardar a liberação do tráfego pelos funcionários do hospital.",
    ],
    correctIndex: 1,
    explanation: "Placa de Indicação de Serviço Auxiliar — Hospital.",
    detailedExplanation:
      "Placas de INDICAÇÃO de serviços auxiliares têm fundo AZUL com símbolo branco. Informam ao condutor a presença de serviços úteis: hospital (cruz), posto de gasolina (P/bomba), telefone, restaurante, hospedagem etc. São apenas informativas — não obrigam nada.",
    incidence: "media",
    difficulty: 1,
  },
  {
    id: "q26",
    category: "legislacao",
    statement:
      "Um jovem candidato, recém-completando a maioridade civil e penal, decide iniciar o processo de habilitação para conduzir veículos das categorias A e B. Ao dar entrada no processo junto a um Centro de Formação de Condutores (CFC), ele questiona o instrutor sobre o requisito de idade mínima imposto pelo Código de Trânsito Brasileiro (CTB) para pleitear essas categorias. Assinale a alternativa que apresenta corretamente esse requisito legal:",
    options: [
      "Completar 16 anos de idade, desde que o candidato seja emancipado por sentença judicial e apresente autorização expressa dos responsáveis legais perante o cartório.",
      "Completar 17 anos de idade, condicionado à aprovação prévia em avaliação psicológica de maturidade emocional realizada pelo órgão executivo de trânsito.",
      "Completar 18 anos de idade, ser penalmente imputável, saber ler e escrever, possuir documento de identidade e CPF e ser aprovado nos exames de aptidão física e mental e nas avaliações teórica e prática.",
      "Completar 21 anos de idade, exigência que se aplica de forma idêntica a todas as categorias de habilitação, inclusive para automóveis de passeio e motocicletas.",
    ],
    correctIndex: 2,
    explanation: "18 anos completos, saber ler e escrever, e possuir CPF.",
    detailedExplanation:
      "Para tirar a CNH nas categorias A (moto) e B (carro), o candidato precisa ter no mínimo 18 anos completos, ser penalmente imputável, saber ler e escrever e possuir documento de identidade e CPF. Para as categorias C, D e E há ainda requisitos adicionais de tempo de habilitação.",
    legalBase: "Art. 140 do CTB",
    incidence: "alta",
    difficulty: 1,
  },
  {
    id: "q27",
    category: "legislacao",
    statement:
      "Um condutor habilitado na categoria B pretende ampliar sua habilitação para a categoria D, com o objetivo de conduzir veículos de transporte coletivo de passageiros, como ônibus e vans de transporte escolar. Considerando os requisitos de idade, tempo de habilitação e conduta previstos no Código de Trânsito Brasileiro (CTB) e na Resolução CONTRAN aplicável, assinale a alternativa que apresenta corretamente as condições exigidas para a obtenção da categoria D:",
    options: [
      "Ter completado 18 anos e estar habilitado na categoria B há pelo menos 1 ano, independentemente de ter cometido infrações de trânsito nesse período.",
      "Ter no mínimo 21 anos, estar habilitado há pelo menos 2 anos na categoria B (ou 1 ano na categoria C) e não ter cometido infração grave ou gravíssima nos últimos 12 meses.",
      "Apenas efetuar o pagamento das taxas do órgão executivo de trânsito e apresentar comprovante de residência, dispensando novos exames por já possuir habilitação anterior.",
      "Ter completado 25 anos e possuir curso superior em qualquer área do conhecimento, requisito obrigatório para todos os condutores de veículos de transporte coletivo.",
    ],
    correctIndex: 1,
    explanation:
      "D = 21 anos + habilitado há pelo menos 2 anos na B (ou 1 ano na C) + ficha limpa.",
    detailedExplanation:
      "Cada categoria de CNH exigida para transporte de passageiros ou carga tem requisitos de idade e tempo de habilitação. Categoria D (veículos com mais de 8 lugares, como ônibus e vans escolares): mínimo 21 anos, estar habilitado há pelo menos 2 anos na categoria B ou 1 ano na C, e não ter cometido infração grave ou gravíssima nos últimos 12 meses. A categoria E (caminhões com reboque) exige 21 anos e 1 ano na C. É importante decorar esses pré-requisitos para não cair na pegadinha da idade mínima (21, não 18 ou 25).",
    legalBase: "Art. 145 do CTB",
    incidence: "media",
    difficulty: 2,
  },
  {
    id: "q28",
    category: "legislacao",
    statement:
      "Durante a análise do prontuário de um condutor, o órgão executivo de trânsito identifica a ocorrência de autuações repetidas e precisa aplicar corretamente a regra da reincidência prevista no Código de Trânsito Brasileiro (CTB), que agrava a penalidade com a cobrança de multa em dobro. Considerando o conceito legal de reincidência estabelecido pelo CTB, assinale a alternativa que define corretamente quando o condutor é considerado reincidente:",
    options: [
      "Quando comete duas ou mais infrações de naturezas distintas em datas diferentes, independentemente de se tratar do mesmo tipo de infração.",
      "Quando comete a mesma infração de trânsito por mais de uma vez no período de 12 meses, aplicando-se a multa em dobro na nova autuação.",
      "Quando acumula determinada pontuação em seu prontuário, bastando atingir o limite de pontos previsto em lei para ser considerado reincidente.",
      "Quando é autuado pela primeira vez em uma unidade federativa diferente daquela em que obteve sua habilitação, ainda que seja a primeira infração.",
    ],
    correctIndex: 1,
    explanation: "Reincidência = mesma infração dentro de 12 meses, com multa em dobro.",
    detailedExplanation:
      "Reincidência no CTB é um conceito específico: cometer a MESMA infração (mesmo artigo) duas ou mais vezes no período de 12 meses. Não é simplesmente cometer infrações diferentes — a alternativa A fala em 'duas infrações em datas distintas' (que seria pegadinha), enquanto a reincidência exige que seja o mesmo tipo de infração. Consequência: multa multiplicada por 2 (dobro) na reincidência. Para infrações médias, a reincidência também impede a transformação da PPD em CNH definitiva. Atenção: não confunda reincidência com acúmulo de pontos ou suspensão.",
    legalBase: "Art. 259, §1º do CTB",
    incidence: "media",
    difficulty: 2,
  },
  {
    id: "q29",
    category: "legislacao",
    statement:
      "Um condutor comum deseja saber a partir de qual limite de pontuação no período de doze meses seu direito de dirigir pode ser suspenso, considerando as alterações introduzidas no Código de Trânsito Brasileiro (CTB) pela Lei 14.071/2021. Assinale a alternativa que apresenta corretamente o atual sistema de limites de pontos para a instauração do processo de suspensão do direito de dirigir:",
    options: [
      "O limite é fixo em 20 pontos no período de doze meses, independentemente da natureza ou da gravidade das infrações cometidas pelo condutor.",
      "O limite varia conforme as infrações cometidas: 40 pontos quando não houver nenhuma infração gravíssima, 30 pontos com uma gravíssima e 20 pontos com duas ou mais gravíssimas no período.",
      "O limite é sempre de 14 pontos para qualquer condutor, independentemente da categoria de habilitação ou da natureza das infrações acumuladas.",
      "A suspensão por pontuação somente ocorre após o condutor cometer ao menos uma infração de natureza gravíssima, não havendo limite de pontos nos demais casos.",
    ],
    correctIndex: 1,
    explanation:
      "Hoje: 40 pontos sem gravíssima; 30 pontos com 1 gravíssima; 20 pontos com 2+ gravíssimas. EAR é sempre 40.",
    detailedExplanation:
      "A Lei 14.071/2021 mudou o sistema de suspensão por pontuação, que antes era fixo em 20 pontos. Agora o limite varia conforme a gravidade das infrações cometidas: 40 pontos se NENHUMA infração for gravíssima; 30 pontos se houver UMA infração gravíssima; 20 pontos se houver DUAS OU MAIS infrações gravíssimas. O condutor que exerce atividade remunerada (EAR) tem limite fixo de 40 pontos independentemente das infrações. Essa é uma das matérias mais cobradas nas provas do DETRAN, sempre com pegadinha nos valores.",
    legalBase: "Art. 261 do CTB (Lei 14.071/2021)",
    commonMistake: "A regra dos '20 pontos' fixos é antiga — caiu em 2021.",
    incidence: "altissima",
    trap: true,
    difficulty: 3,
  },
  {
    id: "q30",
    category: "legislacao",
    statement:
      "Durante uma fiscalização de rotina em rodovia federal, um condutor é abordado por agentes que solicitam a apresentação dos documentos de porte obrigatório relativos a ele próprio e ao veículo. Considerando as disposições do Código de Trânsito Brasileiro (CTB) e das resoluções do CONTRAN sobre documentação, assinale a alternativa que indica corretamente quais documentos o condutor deve apresentar para circular legalmente:",
    options: [
      "A Carteira Nacional de Habilitação (CNH) ou a Permissão para Dirigir (PPD) e o Certificado de Registro e Licenciamento do Veículo (CRLV), sendo igualmente válidas as versões física e digital (CDT e CRLV-e).",
      "Apenas o Certificado de Registro e Licenciamento do Veículo (CRLV), pois a habilitação do condutor é verificada exclusivamente pelo sistema informatizado do agente.",
      "Somente a Carteira Nacional de Habilitação (CNH), uma vez que o licenciamento do veículo é consultado em tempo real sem necessidade de apresentação documental.",
      "O CRLV acompanhado do comprovante impresso de pagamento do IPVA, sendo dispensada a apresentação da CNH durante a fiscalização.",
    ],
    correctIndex: 0,
    explanation: "CNH + CRLV em dia. Versões digitais (CDT/CRLV-e) têm o mesmo valor legal.",
    detailedExplanation:
      "Para circular legalmente, o condutor deve portar a CNH ou PPD (Permissão para Dirigir) e o CRLV (Certificado de Registro e Licenciamento do Veículo). Ambos podem ser apresentados em formato digital — CNH Digital (CDT) e CRLV-e — que têm o mesmo valor legal dos documentos físicos. O comprovante de IPVA pago não precisa ser levado no veículo; o sistema do DETRAN já verifica o débito automaticamente no momento do licenciamento. Atenção: o CRLV precisa estar dentro da validade (renovado anualmente).",
    legalBase: "Art. 159 do CTB",
    incidence: "alta",
    difficulty: 1,
  },
  {
    id: "q31",
    category: "infracoes",
    statement:
      "Em um estacionamento de shopping center aberto ao público, um condutor deixa seu veículo em uma vaga sinalizada para Pessoas com Deficiência (PCD), sem exibir sobre o painel a credencial de estacionamento emitida pelo órgão de trânsito competente. Considerando a classificação das infrações prevista no Código de Trânsito Brasileiro (CTB), assinale a alternativa que indica corretamente a natureza dessa infração e suas consequências:",
    options: [
      "Infração leve, punida apenas com advertência verbal ou por escrito, sem acúmulo de pontos na CNH e sem qualquer medida administrativa sobre o veículo.",
      "Infração média, punida com multa e acúmulo de 4 pontos na CNH, sem previsão de remoção do veículo do local de estacionamento.",
      "Infração grave, punida com multa e acúmulo de 5 pontos, podendo ser convertida em advertência caso a vaga estivesse desocupada por longo período.",
      "Infração gravíssima, punida com multa e acúmulo de 7 pontos na CNH, além da medida administrativa de remoção do veículo.",
    ],
    correctIndex: 3,
    explanation: "Gravíssima — 7 pontos e multa. Mesmo vale para vaga de idoso (grave).",
    detailedExplanation:
      "Estacionar em vaga reservada a pessoa com deficiência sem a credencial de estacionamento (que deve estar visível sobre o painel) é infração GRAVÍSSIMA: 7 pontos na CNH e multa. Já estacionar em vaga de idoso (pessoas com 60+) é infração GRAVE (5 pontos). A diferença de gravidade existe porque as vagas para PCD têm proteção legal mais rigorosa. A credencial é emitida pelo órgão de trânsito municipal e deve estar sempre visível. Atenção: mesmo que a vaga esteja vazia, não é permitido usar sem a credencial.",
    legalBase: "Art. 181, XVII do CTB",
    incidence: "alta",
    difficulty: 1,
  },
  {
    id: "q32",
    category: "infracoes",
    statement:
      "Durante uma operação de fiscalização em via urbana, um condutor é abordado e, ao solicitar seus documentos, os agentes constatam que ele nunca obteve Carteira Nacional de Habilitação (CNH) nem Permissão para Dirigir (PPD), conduzindo o veículo sem qualquer habilitação. Considerando a classificação punitiva do Código de Trânsito Brasileiro (CTB), assinale a alternativa que indica corretamente a natureza dessa infração e as medidas administrativas aplicáveis:",
    options: [
      "Infração leve, punida com advertência por escrito na primeira autuação, sem multa e sem retenção do veículo.",
      "Infração média, punida com multa e acúmulo de 4 pontos, permitindo que o condutor prossiga mediante assinatura de termo de compromisso.",
      "Infração grave, punida com multa e acúmulo de 5 pontos, sem previsão de retenção do veículo por se tratar de conduta meramente documental.",
      "Infração gravíssima, punida com multa multiplicada por três vezes e retenção do veículo até a apresentação de condutor habilitado, podendo ainda configurar crime de trânsito.",
    ],
    correctIndex: 3,
    explanation: "Gravíssima — multa x3, e pode configurar crime se gerar perigo.",
    detailedExplanation:
      "Dirigir sem ser habilitado (sem CNH ou PPD) é infração GRAVÍSSIMA com multa multiplicada por 3 (fator 3). Além disso, se o ato de dirigir sem habilitação gerar perigo de dano a alguém, pode configurar o crime previsto no art. 309 do CTB, com detenção de 6 meses a 1 ano. Se o condutor tem CNH, mas não a porta no momento da abordagem, é infração LEVE (art. 232). A prova costuma cobrar essa diferença: dirigir SEM CNH é gravíssima, mas dirigir SEM PORTAR a CNH é leve. Fique atento!",
    legalBase: "Art. 162, I do CTB",
    incidence: "alta",
    difficulty: 1,
  },
  {
    id: "q33",
    category: "infracoes",
    statement:
      "Ao planejar um passeio em família com seu automóvel, o condutor pretende acomodar sua filha de 6 anos no banco dianteiro do passageiro, sob a alegação de que ela se sente mais confortável e tem visão privilegiada da viagem. Considerando as normas de segurança para o transporte de crianças previstas no Código de Trânsito Brasileiro (CTB) e na Resolução CONTRAN aplicável, assinale a alternativa que indica corretamente a classificação da infração cometida nessa situação:",
    options: [
      "Infração leve, punida com multa e acúmulo de 3 pontos, sem qualquer medida administrativa sobre o veículo.",
      "Infração média, punida com multa e acúmulo de 4 pontos, sendo permitido prosseguir com a criança acomodada no banco dianteiro.",
      "Infração grave, punida com multa e acúmulo de 5 pontos, sem necessidade de retenção ou remoção do veículo.",
      "Infração gravíssima, punida com multa e acúmulo de 7 pontos na CNH, pois crianças menores de 10 anos devem ser transportadas no banco traseiro em dispositivo de retenção adequado.",
    ],
    correctIndex: 3,
    explanation: "Gravíssima — crianças até 10 anos vão atrás, em dispositivo adequado à idade.",
    detailedExplanation:
      "Crianças com até 10 anos de idade (ou que ainda não tenham atingido 1,45 m de altura) DEVEM ser transportadas no banco traseiro, em dispositivo de retenção adequado conforme a faixa etária: bebê conforto (até 1 ano), cadeirinha (1 a 4 anos), assento de elevação (4 a 7,5 anos) e cinto de segurança (após). A infração por descumprir essa regra é GRAVÍSSIMA: 7 pontos na CNH e multa. Muitos alunos erram achando que é 'grave', mas a banca classifica como gravíssima justamente pela gravidade do risco à vida da criança.",
    legalBase: "Art. 168 do CTB / Res. CONTRAN 277",
    commonMistake: "Não é 'grave' — é GRAVÍSSIMA. Bancas confundem para derrubar.",
    incidence: "alta",
    trap: true,
    difficulty: 2,
  },
  {
    id: "q34",
    category: "infracoes",
    statement:
      "Dois condutores são flagrados pela Polícia Rodoviária realizando uma disputa de velocidade e arrancadas rápidas em via pública aberta à circulação, colocando em risco a segurança dos demais usuários da via. Considerando a gravidade dessa conduta e as penalidades previstas no Código de Trânsito Brasileiro (CTB), assinale a alternativa que classifica corretamente a infração cometida e suas consequências legais:",
    options: [
      "Infração média, punida com multa e acúmulo de 4 pontos na CNH, sem previsão de recolhimento de documentos ou remoção do veículo.",
      "Infração grave, punida com multa e acúmulo de 5 pontos, com possibilidade de conversão em advertência caso não haja danos materiais.",
      "Infração gravíssima com multa multiplicada por dez vezes, suspensão do direito de dirigir, recolhimento da CNH e remoção do veículo, além de configurar crime de trânsito.",
      "Apenas uma advertência verbal do agente de trânsito, desde que a disputa seja encerrada imediatamente e sem vítimas.",
    ],
    correctIndex: 2,
    explanation:
      "Gravíssima x10 + suspensão da CNH + crime (art. 308 do CTB, detenção 6 meses a 3 anos).",
    detailedExplanation:
      "Disputar corrida ('racha') em via pública é uma das infrações mais graves do CTB. É classificada como GRAVÍSSIMA com fator multiplicador 10 — ou seja, a multa-base é multiplicada por 10, resultando em um valor altíssimo. Além da multa, gera suspensão imediata do direito de dirigir e recolhimento da CNH. Também configura CRIME DE TRÂNSITO (art. 308), com detenção de 6 meses a 3 anos, multa e suspensão da habilitação. Diferencia-se da simples 'manobra perigosa' (art. 175, gravíssima x3), pois o racha envolve disputa de velocidade entre dois ou mais veículos.",
    legalBase: "Art. 173 e 308 do CTB",
    incidence: "media",
    difficulty: 1,
  },
  {
    id: "q35",
    category: "direcao-defensiva",
    statement:
      "Durante uma aula prática de direção defensiva, o instrutor orienta o aluno habilitando sobre a importância de realizar a verificação visual lateral, por cima do ombro, antes de qualquer mudança de faixa, mesmo com os retrovisores corretamente ajustados. O instrutor explica que existe uma região ao redor do veículo que não é captada pelos espelhos convencionais. Assinale a alternativa que define corretamente o que são os denominados 'pontos cegos' do veículo:",
    options: [
      "Regiões laterais e traseiras ao redor do veículo que não são visíveis pelos retrovisores interno e externos, em geral obstruídas pelas colunas da carroceria, exigindo verificação visual lateral direta antes de manobrar.",
      "Áreas internas do habitáculo que permanecem na penumbra durante o período noturno, dificultando a visualização dos passageiros pelo condutor.",
      "Pontos específicos da banda de rodagem dos pneus onde o desgaste ocorre de forma acelerada, indicando a necessidade de balanceamento e rodízio.",
      "Manchas ou opacidades no para-brisa que prejudicam a visibilidade frontal quando o veículo é exposto à incidência direta dos raios solares.",
    ],
    correctIndex: 0,
    explanation:
      "São áreas não visíveis pelos espelhos — sempre olhe por cima do ombro antes de mudar de faixa.",
    detailedExplanation:
      "Os pontos cegos (ou 'ângulos mortos') são regiões ao redor do veículo que não podem ser vistas pelos retrovisores interno e externos, geralmente situadas nas laterais traseiras, obstruídas pelas colunas da carroceria. Um motociclista ou carro pequeno pode 'desaparecer' nesses pontos. Por isso, a direção defensiva ensina: antes de mudar de faixa ou fazer conversão, o condutor deve olhar rapidamente por cima do ombro (over-the-shoulder check) para verificar se há alguém no ponto cego. Ajustar corretamente os retrovisores reduz, mas não elimina, essas áreas.",
    incidence: "alta",
    difficulty: 1,
  },
  {
    id: "q36",
    category: "direcao-defensiva",
    statement:
      "Ao conduzir um veículo automotor por uma serra com declive acentuado e de longa extensão, o condutor percebe a necessidade de controlar a velocidade do veículo de forma contínua, preocupando-se com o risco de superaquecimento do sistema de freios por atrito. Considerando as técnicas de Direção Defensiva e as normas do Código de Trânsito Brasileiro (CTB), assinale a conduta CORRETA a ser adotada nessa situação:",
    options: [
      "Engrenar a marcha neutra (ponto morto) para permitir que a força da gravidade atue livremente, acionando o freio de serviço intermitentemente para poupar o sistema hidráulico.",
      "Transitar com o veículo desengrenado em declive, visando à economia de combustível, efetuando frenagens bruscas apenas quando a velocidade ultrapassar o limite da via.",
      "Manter o veículo engrenado em marcha reduzida, utilizando a compressão do motor como freio-motor para auxiliar na retenção da velocidade de forma segura, acionando o freio apenas pontualmente.",
      "Manter o pedal do freio continuamente pressionado ao longo de toda a descida, mantendo uma marcha alta engatada para evitar que o motor atinja rotações elevadas.",
    ],
    correctIndex: 2,
    explanation: "Marcha reduzida + freio motor evita superaquecimento dos freios.",
    detailedExplanation:
      "Descer em ponto morto (banguela) é PROIBIDO (infração média) e perigoso — o motorista perde o freio motor, exigindo demais do sistema hidráulico, que pode superaquecer e falhar. O correto é engatar marcha reduzida (2ª ou 3ª) e deixar o motor segurar o carro.",
    legalBase: "Art. 231, IX do CTB",
    commonMistake: "Descer em 'N' parece economizar — mas é infração e perigosíssimo.",
    incidence: "alta",
    trap: true,
    difficulty: 2,
  },
  {
    id: "q37",
    category: "direcao-defensiva",
    statement:
      "Em uma rodovia de pista dupla com fluxo intenso, o condutor de um automóvel de passeio identifica que o veículo à sua frente está trafegando em velocidade reduzida e decide realizar uma manobra de ultrapassagem de forma segura. Considerando as técnicas de Direção Defensiva e as regras de circulação do Código de Trânsito Brasileiro (CTB), assinale a alternativa que apresenta o procedimento correto a ser adotado antes e durante a ultrapassagem:",
    options: [
      "Acelerar imediatamente e deslocar-se para a faixa da esquerda sem qualquer sinalização, confiando na rapidez da manobra para evitar colisões.",
      "Verificar a visibilidade e a sinalização do trecho, sinalizar a intenção com a seta para a esquerda, checar retrovisores e ponto cego e acelerar com segurança para concluir a manobra.",
      "Buzinar continuamente contra o veículo da frente para obrigá-lo a acelerar ou desviar para o acostamento e liberar a faixa.",
      "Acender o pisca-alerta e manter a distância, pois a ultrapassagem só pode ser realizada após o veículo da frente parar voluntariamente no acostamento.",
    ],
    correctIndex: 1,
    explanation: "Ultrapassagem segura = visibilidade + seta + espelhos + ponto cego.",
    detailedExplanation:
      "A sequência correta para uma ultrapassagem segura é: (1) verificar se há visibilidade suficiente e sinalização que permita a manobra (faixa tracejada); (2) sinalizar com a seta para a esquerda; (3) checar os retrovisores e o ponto cego; (4) acelerar com segurança, fazer a ultrapassagem e retornar à faixa; (5) sinalizar com a seta para a direita ao retornar. Buzinar ou acender pisca-alerta não faz parte do procedimento correto. A pressa ou a falta de checagem do ponto cego é uma das principais causas de colisões laterais em rodovias.",
    incidence: "alta",
    difficulty: 1,
  },
  {
    id: "q38",
    category: "direcao-defensiva",
    statement:
      "Um condutor realiza viagem frequente por uma rodovia de pista simples e, em determinado trecho, precisa ultrapassar um veículo de carga que segue em baixa velocidade. Antes de iniciar a manobra, ele avalia as condições do trecho para verificar se a ultrapassagem é legalmente permitida. Considerando as regras de circulação e sinalização do Código de Trânsito Brasileiro (CTB), assinale a alternativa que indica em qual situação a ultrapassagem é PROIBIDA:",
    options: [
      "Em trechos de reta com boa visibilidade e sinalização de faixa tracejada, que permitem a manobra com segurança.",
      "Em pontes, viadutos, túneis, curvas, aclives sem visibilidade e sobre faixa contínua, que sinalizam a proibição de ultrapassagem.",
      "Em qualquer rodovia federal, independentemente da sinalização horizontal do trecho percorrido.",
      "Durante o período diurno, quando o fluxo de veículos em sentido contrário dificulta a avaliação da distância de segurança.",
    ],
    correctIndex: 1,
    explanation:
      "Ultrapassagem proibida em pontes, viadutos, túneis, curvas, aclives sem visibilidade e faixa contínua.",
    detailedExplanation:
      "O CTB lista locais onde é proibido ultrapassar por questão de segurança: pontes, viadutos, túneis, curvas, aclives (subidas) sem visibilidade suficiente e onde houver faixa contínua (simples ou dupla) no sentido do veículo. A faixa contínua indica proibição de ultrapassagem, enquanto a tracejada permite com segurança. Ultrapassar em local proibido é infração GRAVÍSSIMA com multa multiplicada por 5 (fator 5), uma das multas mais caras do CTB. Atenção: não é proibido apenas 'em rodovias' — o que define a proibição é a sinalização e o local.",
    legalBase: "Art. 203 do CTB",
    incidence: "alta",
    difficulty: 1,
  },
  {
    id: "q39",
    category: "primeiros-socorros",
    statement:
      "Após uma colisão em via urbana, um socorrista leigo encontra uma vítima caída ao lado do veículo queixando-se de forte dor no braço, com deformidade visível no antebraço, indicando provável fratura. Até a chegada da equipe do SAMU, o socorrista precisa decidir como proceder para evitar o agravamento da lesão. Assinale a alternativa que apresenta a conduta CORRETA de primeiros socorros nessa situação:",
    options: [
      "Tentar recolocar o osso fraturado em sua posição anatômica, realizando tração manual no membro para aliviar a dor da vítima.",
      "Imobilizar o membro na posição em que se encontra, utilizando talas improvisadas e ataduras sem apertar demais, aguardando a chegada do socorro especializado.",
      "Movimentar a vítima ativamente e testar os movimentos do membro lesionado para avaliar a extensão da fratura.",
      "Massagear vigorosamente a região ao redor da dor para estimular a circulação sanguínea e reduzir o inchaço local.",
    ],
    correctIndex: 1,
    explanation: "NUNCA recoloque osso. Imobilize como está e chame o SAMU.",
    detailedExplanation:
      "Ao suspeitar de fratura em uma vítima de acidente, o procedimento correto é: NÃO tentar recolocar o osso no lugar — isso pode causar danos a nervos, vasos sanguíneos e agravar a lesão. Deve-se imobilizar o membro na posição em que se encontra, usando talas improvisadas (papelão, revista, madeira) e ataduras, sem apertar demais. Depois, aguardar o socorro especializado (SAMU 192). Movimentar a vítima desnecessariamente também é perigoso, especialmente se houver suspeita de fratura na coluna vertebral, pois pode causar lesão medular irreversível.",
    incidence: "media",
    difficulty: 2,
  },
  {
    id: "q40",
    category: "primeiros-socorros",
    statement:
      "Ao presenciar um grave acidente de trânsito em via urbana, com vítimas feridas necessitando de atendimento médico de urgência, um condutor que parou para auxiliar precisa acionar rapidamente o serviço adequado pelo telefone. Considerando os números de emergência utilizados no Brasil, assinale a alternativa que indica corretamente o número e o serviço que devem ser acionados nessa situação:",
    options: [
      "Ligar para o número 190, que aciona a Polícia Militar, responsável pelo transporte hospitalar imediato das vítimas.",
      "Ligar para o número 192, que aciona o Serviço de Atendimento Móvel de Urgência (SAMU), responsável pelo socorro médico de urgência.",
      "Ligar para o número 193, que aciona a Polícia Rodoviária Federal, responsável pelo atendimento em vias urbanas.",
      "Ligar para o número 199, que aciona a Defesa Civil, responsável pela remoção de veículos acidentados das vias.",
    ],
    correctIndex: 1,
    explanation: "192 SAMU · 193 Bombeiros · 190 Polícia Militar · 191 PRF.",
    detailedExplanation:
      "Em emergências de trânsito, é essencial saber os números de telefone corretos: SAMU (Serviço de Atendimento Móvel de Urgência) disca 192 — emergências médicas, como acidentes com feridos; Corpo de Bombeiros disca 193 — resgate veicular, incêndios e desencarceramento; Polícia Militar disca 190 — ocorrências de trânsito sem vítimas; PRF (Polícia Rodoviária Federal) disca 191 — ocorrências em rodovias federais. Confundir esses números pode atrasar o atendimento e custar vidas. Uma dica: SAMU (192) é serviço médico, enquanto Bombeiros (193) fazem o resgate técnico.",
    tip: "1-9-2: o '2' lembra 'dois braços do socorrista'.",
    incidence: "alta",
    difficulty: 1,
  },
  {
    id: "q41",
    category: "primeiros-socorros",
    statement:
      "Um mecânico sofre uma queimadura de segundo grau no antebraço ao entrar em contato acidental com a mangueira superaquecida do radiador durante um reparo. O colega de trabalho, que presencia o ocorrido, pretende prestar os primeiros socorros. Considerando os procedimentos corretos para o atendimento de queimaduras, assinale a alternativa que apresenta uma conduta que NÃO deve ser adotada:",
    options: [
      "Resfriar o local afetado com água corrente limpa em temperatura ambiente por alguns minutos, aliviando a dor e interrompendo a queimadura térmica.",
      "Cobrir a lesão com um pano limpo ou gaze umedecida, protegendo a região antes de encaminhar a vítima ao atendimento médico.",
      "Aplicar pasta de dente, manteiga ou pomadas caseiras sobre o ferimento, acreditando que aliviam a ardência e aceleram a cicatrização.",
      "Procurar atendimento médico especializado o mais rápido possível para avaliação e tratamento adequado da lesão.",
    ],
    correctIndex: 2,
    explanation: "Pasta de dente/manteiga pioram a lesão e podem causar infecção.",
    detailedExplanation:
      "Em caso de queimadura, o procedimento correto é: resfriar a área com água corrente em temperatura ambiente por cerca de 10 minutos (nunca gelo), cobrir com pano limpo ou gaze umedecida e procurar atendimento médico. O que NUNCA se deve fazer: aplicar pasta de dente, manteiga, clara de ovo, pomadas caseiras ou qualquer outro produto caseiro — essas substâncias retêm o calor na pele, agravam a queimadura e podem causar infecções. Também não se deve furar bolhas ou arrancar roupas grudadas na pele. O conhecimento de primeiros socorros pode evitar sequelas permanentes.",
    incidence: "media",
    trap: true,
    difficulty: 1,
  },
  {
    id: "q42",
    category: "primeiros-socorros",
    statement:
      "Após uma colisão frontal entre dois automóveis, um motorista que parou para ajudar verifica que o condutor de um dos veículos está inconsciente, não apresenta movimentos torácicos e não demonstra sinais de respiração espontânea. Considerando o suporte básico de vida e os protocolos de primeiros socorros, assinale a alternativa que apresenta a conduta imediata CORRETA a ser adotada pelo socorrista:",
    options: [
      "Aguardar passivamente a chegada da equipe de resgate, mantendo a vítima na mesma posição sem qualquer intervenção.",
      "Iniciar imediatamente as compressões torácicas da Reanimação Cardiopulmonar (RCP), em ritmo de 100 a 120 compressões por minuto, até a chegada do socorro.",
      "Oferecer pequenos goles de água à vítima para verificar se a deglutição está preservada e estimular a respiração.",
      "Sacudir vigorosamente a vítima pelos ombros e bater em seu rosto para tentar reverter o estado de inconsciência.",
    ],
    correctIndex: 1,
    explanation:
      "Parada respiratória = iniciar RCP (100 a 120 compressões/min no centro do peito).",
    detailedExplanation:
      "A parada cardiorrespiratória (PCR) exige ação imediata. A sequência correta é: (1) verificar se a vítima está consciente e respirando (olhar, ouvir, sentir por até 10 segundos); (2) chamar o SAMU (192) ou pedir que alguém chame; (3) iniciar compressões torácicas (RCP) no centro do peito, a uma profundidade de 5 cm, ritmo de 100 a 120 compressões por minuto, permitindo o retorno do tórax entre as compressões. Para leigos, recomenda-se apenas compressões (hands-only CPR). Não se deve dar água (a vítima pode aspirar) nem sacudir. A cada minuto sem RCP, a chance de sobrevivência cai 7-10%.",
    incidence: "alta",
    difficulty: 2,
  },
  {
    id: "q43",
    category: "meio-ambiente",
    statement:
      "Ao trafegar por uma via residencial no período noturno, um condutor observa outro motorista acionando a buzina de forma prolongada e sucessiva para chamar um morador de um prédio. Considerando as regras de conduta e os preceitos de cidadania e poluição sonora previstos no Código de Trânsito Brasileiro (CTB), assinale a alternativa que indica a utilização CORRETA do dispositivo sonoro:",
    options: [
      "A buzina pode ser utilizada livremente em qualquer situação, pois é um direito do condutor alertar os demais usuários da via.",
      "A buzina deve ser utilizada apenas em toques breves, para advertir sobre risco iminente à segurança, sendo proibido seu uso prolongado ou em locais como hospitais e escolas.",
      "A buzina pode ser usada para cumprimentar amigos e conhecidos que estejam na calçada, pois se trata de uma prática social comum.",
      "A buzina é permitida em frente a hospitais e escolas, desde que o condutor esteja trafegando em baixa velocidade.",
    ],
    correctIndex: 1,
    explanation: "Uso indevido de buzina = poluição sonora = infração leve.",
    detailedExplanation:
      "O uso da buzina é regulado pelo CTB: deve ser em toques breves (não prolongados) e apenas para advertir sobre risco iminente ou em situações de emergência. É proibido usar a buzina para cumprimentar, chamar alguém, em manifestações de protesto, ou em locais proibidos (como hospitais e escolas, entre 22h e 6h em vias próximas). O uso indevido é infração LEVE (3 pontos, multa). Além da penalidade, o abuso da buzina contribui para a poluição sonora urbana, que causa estresse, perda auditiva e distúrbios do sono na população.",
    legalBase: "Art. 227 do CTB",
    incidence: "media",
    difficulty: 1,
  },
  {
    id: "q44",
    category: "meio-ambiente",
    statement:
      "Durante uma viagem em rodovia estadual, um passageiro arremessa pela janela do veículo uma embalagem vazia de lanche, que vai parar na pista de rolamento. Considerando as posturas ambientais e as penalidades previstas no Código de Trânsito Brasileiro (CTB), assinale a alternativa que indica corretamente a classificação dessa infração e suas consequências:",
    options: [
      "Infração leve, punida apenas com advertência por escrito, sem acúmulo de pontos na CNH e sem multa pecuniária.",
      "Infração média, punida com multa e acúmulo de 4 pontos na CNH, cabendo ao condutor do veículo a responsabilidade pelo ato do passageiro.",
      "Infração grave, punida com multa e acúmulo de 5 pontos, além da suspensão imediata do licenciamento anual do veículo.",
      "Infração gravíssima, punida com multa multiplicada por três vezes e apreensão do veículo até o recolhimento dos resíduos arremessados.",
    ],
    correctIndex: 1,
    explanation: "Média — 4 pontos. Também pode causar incêndios e acidentes.",
    detailedExplanation:
      "Atirar do veículo ou abandonar objetos ou substâncias na via é infração MÉDIA (4 pontos na CNH e multa). Pode parecer uma infração leve, mas as consequências são sérias: uma bituca de cigarro pode causar incêndio em vegetação às margens da rodovia; uma garrafa ou lata pode provocar acidentes com motociclistas ou danificar outros veículos. Além da multa de trânsito, o ato de jogar lixo em via pública também pode ser enquadrado como crime ambiental (Lei 9.605/98). O condutor responsável mantém o lixo dentro do veículo e descarta em local adequado.",
    legalBase: "Art. 172 do CTB",
    incidence: "media",
    difficulty: 1,
  },
  {
    id: "q45",
    category: "mecanica",
    statement:
      "Um condutor que utiliza diariamente seu automóvel para ir ao trabalho deseja manter a segurança e a eficiência do veículo, adotando uma rotina adequada de manutenção preventiva. Considerando os cuidados recomendados com o sistema de pneus e a influência da calibragem na dirigibilidade e no consumo de combustível, assinale a alternativa que indica corretamente como e com que frequência a calibragem deve ser verificada:",
    options: [
      "Uma vez por ano, juntamente com a troca do óleo do motor, pois a pressão dos pneus permanece estável por longos períodos.",
      "Pelo menos a cada 15 dias e antes de viagens longas, com os pneus frios (veículo parado há pelo menos 2 horas ou rodado poucos quilômetros).",
      "Somente quando o veículo apresenta puxamento lateral da direção, sinal de que a pressão está consideravelmente baixa.",
      "Apenas antes de viagens longas em rodovias, dispensando verificações periódicas no uso urbano diário.",
    ],
    correctIndex: 1,
    explanation: "A cada 15 dias e antes de viagens. Pneu frio = leitura correta.",
    detailedExplanation:
      "A calibragem dos pneus deve ser verificada no mínimo a cada 15 dias e antes de viagens longas. O ideal é calibrar com os pneus FRIOS (veículo parado por pelo menos 2 horas ou rodado no máximo 3 km), porque o ar se expande com o calor e a leitura será imprecisa se os pneus estiverem quentes. Pneus descalibrados aumentam o consumo de combustível, reduzem a vida útil dos pneus (desgaste irregular) e comprometem a segurança nas frenagens e curvas. Cada veículo tem uma pressão recomendada (geralmente indicada no manual ou na tampa do tanque).",
    incidence: "media",
    difficulty: 1,
  },
  {
    id: "q46",
    category: "mecanica",
    statement:
      "Durante uma revisão preventiva em uma oficina mecânica, o técnico aponta para o fundo dos sulcos do pneu e explica ao proprietário do veículo a função dos pequenos ressaltos de borracha existentes na banda de rodagem. Considerando a segurança veicular e os limites legais de desgaste dos pneus, assinale a alternativa que descreve corretamente a finalidade do indicador denominado TWI:",
    options: [
      "Indicar o nome comercial e o modelo do pneu, permitindo a identificação correta do produto na compra de um exemplar idêntico.",
      "Indicar o limite mínimo legal de profundidade dos sulcos da banda de rodagem (1,6 mm), sinalizando que o pneu deve ser substituído quando os sulcos alcançam esse nível.",
      "Medir a pressão interna do pneu em tempo real, dispensando o uso do calibrador e do manômetro convencional.",
      "Indicar a data de fabricação do pneu, determinando o prazo de validade máximo de utilização independentemente do desgaste da borracha.",
    ],
    correctIndex: 1,
    explanation: "TWI (Tread Wear Indicator) = quando o sulco chega ao indicador, troque o pneu.",
    detailedExplanation:
      "TWI (Tread Wear Indicator) são saliências no fundo dos sulcos do pneu que indicam o desgaste máximo permitido. Quando a banda de rodagem atinge a altura desses indicadores, significa que os sulcos estão com profundidade igual ou inferior a 1,6 mm — o limite mínimo legal. Rodar com pneus carecas (abaixo de 1,6 mm) é infração GRAVÍSSIMA e aumenta drasticamente o risco de aquaplanagem e perda de aderência em piso molhado. Um teste simples: coloque uma moeda de R$ 1 no sulco; se a borda dourada aparecer, o pneu precisa ser trocado.",
    incidence: "media",
    difficulty: 2,
  },
  {
    id: "q47",
    category: "mecanica",
    statement:
      "Um condutor deseja realizar a verificação preventiva do nível de óleo do motor de seu veículo, utilizando a vareta medidora localizada sob o capô. Para obter uma leitura precisa e evitar danos por falta de lubrificação, ele precisa adotar o procedimento correto. Assinale a alternativa que indica corretamente como e quando o nível de óleo do motor deve ser verificado:",
    options: [
      "Com o motor quente e em funcionamento, no momento em que o óleo está circulando por todo o sistema de lubrificação.",
      "Com o veículo estacionado em terreno plano e o motor frio ou desligado há alguns minutos, para que o óleo retorne ao cárter e a vareta indique o nível real.",
      "Somente em oficinas especializadas durante a troca periódica, pois o condutor não possui acesso seguro à vareta medidora.",
      "Uma vez por ano, juntamente com a revisão preventiva geral do veículo, independentemente da quilometragem percorrida.",
    ],
    correctIndex: 1,
    explanation: "Plano + motor frio = leitura precisa da vareta.",
    detailedExplanation:
      "A verificação do nível de óleo do motor é feita com a vareta medidora. O procedimento correto: estacionar em terreno plano, desligar o motor e aguardar alguns minutos (para o óleo retornar ao cárter), retirar a vareta, limpar, recolocar e retirar novamente para ver o nível entre as marcas de mínimo e máximo. Se o nível estiver abaixo do mínimo, o motor pode sofrer danos graves por falta de lubrificação. A verificação deve ser feita periodicamente (semanalmente ou a cada abastecimento), e não apenas em oficinas.",
    incidence: "baixa",
    difficulty: 1,
  },
  {
    id: "q48",
    category: "mecanica",
    statement:
      "Durante o trajeto em uma rodovia, o condutor observa que a luz indicadora de cor vermelha, simbolizada por uma bateria, acende-se de forma contínua no painel de instrumentos do veículo. Considerando o significado das luzes de advertência do painel e os procedimentos de segurança, assinale a alternativa que indica corretamente o problema sinalizado por essa luz e a atitude adequada:",
    options: [
      "Falha no sistema de carga do veículo, envolvendo o alternador, a correia ou a bateria, exigindo que o condutor pare em local seguro assim que possível para verificar e solicitar assistência.",
      "Indicação de que o nível de combustível está no limite da reserva, exigindo que o condutor procure o posto de abastecimento mais próximo.",
      "Falha no sistema de freios, indicando que as pastilhas estão gastas e que o veículo deve ser levado imediatamente a uma oficina mecânica.",
      "Indicação de pressão incorreta dos pneus, exigindo a verificação imediata da calibragem de todos os pneus do veículo.",
    ],
    correctIndex: 0,
    explanation: "Vermelho = pare assim que possível. Continuar pode deixar o carro sem energia.",
    detailedExplanation:
      "A luz vermelha da bateria no painel indica falha no sistema de carga: o alternador não está gerando energia suficiente, a correia do alternador pode ter rompido ou a bateria pode estar com problemas. Se essa luz acender durante a condução, o veículo está funcionando apenas com a carga residual da bateria e irá parar quando essa carga acabar. O correto é parar em local seguro assim que possível e solicitar assistência. Ignorar pode deixar o veículo imobilizado em local perigoso (pista, acostamento) e danificar outros componentes elétricos.",
    incidence: "media",
    difficulty: 2,
  },
  {
    id: "q49",
    category: "prioridade",
    statement:
      "Em uma via urbana de fluxo misto, circulam simultaneamente um automóvel, um ciclista, um pedestre atravessando na faixa e, ao fundo, aproxima-se uma ambulância do SAMU com sirene e luzes intermitentes acionadas em serviço de urgência. Considerando a hierarquia de prioridade entre os usuários da via estabelecida pelo Código de Trânsito Brasileiro (CTB), assinale a alternativa que apresenta a ordem CORRETA de prioridade:",
    options: [
      "Primeiro os veículos pesados, depois os automóveis e, por último, os pedestres, pois o porte do veículo determina a preferência.",
      "Primeiro os veículos de emergência em serviço, depois os pedestres, seguidos dos veículos não motorizados e, por fim, os veículos motorizados.",
      "A prioridade é sempre de quem chegou primeiro ao local, independentemente do tipo de veículo ou da condição de vulnerabilidade do usuário.",
      "Primeiro as motocicletas, depois os automóveis e, por último, os ônibus, conforme a agilidade de manobra de cada veículo.",
    ],
    correctIndex: 1,
    explanation: "Hierarquia: emergência > pedestre > não motorizado > motorizado.",
    detailedExplanation:
      "O CTB estabelece uma hierarquia de prioridade nas vias: (1) veículos de emergência (ambulância, bombeiros, polícia) com sirene e luz vermelha; (2) pedestres e pessoas transportadas em veículos não motorizados (bicicletas, carroças); (3) veículos não motorizados; (4) veículos motorizados (carros, motos, ônibus). Os veículos de emergência têm preferência sobre todos, devendo os demais condutores dar passagem pela esquerda. Os pedestres têm prioridade sobre os veículos, especialmente nas faixas de pedestres. Essa hierarquia visa proteger os usuários mais vulneráveis do trânsito.",
    legalBase: "Art. 29, §2º do CTB",
    incidence: "alta",
    difficulty: 2,
  },
  {
    id: "q50",
    category: "legislacao",
    statement:
      "Um condutor que se mudou recentemente para um novo bairro trafega por uma rua residencial sem qualquer placa de regulamentação de velocidade, onde há intenso trânsito de pedestres e crianças brincando próximo às calçadas. Considerando os limites máximos de velocidade previstos no Código de Trânsito Brasileiro (CTB) para vias urbanas não sinalizadas, assinale a alternativa que indica a velocidade máxima permitida nessa via local:",
    options: [
      "20 km/h, limite aplicável exclusivamente às vias de trânsito rápido urbanas com pistas múltiplas.",
      "30 km/h, limite máximo estabelecido pelo CTB para as vias locais, caracterizadas por fluxos residenciais de curta distância.",
      "40 km/h, limite padrão destinado às vias coletoras que distribuem o tráfego entre os bairros da cidade.",
      "60 km/h, limite típico das vias arteriais, que concentram o maior fluxo de veículos e possuem semáforos.",
    ],
    correctIndex: 1,
    explanation:
      "Local 30 · Coletora 40 · Arterial 60 · Trânsito rápido 80 (urbanas, sem sinalização).",
    detailedExplanation:
      "Na ausência de sinalização regulamentadora de velocidade, o CTB estabelece os limites máximos para vias urbanas: VIA LOCAL (residencial, baixo fluxo): 30 km/h; VIA COLETORA (distribui o tráfego entre bairros): 40 km/h; VIA ARTERIAL (grande fluxo, semaforizada): 60 km/h; VIA DE TRÂNSITO RÁPIDO (pistas múltiplas, sem cruzamentos): 80 km/h. Esses limites são frequentemente cobrados na prova. Dica: a sequência é progressiva: 30, 40, 60, 80 — quanto maior a capacidade da via, maior o limite.",
    legalBase: "Art. 61 do CTB",
    incidence: "alta",
    difficulty: 2,
  },
  {
    id: "q51",
    category: "legislacao",
    statement:
      "Um condutor dirige seu automóvel de passeio por uma rodovia de pista dupla em trecho rural, que não apresenta nenhuma placa de regulamentação de velocidade ao longo do percurso. Considerando os limites padrão de velocidade para rodovias estabelecidos pelo Código de Trânsito Brasileiro (CTB) na ausência de sinalização, assinale a alternativa que indica a velocidade máxima permitida para esse veículo:",
    options: [
      "80 km/h, limite padrão aplicável aos demais veículos em rodovias de pista dupla, como caminhões e reboques.",
      "100 km/h, velocidade máxima destinada às estradas não pavimentadas em condições ideais de conservação.",
      "110 km/h, limite padrão estabelecido pelo CTB para automóveis, camionetas e motocicletas em rodovias de pista dupla.",
      "120 km/h, velocidade permitida em todas as rodovias federais concedidas à iniciativa privada, independentemente de sinalização.",
    ],
    correctIndex: 2,
    explanation: "Rodovia: automóvel 110 · ônibus 90 · demais 80. Estrada (não pavimentada): 60.",
    detailedExplanation:
      "Em rodovias (vias pavimentadas, rurais) sem sinalização específica, os limites padrão são: automóveis, camionetas e motocicletas: 110 km/h; ônibus e micro-ônibus: 90 km/h; demais veículos (caminhões, reboques): 80 km/h. Já em estradas NÃO pavimentadas, o limite é 60 km/h para todos. Esses valores são para vias de pista dupla (com separador). Se a rodovia for de pista simples (sem canteiro central), os limites são reduzidos em 10 km/h para cada categoria. É comum a banca trocar os valores para derrubar o candidato.",
    legalBase: "Art. 61, §1º do CTB",
    incidence: "alta",
    difficulty: 2,
  },
  {
    id: "q52",
    category: "infracoes",
    statement:
      "Em uma via arterial urbana com velocidade máxima regulamentada de 60 km/h, a fiscalização eletrônica registra um automóvel transitando a 95 km/h. Considerando a classificação das infrações por excesso de velocidade prevista no Código de Trânsito Brasileiro (CTB), assinale a alternativa que indica corretamente a natureza da infração cometida e suas consequências:",
    options: [
      "Infração média, punida com multa e acúmulo de 4 pontos na CNH, sem qualquer medida administrativa adicional.",
      "Infração grave, punida com multa e acúmulo de 5 pontos, com possibilidade de conversão em advertência na primeira ocorrência.",
      "Infração gravíssima, punida com multa multiplicada por três vezes, acúmulo de 7 pontos e suspensão imediata do direito de dirigir.",
      "Mera irregularidade administrativa passível apenas de advertência verbal, desde que não haja colisão ou dano material.",
    ],
    correctIndex: 2,
    explanation: "Gravíssima x3 (7 pts + multa x3) + suspensão imediata da CNH.",
    detailedExplanation:
      "As infrações por excesso de velocidade são graduadas: até 20% acima do limite = infração MÉDIA; de 20% a 50% = infração GRAVE; ACIMA DE 50% = infração GRAVÍSSIMA com fator multiplicador 3 (multa x3), 7 pontos na CNH e suspensão imediata do direito de dirigir. Esta última é uma das poucas infrações que geram suspensão automática (sem necessidade de processo administrativo). Além da multa salgada, o condutor tem a CNH recolhida e precisa passar pelo curso de reciclagem. É uma das pegadinhas favoritas da banca.",
    legalBase: "Art. 218, III do CTB",
    incidence: "alta",
    difficulty: 2,
  },
  {
    id: "q53",
    category: "direcao-defensiva",
    statement:
      "Ao iniciar uma viagem de carro por uma rodovia de pista simples em um dia de céu claro e boa visibilidade, um condutor questiona se precisa manter os faróis acesos durante o dia, considerando as recentes alterações na legislação de trânsito. Considerando as normas do Código de Trânsito Brasileiro (CTB) e a Lei do Farol Baixo, assinale a alternativa que indica corretamente a obrigatoriedade do uso do farol baixo durante o dia em rodovias:",
    options: [
      "O uso do farol baixo durante o dia em rodovias é proibido, pois desperdiça energia e pode confundir os demais condutores.",
      "O uso do farol baixo é obrigatório durante o dia em rodovias de pista simples fora do perímetro urbano, podendo ser substituído pela luz de condução diurna (DRL) quando o veículo a possuir.",
      "O uso do farol baixo durante o dia é opcional, cabendo ao condutor decidir conforme sua preferência pessoal de visibilidade.",
      "O farol baixo durante o dia é exigido apenas no interior de túneis iluminados ou em situações de chuva e neblina intensas.",
    ],
    correctIndex: 1,
    explanation: "Lei 13.290/2016 / 14.071/2021: obrigatório em rodovias; DRL substitui.",
    detailedExplanation:
      "Desde a Lei 13.290/2016 (alterada pela 14.071/2021), é obrigatório trafegar com farol baixo aceso durante o dia em rodovias (mesmo em condições normais de visibilidade). A principal finalidade é aumentar a visibilidade do veículo para outros condutores, reduzindo colisões frontais e laterais. O DRL (Daytime Running Light — luz de rodagem diurna) pode substituir o farol baixo, pois tem a mesma função de tornar o veículo mais visível. Nas vias urbanas não há essa obrigatoriedade, a menos que haja túneis ou condições adversas (chuva, neblina).",
    legalBase: "Art. 250 do CTB",
    incidence: "media",
    difficulty: 2,
  },
  {
    id: "q54",
    category: "legislacao",
    statement:
      "Um candidato foi aprovado em todos os exames teóricos e práticos do processo de habilitação e recebeu, do órgão executivo de trânsito, a Permissão para Dirigir (PPD), que antecede a emissão da Carteira Nacional de Habilitação (CNH) definitiva. Considerando as disposições do Código de Trânsito Brasileiro (CTB) sobre o período probatório, assinale a alternativa que indica corretamente a validade da PPD:",
    options: [
      "3 meses, prazo destinado exclusivamente à realização do exame prático de direção veicular.",
      "6 meses, período máximo para que o candidato conclua as etapas iniciais do processo de habilitação.",
      "1 ano, período de validade da Permissão para Dirigir durante o qual o condutor passa pelo estágio probatório antes da CNH definitiva.",
      "2 anos, prazo idêntico ao de validade das avaliações psicológicas exigidas no processo de habilitação.",
    ],
    correctIndex: 2,
    explanation:
      "PPD vale por 1 ano. Sem cometer infração grave/gravíssima nem reincidir em média, vira CNH definitiva.",
    detailedExplanation:
      "A PPD (Permissão para Dirigir) é o documento provisório emitido ao candidato aprovado nos exames teórico e prático. Tem validade de 1 ano (não confunda com os 6 meses de prazo para concluir o processo inicial). Durante esse período, o condutor deve cumprir um estágio probatório: se não cometer nenhuma infração grave ou gravíssima, e não for reincidente em infração média, a PPD é convertida automaticamente em CNH definitiva. Se cometer infração grave/gravíssima OU reincidir em média, a PPD é cassada e o condutor perde o direito de dirigir, tendo que reiniciar todo o processo.",
    legalBase: "Art. 148, §3º do CTB",
    incidence: "alta",
    difficulty: 1,
  },
  {
    id: "qp01",
    category: "direcao-defensiva",
    statement:
      "Sob condições adversas de tempo, como chuva forte, neblina ou cerração, a respeito do uso das luzes do veículo, é correto afirmar que o condutor deve:",
    options: [
      "Manter as luzes de posição apagadas e ligar o pisca-alerta com o veículo em movimento.",
      "Ligar o farol alto para aumentar o feixe de luz e melhorar a visibilidade através da neblina.",
      "Manter acesos, pelo menos, as luzes de posição ou o farol baixo do veículo, sendo proibido o uso do pisca-alerta com o carro em movimento.",
      "Acionar o pisca-alerta e trafegar pelo acostamento até que a visibilidade melhore.",
    ],
    correctIndex: 2,
    explanation:
      "Em cerração/neblina: farol baixo ou luz de posição. Pisca-alerta com o carro em movimento é PROIBIDO — só em imobilizações ou emergências.",
    detailedExplanation:
      "O Art. 40 do CTB determina que o pisca-alerta só pode ser usado em imobilizações ou em situações de emergência. Andar com pisca-alerta ligado na neblina faz com que o motorista de trás pense que você está parado, podendo causar colisão traseira. Cerração é sinônimo de neblina densa.",
    legalBase: "Art. 40 do CTB",
    commonMistake:
      "Quase todo mundo liga o pisca-alerta na cerração na vida real — mas na prova isso está ERRADO. Além disso, 'cerração' confunde quem não sabe que é neblina densa.",
    tip: "Cerração = neblina. Pisca-alerta NUNCA com o carro andando.",
    incidence: "altissima",
    trap: true,
    difficulty: 3,
  },
  {
    id: "qp02",
    category: "infracoes",
    statement:
      "Durante a fiscalização em uma rodovia, um agente verifica que um condutor mantém uma distância frontal insuficiente em relação ao veículo que segue à sua frente, colando-se a ele mesmo em alta velocidade, além de não guardar distância lateral adequada do bordo da pista. Considerando as condições de velocidade e clima do momento, a conduta descrita constitui uma infração de natureza:",
    options: [
      "Média, sujeita a multa e ao acréscimo de 4 pontos na Carteira Nacional de Habilitação do condutor.",
      "Grave, sujeita a multa e ao acréscimo de 5 pontos na Carteira Nacional de Habilitação do condutor.",
      "Gravíssima, sujeita a multa e ao acréscimo de 7 pontos na Carteira Nacional de Habilitação do condutor.",
      "Leve, sujeita a multa de valor reduzido e ao acréscimo de 3 pontos na Carteira Nacional de Habilitação do condutor.",
    ],
    correctIndex: 1,
    explanation: "Art. 192 do CTB: infração GRAVE — 5 pontos na CNH e multa.",
    detailedExplanation:
      "Apesar do enunciado longo citar 'condições climáticas' e 'distância lateral e frontal', a resposta é simples: o Art. 192 classifica como GRAVE. Muita gente marca 'Gravíssima' por achar que é mais perigoso, mas a lei é clara.",
    legalBase: "Art. 192 do CTB",
    commonMistake:
      "Enunciado longo e 'independente das condições climáticas' tentam cansar e confundir. Muita gente marca Gravíssima — está errado.",
    tip: "Distância de segurança = GRAVE (5 pontos).",
    incidence: "altissima",
    trap: true,
    difficulty: 3,
  },
  {
    id: "qp03",
    category: "legislacao",
    statement:
      "Durante a Operação Lei Seca, um condutor abordado apresenta fala arrastada, olhos avermelhados e reações lentas, sendo então submetido ao teste do etilômetro. Considerando os efeitos fisiológicos do consumo de álcool no organismo humano e sua influência na capacidade de dirigir, assinale a alternativa que indica CORRETAMENTE esses efeitos:",
    options: [
      "Perda total e permanente da visão do condutor, que fica definitivamente impedido de conduzir qualquer tipo de veículo.",
      "Visão turva e aumento de agilidade, melhorando a capacidade do condutor de reagir aos imprevistos do trânsito.",
      "Falta de atenção, sonolência, diminuição dos reflexos e da coordenação motora, elevando o risco de envolvimento em acidentes.",
      "Aumento dos reflexos e melhor coordenação motora, tornando o condutor mais seguro mesmo sob efeito da substância.",
    ],
    correctIndex: 2,
    explanation:
      "Álcool reduz reflexos, atenção e causa sonolência. 'Visão turva' está certa, mas 'agilidade' invalida a alternativa.",
    commonMistake:
      "Pegadinha de fim de frase: a opção começa correta ('visão turva') e termina errada ('agilidade'). Leia até a última palavra!",
    tip: "Álcool NUNCA dá agilidade. Leia a alternativa inteira.",
    incidence: "alta",
    trap: true,
    difficulty: 3,
  },
  {
    id: "qp04",
    category: "meio-ambiente",
    statement:
      "A principal consequência DIRETA para a SAÚDE HUMANA, decorrente da maior exposição aos raios ultravioleta (UV) provocada pelo buraco na camada de ozônio, é:",
    options: [
      "Aumento da temperatura global e desconforto térmico",
      "Maior incidência de doenças respiratórias, como asma e bronquite",
      "Aumento nos casos de câncer de pele e problemas oculares, como a catarata",
      "Aumento da quantidade de raios ultravioleta que chegam à Terra",
    ],
    correctIndex: 2,
    explanation:
      "A pergunta pede a consequência para a SAÚDE HUMANA. Câncer de pele e catarata são os efeitos diretos da radiação UV no corpo.",
    commonMistake:
      "Muita gente marca 'aumento de raios UV' — mas isso é a CAUSA, não a consequência na saúde.",
    tip: "Leia o enunciado: se pede 'saúde humana', procure efeito no CORPO.",
    incidence: "alta",
    trap: true,
    difficulty: 3,
  },
  {
    id: "qp05",
    category: "direcao-defensiva",
    statement:
      "A respeito do uso das luzes e do sistema de iluminação do veículo, de acordo com o CTB, é correto afirmar:",
    options: [
      "O condutor deve manter o farol baixo ligado dia e noite em qualquer tipo de via urbana ou de bairro.",
      "A troca de luz baixa e alta de forma intermitente só é permitida para indicar a intenção de ultrapassar ou alertar sobre riscos à segurança à frente.",
      "O uso do farolete substitui o farol baixo em rodovias durante o dia sob chuva forte.",
      "O farol alto deve ser mantido ligado permanentemente em vias com iluminação pública.",
    ],
    correctIndex: 1,
    explanation:
      "Intercalar farol alto e baixo (piscar) só é permitido para avisar ultrapassagem ou alertar risco.",
    commonMistake:
      "Palavras como 'qualquer', 'sempre' e 'permanentemente' geralmente invalidam a alternativa. Farol baixo de dia é obrigatório só em rodovias.",
    tip: "Cuidado com palavras absolutas: 'qualquer', 'sempre', 'nunca'.",
    legalBase: "Art. 40 do CTB",
    incidence: "alta",
    trap: true,
    difficulty: 3,
  },
  {
    id: "qp06",
    category: "prioridade",
    statement:
      "Em um cruzamento não sinalizado, a preferência de passagem do veículo que se desloca sobre trilhos em relação aos demais veículos é:",
    options: [
      "A preferência é relativa, aplicando-se apenas quando o veículo sobre trilhos for de porte maior que o veículo concorrente.",
      "A preferência é condicionada à existência de sinalização semafórica no cruzamento, prevalecendo a regra da direita na sua ausência.",
      "A preferência é absoluta, devendo os demais condutores aguardar a passagem do veículo sobre trilhos em qualquer situação.",
      "A preferência é compartilhada entre os condutores, aplicando-se a regra geral de quem vem pela direita no cruzamento.",
    ],
    correctIndex: 2,
    explanation:
      "Veículos sobre trilhos (trem, bonde) têm preferência ABSOLUTA — não desviam e não param rápido.",
    commonMistake:
      "O DETRAN não usa a palavra 'trem' — diz 'veículo que se desloca sobre trilhos'. Não confunda com 'carro passando por cima do trilho'.",
    tip: "Sobre trilhos = trem = preferência absoluta.",
    legalBase: "Art. 29, VII do CTB",
    incidence: "alta",
    trap: true,
    difficulty: 3,
  },
  {
    id: "qp07",
    category: "legislacao",
    statement:
      "De acordo com o CTB, são consideradas vias terrestres urbanas e rurais as ruas, avenidas, logradouros, caminhos, passagens e estradas, ALÉM DE:",
    options: [
      "Áreas privadas e estacionamentos de comércios de bairro",
      "As praias abertas à circulação pública e as vias internas pertencentes aos condomínios constituídos por unidades autônomas",
      "Vias particulares e condomínios fechados, onde o CTB não tem poder de fiscalização",
      "Zonas de preservação ambiental e calçadões litorâneos privatizados",
    ],
    correctIndex: 1,
    explanation:
      "Praias abertas à circulação pública e vias internas de condomínios são consideradas vias terrestres — o CTB se aplica ali!",
    commonMistake:
      "O 'bom senso' leva a marcar 'área privada' por achar que condomínio fechado não é público. ERRADO — o CTB vale lá dentro.",
    tip: "Condomínio + praia = via terrestre. CTB se aplica.",
    legalBase: "Art. 2º, parágrafo único do CTB",
    incidence: "alta",
    trap: true,
    difficulty: 3,
  },
  {
    id: "qp08",
    category: "primeiros-socorros",
    statement:
      "Em situações excepcionais, quando houver necessidade absoluta de movimentar uma vítima com suspeita de lesão na coluna antes da chegada do socorro especializado, o procedimento correto é:",
    options: [
      "Puxar a vítima pelos braços ou pelas pernas o mais rápido possível para retirá-la do local",
      "Levantar a vítima individualmente, colocando-a sentada no banco de trás de um veículo particular",
      "Utilizar três pessoas para erguer a vítima em bloco, mantendo o corpo alinhado: uma segura a cabeça e o pescoço, a outra o tronco e a terceira as pernas",
      "Virar a cabeça da vítima para os lados para verificar se há fraturas no pescoço antes de movê-la",
    ],
    correctIndex: 2,
    explanation:
      "Rolamento em bloco com 3 pessoas: cabeça/pescoço, tronco e pernas — para proteger a coluna.",
    tip: "Movimentou vítima? Sempre em BLOCO, com 3 pessoas.",
    incidence: "alta",
    difficulty: 2,
  },
  {
    id: "qp09",
    category: "primeiros-socorros",
    statement:
      "Durante um passeio em uma rodovia, um motorista se depara com uma colisão entre dois veículos e percebe que uma das vítimas está consciente, com escoriações leves, porém nenhuma equipe de socorro profissional ainda chegou ao local. Considerando o conceito e a finalidade dos primeiros socorros no trânsito, assinale a alternativa que define corretamente em que consiste essa prática:",
    options: [
      "Aplicar técnicas médicas avançadas e medicar a vítima imediatamente no local do acidente",
      "Prestar o atendimento inicial e temporário à vítima, garantindo o suporte básico até a chegada do socorro profissional especializado",
      "Transportar a vítima rapidamente para o hospital mais próximo, mesmo sem imobilizá-la",
      "Realizar pequenos procedimentos cirúrgicos de emergência para conter hemorragias internas graves",
    ],
    correctIndex: 1,
    explanation:
      "Primeiros socorros = atendimento INICIAL e TEMPORÁRIO até o socorro profissional chegar.",
    commonMistake:
      "Alternativas com 'medicar', 'cirurgia' ou 'técnicas médicas' estão sempre erradas — leigo não substitui médico.",
    tip: "Inicial + temporário = primeiros socorros.",
    incidence: "alta",
    difficulty: 2,
  },
  {
    id: "qp10",
    category: "direcao-defensiva",
    statement:
      "Durante uma aula teórica de direção defensiva, um instrutor questiona os condutores habilitados sobre o que define, de fato, essa técnica de condução. Considerando os conceitos de segurança no trânsito do Código de Trânsito Brasileiro (CTB), assinale a alternativa que apresenta CORRETAMENTE o verdadeiro conceito de direção defensiva:",
    options: [
      "O ato de evitar acidentes, mortes e prejuízos a qualquer custo, independentemente das condições de manutenção do carro ou do clima",
      "Um tipo de acidente misterioso onde o condutor não consegue realizar nenhuma manobra para evitar a colisão",
      "O conjunto de técnicas e procedimentos que capacita o condutor a dirigir prevenindo acidentes, apesar das condições adversas e das ações incorretas de outros motoristas ou pedestres",
      "A habilidade de dirigir em alta velocidade com segurança, confiando plenamente nos reflexos do motorista",
    ],
    correctIndex: 2,
    explanation:
      "Direção defensiva: prevenir acidentes APESAR das condições adversas e dos erros dos outros.",
    commonMistake:
      "A palavra 'a qualquer custo' invalida a alternativa. E 'acidente misterioso' é outro conceito (acidente sem causa aparente), não é direção defensiva.",
    tip: "Procure a palavra 'apesar' — ela aparece na resposta certa.",
    incidence: "alta",
    trap: true,
    difficulty: 3,
  },
  {
    id: "qp11",
    category: "prioridade",
    statement:
      "Em um cruzamento sem sinalização (sem placas e sem semáforo), entre dois veículos que se aproximam ao mesmo tempo, a preferência de passagem é:",
    options: [
      "Do veículo que trafega pela via mais larga ou mais movimentada, prevalecendo a hierarquia viária sobre as demais regras.",
      "Do veículo que estiver desenvolvendo maior velocidade, pois demonstra maior pressa e fluidez no tráfego.",
      "Do veículo que vier pela direita do outro, conforme a regra geral de preferência em interseções sem sinalização.",
      "De qualquer um dos dois, desde que pisque o farol para solicitar passagem e aguarde a concordância do outro condutor.",
    ],
    correctIndex: 2,
    explanation: "Cruzamento sem sinalização: preferência é SEMPRE de quem vem pela DIREITA.",
    commonMistake:
      "Vida real: motorista acha que rua 'mais larga' tem preferência. ERRADO — sem placa, vale a regra da direita.",
    tip: "Sem placa, sem semáforo? Direita passa.",
    legalBase: "Art. 29, III do CTB",
    incidence: "altissima",
    difficulty: 2,
  },
  {
    id: "qp12",
    category: "legislacao",
    statement:
      "O condutor, com o braço esquerdo na posição HORIZONTAL para fora do veículo (estendido para o lado), está sinalizando que vai:",
    options: [
      "Diminuir a marcha do veículo, avisando aos condutores que vêm atrás a intenção de reduzir a velocidade.",
      "Parar o veículo imediatamente, indicando parada total no leito da via aos demais condutores.",
      "Virar à esquerda, comunicando aos condutores que vêm atrás a intenção de realizar a conversão.",
      "Permitir a ultrapassagem pela esquerda, autorizando o veículo de trás a se deslocar pelo lado esquerdo.",
    ],
    correctIndex: 2,
    explanation:
      "Braço esquerdo estendido HORIZONTALMENTE para fora do veículo = vou VIRAR À ESQUERDA.",
    detailedExplanation:
      "Art. 38 do CTB / Resolução CONTRAN. Os 3 sinais de braço que caem na prova: (1) braço HORIZONTAL para fora = virar à ESQUERDA; (2) braço para CIMA (cotovelo dobrado, mão pra cima) = virar à DIREITA; (3) braço para BAIXO, movimentando de cima pra baixo = vou DIMINUIR ou PARAR.",
    commonMistake:
      "Pegadinha clássica: a banca troca a posição do braço. Muita gente confunde 'horizontal' com 'pra baixo' e marca 'diminuir/parar'. Decore: HORIZONTAL = ESQUERDA.",
    tip: "Braço reto pro lado = ESQUERDA. Pra cima = DIREITA. Pra baixo = PARAR.",
    legalBase: "Art. 38 do CTB",
    incidence: "altissima",
    trap: true,
    difficulty: 2,
  },
  {
    id: "qp13",
    category: "legislacao",
    statement:
      "O condutor com o braço esquerdo para fora do veículo, dobrado no cotovelo com a mão apontando para CIMA, está sinalizando que vai:",
    options: [
      "Virar à esquerda, indicando a intenção de realizar a conversão para o lado esquerdo da via.",
      "Virar à direita, comunicando aos condutores de trás a intenção de realizar a conversão para o lado direito da via.",
      "Dar passagem ao veículo de trás, autorizando a ultrapassagem pela faixa adjacente da via.",
      "Reduzir a velocidade ou parar o veículo, sinalizando aos demais a intenção de diminuir a marcha.",
    ],
    correctIndex: 1,
    explanation: "Braço esquerdo dobrado com a mão para CIMA = vou VIRAR À DIREITA.",
    commonMistake:
      "A pegadinha é o braço estar do lado ESQUERDO. Muitos marcam 'esquerda' por reflexo — mas a posição da MÃO é que define: pra cima = direita.",
    tip: "Mão pra cima = direita, mesmo com o braço do lado esquerdo.",
    legalBase: "Art. 38 do CTB",
    incidence: "alta",
    trap: true,
    difficulty: 3,
  },
  {
    id: "qp14",
    category: "direcao-defensiva",
    statement:
      "Ao se aproximar de um cruzamento onde pretende CONVERTER À ESQUERDA, em via de mão dupla, o condutor deve:",
    options: [
      "Acionar a seta esquerda apenas no momento da curva, manter a faixa da direita e avançar rapidamente para não atrapalhar o trânsito de trás.",
      "Sinalizar com antecedência, aproximar-se o máximo possível da linha divisória central da pista (sem invadir a contramão), reduzir a velocidade e dar preferência aos veículos que venham em sentido contrário.",
      "Buzinar para avisar os outros motoristas, acelerar e cruzar a via antes do veículo que vem em sentido contrário, garantindo a passagem.",
      "Sinalizar com a seta direita para enganar quem vem atrás e fazer a curva pela contramão para ganhar tempo.",
    ],
    correctIndex: 1,
    explanation:
      "Conversão à esquerda em mão dupla: sinalizar com antecedência, aproximar-se da linha central (sem invadir a contramão), reduzir e DAR PREFERÊNCIA a quem vem em sentido contrário.",
    commonMistake:
      "Pegadinha das opções longas e 'quase certas': a alternativa A começa parecendo razoável (acionar seta, manter faixa) mas erra ao mandar avançar rápido e usar a faixa errada. Sempre leia até o final.",
    tip: "Virar à esquerda em mão dupla = sinalizar ANTES, ir para junto da linha central da via, REDUZIR e dar preferência a quem vem de frente.",
    legalBase: "Art. 38 do CTB",
    incidence: "altissima",
    trap: true,
    difficulty: 3,
  },
  {
    id: "qp15",
    category: "legislacao",
    statement:
      "Antes de efetuar qualquer manobra que implique deslocamento lateral (mudança de faixa, conversão, ultrapassagem), o condutor é OBRIGADO a:",
    options: [
      "Apenas observar o trânsito pelo retrovisor interno e iniciar a manobra imediatamente, sem qualquer sinalização prévia.",
      "Buzinar três vezes consecutivas para alertar os demais condutores e seguir em frente realizando a manobra normalmente.",
      "Certificar-se de que pode executá-la sem perigo para os demais e indicar com antecedência a sua intenção, por meio de luz indicadora ou gesto convencional de braço.",
      "Acelerar bruscamente para abrir espaço entre os veículos e completar a manobra antes que o trânsito de trás se aproxime.",
    ],
    correctIndex: 2,
    explanation:
      "Art. 35 do CTB: antes de qualquer manobra lateral é OBRIGATÓRIO certificar-se da segurança E sinalizar com antecedência (seta ou braço).",
    commonMistake:
      "Cuidado: a alternativa correta é a mais LONGA — muita gente descarta logo achando 'enrolação'. Na prova do DETRAN, a opção certa costuma ser a mais detalhada.",
    tip: "Manobra lateral = SEGURANÇA + SINALIZAÇÃO antecipada. Sempre.",
    legalBase: "Art. 35 do CTB",
    incidence: "alta",
    trap: true,
    difficulty: 2,
  },
  {
    id: "qp17",
    category: "mecanica",
    statement:
      "Durante uma viagem em rodovia, o condutor percebe que a luz indicadora de temperatura do motor acende no painel e uma nuvem de vapor começa a sair sob o capô. Diante dessa situação, a conduta correta e mais segura a ser adotada pelo condutor é:",
    options: [
      "Estacionar imediatamente e abrir o radiador para aliviar a pressão com o motor ainda quente",
      "Desligar o motor imediatamente, abrir o capô e jogar água fria sobre o motor para resfriá-lo rapidamente",
      "Parar o veículo em local seguro, desligar o motor e aguardar esfriar naturalmente antes de verificar o nível de água",
      "Continuar dirigindo em baixa velocidade até o posto mais próximo, pois a água do radiador é suficiente para concluir a viagem",
    ],
    correctIndex: 2,
    explanation:
      "Superaquecimento: pare, desligue e aguarde esfriar naturalmente. Abrir o radiador quente causa explosão de vapor.",
    detailedExplanation:
      "A luz de temperatura acesa indica superaquecimento do motor. O procedimento correto: parar em local seguro, desligar o motor e aguardar esfriar naturalmente (pode levar de 20 a 30 minutos). Só então verificar o nível do líquido de arrefecimento. NUNCA abrir a tampa do radiador com o motor quente — a pressão interna pode projetar vapor e água fervente causando queimaduras graves. NUNCA jogar água fria no motor quente, pois o choque térmico pode trincar o bloco do motor. Acionar o pisca-alerta e sinalizar o veículo.",
    legalBase: "Manual de direção defensiva DENATRAN",
    commonMistake:
      "Muita pessoas acham que precisa abrir o radiador ou jogar água na hora. Ambas são perigosas. A banca testa se o candidato conhece o risco de queimadura por vapor.",
    tip: "Motor quente = tampa do radiador FECHADA. Espere esfriar naturalmente.",
    incidence: "alta",
    trap: true,
    difficulty: 2,
  },
  {
    id: "qp18",
    category: "mecanica",
    statement:
      "Ao girar a chave de ignição e perceber que o motor não dá partida, mas o painel acende normalmente, o condutor ouve apenas um clique seco. Nessa situação, a causa mais provável do problema está relacionada a:",
    options: [
      "Falta absoluta de óleo no motor, que travou o virabrequim",
      "Bateria descarregada ou com carga insuficiente para acionar o motor de arranque",
      "Problema no sistema de injeção eletrônica que impede a passagem de combustível",
      "Correia do alternador rompida, impedindo o funcionamento do motor de arranque",
    ],
    correctIndex: 1,
    explanation:
      "Clique seco + painel aceso = bateria fraca (não consegue acionar o motor de arranque).",
    detailedExplanation:
      "Quando o painel acende (indicando que a bateria ainda tem alguma carga) mas o motor de partida dá apenas um clique seco sem girar, a causa mais comum é bateria descarregada ou com carga insuficiente para acionar o motor de arranque (solenóide). Outro sinal: as luzes internas podem ficar mais fracas ao tentar dar partida. A alternativa C (injeção eletrônica) não impede o motor de girar, apenas de funcionar. A correia do alternador rompida (D) descarregaria a bateria gradualmente, mas o motor de arranque ainda funcionaria com a carga residual.",
    commonMistake:
      "Confundir 'motor não pega' com 'motor não gira'. São coisas diferentes. Se o motor não gira, é elétrica (bateria/arranque). Se gira mas não pega, é combustível/ignição/injeção.",
    tip: "Clique seco = bateria. Gira mas não pega = combustível.",
    incidence: "alta",
    trap: true,
    difficulty: 2,
  },
  {
    id: "qp19",
    category: "mecanica",
    statement:
      "Considerando a manutenção preventiva e a segurança veicular, analise as afirmativas sobre os pneus e assinale a alternativa correta quanto à obrigação legal do condutor:",
    options: [
      "O TWI serve para medir a pressão interna do pneu e deve ser verificado semanalmente",
      "Os pneus podem ter sulcos de qualquer profundidade, desde que não haja deformações na banda de rodagem",
      "A profundidade mínima legal dos sulcos dos pneus é de 1,6 mm, indicada pelo TWI — abaixo disso o pneu está irregular",
      "Pneus carecas são permitidos apenas no eixo traseiro, desde que os dianteiros estejam em bom estado",
    ],
    correctIndex: 2,
    explanation:
      "Sulco mínimo legal: 1,6 mm (TWI). Abaixo disso é infração gravíssima e risco de aquaplanagem.",
    detailedExplanation:
      "O TWI (Tread Wear Indicator) são saliências no fundo dos sulcos. Quando a banda de rodagem se desgasta até atingir esses indicadores, a profundidade está em 1,6 mm — o limite mínimo legal. Rodar com pneus abaixo disso (pneus carecas) é infração GRAVÍSSIMA: 7 pontos, multa e retenção do veículo para regularização. O perigo é real: pneus carecas perdem aderência na chuva, aumentam a distância de frenagem e causam aquaplanagem. O TWI não mede pressão (alternativa A errada).",
    legalBase: "Art. 230, XXII do CTB / Resolução CONTRAN 558/80",
    commonMistake:
      "Muita gente confunde TWI com pressão ou acha que 1,6 mm vale para qualquer situação. A banca adora misturar o que o TWI mede com função do calibrador.",
    tip: "TWI = Tread Wear Indicator = indicador de desgaste. 1,6mm é o mínimo.",
    incidence: "alta",
    trap: true,
    difficulty: 2,
  },
  {
    id: "qp20",
    category: "mecanica",
    statement:
      "Ao dirigir em uma ladeira íngreme e bastante extensa, o condutor nota um cheiro forte de queimado vindo do motor e percebe que o pedal de freio está endurecendo e perdendo eficiência progressivamente. Nessa situação, a explicação técnica mais provável e a atitude correta do condutor são, respectivamente:",
    options: [
      "Fluido de freio vencendo — o correto é bombear o pedal rapidamente para recuperar a pressão",
      "Superaquecimento do fluido de freio com formação de bolhas de vapor (fading) — o correto é reduzir marcha e usar o freio motor para aliviar os freios",
      "Pastilha de freio desgastada — o correto é puxar o freio de mão para complementar a frenagem",
      "Rolamento da roda travando — o correto é parar imediatamente e jogar água nas rodas para resfriar",
    ],
    correctIndex: 1,
    explanation:
      "Fading = superaquecimento do fluido de freio. Solução: freio motor (marcha reduzida) para não exigir tanto dos freios.",
    detailedExplanation:
      "O fading de freio ocorre quando o fluido de freio superaquece em descidas longas com uso contínuo dos freios, formando bolhas de vapor no sistema hidráulico (vapor lock). Isso faz o pedal endurecer ou ir até o fundo sem frenagem eficiente. A conduta correta: reduzir a marcha (engatar marcha mais curta, tipo 2ª ou 3ª) e usar o freio motor para controlar a velocidade, acionando o freio de serviço de forma intermitente (não contínua). Alternativa A (bombear o pedal) pode ajudar em alguns casos mas não resolve o fading. Freio de mão (C) é para emergência e pode causar derrapagem.",
    legalBase: "Manual de direção defensiva DENATRAN",
    commonMistake:
      "O candidato geralmente acha que precisa 'bombear o pedal' ou que é problema de pastilha. A banca testa conhecimento técnico do fading e a solução preventiva (freio motor).",
    tip: "Descida longa = marcha reduzida + freio motor. Freio só de apoio.",
    incidence: "alta",
    trap: true,
    difficulty: 3,
  },
  {
    id: "qp21",
    category: "mecanica",
    statement:
      "Após abastecer o veículo com combustível, o condutor nota uma forte vibração no volante e perda de potência ao acelerar em velocidade de cruzeiro. Considerando que o abastecimento foi o último procedimento realizado no veículo e que antes o carro funcionava normalmente, qual das alternativas a seguir descreve a causa mais provável para o problema descrito?",
    options: [
      "O combustível abastecido estava adulterado ou havia água no tanque, contaminando o sistema de alimentação",
      "O motorista esqueceu de fechar a tampa do tanque, causando entrada de ar no sistema",
      "A correia do alternador se soltou durante a aceleração na saída do posto",
      "O óleo do motor foi trocado por engano junto com o combustível, causando danos à bomba injetora",
    ],
    correctIndex: 0,
    explanation:
      "Abastecer com combustível adulterado ou com água causa vibração, perda de potência e falhas na aceleração.",
    detailedExplanation:
      "Abastecer com combustível adulterado (misturado com solventes, água ou outros contaminantes) é um problema infelizmente comum no Brasil. Os sintomas típicos são: dificuldade para dar partida, marcha lenta irregular, vibração no volante, perda de potência ao acelerar, trancos e até o motor apagar. A solução: não dar partida repetidamente (piora a contaminação), rebocar o veículo até uma oficina para drenagem e limpeza do sistema. A alternativa C (correia do alternador) não causa perda de potência imediata. A D (óleo no tanque) é improvável no contexto.",
    commonMistake:
      "O candidato tende a achar que qualquer vibração é problema de pneu ou suspensão. A banca contextualiza com o abastecimento recente para testar raciocínio lógico de causa e efeito.",
    tip: "Abasteceu e o carro ficou ruim? Provavelmente combustível adulterado.",
    incidence: "media",
    trap: true,
    difficulty: 2,
  },
  {
    id: "qp22",
    category: "mecanica",
    statement:
      "O sistema de arrefecimento do motor é essencial para manter a temperatura de funcionamento adequada. Sobre os cuidados com esse sistema, assinale a alternativa INCORRETA:",
    options: [
      "O líquido de arrefecimento deve ser uma mistura de água desmineralizada com aditivo próprio, na proporção recomendada pelo fabricante",
      "A ventoinha do radiador é acionada automaticamente por um sensor de temperatura quando o líquido atinge determinada temperatura",
      "A água da torneira comum pode substituir o líquido de arrefecimento sem prejuízos, pois todos os tipos de água têm a mesma composição química",
      "Verificar o nível do reservatório de expansão regularmente faz parte da manutenção preventiva do sistema de arrefecimento",
    ],
    correctIndex: 2,
    explanation:
      "Alternativa INCORRETA: água comum NÃO pode substituir o líquido de arrefecimento — causa corrosão e depósitos minerais.",
    detailedExplanation:
      "A água da torneira contém minerais (cálcio, magnésio, cloro) que, com o calor do motor, formam depósitos (crostas) nas galerias do radiador e do bloco, reduzindo a troca térmica e causando corrosão. O correto é usar água desmineralizada (ou destilada) misturada com aditivo próprio na proporção indicada (geralmente 50/50). O aditivo também eleva o ponto de ebulição e reduz o ponto de congelamento. Esta questão usa o formato 'EXCETO' ou 'INCORRETA' — pegadinha clássica de interpretação.",
    commonMistake:
      "O candidato lê rápido e marca a primeira alternativa que parece correta. A pegadinha está no comando 'INCORRETA' — muita gente acaba marcando a certa por distração.",
    tip: "Leia o comando: se pede 'INCORRETA', procure a alternativa FALSA.",
    incidence: "alta",
    trap: true,
    difficulty: 2,
  },
  {
    id: "qp23",
    category: "mecanica",
    statement:
      "Em relação aos sistemas de iluminação e sinalização do veículo previstos no CTB, analise as afirmações e assinale a alternativa que apresenta uma conduta correta do condutor:",
    options: [
      "O uso do farol alto é permitido em qualquer via durante a noite, devendo ser mantido aceso mesmo quando houver veículos trafegando no sentido contrário",
      "A luz de neblina dianteira pode ser utilizada em substituição ao farol baixo em condições normais de visibilidade durante o dia",
      "O pisca-alerta (luz de advertência) deve ser acionado apenas em situações de emergência, imobilização do veículo ou situações de perigo, sendo proibido seu uso com o veículo em movimento",
      "A lanterna de posição é suficiente para trafegar em vias urbanas bem iluminadas, dispensando o uso do farol baixo",
    ],
    correctIndex: 2,
    explanation:
      "Pisca-alerta é para emergência e veículo imobilizado. Usá-lo em movimento (exceto em situação de perigo iminente) é proibido.",
    detailedExplanation:
      "O pisca-alerta (luz de advertência) deve ser usado APENAS em situações de emergência: veículo imobilizado na via, freio de emergência, obstáculo na pista, ou condições de perigo iminente. É proibido usar o pisca-alerta com o veículo em movimento em condições normais (muita gente usa na chuva, o que é errado). Farol alto (A) deve ser reduzido para baixo ao cruzar com outro veículo. Neblina (B) não substitui farol baixo. Lanterna (D) é insuficiente — farol baixo é obrigatório à noite em qualquer via.",
    legalBase: "Art. 40, V e 251 do CTB",
    commonMistake:
      "Todo mundo usa pisca-alerta na chuva e acha que é correto. Na prova do DETRAN, usar pisca-alerta em movimento (fora emergência) é errado.",
    tip: "Pisca-alerta = veículo PARADO ou perigo iminente. Não use na chuva.",
    incidence: "altissima",
    trap: true,
    difficulty: 2,
  },
  {
    id: "qp24",
    category: "mecanica",
    statement:
      "O condutor, ao dirigir um veículo equipado com câmbio manual, percebe que a alavanca está vibrando excessivamente e que há dificuldade para engatar as marchas, especialmente a ré e a primeira. O veículo apresenta esses sintomas há alguns dias, que pioraram progressivamente. Nesse contexto, o provável componente com desgaste ou problema é:",
    options: [
      "A embreagem, que está patinando devido ao desgaste do disco de fricção",
      "O sistema de freios, que está travando as rodas dianteiras",
      "O óleo do câmbio, que está baixo ou muito velho, prejudicando a lubrificação das engrenagens",
      "A correia dentada, que está se desgastando e precisa ser trocada com urgência",
    ],
    correctIndex: 2,
    explanation:
      "Dificuldade para engatar marchas + vibração na alavanca = óleo do câmbio baixo/velho ou sincronizadores desgastados.",
    detailedExplanation:
      "O óleo do câmbio (óleo lubrificante da transmissão) tem a função de lubrificar as engrenagens e sincronizadores. Quando está baixo ou muito velho, perde a viscosidade e a capacidade lubrificante, causando dificuldade para engatar marchas (principalmente primeira e ré), vibração na alavanca e ruídos metálicos. A embreagem patinando (alternativa A) causa perda de força na aceleração, mas não dificuldade para engatar. A correia dentada (D) causa falha na sincronização do motor, não no câmbio.",
    commonMistake:
      "O candidato confunde sintomas de embreagem desgastada com problemas no câmbio. A banca testa o conhecimento de causa e efeito nos componentes.",
    tip: "Dificuldade ao engatar marchas = óleo do câmbio. Perda de força na subida = embreagem.",
    incidence: "media",
    trap: true,
    difficulty: 2,
  },
  {
    id: "qp25",
    category: "meio-ambiente",
    statement:
      "O condutor responsável deve saber como descartar corretamente os resíduos gerados pela manutenção do veículo. Assinale a alternativa que apresenta uma conduta ambientalmente correta com relação ao descarte de óleo lubrificante usado:",
    options: [
      "Queimar o óleo usado em fornos industriais para aproveitamento energético, pois é uma forma de reciclagem",
      "Descartar o óleo usado na pia ou no ralo, pois a estação de tratamento de esgoto consegue separá-lo da água",
      "Armazenar o óleo usado em recipiente fechado e entregar em um ponto de coleta credenciado para reciclagem (rerrefino)",
      "Jogar o óleo usado diretamente no solo, onde será decomposto naturalmente por microrganismos",
    ],
    correctIndex: 2,
    explanation:
      "Óleo lubrificante usado deve ser destinado a pontos de coleta para rerrefino. Descartar no solo ou água polui gravemente.",
    detailedExplanation:
      "Um litro de óleo lubrificante usado pode contaminar até 1 milhão de litros de água. O descarte correto é armazenar em recipiente fechado e entregar em postos de coleta credenciados (postos de gasolina, oficinas mecânicas) que encaminham para o rerrefino — processo que recupera o óleo para reúso. Jogar no solo (D) contamina o lençol freático. Na pia ou ralo (B) causa entupimentos e contamina corpos d'água. Queimar (A) libera gases tóxicos. É crime ambiental (Lei 9.605/98).",
    legalBase: "Lei 9.605/98 (Lei de Crimes Ambientais) / Resolução CONAMA 362/2005",
    commonMistake:
      "Muita gente acha que 'queimar para aproveitar energia' é reciclagem. A banca testa se o candidato conhece o rerrefino como destinação ambientalmente correta.",
    tip: "Óleo usado = rerrefino. Leve ao posto de gasolina mais próximo.",
    incidence: "media",
    trap: true,
    difficulty: 2,
  },
  {
    id: "qp26",
    category: "meio-ambiente",
    statement:
      "Em relação à poluição atmosférica causada por veículos automotores, um dos principais problemas ambientais dos grandes centros urbanos, assinale a alternativa que indica corretamente uma atitude do condutor que contribui para a redução da emissão de poluentes:",
    options: [
      "Manter o motor ligado durante paradas prolongadas para evitar o desgaste do motor de arranque ao religar",
      "Realizar a manutenção preventiva periódica, especialmente do sistema de ignição, alimentação e escapamento",
      "Utilizar combustível de menor octanagem para reduzir a temperatura de queima e consequentemente as emissões",
      "Acelerar o motor antes de desligá-lo para 'queimar' o excesso de combustível acumulado nas câmaras",
    ],
    correctIndex: 1,
    explanation:
      "Manutenção preventiva (ignição, alimentação e escapamento) reduz emissões. Motor ligado parado e acelerar antes de desligar aumentam poluição.",
    detailedExplanation:
      "A manutenção preventiva regular é a principal atitude do condutor para reduzir a emissão de poluentes: velas, cabos de ignição, filtro de ar, bicos injetores e catalisador em bom estado garantem combustão mais eficiente e menor emissão de CO, HC e NOx. Manter o motor ligado em paradas (A) é infração (art. 227 do CTB) e polui desnecessariamente. Acelerar antes de desligar (D) joga combustível não queimado no escapamento e no catalisador. Combustível de menor octanagem (C) pode causar detonação (batida de pino).",
    legalBase: "Art. 227 do CTB / Resolução CONAMA 18/86",
    commonMistake:
      "A alternativa A parece fazer sentido ('evitar desgaste do motor de arranque'), mas o CTB proíbe motor ligado em parada prolongada. A banca testa conhecimento de poluição VEICULAR.",
    tip: "Menos poluição = manutenção em dia. Motor desligado em paradas.",
    incidence: "media",
    difficulty: 1,
  },
  {
    id: "qp27",
    category: "meio-ambiente",
    statement:
      "Dirigindo em uma via movimentada, o condutor nota que o veículo à sua frente está soltando uma quantidade excessiva de fumaça escura pelo escapamento, prejudicando a visibilidade e causando mau cheiro. De acordo com o CTB e as resoluções do CONAMA, essa situação:",
    options: [
      "É considerada infração de trânsito GRAVE, pois o veículo está emitindo poluentes acima do permitido, sujeito a multa e retenção",
      "Não é infração de trânsito, mas sim uma contravenção ambiental de competência exclusiva da polícia ambiental",
      "É permitida desde que o veículo esteja em dia com o licenciamento e a inspeção veicular",
      "É infração LEVE, punida apenas com advertência verbal na primeira ocorrência",
    ],
    correctIndex: 0,
    explanation:
      "Veículo soltando fumaça excessiva = infração GRAVE (art. 231, III do CTB). Multa, retenção e medida administrativa.",
    detailedExplanation:
      "O CTB considera infração GRAVE (5 pontos, multa) conduzir veículo que esteja emitindo poluentes ou fumaça acima dos limites previstos (art. 231, III). A autoridade pode reter o veículo para regularização. Fumaça escura geralmente indica problema na queima do combustível (excesso de diesel, injeção desregulada, filtro de ar sujo). Se a fumaça for AZULADA é queima de óleo (anel ou válvula gasta). BRANCA pode ser água no combustível ou junta do cabeçote queimada. Não é infração leve nem deixou de ser infração.",
    legalBase: "Art. 231, III do CTB",
    commonMistake:
      "Muitos acham que emissão de fumaça é problema 'só ambiental' sem consequência de trânsito. A banca cobra que é infração GRAVE com retenção do veículo.",
    tip: "Fumaça excessiva no escapamento = infração GRAVE + retenção.",
    incidence: "media",
    trap: true,
    difficulty: 2,
  },
  {
    id: "qp28",
    category: "meio-ambiente",
    statement:
      "Em relação ao descarte de pneus usados e à responsabilidade ambiental do condutor e das empresas do setor, a destinação ambientalmente correta determinada pela legislação brasileira é:",
    options: [
      "Queimar os pneus em usinas de cimento para aproveitamento energético, pois a queima controlada não emite poluentes",
      "Descartar os pneus em aterros sanitários comuns junto com o lixo doméstico, já que a borracha é biodegradável",
      "Entregar os pneus usados em pontos de coleta para reciclagem ou coprocessamento, conforme determina a logística reversa obrigatória",
      "Reutilizar pneus velhos como jardineiras ou mobiliário, desde que não sejam queimados ao ar livre",
    ],
    correctIndex: 2,
    explanation:
      "Pneus usados têm logística reversa obrigatória: entregar em pontos de coleta para reciclagem/coprocessamento.",
    detailedExplanation:
      "A Resolução CONAMA 416/2009 determina que fabricantes, importadores e revendedores de pneus são obrigados a implementar a logística reversa — ou seja, coletar os pneus usados e dar destinação ambientalmente correta (reciclagem, coprocessamento em fornos de cimento, asfalto-borracha, etc.). Os consumidores devem entregar os pneus usados nos pontos de coleta (borracheiros, revendedoras). Queimar a céu aberto (A) libera gases tóxicos (dioxinas). Aterro sanitário (B) é proibido porque pneus não se decompõem, acumulam água (criadouro de mosquitos) e danificam o solo.",
    legalBase: "Resolução CONAMA 416/2009",
    commonMistake:
      "Muita gente acha que queimar em 'forno de cimento' é reciclagem limpa. A banca pode usar isso como distrator. A resposta certa é sempre sobre logística reversa e coleta.",
    tip: "Pneu velho? Leve ao ponto de coleta da revendedora.",
    incidence: "baixa",
    difficulty: 2,
  },
  {
    id: "qp29",
    category: "meio-ambiente",
    statement:
      "Próximo a uma reserva ambiental, o condutor percebe que a via está com vegetação alta e ressecada nas margens. Nessa situação, qual atitude é vedada ao condutor por representar risco de incêndio florestal e poluição?",
    options: [
      "Trafegar em baixa velocidade para evitar levantar poeira e prejudicar a visibilidade",
      "Manter o ar-condicionado ligado com a recirculação ativada para evitar entrada de fumaça externa",
      "Jogar pontas de cigarro ou fósforos acesos pela janela do veículo, mesmo que aparentemente apagadas",
      "Acionar o pisca-alerta ao reduzir a velocidade para alertar os demais condutores sobre a pista estreita",
    ],
    correctIndex: 2,
    explanation:
      "Atirar pontas de cigarro pela janela é proibido e pode causar incêndios florestais. É infração MÉDIA.",
    detailedExplanation:
      "Jogar qualquer objeto ou substância pela janela do veículo é infração MÉDIA (art. 172 do CTB). Pontas de cigarro acesas ou fósforos são especialmente perigosos em áreas de vegetação seca, podendo provocar incêndios florestais de grandes proporções. O condutor deve utilizar o cinzeiro do veículo para descartar bitucas. Além da infração de trânsito, provocar incêndio dolosa ou culposamente é crime ambiental (Lei 9.605/98, art. 41), com pena de reclusão de 2 a 4 anos e multa.",
    legalBase: "Art. 172 do CTB / Lei 9.605/98",
    commonMistake:
      "O candidato acha que a questão é sobre 'vegetação alta' e pensa em desacelerar. A pegadinha está na ação vedada (jogar pontas). É uma questão de interpretação do comando.",
    tip: "Bituca pela janela = infração + risco de incêndio. Use o cinzeiro.",
    incidence: "alta",
    trap: true,
    difficulty: 1,
  },
  {
    id: "qp30",
    category: "meio-ambiente",
    statement:
      "Com relação ao ciclo de vida das baterias automotivas (chumbo-ácido), a legislação ambiental brasileira estabelece que a destinação final das baterias inservíveis é de responsabilidade compartilhada. Sobre esse tema, assinale a alternativa correta:",
    options: [
      "Baterias usadas podem ser descartadas no lixo comum após serem descarregadas por completo, pois o chumbo não é mais nocivo",
      "O ácido da bateria pode ser neutralizado com soda cáustica e descartado na pia, enquanto a carcaça de plástico vai para reciclagem",
      "A bateria usada deve ser devolvida ao revendedor no ato da compra de uma nova, que é obrigado a recebê-la e dar destinação ambiental adequada (logística reversa)",
      "Baterias automotivas não oferecem risco ambiental significativo, pois são compostas majoritariamente de plástico e ácido fraco",
    ],
    correctIndex: 2,
    explanation:
      "Baterias inservíveis devem ser devolvidas ao revendedor (logística reversa obrigatória). Chumbo e ácido são altamente tóxicos.",
    detailedExplanation:
      "A Resolução CONAMA 401/2008 determina que fabricantes, importadores, distribuidores e revendedores de baterias de chumbo-ácido são obrigados a estruturar e implementar a logística reversa. O consumidor deve devolver a bateria usada no ponto de venda ao adquirir uma nova — e o estabelecimento é obrigado a recebê-la. O chumbo é metal pesado tóxico que contamina solo e água e se acumula no organismo. O ácido sulfúrico é corrosivo e perigoso. Por isso descarte no lixo comum (A) ou na pia (B) é totalmente proibido.",
    legalBase: "Resolução CONAMA 401/2008",
    commonMistake:
      "Muitos consumidores não sabem que a 'logística reversa' de baterias é obrigatória e que a loja não pode recusar a bateria velha. A banca testa esse conhecimento de responsabilidade compartilhada.",
    tip: "Bateria velha = troca na hora de comprar a nova. A loja é obrigada a receber.",
    incidence: "baixa",
    difficulty: 2,
  },
  {
    id: "qp31",
    category: "infracoes",
    statement:
      "O condutor que avança o sinal vermelho do semáforo comete uma infração classificada como GRAVÍSSIMA, com 7 pontos e multa. No entanto, existe uma circunstância em que essa penalidade é agravada. Assinale a alternativa que indica corretamente essa circunstância:",
    options: [
      "Avançar o sinal vermelho durante a madrugada, quando há menos movimento",
      "Avançar o sinal vermelho em rodovia, independentemente de haver ou não fiscalização eletrônica",
      "Avançar o sinal vermelho em cruzamento com faixa de pedestre, pois coloca em risco a vida do pedestre",
      "Não há circunstância agravante — a infração é sempre a mesma independente da situação",
    ],
    correctIndex: 2,
    explanation:
      "Avançar sinal vermelho é gravíssima (7 pts). A gravidade é maior quando coloca pedestre em risco no cruzamento.",
    detailedExplanation:
      "Avançar o sinal vermelho do semáforo é infração GRAVÍSSIMA (art. 208 do CTB): 7 pontos, multa. É uma das infrações que mais causa acidentes em cruzamentos, especialmente colisões transversais e atropelamentos. Não existe multa 'dobrada' para essa infração como em outras, mas a existência simultânea de faixa de pedestre não sinalizada ou sinalização específica (como faixa elevada) pode configurar agravante na esfera criminal em caso de acidente com vítima. A alternativa mais correta entre as dadas é a C, pois o CTB protege prioritariamente o pedestre.",
    legalBase: "Art. 208 do CTB",
    commonMistake:
      "Muita gente acha que 'avançar sinal vermelho' é infração grave (não gravíssima) ou que tem multa dobrada. A banca cobra a classificação correta (gravíssima).",
    tip: "Sinal vermelho = PARE. Avançar = gravíssima, 7 pontos.",
    incidence: "alta",
    trap: true,
    difficulty: 1,
  },
  {
    id: "qp32",
    category: "infracoes",
    statement:
      "Uma das atitudes mais perigosas ao volante, especialmente comum no trânsito urbano intenso, é o uso do telefone celular enquanto dirige. De acordo com o art. 252 do CTB, segurar ou manusear o celular enquanto o veículo está em movimento é uma infração classificada como:",
    options: [
      "Leve — 3 pontos e multa, pois a lei considera equivalente a uma distração simples",
      "Média — 4 pontos e multa, pois o celular é equiparado a outros objetos que desviam a atenção",
      "Gravíssima — 7 pontos e multa, com fator multiplicador 3 se o condutor for reincidente",
      "Gravíssima — 7 pontos e multa, pois o ato de segurar e manusear celular é considerado gravíssimo",
    ],
    correctIndex: 3,
    explanation:
      "Segurar/manusear celular dirigindo = infração GRAVÍSSIMA (art. 252, VI). 7 pontos + multa. Fator multiplicador não se aplica.",
    detailedExplanation:
      "O art. 252, inciso VI do CTB considera infração GRAVÍSSIMA dirigir segurando ou manuseando telefone celular. São 7 pontos na CNH e multa (R$ 293,47). Não há fator multiplicador automático, mas o condutor reincidente específico nessa infração no período de 12 meses pagará multa em dobro (reincidência). Atenção: a alternativa A menciona 'fator multiplicador 3' — isso só existe para infrações específicas como dirigir sem CNH ou excesso de velocidade acima de 50%. Estudos mostram que o uso do celular ao volante quadruplica o risco de colisão.",
    legalBase: "Art. 252, VI do CTB",
    commonMistake:
      "Muitos candidatos acham que usar celular é 'média' ou 'grave', mas a lei classifica como GRAVÍSSIMA. A banca também testa se o aluno confunde com multa multiplicadora que não existe para essa infração.",
    tip: "Celular no volante = GRAVÍSSIMA. Só atenda se estacionar em local seguro.",
    incidence: "altissima",
    trap: true,
    difficulty: 2,
  },
  {
    id: "qp33",
    category: "infracoes",
    statement:
      "O uso do cinto de segurança é obrigatório para todos os ocupantes do veículo, conforme determina o CTB. O condutor que deixa de usar o cinto de segurança ou permite que passageiros menores de 18 anos viajem sem o cinto comete, respectivamente:",
    options: [
      "Duas infrações GRAVES — uma para si mesmo e outra por permitir que o passageiro menor viaje sem cinto",
      "Uma única infração GRAVE aplicada ao condutor, independentemente de quantos passageiros estejam sem cinto",
      "Infração GRAVE para si mesmo e infração LEVE para cada passageiro menor de 18 anos sem cinto",
      "Infração GRAVÍSSIMA para o condutor e GRAVE para o proprietário do veículo",
    ],
    correctIndex: 1,
    explanation:
      "Não usar cinto é infração GRAVE (5 pts). Segundo o Manual Brasileiro de Fiscalização de Trânsito (MBFT), o condutor comete uma única infração, independentemente do número de pessoas sem o cinto no veículo.",
    detailedExplanation:
      "O art. 167 do CTB determina que o condutor e todos os passageiros devem usar o cinto de segurança. Não usar cinto é infração GRAVE (5 pontos e multa). Segundo o Manual Brasileiro de Fiscalização de Trânsito (MBFT), quando constatado que tanto o condutor quanto um ou mais passageiros estão sem o cinto de segurança, deve ser lavrado apenas um único auto de infração, registrando-se os detalhes no campo de observações. A responsabilidade por todos os ocupantes é do condutor.",
    legalBase: "Art. 167 do CTB",
    commonMistake:
      "Achar que cada passageiro sem cinto gera uma multa separada. Na verdade, lavra-se uma única autuação grave, independentemente do número de ocupantes sem cinto.",
    tip: "Cinto para TODOS. A falta de cinto gera uma única infração GRAVE, mesmo com mais de uma pessoa sem o dispositivo.",
    incidence: "alta",
    trap: true,
    difficulty: 2,
  },
  {
    id: "qp34",
    category: "infracoes",
    statement:
      "Em uma rodovia de pista simples, o condutor de um automóvel realiza uma ultrapassagem em local proibido (faixa contínua amarela), sendo flagrado por um agente de trânsito. Considerando as penalidades previstas no CTB para essa infração, assinale a alternativa correta:",
    options: [
      "Infração GRAVE — 5 pontos, multa simples e recolhimento da CNH por 30 dias",
      "Infração GRAVÍSSIMA — 7 pontos e multa com fator multiplicador 5, além de possível suspensão do direito de dirigir",
      "Infração MÉDIA — 4 pontos e multa, pois a ultrapassagem foi concluída sem causar acidente",
      "Infração GRAVÍSSIMA — 7 pontos e multa simples sem fator multiplicador, apenas com apreensão do veículo",
    ],
    correctIndex: 1,
    explanation:
      "Ultrapassar em local proibido (faixa contínua) = GRAVÍSSIMA x5 (multa multiplicada por 5) + suspensão.",
    detailedExplanation:
      "O art. 203, V do CTB classifica como GRAVÍSSIMA a ultrapassagem em locais proibidos (faixa contínua, pontes, viadutos, túneis, curvas). A multa-base é multiplicada por 5 (fator 5), resultando em um valor alto. Além disso, o condutor está sujeito à suspensão do direito de dirigir, recolhimento da CNH e até mesmo detenção em caso de perigo de dano (art. 308 do CTB — crime de trânsito). As ultrapassagens em local proibido são uma das principais causas de colisões frontais em rodovias brasileiras.",
    legalBase: "Art. 203, V do CTB",
    commonMistake:
      "Muita gente acha que ultrapassagem em local proibido é 'grave' ou que o fator é 3. O fator 5 é específico para essa infração. A banca adora testar o valor do fator multiplicador.",
    tip: "Ultrapassagem proibida = GRAVÍSSIMA x5. Sete pontos + multa salgada.",
    incidence: "alta",
    trap: true,
    difficulty: 2,
  },
  {
    id: "qp35",
    category: "infracoes",
    statement:
      "O condutor de um veículo envolve-se em um acidente de trânsito com vítimas em uma rodovia. Após a colisão, ele foge do local sem prestar socorro às vítimas, mesmo tendo condições de fazê-lo. De acordo com o CTB e o Código Penal, essa conduta configura:",
    options: [
      "Apenas infração de trânsito GRAVÍSSIMA com multa, sem repercussão criminal",
      "Infração de trânsito GRAVÍSSIMA e crime de trânsito de omissão de socorro (detenção de 1 a 6 meses, podendo ser aumentada se resultar em lesão grave ou morte)",
      "Apenas crime de trânsito (homicídio culposo), pois a infração administrativa é absorvida pela esfera criminal",
      "Infração MÉDIA, desde que o condutor não seja o proprietário do veículo",
    ],
    correctIndex: 1,
    explanation:
      "Fugir do local de acidente com vítimas = GRAVÍSSIMA + crime de omissão de socorro (art. 304 e 305 do CTB).",
    detailedExplanation:
      "Duas penalidades distintas se aplicam: (1) Infração GRAVÍSSIMA (art. 305 do CTB) — deixar de prestar socorro imediato à vítima ou não adotar providências para evitar perigo: multa e suspensão da CNH; (2) Crime de OMISSÃO DE SOCORRO (art. 304 do CTB c/c art. 135 do Código Penal) — detenção de 1 a 6 meses, multa. A pena pode ser aumentada se a omissão resultar em lesão corporal de natureza grave ou morte. O condutor deve: parar, sinalizar o local, prestar socorro (ou acionar o SAMU 192) e aguardar a autoridade.",
    legalBase: "Arts. 304 e 305 do CTB / Art. 135 do Código Penal",
    commonMistake:
      "Muitos acham que 'fugir do local' é apenas infração. A banca cobra a dupla penalidade: administrativa (gravissíma) + criminal (omissão de socorro). Mesmo que a vítima não morra, há crime.",
    tip: "Acidente com vítima = pare, socorra, sinalize, aguarde. Fugir é crime.",
    incidence: "alta",
    trap: true,
    difficulty: 2,
  },
  {
    id: "qp36",
    category: "infracoes",
    statement:
      "O art. 162 do CTB lista várias situações relacionadas à habilitação do condutor que configuram infrações de trânsito. Sobre esse tema, assinale a alternativa correta:",
    options: [
      "Dirigir com a CNH vencida há mais de 30 dias é infração GRAVÍSSIMA com multa multiplicada por 3",
      "Dirigir com a CNH de outra categoria (ex: categoria B dirigindo veículo da categoria C) é infração LEVE com advertência",
      "Dirigir sem a CNH ou PPD (não habilitado) é infração GRAVÍSSIMA com multa multiplicada por 3 — e pode configurar crime",
      "Dirigir com a CNH de categoria diferente da do veículo é infração MÉDIA com retenção do veículo até a apresentação de condutor habilitado",
    ],
    correctIndex: 2,
    explanation:
      "Dirigir sem CNH/PPD = GRAVÍSSIMA x3 + crime se gerar perigo. Dirigir com CNH vencida há +30 dias = GRAVE.",
    detailedExplanation:
      "O art. 162 do CTB diferencia as infrações relacionadas à habilitação: (I) dirigir sem CNH ou PPD: GRAVÍSSIMA x3 (multa multiplicada por 3), 7 pontos, e pode configurar crime (art. 309 do CTB — detenção 6 meses a 1 ano) se gerar perigo de dano; (II) dirigir com CNH vencida há mais de 30 dias: infração GRAVE (5 pontos), não gravíssima; (III) dirigir com CNH de categoria diferente: infração GRAVÍSSIMA (art. 162, III — 7 pontos), não leve ou média. A alternativa A erra ao classificar como gravíssima (na verdade é grave). Cuidado com essas diferenças!",
    legalBase: "Art. 162, I, II e III do CTB",
    commonMistake:
      "A banca adora misturar as classificações: sem CNH é gravíssima x3, mas com CNH vencida há +30 dias é grave (não gravíssima). Categoria diferente também é gravíssima mas SEM fator multiplicador.",
    tip: "Sem CNH = GRAVÍSSIMA x3. CNH vencida +30 dias = GRAVE. Categoria errada = GRAVÍSSIMA.",
    incidence: "alta",
    trap: true,
    difficulty: 3,
  },
  {
    id: "qp37",
    category: "primeiros-socorros",
    statement:
      "Em um acidente de trânsito envolvendo um motociclista que ficou inconsciente, caído na via e ainda utilizando o capacete. O capacete precisa ser removido para que a vítima possa respirar adequadamente. Nessa situação, o procedimento correto de primeiros socorros determina que o capacete deve ser removido:",
    options: [
      "Puxando-o com força para cima, na posição em que a cabeça se encontra, para ganhar tempo",
      "Com o auxílio de pelo menos duas pessoas, mantendo a coluna cervical alinhada e imobilizada durante todo o procedimento",
      "Serrando o capacete ao meio com um canivete ou ferramenta similar para evitar movimentar a cabeça",
      "Removido apenas pelo próprio motociclista, se ele recobrar a consciência, ou pelo médico no hospital",
    ],
    correctIndex: 1,
    explanation:
      "Remoção do capacete: com 2 pessoas, UM segura a cabeça (coluna cervical alinhada) e OUTRO remove o capacete delicadamente.",
    detailedExplanation:
      "A remoção do capacete em vítima inconsciente é um procedimento delicado que exige no mínimo duas pessoas treinadas (ou uma pessoa experiente seguindo técnica específica). O princípio fundamental é: manter a coluna cervical imobilizada e alinhada durante toda a retirada, pois há risco de lesão medular. Uma pessoa segura a cabeça da vítima por baixo do capacete, mantendo o pescoço reto, enquanto a outra desliza o capacete para trás com cuidado. NUNCA puxe o capacete com força (A) — pode agravar lesão na coluna. NUNCA serre o capacete (C) — pode ferir a vítima.",
    commonMistake:
      "O instinto é 'tirar o capacete rápido' para a vítima respirar. Mas a prioridade é imobilizar a coluna. A banca testa o conhecimento de que a remoção deve ser feita com a cervical protegida.",
    tip: "Capacetes em vítima inconsciente: 2 pessoas, segure o pescoço, remova com calma.",
    incidence: "media",
    trap: true,
    difficulty: 3,
  },
  {
    id: "qp38",
    category: "primeiros-socorros",
    statement:
      "Em um acidente de trânsito, um dos ocupantes do veículo sofreu um corte profundo no braço e está sangrando abundantemente (hemorragia externa grave). O socorrista não dispõe de material médico especializado, apenas de itens comuns que estão no veículo. Qual deve ser a conduta imediata do socorrista para controlar a hemorragia?",
    options: [
      "Amarrar um torniquete (garrote) acima do ferimento o mais apertado possível para interromper completamente o fluxo sanguíneo",
      "Aplicar compressão direta sobre o local do sangramento com um pano limpo ou gaze improvisada, mantendo pressão firme e contínua",
      "Elevar o braço da vítima acima da cabeça e aguardar o sangramento diminuir naturalmente pela ação da gravidade",
      "Limpar o ferimento com álcool ou água oxigenada para desinfetar e depois cobrir com um curativo oclusivo",
    ],
    correctIndex: 1,
    explanation:
      "Hemorragia externa = compressão direta sobre o ferimento com pano limpo, pressão firme e contínua. Torniquete é último recurso.",
    detailedExplanation:
      "O controle de hemorragia externa grave segue a hierarquia: (1) compressão direta sobre o local do sangramento com gaze ou pano limpo, mantendo pressão firme e contínua por pelo menos 10 minutos sem 'espiar'. (2) Se não parar, eleve o membro acima do coração MANTENDO A COMPRESSÃO. (3) Torniquete (garrote) é o ÚLTIMO recurso (risco de necrose e amputação). A alternativa C (elevar o braço) isoladamente é insuficiente. A alternativa D (limpar com álcool) não controla hemorragia e pode atrasar o atendimento. Manter a calma e pressionar firme salva vidas.",
    commonMistake:
      "Muita gente acha que 'torniquete' é a primeira atitude (filmes). Na realidade, torniquete é perigoso e só usado em último caso. Compressão direta é a técnica primária e mais eficaz.",
    tip: "Sangramento = COMPRESSÃO DIRETA firme. Torniquete só como último recurso.",
    incidence: "alta",
    trap: true,
    difficulty: 2,
  },
  {
    id: "qp39",
    category: "primeiros-socorros",
    statement:
      "Ao chegar em um local de acidente, um socorrista encontra uma vítima caída ao lado de um veículo, consciente mas confusa, com a pele pálida, fria e úmida, respiração rápida e superficial. Considerando que a vítima não apresenta ferimentos visíveis com sangramento ativo, qual a provável condição e qual a conduta correta?",
    options: [
      "A vítima está em estado de choque (hipovolêmico ou neurogênico) — deve ser deitada com as pernas elevadas, agasalhada e aguardar o socorro",
      "A vítima está apenas tonta — deve ser colocada em pé e estimulada a andar para recuperar a circulação",
      "A vítima está com hipoglicemia — deve receber açúcar ou bebida doce imediatamente",
      "A vítima está dormindo após o acidente — deve ser deixada descansando até acordar naturalmente",
    ],
    correctIndex: 0,
    explanation:
      "Sinais: palidez, pele fria/úmida, respiração rápida = estado de choque. Posição: deitado com pernas elevadas (+ agasalhar).",
    detailedExplanation:
      "O estado de choque é uma condição grave em que o sistema circulatório não consegue levar oxigênio suficiente aos órgãos. Sinais clássicos: pele pálida, fria e pegajosa (úmida), pulso rápido e fraco, respiração rápida e superficial, confusão mental, náuseas. Conduta correta: deitar a vítima em posição confortável, elevar as pernas cerca de 30 cm (se não houver suspeita de fratura), agasalhar (sem superaquecer), afrouxar roupas apertadas, não dar nada de comer ou beber, acalmar a vítima e aguardar o SAMU. A alternativa C (dar açúcar) é perigosa se a vítima não estiver consciente e com deglutição preservada.",
    commonMistake:
      "O candidato pode achar que 'choque' é só psicológico. A banca testa o reconhecimento do choque hipovolêmico pelos sinais: palidez + pele fria/úmida + taquipneia. A conduta 'pernas elevadas' é contraintuitiva para quem não conhece.",
    tip: "Pele pálida, fria e úmida = choque. Deite, eleve pernas, agasalhe, não dê nada.",
    incidence: "media",
    trap: true,
    difficulty: 2,
  },
  {
    id: "qp40",
    category: "primeiros-socorros",
    statement:
      "Uma vítima de atropelamento está caída no asfalto, consciente, queixando-se de forte dor nas costas e dizendo 'não consigo mexer as pernas'. Diante desse quadro, que sugere lesão na coluna vertebral, a conduta do socorrista deve ser:",
    options: [
      "Ajudar a vítima a sentar-se devagar para verificar se a dor diminui com a mudança de posição",
      "Virar a vítima de bruços (decúbito ventral) para aliviar a pressão sobre a coluna",
      "Não movimentar a vítima, imobilizar a cabeça e o pescoço manualmente ou com suporte improvisado, mantendo-a na posição encontrada até a chegada do socorro especializado",
      "Puxar a vítima pelas pernas para retirá-la do asfalto quente e colocá-la na calçada",
    ],
    correctIndex: 2,
    explanation:
      "Suspeita de lesão na coluna: NÃO movimente a vítima. Imobilize cabeça/pescoço e aguarde socorro especializado.",
    detailedExplanation:
      "Lesão na coluna vertebral com suspeita de fratura ou luxação é uma das situações mais delicadas em primeiros socorros. Movimentar a vítima pode deslocar fragmentos ósseos e causar lesão irreversível na medula espinhal, resultando em paraplegia ou tetraplegia. A conduta correta é: NÃO movimentar a vítima; manter a cabeça alinhada com o tronco (imobilizar manualmente ou com coxins improvisados); manter a vítima aquecida e calma; acionar o SAMU (192) ou Corpo de Bombeiros (193) imediatamente. Movimentar a vítima só em caso de risco iminente (incêndio, explosão).",
    commonMistake:
      "O instinto é 'tirar a vítima do asfalto quente' ou 'ajudar a sentar'. Ambas podem causar lesão medular permanente. A banca enfatiza: NÃO MEXA! Imobilize e aguarde.",
    tip: "Dor na coluna + não mexe as pernas = NÃO MEXA. Imobilize cabeça e chame socorro.",
    incidence: "alta",
    trap: true,
    difficulty: 2,
  },
  {
    id: "qp41",
    category: "primeiros-socorros",
    statement:
      "Ao presenciar uma vítima tendo uma crise convulsiva (epilepsia) após um acidente de trânsito, o socorrista deve adotar qual procedimento?",
    options: [
      "Colocar a mão ou um objeto duro dentro da boca da vítima para evitar que ela morda a língua",
      "Segurar firmemente os braços e pernas da vítima para imobilizá-la durante a convulsão",
      "Afastar objetos próximos que possam ferir a vítima, proteger a cabeça com algo macio e aguardar a crise passar, sem conter os movimentos",
      "Jogar água fria no rosto da vítima para fazê-la parar de convulsionar",
    ],
    correctIndex: 2,
    explanation:
      "Crise convulsiva: afaste objetos, proteja a cabeça e NÃO coloque nada na boca. Não segure os movimentos.",
    detailedExplanation:
      "Durante uma crise convulsiva, a conduta correta é: (1) afastar objetos perigosos (móveis, vidros) do entorno; (2) colocar algo macio sob a cabeça da vítima; (3) NÃO colocar NADA na boca (colher, pano, dedo) — a vítima NÃO vai engolir a língua e objetos podem causar fratura dentária, obstrução das vias aéreas ou asfixia; (4) NÃO segurar os braços e pernas contra a vontade — isso pode causar fraturas; (5) cronometrar a duração da crise; (6) após a crise, colocar a vítima em posição lateral de segurança (se não houver suspeita de lesão na coluna) e acionar o SAMU se a crise durar mais de 5 minutos.",
    commonMistake:
      "O mito de 'colocar algo na boca para não engolir a língua' é amplamente difundido e TOTALMENTE errado. É a pegadinha preferida da banca em primeiros socorros.",
    tip: "Convulsão: NADA na boca, NÃO segure, apenas proteja a cabeça e afaste objetos.",
    incidence: "media",
    trap: true,
    difficulty: 2,
  },
  {
    id: "qp42",
    category: "legislacao",
    statement:
      "A Autorização para Conduzir Ciclomotor (ACC) é o documento que habilita o cidadão a pilotar ciclomotores (veículos de duas ou três rodas com motor de até 50cc). De acordo com o Código de Trânsito Brasileiro (CTB), qual é o requisito de idade mínima e a validade inicial desse documento?",
    options: [
      "Idade mínima de 16 anos (desde que emancipado) e validade inicial de 2 anos.",
      "Idade mínima de 18 anos, exigindo-se a imputabilidade penal, e validade inicial de 1 ano (estágio probatório, PCC).",
      "Idade mínima de 18 anos, com concessão direta em caráter definitivo, dispensando o período probatório.",
      "Idade mínima de 21 anos, com exigência de curso de especialização em transporte de ciclomotores.",
    ],
    correctIndex: 1,
    explanation:
      "Para obter a ACC, o candidato deve ser penalmente imputável (maior de 18 anos). A validade da ACC provisória é de 1 ano (período probatório), após o qual se obtém a definitiva.",
    detailedExplanation:
      "O Art. 140 do CTB estabelece que, para habilitar-se (seja CNH ou ACC), o candidato deve ser penalmente imputável (ter 18 anos completos e responder criminalmente por seus atos). Assim como a CNH, o processo da ACC concede primeiro uma autorização provisória (Permissão para Conduzir Ciclomotor - PCC) válida por 1 ano. Se o condutor não cometer infração grave, gravíssima ou for reincidente em média nesse período, recebe a ACC definitiva.",
    legalBase: "Art. 140 e Art. 148 do CTB",
    commonMistake:
      "Achar que, por ser para ciclomotores de 50cc (cinquentinha), menores de 18 anos emancipados ou a partir de 16 anos podem obter o documento. Emancipação civil não altera a maioridade penal (imputabilidade), que é exigida pelo CTB.",
    tip: "Lembre-se: Habilitação ou ACC = 18 anos completos (penalmente imputável).",
    incidence: "media",
    trap: true,
    difficulty: 2,
  },
  {
    id: "qp43",
    category: "legislacao",
    statement:
      "O condutor habilitado na categoria B há 3 anos deseja dirigir veículos das categorias C, D e E. Considerando os requisitos de idade mínima e tempo de habilitação para cada categoria, assinale a alternativa que apresenta as informações corretas:",
    options: [
      "Para categoria C: 21 anos e 2 anos na B. Para D: 24 anos e 2 anos na B. Para E: 21 anos e 2 anos na B",
      "Para categoria C: 18 anos e estar habilitado na B. Para D: 21 anos e 2 anos na B. Para E: 21 anos e 1 ano na C",
      "Para categoria C: 18 anos e estar habilitado na B. Para D: 21 anos e 2 anos na B (ou 1 ano na C). Para E: 21 anos e 1 ano na C (independentemente de idade mínima superior)",
      "Para categoria C: 21 anos e 1 ano na B. Para D: 21 anos e 2 anos na B. Para E: 24 anos e 2 anos na C",
    ],
    correctIndex: 2,
    explanation:
      "C = 18+ habilitado B. D = 21+ com 2 anos B ou 1 ano C. E = 21+ com 1 ano C (não exige idade maior que 21).",
    detailedExplanation:
      "Os requisitos para mudança de categoria são: Categoria C (caminhões): mínimo 18 anos e estar habilitado na B (não exige tempo mínimo na B, apenas estar habilitado). Categoria D (ônibus, mais de 8 passageiros): mínimo 21 anos e 2 anos na B ou 1 ano na C. Categoria E (combinação de veículos): mínimo 21 anos e 1 ano na C. Atenção: categoria D NÃO exige 24 anos (era assim antes da Lei 14.071/2021). E, além da idade, o condutor não pode ter cometido infração grave ou gravíssima nos últimos 12 meses para D e E.",
    legalBase: "Art. 145 do CTB (alterado pela Lei 14.071/2021)",
    commonMistake:
      "A banca coloca números errados (24 anos para D, 2 anos para E) para confundir. Decore: C = 18+ B. D = 21 + 2B/1C. E = 21 + 1C.",
    tip: "C = 18+B. D = 21+2B/1C. E = 21+1C. Grave este macete!",
    incidence: "altissima",
    trap: true,
    difficulty: 3,
  },
  {
    id: "qp44",
    category: "legislacao",
    statement:
      "O condutor que exerce atividade remunerada em veículo (EAR), como motoristas de aplicativo, taxistas e caminhoneiros, possui regras específicas no sistema de pontuação do CTB. Sobre a suspensão do direito de dirigir para esses condutores, assinale a alternativa correta:",
    options: [
      "O condutor EAR tem limite de 30 pontos para suspensão, independentemente das infrações cometidas",
      "O condutor EAR não está sujeito ao sistema de pontuação, apenas a multas",
      "O condutor EAR tem limite fixo de 40 pontos para suspensão, independentemente da natureza das infrações (não se aplica a regra dos 20/30/40 pontos)",
      "O condutor EAR perde o direito de dirigir ao atingir 20 pontos, independentemente das infrações serem graves ou leves",
    ],
    correctIndex: 2,
    explanation:
      "EAR sempre tem limite de 40 pontos para suspensão, independentemente da gravidade das infrações. Regra especial (Lei 14.071/2021).",
    detailedExplanation:
      "Antes da Lei 14.071/2021, o condutor EAR tinha limite de 40 pontos enquanto os demais condutores tinham 20 pontos. Com a nova lei, o limite variável (40 pontos sem gravíssima, 30 com 1 gravíssima, 20 com 2+ gravíssimas) passou a valer para todos. MAS o condutor EAR continua com o limite ESPECIAL: sempre 40 pontos, independente da quantidade de infrações gravíssimas. Isso porque a perda da habilitação impacta diretamente o sustento desses profissionais. Atenção: mesmo com EAR, ao atingir 40 pontos, o condutor poderá ser submetido a curso preventivo, não à suspensão automática.",
    legalBase: "Art. 261, §2º e §6º do CTB (Lei 14.071/2021)",
    commonMistake:
      "Muita gente acha que a regra EAR de 40 pontos 'acabou' com a nova lei. Na verdade, ela continua valendo — mas agora é um limite ESPECIAL (enquanto os demais têm limite variável).",
    tip: "EAR = 40 pontos SEMPRE. É o limite fixo especial para profissionais.",
    incidence: "alta",
    trap: true,
    difficulty: 2,
  },
  {
    id: "qp45",
    category: "legislacao",
    statement:
      "O condutor que tem sua CNH suspensa por atingir a pontuação limite ou por infringir regras específicas (como excesso de velocidade acima de 50%) deve cumprir certos requisitos para reabilitar-se. Sobre o processo de reabilitação, assinale a alternativa correta:",
    options: [
      "A suspensão da CNH tem prazo mínimo de 30 dias e máximo de 12 meses, e o condutor deve frequentar curso de reciclagem para reabilitar-se",
      "A suspensão da CNH é definitiva e o condutor deve reiniciar todo o processo de habilitação",
      "O condutor pode recorrer da suspensão dirigindo normalmente até o julgamento do recurso, sem restrições",
      "A suspensão da CNH por pontos exige apenas o pagamento das multas para reabilitação, sem necessidade de curso",
    ],
    correctIndex: 0,
    explanation:
      "Suspensão: prazo de 30 dias a 12 meses + curso de reciclagem obrigatório para reabilitação.",
    detailedExplanation:
      "A suspensão do direito de dirigir é uma penalidade temporária. Os prazos variam: de 30 dias a 12 meses (para suspensão por pontuação) ou de 2 a 8 meses (para infrações específicas como excesso de velocidade acima de 50%). Durante a suspensão, o condutor NÃO pode dirigir. Para se reabilitar, o condutor deve: (1) cumprir o prazo da suspensão; (2) realizar curso de reciclagem (30h/aula); (3) ser aprovado em exame teórico de reciclagem. Se for reprovado no exame, deve fazer novo curso. Dirigir durante a suspensão é crime (art. 307 do CTB — detenção 6 meses a 1 ano).",
    legalBase: "Arts. 261, 268 e 307 do CTB",
    commonMistake:
      "A banca testa os prazos (30d a 12m) e a necessidade do CURSO DE RECICLAGEM. Não basta pagar multa. Dirigir suspenso é CRIME, não apenas infração.",
    tip: "CNH suspensa = curso de reciclagem + prova teórica. Dirigir suspenso é crime.",
    incidence: "alta",
    trap: true,
    difficulty: 2,
  },
  {
    id: "qp46",
    category: "legislacao",
    statement:
      "Em relação à validade da CNH, o CTB estabelece prazos diferentes conforme a faixa etária do condutor. Considerando as alterações introduzidas pela Lei 14.071/2021, assinale a alternativa que indica corretamente os prazos de validade:",
    options: [
      "10 anos para condutores com até 50 anos; 5 anos para condutores entre 50 e 69 anos; 3 anos para condutores com 70 anos ou mais",
      "10 anos para condutores com até 60 anos; 5 anos para condutores entre 60 e 69 anos; 3 anos para condutores com 70 anos ou mais",
      "5 anos para todos os condutores, independentemente da idade, mas com exigência de exame médico anual para maiores de 65 anos",
      "10 anos para condutores com até 65 anos; 5 anos para condutores entre 65 e 74 anos; 2 anos para condutores com 75 anos ou mais",
    ],
    correctIndex: 0,
    explanation:
      "Validade CNH: até 50 anos = 10 anos; 50-69 anos = 5 anos; 70+ = 3 anos (Lei 14.071/2021).",
    detailedExplanation:
      "A Lei 14.071/2021 alterou os prazos de validade da CNH: condutores com idade IGUAL ou INFERIOR a 50 anos: validade de 10 anos; condutores com idade ENTRE 50 e 69 anos (inclusive): validade de 5 anos; condutores com 70 anos ou MAIS: validade de 3 anos. Antes da lei, o prazo máximo era 5 anos para todos. Os prazos contam a partir da data de emissão do documento. Para renovar, o condutor deve passar por exame médico (e psicológico, se aplicável). Exames toxicológicos são exigidos para motoristas das categorias C, D e E (a cada 2 anos e 6 meses).",
    legalBase: "Art. 147, §2º do CTB (Lei 14.071/2021)",
    commonMistake:
      "A banca adora trocar a idade de corte (50, 60, 65) ou inverter os prazos. Decore: 50-10 / 50a69-5 / 70-3. E NÃO confunda: condutor com 50 anos tem validade de 10 ANOS (pois a regra é 'até 50').",
    tip: "Validade CNH: <50 = 10a / 50-69 = 5a / 70+ = 3a.",
    incidence: "altissima",
    trap: true,
    difficulty: 2,
  },
  {
    id: "qp47",
    category: "direcao-defensiva",
    statement:
      "A direção defensiva estabelece três conceitos fundamentais para a segurança no trânsito: distância de reação, distância de frenagem e distância de parada. Sobre esses conceitos, assinale a alternativa correta:",
    options: [
      "Distância de reação é o percurso percorrido desde o momento em que o condutor pisa no freio até a parada total do veículo",
      "Distância de frenagem é o percurso percorrido desde a percepção do perigo até o acionamento do freio",
      "Distância de parada é a soma da distância de reação com a distância de frenagem, ou seja, desde a percepção do perigo até a parada total",
      "Distância de reação é sempre maior que a distância de frenagem em condições normais de piso e pneus",
    ],
    correctIndex: 2,
    explanation:
      "Distância de parada = distância de reação + distância de frenagem. Reação = perceber → freiar. Frenagem = freiar → parar.",
    detailedExplanation:
      "São três conceitos que todo condutor deve conhecer: Distância de REAÇÃO: percurso percorrido desde que o condutor PERCEBE o perigo até pisar no freio (depende do tempo de reação — cerca de 0,75s a 1s). Distância de FRENAGEM: percurso percorrido desde que o freio é acionado até a parada total (depende de velocidade, pneus, piso, freios). Distância de PARADA: SOMA das duas anteriores (reação + frenagem). A alternativa A confunde reação com frenagem. A alternativa B inverte os conceitos. A alternativa D é falsa pois depende das condições. A 50 km/h, a distância de parada total é de aproximadamente 25 metros em condições normais.",
    commonMistake:
      "A banca adora inverter os conceitos ou apresentar definições trocadas. Decore: REAÇÃO = perceber até freiar / FRENAGEM = freiar até parar / PARADA = REAÇÃO + FRENAGEM.",
    tip: "PARADA = REAÇÃO + FRENAGEM. Perceber → Freiar → Parar.",
    incidence: "alta",
    trap: true,
    difficulty: 3,
  },
  {
    id: "qp48",
    category: "direcao-defensiva",
    statement:
      "Em um dia de chuva intensa, o veículo do condutor passa por uma poça d'água na pista e repentinamente o volante fica leve, o veículo parece 'flutuar' e o condutor perde o controle direcional. Esse fenômeno é conhecido como aquaplanagem (ou hidroplanagem). Diante dessa situação, a conduta correta do condutor para recuperar o controle do veículo é:",
    options: [
      "Frear bruscamente e girar o volante no sentido contrário ao da derrapagem para endireitar o veículo",
      "Desligar o motor imediatamente para reduzir a velocidade e recuperar a aderência dos pneus",
      "Tirar o pé do acelerador, manter o volante firme na posição reta e não frear, aguardando os pneus recuperarem o contato com o asfalto",
      "Acelerar fundo para que a água seja expelida dos sulcos dos pneus e a aderência seja restabelecida rapidamente",
    ],
    correctIndex: 2,
    explanation:
      "Aquaplanagem: tire o pé do acelerador, segure o volante reto, NÃO freie. Aguarde os pneus recuperarem contato.",
    detailedExplanation:
      "A aquaplanagem ocorre quando uma lâmina d'água se forma entre os pneus e o asfalto, fazendo o veículo 'flutuar' sobre a água sem aderência. O condutor perde o controle direcional e o volante fica leve. Procedimento correto: (1) TIRAR o pé do acelerador (reduz a velocidade gradualmente); (2) MANTER o volante FIRME na posição reta (não girar); (3) NÃO FREAR (pode travar as rodas e agravar a perda de controle); (4) aguardar os pneus recuperarem o contato com o asfalto. Frear bruscamente (A) ou acelerar (D) pioram a situação. Desligar o motor (B) desliga também sistemas de segurança (freio hidráulico, direção hidráulica).",
    commonMistake:
      "O instinto é frear e virar o volante — exatamente o que NÃO se deve fazer. A banca testa o conhecimento de que a aquaplanagem exige paciência: desacelerar sem frear e manter o volante reto.",
    tip: "Aquaplanagem: aceleração ZERO, volante RETO, freio LONGE. Espere o contato voltar.",
    incidence: "alta",
    trap: true,
    difficulty: 2,
  },
  {
    id: "qp49",
    category: "direcao-defensiva",
    statement:
      "Ao fazer uma curva em alta velocidade, o condutor sente seu corpo sendo 'empurrado' para o lado de fora da curva, enquanto o veículo tende a sair de frente ou de traseira. Esse fenômeno físico, que influencia diretamente a estabilidade do veículo em curvas, é denominado:",
    options: [
      "Força centrípeta — que puxa o veículo para dentro da curva, sendo neutralizada pelo peso do veículo",
      "Força centrífuga — que empurra o veículo para fora da curva, aumentando com a velocidade e exigindo redução de marcha antes da entrada da curva",
      "Atrito lateral — que faz o pneu deslizar lateralmente quando o veículo está muito lento na curva",
      "Momento de inércia — que mantém o veículo em linha reta, exigindo aceleração constante na curva",
    ],
    correctIndex: 1,
    explanation:
      "Força centrífuga 'empurra' o veículo para fora da curva. Solução: reduzir velocidade ANTES da curva, não durante.",
    detailedExplanation:
      "A força centrífuga é a força que atua sobre um corpo em movimento circular, empurrando-o para fora da trajetória curva. Em um veículo fazendo uma curva, essa força tende a jogar o carro para fora (para o lado externo da curva). Quanto MAIOR a velocidade, MAIOR a força centrífuga. A técnica correta de direção defensiva: REDUZIR a velocidade (usando o freio) ANTES de entrar na curva; durante a curva, manter velocidade constante ou aceleração suave; na saída da curva, acelerar progressivamente. A força centrípeta (A) é a que puxa para dentro (gerada pelo atrito dos pneus) — é a REAÇÃO à centrífuga.",
    commonMistake:
      "A banca adora trocar 'centrífuga' por 'centrípeta'. Lembre: centríFUGA = FUGE para fora. centríPETA = PUXA para dentro. E o procedimento correto: reduza velocidade ANTES da curva, não DURANTE.",
    tip: "CentríFUGA = para FUGA. Reduza ANTES da curva, não durante.",
    incidence: "media",
    trap: true,
    difficulty: 2,
  },
  {
    id: "qp50",
    category: "direcao-defensiva",
    statement:
      "Em relação ao uso de faróis durante a condução noturna em rodovias, analise as afirmativas e assinale a conduta correta segundo o CTB e os princípios de direção defensiva:",
    options: [
      "O farol alto deve ser mantido aceso permanentemente em rodovias para melhorar a visibilidade, independentemente de outros veículos",
      "O farol baixo deve estar aceso em rodovias mesmo durante o dia (obrigatório), e à noite deve-se usar o farol alto, reduzindo para baixo ao cruzar com outro veículo ou ao seguir atrás de outro",
      "À noite, o farol alto só pode ser usado em vias rurais não pavimentadas, sendo proibido em rodovias pavimentadas",
      "A luz de neblina dianteira substitui o farol baixo à noite, sendo mais eficiente e consumindo menos energia da bateria",
    ],
    correctIndex: 1,
    explanation:
      "Farol baixo obrigatório em rodovias (dia e noite). Farol alto à noite, reduzindo ao cruzar outros veículos ou seguir atrás.",
    detailedExplanation:
      "O CTB determina: farol baixo aceso durante o dia em rodovias (obrigatório desde 2016). À noite: usar farol alto (para melhor visibilidade), mas DEVE reduzir para farol baixo ao CRUZAR com outro veículo no sentido contrário (a aproximadamente 200 metros) e ao SEGUIR outro veículo (para não ofuscar o retrovisor). O farol alto NÃO pode ficar ligado permanentemente quando há outros veículos. A luz de neblina (D) não substitui o farol baixo e só deve ser usada em condições adversas (chuva forte, neblina, fumaça).",
    legalBase: "Art. 40, II e III / Art. 250 do CTB",
    commonMistake:
      "Muita gente acha que farol alto pode ficar ligado 'sempre'. A banca cobra o momento de reduzir: ao CRUZAR e ao SEGUIR outro veículo. Também testa se sabe que farol baixo é obrigatório EM RODOVIAS durante o dia.",
    tip: "Farol baixo em rodovias (dia). Farol alto à noite, reduzindo ao cruzar/seguir.",
    incidence: "alta",
    difficulty: 1,
  },
  {
    id: "qp51",
    category: "direcao-defensiva",
    statement:
      "Um caminhão bitrem está trafegando em uma rodovia de pista dupla pela faixa da direita. Um automóvel se aproxima pela faixa da esquerda para ultrapassá-lo. Considerando os princípios da direção defensiva e as regras do CTB, quais cuidados o condutor do automóvel deve tomar ao realizar essa ultrapassagem?",
    options: [
      "Buzinar continuamente ao se aproximar do caminhão para alertá-lo e acelerar ao máximo para reduzir o tempo de permanência na faixa contrária",
      "Verificar se há espaço suficiente, sinalizar com seta, ultrapassar pela esquerda com segurança, manter velocidade constante durante a manobra e retornar à direita só após ver o caminhão pelo retrovisor interno",
      "Ultrapassar pela direita, já que caminhões pesados ocupam a faixa esquerda e o automóvel pode usar o acostamento se necessário",
      "Ligar o pisca-alerta antes de iniciar a manobra para sinalizar a intenção de ultrapassagem a todos os veículos ao redor",
    ],
    correctIndex: 1,
    explanation:
      "Ultrapassagem: esquerda sempre (exceto se veículo da esquerda sinalizar conversão), sinalizar com seta, segurança total.",
    detailedExplanation:
      "O procedimento seguro de ultrapassagem inclui: (1) verificar se a faixa da esquerda está livre e se há distância suficiente; (2) sinalizar a intenção com a seta para a esquerda; (3) acelerar moderadamente e realizar a ultrapassagem; (4) retornar à faixa da direita somente quando avistar o veículo ultrapassado pelo retrovisor interno (garantindo distância segura). Ultrapassagem pela direita (C) é proibida (salvo se o veículo da esquerda sinalizar conversão). Pisca-alerta (D) é para emergência, não para sinalizar ultrapassagem. Buzina (A) deve ser toque breve, não contínuo.",
    legalBase: "Arts. 196 a 199 do CTB",
    commonMistake:
      "O candidato acha que pode usar pisca-alerta na ultrapassagem ou buzinar para 'avisar'. A banca cobra o procedimento correto: seta para esquerda + segurança + retorno após ver pelo retrovisor.",
    tip: "Ultrapassar = seta esquerda, acelere, ultrapasse, volte ao ver no retrovisor.",
    incidence: "alta",
    difficulty: 1,
  },
  {
    id: "qp52",
    category: "prioridade",
    statement:
      "Em uma rotatória (roundabout) sem sinalização semafórica, o condutor se aproxima para ingressar na rotatória enquanto outro veículo já está circulando dentro dela. Um terceiro veículo se aproxima pela direita do condutor. De acordo com o CTB, quem tem a preferência de passagem nessa situação?",
    options: [
      "O condutor que está entrando na rotatória, pois a via é mais larga e ele está realizando manobra de conversão",
      "O veículo que já está circulando dentro da rotatória tem a preferência. O condutor que vai entrar deve aguardar, mesmo que o veículo da direita esteja fora da rotatória",
      "O veículo que se aproxima pela direita do condutor tem a preferência, pois a regra geral da direita prevalece sobre a regra da rotatória",
      "Todos os veículos têm igual prioridade e devem parar e negociar visualmente quem passa primeiro",
    ],
    correctIndex: 1,
    explanation:
      "Rotatória: quem já está dentro tem preferência. Quem vai entrar deve aguardar (regra específica do CTB).",
    detailedExplanation:
      "Nas rotatórias, a regra de preferência é específica e DIFERE da regra geral de quem vem pela direita: o veículo que já está circulando dentro da rotatória TEM A PREFERÊNCIA sobre aquele que vai ingressar. O condutor que vai entrar deve REDUZIR a velocidade, observar o fluxo interno e aguardar uma oportunidade segura para entrar. Essa regra visa garantir o fluxo contínuo da rotatória. A regra da 'direita' (alternativa C) não se aplica dentro do contexto de rotatória — a sinalização específica (placa R-33 'Rotatória') e a preferência de quem está dentro prevalecem.",
    legalBase: "Art. 29, II e III do CTB / Res. CONTRAN 745/2018",
    commonMistake:
      "O candidato confunde a regra geral da direita com a regra específica da rotatória. Na dúvida: quem está DENTRO da rotatória passa primeiro. A placa R-33 também reforça: 'Dê a preferência ao veículo que já estiver na rotatória'.",
    tip: "Rotatória: DENTRO tem preferência. Quem entra aguarda.",
    incidence: "alta",
    trap: true,
    difficulty: 2,
  },
  {
    id: "qp53",
    category: "prioridade",
    statement:
      "O condutor de um veículo de emergência (ambulância do SAMU) está em serviço de urgência com a sirene ligada e os faróis intermitentes acesos, aproximando-se de um cruzamento com semáforo fechado para seu sentido. Vários veículos estão parados aguardando o sinal verde. Diante dessa situação, a conduta correta dos condutores dos demais veículos é:",
    options: [
      "Buzinar para alertar o veículo de emergência de que o sinal está fechado e que ele deve aguardar",
      "Permanecer parado, pois o sinal vermelho tem prioridade absoluta sobre qualquer veículo",
      "Deslocar o veículo para a esquerda, liberando a passagem pela direita, e se necessário avançar o sinal vermelho com cuidado para dar passagem ao veículo de emergência",
      "Ligar o pisca-alerta e permanecer imóvel, pois avançar o sinal vermelho, mesmo para dar passagem, constitui infração",
    ],
    correctIndex: 2,
    explanation:
      "Veículo de emergência com sirene: todos devem dar passagem pela esquerda, mesmo que avancem sinal fechado com cuidado.",
    detailedExplanation:
      "O CTB estabelece que os veículos de emergência (ambulância, bombeiros, polícia) TÊM PRIORIDADE sobre todos os demais quando estiverem em serviço de urgência, com sirene e luz intermitente (art. 29, §2º). Os demais condutores DEVERÃO: (1) deslocar-se para a esquerda e liberar a passagem pela direita (em vias com mais de uma faixa); (2) se necessário, PARAR e aguardar o veículo passar; (3) se estiver em um cruzamento, avançar o sinal vermelho COM CUIDADO para liberar a passagem — não é infração dar passagem a veículo de emergência. O condutor do veículo de emergência também deve respeitar a segurança ao cruzar o sinal vermelho.",
    legalBase: "Art. 29, §2º do CTB",
    commonMistake:
      "Muita gente acha que 'sinal vermelho' não pode ser avançado em hipótese alguma. Dar passagem a veículo de emergência é exceção. A banca testa se o candidato sabe que é permitido e que a passagem deve ser PELA ESQUERDA.",
    tip: "Emergência com sirene: DESLOQUE para a esquerda, passe pela direita. Avance o sinal se necessário.",
    incidence: "alta",
    trap: true,
    difficulty: 2,
  },
  {
    id: "qp54",
    category: "prioridade",
    statement:
      "Em uma faixa de pedestres sem semáforo, um pedestre com bengala branca (deficiente visual) está parado na calçada com a bengala estendida, aparentemente aguardando para atravessar. Um veículo se aproxima. De acordo com o CTB e o Estatuto da Pessoa com Deficiência, o condutor deve:",
    options: [
      "Buzinar para alertar o pedestre de que o veículo está passando, pois ele pode não perceber a aproximação",
      "Acelerar e passar rapidamente antes que o pedestre inicie a travessia, para evitar ter que parar",
      "Parar o veículo e dar preferência total ao pedestre com deficiência visual, que tem prioridade absoluta sobre qualquer veículo, devendo o condutor aguardar a travessia completa",
      "Reduzir a velocidade e passar lentamente atrás do pedestre, mantendo distância segura",
    ],
    correctIndex: 2,
    explanation:
      "Pedestre com deficiência visual (bengala branca) tem prioridade absoluta. O condutor DEVE parar e aguardar a travessia completa.",
    detailedExplanation:
      "O CTB e a Lei 13.146/2015 (Estatuto da Pessoa com Deficiência) estabelecem que pedestres com deficiência, especialmente aqueles com bengala branca (deficiência visual) ou cão-guia, têm PRIORIDADE ABSOLUTA sobre os veículos. O condutor DEVE: parar o veículo (não apenas reduzir), dar passagem segura e aguardar a travessia completa do pedestre. A buzina (A) é desrespeitosa e assustadora, pode desorientar o pedestre. Acelerar para passar (B) é infração gravíssima (art. 214 do CTB — deixar de dar preferência ao pedestre). A bengala branca é mundialmente reconhecida como símbolo de deficiência visual.",
    legalBase: "Art. 70 do CTB / Lei 13.146/2015 (Estatuto da Pessoa com Deficiência)",
    commonMistake:
      "O candidato acha que 'reduzir' e 'passar atrás' é suficiente. A banca testa se sabe que para PESSOA COM DEFICIÊNCIA a preferência é ABSOLUTA — o veículo deve PARAR e aguardar, não apenas reduzir.",
    tip: "Bengala branca (deficiente visual) = PARE e aguarde. Prioridade absoluta.",
    incidence: "media",
    trap: true,
    difficulty: 2,
  },
  {
    id: "qp55",
    category: "placas",
    statement:
      "Durante uma viagem, o condutor avista uma placa de sinalização vertical de cor azul com um símbolo branco representando um telefone. Mais adiante, outra placa de cor verde indica a distância até a próxima cidade. De acordo com a classificação geral da sinalização vertical do CTB, essas placas pertencem, respectivamente:",
    options: [
      "Ambas são placas de Regulamentação, pois informam regras obrigatórias ao condutor",
      "A primeira é placa de Advertência (alerta sobre telefone disponível) e a segunda é de Indicação de Destino",
      "A primeira é placa de Indicação de Serviços Auxiliares e a segunda é placa de Indicação de Orientação de Destino — ambas pertencem ao grupo de Sinalização de Indicação",
      "A primeira é placa de Educação (cor azul) e a segunda é placa de Regulamentação (cor verde)",
    ],
    correctIndex: 2,
    explanation:
      "Placa azul com símbolo branco = Serviço Auxiliar (I). Placa verde = Orientação de Destino. Ambas são Sinalização de INDICAÇÃO.",
    detailedExplanation:
      "A Sinalização Vertical de INDICAÇÃO divide-se em: INDICAÇÃO DE SERVIÇOS AUXILIARES: placas de fundo AZUL com símbolo BRANCO — informam serviços ao longo da via (hospital, telefone, posto de gasolina, restaurante, hospedagem, oficina). INDICAÇÃO DE ORIENTAÇÃO DE DESTINO: placas VERDES para orientação de cidades e distâncias, MARRONS para atrativos turísticos e BRANCAS para identificação de logradouros. A sinalização de REGULAMENTAÇÃO é de fundo BRANCO com borda VERMELHA (obriga ou proíbe). ADVERTÊNCIA é AMARELA (alerta). A cor é um dos principais critérios de identificação na prova.",
    commonMistake:
      "A banca adora confundir a cor das placas: azul = serviço auxiliar; verde = destino; branca = regulamentação; amarela = advertência. Decore as cores e a classificação.",
    tip: "Azul = serviço auxiliar. Verde = destino. Ambas = INDICAÇÃO.",
    incidence: "alta",
    trap: true,
    difficulty: 2,
  },
  {
    id: "qp56",
    category: "placas",
    statement:
      "Em uma via urbana, o condutor se depara com uma placa redonda de fundo branco com borda vermelha e um símbolo preto representando uma buzina estilizada com um traço diagonal sobre ela. Mais adiante, outra placa, agora de formato quadrado e fundo amarelo, mostra uma figura de uma criança preta. Assinale a alternativa que classifica corretamente essas placas:",
    options: [
      "A primeira é placa de Advertência (R-19 — buzina proibida) e a segunda é placa de Regulamentação (A-32b — crianças)",
      "A primeira é placa de Regulamentação (R-19 — buzina proibida) e a segunda é placa de Advertência (A-32b — área escolar ou crianças)",
      "Ambas são placas de Regulamentação, pois proíbem ou obrigam comportamentos",
      "A primeira é placa de Regulamentação (proíbe buzina) e a segunda é placa de Indicação (informa presença de escola)",
    ],
    correctIndex: 1,
    explanation:
      "Placa redonda branca/vermelha = Regulamentação (R-19: buzina proibida). Placa quadrada amarela = Advertência (A-32b: crianças).",
    detailedExplanation:
      "A classificação da sinalização vertical se dá por forma e cor: REGULAMENTAÇÃO: formato REDONDO, fundo BRANCO, borda VERMELHA — obriga ou proíbe. Ex: R-1 (Pare), R-2 (Dê a preferência), R-19 (Buzina proibida). ADVERTÊNCIA: formato QUADRADO (losangular), fundo AMARELO — alerta sobre perigos ou situações inesperadas. Ex: A-32b (Crianças / área escolar), A-33a (Animais). A pegadinha está na confusão entre 'buzina proibida' (R-19 — regulamentação) e 'advertência de crianças' (A-32b — advertência). Na alternativa D, a segunda placa é Advertência, não Indicação (azul).",
    legalBase: "Manual Brasileiro de Sinalização de Trânsito — Volume I (Sinalização Vertical)",
    commonMistake:
      "A banca adora confundir placas REDONDAS (regulamentação) com QUADRADAS (advertência) e vice-versa. Decore: círculo = obriga/proíbe; losango/quadrado = alerta.",
    tip: "Redonda branca/vermelha = REGULAMENTAÇÃO. Quadrada amarela = ADVERTÊNCIA.",
    incidence: "alta",
    trap: true,
    difficulty: 2,
  },
  {
    id: "qd01",
    category: "placas",
    statement:
      "Em uma rodovia, o condutor se aproxima de um trecho de obras onde a pista passa por um estreitamento (afunilamento), com a sinalização de advertência A-10 (Estreitamento de pista) indicando a redução das faixas de rolamento adiante. De acordo com o CTB e os preceitos da direção defensiva, a conduta CORRETA do condutor ao se aproximar desse trecho é:",
    options: [
      "Acelerar para passar antes do estreitamento, garantindo a prioridade pela maior velocidade.",
      "Reduzir a velocidade, observar a sinalização e cooperar com a alternância de passagem, cedendo a vez ao veículo que já se encontra posicionado no trecho estreito.",
      "Parar o veículo imediatamente no meio da pista e acionar o pisca-alerta até o tráfego escoar.",
      "Manter a velocidade constante e acionar a buzina de forma contínua para alertar os demais condutores sobre o estreitamento.",
    ],
    correctIndex: 1,
    explanation:
      "A placa A-10 (Estreitamento de pista) é placa de ADVERTÊNCIA: avisa que a pista se estreita adiante. O correto é reduzir a velocidade e cooperar na alternância (zíper), cedendo a vez a quem já está no trecho estreito.",
    detailedExplanation:
      "O afunilamento (estreitamento) de pista é sinalizado pela placa A-10 e indica que as faixas de rolamento diminuem adiante. Nessas situações, o CTB e a direção defensiva determinam: REDUZIR a velocidade, redobrar a atenção e cooperar com a alternância de passagem — os veículos entram no trecho estreito de forma intercalada ('efeito zíper'), e o condutor cede a vez ao veículo que já se encontra posicionado no trecho. Acelerar para 'furar' a fila, parar no meio da pista ou buzinar de forma contínua são condutas perigosas que geram congestionamentos e colisões.",
    legalBase:
      "Manual Brasileiro de Sinalização de Trânsito — Volume I (placa A-10) e princípios da direção defensiva",
    commonMistake:
      "A banca testa a leitura da sinalização: afunilamento NÃO é 'pare' nem 'preferência' — é ADVERTÊNCIA de redução de pista. Não confunda a placa A-10 com a placa PARE (R-1).",
    tip: "A-10 = Estreitamento de pista = aviso. Reduza e coopere no zíper.",
    incidence: "alta",
    trap: true,
    difficulty: 2,
  },
  {
    id: "qd02",
    category: "legislacao",
    statement:
      "De acordo com o art. 90 do CTB, a sinalização de trânsito também é realizada por sinais sonoros (silvos de apito) e gestos do agente de trânsito. Sobre os silvos de apito emitidos pelo agente, é correto afirmar que:",
    options: [
      "Um silvo longo significa 'sigam' (liberar a passagem) e dois silvos breves significam 'diminuam a marcha'.",
      "Um silvo breve significa 'sigam'; dois silvos breves significam 'parem'; um silvo longo significa 'diminuam a marcha'.",
      "Os silvos não possuem significado oficial, servindo apenas para chamar a atenção dos condutores.",
      "Os silvos de apito só têm validade se acompanhados de gestos; isoladamente não orientam o trânsito.",
    ],
    correctIndex: 1,
    explanation:
      "Art. 90 do CTB: um silvo breve = siga; dois silvos breves = pare; um silvo longo = diminua a marcha.",
    detailedExplanation:
      "O apito do agente é forma oficial de sinalização prevista no art. 90 do CTB, que define: um silvo BREVE — 'siga'; dois silvos BREVES — 'parem'; um silvo LONGO — 'diminuam a marcha'. Esses sinais sonoros normalmente acompanham os gestos do agente, mas têm significado próprio e devem ser obedecidos por todos os condutores. Decorar esses três comandos garante ponto na prova.",
    legalBase: "Art. 90 do CTB",
    commonMistake:
      "A pegadinha clássica inverte os significados: trocar 'dois breves = pare' por 'siga', ou afirmar que o silvo longo significa parar. Lembre: 1 breve = siga; 2 breves = pare; 1 longo = devagar.",
    tip: "Decore: 1 pio = vai; 2 pios = para; 1 pio longo = devagar.",
    incidence: "altissima",
    trap: true,
    difficulty: 2,
  },
  {
    id: "qd03",
    category: "legislacao",
    statement:
      "Em um cruzamento com semáforo funcionando normalmente, um agente de trânsito postado no centro orienta, por gestos convencionais de braço, a parada dos veículos de uma via e a passagem dos veículos da via transversal. Considerando a hierarquia das sinalizações prevista no CTB, assinale a alternativa correta:",
    options: [
      "Os gestos do agente prevalecem sobre as demais sinalizações, devendo os condutores obedecer às suas ordens mesmo que contrariem o semáforo.",
      "O semáforo prevalece sobre os gestos do agente, pois a sinalização semafórica tem prioridade máxima.",
      "As placas de regulamentação prevalecem sobre os gestos do agente, por serem sinalização fixa e permanente.",
      "O agente pode orientar, mas o condutor deve seguir o semáforo, pois desobedecê-lo sempre configura infração.",
    ],
    correctIndex: 0,
    explanation:
      "Hierarquia das sinalizações (art. 89 do CTB): os gestos do agente prevalecem sobre as demais sinalizações, incluindo o semáforo.",
    detailedExplanation:
      "O art. 89 do CTB estabelece a hierarquia das sinalizações: 1º) as ordens do AGENTE DE TRÂNSITO (gestos e apito); 2º) a sinalização SEMAFÓRICA; 3º) a sinalização VERTICAL (placas); 4º) a sinalização HORIZONTAL (marcas no pavimento). Por isso, quando um agente orienta o trânsito em um cruzamento, seus gestos prevalecem sobre o semáforo e as placas — o condutor deve obedecer ao agente, mesmo que isso contrarie o sinal luminoso. Desobedecer às ordens do agente configura infração (art. 195 do CTB).",
    legalBase: "Arts. 89 e 195 do CTB",
    commonMistake:
      "A banca troca a ordem da hierarquia (colocando o semáforo acima do agente) ou confunde 'gestos do agente' com 'sinalização vertical'. Hierarquia: AGENTE > SEMÁFORO > PLACA > SINALIZAÇÃO HORIZONTAL.",
    tip: "Hierarquia: o agente manda mais que o semáforo — a 'mão do agente' prevalece sobre o vermelho.",
    incidence: "altissima",
    trap: true,
    difficulty: 2,
  },
  {
    id: "qp57",
    category: "legislacao",
    statement:
      "Um condutor transita com seu veículo automotor por uma via urbana de pista simples e duplo sentido de circulação. Ao aproximar-se de um cruzamento, ele sinaliza a intenção de convergir à esquerda. Considerando as normas gerais de circulação e conduta do Código de Trânsito Brasileiro (CTB), bem como o correto posicionamento do veículo antes e durante a manobra, como o condutor deve proceder para convergir de forma legal e segura?",
    options: [
      "Para convergir, o condutor deve deslocar o veículo com a devida antecedência para a posição mais próxima possível do bordo esquerdo da pista de rolamento, imobilizar o veículo e aguardar o fluxo em sentido contrário antes de cruzar a via.",
      "Para convergir, o condutor deve deslocar o veículo com a devida antecedência para a posição mais próxima possível da linha divisória central da pista, sem invadir a faixa do sentido oposto, e efetuar a conversão com segurança após ceder a preferência aos veículos que transitam no sentido contrário.",
      "Para convergir, o condutor deve obrigatoriamente deslocar o veículo para o bordo direito da pista de rolamento, parar no acostamento ou bordo lateral e aguardar o momento oportuno de tráfego livre em ambos os sentidos para efetuar a manobra.",
      "Para convergir, o condutor deve manter o veículo centralizado na sua faixa, acionar o pisca-alerta (luzes de advertência) e realizar a conversão rapidamente, tendo em vista que a sinalização de intenção lhe garante a preferência sobre os veículos do fluxo oposto.",
    ],
    correctIndex: 1,
    explanation:
      "Art. 38 do CTB: ao convergir à esquerda em via de duplo sentido, o condutor deve posicionar o veículo o mais próximo possível da linha divisória central da pista (sem invadir a faixa do sentido oposto) e ceder a preferência aos veículos que vêm em sentido contrário.",
    detailedExplanation:
      "O art. 38, inciso II do CTB disciplina a conversão à esquerda em via de pista simples e duplo sentido de circulação: o condutor deve deslocar o veículo, com a devida antecedência, para a posição mais próxima possível da linha divisória central da pista (sem cruzá-la nem invadir a faixa do sentido oposto) e efetuar a conversão após ceder a preferência aos veículos que transitam em sentido contrário. A alternativa A erra ao citar o 'bordo esquerdo' — posicionamento que vale apenas para vias de sentido único de circulação; fazer isso em via de duplo sentido coloca o veículo na contramão. A alternativa C induz ao erro de aplicar a regra de rodovia (deslocar-se para o bordo direito/acostamento), que não se aplica à conversão em via urbana. A alternativa D traz o mito clássico de que 'dar a seta garante preferência' e ainda sugere o uso indevido do pisca-alerta com o veículo em movimento, vedado pelo art. 40 do CTB.",
    legalBase: "Arts. 38, II e 40 do CTB",
    commonMistake:
      "Três pegadinhas: (A) 'bordo esquerdo' só vale em via de sentido único — em duplo sentido isso é contramão; (C) regra de rodovia (bordo direito/acostamento) aplicada a via urbana; (D) mito de que a seta garante preferência + pisca-alerta com o veículo em movimento (proibido pelo art. 40 do CTB).",
    tip: "Esquerda em mão dupla = perto da LINHA CENTRAL (sem invadir) + ceder passagem a quem vem de frente. 'Bordo esquerdo' é só em via de sentido único.",
    incidence: "altissima",
    trap: true,
    difficulty: 3,
  },
  {
    id: "qp58",
    category: "mecanica",
    statement:
      "Durante um deslocamento em via urbana de tráfego intenso, um condutor percebe uma retenção repentina do fluxo de veículos à sua frente. Em momento de pânico, ao tentar imobilizar rapidamente o automóvel, ele executa uma manobra inadequada nos comandos do veículo que provoca o imediato travamento das rodas traseiras, com consequente perda de aderência e risco iminente de derrapagem (eixo traseiro desgarrando). Considerando a mecânica veicular e as técnicas de condução segura, assinale a opção que apresenta corretamente a causa direta desse comportamento dinâmico do veículo:",
    options: [
      "A aplicação progressiva do pedal do freio de serviço associada ao acionamento do pedal de embreagem antes da parada total do veículo.",
      "O acionamento brusco e intempestivo do freio de estacionamento (freio de mão) com o veículo ainda em movimento, ou a redução forçada e inadequada de marcha em alta velocidade provocando um bloqueio mecânico do eixo motriz.",
      "O acionamento do sistema ABS (Antilock Braking System), que força a imobilização instantânea e simultânea do tambor e das sapatas do eixo traseiro.",
      "A perda temporária do fluido de freio no cilindro mestre, o que equaliza a pressão hidráulica e trava automaticamente apenas os discos traseiros por segurança.",
    ],
    correctIndex: 1,
    explanation:
      "O freio de estacionamento atua nas rodas traseiras da maioria dos veículos leves; puxado com o veículo em movimento — ou a redução forçada de marcha em alta velocidade — trava o eixo traseiro e faz o carro derrapar.",
    detailedExplanation:
      "O travamento brusco das rodas traseiras com o veículo em movimento tem duas causas práticas: (1) o acionamento do freio de estacionamento (freio de mão), que na imensa maioria dos veículos leves atua exclusivamente sobre as rodas traseiras — acionado com o veículo em movimento, trava o eixo traseiro na hora; (2) a redução forçada e inadequada de marcha em alta velocidade, que gera um bloqueio mecânico do eixo motriz. Esse travamento tira a aderência da traseira e provoca a derrapagem conhecida como 'eixo traseiro desgarrando'. A alternativa A descreve a frenagem de emergência CORRETA (pedal de serviço + embreagem), que não trava rodas. A alternativa C inverte o conceito do ABS: o sistema antibloqueio serve exatamente para IMPEDIR o travamento das rodas. A alternativa D usa termos técnicos (cilindro mestre, equalização hidráulica), mas a perda de fluido causa perda de força de frenagem (pedal 'fofo') e jamais trava o eixo traseiro.",
    legalBase: "Fundamentos de mecânica veicular e condução segura (art. 28 do CTB)",
    commonMistake:
      "O candidato leigo lê 'ABS' e acha que o sistema trava as rodas — é o contrário. E os termos técnicos da alternativa D (cilindro mestre, pressão hidráulica) escondem o erro: falta de fluido = perda de freio, nunca travamento de eixo.",
    tip: "Traseira travou = freio de MÃO em movimento ou redução de marcha forçada. ABS = nunca deixa travar as rodas.",
    incidence: "alta",
    trap: true,
    difficulty: 3,
  },
  {
    id: "qp59",
    category: "direcao-defensiva",
    statement:
      "Um condutor transita com seu veículo automotor por uma via urbana no horário de saída escolar. Ao se aproximar de uma zona estritamente escolar, ele nota uma grande movimentação de crianças e pedestres aglomerados junto ao meio-fio, além de alguns estudantes cruzando a pista de rolamento fora da faixa de pedestres. Diante desse cenário de alto risco e vulnerabilidade, e considerando as normas de Direção Defensiva e o Código de Trânsito Brasileiro (CTB), como o condutor deve proceder?",
    options: [
      "Acelerar moderadamente para ultrapassar rapidamente o trecho de aglomeração escolar, acionando continuamente a buzina para alertar e afastar os pedestres e crianças da pista de rolamento.",
      "Reduzir a velocidade do veículo de forma compatível com a segurança local, mantendo atenção redobrada e prontidão para imobilizar o automóvel, independentemente de a velocidade regulamentada da via ser maior.",
      "Manter rigorosamente a velocidade máxima permitida fixada pelas placas da via, visto que a responsabilidade pela travessia em local inadequado é exclusivamente dos pedestres e de seus responsáveis.",
      "Acionar imediatamente as luzes de advertência (pisca-alerta), manter a velocidade de cruzeiro e realizar sucessivos sinais de luz (farol alto) para garantir sua preferência de passagem diante dos pedestres.",
    ],
    correctIndex: 1,
    explanation:
      "Em área escolar com crianças e pedestres aglomerados, o correto é reduzir a velocidade compatível com a segurança local, redobrar a atenção e estar pronto para parar.",
    detailedExplanation:
      "A direção defensiva manda adaptar a condução às condições reais do ambiente: onde há aglomeração de crianças e pedestres, a segurança prevalece sobre a velocidade máxima fixada nas placas. O condutor deve reduzir a velocidade de forma compatível com o local, manter atenção redobrada e prontidão para imobilizar o veículo. Acelerar e buzinar (A) coloca em risco justamente os usuários mais vulneráveis da via. Manter a velocidade da placa (C) ignora a situação real de perigo e transfere indevidamente a responsabilidade — o CTB e a direção defensiva exigem que o condutor proteja o pedestre independentemente de quem atravessa em local inadequado. O pisca-alerta com o veículo em movimento é proibido (art. 40 do CTB) e sinais de luz (D) não conferem preferência sobre pedestres.",
    legalBase: "Arts. 28, 29 e 40 do CTB e princípios da direção defensiva",
    commonMistake:
      "A pegadinha está em 'velocidade da placa': o limite máximo NÃO autoriza manter a velocidade quando há risco real. E o pisca-alerta com o carro em movimento é proibido (art. 40 do CTB).",
    tip: "Criança na rua = REDUZIR a velocidade + atenção redobrada + pronto para parar. A placa dá o limite, a segurança dá a conduta.",
    incidence: "altissima",
    trap: true,
    difficulty: 2,
  },
  {
    id: "qp60",
    category: "direcao-defensiva",
    statement:
      "Um condutor trafega por uma rodovia de pista dupla e tráfego rápido quando percebe que ultrapassou, por descuido, a alça de acesso para a entrada da cidade onde pretendia desembarcar. Ao constatar o equívoco, o motorista avalia como proceder para corrigir o seu trajeto. Considerando os preceitos da Direção Defensiva, as normas de segurança e a legislação de trânsito vigente (CTB), qual é a conduta correta e segura que o condutor deve adotar nessa situação?",
    options: [
      "Deslocar o veículo imediatamente para o acostamento à direita, acionar as luzes de advertência (pisca-alerta) e realizar uma manobra de marcha à ré em velocidade reduzida até alcançar a alça de acesso perdida.",
      "Imobilizar o veículo no acostamento, desembarcar e abordar condutores ou pedestres locais para solicitar orientações sobre atalhos informais ou acessos clandestinos pela faixa de domínio.",
      "Continuar transitando normalmente pela rodovia, mantendo a velocidade regulamentada da via, e prosseguir até a próxima saída, interseção ou retorno devidamente sinalizado e autorizado.",
      "Reduzir drasticamente a velocidade do veículo no bordo direito da pista de rolamento e trafegar vagarosamente com o pisca-alerta ligado até avistar uma brecha no canteiro central para cruzar a pista.",
    ],
    correctIndex: 2,
    explanation:
      "Errou a saída? Continue até a próxima saída, interseção ou retorno sinalizado — nunca faça marcha à ré, não pare no acostamento nem improvise retorno.",
    detailedExplanation:
      "No trânsito de alta velocidade em rodovias, qualquer tentativa de improvisar retorno coloca vidas em risco. A lei e a direção defensiva determinam que o condutor aceite o erro e prossiga até o próximo retorno oficial, mesmo que isso adicione alguns quilômetros ao percurso. A alternativa A comete o erro mais comum e mais grave: marcha à ré em rodovia, mesmo no acostamento, é infração GRAVÍSSIMA (art. 206, V do CTB) e é causa de acidentes gravíssimos pela enorme diferença de velocidade. A alternativa B induz a achar que 'pedir ajuda' é seguro, mas parar ou desembarcar no acostamento sem motivo de emergência mecânica/médica é proibido e extremamente perigoso. A alternativa D mistura dois erros: usar o pisca-alerta com o veículo em movimento (proibido) e trafegar em velocidade muito inferior à da via, infração prevista no art. 219 do CTB (velocidade inferior à metade da máxima da via, quando isso atrapalha o trânsito).",
    legalBase: "Arts. 206, V e 219 do CTB e princípios da direção defensiva",
    commonMistake:
      "A pegadinha da A é a mais cobrada na vida real: muita gente acha que 'um pouquinho de ré no acostamento' resolve — é gravíssima. A B explora a falsa sensação de segurança de 'pedir informações'. A D testa o conhecimento de que pisca-alerta em movimento e velocidade muito baixa também são infrações.",
    tip: "Errou a saída = SEGUE EM FRENTE até o próximo retorno. Ré em rodovia é gravíssima, e parar no acostamento só em emergência real.",
    incidence: "altissima",
    trap: true,
    difficulty: 3,
  },
  {
    id: "qp61",
    category: "direcao-defensiva",
    statement:
      "Durante o deslocamento noturno por uma via urbana não iluminada, um condutor decide manter acesa a luz interna do habitáculo (luz de teto/cortesia) do veículo enquanto dirige. Considerando o sistema de iluminação veicular, a sinalização regulamentar prevista no Código de Trânsito Brasileiro (CTB) e a visão anatômica do condutor à noite, assinale a opção correta quanto à finalidade das luzes veiculares e aos riscos associados a essa conduta:",
    options: [
      "A iluminação interna do habitáculo é um dispositivo de segurança ativa destinado primordialmente a aumentar a visibilidade do veículo pelos demais motoristas que transitam no sentido oposto.",
      "A luz interna de teto serve exclusivamente para iluminação passageira do habitáculo com o veículo parado ou fora de circulação crítica, sendo que mantê-la acesa em movimento prejudica a visão noturna do condutor por provocar reflexos no para-brisa e ofuscamento interno.",
      "A luz interna tem como função legal substituir as luzes de posição (lanternas) em caso de avaria mecânica no sistema elétrico dianteiro, garantindo a trafegabilidade noturna do veículo.",
      "O acionamento contínuo da luz do teto é obrigatório em vias não iluminadas para compensar a ausência de iluminação pública e sinalizar a presença de passageiros aos agentes de trânsito.",
    ],
    correctIndex: 1,
    explanation:
      "A iluminação externa (faróis, lanternas, luz de placa) é a única responsável pela visibilidade do veículo e da via; a luz interna acesa em movimento atrapalha a visão noturna por reflexos no para-brisa.",
    detailedExplanation:
      "A iluminação interna do habitáculo serve apenas para a conveniência dos ocupantes e não tem qualquer função de sinalização do veículo. Em movimento à noite, a luz interna acesa cria reflexos no para-brisa e reduz a adaptação das pupilas à escuridão externa, prejudicando a visibilidade do condutor e aumentando o risco de acidente. A alternativa A é a pegadinha clássica — confunde iluminação interna com luzes de posição/faróis: a visibilidade do veículo para os outros é garantida pelas lanternas e faróis, não pela luz do teto. A alternativa C inventa uma 'função de emergência' técnica inexistente para substituir as lanternas. A alternativa D cria uma falsa obrigatoriedade: não existe regra que obrigue a manter a luz do teto acesa em vias sem iluminação.",
    legalBase: "Sistema de iluminação veicular (arts. 40 e 249 do CTB)",
    commonMistake:
      "A pegadinha da A é a lembrança da sua própria prova: o leigo acha que 'quanto mais luz por dentro, mais os outros me veem', confundindo iluminação interna com luzes de posição/faróis. A C inventa função técnica falsa e a D usa termos de 'obrigatoriedade' para confundir.",
    tip: "Luz do teto à noite = conforto do passageiro, NÃO sinalização. Acesa em movimento, reflete no vidro e atrapalha quem dirige.",
    incidence: "alta",
    trap: true,
    difficulty: 2,
  },
  {
    id: "qp62",
    category: "meio-ambiente",
    statement:
      "Durante uma fiscalização de rotina (blitz), os agentes de trânsito abordam um veículo automotor que havia sido reprovado na inspeção veicular obrigatória de emissão de gases poluentes e ruídos (programa de controle ambiental / PROCONVE). O proprietário atual, que havia adquirido o automóvel mesmo sabendo da irregularidade ambiental e da proibição de circulação, mantinha o veículo rodando pelas vias públicas sem sanar o problema nos sistemas de exaustão e catalisador. Diante do Código de Trânsito Brasileiro (CTB) e das normas ambientais vigentes, qual é a penalidade e a medida administrativa a que esse condutor está sujeito?",
    options: [
      "Infração Gravíssima; sujeita a penalidade de multa, apreensão da CNH e medida administrativa de remoção imediata do veículo (reboque) para o depósito oficial.",
      "Infração Grave; sujeita a penalidade de multa e medida administrativa de retenção do veículo até a regularização do sistema de emissão de poluentes.",
      "Infração Leve; sujeita apenas a advertência por escrito pelo agente fiscalizador, sem incidência de multa ou retenção por se tratar de primeira abordagem.",
      "Crime de Trânsito Ambiental inafiançável; sujeito à cassação definitiva do documento de habilitação (CNH) e perda da propriedade do bem em favor do órgão ambiental (IBAMA).",
    ],
    correctIndex: 1,
    explanation:
      "Transitar com o veículo em desacordo com as condições de emissão de poluentes e ruídos é infração GRAVE, com multa e RETENÇÃO (não remoção) do veículo para regularização.",
    detailedExplanation:
      "O art. 230, XVIII do CTB qualifica como infração GRAVE transitar com o veículo em desacordo com as condições de emissão de poluentes e ruídos estabelecidas por lei. A medida administrativa é a RETENÇÃO do veículo para regularização — o condutor resolve o problema (catalisador, sistema de exaustão) e o veículo é liberado. A alternativa A é a armadilha clássica do DETRAN: trocar RETENÇÃO por REMOÇÃO. O veículo reprovado na inspeção não é 'guinchado' para o depósito; ele é retido até regularizar. A alternativa C subestima a gravidade: problema ambiental é infração grave, não leve/advertência. A alternativa D confunde a infração administrativa do CTB com crime ambiental penal inafiançável — os termos exagerados (cassação definitiva, perda da propriedade em favor do IBAMA) não existem para essa hipótese.",
    legalBase: "Art. 230, XVIII do CTB",
    commonMistake:
      "A pegadinha da A é a mais cobrada: ver 'reprovado na vistoria' e concluir gravíssima + remoção/reboque. Retenção ≠ Remoção. A D assusta com 'crime inafiançável' e 'cassação da CNH' — pura decoreba sem leitura da lei.",
    tip: "Emissão de poluentes/ruído irregular = GRAVE + RETENÇÃO para regularizar (não é remoção). Grave com retenção, nunca gravíssima com reboque.",
    incidence: "alta",
    trap: true,
    difficulty: 3,
  },
  {
    id: "qp63",
    category: "legislacao",
    statement:
      "Um condutor trafega com seu veículo automotor por uma via urbana destinada a coletar e distribuir o trânsito que entra ou sai das vias de maior porte, possibilitando a circulação dentro dos bairros e o acesso a áreas residenciais ou comerciais. Ao ingressar nessa via, o motorista observa atentamente as margens do trecho e constata a ausência total de sinalização regulamentadora de velocidade (placas R-19). Considerando a classificação funcional das vias urbanas e as regras gerais estabelecidas pelo Código de Trânsito Brasileiro (CTB) para trechos não sinalizados, qual é a velocidade máxima permitida para esse condutor na referida via?",
    options: [
      "30 km/h, por se tratar de uma via de acesso local estritamente destinada a áreas lindeiras e de pequenos quarteirões.",
      "40 km/h, por se tratar de uma via coletora, devendo o condutor respeitar este limite legal na ausência de sinalização específica.",
      "60 km/h, tendo em vista que o veículo transita por uma via urbana de fluxo contínuo e interconexão de bairros (via arterial).",
      "80 km/h, pois a ausência de sinalização regulamentadora faculta ao condutor trafegar na velocidade máxima urbana permitida para vias de trânsito rápido.",
    ],
    correctIndex: 1,
    explanation:
      "Via coletora sem sinalização = 40 km/h (art. 61 do CTB). As vias coletoras coletam e distribuem o trânsito que entra e sai das vias de maior porte.",
    detailedExplanation:
      "O art. 60 do CTB define a via coletora como aquela destinada a coletar e distribuir o trânsito que tem necessidade de entrar ou sair das vias de trânsito rápido ou arteriais, possibilitando o trânsito dentro das regiões da cidade. O art. 61 estabelece que, onde não houver sinalização regulamentadora, a velocidade máxima nas vias urbanas é: 30 km/h nas vias locais; 40 km/h nas vias coletoras; 60 km/h nas vias arteriais; e 80 km/h nas vias de trânsito rápido. A alternativa A confunde a via coletora (40 km/h) com a via local (30 km/h). A alternativa C confunde a coletora com a arterial (60 km/h). A alternativa D reforça o mito de que 'sem placa não há limite' — o limite legal padrão continua valendo e 80 km/h é da via de trânsito rápido, não da coletora.",
    legalBase: "Arts. 60 e 61 do CTB",
    commonMistake:
      "A pegadinha está em confundir os quatro limites padrão urbanos (30/40/60/80) com o tipo de via. A coletora é 40 km/h — o 'meio' da escada, entre a local (30) e a arterial (60). Decore a sequência: local 30, coletora 40, arterial 60, trânsito rápido 80.",
    tip: "Coletora = 40 km/h. Decore a escada urbana: local 30, coletora 40, arterial 60, trânsito rápido 80.",
    incidence: "altissima",
    trap: true,
    difficulty: 2,
  },
  {
    id: "sinistro-sinalizacao-001",
    category: "legislacao",
    statement:
      "Após um sinistro de trânsito, um veículo permanece imobilizado parcialmente sobre a pista, em um trecho de circulação de veículos. O condutor consegue adotar medidas para reduzir o risco de novas colisões e decide sinalizar o local antes de aguardar o atendimento. Considerando as regras de segurança e sinalização aplicáveis à situação, assinale a alternativa que apresenta a conduta CORRETA.",
    options: [
      "Acionar imediatamente as luzes de advertência e posicionar o triângulo de sinalização ou equipamento similar a, no mínimo, 30 metros da parte traseira do veículo, perpendicularmente ao eixo da via e em condição de boa visibilidade.",
      "Acionar imediatamente as luzes de advertência e posicionar o triângulo de sinalização exatamente a 30 metros da parte dianteira do veículo, mantendo-o paralelo ao eixo da via para que seja percebido pelos condutores que se aproximam.",
      "Posicionar o triângulo de sinalização a aproximadamente 30 metros do veículo, preferencialmente no centro da faixa de circulação, sendo dispensável o acionamento das luzes de advertência quando o veículo estiver visível aos demais condutores.",
      "Posicionar o triângulo de sinalização a uma distância inferior a 30 metros do veículo, desde que fique perpendicular ao eixo da via, pois a distância mínima somente é exigida quando o sinistro envolver vítima.",
    ],
    correctIndex: 0,
    explanation:
      "A alternativa A está correta porque prevê o acionamento das luzes de advertência e a colocação do triângulo ou equipamento similar a, no mínimo, 30 metros da parte traseira do veículo, perpendicularmente ao eixo da via e em condição de boa visibilidade.",
    detailedExplanation:
      "Em caso de sinistro, quando o condutor puder adotar providências para evitar perigo no local, deve agir de forma a tornar a situação perceptível aos demais usuários da via. Entre as providências previstas está o acionamento imediato das luzes de advertência e a colocação do triângulo de sinalização ou equipamento similar a uma distância mínima de 30 metros da parte traseira do veículo. O equipamento deve ser instalado perpendicularmente ao eixo da via e em condição de boa visibilidade. A pegadinha principal está em trocar a referência da parte traseira pela dianteira, alterar a posição do equipamento ou transformar os 30 metros em uma distância facultativa.",
    legalBase:
      "CTB, art. 176, V; CTB, art. 225, conforme a situação; Manual Brasileiro de Fiscalização de Trânsito (MBFT), procedimentos relativos à sinalização do local do sinistro.",
    commonMistake:
      "Confundir a distância mínima de 30 metros com uma distância medida a partir da dianteira do veículo, ou acreditar que o triângulo deve ficar paralelo à via. Outro erro comum é considerar que apenas o triângulo deve ser utilizado, ignorando o acionamento das luzes de advertência.",
    tip: "Memorize: TRIÂNGULO = mínimo 30 m + atrás do veículo + perpendicular à via + boa visibilidade.",
    incidence: "alta",
    trap: true,
    difficulty: 3,
  },
  {
    id: "qp64",
    category: "legislacao",
    statement:
      "De acordo com as regras gerais de circulação e conduta estabelecidas pelo Código de Trânsito Brasileiro (CTB), em uma via aberta à circulação, o trânsito de veículos deve ser feito pelo seguinte lado da pista:",
    options: [
      "Pelo lado esquerdo, seguindo o padrão internacional de trânsito rápido (mão inglesa), facilitando ultrapassagens seguras em vias urbanas.",
      "Pelo lado direito da via, admitindo-se as exceções devidamente sinalizadas pelo órgão competente ou em manobras de ultrapassagem.",
      "Pelo centro da via, para garantir uma distância segura dos acostamentos, calçadas e pedestres que circulam nas laterais.",
      "Pelo lado que apresentar melhor estado de conservação do asfalto, cabendo ao condutor decidir livremente a faixa mais conveniente.",
    ],
    correctIndex: 1,
    explanation:
      "A circulação deve ocorrer pelo lado direito da via, salvo as exceções sinalizadas (Art. 29, II do CTB).",
    detailedExplanation:
      "O art. 29, inciso II do CTB estabelece expressamente que a circulação de veículos nas vias abertas ao tráfego obedecerá à norma de que ela deve ser feita pelo lado direito da via, admitindo-se as exceções devidamente sinalizadas. Transitar pela esquerda/contramão é proibido e gera infração gravíssima. A alternativa A induz ao erro fazendo referência à mão inglesa (padrão de países como Reino Unido e Japão). A alternativa C é incorreta e perigosa por sugerir circulação pelo centro. A alternativa D simula uma autonomia ilegal para o condutor escolher a faixa com base nas condições do pavimento.",
    legalBase: "Art. 29, II do CTB",
    commonMistake:
      "Confundir a regra padrão com as exceções de circulação (como desvios sinalizados ou ultrapassagens), ou escolher alternativas longas que parecem priorizar o conforto do motorista com base nas condições do asfalto.",
    tip: "Regra geral no Brasil: circulação sempre pelo lado direito. O lado esquerdo é para ultrapassar ou quando sinalizado.",
    incidence: "altissima",
    trap: true,
    difficulty: 2,
  },
];

// Questões que realmente caíram na prova do DETRAN.
// São forçadas em todo simulado completo e usadas no espelho de divulgação do super admin.
export const REAL_EXAM_IDS = [
  "qp01",
  "qp07",
  "qp06",
  "q29",
  "qp02",
  "qp03",
  "qp04",
  "qp57",
  "qp58",
  "qp59",
  "qp60",
  "qp61",
  "qp62",
  "qp63",
  "sinistro-sinalizacao-001",
  "qp64",
];

export function getRandomizedQuestions(
  count: number,
  opts?: {
    categories?: Category[];
    seed?: number;
    exclude?: string[];
    placasCount?: number;
    questionsList?: Question[];
  },
): Question[] {
  let pool = opts?.questionsList || [...QUESTIONS];

  if (opts?.categories?.length) {
    pool = pool.filter((q) => opts.categories!.includes(q.category));
  }

  if (opts?.exclude?.length) {
    const ex = new Set(opts.exclude);
    const filtered = pool.filter((q) => !ex.has(q.id));
    // se filtrou demais e não dá pra completar, libera os já vistos para evitar set vazio
    if (filtered.length >= count) pool = filtered;
    else if (filtered.length > 0) pool = filtered.concat(pool.filter((q) => ex.has(q.id)));
  }

  // Modo simulado: 3 placas + (count-3) demais categorias
  if (opts?.placasCount && opts.placasCount > 0 && !opts.categories?.length) {
    const placasPool = pool.filter((q) => q.category === "placas");
    const restPool = pool.filter((q) => q.category !== "placas");
    const pickWeighted = (arr: Question[], n: number) =>
      arr
        .map((q) => ({
          q,
          s:
            Math.random() *
            INCIDENCE_META[q.incidence].weight *
            (q.trap ? 2.5 : 1) *
            (1 + (q.difficulty - 1) * 0.3),
        }))
        .sort((a, b) => b.s - a.s)
        .slice(0, n)
        .map((x) => x.q);
    const placas = pickWeighted(placasPool, Math.min(opts.placasCount, placasPool.length));
    const rest = pickWeighted(restPool, Math.max(0, count - placas.length));
    const merged = [...placas, ...rest];
    // embaralha posição final
    for (let i = merged.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [merged[i], merged[j]] = [merged[j], merged[i]];
    }
    return merged.map(shuffleOptions);
  }

  const weighted = pool
    .map((q) => ({
      q,
      score:
        Math.random() *
        INCIDENCE_META[q.incidence].weight *
        (q.trap ? 2.5 : 1) *
        (1 + (q.difficulty - 1) * 0.3),
    }))
    .sort((a, b) => b.score - a.score)
    .map((x) => x.q);

  const picked = weighted.slice(0, Math.min(count, weighted.length));

  return picked.map(shuffleOptions);
}

function shuffleOptions(q: Question): Question {
  const indices = q.options.map((_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  const newOptions = indices.map((i) => q.options[i]);
  const newCorrect = indices.indexOf(q.correctIndex);
  return { ...q, options: newOptions, correctIndex: newCorrect };
}
