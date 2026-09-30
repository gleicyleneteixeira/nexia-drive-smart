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
        statement: "A habilitação na categoria B permite ao condutor conduzir veículos motorizados com as seguintes características:",
        options: ["PBT até 3.500 kg e lotação máxima de 8 passageiros, excluído o motorista.", "PBT até 3.500 kg e lotação máxima de 8 passageiros, incluindo o motorista.", "PBT até 5.000 kg e lotação máxima de 10 passageiros, excluído o motorista.", "PBT até 3.500 kg e lotação ilimitada, desde que não transporte carga."],
        correctIndex: 0,
        explanation: "A categoria B limita o PBT a 3.500 kg e a lotação a 8 passageiros, sem contar o motorista (Art. 143 CTB).",
        detailedExplanation: "Com a categoria B, você pode dirigir carros de passeio, utilitários e furgões, desde que não passem de 3.500 kg e tenham no máximo 8 lugares. Motocicletas precisam da categoria A, enquanto veículos maiores ou com mais passageiros exigem categorias C e D, respectivamente.",
        legalBase: "Art. 143 do CTB",
        commonMistake: "Cuidado: não confunda 8 passageiros no total com 8 passageiros mais o motorista — são 8 + 1!",
        tip: "B = Até 3.500 kg e 8 + 1.",
        incidence: "altissima",
        difficulty: 3
    },
    {
        id: "q2",
        category: "placas",
        statement: "As placas de regulamentação possuem formato circular, orla vermelha, fundo branco e símbolo preto. Sua função principal é:",
        options: ["Advertir sobre perigos à frente, como curvas e cruzamentos.", "Impor obrigações, limitações ou proibições de uso da via.", "Indicar direções, distâncias e serviços auxiliares ao usuário.", "Orientar fluxos turísticos e áreas de preservação ambiental."],
        correctIndex: 1,
        explanation: "Placas de regulamentação impõem regras obrigatórias de circulação, com formato circular e orla vermelha.",
        detailedExplanation: "Essas placas (série R) têm formato CIRCULAR e são usadas para dar ordens e proibições. Se você não seguir, pode levar multa. Tem algumas que são diferentes, como a PARE (R-1) que é OCTOGONAL e a 'Dê a preferência' (R-2) que é TRIÂNGULO INVERTIDO, mas todas são de regulamentação.",
        commonMistake: "Muita gente confunde com as placas de advertência (losango amarelo).",
        tip: "Vermelho = você é OBRIGADO a obedecer.",
        incidence: "altissima",
        difficulty: 3
    },
    {
        id: "q3",
        category: "direcao-defensiva",
        statement: "Em via urbana, pedestre inicia travessia fora da faixa de segurança. A conduta imediata correta do condutor é:",
        options: ["Manter velocidade e buzinar para alertar o pedestre.", "Acelerar para passar antes do pedestre entrar na pista.", "Reduzir velocidade e ceder a travessia ao pedestre.", "Mudar de faixa bruscamente para desviar do pedestre."],
        correctIndex: 2,
        explanation: "O pedestre tem prioridade mesmo fora da faixa. O condutor deve reduzir e ceder a travessia (Art. 29, §2º CTB).",
        detailedExplanation: "O CTB diz que o pedestre é o mais vulnerável e deve ser respeitado. O motorista precisa diminuir a velocidade e parar se for preciso, esperando o pedestre passar. A vida do pedestre é responsabilidade do motorista, não importa a situação.",
        legalBase: "Art. 29, §2º do CTB",
        commonMistake: "Muita gente acha que o pedestre fora da faixa não tem prioridade, mas isso é furada!",
        incidence: "alta",
        trap: true,
        difficulty: 3
    },
    {
        id: "qe01",
        category: "legislacao",
        statement: "O cadastro inicial no RENACH deve ser realizado pelo candidato em qual local, conforme o CTB e resoluções do CONTRAN?",
        options: ["No DETRAN do estado ou DF onde possui residência.", "Diretamente no CONTRAN, órgão máximo normativo.", "No CFC, que possui competência exclusiva para abri-lo.", "No Ministério dos Transportes, via SENATRAN."],
        correctIndex: 0,
        explanation: "O RENACH é aberto no DETRAN do estado ou DF onde o candidato reside (Res. CONTRAN 168/2004).",
        detailedExplanation: "O RENACH é como um cadastro nacional de motoristas, e só pode ser aberto no DETRAN do estado onde a pessoa vive. Se tentar fazer em outro lugar, vai dar confusão e atrasar o processo.",
        legalBase: "Res. CONTRAN 168/2004",
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "qe02",
        category: "legislacao",
        statement: "A Permissão para Dirigir (PPD) é o documento que atesta a aprovação do candidato nos exames. Qual é o período de vigência probatória desse documento, conforme o CTB?",
        options: ["12 meses, contados da data de expedição.", "6 meses, prorrogáveis se não houver infrações leves.", "2 anos, igual ao prazo das avaliações psicológicas.", "5 anos, correspondente à carência dos exames de aptidão."],
        correctIndex: 0,
        explanation: "A PPD vigora por 12 meses, período em que o condutor não pode cometer infrações graves ou gravíssimas (Art. 148, §3º CTB).",
        detailedExplanation: "A Permissão para Dirigir (PPD) é a primeira etapa da habilitação e dura 12 meses. Se você cometer infrações graves ou for reincidente em médias, não ganha a CNH e tem que começar tudo de novo. Esse tempo é pra garantir que você aprenda a ser responsável no trânsito antes de ter a habilitação definitiva.",
        legalBase: "Art. 148, §3º CTB",
        incidence: "altissima",
        difficulty: 3
    },
    {
        id: "qe03",
        category: "legislacao",
        statement: "Sem infrações gravíssimas no período, a suspensão do direito de dirigir ocorre aos quantos pontos acumulados?",
        options: ["40 pontos acumulados em 12 meses.", "30 pontos, caso haja uma infração grave.", "20 pontos, independentemente da natureza das infrações.", "14 pontos, para condutores com EAR."],
        correctIndex: 0,
        explanation: "Sem gravíssimas, o limite é 40 pontos. Com uma gravíssima, cai para 30; com duas ou mais, vai a 20 (Art. 261 CTB).",
        detailedExplanation: "A Lei 14.071/2020 mudou as regras de pontuação para a CNH. Se o motorista não tiver infrações gravíssimas, pode acumular até 40 pontos; se tiver uma, o limite cai para 30; e se tiver duas ou mais, vai para 20 pontos. Por isso, é bom ficar ligado nas novas regras!",
        legalBase: "Art. 261 CTB",
        commonMistake: "Muita gente ainda acha que é 20 pontos fixos, mas isso mudou!",
        incidence: "altissima",
        trap: true,
        difficulty: 3
    },
    {
        id: "qe04",
        category: "legislacao",
        statement: "Condutores com exercício de atividade remunerada (EAR) têm limite de pontos para suspensão de quanto?",
        options: ["40 pontos, independentemente da natureza das infrações.", "20 pontos, com redução imediata se houver infração média.", "30 pontos, caso conste infração grave ou gravíssima.", "25 pontos, mediante reciclagem obrigatória aos 20 pontos."],
        correctIndex: 0,
        explanation: "Após a Lei 14.071/2020, o limite é o mesmo para todos: 40 pontos sem gravíssimas, 30 com uma, 20 com duas ou mais.",
        detailedExplanation: "Antes da nova lei, motoristas de táxi e outros com EAR tinham limites diferentes de pontos. Agora, o limite é o mesmo para todo mundo, mas eles têm que fazer exame toxicológico periodicamente, enquanto os outros não precisam.",
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "qe05",
        category: "legislacao",
        statement: "São documentos de porte obrigatório pelo condutor, conforme o CTB e resoluções do CONTRAN:",
        options: ["CNH (física ou digital) e CRLV-e.", "CRV e comprovante de IPVA.", "RG e carteira de vacinação.", "Comprovante de aprovação em exames de aptidão física."],
        correctIndex: 0,
        explanation: "A CNH e o CRLV-e são obrigatórios e podem ser apresentados em formato digital (Art. 159 CTB).",
        detailedExplanation: "Pra dirigir de boa, você precisa ter a CNH (Carteira Nacional de Habilitação) e o CRLV (Certificado de Registro e Licenciamento do Veículo). Você pode mostrar eles no celular, que vale igual ao papel. Se faltar algum, pode dar ruim e o carro ser guinchado pro pátio.",
        legalBase: "Art. 159 CTB",
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "qe06",
        category: "legislacao",
        statement: "A habilitação na categoria A autoriza o condutor a conduzir quais tipos de veículos nas vias públicas?",
        options: ["Veículos de duas ou três rodas, com ou sem carro lateral.", "Veículos de transporte coletivo com até 8 lugares.", "Qualquer veículo com PBT até 3.500 kg.", "Veículos de duas rodas com até 50 cilindradas."],
        correctIndex: 0,
        explanation: "A categoria A abrange veículos de duas ou três rodas, com ou sem sidecar (Art. 143 CTB).",
        detailedExplanation: "No CTB, cada categoria é pra um tipo de veículo. A categoria A é só pra duas ou três rodas: motos, motonetas e triciclos. Carros e caminhões precisam de outras categorias.",
        legalBase: "Art. 143 CTB",
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "qe07",
        category: "legislacao",
        statement: "Conduzir veículo sem possuir habilitação ou permissão configura infração de natureza:",
        options: ["Gravíssima, com multa tripla e retenção do veículo.", "Grave, com apreensão e leilão do veículo.", "Média, com advertência escrita se o veículo estiver licenciado.", "Gravíssima, com detenção de seis meses a um ano."],
        correctIndex: 0,
        explanation: "Dirigir sem habilitação é infração gravíssima, com multa 3x e retenção do veículo (Art. 162, I CTB).",
        detailedExplanation: "Se você não tem CNH ou Permissão, tá cometendo uma das infrações mais sérias do CTB. Isso é gravíssimo, com multa tripla e o carro vai ser retido até alguém habilitado aparecer pra levar.",
        legalBase: "Art. 162, I CTB",
        incidence: "altissima",
        difficulty: 3
    },
    {
        id: "qe08",
        category: "legislacao",
        statement: "O curso de reciclagem é obrigatório quando o condutor se enquadrar em qual situação prevista no CTB?",
        options: ["Tem o direito de dirigir suspenso ou se envolve em acidente grave.", "Comete infração média ou leve durante a PPD.", "Estaciona em vaga de idoso sem credencial.", "Ultrapassa em local proibido sinalizado."],
        correctIndex: 0,
        explanation: "A reciclagem é exigida na suspensão do direito de dirigir, acidente grave com contribuição ou condenação por crime de trânsito (Art. 268 CTB).",
        detailedExplanation: "Esse curso ajuda a pessoa a aprender de novo sobre as regras de trânsito e a dirigir com mais segurança. Ele é exigido quando a pessoa tem a CNH suspensa e, no final, precisa passar em uma prova para conseguir a habilitação de volta.",
        legalBase: "Art. 268 CTB",
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "qe09",
        category: "legislacao",
        statement: "Para mudar da categoria B para C, o condutor não pode ter cometido no último ano:",
        options: ["Mais de uma infração gravíssima.", "Mais de uma infração média e nenhuma grave.", "Qualquer infração grave ou gravíssima.", "Nenhuma infração leve ou média."],
        correctIndex: 0,
        explanation: "Na mudança para C, é permitido ter até 1 gravíssima nos últimos 12 meses, mas não mais disso (Art. 143, §1º CTB).",
        detailedExplanation: "Com a nova lei, as regras ficaram mais fáceis. Agora, o condutor pode ter no máximo uma infração gravíssima nos últimos 12 meses e não precisa se preocupar com infrações graves ou médias.",
        legalBase: "Art. 143, §1º do CTB",
        commonMistake: "Muita gente ainda pensa que não pode ter nenhuma infração grave ou gravíssima, mas agora é permitido ter uma gravíssima.",
        tip: "Mudança de categoria = até 1 gravíssima permitida nos últimos 12 meses.",
        incidence: "media",
        difficulty: 3
    },
    {
        id: "qe10",
        category: "legislacao",
        statement: "O requisito essencial para iniciar o processo de habilitação é o candidato ser:",
        options: ["Penalmente imputável (maior de 18 anos).", "Maior de 16 anos emancipado com autorização dos pais.", "Eleitor regularmente alistado.", "Maior de 18 anos, independentemente de compreender as consequências."],
        correctIndex: 0,
        explanation: "É necessário ser penalmente imputável, ou seja, maior de 18 anos, para responder pelos atos (Art. 140 CTB).",
        detailedExplanation: "Com 18 anos, a pessoa já pode ser responsabilizada como adulta e isso é importante pra dirigir. Além disso, tem que saber ler e escrever, ter CPF e documento de identidade. Se for tirar categorias profissionais (C, D e E), precisa ter 21 anos.",
        legalBase: "Art. 140 CTB",
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "qe11",
        category: "legislacao",
        statement: "Para obter a CNH definitiva após 1 ano de PPD, o condutor não pode ter cometido:",
        options: ["Infração grave ou gravíssima, nem ser reincidente em média.", "Nenhuma infração de qualquer natureza.", "Infração leve que resulte em pontuação.", "Mais de duas infrações leves no período."],
        correctIndex: 0,
        explanation: "Na PPD, o condutor não pode cometer infração grave ou gravíssima, nem ser reincidente em média (Art. 148 CTB).",
        detailedExplanation: "Depois de passar nos testes, você ganha a Permissão para Dirigir (PPD) que vale por um ano. Se durante esse tempo você dirigir direitinho, sem infrações pesadas, a CNH definitiva sai na hora. Mas se vacilar e cometer alguma infração, vai ter que começar tudo de novo, com aulas e testes.",
        legalBase: "Art. 148 CTB",
        incidence: "altissima",
        trap: true,
        difficulty: 3
    },
    {
        id: "qe12",
        category: "legislacao",
        statement: "O exame toxicológico é obrigatório para obtenção e renovação da habilitação nas categorias:",
        options: ["C, D e E, independentemente de EAR.", "B, C e D, somente com EAR.", "A, B e C, com validade superior a 5 anos.", "Apenas E, para veículos com carga inflamável."],
        correctIndex: 0,
        explanation: "O exame toxicológico é obrigatório nas categorias C, D e E, na obtenção e renovação (Art. 148-A CTB).",
        detailedExplanation: "Esse exame vale tanto na hora de pegar a CNH quanto na hora de renovar. Ele serve pra ver se o motorista tá usando drogas que podem atrapalhar a direção, já que quem dirige caminhão, ônibus ou carrega carga tem que ter mais cuidado.",
        legalBase: "Art. 148-A CTB",
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "qe13",
        category: "infracoes",
        statement: "Estacionar em vaga de idoso sem a credencial configura infração de natureza:",
        options: ["Gravíssima, com multa, 7 pontos e remoção do veículo.", "Grave, com multa e retenção temporária.", "Média, com recolhimento da CNH por 30 dias.", "Leve, com advertência por escrito."],
        correctIndex: 0,
        explanation: "Estacionar em vaga de idoso sem credencial é gravíssima, com 7 pontos e remoção (Art. 181, XVII CTB).",
        detailedExplanation: "Quando você para em vaga de idoso sem a credencial, a multa é alta e ainda acumula 7 pontos na CNH. Essas vagas são pra quem realmente precisa, então usar sem autorização é bem sério.",
        legalBase: "Art. 181, XVII CTB",
        incidence: "media",
        difficulty: 3
    },
    {
        id: "qe14",
        category: "infracoes",
        statement: "Estacionar em vaga de PCD sem credencial em estabelecimento privado configura:",
        options: ["Infração gravíssima, com multa e remoção do veículo.", "Infração sem jurisdição, por ser propriedade privada.", "Infração grave, com remoção se houver reclamação do gerente.", "Infração média, com multa e apreensão do veículo."],
        correctIndex: 0,
        explanation: "O CTB se aplica a estabelecimentos privados de uso coletivo. A infração é gravíssima, com multa e remoção.",
        detailedExplanation: "Se você parar em uma vaga reservada para pessoa com deficiência (PCD) sem a credencial, vai levar uma multa pesada e ainda pode ter seu carro guinchado. Essas vagas são maiores para ajudar quem precisa de cadeira de rodas, então ocupá-las sem autorização é bem sério.",
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "qe15",
        category: "infracoes",
        statement: "Passageiro sem cinto de segurança no banco traseiro configura:",
        options: ["Infração grave do condutor, com multa e retenção do veículo.", "Infração média do passageiro, único responsável.", "Infração leve do proprietário, com advertência verbal.", "Infração gravíssima, com retenção definitiva do veículo."],
        correctIndex: 0,
        explanation: "O condutor é responsável pelo uso do cinto pelos passageiros. A infração é grave, com multa e retenção (Art. 167 CTB).",
        detailedExplanation: "Deixar de usar o cinto de segurança gera 5 pontos na CNH e multa. O cinto é obrigatório para todos no carro, tanto na frente quanto atrás, em qualquer tipo de via. O condutor é responsável por garantir que todos os passageiros estejam usando o cinto, mesmo que seja o passageiro que não esteja usando.",
        legalBase: "Art. 167 CTB",
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "qe16",
        category: "infracoes",
        statement: "Segurar ou manusear telefone celular ao volante configura infração de natureza:",
        options: ["Gravíssima, com multa e 7 pontos.", "Grave, com multa e suspensão preventiva.", "Média, com advertência escrita.", "Leve, com multa se houver excesso de velocidade."],
        correctIndex: 0,
        explanation: "Manusear o celular ao volante é infração gravíssima, com 7 pontos e multa (Art. 252, §1º CTB).",
        detailedExplanation: "Segurar o celular ao volante é muito sério, dá 7 pontos na CNH e multa. A lei ficou mais rígida porque mexer no celular tira a atenção e é tão perigoso quanto dirigir bêbado. O celular só pode ser usado em modo viva-voz ou com fone, sem segurar.",
        legalBase: "Art. 252, §1º CTB",
        incidence: "altissima",
        difficulty: 3
    },
    {
        id: "qe17",
        category: "infracoes",
        statement: "Disputar corrida (racha) em via pública resulta em quais penalidades e medidas administrativas?",
        options: ["Multa 10x, suspensão do direito de dirigir e remoção do veículo.", "Multa 5x, retenção e curso de primeiros socorros.", "Advertência escrita e apreensão por 24 horas.", "Multa 20x e cassação definitiva sem direito a defesa."],
        correctIndex: 0,
        explanation: "Racha é infração gravíssima com multa 10x, suspensão e remoção do veículo (Art. 173 CTB).",
        detailedExplanation: "Disputar corrida em via pública é muito sério: é uma infração gravíssima com multa multiplicada por 10, suspensão do direito de dirigir e o carro é retirado. Além disso, racha é crime, podendo dar até 3 anos de prisão, pois coloca todo mundo em risco, não só os motoristas envolvidos.",
        legalBase: "Art. 173/308 CTB",
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "qe18",
        category: "infracoes",
        statement: "Em via com limite de 40 km/h, transitar a 55 km/h configura infração de natureza:",
        options: ["Média, por excesso de até 20%.", "Grave, por excesso de mais de 20% até 50%.", "Gravíssima, com multa 3x e suspensão.", "Leve, com advertência escrita."],
        correctIndex: 1,
        explanation: "55 km/h em via de 40 km/h é excesso de 37,5%, caracterizando infração grave (Art. 218, II CTB).",
        detailedExplanation: "Quando você passa de 20% a 50% do limite de velocidade, a infração é grave e você leva 5 pontos na CNH e multa. O CTB classifica as infrações de velocidade em faixas: até 20% é média, de 20% a 50% é grave, e acima de 50% é gravíssima, com penalidades mais severas.",
        legalBase: "Art. 218, II CTB",
        incidence: "altissima",
        difficulty: 3
    },
    {
        id: "qe19",
        category: "infracoes",
        statement: "Em rodovia com limite de 110 km/h, transitar a 170 km/h configura infração de natureza:",
        options: ["Gravíssima, com multa 3x e suspensão do direito de dirigir.", "Grave, com multa e retenção do veículo.", "Média, com multa e pontuação.", "Crime de trânsito inafiançável com detenção."],
        correctIndex: 0,
        explanation: "Excesso superior a 50% é infração gravíssima, com multa 3x e suspensão imediata (Art. 218, III CTB).",
        detailedExplanation: "Quando você ultrapassa o limite de velocidade em mais de 50%, a multa é multiplicada por três, além de somar 7 pontos na CNH e suspensão imediata do direito de dirigir. Isso é super sério, porque dirigir muito rápido aumenta demais o risco de acidentes, já que a distância para parar é muito maior.",
        legalBase: "Art. 218, III CTB",
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "qe20",
        category: "infracoes",
        statement: "Não dar passagem ao pedestre na faixa sinalizada configura infração de natureza:",
        options: ["Gravíssima, com multa e remoção do veículo.", "Grave, com advertência se o pedestre sair ileso.", "Média, com multa e suspensão preventiva.", "Leve, aplicável apenas se houver colision."],
        correctIndex: 0,
        explanation: "Deixar de dar passagem ao pedestre na faixa é infração gravíssima, com 7 pontos e multa (Art. 214 CTB).",
        detailedExplanation: "Quando o motorista não dá passagem para o pedestre na faixa de segurança, ele comete uma infração GRAVÍSSIMA, que gera 7 pontos na CNH e multa. O pedestre é a pessoa mais vulnerável no trânsito, e a faixa é feita pra proteger ele, então o certo é sempre parar quando ele está atravessando ou esperando.",
        legalBase: "Art. 214 CTB",
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "qe21",
        category: "infracoes",
        statement: "Criança de 9 anos e 1,35 m deve ser transportada de que forma no veículo?",
        options: ["No banco traseiro, com cinto de segurança ou dispositivo de retenção.", "No banco dianteiro, com cinto regulado na altura do ombro.", "No banco traseiro, com assento de elevação até 12 anos.", "Em qualquer assento, com supervisão de adulto e cinto subabdominal."],
        correctIndex: 0,
        explanation: "Crianças menores de 10 anos devem ir no banco traseiro com dispositivo de retenção adequado (Art. 168 CTB).",
        detailedExplanation: "Se você colocar uma criança menor de 10 anos na frente, pode levar uma multa pesada e ainda perder pontos na CNH. No banco de trás, use sempre um dispositivo de retenção como cadeirinha ou assento de elevação, pra proteger a criança do airbag em caso de batida. Essas regras foram atualizadas pela Resolução CONTRAN 819/2021.",
        legalBase: "Art. 168 CTB",
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "qe22",
        category: "infracoes",
        statement: "Ultrapassar pela direita, sem que o veículo da esquerda sinalize conversão, é:",
        options: ["Infração média, exceto se o veículo da esquerda sinalizar conversão à esquerda.", "Infração grave, sem excludente por fluxo intenso.", "Permitida em vias arteriais acima de 60 km/h.", "Crime de trânsito de perigo abstrato."],
        correctIndex: 0,
        explanation: "Ultrapassar pela direita é infração média, salvo quando o veículo da esquerda sinaliza entrar à esquerda (Art. 199 CTB).",
        detailedExplanation: "Fazer isso é uma infração média, que pode te render pontos na CNH e multa. O certo é ultrapassar pela esquerda, a não ser que o carro da frente esteja indicando que vai sair da faixa.",
        legalBase: "Art. 199 CTB",
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "qe23",
        category: "infracoes",
        statement: "Ultrapassar na contramão em linha amarela contínua em aclive configura infração de natureza:",
        options: ["Gravíssima, com multa 5x.", "Grave, com multa e suspensão por 3 meses.", "Média, com advertência verbal.", "Crime doloso contra a segurança viária."],
        correctIndex: 0,
        explanation: "Ultrapassagem proibida em linha contínua e aclive é gravíssima, com multa 5x (Art. 191 CTB).",
        detailedExplanation: "Fazer ultrapassagem em lugares proibidos, como linha dupla contínua e aclives, é muito arriscado. Nesses locais, a visibilidade é ruim e pode causar acidentes graves, como colisões frontais. Além da multa alta, você pode perder a CNH e ser suspenso de dirigir.",
        legalBase: "Art. 191 CTB",
        incidence: "altissima",
        difficulty: 3
    },
    {
        id: "qe24",
        category: "infracoes",
        statement: "Recusar-se a soprar o bafômetro na Lei Seca resulta em quais consequências administrativas?",
        options: ["Infração gravíssima, multa 10x, suspensão por 12 meses e recolhimento da CNH.", "Lavratura de termo sem multa, se houver condutor substituto.", "Crime de trânsito imediato, com encaminhamento à delegacia.", "Infração grave, com multa simples e 5 pontos."],
        correctIndex: 0,
        explanation: "A recusa ao bafômetro é infração gravíssima, com multa 10x, suspensão de 12 meses e recolhimento da CNH (Art. 165-A CTB).",
        detailedExplanation: "Negar o teste do bafômetro é como estar dirigindo bêbado: a multa é altíssima, dez vezes mais, e a CNH vai ser recolhida por 12 meses. Muita gente pensa que só de recusar não vai dar nada, mas a lei é bem clara e aplica a mesma punição pra evitar que motoristas embriagados escapem.",
        legalBase: "Art. 165-A CTB",
        incidence: "altissima",
        trap: true,
        difficulty: 3
    },
    {
        id: "qe25",
        category: "infracoes",
        statement: "Dirigir com CNH vencida há mais de 30 dias configura infração de natureza:",
        options: ["Gravíssima, com multa e retenção do veículo.", "Grave, com tolerância de 90 dias se houver agendamento.", "Média, com multa e pontuação, sem retenção.", "Atípica, com notificação pedagógica."],
        correctIndex: 0,
        explanation: "CNH vencida há mais de 30 dias é infração gravíssima, com multa e retenção do veículo (Art. 162, V CTB).",
        detailedExplanation: "Se a CNH está vencida há mais de 30 dias, isso é considerado uma infração GRAVÍSSIMA, resultando em 7 pontos na CNH e multa. A CNH vencida não serve mais como documento válido, e dirigir assim significa que o motorista não está comprovadamente apto a dirigir. A tolerância é de 30 dias para renovar, depois disso, é como se não estivesse habilitado.",
        legalBase: "Art. 162, V CTB",
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "qe26",
        category: "infracoes",
        statement: "Buzinar de forma prolongada ou sucessiva à noite configura infração de natureza:",
        options: ["Leve, com multa e pontuação.", "Média, como poluição sonora inafiançável.", "Permitida, se velocidade abaixo de 20 km/h.", "Grave, com recolhimento do veículo."],
        correctIndex: 0,
        explanation: "Buzinar em excesso ou fora do horário permitido (22h às 6h) é infração leve, com multa (Art. 227 CTB).",
        detailedExplanation: "Usar a buzina em excesso ou fora do horário permitido (22h às 6h) pode causar poluição sonora e perturbar a paz. Isso resulta em 3 pontos na CNH e multa, já que a buzina deve ser usada só para avisar sobre perigo.",
        legalBase: "Art. 227 CTB",
        incidence: "media",
        difficulty: 3
    },
    {
        id: "qe27",
        category: "direcao-defensiva",
        statement: "O conceito técnico e prático de Direção Defensiva fundamenta-se em atitudes preventivas. Dentre as alternativas, qual define corretamente o objetivo primordial da direção defensiva?",
        options: ["Evitar acidentes apesar das ações incorretas dos outros e das condições adversas.", "Garantir a máxima velocidade permitida para agilizar o fluxo.", "Desenvolver técnicas de derrapagem em altas velocidades.", "Transferir a responsabilidade pela segurança aos pedestres."],
        correctIndex: 0,
        explanation: "Direção defensiva visa prevenir acidentes, considerando erros alheios e condições adversas da via.",
        detailedExplanation: "Direção defensiva envolve técnicas que ajudam o motorista a se proteger e proteger os outros, mesmo quando o clima tá ruim ou alguém faz besteira. O foco não é chegar rápido, mas sim garantir a segurança de todos na estrada.",
        incidence: "altissima",
        difficulty: 3
    },
    {
        id: "qe28",
        category: "direcao-defensiva",
        statement: "As condições adversas representam fatores de risco. Constitui exemplo típico de condição adversa relacionada especificamente ao fator 'Luz':",
        options: ["Ofuscamento por farol alto ou penumbra na transição dia-noite.", "Aquaplanagem por acúmulo de água na pista.", "Desgaste das bandas de rodagem dos pneus.", "Fadiga física ou estresse mental do condutor."],
        correctIndex: 0,
        explanation: "Ofuscamento e penumbra são condições adversas de luz que comprometem a visibilidade do condutor.",
        detailedExplanation: "Essas condições incluem coisas que atrapalham a visão, como sol baixo que ofusca, faróis altos de carros vindo na direção contrária, penumbra ao escurecer, neblina e chuva forte. Cada situação pede uma ação diferente, como olhar pra beirada da pista quando tá ofuscado ou usar faróis baixos quando necessário.",
        incidence: "alta",
        trap: true,
        difficulty: 3
    },
    {
        id: "qe29",
        category: "direcao-defensiva",
        statement: "Para realizar uma manobra segura de ultrapassagem em via de pista dupla, o condutor defensivo deve adotar qual procedimento técnico?",
        options: ["Verificar retrovisores e ponto cego, sinalizar, acelerar e retornar após ver o veículo no retrovisor.", "Acionar luz alta e ultrapassar rente ao para-choque do veículo da frente.", "Buzinar continuamente para forçar o veículo lento a desviar.", "Mudar bruscamente de faixa para surpreender os motoristas."],
        correctIndex: 0,
        explanation: "A ultrapassagem segura exige verificação de retrovisores, ponto cego, sinalização e retorno seguro à faixa.",
        detailedExplanation: "A manobra de ultrapassagem tem passos importantes: 1) sinalizar pra esquerda com a seta; 2) checar retrovisores e o ponto cego; 3) mudar pra faixa da esquerda; 4) acelerar e ultrapassar; 5) sinalizar pra direita; 6) voltar pra faixa original só quando o carro ultrapassado aparecer no retrovisor. Ignorar qualquer passo pode causar acidente.",
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "qe30",
        category: "direcao-defensiva",
        statement: "Sob forte chuva, o condutor perde o controle direcional do veículo. Esse fenômeno físico, denominado aquaplanagem, ocorre pela combinação de:",
        options: ["Alta velocidade, película de água na pista e pneus com sulcos abaixo de 1,6 mm.", "Redução da pressão do fluido de freios em temperaturas baixas.", "Excesso de peso concentrado no porta-malas.", "Bloqueio das pinças de freio por detritos pluviais."],
        correctIndex: 0,
        explanation: "Aquaplanagem resulta de velocidade alta, água na pista e pneus desgastados (sulcos < 1,6 mm).",
        detailedExplanation: "Esse fenômeno rola quando a água se acumula entre o pneu e o asfalto, tirando o contato. Os principais vilões são a velocidade alta em poças, pneus muito gastos (menos de 1,6 mm) e calibragem errada. Isso faz você perder o controle do carro e não consegue frear direito.",
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "qe31",
        category: "direcao-defensiva",
        statement: "Sob chuva leve, o condutor sente a direção ficar leve e percebe aquaplanagem. Sob a ótica do controle veicular defensivo, qual a conduta imediata recomendada?",
        options: ["Segurar o volante firmemente, retirar o pé do acelerador e evitar frear ou fazer manobras bruscas.", "Pisar com força no freio para travar as rodas e buscar atrito.", "Girar o volante bruscamente para expulsar a água sob os pneus.", "Engatar marcha reduzida para forçar a recuperação de aderência."],
        correctIndex: 0,
        explanation: "Na aquaplanagem, segure o volante, desacelere gradualmente e evite frear ou virar bruscamente.",
        detailedExplanation: "Se você perceber que está aquaplanando, não entre em pânico. Primeiro, tire o pé do acelerador. Depois, mantenha o volante firme e reto. Evite frear ou fazer manobras bruscas, pois isso pode causar perda total de controle. Se o carro tiver freios ABS, você pode frear levemente se os pneus voltarem a tocar o chão.",
        incidence: "altissima",
        difficulty: 3
    },
    {
        id: "qe32",
        category: "direcao-defensiva",
        statement: "Durante viagem de longa duração em período noturno, o condutor percebe sintomas de fadiga. De acordo com as diretrizes de segurança no trânsito, a conduta correta é:",
        options: ["Parar em local seguro para descansar e dormir o tempo necessário.", "Aumentar a velocidade para chegar mais rápido ao destino.", "Ligar o ar condicionado na máxima e abrir as janelas.", "Ingerir cafeína e continuar a condução ininterrupta."],
        correctIndex: 0,
        explanation: "A conduta correta é parar em local seguro e descansar até recuperar o estado de alerta.",
        detailedExplanation: "Dirigir cansado é muito arriscado, pois pode fazer você perder a atenção e ter reações lentas. Não adianta tomar café ou ouvir música alta, o que vale mesmo é dar uma pausa e dormir um pouco. Parar em um posto ou área de descanso é a jogada certa antes de continuar a viagem.",
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "qe33",
        category: "direcao-defensiva",
        statement: "O alinhamento correto dos espelhos retrovisores é indispensável. A área externa ao veículo cuja visibilidade não é captada pelos retrovisores denomina-se:",
        options: ["Ponto cego, exigindo verificação visual lateral antes de mudar de faixa.", "Zona of refração óptica difusa, impossível de minimizar.", "Área de convergência periférica posterior, coberta por sensores.", "Ponto de fuga horizontal, visível apenas em marcha ré."],
        correctIndex: 0,
        explanation: "O ponto cego é a área fora do alcance dos retrovisores, exigindo verificação visual direta.",
        detailedExplanation: "O ponto cego fica nas laterais e atrás do carro, onde os espelhos não conseguem ver, mesmo ajustados. É importante sempre VIRAR A CABEÇA e olhar por cima do ombro antes de mudar de faixa ou fazer uma curva, pra garantir que não tem carro ali. Alguns carros novos têm sensores que ajudam, mas nunca substituem olhar de verdade.",
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "qe34",
        category: "direcao-defensiva",
        statement: "Ao transitar por uma rodovia de pista única em período noturno, desprovida de iluminação pública, qual dispositivo de iluminação o condutor deve utilizar?",
        options: ["Luz alta, exceto ao aproximar-se de veículo em sentido oposto ou seguir outro.", "Luz de posição associada às luzes de neblina.", "Luz baixa fixa sob qualquer hipótese.", "Farol alto permanente, mesmo cruzando com outros fluxos."],
        correctIndex: 0,
        explanation: "Em vias não iluminadas, usa-se farol alto, reduzindo ao encontrar veículos em sentido oposto ou ao seguir outro (Art. 40 CTB).",
        detailedExplanation: "Em rodovias escuras, o farol ALTO ajuda a ver melhor. Mas, quando você vê outro carro vindo ou está colado em um, troque pro farol BAIXO pra não cegar o motorista do outro lado — isso evita acidentes sérios. O mesmo vale se você estiver atrás de outro carro: use farol baixo pra não atrapalhar a visão dele.",
        legalBase: "Art. 40 CTB",
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "qe35",
        category: "direcao-defensiva",
        statement: "Ao ingressar em túnel com iluminação, o condutor deve manter acesos os faróis com luz baixa, mesmo durante o dia.",
        options: ["Manter acesos os faróis com luz baixa, mesmo durante o dia.", "Acionar faróis de milha e luz alta para alertar pedestres.", "Manter apenas luzes de posição e ligar o pisca-alerta.", "Desligar qualquer iluminação para evitar reflexos."],
        correctIndex: 0,
        explanation: "Em túneis com iluminação, os faróis devem permanecer acesos com luz baixa, mesmo de dia (Art. 40 CTB).",
        detailedExplanation: "Nos túneis, o farol BAIXO tem que estar ligado sempre, até de dia. Isso ajuda os outros motoristas a te verem e ilumina a pista. O farol alto não é bom porque pode ofuscar a visão de todo mundo, e o pisca-alerta só é pra emergências.",
        legalBase: "Art. 40 CTB",
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "qe36",
        category: "direcao-defensiva",
        statement: "Fatores que aumentam a distância de frenagem: velocidade elevada, pista molhada e pneus desgastados.",
        options: ["Velocidade elevada, pista molhada e pneus com banda de rodagem desgastada.", "Tempo de reação do condutor até acionar o pedal.", "Rigidez do chassi e fluido de freio sintético.", "Declividade da via em aclives."],
        correctIndex: 0,
        explanation: "Velocidade, pista molhada e pneus desgastados aumentam a distância de frenagem.",
        detailedExplanation: "Quando você acelera, precisa de mais espaço pra parar. Se a pista tá molhada, os pneus escorregam mais e, se eles estão gastos, a aderência vai embora. Isso tudo faz o carro demorar mais pra parar.",
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "qe37",
        category: "primeiros-socorros",
        statement: "No contexto do suporte básico de vida e dos primeiros socorros em acidentes, a sigla prática de procedimento 'PAS' estabelece a seguinte sequência de prioridades de atendimento:",
        options: ["Prevenir o local, Acionar socorro profissional e Socorrer as vítimas.", "Prestar atendimento imediato, Afastar curiosos e Sinalizar após remoção.", "Parar na faixa de rolamento, Ajudar na remoção e Salvar pertences.", "Procurar testemunhas, Avaliar lesões e Sinalizar com galhos."],
        correctIndex: 0,
        explanation: "PAS = Prevenir (sinalizar), Avisar (acionar socorro) e Socorrer (atender vítimas).",
        detailedExplanation: "Quando chega em um acidente, primeiro você deve PROTEGER o local com sinalização, avisar as autoridades pelo telefone e, se souber, SOCORRER as vítimas. Essa ordem é importante pra evitar mais problemas e garantir a segurança de todos.",
        incidence: "altissima",
        difficulty: 3
    },
    {
        id: "qe38",
        category: "primeiros-socorros",
        statement: "Ao deparar-se com uma vítima de acidente que apresenta hemorragia externa abundante em membro inferior, qual o procedimento inicial correto?",
        options: ["Compressão direta e firme sobre a lesão com pano limpo ou gaze.", "Aplicar torniquete rígido com arame ou corda acima da lesão.", "Jogar água oxigenada ou álcool sobre o ferimento.", "Manter a vítima de pé e forçá-la a caminhar."],
        correctIndex: 0,
        explanation: "A compressão direta com pano limpo ou gaze é o procedimento inicial para hemorragia externa.",
        detailedExplanation: "Quando alguém sangra muito, a primeira coisa a fazer é apertar a ferida com um pano limpo ou gaze. Isso ajuda a diminuir o sangramento e a ferida a cicatrizar. Usar torniquete só é pra casos extremos, porque pode machucar ainda mais a pessoa.",
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "qe39",
        category: "primeiros-socorros",
        statement: "Em um acidente de trânsito, o socorrista suspeita de fratura de coluna. Diante dessa hipótese diagnóstica, qual a conduta correta até a chegada do resgate?",
        options: ["Manter a vítima imóvel e alinhada, evitando movimentação da cabeça ou coluna.", "Remover a vítima do veículo e forçá-la a sentar ereta.", "Massagear a região cervical e as costas da vítima.", "Girar o pescoço da vítima para avaliar mobilidade."],
        correctIndex: 0,
        explanation: "Na suspeita de lesão medular, a vítima deve permanecer imóvel até a chegada do resgate.",
        detailedExplanation: "Nunca mova quem pode ter machucado a coluna. Qualquer movimento pode agravar a lesão e causar paralisia. A pessoa precisa ficar imóvel até o socorro chegar, que tem os equipamentos certos. Só mova se houver perigo imediato, como fogo ou água, e sempre com cuidado de três pessoas.",
        incidence: "altissima",
        trap: true,
        difficulty: 3
    },
    {
        id: "qe40",
        category: "primeiros-socorros",
        statement: "O número telefônico para acionar o SAMU (Serviço de Atendimento Móvel de Urgência) é:",
        options: ["192 para acionar o Serviço de Atendimento Móvel de Urgência (SAMU).", "193 para acionar a Polícia Rodoviária Federal (PRF).", "190 para acionar o Corpo de Bombeiros Militar do Estado correspondente.", "191 para acionar a Defesa Civil do Município da ocorrência do sinistro."],
        correctIndex: 0,
        explanation: "O SAMU é acionado pelo 192. O 193 é dos Bombeiros e o 190 é da Polícia Militar.",
        detailedExplanation: "Saber os números de emergência é super importante pra agir rápido em acidentes. O SAMU (192) cuida das emergências médicas, enquanto o Corpo de Bombeiros (193) ajuda em incêndios e resgates. A Polícia Militar (190) entra em cena quando tem crime ou confusão.",
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "qe41",
        category: "primeiros-socorros",
        statement: "O condutor sinaliza sinistro em rodovia de pista simples com velocidade regulamentar de 80 km/h, em dia claro e ensolarado. Pela regra de distância do triângulo de segurança, a posição correta é:",
        options: ["No mínimo 80 passos longos da traseira do veículo, dobrando com chuva, neblina ou curva.", "Exatos 30 metros, independente das condições climáticas.", "10 metros do veículo, no acostamento.", "5 passos curtos, com pisca-alerta ativado."],
        correctIndex: 0,
        explanation: "A distância do triângulo é proporcional à velocidade da via: 80 passos em via de 80 km/h, dobrando em condições adversas.",
        detailedExplanation: "O triângulo de sinalização precisa ficar pelo menos 30 metros atrás do carro, na mesma faixa. Isso ajuda quem vem atrás a ver e desacelerar a tempo. Em rodovias rápidas, é melhor colocar ainda mais longe, entre 50 e 100 metros, para evitar acidentes.",
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "qe42",
        category: "primeiros-socorros",
        statement: "Durante o atendimento a um acidente de trânsito com vítimas com queimaduras de segundo grau nos braços, qual o procedimento imediato adequado antes da chegada do SAMU?",
        options: ["Resfriar com água limpa corrente e cobrir com pano úmido e limpo.", "Aplicar pomada ou manteiga sobre a ferida.", "Romper as bolhas para acelerar a drenagem.", "Enfaixar apertado com atadura seca."],
        correctIndex: 0,
        explanation: "Queimaduras devem ser resfriadas com água corrente e cobertas com pano limpo, sem pomadas ou romper bolhas.",
        detailedExplanation: "O ideal é deixar a água CORRENTE em temperatura ambiente na queimadura por uns 10 a 15 minutos, aliviando a dor e evitando mais danos. Evite usar qualquer coisa caseira, como pasta de dente ou manteiga, pois isso só piora a situação e pode causar infecção. E não estoure as bolhas, elas protegem a pele.",
        incidence: "media",
        difficulty: 3
    },
    {
        id: "qe43",
        category: "primeiros-socorros",
        statement: "Uma vítima de acidente de trânsito está consciente, porém apresenta sinais evidentes de estado de choque. Qual o procedimento inicial correto a ser executado?",
        options: ["Manter deitada, afrouxar roupas e elevar membros inferiores em 30 cm.", "Forçar a sentar e ingerir água gelada ou café.", "Realizar massagem cardíaca contínua.", "Cobrir com mantas pesadas e abafar."],
        correctIndex: 0,
        explanation: "No choque, mantenha a vítima deitada, afrouxe roupas e eleve as pernas para melhorar a circulação.",
        detailedExplanation: "O choque acontece quando o corpo não consegue mandar sangue e oxigênio pros órgãos, geralmente por causa de hemorragia ou desidratação. É importante manter a vítima deitada com as pernas levantadas uns 30 cm, cobrir pra não esfriar e não dar nada pra comer ou beber, porque ela pode precisar de cirurgia. Falar de forma calma ajuda a tranquilizar até a ajuda chegar.",
        incidence: "media",
        difficulty: 3
    },
    {
        id: "qe44",
        category: "meio-ambiente",
        statement: "O gás incolor e inodoro que se liga à hemoglobina e compromete a oxigenação do sangue é:",
        options: ["Monóxido de Carbono (CO).", "Dióxido de Carbono (CO2).", "Dióxido de Enxofre (SO2).", "Clorofluorcarboneto (CFC)."],
        correctIndex: 0,
        explanation: "O monóxido de carbono (CO) é liberado pela combustão incompleta e impede a oxigenação adequada do sangue.",
        detailedExplanation: "Os motores a combustão queimam combustível e soltam vários gases, incluindo o monóxido de carbono, que é bem perigoso e não tem cheiro. Manter o carro em dia ajuda a diminuir a poluição e faz bem pra saúde.",
        incidence: "media",
        difficulty: 3
    },
    {
        id: "qe45",
        category: "meio-ambiente",
        statement: "A conduta que contribui para reduzir emissões e consumo de combustível é:",
        options: ["Manter aceleração constante, evitar frenagens bruscas e trocar marchas na rotação adequada.", "Acelerar vigorosamente em ponto morto antes de desligar.", "Utilizar marchas altas em baixas velocidades.", "Desligar o motor em descidas longas (banguela)."],
        correctIndex: 0,
        explanation: "A condução suave, com aceleração constante e trocas de marcha adequadas, reduz consumo e emissões.",
        detailedExplanation: "Quando você troca marcha na hora certa e evita acelerar ou frear de uma vez, o carro usa menos combustível. Isso significa que você também solta menos poluição no ar. Além de fazer bem pro planeta, isso ainda economiza grana com gasolina e manutenção.",
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "qe46",
        category: "meio-ambiente",
        statement: "Em rodovia estadual de pista dupla, passageiro arremessa lata de alumínio pela janela do veículo em movimento. Pelo regramento de posturas ambientais do CTB, essa conduta constitui:",
        options: ["Infração de trânsito de natureza média, sujeita a multa administrativa de responsabilidade do condutor.", "Infração leve de responsabilidade exclusiva do passageiro que efetuou o arremesso físico.", "Infração grave, punida com suspensão imediata da licença de tráfego anual do veículo.", "Conduta permitida pela lei de trânsito desde que a via seja de pista simples e sem acostamento pavimentado."],
        correctIndex: 0,
        explanation: "Jogar lixo ou objetos pela janela é infração média, com multa (Art. 172 CTB).",
        detailedExplanation: "Quando você joga algo pela janela, pode levar multa e 4 pontos na CNH. Além disso, isso é crime ambiental e pode causar acidentes, como um motociclista perdendo o controle por causa de um objeto na pista.",
        legalBase: "Art. 172 CTB",
        incidence: "media",
        difficulty: 3
    },
    {
        id: "qe47",
        category: "meio-ambiente",
        statement: "Buzinas desreguladas e alarmes disparados repetidamente configuram infração que afeta principalmente:",
        options: ["Infração de trânsito que gera estresse e perturbação do sossego público, enquadrando-se como poluição sonora e de convivência social.", "Crime ambiental com detenção incondicional do motorista em regime fechado.", "Mera conduta de convivência, sem previsão de sanções pecuniárias ou aplicação de pontos na CNH.", "Infração média, punida exclusivamente com a apreensão imediata de todo o sistema de som do veículo."],
        correctIndex: 0,
        explanation: "O uso excessivo de buzina e alarmes configura poluição sonora, infração de trânsito.",
        detailedExplanation: "Quando a buzina toca demais, isso gera POLUIÇÃO SONORA, que é um problema reconhecido pela lei. Esse barulho pode deixar a gente estressado, irritado e até causar problemas de saúde, por isso o CTB diz que só podemos usar a buzina em situações de perigo e proíbe o uso em lugares como hospitais e escolas, principalmente à noite.",
        incidence: "media",
        difficulty: 3
    },
    {
        id: "qe48",
        category: "meio-ambiente",
        statement: "Em via urbana com ciclistas e pedestres, um condutor exige preferência absoluta sobre os usuários mais vulneráveis. Sobre as premissas de condutor cidadão do CTB, é correto:",
        options: ["Priorizar sempre a integridade física dos pedestres e dos veículos não motorizados, agindo com cortesia e tolerância perante erros alheios.", "Exigir preferência de passagem sobre veículos menores de carga devido ao maior porte nominal do seu carro de passeio.", "Ignorar ciclistas trafegando pelas bordas da via urbana caso não exista ciclovia segregada.", "Utilizar a buzina de forma contínua para apressar pedestres idosos que realizam travessia lenta sobre a faixa de segurança."],
        correctIndex: 0,
        explanation: "A cidadania no trânsito exige priorizar a segurança dos mais vulneráveis, com respeito e tolerância.",
        detailedExplanation: "Cidadania no trânsito é sobre todos se respeitarem, seja motorista, ciclista ou pedestre. Cada um tem que cuidar do outro, evitando pressa e buzinas desnecessárias. Um trânsito tranquilo depende de cada um fazer sua parte e proteger a todos.",
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "qe49",
        category: "mecanica",
        statement: "Após longa viagem em rodovia, o condutor percebe a luz de pressão de óleo acender no painel e a vareta acusa nível abaixo do mínimo. A circulação do motor nesse estado provoca:",
        options: ["Superaquecimento excessivo das peças por atrito mecânico, podendo levar à fusão de componentes ('fundir o motor') e quebra estrutural do bloco.", "Aumento imediato do consumo de combustível sem qualquer risco de dano mecânico ao bloco do cabeçote.", "Diminuição drástica do desgaste das velas de ignição e bobinas elétricas de alta tensão.", "Travamento automático das pastilhas de freio do eixo traseiro por falta de pressão hidráulica auxiliar."],
        correctIndex: 0,
        explanation: "A falta de óleo lubrificante causa atrito excessivo, superaquecimento e pode fundir o motor.",
        detailedExplanation: "O óleo é o que mantém as partes do motor funcionando direitinho, evitando que elas se desgastem e esquentem demais. Se o nível de óleo estiver baixo, o motor não se lubrifica bem, o que pode causar superaquecimento e até fundir o motor. É fácil evitar isso: só checar o nível de óleo de vez em quando!",
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "qe50",
        category: "mecanica",
        statement: "Em fiscalização durante chuva em rodovia, constata-se que os sulcos dos pneus estão abaixo do limite legal. Os riscos decorrentes dessa condição para a segurança viária incluem:",
        options: ["Perda de aderência em asfalto molhado facilitando a aquaplanagem, aumento drástico da distância de frenagem e risco de estouro do pneu por fadiga estrutural.", "Redução do consumo de combustível devido à maior aderência do composto de borracha em curvas fechadas.", "Bloqueio espontâneo das rodas dianteiras por fadiga térmica do sistema de suspensão ativa.", "Desalinhamento instantâneo do sistema de direção hidráulica devido à menor área de atrito de rolamento."],
        correctIndex: 0,
        explanation: "Pneus carecas comprometem a drenagem de água e a aderência, aumentando riscos de aquaplanagem e acidentes.",
        detailedExplanation: "Quando o pneu tá careca, ele não consegue escoar a água na pista molhada. Isso faz com que o carro perca a aderência e deslize, principalmente em curvas e frenagens. Usar pneu careca é uma infração GRAVE e pode colocar todo mundo em perigo.",
        incidence: "altissima",
        difficulty: 3
    },
    {
        id: "qe51",
        category: "mecanica",
        statement: "Durante o tráfego em via expressa, o fluido circula continuamente entre o bloco, o cabeçote e o radiador. A função técnica primária do líquido de arrefecimento é:",
        options: ["Trocar calor com o motor para manter a temperatura operacional ideal de trabalho do bloco e do cabeçote.", "Lubrificar os cilindros e pistões internos para reduzir o atrito gerado pelas bielas.", "Aumentar a octanagem da mistura combustível-ar no interior das câmaras de explosão.", "Limpar a carbonização depositada nas válvulas de admissão e no coletor de escapamento do veículo."],
        correctIndex: 0,
        explanation: "O líquido de arrefecimento circula pelo motor e radiador para dissipar o calor gerado.",
        detailedExplanation: "O líquido de arrefecimento, que é a mistura de água e aditivo, passa pelo motor e absorve o calor, jogando esse calor fora no radiador. Ele mantém o motor na temperatura certa, em torno de 90°C, pra evitar que ele superaqueça e estrague.",
        incidence: "media",
        difficulty: 3
    },
    {
        id: "qe52",
        category: "mecanica",
        statement: "Luz indicadora amarela acesa no painel indica anomalia que requer verificação técnica, sem parada imediata.",
        options: ["Uma anomalia de funcionamento que necessita de verificação técnica no sistema de injeção ou motor, sem necessidade de parada imediata no acostamento, mas com inspeção breve recomendada.", "Um problema crítico e de perigo iminente que exige a parada imediata do veículo na pista de rolamento por falta de pressão de óleo do motor.", "A ativação do modo de economia de energia por falha mecânica no alternador elétrico principal.", "A indicação de que o veículo entrou na reserva de fluido de freio traseiro ativa."],
        correctIndex: 0,
        explanation: "Luz amarela indica alerta de anomalia, recomendando inspeção breve, mas não parada imediata.",
        detailedExplanation: "As luzes do painel têm cores que falam: AMARELA (ou laranja) é ALERTA — precisa olhar logo, mas não precisa parar agora (ex: luz de injeção, pneu baixo). VERMELHA é PERIGO — tem que parar o carro assim que der (ex: pressão do óleo, temperatura do motor). Ignorar luz amarela pode causar dor de cabeça depois.",
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "qe53",
        category: "mecanica",
        statement: "O fluido de freio é o elemento hidráulico que transmite a força aplicada no pedal até as pinças e tambores. Nos termos da manutenção preventiva, esse fluido deve ser inspecionado periodicamente e:",
        options: ["Substituído periodicamente conforme prazo do manual do proprietário (geralmente a cada 1 ou 2 anos ou quilometragem equivalente), devido à sua característica higroscópica (absorção de umidade).", "Completado semanalmente com água desmineralizada para manter o nível máximo do reservatório plástico.", "Substituído apenas se o condutor constatar que o pedal de freio está extremamente rígido e alto.", "Trocar somente quando houver mistura acidental com o óleo lubrificante da caixa de marchas."],
        correctIndex: 0,
        explanation: "O fluido de freio absorve umidade do ar (higroscópico), exigindo substituição periódica conforme manual.",
        detailedExplanation: "O fluido de freio é HIGROSCÓPICO, ou seja, ele absorve a umidade do ar. Com água no fluido, o ponto de ebulição diminui, e se você frear muito, pode fazer o fluido ferver e o pedal ficar mole, sem frear direito. Por isso, é importante trocar a cada 1 ou 2 anos, mesmo que o carro não rode muito.",
        incidence: "media",
        difficulty: 3
    },
    {
        id: "qe54",
        category: "mecanica",
        statement: "A calibragem adequada sustenta a dirigibilidade, o consumo e a vida útil da banda de rodagem. Pela técnica de manutenção de veículos, o procedimento correto de calibragem dos pneus deve ocorrer:",
        options: ["Com os pneus frios (antes de rodar mais do que 3 km), utilizando os valores de pressão nominal recomendados pelo fabricante do veículo.", "Com os pneus quentes logo após longas viagens em rodovias, retirando o excesso de pressão gerado pelo calor de atrito.", "Utilizando sempre a pressão máxima gravada na banda lateral do pneu, independente da carga útil do automóvel.", "Apenas quando o condutor notar visualmente que os flancos do pneu estão encostando na banda de rodagem."],
        correctIndex: 0,
        explanation: "A calibragem deve ser feita com pneus frios, seguindo a pressão do fabricante do veículo.",
        detailedExplanation: "Verifique a pressão com os pneus FRIOS, ou seja, sem ter rodado mais de 1 km ou parado por 3 horas. Quando eles esquentam, a pressão sobe e você pode acabar calibrando errado. Isso pode causar desgaste nos pneus, gastar mais combustível e prejudicar a segurança do carro.",
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "qe55",
        category: "prioridade",
        statement: "Para utilizarem livre circulação, veículos de emergência devem estar em efetiva prestação de serviço, com luzes e sirene ligadas.",
        options: ["Estejam em efetiva prestação de serviço de urgência, devidamente identificados por dispositivos luminosos intermitentes vermelhos E sonoros (sirene) ligados.", "Trafeguem sempre pela faixa de trânsito rápido à esquerda desenvolvendo velocidade acima da média da via.", "Sejam de propriedade governamental do Estado, com placas de bronze exclusivas para autoridades municipais.", "Possuam autorização por escrito expedida pelo órgão ambiental e de trânsito estadual competentes."],
        correctIndex: 0,
        explanation: "A prioridade de veículos de emergência exige serviço de urgência com luzes e sirene ativadas (Art. 29, VII CTB).",
        detailedExplanation: "Quando a ambulância, a viatura ou o caminhão do bombeiro tá com os sinais acionados, eles têm a prioridade total. Isso significa que podem passar por sinais vermelhos e ultrapassar outros carros, mas sempre com cuidado. Se não tiver com os sinais ligados, não têm essa prioridade.",
        legalBase: "Art. 29, VII CTB",
        incidence: "altissima",
        difficulty: 3
    },
    {
        id: "qe56",
        category: "prioridade",
        statement: "O condutor trafega por via coletora e se aproxima de interseção sinalizada com a placa R-2 'Dê a Preferência', não havendo semáforo em funcionamento. A postura regulamentar exigida é:",
        options: ["Reduzir a velocidade de forma segura, avaliar o fluxo e conceder a preferência de passagem aos veículos que circulam pela via preferencial.", "Acelerar o veículo rapidamente para cruzar a interseção antes que os outros carros alcancem o cruzamento.", "Buzinar de forma sucessiva para sinalizar a intenção de manter a velocidade linear original no cruzamento.", "Parar obrigatoriamente de forma completa o veículo mesmo que não haja qualquer tráfego na via transversal."],
        correctIndex: 0,
        explanation: "A placa R-2 exige reduzir e dar preferência aos veículos que circulam pela via preferencial.",
        detailedExplanation: "Se você tá na via secundária e quer entrar na via preferencial, é preciso dar passagem pra quem já tá lá. A via preferencial sempre tem prioridade, então reduza a velocidade e só entre quando for seguro, sem apressar a passagem.",
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "qe57",
        category: "prioridade",
        statement: "Em trecho não pavimentado de via estreita com declive acentuado, dois veículos se aproximam em sentidos opostos. Pelo CTB, a preferência de passagem pertence ao veículo que:",
        options: ["Estiver em aclive (subindo) a ladeira, devendo o condutor do veículo que desce dar a preferência de passagem.", "Trafegar no sentido de descida da ladeira, por estar desenvolvendo maior energia cinética linear.", "Sinalizar a intenção de manobra primeiro acionando o pisca-alerta ou buzina de forma prolongada.", "Apresentar menor capacidade de tração mecânica nominal ou peso bruto total inferior."],
        correctIndex: 0,
        explanation: "Em aclive, o veículo que sobe tem preferência; o que desce deve dar passagem (Art. 29, III, 'e' CTB).",
        detailedExplanation: "Em ruas estreitas e íngremes, o carro que sobe sempre tem a prioridade. Isso é por segurança, já que é mais complicado e arriscado para quem está subindo dar ré do que para quem desce. O carro que desce deve voltar até um lugar seguro para o carro que sobe passar.",
        legalBase: "Art. 29, III, 'e' CTB",
        incidence: "media",
        trap: true,
        difficulty: 3
    },
    {
        id: "qe58",
        category: "prioridade",
        statement: "Ao transitar em via com fluxo misto de ciclistas e pedestres, o condutor pretende ultrapassar bicicleta. Pela regra de conduta do CTB, a atitude correta é:",
        options: ["Manter a distância lateral mínima de 1,5 metros ao ultrapassar uma bicicleta e reduzir a velocidade para garantir a segurança viária.", "Buzinar continuamente ao lado do ciclista para alertá-lo sobre a aproximação veloz do veículo automotor.", "Avançar o veículo para a borda da pista para forçar a bicicleta a subir na calçada destinada exclusivamente a pedestres.", "Ignorar a travessia de pedestres em locais sem faixa de segurança, mantaining a velocidade máxima permitida da via."],
        correctIndex: 0,
        explanation: "A ultrapassagem de bicicleta exige distância lateral mínima de 1,5 metros e redução de velocidade.",
        detailedExplanation: "Os ciclistas e pedestres são os mais vulneráveis no trânsito, então a gente precisa ter atenção redobrada. O Código de Trânsito fala que eles têm prioridade, especialmente os que estão nas faixas. A vida deles vale mais do que a pressa de quem está dirigindo.",
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "qe59",
        category: "legislacao",
        statement: "Avançar a placa R-1 'Parada Obrigatória' configura infração de natureza:",
        options: ["Infração de natureza gravíssima, punida com multa administrativa pecuniária e acúmulo de 7 pontos na CNH.", "Infração grave, gerando a medida administrativa de retenção do veículo até a vistoria do agente fiscalizador.", "Infração média, passível de perdão automático caso o cruzamento estivesse livre de outros veículos.", "Crime de trânsito de lesão potencial à segurança viária coletiva, com suspensão direta da habilitação por 3 meses."],
        correctIndex: 0,
        explanation: "Desrespeitar a placa PARE é infração gravíssima, com 7 pontos e multa (Art. 208 CTB).",
        detailedExplanation: "Quando você ignora a placa PARE e não para o carro, isso é considerado uma infração GRAVÍSSIMA, que dá 7 pontos na CNH e multa. A placa pede que você pare totalmente, não só diminua a velocidade, e mesmo que não venha ninguém, é preciso parar e olhar antes de seguir.",
        legalBase: "Art. 208 CTB",
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "qe60",
        category: "direcao-defensiva",
        statement: "Em declive longo de rodovia, usar só o freio pode aquecer o sistema e causar falha. Pela direção defensiva, como o condutor deve descer para conter a velocidade?",
        options: ["Descer em ponto morto e pisar no freio de vez em quando para aliviar o esforço do sistema.", "Descer desengatado para gastar menos combustível e frear forte apenas se passar do limite.", "Descer com o veículo engrenado em marcha reduzida, usando o freio-motor para segurar a velocidade.", "Manter o pé no freio durante todo o declive, com marcha alta engatada para ganhar embalo."],
        correctIndex: 2,
        explanation: "Desça engrenado em marcha reduzida e use o freio-motor. Descer desengrenado é infração média pelo art. 231, inciso IX, do CTB.",
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
        statement: "Em declive acentuado, o motorista desliga o motor ou põe o câmbio em ponto morto, na chamada banguela. Pelo CTB, como essa conduta é classificada?",
        options: ["Infração média, punida com multa e retenção do veículo até a regularização da situação.", "Infração leve, punida só com advertência escrita e sem nenhum ponto na habilitação.", "Infração grave, punida com suspensão da habilitação por cento e vinte dias corridos.", "Conduta liberada por lei, aceita como forma ecológica de economizar combustível na descida."],
        correctIndex: 0,
        explanation: "Descer desligado ou desengatado é infração média, com multa e retenção do veículo, conforme art. 231, inciso IX, do CTB.",
        detailedExplanation: "Quando você desce com o carro em 'banguela', perde o controle e o freio motor não ajuda. Isso pode fazer o carro esquentar e falhar, deixando tudo mais perigoso, especialmente em curvas. Sempre mantenha a marcha engatada enquanto dirige.",
        legalBase: "Art. 231, IX do CTB",
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "qe62",
        category: "legislacao",
        statement: "Durante os doze meses da permissão para dirigir, o condutor novato comete uma infração gravíssima. Pela regra da habilitação definitiva no CTB, o que acontece com ele?",
        options: ["Perde o processo e precisa recomeçar todas as etapas, com novos exames e novo curso.", "Recebe só advertência verbal e mantém a permissão se pagar a multa com desconto.", "Ganha pontos de bônus na habilitação definitiva se fizer um curso rápido de reciclagem.", "Tem a permissão suspensa por sessenta dias e depois recebe a definitiva sem refazer nada."],
        correctIndex: 0,
        explanation: "Na permissão, infração grave ou gravíssima, ou reincidência em média, impede a definitiva pelo art. 148 do CTB e obriga a recomeçar.",
        detailedExplanation: "Durante a Permissão para Dirigir (PPD), se o condutor comete uma infração gravíssima, ele não pode mais tirar a CNH definitiva. Isso significa que ele vai ter que refazer todas as etapas, desde as aulas até os exames. A PPD é um período em que é preciso ter cuidado redobrado no trânsito.",
        legalBase: "Art. 148 CTB",
        incidence: "alta",
        trap: true,
        difficulty: 3
    },
    {
        id: "qe63",
        category: "legislacao",
        statement: "Para levar crianças com segurança no carro, a lei exige o dispositivo certo para cada fase. Em qual situação o assento de elevação é obrigatório?",
        options: ["Crianças acima de quatro anos até sete anos e meio, ou com altura abaixo de um metro e quarenta e cinco.", "Bebês de até um ano de idade, ou com peso abaixo de nove quilos, no banco traseiro.", "Crianças de um a quatro anos, viradas para a frente do veículo e presas pelo cinto.", "Toda criança com menos de doze anos, sem considerar altura, peso ou idade exata."],
        correctIndex: 0,
        explanation: "O assento de elevação vale para crianças acima de quatro até sete anos e meio, ou com menos de 1,45 m, conforme art. 168 do CTB.",
        detailedExplanation: "A nova regra diz que crianças até 10 anos ou com menos de 1,45m precisam de um dispositivo de retenção no banco de trás. Antes, a idade limite era 7 anos e meio, agora é mais seguro. Se não seguir essa regra, é infração gravíssima.",
        incidence: "altissima",
        difficulty: 3
    },
    {
        id: "qe64",
        category: "direcao-defensiva",
        statement: "À noite, em pista única, o farol alto do carro contrário atinge seus olhos e causa ofuscamento. Pela direção defensiva, qual atitude evita um sinistro?",
        options: ["Olhar para a faixa branca do bordo à direita e reduzir a marcha de forma suave e segura.", "Ligar seu farol alto também para obrigar o outro motorista a baixar a luz na hora.", "Fechar os olhos por instantes repetidos para deixar a vista se recuperar do clarão.", "Ligar o pisca-alerta e frear de golpe no meio da faixa para parar o carro depressa."],
        correctIndex: 0,
        explanation: "Desvie o olhar para o bordo da pista à direita e reduza com suavidade. Nunca encare o farol alto nem freie de golpe na faixa.",
        detailedExplanation: "Quando um carro vem na sua direção com farol alto e te ofusca, nunca olhe direto para ele, porque isso pode te deixar cego por alguns segundos. O certo é desviar o olhar para a margem direita da pista e ir diminuindo a velocidade, assim você consegue manter a visão e evitar acidentes. Também é bom piscar o farol rapidinho pra avisar o outro motorista.",
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "qe65",
        category: "direcao-defensiva",
        statement: "O pisca-alerta tem uso restrito pelo CTB e não pode virar recurso de rotina. Em qual situação o motorista pode ligar o pisca-alerta com o carro em movimento?",
        options: ["Com o carro parado em emergência, ou lento sob neblina forte, ou onde a sinalização mandar.", "Para parar rapidinho em fila dupla e fazer uma compra sem procurar vaga regular.", "Para avisar pressa pessoal e passar acima do limite da via com mais espaço livre.", "Para atravessar cruzamento com parada obrigatória à noite sem precisar frear antes."],
        correctIndex: 0,
        explanation: "Use o pisca-alerta parado em emergência, ou lento sob neblina, ou onde a placa mandar, conforme art. 251 do CTB.",
        detailedExplanation: "O pisca-alerta (quatro setas piscando) deve ser usado quando o carro está PARADO em situação de EMERGÊNCIA, como pane ou acidente. Se você usar enquanto dirige, pode confundir os outros motoristas e causar acidentes. Em dias de chuva forte, use farol baixo ou de neblina, e não o pisca-alerta.",
        legalBase: "Art. 251 CTB",
        incidence: "alta",
        trap: true,
        difficulty: 3
    },
    {
        id: "qe66",
        category: "infracoes",
        statement: "O motorista entra com o carro na contramão de uma rua sinalizada com sentido único. Pelo art. 186 do CTB, como essa conduta é classificada?",
        options: ["Infração gravíssima, punida com multa e sete pontos registrados na habilitação.", "Infração grave, punida com remoção do carro ao pátio em qualquer situação.", "Infração média, sem ponto algum se o motorista provar que não conhecia o local.", "Crime de trânsito, punido com apreensão definitiva do veículo pelo agente."],
        correctIndex: 0,
        explanation: "Transitar pela contramão em via de sentido único é infração gravíssima, com multa e sete pontos, pelo art. 186 do CTB.",
        detailedExplanation: "Quando você vai na contramão, está infringindo a lei e pode levar 7 pontos na CNH e uma multa. Isso é muito perigoso, pois pode causar acidentes sérios, como colisões frontais. E fique ligado: até sair de estacionamento na contramão é infração!",
        legalBase: "Art. 186 CTB",
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "qe67",
        category: "infracoes",
        statement: "Após bater o carro e ver feridos que precisam de ajuda, o motorista podia socorrer, mas foge sem ajudar nem chamar resgate. Pelo CTB, como fica essa conduta?",
        options: ["Infração gravíssima e também crime de trânsito, por deixar de prestar socorro à vítima.", "Apenas infração grave, com culpa jogada só para o dono do veículo registrado.", "Infração média, punida só com multa simples na primeira vez do motorista.", "Conduta sem punição, desde que outra pessoa depois socorra as vítimas no local."],
        correctIndex: 0,
        explanation: "Deixar de socorrer vítima podendo fazer isso é infração gravíssima e crime pelo art. 304 do CTB, além do dever do art. 135 do Código Penal.",
        detailedExplanation: "Quando o motorista não ajuda quem se machucou e tinha como fazer isso, ele comete um crime segundo o art. 304 do CTB, que pode dar até 1 ano de prisão e multa. Se ele causou o acidente e ainda foge, a pena aumenta.",
        legalBase: "Art. 304 CTB",
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "qe68",
        category: "primeiros-socorros",
        statement: "Após colisão na pista, a vítima está inconsciente, sem respirar e sem pulso, em parada cardiorrespiratória. O que o socorrista leigo deve iniciar na hora?",
        options: ["Compressões no centro do peito, de cem a cento e vinte por minuto, até chegar o resgate.", "Dar água morna pela boca e pôr pano frio na testa para a vítima despertar.", "Sentar a vítima com a cabeça para trás e massagear forte os ombros dela.", "Fazer só boca a boca por dez minutos e só depois pensar nas compressões."],
        correctIndex: 0,
        explanation: "Sem respiração e sem pulso, inicie compressões de peito em ritmo de cem a cento e vinte por minuto e peça ajuda sem demora.",
        detailedExplanation: "Na parada cardiorrespiratória (PCR), cada segundo é precioso. Comece com 30 compressões rápidas (100 a 120 por minuto, pressionando 5 a 6 cm) e, se souber, faça 2 respirações. Se não souber, só as compressões já ajudam bastante. Lembre-se: a manobra de Heimlich é pra engasgo, não pra PCR.",
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "qe69",
        category: "meio-ambiente",
        statement: "O dono do carro é chamado para a inspeção técnica na vistoria oficial. No campo da segurança e do meio ambiente, qual é o objetivo central desse programa?",
        options: ["Checar freios, luzes e estrutura, além de medir gases e ruído dentro do limite legal.", "Definir o preço de venda do carro para cobrar o imposto estadual do ano vigente.", "Trocar por obrigação toda peça que passou de cinquenta mil quilômetros rodados.", "Confirmar se o dono pagou as parcelas do financiamento feito no banco."],
        correctIndex: 0,
        explanation: "A inspeção confere as condições de segurança do veículo e o respeito aos limites de emissão de gases e ruído, conforme art. 104 do CTB.",
        detailedExplanation: "A inspeção veicular (obrigatória em alguns estados) verifica se o carro está em boas condições de segurança, como freios e pneus, e também se está dentro dos limites de poluição. O objetivo é evitar riscos para quem está dentro do carro e para o planeta.",
        incidence: "media",
        difficulty: 3
    },
    {
        id: "qe70",
        category: "mecanica",
        statement: "Antes de viajar longe de carro cheio de malas, o motorista quer evitar pane na rodovia. Qual cuidado preventivo com pneus, fluidos e itens do carro é o mais certo?",
        options: ["Medir óleo, arrefecimento e freio, testar luzes, calibrar pneus com estepe e conferir triângulo, macaco e chave.", "Trocar por obrigação todo o fluido da direção e os dois amortecedores dianteiros antes de sair.", "Lavar o motor com jato forte de água e passar óleo nas mangueiras de borracha do cofre.", "Encher todos os pneus com o dobro da pressão indicada para aguentar o peso das malas."],
        correctIndex: 0,
        explanation: "Confira fluidos, luzes, calibragem com estepe e itens obrigatórios. Revisão simples evita pane e sinistro na rodovia.",
        detailedExplanation: "Fazer uma checagem antes de viajar é essencial: confira se os pneus estão calibrados e em bom estado, o nível do óleo do motor e do líquido de arrefecimento, e se as luzes e os freios estão funcionando. Isso ajuda a evitar problemas e garante uma viagem mais segura.",
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "qe71",
        category: "legislacao",
        statement: "Em rua urbana classificada como via local, sem nenhuma placa de velocidade, qual limite máximo o motorista deve respeitar por força do CTB?",
        options: ["Trinta por hora, limite das vias locais de tráfego leve em área residencial.", "Quarenta por hora, limite próprio das vias coletoras sem semáforo instalado.", "Sessenta por hora, limite próprio das vias arteriais de tráfego mais intenso.", "Oitenta por hora, limite geral de toda rodovia federal com pavimento."],
        correctIndex: 0,
        explanation: "Sem sinalização, a via urbana local tem máxima de trinta por hora, pelo art. 61 do CTB. Decore: local trinta, coletora quarenta.",
        detailedExplanation: "Isso vale para ruas onde o tráfego é mais tranquilo e tem bastante movimento de pedestres. O CTB coloca esses limites pra garantir a segurança de todos.",
        legalBase: "Art. 61 CTB",
        incidence: "altissima",
        difficulty: 3
    },
    {
        id: "qe72",
        category: "legislacao",
        statement: "Em rodovia rural de pista dupla, sem placa de velocidade, um carro de passeio segue viagem. Pela regra do CTB, qual é a máxima permitida para esse carro?",
        options: ["Cento e dez por hora, máxima do carro, caminhonete e moto em pista dupla rural.", "Noventa por hora, máxima que vale para ônibus e caminhão nesse mesmo trecho.", "Cem por hora, máxima que vale para carro em pista simples sem sinalização.", "Cento e vinte por hora, máxima liberada em rodovia sob concessão privada."],
        correctIndex: 0,
        explanation: "Sem placa, o carro em pista dupla rural vai a cento e dez por hora, pelo art. 61 do CTB. Noventa é limite de ônibus e caminhão.",
        detailedExplanation: "Quando não tem sinalização, os limites são: 110 km/h para carros, 90 km/h para ônibus e caminhões, e 80 km/h para outros veículos. Em estradas rurais, o limite para carros cai para 60 km/h.",
        legalBase: "Art. 61 CTB",
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "qe73",
        category: "legislacao",
        statement: "O CTB separa rodovias de estradas, sendo estrada a via rural sem pavimento. Sem placa no local, qual é a máxima padrão na estrada para todo veículo?",
        options: ["Sessenta por hora para todo tipo de veículo automotor que passa pela estrada.", "Oitenta por hora para carro leve e sessenta para veículo pesado articulado.", "Noventa por hora só para moto e caminhonete leve em trecho de terra.", "Cinquenta por hora para todos, por causa da falta de asfalto e do risco de derrapar."],
        correctIndex: 0,
        explanation: "Sem sinalização, a máxima na estrada é sessenta por hora para todo veículo, pelo art. 61 do CTB. Não confunda com rodovia.",
        detailedExplanation: "O CTB separa rodovias (vias pavimentadas) de estradas (vias rurais não pavimentadas). Sem sinalização, o limite é 60 km/h para carros, caminhonetes e motos, e 30 km/h para outros veículos, já que as estradas têm mais buracos e pedras soltas.",
        legalBase: "Art. 61 CTB",
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "qe74",
        category: "direcao-defensiva",
        statement: "Sob neblina densa na rodovia, com visibilidade muito curta e tráfego forte, qual conduta com faróis e velocidade mantém a segurança do condutor?",
        options: ["Ligar farol baixo ou de neblina, tirar o pé de forma suave e manter folga do carro da frente.", "Ligar farol alto fixo para tentar furar a cortina de gotas suspensas no ar.", "Ligar o pisca-alerta e acelerar para sair depressa do trecho com neblina.", "Andar só com lanterna de posição e manter a velocidade normal da rodovia."],
        correctIndex: 0,
        explanation: "Na neblina, use farol baixo ou de neblina e reduza com suavidade. Farol alto reflete nas gotas e pisca-alerta em movimento confunde.",
        detailedExplanation: "Com neblina densa, o farol alto é ruim porque reflete nas gotículas de água e cria uma 'parede branca', dificultando a visão. O ideal é usar o farol baixo e, se tiver, o farol de neblina, que ilumina melhor sem ofuscar. Lembre-se: pisca-alerta em movimento é proibido e pode confundir os outros motoristas.",
        incidence: "alta",
        trap: true,
        difficulty: 3
    },
    {
        id: "qe75",
        category: "infracoes",
        statement: "Para largar malas rapidinho, o motorista para o carro sobre a calçada de pedestres. Pelo CTB, como esse ato de estacionar no passeio é classificado?",
        options: ["Infração grave, punida com multa e remoção do veículo pelo agente de trânsito.", "Infração leve, resolvida só com aviso oral se o motorista ficar dentro do carro.", "Infração média, com culpa passada para o pedestre que ficou sem passagem.", "Crime de trânsito, punido com prisão de quinze a trinta dias para o motorista."],
        correctIndex: 0,
        explanation: "Estacionar no passeio ou na calçada é infração grave, com multa e remoção, pelo art. 181, inciso VIII, do CTB.",
        detailedExplanation: "Parar o carro na calçada (passeio público) é considerado uma infração GRAVE, que gera 5 pontos na CNH e multa. A calçada é só para os pedestres, e deixar o carro lá força as pessoas a descerem para a rua, o que é perigoso, principalmente para quem tem dificuldades de locomoção.",
        legalBase: "Art. 181, VIII CTB",
        incidence: "media",
        difficulty: 3
    },
    {
        id: "qe76",
        category: "infracoes",
        statement: "Em fiscalização, os passageiros do banco traseiro estão sem cinto de segurança. Pelo CTB, quem responde pela infração e qual é a sua classificação?",
        options: ["O condutor do veículo, por infração grave, com multa e retenção do veículo até colocação do cinto.", "Cada passageiro maior de idade, pois responde sozinho pelos próprios atos dentro do veículo.", "Apenas o proprietário do veículo, desde que esteja presente no carro no momento da abordagem.", "Condutor e passageiros de forma solidária, com multas separadas aplicadas pelo município."],
        correctIndex: 0,
        explanation: "O cinto é obrigatório para todos no veículo. Se passageiro está sem cinto, a multa é do condutor, por infração grave (art. 65 e 168 do CTB).",
        detailedExplanation: "O cinto é obrigatório pra todo mundo no carro, até quem tá atrás. Mesmo que o passageiro escolha não usar, a multa é do motorista, porque ele é o responsável. Essa infração dá 5 pontos na carteira e pode machucar muito em um acidente, já que um passageiro sem cinto pode ferir os da frente.",
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "qe77",
        category: "direcao-defensiva",
        statement: "O motorista bebe uma lata de cerveja e assume a direção do veículo. Pela Lei Seca, mesmo com pequena dose de álcool, qual é a consequência prevista?",
        options: ["Infração gravíssima, com multa multiplicada por dez, suspensão por 12 meses e retenção do veículo.", "Advertência por escrito, com permissão para seguir se o teste ficar abaixo de 0,34 mg por litro.", "Infração leve, punida apenas com multa simples, sem retenção do veículo e sem suspensão.", "Crime de trânsito automático, com prisão imediata por qualquer quantidade mínima de álcool."],
        correctIndex: 0,
        explanation: "Qualquer álcool ao dirigir gera infração gravíssima, com multa multiplicada por dez, suspensão por 12 meses e retenção do veículo (art. 165 do CTB).",
        detailedExplanation: "A Lei Seca não permite nenhum álcool no sangue ao dirigir. Mesmo uma lata de cerveja já pode te colocar em apuros, com multa alta e perda da carteira por um ano. Acima de certos níveis, você pode até ser preso por crime de trânsito.",
        incidence: "altissima",
        trap: true,
        difficulty: 3
    },
    {
        id: "qe78",
        category: "primeiros-socorros",
        statement: "Um adulto consciente engasga com alimento, não fala nem tosse e leva as mãos ao pescoço. Qual manobra deve ser aplicada para liberar a via aérea?",
        options: ["Manobra de Heimlich, com compressões abdominais rápidas para dentro e para cima, acima do umbigo.", "Deitar a vítima de lado e fazer respiração boca a boca com sopro forte para empurrar o alimento.", "Dar pão seco e grandes goles de água morna para empurrar o objeto preso para o estômago.", "Dar golpes fortes na nuca da vítima sentada até que o alimento seja expelido pela tosse."],
        correctIndex: 0,
        explanation: "Na obstrução total em adulto consciente, aplique a manobra de Heimlich, com compressões firmes acima do umbigo até expelir o objeto.",
        detailedExplanation: "Quando alguém está engasgado e consciente, você deve fazer a manobra de Heimlich. Fique atrás da pessoa, envolva-a com os braços, coloque o punho acima do umbigo e faça compressões rápidas para dentro e para cima. Isso ajuda a tirar o que está bloqueando a respiração.",
        incidence: "media",
        difficulty: 3
    },
    {
        id: "qe79",
        category: "meio-ambiente",
        statement: "Um motociclista troca o escapamento original por modelo esportivo aberto e circula com ruído acima do limite. Pelo CTB, como essa conduta é enquadrada?",
        options: ["Infração grave, com multa e retenção da motocicleta para regularizar o escapamento.", "Infração média, punida apenas com multa, sem previsão de retenção do veículo.", "Crime ambiental, com recolhimento imediato da habilitação do motociclista.", "Infração gravíssima, com cassação do direito de dirigir motocicleta por dois anos."],
        correctIndex: 0,
        explanation: "Conduzir com escapamento irregular e ruído excessivo é infração grave, com multa e retenção para regularizar (art. 230 do CTB).",
        detailedExplanation: "Se a moto tiver escapamento modificado e barulhento, isso é considerado infração GRAVE, com 5 pontos na CNH e multa. Além disso, a moto pode ser retida até o escapamento voltar ao normal, já que isso causa poluição sonora e pode incomodar os outros.",
        legalBase: "Art. 230, IX CTB",
        incidence: "media",
        difficulty: 3
    },
    {
        id: "qe80",
        category: "mecanica",
        statement: "Antes de ligar o motor, o condutor percebe forte cheiro e manchas de combustível sob o capô. Diante do risco de incêndio, qual é a conduta correta?",
        options: ["Não ligar o motor, manter o veículo parado em local ventilado e chamar reboque para oficina.", "Ligar o motor em alta rotação para queimar o combustível acumulado e secar o vazamento.", "Jogar detergente sobre a mancha para diluir o combustível e seguir viagem normalmente.", "Ignorar o vazamento se o painel não acender luz vermelha de superaquecimento do motor."],
        correctIndex: 0,
        explanation: "Vazamento de combustível traz risco de incêndio. Não dê partida, deixe o veículo parado em local ventilado e chame reboque.",
        detailedExplanation: "Quando tem vazamento de combustível, é uma situação de EMERGÊNCIA. O combustível pega fogo fácil, e qualquer faísca pode causar um incêndio. Além disso, o combustível que vaza pode poluir o meio ambiente, então é melhor agir rápido e seguro.",
        incidence: "media",
        difficulty: 3
    },
    {
        id: "qe81",
        category: "prioridade",
        statement: "Ao sair de garagem e entrar em via pública, o condutor cruza a calçada com pedestres e encontra fluxo de veículos. A quem deve dar preferência?",
        options: ["Aos pedestres que passam pela calçada e aos veículos que já circulam pela via pública.", "A ninguém, pois quem sai da garagem tem prioridade se buzinar e acelerar rápido.", "Apenas aos veículos que vêm pela esquerda, passando na frente de pedestres e demais carros.", "Apenas aos ciclistas que circulam na contramão da via secundária próxima ao imóvel."],
        correctIndex: 0,
        explanation: "Quem sai de imóvel ou garagem deve dar preferência a pedestres na calçada e a veículos da via (art. 36 do CTB).",
        detailedExplanation: "Quando você está saindo de uma garagem, precisa dar prioridade para quem já está na via, tanto pedestres quanto veículos. É importante parar, sinalizar e só entrar quando der pra fazer isso com segurança. Ignorar essa regra pode causar acidentes.",
        legalBase: "Art. 36 CTB",
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "qe82",
        category: "legislacao",
        statement: "Um veículo circula com a placa traseira suja e com caracteres encobertos, sem legibilidade. Pelo CTB, como essa irregularidade é classificada?",
        options: ["Infração gravíssima, com multa, remoção do veículo e recolhimento do certificado de licenciamento.", "Infração média, punida apenas com multa, sem remoção do veículo ou retenção de documento.", "Infração grave, com permissão para circular por 48 horas se houver agendamento de nova placa.", "Infração leve, resolvida apenas com advertência verbal do agente de trânsito."],
        correctIndex: 0,
        explanation: "Circular com placa sem legibilidade é infração gravíssima, com multa, remoção do veículo e recolhimento do licenciamento (art. 230 do CTB).",
        detailedExplanation: "A placa do carro precisa estar sempre limpa e fácil de ler, sem sujeira ou adesivos. Se tiver qualquer coisa que atrapalhe a leitura, é infração gravíssima, com 7 pontos e multa, além de poder levar o carro pro depósito. A placa é como o RG do veículo e deve ser visível pra fiscalização.",
        legalBase: "Art. 230, IV CTB",
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "qe83",
        category: "direcao-defensiva",
        statement: "Após ultrapassar um caminhão em rodovia de pista única, o motorista quer voltar para a faixa de origem. Qual é o procedimento seguro de retorno?",
        options: ["Sinalizar com a seta para a direita e retornar apenas após ver o caminhão inteiro no retrovisor interno.", "Voltar para a faixa logo após passar o para-lama dianteiro do caminhão para liberar a contramão.", "Reduzir na contramão até emparelhar com o caminhão e buzinar antes de retornar à faixa.", "Ligar o pisca-alerta durante todo o retorno para indicar manobra de emergência na rodovia."],
        correctIndex: 0,
        explanation: "Sinalize a volta com a seta e só retorne após visualizar o caminhão por completo no retrovisor interno, garantindo distância segura.",
        detailedExplanation: "Depois de ultrapassar, olhe bem no retrovisor interno e só retorne quando o caminhão estiver todo visível. Isso garante que você tem espaço suficiente pra manobrar sem risco de acidente. Se voltar muito rápido, pode acabar fechando o caminhão e causar uma batida.",
        incidence: "media",
        difficulty: 3
    },
    {
        id: "qe84",
        category: "infracoes",
        statement: "À noite, em via urbana com boa iluminação pública, o condutor desliga os faróis e circula apenas com faroletes. Essa atitude configura qual infração?",
        options: ["Infração média, com multa e pontos na habilitação por usar apenas luz de posição à noite.", "Infração grave, com suspensão do licenciamento até aprovação em vistoria técnica.", "Conduta permitida, pois a boa iluminação pública dispensa o uso do farol baixo à noite.", "Infração leve, punida apenas com advertência verbal se o veículo estiver em baixa velocidade."],
        correctIndex: 0,
        explanation: "Circular à noite apenas com faroletes é infração média, com multa e pontos na habilitação (art. 250 do CTB).",
        detailedExplanation: "Usar só as luzes de posição à noite é infração média, com 4 pontos na CNH e multa. O farol baixo deve estar ligado das 18h às 6h em vias públicas, pois é perigoso não ser visto por outros veículos e pedestres.",
        legalBase: "Art. 250 CTB",
        incidence: "media",
        difficulty: 3
    },
    {
        id: "qe85",
        category: "legislacao",
        statement: "Um carro sem luz de condução diurna circula de dia em rodovia de pista simples fora da cidade. O que o CTB exige quanto ao uso do farol baixo?",
        options: ["Manter o farol baixo aceso durante o dia em rodovias de pista simples fora do perímetro urbano.", "Manter o farol baixo aceso em qualquer via urbana ou rural, mesmo com luz de condução diurna.", "Usar o farol baixo apenas em túneis, neblina ou chuva forte, sem exigência nas demais rodovias.", "Usar o farol baixo apenas em rodovias com pedágio e fluxo rápido durante os fins de semana."],
        correctIndex: 0,
        explanation: "Sem luz de condução diurna, o farol baixo é obrigatório de dia em rodovia de pista simples fora da cidade (art. 40 do CTB).",
        detailedExplanation: "A regra do farol baixo diz que, nessas rodovias, o farol deve estar aceso sempre. Em rodovias com pista dupla e canteiro central, não precisa usar farol de dia, mas muitos motoristas preferem deixar ligado por segurança. Lembre-se: em situações como chuva ou neblina, o farol baixo é sempre necessário.",
        legalBase: "Lei 13.290/16",
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "qp16",
        category: "placas",
        statement: "O condutor busca posto, telefone de emergência e hospital e usa placas para se orientar. Qual grupo de sinalização indica serviços auxiliares?",
        options: ["Regulamentação, que informa condições, proibições, obrigações ou restrições no uso das vias.", "Advertência, que alerta para condições perigosas, obstáculos ou riscos existentes na pista.", "Indicação, que identifica vias e locais de interesse e orienta sobre destinos e serviços auxiliares.", "Obras e eventos temporários, que informa sobre trabalhos na pista e interdições provisórias."],
        correctIndex: 2,
        explanation: "Placas de indicação orientam sobre destinos e serviços auxiliares, como posto, hospital e telefone (sinalização azul).",
        detailedExplanation: "A sinalização de INDICAÇÃO (série I) ajuda o motorista a encontrar serviços como hospitais e postos de gasolina. Ela é dividida em placas AZUIS para serviços, VERDES para cidades e distâncias, MARRONS para turismo e BRANCAS para ruas. Ao contrário das placas que obrigam ou alertam, as de indicação só informam.",
        incidence: "media",
        difficulty: 2
    },
    {
        id: "q4",
        category: "primeiros-socorros",
        statement: "Após colisão traseira, a vítima consciente sente forte dor no pescoço e não move braços nem pernas. Até a chegada do socorro, qual é a primeira conduta?",
        options: ["Retirar a vítima do carro puxando pelos braços para evitar possível risco de incêndio.", "Dar água e analgésico e massagear o pescoço da vítima para aliviar a dor intensa.", "Manter a vítima imóvel, com pescoço e coluna alinhados, sem movimentação desnecessária.", "Ajudar a vítima a sentar ereta para melhorar a circulação do sangue pelo corpo."],
        correctIndex: 2,
        explanation: "Com dor no pescoço e perda de movimentos, mantenha a vítima imóvel e alinhada, sem mover pescoço e coluna até o socorro chegar.",
        detailedExplanation: "Manter a vítima na mesma posição evita que ela se machuque mais. Não mova a pessoa a menos que seja realmente necessário, como em caso de fogo. E nunca ofereça água pra quem tá inconsciente, pode ser perigoso.",
        commonMistake: "Muita gente acha que deve fazer respiração boca a boca, mas isso só é pra quem não tá respirando.",
        tip: "Dor no pescoço = Fica parado e alinhado.",
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "q5",
        category: "infracoes",
        statement: "Em blitz da Lei Seca, o etilômetro aponta álcool acima da tolerância. Pelo art. 165 do CTB, qual é a infração e a penalidade aplicada ao condutor?",
        options: ["Infração grave, punida com multa de cinco vezes o valor base da autuação.", "Infração gravíssima, com multa multiplicada por dez e suspensão do direito de dirigir por 12 meses.", "Infração média, punida com multa e apreensão definitiva da habilitação do condutor.", "Crime inafiançável, com perda imediata do direito de dirigir pelo período de cinco anos."],
        correctIndex: 1,
        explanation: "Dirigir sob efeito de álcool é infração gravíssima, com multa multiplicada por dez e suspensão por 12 meses (art. 165 do CTB).",
        detailedExplanation: "Com a Lei Seca, qualquer quantidade de álcool no sangue já é motivo pra multa alta (10 vezes o valor) e suspensão do direito de dirigir. Se você recusar o bafômetro, a punição é a mesma. E se o teste mostrar muito álcool, pode até dar cadeia!",
        legalBase: "Art. 165 e 306 do CTB",
        incidence: "altissima",
        difficulty: 3
    },
    {
        id: "q6",
        category: "prioridade",
        statement: "Dois carros chegam juntos a uma interseção urbana sem semáforo nem placas. Pela regra geral do CTB, quem tem preferência para passar pelo cruzamento?",
        options: ["O carro da via principal, pois a hierarquia da via prevalece sobre a regra geral de passagem.", "O veículo que vier pela direita do outro, pela regra geral de preferência sem sinalização.", "O veículo em maior velocidade, pois demonstra maior fluidez para liberar o cruzamento.", "O veículo que ligar primeiro a seta, independente da posição no cruzamento."],
        correctIndex: 1,
        explanation: "Em interseção sem sinalização, a preferência é de quem vem pela direita (art. 29 do CTB).",
        detailedExplanation: "A regra é simples: em cruzamentos sem placas ou sem luzes, o carro que vem pela DIREITA passa primeiro. Lembre-se das exceções: quem está em rotatória ou em via preferencial (geralmente mais larga) passa na frente, e os veículos de emergência sempre têm prioridade.",
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
        statement: "A placa R-1 de parada obrigatória tem formato único entre as de regulamentação. Qual é esse formato e qual é a sua vantagem para o reconhecimento?",
        options: ["Formato octogonal, que permite reconhecer a placa mesmo vista pelo verso ou com poeira.", "Formato triangular invertido, usado para marcar transição de vias urbanas de grande fluxo.", "Formato circular padrão, criado para diferenciar das placas de advertência em losango.", "Formato retangular azul, usado para indicar área de estacionamento regulamentado."],
        correctIndex: 0,
        explanation: "A placa R-1 tem formato octogonal, único na regulamentação, para ser reconhecida até pelo verso ou com poeira.",
        detailedExplanation: "A placa PARE (R-1) tem 8 lados, é vermelha com letras brancas e manda parar TOTAL antes da faixa. Se não parar, é infração gravíssima (7 pontos). Ela é a única octogonal pra ser reconhecida em qualquer situação.",
        commonMistake: "Muita gente confunde com placas de aviso por causa do formato. Lembre-se: PARE é REGULAMENTAÇÃO.",
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "q8",
        category: "meio-ambiente",
        statement: "Com escapamento adulterado, o veículo emite gases acima do limite em medição ambiental. Pelo CTB, qual é a sanção prevista para essa irregularidade?",
        options: ["Apenas advertência por escrito emitida pelo órgão ambiental estadual competente.", "Infração grave, com multa e retenção do veículo para regularizar a emissão de poluentes.", "Infração gravíssima, com remoção do veículo e cassação da licença de funcionamento.", "Crime ambiental, com detenção imediata do motorista em flagrante pela fiscalização."],
        correctIndex: 1,
        explanation: "Emitir gases acima do limite é infração grave, com multa e retenção para regularizar (art. 231 do CTB).",
        detailedExplanation: "Pelo CTB, se o veículo estiver emitindo mais poluentes do que o permitido, isso é considerado uma infração GRAVE. Você ganha 5 pontos na CNH, leva uma multa e o carro pode ser retido até regularizar a situação. O controle é feito pelo PROCONVE (Programa de Controle da Poluição do Ar por Veículos Automotores).",
        legalBase: "Art. 231, III do CTB",
        incidence: "media",
        difficulty: 3
    },
    {
        id: "q9",
        category: "mecanica",
        statement: "Na revisão do freio hidráulico, o mecânico mostra pedal, hidrovácuo, discos e tambores na pista de rolamento. Qual afirmação sobre o sistema está correta?",
        options: ["O freio de estacionamento age pelo fluido nas quatro rodas ao mesmo tempo, com igual pressão em cada circuito.", "A frenagem nasce do atrito das pastilhas nos discos ou das sapatas nos tambores, pela pressão do fluido de freio.", "O hidrovácuo serve para endurecer o pedal e exigir mais força do condutor em frenagem de emergência.", "O fluido de freio só precisa de troca se houver vazamento grave no cilindro mestre, sem prazo de inspeção."],
        correctIndex: 1,
        explanation: "O freio de serviço usa a pressão do fluido para empurrar pastilhas e sapatas contra discos e tambores, gerando atrito.",
        detailedExplanation: "Quando você pisa no freio, a pressão do fluido faz as pastilhas ou lonas se encostarem nos discos ou tambores, gerando atrito e diminuindo a velocidade. Se o freio estiver com problemas, como pedal baixo ou barulho, é hora de dar uma olhada, porque dirigir assim é muito perigoso e pode dar multa GRAVÍSSIMA.",
        incidence: "media",
        difficulty: 3
    },
    {
        id: "q10",
        category: "direcao-defensiva",
        statement: "Em dia claro e pista seca, você segue um carro na via e quer manter espaço seguro até o bordo da pista livre. Qual regra prática define essa distância de seguimento?",
        options: ["Guardar 5 metros para cada 10 km por hora marcados no velocímetro, sem observar ponto fixo na via.", "Contar dois segundos entre a passagem do carro da frente e a sua por um mesmo ponto fixo na via.", "Contar três postes seguidos de luz na via como medida exata de espaço seguro em qualquer velocidade.", "Manter espaço fixo de dois carros de passeio, mesmo com chuva forte sobre a pista de rolamento."],
        correctIndex: 1,
        explanation: "Em condição ideal vale a regra dos dois segundos por ponto fixo; com chuva ou neblina, dobre para quatro segundos.",
        detailedExplanation: "Para usar, escolha um ponto fixo na estrada, como uma placa. Quando o carro da frente passar por ele, comece a contar 'mil e um, mil e dois'. Se você passar antes de terminar a contagem, está muito perto. Em dias de chuva ou neblina, aumente para 4 segundos para ficar mais seguro.",
        tip: "Normal = 2s · Chuva = 4s",
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "q11",
        category: "legislacao",
        statement: "Após a Lei 14.071/2021, o CTB mudou os prazos do exame físico e mental para renovar a CNH. Para o condutor com menos de 50 anos, qual é o prazo máximo?",
        options: ["Cinco anos, mesmo sem exercer atividade paga ao volante e sem restrição médica no prontuário.", "Dez anos, salvo se houver restrição médica expressa que reduza esse prazo de validade.", "Três anos para todo habilitado, inclusive das categorias simples A e B sem atividade paga.", "Quinze anos, desde que o condutor não some infração gravíssima nos últimos doze meses."],
        correctIndex: 1,
        explanation: "Pelo art. 147 do CTB, com menos de 50 anos a renovação ocorre a cada dez anos, salvo restrição médica.",
        detailedExplanation: "Com a Lei 14.071/2021, a validade da CNH mudou. Se você tem menos de 50 anos, a renovação é a cada 10 anos; de 50 a menos de 70, é a cada 5 anos; e se tiver 70 ou mais, a cada 3 anos. Quem trabalha com transporte precisa seguir regras específicas.",
        legalBase: "Art. 147, §2º do CTB (Lei 14.071/2021)",
        commonMistake: "Muita gente ainda acha que a validade é de 5 anos — isso mudou em 2021!",
        tip: "Menos de 50 = 10 anos; mais velho, menos tempo.",
        incidence: "altissima",
        trap: true,
        difficulty: 3
    },
    {
        id: "q12",
        category: "infracoes",
        statement: "De madrugada, em via arterial com semáforo, o condutor avança o foco vermelho e alega segurança pessoal na interseção. Pelo CTB, como essa conduta é classificada?",
        options: ["Infração gravíssima, com multa e sete pontos na CNH, sem exceção por motivo pessoal de segurança.", "Infração grave, aceita de madrugada ou sob risco alegado pelo próprio condutor.", "Infração média, convertida de imediato em advertência escrita pelo agente na via.", "Crime de trânsito, com apreensão imediata da CNH e suspensão preventiva do direito de dirigir."],
        correctIndex: 0,
        explanation: "Avançar o vermelho é infração gravíssima com sete pontos, conforme art. 208 do CTB, mesmo de madrugada.",
        detailedExplanation: "Quando você passa o sinal vermelho, é infração GRAVÍSSIMA: 7 pontos na CNH e multa de R$ 293,47. Não tem desculpa, até parar em cima da faixa de pedestres conta como infração.",
        legalBase: "Art. 208 do CTB",
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "q13",
        category: "placas",
        statement: "À frente há perigo na pista de rolamento e a sinalização apenas alerta, sem impor ordem direta ao condutor. Qual é o padrão de forma e cor dessa placa de advertência?",
        options: ["Circular, com fundo branco, borda vermelha e símbolo em preto, como nas placas de proibição.", "Quadrada ou em losango, com fundo amarelo, borda interna preta e símbolo em preto.", "Retangular, com fundo verde ou azul e letras em branco, como nas placas de destino.", "Octogonal, com fundo vermelho e letras em branco, como na placa de parada obrigatória."],
        correctIndex: 1,
        explanation: "Placa de advertência tem fundo amarelo com símbolo em preto, em losango, pois só alerta para perigo adiante.",
        detailedExplanation: "Essas placas (série A) têm formato de losango amarelo com borda e símbolos pretos. Elas avisam sobre perigos na estrada, como curvas, lombadas e cruzamentos, mas não obrigam a parar — só alertam. Ignorar essas placas e causar um acidente pode aumentar a responsabilidade do motorista.",
        tip: "Perigo à vista = olho na placa!",
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "q14",
        category: "primeiros-socorros",
        statement: "Você chega primeiro a um sinistro em rodovia e decide ajudar sem expor ninguém a novo risco na pista. Antes de tocar nas vítimas, qual deve ser seu primeiro cuidado técnico?",
        options: ["Empurrar os carros para o acostamento de imediato, para liberar logo a faixa de rolamento.", "Sinalizar o local para evitar nova colisão, com pisca-alerta e triângulo, protegendo a cena antes de ajudar.", "Iniciar respiração boca a boca na primeira vítima caída fora do carro, mesmo sem avaliar a cena.", "Puxar as vítimas das ferragens pelos braços, sem aguardar o Corpo de Bombeiros e o resgate."],
        correctIndex: 1,
        explanation: "Primeiro sinalize e proteja o local contra nova colisão; só depois acione o socorro e ajude as vítimas.",
        detailedExplanation: "Primeiro, proteja o local colocando o triângulo a pelo menos 30 metros e ligue o pisca-alerta. Depois, avise o socorro ligando para 192, 193 ou 190 e informe tudo direitinho. Só ajude as vítimas se você souber o que fazer, pra não piorar a situação delas.",
        tip: "Sinalizar = Proteger.",
        incidence: "altissima",
        difficulty: 3
    },
    {
        id: "q15",
        category: "prioridade",
        statement: "Você chega a uma rotatória urbana sem semáforo e percebe outro carro já circulando na interseção. Pelo CTB, de quem é a preferência de passagem nesse caso?",
        options: ["De quem já circula pela rotatória, devendo quem vai entrar aguardar fora da circunferência.", "De quem vem pela via mais rápida, como arterial, mesmo ainda fora da rotatória.", "De quem acelera primeiro para entrar, pois a arrancada garante a preferência na interseção.", "De quem se aproxima pela direita de quem circula, pela regra geral de cruzamento sem sinal."],
        correctIndex: 0,
        explanation: "Pelo art. 29 do CTB, em rotatória não sinalizada a preferência é de quem já circula por ela.",
        detailedExplanation: "Desde a mudança na lei, quem circula na rotatória não precisa parar para quem está entrando. É importante lembrar que quem entra deve sinalizar ao sair e enquanto está na rotatória, dependendo da situação.",
        legalBase: "Art. 29, III, 'f' do CTB",
        commonMistake: "Muita gente confunde e acha que a regra da direita ainda vale, mas em rotatória é diferente.",
        tip: "Já dentro = preferência.",
        incidence: "altissima",
        trap: true,
        difficulty: 3
    },
    {
        id: "q16",
        category: "direcao-defensiva",
        statement: "A direção defensiva tem cinco pilares para guiar condutas seguras na pista de rolamento. Assinale a conduta que NÃO representa esses pilares preventivos:",
        options: ["Usar o pilar conhecimento, dominando normas de circulação e noções básicas do veículo.", "Usar o pilar previsão, antecipando riscos do tráfego adiante na pista de rolamento.", "Usar a habilidade como desculpa para passar do limite de velocidade sem risco na via.", "Usar o pilar decisão, escolhendo de modo rápido a ação mais segura na emergência."],
        correctIndex: 2,
        explanation: "Habilidade jamais autoriza passar do limite; direção defensiva exige cumprir a norma com atenção e prudência.",
        detailedExplanation: "Os 5 pilares da direção defensiva são: CONHECIMENTO (saber as regras), ATENÇÃO (manter o foco), PREVISÃO (pensar no que pode acontecer), HABILIDADE (saber dirigir) e AÇÃO (agir certo na hora certa). Coisas como pressa e distração atrapalham a segurança na direção.",
        commonMistake: "Cuidado com a armadilha do 'EXCETO' — sempre leia com atenção. Pressa é inimigo, não amigo da direção defensiva.",
        incidence: "alta",
        trap: true,
        difficulty: 3
    },
    {
        id: "q17",
        category: "legislacao",
        statement: "Sobre o cinto de segurança, o CTB trata do uso por todos no carro em qualquer via do país. Assinale a afirmação correta sobre essa obrigatoriedade:",
        options: ["Exigido só do motorista e do passageiro da frente, apenas em rodovias fora do perímetro urbano.", "Exigido do motorista e de todos os passageiros, na frente e atrás, em todas as vias do país.", "Dispensado no banco de trás se a criança usar cadeirinha presa apenas pelo cinto do adulto.", "Dispensada a multa ao motorista se o passageiro de trás se negar a usar o cinto na viagem."],
        correctIndex: 1,
        explanation: "Pelo art. 167 do CTB, o cinto é obrigatório para motorista e passageiros em todas as vias; sem cinto há infração grave.",
        detailedExplanation: "O cinto é obrigatório para todos os passageiros, tanto na frente quanto atrás, em qualquer tipo de estrada. Se não usar, é uma infração GRAVE, com 5 pontos na carteira e multa. O motorista também é responsável por garantir que os passageiros estejam usando o cinto, e crianças até 10 anos devem ir no banco de trás em cadeirinhas ou assentos adequados.",
        legalBase: "Art. 167 do CTB",
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "q18",
        category: "meio-ambiente",
        statement: "Em estrada com aclive e declive fortes, você busca gastar menos e poluir menos com o carro. Qual conduta de condução ajuda de fato a reduzir as emissões de poluentes?",
        options: ["Esticar a marcha com giro alto entre trocas, para manter o motor sempre cheio na subida.", "Usar marcha compatível com a velocidade, com aceleração estável, sem freada ou arrancada brusca.", "Descer em ponto morto com motor desligado, na banguela, para zerar o consumo no declive.", "Usar combustível aditivado e adiar a troca dos filtros de ar e de óleo do motor."],
        correctIndex: 1,
        explanation: "Marcha certa e ritmo estável evitam esforço excessivo do motor, o que reduz consumo e emissão de poluentes.",
        detailedExplanation: "Fazer a manutenção do carro, como trocar óleo e calibrar pneus, faz o motor funcionar melhor e queimar menos combustível. Também é bom trocar de marcha na hora certa e desligar o motor se for ficar parado muito tempo.",
        incidence: "media",
        difficulty: 3
    },
    {
        id: "q19",
        category: "mecanica",
        statement: "Em pista irregular, a carroceria balança e o pneu perde contato com o solo na curva. Qual é a função principal das molas, amortecedores e braços oscilantes?",
        options: ["Levar a força do motor ao diferencial traseiro, com menor atrito interno entre as peças móveis.", "Absorver impactos da pista de rolamento, com conforto e pneu em contato permanente com o solo.", "Evitar a fadiga dos freios, mantendo a carroceria sempre paralela à linha do horizonte.", "Regular a pressão do fluido nos cilindros das pinças do freio com bloqueio das rodas."],
        correctIndex: 1,
        explanation: "A suspensão absorve buracos e ondulações da pista, mantém o pneu no solo e garante estabilidade e frenagem.",
        detailedExplanation: "Os componentes da suspensão (molas, amortecedores, braços oscilantes) ajudam a suavizar os impactos da estrada, mantendo os pneus em contato com o solo e dando estabilidade nas curvas. Se a suspensão estiver ruim, o carro fica 'pulando', o que aumenta a distância para parar e pode causar acidentes. Fique atento a barulhos estranhos e balanços excessivos.",
        incidence: "baixa",
        difficulty: 3
    },
    {
        id: "q20",
        category: "infracoes",
        statement: "No trânsito, o condutor segura o celular com uma mão para ler mensagem na interseção. Pelo CTB atual, segurar ou manusear o celular ao dirigir gera qual infração?",
        options: ["Infração média, com multa e quatro pontos na CNH, sem retenção do aparelho celular.", "Infração grave, com multa e retenção da CNH até a apresentação de curso de reciclagem.", "Infração gravíssima, com multa e sete pontos na CNH, pelo risco da distração ao volante.", "Crime de trânsito, com suspensão do direito de dirigir por seis meses e prova nova."],
        correctIndex: 2,
        explanation: "Segurar ou manusear celular ao dirigir é infração gravíssima, com sete pontos, conforme art. 252 do CTB.",
        detailedExplanation: "Desde 2021, segurar o celular ao volante é considerado gravíssimo. Você só pode usar em viva-voz ou com fone, sem tocar no aparelho. Olhar o mapa também é infração, então use suporte fixo.",
        legalBase: "Art. 252, §1º do CTB",
        tip: "Celular na mão = gravíssima.",
        incidence: "altissima",
        difficulty: 3
    },
    {
        id: "q21",
        category: "placas",
        statement: "Em rodovia, você procura a saída para outra cidade e vê placas de indicação de destino. Qual é o padrão de fundo e letras dessas placas em rodovias do país?",
        options: ["Fundo amarelo com letras pretas, iguais às placas de alerta para curva e lombada adiante.", "Fundo vermelho com letras brancas, iguais às placas de proibição de seguir na via.", "Fundo verde com letras brancas, podendo ser azul com letras brancas na orientação de destino.", "Fundo marrom com letras brancas, usadas só para hotel e restaurante fora da rodovia."],
        correctIndex: 2,
        explanation: "Indicação de destino em rodovia usa fundo verde ou azul com letras brancas; marrom fica para pontos turísticos.",
        detailedExplanation: "Essas placas ajudam a gente a se localizar: AZUL indica serviços como posto e restaurante; VERDE mostra saídas e cidades; MARROM é pra atrativos turísticos; e BRANCAS com bordas pretas identificam logradouros. Elas só informam, não mandam fazer nada.",
        incidence: "media",
        difficulty: 3
    },
    {
        id: "q22",
        category: "legislacao",
        statement: "O Sistema Nacional de Trânsito reúne órgãos da União, estados e municípios para gerir o trânsito. Qual órgão executivo abaixo integra de fato esse sistema?",
        options: ["Contran, como órgão máximo que edita normas gerais e coordena a política de trânsito.", "Detrans, órgãos estaduais que habilitam condutores e registram e licenciam veículos.", "Jaris, colegiados pagos pelo Ministério dos Transportes para julgar multas federais.", "Centros de formação, que editam as regras das provas teóricas e práticas do país."],
        correctIndex: 1,
        explanation: "Os Detrans são órgãos executivos estaduais do Sistema Nacional de Trânsito, conforme arts. 5º a 25 do CTB.",
        detailedExplanation: "O Sistema Nacional de Trânsito (SNT) é formado por vários órgãos que gerenciam o trânsito no Brasil. Os principais são: o CONTRAN, que cria as regras, o SENATRAN, que é o braço do governo federal, e os DETRANs, que atuam em cada estado.",
        legalBase: "Art. 5º a 25 do CTB",
        incidence: "media",
        difficulty: 3
    },
    {
        id: "q23",
        category: "direcao-defensiva",
        statement: "Sob chuva forte surge lâmina de água sobre a pista de rolamento e o carro entra em aquaplanagem na curva. Pela direção defensiva, como prevenir e agir nessa hora?",
        options: ["Frenar forte até travar as rodas, para o pneu voltar a morder a pista de rolamento.", "Reduzir antes da poça e, se flutuar, segurar firme o volante e aliviar o pé sem frear ou esterçar brusco.", "Esterçar rápido para os lados, para jogar a água para fora da banda de rodagem do pneu.", "Engatar marcha mais forte e acelerar, para o pneu furar a lâmina de água com o giro alto."],
        correctIndex: 1,
        explanation: "Reduza antes da água; se flutuar, segure o volante, alivie o acelerador e nada de freada ou giro brusco.",
        detailedExplanation: "Aquaplanagem acontece quando tem água demais na pista e o pneu não consegue mais grudar no chão, fazendo o carro deslizar. Para evitar isso, reduza a velocidade na chuva, mantenha os pneus em bom estado e evite passar por poças. Se acontecer, não freie nem vire o volante com força — só segure o volante e deixe o carro voltar ao normal.",
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "q24",
        category: "primeiros-socorros",
        statement: "Uma vítima de sinistro tem sangramento forte em corte no braço sobre a pista de rolamento. Até a chegada do socorro, qual manobra básica ajuda a conter a perda de sangue?",
        options: ["Amarrar corda ou arame como torniquete em qualquer corte no braço ou na perna da vítima.", "Pressionar direto o ferimento com pano limpo, com força firme e contínua sobre o ponto que sangra.", "Lavar com água quente e jogar pó caseiro ou pomada sobre o corte para fechar a pele.", "Manter o braço pendente abaixo do coração, sem pressionar o local do sangramento."],
        correctIndex: 1,
        explanation: "Faça compressão direta com pano limpo sobre o corte e mantenha a pressão até a equipe de socorro chegar.",
        detailedExplanation: "Primeiro, use luvas ou um saco plástico para não se contaminar. Depois, pressione o pano limpo ou a gaze diretamente na ferida e, se puder, levante o membro acima do coração. Não tire o pano se ele ficar encharcado, coloque outro por cima e mantenha a pressão até o socorro chegar.",
        commonMistake: "Muita gente acha que o torniquete é a solução, mas a compressão direta é sempre a primeira opção.",
        incidence: "media",
        trap: true,
        difficulty: 3
    },
    {
        id: "q25",
        category: "prioridade",
        statement: "Ambulância ocupa vaga de carga e descarga na via urbana alegando prioridade legal. Segundo o CTB, quando vale a livre circulação, parada e estacionamento desses veículos?",
        options: ["Sempre que for veículo de emergência, mesmo parado e sem atender ocorrência urgente no momento.", "Somente em efetivo serviço de urgência, identificado com alarme sonoro e luz vermelha intermitente ligados.", "Sempre que conduzido por motorista profissional, mesmo sem sinal sonoro ou luminoso acionado.", "Somente quando circula em corredor de ônibus, mesmo sem atender ocorrência urgente no momento."],
        correctIndex: 1,
        explanation: "Pelo art. 29, inciso VII do CTB, a prioridade só vale em serviço de urgência, com sirene e luzes ligadas. Sem isso, valem as regras comuns.",
        detailedExplanation: "Quando os carros de emergência estão em serviço, com sirene e giroflex ligados, eles têm prioridade total: podem ultrapassar pela direita, acelerar acima do limite e passar no vermelho, desde que com cuidado. Os outros motoristas devem encostar à direita pra dar passagem. Se não estiverem com os dispositivos ligados, perdem essa prioridade e devem seguir as regras normais.",
        legalBase: "Art. 29, VII e Art. 89 do CTB",
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "p1",
        category: "placas",
        statement: "Condutor chega a interseção sem semáforo e vê placa R-1 junto à linha de retenção na pista de rolamento. Qual conduta o CTB exige nesse ponto?",
        options: ["Diminuir a marcha e ceder passagem, sem precisar imobilizar o carro se a via estiver livre.", "Imobilizar totalmente o veículo antes da linha de retenção, observar a interseção e só depois seguir.", "Buzinar para avisar da chegada e manter a velocidade se não houver outro veículo próximo.", "Parar somente se houver pedestre na calçada, mantendo o fluxo na pista de rolamento."],
        correctIndex: 1,
        explanation: "Art. 208 do CTB: desrespeitar parada obrigatória é infração gravíssima. Com placa R-1, pare sempre antes da linha, mesmo sem fluxo.",
        detailedExplanation: "A placa R-1 (PARE) é octogonal e vermelha, feita pra ser vista fácil, mesmo suja. Você precisa parar antes da faixa de retenção, mesmo que não tenha ninguém por perto. Se não parar, é infração GRAVÍSSIMA: 7 pontos na CNH e multa.",
        legalBase: "Art. 208 do CTB",
        tip: "Parar = Respeitar o octógono vermelho.",
        incidence: "altissima",
        difficulty: 1,
        placa: "R-1"
    },
    {
        id: "p2",
        category: "placas",
        statement: "Condutor chega a interseção com via preferencial e vê placa R-2, de triângulo invertido. Qual a diferença dessa placa em relação à placa R-1 de parada obrigatória?",
        options: ["Exige imobilização total do veículo antes da interseção, exatamente como faz a placa R-1.", "Exige reduzir a marcha, ceder passagem a quem está na preferencial e seguir com segurança.", "Apenas indica o nome da via, sem criar dever de reduzir a marcha ou ceder passagem.", "Permite acelerar para entrar na preferencial antes dos outros veículos, sem ceder passagem."],
        correctIndex: 1,
        explanation: "A placa R-2 não exige parada total. Manda ceder passagem a quem circula na via preferencial e só entrar com intervalo seguro.",
        detailedExplanation: "Essa placa é um triângulo de ponta pra baixo, com fundo branco e borda vermelha. Você deve reduzir a velocidade e deixar passar os veículos que já estão na via preferencial, mas não precisa parar se a via estiver livre.",
        commonMistake: "Muita gente acha que é igual ao PARE, mas não é! Triângulo invertido é preferência, octógono é PARE.",
        incidence: "altissima",
        trap: true,
        difficulty: 1,
        placa: "R-2"
    },
    {
        id: "p3",
        category: "placas",
        statement: "Condutor procura vaga em via central movimentada e vê placa R-6a no poste. Qual a diferença entre parada e estacionamento imposta por essa sinalização?",
        options: ["Proíbe qualquer imobilização, inclusive parada rápida para embarque de passageiro.", "Proíbe estacionar o veículo, mas permite parada breve para embarque e desembarque.", "Proíbe estacionar apenas à noite, liberando a vaga durante o dia para todos.", "Permite estacionar só do lado esquerdo da pista, no sentido da circulação."],
        correctIndex: 1,
        explanation: "Art. 181 do CTB: a placa R-6a proíbe estacionar, mas admite parada rápida para embarque e desembarque. Estacionar ali é infração média.",
        detailedExplanation: "A placa R-6a proíbe ESTACIONAR (deixar o carro parado por muito tempo), mas você pode parar rapidinho pra embarcar ou desembarcar passageiros ou fazer carga e descarga. Se estacionar onde não pode, é multa média: 4 pontos e multa, além de poder ter o carro guinchado pro pátio.",
        legalBase: "Art. 181 do CTB",
        commonMistake: "Muita gente confunde com a R-6b, que proíbe parar e estacionar, mas essa só proíbe ESTACIONAR.",
        tip: "Placa com E cortada = só não pode Estacionar.",
        incidence: "altissima",
        difficulty: 1,
        placa: "R-6a"
    },
    {
        id: "p4",
        category: "placas",
        statement: "Em via urbana há dois trechos: um com placa R-6a e outro com placa R-6b. Se a primeira proíbe só estacionar, o que a placa R-6b impõe ao condutor?",
        options: ["A mesma regra da R-6a, proibindo apenas o estacionamento por tempo prolongado.", "Proibição de parar e estacionar, incluindo parada breve para embarque ou carga.", "Proibição válida só para caminhões e ônibus, liberando carros de passeio no trecho.", "Proibição de estacionar apenas de madrugada, liberando parada breve durante o dia."],
        correctIndex: 1,
        explanation: "A placa R-6b é mais rígida que a R-6a: proíbe parar e estacionar. Até embarque rápido ali configura infração grave.",
        detailedExplanation: "Essa placa é mais rigorosa que a que só corta a letra 'E'. É comum ver essa sinalização em lugares movimentados como hospitais e escolas. Parar onde não pode é uma infração grave, que dá 5 pontos e multa.",
        commonMistake: "Muita gente acha que o 'X' só proíbe estacionar, mas na verdade proíbe tudo.",
        incidence: "alta",
        difficulty: 2,
        placa: "R-6b"
    },
    {
        id: "p5",
        category: "placas",
        statement: "Condutor trafega em via arterial e passa do limite indicado na placa R-19. Como o CTB classifica a infração de excesso de velocidade conforme o percentual acima do limite?",
        options: ["Só advertência verbal do agente, sem multa ou ponto, na primeira vez que ocorrer.", "Média até 20% acima, grave de 20% a 50% e gravíssima acima de 50% do limite.", "Multa de valor único e fixo, seja qual for o percentual acima do limite da via.", "Apreensão do veículo em qualquer excesso, mesmo mínimo, durante a abordagem."],
        correctIndex: 1,
        explanation: "Art. 218 do CTB: até 20% é média, de 20% a 50% é grave e acima de 50% é gravíssima, com multa multiplicada e suspensão.",
        detailedExplanation: "Essa placa indica o limite MÁXIMO de velocidade na via. Se você passar desse limite, pode levar uma multa que varia: até 20% a mais é infração média; de 20% a 50% é grave; e acima de 50% é gravíssima, com multa maior e suspensão da carteira. A velocidade mínima é outra placa, a R-20, que é redonda e azul.",
        legalBase: "Art. 218 do CTB",
        commonMistake: "Muita gente confunde com a velocidade mínima, mas a borda vermelha indica que é proibição de passar do limite máximo.",
        incidence: "alta",
        trap: true,
        difficulty: 1,
        placa: "R-19"
    },
    {
        id: "p6",
        category: "placas",
        statement: "Em estrada serrana estreita em declive, o condutor vê placa A-1a antes de curva fechada à esquerda. Qual conduta defensiva deve adotar ainda antes da curva?",
        options: ["Acelerar para sair logo do trecho sinuoso e diminuir o tempo exposto ao risco.", "Manter a mesma velocidade, pois a placa amarela só descreve o traçado da pista.", "Reduzir a marcha aos poucos antes da curva, sem frear forte dentro dela.", "Abrir a curva invadindo a pista contrária para fazer traçado mais suave e rápido."],
        correctIndex: 2,
        explanation: "A placa A-1a avisa curva acentuada à esquerda. Reduza antes da curva, use marcha reduzida no declive e evite freada brusca nela.",
        detailedExplanation: "Essa placa é um losango amarelo que avisa que a curva à frente é fechada. O motorista deve diminuir a velocidade antes de entrar na curva para evitar acidentes.",
        tip: "Curva fechada = Reduzir a velocidade.",
        incidence: "alta",
        difficulty: 1,
        placa: "A-1a",
        image_url: "https://tqeqsotsasglmhlmwdwy.supabase.co/storage/v1/object/public/library/images/placa-A-1a.png"
    },
    {
        id: "p7",
        category: "placas",
        statement: "Perto de trecho com muito pedestre, o condutor vê placa A-32b no canteiro central. O que essa advertência anuncia sobre a pista de rolamento adiante?",
        options: ["Escola próxima, exigindo cuidado máximo só na entrada e saída de alunos.", "Passagem sinalizada de pedestres à frente, exigindo reduzir e preparar para parar.", "Travessia proibida para pedestres, permitindo manter a velocidade de cruzeiro.", "Travessia de animais silvestres na pista, comum em estrada rural de baixa visão."],
        correctIndex: 1,
        explanation: "A placa A-32b avisa faixa de pedestres à frente. Reduza a marcha e ceda a travessia. Não confundir com placa de área escolar.",
        detailedExplanation: "Isso significa que o motorista precisa reduzir a velocidade e estar preparado para parar para os pedestres. Se atropelar alguém na faixa, a situação fica ainda pior. Não confunda com a placa A-33a, que indica uma área escolar com crianças.",
        commonMistake: "Muita gente acha que qualquer faixa zebrada é de pedestres, mas só é se tiver a placa certa.",
        incidence: "alta",
        difficulty: 2,
        placa: "A-32b",
        image_url: "https://tqeqsotsasglmhlmwdwy.supabase.co/storage/v1/object/public/library/images/placa-passagem-sinalizada-de-pedestres-A32b.webp"
    },
    {
        id: "p8",
        category: "placas",
        statement: "Em via urbana junto à escola, em horário de entrada, o condutor vê placa A-33a. Diante de crianças na calçada e na pista, qual conduta defensiva correta?",
        options: ["Manter a velocidade, pois a placa amarela só informa que há escola por perto.", "Reduzir a marcha, redobrar atenção e ficar pronto para parar diante de criança.", "Entender a via como fechada para carros em todo período de aula e desviar rota.", "Parar sempre o veículo, mesmo sem nenhum pedestre na faixa ou na calçada."],
        correctIndex: 1,
        explanation: "A placa A-33a alerta para área escolar. Crianças têm comportamento imprevisível: reduza, observe calçadas e prepare-se para parar o carro.",
        detailedExplanation: "Isso significa que você deve diminuir a velocidade e ficar de olho, pois as crianças podem atravessar a rua a qualquer momento. Normalmente, a velocidade permitida é de 30 a 40 km/h, e a fiscalização é bem rigorosa nesses horários.",
        incidence: "media",
        difficulty: 1,
        placa: "A-33a",
        image_url: "https://tqeqsotsasglmhlmwdwy.supabase.co/storage/v1/object/public/library/images/placa-area-escolar-A-33A.webp"
    },
    {
        id: "p9",
        category: "placas",
        statement: "Em interseção urbana, o condutor vê placa R-25d de fundo azul que define a trajetória obrigatória. O que essa sinalização de regulamentação impõe naquele ponto?",
        options: ["Parar o veículo no local, podendo depois converter à direita ou à esquerda.", "Seguir em frente, ficando proibido converter à direita ou à esquerda.", "Não ultrapassar no trecho, podendo apenas mudar de faixa se for preciso.", "Não estacionar no trecho, ficando liberada qualquer conversão na interseção."],
        correctIndex: 1,
        explanation: "Placa de fundo azul com seta indica movimento obrigatório. Na R-25d, siga em frente: conversões estão proibidas na interseção.",
        detailedExplanation: "Essa placa de fundo azul é uma REGULAMENTAÇÃO que obriga o motorista a ir em frente. Não tem como desviar, só seguir a trajetória que a placa indica.",
        tip: "Placa azul = siga em frente (obrigação).",
        incidence: "media",
        difficulty: 2,
        placa: "R-25d"
    },
    {
        id: "p10",
        category: "placas",
        statement: "Em bairro comercial, o condutor vê placa azul com símbolo de hospital. Pela classificação do CTB, o que essa placa de sinalização vertical informa?",
        options: ["Posto de combustível à frente, como serviço auxiliar de apoio na rodovia.", "Hospital próximo, como placa de indicação apenas informativa, sem impor conduta.", "Via bloqueada por emergência do hospital, exigindo desvio imediato do trajeto.", "Dever de parar e aguardar ordem de funcionário do hospital para poder passar."],
        correctIndex: 1,
        explanation: "Placas azuis de indicação orientam sobre serviços, como hospital. São informativas e não criam proibição ou obrigação de manobra.",
        detailedExplanation: "Essas placas de INDICAÇÃO têm fundo AZUL e símbolo branco. Elas avisam sobre serviços úteis na área, como hospital (cruz), posto de gasolina (P/bomba), telefone, restaurante, hospedagem e mais, mas não obrigam o motorista a fazer nada.",
        incidence: "media",
        difficulty: 1,
        placa: "I-Hospital"
    },
    {
        id: "q26",
        category: "legislacao",
        statement: "Candidato quer tirar habilitação nas categorias A e B para moto e carro de passeio. Quais são idade mínima e exigências previstas no CTB para obter a permissão?",
        options: ["16 anos, desde que emancipado e com autorização dos pais registrada em cartório.", "17 anos, com aprovação em teste de maturidade aplicado pela banca do DETRAN.", "18 anos, saber ler e escrever, ter documento e CPF e passar nos exames exigidos.", "21 anos, idade mínima única exigida para todas as categorias de habilitação."],
        correctIndex: 2,
        explanation: "Art. 140 do CTB: para categorias A e B, ter 18 anos, saber ler e escrever, ter identidade e CPF e ser aprovado nos exames.",
        detailedExplanation: "Pra tirar a CNH das categorias A (moto) e B (carro), o candidato precisa ter pelo menos 18 anos, ser penalmente responsável, saber ler e escrever, e ter documento de identidade e CPF. Se for tirar as categorias C, D e E, tem mais requisitos.",
        legalBase: "Art. 140 do CTB",
        incidence: "alta",
        difficulty: 1
    },
    {
        id: "q27",
        category: "legislacao",
        statement: "Condutor com categoria B quer passar para D para dirigir ônibus e van escolar. Quais idade, tempo de habilitação e histórico sem infração o CTB exige?",
        options: ["18 anos e um ano de categoria B, sem verificar pontos ou infrações anteriores.", "21 anos, dois anos de B ou um de C e nada de infração grave ou gravíssima em 12 meses.", "Só pagar taxas e mostrar comprovante de casa, sem fazer exame médico ou curso.", "25 anos e diploma de faculdade, exigido para todo transporte coletivo de passageiro."],
        correctIndex: 1,
        explanation: "Art. 145 do CTB: para categoria D, ter 21 anos, dois anos de B ou um de C e estar sem infração grave ou gravíssima nos últimos 12 meses.",
        detailedExplanation: "Se você quer dirigir ônibus ou vans, precisa ter 21 anos e estar habilitado na B por pelo menos 2 anos, ou na C por 1 ano. Além disso, é preciso estar com a ficha limpa, sem infrações graves ou gravíssimas no último ano. Esses detalhes são essenciais pra não errar na hora de pedir a nova habilitação.",
        legalBase: "Art. 145 do CTB",
        incidence: "media",
        difficulty: 2
    },
    {
        id: "q28",
        category: "legislacao",
        statement: "DETRAN vê no prontuário a mesma infração repetida em menos de 12 meses. Quando o CTB considera reincidência e pune a nova multa com valor dobrado?",
        options: ["Quando o condutor comete duas infrações diferentes, em dias diferentes, ainda que distintas.", "Quando repete a mesma infração em até 12 meses, contados a partir da infração anterior.", "Quando soma pontos suficientes para abrir processo de suspensão da habilitação.", "Quando a primeira multa foi em outro estado, diferente do estado da habilitação."],
        correctIndex: 1,
        explanation: "Art. 259, parágrafo 1º do CTB: repete a mesma infração em 12 meses, paga multa em dobro. Infração diferente não gera reincidência.",
        detailedExplanation: "Reincidência acontece quando você comete a mesma infração (mesmo artigo) mais de uma vez em 12 meses. Não vale infrações diferentes, só a mesma. Se reincidir, a multa é em dobro e você pode perder a chance de transformar a PPD em CNH definitiva.",
        legalBase: "Art. 259, §1º do CTB",
        incidence: "media",
        difficulty: 2
    },
    {
        id: "q29",
        category: "legislacao",
        statement: "Pela sistemática atual do CTB, a suspensão do direito de dirigir por pontos ocorre quando o condutor atinge:",
        options: ["20 pontos em 12 meses, independentemente da natureza das infrações.", "40 pontos sem gravíssima, 30 com uma gravíssima e 20 com duas ou mais gravíssimas.", "14 pontos para qualquer condutor, sem distinção de categoria.", "Somente em caso de infração gravíssima, sem limite nos demais casos."],
        correctIndex: 1,
        explanation: "Lei 14.071/2021: 40 pts sem gravíssima; 30 pts com 1 gravíssima; 20 pts com 2+ gravíssimas.",
        detailedExplanation: "A Lei 14.071/2021 mudou as regras de suspensão por pontos. Agora, o limite depende das infrações: 40 pontos se não tiver nenhuma gravíssima, 30 pontos com uma e 20 pontos com duas ou mais. Para quem dirige por profissão, o limite é sempre 40 pontos, não importa as infrações.",
        legalBase: "Art. 261 do CTB (Lei 14.071/2021)",
        commonMistake: "Muita gente ainda acha que o limite é sempre 20 pontos, mas isso mudou em 2021.",
        incidence: "altissima",
        trap: true,
        difficulty: 3
    },
    {
        id: "q30",
        category: "legislacao",
        statement: "Para circular regularmente, o condutor deve apresentar ao agente de fiscalização:",
        options: ["CNH ou PPD e CRLV-e, admitindo-se formato digital.", "Somente o CRLV-e, pois a habilitação é consultada automaticamente.", "Somente a CNH, pois o licenciamento é consultado no sistema.", "CRLV-e e comprovante de IPVA impresso, sem exibição da CNH."],
        correctIndex: 0,
        explanation: "CNH/PPD + CRLV em dia. Versões digitais (CDT/CRLV-e) valem igual aos papéis.",
        detailedExplanation: "Para dirigir tranquilo, você precisa mostrar a CNH ou a Permissão para Dirigir e o CRLV do carro. Pode ser no celular ou no papel, não tem problema, os dois são aceitos. E não esquece: o CRLV tem que estar atualizado todo ano!",
        legalBase: "Art. 159 do CTB",
        incidence: "alta",
        difficulty: 1
    },
    {
        id: "q31",
        category: "infracoes",
        statement: "Estacionar em vaga reservada a PCD sem expor a credencial configura infração:",
        options: ["Leve, com advertência oral e sem pontuação.", "Média, com multa e 4 pontos, sem medida administrativa.", "Grave, com multa e 5 pontos, convertível em advertência.", "Gravíssima, com multa, 7 pontos e remoção do veículo."],
        correctIndex: 3,
        explanation: "Gravíssima — 7 pontos e multa. Vaga de idoso é grave (5 pontos).",
        detailedExplanation: "Estacionar em vaga de PCD sem a credencial visível é infração GRAVÍSSIMA: 7 pontos na CNH e multa. Já a vaga de idoso é infração GRAVE (5 pontos). As vagas para PCD têm regras mais rígidas, então a credencial deve estar sempre à vista. Mesmo se a vaga estiver livre, não pode usar sem a credencial.",
        legalBase: "Art. 181, XVII do CTB",
        incidence: "alta",
        difficulty: 1
    },
    {
        id: "q32",
        category: "infracoes",
        statement: "Dirigir sem possuir CNH nem PPD configura infração:",
        options: ["Leve, com advertência escrita na primeira ocorrência.", "Média, com multa e 4 pontos, permitindo seguir viagem.", "Grave, com multa e 5 pontos, sem retenção do veículo.", "Gravíssima, com multa multiplicada por 3 e retenção do veículo."],
        correctIndex: 3,
        explanation: "Gravíssima — multa tripla e retenção até chegar condutor habilitado.",
        detailedExplanation: "Dirigir sem ter CNH ou PPD é uma infração GRAVÍSSIMA, com multa multiplicada por 3. Se isso gerar perigo, pode até ser considerado crime, com pena de 6 meses a 1 ano de detenção. Lembre-se: dirigir sem CNH é grave, mas se tiver CNH e não a portar, é leve.",
        legalBase: "Art. 162, I do CTB",
        incidence: "alta",
        difficulty: 1
    },
    {
        id: "q33",
        category: "infracoes",
        statement: "Transportar criança de 6 anos no banco dianteiro sem dispositivo de retenção configura infração:",
        options: ["Leve, com multa e 3 pontos.", "Média, com multa e 4 pontos.", "Grave, com multa e 5 pontos.", "Gravíssima, com multa e 7 pontos."],
        correctIndex: 3,
        explanation: "Gravíssima — crianças até 10 anos vão atrás, em dispositivo adequado.",
        detailedExplanation: "Crianças com até 10 anos devem ir no banco de trás, usando o equipamento certo para a idade: bebê conforto, cadeirinha ou assento de elevação. Ignorar isso é infração GRAVÍSSIMA, com 7 pontos na CNH e multa. Muita gente acha que é 'grave', mas é gravíssima pela segurança da criança.",
        legalBase: "Art. 168 do CTB / Res. CONTRAN 277",
        commonMistake: "Muita gente confunde e acha que é 'grave', mas é GRAVÍSSIMA.",
        incidence: "alta",
        trap: true,
        difficulty: 2
    },
    {
        id: "q34",
        category: "infracoes",
        statement: "Disputar arrancadas (racha) em via pública configura:",
        options: ["Infração média, com multa e 4 pontos.", "Infração grave, com multa e 5 pontos.", "Infração gravíssima com multa 10x, suspensão da CNH e crime de trânsito.", "Advertência verbal, se a disputa cessar imediatamente."],
        correctIndex: 2,
        explanation: "Racha: gravíssima com multa 10x, suspensão da CNH e crime.",
        detailedExplanation: "Fazer 'racha' na rua é uma das infrações mais sérias que existem. A multa é dez vezes maior e o motorista pode perder a CNH na hora. Além disso, isso é crime, podendo dar até 3 anos de cadeia.",
        legalBase: "Art. 173 e 308 do CTB",
        incidence: "media",
        difficulty: 1
    },
    {
        id: "q35",
        category: "direcao-defensiva",
        statement: "As áreas que os retrovisores não cobrem, exigindo olhar por cima do ombro antes da transposição de faixa, são chamadas de:",
        options: ["Pontos cegos, delimitados pelas colunas do veículo.", "Cantos internos escuros do habitáculo.", "Pontos de desgaste da banda de rodagem.", "Manchas do para-brisa que reduzem a visão."],
        correctIndex: 0,
        explanation: "Pontos cegos — áreas que não aparecem nos espelhos.",
        detailedExplanation: "Os pontos cegos são regiões ao redor do carro que os retrovisores não conseguem mostrar, geralmente nas laterais traseiras, escondidos pelas colunas. Um motoqueiro ou um carro menor pode sumir ali. Por isso, é importante olhar por cima do ombro antes de mudar de faixa ou fazer uma curva.",
        incidence: "alta",
        difficulty: 1
    },
    {
        id: "q36",
        category: "direcao-defensiva",
        statement: "A forma segura de descer serra longa sem sobrecarregar os freios é:",
        options: ["Descer em ponto morto, freando periodicamente.", "Descer desengrenado para economizar combustível.", "Descer engrenado em marcha reduzida, usando o freio-motor.", "Manter o pé no freio durante toda a descida."],
        correctIndex: 2,
        explanation: "Marcha reduzida + freio motor evita superaquecimento dos freios.",
        detailedExplanation: "Descer em ponto morto (banguela) é PROIBIDO e arriscado — você perde a ajuda do motor e sobrecarrega os freios, que podem falhar. O certo é engatar uma marcha reduzida e deixar o motor ajudar a controlar a velocidade.",
        legalBase: "Art. 231, IX do CTB",
        commonMistake: "Descer em 'N' parece uma boa ideia, mas é infração e muito perigoso.",
        incidence: "alta",
        trap: true,
        difficulty: 2,
        group: "freio-motor-declive"
    },
    {
        id: "q37",
        category: "direcao-defensiva",
        statement: "Antes de iniciar uma ultrapassagem em rodovia de pista dupla, o condutor deve:",
        options: ["Transpor para a faixa esquerda sem sinalizar.", "Conferir visibilidade, sinalizar com seta, verificar retrovisores e ponto cego.", "Buzinar continuamente até o veículo da frente se deslocar.", "Acionar o pisca-alerta e aguardar o veículo precedente parar."],
        correctIndex: 1,
        explanation: "Ultrapassagem segura = visibilidade + seta + espelhos + ponto cego.",
        detailedExplanation: "Antes de ultrapassar, olhe se a pista tá livre e se tem sinalização boa. Depois, coloque a seta pra esquerda, cheque os retrovisores e o ponto cego e acelere com cuidado pra passar e voltar pra faixa. Não esqueça de sinalizar pra direita ao voltar!",
        incidence: "alta",
        difficulty: 1
    },
    {
        id: "q38",
        category: "direcao-defensiva",
        statement: "A ultrapassagem é terminantemente proibida em:",
        options: ["Reta com faixa tracejada e boa visibilidade.", "Ponte, viaduto, túnel, curva, aclive sem visibilidade e faixa contínua.", "Qualquer rodovia federal, independentemente da sinalização.", "Período diurno, quando o fluxo contrário é intenso."],
        correctIndex: 1,
        explanation: "Proibida em pontes, viadutos, túneis, curvas, aclives e faixa contínua.",
        detailedExplanation: "O CTB diz que não se pode ultrapassar nesses lugares por segurança. A faixa contínua avisa que não é pra ultrapassar, enquanto a tracejada permite, se for seguro. Fazer isso em lugar proibido é uma infração GRAVÍSSIMA, com multa bem salgada, multiplicada por 5.",
        legalBase: "Art. 203 do CTB",
        incidence: "alta",
        difficulty: 1
    },
    {
        id: "q39",
        category: "primeiros-socorros",
        statement: "Diante de vítima com suspeita de fratura no braço, a conduta correta é:",
        options: ["Tentar recolocar o osso na posição original.", "Imobilizar o membro na posição encontrada, aguardando o socorro.", "Movimentar o braço para avaliar a extensão da fratura.", "Massagear a região para ativar a circulação."],
        correctIndex: 1,
        explanation: "Nunca tente colocar o osso no lugar. Imobilize e chame o SAMU.",
        detailedExplanation: "Se você suspeita que alguém quebrou o braço, não mexa no osso. Imobilize o braço na posição que ele está, usando coisas como papelão ou madeira, e prenda com ataduras, mas sem apertar muito. Depois, espere o SAMU chegar para ajudar.",
        incidence: "media",
        difficulty: 2
    },
    {
        id: "q40",
        category: "primeiros-socorros",
        statement: "O número correto para acionar o socorro médico de urgência é:",
        options: ["190 — Polícia Militar.", "192 — SAMU.", "193 — Corpo de Bombeiros.", "199 — Defesa Civil."],
        correctIndex: 1,
        explanation: "192 = SAMU, que cuida de emergências médicas.",
        detailedExplanation: "Em acidentes com feridos, é importante saber os números certos. O SAMU atende pelo 192, enquanto os Bombeiros vão pelo 193, a Polícia Militar pelo 190 e a PRF pelo 191. Confundir esses números pode atrasar o socorro e prejudicar as vítimas.",
        tip: "Acidente = Ligue 1-9-2!",
        incidence: "alta",
        difficulty: 1
    },
    {
        id: "q41",
        category: "primeiros-socorros",
        statement: "Diante de queimadura de segundo grau com bolhas, o socorrista NÃO deve:",
        options: ["Aplicar água corrente limpa em temperatura ambiente.", "Cobrir a lesão com pano limpo ou gaze umedecida.", "Passar pasta de dentes, manteiga ou pomada caseira.", "Encaminhar a vítima ao médico especializado."],
        correctIndex: 2,
        explanation: "Pasta de dente e manteiga só pioram a queimadura.",
        detailedExplanation: "Quando alguém se queima, o certo é resfriar a área com água corrente em temperatura ambiente por uns 10 minutos, nunca usar gelo. Depois, é só cobrir com um pano limpo e procurar um médico. Nunca use pasta de dente, manteiga ou qualquer coisa caseira, porque isso só agrava a situação e pode infeccionar.",
        incidence: "media",
        trap: true,
        difficulty: 1
    },
    {
        id: "q42",
        category: "primeiros-socorros",
        statement: "Diante de vítima inconsciente e sem respiração espontânea, a conduta imediata é:",
        options: ["Aguardar passivamente a chegada do resgate.", "Iniciar compressões torácicas da RCP (100-120/min).", "Oferecer pequenos goles de água.", "Sacudir vigorosamente os ombros da vítima."],
        correctIndex: 1,
        explanation: "Parada respiratória = RCP (100-120 compressões/min no centro do peito).",
        detailedExplanation: "Quando alguém para de respirar, é hora de agir rápido. Primeiro, veja se a pessoa está acordada e respirando; se não, chame o SAMU (192) ou peça ajuda. Depois, comece as compressões torácicas no centro do peito, bem firme e rápido, até o socorro chegar.",
        incidence: "alta",
        difficulty: 2
    },
    {
        id: "q43",
        category: "meio-ambiente",
        statement: "O uso correto da buzina, conforme o CTB, é:",
        options: ["Livre a qualquer hora, como direito do condutor.", "Toques curtos para alertar perigo imediato, vedado uso prolongado.", "Para cumprimentar pedestres na calçada.", "À frente de hospitais e escolas em baixa velocidade."],
        correctIndex: 1,
        explanation: "Buzina só em toques curtos para perigo. Uso prolongado é infração leve.",
        detailedExplanation: "A buzina só pode ser usada em toques curtos para avisar sobre perigo. Usar de forma prolongada ou em lugares como hospitais e escolas é proibido, e isso gera multa e pontos na carteira. Além disso, o barulho excessivo atrapalha a vida da galera na cidade.",
        legalBase: "Art. 227 do CTB",
        incidence: "media",
        difficulty: 1
    },
    {
        id: "q44",
        category: "meio-ambiente",
        statement: "Arremessar objetos pela janela do veículo configura infração:",
        options: ["Leve, com mera advertência escrita.", "Média, com multa e 4 pontos, respondendo o condutor.", "Grave, com multa, pontos e suspensão do licenciamento.", "Gravíssima, com multa 3x e remoção do veículo."],
        correctIndex: 1,
        explanation: "Média — 4 pontos. O condutor responde pela conduta do passageiro.",
        detailedExplanation: "Jogar coisas pela janela do carro é uma infração MÉDIA (4 pontos na CNH e multa). Embora pareça bobeira, pode causar incêndios ou acidentes sérios, como com motociclistas. O motorista é responsável pelo que o passageiro faz e deve descartar o lixo de forma correta.",
        legalBase: "Art. 172 do CTB",
        incidence: "media",
        difficulty: 1
    },
    {
        id: "q45",
        category: "mecanica",
        statement: "O intervalo correto para conferir a pressão dos pneus é:",
        options: ["Uma vez por ano, junto com a troca de óleo.", "A cada 15 dias e antes de viagens longas, com pneus frios.", "Somente quando o veículo puxa lateralmente.", "Apenas antes de trajeto rodoviário."],
        correctIndex: 1,
        explanation: "A cada 15 dias e antes de viagens. Pneu frio garante leitura certa.",
        detailedExplanation: "É importante checar a calibragem dos pneus pelo menos a cada 15 dias e antes de longas viagens. Calibre sempre com os pneus frios, ou seja, o carro parado há pelo menos 2 horas ou que rodou bem pouco, porque o ar quente pode dar uma leitura errada. Pneus descalibrados gastam mais combustível e podem causar problemas na direção e frenagem.",
        incidence: "media",
        difficulty: 1
    },
    {
        id: "q46",
        category: "mecanica",
        statement: "O TWI (indicador de desgaste) no fundo dos sulcos do pneu indica:",
        options: ["Marca e modelo do pneu para recompra.", "Limite mínimo legal dos sulcos (1,6 mm), sinalizando troca obrigatória.", "Pressão de inflagem em tempo real.", "Data de validade do pneu."],
        correctIndex: 1,
        explanation: "TWI marca o limite de 1,6 mm — ao atingi-lo, o pneu deve ser trocado.",
        detailedExplanation: "O TWI são aqueles ressaltos que aparecem no fundo dos sulcos do pneu. Quando a borracha chega nesses ressaltos, significa que o pneu tá com menos de 1,6 mm de profundidade, que é o mínimo permitido. Usar pneus assim é uma infração GRAVÍSSIMA e pode causar acidentes, principalmente em dias de chuva.",
        incidence: "media",
        difficulty: 2
    },
    {
        id: "q47",
        category: "mecanica",
        statement: "Para conferir o nível do óleo pela vareta, as condições ideais são:",
        options: ["Motor quente e em funcionamento.", "Veículo em superfície plana e motor frio ou desligado há alguns minutos.", "Somente em oficina, durante a troca programada.", "Uma vez por ano, na revisão geral."],
        correctIndex: 1,
        explanation: "Terreno plano + motor frio = leitura certa da vareta.",
        detailedExplanation: "Pra ver o nível de óleo do motor, você usa a vareta medidora. Primeiro, pare o carro em um lugar plano, desligue o motor e espere alguns minutinhos pra o óleo descer pro cárter. Depois, retire a vareta, limpe, coloque de volta e tire de novo pra checar se tá entre as marcas de mínimo e máximo.",
        incidence: "baixa",
        difficulty: 1
    },
    {
        id: "q48",
        category: "mecanica",
        statement: "A luz vermelha com desenho de bateria acesa no painel indica:",
        options: ["Falha no sistema de carga (alternador, correia ou bateria).", "Nível de combustível na reserva.", "Desgaste de pastilhas de freio.", "Pressão irregular de pneus."],
        correctIndex: 0,
        explanation: "Problema na bateria. Se continuar, o carro pode parar.",
        detailedExplanation: "A luz da bateria indica que o carro não está carregando direito. Isso pode ser por causa do alternador, da correia ou da própria bateria. Se você ver essa luz, é melhor parar em um lugar seguro e pedir ajuda, porque o carro vai parar quando a bateria acabar.",
        incidence: "media",
        difficulty: 2
    },
    {
        id: "q49",
        category: "prioridade",
        statement: "Na pista de rolamento, a ordem de prioridade de passagem é:",
        options: ["Veículos de maior porte, depois ciclista, por último pedestre.", "Ambulância em serviço, pedestre, ciclista, demais veículos.", "Ordem cronológica de chegada à interseção.", "Veículos mais ágeis, bicicleta, ambulância."],
        correctIndex: 1,
        explanation: "Prioridade: emergência > pedestre > não motorizado > motorizado.",
        detailedExplanation: "Na via, quem tem mais direito é a ambulância com sirene. Depois, os pedestres que estão na faixa, seguidos das bicicletas e, por último, os carros. Essa ordem ajuda a proteger quem está mais vulnerável no trânsito.",
        legalBase: "Art. 29, §2º do CTB",
        incidence: "alta",
        difficulty: 2
    },
    {
        id: "q50",
        category: "legislacao",
        statement: "O limite padrão de velocidade em via urbana local sem sinalização é:",
        options: ["20 km/h, restrito a vias exclusivas de pedestres.", "30 km/h, padrão das vias locais.", "40 km/h, padrão das vias coletoras.", "60 km/h, padrão das vias arterials."],
        correctIndex: 1,
        explanation: "Via local sem placa = 30 km/h. Sequência: 30, 40, 60, 80.",
        detailedExplanation: "Quando não tem sinalização, o CTB diz que as vias locais, que são mais tranquilas e têm mais pedestres, devem ter limite de 30 km/h. As outras vias têm limites maiores: coletoras 40 km/h, arteriais 60 km/h e trânsito rápido 80 km/h. Lembre-se da sequência: 30, 40, 60, 80.",
        legalBase: "Art. 61 do CTB",
        incidence: "alta",
        difficulty: 2
    },
    {
        id: "q51",
        category: "legislacao",
        statement: "O limite máximo para automóveis em rodovia de pista dupla sem sinalização é:",
        options: ["80 km/h, limite dos demais veículos.", "100 km/h, máxima de estradas rurais não pavimentadas.", "110 km/h, limite para automóveis, camionetas e motocicletas.", "120 km/h, admitida em rodovias federais concedidas."],
        correctIndex: 2,
        explanation: "Rodovia pista dupla: carro 110, ônibus 90, outros 80.",
        detailedExplanation: "Em rodovias sem placas, os limites são: carro, caminhonete e moto: 110 km/h; ônibus: 90 km/h; e outros veículos: 80 km/h. Em estradas não pavimentadas, o limite é 60 km/h. Lembre-se que em pista simples, os limites caem 10 km/h.",
        legalBase: "Art. 61, §1º do CTB",
        incidence: "alta",
        difficulty: 2
    },
    {
        id: "q52",
        category: "infracoes",
        statement: "Exceder a velocidade em mais de 50% do limite configura infração:",
        options: ["Média — multa simples e 4 pontos.", "Grave — multa e 5 pontos, com advertência.", "Gravíssima — multa 3x, 7 pontos e suspensão imediata.", "Leve — advertência verbal, se não houver dano."],
        correctIndex: 2,
        explanation: "Gravíssima, multa tripla, 7 pontos e suspensão da CNH.",
        detailedExplanation: "Quando você passa do limite de velocidade, as multas variam: até 20% é média, de 20% a 50% é grave, e acima de 50% é gravíssima. Nesse caso, como o carro estava a 95 km/h em uma via de 60 km/h, a multa é multiplicada por três e a CNH é suspensa na hora, sem precisar de processo.",
        legalBase: "Art. 218, III do CTB",
        incidence: "alta",
        difficulty: 2
    },
    {
        id: "q53",
        category: "direcao-defensiva",
        statement: "O uso do farol baixo durante o dia em rodovia de pista simples é:",
        options: ["Proibido, pois consome energia e ofusca outros condutores.", "Obrigatório, admitindo-se o uso do sistema DRL se o veículo possuir.", "Opcional, ficando a critério do condutor.", "Exigido apenas em túnel iluminado ou sob chuva."],
        correctIndex: 1,
        explanation: "Obrigatório em rodovias de pista simples. DRL pode substituir.",
        detailedExplanation: "Desde a Lei 13.290/2016, é regra ter o farol baixo aceso em rodovias, mesmo com boa visibilidade. Isso ajuda outros motoristas a verem o carro, diminuindo o risco de acidentes. A luz de condução diurna (DRL) pode ser usada no lugar do farol baixo, já que serve pra deixar o veículo mais visível. Nas cidades, essa regra não vale, a não ser em túneis ou em situações de chuva e neblina.",
        legalBase: "Art. 250 do CTB",
        incidence: "media",
        difficulty: 2
    },
    {
        id: "q54",
        category: "legislacao",
        statement: "O prazo de vigência da Permissão para Dirigir (PPD) é de:",
        options: ["3 meses, destinado ao exame prático.", "6 meses, para concluir as etapas iniciais.", "1 ano, vigência no estágio probatório.", "2 anos, idêntico ao das avaliações psicológicas."],
        correctIndex: 2,
        explanation: "PPD vale 1 ano. Sem infração grave/gravíssima, vira CNH definitiva.",
        detailedExplanation: "A PPD (Permissão para Dirigir) é um documento temporário que o candidato recebe após passar nos exames. Durante 1 ano, o motorista deve ficar na linha: sem infrações graves ou gravíssimas e sem repetir infrações médias. Se seguir as regras, a PPD se transforma na CNH definitiva, mas se vacilar, pode perder a permissão e ter que começar tudo de novo.",
        legalBase: "Art. 148, §3º do CTB",
        incidence: "alta",
        difficulty: 1
    },
    {
        id: "qp01",
        category: "direcao-defensiva",
        statement: "Em chuva forte ou neblina densa, o condutor deve:",
        options: ["Manter luzes de posição apagadas e ligar o pisca-alerta em movimento.", "Ligar o farol alto para melhorar a visibilidade.", "Manter acesos farol baixo ou luz de posição, sem pisca-alerta em movimento.", "Acionar o pisca-alerta e trafegar pelo acostamento."],
        correctIndex: 2,
        explanation: "Neblina = farol baixo. Pisca-alerta NUNCA em movimento.",
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
        statement: "Deixar de guardar distância de segurança do veículo da frente configura infração:",
        options: ["Média, com multa e 4 pontos.", "Grave, com multa e 5 pontos.", "Gravíssima, com multa e 7 pontos.", "Leve, com multa pequena e 3 pontos."],
        correctIndex: 1,
        explanation: "Colar no carro da frente = GRAVE (5 pontos).",
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
        statement: "Sobre a influência do álcool na capacidade de dirigir, é correto afirmar que ele:",
        options: ["Causa perda total e permanente da visão.", "Turva a visão, mas aumenta a agilidade de reação.", "Reduz a atenção, provoca sonolência e diminui reflexos e coordenação.", "Aumenta reflexos e coordenação, tornando o condutor mais seguro."],
        correctIndex: 2,
        explanation: "Álcool reduz atenção, provoca sonolência e diminui reflexos.",
        commonMistake: "Muita gente cai na pegadinha de ler só a primeira parte da opção e esquece que a última palavra pode mudar tudo!",
        tip: "Álcool = Atenção baixa e reflexos lentos.",
        incidence: "alta",
        trap: true,
        difficulty: 3
    },
    {
        id: "qp04",
        category: "meio-ambiente",
        statement: "A principal consequência DIRETA da maior exposição à radiação UV para a saúde humana é:",
        options: ["Aumento da temperatura média global.", "Maior incidência de doenças respiratórias.", "Aumento dos casos de câncer de pele e lesões oculares.", "Aumento da quantidade de radiação UV-A e UV-B no solo."],
        correctIndex: 2,
        explanation: "Mais radiação UV = câncer de pele e catarata.",
        commonMistake: "Muita gente acha que a resposta é sobre o aumento dos raios UV, mas isso é a causa, não a consequência.",
        tip: "Buraco na camada = Mais radiação = Mais problemas na pele e olhos.",
        incidence: "alta",
        trap: true,
        difficulty: 3
    },
    {
        id: "qp05",
        category: "direcao-defensiva",
        statement: "Sobre o emprego das luzes do veículo, é correto afirmar:",
        options: ["O farol baixo deve ficar ligado dia e noite em qualquer via urbana.", "A troca de luz baixa e alta intermitente só é permitida para indicar ultrapassagem ou alertar riscos.", "O farolete substitui o farol baixo em rodovias durante o dia.", "O farol alto deve ficar ligado permanentemente em vias iluminadas."],
        correctIndex: 1,
        explanation: "Piscar luzes só vale pra avisar que vai ultrapassar ou alertar de perigo.",
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
        statement: "Em interseção sem semáforo, a preferência do veículo sobre trilhos é:",
        options: ["Relativa, aplicando-se apenas quando for de porte maior.", "Condicionada à existência de sinalização semafórica.", "Absoluta, devendo os demais aguardar sua passagem.", "Compartilhada, aplicando-se a regra da direita."],
        correctIndex: 2,
        explanation: "Veículos sobre trilhos têm prioridade total.",
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
        statement: "Além das vias urbanas e rurais, o CTB também considera vias terrestres:",
        options: ["Áreas privadas e estacionamentos de comércios.", "Praias abertas à circulação pública e vias internas de condomínios.", "Vias particulares e condomínios fechados, sem fiscalização.", "Zonas de preservação ambiental e calçadões privatizados."],
        correctIndex: 1,
        explanation: "Praias abertas e ruas de condomínio são vias terrestres.",
        legalBase: "Art. 2º, parágrafo único do CTB",
        commonMistake: "Muita gente acha que as ruas de condomínio não contam como públicas, mas isso tá errado — o CTB se aplica lá também.",
        tip: "Praia + condomínio = via terrestre. CTB é pra todo mundo!",
        incidence: "alta",
        trap: true,
        difficulty: 3
    },
    {
        id: "qp08",
        category: "primeiros-socorros",
        statement: "Ao movimentar vítima com suspeita de lesão na coluna cervical, o procedimento correto é:",
        options: ["Puxar a vítima pelos braços ou pernas rapidamente.", "Levantar a vítima individualmente, sentada no banco.", "Utilizar três pessoas para erguer a vítima em bloco, mantendo o corpo alinhado.", "Virar a cabeça da vítima para verificar fraturas."],
        correctIndex: 2,
        explanation: "Movimentar em bloco com 3 pessoas, sem torcer o corpo.",
        tip: "Movimentou vítima? Sempre em BLOCO, com 3 pessoas.",
        incidence: "alta",
        difficulty: 2
    },
    {
        id: "qp09",
        category: "primeiros-socorros",
        statement: "Primeiros socorros no trânsito significam:",
        options: ["Aplicar técnica médica avançada e administrar medicamentos.", "Prestar atendimento inicial e temporário até a chegada do socorro profissional.", "Transportar a vítima imediatamente ao hospital.", "Realizar procedimentos cirúrgicos de emergência."],
        correctIndex: 1,
        explanation: "Primeiros socorros = ajudar até o profissional chegar.",
        commonMistake: "Muita gente acha que pode fazer cirurgia ou dar remédio, mas isso é furada — só quem é médico pode fazer isso.",
        tip: "Ajudar = Esperar o profissional.",
        incidence: "alta",
        difficulty: 2
    },
    {
        id: "qp10",
        category: "direcao-defensiva",
        statement: "O verdadeiro conceito de direção defensiva é:",
        options: ["Evitar acidentes a qualquer custo, sem depender de manutenção.", "Um tipo de acidente em que não há conduta possível.", "O conjunto de técnicas que previne acidentes mesmo com pista adversa e erro dos demais.", "A habilidade de trafegar rapidamente confiando nos próprios reflexos."],
        correctIndex: 2,
        explanation: "Direção defensiva = prevenir acidentes mesmo com adversidades.",
        commonMistake: "Cuidado com a ideia de 'fazer de tudo' para evitar acidentes, isso não é direção defensiva.",
        tip: "Situação = Ação: Dirigir seguro = Prevenir acidentes.",
        incidence: "alta",
        trap: true,
        difficulty: 3
    },
    {
        id: "qp11",
        category: "prioridade",
        statement: "Em interseção sem sinalização, dois veículos chegam ao mesmo tempo. Tem preferência:",
        options: ["O veículo da via mais larga ou movimentada.", "O veículo que desenvolver maior velocidade.", "O veículo que vier pela direita do outro.", "Qualquer um, desde que pisque o farol."],
        correctIndex: 2,
        explanation: "Sem sinalização, quem vem pela DIREITA tem preferência.",
        legalBase: "Art. 29, III do CTB",
        commonMistake: "Muita gente pensa que a rua mais larga sempre tem preferência. ERRADO — a regra da direita é que vale.",
        tip: "Sem sinalização? Direita é a prioridade!",
        incidence: "altissima",
        difficulty: 2
    },
    {
        id: "qp12",
        category: "legislacao",
        statement: "O condutor estende o braço esquerdo horizontalmente para fora do veículo. Esse gesto sinaliza:",
        options: ["Diminuição de marcha.", "Parada imediata.", "Conversão à esquerda.", "Permissão para ultrapassagem."],
        correctIndex: 2,
        explanation: "Braço horizontal = virar à esquerda.",
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
        statement: "O condutor mantém o braço esquerdo dobrado com a mão apontando para cima. Esse gesto sinaliza:",
        options: ["Conversão à esquerda.", "Conversão à direita.", "Permissão para ultrapassagem.", "Redução de velocidade ou parada."],
        correctIndex: 1,
        explanation: "Mão pra cima = virar à direita, mesmo com o braço esquerdo.",
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
        statement: "Para converter à esquerda em via de mão dupla, o condutor deve:",
        options: ["Acionar a seta apenas no momento da curva e avançar rapidamente.", "Sinalizar com antecedência, aproximar-se da linha divisória sem invadir a contramão, reduzir e dar preferência aos veículos em sentido contrário.", "Buzinar, acelerar e cruzar antes do veículo contrário.", "Sinalizar com a seta direita e fazer a curva pela contramão."],
        correctIndex: 1,
        explanation: "Sinalizar antes, chegar perto da linha do meio, reduzir e dar preferência.",
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
        statement: "Antes de qualquer manobra com deslocamento lateral, o condutor é obrigado a:",
        options: ["Apenas observar o retrovisor e iniciar a manobra.", "Buzinar três vezes consecutivas.", "Certificar-se de que pode executar sem perigo e indicar com antecedência a intenção.", "Acelerar bruscamente para abrir espaço."],
        correctIndex: 2,
        explanation: "Segurança + sinalização antecipada, sempre.",
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
        statement: "Diante de superaquecimento do motor, a conduta correta é:",
        options: ["Estacionar e abrir o radiador imediatamente.", "Desligar o motor e jogar água fria sobre ele.", "Parar em local seguro, desligar o motor e aguardar esfriar naturalmente.", "Continuar dirigindo em baixa velocidade até o posto."],
        correctIndex: 2,
        explanation: "Parar, desligar e esperar esfriar. Nunca abrir o radiador quente.",
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
        statement: "Painel aceso, mas o motor não dá partida e ouve-se apenas um clique seco. A causa mais provável é:",
        options: ["Falta absoluta de óleo no motor.", "Bateria descarregada ou com carga insuficiente.", "Problema no sistema de injeção eletrônica.", "Correia do alternador rompida."],
        correctIndex: 1,
        explanation: "Clique seco + painel aceso = bateria fraca.",
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
        statement: "Sobre a profundidade mínima legal dos sulcos dos pneus, é correto afirmar:",
        options: ["O TWI mede a pressão interna do pneu.", "Os pneus podem ter sulcos de qualquer profundidade.", "A profundidade mínima é 1,6 mm, indicada pelo TWI.", "Pneus carecas são permitidos no eixo traseiro."],
        correctIndex: 2,
        explanation: "Sulco mínimo = 1,6 mm (TWI). Abaixo disso é infração gravíssima.",
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
        statement: "Em descida longa, cheiro de queimado e pedal de freio endurecido indicam:",
        options: ["Fluido de freio vencido — bombar o pedal.", "Aquecimento do fluido com formação de vapor (fading) — reduzir marcha e usar freio motor.", "Desgaste de pastilhas — acionar o freio de estacionamento.", "Rolamento travando — imobilizar e resfriar as rodas."],
        correctIndex: 1,
        explanation: "Fading = usar freio motor (marcha reduzida) para preservar os freios.",
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
        statement: "Após abastecer, o veículo vibra no volante e perde força. A causa mais provável é:",
        options: ["Combustível adulterado ou com água no tanque.", "Tampa do tanque aberta.", "Correia do alternador solta.", "Óleo trocado por engano junto com combustível."],
        correctIndex: 0,
        explanation: "Combustível ruim ou com água = vibração e perda de força.",
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
        statement: "Sobre o sistema de arrefecimento, assinale a alternativa INCORRETA:",
        options: ["O líquido de arrefecimento deve ser mistura de água desmineralizada com aditivo.", "A ventoinha do radiador é acionada automaticamente por sensor de temperatura.", "A água da torneira comum pode substituir o líquido de arrefecimento sem prejuízos.", "Verificar o nível do reservatório de expansão faz parte da manutenção preventiva."],
        correctIndex: 2,
        explanation: "Água comum NÃO pode substituir o líquido de arrefecimento.",
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
        statement: "Sobre o uso das luzes do veículo, a conduta correta é:",
        options: ["Farol alto permitido em qualquer via durante a noite.", "Luz de neblina substitui o farol baixo em condições normais.", "Pisca-alerta só em emergência, imobilização ou perigo, nunca em movimento.", "Lanterna de posição dispensa o farol baixo em vias iluminadas."],
        correctIndex: 2,
        explanation: "Pisca-alerta = carro parado ou perigo. Não use na chuva.",
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
        statement: "Alavanca do câmbio vibra e o engate das marchas está difícil. O componente gasto é:",
        options: ["A embreagem, patinando por desgaste do disco.", "O freio, travando as rodas dianteiras.", "O óleo do câmbio, baixo ou velho demais.", "A correia dentada, gasta e precisando de troca."],
        correctIndex: 2,
        explanation: "Vibração + dificuldade ao engatar = óleo do câmbio baixo ou velho.",
        detailedExplanation: "O óleo do câmbio é o que lubrifica as engrenagens e sincronizadores. Se ele estiver baixo ou velho, não consegue fazer isso direito, e aí surgem os problemas para engatar marchas e a vibração na alavanca. A embreagem desgastada não causa isso, e a correia dentada não tem a ver com o câmbio.",
        commonMistake: "Muita gente confunde os sinais de embreagem desgastada com problemas no câmbio.",
        tip: "Dificuldade ao engatar marchas = óleo do câmbio.",
        incidence: "media",
        trap: true,
        difficulty: 2
    },
    {
        id: "qp25",
        category: "meio-ambiente",
        statement: "A destinação correta do óleo lubrificante usado é:",
        options: ["Queimar em fornos industriais.", "Descartar na pia ou no ralo.", "Armazenar em recipiente fechado e entregar em ponto de coleta credenciado.", "Jogar diretamente no solo."],
        correctIndex: 2,
        explanation: "Óleo usado = ponto de coleta para reciclagem (rerrefino).",
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
        statement: "O hábito que contribui para reduzir a emissão de poluentes é:",
        options: ["Manter o motor ligado em paradas prolongadas.", "Realizar manutenção preventiva periódica do sistema de ignição, alimentação e escapamento.", "Utilizar combustível de menor octanagem.", "Acelerar o motor antes de desligá-lo."],
        correctIndex: 1,
        explanation: "Manutenção periódica = menos poluição.",
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
        statement: "Veículo emitindo fumaça escura densa acima do permitido comete infração:",
        options: ["Grave, com multa e retenção do veículo.", "Leve, com advertência verbal.", "Não é infração de trânsito, apenas ambiental.", "Média, com multa e 4 pontos."],
        correctIndex: 0,
        explanation: "Fumaça excessiva = GRAVE (art. 231, III). Multa e retenção.",
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
        statement: "A destinação correta de pneus inservíveis é:",
        options: ["Queimar em usinas de cimento.", "Descartar em aterros sanitários comuns.", "Entregar em pontos de coleta para reciclagem ou coprocessamento.", "Reutilizar como jardineiras ou mobiliário."],
        correctIndex: 2,
        explanation: "Pneus usados = pontos de coleta (logística reversa obrigatória).",
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
        statement: "Em via estreita com vegetação seca, a conduta VEDADA por risco de incêndio é:",
        options: ["Trafegar em baixa velocidade.", "Manter o ar-condicionado em recirculação.", "Jogar pontas de cigarro ou fósforos acesos pela janela.", "Acionar o pisca-alerta ao reduzir a velocidade."],
        correctIndex: 2,
        explanation: "Bituca pela janela = infração média + risco de incêndio.",
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
        statement: "A destinação correta da bateria automotiva usada é:",
        options: ["Descartar no lixo comum após descarregar.", "Neutralizar o ácido com soda cáustica e descartar na pia.", "Devolver ao revendedor no ato da compra de uma nova.", "Não oferece risco ambiental significativo."],
        correctIndex: 2,
        explanation: "Bateria velha = devolver na compra da nova (logística reversa).",
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
        statement: "Avançar o sinal vermelho em cruzamento com faixa de pedestre é:",
        options: ["Infração gravíssima com agravante por colocar pedestre em risco.", "Infração grave, pois há pedestre na via.", "Infração média, pois o sinal estava vermelho.", "Não há agravante — a infração é sempre a mesma."],
        correctIndex: 2,
        explanation: "Sinal vermelho = gravíssima (7 pts). Com pedestre, a penalidade é agravada.",
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
        statement: "Segurar ou manusear o celular enquanto dirige é infração:",
        options: ["Leve — 3 pontos e multa.", "Média — 4 pontos e multa.", "Gravíssima — 7 pontos e multa, com fator multiplicador 3 se reincidente.", "Gravíssima — 7 pontos e multa."],
        correctIndex: 3,
        explanation: "Celular no volante = GRAVÍSSIMA. 7 pontos e multa.",
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
        statement: "O condutor que deixa de usar o cinto ou permite que passageiros menores viajem sem ele comete:",
        options: ["Duas infrações graves — uma para si e outra por passageiro.", "Uma única infração grave, independentemente do número de passageiros.", "Infração grave para si e leve para cada passageiro.", "Infração gravíssima para o condutor e grave para o proprietário."],
        correctIndex: 1,
        explanation: "Não usar cinto = GRAVE (5 pts). Uma única infração para o condutor.",
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
        statement: "Ultrapassar em local proibido (faixa contínua) é infração:",
        options: ["Grave — 5 pontos e multa simples.", "Gravíssima — 7 pontos e multa 5x, além de suspensão.", "Média — 4 pontos e multa.", "Gravíssima — 7 pontos e multa simples, sem multiplicador."],
        correctIndex: 1,
        explanation: "Ultrapassagem proibida = GRAVÍSSIMA x5 + suspensão.",
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
        statement: "Fugir do acidente com vítimas sem prestar socorro configura:",
        options: ["Apenas infração gravíssima com multa.", "Infração gravíssima e crime de omissão de socorro (detenção de 1 a 6 meses).", "Apenas crime de trânsito (homicídio culposo).", "Infração média, desde que não seja o proprietário."],
        correctIndex: 1,
        explanation: "Fugir = GRAVÍSSIMA + crime de omissão de socorro.",
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
        statement: "Sobre as infrações ligadas à habilitação (art. 162), é correto afirmar:",
        options: ["Dirigir com CNH vencida há mais de 30 dias é gravíssima com multa 3x.", "Dirigir com CNH de categoria divergente é leve com advertência.", "Dirigir sem CNH ou PPD é gravíssima com multa 3x e pode configurar crime.", "Dirigir com CNH de categoria diferente é média com retenção do veículo."],
        correctIndex: 2,
        explanation: "Sem CNH = GRAVÍSSIMA x3. CNH vencida +30 dias = GRAVE.",
        detailedExplanation: "O art. 162 do CTB fala sobre as infrações de habilitação: (I) dirigir sem CNH ou PPD é GRAVÍSSIMA com multa triplicada e pode ser crime se causar perigo; (II) dirigir com CNH vencida há mais de 30 dias é uma infração GRAVE; (III) dirigir com CNH de categoria diferente também é GRAVÍSSIMA, mas sem multiplicador. A alternativa A confunde as classificações, pois a CNH vencida é apenas grave.",
        legalBase: "Art. 162, I, II e III do CTB",
        commonMistake: "A banca costuma confundir: sem CNH é gravíssima x3, mas CNH vencida há +30 dias é só grave.",
        tip: "Sem CNH = GRAVÍSSIMA x3. CNH vencida +30 dias = GRAVE.",
        incidence: "alta",
        trap: true,
        difficulty: 3
    },
    {
        id: "qp37",
        category: "primeiros-socorros",
        statement: "A retirada técnica do capacete de vítima inconsciente deve ser feita:",
        options: ["Puxando o capacete com força para cima.", "Com duas pessoas, mantendo cabeça e pescoço alinhados e imóveis.", "Cortando o capacete ao meio com faca.", "Aguardar a vítima retomar a consciência."],
        correctIndex: 1,
        explanation: "2 pessoas: uma segura a cabeça, outra remove com cuidado.",
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
        statement: "Vítima com corte profundo no braço apresenta hemorragia abundante. Sem material hospitalar, a conduta imediata é:",
        options: ["Amarrar um garrote improvisado bem apertado acima do corte para interromper o fluxo sanguíneo.", "Aplicar pressão firme e contínua sobre o ferimento com pano limpo, sem soltar até o socorro chegar.", "Erguer o membro para cima e aguardar que o sangramento cesse espontaneamente pela ação da gravidade.", "Limpar o corte com álcool ou água oxigenada e cobrir com curativo oclusivo fechado."],
        correctIndex: 1,
        explanation: "A compressão direta com pano limpo é a primeira medida para conter hemorragia. O torniquete só é indicado em último caso, quando a compressão falha.",
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
        statement: "Vítima acordada, porém confusa, com pele pálida, fria e sudoréica, respiração rápida e superficial, sem sangramento visível. O quadro sugere:",
        options: ["Estado de choque — deitar a vítima, elevar os membros inferiores em cerca de 30 cm e agasalhar até o socorro.", "Vertigem simples — manter a vítima em pé e orientá-la a caminhar para retomar a circulação.", "Hipoglicemia — administrar bebida ou alimento açucarado imediatamente por via oral.", "Exaustão pós-trauma — deixar a vítima descansar até o retorno espontâneo da consciência plena."],
        correctIndex: 0,
        explanation: "Palidez, pele fria e úmida, respiração rápida e pulso fraco indicam choque. A conduta é deitar, elevar as pernas e agasalhar a vítima.",
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
        statement: "Após colisão, vítima consciente refere dor intensa na coluna e relata não conseguir mexer as pernas. Diante da suspeita de lesão medular, a conduta é:",
        options: ["Ajudar a vítima a sentar-se devagar para verificar se a dor diminui com a mudança de posição.", "Virar a vítima de bruços (decúbito ventral) para aliviar a pressão sobre a coluna.", "Não movimentar a vítima, imobilizar a cabeça e o pescoço manualmente ou com suporte improvisado, mantendo-a na posição encontrada até a chegada do socorro especializado.", "Puxar a vítima pelas pernas para retirá-la do asfalto quente e colocá-la na calçada."],
        correctIndex: 2,
        explanation: "A suspeita de lesão medular exige imobilização total. Movimentar a vítima pode causar danos permanentes à medula.",
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
        statement: "Vítima de acidente apresenta crise convulsiva com contrações musculares generalizadas e perda transitória da consciência. O socorrista deve:",
        options: ["Colocar a mão ou um objeto duro dentro da boca da vítima para evitar que ela morda a língua.", "Segurar firmemente os braços e pernas da vítima para imobilizá-la durante a convulsão.", "Afastar objetos próximos que possam ferir a vítima, proteger a cabeça com algo macio e aguardar a crise passar, sem conter os movimentos.", "Jogar água fria no rosto da vítima para fazê-la parar de convulsionar."],
        correctIndex: 2,
        explanation: "Durante a convulsão, proteja a cabeça, afaste objetos perigosos e não contenha os movimentos. Nunca coloque objetos na boca da vítima.",
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
        statement: "A Autorização para Conduzir Ciclomotor (ACC) habilita o cidadão a pilotar ciclomotores de até 50cc. Qual o requisito de idade mínima e a validade inicial desse documento?",
        options: ["Idade mínima de 16 anos (desde que emancipado) e validade inicial de 2 anos.", "Idade mínima de 18 anos, exigindo-se a imputabilidade penal, e validade inicial de 1 ano (estágio probatório, PCC).", "Idade mínima de 18 anos, com concessão direta em caráter definitivo, dispensando o período probatório.", "Idade mínima de 21 anos, com exigência de curso de especialização em transporte de ciclomotores."],
        correctIndex: 1,
        explanation: "A ACC exige idade mínima de 18 anos (imputabilidade penal) e tem validade inicial de 1 ano, em caráter provisório (PCC).",
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
        statement: "Condutor habilitado na categoria B há 3 anos deseja dirigir veículos das categorias C, D e E. Quais os requisitos corretos de idade e tempo de habilitação?",
        options: ["C: 21 anos e 2 anos na B. D: 24 anos e 2 anos na B. E: 21 anos e 2 anos na B.", "C: 18 anos e estar habilitado na B. D: 21 anos e 2 anos na B. E: 21 anos e 1 ano na C.", "C: 18 anos e estar habilitado na B. D: 21 anos e 2 anos na B (ou 1 ano na C). E: 21 anos e 1 ano na C.", "C: 21 anos e 1 ano na B. D: 21 anos e 2 anos na B. E: 24 anos e 2 anos na C."],
        correctIndex: 2,
        explanation: "C exige 18 anos e habilitação na B. D exige 21 anos e 2 anos na B ou 1 ano na C. E exige 21 anos e 1 ano na C.",
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
        statement: "O condutor que exerce atividade remunerada em veículo (EAR) possui regras específicas no sistema de pontuação. Sobre a suspensão do direito de dirigir, assinale a alternativa correta:",
        options: ["O condutor EAR tem limite de 30 pontos para suspensão, independentemente das infrações cometidas.", "O condutor EAR não está sujeito ao sistema de pontuação, apenas a multas.", "O condutor EAR tem limite fixo de 40 pontos para suspensão, independentemente da natureza das infrações.", "O condutor EAR perde o direito de dirigir ao atingir 20 pontos, independentemente das infrações serem graves ou leves."],
        correctIndex: 2,
        explanation: "O condutor EAR tem limite fixo de 40 pontos para suspensão, independentemente da natureza das infrações. É uma regra especial do CTB.",
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
        statement: "O condutor com CNH suspensa por pontuação ou infração específica deve cumprir requisitos para reabilitar-se. Sobre o processo de reabilitação, assinale a alternativa correta:",
        options: ["A suspensão tem prazo mínimo de 30 dias e máximo de 12 meses, e o condutor deve frequentar curso de reciclagem para reabilitar-se.", "A suspensão é definitiva e o condutor deve reiniciar todo o processo de habilitação.", "O condutor pode recorrer da suspensão dirigindo normalmente até o julgamento do recurso, sem restrições.", "A suspensão por pontos exige apenas o pagamento das multas para reabilitação, sem necessidade de curso."],
        correctIndex: 0,
        explanation: "A suspensão da CNH dura de 30 dias a 12 meses e exige curso de reciclagem com prova teórica para reabilitação (Arts. 261 e 268 do CTB).",
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
        statement: "Sobre a validade da CNH, a Lei 14.071/2021 estabelece prazos diferentes conforme a faixa etária. Assinale a alternativa que indica corretamente os prazos:",
        options: ["10 anos para condutores com até 50 anos; 5 anos para condutores entre 50 e 69 anos; 3 anos para condutores com 70 anos ou mais.", "10 anos para condutores com até 60 anos; 5 anos para condutores entre 60 e 69 anos; 3 anos para condutores com 70 anos ou mais.", "5 anos para todos os condutores, independentemente da idade, mas com exigência de exame médico anual para maiores de 65 anos.", "10 anos para condutores com até 65 anos; 5 anos para condutores entre 65 e 74 anos; 2 anos para condutores com 75 anos ou mais."],
        correctIndex: 0,
        explanation: "Validade da CNH após a Lei 14.071/2021: até 50 anos = 10 anos; 50 a 69 anos = 5 anos; 70 anos ou mais = 3 anos.",
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
        statement: "A direção defensiva estabelece três conceitos fundamentais: distância de reação, distância de frenagem e distância de parada. Sobre esses conceitos, assinale a alternativa correta:",
        options: ["Distância de reação é o percurso percorrido desde o momento em que o condutor pisa no freio até a parada total do veículo.", "Distância de frenagem é o percurso percorrido desde a percepção do perigo até o acionamento do freio.", "Distância de parada é a soma da distância de reação com a distância de frenagem, ou seja, desde a percepção do perigo até a parada total.", "Distância de reação é sempre maior que a distância de frenagem em condições normais de piso e pneus."],
        correctIndex: 2,
        explanation: "Distância de parada = distância de reação + distância de frenagem. A reação vai da percepção do perigo ao acionamento do freio; a frenagem vai do acionamento do freio à parada total.",
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
        statement: "Sob chuva forte, o veículo passa sobre poça d'água na pista de rolamento; o volante fica leve e o veículo flutua, perdendo aderência — é a aquaplanagem. A conduta para retomar o controle é:",
        options: ["Aplicar frenagem intensa e girar o volante contra a derrapagem para realinhar o veículo.", "Desligar imediatamente o motor para reduzir a velocidade e recuperar a aderência.", "Retirar o pé do acelerador, manter o volante reto e não frear, aguardando o recontato dos pneus.", "Acelerar firmemente para expulsar a água dos sulcos e realçar a aderência dos pneus."],
        correctIndex: 2,
        explanation: "Na aquaplanagem, retire o pé do acelerador, mantenha o volante reto e não freie. Aguarde os pneus recuperarem o contato com o solo.",
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
        statement: "Ao fazer uma curva em alta velocidade, o condutor sente seu corpo sendo 'empurrado' para o lado de fora da curva. Esse fenômeno físico, que influencia a estabilidade do veículo, é denominado:",
        options: ["Força centrípeta — que puxa o veículo para dentro da curva, sendo neutralizada pelo peso do veículo.", "Força centrífuga — que empurra o veículo para fora da curva, aumentando com a velocidade e exigindo redução de marcha antes da entrada da curva.", "Atrito lateral — que faz o pneu deslizar lateralmente quando o veículo está muito lento na curva.", "Momento de inércia — que mantém o veículo em linha reta, exigindo aceleração constante na curva."],
        correctIndex: 1,
        explanation: "A força centrífuga empurra o veículo para fora da curva. A conduta correta é reduzir a velocidade antes de entrar na curva, não durante.",
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
        statement: "Sobre o uso de faróis em rodovias de pista dupla, assinale a conduta correta segundo o CTB e os princípios da direção defensiva:",
        options: ["O farol alto deve ser mantido aceso permanentemente em rodovias para melhorar a visibilidade, independentemente de outros veículos.", "O farol baixo deve estar aceso em rodovias mesmo durante o dia (obrigatório), e à noite deve-se usar o farol alto, reduzindo para baixo ao cruzar com outro veículo ou ao seguir atrás de outro.", "À noite, o farol alto só pode ser usado em vias rurais não pavimentadas, sendo proibido em rodovias pavimentadas.", "A luz de neblina dianteira substitui o farol baixo à noite, sendo mais eficiente e consumindo menos energia da bateria."],
        correctIndex: 1,
        explanation: "O farol baixo é obrigatório em rodovias durante o dia. À noite, usa-se o farol alto, reduzindo ao cruzar ou seguir outro veículo (Arts. 40 e 250 do CTB).",
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
        statement: "Caminhão bitrem trafega pela faixa da direita em rodovia de pista dupla e o condutor pretende ultrapassá-lo pela esquerda. Pela direção defensiva e pelo CTB, os cuidados essenciais são:",
        options: ["Buzinar de forma contínua na aproximação e acelerar ao máximo para minimizar o tempo na faixa adjacente.", "Conferir o espaço disponível, sinalizar com a seta, ultrapassar pela esquerda com segurança e retornar à faixa direita só após visualizar o caminhão inteiro no retrovisor interno.", "Ultrapassar pela direita, pois os caminhões trafegam pela esquerda, usando o acostamento se necessário.", "Acionar o pisca-alerta previamente para comunicar a todos que efetuará a ultrapassagem."],
        correctIndex: 1,
        explanation: "A ultrapassagem deve ser feita pela esquerda, com sinalização prévia (seta), verificação de espaço e retorno à faixa apenas após visualizar o veículo ultrapassado no retrovisor.",
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
        statement: "Em rotatória sem semáforo, o condutor aguarda para ingressar enquanto outro veículo já circula pela faixa interna. A preferência de passagem é:",
        options: ["Do veículo em manobra de ingresso, pois a conversão na rotatória lhe assegura prioridade sobre o tráfego interno.", "Do veículo que já trafega dentro da rotatória; o condutor que se aproxima deve aguardar, prevalecendo a circulação contínua.", "Do veículo que se aproxima pela direita do condutor, pois a regra geral da direita supera a preferência da rotatória.", "De todos simultaneamente, cabendo a cada um transpor o eixo da entrada na ordem de chegada ao ponto de conflito."],
        correctIndex: 1,
        explanation: "Na rotatória, o veículo que já circula internamente tem preferência. O condutor que se aproxima deve aguardar, mesmo que outro venha pela direita (Art. 29, II do CTB).",
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
        statement: "Ambulância em serviço de urgência, com sirene e giroflex acionados, aproxima-se de interseção em vermelho; veículos parados obstruem a pista de rolamento. A conduta dos demais condutores deve ser:",
        options: ["Manter a posição parada, pois o sinal vermelho prevalece sobre qualquer prioridade de trânsito.", "Transpor o sinal vermelho imediatamente sem sinalizar, para não obstruir a passagem da ambulância.", "Deslocar-se com segurança para a faixa da esquerda, abrir passagem pela direita e, se necessário, avançar o vermelho com cuidado.", "Buzinar sucessivamente para indicar o sinal fechado e manter-se parado no eixo da via."],
        correctIndex: 2,
        explanation: "Veículos de emergência com sirene têm prioridade. Os demais condutores devem se deslocar para a esquerda, liberando a direita, e podem avançar o sinal vermelho se necessário (Art. 29, §2º do CTB).",
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
        statement: "Em faixa de travessia sem semáforo, deficiente visual parado na calçada mantém a bengala branca estendida aguardando atravessar. O condutor deve:",
        options: ["Acionar a buzina para sinalizar a presença do veículo, pois o pedestre pode não perceber a aproximação.", "Reduzir a velocidade e transpor a faixa lentamente, mantendo distância segura do pedestre parado.", "Parar o veículo e aguardar a travessia completa, assegurando prioridade absoluta do pedestre com deficiência visual.", "Prosseguir normalmente, pois ausência de semáforo significa igualdade de condições na interseção."],
        correctIndex: 2,
        explanation: "O pedestre com deficiência visual (bengala branca) tem prioridade absoluta. O condutor deve parar e aguardar a travessia completa (Art. 70 do CTB).",
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
        statement: "Em rodovia, o condutor observa placa azul com símbolo de telefone e, adiante, placa verde com nome de cidade e distância. Pela classificação do CTB, os grupos de sinalização dessas placas são:",
        options: ["Ambas de regulamentação, pois constituem ordens que o condutor deve cumprir.", "A primeira é de advertência sobre serviço auxiliar e a segunda é de regulamentação de destino.", "A primeira identifica serviço auxiliar e a segunda orienta destino — ambas integram a sinalização de indicação.", "A primeira é de advertência e a segunda de indicação turística de traçado rodoviário."],
        correctIndex: 2,
        explanation: "Placa azul com símbolo branco indica serviço auxiliar; placa verde indica destino. Ambas pertencem à sinalização de indicação.",
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
        statement: "O condutor visualiza placa circular de fundo branco, orla vermelha e buzina riscada; adiante, placa quadrada losangular amarela com desenho de criança. A classificação dessas placas é:",
        options: ["A primeira é de advertência sobre trânsito de veículos sonoros e a segunda de regulamentação que obriga o uso de buzina.", "A primeira é de regulamentação, que proíbe o acionamento de sinal sonoro, e a segunda é de advertência, que alerta para área com crianças.", "Ambas são de regulamentação, pois impõem condutas obrigatórias ao condutor.", "A primeira é de regulamentação e a segunda é de indicação de serviço auxiliar de trânsito."],
        correctIndex: 1,
        explanation: "Placa circular branca com borda vermelha é de regulamentação (R-19: proibido buzinar). Placa quadrada amarela é de advertência (A-32b: crianças).",
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
        statement: "Em rodovia em obras, a pista de rolamento afunila e a placa A-10 anuncia redução do número de faixas adiante. Ao se aproximar desse estreitamento, o condutor deve:",
        options: ["Acelerar para transpor o trecho antes do afunilamento e assegurar a preferência de passagem.", "Reduzir a velocidade, observar a sinalização e revezar a passagem, cedendo aos veículos já presentes no trecho.", "Imobilizar o veículo no meio da pista com o pisca-alerta até que o trânsito seja retomado.", "Manter a velocidade e acionar sucessivamente a buzina para alertar os demais usuários."],
        correctIndex: 1,
        explanation: "A placa A-10 adverte sobre estreitamento da pista. A conduta correta é reduzir a velocidade e cooperar na passagem alternada (sistema 'zíper').",
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
        statement: "De acordo com o art. 90 do CTB, a sinalização também é realizada por sinais sonoros (silvos de apito) do agente de trânsito. Sobre os silvos, é correto afirmar que:",
        options: ["Um silvo longo significa 'sigam' (liberar a passagem) e dois silvos breves significam 'diminuam a marcha'.", "Um silvo breve significa 'sigam'; dois silvos breves significam 'parem'; um silvo longo significa 'diminuam a marcha'.", "Os silvos não possuem significado oficial, servindo apenas para chamar a atenção dos condutores.", "Os silvos de apito só têm validade se acompanhados de gestos; isoladamente não orientam o trânsito."],
        correctIndex: 1,
        explanation: "Um silvo breve = siga; dois silvos breves = pare; um silvo longo = diminua a marcha. São sinais sonoros oficiais do agente de trânsito.",
        detailedExplanation: "O apito do agente é uma forma oficial de sinalização. Um silvo breve significa 'siga'; dois silvos breves significam 'pare'; e um silvo longo significa 'diminuam a marcha'. Decorar esses sinais é fácil e ajuda na prova.",
        legalBase: "Art. 90 do CTB",
        commonMistake: "Muita gente confunde e acha que dois silvos breves significam 'siga' ou que o silvo longo é pra parar. Lembre: 1 breve = siga; 2 breves = pare; 1 longo = devagar.",
        tip: "1 pio = vai; 2 pios = para; 1 pio longo = devagar.",
        incidence: "altissima",
        trap: true,
        difficulty: 2
    },
    {
        id: "qd03",
        category: "legislacao",
        statement: "Em interseção com semáforo funcionando, agente de trânsito determina com gestos que os veículos de uma via avancem e os da transversal parem. A conduta correta é:",
        options: ["Obedecer aos gestos do agente, pois suas ordens prevalecem sobre o semáforo e demais sinais.", "Obedecer ao semáforo, pois os equipamentos eletrônicos possuem prioridade sobre ordens humanas.", "Obedecer às placas, por serem elementos fixos e permanentes da sinalização.", "Considerar o agente apenas como orientador, seguindo o semáforo para evitar autuação."],
        correctIndex: 0,
        explanation: "As ordens do agente de trânsito prevalecem sobre o semáforo e demais sinais (Art. 89 do CTB). O condutor deve obedecer aos gestos do agente.",
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
        statement: "Em via urbana de mão dupla sem canteiro central, o condutor pretende converter à esquerda na interseção. A conduta correta antes e durante a conversão é:",
        options: ["Aproximar-se do ângulo esquerdo da via, imobilizar o veículo e cruzar assim que possível.", "Aproximar-se da linha divisória central sem invadir a pista contrária e só converter após ceder o fluxo oposto.", "Aproximar-se do bordo direito ou do acostamento, parar e aguardar a via totalmente livre.", "Permanecer ao centro da faixa, acionar o pisca-alerta e converter rapidamente, pois a sinalização dá preferência."],
        correctIndex: 1,
        explanation: "Para converter à esquerda em via de mão dupla, aproxime-se da linha central sem invadir a contramão e ceda passagem aos veículos do fluxo oposto (Art. 38, II do CTB).",
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
        statement: "Em tráfego intenso, o fluxo à frente para de repente e o condutor aciona os comandos de forma equivocada: as rodas traseiras travam e a traseira derrapa. A causa é:",
        options: ["Pisar no freio progressivamente, acompanhado do acionamento da embreagem antes da imobilização total.", "Puxar o freio de mão com o veículo em movimento ou forçar redução de marcha em alta rotação, travando o eixo traseiro.", "Atuação do ABS, que imobiliza simultaneamente tambor e sapata traseiros para máxima desaceleração.", "Falha de fluido no cilindro mestre, que equaliza a pressão e trava apenas o freio traseiro."],
        correctIndex: 1,
        explanation: "O freio de mão em movimento ou a redução abrupta de marcha em alta rotação trava as rodas traseiras, causando derrapagem. O ABS, ao contrário, evita o travamento.",
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
        statement: "No perímetro urbano, à saída de escola, o condutor encontra grande concentração de crianças no bordo da pista, atravessando fora da faixa de pedestres. Em área escolar, a conduta defensiva é:",
        options: ["Acelerar para atravessar o agrupamento rapidamente, utilizando a buzina para afastar as crianças.", "Reduzir a velocidade de forma adequada ao trecho, mantendo atenção integral e prontidão para frear e parar.", "Manter a velocidade máxima da sinalização, pois a travessia irregular é responsabilidade dos pedestres.", "Acionar o pisca-alerta, manter a velocidade e usar o farol alto para assegurar a preferência do veículo."],
        correctIndex: 1,
        explanation: "Em área escolar com crianças, a velocidade deve ser reduzida abaixo do limite da via, com atenção total e prontidão para parar. A sinalização não elimina o risco real.",
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
        statement: "Em rodovia de trânsito rápido de pista dupla, o condutor deixa de tomar a alça de acesso pretendida. Pela direção defensiva e pelo CTB, a conduta correta é:",
        options: ["Imobilizar no acostamento, acionar o pisca-alerta e efetuar marcha ré até alcançar a alça perdida.", "Parar no acostamento, descer do veículo e buscar atalho ou entrada clandestina nas proximidades.", "Seguir na rodovia na velocidade da via até a próxima saída ou retorno sinalizado e liberado.", "Circulando lentamente pela faixa da direita com a seta ligada, aguardar brecha no canteiro central."],
        correctIndex: 2,
        explanation: "Perdida a saída, o condutor deve seguir até a próxima saída, interseção ou retorno sinalizado. Marcha à ré em rodovia é infração gravíssima.",
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
        statement: "O condutor circula à noite em via urbana sem iluminação pública com a luz interna de teto acesa. Sobre esse hábito, a avaliação correta pela direção defensiva é:",
        options: ["A luz interna auxilia os demais usuários a identificar o veículo, funcionando como item adicional de segurança.", "A luz de teto destina-se ao veículo imobilizado; em movimento, reflete no para-brisa e compromete a visão noturna.", "A luz interna substitui a lanterna traseira caso o farol queime, permitindo a circulação noturna.", "O uso da luz de teto é recomendado em vias sem poste, para sinalizar a presença de ocupantes."],
        correctIndex: 1,
        explanation: "A luz interna em movimento reflete no para-brisa e prejudica a visão noturna. Ela não tem função de sinalização e compromete a segurança.",
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
        statement: "Em fiscalização, veículo é reprovado na inspeção de fumaça e ruído (PROCONVE), com escapamento e catalisador deficientes, e o proprietário segue circulando sem regularizar. Aplicam-se:",
        options: ["Infração gravíssima, com multa, suspensão do direito de dirigir e remoção imediata do veículo.", "Infração grave, com multa e retenção do veículo até a regularização do escapamento e nova inspeção.", "Infração leve, com mera advertência escrita por se tratar da primeira ocorrência.", "Configura crime ambiental, com cassação da CNH e apreensão do veículo pelo órgão ambiental."],
        correctIndex: 1,
        explanation: "Dirigir com emissão irregular de poluentes é infração grave, com multa e retenção do veículo até regularização (Art. 230, XVIII do CTB).",
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
        statement: "O condutor trafega por via urbana coletora que distribui o fluxo das arteriais, sem placa R-19 de velocidade. Pelo limite padrão do CTB, a velocidade máxima nessa coletora é de:",
        options: ["30 km/h, por ser via local de acesso restrito a edificações.", "40 km/h, padrão das vias coletoras sem sinalização regulamentadora.", "60 km/h, padrão das vias arteriais de ligação contínua entre regiões.", "80 km/h, padrão das vias de trânsito rápido do perímetro urbano."],
        correctIndex: 1,
        explanation: "Via coletora sem sinalização regulamentadora tem limite padrão de 40 km/h (Art. 61, §1º, I, 'c' do CTB).",
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
        statement: "Após sinistro, o veículo ficou imobilizado sobre a pista de rolamento, com o trânsito circulando pelo trecho. O modo correto de sinalizar o local é:",
        options: ["Acionar o pisca-alerta e posicionar o triângulo a pelo menos 30 metros atrás do veículo, perpendicular ao eixo da via e bem visível.", "Acionar o pisca-alerta e posicionar o triângulo a exatos 30 metros à frente do veículo, paralelo ao eixo da via.", "Posicionar o triângulo a cerca de 30 metros ao centro da faixa, sem acionar o pisca-alerta se o veículo estiver visível.", "Posicionar o triângulo a menos de 30 metros, atravessado na via, pois a distância mínima só se aplica com vítima."],
        correctIndex: 0,
        explanation: "A sinalização do sinistro exige pisca-alerta e triângulo a pelo menos 30 metros atrás do veículo, em posição visível e perpendicular ao eixo da via.",
        detailedExplanation: "Depois de um acidente, se o motorista puder fazer algo pra evitar mais problemas, ele deve sinalizar bem o local. Isso inclui ligar as luzes de alerta e colocar o triângulo a 30 metros da traseira do carro, de forma que fique visível e na posição certa.",
        legalBase: "CTB, art. 176, V; CTB, art. 225, conforme a situação; Manual Brasileiro de Fiscalização de Trânsito (MBFT), procedimentos relativos à sinalização do local do sinistro.",
        commonMistake: "Um erro comum é achar que a distância de 30 metros é medida da frente do carro ou que o triângulo deve ficar paralelo à pista.",
        tip: "Situação = Ação: Acidente = Luzes + Triângulo 30m atrás + Visível.",
        incidence: "alta",
        trap: true,
        difficulty: 3
    },
    {
        id: "qp64",
        category: "legislacao",
        statement: "Em via aberta à circulação, o trânsito deve ser feito pelo lado direito, admitindo-se exceções apenas quando devidamente sinalizadas. Pela norma geral do CTB, o trânsito deve ser feito:",
        options: ["Pelo lado esquerdo, seguindo o padrão internacional de trânsito rápido (mão inglesa), facilitando ultrapassagens seguras em vias urbanas.", "Pelo lado direito da via, admitindo-se as exceções devidamente sinalizadas pelo órgão competente ou em manobras de ultrapassagem.", "Pelo centro da via, para garantir uma distância segura dos acostamentos, calçadas e pedestres que circulam nas laterais.", "Pelo lado que apresentar melhor estado de conservação do asfalto, cabendo ao condutor decidir livremente a faixa mais conveniente."],
        correctIndex: 1,
        explanation: "A regra geral do CTB é circular pelo lado direito da via. Exceções só são admitidas quando sinalizadas ou em manobras de ultrapassagem (Art. 29, II do CTB).",
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
        statement: "Ao trafegar por via urbana, o condutor observa a placa de advertência A-32a. Qual o significado correto dessa placa e a conduta esperada do condutor?",
        options: ["A placa significa 'Trânsito de Pedestres'. Advertindo sobre a travessia habitual ou a presença de pedestres na via, o condutor deve redobrar a atenção e diminuir a velocidade, não sendo este local obrigatoriamente marcado com faixa delimitada.", "A placa significa 'Passagem Sinalizada de Pedestres'. O condutor deve parar obrigatoriamente o veículo antes do local indicado, pois a sinalização indica obrigatoriedade de preferência devido à faixa pintada na pista.", "A placa significa 'Área Escolar'. O condutor deve reduzir a velocidade para no máximo 30 km/h, pois indica a proximidade imediata de travessia exclusiva de alunos.", "A placa significa 'Pedestre, ande pela esquerda'. Trata-se de uma ordem de regulamentação destinada ao trânsito de pedestres nos acostamentos das rodovias."],
        correctIndex: 0,
        explanation: "A placa A-32a (sem faixa desenhada) indica 'Trânsito de Pedestres', advertindo sobre a presença habitual de pedestres. Não é a A-32b (com faixa) nem a A-33a (Área Escolar).",
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
        statement: "O motorista observa duas placas: a primeira proíbe o acionamento de buzina (R-20) e a segunda alerta para a proximidade de área escolar (A-33a). Como classificar essas placas?",
        options: ["A primeira é uma Placa de Regulamentação (R-20), de caráter imperativo e punitivo; a segunda é uma Placa de Advertência (A-33a), de caráter informativo e de alerta, que indica a proximidade de área escolar.", "A primeira é uma Placa de Advertência (R-20), que apenas sugere a não utilização de sinais sonoros; a segunda é uma Placa de Regulamentação (A-33a), que impõe o limite obrigatório de parada.", "Ambas são Placas de Regulamentação, pois a primeira proíbe o sinal sonoro e a segunda obriga a redução imediata para no máximo 30 km/h sob pena de apreensão do veículo.", "A primeira é uma Placa de Indicação, informando área hospitalar; a segunda é uma Placa de Advertência (A-32b), indicando obrigatoriedade de preferência sobre a faixa."],
        correctIndex: 0,
        explanation: "A R-20 é placa de regulamentação (proíbe buzinar, com penalidade). A A-33a é placa de advertência (alerta sobre área escolar, sem penalidade direta).",
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
        statement: "À noite, nas proximidades de hospital, o condutor visualiza a placa R-20. Assinale a alternativa que indica corretamente a classificação, o significado e a implicação do desrespeito:",
        options: ["Trata-se de uma Placa de Regulamentação que proíbe o uso da buzina ou sinal sonoro no local indicado. O desrespeito a esta ordem imperativa constitui infração de trânsito de natureza leve, sujeita a penalidade de multa.", "Trata-se de uma Placa de Advertência que apenas recomenda evitar o uso de sinal sonoro por cortesia urbana, não gerando autuação por infração de trânsito em caso de descumprimento.", "Trata-se de uma Placa de Indicação destinada exclusivamente a veículos de emergência, permitindo o uso da buzina apenas quando estiverem em serviço de urgência com iluminação vermelha ligada.", "Trata-se de uma Placa de Regulamentação que proíbe o uso de buzina no período das 22h às 6h, sendo o uso livre nos demais horários do dia."],
        correctIndex: 0,
        explanation: "A R-20 é placa de regulamentação que proíbe buzinar no local indicado, 24 horas por dia. O desrespeito é infração leve com multa.",
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
        statement: "O condutor aproxima-se de interseção sem semáforo e visualiza placa triangular de borda vermelha e fundo branco (R-2) à direita. Seu dever e a sanção pelo descumprimento são:",
        options: ["Parar sempre antes do cruzamento, mesmo sem outros veículos, sob pena de infração gravíssima.", "Ceder a passagem a quem circula na via preferencial, reduzindo ou parando se necessário; descumprir configura infração grave.", "Observar mera recomendação de cautela, sem qualquer multa por não parar no local.", "Manter a velocidade da via, pois o triângulo assegura preferência a quem converte à esquerda."],
        correctIndex: 1,
        explanation: "A placa R-2 (Dê a Preferência) exige ceder passagem a quem circula na via preferencial. O descumprimento é infração grave, não gravíssima como a R-1.",
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
        statement: "Condutor de 42 anos, habilitado na categoria B, comparece ao DETRAN para renovação da CNH. Sem doença que progrida com a idade, a validade do exame será de:",
        options: ["5 anos, reduzindo-se a 3 anos ao atingir a idade de 50 anos.", "10 anos, pois o condutor possui menos de 50 anos de idade.", "5 anos, prevalecendo 10 anos apenas para profissionais das categorias C, D e E.", "3 anos, prazo único aplicável a todos os condutores após a alteração legal."],
        correctIndex: 1,
        explanation: "Condutores com menos de 50 anos têm exame de aptidão válido por 10 anos (Art. 147, §2º, I do CTB, com a Lei 14.071/2021).",
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
        statement: "Trafegando por via até então de sentido único, o condutor se depara com a placa R-28. Qual o entendimento correto sobre a alteração das regras de trânsito a partir daquele ponto?",
        options: ["Indica que a pista passa a ser de mão dupla de direção, alterando o fluxo para ambos os sentidos de circulação.", "Informa que a via à frente possui faixa exclusiva reservada apenas para transporte coletivo e veículos de emergência.", "Proíbe expressamente a mudança de faixa de rolamento no trecho seguinte.", "Modifica a prioridade de passagem do cruzamento, tornando obrigatória a conversão à direita na próxima interseção."],
        correctIndex: 0,
        explanation: "A placa R-28 indica o início de pista de mão dupla, ou seja, a via passa a ter circulação em ambos os sentidos a partir daquele ponto.",
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
        statement: "Motorista conduz veículo de carga com altura total de 4,20 m e visualiza a placa R-16 com indicação '4 m' na entrada de um viaduto. Qual conduta deve ser adotada e qual a infração em caso de avanço?",
        options: ["O condutor pode prosseguir na via desde que trafegue pelo centro do viaduto, não configurando infração por haver margem de tolerância.", "O condutor está proibido de transitar pelo local, devendo buscar rota alternativa; desrespeitar essa limitação constitui infração de natureza grave.", "A placa refere-se apenas à largura útil da pista de rolamento, autorizando a passagem de veículos de qualquer altura.", "O condutor deve murchar parcialmente os pneus para rebaixar o veículo antes de transpor o obstáculo."],
        correctIndex: 1,
        explanation: "A placa R-16 indica altura máxima permitida. Veículo com altura superior ao limite não pode transitar pelo local; o descumprimento é infração grave.",
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
        statement: "Em rodovia de pista simples, o condutor observa a placa de advertência A-42a. Qual a correta interpretação dessa sinalização quanto às condições da via adiante?",
        options: ["Adverte que a pista simples passará a ter sentidos opostos separados por um canteiro central ou barreira física (Início de pista dupla).", "Adverte sobre o fim do canteiro central, voltando a pista a operar com fluxo em pista simples.", "Alerta para a existência de um cruzamento com via preferencial a 100 metros.", "Informa que o tráfego passará a ser canalizado em uma única faixa de rolamento por motivo de obras."],
        correctIndex: 0,
        explanation: "A placa A-42a indica o início de pista dupla, ou seja, a via passa a ter sentidos opostos separados por canteiro central ou barreira física.",
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
        statement: "Em trecho periurbano de velocidade elevada, o condutor visualiza a placa de advertência A-14. Qual a finalidade dessa sinalização e a ação preventiva adequada?",
        options: ["Advertir sobre a existência de controle semafórico adiante; o condutor deve reduzir a velocidade e preparar-se para eventual parada.", "Indicar a obrigatoriedade de parada imediata no local onde a placa está instalada.", "Alertar que o trecho está sob fiscalização eletrônica de velocidade por radar do tipo fotossensível.", "Informar sobre a existência de cruzamento de vias sem qualquer tipo de sinalização de preferência."],
        correctIndex: 0,
        explanation: "A placa A-14 adverte sobre a existência de semáforo à frente. O condutor deve reduzir a velocidade e preparar-se para eventual parada.",
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
        statement: "O condutor trafega por via urbana local em área residencial, sem placa R-19 de regulamentação de velocidade. Pelo limite padrão do CTB, a velocidade máxima é de:",
        options: ["30 km/h, por se tratar de via local sem sinalização regulamentadora.", "40 km/h, limite padrão das vias coletoras urbanas.", "50 km/h, limite geral das vias urbanas de circulação.", "20 km/h, por ser área residencial exclusiva de pedestres."],
        correctIndex: 0,
        explanation: "Via local sem sinalização regulamentadora tem limite padrão de 30 km/h (Art. 61, §1º, I, 'd' do CTB).",
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
        statement: "Condutor comete infração leve por portar documentos de obrigatória guarda sem os apresentar e não registra outra multa nos últimos 12 meses. A medida obrigatória é:",
        options: ["Multa com 50% de desconto e pontuação na CNH.", "Conversão obrigatória em Advertência por Escrito, de caráter educativo.", "Aplicação de medida administrativa de reciclagem obrigatória no DETRAN.", "Suspensão do direito de dirigir por até 30 dias."],
        correctIndex: 1,
        explanation: "Infração leve ou média cometida por condutor sem infrações nos últimos 12 meses é convertida obrigatoriamente em advertência por escrito (Art. 267 do CTB).",
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
        statement: "O condutor ingere bebida alcoólica ou substância psicoativa antes de dirigir: o julgamento do risco se deteriora e instala-se falsa sensação de segurança. O principal efeito sobre mente e corpo é:",
        options: ["Redução do tempo de reação com aceleração paradoxal dos reflexos.", "Retardamento dos reflexos e estreitamento da visão periférica (visão em túnel).", "Aumento da acuidade visual e da concentração simultânea sobre múltiplos estímulos.", "Melhora temporária da audição e redução das áreas cegas do veículo."],
        correctIndex: 1,
        explanation: "O álcool retarda os reflexos e estreita a visão periférica (visão em túnel), comprometendo a capacidade de reação do condutor.",
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
        statement: "Em grande centro urbano, a população fica exposta a monóxido de carbono, óxidos de nitrogênio e fuligem emitidos por veículos. A exposição prolongada provoca principalmente:",
        options: ["Distúrbios gastrointestinais crônicos decorrentes da ingestão involuntária de partículas.", "Doenças do sistema respiratório, como asma, bronquite crônica e enfisema pulmonar.", "Perda auditiva permanente em decorrência da contaminação das vias aéreas superiores.", "Enfermidades contagiosas transmitidas exclusivamente pela queima de combustíveis."],
        correctIndex: 1,
        explanation: "Os poluentes emitidos por veículos (monóxido de carbono, óxidos de nitrogênio e fuligem) afetam principalmente o sistema respiratório, causando asma, bronquite e enfisema.",
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
        statement: "A regra geral do CTB determina que a ultrapassagem deve ser feita pela esquerda. Porém, há uma única exceção para ultrapassagem pela direita. Assinale a alternativa que descreve essa exceção:",
        options: ["Quando o veículo da frente estiver trafegando em velocidade abaixo do limite máximo da via e o condutor buzinar solicitando passagem.", "Quando o veículo que estiver à frente indicar devidamente, por sinal regulamentar, que vai dobrar ou entrar à esquerda.", "Em rodovias de pista dupla, desde que o veículo que circula pela faixa da esquerda esteja impedindo o fluxo regular.", "Em qualquer via urbana de sentido único quando o acostamento da direita estiver desocupado."],
        correctIndex: 1,
        explanation: "A única exceção para ultrapassagem pela direita é quando o veículo da frente sinaliza que vai converter à esquerda (Art. 199 do CTB).",
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
        statement: "Dentro da estrutura do Sistema Nacional de Trânsito (SNT), o órgão colegiado máximo, de caráter exclusivamente NORMATIVO e CONSULTIVO, responsável por elaborar as Resoluções do trânsito brasileiro, é:",
        options: ["A Secretaria Nacional de Trânsito - SENATRAN.", "O Conselho Nacional de Trânsito - CONTRAN.", "O Departamento Estadual de Trânsito - DETRAN.", "A Polícia Rodoviária Federal - PRF."],
        correctIndex: 1,
        explanation: "O CONTRAN é o órgão máximo normativo e consultivo do SNT, responsável por elaborar as Resoluções do trânsito brasileiro (Arts. 7º, I e 12 do CTB).",
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
        statement: "A sinalização de trânsito é composta por elementos verticais, horizontais, dispositivos auxiliares, sinais luminosos, sonoros e gestos. Qual a finalidade da sinalização nas vias públicas?",
        options: ["Informar aos usuários sobre as condições da via, regulamentar obrigações, restrições e proibições, e advertir sobre perigos potenciais.", "Garantir a arrecadação de multas de trânsito pelos órgãos executivos em trechos de grande fluxo.", "Identificar e cadastrar a frota de veículos licenciados que transitam entre municípios vizinhos.", "Isentar a responsabilidade civil do Estado em caso de sinistros de trânsito em rodovias não concedidas."],
        correctIndex: 0,
        explanation: "A finalidade da sinalização é informar, regulamentar e advertir os usuários sobre as condições da via, visando a segurança e a fluidez do trânsito (Art. 80 do CTB).",
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
        statement: "Em rodovia de pista simples e duplo sentido, sem trevos ou locais específicos para conversão, o condutor deseja realizar retorno. A conduta correta estipulada pelo CTB é:",
        options: ["Aproximar o veículo do eixo central da pista e aguardar a brecha no tráfego para virar imediatamente.", "Parar o veículo no acostamento à direita, aguardar a oportunidade segura e cruzar a pista para efetuar o retorno.", "Imobilizar o veículo na faixa da esquerda e acionar o pisca-alerta até que ambos os sentidos fiquem livres.", "Avançar até o próximo acostamento da esquerda e realizar a conversão sem parar a marcha."],
        correctIndex: 1,
        explanation: "Na ausência de local próprio para retorno, o condutor deve parar no acostamento à direita e aguardar condição segura para cruzar a pista (Arts. 38 e 204 do CTB).",
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
        statement: "Em rodovia plana, ao ultrapassar 80 km/h o volante do veículo começa a tremer e vibrar intensamente. Considerando a manutenção preventiva, esse sintoma indica a necessidade de:",
        options: ["Substituição das pastilhas de freio dianteiras e sangria do fluido de freio.", "Execução do balanceamento das rodas para alinhar as massas do conjunto pneu e roda.", "Calibragem dos pneus com pressão 50% superior à recomendada pelo fabricante.", "Troca imediata do amortecedor traseiro e das buchas da suspensão."],
        correctIndex: 1,
        explanation: "Vibração no volante em altas velocidades indica desbalanceamento das rodas. O balanceamento corrige a distribuição de massa do conjunto pneu e roda.",
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
        statement: "Na sinalização horizontal sobre o pavimento, qual é a cor utilizada exclusivamente para a regulação de fluxos de sentidos opostos e delimitação de espaço de conversão à esquerda?",
        options: ["Branca, utilizada para separar fluxos opostos e marcar faixas de pedestres.", "Amarela, empregada na divisão de fluxos de sentidos opostos e proibição de estacionamento.", "Vermelha, utilizada para delimitar faixas de rolamento de veículos pesados.", "Azul, destinada a separar faixas de trânsito do mesmo sentido de circulação."],
        correctIndex: 1,
        explanation: "A cor amarela na sinalização horizontal é utilizada para separar fluxos de sentidos opostos e indicar proibição de estacionamento (Anexo II do CTB).",
        detailedExplanation: "A linha amarela na pista serve pra dividir quem vai em direções contrárias e também pra mostrar onde não pode parar ou estacionar. Já a linha branca é usada pra separar quem vai no mesmo sentido.",
        legalBase: "Anexo II do CTB - Sinalização Horizontal",
        commonMistake: "Muita gente confunde a linha amarela com a branca, achando que as duas têm a mesma função.",
        tip: "Linha AMARELA = Sentidos OPOSTOS | Linha BRANCA = MESMO sentido.",
        incidence: "alta",
        trap: true,
        difficulty: 3
    },
    {
        id: "nova_posicao_faixas_transito_alta_11",
        category: "legislacao",
        statement: "Em pista de rolamento com várias faixas no mesmo sentido, sem faixa exclusiva regulamentada, onde devem posicionar-se os veículos mais lentos ou de maior porte?",
        options: ["Nas faixas mais à esquerda, destinadas à circulação desses veículos em velocidade reduzida.", "Nas faixas mais à direita, devendo as faixas da esquerda ser destinadas à ultrapassagem e aos veículos de maior velocidade.", "Em qualquer faixa indistintamente, desde que acionem o pisca-alerta em trechos de aclive.", "Pelo acostamento da via, abrindo passagem contínua aos demais condutores."],
        correctIndex: 1,
        explanation: "Veículos mais lentos ou de maior porte devem se posicionar nas faixas mais à direita. As faixas da esquerda são destinadas à ultrapassagem (Art. 29, IV do CTB).",
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
        statement: "Aproximando-se de curva acentuada à direita em rodovia, qual a conduta correta para realizar a manobra com estabilidade e segurança?",
        options: ["Acelerar fortemente no início da curva para aumentar a aderência dos pneus ao solo.", "Reduzir a velocidade com antecedência ANTES de entrar na curva e acelerar suavemente durante a trajetória.", "Manter a velocidade elevada e acionar o freio bruscamente no meio do ápice da curva.", "Desengatar a marcha e fazer a curva em ponto morto para economizar combustível."],
        correctIndex: 1,
        explanation: "A velocidade deve ser reduzida antes de entrar na curva. Durante a curva, acelera-se suavemente para manter a estabilidade. Frear na curva compromete a aderência.",
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
        statement: "Os instrumentos do painel fornecem informações essenciais sobre a saúde mecânica e elétrica do veículo. Assinale a correspondência TÉCNICAMENTE CORRETA entre instrumento e função:",
        options: ["Termômetro: mede a pressão do óleo lubrificante no cárter do motor.", "Voltímetro: indica a taxa de rotação por minuto (RPM) das rodas.", "Manômetro: indica a pressão de óleo na linha de lubrificação do motor.", "Amperímetro: mede o nível e a temperatura da água no radiador."],
        correctIndex: 2,
        explanation: "O manômetro mede a pressão do óleo lubrificante. O termômetro mede a temperatura do líquido de arrefecimento. O tacômetro mede RPM.",
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
        statement: "A queima de combustíveis fósseis lança dióxido de enxofre e óxidos de nitrogênio, que formam chuva ácida. O impacto dessa precipitação sobre o patrimônio físico e os veículos é:",
        options: ["Corrosão e degradação de superfícies metálicas, pinturas veiculares e estruturas de concreto.", "Geração instantânea de neblina densa e precipitação de granizo tóxico nas rodovias.", "Destruição imediata dos pneus por atrito químico com o asfalto molhado.", "Supressão da camada de ozônio nas camadas inferiores da atmosfera urbana."],
        correctIndex: 0,
        explanation: "A chuva ácida causa corrosão de superfícies metálicas, degradação de pinturas veiculares e danos a estruturas de concreto e monumentos.",
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
        statement: "O condutor trafega pela faixa da esquerda quando percebe a aproximação de uma ambulância com sirene e iluminação vermelha intermitente acionados. Qual procedimento deve ser adotado?",
        options: ["Os veículos da faixa da esquerda devem deslocar-se para a direita e parar se necessário, e os demais condutores devem deixar livre a faixa da esquerda.", "Todos os veículos devem acelerar imediatamente para desobstruir o cruzamento mais próximo no menor tempo possível.", "Os condutores devem deslocar-se exclusivamente para o acostamento da esquerda e parar com o pisca-alerta ligado.", "Deve-se manter na faixa de rolamento e buzinar insistentemente para alertar os pedestres sobre a ambulância."],
        correctIndex: 0,
        explanation: "Diante de veículo de emergência com sirene, os condutores devem se deslocar para a direita, liberando a faixa da esquerda, e parar se necessário (Art. 29, VII, 'a' do CTB).",
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
        statement: "Em fiscalização de rotina, o agente constata que a CNH do motorista está vencida há 45 dias. Qual infração é configurada e qual a medida administrativa aplicada no local?",
        options: ["Infração média, sujeita apenas à retenção do veículo até a chegada de condutor habilitado.", "Infração gravíssima, punida com multa e recolhimento do documento de habilitação (CNH) como medida administrativa.", "Infração grave, sujeita à penalidade automática de cassação do direito de dirigir e apreensão do veículo.", "Crime de trânsito inafiançável com recolhimento imediato do condutor ao presídio estadual."],
        correctIndex: 1,
        explanation: "Dirigir com CNH vencida há mais de 30 dias é infração gravíssima, com multa e recolhimento da CNH (Art. 162, V do CTB).",
        detailedExplanation: "Quando a CNH está vencida por mais de 30 dias, isso é considerado uma infração GRAVÍSSIMA. A consequência é que o agente de trânsito retira a CNH do motorista e aplica a multa.",
        legalBase: "Art. 162, inciso V do CTB",
        commonMistake: "Muita gente pensa que pode dirigir com a CNH vencida até 30 dias sem problemas, mas isso é um erro.",
        tip: "CNH vencida até 30 dias = Tolerado | Vencida há +30 dias = Infração GRAVÍSSIMA + Recolhimento da CNH.",
        incidence: "alta",
        trap: true,
        difficulty: 3
    },
    {
        id: "nova_primeiros_socorros_colar_cervical_alta_19",
        category: "primeiros-socorros",
        statement: "Ao prestar atendimento a vítima de acidente com suspeita de trauma na coluna cervical devido a impacto traseiro, qual equipamento ortopédico deve ser empregado para estabilizar o pescoço?",
        options: ["Torniquete arterial de compressão rápida.", "Colar cervical ortopédico.", "Garrote de borracha vulcanizada.", "Bandagem elástica tipo atadura de compressão."],
        correctIndex: 1,
        explanation: "O colar cervical ortopédico é o equipamento específico para imobilizar o pescoço e proteger a medula em casos de suspeita de trauma cervical.",
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
        statement: "Analisando os deveres e proibições impostos aos condutores pelo CTB, assinale a alternativa juridicamente CORRETA:",
        options: ["Todo veículo poderá retornar em qualquer local nas vias urbanas, desde que não haja trânsito de pedestres.", "A circulação de veículos de passeio pelo acostamento das rodovias é livre sempre que houver congestionamento.", "É dever do condutor parar obrigatoriamente seu veículo antes de transpor linha férrea ou entrar em via com preferência de passagem onde haja sinalização.", "O condutor deve dar preferência aos pedestres exclusivamente quando estes estiverem sobre a faixa de segurança."],
        correctIndex: 2,
        explanation: "É dever do condutor parar obrigatoriamente antes de transpor linha férrea (Art. 212 do CTB). A preferência de pedestres não se restringe à faixa de segurança.",
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
        statement: "Para melhorar a visibilidade noturna, orientar a trajetória e canalizar o fluxo em pontos críticos, utilizam-se dispositivos refletivos fixados no pavimento. Quais elementos cumprem essa função?",
        options: ["Marcas transversais de retenção e faixas de pedestres.", "As tachas e os tachões refletivos (conhecidos como 'olhos de gato').", "Pinturas de legendas e símbolos de orientação de destino no asfalto.", "Placas de advertência instaladas no canteiro central."],
        correctIndex: 1,
        explanation: "Tachas e tachões refletivos ('olhos de gato') são dispositivos auxiliares fixados no pavimento para melhorar a visibilidade noturna e orientar a trajetória.",
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
        statement: "Durante atendimento emergencial, uma vítima consciente apresenta sangramento nasal abundante (epistaxe) sem sinais de fratura craniana grave. Qual a conduta inicial adequada?",
        options: ["Manter a vítima com a cabeça ligeiramente elevada, comprimir as narinas por alguns minutos e aplicar compressas frias sobre o nariz.", "Inclinar a cabeça da vítima totalmente para trás para fazer o sangue retornar à garganta.", "Tampar as narinas com sacos plásticos herméticos para estancar o fluxo de ar e sangue.", "Deitar a vítima de bruços e forçar a respiração exclusivamente pelo nariz."],
        correctIndex: 0,
        explanation: "Na epistaxe, a cabeça deve ficar ligeiramente elevada (nunca para trás), com compressão das narinas e compressas frias. Inclinar para trás faz a vítima engolir sangue.",
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
        statement: "No estudo da física aplicada à Direção Defensiva, como é denominada a distância percorrida pelo veículo DESDE O MOMENTO EM QUE O CONDUTOR PISA NO PEDAL DO FREIO até a sua parada total?",
        options: ["Distância de Reação.", "Distância de Seguimento.", "Distância de Frenagem.", "Distância de Parada Total."],
        correctIndex: 2,
        explanation: "A distância percorrida desde o acionamento do freio até a parada total é chamada de distância de frenagem. A distância de reação vai da percepção do perigo ao acionamento do freio.",
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
        statement: "O CTB classifica as vias abertas à circulação segundo sua função operacional. De acordo com a definição expressa do CTB, como são caracterizadas as VIAS COLETORAS?",
        options: ["Vias destinadas apenas ao acesso a áreas restritas ou estabelecimentos específicos.", "Vias caracterizadas por interseções em nível, destinadas a coletar e distribuir o trânsito que entra ou sai das vias de trânsito rápido ou arteriais.", "Vias sem interseções em nível, com acessos especiais e trânsito livre sem travessia de pedestres.", "Vias rurais pavimentadas destinadas à circulação intermunicipal de alta velocidade."],
        correctIndex: 1,
        explanation: "Vias coletoras são caracterizadas por interseções em nível e destinam-se a coletar e distribuir o trânsito entre vias arteriais e locais (Anexo I do CTB).",
        detailedExplanation: "Ela serve pra coletar e distribuir o trânsito que entra ou sai das vias rápidas. O limite de velocidade é de 40 km/h.",
        legalBase: "Anexo I e Art. 61 do CTB",
        commonMistake: "Muita gente confunde Via Coletora com Via Local ou Via Arterial.",
        tip: "Coletora = Recolhe o trânsito do bairro e joga nas avenidas principais (40 km/h).",
        incidence: "alta",
        trap: true,
        difficulty: 3
    },
    {
        id: "nova_primeiros_socorros_seguranca_local_alta_29",
        category: "primeiros-socorros",
        statement: "Em acidente com vítimas presas às ferragens e combustível derramado, o que o socorrista deve fazer antes de tocar nas vítimas?",
        options: ["Garantir a segurança pessoal e sinalizar o local para evitar acidentes secundários.", "Prestar socorro somente se houver autoridade policial presente no local.", "Evitar prestar socorro para não ser arrolado como testemunha no processo.", "Remover as vítimas imediatamente do veículo antes de sinalizar a pista."],
        correctIndex: 0,
        explanation: "A regra é sinalizar o local antes de tocar nas vítimas para evitar novos acidentes.",
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
        statement: "Qual atitude caracteriza o condutor defensivo no trânsito, antecipando-se a situações de risco para evitar sinistros?",
        options: ["Manter velocidade adequada às condições da via, do clima e do fluxo, com distância segura.", "Transitar sempre na velocidade máxima permitida, mesmo sob chuva intensa.", "Ultrapassar pela direita em pontes quando o fluxo da esquerda estiver lento.", "Usar a buzina continuamente para impor prioridade sobre os pedestres."],
        correctIndex: 0,
        explanation: "O condutor defensivo ajusta a velocidade às condições da via e do clima.",
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
        statement: "Caminhão reprovado na inspeção de segurança e emissão de gases. Qual medida administrativa é aplicada de imediato, segundo o CTB?",
        options: ["Multa gravíssima aplicada pelo agente na hora do exame.", "Apreensão do veículo com guincho direto para o pátio.", "Recolhimento com perda definitiva do licenciamento anual.", "Retenção do veículo para regularizar a situação."],
        correctIndex: 3,
        explanation: "Veículo reprovado na inspeção é retido até regularizar a situação.",
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
        statement: "O risco de aquaplanagem aumenta significativamente quando o veículo trafega em qual condição adversa?",
        options: ["Com pneus novos sobre pista molhada em velocidade moderada.", "Lentamente com pneus desgastados sob chuva fraca.", "Com alta velocidade sobre pista com acúmulo de água.", "Devagar sobre pista molhada com marcha reduzida."],
        correctIndex: 2,
        explanation: "Alta velocidade com água na pista é a principal causa de aquaplanagem.",
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
        statement: "Qual é o número telefônico oficial de emergência da Polícia Militar (PM) para atendimento em vias urbanas?",
        options: ["190 — Polícia Militar.", "191 — Polícia Rodoviária Federal (PRF).", "192 — Serviço de Atendimento Móvel de Urgência (SAMU).", "193 — Corpo de Bombeiros Militar."],
        correctIndex: 0,
        explanation: "O número 190 é o da Polícia Militar.",
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
        statement: "No exame prático, o candidato conduz em velocidade inadequada sob chuva intensa. Essa falta é classificada como:",
        options: ["Eliminatória, reprovando o candidato imediatamente.", "Grave, com perda de 3 pontos na ficha de avaliação.", "Média, com perda de 2 pontos na nota atribuída.", "Leve, com perda de 1 ponto na pontuação registrada."],
        correctIndex: 1,
        explanation: "Velocidade inadequada em condições adversas é falta grave no exame prático.",
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
        statement: "Obra na pista de rolamento deixa buraco sem sinalização. A falta de sinalização de obstáculo é infração de qual natureza?",
        options: ["Grave, com multa simples ao responsável pela obra.", "Gravíssima, com multa multiplicada por três vezes.", "Leve, sujeita à conversão em advertência por escrito.", "Média, com retenção dos equipamentos de sinalização."],
        correctIndex: 1,
        explanation: "Não sinalizar obstáculo na pista é infração gravíssima com multa multiplicada.",
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
        statement: "O que significa a placa de advertência A-28 e qual a atitude preventiva exigida ao condutor que a visualiza?",
        options: ["Pista alagada, exigindo parada total do veículo.", "Pista com aquaplanagem, indicando obrigatoriedade de correntes nos pneus.", "Pista escorregadia, advertindo sobre redução de aderência do pavimento.", "Projeção de cascalho, alertando para pedras soltas na pista."],
        correctIndex: 3,
        explanation: "A placa A-28 adverte sobre pista escorregadia à frente.",
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
        statement: "Para transpor uma interseção não semaforizada com segurança, qual postura o condutor deve adotar ao se aproximar?",
        options: ["Buzinar prolongadamente e manter a velocidade para forçar pedestres a aguardar.", "Ligar faróis altos e pisca-alerta para indicar que pretende passar primeiro.", "Acelerar e transpor a interseção rapidamente para desobstruir o fluxo.", "Reduzir a velocidade, checar ambos os lados e respeitar a sinalização de preferência."],
        correctIndex: 2,
        explanation: "Reduzir velocidade, olhar os lados e respeitar a preferência é a conduta correta.",
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
        statement: "Segundo o texto expresso do Art. 1º do CTB, o trânsito em condições seguras é considerado um direito:",
        options: ["Privilégio exclusivo de motoristas habilitados em categorias profissionais.", "Direito restrito a pedestres e ciclistas em passeios e ciclovias.", "Responsabilidade facultativa de motoristas de transporte coletivo.", "Direito de todos e dever dos órgãos do Sistema Nacional de Trânsito."],
        correctIndex: 0,
        explanation: "Trânsito seguro é direito de todos e dever dos órgãos do SNT.",
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
        statement: "Transitar com veículo excedendo a Capacidade Máxima de Tração (CMT) do fabricante configura infração de natureza:",
        options: ["Grave, com multa e retenção para transbordo da carga excedente.", "Média, caso o excesso seja inferior a 500 kg, e gravíssima se superior.", "Leve, com pontuação na carteira do proprietário.", "Média, com multa e retenção do veículo."],
        correctIndex: 3,
        explanation: "Exceder a CMT é infração média com multa e retenção do veículo.",
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
        statement: "A falta de balanceamento do conjunto de rodas e pneus provoca principalmente qual consequência ao condutor?",
        options: ["Direção excessivamente dura e travamento do sistema hidráulico.", "Rangido contínuo dos pneus durante curvas fechadas.", "Deformação imediata das longarinas do chassi.", "Trepidações e vibrações anormais transmitidas ao volante de direção."],
        correctIndex: 1,
        explanation: "Desbalanceamento causa trepidação e vibração no volante em alta velocidade.",
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
        statement: "No exame prático, o candidato converte à direita e não cede preferência ao pedestre. Essa falta gera perda de quantos pontos?",
        options: ["Eliminatória, reprovando o candidato imediatamente.", "3 pontos na ficha de avaliação (falta grave).", "2 pontos na ficha de avaliação (falta média).", "1 ponto na ficha de avaliação (falta leve)."],
        correctIndex: 1,
        explanation: "Não ceder preferência ao pedestre na conversão é falta grave (3 pontos).",
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
        statement: "Queimadura que atinge apenas a epiderme, com vermelhidão e dor, sem bolhas, é classificada como qual grau?",
        options: ["1º grau, atingindo apenas a camada superficial da pele.", "2º grau, com formação de bolhas e acometimento da derme.", "3º grau, com destruição total da pele e perda de sensibilidade.", "4º grau, com acometimento de músculos e ossos."],
        correctIndex: 0,
        explanation: "Queimadura sem bolhas que atinge só a superfície da pele é de 1º grau.",
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
        statement: "Via com interseções em nível, geralmente semaforizada, que interliga regiões do perímetro urbano é classificada como qual tipo?",
        options: ["Privada de acesso restrito, com circulação limitada a moradores.", "Rural não pavimentada, destinada à circulação intermunicipal.", "Expressa internacional, exclusiva de trânsito entre países.", "Urbana arterial, com fluxo canalizado por interseções em nível."],
        correctIndex: 0,
        explanation: "Via arterial é uma via urbana que interliga regiões do perímetro urbano.",
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
        statement: "Qual o prazo do estágio probatório da Permissão para Dirigir (PPD) até a expedição da CNH definitiva, segundo o CTB?",
        options: ["6 meses, prorrogáveis uma única vez mediante requerimento.", "12 meses, contados a partir da expedição do documento.", "24 meses, coincidentes com o período das avaliações psicológicas.", "Indefinidamente, até a ocorrência da primeira infração."],
        correctIndex: 0,
        explanation: "A PPD tem prazo de 12 meses (um ano) de estágio probatório.",
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
        statement: "Quais os limites de Peso Bruto Total e lotação que a categoria B autoriza, conforme o Art. 143 do CTB?",
        options: ["PBT de até 6.000 kg e lotação de até 10 passageiros, incluindo o motorista.", "PBT ilimitado para carga e lotação de até 8 ocupantes no total.", "Somente veículos de passeio com até 5 lugares, contando o condutor.", "PBT de até 3.500 kg e lotação de até 8 passageiros, excluído o condutor."],
        correctIndex: 0,
        explanation: "Categoria B: PBT até 3.500 kg e lotação de até 8 passageiros (8+1).",
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
        statement: "Qual o limite legal de passageiros para veículos da categoria B, excluído o condutor, segundo o CTB?",
        options: ["Até 8 passageiros, contando obrigatoriamente o motorista.", "Até 15 passageiros, além do condutor.", "Até 5 passageiros, não contando o condutor.", "Até 8 passageiros, não contando o condutor (regra do 8+1)."],
        correctIndex: 0,
        explanation: "Categoria B permite até 8 passageiros, sem contar o motorista (8+1).",
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
        statement: "Sem infração gravíssima em 12 meses, a suspensão do direito de dirigir ocorre ao atingir quantos pontos?",
        options: ["20 pontos, regra fixa independente da gravidade das infrações.", "30 pontos, pela existência de ao menos uma infração grave.", "14 pontos, por tratar-se de condutor com atividade remunerada (EAR).", "40 pontos, limite aplicável quando não há infração gravíssima no período."],
        correctIndex: 0,
        explanation: "Sem infração gravíssima, o limite é 40 pontos para suspensão.",
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
        statement: "Condutor segura o celular com uma mão para ler mensagens durante a condução. Pelo Art. 252 do CTB, essa infração é de qual natureza?",
        options: ["Grave, com multa e 5 pontos na CNH.", "Média, com multa e 4 pontos na CNH.", "Leve, com multa e 3 pontos na CNH.", "Gravíssima, com multa e 7 pontos na CNH."],
        correctIndex: 0,
        explanation: "Usar celular na mão enquanto dirige é infração gravíssima (7 pontos).",
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
        statement: "Sobre o período probatório da PPD e as consequências das infrações cometidas, a alternativa correta é:",
        options: ["A PPD vale 6 meses e qualquer infração leve anula a habilitação.", "A PPD não possui prazo e só é cancelada por crime de trânsito.", "A PPD vale 12 meses; infração grave, gravíssima ou reincidência em média impede a CNH definitiva.", "A PPD vale 24 meses e admite até 20 pontos sem consequência."],
        correctIndex: 0,
        explanation: "PPD de 12 meses: infração grave, gravíssima ou reincidência em média impede a definitiva.",
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
        statement: "Motorista manipula celular para ler mensagens em via de trânsito rápido. Essa conduta é enquadrada como qual infração?",
        options: ["Grave, com 5 pontos e advertência por escrito.", "Média, com 4 pontos e reciclagem obrigatória.", "Leve, com 3 pontos e conversão em advertência.", "Gravíssima, com 7 pontos na CNH e multa."],
        correctIndex: 0,
        explanation: "Manipular celular enquanto dirige é infração gravíssima (7 pontos).",
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
        statement: "Pela Lei 14.071/2020, o condutor sem infração gravíssima em 12 meses sofre suspensão ao atingir quantos pontos?",
        options: ["20 pontos fixos, independentemente da natureza das infrações.", "30 pontos, exigida a existência de infração grave.", "14 pontos, para condutor com EAR (atividade remunerada).", "40 pontos acumulados no prontuário."],
        correctIndex: 0,
        explanation: "Sem infração gravíssima, a suspensão ocorre aos 40 pontos.",
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
        statement: "Condutor ocupa vaga reservada a Pessoa com Deficiência sem exibir a credencial. Pelo CTB, essa infração é de qual natureza?",
        options: ["Média, com multa e 4 pontos na CNH.", "Leve, com advertência por escrito e sem pontuação.", "Grave, com multa e 5 pontos na CNH.", "Gravíssima, com multa, 7 pontos e remoção do veículo."],
        correctIndex: 0,
        explanation: "Vaga PCD sem credencial é infração gravíssima (7 pontos e remoção).",
        detailedExplanation: "Usar vaga de PCD sem a credencial é uma infração gravíssima, que dá 7 pontos e pode levar o carro pro pátio. A vaga de idoso, se usada sem a credencial, é só infração média — fique esperto com isso!",
        legalBase: "Art. 258 do CTB",
        commonMistake: "Muita gente confunde: PCD é gravíssima e idoso é média.",
        tip: "Vaga PCD = gravíssima; vaga idoso = média.",
        memoryHook: "Vaga PCD = gravíssima; vaga idoso = média.",
        incidence: "alta",
        trap: true,
        difficulty: 1
    },
    {
        id: "inf_n2_002",
        category: "infracoes",
        statement: "Condutor estaciona em vaga reservada a PCD em estacionamento privado sem credencial. A natureza dessa infração é qual?",
        options: ["Média, com 4 pontos e apenas multa administrativa.", "Leve, com 3 pontos e advertência por escrito.", "Grave, com 5 pontos e retenção da CNH.", "Gravíssima, com 7 pontos na CNH e remoção do veículo."],
        correctIndex: 0,
        explanation: "Vaga PCD sem credencial é gravíssima, mesmo em estacionamento privado.",
        detailedExplanation: "As vagas para Pessoas com Deficiência (PCD) precisam de credencial, e isso vale também para estacionamentos privados de uso coletivo. Se não tiver a credencial, a multa é gravíssima, com 7 pontos e o carro pode ser guinchado.",
        legalBase: "Art. 258 do CTB",
        commonMistake: "Muita gente pensa que em estacionamento privado não tem fiscalização ou que a infração é média.",
        tip: "Vaga PCD = Ação gravíssima; Vaga idoso = Ação média.",
        memoryHook: "Vaga PCD = Ação gravíssima; Vaga idoso = Ação média.",
        incidence: "alta",
        trap: true,
        difficulty: 2
    },
    {
        id: "inf_n1_003",
        category: "infracoes",
        statement: "Em rodovia com limite de 110 km/h, veículo é registrado a 170 km/h. Transitar acima de 50% do limite configura infração de qual natureza?",
        options: ["Grave, com multa simples e 5 pontos na CNH.", "Média, com multa e 4 pontos na CNH.", "Leve, com advertência por escrito sem pontuação.", "Gravíssima, com multa multiplicada por 3 e suspensão do direito de dirigir."],
        correctIndex: 0,
        explanation: "Exceder 50% do limite é infração gravíssima com multa x3 e suspensão.",
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
        statement: "Radar registra veículo a 170 km/h em rodovia com limite de 110 km/h. Essa conduta resulta em qual infração, segundo o CTB?",
        options: ["Grave, com multa simples e retenção do veículo.", "Média, com multa e pontuação no prontuário.", "Crime de trânsito inafiançável, com prisão imediata.", "Gravíssima, com multa multiplicada por 3 e suspensão do direito de dirigir."],
        correctIndex: 0,
        explanation: "170 km/h em limite de 110 km/h é gravíssima com multa tripla e suspensão.",
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
        statement: "No protocolo de socorro PAS, adotado em acidentes de trânsito, as letras significam o quê, em ordem?",
        options: ["Parar, Abrir, Socorrer.", "Prevenir, Atender, Salvar.", "Prestar, Acionar, Sinalizar.", "Proteger, Avisar, Socorrer."],
        correctIndex: 0,
        explanation: "PAS = Proteger, Avisar e Socorrer.",
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
        statement: "Em situação de aquaplanagem, a conduta correta do condutor é qual, segundo a direção defensiva e a legislação de trânsito?",
        options: ["Aplicar frenagem forte para recuperar a aderência dos pneus.", "Girar o volante alternadamente para expulsar a água.", "Engatar marcha ré imediatamente para reduzir a velocidade.", "Retirar o pé do acelerador e manter o volante firme, sem frear bruscamente."],
        correctIndex: 0,
        explanation: "Na aquaplanagem, tire o pé do acelerador e segure o volante firme.",
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
        statement: "A sequência correta do protocolo PAS em acidente de trânsito, segundo os princípios de primeiros socorros, é:",
        options: ["Socorrer imediatamente, depois avisar o socorro e por fim proteger a via.", "Parar sobre a pista, retirar pertences e sinalizar após remover as vítimas.", "Avisar a família, proteger o veículo e socorrer sem treinamento prévio.", "Proteger o local (sinalizar), Avisar o socorro (192) e Socorrer com cautela."],
        correctIndex: 0,
        explanation: "PAS = Proteger o local, Avisar o socorro e Socorrer com cautela.",
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
        statement: "Durante uma aquaplanagem, a atitude imediata do condutor deve ser qual, segundo a direção defensiva?",
        options: ["Pisar com força no freio para travar as rodas e buscar atrito.", "Girar o volante rapidamente para expulsar a água sob os pneus.", "Engatar marcha reduzida em giro alto para forçar a tração.", "Retirar o pé do acelerador, segurar o volante firme e não frear nem virar bruscamente."],
        correctIndex: 0,
        explanation: "Na aquaplanagem, tire o pé do acelerador e mantenha a direção reta.",
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
        statement: "Qual o número telefônico oficial do SAMU para atendimento médico de urgência no Brasil, segundo o CTB?",
        options: ["193 — Corpo de Bombeiros Militar.", "190 — Polícia Militar.", "192 — Serviço de Atendimento Móvel de Urgência (SAMU).", "191 — Polícia Rodoviária Federal."],
        correctIndex: 0,
        explanation: "O SAMU atende emergências médicas pelo número 192.",
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
        statement: "Em acidente com vítimas presas nas ferragens, o número e serviço corretos para urgência médica são quais, segundo o CTB?",
        options: ["193 — Corpo de Bombeiros Militar, para resgate e combate a incêndio.", "190 — Polícia Militar, para policiamento ostensivo.", "199 — Defesa Civil, para desabamentos e emergências civis.", "192 — SAMU (Serviço de Atendimento Móvel de Urgência)."],
        correctIndex: 0,
        explanation: "Urgência médica em acidente = SAMU 192.",
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
        statement: "Vítima com suspeita de fratura vertebral e parestesia nos membros. A conduta correta até a chegada do resgate é qual?",
        options: ["Sentá-la rapidamente em cadeira rígida para aliviar a pressão.", "Conduzi-la a pé até o hospital mais próximo.", "Massagear a região dorsal para relaxar a musculatura.", "Mantê-la imóvel e na posição encontrada, sem movimentar a coluna."],
        correctIndex: 0,
        explanation: "Suspeita de fratura na coluna = manter a vítima imóvel até o socorro.",
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
        statement: "Arremessar resíduos sólidos pela janela do veículo em movimento configura infração de qual natureza, segundo o CTB?",
        options: ["Leve, punida apenas com advertência verbal do agente.", "Gravíssima, punida com multa multiplicada e suspensão da CNH.", "Grave, punida com multa e cassação da permissão para dirigir.", "Média, prevista no Art. 172 do CTB, sujeita a multa e pontuação."],
        correctIndex: 0,
        explanation: "Jogar lixo pela janela é infração média (4 pontos e multa).",
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
        statement: "Gás incolor e inodoro da combustão que se liga à hemoglobina e bloqueia a oxigenação do sangue é qual, segundo o CTB?",
        options: ["Dióxido de Carbono (CO2), gás natural da atmosfera.", "Dióxido de Enxofre (SO2), gás de odor forte e irritante.", "Clorofluorcarboneto (CFC), composto que destrói a camada de ozônio.", "Monóxido de Carbono (CO), produto da combustão incompleta."],
        correctIndex: 0,
        explanation: "O CO (monóxido de carbono) é o gás tóxico da combustão incompleta.",
        detailedExplanation: "Ele vem da queima que não tá completa e é super perigoso porque não tem cor nem cheiro. Já o CO2 é o gás que esquenta o planeta, o SO2 tem cheiro forte e o CFC estraga a camada de ozônio.",
        legalBase: "Art. 190 do CTB",
        commonMistake: "Muita gente confunde CO com CO2, mas eles são bem diferentes.",
        tip: "Queima incompleta = Gás tóxico.",
        memoryHook: "Queima incompleta = Gás tóxico.",
        incidence: "alta",
        trap: true,
        difficulty: 2
    },
    {
        id: "ps_n2_002",
        category: "primeiros-socorros",
        statement: "Após colisão, vítima com suspeita de lesão medular e perda de sensibilidade. A conduta até o resgate é qual?",
        options: ["Remover a vítima do veículo e sentá-la em cadeira rígida.", "Massagear a região cervical para aliviar a contratura muscular.", "Girar o pescoço da vítima para avaliar a amplitude de movimento.", "Manter a vítima imóvel e alinhada, sem movimentar cabeça, pescoço ou coluna."],
        correctIndex: 0,
        explanation: "Suspeita de lesão medular = manter a vítima imóvel até o socorro.",
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
        statement: "Gás incolor e inodoro do escapamento que se liga à hemoglobina e impede a oxigenação do sangue é qual, segundo o CTB?",
        options: ["Dióxido de Carbono (CO2), produto da queima completa.", "Gás Ozônio (O3), presente naturalmente na estratosfera.", "Clorofluorcarboneto (CFC), usado em refrigeração.", "Monóxido de Carbono (CO), resultante da queima incompleta de combustível."],
        correctIndex: 0,
        explanation: "O CO (monóxido de carbono) bloqueia o oxigênio no sangue.",
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
        statement: "Circular com nível de óleo lubrificante muito abaixo do mínimo indicado na vareta de medição pode provocar:",
        options: ["Menor consumo de combustível, sem risco mecânico.", "Travamento do sistema de freios por contaminação do fluido.", "Desgaste exclusivo das velas de ignição.", "Fundição do motor por atrito excessivo entre as peças."],
        correctIndex: 0,
        explanation: "Óleo baixo pode fundir o motor por atrito excessivo.",
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
        statement: "Passageiro arremessa lata pela janela do veículo em movimento. Essa conduta configura qual infração, segundo o CTB?",
        options: ["Leve, de responsabilidade exclusiva do passageiro.", "Grave, com multa e suspensão da licença de tráfego.", "Conduta admitida em via de pista simples, fora do acostamento.", "Média, com multa e 4 pontos na CNH, de responsabilidade do condutor."],
        correctIndex: 0,
        explanation: "Jogar lixo na estrada é infração média (4 pontos e multa).",
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
        statement: "Circular com nível de óleo severamente baixo provoca, como principal consequência mecânica, qual problema?",
        options: ["Aumento do consumo, sem risco mecânico para o conjunto.", "Redução do desgaste das velas de ignição.", "Travamento das pastilhas de freio traseiras.", "Superaquecimento por atrito, podendo fundir o motor e danificar o bloco."],
        correctIndex: 0,
        explanation: "Óleo baixo causa atrito e pode fundir o motor.",
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
        statement: "Veículo de emergência com sirene e luzes vermelhas intermitentes em serviço de urgência tem qual prioridade, segundo o CTB?",
        options: ["Prioridade apenas quando se tratar de viatura da Polícia Militar.", "Prioridade somente durante o período noturno, das 22h às 6h.", "Nenhuma prioridade, devendo obedecer estritamente aos sinais.", "Prioridade absoluta de passagem, devendo os demais veículos abrir caminho."],
        correctIndex: 0,
        explanation: "Veículo de emergência com sinais ligados tem prioridade absoluta.",
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
        statement: "Pneus com sulcos abaixo de 1,6 mm expõem o condutor principalmente ao risco de quê na pista molhada?",
        options: ["Redução do consumo de combustível por maior aderência.", "Desalinhamento imediato da direção em pista seca.", "Bloqueio das rodas por fadiga do sistema de suspensão.", "Perda de aderência em pista molhada, aquaplanagem e aumento da distância de frenagem."],
        correctIndex: 0,
        explanation: "Pneu careca aumenta risco de aquaplanagem e distância de frenagem.",
        detailedExplanation: "Os sulcos dos pneus ajudam a drenar a água. Sem eles, o pneu perde contato com o chão, o que pode causar aquaplanagem. Por isso, andar com pneu careca é uma infração grave.",
        legalBase: "Art. 29 do CTB",
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
        statement: "Em aclive ou declive estreito sem espaço para dois veículos, a preferência de passagem é do veículo que está:",
        options: ["Que está descendo, por possuir maior velocidade natural.", "De maior porte e maior peso bruto total.", "Que primeiro acionar a buzina para sinalizar a intenção.", "Que está subindo, devendo o que desce dar passagem."],
        correctIndex: 0,
        explanation: "Na ladeira estreita, quem sobe tem preferência de passagem.",
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
        statement: "Pneus com sulcos abaixo de 1,6 mm aumentam principalmente o risco de quê na pista molhada, segundo a legislação de trânsito?",
        options: ["Redução do consumo de combustível em vias planas.", "Melhora da aderência em curvas de raio fechado.", "Travamento mecânico das rodas dianteiras em frenagens leves.", "Aquaplanagem e aumento da distância de frenagem em pista molhada."],
        correctIndex: 0,
        explanation: "Pneu careca aumenta risco de aquaplanagem e distância de frenagem.",
        detailedExplanation: "Quando os sulcos do pneu ficam abaixo de 1,6 mm, ele não consegue drenar a água da pista, o que pode levar à aquaplanagem. Além disso, a distância que você precisa para parar aumenta, o que é perigoso. Rodar com pneu careca é uma infração grave.",
        legalBase: "Art. 29 do CTB",
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
        statement: "Qual o formato característico da placa de regulamentação R-1 (PARE) segundo o Manual Brasileiro de Sinalização?",
        options: ["Circular, de fundo branco com orla vermelha.", "Losangular, de fundo amarelo com símbolo preto.", "Retangular, de fundo azul com símbolo branco.", "Octogonal (oito lados), de fundo vermelho com a inscrição PARE."],
        correctIndex: 0,
        explanation: "A placa PARE (R-1) tem formato octogonal único.",
        detailedExplanation: "Ela pede que o motorista pare completamente antes de seguir. É a única placa de trânsito que é octogonal, diferente da placa 'Dê a Preferência', que tem formato triangular.",
        legalBase: "Art. 29 do CTB",
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
        statement: "Ambulância em serviço de urgência com sirene e luzes vermelhas acionadas goza de qual prioridade de passagem, segundo o CTB?",
        options: ["Prioridade exclusivamente quando se tratar de viatura da Polícia Militar.", "Nenhuma prioridade fora dos trechos de rodovia.", "Prioridade restrita aos finais de semana e feriados.", "Prioridade absoluta de passagem, devendo os demais condutores encostar à direita."],
        correctIndex: 0,
        explanation: "Ambulância com sinais ligados tem prioridade absoluta de passagem.",
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
        statement: "Dois veículos pesados em trecho estreito de aclive ou declive. A passagem pertence ao veículo que está em qual situação?",
        options: ["Está descendo, por desenvolver maior energia cinética.", "Sinalizou primeiro com toques de buzina.", "Possui menor peso bruto total.", "Está subindo, devendo o que desce recuar e dar passagem."],
        correctIndex: 0,
        explanation: "Quem está subindo tem preferência na ladeira estreita.",
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
        statement: "Quais as características visuais da placa de regulamentação PARE (R-1) do Manual Brasileiro de Sinalização?",
        options: ["Circular com orla vermelha; apenas recomenda redução da velocidade.", "Losangular amarelo; alerta para perigo iminente na via.", "Retangular azul; indica serviço público nas proximidades.", "Octogonal; exige parada total obrigatória antes de prosseguir."],
        correctIndex: 0,
        explanation: "A placa PARE (R-1) é octogonal e exige parada total.",
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
        statement: "Qual o padrão cromático e geométrico predominante das placas de regulamentação do Manual Brasileiro de Sinalização?",
        options: ["Losangulares, fundo amarelo e símbolo preto (alertam para perigos).", "Retangulares, fundo azul e símbolo branco (indicam serviços).", "Triangulares invertidas, fundo vermelho e símbolo branco (preferência).", "Circulares, fundo branco, orla e tarja vermelhas e símbolo preto."],
        correctIndex: 0,
        explanation: "Placas de regulamentação são circulares, fundo branco e orla vermelha.",
        detailedExplanation: "Elas têm um formato circular, com fundo branco, borda e tarja vermelha e símbolo preto, que mostram ordens e proibições. Tem algumas exceções, como a placa PARE, que é octogonal, e a placa 'Dê a Preferência', que é triangular, mas ainda assim são de regulamentação.",
        legalBase: "Art. 29 do CTB",
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
        statement: "Placas circulares, fundo branco e orla vermelha pertencem à classe de sinalização vertical de qual tipo, segundo o CONTRAN?",
        options: ["Advertência, que alertam sobre perigos potenciais na via.", "Indicação, que informam serviços e destinos aos condutores.", "Educação, que orientam o comportamento dos usuários.", "Regulamentação, que impõem obrigações e proibições."],
        correctIndex: 0,
        explanation: "Círculo vermelho = regulamentação (ordens e proibições).",
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
        statement: "Sem triângulo de segurança disponível, qual procedimento é aceito emergencialmente para sinalizar o local do sinistro, segundo o CTB?",
        options: ["Abandonar o veículo sem sinalização até a chegada da polícia.", "Utilizar exclusivamente os faróis altos dos carros que pararem.", "Utilizar galhos, folhagens ou outros materiais visíveis a distância segura.", "Todas as alternativas anteriores estão corretas."],
        correctIndex: 0,
        explanation: "Na ausência do triângulo, improvise com materiais visíveis a distância segura.",
        detailedExplanation: "Quando o triângulo não está disponível (ou não é suficiente), o condutor deve improvisar uma sinalização com materiais visíveis (galhos, folhagens, panos) posicionados a uma distância segura, para que os demais motoristas reduzam a velocidade e desviem. Sinalizar o local reduz o risco de novas colisões enquanto o atendimento não chega.",
        legalBase: "CTB, art. 225; Manual de Primeiros Socorros do DETRAN",
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
        statement: "Qual a idade mínima legalmente exigida para iniciar o processo de habilitação nas categorias A e B do CTB, segundo a legislação?",
        options: ["16 anos, mediante emancipação e autorização dos genitores.", "21 anos, exigência uniforme para todas as categorias.", "25 anos, para habilitação com exercício de atividade remunerada.", "18 anos, exigida a condição de penalmente imputável."],
        correctIndex: 1,
        explanation: "A idade mínima é 18 anos para categorias A e B.",
        detailedExplanation: "O CTB estabelece 18 anos para A/B, 21 para C, D e E.",
        legalBase: "Art. 147 do CTB",
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
        statement: "Em curva à esquerda com pista molhada e baixa aderência, a postura ideal do condutor é qual, segundo a direção defensiva?",
        options: ["Acelerar durante a curva para sair rapidamente do trecho.", "Manter velocidade constante e acionar o freio no ápice da curva.", "Aplicar apenas o freio traseiro durante toda a manobra.", "Reduzir a velocidade antes da entrada da curva e manter o volante firme."],
        correctIndex: 1,
        explanation: "Reduzir velocidade antes da curva e manter o volante firme evita perda de aderência.",
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
        statement: "Placa losangular, fundo amarelo e símbolo preto antes de trecho sinuoso é sinalização de qual tipo do Manual Brasileiro de Sinalização?",
        options: ["Regulamentação, que impõe obrigações ou proibições.", "Indicação, que identifica destino ou serviço auxiliar.", "Advertência, que alerta para condição de perigo adiante.", "Regulamentação, que determina preferência na interseção."],
        correctIndex: 1,
        explanation: "Losango amarelo = advertência de perigo à frente.",
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
        statement: "Conduzir veículo sem possuir CNH válida é infração com penalidade de qual natureza no CTB, segundo a legislação?",
        options: ["Advertência por escrito, sem multa ou medida sobre o veículo.", "Suspensão imediata do direito de dirigir por seis meses.", "Nenhuma penalidade, caso o veículo esteja licenciado.", "Multa gravíssima (multiplicada por 3) e retenção do veículo."],
        correctIndex: 1,
        explanation: "Dirigir sem CNH é infração gravíssima com multa e retenção do veículo.",
        detailedExplanation: "Dirigir sem habilitação é infração gravíssima conforme CTB.",
        legalBase: "Art. 162 do CTB",
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
        statement: "Ao ultrapassar em pista molhada, o cuidado essencial durante a manobra de ultrapassagem é qual, segundo a direção defensiva?",
        options: ["Aproximar-se bastante do veículo ultrapassado para reduzir o tempo de exposição.", "Utilizar a buzina constantemente durante toda a transposição de faixa.", "Ignorar a condição da pista, pois a manobra não altera a aderência.", "Aumentar a distância de segurança e evitar jatos de água sobre o veículo."],
        correctIndex: 1,
        explanation: "Aumentar distância de segurança e evitar jatos de água é essencial na ultrapassagem em pista molhada.",
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
        statement: "Placa retangular de fundo azul com símbolo branco indicando posto de combustível é sinalização de qual tipo?",
        options: ["Regulamentação, que impõe proibição ou obrigação de conduta.", "Advertência, que alerta para condição potencialmente perigosa.", "Indicação, que identifica serviço auxiliar e orienta o condutor.", "Regulamentação, que determina velocidade máxima admitida."],
        correctIndex: 1,
        explanation: "Retangular azul = indicação de serviço auxiliar.",
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
        statement: "A infração de natureza GRAVE, segundo a classificação legal do CTB, é caracterizada por qual sanção administrativa?",
        options: ["Aplicação exclusivamente de multa, sem pontuação nem outras medidas.", "Aplicação exclusivamente de advertência por escrito.", "Multa, pontuação de 5 pontos na CNH e possibilidade de suspensão do direito de dirigir.", "Ausência de qualquer penalidade administrativa prevista em lei."],
        correctIndex: 1,
        explanation: "Grave: multa, 5 pontos e pode levar à suspensão do direito de dirigir.",
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
        statement: "Qual a distância mínima de seguimento recomendada pela regra prática de tempo em condições ideais de pista e clima?",
        options: ["1 segundo de intervalo entre a passagem dos veículos por um ponto fixo.", "4 segundos de intervalo entre a passagem dos veículos.", "10 segundos de intervalo, exigidos para qualquer velocidade.", "2 segundos de intervalo, contados entre a passagem do veículo precedente e a do próprio veículo."],
        correctIndex: 1,
        explanation: "Recomenda-se pelo menos 2 segundos de distância de seguimento.",
        detailedExplanation: "A regra dos 2 segundos permite tempo de reação em condições normais.",
        legalBase: "Art. 218 do CTB",
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
        statement: "Placa circular, fundo branco, orla vermelha e faixa horizontal no centro significa o quê no CTB, segundo a sinalização?",
        options: ["Parada obrigatória com imobilização total antes da linha de retenção.", "Vedação exclusiva de estacionamento, admitindo parada breve para embarque.", "Velocidade máxima permitida para o trecho da via.", "Proibição total de parada e estacionamento no trecho sinalizado."],
        correctIndex: 2,
        explanation: "Faixa branca horizontal em vermelho = proibido parar e estacionar.",
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
        statement: "Qual o conjunto documental exigido para a circulação regular de veículo automotor nas vias públicas abertas à circulação?",
        options: ["Somente a CNH, pois o licenciamento é consultado eletronicamente.", "Somente o comprovante de seguro obrigatório vigente.", "CNH (ou PPD) e CRLV-e, além da regularidade do licenciamento e do IPVA.", "Nenhum documento, desde que o veículo esteja em perfeitas condições."],
        correctIndex: 1,
        explanation: "Devem-se portar CNH, CRLV e estar em dia com impostos.",
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
        statement: "À noite, a visibilidade do condutor é reduzida. Qual o principal risco aumentado na condução noturna?",
        options: ["Aumento da visibilidade sobre a pista de rolamento.", "Dificuldade de avaliar distância e velocidade dos veículos.", "Redução do tráfego, que elimina o risco de colisão.", "Melhor aderência dos pneus devido à temperatura."],
        correctIndex: 1,
        explanation: "A escuridão limita a percepção de distância e velocidade relativa (Art. 218 do CTB).",
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
        statement: "Em neblina densa, qual a conduta correta do condutor para evitar acidentes?",
        options: ["Manter farol baixo e aumentar distância de seguimento.", "Reduzir velocidade gradualmente, sem freadas bruscas.", "Não usar pisca-alerta com o veículo em movimento.", "Todas as alternativas acima estão corretas."],
        correctIndex: 3,
        explanation: "Com cerração: farol baixo, mais distância, sem freada brusca e sem pisca-alerta andando.",
        incidence: "alta",
        difficulty: 2
    },
    {
        id: "td_02",
        category: "legislacao",
        statement: "Em interseção sem sinalização, qual a regra de preferência do CTB?",
        options: ["Preferência de quem se aproxima pela direita do condutor.", "Em cruzamento com rodovia, preferência de quem nela trafega.", "Na rotatória, preferência de quem já circula pelo anel.", "Todas as alternativas acima estão corretas."],
        correctIndex: 3,
        explanation: "Preferência: direita, rodovia sobre via e quem já está na rotatória.",
        incidence: "alta",
        difficulty: 2
    },
    {
        id: "td_03",
        category: "direcao-defensiva",
        statement: "O que é obrigatório antes de executar transposição de faixa?",
        options: ["Sinalizar com a seta antes da manobra.", "Checar retrovisores e ponto cego.", "Dar preferência a quem já está na faixa pretendida.", "Todas as alternativas acima estão corretas."],
        correctIndex: 3,
        explanation: "Mudar de faixa: seta antes, espelho + ponto cego e preferência de quem já está lá.",
        incidence: "alta",
        difficulty: 2
    },
    {
        id: "td_04",
        category: "legislacao",
        statement: "Sobre a ultrapassagem em rodovia de pista dupla, é correto afirmar:",
        options: ["Deve ser feita sempre pela esquerda.", "Retorno à faixa exige distância segura do ultrapassado.", "Condutor deve sinalizar a intenção com antecedência.", "Todas as alternativas acima estão corretas."],
        correctIndex: 3,
        explanation: "Ultrapassagem: pela esquerda, sinaliza antes e volta só com segurança.",
        incidence: "alta",
        difficulty: 2
    },
    {
        id: "td_05",
        category: "legislacao",
        statement: "Para estacionar junto ao bordo da pista, o condutor deve:",
        options: ["Manter 5 metros de distância da via transversal.", "Não obstruir a pista nem comprometer visibilidade em cruzamentos.", "Parar no sentido do fluxo, paralelo ao meio-fio.", "Todas as alternativas acima estão corretas."],
        correctIndex: 3,
        explanation: "Estacionar: 5 m da transversal, sem travar a via e no sentido do fluxo.",
        incidence: "media",
        difficulty: 2
    },
    {
        id: "td_06",
        category: "infracoes",
        statement: "Em descida de declive, qual conduta configura infração e compromete a segurança?",
        options: ["Descer em ponto morto para economizar combustível.", "Desligar o motor na descida, sem freio e direção assistidos.", "Manter câmbio em neutro e frear somente em cima da hora.", "Todas as alternativas acima estão corretas."],
        correctIndex: 3,
        explanation: "Banguela de qualquer jeito é infração: sem freio motor o carro ganha velocidade e o freio superaquece.",
        incidence: "media",
        difficulty: 2
    },
    {
        id: "td_07",
        category: "legislacao",
        statement: "Em aclive de pista simples, quando a ultrapassagem é permitida?",
        options: ["Com linha amarela seccionada na sua mão de direção.", "Com visibilidade total à frente e sem veículos em sentido oposto.", "Em trechos com faixa adicional para veículos lentos.", "Todas as alternativas acima estão corretas."],
        correctIndex: 3,
        explanation: "No aclive só ultrapassa com faixa permitida, visão total ou faixa extra.",
        incidence: "media",
        difficulty: 2
    },
    {
        id: "td_08",
        category: "legislacao",
        statement: "Sem faixa de pedestres, como o pedestre deve atravessar a pista?",
        options: ["Em sentido perpendicular ao eixo da via.", "Pelo caminho mais curto, sem permanecer sobre a pista.", "Dar prioridade aos veículos que se aproximem.", "Todas as alternativas acima estão corretas."],
        correctIndex: 3,
        explanation: "Sem faixa: atravessa em 90 graus, sem parar na pista e com carro perto a vez é dele.",
        legalBase: "Arts. 69 e 70 do CTB",
        incidence: "alta",
        difficulty: 2
    },
    {
        id: "td_09",
        category: "legislacao",
        statement: "Sobre parada e estacionamento perto de cruzamentos, é correto afirmar:",
        options: ["Proibido a menos de 5 metros do bordo da via transversal.", "Proibido quando comprometer a visibilidade na interseção.", "Proibido sobre a área de cruzamento das vias.", "Todas as alternativas acima estão corretas."],
        correctIndex: 3,
        explanation: "Perto de cruzamento: 5 m da transversal, sem tirar visibilidade e nunca sobre o cruzamento.",
        incidence: "media",
        difficulty: 2
    },
    {
        id: "td_10",
        category: "legislacao",
        statement: "Quais veículos têm livre circulação e estacionamento em serviço de urgência?",
        options: ["Veículos de socorro de incêndio e salvamento.", "Ambulâncias e viaturas policiais identificadas.", "Veículos de fiscalização e operação de trânsito.", "Todas as alternativas acima estão corretas."],
        correctIndex: 3,
        explanation: "Em urgência: bombeiros, ambulância, polícia e fiscalização têm prioridade total.",
        legalBase: "Art. 29, VII do CTB",
        incidence: "media",
        difficulty: 1
    },
    {
        id: "td_11",
        category: "legislacao",
        statement: "Para converter à esquerda em via de mão dupla sem canteiro, o condutor deve:",
        options: ["Aproximar-se da linha divisória do fluxo oposto.", "Acionar a seta com antecedência regulamentar.", "Ceder passagem aos veículos em sentido contrário.", "Todas as alternativas acima estão corretas."],
        correctIndex: 3,
        explanation: "Conversão à esquerda: cola na divisória, seta antes e espera o fluxo contrário.",
        incidence: "media",
        difficulty: 2
    },
    {
        id: "td_12",
        category: "legislacao",
        statement: "Sem placa de velocidade, quais os limites padrão em vias urbanas?",
        options: ["80 km/h em vias de trânsito rápido.", "60 km/h em vias arteriais.", "40 km/h em vias coletoras.", "Todas as alternativas acima estão corretas."],
        correctIndex: 3,
        explanation: "Sem placa: trânsito rápido 80, arterial 60, coletora 40 (e local 30).",
        legalBase: "Arts. 60 e 61 do CTB",
        incidence: "altissima",
        difficulty: 2
    },
    {
        id: "td_13",
        category: "infracoes",
        statement: "Quais condutas são infrações gravíssimas segundo o CTB?",
        options: ["Andar em calçadas, passeios e canteiros.", "Avançar o vermelho do semáforo ou parada obrigatória.", "Andar na contramão em via de sentido único.", "Todas as alternativas acima estão corretas."],
        correctIndex: 3,
        explanation: "Calçada, vermelho e contramão: tudo gravíssima.",
        incidence: "media",
        difficulty: 1
    },
    {
        id: "td_14",
        category: "direcao-defensiva",
        statement: "Sob chuva forte ou cerração, o condutor deve evitar:",
        options: ["Farol alto, que ofusca pelo reflexo na neblina.", "Freada brusca sobre pista molhada.", "Pisca-alerta ligado com veículo em movimento.", "Todas as alternativas acima estão corretas."],
        correctIndex: 3,
        explanation: "Na chuva/cerração: sem farol alto, sem freada brusca e sem pisca andando.",
        incidence: "media",
        trap: true,
        difficulty: 2
    },
    {
        id: "td_15",
        category: "legislacao",
        statement: "Sobre o uso da buzina, é correto afirmar:",
        options: ["Permitida em toques breves como advertência.", "Fora do perímetro urbano, para advertir sobre ultrapassagem.", "Vedada entre 22h e 6h no período noturno.", "Todas as alternativas acima estão corretas."],
        correctIndex: 3,
        explanation: "Buzina: toque breve de advertência, fora da cidade p/ ultrapassar e nada de 22h às 6h.",
        legalBase: "Art. 227 do CTB",
        incidence: "alta",
        difficulty: 2
    },
    {
        id: "td_16",
        category: "direcao-defensiva",
        statement: "O que é obrigatório na transposição de faixa?",
        options: ["Sinalizar com a seta apropriada.", "Conferir se a faixa adjacente está livre.", "Respeitar quem já circula na faixa de destino.", "Todas as alternativas acima estão corretas."],
        correctIndex: 3,
        explanation: "Trocar de faixa: seta, faixa livre e preferência de quem já está lá.",
        incidence: "media",
        difficulty: 2
    },
    {
        id: "td_17",
        category: "direcao-defensiva",
        statement: "Em aclive sem visibilidade, a conduta defensiva recomendada é:",
        options: ["Manter o veículo no centro da faixa.", "Reduzir para velocidade segura de frenagem.", "Não ultrapassar no trecho sem visibilidade.", "Todas as alternativas acima estão corretas."],
        correctIndex: 3,
        explanation: "Aclive sem visão: centro da faixa, devagar e sem ultrapassar.",
        incidence: "media",
        difficulty: 2
    },
    {
        id: "td_18",
        category: "primeiros-socorros",
        statement: "Em emergência com veículo imobilizado, as providências obrigatórias incluem:",
        options: ["Acionar o pisca-alerta imediatamente.", "Posicionar o triângulo na distância regulamentar.", "Retirar ocupantes do veículo para local seguro.", "Todas as alternativas acima estão corretas."],
        correctIndex: 3,
        explanation: "Pane na pista: pisca, triângulo atrás e todo mundo fora do carro.",
        incidence: "media",
        difficulty: 2
    },
    {
        id: "td_19",
        category: "infracoes",
        statement: "Quais condutas são vedadas em vias coletoras e arteriais?",
        options: ["Ultrapassar pelo acostamento ou pela direita, salvo exceção.", "Converter onde a sinalização proíbe.", "Dirigir de fone ou mexendo no celular.", "Todas as alternativas acima estão corretas."],
        correctIndex: 3,
        explanation: "Acostamento, conversão proibida e celular ao volante: tudo proibido.",
        incidence: "media",
        difficulty: 2
    },
    {
        id: "td_20",
        category: "placas",
        statement: "Quais são as funções da sinalização horizontal?",
        options: ["Delimitar faixas e orientar o fluxo dos veículos.", "Alertar para riscos e sinalizar vedação de ultrapassagem.", "Identificar locais de estacionamento permitido.", "Todas as alternativas acima estão corretas."],
        correctIndex: 3,
        explanation: "Pintura na pista: organiza fluxo, avisa risco e regula estacionamento.",
        incidence: "media",
        difficulty: 2
    },
    {
        id: "td_21",
        category: "legislacao",
        statement: "Em acesso a via de trânsito rápido, qual a regra de preferência?",
        options: ["Preferência de quem já circula na via principal.", "Veículo que ingresa deve adaptar-se à velocidade do fluxo.", "Acessos sem semáforo seguem a mesma regra geral.", "Todas as alternativas acima estão corretas."],
        correctIndex: 3,
        explanation: "Na entrada da rápida: a vez é de quem já está nela.",
        incidence: "media",
        difficulty: 2
    },
    {
        id: "td_22",
        category: "direcao-defensiva",
        statement: "Qual condição exige atenção redobrada e velocidade reduzida?",
        options: ["Pista esburacada, ondulada ou escorregadia.", "Declive forte com curva fechada e sem acostamento.", "Falta de acostamento com mato no bordo.", "Todas as alternativas acima estão corretas."],
        correctIndex: 3,
        explanation: "Pista ruim, declive com curva e sem acostamento: devagar e atenção total.",
        incidence: "media",
        difficulty: 2
    },
    {
        id: "td_23",
        category: "legislacao",
        statement: "Para converter à direita em interseção, o condutor deve:",
        options: ["Aproximar-se do bordo direito da pista.", "Acionar a seta com antecedência regulamentar.", "Reduzir velocidade e atenção aos pedestres.", "Todas as alternativas acima estão corretas."],
        correctIndex: 3,
        explanation: "Conversão à direita: cola no bordo, seta antes e vai devagar.",
        incidence: "media",
        difficulty: 2
    },
    {
        id: "td_24",
        category: "legislacao",
        statement: "Quando o farol baixo é obrigatório segundo o CTB?",
        options: ["À noite, em qualquer via, com ou sem iluminação pública.", "De dia, em rodovia de pista simples fora do perímetro urbano.", "Em túneis providos de iluminação, de dia ou de noite.", "Todas as alternativas acima estão corretas."],
        correctIndex: 3,
        explanation: "Farol baixo: à noite sempre, de dia em rodovia simples e em túnel.",
        legalBase: "Art. 40 do CTB",
        incidence: "alta",
        difficulty: 1
    },
    {
        id: "td_25",
        category: "legislacao",
        statement: "Sobre embarque e desembarque de passageiros, é correto afirmar:",
        options: ["Deve ser feito pelo lado da calçada, exceto para o condutor.", "Parada deve ocorrer com veículo junto ao bordo da via.", "Manobra não pode obstruir a marcha dos demais veículos.", "Todas as alternativas acima estão corretas."],
        correctIndex: 3,
        explanation: "Embarque: lado da calçada, carro parado no bordo e sem travar a via.",
        legalBase: "Art. 49 do CTB",
        incidence: "media",
        difficulty: 2
    },
    {
        id: "td_26",
        category: "legislacao",
        statement: "Diante da placa R-1 (Parada Obrigatória), o condutor deve:",
        options: ["Parar totalmente antes de entrar na interseção.", "Ceder passagem aos veículos da via preferencial.", "Ceder passagem aos pedestres em travessia.", "Todas as alternativas acima estão corretas."],
        correctIndex: 3,
        explanation: "R-1: para total, vez da preferencial e dos pedestres.",
        incidence: "alta",
        difficulty: 2
    },
    {
        id: "td_27",
        category: "legislacao",
        statement: "Sem ciclovia, como as bicicletas devem circular?",
        options: ["Pelos bordos da pista, no mesmo sentido dos veículos.", "Têm preferência sobre veículos automotores nas interseções.", "Devem ser ultrapassadas com distância lateral mínima de 1,5 m.", "Todas as alternativas acima estão corretas."],
        correctIndex: 3,
        explanation: "Sem ciclovia: bike no bordo no sentido da via, com preferência e 1,5 m ao ultrapassar.",
        legalBase: "Art. 58 do CTB",
        incidence: "media",
        difficulty: 2
    },
    {
        id: "td_28",
        category: "mecanica",
        statement: "Antes de circular, o condutor deve verificar:",
        options: ["Equipamentos obrigatórios em perfeito funcionamento.", "Combustível suficiente para o trajeto planejado.", "Freios, iluminação e pneus em condições adequadas.", "Todas as alternativas acima estão corretas."],
        correctIndex: 3,
        explanation: "Antes de sair: equipamentos, combustível e freios/luzes/pneus.",
        incidence: "media",
        difficulty: 1
    },
    {
        id: "td_29",
        category: "legislacao",
        statement: "Em interseção sem placa, sem semáforo e sem agente, a preferência é:",
        options: ["Do veículo que se aproxima pela direita do condutor.", "De todos os veículos devem reduzir velocidade antes de ingressar.", "Do pedestre em travessia tem prioridade sobre quem vai converter.", "Todas as alternativas acima estão corretas."],
        correctIndex: 3,
        explanation: "Sem placa: direita primeiro, reduz ao entrar e pedestre na travessia manda.",
        incidence: "alta",
        difficulty: 2
    },
    {
        id: "td_30",
        category: "infracoes",
        statement: "Exceder em 20% a velocidade máxima configura infração:",
        options: ["Natureza média, sujeita a multa administrativa.", "Pontuação de 4 pontos no prontuário do condutor.", "Multa aplicável ao condutor ou proprietário responsável.", "Todas as alternativas acima estão corretas."],
        correctIndex: 3,
        explanation: "Até 20% acima: média + multa + 4 pontos.",
        legalBase: "Art. 218 do CTB",
        incidence: "alta",
        difficulty: 2
    },
    {
        id: "rst_01",
        category: "legislacao",
        statement: "O cinto de segurança é obrigatório para todos os ocupantes. Existe exceção legal?",
        options: ["Sim, em trajetos curtos dentro do perímetro urbano.", "Sim, para passageiros no banco traseiro em vias coletoras.", "Não existe exceção legal, sendo obrigatório para todos os ocupantes.", "Sim, apenas para condutores de veículos de transporte de carga."],
        correctIndex: 2,
        explanation: "Não existe exceção: o cinto é obrigatório para o condutor e todos os passageiros, em qualquer via.",
        incidence: "media",
        difficulty: 2,
        image_url: ""
    },
    {
        id: "rst_02",
        category: "legislacao",
        statement: "A ultrapassagem pela direita é permitida apenas quando:",
        options: ["O veículo da frente estiver na faixa esquerda em baixa velocidade.", "O veículo a ser ultrapassado sinalizar que vai dobrar à esquerda.", "Em vias de trânsito rápido durante cerração ou neblina.", "Quando a via for de pista simples em aclive acentuado."],
        correctIndex: 1,
        explanation: "Pela direita só quando o veículo da frente sinalizou que vai virar à esquerda.",
        incidence: "alta",
        difficulty: 2,
        image_url: ""
    },
    {
        id: "rst_03",
        category: "direcao-defensiva",
        statement: "O pisca-alerta pode ser usado em movimento apenas quando:",
        options: ["Trafegando em velocidade reduzida sob cerração intensa.", "A sinalização da via determinar ou em imobilização de emergência.", "Realizando transposição de faixa em via arterial.", "Desejando estacionar no bordo da pista em local proibido."],
        correctIndex: 1,
        explanation: "Pisca-alerta andando só quando a sinalização determina ou em imobilização de emergência.",
        incidence: "media",
        difficulty: 2,
        image_url: ""
    },
    {
        id: "rst_04",
        category: "legislacao",
        statement: "A regra da preferência pela direita NÃO se aplica quando:",
        options: ["Um dos veículos estiver em rotatório ou ingressando de rodovia.", "Ambos transitarem por vias urbanas coletoras perpendiculares.", "A interseção for composta por vias paralelas de fluxo único.", "O cruzamento ocorrer dentro do perímetro urbano em trecho plano."],
        correctIndex: 0,
        explanation: "A regra da direita não vale quando há rotatória ou acesso de rodovia — esses têm preferência própria.",
        incidence: "media",
        difficulty: 2,
        image_url: ""
    },
    {
        id: "rst_05",
        category: "legislacao",
        statement: "A circulação sobre calçadas e passeios é admitida apenas para:",
        options: ["Evitar congestionamentos em vias arteriais de fluxo intenso.", "Entrar ou sair de imóveis ou áreas ladeadas de estacionamento.", "Realizar embarque ou desembarque rápido no bordo da pista.", "Fazer conversão à esquerda quando a via estiver deserta."],
        correctIndex: 1,
        explanation: "Sobre calçada e passeio só se permite entrar ou sair de imóveis e estacionamentos.",
        incidence: "media",
        difficulty: 2,
        image_url: ""
    },
    {
        id: "rst_06",
        category: "direcao-defensiva",
        statement: "Qual o risco técnico de descer em ponto morto (banguela)?",
        options: ["Acelerar o desgaste do motor pela falta de lubrificação.", "Perder a ação do freio motor e sobrecarregar os freios de serviço.", "Travar as rodas traseiras impedindo a conversão na pista.", "Provocar o desligamento automático dos faróis em alta velocidade."],
        correctIndex: 1,
        explanation: "Em neutro você perde o freio motor e sobrecarrega os freios de serviço, que superaquecem.",
        incidence: "alta",
        difficulty: 2,
        image_url: ""
    },
    {
        id: "rst_07",
        category: "legislacao",
        statement: "O uso da buzina é proibido em qual situação?",
        options: ["Fora do perímetro urbano para advertir sobre intenção de ultrapassar.", "Entre 22h e 6h ou em locais sinalizados com proibição.", "Como advertência preventiva para evitar acidentes na interseção.", "Ao aproximar-se de pedestres que estejam no bordo da pista."],
        correctIndex: 1,
        explanation: "Buzina proibida das 22h às 6h e em qualquer local sinalizado com proibição.",
        incidence: "alta",
        difficulty: 2,
        image_url: ""
    },
    {
        id: "rst_08",
        category: "legislacao",
        statement: "Veículos de emergência têm prioridade apenas quando:",
        options: ["Transitando por vias de trânsito rápido no perímetro urbano.", "Em serviço de urgência e devidamente identificados por alarme e luzes.", "Retornando de uma ocorrência para o pátio do órgão responsável.", "Circulando em trechos em aclive ou declive de rodovias."],
        correctIndex: 1,
        explanation: "A prioridade vale somente em serviço de urgência, com alarme e luzes ligados.",
        incidence: "media",
        difficulty: 1,
        image_url: ""
    },
    {
        id: "rst_09",
        category: "legislacao",
        statement: "A parada para embarque e desembarque deve ocorrer:",
        options: ["Pelo tempo estritamente necessário e sem interromper a fluidez.", "Com o pisca-alerta ligado em qualquer trecho da via arterial.", "Sempre no sentido oposto ao fluxo para facilitar a visibilidade.", "Apenas quando houver recuo específico no canteiro central."],
        correctIndex: 0,
        explanation: "Parada para embarque e desembarque só pelo tempo necessário e sem interromper a fluidez.",
        incidence: "media",
        difficulty: 2,
        image_url: ""
    },
    {
        id: "rst_10",
        category: "legislacao",
        statement: "Sem placa de velocidade, o limite de 80 km/h é admitido em:",
        options: ["Vias arteriais que cruzam o perímetro urbano.", "Vias coletoras adjacentes a áreas residenciais.", "Vias de trânsito rápido.", "Qualquer via urbana com pistas duplas e paralelas."],
        correctIndex: 2,
        explanation: "Sem placa, 80 km/h vale apenas nas vias de trânsito rápido (Art. 61 do CTB).",
        incidence: "altissima",
        difficulty: 2,
        image_url: ""
    },
    {
        id: "rst_11",
        category: "direcao-defensiva",
        statement: "Em aclive com visibilidade reduzida, a ultrapassagem é permitida com:",
        options: ["Espaço suficiente na pista sem tráfego de pedestres.", "Linha amarela contínua na sua faixa.", "Linha amarela seccionada na sua mão de direção.", "Cerração leve que permita enxergar veículos opostos."],
        correctIndex: 2,
        explanation: "No aclive só ultrapassa com linha amarela seccionada na sua mão de direção.",
        incidence: "media",
        difficulty: 2,
        image_url: ""
    },
    {
        id: "rst_12",
        category: "legislacao",
        statement: "A circulação de bicicletas sobre calçadas é permitida apenas quando:",
        options: ["O trânsito na pista estiver muito congestionado.", "Houver autorização expressa do órgão com jurisdição e sinalização.", "O ciclista estiver conduzindo a bicicleta em velocidade reduzida.", "A via transversal for classificada como de trânsito rápido."],
        correctIndex: 1,
        explanation: "Bicicleta na calçada só com autorização expressa do órgão com jurisdição e sinalização adequada.",
        incidence: "media",
        difficulty: 2,
        image_url: ""
    },
    {
        id: "rst_13",
        category: "primeiros-socorros",
        statement: "Durante o socorro a vítimas, o prestador NUNCA deve:",
        options: ["Sinalizar o local do acidente antes de iniciar o atendimento.", "Movimentar a vítima ou retirar o capacete de um motociclista.", "Chamar o serviço especializado de emergência (192 ou 193).", "Desligar a ignição do veículo acidentado para evitar incêndio."],
        correctIndex: 1,
        explanation: "Nunca movimente a vítima nem retire o capacete: aguarde o socorro especializado (192/193).",
        incidence: "alta",
        difficulty: 2,
        image_url: ""
    },
    {
        id: "rst_14",
        category: "mecanica",
        statement: "A pressão de calibragem dos pneus deve ser verificada quando estiverem:",
        options: ["Aquecidos após trafegar em alta velocidade na rodovia.", "Frios, preferencialmente antes de colocar o veículo em circulação.", "Totalmente descalibrados para ajuste do sistema de suspensão.", "Molhados após rodar sob chuva forte ou pista escorregadia."],
        correctIndex: 1,
        explanation: "Mede a calibragem com o pneu frio, de preferência antes de sair, pra leitura fiel.",
        incidence: "media",
        difficulty: 1,
        image_url: ""
    },
    {
        id: "rst_15",
        category: "legislacao",
        statement: "A conversão à esquerda em via de pista simples só deve ser executada após:",
        options: ["Aproximar o veículo do bordo esquerdo da pista.", "Aproximar da linha divisória do fluxo e ceder preferência ao sentido oposto.", "Acionar o pisca-alerta e avançar sobre a linha de retenção.", "Aumentar a velocidade para concluir a manobra antes do cruzamento."],
        correctIndex: 1,
        explanation: "Só vire depois de encostar na linha divisória e ceder a vez ao sentido contrário.",
        incidence: "media",
        difficulty: 2,
        image_url: ""
    },
    {
        id: "fr_01",
        category: "mecanica",
        statement: "Sobre a distribuição de atuação entre freio de pé e freio de mão, é correto afirmar:",
        options: ["O freio de mão atua nas quatro rodas e deve ser usado para reduzir velocidade.", "O freio de pé atua exclusivamente nas rodas dianteiras para imobilizar o veículo.", "O freio de pé atua nas quatro rodas e o de mão atua apenas nas rodas traseiras.", "Ambos os sistemas atuam somente nas rodas traseiras para evitar capotamento."],
        correctIndex: 2,
        explanation: "O freio de pé atua nas quatro rodas; o freio de mão atua apenas nas rodas traseiras.",
        incidence: "media",
        difficulty: 2,
        image_url: ""
    },
    {
        id: "fr_02",
        category: "direcao-defensiva",
        statement: "Na aquaplanagem, o condutor NUNCA deve:",
        options: ["Pisar bruscamente no freio nem virar o volante de forma repentina.", "Tirar suavemente o pé do acelerador para reduzir a velocidade.", "Manter o volante reto segurando-o firmemente com as duas mãos.", "Aguardar que os pneus retomem o contato direto com a pista."],
        correctIndex: 0,
        explanation: "Na aquaplanagem não freia nem vira: só tire o pé do acelerador e mantenha o volante reto.",
        incidence: "alta",
        difficulty: 2,
        image_url: ""
    },
    {
        id: "fr_03",
        category: "mecanica",
        statement: "A finalidade exclusiva do freio de estacionamento (freio de mão) é:",
        options: ["Auxiliar a parada de emergência em alta velocidade.", "Manter o veículo imobilizado em estacionamento ou parada em aclive/declive.", "Substituir o freio de pé em pista muito escorregadia.", "Reduzir a velocidade das rodas dianteiras durante conversões."],
        correctIndex: 1,
        explanation: "O freio de mão serve exclusivamente para imobilizar o veículo parado, em aclive ou declive.",
        incidence: "media",
        difficulty: 1,
        image_url: ""
    },
    {
        id: "fr_04",
        category: "direcao-defensiva",
        statement: "Para evitar o fade do freio em declive longo, o condutor deve utilizar:",
        options: ["O freio de mão em pequenos toques simultâneos com o freio de pé.", "O freio motor, engatando uma marcha reduzida compatível com a descida.", "Apenas a marcha neutra (ponto morto) para economizar o sistema de freios.", "O pisca-alerta enquanto mantém o pedal de freio pressionado continuamente."],
        correctIndex: 1,
        explanation: "Na descida longa use freio motor com marcha reduzida pra não superaquecer os freios.",
        incidence: "alta",
        difficulty: 2,
        image_url: ""
    },
    {
        id: "fr_05",
        category: "mecanica",
        statement: "Em veículo sem ABS, o travamento das rodas na frenagem provoca:",
        options: ["Aumento imediato do atrito e parada instantânea do veículo.", "Perda do controle da direção e arrastamento dos pneus sobre a pista.", "Acionamento automático do freio de estacionamento traseiro.", "Transferência do peso exclusivamente para as rodas traseiras."],
        correctIndex: 1,
        explanation: "Sem ABS, rodas travadas = perda da direção e pneus arrastando na pista.",
        incidence: "media",
        difficulty: 2,
        image_url: ""
    },
    {
        id: "fr_06",
        category: "direcao-defensiva",
        statement: "A prevenção da aquaplanagem deve ocorrer por meio de:",
        options: ["Aumento da velocidade para cruzar rapidamente o trecho alagado.", "Manutenção de pneus em bom estado e redução da velocidade sob chuva.", "Acionamento do freio de mão ao avistar poças na pista.", "Uso de luz alta para evaporar a água acumulada na pista."],
        correctIndex: 1,
        explanation: "Prevenção da aquaplanagem: pneus em bom estado e velocidade menor sob chuva.",
        incidence: "media",
        difficulty: 2,
        image_url: ""
    },
    {
        id: "fr_07",
        category: "mecanica",
        statement: "O sistema ABS atua durante a frenagem de emergência:",
        options: ["Bloqueando permanentemente as rodas traseiras para evitar derrapagem.", "Impedindo o travamento das rodas e mantendo a dirigibilidade do veículo.", "Funcionando apenas quando o freio de estacionamento está acionado.", "Atuando exclusivamente no freio motor durante aclives e declives."],
        correctIndex: 1,
        explanation: "O ABS impede o travamento das rodas, mantendo a dirigibilidade durante a frenagem.",
        incidence: "alta",
        difficulty: 1,
        image_url: ""
    },
    {
        id: "fr_08",
        category: "direcao-defensiva",
        statement: "Frear com violência em curva escorregadia pode provocar:",
        options: ["O desengate automático do câmbio e aumento de velocidade do motor.", "A derrapagem do veículo por travamento das rodas e perda de aderência.", "A perda imediata de pressão de ar em todos os pneus simultaneamente.", "A ativação do sistema de iluminação de emergência e pisca-alerta."],
        correctIndex: 1,
        explanation: "Freio brusco na curva escorregadia trava as rodas e provoca derrapagem.",
        incidence: "media",
        difficulty: 2,
        image_url: ""
    },
    {
        id: "fr_09",
        category: "direcao-defensiva",
        statement: "O freio motor é acionado exclusivamente:",
        options: ["Pressionando o pedal de embreagem junto com o freio de mão.", "Tirando o pé do acelerador e engrenando marchas mais reduzidas.", "Desligando a chave de ignição durante o percurso em declive.", "Puxando a alavanca do freio de estacionamento em pequenos intervalos."],
        correctIndex: 1,
        explanation: "Freio motor: tire o pé do acelerador e engate marchas mais reduzidas.",
        incidence: "alta",
        difficulty: 2,
        image_url: ""
    },
    {
        id: "fr_10",
        category: "mecanica",
        statement: "Pedal de freio que afunda até o assoalho sem resistência indica:",
        options: ["Vazamento do fluido de freio ou presença de ar nas tubulações hidráulicas.", "Travamento mecânico exclusivo da alavanca do freio de mão.", "Pressão excessiva de ar no interior dos pneus do eixo traseiro.", "Desgaste das lâmpadas das luzes de freio na traseira do veículo."],
        correctIndex: 0,
        explanation: "Pedal que afunda = vazamento de fluido de freio ou ar no sistema hidráulico.",
        incidence: "media",
        difficulty: 2,
        image_url: ""
    },
    {
        id: "plc_a6_01",
        category: "legislacao",
        statement: "A placa de advertência A-6 alerta o condutor sobre:",
        options: ["Entroncamento oblíquo de via arterial com via coletora.", "Cruzamento de vias no mesmo nível, com ou sem visibilidade.", "Cruzamento com linha férrea em nível sem barreira.", "Acesso a uma via paralela de sentido único."],
        correctIndex: 1,
        explanation: "A placa A-6 é de advertência e avisa que existe um cruzamento de vias no mesmo nível, com ou sem visibilidade.",
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
        statement: "Diante da placa A-6 em via sem semáforo, a conduta adequada é:",
        options: ["Aumentar a velocidade para cruzar antes do veículo à direita.", "Reduzir a velocidade, observar o tráfego e dar preferência conforme a regra.", "Acionar a buzina continuamente e prosseguir sem parar.", "Realizar transposição de faixa exclusivamente para a esquerda."],
        correctIndex: 1,
        explanation: "A A-6 avisa sobre risco iminente: reduza, observe as vias transversais e aplique a regra geral de preferência pela direita.",
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
        statement: "Na interseção indicada apenas pela placa A-6, a preferência pertence:",
        options: ["Ao veículo que trafega em maior velocidade na pista.", "Ao veículo que se aproxima pela direita do condutor.", "Exclusivamente ao veículo que realiza conversão à esquerda.", "Ao veículo de maior porte, independentemente da via."],
        correctIndex: 1,
        explanation: "Não havendo semáforo nem agente, vale a regra geral: cede passagem quem se aproxima pela direita do condutor.",
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
        statement: "Ao trafegar sob chuva intensa e deparar-se com trecho de via em processo de alagamento, o condutor deve:",
        options: ["Frear bruscamente e aguardar o nível da água baixar sobre a pista de rolamento.", "Acelerar para transpor o trecho rapidamente antes que o nível da água suba mais.", "Procurar local alto e seguro para parar, ou engrenar 1ª marcha mantendo aceleração constante se a água não cobrir metade da roda.", "Reduzir a marcha para 2ª e acelerar forte ao perceber que o nível da água ultrapassou a altura dos pneus."],
        correctIndex: 2,
        explanation: "A água acima da metade da roda exige parada em local alto e seguro. Se estiver abaixo, passa-se em 1ª marcha com aceleração constante para evitar entrada de água pelo escapamento e calço hidráulico (Art. 28 do CTB / Direção Defensiva).",
        legalBase: "Art. 28 do CTB",
        incidence: "alta",
        trap: true,
        difficulty: 2
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
    const byId = new Map(QUESTIONS.map((q) => [q.id, q]));
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

export function getRandomizedQuestions(count: number, opts?: {
    categories?: Category[];
    seed?: number;
    exclude?: string[];
    placasCount?: number;
    questionsList?: Question[];
}): Question[] {
    let pool = opts?.questionsList || [...QUESTIONS];
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
    const indices = q.options.map((_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    const newOptions = indices.map((i) => q.options[i]);
    const newCorrect = indices.indexOf(q.correctIndex);
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
    let pool = opts?.questionsList ? [...opts.questionsList] : [...QUESTIONS];

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

    const level3Pool = QUESTIONS.filter((q) => q.difficulty === 3);
    const level2TrapPool = QUESTIONS.filter((q) => q.difficulty === 2 && q.trap);
    const restPool = QUESTIONS.filter((q) => q.difficulty === 1 || q.difficulty === 2);

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
        const fallback = QUESTIONS.filter((q) => !used.has(q.id));
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
    const base = opts?.questionsList ? [...opts.questionsList] : [...QUESTIONS];
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
