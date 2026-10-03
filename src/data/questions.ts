import type { PlacaId } from "@/components/Placa";
import { supabase } from "@/integrations/supabase/client";
export type Incidence = "altissima" | "alta" | "media" | "baixa";
export type Category = "legislacao" | "placas" | "direcao-defensiva" | "primeiros-socorros" | "infracoes" | "meio-ambiente" | "mecanica" | "prioridade";
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
    group?: string; // chave do tema: variações da MESMA pergunta em níveis diferentes compartilham o group; o simulador nunca sorteia duas do mesmo group juntas
    placa?: PlacaId; // placa visual oficial para questões de identificação
    image_url?: string; // URL da imagem da placa (para renderização via img tag)
    origin?: "ia" | "real"; // origem do conteúdo (admin exibe/filtra; detran_* equivale a prova real)
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
export const INCIDENCE_META: Record<Incidence, {
    label: string;
    emoji: string;
    className: string;
    weight: number;
}> = {
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
        statement: "Condutor com categoria B pretende conduzir furgão com familiares em viagem intermunicipal. Pelo CTB, essa categoria autoriza conduzir:",
        options: ["Veículo com PBT até 3.500 kg e lotação de 8 passageiros, excluído o condutor.", "Veículo com PBT até 3.500 kg e lotação de 8 lugares, incluído o condutor.", "Veículo com PBT até 4.200 kg e lotação de 8 passageiros, excluído o condutor.", "Veículo com PBT até 3.500 kg e lotação de 9 passageiros, excluído o condutor."],
        correctIndex: 0,
        explanation: "Correta letra A: categoria B admite PBT até 3.500 kg e lotação de até 8 passageiros, excluído o condutor (total 8+1), conforme art. 143, II do CTB.",
        detailedExplanation: "Com a categoria B, você pode dirigir veículos automotores cujo PBT não exceda 3.500 kg e cuja lotação não exceda 8 lugares, sem contar o condutor.",
        legalBase: "Art. 143, II do CTB",
        commonMistake: "Cuidado: não confunda 8 passageiros no total com 8 passageiros mais o motorista — são 8 + 1!",
        tip: "B = Até 3.500 kg e 8 + 1.",
        incidence: "altissima",
        difficulty: 3
    },
    {
        id: "q2",
        category: "placas",
        statement: "Durante fiscalização, agente observa placa circular com orla vermelha, fundo branco e símbolo preto. Segundo o CTB, essa placa tem a função de:",
        options: ["Advertir sobre perigos adiante na via, como curvas, cruzamentos e estreitamentos.", "Impor obrigações, limitações ou proibições ao uso da via para todos os usuários.", "Indicar direções, distâncias, serviços auxiliares e pontos de interesse ao usuário.", "Orientar fluxos turísticos, áreas de preservação e rotas panorâmicas especiais."],
        correctIndex: 1,
        explanation: "Correta letra B: placas de regulamentação impõem obrigações, limitações e proibições, conforme Anexo II do CTB.",
        detailedExplanation: "Essas placas (série R) têm formato circular (com exceção das placas R-1 'Pare' e R-2 'Dê a Preferência') e são usadas para estabelecer ordens, proibições e restrições obrigatórias.",
        commonMistake: "Muita gente confunde com as placas de advertência (losango amarelo).",
        tip: "Vermelho = você é OBRIGADO a obedecer.",
        incidence: "altissima",
        difficulty: 3
    },
    {
        id: "q3",
        category: "direcao-defensiva",
        statement: "Em via urbana movimentada, pedestre inicia travessia fora da faixa marcada. Diante dessa situação prática, o condutor deverá:",
        options: ["Manter a velocidade e buzinar de forma insistente para alertar o pedestre.", "Acelerar para concluir a passagem antes da entrada do pedestre na pista.", "Reduzir a velocidade e ceder a passagem para a travessia do pedestre.", "Mudar de faixa sem sinalizar para desviar rapidamente do pedestre."],
        correctIndex: 2,
        explanation: "Correta letra C: o condutor deverá dar prioridade ao pedestre, garantindo sua segurança, conforme art. 29, §2º do CTB.",
        detailedExplanation: "O CTB estabelece que os veículos de maior porte serão sempre responsáveis pela segurança dos menores, os motorizados pelos não motorizados e, juntos, pela proteção dos pedestres.",
        legalBase: "Art. 29, §2º do CTB",
        commonMistake: "Achar que por estar fora da faixa o pedestre pode ser atropelado ou assustado com buzinadas.",
        incidence: "alta",
        trap: true,
        difficulty: 3
    },
    {
        id: "qe01",
        category: "legislacao",
        statement: "Candidato aprovado nos exames iniciais deseja abrir o cadastro nacional de condutores. Segundo as normas do CONTRAN, esse cadastro deverá ser feito:",
        options: ["No DETRAN do estado ou do Distrito Federal onde o candidato possui residência.", "No CONTRAN, órgão máximo normativo do Sistema Nacional de Trânsito.", "No Centro de Formação de Condutores, com competência exclusiva para abertura.", "Na Secretaria Nacional de Trânsito, mediante requerimento direto em Brasília."],
        correctIndex: 0,
        explanation: "Correta letra A: o RENACH é aberto no órgão executivo de trânsito do Estado ou DF (DETRAN) do domicílio do candidato.",
        detailedExplanation: "O Registro Nacional de Carteiras de Habilitação (RENACH) é um banco de dados que registra toda a vida do condutor, devendo ser iniciado no DETRAN de sua residência ou domicílio.",
        legalBase: "Res. CONTRAN 789/2020",
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "qe02",
        category: "legislacao",
        statement: "Candidato aprovado recebe a permissão provisória para conduzir. Conforme o CTB, qual o período probatório de vigência desse documento:",
        options: ["12 meses, contados da data de expedição da permissão para conduzir.", "6 meses, prorrogáveis se não houver registro de infração leve.", "2 anos, equiparado ao prazo das avaliações de aptidão psicológica.", "5 anos, correspondente à carência fixada para exames de aptidão física."],
        correctIndex: 0,
        explanation: "Correta letra A: a Permissão para Dirigir (PPD) vigora por 12 meses (1 ano), conforme art. 148, §3º do CTB.",
        detailedExplanation: "A PPD é concedida ao candidato aprovado em todos os exames e tem validade de um ano.",
        legalBase: "Art. 148, §3º do CTB",
        incidence: "altissima",
        difficulty: 3
    },
    {
        id: "qe03",
        category: "legislacao",
        statement: "Condutor sem nenhuma infração gravíssima nos últimos 12 meses atinge pontuação elevada. Nesse caso, a suspensão do direito de dirigir ocorrerá aos:",
        options: ["40 pontos acumulados no período de 12 meses de apuração.", "30 pontos, desde que conste uma única infração de natureza grave.", "20 pontos, independentemente da natureza das infrações registradas.", "14 pontos, aplicados aos condutores com anotação de atividade remunerada."],
        correctIndex: 0,
        explanation: "Correta letra A: sem NENHUMA infração gravíssima, o limite para suspensão é de 40 pontos em 12 meses (Art. 261, I, 'a' do CTB).",
        detailedExplanation: "A regra de pontuação atual é: 20 pontos (se tiver 2 ou mais gravíssimas), 30 pontos (se tiver 1 gravíssima) e 40 pontos (se não tiver nenhuma gravíssima).",
        legalBase: "Art. 261 do CTB",
        commonMistake: "Achar que o limite de 20 pontos ainda vale para todos os casos.",
        incidence: "altissima",
        trap: true,
        difficulty: 3
    },
    {
        id: "qe04",
        category: "legislacao",
        statement: "Motorista profissional que exerce atividade remunerada (EAR) soma pontos na CNH. Pelo CTB vigente, o limite para suspensão do direito de dirigir por pontuação para esse condutor será de:",
        options: ["40 pontos em 12 meses, independentemente da gravidade das infrações cometidas.", "20 pontos em 12 meses, com redução imediata se houver infração média.", "30 pontos em 12 meses, caso conste infração grave ou gravíssima.", "25 pontos em 12 meses, mediante reciclagem obrigatória aos 20 pontos."],
        correctIndex: 0,
        explanation: "Correta letra A: para condutores EAR, o limite é fixo em 40 pontos, independentemente das infrações cometidas (Art. 261, §5º do CTB).",
        detailedExplanation: "O motorista que possui EAR (Exercício de Atividade Remunerada) tem o benefício do limite fixo de 40 pontos em 12 meses, sem redução do limite por cometimento de infração gravíssima, além de poder fazer o Curso Preventivo de Reciclagem ao atingir 30 pontos.",
        legalBase: "Art. 261, §5º do CTB",
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "qe05",
        category: "legislacao",
        statement: "Em blitz de trânsito, o agente solicita os documentos de porte obrigatório. Conforme o CTB, o condutor deverá apresentar:",
        options: ["Carteira Nacional de Habilitação (CNH/PPD) e Certificado de Registro e Licenciamento do Veículo (CRLV).", "Certificado de Registro do Veículo (CRV) e comprovante de pagamento do IPVA.", "Cédula de identidade civil e carteira de vacinação atualizada do condutor.", "Comprovante de aprovação nos exames de aptidão física e mental do DETRAN."],
        correctIndex: 0,
        explanation: "Correta letra A: CNH/PPD e CRLV são os documentos de porte obrigatório (aceitos em formato físico ou digital via aplicativo oficial).",
        detailedExplanation: "O porte da CNH e do CRLV é obrigatório, sendo dispensado apenas se o agente fiscalizador puder consultar o sistema para verificar a regularidade dos documentos no momento da abordagem.",
        legalBase: "Art. 159 e Art. 133 do CTB",
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "qe06",
        category: "legislacao",
        statement: "Candidato deseja pilotar motocicleta e triciclo em vias públicas. Segundo o CTB, a habilitação na categoria A autoriza conduzir:",
        options: ["Veículos de duas ou três rodas, com ou sem carro lateral acoplado.", "Veículos de transporte coletivo com lotação de até 8 passageiros.", "Qualquer veículo automotor com PBT de até 3.500 kg.", "Veículos de duas rodas com cilindrada limitada a 50 cilindradas."],
        correctIndex: 0,
        explanation: "Correta letra A: Categoria A abrange veículos automotores de duas ou três rodas, com ou sem sidecar (Art. 143, I do CTB).",
        detailedExplanation: "A Categoria A engloba motocicletas, motonetas, triciclos e ciclomotores.",
        legalBase: "Art. 143, I do CTB",
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "qe07",
        category: "legislacao",
        statement: "Agente flagra pessoa conduzindo automóvel sem possuir CNH ou Permissão para Dirigir. Conforme o CTB, essa conduta configura infração de natureza:",
        options: ["Gravíssima, com multa multiplicada por três e retenção do veículo.", "Grave, com apreensão do veículo e encaminhamento imediato a leilão.", "Média, com advertência escrita se o veículo estiver devidamente licenciado.", "Gravíssima, com pena de detenção de seis meses a um ano de prisão."],
        correctIndex: 0,
        explanation: "Correta letra A: Dirigir sem possuir CNH ou PPD é infração gravíssima, com multa (3x) e retenção do veículo (Art. 162, I do CTB).",
        detailedExplanation: "Dirigir sem habilitação é infração gravíssima. A retenção do veículo ocorre até a apresentação de um condutor devidamente habilitado.",
        legalBase: "Art. 162, I do CTB",
        incidence: "altissima",
        difficulty: 3
    },
    {
        id: "qe08",
        category: "legislacao",
        statement: "Condutor teve a CNH suspensa após processo administrativo regular. Conforme o CTB, o curso de reciclagem será obrigatório nessa situação de:",
        options: ["Suspensão do direito de dirigir ou envolvimento em sinistro grave para o qual haja contribuído.", "Registro de infração média ou leve ainda na vigência da permissão provisória.", "Estacionamento em vaga de idoso sem uso da credencial obrigatória.", "Ultrapassagem em local proibido devidamente sinalizado na via."],
        correctIndex: 0,
        explanation: "Correta letra A: o curso de reciclagem é obrigatório em casos de suspensão do direito de dirigir, sinistro grave ou condenação judicial por crime de trânsito (Art. 268 do CTB).",
        detailedExplanation: "O curso de reciclagem visa reeducar o condutor que teve o direito de dirigir suspenso para que possa recuperar sua CNH.",
        legalBase: "Art. 268 do CTB",
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "qe09",
        category: "legislacao",
        statement: "Condutor habilitado na categoria B há um ano deseja mudar para a categoria C. Para realizar essa mudança, conforme o CTB atualizado, ele não poderá ter cometido nos últimos 12 meses:",
        options: ["Mais de uma infração de natureza gravíssima.", "Nenhuma infração grave, devendo estar limpo de qualquer pontuação.", "Qualquer infração de natureza média ou leve no período.", "Nenhuma infração leve com retenção de veículo."],
        correctIndex: 0,
        explanation: "Correta letra A: para a mudança de categoria, o condutor não pode ter cometido mais de uma infração gravíssima nos últimos 12 meses (Art. 145, III do CTB).",
        detailedExplanation: "A Lei 14.071/2020 flexibilizou as exigências de infrações para mudança de categoria. Agora permite-se ter cometido no máximo UMA infração gravíssima nos últimos 12 meses.",
        legalBase: "Art. 145, III do CTB",
        commonMistake: "Confundir com as regras antigas que proibiam infrações graves ou reincidência em médias.",
        tip: "Mudança de categoria = no máximo 1 gravíssima nos últimos 12 meses.",
        incidence: "media",
        difficulty: 3
    },
    {
        id: "qe10",
        category: "legislacao",
        statement: "Jovem procura o DETRAN para iniciar o processo de habilitação. Conforme o CTB, o requisito essencial referente à capacidade civil será ser:",
        options: ["Penalmente imputável (responder pelos atos perante a lei penal).", "Maior de 16 anos emancipado por casamento ou concessão dos pais.", "Eleitor regularmente alistado junto à Justiça Eleitoral.", "Maior de 18 anos, ainda que sem compreender os atos praticados."],
        correctIndex: 0,
        explanation: "Correta letra A: o candidato deve ser penalmente imputável, saber ler e escrever e possuir RG e CPF (Art. 140 do CTB).",
        detailedExplanation: "Ser penalmente imputável significa responder criminalmente por seus atos, o que no Brasil ocorre aos 18 anos completos. A emancipação civil não supre esse requisito.",
        legalBase: "Art. 140, I do CTB",
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "qe11",
        category: "legislacao",
        statement: "Condutor cumpre um ano de permissão provisória e solicita a CNH definitiva. Para obter o documento definitivo, ele não poderá ter cometido:",
        options: ["Infração grave ou gravíssima, nem ser reincidente em infração média.", "Nenhuma infração de qualquer natureza durante todo o período.", "Infração leve com atribuição de pontuação no prontuário.", "Mais de duas infrações leves isoladas dentro do período."],
        correctIndex: 0,
        explanation: "Correta letra A: para concessão da CNH definitiva ao término de 12 meses de PPD, veda-se infração grave, gravíssima ou reincidência em média (Art. 148, §3º e §4º do CTB).",
        detailedExplanation: "Se cometer 1 grave, 1 gravíssima ou 2 médias durante os 12 meses da Permissão, o candidato não obtém a CNH definitiva e deve reiniciar o processo do zero.",
        legalBase: "Art. 148, §3º e §4º do CTB",
        incidence: "altissima",
        trap: true,
        difficulty: 3
    },
    {
        id: "qe12",
        category: "legislacao",
        statement: "Motorista de caminhão precisa obter a primeira habilitação profissional. Conforme o CTB, o exame toxicológico será obrigatório nas categorias:",
        options: ["C, D e E, tanto na obtenção quanto na renovação da habilitação.", "B, C e D, somente para condutores com atividade remunerada.", "A, B e C, com validade do exame superior a 5 anos.", "Apenas E, restrita a veículos com carga inflamável ou explosiva."],
        correctIndex: 0,
        explanation: "Correta letra A: o exame toxicológico é obrigatório para condutores das categorias C, D e E (Art. 148-A do CTB).",
        detailedExplanation: "O exame toxicológico é exigido na obtenção, adição e renovação das categorias C, D e E, devendo ser feito periodicamente a cada 2 anos e meio.",
        legalBase: "Art. 148-A do CTB",
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "qe13",
        category: "infracoes",
        statement: "Em shopping, condutor estaciona em vaga reservada a idoso sem usar credencial. Conforme o CTB, essa conduta configura infração de natureza:",
        options: ["Gravíssima, com multa, 7 pontos e remoção do veículo.", "Grave, com multa e remoção do veículo do local.", "Média, com recolhimento da CNH pelo prazo de 30 dias.", "Leve, punida apenas com advertência por escrito."],
        correctIndex: 0,
        explanation: "Correta letra A: estacionar em vaga reservada a PCD ou idoso sem credencial é infração gravíssima com remoção (Art. 181, XX do CTB).",
        detailedExplanation: "Com as alterações da Lei 13.281/2016, estacionar indevidamente em vagas de idoso ou PCD passou a ser infração gravíssima com penalidade de multa e medida administrativa de remoção do veículo.",
        legalBase: "Art. 181, XX do CTB",
        incidence: "media",
        difficulty: 3
    },
    {
        id: "qe14",
        category: "infracoes",
        statement: "Em supermercado, condutor ocupa vaga de pessoa com deficiência sem credencial. Mesmo em área privada de uso coletivo, essa conduta configura:",
        options: ["Infração gravíssima, com multa e remoção do veículo.", "Conduta fora da fiscalização, por tratar-se de propriedade privada.", "Infração grave, com remoção apenas se houver reclamação do gerente.", "Infração média, com multa e apreensão definitiva do veículo."],
        correctIndex: 0,
        explanation: "Correta letra A: o CTB aplica-se também às vias e estacionamentos privados de uso coletivo (Art. 2º, parágrafo único do CTB c/c Art. 181, XX).",
        detailedExplanation: "As regras do CTB se aplicam a estacionamentos privados de uso coletivo (como shoppings e supermercados). A infração é gravíssima com remoção do veículo.",
        legalBase: "Art. 2º e Art. 181, XX do CTB",
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "qe15",
        category: "infracoes",
        statement: "Em fiscalização, agente constata passageiro do banco traseiro sem cinto de segurança. Conforme o CTB, essa situação configura:",
        options: ["Infração grave do condutor, com multa e retenção do veículo para colocação do cinto.", "Infração média do passageiro, como único responsável pela conduta.", "Infração leve do proprietário, punida com advertência verbal.", "Infração gravíssima, com retenção definitiva do veículo no pátio."],
        correctIndex: 0,
        explanation: "Correta letra A: deixar de usar o cinto de segurança (condutor ou passageiro) é infração grave dirigida ao condutor (Art. 167 do CTB).",
        detailedExplanation: "A responsabilidade pela segurança de todos os ocupantes é do condutor. A não utilização do cinto gera infração grave (5 pontos) e retenção do veículo até o cinto ser afivelado.",
        legalBase: "Art. 167 do CTB",
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "qe16",
        category: "infracoes",
        statement: "No semáforo, condutor é flagrado segurando ou manuseando o celular. Conforme o CTB, essa conduta configura infração:",
        options: ["Gravíssima, com multa e 7 pontos no prontuário.", "Grave, com multa e suspensão preventiva imediata.", "Média, punida apenas com advertência escrita.", "Leve, com multa somente se houver excesso de velocidade."],
        correctIndex: 0,
        explanation: "Correta letra A: segurar ou manusear telefone celular enquanto conduz veículo é infração gravíssima (Art. 252, parágrafo único do CTB).",
        detailedExplanation: "Segurar ou manusear celular (mesmo parado no semáforo ou no trânsito lento) é infração gravíssima com multa de R$ 293,47 e 7 pontos.",
        legalBase: "Art. 252, parágrafo único do CTB",
        incidence: "altissima",
        difficulty: 3
    },
    {
        id: "qe17",
        category: "infracoes",
        statement: "Dois condutores disputam corrida não autorizada em via pública (racha). Conforme o CTB, essa conduta implicará em:",
        options: ["Multa multiplicada por dez, suspensão do direito de dirigir e remoção do veículo.", "Multa multiplicada por cinco, retenção e curso de primeiros socorros.", "Advertência escrita e apreensão do veículo pelo prazo de 24 horas.", "Multa multiplicada por vinte e cassação definitiva sem direito a defesa."],
        correctIndex: 0,
        explanation: "Correta letra A: disputar corrida é infração gravíssima com multa (10x), suspensão do direito de dirigir e remoção do veículo (Art. 173 do CTB).",
        detailedExplanation: "Além de ser infração administrativa gravíssima com fator multiplicador 10x, disputar 'racha' configura crime de trânsito capitulado no Art. 308 do CTB.",
        legalBase: "Art. 173 e Art. 308 do CTB",
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "qe18",
        category: "infracoes",
        statement: "Em via urbana limitada a 40 km/h, radar registra condutor a 55 km/h. Conforme o CTB, esse excesso de velocidade configura infração:",
        options: ["Média, por excesso de velocidade de até 20 por cento do limite.", "Grave, por excesso de velocidade superior a 20 por cento até 50 por cento do limite.", "Gravíssima, com multa triplicada e suspensão do direito de dirigir.", "Leve, punida apenas com advertência escrita do órgão autuador."],
        correctIndex: 1,
        explanation: "Correta letra B: 55 km/h em via de 40 km/h representa um excesso de 37,5% (superior a 20% e até 50%), configurando infração grave (Art. 218, II do CTB).",
        detailedExplanation: "Até 20% acima do limite = Média; De 20% a 50% acima = Grave; Acima de 50% = Gravíssima (com suspensão direta).",
        legalBase: "Art. 218, II do CTB",
        incidence: "altissima",
        difficulty: 3
    },
    {
        id: "qe19",
        category: "infracoes",
        statement: "Em rodovia limitada a 110 km/h, condutor trafega a 170 km/h. Conforme o CTB, esse excesso de velocidade configura infração:",
        options: ["Gravíssima, com multa multiplicada por três e suspensão do direito de dirigir.", "Grave, com multa simples e retenção do veículo no local.", "Média, com multa simples e pontuação no prontuário.", "Crime de trânsito inafiançável, com pena direta de detenção."],
        correctIndex: 0,
        explanation: "Correta letra A: transitar em velocidade superior à máxima em mais de 50% é infração gravíssima com multa (3x) e suspensão do direito de dirigir (Art. 218, III do CTB).",
        detailedExplanation: "170 km/h em via de 110 km/h excede 50% do limite (110 + 55 = 165 km/h). Trata-se de infração gravíssima mandatória de suspensão.",
        legalBase: "Art. 218, III do CTB",
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "qe20",
        category: "infracoes",
        statement: "Condutor avança sem parar com pedestre aguardando sobre a faixa sinalizada. Conforme o CTB, não dar passagem ao pedestre na faixa configura infração:",
        options: ["Gravíssima, com multa e 7 pontos no prontuário.", "Grave, com advertência se o pedestre sair ileso.", "Média, com multa e suspensão preventiva do direito de dirigir.", "Leve, aplicável apenas se houver colisão com a vítima."],
        correctIndex: 0,
        explanation: "Correta letra A: deixar de dar passagem ao pedestre que esteja na faixa a ele destinada é infração gravíssima (Art. 214, I do CTB).",
        detailedExplanation: "O pedestre tem prioridade na faixa de travessia. Deixar de dar passagem nessa condição é infração gravíssima de 7 pontos.",
        legalBase: "Art. 214, I do CTB",
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "qe21",
        category: "infracoes",
        statement: "Condutor transporta criança de 9 anos com 1,35 m de altura no carro. Conforme o CTB e normas do CONTRAN, essa criança deverá ser transportada:",
        options: ["No banco traseiro, utilizando o assento de elevação com cinto de segurança de três pontos.", "No banco dianteiro, com cinto regulado na altura do ombro.", "No banco traseiro, sem necessidade de dispositivo de retenção além do cinto subabdominal.", "Em qualquer assento, com supervisão de adulto e cinto subabdominal."],
        correctIndex: 0,
        explanation: "Correta letra A: crianças menores de 10 anos que não tenham atingido 1,45 m de altura devem viajar no banco traseiro e utilizar o assento de elevação adequado (Art. 64 do CTB e Res. CONTRAN 819/2021).",
        detailedExplanation: "A regra de ouro do CONTRAN é: até 10 anos E até 1,45 m de altura, deve ir no banco traseiro. Aos 9 anos e 1,35 m de altura, o dispositivo correto é o assento de elevação (booster).",
        legalBase: "Art. 64 do CTB e Res. CONTRAN 819/2021",
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "qe22",
        category: "infracoes",
        statement: "Em avenida, condutor ultrapassa pela direita sem que o veículo à frente sinalize conversão. Conforme o CTB, essa manobra configura:",
        options: ["Infração média, salvo se o veículo da frente estiver dobrando ou sinalizando conversão à esquerda.", "Infração grave, sem excludente mesmo em fluxo intenso de veículos.", "Manobra permitida em vias arteriais com limite acima de 60 km por hora.", "Crime de trânsito de perigo abstrato, com detenção do condutor."],
        correctIndex: 0,
        explanation: "Correta letra A: ultrapassar pela direita é infração média, exceto quando o veículo da frente estiver dobrando à esquerda (Art. 199 do CTB).",
        detailedExplanation: "A regra geral exige ultrapassagem pela esquerda. A única exceção permitida pela direita é quando o veículo à frente estiver sinalizando que vai dobrar à esquerda.",
        legalBase: "Art. 199 do CTB",
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "qe23",
        category: "infracoes",
        statement: "Em aclive com faixa amarela contínua, condutor ultrapassa pela contramão. Conforme o CTB, essa ultrapassagem proibida configura infração:",
        options: ["Gravíssima, com multa multiplicada por cinco vezes.", "Grave, com multa simples e suspensão por 3 meses.", "Média, punida apenas com advertência verbal do agente.", "Crime doloso contra a segurança viária, com prisão imediata."],
        correctIndex: 0,
        explanation: "Correta letra A: ultrapassar pela contramão em linha dupla contínua é infração gravíssima com multa (5x) (Art. 203, V do CTB).",
        detailedExplanation: "Ultrapassar em marcas viárias de linha contínua é gravíssima e gera multa de R$ 1.467,35 (valor base gravíssima x 5).",
        legalBase: "Art. 203, V do CTB",
        incidence: "altissima",
        difficulty: 3
    },
    {
        id: "qe24",
        category: "infracoes",
        statement: "Em blitz da Lei Seca, condutor se recusa a realizar o teste do bafômetro. Conforme o CTB, essa recusa implicará em:",
        options: ["Infração gravíssima, multa multiplicada por dez (10x), suspensão por 12 meses e recolhimento do documento de habilitação.", "Lavratura de termo sem multa, se houver condutor substituto habilitado.", "Crime de trânsito imediato, com condução do motorista à delegacia.", "Infração grave, com multa simples e 5 pontos no prontuário."],
        correctIndex: 0,
        explanation: "Correta letra A: a recusa ao teste do bafômetro é infração gravíssima com multa (10x), suspensão do direito de dirigir por 12 meses e recolhimento da CNH (Art. 165-A do CTB).",
        detailedExplanation: "O Art. 165-A aplica as mesmas sanções administrativas da embriaguez ao condutor que se recusa a realizar o teste de alcoolemia.",
        legalBase: "Art. 165-A do CTB",
        incidence: "altissima",
        trap: true,
        difficulty: 3
    },
    {
        id: "qe25",
        category: "infracoes",
        statement: "Em abordagem, agente constata CNH vencida há mais de 30 dias. Conforme o CTB, conduzir nessa condição configura infração de natureza:",
        options: ["Gravíssima, com multa e retenção do veículo até a apresentação de condutor habilitado.", "Grave, com tolerância de 90 dias se houver agendamento de renovação.", "Média, com multa e pontuação, sem retenção do veículo.", "Atípica, punida apenas com notificação pedagógica."],
        correctIndex: 0,
        explanation: "Correta letra A: conduzir com CNH vencida há mais de 30 dias é infração gravíssima com retenção do veículo (Art. 162, V do CTB).",
        detailedExplanation: "A legislação permite dirigir por até 30 dias após o vencimento da CNH sem penalidades. Após esse prazo, torna-se infração gravíssima com retenção do veículo.",
        legalBase: "Art. 162, V do CTB",
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "qe26",
        category: "infracoes",
        statement: "À noite ou em local não permitido, condutor buzina de forma prolongada e sucessiva. Conforme o CTB, esse uso indevido da buzina configura infração:",
        options: ["Leve, com multa e 3 pontos no prontuário.", "Média, como poluição sonora com retenção do veículo.", "Permitida, se a velocidade estiver abaixo de 20 km/h.", "Grave, com recolhimento imediato do veículo ao pátio."],
        correctIndex: 0,
        explanation: "Correta letra A: buzinar de forma prolongada, sem motivo de perigo iminente ou entre 22h e 06h é infração leve (Art. 227 do CTB).",
        detailedExplanation: "A buzina deve ser usada apenas em toques breves para advertências necessárias. O uso prolongado, sucessivo ou noturno (22h às 06h) é infração leve (3 pontos).",
        legalBase: "Art. 227 do CTB",
        incidence: "media",
        difficulty: 3
    },
    {
        id: "qe27",
        category: "direcao-defensiva",
        statement: "Instrutor explica prevenção de acidentes em condições adversas. Conforme a doutrina de trânsito, o objetivo primordial da direção defensiva é:",
        options: ["Evitar acidentes, apesar das ações incorretas de terceiros e das condições adversas da via.", "Garantir a velocidade máxima permitida para agilizar o fluxo da via.", "Aplicar técnicas de frenagem brusca para reduzir o tempo de viagem.", "Transferir aos pedestres a responsabilidade pela segurança na via."],
        correctIndex: 0,
        explanation: "Correta letra A: Direção defensiva é dirigir de modo a evitar acidentes, apesar das ações erradas dos outros e das condições adversas.",
        detailedExplanation: "A direção defensiva foca na prevenção, antecipando perigos e adotando postura preventiva no trânsito.",
        legalBase: "Manual de Direção Defensiva - DENATRAN/SENATRAN",
        incidence: "altissima",
        difficulty: 3
    },
    {
        id: "qe28",
        category: "direcao-defensiva",
        statement: "Condutor trafega ao entardecer com dificuldade de visão pelo clarão. Constitui exemplo típico de condição adversa ligada ao fator luz:",
        options: ["Ofuscamento pelo farol alto e penumbra na transição entre dia e noite.", "Aquaplanagem por acúmulo de lâmina de água sobre a pista.", "Desgaste excessivo das bandas de rodagem dos pneus.", "Fadiga física e estresse mental acumulado do condutor."],
        correctIndex: 0,
        explanation: "Correta letra A: ofuscamento e penumbra são condições adversas de luz que reduzem a visibilidade.",
        detailedExplanation: "Essas condições incluem coisas que atrapalham a visão, como sol baixo que ofusca, faróis altos de carros vindo na direção contrária, penumbra ao escurecer, neblina e chuva forte. Cada situação pede uma ação diferente, como olhar pra beirada da pista quando tá ofuscado ou usar faróis baixos quando necessário.",
        incidence: "alta",
        trap: true,
        difficulty: 3
    },
    {
        id: "qe29",
        category: "direcao-defensiva",
        statement: "Em pista dupla, condutor defensivo pretende ultrapassar caminhão lento. Para executar a manobra com segurança, ele deverá:",
        options: ["Verificar retrovisores e ponto cego, sinalizar, acelerar e retornar após ver o veículo no espelho.", "Sinalizar, conferir apenas o retrovisor interno e retornar sem observar o ponto cego.", "Aproximar-se do para-choque dianteiro e mudar de faixa sem sinalizar a manobra.", "Ultrapassar pelo acostamento, mantendo velocidade constante e sem sinalizar."],
        correctIndex: 0,
        explanation: "Correta letra A: ultrapassagem segura exige espelhos, ponto cego, seta e retorno com visibilidade.",
        detailedExplanation: "A manobra de ultrapassagem tem passos importantes: 1) sinalizar pra esquerda com a seta; 2) checar retrovisores e o ponto cego; 3) mudar pra faixa da esquerda; 4) acelerar e ultrapassar; 5) sinalizar pra direita; 6) voltar pra faixa original só quando o carro ultrapassado aparecer no retrovisor. Ignorar qualquer passo pode causar acidente.",
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "qe30",
        category: "direcao-defensiva",
        statement: "Sob chuva forte, condutor perde o controle direcional do carro. Esse fenômeno de aquaplanagem decorre da combinação entre:",
        options: ["Alta velocidade, película de água na pista e sulcos dos pneus abaixo de 1,6 mm.", "Redução da pressão do fluido de freio em temperaturas muito baixas.", "Excesso de peso concentrado apenas no porta-malas do veículo.", "Bloqueio das pinças de freio por detritos trazidos pela chuva."],
        correctIndex: 0,
        explanation: "Correta letra A: aquaplanagem resulta de velocidade, água na pista e pneus desgastados.",
        detailedExplanation: "Esse fenômeno rola quando a água se acumula entre o pneu e o asfalto, tirando o contato. Os principais vilões são a velocidade alta em poças, pneus muito gastos (menos de 1,6 mm) e calibragem errada. Isso faz você perder o controle do carro e não consegue frear direito.",
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "qe31",
        category: "direcao-defensiva",
        statement: "Sob chuva leve, a direção fica leve e o carro flutua sobre a água. Nessa aquaplanagem inicial, a conduta defensiva imediata será:",
        options: ["Segurar firme o volante, soltar o acelerador e evitar frear ou esterçar bruscamente.", "Pisar forte no freio para travar as rodas e buscar atrito imediato.", "Girar bruscamente o volante para expulsar a água sob os pneus.", "Reduzir marcha de forma brusca para forçar a aderência dos pneus."],
        correctIndex: 0,
        explanation: "Correta letra A: na aquaplanagem, mantenha a direção, desacelere e evite manobras bruscas.",
        detailedExplanation: "Se você perceber que está aquaplanando, não entre em pânico. Primeiro, tire o pé do acelerador. Depois, mantenha o volante firme e reto. Evite frear ou fazer manobras bruscas, pois isso pode causar perda total de controle. Se o carro tiver freios ABS, você pode frear levemente se os pneus voltarem a tocar o chão.",
        incidence: "altissima",
        difficulty: 3
    },
    {
        id: "qe32",
        category: "direcao-defensiva",
        statement: "Em viagem longa à noite, condutor sente sonolência e perda de atenção. Conforme as normas de segurança, a conduta correta nessa situação será:",
        options: ["Parar em local seguro para descansar e dormir o tempo necessário.", "Aumentar a velocidade para chegar mais rápido ao destino final.", "Ligar o ar no máximo e abrir as janelas para manter-se acordado.", "Ingerir cafeína e manter a condução contínua sem pausas."],
        correctIndex: 0,
        explanation: "Correta letra A: com fadiga, pare em local seguro e descanse antes de prosseguir.",
        detailedExplanation: "Dirigir cansado é muito arriscado, pois pode fazer você perder a atenção e ter reações lentas. Não adianta tomar café ou ouvir música alta, o que vale mesmo é dar uma pausa e dormir um pouco. Parar em um posto ou área de descanso é a jogada certa antes de continuar a viagem.",
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "qe33",
        category: "direcao-defensiva",
        statement: "Condutor ajusta os espelhos e percebe área lateral sem visibilidade. Essa área fora do alcance dos retrovisores denomina-se:",
        options: ["Ponto cego, exigindo olhar lateral direto antes de mudar de faixa.", "Ponto morto, corrigido apenas com ajuste elétrico do retrovisor interno.", "Zona de convergência posterior, coberta por sensores de ré.", "Ponto de fuga horizontal, visível somente em marcha a ré."],
        correctIndex: 0,
        explanation: "Correta letra A: ponto cego exige conferência visual direta antes da manobra lateral.",
        detailedExplanation: "O ponto cego fica nas laterais e atrás do carro, onde os espelhos não conseguem ver, mesmo ajustados. É importante sempre VIRAR A CABEÇA e olhar por cima do ombro antes de mudar de faixa ou fazer uma curva, pra garantir que não tem carro ali. Alguns carros novos têm sensores que ajudam, mas nunca substituem olhar de verdade.",
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "qe34",
        category: "direcao-defensiva",
        statement: "À noite, em rodovia simples sem iluminação pública, o condutor precisa ver adiante. Nessa condição, ele deverá utilizar:",
        options: ["Luz alta, trocando para baixa ao cruzar com outro veículo ou seguir à frente de outro.", "Luz de posição combinada com luzes de neblina em qualquer situação.", "Luz baixa fixa em qualquer hipótese, mesmo com pista livre.", "Farol alto permanente, mesmo ao cruzar com fluxos opostos."],
        correctIndex: 0,
        explanation: "Correta letra A: use luz alta em via escura e reduza ao cruzar ou seguir outro, conforme art. 40 do CTB.",
        detailedExplanation: "Em rodovias escuras, o farol ALTO ajuda a ver melhor. Mas, quando você vê outro carro vindo ou está colado em um, troque pro farol BAIXO pra não cegar o motorista do outro lado — isso evita acidentes sérios. O mesmo vale se você estiver atrás de outro carro: use farol baixo pra não atrapalhar a visão dele.",
        legalBase: "Art. 40 CTB",
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "qe35",
        category: "direcao-defensiva",
        statement: "Durante o dia, condutor se aproxima de túnel iluminado com fluxo intenso. Nessa travessia, o procedimento correto de iluminação será:",
        options: ["Manter acesos os faróis baixos, mesmo durante o dia.", "Acionar farol alto e faróis de milha para alertar pedestres.", "Manter apenas luzes de posição e ligar o pisca-alerta.", "Desligar toda iluminação para evitar reflexos internos."],
        correctIndex: 0,
        explanation: "Correta letra A: em túneis, mantenha farol baixo aceso mesmo de dia, conforme art. 40 do CTB.",
        detailedExplanation: "Nos túneis, o farol BAIXO tem que estar ligado sempre, até de dia. Isso ajuda os outros motoristas a te verem e ilumina a pista. O farol alto não é bom porque pode ofuscar a visão de todo mundo, e o pisca-alerta só é pra emergências.",
        legalBase: "Art. 40 CTB",
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "qe36",
        category: "direcao-defensiva",
        statement: "Em pista molhada, condutor nota maior espaço para imobilizar o carro. Quais fatores aumentam diretamente a distância de frenagem:",
        options: ["Velocidade elevada, pista molhada e pneus com banda de rodagem desgastada.", "Tempo de reação do condutor até tocar o pedal de freio.", "Rigidez do chassi e uso de fluido de freio sintético.", "Aclive acentuado da via em trecho de subida."],
        correctIndex: 0,
        explanation: "Correta letra A: velocidade, piso escorregadio e pneus gastos ampliam a frenagem.",
        detailedExplanation: "Quando você acelera, precisa de mais espaço pra parar. Se a pista tá molhada, os pneus escorregam mais e, se eles estão gastos, a aderência vai embora. Isso tudo faz o carro demorar mais pra parar.",
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "qe37",
        category: "primeiros-socorros",
        statement: "Socorrista chega a sinistro e organiza o atendimento inicial. Pela doutrina de primeiros socorros, a sequência PAS significa:",
        options: ["Proteger o local, Avisar o socorro profissional e Socorrer as vítimas.", "Prestar atendimento imediato, afastar curiosos e sinalizar após remoção.", "Parar na faixa de rolamento, ajudar na remoção e guardar pertences.", "Procurar testemunhas, avaliar lesões e sinalizar com galhos."],
        correctIndex: 0,
        explanation: "Correta letra A: PAS indica proteger, avisar e socorrer, nessa ordem de prioridade.",
        detailedExplanation: "Quando chega em um acidente, primeiro você deve PROTEGER o local com sinalização, avisar as autoridades pelo telefone e, se souber, SOCORRER as vítimas. Essa ordem é importante pra evitar mais problemas e garantir a segurança de todos.",
        incidence: "altissima",
        difficulty: 3
    },
    {
        id: "qe38",
        category: "primeiros-socorros",
        statement: "Em sinistro, vítima apresenta sangramento abundante na perna. Como procedimento inicial de primeiros socorros, o socorrista deverá:",
        options: ["Pressionar firme a lesão com pano limpo ou gaze.", "Aplicar torniquete rígido com arame acima da lesão.", "Jogar água oxigenada ou álcool sobre o ferimento.", "Manter a vítima em pé e forçá-la a caminhar."],
        correctIndex: 0,
        explanation: "Correta letra A: compressão direta com pano limpo contém hemorragia externa.",
        detailedExplanation: "Quando alguém sangra muito, a primeira coisa a fazer é apertar a ferida com um pano limpo ou gaze. Isso ajuda a diminuir o sangramento e a ferida a cicatrizar. Usar torniquete só é pra casos extremos, porque pode machucar ainda mais a pessoa.",
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "qe39",
        category: "primeiros-socorros",
        statement: "Após colisão, vítima caída refere dor intensa nas costas. Havendo suspeita de fratura de coluna, a conduta correta até o resgate será:",
        options: ["Manter a vítima imóvel e alinhada, sem movimentar cabeça ou coluna.", "Retirar a vítima do veículo e forçá-la a sentar ereta.", "Massagear a região cervical e as costas da vítima.", "Girar o pescoço da vítima para avaliar a mobilidade."],
        correctIndex: 0,
        explanation: "Correta letra A: com suspeita medular, evite mover a vítima até o socorro especializado.",
        detailedExplanation: "Nunca mova quem pode ter machucado a coluna. Qualquer movimento pode agravar a lesão e causar paralisia. A pessoa precisa ficar imóvel até o socorro chegar, que tem os equipamentos certos. Só mova se houver perigo imediato, como fogo ou água, e sempre com cuidado de três pessoas.",
        incidence: "altissima",
        trap: true,
        difficulty: 3
    },
    {
        id: "qe40",
        category: "primeiros-socorros",
        statement: "Pedestre presencia colisão com vítima e precisa chamar socorro médico. O número telefônico correto para acionar o SAMU será:",
        options: ["192, para acionar o Serviço de Atendimento Móvel de Urgência.", "193, para acionar a Polícia Rodoviária Federal.", "190, para acionar o Corpo de Bombeiros Militar do estado.", "191, para acionar a Defesa Civil do município."],
        correctIndex: 0,
        explanation: "Correta letra A: SAMU é 192; 193 bombeiros e 190 polícia militar.",
        detailedExplanation: "Saber os números de emergência é super importante pra agir rápido em acidentes. O SAMU (192) cuida das emergências médicas, enquanto o Corpo de Bombeiros (193) ajuda em incêndios e resgates. A Polícia Militar (190) entra em cena quando tem crime ou confusão.",
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "qe41",
        category: "primeiros-socorros",
        statement: "Em rodovia de 80 km por hora, condutor sinaliza sinistro em dia claro. Pela regra prática, o triângulo deverá ser posicionado a:",
        options: ["80 passos longos da traseira, dobrando a distância com chuva, neblina ou curva.", "30 metros exatos, independentemente das condições do tempo.", "10 metros do veículo, junto ao acostamento da rodovia.", "5 passos curtos, apenas com o pisca-alerta ativado."],
        correctIndex: 0,
        explanation: "Correta letra A: a distância do triângulo acompanha a velocidade da via e dobra sob risco.",
        detailedExplanation: "O triângulo de sinalização precisa ficar pelo menos 30 metros atrás do carro, na mesma faixa. Isso ajuda quem vem atrás a ver e desacelerar a tempo. Em rodovias rápidas, é melhor colocar ainda mais longe, entre 50 e 100 metros, para evitar acidentes.",
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "qe42",
        category: "primeiros-socorros",
        statement: "Vítima de sinistro apresenta queimadura com bolhas nos braços. Antes da chegada do SAMU, o procedimento adequado será:",
        options: ["Resfriar com água limpa corrente e cobrir com pano úmido e limpo.", "Aplicar pomada caseira ou manteiga sobre a ferida.", "Romper as bolhas para acelerar a drenagem do líquido.", "Enfaixar com força usando atadura seca e apertada."],
        correctIndex: 0,
        explanation: "Correta letra A: resfrie com água corrente e proteja sem romper bolhas.",
        detailedExplanation: "O ideal é deixar a água CORRENTE em temperatura ambiente na queimadura por uns 10 a 15 minutos, aliviando a dor e evitando mais danos. Evite usar qualquer coisa caseira, como pasta de dente ou manteiga, pois isso só piora a situação e pode causar infecção. E não estoure as bolhas, elas protegem a pele.",
        incidence: "media",
        difficulty: 3
    },
    {
        id: "qe43",
        category: "primeiros-socorros",
        statement: "Vítima consciente de sinistro mostra palidez, suor frio e pulso rápido. Diante desses sinais de choque, o procedimento inicial será:",
        options: ["Manter deitada, afrouxar roupas e elevar as pernas cerca de 30 cm.", "Forçar a sentar e oferecer água gelada ou café.", "Realizar massagem cardíaca contínua no peito.", "Cobrir com mantas pesadas e abafar a vítima."],
        correctIndex: 0,
        explanation: "Correta letra A: no choque, deite a vítima, libere roupas e eleve membros inferiores.",
        detailedExplanation: "O choque acontece quando o corpo não consegue mandar sangue e oxigênio pros órgãos, geralmente por causa de hemorragia ou desidratação. É importante manter a vítima deitada com as pernas levantadas uns 30 cm, cobrir pra não esfriar e não dar nada pra comer ou beber, porque ela pode precisar de cirurgia. Falar de forma calma ajuda a tranquilizar até a ajuda chegar.",
        incidence: "media",
        difficulty: 3
    },
    {
        id: "qe44",
        category: "meio-ambiente",
        statement: "Em centro urbano congestionado, escapamento libera gás sem cor e sem cheiro. Esse gás que prejudica a oxigenação do sangue será o:",
        options: ["Monóxido de carbono, liberado na combustão incompleta.", "Dióxido de carbono, usado em bebidas gaseificadas.", "Dióxido de enxofre, de odor forte e irritante.", "Clorofluorcarboneto, usado em refrigeração antiga."],
        correctIndex: 0,
        explanation: "Correta letra A: o monóxido de carbono liga-se à hemoglobina e impede a oxigenação.",
        detailedExplanation: "Os motores a combustão queimam combustível e soltam vários gases, incluindo o monóxido de carbono, que é bem perigoso e não tem cheiro. Manter o carro em dia ajuda a diminuir a poluição e faz bem pra saúde.",
        incidence: "media",
        difficulty: 3
    },
    {
        id: "qe45",
        category: "meio-ambiente",
        statement: "Condutor deseja economizar combustível e poluir menos no trajeto diário. Para reduzir consumo e emissões, ele deverá:",
        options: ["Manter aceleração constante, evitar freadas bruscas e trocar marchas na rotação ideal.", "Acelerar forte em ponto morto antes de desligar o motor.", "Usar marchas altas com velocidade muito baixa e motor forçado.", "Desligar o motor em descidas longas para rodar desengatado."],
        correctIndex: 0,
        explanation: "Correta letra A: condução suave com marchas corretas reduz consumo e emissões.",
        detailedExplanation: "Quando você troca marcha na hora certa e evita acelerar ou frear de uma vez, o carro usa menos combustível. Isso significa que você também solta menos poluição no ar. Além de fazer bem pro planeta, isso ainda economiza grana com gasolina e manutenção.",
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "qe46",
        category: "meio-ambiente",
        statement: "Em rodovia duplicada, passageiro lança lata pela janela com o carro em movimento. Conforme o CTB, essa conduta do condutor configura infração:",
        options: ["Média, com multa administrativa de responsabilidade do condutor.", "Leve, de responsabilidade exclusiva do passageiro que lançou o objeto.", "Grave, com suspensão imediata do licenciamento anual do veículo.", "Gravíssima, com cassação direta da habilitação do condutor."],
        correctIndex: 0,
        explanation: "Correta letra A: lançar objetos pela janela é infração média, conforme art. 172 do CTB.",
        detailedExplanation: "Quando você joga algo pela janela, pode levar multa e 4 pontos na CNH. Além disso, isso é crime ambiental e pode causar acidentes, como um motociclista perdendo o controle por causa de um objeto na pista.",
        legalBase: "Art. 172 CTB",
        incidence: "media",
        difficulty: 3
    },
    {
        id: "qe47",
        category: "meio-ambiente",
        statement: "Em bairro residencial, alarme e buzina disparam repetidamente à noite. Esse uso abusivo afeta o sossego e configura infração de trânsito ligada a:",
        options: ["Poluição sonora, gerando estresse e perturbação do sossego público.", "Crime ambiental com detenção em regime fechado do condutor.", "Mera conduta de convivência, sem multa ou pontos na CNH.", "Infração média, punida só com apreensão do sistema de som."],
        correctIndex: 0,
        explanation: "Correta letra A: buzina e alarme em excesso caracterizam poluição sonora.",
        detailedExplanation: "Quando a buzina toca demais, isso gera POLUIÇÃO SONORA, que é um problema reconhecido pela lei. Esse barulho pode deixar a gente estressado, irritado e até causar problemas de saúde, por isso o CTB diz que só podemos usar a buzina em situações de perigo e proíbe o uso em lugares como hospitais e escolas, principalmente à noite.",
        incidence: "media",
        difficulty: 3
    },
    {
        id: "qe48",
        category: "meio-ambiente",
        statement: "Em via urbana com ciclistas e pedestres, motorista disputa espaço e buzina. Como condutor cidadão, a postura correta nesse contexto será:",
        options: ["Priorizar pedestres e veículos sem motor, com cortesia e tolerância ante erros alheios.", "Exigir preferência sobre veículos menores devido ao maior porte do carro.", "Ignorar ciclistas na borda da pista se não houver ciclovia segregada.", "Buzinar sem parar para apressar idosos sobre a faixa de pedestres."],
        correctIndex: 0,
        explanation: "Correta letra A: cidadania exige proteger os mais vulneráveis com respeito e tolerância.",
        detailedExplanation: "Cidadania no trânsito é sobre todos se respeitarem, seja motorista, ciclista ou pedestre. Cada um tem que cuidar do outro, evitando pressa e buzinas desnecessárias. Um trânsito tranquilo depende de cada um fazer sua parte e proteger a todos.",
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "qe49",
        category: "mecanica",
        statement: "Após viagem longa, a luz do óleo acende e a vareta marca abaixo do mínimo. Insistir em rodar nessa condição provocará no motor:",
        options: ["Atrito excessivo com superaquecimento, podendo fundir peças e travar o bloco.", "Aumento do consumo sem risco de dano ao bloco ou ao cabeçote.", "Menor desgaste de velas e bobinas de alta tensão.", "Travamento das pastilhas traseiras por falta de pressão hidráulica."],
        correctIndex: 0,
        explanation: "Correta letra A: sem óleo, o atrito superaquece e pode fundir o motor.",
        detailedExplanation: "O óleo é o que mantém as partes do motor funcionando direitinho, evitando que elas se desgastem e esquentem demais. Se o nível de óleo estiver baixo, o motor não se lubrifica bem, o que pode causar superaquecimento e até fundir o motor. É fácil evitar isso: só checar o nível de óleo de vez em quando!",
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "qe50",
        category: "mecanica",
        statement: "Sob chuva em rodovia, fiscalização constata sulcos dos pneus abaixo do limite. Essa condição de pneus desgastados provocará:",
        options: ["Perda de aderência no molhado, aquaplanagem, frenagem longa e risco de estouro.", "Menor consumo por maior aderência da borracha em curvas.", "Bloqueio das rodas dianteiras por fadiga da suspensão ativa.", "Desalinhamento da direção hidráulica por menor atrito de rolamento."],
        correctIndex: 0,
        explanation: "Correta letra A: pneu careca perde drenagem e aderência, elevando o risco de sinistro.",
        detailedExplanation: "Quando o pneu tá careca, ele não consegue escoar a água na pista molhada. Isso faz com que o carro perca a aderência e deslize, principalmente em curvas e frenagens. Usar pneu careca é uma infração GRAVE e pode colocar todo mundo em perigo.",
        incidence: "altissima",
        difficulty: 3
    },
    {
        id: "qe51",
        category: "mecanica",
        statement: "Em via expressa, fluido circula entre bloco, cabeçote e radiador. Nesse circuito, a função primária do líquido de arrefecimento será:",
        options: ["Trocar calor com o motor para manter a temperatura ideal de trabalho.", "Lubrificar cilindros e pistões para reduzir o atrito das bielas.", "Elevar a octanagem da mistura ar-combustível nas câmaras.", "Limpar carbonização das válvulas e do coletor de escape."],
        correctIndex: 0,
        explanation: "Correta letra A: o líquido dissipa o calor e estabiliza a temperatura do motor.",
        detailedExplanation: "O líquido de arrefecimento, que é a mistura de água e aditivo, passa pelo motor e absorve o calor, jogando esse calor fora no radiador. Ele mantém o motor na temperatura certa, em torno de 90°C, pra evitar que ele superaqueça e estrague.",
        incidence: "media",
        difficulty: 3
    },
    {
        id: "qe52",
        category: "mecanica",
        statement: "Durante viagem, acende luz amarela de injeção no painel sem ruídos. Diante desse alerta luminoso, o condutor deverá entender que:",
        options: ["Há anomalia que exige verificação técnica breve, sem parada imediata na pista.", "Há perigo crítico que exige parada imediata na pista por falta de óleo.", "Houve economia de energia por falha mecânica no alternador principal.", "O veículo entrou na reserva do fluido de freio do eixo traseiro."],
        correctIndex: 0,
        explanation: "Correta letra A: luz amarela indica alerta e inspeção breve; vermelha exige parada.",
        detailedExplanation: "As luzes do painel têm cores que falam: AMARELA (ou laranja) é ALERTA — precisa olhar logo, mas não precisa parar agora (ex: luz de injeção, pneu baixo). VERMELHA é PERIGO — tem que parar o carro assim que der (ex: pressão do óleo, temperatura do motor). Ignorar luz amarela pode causar dor de cabeça depois.",
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "qe53",
        category: "mecanica",
        statement: "Na revisão, mecânico avalia o fluido que leva força do pedal às rodas. Sobre a manutenção desse fluido de freio, será correto afirmar que ele:",
        options: ["Deverá ser trocado no prazo do manual, pois absorve umidade do ar.", "Deverá ser completado com água para manter o nível do reservatório.", "Só será trocado se o pedal ficar rígido e alto.", "Só será trocado se misturado ao óleo da caixa de marchas."],
        correctIndex: 0,
        explanation: "Correta letra A: fluido de freio é higroscópico e exige troca periódica.",
        detailedExplanation: "O fluido de freio é HIGROSCÓPICO, ou seja, ele absorve a umidade do ar. Com água no fluido, o ponto de ebulição diminui, e se você frear muito, pode fazer o fluido ferver e o pedal ficar mole, sem frear direito. Por isso, é importante trocar a cada 1 ou 2 anos, mesmo que o carro não rode muito.",
        incidence: "media",
        difficulty: 3
    },
    {
        id: "qe54",
        category: "mecanica",
        statement: "Antes de viajar, condutor confere a pressão dos pneus no posto. Para uma calibragem correta, esse procedimento deverá ser feito:",
        options: ["Com pneus frios, sem rodar mais de 3 km, na pressão indicada pelo fabricante.", "Com pneus quentes após longa viagem, retirando o excesso pelo calor.", "Sempre na pressão máxima gravada na lateral do pneu, sem considerar a carga.", "Apenas ao notar flancos encostando na banda de rodagem."],
        correctIndex: 0,
        explanation: "Correta letra A: calibre com pneus frios e pressão do fabricante do veículo.",
        detailedExplanation: "Verifique a pressão com os pneus FRIOS, ou seja, sem ter rodado mais de 1 km ou parado por 3 horas. Quando eles esquentam, a pressão sobe e você pode acabar calibrando errado. Isso pode causar desgaste nos pneus, gastar mais combustível e prejudicar a segurança do carro.",
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "qe55",
        category: "prioridade",
        statement: "Ambulância desloca-se para atender emergência com sirene e luzes ligadas. Para usar livre circulação e prioridade, esses veículos deverão estar em:",
        options: ["Efetiva prestação de urgência, identificados com luzes vermelhas e sirene ligadas.", "Circulação pela faixa rápida da esquerda acima da média da via.", "Propriedade do governo, com placas de bronze de autoridade municipal.", "Autorização escrita do órgão ambiental e de trânsito do estado."],
        correctIndex: 0,
        explanation: "Correta letra A: prioridade exige urgência real com sinais luminosos e sonoros, conforme art. 29, inciso VII do CTB.",
        detailedExplanation: "Quando a ambulância, a viatura ou o caminhão do bombeiro tá com os sinais acionados, eles têm a prioridade total. Isso significa que podem passar por sinais vermelhos e ultrapassar outros carros, mas sempre com cuidado. Se não tiver com os sinais ligados, não têm essa prioridade.",
        legalBase: "Art. 29, VII CTB",
        incidence: "altissima",
        difficulty: 3
    },
    {
        id: "qe56",
        category: "prioridade",
        statement: "Condutor chega a cruzamento com placa R-2, sem semáforo em operação. Diante da placa de Dê a Preferência, ele deverá:",
        options: ["Reduzir com segurança e dar preferência aos veículos da via preferencial.", "Acelerar rápido para cruzar antes dos demais veículos.", "Buzinar sem parar para manter a velocidade no cruzamento.", "Parar totalmente mesmo sem nenhum veículo na transversal."],
        correctIndex: 0,
        explanation: "Correta letra A: placa R-2 exige reduzir e ceder aos que circulam na preferencial.",
        detailedExplanation: "Se você tá na via secundária e quer entrar na via preferencial, é preciso dar passagem pra quem já tá lá. A via preferencial sempre tem prioridade, então reduza a velocidade e só entre quando for seguro, sem apressar a passagem.",
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "qe57",
        category: "prioridade",
        statement: "Em via estreita sem pavimento, em declive forte, dois carros se cruzam. Conforme o CTB, a preferência nesse aclive será do veículo que estiver:",
        options: ["Subindo a ladeira, devendo quem desce dar a preferência.", "Descendo a ladeira, por desenvolver maior energia cinética.", "Sinalizando primeiro com pisca-alerta ou buzina prolongada.", "Com menor tração nominal ou menor peso bruto total."],
        correctIndex: 0,
        explanation: "Correta letra A: em aclive, quem sobe tem preferência, conforme art. 29, inciso III do CTB.",
        detailedExplanation: "Em ruas estreitas e íngremes, o carro que sobe sempre tem a prioridade. Isso é por segurança, já que é mais complicado e arriscado para quem está subindo dar ré do que para quem desce. O carro que desce deve voltar até um lugar seguro para o carro que sobe passar.",
        legalBase: "Art. 29, III, 'e' CTB",
        incidence: "media",
        trap: true,
        difficulty: 3
    },
    {
        id: "qe58",
        category: "prioridade",
        statement: "Em via com ciclistas, condutor pretende ultrapassar bicicleta adiante. Conforme o CTB, a manobra correta nessa situação será:",
        options: ["Guardar 1,5 m lateral, reduzir a velocidade e garantir a segurança.", "Buzinar sem parar ao lado do ciclista em velocidade alta.", "Apertar a bicicleta contra a borda para subi-la à calçada.", "Manter a velocidade máxima mesmo com pedestre fora da faixa."],
        correctIndex: 0,
        explanation: "Correta letra A: ao ultrapassar bicicleta, guarde 1,5 m e reduza, conforme art. 201 do CTB.",
        detailedExplanation: "Os ciclistas e pedestres são os mais vulneráveis no trânsito, então a gente precisa ter atenção redobrada. O Código de Trânsito fala que eles têm prioridade, especialmente os que estão nas faixas. A vida deles vale mais do que a pressa de quem está dirigindo.",
        legalBase: "Art. 201 CTB",
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "qe59",
        category: "legislacao",
        statement: "Condutor avança cruzamento sem obedecer à placa R-1 de parada obrigatória. Conforme o CTB, desrespeitar a placa PARE configura infração:",
        options: ["Gravíssima, com multa e 7 pontos no prontuário da CNH.", "Grave, com retenção do veículo até vistoria do agente.", "Média, com perdão automático se o cruzamento estiver livre.", "Leve, com advertência se não houver fluxo transversal."],
        correctIndex: 0,
        explanation: "Correta letra A: avançar o PARE é infração gravíssima, conforme art. 208 do CTB.",
        detailedExplanation: "Quando você ignora a placa PARE e não para o carro, isso é considerado uma infração GRAVÍSSIMA, que dá 7 pontos na CNH e multa. A placa pede que você pare totalmente, não só diminua a velocidade, e mesmo que não venha ninguém, é preciso parar e olhar antes de seguir.",
        legalBase: "Art. 208 CTB",
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "qe60",
        category: "direcao-defensiva",
        statement: "Em declive longo de rodovia, o uso contínuo do freio aquece o sistema e reduz a frenagem. Como o condutor deve descer para controlar a velocidade com segurança?",
        options: ["Descer em ponto morto, usando o freio de serviço com toques leves para economizar combustível.", "Descer com câmbio desengatado e frear forte somente se a velocidade passar do limite da via.", "Descer com o veículo engrenado em marcha reduzida, usando o freio-motor para conter a velocidade.", "Descer com marcha alta engatada e manter o pé sobre o freio durante todo o declive."],
        correctIndex: 2,
        explanation: "Correta a terceira: descer engrenado em marcha reduzida garante freio-motor. Descer desengatado é infração média, art. 231, IX, CTB.",
        detailedExplanation: "Em descidas longas, o ideal é usar o FREIO MOTOR: coloque uma marcha reduzida e deixe o motor ajudar a controlar a velocidade. Usar o freio o tempo todo pode superaquecer e causar perda de eficiência ou até falha total. Descer em ponto morto (banguela) é PROIBIDO e tira o controle do carro.",
        legalBase: "Art. 231, IX do CTB",
        incidence: "altissima",
        trap: true,
        difficulty: 3,
        group: "freio-motor-declive"
    },
    {
        id: "qe61",
        category: "infracoes",
        statement: "Em declive acentuado, o motorista desliga o motor ou deixa o câmbio em ponto morto, na banguela. Como o CTB classifica essa conduta na descida?",
        options: ["Infração média, com multa e retenção do veículo até regularizar a situação no local.", "Infração leve, com multa e três pontos, sem retenção do veículo na via.", "Infração grave, com multa e cinco pontos, além de suspensão direta do direito de dirigir.", "Conduta regular, permitida para economizar combustível em declive suave e pista livre."],
        correctIndex: 0,
        explanation: "Correta a primeira: descer desligado ou desengatado é infração média, com multa e retenção, art. 231, IX, CTB.",
        detailedExplanation: "Quando você desce com o carro desengatado ou com o motor desligado, perde o efeito do freio-motor e compromete a eficiência da frenagem. O Art. 231, IX do CTB estabelece que essa prática é uma infração média, sujeita a multa e retenção do veículo.",
        legalBase: "Art. 231, IX do CTB",
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "qe62",
        category: "legislacao",
        statement: "Durante os doze meses de permissão para dirigir, o condutor comete uma infração gravíssima. O que ocorre com a obtenção da habilitação definitiva?",
        options: ["Perde o direito à definitiva e precisa reiniciar todo o processo de habilitação.", "Mantém a permissão e recebe a definitiva após pagar a multa com desconto previsto.", "Recebe a definitiva com restrição e precisa fazer curso de reciclagem em trinta dias.", "Tem a permissão suspensa por sessenta dias e depois recebe a definitiva automaticamente."],
        correctIndex: 0,
        explanation: "Correta a primeira: com infração grave, gravíssima ou reincidência em média na permissão, não recebe a definitiva, art. 148, CTB.",
        detailedExplanation: "Durante a Permissão para Dirigir (PPD), se o condutor comete uma infração gravíssima, ele não pode mais tirar a CNH definitiva. Isso significa que ele vai ter que refazer todas as etapas, desde as aulas até os exames. A PPD é um período em que é preciso ter cuidado redobrado no trânsito.",
        legalBase: "Art. 148 CTB",
        incidence: "alta",
        trap: true,
        difficulty: 3
    },
    {
        id: "qe63",
        category: "legislacao",
        statement: "Para transportar crianças com segurança, o CTB exige dispositivo adequado a cada fase. Em qual situação o assento de elevação é obrigatório no banco traseiro?",
        options: ["Crianças acima de quatro até sete anos e meio, ou com altura abaixo de um metro e quarenta e cinco.", "Bebês de até um ano, com peso até treze quilos, voltados para o vidro traseiro do carro.", "Crianças de um até quatro anos, voltadas para frente, presas em cadeirinha no banco traseiro.", "Crianças acima de sete anos e meio, mesmo com altura superior a um metro e quarenta e cinco."],
        correctIndex: 0,
        explanation: "Correta a primeira: assento de elevação para acima de quatro até sete anos e meio ou menos de 1,45 m, art. 168, CTB.",
        detailedExplanation: "A nova regra diz que crianças até 10 anos ou com menos de 1,45m precisam de um dispositivo de retenção no banco de trás. Antes, a idade limite era 7 anos e meio, agora é mais seguro. Se não seguir essa regra, é infração gravíssima.",
        incidence: "altissima",
        difficulty: 3
    },
    {
        id: "qe64",
        category: "direcao-defensiva",
        statement: "À noite, em pista única, o farol alto do veículo contrário ofusca sua visão. Qual atitude defensiva evita sinistro nesse momento?",
        options: ["Desviar o olhar para a faixa do bordo à direita e reduzir a velocidade de forma suave.", "Acender seu farol alto também para sinalizar e obrigar o outro a baixar a luz.", "Piscar os olhos repetidas vezes e manter a velocidade para passar logo pelo clarão.", "Acionar o pisca-alerta e frear bruscamente sobre a faixa para interromper a marcha."],
        correctIndex: 0,
        explanation: "Correta a primeira: desvie a visão para o bordo à direita e reduza suave, sem encarar o farol nem frear sobre a faixa.",
        detailedExplanation: "Quando um carro vem na sua direção com farol alto e te ofusca, nunca olhe direto para ele, porque isso pode te deixar cego por alguns segundos. O certo é desviar o olhar para a margem direita da pista e ir diminuindo a velocidade, assim você consegue manter a visão e evitar acidentes. Também é bom piscar o farol rapidinho pra avisar o outro motorista.",
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "qe65",
        category: "direcao-defensiva",
        statement: "O pisca-alerta tem uso restrito e não deve virar recurso de rotina. Em qual situação o CTB admite ligar o pisca-alerta com o veículo em movimento?",
        options: ["Com veículo parado em emergência, ou lento sob neblina intensa, ou onde a sinalização mandar.", "Para parar em fila dupla por instantes e embarcar passageiro sem buscar vaga regular.", "Para indicar pressa e solicitar passagem livre acima do limite permitido na via.", "Para cruzar interseção com parada obrigatória sem imobilizar o veículo antes da linha."],
        correctIndex: 0,
        explanation: "Correta a primeira: pisca-alerta em emergência com veículo parado, ou lento sob neblina, ou onde a placa mandar, art. 251, CTB.",
        detailedExplanation: "O pisca-alerta (quatro setas piscando) deve ser usado quando o carro está PARADO em situação de EMERGÊNCIA, como pane ou acidente, ou em movimento em situações de neblina/cerração e onde a sinalização determinar. Usar sem necessidade em movimento pode confundir outros condutores.",
        legalBase: "Art. 251 CTB",
        incidence: "alta",
        trap: true,
        difficulty: 3
    },
    {
        id: "qe66",
        category: "infracoes",
        statement: "O motorista entra com o carro na contramão de via sinalizada com sentido único. Como o art. 186 do CTB classifica essa conduta?",
        options: ["Infração gravíssima, com multa e sete pontos na habilitação do condutor.", "Infração grave, com multa e cinco pontos, além de retenção do veículo no local.", "Infração média, com multa e quatro pontos, sem apreensão do veículo na via.", "Infração gravíssima, com multa agravada e suspensão direta do direito de dirigir."],
        correctIndex: 0,
        explanation: "Correta a primeira: transitar pela contramão em sentido único é infração gravíssima, art. 186, CTB.",
        detailedExplanation: "Transitar na contramão em vias de sentido único é infração gravíssima (7 pontos e multa). Trata-se de uma conduta de alto risco para colisões frontais.",
        legalBase: "Art. 186, II CTB",
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "qe67",
        category: "infracoes",
        statement: "Após colisão com feridos, o motorista poderia socorrer, mas foge sem ajudar nem acionar resgate. Como o CTB trata essa omissão de socorro?",
        options: ["Infração gravíssima e crime de trânsito por deixar de prestar socorro podendo fazê-lo.", "Infração grave, com multa e cinco pontos, sem caracterizar crime de trânsito.", "Infração média, com multa e quatro pontos, aplicada somente na reincidência.", "Infração gravíssima, com multa e sete pontos, sem caracterizar crime de trânsito."],
        correctIndex: 0,
        explanation: "Correta a primeira: omitir socorro podendo prestá-lo é infração gravíssima e crime, art. 304, CTB.",
        detailedExplanation: "Deixar de prestar socorro à vítima de acidente, quando possível fazê-lo sem risco pessoal, configura infração gravíssima de trânsito e também crime previsto no Art. 304 do CTB.",
        legalBase: "Art. 176, I e Art. 304 CTB",
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "qe68",
        category: "primeiros-socorros",
        statement: "Após colisão, a vítima está inconsciente, sem respirar e sem pulso, em parada cardiorrespiratória. O que o socorrista leigo deve iniciar de imediato?",
        options: ["Compressões no centro do peito, de cem a cento e vinte por minuto, até chegar o resgate.", "Ofertar água em pequenos goles e aplicar pano frio na testa para reanimar a vítima.", "Sentar a vítima com a cabeça erguida e massagear ombros e pescoço com força.", "Aplicar somente ventilação boca a boca por dez minutos antes das compressões."],
        correctIndex: 0,
        explanation: "Correta a primeira: sem respiração e sem pulso, inicie compressões de cem a cento e vinte por minuto e acione socorro.",
        detailedExplanation: "Na Parada Cardiorrespiratória (PCR), o atendimento imediato exige compressões torácicas contínuas a uma frequência de 100 a 120 por minuto no centro do tórax.",
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "qe69",
        category: "meio-ambiente",
        statement: "O proprietário é convocado para a inspeção técnica do veículo em vistoria oficial. Qual é o objetivo central desse programa quanto à segurança e ao ambiente?",
        options: ["Verificar freios, luzes e estrutura, além de medir emissão de gases e ruído dentro do limite.", "Definir o valor de mercado do veículo para calcular o imposto anual devido pelo dono.", "Exigir a troca de peças por quilometragem fixa, mesmo sem desgaste constatado.", "Conferir o pagamento do financiamento e das parcelas em atraso junto ao banco."],
        correctIndex: 0,
        explanation: "Correta a primeira: a inspeção confere segurança e limites de gases e ruído, art. 104, CTB.",
        detailedExplanation: "A inspeção técnica veicular tem como objetivo garantir que os veículos em circulação atendam aos requisitos de segurança e aos limites de emissão de poluentes e ruídos estipulados pelo CONAMA.",
        legalBase: "Art. 104 CTB",
        incidence: "media",
        difficulty: 3
    },
    {
        id: "qe70",
        category: "mecanica",
        statement: "Antes de viagem longa com o carro carregado, o motorista quer evitar pane na rodovia. Qual cuidado preventivo com pneus, fluidos e itens é o correto?",
        options: ["Medir óleo, arrefecimento e fluido de freio, testar luzes, calibrar pneus com estepe e conferir triângulo.", "Trocar todo o fluido da direção e os amortecedores dianteiros antes de qualquer viagem longa.", "Lavar o motor com jato forte e aplicar óleo nas mangueiras de borracha do cofre.", "Elevar a pressão de todos os pneus bem acima do indicado para suportar o peso das malas."],
        correctIndex: 0,
        explanation: "Correta a primeira: conferir fluidos, luzes, calibragem com estepe e itens obrigatórios evita pane e sinistro.",
        detailedExplanation: "A manutenção preventiva antes de viagens envolve a verificação dos níveis de fluidos (óleo, arrefecimento, freio), sistema de iluminação, sinalização, equipamentos obrigatórios e calibragem correta dos pneus (incluindo o estepe).",
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "qe71",
        category: "legislacao",
        statement: "Em rua urbana classificada como via local, sem placa de velocidade no trecho. Qual limite máximo o motorista deve respeitar pelo CTB?",
        options: ["Trinta por hora, limite das vias locais sem sinalização em área urbana.", "Quarenta por hora, limite próprio das vias coletoras urbanas sem sinalização.", "Sessenta por hora, limite próprio das vias arteriais urbanas sem sinalização.", "Cinquenta por hora, limite geral das vias urbanas sem classificação definida."],
        correctIndex: 0,
        explanation: "Correta a primeira: sem placa, via local tem máxima de trinta por hora, art. 61, CTB.",
        detailedExplanation: "Nas vias urbanas não sinalizadas, os limites máximos estabelecidos pelo CTB são: 30 km/h nas vias locais, 40 km/h nas coletoras, 60 km/h nas arteriais e 80 km/h nas de trânsito rápido.",
        legalBase: "Art. 61, § 1º, I, 'a' CTB",
        incidence: "altissima",
        difficulty: 3
    },
    {
        id: "qe72",
        category: "legislacao",
        statement: "Em rodovia rural de pista dupla, sem placa de velocidade, segue um carro de passeio. Qual é a máxima permitida para esse carro pelo CTB?",
        options: ["Cento e dez por hora, máxima do carro, caminhonete e moto em pista dupla rural.", "Noventa por hora, máxima prevista para ônibus e micro-ônibus nesse mesmo trecho.", "Cem por hora, máxima prevista para carro em pista simples rural sem sinalização.", "Cento e vinte por hora, máxima admitida somente onde a placa autorizar esse valor."],
        correctIndex: 0,
        explanation: "Correta a primeira: sem placa, carro em pista dupla rural vai a cento e dez por hora, art. 61, CTB.",
        detailedExplanation: "Nas rodovias de pista dupla onde não houver sinalização regulamentadora, o limite de velocidade é de 110 km/h para automóveis, camionetas, caminhonetes e motocicletas, e de 90 km/h para os demais veículos.",
        legalBase: "Art. 61, § 1º, II, 'a', 1 CTB",
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "qe73",
        category: "legislacao",
        statement: "Estrada é a via rural sem pavimento. Sem placa no local, qual é a máxima padrão na estrada para todo veículo automotor?",
        options: ["Sessenta por hora para todo veículo automotor que transita pela estrada.", "Oitenta por hora para leves e sessenta para pesados articulados na estrada.", "Noventa por hora para motos e caminhonetes em trecho de terra sem sinalização.", "Quarenta por hora para todos, por causa da falta de pavimento e risco de derrapar."],
        correctIndex: 0,
        explanation: "Correta a primeira: sem placa, a máxima na estrada é sessenta por hora para todo veículo, art. 61, CTB.",
        detailedExplanation: "Conforme o CTB, estradas são vias rurais não pavimentadas. O limite máximo de velocidade em estradas não sinalizadas é de 60 km/h para todos os veículos.",
        legalBase: "Art. 61, § 1º, II, 'b' CTB",
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "qe74",
        category: "direcao-defensiva",
        statement: "Sob neblina densa na rodovia, com visibilidade muito curta e tráfego intenso. Qual conduta com faróis e velocidade mantém a segurança?",
        options: ["Ligar farol baixo ou de neblina, reduzir suave e manter folga do veículo da frente.", "Ligar farol alto fixo para atravessar a cortina de gotas suspensas no ar.", "Ligar o pisca-alerta em movimento e acelerar para sair logo do trecho com neblina.", "Manter só lanterna de posição e conservar a velocidade normal da rodovia."],
        correctIndex: 0,
        explanation: "Correta a primeira: na neblina use farol baixo ou de neblina e reduza suave; farol alto reflete e cega.",
        detailedExplanation: "Sob neblina ou cerração, o condutor deve utilizar o farol baixo ou farol de neblina e manter distância segura de seguimento. O farol alto reflete nas gotículas suspensas e reduz ainda mais a visibilidade.",
        incidence: "alta",
        trap: true,
        difficulty: 3
    },
    {
        id: "qe75",
        category: "infracoes",
        statement: "Para descarregar malas rapidinho, o motorista estaciona o carro sobre a calçada de pedestres. Como o CTB classifica esse estacionamento no passeio?",
        options: ["Infração grave, com multa e remoção do veículo pelo agente de trânsito.", "Infração leve, com multa e três pontos, sem previsão de remoção do veículo.", "Infração média, com multa e quatro pontos, sem previsão de remoção do veículo.", "Infração gravíssima, com multa e sete pontos, além de suspensão da habilitação."],
        correctIndex: 0,
        explanation: "Correta a primeira: estacionar no passeio é infração grave, com multa e remoção, art. 181, VIII, CTB.",
        detailedExplanation: "Estacionar o veículo sobre a calçada/passeio público é infração grave (5 pontos na CNH, multa) e possui a medida administrativa de remoção do veículo.",
        legalBase: "Art. 181, VIII CTB",
        incidence: "media",
        difficulty: 3
    },
    {
        id: "qe76",
        category: "infracoes",
        statement: "Em fiscalização, os passageiros do banco traseiro estão sem cinto de segurança. Quem responde pela infração e qual é sua classificação pelo CTB?",
        options: ["O condutor, por infração grave, com multa e retenção até colocação do cinto.", "Cada passageiro, por infração leve, com advertência escrita aplicada no local.", "O proprietário do veículo, por infração média, mesmo ausente no momento da abordagem.", "O condutor, por infração média, com multa e quatro pontos sem retenção do veículo."],
        correctIndex: 0,
        explanation: "Correta a primeira: cinto obrigatório para todos; sem cinto no banco traseiro responde o condutor, infração grave, arts. 65 e 167, CTB.",
        detailedExplanation: "Deixar de usar o cinto de segurança (ou permitir que passageiros não o usem) é infração grave imputada ao condutor (5 pontos, multa) com medida administrativa de retenção do veículo até a colocação do cinto.",
        legalBase: "Art. 167 CTB",
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "qe77",
        category: "direcao-defensiva",
        statement: "O motorista bebe uma lata de cerveja e assume a direção do veículo. Pela Lei Seca, mesmo com pequena dose, qual é a consequência prevista?",
        options: ["Infração gravíssima, com multa vezes dez, suspensão por doze meses e retenção do veículo.", "Infração gravíssima, com multa simples e sete pontos, sem suspensão do direito de dirigir.", "Infração grave, com multa e cinco pontos, além de retenção do veículo no local.", "Crime de trânsito em qualquer dose, com detenção imediata do condutor pela autoridade."],
        correctIndex: 0,
        explanation: "Correta a primeira: qualquer álcool ao dirigir gera infração gravíssima, multa vezes dez e suspensão por doze meses, art. 165, CTB.",
        detailedExplanation: "Dirigir sob a influência de álcool é infração gravíssima penalizada com multa multiplicada por 10 e suspensão do direito de dirigir por 12 meses, além da retenção do veículo.",
        legalBase: "Art. 165 CTB",
        incidence: "altissima",
        trap: true,
        difficulty: 3
    },
    {
        id: "qe78",
        category: "primeiros-socorros",
        statement: "Um adulto consciente engasga com alimento, não fala nem tosse e leva as mãos ao pescoço. Qual manobra libera a via aérea nesse caso?",
        options: ["Manobra de Heimlich, com compressões abdominais rápidas para dentro e para cima, acima do umbigo.", "Deitar a vítima de lado e aplicar ventilação boca a boca com sopro forte e contínuo.", "Ofertar pão seco e água em grandes goles para empurrar o objeto até o estômago.", "Aplicar golpes na nuca com a vítima sentada até o alimento sair pela tosse."],
        correctIndex: 0,
        explanation: "Correta a primeira: em obstrução total com vítima consciente, aplique Heimlich acima do umbigo até expelir.",
        detailedExplanation: "Em casos de Obstrução de Vias Aéreas por Corpo Estranho (OVACE) grave/total em adultos conscientes, deve-se realizar a Manobra de Heimlich (compressões abdominais subdiafragmáticas para dentro e para cima).",
        incidence: "media",
        difficulty: 3
    },
    {
        id: "qe79",
        category: "meio-ambiente",
        statement: "O motociclista troca o escapamento original por modelo esportivo aberto e circula com ruído excessivo. Como o CTB enquadra essa conduta?",
        options: ["Infração grave, com multa e retenção da motocicleta para regularização.", "Infração média, com multa e quatro pontos, sem previsão de retenção do veículo.", "Infração leve, com advertência escrita e prazo para troca do escapamento irregular.", "Infração gravíssima, com multa e sete pontos, além de cassação da habilitação."],
        correctIndex: 0,
        explanation: "Correta a primeira: conduzir com escapamento irregular é infração grave, com multa e retenção, art. 230, CTB.",
        detailedExplanation: "Conduzir veículo com descarga livre ou silenciador de motor de explosão defeituoso, deficiente ou inoperante constitui infração grave (5 pontos e multa), sujeita à retenção do veículo para regularização.",
        legalBase: "Art. 230, XI CTB",
        incidence: "media",
        difficulty: 3
    },
    {
        id: "qe80",
        category: "mecanica",
        statement: "Antes de ligar o motor, o condutor sente forte cheiro e vê manchas de combustível sob o capô. Diante do risco de incêndio, qual é a conduta correta?",
        options: ["Não ligar o motor, manter o veículo parado em local ventilado e chamar reboque.", "Ligar o motor em rotação alta para queimar o excesso e secar o vazamento.", "Aplicar detergente sobre a mancha para diluir o combustível e seguir viagem.", "Ligar o motor e seguir até o posto se nenhuma luz vermelha acender no painel."],
        correctIndex: 0,
        explanation: "Correta a primeira: com vazamento de combustível não dê partida; deixe parado em local ventilado e chame reboque.",
        detailedExplanation: "Havendo suspeita ou evidência de vazamento de combustível, não se deve dar a partida no motor para evitar faiscamento e risco iminente de incêndio.",
        incidence: "media",
        difficulty: 3
    },
    {
        id: "qe81",
        category: "prioridade",
        statement: "Ao sair de garagem e entrar em via pública, o condutor cruza a calçada com pedestres e encontra fluxo de veículos. A quem deve dar preferência?",
        options: ["Aos pedestres na calçada e aos veículos que já circulam pela via pública.", "A ninguém, pois quem sai do imóvel tem prioridade se sinalizar e acelerar rápido.", "Somente aos veículos da esquerda, passando à frente de pedestres e demais carros.", "Somente aos veículos da direita, sem precisar observar os pedestres na calçada."],
        correctIndex: 0,
        explanation: "Correta a primeira: quem sai de imóvel deve dar preferência a pedestres e veículos da via, art. 36, CTB.",
        detailedExplanation: "O condutor que sai de lote lindeiro (garagem, posto, etc.) deve ceder a passagem aos pedestres na calçada e aos veículos que transitam pela via.",
        legalBase: "Art. 36 CTB",
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "qe82",
        category: "legislacao",
        statement: "Um veículo circula com a placa traseira suja e caracteres encobertos, sem legibilidade. Como o CTB classifica essa irregularidade?",
        options: ["Infração gravíssima, com multa, remoção do veículo e recolhimento do licenciamento.", "Infração grave, com multa e cinco pontos, além de retenção até limpeza da placa.", "Infração média, com multa e quatro pontos, sem remoção do veículo ou do documento.", "Infração leve, resolvida com advertência escrita e prazo para limpeza da placa."],
        correctIndex: 0,
        explanation: "Correta a primeira: placa sem legibilidade é infração gravíssima, com multa, remoção e recolhimento, art. 230, VI, CTB.",
        detailedExplanation: "Transitar com o veículo com qualquer uma das placas sem condições de legibilidade e visibilidade é infração gravíssima (7 pontos), punida com multa, remoção do veículo e recolhimento do CLA/CRLV.",
        legalBase: "Art. 230, VI CTB",
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "qe83",
        category: "direcao-defensiva",
        statement: "Após ultrapassar um caminhão em rodovia de pista única, o motorista quer voltar à faixa de origem. Qual é o procedimento seguro de retorno?",
        options: ["Sinalizar com a seta à direita e retornar só após ver o caminhão inteiro no retrovisor interno.", "Retornar logo após passar o para-lama dianteiro para liberar rápido a contramão.", "Reduzir sobre a contramão até emparelhar e buzinar antes de voltar à faixa.", "Ligar o pisca-alerta durante o retorno para indicar manobra de emergência."],
        correctIndex: 0,
        explanation: "Correta a primeira: sinalize e só retorne após ver o caminhão completo no retrovisor interno.",
        detailedExplanation: "O retorno à faixa de origem após ultrapassagem só deve ser feito após o condutor certificar-se de que não vai fechar o veículo ultrapassado. Uma regra prática de segurança é visualizar a frente inteira do veículo ultrapassado pelo retrovisor interno antes de voltar.",
        incidence: "media",
        difficulty: 3
    },
    {
        id: "qe84",
        category: "infracoes",
        statement: "À noite, em via urbana bem iluminada, o condutor desliga os faróis e circula só com faroletes. Essa atitude configura qual infração pelo CTB?",
        options: ["Infração média, com multa e quatro pontos por usar só luz de posição à noite.", "Infração grave, com multa e cinco pontos, além de apreensão da habilitação.", "Conduta regular, pois a iluminação pública dispensa o farol baixo à noite.", "Infração leve, punida só com advertência escrita se circular em baixa velocidade."],
        correctIndex: 0,
        explanation: "Correta a primeira: circular à noite só com faroletes é infração média, art. 250, CTB.",
        detailedExplanation: "Em vias iluminadas à noite, o uso de farol baixo é obrigatório. Circular apenas com as luzes de posição (faroletes) constitui infração média (4 pontos e multa).",
        legalBase: "Art. 250, I, 'a' CTB",
        incidence: "media",
        difficulty: 3
    },
    {
        id: "qe85",
        category: "legislacao",
        statement: "Um carro sem luz de condução diurna circula de dia em rodovia de pista simples fora da cidade. O que o CTB exige sobre o farol baixo?",
        options: ["Manter o farol baixo aceso de dia em rodovia de pista simples fora do perímetro urbano.", "Manter o farol baixo aceso em qualquer via pública, mesmo com luz de condução diurna.", "Usar o farol baixo de dia só em túneis, neblina ou chuva forte na rodovia.", "Usar o farol baixo de dia só em rodovia com pedágio e fluxo rápido intenso."],
        correctIndex: 0,
        explanation: "Correta a primeira: sem luz diurna, farol baixo de dia é obrigatório em pista simples fora da cidade, art. 40, CTB.",
        detailedExplanation: "A obrigatoriedade de acender o farol baixo de dia aplica-se a veículos desprovidos de luz de condução diurna (DRL) quando em rodovias de pista simples situadas fora dos perímetros urbanos.",
        legalBase: "Art. 40, § 2º CTB",
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "qp16",
        category: "placas",
        statement: "O condutor busca posto, telefone de emergência e hospital e usa placas para se orientar. Qual grupo indica serviços auxiliares e orienta sobre destinos?",
        options: ["Regulamentação, que impõe condições, proibições e obrigações no uso das vias.", "Advertência, que alerta para perigos, obstáculos e riscos existentes na pista.", "Indicação, que identifica vias e locais de interesse e orienta sobre destinos e serviços.", "Sinalização de obras, que informa trabalhos na pista e interdições provisórias."],
        correctIndex: 2,
        explanation: "Correta a terceira: placas de indicação orientam destinos e serviços auxiliares, como posto e hospital.",
        detailedExplanation: "As placas de Indicação têm caráter informativo e orientador, subdividindo-se em identificação de vias, orientação de destino, serviços auxiliares e atrativos turísticos.",
        incidence: "media",
        difficulty: 2
    },
    {
        id: "q4",
        category: "primeiros-socorros",
        statement: "Após colisão traseira, a vítima consciente sente forte dor no pescoço e não move braços nem pernas. Até o socorro chegar, qual é a primeira conduta?",
        options: ["Retirar a vítima do carro puxando pelos braços para evitar possível risco de incêndio.", "Ofertar água e analgésico e massagear o pescoço para aliviar a dor intensa.", "Manter a vítima imóvel, com pescoço e coluna alinhados, sem movimentação desnecessária.", "Ajudar a vítima a sentar ereta para melhorar a circulação do sangue no corpo."],
        correctIndex: 2,
        explanation: "Correta a terceira: com dor no pescoço e perda de movimentos, mantenha imóvel e alinhada até o socorro.",
        detailedExplanation: "Havendo suspeita de trauma na coluna cervical, a vítima não deve ser movimentada nem ter a cabeça manipulada até a chegada da equipe de resgate especializada.",
        commonMistake: "Muita gente acha que deve fazer respiração boca a boca, mas isso só é pra quem não tá respirando.",
        tip: "Dor no pescoço = Fica parado e alinhado.",
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "q5",
        category: "infracoes",
        statement: "Em blitz da Lei Seca, o etilômetro aponta álcool acima da tolerância. Pelo art. 165 do CTB, qual é a infração e a penalidade aplicada ao condutor?",
        options: ["Infração grave, com multa vezes cinco e cinco pontos na habilitação do condutor.", "Infração gravíssima, com multa vezes dez e suspensão do direito de dirigir por doze meses.", "Infração média, com multa e quatro pontos, além de apreensão definitiva da habilitação.", "Infração gravíssima, com multa vezes dez e cassação direta da habilitação por dois anos."],
        correctIndex: 1,
        explanation: "Correta a segunda: álcool ao dirigir é infração gravíssima, multa vezes dez e suspensão por doze meses, art. 165, CTB.",
        detailedExplanation: "Constatada a condução sob influência de álcool, aplica-se a infração gravíssima com penalidade de multa (fator multiplicador 10) e suspensão do direito de dirigir por 12 meses.",
        legalBase: "Art. 165 e Art. 306 do CTB",
        incidence: "altissima",
        difficulty: 3
    },
    {
        id: "q6",
        category: "prioridade",
        statement: "Dois carros chegam juntos a cruzamento urbano sem semáforo nem placas. Pela regra geral do CTB, quem tem preferência para passar pelo cruzamento?",
        options: ["O carro da via principal, pois a hierarquia da via prevalece sobre a regra geral.", "O veículo que vier pela direita do outro, pela regra geral sem sinalização.", "O veículo em maior velocidade, pois libera o cruzamento com mais fluidez.", "O veículo que ligar a seta primeiro, independente da posição no cruzamento."],
        correctIndex: 1,
        explanation: "Correta a segunda: sem sinalização, a preferência é de quem vem pela direita, art. 29, CTB.",
        detailedExplanation: "Em interseção não sinalizada, a preferência de passagem é do veículo que se aproxima pela direita do outro condutor.",
        legalBase: "Art. 29, III, 'c' do CTB",
        commonMistake: "Muita gente erra achando que a preferência é pela esquerda, mas é pela direita!",
        tip: "Direita = preferência. Fica na cabeça!",
        incidence: "altissima",
        trap: true,
        difficulty: 3
    },
    {
        id: "q7",
        category: "placas",
        statement: "A placa R-1 de parada obrigatória tem formato único entre as de regulamentação. Qual é esse formato e sua vantagem para o reconhecimento?",
        options: ["Formato octogonal, que permite reconhecer a placa mesmo vista pelo verso ou com poeira.", "Formato triangular invertido, que indica cessão de preferência na via secundária.", "Formato circular padrão, que diferencia proibições das advertências em losango.", "Formato retangular azul, que indica área de estacionamento regulamentado na via."],
        correctIndex: 0,
        explanation: "Correta a primeira: R-1 é octogonal, única na regulamentação, reconhecível até pelo verso, art. 208, CTB.",
        detailedExplanation: "A placa de Parada Obrigatória (R-1) possui formato octogonal (8 lados), o que permite seu reconhecimento imediato por condutores de todas as direções, mesmo vista de costas.",
        commonMistake: "Muita gente confunde com placas de aviso por causa do formato. Lembre-se: PARE é REGULAMENTAÇÃO.",
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "q8",
        category: "meio-ambiente",
        statement: "Com escapamento adulterado, o veículo emite gases acima do limite em medição ambiental. Qual é a sanção prevista no CTB para essa irregularidade?",
        options: ["Advertência escrita do órgão ambiental, sem multa ou ponto na habilitação.", "Infração grave, com multa e retenção do veículo para regularizar a emissão.", "Infração gravíssima, com multa e sete pontos, além de remoção do veículo ao pátio.", "Crime de trânsito, com detenção imediata do motorista em flagrante na via."],
        correctIndex: 1,
        explanation: "Correta a segunda: emitir gases acima do limite é infração grave, com multa e retenção, art. 231, CTB.",
        detailedExplanation: "Transitar com o veículo produzindo fumaça, gases ou partículas em níveis superiores aos fixados pelo CONTRAN é infração grave (5 pontos e multa), com retenção do veículo para regularização.",
        legalBase: "Art. 231, III do CTB",
        incidence: "media",
        difficulty: 3
    },
    {
        id: "q9",
        category: "mecanica",
        statement: "Na revisão do freio hidráulico, o mecânico mostra pedal, hidrovácuo, discos e tambores. Qual afirmação sobre o sistema está correta?",
        options: ["O freio de estacionamento usa fluido nas quatro rodas ao mesmo tempo, com igual pressão.", "A frenagem nasce do atrito das pastilhas nos discos ou sapatas nos tambores, pela pressão do fluido.", "O hidrovácuo endurece o pedal para exigir mais força do condutor na emergência.", "O fluido de freio só exige troca se houver vazamento grave no cilindro mestre."],
        correctIndex: 1,
        explanation: "Correta a segunda: o fluido empurra pastilhas e sapatas contra discos e tambores, gerando atrito e frenagem.",
        detailedExplanation: "O sistema de freio de serviço opera por acionamento hidráulico: ao pisar no pedal, o fluido transmite pressão até as pinças/cilindros de roda, pressionando as pastilhas contra os discos ou sapatas contra os tambores.",
        incidence: "media",
        difficulty: 3
    },
    {
        id: "q10",
        category: "direcao-defensiva",
        statement: "Em dia claro e pista seca, você segue um carro e quer manter espaço seguro. Qual regra prática define essa distância de seguimento na via?",
        options: ["Guardar cinco metros para cada dez por hora do velocímetro, sem observar ponto fixo.", "Contar dois segundos entre o carro da frente e o seu por um mesmo ponto fixo.", "Contar três postes de luz como medida exata de espaço em qualquer velocidade.", "Manter espaço fixo de dois carros, mesmo com chuva forte sobre a pista."],
        correctIndex: 1,
        explanation: "Correta a segunda: contar dois segundos entre o carro da frente e o seu por um ponto fixo garante distância de seguimento segura.",
        detailedExplanation: "A regra dos dois segundos é uma técnica prática de direção defensiva para calcular a distância de seguimento em condições normais de pista e tempo.",
        tip: "Normal = 2s · Chuva = 4s",
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "q11",
        category: "legislacao",
        statement: "Após as alterações da Lei 14.071/2020, mudaram os prazos do exame de aptidão física e mental para renovação da CNH. Para o condutor com menos de 50 anos de idade, qual é o prazo máximo de validade?",
        options: ["Cinco anos, mesmo sem atividade paga ao volante e sem restrição médica expressa.", "Dez anos, salvo se houver indicação médica que recomende a redução desse prazo.", "Três anos para todo habilitado, inclusive das categorias simples sem atividade paga.", "Quinze anos, desde que não tenha cometido infração gravíssima nos últimos doze meses."],
        correctIndex: 1,
        explanation: "Correta a opção 2: para condutores com menos de 50 anos, a validade do exame é de até 10 anos, conforme o art. 147, § 2º, I do CTB.",
        detailedExplanation: "Com a Lei 14.071/2020, a validade do exame médico para renovação da CNH passou a ser de: até 10 anos para condutores com menos de 50 anos; até 5 anos para condutores com idade igual ou superior a 50 anos e inferior a 70; e até 3 anos para condutores com 70 anos ou mais.",
        legalBase: "Art. 147, § 2º, I do CTB",
        commonMistake: "Achar que a validade ainda é de 5 anos para todos — a regra mudou em 2021!",
        tip: "Menos de 50 anos = até 10 anos de validade.",
        incidence: "altissima",
        trap: true,
        difficulty: 3
    },
    {
        id: "q12",
        category: "infracoes",
        statement: "De madrugada, em via arterial com semáforo, o condutor avança o foco vermelho alegando razões de segurança. Como o CTB classifica essa conduta?",
        options: ["Infração gravíssima, com penalidade de multa e sete pontos na CNH, sem exceção por motivo pessoal.", "Infração grave, com multa e cinco pontos, aceita de madrugada sob risco alegado.", "Infração média, com multa e quatro pontos, convertida em advertência na primeira vez.", "Infração gravíssima, com multa multiplicada por três e suspensão direta do direito de dirigir."],
        correctIndex: 0,
        explanation: "Correta a opção 1: avançar o sinal vermelho do semáforo é infração gravíssima com 7 pontos na CNH, nos termos do art. 208 do CTB.",
        detailedExplanation: "Avançar o sinal vermelho do semáforo ou o de parada obrigatória é infração GRAVÍSSIMA (7 pontos e multa de R$ 293,47). Salvo em locais onde haja sinalização permissiva expressa (como livre conversão à direita regulamentada), o CTB não isenta a infração por motivo de horário.",
        legalBase: "Art. 208 do CTB",
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "q13",
        category: "placas",
        statement: "À frente há perigo na pista e a sinalização apenas alerta o condutor, sem impor ordem direta de parada. Qual é o padrão de forma e cor dessa placa de advertência?",
        options: ["Circular, com fundo branco, borda vermelha e símbolo preto.", "Formato de losango (quadrada na diagonal), com fundo amarelo, borda interna e símbolo pretos.", "Retangular, com fundo verde ou azul e letras brancas.", "Octogonal, com fundo vermelho e letras brancas."],
        correctIndex: 1,
        explanation: "Correta a opção 2: as placas de advertência têm formato de losango, fundo amarelo e símbolos em preto.",
        detailedExplanation: "As placas de advertência (série A) alertam os usuários sobre condições potencialmente perigosas na via. Elas têm formato de losango (quadrado posicionado em diagonal), fundo amarelo, com orla e símbolos pretos. Elas não possuem caráter punitivo ou de proibição.",
        tip: "Alerta de perigo = Losango amarelo.",
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "q14",
        category: "primeiros-socorros",
        statement: "Você chega primeiro a um local de sinistro em rodovia e decide prestar auxílio. Antes de ter contato direto com as vítimas ou a pista, qual é a primeira providência?",
        options: ["Empurrar os veículos envolvidos para o acostamento para liberar a faixa de rolamento.", "Sinalizar o local da ocorrência e acionar o pisca-alerta, garantindo a segurança do local.", "Iniciar a ventilação de resgate na primeira vítima caída na pista.", "Remover as vítimas das ferragens puxando-as pelos braços."],
        correctIndex: 1,
        explanation: "Correta a opção 2: a prioridade absoluta é garantir a segurança da cena, sinalizando o local e acionando o socorro especializado.",
        detailedExplanation: "O primeiro passo no atendimento a um sinistro de trânsito é a sinalização da via (uso de triângulo, pisca-alerta e galhos, se necessário) para evitar novos acidentes. Em seguida, aciona-se o socorro especializado (1193 Bombeiros, 192 SAMU ou 190 Polícia).",
        tip: "Sinalizar e proteger a cena é a regra nº 1.",
        incidence: "altissima",
        difficulty: 3
    },
    {
        id: "q15",
        category: "prioridade",
        statement: "Você se aproxima de uma rotatória urbana sem sinalização específica e nota outro veículo já circulando por ela. De quem é a preferência de passagem segundo o CTB?",
        options: ["Do veículo que já estiver circulando pela rotatória.", "Do veículo que vier pela via de maior fluxo, mesmo que ainda fora da rotatória.", "Do condutor que acelerar primeiro para ingressar no trecho circular.", "Do veículo que se aproximar pela esquerda do condutor que já circula."],
        correctIndex: 0,
        explanation: "Correta a opção 1: em rotatórias não sinalizadas, a preferência de passagem é de quem já está circulando por ela, conforme o art. 29, III, 'b' do CTB.",
        detailedExplanation: "Na ausência de sinalização específica de preferência, no caso de rotatória, a prioridade de passagem pertence ao veículo que já estiver em circulação no anel viário.",
        legalBase: "Art. 29, III, 'b' do CTB",
        commonMistake: "Confundir a regra geral da direita com a regra específica de rotatórias.",
        tip: "Na rotatória sem placa: quem já está dentro tem a preferência.",
        incidence: "altissima",
        trap: true,
        difficulty: 3
    },
    {
        id: "q16",
        category: "direcao-defensiva",
        statement: "A direção defensiva fundamenta-se em elementos básicos para a condução segura. Assinale a alternativa que NÃO representa uma atitude defensiva do condutor:",
        options: ["Buscar conhecimento atualizado sobre as normas de circulação e o funcionamento do veículo.", "Exercer a previsão, antecipando potenciais situações de risco no trânsito.", "Confiar na sua habilidade técnica para exceder os limites de velocidade da via sem risco.", "Tomar decisões rápidas e conscientes voltadas para a segurança em momentos de emergência."],
        correctIndex: 2,
        explanation: "Correta a opção 3: a habilidade técnica jamais justifica descumprir limites de velocidade ou normas de trânsito.",
        detailedExplanation: "Os pilares da direção defensiva (Conhecimento, Atenção, Previsão, Decisão e Habilidade) devem atuar juntos em prol da segurança. Superestimar a habilidade para cometer infrações ou exceder limites é uma conduta de alto risco.",
        commonMistake: "Atentar para o termo 'NÃO' no enunciado para não assinalar um pilar correto.",
        incidence: "alta",
        trap: true,
        difficulty: 3
    },
    {
        id: "q17",
        category: "legislacao",
        statement: "O uso do cinto de segurança é regido pelo CTB para condutores e passageiros. Sobre essa obrigatoriedade, assinale a afirmativa correta:",
        options: ["É obrigatório apenas para motorista e passageiro do banco dianteiro em rodovias.", "É obrigatório para o condutor e todos os passageiros, em todas as vias do território nacional.", "Pode ser dispensado no banco traseiro caso a criança esteja acompanhada de adulto responsável.", "Não gera autuação caso o passageiro do banco traseiro se recuse a utilizar o equipamento."],
        correctIndex: 1,
        explanation: "Correta a opção 2: o cinto de segurança é obrigatório para todos os ocupantes do veículo, em qualquer via, conforme o art. 167 do CTB.",
        detailedExplanation: "Deixar de usar o cinto de segurança, ou permitir que o passageiro o faça, é infração GRAVE (5 pontos na CNH e multa), cabendo ao condutor a responsabilidade pela segurança de todos os ocupantes.",
        legalBase: "Art. 167 do CTB",
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "q18",
        category: "meio-ambiente",
        statement: "A condução econômica e ecológica reduz a emissão de poluentes e o consumo de combustível. Qual das condutas abaixo atinge esse objetivo?",
        options: ["Esticar as marchas em rotações muito altas antes de efetuar a troca.", "Manter marchas compatíveis com a velocidade e aceleração constante, evitando frenagens e arrancadas bruscas.", "Descer aclives engrenado em ponto morto e com o motor desligado.", "Adiar a substituição dos filtros de ar e de combustível para economizar peças."],
        correctIndex: 1,
        explanation: "Correta a opção 2: a condução suave e o uso correto da caixa de marchas otimizam o consumo e reduzem poluentes.",
        detailedExplanation: "Manter o motor operando na faixa adequada de rotação, evitar acelerações e frenagens bruscas e manter a manutenção preventiva em dia (troca de filtros e velas) são atitudes que diminuem a emissão de gases nocivos na atmosfera.",
        incidence: "media",
        difficulty: 3
    },
    {
        id: "q19",
        category: "mecanica",
        statement: "O sistema de suspensão do veículo é composto por molas, amortecedores e braços oscilantes. Qual é a principal função desse sistema?",
        options: ["Transmitir a força do motor para as rodas motrizes com o menor atrito possível.", "Absorver os impactos da pista, proporcionando conforto e mantendo os pneus em contato constante com o solo.", "Evitar o aquecimento do sistema de freios durante frenagens prolongadas.", "Garantir o travamento das rodas durante frenagens de emergência."],
        correctIndex: 1,
        explanation: "Correta a opção 2: a suspensão absorve as imperfeições do solo e garante a estabilidade e aderência dos pneus à pista.",
        detailedExplanation: "A função principal da suspensão é manter os pneus em contato com o solo em qualquer imperfeição da pista, garantindo a dirigibilidade, estabilidade nas curvas e o conforto dos ocupantes.",
        incidence: "baixa",
        difficulty: 3
    },
    {
        id: "q20",
        category: "infracoes",
        statement: "Ao conduzir o veículo, o motorista segura ou manuseia o telefone celular para ler uma mensagem. Essa conduta é caracterizada pelo CTB como:",
        options: ["Infração média, com multa e quatro pontos na CNH.", "Infração grave, com multa e retenção do veículo.", "Infração gravíssima, com multa e sete pontos na CNH.", "Infração gravíssima, com multa multiplicada por dez e suspensão do direito de dirigir."],
        correctIndex: 2,
        explanation: "Correta a opção 3: segurar ou manusear telefone celular enquanto dirige é infração gravíssima (7 pontos e multa), conforme o art. 252, parágrafo único do CTB.",
        detailedExplanation: "Dirigir o veículo segurando ou manuseando telefone celular é infração GRAVÍSSIMA. A infração se aplica inclusive em paradas temporárias de sinalização de trânsito ou semáforos.",
        legalBase: "Art. 252, parágrafo único do CTB",
        tip: "Segurar ou manusear celular = Gravíssima (7 pontos).",
        incidence: "altissima",
        difficulty: 3
    },
    {
        id: "q21",
        category: "placas",
        statement: "As placas de indicação orientam os condutores quanto a caminhos, destinos e distâncias. Qual é o padrão de cores das placas que indicam destinos em rodovias?",
        options: ["Fundo amarelo com símbolos e letras pretas.", "Fundo vermelho com símbolos e letras brancas.", "Fundo verde com letras e marcas brancas (ou azul para orientação de serviços).", "Fundo marrom com letras e marcas brancas exclusivamente."],
        correctIndex: 2,
        explanation: "Correta a opção 3: placas de indicação de destino em rodovias utilizam fundo verde com inscrições brancas.",
        detailedExplanation: "Placas com fundo VERDE indicam destinos, saídas e distâncias nas rodovias. Placas AZUIS indicam orientação de serviços e municípios, enquanto placas MARRONS são destinadas a atrativos turísticos.",
        incidence: "media",
        difficulty: 3
    },
    {
        id: "q22",
        category: "legislacao",
        statement: "O Sistema Nacional de Trânsito (SNT) é composto por órgãos normativos, executivos e fiscalizadores. Assinale a alternativa que identifica um órgão EXECUTIVO ESTADUAL de trânsito:",
        options: ["CONTRAN (Conselho Nacional de Trânsito).", "DETRAN (Departamento Estadual de Trânsito).", "JARI (Junta Administrativa de Recursos de Infrações).", "CFC (Centro de Formação de Condutores)."],
        correctIndex: 1,
        explanation: "Correta a opção 2: os DETRANs são os órgãos executivos de trânsito dos Estados e do Distrito Federal.",
        detailedExplanation: "Compete aos DETRANs (órgãos executivos estaduais) realizar a habilitação de condutores, o registro e licenciamento de veículos, além de fiscalizar e aplicar penalidades na sua circunscrição.",
        legalBase: "Arts. 7º e 22 do CTB",
        incidence: "media",
        difficulty: 3
    },
    {
        id: "q23",
        category: "direcao-defensiva",
        statement: "Em caso de chuva intensa, pode ocorrer o fenômeno da aquaplanagem (perda de aderência dos pneus com o solo pela camada de água). Qual é o procedimento correto do condutor ao perceber esse fenômeno?",
        options: ["Pressionar o pedal de freio com força até o travamento das rodas.", "Segurar firmemente o volante, tirar suavemente o pé do acelerador e não virar o volante de forma brusca.", "Girar o volante rapidamente para os lados para expelir a água dos pneus.", "Engatar uma marcha reduzida e acelerar para romper a lâmina de água."],
        correctIndex: 1,
        explanation: "Correta a opção 2: em aquaplanagem, desacelere suavemente e mantenha a direção reta sem pisar no freio bruscamente.",
        detailedExplanation: "Ao aquaplanar, o veículo flutua sobre a água. Pisar no freio ou virar o volante abruptamente fará o veículo rodar assim que as rodas retomarem o contato com o asfalto. A conduta correta é tirar o pé do acelerador, segurar o volante firme e aguardar a reerguida da aderência.",
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "q24",
        category: "primeiros-socorros",
        statement: "Ao prestar auxílio a uma vítima de acidente que apresenta sangramento abundante no braço, qual é a conduta primária recomendada para conter a hemorragia externa?",
        options: ["Aplicar um torniquete com arame ou corda imediatamente acima da ferida.", "Fazer compressão direta sobre o ferimento com um pano limpo ou gaze.", "Lavar o ferimento com água quente e cobrir com pó de café ou produtos caseiros.", "Manter o braço lesionado pendurado abaixo do nível do coração sem pressionar."],
        correctIndex: 1,
        explanation: "Correta a opção 2: a compressão direta com pano ou pano limpo é a conduta padrão inicial para estancar hemorragias externas.",
        detailedExplanation: "A compressão direta sobre o local do sangramento com curativo limpo e pressão firme é o método mais seguro para interromper a perda de sangue antes da chegada do resgate especializado.",
        commonMistake: "Tentar fazer torniquetes improvisados com materiais rígidos/finais (como arames) que causam mutilação e necrose.",
        incidence: "media",
        trap: true,
        difficulty: 3
    },
    {
        id: "q25",
        category: "prioridade",
        statement: "Veículos de emergência (como ambulâncias e viaturas policiais) possuem prerrogativa de livre circulação e estacionamento. Em qual condição essa prioridade é garantida?",
        options: ["Em qualquer situação, pelo simples fato de serem veículos oficiais de emergência.", "Apenas quando estiverem em efetivo serviço de urgência, com os dispositivos de alarme sonoro e iluminação vermelha intermitente acionados.", "Sempre que conduzidos por motoristas socorristas habilitados, independentemente de sirene.", "Apenas quando transitarem em faixas exclusivas de transporte público."],
        correctIndex: 1,
        explanation: "Correta a opção 2: a prioridade e a livre circulação só se aplicam em efetivo serviço de urgência e com os alarmes (sonoro e luminoso) devidamente acionados, conforme o art. 29, VII do CTB.",
        detailedExplanation: "A iluminação vermelha e a sirene indicam aos demais condutores que o veículo está em prestação de socorro urgente. Sem estes sinais ligados, o veículo deve respeitar todas as regras gerais de trânsito.",
        legalBase: "Art. 29, VII do CTB",
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "p1",
        category: "placas",
        statement: "Ao se aproximar de um cruzamento sem semáforo, o condutor visualiza a placa R-1 (Parada Obrigatória). Qual é o comportamento exigido pelo CTB?",
        options: ["Reduzir a velocidade e cruzar se não houver outros veículos na via preferencial.", "Parar totalmente o veículo antes de entrar na via, observar o trânsito e avançar somente com segurança.", "Buzinar para alertar outros condutores e manter a velocidade.", "Parar apenas se houver pedestres efetuando a travessia na faixa."],
        correctIndex: 1,
        explanation: "Correta a opção 2: a placa R-1 exige a imobilização total do veículo antes da entrada na via ou cruzamento.",
        detailedExplanation: "A placa R-1 (Parada Obrigatória) exige que o condutor imobilize completamente o veículo antes da linha de retenção ou da entrada da interseção. Não imobilizar o veículo é infração GRAVÍSSIMA (Art. 208 do CTB).",
        legalBase: "Art. 208 do CTB",
        tip: "R-1 exige imobilização COMPLETA do veículo, mesmo com a via livre.",
        incidence: "altissima",
        difficulty: 1,
        placa: "R-1"
    },
    {
        id: "p2",
        category: "placas",
        statement: "Diante da placa de regulamentação R-2 (Dê a Preferência), em formato de triângulo invertido, qual deve ser a atitude do condutor?",
        options: ["Parar obrigatoriamente o veículo, de forma idêntica à placa R-1.", "Reduzir a velocidade, ceder a passagem aos veículos que transitam pela via preferencial e prosseguir com segurança.", "Acelerar para ingressar na via antes dos veículos que nela transitam.", "Ignorar a placa caso esteja trafegando dentro do limite de velocidade."],
        correctIndex: 1,
        explanation: "Correta a opção 2: a placa R-2 exige redução de velocidade e preferência aos veículos da via cruzante, sem obrigatoriedade de parada total se a via estiver livre.",
        detailedExplanation: "Diferente da placa R-1 (que exige imobilização total), a placa R-2 exige que o condutor diminua a marcha ou pare, se necessário, para dar passagem aos veículos da via preferencial.",
        commonMistake: "Confundir R-2 (Dê a preferência) com R-1 (Parada Obrigatória).",
        incidence: "altissima",
        trap: true,
        difficulty: 1,
        placa: "R-2"
    },
    {
        id: "p3",
        category: "placas",
        statement: "Condutor procura vaga em via central e vê placa R-6a no poste. Qual é a diferença entre parada e estacionamento imposta por essa placa?",
        options: ["Proíbe qualquer imobilização, inclusive parada rápida para embarque de passageiro.", "Proíbe estacionar, mas permite parada breve para embarque e desembarque.", "Proíbe estacionar só à noite, liberando a vaga durante o dia para todos.", "Permite estacionar só do lado esquerdo da pista, no sentido da circulação."],
        correctIndex: 1,
        explanation: "Correta a segunda: R-6a proíbe estacionar, mas admite parada rápida; estacionar ali é infração média.",
        detailedExplanation: "A placa R-6a proíbe ESTACIONAR (deixar o carro parado por tempo superior ao necessário para embarque/desembarque). Permite-se a parada breve estritamente para entrada ou saída de passageiros. Estacionar em local proibido por sinalização é infração média (4 pontos e remoção do veículo).",
        legalBase: "Art. 181, XVIII do CTB",
        commonMistake: "Muita gente confunde com a R-6b, que proíbe parar e estacionar, mas essa só proíbe ESTACIONAR.",
        tip: "Placa com E cortado por uma tarja = Proibido Estacionar (parada rápida permitida).",
        incidence: "altissima",
        difficulty: 1,
        placa: "R-6a"
    },
    {
        id: "p4",
        category: "placas",
        statement: "Em via urbana há trecho com R-6a e outro com R-6b. Se a primeira proíbe só estacionar, o que a placa R-6b impõe ao condutor?",
        options: ["A mesma regra da R-6a, proibindo só o estacionamento por tempo prolongado.", "Proibição de parar e estacionar, incluindo parada breve para embarque.", "Proibição válida só para caminhões e ônibus, liberando carros de passeio.", "Proibição de estacionar só de madrugada, liberando parada breve de dia."],
        correctIndex: 1,
        explanation: "Correta a segunda: R-6b é mais rígida e proíbe parar e estacionar; até embarque rápido é infração grave.",
        detailedExplanation: "A placa R-6b (com duas tarjas cruzadas formando um 'X') proíbe tanto o ESTACIONAMENTO quanto a PARADA temporária. Nenhuma imobilização é permitida no local, nem mesmo para embarque e desembarque rápido.",
        legalBase: "Art. 181, XIX do CTB",
        commonMistake: "Achar que a tarja dupla (X) tem a mesma regra da tarja simples.",
        tip: "Placa com 'X' = Proibido Parar e Estacionar.",
        incidence: "alta",
        difficulty: 2,
        placa: "R-6b"
    },
    {
        id: "p5",
        category: "placas",
        statement: "Condutor trafega em via arterial e passa do limite indicado na placa R-19. Como o CTB classifica o excesso de velocidade pelo percentual acima do limite?",
        options: ["Só advertência escrita do agente, sem multa ou ponto, na primeira vez ocorrida.", "Média até vinte por cento, grave de vinte a cinquenta e gravíssima acima de cinquenta.", "Multa de valor único e fixo, seja qual for o percentual acima do limite.", "Apreensão do veículo em qualquer excesso, mesmo mínimo, durante a abordagem."],
        correctIndex: 1,
        explanation: "Correta a segunda: art. 218, CTB: até 20% é média, de 20% a 50% é grave e acima de 50% é gravíssima com suspensão.",
        detailedExplanation: "Transitar em velocidade superior à máxima permitida indicada na placa R-19 gera enquadramentos distintos: até 20% acima do limite = infração MÉDIA (4 pontos); de 20% até 50% acima = infração GRAVE (5 pontos); acima de 50% = infração GRAVÍSSIMA (7 pontos, multa multiplicada por 3 e suspensão do direito de dirigir).",
        legalBase: "Art. 218 do CTB",
        commonMistake: "Confundir os limites percentuais de enquadramento da infração.",
        incidence: "alta",
        trap: true,
        difficulty: 1,
        placa: "R-19"
    },
    {
        id: "p6",
        category: "placas",
        statement: "Em estrada serrana estreita em declive, o condutor vê placa A-1a antes de curva fechada à esquerda. Qual conduta adotar ainda antes da curva?",
        options: ["Acelerar para sair logo do trecho sinuoso e reduzir o tempo exposto ao risco.", "Manter a mesma velocidade, pois a placa amarela só descreve o traçado da pista.", "Reduzir aos poucos antes da curva, sem frear forte dentro dela.", "Abrir a curva invadindo a contramão para fazer traçado mais suave e rápido."],
        correctIndex: 2,
        explanation: "Correta a terceira: A-1a avisa curva acentuada à esquerda; reduza antes e evite freada brusca nela.",
        detailedExplanation: "A placa A-1a é uma sinalização de advertência que alerta para 'Curva acentuada à esquerda'. A atitude defensiva correta é reduzir a velocidade antecipadamente (usando o freio antes de entrar na curva) e contorná-la acelerando suavemente para manter a estabilidade do veículo.",
        tip: "Reduza a velocidade antes de entrar na curva, nunca dentro dela.",
        incidence: "alta",
        difficulty: 1,
        placa: "A-1a",
        image_url: "https://tqeqsotsasglmhlmwdwy.supabase.co/storage/v1/object/public/library/images/placa-A-1a.png"
    },
    {
        id: "p7",
        category: "placas",
        statement: "Perto de trecho com muito pedestre, o condutor vê placa A-32b no canteiro. O que essa advertência anuncia sobre a pista adiante?",
        options: ["Área escolar próxima, exigindo cuidado máximo só na entrada e saída de alunos.", "Passagem sinalizada de pedestres à frente, exigindo reduzir e preparar para parar.", "Travessia proibida para pedestres, permitindo manter a velocidade de cruzeiro.", "Travessia de animais silvestres na pista, comum em estrada rural de baixa visão."],
        correctIndex: 1,
        explanation: "Correta a segunda: A-32b avisa faixa de pedestres à frente; reduza e ceda a travessia.",
        detailedExplanation: "A placa A-32b adverte o condutor sobre a existência de 'Passagem sinalizada de pedestres' adiante. O motorista deve diminuir a velocidade e estar preparado para dar preferência e imobilizar o veículo se houver pedestres iniciando ou efetuando a travessia.",
        commonMistake: "Confundir com A-33a (Área escolar) ou A-32a (Pedestres).",
        incidence: "alta",
        difficulty: 2,
        placa: "A-32b",
        image_url: "https://tqeqsotsasglmhlmwdwy.supabase.co/storage/v1/object/public/library/images/placa-passagem-sinalizada-de-pedestres-A32b.webp"
    },
    {
        id: "p8",
        category: "placas",
        statement: "Em via junto à escola, em horário de entrada, o condutor vê placa A-33a. Diante de crianças na calçada, qual é a conduta defensiva correta?",
        options: ["Manter a velocidade, pois a placa amarela só informa que há escola por perto.", "Reduzir, redobrar atenção e ficar pronto para parar diante de criança.", "Entender a via como fechada para carros em todo período de aula e desviar.", "Parar sempre o veículo, mesmo sem nenhum pedestre na faixa ou calçada."],
        correctIndex: 1,
        explanation: "Correta a segunda: A-33a alerta área escolar; crianças são imprevisíveis, reduza e prepare-se para parar.",
        detailedExplanation: "A placa A-33a alerta sobre 'Área escolar'. Devido ao comportamento imprevisível de crianças, a atitude defensiva exige redução imediata da velocidade, atenção redobrada e prontidão para parar o veículo a qualquer momento.",
        incidence: "media",
        difficulty: 1,
        placa: "A-33a",
        image_url: "https://tqeqsotsasglmhlmwdwy.supabase.co/storage/v1/object/public/library/images/placa-area-escolar-A-33A.webp"
    },
    {
        id: "p9",
        category: "placas",
        statement: "Em interseção urbana, o condutor vê placa R-25d de fundo azul que define a trajetória. O que essa regulamentação impõe naquele ponto?",
        options: ["Parar o veículo no local, podendo depois converter à direita ou à esquerda.", "Seguir em frente, ficando proibido converter à direita ou à esquerda.", "Não ultrapassar no trecho, podendo apenas mudar de faixa se preciso.", "Não estacionar no trecho, ficando liberada qualquer conversão na interseção."],
        correctIndex: 1,
        explanation: "Correta a segunda: placa azul de sentido de circulação/movimento obrigatório; na R-25d siga em frente, sem converter.",
        detailedExplanation: "As placas de regulamentação com fundo azul e seta branca (como a R-25d) indicam as direções e movimentos permitidos/obrigatórios na faixa ou via. A indicação de seguir em frente obriga o condutor a manter a trajetória sem realizar conversões.",
        tip: "Seta reta em fundo azul = Movimento obrigatório de seguir em frente.",
        incidence: "media",
        difficulty: 2,
        placa: "R-25d"
    },
    {
        id: "p10",
        category: "placas",
        statement: "Em bairro comercial, o condutor vê placa azul com símbolo de hospital. Pela classificação do CTB, o que essa sinalização vertical informa?",
        options: ["Posto de combustível à frente, como serviço auxiliar de apoio na rodovia.", "Hospital próximo, como placa de indicação apenas informativa, sem impor conduta.", "Via bloqueada por emergência do hospital, exigindo desvio imediato do trajeto.", "Dever de parar e aguardar ordem de funcionário do hospital para passar."],
        correctIndex: 1,
        explanation: "Correta a segunda: placa azul de indicação/serviço auxiliar informa serviço próximo, sem criar proibição ou obrigação.",
        detailedExplanation: "Placas com fundo azul identificando serviços (como hospitais, postos de combustível e pronto-socorro) pertencem ao grupo das Placas de Indicação / Serviços Auxiliares. Elas têm caráter informativo e não impõem proibições nem obrigações diretas.",
        incidence: "media",
        difficulty: 1,
        placa: "I-Hospital"
    },
    {
        id: "q26",
        category: "legislacao",
        statement: "Candidato quer habilitação nas categorias A e B para moto e carro. Quais são idade mínima e exigências previstas no CTB para obter a permissão?",
        options: ["Dezesseis anos, desde que emancipado e com autorização dos pais em cartório.", "Dezessete anos, com aprovação em teste de maturidade aplicado pelo DETRAN.", "Dezoito anos, saber ler e escrever, ter documento e CPF e passar nos exames.", "Vinte e um anos, idade mínima única exigida para todas as categorias."],
        correctIndex: 2,
        explanation: "Correta a terceira: para A e B, dezoito anos, saber ler e escrever, RG e CPF e ser penalmente imputável, nos termos do art. 140 do CTB.",
        detailedExplanation: "Para a obtenção da Permissão para Dirigir (PPD), o art. 140 do CTB exige que o candidato seja penalmente imputável (ter 18 anos completos), saiba ler e escrever e possua Carteira de Identidade (RG) e CPF.",
        legalBase: "Art. 140 do CTB",
        incidence: "alta",
        difficulty: 1
    },
    {
        id: "q27",
        category: "legislacao",
        statement: "Condutor com categoria B quer passar para D para dirigir ônibus e van escolar. Quais idade, tempo de habilitação e histórico o CTB exige?",
        options: ["Dezoito anos e um ano de categoria B, sem verificar pontos ou infrações anteriores.", "Vinte e um anos, dois anos de B ou um de C e não ter cometido infração grave ou gravíssima nos últimos doze meses.", "Só pagar taxas e mostrar comprovante de casa, sem exame médico ou curso.", "Vinte e cinco anos e diploma superior, exigido para transporte coletivo de passageiro."],
        correctIndex: 1,
        explanation: "Correta a segunda: para D, vinte e um anos, dois de B ou um de C e não ter infração grave ou gravíssima nem ser reincidente em médias nos últimos 12 meses (art. 145 do CTB).",
        detailedExplanation: "Para habilitar-se na categoria D (ônibus, vans e transporte de passageiros com mais de 8 lugares), o condutor deve ter no mínimo 21 anos, estar habilitado há pelo menos 2 anos na categoria B ou há 1 ano na C, e não ter cometido NENHUMA infração grave ou gravíssima, nem ser reincidente em infrações médias nos últimos 12 meses.",
        legalBase: "Art. 145 do CTB",
        incidence: "media",
        difficulty: 2
    },
    {
        id: "q28",
        category: "legislacao",
        statement: "DETRAN vê no prontuário a mesma infração repetida em menos de doze meses. Quando o CTB considera reincidência para aplicação de penalidade específica?",
        options: ["Quando comete duas infrações diferentes, em dias diferentes, ainda que distintas.", "Quando repete a mesma infração no período de doze meses.", "Quando soma pontos suficientes para abrir processo de suspensão da habilitação.", "Quando a primeira multa foi em outro estado, diferente do estado da habilitação."],
        correctIndex: 1,
        explanation: "Correta a segunda: reincidência ocorre ao cometer novamente a mesma infração no período de 12 meses.",
        detailedExplanation: "Dá-se a reincidência no trânsito quando o condutor comete a mesma infração (mesmo enquadramento legal) no período de 12 meses. Algumas infrações preveem a duplicação do valor da multa ou suspensão em caso de reincidência específica.",
        legalBase: "Art. 259, § 1º e artigos específicos do CTB",
        incidence: "media",
        difficulty: 2
    },
    {
        id: "q29",
        category: "legislacao",
        statement: "Condutor sem nenhuma infração gravíssima nos últimos doze meses deseja saber com quantos pontos a CNH será suspensa pela regra atual do CTB:",
        options: ["20 pontos em doze meses, independentemente da gravidade das infrações registradas no período.", "40 pontos sem gravíssima, 30 pontos com uma gravíssima e 20 pontos com duas ou mais gravíssimas.", "14 pontos em doze meses para qualquer condutor, sem distinção de categoria ou tipo de infração.", "Suspensão apenas se cometer infração gravíssima, sem aplicação de limite de pontos nos demais casos."],
        correctIndex: 1,
        explanation: "Correta a opção 2: o art. 261 do CTB estabelece a escala de 40 pontos (sem gravíssima), 30 pontos (1 gravíssima) e 20 pontos (2 ou mais gravíssimas).",
        detailedExplanation: "Com a alteração promovida pela Lei 14.071/2020, o limite de pontos no período de 12 meses para suspensão do direito de dirigir passou a ser gradativo: 40 pontos (se não constar infração gravíssima); 30 pontos (se constar 1 infração gravíssima); e 20 pontos (se constarem 2 ou mais infrações gravíssimas). Para condutores que exercem atividade remunerada (EAR), o limite é fixo em 40 pontos, independentemente da gravidade.",
        legalBase: "Art. 261, I do CTB (redação pela Lei 14.071/2020)",
        commonMistake: "Acreditar que o limite único de 20 pontos ainda se aplica para todos sem distinção de gravíssimas.",
        tip: "Sem gravíssima = 40 pontos. Com 1 gravíssima = 30. Com 2+ gravíssimas = 20.",
        incidence: "altissima",
        trap: true,
        difficulty: 3
    },
    {
        id: "q30",
        category: "legislacao",
        statement: "Durante fiscalização em via urbana, o agente solicita os documentos do condutor e do veículo para verificar a regularidade da circulação. Deve ser apresentado:",
        options: ["CNH ou PPD e CRLV-e do veículo, admitidos também em formato digital pelo aplicativo oficial.", "Somente o CRLV-e do veículo, pois a habilitação do condutor já consta automaticamente no sistema.", "Somente a CNH do condutor, pois o licenciamento do veículo já consta automaticamente no sistema.", "CRLV-e do veículo e comprovante impresso do IPVA, sem necessidade de apresentar a CNH."],
        correctIndex: 0,
        explanation: "Correta a opção 1: o art. 159 do CTB determina o porte obrigatório da CNH/PPD e do CRLV, aceitos em formato físico ou digital (Carteira Digital de Trânsito).",
        detailedExplanation: "São documentos de porte obrigatório para a condução de veículo automotor a Carteira Nacional de Habilitação (CNH) ou Permissão para Dirigir (PPD) e o Certificado de Registro e Licenciamento do Veículo (CRLV). Ambos têm validade jurídica no formato digital via aplicativo oficial.",
        legalBase: "Art. 159 e Art. 232 do CTB",
        incidence: "alta",
        difficulty: 1
    },
    {
        id: "q31",
        category: "infracoes",
        statement: "Em fiscalização de estacionamento, o agente encontra veículo sem credencial exposta ocupando vaga reservada à pessoa com deficiência. Essa conduta configura infração:",
        options: ["Leve, punida apenas com advertência oral e sem registro de pontos na CNH.", "Média, punida com multa e 4 pontos, sem aplicação de medida administrativa.", "Grave, punida com multa e 5 pontos, passível de conversão em advertência escrita.", "Gravíssima, punida com multa, 7 pontos e remoção do veículo do local."],
        correctIndex: 3,
        explanation: "Correta a opção 4: o art. 181, XX do CTB estabelece infração gravíssima, 7 pontos e remoção do veículo para estacionamento indevido em vaga reservada.",
        detailedExplanation: "Estacionar o veículo nas vagas reservadas às pessoas com deficiência ou idosos, sem a credencial que comprove tal condição exposta no painel, é infração GRAVÍSSIMA (7 pontos na CNH, multa de R$ 293,47 e medida administrativa de remoção do veículo).",
        legalBase: "Art. 181, XX do CTB",
        incidence: "alta",
        difficulty: 1
    },
    {
        id: "q32",
        category: "infracoes",
        statement: "Agente aborda condutor que nunca obteve habilitação e dirige sem CNH e sem PPD em via pública. Essa conduta configura infração:",
        options: ["Leve, punida com advertência escrita na primeira ocorrência registrada.", "Média, punida com multa e 4 pontos, permitindo ao condutor seguir viagem.", "Grave, punida com multa e 5 pontos, sem retenção do veículo abordado.", "Gravíssima, punida com multa multiplicada por 3 e retenção do veículo."],
        correctIndex: 3,
        explanation: "Correta a opção 4: dirigir sem possuir CNH ou PPD é infração gravíssima com multa (três vezes) e retenção do veículo (art. 162, I do CTB).",
        detailedExplanation: "Dirigir veículo sem possuir Carteira Nacional de Habilitação, Permissão para Dirigir ou Autorização para Conduzir Ciclomotor é infração GRAVÍSSIMA, punida com multa multiplicada por 3 e medida administrativa de retenção do veículo até a apresentação de condutor habilitado.",
        legalBase: "Art. 162, I do CTB",
        incidence: "alta",
        difficulty: 1
    },
    {
        id: "q33",
        category: "infracoes",
        statement: "Em blitz, o agente verifica criança de 6 anos no banco dianteiro, sem cadeirinha nem outro dispositivo de retenção adequado. Essa conduta configura infração:",
        options: ["Leve, punida com multa e registro de 3 pontos na CNH do condutor.", "Média, punida com multa e registro de 4 pontos na CNH do condutor.", "Grave, punida com multa e registro de 5 pontos na CNH do condutor.", "Gravíssima, punida com multa e registro de 7 pontos na CNH do condutor."],
        correctIndex: 3,
        explanation: "Correta a opção 4: o transporte irregular de crianças é infração gravíssima (7 pontos) e retenção do veículo (art. 168 do CTB).",
        detailedExplanation: "Transportar crianças sem observância das normas de segurança estabelecidas pelo CTB e Resoluções do CONTRAN (menores de 10 anos que não tenham atingido 1,45m de altura devem ir no banco traseiro com dispositivo adequado) é infração GRAVÍSSIMA, com 7 pontos na CNH e retenção do veículo até a regularização.",
        legalBase: "Art. 168 do CTB / Resolução CONTRAN nº 819/2021",
        commonMistake: "Achar que o transporte incorreto de criança é infração grave por ser no interior do veículo.",
        incidence: "alta",
        trap: true,
        difficulty: 2
    },
    {
        id: "q34",
        category: "infracoes",
        statement: "Dois condutores disputam arrancada brusca (racha) em avenida movimentada, colocando pedestres e demais veículos em risco. Essa conduta configura:",
        options: ["Infração média, punida com multa e registro de 4 pontos na CNH.", "Infração grave, punida com multa e registro de 5 pontos na CNH.", "Infração gravíssima com multa multiplicada por 10, suspensão da CNH e crime de trânsito.", "Advertência verbal, desde que os condutores cessem a disputa imediatamente."],
        correctIndex: 2,
        explanation: "Correta a opção 3: disputar corrida ('racha') é infração gravíssima x10, suspensão da CNH, recolhimento do documento e crime de trânsito (arts. 173 e 308 do CTB).",
        detailedExplanation: "Disputar corrida por espírito de emulação ('racha') é infração GRAVÍSSIMA, com multa multiplicada por 10, suspensão do direito de dirigir, apreensão/recolhimento do documento. Além da sanção administrativa, configura crime de trânsito capitulado no art. 308 do CTB.",
        legalBase: "Arts. 173 e 308 do CTB",
        incidence: "media",
        difficulty: 1
    },
    {
        id: "q35",
        category: "direcao-defensiva",
        statement: "Antes de mudar de faixa, o condutor olha os retrovisores e ainda gira a cabeça, pois há regiões laterais que os espelhos não alcançam. Essas regiões são chamadas de:",
        options: ["Pontos cegos, delimitados pelas colunas do veículo e que exigem olhar por cima do ombro.", "Cantos internos escuros do habitáculo, formados pela sombra do teto sobre o painel.", "Pontos de desgaste da banda de rodagem, visíveis apenas com o pneu desmontado.", "Manchas do para-brisa que reduzem a visão frontal em dias de chuva intensa."],
        correctIndex: 0,
        explanation: "Correta a opção 1: pontos cegos são áreas do entorno do veículo não cobertas pelo campo de visão dos retrovisores.",
        detailedExplanation: "Pontos cegos são as zonas de visibilidade bloqueada pelas colunas do veículo ou fora do alcance do ângulo refletido pelos espelhos retrovisores. Para mitigá-los, o motorista defensivo deve regular corretamente os espelhos e movimentar a cabeça / olhar rapidamente sobre o ombro antes de realizar deslocamentos laterais.",
        incidence: "alta",
        difficulty: 1
    },
    {
        id: "q36",
        category: "direcao-defensiva",
        statement: "Condutor inicia descida de serra longa e íngreme e precisa preservar os freios para não perder a eficiência da frenagem. A forma segura de descer é:",
        options: ["Descer em ponto morto, acionando o freio de serviço em intervalos periódicos.", "Descer desengrenado para economizar combustível durante todo o declive.", "Descer engrenado em marcha reduzida, utilizando o freio-motor para segurar o veículo.", "Manter o pé sobre o pedal de freio durante toda a extensão da descida."],
        correctIndex: 2,
        explanation: "Correta a opção 3: no declive acentuado deve-se utilizar a marcha reduzida (freio-motor) para evitar o superaquecimento dos freios.",
        detailedExplanation: "Ao trafegar em trecho de declive acentuado, o veículo deve transitar engrenado em marcha compatível (reduzida). O efeito do freio-motor evita o uso excessivo e contínuo do freio de serviço, prevenindo o superaquecimento das pastilhas/lonas e a perda de eficiência (fading). Transitar desengrenado em declive é infração média (art. 231, IX do CTB).",
        legalBase: "Art. 231, IX do CTB",
        commonMistake: "Acreditar que descer em ponto morto ('banguela') economiza combustível ou é seguro.",
        incidence: "alta",
        trap: true,
        difficulty: 2,
        group: "freio-motor-declive"
    },
    {
        id: "q37",
        category: "direcao-defensiva",
        statement: "Condutor trafega por rodovia de pista dupla e decide ultrapassar o veículo à frente com segurança, sem surpreender os demais usuários. Antes de sair da faixa, deve:",
        options: ["Transpor diretamente para a faixa da esquerda, sem necessidade de sinalizar a manobra.", "Conferir a visibilidade, sinalizar com a seta, verificar retrovisores e o ponto cego.", "Buzinar de forma contínua até o veículo da frente deslocar-se para a direita.", "Acionar o pisca-alerta e aguardar o veículo precedente parar no acostamento."],
        correctIndex: 1,
        explanation: "Correta a opção 2: a ultrapassagem exige checagem de espaço, retrovisores, sinalização por luz indicadora de direção e ponto cego.",
        detailedExplanation: "A ultrapassagem é uma das manobras de maior risco no trânsito. O condutor defensivo deve certificar-se de que a pista está livre, conferir o retrovisor e ponto cego, acionar a seta antecedente para indicar a intenção, realizar a manobra com margem segura e sinalizar o retorno à faixa de origem.",
        incidence: "alta",
        difficulty: 1
    },
    {
        id: "q38",
        category: "direcao-defensiva",
        statement: "Condutor pretende ultrapassar em rodovia e observa a sinalização e o traçado da via para saber se a manobra é permitida. A ultrapassagem é proibida em:",
        options: ["Reta com faixa tracejada e ampla visibilidade para ambos os sentidos da via.", "Ponte, viaduto, túnel, curva, aclive sem visibilidade e local com faixa contínua.", "Qualquer rodovia federal, independentemente da sinalização horizontal existente.", "Período diurno, sempre que o fluxo do sentido contrário estiver intenso."],
        correctIndex: 1,
        explanation: "Correta a opção 2: o art. 203 do CTB veda expressamente a ultrapassagem em curvas, aclives sem visibilidade, pontes, viadutos, túneis e faixas contínuas.",
        detailedExplanation: "É vedado ultrapassar nos trechos de vias com pista única e duplo sentido de circulação onde haja linha dupla ou simples contínua amarela, bem como nas curvas, aclives sem visibilidade, pontes, viadutos, túneis, travessias de pedestres e interseções. Trata-se de infração GRAVÍSSIMA multiplicada por 5.",
        legalBase: "Art. 203 do CTB",
        incidence: "alta",
        difficulty: 1
    },
    {
        id: "q39",
        category: "primeiros-socorros",
        statement: "Após queda de motocicleta, a vítima apresenta deformidade no braço com suspeita de fratura e aguarda o resgate no local. A conduta correta é:",
        options: ["Tentar recolocar o osso na posição original para aliviar a dor da vítima.", "Imobilizar o membro na posição encontrada, sem movimentar, aguardando o socorro.", "Movimentar o braço em várias direções para avaliar a extensão da fratura.", "Massagear a região lesionada para estimular a circulação do membro."],
        correctIndex: 1,
        explanation: "Correta a opção 2: em suspeita de fratura, o membro deve ser imobilizado na posição em que se encontra, sem manobras de redução.",
        detailedExplanation: "Diante de fraturas expostas ou fechadas, o socorrista leigo nunca deve tentar alinhar, tracionar ou reduzir o osso fraturado. O membro deve ser mantido imóvel e apoiado/fixado na posição encontrada até a chegada do atendimento pré-hospitalar especializado para evitar lesões musculares ou vasculares adicionais.",
        incidence: "media",
        difficulty: 2
    },
    {
        id: "q40",
        category: "primeiros-socorros",
        statement: "Vítima caída após colisão precisa de atendimento médico urgente e testemunhas discutem qual número chamar para socorro rápido. O número correto do socorro médico é:",
        options: ["190, número da Polícia Militar para ocorrências policiais e de segurança.", "192, número do SAMU para atendimento médico de urgência e emergência.", "193, número do Corpo de Bombeiros para incêndios e resgates diversos.", "199, número da Defesa Civil para desastres e calamidades públicas."],
        correctIndex: 1,
        explanation: "Correta a opção 2: o telefone 192 pertence ao SAMU (Serviço de Atendimento Móvel de Urgência), responsável pelo atendimento médico pré-hospitalar.",
        detailedExplanation: "Para socorro médico de urgência e emergência clínica/traumática, deve-se acionar o SAMU pelo número 192. O Corpo de Bombeiros (193) atua prioritariamente no resgate de vítimas presas em ferragens ou locais de difícil acesso, e a Polícia Militar (190) na garantia da segurança do local.",
        tip: "SAMU = 192 | Bombeiros = 193 | Polícia Militar = 190 | PRF = 191.",
        incidence: "alta",
        difficulty: 1
    },
    {
        id: "q41",
        category: "primeiros-socorros",
        statement: "Vítima sofreu queimadura de segundo grau com formação de bolhas e o socorrista improvisado sugere receitas caseiras. O socorrista NÃO deve:",
        options: ["Aplicar água corrente limpa em temperatura ambiente sobre a lesão.", "Cobrir a lesão com pano limpo ou gaze umedecida até o atendimento.", "Passar pasta de dentes, manteiga ou pomada caseira sobre as bolhas.", "Encaminhar a vítima para avaliação por médico especializado."],
        correctIndex: 2,
        explanation: "Correta a opção 3: nunca se deve aplicar produtos caseiros (pasta de dente, manteiga, borra de café) nem furar bolhas em queimaduras.",
        detailedExplanation: "No atendimento inicial a queimaduras, é expressamente contraindicado aplicar substâncias caseiras ou produtos não estéreis (como pasta de dente, açúcar, gordura ou borra de café), pois aumentam o risco de contaminação e infecção grave, além de dificultar o tratamento hospitalar. A conduta adequada é resfriar o local com água corrente em abundância e cobrir com pano limpo e seco.",
        incidence: "media",
        trap: true,
        difficulty: 1
    },
    {
        id: "q42",
        category: "primeiros-socorros",
        statement: "Condutor encontra vítima inconsciente, sem respiração espontânea, caída na pista após atropelamento e sem socorro no local. A conduta imediata é:",
        options: ["Aguardar passivamente a chegada do resgate, sem tocar na vítima.", "Iniciar compressões torácicas da RCP no centro do peito, de 100 a 120 por minuto.", "Oferecer pequenos goles de água para estimular a deglutição da vítima.", "Sacudir vigorosamente os ombros da vítima até ela recobrar a consciência."],
        correctIndex: 1,
        explanation: "Correta a opção 2: em parada cardiorrespiratória (vítima inconsciente e sem respirar), deve-se iniciar imediatamente a RCP com compressões torácicas continuas.",
        detailedExplanation: "Ao constatar que a vítima está inconsciente e não respira (ou apenas apresenta respiração anômala / gasping), após chamar o resgate emergencial (192 ou 193), deve-se iniciar imediatamente as compressões torácicas no centro do tórax na frequência de 100 a 120 compressões por minuto, afundando o tórax cerca de 5 a 6 cm.",
        incidence: "alta",
        difficulty: 2
    },
    {
        id: "q43",
        category: "meio-ambiente",
        statement: "Condutor trafega em área urbana e sente vontade de usar a buzina para cumprimentar pedestres e chamar atenção. Pelo CTB, o uso correto da buzina é:",
        options: ["Livre a qualquer hora do dia ou da noite, como direito do condutor.", "Toques curtos apenas para alertar perigo imediato, vedado o uso prolongado.", "Para cumprimentar pedestres que circulam pela calçada próxima ao veículo.", "À frente de hospitais e escolas, desde que em baixa velocidade."],
        correctIndex: 1,
        explanation: "Correta a opção 2: o art. 227 do CTB proíbe o uso da buzina de forma prolongada, devendo ser utilizada apenas em toques curtos para advertência necessária.",
        detailedExplanation: "A buzina só deve ser acionada em toques curtos e estritamente em duas situações: para advertir outros usuários sobre situações de perigo iminente ou fora das áreas urbanas quando for necessário advertir um condutor que se tem o propósito de ultrapassá-lo. É proibido buzinar entre 22h e 6h, ou em locais sinalizados com a placa R-20 (Proibido acionar buzina ou sinal sonoro).",
        legalBase: "Art. 227 do CTB",
        incidence: "media",
        difficulty: 1
    },
    {
        id: "q44",
        category: "meio-ambiente",
        statement: "Passageiro arremessa lata pela janela do veículo em movimento e o condutor nada faz para impedir. Essa conduta configura infração:",
        options: ["Leve, punida apenas com advertência escrita, sem registro de pontos.", "Média, punida com multa e 4 pontos, respondendo o condutor pelo ato.", "Grave, punida com multa, pontos e suspensão do licenciamento do veículo.", "Gravíssima, punida com multa multiplicada por 3 e remoção do veículo."],
        correctIndex: 1,
        explanation: "Correta a opção 2: atirar do veículo ou abandonar na via objetos ou substâncias é infração média (4 pontos na CNH), conforme o art. 172 do CTB.",
        detailedExplanation: "Atirar do veículo ou abandonar na via pública qualquer tipo de objeto ou substância é infração MÉDIA (4 pontos e multa de R$ 130,16). O condutor responde administrativamente pelas infrações cometidas no veículo.",
        legalBase: "Art. 172 do CTB",
        incidence: "media",
        difficulty: 1
    },
    {
        id: "q45",
        category: "mecanica",
        statement: "Condutor percebe desgaste irregular e aumento do consumo e suspeita de pneus descalibrados antes de viajar. O intervalo correto para conferir a pressão é:",
        options: ["Uma vez por ano, junto com a troca de óleo programada do motor.", "A cada 15 dias e antes de viagens longas, sempre com os pneus frios.", "Somente quando o veículo começar a puxar para um dos lados.", "Apenas antes de percorrer trajeto em rodovia pavimentada."],
        correctIndex: 1,
        explanation: "Correta a opção 2: a calibragem dos pneus deve ser realizada quinzenalmente e antes de viagens, sempre com os pneus frios.",
        detailedExplanation: "A verificação e calibragem da pressão dos pneus deve ocorrer quinzenalmente e obrigatoriamente antes de viagens longas, seguindo as especificações do fabricante no manual do proprietário. A medição deve ser feita com os pneus frios (com rodagem inferior a 3 km), pois o aquecimento expande o ar interno e altera a medição correta da pressão.",
        incidence: "media",
        difficulty: 1
    },
    {
        id: "q46",
        category: "mecanica",
        statement: "Durante revisão dos pneus, o mecânico mostra pequenos ressaltos no fundo das ranhuras da banda de rodagem, indicando o limite legal de uso. Esses ressaltos são chamados de:",
        options: ["Sistemas ABS de frenagem inteligente em pistas molhadas.", "Indicadores TWI (Tread Wear Indicator) de desgaste do pneu.", "Válvulas de alívio do ar de calibragem da câmara interna.", "Amortecedores hidráulicos de impacto no perfil lateral."],
        correctIndex: 1,
        explanation: "Correta a opção 2: os indicadores TWI mostram a profundidade mínima legal de 1,6 mm da banda de rodagem.",
        detailedExplanation: "Os indicadores TWI (Tread Wear Indicator) são pequenos ressaltos de borracha localizados nos sulcos do pneu. Quando a banda de rodagem atinge a altura dessas marcas, significa que o pneu chegou ao limite legal de desgaste (1,6 mm de profundidade). Rodar abaixo dessa marca deixa o pneu 'careca', aumentando drasticamente o risco de aquaplanagem, além de constituir infração grave (Art. 230, XVIII do CTB).",
        legalBase: "Art. 230, XVIII do CTB / Resolução CONTRAN nº 913/2022",
        incidence: "media",
        difficulty: 2
    },
    {
        id: "q47",
        category: "mecanica",
        statement: "Condutor deseja verificar o nível de óleo do motor pela vareta antes de viagem longa, sem cometer erro de leitura. As condições ideais são:",
        options: ["Motor quente e em funcionamento, logo após desligar por alguns segundos.", "Veículo em superfície plana e motor frio ou desligado há alguns minutos.", "Somente em oficina especializada, durante a troca programada do óleo.", "Uma vez por ano, durante a revisão geral do veículo."],
        correctIndex: 1,
        explanation: "Correta a alternativa B, pois terreno plano e motor frio garantem leitura fiel da vareta.",
        detailedExplanation: "Pra ver o nível de óleo do motor, você usa a vareta medidora. Primeiro, pare o carro em um lugar plano, desligue o motor e espere alguns minutinhos pra o óleo descer pro cárter. Depois, retire a vareta, limpe, coloque de volta e tire de novo pra checar se tá entre as marcas de mínimo e máximo.",
        incidence: "baixa",
        difficulty: 1
    },
    {
        id: "q48",
        category: "mecanica",
        statement: "Com o veículo em movimento, o condutor nota acesa no painel a luz vermelha com desenho de bateria. Essa indicação significa:",
        options: ["Falha no sistema de carga, como alternador, correia ou a própria bateria.", "Nível de combustível na reserva, exigindo abastecimento imediato.", "Desgaste das pastilhas de freio, exigindo substituição das peças.", "Pressão irregular dos pneus, exigindo calibragem imediata."],
        correctIndex: 0,
        explanation: "Correta a alternativa A, pois a luz da bateria indica falha na carga, com risco de o veículo parar.",
        detailedExplanation: "A luz da bateria indica que o carro não está carregando direito. Isso pode ser por causa do alternador, da correia ou da própria bateria. Se você ver essa luz, é melhor parar em um lugar seguro e pedir ajuda, porque o carro vai parar quando a bateria acabar.",
        incidence: "media",
        difficulty: 2
    },
    {
        id: "q49",
        category: "prioridade",
        statement: "Em via sem sinalização específica, ambulância em serviço, pedestre, ciclista e carros disputam a passagem. A ordem correta de prioridade é:",
        options: ["Veículos de maior porte primeiro, depois o ciclista e por último o pedestre.", "Ambulância em serviço, depois pedestre, ciclista e por último demais veículos.", "Ordem cronológica de chegada de cada usuário à interseção da via.", "Veículos mais ágeis primeiro, depois bicicleta e por último ambulância."],
        correctIndex: 1,
        explanation: "Correta a alternativa B, pois o art. 29 do CTB prioriza emergência, pedestre, não motorizado e motorizado.",
        detailedExplanation: "Na via, quem tem mais direito é a ambulância com sirene. Depois, os pedestres que estão na faixa, seguidos das bicicletas e, por último, os carros. Essa ordem ajuda a proteger quem está mais vulnerável no trânsito.",
        legalBase: "Art. 29, §2º do CTB",
        incidence: "alta",
        difficulty: 2
    },
    {
        id: "q50",
        category: "legislacao",
        statement: "Condutor trafega por bairro residencial em via local sem nenhuma placa de velocidade e precisa respeitar o limite padrão. Nesse caso, o limite é:",
        options: ["20 km/h, restrito às vias exclusivas de pedestres e áreas de calçadão.", "30 km/h, limite padrão das vias locais sem sinalização específica.", "40 km/h, limite padrão das vias coletoras sem sinalização específica.", "60 km/h, limite padrão das vias arteriais sem sinalização específica."],
        correctIndex: 1,
        explanation: "Correta a alternativa B, pois o art. 61 do CTB fixa 30 km/h para via local sem sinalização.",
        detailedExplanation: "Quando não tem sinalização, o CTB diz que as vias locais, que são mais tranquilas e têm mais pedestres, devem ter limite de 30 km/h. As outras vias têm limites maiores: coletoras 40 km/h, arteriais 60 km/h e trânsito rápido 80 km/h. Lembre-se da sequência: 30, 40, 60, 80.",
        legalBase: "Art. 61 do CTB",
        incidence: "alta",
        difficulty: 2
    },
    {
        id: "q51",
        category: "legislacao",
        statement: "Condutor de automóvel trafega por rodovia de pista dupla sem nenhuma placa de velocidade e quer respeitar o máximo permitido. O limite nesse caso é:",
        options: ["80 km/h, limite aplicado aos demais veículos pesados nessa via.", "100 km/h, máxima prevista para estradas rurais não pavimentadas.", "110 km/h, limite para automóveis, camionetas e motocicletas.", "120 km/h, admitido em rodovias federais concedidas com sinalização própria."],
        correctIndex: 2,
        explanation: "Correta a alternativa C, pois o art. 61 do CTB fixa 110 km/h para automóveis em rodovia de pista dupla.",
        detailedExplanation: "Em rodovias sem placas, os limites são: carro, caminhonete e moto: 110 km/h; ônibus: 90 km/h; e outros veículos: 80 km/h. Em estradas não pavimentadas, o limite é 60 km/h. Lembre-se que em pista simples, os limites caem 10 km/h.",
        legalBase: "Art. 61, §1º do CTB",
        incidence: "alta",
        difficulty: 2
    },
    {
        id: "q52",
        category: "infracoes",
        statement: "Radar registra veículo a 95 km/h em via com limite de 60 km/h, ou seja, mais de 50% acima do permitido. Essa conduta configura infração:",
        options: ["Média, punida com multa simples e registro de 4 pontos na CNH.", "Grave, punida com multa e 5 pontos, com possibilidade de advertência.", "Gravíssima, punida com multa multiplicada por 3, 7 pontos e suspensão imediata.", "Leve, punida com advertência verbal, se não houver dano a terceiros."],
        correctIndex: 2,
        explanation: "Correta a alternativa C, pois o art. 218, inciso III, prevê gravíssima com multa vezes 3 e suspensão acima de 50%.",
        detailedExplanation: "Quando você passa do limite de velocidade, as multas variam: até 20% é média, de 20% a 50% é grave, e acima de 50% é gravíssima. Nesse caso, como o carro estava a 95 km/h em uma via de 60 km/h, a multa é multiplicada por três e a CNH é suspensa na hora, sem precisar de processo.",
        legalBase: "Art. 218, III do CTB",
        incidence: "alta",
        difficulty: 2
    },
    {
        id: "q53",
        category: "direcao-defensiva",
        statement: "Condutor de carro com DRL trafega de dia por rodovia de pista simples fora do perímetro urbano e tem dúvida sobre o farol. Nesse caso, o uso do farol é:",
        options: ["Proibido durante o dia, pois consome energia e ofusca os demais condutores.", "Obrigatório, admitindo-se o uso do sistema DRL se o veículo dispuser do equipamento.", "Opcional durante o dia, ficando inteiramente a critério do condutor.", "Exigido apenas em túnel iluminado ou sob chuva, neblina ou cerração."],
        correctIndex: 1,
        explanation: "Correta a alternativa B, pois o CTB exige farol baixo de dia em pista simples, admitido o DRL.",
        detailedExplanation: "Desde a Lei 13.290/2016, é regra ter o farol baixo aceso em rodovias, mesmo com boa visibilidade. Isso ajuda outros motoristas a verem o carro, diminuindo o risco de acidentes. A luz de condução diurna (DRL) pode ser usada no lugar do farol baixo, já que serve pra deixar o veículo mais visível. Nas cidades, essa regra não vale, a não ser em túneis ou em situações de chuva e neblina.",
        legalBase: "Art. 250 do CTB",
        incidence: "media",
        difficulty: 2
    },
    {
        id: "q54",
        category: "legislacao",
        statement: "Candidato aprovado nos exames recebe a permissão para dirigir e entra em estágio probatório, sujeito a regras rígidas. O prazo de vigência da PPD é de:",
        options: ["3 meses, destinados apenas à realização do exame prático de direção.", "6 meses, destinados à conclusão das etapas iniciais da habilitação.", "1 ano, correspondente ao período do estágio probatório do permissionário.", "2 anos, idêntico ao prazo das avaliações psicológicas do condutor."],
        correctIndex: 2,
        explanation: "Correta a alternativa C, pois o art. 148 do CTB fixa em 1 ano a vigência da PPD no estágio probatório.",
        detailedExplanation: "A PPD (Permissão para Dirigir) é um documento temporário que o candidato recebe após passar nos exames. Durante 1 ano, o motorista deve ficar na linha: sem infrações graves ou gravíssimas e sem repetir infrações médias. Se seguir as regras, a PPD se transforma na CNH definitiva, mas se vacilar, pode perder a permissão e ter que começar tudo de novo.",
        legalBase: "Art. 148, §3º do CTB",
        incidence: "alta",
        difficulty: 1
    },
    {
        id: "qp01",
        category: "direcao-defensiva",
        statement: "Condutor enfrenta chuva forte e neblina densa em rodovia, com visibilidade muito reduzida e pista escorregadia. Nesse caso, deve:",
        options: ["Manter as luzes de posição apagadas e ligar o pisca-alerta com o veículo em movimento.", "Ligar o farol alto para tentar melhorar a visibilidade diante do veículo.", "Manter acesos o farol baixo ou a luz de posição, sem usar pisca-alerta em movimento.", "Acionar o pisca-alerta e passar a trafegar pelo acostamento da rodovia."],
        correctIndex: 2,
        explanation: "Correta a alternativa C, pois o art. 40 do CTB exige farol baixo e veda pisca-alerta com veículo em movimento.",
        detailedExplanation: "O pisca-alerta não deve ser ligado enquanto você dirige, pois pode confundir quem está atrás, fazendo parecer que você está parado. Em neblina densa, é importante ter a visibilidade adequada para evitar acidentes.",
        legalBase: "Art. 40 do CTB",
        commonMistake: "Muita gente acha que pode usar o pisca-alerta na neblina, mas isso tá ERRADO na prova.",
        tip: "Neblina = Farol baixo. Pisca-alerta NUNCA em movimento.",
        incidence: "altissima",
        trap: true,
        difficulty: 3
    },
    {
        id: "qp02",
        category: "infracoes",
        statement: "Condutor segue colado ao veículo da frente em rodovia, sem guardar espaço seguro para frear em emergência. Essa conduta configura infração:",
        options: ["Média, punida com multa e registro de 4 pontos na CNH do condutor.", "Grave, punida com multa e registro de 5 pontos na CNH do condutor.", "Gravíssima, punida com multa e registro de 7 pontos na CNH do condutor.", "Leve, punida com multa e registro de 3 pontos na CNH do condutor."],
        correctIndex: 1,
        explanation: "Correta a alternativa B, pois o art. 192 do CTB classifica como grave deixar de guardar distância segura.",
        detailedExplanation: "O artigo 192 do CTB fala que colar no carro da frente é perigoso e por isso é considerado GRAVE. Muitas pessoas confundem e acham que é mais sério, mas a lei é bem clara sobre isso.",
        legalBase: "Art. 192 do CTB",
        commonMistake: "O texto longo pode confundir, mas a infração é GRAVE e não Gravíssima.",
        tip: "Colar no carro da frente = GRAVE (5 pontos).",
        incidence: "altissima",
        trap: true,
        difficulty: 3
    },
    {
        id: "qp03",
        category: "legislacao",
        statement: "Após ingerir bebida alcoólica, condutor apresenta fala arrastada e dificuldade de equilíbrio antes de assumir a direção. Sobre o efeito do álcool, é correto afirmar que ele:",
        options: ["Causa perda total e permanente da capacidade visual do condutor.", "Turva a visão, mas aumenta a agilidade da reação do condutor.", "Reduz a atenção, provoca sonolência e diminui reflexos e coordenação.", "Aumenta reflexos e coordenação, tornando o condutor mais seguro."],
        correctIndex: 2,
        explanation: "Correta a alternativa C, pois o álcool reduz atenção, causa sonolência e diminui reflexos e coordenação.",
        commonMistake: "Muita gente cai na pegadinha de ler só a primeira parte da opção e esquece que a última palavra pode mudar tudo!",
        tip: "Álcool = Atenção baixa e reflexos lentos.",
        incidence: "alta",
        trap: true,
        difficulty: 3
    },
    {
        id: "qp04",
        category: "meio-ambiente",
        statement: "Com o aumento da exposição à radiação ultravioleta, médicos alertam para riscos diretos à população exposta ao sol sem proteção. A consequência direta é:",
        options: ["Aumento da temperatura média global em todas as regiões do planeta.", "Maior incidência de doenças respiratórias na população urbana.", "Aumento dos casos de câncer de pele e de lesões oculares na população.", "Aumento da quantidade de radiação UV-A e UV-B retida no solo."],
        correctIndex: 2,
        explanation: "Correta a alternativa C, pois a maior exposição ao UV eleva casos de câncer de pele e lesões oculares.",
        commonMistake: "Muita gente acha que a resposta é sobre o aumento dos raios UV, mas isso é a causa, não a consequência.",
        tip: "Buraco na camada = Mais radiação = Mais problemas na pele e olhos.",
        incidence: "alta",
        trap: true,
        difficulty: 3
    },
    {
        id: "qp05",
        category: "direcao-defensiva",
        statement: "Condutor usa farol alto em via iluminada e pisca as luzes sem motivo, ofuscando os demais. Sobre o emprego das luzes, é correto afirmar:",
        options: ["O farol baixo deve permanecer ligado dia e noite em qualquer via urbana.", "A troca intermitente de luz baixa e alta só vale para indicar ultrapassagem ou alertar risco.", "O farolete substitui o farol baixo em rodovias durante o dia em qualquer caso.", "O farol alto deve permanecer ligado em vias urbanas dotadas de iluminação."],
        correctIndex: 1,
        explanation: "Correta a alternativa B, pois o art. 40 do CTB só admite piscar luzes para ultrapassar ou alertar risco.",
        legalBase: "Art. 40 do CTB",
        commonMistake: "Muita gente acha que pode piscar a luz a qualquer hora, mas só é certo em situações específicas.",
        tip: "Ultrapassagem = Piscar luzes.",
        incidence: "alta",
        trap: true,
        difficulty: 3
    },
    {
        id: "qp06",
        category: "prioridade",
        statement: "Em cruzamento sem sinalização semafórica, veículo sobre trilhos aproxima-se ao mesmo tempo que carros e motos. Nesse caso, a preferência do veículo sobre trilhos é:",
        options: ["Relativa, aplicando-se apenas quando o veículo sobre trilhos for de maior porte.", "Absoluta, devendo os demais veículos aguardar a sua passagem.", "Condicionada à existência de sinalização semafórica no cruzamento.", "Compartilhada, aplicando-se a regra geral da preferência pela direita."],
        correctIndex: 1,
        explanation: "Correta a alternativa B, pois o art. 29 do CTB dá preferência absoluta aos veículos sobre trilhos.",
        legalBase: "Art. 29, VII do CTB",
        commonMistake: "Muita gente confunde e acha que só carro que passa por cima do trilho tem prioridade, mas não é bem assim.",
        tip: "Sobre trilhos = trem = prioridade total.",
        incidence: "alta",
        trap: true,
        difficulty: 3
    },
    {
        id: "qp07",
        category: "legislacao",
        statement: "São consideradas vias terrestres, de acordo com o CTB:",
        options: ["Vias particulares e condomínios fechados, sem qualquer fiscalização de trânsito.", "Áreas privadas e estacionamentos exclusivos de comércios e shoppings.", "Zonas de preservação ambiental e calçadões de uso exclusivo de pedestres.", "Praias abertas à circulação pública e vias internas de condomínios constituídos."],
        correctIndex: 3,
        explanation: "Correta a alternativa D, pois o art. 2º do CTB inclui praias abertas e vias internas de condomínios.",
        legalBase: "Art. 2º, parágrafo único do CTB",
        commonMistake: "Muita gente acha que as ruas de condomínio não contam como públicas, mas isso tá errado — o CTB se aplica lá também.",
        tip: "Praia + condomínio = via terrestre. CTB é pra todo mundo!",
        incidence: "alta",
        trap: true,
        difficulty: 3,
        origin: "real"
    },
    {
        id: "qp08",
        category: "primeiros-socorros",
        statement: "Vítima de colisão está caída com suspeita de lesão na coluna cervical e precisa ser retirada da pista com segurança. O procedimento correto é:",
        options: ["Puxar a vítima rapidamente pelos braços ou pelas pernas para o acostamento.", "Levantar a vítima sozinho e acomodá-la sentada no banco do veículo.", "Utilizar três pessoas para erguer a vítima em bloco, mantendo o corpo alinhado.", "Virar a cabeça da vítima para os lados para verificar possível fratura."],
        correctIndex: 2,
        explanation: "Correta a alternativa C, pois a vítima com lesão cervical deve ser movida em bloco, por três pessoas, sem torcer o corpo.",
        tip: "Movimentou vítima? Sempre em BLOCO, com 3 pessoas.",
        incidence: "alta",
        difficulty: 2
    },
    {
        id: "qp09",
        category: "primeiros-socorros",
        statement: "Popular sem formação médica chega primeiro ao acidente e quer ajudar as vítimas sem agravar as lesões. Primeiros socorros no trânsito significam:",
        options: ["Aplicar técnica médica avançada e administrar medicamentos às vítimas.", "Prestar atendimento inicial e temporário até a chegada do socorro profissional.", "Transportar a vítima imediatamente ao hospital em veículo particular.", "Realizar procedimentos cirúrgicos de emergência no local do acidente."],
        correctIndex: 1,
        explanation: "Correta a alternativa B, pois primeiros socorros são cuidados iniciais e temporários até o socorro profissional.",
        commonMistake: "Muita gente acha que pode fazer cirurgia ou dar remédio, mas isso é furada — só quem é médico pode fazer isso.",
        tip: "Ajudar = Esperar o profissional.",
        incidence: "alta",
        difficulty: 2
    },
    {
        id: "qp10",
        category: "direcao-defensiva",
        statement: "Instrutor pergunta ao aluno o que caracteriza um motorista defensivo diante de pista molhada e erro de outros condutores. O conceito correto é:",
        options: ["Evitar acidentes a qualquer custo, sem depender de manutenção do veículo.", "Um tipo de acidente em que não há conduta possível para evitá-lo.", "Conjunto de técnicas que previne acidentes mesmo com pista adversa e erro alheio.", "Habilidade de trafegar com rapidez confiando apenas nos próprios reflexos."],
        correctIndex: 2,
        explanation: "Correta a alternativa C, pois direção defensiva é o conjunto de técnicas que previne acidentes mesmo em condição adversa.",
        commonMistake: "Cuidado com a ideia de 'fazer de tudo' para evitar acidentes, isso não é direção defensiva.",
        tip: "Situação = Ação: Dirigir seguro = Prevenir acidentes.",
        incidence: "alta",
        trap: true,
        difficulty: 3
    },
    {
        id: "qp11",
        category: "prioridade",
        statement: "Dois veículos chegam ao mesmo tempo a cruzamento sem sinalização, semáforo ou agente, em vias de igual porte. Nesse caso, tem preferência:",
        options: ["O veículo que trafega pela via mais larga ou mais movimentada.", "O veículo que desenvolver maior velocidade ao aproximar-se do cruzamento.", "O veículo que vier pela direita do outro condutor no cruzamento.", "Qualquer um dos veículos, desde que pisque o farol antes de entrar."],
        correctIndex: 2,
        explanation: "Correta a alternativa C, pois o art. 29 do CTB dá preferência a quem vem pela direita sem sinalização.",
        legalBase: "Art. 29, III do CTB",
        commonMistake: "Muita gente pensa que a rua mais larga sempre tem preferência. ERRADO — a regra da direita é que vale.",
        tip: "Sem sinalização? Direita é a prioridade!",
        incidence: "altissima",
        difficulty: 2
    },
    {
        id: "qp12",
        category: "legislacao",
        statement: "Com a seta queimada, o condutor estende o braço esquerdo horizontalmente para fora do veículo para indicar a manobra. Esse gesto sinaliza:",
        options: ["Diminuição de marcha para reduzir gradualmente a velocidade.", "Parada imediata do veículo junto ao bordo da pista.", "Conversão à esquerda na interseção ou mudança para a faixa lateral.", "Permissão para que o veículo de trás execute a ultrapassagem."],
        correctIndex: 2,
        explanation: "Correta a alternativa C, pois o braço esquerdo estendido na horizontal indica conversão à esquerda.",
        detailedExplanation: "No trânsito, o braço estendido pra fora na horizontal mostra que o motorista quer virar à esquerda. Lembre-se dos outros sinais: braço pra cima é virar à direita e braço pra baixo é diminuir ou parar.",
        legalBase: "Art. 38 do CTB",
        commonMistake: "Cuidado! Muita gente confunde o braço horizontal com o braço pra baixo e marca errado.",
        tip: "Braço reto pro lado = ESQUERDA. Pra cima = DIREITA. Pra baixo = PARAR.",
        incidence: "altissima",
        trap: true,
        difficulty: 2
    },
    {
        id: "qp13",
        category: "legislacao",
        statement: "Com defeito na lanterna, o condutor mantém o braço esquerdo dobrado com a mão apontando para cima. Esse gesto regulamentar sinaliza:",
        options: ["Conversão à esquerda na próxima interseção da via.", "Conversão à direita na próxima interseção da via.", "Permissão para ultrapassagem pelo veículo que vem atrás.", "Redução de velocidade ou parada junto ao bordo da pista."],
        correctIndex: 1,
        explanation: "Correta a alternativa B, pois o braço dobrado com a mão para cima indica conversão à direita.",
        legalBase: "Art. 38 do CTB",
        commonMistake: "A galera confunde e acha que é pra esquerda só porque o braço tá do lado esquerdo, mas a mão pra cima é que manda.",
        tip: "Mão pra cima = direita, mesmo com o braço do lado esquerdo.",
        incidence: "alta",
        trap: true,
        difficulty: 3
    },
    {
        id: "qp14",
        category: "direcao-defensiva",
        statement: "Condutor pretende converter à esquerda em via de mão dupla com fluxo contrário intenso e precisa fazer a manobra sem risco. Para isso, deve:",
        options: ["Acionar a seta apenas no momento da curva e avançar com rapidez.", "Sinalizar com antecedência, aproximar-se da linha divisória sem invadir, reduzir e dar preferência a quem vem de frente.", "Buzinar, acelerar e cruzar a via antes da passagem do veículo contrário.", "Sinalizar com a seta para a direita e executar a curva pela contramão."],
        correctIndex: 1,
        explanation: "Correta a alternativa B, pois o art. 38 exige sinalizar antes, guardar a faixa e dar preferência a quem vem de frente.",
        legalBase: "Art. 38 do CTB",
        commonMistake: "Cuidado com as alternativas que parecem boas, mas erram em detalhes como avançar rápido ou usar a faixa errada.",
        tip: "Virar à esquerda = Sinalizar ANTES, colar na linha do meio, REDUZIR e dar preferência pra quem vem de frente.",
        incidence: "altissima",
        trap: true,
        difficulty: 3
    },
    {
        id: "qp15",
        category: "legislacao",
        statement: "Condutor pretende mudar de faixa para ultrapassar e precisa cumprir o dever legal antes do deslocamento lateral. Antes da manobra, é obrigado a:",
        options: ["Apenas observar o retrovisor interno e iniciar de imediato a manobra.", "Buzinar três vezes consecutivas para advertir os demais condutores.", "Certificar-se de que pode executar sem perigo e indicar com antecedência a intenção.", "Acelerar bruscamente para abrir espaço entre os veículos da faixa."],
        correctIndex: 2,
        explanation: "Correta a alternativa C, pois o art. 35 do CTB exige certificar-se da segurança e sinalizar antes.",
        legalBase: "Art. 35 do CTB",
        commonMistake: "Muita gente acha que a resposta certa é a mais curta e acaba errando por isso.",
        tip: "Manobra lateral = SEGURANÇA + SINALIZAÇÃO antecipada. Sempre.",
        incidence: "alta",
        trap: true,
        difficulty: 2
    },
    {
        id: "qp17",
        category: "mecanica",
        statement: "Em viagem, o ponteiro da temperatura entra na faixa vermelha e sai vapor do capô, indicando superaquecimento. A conduta correta é:",
        options: ["Estacionar e abrir imediatamente a tampa do radiador para aliviar a pressão.", "Desligar o motor e jogar água fria sobre o bloco para resfriar depressa.", "Parar em local seguro, desligar o motor e aguardar esfriar naturalmente.", "Continuar dirigindo devagar até encontrar o posto mais próximo."],
        correctIndex: 2,
        explanation: "Correta a alternativa C, pois deve-se parar em local seguro, desligar e aguardar esfriar, sem abrir o radiador quente.",
        detailedExplanation: "Quando a luz de temperatura acende, é sinal de que o motor está muito quente. O certo é parar, desligar o motor e esperar esfriar, o que pode levar de 20 a 30 minutos. Nunca abra o radiador quente, pois pode sair vapor e água fervente, causando queimaduras. Jogar água fria no motor quente também é um erro, pois pode danificar o motor. Lembre-se de ligar o pisca-alerta para sinalizar o carro.",
        legalBase: "Manual de direção defensiva DENATRAN",
        commonMistake: "Muita gente pensa que deve abrir o radiador ou jogar água na hora, mas isso é muito perigoso.",
        tip: "Motor quente = tampa do radiador FECHADA. Espere esfriar naturalmente.",
        incidence: "alta",
        trap: true,
        difficulty: 2
    },
    {
        id: "qp18",
        category: "mecanica",
        statement: "Ao girar a chave, o painel acende, mas o motor não gira e ouve-se apenas um clique seco repetido. A causa mais provável é:",
        options: ["Falta absoluta de óleo lubrificante no cárter do motor.", "Bateria descarregada ou com carga insuficiente para o arranque.", "Falha no sistema de injeção eletrônica de combustível.", "Rompimento da correia do alternador durante o trajeto."],
        correctIndex: 1,
        explanation: "Correta a alternativa B, pois painel aceso com clique seco indica bateria fraca para girar o motor.",
        detailedExplanation: "Se o painel acende, mas o motor só faz um clique e não gira, a bateria provavelmente está descarregada ou com pouca carga. As luzes internas também podem ficar mais fracas ao tentar dar a partida, e a injeção eletrônica não impede o motor de girar, só de funcionar.",
        commonMistake: "Muita gente confunde 'motor não gira' com 'motor não pega'; são coisas diferentes.",
        tip: "Clique seco = bateria fraca. Gira mas não pega = combustível.",
        incidence: "alta",
        trap: true,
        difficulty: 2
    },
    {
        id: "qp19",
        category: "mecanica",
        statement: "Candidato observa os ressaltos no fundo dos sulcos e pergunta qual é o limite legal para rodar com segurança. Sobre a profundidade mínima, é correto afirmar:",
        options: ["O TWI serve para medir a pressão interna do pneu calibrado.", "Os pneus podem circular com sulcos de qualquer profundidade.", "A profundidade mínima é 1,6 mm, indicada pelos ressaltos do TWI.", "Pneus carecas são permitidos apenas no eixo traseiro do veículo."],
        correctIndex: 2,
        explanation: "Correta a alternativa C, pois o limite legal é 1,6 mm, marcado pelo TWI, abaixo disso é gravíssima.",
        detailedExplanation: "O TWI (Tread Wear Indicator) são marquinhas que mostram quando o pneu tá ficando careca. Quando o desgaste chega até essas marquinhas, a profundidade tá em 1,6 mm, que é o mínimo permitido. Usar pneus carecas é muito perigoso, pois eles escorregam mais na chuva e aumentam a distância pra parar, além de ser uma infração gravíssima com multa e retenção do carro.",
        legalBase: "Art. 230, XXII do CTB / Resolução CONTRAN 558/80",
        commonMistake: "Muita gente acha que o TWI mede pressão ou que 1,6 mm é válido em qualquer situação. A prova adora confundir isso!",
        tip: "TWI = Sulco do pneu = 1,6 mm é o mínimo.",
        incidence: "alta",
        trap: true,
        difficulty: 2
    },
    {
        id: "qp20",
        category: "mecanica",
        statement: "Em descida longa de serra, o condutor sente cheiro de queimado e o pedal de freio endurecido, com frenagem fraca. Isso indica:",
        options: ["Fluido de freio vencido, devendo o condutor apenas bombear o pedal.", "Aquecimento do fluido com vapor (fading), devendo reduzir a marcha e usar o freio-motor.", "Desgaste das pastilhas, devendo acionar o freio de estacionamento em movimento.", "Travamento de rolamento, devendo imobilizar e resfriar as rodas no local."],
        correctIndex: 1,
        explanation: "Correta a alternativa B, pois fading exige marcha reduzida e freio-motor para preservar os freios.",
        detailedExplanation: "O fading acontece em descidas longas, quando o uso constante dos freios faz o fluido superaquecer e formar bolhas. Isso deixa o pedal duro ou faz ele ir até o fundo sem parar o carro. O certo é engatar uma marcha mais curta e usar o freio motor pra controlar a velocidade, acionando o freio de jeito intermitente, não direto. Bombear o pedal pode ajudar, mas não resolve o problema do fading. O freio de mão é só pra emergência e pode fazer o carro derrapar.",
        legalBase: "Manual de direção defensiva DENATRAN",
        commonMistake: "Muita gente acha que é só bombear o pedal ou que é problema na pastilha, mas a questão é o fading e a solução é usar o freio motor.",
        tip: "Descida longa = marcha reduzida + freio motor. Freio só de apoio.",
        incidence: "alta",
        trap: true,
        difficulty: 3
    },
    {
        id: "qp21",
        category: "mecanica",
        statement: "Logo após abastecer em posto desconhecido, o veículo vibra no volante, falha e perde força em retomadas. A causa mais provável é:",
        options: ["Combustível adulterado ou com água no tanque, prejudicando a combustão.", "Tampa do tanque aberta, provocando entrada de ar no sistema.", "Correia do alternador solta, reduzindo a carga da bateria.", "Óleo lubrificante trocado por engano junto com o combustível."],
        correctIndex: 0,
        explanation: "Correta a alternativa A, pois combustível adulterado ou com água causa vibração e perda de força após abastecer.",
        detailedExplanation: "Quando o combustível é adulterado ou tem água, o carro pode apresentar problemas como dificuldade para ligar, marcha lenta irregular e até o motor parar. O ideal é não tentar ligar o carro várias vezes e levar para uma oficina para resolver o problema. A correia do alternador não causa perda de potência de imediato e óleo no tanque é raro nesse caso.",
        commonMistake: "Muita gente acha que vibração é só pneu ou suspensão, mas aqui a situação é diferente por causa do abastecimento recente.",
        tip: "Abasteceu e o carro ficou ruim? = Ação: Verifique o combustível!",
        incidence: "media",
        trap: true,
        difficulty: 2
    },
    {
        id: "qp22",
        category: "mecanica",
        statement: "Mecânico orienta sobre o líquido de arrefecimento e a ventoinha do radiador para evitar superaquecimento. Sobre o sistema, assinale a alternativa INCORRETA:",
        options: ["O líquido deve ser mistura de água desmineralizada com aditivo na proporção indicada.", "A ventoinha do radiador é acionada automaticamente por sensor de temperatura.", "A água comum da torneira pode substituir o líquido de arrefecimento sem prejuízos.", "Verificar o nível do reservatório de expansão integra a manutenção preventiva."],
        correctIndex: 2,
        explanation: "Correta a alternativa C, pois água comum causa corrosão e não substitui o líquido com aditivo.",
        detailedExplanation: "A água da torneira tem minerais que, com o calor do motor, formam crostas no radiador e no bloco, atrapalhando a troca de calor e causando corrosão. O ideal é usar água desmineralizada misturada com aditivo na proporção certa, que ajuda a regular a temperatura do motor. Fique atento ao comando 'INCORRETA' — é uma pegadinha clássica.",
        commonMistake: "O candidato lê rápido e marca a primeira alternativa que parece correta, mas a pegadinha está no 'INCORRETA'.",
        tip: "Leia o comando = Marque a alternativa FALSA.",
        incidence: "alta",
        trap: true,
        difficulty: 2
    },
    {
        id: "qp23",
        category: "mecanica",
        statement: "Condutor usa pisca-alerta na chuva com o carro andando e mantém farol alto em cruzamentos, ofuscando todos. Sobre as luzes, a conduta correta é:",
        options: ["Farol alto permitido em qualquer via durante a noite, mesmo com tráfego contrário.", "Luz de neblina substitui o farol baixo em condições normais de visibilidade.", "Pisca-alerta só em emergência, imobilização ou perigo, nunca com o veículo em movimento.", "Lanterna de posição dispensa o farol baixo em vias urbanas iluminadas à noite."],
        correctIndex: 2,
        explanation: "Correta a alternativa C, pois o art. 40 do CTB só admite pisca-alerta parado, em emergência ou perigo.",
        detailedExplanation: "O pisca-alerta (luz de advertência) deve ser acionado apenas em emergências, como carro parado na pista ou situações de risco. Usar enquanto dirige normalmente, como na chuva, tá errado. Lembre-se: farol alto deve ser abaixado ao encontrar outro carro, e farol baixo é obrigatório à noite.",
        legalBase: "Art. 40, V e 251 do CTB",
        commonMistake: "Muita gente acha que usar pisca-alerta na chuva é certo, mas não é.",
        tip: "Pisca-alerta = carro PARADO ou perigo. Não use na chuva.",
        incidence: "altissima",
        trap: true,
        difficulty: 2
    },
    {
        id: "qp24",
        category: "mecanica",
        statement: "Condutor percebe vibração na alavanca do câmbio e dificuldade para engatar as marchas, com ruído áspero. O componente do sistema de transmissão com defeito provável é:",
        options: ["O sistema de embreagem ou os sincronizadores da caixa de marchas.", "O diferencial e as semiarvores de transmissão das rodas.", "O cilindro mestre do sistema de freios hidráulicos.", "O conjunto de amortecedores e molas da suspensão dianteira."],
        correctIndex: 2,
        explanation: "Correta a alternativa A, pois dentes 'arranhando', dificuldade de engate e ruídos na alavanca indicam desgastes no sistema de embreagem ou nos anéis sincronizadores do câmbio.",
        detailedExplanation: "O sistema de embreagem acopla e desacopla o motor da caixa de marcha. Quando a embreagem está gasta ou desregulada (ou os anéis sincronizadores do câmbio estão danificados), as engrenagens não alinham corretamente, gerando o ruído áspero ('arranhando') e a dificuldade de engate.",
        commonMistake: "Confundir ruídos de engate de marcha com folgas de suspensão ou problemas no diferencial.",
        tip: "Dificuldade de engatar marcha / ruído áspero ao trocar = Embreagem / Sincronizadores.",
        incidence: "media",
        trap: true,
        difficulty: 2
    },
    {
        id: "qp25",
        category: "meio-ambiente",
        statement: "Após trocar o óleo em casa, o condutor guarda o lubrificante usado e pergunta onde descartar sem poluir. A destinação correta é:",
        options: ["Queimar o óleo usado em fornos industriais adaptados.", "Descartar o óleo usado na pia ou no ralo da residência.", "Armazenar em recipiente fechado e entregar em ponto de coleta credenciado.", "Jogar o óleo usado diretamente no solo do quintal."],
        correctIndex: 2,
        explanation: "Correta a alternativa C, pois o óleo usado deve ir a ponto de coleta para rerrefino, conforme CONAMA 362.",
        detailedExplanation: "Um litro de óleo lubrificante usado pode sujar até 1 milhão de litros de água. O jeito certo é guardar em um recipiente fechado e levar a postos de coleta, como oficinas ou postos de gasolina, que fazem o rerrefino — que é quando o óleo é recuperado pra ser usado de novo. Descartar no solo contamina a água, na pia entope tudo e queimar solta fumaça tóxica.",
        legalBase: "Lei 9.605/98 (Lei de Crimes Ambientais) / Resolução CONAMA 362/2005",
        commonMistake: "Muita gente pensa que queimar o óleo é reciclar, mas isso não é verdade.",
        tip: "Óleo usado = coleta. Leve ao posto de gasolina!",
        incidence: "media",
        trap: true,
        difficulty: 2
    },
    {
        id: "qp26",
        category: "meio-ambiente",
        statement: "Condutor quer poluir menos e economizar combustível, mas mantém vícios como acelerar antes de desligar. O hábito que reduz a emissão de poluentes é:",
        options: ["Manter o motor ligado durante paradas prolongadas do veículo.", "Realizar manutenção preventiva periódica dos sistemas de ignição, alimentação e escapamento.", "Utilizar combustível de menor octanagem que a recomendada pelo fabricante.", "Acelerar o motor antes de desligá-lo para limpar o escapamento."],
        correctIndex: 1,
        explanation: "Correta a alternativa B, pois manutenção preventiva da ignição, alimentação e escape reduz poluentes.",
        detailedExplanation: "Manter o carro em dia, como as velas e o escapamento, faz com que ele funcione melhor e emita menos poluentes. Quando o motor fica ligado sem necessidade, é infração e polui à toa. Acelerar antes de desligar joga combustível fora e aumenta a sujeira no ar.",
        legalBase: "Art. 227 do CTB / Resolução CONAMA 18/86",
        commonMistake: "A alternativa A parece boa, mas o CTB proíbe deixar o motor ligado em paradas longas e isso polui mais.",
        tip: "Menos poluição = carro em dia. Motor desligado em paradas.",
        incidence: "media",
        difficulty: 1
    },
    {
        id: "qp27",
        category: "meio-ambiente",
        statement: "Agente aborda caminhonete emitindo fumaça escura densa, bem acima do padrão permitido, irritando pedestres. Essa conduta configura infração:",
        options: ["Grave, punida com multa e retenção do veículo até a regularização.", "Leve, punida apenas com advertência verbal no local da abordagem.", "Sem previsão como infração de trânsito, apenas como questão ambiental.", "Média, punida com multa e registro de 4 pontos na CNH."],
        correctIndex: 0,
        explanation: "Correta a alternativa A, pois o art. 231, inciso III, prevê grave com retenção por fumaça excessiva.",
        detailedExplanation: "O CTB diz que é infração GRAVE (5 pontos, multa) dirigir veículo que solta poluentes ou fumaça além do permitido (art. 231, III). O agente pode parar o carro até que o problema seja resolvido. Fumaça escura geralmente mostra que o motor tá queimando combustível errado ou tá com algum problema.",
        legalBase: "Art. 231, III do CTB",
        commonMistake: "Muita gente pensa que a fumaça é só um problema ambiental, mas na verdade é infração GRAVE com retenção do veículo.",
        tip: "Fumaça no escapamento = Ação = Multa e retenção.",
        incidence: "media",
        trap: true,
        difficulty: 2
    },
    {
        id: "qp28",
        category: "meio-ambiente",
        statement: "Borracheiro acumula pneus velhos e pergunta o destino legal para evitar dengue e poluição do solo. A destinação correta dos pneus inservíveis é:",
        options: ["Queimar os pneus em usinas de cimento sem controle de emissões.", "Descartar os pneus em aterros sanitários comuns junto ao lixo.", "Entregar em pontos de coleta para reciclagem ou coprocessamento licenciado.", "Reutilizar todos como jardineiras ou mobiliário sem controle técnico."],
        correctIndex: 2,
        explanation: "Correta a alternativa C, pois a Resolução CONAMA 416 exige entrega em ponto de coleta para reciclagem.",
        detailedExplanation: "A lei diz que quem vende pneus tem que coletar os usados e dar um destino certo, como reciclagem. Os consumidores devem levar os pneus usados até esses pontos de coleta, como borracharias ou lojas. Queimar pneus ao ar livre ou jogar em aterros não é permitido porque faz mal ao meio ambiente.",
        legalBase: "Resolução CONAMA 416/2009",
        commonMistake: "Muita gente pensa que queimar pneus em 'forno de cimento' é uma forma limpa de reciclagem, mas isso não é verdade.",
        tip: "Pneu velho? Leve ao ponto de coleta da revendedora.",
        incidence: "baixa",
        difficulty: 2
    },
    {
        id: "qp29",
        category: "meio-ambiente",
        statement: "Condutor trafega por estrada estreita com vegetação seca nas margens em dia quente e quer evitar incêndio. A conduta VEDADA nesse local é:",
        options: ["Trafegar em baixa velocidade para reduzir a poeira sobre a vegetação.", "Manter o ar-condicionado em recirculação durante o trecho de vegetação.", "Jogar pontas de cigarro ou fósforos acesos pela janela do veículo.", "Acionar o pisca-alerta ao reduzir a velocidade por causa da via estreita."],
        correctIndex: 2,
        explanation: "Correta a alternativa C, pois o art. 172 do CTB veda lançar objetos, com risco grave de incêndio em vegetação seca.",
        detailedExplanation: "Jogar qualquer coisa pela janela do carro é infração MÉDIA (art. 172 do CTB). Pontas de cigarro acesas são super perigosas em áreas secas, podendo causar incêndios enormes. Sempre use o cinzeiro do carro para descartar as bitucas.",
        legalBase: "Art. 172 do CTB / Lei 9.605/98",
        commonMistake: "O aluno pensa que a questão é sobre 'vegetação alta' e se confunde, mas o erro está em jogar as pontas.",
        tip: "Bituca pela janela = infração + risco de incêndio. Use o cinzeiro!",
        incidence: "alta",
        trap: true,
        difficulty: 1
    },
    {
        id: "qp30",
        category: "meio-ambiente",
        statement: "Condutor substitui a bateria do carro e pergunta ao lojista o destino da peça antiga com chumbo e ácido. A destinação correta da bateria usada é:",
        options: ["Descartar no lixo comum após descarregar totalmente a carga restante.", "Neutralizar o ácido com soda cáustica e descartar o líquido na pia.", "Devolver ao revendedor no ato da compra de uma bateria nova.", "Descartar em qualquer local, pois não oferece risco ambiental significativo."],
        correctIndex: 2,
        explanation: "Correta a alternativa C, pois a Resolução CONAMA 401 impõe logística reversa com devolução ao revendedor.",
        detailedExplanation: "A lei diz que quem vende bateria de chumbo-ácido tem que receber a usada na hora da venda da nova. Isso é pra evitar que esses materiais tóxicos poluam o meio ambiente. Descartar no lixo ou na pia é proibido porque pode contaminar tudo ao redor.",
        legalBase: "Resolução CONAMA 401/2008",
        commonMistake: "Muita gente não sabe que a loja é obrigada a pegar a bateria velha e acaba jogando fora de qualquer jeito.",
        tip: "Bateria velha = devolve na compra da nova. A loja é obrigada a pegar!",
        incidence: "baixa",
        difficulty: 2
    },
    {
        id: "qp31",
        category: "infracoes",
        statement: "Condutor avança o sinal vermelho em cruzamento com faixa de pedestre ocupada, exigindo frenagem brusca de quem atravessa. Essa conduta configura infração:",
        options: ["Gravíssima com agravante, por expor o pedestre a risco direto de atropelamento.", "Grave, em razão da presença de pedestre sobre a faixa de travessia.", "Média, em razão do desrespeito à sinalização luminosa do cruzamento.", "Sem agravante específico, pois a infração é sempre a mesma em qualquer caso."],
        correctIndex: 0,
        explanation: "Avançar o sinal vermelho é infração gravíssima (Art. 208 do CTB); com pedestre sobre a faixa, o risco de atropelamento é direto.",
        detailedExplanation: "Quando o motorista passa no sinal vermelho, ele comete uma infração GRAVÍSSIMA, que gera 7 pontos e multa. Isso é muito sério, principalmente em cruzamentos, onde pode causar acidentes com pedestres. O Código de Trânsito prioriza a segurança dos pedestres, então essa situação é ainda mais grave.",
        legalBase: "Art. 208 do CTB",
        commonMistake: "Muita gente pensa que avançar o sinal vermelho é só uma infração grave, mas é gravíssima e tem 7 pontos.",
        tip: "Sinal vermelho = PARE. Cruzamento com pedestre = AÇÃO GRAVÍSSIMA.",
        incidence: "alta",
        trap: true,
        difficulty: 1
    },
    {
        id: "qp32",
        category: "infracoes",
        statement: "Em semáforo fechado, o condutor segura o celular para ler mensagem, manuseando o aparelho com o veículo parado na faixa. Essa conduta configura infração:",
        options: ["Leve, punida com multa e registro de 3 pontos na CNH do condutor.", "Média, punida com multa e registro de 4 pontos na CNH do condutor.", "Gravíssima, com 7 pontos e multa multiplicada por 3 em caso de reincidência.", "Gravíssima, punida com multa e registro de 7 pontos na CNH do condutor."],
        correctIndex: 3,
        explanation: "Correta a alternativa D, pois o art. 252 do CTB prevê gravíssima, com 7 pontos, para manusear celular ao volante.",
        detailedExplanation: "Segurar ou mexer no celular ao volante é uma infração GRAVÍSSIMA, que gera 7 pontos na CNH e uma multa de R$ 293,47. Não tem fator multiplicador, mas se você repetir a infração em 12 meses, a multa dobra.",
        legalBase: "Art. 252, VI do CTB",
        commonMistake: "Muita gente pensa que usar celular é infração média ou grave, mas é GRAVÍSSIMA de verdade.",
        tip: "Celular no volante = GRAVÍSSIMA. Só atenda se estacionar em local seguro.",
        incidence: "altissima",
        trap: true,
        difficulty: 2
    },
    {
        id: "qp33",
        category: "infracoes",
        statement: "Em blitz, o agente constata condutor e dois passageiros no banco traseiro todos sem cinto de segurança afivelado. Essa conduta do condutor configura:",
        options: ["Duas infrações graves, sendo uma para si e outra para cada passageiro.", "Uma única infração grave, independentemente do número de passageiros sem cinto.", "Infração grave para si e infração leve para cada passageiro sem cinto.", "Infração gravíssima para o condutor e grave para o proprietário do veículo."],
        correctIndex: 1,
        explanation: "Correta a alternativa B, pois o art. 167 do CTB prevê uma única infração grave para o condutor.",
        detailedExplanation: "O cinto de segurança é obrigatório para todo mundo no carro. Se o motorista e os passageiros estiverem sem cinto, ele só recebe uma multa, mas é responsável por todos.",
        legalBase: "Art. 167 do CTB",
        commonMistake: "Muita gente pensa que cada passageiro sem cinto gera uma multa diferente, mas é só uma infração para o motorista.",
        tip: "Cinto para TODOS = Uma infração GRAVE.",
        incidence: "alta",
        trap: true,
        difficulty: 2
    },
    {
        id: "qp34",
        category: "infracoes",
        statement: "Condutor ultrapassa caminhão em trecho com faixa contínua, forçando o veículo contrário a desviar para o acostamento. Essa conduta configura infração:",
        options: ["Grave, punida com 5 pontos e multa de valor simples.", "Gravíssima, com 7 pontos, multa multiplicada por 5 e suspensão da CNH.", "Média, punida com 4 pontos e multa de valor simples.", "Gravíssima, com 7 pontos e multa simples, sem fator multiplicador."],
        correctIndex: 1,
        explanation: "Correta a alternativa B, pois o art. 203 do CTB prevê gravíssima com multa vezes 5 e suspensão.",
        detailedExplanation: "Quando você ultrapassa em lugar que não pode, como na faixa contínua, é considerado uma infração GRAVÍSSIMA. Isso significa que a multa é bem alta, multiplicada por 5, e você pode até perder o direito de dirigir por um tempo.",
        legalBase: "Art. 203, V do CTB",
        commonMistake: "Muita gente pensa que essa infração é 'grave' ou que a multa é multiplicada por 3, mas é 5 mesmo!",
        tip: "Ultrapassagem proibida = GRAVÍSSIMA x5. Sete pontos + multa salgada.",
        incidence: "alta",
        trap: true,
        difficulty: 2
    },
    {
        id: "qp35",
        category: "infracoes",
        statement: "Após colidir com motociclista ferido, o condutor foge do local sem prestar socorro nem acionar resgate. Essa conduta configura:",
        options: ["Apenas infração gravíssima, punida somente com multa administrativa.", "Infração gravíssima e crime de omissão de socorro, com detenção de 1 a 6 meses.", "Apenas crime de homicídio culposo, sem infração administrativa associada.", "Infração média, desde que o condutor não seja o proprietário do veículo."],
        correctIndex: 1,
        explanation: "Correta a alternativa B, pois os arts. 304 e 305 do CTB preveem gravíssima e crime de omissão de socorro.",
        detailedExplanation: "Duas punições vêm por aí: (1) Infração GRAVÍSSIMA — não ajudar a vítima pode te dar multa e suspensão da CNH; (2) Crime de OMISSÃO DE SOCORRO — pode rolar detenção de 1 a 6 meses e multa. O certo é parar, sinalizar, ajudar ou chamar o SAMU e esperar a autoridade.",
        legalBase: "Arts. 304 e 305 do CTB / Art. 135 do Código Penal",
        commonMistake: "Muita gente pensa que só é infração, mas tem pena dupla: administrativa e criminal, mesmo que a vítima não morra.",
        tip: "Acidente com vítima = pare, socorra, sinalize, aguarde. Fugir é crime.",
        incidence: "alta",
        trap: true,
        difficulty: 2
    },
    {
        id: "qp36",
        category: "infracoes",
        statement: "Em blitz, o agente aborda três casos: sem CNH, com CNH vencida há 40 dias e com categoria divergente. Sobre habilitação, é correto afirmar:",
        options: ["Dirigir com CNH vencida há mais de 30 dias é gravíssima com multa multiplicada por 3.", "Dirigir com CNH de categoria divergente é leve, punida com advertência escrita.", "Dirigir sem CNH ou PPD é gravíssima com multa vezes 3, podendo configurar crime.", "Dirigir com CNH de categoria diferente é média, com retenção do veículo."],
        correctIndex: 2,
        explanation: "Correta a alternativa C, pois o art. 162 do CTB prevê gravíssima vezes 3 para sem CNH; vencida há +30 dias e categoria diferente também são gravíssimas.",
        detailedExplanation: "O art. 162 do CTB fala sobre as infrações de habilitação: (I) dirigir sem CNH ou PPD é GRAVÍSSIMA com multa triplicada e pode ser crime se gerar perigo; (V) dirigir com CNH vencida há mais de 30 dias também é GRAVÍSSIMA; (III) dirigir com CNH de categoria diferente é GRAVÍSSIMA com multa em dobro. A alternativa C é a única totalmente correta.",
        legalBase: "Art. 162, I, III e V do CTB",
        commonMistake: "A banca costuma confundir os multiplicadores: sem CNH é x3, categoria diferente é x2, vencida +30 dias é multa simples.",
        tip: "Sem CNH = GRAVÍSSIMA x3. Vencida +30 dias e categoria errada = GRAVÍSSIMAS.",
        incidence: "alta",
        trap: true,
        difficulty: 3
    },
    {
        id: "qp37",
        category: "primeiros-socorros",
        statement: "Motociclista inconsciente usa capacete integral e respira com dificuldade, exigindo acesso às vias aéreas. A retirada do capacete deve ser feita:",
        options: ["Puxando o capacete com força para cima, de uma só vez.", "Com duas pessoas, mantendo cabeça e pescoço alinhados e imóveis.", "Cortando o capacete ao meio com faca para liberar a cabeça.", "Aguardando a vítima retomar a consciência para retirar sozinha."],
        correctIndex: 1,
        explanation: "Correta a alternativa B, pois a técnica exige duas pessoas, com cabeça e pescoço alinhados e imóveis.",
        detailedExplanation: "Quando a vítima está inconsciente, tirar o capacete é bem delicado. É preciso manter a coluna cervical alinhada pra não machucar mais. Uma pessoa segura a cabeça e a outra tira o capacete devagar, sem puxar com força.",
        commonMistake: "Muita gente acha que é só tirar o capacete rápido, mas o importante é proteger a coluna primeiro.",
        tip: "Vítima inconsciente = 2 pessoas, segura a cabeça, remove com calma.",
        incidence: "media",
        trap: true,
        difficulty: 3
    },
    {
        id: "qp38",
        category: "primeiros-socorros",
        statement: "Em acidente, vítima tem corte profundo no braço com sangramento intenso e não há material hospitalar. Qual a conduta imediata?",
        options: ["Aplicar garrote improvisado logo acima do ferimento para bloquear todo o fluxo de sangue do braço.", "Comprimir o ferimento com pano limpo, com pressão firme e contínua, sem aliviar até chegar o socorro.", "Elevar o braço acima do coração e aguardar o sangramento parar sozinho apenas pela ação da gravidade.", "Lavar o corte com álcool e cobrir com curativo fechado para tentar conter a hemorragia."],
        correctIndex: 1,
        explanation: "Correta B: compressão direta firme e contínua é a primeira medida para conter hemorragia externa.",
        detailedExplanation: "Para parar o sangramento, primeiro você coloca um pano limpo ou gaze e faz pressão firme por pelo menos 10 minutos sem olhar. Se não parar, levanta o braço acima do coração, mas continua pressionando. O torniquete é bem arriscado e deve ser a última opção, porque pode causar problemas sérios.",
        commonMistake: "Muita gente pensa que o torniquete é a primeira coisa a fazer, mas na verdade, compressão direta é o que realmente funciona.",
        tip: "Sangramento = PRESSÃO FIRME. Torniquete só em último caso.",
        incidence: "alta",
        trap: true,
        difficulty: 2
    },
    {
        id: "qp39",
        category: "primeiros-socorros",
        statement: "Vítima acordada, confusa, com pele pálida, fria e suada, respiração rápida e sem sangramento visível. O que esse quadro sugere?",
        options: ["Estado de choque: deitar a vítima, elevar as pernas cerca de 30 cm e agasalhar até chegar o socorro.", "Vertigem simples: manter a vítima em pé e fazê-la caminhar para retomar a circulação do corpo.", "Hipoglicemia: oferecer bebida ou alimento açucarado por via oral imediatamente.", "Exaustão pós-trauma: deixar a vítima descansar até recuperar a consciência plena sozinha."],
        correctIndex: 0,
        explanation: "Correta A: palidez, pele fria e úmida com respiração rápida indicam choque; deite, eleve as pernas e agasalhe.",
        detailedExplanation: "Choque é quando o corpo não consegue levar oxigênio pros órgãos. Os sinais são pele pálida e fria, pulso fraco e respiração rápida. A conduta é deitar a vítima, elevar as pernas, agasalhar e esperar o socorro.",
        commonMistake: "O aluno pode pensar que 'choque' é só psicológico, mas os sinais físicos são fundamentais para identificar.",
        tip: "Pele pálida, fria e úmida = choque. Deite, eleve pernas, agasalhe, não dê nada.",
        incidence: "media",
        trap: true,
        difficulty: 2
    },
    {
        id: "qp40",
        category: "primeiros-socorros",
        statement: "Após colisão, vítima consciente sente dor intensa na coluna e não move as pernas. Há suspeita de lesão medular. O que fazer?",
        options: ["Ajudar a vítima a sentar-se devagar para verificar se a dor diminui com a mudança de posição.", "Virar a vítima de bruços para aliviar a pressão sobre a coluna até o socorro chegar.", "Não movimentar a vítima e imobilizar cabeça e pescoço, mantendo a posição encontrada até o socorro especializado.", "Puxar a vítima pelas pernas para retirá-la do asfalto quente e levá-la até a calçada."],
        correctIndex: 2,
        explanation: "Correta C: com suspeita de lesão medular, não movimente a vítima; imobilize cabeça e pescoço até o socorro.",
        detailedExplanation: "Quando tem suspeita de lesão na coluna, mover a vítima pode piorar a situação e causar danos permanentes. O certo é manter a cabeça alinhada com o corpo, aquecer a vítima e chamar o SAMU ou os Bombeiros. Só mova em caso de perigo imediato, tipo fogo ou explosão.",
        commonMistake: "Muita gente acha que deve tirar a vítima do chão ou ajudar a sentar, mas isso pode causar problemas sérios na coluna.",
        tip: "Dor nas costas + não consegue mexer as pernas = NÃO MEXA! Imobilize e chame o socorro.",
        incidence: "alta",
        trap: true,
        difficulty: 2
    },
    {
        id: "qp41",
        category: "primeiros-socorros",
        statement: "Vítima de acidente tem convulsão com contrações generalizadas e perda de consciência. Como o socorrista deve agir?",
        options: ["Colocar a mão ou objeto duro na boca da vítima para evitar que ela morda a língua.", "Segurar com força braços e pernas da vítima para imobilizá-la durante a convulsão.", "Afastar objetos que possam ferir, proteger a cabeça com material macio e aguardar a crise passar sem conter os movimentos.", "Jogar água fria no rosto da vítima para interromper a convulsão imediatamente."],
        correctIndex: 2,
        explanation: "Correta C: proteja a cabeça, afaste objetos e nunca contenha os movimentos nem coloque nada na boca.",
        detailedExplanation: "Durante a crise, é importante tirar tudo que pode machucar a pessoa, colocar algo macio debaixo da cabeça e NUNCA colocar nada na boca. Isso porque a pessoa não vai engolir a língua e colocar objetos pode machucar. Depois que a crise passar, coloque a pessoa de lado e chame o SAMU se a crise durar mais de 5 minutos.",
        commonMistake: "Muita gente acha que deve colocar algo na boca da pessoa, mas isso é um grande erro.",
        tip: "Convulsão = Protege a cabeça, afasta objetos, NADA na boca.",
        incidence: "media",
        trap: true,
        difficulty: 2
    },
    {
        id: "qp42",
        category: "legislacao",
        statement: "Cidadão quer pilotar ciclomotor de até 50cc com a Autorização para Conduzir Ciclomotor. Qual a idade mínima e a validade inicial?",
        options: ["Idade mínima de 16 anos, se emancipado, com validade inicial de 2 anos para a autorização.", "Idade mínima de 18 anos, pela imputabilidade penal, com validade inicial de 1 ano em caráter provisório.", "Idade mínima de 18 anos, com concessão direta em caráter definitivo, sem período probatório.", "Idade mínima de 21 anos, com exigência de curso de especialização para ciclomotor."],
        correctIndex: 1,
        explanation: "Correta B: a ACC exige 18 anos pela imputabilidade penal e tem 1 ano inicial provisório. Base: arts. 140 e 148 do CTB.",
        detailedExplanation: "Segundo o CTB, pra se habilitar, a pessoa tem que ser maior de 18 anos e responder pelos seus atos. A ACC começa com uma autorização provisória, que dura 1 ano, e se não rolar infração grave, você ganha a definitiva depois.",
        legalBase: "Art. 140 e Art. 148 do CTB",
        commonMistake: "Muita gente pensa que menores de 18 anos podem tirar a ACC por serem emancipados, mas isso não muda a maioridade penal exigida.",
        tip: "ACC = 18 anos completos (imputabilidade penal).",
        incidence: "media",
        trap: true,
        difficulty: 2
    },
    {
        id: "qp43",
        category: "legislacao",
        statement: "Condutor com categoria B há 3 anos quer habilitar-se nas categorias C, D e E. Quais os requisitos de idade e tempo de habilitação?",
        options: ["C: 21 anos e 2 anos na B. D: 24 anos e 2 anos na B. E: 21 anos e 2 anos na B.", "C: 18 anos e habilitação na B. D: 21 anos e 2 anos na B. E: 21 anos e 1 ano na C.", "C: 18 anos e habilitação na B. D: 21 anos e 2 anos na B ou 1 ano na C. E: 21 anos e 1 ano na C.", "C: 21 anos e 1 ano na B. D: 21 anos e 2 anos na B. E: 24 anos e 2 anos na C."],
        correctIndex: 2,
        explanation: "Correta C: C exige 18 anos e B; D exige 21 anos e 2 anos de B ou 1 de C; E exige 21 anos e 1 de C. Art. 145 do CTB.",
        detailedExplanation: "Pra categoria C, você precisa ter pelo menos 18 anos e já estar com a B. Na D, são 21 anos e 2 anos com a B ou 1 ano com a C. E na E, também 21 anos, mas só precisa de 1 ano na C. Lembre-se: D não exige 24 anos, isso mudou!",
        legalBase: "Art. 145 do CTB (alterado pela Lei 14.071/2021)",
        commonMistake: "A galera confunde com os 24 anos pra D e 2 anos pra E, mas tá errado!",
        tip: "C = 18+B. D = 21+2B/1C. E = 21+1C. Decore isso e não vai errar!",
        incidence: "altissima",
        trap: true,
        difficulty: 3
    },
    {
        id: "qp44",
        category: "legislacao",
        statement: "Condutor com EAR exerce atividade remunerada e atinge alta pontuação. Qual o limite fixo para suspensão do direito de dirigir?",
        options: ["Limite de 30 pontos para suspensão, seja qual for a natureza das infrações cometidas.", "Não se aplica sistema de pontos ao EAR, cabendo apenas multa isolada.", "Limite fixo de 40 pontos para suspensão, seja qual for a natureza das infrações cometidas.", "Perda do direito de dirigir ao atingir 20 pontos, seja qual for a gravidade das infrações."],
        correctIndex: 2,
        explanation: "Correta C: o condutor EAR tem limite fixo de 40 pontos para suspensão, sem variação por gravidade. Art. 261 do CTB.",
        detailedExplanation: "Antes da nova lei, o condutor EAR tinha 40 pontos, enquanto os outros tinham 20. Agora, todos têm limites variáveis, mas o EAR continua com os 40 pontos, independente das infrações. Isso é importante porque a habilitação deles afeta o trabalho e a renda.",
        legalBase: "Art. 261, §2º e §6º do CTB (Lei 14.071/2021)",
        commonMistake: "Muita gente pensa que a regra de 40 pontos para EAR não existe mais, mas ela ainda tá firme e forte como uma regra especial.",
        tip: "EAR = 40 pontos SEMPRE. É o limite fixo especial para profissionais.",
        incidence: "alta",
        trap: true,
        difficulty: 2
    },
    {
        id: "qp45",
        category: "legislacao",
        statement: "Condutor teve a CNH suspensa por pontos e quer voltar a dirigir. Qual o prazo da suspensão e o requisito para reabilitar-se?",
        options: ["Suspensão de 30 dias a 12 meses, com curso de reciclagem obrigatório para reabilitar-se.", "Suspensão definitiva, com obrigação de reiniciar todo o processo de habilitação.", "Permissão para dirigir normalmente durante o recurso, sem qualquer restrição até o julgamento.", "Suspensão por pontos exige só pagar as multas, sem necessidade de curso para reabilitar-se."],
        correctIndex: 0,
        explanation: "Correta A: a suspensão dura de 30 dias a 12 meses e exige curso de reciclagem. Base: arts. 261 e 268 do CTB.",
        detailedExplanation: "Quando a CNH é suspensa, você não pode dirigir por um tempo que varia de 30 dias a 12 meses, dependendo da infração. Pra voltar a dirigir, precisa fazer um curso de reciclagem e passar na prova teórica. Se dirigir durante a suspensão, é considerado crime!",
        legalBase: "Arts. 261, 268 e 307 do CTB",
        commonMistake: "Muita gente acha que só pagar a multa resolve, mas precisa fazer o curso de reciclagem também.",
        tip: "CNH suspensa = curso de reciclagem + prova teórica. Dirigir suspenso é crime!",
        incidence: "alta",
        trap: true,
        difficulty: 2
    },
    {
        id: "qp46",
        category: "legislacao",
        statement: "Pela Lei 14.071/2021, o prazo de validade da CNH varia conforme a idade. Quais os prazos corretos por faixa etária?",
        options: ["10 anos até 50 anos; 5 anos de 50 a 69 anos; 3 anos a partir de 70 anos.", "10 anos até 60 anos; 5 anos de 60 a 69 anos; 3 anos a partir de 70 anos.", "5 anos para todas as idades, com exame médico anual obrigatório após 65 anos.", "10 anos até 65 anos; 5 anos de 65 a 74 anos; 2 anos a partir de 75 anos."],
        correctIndex: 0,
        explanation: "Correta A: até 50 anos vale 10 anos; 50 a 69 vale 5 anos; 70 ou mais vale 3 anos. Art. 147 do CTB.",
        detailedExplanation: "A Lei 14.071/2021 mudou os prazos da CNH: quem tem até 50 anos fica com 10 anos de validade; entre 50 e 69 anos, a validade é de 5 anos; e para quem tem 70 anos ou mais, a validade é de 3 anos. Esses prazos começam a contar da data que você tira a CNH.",
        legalBase: "Art. 147, §2º do CTB (Lei 14.071/2021)",
        commonMistake: "Muita gente confunde as idades ou troca os prazos, mas decore: 50-10 / 50a69-5 / 70-3.",
        tip: "Validade CNH: <50 = 10a / 50-69 = 5a / 70+ = 3a.",
        incidence: "altissima",
        trap: true,
        difficulty: 2
    },
    {
        id: "qp47",
        category: "direcao-defensiva",
        statement: "Direção defensiva define distância de reação, de frenagem e de parada. Qual conceito está descrito de forma correta?",
        options: ["Reação é o trecho desde o acionamento do freio até a parada total do veículo.", "Frenagem é o trecho desde a percepção do perigo até o acionamento do freio.", "Parada é a soma da reação com a frenagem, da percepção do perigo até a imobilização total.", "Reação é sempre maior que a frenagem em condições normais de pista e pneus."],
        correctIndex: 2,
        explanation: "Correta C: distância de parada soma reação, da percepção ao freio, com frenagem, do freio à parada.",
        detailedExplanation: "Temos três conceitos importantes: Distância de REAÇÃO, que é o que andamos desde que vemos o perigo até pisar no freio. Distância de FRENAGEM, que é a distância que o carro percorre até parar depois de acionar o freio. A Distância de PARADA é a soma das duas. A alternativa A confunde os conceitos e a B inverte. A D é falsa porque depende das condições da pista.",
        commonMistake: "A galera costuma trocar as definições de reação e frenagem. Lembre-se: REAÇÃO é até frear e FRENAGEM é até parar.",
        tip: "PARADA = REAÇÃO + FRENAGEM. Perceber → Freiar → Parar.",
        incidence: "alta",
        trap: true,
        difficulty: 3
    },
    {
        id: "qp48",
        category: "direcao-defensiva",
        statement: "Sob chuva forte, o carro passa sobre poça, o volante fica leve e perde aderência. É aquaplanagem. Como retomar o controle?",
        options: ["Frear com força e girar o volante contra a derrapagem para realinhar o veículo.", "Desligar o motor de imediato para reduzir a velocidade e recuperar a aderência.", "Tirar o pé do acelerador, manter o volante reto e não frear, aguardando os pneus voltarem ao solo.", "Acelerar com firmeza para expulsar a água dos sulcos e recuperar a aderência."],
        correctIndex: 2,
        explanation: "Correta C: na aquaplanagem, tire o pé do acelerador, segure o volante reto e não freie até retomar o contato.",
        detailedExplanation: "Aquaplanagem acontece quando a água forma uma camada entre os pneus e o asfalto, fazendo o carro 'flutuar'. O volante fica leve e o motorista perde o controle. O certo é: (1) TIRAR o pé do acelerador, (2) MANTER o volante FIRME e reto, (3) NÃO FREAR, e (4) esperar os pneus voltarem a ter contato com o chão.",
        commonMistake: "Muita gente acha que deve frear ou virar o volante, mas isso só piora a situação.",
        tip: "Aquaplanagem = Pé fora do acelerador, volante reto, sem freio.",
        incidence: "alta",
        trap: true,
        difficulty: 2
    },
    {
        id: "qp49",
        category: "direcao-defensiva",
        statement: "Em curva rápida, o condutor sente o corpo empurrado para fora da curva. Qual fenômeno físico explica essa instabilidade?",
        options: ["Força centrípeta, que puxa o veículo para dentro da curva e é anulada pelo peso do veículo.", "Força centrífuga, que empurra o veículo para fora da curva e cresce com a velocidade, exigindo reduzir antes da curva.", "Atrito lateral, que faz o pneu deslizar para o lado quando o veículo está lento na curva.", "Momento de inércia, que mantém o veículo reto e exige aceleração constante dentro da curva."],
        correctIndex: 1,
        explanation: "Correta B: a força centrífuga empurra para fora da curva e aumenta com a velocidade; reduza antes de entrar nela.",
        detailedExplanation: "A força centrífuga é a que faz o carro querer sair da curva, jogando ele pra fora. Quanto mais rápido você vai, mais forte é essa força. O jeito certo é desacelerar antes da curva e, durante, manter a velocidade ou acelerar devagar na saída.",
        commonMistake: "Muita gente confunde 'centrífuga' com 'centrípeta'. Lembre-se: centríFUGA = FUGE pra fora e centríPETA = PUXA pra dentro.",
        tip: "CentríFUGA = para FUGA. Reduza ANTES da curva, não durante.",
        incidence: "media",
        trap: true,
        difficulty: 2
    },
    {
        id: "qp50",
        category: "direcao-defensiva",
        statement: "Em rodovia de pista dupla, como usar os faróis de dia e à noite segundo o CTB e a direção defensiva?",
        options: ["Manter farol alto sempre aceso em rodovia para ampliar a visibilidade, com ou sem outros veículos.", "Usar farol baixo aceso em rodovia mesmo de dia e, à noite, farol alto, reduzindo ao cruzar ou seguir outro veículo.", "Usar farol alto à noite só em via rural sem pavimento, sendo proibido em rodovia pavimentada.", "Substituir o farol baixo pela luz de neblina à noite, por ser eficiente e econômica."],
        correctIndex: 1,
        explanation: "Correta B: farol baixo aceso de dia em rodovia; à noite, alto com redução ao cruzar ou seguir. Arts. 40 e 250 do CTB.",
        detailedExplanation: "O CTB manda usar farol baixo durante o dia em rodovias, isso é obrigatório desde 2016. À noite, o farol alto ajuda a ver melhor, mas deve ser reduzido ao cruzar com outro carro ou ao seguir um, pra não ofuscar a visão de quem vem. Lembre-se, a luz de neblina não substitui o farol baixo e só deve ser usada em situações de muita chuva ou neblina.",
        legalBase: "Art. 40, II e III / Art. 250 do CTB",
        commonMistake: "Muita gente pensa que pode deixar o farol alto ligado sempre, mas tem que saber quando reduzir.",
        tip: "Farol baixo em rodovias (dia). Farol alto à noite, reduzindo ao cruzar/seguir.",
        incidence: "alta",
        difficulty: 1
    },
    {
        id: "qp51",
        category: "direcao-defensiva",
        statement: "Caminhão segue na faixa da direita em rodovia duplicada e o condutor quer ultrapassá-lo pela esquerda. O que deve fazer?",
        options: ["Buzinar de forma contínua ao aproximar-se e acelerar ao máximo para ficar pouco tempo na faixa ao lado.", "Conferir o espaço, sinalizar com a seta, ultrapassar pela esquerda e voltar à direita só após ver o caminhão no retrovisor interno.", "Ultrapassar pela direita ou pelo acostamento, pois caminhões circulam sempre pela faixa da esquerda.", "Ligar o pisca-alerta antes da manobra para avisar a todos sobre a ultrapassagem."],
        correctIndex: 1,
        explanation: "Correta B: ultrapasse pela esquerda com seta e espaço seguro, retornando só após ver o veículo no retrovisor. Arts. 196 a 199 do CTB.",
        detailedExplanation: "Para ultrapassar de forma segura, você precisa: (1) olhar se a faixa da esquerda tá livre e se dá pra passar; (2) sinalizar com a seta pra esquerda; (3) acelerar um pouco e ultrapassar; (4) só voltar pra direita quando ver o caminhão no retrovisor interno. Lembre-se que ultrapassar pela direita é proibido, a não ser que o da esquerda esteja virando.",
        legalBase: "Arts. 196 a 199 do CTB",
        commonMistake: "Muita gente pensa que pode usar o pisca-alerta ou buzinar pra avisar, mas o certo é usar a seta pra esquerda e garantir a segurança.",
        tip: "Ultrapassar = seta esquerda, acelere, ultrapasse, volte ao ver no retrovisor.",
        incidence: "alta",
        difficulty: 1
    },
    {
        id: "qp52",
        category: "prioridade",
        statement: "Em rotatória sem semáforo, um carro já circula na faixa interna e outro quer entrar. Quem tem preferência de passagem?",
        options: ["O veículo que vai entrar, pois a manobra de ingresso garante prioridade sobre o fluxo interno.", "O veículo que já circula na rotatória; quem se aproxima deve aguardar a passagem.", "O veículo que vem pela direita, pois a regra da direita prevalece sobre a regra da rotatória.", "Todos ao mesmo tempo, cabendo transpor a entrada pela ordem de chegada ao conflito."],
        correctIndex: 1,
        explanation: "Correta B: quem já circula na rotatória tem preferência; quem chega deve aguardar. Art. 29, II do CTB.",
        detailedExplanation: "Em rotatórias, a regra é clara: o carro que já está dentro passa primeiro, mesmo que outro veículo venha pela direita. O motorista que vai entrar deve desacelerar e esperar um momento seguro para entrar, garantindo que o trânsito flua sem parar.",
        legalBase: "Art. 29, II e III do CTB / Res. CONTRAN 745/2018",
        commonMistake: "Muita gente confunde a regra da direita com a da rotatória; lembre-se: quem está DENTRO passa primeiro.",
        tip: "Rotatória = DENTRO tem preferência; quem entra aguarda.",
        incidence: "alta",
        trap: true,
        difficulty: 2
    },
    {
        id: "qp53",
        category: "prioridade",
        statement: "Ambulância em urgência, com sirene e giroflex ligados, chega a cruzamento fechado com pista obstruída. Como agir?",
        options: ["Permanecer parado, pois o sinal vermelho prevalece sobre qualquer prioridade de passagem.", "Avançar o vermelho de imediato sem sinalizar para liberar passagem à ambulância.", "Deslocar-se com segurança para a esquerda, abrir passagem pela direita e, se preciso, avançar o vermelho com cuidado.", "Buzinar para indicar o sinal fechado e ficar parado sobre o eixo da via."],
        correctIndex: 2,
        explanation: "Correta C: com sirene ligada há prioridade; desloque à esquerda, libere a direita e avance o vermelho com cuidado. Art. 29 do CTB.",
        detailedExplanation: "Veículos de emergência, como ambulâncias e viaturas, têm prioridade em situações de urgência. Os outros motoristas precisam se mover para a esquerda e deixar a passagem livre pela direita. Se estiverem em um cruzamento, podem avançar o sinal vermelho com cuidado para ajudar a ambulância a passar.",
        legalBase: "Art. 29, §2º do CTB",
        commonMistake: "Muita gente pensa que nunca pode avançar o sinal vermelho, mas dar passagem a veículo de emergência é uma exceção. A passagem deve ser pela esquerda.",
        tip: "Sirene ligada = DESLOQUE para a esquerda, passe pela direita e avance o sinal se precisar.",
        incidence: "alta",
        trap: true,
        difficulty: 2
    },
    {
        id: "qp54",
        category: "prioridade",
        statement: "Em faixa sem semáforo, pessoa com bengala branca estendida aguarda na calçada para atravessar. Qual a conduta do condutor?",
        options: ["Buzinar para avisar da presença do veículo, pois o pedestre pode não perceber a aproximação.", "Reduzir a velocidade e passar devagar pela faixa, mantendo distância segura do pedestre parado.", "Parar o veículo e aguardar a travessia completa, garantindo prioridade total à pessoa com deficiência visual.", "Seguir normalmente, pois sem semáforo há igualdade de condições na travessia."],
        correctIndex: 2,
        explanation: "Correta C: pessoa com bengala branca tem prioridade; pare e aguarde a travessia completa. Art. 70 do CTB.",
        detailedExplanation: "De acordo com as leis, quem usa bengala branca tem prioridade absoluta sobre os carros. O motorista não pode só reduzir a velocidade, ele precisa parar e deixar o pedestre passar com segurança. A buzina pode assustar e apressar o pedestre, e acelerar para passar é uma infração grave.",
        legalBase: "Art. 70 do CTB / Lei 13.146/2015 (Estatuto da Pessoa com Deficiência)",
        commonMistake: "Muita gente pensa que só reduzir a velocidade é suficiente, mas para quem tem deficiência, a prioridade é TOTAL — é preciso PARAR e esperar.",
        tip: "Bengala branca (deficiente visual) = PARE e aguarde. Prioridade total.",
        incidence: "media",
        trap: true,
        difficulty: 2
    },
    {
        id: "qp55",
        category: "placas",
        statement: "Em rodovia há placa azul com telefone e, adiante, placa verde com cidade e distância. A que grupos essas placas pertencem?",
        options: ["Ambas de regulamentação, pois trazem ordens de cumprimento obrigatório pelo condutor.", "A primeira é de advertência de serviço e a segunda de regulamentação de destino.", "A primeira indica serviço auxiliar e a segunda orienta destino; ambas são de indicação.", "A primeira é de advertência e a segunda de indicação turística de traçado."],
        correctIndex: 2,
        explanation: "Correta C: placa azul de serviço auxiliar e placa verde de destino são sinalização de indicação.",
        detailedExplanation: "Sinalização de INDICAÇÃO tem placas azuis com símbolo branco pra serviços, como hospitais e postos. As placas verdes dão informações sobre cidades e distâncias. Lembre-se das cores: azul é serviço e verde é destino.",
        commonMistake: "Muita gente confunde as cores das placas; azul é pra serviços, verde é pra destinos.",
        tip: "Azul = serviço. Verde = destino. Ambas = INDICAÇÃO.",
        incidence: "alta",
        trap: true,
        difficulty: 2
    },
    {
        id: "qp56",
        category: "placas",
        statement: "Condutor vê placa circular branca com orla vermelha e buzina riscada e, adiante, losango amarelo com criança. Como classificá-las?",
        options: ["A primeira adverte sobre veículos sonoros e a segunda obriga o uso da buzina no trecho.", "A primeira é de regulamentação e proíbe sinal sonoro; a segunda é de advertência e alerta para crianças.", "Ambas são de regulamentação, pois impõem condutas obrigatórias ao condutor.", "A primeira é de regulamentação e a segunda indica serviço auxiliar de trânsito."],
        correctIndex: 1,
        explanation: "Correta B: círculo branco com borda vermelha é regulamentação; losango amarelo é advertência.",
        detailedExplanation: "As placas se classificam pela forma e cor: REDONDA, fundo BRANCO e borda VERMELHA mostra regras ou proibições, como a R-19. Já a QUADRADA, fundo AMARELO, serve pra avisar sobre perigos, como a A-32b que indica área com crianças.",
        legalBase: "Manual Brasileiro de Sinalização de Trânsito — Volume I (Sinalização Vertical)",
        commonMistake: "Muita gente confunde placas REDONDAS (regulamentação) com QUADRADAS (advertência).",
        tip: "Redonda = REGULAMENTAÇÃO; Quadrada = ADVERTÊNCIA.",
        incidence: "alta",
        trap: true,
        difficulty: 2
    },
    {
        id: "qd01",
        category: "placas",
        statement: "Em rodovia em obras, a placa A-10 avisa que a pista vai afunilar adiante. Como o condutor deve agir ao se aproximar?",
        options: ["Acelerar para passar pelo afunilamento antes dos outros e garantir a preferência.", "Reduzir a velocidade, observar a sinalização e revezar a passagem com os veículos já no trecho.", "Imobilizar o veículo no centro da pista com pisca-alerta até o trânsito fluir.", "Manter a velocidade e buzinar repetidamente para alertar os demais usuários."],
        correctIndex: 1,
        explanation: "Correta B: placa A-10 indica estreitamento; reduza e alterne a passagem no sistema zíper.",
        detailedExplanation: "Quando a pista afunila, a placa A-10 aparece pra avisar que as faixas vão diminuir. O que você deve fazer é reduzir a velocidade, ficar atento e cooperar na passagem, deixando os carros entrarem de forma alternada, tipo um zíper. Acelerar, parar no meio ou buzinar só atrapalha e pode causar acidentes.",
        legalBase: "Manual Brasileiro de Sinalização de Trânsito — Volume I (placa A-10) e princípios da direção defensiva",
        commonMistake: "Muita gente confunde a placa A-10 com 'pare' ou 'preferência', mas ela é só um aviso de que a pista vai estreitar.",
        tip: "A-10 = Estreitamento = Reduz e ajuda no zíper.",
        incidence: "alta",
        trap: true,
        difficulty: 2
    },
    {
        id: "qd02",
        category: "legislacao",
        statement: "Pelo art. 90 do CTB, o apito do agente é sinal sonoro oficial. Qual o significado correto de cada tipo de silvo?",
        options: ["Um silvo longo libera a passagem e dois silvos breves mandam reduzir a marcha.", "Um silvo breve libera; dois breves mandam parar; um longo manda reduzir a marcha.", "Os silvos não têm significado oficial e servem só para chamar a atenção.", "O apito só vale com gestos; sozinho, não orienta o trânsito."],
        correctIndex: 1,
        explanation: "Correta B: um breve siga; dois breves pare; um longo reduza a marcha. Art. 90 do CTB.",
        detailedExplanation: "O apito do agente é uma forma oficial de sinalização. Um silvo breve significa 'siga'; dois silvos breves significam 'pare'; e um silvo longo significa 'diminuam a marcha'. Decorar esses sinais é fácil e ajuda na prova.",
        legalBase: "Art. 90 do CTB",
        commonMistake: "Muita gente confunde e acha que dois silvos breves significam 'siga' ou que o silvo longo é pra parar. Lembre: 1 breve = siga; 2 breves = pare; 1 longo = devagar.",
        tip: "1 pio = vai; 2 pios = para; 1 pio longo = devagar.",
        incidence: "altissima",
        trap: true,
        difficulty: 2,
        group: "silvos-apito",
        origin: "real"
    },
    {
        id: "qd03",
        category: "legislacao",
        statement: "Em cruzamento com semáforo ligado, o agente manda uma via avançar e a outra parar. Qual ordem deve ser obedecida?",
        options: ["Os gestos do agente, pois prevalecem sobre semáforo, placas e demais sinais.", "O semáforo, pois o equipamento eletrônico prevalece sobre ordens humanas.", "As placas, por serem elementos fixos e permanentes da sinalização.", "O semáforo, pois o agente atua só como orientador sem poder de autuação."],
        correctIndex: 0,
        explanation: "Correta A: ordens do agente prevalecem sobre semáforo e demais sinais. Arts. 89 e 195 do CTB.",
        detailedExplanation: "Quando um agente de trânsito está orientando o trânsito, ele tem prioridade nas ordens. Isso significa que, mesmo que o semáforo esteja vermelho, se o agente pedir para parar, o motorista deve obedecer. Ignorar isso é uma infração.",
        legalBase: "Arts. 89 e 195 do CTB",
        commonMistake: "Muita gente acha que o semáforo é mais importante que o agente, mas na verdade é o contrário.",
        tip: "Agente manda = Motorista obedece, mesmo que o semáforo esteja vermelho.",
        incidence: "altissima",
        trap: true,
        difficulty: 2
    },
    {
        id: "qp57",
        category: "legislacao",
        statement: "Em via urbana de mão dupla sem canteiro, o condutor quer converter à esquerda. Como posicionar-se e executar a manobra?",
        options: ["Aproximar-se do canto esquerdo da via, parar e cruzar assim que for possível.", "Aproximar-se da linha central sem invadir a contramão e só converter após ceder ao fluxo oposto.", "Aproximar-se do bordo direito ou do acostamento, parar e aguardar a via ficar livre.", "Ficar no centro da faixa com pisca-alerta e converter rápido, pois tem preferência."],
        correctIndex: 1,
        explanation: "Correta B: em mão dupla, chegue perto da linha central sem invadir e ceda ao fluxo oposto. Art. 38 do CTB.",
        detailedExplanation: "Quando for virar à esquerda em via de duplo sentido, o motorista precisa se posicionar com antecedência perto da linha central, mas sem cruzá-la. Ele deve esperar os carros que vêm de frente antes de fazer a conversão.",
        legalBase: "Arts. 38, II e 40 do CTB",
        commonMistake: "Muita gente confunde e acha que pode usar o 'bordo esquerdo' em via de duplo sentido, mas isso é contramão!",
        tip: "Esquerda em mão dupla = perto da LINHA CENTRAL (sem invadir) + ceder passagem a quem vem de frente.",
        incidence: "altissima",
        trap: true,
        difficulty: 3
    },
    {
        id: "qp58",
        category: "mecanica",
        statement: "No trânsito, o fluxo para de repente, o condutor erra nos comandos e as rodas traseiras travam com derrapagem. Qual a causa?",
        options: ["Pisar no freio de forma progressiva e acionar a embreagem antes da parada total.", "Puxar o freio de mão com o carro em movimento ou reduzir marcha em alta rotação, travando o eixo traseiro.", "Atuação do ABS, que trava tambor e sapata traseiros para máxima desaceleração.", "Falha de fluido no cilindro mestre, que equaliza a pressão e trava só o freio traseiro."],
        correctIndex: 1,
        explanation: "Correta B: freio de mão em movimento ou redução brusca trava as rodas traseiras; ABS evita o travamento.",
        detailedExplanation: "Quando você puxa o freio de estacionamento (freio de mão) enquanto o carro está em movimento, ele trava as rodas traseiras, o que pode causar derrapagem. Outra situação é quando você reduz a marcha de forma abrupta em alta velocidade, o que também pode travar o eixo traseiro e tirar a aderência. O correto é usar o pedal de freio e embreagem para parar sem travar as rodas.",
        legalBase: "Fundamentos de mecânica veicular e condução segura (art. 28 do CTB)",
        commonMistake: "Muita gente acha que o ABS trava as rodas, mas na verdade ele evita isso!",
        tip: "Traseira travou = freio de MÃO em movimento ou marcha reduzida rápida.",
        incidence: "alta",
        trap: true,
        difficulty: 3
    },
    {
        id: "qp59",
        category: "direcao-defensiva",
        statement: "À saída de escola, há muitas crianças no bordo da pista atravessando fora da faixa. Qual a conduta defensiva em área escolar?",
        options: ["Acelerar para passar rápido pelo grupo, usando a buzina para afastar as crianças.", "Reduzir a velocidade ao trecho, com atenção total e prontidão para frear e parar.", "Manter a velocidade máxima da placa, pois a travessia fora da faixa é culpa dos pedestres.", "Ligar o pisca-alerta, manter a velocidade e usar farol alto para garantir preferência."],
        correctIndex: 1,
        explanation: "Correta B: em área escolar, reduza abaixo do limite, com atenção total e pronto para parar. Arts. 28 e 29 do CTB.",
        detailedExplanation: "Quando tem aglomeração de crianças, a segurança é mais importante que a velocidade que tá na placa. O motorista deve dirigir devagar, prestar atenção e estar preparado pra parar, porque acelerar ou buzinar pode colocar os mais vulneráveis em risco. Ignorar a situação real e manter a velocidade da placa não é seguro, e o pisca-alerta não pode ser usado com o carro em movimento.",
        legalBase: "Arts. 28, 29 e 40 do CTB e princípios da direção defensiva",
        commonMistake: "O erro comum é achar que pode manter a velocidade da placa, mesmo com risco de acidente.",
        tip: "Criança na rua = REDUZIR a velocidade + atenção redobrada + pronto pra parar.",
        incidence: "altissima",
        trap: true,
        difficulty: 2,
        image_url: "https://tqeqsotsasglmhlmwdwy.supabase.co/storage/v1/object/public/library/images/placa-area-escolar-A-33A.webp"
    },
    {
        id: "qp60",
        category: "direcao-defensiva",
        statement: "Em rodovia rápida de pista dupla, o condutor perde a alça de acesso desejada. Qual a conduta correta e segura?",
        options: ["Parar no acostamento, ligar o pisca-alerta e dar marcha ré até alcançar a alça perdida.", "Parar no acostamento, descer do carro e buscar atalho ou entrada clandestina por perto.", "Seguir na rodovia até a próxima saída ou retorno sinalizado e liberado.", "Seguir devagar pela direita com seta ligada, aguardando brecha no canteiro central."],
        correctIndex: 2,
        explanation: "Correta C: perdeu a saída, siga até o próximo retorno sinalizado; ré em rodovia é infração gravíssima. Art. 206 do CTB.",
        detailedExplanation: "Em rodovias rápidas, tentar voltar pode ser muito perigoso e causar acidentes. A melhor opção é seguir até o próximo retorno oficial, mesmo que isso signifique rodar mais alguns quilômetros. Fazer marcha à ré ou parar no acostamento sem emergência é uma infração gravíssima e coloca todos em risco.",
        legalBase: "Arts. 206, V e 219 do CTB e princípios da direção defensiva",
        commonMistake: "Muita gente acha que dar uma ré no acostamento resolve, mas isso é gravíssimo e pode causar acidentes.",
        tip: "Perdeu a saída = SEGUE EM FRENTE até o próximo retorno. Ré em rodovia é gravíssima, e parar no acostamento só em emergência real.",
        incidence: "altissima",
        trap: true,
        difficulty: 3
    },
    {
        id: "qp61",
        category: "direcao-defensiva",
        statement: "À noite, em via urbana sem iluminação, o condutor circula com a luz interna de teto acesa. Como avaliar esse hábito?",
        options: ["A luz interna ajuda os outros a ver o carro e funciona como item extra de segurança.", "A luz de teto é para carro parado; em movimento, reflete no para-brisa e prejudica a visão noturna.", "A luz interna substitui a lanterna traseira se o farol queimar, liberando a circulação.", "A luz de teto é recomendada em via sem poste para indicar a presença de pessoas."],
        correctIndex: 1,
        explanation: "Correta B: luz interna em movimento reflete no para-brisa e compromete a visão; não é sinalização. Arts. 40 e 249 do CTB.",
        detailedExplanation: "A luz do teto é só pra ajudar os passageiros e não serve pra sinalizar o carro. Quando tá escuro, a luz acesa dentro do carro reflete no vidro e dificulta a visão do motorista, aumentando as chances de acidente. A alternativa A engana porque mistura a luz interna com as luzes que realmente ajudam a ser visto na estrada.",
        legalBase: "Sistema de iluminação veicular (arts. 40 e 249 do CTB)",
        commonMistake: "A galera confunde a luz interna com as luzes que fazem o carro ser visto, achando que mais luz dentro ajuda na visibilidade externa.",
        tip: "Luz do teto à noite = conforto do passageiro, NÃO sinalização.",
        incidence: "alta",
        trap: true,
        difficulty: 2
    },
    {
        id: "qp62",
        category: "meio-ambiente",
        statement: "Veículo reprovado na inspeção de fumaça e ruído segue circulando sem regularizar escapamento e catalisador. O que se aplica?",
        options: ["Infração gravíssima, com multa, suspensão do direito de dirigir e remoção imediata.", "Infração grave, com multa e retenção do veículo até regularizar e fazer nova inspeção.", "Infração leve, com apenas advertência escrita por ser a primeira ocorrência.", "Crime ambiental, com cassação da CNH e apreensão pelo órgão ambiental."],
        correctIndex: 1,
        explanation: "Correta B: emitir poluentes acima do limite é infração grave com retenção até regularizar. Art. 230 do CTB.",
        detailedExplanation: "Quando o carro não passa na inspeção por causa dos gases e ruídos, isso é considerado infração GRAVE. O veículo fica RETIDO até o dono consertar o sistema de exaustão e o catalisador, e só depois é liberado. Cuidado com a pegadinha da remoção, que não acontece nesse caso!",
        legalBase: "Art. 230, XVIII do CTB",
        commonMistake: "A armadilha mais comum é confundir RETENÇÃO com REMOÇÃO, achando que o carro vai ser guinchado.",
        tip: "Emissão irregular = GRAVE + RETENÇÃO para consertar, não é remoção.",
        incidence: "alta",
        trap: true,
        difficulty: 3
    },
    {
        id: "qp63",
        category: "legislacao",
        statement: "Condutor trafega por via coletora urbana sem placa de velocidade. Qual o limite máximo padrão do CTB nessa via?",
        options: ["30 km/h, padrão das vias locais de acesso restrito às edificações.", "40 km/h, padrão das vias coletoras sem sinalização regulamentadora.", "60 km/h, padrão das vias arteriais de ligação entre regiões.", "80 km/h, padrão das vias urbanas de trânsito rápido."],
        correctIndex: 1,
        explanation: "Correta B: via coletora sem placa tem limite de 40 km/h. Art. 61 do CTB.",
        detailedExplanation: "As vias coletoras são feitas pra juntar e soltar o trânsito que vem das vias principais e ajudam a movimentar os carros nos bairros. Se não tem placa, a velocidade máxima é 40 km/h, que é o limite pra esse tipo de via. Não confunda com a via local, que é 30 km/h, ou a arterial, que é 60 km/h.",
        legalBase: "Arts. 60 e 61 do CTB",
        commonMistake: "Muita gente acha que sem placa não tem limite, mas o padrão ainda vale e a coletora é 40 km/h.",
        tip: "Coletora = 40 km/h. Decore a escada urbana: local 30, coletora 40, arterial 60, trânsito rápido 80.",
        incidence: "altissima",
        trap: true,
        difficulty: 2
    },
    {
        id: "sinistro-sinalizacao-001",
        category: "legislacao",
        statement: "Após sinistro, o veículo ficou parado sobre a pista com trânsito fluindo. Como sinalizar o local de forma correta?",
        options: ["Ligar o pisca-alerta e colocar o triângulo a pelo menos 30 m atrás, perpendicular à via e bem visível.", "Ligar o pisca-alerta e colocar o triângulo a exatos 30 m à frente, paralelo ao eixo da via.", "Colocar o triângulo a 30 m no centro da faixa, sem ligar o pisca-alerta se o carro estiver visível.", "Colocar o triângulo a menos de 30 m atravessado na via, pois o mínimo só vale com vítima."],
        correctIndex: 0,
        explanation: "Correta A: ligue o pisca-alerta e posicione o triângulo a pelo menos 30 m atrás, visível e perpendicular. Art. 176 do CTB.",
        detailedExplanation: "Depois de um acidente, se o motorista puder fazer algo pra evitar mais problemas, ele deve sinalizar bem o local. Isso inclui ligar as luzes de alerta e colocar o triângulo a 30 metros da traseira do carro, de forma que fique visível e na posição certa.",
        legalBase: "CTB, art. 176, V; Resolução CONTRAN nº 36/1998",
        commonMistake: "Colocar o triângulo perto demais do veículo ou esquecer de ligar o pisca-alerta.",
        tip: "Sinistro na pista = Pisca-alerta ligado + Triângulo a no mínimo 30m atrás.",
        incidence: "alta",
        trap: true,
        difficulty: 3
    },
    {
        id: "qp64",
        category: "legislacao",
        statement: "Em via aberta à circulação, qual a regra geral do CTB sobre o lado da via em que o trânsito deve ser feito?",
        options: ["Pelo lado esquerdo, no padrão de mão inglesa, para facilitar ultrapassagens em vias urbanas.", "Pelo lado direito, admitidas apenas as exceções sinalizadas ou em manobra de ultrapassagem.", "Pelo centro da via, para manter distância segura de acostamento, calçada e pedestres.", "Pelo lado com melhor asfalto, cabendo ao condutor escolher a faixa mais conveniente."],
        correctIndex: 1,
        explanation: "Correta B: a regra geral é circular pelo lado direito, salvo exceção sinalizada ou ultrapassagem. Art. 29 do CTB.",
        detailedExplanation: "Na maioria das vezes, os carros circulam pela direita da via. Só pode usar a esquerda para ultrapassar ou se tiver sinalização dizendo que pode. Andar pela contramão é errado e dá multa pesada.",
        legalBase: "Art. 29, II do CTB",
        commonMistake: "Muita gente confunde as regras e acha que pode andar pela esquerda sem prestar atenção nas sinalizações.",
        tip: "Regra = Andar pela direita; Ação = Usar a esquerda só pra ultrapassar.",
        incidence: "altissima",
        trap: true,
        difficulty: 2
    },
    {
        id: "placa_a32a_alta",
        category: "legislacao",
        statement: "Em via urbana, o condutor vê a placa de advertência A-32a. Qual o significado correto e a conduta esperada?",
        options: ["Trânsito de pedestres: há presença habitual de pedestres; redobre a atenção e reduza, mesmo sem faixa marcada.", "Passagem sinalizada de pedestres: pare obrigatoriamente antes do local, pois há faixa pintada com preferência.", "Área escolar: reduza para no máximo 30 km/h, pois há travessia exclusiva de alunos adiante.", "Ordem ao pedestre para andar pela esquerda, válida para acostamentos de rodovias."],
        correctIndex: 0,
        explanation: "Correta A: A-32a sem faixa indica trânsito de pedestres; não confundir com A-32b com faixa nem A-33a escolar.",
        detailedExplanation: "As placas de advertência servem pra avisar, não pra mandar fazer. A A-32a mostra que é comum ter pedestres por ali, então o motorista precisa ter mais atenção e ir devagar. O erro mais comum é achar que é a A-32b, que tem as faixas e indica uma passagem sinalizada.",
        legalBase: "Código de Trânsito Brasileiro (CTB) e Resolução CONTRAN nº 160/04 (Manual de Sinalização - Formato e Significado das Placas de Advertência)",
        commonMistake: "Muita gente confunde a A-32a com a A-32b, que tem as faixas desenhadas, ou com a placa de 'Área Escolar' (A-33a).",
        tip: "Sem faixa na placa amarela = 'Trânsito de Pedestres' (A-32a). Com faixa = 'Passagem Sinalizada de Pedestres' (A-32b).",
        incidence: "alta",
        trap: true,
        difficulty: 3,
        image_url: "https://tqeqsotsasglmhlmwdwy.supabase.co/storage/v1/object/public/library/images/placa-transito-de-pedestre-A32a.webp"
    },
    {
        id: "placa_regulamentacao_advertencia_alta",
        category: "legislacao",
        statement: "O motorista vê placa que proíbe buzina e outra que alerta para área escolar. Como classificar essas duas placas?",
        options: ["A primeira é de regulamentação, imperativa e punitiva; a segunda é de advertência, que alerta para área escolar.", "A primeira é de advertência que sugere evitar buzina; a segunda é de regulamentação que impõe parada.", "Ambas são de regulamentação, pois uma proíbe buzina e a outra obriga reduzir a 30 km/h sob apreensão.", "A primeira é de indicação de área hospitalar; a segunda é de advertência que obriga preferência na faixa."],
        correctIndex: 0,
        explanation: "Correta A: R-20 é regulamentação com penalidade; A-33a é advertência de alerta, sem multa direta.",
        detailedExplanation: "As placas de Regulamentação dizem o que você deve ou não fazer, e desobedecer pode dar multa. As placas de Advertência avisam sobre perigos na pista, mas não multam diretamente.",
        legalBase: "Art. 89 do CTB e Resolução CONTRAN nº 160/2004",
        commonMistake: "Muita gente acha que a placa vermelha só avisa, mas na verdade ela proíbe e pode multar.",
        tip: "Placa Vermelha = Proibido (Multa). Placa Amarela = Cuidado (Alerta).",
        incidence: "alta",
        trap: true,
        difficulty: 3,
        image_url: "https://tqeqsotsasglmhlmwdwy.supabase.co/storage/v1/object/public/library/images/placa-area-escolar-A-33A.webp"
    },
    {
        id: "placa_r20_proibido_buzina_alta",
        category: "legislacao",
        statement: "À noite, perto de hospital, o condutor vê a placa R-20. Qual a classificação, o significado e a punição pelo desrespeito?",
        options: ["Placa de regulamentação que proíbe buzinar no local indicado; desrespeitar é infração leve com multa.", "Placa de advertência que recomenda evitar buzina por cortesia, sem autuação em caso de descumprimento.", "Placa de indicação só para emergência, que libera a buzina com luz vermelha ligada em urgência.", "Placa de regulamentação que proíbe buzina das 22h às 6h, liberando o uso no resto do dia."],
        correctIndex: 0,
        explanation: "Correta A: R-20 é regulamentação que proíbe buzinar no trecho, o dia todo; desrespeitar é infração leve. Art. 227 do CTB.",
        detailedExplanation: "A placa R-20 diz que não pode buzinar no trecho indicado, seja de dia ou de noite. Se alguém desobedecer, vai levar uma multa por infração leve.",
        legalBase: "Art. 227, V do CTB e Resolução CONTRAN nº 160/2004",
        commonMistake: "Muita gente pensa que a proibição só vale à noite ou que é só uma sugestão.",
        tip: "R-20 = Proibido Buzinar (vale 24h). Desrespeito = Infração Leve.",
        incidence: "alta",
        trap: true,
        difficulty: 3,
        image_url: "https://tqeqsotsasglmhlmwdwy.supabase.co/storage/v1/object/public/library/images/placa-R-20.jpg"
    },
    {
        id: "placa_r2_de_a_preferencia_alta_01",
        category: "legislacao",
        statement: "Em interseção sem semáforo, há placa triangular vermelha e branca R-2 à direita. Qual o dever e a punição se descumprir?",
        options: ["Parar sempre antes do cruzamento, mesmo sem veículos, sob pena de infração gravíssima.", "Ceder a passagem a quem está na preferencial, parando se preciso; descumprir é infração grave.", "Seguir como mera recomendação de cautela, sem multa por não parar no local.", "Manter a velocidade, pois o triângulo dá preferência a quem converte à esquerda."],
        correctIndex: 1,
        explanation: "Correta B: R-2 exige ceder a passagem na preferencial; descumprir é infração grave, diferente da R-1 gravíssima. Art. 215 do CTB.",
        detailedExplanation: "A placa R-2 é triangular e única, diferente da R-1 que obriga a parar. Você só precisa parar se tiver carros na via preferencial passando. Não seguir essa regra é considerado uma infração grave.",
        legalBase: "Art. 215, II do CTB e Resolução CONTRAN nº 160/2004",
        commonMistake: "Muita gente confunde 'Dê a Preferência' (R-2 - Infração Grave) com 'Parada Obrigatória' (R-1 - Infração Gravíssima).",
        tip: "Triângulo = Ceda a Passagem (R-2). Pare só se tiver carro na via preferencial.",
        incidence: "alta",
        trap: true,
        difficulty: 3,
        placa: "R-2",
        image_url: "https://tqeqsotsasglmhlmwdwy.supabase.co/storage/v1/object/public/library/images/51.jpg"
    },
    {
        id: "validade_cnh_renovacao_alta_01",
        category: "legislacao",
        statement: "Condutor de 42 anos, categoria B, vai renovar a CNH sem doença progressiva. Qual será a validade do novo exame?",
        options: ["5 anos, caindo para 3 anos ao completar 50 anos de idade.", "10 anos, pois o condutor tem menos de 50 anos de idade.", "5 anos, sendo 10 anos só para profissionais das categorias C, D e E.", "3 anos, prazo único para todos após a mudança da lei."],
        correctIndex: 1,
        explanation: "Correta B: abaixo de 50 anos, o exame vale 10 anos. Art. 147 do CTB com a Lei 14.071/2021.",
        detailedExplanation: "Com a nova lei, o exame de saúde vale 10 anos pra quem tem menos de 50 anos. Se a pessoa tiver entre 50 e 69 anos, vale 5 anos, e a partir de 70 anos, só 3 anos.",
        legalBase: "Art. 147, § 2º, incisos I, II e III do CTB",
        commonMistake: "Muita gente acha que a validade é de 5 anos por conta de regras antigas.",
        tip: "< 50 anos = 10 anos.",
        incidence: "alta",
        trap: true,
        difficulty: 3
    },
    {
        id: "placa_r28_duplo_sentido_alta_01",
        category: "legislacao",
        statement: "Após trecho de sentido único, o condutor encontra a placa R-28. O que muda nas regras de circulação daquele ponto em diante?",
        options: ["A pista passa a ter mão dupla, com fluxo nos dois sentidos de circulação.", "A via passa a ter faixa exclusiva para transporte coletivo e emergência.", "Fica proibida a troca de faixa de rolamento no trecho seguinte.", "Muda a prioridade do cruzamento, com conversão obrigatória à direita."],
        correctIndex: 0,
        explanation: "Correta A: R-28 indica início de mão dupla, com circulação nos dois sentidos a partir da placa.",
        detailedExplanation: "Com a placa R-28, o motorista deve saber que a via, que antes era só de ida, agora permite que carros venham e vão. É importante ficar atento, pois pode ter carro vindo na direção oposta.",
        legalBase: "Anexo II do CTB e Manual Brasileiro de Sinalização de Trânsito",
        commonMistake: "Muita gente confunde a R-28 com a placa A-22, que só avisa que tem mão dupla mais pra frente.",
        tip: "Placa R-28 = Mão dupla começa aqui!",
        incidence: "media",
        trap: true,
        difficulty: 3,
        image_url: "https://tqeqsotsasglmhlmwdwy.supabase.co/storage/v1/object/public/library/images/55.jpg"
    },
    {
        id: "placa_r16_altura_maxima_alta_01",
        category: "legislacao",
        statement: "Caminhão com 4,20 m de altura chega a viaduto com placa R-16 marcando 4 m. O que o motorista deve fazer e qual a punição se avançar?",
        options: ["Pode passar pelo centro do viaduto, pois há margem de tolerância e não há infração.", "Está proibido de passar pelo local e deve buscar outra rota; avançar é infração grave.", "A placa limita só a largura da pista e autoriza a passagem de qualquer altura.", "Deve esvaziar parte dos pneus para rebaixar o veículo e transpor o obstáculo."],
        correctIndex: 1,
        explanation: "Correta B: R-16 fixa altura máxima; veículo acima do limite não pode passar; avançar é infração grave. Art. 231 do CTB.",
        detailedExplanation: "A placa R-16 (Altura máxima permitida) indica até onde o veículo pode ir com a carga. Se o carro passar desse limite, é considerado uma infração grave.",
        legalBase: "Art. 231, VI do CTB",
        commonMistake: "Muita gente confunde a altura máxima permitida (R-16) com a altura limitada (A-37).",
        tip: "Placa de ALTURA = Limite. Se passar, não pode seguir em frente.",
        incidence: "alta",
        trap: true,
        difficulty: 3,
        image_url: "https://tqeqsotsasglmhlmwdwy.supabase.co/storage/v1/object/public/library/images/52.jpg"
    },
    {
        id: "placa_a42a_inicio_pista_dupla_alta_01",
        category: "legislacao",
        statement: "Em rodovia de pista simples, o condutor vê a placa A-42a. O que essa advertência informa sobre a via adiante?",
        options: ["A pista simples passará a ter sentidos separados por canteiro ou barreira: início de pista dupla.", "Há fim do canteiro central, com retorno da pista à operação em pista simples.", "Há cruzamento com via preferencial a cerca de 100 metros adiante.", "O tráfego será canalizado em faixa única por motivo de obras na pista."],
        correctIndex: 0,
        explanation: "Correta A: A-42a adverte início de pista dupla, com sentidos opostos separados por canteiro ou barreira.",
        detailedExplanation: "Essa sinalização mostra que os carros vão passar a ter sentidos opostos, separados por um canteiro ou barreira. É importante ficar ligado, pois muda a dinâmica do tráfego.",
        legalBase: "Manual Brasileiro de Sinalização de Trânsito - Volume II (CONTRAN)",
        commonMistake: "Muita gente confunde 'Início de Pista Dupla' (A-42a) com 'Fim de Pista Dupla' (A-42b).",
        tip: "Placa com canteiro e setas = PISTA DUPLA CHEGANDO!",
        incidence: "media",
        trap: false,
        difficulty: 2,
        image_url: "https://tqeqsotsasglmhlmwdwy.supabase.co/storage/v1/object/public/library/images/54.png"
    },
    {
        id: "placa_a14_semaforo_frente_alta_01",
        category: "legislacao",
        statement: "Em trecho periurbano rápido, o condutor vê a placa A-14. Qual a finalidade do aviso e a ação preventiva correta?",
        options: ["Adverte semáforo adiante; reduza a velocidade e prepare-se para uma eventual parada.", "Exige parada imediata no ponto onde a placa está instalada.", "Alerta para fiscalização eletrônica de velocidade por radar no trecho.", "Informa cruzamento sem sinalização de preferência entre as vias."],
        correctIndex: 0,
        explanation: "Correta A: A-14 adverte semáforo à frente; reduza e prepare-se para parar se preciso.",
        detailedExplanation: "Ela é do tipo de aviso e serve pra você se preparar pra parar, se precisar. Assim, dá tempo de diminuir a velocidade antes de chegar no semáforo.",
        legalBase: "Resolução CONTRAN nº 160/2004",
        commonMistake: "Muita gente pensa que precisa parar logo ali, mas é só um aviso pra se preparar.",
        tip: "Placa amarela = Semáforo à frente, então reduza a velocidade!",
        incidence: "alta",
        trap: false,
        difficulty: 2,
        image_url: "https://tqeqsotsasglmhlmwdwy.supabase.co/storage/v1/object/public/library/images/50.jpg"
    },
    {
        id: "nova_velocidade_vias_locais_alta_01",
        category: "legislacao",
        statement: "Condutor trafega por via local em bairro residencial, sem placa de velocidade. Qual o limite máximo padrão do CTB?",
        options: ["30 km/h, por ser via local sem sinalização regulamentadora.", "40 km/h, limite padrão das vias coletoras urbanas.", "50 km/h, limite geral das vias urbanas de circulação.", "20 km/h, por ser área residencial exclusiva de pedestres."],
        correctIndex: 0,
        explanation: "Correta A: via local sem placa tem limite de 30 km/h. Art. 61 do CTB.",
        detailedExplanation: "Nas ruas sem sinalização, a velocidade varia: 80 km/h nas rápidas, 60 km/h nas arteriais, 40 km/h nas coletoras e 30 km/h nas locais. Então, como essa é uma via local, o limite é 30 km/h.",
        legalBase: "Art. 61, § 1º, I, d do CTB",
        commonMistake: "Muita gente confunde a velocidade de via local (30 km/h) com a de via coletora (40 km/h).",
        tip: "Via Local = 30 km/h | Via Coletora = 40 km/h.",
        incidence: "alta",
        trap: true,
        difficulty: 3
    },
    {
        id: "nova_advertencia_escrito_alta_02",
        category: "infracoes",
        statement: "Condutor comete infração leve e não tem outra multa nos últimos 12 meses. Qual medida deve ser aplicada obrigatoriamente?",
        options: ["Multa com 50% de desconto e registro de pontos na CNH.", "Conversão obrigatória em advertência por escrito, de caráter educativo.", "Reciclagem obrigatória no DETRAN como medida administrativa.", "Suspensão do direito de dirigir por até 30 dias."],
        correctIndex: 1,
        explanation: "Correta B: infração leve ou média sem reincidência em 12 meses vira advertência escrita. Art. 267 do CTB.",
        detailedExplanation: "A lei diz que, se a infração é leve ou média e o motorista não tem histórico de outras infrações, a multa deve ser trocada por uma advertência. Isso é pra educar e não deixar o motorista sem punição.",
        legalBase: "Art. 267 do CTB",
        commonMistake: "Muita gente pensa que a advertência é opcional, mas na verdade é obrigatória nesse caso.",
        tip: "Infração Leve ou Média + 0 infrações em 12 meses = Advertência por Escrito Obrigatória.",
        incidence: "alta",
        trap: true,
        difficulty: 3
    },
    {
        id: "nova_psicoativas_reflexos_alta_03",
        category: "direcao-defensiva",
        statement: "Condutor bebe antes de dirigir, julga mal o risco e sente falsa segurança. Qual o principal efeito sobre corpo e mente?",
        options: ["Redução do tempo de reação, com aceleração paradoxal dos reflexos.", "Retardo dos reflexos e estreitamento da visão periférica, a visão em túnel.", "Aumento da acuidade visual e da atenção simultânea a vários estímulos.", "Melhora temporária da audição e redução das áreas cegas do veículo."],
        correctIndex: 1,
        explanation: "Correta B: álcool retarda reflexos e estreita a visão periférica, formando a visão em túnel.",
        detailedExplanation: "Quando alguém bebe, o cérebro demora mais pra processar as coisas. Isso faz com que a pessoa tenha reflexos mais lentos e enxergue menos ao redor, como se estivesse olhando por um tubo.",
        legalBase: "Art. 165 e Manual de Direção Defensiva do DENATRAN",
        commonMistake: "Muita gente acha que o álcool faz a pessoa reagir mais rápido, mas na verdade é o contrário, tudo fica mais devagar.",
        tip: "Álcool = Reflexos lentos + Visão em túnel.",
        incidence: "alta",
        trap: false,
        difficulty: 2
    },
    {
        id: "nova_meio_ambiente_respiratorio_alta_04",
        category: "meio-ambiente",
        statement: "Em grande cidade, a população respira monóxido de carbono, óxidos de nitrogênio e fuligem dos veículos. O que isso causa?",
        options: ["Distúrbios gastrointestinais crônicos pela ingestão involuntária de partículas.", "Doenças respiratórias, como asma, bronquite crônica e enfisema pulmonar.", "Perda auditiva permanente pela contaminação das vias aéreas superiores.", "Doenças contagiosas transmitidas só pela queima de combustíveis."],
        correctIndex: 1,
        explanation: "Correta B: poluentes veiculares atacam o sistema respiratório, causando asma, bronquite e enfisema.",
        detailedExplanation: "Os gases e partículas que vêm dos carros irritam as vias respiratórias e podem piorar doenças já existentes. Isso é especialmente sério em cidades grandes, onde a poluição é mais intensa.",
        legalBase: "Resoluções do CONAMA e Diretrizes de Meio Ambiente e Trânsito",
        commonMistake: "Muita gente confunde os problemas respiratórios causados pela poluição do ar com os efeitos do barulho, como estresse.",
        tip: "Poluição do Ar = Problemas Respiratórios.",
        incidence: "media",
        trap: false,
        difficulty: 2
    },
    {
        id: "nova_ultrapassagem_direita_excecao_alta_05",
        category: "legislacao",
        statement: "A regra geral manda ultrapassar pela esquerda, mas há uma exceção para passar pela direita. Qual situação permite isso?",
        options: ["Quando o veículo da frente está abaixo do limite e o condutor buzina pedindo passagem.", "Quando o veículo da frente sinaliza que vai converter ou entrar à esquerda.", "Em pista dupla, quando o veículo da esquerda impede o fluxo regular de trânsito.", "Em via urbana de sentido único, quando o acostamento da direita está livre."],
        correctIndex: 1,
        explanation: "Correta B: só é permitido ultrapassar pela direita se o da frente sinaliza conversão à esquerda. Art. 199 do CTB.",
        detailedExplanation: "Isso acontece quando o motorista coloca a seta pra indicar que vai entrar. Se ele estiver na posição certa, aí sim você pode passar pela direita sem problema.",
        legalBase: "Art. 199 do CTB",
        commonMistake: "Muita gente acha que pode ultrapassar pela direita em qualquer situação, mas só pode se o carro da frente estiver sinalizando a manobra.",
        tip: "Ultrapassagem pela direita = SINALIZAÇÃO do carro da frente pra virar à esquerda.",
        incidence: "alta",
        trap: true,
        difficulty: 3
    },
    {
        id: "nova_orgao_maximo_normativo_alta_06",
        category: "legislacao",
        statement: "No Sistema Nacional de Trânsito, qual órgão colegiado máximo, normativo e consultivo, edita as Resoluções de trânsito?",
        options: ["Secretaria Nacional de Trânsito, a SENATRAN.", "Conselho Nacional de Trânsito, o CONTRAN.", "Departamento Estadual de Trânsito, o DETRAN.", "Polícia Rodoviária Federal, a PRF."],
        correctIndex: 1,
        explanation: "Correta B: o CONTRAN é o órgão máximo normativo e consultivo e edita as Resoluções. Arts. 7º e 12 do CTB.",
        detailedExplanation: "O CONTRAN (Conselho Nacional de Trânsito) cria as normas que todos devem seguir no trânsito. Já a SENATRAN cuida da parte executiva, e o DETRAN faz isso em cada estado.",
        legalBase: "Art. 7º, inciso I e Art. 12 do CTB",
        commonMistake: "Muita gente confunde o CONTRAN, que faz as regras, com a SENATRAN, que aplica as regras.",
        tip: "CONTRAN = Regras do Trânsito | SENATRAN = Colocando em Prática.",
        incidence: "alta",
        trap: true,
        difficulty: 3
    },
    {
        id: "nova_objetivo_sinalizacao_alta_07",
        category: "legislacao",
        statement: "A sinalização usa elementos verticais, horizontais, luminosos, sonoros e gestos. Qual sua finalidade nas vias públicas?",
        options: ["Informar sobre a via, impor obrigações e proibições e advertir sobre perigos potenciais.", "Garantir arrecadação de multas pelos órgãos executivos em trechos de grande fluxo.", "Cadastrar a frota de veículos licenciados entre municípios vizinhos.", "Isentar o Estado de responsabilidade civil por sinistros em rodovias não concedidas."],
        correctIndex: 0,
        explanation: "Correta A: sinalizar é informar, regulamentar e advertir para garantir segurança e fluidez. Art. 80 do CTB.",
        detailedExplanation: "Ela serve pra deixar tudo mais organizado no trânsito, avisando sobre regras, perigos e dando direções. Assim, todo mundo pode se locomover sem estresse.",
        legalBase: "Art. 80 do CTB e Anexo II do CTB",
        commonMistake: "Muita gente acha que a sinalização só serve pra multar, mas na verdade é pra proteger.",
        tip: "Sinalização = Informação, Alerta, Regras e Segurança.",
        incidence: "media",
        trap: false,
        difficulty: 2
    },
    {
        id: "nova_retorno_rodovia_acostamento_alta_08",
        category: "legislacao",
        statement: "Em rodovia simples de duplo sentido, sem trevo para retorno, como o condutor deve fazer o retorno segundo o CTB?",
        options: ["Aproximar-se do eixo central e aguardar brecha para virar de imediato.", "Parar no acostamento à direita, aguardar condição segura e cruzar a pista para retornar.", "Parar na faixa da esquerda com pisca-alerta até ambos os sentidos ficarem livres.", "Avançar até o acostamento da esquerda e converter sem interromper a marcha."],
        correctIndex: 1,
        explanation: "Correta B: sem local próprio, pare no acostamento à direita e cruze só com segurança. Arts. 38 e 204 do CTB.",
        detailedExplanation: "Quando não tem lugar certo para retornar, a regra é parar no acostamento à direita e só cruzar quando estiver seguro. Tentar fazer o retorno no meio da pista é muito arriscado e é considerado infração gravíssima.",
        legalBase: "Art. 38 e Art. 204 do CTB",
        commonMistake: "Muita gente acha que pode parar no meio da rodovia para fazer o retorno, mas isso é super perigoso e proibido.",
        tip: "Retorno em Rodovia sem trevo = Entrar no acostamento à DIREITA e esperar a pista vagar.",
        incidence: "alta",
        trap: true,
        difficulty: 3
    },
    {
        id: "nova_balanceamento_rodas_sintomas_alta_09",
        category: "mecanica",
        statement: "Em rodovia plana, acima de 80 km/h o volante treme e vibra forte. Na manutenção preventiva, o que isso indica?",
        options: ["Necessidade de trocar pastilhas de freio dianteiras e sangrar o fluido de freio.", "Necessidade de balancear as rodas para corrigir a massa do conjunto pneu e roda.", "Necessidade de calibrar os pneus com 50% acima da pressão recomendada.", "Necessidade de trocar o amortecedor traseiro e as buchas da suspensão."],
        correctIndex: 1,
        explanation: "Correta B: vibração no volante em velocidade indica rodas desbalanceadas; balancear corrige a massa do conjunto.",
        detailedExplanation: "Quando as rodas não estão balanceadas, o carro vibra e isso pode causar desgaste nos pneus e na suspensão. Manter o balanceamento em dia evita esses problemas e garante uma direção mais tranquila.",
        legalBase: "Manual de Manutenção Veicular e Direção Defensiva",
        commonMistake: "Muita gente acha que balanceamento e alinhamento são a mesma coisa, mas um é pra vibração e o outro pra carro puxando.",
        tip: "Volante Tremendo = Balanceamento | Carro Puxando = Alinhamento.",
        incidence: "alta",
        trap: true,
        difficulty: 2
    },
    {
        id: "nova_sinalizacao_horizontal_cores_alta_10",
        category: "legislacao",
        statement: "Na sinalização horizontal, qual cor separa fluxos opostos e delimita conversão à esquerda e proibição de estacionar?",
        options: ["Branca, que separa fluxos opostos e marca faixas de pedestres.", "Amarela, que divide fluxos opostos e indica proibição de estacionamento.", "Vermelha, que delimita faixas de rolamento de veículos pesados.", "Azul, que separa faixas do mesmo sentido de circulação."],
        correctIndex: 1,
        explanation: "Correta B: a cor amarela separa sentidos opostos e indica proibição de estacionar. Anexo II do CTB.",
        detailedExplanation: "A linha amarela na pista serve pra dividir quem vai em direções contrárias e também pra mostrar onde não pode parar ou estacionar. Já a linha branca é usada pra separar quem vai no mesmo sentido.",
        legalBase: "Anexo II do CTB - Sinalização Horizontal",
        commonMistake: "Muita gente confunde a linha amarela com a branca, achando que as duas têm a mesma função.",
        tip: "Linha AMARELA = Sentidos OPOSTOS | Linha BRANCA = MESMO sentido.",
        incidence: "alta",
        trap: true,
        difficulty: 3,
        group: "sinalizacao-amarela"
    },
    {
        id: "nova_posicao_faixas_transito_alta_11",
        category: "legislacao",
        statement: "Em pista com várias faixas no mesmo sentido, sem faixa exclusiva, onde devem ficar os veículos lentos ou de grande porte?",
        options: ["Nas faixas da esquerda, destinadas à circulação lenta e em velocidade reduzida.", "Nas faixas da direita, ficando as da esquerda para ultrapassagem e maior velocidade.", "Em qualquer faixa, desde que liguem o pisca-alerta nos trechos de aclive.", "No acostamento, para abrir passagem contínua aos demais condutores."],
        correctIndex: 1,
        explanation: "Correta B: lentos e de grande porte usam a direita; esquerda é para ultrapassar. Art. 29 do CTB.",
        detailedExplanation: "Quando não tem faixa exclusiva, os veículos mais lentos ou de maior porte precisam usar as faixas mais à direita. As da esquerda são pra quem quer ultrapassar ou andar mais rápido.",
        legalBase: "Art. 29, inciso IV do CTB",
        commonMistake: "Muita gente acha que a faixa da esquerda pode ser usada por veículos lentos se estiverem na velocidade certa.",
        tip: "Faixa da DIREITA = Lentos e pesados | Faixa da ESQUERDA = Ultrapassagens e velocidade.",
        incidence: "alta",
        trap: false,
        difficulty: 2
    },
    {
        id: "nova_tecnica_curva_seguranca_alta_12",
        category: "direcao-defensiva",
        statement: "Ao aproximar-se de curva fechada à direita em rodovia, como executar a manobra com estabilidade e segurança?",
        options: ["Acelerar forte no início da curva para aumentar a aderência dos pneus ao solo.", "Reduzir antes de entrar na curva e acelerar suave durante a trajetória.", "Manter velocidade alta e frear bruscamente no meio do ápice da curva.", "Por em ponto morto e fazer a curva desengatada para economizar combustível."],
        correctIndex: 1,
        explanation: "Correta B: reduza no trecho reto antes da curva e acelere suave dentro dela; frear na curva tira estabilidade.",
        detailedExplanation: "Se você frear na curva, o carro pode ficar instável e derrapar por causa da força centrífuga. Então, reduza a velocidade no trecho reto antes de chegar na curva.",
        legalBase: "Manual de Direção Defensiva do DENATRAN",
        commonMistake: "Muita gente freia na curva ou fica com a embreagem apertada, o que pode causar problemas.",
        tip: "Curva à vista = Freie no reto e acelere na curva.",
        incidence: "alta",
        trap: true,
        difficulty: 2
    },
    {
        id: "nova_painel_instrumentos_mecanica_alta_13",
        category: "mecanica",
        statement: "Os instrumentos do painel informam a condição mecânica e elétrica do carro. Qual relação entre instrumento e função está correta?",
        options: ["Termômetro mede a pressão do óleo lubrificante dentro do cárter do motor.", "Voltímetro indica a rotação por minuto das rodas do veículo.", "Manômetro indica a pressão do óleo na linha de lubrificação do motor.", "Amperímetro mede o nível e a temperatura da água do radiador."],
        correctIndex: 2,
        explanation: "Correta C: manômetro mede pressão do óleo; termômetro mede temperatura do arrefecimento; tacômetro mede rotação.",
        detailedExplanation: "Manômetro = mede a pressão do óleo. Termômetro = vê a temperatura do líquido que resfria o motor. Tacômetro (Conta-giros) = conta quantas vezes o motor gira por minuto (RPM). Amperímetro/Voltímetro = checa a parte elétrica do carro e a bateria.",
        legalBase: "Manual de Mecânica Básica Veicular",
        commonMistake: "Muita gente confunde Manômetro (pressão do óleo) com Termômetro (temperatura do líquido).",
        tip: "MANÔMETRO = Pressão do Óleo | TERMÔMETRO = Temperatura do Líquido.",
        incidence: "media",
        trap: true,
        difficulty: 3
    },
    {
        id: "nova_chuva_cida_meio_ambiente_alta_14",
        category: "meio-ambiente",
        statement: "A queima de fósseis lança enxofre e nitrogênio que formam chuva ácida. Qual o dano ao patrimônio físico e aos veículos?",
        options: ["Corrosão de metais, degradação de pinturas veiculares e danos a estruturas de concreto.", "Formação imediata de neblina densa e queda de granizo tóxico nas rodovias.", "Destruição imediata dos pneus pelo atrito químico com o asfalto molhado.", "Eliminação da camada de ozônio nas faixas inferiores da atmosfera urbana."],
        correctIndex: 0,
        explanation: "Correta A: chuva ácida corrói metais, degrada pinturas e danifica concreto e monumentos.",
        detailedExplanation: "A acidez da chuva ataca as superfícies, fazendo com que os metais enferrujem mais rápido e danificando monumentos e plantas. Isso também pode afetar a qualidade da água.",
        legalBase: "Diretrizes Ambientais do CONAMA",
        commonMistake: "Muita gente acha que a chuva ácida só faz mal para a saúde, mas o impacto nos materiais é bem sério.",
        tip: "Chuva Ácida = Metal enferrujado + Pintura estragada.",
        incidence: "media",
        trap: false,
        difficulty: 2
    },
    {
        id: "nova_prioridade_passagem_emergencia_alta_17",
        category: "legislacao",
        statement: "Condutor na faixa da esquerda vê ambulância atrás com sirene e luz vermelha ligadas. Qual procedimento adotar?",
        options: ["Quem está à esquerda vai para a direita e para se preciso; os demais liberam a faixa da esquerda.", "Todos devem acelerar de imediato para liberar o cruzamento mais próximo.", "Todos devem ir para o acostamento da esquerda e parar com pisca-alerta ligado.", "Manter-se na faixa e buzinar para alertar os pedestres sobre a ambulância."],
        correctIndex: 0,
        explanation: "Correta A: com sirene ligada, vá para a direita e pare se preciso, liberando a esquerda. Art. 29 do CTB.",
        detailedExplanation: "Se um veículo de emergência estiver se aproximando com a sirene ligada, todos os motoristas devem se mover pra direita e parar se precisar. Isso garante que a ambulância consiga passar sem problemas.",
        legalBase: "Art. 29, inciso VII, alínea a do CTB",
        commonMistake: "Muita gente acaba indo pra esquerda em vez de se mover pra direita.",
        tip: "Sirene ouvindo = Vá pra DIREITA, liberando a ESQUERDA.",
        incidence: "alta",
        trap: true,
        difficulty: 3
    },
    {
        id: "nova_recolhimento_cnh_vencida_alta_18",
        category: "infracoes",
        statement: "Em blitz, o agente vê que a CNH está vencida há 45 dias. Qual a infração configurada e a medida aplicada no local?",
        options: ["Infração média, com retenção do veículo até chegar condutor habilitado.", "Infração gravíssima, com multa e recolhimento da CNH como medida administrativa.", "Infração grave, com cassação automática do direito de dirigir e apreensão do veículo.", "Crime de trânsito inafiançável, com prisão imediata do condutor."],
        correctIndex: 1,
        explanation: "Correta B: CNH vencida há mais de 30 dias é infração gravíssima com recolhimento da CNH. Art. 162 do CTB.",
        detailedExplanation: "Quando a CNH está vencida por mais de 30 dias, isso é considerado uma infração GRAVÍSSIMA. A consequência é a aplicação da multa e o recolhimento do documento de habilitação.",
        legalBase: "Art. 162, inciso V do CTB",
        commonMistake: "Muita gente pensa que pode dirigir com a CNH vencida até 30 dias sem problemas, mas após esse prazo vira infração gravíssima.",
        tip: "CNH vencida até 30 dias = Tolerado | Vencida há +30 dias = Infração GRAVÍSSIMA + Recolhimento da CNH.",
        incidence: "alta",
        trap: true,
        difficulty: 3
    },
    {
        id: "nova_primeiros_socorros_colar_cervical_alta_19",
        category: "primeiros-socorros",
        statement: "Vítima de batida traseira tem suspeita de trauma na coluna do pescoço. Qual equipamento estabiliza a região cervical?",
        options: ["Torniquete arterial de compressão rápida para conter sangramento.", "Colar cervical ortopédico para imobilizar o pescoço.", "Garrote de borracha vulcanizada para compressão do membro.", "Bandagem elástica de compressão para envolver o ferimento."],
        correctIndex: 1,
        explanation: "Correta B: colar cervical imobiliza o pescoço e protege a medula em suspeita de trauma cervical.",
        detailedExplanation: "Colocar o colar cervical é super importante em acidentes para evitar danos maiores na coluna. Isso ajuda a manter a vítima segura até a chegada de ajuda.",
        legalBase: "Manual de Primeiros Socorros no Trânsito (ABNT e PHTLS)",
        commonMistake: "Muita gente confunde colar cervical com torniquete, que serve pra parar sangramentos em braços e pernas.",
        tip: "Suspeita de trauma no Pescoço/Coluna = Colar Cervical e Não movimentar a vítima.",
        incidence: "alta",
        trap: false,
        difficulty: 2
    },
    {
        id: "nova_deveres_condutor_passagem_ferrea_alta_24",
        category: "legislacao",
        statement: "Analisando deveres e proibições do condutor no CTB, como linha férrea e acostamento, qual alternativa está juridicamente correta?",
        options: ["Todo veículo pode retornar em qualquer ponto urbano, desde que não haja pedestre.", "Carro de passeio pode circular pelo acostamento sempre que houver congestionamento.", "O condutor deve parar antes de cruzar linha férrea ou entrar em via preferencial onde houver sinalização.", "O condutor deve preferir pedestres só quando estiverem sobre a faixa de segurança."],
        correctIndex: 2,
        explanation: "Correta C: parar antes da linha férrea e na preferencial sinalizada é dever; desrespeitar é gravíssima. Arts. 212 e 214 do CTB.",
        detailedExplanation: "Se você não parar antes de cruzar a linha férrea, pode se dar mal, pois isso é considerado uma infração gravíssima. O mesmo vale para entrar em via preferencial com sinal de parada, onde é preciso parar o carro.",
        legalBase: "Art. 212 e Art. 214 do CTB",
        commonMistake: "Muita gente acha que só precisa reduzir a velocidade e não parar completamente.",
        tip: "Linha Férrea = Parada OBRIGATÓRIA antes de cruzar.",
        incidence: "alta",
        trap: true,
        difficulty: 3
    },
    {
        id: "nova_sinalizacao_horizontal_tachoes_alta_25",
        category: "legislacao",
        statement: "Para orientar à noite e canalizar o fluxo em pontos críticos, usam-se peças refletivas fixadas no pavimento. Quais são elas?",
        options: ["Marcas transversais de retenção e faixas de pedestres.", "Tachas e tachões refletivos, conhecidos como olhos de gato.", "Pinturas de legendas e símbolos de destino no asfalto.", "Placas de advertência instaladas no canteiro central."],
        correctIndex: 1,
        explanation: "Correta B: tachas e tachões, os olhos de gato, refletem o farol e orientam a trajetória à noite. Anexo II do CTB.",
        detailedExplanation: "Esses dispositivos são conhecidos como 'olhos de gato' e refletem a luz dos faróis, deixando tudo mais claro. Além disso, eles fazem um barulhinho quando o carro passa, avisando se você saiu da faixa.",
        legalBase: "Anexo II do CTB - Dispositivos Auxiliares",
        commonMistake: "Muita gente confunde tachas e tachões com as linhas pintadas na pista.",
        tip: "Tachas/Tachões = Ação refletiva no asfalto para guiar o motorista.",
        incidence: "media",
        trap: false,
        difficulty: 2
    },
    {
        id: "nova_primeiros_socorros_epistaxe_alta_26",
        category: "primeiros-socorros",
        statement: "Vítima consciente tem sangramento nasal forte, sem fratura craniana grave. Qual a conduta inicial adequada?",
        options: ["Manter a cabeça levemente elevada, comprimir as narinas por minutos e aplicar compressa fria no nariz.", "Inclinar a cabeça totalmente para trás para o sangue retornar à garganta.", "Tampar as narinas com plástico hermético para bloquear o fluxo de ar e sangue.", "Deitar a vítima de bruços e forçá-la a respirar só pelo nariz."],
        correctIndex: 0,
        explanation: "Correta A: cabeça elevada sem jogar para trás, compressão das narinas e compressa fria; para trás faz engolir sangue.",
        detailedExplanation: "Pra parar o sangramento nasal, a cabeça deve ficar levemente pra frente ou elevada (nunca pra trás, pra não engolir sangue), apertar as narinas e colocar um pano frio no nariz.",
        legalBase: "Manual de Primeiros Socorros no Trânsito",
        commonMistake: "Muita gente acha que deve inclinar a cabeça pra trás, mas isso pode fazer a pessoa engolir sangue.",
        tip: "Sangramento Nasal = Cabeça alta + Apertar narinas + Pano Frio (NUNCA pra trás).",
        incidence: "alta",
        trap: true,
        difficulty: 3
    },
    {
        id: "nova_distancia_frenagem_conceito_alta_27",
        category: "direcao-defensiva",
        statement: "Na física da direção defensiva, como se chama a distância do acionamento do freio até a parada total do veículo?",
        options: ["Distância de reação.", "Distância de seguimento.", "Distância de frenagem.", "Distância de parada total."],
        correctIndex: 2,
        explanation: "Correta C: frenagem vai do acionamento do freio à parada; reação vai da percepção ao freio; soma é parada.",
        detailedExplanation: "Primeiro, você tem a Distância de Reação, que é o tempo que leva do momento que vê o perigo até pisar no freio. Depois vem a Distância de Frenagem, que é o trecho que o carro percorre enquanto está freando. A soma dos dois dá a Distância de Parada Total.",
        legalBase: "Manual de Direção Defensiva do DENATRAN",
        commonMistake: "Muita gente confunde a Distância de Frenagem com a Distância de Parada, que inclui o tempo de reação.",
        tip: "Viu o perigo = REAÇÃO | Pisou no freio = FRENAGEM | Juntou tudo = PARADA.",
        incidence: "alta",
        trap: true,
        difficulty: 3
    },
    {
        id: "nova_vias_coletoras_conceito_alta_28",
        category: "legislacao",
        statement: "O CTB classifica as vias abertas à circulação por função operacional. Como a lei define expressamente as vias coletoras?",
        options: ["Destinadas a coletar e distribuir o trânsito que entra ou sai das vias de trânsito rápido ou arteriais.", "Destinadas apenas ao acesso direto aos imóveis lindeiros e áreas restritas.", "Caracterizadas por interseções em nível não semaforizadas para trânsito direto regional.", "Vias rurais não pavimentadas destinadas ao transporte pesado intermunicipal."],
        correctIndex: 0,
        explanation: "Correta A: via coletora é a destinada a coletar e distribuir o trânsito entre arteriais e locais. Art. 60 do CTB.",
        detailedExplanation: "A via coletora tem exatamente a função de 'recolher' o trânsito dos bairros (vias locais) e direcioná-lo para as vias maiores (arteriais ou de trânsito rápido), e vice-versa. Limite padrão sem sinalização: 40 km/h.",
        legalBase: "Art. 60, inciso I, alínea c do CTB",
        commonMistake: "Muita gente confunde via coletora com via local (acesso restrito aos imóveis) ou via arterial.",
        tip: "Via Coletora = Coleta o trânsito dos bairros e distribui para as vias principais (40 km/h).",
        incidence: "alta",
        trap: true,
        difficulty: 3
    },
    {
        id: "nova_primeiros_socorros_seguranca_local_alta_29",
        category: "primeiros-socorros",
        statement: "Em acidente com vítimas presas às ferragens e combustível derramado na pista, qual é a primeira providência do socorrista antes de tocar nas vítimas?",
        options: ["Garantir a própria segurança e sinalizar o local para evitar novos sinistros de trânsito.", "Iniciar o socorro somente após a chegada da autoridade policial ao local do sinistro.", "Priorizar o atendimento imediato às vítimas sem sinalizar previamente o local do fato.", "Retirar as vítimas imediatamente do veículo antes de sinalizar a pista de rolamento."],
        correctIndex: 0,
        explanation: "Correta: garantir a segurança e sinalizar o local antes do atendimento, conforme o manual de primeiros socorros.",
        detailedExplanation: "Nos Primeiros Socorros, a regra é clara: se o socorrista se machuca, não ajuda ninguém. Então, é preciso sinalizar bem o local e cuidar da segurança pra evitar explosões ou atropelamentos depois.",
        legalBase: "Manual de Primeiros Socorros no Trânsito (ABNT)",
        commonMistake: "Muita gente tenta ajudar as vítimas sem sinalizar, o que pode causar mais acidentes.",
        tip: "1º Sinalizar o local = 2º Chamar resgate = 3º Atender as vítimas.",
        incidence: "alta",
        trap: false,
        difficulty: 2
    },
    {
        id: "nova_direcao_defensiva_conceito_alta_30",
        category: "direcao-defensiva",
        statement: "Em via de fluxo intenso sob chuva forte, qual atitude caracteriza o condutor defensivo para antecipar situações de risco e evitar sinistros?",
        options: ["Manter velocidade compatível com via, clima e fluxo, guardando distância segura do veículo à frente.", "Transitar sempre no limite máximo da placa, mesmo sob chuva intensa e pista escorregadia.", "Ultrapassar pela direita sobre ponte quando o fluxo da faixa esquerda estiver mais lento.", "Acionar a buzina de forma contínua para impor prioridade sobre os pedestres na travessia."],
        correctIndex: 0,
        explanation: "Correta: ajustar a velocidade às condições da via e do clima, com distância segura, conforme direção defensiva.",
        detailedExplanation: "Na Direção Defensiva, o motorista deve ajustar a velocidade conforme a estrada, o tempo e o trânsito, sempre mantendo uma distância segura dos outros veículos e se antecipando aos perigos.",
        legalBase: "Manual de Direção Defensiva do DENATRAN",
        commonMistake: "Pensar que é seguro sempre andar na velocidade máxima indicada, não importa o clima.",
        tip: "Condição Adversa (Chuva/Neblina) = Reduzir a velocidade abaixo do limite da placa.",
        incidence: "alta",
        trap: false,
        difficulty: 2
    },
    {
        id: "nova_medida_admin_reprovacao_inspecao_01",
        category: "legislacao",
        statement: "Caminhão de carga reprovado na inspeção de segurança e de emissão de poluentes. Qual medida administrativa o CTB prevê de imediato nesse caso?",
        options: ["Aplicação de multa por infração gravíssima registrada pelo agente no momento do exame.", "Apreensão do veículo com remoção por guincho diretamente para o pátio credenciado.", "Recolhimento do veículo com cancelamento definitivo do licenciamento anual do caminhão.", "Retenção do veículo no local para regularização da situação antes de voltar a circular."],
        correctIndex: 3,
        explanation: "Correta: retenção do veículo para regularização, conforme art. 230, XVIII, do CTB.",
        detailedExplanation: "Quando um veículo de carga é reprovado na inspeção de segurança e emissão, isso é uma infração grave. A consequência é que o carro vai ser RETIDO até que tudo esteja certo.",
        legalBase: "Art. 230, inciso XVIII do CTB",
        commonMistake: "Muita gente confunde a retenção do veículo com só pagar a multa.",
        tip: "Inspeção Reprovada = RETENÇÃO do veículo.",
        incidence: "alta",
        trap: true,
        difficulty: 3
    },
    {
        id: "nova_aquaplanagem_fatores_risco_02",
        category: "direcao-defensiva",
        statement: "Durante chuva forte com lâmina de água sobre o asfalto, em qual condição o risco de aquaplanagem do veículo aumenta de forma significativa?",
        options: ["Com pneus novos sobre pista molhada, em velocidade moderada e marcha reduzida.", "Em velocidade baixa com pneus desgastados sob chuva fraca e sem acúmulo de água.", "Em alta velocidade sobre pista com acúmulo de água e sulcos dos pneus sem escoamento.", "Em velocidade baixa sobre pista apenas úmida, com condução em marcha reduzida."],
        correctIndex: 2,
        explanation: "Correta: alta velocidade sobre lâmina de água provoca aquaplanagem, conforme direção defensiva.",
        detailedExplanation: "A aquaplanagem acontece quando a água se acumula e não sai pelos sulcos do pneu. Se você tá em alta velocidade e a pista tá molhada, é bem provável que isso aconteça.",
        legalBase: "Manual de Direção Defensiva do DENATRAN",
        commonMistake: "Muita gente pensa que só pneu careca causa aquaplanagem, mas a velocidade alta é o que realmente importa.",
        tip: "Aquaplanagem = Alta Velocidade + Água na Pista (Lâmina d'água).",
        incidence: "alta",
        trap: true,
        difficulty: 2
    },
    {
        id: "nova_telefone_policia_militar_03",
        category: "primeiros-socorros",
        statement: "Em ocorrência de trânsito em via urbana com necessidade de policiamento ostensivo, qual é o número oficial de emergência da Polícia Militar?",
        options: ["190, número da Polícia Militar para emergências e policiamento ostensivo.", "191, número da Polícia Rodoviária Federal para emergências em rodovias federais.", "192, número do Serviço de Atendimento Móvel de Urgência para socorro médico.", "193, número do Corpo de Bombeiros Militar para incêndio e resgate."],
        correctIndex: 0,
        explanation: "Correta: 190 é o número da Polícia Militar, conforme diretrizes de urgência e emergência.",
        detailedExplanation: "No Brasil, os números de emergência são bem definidos: 190 para a Polícia Militar, 191 para a Polícia Rodoviária Federal, 192 para o SAMU e 193 para os Bombeiros.",
        legalBase: "Diretrizes Nacionais de Urgência e Emergência",
        commonMistake: "Muita gente confunde o 190 da PM com o 191 da PRF.",
        tip: "Emergência = 190 (PM)!",
        incidence: "alta",
        trap: false,
        difficulty: 1
    },
    {
        id: "nova_exame_pratico_velocidade_inadequada_04",
        category: "legislacao",
        statement: "No exame prático de direção, o candidato mantém velocidade inadequada sob chuva intensa e pista escorregadia. Como essa falta é classificada?",
        options: ["Falta eliminatória, com reprovação imediata do candidato no exame prático.", "Falta grave, com perda de 3 pontos na ficha de avaliação do exame prático.", "Falta média, com perda de 2 pontos na nota atribuída ao candidato avaliado.", "Falta leve, com perda de 1 ponto na pontuação registrada na ficha de avaliação."],
        correctIndex: 1,
        explanation: "Correta: velocidade inadequada em condição adversa é falta grave, conforme Resolução Contran nº 789/2020.",
        detailedExplanation: "Quando a pista tá escorregadia e a chuva tá forte, acelerar demais é uma falta grave. Isso vale 3 pontos a menos na sua avaliação do exame prático.",
        legalBase: "Resolução CONTRAN nº 789/2020, Anexo (Tabela de Faltas no Exame Prático)",
        commonMistake: "Muita gente acha que velocidade inadequada é eliminação direta, mas não é bem assim.",
        tip: "Condições ruins = Velocidade baixa.",
        incidence: "alta",
        trap: true,
        difficulty: 3
    },
    {
        id: "nova_infracao_deixar_sinalizar_obstaculo_05",
        category: "infracoes",
        statement: "Obra na pista deixa buraco aberto sem sinalização e coloca os usuários em risco. Qual é a natureza dessa infração pelo responsável, segundo o CTB?",
        options: ["Infração grave, com aplicação de multa simples ao responsável pela obra executada.", "Infração gravíssima, com multa multiplicada por três vezes ao responsável pela obra.", "Infração leve, passível de conversão em advertência por escrito ao responsável.", "Infração média, com retenção dos equipamentos de sinalização utilizados na obra."],
        correctIndex: 1,
        explanation: "Correta: deixar de sinalizar obstáculo na pista é infração gravíssima, conforme art. 226 do CTB.",
        detailedExplanation: "Quando uma obra não é sinalizada, isso coloca em risco a segurança de todos. A multa pode ser de 3 a 5 vezes, dependendo da situação e da decisão do agente de trânsito.",
        legalBase: "Art. 226 do CTB",
        commonMistake: "Muita gente pensa que a falta de sinalização só é grave se o motorista estiver em movimento.",
        tip: "Obra sem sinalização = Infração GRAVÍSSIMA (3x a 5x de multa).",
        incidence: "alta",
        trap: true,
        difficulty: 3
    },
    {
        id: "nova_placa_a28_pista_escorregadia_06",
        category: "legislacao",
        statement: "Ao visualizar a placa de advertência A-28 em trecho com histórico de derrapagens, o que ela indica e qual cuidado o condutor deve adotar?",
        options: ["Pista alagada à frente, exigindo parada total imediata do veículo no acostamento.", "Pista sujeita a aquaplanagem, exigindo uso obrigatório de correntes nos pneus.", "Pista escorregadia à frente, com redução de aderência, exigindo menor velocidade.", "Projeção de cascalho à frente, com alerta para pedras soltas sobre a pista."],
        correctIndex: 2,
        explanation: "Correta: A-28 adverte pista escorregadia à frente, conforme Anexo II do CTB.",
        detailedExplanation: "Essa placa (Pista Escorregadia) mostra que, mais à frente, a pista pode estar escorregadia por causa de água, óleo ou areia. Por isso, é bom diminuir a velocidade pra evitar acidentes.",
        legalBase: "Anexo II do CTB - Sinalização Vertical de Advertência",
        commonMistake: "Muita gente confunde 'Pista Escorregadia' (A-28) com 'Pista Alagada' ou 'Projeção de Cascalho' (A-29).",
        tip: "Pista escorregadia = Reduzir a velocidade.",
        incidence: "alta",
        trap: false,
        difficulty: 2,
        image_url: "https://tqeqsotsasglmhlmwdwy.supabase.co/storage/v1/object/public/library/images/Placas-de-transito-estudacnh-pista-escorregadia-A-28.png"
    },
    {
        id: "nova_prevencao_colisao_cruzamento_07",
        category: "direcao-defensiva",
        statement: "Ao se aproximar de interseção urbana sem semáforo e com faixa de pedestres, qual postura segura o condutor deve adotar para transpô-la?",
        options: ["Buzinar de forma prolongada e manter a velocidade para forçar os pedestres a aguardar.", "Acender o farol alto e o pisca-alerta para indicar que pretende passar em primeiro lugar.", "Acelerar para transpor rapidamente a interseção e desobstruir o fluxo de veículos.", "Reduzir a velocidade, observar ambos os lados e respeitar a preferência indicada."],
        correctIndex: 3,
        explanation: "Correta: reduzir, observar os lados e respeitar a preferência, conforme art. 44 do CTB.",
        detailedExplanation: "Chegar devagar no cruzamento é crucial pra evitar acidentes. Prestar atenção nos pedestres e em outros veículos que têm prioridade é fundamental pra passar com segurança.",
        legalBase: "Art. 44 do CTB",
        commonMistake: "Muita gente acha que pode buzinar ou usar os faróis pra ter prioridade, mas isso não resolve.",
        tip: "Cruzamento à vista = Reduzir a velocidade + Olhar pros lados + Respeitar a preferência.",
        incidence: "alta",
        trap: false,
        difficulty: 2
    },
    {
        id: "nova_transito_condicoes_seguras_direito_08",
        category: "legislacao",
        statement: "Segundo o texto expresso do art. 1º do CTB, como o trânsito em condições seguras é definido para os usuários das vias terrestres?",
        options: ["Privilégio exclusivo de condutores habilitados nas categorias profissionais do CTB.", "Direito restrito a pedestres e ciclistas quando circulam em passeios e ciclovias.", "Responsabilidade facultativa atribuída aos condutores de transporte coletivo de passageiros.", "Direito de todos e dever dos órgãos e entidades do Sistema Nacional de Trânsito."],
        correctIndex: 3,
        explanation: "Correta: trânsito seguro é direito de todos e dever do Sistema Nacional de Trânsito, conforme art. 1º do CTB.",
        detailedExplanation: "Isso quer dizer que todos têm o direito de transitar em segurança, e os órgãos responsáveis devem fazer a parte deles pra garantir isso. Eles precisam tomar medidas que protejam a vida e o meio ambiente no trânsito.",
        legalBase: "Art. 1º, § 2º do CTB",
        commonMistake: "Muita gente acha que só quem dirige ou caminha tem esse direito.",
        tip: "Trânsito seguro = DIREITO DE TODOS / DEVER DO ESTADO (SNT).",
        incidence: "alta",
        trap: false,
        difficulty: 1
    },
    {
        id: "nova_infracao_exceder_capacidade_tracao_09",
        category: "infracoes",
        statement: "Caminhão transita com composição excedendo a Capacidade Máxima de Tração indicada pelo fabricante. Qual é a natureza dessa infração no CTB?",
        options: ["Infração grave, com multa e retenção para transbordo da carga excedente do veículo.", "Infração média até 500 kg de excesso e gravíssima quando o excesso for superior.", "Infração leve, com registro de pontos no prontuário do proprietário do veículo.", "Infração média, com multa e retenção do veículo até a regularização da carga."],
        correctIndex: 3,
        explanation: "Correta: exceder a Capacidade Máxima de Tração é infração média com retenção, conforme art. 231, X, do CTB.",
        detailedExplanation: "Quando você carrega mais do que o carro aguenta, isso dá multa e pode fazer o carro ser parado. É importante respeitar o limite que o fabricante recomenda.",
        legalBase: "Art. 231, inciso X do CTB",
        commonMistake: "Muita gente pensa que sempre que passa do peso é infração grave ou gravíssima.",
        tip: "Passar do peso que o carro aguenta = Infração MÉDIA + Carro parado.",
        incidence: "alta",
        trap: true,
        difficulty: 3
    },
    {
        id: "nova_mecanica_falta_balanceamento_rodas_10",
        category: "mecanica",
        statement: "Veículo apresenta vibração crescente com o aumento da velocidade após rodízio de pneus. Qual consequência indica falta de balanceamento das rodas?",
        options: ["Direção excessivamente dura com travamento do sistema de assistência hidráulica.", "Rangido contínuo dos pneus percebido somente durante curvas fechadas e manobras.", "Deformação imediata das longarinas do chassi após o rodízio dos pneus.", "Trepidações e vibrações anormais transmitidas ao volante em velocidades maiores."],
        correctIndex: 3,
        explanation: "Correta: falta de balanceamento provoca trepidação no volante, conforme manual de manutenção veicular.",
        detailedExplanation: "O balanceamento é pra deixar as rodas e pneus em harmonia. Se não estiver certo, as vibrações no volante aumentam com a velocidade e podem até desgastar os pneus e a suspensão.",
        legalBase: "Manual de Manutenção Veicular e Direção Defensiva",
        commonMistake: "Muita gente confunde a trepidação do volante com problemas na direção ou na pressão dos pneus.",
        tip: "Desbalanceamento = Trepidação/Vibração no volante em alta velocidade.",
        incidence: "alta",
        trap: false,
        difficulty: 2
    },
    {
        id: "nova_exame_pratico_preferencia_pedestre_11",
        category: "legislacao",
        statement: "No exame prático, o candidato converte à direita sem ceder preferência ao pedestre sobre a faixa. Quantos pontos essa falta gera na avaliação?",
        options: ["Falta eliminatória, com reprovação imediata do candidato no exame de direção.", "Perda de 3 pontos na ficha, por se tratar de falta grave no exame prático.", "Perda de 2 pontos na ficha, por se tratar de falta média no exame prático.", "Perda de 1 ponto na ficha, por se tratar de falta leve no exame prático."],
        correctIndex: 1,
        explanation: "Correta: não ceder ao pedestre na conversão é falta grave, conforme Resolução Contran nº 789/2020.",
        detailedExplanation: "Se você não parar para deixar o pedestre passar na conversão, isso conta como uma falta GRAVE. Isso significa que você vai perder 3 pontos na sua avaliação.",
        legalBase: "Resolução CONTRAN nº 789/2020 (Anexo V - Faltas no Exame de Direção)",
        commonMistake: "Muita gente pensa que não dar preferência ao pedestre na conversão é motivo de eliminação direta, mas é só uma falta grave.",
        tip: "Não parar para o pedestre na conversão = Falta Grave (Perde 3 pontos).",
        incidence: "alta",
        trap: true,
        difficulty: 3
    },
    {
        id: "nova_primeiros_socorros_queimaduras_1grau_12",
        category: "primeiros-socorros",
        statement: "Após contato com superfície aquecida, a vítima tem vermelhidão e dor, sem bolhas. Como essa queimadura é classificada nos primeiros socorros?",
        options: ["Queimadura de 1º grau, limitada à camada superficial da pele, sem formação de bolhas.", "Queimadura de 2º grau, com bolhas e acometimento parcial da derme superficial.", "Queimadura de 3º grau, com destruição total da pele e perda de sensibilidade local.", "Queimadura de 4º grau, com acometimento profundo de músculos, tendões e ossos."],
        correctIndex: 0,
        explanation: "Correta: lesão só na epiderme, sem bolhas, é de 1º grau, conforme manual de primeiros socorros.",
        detailedExplanation: "As queimaduras de 1º grau só afetam a epiderme, causando vermelhidão e dor. Já as de 2º grau atingem a epiderme e a derme, formando bolhas. As de 3º grau vão mais fundo, afetando todas as camadas da pele e até os nervos, podendo ficar esbranquiçadas ou carbonizadas.",
        legalBase: "Manual de Primeiros Socorros no Trânsito (ABNT e PHTLS)",
        commonMistake: "Muita gente confunde queimaduras de 1º grau, que não têm bolhas, com as de 2º grau, que têm.",
        tip: "Atingiu só a camada de fora / sem bolhas = 1º Grau | Com bolhas = 2º Grau | Queimadura profunda / carbonizada = 3º Grau.",
        incidence: "alta",
        trap: false,
        difficulty: 2
    },
    {
        id: "nova_classificacao_vias_arterial_13",
        category: "legislacao",
        statement: "Via urbana semaforizada, com interseções em nível, que interliga regiões da cidade. Como essa via é classificada pelo CTB?",
        options: ["Via privada de acesso restrito, com circulação limitada aos moradores do condomínio.", "Via rural não pavimentada, destinada à circulação entre municípios vizinhos.", "Via expressa internacional, destinada ao trânsito exclusivo entre países vizinhos.", "Via urbana arterial, com interseções em nível e fluxo entre regiões da cidade."],
        correctIndex: 3,
        explanation: "Correta: via que liga regiões urbanas com interseções em nível é arterial, conforme art. 60 do CTB.",
        detailedExplanation: "As vias são divididas em urbanas e rurais. A via arterial faz parte das urbanas, que incluem também as vias de trânsito rápido, coletoras e locais.",
        legalBase: "Art. 60, inciso I, alínea b do CTB",
        commonMistake: "Muita gente confunde as vias urbanas com as rurais.",
        tip: "Vias URBANAS = Ação: Trânsito Rápido, Arterial, Coletora e Local.",
        incidence: "alta",
        trap: false,
        difficulty: 1
    },
    {
        id: "leg_n1_002",
        category: "legislacao",
        statement: "Candidato aprovado obtém a Permissão para Dirigir e inicia o estágio probatório. Qual é o prazo dessa permissão até a CNH definitiva?",
        options: ["6 meses de permissão, prorrogáveis uma vez mediante requerimento do condutor.", "12 meses de permissão, contados da expedição do documento de habilitação.", "24 meses de permissão, vinculados ao período das avaliações psicológicas.", "Prazo indefinido, mantido até o registro da primeira infração no prontuário."],
        correctIndex: 1,
        explanation: "Correta: a Permissão para Dirigir dura 12 meses, conforme art. 148 do CTB.",
        detailedExplanation: "A Permissão para Dirigir (PPD) é válida por 12 meses. Se o motorista não tiver infrações graves ou gravíssimas e não repetir médias, ele ganha a CNH definitiva; se não, tem que começar tudo de novo.",
        legalBase: "Art. 29 do CTB",
        commonMistake: "Muita gente pensa que a PPD dura só 6 meses.",
        tip: "PPD = 1 ano de prova.",
        memoryHook: "PPD = 1 ano de prova.",
        incidence: "alta",
        trap: true,
        difficulty: 1
    },
    {
        id: "leg_n2_001",
        category: "legislacao",
        statement: "Candidato à habilitação questiona os limites da categoria B. Quais são o Peso Bruto Total e a lotação autorizados, conforme o art. 143 do CTB?",
        options: ["PBT de até 6.000 kg e lotação de até 10 passageiros, incluindo o motorista do veículo.", "PBT sem limite de carga e lotação de até 8 ocupantes no total do veículo.", "Veículos de passeio com até 5 lugares no total, incluindo o condutor do veículo.", "PBT de até 3.500 kg e lotação de até 8 passageiros, excluído o condutor do veículo."],
        correctIndex: 3,
        explanation: "Correta: categoria B admite PBT até 3.500 kg e 8 passageiros mais o condutor, conforme art. 143 do CTB.",
        detailedExplanation: "Isso significa que, além do motorista, você pode levar mais 8 pessoas no carro. Se o veículo passar desse peso ou número de passageiros, precisa de outra categoria, como C ou D.",
        legalBase: "Art. 29 do CTB",
        commonMistake: "Muita gente confunde e acha que os 8 passageiros incluem o motorista.",
        tip: "B = 3.500 kg e 8+1.",
        memoryHook: "B = 3.500 kg e 8+1.",
        incidence: "alta",
        trap: true,
        difficulty: 2
    },
    {
        id: "leg_n1_001",
        category: "legislacao",
        statement: "Condutor habilitado na categoria B pretende transportar passageiros no veículo. Qual é o limite legal de passageiros, excluído o condutor?",
        options: ["Até 8 passageiros no veículo, incluindo obrigatoriamente o motorista na contagem.", "Até 15 passageiros no veículo, além do condutor responsável pela condução.", "Até 5 passageiros no veículo, sem contar o condutor na lotação autorizada.", "Até 8 passageiros no veículo, sem contar o condutor, na regra conhecida como 8+1."],
        correctIndex: 3,
        explanation: "Correta: categoria B permite até 8 passageiros mais o condutor, conforme art. 143 do CTB.",
        detailedExplanation: "A categoria B permite dirigir carros com até 3.500 kg de PBT e até 8 pessoas a bordo, além do motorista. Se precisar levar mais de 8 passageiros, precisa da categoria D; se o veículo passar de 3.500 kg, precisa da categoria C.",
        legalBase: "Art. 29 do CTB",
        commonMistake: "Muita gente confunde e acha que pode levar 8 passageiros no total, contando o motorista.",
        tip: "B = 3.500 kg e 8+1.",
        memoryHook: "B = 3.500 kg e 8+1.",
        incidence: "alta",
        trap: true,
        difficulty: 1
    },
    {
        id: "leg_n2_003",
        category: "legislacao",
        statement: "Condutor completa 12 meses sem nenhuma infração gravíssima no prontuário. Com quantos pontos ele atinge o limite para suspensão do direito de dirigir?",
        options: ["20 pontos, por regra fixa independente da gravidade das infrações cometidas.", "30 pontos, pela existência de ao menos uma infração grave no período avaliado.", "14 pontos, por se tratar de condutor com atividade remunerada registrada.", "40 pontos, limite aplicável ao condutor sem infração gravíssima nos últimos 12 meses."],
        correctIndex: 3,
        explanation: "Correta: sem infração gravíssima em 12 meses, o limite é 40 pontos, conforme art. 261 do CTB.",
        detailedExplanation: "O número de pontos que você pode acumular muda: 40 se não tiver gravíssimas, 30 se tiver uma e 20 se tiver duas ou mais. A antiga regra dos 20 pontos fixos não vale mais.",
        legalBase: "Art. 29 do CTB",
        commonMistake: "Muita gente ainda acha que são 20 pontos fixos, mas isso mudou.",
        tip: "Sem gravíssima = 40 pontos.",
        memoryHook: "Sem gravíssima = 40 pontos.",
        incidence: "alta",
        trap: true,
        difficulty: 2
    },
    {
        id: "inf_n1_001",
        category: "infracoes",
        statement: "Condutor segura o aparelho celular com uma das mãos para ler mensagens durante a condução. Qual é a natureza dessa infração, segundo o CTB?",
        options: ["Infração grave, com multa e registro de 5 pontos no prontuário da CNH.", "Infração média, com multa e registro de 4 pontos no prontuário da CNH.", "Infração leve, com multa e registro de 3 pontos no prontuário da CNH.", "Infração gravíssima, com multa e registro de 7 pontos no prontuário da CNH."],
        correctIndex: 3,
        explanation: "Correta: manusear celular ao volante é infração gravíssima, conforme art. 252 do CTB.",
        detailedExplanation: "Usar o celular ao volante é uma infração gravíssima (7 pontos e multa). Isso acontece porque mexer no celular atrapalha muito a reação do motorista.",
        legalBase: "Art. 258 do CTB",
        commonMistake: "Muita gente pensa que é só uma infração grave.",
        tip: "Dirigindo = Celular guardado.",
        memoryHook: "Dirigindo = Celular guardado.",
        incidence: "alta",
        trap: true,
        difficulty: 1
    },
    {
        id: "leg_n2_002",
        category: "legislacao",
        statement: "Permissionário cumpre o período probatório e deseja obter a CNH definitiva. Qual regra vale para a Permissão e suas infrações impeditivas?",
        options: ["Permissão de 6 meses, em que qualquer infração leve já impede a habilitação definitiva.", "Permissão sem prazo definido, cancelada somente em caso de crime de trânsito.", "Permissão de 12 meses, em que grave, gravíssima ou reincidência em média impede a definitiva.", "Permissão de 24 meses, com tolerância de até 20 pontos sem nenhuma consequência."],
        correctIndex: 2,
        explanation: "Correta: permissão de 12 meses impede a definitiva em caso de grave, gravíssima ou reincidência em média, conforme art. 148 do CTB.",
        detailedExplanation: "Durante a PPD (12 meses), o motorista está sendo observado. Se ele cometer infração grave, gravíssima ou repetir uma média, não consegue a CNH definitiva e precisa começar tudo de novo.",
        legalBase: "Art. 29 do CTB",
        commonMistake: "Muita gente acha que só a gravíssima impede a definitiva.",
        tip: "PPD = sem infração grave/gravíssima e sem reincidência em média.",
        memoryHook: "PPD = sem infração grave/gravíssima e sem reincidência em média.",
        incidence: "alta",
        trap: true,
        difficulty: 2
    },
    {
        id: "inf_n2_001",
        category: "infracoes",
        statement: "Motorista manipula o celular para ler mensagens ao trafegar em via de trânsito rápido. Como essa conduta é enquadrada pelo CTB?",
        options: ["Infração grave, com 5 pontos no prontuário e advertência por escrito ao condutor.", "Infração média, com 4 pontos no prontuário e reciclagem obrigatória do condutor.", "Infração leve, com 3 pontos e conversão da multa em advertência por escrito.", "Infração gravíssima, com 7 pontos na CNH e aplicação de multa ao condutor."],
        correctIndex: 3,
        explanation: "Correta: segurar ou manusear celular dirigindo é infração gravíssima, conforme art. 252 do CTB.",
        detailedExplanation: "Quando o motorista está com o celular na mão, isso resulta em 7 pontos na CNH e multa. O uso só é permitido se for viva-voz ou com fone, sem segurar o aparelho.",
        legalBase: "Art. 258 do CTB",
        commonMistake: "Muita gente acha que isso é só uma infração grave.",
        tip: "Celular na mão = gravíssima.",
        memoryHook: "Celular na mão = gravíssima.",
        incidence: "alta",
        trap: true,
        difficulty: 2
    },
    {
        id: "leg_n1_003",
        category: "legislacao",
        statement: "Pela Lei nº 14.071/2020, o condutor sem nenhuma infração gravíssima em 12 meses sofre suspensão do direito de dirigir ao atingir quantos pontos?",
        options: ["20 pontos fixos no prontuário, independentemente da natureza das infrações cometidas.", "30 pontos no prontuário, exigida a existência de ao menos uma infração grave.", "14 pontos no prontuário, por se tratar de condutor com atividade remunerada.", "40 pontos acumulados no prontuário nos últimos 12 meses de condução."],
        correctIndex: 3,
        explanation: "Correta: sem gravíssima em 12 meses, a suspensão ocorre aos 40 pontos, conforme art. 261 do CTB.",
        detailedExplanation: "Com a nova lei, se você não tiver nenhuma infração gravíssima, pode acumular até 40 pontos. Se tiver uma gravíssima, o limite cai para 30 pontos e, se tiver duas ou mais, vai para 20 pontos.",
        legalBase: "Art. 29 do CTB",
        commonMistake: "Muita gente ainda acha que são sempre 20 pontos, mas a regra mudou.",
        tip: "Sem gravíssima = 40 pontos.",
        memoryHook: "Sem gravíssima = 40 pontos.",
        incidence: "alta",
        trap: true,
        difficulty: 1
    },
    {
        id: "inf_n1_002",
        category: "infracoes",
        statement: "Condutor estaciona em vaga reservada a pessoa com deficiência sem exibir a credencial. Qual é a natureza dessa infração, segundo o CTB?",
        options: ["Infração média, com multa e 4 pontos no prontuário da CNH do condutor.", "Infração leve, com advertência por escrito e sem pontuação no prontuário.", "Infração grave, com multa e 5 pontos no prontuário da CNH do condutor.", "Infração gravíssima, com multa, 7 pontos e remoção do veículo do local."],
        correctIndex: 3,
        explanation: "Correta: usar vaga de pessoa com deficiência sem credencial é gravíssima com remoção, conforme art. 181, XX, do CTB.",
        detailedExplanation: "Usar vaga de PCD sem a credencial é uma infração gravíssima, que dá 7 pontos e pode levar o carro pro pátio. A vaga de idoso segue a mesma regra do Art. 181, XX: sem credencial, também é GRAVÍSSIMA (7 pontos) — fique esperto com isso!",
        legalBase: "Art. 181, XX do CTB",
        commonMistake: "Muita gente acha que a vaga de idoso é mais leve, mas PCD e idoso sem credencial são ambas gravíssimas.",
        tip: "Vaga PCD = gravíssima; vaga idoso = gravíssima (Art. 181, XX).",
        memoryHook: "Vaga PCD = gravíssima; vaga idoso = gravíssima.",
        incidence: "alta",
        trap: true,
        difficulty: 1
    },
    {
        id: "inf_n2_002",
        category: "infracoes",
        statement: "Condutor estaciona em vaga de pessoa com deficiência em shopping sem exibir credencial. Qual é a natureza dessa infração, segundo o CTB?",
        options: ["Infração média, com 4 pontos e aplicação apenas de multa administrativa.", "Infração leve, com 3 pontos e advertência por escrito ao condutor.", "Infração grave, com 5 pontos e retenção da CNH do condutor abordado.", "Infração gravíssima, com 7 pontos na CNH e remoção do veículo do local."],
        correctIndex: 3,
        explanation: "Correta: vaga de pessoa com deficiência sem credencial é gravíssima com remoção, mesmo em área privada, conforme art. 181, XX, do CTB.",
        detailedExplanation: "As vagas para Pessoas com Deficiência (PCD) precisam de credencial, e isso vale também para estacionamentos privados de uso coletivo. Se não tiver a credencial, a multa é gravíssima, com 7 pontos e o carro pode ser guinchado.",
        legalBase: "Art. 181, XX do CTB",
        commonMistake: "Muita gente pensa que em estacionamento privado não tem fiscalização ou que a infração é média.",
        tip: "Vaga PCD = Ação gravíssima; Vaga idoso = Ação gravíssima (Art. 181, XX).",
        memoryHook: "Vaga PCD = Ação gravíssima; Vaga idoso = Ação gravíssima.",
        incidence: "alta",
        trap: true,
        difficulty: 2
    },
    {
        id: "inf_n1_003",
        category: "infracoes",
        statement: "Em rodovia com limite de 110 km/h, o radar registra veículo a 170 km/h. Como se classifica transitar acima de 50% do limite, segundo o CTB?",
        options: ["Infração grave, com multa simples e 5 pontos no prontuário da CNH.", "Infração média, com multa e 4 pontos no prontuário da CNH do condutor.", "Infração leve, com advertência por escrito e sem pontuação no prontuário.", "Infração gravíssima, com multa triplicada e suspensão do direito de dirigir."],
        correctIndex: 3,
        explanation: "Correta: exceder em mais de 50% o limite é gravíssima com multa triplicada e suspensão, conforme art. 218, III, do CTB.",
        detailedExplanation: "Quando você ultrapassa o limite de velocidade em mais de 50%, a infração é gravíssima, e a multa é três vezes maior, além de você ficar sem poder dirigir por um tempo.",
        legalBase: "Art. 258 do CTB",
        commonMistake: "Muita gente pensa que qualquer excesso é só uma infração grave.",
        tip: ">50% = gravíssima x3.",
        memoryHook: ">50% = gravíssima x3.",
        incidence: "alta",
        trap: true,
        difficulty: 1
    },
    {
        id: "inf_n2_003",
        category: "infracoes",
        statement: "Radar registra 170 km/h em rodovia com limite de 110 km/h durante fiscalização. Qual é o enquadramento dessa conduta, segundo o CTB?",
        options: ["Infração grave, com multa simples e retenção do veículo até a regularização.", "Infração média, com multa e anotação de pontos no prontuário do condutor.", "Crime de trânsito inafiançável, com prisão imediata do condutor abordado.", "Infração gravíssima, com multa triplicada e suspensão do direito de dirigir."],
        correctIndex: 3,
        explanation: "Correta: 170 km/h em limite de 110 km/h supera 50%, infração gravíssima com multa triplicada e suspensão, conforme art. 218 do CTB.",
        detailedExplanation: "Quando você ultrapassa 50% do limite de velocidade, isso é considerado uma infração gravíssima. Além da multa ser multiplicada por 3, o motorista ainda pode ter a carteira suspensa.",
        legalBase: "Art. 258 do CTB",
        commonMistake: "Muita gente esquece de calcular e acha que é só uma infração grave.",
        tip: ">50% = gravíssima x3.",
        memoryHook: ">50% = gravíssima x3.",
        incidence: "alta",
        trap: true,
        difficulty: 2
    },
    {
        id: "dd_n1_001",
        category: "direcao-defensiva",
        statement: "Primeiro no local de acidente com vítimas, o motorista deve aplicar o protocolo PAS. O que cada letra dessa sigla significa, em ordem?",
        options: ["Parar o veículo, Abrir o capô e Socorrer as vítimas com urgência.", "Prevenir novos riscos, Atender as vítimas e Salvar os ocupantes.", "Prestar os primeiros cuidados, Acionar o freio e Sinalizar a pista.", "Proteger o local, Avisar o socorro e Socorrer as vítimas com cautela."],
        correctIndex: 3,
        explanation: "Correta: PAS significa Proteger, Avisar e Socorrer, nessa ordem, conforme manual de primeiros socorros.",
        detailedExplanation: "Primeiro, você protege o lugar (sinaliza), depois avisa o socorro (liga pro SAMU 192) e, por último, socorre as vítimas com cuidado. Assim, você evita que quem ajuda também se machuque.",
        legalBase: "Art. 180 do CTB",
        commonMistake: "Muita gente esquece de proteger o local antes de tudo.",
        tip: "Situação = Ação: Proteger = Avisa = Socorre.",
        memoryHook: "Situação = Ação: Proteger = Avisa = Socorre.",
        incidence: "alta",
        trap: true,
        difficulty: 1
    },
    {
        id: "dd_n1_002",
        category: "direcao-defensiva",
        statement: "Em pista molhada o veículo perde aderência e flutua sobre a água. Qual é a conduta correta do condutor nessa aquaplanagem, segundo a direção defensiva?",
        options: ["Aplicar frenagem forte e contínua para recuperar a aderência dos pneus.", "Girar o volante de um lado para outro para expulsar a água dos pneus.", "Engatar a marcha a ré imediatamente para reduzir a velocidade do veículo.", "Tirar o pé do acelerador e manter o volante firme, sem frear bruscamente."],
        correctIndex: 3,
        explanation: "Correta: na aquaplanagem, aliviar o acelerador e segurar a direção, conforme direção defensiva.",
        detailedExplanation: "Quando o carro aquaplana, os pneus não tocam o chão. O certo é tirar o pé do acelerador, manter o volante firme na direção e evitar frear ou virar de uma vez.",
        legalBase: "Art. 180 do CTB",
        commonMistake: "Muita gente acha que deve frear, mas isso pode piorar a situação.",
        tip: "Aquaplanagem = Pé fora do acelerador!",
        memoryHook: "Aquaplanagem = Pé fora do acelerador!",
        incidence: "alta",
        trap: true,
        difficulty: 1
    },
    {
        id: "dd_n2_001",
        category: "direcao-defensiva",
        statement: "Diante de acidente com vítimas em rodovia movimentada, qual é a sequência correta do protocolo PAS dos primeiros socorros?",
        options: ["Socorrer as vítimas de imediato, depois avisar o socorro e por fim proteger a via.", "Parar sobre a pista, retirar pertences do veículo e sinalizar após remover as vítimas.", "Avisar os familiares, proteger o veículo e socorrer mesmo sem treinamento prévio.", "Proteger o local com sinalização, avisar o socorro pelo 192 e socorrer com cautela."],
        correctIndex: 0,
        explanation: "Correta: a ordem do PAS é Proteger, Avisar e Socorrer, conforme manual de primeiros socorros.",
        detailedExplanation: "Primeiro, você deve proteger o local do acidente com um triângulo e pisca-alerta. Depois, avisa o socorro pelo telefone (SAMU 192, Bombeiros 193, Polícia 190) e só então pode ajudar as vítimas com cuidado.",
        legalBase: "Art. 180 do CTB",
        commonMistake: "Muita gente esquece de sinalizar antes de chamar o socorro.",
        tip: "Acidente = Proteger, Avisar, Socorrer.",
        memoryHook: "Acidente = Proteger, Avisar, Socorrer.",
        incidence: "alta",
        trap: true,
        difficulty: 2
    },
    {
        id: "dd_n2_002",
        category: "direcao-defensiva",
        statement: "Sob chuva intensa, o veículo flutua sobre a lâmina de água e perde o contato com o solo. O que o condutor deve fazer de imediato?",
        options: ["Pisar com força no freio para travar as rodas e buscar atrito com o asfalto.", "Girar o volante rapidamente para expulsar a água acumulada sob os pneus.", "Engatar marcha reduzida em giro alto para forçar a tração das rodas.", "Tirar o pé do acelerador, segurar firme o volante e não frear nem virar de repente."],
        correctIndex: 3,
        explanation: "Correta: aliviar o acelerador e manter a direção firme sem manobras bruscas, conforme direção defensiva.",
        detailedExplanation: "Se você frear ou virar rápido, pode fazer o carro rodar. É melhor segurar o volante firme e esperar os pneus voltarem a tocar o chão.",
        legalBase: "Art. 180 do CTB",
        commonMistake: "Muita gente acha que deve frear, mas isso só piora a situação.",
        tip: "Chuva = Pé fora do acelerador.",
        memoryHook: "Chuva = Pé fora do acelerador.",
        incidence: "alta",
        trap: true,
        difficulty: 2
    },
    {
        id: "ps_n1_001",
        category: "primeiros-socorros",
        statement: "Em acidente com feridos graves em via urbana, qual é o número oficial do SAMU para solicitar atendimento médico de urgência no Brasil?",
        options: ["193, número do Corpo de Bombeiros Militar para incêndio e resgate.", "190, número da Polícia Militar para policiamento e emergências policiais.", "192, número do Serviço de Atendimento Móvel de Urgência para socorro médico.", "191, número da Polícia Rodoviária Federal para rodovias federais."],
        correctIndex: 2,
        explanation: "Correta: 192 é o número do SAMU para urgências médicas, conforme diretrizes de urgência.",
        detailedExplanation: "O SAMU (Serviço de Atendimento Móvel de Urgência) atende emergências médicas. Lembre-se que os Bombeiros são pelo 193, a Polícia Militar pelo 190 e a PRF pelo 191.",
        legalBase: "Art. 134 do CTB",
        commonMistake: "Muita gente confunde o número do SAMU com o da polícia ou dos bombeiros.",
        tip: "Emergência = 192.",
        memoryHook: "Emergência = 192.",
        incidence: "alta",
        trap: true,
        difficulty: 1
    },
    {
        id: "ps_n2_001",
        category: "primeiros-socorros",
        statement: "Em acidente com vítimas presas nas ferragens e necessidade de socorro médico urgente, qual número e serviço devem ser acionados de imediato?",
        options: ["193, Corpo de Bombeiros Militar, para resgate e combate a incêndio no local.", "190, Polícia Militar, para policiamento ostensivo e registro da ocorrência.", "199, Defesa Civil, para desabamentos e emergências de proteção civil.", "192, SAMU, Serviço de Atendimento Móvel de Urgência para socorro médico."],
        correctIndex: 3,
        explanation: "Correta: 192 aciona o SAMU para urgência médica em sinistros, conforme diretrizes de urgência.",
        detailedExplanation: "Quando tem acidente e alguém tá preso nas ferragens, você liga pro SAMU no 192 pra pedir ajuda médica. Os Bombeiros (193) ajudam em incêndios e a Polícia (190) cuida de brigas, enquanto a PRF (191) é pra rodovias federais.",
        legalBase: "Art. 134 do CTB",
        commonMistake: "Muita gente confunde e acha que é o Bombeiro que cuida de tudo.",
        tip: "Acidente = Liga pro SAMU 192.",
        memoryHook: "Acidente = Liga pro SAMU 192.",
        incidence: "alta",
        trap: true,
        difficulty: 2
    },
    {
        id: "ps_n1_002",
        category: "primeiros-socorros",
        statement: "Vítima de colisão relata dormência nos membros com suspeita de fratura na coluna. Qual conduta adotar até a chegada do resgate especializado?",
        options: ["Sentar a vítima rapidamente em cadeira rígida para aliviar a pressão da coluna.", "Conduzir a vítima a pé até o hospital mais próximo do local do sinistro.", "Massagear a região dorsal da vítima para relaxar a musculatura contraída.", "Manter a vítima imóvel na posição encontrada, sem movimentar a coluna vertebral."],
        correctIndex: 3,
        explanation: "Correta: suspeita de fratura vertebral exige manter a vítima imóvel, conforme manual de primeiros socorros.",
        detailedExplanation: "Movimentar quem tem suspeita de lesão na coluna pode piorar a situação e causar paralisia. O ideal é deixar a vítima na posição que está até a chegada do socorro.",
        legalBase: "Art. 134 do CTB",
        commonMistake: "Muita gente acha que deve mover a vítima pra deixá-la mais confortável.",
        tip: "Suspeita = Imóvel até o socorro.",
        memoryHook: "Suspeita = Imóvel até o socorro.",
        incidence: "alta",
        trap: true,
        difficulty: 1
    },
    {
        id: "ma_n1_002",
        category: "meio-ambiente",
        statement: "Condutor arremessa resíduos pela janela com o veículo em movimento em via pública. Qual é a natureza dessa infração, segundo o CTB?",
        options: ["Infração leve, punida apenas com advertência verbal aplicada pelo agente.", "Infração gravíssima, com multa multiplicada e suspensão da CNH do condutor.", "Infração grave, com multa e cassação da permissão para dirigir do condutor.", "Infração média, com multa e 4 pontos, de responsabilidade do condutor do veículo."],
        correctIndex: 3,
        explanation: "Correta: atirar objeto pela janela é infração média, conforme art. 172 do CTB.",
        detailedExplanation: "Quando você joga ou deixa coisas na rua, isso é considerado uma infração média, que dá 4 pontos e multa. Além disso, pode ser crime ambiental e causar acidentes.",
        legalBase: "Art. 190 do CTB",
        commonMistake: "Muita gente pensa que isso é infração leve.",
        tip: "Lixo pela janela = média.",
        memoryHook: "Lixo pela janela = média.",
        incidence: "alta",
        trap: true,
        difficulty: 1
    },
    {
        id: "ma_n2_001",
        category: "meio-ambiente",
        statement: "Qual é o gás incolor e inodoro, altamente tóxico, expelido pelo escapamento dos veículos movidos a combustão?",
        options: ["Dióxido de carbono (CO2).", "Monóxido de carbono (CO).", "Gás metano (CH4).", "Dióxido de enxofre (SO2)."],
        correctIndex: 1,
        explanation: "Correta: o monóxido de carbono (CO) é incolor, inodoro e altamente tóxico, resultante da queima incompleta do combustível.",
        detailedExplanation: "O monóxido de carbono (CO) é um dos gases mais perigosos emitidos pelos veículos porque não tem cheiro nem cor, impedindo que a pessoa perceba sua presença. Ao ser inalado, ele reduz a capacidade do sangue de transportar oxigênio, podendo causar asfixia.",
        legalBase: "Resolução CONAMA / Art. 104 do CTB",
        commonMistake: "Muita gente confunde com o Dióxido de Carbono (CO2), que é o principal gás do efeito estufa, mas não é asfixiante e tóxico da mesma maneira imediata.",
        tip: "Gás sem cor, sem cheiro e tóxico = Monóxido de Carbono (CO).",
        memoryHook: "COmo asfixia? CO (Monóxido).",
        incidence: "alta",
        trap: true,
        difficulty: 2
    },
    {
        id: "ps_n2_002",
        category: "primeiros-socorros",
        statement: "Após colisão, a vítima apresenta suspeita de lesão medular com perda de sensibilidade. Qual conduta adotar até a chegada do resgate?",
        options: ["Remover a vítima do veículo e acomodá-la sentada em cadeira rígida próxima.", "Massagear a região cervical da vítima para aliviar a contratura muscular local.", "Girar o pescoço da vítima para avaliar a amplitude de movimento da coluna.", "Manter a vítima imóvel e alinhada, sem movimentar cabeça, pescoço ou coluna."],
        correctIndex: 3,
        explanation: "Correta: suspeita de lesão medular exige imobilidade total até o socorro, conforme manual de primeiros socorros.",
        detailedExplanation: "Qualquer movimento pode piorar a situação e causar paralisia. É importante que a vítima fique na mesma posição até o socorro chegar com o material certo para imobilizar.",
        legalBase: "Art. 134 do CTB",
        commonMistake: "Muita gente acha que deve mover a vítima para deixá-la mais confortável, mas isso pode ser perigoso.",
        tip: "Lesão na coluna = Não mexer!",
        memoryHook: "Lesão na coluna = Não mexer!",
        incidence: "alta",
        trap: true,
        difficulty: 2
    },
    {
        id: "ma_n1_001",
        category: "meio-ambiente",
        statement: "Escapamento libera gás sem cor nem cheiro que se liga à hemoglobina e impede a oxigenação do sangue. Qual é esse gás, segundo o manual?",
        options: ["Dióxido de carbono, produto natural da queima completa do combustível.", "Gás ozônio, presente naturalmente na estratosfera e sem ação no sangue.", "Clorofluorcarbono, fluido usado em refrigeração e ar-condicionado.", "Monóxido de carbono, resultante da queima incompleta do combustível."],
        correctIndex: 3,
        explanation: "Correta: monóxido de carbono se liga à hemoglobina e impede o transporte de oxigênio no sangue.",
        detailedExplanation: "Esse gás é perigoso, não tem cor nem cheiro, e se gruda na hemoglobina mais fácil que o oxigênio, causando asfixia. Por isso, nunca ligue o carro em lugar fechado.",
        legalBase: "Art. 190 do CTB",
        commonMistake: "Muita gente acha que só o cheiro indica perigo, mas o CO não tem cheiro.",
        tip: "Lugar fechado = Perigo de CO.",
        memoryHook: "Lugar fechado = Perigo de CO.",
        incidence: "alta",
        trap: true,
        difficulty: 1
    },
    {
        id: "me_n1_001",
        category: "legislacao",
        statement: "Condutor circula com o óleo lubrificante muito abaixo do mínimo da vareta e ignora o alerta no painel. O que essa condição pode provocar no motor?",
        options: ["Menor consumo de combustível, sem nenhum risco mecânico ao conjunto do motor.", "Travamento do sistema de freios por contaminação do fluido hidráulico.", "Desgaste restrito às velas de ignição, sem dano às demais peças internas.", "Fundição do motor por atrito excessivo entre as peças internas sem lubrificação."],
        correctIndex: 3,
        explanation: "Correta: nível muito baixo de óleo causa atrito excessivo e funde o motor, conforme manual de manutenção.",
        detailedExplanation: "O óleo é o que mantém as peças do motor funcionando direitinho. Se o nível tá muito baixo, as peças esfregam umas nas outras, esquentam demais e podem derreter.",
        legalBase: "Art. 29 do CTB",
        commonMistake: "Muita gente acha que só precisa de óleo quando o motor faz barulho.",
        tip: "Óleo baixo = Motor fundido.",
        memoryHook: "Óleo baixo = Motor fundido.",
        incidence: "alta",
        trap: true,
        difficulty: 1
    },
    {
        id: "ma_n2_002",
        category: "meio-ambiente",
        statement: "Passageiro arremessa lata pela janela com o veículo em movimento em rodovia. Como o CTB enquadra essa conduta e de quem é a responsabilidade?",
        options: ["Infração leve, de responsabilidade exclusiva do passageiro que lançou o objeto.", "Infração grave, com multa e suspensão da licença de tráfego do veículo.", "Conduta admitida em pista simples, desde que fora do acostamento da rodovia.", "Infração média, com multa e 4 pontos, de responsabilidade do condutor do veículo."],
        correctIndex: 3,
        explanation: "Correta: lançar objeto pela janela é infração média do condutor, conforme art. 172 do CTB.",
        detailedExplanation: "Quando alguém joga um objeto pela janela, isso é uma infração média (Art. 172). O motorista é quem leva a culpa, e isso pode ser crime ambiental, além de ser perigoso para quem anda de moto.",
        legalBase: "Art. 190 do CTB",
        commonMistake: "Muita gente pensa que só o passageiro é responsável ou que é uma infração leve.",
        tip: "Lixo na estrada = multa média.",
        memoryHook: "Lixo na estrada = multa média.",
        incidence: "alta",
        trap: true,
        difficulty: 2
    },
    {
        id: "me_n2_001",
        category: "legislacao",
        statement: "Veículo circula com nível de óleo severamente baixo e luz de advertência acesa no painel. Qual é a principal consequência mecânica dessa condição?",
        options: ["Aumento do consumo de combustível, sem risco mecânico relevante ao conjunto.", "Redução do desgaste das velas de ignição e melhora da queima da mistura.", "Travamento das pastilhas de freio traseiras por falta de lubrificação.", "Superaquecimento por atrito, podendo fundir o motor e danificar o bloco."],
        correctIndex: 3,
        explanation: "Correta: óleo severamente baixo gera atrito e superaquecimento, podendo fundir o motor.",
        detailedExplanation: "Quando o nível de óleo tá baixo, as peças do motor se esfregam e esquentam demais. Isso pode acabar fundindo o motor e causando um estrago enorme. Checar o nível de óleo sempre é uma boa prática pra evitar problemas.",
        legalBase: "Art. 29 do CTB",
        commonMistake: "Muita gente acha que só precisa de óleo na hora da troca, mas o nível deve ser checado sempre.",
        tip: "Óleo baixo = Motor quente.",
        memoryHook: "Óleo baixo = Motor quente.",
        incidence: "alta",
        trap: true,
        difficulty: 2
    },
    {
        id: "pr_n1_001",
        category: "legislacao",
        statement: "Ambulância em urgência transita com sirene e luzes vermelhas ligadas em avenida movimentada. Qual prioridade o CTB garante a esse veículo?",
        options: ["Prioridade apenas quando se tratar de viatura da Polícia Militar em patrulha.", "Prioridade somente no período noturno, entre 22h e 6h do dia seguinte.", "Nenhuma prioridade, devendo obedecer estritamente a todos os sinais de trânsito.", "Prioridade de passagem, devendo os demais veículos abrir caminho à direita."],
        correctIndex: 3,
        explanation: "Correta: veículo de emergência em urgência com sinais ligados tem prioridade de passagem, conforme art. 29, VII, do CTB.",
        detailedExplanation: "Quando uma ambulância, viatura ou caminhão de bombeiros está com os sinais ligados, eles têm que passar primeiro. Todo mundo deve encostar à direita pra deixar o caminho livre.",
        legalBase: "Art. 29 do CTB",
        commonMistake: "Muita gente acha que pode continuar dirigindo normalmente, mas precisa parar e dar passagem.",
        tip: "Emergência = Abra caminho!",
        memoryHook: "Emergência = Abra caminho!",
        incidence: "alta",
        trap: true,
        difficulty: 1
    },
    {
        id: "me_n2_002",
        category: "legislacao",
        statement: "Pneus com sulcos abaixo de 1,6 mm rodam em pista molhada durante chuva forte. A que risco principal o condutor fica exposto nessa condição?",
        options: ["Redução do consumo de combustível em razão de maior aderência ao asfalto.", "Desalinhamento imediato da direção percebido somente em pista seca.", "Bloqueio das rodas por fadiga precoce do sistema de suspensão.", "Perda de aderência na água, aquaplanagem e maior distância de frenagem."],
        correctIndex: 3,
        explanation: "Correta: sulco abaixo de 1,6 mm perde aderência e provoca aquaplanagem, conforme manual de direção defensiva.",
        detailedExplanation: "Os sulcos dos pneus ajudam a drenar a água. Sem eles, o pneu perde contato com o chão, o que pode causar aquaplanagem. Por isso, andar com pneu careca é uma infração grave.",
        legalBase: "Art. 29 do CTB / Manual de Direção Defensiva",
        commonMistake: "Muita gente acha que só é perigoso em pista molhada, mas o risco existe sempre.",
        tip: "Pneu careca = Perigo na chuva!",
        memoryHook: "Pneu careca = Perigo na chuva!",
        incidence: "alta",
        trap: true,
        difficulty: 2
    },
    {
        id: "pr_n1_002",
        category: "legislacao",
        statement: "Em ladeira estreita sem espaço para dois veículos cruzarem, um sobe e outro desce. Qual deles tem preferência de passagem, segundo o CTB?",
        options: ["O veículo que está descendo, por desenvolver maior velocidade natural na descida.", "O veículo de maior porte e maior peso bruto total entre os dois envolvidos.", "O veículo que primeiro acionar a buzina para sinalizar a intenção de passar.", "O veículo que está subindo, devendo o que desce recuar e dar passagem."],
        correctIndex: 3,
        explanation: "Correta: em ladeira estreita, quem sobe tem preferência, conforme art. 29, VIII, do CTB.",
        detailedExplanation: "Quando a ladeira é estreita e não dá pra passar dois carros, quem tá subindo tem a vez. O carro que desce precisa recuar porque é mais complicado pra quem sobe fazer isso.",
        legalBase: "Art. 29 do CTB",
        commonMistake: "Muita gente acha que quem desce tem prioridade, mas não é assim.",
        tip: "Subindo = Passa; Descendo = Recua.",
        memoryHook: "Subindo = Passa; Descendo = Recua.",
        incidence: "alta",
        trap: true,
        difficulty: 1
    },
    {
        id: "me_n1_002",
        category: "legislacao",
        statement: "Inspeção visual mostra pneus com sulcos abaixo de 1,6 mm em veículo que trafega na chuva. Qual risco principal essa medida mínima indica?",
        options: ["Redução do consumo de combustível em vias planas e de baixo fluxo.", "Melhora da aderência em curvas de raio fechado e pista seca.", "Travamento mecânico das rodas dianteiras em frenagens leves e curtas.", "Aquaplanagem e aumento da distância de frenagem em pista molhada."],
        correctIndex: 3,
        explanation: "Correta: sulco inferior a 1,6 mm indica pneu gasto, com risco de aquaplanagem e frenagem longa.",
        detailedExplanation: "Quando os sulcos do pneu ficam abaixo de 1,6 mm, ele não consegue drenar a água da pista, o que pode levar à aquaplanagem. Além disso, a distância que você precisa para parar aumenta, o que é perigoso. Rodar com pneu careca é uma infração grave.",
        legalBase: "Art. 29 do CTB / Manual de Direção Defensiva",
        commonMistake: "Muita gente acha que só pneu furado é problema, mas pneu careca também é perigoso.",
        tip: "Pneu careca = Aquaplanagem e mais distância pra parar.",
        memoryHook: "Pneu careca = Aquaplanagem e mais distância pra parar.",
        incidence: "alta",
        trap: true,
        difficulty: 1
    },
    {
        id: "pl_n1_001",
        category: "legislacao",
        statement: "Candidato observa placa de parada obrigatória em cruzamento com pouca visibilidade. Qual é o formato característico da placa R-1 (PARE)?",
        options: ["Circular, com fundo branco e orla vermelha em todo o contorno.", "Losangular, com fundo amarelo e símbolo preto no centro.", "Retangular, com fundo azul e símbolo branco no centro.", "Octogonal, com fundo vermelho e a inscrição PARE em branco."],
        correctIndex: 3,
        explanation: "Correta: R-1 tem formato octogonal com fundo vermelho, conforme Manual de Sinalização.",
        detailedExplanation: "Ela pede que o motorista pare completamente antes de seguir. É a única placa de trânsito que é octogonal, diferente da placa 'Dê a Preferência', que tem formato triangular.",
        legalBase: "Art. 29 do CTB e Resolução CONTRAN",
        commonMistake: "Muita gente confunde com outras placas que não exigem parada total.",
        tip: "Placa octogonal = Parada obrigatória.",
        memoryHook: "Placa octogonal = Parada obrigatória.",
        incidence: "alta",
        trap: true,
        difficulty: 1
    },
    {
        id: "pr_n2_001",
        category: "legislacao",
        statement: "Ambulância em atendimento de urgência circula com sirene e luzes vermelhas ligadas. Qual prioridade de passagem o CTB garante nessa situação?",
        options: ["Prioridade apenas quando se tratar de viatura da Polícia Militar em serviço.", "Nenhuma prioridade fora dos trechos de rodovia federal concedida pelo CTB.", "Prioridade restrita aos finais de semana, feriados e período noturno.", "Prioridade de passagem, devendo os demais condutores encostar à direita."],
        correctIndex: 3,
        explanation: "Correta: ambulância em urgência com sinais ligados tem prioridade, conforme art. 29, VII, do CTB.",
        detailedExplanation: "Quando a ambulância está com os sinais ligados, ela tem que passar na frente de todo mundo. Se não tiver os sinais, já era, ela não tem mais essa prioridade.",
        legalBase: "Art. 29 do CTB",
        commonMistake: "Muita gente acha que pode ignorar a ambulância se estiver em um lugar apertado.",
        tip: "Sinal ligado = Passagem garantida.",
        memoryHook: "Sinal ligado = Passagem garantida.",
        incidence: "alta",
        trap: true,
        difficulty: 2
    },
    {
        id: "pr_n2_002",
        category: "legislacao",
        statement: "Dois caminhões se encontram em trecho estreito de ladeira sem área de escape. Qual deles tem direito de passagem, segundo o CTB?",
        options: ["O veículo que está descendo, por desenvolver maior energia cinética na descida.", "O veículo que sinalizou primeiro com toques breves de buzina no trecho.", "O veículo de menor peso bruto total entre os dois que disputam a passagem.", "O veículo que está subindo, devendo o que desce recuar e dar passagem."],
        correctIndex: 3,
        explanation: "Correta: quem sobe tem preferência em ladeira estreita, conforme art. 29, VIII, do CTB.",
        detailedExplanation: "O CTB diz que quem sobe leva vantagem porque é complicado e arriscado voltar na subida. Então, quem desce precisa dar ré até um lugar seguro.",
        legalBase: "Art. 29 do CTB",
        commonMistake: "Muita gente acha que quem desce tem prioridade, mas não é assim.",
        tip: "Subindo = Preferência!",
        memoryHook: "Subindo = Preferência!",
        incidence: "alta",
        trap: true,
        difficulty: 2
    },
    {
        id: "pl_n2_001",
        category: "legislacao",
        statement: "Condutor se depara com a placa R-1 em interseção sem visibilidade lateral. Quais são as características visuais e a exigência dessa placa?",
        options: ["Circular com orla vermelha, recomendando apenas reduzir a velocidade no trecho.", "Losangular amarela, alertando para perigo iminente adiante na via pública.", "Retangular azul, indicando serviço público existente nas proximidades da via.", "Octogonal vermelha, exigindo parada total obrigatória antes de prosseguir."],
        correctIndex: 3,
        explanation: "Correta: R-1 é octogonal e exige parada obrigatória, conforme Manual de Sinalização.",
        detailedExplanation: "Essa placa é bem clara: você precisa parar antes da faixa de retenção, olhar se tá tudo tranquilo e só depois seguir. Ignorar essa placa é uma infração gravíssima.",
        legalBase: "Art. 29 do CTB",
        commonMistake: "Muita gente acha que pode só reduzir a velocidade, mas precisa parar mesmo.",
        tip: "Parar = Olhar = Prosseguir!",
        memoryHook: "Parar = Olhar = Prosseguir!",
        incidence: "alta",
        trap: true,
        difficulty: 2
    },
    {
        id: "pl_n2_002",
        category: "legislacao",
        statement: "Prova pergunta o padrão de cor e forma das placas que impõem ordens e proibições. Qual é o padrão predominantemente utilizado na sinalização de regulamentação?",
        options: ["Circulares, com fundo branco, orla e tarja vermelhas e símbolo preto.", "Losangulares, com fundo amarelo e símbolo preto, que alertam para perigos.", "Retangulares, com fundo azul e símbolo branco, que indicam serviços na via.", "Triangulares invertidas, com fundo branco, usadas na preferência de passagem."],
        correctIndex: 0,
        explanation: "Correta: regulamentação usa fundo branco circular com orla vermelha, com exceções da R-1 e R-2, conforme Manual de Sinalização.",
        detailedExplanation: "Elas têm um formato circular, com fundo branco, borda e tarja vermelha e símbolo preto, que mostram ordens e proibições. Tem algumas exceções, como a placa PARE, que é octogonal, e a placa 'Dê a Preferência', que é triangular, mas ainda assim são de regulamentação.",
        legalBase: "Art. 29 do CTB / Manual de Sinalização",
        commonMistake: "Muita gente confunde as formas das placas e esquece das exceções.",
        tip: "Placa redonda = Ordem ou proibição!",
        memoryHook: "Placa redonda = Ordem ou proibição!",
        incidence: "alta",
        trap: true,
        difficulty: 2
    },
    {
        id: "pl_n1_002",
        category: "legislacao",
        statement: "Placas circulares com fundo branco e orla vermelha aparecem em trecho com proibições. A qual classe da sinalização vertical elas pertencem?",
        options: ["Advertência, que alertam os condutores sobre perigos potenciais na via.", "Indicação, que informam serviços, destinos e distâncias aos condutores.", "Educação, que orientam o comportamento dos usuários da via pública.", "Regulamentação, que impõem obrigações, proibições e restrições no trânsito."],
        correctIndex: 3,
        explanation: "Correta: círculo com orla vermelha indica regulamentação, conforme Manual de Sinalização.",
        detailedExplanation: "As placas de regulamentação (série R) são redondas, com fundo branco e borda vermelha, e elas mandam você fazer ou não fazer algo. Já as placas em losango amarelo avisam e as retangulares azuis indicam informações.",
        legalBase: "Art. 29 do CTB",
        commonMistake: "Muita gente confunde com placas de aviso que não têm obrigação.",
        tip: "Regra = Placa redonda.",
        memoryHook: "Regra = Placa redonda.",
        incidence: "alta",
        trap: true,
        difficulty: 1
    },
    {
        id: "detran_ilum_001_alta",
        category: "mecanica",
        statement: "Durante a circulação noturna, o condutor depende de um conjunto de equipamentos para garantir a visibilidade da pista de rolamento e sinalizar suas manobras aos demais condutores. Esse conjunto corresponde ao sistema:",
        options: ["Sistema de Transmissão e Rodagem do veículo.", "Sistema de Iluminação e Sinalização do veículo.", "Sistema de Suspensão e Arrefecimento do motor.", "Sistema Elétrico de Partida e Ignição do motor."],
        correctIndex: 1,
        explanation: "O sistema de iluminação e sinalização ilumina a via e avisa sobre manobras aos outros motoristas.",
        detailedExplanation: "O sistema de iluminação (faróis, lanternas) e sinalização (setas, luz de freio, luz de ré) tem função dupla: dar visibilidade ao condutor no escuro e alertar outros usuários da via sobre as intenções de manobra.",
        legalBase: "Art. 40 e Art. 224 do CTB",
        commonMistake: "Confundir sistema de iluminação/sinalização com o sistema elétrico geral de partida e ignição.",
        tip: "Ver e ser visto: Iluminação dá visão; Sinalização avisa a manobra.",
        memoryHook: "Ilumina para ver, sinaliza para ser visto!",
        incidence: "alta",
        trap: false,
        difficulty: 3
    },
    {
        id: "detran_ilum_002_alta",
        category: "direcao-defensiva",
        statement: "Ao conduzir à noite em via urbana dotada de iluminação pública, o condutor percebe que a luz interna de teto do veículo automotor permanece acesa durante a marcha. Sob a ótica da Direção Defensiva, o risco dessa prática é:",
        options: ["Aumenta o consumo de combustível por sobrecarga contínua no alternador.", "Gera reflexos no para-brisa e reduz a adaptação da visão ao escuro externo.", "Desliga automaticamente os faróis baixos por proteção eletroeletrônica.", "Impede o correto funcionamento das setas indicadoras no painel do carro."],
        correctIndex: 1,
        explanation: "Luz de teto acesa à noite faz o vidro virar um espelho e impede você de ver a pista no escuro.",
        detailedExplanation: "A luz interna do habitáculo acesa à noite cria reflexos internos no para-brisa (efeito espelho) e reduz a adaptação da pupila do condutor à escuridão da pista, diminuindo drasticamente a segurança.",
        legalBase: "Manual de Direção Defensiva / Visibilidade",
        commonMistake: "Achar que a luz interna serve para ajudar os outros motoristas a enxergarem o interior do seu veículo.",
        tip: "Luz de teto acesa de noite = Vidro vira espelho e cega você para o lado de fora!",
        memoryHook: "Teto aceso à noite = Vidro virado espelho!",
        incidence: "alta",
        trap: true,
        difficulty: 3
    },
    {
        id: "detran_ilum_003_alta",
        category: "legislacao",
        statement: "Durante a condução noturna em via não iluminada, ao avistar veículo em sentido oposto ou trafegando logo à frente no mesmo sentido, a fim de não ofuscar os demais usuários, o condutor deve, pelas regras do CTB, utilizar:",
        options: ["Luz alta contínua, fazendo apenas o piscar momentâneo ao aproximar a menos de 50m.", "Luz baixa, devendo alternar da luz alta para a baixa para não ofuscar os demais condutores.", "Luzes de posição (farolete) associadas aos faróis de neblina para manter a visão.", "Pisca-alerta ligado continuamente junto com o farol baixo até que conclua o cruzamento."],
        correctIndex: 1,
        explanation: "Pista escura pede farol alto, mas se cruzar ou seguir outro carro, mude para o farol baixo na hora.",
        detailedExplanation: "O CTB exige o uso de luz alta em vias não iluminadas. Porém, para evitar o ofuscamento dos demais motoristas (seja quem vem de frente ou quem vai à frente pelo retrovisor), o condutor deve alternar para a luz baixa.",
        legalBase: "Art. 40, I e Art. 223 do CTB",
        commonMistake: "Lembrar de baixar o farol apenas para quem vem no sentido oposto, esquecendo do carro que vai logo à frente.",
        tip: "Cruzou ou seguiu outro carro = Farol baixo imediato!",
        memoryHook: "Viu outro carro na frente? Baixa o farol!",
        incidence: "alta",
        trap: true,
        difficulty: 3
    },
    {
        id: "detran_ilum_004_alta",
        category: "legislacao",
        statement: "Segundo o CTB e a regulamentação vigente, o condutor de veículo que não dispõe do sistema de luz de condução diurna (DRL) deve manter aceso, durante o período diurno, em rodovia de pista simples fora do perímetro urbano:",
        options: ["Apenas as luzes de posição (faroletes) dianteiras.", "O farol baixo (ou a luz de condução diurna - DRL).", "O farol alto em ritmo de intermitência.", "As luzes de advertência do pisca-alerta."],
        correctIndex: 1,
        explanation: "Na rodovia de pista simples de dia, é obrigatório acender o farol baixo ou ter o DRL nativo.",
        detailedExplanation: "A legislação exige o uso do farol baixo (ou DRL) durante o dia em rodovias de pista simples situadas fora dos perímetros urbanos. O uso isolado do farolete (luz de posição) é infração e não atende à exigência legal.",
        legalBase: "Art. 40, § 2º e Art. 250, I, 'b' do CTB",
        commonMistake: "Acreditar que apenas o 'farolete' (luz de posição) cumpre a exigência legal em rodovias.",
        tip: "Dia na rodovia simples = Farol Baixo ou DRL!",
        memoryHook: "Rodovia simples de dia = Farol baixo sempre!",
        incidence: "alta",
        trap: true,
        difficulty: 3
    },
    {
        id: "detran_ilum_005_alta",
        category: "legislacao",
        statement: "As luzes indicadoras de direção (setas) do veículo integram a sinalização luminosa prevista no CTB e na sinalização do CONTRAN. Para qual finalidade específica o condutor deve acioná-las durante a circulação?",
        options: ["Sinalizar a intenção de realizar conversão, mudança de faixa ou ultrapassagem.", "Garantir a preferência de passagem ao cruzar interseções não sinalizadas.", "Alertar os veículos seguintes que o trânsito adiante está parado em congestionamento.", "Substituir o farol baixo do veículo durante a circulação em túneis iluminados."],
        correctIndex: 0,
        explanation: "A seta serve para avisar antes de virar, mudar de faixa ou realizar ultrapassagens.",
        detailedExplanation: "As luzes de indicação de direção (setas) servem para sinalizar previamente qualquer deslocamento lateral do veículo, como conversões à esquerda/direita, mudanças de faixa e início ou término de ultrapassagens.",
        legalBase: "Art. 35 e Art. 196 do CTB",
        commonMistake: "Achar que acionar a seta concede prioridade ou preferência de passagem sobre os outros veículos.",
        tip: "Seta avisa a intenção da manobra, mas NÃO dá preferência!",
        memoryHook: "Seta indica intenção, não dá preferência!",
        incidence: "alta",
        trap: false,
        difficulty: 3
    },
    {
        id: "detran_ilum_006_alta",
        category: "infracoes",
        statement: "O condutor pretende converter à esquerda em interseção e não aciona o pisca-pisca (seta) nem faz sinal regulamentar de braço com antecedência. Pelo CTB, deixar de indicar a conversão ou a mudança de faixa constitui infração:",
        options: ["Infração Leve, sujeita à penalidade de advertência por escrito do órgão autuador.", "Infração Média, sujeita à penalidade de multa.", "Infração Grave, sujeita a multa e retenção do veículo para regularização.", "Infração Gravíssima, sujeita a recolhimento imediato da CNH."],
        correctIndex: 1,
        explanation: "Esquecer de dar a seta antes de virar ou trocar de faixa é infração de natureza MÉDIA (4 pontos).",
        detailedExplanation: "Deixar de indicar com antecedência, mediante uso da seta ou gesto convencional de braço, a mudança de direção ou de faixa de circulação é infração Média, punida com multa (Art. 196 do CTB).",
        legalBase: "Art. 196 do CTB",
        commonMistake: "Achar que por ser perigoso, não dar seta se trata de infração Grave ou Gravíssima.",
        tip: "Esqueceu da seta = Infração Média (4 pontos e multa)!",
        memoryHook: "Sem seta = Infração Média!",
        incidence: "alta",
        trap: true,
        difficulty: 3
    },
    {
        id: "detran_ilum_007_alta",
        category: "legislacao",
        statement: "Para executar uma ultrapassagem completa e segura em rodovia de pista simples com duplo sentido de circulação, o condutor deve acionar as luzes indicadoras de direção (setas) durante as etapas da manobra da seguinte forma:",
        options: ["Para a esquerda durante todo o percurso, até concluir integralmente a ultrapassagem.", "Para a esquerda ao transpor a faixa de origem e para a direita antes de retornar à faixa original.", "Em conjunto com o pisca-alerta enquanto permanecer na faixa da contramão de direção.", "Apenas piscando o farol alto, dispensando as setas nas vias rurais."],
        correctIndex: 1,
        explanation: "Ultrapassagem exige duas setas: para a esquerda na saída e para a direita ao voltar para a sua pista.",
        detailedExplanation: "Cada deslocamento lateral exige sinalização prévia. O motorista liga a seta para a esquerda ao ir para a faixa oposta e deve obrigatoriamente ligar a seta para a direita para avisar o retorno à sua faixa original.",
        legalBase: "Art. 35 e Art. 196 do CTB",
        commonMistake: "Ligar a seta só para ir para a contramão e esquecer de dar a seta para a direita ao voltar.",
        tip: "Ultrapassagem: Seta esquerda para ir + Seta direita para voltar!",
        memoryHook: "Seta esquerda pra sair, seta direita pra voltar!",
        incidence: "alta",
        trap: true,
        difficulty: 3
    },
    {
        id: "detran_ilum_008_alta",
        category: "mecanica",
        statement: "Ao acionar a seta para a esquerda, o condutor percebe que a luz indicadora no painel pisca em ritmo muito mais acelerado que o habitual, sem qualquer alteração de comando na alavanca. Esse sintoma indica:",
        options: ["Sobrecarga no alternador devido ao uso contínuo do sistema de ar-condicionado.", "Que uma das lâmpadas de seta do lado esquerdo está queimada ou com mau contato.", "Que o relé do pisca-alerta entrou em modo de emergência para economizar a bateria.", "Falha na alavanca de comando que exige desligamento imediato do painel."],
        correctIndex: 1,
        explanation: "Seta piscando rápido no painel é sinal de que uma lâmpada daquele lado queimou lá fora.",
        detailedExplanation: "O ritmo acelerado do pisca no painel é um aviso do sistema elétrico. Como uma das lâmpadas de seta queimou (ou está em mau contato), a resistência do circuito cai e o relé pisca no dobro da frequência.",
        legalBase: "Manual de Manutenção Veicular e Elétrica Auto",
        commonMistake: "Achar que é um problema geral de bateria ou defeito na chave de seta no volante.",
        tip: "Seta rápida no painel = Lâmpada de seta queimada do lado de fora!",
        memoryHook: "Pisca rápido = Lâmpada queimada!",
        incidence: "media",
        trap: true,
        difficulty: 3
    },
    {
        id: "detran_30q_001",
        category: "legislacao",
        statement: "Você conduz um veículo automotor em uma via urbana e observa no bordo direito da pista de rolamento uma placa octogonal de fundo vermelho com a inscrição PARE. Pela classificação geral da sinalização prevista no CTB, essa placa PARE pertence a qual modalidade de sinalização?",
        options: ["Vertical de Regulamentação: impõe obrigação e desrespeitar essa ordem dá infração.", "Dispositivos auxiliares que alertam sobre perigo imediato na via.", "Horizontal de Advertência que só orienta pedestre no acostamento.", "Semafórica de controle de fluxo que alterna a vez na interseção."],
        correctIndex: 0,
        explanation: "Placas fixadas ao lado ou suspensas sobre a via são sinalização vertical (Regulamentação).",
        detailedExplanation: "Conforme os Arts. 87 e 89 do CTB, a sinalização vertical é classificada em Regulamentação, Advertência e Indicação. A placa 'PARE' (R-1) é uma placa de regulamentação fixada na vertical.",
        legalBase: "Art. 87, I do CTB e Resolução CONTRAN nº 973/2022",
        commonMistake: "Confundir sinalização vertical (placas) com sinalização horizontal (pintura no pavimento).",
        tip: "Placa em pé = Vertical. Pintura no chão = Horizontal.",
        memoryHook: "Placa ao lado da via = Sinalização Vertical!",
        incidence: "alta",
        trap: false,
        difficulty: 3
    },
    {
        id: "detran_30q_002",
        category: "legislacao",
        statement: "Um condutor de veículo automotor trafega por via de duplo sentido de circulação na pista de rolamento e pretende converter à direita para ingressar em uma via transversal. Pelas normas gerais de circulação e conduta do CTB, qual deve ser o posicionamento obrigatório do veículo antes da manobra?",
        options: ["Aproximar-se o máximo possível do bordo direito da via enquanto sinaliza a intenção.", "Aproximar-se do eixo central da pista para ter mais ângulo e espaço de manobra.", "Manter-se exatamente no centro da faixa de rolamento e desacelerar bruscamente no momento da virada.", "Deslocar-se para o bordo esquerdo da via antes de virar para garantir visibilidade dos veículos que vêm em sentido contrário."],
        correctIndex: 0,
        explanation: "Para virar à direita, encoste ao máximo no bordo direito (guia/meio-fio).",
        detailedExplanation: "O Art. 38, I do CTB determina que, ao sair da via pelo lado direito, o condutor deve aproximar-se o máximo possível do bordo direito da pista e executar a manobra no menor espaço possível.",
        legalBase: "Art. 38, I do CTB",
        commonMistake: "Confundir o posicionamento da conversão à direita com o da conversão à esquerda em via de duplo sentido.",
        tip: "Vai virar pra direita? Cole no bordo direito.",
        memoryHook: "Virar à direita = Colar na direita!",
        incidence: "alta",
        trap: true,
        difficulty: 3
    },
    {
        id: "detran_30q_003",
        category: "direcao-defensiva",
        statement: "Trafegando em uma rodovia de trânsito rápido a 100 km/h, um motorista percebe no último segundo que ultrapassou a alça de saída para o seu destino. Diante desse cenário e visando à máxima segurança viária, qual é a conduta correta a ser adotada?",
        options: ["Continuar o trajeto com segurança e realizar o retorno no próximo viaduto ou alça regulamentada.", "Imobilizar o veículo no acostamento, acionar o pisca-alerta e efetuar a marcha à ré até o ponto da saída.", "Realizar uma conversão brusca cruzando as faixas de rolamento para alcançar a alça de saída antes do canteiro central.", "Efetuar o retorno sobre o canteiro central divisor de pistas assim que houver uma brecha no tráfego."],
        correctIndex: 0,
        explanation: "Errou a saída? Siga em frente até o próximo retorno seguro.",
        detailedExplanation: "A Marcha à ré em rodovias ou acostamentos é infração gravíssima (Art. 194 do CTB). A única atitude segura e legal é seguir até a próxima oportunidade de retorno.",
        legalBase: "Art. 194 do CTB",
        commonMistake: "Achar que dar ré no acostamento em rodovias é uma manobra permitida em emergências.",
        tip: "Nunca dê ré em rodovias ou acostamentos.",
        memoryHook: "Perdeu a saída? Siga para o próximo retorno!",
        incidence: "alta",
        trap: true,
        difficulty: 3
    },
    {
        id: "detran_30q_004",
        category: "legislacao",
        statement: "Ao circular por uma interseção complexa da via urbana, o condutor de veículo automotor visualiza na pista de rolamento marcas zebradas amarelas com linhas contínuas. A sinalização horizontal que utiliza 'marcas de canalização' tem como finalidade principal:",
        options: ["Orientar e direcionar o fluxo de veículos, ordenando a circulação e proibindo o trânsito ou estacionamento sobre elas.", "Indicar zonas onde o estacionamento é livre para carga e descarga de mercadorias durante o horário comercial.", "Delimitar a área exclusiva destinada ao trânsito de ciclistas e pedestres nas interseções urbanas.", "Alertar sobre a proximidade de radares fixos de fiscalização eletrônica de velocidade."],
        correctIndex: 0,
        explanation: "Marcas de canalização (zebrados) direcionam o trânsito; é proibido transitar ou parar sobre elas.",
        detailedExplanation: "As marcas de canalização direcionam os fluxos do tráfego. Transitar sobre marcas de canalização é infração gravíssima (Art. 214/231 do CTB), e estacionar sobre elas é infração grave (Art. 181, VIII).",
        legalBase: "Anexo II do CTB e Art. 181, VIII do CTB",
        commonMistake: "Achar que a marca de canalização serve de acostamento ou refúgio temporário.",
        tip: "Zebrado no chão = Proibido pisar, parar ou passar por cima.",
        memoryHook: "Zebrado no chão = Área proibida para rodar ou parar!",
        incidence: "media",
        trap: false,
        difficulty: 3
    },
    {
        id: "detran_30q_005",
        category: "meio-ambiente",
        statement: "No programa de Condução Ecológica (Eco-driving), o condutor avalia hábitos de manutenção preventiva para reduzir consumo e emissões. Entre as opções, a que possui maior impacto direto na redução do consumo é:",
        options: ["Manter os pneus do veículo constantemente calibrados de acordo com a pressão recomendada pelo fabricante.", "Utilizar o veículo exclusivamente com o tanque de combustível na capacidade máxima em trajetos curtos.", "Efetuar trocas de óleo do motor com intervalos menores que o recomendado no manual do proprietário.", "Trafegar sempre com as janelas abertas em velocidades acima de 100 km/h para evitar ligar o ar-condicionado."],
        correctIndex: 0,
        explanation: "Pneu murcho aumenta o atrito com o solo e eleva o consumo de combustível.",
        detailedExplanation: "A calibração correta reduz a resistência ao rolamento dos pneus, otimizando o consumo em até 5% e diminuindo a emissão de CO2. Janelas abertas em alta velocidade aumentam o atrito aerodinâmico.",
        legalBase: "Manual de Condução Ecológica do CONTRAN",
        commonMistake: "Acreditar que abrir os vidros em alta velocidade gasta menos combustível do que usar o ar-condicionado.",
        tip: "Pneu calibrado = Menos atrito = Menos combustível gasto.",
        memoryHook: "Pneu cheio = Menos gasto na bomba!",
        incidence: "media",
        trap: true,
        difficulty: 3
    },
    {
        id: "detran_30q_006",
        category: "legislacao",
        statement: "A atualização das normas e Manuais Brasileiros de Sinalização de Trânsito passou a adotar oficialmente o termo 'Sinistro de Trânsito' em substituição à antiga palavra 'Acidente de Trânsito'. Qual é a razão fundamentada para essa mudança conceitual?",
        options: ["Evidenciar que a grande maioria dos eventos no trânsito é evitável e decorrente de falha humana (imprudência, negligência ou imperícia), desmistificando a ideia de 'obra do acaso'.", "Indicar que a palavra 'acidente' aplica-se exclusivamente a colisões que resultam em óbito confirmado no local.", "Padronizar a legislação de trânsito apenas para fins de ressarcimento do seguro obrigatório DPVAT/SPVAT.", "Restringir a aplicação da legislação às ocorrências registradas em rodovias federais e estaduais."],
        correctIndex: 0,
        explanation: "'Sinistro' reforça que quase todo evento de trânsito é evitável e culpa do fator humano.",
        detailedExplanation: "A NBR 10697 da ABNT e o CTB atualizaram a nomenclatura porque 'acidente' passa a ideia de algo inevitável/casual, quando na verdade mais de 90% dos sinistros ocorrem por falha humana evitável.",
        legalBase: "ABNT NBR 10697 e Resoluções do CONTRAN",
        commonMistake: "Achar que a mudança foi meramente burocrática para atender seguradoras.",
        tip: "Sinistro = Evento evitável. Não é obra do acaso.",
        memoryHook: "Sinistro = Falha humana, não é acaso!",
        incidence: "alta",
        trap: false,
        difficulty: 3
    },
    {
        id: "detran_30q_007",
        category: "legislacao",
        statement: "No Manual Brasileiro de Sinalização de Trânsito do CONTRAN, as placas de sinalização vertical de Indicação de fundo predominantemente VERDE, aplicadas sobretudo em rodovias e vias expressas, têm por objetivo principal:",
        options: ["Orientar os condutores quanto às direções, destinos, distâncias e rotas, sendo amplamente aplicadas em rodovias e vias expressas.", "Alertar sobre áreas de preservação ambiental e parques ecológicos nacionais.", "Alertar sobre perigos potenciais na via, tais como curvas acentuadas e aclives pronunciados.", "Indicar locais de interesse turístico, cultural ou histórico aos usuários da via."],
        correctIndex: 0,
        explanation: "Placa verde é de indicação de direção, destino e distância em estradas/rodovias.",
        detailedExplanation: "As placas de indicação de destino e rota em rodovias possuem fundo verde com letras brancas. Placas turísticas são marrons e placas de advertência são amarelas.",
        legalBase: "Anexo II do CTB - Sinalização Vertical de Indicação",
        commonMistake: "Confundir placas verdes (destino/orientação) com placas marrons (atrativos turísticos).",
        tip: "Verde = Destino e distância. Marrom = Turismo.",
        memoryHook: "Siga o verde para achar o seu destino!",
        incidence: "media",
        trap: false,
        difficulty: 3
    },
    {
        id: "detran_30q_008",
        category: "direcao-defensiva",
        statement: "A afirmação de que no trânsito o equilíbrio emocional é tão importante quanto o sistema de freios do veículo expressa um princípio fundamental da Direção Defensiva. Segundo os conceitos do CTB, isso significa que:",
        options: ["A estabilidade psíquica e o autocontrole do condutor são fatores essenciais de segurança passiva e ativa para a prevenção de sinistros.", "Condutores sob forte estresse emocional estão isentos de responsabilidade jurídica em caso de colisão.", "O estado emocional do motorista altera diretamente a resposta mecânica do sistema hidráulico de travagem.", "A capacidade de frenagem do veículo depende unicamente do estado das pastilhas e discos de freio."],
        correctIndex: 0,
        explanation: "O controle emocional evita reações agressivas e decisões imprudentes ao dirigir.",
        detailedExplanation: "A Direção Defensiva baseia-se em 5 elementos (Conhecimento, Atenção, Previsão, Decisão e Habilidade). O equilíbrio emocional afeta diretamente a Atenção e a Decisão do condutor.",
        legalBase: "Manual de Direção Defensiva do DENATRAN",
        commonMistake: "Desconsiderar o fator psicológico como elemento essencial da segurança viária.",
        tip: "Emoção descontrolada = Decisão errada no trânsito.",
        memoryHook: "Calma na direção previne colisão!",
        incidence: "media",
        trap: false,
        difficulty: 3
    },
    {
        id: "detran_30q_009",
        category: "direcao-defensiva",
        statement: "O princípio defensivo 'Ver e Ser Visto' exige que o condutor adote medidas para garantir a visibilidade mútua no trânsito. Qual das alternativas apresenta uma conduta correta alinhada a esse princípio?",
        options: ["Manter lentes dos faróis e lanternas limpas, reguladas e em perfeito estado de funcionamento.", "Utilizar películas insulfilm escuras no para-brisa dianteiro acima dos limites legais para evitar o ofuscamento.", "Circular apenas com as luzes de posição (lanternas) acesas em rodovias durante a noite para economizar bateria.", "Desligar os faróis ao cruzar com outros veículos para não incomodar os motoristas no sentido oposto."],
        correctIndex: 0,
        explanation: "Faróis limpos e regulados garantem que você enxergue a pista e seja visto pelos outros.",
        detailedExplanation: "O Art. 250 do CTB e as regras de Direção Defensiva exigem que o sistema de iluminação esteja em perfeito estado. Trafegar com faróis desregulados ou queimados prejudica a sinalização e a visão.",
        legalBase: "Art. 250 do CTB",
        commonMistake: "Achar que luzes de posição (lanterna) substituem o farol baixo à noite ou em rodovias.",
        tip: "Ver e ser visto = Faróis limpos, regulados e acesos.",
        memoryHook: "Ver e ser visto = Farol limpo e aceso!",
        incidence: "alta",
        trap: false,
        difficulty: 3
    },
    {
        id: "detran_30q_010",
        category: "infracoes",
        statement: "Um motorista realiza uma mudança abrupta de faixa de rolamento sem acionar a luz indicadora de direção (seta) nem fazer sinal regulamentar de braço. De acordo com o Art. 196 do CTB, qual é a gravidade desta infração e qual penalidade está sujeita?",
        options: ["Infração Grave, sujeita a penalidade de Multa.", "Infração Gravíssima, sujeita a Multa e Recolhimento da CNH.", "Infração Média, sujeita a Advertência por escrito apenas.", "Infração Leve, sem aplicação de pontos no prontuário do condutor."],
        correctIndex: 0,
        explanation: "Deixar de dar seta ao mudar de faixa ou virar é infração GRAVE (5 pontos).",
        detailedExplanation: "Art. 196 do CTB: Deixar de indicar com antecedência, mediante gesto regulamentar de braço ou luz indicadora de direção, a realização de manobra: Infração - GRAVE (5 pontos na CNH); Penalidade - Multa.",
        legalBase: "Art. 196 do CTB",
        commonMistake: "Achar que não dar seta é infração média ou leve por ser uma conduta muito comum.",
        tip: "Seta não é opcional! Esqueceu a seta = Infração GRAVE (5 pontos).",
        memoryHook: "Sem seta na mudança = Infração GRAVE!",
        incidence: "alta",
        trap: true,
        difficulty: 3
    },
    {
        id: "detran_30q_011",
        category: "legislacao",
        statement: "Ao trafegar com veículo automotor por via urbana classificada como LOCAL (via urbana residencial ou de acesso restrito) onde NÃO exista sinalização regulamentadora de velocidade, qual é a velocidade máxima permitida pelo CTB (Art. 61)?",
        options: ["30 km/h, limite padrão das vias locais sem sinalização (Art. 61).", "40 km/h, limite padrão das vias coletoras urbanas.", "60 km/h, limite padrão das vias arteriais urbanas.", "80 km/h, limite padrão das vias de trânsito rápido."],
        correctIndex: 0,
        explanation: "A velocidade máxima padrão para via local não sinalizada é 30 km/h.",
        detailedExplanation: "O Art. 61, § 1º, I do CTB estabelece para vias urbanas não sinalizadas: Trânsito Rápido = 80 km/h; Arterial = 60 km/h; Coletora = 40 km/h; Local = 30 km/h.",
        legalBase: "Art. 61, § 1º, I, 'd' do CTB",
        commonMistake: "Confundir a velocidade da via local (30 km/h) com a da via coletora (40 km/h).",
        tip: "Vias Urbanas: Rápida (80) - Arterial (60) - Coletora (40) - Local (30).",
        memoryHook: "Via Local = Max 30 km/h!",
        incidence: "alta",
        trap: true,
        difficulty: 3
    },
    {
        id: "detran_30q_012",
        category: "infracoes",
        statement: "Um condutor de veículo automotor de passeio decide realizar a transposição de faixa para a faixa da direita regulamentada como EXCLUSIVA para ônibus do transporte público coletivo para fugir de congestionamento. Pelo Art. 184, III do CTB, como essa conduta é classificada?",
        options: ["Infração Gravíssima, sujeita a penalidade de Multa e medida administrativa de Remoção do Veículo.", "Infração Grave, sujeita apenas a penalidade de Multa.", "Infração Média, com retenção do veículo até a chegada do transporte público.", "Permitida fora dos horários de pico, não constituindo infração de trânsito."],
        correctIndex: 0,
        explanation: "Transitar em faixa exclusiva de ônibus é infração GRAVÍSSIMA com remoção do veículo.",
        detailedExplanation: "A Lei 13.154/2015 alterou o Art. 184, III do CTB: Transitar na faixa/via de trânsito exclusivo regulamentada para o transporte público coletivo de passageiros é infração GRAVÍSSIMA, com Multa e Remoção do veículo.",
        legalBase: "Art. 184, III do CTB",
        commonMistake: "Achar que a infração é apenas grave ou média por ser uma invasão temporária.",
        tip: "Faixa Exclusiva de Ônibus = Gravíssima + Guincho (Remoção).",
        memoryHook: "Faixa de ônibus = Gravíssima + Guincho!",
        incidence: "alta",
        trap: true,
        difficulty: 3
    },
    {
        id: "detran_30q_013",
        category: "mecanica",
        statement: "O sistema de airbag (bolsa inflável) é equipamento de segurança passiva obrigatório nos veículos modernos. Para que cumpra sua função sem causar lesões graves ao ocupante em colisão, é indispensável o uso concomitante do:",
        options: ["Cinto de segurança, que retém o corpo e evita que o ocupante seja projetado contra a bolsa em expansão.", "Freio ABS, que impede o travamento das rodas durante o acionamento do airbag.", "Encosto de cabeça ajustado na altura do pescoço para evitar o efeito chicote no impacto lateral.", "Limpador de para-brisa em velocidade máxima para manter a visibilidade durante a colisão."],
        correctIndex: 0,
        explanation: "O airbag complementa o cinto de segurança; sem o cinto, a explosão do airbag pode ferir gravemente.",
        detailedExplanation: "O airbag é um sistema complementar de retenção. Se o ocupante não estiver usando o cinto de segurança, a força de expansão da bolsa (mais de 300 km/h) pode causar traumas cervicais ou fatais.",
        legalBase: "Manual de Segurança Veicular - CONTRAN",
        commonMistake: "Acreditar que o airbag substitui a necessidade do cinto de segurança.",
        tip: "Airbag SEM cinto de segurança = Risco de lesão gravíssima.",
        memoryHook: "Airbag exige cinto de segurança!",
        incidence: "media",
        trap: false,
        difficulty: 3
    },
    {
        id: "detran_30q_014",
        category: "direcao-defensiva",
        statement: "Ao entrar em uma via de trânsito rápido ou rodovia através de uma alça de acesso, o condutor se depara com a faixa de aceleração. Qual é a função técnica dessa faixa e a postura correta a ser adotada pelo condutor?",
        options: ["Aumentar a velocidade do veículo na faixa suplementar para equipará-la ao fluxo da via principal antes de efetuar a fusão (incorporação).", "Imobilizar o veículo no início da faixa e aguardar até que a via principal esteja totalmente deserta.", "Reduzir a velocidade para 20 km/h e buzinar para que os veículos da via principal deem passagem.", "Servir como acostamento temporário para parada de emergência e desembarque de passageiros."],
        correctIndex: 0,
        explanation: "A faixa de aceleração serve para atingir a velocidade do fluxo e entrar na pista com segurança.",
        detailedExplanation: "A faixa de aceleração permite que o veículo ganhe velocidade para intercalar-se no tráfego da via preferencial sem interromper o fluxo constante dos veículos que já circulam por ela.",
        legalBase: "Anexo I do CTB e Manual de Sinalização Urbana",
        commonMistake: "Parar o carro no meio da faixa de aceleração em vez de usar o espaço para ganhar velocidade.",
        tip: "Faixa de Aceleração = Acelere para entrar na mesma velocidade do trânsito.",
        memoryHook: "Acelere para entrar no fluxo!",
        incidence: "alta",
        trap: false,
        difficulty: 3
    },
    {
        id: "detran_30q_015",
        category: "infracoes",
        statement: "Um condutor trafega atrás de uma ambulância que está com os alarmes sonoros e iluminação vermelha intermitente acionados, utilizando o 'vácuo' do veículo de emergência para ultrapassar o trânsito congestionado. Essa conduta configura qual tipo de infração segundo o Art. 190 do CTB?",
        options: ["Infração Grave, sujeita a penalidade de Multa.", "Infração Gravíssima, com suspensão imediata do direito de dirigir.", "Infração Média, com retenção do veículo.", "Conduta permitida, desde que se mantenha distância de segurança de 5 metros."],
        correctIndex: 0,
        explanation: "Seguir veículo de socorro/emergência em serviço é infração GRAVE (5 pontos).",
        detailedExplanation: "Art. 190 do CTB: Seguir veículo em serviço de urgência, com alarme sonoro ou iluminação regulamentar acionados: Infração - GRAVE (5 pontos na CNH); Penalidade - Multa.",
        legalBase: "Art. 190 do CTB",
        commonMistake: "Achar que seguir ambulância é apenas falta de educação e não infração prevista no CTB.",
        tip: "Aproveitar o 'vácuo' de ambulância = Infração GRAVE.",
        memoryHook: "Seguir ambulância = Infração GRAVE!",
        incidence: "alta",
        trap: true,
        difficulty: 3
    },
    {
        id: "detran_30q_016",
        category: "direcao-defensiva",
        statement: "No contexto dos conceitos de cidadania e de direção defensiva previstos na segurança do trânsito, qual das opções a seguir expressa o verdadeiro perfil de um bom condutor, aquele que efetivamente preserva vidas?",
        options: ["Aquele que cumpre rigorosamente as normas de trânsito, antecipa perigos e age com cortesia, abrindo mão de seu direito para preservar vidas.", "Aquele que trafega sempre no limite máximo de velocidade para não atrasar os demais condutores.", "Aquele que domina manobras de alta perícia em piso molhado e utiliza atalhos não regulamentados.", "Aquele que possui veículo moderno equipado com assistentes eletrônicos de última geração."],
        correctIndex: 0,
        explanation: "O bom condutor dirige defensivamente, respeita as leis e foca na segurança coletiva.",
        detailedExplanation: "Direção defensiva é dirigir de modo a evitar acidentes, apesar das ações incorretas dos outros e das condições adversas. Envolve postura cidadã, respeito e prevenção.",
        legalBase: "Manual de Direção Defensiva - DENATRAN",
        commonMistake: "Confundir habilidade técnica/perícia rápida com postura defensiva e segura.",
        tip: "Bom condutor = Prevenção + Cortesia + Respeito às leis.",
        memoryHook: "Bom condutor = Cortesia e prevenção!",
        incidence: "baixa",
        trap: false,
        difficulty: 3
    },
    {
        id: "detran_30q_017",
        category: "direcao-defensiva",
        statement: "Ao aproximar-se de uma interseção em perímetro urbano com o veículo automotor, o condutor observa um pedestre iniciando a travessia da via urbana fora da faixa de pedestres. Pelo princípio da vulnerabilidade no trânsito (Art. 29, § 2º do CTB), qual deve ser a atitude do condutor?",
        options: ["Reduzir a velocidade do veículo, dar a preferência ao pedestre e aguardar a travessia com segurança.", "Buzinar continuamente para advertir o pedestre e manter a velocidade, pois a preferência é do veículo.", "Efetuar uma frenagem brusca sobre a pista e acionar o pisca-alerta imediatamente.", "Apressar a marcha acelerando o motor para passar antes que o pedestre tome o centro da pista."],
        correctIndex: 0,
        explanation: "O pedestre é o ente mais vulnerável; o condutor deve sempre zelar pela sua segurança.",
        detailedExplanation: "Art. 29, § 2º do CTB: Os veículos de maior porte serão sempre responsáveis pela segurança dos menores, os motorizados pelos não motorizados e, juntos, pela proteção dos pedestres.",
        legalBase: "Art. 29, § 2º do CTB",
        commonMistake: "Acreditar que, por estar fora da faixa, o pedestre perde o direito à vida e à proteção do condutor.",
        tip: "Pedestre é sempre prioridade de proteção, estando ou não na faixa.",
        memoryHook: "Proteja sempre o pedestre!",
        incidence: "alta",
        trap: true,
        difficulty: 3
    },
    {
        id: "detran_30q_018",
        category: "infracoes",
        statement: "Durante uma fiscalização de rotina na rodovia, o condutor desobedece às ordens claras de parada emanadas de um Agente da Autoridade de Trânsito devidamente uniformizado. Segundo o Art. 195 do CTB, qual é a gravidade dessa infração?",
        options: ["Infração Grave, sujeita a penalidade de Multa.", "Infração Gravíssima, com cassação imediata do documento de habilitação.", "Infração Média, sujeita apenas a advertência verbal posterior.", "Infração Leve, não gerando pontos no prontuário."],
        correctIndex: 0,
        explanation: "Desobedecer ordens do Agente de Trânsito é infração GRAVE (Art. 195).",
        detailedExplanation: "Art. 195 do CTB: Desobedecer às ordens emanadas da autoridade competente de trânsito ou de seus agentes: Infração - GRAVE (5 pontos); Penalidade - Multa.",
        legalBase: "Art. 195 do CTB",
        commonMistake: "Confundir desobedecer agente de trânsito (Grave - Art. 195) com furar bloqueio policial (Gravíssima - Art. 210).",
        tip: "Desobedecer sinal/ordem do agente = Infração GRAVE.",
        memoryHook: "Desobedecer agente = Infração GRAVE!",
        incidence: "alta",
        trap: true,
        difficulty: 3
    },
    {
        id: "detran_30q_019",
        category: "legislacao",
        statement: "Ao trafegar por via urbana, o condutor observa elementos de sinalização vertical e dispositivos temporários de obras com fundo na cor LARANJA, previstos no Manual do CONTRAN. Essa coloração específica indica:",
        options: ["Sinalização de Obras e situações temporárias na via, exigindo maior atenção e redução de velocidade.", "Pontos turísticos de interesse histórico e cultural na região.", "Locais com alto índice de travessia de escolares e crianças.", "Áreas de estacionamento exclusivo para veículos de emergência."],
        correctIndex: 0,
        explanation: "A cor laranja é usada exclusivamente para sinalização temporária e de Obras.",
        detailedExplanation: "A sinalização temporária (obras, desvios, manutenções na via) utiliza a cor laranja como padrão para alertar o condutor sobre alterações atípicas nas condições normais do tráfego.",
        legalBase: "Anexo II do CTB - Sinalização de Obras",
        commonMistake: "Confundir a cor laranja (obras) com a cor amarela (advertência permanente).",
        tip: "Cor Laranja = Obras e intervenções temporárias na pista.",
        memoryHook: "Placa laranja = Obras na via!",
        incidence: "media",
        trap: false,
        difficulty: 3
    },
    {
        id: "detran_30q_020",
        category: "meio-ambiente",
        statement: "Para trajeto de curta distância no perímetro urbano, o cidadão compara modais quanto a custo, emissão de poluentes e benefício à saúde. O modal que apresenta custo financeiro zero e impacto zero em emissões é:",
        options: ["Caminhada (deslocamento a pé), de custo financeiro zero e emissão nula de poluentes.", "Ciclomotores elétricos de alta velocidade, com emissão zero porém custo de aquisição.", "Automóveis movidos a biocombustíveis em carona compartilhada paga.", "Motocicletas de baixa cilindrada com combustível flex."],
        correctIndex: 0,
        explanation: "A caminhada a pé é a forma mais limpa, barata e sustentável de mobilidade ativa.",
        detailedExplanation: "A mobilidade a pé (transporte ativo) não gera qualquer emissão de CO2 ou poluentes atmosféricos, não consome energia não renovável e possui custo direto zero.",
        legalBase: "Diretrizes da Política Nacional de Mobilidade Urbana (Lei 12.587/2012)",
        commonMistake: "Acreditar que ciclomotores ou motos elétricas possuem impacto ambiental nulo na fabricação/descarte de baterias.",
        tip: "Impacto totalmente NULO e custo ZERO = Caminhada.",
        memoryHook: "Caminhada = Custo zero e impacto zero!",
        incidence: "baixa",
        trap: false,
        difficulty: 3
    },
    {
        id: "detran_30q_021",
        category: "legislacao",
        statement: "Dois veículos aproximam-se simultaneamente de uma interseção em nível em formato de ROTATÓRIA não sinalizada. Segundo as regras gerais de preferência de passagem do CTB (Art. 29, III, 'b'), a preferência pertence:",
        options: ["Ao veículo que já estiver circulando pela rotatória.", "Ao veículo que se aproxima pelo lado direito do cruzamento, independentemente de estar dentro da rotatória.", "Ao veículo de maior de porte ou que estiver trafegando em maior velocidade.", "Ao veículo que pretende efetuar a conversão à esquerda no anel viário."],
        correctIndex: 0,
        explanation: "Na rotatória sem sinalização, a preferência é do veículo que já está circulando dentro dela.",
        detailedExplanation: "Art. 29, III, 'b' do CTB: No caso de rotatória, a preferência de passagem será do veículo que estiver circulando por ela.",
        legalBase: "Art. 29, III, 'b' do CTB",
        commonMistake: "Aplicar a regra genérica da 'direita' em locais onde existe rotatória.",
        tip: "Rotatória = Preferência de quem JÁ ESTÁ dentro dela.",
        memoryHook: "Quem está na rotatória tem preferência!",
        incidence: "alta",
        trap: true,
        difficulty: 3
    },
    {
        id: "detran_30q_022",
        category: "legislacao",
        statement: "Um cidadão habilitado exclusivamente na Categoria 'B' pretende conduzir um veículo utilitário do tipo Picape/Camioneta. Para permanecer dentro dos limites legais estipulados pelo Art. 143 do CTB, o veículo deve atender às seguintes condições simultâneas:",
        options: ["Peso Bruto Total (PBT) de até 3.500 kg e lotação que não exceda a 8 lugares, excluído o do motorista.", "Peso Bruto Total (PBT) de até 6.000 kg e lotação de até 12 passageiros.", "Qualquer peso bruto total, desde que o veículo não transporte carga perigosa.", "Lotação máxima de até 15 passageiros, independentemente do peso do veículo."],
        correctIndex: 0,
        explanation: "Categoria B autoriza veículos com PBT de até 3.500 kg e máximo de 8 passageiros.",
        detailedExplanation: "Art. 143, II do CTB: Categoria B - condutor de veículo motorizado cujo peso bruto total não exceda a 3.500 kg e cuja lotação não exceda a 8 lugares, excluído o do condutor.",
        legalBase: "Art. 143, II do CTB",
        commonMistake: "Achar que a categoria B permite conduzir vans com mais de 8 passageiros ou caminhões leves acima de 3,5t.",
        tip: "Categoria B = Até 3.500 kg PBT + Até 8 passageiros.",
        memoryHook: "Cat B = Até 3.500kg e 8 passageiros!",
        incidence: "alta",
        trap: true,
        difficulty: 3
    },
    {
        id: "detran_30q_023",
        category: "legislacao",
        statement: "Ao chegar a uma interseção com sinalização semafórica, o condutor do veículo automotor observa a luz vermelha acesa. Contudo, um agente da autoridade de trânsito no local determina com gestos claros que o veículo avance. Qual ordem deve ser seguida pela hierarquia das sinalizações (Art. 89 do CTB)?",
        options: ["Seguir a ordem do Agente de Trânsito, pois suas ordens prevalecem sobre as indicações do semáforo e demais sinais.", "Aguardar a luz verde do semáforo, pois equipamentos eletrônicos possuem prioridade sobre ordens humanas.", "Imobilizar o veículo e aguardar a chegada de uma viatura policial para confirmação da ordem.", "Seguir as regras da placa de 'PARE' que porventura esteja afixada no local."],
        correctIndex: 0,
        explanation: "A ordem do Agente de Trânsito prevalece sobre TODOS os outros sinais e regras.",
        detailedExplanation: "Art. 89 do CTB estabelece a hierarquia: I - as ordens do agente de trânsito prevalecem sobre as indicações dos sinais e as demais normas de trânsito; II - as indicações do semáforo sobre os demais sinais.",
        legalBase: "Art. 89, I do CTB",
        commonMistake: "Acreditar que o sinal vermelho obriga o motorista a parar mesmo se o agente mandar passar.",
        tip: "No topo da hierarquia do trânsito está SEMPRE a ordem do Agente.",
        memoryHook: "Ordem do agente prevalece sempre!",
        incidence: "alta",
        trap: false,
        difficulty: 3
    },
    {
        id: "detran_30q_024",
        category: "infracoes",
        statement: "Um veículo é flagrado por um radar fixo trafegando a 72 km/h em uma via cuja velocidade máxima permitida era de 60 km/h (excesso de velocidade de 20%). De acordo com o Art. 218, I do CTB, qual é a gravidade desta infração?",
        options: ["Infração Média, sujeita a penalidade de Multa.", "Infração Grave, com retenção da CNH do condutor.", "Infração Gravíssima, com suspensão automática do direito de dirigir.", "Infração Leve, sujeita apenas a advertência pedagógica."],
        correctIndex: 0,
        explanation: "Excesso de velocidade em ATÉ 20% acima do limite é infração MÉDIA (4 pontos).",
        detailedExplanation: "Art. 218 do CTB: I - quando a velocidade for superior à máxima em até 20%: Infração - MÉDIA; II - de 20% até 50%: Infração - GRAVE; III - superior a 50%: Infração - GRAVÍSSIMA.",
        legalBase: "Art. 218, I do CTB",
        commonMistake: "Confundir os limites de enquadramento da velocidade (Até 20% = Média; De 20% a 50% = Grave; Acima de 50% = Gravíssima).",
        tip: "Velocidade: Até +20% (Média) | +20% a +50% (Grave) | Mais de +50% (Gravíssima).",
        memoryHook: "Até 20% acima do limite = Infração Média!",
        incidence: "alta",
        trap: true,
        difficulty: 3
    },
    {
        id: "detran_30q_025",
        category: "direcao-defensiva",
        statement: "A sinalização antecedente de manobras mediante uso de seta (luz indicadora de direção) é um dever de todo condutor previsto no CTB. O objetivo fundamental dessa exigência legal e dessa direção defensiva é:",
        options: ["Garantir a previsibilidade das ações do motorista, permitindo que os demais usuários da via reajam com segurança.", "Evitar a descarga excessiva da bateria do veículo durante deslocamentos noturnos.", "Garantir o direito de preferência absoluto sobre pedestres e veículos ao mudar de faixa.", "Cumprir uma mera formalidade administrativa sem impacto na prevenção de sinistros."],
        correctIndex: 0,
        explanation: "A seta serve para dar previsibilidade às suas manobras para os outros condutores.",
        detailedExplanation: "A Direção Defensiva fundamenta-se na 'Previsão'. Indicar previamente a intenção de mudar de faixa ou virar permite que os outros motoristas e pedestres antecipem o movimento e evitem colisões.",
        legalBase: "Art. 196 do CTB e Manual de Direção Defensiva",
        commonMistake: "Achar que dar a seta dá 'direito automático de passagem' e obriga os outros a cederem espaço.",
        tip: "Seta comunica intenção e gera PREVISIBILIDADE. Não dá prioridade.",
        memoryHook: "Seta gera previsibilidade no trânsito!",
        incidence: "media",
        trap: false,
        difficulty: 3
    },
    {
        id: "detran_30q_026",
        category: "direcao-defensiva",
        statement: "O Código de Trânsito Brasileiro estabelece a regra de proteção aos mais vulneráveis. De acordo com a legislação e os princípios da Direção Defensiva, qual é a ordem correta de responsabilidade pela segurança no trânsito?",
        options: ["Os veículos de maior porte são responsáveis pelos menores, os motorizados pelos não motorizados, e todos juntos pela proteção dos pedestres.", "Os pedestres são totalmente responsáveis por sua própria segurança, devendo ceder passagem a qualquer tipo de veículo.", "Veículos de transporte coletivo possuem prioridade absoluta e isenção de responsabilidade sobre ciclistas.", "Os veículos mais rápidos e modernos possuem preferência legal de passagem sobre os mais antigos."],
        correctIndex: 0,
        explanation: "O maior protege o menor, o motorizado protege o não motorizado e todos protegem o pedestre.",
        detailedExplanation: "Art. 29, § 2º do CTB consolida o princípio da vulnerabilidade no trânsito, impondo maior dever de cuidado aos condutores de veículos de grande porte em relação aos pedestres e ciclistas.",
        legalBase: "Art. 29, § 2º do CTB",
        commonMistake: "Inverter a ordem de responsabilidade achando que o pedestre deve sempre parar para o carro.",
        tip: "Maior protege o menor. Todos protegem o pedestre.",
        memoryHook: "O maior protege o menor sempre!",
        incidence: "alta",
        trap: false,
        difficulty: 3
    },
    {
        id: "detran_q20_n1",
        category: "infracoes",
        statement: "Após chuva, o condutor trafega por via urbana no perímetro e atravessa poça d'água na pista de rolamento, arremessando água sobre pedestres na calçada. Pelo CTB, essa conduta é classificada como infração:",
        options: ["Infração média, punida com multa administrativa.", "Mera contravenção de mau gosto, sem enquadramento no CTB.", "Conduta apenas antiética, sem previsão de sanção de trânsito.", "Infração leve, punida exclusivamente com advertência verbal do agente."],
        correctIndex: 0,
        explanation: "Jogar água de poça nos pedestres na calçada é infração média com multa.",
        detailedExplanation: "Usar o carro para jogar água ou sujeira nas pessoas na rua é infração de trânsito média e gera multa (Art. 171 do CTB).",
        legalBase: "Art. 171 do CTB",
        commonMistake: "Achar que é só falta de educação e não dá multa.",
        tip: "Jogar água no pedestre = Multa de infração média!",
        memoryHook: "Jogar água em pedestre = Infração Média!",
        incidence: "alta",
        trap: true,
        difficulty: 1
    },
    {
        id: "detran_q21_n1",
        category: "primeiros-socorros",
        statement: "Durante o atendimento a vítimas de acidente com sangramento visível, o socorrista fica exposto ao contato direto com fluidos sanguíneos e possíveis agentes infecciosos. É aconselhável, nesse contexto, que ele:",
        options: ["Utilize proteção individual — luva de borracha ou material equivalente — antes do contato com a vítima.", "Aplique torniquete de rotina em todos os membros com ferimento sanguíneo.", "Aplique compressa fria sobre o ferimento para conter o fluxo sanguíneo.", "Execute garrote improvisado com fio metálico acima da lesão."],
        correctIndex: 0,
        explanation: "Use luvas de borracha para não pegar doenças pelo sangue da vítima.",
        detailedExplanation: "Para se proteger de doenças transmitidas pelo sangue (biossegurança), use sempre luvas de borracha ou sacos plásticos antes de socorrer quem está sangrando.",
        legalBase: "Manual de Primeiros Socorros do DENATRAN",
        commonMistake: "Achar que deve fazer torniquete ou garrote em qualquer sangramento.",
        tip: "Vítima sangrando = Use luva para se proteger!",
        memoryHook: "Sangramento = Proteja-se com luvas!",
        incidence: "alta",
        trap: false,
        difficulty: 1
    },
    {
        id: "detran_q23_n1",
        category: "infracoes",
        statement: "Em rodovia de pista simples, o condutor realiza ultrapassagem invadindo a contramão de direção exatamente sobre a faixa de travessia de pedestres e é flagrado pelo agente. Pelo CTB, essa conduta é infração de natureza:",
        options: ["Infração Leve, sujeita apenas a advertência por escrito.", "Infração Média, sujeita a multa com pontuação de 4 pontos.", "Infração Gravíssima, sujeita a multa com pontuação de 7 pontos na CNH.", "Infração Grave, sujeita a multa e retenção do veículo."],
        correctIndex: 2,
        explanation: "Ultrapassar pela contramão em cima da faixa de pedestre é infração gravíssima.",
        detailedExplanation: "Passar outro carro invadindo a pista contrária (contramão) em cima da travessia de pedestres é estritamente proibido e gera infração gravíssima (Art. 203, II do CTB).",
        legalBase: "Art. 203, II do CTB",
        commonMistake: "Confundir com infração grave pelo perigo de atropelamento.",
        tip: "Ultrapassar na contramão na faixa de pedestre = Gravíssima!",
        memoryHook: "Ultrapassagem na faixa = Gravíssima!",
        incidence: "alta",
        trap: true,
        difficulty: 1
    },
    {
        id: "detran_q24_n1",
        category: "primeiros-socorros",
        statement: "No atendimento inicial prestado a vítima de acidente de trânsito, que pode necessitar de procedimento cirúrgico ou sedação de urgência, a conduta correta em relação à ingestão de líquidos por via oral antes do atendimento é:",
        options: ["Liberar a ingestão de líquidos desde que a vítima esteja lúcida e orientada.", "Manter a vítima em jejum absoluto até a avaliação da equipe de saúde.", "Oferecer água à vítima para acalmá-la durante a espera do resgate.", "Administrá-la em suco para evitar queda de pressão arterial."],
        correctIndex: 1,
        explanation: "Deixe o ferido sem comer e sem beber nada até o médico chegar.",
        detailedExplanation: "Não dê água nem comida para o ferido (manter em jejum), pois se ele precisar de cirurgia urgente no hospital ou desmaiar, pode se engasgar (broncoaspiração).",
        legalBase: "Manual de Primeiros Socorros do DENATRAN",
        commonMistake: "Dar água para 'acalmar' a vítima assustada.",
        tip: "Vítima de acidente = Nada de água ou comida!",
        memoryHook: "Vítima de acidente em jejum total!",
        incidence: "alta",
        trap: true,
        difficulty: 1
    },
    {
        id: "detran_q25_n1",
        category: "mecanica",
        statement: "No meio do trajeto urbano, o painel acende e mantém acesa a luz indicadora de falha no sistema de arrefecimento do motor, sem vapor sob o capô. O procedimento correto do condutor diante desse alerta é:",
        options: ["Imobilizar o veículo e verificar o nível do óleo lubrificante do motor.", "Desligar o instrumento de medição de pressão para silenciar o alerta do painel.", "Imobilizar o veículo em local seguro e verificar o nível de líquido de arrefecimento.", "Prosseguir a viagem normalmente, pois o alerta dispensa atenção imediata."],
        correctIndex: 2,
        explanation: "Luz de temperatura acendeu? Pare o carro e olhe a água do motor.",
        detailedExplanation: "Se o painel avisar esquentamento no sistema de resfriamento do motor (sistema de arrefecimento), pare em local seguro e confira o nível do líquido/água com o motor frio.",
        legalBase: "Manual do Condutor / Mecânica Básica",
        commonMistake: "Confundir água do arrefecimento com nível de óleo do motor.",
        tip: "Luz de arrefecimento = Parar e conferir a água!",
        memoryHook: "Motor quente = Pare e espere esfriar!",
        incidence: "media",
        trap: false,
        difficulty: 1
    },
    {
        id: "detran_q26_n1",
        category: "legislacao",
        statement: "O pedestre aproxima-se de travessia sinalizada com o semáforo para pedestres de código SS-08, cujo sinal encontra-se aceso naquele instante. Diante dessa indicação semafórica, a atitude correta a ser adotada é:",
        options: ["Iniciar a travessia, pois o sinal verde autoriza o pedestre a seguir.", "Não ultrapassar a linha de retenção, permanecendo na calçada até a troca do sinal.", "Atenção apenas, cruzando com cautela independentemente da indicação.", "Parar o veículo em movimento para facilitar a travessia imediata."],
        correctIndex: 1,
        explanation: "Sinaleiro vermelho para pedestre (SS-08) significa que você não pode atravessar.",
        detailedExplanation: "A placa/sinalização SS-08 indica o bonequinho vermelho aceso (semáforo de pedestre). O pedestre não pode atravessar a rua (não pode ultrapassar a linha de espera).",
        legalBase: "Resolução CONTRAN nº 973/2022 (Sinalização Semafórica)",
        commonMistake: "Achar que a palavra 'ultrapassar' é exclusiva para motoristas.",
        tip: "Sinal vermelho no semáforo de pedestre = Proibido atravessar!",
        incidence: "alta",
        trap: true,
        difficulty: 1
    },
    {
        id: "detran_q27_n1",
        category: "legislacao",
        statement: "Dentre as normas gerais de circulação e conduta previstas no CTB, assinale a alternativa que exprime corretamente uma das regras de conduta impostas pelo Código de Trânsito ao condutor e aos ocupantes do veículo:",
        options: ["Os animais isolados ou em grupos não poderão circular nas vias urbanas ou rurais.", "A parada para embarque de passageiros não poderá ser efetuada onde o estacionamento é proibido.", "O condutor e o passageiro não deverão abrir a porta sem certificar-se de que não há perigo.", "Em nenhuma hipótese será permitida a circulação de bicicletas nos passeios."],
        correctIndex: 2,
        explanation: "Só abra a porta do carro depois de olhar se não vem vindo ninguém.",
        detailedExplanation: "Motorista e passageiros só podem abrir as portas do carro após olhar pelos espelhos e ter certeza de que não vão atingir ciclistas, pedestres ou outros carros (Art. 49 do CTB).",
        legalBase: "Art. 49 do CTB",
        commonMistake: "Achar que é permitido desembarcar rápido sem olhar se vem bicicleta ou moto.",
        tip: "Vai abrir a porta? Olhe antes para não causar acidente!",
        incidence: "alta",
        trap: false,
        difficulty: 1
    },
    {
        id: "detran_q20_n2",
        category: "infracoes",
        statement: "Após forte chuva, o condutor trafega por via urbana e atravessa poça d'água na pista de rolamento, arremessando água sobre pedestres na calçada com impacto. Pela regulamentação, essa conduta é considerada:",
        options: ["Infração de trânsito média, sujeita a penalidade de multa.", "Mera brincadeira de mau gosto, sem sanção de trânsito.", "Desrespeito moral aos pedestres, sem enquadramento legal.", "Infração leve, sujeita somente a advertência verbal do agente."],
        correctIndex: 0,
        explanation: "Arremessar água em pedestres é infração média punida com multa de trânsito.",
        detailedExplanation: "Passar por poças d'água de propósito ou por falta de atenção espirrando água nas pessoas na calçada é infração de trânsito média (Art. 171 do CTB), gerando penalidade de multa.",
        legalBase: "Art. 171 do CTB",
        commonMistake: "Achar que por ser na calçada é apenas uma falha de postura ou infração leve.",
        tip: "Molhou pedestre com o carro = Infração Média com Multa!",
        incidence: "alta",
        trap: true,
        difficulty: 2
    },
    {
        id: "detran_q21_n2",
        category: "primeiros-socorros",
        statement: "Ao prestar o primeiro atendimento a vítima de acidente com ferimentos abertos e sangramento abundante, o socorrista fica exposto ao contato com fluidos biológicos. A recomendação técnica correta é que ele:",
        options: ["Utilize proteção individual — luva de borracha ou material equivalente — antes do contato com a ferida.", "Aplique torniquete de rotina em todos os membros com ferimento sanguíneo.", "Aplique compressa fria sobre o ferimento para conter o fluxo sanguíneo.", "Execute garrote improvisado com fio metálico acima da lesão."],
        correctIndex: 0,
        explanation: "Sempre coloque luvas antes de tocar em ferimentos sangrando para sua própria proteção.",
        detailedExplanation: "Em qualquer socorro com sangramento, a primeira regra de proteção do socorrista (biossegurança) é usar luvas de borracha/látex para evitar infecção ou contágio por doenças transmitidas pelo sangue.",
        legalBase: "Manual de Primeiros Socorros do DENATRAN",
        commonMistake: "Tentar fazer garrote ou torniquete sem treinamento adequado.",
        tip: "Sangramento na vítima = Proteja-se com luvas em 1º lugar!",
        incidence: "alta",
        trap: false,
        difficulty: 2
    },
    {
        id: "detran_q23_n2",
        category: "infracoes",
        statement: "O condutor realiza a ultrapassagem de outro veículo invadindo a contramão de direção exatamente sobre a faixa destinada à travessia de pedestres, em via de trânsito. Pelo CTB, essa conduta é classificada como infração de natureza:",
        options: ["Infração Leve, com advertência por escrito.", "Infração Média, com multa e 4 pontos na CNH.", "Infração Gravíssima, com multa e 7 pontos na CNH.", "Infração Grave, com multa e retenção do veículo."],
        correctIndex: 2,
        explanation: "Ultrapassar invadindo a pista contrária na faixa de pedestre é infração gravíssima.",
        detailedExplanation: "Fazer ultrapassagem pela pista contrária (contramão) em trechos perigosos como faixas de pedestres, pontes ou cruzamentos é infração de natureza gravíssima (Art. 203, II do CTB).",
        legalBase: "Art. 203, II do CTB",
        commonMistake: "Confundir a ultrapassagem proibida com infração grave.",
        tip: "Ultrapassagem na contramão em faixa de pedestre = Gravíssima!",
        incidence: "alta",
        trap: true,
        difficulty: 2
    },
    {
        id: "detran_q24_n2",
        category: "primeiros-socorros",
        statement: "Em acidente de trânsito, vítima consciente e lúcida pede um copo de água enquanto aguarda o atendimento. Considerando a possibilidade de cirurgia de urgência, a conduta correta quanto à ingestão de líquidos é:",
        options: ["Liberar a ingestão de líquidos desde que a vítima esteja lúcida e orientada.", "Manter a vítima em jejum absoluto até a avaliação da equipe de saúde.", "Oferecer água à vítima para acalmá-la durante a espera do resgate.", "Administrá-la em suco para evitar queda de pressão arterial."],
        correctIndex: 1,
        explanation: "Não ofereça água ou comida; mantenha o ferido em jejum total.",
        detailedExplanation: "O ferido não deve beber nada (manter em jejum) para não se engasgar ou vomitar em caso de perda de consciência, além de não atrapalhar procedimentos com anestesia no hospital.",
        legalBase: "Manual de Primeiros Socorros do DENATRAN",
        commonMistake: "Dar água ou suco imaginando que vai ajudar a conter a queda de pressão.",
        tip: "Atendimento inicial = Vítima sempre em JEJUM!",
        incidence: "alta",
        trap: true,
        difficulty: 2
    },
    {
        id: "detran_q25_n2",
        category: "mecanica",
        statement: "Durante tráfego em via expressa, com a temperatura do motor acima da faixa normal, o painel acusa problema no sistema de arrefecimento. Considerando os riscos de dano ao motor, o procedimento correto é:",
        options: ["Imobilizar o veículo e verificar o nível do óleo lubrificante no cárter.", "Desligar o manômetro de pressão para eliminar o alerta persistente do painel.", "Imobilizar o veículo em local seguro e verificar o nível de líquido de arrefecimento.", "Prosseguir a viagem em velocidade reduzida até o próximo posto de serviço."],
        correctIndex: 2,
        explanation: "Esquentou no painel? Pare o carro em local seguro e verifique o nível da água.",
        detailedExplanation: "O sistema de arrefecimento controla a temperatura do motor através da circulação de água/aditivo. Se o painel alertar superaquecimento, o correto é encostar o carro e verificar o reservatório de água.",
        legalBase: "Manual do Condutor / Mecânica Básica",
        commonMistake: "Checar o óleo do motor quando o alerta é de temperatura/arrefecimento.",
        tip: "Alerta de arrefecimento no painel = Pare e olhe o nível da água!",
        incidence: "media",
        trap: false,
        difficulty: 2
    },
    {
        id: "detran_q26_n2",
        category: "legislacao",
        statement: "No cumprimento da sinalização semafórica para pedestres prevista no Manual Brasileiro do CONTRAN, o procedimento regulamentar a ser adotado diante do sinal identificado na cartela pelo código SS-08 é:",
        options: ["Pode seguir, atravessando a via livremente.", "Não pode ultrapassar a linha de retenção enquanto o sinal estiver assim.", "Atenção, travessia facultativa com cautela redobrada.", "Pare o veículo, imobilizando o trânsito na interseção."],
        correctIndex: 1,
        explanation: "Sinal SS-08 é o semáforo vermelho do pedestre; ele proíbe o pedestre de iniciar a travessia.",
        detailedExplanation: "A sinalização semafórica SS-08 representa o sinal vermelho para pedestres. Quando acesa, significa que o pedestre não pode ultrapassar a guia/linha de retenção para atravessar a pista.",
        legalBase: "Resolução CONTRAN nº 973/2022 (Sinalização Semafórica)",
        commonMistake: "Confundir com código de sinalização de trânsito de veículos.",
        tip: "Semáforo SS-08 vermelho para pedestre = Não pode atravessar!",
        incidence: "alta",
        trap: true,
        difficulty: 2
    },
    {
        id: "detran_q27_n2",
        category: "legislacao",
        statement: "Analisando as normas gerais de circulação e conduta previstas no CTB, e considerando os deveres do condutor e dos ocupantes quanto à segurança da via e à fluidez do trânsito, assinale a alternativa juridicamente correta:",
        options: ["Os animais isolados ou em grupos não poderão circular nas vias urbanas ou rurais.", "A parada para embarque de passageiros não poderá ser efetuada onde o estacionamento é proibido na via.", "O condutor e o passageiro não deverão abrir a porta do veículo sem antes certificar-se de que não constituem perigo para eles e demais usuários.", "Em nenhuma hipótese será permitida a circulação de bicicletas nos passeios."],
        correctIndex: 2,
        explanation: "Verifique os retrovisores antes de abrir as portas para não atingir ninguém na via.",
        detailedExplanation: "É regra de segurança obrigatória que motoristas e passageiros só abram as portas do veículo após olhar o movimento ao redor (bordo da pista) e garantir que não causarão riscos a pedestres ou ciclistas (Art. 49 do CTB).",
        legalBase: "Art. 49 do CTB",
        commonMistake: "Achar que é proibido parar para desembarque em locais onde apenas o estacionamento é proibido.",
        tip: "Abrir a porta do carro = Olhar primeiro se não há perigo na via!",
        incidence: "alta",
        trap: false,
        difficulty: 2
    },
    {
        id: "detran_q28_n1",
        category: "infracoes",
        statement: "Em trecho urbano com grande concentração e movimentação de pedestres, o condutor mantém velocidade incompatível com a segurança do trânsito, sem reduzir na aproximação da travessia. Pelo CTB, essa conduta é infração de natureza:",
        options: ["Infração Gravíssima, com multa multiplicada por 3.", "Infração Leve, com advertência por escrito.", "Infração Grave, com multa e pontuação na CNH.", "Não configura infração, apenas recomendação de direção defensiva."],
        correctIndex: 2,
        explanation: "Não desacelerar o carro onde há muitos pedestres é infração grave.",
        detailedExplanation: "Deixar de reduzir a velocidade em locais com grande movimentação de pedestres coloca vidas em risco e é infração de trânsito grave (Art. 220, I do CTB).",
        legalBase: "Art. 220, I do CTB",
        commonMistake: "Confundir com infração gravíssima por achar que envolve pedestres.",
        tip: "Não reduzir a velocidade perto de pedestres = Infração Grave!",
        incidence: "alta",
        trap: true,
        difficulty: 1
    },
    {
        id: "detran_q29_n1",
        category: "direcao-defensiva",
        statement: "Durante queimadas às margens da via, a fumaça densa reduz drasticamente a visibilidade sobre a pista de rolamento em rodovia. Diante dessa condição adversa, a conduta defensiva correta do condutor deve ser:",
        options: ["Reduzir a velocidade e manter acesa a luz baixa do farol.", "Imobilizar o veículo em local seguro e aguardar o fim da queimada.", "Imobilizar o veículo no bordo da pista e acionar o pisca-alerta.", "Manter a velocidade e utilizar a luz alta do farol no trecho."],
        correctIndex: 0,
        explanation: "Na fumaça, diminua a marcha e acenda a luz baixa do farol.",
        detailedExplanation: "Com pouca visibilidade provocada por fumaça de queimadas, reduza a velocidade e use a luz baixa (farol baixo), pois a luz alta causa ofuscamento ao refletir na fumaça.",
        legalBase: "Art. 40, § 1º do CTB e Manual de Direção Defensiva",
        commonMistake: "Usar farol alto achando que ilumina melhor a fumaça.",
        tip: "Fumaça na pista = Farol baixo e velocidade reduzida!",
        incidence: "alta",
        trap: false,
        difficulty: 1
    },
    {
        id: "detran_q30_n1",
        category: "legislacao",
        statement: "O dever de não obstruir a marcha normal dos veículos, sem causa justificada, integra o conjunto de normas gerais de circulação e conduta impostas pelo CTB. Esse preceito do condutor enquadra-se no conceito jurídico de:",
        options: ["Normas gerais de circulação e conduta.", "Procedimentos adotados exclusivamente nas estradas rurais.", "Regras de procedimento adotadas pelo condutor por opção própria.", "Princípios exclusivos da direção defensiva."],
        correctIndex: 0,
        explanation: "Não atrapalhar o fluxo do trânsito sem motivo é uma regra das normas de circulação.",
        detailedExplanation: "O Código de Trânsito Brasileiro estabelece nas Normas Gerais de Circulação e Conduta que o condutor não deve andar devagar demais sem justificativa ou obstruir o trânsito (Art. 43 e 219 do CTB).",
        legalBase: "Art. 43 e Art. 219 do CTB",
        commonMistake: "Achar que se trata apenas de uma dica de Direção Defensiva e não de regra de lei.",
        tip: "Não segurar o trânsito sem motivo = Regra das Normas de Circulação!",
        incidence: "media",
        trap: false,
        difficulty: 1
    },
    {
        id: "detran_q28_n2",
        category: "infracoes",
        statement: "Ao circular por trechos urbanos ou rurais com grande concentração e movimentação de pedestres, não reduzir a velocidade do veículo de forma compatível com a segurança do trânsito é considerada uma infração de natureza:",
        options: ["Infração de natureza gravíssima, com multa multiplicada por 3.", "Infração de natureza leve, com advertência por escrito.", "Infração de natureza grave, com multa e pontuação na CNH.", "Não constitui infração, mas mera recomendação de segurança."],
        correctIndex: 2,
        explanation: "Diminua a velocidade na presença de pedestres; não fazer isso gera infração grave.",
        detailedExplanation: "O Art. 220, I do CTB estabelece que não adequar a velocidade em locais de trânsito ou aglomeração de pedestres constitui infração grave, punida com multa.",
        legalBase: "Art. 220, I do CTB",
        commonMistake: "Marcar gravíssima por associar o risco ao pedestre diretamente à pena máxima.",
        tip: "Locais de pedestres exige velocidade reduzida = Infração Grave!",
        incidence: "alta",
        trap: true,
        difficulty: 2
    },
    {
        id: "detran_q29_n2",
        category: "direcao-defensiva",
        statement: "A fumaça produzida por queimadas nos terrenos lindeiros à via provoca drástica redução da visibilidade em rodovia de pista simples. Diante dessa situação de risco, o procedimento correto do condutor é:",
        options: ["Reduzir a velocidade e manter acesa a luz baixa do farol.", "Imobilizar o veículo em local seguro e aguardar o término da queimada.", "Imobilizar o veículo no acostamento e acionar o pisca-alerta.", "Manter a velocidade nominal e acionar a luz alta do farol."],
        correctIndex: 0,
        explanation: "Diminua o ritmo e acione o farol baixo para não ofuscar a visão na fumaça.",
        detailedExplanation: "Em condições adversas de visibilidade (fumaça/neblina), o motorista deve desacelerar e manter a luz baixa ligada. Parar na pista ou acostamento aumenta o risco de engavetamento.",
        legalBase: "Art. 40, § 1º do CTB e Manual de Direção Defensiva",
        commonMistake: "Ligar o farol alto, que reflete nas partículas de fumaça e cega o motorista.",
        tip: "Fumaça ou neblina = Luz baixa + desacelerar sem parar na pista!",
        incidence: "alta",
        trap: false,
        difficulty: 2
    },
    {
        id: "detran_q30_n2",
        category: "legislacao",
        statement: "O preceito que estabelece que o condutor não deve obstruir a marcha normal dos demais veículos, abstendo-se de trafegar em velocidade anormalmente reduzida sem causa justificada, enquadra-se no conceito de:",
        options: ["Normas gerais de circulação e conduta.", "Procedimentos adotados somente nas estradas rurais.", "Regras de procedimento adotadas livremente pelo condutor.", "Princípios exclusivos da direção defensiva."],
        correctIndex: 0,
        explanation: "Faz parte das Normas Gerais de Circulação e Conduta impostas pelo CTB.",
        detailedExplanation: "As regras sobre fluxo livre, limites mínimos de velocidade (metade da máxima) e proibição de obstruir a marcha de outros veículos constituem a base das Normas Gerais de Circulação e Conduta (Art. 43 e 219 do CTB).",
        legalBase: "Art. 43 e Art. 219 do CTB",
        commonMistake: "Confundir obrigações legais de circulação com meros conselhos de direção defensiva.",
        tip: "Velocidade mínima e fluxo livre = Normas Gerais de Circulação!",
        incidence: "media",
        trap: false,
        difficulty: 2
    },
    {
        id: "q_sinalizacao_sinistro_03",
        category: "primeiros-socorros",
        statement: "Em caso de sinistro na pista sem disponibilidade imediata do triângulo de segurança, o condutor pode sinalizar o local temporariamente utilizando:",
        options: ["Sinalização com lanternas de celular voltadas para os carros que se aproximam.", "Pessoas acenando com roupas escuras no meio da pista de rolamento.", "Galhos de árvores e arbustos colocados ao longo da via antes do local do sinistro a uma distância segura.", "Pedras de grande porte espalhadas sobre as faixas de rolamento."],
        correctIndex: 2,
        explanation: "Em emergências, o uso de galhos/folhagens visíveis antes da curva/local do sinistro ajuda a alertar os demais motoristas.",
        detailedExplanation: "Quando o triângulo não está disponível (ou não é suficiente), o condutor deve improvisar uma sinalização com materiais visíveis (galhos, folhagens, panos) posicionados a uma distância segura, para que os demais motoristas reduzam a velocidade e desviem. Sinalizar o local reduz o risco de novas colisões enquanto o atendimento não chega.",
        legalBase: "Manual de Primeiros Socorros de Trânsito",
        commonMistake: "Achar que qualquer improviso é proibido ou que a distância de 30 metros do triângulo se aplica rigidamente a qualquer tipo de sinalização emergencial.",
        tip: "Sem triângulo = improvise sinalização visível (galhos/panos) a distância segura!",
        incidence: "media",
        trap: true,
        difficulty: 2
    },
    {
        id: "detran_compacto_03",
        category: "infracoes",
        statement: "Durante abordagem em fiscalização, o condutor é solicitado a apresentar o CRLV-e (licenciamento) e declara não portar documento algum, digital ou impresso. Pelo CTB, a conduta gera qual medida administrativa e penalidade?",
        options: ["Apenas advertência por escrito, sem retenção do veículo.", "Multa por infração leve e retenção do veículo até a apresentação do documento.", "Multa por infração gravíssima e remoção imediata do veículo.", "Multa por infração grave com apreensão obrigatória da CNH."],
        correctIndex: 1,
        explanation: "Não portar o CRLV é infração leve com retenção do veículo até regularização.",
        detailedExplanation: "O porte do CRLV (agora aceito digitalmente) é obrigatório. Deixar de portá-lo no momento da condução gera infração leve, multa e retenção do veículo até a apresentação do documento válido.",
        legalBase: "Art. 232 do CTB",
        commonMistake: "Confundir 'não portar' (leve com retenção) com 'veículo não licenciado' (gravíssima com remoção).",
        tip: "Não portar documento = Infração leve com retenção.",
        incidence: "media",
        trap: true,
        difficulty: 3
    },
    {
        id: "detran_alta_01",
        category: "legislacao",
        statement: "Durante fiscalização de rotina em uma rodovia de pista simples fora do perímetro urbano, um condutor é flagrado transitando com o veículo com o farol apagado durante o dia. Considerando as normas de trânsito vigentes, qual é a classificação da infração e a medida administrativa cabível?",
        options: ["Infração média, sujeita a multa e retenção do veículo para regularização.", "Infração grave, sujeita a multa e remoção do veículo ao pátio.", "Infração gravíssima, gerando suspensão imediata do direito de dirigir.", "Infração leve, punida apenas com advertência por escrito na primeira ocorrência."],
        correctIndex: 0,
        explanation: "Transitar em rodovia de pista simples durante o dia sem farol baixo ou DRL é infração média com retenção do veículo.",
        detailedExplanation: "A exigência do farol baixo ou DRL durante o dia em rodovias de pista simples visa aumentar a visibilidade veicular, sendo sua omissão punida como infração média.",
        legalBase: "Art. 40 e Art. 250, I, 'b' do CTB",
        commonMistake: "Confundir com infração grave ou achar que o farolete substitui o farol baixo.",
        tip: "Rodovia simples de dia = Farol baixo obrigatório (Infração média).",
        incidence: "alta",
        trap: true,
        difficulty: 3
    },
    {
        id: "detran_alta_10",
        category: "legislacao",
        statement: "Conduzir veículo automotor não registrado e devidamente licenciado nas vias públicas terrestres configura qual tipo de infração de trânsito e qual a respectiva medida administrativa aplicada pela autoridade?",
        options: ["Infração grave com retenção do veículo até a apresentação dos papéis.", "Infração gravíssima, punida com multa, apreensão e remoção do veículo ao pátio.", "Infração média, passível apenas de penalidade pecuniária sem remoção.", "Não constitui infração caso o proprietário comprove que o veículo está quitado."],
        correctIndex: 1,
        explanation: "Conduzir veículo não registrado e licenciado é infração gravíssima com remoção do veículo (Art. 230, V do CTB).",
        detailedExplanation: "O licenciamento e o registro anual são obrigatórios. Circular sem regularizar essa situação coloca em risco a segurança jurídica e viária, resultando em infração gravíssima e remoção.",
        legalBase: "Art. 230, V do CTB",
        commonMistake: "Confundir com a infração de 'não portar' o documento de licenciamento (que é infração leve).",
        tip: "Veículo sem registro/licenciamento = Gravíssima + Remoção.",
        incidence: "alta",
        trap: true,
        difficulty: 2
    },
    {
        id: "detran_alta_13",
        category: "placas",
        statement: "Em rodovia, o condutor visualiza placa da sinalização de serviços auxiliares com fundo azul e símbolo de cruz vermelha, instalada com antecedência a um trecho urbano. Essa placa indica a proximidade de:",
        options: ["Área de preservação ambiental de acesso restrito.", "Pronto-socorro ou unidade hospitalar de atendimento de urgência.", "Oficina mecânica credenciada especializada em sistemas de frenagem.", "Posto de fiscalização rodoviária com balança para pesagem de veículos."],
        correctIndex: 1,
        explanation: "A placa de fundo azul com cruz vermelha sinaliza a presença de Pronto Socorro nas proximidades.",
        detailedExplanation: "As placas de serviços auxiliares utilizam fundo azul para orientar o motorista sobre facilidades úteis na via, sendo a cruz vermelha o símbolo internacional de atendimento médico de urgência.",
        legalBase: "Manual Brasileiro de Sinalização de Trânsito",
        commonMistake: "Confundir com placas de advertência de perigo ou cruzamentos ferroviários.",
        tip: "Cruz vermelha em fundo azul = Pronto Socorro.",
        incidence: "media",
        trap: false,
        difficulty: 1
    },
    {
        id: "detran_alta_14",
        category: "legislacao",
        statement: "Durante o planejamento de uma viagem longa por rodovia interestadual, o condutor passa por engano pelo ponto exato da saída que pretendia acessar. Qual deve ser a conduta segura e legal a ser adotada?",
        options: ["Engatar marcha a ré imediatamente no acostamento e retornar de costas com pisca-alerta ligado.", "Seguir em frente com segurança e efetuar a manobra de retorno no próximo viaduto ou retorno oficial.", "Realizar conversão em U cruzando o canteiro central de grama para voltar à pista oposta.", "Parar o veículo na faixa de rolamento da direita e aguardar o fluxo diminuir."],
        correctIndex: 1,
        explanation: "Ao perder uma saída em rodovia, deve-se prosseguir até o próximo retorno oficial com segurança.",
        detailedExplanation: "Executar marcha a ré, conversões proibidas pelo canteiro central ou parar na pista em rodovias são manobras de altíssimo risco e infrações gravíssimas previstas no CTB.",
        legalBase: "Art. 194 do CTB",
        commonMistake: "Tentar retornar de marcha a ré pelo acostamento.",
        tip: "Perdeu a saída? Nunca dê ré; siga até o próximo retorno oficial.",
        incidence: "alta",
        trap: true,
        difficulty: 2
    },
    {
        id: "detran_alta_17",
        category: "legislacao",
        statement: "Os órgãos de trânsito e as normas técnicas brasileiras passaram a substituir gradualmente o termo acidente por sinistro de trânsito em estatísticas e legislações. A razão fundamental dessa mudança conceitual é:",
        options: ["Para evidenciar que a grande maioria dos eventos na via é previsível e evitável por falha humana.", "Para isentar os fabricantes de veículos de responsabilidade civil em colisões frontais.", "Porque a palavra acidente juridicamente anula o pagamento do seguro obrigatório DPVAT.", "Para diferenciar colisões urbanas de ocorrências registradas em rodovias federais."],
        correctIndex: 0,
        explanation: "O termo 'sinistro' substitui 'acidente' para destacar que os eventos no trânsito decorrem de ações humanas evitáveis.",
        detailedExplanation: "Enquanto 'acidente' remete a algo casual ou obra do acaso, 'sinistro' reforça o caráter previsível e evitável associado à imprudência, negligência ou imperícia.",
        legalBase: "Normas técnicas brasileiras (ABNT / CONTRAN)",
        commonMistake: "Achar que a mudança ocorreu apenas por exigência de seguradoras privadas.",
        tip: "Sinistro = Evento evitável decorrente de falha humana, e não mero acaso.",
        incidence: "media",
        trap: false,
        difficulty: 2
    },
    {
        id: "detran_alta_30",
        category: "legislacao",
        statement: "O proprietário permite que pessoa não habilitada, ou com CNH cassada ou suspensa, tome a posse e conduza veículo automotor na via pública. Pelo CTB, a infração aplicável e a responsabilidade administrativa recaem:",
        options: ["Apenas sobre o condutor flagrado ao volante, ficando o proprietário isento.", "Sobre o proprietário do veículo, que comete infração gravíssima com multa multiplicada.", "Sobre ambos, aplicando-se apenas advertência verbal na primeira ocorrência do ano.", "Sobre crime de trânsito imputado exclusivamente ao fabricante do automóvel."],
        correctIndex: 1,
        explanation: "Permitir posse a não habilitado ou cassado gera infração gravíssima com multa multiplicada para o proprietário (Art. 164 do CTB).",
        detailedExplanation: "O proprietário responde pelo empréstimo do veículo a pessoa sem habilitação regular, incidindo infração gravíssima com multa multiplicada pelo fator do artigo, além da possibilidade de crime do Art. 310 do CTB.",
        legalBase: "Art. 164 c/c Art. 310 do CTB",
        commonMistake: "Achar que a responsabilidade recai unicamente sobre quem estava dirigindo sem CNH.",
        tip: "Entregar o carro para não habilitado = Multa gravíssima multiplicada para o dono.",
        incidence: "alta",
        trap: true,
        difficulty: 3
    },
    {
        id: "q_new_01",
        category: "legislacao",
        statement: "Para obter a Permissão para Dirigir (PPD) nas categorias A ou B, o candidato deve atender, entre outros, a qual dos seguintes requisitos legais?",
        options: ["Ter concluído obrigatoriamente o Ensino Médio completo.", "Ter completado 16 anos e possuir autorização com firma reconhecida dos pais.", "Ser alfabetizado e possuir Carteira de Identidade (RG) e CPF.", "Ser penalmente imputável, ser alfabetizado e possuir documento de identidade e CPF."],
        correctIndex: 3,
        explanation: "Exige-se ter 18 anos (penalmente imputável), saber ler/escrever (alfabetizado) e possuir RG e CPF.",
        detailedExplanation: "O CTB estabelece 18 anos para A/B, 21 para C, D e E.",
        legalBase: "Art. 140 do CTB",
        commonMistake: "Confundir com idade mínima para categorias maiores.",
        tip: "18 = A/B, 21 = C/D/E.",
        memoryHook: "Dezoito para dirigir leve!",
        incidence: "alta",
        trap: true,
        difficulty: 1
    },
    {
        id: "q_new_02",
        category: "direcao-defensiva",
        statement: "Em curva à esquerda com pista molhada e baixa aderência, qual postura o condutor deve adotar para manter a estabilidade e evitar derrapagem?",
        options: ["Acelerar durante a curva para sair rapidamente do trecho de baixa aderência.", "Manter velocidade constante e frear no ápice da curva para corrigir a trajetória.", "Aplicar apenas o freio traseiro durante toda a manobra em pista molhada.", "Reduzir a velocidade antes da curva e manter o volante firme sem freadas bruscas."],
        correctIndex: 3,
        explanation: "Correta: reduzir antes da curva e conduzir com suavidade evita perda de aderência em piso molhado.",
        detailedExplanation: "Curvas molhadas exigem redução de velocidade antecipada para não derrapar.",
        legalBase: "Art. 218 do CTB",
        commonMistake: "Tentar corrigir a trajetória acelerando dentro da curva.",
        tip: "Freio antes, curva depois!",
        memoryHook: "Mole = Slow!",
        incidence: "alta",
        trap: true,
        difficulty: 2
    },
    {
        id: "q_new_03",
        category: "placas",
        statement: "Placa losangular de fundo amarelo com símbolo preto antecede trecho sinuoso. A qual tipo de sinalização vertical ela pertence?",
        options: ["Regulamentação, que impõe obrigações ou proibições aos condutores na via.", "Indicação, que identifica destinos, serviços auxiliares e distâncias na via.", "Advertência, que alerta para condição de perigo adiante exigindo atenção.", "Regulamentação de preferência, que determina prioridade na interseção sinalizada."],
        correctIndex: 2,
        explanation: "Correta: losango amarelo com símbolo preto é placa de advertência, conforme Anexo II do CTB.",
        detailedExplanation: "Placas de advertência têm formato losangular, fundo amarelo e símbolo preto.",
        legalBase: "Art. 29 do CTB",
        commonMistake: "Confundir com placa circular de regulamentação.",
        tip: "Losango amarelo = Cuidado!",
        memoryHook: "Amarelo = Atenção!",
        incidence: "alta",
        trap: false,
        difficulty: 1
    },
    {
        id: "q_new_04",
        category: "legislacao",
        statement: "Dirigir veículo automotor sem possuir Carteira Nacional de Habilitação (CNH) ou Permissão para Dirigir (PPD) gera as seguintes penalidades:",
        options: ["Infração média com multa e retenção do condutor na delegacia.", "Infração grave com multa e apreensão da Carteira de Identidade.", "Infração gravíssima com penalidade de multa multiplicada por três e retenção do veículo até a apresentação de condutor habilitado.", "Infração gravíssima com recolhimento imediato do veículo e suspensão de 12 meses."],
        correctIndex: 2,
        explanation: "Dirigir sem habilitação gera infração gravíssima, com fator multiplicador 3x no valor da multa e retenção do veículo.",
        detailedExplanation: "Dirigir sem habilitação é infração gravíssima conforme CTB.",
        legalBase: "Art. 162, I do CTB",
        commonMistake: "Pensar que é apenas multa leve.",
        tip: "Sem CNH = grave!",
        memoryHook: "Sem documento, sem volante!",
        incidence: "media",
        trap: true,
        difficulty: 3
    },
    {
        id: "q_new_05",
        category: "direcao-defensiva",
        statement: "Em pista molhada com visibilidade reduzida, o condutor decide ultrapassar caminhão. Qual cuidado essencial deve adotar durante a manobra?",
        options: ["Aproximar-se bastante do veículo ultrapassado para reduzir o tempo de exposição.", "Utilizar a buzina de forma contínua durante toda a transposição de faixa.", "Ignorar a condição da pista, pois a manobra não altera a aderência dos pneus.", "Ampliar a distância de segurança e evitar jatos de água sobre o para-brisa."],
        correctIndex: 3,
        explanation: "Correta: na chuva, ampliar a distância e evitar cortina de água garante ultrapassagem segura.",
        detailedExplanation: "Ultrapassar em pista molhada exige mais espaço e cuidado com jatos de água.",
        legalBase: "Art. 218 do CTB",
        commonMistake: "Ultrapassar rapidamente sem considerar a aderência.",
        tip: "Molhado = Mais espaço!",
        memoryHook: "Água no chão, distância no ar!",
        incidence: "media",
        trap: true,
        difficulty: 2
    },
    {
        id: "q_new_06",
        category: "placas",
        statement: "Placa retangular de fundo azul com símbolo branco indica posto de combustível adiante. A qual tipo de sinalização vertical ela pertence?",
        options: ["Regulamentação, que impõe proibição ou obrigação de conduta aos motoristas.", "Advertência, que alerta para condição potencialmente perigosa adiante na via.", "Indicação, que identifica serviço auxiliar e orienta o condutor na rodovia.", "Regulamentação de velocidade, que determina a máxima admitida no trecho."],
        correctIndex: 2,
        explanation: "Correta: placa azul retangular indica serviço auxiliar, conforme Anexo II do CTB.",
        detailedExplanation: "Placas de indicação são retangulares, de fundo azul, com símbolo branco, informando serviços.",
        legalBase: "Art. 29 do CTB",
        commonMistake: "Confundir com placa de regulamentação circular.",
        tip: "Azul = Informação!",
        memoryHook: "Azul = Serviço!",
        incidence: "media",
        trap: false,
        difficulty: 2
    },
    {
        id: "q_new_07",
        category: "legislacao",
        statement: "De acordo com o CTB, o cometimento de uma infração de natureza GRAVE no trânsito gera a adição de quantos pontos no prontuário do condutor?",
        options: ["3 pontos.", "4 pontos.", "5 pontos.", "7 pontos."],
        correctIndex: 2,
        explanation: "Gravíssima = 7 pontos; Grave = 5 pontos; Média = 4 pontos; Leve = 3 pontos.",
        detailedExplanation: "Infrações graves acumulam pontos e podem resultar em suspensão da CNH.",
        legalBase: "Art. 259 do CTB",
        commonMistake: "Achar que grave e gravíssima têm a mesma penalidade.",
        tip: "Grave = 5 pontos!",
        memoryHook: "Grave = Cinco!",
        incidence: "alta",
        trap: true,
        difficulty: 2
    },
    {
        id: "q_new_08",
        category: "direcao-defensiva",
        statement: "Ao pretender realizar uma conversão à esquerda em uma via urbana de duplo sentido de circulação sem canteiro central, o condutor deve posicionar o veículo:",
        options: ["Junto ao bordo esquerdo da pista de rolamento antes de efetuar a manobra.", "Junto ao eixo central ou à linha divisória da pista, sem invadir a faixa da contramão, antes de virar.", "No acostamento da direita e aguardar o fluxo antes de cruzar toda a via.", "Totalmente dentro da faixa da esquerda destinada ao sentido contrário."],
        correctIndex: 1,
        explanation: "Nas vias de duplo sentido sem canteiro, para virar à esquerda aproxima-se o veículo da linha central (eixo da pista).",
        detailedExplanation: "A regra dos 2 segundos permite tempo de reação em condições normais.",
        legalBase: "Art. 38, I do CTB",
        commonMistake: "Usar apenas 1 segundo, que é insuficiente.",
        tip: "2 segundos = tempo de reação!",
        memoryHook: "Dois, não um!",
        incidence: "alta",
        trap: false,
        difficulty: 1
    },
    {
        id: "q_new_09",
        category: "placas",
        statement: "Placa circular com orla vermelha e faixa horizontal branca no centro aparece no trecho. O que essa sinalização de regulamentação determina?",
        options: ["Parada obrigatória com imobilização total antes da linha de retenção.", "Vedação apenas de estacionar, admitindo parada breve para embarque.", "Velocidade máxima permitida para veículos leves no trecho da via.", "Proibição total de parar e estacionar no trecho sinalizado da via."],
        correctIndex: 3,
        explanation: "Correta: placa R-6a proíbe parar e estacionar, conforme Manual de Sinalização.",
        detailedExplanation: "Placa circular vermelha com faixa branca horizontal proíbe parar e estacionar.",
        legalBase: "Art. 29 do CTB",
        commonMistake: "Confundir com placa de velocidade máxima.",
        tip: "Faixa branca = Não pare!",
        memoryHook: "Vermelho + faixa = Não fique!",
        incidence: "media",
        trap: true,
        difficulty: 2
    },
    {
        id: "q_new_10",
        category: "legislacao",
        statement: "Em blitz de fiscalização, o agente exige os documentos de porte obrigatório. Quais documentos permitem a circulação regular do veículo?",
        options: ["Somente a CNH, pois o licenciamento é consultado eletronicamente pelo agente.", "Somente o comprovante de seguro obrigatório vigente do veículo abordado.", "CNH ou permissão e CRLV eletrônico, com licenciamento e tributos em dia.", "Nenhum documento, desde que o veículo esteja em perfeitas condições de uso."],
        correctIndex: 2,
        explanation: "Correta: exige-se habilitação e CRLV com licenciamento regular, conforme arts. 133 e 140 do CTB.",
        detailedExplanation: "É obrigatório portar CNH, Certificado de Registro e Licenciamento e cumprir obrigações tributárias.",
        legalBase: "Art. 120 do CTB",
        commonMistake: "Esquecer do CRLV e da regularidade do veículo.",
        tip: "CNH + CRLV = ok!",
        memoryHook: "Carteira e documento do carro!",
        incidence: "alta",
        trap: false,
        difficulty: 1
    },
    {
        id: "q_new_11",
        category: "direcao-defensiva",
        statement: "Em rodovia escura sem iluminação pública, o condutor nota dificuldade para enxergar à frente. Qual risco aumenta na condução noturna?",
        options: ["Melhora da visibilidade sobre a pista e da percepção dos obstáculos.", "Dificuldade para avaliar distância e velocidade dos demais veículos.", "Eliminação do risco de colisão devido ao menor volume de tráfego.", "Aumento da aderência dos pneus por causa da queda de temperatura."],
        correctIndex: 1,
        explanation: "Correta B: à noite cai a percepção de distância e velocidade. Base: Art. 218 do CTB.",
        detailedExplanation: "A escuridão limita a visão periférica e dificulta avaliar distância e velocidade relativa.",
        legalBase: "Art. 218 do CTB",
        commonMistake: "Achar que menos trânsito significa mais segurança automática.",
        tip: "Noite = Percepção baixa!",
        memoryHook: "Escuro = Cuidado duplo!",
        incidence: "alta",
        trap: true,
        difficulty: 2
    },
    {
        id: "td_01",
        category: "direcao-defensiva",
        statement: "Sob neblina densa na rodovia, a visibilidade fica restrita a poucos metros. Qual conduta completa evita colisão nesse trecho?",
        options: ["Manter farol baixo ligado e ampliar a distância de seguimento à frente.", "Reduzir a velocidade sem freadas bruscas para evitar colisão traseira.", "Não acionar o pisca-alerta em movimento, usando-o somente parado.", "Manter farol baixo, ampliar a distância e reduzir sem freadas bruscas, sem pisca-alerta em movimento."],
        correctIndex: 3,
        explanation: "Correta D: conduta completa na cerração. Base: direção defensiva e Art. 40 do CTB.",
        incidence: "alta",
        difficulty: 2
    },
    {
        id: "td_02",
        category: "legislacao",
        statement: "Dois veículos chegam juntos a um cruzamento sem placa, semáforo ou agente. Qual regra de preferência do CTB deve ser aplicada?",
        options: ["Preferência de quem se aproxima pela direita do condutor na via comum.", "Em cruzamento com rodovia, preferência de quem circula pela rodovia.", "Na rotatória, preferência de quem já circula pelo anel interno.", "Valem as três regras: direita na via comum, rodovia preferencial e anel da rotatória."],
        correctIndex: 0,
        explanation: "No cruzamento comum sem sinalização vale a preferência de quem vem pela direita (Art. 29). Rodovia e rotatória têm regras próprias, que não se aplicam a esse caso.",
        incidence: "alta",
        difficulty: 2
    },
    {
        id: "td_03",
        category: "direcao-defensiva",
        statement: "Antes de mudar de faixa em via arterial com tráfego intenso, o condutor precisa fazer a manobra com segurança. O que é obrigatório?",
        options: ["Sinalizar com a seta antes de iniciar a transposição de faixa.", "Verificar retrovisores e ponto cego antes de sair da faixa atual.", "Dar preferência a quem já circula na faixa que pretende ocupar.", "Sinalizar antes, conferir espelhos e ponto cego e respeitar quem já está na faixa."],
        correctIndex: 3,
        explanation: "Correta D: troca de faixa exige seta, espelhos e preferência. Base: Art. 29 do CTB.",
        incidence: "alta",
        difficulty: 2
    },
    {
        id: "td_04",
        category: "legislacao",
        statement: "Em rodovia de pista dupla, o condutor decide ultrapassar o caminhão que segue à frente. Qual procedimento correto deve adotar?",
        options: ["Executar a ultrapassagem sempre pela esquerda da via de pista dupla.", "Retornar à faixa de origem somente com distância segura do ultrapassado.", "Sinalizar a intenção da manobra com antecedência regulamentar.", "Ultrapassar pela esquerda, sinalizar antes e retornar só com distância segura."],
        correctIndex: 3,
        explanation: "Correta D: ultrapassagem correta reúne as três condutas. Base: Arts. 29 e 30 do CTB.",
        incidence: "alta",
        difficulty: 2
    },
    {
        id: "td_05",
        category: "legislacao",
        statement: "Ao estacionar o carro junto ao bordo da pista em via urbana, o condutor precisa cumprir as exigências do CTB. O que deve fazer?",
        options: ["Guardar 5 metros de distância do bordo da via transversal no cruzamento.", "Não obstruir a pista nem comprometer a visibilidade nos cruzamentos.", "Parar no sentido do fluxo, paralelo ao bordo e junto ao meio-fio.", "Guardar 5 metros da transversal, sem obstruir a pista, no sentido do fluxo junto ao meio-fio."],
        correctIndex: 3,
        explanation: "Correta D: estacionamento correto reúne as três exigências. Base: Arts. 48 e 49 do CTB.",
        incidence: "media",
        difficulty: 2
    },
    {
        id: "td_06",
        category: "infracoes",
        statement: "Em descida longa de serra com o veículo carregado, o condutor pensa em economizar combustível. Qual conduta configura infração?",
        options: ["Descer em ponto morto para economizar combustível no declive.", "Desligar o motor na descida, perdendo freio e direção assistidos.", "Manter câmbio em neutro e frear somente em cima da curva.", "Descer em neutro ou com motor desligado, sem freio motor e freando em cima da hora."],
        correctIndex: 3,
        explanation: "Correta D: descer desengrenado ou desligado é infração. Base: Art. 231 do CTB.",
        incidence: "media",
        difficulty: 2
    },
    {
        id: "td_07",
        category: "legislacao",
        statement: "Em rodovia de pista simples, o condutor sobe um aclive com boa visão do trecho. Quando a ultrapassagem nesse aclive é permitida?",
        options: ["Com linha amarela seccionada na mão de direção do condutor.", "Com visibilidade total à frente e sem veículo em sentido oposto.", "Em trecho com faixa adicional para veículos lentos no aclive.", "Com linha seccionada na sua mão, visão total ou faixa adicional para lentos."],
        correctIndex: 3,
        explanation: "Correta D: no aclive só com permissão, visão ou faixa extra. Base: Art. 32 do CTB.",
        incidence: "media",
        difficulty: 2
    },
    {
        id: "td_08",
        category: "legislacao",
        statement: "Em via urbana sem faixa de pedestres, um pedestre precisa atravessar a pista com veículos se aproximando. Como deve atravessar?",
        options: ["Em sentido perpendicular ao eixo da via, em ângulo de 90 graus.", "Pelo caminho mais curto, sem parar ou demorar sobre a pista.", "Com prioridade dos veículos que se aproximam nesse momento.", "Atravessar em 90 graus, sem parar na pista e com prioridade dos veículos."],
        correctIndex: 3,
        explanation: "Correta D: regra completa do pedestre sem faixa. Base: Arts. 69 e 70 do CTB.",
        legalBase: "Arts. 69 e 70 do CTB",
        incidence: "alta",
        difficulty: 2
    },
    {
        id: "td_09",
        category: "legislacao",
        statement: "O condutor pretende parar perto de um cruzamento sinalizado para embarque rápido. O que o CTB determina sobre parada nesse local?",
        options: ["Proibido parar a menos de 5 metros do bordo da via transversal.", "Proibido parar se comprometer a visibilidade na interseção.", "Proibido parar sobre a área de cruzamento das duas vias.", "Proibido a menos de 5 metros, com prejuízo visual ou sobre o cruzamento."],
        correctIndex: 3,
        explanation: "Correta D: as três proibições valem juntas. Base: Art. 181 do CTB.",
        incidence: "media",
        difficulty: 2
    },
    {
        id: "td_10",
        category: "legislacao",
        statement: "Uma ambulância identificada segue em atendimento de urgência com sirene ligada. Quais veículos têm livre circulação nesse serviço?",
        options: ["Veículos de socorro de incêndio e salvamento em urgência.", "Ambulâncias e viaturas policiais identificadas em urgência.", "Veículos de fiscalização e operação de trânsito em urgência.", "Bombeiros, ambulância, polícia e fiscalização em urgência identificada."],
        correctIndex: 3,
        explanation: "Correta D: todos têm prioridade em urgência. Base: Art. 29, VII do CTB.",
        legalBase: "Art. 29, VII do CTB",
        incidence: "media",
        difficulty: 1
    },
    {
        id: "td_11",
        category: "legislacao",
        statement: "Em avenida de mão dupla sem canteiro central, o condutor quer converter à esquerda no retorno. Qual procedimento deve cumprir?",
        options: ["Aproximar-se da linha divisória do fluxo oposto antes de virar.", "Acionar a seta indicativa com antecedência regulamentar.", "Ceder passagem aos veículos que vêm em sentido contrário.", "Encostar na divisória, sinalizar antes e ceder ao fluxo contrário."],
        correctIndex: 3,
        explanation: "Correta D: conversão à esquerda completa. Base: Art. 34 do CTB.",
        incidence: "media",
        difficulty: 2
    },
    {
        id: "td_12",
        category: "legislacao",
        statement: "Em bairro novo sem placas de velocidade, o condutor trafega por vias urbanas distintas. Quais são os limites padrão do CTB?",
        options: ["80 km/h nas vias de trânsito rápido sem sinalização.", "60 km/h nas vias arteriais sem sinalização de velocidade.", "40 km/h nas vias coletoras sem sinalização de velocidade.", "80 na rápida, 60 na arterial e 40 na coletora, sem placa."],
        correctIndex: 3,
        explanation: "Correta D: limites urbanos sem placa. Base: Arts. 60 e 61 do CTB.",
        legalBase: "Arts. 60 e 61 do CTB",
        incidence: "altissima",
        difficulty: 2
    },
    {
        id: "td_13",
        category: "infracoes",
        statement: "Durante fiscalização, o agente observa manobras arriscadas em cruzamento com semáforo. Quais condutas são infrações gravíssimas?",
        options: ["Transitar com o veículo sobre calçadas, passeios e canteiros.", "Avançar o vermelho do semáforo ou a parada obrigatória.", "Transitar na contramão em via de sentido único de circulação.", "Calçada, avanço de vermelho e contramão, todas gravíssimas."],
        correctIndex: 3,
        explanation: "Correta D: as três são gravíssimas. Base: Arts. 184, 208 e 193 do CTB.",
        incidence: "media",
        difficulty: 1
    },
    {
        id: "td_14",
        category: "direcao-defensiva",
        statement: "Sob chuva forte com pista molhada e neblina no trecho, o condutor segue em velocidade. O que ele deve evitar nessa condição?",
        options: ["Usar farol alto, que reflete na neblina e ofusca a visão.", "Frear bruscamente sobre a pista molhada e escorregadia.", "Ligar o pisca-alerta com o veículo ainda em movimento.", "Evitar farol alto, freada brusca e pisca-alerta em movimento."],
        correctIndex: 3,
        explanation: "Correta D: as três condutas devem ser evitadas. Base: direção defensiva e Art. 40 do CTB.",
        incidence: "media",
        trap: true,
        difficulty: 2
    },
    {
        id: "td_15",
        category: "legislacao",
        statement: "Em área residencial à noite, o condutor quer alertar outro motorista sem infringir a norma. O que o CTB permite sobre a buzina?",
        options: ["Toques breves como advertência para evitar possível acidente.", "Uso fora do perímetro urbano para avisar ultrapassagem.", "Proibição do uso entre 22h e 6h no período noturno.", "Toque breve de advertência, fora da cidade para ultrapassar e nada de 22h às 6h."],
        correctIndex: 3,
        explanation: "Correta D: regra completa da buzina. Base: Art. 227 do CTB.",
        legalBase: "Art. 227 do CTB",
        incidence: "alta",
        difficulty: 2
    },
    {
        id: "td_16",
        category: "direcao-defensiva",
        statement: "No corredor de trânsito rápido, o condutor precisa trocar de faixa para acessar a saída. O que é obrigatório nessa transposição?",
        options: ["Sinalizar a manobra com a seta apropriada antes de sair.", "Conferir se a faixa ao lado está livre e segura.", "Respeitar a preferência de quem já circula na faixa de destino.", "Sinalizar antes, conferir se está livre e respeitar quem já está na faixa."],
        correctIndex: 3,
        explanation: "Correta D: troca segura exige as três condutas. Base: Art. 29 do CTB.",
        incidence: "media",
        difficulty: 2
    },
    {
        id: "td_17",
        category: "direcao-defensiva",
        statement: "Em aclive sem visibilidade com curva fechada à frente, o condutor mantém velocidade alta. Qual conduta defensiva é recomendada?",
        options: ["Manter o veículo no centro da sua faixa de circulação.", "Reduzir para velocidade que permita parar com segurança.", "Não executar ultrapassagem no trecho sem visibilidade.", "Manter o centro da faixa, reduzir e não ultrapassar sem visão."],
        correctIndex: 3,
        explanation: "Correta D: conduta completa no aclive sem visão. Base: direção defensiva e Art. 28 do CTB.",
        incidence: "media",
        difficulty: 2
    },
    {
        id: "td_18",
        category: "primeiros-socorros",
        statement: "Após pane mecânica na rodovia, o veículo fica imobilizado sobre o acostamento à noite. Quais providências são obrigatórias?",
        options: ["Ligar o pisca-alerta imediatamente após a imobilização.", "Colocar o triângulo atrás na distância regulamentar.", "Retirar os ocupantes para local seguro fora da pista.", "Ligar o pisca, sinalizar com triângulo atrás e retirar ocupantes da pista."],
        correctIndex: 3,
        explanation: "Correta D: pane exige as três providências. Base: Arts. 46 e 49 do CTB.",
        incidence: "media",
        difficulty: 2
    },
    {
        id: "td_19",
        category: "infracoes",
        statement: "Em avenida coletora movimentada, o motorista usa o celular e força passagem pelo acostamento. Quais condutas são vedadas?",
        options: ["Ultrapassar pelo acostamento ou pela direita, salvo exceção legal.", "Converter onde a sinalização proíbe a manobra na via.", "Dirigir usando fone ou manuseando o telefone celular.", "Acostamento, conversão proibida e celular ao volante, tudo vedado."],
        correctIndex: 3,
        explanation: "Correta D: as três condutas são proibidas. Base: Arts. 184, 207 e 252 do CTB.",
        incidence: "media",
        difficulty: 2
    },
    {
        id: "td_20",
        category: "placas",
        statement: "Em via recém-pintada, o condutor observa linhas e símbolos brancos e amarelos no asfalto. Quais são as funções dessa sinalização?",
        options: ["Delimitar faixas e orientar o fluxo dos veículos na via.", "Alertar para riscos e proibir ultrapassagem em trechos.", "Indicar locais onde o estacionamento é permitido.", "Organizar o fluxo, alertar riscos e regular o estacionamento na pista."],
        correctIndex: 3,
        explanation: "Correta D: sinalização horizontal tem as três funções. Base: CTB Anexo II.",
        incidence: "media",
        difficulty: 2
    },
    {
        id: "td_21",
        category: "legislacao",
        statement: "Ao sair do acesso e ingressar em via de trânsito rápido com fluxo intenso, o condutor precisa entrar com segurança. Qual regra vale?",
        options: ["Preferência de quem já circula pela via principal rápida.", "Quem ingressa deve ajustar-se à velocidade do fluxo.", "Acessos sem semáforo seguem a mesma regra geral de preferência.", "A vez é de quem está na rápida, com ingresso adaptado à velocidade do fluxo."],
        correctIndex: 3,
        explanation: "Correta D: regra completa de ingresso na rápida. Base: Art. 29 do CTB.",
        incidence: "media",
        difficulty: 2
    },
    {
        id: "td_22",
        category: "direcao-defensiva",
        statement: "Em trecho de pista esburacada, com declive forte e sem acostamento, o condutor mantém velocidade. Qual condição exige atenção total?",
        options: ["Pista esburacada, ondulada ou escorregadia após chuva forte.", "Declive forte com curva fechada e sem acostamento no bordo.", "Trecho sem acostamento e com mato alto no bordo da pista.", "Pista ruim, declive com curva sem acostamento e bordo sem visibilidade."],
        correctIndex: 3,
        explanation: "Correta D: todas exigem velocidade reduzida. Base: direção defensiva e Art. 28 do CTB.",
        incidence: "media",
        difficulty: 2
    },
    {
        id: "td_23",
        category: "legislacao",
        statement: "Em cruzamento urbano, o condutor pretende converter à direita com pedestres na calçada. Qual procedimento deve adotar na conversão?",
        options: ["Aproximar-se do bordo direito da pista antes de converter.", "Acionar a seta indicativa com antecedência regulamentar.", "Reduzir a velocidade e redobrar atenção aos pedestres.", "Encostar no bordo direito, sinalizar antes e reduzir com atenção aos pedestres."],
        correctIndex: 3,
        explanation: "Correta D: conversão à direita completa. Base: Art. 34 do CTB.",
        incidence: "media",
        difficulty: 2
    },
    {
        id: "td_24",
        category: "legislacao",
        statement: "Em túnel iluminado durante o dia e em rodovia simples fora da cidade, o condutor tem dúvida sobre faróis. Quando o farol baixo é exigido?",
        options: ["À noite, em qualquer via, mesmo com iluminação pública.", "De dia, em rodovia de pista simples fora do perímetro urbano.", "Em túneis com iluminação, tanto de dia como de noite.", "À noite sempre, de dia em rodovia simples e em túneis iluminados."],
        correctIndex: 3,
        explanation: "Correta D: farol baixo nas três situações. Base: Art. 40 do CTB.",
        legalBase: "Art. 40 do CTB",
        incidence: "alta",
        difficulty: 1
    },
    {
        id: "td_25",
        category: "legislacao",
        statement: "Em rua movimentada, o passageiro pede para descer fora do ponto com carros atrás. O que o CTB exige sobre embarque e desembarque?",
        options: ["Embarque pelo lado da calçada, exceto para o condutor.", "Parada com o veículo junto ao bordo da via.", "Manobra sem obstruir a marcha dos demais veículos.", "Lado da calçada, carro junto ao bordo e sem obstruir a marcha."],
        correctIndex: 3,
        explanation: "Correta D: regra completa de embarque. Base: Art. 49 do CTB.",
        legalBase: "Art. 49 do CTB",
        incidence: "media",
        difficulty: 2
    },
    {
        id: "td_26",
        category: "legislacao",
        statement: "Ao se aproximar de cruzamento com placa R-1 de parada obrigatória, o condutor segue sem reduzir. O que deve fazer diante da placa?",
        options: ["Parar totalmente o veículo antes de entrar na interseção.", "Ceder passagem aos veículos da via preferencial.", "Ceder passagem aos pedestres que estejam em travessia.", "Parar totalmente e ceder a vez à preferencial e aos pedestres."],
        correctIndex: 3,
        explanation: "Correta D: R-1 exige parada e preferência. Base: CTB Anexo II e Art. 29.",
        incidence: "alta",
        difficulty: 2
    },
    {
        id: "td_27",
        category: "legislacao",
        statement: "Em rua sem ciclovia nem ciclofaixa, um ciclista divide a pista com carros e ônibus. Como as bicicletas devem circular nesse caso?",
        options: ["Pelos bordos da pista, no mesmo sentido dos veículos.", "Com preferência sobre os automotores nas interseções.", "Com distância lateral mínima de 1,5 m ao serem ultrapassadas.", "No bordo no sentido da via, com preferência e 1,5 m ao ultrapassar."],
        correctIndex: 3,
        explanation: "Correta D: regra completa das bicicletas. Base: Art. 58 do CTB.",
        legalBase: "Art. 58 do CTB",
        incidence: "media",
        difficulty: 2
    },
    {
        id: "td_28",
        category: "mecanica",
        statement: "Antes de viajar pela rodovia, o motorista vai verificar o carro na garagem. O que o condutor deve conferir antes de circular?",
        options: ["Equipamentos obrigatórios em perfeito funcionamento.", "Combustível suficiente para completar o trajeto planejado.", "Freios, iluminação e pneus em condições adequadas de uso.", "Equipamentos, combustível e freios, luzes e pneus em ordem."],
        correctIndex: 3,
        explanation: "Correta D: verificação completa antes de sair. Base: Arts. 27 e 104 do CTB.",
        incidence: "media",
        difficulty: 1
    },
    {
        id: "td_29",
        category: "legislacao",
        statement: "Em cruzamento sem placa, sem semáforo e sem agente, dois carros e um pedestre chegam juntos. Qual regra de preferência se aplica?",
        options: ["Preferência do veículo que se aproxima pela direita do condutor.", "Todos devem reduzir a velocidade antes de ingressar no cruzamento.", "Pedestre em travessia tem prioridade sobre quem vai converter.", "Direita primeiro, redução ao ingressar e pedestre na travessia com prioridade."],
        correctIndex: 3,
        explanation: "Correta D: regra completa sem sinalização. Base: Arts. 29 e 70 do CTB.",
        incidence: "alta",
        difficulty: 2
    },
    {
        id: "td_30",
        category: "infracoes",
        statement: "Em rodovia com máxima de 100 km/h, o radar registra 120 km/h no veículo. Como fica classificada essa infração por excesso de velocidade?",
        options: ["Infração de natureza média, sujeita a multa administrativa.", "Registro de 4 pontos no prontuário do condutor infrator.", "Multa aplicada ao condutor ou ao proprietário responsável.", "Até 20% acima: natureza média, 4 pontos e multa ao responsável."],
        correctIndex: 3,
        explanation: "Correta D: até 20% é média com 4 pontos. Base: Art. 218 do CTB.",
        legalBase: "Art. 218 do CTB",
        incidence: "alta",
        difficulty: 2
    },
    {
        id: "rst_01",
        category: "legislacao",
        statement: "Em blitz urbana, o agente verifica o cinto de todos no carro, inclusive atrás. O uso do cinto admite alguma exceção legal no CTB?",
        options: ["Sim, dispensa em trajetos curtos dentro do perímetro urbano.", "Sim, dispensa passageiros do banco traseiro em vias coletoras.", "Não há exceção: obrigatório para condutor e todos os passageiros.", "Sim, dispensa apenas condutor de veículo de carga em entrega."],
        correctIndex: 2,
        explanation: "Correta C: cinto obrigatório para todos, sem exceção. Base: Art. 65 do CTB.",
        incidence: "media",
        difficulty: 2,
        image_url: ""
    },
    {
        id: "rst_02",
        category: "legislacao",
        statement: "Em avenida de pista dupla, o carro da frente sinaliza que vai virar à esquerda. Quando a ultrapassagem pela direita é permitida?",
        options: ["Quando o veículo da frente segue lento na faixa da esquerda.", "Somente quando o da frente sinalizou que vai dobrar à esquerda.", "Em via de trânsito rápido sob cerração ou neblina intensa.", "Em pista simples com aclive acentuado e visão restrita."],
        correctIndex: 1,
        explanation: "Correta B: pela direita só com sinal de conversão à esquerda. Base: Art. 29 do CTB.",
        incidence: "alta",
        difficulty: 2,
        image_url: ""
    },
    {
        id: "rst_03",
        category: "direcao-defensiva",
        statement: "Com o carro em movimento sob cerração intensa, o motorista pensa em ligar o alerta. Quando o pisca-alerta pode ser usado andando?",
        options: ["Trafegando devagar sob cerração intensa e visibilidade mínima.", "Somente se a sinalização determinar ou em imobilização de emergência.", "Durante transposição de faixa em via arterial movimentada.", "Para indicar parada rápida no bordo em local proibido."],
        correctIndex: 1,
        explanation: "Correta B: andando só por sinalização ou emergência. Base: Art. 40 do CTB.",
        incidence: "media",
        difficulty: 2,
        image_url: ""
    },
    {
        id: "rst_04",
        category: "legislacao",
        statement: "Dois carros chegam a cruzamento com rotatória e acesso de rodovia próxima. Quando a regra da preferência pela direita não se aplica?",
        options: ["Quando um veículo está na rotatória ou ingressa vindo de rodovia.", "Quando ambos circulam por vias coletoras perpendiculares urbanas.", "Em interseção de vias paralelas de fluxo único no bairro.", "Em cruzamento urbano plano sem sinalização de preferência."],
        correctIndex: 0,
        explanation: "Correta A: rotatória e rodovia têm preferência própria. Base: Art. 29 do CTB.",
        incidence: "media",
        difficulty: 2,
        image_url: ""
    },
    {
        id: "rst_05",
        category: "legislacao",
        statement: "Em rua com calçada livre, o motorista quer cortar caminho com o carro. Quando a circulação sobre calçada e passeio é admitida?",
        options: ["Para evitar congestionamento em via arterial de fluxo intenso.", "Apenas para entrar ou sair de imóveis ou áreas de estacionamento.", "Para embarque rápido junto ao bordo da pista central.", "Para converter à esquerda quando a via estiver deserta."],
        correctIndex: 1,
        explanation: "Correta B: calçada só para acesso a imóvel. Base: Art. 29 do CTB.",
        incidence: "media",
        difficulty: 2,
        image_url: ""
    },
    {
        id: "rst_06",
        category: "direcao-defensiva",
        statement: "Em descida longa de serra, o motorista desce em ponto morto para economizar. Qual o risco técnico de descer em banguela?",
        options: ["Desgaste do motor por falta de lubrificação na descida.", "Perda do freio motor e sobrecarga dos freios de serviço.", "Travamento das rodas traseiras impedindo a conversão.", "Desligamento automático dos faróis em alta velocidade."],
        correctIndex: 1,
        explanation: "Correta B: sem freio motor há superaquecimento. Base: Art. 231 do CTB.",
        incidence: "alta",
        difficulty: 2,
        image_url: ""
    },
    {
        id: "rst_07",
        category: "legislacao",
        statement: "Em bairro residencial de madrugada, o condutor usa a buzina para chamar alguém. Em qual situação o uso da buzina é proibido?",
        options: ["Fora da cidade para advertir intenção de ultrapassar.", "Entre 22h e 6h ou em local com proibição sinalizada.", "Como advertência preventiva para evitar acidente no cruzamento.", "Ao avisar pedestres parados no bordo da pista urbana."],
        correctIndex: 1,
        explanation: "Correta B: proibida de 22h às 6h e onde há placa. Base: Art. 227 do CTB.",
        incidence: "alta",
        difficulty: 2,
        image_url: ""
    },
    {
        id: "rst_08",
        category: "legislacao",
        statement: "Uma viatura policial identificada retorna ao pátio após ocorrência. Quando os veículos de emergência têm prioridade de passagem?",
        options: ["Ao transitar por via de trânsito rápido no perímetro urbano.", "Somente em urgência, identificados por alarme e luzes ligados.", "Ao retornar de ocorrência para o pátio do órgão responsável.", "Ao circular em aclive ou declive de rodovia federal."],
        correctIndex: 1,
        explanation: "Correta B: prioridade só em urgência identificada. Base: Art. 29, VII do CTB.",
        incidence: "media",
        difficulty: 1,
        image_url: ""
    },
    {
        id: "rst_09",
        category: "legislacao",
        statement: "Em avenida movimentada, o motorista para para passageiro descer com fila atrás. Como deve ser a parada para embarque e desembarque?",
        options: ["Pelo tempo estrito e sem interromper a fluidez da via.", "Com pisca-alerta ligado em qualquer trecho da arterial.", "No sentido oposto ao fluxo para melhor visibilidade.", "Apenas com recuo específico no canteiro central."],
        correctIndex: 0,
        explanation: "Correta A: parada rápida sem travar o fluxo. Base: Art. 48 do CTB.",
        incidence: "media",
        difficulty: 2,
        image_url: ""
    },
    {
        id: "rst_10",
        category: "legislacao",
        statement: "Em cidade sem placas de velocidade, o condutor trafega a 80 km/h. Em qual via urbana esse limite é admitido sem sinalização?",
        options: ["Em vias arteriais que cruzam o perímetro urbano.", "Em vias coletoras próximas a áreas residenciais.", "Exclusivamente nas vias de trânsito rápido.", "Em qualquer via urbana com pistas duplas paralelas."],
        correctIndex: 2,
        explanation: "Correta C: 80 km/h só na via rápida. Base: Art. 61 do CTB.",
        incidence: "altissima",
        difficulty: 2,
        image_url: ""
    },
    {
        id: "rst_11",
        category: "direcao-defensiva",
        statement: "Em rodovia de pista simples, o condutor sobe aclive com faixa contínua e quer ultrapassar. Com qual marcação pode ultrapassar no aclive?",
        options: ["Com espaço livre na pista e sem pedestres no bordo.", "Com linha amarela contínua na sua faixa de circulação.", "Com linha amarela seccionada na sua mão de direção.", "Sob cerração leve com veículos opostos ainda visíveis."],
        correctIndex: 2,
        explanation: "Correta C: no aclive só com seccionada. Base: Art. 32 do CTB.",
        incidence: "media",
        difficulty: 2,
        image_url: ""
    },
    {
        id: "rst_12",
        category: "legislacao",
        statement: "Em calçada movimentada, o ciclista quer pedalar entre pedestres para fugir do trânsito. Quando pode circular com bicicleta sobre a calçada?",
        options: ["Quando o trânsito na pista estiver muito congestionado.", "Somente com autorização do órgão e sinalização permitindo.", "Quando conduzir em velocidade reduzida junto ao meio-fio.", "Quando a transversal for via de trânsito rápido sinalizada."],
        correctIndex: 1,
        explanation: "Correta B: calçada só com autorização e placa. Base: Art. 59 do CTB.",
        incidence: "media",
        difficulty: 2,
        image_url: ""
    },
    {
        id: "rst_13",
        category: "primeiros-socorros",
        statement: "Após colisão com motociclista caído de capacete, populares tentam ajudar. No socorro à vítima, o que o prestador nunca deve fazer?",
        options: ["Sinalizar o local do acidente antes de atender a vítima.", "Movimentar a vítima ou retirar o capacete do motociclista.", "Chamar emergência especializada pelo 192 ou 193.", "Desligar a ignição do veículo para evitar incêndio."],
        correctIndex: 1,
        explanation: "Correta B: nunca mova nem tire o capacete. Base: manual de primeiros socorros do CTB.",
        incidence: "alta",
        difficulty: 2,
        image_url: ""
    },
    {
        id: "rst_14",
        category: "mecanica",
        statement: "Após rodar na rodovia, o motorista para no posto e quer calibrar os pneus quentes. Quando a pressão dos pneus deve ser verificada?",
        options: ["Quentes, logo após rodar veloz na rodovia federal.", "Frios, de preferência antes de colocar o veículo em circulação.", "Descalibrados para ajuste do sistema de suspensão.", "Molhados, após rodar sob chuva forte e pista lisa."],
        correctIndex: 1,
        explanation: "Correta B: calibragem correta é com pneu frio. Base: manual de mecânica básica.",
        incidence: "media",
        difficulty: 1,
        image_url: ""
    },
    {
        id: "rst_15",
        category: "legislacao",
        statement: "Em rua de pista simples, o condutor quer virar à esquerda no cruzamento com fluxo contrário. Como deve executar essa conversão?",
        options: ["Aproximando o carro do bordo esquerdo da pista simples.", "Junto à divisória do fluxo e cedendo ao sentido oposto.", "Com pisca-alerta ligado e avanço sobre a retenção.", "Acelerando para concluir antes do cruzamento oposto."],
        correctIndex: 1,
        explanation: "Correta B: esquerda junto à divisória com preferência. Base: Art. 34 do CTB.",
        incidence: "media",
        difficulty: 2,
        image_url: ""
    },
    {
        id: "fr_01",
        category: "mecanica",
        statement: "Em revisão de freios, o mecânico explica a atuação de cada sistema. Como se divide a atuação entre freio de pé e freio de mão?",
        options: ["Freio de mão nas quatro rodas, ideal para reduzir velocidade.", "Freio de pé só nas dianteiras para imobilizar o veículo.", "Freio de pé nas quatro rodas e de mão só nas traseiras.", "Ambos somente nas traseiras para evitar capotamento."],
        correctIndex: 2,
        explanation: "Correta C: pé nas quatro, mão nas traseiras. Base: mecânica básica de freios.",
        incidence: "media",
        difficulty: 2,
        image_url: ""
    },
    {
        id: "fr_02",
        category: "direcao-defensiva",
        statement: "Sob chuva forte, o carro perde contato com o solo e flutua sobre a água. Na aquaplanagem, o que o condutor nunca deve fazer?",
        options: ["Pisar forte no freio ou virar o volante de forma brusca.", "Tirar o pé do acelerador de forma suave e gradual.", "Manter o volante reto e firme com as duas mãos.", "Aguardar os pneus retomarem o contato com a pista."],
        correctIndex: 0,
        explanation: "Correta A: nunca frear nem esterçar brusco. Base: direção defensiva.",
        incidence: "alta",
        difficulty: 2,
        image_url: ""
    },
    {
        id: "fr_03",
        category: "mecanica",
        statement: "Estacionado em ladeira íngreme, o motorista puxa a alavanca extra do freio. Qual a finalidade exclusiva do freio de estacionamento?",
        options: ["Auxiliar a parada de emergência em alta velocidade.", "Imobilizar o veículo parado em aclive ou declive.", "Substituir o freio de pé em pista escorregadia.", "Reduzir a velocidade das dianteiras em conversão."],
        correctIndex: 1,
        explanation: "Correta B: freio de mão só imobiliza parado. Base: mecânica básica.",
        incidence: "media",
        difficulty: 1,
        image_url: ""
    },
    {
        id: "fr_04",
        category: "direcao-defensiva",
        statement: "Em descida longa de serra, o pedal endurece por superaquecimento dos freios. Para evitar o fade, o que o condutor deve utilizar?",
        options: ["Freio de mão em toques junto com o freio de pé.", "Freio motor com marcha reduzida compatível com a descida.", "Marcha neutra em ponto morto para poupar os freios.", "Pisca-alerta com pedal de freio pressionado direto."],
        correctIndex: 1,
        explanation: "Correta B: descida com freio motor engrenado. Base: direção defensiva e Art. 28 do CTB.",
        incidence: "alta",
        difficulty: 2,
        image_url: ""
    },
    {
        id: "fr_05",
        category: "mecanica",
        statement: "Em carro sem ABS, o motorista pisa fundo e as rodas travam na pista seca. O que o travamento das rodas na frenagem provoca?",
        options: ["Aumento do atrito com parada imediata do veículo.", "Perda da direção e arrastamento dos pneus na pista.", "Acionamento automático do freio de estacionamento.", "Transferência do peso só para as rodas traseiras."],
        correctIndex: 1,
        explanation: "Correta B: roda travada perde direção. Base: mecânica básica de freios.",
        incidence: "media",
        difficulty: 2,
        image_url: ""
    },
    {
        id: "fr_06",
        category: "direcao-defensiva",
        statement: "Sob chuva com poças na pista, o carro ameaça flutuar sobre a água. Como o condutor deve prevenir a aquaplanagem?",
        options: ["Acelerar para cruzar rápido o trecho alagado.", "Manter pneus bons e reduzir a velocidade sob chuva.", "Puxar o freio de mão ao avistar poças na pista.", "Usar luz alta para evaporar a água da pista."],
        correctIndex: 1,
        explanation: "Correta B: pneus bons e menor velocidade. Base: direção defensiva.",
        incidence: "media",
        difficulty: 2,
        image_url: ""
    },
    {
        id: "fr_07",
        category: "mecanica",
        statement: "Em frenagem de emergência na pista molhada, o pedal vibra sem travar as rodas. Como o sistema ABS atua nessa frenagem?",
        options: ["Bloqueia as traseiras para evitar derrapagem lateral.", "Evita o travamento e mantém a dirigibilidade do veículo.", "Funciona só com o freio de estacionamento acionado.", "Atua só no freio motor em aclives e declives."],
        correctIndex: 1,
        explanation: "Correta B: ABS evita trava e mantém direção. Base: mecânica básica.",
        incidence: "alta",
        difficulty: 1,
        image_url: ""
    },
    {
        id: "fr_08",
        category: "direcao-defensiva",
        statement: "Em curva molhada e escorregadia, o motorista pisa forte no freio no meio da curva. O que frear com violência na curva provoca?",
        options: ["Desengate do câmbio e aumento do giro do motor.", "Derrapagem por travamento das rodas e perda de aderência.", "Perda de pressão de ar em todos os pneus juntos.", "Ativação da iluminação de emergência do veículo."],
        correctIndex: 1,
        explanation: "Correta B: freio brusco em curva derrapa. Base: direção defensiva.",
        incidence: "media",
        difficulty: 2,
        image_url: ""
    },
    {
        id: "fr_09",
        category: "direcao-defensiva",
        statement: "Em descida íngreme, o motorista quer segurar o carro sem forçar os freios. Como o freio motor deve ser acionado corretamente?",
        options: ["Com embreagem pressionada junto ao freio de mão.", "Tirando o pé do acelerador e engatando marcha reduzida.", "Desligando a ignição durante o percurso em declive.", "Puxando o freio de mão em pequenos intervalos."],
        correctIndex: 1,
        explanation: "Correta B: freio motor com marcha menor. Base: direção defensiva.",
        incidence: "alta",
        difficulty: 2,
        image_url: ""
    },
    {
        id: "fr_10",
        category: "mecanica",
        statement: "Ao pisar no freio, o pedal afunda até o assoalho sem segurar o carro. O que esse sintoma no pedal de freio indica?",
        options: ["Vazamento de fluido ou ar nas tubulações hidráulicas.", "Travamento da alavanca do freio de mão puxada.", "Excesso de ar nos pneus do eixo traseiro.", "Queima das lâmpadas de freio na traseira."],
        correctIndex: 0,
        explanation: "Correta A: pedal sem resistência é fluido ou ar. Base: mecânica básica.",
        incidence: "media",
        difficulty: 2,
        image_url: ""
    },
    {
        id: "plc_a6_01",
        category: "legislacao",
        statement: "Em rodovia, o condutor avista placa amarela com cruzamento à frente. Sobre o que a placa de advertência A-6 alerta o condutor?",
        options: ["Entroncamento oblíquo de via arterial com via coletora.", "Cruzamento de vias no mesmo nível à frente na pista.", "Cruzamento com linha férrea em nível sem barreira.", "Acesso a via paralela de sentido único à direita."],
        correctIndex: 1,
        explanation: "Correta B: A-6 indica cruzamento de vias. Base: CTB Anexo II.",
        detailedExplanation: "A sinalização de advertência tem a função de alertar o condutor sobre uma situação de risco à frente, exigindo que ele adote conduta preventiva. A placa A-6 indica Cruzamento de vias, ou seja, uma interseção em que as vias se encontram no mesmo nível. Não se confunde com a A-8 (linha férrea), que trata de passagem de trem, nem com indicação de via coletora ou acesso paralelo, que são situações distintas de geometria viária.",
        legalBase: "CTB - Anexo II, Sinalização Vertical de Advertência",
        commonMistake: "Muita gente confunde a A-6 (cruzamento de vias) com a A-8 (passagem de linha férrea em nível), que é a placa do trem.",
        incidence: "alta",
        difficulty: 2,
        image_url: "https://sb.bigcreditos.com.br/storage/v1/object/public/library/images/placa-Cruzamento-de%20vias-A-6.png"
    },
    {
        id: "plc_a6_02",
        category: "direcao-defensiva",
        statement: "Em via sem semáforo, o motorista vê a placa A-6 de cruzamento à frente com carros laterais. Qual conduta adequada deve adotar?",
        options: ["Acelerar para cruzar antes do veículo que vem à direita.", "Reduzir, observar o tráfego e ceder conforme a regra.", "Buzinar de forma contínua e seguir sem reduzir.", "Trocar de faixa à esquerda sobre o cruzamento."],
        correctIndex: 1,
        explanation: "Correta B: A-6 exige redução e preferência. Base: Art. 29 do CTB.",
        detailedExplanation: "Em direção defensiva, a sinalização de advertência funciona como antecipação de risco: o condutor deve chegar à interseção com velocidade reduzida e pronta para parar. Como a placa não indica preferência própria, vale a regra geral do art. 29 do CTB: em cruzamento não sinalizado, cede passagem ao veículo que se aproxima pela direita. Acelerar para \"passar primeiro\", usar a buzina de forma contínua ou mudar de faixa em cima da interseção são condutas agressivas e contrárias à direção defensiva.",
        legalBase: "Art. 29 do CTB",
        commonMistake: "Achar que, por ser placa de advertência, basta apenas passar sem parar; a A-6 exige redução e observação ativa.",
        incidence: "alta",
        trap: true,
        difficulty: 3,
        image_url: "https://sb.bigcreditos.com.br/storage/v1/object/public/library/images/placa-Cruzamento-de%20vias-A-6.png"
    },
    {
        id: "plc_a6_03",
        category: "legislacao",
        statement: "Em cruzamento indicado apenas pela placa A-6, dois carros chegam juntos sem semáforo. A quem pertence a preferência de passagem?",
        options: ["Ao veículo que trafega em maior velocidade na pista.", "Ao veículo que se aproxima pela direita do condutor.", "Ao veículo que pretende converter à esquerda na via.", "Ao veículo de maior porte, independente da via usada."],
        correctIndex: 1,
        explanation: "Correta B: sem sinalização vale a direita. Base: Art. 29, II e §3º do CTB.",
        detailedExplanation: "A placa A-6 apenas sinaliza a existência do cruzamento; ela não estabelece qual via tem preferência. Nesses casos aplica-se a regra geral da preferência: em interseção não sinalizada, o veículo que se aproxima pela direita tem passagem garantida. O porte do veículo, a velocidade e a intenção de virar à esquerda não alteram essa prioridade — inclusive a conversão à esquerda é a manobra que mais exige cautela, pois o condutor precisa cruzar a corrente contrária.",
        legalBase: "Art. 29, II e §3º do CTB",
        commonMistake: "Achar que quem vai virar à esquerda tem prioridade, ou que o veículo maior manda na interseção.",
        incidence: "altissima",
        trap: true,
        difficulty: 2,
        image_url: "https://sb.bigcreditos.com.br/storage/v1/object/public/library/images/placa-Cruzamento-de%20vias-A-6.png"
    },
    {
        id: "qe_alagamento_01",
        category: "direcao-defensiva",
        statement: "Sob chuva intensa, o condutor encontra trecho alagado com água subindo na pista. Qual conduta segura deve adotar nesse alagamento?",
        options: ["Frear brusco sobre a pista e esperar a água baixar no local.", "Acelerar forte para cruzar rápido antes de a água subir.", "Parar em local alto ou passar de 1ª com aceleração constante se a água estiver abaixo da metade da roda.", "Engatar 2ª e acelerar forte mesmo com água acima dos pneus."],
        correctIndex: 2,
        explanation: "Correta C: água alta exige parada; baixa exige 1ª constante. Base: Art. 28 do CTB.",
        legalBase: "Art. 28 do CTB",
        incidence: "alta",
        trap: true,
        difficulty: 2
    },
    {
        id: "mb_n1_001",
        category: "mecanica",
        statement: "No sistema de lubrificação do motor, qual peça tem a função de armazenar o óleo lubrificante?",
        options: ["O radiador, localizado na parte frontal do veículo.", "O cárter, localizado na parte inferior do motor.", "O filtro de óleo, acoplado ao bloco do motor.", "O cabeçote, localizado na parte superior do motor."],
        correctIndex: 1,
        explanation: "Correta: o cárter atua como o reservatório principal de óleo, fixado na parte inferior do motor.",
        detailedExplanation: "O cárter é uma espécie de bacia ou reservatório metálico que fica na parte mais baixa do motor. Quando o veículo está desligado, todo o óleo escorre e fica armazenado ali. É no cárter que o bujão é aberto na hora de realizar a troca de óleo.",
        legalBase: "Mecânica Básica de Veículos",
        commonMistake: "Achar que o filtro de óleo armazena o lubrificante. O filtro serve apenas para reter impurezas, não como reservatório principal.",
        tip: "Reservatório de óleo = Cárter.",
        memoryHook: "Cárter = Carga de óleo.",
        incidence: "alta",
        difficulty: 1
    },
    {
        id: "cid_n1_001",
        category: "legislacao",
        statement: "Em caso de acidentes de trânsito sem vítimas, qual é a atitude correta e obrigatória do condutor envolvido para garantir a segurança e a fluidez?",
        options: ["Aguardar a chegada da perícia policial no local, sem remover os veículos da via.", "Remover os veículos do local de forma imediata para não atrapalhar o fluxo do trânsito.", "Deixar os veículos na pista exatamente como pararam até o registro do boletim de ocorrência.", "Evadir-se do local rapidamente para evitar possíveis congestionamentos e conflitos."],
        correctIndex: 1,
        explanation: "Correta: em acidentes sem vítimas, é obrigatório retirar os veículos para não obstruir a via, conforme art. 178 do CTB.",
        detailedExplanation: "Bateu o carro e houve apenas danos materiais (ninguém se machucou)? A obrigação dos condutores é tirar os veículos do meio da rua imediatamente para liberar o trânsito. Deixar o carro bloqueando a via sem necessidade é infração média.",
        legalBase: "Art. 178 do CTB",
        commonMistake: "Muitos acham que não se pode mover o carro de forma alguma antes da polícia chegar. Essa regra de não mexer vale apenas para acidentes COM vítimas.",
        tip: "Sem vítima = Tira o carro da via.",
        memoryHook: "Bateu, não machucou? Desobstruiu!",
        incidence: "alta",
        trap: true,
        difficulty: 1
    },
    {
        id: "dd_n1_003",
        category: "direcao-defensiva",
        statement: "Qual é a distância lateral mínima de segurança que o condutor de um veículo automotor deve manter ao ultrapassar uma bicicleta?",
        options: ["1,0 metro de distância lateral do ciclista.", "1,5 metro de distância lateral do ciclista.", "2,0 metros de distância lateral do ciclista.", "Nenhuma distância mínima específica, bastando reduzir a marcha do veículo."],
        correctIndex: 1,
        explanation: "Correta: a distância lateral mínima exigida ao ultrapassar um ciclista é de 1,5 metro, conforme o art. 201 do CTB.",
        detailedExplanation: "Para garantir a segurança dos ciclistas, que são os mais vulneráveis, o Código de Trânsito Brasileiro exige que os carros passem a pelo menos 1,5m de distância deles. Desrespeitar essa regra é infração média.",
        legalBase: "Art. 201 do CTB",
        commonMistake: "Acreditar que basta desviar um pouco do ciclista sem ter uma métrica exata de distanciamento.",
        tip: "Ciclista na via = 1,5 metro de distância.",
        memoryHook: "Dê 1 e meio para o ciclista passear sem receio.",
        incidence: "alta",
        difficulty: 1
    },
    {
        id: "leg_sinal_braco_01",
        category: "legislacao",
        statement: "Com o pisca-pisca queimado e precisando converter à esquerda, qual sinal de braço o condutor deverá fazer aos demais motoristas:",
        options: ["Braço esquerdo estendido horizontalmente para fora do veículo.", "Braço esquerdo levantado verticalmente com o antebraço apontado para cima.", "Braço esquerdo estendido horizontalmente fazendo movimentos verticais para cima e para baixo.", "Braço direito estendido horizontalmente para o lado oposto da via."],
        correctIndex: 0,
        explanation: "Correta A: braço esquerdo estendido na horizontal indica conversão à esquerda, conforme art. 35 do CTB.",
        detailedExplanation: "Sem pisca-pisca, o condutor usa o gesto convencional de braço: estender o braço esquerdo na horizontal significa virar à esquerda; antebraço para cima significa virar à direita; movimentos verticais significam reduzir ou parar.",
        legalBase: "Art. 35 do CTB",
        commonMistake: "Confundir com o antebraço para cima, que indica conversão à direita, não à esquerda.",
        tip: "Braço esticado pro lado = vira pro lado do braço.",
        memoryHook: "Esquerda esticada, esquerda indicada.",
        incidence: "media",
        difficulty: 1,
        group: "sinais-braco-condutor",
        origin: "real"
    },
    {
        id: "leg_sinal_braco_02",
        category: "legislacao",
        statement: "Com pane elétrica e sem luzes de sinalização, para indicar que vai diminuir a marcha ou parar, o condutor deverá:",
        options: ["Manter o braço esquerdo totalmente estendido para cima em ângulo de 90 graus.", "Estender o braço esquerdo horizontalmente e movimentá-lo verticalmente para cima e para baixo.", "Estender ambos os braços para fora das janelas simultaneamente.", "Balançar a mão direita para o lado de fora indicando parada total."],
        correctIndex: 1,
        explanation: "Correta B: braço estendido com movimentos verticais indica redução de marcha ou parada, conforme art. 35 do CTB.",
        detailedExplanation: "O gesto de diminuir a marcha ou parar é o braço esquerdo estendido na horizontal balançando para cima e para baixo. Braço parado na horizontal é virar à esquerda; antebraço para cima é virar à direita.",
        legalBase: "Art. 35 do CTB",
        commonMistake: "Achar que qualquer braço para cima significa parar — o gesto de parar exige o movimento vertical de sobe e desce.",
        tip: "Braço balançando pra cima e pra baixo = vai parar.",
        memoryHook: "Marcha caindo, braço balançando.",
        incidence: "media",
        difficulty: 1,
        group: "sinais-braco-condutor",
        origin: "real"
    },
    {
        id: "leg_sinal_braco_03",
        category: "legislacao",
        statement: "Para compensar a falha do pisca-pisca, o condutor ergue o antebraço esquerdo verticalmente para cima. Esse gesto significa:",
        options: ["O propósito de dobrar à direita.", "O propósito de retornar em sentido contrário (conversão em U).", "A ordem de preferência de passagem para os pedestres.", "A intenção exclusiva de acelerar o veículo em via de trânsito rápido."],
        correctIndex: 0,
        explanation: "Correta A: antebraço esquerdo para cima indica conversão à direita, conforme art. 35 do CTB.",
        detailedExplanation: "Com o braço esquerdo, só dá para apontar para a esquerda esticando na horizontal. Para indicar a direita, o condutor dobra o braço e aponta o antebraço para cima. É o gesto regulamentar de conversão à direita.",
        legalBase: "Art. 35 do CTB",
        commonMistake: "Achar que antebraço para cima é parar — parar é o braço estendido balançando na vertical.",
        tip: "Antebraço pra cima = vira à direita.",
        memoryHook: "Dedo pro céu, curva pra direita.",
        incidence: "media",
        difficulty: 2,
        group: "sinais-braco-condutor",
        origin: "real"
    },
    {
        id: "leg_ciclomotor_02",
        category: "legislacao",
        statement: "Os ciclomotores devem ser conduzidos pela direita da pista, preferencialmente no ______ da faixa mais à direita ou no bordo direito sempre que não houver ______ ou faixa própria:",
        options: ["Acostamento e circulação.", "Bordo e pista de rolamento.", "Centro e acostamento.", "Trânsito e bordo."],
        correctIndex: 2,
        explanation: "Correta C: no centro da faixa mais à direita ou no bordo direito quando não houver acostamento ou faixa própria, conforme art. 59 do CTB.",
        detailedExplanation: "O art. 59 do CTB completa a frase com centro e acostamento: o ciclomotor anda pela direita da pista, de preferência no centro da faixa mais à direita, sempre que não houver acostamento ou faixa própria a ele destinada.",
        legalBase: "Art. 59 do CTB",
        commonMistake: "Preencher com bordo na primeira lacuna — o bordo direito é a alternativa ao centro da faixa, não o preferencial.",
        tip: "Lacunas do ciclomotor: centro + acostamento.",
        memoryHook: "Ciclomotor no centro-direita, sem acostamento por perto.",
        incidence: "media",
        difficulty: 2,
        group: "ciclomotor-circulacao",
        origin: "real"
    },
    {
        id: "leg_silvo_breve_01",
        category: "legislacao",
        statement: "Quando o agente de trânsito emite um silvo breve com o apito, esse comando significa que o condutor deve:",
        options: ["Prosseguir, pois um silvo breve libera a passagem.", "Parar o veículo imediatamente onde estiver.", "Diminuir a marcha e seguir em velocidade reduzida.", "Retornar no sentido contrário da via."],
        correctIndex: 0,
        explanation: "Correta A: um silvo breve do apito significa siga, com a passagem liberada, conforme art. 90 do CTB.",
        detailedExplanation: "O apito do agente tem três comandos: um silvo breve libera (siga); dois silvos breves mandam parar; um silvo longo manda diminuir a marcha.",
        legalBase: "Art. 90 do CTB",
        commonMistake: "Confundir com os dois silvos breves, que mandam parar o veículo.",
        tip: "1 pio = vai.",
        memoryHook: "Um pio rapidinho, pode ir todinho.",
        incidence: "alta",
        difficulty: 1,
        group: "silvos-apito",
        origin: "real"
    },
    {
        id: "leg_silvo_parar_02",
        category: "legislacao",
        statement: "Quando o agente de trânsito emite dois silvos breves com o apito, esse comando significa que o condutor deve:",
        options: ["Seguir em frente sem alterar a marcha do veículo.", "Parar o veículo imediatamente.", "Diminuir a marcha e seguir devagar pelo trecho.", "Estacionar no acostamento mais próximo da via."],
        correctIndex: 1,
        explanation: "Correta B: dois silvos breves do apito significam pare, com detenção obrigatória, conforme art. 90 do CTB.",
        detailedExplanation: "Dois silvos breves é ordem de parada obrigatória. Não confunda: um breve libera, dois breves param, um longo reduz a marcha.",
        legalBase: "Art. 90 do CTB",
        commonMistake: "Achar que dois silvos liberam a passagem — é o contrário: mandam parar.",
        tip: "2 pios = para.",
        memoryHook: "Pio-pio, parou o carro no meio do fio.",
        incidence: "alta",
        difficulty: 1,
        group: "silvos-apito",
        origin: "real"
    },
    {
        id: "leg_silvo_longo_03",
        category: "legislacao",
        statement: "Quando o agente de trânsito emite um silvo longo com o apito, esse comando significa que o condutor deve:",
        options: ["Parar o veículo imediatamente onde estiver.", "Seguir em frente mantendo a velocidade da via.", "Retornar e buscar uma rota alternativa.", "Diminuir a marcha do veículo no trecho."],
        correctIndex: 3,
        explanation: "Correta D: um silvo longo do apito significa diminuam a marcha, conforme art. 90 do CTB.",
        detailedExplanation: "O silvo longo é o comando de redução: o condutor deve diminuir a marcha ao se aproximar do ponto controlado pelo agente.",
        legalBase: "Art. 90 do CTB",
        commonMistake: "Achar que o silvo longo manda parar — parar são os dois silvos breves.",
        tip: "Pio longo = devagar.",
        memoryHook: "Pio comprido, pé contido.",
        incidence: "alta",
        difficulty: 1,
        group: "silvos-apito",
        origin: "real"
    },
    {
        id: "ext_balanceamento_01",
        category: "mecanica",
        statement: "O balanceamento preserva a dirigibilidade e a suspensão. Pelos sinais de desajuste, ele deve ser executado obrigatoriamente:",
        options: ["Pelo menos uma vez por mês, independentemente da quilometragem percorrida ou do tipo de pavimento em que o veículo trafega rotineiramente.", "Quando a direção do veículo apresentar rigidez excessiva, peso anormal ao esterçar ou estalos ao realizar manobras de estacionamento em baixa velocidade.", "Imediatamente e exclusivamente quando surgirem vibrações perceptíveis no volante de direção a partir de determinadas faixas de velocidade.", "Logo após cada operação de calibragem dos pneus, de modo a compensar a variação de massa estática provocada pela entrada de ar comprimido."],
        correctIndex: 2,
        explanation: "Correta C: vibração no volante em certas velocidades é o sintoma clássico de desbalanceamento, conforme manual de manutenção veicular.",
        detailedExplanation: "Rodas desbalanceadas vibram o volante em determinadas velocidades e desgastam pneus e suspensão. Direção pesada ou estalos indicam alinhamento ou problema hidráulico/elétrico, não balanceamento; nem prazo mensal nem calibragem obrigam a balancear.",
        legalBase: "Manual de Manutenção Veicular e Direção Defensiva",
        commonMistake: "Confundir direção pesada com desbalanceamento — direção pesada é sintoma de alinhamento ou falha hidráulica/elétrica.",
        tip: "Volante vibrando = balancear.",
        memoryHook: "Vibrou o volante, balanceia na hora.",
        incidence: "alta",
        trap: true,
        difficulty: 2,
        origin: "ia"
    },
    {
        id: "ext_advertencia_01",
        category: "infracoes",
        statement: "Qual medida estritamente pedagógica a autoridade pode aplicar, sem reincidência em 12 meses, só para infrações leves ou médias:",
        options: ["Multa pecuniária de caráter compensatório, aplicada obrigatoriamente em substituição à suspensão temporária quando o condutor for primário.", "Suspensão preventiva do direito de dirigir, condicionada à frequência obrigatória em curso de reciclagem e reabilitação profissional.", "Advertência por escrito, faculdade da autoridade (não obrigação automática), só para infrações leves ou médias e sem reincidência em 12 meses.", "Cassação do documento de habilitação, aplicada por cumulação de pontos e restrita aos casos com transporte de passageiros."],
        correctIndex: 2,
        explanation: "Correta C: a advertência por escrito é a penalidade pedagógica para infrações leves ou médias sem reincidência em 12 meses, conforme art. 267 do CTB.",
        detailedExplanation: "O art. 267 do CTB permite à autoridade converter a multa em advertência por escrito quando a infração for leve ou média e o infrator não tiver cometido a mesma infração nos últimos 12 meses. É faculdade, não obrigação.",
        legalBase: "Art. 267 do CTB",
        commonMistake: "Achar que a conversão em advertência é automática ou que vale para infrações graves e gravíssimas — só leves e médias.",
        tip: "Leve ou média + primário = pode virar advertência.",
        memoryHook: "Advertência: leveza que educa, sem reincidir.",
        incidence: "alta",
        trap: true,
        difficulty: 2,
        origin: "ia"
    },
    {
        id: "ext_retorno_rodovia_01",
        category: "legislacao",
        statement: "Em rodovia de pista simples sem local apropriado para retorno, como trevos ou escapes, o condutor deverá:",
        options: ["Parar junto ao eixo central da pista com pisca-alerta ligado até o fluxo contrário ficar livre para a manobra em arco.", "Aguardar no centro da via ocupando a faixa do sentido oposto para garantir visibilidade dos veículos à retaguarda.", "Posicionar e parar no acostamento à direita, aguardando o momento oportuno para cruzar com segurança, salvo faixa própria à esquerda.", "Deslocar para o acostamento da esquerda, imobilizando rente à defensa para não interferir no fluxo principal."],
        correctIndex: 2,
        explanation: "Correta C: sem local próprio, pare no acostamento à direita e cruze só com segurança. Arts. 38 e 204 do CTB.",
        detailedExplanation: "A intuição manda parar à esquerda porque vai virar para lá, mas a regra exige imobilizar no acostamento da direita e cruzar a pista só quando estiver totalmente livre.",
        legalBase: "Art. 38 e Art. 204 do CTB",
        commonMistake: "Parar no acostamento da esquerda por intuição — a norma manda sempre o da direita.",
        tip: "Retorno sem trevo = acostamento da DIREITA.",
        memoryHook: "Vai pra esquerda? Para na direita.",
        incidence: "alta",
        trap: true,
        difficulty: 2,
        origin: "ia"
    },
    {
        id: "ext_colar_cervical_04",
        category: "primeiros-socorros",
        statement: "Diante de motociclista com suspeita de lesão na coluna e dor intensa no pescoço, o dispositivo obrigatório para imobilizar a cervical é:",
        options: ["Garrote de compressão elástica para restringir o fluxo sanguíneo na região cervical e prevenir edemas locais.", "Colar cervical rígido ou semirrígido, mantendo o pescoço em posição neutra até a remoção especializada.", "Torniquete hemostático de alta pressão para bloquear mecanicamente as vértebras cervicais.", "Bandagem triangular em volta do pescoço para tracionar e reverter o desalinhamento ósseo."],
        correctIndex: 1,
        explanation: "Correta B: o colar cervical imobiliza a coluna cervical em posição neutra até o resgate especializado.",
        detailedExplanation: "Garrote e torniquete servem para hemorragias em membros e seriam fatais no pescoço. Diante de trauma raquimedular, imobilize a cervical com o colar e não movimente a vítima.",
        legalBase: "Primeiros Socorros — imobilização cervical",
        commonMistake: "Usar garrote ou torniquete no pescoço por decorar os nomes sem saber a função de cada um.",
        tip: "Dor no pescoço após queda = colar cervical.",
        memoryHook: "Pescoço doeu, colar protegeu.",
        incidence: "alta",
        trap: true,
        difficulty: 2,
        origin: "ia"
    },
    {
        id: "ext_finalidade_sinalizacao_05",
        category: "legislacao",
        statement: "Sob a ótica das normas de circulação, a finalidade primordial da sinalização de trânsito consiste em:",
        options: ["Informar em tempo real o fluxo de veículos, alertando sobre congestionamentos e densidade do tráfego.", "Orientar sobre condições da pista, restrições, obrigações, proibições e advertências para o uso seguro da via.", "Fiscalizar a condição mecânica dos veículos, apontando falhas em freios, suspensão e emissão de poluentes.", "Impedir de forma autônoma atos de imprudência, imperícia ou negligência dos condutores."],
        correctIndex: 1,
        explanation: "Correta B: sinalizar é orientar sobre pista, restrições, obrigações e proibições para o uso seguro da via.",
        detailedExplanation: "Placas e sinais informam e regulam, mas não impedem fisicamente a imprudência nem fiscalizam mecânica — isso cabe a agentes e equipamentos eletrônicos.",
        legalBase: "Art. 87 do CTB",
        commonMistake: "Achar que a sinalização impede sozinha a imprudência — ela informa e regula; fiscalizar é outra função.",
        tip: "Sinalização = informar e orientar.",
        memoryHook: "Placa fala, não segura.",
        incidence: "media",
        trap: true,
        difficulty: 2,
        origin: "ia"
    },
    {
        id: "ext_faixa_amarela_06",
        category: "legislacao",
        statement: "Na sinalização horizontal, qual cor regulamentar demarca as linhas de divisão de fluxos de tráfego em sentidos opostos:",
        options: ["Branca, para separar fluxos opostos em pista dupla e faixas exclusivas de transporte coletivo.", "Amarela, para separar fluxos em sentidos opostos, delimitando o eixo da pista.", "Azul, para orientar retornos em rotatórias de grande fluxo e vias de trânsito rápido.", "Preta, como contraste sobre pavimentação clara para realçar as faixas principais."],
        correctIndex: 1,
        explanation: "Correta B: o amarelo separa fluxos opostos; o branco separa mesmo sentido. Anexo II do CTB.",
        detailedExplanation: "Regra de ouro: amarelo = sentidos opostos; branco = mesmo sentido. Azul é para vagas especiais e o preto só serve de contraste.",
        legalBase: "Anexo II do CTB",
        commonMistake: "Marcar branca por ser a cor mais vista nas ruas — branco é para o mesmo sentido.",
        tip: "Amarelo = opostos; branco = mesmo sentido.",
        memoryHook: "Amarelo alerta o contrário.",
        incidence: "alta",
        trap: true,
        difficulty: 2,
        group: "sinalizacao-amarela",
        origin: "ia"
    },
    {
        id: "ext_contran_07",
        category: "legislacao",
        statement: "No Sistema Nacional de Trânsito, qual órgão detém a competência normativa máxima, expedindo diretrizes e normas regulamentares:",
        options: ["A SENATRAN, órgão executivo da União que coordena registros de veículos e habilitação.", "O Ministério da Justiça, que homologa todas as multas aplicadas nas rodovias federais.", "O CONTRAN, órgão máximo normativo e consultivo do Sistema Nacional de Trânsito.", "O DETRAN, órgão executivo estadual que registra veículos e habilita condutores."],
        correctIndex: 2,
        explanation: "Correta C: o CONTRAN é o órgão máximo normativo e consultivo do SNT, conforme art. 7º do CTB.",
        detailedExplanation: "CONTRAN normatiza para todo o país; SENATRAN executa em nível federal; DETRAN executa no estado (registro e habilitação). Nenhum ministério homologa multas.",
        legalBase: "Art. 7º do CTB",
        commonMistake: "Confundir SENATRAN (executivo) com CONTRAN (normativo máximo).",
        tip: "Norma máxima = CONTRAN.",
        memoryHook: "CONTRAN comanda, DETRAN executa.",
        incidence: "media",
        trap: true,
        difficulty: 2,
        origin: "ia"
    },
    {
        id: "cid_boa_01",
        category: "legislacao",
        statement: "Ao aproximar-se de faixa de pedestres com pessoa iniciando a travessia em via urbana, qual deve ser a atitude correta do condutor do veículo?",
        options: ["Buzinar brevemente para avisar o pedestre e seguir sem reduzir a velocidade na faixa.", "Reduzir um pouco e passar devagar ao lado do pedestre, sem precisar parar totalmente.", "Parar o veículo antes da faixa e aguardar o pedestre concluir a travessia com segurança.", "Acelerar para passar antes do pedestre e assim evitar reter o fluxo de veículos atrás."],
        correctIndex: 2,
        explanation: "A correta exige parada para o pedestre concluir a travessia; os distratores confundem porque buzinar ou passar devagar parecem agilizar sem desrespeitar.",
        legalBase: "Art. 214 do CTB",

        incidence: "alta",
        trap: true,
        difficulty: 2,
        group: "conduta-pedestres",
        origin: "ia"
    },
    {
        id: "cid_boa_02",
        category: "legislacao",
        statement: "Em dia de chuva forte, ao passar por calçada com pedestres próximos à pista, o que o condutor deve fazer para demonstrar cidadania no trânsito?",
        options: ["Reduzir a velocidade e desviar de poças para não molhar os pedestres na calçada.", "Manter a mesma velocidade para sair logo do trecho alagado e liberar a via.", "Buzinar para alertar os pedestres e passar rápido pela água acumulada.", "Acelerar sobre a poça para testar a aderência dos pneus na pista molhada."],
        correctIndex: 0,
        explanation: "Reduzir e evitar molhar pedestres é a conduta cidadã; manter ou acelerar parece eficiente, mas molha pessoas e gera risco.",
        legalBase: "Art. 171 do CTB",

        incidence: "alta",
        trap: true,
        difficulty: 2,
        group: "conduta-pedestres",
        origin: "ia"
    },
    {
        id: "cid_boa_03",
        category: "legislacao",
        statement: "Diante de idoso com dificuldade de locomoção tentando atravessar fora da faixa em via de baixo movimento, como o motorista deve agir corretamente?",
        options: ["Seguir sem parar, pois fora da faixa o pedestre não tem prioridade sobre os veículos.", "Buzinar de forma insistente para apressar o idoso e liberar rapidamente a pista.", "Mandar o idoso voltar e atravessar apenas na faixa distante, sem oferecer ajuda.", "Reduzir, parar com paciência e facilitar a travessia segura do idoso mesmo fora da faixa."],
        correctIndex: 3,
        explanation: "A paciência e a parada protegem o idoso vulnerável; a pegadinha é achar que a ausência de faixa dispensa a solidariedade e a prudência.",

        incidence: "alta",
        trap: true,
        difficulty: 3,
        group: "conduta-pedestres",
        origin: "ia"
    },
    {
        id: "cid_boa_04",
        category: "legislacao",
        statement: "Ao trafegar por rua estreita com crianças brincando na calçada e correndo risco de invadir a pista, qual conduta defensiva o condutor deve adotar?",
        options: ["Manter a velocidade regulamentar, pois a responsabilidade é dos pais que supervisionam as crianças.", "Reduzir bastante a velocidade, redobrar a atenção e estar pronto para frear imediatamente.", "Buzinar continuamente para assustar as crianças e mantê-las longe da pista.", "Acelerar para passar rápido pelo trecho e diminuir o tempo de exposição ao risco."],
        correctIndex: 1,
        explanation: "Reduzir e ficar pronto para frear previne atropelamentos; buzinar ou acelerar parecem afastar o risco, mas aumentam o perigo.",

        incidence: "alta",
        trap: true,
        difficulty: 2,
        group: "conduta-pedestres",
        origin: "ia"
    },
    {
        id: "cid_boa_05",
        category: "legislacao",
        statement: "Ao identificar pessoa com deficiência visual com bengala aguardando para atravessar a via, qual é a atitude mais respeitosa e segura do condutor?",
        options: ["Buzinar para avisar que está passando e seguir, pois o som orienta a pessoa.", "Passar devagar ao lado dela sem parar, para não interromper o fluxo dos veículos.", "Parar o veículo, sinalizar e permitir que a pessoa atravesse com tranquilidade e segurança.", "Seguir normalmente, pois a preferência só vale depois que o pedestre iniciou a travessia."],
        correctIndex: 2,
        explanation: "Parar e ceder a passagem garante segurança à pessoa com deficiência; buzinar ou passar devagar parecem ajudar, mas assustam e pressionam.",
        legalBase: "Art. 214 do CTB",

        incidence: "alta",
        trap: true,
        difficulty: 2,
        group: "conduta-pedestres",
        origin: "ia"
    },
    {
        id: "cid_boa_06",
        category: "legislacao",
        statement: "Em parada de ônibus com passageiros embarcando pela pista por falta de recuo, qual deve ser o comportamento do motorista que se aproxima do local?",
        options: ["Ultrapassar pela esquerda com velocidade para não reter o trânsito atrás do ônibus.", "Reduzir a velocidade ou parar e aguardar o embarque seguro dos passageiros na pista.", "Buzinar e passar com cuidado entre os passageiros para manter o ritmo da via.", "Manter a velocidade e desviar por pouco dos pedestres para não perder tempo."],
        correctIndex: 1,
        explanation: "Reduzir ou parar protege quem embarca pela pista; ultrapassar ou buzinar parecem manter a fluidez, mas expõem pedestres a atropelamento.",

        incidence: "alta",
        trap: true,
        difficulty: 2,
        group: "conduta-pedestres",
        origin: "ia"
    },
    {
        id: "cid_boa_07",
        category: "legislacao",
        statement: "Ao avistar pedestre já efetuando a travessia em cruzamento sem semáforo, mesmo fora da faixa demarcada, qual decisão o condutor deve tomar?",
        options: ["Frear e aguardar o pedestre concluir a travessia, pois a segurança prevalece sobre a faixa.", "Buzinar para advertir o pedestre do erro e passar devagar ao seu lado.", "Acelerar, pois fora da faixa o pedestre perdeu o direito à preferência na travessia.", "Desviar sem reduzir a velocidade, confiando apenas na habilidade de direção."],
        correctIndex: 0,
        explanation: "Com travessia iniciada, o condutor deve frear e aguardar; a pegadinha é crer que a falta de faixa autoriza seguir ou pressionar com buzina.",
        legalBase: "Art. 214 do CTB",

        incidence: "alta",
        trap: true,
        difficulty: 3,
        group: "conduta-pedestres",
        origin: "ia"
    },
    {
        id: "cid_boa_08",
        category: "legislacao",
        statement: "Em frente a escola no horário de saída dos alunos, com grande movimentação de crianças na calçada, o que se espera de um condutor consciente?",
        options: ["Manter a velocidade da via, pois as crianças devem permanecer sobre a calçada.", "Buzinar para dispersar os grupos e conseguir passar sem precisar reduzir.", "Acelerar para deixar o local congestionado o mais rápido possível.", "Reduzir muito a velocidade, redobrar a atenção e estar pronto para parar de imediato."],
        correctIndex: 3,
        explanation: "Perto de escola exige velocidade mínima e atenção máxima; manter ou buzinar parecem normais, mas ignoram a imprevisibilidade das crianças.",

        incidence: "alta",
        trap: true,
        difficulty: 1,
        group: "conduta-pedestres",
        origin: "ia"
    },
    {
        id: "cid_boa_09",
        category: "legislacao",
        statement: "Quando o semáforo abre para os veículos mas ainda há pedestres terminando a travessia na faixa, qual deve ser a reação correta do motorista?",
        options: ["Arrancar devagar forçando a passagem, pois o sinal verde já autoriza os veículos.", "Buzinar para apressar os pedestres e dividir o espaço da faixa com eles.", "Aguardar parado até os pedestres concluírem a travessia e liberarem totalmente a faixa.", "Avançar com cuidado pelo canto da faixa enquanto os pedestres passam pelo outro lado."],
        correctIndex: 2,
        explanation: "O verde não autoriza atropelar quem ainda atravessa; arrancar devagar ou buzinar parecem aproveitar o sinal, mas violam a preferência.",
        legalBase: "Art. 214 do CTB",

        incidence: "alta",
        trap: true,
        difficulty: 2,
        group: "conduta-pedestres",
        origin: "ia"
    },
    {
        id: "cid_boa_10",
        category: "legislacao",
        statement: "Ao estacionar o veículo em área urbana movimentada, por que o motorista deve evitar bloquear calçadas, rampas de acesso e guias rebaixadas?",
        options: ["Porque parar sobre a calçada melhora a visibilidade do veículo para outros motoristas.", "Porque calçada livre garante passagem de pedestres, carrinhos e cadeirantes com segurança.", "Porque bloquear a calçada só é problema quando há fiscalização com guincho por perto.", "Porque subir na calçada protege os pneus do desgaste causado pelo asfalto irregular."],
        correctIndex: 1,
        explanation: "Calçada livre preserva mobilidade e segurança; os distratores confundem ao tratar calçada como extensão da vaga ou proteção do carro.",

        incidence: "alta",
        trap: true,
        difficulty: 1,
        group: "conduta-pedestres",
        origin: "ia"
    },
    {
        id: "cid_boa_11",
        category: "legislacao",
        statement: "Em via com poça d'água junto ao ponto de ônibus onde pedestres aguardam, qual atitude revela boa conduta e respeito por parte do motorista?",
        options: ["Reduzir a velocidade e afastar-se da borda para não jogar água nos pedestres.", "Passar na mesma velocidade, pois desviar pode atrapalhar os veículos ao lado.", "Buzinar para os pedestres se afastarem e passar rápido sobre a poça.", "Acelerar para atravessar a poça antes que mais pedestres cheguem ao ponto."],
        correctIndex: 0,
        explanation: "Reduzir e desviar evita molhar quem espera; buzinar ou manter a velocidade parecem práticos, mas demonstram desrespeito e podem gerar sanção.",
        legalBase: "Art. 171 do CTB",

        incidence: "alta",
        trap: true,
        difficulty: 2,
        group: "conduta-pedestres",
        origin: "ia"
    },
    {
        id: "cid_boa_12",
        category: "legislacao",
        statement: "Ao conduzir à noite em rua residencial e perceber pedestre caminhando pelo bordo da pista por falta de calçada, o que o condutor deve fazer?",
        options: ["Buzinar forte e manter a velocidade para alertar o pedestre da aproximação do carro.", "Manter farol alto sobre o pedestre e passar na mesma velocidade para enxergar melhor.", "Ultrapassar bem próximo ao pedestre para não invadir a faixa contrária da rua.", "Reduzir a velocidade, dar espaço lateral e ultrapassar o pedestre com segurança."],
        correctIndex: 3,
        explanation: "Reduzir e dar espaço protege quem anda no bordo; farol alto, buzina forte ou passar colado parecem alertar, mas ofuscam e assustam.",

        incidence: "alta",
        trap: true,
        difficulty: 2,
        group: "conduta-pedestres",
        origin: "ia"
    },
    {
        id: "cid_boa_13",
        category: "legislacao",
        statement: "Diante de gestante com criança no colo aguardando oportunidade para atravessar rua movimentada, qual conduta expressa cidadania no trânsito?",
        options: ["Seguir adiante, pois sem faixa próxima não há obrigação de parar para pedestres.", "Parar com segurança e ceder a passagem, facilitando a travessia da gestante.", "Buzinar e sinalizar com a mão para ela atravessar rápido entre os carros.", "Passar devagar sem parar, para que ela aguarde uma brecha maior no fluxo."],
        correctIndex: 1,
        explanation: "Parar e ceder protege quem tem mobilidade reduzida; buzinar ou passar devagar parecem gentis, mas transferem o risco para a gestante.",

        incidence: "alta",
        trap: true,
        difficulty: 2,
        group: "conduta-pedestres",
        origin: "ia"
    },
    {
        id: "cid_boa_14",
        category: "legislacao",
        statement: "Em cruzamento com grande fluxo de pedestres saindo de evento, mesmo com sinal verde para veículos, como deve proceder o condutor prudente?",
        options: ["Avançar devagar abrindo caminho entre os pedestres para não perder o verde.", "Buzinar e avançar, pois o sinal verde garante a passagem imediata dos veículos.", "Aguardar os pedestres liberarem a pista, avançando só quando houver segurança total.", "Acelerar com cuidado pelo espaço livre, dividindo a via com os pedestres."],
        correctIndex: 2,
        explanation: "Mesmo no verde, a segurança dos pedestres prevalece; avançar devagar ou buzinar parecem exercer o direito, mas forçam passagem perigosa.",
        legalBase: "Art. 214 do CTB",

        incidence: "alta",
        trap: true,
        difficulty: 3,
        group: "conduta-pedestres",
        origin: "ia"
    },
    {
        id: "cid_boa_15",
        category: "legislacao",
        statement: "Ao presenciar outro motorista avançando sobre a faixa e assustando pedestres, qual atitude cidadã o condutor consciente deve adotar na sequência?",
        options: ["Dar o bom exemplo, mantendo distância e parando para os pedestres atravessarem tranquilos.", "Buzinar e fazer gestos para repreender o outro motorista no meio do trânsito.", "Acelerar e agir da mesma forma para não ficar para trás no fluxo de veículos.", "Perseguir o veículo infrator para adverti-lo pessoalmente sobre a conduta errada."],
        correctIndex: 0,
        explanation: "O exemplo de parar acalma e protege; repreender com buzina ou imitar parecem justiça, mas geram conflito e novo risco.",

        incidence: "alta",
        trap: true,
        difficulty: 3,
        group: "conduta-pedestres",
        origin: "ia"
    },
    {
        id: "cid_boa_16",
        category: "legislacao",
        statement: "Trafegando em avenida com calçada estreita e pedestres disputando espaço com ambulantes, qual cuidado extra o motorista deve ter ao passar?",
        options: ["Manter a velocidade normal, pois os pedestres estão fora da pista de rolamento.", "Buzinar para os pedestres se apertarem contra as bancas e liberarem a via.", "Acelerar para deixar rapidamente o trecho de calçada congestionada para trás.", "Reduzir a velocidade e manter distância lateral, prevendo que alguém pise na pista."],
        correctIndex: 3,
        explanation: "Reduzir e dar espaço previne atropelamento se alguém cair na pista; buzinar ou manter a velocidade parecem suficientes, mas ignoram o risco.",

        incidence: "alta",
        trap: true,
        difficulty: 2,
        group: "conduta-pedestres",
        origin: "ia"
    },
    {
        id: "cid_boa_17",
        category: "legislacao",
        statement: "Ao aproximar-se de travessia de pedestres em frente a hospital com pessoas em cadeira de rodas, qual é a conduta mais adequada e solidária?",
        options: ["Passar devagar sem parar totalmente, para não reter o trânsito atrás do veículo.", "Parar totalmente antes da faixa e aguardar a travessia completa com paciência.", "Buzinar levemente para apressar o acompanhante e liberar logo a faixa.", "Acenar para passarem e seguir adiante antes que iniciem a travessia."],
        correctIndex: 1,
        explanation: "A parada total respeita o tempo maior de quem usa cadeira de rodas; passar devagar ou buzinar parecem ágeis, mas pressionam e ameaçam.",
        legalBase: "Art. 214 do CTB",

        incidence: "alta",
        trap: true,
        difficulty: 2,
        group: "conduta-pedestres",
        origin: "ia"
    },
    {
        id: "cid_boa_18",
        category: "legislacao",
        statement: "Em fila de veículos parados sobre faixa de pedestres em congestionamento urbano, o que o motorista deve fazer para respeitar quem atravessa a via?",
        options: ["Permanecer sobre a faixa se já entrou nela, pois voltar poderia causar colisão traseira.", "Avançar colado no carro da frente para liberar espaço para os veículos de trás.", "Evitar bloquear a faixa, parando antes dela e mantendo a passagem livre aos pedestres.", "Buzinar para os pedestres aguardarem, pois a fila já ocupou a faixa primeiro."],
        correctIndex: 2,
        explanation: "Não bloquear a faixa preserva a travessia; a pegadinha é achar que, uma vez sobre ela, permanecer é inevitável ou aceitável.",

        incidence: "alta",
        trap: true,
        difficulty: 3,
        group: "conduta-pedestres",
        origin: "ia"
    },
    {
        id: "cid_boa_19",
        category: "legislacao",
        statement: "Ao dar marcha à ré em estacionamento com pedestres circulando atrás do veículo, qual procedimento garante segurança e demonstra boa conduta?",
        options: ["Olhar retrovisores, olhar para trás e manobrar devagar somente com o caminho livre.", "Buzinar e dar ré imediatamente para avisar que o carro tem prioridade na manobra.", "Acelerar a ré para concluir rápido a manobra antes que cheguem mais pedestres.", "Confiar apenas na câmera de ré e continuar a manobra sem olhar ao redor."],
        correctIndex: 0,
        explanation: "Olhar, usar espelhos e ir devagar evitam atropelar; confiar só na câmera ou buzinar e ir parecem práticos, mas deixam pontos cegos.",

        incidence: "alta",
        trap: true,
        difficulty: 1,
        group: "conduta-pedestres",
        origin: "ia"
    },
    {
        id: "cid_boa_20",
        category: "legislacao",
        statement: "Quando criança desacompanhada demonstra intenção incerta de atravessar a rua correndo entre carros estacionados, qual deve ser a reação do condutor?",
        options: ["Buzinar para avisar presença e seguir, pois a criança deve aguardar na calçada.", "Passar devagar confiando que a criança vai parar ao ver o carro se aproximando.", "Acelerar para passar antes da criança e evitar freada brusca no meio da rua.", "Reduzir ou parar, redobrar a atenção e só avançar com total segurança sobre a ação dela."],
        correctIndex: 3,
        explanation: "Frear e observar cobre a imprevisibilidade infantil; buzinar ou passar devagar parecem suficientes, mas apostam no comportamento da criança.",

        incidence: "alta",
        trap: true,
        difficulty: 2,
        group: "conduta-pedestres",
        origin: "ia"
    },
    {
        id: "cid_boa_21",
        category: "legislacao",
        statement: "Em congestionamento intenso, o condutor educado que percebe o cruzamento bloqueado à frente deve adotar qual comportamento seguro?",
        options: ["Avançar mesmo com cruzamento fechado para não perder a vez no fluxo de veículos.", "Parar sobre a faixa de pedestres para garantir visibilidade e pressionar os demais.", "Aguardar antes do cruzamento, só avançando quando houver espaço para atravessá-lo.", "Buzinar continuamente e forçar passagem entre os veículos parados à frente."],
        correctIndex: 2,
        explanation: "O correto é não obstruir o cruzamento, aguardando espaço total para atravessar. Os distratores confundem ao sugerir ganhar tempo avançando ou pressionando.",

        incidence: "alta",
        trap: true,
        difficulty: 2,
        group: "conduta-condutores",
        origin: "ia"
    },
    {
        id: "cid_boa_22",
        category: "legislacao",
        statement: "Ao dirigir à noite e cruzar com outro veículo em sentido contrário, qual deve ser o procedimento correto quanto ao uso dos faróis?",
        options: ["Manter o farol alto ligado para enxergar melhor a pista escura à frente.", "Comutar para farol baixo ao cruzar, evitando ofuscar a visão do outro condutor.", "Apagar todos os faróis momentaneamente para sinalizar cordialidade no cruzamento.", "Alternar farol alto e baixo repetidamente para advertir o veículo contrário."],
        correctIndex: 1,
        explanation: "Deve-se usar farol baixo ao cruzar para não ofuscar. Manter alto para enxergar melhor é a pegadinha clássica que causa cegueira momentânea.",
        legalBase: "Art. 40 do CTB",

        incidence: "alta",
        trap: true,
        difficulty: 2,
        group: "conduta-condutores",
        origin: "ia"
    },
    {
        id: "cid_boa_23",
        category: "legislacao",
        statement: "Em fila lenta de veículos, um condutor gentil que deseja mudar de faixa para acessar uma saída deve agir de que maneira adequada?",
        options: ["Ligar a seta com antecedência, aguardar brecha segura e agradecer ao cederem passagem.", "Mudar bruscamente de faixa confiando que os outros frearão para evitar colisão.", "Buzinar insistentemente até que algum motorista assustado abra espaço na fila.", "Acelerar pelo acostamento e entrar no final da fila cortando a frente de todos."],
        correctIndex: 0,
        explanation: "Sinalizar cedo e aguardar brecha com cortesia é seguro. Os distratores parecem agilizar, mas geram risco e desrespeito à fila.",

        incidence: "alta",
        trap: true,
        difficulty: 2,
        group: "conduta-condutores",
        origin: "ia"
    },
    {
        id: "cid_boa_24",
        category: "legislacao",
        statement: "Durante chuva leve à noite, com outro carro se aproximando, manter o farol alto ligado pode causar qual consequência perigosa direta?",
        options: ["Melhora da própria visibilidade sem qualquer risco para o condutor contrário.", "Economia de bateria e maior durabilidade do sistema de iluminação do veículo.", "Redução da chuva sobre o para-brisa devido ao calor emitido pelos faróis altos.", "Ofuscamento da visão do outro motorista, aumentando o risco de colisão frontal."],
        correctIndex: 3,
        explanation: "Farol alto reflete na chuva e cega quem vem contra. A ideia de enxergar melhor confunde, mas o efeito real é ofuscamento perigoso.",
        legalBase: "Art. 40 do CTB",

        incidence: "alta",
        trap: true,
        difficulty: 2,
        group: "conduta-condutores",
        origin: "ia"
    },
    {
        id: "cid_boa_25",
        category: "legislacao",
        statement: "No trânsito parado, ouvir música em volume muito alto com janelas abertas demonstra qual tipo de comportamento inadequado evidente?",
        options: ["Uso eficiente do tempo livre sem interferir na atenção dos outros motoristas.", "Desrespeito à coletividade, pois o som excessivo perturba e irrita quem está por perto.", "Demonstração de cordialidade, pois anima os condutores estressados no congestionamento.", "Estratégia defensiva válida para manter-se acordado e atento ao fluxo parado."],
        correctIndex: 1,
        explanation: "Som abusivo perturba a convivência e tira a atenção. Parece inofensivo por ser lazer, mas configura falta de cordialidade e empatia.",

        incidence: "alta",
        trap: true,
        difficulty: 1,
        group: "conduta-condutores",
        origin: "ia"
    },
    {
        id: "cid_boa_26",
        category: "legislacao",
        statement: "Quando um motorista percebe que outro condutor sinalizou a intenção de ultrapassar, a atitude mais cordial e segura a adotar será qual?",
        options: ["Manter-se na faixa, reduzir levemente e facilitar a manobra com segurança.", "Acelerar para impedir a ultrapassagem e preservar a própria posição na via.", "Deslocar-se para a esquerda a fim de bloquear a passagem do veículo mais rápido.", "Buzinar longamente para intimidar quem tenta ultrapassar naquele trecho."],
        correctIndex: 0,
        explanation: "Facilitar a ultrapassagem mantendo trajetória e velocidade é cooperativo. Acelerar ou bloquear parecem defender posição, mas criam perigo.",

        incidence: "alta",
        trap: true,
        difficulty: 2,
        group: "conduta-condutores",
        origin: "ia"
    },
    {
        id: "cid_boa_27",
        category: "legislacao",
        statement: "Ao ser ultrapassado em rodovia de pista simples, o condutor que deseja colaborar com a segurança deve executar qual ação prudente?",
        options: ["Aumentar a velocidade para encurtar o tempo em que o outro fica na contramão.", "Manter-se à direita, sem acelerar, permitindo que o outro complete a manobra.", "Aproximar-se do veículo da frente para impedir que o outro retorne à faixa.", "Acionar o farol alto continuamente para alertar o condutor que ultrapassa."],
        correctIndex: 1,
        explanation: "Deve-se conservar posição à direita sem acelerar. A pegadinha é acelerar para ajudar, o que na verdade prolonga a exposição ao risco.",

        incidence: "alta",
        trap: true,
        difficulty: 2,
        group: "conduta-condutores",
        origin: "ia"
    },
    {
        id: "cid_boa_28",
        category: "legislacao",
        statement: "Em via urbana movimentada, buzinar de forma prolongada e repetida para apressar o veículo da frente indica qual conduta reprovável?",
        options: ["Uso correto da buzina como advertência preventiva para evitar colisão iminente.", "Comunicação cordial para despertar o condutor distraído diante do semáforo verde.", "Sinalização regulamentar para indicar preferência em cruzamento sem sinalização.", "Impaciência e desrespeito, pois a buzina não deve ser usada para pressionar ou punir."],
        correctIndex: 3,
        explanation: "Buzina prolongada para apressar é abuso e gera irritação. Confunde porque toque breve de advertência é permitido, mas pressão contínua não.",
        legalBase: "Art. 227 do CTB",

        incidence: "alta",
        trap: true,
        difficulty: 2,
        group: "conduta-condutores",
        origin: "ia"
    },
    {
        id: "cid_boa_29",
        category: "legislacao",
        statement: "Diante de um motociclista que trafega corretamente entre as faixas em baixa velocidade, a convivência harmoniosa exige qual atitude do motorista?",
        options: ["Fechar o espaço lateral para disciplinar o motociclista e mantê-lo atrás do fluxo.", "Manter distância lateral segura, sem jogar o carro para cima dele ou assustá-lo.", "Buzinar forte e continuamente para adverti-lo de que moto deve andar atrás.", "Abrir a porta ou deslocar-se bruscamente para impedir a passagem da motocicleta."],
        correctIndex: 1,
        explanation: "Respeitar o espaço do motociclista vulnerável é dever de convivência. Fechar ou buzinar para corrigir parecem defesa, mas são agressão e risco.",

        incidence: "alta",
        trap: true,
        difficulty: 3,
        group: "conduta-condutores",
        origin: "ia"
    },
    {
        id: "cid_boa_30",
        category: "legislacao",
        statement: "Ao avistar um ciclista circulando pelo bordo da pista em via sem ciclovia, o condutor prudente e respeitoso deve tomar qual cuidado?",
        options: ["Reduzir a velocidade, guardar distância lateral segura e só ultrapassar com segurança.", "Aproximar-se bem perto para passar rápido e evitar invadir a faixa contrária.", "Buzinar alto em cima do ciclista para avisá-lo e fazê-lo sair da pista.", "Ultrapassar colado e acelerar logo após para não atrasar o fluxo de veículos."],
        correctIndex: 0,
        explanation: "Proteger o ciclista com espaço e paciência é o certo. Passar colado para não invadir a contramão confunde, mas ameaça o mais vulnerável.",

        incidence: "alta",
        trap: true,
        difficulty: 2,
        group: "conduta-condutores",
        origin: "ia"
    },
    {
        id: "cid_boa_31",
        category: "legislacao",
        statement: "Em situação de retenção longa, com veículos parados em fila dupla, furar a fila pelo acostamento ou calçada caracteriza qual comportamento?",
        options: ["Habilidade esperta de condução que alivia o próprio atraso sem prejudicar ninguém.", "Manobra preventiva aceitável quando o motorista está atrasado para compromisso urgente.", "Falta de cidadania e desrespeito, pois leva vantagem injusta e põe outros em risco.", "Direito do condutor experiente que conhece atalhos e domina bem o veículo."],
        correctIndex: 2,
        explanation: "Furar fila pelo acostamento é egoísmo e infração que gera revolta. Parece esperteza para ganhar tempo, mas quebra a convivência e a segurança.",

        incidence: "alta",
        trap: true,
        difficulty: 2,
        group: "conduta-condutores",
        origin: "ia"
    },
    {
        id: "cid_boa_32",
        category: "legislacao",
        statement: "À noite, trafegando atrás de outro veículo a curta distância, o uso inadequado do farol alto provoca qual efeito negativo imediato?",
        options: ["Melhora a sinalização traseira do veículo da frente, facilitando sua condução.", "Aumenta o campo visual do motorista de trás sem afetar quem vai à frente.", "Permite que o veículo da frente economize bateria apagando suas lanternas.", "Ofusca pelo retrovisor o motorista da frente, reduzindo sua visibilidade e atenção."],
        correctIndex: 3,
        explanation: "Farol alto atrás reflete nos retrovisores e cega quem vai à frente. Parece que ilumina melhor, mas na prática tira a visão do outro condutor.",
        legalBase: "Art. 40 do CTB",

        incidence: "alta",
        trap: true,
        difficulty: 3,
        group: "conduta-condutores",
        origin: "ia"
    },
    {
        id: "cid_boa_33",
        category: "legislacao",
        statement: "Quando dois veículos chegam juntos a um estreitamento onde só passa um, a postura mais educada e segura para resolver o impasse é qual?",
        options: ["Reduzir, sinalizar e ceder a vez alternadamente, com gesto cordial ao outro.", "Avançar primeiro para garantir a vez, confiando na freada brusca do outro.", "Buzinar e piscar farol alto para impor preferência pela antiguidade na via.", "Enfileirar lado a lado e forçar passagem espremendo o outro contra o obstáculo."],
        correctIndex: 0,
        explanation: "Ceder alternadamente com comunicação cordial resolve sem conflito. Impor-se com buzina ou avanço confunde com firmeza, mas é agressividade.",

        incidence: "alta",
        trap: true,
        difficulty: 3,
        group: "conduta-condutores",
        origin: "ia"
    },
    {
        id: "cid_boa_34",
        category: "legislacao",
        statement: "Em estacionamento lotado, aguardar pacientemente a manobra de outro motorista sem pressioná-lo com buzina demonstra qual virtude essencial?",
        options: ["Falta de iniciativa, pois o condutor ágil deve buzinar para acelerar a liberação.", "Paciência e cortesia, evitando estresse e risco de colisão durante a manobra.", "Desatenção ao tempo, pois o trânsito exige pressionar para manter a fluidez.", "Excesso de passividade que incentiva a lentidão e o abuso dos demais motoristas."],
        correctIndex: 1,
        explanation: "Esperar sem pressionar evita erro e mostra respeito. Buzinar para agilizar parece eficiência, mas aumenta a tensão e o risco de batida.",

        incidence: "alta",
        trap: true,
        difficulty: 1,
        group: "conduta-condutores",
        origin: "ia"
    },
    {
        id: "cid_boa_35",
        category: "legislacao",
        statement: "Ao presenciar uma discussão agressiva entre condutores por causa de uma fechada involuntária, o terceiro condutor prudente deve agir como?",
        options: ["Parar no meio da via para filmar e incentivar a briga a fim de fazer justiça.", "Entrar na discussão tomando partido e revidando ofensas com xingamentos e buzina.", "Manter a calma, evitar envolvimento, seguir viagem e acionar ajuda se necessário.", "Fechar o agressor com o carro para ensinar-lhe uma lição de boas maneiras."],
        correctIndex: 2,
        explanation: "Não alimentar a agressividade e preservar a segurança é o certo. Intervir com revide parece justiça, mas amplia a violência no trânsito.",

        incidence: "alta",
        trap: true,
        difficulty: 2,
        group: "conduta-condutores",
        origin: "ia"
    },
    {
        id: "cid_boa_36",
        category: "legislacao",
        statement: "Trafegando em via de várias faixas, ocupar a faixa da esquerda em velocidade reduzida e ignorar os sinais de luz de outros indica qual falha?",
        options: ["Prudência exemplar, pois andar devagar na esquerda aumenta a segurança de todos.", "Direito absoluto de escolha de faixa, independentemente da velocidade ou do fluxo.", "Economia de combustível, pois a faixa esquerda é mais plana e exige menos esforço.", "Falta de cooperação, pois a esquerda deve ser liberada para quem vai mais rápido."],
        correctIndex: 3,
        explanation: "Trancar a esquerda lenta desrespeita o fluxo e provoca ultrapassagens arriscadas. Parece prudência andar devagar, mas é egoísmo que gera perigo.",

        incidence: "alta",
        trap: true,
        difficulty: 3,
        group: "conduta-condutores",
        origin: "ia"
    },
    {
        id: "cid_boa_37",
        category: "legislacao",
        statement: "Em cruzamento com pedestres e ciclistas aguardando, avançar fechando a passagem para garantir a própria vez revela qual atitude condenável?",
        options: ["Falta de cordialidade e egoísmo, pois impõe a própria passagem sobre o direito alheio.", "Direção defensiva correta, pois garantir a frente evita ser fechado pelos demais.", "Agilidade necessária para manter a fluidez em cruzamentos muito movimentados.", "Demonstração de habilidade, pois quem chega primeiro tem sempre a preferência."],
        correctIndex: 0,
        explanation: "Fechar o cruzamento é egoísmo que bloqueia todos. Avançar para garantir vez parece esperteza, mas viola convivência e trava o fluxo.",

        incidence: "alta",
        trap: true,
        difficulty: 2,
        group: "conduta-condutores",
        origin: "ia"
    },
    {
        id: "cid_boa_38",
        category: "legislacao",
        statement: "Durante uma ultrapassagem educada em rodovia, sinalizar com antecedência e retornar à faixa sem cortar o outro veículo demonstra qual valor?",
        options: ["Medo excessivo de dirigir, pois o bom motorista ultrapassa rápido sem avisar.", "Respeito e previsibilidade, permitindo que os demais ajustem velocidade e posição.", "Lentidão desnecessária, pois seta e distância apenas atrasam a manobra concluída.", "Exibicionismo ao volante, pois sinalizar demais confunde os outros condutores."],
        correctIndex: 1,
        explanation: "Sinalizar e dar espaço tornam a manobra previsível e gentil. Cortar para ser rápido confunde com perícia, mas é grosseria perigosa.",

        incidence: "alta",
        trap: true,
        difficulty: 2,
        group: "conduta-condutores",
        origin: "ia"
    },
    {
        id: "cid_boa_39",
        category: "legislacao",
        statement: "Ao ouvir a buzina breve de outro condutor como advertência em ponto cego, a reação mais adequada e cordial do motorista alertado será qual?",
        options: ["Responder com buzina longa e gestos para mostrar que percebeu o aviso recebido.", "Acelerar e mudar de faixa imediatamente para sair da frente do veículo que buzinou.", "Ignorar o aviso e manter a manobra, pois quem buzinou deve frear e aguardar.", "Verificar retrovisores, agradecer e ajustar posição mantendo a segurança da manobra."],
        correctIndex: 2,
        explanation: "Acertado é checar, agradecer e corrigir com calma. Revidar com buzina longa ou ignorar parecem firmeza, mas quebram a comunicação cordial.",

        incidence: "alta",
        trap: true,
        difficulty: 3,
        group: "conduta-condutores",
        origin: "ia"
    },
    {
        id: "cid_boa_40",
        category: "legislacao",
        statement: "Em bairro residencial à noite, acelerar com escapamento barulhento e usar buzina sem necessidade caracteriza qual tipo de conduta nociva?",
        options: ["Demonstração de potência do veículo que anima a vizinhança e alivia o estresse.", "Forma válida de alertar moradores sobre a presença do carro em rua escura.", "Comportamento de exibição que perturba o sossego e gera conflito na convivência.", "Estratégia de segurança para afastar pedestres e animais da pista de rolamento."],
        correctIndex: 2,
        explanation: "Barulho desnecessário à noite perturba o descanso e irrita. Parece alerta de segurança, mas é exibicionismo que fere a boa convivência.",

        incidence: "alta",
        trap: true,
        difficulty: 1,
        group: "conduta-condutores",
        origin: "ia"
    },
    {
        id: "cid_boa_41",
        category: "legislacao",
        statement: "Em rodovia movimentada, o condutor vê embalagens lançadas pela janela do carro à frente sujando a pista. Qual deve ser a sua conduta?",
        options: ["Jogar embalagens pela janela somente em rodovias vazias, pois em alta velocidade os resíduos se dispersam sem atingir outros veículos.", "Permitir o descarte de papéis biodegradáveis pela janela, porque esse material se decompõe rápido e não causa prejuízo ao ambiente.", "Guardar embalagens e garrafas dentro do veículo e descartá-las em lixeira apropriada, preservando limpeza, segurança e cidadania.", "Lançar objetos pela janela somente quando não houver pedestres por perto, já que o perigo existiria somente para quem caminha."],
        correctIndex: 2,
        explanation: "A conduta correta é guardar o lixo e descartar em local próprio, pois jogar objetos na via polui e cria risco. Os distratores confundem ao relativizar o ato pelo tipo de material ou pela ausência de pedestres.",

        incidence: "alta",
        trap: true,
        difficulty: 2,
        group: "cidadania-etica",
        origin: "ia"
    },
    {
        id: "cid_boa_42",
        category: "legislacao",
        statement: "Em shopping lotado, há livre só a vaga de idoso e o motorista pensa em ocupá-la por ser rapidinho. Qual a conduta cidadã correta?",
        options: ["Respeitar a vaga reservada e procurar outra vaga comum, compreendendo que a reserva garante dignidade e acessibilidade aos idosos.", "Ocupar a vaga reservada por poucos minutos, pois a rapidez da compra justificaria o uso emergencial sem credencial.", "Utilizar a vaga de idoso quando estiver livre, pois vaga vazia significaria ausência de prejuízo para qualquer pessoa.", "Estacionar na vaga reservada desde que deixe o pisca-alerta ligado, sinalizando aos demais que retornará rapidamente ao local."],
        correctIndex: 0,
        explanation: "O certo é não usar vaga reservada sem credencial, mesmo por pouco tempo, por respeito e inclusão. Os distratores usam a pegadinha do rapidinho e da vaga vazia para parecerem aceitáveis.",

        incidence: "alta",
        trap: true,
        difficulty: 2,
        group: "cidadania-etica",
        origin: "ia"
    },
    {
        id: "cid_boa_43",
        category: "legislacao",
        statement: "No semáforo fechado, o condutor responde mensagens no celular achando que parado não há risco. Qual a avaliação correta dessa conduta?",
        options: ["Responder mensagens no semáforo fechado, pois com o carro parado não haveria risco de colisão ou atropelamento.", "Manter o celular guardado e a atenção ao trânsito mesmo parado, pois a distração atrasa a partida e reduz a percepção de riscos.", "Usar o celular no semáforo se for resposta rápida, já que olhar por dois segundos não comprometeria a segurança de outras pessoas.", "Manusear o celular no sinal vermelho para adiantar o trabalho, pois a fiscalização só atuaria contra quem usa o aparelho em movimento."],
        correctIndex: 1,
        explanation: "Mesmo parado, usar o celular dispersa a atenção e prejudica a reação ao trânsito. Os distratores passam a ideia falsa de que parado não há risco ou de que resposta rápida é inofensiva.",

        incidence: "alta",
        trap: true,
        difficulty: 2,
        group: "cidadania-etica",
        origin: "ia"
    },
    {
        id: "cid_boa_44",
        category: "legislacao",
        statement: "Em fiscalização, o agente sinaliza para o motorista encostar, mas ele hesita em obedecer. Qual a conduta cidadã nesse caso?",
        options: ["Ignorar a ordem de parada se estiver com pressa, pois o agente compreenderia o atraso e liberaria o motorista sem abordagem.", "Hesitar e só encostar se houver viatura policial junto, porque a autoridade do agente sozinho seria insuficiente para exigir obediência.", "Seguir viagem e depois retornar se quiser, já que desobedecer à sinalização do agente seria falta sem consequência ética.", "Encostar o veículo prontamente e acatar as determinações do agente, reconhecendo sua autoridade para organizar e proteger o trânsito."],
        correctIndex: 3,
        explanation: "A atitude cidadã é obedecer prontamente ao agente, que tem autoridade para garantir a segurança. Os distratores sugerem que pressa ou dúvida sobre autoridade justificariam desobedecer.",

        incidence: "alta",
        trap: true,
        difficulty: 2,
        group: "cidadania-etica",
        origin: "ia"
    },
    {
        id: "cid_boa_45",
        category: "legislacao",
        statement: "Após arranhar o para-choque de outro carro na garagem do prédio, o condutor pensa em ir embora sem avisar. O que a cidadania exige?",
        options: ["Ir embora sem avisar, pois arranhões em garagem seriam normais e o dono do outro carro dificilmente perceberia o pequeno dano.", "Deixar bilhete com contato ou aguardar o proprietário para assumir o reparo, pois honestidade sustenta a convivência e a cidadania.", "Aguardar alguns minutos e sair se ninguém aparecer, porque a obrigação de reparar existiria somente quando houvesse testemunhas no local.", "Pagar o conserto somente se for cobrado depois, já que assumir espontaneamente traria prejuízo financeiro desnecessário ao causador."],
        correctIndex: 1,
        explanation: "O correto é identificar-se e assumir o dano, mesmo sem testemunhas. Os distratores confundem ao condicionar a honestidade à presença de testemunhas ou à cobrança posterior.",

        incidence: "alta",
        trap: true,
        difficulty: 2,
        group: "cidadania-etica",
        origin: "ia"
    },
    {
        id: "cid_boa_46",
        category: "legislacao",
        statement: "Em estacionamento de supermercado, um motorista encosta em outro veículo vazio e pensa em sair sem deixar recado. Qual a conduta ética?",
        options: ["Sair do local sem deixar contato, pois sem vítimas não haveria dever ético ou legal de identificar-se aos envolvidos.", "Deixar o carro como está e ir embora, alegando que o dono ausente deveria ter contratado seguro para cobrir esse tipo de prejuízo.", "Deixar bilhete com nome e telefone para ressarcir o dano, pois a ausência de testemunhas não autoriza conduta desonesta e omissa.", "Assumir o dano somente se câmeras registrarem a manobra, pois a responsabilidade dependeria da possibilidade de ser identificado."],
        correctIndex: 2,
        explanation: "A cidadania exige deixar contato e reparar o dano ainda que ninguém tenha visto. Os distratores exploram a ideia de que sem testemunhas, câmeras ou vítimas não há dever moral.",

        incidence: "alta",
        trap: true,
        difficulty: 3,
        group: "cidadania-etica",
        origin: "ia"
    },
    {
        id: "cid_boa_47",
        category: "legislacao",
        statement: "Ao se aproximar de blitz à noite, o condutor se irrita e reluta em apresentar documentos. Qual comportamento demonstra cidadania?",
        options: ["Manter a calma, tratar os fiscais com cordialidade e apresentar os documentos solicitados, colaborando para uma fiscalização rápida e segura.", "Reclamar da abordagem e demorar a entregar documentos, pois demonstrar irritação faria os fiscais liberarem o carro mais depressa.", "Negar-se a apresentar documentos até que expliquem o motivo da blitz, porque o condutor teria direito de escolher se colabora ou não.", "Buzinar e pressionar a fila a andar, pois blitz em horário de movimento seria abuso de autoridade que dispensaria respeito."],
        correctIndex: 0,
        explanation: "Respeitar a blitz e colaborar com educação agiliza a fiscalização e protege todos. Os distratores fazem parecer que reclamar ou pressionar seria um direito legítimo do cidadão.",

        incidence: "alta",
        trap: true,
        difficulty: 2,
        group: "cidadania-etica",
        origin: "ia"
    },
    {
        id: "cid_boa_48",
        category: "legislacao",
        statement: "Após uma cerveja no churrasco, o motorista se sente bem e quer dirigir com cuidado redobrado. Qual a decisão segura e cidadã?",
        options: ["Dirigir após beber se sentir-se bem, pois conhecer o próprio corpo permitiria compensar os efeitos do álcool com atenção redobrada.", "Assumir a direção após uma cerveja porque doses pequenas seriam eliminadas rapidamente e não afetariam reflexos e julgamento.", "Conduzir com cuidado após beber, desde que em trajeto curto e conhecido, pois o risco existiria somente em viagens longas e desconhecidas.", "Não dirigir após qualquer consumo de álcool e buscar carona ou transporte alternativo, pois o álcool compromete reflexos mesmo sem embriaguez aparente."],
        correctIndex: 3,
        explanation: "O comportamento seguro é não dirigir após beber, pois a sensação de bem-estar não garante reflexos intactos. Os distratores usam a falsa confiança no corpo e no trajeto curto.",

        incidence: "alta",
        trap: true,
        difficulty: 2,
        group: "cidadania-etica",
        origin: "ia"
    },
    {
        id: "cid_boa_49",
        category: "legislacao",
        statement: "Com crianças no banco traseiro, o pai fura o sinal vermelho e usa o celular, sem notar o exemplo negativo. Qual a conduta correta?",
        options: ["Aproveitar que crianças aprendem na escola e desrespeitar regras quando elas estão no carro, pois a teoria escolar compensaria o mau exemplo.", "Respeitar sinalização e não usar o celular ao volante, pois crianças tendem a imitar o comportamento dos pais no trânsito.", "Justificar a infração dizendo que foi por pressa, pois explicar o motivo ensinaria as crianças a ponderar quando descumprir a norma.", "Manter a infração se as crianças estiverem distraídas, pois o exemplo negativo só influenciaria quando elas estivessem prestando atenção."],
        correctIndex: 1,
        explanation: "Pais são referência e crianças repetem o que veem, por isso o exemplo deve ser de respeito. Os distratores minimizam o impacto alegando distração das crianças ou justificativa pela pressa.",

        incidence: "alta",
        trap: true,
        difficulty: 3,
        group: "cidadania-etica",
        origin: "ia"
    },
    {
        id: "cid_boa_50",
        category: "legislacao",
        statement: "Em conversão fechada, o motorista sobe no canteiro, danifica plantas e placas e vai embora sem comunicar. Qual o dever de cidadania?",
        options: ["Ir embora sem avisar, pois danos a canteiros e placas seriam de responsabilidade da prefeitura, sem dever moral para o motorista.", "Arcar com o prejuízo somente se houver punição, porque a ética no trânsito se resumiria a evitar penalidades previstas em lei.", "Sinalizar o local se possível e comunicar o dano às autoridades, assumindo a responsabilidade pela preservação do bem público.", "Considerar o fato sem importância por não haver vítimas, já que a cidadania no trânsito se aplicaria somente à proteção de pessoas."],
        correctIndex: 2,
        explanation: "Danos ao patrimônio público devem ser comunicados e assumidos pelo causador. Os distratores confundem ao dizer que só há dever ético com vítimas ou punição.",

        incidence: "alta",
        trap: true,
        difficulty: 2,
        group: "cidadania-etica",
        origin: "ia"
    },
    {
        id: "cid_boa_51",
        category: "legislacao",
        statement: "O passageiro quer jogar lata pela janela e o condutor permite, dizendo que a limpeza pública recolhe depois. Qual a orientação correta?",
        options: ["Orientar o passageiro a guardar a lata e descartá-la depois, pois permitir o ato torna o condutor corresponsável pela sujeira e pelo risco.", "Permitir o descarte porque a limpeza urbana recolheria depois, transferindo ao poder público um dever que é de cada cidadão.", "Autorizar jogar a lata em vias urbanas, pois em baixa velocidade o objeto não teria força para causar danos a outros usuários.", "Concordar com o passageiro para evitar discussão, já que a harmonia dentro do carro teria prioridade sobre a limpeza da via."],
        correctIndex: 0,
        explanation: "O condutor deve impedir o descarte e orientar o passageiro, pois cidadania é dever de todos. Os distratores terceirizam a responsabilidade para a limpeza pública ou para o conforto interno.",

        incidence: "alta",
        trap: true,
        difficulty: 2,
        group: "cidadania-etica",
        origin: "ia"
    },
    {
        id: "cid_boa_52",
        category: "legislacao",
        statement: "Sem credencial, a condutora usa vaga de PCD porque está vazia e perto da entrada. Qual a avaliação cidadã dessa conduta?",
        options: ["Usar a vaga de pessoa com deficiência quando estiver vazia, pois a ausência de usuários no momento eliminaria o desrespeito.", "Ocupar a vaga por ser perto da entrada, alegando necessidade momentânea que se equipararia às dificuldades enfrentadas por pessoas com deficiência.", "Estacionar na vaga reservada deixando um bilhete no painel, pois avisar sobre o retorno rápido legitimaria o uso sem credencial.", "Não utilizar a vaga reservada sem credencial e buscar vaga comum, respeitando o direito à acessibilidade e à cidadania inclusiva."],
        correctIndex: 3,
        explanation: "Vaga reservada exige credencial e não pode ser usada por conveniência, mesmo vazia. Os distratores usam proximidade, bilhete e vaga livre para legitimar o desrespeito.",

        incidence: "alta",
        trap: true,
        difficulty: 2,
        group: "cidadania-etica",
        origin: "ia"
    },
    {
        id: "cid_boa_53",
        category: "legislacao",
        statement: "No congestionamento, o motociclista pilota com uma mão e digita com a outra, confiante na habilidade. Qual a conduta segura?",
        options: ["Pilotar digitando mensagens se for habilidoso, pois a experiência na moto compensaria a falta de atenção momentânea ao trajeto.", "Parar em local seguro para usar o celular, pois pilotar com uma mão reduz o controle e impede reação rápida a imprevistos.", "Digitar no congestionamento porque em baixa velocidade haveria tempo suficiente para frear mesmo com atenção dividida.", "Usar o celular preso ao guidão para responder rápido, pois olhar por instantes não tiraria a visão geral do fluxo ao redor."],
        correctIndex: 1,
        explanation: "O correto é parar para usar o celular, pois a moto exige controle total e reação imediata. Os distratores vendem a falsa segurança da habilidade e da baixa velocidade.",

        incidence: "alta",
        trap: true,
        difficulty: 2,
        group: "cidadania-etica",
        origin: "ia"
    },
    {
        id: "cid_boa_54",
        category: "legislacao",
        statement: "Diante da ordem do agente para reduzir em trecho com obras, o motorista ignora por julgar exagerada. Qual a conduta cidadã?",
        options: ["Manter a velocidade por julgar a ordem exagerada, pois o motorista teria autonomia para avaliar o risco melhor que o agente no local.", "Obedecer somente se houver cones e operários visíveis, porque a palavra do agente sem evidência concreta poderia ser ignorada.", "Reduzir a velocidade conforme determinado, pois o agente possui visão do risco e sua ordem visa proteger trabalhadores e condutores.", "Acelerar para sair logo do trecho em obras, alegando que permanecer menos tempo sob risco seria mais seguro para todos."],
        correctIndex: 2,
        explanation: "A ordem do agente deve ser cumprida porque ele avalia riscos não visíveis ao condutor. Os distratores induzem a julgar a ordem como exagerada ou a condicioná-la a evidências.",

        incidence: "alta",
        trap: true,
        difficulty: 3,
        group: "cidadania-etica",
        origin: "ia"
    },
    {
        id: "cid_boa_55",
        category: "legislacao",
        statement: "Ao bater no retrovisor de carro parado no semáforo, o causador prefere fugir temendo custo e discussão. Qual o dever ético?",
        options: ["Parar em local seguro, identificar-se e assumir o reparo, pois fugir agrava a falta ética e demonstra desrespeito pelo patrimônio alheio.", "Fugir para evitar custo e discussão, já que pequenos danos no espelho seriam irrelevantes diante da pressa do dia a dia.", "Acelerar porque o outro carro estava parado, transferindo ao condutor parado a responsabilidade por estar no ponto de colisão.", "Ir embora se o trânsito estiver fluindo, pois interromper o fluxo para resolver dano leve causaria mais prejuízo coletivo."],
        correctIndex: 0,
        explanation: "Assumir o dano e identificar-se é dever ético, mesmo em prejuízo pequeno. Os distratores usam pressa, fluxo e custo para justificar a fuga como se fosse razoável.",

        incidence: "alta",
        trap: true,
        difficulty: 2,
        group: "cidadania-etica",
        origin: "ia"
    },
    {
        id: "cid_boa_56",
        category: "legislacao",
        statement: "Após colisão leve sem vítimas, o condutor combina mentir no relato à seguradora para levar vantagem. Qual a conduta honesta?",
        options: ["Combinar versão falsa para obter vantagem, pois sem vítimas a mentira não prejudicaria ninguém e beneficiaria ambos os envolvidos.", "Aceitar a fraude porque todos fariam o mesmo, alegando que honestidade só valeria quando houvesse fiscalização direta.", "Omitir detalhes no relato para aumentar a indenização, já que a seguradora teria recursos suficientes para absorver o prejuízo.", "Relatar os fatos com verdade e honestidade, pois fraudar o seguro é desonesto e corrompe a confiança necessária à convivência."],
        correctIndex: 3,
        explanation: "A honestidade exige relato verdadeiro mesmo sem vítimas, pois a fraude corrói a confiança coletiva. Os distratores normalizam a mentira por ausência de vítimas ou de fiscalização.",

        incidence: "alta",
        trap: true,
        difficulty: 3,
        group: "cidadania-etica",
        origin: "ia"
    },
    {
        id: "cid_boa_57",
        category: "legislacao",
        statement: "Em blitz da Lei Seca, o motorista se recusa a colaborar e ironiza os policiais. Qual comportamento demonstra cidadania?",
        options: ["Ironizar os agentes para descontrair, pois o humor durante a blitz demonstraria cidadania e facilitaria a abordagem policial.", "Recusar colaboração e incentivar outros a fazer o mesmo, porque resistir à fiscalização seria forma legítima de exercer cidadania.", "Colaborar com respeito, seguir as orientações e entender a blitz como proteção coletiva, não como perseguição ao motorista.", "Discutir e filmar para intimidar os fiscais, acreditando que pressioná-los garantiria tratamento privilegiado na fiscalização."],
        correctIndex: 2,
        explanation: "Respeitar e colaborar na blitz é cidadania, pois a fiscalização protege vidas. Os distratores disfarçam deboche e resistência como humor ou exercício de direitos.",

        incidence: "alta",
        trap: true,
        difficulty: 2,
        group: "cidadania-etica",
        origin: "ia"
    },
    {
        id: "cid_boa_58",
        category: "legislacao",
        statement: "Após vinho no jantar, a motorista diz que dose pequena não altera reflexos e quer dirigir. Qual a decisão segura?",
        options: ["Dirigir confiando na própria sensação, pois cada organismo reagiria de forma diferente e a autopercepção bastaria para garantir segurança.", "Evitar dirigir após beber vinho e optar por outro meio, pois mesmo pequenas doses afetam julgamento, atenção e tempo de reação.", "Assumir a direção se alimentar-se bem junto, porque comida neutralizaria totalmente os efeitos do álcool sobre a capacidade de dirigir.", "Conduzir devagar após dose pequena, pois velocidade reduzida eliminaria por completo a influência do álcool no organismo."],
        correctIndex: 1,
        explanation: "Mesmo doses pequenas prejudicam julgamento e reação, por isso não se deve dirigir. Os distratores criam mitos de que comida, lentidão ou sensação corporal anulariam o álcool.",

        incidence: "alta",
        trap: true,
        difficulty: 3,
        group: "cidadania-etica",
        origin: "ia"
    },
    {
        id: "cid_boa_59",
        category: "legislacao",
        statement: "Na saída da escola, a mãe estaciona na calçada e buzina sem parar, sem notar o exemplo às crianças. Qual a conduta exemplar?",
        options: ["Estacionar em local permitido sem bloquear a calçada e evitar buzina excessiva, dando às crianças exemplo de respeito e paciência.", "Parar sobre a calçada por rapidez, pois as crianças precisariam aprender que a pressa justificaria adaptar as regras às necessidades.", "Buzinar insistentemente para apressar alunos, já que demonstrar autoridade ensinaria as crianças a impor sua vontade no trânsito.", "Bloquear a passagem se for por pouco tempo, pois o transtorno momentâneo seria compensado pela agilidade no embarque dos estudantes."],
        correctIndex: 0,
        explanation: "O exemplo aos filhos exige estacionar certo e ser paciente, pois crianças imitam adultos. Os distratores tentam justificar calçada e buzina pela pressa ou brevidade.",

        incidence: "alta",
        trap: true,
        difficulty: 2,
        group: "cidadania-etica",
        origin: "ia"
    },
    {
        id: "cid_boa_60",
        category: "legislacao",
        statement: "Para encurtar caminho, o condutor derruba placa de sinalização e abandona o local. Qual o dever de cidadania após o dano?",
        options: ["Abandonar o local por ser bem público, transferindo ao Estado uma responsabilidade que também é do cidadão que causou o dano.", "Ignorar a placa caída por não haver vítimas, pois a ética no trânsito exigiria reparação somente quando pessoas fossem atingidas.", "Considerar o dano aceitável para encurtar caminho, já que a praticidade do trajeto teria mais valor que a sinalização danificada.", "Comunicar o ocorrido ao órgão responsável e assumir o reparo, pois preservar placas e sinalização é dever de cidadania e segurança."],
        correctIndex: 3,
        explanation: "Quem danifica bem público deve comunicar e reparar, pois placas garantem segurança de todos. Os distratores minimizam o fato por não haver vítimas ou por ser dever do Estado.",

        incidence: "alta",
        trap: true,
        difficulty: 2,
        group: "cidadania-etica",
        origin: "ia"
    },
    {
        id: "cid_boa_61",
        category: "legislacao",
        statement: "Um condutor acelera no amarelo para ganhar tempo mesmo vendo pedestres na faixa. Essa conduta caracteriza:",
        options: ["Imprudência, pois assume risco desnecessário por ação precipitada mesmo percebendo o perigo.", "Imperícia, pois demonstra falta de habilidade técnica para operar corretamente os comandos do veículo.", "Negligência, pois caracteriza omissão na manutenção preventiva obrigatória do veículo automotor.", "Prudência, pois aproveitar o amarelo evita parada brusca e mantém a fluidez do tráfego urbano."],
        correctIndex: 0,
        explanation: "É imprudência por agir com pressa assumindo risco consciente. Os distratores confundem ao trocar ação arriscada por falta técnica ou omissão.",

        incidence: "alta",
        trap: true,
        difficulty: 2,
        group: "perfil-condutor",
        origin: "ia"
    },
    {
        id: "cid_boa_62",
        category: "legislacao",
        statement: "Na descida íngreme de serra, o motorista desce em ponto morto e queima os freios por não usar o freio-motor. Isso caracteriza:",
        options: ["Imprudência, pois o motorista agiu com pressa e desrespeitou deliberadamente as normas de circulação.", "Imperícia, pois revela falta de conhecimento técnico para usar a marcha reduzida e o freio-motor.", "Negligência, pois indica descuido por não lavar o veículo e não portar os documentos obrigatórios.", "Prudência, pois descer em ponto morto economiza combustível e reduz o desgaste do motor."],
        correctIndex: 1,
        explanation: "É imperícia por falta de técnica e conhecimento no uso do freio-motor. A pegadinha é confundir inabilidade com pressa intencional ou economia de combustível.",

        incidence: "alta",
        trap: true,
        difficulty: 2,
        group: "perfil-condutor",
        origin: "ia"
    },
    {
        id: "cid_boa_63",
        category: "legislacao",
        statement: "O dono adia por meses a troca das pastilhas de freio gastas, mesmo ouvindo ruídos, e causa colisão traseira. Isso caracteriza:",
        options: ["Imprudência, pois freou bruscamente por excesso de velocidade em trecho com fiscalização eletrônica.", "Imperícia, pois não possui destreza para acionar o pedal de freio com a pressão adequada.", "Negligência, pois omitiu-se no dever de manutenção preventiva mesmo diante de sinais claros de desgaste.", "Habilidade defensiva, pois adiar a troca preserva peças originais e evita gastos desnecessários."],
        correctIndex: 2,
        explanation: "É negligência por omissão no dever de conservar o veículo. Os distratores confundem ao trocar omissão por excesso de velocidade ou falta de destreza.",

        incidence: "alta",
        trap: true,
        difficulty: 2,
        group: "perfil-condutor",
        origin: "ia"
    },
    {
        id: "cid_boa_64",
        category: "legislacao",
        statement: "Fechado no corredor, o motociclista irritado acelera para revidar e amplia o risco de conflito. Qual a atitude correta?",
        options: ["Ultrapassar imediatamente para impor respeito e ensinar o infrator a dividir corretamente a via.", "Buzinar insistentemente e colar no para-choque para pressionar o outro condutor a sair da frente.", "Acelerar para alcançar o veículo e gesticular, pois revidar intimida e evita novas fechadas.", "Manter a calma, reduzir a velocidade e afastar-se, evitando revidar a provocação sofrida."],
        correctIndex: 3,
        explanation: "O bom condutor não revida e se afasta para reduzir o conflito. Os distratores parecem certos por sugerir impor respeito, mas aumentam a violência.",

        incidence: "alta",
        trap: true,
        difficulty: 1,
        group: "perfil-condutor",
        origin: "ia"
    },
    {
        id: "cid_boa_65",
        category: "legislacao",
        statement: "Antes de viagem longa, o condutor verifica pneus, documentos, rota alternativa e prevê paradas. Essa atitude demonstra:",
        options: ["Planejamento prudente, pois inclui verificação do veículo, da rota e de pausas para descanso.", "Excesso de preocupação, pois planejar demais gera ansiedade e tira a atenção durante o trajeto.", "Confiança na experiência, pois em viagens longas basta resolver os imprevistos na hora.", "Descuido disfarçado, pois revisar pneus e documentos revela falta de confiança na própria capacidade."],
        correctIndex: 0,
        explanation: "Planejar rota, revisão e paradas é prudência e previsão. Os distratores confundem ao tratar prevenção como ansiedade ou improviso confiante.",

        incidence: "alta",
        trap: true,
        difficulty: 1,
        group: "perfil-condutor",
        origin: "ia"
    },
    {
        id: "cid_boa_66",
        category: "legislacao",
        statement: "Após noite mal dormida e horas ao volante sem pausa, o caminhoneiro boceja e mal abre os olhos. Esses sinais indicam:",
        options: ["Atenção plena, indicando que o condutor está alerta e apto a prolongar a viagem com segurança.", "Fadiga e sonolência, exigindo parada imediata em local seguro para descanso e recuperação.", "Reação ao ar-condicionado, que deve ser combatida apenas abrindo os vidros e aumentando o rádio.", "Efeitos passageiros que desaparecem sozinhos e dispensam qualquer pausa ou revezamento na direção."],
        correctIndex: 1,
        explanation: "Bocejos e olhos pesados são fadiga e exigem parar para descansar. Os distratores minimizam o risco ao sugerir rádio alto ou seguir viagem.",

        incidence: "alta",
        trap: true,
        difficulty: 2,
        group: "perfil-condutor",
        origin: "ia"
    },
    {
        id: "cid_boa_67",
        category: "legislacao",
        statement: "Em via urbana, o motorista observa retrovisores, pedestres nas calçadas e freadas à frente. Esse comportamento demonstra:",
        options: ["Atenção concentrada em ponto único, como fixar o olhar apenas no para-choque do carro à frente.", "Desatenção inevitável, pois é impossível acompanhar vários estímulos ao mesmo tempo no trânsito.", "Atenção difusa e preventiva, distribuindo o olhar entre retrovisores, pedestres e frenagens à frente.", "Imprudência por dispersão, pois observar retrovisores e calçadas aumenta o risco de colisão."],
        correctIndex: 2,
        explanation: "É atenção difusa, essencial para antecipar riscos simultâneos. Os distratores confundem ao dizer que observar tudo dispersa ou que é impossível.",

        incidence: "alta",
        trap: true,
        difficulty: 3,
        group: "perfil-condutor",
        origin: "ia"
    },
    {
        id: "cid_boa_68",
        category: "legislacao",
        statement: "Antes do trajeto diário, o condutor confere óleo, pneus, luzes e limpadores. Essa conferência demonstra:",
        options: ["Manutenção apenas após pane total, para economizar tempo e evitar revisões consideradas supérfluas.", "Conferência só do combustível, pois óleo, pneus e luzes exigem verificação apenas anual obrigatória.", "Espera pela luz do painel, pois checagens diárias desgastam peças e geram custo inútil e excessivo.", "Revisão preventiva como atitude, pois inspecionar antes de sair previne falhas mecânicas evitáveis."],
        correctIndex: 3,
        explanation: "Checar itens básicos antes de sair é revisão preventiva. Os distratores parecem econômicos, mas pregam só agir após a pane.",

        incidence: "alta",
        trap: true,
        difficulty: 2,
        group: "perfil-condutor",
        origin: "ia"
    },
    {
        id: "cid_boa_69",
        category: "legislacao",
        statement: "Com neblina intensa na rodovia, o motorista reduz, amplia a distância e liga o farol baixo. Essa atitude está:",
        options: ["Correta: reduzir a velocidade, ampliar a distância e usar farol baixo aumenta a segurança e a visibilidade.", "Errada: deve manter a velocidade e usar farol alto, pois a luz forte atravessa a neblina e afasta o sono.", "Errada: deve acelerar para sair logo da neblina e trafegar com pisca-alerta ligado em deslocamento.", "Errada: deve colar no veículo da frente e usar suas lanternas como guia, sem reduzir a velocidade."],
        correctIndex: 0,
        explanation: "Com neblina o correto é reduzir, espaçar e usar farol baixo. Farol alto e colar no outro parecem soluções, mas ofuscam e causam colisão.",

        incidence: "alta",
        trap: true,
        difficulty: 2,
        group: "perfil-condutor",
        origin: "ia"
    },
    {
        id: "cid_boa_70",
        category: "legislacao",
        statement: "Recém-habilitado assume caminhão carregado sem treinamento e mal controla o veículo. Essa conduta caracteriza:",
        options: ["Imprudência, pois conduziu à noite sem ligar os faróis para economizar a bateria do caminhão.", "Imperícia, pois assume veículo incompatível com sua prática e sem habilidade técnica necessária.", "Negligência, pois deixou de calibrar os pneus antes de iniciar uma viagem de curta distância.", "Prudência, pois aceitar novos desafios no trânsito acelera o aprendizado e mostra autoconfiança."],
        correctIndex: 1,
        explanation: "É imperícia por falta de habilitação técnica para aquele veículo. A pegadinha troca inaptidão por ousadia ou sugere que desafio gera aprendizado seguro.",

        incidence: "alta",
        trap: true,
        difficulty: 3,
        group: "perfil-condutor",
        origin: "ia"
    },
    {
        id: "cid_boa_71",
        category: "legislacao",
        statement: "Ao ver criança jogando bola na calçada próxima à pista, o condutor defensivo reduz preventivamente. Qual a atitude correta?",
        options: ["Acelerar para passar rápido pela criança, pois buzinar forte é suficiente para afastá-la da pista.", "Manter a velocidade, pois a criança está na calçada e a preferência é sempre do veículo automotor.", "Reduzir a velocidade e redobrar a atenção, prevendo que a bola ou a criança invada a pista.", "Desviar para a contramão sem olhar, pois qualquer manobra brusca evita o atropelamento iminente."],
        correctIndex: 2,
        explanation: "Prever que a criança corra para a rua é antecipação de risco. Os distratores confundem ao priorizar velocidade ou manobra brusca sem olhar.",

        incidence: "alta",
        trap: true,
        difficulty: 2,
        group: "perfil-condutor",
        origin: "ia"
    },
    {
        id: "cid_boa_72",
        category: "legislacao",
        statement: "Em engarrafamento longo sob calor, o condutor paciente mantém a calma e a distância segura. Essa atitude demonstra:",
        options: ["Reação rápida ao usar o acostamento para não se atrasar para o compromisso assumido.", "Habilidade ao colar no para-choque e trocar de faixa a todo instante para avançar no fluxo.", "Firmeza ao descer do veículo e discutir, pois exigir direitos alivia o estresse e organiza o trânsito.", "Paciência e controle emocional, mantendo a calma e evitando buzinas e manobras agressivas."],
        correctIndex: 3,
        explanation: "Manter distância e calma revela paciência do bom condutor. Os distratores parecem vantagem, mas acostamento e discussão elevam o risco.",

        incidence: "alta",
        trap: true,
        difficulty: 2,
        group: "perfil-condutor",
        origin: "ia"
    },
    {
        id: "cid_boa_73",
        category: "legislacao",
        statement: "Sob chuva forte à noite, o motorista avalia a pista e adia a ultrapassagem sem visibilidade. Qual a decisão correta?",
        options: ["Adiar a ultrapassagem até ter visibilidade e pista segura, priorizando a segurança sobre a pressa.", "Ultrapassar mesmo sem visibilidade, pois motorista experiente orienta-se apenas pelas faixas pintadas.", "Aumentar a velocidade na chuva para reduzir o tempo de exposição ao risco da pista molhada.", "Ultrapassar pelo acostamento, pois fora da pista há menos água e melhor aderência dos pneus."],
        correctIndex: 0,
        explanation: "Adiar a manobra sem visibilidade é decisão segura. Os distratores usam a falsa experiência e a pressa para justificar ultrapassagem perigosa.",

        incidence: "alta",
        trap: true,
        difficulty: 3,
        group: "perfil-condutor",
        origin: "ia"
    },
    {
        id: "cid_boa_74",
        category: "legislacao",
        statement: "O condutor entende que sua prudência protege ocupantes, pedestres, ciclistas e demais usuários. Esse entendimento revela:",
        options: ["Que a segurança depende só da fiscalização, cabendo obedecer apenas quando se é observado.", "Responsabilidade coletiva, pois sua prudência protege todos que compartilham a via pública.", "Que proteger pedestres é dever exclusivo do poder público, não dos condutores individuais.", "Que o cinto dispensa atenção aos demais, pois ocupantes do carro estão sempre totalmente seguros."],
        correctIndex: 1,
        explanation: "Bom condutor responde pela segurança de todos, não só dos ocupantes. Os distratores transferem o dever à fiscalização ou ao cinto.",

        incidence: "alta",
        trap: true,
        difficulty: 2,
        group: "perfil-condutor",
        origin: "ia"
    },
    {
        id: "cid_boa_75",
        category: "legislacao",
        statement: "Após dia estressante, o motorista irritado respira fundo antes de sair, sem levar a raiva para a direção. Isso demonstra:",
        options: ["Descarga necessária ao sair em alta velocidade para aliviar rapidamente a tensão do trabalho.", "Autoridade ao discutir no trânsito, pois revidar provocações preserva a autoestima do condutor.", "Controle emocional, pois irritação reduz a atenção e favorece decisões impulsivas e agressivas.", "Distração útil ao responder mensagens, pois ocupar a mente elimina rapidamente a raiva sentida."],
        correctIndex: 2,
        explanation: "Acalmar-se antes de dirigir evita que a raiva vire agressividade. Os distratores confundem ao tratar velocidade ou revide como alívio.",

        incidence: "alta",
        trap: true,
        difficulty: 2,
        group: "perfil-condutor",
        origin: "ia"
    },
    {
        id: "cid_boa_76",
        category: "legislacao",
        statement: "Motorista experiente diz dispensar revisão, ignorando pneus gastos e falhas nos freios. Essa afirmação revela:",
        options: ["Negligência e falsa confiança, pois experiência não substitui manutenção nem elimina o desgaste natural.", "Prudência avançada, pois motoristas experientes percebem falhas sem precisar de revisão periódica.", "Economia segura, pois evitar revisões frequentes preserva peças originais e reduz custos gerais.", "Simples imperícia, pois demonstra apenas falta de prática em manobras de estacionamento do veículo."],
        correctIndex: 0,
        explanation: "É negligência acreditar que experiência dispensa revisão. A pegadinha troca omissão por economia e confunde negligência com imperícia.",

        incidence: "alta",
        trap: true,
        difficulty: 3,
        group: "perfil-condutor",
        origin: "ia"
    },
    {
        id: "cid_boa_77",
        category: "legislacao",
        statement: "Com o semáforo verde há muito tempo, o condutor preventivo alivia o acelerador e cobre o freio. Essa atitude demonstra:",
        options: ["Pressa útil ao acelerar no verde, pois frear preventivamente provoca colisão traseira inevitável.", "Previsão e antecipação, aliviando o acelerador para evitar frenagem brusca na mudança de fase.", "Desatenção ao manter velocidade e olhar o celular, pois semáforos antigos demoram a mudar.", "Direito absoluto, pois o verde garante passagem livre e sem riscos para quem acelera forte."],
        correctIndex: 1,
        explanation: "Cobrir o freio antecipa o amarelo e evita parada brusca. Acelerar no verde tardio parece ganho de tempo, mas causa avanço de sinal.",

        incidence: "alta",
        trap: true,
        difficulty: 3,
        group: "perfil-condutor",
        origin: "ia"
    },
    {
        id: "cid_boa_78",
        category: "legislacao",
        statement: "Em viagem noturna monótona em estrada reta, o condutor alterna o olhar e faz pausas curtas. Essa atitude demonstra:",
        options: ["Foco único ao fixar o olhar em ponto fixo e seguir, pois pausas noturnas aumentam o perigo.", "Superação ao tomar só café forte e seguir sem parar, pois descanso é preciso apenas ao amanhecer.", "Combate à fadiga, alternando o foco visual e pausando para manter a concentração e o alerta.", "Estímulo pela velocidade, pois dirigir mais rápido mantém o cérebro sempre alerta e desperto."],
        correctIndex: 2,
        explanation: "Alternar o olhar e pausar combate monotonia e fadiga noturna. Café e velocidade parecem soluções, mas não substituem o descanso.",

        incidence: "alta",
        trap: true,
        difficulty: 2,
        group: "perfil-condutor",
        origin: "ia"
    },
    {
        id: "cid_boa_79",
        category: "legislacao",
        statement: "Em rua estreita com carros parados dos dois lados, o condutor reduz e observa frestas entre veículos. Isso demonstra:",
        options: ["Agilidade ao acelerar entre carros parados, pois velocidade maior reduz o tempo de exposição.", "Confiança ao dirigir pelo centro sem olhar laterais, pois pedestres devem aguardar fora da pista.", "Alerta sonoro ao buzinar sem reduzir, pois pedestres ouvem o som e evitam sair de repente.", "Antecipação de risco, observando frestas para prever a travessia repentina de pedestres ocultos."],
        correctIndex: 3,
        explanation: "Observar frestas e reduzir antecipa pedestres ocultos. Acelerar ou só buzinar parecem eficazes, mas impedem parar a tempo.",

        incidence: "alta",
        trap: true,
        difficulty: 2,
        group: "perfil-condutor",
        origin: "ia"
    },
    {
        id: "ext_placa_excecao_01",
        category: "placas",
        statement: "As placas de formato octogonal e de formato triangular invertido são exceções quanto à forma dentro de qual família de sinalização:",
        options: ["Placas de sinalização temporária, de fundo laranja e formato retangular.", "Placas de indicação, de fundo azul, verde ou marrom e formato retangular.", "Placas de regulamentação, cuja regra é o formato circular com borda vermelha.", "Placas de advertência, cujo padrão é o quadrado apoiado na ponta, em losango."],
        correctIndex: 2,
        explanation: "Correta C: R-1 (PARE, octogonal) e R-2 (Dê a Preferência, triângulo invertido) são as duas exceções da regulamentação, cujo padrão é circular.",
        detailedExplanation: "O octógono da R-1 e o triângulo invertido da R-2 permitem reconhecê-las até pelo verso. Advertência usa losango (não triângulo invertido); temporárias e indicação usam retângulo.",
        legalBase: "Anexo II do CTB",
        commonMistake: "Marcar advertência lembrando do triângulo — mas o padrão da advertência é o losango, não o triângulo invertido.",
        tip: "Octógono + triângulo invertido = regulamentação.",
        memoryHook: "Regra circular, exceção: PARE de 8 e preferência de ponta-cabeça.",
        incidence: "alta",
        trap: true,
        difficulty: 2,
        origin: "ia"
    },
    {
        id: "ext_cond_adv_via_01",
        category: "direcao-defensiva",
        statement: "Na doutrina de direção defensiva, aclives e declives íngremes são classificados como condições adversas:",
        options: ["Do veículo, como falhas mecânicas e falta de manutenção preventiva.", "Da via, como características do relevo e do traçado da pista.", "Do trânsito, como congestionamentos e comportamento de outros condutores.", "Do tempo, como chuva, neblina e ventos fortes sobre a pista."],
        correctIndex: 1,
        explanation: "Correta B: relevo (aclives, declives, curvas) é condição adversa da via; veículo é mecânica, tempo é clima.",
        detailedExplanation: "As condições adversas se dividem em: condutor, via (relevo, traçado, pavimento), veículo (mecânica), trânsito (fluxo, outros usuários), tempo (clima) e luz. Aclive e declive são do relevo, logo da via.",
        commonMistake: "Marcar tempo, lembrando de chuva em serra — mas o relevo em si é característica permanente da via, não do clima.",
        tip: "Relevo = via.",
        memoryHook: "Subiu e desceu, é da via que padeceu.",
        incidence: "alta",
        trap: true,
        difficulty: 2,
        origin: "ia"
    }
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
    "q_sinalizacao_sinistro_03",
    "detran_q29_n2",
    "q6",
    "qp64",
    "placa_r20_proibido_buzina_alta",
    "qe_alagamento_01",
    {
        id: "q3181",
        category: "legislacao",
        statement: "Em interseção entre rodovia e estrada, ambas abertas à circulação e sem sinalização de preferência, o condutor precisa definir quem deve passar primeiro. Pela regra geral do CTB, a preferência pertence a:",
        options: [
            "Ao veículo que trafega pela estrada, por se tratar de via de menor porte.",
            "Ao veículo que se aproxima pela direita do outro condutor.",
            "Ao veículo que trafega pela rodovia, nos termos da regra específica do CTB.",
            "Ao veículo que chegar primeiro e alertar o outro com toques de buzina."
        ],
        correctIndex: 2,
        explanation: "O CTB estabelece que em cruzamentos sem sinalização entre rodovias e estradas, o veículo que trafega pela rodovia tem preferência.",
        incidence: "alta",
        difficulty: 2
    },
    {
        id: "q3182",
        category: "legislacao",
        statement: "Dentro de rotatória no perímetro urbano, o condutor deve manter conduta compatível com a preferência legal e a fluidez do fluxo. A respeito do comportamento correto e obrigatório no anel viário, é correto afirmar:",
        options: [
            "Se o trânsito estiver lento, buzinar de forma contínua para apressar os veículos à frente.",
            "Mudar de faixa repetidamente para alcançar o destino no menor tempo possível.",
            "Manter-se na faixa adequada, em velocidade moderada, atento ao fluxo de veículos e pedestres.",
            "Dirigir sem considerar os demais veículos, pois o condutor já detém a preferência."
        ],
        correctIndex: 2,
        explanation: "Dentro da rotatória, o condutor deve manter-se na faixa adequada, em velocidade moderada, e atento ao fluxo de veículos e pedestres.",
        incidence: "alta",
        difficulty: 1
    },
    {
        id: "q3183",
        category: "legislacao",
        statement: "O fluxo de duas vias urbanas sem sinalização se cruza e nenhuma delas se classifica como rodovia ou possui rotatória. Pela regra geral de preferência de passagem prevista no Art. 29 do CTB, a prioridade pertence:",
        options: [
            "À ambulância, por se tratar de veículo de salvamento em qualquer hipótese.",
            "Ao veículo de maior peso, que não consegue parar com facilidade.",
            "Aos veículos de transporte coletivo de passageiros, em detrimento dos demais.",
            "Ao veículo que se aproxima pela direita do outro condutor, na ausência de rodovia ou rotatória."
        ],
        correctIndex: 3,
        explanation: "O CTB estabelece a preferência ao veículo que se aproximar pela direita do outro em cruzamentos sem sinalização, rodovias ou rotatórias.",
        incidence: "media",
        difficulty: 1
    },
    {
        id: "q3184",
        category: "infracoes",
        statement: "Durante o período de Permissão para Dirigir (PPD), o condutor recém-habilitado fica sujeito a restrições legais de conduta previstas no CTB. Enquanto perdurar essa fase probatória de um ano, ele NÃO pode:",
        options: [
            "Não pode dirigir nas avenidas movimentadas de grandes metrópoles, como São Paulo ou Rio de Janeiro.",
            "Não pode cometer infração grave ou gravíssima nem ser reincidente em infrações médias.",
            "Não pode transportar crianças menores de 10 anos no banco traseiro do carro, mesmo que elas estejam utilizando o dispositivo de retenção adequado.",
            "Não pode dirigir em rodovias federais com mais de três faixas de trânsito."
        ],
        correctIndex: 1,
        explanation: "Durante o período probatório, o novo condutor não pode cometer infração grave ou gravíssima nem ser reincidente em infrações médias.",
        incidence: "alta",
        difficulty: 2
    },
    {
        id: "q3185",
        category: "legislacao",
        statement: "Durante a execução de uma ultrapassagem em pista de rolamento de duplo sentido, o condutor deve observar as regras gerais de circulação e conduta do CTB. A respeito dessa manobra, a conduta correta é:",
        options: [
            "Pode exceder o limite de velocidade, lembrando que essa exceção é só durante a ultrapassagem.",
            "Deve realizar a manobra pela esquerda, respeitando a sinalização e a distância segura.",
            "Pode realizar a manobra pela direita sempre que julgar mais conveniente.",
            "Deve utilizar a buzina de forma obrigatória antes de toda ultrapassagem."
        ],
        correctIndex: 1,
        explanation: "A ultrapassagem deve ser realizada pela esquerda, respeitando a sinalização e a distância segura conforme o CTB.",
        incidence: "alta",
        difficulty: 1
    },
    {
        id: "q3201",
        category: "legislacao",
        statement: "O condutor circula dentro de rotatória quando percebe viatura policial se aproximando com os dispositivos luminoso e sonoro desligados. Conforme as regras gerais de preferência do CTB, a conduta correta do condutor é:",
        options: [
            "Parar e permitir a entrada da viatura, pois os veículos policiais têm prioridade mesmo com os dispositivos desligados.",
            "Parar para permitir a entrada da viatura, desde que isso não prejudique o fluxo de veículos.",
            "Seguir o fluxo normalmente, pois sem alarme e luzes a viatura não goza de prerrogativa de passagem.",
            "Parar ou seguir, conforme o motorista decidir no momento, sem regra aplicável."
        ],
        correctIndex: 2,
        explanation: "Viaturas policiais só têm prerrogativa de passagem com os dispositivos luminosos e sonoros LIGADOS. Desligados, não têm prioridade.",
        incidence: "alta",
        difficulty: 2
    },
    {
        id: "q3202",
        category: "legislacao",
        statement: "Em via urbana com várias faixas de trânsito no mesmo sentido de circulação, sem faixa exclusiva regulamentada para motocicletas, o CTB determina onde esses veículos devem trafegar. A conduta correta é:",
        options: [
            "Em qualquer faixa, evitando posicionar-se nos pontos cegos dos demais condutores.",
            "Somente na faixa da esquerda, por serem veículos de maior velocidade.",
            "Sobre a linha divisória entre as faixas, nos chamados corredores entre veículos.",
            "Somente no corredor entre veículos, em alta velocidade, aproveitando a potência."
        ],
        correctIndex: 0,
        explanation: "Motocicletas podem circular em qualquer faixa, desde que evitem os pontos cegos de outros condutores.",
        incidence: "media",
        difficulty: 1
    },
    {
        id: "q3203",
        category: "legislacao",
        statement: "Pelas normas gerais de circulação e conduta do CTB, aplicáveis a toda via terrestre aberta à circulação pública no território nacional, o veículo automotor deve trafegar obrigatoriamente pelo lado da via:",
        options: [
            "Esquerdo, por corresponder ao sentido de trânsito mais rápido.",
            "Qualquer da via, desde que respeitada a velocidade máxima permitida.",
            "Direito da via, salvo sinalização diversa do órgão competente.",
            "Meio da pista, para garantir maior visibilidade aos demais usuários."
        ],
        correctIndex: 2,
        explanation: "O CTB estabelece que o veículo deve trafegar pelo lado direito da via, salvo sinalização em contrário.",
        incidence: "altissima",
        difficulty: 1
    },
    {
        id: "q3204",
        category: "legislacao",
        statement: "Em via com várias faixas de trânsito no mesmo sentido, sem faixa exclusiva determinada, o CTB determina a posição dos veículos grandes e de baixa velocidade. De acordo com essa regra de posicionamento, esses veículos devem:",
        options: [
            "Circular preferencialmente pela faixa da esquerda.",
            "Transitar pelo acostamento para aumentar a fluidez do fluxo.",
            "Alternar-se de faixa continuamente durante o trajeto.",
            "Circular pela faixa da direita, reservando-se a esquerda à ultrapassagem."
        ],
        correctIndex: 3,
        explanation: "Veículos grandes e lentos devem circular na faixa da direita para não impedir o fluxo mais rápido.",
        incidence: "media",
        difficulty: 1
    },
    {
        id: "q3205",
        category: "legislacao",
        statement: "Conforme o CTB, a imobilização do veículo por tempo superior ao necessário para o embarque e o desembarque de passageiros submete-se a classificação específica. Nessa hipótese, conforme a definição legal, o veículo está:",
        options: [
            "Em imobilização de emergência, admitida por motivo de força maior.",
            "Apenas parado, sem qualquer responsabilidade do condutor.",
            "Parado ou estacionado, conforme a opção do condutor no momento.",
            "Estacionado, nos termos da definição legal do CTB."
        ],
        correctIndex: 3,
        explanation: "O CTB diferencia parado (temporariamente, para embarque/desembarque) de estacionado (tempo superior ao necessário).",
        incidence: "media",
        difficulty: 2
    },
    {
        id: "q3206",
        category: "placas",
        statement: "No perímetro urbano, a administração viária implantou faixa de pedestres elevada em frente à escola, alterando o nível da pista de rolamento em relação ao acostamento. A finalidade atribuída a essa instalação viária é:",
        options: [
            "Impor redução de velocidade aos veículos e assegurar travessia segura do pedestre.",
            "Facilitar manobras de ultrapassagem em trechos de elevado fluxo de veículos.",
            "Gerar impacto à circulação de veículos no entorno de estabelecimentos escolares.",
            "Reservar área para embarque e desembarque temporário em frente às escolas."
        ],
        correctIndex: 0,
        explanation: "A faixa de pedestres elevada (zebra crossing elevada) serve para forçar redução de velocidade e dar prioridade segura ao pedestre.",
        incidence: "alta",
        difficulty: 1
    },
    {
        id: "q3207",
        category: "placas",
        statement: "O condutor transita em via urbana com fluxo intenso e se aproxima de faixa de travessia de pedestres com pessoas aguardando no acostamento. Pelo CTB, ao enxergar a sinalização horizontal de travessia, a conduta exigida é:",
        options: [
            "Acelerar para esvaziar a interseção e liberar a travessia com mais fluidez.",
            "Imobilizar o veículo sobre a faixa, obstruindo a travessia do pedestre.",
            "Reduzir a velocidade, imobilizar o veículo antes da faixa e conceder a travessia ao pedestre.",
            "Acionar a buzina sucessivamente para apressar a travessia do pedestre."
        ],
        correctIndex: 2,
        explanation: "O condutor deve reduzir a velocidade e parar dando preferência ao pedestre ao enxergar uma faixa de pedestres.",
        incidence: "altissima",
        difficulty: 1
    },
    {
        id: "q3208",
        category: "legislacao",
        statement: "A pista de rolamento possui faixa exclusiva destinada ao transporte público coletivo (ônibus), sinalizada no perímetro urbano. Pelo CTB, a respeito do uso dessa faixa por outros veículos, é correto afirmar:",
        options: [
            "Não podem ser utilizadas por outros veículos nos dias e horários fixados pela sinalização.",
            "Podem ser usadas para ultrapassar veículos mais lentos em horários de pico.",
            "Nunca podem ser utilizadas por outros veículos, mesmo fora dos horários da sinalização.",
            "Destinam-se exclusivamente ao transporte escolar."
        ],
        correctIndex: 0,
        explanation: "As faixas exclusivas de ônibus só podem ser utilizadas por veículos de transporte público nos dias e horários estabelecidos.",
        incidence: "media",
        difficulty: 1
    },
    {
        id: "q3209",
        category: "legislacao",
        statement: "Em frente a escola municipal, no período de entrada e saída de alunos, o condutor permanece imobilizado em fila dupla na pista de rolamento para embarque. Pelo CTB, essa conduta de trânsito é classificada como:",
        options: [
            "Perigosa, prejudica a fluidez do trânsito e constitui infração de natureza média.",
            "Permitida em horários de pico, para dar agilidade à saída dos alunos.",
            "Obstrutiva, mas sem configuração de infração nem risco à segurança.",
            "Permitida com o pisca-alerta aceso, desde que não exceda dois minutos."
        ],
        correctIndex: 0,
        explanation: "Filha dupla para embarcar alunos é perigosa, prejudica a fluidez e constitui infração média.",
        incidence: "alta",
        difficulty: 1
    },
    {
        id: "q3210",
        category: "legislacao",
        statement: "A condutora de motocicleta trafega pela pista de rolamento de via urbana e encontra ônibus imobilizado à frente, ocupando a faixa. Pela direção defensiva e pelas normas gerais do CTB, a conduta correta da condutora é:",
        options: [
            "Passar pela direita, rente ao ônibus, para não obstruir o fluxo.",
            "Ziguezaguear entre os veículos, mantendo equilíbrio e cautela.",
            "Transitar sobre a calçada, desviando dos pedestres com atenção.",
            "Aguardar a saída do ônibus ou ultrapassá-lo pela esquerda com segurança."
        ],
        correctIndex: 3,
        explanation: "Ao encontrar um ônibus parado, o motociclista deve esperar o ônibus sair ou ultrapassar pela esquerda com cuidado.",
        incidence: "media",
        difficulty: 2
    }
];
export function getRealExamQuestions(): Question[] {
    // Pool validado "Prova Real": resolve os ids string para QUESTIONS e
    // inclui os objetos inline, sem duplicar. Usado no modo Prova Real
    // (e na inclusão forçada do completo).
    const byId = new Map(getQuestionBank().map((q) => [q.id, q]));
    const out: Question[] = [];
    const seen = new Set<string>();
    for (const entry of REAL_EXAM_IDS) {
        const q = typeof entry === "string" ? byId.get(entry) : (entry as Question);
        if (q && q.id && !seen.has(q.id)) {
            seen.add(q.id);
            out.push(q);
        }
    }
    return out;
}

// ---------------------------------------------------------------------------
// Banco mesclado (super admin): edições/criações/exclusões feitas no painel
// vivem na tabela `question_overrides` e são aplicadas sobre QUESTIONS em
// tempo de execução. Sem linhas carregadas, vale o banco estático.
// Linha customizada = id com prefixo "custom-" + objeto completo em `data`.
// Linha de questão estática = patch parcial em `data` e/ou `disabled`.
// ---------------------------------------------------------------------------
export interface QuestionOverrideRow {
    id: string;
    data: Partial<Question>;
    disabled: boolean;
}

let overridePatch = new Map<string, Partial<Question>>();
let overrideDisabled = new Set<string>();
let overrideCustoms: Question[] = [];

export function setQuestionOverrides(rows: QuestionOverrideRow[]): void {
    overridePatch = new Map();
    overrideDisabled = new Set();
    overrideCustoms = [];
    for (const r of rows || []) {
        if (!r || typeof r.id !== "string") continue;
        if (r.disabled) overrideDisabled.add(r.id);
        if (r.id.startsWith("custom-") && r.data && typeof r.data.statement === "string" && Array.isArray((r.data as Question).options)) {
            overrideCustoms.push({ ...(r.data as Question), id: r.id });
        } else if (r.data && typeof r.data === "object") {
            overridePatch.set(r.id, r.data);
        }
    }
}

export async function loadQuestionOverrides(): Promise<void> {
    try {
        const { data } = await (supabase as any)
            .from("question_overrides")
            .select("id, data, disabled");
        if (Array.isArray(data)) setQuestionOverrides(data as QuestionOverrideRow[]);
    } catch {
        // Sem acesso (tabela ausente/offline): mantém o banco estático.
    }
}

/** Banco efetivo usado por todos os sorteios: estático + overrides do admin. */
export function getQuestionBank(): Question[] {
    return QUESTIONS.filter((q) => !overrideDisabled.has(q.id))
        .map((q) => {
            const p = overridePatch.get(q.id);
            return p ? { ...q, ...p, id: q.id } : q;
        })
        .concat(overrideCustoms.filter((c) => !overrideDisabled.has(c.id)));
}

export function getRandomizedQuestions(count: number, opts?: {
    categories?: Category[];
    seed?: number;
    exclude?: string[];
    placasCount?: number;
    questionsList?: Question[];
}): Question[] {
    let pool = opts?.questionsList || getQuestionBank();
    if (opts?.categories?.length) {
        pool = pool.filter((q) => opts.categories!.includes(q.category));
    }
    if (opts?.exclude?.length) {
        const ex = new Set(opts.exclude);
        pool = pool.filter((q) => !ex.has(q.id));
        // NÃO adiciona perguntas já vistas de volta — evita repetição
        // Se o pool ficaria vazio, mantém o original mas marca que são todas vistas
    }
    // Modo simulado: 3 placas + (count-3) demais categorias
    if (opts?.placasCount && opts.placasCount > 0 && !opts.categories?.length) {
        const placasPool = pool.filter((q) => q.category === "placas");
        const restPool = pool.filter((q) => q.category !== "placas");
        const pickWeighted = (arr: Question[], n: number) => arr
            .map((q) => ({
            q,
            s: Math.random() *
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
        score: Math.random() *
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
    // GABARITO POR IDENTIFICADOR (nunca por posição/letra):
    // cada alternativa tem um id interno permanente (questão + posição
    // original no banco). A resposta correta é o ID da alternativa certa;
    // após embaralhar, o correctIndex é recalculado para a nova posição
    // desse ID. A randomização muda só a ordem visual (A/B/C/D).
    const ids = q.options.map((_, i) => `${q.id}#${i}`);
    const correctId = `${q.id}#${q.correctIndex}`;
    const order = ids.map((_, i) => i);
    for (let i = order.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [order[i], order[j]] = [order[j], order[i]];
    }
    const newOptions = order.map((i) => q.options[i]);
    const newIds = order.map((i) => ids[i]);
    const newCorrect = newIds.indexOf(correctId);
    // Validação automática antes de finalizar: o gabarito deve apontar para
    // o conteúdo correto original, em qualquer posição que ele tenha caído.
    if (newCorrect < 0 || newOptions[newCorrect] !== q.options[q.correctIndex]) {
        console.error(`[gabarito] dessincronia em ${q.id}: mantida a ordem original.`);
        return { ...q };
    }
    return { ...q, options: newOptions, correctIndex: newCorrect };
}

// ---------------------------------------------------------------------------
// Simulado balanceado por dificuldade (proporção 20/15/65)
//   difficulty 3 (pegadinhas): 20%  -> 6 de 30
//   difficulty 2 (difíceis)  : 15%  -> 5 de 30
//   difficulty 1 (fáceis)    : 65%  -> 19 de 30
// Fallback: se faltar questão em algum nível, completa com as disponíveis.
// ---------------------------------------------------------------------------
export interface BalancedOptions {
    categories?: Category[];
    exclude?: string[];
    questionsList?: Question[];
    total?: number;
}

export function getBalancedQuestions(opts?: BalancedOptions): Question[] {
    const total = opts?.total ?? 30;
    let pool = opts?.questionsList ? [...opts.questionsList] : getQuestionBank();

    if (opts?.categories?.length) {
        pool = pool.filter((q) => opts.categories!.includes(q.category));
    }
    if (opts?.exclude?.length) {
        const ex = new Set(opts.exclude);
        pool = pool.filter((q) => !ex.has(q.id));
    }

    const n3 = Math.round(total * 0.2); // 6
    const n2 = Math.round(total * 0.15); // 5
    const n1 = total - n3 - n2; // 19

    const pickFromLevel = (level: 1 | 2 | 3, n: number): Question[] => {
        const arr = pool.filter(
            (q) => q.difficulty === level && (!q.group || !usedGroups.has(q.group)),
        );
        const shuffled = [...arr].sort(() => Math.random() - 0.5);
        const picked = shuffled.slice(0, n);
        picked.forEach((q) => {
            if (q.group) usedGroups.add(q.group);
        });
        return picked;
    };

    const usedGroups = new Set<string>();

    let selected: Question[] = [
        ...pickFromLevel(3, n3),
        ...pickFromLevel(2, n2),
        ...pickFromLevel(1, n1),
    ];

    // Fallback: se faltou questão em algum nível, completa com as disponíveis.
    const usedIds = new Set(selected.map((q) => q.id));
    if (selected.length < total) {
        const rest = pool
            .filter((q) => !usedIds.has(q.id) && (!q.group || !usedGroups.has(q.group)))
            .sort(() => Math.random() - 0.5);
        selected = [...selected, ...rest].slice(0, total);
    }

    // Embaralha a ordem final para não ficar agrupado por nível
    // e embaralha as alternativas (A, B, C, D) com o gabarito atualizado
    return selected.sort(() => Math.random() - 0.5).map(shuffleOptions);
}

// ---------------------------------------------------------------------------
// Simulado geral: proporção fixa por nível de dificuldade (o que importa é a
// dificuldade, não o flag de pegadinha).
//   15% nível 3 (com ou sem pegadinha)
//   20% pegadinhas nível 2 (difficulty 2 + trap)
//   65% mistura de médias (nível 2) e fáceis (nível 1)
// Prioriza rotação (questões ainda não vistas) e questões da prova real.
// Nunca sorteia duas variações do mesmo tema (group) na mesma prova.
// ---------------------------------------------------------------------------
export interface GeneralSimuladoOptions {
    exclude?: string[];
    total?: number;
    realIds?: string[];
}

export function getGeneralSimuladoQuestions(opts?: GeneralSimuladoOptions): Question[] {
    const total = opts?.total ?? 30;
    const ex = new Set(opts?.exclude ?? []);
    const reals = new Set(opts?.realIds ?? []);

    const nLevel3 = Math.round(total * 0.15);
    const nLevel2Trap = Math.round(total * 0.2);
    const nRest = total - nLevel3 - nLevel2Trap;

    const used = new Set<string>();
    const usedGroups = new Set<string>();
    const collect = (qs: Question[]) => {
        qs.forEach((q) => {
            used.add(q.id);
            if (q.group) usedGroups.add(q.group);
        });
    };
    // Modo normal: só questões ainda não vistas (exclude). allowSeen=true libera
    // reusar vistas — usado apenas quando o banco inteiro de inéditas esgotar.
    const draw = (arr: Question[], n: number, allowSeen: boolean): Question[] =>
        [...arr]
            .filter(
                (q) =>
                    (allowSeen || !ex.has(q.id)) &&
                    !used.has(q.id) &&
                    (!q.group || !usedGroups.has(q.group)),
            )
            .map((q) => ({
                q,
                priority: allowSeen && ex.has(q.id) ? 2 : reals.has(q.id) ? 0 : 1,
                rnd: Math.random(),
            }))
            .sort((a, b) => a.priority - b.priority || a.rnd - b.rnd)
            .slice(0, Math.min(n, arr.length))
            .map((x) => x.q);

    const level3Pool = getQuestionBank().filter((q) => q.difficulty === 3);
    const level2TrapPool = getQuestionBank().filter((q) => q.difficulty === 2 && q.trap);
    const restPool = getQuestionBank().filter((q) => q.difficulty === 1 || q.difficulty === 2);

    // 1) 15% mais difíceis (nível 3, com ou sem pegadinha)
    const level3Picked = draw(level3Pool, nLevel3, false);
    collect(level3Picked);
    // 2) 20% difíceis com pegadinha (nível 2)
    const level2TrapPicked = draw(level2TrapPool, nLevel2Trap, false);
    collect(level2TrapPicked);
    // 3) 65% restante: mistura de médias (nível 2) e fáceis (nível 1)
    const restPicked = draw(restPool, nRest, false);
    collect(restPicked);

    let selected: Question[] = [...level3Picked, ...level2TrapPicked, ...restPicked];

    // Se alguma cota secou (sem inéditas suficientes), abandona a cota e completa
    // com qualquer questão ainda não vista do banco inteiro.
    if (selected.length < total) {
        const fallback = getQuestionBank().filter((q) => !used.has(q.id));
        let extra = draw(fallback, total - selected.length, false);
        // Último recurso: banco inteiro de inéditas esgotado -> reusa vistas.
        if (extra.length + selected.length < total) {
            const reused = draw(fallback, total - selected.length - extra.length, true);
            extra = [...extra, ...reused];
        }
        selected = [...selected, ...extra];
    }

    // Embaralha a ordem final para misturar os níveis
    selected.sort(() => Math.random() - 0.5);
    return selected.map(shuffleOptions);
}

// ---------------------------------------------------------------------------
// Simulado oficial DETRAN: 30 questões, mínimo 20 acertos (66,7%).
// Distribuição fixa por categoria (chaves = rótulos exibidos na tela de
// desempenho, os mesmos de CATEGORY_LABELS), nos blocos do relatório oficial:
//   Cuidar, Agir e Preservar .... Primeiros Socorros 4 + Meio Ambiente 2 = 6
//   Escolhas e Consequências ..... Infrações 5 + Legislação 4 = 9
//   Na Direção da Segurança ...... Direção Defensiva 5 + Mecânica Básica 4 = 9
//   Placas, Cores e Caminhos ..... Placas 4 + Prioridade de Passagem 2 = 6
//   Mecânica Básica ........... 7
//   Direção Defensiva ......... 7
//   Primeiros Socorros ........ 5
//   Legislação ................ 3
//   Infrações ................. 2
//   Placas .................... 2
//   Prioridade de Passagem .... 2
//   Meio Ambiente ............. 2
// Mescla de 5 a 8 questões do lote oficial (detran_*) em todo sorteio.
// Respeita a exclusão de vistas, nunca repete id nem variação do mesmo
// tema (group) na mesma prova e pondera por incidência/dificuldade.
// ---------------------------------------------------------------------------
export const OFFICIAL_EXAM_TOTAL = 30;
export const OFFICIAL_EXAM_PASS_SCORE = 20;
export const OFFICIAL_EXAM_DETRAN_MIN = 5;
export const OFFICIAL_EXAM_DETRAN_MAX = 8;
// Mínimo de questões de nível difícil (difficulty 3) por prova: 11 de 30.
export const OFFICIAL_EXAM_HARD_MIN = 11;
export const DISTRIBUICAO_SIMULADO: Record<string, number> = {
    // Bloco: Cuidar, Agir e Preservar (6 questões)
    'Primeiros Socorros': 4,
    'Meio Ambiente': 2,

    // Bloco: Escolhas e Consequências (9 questões)
    'Infrações': 5,
    'Legislação': 4,

    // Bloco: Na Direção da Segurança (9 questões)
    'Direção Defensiva': 5,
    'Mecânica Básica': 4,

    // Bloco: Placas, Cores e Caminhos (6 questões)
    'Placas': 4,
    'Prioridade de Passagem': 2,
};
const CATEGORY_BY_LABEL: Record<string, Category> = Object.fromEntries(
    Object.entries(CATEGORY_LABELS).map(([cat, label]) => [label, cat]),
) as Record<string, Category>;
export const OFFICIAL_EXAM_DISTRIBUTION: { category: Category; count: number }[] =
    Object.entries(DISTRIBUICAO_SIMULADO).map(([label, count]) => ({
        category: CATEGORY_BY_LABEL[label],
        count,
    }));

export interface OfficialSimuladoOptions {
    exclude?: string[];
    questionsList?: Question[];
    detranMin?: number;
    detranMax?: number;
}

export function getOfficialSimuladoQuestions(opts?: OfficialSimuladoOptions): Question[] {
    const total = OFFICIAL_EXAM_DISTRIBUTION.reduce((acc, d) => acc + d.count, 0);
    const ex = new Set(opts?.exclude ?? []);
    const base = opts?.questionsList ? [...opts.questionsList] : getQuestionBank();
    const detranMin = opts?.detranMin ?? OFFICIAL_EXAM_DETRAN_MIN;
    const detranMax = opts?.detranMax ?? OFFICIAL_EXAM_DETRAN_MAX;
    const detranTarget = detranMin + Math.floor(Math.random() * (detranMax - detranMin + 1));
    const quotaOf = (cat: Category): number =>
        OFFICIAL_EXAM_DISTRIBUTION.find((d) => d.category === cat)?.count ?? 0;
    const inQuota = (q: Question): boolean => quotaOf(q.category) > 0;

    const used = new Set<string>();
    const usedGroups = new Set<string>();
    const perCat = new Map<Category, number>();
    let detranPicked = 0;
    const selected: Question[] = [];

    const scoreOf = (q: Question): number =>
        Math.random() *
        INCIDENCE_META[q.incidence].weight *
        (q.trap ? 2.5 : 1) *
        (1 + (q.difficulty - 1) * 0.3);
    const eligible = (q: Question, allowSeen: boolean): boolean =>
        (allowSeen || !ex.has(q.id)) &&
        !used.has(q.id) &&
        (!q.group || !usedGroups.has(q.group));
    const take = (q: Question): void => {
        selected.push(q);
        used.add(q.id);
        if (q.group) usedGroups.add(q.group);
        perCat.set(q.category, (perCat.get(q.category) ?? 0) + 1);
        if (q.id.startsWith("detran_")) detranPicked++;
    };
    const ordered = (arr: Question[]): Question[] =>
        arr.map((q) => ({ q, s: scoreOf(q) })).sort((a, b) => b.s - a.s).map((x) => x.q);

    // 1) Lote oficial primeiro: até detranTarget, sem estourar a cota da categoria.
    for (const q of ordered(base.filter((q) => q.id.startsWith("detran_") && inQuota(q) && eligible(q, false)))) {
        if (detranPicked >= detranTarget) break;
        if ((perCat.get(q.category) ?? 0) >= quotaOf(q.category)) continue;
        take(q);
    }

    // 2) Completa cada cota: não-detran inéditas -> qualquer inédita -> reuso de vistas.
    for (const { category, count } of OFFICIAL_EXAM_DISTRIBUTION) {
        let need = count - (perCat.get(category) ?? 0);
        if (need <= 0) continue;
        const stages: Question[][] = [
            base.filter((q) => q.category === category && !q.id.startsWith("detran_") && eligible(q, false)),
            base.filter((q) => q.category === category && eligible(q, false)),
            base.filter((q) => q.category === category && eligible(q, true)),
        ];
        for (const stage of stages) {
            for (const q of ordered(stage)) {
                if (need <= 0) break;
                take(q);
                need--;
            }
            if (need <= 0) break;
        }
    }

    // 2b) Mínimo de 11 em nível difícil (difficulty 3): troca não-difíceis
    // por difíceis da MESMA categoria, protegendo a mescla detran_* (5-8).
    const hardMin = Math.min(OFFICIAL_EXAM_HARD_MIN, total);
    const isHard = (q: Question): boolean => q.difficulty === 3;
    let hardCount = selected.filter(isHard).length;
    if (hardCount < hardMin) {
        for (const out of [...selected]) {
            if (hardCount >= hardMin) break;
            if (isHard(out) || out.id.startsWith("detran_")) continue;
            const rep = ordered(
                base.filter(
                    (q) =>
                        q.category === out.category &&
                        isHard(q) &&
                        eligible(q, false) &&
                        (q.id.startsWith("detran_") ? detranPicked < detranMax : true),
                ),
            )[0];
            if (!rep) continue;
            selected.splice(selected.indexOf(out), 1);
            take(rep);
            hardCount++;
        }
    }

    // 3) Garantia final: se alguma cota secou, completa com qualquer questão do banco.
    if (selected.length < total) {
        for (const q of ordered(base.filter((q) => eligible(q, false)))) {
            if (selected.length >= total) break;
            take(q);
        }
    }
    if (selected.length < total) {
        for (const q of ordered(base.filter((q) => eligible(q, true)))) {
            if (selected.length >= total) break;
            take(q);
        }
    }

    // Embaralha a ordem final e as alternativas.
    for (let i = selected.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [selected[i], selected[j]] = [selected[j], selected[i]];
    }
    return selected.slice(0, total).map(shuffleOptions);
}
