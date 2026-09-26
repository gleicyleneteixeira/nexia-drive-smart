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
        statement: "Um cidadão aprovado em todos os exames do processo de habilitação recebe a Permissão para Dirigir (PPD) na categoria B. De acordo com as normas de trânsito vigentes no CTB, essa categoria de habilitação concede a ele o direito de conduzir exclusivamente:",
        options: [
            "Veículos motorizados cujo Peso Bruto Total (PBT) não exceda a 3.500 kg e cuja lotação não exceda a 8 passageiros, excluído o motorista.",
            "Veículos motorizados destinado ao transporte de passageiros com lotação máxima de 8 pessoas, incluindo obrigatoriamente o motorista.",
            "Veículos motorizados com ou sem reboque acoplado, desde que o peso do reboque não ultrapasse 1.000 kg e a lotação seja inferior a 8 lugares.",
            "Veículos de carga de qualquer espécie, desde que não ultrapassem o limite de capacidade máxima de tração de 3,5 toneladas.",
        ],
        correctIndex: 0,
        explanation: 'A Categoria B deixa voc\u00EA dirigir carros de at\u00E9 3.500 kg e com 8 lugares, sem contar o motorista.',
        detailedExplanation: 'Com a categoria B, voc\u00EA pode dirigir carros de passeio, utilit\u00E1rios e furg\u00F5es, desde que n\u00E3o passem de 3.500 kg e tenham no m\u00E1ximo 8 lugares. Motocicletas precisam da categoria A, enquanto ve\u00EDculos maiores ou com mais passageiros exigem categorias C e D, respectivamente.',
        legalBase: "Art. 143 do CTB",
        commonMistake: 'Cuidado: n\u00E3o confunda 8 passageiros no total com 8 passageiros mais o motorista \u2014 s\u00E3o 8 + 1!',
        tip: 'B = At\u00E9 3.500 kg e 8 + 1.',
        incidence: "altissima",
        difficulty: 3
    },
    {
        id: "q2",
        category: "placas",
        statement: "Na sinalização vertical, as placas de regulamentação impõem obrigações, limitações e proibições. Em via do perímetro urbano, o condutor observa placa circular com orla vermelha. Pela classificação do CTB, o padrão dessa classe é:",
        options: [
            "Advertir sobre perigos potenciais na via, possuindo formato de losango e cores amarela e preta.",
            "Impor obrigações, limitações, proibições ou restrições de uso da via, possuindo formato circular com orla vermelha, fundo branco e símbolo preto.",
            "Indicar direções, distâncias e serviços auxiliares aos usuários da via, possuindo formato retangular e cores azul e branca.",
            "Orientar fluxos turísticos e áreas de preservação ambiental, possuindo formato retangular e cores marrom e branca.",
        ],
        correctIndex: 1,
        explanation: 'As placas de regulamenta\u00E7\u00E3o s\u00E3o redondas, com borda vermelha, fundo branco e s\u00EDmbolo preto, e dizem o que voc\u00EA pode ou n\u00E3o fazer na via.',
        detailedExplanation: 'Essas placas (s\u00E9rie R) t\u00EAm formato CIRCULAR e s\u00E3o usadas para dar ordens e proibi\u00E7\u00F5es. Se voc\u00EA n\u00E3o seguir, pode levar multa. Tem algumas que s\u00E3o diferentes, como a PARE (R-1) que \u00E9 OCTOGONAL e a \'D\u00EA a prefer\u00EAncia\' (R-2) que \u00E9 TRI\u00C2NGULO INVERTIDO, mas todas s\u00E3o de regulamenta\u00E7\u00E3o.',
        commonMistake: 'Muita gente confunde com as placas de advert\u00EAncia (losango amarelo).',
        tip: 'Vermelho = voc\u00EA \u00E9 OBRIGADO a obedecer.',
        incidence: "altissima",
        difficulty: 3
    },
    {
        id: "q3",
        category: "direcao-defensiva",
        statement: "Em via urbana de pista dupla, pedestre inicia travessia fora da faixa de sinalização enquanto o condutor se aproxima em velocidade regular. Pela direção defensiva e pela regra de preferência do Art. 29 do CTB, a conduta imediata do condutor é:",
        options: [
            "Manter a velocidade e utilizar a buzina de forma contínua para alertar o pedestre.",
            "Acelerar para transpor a faixa antes da entrada do pedestre na pista de rolamento.",
            "Reduzir a velocidade com segurança, sinalizar aos demais usuários e ceder a travessia ao pedestre.",
            "Executar transposição brusca de faixa sem sinalização para desviar do pedestre."
        ],
        correctIndex: 2,
        explanation: 'O pedestre sempre tem prioridade, mesmo fora da faixa de seguran\u00E7a.',
        detailedExplanation: 'O CTB diz que o pedestre \u00E9 o mais vulner\u00E1vel e deve ser respeitado. O motorista precisa diminuir a velocidade e parar se for preciso, esperando o pedestre passar. A vida do pedestre \u00E9 responsabilidade do motorista, n\u00E3o importa a situa\u00E7\u00E3o.',
        legalBase: "Art. 29, §2º do CTB",
        commonMistake: 'Muita gente acha que o pedestre fora da faixa n\u00E3o tem prioridade, mas isso \u00E9 furada!',
        incidence: "alta",
        trap: true,
        difficulty: 3
    },
    {
        id: "qe01",
        category: "legislacao",
        statement: "Um jovem de 18 anos pretende iniciar o processo de habilitação e precisa abrir o RENACH, cadastro nacional que identifica os condutores. Segundo o CTB e as resoluções do CONTRAN, o cadastro inicial deve ser realizado:",
        options: [
            "No DETRAN do estado ou do Distrito Federal onde o candidato tem residência.",
            "Direto no CONTRAN, órgão máximo normativo que edita as resoluções de trânsito.",
            "No CFC (centro de formação de condutores), que possui competência exclusiva para abri-lo.",
            "No Ministério dos Transportes, por meio da SENATRAN, de forma centralizada."
        ],
        correctIndex: 0,
        explanation: 'Pra conseguir a CNH, o jovem precisa ir ao DETRAN do lugar onde mora.',
        detailedExplanation: 'O RENACH \u00E9 como um cadastro nacional de motoristas, e s\u00F3 pode ser aberto no DETRAN do estado onde a pessoa vive. Se tentar fazer em outro lugar, vai dar confus\u00E3o e atrasar o processo.',
        legalBase: "Res. CONTRAN 168/2004",
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "qe02",
        category: "legislacao",
        statement: "A Permissão para Dirigir (PPD) é o documento que atesta a aprovação do candidato nos exames teóricos e práticos de direção veicular. Sob a ótica do Código de Trânsito Brasileiro (CTB), qual é o período de vigência probatória desse documento que antecede a CNH definitiva?",
        options: [
            "Doze meses, contados a partir da data de sua efetiva expedição física ou digital.",
            "Seis meses, prorrogáveis caso o condutor não seja reincidente em infrações leves.",
            "Dois anos, idêntico ao prazo de validade padrão das avaliações psicológicas especiais.",
            "Cinco anos, correspondente ao período máximo de carência dos exames de aptidão física.",
        ],
        correctIndex: 0,
        explanation: 'A PPD vale por um ano como teste pra ver se voc\u00EA manda bem na dire\u00E7\u00E3o.',
        detailedExplanation: 'A Permiss\u00E3o para Dirigir (PPD) \u00E9 a primeira etapa da habilita\u00E7\u00E3o e dura 12 meses. Se voc\u00EA cometer infra\u00E7\u00F5es graves ou for reincidente em m\u00E9dias, n\u00E3o ganha a CNH e tem que come\u00E7ar tudo de novo. Esse tempo \u00E9 pra garantir que voc\u00EA aprenda a ser respons\u00E1vel no tr\u00E2nsito antes de ter a habilita\u00E7\u00E3o definitiva.',
        legalBase: "Art. 148, §3º CTB",
        incidence: "altissima",
        difficulty: 3
    },
    {
        id: "qe03",
        category: "legislacao",
        statement: "Condutor passa 12 meses sem cometer nenhuma infração gravíssima, acumulando apenas pontuação de infrações leves e médias. Pela sistemática de pontos introduzida pela Lei 14.071/2020 no CTB, a suspensão do direito de dirigir ocorre:",
        options: [
            "Aos 40 pontos acumulados, desde que não haja nenhuma infração gravíssima no período.",
            "Aos 30 pontos, caso haja uma única infração grave no prontuário do condutor.",
            "Aos 20 pontos, independentemente da natureza das infrações apuradas no período.",
            "Aos 14 pontos, para condutores com exercício de atividade remunerada (EAR)."
        ],
        correctIndex: 0,
        explanation: 'Sem infra\u00E7\u00F5es grav\u00EDssimas, a suspens\u00E3o do direito de dirigir acontece quando o motorista chega a 40 pontos.',
        detailedExplanation: 'A Lei 14.071/2020 mudou as regras de pontua\u00E7\u00E3o para a CNH. Se o motorista n\u00E3o tiver infra\u00E7\u00F5es grav\u00EDssimas, pode acumular at\u00E9 40 pontos; se tiver uma, o limite cai para 30; e se tiver duas ou mais, vai para 20 pontos. Por isso, \u00E9 bom ficar ligado nas novas regras!',
        legalBase: "Art. 261 CTB",
        commonMistake: 'Muita gente ainda acha que \u00E9 20 pontos fixos, mas isso mudou!',
        incidence: "altissima",
        trap: true,
        difficulty: 3
    },
    {
        id: "qe04",
        category: "legislacao",
        statement: "Um taxista que possui a observação de exercício de atividade remunerada (EAR) em sua habilitação acumula pontos por infrações leves e médias no período de doze meses. Pelas regras específicas do CTB para condutores EAR, o limite de pontos aplicável para a suspensão do direito de dirigir é:",
        options: [
            "40 pontos fixos, independentemente da natureza ou gravidade das infrações cometidas no período.",
            "20 pontos, sofrendo redução imediata caso cometa qualquer infração de trânsito de natureza média.",
            "30 pontos, caso conste uma infração grave ou gravíssima em seu prontuário veicular.",
            "25 pontos, mediante abertura de processo de reciclagem obrigatório quando atingir 20 pontos.",
        ],
        correctIndex: 0,
        explanation: 'Taxistas com EAR acumulam at\u00E9 40 pontos, n\u00E3o importa se as infra\u00E7\u00F5es s\u00E3o leves ou m\u00E9dias.',
        detailedExplanation: 'Antes da nova lei, motoristas de t\u00E1xi e outros com EAR tinham limites diferentes de pontos. Agora, o limite \u00E9 o mesmo para todo mundo, mas eles t\u00EAm que fazer exame toxicol\u00F3gico periodicamente, enquanto os outros n\u00E3o precisam.',
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "qe05",
        category: "legislacao",
        statement: "Durante fiscalização de trânsito rotineira realizada pela Polícia Rodoviária Federal, o condutor é solicitado a apresentar os documentos obrigatórios. De acordo com a legislação e resoluções do CONTRAN, constitui documento de porte obrigatório pelo condutor do veículo:",
        options: [
            "A CNH (física ou digital) e o Certificado de Licenciamento Anual (CLA/CRLV-e), cuja apresentação em formato digital é válida por lei.",
            "O Certificado de Registro de Veículo (CRV) e o comprovante de pagamento do Imposto sobre a Propriedade de Veículos Automotores (IPVA).",
            "O documento de identidade civil (RG) e a carteira de vacinação obrigatória do condutor.",
            "Apenas o comprovante de aprovação nos exames de aptidão física e mental do corrente ano.",
        ],
        correctIndex: 0,
        explanation: 'A CNH e o CLA/CRLV-e s\u00E3o os documentos que voc\u00EA tem que ter sempre com voc\u00EA. Se o agente conseguir olhar no sistema, voc\u00EA n\u00E3o precisa mostrar.',
        detailedExplanation: 'Pra dirigir de boa, voc\u00EA precisa ter a CNH (Carteira Nacional de Habilita\u00E7\u00E3o) e o CRLV (Certificado de Registro e Licenciamento do Ve\u00EDculo). Voc\u00EA pode mostrar eles no celular, que vale igual ao papel. Se faltar algum, pode dar ruim e o carro ser guinchado pro p\u00E1tio.',
        legalBase: "Art. 159 CTB",
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "qe06",
        category: "legislacao",
        statement: "Um condutor obteve aprovação exclusiva para a categoria de habilitação 'A'. De acordo com as definições de categorias contidas no Art. 143 do CTB, esse documento autoriza a condução de quais tipos de veículos nas vias públicas?",
        options: [
            "Veículos motorizados de duas ou três rodas, com ou sem carro lateral (sidecar).",
            "Veículos de transporte coletivo de passageiros cuja lotação não exceda a 8 lugares.",
            "Qualquer espécie de veículo motorizado cujo peso bruto total não ultrapasse 3.500 kg.",
            "Veículos motorizados de duas rodas com potência limitada a no máximo 50 cilindradas.",
        ],
        correctIndex: 0,
        explanation: 'A categoria \'A\' \u00E9 pra quem pilota motos e triciclos, com ou sem aquele carrinho do lado (sidecar).',
        detailedExplanation: 'No CTB, cada categoria \u00E9 pra um tipo de ve\u00EDculo. A categoria A \u00E9 s\u00F3 pra duas ou tr\u00EAs rodas: motos, motonetas e triciclos. Carros e caminh\u00F5es precisam de outras categorias.',
        legalBase: "Art. 143 CTB",
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "qe07",
        category: "legislacao",
        statement: "Um indivíduo é flagrado por agentes de trânsito conduzindo um veículo automotor sem nunca ter sido habilitado ou possuir qualquer permissão. Sob a perspectiva administrativa e punitiva do Código de Trânsito Brasileiro, essa conduta configura infração de natureza:",
        options: [
            "Gravíssima, punida com multa multiplicada por três vezes e retenção do veículo até a apresentação de condutor habilitado.",
            "Grave, gerando apreensão automática e leilão imediato do veículo em 30 dias.",
            "Média, punida apenas com advertência pedagógica por escrito se o veículo estiver licenciado.",
            "Crime de trânsito incondicionado com detenção imediata de seis meses a um ano.",
        ],
        correctIndex: 0,
        explanation: 'Dirigir sem habilita\u00E7\u00E3o \u00E9 uma infra\u00E7\u00E3o grav\u00EDssima, com multa tr\u00EAs vezes maior e o carro fica retido at\u00E9 aparecer um motorista com CNH.',
        detailedExplanation: 'Se voc\u00EA n\u00E3o tem CNH ou Permiss\u00E3o, t\u00E1 cometendo uma das infra\u00E7\u00F5es mais s\u00E9rias do CTB. Isso \u00E9 grav\u00EDssimo, com multa tripla e o carro vai ser retido at\u00E9 algu\u00E9m habilitado aparecer pra levar.',
        legalBase: "Art. 162, I CTB",
        incidence: "altissima",
        difficulty: 3
    },
    {
        id: "qe08",
        category: "legislacao",
        statement: "O Código de Trânsito Brasileiro prevê a aplicação de penalidades administrativas aos condutores infratores. Dentre elas, a submissão obrigatória a curso de reciclagem será imposta ao condutor quando:",
        options: [
            "Tiver seu direito de dirigir suspenso, se envolver em acidente grave para o qual haja contribuído ou for condenado judicialmente por delito de trânsito.",
            "Cometer qualquer infração de natureza média ou leve no período probatório da PPD.",
            "Estacionar o veículo em vaga regulamentada de idoso sem a devida credencial de identificação.",
            "Ultrapassar em local proibido sinalizado por linha dupla amarela contínua.",
        ],
        correctIndex: 0,
        explanation: 'O curso de reciclagem \u00E9 obrigat\u00F3rio se voc\u00EA perder o direito de dirigir, se envolver em acidente grave ou for condenado por crime de tr\u00E2nsito.',
        detailedExplanation: 'Esse curso ajuda a pessoa a aprender de novo sobre as regras de tr\u00E2nsito e a dirigir com mais seguran\u00E7a. Ele \u00E9 exigido quando a pessoa tem a CNH suspensa e, no final, precisa passar em uma prova para conseguir a habilita\u00E7\u00E3o de volta.',
        legalBase: "Art. 268 CTB",
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "qe09",
        category: "legislacao",
        statement: "Um condutor habilitado na categoria 'B' há mais de um ano deseja alterar sua habilitação para a categoria 'C' para conduzir veículos de carga. Conforme os requisitos específicos previstos no Art. 143 do CTB, para realizar essa mudança, ele não pode ter cometido no último ano:",
        options: [
            "Mais de uma infração de trânsito de natureza gravíssima em seu prontuário.",
            "Mais do que uma infração média e nenhuma infração grave no prontuário.",
            "Qualquer infração grave ou gravíssima, ou ser reincidente em infrações médias.",
            "Nenhuma infração leve ou média que resulte em pontuação no prontuário do condutor.",
        ],
        correctIndex: 0,
        explanation: 'Pra trocar de B pra C, o motorista precisa ter a B h\u00E1 mais de um ano e n\u00E3o pode ter mais de uma infra\u00E7\u00E3o grav\u00EDssima no \u00FAltimo ano.',
        detailedExplanation: 'Com a nova lei, as regras ficaram mais f\u00E1ceis. Agora, o condutor pode ter no m\u00E1ximo uma infra\u00E7\u00E3o grav\u00EDssima nos \u00FAltimos 12 meses e n\u00E3o precisa se preocupar com infra\u00E7\u00F5es graves ou m\u00E9dias.',
        legalBase: "Art. 143, §1º do CTB",
        commonMistake: 'Muita gente ainda pensa que n\u00E3o pode ter nenhuma infra\u00E7\u00E3o grave ou grav\u00EDssima, mas agora \u00E9 permitido ter uma grav\u00EDssima.',
        tip: 'Mudan\u00E7a de categoria = at\u00E9 1 grav\u00EDssima permitida nos \u00FAltimos 12 meses.',
        incidence: "media",
        difficulty: 3
    },
    {
        id: "qe10",
        category: "legislacao",
        statement: "O direito de iniciar o processo de habilitação para condução de veículos automotores e elétricos é assegurado pelo ordenamento jurídico nacional. Sob o ponto de vista penal e civil, o requisito essencial de idade mínima exigido baseia-se na condição de o candidato ser:",
        options: [
            "Penalmente imputável (maior de 18 anos), de forma a responder civil e penalmente pelos seus atos.",
            "Maior de 16 anos emancipado, com autorização expressa em cartório público pelos genitores.",
            "Eleitor regularmente alistado perante a Justiça Eleitoral, possuindo título de eleitor.",
            "Maior de 18 anos apenas, independentemente de compreender as consequências civis e criminais.",
        ],
        correctIndex: 0,
        explanation: 'Pra tirar a habilita\u00E7\u00E3o, a pessoa tem que ter pelo menos 18 anos e ser capaz de responder pelos pr\u00F3prios atos (ser penalmente imput\u00E1vel).',
        detailedExplanation: 'Com 18 anos, a pessoa j\u00E1 pode ser responsabilizada como adulta e isso \u00E9 importante pra dirigir. Al\u00E9m disso, tem que saber ler e escrever, ter CPF e documento de identidade. Se for tirar categorias profissionais (C, D e E), precisa ter 21 anos.',
        legalBase: "Art. 140 CTB",
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "qe11",
        category: "legislacao",
        statement: "A expedição da Carteira Nacional de Habilitação (CNH) definitiva representa a transição do período probatório para o condutor habilitado. Conforme as normas previstas no CTB, a concessão deste documento ao término de um ano de PPD requer que o condutor:",
        options: [
            "Não tenha cometido nenhuma infração de natureza grave ou gravíssima, nem seja reincidente em infração média no período de doze meses.",
            "Tenha realizado pelo menos três viagens intermunicipais com monitoramento do órgão de trânsito estadual.",
            "Apresente certidão negativa de débitos de multas ambientais federais.",
            "Comprove a realização de exames complementares de direção veicular defensiva avançada.",
        ],
        correctIndex: 0,
        explanation: 'Pra pegar a CNH definitiva, voc\u00EA n\u00E3o pode ter feito infra\u00E7\u00F5es graves ou grav\u00EDssimas e nem ter repetido infra\u00E7\u00F5es m\u00E9dias durante o ano da PPD.',
        detailedExplanation: 'Depois de passar nos testes, voc\u00EA ganha a Permiss\u00E3o para Dirigir (PPD) que vale por um ano. Se durante esse tempo voc\u00EA dirigir direitinho, sem infra\u00E7\u00F5es pesadas, a CNH definitiva sai na hora. Mas se vacilar e cometer alguma infra\u00E7\u00E3o, vai ter que come\u00E7ar tudo de novo, com aulas e testes.',
        legalBase: "Art. 148 CTB",
        incidence: "altissima",
        trap: true,
        difficulty: 3
    },
    {
        id: "qe12",
        category: "legislacao",
        statement: "O exame toxicológico de larga janela de detecção destina-se ao controle do consumo de substâncias psicoativas por condutores profissionais. Sob o regramento atual do CTB, a realização deste exame é obrigatória na obtenção e renovação da habilitação nas categorias:",
        options: [
            "C, D e E, independentemente do exercício de atividade remunerada (EAR).",
            "B, C e D, somente se o condutor exercer atividade remunerada de transporte escolar.",
            "A, B e C, sempre que a validade da CNH for superior a cinco anos civis.",
            "Apenas na categoria E, para motoristas de veículos articulados com carga inflamável.",
        ],
        correctIndex: 0,
        explanation: 'O exame toxicol\u00F3gico \u00E9 obrigat\u00F3rio para quem tem CNH das categorias C, D e E, a cada 2 anos e meio at\u00E9 os 70 anos.',
        detailedExplanation: 'Esse exame vale tanto na hora de pegar a CNH quanto na hora de renovar. Ele serve pra ver se o motorista t\u00E1 usando drogas que podem atrapalhar a dire\u00E7\u00E3o, j\u00E1 que quem dirige caminh\u00E3o, \u00F4nibus ou carrega carga tem que ter mais cuidado.',
        legalBase: "Art. 148-A CTB",
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "qe13",
        category: "infracoes",
        statement: "Um motorista estaciona seu veículo em uma vaga de estacionamento reservada a idosos na via pública, sem expor no painel a credencial emitida pelo órgão de trânsito local. Conforme as disposições punitivas previstas no CTB, tal conduta constitui infração de natureza:",
        options: [
            "Gravíssima, punida com multa, acúmulo de 7 pontos na CNH e medida administrativa de remoção do veículo.",
            "Grave, punida com multa pecuniária simples e retenção temporária do veículo para advertência oral.",
            "Média, gerando apenas a penalidade administrativa de recolhimento da CNH por trinta dias.",
            "Leve, passível de conversão imediata em advertência por escrito pelo agente de trânsito.",
        ],
        correctIndex: 0,
        explanation: 'Estacionar em vaga de idoso sem a credencial \u00E9 infra\u00E7\u00E3o grav\u00EDssima e o carro pode ser guinchado.',
        detailedExplanation: 'Quando voc\u00EA para em vaga de idoso sem a credencial, a multa \u00E9 alta e ainda acumula 7 pontos na CNH. Essas vagas s\u00E3o pra quem realmente precisa, ent\u00E3o usar sem autoriza\u00E7\u00E3o \u00E9 bem s\u00E9rio.',
        legalBase: "Art. 181, XVII CTB",
        incidence: "media",
        difficulty: 3
    },
    {
        id: "qe14",
        category: "infracoes",
        statement: "Em um estabelecimento comercial privado de uso coletivo (como o estacionamento de um shopping center), um condutor estaciona na vaga reservada a Pessoas com Deficiência (PCD) sem possuir a credencial autorizativa. Diante dessa situação, o CTB prevê:",
        options: [
            "Infração de natureza gravíssima, punida com multa e medida administrativa de remoção do veículo.",
            "Impossibilidade de atuação do agente de trânsito, por se tratar de propriedade privada e sem jurisdição pública.",
            "Infração de natureza grave, passível de remoção do veículo se houver reclamação direta do gerente do local.",
            "Infração média, punida com multa administrativa e apreensão do veículo.",
        ],
        correctIndex: 0,
        explanation: 'Estacionar em vaga de PCD sem a credencial \u00E9 uma infra\u00E7\u00E3o grav\u00EDssima, com multa e remo\u00E7\u00E3o do carro.',
        detailedExplanation: 'Se voc\u00EA parar em uma vaga reservada para pessoa com defici\u00EAncia (PCD) sem a credencial, vai levar uma multa pesada e ainda pode ter seu carro guinchado. Essas vagas s\u00E3o maiores para ajudar quem precisa de cadeira de rodas, ent\u00E3o ocup\u00E1-las sem autoriza\u00E7\u00E3o \u00E9 bem s\u00E9rio.',
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "qe15",
        category: "infracoes",
        statement: "Ao realizar rondas de trânsito, o agente de fiscalização observa que o passageiro do banco traseiro de um automóvel de passeio não está utilizando o cinto de segurança. De acordo com as normas de conduta e penalidades previstas no CTB, essa situação configura:",
        options: [
            "Infração de natureza grave praticada pelo condutor do veículo, punida com multa e medida administrativa de retenção do veículo até a colocação do cinto.",
            "Infração de natureza média praticada diretamente pelo passageiro, sendo este o único responsável legal pela multa.",
            "Infração leve de responsabilidade exclusiva do proprietário do veículo, gerando apenas advertência verbal pedagógica.",
            "Infração de natureza gravíssima com fator multiplicador de três vezes, punida com retenção definitiva do veículo.",
        ],
        correctIndex: 0,
        explanation: 'N\u00E3o usar o cinto de seguran\u00E7a \u00E9 uma infra\u00E7\u00E3o grave e o condutor \u00E9 quem leva a culpa, podendo at\u00E9 ter o carro retido.',
        detailedExplanation: 'Deixar de usar o cinto de seguran\u00E7a gera 5 pontos na CNH e multa. O cinto \u00E9 obrigat\u00F3rio para todos no carro, tanto na frente quanto atr\u00E1s, em qualquer tipo de via. O condutor \u00E9 respons\u00E1vel por garantir que todos os passageiros estejam usando o cinto, mesmo que seja o passageiro que n\u00E3o esteja usando.',
        legalBase: "Art. 167 CTB",
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "qe16",
        category: "infracoes",
        statement: "Um motorista é flagrado por um radar dotado de câmera de alta definição trafegando enquanto segura ou manuseia seu telefone celular para visualizar mensagens. Sob a égide da legislação de trânsito atualizada, esta conduta específica classifica-se como:",
        options: [
            "Infração de natureza gravíssima, sujeita a multa pecuniária e acúmulo de 7 pontos no prontuário da CNH.",
            "Infração grave, punida com multa e suspensão preventiva do direito de dirigir por trinta dias.",
            "Infração média, gerando apenas advertência formal por escrito expedida pelo órgão executivo de trânsito.",
            "Infração leve, punida com multa caso o condutor esteja desenvolvendo velocidade acima da média da via.",
        ],
        correctIndex: 0,
        explanation: 'Usar o celular enquanto dirige \u00E9 uma infra\u00E7\u00E3o grav\u00EDssima (Art. 252, par\u00E1grafo \u00FAnico do CTB).',
        detailedExplanation: 'Segurar o celular ao volante \u00E9 muito s\u00E9rio, d\u00E1 7 pontos na CNH e multa. A lei ficou mais r\u00EDgida porque mexer no celular tira a aten\u00E7\u00E3o e \u00E9 t\u00E3o perigoso quanto dirigir b\u00EAbado. O celular s\u00F3 pode ser usado em modo viva-voz ou com fone, sem segurar.',
        legalBase: "Art. 252, §1º CTB",
        incidence: "altissima",
        difficulty: 3
    },
    {
        id: "qe17",
        category: "infracoes",
        statement: "Dois condutores resolvem realizar uma disputa de velocidade e arrancada rápida ('racha') em uma via arterial urbana aberta à circulação pública. Sob o prisma do Código de Trânsito Brasileiro, quais as penalidades e medidas administrativas aplicáveis a essa infração gravíssima de trânsito?",
        options: [
            "Multa multiplicada por dez vezes, suspensão do direito de dirigir, recolhimento do documento de habilitação e remoção do veículo.",
            "Multa de cinco vezes o valor base, retenção do veículo e curso obrigatório de primeiros socorros.",
            "Apenas advertência por escrito e apreensão temporária dos veículos por vinte e quatro horas.",
            "Multa multiplicada por vinte vezes e cassação imediata e definitiva de todas as categorias de CNH sem direito a defesa.",
        ],
        correctIndex: 0,
        explanation: 'Fazer racha na rua \u00E9 uma infra\u00E7\u00E3o grav\u00EDssima que leva a multa pesada, suspens\u00E3o da carteira e o carro \u00E9 guinchado pro p\u00E1tio.',
        detailedExplanation: 'Disputar corrida em via p\u00FAblica \u00E9 muito s\u00E9rio: \u00E9 uma infra\u00E7\u00E3o grav\u00EDssima com multa multiplicada por 10, suspens\u00E3o do direito de dirigir e o carro \u00E9 retirado. Al\u00E9m disso, racha \u00E9 crime, podendo dar at\u00E9 3 anos de pris\u00E3o, pois coloca todo mundo em risco, n\u00E3o s\u00F3 os motoristas envolvidos.',
        legalBase: "Art. 173/308 CTB",
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "qe18",
        category: "infracoes",
        statement: "Em uma via coletora urbana cuja velocidade máxima permitida pela sinalização local é de 40 km/h, um radar de fiscalização eletrônica registra um veículo transitando a 55 km/h. Considerando a velocidade registrada, a infração cometida pelo motorista enquadra-se como:",
        options: [
            "Infração média, por transitar em velocidade superior à máxima permitida em até 20%.",
            "Infração grave, por transitar em velocidade superior à máxima permitida em mais de 20% até 50%.",
            "Infração gravíssima, punida com multa multiplicada por três vezes e suspensão automática do direito de dirigir.",
            "Infração leve, passível de conversão imediata em advertência escrita se for o primeiro registro do condutor.",
        ],
        correctIndex: 1,
        explanation: 'A velocidade de 55 km/h \u00E9 mais de 20% acima do limite de 40 km/h, o que \u00E9 considerado uma infra\u00E7\u00E3o grave.',
        detailedExplanation: 'Quando voc\u00EA passa de 20% a 50% do limite de velocidade, a infra\u00E7\u00E3o \u00E9 grave e voc\u00EA leva 5 pontos na CNH e multa. O CTB classifica as infra\u00E7\u00F5es de velocidade em faixas: at\u00E9 20% \u00E9 m\u00E9dia, de 20% a 50% \u00E9 grave, e acima de 50% \u00E9 grav\u00EDssima, com penalidades mais severas.',
        legalBase: "Art. 218, II CTB",
        incidence: "altissima",
        difficulty: 3
    },
    {
        id: "qe19",
        category: "infracoes",
        statement: "Ao transitar por uma rodovia de pista dupla cuja velocidade máxima regulamentada para automóveis é de 110 km/h, o veículo de um motorista é registrado pela fiscalização eletrônica desenvolvendo a velocidade de 170 km/h. Sob o rigor legal do CTB, essa conduta resulta em:",
        options: [
            "Infração de natureza gravíssima, punida com multa multiplicada por três vezes e imediata suspensão do direito de dirigir.",
            "Infração grave, acarretando multa pecuniária simples e retenção do veículo para fins de vistoria mecânica.",
            "Infração média, punida com multa e pontuação administrativa no prontuário do condutor habilitado.",
            "Crime de trânsito inafiançável com detenção imediata e recolhimento definitivo da CNH.",
        ],
        correctIndex: 0,
        explanation: 'Passar do limite de velocidade em mais de 50% \u00E9 uma infra\u00E7\u00E3o grav\u00EDssima, que d\u00E1 multa tripla e suspens\u00E3o da carteira (direito de dirigir).',
        detailedExplanation: 'Quando voc\u00EA ultrapassa o limite de velocidade em mais de 50%, a multa \u00E9 multiplicada por tr\u00EAs, al\u00E9m de somar 7 pontos na CNH e suspens\u00E3o imediata do direito de dirigir. Isso \u00E9 super s\u00E9rio, porque dirigir muito r\u00E1pido aumenta demais o risco de acidentes, j\u00E1 que a dist\u00E2ncia para parar \u00E9 muito maior.',
        legalBase: "Art. 218, III CTB",
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "qe20",
        category: "infracoes",
        statement: "Em via urbana sem semáforo, pedestre atravessa pela faixa sinalizada; o condutor se aproxima, não reduz e passa de veículo sobre a pista de rolamento, obrigando o pedestre a se esquivar. Pelo CTB, essa conduta representa:",
        options: [
            "Infração gravíssima de trânsito, com multa e medida administrativa de remoção do veículo.",
            "Infração grave, convertível em advertência por escrito caso o pedestre saia ileso.",
            "Infração média, com multa e suspensão preventiva do direito de dirigir.",
            "Infração leve, aplicável apenas quando houver colisão com o pedestre."
        ],
        correctIndex: 0,
        explanation: 'N\u00E3o parar para o pedestre na faixa \u00E9 infra\u00E7\u00E3o grav\u00EDssima.',
        detailedExplanation: 'Quando o motorista n\u00E3o d\u00E1 passagem para o pedestre na faixa de seguran\u00E7a, ele comete uma infra\u00E7\u00E3o GRAV\u00CDSSIMA, que gera 7 pontos na CNH e multa. O pedestre \u00E9 a pessoa mais vulner\u00E1vel no tr\u00E2nsito, e a faixa \u00E9 feita pra proteger ele, ent\u00E3o o certo \u00E9 sempre parar quando ele est\u00E1 atravessando ou esperando.',
        legalBase: "Art. 214 CTB",
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "qe21",
        category: "infracoes",
        statement: "Em viagem familiar com veículo de passeio, a família pretende transportar criança de 9 anos e 1,35 m de altura no banco dianteiro. Conforme as normas atualizadas do CTB, a forma de transporte legalmente exigida é:",
        options: [
            "No banco traseiro, utilizando obrigatoriamente o cinto de segurança de três pontos ou dispositivo de retenção equivalente.",
            "No banco dianteiro, desde que o cinto de segurança seja regulado na altura máxima do ombro.",
            "No banco traseiro, sendo obrigatório o uso de assento de elevação até completar 12 anos completos.",
            "Em qualquer assento do veículo, sob supervisão direta de um adulto responsável e com cinto subabdominal.",
        ],
        correctIndex: 0,
        explanation: 'Crian\u00E7as com menos de 10 anos e que n\u00E3o t\u00EAm 1,45m devem ir no banco de tr\u00E1s com um dispositivo de reten\u00E7\u00E3o.',
        detailedExplanation: 'Se voc\u00EA colocar uma crian\u00E7a menor de 10 anos na frente, pode levar uma multa pesada e ainda perder pontos na CNH. No banco de tr\u00E1s, use sempre um dispositivo de reten\u00E7\u00E3o como cadeirinha ou assento de eleva\u00E7\u00E3o, pra proteger a crian\u00E7a do airbag em caso de batida. Essas regras foram atualizadas pela Resolu\u00E7\u00E3o CONTRAN 819/2021.',
        legalBase: "Art. 168 CTB",
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "qe22",
        category: "infracoes",
        statement: "Em via urbana com duas faixas no mesmo sentido, o condutor encontra um veículo mais lento na faixa da esquerda e transpõe para a faixa da direita a fim de ultrapassá-lo, sem que o outro veículo sinalize conversão à esquerda. Pela regra geral do Art. 29 do CTB, essa conduta é:",
        options: [
            "Infração de trânsito de natureza média, exceto se o veículo da esquerda estiver sinalizando a intenção de entrar à esquerda.",
            "Infração de natureza grave, sem qualquer hipótese de excludente de ilicitude por fluxo intenso.",
            "Perfeitamente permitida em qualquer circunstância em vias arteriais de velocidade acima de 60 km/h.",
            "Classificada como crime de trânsito de perigo abstrato, punido com suspensão da CNH.",
        ],
        correctIndex: 0,
        explanation: 'Ultrapassar pela direita \u00E9 uma infra\u00E7\u00E3o m\u00E9dia, a n\u00E3o ser que o carro da esquerda esteja sinalizando que vai virar \u00E0 esquerda.',
        detailedExplanation: 'Fazer isso \u00E9 uma infra\u00E7\u00E3o m\u00E9dia, que pode te render pontos na CNH e multa. O certo \u00E9 ultrapassar pela esquerda, a n\u00E3o ser que o carro da frente esteja indicando que vai sair da faixa.',
        legalBase: "Art. 199 CTB",
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "qe23",
        category: "infracoes",
        statement: "Durante viagem em rodovia de pista única e duplo sentido de circulação, o motorista inicia manobra de ultrapassagem sobre a linha de divisão de fluxos amarela contínua, em trecho de aclive acentuado. Sob as penalidades administrativas do CTB, essa conduta configura:",
        options: [
            "Infração gravíssima de trânsito, sujeita a multa multiplicada por cinco vezes, sem prejuízo de responsabilidade civil em caso de colisão.",
            "Infração grave, punida com multa pecuniária simples e suspensão imediata do direito de dirigir por 3 meses.",
            "Infração média, convertida automaticamente em advertência verbal se o trecho tiver boa visibilidade periférica.",
            "Crime de trânsito doloso contra a segurança viária coletiva com retenção imediata da habilitação.",
        ],
        correctIndex: 0,
        explanation: 'Ultrapassar na contram\u00E3o em linha dupla cont\u00EDnua \u00E9 uma infra\u00E7\u00E3o grav\u00EDssima que custa 5 vezes a multa normal.',
        detailedExplanation: 'Fazer ultrapassagem em lugares proibidos, como linha dupla cont\u00EDnua e aclives, \u00E9 muito arriscado. Nesses locais, a visibilidade \u00E9 ruim e pode causar acidentes graves, como colis\u00F5es frontais. Al\u00E9m da multa alta, voc\u00EA pode perder a CNH e ser suspenso de dirigir.',
        legalBase: "Art. 191 CTB",
        incidence: "altissima",
        difficulty: 3
    },
    {
        id: "qe24",
        category: "infracoes",
        statement: "Em uma fiscalização ordinária da Lei Seca realizada pela Polícia Militar, o motorista abordado nega-se expressamente a soprar o bafômetro ou realizar qualquer exame de dosagem alcoólica. Sob as regras vigentes do Art. 165-A do CTB, quais são as consequências jurídicas e administrativas imediatas?",
        options: [
            "Infração gravíssima, punida com multa multiplicada por dez vezes, suspensão do direito de dirigir por 12 meses e medida administrativa de recolhimento da CNH.",
            "Apenas lavratura de termo de ocorrência sem aplicação de multa, desde que o condutor apresente um condutor substituto sóbrio.",
            "Crime de trânsito imediato por presunção de culpa, com encaminhamento obrigatório do motorista à delegacia de polícia.",
            "Infração grave, sujeita apenas ao pagamento de multa simples administrativa e anotação de 5 pontos na carteira.",
        ],
        correctIndex: 0,
        explanation: 'Se o motorista n\u00E3o soprar o baf\u00F4metro, vai levar uma multa pesada e perder a carteira por um ano.',
        legalBase: "Art. 165-A CTB",
        detailedExplanation: 'Negar o teste do baf\u00F4metro \u00E9 como estar dirigindo b\u00EAbado: a multa \u00E9 alt\u00EDssima, dez vezes mais, e a CNH vai ser recolhida por 12 meses. Muita gente pensa que s\u00F3 de recusar n\u00E3o vai dar nada, mas a lei \u00E9 bem clara e aplica a mesma puni\u00E7\u00E3o pra evitar que motoristas embriagados escapem.',
        incidence: "altissima",
        trap: true,
        difficulty: 3
    },
    {
        id: "qe25",
        category: "infracoes",
        statement: "Um motorista é parado em fiscalização viária rotineira e o agente constata que a CNH física ou digital do condutor encontra-se com o exame de aptidão física vencido há quarenta dias civis. Pelas regras administrativas contidas no CTB, essa situação configura:",
        options: [
            "Infração de natureza gravíssima, sujeita a multa pecuniária administrativa e medida administrativa de recolhimento da CNH e retenção do veículo.",
            "Infração grave, permitindo o tráfego regular por até noventa dias adicionais se o condutor comprovar agendamento médico.",
            "Infração média, punida apenas com multa e pontuação, sem previsão de retenção ou recolhimento de documentos.",
            "Conduta atípica sob o ponto de vista das infrações de trânsito, gerando apenas notificação pedagógica escrita.",
        ],
        correctIndex: 0,
        explanation: 'Dirigir com a CNH vencida h\u00E1 mais de 30 dias \u00E9 uma infra\u00E7\u00E3o grav\u00EDssima, com multa e o carro pode ser guinchado at\u00E9 aparecer um motorista habilitado.',
        detailedExplanation: 'Se a CNH est\u00E1 vencida h\u00E1 mais de 30 dias, isso \u00E9 considerado uma infra\u00E7\u00E3o GRAV\u00CDSSIMA, resultando em 7 pontos na CNH e multa. A CNH vencida n\u00E3o serve mais como documento v\u00E1lido, e dirigir assim significa que o motorista n\u00E3o est\u00E1 comprovadamente apto a dirigir. A toler\u00E2ncia \u00E9 de 30 dias para renovar, depois disso, \u00E9 como se n\u00E3o estivesse habilitado.',
        legalBase: "Art. 162, V CTB",
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "qe26",
        category: "infracoes",
        statement: "Ao trafegar em via pública residencial durante o período noturno (às 23h30), um condutor aciona o dispositivo de buzina de forma prolongada e sucessiva para chamar um morador. De acordo com as normas de conduta e penalidades previstas no CTB, tal prática configura:",
        options: [
            "Infração de natureza leve, punida com multa e pontuação administrativa no prontuário do condutor.",
            "Infração de natureza média, classificada como poluição sonora urbana inafiançável.",
            "Conduta plenamente permitida, visto que o motorista estava em velocidade abaixo de 20 km/h.",
            "Infração grave, sujeita a medida administrativa de recolhimento do veículo ao pátio do DETRAN.",
        ],
        correctIndex: 0,
        explanation: 'Buzinar de forma prolongada ou sucessiva \u00E0 noite \u00E9 infra\u00E7\u00E3o leve (Art. 227 do CTB).',
        detailedExplanation: 'Usar a buzina em excesso ou fora do hor\u00E1rio permitido (22h \u00E0s 6h) pode causar polui\u00E7\u00E3o sonora e perturbar a paz. Isso resulta em 3 pontos na CNH e multa, j\u00E1 que a buzina deve ser usada s\u00F3 para avisar sobre perigo.',
        legalBase: "Art. 227 CTB",
        incidence: "media",
        difficulty: 3
    },
    {
        id: "qe27",
        category: "direcao-defensiva",
        statement: "O conceito técnico e prático de Direção Defensiva fundamenta-se em atitudes preventivas adotadas pelo motorista ao volante. Dentre as alternativas apresentadas, assinale a opção que define corretamente o objetivo primordial da direção defensiva:",
        options: [
            "Conduzir de forma a evitar acidentes de trânsito a despeito das ações incorretas dos outros usuários e das condições adversas da via.",
            "Garantir a máxima velocidade linear permitida para agilizar o fluxo viário urbano e diminuir engarrafamentos.",
            "Desenvolver técnicas de controle de derrapagens em altas velocidades para contornar curvas de forma desportiva.",
            "Transferir a responsabilidade civil da segurança do tráfego exclusivamente para os pedestres e ciclistas da via pública.",
        ],
        correctIndex: 0,
        explanation: 'Dire\u00E7\u00E3o defensiva \u00E9 dirigir de forma a evitar acidentes, mesmo com erros dos outros e condi\u00E7\u00F5es ruins na pista.',
        detailedExplanation: 'Dire\u00E7\u00E3o defensiva envolve t\u00E9cnicas que ajudam o motorista a se proteger e proteger os outros, mesmo quando o clima t\u00E1 ruim ou algu\u00E9m faz besteira. O foco n\u00E3o \u00E9 chegar r\u00E1pido, mas sim garantir a seguran\u00E7a de todos na estrada.',
        incidence: "altissima",
        difficulty: 3
    },
    {
        id: "qe28",
        category: "direcao-defensiva",
        statement: "As condições adversas representam fatores de risco que podem interferir diretamente na segurança da dirigibilidade. Constitui exemplo típico de condição adversa relacionada especificamente ao fator 'Luz':",
        options: [
            "O fenômeno do ofuscamento ocular provocado pela luz alta em sentido oposto ou o penumbra na transição dia-noite.",
            "A ocorrência de aquaplanagem devido ao acúmulo de águas pluviais sobre a pista de rolamento.",
            "O desgaste acentuado das bandas de rodagem dos pneus dianteiros do veículo automotor.",
            "A fadiga física ou o estresse mental decorrentes de jornadas prolongadas de trabalho ao volante.",
        ],
        correctIndex: 0,
        explanation: 'Condi\u00E7\u00F5es adversas de luz s\u00E3o quando a ilumina\u00E7\u00E3o t\u00E1 ruim, seja por falta ou excesso, como farol alto ou sol forte.',
        detailedExplanation: 'Essas condi\u00E7\u00F5es incluem coisas que atrapalham a vis\u00E3o, como sol baixo que ofusca, far\u00F3is altos de carros vindo na dire\u00E7\u00E3o contr\u00E1ria, penumbra ao escurecer, neblina e chuva forte. Cada situa\u00E7\u00E3o pede uma a\u00E7\u00E3o diferente, como olhar pra beirada da pista quando t\u00E1 ofuscado ou usar far\u00F3is baixos quando necess\u00E1rio.',
        incidence: "alta",
        trap: true,
        difficulty: 3
    },
    {
        id: "qe29",
        category: "direcao-defensiva",
        statement: "Para realizar uma manobra segura de ultrapassagem em via de mão única e pista dupla de circulação rápida, o condutor defensivo deve prioritariamente adotar o seguinte procedimento técnico sequencial:",
        options: [
            "Verificar os retrovisores e ponto cego, sinalizar com antecedência a intenção de mudança de faixa, acelerar de forma segura e retornar à faixa de origem após ver o veículo ultrapassado no retrovisor interno.",
            "Acionar a luz alta de alerta e efetuar a manobra o mais rápido possível rente ao para-choque traseiro do veículo da frente.",
            "Buzinar continuamente para forçar o condutor do veículo lento a desviar para o acostamento à direita da pista.",
            "Mudar brusca e rapidamente de faixa para surpreender os motoristas que trafegam na faixa adjacente esquerda.",
        ],
        correctIndex: 0,
        explanation: 'Pra ultrapassar com seguran\u00E7a, \u00E9 preciso olhar os retrovisores e o ponto cego, sinalizar antes e voltar pra faixa certa depois de ver o carro que passou no retrovisor.',
        detailedExplanation: 'A manobra de ultrapassagem tem passos importantes: 1) sinalizar pra esquerda com a seta; 2) checar retrovisores e o ponto cego; 3) mudar pra faixa da esquerda; 4) acelerar e ultrapassar; 5) sinalizar pra direita; 6) voltar pra faixa original s\u00F3 quando o carro ultrapassado aparecer no retrovisor. Ignorar qualquer passo pode causar acidente.',
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "qe30",
        category: "direcao-defensiva",
        statement: "Sob forte chuva torrencial, um condutor perde repentinamente o controle direcional do veículo ao passar por um trecho reto e plano com acúmulo de água na pista. Esse fenômeno físico, denominado aquaplanagem (ou hidroplanagem), ocorre pela combinação de:",
        options: [
            "Alta velocidade do veículo, película de água acumulada sobre a pista e pneus com desgaste severo (profundidade de sulco abaixo de 1,6 mm).",
            "Redução da pressão interna do fluido de freios hidráulicos sob temperaturas ambientes baixas.",
            "Excesso de peso de carga estática concentrada na extremidade do porta-malas traseiro do veículo.",
            "Bloqueio mecânico completo das pinças dos discos de freio decorrente de detritos pluviais na via.",
        ],
        correctIndex: 0,
        explanation: 'A aquaplanagem acontece quando os pneus perdem a ader\u00EAncia na \u00E1gua da pista, principalmente se voc\u00EA estiver r\u00E1pido e com pneus ruins.',
        detailedExplanation: 'Esse fen\u00F4meno rola quando a \u00E1gua se acumula entre o pneu e o asfalto, tirando o contato. Os principais vil\u00F5es s\u00E3o a velocidade alta em po\u00E7as, pneus muito gastos (menos de 1,6 mm) e calibragem errada. Isso faz voc\u00EA perder o controle do carro e n\u00E3o consegue frear direito.',
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "qe31",
        category: "direcao-defensiva",
        statement: "Ao transitar por uma rodovia pavimentada sob chuva leve, o condutor sente a direção do veículo ficar extremamente leve e percebe a ocorrência do fenômeno da aquaplanagem. Sob a ótica do controle veicular defensivo, qual a conduta imediata recomendada?",
        options: [
            "Segurar o volante firmemente na direção de deslocamento, retirar gradualmente o pé do acelerador e evitar frear ou fazer manobras bruscas.",
            "Pisar com força e de forma contínua no pedal de freio de serviço para travar as rodas e buscar atrito com o asfalto.",
            "Girar o volante bruscamente de um lado para o outro para expulsar a água acumulada sob a banda de rodagem do pneu.",
            "Engatar imediatamente uma marcha reduzida de giro alto para forçar o veículo a recuperar aderência mecânica por tração.",
        ],
        correctIndex: 0,
        explanation: 'Quando o carro come\u00E7a a aquaplanar, \u00E9 hora de desacelerar e segurar bem o volante. Frear ou virar r\u00E1pido pode fazer o carro derrapar.',
        detailedExplanation: 'Se voc\u00EA perceber que est\u00E1 aquaplanando, n\u00E3o entre em p\u00E2nico. Primeiro, tire o p\u00E9 do acelerador. Depois, mantenha o volante firme e reto. Evite frear ou fazer manobras bruscas, pois isso pode causar perda total de controle. Se o carro tiver freios ABS, voc\u00EA pode frear levemente se os pneus voltarem a tocar o ch\u00E3o.',
        incidence: "altissima",
        difficulty: 3
    },
    {
        id: "qe32",
        category: "direcao-defensiva",
        statement: "Durante uma viagem de longa duração em período noturno, o condutor percebe sintomas severos de fadiga, pálpebras pesadas e lapsos momentâneos de atenção. De acordo com as diretrizes de segurança no trânsito, a conduta correta a ser adotada é:",
        options: [
            "Buscar imediatamente um local seguro de parada para descansar e dormir o tempo necessário, prosseguindo apenas após recuperar o estado de alerta.",
            "Aumentar a velocidade de circulação para diminuir o tempo restante de percurso e chegar mais rápido ao destino.",
            "Ligar o sistema de ar condicionado na temperatura máxima e abrir as janelas laterais para manter o foco ativo por choque térmico.",
            "Ingerir doses concentradas de cafeína ou bebidas estimulantes energéticas e continuar a condução ininterrupta.",
        ],
        correctIndex: 0,
        explanation: 'A melhor sa\u00EDda quando bate o sono \u00E9 parar o carro em um lugar seguro e descansar.',
        detailedExplanation: 'Dirigir cansado \u00E9 muito arriscado, pois pode fazer voc\u00EA perder a aten\u00E7\u00E3o e ter rea\u00E7\u00F5es lentas. N\u00E3o adianta tomar caf\u00E9 ou ouvir m\u00FAsica alta, o que vale mesmo \u00E9 dar uma pausa e dormir um pouco. Parar em um posto ou \u00E1rea de descanso \u00E9 a jogada certa antes de continuar a viagem.',
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "qe33",
        category: "direcao-defensiva",
        statement: "O alinhamento correto dos espelhos retrovisores é indispensável para mitigar áreas cegas de visão ao redor do automóvel. A área externa ao veículo cuja visibilidade não é captada pelos retrovisores internos e externos convencionais denomina-se:",
        options: [
            "Ponto cego do veículo, exigindo que o condutor faça uma rápida verificação visual lateral antes de mudar de faixa.",
            "Zona de refração óptica difusa, impossível de ser minimizada por qualquer tipo de espelho ou regulagem de banco.",
            "Área de convergência periférica posterior, coberta exclusivamente pelo sensor de estacionamento eletrônico.",
            "Ponto de fuga horizontal, visível apenas com o veículo trafegando em marcha ré.",
        ],
        correctIndex: 0,
        explanation: 'O ponto cego \u00E9 a \u00E1rea que n\u00E3o aparece nos espelhos, ent\u00E3o \u00E9 preciso olhar pra lado antes de mudar de faixa.',
        detailedExplanation: 'O ponto cego fica nas laterais e atr\u00E1s do carro, onde os espelhos n\u00E3o conseguem ver, mesmo ajustados. \u00C9 importante sempre VIRAR A CABE\u00C7A e olhar por cima do ombro antes de mudar de faixa ou fazer uma curva, pra garantir que n\u00E3o tem carro ali. Alguns carros novos t\u00EAm sensores que ajudam, mas nunca substituem olhar de verdade.',
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "qe34",
        category: "direcao-defensiva",
        statement: "Ao transitar por uma rodovia de pista única em período noturno, desprovida de qualquer iluminação pública ou sinalização refletiva de solo, qual o dispositivo de iluminação que o condutor deve utilizar prioritariamente na condução do veículo?",
        options: [
            "Luz alta (farol alto), exceto ao se aproximar de veículo em sentido oposto ou ao seguir imediatamente atrás de outro veículo.",
            "Luz de posição (faroletes) associada às luzes de neblina dianteiras para economizar bateria.",
            "Luz baixa (farol baixo) de forma fixa e contínua sob qualquer hipótese viária para evitar multas de trânsito.",
            "Farol alto permanentemente ativo, mesmo cruzando com outros fluxos, para garantir visibilidade máxima de longa distância.",
        ],
        correctIndex: 0,
        explanation: 'Em estrada sem luz, use farol alto, mas diminua ao encontrar outro carro ou seguir um logo atr\u00E1s.',
        detailedExplanation: 'Em rodovias escuras, o farol ALTO ajuda a ver melhor. Mas, quando voc\u00EA v\u00EA outro carro vindo ou est\u00E1 colado em um, troque pro farol BAIXO pra n\u00E3o cegar o motorista do outro lado \u2014 isso evita acidentes s\u00E9rios. O mesmo vale se voc\u00EA estiver atr\u00E1s de outro carro: use farol baixo pra n\u00E3o atrapalhar a vis\u00E3o dele.',
        legalBase: "Art. 40 CTB",
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "qe35",
        category: "direcao-defensiva",
        statement: "O tráfego de veículos no interior de túneis requer cuidados especiais de visibilidade e sinalização. De acordo com as disposições expressas do Código de Trânsito Brasileiro, ao ingressar em um túnel provido de iluminação pública, o condutor deve:",
        options: [
            "Manter acesos os faróis do veículo, utilizando a luz baixa (farol baixo), mesmo durante o dia.",
            "Acionar os faróis de milha de longo alcance associados à luz alta para alertar pedestres internos.",
            "Manter apenas as luzes de posição (faroletes) ativas e ligar o pisca-alerta do veículo em movimento.",
            "Desligar qualquer dispositivo de iluminação para evitar reflexos ofuscantes nas paredes internas do túnel.",
        ],
        correctIndex: 0,
        explanation: 'Tem que deixar os far\u00F3is acesos, usando a luz baixa, quando entrar em um t\u00FAnel com luz. Isso \u00E9 pra todo mundo se ver melhor.',
        detailedExplanation: 'Nos t\u00FAneis, o farol BAIXO tem que estar ligado sempre, at\u00E9 de dia. Isso ajuda os outros motoristas a te verem e ilumina a pista. O farol alto n\u00E3o \u00E9 bom porque pode ofuscar a vis\u00E3o de todo mundo, e o pisca-alerta s\u00F3 \u00E9 pra emerg\u00EAncias.',
        legalBase: "Art. 40 CTB",
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "qe36",
        category: "direcao-defensiva",
        statement: "A distância de parada de um veículo é composta pela soma da distância de reação e da distância de frenagem. Sobre os fatores físicos que influenciam diretamente o aumento da distância de frenagem do automóvel, assinale a afirmativa correta:",
        options: [
            "O aumento da velocidade de deslocamento, a presença de pista molhada ou escorregadia e pneus com banda de rodagem desgastada.",
            "O tempo de reação do condutor ao perceber o perigo à sua frente até o acionamento mecânico do pedal.",
            "A rigidez torcional do monobloco do chassi e a utilização de fluido de freio sintético de alta especificação.",
            "A diminuição da declividade da via (declives) ou subidas íngremes de serras pavimentadas.",
        ],
        correctIndex: 0,
        explanation: 'A dist\u00E2ncia de frenagem aumenta com a velocidade, pista molhada e pneus ruins.',
        detailedExplanation: 'Quando voc\u00EA acelera, precisa de mais espa\u00E7o pra parar. Se a pista t\u00E1 molhada, os pneus escorregam mais e, se eles est\u00E3o gastos, a ader\u00EAncia vai embora. Isso tudo faz o carro demorar mais pra parar.',
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "qe37",
        category: "primeiros-socorros",
        statement: "No contexto do suporte básico de vida e dos primeiros socorros em acidentes automobilísticos de trânsito, a aplicação da sigla prática de procedimento 'PAS' estabelece a seguinte sequência de prioridades de atendimento:",
        options: [
            "Prevenir o local do sinistro (sinalização), Chamar/Acionar socorro profissional e Socorrer as vítimas conforme gravidade.",
            "Prestar atendimento imediato na pista, Afastar curiosos do local e Sinalizar a rodovia após a remoção das vítimas.",
            "Parar o próprio veículo na faixa de rolamento, Ajudar na remoção física dos veículos e Salvar pertences pessoais das vítimas.",
            "Procurar testemunhas oculares do acidente, Avaliar lesões internas e Sinalizar com galhos secos sobre a faixa de rolamento.",
        ],
        correctIndex: 0,
        explanation: 'A sigla PAS ajuda a lembrar o que fazer em acidentes: Prevenir (sinalizar), Avisar (chamar socorro) e Socorrer (atender as v\u00EDtimas).',
        detailedExplanation: 'Quando chega em um acidente, primeiro voc\u00EA deve PROTEGER o local com sinaliza\u00E7\u00E3o, avisar as autoridades pelo telefone e, se souber, SOCORRER as v\u00EDtimas. Essa ordem \u00E9 importante pra evitar mais problemas e garantir a seguran\u00E7a de todos.',
        incidence: "altissima",
        difficulty: 3
    },
    {
        id: "qe38",
        category: "primeiros-socorros",
        statement: "Ao deparar-se com uma vítima de acidente de trânsito que apresenta hemorragia externa abundante em um dos membros inferiores, qual o procedimento inicial correto de primeiros socorros a ser realizado pelo socorrista leigo?",
        options: [
            "Efetuar compressão direta e firme sobre a lesão sangrante utilizando um pano limpo ou gaze esterilizada.",
            "Aplicar um torniquete rígido apertado com arame ou corda logo acima da lesão para interromper o fluxo total.",
            "Jogar água oxigenada ou álcool concentrado sobre o ferimento exposto e cobrir com pó cicatrizante caseiro.",
            "Manter a vítima de pé e forçá-la a caminhar para estimular a coagulação sanguínea natural nos tecidos.",
        ],
        correctIndex: 0,
        explanation: 'Colocar um pano limpo ou gaze e apertar bem na ferida \u00E9 o jeito certo de parar o sangramento.',
        detailedExplanation: 'Quando algu\u00E9m sangra muito, a primeira coisa a fazer \u00E9 apertar a ferida com um pano limpo ou gaze. Isso ajuda a diminuir o sangramento e a ferida a cicatrizar. Usar torniquete s\u00F3 \u00E9 pra casos extremos, porque pode machucar ainda mais a pessoa.',
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "qe39",
        category: "primeiros-socorros",
        statement: "Em um acidente de trânsito envolvendo colisão frontal, o socorrista inicial suspeita que uma das vítimas sofreu uma fratura de coluna (lesão medular). Diante dessa hipótese diagnóstica, qual a conduta correta a ser adotada até a chegada da equipe de resgate médico?",
        options: [
            "Manter a vítima perfeitamente imóvel e alinhada na posição encontrada, evitando qualquer movimentação da cabeça ou coluna.",
            "Tentar remover a vítima rapidamente do interior do veículo e forçá-la a sentar-se ereta em uma cadeira rígida.",
            "Massagear a região cervical e as costas da vítima para aliviar a contratura muscular decorrente do trauma físico.",
            "Girar o pescoço da vítima para a esquerda e direita para avaliar a mobilidade das articulações vertebrais.",
        ],
        correctIndex: 0,
        explanation: 'Se algu\u00E9m suspeita ter machucado a coluna, a pessoa deve ficar bem parada e na mesma posi\u00E7\u00E3o, pra n\u00E3o piorar a situa\u00E7\u00E3o.',
        detailedExplanation: 'Nunca mova quem pode ter machucado a coluna. Qualquer movimento pode agravar a les\u00E3o e causar paralisia. A pessoa precisa ficar im\u00F3vel at\u00E9 o socorro chegar, que tem os equipamentos certos. S\u00F3 mova se houver perigo imediato, como fogo ou \u00E1gua, e sempre com cuidado de tr\u00EAs pessoas.',
        incidence: "altissima",
        trap: true,
        difficulty: 3
    },
    {
        id: "qe40",
        category: "primeiros-socorros",
        statement: "Durante o atendimento emergencial a um acidente de trânsito com vítimas graves presas nas ferragens, o socorrista deve acionar os órgãos competentes. Assinale a alternativa que apresenta corretamente o número telefônico e o órgão responsável pelo serviço médico de urgência:",
        options: [
            "192 para acionar o Serviço de Atendimento Móvel de Urgência (SAMU).",
            "193 para acionar a Polícia Rodoviária Federal (PRF).",
            "190 para acionar o Corpo de Bombeiros Militar do Estado correspondente.",
            "191 para acionar a Defesa Civil do Município da ocorrência do sinistro.",
        ],
        correctIndex: 0,
        explanation: 'O n\u00FAmero do SAMU \u00E9 192. O 193 \u00E9 dos Bombeiros e o 190 \u00E9 da Pol\u00EDcia Militar.',
        detailedExplanation: 'Saber os n\u00FAmeros de emerg\u00EAncia \u00E9 super importante pra agir r\u00E1pido em acidentes. O SAMU (192) cuida das emerg\u00EAncias m\u00E9dicas, enquanto o Corpo de Bombeiros (193) ajuda em inc\u00EAndios e resgates. A Pol\u00EDcia Militar (190) entra em cena quando tem crime ou confus\u00E3o.',
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "qe41",
        category: "primeiros-socorros",
        statement: "O condutor sinaliza sinistro em rodovia de pista simples com velocidade regulamentar de 80 km/h, em dia claro e ensolarado, sem chuva ou neblina. Pela regra de distância do triângulo de segurança, a posição correta é:",
        options: [
            "No mínimo 80 passos longos de um adulto, contados a partir da traseira do veículo, dobrando o valor se houver chuva, neblina ou curva no trajeto.",
            "Exatos 30 metros de distância linear independente das condições climáticas locais.",
            "No acostamento a apenas 10 metros de distância do veículo acidentado.",
            "Apenas 5 passos curtos da traseira do veículo, ativando as luzes do pisca-alerta simultaneamente.",
        ],
        correctIndex: 0,
        explanation: 'Voc\u00EA deve contar 80 passos longos do carro, j\u00E1 que a via \u00E9 de 80 km/h. Se tiver chuva, neblina ou curva, \u00E9 o dobro.',
        detailedExplanation: 'O tri\u00E2ngulo de sinaliza\u00E7\u00E3o precisa ficar pelo menos 30 metros atr\u00E1s do carro, na mesma faixa. Isso ajuda quem vem atr\u00E1s a ver e desacelerar a tempo. Em rodovias r\u00E1pidas, \u00E9 melhor colocar ainda mais longe, entre 50 e 100 metros, para evitar acidentes.',
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "qe42",
        category: "primeiros-socorros",
        statement: "Ao prestar socorro a uma vítima com queimaduras de segundo grau nos braços provocadas por explosão de radiador, qual o procedimento imediato de primeiros socorros adequado a ser executado no local?",
        options: [
            "Resfriar o local afetado com água limpa corrente em temperatura ambiente e cobrir suavemente com um pano úmido e limpo.",
            "Aplicar pomada de uso dermatológico ou manteiga caseira sobre a ferida para aliviar a ardência local.",
            "Romper as bolhas de queimadura formadas para acelerar a drenagem de líquidos teciduais.",
            "Enfaixar o braço de forma apertada com atadura de algodão seca para evitar contato com o ar.",
        ],
        correctIndex: 0,
        explanation: 'Para queimaduras, resfrie com \u00E1gua limpa e cubra com pano \u00FAmido. N\u00E3o use rem\u00E9dios caseiros.',
        detailedExplanation: 'O ideal \u00E9 deixar a \u00E1gua CORRENTE em temperatura ambiente na queimadura por uns 10 a 15 minutos, aliviando a dor e evitando mais danos. Evite usar qualquer coisa caseira, como pasta de dente ou manteiga, pois isso s\u00F3 piora a situa\u00E7\u00E3o e pode causar infec\u00E7\u00E3o. E n\u00E3o estoure as bolhas, elas protegem a pele.',
        incidence: "media",
        difficulty: 3
    },
    {
        id: "qe43",
        category: "primeiros-socorros",
        statement: "Uma vítima de acidente de trânsito está consciente, porém apresenta sinais evidentes de estado de choque: palidez extrema, pele fria e pegajosa, pulsação rápida e respiração superficial. Qual o procedimento inicial correto a ser executado?",
        options: [
            "Manter a vítima deitada em local plano, afrouxar suas roupas e, se possível, elevar seus membros inferiores em cerca de 30 centímetros.",
            "Forçar a vítima a sentar-se e ingerir água bem gelada ou café bem forte para reestabelecer a pressão arterial.",
            "Realizar massagem cardíaca vigorosa de forma contínua mesmo com a vítima consciente e respirando.",
            "Cobrir a vítima com mantas pesadas e abafá-la completamente para induzir o suor excessivo.",
        ],
        correctIndex: 0,
        explanation: 'Quando a pessoa t\u00E1 em choque, o ideal \u00E9 deix\u00E1-la deitada, afrouxar as roupas e elevar as pernas pra ajudar o sangue a circular melhor.',
        detailedExplanation: 'O choque acontece quando o corpo n\u00E3o consegue mandar sangue e oxig\u00EAnio pros \u00F3rg\u00E3os, geralmente por causa de hemorragia ou desidrata\u00E7\u00E3o. \u00C9 importante manter a v\u00EDtima deitada com as pernas levantadas uns 30 cm, cobrir pra n\u00E3o esfriar e n\u00E3o dar nada pra comer ou beber, porque ela pode precisar de cirurgia. Falar de forma calma ajuda a tranquilizar at\u00E9 a ajuda chegar.',
        incidence: "media",
        difficulty: 3
    },
    {
        id: "qe44",
        category: "meio-ambiente",
        statement: "Motoristas urbanos expostos ao tráfego intenso relatam tonturas em congestionamentos com veículos antigos. O gás emitido pela combustão incompleta, incolor e inodoro, que se liga à hemoglobina e compromete a oxigenação do sangue, é:",
        options: [
            "O Monóxido de Carbono (CO), gás liberado pela combustão incompleta que se liga à hemoglobina do sangue e impede a oxigenação adequada do corpo humano.",
            "O Dióxido de Carbono (CO2), gás naturalmente presente na atmosfera e principal responsável pela intensificação do efeito estufa global.",
            "O Dióxido de Enxofre (SO2), gás de odor forte e irritante que contribui para a formação da chuva ácida em regiões industrializadas.",
            "O Clorofluorcarboneto (CFC), composto químico utilizado em sistemas de refrigeração que contribui para a destruição da camada de ozônio.",
        ],
        correctIndex: 0,
        explanation: 'O Mon\u00F3xido de Carbono (CO) gruda no sangue e atrapalha a respira\u00E7\u00E3o, podendo causar asfixia e at\u00E9 morte.',
        detailedExplanation: 'Os motores a combust\u00E3o queimam combust\u00EDvel e soltam v\u00E1rios gases, incluindo o mon\u00F3xido de carbono, que \u00E9 bem perigoso e n\u00E3o tem cheiro. Manter o carro em dia ajuda a diminuir a polui\u00E7\u00E3o e faz bem pra sa\u00FAde.',
        incidence: "media",
        difficulty: 3
    },
    {
        id: "qe45",
        category: "meio-ambiente",
        statement: "Em trajeto urbano com congestionamentos, o condutor quer reduzir consumo e poluentes sem alterar a manutenção do veículo. Entre as condutas de direção, a que efetivamente contribui para a redução das emissões é:",
        options: [
            "Manter a aceleração constante, evitar frenagens ou arrancadas bruscas e planejar as trocas de marchas na faixa adequada de rotação do motor.",
            "Acelerar o motor vigorosamente em ponto morto antes de desligar o veículo para queimar resíduos.",
            "Utilizar marchas altas em baixas velocidades forçando o motor a trabalhar abaixo da rotação mínima de serviço.",
            "Desligar o motor em descidas longas (banguela) confiando exclusivamente no sistema de freios de estacionamento.",
        ],
        correctIndex: 0,
        explanation: 'Dirigir devagar e com calma ajuda a gastar menos combust\u00EDvel e poluir menos.',
        detailedExplanation: 'Quando voc\u00EA troca marcha na hora certa e evita acelerar ou frear de uma vez, o carro usa menos combust\u00EDvel. Isso significa que voc\u00EA tamb\u00E9m solta menos polui\u00E7\u00E3o no ar. Al\u00E9m de fazer bem pro planeta, isso ainda economiza grana com gasolina e manuten\u00E7\u00E3o.',
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "qe46",
        category: "meio-ambiente",
        statement: "Em rodovia estadual de pista dupla, passageiro arremessa lata de alumínio pela janela lateral do veículo em movimento e o resíduo cai no acostamento. Pelo regramento de posturas ambientais do CTB, essa conduta constitui:",
        options: [
            "Infração de trânsito de natureza média, sujeita a multa administrativa de responsabilidade do condutor.",
            "Infração leve de responsabilidade exclusiva do passageiro que efetuou o arremesso físico.",
            "Infração grave, punida com suspensão imediata da licença de tráfego anual do veículo.",
            "Conduta permitida pela lei de trânsito desde que a via seja de pista simples e sem acostamento pavimentado.",
        ],
        correctIndex: 0,
        explanation: 'Jogar lixo pela janela \u00E9 uma infra\u00E7\u00E3o m\u00E9dia de tr\u00E2nsito (Art. 172 do CTB).',
        detailedExplanation: 'Quando voc\u00EA joga algo pela janela, pode levar multa e 4 pontos na CNH. Al\u00E9m disso, isso \u00E9 crime ambiental e pode causar acidentes, como um motociclista perdendo o controle por causa de um objeto na pista.',
        legalBase: "Art. 172 CTB",
        incidence: "media",
        difficulty: 3
    },
    {
        id: "qe47",
        category: "meio-ambiente",
        statement: "Em via residencial à noite, buzinas desreguladas e alarmes automotivos disparados repetidamente perturbam o descanso da população. A norma de trânsito enquadra essa conduta como infração que afeta principalmente:",
        options: [
            "Infração de trânsito que gera estresse e perturbação do sossego público, enquadrando-se como poluição sonora e de convivência social.",
            "Crime ambiental com detenção incondicional do motorista em regime fechado.",
            "Mera conduta de convivência, sem previsão de sanções pecuniárias ou aplicação de pontos na CNH.",
            "Infração média, punida exclusivamente com a apreensão imediata de todo o sistema de som do veículo.",
        ],
        correctIndex: 0,
        explanation: 'Buzinas e alarmes barulhentos s\u00E3o infra\u00E7\u00F5es que atrapalham a paz da galera e podem ser leves ou m\u00E9dias. ',
        detailedExplanation: 'Quando a buzina toca demais, isso gera POLUI\u00C7\u00C3O SONORA, que \u00E9 um problema reconhecido pela lei. Esse barulho pode deixar a gente estressado, irritado e at\u00E9 causar problemas de sa\u00FAde, por isso o CTB diz que s\u00F3 podemos usar a buzina em situa\u00E7\u00F5es de perigo e pro\u00EDbe o uso em lugares como hospitais e escolas, principalmente \u00E0 noite.',
        incidence: "media",
        difficulty: 3
    },
    {
        id: "qe48",
        category: "meio-ambiente",
        statement: "Em via urbana com ciclistas trafegando pelo bordo da pista e pedestres na calçada, um condutor exige preferência absoluta sobre os usuários mais vulneráveis. Sobre as premissas de condutor cidadão do CTB, é correto:",
        options: [
            "Priorizar sempre a integridade física dos pedestres e dos veículos não motorizados, agindo com cortesia e tolerância perante erros alheios.",
            "Exigir preferência de passagem sobre veículos menores de carga devido ao maior porte nominal do seu carro de passeio.",
            "Ignorar ciclistas trafegando pelas bordas da via urbana caso não exista ciclovia segregada.",
            "Utilizar a buzina de forma contínua para apressar pedestres idosos que realizam travessia lenta sobre a faixa de segurança.",
        ],
        correctIndex: 0,
        explanation: 'Sempre colocar a seguran\u00E7a dos pedestres e ciclistas em primeiro lugar \u00E9 essencial. Isso mostra respeito no tr\u00E2nsito.',
        detailedExplanation: 'Cidadania no tr\u00E2nsito \u00E9 sobre todos se respeitarem, seja motorista, ciclista ou pedestre. Cada um tem que cuidar do outro, evitando pressa e buzinas desnecess\u00E1rias. Um tr\u00E2nsito tranquilo depende de cada um fazer sua parte e proteger a todos.',
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "qe49",
        category: "mecanica",
        statement: "Após longa viagem em rodovia, o condutor percebe a luz de pressão de óleo acender e apagar no painel, e a vareta acusa nível marcadamente abaixo do mínimo. A circulação do motor nesse estado severo provoca:",
        options: [
            "O superaquecimento excessivo das peças por atrito mecânico, podendo levar à fusão de componentes ('fundir o motor') e quebra estrutural do bloco.",
            "O aumento imediato do consumo de combustível sem qualquer risco de dano mecânico ao bloco do cabeçote.",
            "A diminuição drástica do desgaste das velas de ignição e bobinas elétricas de alta tensão.",
            "O travamento automático das pastilhas de freio do eixo traseiro por falta de pressão hidráulica auxiliar.",
        ],
        correctIndex: 0,
        explanation: 'Sem \u00F3leo, as pe\u00E7as do motor esfriam mal e se esfregam demais, podendo derreter tudo.',
        detailedExplanation: 'O \u00F3leo \u00E9 o que mant\u00E9m as partes do motor funcionando direitinho, evitando que elas se desgastem e esquentem demais. Se o n\u00EDvel de \u00F3leo estiver baixo, o motor n\u00E3o se lubrifica bem, o que pode causar superaquecimento e at\u00E9 fundir o motor. \u00C9 f\u00E1cil evitar isso: s\u00F3 checar o n\u00EDvel de \u00F3leo de vez em quando!',
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "qe50",
        category: "mecanica",
        statement: "Em fiscalização durante chuva em rodovia, constata-se que os sulcos da banda de rodagem dos pneus estão abaixo do limite legal (pneus 'carecas'). Os riscos decorrentes dessa condição para a segurança viária incluem:",
        options: [
            "Perda de aderência em asfalto molhado facilitando a aquaplanagem, aumento drástico da distância de frenagem e risco de estouro do pneu por fadiga estrutural.",
            "Redução do consumo de combustível devido à maior aderência do composto de borracha em curvas fechadas.",
            "Bloqueio espontâneo das rodas dianteiras por fadiga térmica do sistema de suspensão ativa.",
            "Desalinhamento instantâneo do sistema de direção hidráulica devido à menor área de atrito de rolamento.",
        ],
        correctIndex: 0,
        explanation: 'Pneus carecas (com menos de 1,6 mm) n\u00E3o conseguem drenar \u00E1gua e grudam menos no ch\u00E3o, aumentando o risco de aquaplanagem e acidentes.',
        detailedExplanation: 'Quando o pneu t\u00E1 careca, ele n\u00E3o consegue escoar a \u00E1gua na pista molhada. Isso faz com que o carro perca a ader\u00EAncia e deslize, principalmente em curvas e frenagens. Usar pneu careca \u00E9 uma infra\u00E7\u00E3o GRAVE e pode colocar todo mundo em perigo.',
        incidence: "altissima",
        difficulty: 3
    },
    {
        id: "qe51",
        category: "mecanica",
        statement: "Durante o tráfego em via expressa, o fluido circula continuamente entre o bloco, o cabeçote e o radiador. A função técnica primária do líquido de arrefecimento, mistura de água desmineralizada e aditivo específico, é:",
        options: [
            "Trocar calor com o motor para manter a temperatura operacional ideal de trabalho do bloco e do cabeçote.",
            "Lubrificar os cilindros e pistões internos para reduzir o atrito gerado pelas bielas.",
            "Aumentar a octanagem da mistura combustível-ar no interior das câmaras de explosão.",
            "Limpar a carbonização depositada nas válvulas de admissão e no coletor de escapamento do veículo.",
        ],
        correctIndex: 0,
        explanation: 'O sistema de arrefecimento faz o l\u00EDquido circular pelo motor e radiador pra tirar o calor que o motor gera.',
        detailedExplanation: 'O l\u00EDquido de arrefecimento, que \u00E9 a mistura de \u00E1gua e aditivo, passa pelo motor e absorve o calor, jogando esse calor fora no radiador. Ele mant\u00E9m o motor na temperatura certa, em torno de 90\u00B0C, pra evitar que ele superaque\u00E7a e estrague.',
        incidence: "media",
        difficulty: 3
    },
    {
        id: "qe52",
        category: "mecanica",
        statement: "Durante tráfego em rodovia, o condutor percebe que luz indicadora amarela/laranja permanece acesa de modo contínuo no painel, sem perda imediata de desempenho. Pelas diretrizes de manutenção preventiva, essa sinalização indica:",
        options: [
            "Uma anomalia de funcionamento que necessita de verificação técnica no sistema de injeção ou motor, sem necessidade de parada imediata no acostamento, mas com inspeção breve recomendada.",
            "Um problema crítico e de perigo iminente que exige a parada imediata do veículo na pista de rolamento por falta de pressão de óleo do motor.",
            "A ativação do modo de economia de energia por falha mecânica no alternador elétrico principal.",
            "A indicação de que o veículo entrou na reserva de fluido de freio traseiro ativa.",
        ],
        correctIndex: 0,
        explanation: 'Luz amarela acesa \u00E9 um aviso de que algo n\u00E3o t\u00E1 certo, mas d\u00E1 pra seguir at\u00E9 uma oficina (como problemas na inje\u00E7\u00E3o). Luz vermelha \u00E9 emerg\u00EAncia e pede parar na hora (como \u00F3leo ou temperatura alta).',
        detailedExplanation: 'As luzes do painel t\u00EAm cores que falam: AMARELA (ou laranja) \u00E9 ALERTA \u2014 precisa olhar logo, mas n\u00E3o precisa parar agora (ex: luz de inje\u00E7\u00E3o, pneu baixo). VERMELHA \u00E9 PERIGO \u2014 tem que parar o carro assim que der (ex: press\u00E3o do \u00F3leo, temperatura do motor). Ignorar luz amarela pode causar dor de cabe\u00E7a depois.',
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "qe53",
        category: "mecanica",
        statement: "O fluido de freio é o elemento hidráulico que transmite a força aplicada no pedal até as pinças e tambores de roda. Nos termos da manutenção preventiva do veículo, esse fluido deve ser inspecionado periodicamente e:",
        options: [
            "Substituído periodicamente conforme prazo do manual do proprietário (geralmente a cada 1 ou 2 anos ou quilometragem equivalente), devido à sua característica higroscópica (absorção de umidade).",
            "Completado semanalmente com água desmineralizada para manter o nível máximo do reservatório plástico.",
            "Substituído apenas se o condutor constatar que o pedal de freio está extremamente rígido e alto.",
            "Trocar somente quando houver mistura acidental com o óleo lubrificante da caixa de marchas.",
        ],
        correctIndex: 0,
        explanation: 'O fluido de freio pega umidade do ar, o que pode fazer o carro frear mal. Por isso, precisa ser trocado de tempos em tempos.',
        detailedExplanation: 'O fluido de freio \u00E9 HIGROSC\u00D3PICO, ou seja, ele absorve a umidade do ar. Com \u00E1gua no fluido, o ponto de ebuli\u00E7\u00E3o diminui, e se voc\u00EA frear muito, pode fazer o fluido ferver e o pedal ficar mole, sem frear direito. Por isso, \u00E9 importante trocar a cada 1 ou 2 anos, mesmo que o carro n\u00E3o rode muito.',
        incidence: "media",
        difficulty: 3
    },
    {
        id: "qe54",
        category: "mecanica",
        statement: "A calibragem adequada sustenta a dirigibilidade, o consumo energético e a vida útil da banda de rodagem. Pela técnica de manutenção de veículos, o procedimento correto de calibragem dos pneus automotores deve ocorrer:",
        options: [
            "Com os pneus frios (antes de rodar mais do que 3 km), utilizando os valores de pressão nominal recomendados pelo fabricante do veículo.",
            "Com os pneus quentes logo após longas viagens em rodovias, retirando o excesso de pressão gerado pelo calor de atrito.",
            "Utilizando sempre a pressão máxima gravada na banda lateral do pneu, independente da carga útil do automóvel.",
            "Apenas quando o condutor notar visualmente que os flancos do pneu estão encostando na banda de rodagem.",
        ],
        correctIndex: 0,
        explanation: 'Calibrar os pneus frios \u00E9 importante pra n\u00E3o errar na press\u00E3o, j\u00E1 que o calor faz o ar dentro deles se expandir.',
        detailedExplanation: 'Verifique a press\u00E3o com os pneus FRIOS, ou seja, sem ter rodado mais de 1 km ou parado por 3 horas. Quando eles esquentam, a press\u00E3o sobe e voc\u00EA pode acabar calibrando errado. Isso pode causar desgaste nos pneus, gastar mais combust\u00EDvel e prejudicar a seguran\u00E7a do carro.',
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "qe55",
        category: "prioridade",
        statement: "Ambulância, viatura policial e caminhão do Corpo de Bombeiros gozam de prerrogativas de trânsito nas vias públicas. Pela regra de prioridade do CTB, para utilizarem livre circulação, parada e estacionamento, é necessário que:",
        options: [
            "Estejam em efetiva prestação de serviço de urgência, devidamente identificados por dispositivos luminosos intermitentes vermelhos E sonoros (sirene) ligados.",
            "Trafeguem sempre pela faixa de trânsito rápido à esquerda desenvolvendo velocidade acima da média da via.",
            "Sejam de propriedade governamental do Estado, com placas de bronze exclusivas para autoridades municipais.",
            "Possuam autorização por escrito expedida pelo órgão ambiental e de trânsito estadual competentes.",
        ],
        correctIndex: 0,
        explanation: 'Ve\u00EDculos de emerg\u00EAncia precisam estar com as luzes e sirenes ligadas pra ter prioridade na rua.',
        detailedExplanation: 'Quando a ambul\u00E2ncia, a viatura ou o caminh\u00E3o do bombeiro t\u00E1 com os sinais acionados, eles t\u00EAm a prioridade total. Isso significa que podem passar por sinais vermelhos e ultrapassar outros carros, mas sempre com cuidado. Se n\u00E3o tiver com os sinais ligados, n\u00E3o t\u00EAm essa prioridade.',
        legalBase: "Art. 29, VII CTB",
        incidence: "altissima",
        difficulty: 3
    },
    {
        id: "qe56",
        category: "prioridade",
        statement: "O condutor trafega por via coletora e se aproxima de interseção sinalizada com a placa R-2 'Dê a Preferência', que indica via arterial transversal preferencial, não havendo semáforo em funcionamento. A postura regulamentar exigida é:",
        options: [
            "Reduzir a velocidade de forma segura, avaliar o fluxo e conceder a preferência de passagem aos veículos que circulam pela via preferencial.",
            "Acelerar o veículo rapidamente para cruzar a interseção antes que os outros carros alcancem o cruzamento.",
            "Buzinar de forma sucessiva para sinalizar a intenção de manter a velocidade linear original no cruzamento.",
            "Parar obrigatoriamente de forma completa o veículo mesmo que não haja qualquer tráfego na via transversal.",
        ],
        correctIndex: 0,
        explanation: 'Quando voc\u00EA v\u00EA a placa D\u00EA a Prefer\u00EAncia (R-2), \u00E9 hora de desacelerar e olhar pros lados. N\u00E3o precisa parar se a via estiver livre, mas tem que deixar passar quem j\u00E1 t\u00E1 na via preferencial.',
        detailedExplanation: 'Se voc\u00EA t\u00E1 na via secund\u00E1ria e quer entrar na via preferencial, \u00E9 preciso dar passagem pra quem j\u00E1 t\u00E1 l\u00E1. A via preferencial sempre tem prioridade, ent\u00E3o reduza a velocidade e s\u00F3 entre quando for seguro, sem apressar a passagem.',
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "qe57",
        category: "prioridade",
        statement: "Em trecho não pavimentado de via estreita com declive acentuado, dois veículos pesados se aproximam em sentidos opostos e não há espaço para passagem simultânea. Pelo CTB, a preferência de passagem pertence ao veículo que:",
        options: [
            "Estiver em aclive (subindo) a ladeira, devendo o condutor do veículo que desce dar a preferência de passagem.",
            "Trafegar no sentido de descida da ladeira, por estar desenvolvendo maior energia cinética linear.",
            "Sinalizar a intenção de manobra primeiro acionando o pisca-alerta ou buzina de forma prolongada.",
            "Apresentar menor capacidade de tração mecânica nominal ou peso bruto total inferior.",
        ],
        correctIndex: 0,
        explanation: 'Em subidas, quem est\u00E1 subindo tem prefer\u00EAncia. O carro que desce precisa dar passagem, at\u00E9 engatando a r\u00E9 se precisar.',
        detailedExplanation: 'Em ruas estreitas e \u00EDngremes, o carro que sobe sempre tem a prioridade. Isso \u00E9 por seguran\u00E7a, j\u00E1 que \u00E9 mais complicado e arriscado para quem est\u00E1 subindo dar r\u00E9 do que para quem desce. O carro que desce deve voltar at\u00E9 um lugar seguro para o carro que sobe passar.',
        legalBase: "Art. 29, III, 'e' CTB",
        incidence: "media",
        trap: true,
        difficulty: 3
    },
    {
        id: "qe58",
        category: "prioridade",
        statement: "Ao transitar em via com fluxo misto de ciclistas e pedestres, o condutor pretende ultrapassar bicicleta que trafega rente ao bordo da pista, com pedestres nas adjacências. Pela regra de conduta do CTB, a atitude correta é:",
        options: [
            "Manter a distância lateral mínima de 1,5 metros ao ultrapassar uma bicicleta e reduzir a velocidade para garantir a segurança viária.",
            "Buzinar continuamente ao lado do ciclista para alertá-lo sobre a aproximação veloz do veículo automotor.",
            "Avançar o veículo para a borda da pista para forçar a bicicleta a subir na calçada destinada exclusivamente a pedestres.",
            "Ignorar a travessia de pedestres em locais sem faixa de segurança, mantendo a velocidade máxima permitida da via.",
        ],
        correctIndex: 0,
        explanation: '\u00C9 preciso manter 1,5 metros de dist\u00E2ncia ao passar por ciclistas e reduzir a velocidade para a seguran\u00E7a deles.',
        detailedExplanation: 'Os ciclistas e pedestres s\u00E3o os mais vulner\u00E1veis no tr\u00E2nsito, ent\u00E3o a gente precisa ter aten\u00E7\u00E3o redobrada. O C\u00F3digo de Tr\u00E2nsito fala que eles t\u00EAm prioridade, especialmente os que est\u00E3o nas faixas. A vida deles vale mais do que a pressa de quem est\u00E1 dirigindo.',
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "qe59",
        category: "legislacao",
        statement: "Um condutor ignora deliberadamente a sinalização vertical de regulamentação representada pela placa R-1 ('PARADA OBRIGATÓRIA') e avança em uma interseção urbana sem parar o automóvel. De acordo com as penalidades regulamentares do CTB, tal infração classifica-se como:",
        options: [
            "Infração de natureza gravíssima, punida com multa administrativa pecuniária e acúmulo de 7 pontos na CNH.",
            "Infração grave, gerando a medida administrativa de retenção do veículo até a vistoria do agente fiscalizador.",
            "Infração média, passível de perdão automático caso o cruzamento estivesse livre de outros veículos.",
            "Crime de trânsito de lesão potencial à segurança viária coletiva, com suspensão direta da habilitação por 3 meses.",
        ],
        correctIndex: 0,
        explanation: 'Passar direto na placa de parada obrigat\u00F3ria (PARE) \u00E9 uma infra\u00E7\u00E3o grav\u00EDssima.',
        detailedExplanation: 'Quando voc\u00EA ignora a placa PARE e n\u00E3o para o carro, isso \u00E9 considerado uma infra\u00E7\u00E3o GRAV\u00CDSSIMA, que d\u00E1 7 pontos na CNH e multa. A placa pede que voc\u00EA pare totalmente, n\u00E3o s\u00F3 diminua a velocidade, e mesmo que n\u00E3o venha ningu\u00E9m, \u00E9 preciso parar e olhar antes de seguir.',
        legalBase: "Art. 208 CTB",
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "qe60",
        category: "direcao-defensiva",
        statement: "O condutor trafega em declive longo e acentuado de rodovia e precisa conter a velocidade sem provocar o superaquecimento do sistema de freios por atrito prolongado. Pela direção defensiva e pelo CTB, a conduta correta nesse declive é:",
        options: [
            "Descer com o câmbio em ponto morto, aplicando o freio de serviço esporadicamente para poupar o sistema.",
            "Descer desengrenado para economizar combustível, freando de forma intensa somente ao exceder o limite.",
            "Descer engrenado em marcha reduzida, valendo-se do freio-motor para conter a velocidade.",
            "Manter o pedal de freio pressionado durante todo o declive com marcha alta engatada."
        ],
        correctIndex: 2,
        explanation: 'Em descidas longas, \u00E9 melhor usar o freio motor (ve\u00EDculo engrenado). Se descer em ponto morto ou s\u00F3 usar o freio, pode superaquecer e falhar.',
        detailedExplanation: 'Em descidas longas, o ideal \u00E9 usar o FREIO MOTOR: coloque uma marcha reduzida e deixe o motor ajudar a controlar a velocidade. Usar o freio o tempo todo pode superaquecer e causar perda de efici\u00EAncia ou at\u00E9 falha total. Descer em ponto morto (banguela) \u00E9 PROIBIDO e tira o controle do carro.',
        legalBase: "Art. 231, IX do CTB",
        incidence: "altissima",
        trap: true,
        difficulty: 3,
        group: "freio-motor-declive"
    },
    {
        id: "qe61",
        category: "infracoes",
        statement: "O ato de transitar com o veículo automotor desligado ou desengatado (em ponto morto ou 'banguela') em declives acentuados é uma conduta insegura comum. Sob a regulamentação do Código de Trânsito Brasileiro (CTB), essa conduta constitui:",
        options: [
            "Infração de trânsito de natureza média, punida com multa e medida administrativa de retenção do veículo.",
            "Infração leve, gerando apenas aplicação de pontuação administrativa se o veículo estiver licenciado.",
            "Infração grave, gerando suspensão da validade do licenciamento do veículo por cento e vinte dias.",
            "Conduta permitida pela lei de trânsito como medida ecológica para diminuição de queima de hidrocarbonetos.",
        ],
        correctIndex: 0,
        explanation: 'Dirigir em descidas com o carro desligado ou em ponto morto \u00E9 uma infra\u00E7\u00E3o m\u00E9dia, com multa e reten\u00E7\u00E3o do ve\u00EDculo.',
        detailedExplanation: 'Quando voc\u00EA desce com o carro em \'banguela\', perde o controle e o freio motor n\u00E3o ajuda. Isso pode fazer o carro esquentar e falhar, deixando tudo mais perigoso, especialmente em curvas. Sempre mantenha a marcha engatada enquanto dirige.',
        legalBase: "Art. 231, IX do CTB",
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "qe62",
        category: "legislacao",
        statement: "Durante o período de validade probatória de 12 meses da Permissão para Dirigir (PPD), o condutor novato comete uma infração de trânsito de natureza gravíssima. Conforme a regra de concessão de CNH definitiva contida no CTB, o resultado legal desse ato é:",
        options: [
            "A perda do processo de habilitação, sendo o condutor obrigado a reiniciar todas as etapas e exames de trânsito do zero.",
            "A conversão da multa em advertência verbal pedagógica com permissão de nova chance caso pague o valor com desconto.",
            "O desconto simples na pontuação de habilitação definitiva para CNH caso ele realize um curso de reciclagem rápido.",
            "A suspensão temporária do direito de dirigir por sessenta dias contados a partir da notificação administrativa.",
        ],
        correctIndex: 0,
        explanation: 'Se o motorista novato fizer uma infra\u00E7\u00E3o grav\u00EDssima, ele perde a PPD e tem que come\u00E7ar tudo de novo.',
        detailedExplanation: 'Durante a Permiss\u00E3o para Dirigir (PPD), se o condutor comete uma infra\u00E7\u00E3o grav\u00EDssima, ele n\u00E3o pode mais tirar a CNH definitiva. Isso significa que ele vai ter que refazer todas as etapas, desde as aulas at\u00E9 os exames. A PPD \u00E9 um per\u00EDodo em que \u00E9 preciso ter cuidado redobrado no tr\u00E2nsito.',
        legalBase: "Art. 148 CTB",
        incidence: "alta",
        trap: true,
        difficulty: 3
    },
    {
        id: "qe63",
        category: "legislacao",
        statement: "As regras para transporte seguro de crianças menores de 10 anos em veículos automotores foram atualizadas pela legislação nacional. O uso obrigatório do dispositivo de retenção denominado 'assento de elevação' destina-se a:",
        options: [
            "Crianças com idade superior a 4 anos e até 7 anos e meio, ou que tenham altura inferior a 1,45 metros.",
            "Bebês de até 1 ano de idade ou com peso bruto total inferior a 9 kg corporais.",
            "Crianças de 1 a 4 anos de idade posicionadas de frente para o sentido de deslocamento.",
            "Qualquer criança com menos de 12 anos independente de sua estatura física ou peso correspondente.",
        ],
        correctIndex: 0,
        explanation: 'O assento de eleva\u00E7\u00E3o \u00E9 obrigat\u00F3rio pra crian\u00E7as de 4 a 7 anos e meio, ou at\u00E9 1,45m de altura (quando podem usar s\u00F3 o cinto de tr\u00EAs pontos).',
        detailedExplanation: 'A nova regra diz que crian\u00E7as at\u00E9 10 anos ou com menos de 1,45m precisam de um dispositivo de reten\u00E7\u00E3o no banco de tr\u00E1s. Antes, a idade limite era 7 anos e meio, agora \u00E9 mais seguro. Se n\u00E3o seguir essa regra, \u00E9 infra\u00E7\u00E3o grav\u00EDssima.',
        incidence: "altissima",
        difficulty: 3
    },
    {
        id: "qe64",
        category: "direcao-defensiva",
        statement: "Ao conduzir seu veículo em rodovia de pista única em período noturno, o condutor depara-se com a luz alta de um veículo em sentido contrário, resultando em ofuscamento ocular temporário. Sob as premissas da condução defensiva, a atitude correta para evitar um sinistro é:",
        options: [
            "Desviar o olhar ligeiramente para a linha de bordo branca da direita da rodovia e reduzir a velocidade de forma progressiva e segura.",
            "Ligar o farol alto de seu próprio veículo para forçar o outro condutor a baixar as luzes imediatamente.",
            "Fechar os olhos por frações de segundos sucessivas para permitir a regeneração da retina afetada.",
            "Acionar imediatamente as luzes do pisca-alerta e efetuar parada brusca sobre a faixa de rolamento da pista.",
        ],
        correctIndex: 0,
        explanation: 'Se voc\u00EA ficar ofuscado, olhe para a beirada da pista (linha de bordo) e diminua a velocidade, em vez de encarar o farol alto. ',
        detailedExplanation: 'Quando um carro vem na sua dire\u00E7\u00E3o com farol alto e te ofusca, nunca olhe direto para ele, porque isso pode te deixar cego por alguns segundos. O certo \u00E9 desviar o olhar para a margem direita da pista e ir diminuindo a velocidade, assim voc\u00EA consegue manter a vis\u00E3o e evitar acidentes. Tamb\u00E9m \u00E9 bom piscar o farol rapidinho pra avisar o outro motorista.',
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "qe65",
        category: "direcao-defensiva",
        statement: "O uso do dispositivo luminoso de pisca-alerta (luzes de advertência intermitentes) é regulamentado de forma restrita pelo CTB. O motorista está autorizado a ligar o pisca-alerta do veículo em movimento apenas quando:",
        options: [
            "Em situações de emergência com o veículo imobilizado ou em movimento lento sob forte neblina, ou quando a sinalização da via expressamente determinar.",
            "Desejar realizar estacionamento rápido em local proibido (vaga de carga e descarga) para efetuar compras rápidas.",
            "Transitar em velocidade acima do limite da via para indicar urgência pessoal no fluxo urbano.",
            "Cruzar cruzamentos sinalizados com placas de parada obrigatória em período noturno silencioso.",
        ],
        correctIndex: 0,
        explanation: 'O pisca-alerta s\u00F3 pode ser ligado em emerg\u00EAncia com o carro parado ou em movimento devagar na neblina forte.',
        detailedExplanation: 'O pisca-alerta (quatro setas piscando) deve ser usado quando o carro est\u00E1 PARADO em situa\u00E7\u00E3o de EMERG\u00CANCIA, como pane ou acidente. Se voc\u00EA usar enquanto dirige, pode confundir os outros motoristas e causar acidentes. Em dias de chuva forte, use farol baixo ou de neblina, e n\u00E3o o pisca-alerta.',
        legalBase: "Art. 251 CTB",
        incidence: "alta",
        trap: true,
        difficulty: 3
    },
    {
        id: "qe66",
        category: "infracoes",
        statement: "Um motorista decide trafegar com o automóvel no sentido contrário ao fluxo de uma via urbana sinalizada com sentido único de circulação. De acordo com o Art. 186 do Código de Trânsito Brasileiro, essa conduta constitui:",
        options: [
            "Infração de trânsito de natureza gravíssima, punida com multa pecuniária e acúmulo de 7 pontos na CNH.",
            "Infração grave, gerando retenção imediata do veículo para fins de remoção ao pátio oficial.",
            "Infração média, passível de perdão de pontos caso o condutor comprove desconhecimento geográfico do local.",
            "Crime de trânsito contra a incolumidade viária pública, punido com apreensão definitiva do veículo.",
        ],
        correctIndex: 0,
        explanation: 'Dirigir na contram\u00E3o em ruas com sentido \u00FAnico \u00E9 uma infra\u00E7\u00E3o grav\u00EDssima.',
        detailedExplanation: 'Quando voc\u00EA vai na contram\u00E3o, est\u00E1 infringindo a lei e pode levar 7 pontos na CNH e uma multa. Isso \u00E9 muito perigoso, pois pode causar acidentes s\u00E9rios, como colis\u00F5es frontais. E fique ligado: at\u00E9 sair de estacionamento na contram\u00E3o \u00E9 infra\u00E7\u00E3o!',
        legalBase: "Art. 186 CTB",
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "qe67",
        category: "infracoes",
        statement: "Motorista envolve-se em acidente com vítimas feridas que precisam de socorro imediato; havia condições de prestar auxílio, opta por fugir sem socorrer e sem acionar o resgate. Pelo CTB e pelo Código Penal, essa conduta é classificada como:",
        options: [
            "Infração gravíssima de trânsito e também crime de trânsito (Art. 304 do CTB e Art. 135 do Código Penal).",
            "Apenas infração grave de trânsito, com responsabilização exclusiva do proprietário do veículo.",
            "Infração média, punida com multa simples apenas na primeira ocorrência do condutor.",
            "Conduta atípica, se posteriormente outras pessoas prestarem socorro às vítimas."
        ],
        correctIndex: 0,
        explanation: 'Fugir do local do acidente sem ajudar as v\u00EDtimas \u00E9 uma infra\u00E7\u00E3o grav\u00EDssima e um crime de tr\u00E2nsito.',
        detailedExplanation: 'Quando o motorista n\u00E3o ajuda quem se machucou e tinha como fazer isso, ele comete um crime segundo o art. 304 do CTB, que pode dar at\u00E9 1 ano de pris\u00E3o e multa. Se ele causou o acidente e ainda foge, a pena aumenta.',
        legalBase: "Art. 304 CTB",
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "qe68",
        category: "primeiros-socorros",
        statement: "Após colisão na pista de rolamento, a vítima é encontrada inconsciente, sem movimentos respiratórios e sem pulso detectável, configurando parada cardiorrespiratória. O socorrista leigo deve iniciar imediatamente:",
        options: [
            "Compressões torácicas contínuas (RCP) em ritmo de 100 a 120 compressões por minuto até a chegada do resgate.",
            "Reanimação com líquidos mornos administrados pela boca ou compressas frias sobre a testa.",
            "Sentar a vítima com a cabeça estendida e massagear vigorosamente os ombros.",
            "Respiração boca a boca exclusiva por dez minutos antes de iniciar as compressões torácicas."
        ],
        correctIndex: 0,
        explanation: 'Se a pessoa n\u00E3o respira e n\u00E3o tem pulso, \u00E9 hora de come\u00E7ar a RCP logo, fazendo compress\u00F5es fortes e r\u00E1pidas no peito.',
        detailedExplanation: 'Na parada cardiorrespirat\u00F3ria (PCR), cada segundo \u00E9 precioso. Comece com 30 compress\u00F5es r\u00E1pidas (100 a 120 por minuto, pressionando 5 a 6 cm) e, se souber, fa\u00E7a 2 respira\u00E7\u00F5es. Se n\u00E3o souber, s\u00F3 as compress\u00F5es j\u00E1 ajudam bastante. Lembre-se: a manobra de Heimlich \u00E9 pra engasgo, n\u00E3o pra PCR.',
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "qe69",
        category: "meio-ambiente",
        statement: "O programa oficial de inspeção técnica veicular convoca periodicamente o proprietário à estação de vistoria. O objetivo principal desse programa, tanto no âmbito da segurança ativa quanto do meio ambiente, é:",
        options: [
            "Garantir as condições mecânicas de segurança ativa/passiva do veículo e verificar o atendimento aos limites legais de emissão de gases e ruídos.",
            "Determinar o valor de mercado atualizado do veículo para tributação anual de impostos estaduais.",
            "Substituir de forma preventiva todas as peças que completaram mais de 50.000 quilômetros de tráfego regular.",
            "Validar se o proprietário efetuou o pagamento das parcelas restantes de financiamento bancário.",
        ],
        correctIndex: 0,
        explanation: 'A inspe\u00E7\u00E3o t\u00E9cnica garante que o carro esteja seguro e n\u00E3o polua demais. \u00C9 uma forma de cuidar da seguran\u00E7a e do meio ambiente.',
        detailedExplanation: 'A inspe\u00E7\u00E3o veicular (obrigat\u00F3ria em alguns estados) verifica se o carro est\u00E1 em boas condi\u00E7\u00F5es de seguran\u00E7a, como freios e pneus, e tamb\u00E9m se est\u00E1 dentro dos limites de polui\u00E7\u00E3o. O objetivo \u00E9 evitar riscos para quem est\u00E1 dentro do carro e para o planeta.',
        incidence: "media",
        difficulty: 3
    },
    {
        id: "qe70",
        category: "mecanica",
        statement: "O condutor pretende cruzar rodovias estaduais em viagem de longa distância com veículo particular carregado de bagagens. Sobre pneus, fluidos e equipamentos obrigatórios, o procedimento preventivo mais adequado é:",
        options: [
            "Verificar o nível de fluidos (óleo do motor, líquido de arrefecimento e freio), inspecionar o funcionamento das luzes, calibrar os pneus (inclusive o estepe) e checar os equipamentos obrigatórios (triângulo, macaco e chave de roda).",
            "Substituir de forma compulsória todo o fluido da direção hidráulica e os amortecedores dianteiros do veículo.",
            "Lavar o motor do veículo com jato de água sob pressão e aplicar produtos lubrificantes à base de petróleo nas mangueiras.",
            "Calibrar todos os pneus com o dobro da pressão nominal recomendada para compensar o peso das bagagens.",
        ],
        correctIndex: 0,
        explanation: 'Antes de pegar a estrada, \u00E9 bom dar uma olhada nos fluidos, nas luzes, nos pneus e nos equipamentos de seguran\u00E7a do carro.',
        detailedExplanation: 'Fazer uma checagem antes de viajar \u00E9 essencial: confira se os pneus est\u00E3o calibrados e em bom estado, o n\u00EDvel do \u00F3leo do motor e do l\u00EDquido de arrefecimento, e se as luzes e os freios est\u00E3o funcionando. Isso ajuda a evitar problemas e garante uma viagem mais segura.',
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "qe71",
        category: "legislacao",
        statement: "Ao trafegar com veículo automotor de passeio por uma via urbana classificada como 'local', desprovida de qualquer placa de sinalização de velocidade máxima, qual o limite máximo de velocidade que o condutor deve respeitar por imposição legal do CTB?",
        options: [
            "30 km/h, por se tratar de via destinada a fluxos locais e residenciais de curta distância.",
            "40 km/h, limite padrão aplicável a vias coletoras urbanas sem semáforo.",
            "60 km/h, limite aplicável a vias arteriais urbanas de tráfego rápido.",
            "80 km/h, velocidade regulamentar geral para qualquer rodovia pavimentada federal.",
        ],
        correctIndex: 0,
        explanation: 'Em vias locais sem placa de velocidade, o limite \u00E9 de 30 km/h.',
        detailedExplanation: 'Isso vale para ruas onde o tr\u00E1fego \u00E9 mais tranquilo e tem bastante movimento de pedestres. O CTB coloca esses limites pra garantir a seguran\u00E7a de todos.',
        legalBase: "Art. 61 CTB",
        incidence: "altissima",
        difficulty: 3
    },
    {
        id: "qe72",
        category: "legislacao",
        statement: "Em uma rodovia de pista dupla em trecho rural, um motorista conduz um automóvel de passeio. Na ausência de placas de regulamentação de velocidade na via, qual a velocidade máxima permitida por lei para esse veículo?",
        options: [
            "110 km/h, limite padrão estabelecido pelo CTB para automóveis, caminhonetas e motocicletas em pistas duplas.",
            "90 km/h, limite geral para qualquer veículo de carga ou de transporte coletivo de passageiros.",
            "100 km/h, velocidade padrão para pistas simples e estradas não pavimentadas.",
            "120 km/h, velocidade máxima permitida em rodovias federais sob concessão privada.",
        ],
        correctIndex: 0,
        explanation: 'Em rodovias de pista dupla sem placas, a velocidade m\u00E1xima para carros \u00E9 de 110 km/h (limite padr\u00E3o).',
        detailedExplanation: 'Quando n\u00E3o tem sinaliza\u00E7\u00E3o, os limites s\u00E3o: 110 km/h para carros, 90 km/h para \u00F4nibus e caminh\u00F5es, e 80 km/h para outros ve\u00EDculos. Em estradas rurais, o limite para carros cai para 60 km/h.',
        legalBase: "Art. 61 CTB",
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "qe73",
        category: "legislacao",
        statement: "O Código de Trânsito Brasileiro classifica as vias terrestres em urbanas e rurais, dividindo estas últimas em rodovias e estradas. No que se refere especificamente às 'estradas' (vias rurais não pavimentadas), qual o limite máximo de velocidade padrão estabelecido na ausência de sinalização?",
        options: [
            "60 km/h para todos os tipos de veículos automotores.",
            "80 km/h para veículos leves e 60 km/h para veículos pesados articulados.",
            "90 km/h exclusivamente para motocicletas e caminhonetas de carga leve.",
            "50 km/h, limite imposto por razões de falta de asfalto e perigo de derrapagem.",
        ],
        correctIndex: 0,
        explanation: 'Nas estradas (vias rurais n\u00E3o pavimentadas), a velocidade m\u00E1xima \u00E9 de 60 km/h para todos os ve\u00EDculos.',
        detailedExplanation: 'O CTB separa rodovias (vias pavimentadas) de estradas (vias rurais n\u00E3o pavimentadas). Sem sinaliza\u00E7\u00E3o, o limite \u00E9 60 km/h para carros, caminhonetes e motos, e 30 km/h para outros ve\u00EDculos, j\u00E1 que as estradas t\u00EAm mais buracos e pedras soltas.',
        legalBase: "Art. 61 CTB",
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "qe74",
        category: "direcao-defensiva",
        statement: "Sob neblina ou cerração densa que compromete severamente a visibilidade em rodovias, qual o procedimento técnico correto de iluminação e conduta defensiva a ser adotado pelo motorista?",
        options: [
            "Acender os faróis baixos (luz baixa) ou faróis de neblina se houver, reduzir a velocidade de forma progressiva e manter distância segura do veículo à frente.",
            "Ligar o farol alto de forma fixa para tentar furar a barreira de gotículas suspensas no ar.",
            "Ativar as luzes de pisca-alerta do veículo em movimento acelerado para destacar a posição física na pista.",
            "Transitar apenas com as luzes de posição (faroletes) e manter a velocidade nominal da rodovia.",
        ],
        correctIndex: 0,
        explanation: 'Em neblina, use far\u00F3is baixos ou far\u00F3is de neblina. Farol alto reflete e atrapalha a vis\u00E3o.',
        detailedExplanation: 'Com neblina densa, o farol alto \u00E9 ruim porque reflete nas got\u00EDculas de \u00E1gua e cria uma \'parede branca\', dificultando a vis\u00E3o. O ideal \u00E9 usar o farol baixo e, se tiver, o farol de neblina, que ilumina melhor sem ofuscar. Lembre-se: pisca-alerta em movimento \u00E9 proibido e pode confundir os outros motoristas.',
        incidence: "alta",
        trap: true,
        difficulty: 3
    },
    {
        id: "qe75",
        category: "infracoes",
        statement: "Um motorista imobiliza seu veículo sobre a calçada (passeio público) destinada à circulação de pedestres para realizar um desembarque rápido de bagagens. Conforme a regulamentação administrativa de estacionamento prevista no CTB, tal ato constitui:",
        options: [
            "Infração de trânsito de natureza grave, punida com multa pecuniária e medida administrativa de remoção do veículo.",
            "Infração leve, passível apenas de advertência oral se o motorista permanecer no interior do automóvel.",
            "Infração média de trânsito de responsabilidade civil do pedestre prejudicado.",
            "Crime de trânsito de ocupação de passeio público com detenção preventiva de 15 a 30 dias.",
        ],
        correctIndex: 0,
        explanation: 'Estacionar na cal\u00E7ada \u00E9 infra\u00E7\u00E3o grave, com multa e remo\u00E7\u00E3o do ve\u00EDculo.',
        detailedExplanation: 'Parar o carro na cal\u00E7ada (passeio p\u00FAblico) \u00E9 considerado uma infra\u00E7\u00E3o GRAVE, que gera 5 pontos na CNH e multa. A cal\u00E7ada \u00E9 s\u00F3 para os pedestres, e deixar o carro l\u00E1 for\u00E7a as pessoas a descerem para a rua, o que \u00E9 perigoso, principalmente para quem tem dificuldades de locomo\u00E7\u00E3o.',
        legalBase: "Art. 181, VIII CTB",
        incidence: "media",
        difficulty: 3
    },
    {
        id: "qe76",
        category: "infracoes",
        statement: "Durante fiscalização de trânsito, constata-se que os ocupantes do banco traseiro de um veículo de passeio não estão utilizando os cintos de segurança obrigatórios. De acordo com o Código de Trânsito Brasileiro, a autuação e a responsabilidade da multa recaem sobre:",
        options: [
            "O condutor do veículo, sendo a infração classificada como de natureza grave e sujeita a multa e retenção do veículo.",
            "Os passageiros individualmente, visto que são maiores de idade e responsáveis diretos pelos seus atos civis.",
            "O proprietário do veículo apenas se ele estivesse presente no habitáculo no momento da abordagem.",
            "Tanto o condutor quanto os passageiros de forma solidária em multas fiscais municipais separadas.",
        ],
        correctIndex: 0,
        explanation: 'N\u00E3o usar cinto de seguran\u00E7a no banco de tr\u00E1s \u00E9 falta grave, e a multa vai pro motorista, que \u00E9 quem cuida da seguran\u00E7a do carro.',
        detailedExplanation: 'O cinto \u00E9 obrigat\u00F3rio pra todo mundo no carro, at\u00E9 quem t\u00E1 atr\u00E1s. Mesmo que o passageiro escolha n\u00E3o usar, a multa \u00E9 do motorista, porque ele \u00E9 o respons\u00E1vel. Essa infra\u00E7\u00E3o d\u00E1 5 pontos na carteira e pode machucar muito em um acidente, j\u00E1 que um passageiro sem cinto pode ferir os da frente.',
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "qe77",
        category: "direcao-defensiva",
        statement: "Um motorista ingere uma pequena dose de bebida alcoólica (equivalente a uma lata de cerveja) antes de assumir a direção de um veículo automotor. Sob o rigor da legislação da Lei Seca no Brasil (tolerância zero), essa conduta sujeita o motorista a:",
        options: [
            "Multa administrativa gravíssima multiplicada por dez vezes, suspensão do direito de dirigir por 12 meses e medida administrativa de retenção do veículo.",
            "Advertência por escrito e permissão de dirigir caso o teste acuse nível abaixo de 0,34 mg/L de ar alveolar.",
            "Infração leve, punida com multa simples sem qualquer medida administrativa ou suspensão de documentos.",
            "Crime de trânsito direto, independentemente da concentração de álcool por litro de sangue.",
        ],
        correctIndex: 0,
        explanation: 'Tomar qualquer bebida alco\u00F3lica antes de dirigir \u00E9 infra\u00E7\u00E3o grav\u00EDssima, com multa multiplicada por 10, suspens\u00E3o da CNH por 12 meses e reten\u00E7\u00E3o do ve\u00EDculo (Lei Seca).',
        detailedExplanation: 'A Lei Seca n\u00E3o permite nenhum \u00E1lcool no sangue ao dirigir. Mesmo uma lata de cerveja j\u00E1 pode te colocar em apuros, com multa alta e perda da carteira por um ano. Acima de certos n\u00EDveis, voc\u00EA pode at\u00E9 ser preso por crime de tr\u00E2nsito.',
        incidence: "altissima",
        trap: true,
        difficulty: 3
    },
    {
        id: "qe78",
        category: "primeiros-socorros",
        statement: "Uma pessoa adulta consciente apresenta um quadro de obstrução total de vias aéreas por alimento (engasgo severo), demonstrando incapacidade de falar ou tossir e levando as mãos ao pescoço. Qual a manobra de primeiros socorros indicada para desobstruir as vias aéreas?",
        options: [
            "Manobra de Heimlich, realizando compressões abdominais rápidas e firmes para dentro e para cima, logo acima do umbigo da vítima.",
            "Deitar a vítima em posição lateral de segurança e realizar respiração boca-a-boca com forte sopro pulmonar.",
            "Forçar a vítima a ingerir pão seco ou grandes volumes de água morna para empurrar o objeto para o esôfago.",
            "Efetuar golpes secos e fortes na nuca da vítima com ela em posição sentada.",
        ],
        correctIndex: 0,
        explanation: 'A manobra de Heimlich \u00E9 a forma certa de ajudar quem est\u00E1 engasgado e n\u00E3o consegue falar ou tossir.',
        detailedExplanation: 'Quando algu\u00E9m est\u00E1 engasgado e consciente, voc\u00EA deve fazer a manobra de Heimlich. Fique atr\u00E1s da pessoa, envolva-a com os bra\u00E7os, coloque o punho acima do umbigo e fa\u00E7a compress\u00F5es r\u00E1pidas para dentro e para cima. Isso ajuda a tirar o que est\u00E1 bloqueando a respira\u00E7\u00E3o.',
        incidence: "media",
        difficulty: 3
    },
    {
        id: "qe79",
        category: "meio-ambiente",
        statement: "Motociclista instala silenciador esportivo aberto em substituição ao escapamento original, elevando o ruído acima dos limites legais; em fiscalização, a motocicleta é abordada em via urbana. Pelo CTB, essa conduta configura:",
        options: [
            "Infração de trânsito de natureza grave, sujeita a multa administrativa e medida administrativa de retenção da motocicleta para regularização.",
            "Infração de trânsito média, punida apenas com multa sem qualquer previsão de retenção física do veículo.",
            "Crime contra o meio ambiente urbano com recolhimento imediato do documento de habilitação.",
            "Infração gravíssima, gerando cassação definitiva do direito de dirigir motocicletas por dois anos.",
        ],
        correctIndex: 0,
        explanation: 'Andar com escapamento barulhento \u00E9 infra\u00E7\u00E3o grave, e pode levar a multa e reten\u00E7\u00E3o da moto pra regularizar.',
        detailedExplanation: 'Se a moto tiver escapamento modificado e barulhento, isso \u00E9 considerado infra\u00E7\u00E3o GRAVE, com 5 pontos na CNH e multa. Al\u00E9m disso, a moto pode ser retida at\u00E9 o escapamento voltar ao normal, j\u00E1 que isso causa polui\u00E7\u00E3o sonora e pode incomodar os outros.',
        legalBase: "Art. 230, IX CTB",
        incidence: "media",
        difficulty: 3
    },
    {
        id: "qe80",
        category: "mecanica",
        statement: "Durante a verificação prévia antes de iniciar o motor, o condutor constata manchas e odor forte de vazamento de combustível sob o compartimento do motor. Diante desse risco iminente, a conduta mecânica correta é:",
        options: [
            "Não dar partida no motor, manter o veículo imobilizado em local ventilado e providenciar o reboque do veículo para uma oficina mecânica especializada.",
            "Funcionar o motor em alta rotação para queimar o combustível acumulado nas mangueiras e secar o vazamento por calor.",
            "Misturar detergente líquido ou sabão em pó ao redor da mancha para diluir o combustível e prosseguir viagem normalmente.",
            "Ignorar o vazamento provisoriamente caso o painel não indique luz vermelha de superaquecimento de óleo.",
        ],
        correctIndex: 0,
        explanation: 'Vazamento de combust\u00EDvel pode pegar fogo, ent\u00E3o n\u00E3o ligue o motor e mantenha o carro parado em lugar ventilado. Chame um guincho para levar o carro pra consertar.',
        detailedExplanation: 'Quando tem vazamento de combust\u00EDvel, \u00E9 uma situa\u00E7\u00E3o de EMERG\u00CANCIA. O combust\u00EDvel pega fogo f\u00E1cil, e qualquer fa\u00EDsca pode causar um inc\u00EAndio. Al\u00E9m disso, o combust\u00EDvel que vaza pode poluir o meio ambiente, ent\u00E3o \u00E9 melhor agir r\u00E1pido e seguro.',
        incidence: "media",
        difficulty: 3
    },
    {
        id: "qe81",
        category: "prioridade",
        statement: "Ao manobrar para sair da garagem de edifício residencial e ingressar na via pública, o condutor cruza calçada com pedestres e acessa via urbana com fluxo ativo de veículos. A ordem de preferência exigida pelo CTB é:",
        options: [
            "Aos pedestres que circulam pela calçada (passeio público) e aos veículos que já estão transitando pela via pública.",
            "Exigir prioridade de passagem sobre os pedestres acionando a buzina e mudando a aceleração de forma rápida.",
            "Aos veículos que vêm apenas pela sua esquerda, tendo preferência sobre pedestres e veículos da direita.",
            "Aos ciclistas apenas se eles estiverem transitando na contramão de direção da via secundária.",
        ],
        correctIndex: 0,
        explanation: 'Quem sai de garagem tem que deixar passar pedestres na cal\u00E7ada e carros que j\u00E1 est\u00E3o na rua.',
        detailedExplanation: 'Quando voc\u00EA est\u00E1 saindo de uma garagem, precisa dar prioridade para quem j\u00E1 est\u00E1 na via, tanto pedestres quanto ve\u00EDculos. \u00C9 importante parar, sinalizar e s\u00F3 entrar quando der pra fazer isso com seguran\u00E7a. Ignorar essa regra pode causar acidentes.',
        legalBase: "Art. 36 CTB",
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "qe82",
        category: "legislacao",
        statement: "O correto estado físico e legibilidade da placa de identificação traseira do veículo é exigido pela fiscalização de trânsito. Sob as regras punitivas do CTB, transitar com a placa traseira sem legibilidade ou com caracteres encobertos configura:",
        options: [
            "Infração de natureza gravíssima, punida com multa pecuniária, medida administrativa de remoção do veículo ao depósito e recolhimento do CLA/CRLV.",
            "Infração média, punida com multa simples sem previsão de remoção física ou retenção de documentos.",
            "Infração grave, permitindo o trânsito livre por até 48 horas se o proprietário comprovar agendamento de nova placa.",
            "Infração leve, convertida automaticamente em advertência verbal pedagógica pelo agente fiscalizador.",
        ],
        correctIndex: 0,
        explanation: 'Dirigir com a placa traseira ileg\u00EDvel \u00E9 uma infra\u00E7\u00E3o grav\u00EDssima, que pode levar a multa e at\u00E9 guincho do carro.',
        detailedExplanation: 'A placa do carro precisa estar sempre limpa e f\u00E1cil de ler, sem sujeira ou adesivos. Se tiver qualquer coisa que atrapalhe a leitura, \u00E9 infra\u00E7\u00E3o grav\u00EDssima, com 7 pontos e multa, al\u00E9m de poder levar o carro pro dep\u00F3sito. A placa \u00E9 como o RG do ve\u00EDculo e deve ser vis\u00EDvel pra fiscaliza\u00E7\u00E3o.',
        legalBase: "Art. 230, IV CTB",
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "qe83",
        category: "direcao-defensiva",
        statement: "Após realizar a ultrapassagem de um veículo pesado (caminhão) em rodovia de pista única, qual a conduta correta de direção defensiva e sinalização para que o motorista retorne à sua faixa de origem com segurança?",
        options: [
            "Sinalizar a intenção de retorno com a seta para a direita, acelerar para criar distância e retornar à faixa original apenas após visualizar o caminhão inteiro no espelho retrovisor interno do veículo.",
            "Retornar à faixa imediatamente após passar o para-lama dianteiro do caminhão para desobstruir a contramão rapidamente.",
            "Desacelerar o veículo de passeio na contramão até que o caminhão emparelhe e buzinar para avisar o retorno.",
            "Manter o pisca-alerta ligado durante todo o retorno para indicar manobra de emergência na rodovia.",
        ],
        correctIndex: 0,
        explanation: '\u00C9 preciso sinalizar com a seta e s\u00F3 voltar pra faixa original quando ver o caminh\u00E3o inteiro no retrovisor.',
        detailedExplanation: 'Depois de ultrapassar, olhe bem no retrovisor interno e s\u00F3 retorne quando o caminh\u00E3o estiver todo vis\u00EDvel. Isso garante que voc\u00EA tem espa\u00E7o suficiente pra manobrar sem risco de acidente. Se voltar muito r\u00E1pido, pode acabar fechando o caminh\u00E3o e causar uma batida.',
        incidence: "media",
        difficulty: 3
    },
    {
        id: "qe84",
        category: "infracoes",
        statement: "Ao trafegar por via urbana dotada de iluminação pública eficiente durante o período noturno, o condutor decide desligar os faróis e manter acesos apenas os faroletes (luzes de posição) do veículo. Sob as penalidades administrativas do CTB, tal atitude configura:",
        options: [
            "Infração de trânsito de natureza média, sujeita a multa administrativa pecuniária e acúmulo de pontos na CNH.",
            "Infração grave, gerando suspensão da validade do licenciamento do veículo até vistoria técnica.",
            "Conduta permitida pela lei de trânsito desde que a iluminação pública da via seja classificada como excelente.",
            "Infração leve, passível apenas de advertência oral pelo agente de trânsito se a velocidade estiver reduzida.",
        ],
        correctIndex: 0,
        explanation: 'Dirigir \u00E0 noite com s\u00F3 os faroletes acesos em lugar com luz \u00E9 infra\u00E7\u00E3o m\u00E9dia (Art. 250, I, \'a\' do CTB).',
        detailedExplanation: 'Usar s\u00F3 as luzes de posi\u00E7\u00E3o \u00E0 noite \u00E9 infra\u00E7\u00E3o m\u00E9dia, com 4 pontos na CNH e multa. O farol baixo deve estar ligado das 18h \u00E0s 6h em vias p\u00FAblicas, pois \u00E9 perigoso n\u00E3o ser visto por outros ve\u00EDculos e pedestres.',
        legalBase: "Art. 250 CTB",
        incidence: "media",
        difficulty: 3
    },
    {
        id: "qe85",
        category: "legislacao",
        statement: "A obrigatoriedade do uso de faróis baixos (luz baixa) durante o dia em rodovias foi atualizada pela legislação nacional recente. Sob as regras vigentes do CTB, condutores de veículos equipados com luz de condução diurna (DRL) devem manter o farol baixo aceso durante o dia em:",
        options: [
            "Rodovias de pista simples situadas fora de perímetros urbanos, caso o veículo não possua a luz de condução diurna (DRL).",
            "Qualquer espécie de via urbana ou rural de forma compulsória, independente de o veículo possuir DRL ou não.",
            "Apenas no interior de túneis ou sob forte neblina e chuva torrencial, sendo dispensada nas demais rodovias.",
            "Rodovias federais concedidas sob pedágio de fluxo rápido durante finais de semana.",
        ],
        correctIndex: 0,
        explanation: 'Em rodovias de pista simples fora da cidade, se o carro n\u00E3o tiver luz de dia (DRL), \u00E9 obrigat\u00F3rio usar farol baixo durante o dia.',
        detailedExplanation: 'A regra do farol baixo diz que, nessas rodovias, o farol deve estar aceso sempre. Em rodovias com pista dupla e canteiro central, n\u00E3o precisa usar farol de dia, mas muitos motoristas preferem deixar ligado por seguran\u00E7a. Lembre-se: em situa\u00E7\u00F5es como chuva ou neblina, o farol baixo \u00E9 sempre necess\u00E1rio.',
        legalBase: "Lei 13.290/16",
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "qp16",
        category: "placas",
        statement: "O condutor procura posto de combustível, telefone de emergência e hospital em via rápida e depende da sinalização vertical para localizar esses serviços. Pela classificação do CTB, o grupo que cumpre essa função de orientação é:",
        options: [
            "Sinalização de Regulamentação, que tem por finalidade informar aos usuários as condições, proibições, obrigações ou restrições no uso das vias.",
            "Sinalização de Advertência, que tem por finalidade alertar os usuários das condições potencialmente perigosas ou obstáculos existentes na via.",
            "Sinalização de Indicação, que tem por finalidade identificar as vias e os locais de interesse, bem como orientar os condutores sobre os destinos e os serviços auxiliares disponíveis.",
            "Sinalização de Obras e Especiais, que tem por finalidade informar sobre os trabalhos executados na pista e demais eventos temporários.",
        ],
        correctIndex: 2,
        explanation: 'Sinaliza\u00E7\u00E3o de Indica\u00E7\u00E3o mostra onde est\u00E3o servi\u00E7os e pontos tur\u00EDsticos (placas azuis).',
        detailedExplanation: 'A sinaliza\u00E7\u00E3o de INDICA\u00C7\u00C3O (s\u00E9rie I) ajuda o motorista a encontrar servi\u00E7os como hospitais e postos de gasolina. Ela \u00E9 dividida em placas AZUIS para servi\u00E7os, VERDES para cidades e dist\u00E2ncias, MARRONS para turismo e BRANCAS para ruas. Ao contr\u00E1rio das placas que obrigam ou alertam, as de indica\u00E7\u00E3o s\u00F3 informam.',
        incidence: "media",
        difficulty: 2
    },
    {
        id: "q4",
        category: "primeiros-socorros",
        statement: "Em batida traseira em rodovia, a vítima permanece consciente, relata dor intensa na região cervical e refere incapacidade de movimentar os membros superiores e inferiores. Antes da chegada do SAMU, a primeira conduta é:",
        options: [
            "Retirar imediatamente a vítima do veículo puxando-a pelos braços para evitar risco de incêndio.",
            "Administrar água ou analgésico e massagear a região cervical para aliviar a dor.",
            "Manter a vítima imóvel, com pescoço e coluna alinhados, sem promover qualquer movimentação desnecessária.",
            "Ajudar a vítima a sentar-se ereta para melhorar a circulação sanguínea do corpo."
        ],
        correctIndex: 2,
        explanation: 'V\u00EDtimas com dor no pesco\u00E7o precisam ficar paradas e alinhadas pra n\u00E3o piorar a situa\u00E7\u00E3o.',
        detailedExplanation: 'Manter a v\u00EDtima na mesma posi\u00E7\u00E3o evita que ela se machuque mais. N\u00E3o mova a pessoa a menos que seja realmente necess\u00E1rio, como em caso de fogo. E nunca ofere\u00E7a \u00E1gua pra quem t\u00E1 inconsciente, pode ser perigoso.',
        commonMistake: 'Muita gente acha que deve fazer respira\u00E7\u00E3o boca a boca, mas isso s\u00F3 \u00E9 pra quem n\u00E3o t\u00E1 respirando.',
        tip: 'Dor no pesco\u00E7o = Fica parado e alinhado.',
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "q5",
        category: "infracoes",
        statement: "Condutor é submetido ao teste do etilômetro em fiscalização da Lei Seca e o aparelho acusa teor alcoólico superior ao limite de tolerância. Pelo Art. 165 do CTB, a infração praticada e sua penalidade são:",
        options: [
            "Infração de natureza grave, punida com multa no valor de cinco vezes o valor base.",
            "Infração de natureza gravíssima, punida com multa administrativa multiplicada por dez vezes e suspensão do direito de dirigir por 12 meses.",
            "Infração de natureza média, punida com multa administrativa e apreensão definitiva da CNH.",
            "Crime de trânsito inafiançável com perda imediata do direito de dirigir por cinco anos.",
        ],
        correctIndex: 1,
        explanation: 'Dirigir b\u00EAbado \u00E9 uma infra\u00E7\u00E3o grav\u00EDssima que custa caro e tira sua carteira por 12 meses.',
        detailedExplanation: 'Com a Lei Seca, qualquer quantidade de \u00E1lcool no sangue j\u00E1 \u00E9 motivo pra multa alta (10 vezes o valor) e suspens\u00E3o do direito de dirigir. Se voc\u00EA recusar o baf\u00F4metro, a puni\u00E7\u00E3o \u00E9 a mesma. E se o teste mostrar muito \u00E1lcool, pode at\u00E9 dar cadeia!',
        legalBase: "Art. 165 e 306 do CTB",
        incidence: "altissima",
        difficulty: 3
    },
    {
        id: "q6",
        category: "prioridade",
        statement: "Dois veículos automotores chegam simultaneamente a interseção em perímetro urbano desprovida de semáforo, placas e sinalização horizontal, um pela via principal e outro pela via transversal. Pela regra geral do CTB, tem a vez de passar:",
        options: [
            "O veículo da via principal, pois a hierarquia viária de classificação prevalece sobre a regra geral.",
            "O veículo que vier pela direita do outro, conforme a regra geral de preferência em interseções sem sinalização.",
            "O veículo que estiver trafegando com maior velocidade, por demonstrar maior fluidez no cruzamento.",
            "O veículo que acionar primeiro a sinalização de conversão, independentemente da posição relativa na interseção."
        ],
        correctIndex: 1,
        explanation: 'Em cruzamentos sem sinaliza\u00E7\u00E3o, quem vem pela direita tem a prefer\u00EAncia.',
        detailedExplanation: 'A regra \u00E9 simples: em cruzamentos sem placas ou sem luzes, o carro que vem pela DIREITA passa primeiro. Lembre-se das exce\u00E7\u00F5es: quem est\u00E1 em rotat\u00F3ria ou em via preferencial (geralmente mais larga) passa na frente, e os ve\u00EDculos de emerg\u00EAncia sempre t\u00EAm prioridade.',
        legalBase: "Art. 29, III, 'c' do CTB",
        commonMistake: 'Muita gente erra achando que a prefer\u00EAncia \u00E9 pela esquerda, mas \u00E9 pela direita!',
        tip: 'Direita = prefer\u00EAncia. Fica na cabe\u00E7a!',
        incidence: "altissima",
        trap: true,
        difficulty: 3
    },
    {
        id: "q7",
        category: "placas",
        statement: "A placa R-1 (PARADA OBRIGATÓRIA) destaca-se de todas as demais placas de regulamentação pelo formato geométrico, concebido para reconhecimento mesmo com poeira ou parcialmente obstruída. Esse formato e a finalidade técnica são:",
        options: [
            "Formato octogonal, cuja finalidade é garantir a legibilidade da placa mesmo que vista pelo verso ou parcialmente coberta por poeira.",
            "Formato triangular invertido, para sinalizar a transição de vias urbanas de grande fluxo.",
            "Formato circular padrão, cuja finalidade é diferenciar-se das placas de advertência que são losangulares.",
            "Formato retangular azul, indicando área de estacionamento regulamentado obrigatório.",
        ],
        correctIndex: 0,
        explanation: 'A placa R-1 \u00E9 octogonal pra ser f\u00E1cil de ver, at\u00E9 de longe ou se estiver suja.',
        detailedExplanation: 'A placa PARE (R-1) tem 8 lados, \u00E9 vermelha com letras brancas e manda parar TOTAL antes da faixa. Se n\u00E3o parar, \u00E9 infra\u00E7\u00E3o grav\u00EDssima (7 pontos). Ela \u00E9 a \u00FAnica octogonal pra ser reconhecida em qualquer situa\u00E7\u00E3o.',
        commonMistake: 'Muita gente confunde com placas de aviso por causa do formato. Lembre-se: PARE \u00E9 REGULAMENTA\u00C7\u00C3O.',
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "q8",
        category: "meio-ambiente",
        statement: "Com escapamento e catalisador alterados, fiscalização ambiental mede no veículo emissão de gases acima dos limites regulamentados pelo órgão de controle. Nos termos do CTB, a sanção aplicável ao proprietário é:",
        options: [
            "Apenas advertência por escrito expedida pelo órgão ambiental estadual competente.",
            "Infração de natureza grave, punida com multa e retenção do veículo para fins de regularização.",
            "Infração gravíssima de trânsito, punida com remoção do veículo e cassação da licença de funcionamento.",
            "Crime ambiental com detenção compulsória do motorista em flagrante.",
        ],
        correctIndex: 1,
        explanation: 'Se o carro soltar fuma\u00E7a ou polui\u00E7\u00E3o demais, \u00E9 uma infra\u00E7\u00E3o grave e pode ser multado e ter o ve\u00EDculo retido pra arrumar.',
        detailedExplanation: 'Pelo CTB, se o ve\u00EDculo estiver emitindo mais poluentes do que o permitido, isso \u00E9 considerado uma infra\u00E7\u00E3o GRAVE. Voc\u00EA ganha 5 pontos na CNH, leva uma multa e o carro pode ser retido at\u00E9 regularizar a situa\u00E7\u00E3o. O controle \u00E9 feito pelo PROCONVE (Programa de Controle da Polui\u00E7\u00E3o do Ar por Ve\u00EDculos Automotores).',
        legalBase: "Art. 231, III do CTB",
        incidence: "media",
        difficulty: 3
    },
    {
        id: "q9",
        category: "mecanica",
        statement: "Durante manutenção preventiva do sistema de frenagem, pergunta-se sobre princípios de funcionamento do freio de serviço hidráulico convencional — pedal, hidrovácuo, discos e tambores. A afirmativa correta é:",
        options: [
            "O sistema de freio de estacionamento (freio de mão) atua de forma hidráulica nas quatro rodas simultaneamente.",
            "A redução de velocidade ocorre pelo atrito das pastilhas contra os discos de freio ou das sapatas contra os tambores, impulsionados pela pressão do fluido de freio.",
            "O hidrovácuo (servo-freio) serve para aumentar a resistência mecânica do pedal de freio, tornando-o mais rígido na frenagem de emergência.",
            "O fluido de freio deve ser inspecionado anualmente e substituído apenas quando houver vazamento severo no cilindro mestre.",
        ],
        correctIndex: 1,
        explanation: 'O freio hidr\u00E1ulico faz o carro parar ao usar a press\u00E3o do fluido pra empurrar as pastilhas contra os discos ou as sapatas contra os tambores.',
        detailedExplanation: 'Quando voc\u00EA pisa no freio, a press\u00E3o do fluido faz as pastilhas ou lonas se encostarem nos discos ou tambores, gerando atrito e diminuindo a velocidade. Se o freio estiver com problemas, como pedal baixo ou barulho, \u00E9 hora de dar uma olhada, porque dirigir assim \u00E9 muito perigoso e pode dar multa GRAV\u00CDSSIMA.',
        incidence: "media",
        difficulty: 3
    },
    {
        id: "q10",
        category: "direcao-defensiva",
        statement: "A direção defensiva orienta que, em condições ideais de clima e pista, o condutor mantém uma distância de seguimento segura em relação ao veículo que trafega imediatamente à sua frente. Essa distância deve ser calculada utilizando a regra prática de:",
        options: [
            "Manter no mínimo 5 metros de distância para cada 10 km/h de velocidade desenvolvida.",
            "Contar dois segundos de intervalo entre a passagem do veículo da frente e a do próprio veículo por um ponto fixo de referência na via.",
            "Basear-se na distância visual de três postes de iluminação pública consecutivas na via.",
            "Manter sempre a distância fixa equivalente ao comprimento de dois automóveis de médio porte.",
        ],
        correctIndex: 1,
        explanation: 'A regra dos dois segundos \u00E9 a forma r\u00E1pida de saber se voc\u00EA est\u00E1 a uma dist\u00E2ncia segura do carro da frente.',
        detailedExplanation: 'Para usar, escolha um ponto fixo na estrada, como uma placa. Quando o carro da frente passar por ele, comece a contar \'mil e um, mil e dois\'. Se voc\u00EA passar antes de terminar a contagem, est\u00E1 muito perto. Em dias de chuva ou neblina, aumente para 4 segundos para ficar mais seguro.',
        tip: 'Normal = 2s \u00B7 Chuva = 4s',
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "q11",
        category: "legislacao",
        statement: "O Código de Trânsito Brasileiro (CTB) estabelece prazos para renovação dos exames de aptidão física e mental para a habilitação de condutores. De acordo com as normas atualizadas pela Lei 14.071/2021, condutores com idade inferior a 50 anos devem renovar sua CNH com periodicidade máxima de:",
        options: [
            "5 anos, independentemente do exercício de atividade remunerada (EAR).",
            "10 anos, exceto quando houver indicação médica em contrário expressa no prontuário.",
            "3 anos, para condutores habilitados nas categorias profissionais C, D e E.",
            "15 anos, desde que não cometam nenhuma infração gravíssima nos últimos doze meses.",
        ],
        correctIndex: 1,
        explanation: 'Agora, quem tem menos de 50 anos renova a CNH a cada 10 anos.',
        detailedExplanation: 'Com a Lei 14.071/2021, a validade da CNH mudou. Se voc\u00EA tem menos de 50 anos, a renova\u00E7\u00E3o \u00E9 a cada 10 anos; de 50 a menos de 70, \u00E9 a cada 5 anos; e se tiver 70 ou mais, a cada 3 anos. Quem trabalha com transporte precisa seguir regras espec\u00EDficas.',
        legalBase: "Art. 147, §2º do CTB (Lei 14.071/2021)",
        commonMistake: 'Muita gente ainda acha que a validade \u00E9 de 5 anos \u2014 isso mudou em 2021!',
        tip: 'Menos de 50 = 10 anos; mais velho, menos tempo.',
        incidence: "altissima",
        trap: true,
        difficulty: 3
    },
    {
        id: "q12",
        category: "infracoes",
        statement: "Em uma via arterial dotada de sinalização semafórica, o condutor decide avançar o sinal vermelho do semáforo durante a madrugada, alegando razões de segurança pessoal. Sob o rigor técnico e jurídico do Código de Trânsito Brasileiro (CTB), essa conduta configura:",
        options: [
            "Infração de trânsito de natureza gravíssima, punida com multa e acúmulo de 7 pontos na CNH, sem possibilidade de exceções por conveniência pessoal.",
            "Infração de trânsito de natureza grave, tolerada em situações de risco iminente ou durante a madrugada.",
            "Infração média, passível de conversão imediata em advertência por escrito pelo agente fiscalizador.",
            "Crime de trânsito de menor potencial ofensivo, acarretando a suspensão preventiva da CNH.",
        ],
        correctIndex: 0,
        explanation: 'Avan\u00E7ar o sinal vermelho \u00E9 uma infra\u00E7\u00E3o grav\u00EDssima, n\u00E3o importa a situa\u00E7\u00E3o.',
        detailedExplanation: 'Quando voc\u00EA passa o sinal vermelho, \u00E9 infra\u00E7\u00E3o GRAV\u00CDSSIMA: 7 pontos na CNH e multa de R$ 293,47. N\u00E3o tem desculpa, at\u00E9 parar em cima da faixa de pedestres conta como infra\u00E7\u00E3o.',
        legalBase: "Art. 208 do CTB",
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "q13",
        category: "placas",
        statement: "As placas de advertência alertam para condição de perigo potencial adiante na pista de rolamento, sem impor dever de conduta. Segundo o CTB, o formato padrão e a paleta de cores dessa classe de sinalização são:",
        options: [
            "Formato circular com fundo branco, orla vermelha e símbolos em preto.",
            "Formato quadrado ou losangular com fundo amarelo, orla interna preta e símbolos em preto.",
            "Formato retangular com fundo verde ou azul e caracteres em branco.",
            "Formato octogonal com fundo vermelho e caracteres em branco.",
        ],
        correctIndex: 1,
        explanation: 'Placas de advert\u00EAncia s\u00E3o amarelas e pretas, geralmente em formato de losango.',
        detailedExplanation: 'Essas placas (s\u00E9rie A) t\u00EAm formato de losango amarelo com borda e s\u00EDmbolos pretos. Elas avisam sobre perigos na estrada, como curvas, lombadas e cruzamentos, mas n\u00E3o obrigam a parar \u2014 s\u00F3 alertam. Ignorar essas placas e causar um acidente pode aumentar a responsabilidade do motorista.',
        tip: 'Perigo \u00E0 vista = olho na placa!',
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "q14",
        category: "primeiros-socorros",
        statement: "Ao presenciar um acidente automobilístico em rodovia pública, o condutor de um veículo decide prestar o atendimento inicial. Visando à preservação da vida e à segurança de todos os envolvidos no local do sinistro, qual deve ser o primeiro procedimento técnico adotado?",
        options: [
            "Tentar remover imediatamente os veículos acidentados para desobstruir as faixas de rolamento.",
            "Efetuar a sinalização correta do local do acidente para evitar novas colisões e garantir a própria segurança antes de aproximar-se das vítimas.",
            "Iniciar manobras de reanimação cardiopulmonar na primeira vítima localizada fora do veículo.",
            "Retirar as vítimas das ferragens sem aguardar o equipamento do Corpo de Bombeiros.",
        ],
        correctIndex: 1,
        explanation: 'Sinalizar o local \u00E9 o primeiro passo pra evitar mais acidentes e garantir a seguran\u00E7a de todo mundo.',
        detailedExplanation: 'Primeiro, proteja o local colocando o tri\u00E2ngulo a pelo menos 30 metros e ligue o pisca-alerta. Depois, avise o socorro ligando para 192, 193 ou 190 e informe tudo direitinho. S\u00F3 ajude as v\u00EDtimas se voc\u00EA souber o que fazer, pra n\u00E3o piorar a situa\u00E7\u00E3o delas.',
        tip: 'Sinalizar = Proteger.',
        incidence: "altissima",
        difficulty: 3
    },
    {
        id: "q15",
        category: "prioridade",
        statement: "O condutor se aproxima de rotatória em perímetro urbano sem semáforo e sem placas de regulamentação; outro veículo já trafega pela faixa interna da circunferência. Pelo CTB, a preferência de passagem pertence a:",
        options: [
            "O veículo que estiver circulando pela rotatória no momento da interseção.",
            "O veículo que se aproximar da rotatória vindo pela via de trânsito rápido ou arterial.",
            "O veículo que iniciar a manobra de aceleração primeiro na tentativa de ingressar na rotatória.",
            "O veículo que se aproximar pela direita daquele que já se encontra na circulação da rotatória.",
        ],
        correctIndex: 0,
        explanation: 'Na rotat\u00F3ria sem sinaliza\u00E7\u00E3o, quem j\u00E1 est\u00E1 dentro tem a prefer\u00EAncia.',
        detailedExplanation: 'Desde a mudan\u00E7a na lei, quem circula na rotat\u00F3ria n\u00E3o precisa parar para quem est\u00E1 entrando. \u00C9 importante lembrar que quem entra deve sinalizar ao sair e enquanto est\u00E1 na rotat\u00F3ria, dependendo da situa\u00E7\u00E3o.',
        legalBase: "Art. 29, III, 'f' do CTB",
        commonMistake: 'Muita gente confunde e acha que a regra da direita ainda vale, mas em rotat\u00F3ria \u00E9 diferente.',
        tip: 'J\u00E1 dentro = prefer\u00EAncia.',
        incidence: "altissima",
        trap: true,
        difficulty: 3
    },
    {
        id: "q16",
        category: "direcao-defensiva",
        statement: "A Direção Defensiva baseia-se em cinco elementos fundamentais (pilares) indispensáveis para a condução segura de veículos automotores. Assinale a alternativa que apresenta uma conduta que NÃO corresponde a esses elementos de segurança preventiva:",
        options: [
            "Agir sob a influência do elemento Conhecimento, sabendo as leis de trânsito e características mecânicas do veículo.",
            "Agir sob a influência da Previsão, antecipando perigos no fluxo de tráfego adiante.",
            "Agir sob a influência da Habilidade, confiando nela para trafegar acima do limite de velocidade de forma segura.",
            "Agir sob a influência da Decisão, tomando atitudes seguras de forma rápida perante emergências.",
        ],
        correctIndex: 2,
        explanation: 'Confiar s\u00F3 na habilidade e acelerar acima do limite \u00E9 um erro, pois isso pode causar acidentes. Habilidade n\u00E3o \u00E9 desculpa pra desrespeitar as leis de tr\u00E2nsito (imprud\u00EAncia).',
        detailedExplanation: 'Os 5 pilares da dire\u00E7\u00E3o defensiva s\u00E3o: CONHECIMENTO (saber as regras), ATEN\u00C7\u00C3O (manter o foco), PREVIS\u00C3O (pensar no que pode acontecer), HABILIDADE (saber dirigir) e A\u00C7\u00C3O (agir certo na hora certa). Coisas como pressa e distra\u00E7\u00E3o atrapalham a seguran\u00E7a na dire\u00E7\u00E3o.',
        commonMistake: 'Cuidado com a armadilha do \'EXCETO\' \u2014 sempre leia com aten\u00E7\u00E3o. Pressa \u00E9 inimigo, n\u00E3o amigo da dire\u00E7\u00E3o defensiva.',
        incidence: "alta",
        trap: true,
        difficulty: 3
    },
    {
        id: "q17",
        category: "legislacao",
        statement: "O uso de dispositivos de retenção, como o cinto de segurança, é regulamentado de forma rígida pela legislação de trânsito brasileira. Sobre a obrigatoriedade e uso deste dispositivo pelos ocupantes do veículo, assinale a alternativa correta de acordo com as normas do CTB:",
        options: [
            "O uso do cinto de segurança é obrigatório apenas para o condutor e o passageiro do banco dianteiro em rodovias.",
            "O uso do cinto de segurança é obrigatório em todas as vias do território nacional para condutor e passageiros, tanto nos bancos dianteiros quanto traseiros.",
            "O uso do cinto de segurança é dispensado para crianças transportadas no banco traseiro em cadeirinhas infantis apropriadas.",
            "O condutor fica isento da multa se o passageiro do banco traseiro se recusar a utilizar o cinto de segurança.",
        ],
        correctIndex: 1,
        explanation: 'Todo mundo no carro tem que usar cinto de seguran\u00E7a, n\u00E3o importa onde voc\u00EA esteja.',
        detailedExplanation: 'O cinto \u00E9 obrigat\u00F3rio para todos os passageiros, tanto na frente quanto atr\u00E1s, em qualquer tipo de estrada. Se n\u00E3o usar, \u00E9 uma infra\u00E7\u00E3o GRAVE, com 5 pontos na carteira e multa. O motorista tamb\u00E9m \u00E9 respons\u00E1vel por garantir que os passageiros estejam usando o cinto, e crian\u00E7as at\u00E9 10 anos devem ir no banco de tr\u00E1s em cadeirinhas ou assentos adequados.',
        legalBase: "Art. 167 do CTB",
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "q18",
        category: "meio-ambiente",
        statement: "Em trajeto rodoviário com trechos de declive e aclive pronunciados, o condutor avalia hábitos de condução para reduzir emissões e consumo. A conduta que efetivamente contribui para a redução da emissão de poluentes é:",
        options: [
            "Acelerar o motor de forma vigorosa entre as trocas de marchas para manter o giro alto do motor.",
            "Transitar em marchas adequadas à velocidade, mantendo uma aceleração constante e evitando freadas ou arrancadas bruscas desnecessárias.",
            "Desligar o motor em declives acentuados (colocar o veículo em ponto morto ou 'banguela') para economizar combustível.",
            "Utilizar combustível aditivado sem realizar a troca periódica dos filtros de ar e óleo do motor.",
        ],
        correctIndex: 1,
        explanation: 'Dirigir de forma tranquila e constante ajuda a gastar menos combust\u00EDvel e soltar menos polui\u00E7\u00E3o no ar.',
        detailedExplanation: 'Fazer a manuten\u00E7\u00E3o do carro, como trocar \u00F3leo e calibrar pneus, faz o motor funcionar melhor e queimar menos combust\u00EDvel. Tamb\u00E9m \u00E9 bom trocar de marcha na hora certa e desligar o motor se for ficar parado muito tempo.',
        incidence: "media",
        difficulty: 3
    },
    {
        id: "q19",
        category: "mecanica",
        statement: "Em via com superfície irregular, os ocupantes sentem impactos transmitidos pela carroceria e os pneus tendem a perder contato com o solo. A função técnica primária de molas, amortecedores e braços oscilantes é:",
        options: [
            "Reduzir o atrito interno do motor transmitindo a força motriz diretamente para o sistema de diferencial traseiro.",
            "Absorver os impactos gerados pelas irregularidades da pista de rolamento, garantindo o conforto dos ocupantes e mantendo os pneus em contato constante com o solo.",
            "Impedir a fadiga dos freios de serviço mantendo a carroceria perfeitamente paralela à linha do horizonte.",
            "Controlar o nível de pressão hidráulica nos cilindros auxiliares do sistema de freios antibloqueio (ABS).",
        ],
        correctIndex: 1,
        explanation: 'A suspens\u00E3o \u00E9 respons\u00E1vel por absorver os buracos da pista e manter os pneus grudados no ch\u00E3o, garantindo que o carro n\u00E3o perca o controle.',
        detailedExplanation: 'Os componentes da suspens\u00E3o (molas, amortecedores, bra\u00E7os oscilantes) ajudam a suavizar os impactos da estrada, mantendo os pneus em contato com o solo e dando estabilidade nas curvas. Se a suspens\u00E3o estiver ruim, o carro fica \'pulando\', o que aumenta a dist\u00E2ncia para parar e pode causar acidentes. Fique atento a barulhos estranhos e balan\u00E7os excessivos.',
        incidence: "baixa",
        difficulty: 3
    },
    {
        id: "q20",
        category: "infracoes",
        statement: "O uso de aparelhos celulares ao volante tem sido uma das maiores causas de acidentes graves no Brasil. De acordo com as alterações recentes do CTB, segurar ou manusear o telefone celular enquanto conduz o veículo configura qual tipo de infração de trânsito?",
        options: [
            "Infração média, punida com multa e 4 pontos na CNH.",
            "Infração de natureza grave, punida com multa administrativa e retenção preventiva da CNH.",
            "Infração gravíssima de trânsito, punida com multa e acúmulo de 7 pontos na CNH.",
            "Crime de trânsito inafiançável com suspensão do direito de dirigir por 6 meses.",
        ],
        correctIndex: 2,
        explanation: 'Usar celular enquanto dirige \u00E9 infra\u00E7\u00E3o grav\u00EDssima, com multa e 7 pontos na CNH.',
        detailedExplanation: 'Desde 2021, segurar o celular ao volante \u00E9 considerado grav\u00EDssimo. Voc\u00EA s\u00F3 pode usar em viva-voz ou com fone, sem tocar no aparelho. Olhar o mapa tamb\u00E9m \u00E9 infra\u00E7\u00E3o, ent\u00E3o use suporte fixo.',
        legalBase: "Art. 252, §1º do CTB",
        tip: 'Celular na m\u00E3o = grav\u00EDssima.',
        incidence: "altissima",
        difficulty: 3
    },
    {
        id: "q21",
        category: "placas",
        statement: "As placas de identificação de via e de orientação de destino integram o grupo de sinalização de indicação. Em rodovias federais e estaduais brasileiras, a padronização de cores de fundo e caracteres dessas placas é:",
        options: [
            "Fundo amarelo com caracteres pretos, destacando o nome das cidades próximas da rodovia.",
            "Fundo vermelho com caracteres brancos, indicando a proibição de prosseguimento na via.",
            "Fundo verde com caracteres brancos, podendo também ser azuis com caracteres brancos quando se destinam à orientação de destino.",
            "Fundo marrom com caracteres brancos, reservadas exclusivamente às orientações de caráter turístico.",
        ],
        correctIndex: 2,
        explanation: 'As placas de indica\u00E7\u00E3o t\u00EAm fundo verde ou azul com letras brancas.',
        detailedExplanation: 'Essas placas ajudam a gente a se localizar: AZUL indica servi\u00E7os como posto e restaurante; VERDE mostra sa\u00EDdas e cidades; MARROM \u00E9 pra atrativos tur\u00EDsticos; e BRANCAS com bordas pretas identificam logradouros. Elas s\u00F3 informam, n\u00E3o mandam fazer nada.',
        incidence: "media",
        difficulty: 3
    },
    {
        id: "q22",
        category: "legislacao",
        statement: "O SNT junta órgãos e entidades da União, estados, DF e municípios que cuidam de planejar, administrar, policiar e julgar o trânsito. Qual das opções indica corretamente um órgão executivo de trânsito que faz parte do SNT?",
        options: [
            "CONTRAN, o órgão máximo normativo e consultivo.",
            "DETRANs, que emitem habilitação e vistoriam veículos em cada estado.",
            "JARIs, colegiados de recurso exclusivos do Ministério dos Transportes.",
            "CFCs, que criam as regras das provas do DETRAN.",
        ],
        correctIndex: 1,
        explanation: 'Os DETRANs cuidam da CNH e do licenciamento de ve\u00EDculos no estado.',
        detailedExplanation: 'O Sistema Nacional de Tr\u00E2nsito (SNT) \u00E9 formado por v\u00E1rios \u00F3rg\u00E3os que gerenciam o tr\u00E2nsito no Brasil. Os principais s\u00E3o: o CONTRAN, que cria as regras, o SENATRAN, que \u00E9 o bra\u00E7o do governo federal, e os DETRANs, que atuam em cada estado.',
        legalBase: "Art. 5º a 25 do CTB",
        incidence: "media",
        difficulty: 3
    },
    {
        id: "q23",
        category: "direcao-defensiva",
        statement: "Sob chuva torrencial, a formação de lâmina d'água sobre a pista pode provocar a ocorrência do fenômeno físico da aquaplanagem. Sob a ótica da direção defensiva e do controle mecânico do veículo, como essa situação perigosa deve ser prevenida e tratada no instante exato de sua ocorrência?",
        options: [
            "Freada imediata e brusca acionando o pedal até o fim para reestabelecer o atrito.",
            "Redução gradual da velocidade antes da poça e, caso ocorra a flutuação, manter o volante firme, desacelerar suavemente sem pisar nos freios ou girar o volante bruscamente.",
            "Girar o volante rapidamente para a esquerda e para a direita alternadamente para expulsar a água acumulada sob as bandas de rodagem dos pneus.",
            "Aumentar a rotação do motor engatando uma marcha mais forte para forçar os pneus a romper a barreira líquida.",
        ],
        correctIndex: 1,
        explanation: 'Na aquaplanagem, se voc\u00EA frear ou virar o volante r\u00E1pido, perde o controle do carro. O certo \u00E9 segurar firme o volante e tirar o p\u00E9 do acelerador.',
        detailedExplanation: 'Aquaplanagem acontece quando tem \u00E1gua demais na pista e o pneu n\u00E3o consegue mais grudar no ch\u00E3o, fazendo o carro deslizar. Para evitar isso, reduza a velocidade na chuva, mantenha os pneus em bom estado e evite passar por po\u00E7as. Se acontecer, n\u00E3o freie nem vire o volante com for\u00E7a \u2014 s\u00F3 segure o volante e deixe o carro voltar ao normal.',
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "q24",
        category: "primeiros-socorros",
        statement: "Em caso de hemorragia externa severa decorrente de trauma sofrido por vítima de sinistro de trânsito, qual a manobra de suporte básico de vida indicada para conter a perda sanguínea de forma segura, até a chegada da equipe de socorro profissional?",
        options: [
            "Aplicar um torniquete com corda ou arame em qualquer ferimento localizado nos membros inferiores.",
            "Efetuar compressão direta sobre a lesão utilizando um pano limpo, exercendo pressão firme e contínua local do sangramento.",
            "Lavar o ferimento com água quente e aplicar pomadas cicatrizantes ou pó hemostático caseiro.",
            "Manter o membro afetado abaixado em relação ao nível do coração para desacelerar o fluxo sanguíneo local.",
        ],
        correctIndex: 1,
        explanation: 'A compress\u00E3o direta com pano limpo \u00E9 a melhor forma de parar o sangramento at\u00E9 o socorro chegar.',
        detailedExplanation: 'Primeiro, use luvas ou um saco pl\u00E1stico para n\u00E3o se contaminar. Depois, pressione o pano limpo ou a gaze diretamente na ferida e, se puder, levante o membro acima do cora\u00E7\u00E3o. N\u00E3o tire o pano se ele ficar encharcado, coloque outro por cima e mantenha a press\u00E3o at\u00E9 o socorro chegar.',
        commonMistake: 'Muita gente acha que o torniquete \u00E9 a solu\u00E7\u00E3o, mas a compress\u00E3o direta \u00E9 sempre a primeira op\u00E7\u00E3o.',
        incidence: "media",
        trap: true,
        difficulty: 3
    },
    {
        id: "q25",
        category: "prioridade",
        statement: "Uma ambulância particular estaciona em vaga de carga e descarga em via do perímetro urbano alegando prerrogativa legal. Para que a imunidade de circulação, parada e estacionamento seja válida, é necessário que:",
        options: [
            "Sejam veículos de grande porte, como caminhões de carga pesada e ônibus intermunicipais.",
            "Estejam em efetivo serviço de urgência, devidamente identificados por dispositivos regulamentares de alarme sonoro e iluminação intermitente vermelha acionados.",
            "Sejam conduzidos por motoristas profissionais habilitados exclusivamente na categoria E de habilitação.",
            "Trafeguem pelas faixas exclusivas destinadas ao transporte coletivo urbano durante o horário de pico.",
        ],
        correctIndex: 1,
        explanation: 'Ve\u00EDculos de emerg\u00EAncia precisam estar com a sirene e luzes ligadas pra ter prioridade. Sem isso, seguem as regras normais.',
        detailedExplanation: 'Quando os carros de emerg\u00EAncia est\u00E3o em servi\u00E7o, com sirene e giroflex ligados, eles t\u00EAm prioridade total: podem ultrapassar pela direita, acelerar acima do limite e passar no vermelho, desde que com cuidado. Os outros motoristas devem encostar \u00E0 direita pra dar passagem. Se n\u00E3o estiverem com os dispositivos ligados, perdem essa prioridade e devem seguir as regras normais.',
        legalBase: "Art. 29, VII e Art. 89 do CTB",
        incidence: "alta",
        difficulty: 3
    },
    {
        id: "p1",
        category: "placas",
        statement: "Em interseção do perímetro urbano sem semáforo, o condutor se aproxima da via transversal, onde a placa R-1 (PARADA OBRIGATÓRIA) acompanha a linha de retenção pintada na pista de rolamento. A conduta exigida pelo CTB é:",
        placa: "R-1",
        options: [
            "Reduzir a velocidade e ceder a passagem aos veículos da via transversal, sem necessidade de imobilizar o veículo.",
            "Imobilizar o veículo integralmente antes da linha de retenção, mesmo sem veículos convergindo, avaliar a interseção e só então prosseguir.",
            "Reduzir a velocidade e permanecer pronto para parar caso algum veículo se aproxime do ponto de conflito.",
            "Prosseguir mantendo o fluxo, pois a imobilização só é exigida quando houver tráfego convergente na interseção."
        ],
        correctIndex: 1,
        explanation: 'Parar o carro totalmente na faixa de reten\u00E7\u00E3o. Essa placa manda parar, n\u00E3o importa se t\u00E1 vazio.',
        detailedExplanation: 'A placa R-1 (PARE) \u00E9 octogonal e vermelha, feita pra ser vista f\u00E1cil, mesmo suja. Voc\u00EA precisa parar antes da faixa de reten\u00E7\u00E3o, mesmo que n\u00E3o tenha ningu\u00E9m por perto. Se n\u00E3o parar, \u00E9 infra\u00E7\u00E3o GRAV\u00CDSSIMA: 7 pontos na CNH e multa.',
        legalBase: "Art. 208 do CTB",
        tip: 'Parar = Respeitar o oct\u00F3gono vermelho.',
        incidence: "altissima",
        difficulty: 1
    },
    {
        id: "p2",
        category: "placas",
        statement: "O condutor se aproxima de interseção no perímetro urbano com via preferencial sinalizada e identifica a placa R-2 (DÊ A PREFERÊNCIA), de triângulo invertido, distinta da placa R-1. Diferente desta, a conduta exigida é:",
        placa: "R-2",
        options: [
            "Imobilizar o veículo completamente antes do ponto de conflito, como ocorreria diante da placa R-1.",
            "Reduzir a velocidade com segurança, ceder a passagem aos veículos da via preferencial e prosseguir quando houver intervalo seguro.",
            "Manter a velocidade constante, pois a placa apenas informa o traçado da via sem impor obrigação.",
            "Acelerar para ingressar na via preferencial antes da chegada dos demais veículos, aproveitando qualquer intervalo do fluxo."
        ],
        correctIndex: 1,
        explanation: 'A placa R-2 manda voc\u00EA dar a prefer\u00EAncia aos carros que j\u00E1 est\u00E3o na via preferencial.',
        detailedExplanation: 'Essa placa \u00E9 um tri\u00E2ngulo de ponta pra baixo, com fundo branco e borda vermelha. Voc\u00EA deve reduzir a velocidade e deixar passar os ve\u00EDculos que j\u00E1 est\u00E3o na via preferencial, mas n\u00E3o precisa parar se a via estiver livre.',
        commonMistake: 'Muita gente acha que \u00E9 igual ao PARE, mas n\u00E3o \u00E9! Tri\u00E2ngulo invertido \u00E9 prefer\u00EAncia, oct\u00F3gono \u00E9 PARE.',
        incidence: "altissima",
        trap: true,
        difficulty: 1
    },
    {
        id: "p3",
        category: "placas",
        statement: "Em via urbana central de intenso movimento, o condutor procura vaga e identifica a placa de regulamentação R-6a afixada em um poste. Pelo CTB, a distinção entre parada e estacionamento determinada por essa placa é:",
        placa: "R-6a",
        options: [
            "Proíbe qualquer parada no trecho, inclusive a imobilização breve para embarque de passageiros.",
            "Proíbe o estacionamento, mas admite a parada breve para embarque e desembarque de passageiros.",
            "Veda o estacionamento apenas nos horários indicados na placa auxiliar complementar instalada abaixo.",
            "Determina o estacionamento exclusivamente pelo lado direito da via, no sentido da circulação."
        ],
        correctIndex: 1,
        explanation: 'Essa placa diz que n\u00E3o pode deixar o carro parado ali, mas d\u00E1 pra parar rapidinho pra pegar ou deixar algu\u00E9m.',
        detailedExplanation: 'A placa R-6a pro\u00EDbe ESTACIONAR (deixar o carro parado por muito tempo), mas voc\u00EA pode parar rapidinho pra embarcar ou desembarcar passageiros ou fazer carga e descarga. Se estacionar onde n\u00E3o pode, \u00E9 multa m\u00E9dia: 4 pontos e multa, al\u00E9m de poder ter o carro guinchado pro p\u00E1tio.',
        commonMistake: 'Muita gente confunde com a R-6b, que pro\u00EDbe parar e estacionar, mas essa s\u00F3 pro\u00EDbe ESTACIONAR.',
        legalBase: "Art. 181 do CTB",
        tip: 'Placa com E cortada = s\u00F3 n\u00E3o pode Estacionar.',
        incidence: "altissima",
        difficulty: 1
    },
    {
        id: "p4",
        category: "placas",
        statement: "O condutor percorre via urbana e observa dois trechos distintos: um com a placa R-6a (E riscado) e outro, alguns metros adiante, com a placa R-6b (X vermelho). Enquanto a primeira veda o estacionamento, a segunda impõe:",
        placa: "R-6b",
        options: [
            "Restrição idêntica à da placa R-6a, vedando apenas o estacionamento prolongado no trecho.",
            "Vedação total de parada e estacionamento, alcançando também a imobilização breve para carga, desembarque ou embarque.",
            "Proibição de parada exclusivamente para veículos de grande porte, liberando os veículos de passeio.",
            "Vedação de estacionamento somente no período noturno, das 22h às 6h, nos trechos sinalizados."
        ],
        correctIndex: 1,
        explanation: 'A placa com o \'X\' vermelho pro\u00EDbe parar em qualquer situa\u00E7\u00E3o, at\u00E9 para embarque e desembarque.',
        detailedExplanation: 'Essa placa \u00E9 mais rigorosa que a que s\u00F3 corta a letra \'E\'. \u00C9 comum ver essa sinaliza\u00E7\u00E3o em lugares movimentados como hospitais e escolas. Parar onde n\u00E3o pode \u00E9 uma infra\u00E7\u00E3o grave, que d\u00E1 5 pontos e multa.',
        commonMistake: 'Muita gente acha que o \'X\' s\u00F3 pro\u00EDbe estacionar, mas na verdade pro\u00EDbe tudo.',
        incidence: "alta",
        difficulty: 2
    },
    {
        id: "p5",
        category: "placas",
        statement: "Em via arterial, o condutor transpõe a linha divisória de fluxos e ultrapassa o limite fixado na placa R-19 (velocidade máxima). Segundo o CTB, a natureza da infração varia conforme o percentual de excesso:",
        placa: "R-19",
        options: [
            "Aplica-se apenas advertência verbal do agente, sem imposição de multa, na primeira ocorrência.",
            "Média até 20% de excesso, grave de 20% a 50% e gravíssima acima de 50% do limite indicado na via.",
            "Aplica-se multa de valor fixo e único, independentemente da magnitude do excesso sobre o limite.",
            "Configura infração passível de apreensão imediata do veículo na ocasião da abordagem."
        ],
        correctIndex: 1,
        explanation: 'A placa R-19 mostra a velocidade que voc\u00EA N\u00C3O pode passar.',
        detailedExplanation: 'Essa placa indica o limite M\u00C1XIMO de velocidade na via. Se voc\u00EA passar desse limite, pode levar uma multa que varia: at\u00E9 20% a mais \u00E9 infra\u00E7\u00E3o m\u00E9dia; de 20% a 50% \u00E9 grave; e acima de 50% \u00E9 grav\u00EDssima, com multa maior e suspens\u00E3o da carteira. A velocidade m\u00EDnima \u00E9 outra placa, a R-20, que \u00E9 redonda e azul.',
        commonMistake: 'Muita gente confunde com a velocidade m\u00EDnima, mas a borda vermelha indica que \u00E9 proibi\u00E7\u00E3o de passar do limite m\u00E1ximo.',
        legalBase: "Art. 218 do CTB",
        incidence: "alta",
        trap: true,
        difficulty: 1
    },
    {
        id: "p6",
        category: "placas",
        statement: "Em estrada serrana de pista estreita, o condutor visualiza a placa de advertência A-1a instalada alguns metros antes de curva fechada à esquerda em declive. A conduta defensiva exigida com antecedência é:",
        placa: "A-1a",
        image_url: "https://tqeqsotsasglmhlmwdwy.supabase.co/storage/v1/object/public/library/images/placa-A-1a.png",
        options: [
            "Acelerar para transpor o trecho sinuoso no menor tempo possível, reduzindo a exposição ao risco.",
            "Manter a velocidade constante, pois a placa de advertência limita-se a descrever o traçado da via.",
            "Reduzir progressivamente antes da curva à esquerda, evitando frenagens bruscas no interior da curva.",
            "Acionar a sinalização de conversão e transpor para a pista contrária de modo a abrir melhor a curva."
        ],
        correctIndex: 2,
        explanation: 'Curva acentuada \u00E0 esquerda (placa de advert\u00EAncia) pede aten\u00E7\u00E3o.',
        detailedExplanation: 'Essa placa \u00E9 um losango amarelo que avisa que a curva \u00E0 frente \u00E9 fechada. O motorista deve diminuir a velocidade antes de entrar na curva para evitar acidentes.',
        tip: 'Curva fechada = Reduzir a velocidade.',
        incidence: "alta",
        difficulty: 1
    },
    {
        id: "p7",
        category: "placas",
        statement: "O condutor se aproxima de trecho com grande fluxo de pedestres e visualiza a placa de advertência A-32b instalada no canteiro central, anunciando instalação adiante na pista de rolamento. Essa placa indica:",
        image_url: "https://tqeqsotsasglmhlmwdwy.supabase.co/storage/v1/object/public/library/images/placa-passagem-sinalizada-de-pedestres-A32b.webp",
        placa: "A-32b",
        options: [
            "Escola nas proximidades, exigindo redução máxima apenas nos horários de entrada e saída de alunos.",
            "Passagem sinalizada de pedestres à frente, exigindo preparação para imobilizar o veículo e ceder a travessia.",
            "Ausência de travessia permitida a pedestres, permitindo manter a velocidade de cruzeiro.",
            "Possível travessia de animais na pista, recomendando atenção redobrada em baixa visibilidade."
        ],
        correctIndex: 1,
        explanation: 'A placa A-32b avisa que tem uma faixa de pedestres na frente.',
        detailedExplanation: 'Isso significa que o motorista precisa reduzir a velocidade e estar preparado para parar para os pedestres. Se atropelar algu\u00E9m na faixa, a situa\u00E7\u00E3o fica ainda pior. N\u00E3o confunda com a placa A-33a, que indica uma \u00E1rea escolar com crian\u00E7as.',
        commonMistake: 'Muita gente acha que qualquer faixa zebrada \u00E9 de pedestres, mas s\u00F3 \u00E9 se tiver a placa certa.',
        incidence: "alta",
        difficulty: 2
    },
    {
        id: "p8",
        category: "placas",
        statement: "Em via urbana no entorno de escola, durante horário de entrada, o condutor trafega junto à calçada escolar e visualiza a placa de advertência A-33a (ÁREA ESCOLAR). Pelo significado dessa sinalização e pela direção defensiva, a conduta correta é:",
        image_url: "https://tqeqsotsasglmhlmwdwy.supabase.co/storage/v1/object/public/library/images/placa-area-escolar-A-33A.webp",
        placa: "A-33a",
        options: [
            "Manter a velocidade, pois a placa de advertência meramente informa a existência de escola nas proximidades.",
            "Reduzir a velocidade, redobrar a atenção e manter prontidão para imobilizar o veículo diante de crianças entrando ou saindo.",
            "Considerar a via interditada para veículos durante todo o período letivo, buscando trajeto alternativo.",
            "Imobilizar o veículo obrigatoriamente, mesmo ausentes pedestres na faixa de travessia."
        ],
        correctIndex: 1,
        explanation: 'A placa A-33a indica que voc\u00EA est\u00E1 perto de uma escola, onde podem aparecer crian\u00E7as. ',
        detailedExplanation: 'Isso significa que voc\u00EA deve diminuir a velocidade e ficar de olho, pois as crian\u00E7as podem atravessar a rua a qualquer momento. Normalmente, a velocidade permitida \u00E9 de 30 a 40 km/h, e a fiscaliza\u00E7\u00E3o \u00E9 bem rigorosa nesses hor\u00E1rios.',
        incidence: "media",
        difficulty: 1
    },
    {
        id: "p9",
        category: "placas",
        statement: "Na interseção de via urbana, o condutor identifica a placa de regulamentação R-25d, de fundo azul, que fixa a trajetória obrigatória dos veículos automotores naquele ponto. Diante dela, o condutor está obrigado a:",
        placa: "R-25d",
        options: [
            "Imobilizar o veículo no trecho, admitindo conversões tanto à direita quanto à esquerda.",
            "Seguir em frente, vedadas as conversões à direita e à esquerda na interseção.",
            "Abster-se de ultrapassagens, admitindo a transposição de faixa quando necessário.",
            "Abster-se de estacionamento, liberadas todas as conversões na interseção."
        ],
        correctIndex: 1,
        explanation: 'Placa azul manda seguir em frente, n\u00E3o pode virar nem pra direita nem pra esquerda.',
        detailedExplanation: 'Essa placa de fundo azul \u00E9 uma REGULAMENTA\u00C7\u00C3O que obriga o motorista a ir em frente. N\u00E3o tem como desviar, s\u00F3 seguir a trajet\u00F3ria que a placa indica.',
        tip: 'Placa azul = siga em frente (obriga\u00E7\u00E3o).',
        incidence: "media",
        difficulty: 2
    },
    {
        id: "p10",
        category: "placas",
        statement: "Circulando em via urbana de bairro comercial, o condutor visualiza placa de sinalização com símbolo de hospital. Pela classificação da sinalização vertical prevista no CTB, essa placa de serviço auxiliar comunica:",
        placa: "I-Hospital",
        options: [
            "Posto de combustível adiante, tratando-se de serviço auxiliar de natureza rodoviária.",
            "Proximidade de hospital, tratando-se de placa de indicação meramente informativa, sem dever de conduta.",
            "Interdição da via por emergência hospitalar, exigindo desvio obrigatório do trajeto.",
            "Obrigação de estacionar e aguardar liberação pelos funcionários do estabelecimento de saúde."
        ],
        correctIndex: 1,
        explanation: 'Placa que mostra que tem um hospital por perto.',
        detailedExplanation: 'Essas placas de INDICA\u00C7\u00C3O t\u00EAm fundo AZUL e s\u00EDmbolo branco. Elas avisam sobre servi\u00E7os \u00FAteis na \u00E1rea, como hospital (cruz), posto de gasolina (P/bomba), telefone, restaurante, hospedagem e mais, mas n\u00E3o obrigam o motorista a fazer nada.',
        incidence: "media",
        difficulty: 1
    },
    {
        id: "q26",
        category: "legislacao",
        statement: "Candidato pretendendo obter habilitação nas categorias A (motocicletas) e B (veículos de passeio) consulta os requisitos exigidos pelo CTB. A idade mínima e as demais exigências para a habilitação nessas categorias são:",
        options: [
            "16 anos, desde que emancipado e com autorização dos genitores outorgada em cartório.",
            "17 anos, mediante aprovação em avaliação psicológica de maturidade conduzida pelo DETRAN.",
            "18 anos, ser imputável, saber ler e escrever, possuir documentos pessoais e ser aprovado nos exames físico, mental, teórico e prático.",
            "21 anos, idade mínima uniforme exigida para todas as categorias de habilitação."
        ],
        correctIndex: 2,
        explanation: 'Tem que ter 18 anos, saber ler e escrever, e ter CPF.',
        detailedExplanation: 'Pra tirar a CNH das categorias A (moto) e B (carro), o candidato precisa ter pelo menos 18 anos, ser penalmente respons\u00E1vel, saber ler e escrever, e ter documento de identidade e CPF. Se for tirar as categorias C, D e E, tem mais requisitos.',
        legalBase: "Art. 140 do CTB",
        incidence: "alta",
        difficulty: 1
    },
    {
        id: "q27",
        category: "legislacao",
        statement: "Condutor habilitado na categoria B deseja obter a categoria D para conduzir ônibus e vans escolares de transporte coletivo. Os requisitos de idade, tempo de habilitação e ausência de infrações exigidos pelo CTB são:",
        options: [
            "18 anos e 1 ano de categoria B, sem qualquer verificação de histórico de infrações.",
            "21 anos, 2 anos de categoria B (ou 1 ano de categoria C) e nenhuma infração grave ou gravíssima nos últimos 12 meses.",
            "Apenas o pagamento das taxas e comprovante de residência, sem exames adicionais.",
            "25 anos e curso superior em qualquer área, exigência específica para o transporte coletivo."
        ],
        correctIndex: 1,
        explanation: 'Pra ter a categoria D, precisa ter 21 anos, estar com a B h\u00E1 2 anos (ou 1 ano na C) e n\u00E3o ter feito falta grave nos \u00FAltimos 12 meses.',
        detailedExplanation: 'Se voc\u00EA quer dirigir \u00F4nibus ou vans, precisa ter 21 anos e estar habilitado na B por pelo menos 2 anos, ou na C por 1 ano. Al\u00E9m disso, \u00E9 preciso estar com a ficha limpa, sem infra\u00E7\u00F5es graves ou grav\u00EDssimas no \u00FAltimo ano. Esses detalhes s\u00E3o essenciais pra n\u00E3o errar na hora de pedir a nova habilita\u00E7\u00E3o.',
        legalBase: "Art. 145 do CTB",
        incidence: "media",
        difficulty: 2
    },
    {
        id: "q28",
        category: "legislacao",
        statement: "O DETRAN analisa o prontuário do condutor e verifica a repetição de uma mesma infração dentro do período de 12 meses. Pela regra de reincidência do CTB, a nova infração é punida com multa em dobro quando:",
        options: [
            "O condutor cometer duas ou mais infrações distintas em datas distintas, mesmo que de tipos diferentes.",
            "A mesma infração for cometida novamente no prontuário do condutor dentro do período de 12 meses.",
            "A pontuação na CNH atingir o limite que a lei prevê para a abertura de processo.",
            "A primeira multa for aplicada em estado diverso daquele em que a habilitação foi emitida."
        ],
        correctIndex: 1,
        explanation: 'Reincid\u00EAncia = mesma infra\u00E7\u00E3o dentro de 12 meses, com multa em dobro.',
        detailedExplanation: 'Reincid\u00EAncia acontece quando voc\u00EA comete a mesma infra\u00E7\u00E3o (mesmo artigo) mais de uma vez em 12 meses. N\u00E3o vale infra\u00E7\u00F5es diferentes, s\u00F3 a mesma. Se reincidir, a multa \u00E9 em dobro e voc\u00EA pode perder a chance de transformar a PPD em CNH definitiva.',
        legalBase: "Art. 259, §1º do CTB",
        incidence: "media",
        difficulty: 2
    },
    {
        id: "q29",
        category: "legislacao",
        statement: "Condutor consulta o sistema vigente de limites de pontos para abertura do processo de suspensão do direito de dirigir, alterado pela Lei 14.071/2021. Pela sistemática atual do CTB, a suspensão ocorre:",
        options: [
            "Limite fixo de 20 pontos em 12 meses, independentemente da natureza e da gravidade das infrações.",
            "40 pontos sem gravíssima, 30 pontos com uma gravíssima e 20 pontos com duas ou mais gravíssimas no período.",
            "14 pontos para qualquer condutor, sem distinção de categoria ou tipo de infração.",
            "Apenas em caso de existência de infração gravíssima, sem limite nos demais casos."
        ],
        correctIndex: 1,
        explanation: 'Hoje: 40 pontos sem infra\u00E7\u00E3o grav\u00EDssima; 30 pontos com 1 grav\u00EDssima; 20 pontos com 2 ou mais grav\u00EDssimas.',
        detailedExplanation: 'A Lei 14.071/2021 mudou as regras de suspens\u00E3o por pontos. Agora, o limite depende das infra\u00E7\u00F5es: 40 pontos se n\u00E3o tiver nenhuma grav\u00EDssima, 30 pontos com uma e 20 pontos com duas ou mais. Para quem dirige por profiss\u00E3o, o limite \u00E9 sempre 40 pontos, n\u00E3o importa as infra\u00E7\u00F5es.',
        legalBase: "Art. 261 do CTB (Lei 14.071/2021)",
        commonMistake: 'Muita gente ainda acha que o limite \u00E9 sempre 20 pontos, mas isso mudou em 2021.',
        incidence: "altissima",
        trap: true,
        difficulty: 3
    },
    {
        id: "q30",
        category: "legislacao",
        statement: "Condutor é parado em fiscalização na rodovia federal e o agente solicita os documentos de porte obrigatório. Pelo CTB e pelas resoluções do CONTRAN, para circular regularmente é necessário apresentar:",
        options: [
            "CNH ou PPD e CRLV-e, admitindo-se a apresentação em formato digital.",
            "Somente o CRLV-e, pois a habilitação é consultada automaticamente pelo agente.",
            "Somente a CNH, pois o licenciamento é consultado no sistema sem necessidade do documento.",
            "CRLV-e e comprovante de pagamento do IPVA impresso, sem exibição da CNH."
        ],
        correctIndex: 0,
        explanation: 'Tem que ter a CNH ou PPD e o CRLV em dia. As vers\u00F5es digitais (CDT/CRLV-e) valem igual aos pap\u00E9is.',
        detailedExplanation: 'Para dirigir tranquilo, voc\u00EA precisa mostrar a CNH ou a Permiss\u00E3o para Dirigir e o CRLV do carro. Pode ser no celular ou no papel, n\u00E3o tem problema, os dois s\u00E3o aceitos. E n\u00E3o esquece: o CRLV tem que estar atualizado todo ano!',
        legalBase: "Art. 159 do CTB",
        incidence: "alta",
        difficulty: 1
    },
    {
        id: "q31",
        category: "infracoes",
        statement: "Em estacionamento privado de uso coletivo, o condutor estaciona o veículo em vaga reservada a Pessoas com Deficiência sem expor no painel a credencial emitida pelo órgão de trânsito. Pelo CTB, essa conduta tipifica:",
        options: [
            "Infração leve, com advertência oral do agente e sem pontuação na CNH.",
            "Infração média, com multa e pontuação de 4 pontos, sem medida administrativa.",
            "Infração grave, com multa e pontuação de 5 pontos, convertível em advertência.",
            "Infração gravíssima, com multa, pontuação de 7 pontos na CNH e remoção do veículo."
        ],
        correctIndex: 3,
        explanation: 'Infra\u00E7\u00E3o grav\u00EDssima \u2014 7 pontos e multa. O mesmo vale para vaga de idoso (grave).',
        detailedExplanation: 'Estacionar em vaga de PCD sem a credencial vis\u00EDvel \u00E9 infra\u00E7\u00E3o GRAV\u00CDSSIMA: 7 pontos na CNH e multa. J\u00E1 a vaga de idoso \u00E9 infra\u00E7\u00E3o GRAVE (5 pontos). As vagas para PCD t\u00EAm regras mais r\u00EDgidas, ent\u00E3o a credencial deve estar sempre \u00E0 vista. Mesmo se a vaga estiver livre, n\u00E3o pode usar sem a credencial.',
        legalBase: "Art. 181, XVII do CTB",
        incidence: "alta",
        difficulty: 1
    },
    {
        id: "q32",
        category: "infracoes",
        statement: "Em fiscalização em via urbana do perímetro, o agente constata que o condutor está dirigindo sem possuir CNH nem Permissão para Dirigir (PPD). Pelo CTB, a infração aplicável e a medida administrativa previstas são:",
        options: [
            "Infração leve, com advertência escrita na primeira ocorrência e sem retenção do veículo.",
            "Infração média, com multa e pontuação de 4 pontos, permitindo o seguimento da viagem.",
            "Infração grave, com multa e pontuação de 5 pontos, sem retenção do veículo.",
            "Infração gravíssima, com multa multiplicada por 3 e retenção do veículo até a chegada de condutor habilitado, podendo configurar crime."
        ],
        correctIndex: 3,
        explanation: 'Infra\u00E7\u00E3o grav\u00EDssima \u2014 multa tripla e o carro fica retido at\u00E9 aparecer um motorista habilitado.',
        detailedExplanation: 'Dirigir sem ter CNH ou PPD \u00E9 uma infra\u00E7\u00E3o GRAV\u00CDSSIMA, com multa multiplicada por 3. Se isso gerar perigo, pode at\u00E9 ser considerado crime, com pena de 6 meses a 1 ano de deten\u00E7\u00E3o. Lembre-se: dirigir sem CNH \u00E9 grave, mas se tiver CNH e n\u00E3o a portar, \u00E9 leve.',
        legalBase: "Art. 162, I do CTB",
        incidence: "alta",
        difficulty: 1
    },
    {
        id: "q33",
        category: "infracoes",
        statement: "Pais pretendem transportar filha de 6 anos no banco dianteiro do veículo de passeio, sem cadeira ou dispositivo de retenção adequado à idade. Pelo CTB e pelas normas do CONTRAN, essa conduta configura infração de natureza:",
        options: [
            "Infração leve, com multa e pontuação de 3 pontos na CNH do condutor.",
            "Infração média, com multa e pontuação de 4 pontos, permitindo o transporte na frente.",
            "Infração grave, com multa e pontuação de 5 pontos, sem retenção ou remoção do veículo.",
            "Infração gravíssima, com multa e pontuação de 7 pontos, pois crianças menores de 10 anos viajam no banco traseiro com dispositivo adequado."
        ],
        correctIndex: 3,
        explanation: 'Grav\u00EDssima \u2014 crian\u00E7as at\u00E9 10 anos v\u00E3o atr\u00E1s, em dispositivo adequado \u00E0 idade.',
        detailedExplanation: 'Crian\u00E7as com at\u00E9 10 anos devem ir no banco de tr\u00E1s, usando o equipamento certo para a idade: beb\u00EA conforto, cadeirinha ou assento de eleva\u00E7\u00E3o. Ignorar isso \u00E9 infra\u00E7\u00E3o GRAV\u00CDSSIMA, com 7 pontos na CNH e multa. Muita gente acha que \u00E9 \'grave\', mas \u00E9 grav\u00EDssima pela seguran\u00E7a da crian\u00E7a.',
        legalBase: "Art. 168 do CTB / Res. CONTRAN 277",
        commonMistake: 'Muita gente confunde e acha que \u00E9 \'grave\', mas \u00E9 GRAV\u00CDSSIMA.',
        incidence: "alta",
        trap: true,
        difficulty: 2
    },
    {
        id: "q34",
        category: "infracoes",
        statement: "Dois motoristas são flagrados pela Polícia Rodoviária em disputa de velocidade e arrancadas (\"racha\") em via pública aberta, colocando em risco os demais usuários. Pelo CTB, a classificação e as consequências dessa conduta são:",
        options: [
            "Infração média, com multa, 4 pontos na CNH e nenhuma medida administrativa.",
            "Infração grave, com multa, 5 pontos e conversão em advertência na primeira vez.",
            "Infração gravíssima com multa de 10 vezes, suspensão da CNH, recolhimento da habilitação, remoção do veículo e ainda crime de trânsito.",
            "Advertência verbal do agente, se a disputa cessar imediatamente e ninguém se lesione."
        ],
        correctIndex: 2,
        explanation: 'Racha \u00E9 infra\u00E7\u00E3o grav\u00EDssima com multa multiplicada por dez, suspens\u00E3o da CNH e o carro pode ser guinchado.',
        detailedExplanation: 'Fazer \'racha\' na rua \u00E9 uma das infra\u00E7\u00F5es mais s\u00E9rias que existem. A multa \u00E9 dez vezes maior e o motorista pode perder a CNH na hora. Al\u00E9m disso, isso \u00E9 crime, podendo dar at\u00E9 3 anos de cadeia.',
        legalBase: "Art. 173 e 308 do CTB",
        incidence: "media",
        difficulty: 1
    },
    {
        id: "q35",
        category: "direcao-defensiva",
        statement: "Em aula de direção defensiva, o instrutor determina verificação por cima do ombro antes da transposição de faixa, mesmo com retrovisores regulados, citando um ângulo que os espelhos não cobrem. Essas áreas são os chamados:",
        options: [
            "Pontos cegos, delimitados pelas colunas do veículo, exigindo olhar direto antes de qualquer mudança de faixa.",
            "Cantos internos escuros do habitáculo que escondem ocupantes do banco traseiro à noite.",
            "Pontos de desgaste da banda de rodagem que pedem rodízio e balanceamento dos pneus.",
            "Manchas do para-brisa que reduzem a visão sob incidência solar frontal intensa."
        ],
        correctIndex: 0,
        explanation: 'S\u00E3o \u00E1reas que n\u00E3o aparecem nos espelhos \u2014 sempre d\u00EA uma olhadinha por cima do ombro antes de trocar de faixa.',
        detailedExplanation: 'Os pontos cegos s\u00E3o regi\u00F5es ao redor do carro que os retrovisores n\u00E3o conseguem mostrar, geralmente nas laterais traseiras, escondidos pelas colunas. Um motoqueiro ou um carro menor pode sumir ali. Por isso, \u00E9 importante olhar por cima do ombro antes de mudar de faixa ou fazer uma curva.',
        incidence: "alta",
        difficulty: 1
    },
    {
        id: "q36",
        category: "direcao-defensiva",
        statement: "O condutor desce serra longa e íngreme e precisa conter a velocidade permanente sem sobrecarregar o sistema de freios pelo atrito. Pela direção defensiva e pelas regras do CTB, a forma segura de efetuar a descida é:",
        options: [
            "Descer em ponto morto (neutro), deixando a gravidade atuar e acionando o freio de serviço periodicamente.",
            "Descer desengrenado para economizar combustível, freando de forma brusca apenas ao exceder o limite.",
            "Descer engrenado em marcha reduzida, utilizando o freio-motor e acionando o freio de serviço só eventualmente.",
            "Manter o pé no freio durante toda a descida com marcha alta engatada para não forçar o motor."
        ],
        correctIndex: 2,
        explanation: 'Usar marcha reduzida e freio motor evita que os freios esquentem demais.',
        detailedExplanation: 'Descer em ponto morto (banguela) \u00E9 PROIBIDO e arriscado \u2014 voc\u00EA perde a ajuda do motor e sobrecarrega os freios, que podem falhar. O certo \u00E9 engatar uma marcha reduzida e deixar o motor ajudar a controlar a velocidade.',
        legalBase: "Art. 231, IX do CTB",
        commonMistake: 'Descer em \'N\' parece uma boa ideia, mas \u00E9 infra\u00E7\u00E3o e muito perigoso.',
        incidence: "alta",
        trap: true,
        difficulty: 2,
        group: "freio-motor-declive"
    },
    {
        id: "q37",
        category: "direcao-defensiva",
        statement: "Em rodovia de pista dupla com tráfego intenso, o veículo precedente mantém velocidade reduzida e o condutor decide ultrapassá-lo. Pelo CTB e pela direção defensiva, o procedimento correto ANTES de iniciar a ultrapassagem é:",
        options: [
            "Executar a transposição para a faixa da esquerda sem sinalização, confiando na aceleração para concluir a manobra.",
            "Conferir visibilidade e espaço, sinalizar com a seta esquerda, verificar retrovisores e ponto cego e só então acelerar.",
            "Buzinar de forma contínua até o veículo da frente se deslocar para o bordo da pista ou acostamento.",
            "Acionar o pisca-alerta e aguardar, pois a ultrapassagem só se efetiva com o veículo precedente imobilizado."
        ],
        correctIndex: 1,
        explanation: 'Ultrapassagem segura = visibilidade + seta + espelhos + ponto cego.',
        detailedExplanation: 'Antes de ultrapassar, olhe se a pista t\u00E1 livre e se tem sinaliza\u00E7\u00E3o boa. Depois, coloque a seta pra esquerda, cheque os retrovisores e o ponto cego e acelere com cuidado pra passar e voltar pra faixa. N\u00E3o esque\u00E7a de sinalizar pra direita ao voltar!',
        incidence: "alta",
        difficulty: 1
    },
    {
        id: "q38",
        category: "direcao-defensiva",
        statement: "Em rodovia de pista única, condutor precisa ultrapassar caminhão lento e consulta as regras de circulação e sinalização vigentes. Pelo CTB, o local em que a ultrapassagem é terminantemente PROIBIDA é:",
        options: [
            "Reta com boa visibilidade e sinalização horizontal tracejada, onde a manobra é permitida com segurança.",
            "Ponte, viaduto, túnel, curva, aclive sem visibilidade e trecho com faixa contínua.",
            "Qualquer rodovia federal, independentemente do que dispuser a sinalização horizontal de solo.",
            "Período diurno, quando o fluxo contrário dificulta o cálculo da distância segura."
        ],
        correctIndex: 1,
        explanation: 'Ultrapassagem \u00E9 proibida em pontes, viadutos, t\u00FAneis, curvas, aclives sem visibilidade e faixa cont\u00EDnua.',
        detailedExplanation: 'O CTB diz que n\u00E3o se pode ultrapassar nesses lugares por seguran\u00E7a. A faixa cont\u00EDnua avisa que n\u00E3o \u00E9 pra ultrapassar, enquanto a tracejada permite, se for seguro. Fazer isso em lugar proibido \u00E9 uma infra\u00E7\u00E3o GRAV\u00CDSSIMA, com multa bem salgada, multiplicada por 5.',
        legalBase: "Art. 203 do CTB",
        incidence: "alta",
        difficulty: 1
    },
    {
        id: "q39",
        category: "primeiros-socorros",
        statement: "Após colisão em via urbana, a vítima é encontrada caída ao lado do veículo com dor intensa e deformidade evidente no braço e antebraço, sugestiva de fratura. Até a chegada do socorro, a conduta correta é:",
        options: [
            "Tentar recolocar o osso na posição original, puxando o membro para aliviar a dor da vítima.",
            "Imobilizar o membro na posição encontrada, com talas improvisadas e ataduras sem compressão excessiva, aguardando o socorro.",
            "Movimentar o braço e solicitar que a vítima execute gestos para dimensionar a extensão da fratura.",
            "Massagear vigorosamente a região lesionada para ativar a circulação e reduzir o edema."
        ],
        correctIndex: 1,
        explanation: 'Nunca tente colocar o osso no lugar. Imobilize o bra\u00E7o do jeito que est\u00E1 e chame o SAMU.',
        detailedExplanation: 'Se voc\u00EA suspeita que algu\u00E9m quebrou o bra\u00E7o, n\u00E3o mexa no osso. Imobilize o bra\u00E7o na posi\u00E7\u00E3o que ele est\u00E1, usando coisas como papel\u00E3o ou madeira, e prenda com ataduras, mas sem apertar muito. Depois, espere o SAMU chegar para ajudar.',
        incidence: "media",
        difficulty: 2
    },
    {
        id: "q40",
        category: "primeiros-socorros",
        statement: "Presenciando acidente grave no perímetro urbano com vítimas feridas que necessitam de atendimento médico imediato, o condutor parou para ajudar. O número correto para acionar o socorro médico de urgência é:",
        options: [
            "190 — Polícia Militar, responsável pelo transporte das vítimas ao hospital.",
            "192 — SAMU (Serviço de Atendimento Móvel de Urgência), que presta o socorro médico de urgência.",
            "193 — Corpo de Bombeiros Militar, que atende ocorrências nas vias urbanas.",
            "199 — Defesa Civil, que remove os veículos sinistrados da pista."
        ],
        correctIndex: 1,
        explanation: 'Ligue 192 para chamar o SAMU, que cuida de emerg\u00EAncias m\u00E9dicas.',
        detailedExplanation: 'Em acidentes com feridos, \u00E9 importante saber os n\u00FAmeros certos. O SAMU atende pelo 192, enquanto os Bombeiros v\u00E3o pelo 193, a Pol\u00EDcia Militar pelo 190 e a PRF pelo 191. Confundir esses n\u00FAmeros pode atrasar o socorro e prejudicar as v\u00EDtimas.',
        tip: 'Acidente = Ligue 1-9-2!',
        incidence: "alta",
        difficulty: 1
    },
    {
        id: "q41",
        category: "primeiros-socorros",
        statement: "Mecânico encostou na mangueira quente do radiador e sofreu queimadura de segundo grau no antebraço, com bolhas formadas. Pelas regras de atendimento a queimaduras, a conduta que o socorrista NÃO deve executar é:",
        options: [
            "Aplicar água corrente limpa em temperatura ambiente por vários minutos para resfriar a lesão.",
            "Cobrir a lesão com pano limpo ou gaze umedecida, protegendo-a antes do atendimento médico.",
            "Passar pasta de dentes, manteiga ou pomada caseira sob a alegação de cicatrizar mais rápido.",
            "Encaminhar a vítima ao médico especializado o quanto antes para avaliação e tratamento."
        ],
        correctIndex: 2,
        explanation: 'Pasta de dente e manteiga s\u00F3 pioram a queimadura e podem causar infec\u00E7\u00E3o.',
        detailedExplanation: 'Quando algu\u00E9m se queima, o certo \u00E9 resfriar a \u00E1rea com \u00E1gua corrente em temperatura ambiente por uns 10 minutos, nunca usar gelo. Depois, \u00E9 s\u00F3 cobrir com um pano limpo e procurar um m\u00E9dico. Nunca use pasta de dente, manteiga ou qualquer coisa caseira, porque isso s\u00F3 agrava a situa\u00E7\u00E3o e pode infeccionar.',
        incidence: "media",
        trap: true,
        difficulty: 1
    },
    {
        id: "q42",
        category: "primeiros-socorros",
        statement: "Após colisão frontal entre dois veículos, o socorrista encontra o motorista inconsciente, sem movimentos torácicos e sem respiração espontânea. Pelo suporte básico de vida, a conduta imediata até o socorro chegar é:",
        options: [
            "Aguardar passivamente a chegada do resgate, sem intervir na vítima.",
            "Iniciar imediatamente as compressões torácicas da RCP, em ritmo de 100 a 120 por minuto, até a chegada do socorro.",
            "Oferecer pequenos goles de água para verificar se a vítima engole e retomar a respiração.",
            "Sacudir vigorosamente os ombros e percutir o rosto para tentar acordar a vítima."
        ],
        correctIndex: 1,
        explanation: 'Parada respirat\u00F3ria = iniciar RCP (100 a 120 compress\u00F5es/min no centro do peito).',
        detailedExplanation: 'Quando algu\u00E9m para de respirar, \u00E9 hora de agir r\u00E1pido. Primeiro, veja se a pessoa est\u00E1 acordada e respirando; se n\u00E3o, chame o SAMU (192) ou pe\u00E7a ajuda. Depois, comece as compress\u00F5es tor\u00E1cicas no centro do peito, bem firme e r\u00E1pido, at\u00E9 o socorro chegar.',
        incidence: "alta",
        difficulty: 2
    },
    {
        id: "q43",
        category: "meio-ambiente",
        statement: "À noite, em via residencial do perímetro urbano, um condutor aciona a buzina de forma prolongada e repetida apenas para chamar um morador do prédio. Pela regra do CTB sobre uso do sinal sonoro, a conduta correta é:",
        options: [
            "O uso do sinal sonoro é livre a qualquer hora, pois constitui direito do condutor de avisar os demais usuários.",
            "Usar em toques curtos apenas para alertar perigo imediato, vedado o uso prolongado, especialmente próximo a hospitais e escolas.",
            "Buzinar para cumprimentar pedestres na calçada, por configurar costume social aceitável no convívio urbano.",
            "Buzinar à frente de hospitais e escolas desde que o veículo transite em baixa velocidade."
        ],
        correctIndex: 1,
        explanation: 'Buzina longa \u00E9 polui\u00E7\u00E3o sonora e infra\u00E7\u00E3o leve.',
        detailedExplanation: 'A buzina s\u00F3 pode ser usada em toques curtos para avisar sobre perigo. Usar de forma prolongada ou em lugares como hospitais e escolas \u00E9 proibido, e isso gera multa e pontos na carteira. Al\u00E9m disso, o barulho excessivo atrapalha a vida da galera na cidade.',
        legalBase: "Art. 227 do CTB",
        incidence: "media",
        difficulty: 1
    },
    {
        id: "q44",
        category: "meio-ambiente",
        statement: "Em rodovia estadual, passageiro arremessa embalagem de lanche pela janela durante o trajeto e o material cai na pista de rolamento. Pelo CTB, que pune posturas contra o meio ambiente, a classificação da infração e o responsável são:",
        options: [
            "Infração leve, com mera advertência escrita e sem aplicação de pontos na CNH.",
            "Infração média, com multa e 4 pontos na CNH, respondendo o condutor pela conduta do passageiro.",
            "Infração grave, com multa, pontos e suspensão do licenciamento do veículo.",
            "Infração gravíssima, com multa multiplicada por três e remoção imediata do veículo."
        ],
        correctIndex: 1,
        explanation: 'Infra\u00E7\u00E3o m\u00E9dia \u2014 4 pontos. Isso pode causar inc\u00EAndios e acidentes.',
        detailedExplanation: 'Jogar coisas pela janela do carro \u00E9 uma infra\u00E7\u00E3o M\u00C9DIA (4 pontos na CNH e multa). Embora pare\u00E7a bobeira, pode causar inc\u00EAndios ou acidentes s\u00E9rios, como com motociclistas. O motorista \u00E9 respons\u00E1vel pelo que o passageiro faz e deve descartar o lixo de forma correta.',
        legalBase: "Art. 172 do CTB",
        incidence: "media",
        difficulty: 1
    },
    {
        id: "q45",
        category: "mecanica",
        statement: "O condutor usa o veículo diariamente para o trabalho e quer pneu seguro, estabilidade e consumo controlado. Pela manutenção preventiva, o intervalo e o momento corretos para conferir a pressão dos pneus são:",
        options: [
            "Uma vez por ano, junto com a troca de óleo, pois a pressão se mantém estável por longos períodos.",
            "A cada 15 dias e antes de viagens longas, com os pneus frios (parados há pelo menos duas horas).",
            "Somente quando o veículo puxa lateralmente na direção, sinal de despressão acentuada.",
            "Apenas antes de iniciar trajeto rodoviário, sem necessidade de conferência no uso urbano."
        ],
        correctIndex: 1,
        explanation: 'Verifique a calibragem a cada 15 dias e antes de viagens. Pneu frio garante leitura certa.',
        detailedExplanation: '\u00C9 importante checar a calibragem dos pneus pelo menos a cada 15 dias e antes de longas viagens. Calibre sempre com os pneus frios, ou seja, o carro parado h\u00E1 pelo menos 2 horas ou que rodou bem pouco, porque o ar quente pode dar uma leitura errada. Pneus descalibrados gastam mais combust\u00EDvel e podem causar problemas na dire\u00E7\u00E3o e frenagem.',
        incidence: "media",
        difficulty: 1
    },
    {
        id: "q46",
        category: "mecanica",
        statement: "Durante revisão, o mecânico aponta os caroços de borracha posicionados no fundo dos sulcos da banda de rodagem (TWI). Pelo limite legal de desgaste, a função desse indicador e o critério de troca do pneu são:",
        options: [
            "Identifica marca e modelo do pneu para recompra do mesmo item quando necessário.",
            "Marca o limite mínimo legal dos sulcos (1,6 mm), sinalizando a substituição obrigatória do pneu ao atingi-lo.",
            "Mede a pressão de inflagem em tempo real, dispensando o uso de manômetro externo.",
            "Indica a data de validade do pneu, prorrogável desde que sem danos na banda de rodagem."
        ],
        correctIndex: 1,
        explanation: 'TWI \u00E9 o indicador que mostra quando o pneu t\u00E1 no limite e precisa ser trocado.',
        detailedExplanation: 'O TWI s\u00E3o aqueles ressaltos que aparecem no fundo dos sulcos do pneu. Quando a borracha chega nesses ressaltos, significa que o pneu t\u00E1 com menos de 1,6 mm de profundidade, que \u00E9 o m\u00EDnimo permitido. Usar pneus assim \u00E9 uma infra\u00E7\u00E3o GRAV\u00CDSSIMA e pode causar acidentes, principalmente em dias de chuva.',
        incidence: "media",
        difficulty: 2
    },
    {
        id: "q47",
        category: "mecanica",
        statement: "Para conferir o nível do óleo lubrificante pela vareta instalada sob o capô, a leitura precisa refletir o volume real existente no cárter do motor. O momento técnico correto e as condições ideais para essa verificação são:",
        options: [
            "Com o motor quente e em funcionamento, com o óleo distribuído por todo o sistema.",
            "Com o veículo em superfície plana e o motor frio ou desligado há alguns minutos, permitindo o retorno do óleo ao cárter.",
            "Somente em oficina, durante a troca programada, pois o condutor não domina a leitura.",
            "Uma vez por ano, na revisão geral, independentemente da quilometragem acumulada."
        ],
        correctIndex: 1,
        explanation: 'Estacionar em terreno plano + motor frio = leitura certa da vareta.',
        detailedExplanation: 'Pra ver o n\u00EDvel de \u00F3leo do motor, voc\u00EA usa a vareta medidora. Primeiro, pare o carro em um lugar plano, desligue o motor e espere alguns minutinhos pra o \u00F3leo descer pro c\u00E1rter. Depois, retire a vareta, limpe, coloque de volta e tire de novo pra checar se t\u00E1 entre as marcas de m\u00EDnimo e m\u00E1ximo.',
        incidence: "baixa",
        difficulty: 1
    },
    {
        id: "q48",
        category: "mecanica",
        statement: "No meio de uma rodovia, acende e permanece acesa, sem apagar, a luz vermelha com desenho de bateria no painel de instrumentos. Pelo significado dessa sinalização, o problema indicado e a conduta segura são:",
        options: [
            "Falha no sistema de carga (alternador, correia ou bateria): imobilizar em local seguro e acionar assistência.",
            "Nível de combustível na reserva: prosseguir até o posto de abastecimento mais próximo.",
            "Desgaste de pastilhas de freio: encaminhar o veículo diretamente à oficina mecânica.",
            "Pressão irregular de pneus: conferir a calibragem do conjunto em posto conveniente."
        ],
        correctIndex: 0,
        explanation: 'Luz vermelha acesa = problema na bateria. Se continuar, o carro pode parar de funcionar.',
        detailedExplanation: 'A luz da bateria indica que o carro n\u00E3o est\u00E1 carregando direito. Isso pode ser por causa do alternador, da correia ou da pr\u00F3pria bateria. Se voc\u00EA ver essa luz, \u00E9 melhor parar em um lugar seguro e pedir ajuda, porque o carro vai parar quando a bateria acabar.',
        incidence: "media",
        difficulty: 2
    },
    {
        id: "q49",
        category: "prioridade",
        statement: "Na pista de rolamento de via urbana, cruzam-se ao mesmo tempo automóvel, ciclista em faixa própria e pedestre na faixa de travessia, enquanto se aproxima ambulância em serviço com sirene em funcionamento. A ordem de prioridade de passagem é:",
        options: [
            "Primeiro os veículos de maior porte, depois o ciclista e, por último, o pedestre, pela hierarquia de massa viária.",
            "Primeiro a ambulância em serviço de urgência, depois o pedestre, em seguida o ciclista e, por último, os demais veículos.",
            "Prevalece a ordem cronológica de chegada à interseção, independentemente da classe de usuário da via.",
            "Primeiro os veículos automotores mais ágeis, depois a bicicleta e, por último, a ambulância em urgência."
        ],
        correctIndex: 1,
        explanation: 'A prioridade \u00E9: emerg\u00EAncia > pedestre > n\u00E3o motorizado > motorizado.',
        detailedExplanation: 'Na via, quem tem mais direito \u00E9 a ambul\u00E2ncia com sirene. Depois, os pedestres que est\u00E3o na faixa, seguidos das bicicletas e, por \u00FAltimo, os carros. Essa ordem ajuda a proteger quem est\u00E1 mais vulner\u00E1vel no tr\u00E2nsito.',
        legalBase: "Art. 29, §2º do CTB",
        incidence: "alta",
        difficulty: 2
    },
    {
        id: "q50",
        category: "legislacao",
        statement: "O condutor circula em via urbana local de acesso residencial, sem sinalização regulamentadora de velocidade e com grande movimentação de pedestres. Pelo limite padrão do CTB (Art. 61) para essa classe de via, a velocidade máxima é de:",
        options: [
            "20 km/h, limite restrito às vias exclusivas de pedestres e ciclistas.",
            "30 km/h, padrão das vias locais de trânsito calmo e acesso restrito.",
            "40 km/h, padrão das vias coletoras urbanas sem sinalização.",
            "60 km/h, padrão das vias arteriais urbanas com interseções em nível."
        ],
        correctIndex: 1,
        explanation: 'Em rua residencial sem placa, a velocidade m\u00E1xima \u00E9 30 km/h.',
        detailedExplanation: 'Quando n\u00E3o tem sinaliza\u00E7\u00E3o, o CTB diz que as vias locais, que s\u00E3o mais tranquilas e t\u00EAm mais pedestres, devem ter limite de 30 km/h. As outras vias t\u00EAm limites maiores: coletoras 40 km/h, arteriais 60 km/h e tr\u00E2nsito r\u00E1pido 80 km/h. Lembre-se da sequ\u00EAncia: 30, 40, 60, 80.',
        legalBase: "Art. 61 do CTB",
        incidence: "alta",
        difficulty: 2
    },
    {
        id: "q51",
        category: "legislacao",
        statement: "O condutor trafega com automóvel de passeio em rodovia de pista dupla em trecho rural, onde não há sinalização regulamentadora de velocidade. Pelo CTB, o limite máximo para automóveis, camionetas e motocicletas nessa pista de rolamento é de:",
        options: [
            "80 km/h, limite dos demais veículos na pista dupla, como caminhões e conjuntos articulados.",
            "100 km/h, máxima aplicável às estradas rurais não pavimentadas.",
            "110 km/h, limite do CTB para automóveis, camionetas e motocicletas em rodovia de pista dupla.",
            "120 km/h, admitida em rodovias federais concedidas, independentemente de sinalização."
        ],
        correctIndex: 2,
        explanation: 'Rodovia: carro 110, \u00F4nibus 90 e outros 80. Estrada n\u00E3o pavimentada: 60.',
        detailedExplanation: 'Em rodovias sem placas, os limites s\u00E3o: carro, caminhonete e moto: 110 km/h; \u00F4nibus: 90 km/h; e outros ve\u00EDculos: 80 km/h. Em estradas n\u00E3o pavimentadas, o limite \u00E9 60 km/h. Lembre-se que em pista simples, os limites caem 10 km/h.',
        legalBase: "Art. 61, §1º do CTB",
        incidence: "alta",
        difficulty: 2
    },
    {
        id: "q52",
        category: "infracoes",
        statement: "Em via arterial do perímetro urbano com velocidade máxima de 60 km/h, radar fixo registra veículo a 95 km/h — excesso superior a 50% do limite. Pelo CTB, a natureza da infração e suas consequências são:",
        options: [
            "Média — multa simples e pontuação de 4 pontos na CNH, sem outras medidas.",
            "Grave — multa e pontuação de 5 pontos, com possibilidade de advertência por escrito.",
            "Gravíssima — multa multiplicada por 3, 7 pontos e suspensão imediata do direito de dirigir.",
            "Leve — simples advertência verbal, se não houver dano material."
        ],
        correctIndex: 2,
        explanation: 'Infra\u00E7\u00E3o grav\u00EDssima, multa tripla, 7 pontos e suspens\u00E3o da CNH na hora.',
        detailedExplanation: 'Quando voc\u00EA passa do limite de velocidade, as multas variam: at\u00E9 20% \u00E9 m\u00E9dia, de 20% a 50% \u00E9 grave, e acima de 50% \u00E9 grav\u00EDssima. Nesse caso, como o carro estava a 95 km/h em uma via de 60 km/h, a multa \u00E9 multiplicada por tr\u00EAs e a CNH \u00E9 suspensa na hora, sem precisar de processo.',
        legalBase: "Art. 218, III do CTB",
        incidence: "alta",
        difficulty: 2
    },
    {
        id: "q53",
        category: "direcao-defensiva",
        statement: "Condutor trafega de dia em rodovia de pista única fora do perímetro urbano, com sol e boa visibilidade, e consulta a regra atual do uso do farol baixo prevista no CTB. Nesse cenário, a conduta legal é:",
        options: [
            "É proibido o uso durante o dia, pois consome energia e pode ofuscar os demais condutores.",
            "É obrigatório fora do perímetro urbano em pista simples, admitindo-se o uso do sistema DRL se o veículo possuir.",
            "É opcional durante o dia, ficando a critério do condutor manter o farol aceso.",
            "Só é exigido em túnel iluminado ou sob chuva e neblina de intensidade elevada."
        ],
        correctIndex: 1,
        explanation: '\u00C9 obrigat\u00F3rio usar farol baixo durante o dia em rodovias de pista simples. Se o carro tiver, pode usar a luz de condu\u00E7\u00E3o diurna (DRL).',
        detailedExplanation: 'Desde a Lei 13.290/2016, \u00E9 regra ter o farol baixo aceso em rodovias, mesmo com boa visibilidade. Isso ajuda outros motoristas a verem o carro, diminuindo o risco de acidentes. A luz de condu\u00E7\u00E3o diurna (DRL) pode ser usada no lugar do farol baixo, j\u00E1 que serve pra deixar o ve\u00EDculo mais vis\u00EDvel. Nas cidades, essa regra n\u00E3o vale, a n\u00E3o ser em t\u00FAneis ou em situa\u00E7\u00F5es de chuva e neblina.',
        legalBase: "Art. 250 do CTB",
        incidence: "media",
        difficulty: 2
    },
    {
        id: "q54",
        category: "legislacao",
        statement: "Candidato aprovado nos exames teórico e prático recebe a Permissão para Dirigir (PPD) do DETRAN, documento provisório anterior à CNH definitiva. Pelo CTB, o prazo de vigência desse documento em estágio probatório é de:",
        options: [
            "3 meses, prazo destinado exclusivamente à realização do exame prático de direção.",
            "6 meses, tempo máximo para concluir as etapas iniciais do processo de habilitação.",
            "1 ano, vigência da PPD no estágio probatório anterior à expedição da CNH definitiva.",
            "2 anos, idêntico ao prazo de validade das avaliações psicológicas do processo."
        ],
        correctIndex: 2,
        explanation: 'A PPD vale por 1 ano. Se n\u00E3o rolar infra\u00E7\u00E3o grave ou grav\u00EDssima, vira CNH definitiva.',
        detailedExplanation: 'A PPD (Permiss\u00E3o para Dirigir) \u00E9 um documento tempor\u00E1rio que o candidato recebe ap\u00F3s passar nos exames. Durante 1 ano, o motorista deve ficar na linha: sem infra\u00E7\u00F5es graves ou grav\u00EDssimas e sem repetir infra\u00E7\u00F5es m\u00E9dias. Se seguir as regras, a PPD se transforma na CNH definitiva, mas se vacilar, pode perder a permiss\u00E3o e ter que come\u00E7ar tudo de novo.',
        legalBase: "Art. 148, §3º do CTB",
        incidence: "alta",
        difficulty: 1
    },
    {
        id: "qp01",
        category: "direcao-defensiva",
        statement: "Sob condições adversas de tempo, como chuva forte, neblina ou cerração, a respeito do uso das luzes do veículo, é correto afirmar que o condutor deve:",
        options: [
            "Manter as luzes de posição apagadas e ligar o pisca-alerta com o veículo em movimento.",
            "Ligar o farol alto para aumentar o feixe de luz e melhorar a visibilidade através da neblina.",
            "Manter acesos, pelo menos, as luzes de posição ou o farol baixo do veículo, sendo proibido o uso do pisca-alerta com o carro em movimento.",
            "Acionar o pisca-alerta e trafegar pelo acostamento até que a visibilidade melhore.",
        ],
        correctIndex: 2,
        explanation: 'Em dias de chuva forte ou neblina, use farol baixo ou luz de posi\u00E7\u00E3o. Pisca-alerta s\u00F3 pode ser usado quando o carro est\u00E1 parado ou em emerg\u00EAncia.',
        detailedExplanation: 'O pisca-alerta n\u00E3o deve ser ligado enquanto voc\u00EA dirige, pois pode confundir quem est\u00E1 atr\u00E1s, fazendo parecer que voc\u00EA est\u00E1 parado. Em neblina densa, \u00E9 importante ter a visibilidade adequada para evitar acidentes.',
        legalBase: "Art. 40 do CTB",
        commonMistake: 'Muita gente acha que pode usar o pisca-alerta na neblina, mas isso t\u00E1 ERRADO na prova.',
        tip: 'Neblina = Farol baixo. Pisca-alerta NUNCA em movimento.',
        incidence: "altissima",
        trap: true,
        difficulty: 3
    },
    {
        id: "qp02",
        category: "infracoes",
        statement: "Em rodovia, o agente flagra um condutor com veículo automotor colado ao veículo da frente em alta velocidade, sem guardar distância de segurança frontal e lateral na pista de rolamento. Deixar de guardar distância de segurança configura infração de qual natureza?",
        options: [
            "Média, com multa e 4 pontos na CNH.",
            "Grave, com multa e 5 pontos na CNH.",
            "Gravíssima, com multa e 7 pontos na CNH.",
            "Leve, com multa pequena e 3 pontos na CNH.",
        ],
        correctIndex: 1,
        explanation: 'Manter dist\u00E2ncia curta do carro da frente \u00E9 infra\u00E7\u00E3o GRAVE, com 5 pontos na CNH e multa.',
        detailedExplanation: 'O artigo 192 do CTB fala que colar no carro da frente \u00E9 perigoso e por isso \u00E9 considerado GRAVE. Muitas pessoas confundem e acham que \u00E9 mais s\u00E9rio, mas a lei \u00E9 bem clara sobre isso.',
        legalBase: "Art. 192 do CTB",
        commonMistake: 'O texto longo pode confundir, mas a infra\u00E7\u00E3o \u00E9 GRAVE e n\u00E3o Grav\u00EDssima.',
        tip: 'Colar no carro da frente = GRAVE (5 pontos).',
        incidence: "altissima",
        trap: true,
        difficulty: 3
    },
    {
        id: "qp03",
        category: "legislacao",
        statement: "Na fiscalização da Lei Seca, condutor apresenta fala arrastada, olhos vermelhos e lentidão de reações ao ser submetido ao etilômetro. Sobre a influência do álcool na capacidade de dirigir, é correto afirmar que ele:",
        options: [
            "Causa perda total e permanente da visão, impedindo definitivamente a condução.",
            "Turva a visão, mas aumenta a agilidade de reação diante dos imprevistos.",
            "Reduz a atenção, provoca sonolência e diminui reflexos e coordenação, elevando o risco de sinistro.",
            "Aumenta reflexos e coordenação, tornando o condutor mais seguro mesmo sob influência."
        ],
        correctIndex: 2,
        explanation: '\u00C1lcool atrapalha a aten\u00E7\u00E3o, deixa voc\u00EA sonolento e diminui os reflexos. \'Vis\u00E3o turva\' t\u00E1 certo, mas \'agilidade\' estraga a resposta.',
        commonMistake: 'Muita gente cai na pegadinha de ler s\u00F3 a primeira parte da op\u00E7\u00E3o e esquece que a \u00FAltima palavra pode mudar tudo!',
        tip: '\u00C1lcool = Aten\u00E7\u00E3o baixa e reflexos lentos.',
        incidence: "alta",
        trap: true,
        difficulty: 3
    },
    {
        id: "qp04",
        category: "meio-ambiente",
        statement: "O agravamento do buraco na camada de ozônio eleva a fração de radiação ultravioleta (UV) que atinge a superfície terrestre. A principal consequência DIRETA dessa maior exposição para a saúde humana é:",
        options: [
            "Aumento da temperatura média global e desconforto térmico nas regiões urbanas.",
            "Maior incidência de doenças respiratórias obstructivas, como asma e bronquite.",
            "Aumento dos casos de câncer de pele e lesões oculares, como a catarata.",
            "Aumento da quantidade de radiação UV-A e UV-B que atinge o solo terrestre."
        ],
        correctIndex: 2,
        explanation: 'O buraco na camada de oz\u00F4nio faz a gente pegar mais sol forte, e isso traz problemas como c\u00E2ncer de pele e catarata.',
        commonMistake: 'Muita gente acha que a resposta \u00E9 sobre o aumento dos raios UV, mas isso \u00E9 a causa, n\u00E3o a consequ\u00EAncia.',
        tip: 'Buraco na camada = Mais radia\u00E7\u00E3o = Mais problemas na pele e olhos.',
        incidence: "alta",
        trap: true,
        difficulty: 3
    },
    {
        id: "qp05",
        category: "direcao-defensiva",
        statement: "O uso dos dispositivos de iluminação do veículo é disciplinado pelo CTB e interfere diretamente na visibilidade e na segurança da condução noturna. Sobre o emprego das luzes durante a circulação, é correto afirmar:",
        options: [
            "O condutor deve manter o farol baixo ligado dia e noite em qualquer tipo de via urbana ou de bairro.",
            "A troca de luz baixa e alta de forma intermitente só é permitida para indicar a intenção de ultrapassar ou alertar sobre riscos à segurança à frente.",
            "O uso do farolete substitui o farol baixo em rodovias durante o dia sob chuva forte.",
            "O farol alto deve ser mantido ligado permanentemente em vias com iluminação pública.",
        ],
        correctIndex: 1,
        explanation: 'Trocar farol alto e baixo (piscar) s\u00F3 vale pra avisar que vai ultrapassar ou pra alertar de perigo.',
        commonMistake: 'Muita gente acha que pode piscar a luz a qualquer hora, mas s\u00F3 \u00E9 certo em situa\u00E7\u00F5es espec\u00EDficas.',
        tip: 'Ultrapassagem = Piscar luzes.',
        legalBase: "Art. 40 do CTB",
        incidence: "alta",
        trap: true,
        difficulty: 3
    },
    {
        id: "qp06",
        category: "prioridade",
        statement: "Em interseção do perímetro urbano sem sinalização semafórica, um veículo sobre trilhos aproxima-se junto de automóveis pela pista de rolamento transversal. Sobre a preferência do veículo sobre trilhos diante dos demais, o CTB prescreve:",
        options: [
            "A preferência é relativa, aplicando-se apenas quando o veículo sobre trilhos for de porte maior que o veículo concorrente.",
            "A preferência é condicionada à existência de sinalização semafórica na interseção, prevalecendo a regra da direita na sua ausência.",
            "A preferência é absoluta, devendo os demais condutores aguardar a passagem do veículo sobre trilhos em qualquer situação.",
            "A preferência é compartilhada entre os condutores, aplicando-se a regra geral de quem vem pela direita na interseção.",
        ],
        correctIndex: 2,
        explanation: 'Ve\u00EDculos sobre trilhos, como trem e bonde, t\u00EAm prioridade total \u2014 eles n\u00E3o desviam e n\u00E3o param r\u00E1pido.',
        commonMistake: 'Muita gente confunde e acha que s\u00F3 carro que passa por cima do trilho tem prioridade, mas n\u00E3o \u00E9 bem assim.',
        tip: 'Sobre trilhos = trem = prioridade total.',
        legalBase: "Art. 29, VII do CTB",
        incidence: "alta",
        trap: true,
        difficulty: 3
    },
    {
        id: "qp07",
        category: "legislacao",
        statement: "De acordo com o CTB, são vias terrestres urbanas e rurais as vias urbanas, vias arteriais, logradouros, caminhos, passagens e estradas. Além dessas vias, quais outros locais abertos à circulação são também considerados vias terrestres pelo CTB?",
        options: [
            "Áreas privadas e estacionamentos de comércios de bairro",
            "As praias abertas à circulação pública e as vias internas pertencentes aos condomínios constituídos por unidades autônomas",
            "Vias particulares e condomínios fechados, onde o CTB não tem poder de fiscalização",
            "Zonas de preservação ambiental e calçadões litorâneos privatizados",
        ],
        correctIndex: 1,
        explanation: 'Praias abertas ao p\u00FAblico e ruas dentro de condom\u00EDnios s\u00E3o consideradas vias terrestres \u2014 o CTB vale l\u00E1!',
        commonMistake: 'Muita gente acha que as ruas de condom\u00EDnio n\u00E3o contam como p\u00FAblicas, mas isso t\u00E1 errado \u2014 o CTB se aplica l\u00E1 tamb\u00E9m.',
        tip: 'Praia + condom\u00EDnio = via terrestre. CTB \u00E9 pra todo mundo!',
        legalBase: "Art. 2º, parágrafo único do CTB",
        incidence: "alta",
        trap: true,
        difficulty: 3
    },
    {
        id: "qp08",
        category: "primeiros-socorros",
        statement: "Em situações excepcionais, quando houver necessidade absoluta de movimentar uma vítima com suspeita de lesão na coluna antes da chegada do socorro especializado, o procedimento correto é:",
        options: [
            "Puxar a vítima pelos braços ou pelas pernas o mais rápido possível para retirá-la do local",
            "Levantar a vítima individualmente, colocando-a sentada no banco de trás de um veículo particular",
            "Utilizar três pessoas para erguer a vítima em bloco, mantendo o corpo alinhado: uma segura a cabeça e o pescoço, a outra o tronco e a terceira as pernas",
            "Virar a cabeça da vítima para os lados para verificar se há fraturas no pescoço antes de movê-la",
        ],
        correctIndex: 2,
        explanation: 'Quando precisar mover algu\u00E9m com suspeita de les\u00E3o na coluna, use tr\u00EAs pessoas pra fazer isso em bloco, cuidando pra n\u00E3o torcer o corpo.',
        tip: 'Movimentou v\u00EDtima? Sempre em BLOCO, com 3 pessoas.',
        incidence: "alta",
        difficulty: 2
    },
    {
        id: "qp09",
        category: "primeiros-socorros",
        statement: "Em passeio por rodovia, encontra-se sinistro entre dois veículos com vítima acordada e lesões aparentes leves, sem socorro profissional no local. Pelo conceito e finalidade dos primeiros socorros no trânsito, essa prática significa:",
        options: [
            "Aplicar técnica médica avançada e administrar medicamentos à vítima no local do sinistro.",
            "Prestar atendimento inicial e temporário, com suporte básico até a chegada do socorro profissional.",
            "Transportar a vítima imediatamente ao hospital mais próximo, mesmo sem imobilização das lesões.",
            "Realizar procedimentos cirúrgicos de emergência para conter hemorragia interna grave."
        ],
        correctIndex: 1,
        explanation: 'Primeiros socorros \u00E9 ajudar a v\u00EDtima de forma r\u00E1pida at\u00E9 o socorro profissional chegar.',
        commonMistake: 'Muita gente acha que pode fazer cirurgia ou dar rem\u00E9dio, mas isso \u00E9 furada \u2014 s\u00F3 quem \u00E9 m\u00E9dico pode fazer isso.',
        tip: 'Ajudar = Esperar o profissional.',
        incidence: "alta",
        difficulty: 2
    },
    {
        id: "qp10",
        category: "direcao-defensiva",
        statement: "Em aula de direção defensiva, o instrutor solicita o conceito que efetivamente caracteriza essa técnica de condução. Pelos conceitos de segurança do CTB, o verdadeiro conceito e objetivo da direção defensiva é:",
        options: [
            "Evitar acidentes e prejuízos a qualquer custo, sem depender de manutenção do veículo ou das condições do clima.",
            "Um tipo de acidente em que não há conduta possível para evitar a colisão.",
            "O conjunto de técnicas que ensina a prevenir acidentes mesmo com pista adversa e erro dos demais usuários.",
            "A habilidade de trafegar rapidamente confiando exclusivamente nos próprios reflexos."
        ],
        correctIndex: 2,
        explanation: 'Dire\u00E7\u00E3o defensiva \u00E9 dirigir de um jeito que evita acidentes, mesmo com problemas na estrada ou erros de outros.',
        commonMistake: 'Cuidado com a ideia de \'fazer de tudo\' para evitar acidentes, isso n\u00E3o \u00E9 dire\u00E7\u00E3o defensiva.',
        tip: 'Situa\u00E7\u00E3o = A\u00E7\u00E3o: Dirigir seguro = Prevenir acidentes.',
        incidence: "alta",
        trap: true,
        difficulty: 3
    },
    {
        id: "qp11",
        category: "prioridade",
        statement: "Dois veículos automotores chegam ao mesmo tempo a interseção sem placas, sem semáforo e sem sinalização horizontal, um situado à esquerda do outro no eixo da via. Pela regra geral de preferência do CTB, tem a preferência:",
        options: [
            "Do veículo que trafega pela via mais larga ou mais movimentada, prevalecendo a hierarquia viária sobre as demais regras.",
            "Do veículo que estiver desenvolvendo maior velocidade, pois demonstra maior pressa e fluidez no tráfego.",
            "Do veículo que vier pela direita do outro, conforme a regra geral de preferência em interseções sem sinalização.",
            "De qualquer um dos dois, desde que pisque o farol para solicitar passagem e aguarde a concordância do outro condutor.",
        ],
        correctIndex: 2,
        explanation: 'Em cruzamento sem sinaliza\u00E7\u00E3o, quem vem pela DIREITA tem a prefer\u00EAncia.',
        commonMistake: 'Muita gente pensa que a rua mais larga sempre tem prefer\u00EAncia. ERRADO \u2014 a regra da direita \u00E9 que vale.',
        tip: 'Sem sinaliza\u00E7\u00E3o? Direita \u00E9 a prioridade!',
        legalBase: "Art. 29, III do CTB",
        incidence: "altissima",
        difficulty: 2
    },
    {
        id: "qp12",
        category: "legislacao",
        statement: "O condutor, com o braço esquerdo na posição HORIZONTAL para fora do veículo (estendido para o lado), está sinalizando que vai:",
        options: [
            "Diminuir a marcha do veículo, avisando aos condutores que vêm atrás a intenção de reduzir a velocidade.",
            "Parar o veículo imediatamente, indicando parada total no leito da via aos demais condutores.",
            "Virar à esquerda, comunicando aos condutores que vêm atrás a intenção de realizar a conversão.",
            "Permitir a ultrapassagem pela esquerda, autorizando o veículo de trás a se deslocar pelo lado esquerdo.",
        ],
        correctIndex: 2,
        explanation: 'Bra\u00E7o esquerdo estendido HORIZONTALMENTE pra fora do carro = vou VIRAR \u00C0 ESQUERDA.',
        detailedExplanation: 'No tr\u00E2nsito, o bra\u00E7o estendido pra fora na horizontal mostra que o motorista quer virar \u00E0 esquerda. Lembre-se dos outros sinais: bra\u00E7o pra cima \u00E9 virar \u00E0 direita e bra\u00E7o pra baixo \u00E9 diminuir ou parar.',
        commonMistake: 'Cuidado! Muita gente confunde o bra\u00E7o horizontal com o bra\u00E7o pra baixo e marca errado.',
        tip: 'Bra\u00E7o reto pro lado = ESQUERDA. Pra cima = DIREITA. Pra baixo = PARAR.',
        legalBase: "Art. 38 do CTB",
        incidence: "altissima",
        trap: true,
        difficulty: 2
    },
    {
        id: "qp13",
        category: "legislacao",
        statement: "O condutor com o braço esquerdo para fora do veículo, dobrado no cotovelo com a mão apontando para CIMA, está sinalizando que vai:",
        options: [
            "Virar à esquerda, indicando a intenção de realizar a conversão para o lado esquerdo da via.",
            "Virar à direita, comunicando aos condutores de trás a intenção de realizar a conversão para o lado direito da via.",
            "Dar passagem ao veículo de trás, autorizando a ultrapassagem pela faixa adjacente da via.",
            "Reduzir a velocidade ou parar o veículo, sinalizando aos demais a intenção de diminuir a marcha.",
        ],
        correctIndex: 1,
        explanation: 'Bra\u00E7o esquerdo dobrado com a m\u00E3o pra CIMA = vou VIRAR \u00C0 DIREITA.',
        commonMistake: 'A galera confunde e acha que \u00E9 pra esquerda s\u00F3 porque o bra\u00E7o t\u00E1 do lado esquerdo, mas a m\u00E3o pra cima \u00E9 que manda.',
        tip: 'M\u00E3o pra cima = direita, mesmo com o bra\u00E7o do lado esquerdo.',
        legalBase: "Art. 38 do CTB",
        incidence: "alta",
        trap: true,
        difficulty: 3
    },
    {
        id: "qp14",
        category: "direcao-defensiva",
        statement: "Ao aproximar-se de interseção em via de mão dupla, onde pretende converter à esquerda com seu veículo automotor, posicionado próximo à linha divisória sem invadir a pista contrária, qual conduta o condutor deve adotar?",
        options: [
            "Acionar a seta esquerda apenas no momento da curva, manter a faixa da direita e avançar rapidamente para não atrapalhar o trânsito de trás.",
            "Sinalizar com antecedência, aproximar-se o máximo possível da linha divisória central da pista (sem invadir a contramão), reduzir a velocidade e dar preferência aos veículos que venham em sentido contrário.",
            "Buzinar para avisar os outros motoristas, acelerar e cruzar a via antes do veículo que vem em sentido contrário, garantindo a passagem.",
            "Sinalizar com a seta direita para enganar quem vem atrás e fazer a curva pela contramão para ganhar tempo.",
        ],
        correctIndex: 1,
        explanation: 'Pra virar \u00E0 esquerda em via de m\u00E3o dupla, \u00E9 preciso sinalizar antes, chegar perto da linha do meio (sem invadir a contram\u00E3o), diminuir a velocidade e dar prefer\u00EAncia pra quem vem na dire\u00E7\u00E3o contr\u00E1ria.',
        commonMistake: 'Cuidado com as alternativas que parecem boas, mas erram em detalhes como avan\u00E7ar r\u00E1pido ou usar a faixa errada.',
        tip: 'Virar \u00E0 esquerda = Sinalizar ANTES, colar na linha do meio, REDUZIR e dar prefer\u00EAncia pra quem vem de frente.',
        legalBase: "Art. 38 do CTB",
        incidence: "altissima",
        trap: true,
        difficulty: 3
    },
    {
        id: "qp15",
        category: "legislacao",
        statement: "Antes de efetuar qualquer manobra que implique deslocamento lateral (mudança de faixa, conversão, ultrapassagem), o condutor é OBRIGADO a:",
        options: [
            "Apenas observar o trânsito pelo retrovisor interno e iniciar a manobra imediatamente, sem qualquer sinalização prévia.",
            "Buzinar três vezes consecutivas para alertar os demais condutores e seguir em frente realizando a manobra normalmente.",
            "Certificar-se de que pode executá-la sem perigo para os demais e indicar com antecedência a sua intenção, por meio de luz indicadora ou gesto convencional de braço.",
            "Acelerar bruscamente para abrir espaço entre os veículos e completar a manobra antes que o trânsito de trás se aproxime.",
        ],
        correctIndex: 2,
        explanation: 'Antes de mudar de faixa ou fazer qualquer manobra, voc\u00EA precisa ter certeza de que \u00E9 seguro e avisar os outros com a seta ou sinal de bra\u00E7o.',
        commonMistake: 'Muita gente acha que a resposta certa \u00E9 a mais curta e acaba errando por isso.',
        tip: 'Manobra lateral = SEGURAN\u00C7A + SINALIZA\u00C7\u00C3O antecipada. Sempre.',
        legalBase: "Art. 35 do CTB",
        incidence: "alta",
        trap: true,
        difficulty: 2
    },
    {
        id: "qp17",
        category: "mecanica",
        statement: "Durante viagem em rodovia, o condutor percebe que a luz indicadora de temperatura acende no painel e nuvem de vapor começa a escapar sob o capô. Diante desse quadro de superaquecimento, a conduta correta e mais segura é:",
        options: [
            "Estacionar imediatamente e abrir o radiador para aliviar a pressão com o motor ainda quente",
            "Desligar o motor imediatamente, abrir o capô e jogar água fria sobre o motor para resfriá-lo rapidamente",
            "Parar o veículo em local seguro, desligar o motor e aguardar esfriar naturalmente antes de verificar o nível de água",
            "Continuar dirigindo em baixa velocidade até o posto mais próximo, pois a água do radiador é suficiente para concluir a viagem",
        ],
        correctIndex: 2,
        explanation: 'Se o motor superaqueceu, pare o carro em um lugar seguro, desligue o motor e espere esfriar. Abrir o radiador quente pode ser perigoso.',
        detailedExplanation: 'Quando a luz de temperatura acende, \u00E9 sinal de que o motor est\u00E1 muito quente. O certo \u00E9 parar, desligar o motor e esperar esfriar, o que pode levar de 20 a 30 minutos. Nunca abra o radiador quente, pois pode sair vapor e \u00E1gua fervente, causando queimaduras. Jogar \u00E1gua fria no motor quente tamb\u00E9m \u00E9 um erro, pois pode danificar o motor. Lembre-se de ligar o pisca-alerta para sinalizar o carro.',
        legalBase: "Manual de direção defensiva DENATRAN",
        commonMistake: 'Muita gente pensa que deve abrir o radiador ou jogar \u00E1gua na hora, mas isso \u00E9 muito perigoso.',
        tip: 'Motor quente = tampa do radiador FECHADA. Espere esfriar naturalmente.',
        incidence: "alta",
        trap: true,
        difficulty: 2
    },
    {
        id: "qp18",
        category: "mecanica",
        statement: "Ao girar a chave de partida, o painel acende normalmente e as luzes funcionam, porém o motor não dá partida e ouve-se apenas um clique seco. Diante desse quadro, a causa mais provável está relacionada a:",
        options: [
            "Falta absoluta de óleo no motor, que travou o virabrequim",
            "Bateria descarregada ou com carga insuficiente para acionar o motor de arranque",
            "Problema no sistema de injeção eletrônica que impede a passagem de combustível",
            "Correia do alternador rompida, impedindo o funcionamento do motor de arranque",
        ],
        correctIndex: 1,
        explanation: 'Clique seco e painel aceso = bateria fraca (n\u00E3o consegue ligar o motor).',
        detailedExplanation: 'Se o painel acende, mas o motor s\u00F3 faz um clique e n\u00E3o gira, a bateria provavelmente est\u00E1 descarregada ou com pouca carga. As luzes internas tamb\u00E9m podem ficar mais fracas ao tentar dar a partida, e a inje\u00E7\u00E3o eletr\u00F4nica n\u00E3o impede o motor de girar, s\u00F3 de funcionar.',
        commonMistake: 'Muita gente confunde \'motor n\u00E3o gira\' com \'motor n\u00E3o pega\'; s\u00E3o coisas diferentes.',
        tip: 'Clique seco = bateria fraca. Gira mas n\u00E3o pega = combust\u00EDvel.',
        incidence: "alta",
        trap: true,
        difficulty: 2
    },
    {
        id: "qp19",
        category: "mecanica",
        statement: "Durante inspeção veicular, constata-se desgaste acentuado na banda de rodagem e o condutor pergunta qual a obrigação legal quanto à profundidade dos sulcos. A afirmativa correta, considerando o indicador TWI, é:",
        options: [
            "O TWI serve para medir a pressão interna do pneu e deve ser verificado semanalmente",
            "Os pneus podem ter sulcos de qualquer profundidade, desde que não haja deformações na banda de rodagem",
            "A profundidade mínima legal dos sulcos dos pneus é de 1,6 mm, indicada pelo TWI — abaixo disso o pneu está irregular",
            "Pneus carecas são permitidos apenas no eixo traseiro, desde que os dianteiros estejam em bom estado",
        ],
        correctIndex: 2,
        explanation: 'O sulco m\u00EDnimo dos pneus \u00E9 1,6 mm (TWI). Se estiver abaixo disso, \u00E9 infra\u00E7\u00E3o grav\u00EDssima e pode dar problema na chuva.',
        detailedExplanation: 'O TWI (Tread Wear Indicator) s\u00E3o marquinhas que mostram quando o pneu t\u00E1 ficando careca. Quando o desgaste chega at\u00E9 essas marquinhas, a profundidade t\u00E1 em 1,6 mm, que \u00E9 o m\u00EDnimo permitido. Usar pneus carecas \u00E9 muito perigoso, pois eles escorregam mais na chuva e aumentam a dist\u00E2ncia pra parar, al\u00E9m de ser uma infra\u00E7\u00E3o grav\u00EDssima com multa e reten\u00E7\u00E3o do carro.',
        legalBase: "Art. 230, XXII do CTB / Resolução CONTRAN 558/80",
        commonMistake: 'Muita gente acha que o TWI mede press\u00E3o ou que 1,6 mm \u00E9 v\u00E1lido em qualquer situa\u00E7\u00E3o. A prova adora confundir isso!',
        tip: 'TWI = Sulco do pneu = 1,6 mm \u00E9 o m\u00EDnimo.',
        incidence: "alta",
        trap: true,
        difficulty: 2
    },
    {
        id: "qp20",
        category: "mecanica",
        statement: "Durante descida longa em declive de rodovia, o condutor sente cheiro de queimado, o pedal de freio endurece e o veículo perde progressivamente a capacidade de frenagem. A causa mais provável e a conduta correta são:",
        options: [
            "Fluido de freio vencido — bombar o pedal com frequência para recuperar a pressão hidráulica.",
            "Aquecimento do fluido com formação de bolhas de vapor (fading) — reduzir a marcha e usar o freio motor para preservar os freios.",
            "Desgaste de pastilhas — acionar o freio de estacionamento como apoio à frenagem.",
            "Rolamento de roda travando — imobilizar na hora e resfriar as rodas com água."
        ],
        correctIndex: 1,
        explanation: 'Fading \u00E9 quando o fluido de freio esquenta demais. A solu\u00E7\u00E3o \u00E9 usar o freio motor (marcha reduzida) pra n\u00E3o sobrecarregar os freios.',
        detailedExplanation: 'O fading acontece em descidas longas, quando o uso constante dos freios faz o fluido superaquecer e formar bolhas. Isso deixa o pedal duro ou faz ele ir at\u00E9 o fundo sem parar o carro. O certo \u00E9 engatar uma marcha mais curta e usar o freio motor pra controlar a velocidade, acionando o freio de jeito intermitente, n\u00E3o direto. Bombear o pedal pode ajudar, mas n\u00E3o resolve o problema do fading. O freio de m\u00E3o \u00E9 s\u00F3 pra emerg\u00EAncia e pode fazer o carro derrapar.',
        legalBase: "Manual de direção defensiva DENATRAN",
        commonMistake: 'Muita gente acha que \u00E9 s\u00F3 bombear o pedal ou que \u00E9 problema na pastilha, mas a quest\u00E3o \u00E9 o fading e a solu\u00E7\u00E3o \u00E9 usar o freio motor.',
        tip: 'Descida longa = marcha reduzida + freio motor. Freio s\u00F3 de apoio.',
        incidence: "alta",
        trap: true,
        difficulty: 3
    },
    {
        id: "qp21",
        category: "mecanica",
        statement: "Logo após abastecer em posto, o veículo começa a vibrar no volante e perde força na velocidade de cruzeiro, estado que antes era normal. Como o defeito surgiu após o abastecimento, a causa mais provável é:",
        options: [
            "Combustível adulterado ou com água no tanque, sujando a alimentação.",
            "Tampa do tanque aberta, deixando entrar ar no sistema.",
            "Correia do alternador solta na saída do posto.",
            "Óleo trocado por engano junto com combustível, estragando a bomba injetora.",
        ],
        correctIndex: 0,
        explanation: 'Abastecer com combust\u00EDvel ruim ou com \u00E1gua faz o carro tremer e perder for\u00E7a.',
        detailedExplanation: 'Quando o combust\u00EDvel \u00E9 adulterado ou tem \u00E1gua, o carro pode apresentar problemas como dificuldade para ligar, marcha lenta irregular e at\u00E9 o motor parar. O ideal \u00E9 n\u00E3o tentar ligar o carro v\u00E1rias vezes e levar para uma oficina para resolver o problema. A correia do alternador n\u00E3o causa perda de pot\u00EAncia de imediato e \u00F3leo no tanque \u00E9 raro nesse caso.',
        commonMistake: 'Muita gente acha que vibra\u00E7\u00E3o \u00E9 s\u00F3 pneu ou suspens\u00E3o, mas aqui a situa\u00E7\u00E3o \u00E9 diferente por causa do abastecimento recente.',
        tip: 'Abasteceu e o carro ficou ruim? = A\u00E7\u00E3o: Verifique o combust\u00EDvel!',
        incidence: "media",
        trap: true,
        difficulty: 2
    },
    {
        id: "qp22",
        category: "mecanica",
        statement: "O sistema de arrefecimento mantém a temperatura de operação do motor dentro da faixa ideal prevista pelo fabricante. Sobre os cuidados de manutenção preventiva desse sistema, assinale a alternativa INCORRETA:",
        options: [
            "O líquido de arrefecimento deve ser uma mistura de água desmineralizada com aditivo próprio, na proporção recomendada pelo fabricante",
            "A ventoinha do radiador é acionada automaticamente por um sensor de temperatura quando o líquido atinge determinada temperatura",
            "A água da torneira comum pode substituir o líquido de arrefecimento sem prejuízos, pois todos os tipos de água têm a mesma composição química",
            "Verificar o nível do reservatório de expansão regularmente faz parte da manutenção preventiva do sistema de arrefecimento",
        ],
        correctIndex: 2,
        explanation: 'Alternativa INCORRETA: \u00E1gua comum N\u00C3O pode substituir o l\u00EDquido de arrefecimento \u2014 causa corros\u00E3o e dep\u00F3sitos minerais.',
        detailedExplanation: 'A \u00E1gua da torneira tem minerais que, com o calor do motor, formam crostas no radiador e no bloco, atrapalhando a troca de calor e causando corros\u00E3o. O ideal \u00E9 usar \u00E1gua desmineralizada misturada com aditivo na propor\u00E7\u00E3o certa, que ajuda a regular a temperatura do motor. Fique atento ao comando \'INCORRETA\' \u2014 \u00E9 uma pegadinha cl\u00E1ssica.',
        commonMistake: 'O candidato l\u00EA r\u00E1pido e marca a primeira alternativa que parece correta, mas a pegadinha est\u00E1 no \'INCORRETA\'.',
        tip: 'Leia o comando = Marque a alternativa FALSA.',
        incidence: "alta",
        trap: true,
        difficulty: 2
    },
    {
        id: "qp23",
        category: "mecanica",
        statement: "Em relação aos sistemas de iluminação e sinalização do veículo previstos no CTB — faróis, luz de neblina, pisca-alerta e lanternas de posição —, analise as afirmações e assinale a conduta correta do condutor:",
        options: [
            "O uso do farol alto é permitido em qualquer via durante a noite, devendo ser mantido aceso mesmo quando houver veículos trafegando no sentido contrário",
            "A luz de neblina dianteira pode ser utilizada em substituição ao farol baixo em condições normais de visibilidade durante o dia",
            "O pisca-alerta (luz de advertência) deve ser acionado apenas em situações de emergência, imobilização do veículo ou situações de perigo, sendo proibido seu uso com o veículo em movimento",
            "A lanterna de posição é suficiente para trafegar em vias urbanas bem iluminadas, dispensando o uso do farol baixo",
        ],
        correctIndex: 2,
        explanation: 'Pisca-alerta \u00E9 s\u00F3 pra emerg\u00EAncia e carro parado. Usar em movimento \u00E9 proibido, a n\u00E3o ser que esteja em perigo.',
        detailedExplanation: 'O pisca-alerta (luz de advert\u00EAncia) deve ser acionado apenas em emerg\u00EAncias, como carro parado na pista ou situa\u00E7\u00F5es de risco. Usar enquanto dirige normalmente, como na chuva, t\u00E1 errado. Lembre-se: farol alto deve ser abaixado ao encontrar outro carro, e farol baixo \u00E9 obrigat\u00F3rio \u00E0 noite.',
        legalBase: "Art. 40, V e 251 do CTB",
        commonMistake: 'Muita gente acha que usar pisca-alerta na chuva \u00E9 certo, mas n\u00E3o \u00E9.',
        tip: 'Pisca-alerta = carro PARADO ou perigo. N\u00E3o use na chuva.',
        incidence: "altissima",
        trap: true,
        difficulty: 2
    },
    {
        id: "qp24",
        category: "mecanica",
        statement: "Em veículo automotor com câmbio manual, a alavanca vibra fortemente e o engate das marchas, sobretudo ré e primeira, está cada vez mais difícil, com piora progressiva. Nesse quadro, o componente gasto ou defeituoso é:",
        options: [
            "A embreagem, patinando por desgaste do disco.",
            "O freio, travando as rodas da frente.",
            "O óleo do câmbio, baixo ou velho demais, sem lubrificar as engrenagens.",
            "A correia dentada, gasta e precisando de troca urgente.",
        ],
        correctIndex: 2,
        explanation: 'Vibra\u00E7\u00E3o na alavanca e dificuldade para engatar marchas = \u00F3leo do c\u00E2mbio baixo ou velho.',
        detailedExplanation: 'O \u00F3leo do c\u00E2mbio \u00E9 o que lubrifica as engrenagens e sincronizadores. Se ele estiver baixo ou velho, n\u00E3o consegue fazer isso direito, e a\u00ED surgem os problemas para engatar marchas e a vibra\u00E7\u00E3o na alavanca. A embreagem desgastada n\u00E3o causa isso, e a correia dentada n\u00E3o tem a ver com o c\u00E2mbio.',
        commonMistake: 'Muita gente confunde os sinais de embreagem desgastada com problemas no c\u00E2mbio.',
        tip: 'Dificuldade ao engatar marchas = \u00F3leo do c\u00E2mbio.',
        incidence: "media",
        trap: true,
        difficulty: 2
    },
    {
        id: "qp25",
        category: "meio-ambiente",
        statement: "Após a manutenção preventiva do veículo na garagem do condomínio, o condutor acumula o óleo lubrificante usado em um balde e precisa descartá-lo. Pela legislação ambiental brasileira, a conduta correta é:",
        options: [
            "Queimar o óleo usado em fornos industriais para aproveitamento energético, pois é uma forma de reciclagem",
            "Descartar o óleo usado na pia ou no ralo, pois a estação de tratamento de esgoto consegue separá-lo da água",
            "Armazenar o óleo usado em recipiente fechado e entregar em um ponto de coleta credenciado para reciclagem (rerrefino)",
            "Jogar o óleo usado diretamente no solo, onde será decomposto naturalmente por microrganismos",
        ],
        correctIndex: 2,
        explanation: '\u00D3leo usado tem que ser levado a pontos de coleta para reciclagem. Jogar no ch\u00E3o ou na \u00E1gua causa muita polui\u00E7\u00E3o.',
        detailedExplanation: 'Um litro de \u00F3leo lubrificante usado pode sujar at\u00E9 1 milh\u00E3o de litros de \u00E1gua. O jeito certo \u00E9 guardar em um recipiente fechado e levar a postos de coleta, como oficinas ou postos de gasolina, que fazem o rerrefino \u2014 que \u00E9 quando o \u00F3leo \u00E9 recuperado pra ser usado de novo. Descartar no solo contamina a \u00E1gua, na pia entope tudo e queimar solta fuma\u00E7a t\u00F3xica.',
        legalBase: "Lei 9.605/98 (Lei de Crimes Ambientais) / Resolução CONAMA 362/2005",
        commonMistake: 'Muita gente pensa que queimar o \u00F3leo \u00E9 reciclar, mas isso n\u00E3o \u00E9 verdade.',
        tip: '\u00D3leo usado = coleta. Leve ao posto de gasolina!',
        incidence: "media",
        trap: true,
        difficulty: 2
    },
    {
        id: "qp26",
        category: "meio-ambiente",
        statement: "Em campanha de qualidade do ar no perímetro urbano, o condutor pergunta qual hábito de manutenção do veículo contribui para reduzir a emissão de poluentes por combustão incompleta. A conduta indicada é:",
        options: [
            "Manter o motor ligado durante paradas prolongadas para evitar o desgaste do motor de arranque ao religar",
            "Realizar a manutenção preventiva periódica, especialmente do sistema de ignição, alimentação e escapamento",
            "Utilizar combustível de menor octanagem para reduzir a temperatura de queima e consequentemente as emissões",
            "Acelerar o motor antes de desligá-lo para 'queimar' o excesso de combustível acumulado nas câmaras",
        ],
        correctIndex: 1,
        explanation: 'Fazer a manuten\u00E7\u00E3o do carro ajuda a soltar menos fuma\u00E7a. Deixar o motor ligado parado e acelerar antes de desligar s\u00F3 aumenta a polui\u00E7\u00E3o.',
        detailedExplanation: 'Manter o carro em dia, como as velas e o escapamento, faz com que ele funcione melhor e emita menos poluentes. Quando o motor fica ligado sem necessidade, \u00E9 infra\u00E7\u00E3o e polui \u00E0 toa. Acelerar antes de desligar joga combust\u00EDvel fora e aumenta a sujeira no ar.',
        legalBase: "Art. 227 do CTB / Resolução CONAMA 18/86",
        commonMistake: 'A alternativa A parece boa, mas o CTB pro\u00EDbe deixar o motor ligado em paradas longas e isso polui mais.',
        tip: 'Menos polui\u00E7\u00E3o = carro em dia. Motor desligado em paradas.',
        incidence: "media",
        difficulty: 1
    },
    {
        id: "qp27",
        category: "meio-ambiente",
        statement: "Em via urbana movimentada, o condutor acompanha veículo cujo escapamento emite fumaça escura densa, reduzindo a visibilidade e causando mau cheiro. Pelo CTB e pelas resoluções do CONAMA, essa situação:",
        options: [
            "É considerada infração de trânsito GRAVE, pois o veículo está emitindo poluentes acima do permitido, sujeito a multa e retenção",
            "Não é infração de trânsito, mas sim uma contravenção ambiental de competência exclusiva da polícia ambiental",
            "É permitida desde que o veículo esteja em dia com o licenciamento e a inspeção veicular",
            "É infração LEVE, punida apenas com advertência verbal na primeira ocorrência",
        ],
        correctIndex: 0,
        explanation: 'Ve\u00EDculo soltando fuma\u00E7a excessiva = infra\u00E7\u00E3o GRAVE (art. 231, III do CTB). Multa e reten\u00E7\u00E3o do carro.',
        detailedExplanation: 'O CTB diz que \u00E9 infra\u00E7\u00E3o GRAVE (5 pontos, multa) dirigir ve\u00EDculo que solta poluentes ou fuma\u00E7a al\u00E9m do permitido (art. 231, III). O agente pode parar o carro at\u00E9 que o problema seja resolvido. Fuma\u00E7a escura geralmente mostra que o motor t\u00E1 queimando combust\u00EDvel errado ou t\u00E1 com algum problema.',
        legalBase: "Art. 231, III do CTB",
        commonMistake: 'Muita gente pensa que a fuma\u00E7a \u00E9 s\u00F3 um problema ambiental, mas na verdade \u00E9 infra\u00E7\u00E3o GRAVE com reten\u00E7\u00E3o do ve\u00EDculo.',
        tip: 'Fuma\u00E7a no escapamento = A\u00E7\u00E3o = Multa e reten\u00E7\u00E3o.',
        incidence: "media",
        trap: true,
        difficulty: 2
    },
    {
        id: "qp28",
        category: "meio-ambiente",
        statement: "Após a substituição, oficina e condutor acumulam os pneus inservíveis junto às margens da pista de rolamento. Pela legislação brasileira e pela logística reversa obrigatória, a destinação correta desses pneus é:",
        options: [
            "Queimar os pneus em usinas de cimento para aproveitamento energético, pois a queima controlada não emite poluentes",
            "Descartar os pneus em aterros sanitários comuns junto com o lixo doméstico, já que a borracha é biodegradável",
            "Entregar os pneus usados em pontos de coleta para reciclagem ou coprocessamento, conforme determina a logística reversa obrigatória",
            "Reutilizar pneus velhos como jardineiras ou mobiliário, desde que não sejam queimados ao ar livre",
        ],
        correctIndex: 2,
        explanation: 'Pneus usados precisam ser entregues em pontos de coleta para serem reciclados ou processados corretamente.',
        detailedExplanation: 'A lei diz que quem vende pneus tem que coletar os usados e dar um destino certo, como reciclagem. Os consumidores devem levar os pneus usados at\u00E9 esses pontos de coleta, como borracharias ou lojas. Queimar pneus ao ar livre ou jogar em aterros n\u00E3o \u00E9 permitido porque faz mal ao meio ambiente.',
        legalBase: "Resolução CONAMA 416/2009",
        commonMistake: 'Muita gente pensa que queimar pneus em \'forno de cimento\' \u00E9 uma forma limpa de reciclagem, mas isso n\u00E3o \u00E9 verdade.',
        tip: 'Pneu velho? Leve ao ponto de coleta da revendedora.',
        incidence: "baixa",
        difficulty: 2
    },
    {
        id: "qp29",
        category: "meio-ambiente",
        statement: "No período seco, o condutor trafega junto a reserva ambiental onde a vegetação das margens está alta e ressecada, em via estreita de pista única. Nessa situação, a conduta VEDADA, por representar risco de incêndio florestal, é:",
        options: [
            "Trafegar em baixa velocidade para evitar levantar poeira e prejudicar a visibilidade",
            "Manter o ar-condicionado ligado com a recirculação ativada para evitar entrada de fumaça externa",
            "Jogar pontas de cigarro ou fósforos acesos pela janela do veículo, mesmo que aparentemente apagadas",
            "Acionar o pisca-alerta ao reduzir a velocidade para alertar os demais condutores sobre a pista estreita",
        ],
        correctIndex: 2,
        explanation: 'Atirar pontas de cigarro pela janela \u00E9 proibido e pode provocar inc\u00EAndios. \u00C9 infra\u00E7\u00E3o M\u00C9DIA.',
        detailedExplanation: 'Jogar qualquer coisa pela janela do carro \u00E9 infra\u00E7\u00E3o M\u00C9DIA (art. 172 do CTB). Pontas de cigarro acesas s\u00E3o super perigosas em \u00E1reas secas, podendo causar inc\u00EAndios enormes. Sempre use o cinzeiro do carro para descartar as bitucas.',
        legalBase: "Art. 172 do CTB / Lei 9.605/98",
        commonMistake: 'O aluno pensa que a quest\u00E3o \u00E9 sobre \'vegeta\u00E7\u00E3o alta\' e se confunde, mas o erro est\u00E1 em jogar as pontas.',
        tip: 'Bituca pela janela = infra\u00E7\u00E3o + risco de inc\u00EAndio. Use o cinzeiro!',
        incidence: "alta",
        trap: true,
        difficulty: 1
    },
    {
        id: "qp30",
        category: "meio-ambiente",
        statement: "Sobre o ciclo de vida das baterias automotivas de chumbo-ácido, a legislação ambiental brasileira impõe responsabilidade compartilhada pelo descarte. No sistema de logística reversa, a destinação correta da bateria usada é:",
        options: [
            "Baterias usadas podem ser descartadas no lixo comum após serem descarregadas por completo, pois o chumbo não é mais nocivo",
            "O ácido da bateria pode ser neutralizado com soda cáustica e descartado na pia, enquanto a carcaça de plástico vai para reciclagem",
            "A bateria usada deve ser devolvida ao revendedor no ato da compra de uma nova, que é obrigado a recebê-la e dar destinação ambiental adequada (logística reversa)",
            "Baterias automotivas não oferecem risco ambiental significativo, pois são compostas majoritariamente de plástico e ácido fraco",
        ],
        correctIndex: 2,
        explanation: 'Baterias usadas t\u00EAm que ser devolvidas ao revendedor quando voc\u00EA compra uma nova (log\u00EDstica reversa obrigat\u00F3ria). Elas s\u00E3o perigosas por causa do chumbo e do \u00E1cido.',
        detailedExplanation: 'A lei diz que quem vende bateria de chumbo-\u00E1cido tem que receber a usada na hora da venda da nova. Isso \u00E9 pra evitar que esses materiais t\u00F3xicos poluam o meio ambiente. Descartar no lixo ou na pia \u00E9 proibido porque pode contaminar tudo ao redor.',
        legalBase: "Resolução CONAMA 401/2008",
        commonMistake: 'Muita gente n\u00E3o sabe que a loja \u00E9 obrigada a pegar a bateria velha e acaba jogando fora de qualquer jeito.',
        tip: 'Bateria velha = devolve na compra da nova. A loja \u00E9 obrigada a pegar!',
        incidence: "baixa",
        difficulty: 2
    },
    {
        id: "qp31",
        category: "infracoes",
        statement: "Avançar o sinal vermelho do semáforo configura infração gravíssima com 7 pontos e multa. Existe, porém, circunstância em que a penalidade é agravada pela colocação em risco de usuários vulneráveis. Essa circunstância é:",
        options: [
            "Avançar o sinal vermelho durante a madrugada, quando há menos movimento",
            "Avançar o sinal vermelho em rodovia, independentemente de haver ou não fiscalização eletrônica",
            "Avançar o sinal vermelho em cruzamento com faixa de pedestre, pois coloca em risco a vida do pedestre",
            "Não há circunstância agravante — a infração é sempre a mesma independente da situação",
        ],
        correctIndex: 2,
        explanation: 'Avan\u00E7ar o sinal vermelho \u00E9 grav\u00EDssimo (7 pts). A penalidade aumenta quando isso acontece em cruzamento com faixa de pedestre.',
        detailedExplanation: 'Quando o motorista passa no sinal vermelho, ele comete uma infra\u00E7\u00E3o GRAV\u00CDSSIMA, que gera 7 pontos e multa. Isso \u00E9 muito s\u00E9rio, principalmente em cruzamentos, onde pode causar acidentes com pedestres. O C\u00F3digo de Tr\u00E2nsito prioriza a seguran\u00E7a dos pedestres, ent\u00E3o essa situa\u00E7\u00E3o \u00E9 ainda mais grave.',
        legalBase: "Art. 208 do CTB",
        commonMistake: 'Muita gente pensa que avan\u00E7ar o sinal vermelho \u00E9 s\u00F3 uma infra\u00E7\u00E3o grave, mas \u00E9 grav\u00EDssima e tem 7 pontos.',
        tip: 'Sinal vermelho = PARE. Cruzamento com pedestre = A\u00C7\u00C3O GRAV\u00CDSSIMA.',
        incidence: "alta",
        trap: true,
        difficulty: 1
    },
    {
        id: "qp32",
        category: "infracoes",
        statement: "Uma das atitudes mais perigosas ao volante, especialmente comum no trânsito urbano intenso, é o uso do telefone celular enquanto dirige. De acordo com o art. 252 do CTB, segurar ou manusear o celular enquanto o veículo está em movimento é uma infração classificada como:",
        options: [
            "Leve — 3 pontos e multa, pois a lei considera equivalente a uma distração simples",
            "Média — 4 pontos e multa, pois o celular é equiparado a outros objetos que desviam a atenção",
            "Gravíssima — 7 pontos e multa, com fator multiplicador 3 se o condutor for reincidente",
            "Gravíssima — 7 pontos e multa, pois o ato de segurar e manusear celular é considerado gravíssimo",
        ],
        correctIndex: 3,
        explanation: 'Usar o celular enquanto dirige = infra\u00E7\u00E3o GRAV\u00CDSSIMA. 7 pontos e multa.',
        detailedExplanation: 'Segurar ou mexer no celular ao volante \u00E9 uma infra\u00E7\u00E3o GRAV\u00CDSSIMA, que gera 7 pontos na CNH e uma multa de R$ 293,47. N\u00E3o tem fator multiplicador, mas se voc\u00EA repetir a infra\u00E7\u00E3o em 12 meses, a multa dobra.',
        legalBase: "Art. 252, VI do CTB",
        commonMistake: 'Muita gente pensa que usar celular \u00E9 infra\u00E7\u00E3o m\u00E9dia ou grave, mas \u00E9 GRAV\u00CDSSIMA de verdade.',
        tip: 'Celular no volante = GRAV\u00CDSSIMA. S\u00F3 atenda se estacionar em local seguro.',
        incidence: "altissima",
        trap: true,
        difficulty: 2
    },
    {
        id: "qp33",
        category: "infracoes",
        statement: "O uso do cinto de segurança é obrigatório para todos os ocupantes do veículo, conforme determina o CTB. O condutor que deixa de usar o cinto de segurança ou permite que passageiros menores de 18 anos viajem sem o cinto comete, respectivamente:",
        options: [
            "Duas infrações GRAVES — uma para si mesmo e outra por permitir que o passageiro menor viaje sem cinto",
            "Uma única infração GRAVE aplicada ao condutor, independentemente de quantos passageiros estejam sem cinto",
            "Infração GRAVE para si mesmo e infração LEVE para cada passageiro menor de 18 anos sem cinto",
            "Infração GRAVÍSSIMA para o condutor e GRAVE para o proprietário do veículo",
        ],
        correctIndex: 1,
        explanation: 'N\u00E3o usar cinto \u00E9 infra\u00E7\u00E3o GRAVE (5 pts). O motorista s\u00F3 leva uma multa, n\u00E3o importa quantas pessoas estejam sem cinto.',
        detailedExplanation: 'O cinto de seguran\u00E7a \u00E9 obrigat\u00F3rio para todo mundo no carro. Se o motorista e os passageiros estiverem sem cinto, ele s\u00F3 recebe uma multa, mas \u00E9 respons\u00E1vel por todos.',
        legalBase: "Art. 167 do CTB",
        commonMistake: 'Muita gente pensa que cada passageiro sem cinto gera uma multa diferente, mas \u00E9 s\u00F3 uma infra\u00E7\u00E3o para o motorista.',
        tip: 'Cinto para TODOS = Uma infra\u00E7\u00E3o GRAVE.',
        incidence: "alta",
        trap: true,
        difficulty: 2
    },
    {
        id: "qp34",
        category: "infracoes",
        statement: "Em uma rodovia de pista simples, o condutor de um automóvel realiza uma ultrapassagem em local proibido (faixa contínua amarela), sendo flagrado por um agente de trânsito. Considerando as penalidades previstas no CTB para essa infração, assinale a alternativa correta:",
        options: [
            "Infração GRAVE — 5 pontos, multa simples e recolhimento da CNH por 30 dias",
            "Infração GRAVÍSSIMA — 7 pontos e multa com fator multiplicador 5, além de possível suspensão do direito de dirigir",
            "Infração MÉDIA — 4 pontos e multa, pois a ultrapassagem foi concluída sem causar acidente",
            "Infração GRAVÍSSIMA — 7 pontos e multa simples sem fator multiplicador, apenas com apreensão do veículo",
        ],
        correctIndex: 1,
        explanation: 'Ultrapassar em local proibido (faixa cont\u00EDnua) = GRAV\u00CDSSIMA x5 (multa multiplicada por 5) + suspens\u00E3o.',
        detailedExplanation: 'Quando voc\u00EA ultrapassa em lugar que n\u00E3o pode, como na faixa cont\u00EDnua, \u00E9 considerado uma infra\u00E7\u00E3o GRAV\u00CDSSIMA. Isso significa que a multa \u00E9 bem alta, multiplicada por 5, e voc\u00EA pode at\u00E9 perder o direito de dirigir por um tempo.',
        legalBase: "Art. 203, V do CTB",
        commonMistake: 'Muita gente pensa que essa infra\u00E7\u00E3o \u00E9 \'grave\' ou que a multa \u00E9 multiplicada por 3, mas \u00E9 5 mesmo!',
        tip: 'Ultrapassagem proibida = GRAV\u00CDSSIMA x5. Sete pontos + multa salgada.',
        incidence: "alta",
        trap: true,
        difficulty: 2
    },
    {
        id: "qp35",
        category: "infracoes",
        statement: "O condutor de um veículo envolve-se em um acidente de trânsito com vítimas em uma rodovia. Após a colisão, ele foge do local sem prestar socorro às vítimas, mesmo tendo condições de fazê-lo. De acordo com o CTB e o Código Penal, essa conduta configura:",
        options: [
            "Apenas infração de trânsito GRAVÍSSIMA com multa, sem repercussão criminal",
            "Infração de trânsito GRAVÍSSIMA e crime de trânsito de omissão de socorro (detenção de 1 a 6 meses, podendo ser aumentada se resultar em lesão grave ou morte)",
            "Apenas crime de trânsito (homicídio culposo), pois a infração administrativa é absorvida pela esfera criminal",
            "Infração MÉDIA, desde que o condutor não seja o proprietário do veículo",
        ],
        correctIndex: 1,
        explanation: 'Fugir do acidente com v\u00EDtimas \u00E9 GRAV\u00CDSSIMA e crime de omiss\u00E3o de socorro.',
        detailedExplanation: 'Duas puni\u00E7\u00F5es v\u00EAm por a\u00ED: (1) Infra\u00E7\u00E3o GRAV\u00CDSSIMA \u2014 n\u00E3o ajudar a v\u00EDtima pode te dar multa e suspens\u00E3o da CNH; (2) Crime de OMISS\u00C3O DE SOCORRO \u2014 pode rolar deten\u00E7\u00E3o de 1 a 6 meses e multa. O certo \u00E9 parar, sinalizar, ajudar ou chamar o SAMU e esperar a autoridade.',
        legalBase: "Arts. 304 e 305 do CTB / Art. 135 do Código Penal",
        commonMistake: 'Muita gente pensa que s\u00F3 \u00E9 infra\u00E7\u00E3o, mas tem pena dupla: administrativa e criminal, mesmo que a v\u00EDtima n\u00E3o morra.',
        tip: 'Acidente com v\u00EDtima = pare, socorra, sinalize, aguarde. Fugir \u00E9 crime.',
        incidence: "alta",
        trap: true,
        difficulty: 2
    },
    {
        id: "qp36",
        category: "infracoes",
        statement: "O Art. 162 do CTB tipifica diversas infrações de trânsito ligadas à habilitação do condutor: ausência de CNH ou PPD, vencimento do exame de aptidão física e categoria divergente. Sobre esse tema, assinale a alternativa correta:",
        options: [
            "Dirigir com a CNH vencida há mais de 30 dias é infração GRAVÍSSIMA com multa multiplicada por 3",
            "Dirigir com a CNH de outra categoria (ex: categoria B dirigindo veículo da categoria C) é infração LEVE com advertência",
            "Dirigir sem a CNH ou PPD (não habilitado) é infração GRAVÍSSIMA com multa multiplicada por 3 — e pode configurar crime",
            "Dirigir com a CNH de categoria diferente da do veículo é infração MÉDIA com retenção do veículo até a apresentação de condutor habilitado",
        ],
        correctIndex: 2,
        explanation: 'Dirigir sem CNH ou PPD \u00E9 GRAV\u00CDSSIMA e a multa \u00E9 triplicada. Se a CNH estiver vencida h\u00E1 mais de 30 dias, a infra\u00E7\u00E3o \u00E9 GRAVE.',
        detailedExplanation: 'O art. 162 do CTB fala sobre as infra\u00E7\u00F5es de habilita\u00E7\u00E3o: (I) dirigir sem CNH ou PPD \u00E9 GRAV\u00CDSSIMA com multa triplicada e pode ser crime se causar perigo; (II) dirigir com CNH vencida h\u00E1 mais de 30 dias \u00E9 uma infra\u00E7\u00E3o GRAVE; (III) dirigir com CNH de categoria diferente tamb\u00E9m \u00E9 GRAV\u00CDSSIMA, mas sem multiplicador. A alternativa A confunde as classifica\u00E7\u00F5es, pois a CNH vencida \u00E9 apenas grave.',
        legalBase: "Art. 162, I, II e III do CTB",
        commonMistake: 'A banca costuma confundir: sem CNH \u00E9 grav\u00EDssima x3, mas CNH vencida h\u00E1 +30 dias \u00E9 s\u00F3 grave.',
        tip: 'Sem CNH = GRAV\u00CDSSIMA x3. CNH vencida +30 dias = GRAVE.',
        incidence: "alta",
        trap: true,
        difficulty: 3
    },
    {
        id: "qp37",
        category: "primeiros-socorros",
        statement: "Em sinistro, motociclista permanece inconsciente na pista de rolamento ainda com capacete, e sua remoção é necessária para garantir a permeabilidade das vias aéreas. A retirada técnica correta do capacete é:",
        options: [
            "Puxar o capacete com força para cima, mantendo a posição atual da cabeça, para ganhar tempo.",
            "Com auxílio de duas pessoas, mantendo a cabeça e o pescoço alinhados e imóveis durante toda a manobra.",
            "Cortar o capacete ao meio com faca ou canivete sem estabilizar a cabeça da vítima.",
            "Aguardar que o motociclista retorne à consciência ou deixar a remoção para a equipe hospitalar."
        ],
        correctIndex: 1,
        explanation: 'Tirar o capacete: com 2 pessoas, uma segura a cabe\u00E7a e a outra remove com cuidado.',
        detailedExplanation: 'Quando a v\u00EDtima est\u00E1 inconsciente, tirar o capacete \u00E9 bem delicado. \u00C9 preciso manter a coluna cervical alinhada pra n\u00E3o machucar mais. Uma pessoa segura a cabe\u00E7a e a outra tira o capacete devagar, sem puxar com for\u00E7a.',
        commonMistake: 'Muita gente acha que \u00E9 s\u00F3 tirar o capacete r\u00E1pido, mas o importante \u00E9 proteger a coluna primeiro.',
        tip: 'V\u00EDtima inconsciente = 2 pessoas, segura a cabe\u00E7a, remove com calma.',
        incidence: "media",
        trap: true,
        difficulty: 3
    },
    {
        id: "qp38",
        category: "primeiros-socorros",
        statement: "Em sinistro, vítima apresenta corte profundo no braço com hemorragia abundante; sem material hospitalar, utilizam-se apenas itens comuns disponíveis no veículo. Para conter o sangramento até o socorro, a conduta imediata é:",
        options: [
            "Amarrar um garrote improvisado bem apertado acima do corte para interromper o fluxo sanguíneo.",
            "Aplicar pressão firme e contínua sobre o ferimento com pano limpo, sem soltar até o socorro chegar.",
            "Erguer o membro para cima e aguardar que o sangramento cese espontaneamente pela ação da gravidade.",
            "Limpar o corte com álcool ou água oxigenada e cobrir com curativo oclusivo fechado."
        ],
        correctIndex: 1,
        explanation: 'Se tem sangramento forte, \u00E9 hora de pressionar o ferimento com um pano limpo. O torniquete s\u00F3 deve ser usado em \u00FAltimo caso.',
        detailedExplanation: 'Para parar o sangramento, primeiro voc\u00EA coloca um pano limpo ou gaze e faz press\u00E3o firme por pelo menos 10 minutos sem olhar. Se n\u00E3o parar, levanta o bra\u00E7o acima do cora\u00E7\u00E3o, mas continua pressionando. O torniquete \u00E9 bem arriscado e deve ser a \u00FAltima op\u00E7\u00E3o, porque pode causar problemas s\u00E9rios.',
        commonMistake: 'Muita gente pensa que o torniquete \u00E9 a primeira coisa a fazer, mas na verdade, compress\u00E3o direta \u00E9 o que realmente funciona.',
        tip: 'Sangramento = PRESS\u00C3O FIRME. Torniquete s\u00F3 em \u00FAltimo caso.',
        incidence: "alta",
        trap: true,
        difficulty: 2
    },
    {
        id: "qp39",
        category: "primeiros-socorros",
        statement: "Vítima de sinistro é encontrada caída ao lado do veículo, acordada porém confusa, com pele pálida, fria e sudoréica, respiração rápida e superficial, sem sangramento visível. O quadro sugere e a conduta adotada é:",
        options: [
            "Estado de choque — deitar a vítima, elevar os membros inferiores em cerca de 30 cm e agasalhar até o socorro.",
            "Vertigem simples — manter a vítima em pé e orientá-la a caminhar para retomar a circulação.",
            "Hipoglicemia — administrar bebida ou alimento açucarado imediatamente por via oral.",
            "Exaustão pós-trauma — deixar a vítima descansar até o retorno espontâneo da consciência plena."
        ],
        correctIndex: 0,
        explanation: 'Sinais como palidez, pele fria e respira\u00E7\u00E3o r\u00E1pida indicam choque. A v\u00EDtima deve ser deitada com as pernas elevadas e agasalhada.',
        detailedExplanation: 'Choque \u00E9 quando o corpo n\u00E3o consegue levar oxig\u00EAnio pros \u00F3rg\u00E3os. Os sinais s\u00E3o pele p\u00E1lida e fria, pulso fraco e respira\u00E7\u00E3o r\u00E1pida. A conduta \u00E9 deitar a v\u00EDtima, elevar as pernas, agasalhar e esperar o socorro.',
        commonMistake: 'O aluno pode pensar que \'choque\' \u00E9 s\u00F3 psicol\u00F3gico, mas os sinais f\u00EDsicos s\u00E3o fundamentais para identificar.',
        tip: 'Pele p\u00E1lida, fria e \u00FAmida = choque. Deite, eleve pernas, agasalhe, n\u00E3o d\u00EA nada.',
        incidence: "media",
        trap: true,
        difficulty: 2
    },
    {
        id: "qp40",
        category: "primeiros-socorros",
        statement: "Após colisão na pista de rolamento, vítima é encontrada consciente, em decúbito dorsal, referindo dor intensa na coluna vertebral e relatando \"não consigo mexer as pernas\". Diante da suspeita de lesão medular, a conduta inicial correta do socorrista é:",
        options: [
            "Ajudar a vítima a sentar-se devagar para verificar se a dor diminui com a mudança de posição",
            "Virar a vítima de bruços (decúbito ventral) para aliviar a pressão sobre a coluna",
            "Não movimentar a vítima, imobilizar a cabeça e o pescoço manualmente ou com suporte improvisado, mantendo-a na posição encontrada até a chegada do socorro especializado",
            "Puxar a vítima pelas pernas para retirá-la do asfalto quente e colocá-la na calçada",
        ],
        correctIndex: 2,
        explanation: 'Se a v\u00EDtima t\u00E1 com dor nas costas e n\u00E3o consegue mexer as pernas, \u00E9 melhor n\u00E3o mover ela. Imobilize a cabe\u00E7a e o pesco\u00E7o e espere o socorro chegar.',
        detailedExplanation: 'Quando tem suspeita de les\u00E3o na coluna, mover a v\u00EDtima pode piorar a situa\u00E7\u00E3o e causar danos permanentes. O certo \u00E9 manter a cabe\u00E7a alinhada com o corpo, aquecer a v\u00EDtima e chamar o SAMU ou os Bombeiros. S\u00F3 mova em caso de perigo imediato, tipo fogo ou explos\u00E3o.',
        commonMistake: 'Muita gente acha que deve tirar a v\u00EDtima do ch\u00E3o ou ajudar a sentar, mas isso pode causar problemas s\u00E9rios na coluna.',
        tip: 'Dor nas costas + n\u00E3o consegue mexer as pernas = N\u00C3O MEXA! Imobilize e chame o socorro.',
        incidence: "alta",
        trap: true,
        difficulty: 2
    },
    {
        id: "qp41",
        category: "primeiros-socorros",
        statement: "Após acidente de trânsito, a vítima apresenta crise convulsiva com contrações musculares generalizadas e perda transitória da consciência. Diante desse quadro clínico, o socorrista deve adotar o procedimento:",
        options: [
            "Colocar a mão ou um objeto duro dentro da boca da vítima para evitar que ela morda a língua",
            "Segurar firmemente os braços e pernas da vítima para imobilizá-la durante a convulsão",
            "Afastar objetos próximos que possam ferir a vítima, proteger a cabeça com algo macio e aguardar a crise passar, sem conter os movimentos",
            "Jogar água fria no rosto da vítima para fazê-la parar de convulsionar",
        ],
        correctIndex: 2,
        explanation: 'Se algu\u00E9m tiver uma crise convulsiva, afaste objetos perigosos, proteja a cabe\u00E7a e n\u00E3o segure os movimentos.',
        detailedExplanation: 'Durante a crise, \u00E9 importante tirar tudo que pode machucar a pessoa, colocar algo macio debaixo da cabe\u00E7a e NUNCA colocar nada na boca. Isso porque a pessoa n\u00E3o vai engolir a l\u00EDngua e colocar objetos pode machucar. Depois que a crise passar, coloque a pessoa de lado e chame o SAMU se a crise durar mais de 5 minutos.',
        commonMistake: 'Muita gente acha que deve colocar algo na boca da pessoa, mas isso \u00E9 um grande erro.',
        tip: 'Convuls\u00E3o = Protege a cabe\u00E7a, afasta objetos, NADA na boca.',
        incidence: "media",
        trap: true,
        difficulty: 2
    },
    {
        id: "qp42",
        category: "legislacao",
        statement: "A Autorização para Conduzir Ciclomotor (ACC) é o documento que habilita o cidadão a pilotar ciclomotores (veículos de duas ou três rodas com motor de até 50cc). De acordo com o Código de Trânsito Brasileiro (CTB), qual é o requisito de idade mínima e a validade inicial desse documento?",
        options: [
            "Idade mínima de 16 anos (desde que emancipado) e validade inicial de 2 anos.",
            "Idade mínima de 18 anos, exigindo-se a imputabilidade penal, e validade inicial de 1 ano (estágio probatório, PCC).",
            "Idade mínima de 18 anos, com concessão direta em caráter definitivo, dispensando o período probatório.",
            "Idade mínima de 21 anos, com exigência de curso de especialização em transporte de ciclomotores.",
        ],
        correctIndex: 1,
        explanation: 'Pra tirar a ACC, voc\u00EA precisa ter pelo menos 18 anos. A ACC \u00E9 v\u00E1lida por 1 ano no come\u00E7o (per\u00EDodo probat\u00F3rio).',
        detailedExplanation: 'Segundo o CTB, pra se habilitar, a pessoa tem que ser maior de 18 anos e responder pelos seus atos. A ACC come\u00E7a com uma autoriza\u00E7\u00E3o provis\u00F3ria, que dura 1 ano, e se n\u00E3o rolar infra\u00E7\u00E3o grave, voc\u00EA ganha a definitiva depois.',
        legalBase: "Art. 140 e Art. 148 do CTB",
        commonMistake: 'Muita gente pensa que menores de 18 anos podem tirar a ACC por serem emancipados, mas isso n\u00E3o muda a maioridade penal exigida.',
        tip: 'ACC = 18 anos completos (imputabilidade penal).',
        incidence: "media",
        trap: true,
        difficulty: 2
    },
    {
        id: "qp43",
        category: "legislacao",
        statement: "O condutor habilitado na categoria B há 3 anos deseja dirigir veículos das categorias C, D e E. Considerando os requisitos de idade mínima e tempo de habilitação para cada categoria, assinale a alternativa que apresenta as informações corretas:",
        options: [
            "Para categoria C: 21 anos e 2 anos na B. Para D: 24 anos e 2 anos na B. Para E: 21 anos e 2 anos na B",
            "Para categoria C: 18 anos e estar habilitado na B. Para D: 21 anos e 2 anos na B. Para E: 21 anos e 1 ano na C",
            "Para categoria C: 18 anos e estar habilitado na B. Para D: 21 anos e 2 anos na B (ou 1 ano na C). Para E: 21 anos e 1 ano na C (independentemente de idade mínima superior)",
            "Para categoria C: 21 anos e 1 ano na B. Para D: 21 anos e 2 anos na B. Para E: 24 anos e 2 anos na C",
        ],
        correctIndex: 2,
        explanation: 'C = 18 anos e habilitado na B. D = 21 anos e 2 anos na B ou 1 ano na C. E = 21 anos e 1 ano na C.',
        detailedExplanation: 'Pra categoria C, voc\u00EA precisa ter pelo menos 18 anos e j\u00E1 estar com a B. Na D, s\u00E3o 21 anos e 2 anos com a B ou 1 ano com a C. E na E, tamb\u00E9m 21 anos, mas s\u00F3 precisa de 1 ano na C. Lembre-se: D n\u00E3o exige 24 anos, isso mudou!',
        legalBase: "Art. 145 do CTB (alterado pela Lei 14.071/2021)",
        commonMistake: 'A galera confunde com os 24 anos pra D e 2 anos pra E, mas t\u00E1 errado!',
        tip: 'C = 18+B. D = 21+2B/1C. E = 21+1C. Decore isso e n\u00E3o vai errar!',
        incidence: "altissima",
        trap: true,
        difficulty: 3
    },
    {
        id: "qp44",
        category: "legislacao",
        statement: "O condutor que exerce atividade remunerada em veículo (EAR), como motoristas de aplicativo, taxistas e caminhoneiros, possui regras específicas no sistema de pontuação do CTB. Sobre a suspensão do direito de dirigir para esses condutores, assinale a alternativa correta:",
        options: [
            "O condutor EAR tem limite de 30 pontos para suspensão, independentemente das infrações cometidas",
            "O condutor EAR não está sujeito ao sistema de pontuação, apenas a multas",
            "O condutor EAR tem limite fixo de 40 pontos para suspensão, independentemente da natureza das infrações (não se aplica a regra dos 20/30/40 pontos)",
            "O condutor EAR perde o direito de dirigir ao atingir 20 pontos, independentemente das infrações serem graves ou leves",
        ],
        correctIndex: 2,
        explanation: 'O condutor EAR sempre tem um limite de 40 pontos para suspens\u00E3o, n\u00E3o importa a gravidade das infra\u00E7\u00F5es. \u00C9 uma regra especial.',
        detailedExplanation: 'Antes da nova lei, o condutor EAR tinha 40 pontos, enquanto os outros tinham 20. Agora, todos t\u00EAm limites vari\u00E1veis, mas o EAR continua com os 40 pontos, independente das infra\u00E7\u00F5es. Isso \u00E9 importante porque a habilita\u00E7\u00E3o deles afeta o trabalho e a renda.',
        legalBase: "Art. 261, §2º e §6º do CTB (Lei 14.071/2021)",
        commonMistake: 'Muita gente pensa que a regra de 40 pontos para EAR n\u00E3o existe mais, mas ela ainda t\u00E1 firme e forte como uma regra especial.',
        tip: 'EAR = 40 pontos SEMPRE. \u00C9 o limite fixo especial para profissionais.',
        incidence: "alta",
        trap: true,
        difficulty: 2
    },
    {
        id: "qp45",
        category: "legislacao",
        statement: "O condutor que tem sua CNH suspensa por atingir a pontuação limite ou por infringir regras específicas (como excesso de velocidade acima de 50%) deve cumprir certos requisitos para reabilitar-se. Sobre o processo de reabilitação, assinale a alternativa correta:",
        options: [
            "A suspensão da CNH tem prazo mínimo de 30 dias e máximo de 12 meses, e o condutor deve frequentar curso de reciclagem para reabilitar-se",
            "A suspensão da CNH é definitiva e o condutor deve reiniciar todo o processo de habilitação",
            "O condutor pode recorrer da suspensão dirigindo normalmente até o julgamento do recurso, sem restrições",
            "A suspensão da CNH por pontos exige apenas o pagamento das multas para reabilitação, sem necessidade de curso",
        ],
        correctIndex: 0,
        explanation: 'CNH suspensa: de 30 dias a 12 meses + curso de reciclagem \u00E9 obrigat\u00F3rio pra voltar a dirigir.',
        detailedExplanation: 'Quando a CNH \u00E9 suspensa, voc\u00EA n\u00E3o pode dirigir por um tempo que varia de 30 dias a 12 meses, dependendo da infra\u00E7\u00E3o. Pra voltar a dirigir, precisa fazer um curso de reciclagem e passar na prova te\u00F3rica. Se dirigir durante a suspens\u00E3o, \u00E9 considerado crime!',
        legalBase: "Arts. 261, 268 e 307 do CTB",
        commonMistake: 'Muita gente acha que s\u00F3 pagar a multa resolve, mas precisa fazer o curso de reciclagem tamb\u00E9m.',
        tip: 'CNH suspensa = curso de reciclagem + prova te\u00F3rica. Dirigir suspenso \u00E9 crime!',
        incidence: "alta",
        trap: true,
        difficulty: 2
    },
    {
        id: "qp46",
        category: "legislacao",
        statement: "Em relação à validade da CNH, o CTB estabelece prazos diferentes conforme a faixa etária do condutor. Considerando as alterações introduzidas pela Lei 14.071/2021, assinale a alternativa que indica corretamente os prazos de validade:",
        options: [
            "10 anos para condutores com até 50 anos; 5 anos para condutores entre 50 e 69 anos; 3 anos para condutores com 70 anos ou mais",
            "10 anos para condutores com até 60 anos; 5 anos para condutores entre 60 e 69 anos; 3 anos para condutores com 70 anos ou mais",
            "5 anos para todos os condutores, independentemente da idade, mas com exigência de exame médico anual para maiores de 65 anos",
            "10 anos para condutores com até 65 anos; 5 anos para condutores entre 65 e 74 anos; 2 anos para condutores com 75 anos ou mais",
        ],
        correctIndex: 0,
        explanation: 'Validade da CNH: at\u00E9 50 anos = 10 anos; 50-69 anos = 5 anos; 70+ = 3 anos (Lei 14.071/2021).',
        detailedExplanation: 'A Lei 14.071/2021 mudou os prazos da CNH: quem tem at\u00E9 50 anos fica com 10 anos de validade; entre 50 e 69 anos, a validade \u00E9 de 5 anos; e para quem tem 70 anos ou mais, a validade \u00E9 de 3 anos. Esses prazos come\u00E7am a contar da data que voc\u00EA tira a CNH.',
        legalBase: "Art. 147, §2º do CTB (Lei 14.071/2021)",
        commonMistake: 'Muita gente confunde as idades ou troca os prazos, mas decore: 50-10 / 50a69-5 / 70-3.',
        tip: 'Validade CNH: <50 = 10a / 50-69 = 5a / 70+ = 3a.',
        incidence: "altissima",
        trap: true,
        difficulty: 2
    },
    {
        id: "qp47",
        category: "direcao-defensiva",
        statement: "A direção defensiva estabelece três conceitos fundamentais para a segurança no trânsito: distância de reação, distância de frenagem e distância de parada. Sobre esses conceitos, assinale a alternativa correta:",
        options: [
            "Distância de reação é o percurso percorrido desde o momento em que o condutor pisa no freio até a parada total do veículo",
            "Distância de frenagem é o percurso percorrido desde a percepção do perigo até o acionamento do freio",
            "Distância de parada é a soma da distância de reação com a distância de frenagem, ou seja, desde a percepção do perigo até a parada total",
            "Distância de reação é sempre maior que a distância de frenagem em condições normais de piso e pneus",
        ],
        correctIndex: 2,
        explanation: 'Dist\u00E2ncia de parada \u00E9 a soma da dist\u00E2ncia de rea\u00E7\u00E3o com a dist\u00E2ncia de frenagem. Rea\u00E7\u00E3o \u00E9 perceber o perigo e frear, enquanto frenagem \u00E9 frear at\u00E9 parar.',
        detailedExplanation: 'Temos tr\u00EAs conceitos importantes: Dist\u00E2ncia de REA\u00C7\u00C3O, que \u00E9 o que andamos desde que vemos o perigo at\u00E9 pisar no freio. Dist\u00E2ncia de FRENAGEM, que \u00E9 a dist\u00E2ncia que o carro percorre at\u00E9 parar depois de acionar o freio. A Dist\u00E2ncia de PARADA \u00E9 a soma das duas. A alternativa A confunde os conceitos e a B inverte. A D \u00E9 falsa porque depende das condi\u00E7\u00F5es da pista.',
        commonMistake: 'A galera costuma trocar as defini\u00E7\u00F5es de rea\u00E7\u00E3o e frenagem. Lembre-se: REA\u00C7\u00C3O \u00E9 at\u00E9 frear e FRENAGEM \u00E9 at\u00E9 parar.',
        tip: 'PARADA = REA\u00C7\u00C3O + FRENAGEM. Perceber \u2192 Freiar \u2192 Parar.',
        incidence: "alta",
        trap: true,
        difficulty: 3
    },
    {
        id: "qp48",
        category: "direcao-defensiva",
        statement: "Sob chuva forte, o veículo automotor passa sobre poça d'água na pista de rolamento; o volante fica leve e o veículo flutua, perdendo aderência — é a aquaplanagem. Nesse instante, a conduta para retomar o controle com segurança é:",
        options: [
            "Aplicar frenagem intensa e girar o volante contra a derrapagem para realinhar o veículo.",
            "Desligar imediatamente o motor para reduzir a velocidade e recuperar a aderência.",
            "Retirar o pé do acelerador, manter o volante reto e não frear, aguardando o recontato dos pneus.",
            "Acelerar firmemente para expulsar a água dos sulcos e realçar a aderência dos pneus."
        ],
        correctIndex: 2,
        explanation: 'Na aquaplanagem, tire o p\u00E9 do acelerador, mantenha o volante reto e n\u00E3o freie. Espere os pneus voltarem a tocar o asfalto.',
        detailedExplanation: 'Aquaplanagem acontece quando a \u00E1gua forma uma camada entre os pneus e o asfalto, fazendo o carro \'flutuar\'. O volante fica leve e o motorista perde o controle. O certo \u00E9: (1) TIRAR o p\u00E9 do acelerador, (2) MANTER o volante FIRME e reto, (3) N\u00C3O FREAR, e (4) esperar os pneus voltarem a ter contato com o ch\u00E3o.',
        commonMistake: 'Muita gente acha que deve frear ou virar o volante, mas isso s\u00F3 piora a situa\u00E7\u00E3o.',
        tip: 'Aquaplanagem = P\u00E9 fora do acelerador, volante reto, sem freio.',
        incidence: "alta",
        trap: true,
        difficulty: 2
    },
    {
        id: "qp49",
        category: "direcao-defensiva",
        statement: "Ao fazer uma curva em alta velocidade, o condutor sente seu corpo sendo 'empurrado' para o lado de fora da curva, enquanto o veículo tende a sair de frente ou de traseira. Esse fenômeno físico, que influencia diretamente a estabilidade do veículo em curvas, é denominado:",
        options: [
            "Força centrípeta — que puxa o veículo para dentro da curva, sendo neutralizada pelo peso do veículo",
            "Força centrífuga — que empurra o veículo para fora da curva, aumentando com a velocidade e exigindo redução de marcha antes da entrada da curva",
            "Atrito lateral — que faz o pneu deslizar lateralmente quando o veículo está muito lento na curva",
            "Momento de inércia — que mantém o veículo em linha reta, exigindo aceleração constante na curva",
        ],
        correctIndex: 1,
        explanation: 'A for\u00E7a centr\u00EDfuga \'empurra\' o carro pra fora da curva. A solu\u00E7\u00E3o \u00E9 reduzir a velocidade ANTES de entrar na curva, n\u00E3o durante.',
        detailedExplanation: 'A for\u00E7a centr\u00EDfuga \u00E9 a que faz o carro querer sair da curva, jogando ele pra fora. Quanto mais r\u00E1pido voc\u00EA vai, mais forte \u00E9 essa for\u00E7a. O jeito certo \u00E9 desacelerar antes da curva e, durante, manter a velocidade ou acelerar devagar na sa\u00EDda.',
        commonMistake: 'Muita gente confunde \'centr\u00EDfuga\' com \'centr\u00EDpeta\'. Lembre-se: centr\u00EDFUGA = FUGE pra fora e centr\u00EDPETA = PUXA pra dentro.',
        tip: 'Centr\u00EDFUGA = para FUGA. Reduza ANTES da curva, n\u00E3o durante.',
        incidence: "media",
        trap: true,
        difficulty: 2
    },
    {
        id: "qp50",
        category: "direcao-defensiva",
        statement: "Em relação ao uso de faróis durante a condução noturna em rodovias de pista dupla, analise as afirmativas apresentadas sobre o sistema de iluminação e assinale a conduta correta segundo o CTB e os princípios da direção defensiva:",
        options: [
            "O farol alto deve ser mantido aceso permanentemente em rodovias para melhorar a visibilidade, independentemente de outros veículos",
            "O farol baixo deve estar aceso em rodovias mesmo durante o dia (obrigatório), e à noite deve-se usar o farol alto, reduzindo para baixo ao cruzar com outro veículo ou ao seguir atrás de outro",
            "À noite, o farol alto só pode ser usado em vias rurais não pavimentadas, sendo proibido em rodovias pavimentadas",
            "A luz de neblina dianteira substitui o farol baixo à noite, sendo mais eficiente e consumindo menos energia da bateria",
        ],
        correctIndex: 1,
        explanation: 'Farol baixo tem que estar aceso em rodovias, tanto de dia quanto \u00E0 noite. \u00C0 noite, usa farol alto, mas tem que reduzir ao cruzar ou seguir outro carro.',
        detailedExplanation: 'O CTB manda usar farol baixo durante o dia em rodovias, isso \u00E9 obrigat\u00F3rio desde 2016. \u00C0 noite, o farol alto ajuda a ver melhor, mas deve ser reduzido ao cruzar com outro carro ou ao seguir um, pra n\u00E3o ofuscar a vis\u00E3o de quem vem. Lembre-se, a luz de neblina n\u00E3o substitui o farol baixo e s\u00F3 deve ser usada em situa\u00E7\u00F5es de muita chuva ou neblina.',
        legalBase: "Art. 40, II e III / Art. 250 do CTB",
        commonMistake: 'Muita gente pensa que pode deixar o farol alto ligado sempre, mas tem que saber quando reduzir.',
        tip: 'Farol baixo em rodovias (dia). Farol alto \u00E0 noite, reduzindo ao cruzar/seguir.',
        incidence: "alta",
        difficulty: 1
    },
    {
        id: "qp51",
        category: "direcao-defensiva",
        statement: "Caminhão bitrem trafega pela faixa da direita em rodovia de pista dupla e o condutor pretende executar transposição de faixa para ultrapassá-lo pela esquerda. Pela direção defensiva e pelo CTB, os cuidados essenciais são:",
        options: [
            "Buzinar de forma contínua na aproximação e acelerar ao máximo para minimizar o tempo na faixa adjacente.",
            "Conferir o espaço disponível, sinalizar com a seta, ultrapassar pela esquerda com segurança e retornar à faixa direita só após visualizar o caminhão inteiro no retrovisor interno.",
            "Ultrapassar pela direita, pois os caminhões trafegam pela esquerda, usando o acostamento se necessário.",
            "Acionar o pisca-alerta previamente para comunicar a todos que efetuará a ultrapassagem."
        ],
        correctIndex: 1,
        explanation: 'Na hora de ultrapassar, sempre pela esquerda, sinalize com a seta e fa\u00E7a tudo com seguran\u00E7a.',
        detailedExplanation: 'Para ultrapassar de forma segura, voc\u00EA precisa: (1) olhar se a faixa da esquerda t\u00E1 livre e se d\u00E1 pra passar; (2) sinalizar com a seta pra esquerda; (3) acelerar um pouco e ultrapassar; (4) s\u00F3 voltar pra direita quando ver o caminh\u00E3o no retrovisor interno. Lembre-se que ultrapassar pela direita \u00E9 proibido, a n\u00E3o ser que o da esquerda esteja virando.',
        legalBase: "Arts. 196 a 199 do CTB",
        commonMistake: 'Muita gente pensa que pode usar o pisca-alerta ou buzinar pra avisar, mas o certo \u00E9 usar a seta pra esquerda e garantir a seguran\u00E7a.',
        tip: 'Ultrapassar = seta esquerda, acelere, ultrapasse, volte ao ver no retrovisor.',
        incidence: "alta",
        difficulty: 1
    },
    {
        id: "qp52",
        category: "prioridade",
        statement: "Em rotatória sem semáforo no perímetro urbano, o condutor aguarda para ingressar enquanto outro veículo já circula pela faixa interna; simultaneamente, um terceiro se aproxima pela sua direita. Pelo CTB, a preferência de passagem é:",
        options: [
            "Do veículo em manobra de ingresso, pois a conversão na rotatória lhe assegura prioridade sobre o tráfego interno.",
            "Do veículo que já trafega dentro da rotatória; o condutor que se aproxima deve aguardar, prevalecendo a circulação contínua.",
            "Do veículo que se aproxima pela direita do condutor, pois a regra geral da direita supera a preferência da rotatória.",
            "De todos simultaneamente, cabendo a cada um transpor o eixo da entrada na ordem de chegada ao ponto de conflito."
        ],
        correctIndex: 1,
        explanation: 'Na rotat\u00F3ria, quem j\u00E1 est\u00E1 circulando tem a prefer\u00EAncia. Quem vai entrar precisa esperar.',
        detailedExplanation: 'Em rotat\u00F3rias, a regra \u00E9 clara: o carro que j\u00E1 est\u00E1 dentro passa primeiro, mesmo que outro ve\u00EDculo venha pela direita. O motorista que vai entrar deve desacelerar e esperar um momento seguro para entrar, garantindo que o tr\u00E2nsito flua sem parar.',
        legalBase: "Art. 29, II e III do CTB / Res. CONTRAN 745/2018",
        commonMistake: 'Muita gente confunde a regra da direita com a da rotat\u00F3ria; lembre-se: quem est\u00E1 DENTRO passa primeiro.',
        tip: 'Rotat\u00F3ria = DENTRO tem prefer\u00EAncia; quem entra aguarda.',
        incidence: "alta",
        trap: true,
        difficulty: 2
    },
    {
        id: "qp53",
        category: "prioridade",
        statement: "Ambulância em serviço de urgência, com sirene e giroflex acionados, aproxima-se de interseção em vermelho para o seu sentido; veículos parados obstruem a pista de rolamento. A conduta dos demais condutores deve ser:",
        options: [
            "Manter a posição parada, pois o sinal vermelho prevalece sobre qualquer prioridade de trânsito.",
            "Transpor o sinal vermelho imediatamente sem sinalizar, para não obstruir a passagem da ambulância.",
            "Deslocar-se com segurança para a faixa da esquerda, abrir passagem pela direita e, se necessário, avançar o vermelho com cuidado.",
            "Buzinar sucessivamente para indicar o sinal fechado e manter-se parado no eixo da via."
        ],
        correctIndex: 2,
        explanation: 'Quando a ambul\u00E2ncia t\u00E1 com sirene ligada, todo mundo deve liberar a passagem pela esquerda, mesmo que tenha que avan\u00E7ar o sinal vermelho com cuidado.',
        detailedExplanation: 'Ve\u00EDculos de emerg\u00EAncia, como ambul\u00E2ncias e viaturas, t\u00EAm prioridade em situa\u00E7\u00F5es de urg\u00EAncia. Os outros motoristas precisam se mover para a esquerda e deixar a passagem livre pela direita. Se estiverem em um cruzamento, podem avan\u00E7ar o sinal vermelho com cuidado para ajudar a ambul\u00E2ncia a passar.',
        legalBase: "Art. 29, §2º do CTB",
        commonMistake: 'Muita gente pensa que nunca pode avan\u00E7ar o sinal vermelho, mas dar passagem a ve\u00EDculo de emerg\u00EAncia \u00E9 uma exce\u00E7\u00E3o. A passagem deve ser pela esquerda.',
        tip: 'Sirene ligada = DESLOQUE para a esquerda, passe pela direita e avance o sinal se precisar.',
        incidence: "alta",
        trap: true,
        difficulty: 2
    },
    {
        id: "qp54",
        category: "prioridade",
        statement: "Em faixa de travessia de pedestres sem semáforo, deficiente visual parado na calçada mantém a bengala branca estendida aguardando atravessar, enquanto veículo se aproxima pela pista de rolamento. Pelo CTB e pelo Estatuto da Pessoa com Deficiência, o condutor deve:",
        options: [
            "Acionar a buzina para sinalizar a presença do veículo, pois o pedestre pode não perceber a aproximação.",
            "Reduzir a velocidade e transpor a faixa lentamente, mantendo distância segura do pedestre parado.",
            "Parar o veículo e aguardar a travessia completa, assegurando prioridade absoluta do pedestre com deficiência visual.",
            "Prosseguir normalmente, pois ausência de semáforo significa igualdade de condições na interseção."
        ],
        correctIndex: 2,
        explanation: 'Pedestre com defici\u00EAncia visual (bengala branca) tem prioridade total. O motorista TEM que parar e esperar ele atravessar.',
        detailedExplanation: 'De acordo com as leis, quem usa bengala branca tem prioridade absoluta sobre os carros. O motorista n\u00E3o pode s\u00F3 reduzir a velocidade, ele precisa parar e deixar o pedestre passar com seguran\u00E7a. A buzina pode assustar e apressar o pedestre, e acelerar para passar \u00E9 uma infra\u00E7\u00E3o grave.',
        legalBase: "Art. 70 do CTB / Lei 13.146/2015 (Estatuto da Pessoa com Deficiência)",
        commonMistake: 'Muita gente pensa que s\u00F3 reduzir a velocidade \u00E9 suficiente, mas para quem tem defici\u00EAncia, a prioridade \u00E9 TOTAL \u2014 \u00E9 preciso PARAR e esperar.',
        tip: 'Bengala branca (deficiente visual) = PARE e aguarde. Prioridade total.',
        incidence: "media",
        trap: true,
        difficulty: 2
    },
    {
        id: "qp55",
        category: "placas",
        statement: "Durante trajeto em rodovia, o condutor observa placa azul com símbolo de telefone e, logo adiante, placa verde com nome de cidade e distância. Pela classificação do CTB, os grupos de sinalização dessas duas placas são:",
        options: [
            "Ambas de regulamentação, pois constituem ordens que o condutor deve cumprir.",
            "A primeira é de advertência sobre serviço auxiliar e a segunda é de regulamentação de destino.",
            "A primeira identifica serviço auxiliar e a segunda orienta destino — ambas integram a sinalização de indicação.",
            "A primeira é de advertência e a segunda de indicação turística de traçado rodoviário."
        ],
        correctIndex: 2,
        explanation: 'Placa azul com s\u00EDmbolo branco \u00E9 pra servi\u00E7os (como telefone). Placa verde mostra a dist\u00E2ncia at\u00E9 a pr\u00F3xima cidade. Ambas s\u00E3o sinaliza\u00E7\u00E3o de INDICA\u00C7\u00C3O.',
        detailedExplanation: 'Sinaliza\u00E7\u00E3o de INDICA\u00C7\u00C3O tem placas azuis com s\u00EDmbolo branco pra servi\u00E7os, como hospitais e postos. As placas verdes d\u00E3o informa\u00E7\u00F5es sobre cidades e dist\u00E2ncias. Lembre-se das cores: azul \u00E9 servi\u00E7o e verde \u00E9 destino.',
        commonMistake: 'Muita gente confunde as cores das placas; azul \u00E9 pra servi\u00E7os, verde \u00E9 pra destinos.',
        tip: 'Azul = servi\u00E7o. Verde = destino. Ambas = INDICA\u00C7\u00C3O.',
        incidence: "alta",
        trap: true,
        difficulty: 2
    },
    {
        id: "qp56",
        category: "placas",
        statement: "No mesmo trajeto urbano, o condutor visualiza placa circular de fundo branco, orla vermelha e buzina riscada; adiante, placa quadrada losangular amarela com desenho de criança. A classificação dessas placas é:",
        options: [
            "A primeira é de advertência sobre trânsito de veículos sonoros e a segunda de regulamentação que obriga o uso de buzina.",
            "A primeira é de regulamentação, que proíbe o acionamento de sinal sonoro, e a segunda é de advertência, que alerta para área com crianças.",
            "Ambas são de regulamentação, pois impõem condutas obrigatórias ao condutor.",
            "A primeira é de regulamentação e a segunda é de indicação de serviço auxiliar de trânsito."
        ],
        correctIndex: 1,
        explanation: 'Placa redonda branca com borda vermelha \u00E9 de Regulamenta\u00E7\u00E3o (R-19: buzina proibida). Placa quadrada amarela \u00E9 de Advert\u00EAncia (A-32b: crian\u00E7as).',
        detailedExplanation: 'As placas se classificam pela forma e cor: REDONDA, fundo BRANCO e borda VERMELHA mostra regras ou proibi\u00E7\u00F5es, como a R-19. J\u00E1 a QUADRADA, fundo AMARELO, serve pra avisar sobre perigos, como a A-32b que indica \u00E1rea com crian\u00E7as.',
        legalBase: "Manual Brasileiro de Sinalização de Trânsito — Volume I (Sinalização Vertical)",
        commonMistake: 'Muita gente confunde placas REDONDAS (regulamenta\u00E7\u00E3o) com QUADRADAS (advert\u00EAncia).',
        tip: 'Redonda = REGULAMENTA\u00C7\u00C3O; Quadrada = ADVERT\u00CANCIA.',
        incidence: "alta",
        trap: true,
        difficulty: 2
    },
    {
        id: "qd01",
        category: "placas",
        statement: "Em rodovia em obras, a pista de rolamento afunila e a placa de advertência A-10 anuncia redução do número de faixas adiante. Pelo CTB e pela direção defensiva, ao se aproximar desse estreitamento, o condutor deve:",
        options: [
            "Acelerar para transpor o trecho antes do afunilamento e assegurar a preferência de passagem.",
            "Reduzir a velocidade, observar a sinalização e revezar a passagem, cedendo aos veículos já presentes no trecho.",
            "Imobilizar o veículo no meio da pista com o pisca-alerta até que o trânsito seja retomado.",
            "Manter a velocidade e acionar sucessivamente a buzina para alertar os demais usuários."
        ],
        correctIndex: 1,
        explanation: 'A placa A-10 avisa que a pista vai estreitar. O certo \u00E9 diminuir a velocidade e ajudar na passagem intercalada, dando a vez pra quem j\u00E1 t\u00E1 no trecho estreito.',
        detailedExplanation: 'Quando a pista afunila, a placa A-10 aparece pra avisar que as faixas v\u00E3o diminuir. O que voc\u00EA deve fazer \u00E9 reduzir a velocidade, ficar atento e cooperar na passagem, deixando os carros entrarem de forma alternada, tipo um z\u00EDper. Acelerar, parar no meio ou buzinar s\u00F3 atrapalha e pode causar acidentes.',
        legalBase: "Manual Brasileiro de Sinalização de Trânsito — Volume I (placa A-10) e princípios da direção defensiva",
        commonMistake: 'Muita gente confunde a placa A-10 com \'pare\' ou \'prefer\u00EAncia\', mas ela \u00E9 s\u00F3 um aviso de que a pista vai estreitar.',
        tip: 'A-10 = Estreitamento = Reduz e ajuda no z\u00EDper.',
        incidence: "alta",
        trap: true,
        difficulty: 2
    },
    {
        id: "qd02",
        category: "legislacao",
        statement: "De acordo com o art. 90 do CTB, a sinalização de trânsito também é realizada por sinais sonoros (silvos de apito) e gestos do agente de trânsito. Sobre os silvos de apito emitidos pelo agente, é correto afirmar que:",
        options: [
            "Um silvo longo significa 'sigam' (liberar a passagem) e dois silvos breves significam 'diminuam a marcha'.",
            "Um silvo breve significa 'sigam'; dois silvos breves significam 'parem'; um silvo longo significa 'diminuam a marcha'.",
            "Os silvos não possuem significado oficial, servindo apenas para chamar a atenção dos condutores.",
            "Os silvos de apito só têm validade se acompanhados de gestos; isoladamente não orientam o trânsito.",
        ],
        correctIndex: 1,
        explanation: 'Um silvo breve \u00E9 pra seguir; dois silvos breves \u00E9 pra parar; um silvo longo \u00E9 pra diminuir a velocidade.',
        detailedExplanation: 'O apito do agente \u00E9 uma forma oficial de sinaliza\u00E7\u00E3o. Um silvo breve significa \'siga\'; dois silvos breves significam \'pare\'; e um silvo longo significa \'diminuam a marcha\'. Decorar esses sinais \u00E9 f\u00E1cil e ajuda na prova.',
        legalBase: "Art. 90 do CTB",
        commonMistake: 'Muita gente confunde e acha que dois silvos breves significam \'siga\' ou que o silvo longo \u00E9 pra parar. Lembre: 1 breve = siga; 2 breves = pare; 1 longo = devagar.',
        tip: '1 pio = vai; 2 pios = para; 1 pio longo = devagar.',
        incidence: "altissima",
        trap: true,
        difficulty: 2
    },
    {
        id: "qd03",
        category: "legislacao",
        statement: "Em interseção com semáforo funcionando, agente de trânsito determina com gestos que os veículos de uma via urbana avancem e os da via transversal parem. Pela hierarquia dos sinais prevista no Art. 89 do CTB, a conduta correta do condutor é:",
        options: [
            "Obedecer aos gestos do agente, pois suas ordens prevalecem sobre o semáforo e demais sinais.",
            "Obedecer ao semáforo, pois os equipamentos eletrônicos possuem prioridade sobre ordens humanas.",
            "Obedecer às placas, por serem elementos fixos e permanentes da sinalização.",
            "Considerar o agente apenas como orientador, seguindo o semáforo para evitar autuação."
        ],
        correctIndex: 0,
        explanation: 'Os gestos do agente s\u00E3o mais importantes que o sem\u00E1foro, ent\u00E3o os motoristas devem seguir o que ele manda.',
        detailedExplanation: 'Quando um agente de tr\u00E2nsito est\u00E1 orientando o tr\u00E2nsito, ele tem prioridade nas ordens. Isso significa que, mesmo que o sem\u00E1foro esteja vermelho, se o agente pedir para parar, o motorista deve obedecer. Ignorar isso \u00E9 uma infra\u00E7\u00E3o.',
        legalBase: "Arts. 89 e 195 do CTB",
        commonMistake: 'Muita gente acha que o sem\u00E1foro \u00E9 mais importante que o agente, mas na verdade \u00E9 o contr\u00E1rio.',
        tip: 'Agente manda = Motorista obedece, mesmo que o sem\u00E1foro esteja vermelho.',
        incidence: "altissima",
        trap: true,
        difficulty: 2
    },
    {
        id: "qp57",
        category: "legislacao",
        statement: "Em via urbana de mão dupla sem canteiro central, o condutor pretende converter à esquerda na interseção e deve cumprir a regra de posicionamento do CTB. A conduta correta antes e durante a conversão é:",
        options: [
            "Aproximar-se do ângulo esquerdo da via, imobilizar o veículo e cruzar assim que possível.",
            "Aproximar-se da linha divisória central sem invadir a pista contrária e só converter após ceder o fluxo oposto.",
            "Aproximar-se do bordo direito ou do acostamento, parar e aguardar a via totalmente livre.",
            "Permanecer ao centro da faixa, acionar o pisca-alerta e converter rapidamente, pois a sinalização dá preferência."
        ],
        correctIndex: 1,
        explanation: 'Pra convergir \u00E0 esquerda, o motorista deve ficar bem perto da linha do meio da pista, sem entrar na faixa dos carros que v\u00EAm na dire\u00E7\u00E3o contr\u00E1ria, e esperar a vez deles passarem.',
        detailedExplanation: 'Quando for virar \u00E0 esquerda em via de duplo sentido, o motorista precisa se posicionar com anteced\u00EAncia perto da linha central, mas sem cruz\u00E1-la. Ele deve esperar os carros que v\u00EAm de frente antes de fazer a convers\u00E3o.',
        legalBase: "Arts. 38, II e 40 do CTB",
        commonMistake: 'Muita gente confunde e acha que pode usar o \'bordo esquerdo\' em via de duplo sentido, mas isso \u00E9 contram\u00E3o!',
        tip: 'Esquerda em m\u00E3o dupla = perto da LINHA CENTRAL (sem invadir) + ceder passagem a quem vem de frente.',
        incidence: "altissima",
        trap: true,
        difficulty: 3
    },
    {
        id: "qp58",
        category: "mecanica",
        statement: "Em tráfego intenso, o fluxo à frente para de repente e o condutor aciona os comandos de forma equivocada: as rodas traseiras travam, o veículo perde aderência e a traseira derrapa para o lado. A causa desse travamento é:",
        options: [
            "Pisar no freio progressivamente, acompanhado do acionamento da embreagem antes da imobilização total.",
            "Puxar o freio de mão com o veículo em movimento ou forçar redução de marcha em alta rotação, travando o eixo traseiro.",
            "Atuação do ABS, que imobiliza simultaneamente tambor e sapata traseiros para máxima desaceleração.",
            "Falha de fluido no cilindro mestre, que equaliza a pressão e trava apenas o freio traseiro."
        ],
        correctIndex: 1,
        explanation: 'Puxar o freio de m\u00E3o com o carro em movimento ou reduzir marcha r\u00E1pido demais trava as rodas traseiras e faz o carro derrapar.',
        detailedExplanation: 'Quando voc\u00EA puxa o freio de estacionamento (freio de m\u00E3o) enquanto o carro est\u00E1 em movimento, ele trava as rodas traseiras, o que pode causar derrapagem. Outra situa\u00E7\u00E3o \u00E9 quando voc\u00EA reduz a marcha de forma abrupta em alta velocidade, o que tamb\u00E9m pode travar o eixo traseiro e tirar a ader\u00EAncia. O correto \u00E9 usar o pedal de freio e embreagem para parar sem travar as rodas.',
        legalBase: "Fundamentos de mecânica veicular e condução segura (art. 28 do CTB)",
        commonMistake: 'Muita gente acha que o ABS trava as rodas, mas na verdade ele evita isso!',
        tip: 'Traseira travou = freio de M\u00C3O em movimento ou marcha reduzida r\u00E1pida.',
        incidence: "alta",
        trap: true,
        difficulty: 3
    },
    {
        id: "qp59",
        category: "direcao-defensiva",
        statement: "No perímetro urbano, à saída de escola, o condutor encontra grande concentração de crianças no bordo da pista, atravessando fora da faixa de pedestres. Em área escolar de alto risco, a conduta defensiva ao passar pelo trecho é:",
        image_url: "https://tqeqsotsasglmhlmwdwy.supabase.co/storage/v1/object/public/library/images/placa-area-escolar-A-33A.webp",
        options: [
            "Acelerar para atravessar o agrupamento rapidamente, utilizando a buzina para afastar as crianças.",
            "Reduzir a velocidade de forma adequada ao trecho, mantendo atenção integral e prontidão para frear e parar.",
            "Manter a velocidade máxima da sinalização, pois a travessia irregular é responsabilidade dos pedestres.",
            "Acionar o pisca-alerta, manter a velocidade e usar o farol alto para assegurar a preferência do veículo."
        ],
        correctIndex: 1,
        explanation: 'Em \u00E1rea escolar cheia de crian\u00E7as e pedestres, a melhor atitude \u00E9 diminuir a velocidade e ficar bem atento, pronto pra parar.',
        detailedExplanation: 'Quando tem aglomera\u00E7\u00E3o de crian\u00E7as, a seguran\u00E7a \u00E9 mais importante que a velocidade que t\u00E1 na placa. O motorista deve dirigir devagar, prestar aten\u00E7\u00E3o e estar preparado pra parar, porque acelerar ou buzinar pode colocar os mais vulner\u00E1veis em risco. Ignorar a situa\u00E7\u00E3o real e manter a velocidade da placa n\u00E3o \u00E9 seguro, e o pisca-alerta n\u00E3o pode ser usado com o carro em movimento.',
        legalBase: "Arts. 28, 29 e 40 do CTB e princípios da direção defensiva",
        commonMistake: 'O erro comum \u00E9 achar que pode manter a velocidade da placa, mesmo com risco de acidente.',
        tip: 'Crian\u00E7a na rua = REDUZIR a velocidade + aten\u00E7\u00E3o redobrada + pronto pra parar.',
        incidence: "altissima",
        trap: true,
        difficulty: 2
    },
    {
        id: "qp60",
        category: "direcao-defensiva",
        statement: "Em rodovia de trânsito rápido de pista dupla, o condutor deixa de tomar a alça de acesso pretendida e pondera como corrigir o erro com segurança. Pela direção defensiva e pelo CTB, a conduta correta é:",
        options: [
            "Imobilizar no acostamento, acionar o pisca-alerta e efetuar marcha ré até alcançar a alça perdida.",
            "Parar no acostamento, descer do veículo e buscar atalho ou entrada clandestina nas proximidades.",
            "Seguir na rodovia na velocidade da via até a próxima saída ou retorno sinalizado e liberado.",
            "Circulando lentamente pela faixa da direita com a seta ligada, aguardar brecha no canteiro central."
        ],
        correctIndex: 2,
        explanation: 'Perdeu a sa\u00EDda? Continue na rodovia e pegue a pr\u00F3xima sa\u00EDda, interse\u00E7\u00E3o ou retorno sinalizado \u2014 nunca fa\u00E7a marcha \u00E0 r\u00E9, n\u00E3o pare no acostamento nem tente voltar improvisando.',
        detailedExplanation: 'Em rodovias r\u00E1pidas, tentar voltar pode ser muito perigoso e causar acidentes. A melhor op\u00E7\u00E3o \u00E9 seguir at\u00E9 o pr\u00F3ximo retorno oficial, mesmo que isso signifique rodar mais alguns quil\u00F4metros. Fazer marcha \u00E0 r\u00E9 ou parar no acostamento sem emerg\u00EAncia \u00E9 uma infra\u00E7\u00E3o grav\u00EDssima e coloca todos em risco.',
        legalBase: "Arts. 206, V e 219 do CTB e princípios da direção defensiva",
        commonMistake: 'Muita gente acha que dar uma r\u00E9 no acostamento resolve, mas isso \u00E9 grav\u00EDssimo e pode causar acidentes.',
        tip: 'Perdeu a sa\u00EDda = SEGUE EM FRENTE at\u00E9 o pr\u00F3ximo retorno. R\u00E9 em rodovia \u00E9 grav\u00EDssima, e parar no acostamento s\u00F3 em emerg\u00EAncia real.',
        incidence: "altissima",
        trap: true,
        difficulty: 3
    },
    {
        id: "qp61",
        category: "direcao-defensiva",
        statement: "O condutor circula à noite em via urbana desprovida de iluminação pública com a luz interna de teto do veículo acesa, prática aparentemente inofensiva. Sobre esse hábito, a avaliação correta pela direção defensiva é:",
        options: [
            "A luz interna auxilia os demais usuários a identificar o veículo, funcionando como item adicional de segurança.",
            "A luz de teto destina-se ao veículo imobilizado; em movimento, reflete no para-brisa e compromete a visão noturna.",
            "A luz interna substitui a lanterna traseira caso o farol queime, permitindo a circulação noturna.",
            "O uso da luz de teto é recomendado em vias sem poste, para sinalizar a presença de ocupantes."
        ],
        correctIndex: 1,
        explanation: 'A luz interna do carro s\u00F3 serve pra iluminar o interior quando o ve\u00EDculo t\u00E1 parado; deix\u00E1-la acesa enquanto dirige atrapalha a vis\u00E3o por causa dos reflexos no para-brisa.',
        detailedExplanation: 'A luz do teto \u00E9 s\u00F3 pra ajudar os passageiros e n\u00E3o serve pra sinalizar o carro. Quando t\u00E1 escuro, a luz acesa dentro do carro reflete no vidro e dificulta a vis\u00E3o do motorista, aumentando as chances de acidente. A alternativa A engana porque mistura a luz interna com as luzes que realmente ajudam a ser visto na estrada.',
        legalBase: "Sistema de iluminação veicular (arts. 40 e 249 do CTB)",
        commonMistake: 'A galera confunde a luz interna com as luzes que fazem o carro ser visto, achando que mais luz dentro ajuda na visibilidade externa.',
        tip: 'Luz do teto \u00E0 noite = conforto do passageiro, N\u00C3O sinaliza\u00E7\u00E3o.',
        incidence: "alta",
        trap: true,
        difficulty: 2
    },
    {
        id: "qp62",
        category: "meio-ambiente",
        statement: "Em fiscalização, veículo automotor é reprovado na inspeção de fumaça e ruído (PROCONVE), com escapamento e catalisador deficientes, e o proprietário segue circulando sem regularizar. Pelo CTB e pelas normas ambientais, aplicam-se:",
        options: [
            "Infração gravíssima, com multa, suspensão do direito de dirigir e remoção imediata do veículo.",
            "Infração grave, com multa e retenção do veículo até a regularização do escapamento e nova inspeção.",
            "Infração leve, com mera advertência escrita por se tratar da primeira ocorrência.",
            "Configura crime ambiental, com cassação da CNH e apreensão do veículo pelo órgão ambiental."
        ],
        correctIndex: 1,
        explanation: 'Dirigir um carro que n\u00E3o t\u00E1 em dia com a emiss\u00E3o de poluentes \u00E9 infra\u00E7\u00E3o GRAVE, com multa e RETEN\u00C7\u00C3O do ve\u00EDculo at\u00E9 arrumar o problema.',
        detailedExplanation: 'Quando o carro n\u00E3o passa na inspe\u00E7\u00E3o por causa dos gases e ru\u00EDdos, isso \u00E9 considerado infra\u00E7\u00E3o GRAVE. O ve\u00EDculo fica RETIDO at\u00E9 o dono consertar o sistema de exaust\u00E3o e o catalisador, e s\u00F3 depois \u00E9 liberado. Cuidado com a pegadinha da remo\u00E7\u00E3o, que n\u00E3o acontece nesse caso!',
        legalBase: "Art. 230, XVIII do CTB",
        commonMistake: 'A armadilha mais comum \u00E9 confundir RETEN\u00C7\u00C3O com REMO\u00C7\u00C3O, achando que o carro vai ser guinchado.',
        tip: 'Emiss\u00E3o irregular = GRAVE + RETEN\u00C7\u00C3O para consertar, n\u00E3o \u00E9 remo\u00E7\u00E3o.',
        incidence: "alta",
        trap: true,
        difficulty: 3
    },
    {
        id: "qp63",
        category: "legislacao",
        statement: "O condutor trafega por via urbana coletora que distribui o fluxo das arteriais e atende bairro e comércio, sem placa R-19 de velocidade. Pelo limite padrão do CTB por classe de via, a velocidade máxima nessa coletora é de:",
        options: [
            "30 km/h, por ser via local de acesso restrito a edificações.",
            "40 km/h, padrão das vias coletoras sem sinalização regulamentadora.",
            "60 km/h, padrão das vias arteriais de ligação contínua entre regiões.",
            "80 km/h, padrão das vias de trânsito rápido do perímetro urbano."
        ],
        correctIndex: 1,
        explanation: 'Via coletora sem sinaliza\u00E7\u00E3o = 40 km/h. As vias coletoras ajudam a distribuir o tr\u00E2nsito na cidade.',
        detailedExplanation: 'As vias coletoras s\u00E3o feitas pra juntar e soltar o tr\u00E2nsito que vem das vias principais e ajudam a movimentar os carros nos bairros. Se n\u00E3o tem placa, a velocidade m\u00E1xima \u00E9 40 km/h, que \u00E9 o limite pra esse tipo de via. N\u00E3o confunda com a via local, que \u00E9 30 km/h, ou a arterial, que \u00E9 60 km/h.',
        legalBase: "Arts. 60 e 61 do CTB",
        commonMistake: 'Muita gente acha que sem placa n\u00E3o tem limite, mas o padr\u00E3o ainda vale e a coletora \u00E9 40 km/h.',
        tip: 'Coletora = 40 km/h. Decore a escada urbana: local 30, coletora 40, arterial 60, tr\u00E2nsito r\u00E1pido 80.',
        incidence: "altissima",
        trap: true,
        difficulty: 2
    },
    {
        id: "sinistro-sinalizacao-001",
        category: "legislacao",
        statement: "Após sinistro, o veículo ficou imobilizado sobre a pista de rolamento, com o trânsito circulando pelo trecho e havendo condições de sinalização. Pelas regras do CTB, o modo correto de sinalizar o local antes do atendimento é:",
        options: [
            "Acionar o pisca-alerta e posicionar o triângulo a pelo menos 30 metros atrás do veículo, perpendicular ao eixo da via e bem visível.",
            "Acionar o pisca-alerta e posicionar o triângulo a exatos 30 metros à frente do veículo, paralelo ao eixo da via.",
            "Posicionar o triângulo a cerca de 30 metros ao centro da faixa, sem acionar o pisca-alerta se o veículo estiver visível.",
            "Posicionar o triângulo a menos de 30 metros, atravessado na via, pois a distância mínima só se aplica com vítima."
        ],
        correctIndex: 0,
        explanation: 'A alternativa A t\u00E1 certa porque pede pra ligar as luzes de alerta e colocar o tri\u00E2ngulo a pelo menos 30 metros atr\u00E1s do carro, em um lugar que todo mundo veja.',
        detailedExplanation: 'Depois de um acidente, se o motorista puder fazer algo pra evitar mais problemas, ele deve sinalizar bem o local. Isso inclui ligar as luzes de alerta e colocar o tri\u00E2ngulo a 30 metros da traseira do carro, de forma que fique vis\u00EDvel e na posi\u00E7\u00E3o certa.',
        legalBase: "CTB, art. 176, V; CTB, art. 225, conforme a situação; Manual Brasileiro de Fiscalização de Trânsito (MBFT), procedimentos relativos à sinalização do local do sinistro.",
        commonMistake: 'Um erro comum \u00E9 achar que a dist\u00E2ncia de 30 metros \u00E9 medida da frente do carro ou que o tri\u00E2ngulo deve ficar paralelo \u00E0 pista.',
        tip: 'Situa\u00E7\u00E3o = A\u00E7\u00E3o: Acidente = Luzes + Tri\u00E2ngulo 30m atr\u00E1s + Vis\u00EDvel.',
        incidence: "alta",
        trap: true,
        difficulty: 3
    },
    {
        id: "qp64",
        category: "legislacao",
        statement: "Em uma via terrestre aberta à circulação, o condutor deve posicionar o veículo lateralmente conforme a regra geral do CTB, que admite exceções apenas quando devidamente sinalizadas pelo órgão competente. Pela norma geral, o trânsito de veículos deve ser feito pelo lado:",
        options: [
            "Pelo lado esquerdo, seguindo o padrão internacional de trânsito rápido (mão inglesa), facilitando ultrapassagens seguras em vias urbanas.",
            "Pelo lado direito da via, admitindo-se as exceções devidamente sinalizadas pelo órgão competente ou em manobras de ultrapassagem.",
            "Pelo centro da via, para garantir uma distância segura dos acostamentos, calçadas e pedestres que circulam nas laterais.",
            "Pelo lado que apresentar melhor estado de conservação do asfalto, cabendo ao condutor decidir livremente a faixa mais conveniente.",
        ],
        correctIndex: 1,
        explanation: 'A gente deve andar pelo lado direito da pista, a n\u00E3o ser que tenha sinaliza\u00E7\u00E3o diferente.',
        detailedExplanation: 'Na maioria das vezes, os carros circulam pela direita da via. S\u00F3 pode usar a esquerda para ultrapassar ou se tiver sinaliza\u00E7\u00E3o dizendo que pode. Andar pela contram\u00E3o \u00E9 errado e d\u00E1 multa pesada.',
        legalBase: "Art. 29, II do CTB",
        commonMistake: 'Muita gente confunde as regras e acha que pode andar pela esquerda sem prestar aten\u00E7\u00E3o nas sinaliza\u00E7\u00F5es.',
        tip: 'Regra = Andar pela direita; A\u00E7\u00E3o = Usar a esquerda s\u00F3 pra ultrapassar.',
        incidence: "altissima",
        trap: true,
        difficulty: 2
    },
    {
        "id": "placa_a32a_alta",
        "category": "legislacao",
        "image_url": "https://tqeqsotsasglmhlmwdwy.supabase.co/storage/v1/object/public/library/images/placa-transito-de-pedestre-A32a.webp",
        "statement": "Ao trafegar por uma via urbana, um condutor observa a placa de advertência A-32a. Diante dessa sinalização, de acordo com o Manual Brasileiro de Sinalização de Trânsito do CONTRAN e o Código de Trânsito Brasileiro (CTB), qual é o significado correto da placa e qual a conduta esperada do condutor ao se aproximar do local?",
        "options": [
            "A placa significa 'Trânsito de Pedestres'. Advertindo sobre a travessia habitual ou a presença de pedestres na via, o condutor deve redobrar a atenção e diminuir a velocidade, não sendo este local obrigatoriamente marcado com faixa delimitada.",
            "A placa significa 'Passagem Sinalizada de Pedestres'. O condutor deve parar obrigatoriamente o veículo antes do local indicado, pois a sinalização indica obrigatoriedade de preferência devido à faixa pintada na pista.",
            "A placa significa 'Área Escolar'. O condutor deve reduzir a velocidade para no máximo 30 km/h, pois indica a proximidade imediata de travessia exclusiva de alunos.",
            "A placa significa 'Pedestre, ande pela esquerda'. Trata-se de uma ordem de regulamentação destinada ao trânsito de pedestres nos acostamentos das rodovias."
        ],
        "correctIndex": 0,
        "explanation": 'A placa A-32a avisa que tem \'Tr\u00E2nsito de Pedestres\'. Isso quer dizer que pode ter pedestres atravessando a via, ent\u00E3o \u00E9 bom ficar esperto e reduzir a velocidade.',
        "detailedExplanation": 'As placas de advert\u00EAncia servem pra avisar, n\u00E3o pra mandar fazer. A A-32a mostra que \u00E9 comum ter pedestres por ali, ent\u00E3o o motorista precisa ter mais aten\u00E7\u00E3o e ir devagar. O erro mais comum \u00E9 achar que \u00E9 a A-32b, que tem as faixas e indica uma passagem sinalizada.',
        "legalBase": "Código de Trânsito Brasileiro (CTB) e Resolução CONTRAN nº 160/04 (Manual de Sinalização - Formato e Significado das Placas de Advertência)",
        "commonMistake": 'Muita gente confunde a A-32a com a A-32b, que tem as faixas desenhadas, ou com a placa de \'\u00C1rea Escolar\' (A-33a).',
        "tip": 'Sem faixa na placa amarela = \'Tr\u00E2nsito de Pedestres\' (A-32a). Com faixa = \'Passagem Sinalizada de Pedestres\' (A-32b).',
        "incidence": "alta",
        "trap": true,
        "difficulty": 3
    },
    {
        "id": "placa_regulamentacao_advertencia_alta",
        "category": "legislacao",
        "image_url": "https://tqeqsotsasglmhlmwdwy.supabase.co/storage/v1/object/public/library/images/placa-area-escolar-A-33A.webp",
        "statement": "Ao conduzir um veículo por uma via urbana, o motorista observa duas placas de sinalização vertical: a primeira proíbe o acionamento de buzina ou sinal sonoro (R-20) e a segunda alerta para a proximidade de uma área escolar (A-33a). De acordo com o Código de Trânsito Brasileiro (CTB) e o Manual de Sinalização do CONTRAN, como são classificadas essas placas e qual a natureza de suas ordens?",
        "options": [
            "A primeira é uma Placa de Regulamentação (R-20), de caráter imperativo e punitivo; a segunda é uma Placa de Advertência (A-33a), de caráter informativo e de alerta, que indica a proximidade de área escolar.",
            "A primeira é uma Placa de Advertência (R-20), que apenas sugere a não utilização de sinais sonoros; a segunda é uma Placa de Regulamentação (A-33a), que impõe o limite obrigatório de parada.",
            "Ambas são Placas de Regulamentação, pois a primeira proíbe o sinal sonoro e a segunda obriga a redução imediata para no máximo 30 km/h sob pena de apreensão do veículo.",
            "A primeira é uma Placa de Indicação, informando área hospitalar; a segunda é uma Placa de Advertência (A-32b), indicando obrigatoriedade de preferência sobre a faixa."
        ],
        "correctIndex": 0,
        "explanation": 'A R-20 manda n\u00E3o usar buzina (imposi\u00E7\u00E3o/multa) e a A-33a avisa sobre a escola (alerta).',
        "detailedExplanation": 'As placas de Regulamenta\u00E7\u00E3o dizem o que voc\u00EA deve ou n\u00E3o fazer, e desobedecer pode dar multa. As placas de Advert\u00EAncia avisam sobre perigos na pista, mas n\u00E3o multam diretamente.',
        "legalBase": "Art. 89 do CTB e Resolução CONTRAN nº 160/2004",
        "commonMistake": 'Muita gente acha que a placa vermelha s\u00F3 avisa, mas na verdade ela pro\u00EDbe e pode multar.',
        "tip": 'Placa Vermelha = Proibido (Multa). Placa Amarela = Cuidado (Alerta).',
        "incidence": "alta",
        "trap": true,
        "difficulty": 3
    },
    {
        "id": "placa_r20_proibido_buzina_alta",
        "category": "legislacao",
        "image_url": "https://tqeqsotsasglmhlmwdwy.supabase.co/storage/v1/object/public/library/images/placa-R-20.jpg",
        "statement": "Ao trafegar por uma via urbana durante o período noturno nas proximidades de um hospital, o condutor visualiza a placa de sinalização R-20 instalada na via. Considerando os preceitos do Código de Trânsito Brasileiro (CTB) e as normas de sinalização do CONTRAN, assinale a alternativa que indica corretamente a classificação dessa placa, seu significado e a implicação do seu desrespeito:",
        "options": [
            "Trata-se de uma Placa de Regulamentação que proíbe o uso da buzina ou sinal sonoro no local indicado. O desrespeito a esta ordem imperativa constitui infração de trânsito de natureza leve, sujeita a penalidade de multa.",
            "Trata-se de uma Placa de Advertência que apenas recomenda evitar o uso de sinal sonoro por cortesia urbana, não gerando autuação por infração de trânsito em caso de descumprimento.",
            "Trata-se de uma Placa de Indicação destinada exclusivamente a veículos de emergência, permitindo o uso da buzina apenas quando estiverem em serviço de urgência com iluminação vermelha ligada.",
            "Trata-se de uma Placa de Regulamentação que proíbe o uso de buzina no período das 22h às 6h, sendo o uso livre nos demais horários do dia."
        ],
        "correctIndex": 0,
        "explanation": 'A placa R-20 pro\u00EDbe buzinar ou usar sinal sonoro. Desrespeitar isso \u00E9 uma infra\u00E7\u00E3o leve.',
        "detailedExplanation": 'A placa R-20 diz que n\u00E3o pode buzinar no trecho indicado, seja de dia ou de noite. Se algu\u00E9m desobedecer, vai levar uma multa por infra\u00E7\u00E3o leve.',
        "legalBase": "Art. 227, V do CTB e Resolução CONTRAN nº 160/2004",
        "commonMistake": 'Muita gente pensa que a proibi\u00E7\u00E3o s\u00F3 vale \u00E0 noite ou que \u00E9 s\u00F3 uma sugest\u00E3o.',
        "tip": 'R-20 = Proibido Buzinar (vale 24h). Desrespeito = Infra\u00E7\u00E3o Leve.',
        "incidence": "alta",
        "trap": true,
        "difficulty": 3
    },
    {
        id: "placa_r2_de_a_preferencia_alta_01",
        category: "legislacao",
        image_url: "https://tqeqsotsasglmhlmwdwy.supabase.co/storage/v1/object/public/library/images/51.jpg",
        placa: "R-2",
        statement: "O condutor aproxima-se de interseção no perímetro urbano sem semáforo e sem agente e visualiza placa triangular de borda vermelha e fundo branco (R-2) à direita. Pelo CTB, seu dever diante dessa sinalização e a sanção pelo descumprimento são:",
        options: [
            "Parar sempre antes do cruzamento, mesmo sem outros veículos, sob pena de infração gravíssima.",
            "Ceder a passagem a quem circula na via preferencial, reduzindo ou parando se necessário; descumprir configura infração grave.",
            "Observar mera recomendação de cautela, sem qualquer multa por não parar no local.",
            "Manter a velocidade da via, pois o triângulo assegura preferência a quem converte à esquerda."
        ],
        correctIndex: 1,
        explanation: 'A placa R-2 (D\u00EA a Prefer\u00EAncia) pede pra voc\u00EA ceder a passagem. Ignorar isso \u00E9 infra\u00E7\u00E3o GRAVE.',
        detailedExplanation: 'A placa R-2 \u00E9 triangular e \u00FAnica, diferente da R-1 que obriga a parar. Voc\u00EA s\u00F3 precisa parar se tiver carros na via preferencial passando. N\u00E3o seguir essa regra \u00E9 considerado uma infra\u00E7\u00E3o grave.',
        legalBase: "Art. 215, II do CTB e Resolução CONTRAN nº 160/2004",
        commonMistake: 'Muita gente confunde \'D\u00EA a Prefer\u00EAncia\' (R-2 - Infra\u00E7\u00E3o Grave) com \'Parada Obrigat\u00F3ria\' (R-1 - Infra\u00E7\u00E3o Grav\u00EDssima).',
        tip: 'Tri\u00E2ngulo = Ceda a Passagem (R-2). Pare s\u00F3 se tiver carro na via preferencial.',
        incidence: "alta",
        trap: true,
        difficulty: 3
    },
    {
        id: "validade_cnh_renovacao_alta_01",
        category: "legislacao",
        statement: "Condutor de 42 anos, habilitado na categoria B, comparece ao DETRAN para renovação da CNH. Pela Lei 14.071, caso o exame de aptidão física e mental não identifique doença que progrida com a idade, a validade do exame será de:",
        options: [
            "5 anos, reduzindo-se a 3 anos ao atingir a idade de 50 anos.",
            "10 anos, pois o condutor possui menos de 50 anos de idade.",
            "5 anos, prevalecendo 10 anos apenas para profissionais das categorias C, D e E.",
            "3 anos, prazo único aplicável a todos os condutores após a alteração legal."
        ],
        correctIndex: 1,
        explanation: 'Quem tem menos de 50 anos pode ter a CNH v\u00E1lida por at\u00E9 10 anos.',
        detailedExplanation: 'Com a nova lei, o exame de sa\u00FAde vale 10 anos pra quem tem menos de 50 anos. Se a pessoa tiver entre 50 e 69 anos, vale 5 anos, e a partir de 70 anos, s\u00F3 3 anos.',
        legalBase: "Art. 147, § 2º, incisos I, II e III do CTB",
        commonMistake: 'Muita gente acha que a validade \u00E9 de 5 anos por conta de regras antigas.',
        tip: '< 50 anos = 10 anos.',
        incidence: "alta",
        trap: true,
        difficulty: 3
    },
    {
        id: "placa_r28_duplo_sentido_alta_01",
        category: "legislacao",
        image_url: "https://tqeqsotsasglmhlmwdwy.supabase.co/storage/v1/object/public/library/images/55.jpg",
        statement: "Trafegando por uma via até então regulamentada para sentido único de circulação, o condutor se depara com a placa R-28. Com base na sinalização aplicada, qual é o entendimento correto sobre a alteração das regras de trânsito a partir daquele ponto?",
        options: [
            "Indica que a pista passa a ser de mão dupla de direção, alterando o fluxo para ambos os sentidos de circulação.",
            "Informa que a via à frente possui faixa exclusiva reservada apenas para transporte coletivo e veículos de emergência.",
            "Proíbe expressamente a mudança de faixa de rolamento no trecho seguinte.",
            "Modifica a prioridade de passagem do cruzamento, tornando obrigatória a conversão à direita na próxima interseção."
        ],
        correctIndex: 0,
        explanation: 'A placa R-28 avisa que a pista agora \u00E9 de m\u00E3o dupla, ou seja, pode passar carro nos dois sentidos.',
        detailedExplanation: 'Com a placa R-28, o motorista deve saber que a via, que antes era s\u00F3 de ida, agora permite que carros venham e v\u00E3o. \u00C9 importante ficar atento, pois pode ter carro vindo na dire\u00E7\u00E3o oposta.',
        legalBase: "Anexo II do CTB e Manual Brasileiro de Sinalização de Trânsito",
        commonMistake: 'Muita gente confunde a R-28 com a placa A-22, que s\u00F3 avisa que tem m\u00E3o dupla mais pra frente.',
        tip: 'Placa R-28 = M\u00E3o dupla come\u00E7a aqui!',
        incidence: "media",
        trap: true,
        difficulty: 3
    },
    {
        id: "placa_r16_altura_maxima_alta_01",
        category: "legislacao",
        image_url: "https://tqeqsotsasglmhlmwdwy.supabase.co/storage/v1/object/public/library/images/52.jpg",
        statement: "Um motorista conduz um veículo de carga cuja altura total, já computada a carga armazenada no baú, é de 4,20 metros. Ao aproximar-se da entrada de um viaduto, ele visualiza a placa R-16 com a indicação '4 m'. Qual conduta deve ser adotada e qual a infração correspondente em caso de avanço?",
        options: [
            "O condutor pode prosseguir na via desde que trafegue pelo centro do viaduto, não configurando infração por haver margem de tolerância.",
            "O condutor está proibido de transitar pelo local, devendo buscar rota alternativa; desrespeitar essa limitação constitui infração de natureza grave.",
            "A placa refere-se apenas à largura útil da pista de rolamento, autorizando a passagem de veículos de qualquer altura.",
            "O condutor deve murchar parcialmente os pneus para rebaixar o veículo antes de transpor o obstáculo."
        ],
        correctIndex: 1,
        explanation: 'A placa R-16 mostra a altura m\u00E1xima que pode passar. Se o carro for mais alto, \u00E9 infra\u00E7\u00E3o GRAVE.',
        detailedExplanation: 'A placa R-16 (Altura m\u00E1xima permitida) indica at\u00E9 onde o ve\u00EDculo pode ir com a carga. Se o carro passar desse limite, \u00E9 considerado uma infra\u00E7\u00E3o grave.',
        legalBase: "Art. 231, VI do CTB",
        commonMistake: 'Muita gente confunde a altura m\u00E1xima permitida (R-16) com a altura limitada (A-37).',
        tip: 'Placa de ALTURA = Limite. Se passar, n\u00E3o pode seguir em frente.',
        incidence: "alta",
        trap: true,
        difficulty: 3
    },
    {
        id: "placa_a42a_inicio_pista_dupla_alta_01",
        category: "legislacao",
        image_url: "https://tqeqsotsasglmhlmwdwy.supabase.co/storage/v1/object/public/library/images/54.png",
        statement: "Enquanto trafega por uma rodovia de pista simples, o condutor observa a placa de advertência A-42a. Qual é a correta interpretação desta sinalização quanto às condições da via adiante?",
        options: [
            "Adverte que a pista simples passará a ter sentidos opostos separados por um canteiro central ou barreira física (Início de pista dupla).",
            "Adverte sobre o fim do canteiro central, voltando a pista a operar com fluxo em pista simples.",
            "Alerta para a existência de um cruzamento com via preferencial a 100 metros.",
            "Informa que o tráfego passará a ser canalizado em uma única faixa de rolamento por motivo de obras."
        ],
        correctIndex: 0,
        explanation: 'A placa A-42a avisa que a pista simples vai virar pista dupla adiante.',
        detailedExplanation: 'Essa sinaliza\u00E7\u00E3o mostra que os carros v\u00E3o passar a ter sentidos opostos, separados por um canteiro ou barreira. \u00C9 importante ficar ligado, pois muda a din\u00E2mica do tr\u00E1fego.',
        legalBase: "Manual Brasileiro de Sinalização de Trânsito - Volume II (CONTRAN)",
        commonMistake: 'Muita gente confunde \'In\u00EDcio de Pista Dupla\' (A-42a) com \'Fim de Pista Dupla\' (A-42b).',
        tip: 'Placa com canteiro e setas = PISTA DUPLA CHEGANDO!',
        incidence: "media",
        trap: false,
        difficulty: 2
    },
    {
        id: "placa_a14_semaforo_frente_alta_01",
        category: "legislacao",
        image_url: "https://tqeqsotsasglmhlmwdwy.supabase.co/storage/v1/object/public/library/images/50.jpg",
        statement: "Em um trecho periurbano de velocidade elevada, o condutor visualiza a placa de advertência A-14. Qual é a finalidade dessa sinalização e a ação preventiva adequada a ser adotada?",
        options: [
            "Advertir sobre a existência de controle semafórico adiante; o condutor deve reduzir a velocidade e preparar-se para eventual parada.",
            "Indicar a obrigatoriedade de parada imediata no local onde a placa está instalada.",
            "Alertar que o trecho está sob fiscalização eletrônica de velocidade por radar do tipo fotossensível.",
            "Informar sobre a existência de cruzamento de vias sem qualquer tipo de sinalização de preferência."
        ],
        correctIndex: 0,
        explanation: 'A placa A-14 avisa que tem um sem\u00E1foro mais adiante.',
        detailedExplanation: 'Ela \u00E9 do tipo de aviso e serve pra voc\u00EA se preparar pra parar, se precisar. Assim, d\u00E1 tempo de diminuir a velocidade antes de chegar no sem\u00E1foro.',
        legalBase: "Resolução CONTRAN nº 160/2004",
        commonMistake: 'Muita gente pensa que precisa parar logo ali, mas \u00E9 s\u00F3 um aviso pra se preparar.',
        tip: 'Placa amarela = Sem\u00E1foro \u00E0 frente, ent\u00E3o reduza a velocidade!',
        incidence: "alta",
        trap: false,
        difficulty: 2
    },
    {
        id: "nova_velocidade_vias_locais_alta_01",
        category: "legislacao",
        statement: "O condutor trafega por via urbana local em área residencial, onde não existe placa R-19 de regulamentação de velocidade. Pelo limite padrão do CTB para vias abertas no perímetro urbano, a velocidade máxima a ser respeitada é de:",
        options: [
            "30 km/h, por se tratar de via local sem sinalização regulamentadora.",
            "40 km/h, limite padrão das vias coletoras urbanas.",
            "50 km/h, limite geral das vias urbanas de circulação.",
            "20 km/h, por ser área residencial exclusiva de pedestres."
        ],
        correctIndex: 0,
        explanation: 'Se n\u00E3o tem placa, a velocidade m\u00E1xima na rua \u00E9 de 30 km/h (via local).',
        detailedExplanation: 'Nas ruas sem sinaliza\u00E7\u00E3o, a velocidade varia: 80 km/h nas r\u00E1pidas, 60 km/h nas arteriais, 40 km/h nas coletoras e 30 km/h nas locais. Ent\u00E3o, como essa \u00E9 uma via local, o limite \u00E9 30 km/h.',
        legalBase: "Art. 61, § 1º, I, d do CTB",
        commonMistake: 'Muita gente confunde a velocidade de via local (30 km/h) com a de via coletora (40 km/h).',
        tip: 'Via Local = 30 km/h | Via Coletora = 40 km/h.',
        incidence: "alta",
        trap: true,
        difficulty: 3
    },
    {
        id: "nova_advertencia_escrito_alta_02",
        category: "infracoes",
        statement: "Condutor comete infração leve por portar documentos de obrigatória guarda sem os apresentar e não registra nenhuma outra multa nos últimos 12 meses. Pelo CTB, a medida obrigatória e automática nesse caso é:",
        options: [
            "Multa com 50% de desconto e pontuação na CNH.",
            "Conversão obrigatória em Advertência por Escrito, de caráter educativo.",
            "Aplicação de medida administrativa de reciclagem obrigatória no DETRAN.",
            "Suspensão do direito de dirigir por até 30 dias."
        ],
        correctIndex: 1,
        explanation: 'Se o motorista n\u00E3o tem outras multas nos \u00FAltimos 12 meses, ele vai receber uma Advert\u00EAncia por Escrito por causa da infra\u00E7\u00E3o leve.',
        detailedExplanation: 'A lei diz que, se a infra\u00E7\u00E3o \u00E9 leve ou m\u00E9dia e o motorista n\u00E3o tem hist\u00F3rico de outras infra\u00E7\u00F5es, a multa deve ser trocada por uma advert\u00EAncia. Isso \u00E9 pra educar e n\u00E3o deixar o motorista sem puni\u00E7\u00E3o.',
        legalBase: "Art. 267 do CTB",
        commonMistake: 'Muita gente pensa que a advert\u00EAncia \u00E9 opcional, mas na verdade \u00E9 obrigat\u00F3ria nesse caso.',
        tip: 'Infra\u00E7\u00E3o Leve ou M\u00E9dia + 0 infra\u00E7\u00F5es em 12 meses = Advert\u00EAncia por Escrito Obrigat\u00F3ria.',
        incidence: "alta",
        trap: true,
        difficulty: 3
    },
    {
        id: "nova_psicoativas_reflexos_alta_03",
        category: "direcao-defensiva",
        statement: "O condutor ingere bebida alcoólica ou substância psicoativa antes de dirigir: o julgamento do risco se deteriora e instala-se falsa sensação de segurança. Além disso, o principal efeito sobre mente e corpo de quem dirige sob influência é:",
        options: [
            "Redução do tempo de reação com aceleração paradoxal dos reflexos.",
            "Retardamento dos reflexos e estreitamento da visão periférica (visão em túnel).",
            "Aumento da acuidade visual e da concentração simultânea sobre múltiplos estímulos.",
            "Melhora temporária da audição e redução das áreas cegas do veículo."
        ],
        correctIndex: 1,
        explanation: 'O \u00E1lcool deixa a pessoa mais lenta e com a vis\u00E3o emba\u00E7ada nas laterais.',
        detailedExplanation: 'Quando algu\u00E9m bebe, o c\u00E9rebro demora mais pra processar as coisas. Isso faz com que a pessoa tenha reflexos mais lentos e enxergue menos ao redor, como se estivesse olhando por um tubo.',
        legalBase: "Art. 165 e Manual de Direção Defensiva do DENATRAN",
        commonMistake: 'Muita gente acha que o \u00E1lcool faz a pessoa reagir mais r\u00E1pido, mas na verdade \u00E9 o contr\u00E1rio, tudo fica mais devagar.',
        tip: '\u00C1lcool = Reflexos lentos + Vis\u00E3o em t\u00FAnel.',
        incidence: "alta",
        trap: false,
        difficulty: 2
    },
    {
        id: "nova_meio_ambiente_respiratorio_alta_04",
        category: "meio-ambiente",
        statement: "Em grande centro urbano, a população fica exposta diariamente a monóxido de carbono, óxidos de nitrogênio e fuligem emitidos pela frota de veículos. A exposição prolongada a esses poluentes provoca principalmente:",
        options: [
            "Distúrbios gastrointestinais crônicos decorrentes da ingestão involuntária de partículas.",
            "Doenças do sistema respiratório, como asma, bronquite crônica e enfisema pulmonar.",
            "Perda auditiva permanente em decorrência da contaminação das vias aéreas superiores.",
            "Enfermidades contagiosas transmitidas exclusivamente pela queima de combustíveis."
        ],
        correctIndex: 1,
        explanation: 'A polui\u00E7\u00E3o do ar afeta diretamente os pulm\u00F5es, causando problemas como asma e bronquite.',
        detailedExplanation: 'Os gases e part\u00EDculas que v\u00EAm dos carros irritam as vias respirat\u00F3rias e podem piorar doen\u00E7as j\u00E1 existentes. Isso \u00E9 especialmente s\u00E9rio em cidades grandes, onde a polui\u00E7\u00E3o \u00E9 mais intensa.',
        legalBase: "Resoluções do CONAMA e Diretrizes de Meio Ambiente e Trânsito",
        commonMistake: 'Muita gente confunde os problemas respirat\u00F3rios causados pela polui\u00E7\u00E3o do ar com os efeitos do barulho, como estresse.',
        tip: 'Polui\u00E7\u00E3o do Ar = Problemas Respirat\u00F3rios.',
        incidence: "media",
        trap: false,
        difficulty: 2
    },
    {
        id: "nova_ultrapassagem_direita_excecao_alta_05",
        category: "legislacao",
        statement: "A regra geral do Código de Trânsito Brasileiro determina que a ultrapassagem deve ser efetuada sempre pela esquerda. No entanto, o CTB estabelece uma única exceção expressa em que a ultrapassagem pela direita é legalmente permitida. Assinale a alternativa que descreve essa exceção:",
        options: [
            "Quando o veículo da frente estiver trafegando em velocidade abaixo do limite máximo da via e o condutor buzinar solicitando passagem.",
            "Quando o veículo que estiver à frente indicar devidamente, por sinal regulamentar, que vai dobrar ou entrar à esquerda.",
            "Em rodovias de pista dupla, desde que o veículo que circula pela faixa da esquerda esteja impedindo o fluxo regular.",
            "Em qualquer via urbana de sentido único quando o acostamento da direita estiver desocupado."
        ],
        correctIndex: 1,
        explanation: 'Voc\u00EA pode ultrapassar pela direita se o carro da frente sinalizar que vai virar \u00E0 esquerda.',
        detailedExplanation: 'Isso acontece quando o motorista coloca a seta pra indicar que vai entrar. Se ele estiver na posi\u00E7\u00E3o certa, a\u00ED sim voc\u00EA pode passar pela direita sem problema.',
        legalBase: "Art. 199 do CTB",
        commonMistake: 'Muita gente acha que pode ultrapassar pela direita em qualquer situa\u00E7\u00E3o, mas s\u00F3 pode se o carro da frente estiver sinalizando a manobra.',
        tip: 'Ultrapassagem pela direita = SINALIZA\u00C7\u00C3O do carro da frente pra virar \u00E0 esquerda.',
        incidence: "alta",
        trap: true,
        difficulty: 3
    },
    {
        id: "nova_orgao_maximo_normativo_alta_06",
        category: "legislacao",
        statement: "Dentro da estrutura organizadora do Sistema Nacional de Trânsito (SNT), existem órgãos normativos, consultivos e executivos. O órgão colegiado máximo, de caráter exclusivamente NORMATIVO e CONSULTIVO do SNT, responsável por elaborar as Resoluções do trânsito brasileiro, é:",
        options: [
            "A Secretaria Nacional de Trânsito - SENATRAN.",
            "O Conselho Nacional de Trânsito - CONTRAN.",
            "O Departamento Estadual de Trânsito - DETRAN.",
            "A Polícia Rodoviária Federal - PRF."
        ],
        correctIndex: 1,
        explanation: 'O CONTRAN \u00E9 o chefe das regras e conselhos do tr\u00E2nsito no Brasil.',
        detailedExplanation: 'O CONTRAN (Conselho Nacional de Tr\u00E2nsito) cria as normas que todos devem seguir no tr\u00E2nsito. J\u00E1 a SENATRAN cuida da parte executiva, e o DETRAN faz isso em cada estado.',
        legalBase: "Art. 7º, inciso I e Art. 12 do CTB",
        commonMistake: 'Muita gente confunde o CONTRAN, que faz as regras, com a SENATRAN, que aplica as regras.',
        tip: 'CONTRAN = Regras do Tr\u00E2nsito | SENATRAN = Colocando em Pr\u00E1tica.',
        incidence: "alta",
        trap: true,
        difficulty: 3
    },
    {
        id: "nova_objetivo_sinalizacao_alta_07",
        category: "legislacao",
        statement: "A sinalização de trânsito é composta por elementos verticais, horizontais, dispositivos auxiliares, sinais luminosos, sonoros e gestos. Qual é a finalidade precípua e o objetivo fundamental da sinalização ao ser implantada nas vias públicas?",
        options: [
            "Informar aos usuários sobre as condições da via, regulamentar obrigações, restrições e proibições, e advertir sobre perigos potenciais.",
            "Garantir a arrecadação de multas de trânsito pelos órgãos executivos em trechos de grande fluxo.",
            "Identificar e cadastrar a frota de veículos licenciados que transitam entre municípios vizinhos.",
            "Isentar a responsabilidade civil do Estado em caso de sinistros de trânsito em rodovias não concedidas."
        ],
        correctIndex: 0,
        explanation: 'A sinaliza\u00E7\u00E3o ajuda a galera a entender como se comportar nas ruas e evita acidentes.',
        detailedExplanation: 'Ela serve pra deixar tudo mais organizado no tr\u00E2nsito, avisando sobre regras, perigos e dando dire\u00E7\u00F5es. Assim, todo mundo pode se locomover sem estresse.',
        legalBase: "Art. 80 do CTB e Anexo II do CTB",
        commonMistake: 'Muita gente acha que a sinaliza\u00E7\u00E3o s\u00F3 serve pra multar, mas na verdade \u00E9 pra proteger.',
        tip: 'Sinaliza\u00E7\u00E3o = Informa\u00E7\u00E3o, Alerta, Regras e Seguran\u00E7a.',
        incidence: "media",
        trap: false,
        difficulty: 2
    },
    {
        id: "nova_retorno_rodovia_acostamento_alta_08",
        category: "legislacao",
        statement: "Um condutor trafega por uma rodovia de pista simples e duplo sentido de circulação destituída de trevos, viadutos ou locais específicos para conversão. Desejando realizar uma manobra de retorno para a direção oposta, qual é a conduta correta estipulada pelo CTB?",
        options: [
            "Aproximar o veículo do eixo central da pista e aguardar a brecha no tráfego para virar imediatamente.",
            "Parar o veículo no acostamento à direita, aguardar a oportunidade segura e cruzar a pista para efetuar o retorno.",
            "Imobilizar o veículo na faixa da esquerda e acionar o pisca-alerta até que ambos os sentidos fiquem livres.",
            "Avançar até o próximo acostamento da esquerda e realizar a conversão sem parar a marcha."
        ],
        correctIndex: 1,
        explanation: 'Na rodovia, voc\u00EA deve parar no acostamento \u00E0 direita e esperar a hora certa para cruzar a pista e voltar.',
        detailedExplanation: 'Quando n\u00E3o tem lugar certo para retornar, a regra \u00E9 parar no acostamento \u00E0 direita e s\u00F3 cruzar quando estiver seguro. Tentar fazer o retorno no meio da pista \u00E9 muito arriscado e \u00E9 considerado infra\u00E7\u00E3o grav\u00EDssima.',
        legalBase: "Art. 38 e Art. 204 do CTB",
        commonMistake: 'Muita gente acha que pode parar no meio da rodovia para fazer o retorno, mas isso \u00E9 super perigoso e proibido.',
        tip: 'Retorno em Rodovia sem trevo = Entrar no acostamento \u00E0 DIREITA e esperar a pista vagar.',
        incidence: "alta",
        trap: true,
        difficulty: 3
    },
    {
        id: "nova_balanceamento_rodas_sintomas_alta_09",
        category: "mecanica",
        statement: "Em rodovia plana, ao ultrapassar 80 km/h o volante do veículo começa a tremer e vibrar intensamente de forma anormal. Considerando a manutenção preventiva do sistema de rodagem, esse sintoma indica a necessidade de:",
        options: [
            "Substituição das pastilhas de freio dianteiras e sangria do fluido de freio.",
            "Execução do balanceamento das rodas para alinhar as massas do conjunto pneu e roda.",
            "Calibragem dos pneus com pressão 50% superior à recomendada pelo fabricante.",
            "Troca imediata do amortecedor traseiro e das buchas da suspensão."
        ],
        correctIndex: 1,
        explanation: 'Se o volante treme acima de 80 km/h, \u00E9 sinal de que as rodas est\u00E3o desbalanceadas.',
        detailedExplanation: 'Quando as rodas n\u00E3o est\u00E3o balanceadas, o carro vibra e isso pode causar desgaste nos pneus e na suspens\u00E3o. Manter o balanceamento em dia evita esses problemas e garante uma dire\u00E7\u00E3o mais tranquila.',
        legalBase: "Manual de Manutenção Veicular e Direção Defensiva",
        commonMistake: 'Muita gente acha que balanceamento e alinhamento s\u00E3o a mesma coisa, mas um \u00E9 pra vibra\u00E7\u00E3o e o outro pra carro puxando.',
        tip: 'Volante Tremendo = Balanceamento | Carro Puxando = Alinhamento.',
        incidence: "alta",
        trap: true,
        difficulty: 2
    },
    {
        id: "nova_sinalizacao_horizontal_cores_alta_10",
        category: "legislacao",
        statement: "Na sinalização horizontal impressa sobre o pavimento das vias públicas, a aplicação das cores segue critérios estritos de regulamentação visual. Qual é a cor utilizada exclusivamente para a regulação de fluxos de sentidos opostos e delimitação de espaço de conversão à esquerda?",
        options: [
            "Branca, utilizada para separar fluxos opostos e marcar faixas de pedestres.",
            "Amarela, empregada na divisão de fluxos de sentidos opostos e proibição de estacionamento.",
            "Vermelha, utilizada para delimitar faixas de rolamento de veículos pesados.",
            "Azul, destinada a separar faixas de trânsito do mesmo sentido de circulação."
        ],
        correctIndex: 1,
        explanation: 'A cor amarela \u00E9 usada pra separar fluxos de sentidos opostos.',
        detailedExplanation: 'A linha amarela na pista serve pra dividir quem vai em dire\u00E7\u00F5es contr\u00E1rias e tamb\u00E9m pra mostrar onde n\u00E3o pode parar ou estacionar. J\u00E1 a linha branca \u00E9 usada pra separar quem vai no mesmo sentido.',
        legalBase: "Anexo II do CTB - Sinalização Horizontal",
        commonMistake: 'Muita gente confunde a linha amarela com a branca, achando que as duas t\u00EAm a mesma fun\u00E7\u00E3o.',
        tip: 'Linha AMARELA = Sentidos OPOSTOS | Linha BRANCA = MESMO sentido.',
        incidence: "alta",
        trap: true,
        difficulty: 3
    },
    {
        id: "nova_posicao_faixas_transito_alta_11",
        category: "legislacao",
        statement: "Em uma pista de rolamento com várias faixas de trânsito no mesmo sentido de circulação, inexistindo uma faixa regulamentada como exclusiva para determinado tipo de veículo, onde devem posicionar-se os veículos mais lentos ou de maior porte?",
        options: [
            "Nas faixas mais à esquerda, destinadas à circulação desses veículos em velocidade reduzida.",
            "Nas faixas mais à direita, devendo as faixas da esquerda ser destinadas à ultrapassagem e aos veículos de maior velocidade.",
            "Em qualquer faixa indistintamente, desde que acionem o pisca-alerta em trechos de aclive.",
            "Pelo acostamento da via, abrindo passagem contínua aos demais condutores."
        ],
        correctIndex: 1,
        explanation: 'Ve\u00EDculos lentos e grandes devem ficar nas faixas da direita.',
        detailedExplanation: 'Quando n\u00E3o tem faixa exclusiva, os ve\u00EDculos mais lentos ou de maior porte precisam usar as faixas mais \u00E0 direita. As da esquerda s\u00E3o pra quem quer ultrapassar ou andar mais r\u00E1pido.',
        legalBase: "Art. 29, inciso IV do CTB",
        commonMistake: 'Muita gente acha que a faixa da esquerda pode ser usada por ve\u00EDculos lentos se estiverem na velocidade certa.',
        tip: 'Faixa da DIREITA = Lentos e pesados | Faixa da ESQUERDA = Ultrapassagens e velocidade.',
        incidence: "alta",
        trap: false,
        difficulty: 2
    },
    {
        id: "nova_tecnica_curva_seguranca_alta_12",
        category: "direcao-defensiva",
        statement: "Um condutor trafega por uma rodovia e aproxima-se de um trecho sinuoso com curva acentuada à direita. Sob a ótica da Direção Defensiva e da física veicular (força centrífuga), qual é a conduta correta para realizar a manobra com estabilidade e segurança?",
        options: [
            "Acelerar fortemente no início da curva para aumentar a aderência dos pneus ao solo.",
            "Reduzir a velocidade com antecedência ANTES de entrar na curva e acelerar suavemente durante a trajetória.",
            "Manter a velocidade elevada e acionar o freio bruscamente no meio do ápice da curva.",
            "Desengatar a marcha e fazer a curva em ponto morto para economizar combustível."
        ],
        correctIndex: 1,
        explanation: '\u00C9 importante frear antes de entrar na curva. Dentro dela, voc\u00EA deve acelerar devagar para n\u00E3o perder controle.',
        detailedExplanation: 'Se voc\u00EA frear na curva, o carro pode ficar inst\u00E1vel e derrapar por causa da for\u00E7a centr\u00EDfuga. Ent\u00E3o, reduza a velocidade no trecho reto antes de chegar na curva.',
        legalBase: "Manual de Direção Defensiva do DENATRAN",
        commonMistake: 'Muita gente freia na curva ou fica com a embreagem apertada, o que pode causar problemas.',
        tip: 'Curva \u00E0 vista = Freie no reto e acelere na curva.',
        incidence: "alta",
        trap: true,
        difficulty: 2
    },
    {
        id: "nova_painel_instrumentos_mecanica_alta_13",
        category: "mecanica",
        statement: "Os instrumentos do painel fornecem informações essenciais sobre a saúde mecânica e elétrica do veículo em operação. Assinale a correspondência TÉCNICA E LEGALMENTE CORRETA entre cada instrumento e sua função:",
        options: [
            "Termômetro: mede a pressão do óleo lubrificante no cárter do motor.",
            "Voltímetro: indica a taxa de rotação por minuto (RPM) das rodas.",
            "Manômetro: indica a pressão de óleo na linha de lubrificação do motor.",
            "Amperímetro: mede o nível e a temperatura da água no radiador."
        ],
        correctIndex: 2,
        explanation: 'O Man\u00F4metro mostra se o \u00F3leo do motor t\u00E1 na press\u00E3o certa.',
        detailedExplanation: 'Man\u00F4metro = mede a press\u00E3o do \u00F3leo. Term\u00F4metro = v\u00EA a temperatura do l\u00EDquido que resfria o motor. Tac\u00F4metro (Conta-giros) = conta quantas vezes o motor gira por minuto (RPM). Amper\u00EDmetro/Volt\u00EDmetro = checa a parte el\u00E9trica do carro e a bateria.',
        legalBase: "Manual de Mecânica Básica Veicular",
        commonMistake: 'Muita gente confunde Man\u00F4metro (press\u00E3o do \u00F3leo) com Term\u00F4metro (temperatura do l\u00EDquido).',
        tip: 'MAN\u00D4METRO = Press\u00E3o do \u00D3leo | TERM\u00D4METRO = Temperatura do L\u00EDquido.',
        incidence: "media",
        trap: true,
        difficulty: 3
    },
    {
        id: "nova_chuva_cida_meio_ambiente_alta_14",
        category: "meio-ambiente",
        statement: "A queima de combustíveis fósseis lança dióxido de enxofre e óxidos de nitrogênio, que reagem com a umidade atmosférica formando chuva ácida. Além da contaminação do solo e dos recursos hídricos, o impacto direto dessa precipitação sobre o patrimônio físico e os veículos é:",
        options: [
            "Corrosão e degradação de superfícies metálicas, pinturas veiculares e estruturas de concreto.",
            "Geração instantânea de neblina densa e precipitação de granizo tóxico nas rodovias.",
            "Destruição imediata dos pneus por atrito químico com o asfalto molhado.",
            "Supressão da camada de ozônio nas camadas inferiores da atmosfera urbana."
        ],
        correctIndex: 0,
        explanation: 'A chuva \u00E1cida enferruja os metais, estraga a pintura dos carros e quebra pr\u00E9dios.',
        detailedExplanation: 'A acidez da chuva ataca as superf\u00EDcies, fazendo com que os metais enferrujem mais r\u00E1pido e danificando monumentos e plantas. Isso tamb\u00E9m pode afetar a qualidade da \u00E1gua.',
        legalBase: "Diretrizes Ambientais do CONAMA",
        commonMistake: 'Muita gente acha que a chuva \u00E1cida s\u00F3 faz mal para a sa\u00FAde, mas o impacto nos materiais \u00E9 bem s\u00E9rio.',
        tip: 'Chuva \u00C1cida = Metal enferrujado + Pintura estragada.',
        incidence: "media",
        trap: false,
        difficulty: 2
    },
    {
        id: "nova_prioridade_passagem_emergencia_alta_17",
        category: "legislacao",
        statement: "Um condutor trafega pela faixa da esquerda quando percebe a aproximação de uma ambulância com os dispositivos de alarme sonoro (sirene) e iluminação vermelha intermitente acionados. Qual procedimento deve ser adotado pelos condutores na via pública para dar passagem?",
        options: [
            "Os veículos da faixa da esquerda devem deslocar-se para a direita e parar se necessário, e os demais condutores devem deixar livre a faixa da esquerda.",
            "Todos os veículos devem acelerar imediatamente para desobstruir o cruzamento mais próximo no menor tempo possível.",
            "Os condutores devem deslocar-se exclusivamente para o acostamento da esquerda e parar com o pisca-alerta ligado.",
            "Deve-se manter na faixa de rolamento e buzinar insistentemente para alertar os pedestres sobre a ambulância."
        ],
        correctIndex: 0,
        explanation: 'Quando ouvir a sirene, v\u00E1 pra direita e deixe a faixa da esquerda livre pro carro de emerg\u00EAncia.',
        detailedExplanation: 'Se um ve\u00EDculo de emerg\u00EAncia estiver se aproximando com a sirene ligada, todos os motoristas devem se mover pra direita e parar se precisar. Isso garante que a ambul\u00E2ncia consiga passar sem problemas.',
        legalBase: "Art. 29, inciso VII, alínea a do CTB",
        commonMistake: 'Muita gente acaba indo pra esquerda em vez de se mover pra direita.',
        tip: 'Sirene ouvindo = V\u00E1 pra DIREITA, liberando a ESQUERDA.',
        incidence: "alta",
        trap: true,
        difficulty: 3
    },
    {
        id: "nova_recolhimento_cnh_vencida_alta_18",
        category: "infracoes",
        statement: "Um condutor é abordado em uma fiscalização de trânsito de rotina. Ao apresentar seus documentos, o agente de trânsito constata que a Carteira Nacional de Habilitação (CNH) do motorista está vencida há 45 dias. Qual infração é configurada e qual é a medida administrativa aplicada no local?",
        options: [
            "Infração média, sujeita apenas à retenção do veículo até a chegada de condutor habilitado.",
            "Infração gravíssima, punida com multa e recolhimento do documento de habilitação (CNH) como medida administrativa.",
            "Infração grave, sujeita à penalidade automática de cassação do direito de dirigir e apreensão do veículo.",
            "Crime de trânsito inafiançável com recolhimento imediato do condutor ao presídio estadual."
        ],
        correctIndex: 1,
        explanation: 'Dirigir com a CNH vencida h\u00E1 mais de 30 dias \u00E9 uma infra\u00E7\u00E3o GRAV\u00CDSSIMA, que resulta em multa e recolhimento da CNH.',
        detailedExplanation: 'Quando a CNH est\u00E1 vencida por mais de 30 dias, isso \u00E9 considerado uma infra\u00E7\u00E3o GRAV\u00CDSSIMA. A consequ\u00EAncia \u00E9 que o agente de tr\u00E2nsito retira a CNH do motorista e aplica a multa.',
        legalBase: "Art. 162, inciso V do CTB",
        commonMistake: 'Muita gente pensa que pode dirigir com a CNH vencida at\u00E9 30 dias sem problemas, mas isso \u00E9 um erro.',
        tip: 'CNH vencida at\u00E9 30 dias = Tolerado | Vencida h\u00E1 +30 dias = Infra\u00E7\u00E3o GRAV\u00CDSSIMA + Recolhimento da CNH.',
        incidence: "alta",
        trap: true,
        difficulty: 3
    },
    {
        id: "nova_primeiros_socorros_colar_cervical_alta_19",
        category: "primeiros-socorros",
        statement: "Ao prestar atendimento inicial a uma vítima de acidente de trânsito com suspeita de trauma na coluna cervical devido a um forte impacto traseiro, qual equipamento ortopédico específico deve ser empregado para estabilizar o pescoço e evitar lesões medulares irreversíveis?",
        options: [
            "Torniquete arterial de compressão rápida.",
            "Colar cervical ortopédico.",
            "Garrote de borracha vulcanizada.",
            "Bandagem elástica tipo atadura de compressão."
        ],
        correctIndex: 1,
        explanation: 'O colar cervical imobiliza o pesco\u00E7o e protege a medula.',
        detailedExplanation: 'Colocar o colar cervical \u00E9 super importante em acidentes para evitar danos maiores na coluna. Isso ajuda a manter a v\u00EDtima segura at\u00E9 a chegada de ajuda.',
        legalBase: "Manual de Primeiros Socorros no Trânsito (ABNT e PHTLS)",
        commonMistake: 'Muita gente confunde colar cervical com torniquete, que serve pra parar sangramentos em bra\u00E7os e pernas.',
        tip: 'Suspeita de trauma no Pesco\u00E7o/Coluna = Colar Cervical e N\u00E3o movimentar a v\u00EDtima.',
        incidence: "alta",
        trap: false,
        difficulty: 2
    },
    {
        id: "nova_deveres_condutor_passagem_ferrea_alta_24",
        category: "legislacao",
        statement: "Analisando os deveres e proibições impostos aos condutores pelo Código de Trânsito Brasileiro no que tange à circulação de veículos e preferência de passagem, assinale a alternativa juridicamente CORRETA:",
        options: [
            "Todo veículo poderá retornar em qualquer local nas vias urbanas, desde que não haja trânsito de pedestres.",
            "A circulação de veículos de passeio pelo acostamento das rodovias é livre sempre que houver congestionamento.",
            "É dever do condutor parar obrigatoriamente seu veículo antes de transpor linha férrea ou entrar em via com preferência de passagem onde haja sinalização.",
            "O condutor deve dar preferência aos pedestres exclusivamente quando estes estiverem sobre a faixa de segurança."
        ],
        correctIndex: 2,
        explanation: 'Parar antes da linha f\u00E9rrea \u00E9 obrigat\u00F3rio, sen\u00E3o \u00E9 infra\u00E7\u00E3o grav\u00EDssima.',
        detailedExplanation: 'Se voc\u00EA n\u00E3o parar antes de cruzar a linha f\u00E9rrea, pode se dar mal, pois isso \u00E9 considerado uma infra\u00E7\u00E3o grav\u00EDssima. O mesmo vale para entrar em via preferencial com sinal de parada, onde \u00E9 preciso parar o carro.',
        legalBase: "Art. 212 e Art. 214 do CTB",
        commonMistake: 'Muita gente acha que s\u00F3 precisa reduzir a velocidade e n\u00E3o parar completamente.',
        tip: 'Linha F\u00E9rrea = Parada OBRIGAT\u00D3RIA antes de cruzar.',
        incidence: "alta",
        trap: true,
        difficulty: 3
    },
    {
        id: "nova_sinalizacao_horizontal_tachoes_alta_25",
        category: "legislacao",
        statement: "Para melhorar a visibilidade noturna, orientar a trajetória dos veículos e canalizar o fluxo em pontos críticos, utilizam-se dispositivos delimitadores e refletivos fixados diretamente no pavimento da via. Quais elementos cumprem essa função estrutural de sinalização?",
        options: [
            "Marcas transversais de retenção e faixas de pedestres.",
            "As tachas e os tachões refletivos (conhecidos como 'olhos de gato').",
            "Pinturas de legendas e símbolos de orientação de destino no asfalto.",
            "Placas de advertência instaladas no canteiro central."
        ],
        correctIndex: 1,
        explanation: 'Tachas e tach\u00F5es ajudam a separar as faixas e a melhorar a vis\u00E3o \u00E0 noite.',
        detailedExplanation: 'Esses dispositivos s\u00E3o conhecidos como \'olhos de gato\' e refletem a luz dos far\u00F3is, deixando tudo mais claro. Al\u00E9m disso, eles fazem um barulhinho quando o carro passa, avisando se voc\u00EA saiu da faixa.',
        legalBase: "Anexo II do CTB - Dispositivos Auxiliares",
        commonMistake: 'Muita gente confunde tachas e tach\u00F5es com as linhas pintadas na pista.',
        tip: 'Tachas/Tach\u00F5es = A\u00E7\u00E3o refletiva no asfalto para guiar o motorista.',
        incidence: "media",
        trap: false,
        difficulty: 2
    },
    {
        id: "nova_primeiros_socorros_epistaxe_alta_26",
        category: "primeiros-socorros",
        statement: "Durante o atendimento emergencial no local de um acidente, uma vítima consciente apresenta sangramento nasal abundante (epistaxe) sem sinais de fratura craniana grave. Qual é a conduta inicial e socorro adequado para conter o sangramento?",
        options: [
            "Manter a vítima com a cabeça ligeiramente elevada, comprimir as narinas por alguns minutos e aplicar compressas frias sobre o nariz.",
            "Inclinar a cabeça da vítima totalmente para trás para fazer o sangue retornar à garganta.",
            "Tampar as narinas com sacos plásticos herméticos para estancar o fluxo de ar e sangue.",
            "Deitar a vítima de bruços e forçar a respiração exclusivamente pelo nariz."
        ],
        correctIndex: 0,
        explanation: 'Se a pessoa t\u00E1 com sangramento no nariz, \u00E9 bom manter a cabe\u00E7a um pouco levantada e apertar as narinas por uns minutinhos com gelo em cima.',
        detailedExplanation: 'Pra parar o sangramento nasal, a cabe\u00E7a deve ficar levemente pra frente ou elevada (nunca pra tr\u00E1s, pra n\u00E3o engolir sangue), apertar as narinas e colocar um pano frio no nariz.',
        legalBase: "Manual de Primeiros Socorros no Trânsito",
        commonMistake: 'Muita gente acha que deve inclinar a cabe\u00E7a pra tr\u00E1s, mas isso pode fazer a pessoa engolir sangue.',
        tip: 'Sangramento Nasal = Cabe\u00E7a alta + Apertar narinas + Pano Frio (NUNCA pra tr\u00E1s).',
        incidence: "alta",
        trap: true,
        difficulty: 3
    },
    {
        id: "nova_distancia_frenagem_conceito_alta_27",
        category: "direcao-defensiva",
        statement: "No estudo da física aplicada à Direção Defensiva, a distância total percorrida por um veículo até a imobilização completa divide-se em etapas. Como é denominada especificamente a distância percorrida pelo veículo DESDE O MOMENTO EM QUE O CONDUTOR PISA NO PEDAL DO FREIO até a sua parada total?",
        options: [
            "Distância de Reação.",
            "Distância de Seguimento.",
            "Distância de Frenagem.",
            "Distância de Parada Total."
        ],
        correctIndex: 2,
        explanation: 'Dist\u00E2ncia de Frenagem \u00E9 o espa\u00E7o que o carro percorre desde que voc\u00EA pisa no freio at\u00E9 ele parar de vez.',
        detailedExplanation: 'Primeiro, voc\u00EA tem a Dist\u00E2ncia de Rea\u00E7\u00E3o, que \u00E9 o tempo que leva do momento que v\u00EA o perigo at\u00E9 pisar no freio. Depois vem a Dist\u00E2ncia de Frenagem, que \u00E9 o trecho que o carro percorre enquanto est\u00E1 freando. A soma dos dois d\u00E1 a Dist\u00E2ncia de Parada Total.',
        legalBase: "Manual de Direção Defensiva do DENATRAN",
        commonMistake: 'Muita gente confunde a Dist\u00E2ncia de Frenagem com a Dist\u00E2ncia de Parada, que inclui o tempo de rea\u00E7\u00E3o.',
        tip: 'Viu o perigo = REA\u00C7\u00C3O | Pisou no freio = FRENAGEM | Juntou tudo = PARADA.',
        incidence: "alta",
        trap: true,
        difficulty: 3
    },
    {
        id: "nova_vias_coletoras_conceito_alta_28",
        category: "legislacao",
        statement: "O Código de Trânsito Brasileiro classifica as vias urbanas segundo a sua função operacional. De acordo com a definição do CTB, como são caracterizadas e conceituadas as VIAS COLETORAS?",
        options: [
            "Vias destinadas apenas ao acesso a áreas restritas ou estabelecimentos específicos.",
            "Vias caracterizadas por interseções em nível, destinadas a coletar e distribuir o trânsito que entra ou sai das vias de trânsito rápido ou arteriais.",
            "Vias sem interseções em nível, com acessos especiais e trânsito livre sem travessia de pedestres.",
            "Vias rurais pavimentadas destinadas à circulação intermunicipal de alta velocidade."
        ],
        correctIndex: 1,
        explanation: 'Via coletora \u00E9 a que pega o tr\u00E2nsito dos bairros e leva pra avenidas maiores (arteriais).',
        detailedExplanation: 'Ela serve pra coletar e distribuir o tr\u00E2nsito que entra ou sai das vias r\u00E1pidas. O limite de velocidade \u00E9 de 40 km/h.',
        legalBase: "Anexo I e Art. 61 do CTB",
        commonMistake: 'Muita gente confunde Via Coletora com Via Local ou Via Arterial.',
        tip: 'Coletora = Recolhe o tr\u00E2nsito do bairro e joga nas avenidas principais (40 km/h).',
        incidence: "alta",
        trap: true,
        difficulty: 3
    },
    {
        id: "nova_primeiros_socorros_seguranca_local_alta_29",
        category: "primeiros-socorros",
        statement: "Ao deparar-se com sinistro em rodovia, com vítimas presas às ferragens e derramamento de combustível na pista, a regra fundamental dos primeiros socorros \"prevenir-se ao prestar socorro\" significa concretamente:",
        options: [
            "Garantir primeiro a segurança pessoal e a sinalização do local para evitar novos acidentes (acidentes secundários) antes de tocar nas vítimas.",
            "Prestar atendimento de saúde exclusivo se o socorrista estiver acompanhado de uma autoridade policial.",
            "Evitar prestar socorro para não ser arrolado no processo criminal como testemunha do acidente.",
            "Realizar a remoção imediata das vítimas para fora do veículo de qualquer maneira antes de sinalizar a pista."
        ],
        correctIndex: 0,
        explanation: 'Primeiro, voc\u00EA precisa garantir sua seguran\u00E7a e sinalizar o lugar pra evitar mais acidentes (acidentes secund\u00E1rios).',
        detailedExplanation: 'Nos Primeiros Socorros, a regra \u00E9 clara: se o socorrista se machuca, n\u00E3o ajuda ningu\u00E9m. Ent\u00E3o, \u00E9 preciso sinalizar bem o local e cuidar da seguran\u00E7a pra evitar explos\u00F5es ou atropelamentos depois.',
        legalBase: "Manual de Primeiros Socorros no Trânsito (ABNT)",
        commonMistake: 'Muita gente tenta ajudar as v\u00EDtimas sem sinalizar, o que pode causar mais acidentes.',
        tip: '1\u00BA Sinalizar o local = 2\u00BA Chamar resgate = 3\u00BA Atender as v\u00EDtimas.',
        incidence: "alta",
        trap: false,
        difficulty: 2
    },
    {
        id: "nova_direcao_defensiva_conceito_alta_30",
        category: "direcao-defensiva",
        statement: "O condutor defensivo é aquele que adota uma postura preventiva no trânsito, antecipando-se a situações de risco de modo a evitar sinistros, independentemente das condições adversas ou do erro dos outros usuários. Dentre as atitudes abaixo, qual caracteriza o comportamento de um condutor defensivo?",
        options: [
            "Manter velocidade adequada e compatível com as condições da via, do clima e do fluxo, preservando a distância de segurança.",
            "Transitar sempre na velocidade máxima permitida pela via, mesmo sob chuva intensa ou neblina densa.",
            "Realizar ultrapassagens pela direita em pontes e viadutos quando o fluxo da esquerda estiver lento.",
            "Utilizar a buzina continuamente para abrir caminho e impor sua prioridade sobre os pedestres."
        ],
        correctIndex: 0,
        explanation: 'Dirigir com seguran\u00E7a \u00E9 manter a velocidade certa pra situa\u00E7\u00E3o da estrada e do clima.',
        detailedExplanation: 'Na Dire\u00E7\u00E3o Defensiva, o motorista deve ajustar a velocidade conforme a estrada, o tempo e o tr\u00E2nsito, sempre mantendo uma dist\u00E2ncia segura dos outros ve\u00EDculos e se antecipando aos perigos.',
        legalBase: "Manual de Direção Defensiva do DENATRAN",
        commonMistake: 'Pensar que \u00E9 seguro sempre andar na velocidade m\u00E1xima indicada, n\u00E3o importa o clima.',
        tip: 'Condi\u00E7\u00E3o Adversa (Chuva/Neblina) = Reduzir a velocidade abaixo do limite da placa.',
        incidence: "alta",
        trap: false,
        difficulty: 2
    },
    {
        id: "nova_medida_admin_reprovacao_inspecao_01",
        category: "legislacao",
        statement: "Um caminhão, como veículo automotor de carga, é submetido à inspeção de segurança e de emissão de gases poluentes e ruído pelo órgão competente e é reprovado por exceder os limites. Pelo CTB, qual medida administrativa é aplicada de imediato a esse veículo?",
        options: [
            "Multa gravíssima aplicada pelo agente na hora do exame.",
            "Apreensão do veículo com guincho direto para o pátio.",
            "Recolhimento com perda definitiva do licenciamento anual.",
            "Retenção do veículo para regularizar ou receber a sanção devida."
        ],
        correctIndex: 3,
        explanation: 'Se o ve\u00EDculo n\u00E3o passar na inspe\u00E7\u00E3o, ele vai ser RETIDO pra regularizar a situa\u00E7\u00E3o.',
        detailedExplanation: 'Quando um ve\u00EDculo de carga \u00E9 reprovado na inspe\u00E7\u00E3o de seguran\u00E7a e emiss\u00E3o, isso \u00E9 uma infra\u00E7\u00E3o grave. A consequ\u00EAncia \u00E9 que o carro vai ser RETIDO at\u00E9 que tudo esteja certo.',
        legalBase: "Art. 230, inciso XVIII do CTB",
        commonMistake: 'Muita gente confunde a reten\u00E7\u00E3o do ve\u00EDculo com s\u00F3 pagar a multa.',
        tip: 'Inspe\u00E7\u00E3o Reprovada = RETEN\u00C7\u00C3O do ve\u00EDculo.',
        incidence: "alta",
        trap: true,
        difficulty: 3
    },
    {
        id: "nova_aquaplanagem_fatores_risco_02",
        category: "direcao-defensiva",
        statement: "A aquaplanagem ocorre quando o pneu perde o contato com a pista de rolamento por conta da lâmina d'água interposta entre a banda de rodagem e o pavimento. Considerando a direção defensiva e a física do veículo, esse risco de perda de aderência aumenta significativamente quando:",
        options: [
            "O veículo dispõe de pneus novos e trafega sobre pista molhada.",
            "O veículo trafega lentamente com pneus desgastados sob chuva fraca.",
            "O veículo desenvolve alta velocidade sobre pista molhada ou com acúmulo acentuado de água.",
            "O veículo trafega devagar sobre pista molhada com marcha reduzida engatada."
        ],
        correctIndex: 2,
        explanation: 'Quando voc\u00EA t\u00E1 r\u00E1pido demais e tem \u00E1gua na pista, os pneus n\u00E3o conseguem segurar e deslizam.',
        detailedExplanation: 'A aquaplanagem acontece quando a \u00E1gua se acumula e n\u00E3o sai pelos sulcos do pneu. Se voc\u00EA t\u00E1 em alta velocidade e a pista t\u00E1 molhada, \u00E9 bem prov\u00E1vel que isso aconte\u00E7a.',
        legalBase: "Manual de Direção Defensiva do DENATRAN",
        commonMistake: 'Muita gente pensa que s\u00F3 pneu careca causa aquaplanagem, mas a velocidade alta \u00E9 o que realmente importa.',
        tip: 'Aquaplanagem = Alta Velocidade + \u00C1gua na Pista (L\u00E2mina d\'\u00E1gua).',
        incidence: "alta",
        trap: true,
        difficulty: 2
    },
    {
        id: "nova_telefone_policia_militar_03",
        category: "primeiros-socorros",
        statement: "Em uma situação de emergência viária com ocorrência de crime de trânsito, assalto ou necessidade de policiamento Ostensivo de Preservação da Ordem Pública em vias urbanas, qual é o número telefônico oficial de emergência da Polícia Militar (PM)?",
        options: [
            "190, destinado ao atendimento de emergência da Polícia Militar.",
            "191, direcionado exclusivamente ao atendimento da Polícia Rodoviária Federal (PRF).",
            "192, reservado ao Serviço de Atendimento Móvel de Urgência (SAMU).",
            "193, pertencente ao Corpo de Bombeiros Militar."
        ],
        correctIndex: 0,
        explanation: 'O n\u00FAmero 190 chama a Pol\u00EDcia Militar.',
        detailedExplanation: 'No Brasil, os n\u00FAmeros de emerg\u00EAncia s\u00E3o bem definidos: 190 para a Pol\u00EDcia Militar, 191 para a Pol\u00EDcia Rodovi\u00E1ria Federal, 192 para o SAMU e 193 para os Bombeiros.',
        legalBase: "Diretrizes Nacionais de Urgência e Emergência",
        commonMistake: 'Muita gente confunde o 190 da PM com o 191 da PRF.',
        tip: 'Emerg\u00EAncia = 190 (PM)!',
        incidence: "alta",
        trap: false,
        difficulty: 1
    },
    {
        id: "nova_exame_pratico_velocidade_inadequada_04",
        category: "legislacao",
        statement: "Na prova prática de direção veicular, chove intensamente e a pista apresenta baixa aderência, mas o candidato conduz em velocidade inadequada às condições do local e do clima. Pela tabela de faltas do CONTRAN, essa atitude é classificada como:",
        options: [
            "Falta eliminatória, reprovando o candidato imediatamente na prova prática.",
            "Falta grave, com perda de 3 pontos na ficha de avaliação do examinador.",
            "Falta média, com perda de 2 pontos na nota atribuída ao candidato.",
            "Falta leve, com perda de 1 ponto na pontuação registrada pelo DETRAN."
        ],
        correctIndex: 1,
        explanation: 'Dirigir r\u00E1pido demais em condi\u00E7\u00F5es ruins \u00E9 falta GRAVE no exame (perde 3 pontos).',
        detailedExplanation: 'Quando a pista t\u00E1 escorregadia e a chuva t\u00E1 forte, acelerar demais \u00E9 uma falta grave. Isso vale 3 pontos a menos na sua avalia\u00E7\u00E3o do exame pr\u00E1tico.',
        legalBase: "Resolução CONTRAN nº 789/2020, Anexo (Tabela de Faltas no Exame Prático)",
        commonMistake: 'Muita gente acha que velocidade inadequada \u00E9 elimina\u00E7\u00E3o direta, mas n\u00E3o \u00E9 bem assim.',
        tip: 'Condi\u00E7\u00F5es ruins = Velocidade baixa.',
        incidence: "alta",
        trap: true,
        difficulty: 3
    },
    {
        id: "nova_infracao_deixar_sinalizar_obstaculo_05",
        category: "infracoes",
        statement: "Empresa executa obra na pista de rolamento e deixa buraco profundo bloqueando veículos e pedestres sem qualquer sinalização. Pelo CTB, a falta de sinalização de obstáculo, com multa multiplicada por 3, é infração:",
        options: [
            "Infração grave, com aplicação de multa simples ao responsável pela obra.",
            "Infração gravíssima, com multa multiplicada por três vezes.",
            "Infração leve, sujeita à conversão imediata em advertência por escrito.",
            "Infração média, com retenção dos equipamentos de sinalização da empresa."
        ],
        correctIndex: 1,
        explanation: 'N\u00E3o sinalizar buracos e obst\u00E1culos \u00E9 infra\u00E7\u00E3o GRAV\u00CDSSIMA, com multa multiplicada por tr\u00EAs vezes.',
        detailedExplanation: 'Quando uma obra n\u00E3o \u00E9 sinalizada, isso coloca em risco a seguran\u00E7a de todos. A multa pode ser de 3 a 5 vezes, dependendo da situa\u00E7\u00E3o e da decis\u00E3o do agente de tr\u00E2nsito.',
        legalBase: "Art. 226 do CTB",
        commonMistake: 'Muita gente pensa que a falta de sinaliza\u00E7\u00E3o s\u00F3 \u00E9 grave se o motorista estiver em movimento.',
        tip: 'Obra sem sinaliza\u00E7\u00E3o = Infra\u00E7\u00E3o GRAV\u00CDSSIMA (3x a 5x de multa).',
        incidence: "alta",
        trap: true,
        difficulty: 3
    },
    {
        id: "nova_placa_a28_pista_escorregadia_06",
        category: "legislacao",
        image_url: "https://tqeqsotsasglmhlmwdwy.supabase.co/storage/v1/object/public/library/images/Placas-de-transito-estudacnh-pista-escorregadia-A-28.png",
        statement: "Ao aproximar-se de um trecho rodoviário, o condutor observa a placa de advertência A-28. Qual é o significado regulamentar correto dessa sinalização e a atitude preventiva exigida?",
        options: [
            "Atravessando pista alagada, alertando para o risco de calço hidráulico no motor.",
            "Pista com aquaplanagem, indicando a obrigatoriedade do uso de correntes nos pneus.",
            "Pista alagada, exigindo a parada total do veículo até o nível da água baixar.",
            "Pista escorregadia, advertindo sobre a redução de aderência do pavimento à frente."
        ],
        correctIndex: 3,
        explanation: 'A placa A-28 avisa que a pista t\u00E1 escorregadia.',
        detailedExplanation: 'Essa placa (Pista Escorregadia) mostra que, mais \u00E0 frente, a pista pode estar escorregadia por causa de \u00E1gua, \u00F3leo ou areia. Por isso, \u00E9 bom diminuir a velocidade pra evitar acidentes.',
        legalBase: "Anexo II do CTB - Sinalização Vertical de Advertência",
        commonMistake: 'Muita gente confunde \'Pista Escorregadia\' (A-28) com \'Pista Alagada\' ou \'Proje\u00E7\u00E3o de Cascalho\' (A-29).',
        tip: 'Pista escorregadia = Reduzir a velocidade.',
        incidence: "alta",
        trap: false,
        difficulty: 2
    },
    {
        id: "nova_prevencao_colisao_cruzamento_07",
        category: "direcao-defensiva",
        statement: "As interseções em perímetro urbano são os locais de maior incidência de abalroamentos entre veículos automotores e pedestres. Pelas regras de direção defensiva e normas do CTB, para transpor uma interseção não semaforizada com segurança, qual postura deve adotar o condutor do veículo?",
        options: [
            "Buzinar de forma prolongada, mantendo a velocidade para forçar os pedestres a aguardarem na calçada.",
            "Ligar os faróis altos e pisca-alerta para indicar aos demais motoristas que pretende passar primeiro.",
            "Reduzir a velocidade, checar ambos os lados da via e respeitar a sinalização de preferência.",
            "Acelerar e transpor a interseção o mais rápido possível para desobstruir o fluxo."
        ],
        correctIndex: 2,
        explanation: 'Quando voc\u00EA chega perto de um cruzamento, \u00E9 hora de diminuir a velocidade, olhar pros lados e seguir a sinaliza\u00E7\u00E3o de quem tem prefer\u00EAncia.',
        detailedExplanation: 'Chegar devagar no cruzamento \u00E9 crucial pra evitar acidentes. Prestar aten\u00E7\u00E3o nos pedestres e em outros ve\u00EDculos que t\u00EAm prioridade \u00E9 fundamental pra passar com seguran\u00E7a.',
        legalBase: "Art. 44 do CTB",
        commonMistake: 'Muita gente acha que pode buzinar ou usar os far\u00F3is pra ter prioridade, mas isso n\u00E3o resolve.',
        tip: 'Cruzamento \u00E0 vista = Reduzir a velocidade + Olhar pros lados + Respeitar a prefer\u00EAncia.',
        incidence: "alta",
        trap: false,
        difficulty: 2
    },
    {
        id: "nova_transito_condicoes_seguras_direito_08",
        category: "legislacao",
        statement: "O Código de Trânsito Brasileiro institui normas fundamentais voltadas à preservação da vida e do meio ambiente. Segundo o texto expresso do Art. 1º do CTB, o trânsito em condições seguras é:",
        options: [
            "Um direito de todos e dever dos órgãos e entidades componentes do Sistema Nacional de Trânsito.",
            "Um privilégio exclusivo dos motoristas devidamente habilitados nas categorias profissionais.",
            "Um direito restrito aos pedestres e ciclistas na utilização de passeios e ciclovias.",
            "Uma responsabilidade facultativa dos motoristas de transporte coletivo de passageiros."
        ],
        correctIndex: 0,
        explanation: 'Tr\u00E2nsito seguro \u00E9 direito de todo mundo e obriga\u00E7\u00E3o dos \u00F3rg\u00E3os do SNT.',
        detailedExplanation: 'Isso quer dizer que todos t\u00EAm o direito de transitar em seguran\u00E7a, e os \u00F3rg\u00E3os respons\u00E1veis devem fazer a parte deles pra garantir isso. Eles precisam tomar medidas que protejam a vida e o meio ambiente no tr\u00E2nsito.',
        legalBase: "Art. 1º, § 2º do CTB",
        commonMistake: 'Muita gente acha que s\u00F3 quem dirige ou caminha tem esse direito.',
        tip: 'Tr\u00E2nsito seguro = DIREITO DE TODOS / DEVER DO ESTADO (SNT).',
        incidence: "alta",
        trap: false,
        difficulty: 1
    },
    {
        id: "nova_infracao_exceder_capacidade_tracao_09",
        category: "infracoes",
        statement: "Um motorista acopla um reboque de grande porte a seu veículo, fazendo com que a carga total ultrapasse substancialmente a Capacidade Máxima de Tração (CMT) especificada pelo fabricante. Transitar excedendo a CMT configura infração de trânsito de natureza:",
        options: [
            "Grave, sujeita à penalidade de multa e retenção do veículo para transbordo da carga excedente.",
            "Média, caso o excesso seja inferior a 500 kg, e gravíssima com multiplicador caso superior.",
            "Leve, com aplicação exclusiva de pontuação na carteira de habilitação do proprietário.",
            "Média, sujeita à penalidade de multa e retenção do veículo."
        ],
        correctIndex: 3,
        explanation: 'Se passar do peso que o carro pode puxar \u00E9 infra\u00E7\u00E3o M\u00C9DIA.',
        detailedExplanation: 'Quando voc\u00EA carrega mais do que o carro aguenta, isso d\u00E1 multa e pode fazer o carro ser parado. \u00C9 importante respeitar o limite que o fabricante recomenda.',
        legalBase: "Art. 231, inciso X do CTB",
        commonMistake: 'Muita gente pensa que sempre que passa do peso \u00E9 infra\u00E7\u00E3o grave ou grav\u00EDssima.',
        tip: 'Passar do peso que o carro aguenta = Infra\u00E7\u00E3o M\u00C9DIA + Carro parado.',
        incidence: "alta",
        trap: true,
        difficulty: 3
    },
    {
        id: "nova_mecanica_falta_balanceamento_rodas_10",
        category: "mecanica",
        statement: "Durante rodagem em velocidades médias e elevadas, a falta de balanceamento correto do conjunto de rodas e pneus provoca desequilíbrio de massa em rotação. A principal consequência direta sentida pelo condutor é:",
        options: [
            "Direção excessivamente dura e travamento do sistema hidráulico/elétrico.",
            "Trepidações e vibrações anormais transmitidas ao volante de direção.",
            "Rangido contínuo e estridente dos pneus durante a realização de curvas fechadas.",
            "Deformação imediata das longarinas do chassi e quebra da caixa de câmbio."
        ],
        correctIndex: 1,
        explanation: 'Quando as rodas est\u00E3o desbalanceadas, o volante come\u00E7a a tremer e vibrar.',
        detailedExplanation: 'O balanceamento \u00E9 pra deixar as rodas e pneus em harmonia. Se n\u00E3o estiver certo, as vibra\u00E7\u00F5es no volante aumentam com a velocidade e podem at\u00E9 desgastar os pneus e a suspens\u00E3o.',
        legalBase: "Manual de Manutenção Veicular e Direção Defensiva",
        commonMistake: 'Muita gente confunde a trepida\u00E7\u00E3o do volante com problemas na dire\u00E7\u00E3o ou na press\u00E3o dos pneus.',
        tip: 'Desbalanceamento = Trepida\u00E7\u00E3o/Vibra\u00E7\u00E3o no volante em alta velocidade.',
        incidence: "alta",
        trap: false,
        difficulty: 2
    },
    {
        id: "nova_exame_pratico_preferencia_pedestre_11",
        category: "legislacao",
        statement: "Na prova prática da CNH, o candidato vai converter à direita em interseção semafórica com sinal verde em seu favor, mas pedestre termina a travessia na via transversal de ingresso. Avançar sem ceder a preferência gera perda de quantos pontos?",
        options: [
            "Falta eliminatória, reprovando o candidato imediatamente na prova prática.",
            "Falta grave, com perda de 3 pontos na ficha de avaliação.",
            "Falta média, com perda de 2 pontos na ficha de avaliação.",
            "Falta leve, com perda de 1 ponto na ficha de avaliação."
        ],
        correctIndex: 1,
        explanation: 'N\u00E3o dar prefer\u00EAncia ao pedestre que est\u00E1 atravessando \u00E9 falta GRAVE no exame (perde 3 pontos).',
        detailedExplanation: 'Se voc\u00EA n\u00E3o parar para deixar o pedestre passar na convers\u00E3o, isso conta como uma falta GRAVE. Isso significa que voc\u00EA vai perder 3 pontos na sua avalia\u00E7\u00E3o.',
        legalBase: "Resolução CONTRAN nº 789/2020 (Anexo V - Faltas no Exame de Direção)",
        commonMistake: 'Muita gente pensa que n\u00E3o dar prefer\u00EAncia ao pedestre na convers\u00E3o \u00E9 motivo de elimina\u00E7\u00E3o direta, mas \u00E9 s\u00F3 uma falta grave.',
        tip: 'N\u00E3o parar para o pedestre na convers\u00E3o = Falta Grave (Perde 3 pontos).',
        incidence: "alta",
        trap: true,
        difficulty: 3
    },
    {
        id: "nova_primeiros_socorros_queimaduras_1grau_12",
        category: "primeiros-socorros",
        statement: "Em sinistro de trânsito com incêndio ou contato com peça aquecida do veículo automotor, a pele fica vermelha, inchada e dolorida, sem bolhas, atingindo apenas a epiderme. Como essa queimadura superficial é classificada?",
        options: [
            "Queimadura de 1° grau, atingindo apenas a camada superficial da pele (epiderme).",
            "Queimadura de 2° grau, com formação de bolhas e acometimento da derme.",
            "Queimadura de 3° grau, com destruição total da pele e perda de sensibilidade.",
            "Queimadura de 4° grau, com acometimento de tecidos, músculos e ossos subadjacentes."
        ],
        correctIndex: 0,
        explanation: 'Queimaduras de 1\u00BA grau s\u00E3o aquelas que pegam s\u00F3 a camada de fora da pele, deixando vermelhid\u00E3o e dor, mas sem bolhas.',
        detailedExplanation: 'As queimaduras de 1\u00BA grau s\u00F3 afetam a epiderme, causando vermelhid\u00E3o e dor. J\u00E1 as de 2\u00BA grau atingem a epiderme e a derme, formando bolhas. As de 3\u00BA grau v\u00E3o mais fundo, afetando todas as camadas da pele e at\u00E9 os nervos, podendo ficar esbranqui\u00E7adas ou carbonizadas.',
        legalBase: "Manual de Primeiros Socorros no Trânsito (ABNT e PHTLS)",
        commonMistake: 'Muita gente confunde queimaduras de 1\u00BA grau, que n\u00E3o t\u00EAm bolhas, com as de 2\u00BA grau, que t\u00EAm.',
        tip: 'Atingiu s\u00F3 a camada de fora / sem bolhas = 1\u00BA Grau | Com bolhas = 2\u00BA Grau | Queimadura profunda / carbonizada = 3\u00BA Grau.',
        incidence: "alta",
        trap: false,
        difficulty: 2
    },
    {
        id: "nova_classificacao_vias_arterial_13",
        category: "legislacao",
        statement: "O CTB classifica as vias abertas à circulação em urbanas e rurais. A via com interseções em nível, geralmente sinalizadas por semáforo, que interliga regiões distintas do perímetro urbano, é tipificada como via:",
        options: [
            "Urbana, com fluxo canalizado por interseções em mesmo nível.",
            "Privada de acesso restrito, com circulação limitada aos moradores.",
            "Rural não pavimentada, destinada à circulação intermunicipal.",
            "Expressa internacional, exclusiva de trânsito entre países fronteiriços."
        ],
        correctIndex: 0,
        explanation: 'A via arterial \u00E9 uma via URBANA.',
        detailedExplanation: 'As vias s\u00E3o divididas em urbanas e rurais. A via arterial faz parte das urbanas, que incluem tamb\u00E9m as vias de tr\u00E2nsito r\u00E1pido, coletoras e locais.',
        legalBase: "Art. 60, inciso I, alínea b do CTB",
        commonMistake: 'Muita gente confunde as vias urbanas com as rurais.',
        tip: 'Vias URBANAS = A\u00E7\u00E3o: Tr\u00E2nsito R\u00E1pido, Arterial, Coletora e Local.',
        incidence: "alta",
        trap: false,
        difficulty: 1
    },
    {
        id: 'leg_n1_002',
        category: 'legislacao',
        statement: "Candidato aprovado nos exames teórico e prático recebe a Permissão para Dirigir (PPD) e pretende saber o prazo do estágio probatório até a expedição da CNH definitiva. Pelo CTB e pelas resoluções do CONTRAN, esse prazo de estágio probatório é de:",
        options: [
            "12 meses (um ano), contados a partir da expedição do documento.",
            "6 meses, prorrogáveis uma única vez mediante requerimento.",
            "24 meses, coincidentes com o período mínimo das avaliações psicológicas.",
            "Indefinidamente, até a ocorrência da primeira infração de trânsito."
        ],
        correctIndex: 0,
        explanation: 'A PPD vale por 1 ano.',
        detailedExplanation: 'A Permiss\u00E3o para Dirigir (PPD) \u00E9 v\u00E1lida por 12 meses. Se o motorista n\u00E3o tiver infra\u00E7\u00F5es graves ou grav\u00EDssimas e n\u00E3o repetir m\u00E9dias, ele ganha a CNH definitiva; se n\u00E3o, tem que come\u00E7ar tudo de novo.',
        commonMistake: 'Muita gente pensa que a PPD dura s\u00F3 6 meses.',
        tip: 'PPD = 1 ano de prova.',
        incidence: 'alta',
        difficulty: 1,
        legalBase: 'Art. 29 do CTB',
        memoryHook: 'PPD = 1 ano de prova.',
        trap: true
    },
    {
        id: 'leg_n2_001',
        category: 'legislacao',
        statement: "Candidato aprovado e habilitado na categoria B precisa conhecer os limites de massa bruta total e de lotação que essa categoria autoriza, conforme o Art. 143 do CTB. Esses limites legais estabelecidos pela lei são:",
        options: [
            "PBT de até 3.500 kg e lotação de até 8 passageiros, excluído o condutor (regra 8+1).",
            "PBT de até 6.000 kg e lotação de até 10 passageiros, incluindo o motorista.",
            "PBT ilimitado para carga e lotação de até 8 ocupantes no total.",
            "Somente veículos de passeio com até 5 lugares, contando o condutor."
        ],
        correctIndex: 0,
        explanation: 'Na categoria B, voc\u00EA pode dirigir ve\u00EDculos com PBT at\u00E9 3.500 kg e lota\u00E7\u00E3o de at\u00E9 8 passageiros, sem contar o motorista.',
        detailedExplanation: 'Isso significa que, al\u00E9m do motorista, voc\u00EA pode levar mais 8 pessoas no carro. Se o ve\u00EDculo passar desse peso ou n\u00FAmero de passageiros, precisa de outra categoria, como C ou D.',
        commonMistake: 'Muita gente confunde e acha que os 8 passageiros incluem o motorista.',
        tip: 'B = 3.500 kg e 8+1.',
        incidence: 'alta',
        difficulty: 2,
        legalBase: 'Art. 29 do CTB',
        memoryHook: 'B = 3.500 kg e 8+1.',
        trap: true
    },
    {
        id: 'leg_n1_001',
        category: 'legislacao',
        statement: "A categoria B habilita veículos motorizados com peso bruto total de até 3.500 kg. Segundo o Art. 143 do CTB e as normas do CONTRAN, o limite legal de transporte de passageiros nesses veículos, excluído o condutor, é de:",
        options: [
            "Até 8 passageiros, não contando o condutor (regra do 8+1).",
            "Até 8 passageiros, contando obrigatoriamente o motorista.",
            "Até 15 passageiros, além do condutor.",
            "Até 5 passageiros, não contando o condutor."
        ],
        correctIndex: 0,
        explanation: 'Na categoria B, voc\u00EA pode levar at\u00E9 8 passageiros, sem contar o motorista.',
        detailedExplanation: 'A categoria B permite dirigir carros com at\u00E9 3.500 kg de PBT e at\u00E9 8 pessoas a bordo, al\u00E9m do motorista. Se precisar levar mais de 8 passageiros, precisa da categoria D; se o ve\u00EDculo passar de 3.500 kg, precisa da categoria C.',
        commonMistake: 'Muita gente confunde e acha que pode levar 8 passageiros no total, contando o motorista.',
        tip: 'B = 3.500 kg e 8+1.',
        incidence: 'alta',
        difficulty: 1,
        legalBase: 'Art. 29 do CTB',
        memoryHook: 'B = 3.500 kg e 8+1.',
        trap: true
    },
    {
        id: 'leg_n2_003',
        category: 'legislacao',
        statement: "Condutor comum acumula pontos no prontuário sem cometer nenhuma infração gravíssima em 12 meses. Considerando a sistemática de contagem de pontos da Lei 14.071/2020 no CTB, a suspensão do direito de dirigir ocorre:",
        options: [
            "Aos 40 pontos, limite aplicável quando não há infração gravíssima no período.",
            "Aos 20 pontos, regra fixa independente da gravidade das infrações.",
            "Aos 30 pontos, pela existência de ao menos uma infração grave.",
            "Aos 14 pontos, por tratar-se de condutor com atividade remunerada (EAR)."
        ],
        correctIndex: 0,
        explanation: 'Se n\u00E3o teve infra\u00E7\u00E3o grav\u00EDssima, o limite \u00E9 40 pontos.',
        detailedExplanation: 'O n\u00FAmero de pontos que voc\u00EA pode acumular muda: 40 se n\u00E3o tiver grav\u00EDssimas, 30 se tiver uma e 20 se tiver duas ou mais. A antiga regra dos 20 pontos fixos n\u00E3o vale mais.',
        commonMistake: 'Muita gente ainda acha que s\u00E3o 20 pontos fixos, mas isso mudou.',
        tip: 'Sem grav\u00EDssima = 40 pontos.',
        incidence: 'alta',
        difficulty: 2,
        legalBase: 'Art. 29 do CTB',
        memoryHook: 'Sem grav\u00EDssima = 40 pontos.',
        trap: true
    },
    {
        id: 'inf_n1_001',
        category: 'infracoes',
        statement: "Em fiscalização no período noturno, o condutor é flagrado segurando o telefone celular com uma mão para ler mensagens durante a condução na pista. Pelo art. 252 do CTB, essa conduta constitui infração de natureza:",
        options: [
            "Gravíssima, com multa e pontuação de 7 pontos na CNH.",
            "Grave, com multa e pontuação de 5 pontos na CNH.",
            "Média, com multa e pontuação de 4 pontos na CNH.",
            "Leve, com multa e pontuação de 3 pontos na CNH."
        ],
        correctIndex: 0,
        explanation: 'Celular na m\u00E3o enquanto dirige = grav\u00EDssima.',
        detailedExplanation: 'Usar o celular ao volante \u00E9 uma infra\u00E7\u00E3o grav\u00EDssima (7 pontos e multa). Isso acontece porque mexer no celular atrapalha muito a rea\u00E7\u00E3o do motorista.',
        commonMistake: 'Muita gente pensa que \u00E9 s\u00F3 uma infra\u00E7\u00E3o grave.',
        tip: 'Dirigindo = Celular guardado.',
        incidence: 'alta',
        difficulty: 1,
        legalBase: 'Art. 258 do CTB',
        memoryHook: 'Dirigindo = Celular guardado.',
        trap: true
    },
    {
        id: 'leg_n2_002',
        category: 'legislacao',
        statement: "Candidato recebe a Permissão para Dirigir após aprovação nos exames teórico e prático. Sobre o período probatório e as consequências das infrações cometidas nesse intervalo no prontuário, a alternativa correta é:",
        options: [
            "A PPD vale 12 meses; infração grave, gravíssima ou reincidência em média impede a CNH definitiva.",
            "A PPD vale 6 meses e qualquer infração leve já anula a habilitação.",
            "A PPD não possui prazo e só é cancelada por crime de trânsito.",
            "A PPD vale 24 meses e admite até 20 pontos sem consequência."
        ],
        correctIndex: 0,
        explanation: 'A PPD \u00E9 por 1 ano; infra\u00E7\u00F5es graves, grav\u00EDssimas ou reincid\u00EAncias em m\u00E9dias barram a CNH definitiva.',
        detailedExplanation: 'Durante a PPD (12 meses), o motorista est\u00E1 sendo observado. Se ele cometer infra\u00E7\u00E3o grave, grav\u00EDssima ou repetir uma m\u00E9dia, n\u00E3o consegue a CNH definitiva e precisa come\u00E7ar tudo de novo.',
        commonMistake: 'Muita gente acha que s\u00F3 a grav\u00EDssima impede a definitiva.',
        tip: 'PPD = sem infra\u00E7\u00E3o grave/grav\u00EDssima e sem reincid\u00EAncia em m\u00E9dia.',
        incidence: 'alta',
        difficulty: 2,
        legalBase: 'Art. 29 do CTB',
        memoryHook: 'PPD = sem infra\u00E7\u00E3o grave/grav\u00EDssima e sem reincid\u00EAncia em m\u00E9dia.',
        trap: true
    },
    {
        id: 'inf_n2_001',
        category: 'infracoes',
        statement: "Durante fiscalização com radar e agente no acostamento, motorista é flagrado manipulando celular para ler mensagens em via de trânsito rápido. Segundo a legislação atualizada, essa conduta é enquadrada como:",
        options: [
            "Infração gravíssima, com 7 pontos na CNH e multa.",
            "Infração grave, com 5 pontos e advertência por escrito.",
            "Infração média, com 4 pontos e reciclagem obrigatória.",
            "Infração leve, com 3 pontos e conversão em advertência."
        ],
        correctIndex: 0,
        explanation: 'Segurar o celular enquanto dirige \u00E9 uma infra\u00E7\u00E3o grav\u00EDssima.',
        detailedExplanation: 'Quando o motorista est\u00E1 com o celular na m\u00E3o, isso resulta em 7 pontos na CNH e multa. O uso s\u00F3 \u00E9 permitido se for viva-voz ou com fone, sem segurar o aparelho.',
        commonMistake: 'Muita gente acha que isso \u00E9 s\u00F3 uma infra\u00E7\u00E3o grave.',
        tip: 'Celular na m\u00E3o = grav\u00EDssima.',
        incidence: 'alta',
        difficulty: 2,
        legalBase: 'Art. 258 do CTB',
        memoryHook: 'Celular na m\u00E3o = grav\u00EDssima.',
        trap: true
    },
    {
        id: 'leg_n1_003',
        category: 'legislacao',
        statement: "Pela sistemática de contagem de pontos introduzida pela Lei 14.071/2020 no CTB, o condutor que não cometeu nenhuma infração gravíssima no período de 12 meses sofre suspensão do direito de dirigir ao atingir:",
        options: [
            "40 pontos acumulados no prontuário.",
            "20 pontos fixos, independentemente da natureza das infrações.",
            "30 pontos, exigida a existência de infração grave.",
            "14 pontos, para condutor com EAR (exercício de atividade remunerada)."
        ],
        correctIndex: 0,
        explanation: 'Sem infra\u00E7\u00F5es grav\u00EDssimas, a suspens\u00E3o acontece aos 40 pontos.',
        detailedExplanation: 'Com a nova lei, se voc\u00EA n\u00E3o tiver nenhuma infra\u00E7\u00E3o grav\u00EDssima, pode acumular at\u00E9 40 pontos. Se tiver uma grav\u00EDssima, o limite cai para 30 pontos e, se tiver duas ou mais, vai para 20 pontos.',
        commonMistake: 'Muita gente ainda acha que s\u00E3o sempre 20 pontos, mas a regra mudou.',
        tip: 'Sem grav\u00EDssima = 40 pontos.',
        incidence: 'alta',
        difficulty: 1,
        legalBase: 'Art. 29 do CTB',
        memoryHook: 'Sem grav\u00EDssima = 40 pontos.',
        trap: true
    },
    {
        id: 'inf_n1_002',
        category: 'infracoes',
        statement: "Em estacionamento de uso coletivo no perímetro urbano, o condutor ocupa vaga reservada a Pessoa com Deficiência sem expor a credencial de identificação emitida pelo órgão de trânsito. Pelo CTB, essa conduta constitui infração:",
        options: [
            "Gravíssima, com multa, 7 pontos na CNH e remoção do veículo.",
            "Média, com multa e pontuação de 4 pontos na CNH.",
            "Leve, com advertência por escrito e sem pontuação.",
            "Grave, com multa e pontuação de 5 pontos na CNH."
        ],
        correctIndex: 0,
        explanation: 'Estacionar em vaga de PCD sem a credencial \u00E9 grav\u00EDssima; j\u00E1 a vaga de idoso \u00E9 m\u00E9dia.',
        detailedExplanation: 'Usar vaga de PCD sem a credencial \u00E9 uma infra\u00E7\u00E3o grav\u00EDssima, que d\u00E1 7 pontos e pode levar o carro pro p\u00E1tio. A vaga de idoso, se usada sem a credencial, \u00E9 s\u00F3 infra\u00E7\u00E3o m\u00E9dia \u2014 fique esperto com isso!',
        commonMistake: 'Muita gente confunde: PCD \u00E9 grav\u00EDssima e idoso \u00E9 m\u00E9dia.',
        tip: 'Vaga PCD = grav\u00EDssima; vaga idoso = m\u00E9dia.',
        incidence: 'alta',
        difficulty: 1,
        legalBase: 'Art. 258 do CTB',
        memoryHook: 'Vaga PCD = grav\u00EDssima; vaga idoso = m\u00E9dia.',
        trap: true
    },
    {
        id: 'inf_n2_002',
        category: 'infracoes',
        statement: "O condutor de veículo de passeio estaciona em vaga reservada a Pessoas com Deficiência, em estacionamento privado de uso coletivo, sem possuir a credencial autorizativa. Pelo CTB, a natureza dessa infração é:",
        options: [
            "Gravíssima, com 7 pontos na CNH e remoção do veículo.",
            "Média, com 4 pontos e apenas multa administrativa.",
            "Leve, com 3 pontos e advertência por escrito.",
            "Grave, com 5 pontos e retenção da CNH."
        ],
        correctIndex: 0,
        explanation: 'Estacionar em vaga PCD sem a credencial \u00E9 uma infra\u00E7\u00E3o grav\u00EDssima, mesmo em estacionamento privado.',
        detailedExplanation: 'As vagas para Pessoas com Defici\u00EAncia (PCD) precisam de credencial, e isso vale tamb\u00E9m para estacionamentos privados de uso coletivo. Se n\u00E3o tiver a credencial, a multa \u00E9 grav\u00EDssima, com 7 pontos e o carro pode ser guinchado.',
        commonMistake: 'Muita gente pensa que em estacionamento privado n\u00E3o tem fiscaliza\u00E7\u00E3o ou que a infra\u00E7\u00E3o \u00E9 m\u00E9dia.',
        tip: 'Vaga PCD = A\u00E7\u00E3o grav\u00EDssima; Vaga idoso = A\u00E7\u00E3o m\u00E9dia.',
        incidence: 'alta',
        difficulty: 2,
        legalBase: 'Art. 258 do CTB',
        memoryHook: 'Vaga PCD = A\u00E7\u00E3o grav\u00EDssima; Vaga idoso = A\u00E7\u00E3o m\u00E9dia.',
        trap: true
    },
    {
        id: 'inf_n1_003',
        category: 'infracoes',
        statement: "Em rodovia de pista dupla com velocidade máxima de 110 km/h, veículo é registrado trafegando a 170 km/h — acima de 50% do limite. Pelo CTB, transitar acima de 50% do limite regulamentado configura infração:",
        options: [
            "Gravíssima, com multa multiplicada por 3 e suspensão do direito de dirigir.",
            "Grave, com multa simples e pontuação de 5 pontos na CNH.",
            "Média, com multa e pontuação de 4 pontos na CNH.",
            "Leve, com advertência por escrito sem pontuação."
        ],
        correctIndex: 0,
        explanation: 'Se passar de 50% do limite, \u00E9 grav\u00EDssima (multinha x3 e suspens\u00E3o).',
        detailedExplanation: 'Quando voc\u00EA ultrapassa o limite de velocidade em mais de 50%, a infra\u00E7\u00E3o \u00E9 grav\u00EDssima, e a multa \u00E9 tr\u00EAs vezes maior, al\u00E9m de voc\u00EA ficar sem poder dirigir por um tempo.',
        commonMistake: 'Muita gente pensa que qualquer excesso \u00E9 s\u00F3 uma infra\u00E7\u00E3o grave.',
        tip: '>50% = grav\u00EDssima x3.',
        incidence: 'alta',
        difficulty: 1,
        legalBase: 'Art. 258 do CTB',
        memoryHook: '>50% = grav\u00EDssima x3.',
        trap: true
    },
    {
        id: 'inf_n2_003',
        category: 'infracoes',
        statement: "A fiscalização eletrônica em rodovia de pista dupla registra veículo trafegando a 170 km/h, onde o limite regulamentar é 110 km/h, configurando excesso superior a 50%. Segundo o CTB, essa conduta resulta em:",
        options: [
            "Infração gravíssima, com multa multiplicada por 3 e suspensão imediata do direito de dirigir.",
            "Infração grave, com multa simples e retenção do veículo para vistoria.",
            "Infração média, com multa e pontuação no prontuário do condutor.",
            "Crime de trânsito inafiançável, com prisão imediata do condutor."
        ],
        correctIndex: 0,
        explanation: 'Passar de 110 km/h pra 170 km/h \u00E9 muito mais que 50% do limite, ent\u00E3o \u00E9 grav\u00EDssima e multa tripla.',
        detailedExplanation: 'Quando voc\u00EA ultrapassa 50% do limite de velocidade, isso \u00E9 considerado uma infra\u00E7\u00E3o grav\u00EDssima. Al\u00E9m da multa ser multiplicada por 3, o motorista ainda pode ter a carteira suspensa.',
        commonMistake: 'Muita gente esquece de calcular e acha que \u00E9 s\u00F3 uma infra\u00E7\u00E3o grave.',
        tip: '>50% = grav\u00EDssima x3.',
        incidence: 'alta',
        difficulty: 2,
        legalBase: 'Art. 258 do CTB',
        memoryHook: '>50% = grav\u00EDssima x3.',
        trap: true
    },
    {
        id: 'dd_n1_001',
        category: 'direcao-defensiva',
        statement: "Ao chegar ao local de um acidente de trânsito, o condutor deve seguir o protocolo de socorro conhecido pela sigla PAS antes de qualquer atendimento às vítimas. Nesse protocolo, as letras PAS significam:",
        options: [
            "Proteger, Avisar, Socorrer.",
            "Parar, Abrir, Socorrer.",
            "Prevenir, Atender, Salvar.",
            "Prestar, Acionar, Sinalizar."
        ],
        correctIndex: 0,
        explanation: 'PAS \u00E9 Proteger, Avisar e Socorrer.',
        detailedExplanation: 'Primeiro, voc\u00EA protege o lugar (sinaliza), depois avisa o socorro (liga pro SAMU 192) e, por \u00FAltimo, socorre as v\u00EDtimas com cuidado. Assim, voc\u00EA evita que quem ajuda tamb\u00E9m se machuque.',
        commonMistake: 'Muita gente esquece de proteger o local antes de tudo.',
        tip: 'Situa\u00E7\u00E3o = A\u00E7\u00E3o: Proteger = Avisa = Socorre.',
        incidence: 'alta',
        difficulty: 1,
        legalBase: 'Art. 180 do CTB',
        memoryHook: 'Situa\u00E7\u00E3o = A\u00E7\u00E3o: Proteger = Avisa = Socorre.',
        trap: true
    },
    {
        id: 'dd_n1_002',
        category: 'direcao-defensiva',
        statement: "Em rodovia sob chuva intensa, o condutor percebe que a direção fica leve e o veículo flutua sobre a lâmina d'água da pista de rolamento, caracterizando aquaplanagem. A conduta correta nesse instante é:",
        options: [
            "Retirar o pé do acelerador e manter o volante firme, sem frear bruscamente.",
            "Aplicar frenagem forte para recuperar imediatamente a aderência dos pneus.",
            "Girar o volante alternadamente para ambos os lados para expulsar a água.",
            "Engatar marcha ré imediatamente para reduzir a velocidade do veículo."
        ],
        correctIndex: 0,
        explanation: 'Na aquaplanagem, voc\u00EA deve tirar o p\u00E9 do acelerador e segurar o volante firme.',
        detailedExplanation: 'Quando o carro aquaplana, os pneus n\u00E3o tocam o ch\u00E3o. O certo \u00E9 tirar o p\u00E9 do acelerador, manter o volante firme na dire\u00E7\u00E3o e evitar frear ou virar de uma vez.',
        commonMistake: 'Muita gente acha que deve frear, mas isso pode piorar a situa\u00E7\u00E3o.',
        tip: 'Aquaplanagem = P\u00E9 fora do acelerador!',
        incidence: 'alta',
        difficulty: 1,
        legalBase: 'Art. 180 do CTB',
        memoryHook: 'Aquaplanagem = P\u00E9 fora do acelerador!',
        trap: true
    },
    {
        id: 'dd_n2_001',
        category: 'direcao-defensiva',
        statement: "Ao presenciar acidente de trânsito, o condutor deve adotar o protocolo PAS antes de qualquer atendimento às vítimas. A sequência correta desse protocolo, segundo os princípios de primeiros socorros, é:",
        options: [
            "Proteger o local (sinalizar), Avisar o socorro (192) e Socorrer com cautela.",
            "Socorrer imediatamente, depois avisar o socorro e por fim proteger a via.",
            "Parar sobre a pista, retirar pertences e sinalizar após remover as vítimas.",
            "Avisar a família, proteger o veículo e socorrer sem treinamento prévio."
        ],
        correctIndex: 0,
        explanation: 'PAS = Proteger, Avisar e Socorrer.',
        detailedExplanation: 'Primeiro, voc\u00EA deve proteger o local do acidente com um tri\u00E2ngulo e pisca-alerta. Depois, avisa o socorro pelo telefone (SAMU 192, Bombeiros 193, Pol\u00EDcia 190) e s\u00F3 ent\u00E3o pode ajudar as v\u00EDtimas com cuidado.',
        commonMistake: 'Muita gente esquece de sinalizar antes de chamar o socorro.',
        tip: 'Acidente = Proteger, Avisar, Socorrer.',
        incidence: 'alta',
        difficulty: 2,
        legalBase: 'Art. 180 do CTB',
        memoryHook: 'Acidente = Proteger, Avisar, Socorrer.',
        trap: true
    },
    {
        id: 'dd_n2_002',
        category: 'direcao-defensiva',
        statement: "Durante chuva intensa, o condutor sente a direção ficar leve e identifica a ocorrência de aquaplanagem sobre a pista de rolamento. Do ponto de vista da direção defensiva, a atitude imediata do condutor deve ser:",
        options: [
            "Retirar o pé do acelerador, segurar o volante firme e não frear nem virar bruscamente.",
            "Pisar com força no freio para travar as rodas e buscar atrito com o pavimento.",
            "Girar o volante rapidamente para expulsar a água acumulada sob os pneus.",
            "Engatar marcha reduzida em giro alto para forçar a recuperação da tração."
        ],
        correctIndex: 0,
        explanation: 'Na aquaplanagem, tire o p\u00E9 do acelerador e mantenha a dire\u00E7\u00E3o reta.',
        detailedExplanation: 'Se voc\u00EA frear ou virar r\u00E1pido, pode fazer o carro rodar. \u00C9 melhor segurar o volante firme e esperar os pneus voltarem a tocar o ch\u00E3o.',
        commonMistake: 'Muita gente acha que deve frear, mas isso s\u00F3 piora a situa\u00E7\u00E3o.',
        tip: 'Chuva = P\u00E9 fora do acelerador.',
        incidence: 'alta',
        difficulty: 2,
        legalBase: 'Art. 180 do CTB',
        memoryHook: 'Chuva = P\u00E9 fora do acelerador.',
        trap: true
    },
    {
        id: 'ps_n1_001',
        category: 'primeiros-socorros',
        statement: "Em emergência médica com vítima grave no local do sinistro, o socorrista precisa acionar o serviço de atendimento móvel de urgência que desloca equipe médica especializada ao local. O número oficial do SAMU é:",
        options: [
            "192 — número do Serviço de Atendimento Móvel de Urgência (SAMU).",
            "193 — número do Corpo de Bombeiros Militar.",
            "190 — número da Polícia Militar.",
            "191 — número da Polícia Rodoviária Federal."
        ],
        correctIndex: 0,
        explanation: 'Se precisar de ajuda m\u00E9dica r\u00E1pida, ligue pro SAMU: 192.',
        detailedExplanation: 'O SAMU (Servi\u00E7o de Atendimento M\u00F3vel de Urg\u00EAncia) atende emerg\u00EAncias m\u00E9dicas. Lembre-se que os Bombeiros s\u00E3o pelo 193, a Pol\u00EDcia Militar pelo 190 e a PRF pelo 191.',
        commonMistake: 'Muita gente confunde o n\u00FAmero do SAMU com o da pol\u00EDcia ou dos bombeiros.',
        tip: 'Emerg\u00EAncia = 192.',
        incidence: 'alta',
        difficulty: 1,
        legalBase: 'Art. 134 do CTB',
        memoryHook: 'Emerg\u00EAncia = 192.',
        trap: true
    },
    {
        id: 'ps_n2_001',
        category: 'primeiros-socorros',
        statement: "Em acidente de trânsito com vítimas presas nas ferragens e necessidade de atendimento médico imediato, o socorrista deve acionar os órgãos competentes. O número e o serviço corretos para urgência médica são:",
        options: [
            "192 — SAMU (Serviço de Atendimento Móvel de Urgência).",
            "193 — Corpo de Bombeiros Militar, para resgate e combate a incêndio.",
            "190 — Polícia Militar, para policiamento ostensivo.",
            "199 — Defesa Civil, para desabamentos e emergências civis."
        ],
        correctIndex: 0,
        explanation: 'Urg\u00EAncia m\u00E9dica = SAMU 192.',
        detailedExplanation: 'Quando tem acidente e algu\u00E9m t\u00E1 preso nas ferragens, voc\u00EA liga pro SAMU no 192 pra pedir ajuda m\u00E9dica. Os Bombeiros (193) ajudam em inc\u00EAndios e a Pol\u00EDcia (190) cuida de brigas, enquanto a PRF (191) \u00E9 pra rodovias federais.',
        commonMistake: 'Muita gente confunde e acha que \u00E9 o Bombeiro que cuida de tudo.',
        tip: 'Acidente = Liga pro SAMU 192.',
        incidence: 'alta',
        difficulty: 2,
        legalBase: 'Art. 134 do CTB',
        memoryHook: 'Acidente = Liga pro SAMU 192.',
        trap: true
    },
    {
        id: 'ps_n1_002',
        category: 'primeiros-socorros',
        statement: "Após acidente de trânsito, a vítima relata dor intensa na coluna e apresenta parestesia nos membros, suspeitando-se de fratura vertebral. Enquanto a equipe de resgate médico não chega, a conduta correta é:",
        options: [
            "Mantê-la imóvel e na posição encontrada, sem qualquer movimentação da coluna.",
            "Sentá-la rapidamente em cadeira rígida para aliviar a pressão sobre a coluna.",
            "Conduzi-la a pé até o hospital mais próximo para avaliação radiológica.",
            "Massagear a região dorsal para relaxar a musculatura em contratura."
        ],
        correctIndex: 0,
        explanation: 'Se suspeitar de fratura na coluna, n\u00E3o mova a pessoa.',
        detailedExplanation: 'Movimentar quem tem suspeita de les\u00E3o na coluna pode piorar a situa\u00E7\u00E3o e causar paralisia. O ideal \u00E9 deixar a v\u00EDtima na posi\u00E7\u00E3o que est\u00E1 at\u00E9 a chegada do socorro.',
        commonMistake: 'Muita gente acha que deve mover a v\u00EDtima pra deix\u00E1-la mais confort\u00E1vel.',
        tip: 'Suspeita = Im\u00F3vel at\u00E9 o socorro.',
        incidence: 'alta',
        difficulty: 1,
        legalBase: 'Art. 134 do CTB',
        memoryHook: 'Suspeita = Im\u00F3vel at\u00E9 o socorro.',
        trap: true
    },
    {
        id: 'ma_n1_002',
        category: 'meio-ambiente',
        statement: "Durante trajeto em rodovia de pista simples, condutor e passageiros arremessam resíduos sólidos pela janela do veículo em movimento. Conforme o Art. 172 do CTB, essa postura no trânsito configura infração:",
        options: [
            "Infração média de trânsito, prevista no Art. 172 do CTB, sujeita a multa e pontuação na CNH.",
            "Infração leve de trânsito, punida apenas com advertência verbal do agente de trânsito.",
            "Infração gravíssima de trânsito, punida com multa multiplicada e suspensão da CNH.",
            "Infração grave de trânsito, punida com multa e cassação da permissão para dirigir."
        ],
        correctIndex: 0,
        explanation: 'Jogar lixo pela janela \u00E9 uma infra\u00E7\u00E3o m\u00E9dia.',
        detailedExplanation: 'Quando voc\u00EA joga ou deixa coisas na rua, isso \u00E9 considerado uma infra\u00E7\u00E3o m\u00E9dia, que d\u00E1 4 pontos e multa. Al\u00E9m disso, pode ser crime ambiental e causar acidentes.',
        commonMistake: 'Muita gente pensa que isso \u00E9 infra\u00E7\u00E3o leve.',
        tip: 'Lixo pela janela = m\u00E9dia.',
        incidence: 'alta',
        difficulty: 1,
        legalBase: 'Art. 190 do CTB',
        memoryHook: 'Lixo pela janela = m\u00E9dia.',
        trap: true
    },
    {
        id: 'ma_n2_001',
        category: 'meio-ambiente',
        statement: "Em garagem fechada, veículo com motor desregulado libera gás incolor e inodoro e os ocupantes apresentam dor de cabeça. O gás da combustão que se liga à hemoglobina e bloqueia a oxigenação do sangue é:",
        options: [
            "Monóxido de Carbono (CO), produto da combustão incompleta que se liga à hemoglobina.",
            "Dióxido de Carbono (CO2), gás natural da atmosfera e principal do efeito estufa.",
            "Dióxido de Enxofre (SO2), gás de odor forte e irritante para as vias respiratórias.",
            "Clorofluorcarboneto (CFC), composto que destrói a camada de ozônio estratosférico."
        ],
        correctIndex: 0,
        explanation: 'O CO \u00E9 o g\u00E1s que faz mal e n\u00E3o d\u00E1 pra sentir.',
        detailedExplanation: 'Ele vem da queima que n\u00E3o t\u00E1 completa e \u00E9 super perigoso porque n\u00E3o tem cor nem cheiro. J\u00E1 o CO2 \u00E9 o g\u00E1s que esquenta o planeta, o SO2 tem cheiro forte e o CFC estraga a camada de oz\u00F4nio.',
        commonMistake: 'Muita gente confunde CO com CO2, mas eles s\u00E3o bem diferentes.',
        tip: 'Queima incompleta = G\u00E1s t\u00F3xico.',
        incidence: 'alta',
        difficulty: 2,
        legalBase: 'Art. 190 do CTB',
        memoryHook: 'Queima incompleta = G\u00E1s t\u00F3xico.',
        trap: true
    },
    {
        id: 'ps_n2_002',
        category: 'primeiros-socorros',
        statement: "Após colisão frontal entre dois veículos, apresenta-se suspeita de lesão medular em uma das vítimas, com relato de perda de sensibilidade e de movimento nos membros. A conduta até a chegada do resgate é:",
        options: [
            "Manter a vítima imóvel e alinhada, sem movimentar cabeça, pescoço ou coluna.",
            "Remover a vítima do veículo e sentá-la em cadeira rígida até o socorro.",
            "Massagear a região cervical para aliviar a contratura muscular pós-impacto.",
            "Girar o pescoço da vítima para avaliar a amplitude de movimento articular."
        ],
        correctIndex: 0,
        explanation: 'Se a pessoa suspeita ter les\u00E3o na coluna, \u00E9 melhor n\u00E3o mexer. Mantenha ela parada.',
        detailedExplanation: 'Qualquer movimento pode piorar a situa\u00E7\u00E3o e causar paralisia. \u00C9 importante que a v\u00EDtima fique na mesma posi\u00E7\u00E3o at\u00E9 o socorro chegar com o material certo para imobilizar.',
        commonMistake: 'Muita gente acha que deve mover a v\u00EDtima para deix\u00E1-la mais confort\u00E1vel, mas isso pode ser perigoso.',
        tip: 'Les\u00E3o na coluna = N\u00E3o mexer!',
        incidence: 'alta',
        difficulty: 2,
        legalBase: 'Art. 134 do CTB',
        memoryHook: 'Les\u00E3o na coluna = N\u00E3o mexer!',
        trap: true
    },
    {
        id: 'ma_n1_001',
        category: 'meio-ambiente',
        statement: "Com as janelas fechadas em congestionamento, sobe no habitáculo a concentração do gás incolor e inodoro proveniente do escapamento. Esse gás, que se liga à hemoglobina e impede a oxigenação do sangue, é:",
        options: [
            "Monóxido de Carbono (CO), resultante da queima incompleta de combustível.",
            "Dióxido de Carbono (CO2), produto da queima completa e gás do efeito estufa.",
            "Gás Ozônio (O3), presente naturalmente na estratosfera e tóxico em baixa altitude.",
            "Clorofluorcarboneto (CFC), usado em refrigeração e destruidor do ozônio."
        ],
        correctIndex: 0,
        explanation: 'O CO (mon\u00F3xido de carbono) bloqueia o oxig\u00EAnio no sangue.',
        detailedExplanation: 'Esse g\u00E1s \u00E9 perigoso, n\u00E3o tem cor nem cheiro, e se gruda na hemoglobina mais f\u00E1cil que o oxig\u00EAnio, causando asfixia. Por isso, nunca ligue o carro em lugar fechado.',
        commonMistake: 'Muita gente acha que s\u00F3 o cheiro indica perigo, mas o CO n\u00E3o tem cheiro.',
        tip: 'Lugar fechado = Perigo de CO.',
        incidence: 'alta',
        difficulty: 1,
        legalBase: 'Art. 190 do CTB',
        memoryHook: 'Lugar fechado = Perigo de CO.',
        trap: true
    },
    {
        id: 'me_n1_001',
        category: 'legislacao',
        statement: "O condutor mantém o veículo em circulação com nível de óleo lubrificante muito abaixo do mínimo indicado na vareta de medição. Considerando o sistema de lubrificação do motor, essa situação pode provocar:",
        options: [
            "Fundição do motor (fundo do motor) por atrito excessivo entre as peças.",
            "Menor consumo de combustível, sem qualquer risco mecânico.",
            "Travamento do sistema de freios por contaminação do fluido.",
            "Desgaste exclusivo das velas de ignição do motor."
        ],
        correctIndex: 0,
        explanation: 'Falta de \u00F3leo pode fazer o motor travar.',
        detailedExplanation: 'O \u00F3leo \u00E9 o que mant\u00E9m as pe\u00E7as do motor funcionando direitinho. Se o n\u00EDvel t\u00E1 muito baixo, as pe\u00E7as esfregam umas nas outras, esquentam demais e podem derreter.',
        commonMistake: 'Muita gente acha que s\u00F3 precisa de \u00F3leo quando o motor faz barulho.',
        tip: '\u00D3leo baixo = Motor fundido.',
        incidence: 'alta',
        difficulty: 1,
        legalBase: 'Art. 29 do CTB',
        memoryHook: '\u00D3leo baixo = Motor fundido.',
        trap: true
    },
    {
        id: 'ma_n2_002',
        category: 'meio-ambiente',
        statement: "Durante fiscalização em rodovia de trânsito intenso, é flagrado passageiro arremessando lata de alumínio pelo vidro lateral do veículo em movimento, com o resíduo caindo na pista. Conforme o CTB, essa conduta configura:",
        options: [
            "Infração média, com multa e 4 pontos na CNH, de responsabilidade do condutor.",
            "Infração leve, de responsabilidade exclusiva do passageiro arremessante.",
            "Infração grave, com multa e suspensão da licença de tráfego do veículo.",
            "Conduta admitida em via de pista simples, desde que fora do acostamento."
        ],
        correctIndex: 0,
        explanation: 'Jogar lixo na estrada = infra\u00E7\u00E3o m\u00E9dia.',
        detailedExplanation: 'Quando algu\u00E9m joga um objeto pela janela, isso \u00E9 uma infra\u00E7\u00E3o m\u00E9dia (Art. 172). O motorista \u00E9 quem leva a culpa, e isso pode ser crime ambiental, al\u00E9m de ser perigoso para quem anda de moto.',
        commonMistake: 'Muita gente pensa que s\u00F3 o passageiro \u00E9 respons\u00E1vel ou que \u00E9 uma infra\u00E7\u00E3o leve.',
        tip: 'Lixo na estrada = multa m\u00E9dia.',
        incidence: 'alta',
        difficulty: 2,
        legalBase: 'Art. 190 do CTB',
        memoryHook: 'Lixo na estrada = multa m\u00E9dia.',
        trap: true
    },
    {
        id: 'me_n2_001',
        category: 'legislacao',
        statement: "O sistema de lubrificação do motor evita o atrito direto entre as peças móveis em movimento. A circulação do veículo com nível de óleo severamente baixo, sem reposição imediata, provoca, como principal consequência mecânica:",
        options: [
            "Superaquecimento por atrito, podendo fundir o motor e danificar o bloco.",
            "Aumento do consumo, sem risco mecânico para o conjunto.",
            "Redução do desgaste das velas de ignição.",
            "Travamento das pastilhas de freio traseiras."
        ],
        correctIndex: 0,
        explanation: '\u00D3leo baixo causa atrito e pode fundir o motor.',
        detailedExplanation: 'Quando o n\u00EDvel de \u00F3leo t\u00E1 baixo, as pe\u00E7as do motor se esfregam e esquentam demais. Isso pode acabar fundindo o motor e causando um estrago enorme. Checar o n\u00EDvel de \u00F3leo sempre \u00E9 uma boa pr\u00E1tica pra evitar problemas.',
        commonMistake: 'Muita gente acha que s\u00F3 precisa de \u00F3leo na hora da troca, mas o n\u00EDvel deve ser checado sempre.',
        tip: '\u00D3leo baixo = Motor quente.',
        incidence: 'alta',
        difficulty: 2,
        legalBase: 'Art. 29 do CTB',
        memoryHook: '\u00D3leo baixo = Motor quente.',
        trap: true
    },
    {
        id: 'pr_n1_001',
        category: 'legislacao',
        statement: "Veículo de emergência aproxima-se com sirene e dispositivos luminosos vermelhos intermitentes acionados em serviço de urgência. Segundo as normas de circulação do CTB, essa condição confere ao veículo de emergência prioridade:",
        options: [
            "Absoluta de passagem, devendo os demais veículos abrir caminho pela direita.",
            "Apenas quando se tratar de viatura da Polícia Militar.",
            "Somente durante o período noturno, das 22h às 6h.",
            "Nenhuma, devendo o veículo de emergência obedecer estritamente aos sinais."
        ],
        correctIndex: 0,
        explanation: 'Ve\u00EDculo de emerg\u00EAncia com sirene e giroflex tem prioridade total.',
        detailedExplanation: 'Quando uma ambul\u00E2ncia, viatura ou caminh\u00E3o de bombeiros est\u00E1 com os sinais ligados, eles t\u00EAm que passar primeiro. Todo mundo deve encostar \u00E0 direita pra deixar o caminho livre.',
        commonMistake: 'Muita gente acha que pode continuar dirigindo normalmente, mas precisa parar e dar passagem.',
        tip: 'Emerg\u00EAncia = Abra caminho!',
        incidence: 'alta',
        difficulty: 1,
        legalBase: 'Art. 29 do CTB',
        memoryHook: 'Emerg\u00EAncia = Abra caminho!',
        trap: true
    },
    {
        id: 'me_n2_002',
        category: 'legislacao',
        statement: "O condutor trafega com pneus cuja profundidade de sulcos está abaixo do limite legal de 1,6 mm. Considerando a segurança da circulação e a física do veículo automotor, esse desgaste expõe o condutor principalmente ao risco de:",
        options: [
            "Perda de aderência em pista molhada, aquaplanagem e aumento da distância de frenagem.",
            "Redução do consumo de combustível por maior aderência.",
            "Desalinhamento imediato da direção em pista seca.",
            "Bloqueio das rodas por fadiga do sistema de suspensão."
        ],
        correctIndex: 0,
        explanation: 'Pneu careca faz voc\u00EA escorregar na chuva e demora mais pra parar.',
        detailedExplanation: 'Os sulcos dos pneus ajudam a drenar a \u00E1gua. Sem eles, o pneu perde contato com o ch\u00E3o, o que pode causar aquaplanagem. Por isso, andar com pneu careca \u00E9 uma infra\u00E7\u00E3o grave.',
        commonMistake: 'Muita gente acha que s\u00F3 \u00E9 perigoso em pista molhada, mas o risco existe sempre.',
        tip: 'Pneu careca = Perigo na chuva!',
        incidence: 'alta',
        difficulty: 2,
        legalBase: 'Art. 29 do CTB',
        memoryHook: 'Pneu careca = Perigo na chuva!',
        trap: true
    },
    {
        id: 'pr_n1_002',
        category: 'legislacao',
        statement: "Em trecho de aclive ou declive com pista de rolamento estreita, onde não há espaço para a passagem simultânea de dois veículos em sentidos opostos, a preferência de passagem prevista no CTB é do veículo:",
        options: [
            "Que está subindo, devendo o que desce dar passagem.",
            "Que está descendo, por possuir maior velocidade natural.",
            "De maior porte e maior peso bruto total.",
            "Que primeiro acionar a buzina para sinalizar a intenção."
        ],
        correctIndex: 0,
        explanation: 'Quem sobe tem prioridade na ladeira.',
        detailedExplanation: 'Quando a ladeira \u00E9 estreita e n\u00E3o d\u00E1 pra passar dois carros, quem t\u00E1 subindo tem a vez. O carro que desce precisa recuar porque \u00E9 mais complicado pra quem sobe fazer isso.',
        commonMistake: 'Muita gente acha que quem desce tem prioridade, mas n\u00E3o \u00E9 assim.',
        tip: 'Subindo = Passa; Descendo = Recua.',
        incidence: 'alta',
        difficulty: 1,
        legalBase: 'Art. 29 do CTB',
        memoryHook: 'Subindo = Passa; Descendo = Recua.',
        trap: true
    },
    {
        id: 'me_n1_002',
        category: 'legislacao',
        statement: "O condutor mantém em circulação pneus com profundidade de sulcos abaixo de 1,6 mm, valor que caracteriza a banda de rodagem careca segundo a regulamentação. Essa condição aumenta principalmente o risco de:",
        options: [
            "Aquaplanagem e aumento da distância de frenagem em pista molhada.",
            "Redução do consumo de combustível em vias planas.",
            "Melhora da aderência em curvas de raio fechado.",
            "Travamento mecânico das rodas dianteiras em frenagens leves."
        ],
        correctIndex: 0,
        explanation: 'Pneu careca aumenta o risco de aquaplanagem e faz voc\u00EA precisar frear mais longe.',
        detailedExplanation: 'Quando os sulcos do pneu ficam abaixo de 1,6 mm, ele n\u00E3o consegue drenar a \u00E1gua da pista, o que pode levar \u00E0 aquaplanagem. Al\u00E9m disso, a dist\u00E2ncia que voc\u00EA precisa para parar aumenta, o que \u00E9 perigoso. Rodar com pneu careca \u00E9 uma infra\u00E7\u00E3o grave.',
        commonMistake: 'Muita gente acha que s\u00F3 pneu furado \u00E9 problema, mas pneu careca tamb\u00E9m \u00E9 perigoso.',
        tip: 'Pneu careca = Aquaplanagem e mais dist\u00E2ncia pra parar.',
        incidence: 'alta',
        difficulty: 1,
        legalBase: 'Art. 29 do CTB',
        memoryHook: 'Pneu careca = Aquaplanagem e mais dist\u00E2ncia pra parar.',
        trap: true
    },
    {
        id: 'pl_n1_001',
        category: 'legislacao',
        statement: "A placa de regulamentação R-1, de parada obrigatória, é reconhecida pelos condutores por seu formato característico definido no Manual Brasileiro de Sinalização de Trânsito. Esse formato preconizado pelas normas do CONTRAN é:",
        options: [
            "Octogonal (oito lados), de fundo vermelho com a inscrição PARE.",
            "Circular, de fundo branco com orla vermelha.",
            "Losangular, de fundo amarelo com símbolo preto.",
            "Retangular, de fundo azul com símbolo branco."
        ],
        correctIndex: 0,
        explanation: 'A placa PARE (R-1) tem oito lados.',
        detailedExplanation: 'Ela pede que o motorista pare completamente antes de seguir. \u00C9 a \u00FAnica placa de tr\u00E2nsito que \u00E9 octogonal, diferente da placa \'D\u00EA a Prefer\u00EAncia\', que tem formato triangular.',
        commonMistake: 'Muita gente confunde com outras placas que n\u00E3o exigem parada total.',
        tip: 'Placa octogonal = Parada obrigat\u00F3ria.',
        incidence: 'alta',
        difficulty: 1,
        legalBase: 'Art. 29 do CTB',
        memoryHook: 'Placa octogonal = Parada obrigat\u00F3ria.',
        trap: true
    },
    {
        id: 'pr_n2_001',
        category: 'legislacao',
        statement: "Ambulância em serviço de urgência aproxima-se em via urbana de fluxo intenso com sirene e luzes vermelhas intermitentes acionadas. Conforme as normas do CTB, esse veículo de socorro e salvamento goza de:",
        options: [
            "Prioridade absoluta de passagem, devendo os demais condutores encostar à direita.",
            "Prioridade exclusivamente quando se tratar de viatura da Polícia Militar.",
            "Nenhuma prioridade fora dos trechos de rodovia.",
            "Prioridade restrita aos finais de semana e feriados."
        ],
        correctIndex: 0,
        explanation: 'Ambul\u00E2ncia com sirene e luzes vermelhas = prioridade absoluta.',
        detailedExplanation: 'Quando a ambul\u00E2ncia est\u00E1 com os sinais ligados, ela tem que passar na frente de todo mundo. Se n\u00E3o tiver os sinais, j\u00E1 era, ela n\u00E3o tem mais essa prioridade.',
        commonMistake: 'Muita gente acha que pode ignorar a ambul\u00E2ncia se estiver em um lugar apertado.',
        tip: 'Sinal ligado = Passagem garantida.',
        incidence: 'alta',
        difficulty: 2,
        legalBase: 'Art. 29 do CTB',
        memoryHook: 'Sinal ligado = Passagem garantida.',
        trap: true
    },
    {
        id: 'pr_n2_002',
        category: 'legislacao',
        statement: "Dois veículos pesados aproximam-se em sentidos opostos de trecho estreito em aclive ou declive, sem pavimento e sem sinalização. Conforme as regras gerais de preferência do CTB, a passagem nesse trecho pertence ao veículo que:",
        options: [
            "Está subindo, devendo o que desce recuar e dar passagem.",
            "Está descendo, por desenvolver maior energia cinética.",
            "Sinalizou primeiro com toques de buzina.",
            "Possui menor peso bruto total."
        ],
        correctIndex: 0,
        explanation: 'Quem t\u00E1 subindo tem a prefer\u00EAncia na ladeira estreita.',
        detailedExplanation: 'O CTB diz que quem sobe leva vantagem porque \u00E9 complicado e arriscado voltar na subida. Ent\u00E3o, quem desce precisa dar r\u00E9 at\u00E9 um lugar seguro.',
        commonMistake: 'Muita gente acha que quem desce tem prioridade, mas n\u00E3o \u00E9 assim.',
        tip: 'Subindo = Prefer\u00EAncia!',
        incidence: 'alta',
        difficulty: 2,
        legalBase: 'Art. 29 do CTB',
        memoryHook: 'Subindo = Prefer\u00EAncia!',
        trap: true
    },
    {
        id: 'pl_n2_001',
        category: 'legislacao',
        statement: "O condutor, ao avaliar a sinalização vertical de regulamentação prevista no Manual Brasileiro de Sinalização de Trânsito do CONTRAN, deve reconhecer que a placa PARE (R-1) possui as seguintes características:",
        options: [
            "Formato octogonal; exige parada total obrigatória antes de prosseguir.",
            "Formato circular com orla vermelha; apenas recomenda redução da velocidade.",
            "Formato losangular amarelo; alerta para perigo iminente na via.",
            "Formato retangular azul; indica serviço público nas proximidades."
        ],
        correctIndex: 0,
        explanation: 'A placa PARE (R-1) \u00E9 de formato octogonal e manda parar totalmente antes de seguir.',
        detailedExplanation: 'Essa placa \u00E9 bem clara: voc\u00EA precisa parar antes da faixa de reten\u00E7\u00E3o, olhar se t\u00E1 tudo tranquilo e s\u00F3 depois seguir. Ignorar essa placa \u00E9 uma infra\u00E7\u00E3o grav\u00EDssima.',
        commonMistake: 'Muita gente acha que pode s\u00F3 reduzir a velocidade, mas precisa parar mesmo.',
        tip: 'Parar = Olhar = Prosseguir!',
        incidence: 'alta',
        difficulty: 2,
        legalBase: 'Art. 29 do CTB',
        memoryHook: 'Parar = Olhar = Prosseguir!',
        trap: true
    },
    {
        id: 'pl_n2_002',
        category: 'legislacao',
        statement: "Na sinalização vertical prevista no Manual Brasileiro de Sinalização de Trânsito do CONTRAN, as placas de regulamentação, em sua maioria, apresentam padrão cromático e geométrico uniforme. Esse padrão é:",
        options: [
            "Circulares, fundo branco, orla e tarja vermelhas e símbolo preto (impõem obrigações e proibições).",
            "Losangulares, fundo amarelo e símbolo preto (alertam para perigos).",
            "Retangulares, fundo azul e símbolo branco (indicam serviços e destinos).",
            "Triangulares invertidas, fundo vermelho e símbolo branco (indicam preferência)."
        ],
        correctIndex: 0,
        explanation: 'As placas de regulamenta\u00E7\u00E3o s\u00E3o redondas, com fundo branco e borda vermelha.',
        detailedExplanation: 'Elas t\u00EAm um formato circular, com fundo branco, borda e tarja vermelha e s\u00EDmbolo preto, que mostram ordens e proibi\u00E7\u00F5es. Tem algumas exce\u00E7\u00F5es, como a placa PARE, que \u00E9 octogonal, e a placa \'D\u00EA a Prefer\u00EAncia\', que \u00E9 triangular, mas ainda assim s\u00E3o de regulamenta\u00E7\u00E3o.',
        commonMistake: 'Muita gente confunde as formas das placas e esquece das exce\u00E7\u00F5es.',
        tip: 'Placa redonda = Ordem ou proibi\u00E7\u00E3o!',
        incidence: 'alta',
        difficulty: 2,
        legalBase: 'Art. 29 do CTB',
        memoryHook: 'Placa redonda = Ordem ou proibi\u00E7\u00E3o!',
        trap: true
    },
    {
        id: 'pl_n1_002',
        category: 'legislacao',
        statement: "O condutor, ao consultar o Manual Brasileiro de Sinalização de Trânsito do CONTRAN, identifica que as placas de formato circular, fundo branco e orla vermelha pertencem à classe de sinalização vertical:",
        options: [
            "Regulamentação, que impõem obrigações e proibições.",
            "Advertência, que alertam sobre perigos potenciais na via.",
            "Indicação, que informam serviços e destinos aos condutores.",
            "Educação, que orientam o comportamento dos usuários."
        ],
        correctIndex: 0,
        explanation: 'C\u00EDrculo vermelho significa que tem regra pra seguir.',
        detailedExplanation: 'As placas de regulamenta\u00E7\u00E3o (s\u00E9rie R) s\u00E3o redondas, com fundo branco e borda vermelha, e elas mandam voc\u00EA fazer ou n\u00E3o fazer algo. J\u00E1 as placas em losango amarelo avisam e as retangulares azuis indicam informa\u00E7\u00F5es.',
        commonMistake: 'Muita gente confunde com placas de aviso que n\u00E3o t\u00EAm obriga\u00E7\u00E3o.',
        tip: 'Regra = Placa redonda.',
        incidence: 'alta',
        difficulty: 1,
        legalBase: 'Art. 29 do CTB',
        memoryHook: 'Regra = Placa redonda.',
        trap: true
    },
    {
        id: 'detran_ilum_001_alta',
        category: 'mecanica',
        statement: "Durante a circulação noturna, o condutor depende de um conjunto de equipamentos para garantir a visibilidade da pista de rolamento e sinalizar suas manobras aos demais condutores. Esse conjunto corresponde ao sistema:",
        options: [
            "Sistema de Transmissão e Rodagem do veículo.",
            "Sistema de Iluminação e Sinalização do veículo.",
            "Sistema de Suspensão e Arrefecimento do motor.",
            "Sistema Elétrico de Partida e Ignição do motor."
        ],
        correctIndex: 1,
        explanation: 'O sistema de iluminação e sinalização ilumina a via e avisa sobre manobras aos outros motoristas.',
        detailedExplanation: 'O sistema de iluminação (faróis, lanternas) e sinalização (setas, luz de freio, luz de ré) tem função dupla: dar visibilidade ao condutor no escuro e alertar outros usuários da via sobre as intenções de manobra.',
        legalBase: 'Art. 40 e Art. 224 do CTB',
        commonMistake: 'Confundir sistema de iluminação/sinalização com o sistema elétrico geral de partida e ignição.',
        tip: 'Ver e ser visto: Iluminação dá visão; Sinalização avisa a manobra.',
        incidence: 'alta',
        trap: false,
        difficulty: 3
    },
    {
        id: 'detran_ilum_002_alta',
        category: 'direcao-defensiva',
        statement: "Ao conduzir à noite em via urbana dotada de iluminação pública, o condutor percebe que a luz interna de teto do veículo automotor permanece acesa durante a marcha. Sob a ótica da Direção Defensiva, o risco dessa prática é:",
        options: [
            'Aumenta o consumo de combustível por sobrecarga contínua no alternador.',
            'Gera reflexos no para-brisa e reduz a adaptação da visão ao escuro externo.',
            'Desliga automaticamente os faróis baixos por proteção eletroeletrônica.',
            'Impede o correto funcionamento das setas indicadoras no painel do carro.'
        ],
        correctIndex: 1,
        explanation: 'Luz de teto acesa à noite faz o vidro virar um espelho e impede você de ver a pista no escuro.',
        detailedExplanation: 'A luz interna do habitáculo acesa à noite cria reflexos internos no para-brisa (efeito espelho) e reduz a adaptação da pupila do condutor à escuridão da pista, diminuindo drasticamente a segurança.',
        legalBase: 'Manual de Direção Defensiva / Visibilidade',
        commonMistake: 'Achar que a luz interna serve para ajudar os outros motoristas a enxergarem o interior do seu veículo.',
        tip: 'Luz de teto acesa de noite = Vidro vira espelho e cega você para o lado de fora!',
        incidence: 'alta',
        trap: true,
        difficulty: 3
    },
    {
        id: 'detran_ilum_003_alta',
        category: 'legislacao',
        statement: 'À noite em via não iluminada, ao avistar veículo em sentido oposto ou trafegando logo à frente no mesmo sentido, o condutor deve utilizar:',
        options: [
            'Luz alta contínua, fazendo apenas o piscar momentâneo ao aproximar a menos de 50m.',
            'Luz baixa, devendo alternar da luz alta para a baixa para não ofuscar os demais condutores.',
            'Luzes de posição (farolete) associadas aos faróis de neblina para manter a visão.',
            'Pisca-alerta ligado continuamente junto com o farol baixo até que conclua o cruzamento.'
        ],
        correctIndex: 1,
        explanation: 'Pista escura pede farol alto, mas se cruzar ou seguir outro carro, mude para o farol baixo na hora.',
        detailedExplanation: 'O CTB exige o uso de luz alta em vias não iluminadas. Porém, para evitar o ofuscamento dos demais motoristas (seja quem vem de frente ou quem vai à frente pelo retrovisor), o condutor deve alternar para a luz baixa.',
        legalBase: 'Art. 40, I e Art. 223 do CTB',
        commonMistake: 'Lembrar de baixar o farol apenas para quem vem no sentido oposto, esquecendo do carro que vai logo à frente.',
        tip: 'Cruzou ou seguiu outro carro = Farol baixo imediato!',
        incidence: 'alta',
        trap: true,
        difficulty: 3
    },
    {
        id: 'detran_ilum_004_alta',
        category: 'legislacao',
        statement: "Segundo o CTB e a regulamentação vigente, o condutor de veículo que não dispõe do sistema de luz de condução diurna (DRL) deve manter aceso, durante o período diurno, em rodovia de pista simples fora do perímetro urbano:",
        options: [
            "Apenas as luzes de posição (faroletes) dianteiras.",
            "O farol baixo (ou a luz de condução diurna - DRL).",
            "O farol alto em ritmo de intermitência.",
            "As luzes de advertência do pisca-alerta."
        ],
        correctIndex: 1,
        explanation: 'Na rodovia de pista simples de dia, é obrigatório acender o farol baixo ou ter o DRL nativo.',
        detailedExplanation: 'A legislação exige o uso do farol baixo (ou DRL) durante o dia em rodovias de pista simples situadas fora dos perímetros urbanos. O uso isolado do farolete (luz de posição) é infração e não atende à exigência legal.',
        legalBase: 'Art. 40, § 2º e Art. 250, I, \'b\' do CTB',
        commonMistake: 'Acreditar que apenas o \'farolete\' (luz de posição) cumpre a exigência legal em rodovias.',
        tip: 'Dia na rodovia simples = Farol Baixo ou DRL!',
        incidence: 'alta',
        trap: true,
        difficulty: 3
    },
    {
        id: 'detran_ilum_005_alta',
        category: 'legislacao',
        statement: "As luzes indicadoras de direção (setas) do veículo integram a sinalização luminosa prevista no CTB e na sinalização do CONTRAN. Para qual finalidade específica o condutor deve acioná-las durante a circulação?",
        options: [
            "Sinalizar a intenção de realizar conversão, mudança de faixa ou ultrapassagem.",
            "Garantir a preferência de passagem ao cruzar interseções não sinalizadas.",
            "Alertar os veículos seguintes que o trânsito adiante está parado em congestionamento.",
            "Substituir o farol baixo do veículo durante a circulação em túneis iluminados."
        ],
        correctIndex: 0,
        explanation: 'A seta serve para avisar antes de virar, mudar de faixa ou realizar ultrapassagens.',
        detailedExplanation: 'As luzes de indicação de direção (setas) servem para sinalizar previamente qualquer deslocamento lateral do veículo, como conversões à esquerda/direita, mudanças de faixa e início ou término de ultrapassagens.',
        legalBase: 'Art. 35 e Art. 196 do CTB',
        commonMistake: 'Achar que acionar a seta concede prioridade ou preferência de passagem sobre os outros veículos.',
        tip: 'Seta avisa a intenção da manobra, mas NÃO dá preferência!',
        incidence: 'alta',
        trap: false,
        difficulty: 3
    },
    {
        id: 'detran_ilum_006_alta',
        category: 'infracoes',
        statement: "O condutor pretende converter à esquerda em interseção e não aciona o pisca-pisca (seta) nem faz sinal regulamentar de braço com antecedência. Pelo CTB, deixar de indicar a conversão ou a mudança de faixa constitui infração:",
        options: [
            "Infração Leve, sujeita à penalidade de advertência por escrito do órgão autuador.",
            "Infração Média, sujeita à penalidade de multa.",
            "Infração Grave, sujeita a multa e retenção do veículo para regularização.",
            "Infração Gravíssima, sujeita a recolhimento imediato da CNH."
        ],
        correctIndex: 1,
        explanation: 'Esquecer de dar a seta antes de virar ou trocar de faixa é infração de natureza MÉDIA (4 pontos).',
        detailedExplanation: 'Deixar de indicar com antecedência, mediante uso da seta ou gesto convencional de braço, a mudança de direção ou de faixa de circulação é infração Média, punida com multa (Art. 196 do CTB).',
        legalBase: 'Art. 196 do CTB',
        commonMistake: 'Achar que por ser perigoso, não dar seta se trata de infração Grave ou Gravíssima.',
        tip: 'Esqueceu da seta = Infração Média (4 pontos e multa)!',
        incidence: 'alta',
        trap: true,
        difficulty: 3
    },
    {
        id: 'detran_ilum_007_alta',
        category: 'legislacao',
        statement: "Para executar uma ultrapassagem completa e segura em rodovia de pista simples com duplo sentido de circulação, o condutor deve acionar as luzes indicadoras de direção (setas) durante as etapas da manobra da seguinte forma:",
        options: [
            "Para a esquerda durante todo o percurso, até concluir integralmente a ultrapassagem.",
            "Para a esquerda ao transpor a faixa de origem e para a direita antes de retornar à faixa original.",
            "Em conjunto com o pisca-alerta enquanto permanecer na faixa da contramão de direção.",
            "Apenas piscando o farol alto, dispensando as setas nas vias rurais."
        ],
        correctIndex: 1,
        explanation: 'Ultrapassagem exige duas setas: para a esquerda na saída e para a direita ao voltar para a sua pista.',
        detailedExplanation: 'Cada deslocamento lateral exige sinalização prévia. O motorista liga a seta para a esquerda ao ir para a faixa oposta e deve obrigatoriamente ligar a seta para a direita para avisar o retorno à sua faixa original.',
        legalBase: 'Art. 35 e Art. 196 do CTB',
        commonMistake: 'Ligar a seta só para ir para a contramão e esquecer de dar a seta para a direita ao voltar.',
        tip: 'Ultrapassagem: Seta esquerda para ir + Seta direita para voltar!',
        incidence: 'alta',
        trap: true,
        difficulty: 3
    },
    {
        id: 'detran_ilum_008_alta',
        category: 'mecanica',
        statement: "Ao acionar a seta para a esquerda, o condutor percebe que a luz indicadora no painel pisca em ritmo muito mais acelerado que o habitual, sem qualquer alteração de comando na alavanca. Esse sintoma indica:",
        options: [
            'Sobrecarga no alternador devido ao uso contínuo do sistema de ar-condicionado.',
            'Que uma das lâmpadas de seta do lado esquerdo está queimada ou com mau contato.',
            'Que o relé do pisca-alerta entrou em modo de emergência para economizar a bateria.',
            'Falha na alavanca de comando que exige desligamento imediato do painel.'
        ],
        correctIndex: 1,
        explanation: 'Seta piscando rápido no painel é sinal de que uma lâmpada daquele lado queimou lá fora.',
        detailedExplanation: 'O ritmo acelerado do pisca no painel é um aviso do sistema elétrico. Como uma das lâmpadas de seta queimou (ou está em mau contato), a resistência do circuito cai e o relé pisca no dobro da frequência.',
        legalBase: 'Manual de Manutenção Veicular e Elétrica Auto',
        commonMistake: 'Achar que é um problema geral de bateria ou defeito na chave de seta no volante.',
        tip: 'Seta rápida no painel = Lâmpada de seta queimada do lado de fora!',
        incidence: 'media',
        trap: true,
        difficulty: 3
    },
    {
        id: "detran_30q_001",
        category: "legislacao",
        statement: "Você conduz um veículo automotor em uma via urbana e observa no bordo direito da pista de rolamento uma placa octogonal de fundo vermelho com a inscrição PARE. Pela classificação geral da sinalização prevista no CTB, essa placa PARE pertence a qual modalidade de sinalização?",
        options: [
            "Vertical de Regulamentação: impõe obrigação e desrespeitar essa ordem dá infração.",
            "Dispositivos auxiliares que alertam sobre perigo imediato na via.",
            "Horizontal de Advertência que só orienta pedestre no acostamento.",
            "Semafórica de controle de fluxo que alterna a vez na interseção."
        ],
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
        options: [
            "Aproximar-se o máximo possível do bordo direito da via enquanto sinaliza a intenção.",
            "Aproximar-se do eixo central da pista para ter mais ângulo e espaço de manobra.",
            "Manter-se exatamente no centro da faixa de rolamento e desacelerar bruscamente no momento da virada.",
            "Deslocar-se para o bordo esquerdo da via antes de virar para garantir visibilidade dos veículos que vêm em sentido contrário."
        ],
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
        options: [
            "Continuar o trajeto com segurança e realizar o retorno no próximo viaduto ou alça regulamentada.",
            "Imobilizar o veículo no acostamento, acionar o pisca-alerta e efetuar a marcha à ré até o ponto da saída.",
            "Realizar uma conversão brusca cruzando as faixas de rolamento para alcançar a alça de saída antes do canteiro central.",
            "Efetuar o retorno sobre o canteiro central divisor de pistas assim que houver uma brecha no tráfego."
        ],
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
        options: [
            "Orientar e direcionar o fluxo de veículos, ordenando a circulação e proibindo o trânsito ou estacionamento sobre elas.",
            "Indicar zonas onde o estacionamento é livre para carga e descarga de mercadorias durante o horário comercial.",
            "Delimitar a área exclusiva destinada ao trânsito de ciclistas e pedestres nas interseções urbanas.",
            "Alertar sobre a proximidade de radares fixos de fiscalização eletrônica de velocidade."
        ],
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
        options: [
            "Manter os pneus do veículo constantemente calibrados de acordo com a pressão recomendada pelo fabricante.",
            "Utilizar o veículo exclusivamente com o tanque de combustível na capacidade máxima em trajetos curtos.",
            "Efetuar trocas de óleo do motor com intervalos menores que o recomendado no manual do proprietário.",
            "Trafegar sempre com as janelas abertas em velocidades acima de 100 km/h para evitar ligar o ar-condicionado."
        ],
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
        options: [
            "Evidenciar que a grande maioria dos eventos no trânsito é evitável e decorrente de falha humana (imprudência, negligência ou imperícia), desmistificando a ideia de 'obra do acaso'.",
            "Indicar que a palavra 'acidente' aplica-se exclusivamente a colisões que resultam em óbito confirmado no local.",
            "Padronizar a legislação de trânsito apenas para fins de ressarcimento do seguro obrigatório DPVAT/SPVAT.",
            "Restringir a aplicação da legislação às ocorrências registradas em rodovias federais e estaduais."
        ],
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
        statement: "As placas de sinalização vertical de Indicação que possuem fundo na cor predominantemente VERDE têm por objetivo principal:",
        options: [
            "Orientar os condutores quanto às direções, destinos, distâncias e rotas, sendo amplamente aplicadas em rodovias e vias expressas.",
            "Alertar sobre áreas de preservação ambiental e parques ecológicos nacionais.",
            "Alertar sobre perigos potenciais na via, tais como curvas acentuadas e aclives pronunciados.",
            "Indicar locais de interesse turístico, cultural ou histórico aos usuários da via."
        ],
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
        statement: "A afirmação 'No trânsito, o equilíbrio emocional é tão importante quanto o sistema de freios do veículo' expressa um princípio fundamental da Direção Defensiva. Isso significa que:",
        options: [
            "A estabilidade psíquica e o autocontrole do condutor são fatores essenciais de segurança passiva e ativa para a prevenção de sinistros.",
            "Condutores sob forte estresse emocional estão isentos de responsabilidade jurídica em caso de colisão.",
            "O estado emocional do motorista altera diretamente a resposta mecânica do sistema hidráulico de travagem.",
            "A capacidade de frenagem do veículo depende unicamente do estado das pastilhas e discos de freio."
        ],
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
        options: [
            "Manter lentes dos faróis e lanternas limpas, reguladas e em perfeito estado de funcionamento.",
            "Utilizar películas insulfilm escuras no para-brisa dianteiro acima dos limites legais para evitar o ofuscamento.",
            "Circular apenas com as luzes de posição (lanternas) acesas em rodovias durante a noite para economizar bateria.",
            "Desligar os faróis ao cruzar com outros veículos para não incomodar os motoristas no sentido oposto."
        ],
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
        options: [
            "Infração Grave, sujeita a penalidade de Multa.",
            "Infração Gravíssima, sujeita a Multa e Recolhimento da CNH.",
            "Infração Média, sujeita a Advertência por escrito apenas.",
            "Infração Leve, sem aplicação de pontos no prontuário do condutor."
        ],
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
        options: [
            "30 km/h, limite padrão das vias locais sem sinalização (Art. 61).",
            "40 km/h, limite padrão das vias coletoras urbanas.",
            "60 km/h, limite padrão das vias arteriais urbanas.",
            "80 km/h, limite padrão das vias de trânsito rápido."
        ],
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
        options: [
            "Infração Gravíssima, sujeita a penalidade de Multa e medida administrativa de Remoção do Veículo.",
            "Infração Grave, sujeita apenas a penalidade de Multa.",
            "Infração Média, com retenção do veículo até a chegada do transporte público.",
            "Permitida fora dos horários de pico, não constituindo infração de trânsito."
        ],
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
        options: [
            "Cinto de segurança, que retém o corpo e evita que o ocupante seja projetado contra a bolsa em expansão.",
            "Freio ABS, que impede o travamento das rodas durante o acionamento do airbag.",
            "Encosto de cabeça ajustado na altura do pescoço para evitar o efeito chicote no impacto lateral.",
            "Limpador de para-brisa em velocidade máxima para manter a visibilidade durante a colisão."
        ],
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
        statement: "Ao entrar em uma via de trânsito rápido ou rodovia através de uma alça de acesso, o condutor se depara com a 'faixa de aceleração'. Qual é a função técnica dessa faixa e a postura correta a adotar?",
        options: [
            "Aumentar a velocidade do veículo na faixa suplementar para equipará-la ao fluxo da via principal antes de efetuar a fusão (incorporação).",
            "Imobilizar o veículo no início da faixa e aguardar até que a via principal esteja totalmente deserta.",
            "Reduzir a velocidade para 20 km/h e buzinar para que os veículos da via principal deem passagem.",
            "Servir como acostamento temporário para parada de emergência e desembarque de passageiros."
        ],
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
        options: [
            "Infração Grave, sujeita a penalidade de Multa.",
            "Infração Gravíssima, com suspensão imediata do direito de dirigir.",
            "Infração Média, com retenção do veículo.",
            "Conduta permitida, desde que se mantenha distância de segurança de 5 metros."
        ],
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
        statement: "Sob o conceito técnico de Cidadania e Direção Defensiva, qual das seguintes opções expressa o verdadeiro perfil de um 'bom condutor'?",
        options: [
            "Aquele que cumpre rigorosamente as normas de trânsito, antecipa perigos e age com cortesia, abrindo mão de seu direito para preservar vidas.",
            "Aquele que trafega sempre no limite máximo de velocidade para não atrasar os demais condutores.",
            "Aquele que domina manobras de alta perícia em piso molhado e utiliza atalhos não regulamentados.",
            "Aquele que possui veículo moderno equipado com assistentes eletrônicos de última geração."
        ],
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
        options: [
            "Reduzir a velocidade do veículo, dar a preferência ao pedestre e aguardar a travessia com segurança.",
            "Buzinar continuamente para advertir o pedestre e manter a velocidade, pois a preferência é do veículo.",
            "Efetuar uma frenagem brusca sobre a pista e acionar o pisca-alerta imediatamente.",
            "Apressar a marcha acelerando o motor para passar antes que o pedestre tome o centro da pista."
        ],
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
        options: [
            "Infração Grave, sujeita a penalidade de Multa.",
            "Infração Gravíssima, com cassação imediata do documento de habilitação.",
            "Infração Média, sujeita apenas a advertência verbal posterior.",
            "Infração Leve, não gerando pontos no prontuário."
        ],
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
        statement: "Ao trafegar por uma via urbana, o condutor observa elementos de sinalização vertical e dispositivos temporários com fundo na cor LARANJA. Essa coloração específica indica:",
        options: [
            "Sinalização de Obras e situações temporárias na via, exigindo maior atenção e redução de velocidade.",
            "Pontos turísticos de interesse histórico e cultural na região.",
            "Locais com alto índice de travessia de escolares e crianças.",
            "Áreas de estacionamento exclusivo para veículos de emergência."
        ],
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
        options: [
            "Caminhada (deslocamento a pé), de custo financeiro zero e emissão nula de poluentes.",
            "Ciclomotores elétricos de alta velocidade, com emissão zero porém custo de aquisição.",
            "Automóveis movidos a biocombustíveis em carona compartilhada paga.",
            "Motocicletas de baixa cilindrada com combustível flex."
        ],
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
        options: [
            "Ao veículo que já estiver circulando pela rotatória.",
            "Ao veículo que se aproxima pelo lado direito do cruzamento, independentemente de estar dentro da rotatória.",
            "Ao veículo de maior de porte ou que estiver trafegando em maior velocidade.",
            "Ao veículo que pretende efetuar a conversão à esquerda no anel viário."
        ],
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
        options: [
            "Peso Bruto Total (PBT) de até 3.500 kg e lotação que não exceda a 8 lugares, excluído o do motorista.",
            "Peso Bruto Total (PBT) de até 6.000 kg e lotação de até 12 passageiros.",
            "Qualquer peso bruto total, desde que o veículo não transporte carga perigosa.",
            "Lotação máxima de até 15 passageiros, independentemente do peso do veículo."
        ],
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
        options: [
            "Seguir a ordem do Agente de Trânsito, pois suas ordens prevalecem sobre as indicações do semáforo e demais sinais.",
            "Aguardar a luz verde do semáforo, pois equipamentos eletrônicos possuem prioridade sobre ordens humanas.",
            "Imobilizar o veículo e aguardar a chegada de uma viatura policial para confirmação da ordem.",
            "Seguir as regras da placa de 'PARE' que porventura esteja afixada no local."
        ],
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
        options: [
            "Infração Média, sujeita a penalidade de Multa.",
            "Infração Grave, com retenção da CNH do condutor.",
            "Infração Gravíssima, com suspensão automática do direito de dirigir.",
            "Infração Leve, sujeita apenas a advertência pedagógica."
        ],
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
        statement: "A sinalização antecedente de manobras mediante uso de seta (luz indicadora de direção) é um dever de todo condutor. O objetivo fundamental dessa exigência legal e defensiva é:",
        options: [
            "Garantir a previsibilidade das ações do motorista, permitindo que os demais usuários da via reajam com segurança.",
            "Evitar a descarga excessiva da bateria do veículo durante deslocamentos noturnos.",
            "Garantir o direito de preferência absoluto sobre pedestres e veículos ao mudar de faixa.",
            "Cumprir uma mera formalidade administrativa sem impacto na prevenção de sinistros."
        ],
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
        options: [
            "Os veículos de maior porte são responsáveis pelos menores, os motorizados pelos não motorizados, e todos juntos pela proteção dos pedestres.",
            "Os pedestres são totalmente responsáveis por sua própria segurança, devendo ceder passagem a qualquer tipo de veículo.",
            "Veículos de transporte coletivo possuem prioridade absoluta e isenção de responsabilidade sobre ciclistas.",
            "Os veículos mais rápidos e modernos possuem preferência legal de passagem sobre os mais antigos."
        ],
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
    // ============ NÍVEL 1 – COMPACTO ============
    {
        id: "detran_q20_n1",
        category: "infracoes",
        difficulty: 1,
        statement: "Após chuva, o condutor trafega por via urbana no perímetro e atravessa poça d'água na pista de rolamento, arremessando água sobre pedestres na calçada. Pelo CTB, essa conduta é classificada como infração:",
        options: [
            "Infração média, punida com multa administrativa.",
            "Mera contravenção de mau gosto, sem enquadramento no CTB.",
            "Conduta apenas antiética, sem previsão de sanção de trânsito.",
            "Infração leve, punida exclusivamente com advertência verbal do agente."
        ],
        correctIndex: 0,
        explanation: "Jogar água de poça nos pedestres na calçada é infração média com multa.",
        detailedExplanation: "Usar o carro para jogar água ou sujeira nas pessoas na rua é infração de trânsito média e gera multa (Art. 171 do CTB).",
        legalBase: "Art. 171 do CTB",
        commonMistake: "Achar que é só falta de educação e não dá multa.",
        tip: "Jogar água no pedestre = Multa de infração média!",
        incidence: "alta",
        trap: true
    },
    {
        id: "detran_q21_n1",
        category: "primeiros-socorros",
        difficulty: 1,
        statement: "Durante o atendimento a vítimas de acidente com sangramento visível, o socorrista fica exposto ao contato direto com fluidos sanguíneos e possíveis agentes infecciosos. É aconselhável, nesse contexto, que ele:",
        options: [
            "Utilize proteção individual — luva de borracha ou material equivalente — antes do contato com a vítima.",
            "Aplique torniquete de rotina em todos os membros com ferimento sanguíneo.",
            "Aplique compressa fria sobre o ferimento para conter o fluxo sanguíneo.",
            "Execute garrote improvisado com fio metálico acima da lesão."
        ],
        correctIndex: 0,
        explanation: "Use luvas de borracha para não pegar doenças pelo sangue da vítima.",
        detailedExplanation: "Para se proteger de doenças transmitidas pelo sangue (biossegurança), use sempre luvas de borracha ou sacos plásticos antes de socorrer quem está sangrando.",
        legalBase: "Manual de Primeiros Socorros do DENATRAN",
        commonMistake: "Achar que deve fazer torniquete ou garrote em qualquer sangramento.",
        tip: "Vítima sangrando = Use luva para se proteger!",
        incidence: "alta",
        trap: false
    },
    {
        id: "detran_q23_n1",
        category: "infracoes",
        difficulty: 1,
        statement: "Em rodovia de pista simples, o condutor realiza ultrapassagem invadindo a contramão de direção exatamente sobre a faixa de travessia de pedestres e é flagrado pelo agente. Pelo CTB, essa conduta é infração de natureza:",
        options: [
            "Infração Leve, sujeita apenas a advertência por escrito.",
            "Infração Média, sujeita a multa com pontuação de 4 pontos.",
            "Infração Gravíssima, sujeita a multa com pontuação de 7 pontos na CNH.",
            "Infração Grave, sujeita a multa e retenção do veículo."
        ],
        correctIndex: 2,
        explanation: "Ultrapassar pela contramão em cima da faixa de pedestre é infração gravíssima.",
        detailedExplanation: "Passar outro carro invadindo a pista contrária (contramão) em cima da travessia de pedestres é estritamente proibido e gera infração gravíssima (Art. 203, II do CTB).",
        legalBase: "Art. 203, II do CTB",
        commonMistake: "Confundir com infração grave pelo perigo de atropelamento.",
        tip: "Ultrapassar na contramão na faixa de pedestre = Gravíssima!",
        incidence: "alta",
        trap: true
    },
    {
        id: "detran_q24_n1",
        category: "primeiros-socorros",
        difficulty: 1,
        statement: "No atendimento inicial prestado a vítima de acidente de trânsito, que pode necessitar de procedimento cirúrgico ou sedação de urgência, a conduta correta em relação à ingestão de líquidos por via oral antes do atendimento é:",
        options: [
            "Liberar a ingestão de líquidos desde que a vítima esteja lúcida e orientada.",
            "Manter a vítima em jejum absoluto até a avaliação da equipe de saúde.",
            "Oferecer água à vítima para acalmá-la durante a espera do resgate.",
            "Administrá-la em suco para evitar queda de pressão arterial."
        ],
        correctIndex: 1,
        explanation: "Deixe o ferido sem comer e sem beber nada até o médico chegar.",
        detailedExplanation: "Não dê água nem comida para o ferido (manter em jejum), pois se ele precisar de cirurgia urgente no hospital ou desmaiar, pode se engasgar (broncoaspiração).",
        legalBase: "Manual de Primeiros Socorros do DENATRAN",
        commonMistake: "Dar água para 'acalmar' a vítima assustada.",
        tip: "Vítima de acidente = Nada de água ou comida!",
        incidence: "alta",
        trap: true
    },
    {
        id: "detran_q25_n1",
        category: "mecanica",
        difficulty: 1,
        statement: "No meio do trajeto urbano, o painel acende e mantém acesa a luz indicadora de falha no sistema de arrefecimento do motor, sem vapor sob o capô. O procedimento correto do condutor diante desse alerta é:",
        options: [
            "Imobilizar o veículo e verificar o nível do óleo lubrificante do motor.",
            "Desligar o instrumento de medição de pressão para silenciar o alerta do painel.",
            "Imobilizar o veículo em local seguro e verificar o nível de líquido de arrefecimento.",
            "Prosseguir a viagem normalmente, pois o alerta dispensa atenção imediata."
        ],
        correctIndex: 2,
        explanation: "Luz de temperatura acendeu? Pare o carro e olhe a água do motor.",
        detailedExplanation: "Se o painel avisar esquentamento no sistema de resfriamento do motor (sistema de arrefecimento), pare em local seguro e confira o nível do líquido/água com o motor frio.",
        legalBase: "Manual do Condutor / Mecânica Básica",
        commonMistake: "Confundir água do arrefecimento com nível de óleo do motor.",
        tip: "Luz de arrefecimento = Parar e conferir a água!",
        incidence: "media",
        trap: false
    },
    {
        id: "detran_q26_n1",
        category: "legislacao",
        difficulty: 1,
        statement: "O pedestre aproxima-se de travessia sinalizada com o semáforo para pedestres de código SS-08, cujo sinal encontra-se aceso naquele instante. Diante dessa indicação semafórica, a atitude correta a ser adotada é:",
        options: [
            "Iniciar a travessia, pois o sinal verde autoriza o pedestre a seguir.",
            "Não ultrapassar a linha de retenção, permanecendo na calçada até a troca do sinal.",
            "Atenção apenas, cruzando com cautela independentemente da indicação.",
            "Parar o veículo em movimento para facilitar a travessia imediata."
        ],
        correctIndex: 1,
        explanation: "Sinaleiro vermelho para pedestre (SS-08) significa que você não pode atravessar.",
        detailedExplanation: "A placa/sinalização SS-08 indica o bonequinho vermelho aceso (semáforo de pedestre). O pedestre não pode atravessar a rua (não pode ultrapassar a linha de espera).",
        legalBase: "Resolução CONTRAN nº 973/2022 (Sinalização Semafórica)",
        commonMistake: "Achar que a palavra 'ultrapassar' é exclusiva para motoristas.",
        tip: "Sinal vermelho no semáforo de pedestre = Proibido atravessar!",
        incidence: "alta",
        trap: true
    },
    {
        id: "detran_q27_n1",
        category: "legislacao",
        difficulty: 1,
        statement: "Dentre as normas gerais de circulação e conduta previstas no CTB, assinale a alternativa que exprime corretamente uma das regras de conduta impostas pelo Código de Trânsito ao condutor e aos ocupantes do veículo:",
        options: [
            "Os animais isolados ou em grupos não poderão circular nas vias urbanas ou rurais.",
            "A parada para embarque de passageiros não poderá ser efetuada onde o estacionamento é proibido.",
            "O condutor e o passageiro não deverão abrir a porta sem certificar-se de que não há perigo.",
            "Em nenhuma hipótese será permitida a circulação de bicicletas nos passeios."
        ],
        correctIndex: 2,
        explanation: "Só abra a porta do carro depois de olhar se não vem vindo ninguém.",
        detailedExplanation: "Motorista e passageiros só podem abrir as portas do carro após olhar pelos espelhos e ter certeza de que não vão atingir ciclistas, pedestres ou outros carros (Art. 49 do CTB).",
        legalBase: "Art. 49 do CTB",
        commonMistake: "Achar que é permitido desembarcar rápido sem olhar se vem bicicleta ou moto.",
        tip: "Vai abrir a porta? Olhe antes para não causar acidente!",
        incidence: "alta",
        trap: false
    },
    // ============ NÍVEL 2 – INTERMEDIÁRIO ============
    {
        id: "detran_q20_n2",
        category: "infracoes",
        difficulty: 2,
        statement: "Após forte chuva, o condutor trafega por via urbana e atravessa poça d'água na pista de rolamento, arremessando água sobre pedestres na calçada com impacto. Pela regulamentação, essa conduta é considerada:",
        options: [
            "Infração de trânsito média, sujeita a penalidade de multa.",
            "Mera brincadeira de mau gosto, sem sanção de trânsito.",
            "Desrespeito moral aos pedestres, sem enquadramento legal.",
            "Infração leve, sujeita somente a advertência verbal do agente."
        ],
        correctIndex: 0,
        explanation: "Arremessar água em pedestres é infração média punida com multa de trânsito.",
        detailedExplanation: "Passar por poças d'água de propósito ou por falta de atenção espirrando água nas pessoas na calçada é infração de trânsito média (Art. 171 do CTB), gerando penalidade de multa.",
        legalBase: "Art. 171 do CTB",
        commonMistake: "Achar que por ser na calçada é apenas uma falha de postura ou infração leve.",
        tip: "Molhou pedestre com o carro = Infração Média com Multa!",
        incidence: "alta",
        trap: true
    },
    {
        id: "detran_q21_n2",
        category: "primeiros-socorros",
        difficulty: 2,
        statement: "Ao prestar o primeiro atendimento a vítima de acidente com ferimentos abertos e sangramento abundante, o socorrista fica exposto ao contato com fluidos biológicos. A recomendação técnica correta é que ele:",
        options: [
            "Utilize proteção individual — luva de borracha ou material equivalente — antes do contato com a ferida.",
            "Aplique torniquete de rotina em todos os membros com ferimento sanguíneo.",
            "Aplique compressa fria sobre o ferimento para conter o fluxo sanguíneo.",
            "Execute garrote improvisado com fio metálico acima da lesão."
        ],
        correctIndex: 0,
        explanation: "Sempre coloque luvas antes de tocar em ferimentos sangrando para sua própria proteção.",
        detailedExplanation: "Em qualquer socorro com sangramento, a primeira regra de proteção do socorrista (biossegurança) é usar luvas de borracha/látex para evitar infecção ou contágio por doenças transmitidas pelo sangue.",
        legalBase: "Manual de Primeiros Socorros do DENATRAN",
        commonMistake: "Tentar fazer garrote ou torniquete sem treinamento adequado.",
        tip: "Sangramento na vítima = Proteja-se com luvas em 1º lugar!",
        incidence: "alta",
        trap: false
    },
    {
        id: "detran_q23_n2",
        category: "infracoes",
        difficulty: 2,
        statement: "O condutor realiza a ultrapassagem de outro veículo invadindo a contramão de direção exatamente sobre a faixa destinada à travessia de pedestres, em via de trânsito. Pelo CTB, essa conduta é classificada como infração de natureza:",
        options: [
            "Infração Leve, com advertência por escrito.",
            "Infração Média, com multa e 4 pontos na CNH.",
            "Infração Gravíssima, com multa e 7 pontos na CNH.",
            "Infração Grave, com multa e retenção do veículo."
        ],
        correctIndex: 2,
        explanation: "Ultrapassar invadindo a pista contrária na faixa de pedestre é infração gravíssima.",
        detailedExplanation: "Fazer ultrapassagem pela pista contrária (contramão) em trechos perigosos como faixas de pedestres, pontes ou cruzamentos é infração de natureza gravíssima (Art. 203, II do CTB).",
        legalBase: "Art. 203, II do CTB",
        commonMistake: "Confundir a ultrapassagem proibida com infração grave.",
        tip: "Ultrapassagem na contramão em faixa de pedestre = Gravíssima!",
        incidence: "alta",
        trap: true
    },
    {
        id: "detran_q24_n2",
        category: "primeiros-socorros",
        difficulty: 2,
        statement: "Em acidente de trânsito, vítima consciente e lúcida pede um copo de água enquanto aguarda o atendimento. Considerando a possibilidade de cirurgia de urgência, a conduta correta quanto à ingestão de líquidos é:",
        options: [
            "Liberar a ingestão de líquidos desde que a vítima esteja lúcida e orientada.",
            "Manter a vítima em jejum absoluto até a avaliação da equipe de saúde.",
            "Oferecer água à vítima para acalmá-la durante a espera do resgate.",
            "Administrá-la em suco para evitar queda de pressão arterial."
        ],
        correctIndex: 1,
        explanation: "Não ofereça água ou comida; mantenha o ferido em jejum total.",
        detailedExplanation: "O ferido não deve beber nada (manter em jejum) para não se engasgar ou vomitar em caso de perda de consciência, além de não atrapalhar procedimentos com anestesia no hospital.",
        legalBase: "Manual de Primeiros Socorros do DENATRAN",
        commonMistake: "Dar água ou suco imaginando que vai ajudar a conter a queda de pressão.",
        tip: "Atendimento inicial = Vítima sempre em JEJUM!",
        incidence: "alta",
        trap: true
    },
    {
        id: "detran_q25_n2",
        category: "mecanica",
        difficulty: 2,
        statement: "Durante tráfego em via expressa, com a temperatura do motor acima da faixa normal, o painel acusa problema no sistema de arrefecimento. Considerando os riscos de dano ao motor, o procedimento correto é:",
        options: [
            "Imobilizar o veículo e verificar o nível do óleo lubrificante no cárter.",
            "Desligar o manômetro de pressão para eliminar o alerta persistente do painel.",
            "Imobilizar o veículo em local seguro e verificar o nível de líquido de arrefecimento.",
            "Prosseguir a viagem em velocidade reduzida até o próximo posto de serviço."
        ],
        correctIndex: 2,
        explanation: "Esquentou no painel? Pare o carro em local seguro e verifique o nível da água.",
        detailedExplanation: "O sistema de arrefecimento controla a temperatura do motor através da circulação de água/aditivo. Se o painel alertar superaquecimento, o correto é encostar o carro e verificar o reservatório de água.",
        legalBase: "Manual do Condutor / Mecânica Básica",
        commonMistake: "Checar o óleo do motor quando o alerta é de temperatura/arrefecimento.",
        tip: "Alerta de arrefecimento no painel = Pare e olhe o nível da água!",
        incidence: "media",
        trap: false
    },
    {
        id: "detran_q26_n2",
        category: "legislacao",
        difficulty: 2,
        statement: "No cumprimento da sinalização semafórica para pedestres prevista no Manual Brasileiro do CONTRAN, o procedimento regulamentar a ser adotado diante do sinal identificado na cartela pelo código SS-08 é:",
        options: [
            "Pode seguir, atravessando a via livremente.",
            "Não pode ultrapassar a linha de retenção enquanto o sinal estiver assim.",
            "Atenção, travessia facultativa com cautela redobrada.",
            "Pare o veículo, imobilizando o trânsito na interseção."
        ],
        correctIndex: 1,
        explanation: "Sinal SS-08 é o semáforo vermelho do pedestre; ele proíbe o pedestre de iniciar a travessia.",
        detailedExplanation: "A sinalização semafórica SS-08 representa o sinal vermelho para pedestres. Quando acesa, significa que o pedestre não pode ultrapassar a guia/linha de retenção para atravessar a pista.",
        legalBase: "Resolução CONTRAN nº 973/2022 (Sinalização Semafórica)",
        commonMistake: "Confundir com código de sinalização de trânsito de veículos.",
        tip: "Semáforo SS-08 vermelho para pedestre = Não pode atravessar!",
        incidence: "alta",
        trap: true
    },
    {
        id: "detran_q27_n2",
        category: "legislacao",
        difficulty: 2,
        statement: "Analisando as normas gerais de circulação e conduta previstas no CTB, e considerando os deveres do condutor e dos ocupantes quanto à segurança da via e à fluidez do trânsito, assinale a alternativa juridicamente correta:",
        options: [
            "Os animais isolados ou em grupos não poderão circular nas vias urbanas ou rurais.",
            "A parada para embarque de passageiros não poderá ser efetuada onde o estacionamento é proibido na via.",
            "O condutor e o passageiro não deverão abrir a porta do veículo sem antes certificar-se de que não constituem perigo para eles e demais usuários.",
            "Em nenhuma hipótese será permitida a circulação de bicicletas nos passeios."
        ],
        correctIndex: 2,
        explanation: "Verifique os retrovisores antes de abrir as portas para não atingir ninguém na via.",
        detailedExplanation: "É regra de segurança obrigatória que motoristas e passageiros só abram as portas do veículo após olhar o movimento ao redor (bordo da pista) e garantir que não causarão riscos a pedestres ou ciclistas (Art. 49 do CTB).",
        legalBase: "Art. 49 do CTB",
        commonMistake: "Achar que é proibido parar para desembarque em locais onde apenas o estacionamento é proibido.",
        tip: "Abrir a porta do carro = Olhar primeiro se não há perigo na via!",
        incidence: "alta",
        trap: false
    },
    // ============ NÍVEL 1 – COMPACTO (q28-q30) ============
    {
        id: "detran_q28_n1",
        category: "infracoes",
        difficulty: 1,
        statement: "Em trecho urbano com grande concentração e movimentação de pedestres, o condutor mantém velocidade incompatível com a segurança do trânsito, sem reduzir na aproximação da travessia. Pelo CTB, essa conduta é infração de natureza:",
        options: [
            "Infração Gravíssima, com multa multiplicada por 3.",
            "Infração Leve, com advertência por escrito.",
            "Infração Grave, com multa e pontuação na CNH.",
            "Não configura infração, apenas recomendação de direção defensiva."
        ],
        correctIndex: 2,
        explanation: "Não desacelerar o carro onde há muitos pedestres é infração grave.",
        detailedExplanation: "Deixar de reduzir a velocidade em locais com grande movimentação de pedestres coloca vidas em risco e é infração de trânsito grave (Art. 220, I do CTB).",
        legalBase: "Art. 220, I do CTB",
        commonMistake: "Confundir com infração gravíssima por achar que envolve pedestres.",
        tip: "Não reduzir a velocidade perto de pedestres = Infração Grave!",
        incidence: "alta",
        trap: true
    },
    {
        id: "detran_q29_n1",
        category: "direcao-defensiva",
        difficulty: 1,
        statement: "Durante queimadas às margens da via, a fumaça densa reduz drasticamente a visibilidade sobre a pista de rolamento em rodovia. Diante dessa condição adversa, a conduta defensiva correta do condutor deve ser:",
        options: [
            "Reduzir a velocidade e manter acesa a luz baixa do farol.",
            "Imobilizar o veículo em local seguro e aguardar o fim da queimada.",
            "Imobilizar o veículo no bordo da pista e acionar o pisca-alerta.",
            "Manter a velocidade e utilizar a luz alta do farol no trecho."
        ],
        correctIndex: 0,
        explanation: "Na fumaça, diminua a marcha e acenda a luz baixa do farol.",
        detailedExplanation: "Com pouca visibilidade provocada por fumaça de queimadas, reduza a velocidade e use a luz baixa (farol baixo), pois a luz alta causa ofuscamento ao refletir na fumaça.",
        legalBase: "Art. 40, § 1º do CTB e Manual de Direção Defensiva",
        commonMistake: "Usar farol alto achando que ilumina melhor a fumaça.",
        tip: "Fumaça na pista = Farol baixo e velocidade reduzida!",
        incidence: "alta",
        trap: false
    },
    {
        id: "detran_q30_n1",
        category: "legislacao",
        difficulty: 1,
        statement: "O dever de não obstruir a marcha normal dos veículos, sem causa justificada, integra o conjunto de normas gerais de circulação e conduta impostas pelo CTB. Esse preceito do condutor enquadra-se no conceito jurídico de:",
        options: [
            "Normas gerais de circulação e conduta.",
            "Procedimentos adotados exclusivamente nas estradas rurais.",
            "Regras de procedimento adotadas pelo condutor por opção própria.",
            "Princípios exclusivos da direção defensiva."
        ],
        correctIndex: 0,
        explanation: "Não atrapalhar o fluxo do trânsito sem motivo é uma regra das normas de circulação.",
        detailedExplanation: "O Código de Trânsito Brasileiro estabelece nas Normas Gerais de Circulação e Conduta que o condutor não deve andar devagar demais sem justificativa ou obstruir o trânsito (Art. 43 e 219 do CTB).",
        legalBase: "Art. 43 e Art. 219 do CTB",
        commonMistake: "Achar que se trata apenas de uma dica de Direção Defensiva e não de regra de lei.",
        tip: "Não segurar o trânsito sem motivo = Regra das Normas de Circulação!",
        incidence: "media",
        trap: false
    },
    // ============ NÍVEL 2 – INTERMEDIÁRIO (q28-q30) ============
    {
        id: "detran_q28_n2",
        category: "infracoes",
        difficulty: 2,
        statement: "Ao circular por trechos urbanos ou rurais com grande concentração e movimentação de pedestres, não reduzir a velocidade do veículo de forma compatível com a segurança do trânsito é considerada uma infração de natureza:",
        options: [
            "Infração de natureza gravíssima, com multa multiplicada por 3.",
            "Infração de natureza leve, com advertência por escrito.",
            "Infração de natureza grave, com multa e pontuação na CNH.",
            "Não constitui infração, mas mera recomendação de segurança."
        ],
        correctIndex: 2,
        explanation: "Diminua a velocidade na presença de pedestres; não fazer isso gera infração grave.",
        detailedExplanation: "O Art. 220, I do CTB estabelece que não adequar a velocidade em locais de trânsito ou aglomeração de pedestres constitui infração grave, punida com multa.",
        legalBase: "Art. 220, I do CTB",
        commonMistake: "Marcar gravíssima por associar o risco ao pedestre diretamente à pena máxima.",
        tip: "Locais de pedestres exige velocidade reduzida = Infração Grave!",
        incidence: "alta",
        trap: true
    },
    {
        id: "detran_q29_n2",
        category: "direcao-defensiva",
        difficulty: 2,
        statement: "A fumaça produzida por queimadas nos terrenos lindeiros à via provoca drástica redução da visibilidade em rodovia de pista simples. Diante dessa situação de risco, o procedimento correto do condutor é:",
        options: [
            "Reduzir a velocidade e manter acesa a luz baixa do farol.",
            "Imobilizar o veículo em local seguro e aguardar o término da queimada.",
            "Imobilizar o veículo no acostamento e acionar o pisca-alerta.",
            "Manter a velocidade nominal e acionar a luz alta do farol."
        ],
        correctIndex: 0,
        explanation: "Diminua o ritmo e acione o farol baixo para não ofuscar a visão na fumaça.",
        detailedExplanation: "Em condições adversas de visibilidade (fumaça/neblina), o motorista deve desacelerar e manter a luz baixa ligada. Parar na pista ou acostamento aumenta o risco de engavetamento.",
        legalBase: "Art. 40, § 1º do CTB e Manual de Direção Defensiva",
        commonMistake: "Ligar o farol alto, que reflete nas partículas de fumaça e cega o motorista.",
        tip: "Fumaça ou neblina = Luz baixa + desacelerar sem parar na pista!",
        incidence: "alta",
        trap: false
    },
    {
        id: "detran_q30_n2",
        category: "legislacao",
        difficulty: 2,
        statement: "O preceito que estabelece que o condutor não deve obstruir a marcha normal dos demais veículos, abstendo-se de trafegar em velocidade anormalmente reduzida sem causa justificada, enquadra-se no conceito de:",
        options: [
            "Normas gerais de circulação e conduta.",
            "Procedimentos adotados somente nas estradas rurais.",
            "Regras de procedimento adotadas livremente pelo condutor.",
            "Princípios exclusivos da direção defensiva."
        ],
        correctIndex: 0,
        explanation: "Faz parte das Normas Gerais de Circulação e Conduta impostas pelo CTB.",
        detailedExplanation: "As regras sobre fluxo livre, limites mínimos de velocidade (metade da máxima) e proibição de obstruir a marcha de outros veículos constituem a base das Normas Gerais de Circulação e Conduta (Art. 43 e 219 do CTB).",
        legalBase: "Art. 43 e Art. 219 do CTB",
        commonMistake: "Confundir obrigações legais de circulação com meros conselhos de direção defensiva.",
        tip: "Velocidade mínima e fluxo livre = Normas Gerais de Circulação!",
        incidence: "media",
        trap: false
    },
    {
        id: "q_sinalizacao_sinistro_03",
        category: "primeiros-socorros",
        statement: "Em caso de sinistro (acidente) em uma via onde o condutor não disponha do triângulo de segurança em quantidade suficiente ou esteja impossibilitado de usá-lo convencionalmente, qual procedimento é aceito emergencialmente para sinalizar o local?",
        options: [
            "Utilizar galhos de árvores, folhagens ou outros materiais visíveis para advertir os motoristas que se aproximam a distância segura.",
            "Abandonar o veículo no local sem sinalização até a chegada da polícia, pois qualquer improviso é proibido por lei.",
            "Utilizar exclusivamente os faróis altos dos carros que pararem para prestar socorro, dispensando sinalizações físicas na pista.",
            "Todas as alternativas anteriores estão corretas por se tratarem de exceções permitidas em rodovias federais."
        ],
        correctIndex: 0,
        explanation: "Na ausência do triângulo ou em situações de emergência extrema, o motorista deve usar o que tiver à disposição (como galhos de árvores) para sinalizar a via e evitar novos acidentes.",
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
        options: [
            "Apenas advertência por escrito, sem retenção do veículo.",
            "Multa por infração leve e retenção do veículo até a apresentação do documento.",
            "Multa por infração gravíssima e remoção imediata do veículo.",
            "Multa por infração grave com apreensão obrigatória da CNH."
        ],
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
        options: [
            "Infração média, sujeita a multa e retenção do veículo para regularização.",
            "Infração grave, sujeita a multa e remoção do veículo ao pátio.",
            "Infração gravíssima, gerando suspensão imediata do direito de dirigir.",
            "Infração leve, punida apenas com advertência por escrito na primeira ocorrência."
        ],
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
        options: [
            "Infração grave com retenção do veículo até a apresentação dos papéis.",
            "Infração gravíssima, punida com multa, apreensão e remoção do veículo ao pátio.",
            "Infração média, passível apenas de penalidade pecuniária sem remoção.",
            "Não constitui infração caso o proprietário comprove que o veículo está quitado."
        ],
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
        options: [
            "Área de preservação ambiental de acesso restrito.",
            "Pronto-socorro ou unidade hospitalar de atendimento de urgência.",
            "Oficina mecânica credenciada especializada em sistemas de frenagem.",
            "Posto de fiscalização rodoviária com balança para pesagem de veículos."
        ],
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
        options: [
            "Engatar marcha a ré imediatamente no acostamento e retornar de costas com pisca-alerta ligado.",
            "Seguir em frente com segurança e efetuar a manobra de retorno no próximo viaduto ou retorno oficial.",
            "Realizar conversão em U cruzando o canteiro central de grama para voltar à pista oposta.",
            "Parar o veículo na faixa de rolamento da direita e aguardar o fluxo diminuir."
        ],
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
        options: [
            "Para evidenciar que a grande maioria dos eventos na via é previsível e evitável por falha humana.",
            "Para isentar os fabricantes de veículos de responsabilidade civil em colisões frontais.",
            "Porque a palavra acidente juridicamente anula o pagamento do seguro obrigatório DPVAT.",
            "Para diferenciar colisões urbanas de ocorrências registradas em rodovias federais."
        ],
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
        options: [
            "Apenas sobre o condutor flagrado ao volante, ficando o proprietário isento.",
            "Sobre o proprietário do veículo, que comete infração gravíssima com multa multiplicada.",
            "Sobre ambos, aplicando-se apenas advertência verbal na primeira ocorrência do ano.",
            "Sobre crime de trânsito imputado exclusivamente ao fabricante do automóvel."
        ],
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
        id: 'q_new_01',
        category: 'legislacao',
        statement: "O candidato pretende iniciar o processo de habilitação nas categorias A (motocicletas) e B (automóveis de passeio) e consulta o requisito de idade mínimo previsto no CTB para esse processo. A idade mínima legalmente exigida é de:",
        options: [
            "16 anos, mediante emancipação e autorização dos genitores.",
            "18 anos, exigida a condição de penalmente imputável.",
            "21 anos, exigência uniforme para todas as categorias.",
            "25 anos, para habilitação com exercício de atividade remunerada."
        ],
        correctIndex: 1,
        explanation: 'A idade mínima é 18 anos para categorias A e B.',
        detailedExplanation: 'O CTB estabelece 18 anos para A/B, 21 para C, D e E.',
        legalBase: 'Art. 147 do CTB',
        commonMistake: 'Confundir com idade mínima para categorias maiores.',
        tip: '18 = A/B, 21 = C/D/E.',
        memoryHook: 'Dezoito para dirigir leve!',
        incidence: 'alta',
        difficulty: 1,
        trap: true
    },
    {
        id: 'q_new_02',
        category: 'direcao-defensiva',
        statement: "O condutor aproxima-se de curva à esquerda em pista de rolamento molhada, com redução acentuada da aderência entre os pneus e o pavimento. Pela direção defensiva e pela física da curva, a postura ideal é:",
        options: [
            "Acelerar durante a curva para sair rapidamente do trecho de baixa aderência.",
            "Reduzir a velocidade antes da entrada da curva e manter o volante firme durante a trajetória.",
            "Manter velocidade constante e acionar o freio no ápice da curva.",
            "Aplicar apenas o freio traseiro durante toda a manobra de conversão."
        ],
        correctIndex: 1,
        explanation: 'Frear antes e reduzir velocidade evita perda de aderência.',
        detailedExplanation: 'Curvas molhadas exigem redução de velocidade antecipada para não derrapar.',
        legalBase: 'Art. 218 do CTB',
        commonMistake: 'Tentar corrigir a trajetória acelerando dentro da curva.',
        tip: 'Freio antes, curva depois!',
        memoryHook: 'Mole = Slow!',
        incidence: 'alta',
        difficulty: 2,
        trap: true
    },
    {
        id: 'q_new_03',
        category: 'placas',
        statement: "O condutor trafega por via não pavimentada com declive e visualiza placa de sinalização vertical em formato losangular, fundo amarelo e símbolo preto, instalada antes de um trecho sinuoso. Pela classificação do CTB, essa placa:",
        options: [
            "Impõe obrigação ou proibição ao condutor, tratando-se de sinalização de regulamentação.",
            "Alerta para condição de perigo adiante na via, tratando-se de sinalização de advertência.",
            "Identifica destino ou serviço auxiliar, tratando-se de sinalização de indicação.",
            "Determina preferência obrigatória na interseção subsequente, pela sinalização de regulamentação."
        ],
        correctIndex: 1,
        explanation: 'Losango amarelo = advertência/perigo.',
        detailedExplanation: 'Placas de advertência têm formato losangular, fundo amarelo e símbolo preto.',
        legalBase: 'Art. 29 do CTB',
        commonMistake: 'Confundir com placa circular de regulamentação.',
        tip: 'Losango amarelo = Cuidado!',
        memoryHook: 'Amarelo = Atenção!',
        incidence: 'alta',
        difficulty: 1,
        trap: false
    },
    {
        id: 'q_new_04',
        category: 'legislacao',
        statement: "Condutor é flagrado conduzindo veículo automotor sem possuir CNH válida durante fiscalização em via urbana. Pelo CTB, a penalidade administrativa aplicável ao condutor e a medida cabível sobre o veículo são:",
        options: [
            "Advertência por escrito, sem qualquer multa ou medida sobre o veículo.",
            "Multa multiplicada por três (gravíssima) e retenção do veículo até a apresentação de condutor habilitado.",
            "Suspensão imediata do direito de dirigir por seis meses.",
            "Nenhuma penalidade, caso o veículo esteja licenciado e quitado."
        ],
        correctIndex: 1,
        explanation: 'Infração gravíssima com multa e retenção.',
        detailedExplanation: 'Dirigir sem habilitação é infração gravíssima conforme CTB.',
        legalBase: 'Art. 162 do CTB',
        commonMistake: 'Pensar que é apenas multa leve.',
        tip: 'Sem CNH = grave!',
        memoryHook: 'Sem documento, sem volante!',
        incidence: 'media',
        difficulty: 3,
        trap: true
    },
    {
        id: 'q_new_05',
        category: 'direcao-defensiva',
        statement: "Em rodovia com pista de rolamento molhada, o condutor pretende ultrapassar veículo que trafega à sua frente no mesmo sentido. Pela direção defensiva e pelo CTB, o cuidado essencial durante essa manobra é:",
        options: [
            "Aproximar-se bastante do veículo ultrapassado para reduzir o tempo de exposição na contramão.",
            "Aumentar a distância de segurança e evitar que os pneus arremessem jatos de água sobre o veículo.",
            "Utilizar a buzina de forma constante durante toda a transposição de faixa.",
            "Ignorar a condição da pista, pois a manobra não altera a aderência."
        ],
        correctIndex: 1,
        explanation: 'Distância maior reduz risco de aquaplanagem.',
        detailedExplanation: 'Ultrapassar em pista molhada exige mais espaço e cuidado com jatos de água.',
        legalBase: 'Art. 218 do CTB',
        commonMistake: 'Ultrapassar rapidamente sem considerar a aderência.',
        tip: 'Molhado = Mais espaço!',
        memoryHook: 'Água no chão, distância no ar!',
        incidence: 'media',
        difficulty: 2,
        trap: true
    },
    {
        id: 'q_new_06',
        category: 'placas',
        statement: "Em via de trânsito rápido, o condutor visualiza placa retangular de fundo azul com símbolo branco, indicando localização de posto de combustível adiante. Pela classificação da sinalização vertical do CTB, a função dessa placa é:",
        options: [
            "Impor proibição ou obrigação de conduta ao condutor, caracterizando sinalização de regulamentação.",
            "Identificar serviço auxiliar e orientar o condutor quanto à disponibilidade adiante na via.",
            "Alertar para condição potencialmente perigosa na pista de rolamento.",
            "Regulamentar a velocidade máxima admitida naquele trecho da via."
        ],
        correctIndex: 1,
        explanation: 'Retangular azul = indicação/de serviço.',
        detailedExplanation: 'Placas de indicação são retangulares, de fundo azul, com símbolo branco, informando serviços.',
        legalBase: 'Art. 29 do CTB',
        commonMistake: 'Confundir com placa de regulamentação circular.',
        tip: 'Azul = Informação!',
        memoryHook: 'Azul = Serviço!',
        incidence: 'media',
        difficulty: 2,
        trap: false
    },
    {
        id: 'q_new_07',
        category: 'legislacao',
        statement: "O condutor consulta a classificação das infrações de trânsito prevista no CTB para saber o conjunto de sanções aplicável a cada natureza. A infração de natureza GRAVE, segundo a classificação legal, é caracterizada por:",
        options: [
            "Aplicação exclusivamente de multa, sem pontuação nem outras medidas.",
            "Multa, pontuação de 5 pontos na CNH e possibilidade de suspensão do direito de dirigir.",
            "Aplicação exclusivamente de advertência por escrito.",
            "Ausência de qualquer penalidade administrativa prevista em lei."
        ],
        correctIndex: 1,
        explanation: 'Grave: multa, 5 pontos e pode levar à suspensão.',
        detailedExplanation: 'Infrações graves acumulam pontos e podem resultar em suspensão da CNH.',
        legalBase: 'Art. 259 do CTB',
        commonMistake: 'Achar que grave e gravíssima têm a mesma penalidade.',
        tip: 'Grave = 5 pontos!',
        memoryHook: 'Grave = Cinco!',
        incidence: 'alta',
        difficulty: 2,
        trap: true
    },
    {
        id: 'q_new_08',
        category: 'direcao-defensiva',
        statement: "Em rodovia, condutor segue outro veículo em condições ideais de clima e pista e precisa estabelecer a distância de seguimento pela regra prática de tempo. A distância mínima de segurança recomendada é de:",
        options: [
            "1 segundo de intervalo, medido entre a passagem dos veículos por um ponto fixo.",
            "2 segundos de intervalo, contados entre a passagem do veículo precedente e a do próprio veículo.",
            "4 segundos de intervalo, contados entre a passagem dos veículos por um ponto fixo.",
            "10 segundos de intervalo, exigidos para qualquer velocidade praticada na via."
        ],
        correctIndex: 1,
        explanation: 'Recomenda-se pelo menos 2 segundos de distância.',
        detailedExplanation: 'A regra dos 2 segundos permite tempo de reação em condições normais.',
        legalBase: 'Art. 218 do CTB',
        commonMistake: 'Usar apenas 1 segundo, que é insuficiente.',
        tip: '2 segundos = tempo de reação!',
        memoryHook: 'Dois, não um!',
        incidence: 'alta',
        difficulty: 1,
        trap: false
    },
    {
        id: 'q_new_09',
        category: 'placas',
        statement: "Ao se aproximar de trecho com carga e descarga em via do perímetro urbano, o condutor identifica placa de regulamentação circular, com fundo branco, orla vermelha e faixa horizontal no centro. Essa placa significa:",
        options: [
            "Parada obrigatória com imobilização total antes da linha de retenção.",
            "Vedação exclusiva de estacionamento, admitindo parada breve para embarque.",
            "Proibição total de parada e estacionamento no trecho sinalizado.",
            "Velocidade máxima permitida para o trecho da via."
        ],
        correctIndex: 2,
        explanation: 'Faixa branca horizontal em vermelho = proibido parar/estacionar.',
        detailedExplanation: 'Placa circular vermelha com faixa branca horizontal proíbe parar e estacionar.',
        legalBase: 'Art. 29 do CTB',
        commonMistake: 'Confundir com placa de velocidade máxima.',
        tip: 'Faixa branca = Não pare!',
        memoryHook: 'Vermelho + faixa = Não fique!',
        incidence: 'media',
        difficulty: 2,
        trap: true
    },
    {
        id: 'q_new_10',
        category: 'legislacao',
        statement: "Condutor pretende circular com veículo automotor nas vias terrestres e consulta a legislação sobre documentos obrigatórios. Pelo CTB e pelas resoluções do CONTRAN, o conjunto documental exigido para a circulação regular é:",
        options: [
            "Somente a CNH, pois o licenciamento é consultado eletronicamente.",
            "CNH (ou PPD) e CRLV-e, além da regularidade do licenciamento e do recolhimento do IPVA.",
            "Somente o comprovante de seguro obrigatório vigente.",
            "Nenhum documento, desde que o veículo esteja em perfeitas condições."
        ],
        correctIndex: 1,
        explanation: 'Devem-se portar CNH, CRLV e estar em dia com impostos.',
        detailedExplanation: 'É obrigatório portar CNH, Certificado de Registro e Licenciamento e cumprir obrigações tributárias.',
        legalBase: 'Art. 120 do CTB',
        commonMistake: 'Esquecer do CRLV e da regularidade do veículo.',
        tip: 'CNH + CRLV = ok!',
        memoryHook: 'Carteira e documento do carro!',
        incidence: 'alta',
        difficulty: 1,
        trap: false
    },
    {
        id: 'q_new_11',
        category: 'direcao-defensiva',
        statement: "Durante a condução noturna, o condutor enfrenta condições de iluminação reduzida que alteram a percepção de profundidade e de dimensão dos objetos na via. Nesse período, o principal fator de risco aumentado é:",
        options: [
            "O aumento generalizado da visibilidade do condutor sobre a pista de rolamento.",
            "A menor percepção de distância e de velocidade dos demais veículos.",
            "A redução do volume de tráfego, que gera excesso de confiança.",
            "A queda de temperatura, que melhora a aderência dos pneus."
        ],
        correctIndex: 1,
        explanation: 'À noite reduz a percepção de distância e velocidade.',
        detailedExplanation: 'A escuridão limita a visão periférica e dificulta avaliar distância e velocidade relativa.',
        legalBase: 'Art. 218 do CTB',
        commonMistake: 'Achar que menos trânsito significa mais segurança automática.',
        tip: 'Noite = Percepção baixa!',
        memoryHook: 'Escuro = Cuidado duplo!',
        incidence: 'alta',
        difficulty: 2,
        trap: true
    },
    {
        id: "td_01",
        category: "direcao-defensiva",
        statement: "Em via urbana de trânsito rápido com neblina ou cerração densa, a visibilidade do condutor fica severamente comprometida. Pela direção defensiva e pelo CTB, a conduta correta do condutor para evitar sinistro é:",
        options: [
            "Manter os faróis baixos acesos e aumentar a distância de seguimento.",
            "Reduzir a velocidade aos poucos, sem freadas bruscas.",
            "Não ligar o pisca-alerta com o veículo em movimento na pista.",
            "Todas as alternativas acima estão corretas."
        ],
        correctIndex: 3,
        explanation: 'Com cerração: farol baixo, mais distância, sem freada brusca e sem pisca-alerta andando.',
        incidence: "alta",
        difficulty: 2
    },
    {
        id: "td_02",
        category: "legislacao",
        statement: "Em interseção sem sinalização dentro do perímetro urbano, aplicam-se as regras gerais de preferência do CTB, incluindo a exceção das rotatórias e a regra das vias com rodovia. A respeito da preferência de passagem, é correto afirmar:",
        options: [
            "A preferência pertence ao veículo que se aproxima pela direita do condutor no cruzamento.",
            "Na interseção entre rodovia e outra via, a preferência é de quem trafega pela rodovia.",
            "Na rotatória, a preferência é de quem já circula pelo anel viário.",
            "Todas as alternativas acima estão corretas."
        ],
        correctIndex: 3,
        explanation: 'Preferência: direita, rodovia sobre via e quem já está na rotatória.',
        incidence: "alta",
        difficulty: 2
    },
    {
        id: "td_03",
        category: "direcao-defensiva",
        statement: "Condutor pretende executar transposição de faixa em via arterial de fluxo intenso, com veículos na faixa adjacente. O que é obrigatório antes e durante essa mudança de faixa pela direção defensiva e pelo CTB?",
        options: [
            "Sinalizar antes com a seta de direção.",
            "Checar retrovisores e o ponto cego do veículo.",
            "Dar preferência a quem já está na faixa pretendida.",
            "Todas as alternativas acima estão corretas."
        ],
        correctIndex: 3,
        explanation: 'Mudar de faixa: seta antes, espelho + ponto cego e preferência de quem já está lá.',
        incidence: "alta",
        difficulty: 2
    },
    {
        id: "td_04",
        category: "legislacao",
        statement: "Em rodovia de pista dupla sem sinalização específica que regule a manobra, o condutor pretende ultrapassar veículo em movimento na pista de rolamento. Pelo CTB, a respeito dessa ultrapassagem, é correto afirmar:",
        options: [
            "A ultrapassagem deve ser efetuada sempre pela esquerda da pista de rolamento.",
            "O retorno à faixa de origem só pode ocorrer com distância segura do veículo ultrapassado.",
            "O condutor deve sinalizar a intenção com antecedência aos demais usuários da via.",
            "Todas as alternativas acima estão corretas."
        ],
        correctIndex: 3,
        explanation: 'Ultrapassagem: pela esquerda, sinaliza antes e volta só com segurança.',
        incidence: "alta",
        difficulty: 2
    },
    {
        id: "td_05",
        category: "legislacao",
        statement: "Para estacionar o veículo junto ao bordo da pista em vias coletoras urbanas, o condutor deve observar as normas gerais de estacionamento previstas no CTB. A respeito dessas exigências, é correto afirmar:",
        options: [
            "Manter no mínimo 5 metros de distância do bordo da via transversal.",
            "Não obstruir a pista nem comprometer a visibilidade em cruzamentos.",
            "Manobrar no sentido do fluxo, paralelo ao meio-fio, e sempre na marcha à frente.",
            "Todas as alternativas acima estão corretas."
        ],
        correctIndex: 3,
        explanation: 'Estacionar: 5 m da transversal, sem travar a via e no sentido do fluxo.',
        incidence: "media",
        difficulty: 2
    },
    {
        id: "td_06",
        category: "infracoes",
        statement: "Em descida longa de declive acentuado em rodovia, o condutor pretende economizar combustível durante o trajeto de descida. Entre as condutas listadas, a que comete infração e compromete a segurança é:",
        options: [
            "Descer em ponto morto (banguela) para economizar combustível.",
            "Desligar o motor na descida, ficando sem freio e direção assistidos.",
            "Manter o câmbio em neutro e frear somente em cima da hora.",
            "Todas as alternativas acima estão corretas."
        ],
        correctIndex: 3,
        explanation: 'Banguela de qualquer jeito é infração: sem freio motor o carro ganha velocidade e o freio superaquece.',
        incidence: "media",
        difficulty: 2
    },
    {
        id: "td_07",
        category: "legislacao",
        statement: "Em trecho de aclive em rodovia de pista simples com duplo sentido, o condutor avalia as condições que autorizam a ultrapassagem segundo o CTB. A respeito das condições que autorizam essa manobra de ultrapassagem, é correto afirmar:",
        options: [
            "A sinalização horizontal com linha amarela seccionada na sua mão de direção autoriza a manobra.",
            "A ultrapassagem exige visibilidade total à frente e ausência de veículos em sentido oposto.",
            "É permitida em trechos com faixa adicional exclusiva para veículos lentos.",
            "Todas as alternativas acima estão corretas."
        ],
        correctIndex: 3,
        explanation: 'No aclive só ultrapassa com faixa permitida, visão total ou faixa extra.',
        incidence: "media",
        difficulty: 2
    },
    {
        id: "td_08",
        category: "legislacao",
        statement: "Sem faixa de pedestres nas proximidades, no perímetro urbano, o pedestre precisa atravessar a pista de rolamento em trajeto livre. Pelo CTB, a respeito dessa travessia livre de pedestres pela pista, é correto afirmar que:",
        options: [
            "A travessia deve ocorrer em sentido perpendicular ao eixo da via.",
            "O pedestre deve escolher o caminho mais curto, sem permanecer sobre a pista.",
            "O pedestre deve dar prioridade aos veículos que se aproximem do local.",
            "Todas as alternativas acima estão corretas."
        ],
        correctIndex: 3,
        explanation: 'Sem faixa: atravessa em 90 graus, sem parar na pista e com carro perto a vez é dele.',
        legalBase: "Arts. 69 e 70 do CTB",
        incidence: "alta",
        difficulty: 2
    },
    {
        id: "td_09",
        category: "legislacao",
        statement: "O condutor pretende parar ou estacionar nas proximidades de cruzamentos e vias transversais no perímetro urbano. Pelo CTB, é correto afirmar o seguinte a respeito das vedações aplicáveis a esses locais:",
        options: [
            "É proibido parar ou estacionar a menos de 5 metros do bordo da via transversal.",
            "É proibido quando a manobra comprometer a visibilidade na interseção.",
            "É proibido sobre a área de cruzamento das vias.",
            "Todas as alternativas acima estão corretas."
        ],
        correctIndex: 3,
        explanation: 'Perto de cruzamento: 5 m da transversal, sem tirar visibilidade e nunca sobre o cruzamento.',
        incidence: "media",
        difficulty: 2
    },
    {
        id: "td_10",
        category: "legislacao",
        statement: "Em serviço de urgência e de operação de trânsito, certos veículos gozam de livre circulação e de estacionamento nos termos do CTB. A respeito dos veículos abrangidos por essa prerrogativa, é correto afirmar:",
        options: [
            "Os veículos de socorro de incêndio e salvamento.",
            "As ambulâncias e as viaturas policiais devidamente identificadas.",
            "Os veículos de fiscalização e operação de trânsito em serviço.",
            "Todas as alternativas acima estão corretas."
        ],
        correctIndex: 3,
        explanation: 'Em urgência: bombeiros, ambulância, polícia e fiscalização têm prioridade total.',
        legalBase: "Art. 29, VII do CTB",
        incidence: "media",
        difficulty: 1
    },
    {
        id: "td_11",
        category: "legislacao",
        statement: "O condutor pretende converter à esquerda em via urbana de mão dupla sem canteiro central, em interseção sem semáforo. Pelo CTB, a respeito da conduta correta antes e durante a manobra, é correto afirmar:",
        options: [
            "Aproximar o veículo o máximo possível da linha divisória do fluxo oposto.",
            "Acionar a luz indicadora de direção com antecedência regulamentar.",
            "Ceder a passagem aos veículos que circulem em sentido contrário.",
            "Todas as alternativas acima estão corretas."
        ],
        correctIndex: 3,
        explanation: 'Conversão à esquerda: cola na divisória, seta antes e espera o fluxo contrário.',
        incidence: "media",
        difficulty: 2
    },
    {
        id: "td_12",
        category: "legislacao",
        statement: "Na ausência de placa R-19 de regulamentação de velocidade, o CTB estabelece limites máximos padrão para cada classe de via urbana. A respeito desses limites legais estabelecidos pelo Art. 61, é correto afirmar:",
        options: [
            "80 km/h é o limite das vias de trânsito rápido do perímetro urbano.",
            "60 km/h é o limite das vias arteriais urbanas.",
            "40 km/h é o limite das vias coletoras urbanas.",
            "Todas as alternativas acima estão corretas."
        ],
        correctIndex: 3,
        explanation: 'Sem placa: trânsito rápido 80, arterial 60, coletora 40 (e local 30).',
        legalBase: "Arts. 60 e 61 do CTB",
        incidence: "altissima",
        difficulty: 2
    },
    {
        id: "td_13",
        category: "infracoes",
        statement: "Na circulação pela pista de rolamento, diversas condutas do condutor são tipificadas pelo CTB como infrações de natureza gravíssima, sujeitas a multa e pontuação. Sobre essas condutas, assinale a alternativa correta:",
        options: [
            "Andar com o veículo em calçadas, passeios e canteiros.",
            "Avançar o vermelho do semáforo ou a parada obrigatória.",
            "Andar na contramão em via de sentido único.",
            "Todas as alternativas acima estão corretas."
        ],
        correctIndex: 3,
        explanation: 'Calçada, vermelho e contramão: tudo gravíssima.',
        incidence: "media",
        difficulty: 1
    },
    {
        id: "td_14",
        category: "direcao-defensiva",
        statement: "Sob chuva forte ou cerração densa na rodovia, o condutor defensivo deve evitar condutas que agraven a baixa visibilidade e a reduzida aderência dos pneus. Entre as condutas relacionadas abaixo, ele DEVE evitar:",
        options: [
            "Farol alto, que ofusca pelo reflexo na neblina.",
            "Freada brusca sobre a pista molhada.",
            "Pisca-alerta ligado com o veículo em movimento.",
            "Todas as alternativas acima estão corretas."
        ],
        correctIndex: 3,
        explanation: 'Na chuva/cerração: sem farol alto, sem freada brusca e sem pisca andando.',
        incidence: "media",
        difficulty: 2,
        trap: true
    },
    {
        id: "td_15",
        category: "legislacao",
        statement: "O uso da buzina é disciplinado pelo CTB e pelas normas gerais de conduta, inclusive no perímetro urbano. A respeito das hipóteses em que o uso da buzina é admitido pela legislação de trânsito, é correto afirmar:",
        options: [
            "É permitida em toques breves como advertência destinada a prevenir acidentes.",
            "Fora do perímetro urbano, serve para advertir sobre a intenção de ultrapassar.",
            "Entre 22h e 6h seu uso é terminantemente vedado no período noturno.",
            "Todas as alternativas acima estão corretas."
        ],
        correctIndex: 3,
        explanation: 'Buzina: toque breve de advertência, fora da cidade p/ ultrapassar e nada de 22h às 6h.',
        legalBase: "Art. 227 do CTB",
        incidence: "alta",
        difficulty: 2
    },
    {
        id: "td_16",
        category: "direcao-defensiva",
        statement: "Em vias paralelas de fluxo único, o condutor deseja mudar de faixa para a direita ou para a esquerda e deve cumprir as exigências previstas no CTB e na direção defensiva. O que é obrigatório nessa mudança?",
        options: [
            "Sinalizar com a seta apropriada.",
            "Conferir se a faixa adjacente está livre antes de entrar.",
            "Respeitar quem já circula na faixa de destino.",
            "Todas as alternativas acima estão corretas."
        ],
        correctIndex: 3,
        explanation: 'Trocar de faixa: seta, faixa livre e preferência de quem já está lá.',
        incidence: "media",
        difficulty: 2
    },
    {
        id: "td_17",
        category: "direcao-defensiva",
        statement: "Em via de trânsito rápido, o condutor aproxima-se de aclive sem visibilidade, trecho em que a sinalização vertical e horizontal restringe a ultrapassagem. A conduta defensiva recomendada nesse trecho é:",
        options: [
            "Manter o veículo no centro da sua faixa.",
            "Reduzir para velocidade segura de frenagem.",
            "Não ultrapassar no trecho sem visibilidade.",
            "Todas as alternativas acima estão corretas."
        ],
        correctIndex: 3,
        explanation: 'Aclive sem visão: centro da faixa, devagar e sem ultrapassar.',
        incidence: "media",
        difficulty: 2
    },
    {
        id: "td_18",
        category: "primeiros-socorros",
        statement: "Em situação de emergência, o condutor é obrigado a imobilizar o veículo junto ao bordo da pista, seja no perímetro urbano ou em rodovia. Nesse caso, o conjunto completo de providências obrigatórias abrange:",
        options: [
            "Acionar imediatamente o pisca-alerta (luzes de advertência intermitentes).",
            "Posicionar o triângulo de segurança na distância regulamentar da traseira do veículo.",
            "Retirar os ocupantes do veículo e conduzi-los a local seguro fora da pista.",
            "Todas as alternativas acima estão corretas."
        ],
        correctIndex: 3,
        explanation: 'Pane na pista: pisca, triângulo atrás e todo mundo fora do carro.',
        incidence: "media",
        difficulty: 2
    },
    {
        id: "td_19",
        category: "infracoes",
        statement: "Nas vias coletoras e arteriais do perímetro urbano, o CTB veda condutas específicas ao condutor, inclusive manobras de ultrapassagem e uso de equipamentos. Sobre essas vedações, assinale a alternativa correta:",
        options: [
            "Ultrapassar pelo acostamento ou pela direita, salvo exceção.",
            "Converter onde a sinalização proíbe.",
            "Dirigir de fone ou mexendo no celular.",
            "Todas as alternativas acima estão corretas."
        ],
        correctIndex: 3,
        explanation: 'Acostamento, conversão proibida e celular ao volante: tudo proibido.',
        incidence: "media",
        difficulty: 2
    },
    {
        id: "td_20",
        category: "placas",
        statement: "A sinalização horizontal pintada na pista de rolamento integra o sistema de sinalização viária e cumpre múltiplas funções ao longo do traçado. Entre as funções atribuídas pelo CTB à sinalização horizontal estão:",
        options: [
            "Delimitar faixas de circulação e orientar o fluxo dos veículos na pista.",
            "Alertar para riscos e sinalizar a vedação de ultrapassagem em determinados trechos.",
            "Identificar locais de estacionamento e imobilização permitida no bordo da pista.",
            "Todas as alternativas acima estão corretas."
        ],
        correctIndex: 3,
        explanation: 'Pintura na pista: organiza fluxo, avisa risco e regula estacionamento.',
        incidence: "media",
        difficulty: 2
    },
    {
        id: "td_21",
        category: "legislacao",
        statement: "Em via de trânsito rápido no perímetro urbano, os acessos de entrada e de saída subordinam-se à regra geral de preferência prevista no CTB. A respeito da prioridade de passagem nesses acessos, é correto afirmar:",
        options: [
            "A preferência pertence a quem já circula na pista da via principal.",
            "O veículo que ingresa deve fazê-lo já na velocidade do fluxo da via principal.",
            "Os acessos sem semáforo e sem cruzamento em nível seguem a mesma regra geral.",
            "Todas as alternativas acima estão corretas."
        ],
        correctIndex: 3,
        explanation: 'Na entrada da rápida: a vez é de quem já está nela.',
        incidence: "media",
        difficulty: 2
    },
    {
        id: "td_22",
        category: "direcao-defensiva",
        statement: "Dentre os trechos e as condições de pista listados, qual exige do condutor atenção redobrada e velocidade inferior à praticada normalmente, segundo os princípios da direção defensiva e as regras do CTB vigentes?",
        options: [
            "Pista esburacada, ondulada ou escorregadia.",
            "Declive forte com curva fechada e sem acostamento.",
            "Falta de acostamento com mato no bordo.",
            "Todas as alternativas acima estão corretas."
        ],
        correctIndex: 3,
        explanation: 'Pista ruim, declive com curva e sem acostamento: devagar e atenção total.',
        incidence: "media",
        difficulty: 2
    },
    {
        id: "td_23",
        category: "legislacao",
        statement: "Em via arterial do perímetro urbano, o condutor pretende converter à direita em interseção e deve observar o posicionamento e a sinalização exigidos pelo CTB. A respeito dessa conversão, é correto afirmar:",
        options: [
            "Aproximar o veículo o máximo possível do bordo direito da pista de rolamento.",
            "Acionar a luz indicadora de direção com antecedência regulamentar.",
            "Efetuar a manobra com redução de velocidade e atenção aos pedestres.",
            "Todas as alternativas acima estão corretas."
        ],
        correctIndex: 3,
        explanation: 'Conversão à direita: cola no bordo, seta antes e vai devagar.',
        incidence: "media",
        difficulty: 2
    },
    {
        id: "td_24",
        category: "legislacao",
        statement: "O uso da luz baixa (farol baixo) é obrigatório em determinadas condições de circulação previstas no CTB, independentemente da sinalização local. A respeito dessas situações previstas em lei, é correto afirmar:",
        options: [
            "À noite, em qualquer via, com ou sem iluminação pública.",
            "Durante o dia, em rodovia de pista simples fora do perímetro urbano (sem DRL).",
            "Em túneis providos de iluminação, de dia ou de noite.",
            "Todas as alternativas acima estão corretas."
        ],
        correctIndex: 3,
        explanation: 'Farol baixo: à noite sempre, de dia em rodovia simples e em túnel.',
        legalBase: "Art. 40 do CTB",
        incidence: "alta",
        difficulty: 1
    },
    {
        id: "td_25",
        category: "legislacao",
        statement: "O embarque e o desembarque de passageiros no perímetro urbano subordinam-se às regras gerais de parada e conduta previstas no CTB. A respeito do modo correto de embarcar e desembarcar, é correto afirmar:",
        options: [
            "O embarque deve ser feito sempre pelo lado da calçada, com exceção do condutor.",
            "A parada deve ocorrer com o veículo junto ao bordo da via.",
            "A manobra não pode obstruir a marcha normal dos demais veículos.",
            "Todas as alternativas acima estão corretas."
        ],
        correctIndex: 3,
        explanation: 'Embarque: lado da calçada, carro parado no bordo e sem travar a via.',
        legalBase: "Art. 49 do CTB",
        incidence: "media",
        difficulty: 2
    },
    {
        id: "td_26",
        category: "legislacao",
        statement: "O condutor aproxima-se de via transversal sinalizada com a placa R-1 (PARADA OBRIGATÓRIA), em interseção do perímetro urbano. A respeito da conduta obrigatória exigida nesse local pela sinalização, é correto afirmar:",
        options: [
            "É obrigatória a parada total antes da entrada na interseção.",
            "Deve-se ceder a passagem a todos os veículos da via preferencial.",
            "Deve-se ceder a passagem aos pedestres em travessia na interseção.",
            "Todas as alternativas acima estão corretas."
        ],
        correctIndex: 3,
        explanation: 'R-1: para total, vez da preferencial e dos pedestres.',
        incidence: "alta",
        difficulty: 2
    },
    {
        id: "td_27",
        category: "legislacao",
        statement: "Na ausência de ciclovia ou ciclofaixa, as bicicletas trafegam pelas vias urbanas de perímetro, observando as regras gerais do CTB. A respeito das regras que disciplinam essa circulação de bicicletas, é correto afirmar:",
        options: [
            "Devem circular pelos bordos da pista de rolamento, no mesmo sentido dos veículos.",
            "Têm preferência sobre os veículos automotores nas interseções.",
            "Devem ser ultrapassadas com distância lateral mínima de 1,5 metro.",
            "Todas as alternativas acima estão corretas."
        ],
        correctIndex: 3,
        explanation: 'Sem ciclovia: bike no bordo no sentido da via, com preferência e 1,5 m ao ultrapassar.',
        legalBase: "Art. 58 do CTB",
        incidence: "media",
        difficulty: 2
    },
    {
        id: "td_28",
        category: "mecanica",
        statement: "Antes de circular no perímetro urbano ou ingressar em rodovia, o condutor deve checar o conjunto de itens de segurança do veículo: equipamentos obrigatórios, freios, luzes, pneus e combustível. Essa verificação abrange:",
        options: [
            "Todos os equipamentos obrigatórios em perfeito estado de funcionamento.",
            "Combustível suficiente para concluir todo o trajeto planejado.",
            "Sistemas de freagem, iluminação e pneus em condições adequadas de uso.",
            "Todas as alternativas acima estão corretas."
        ],
        correctIndex: 3,
        explanation: 'Antes de sair: equipamentos, combustível e freios/luzes/pneus.',
        incidence: "media",
        difficulty: 1
    },
    {
        id: "td_29",
        category: "legislacao",
        statement: "Duas vias perpendiculares se cruzam no perímetro urbano sem placa de preferência, sem semáforo e sem agente. Pela regra geral de preferência do CTB aplicável a essa interseção não sinalizada, é correto afirmar:",
        options: [
            "A preferência pertence ao veículo que se aproxima pela direita do condutor.",
            "Todos os veículos devem reduzir a velocidade antes de ingressar na interseção.",
            "O pedestre em travessia tem prioridade sobre o veículo que vai converter.",
            "Todas as alternativas acima estão corretas."
        ],
        correctIndex: 3,
        explanation: 'Sem placa: direita primeiro, reduz ao entrar e pedestre na travessia manda.',
        incidence: "alta",
        difficulty: 2
    },
    {
        id: "td_30",
        category: "infracoes",
        statement: "Em via coletora ou arterial do perímetro urbano, radar de fiscalização registra veículo trafegando acima de 20% da velocidade máxima permitida. Pelo CTB, esse excesso configura infração acompanhada de:",
        options: [
            "Natureza média, sujeita a multa administrativa.",
            "Pontuação de 4 pontos no prontuário do condutor.",
            "Multa aplicável ao condutor ou proprietário responsável.",
            "Todas as alternativas acima estão corretas."
        ],
        correctIndex: 3,
        explanation: 'Até 20% acima: média + multa + 4 pontos.',
        legalBase: "Art. 218 do CTB",
        incidence: "alta",
        difficulty: 2
    },
    {
        id: "rst_01",
        category: "legislacao",
        statement: "O uso do cinto de segurança é obrigatório para condutor e passageiros em todas as vias do território nacional. A exceção a essa regra aplica-se APENAS em qual situação?",
        options: [
          "Em trajetos curtos dentro do perímetro urbano",
          "Para passageiros no banco traseiro em vias coletoras",
          "Não existe exceção legal, sendo o uso obrigatório para todos os ocupantes",
          "Apenas para condutores de veículos de transporte de carga"
        ],
        correctIndex: 2,
        explanation: "Não existe exceção: o cinto é obrigatório para o condutor e todos os passageiros, em qualquer via.",
        incidence: "media",
        difficulty: 2,
        image_url: ""
    },
    {
        id: "rst_02",
        category: "legislacao",
        statement: "A ultrapassagem de outro veículo em movimento na pista de rolamento deve ser realizada SOMENTE pela esquerda. Em qual hipótese é permitida a ultrapassagem pela direita?",
        options: [
          "Quando o veículo da frente estiver na faixa da esquerda e em baixa velocidade",
          "Quando o veículo a ser ultrapassado estiver sinalizando que vai dobrar à esquerda",
          "Em vias de trânsito rápido durante períodos de cerração ou neblina",
          "Quando a via for de pista simples em aclive acentuado"
        ],
        correctIndex: 1,
        explanation: "Pela direita só quando o veículo da frente sinalizou que vai virar à esquerda.",
        incidence: "alta",
        difficulty: 2,
        image_url: ""
    },
    {
        id: "rst_03",
        category: "direcao-defensiva",
        statement: "O condutor NUNCA deve acionar o pisca-alerta do veículo em movimento na pista de rolamento, EXCETO quando:",
        options: [
          "Estiver trafegando em velocidade reduzida sob cerração ou neblina intensa",
          "A sinalização da via assim o determinar ou em imobilizações de emergência",
          "Estiver realizando uma transposição de faixa em via arterial",
          "Desejar estacionar o veículo no bordo da pista em local proibido"
        ],
        correctIndex: 1,
        explanation: "Pisca-alerta andando só quando a sinalização determina ou em imobilização de emergência.",
        incidence: "media",
        difficulty: 2,
        image_url: ""
    },
    {
        id: "rst_04",
        category: "legislacao",
        statement: "A preferência de passagem em interseção não sinalizada pertence EXCLUSIVAMENTE ao veículo que se aproxima pela direita do condutor. Essa regra NUNCA se aplica quando:",
        options: [
          "Um dos veículos estiver circulando por uma rotatória ou ingressando de rodovia",
          "Ambos os veículos transitarem por vias urbanas coletoras perpendiculares",
          "A interseção for composta por vias paralelas de fluxo único",
          "O cruzamento ocorrer dentro do perímetro urbano em trecho plano"
        ],
        correctIndex: 0,
        explanation: "A regra da direita não vale quando há rotatória ou acesso de rodovia — esses têm preferência própria.",
        incidence: "media",
        difficulty: 2,
        image_url: ""
    },
    {
        id: "rst_05",
        category: "legislacao",
        statement: "A circulação de veículos automotores sobre passeios, calçadas e canteiros centrais é expressamente proibida. O tráfego nesses locais é permitido APENAS para:",
        options: [
          "Evitar congestionamentos em vias arteriais de fluxo intenso",
          "Entrar ou sair de imóveis ou de áreas ladeadas de estacionamento",
          "Realizar embarque ou desembarque rápido no bordo da pista",
          "Fazer conversão à esquerda quando a via estiver deserta"
        ],
        correctIndex: 1,
        explanation: "Sobre calçada e passeio só se permite entrar ou sair de imóveis e estacionamentos.",
        incidence: "media",
        difficulty: 2,
        image_url: ""
    },
    {
        id: "rst_06",
        category: "direcao-defensiva",
        statement: "Ao transitar por uma via em declive acentuado, o condutor NUNCA deve colocar o câmbio em marcha neutra (ponto morto). Qual é o risco técnico dessa prática?",
        options: [
          "Acelerar o desgaste do motor pela falta de lubrificação",
          "Perder a ação do freio motor e sobrecarregar o sistema de freios de serviço",
          "Travar as rodas traseiras impedindo a conversão na pista de rolamento",
          "Provocar o desligamento automático dos faróis em alta velocidade"
        ],
        correctIndex: 1,
        explanation: "Em neutro você perde o freio motor e sobrecarrega os freios de serviço, que superaquecem.",
        incidence: "alta",
        difficulty: 2,
        image_url: ""
    },
    {
        id: "rst_07",
        category: "legislacao",
        statement: "A luz de buzina deve ser utilizada em toques breves. O uso da buzina é terminantemente proibido e NUNCA deve ocorrer em qual situação?",
        options: [
          "Fora do perímetro urbano para advertir sobre intenção de ultrapassar",
          "Entre as vinte e duas e as seis horas ou em locais sinalizados com proibição",
          "Como advertência preventiva para evitar acidentes na interseção",
          "Ao aproximar-se de pedestres que estejam no bordo da pista"
        ],
        correctIndex: 1,
        explanation: "Buzina proibida das 22h às 6h e em qualquer local sinalizado com proibição.",
        incidence: "alta",
        difficulty: 2,
        image_url: ""
    },
    {
        id: "rst_08",
        category: "legislacao",
        statement: "Os veículos de emergência (ambulâncias e polícia) têm prioridade de trânsito e gozam de livre circulação SOMENTE quando:",
        options: [
          "Estiverem transitando por vias de trânsito rápido no perímetro urbano",
          "Estiverem em serviço de urgência e devidamente identificados por alarme e luzes",
          "Retornarem de uma ocorrência para o pátio do órgão responsável",
          "Estiverem circulando em trechos em aclive ou declive de rodovias"
        ],
        correctIndex: 1,
        explanation: "A prioridade vale somente em serviço de urgência, com alarme e luzes ligados.",
        incidence: "media",
        difficulty: 1,
        image_url: ""
    },
    {
        id: "rst_09",
        category: "legislacao",
        statement: "A parada de um veículo no bordo da pista para embarque ou desembarque de passageiros deve ocorrer EXCLUSIVAMENTE sob qual condição legal?",
        options: [
          "Pelo tempo estritamente necessário e sem interromper a fluidez do trânsito",
          "Com o pisca-alerta ligado em qualquer trecho da via arterial",
          "Sempre no sentido oposto ao fluxo para facilitar a visibilidade do pedestre",
          "Apenas quando houver recuo específico no canteiro central da pista"
        ],
        correctIndex: 0,
        explanation: "Parada para embarque e desembarque só pelo tempo necessário e sem interromper a fluidez.",
        incidence: "media",
        difficulty: 2,
        image_url: ""
    },
    {
        id: "rst_10",
        category: "legislacao",
        statement: "Em vias urbanas sem sinalização regulamentadora, a velocidade máxima de 80 km/h é permitida EXCLUSIVAMENTE em quais vias?",
        options: [
          "Nas vias arteriais que cruzam o perímetro urbano",
          "Nas vias coletoras adjacentes a áreas residenciais",
          "Nas vias de trânsito rápido",
          "Em qualquer via urbana com pistas duplas e paralelas"
        ],
        correctIndex: 2,
        explanation: "Sem placa, 80 km/h vale apenas nas vias de trânsito rápido (Art. 61 do CTB).",
        incidence: "altissima",
        difficulty: 2,
        image_url: ""
    },
    {
        id: "rst_11",
        category: "direcao-defensiva",
        statement: "Em trechos de aclive com visibilidade reduzida em rodovia de pista simples, a ultrapassagem é considerada manobra perigosa e só é permitida quando houver, na mão de direção do condutor, sinalização horizontal que a autorize. Essa sinalização é:",
        options: [
          "Espaço suficiente na pista de rolamento sem tráfego de pedestres",
          "Sinalização horizontal com linha amarela contínua na sua faixa",
          "Sinalização horizontal com linha amarela seccionada na sua mão de direção",
          "Cerração leve que permita enxergar as luzes dos veículos opostos"
        ],
        correctIndex: 2,
        explanation: "No aclive só ultrapassa com linha amarela seccionada na sua mão de direção.",
        incidence: "media",
        difficulty: 2,
        image_url: ""
    },
    {
        id: "rst_12",
        category: "legislacao",
        statement: "O tráfego de bicicletas deve ocorrer nos bordos da pista de rolamento no mesmo sentido dos veículos. A circulação em calçadas é permitida APENAS quando:",
        options: [
          "O trânsito na pista de rolamento estiver muito congestionado",
          "Houver autorização expressa do órgão com jurisdição e sinalização adequada",
          "O ciclista estiver conduzindo a bicicleta em velocidade reduzida",
          "A via transversal for classificada como de trânsito rápido"
        ],
        correctIndex: 1,
        explanation: "Bicicleta na calçada só com autorização expressa do órgão com jurisdição e sinalização adequada.",
        incidence: "media",
        difficulty: 2,
        image_url: ""
    },
    {
        id: "rst_13",
        category: "primeiros-socorros",
        statement: "Durante o socorro a vítimas na pista de rolamento, com risco de novo impacto, o prestador de socorro deve sinalizar o local, acionar as emergências e preservar a estabilidade das vítimas. Ele NUNCA deve:",
        options: [
          "Sinalizar o local do acidente antes de iniciar o atendimento",
          "Movimentar a vítima ou retirar o capacete de um motociclista acidentado",
          "Chamar o serviço especializado de emergência (192 ou 193)",
          "Desligar a ignição do veículo acidentado para evitar incêndio"
        ],
        correctIndex: 1,
        explanation: "Nunca movimente a vítima nem retire o capacete: aguarde o socorro especializado (192/193).",
        incidence: "alta",
        difficulty: 2,
        image_url: ""
    },
    {
        id: "rst_14",
        category: "mecanica",
        statement: "A conferência da pressão de calibragem dos pneus exige condições específicas de temperatura, pois o calor de rotação altera a leitura. Essa verificação deve ser realizada EXCLUSIVAMENTE quando os pneus estiverem:",
        options: [
          "Aquececidos após trafegar em alta velocidade na rodovia",
          "Frios, preferencialmente antes de colocar o veículo em circulação",
          "Totalmente descalibrados para ajuste do sistema de suspensão",
          "Molhados após rodar sob chuva forte ou pista escorregadia"
        ],
        correctIndex: 1,
        explanation: "Mede a calibragem com o pneu frio, de preferência antes de sair, pra leitura fiel.",
        incidence: "media",
        difficulty: 1,
        image_url: ""
    },
    {
        id: "rst_15",
        category: "legislacao",
        statement: "A conversão à esquerda em vias urbanas de sentido duplo de circulação deve ser executada APENAS após o condutor:",
        options: [
          "Aproximar o veículo do bordo esquerdo da pista de rolamento",
          "Aproximar o veículo da linha divisória do fluxo e ceder preferência ao sentido oposto",
          "Acionar o pisca-alerta e avançar sobre a linha de retenção",
          "Aumentar a velocidade para concluir a manobra antes do cruzamento"
        ],
        correctIndex: 1,
        explanation: "Só vire depois de encostar na linha divisória e ceder a vez ao sentido contrário.",
        incidence: "media",
        difficulty: 2,
        image_url: ""
    },
    {
        id: "fr_01",
        category: "mecanica",
        statement: "Na inspeção do sistema de frenagem, analisa-se a atuação do freio de pé (serviço) e do freio de mão (estacionamento) sobre o conjunto de rodas do veículo. Sobre a distribuição de atuação entre ambos, é correto afirmar que:",
        options: [
          "O freio de mão atua nas quatro rodas e deve ser usado para reduzir a velocidade em movimento",
          "O freio de pé atua exclusivamente nas rodas dianteiras para imobilizar o veículo",
          "O freio de pé atua nas quatro rodas simultaneamente e o de mão atua apenas nas rodas traseiras",
          "Ambos os sistemas atuam somente nas rodas traseiras para evitar o capotamento"
        ],
        correctIndex: 2,
        explanation: "O freio de pé atua nas quatro rodas; o freio de mão atua apenas nas rodas traseiras.",
        incidence: "media",
        difficulty: 2,
        image_url: ""
    },
    {
        id: "fr_02",
        category: "direcao-defensiva",
        statement: "Ao transitar sob chuva intensa em uma rodovia, o veículo perde a aderência dos pneus com a pista e começa a flutuar sobre a água (aquaplanagem). O condutor NUNCA deve:",
        options: [
          "Pisar bruscamente no pedal de freio nem virar o volante de forma repentina",
          "Tirar suavemente o pé do acelerador para reduzir a velocidade",
          "Manter o volante reto segurando-o firmemente com as duas mãos",
          "Aguardar que os pneus retomem o contato direto com a pista de rolamento"
        ],
        correctIndex: 0,
        explanation: "Na aquaplanagem não freia nem vira: só tire o pé do acelerador e mantenha o volante reto.",
        incidence: "alta",
        difficulty: 2,
        image_url: ""
    },
    {
        id: "fr_03",
        category: "mecanica",
        statement: "O freio de estacionamento (freio de mão) possui finalidade técnica específica, distinta da do freio de serviço de acionamento hidráulico. No trânsito urbano e rodoviário brasileiro, essa finalidade EXCLUSIVA é:",
        options: [
          "Auxiliar a parada de emergência quando o veículo estiver em alta velocidade",
          "Manter o veículo imobilizado na posição de estacionamento ou parada no declive/aclive",
          "Substituir o freio de pé caso a pista de rolamento esteja muito escorregadia",
          "Reduzir a velocidade das rodas dianteiras durante manobras de conversão"
        ],
        correctIndex: 1,
        explanation: "O freio de mão serve exclusivamente para imobilizar o veículo parado, em aclive ou declive.",
        incidence: "media",
        difficulty: 1,
        image_url: ""
    },
    {
        id: "fr_04",
        category: "direcao-defensiva",
        statement: "Durante um trecho longo em declive acentuado, a utilização contínua APENAS do freio de pé pode provocar o superaquecimento do sistema. Para evitar a perda de eficiência, o condutor deve utilizar:",
        options: [
          "O freio de mão em pequenos toques simultâneos com o freio de pé",
          "O freio motor, engatando uma marcha reduzida compatível com a descida",
          "Apenas a marcha neutra (ponto morto) para economizar o sistema de freios",
          "O pisca-alerta enquanto mantém o pedal de freio pressionado continuamente"
        ],
        correctIndex: 1,
        explanation: "Na descida longa use freio motor com marcha reduzida pra não superaquecer os freios.",
        incidence: "alta",
        difficulty: 2,
        image_url: ""
    },
    {
        id: "fr_05",
        category: "mecanica",
        statement: "Em veículo desprovido de sistema antitravamento (ABS), a frenagem de emergência sobre pista de rolamento molhada pode levar ao travamento total das rodas. A consequência direta imediata desse travamento é:",
        options: [
          "Aumento imediato do atrito e parada instantaneous do veículo na pista",
          "Perda do controle da direção e arrastamento dos pneus sobre a pista de rolamento",
          "Acionamento automático e imediato do freio de estacionamento traseiro",
          "Transferência do peso do veículo exclusivamente para as rodas traseiras"
        ],
        correctIndex: 1,
        explanation: "Sem ABS, rodas travadas = perda da direção e pneus arrastando na pista.",
        incidence: "media",
        difficulty: 2,
        image_url: ""
    },
    {
        id: "fr_06",
        category: "direcao-defensiva",
        statement: "A aquaplanagem decorre da combinação de lâmina d'água sobre a pista de rolamento, velocidade elevada e pneus com banda de rodagem desgastada. A prevenção desse fenômeno deve ocorrer SOMENTE por meio de:",
        options: [
          "Aumento da velocidade para cruzar rapidamente o trecho alagado",
          "Manutenção de pneus em bom estado e redução da velocidade sob chuva",
          "Acionamento do freio de mão ao avistar poças na pista de rolamento",
          "Uso de luz alta para evaporar a água acumulada na pista de rolamento"
        ],
        correctIndex: 1,
        explanation: "Prevenção da aquaplanagem: pneus em bom estado e velocidade menor sob chuva.",
        incidence: "media",
        difficulty: 2,
        image_url: ""
    },
    {
        id: "fr_07",
        category: "mecanica",
        statement: "O sistema de freio antitravamento (ABS) difere do sistema convencional pela atuação específica do módulo eletrônico-hidráulico durante a frenagem de emergência em pista com baixa aderência. Essa atuação é:",
        options: [
          "Bloqueia permanentemente as rodas traseiras para evitar a derrapagem lateral",
          "Impede o travamento das rodas durante a frenagem, mantendo a dirigibilidade do veículo",
          "Funciona APENAS quando o freio de estacionamento (mão) está acionado",
          "Atua exclusivamente no freio motor durante aclives e declives acentuados"
        ],
        correctIndex: 1,
        explanation: "O ABS impede o travamento das rodas, mantendo a dirigibilidade durante a frenagem.",
        incidence: "alta",
        difficulty: 1,
        image_url: ""
    },
    {
        id: "fr_08",
        category: "direcao-defensiva",
        statement: "Em uma curva em pista de rolamento escorregadia, o condutor NUNCA deve acionar o freio de pé com violência porque essa atitude poderá provocar:",
        options: [
          "O desengate automático do câmbio e aumento de velocidade do motor",
          "A derrapagem do veículo por travamento das rodas e perda de aderência",
          "A perda imediata de pressão de ar em todos os pneus simultaneamente",
          "A ativação do sistema de iluminação de emergência e pisca-alerta"
        ],
        correctIndex: 1,
        explanation: "Freio brusco na curva escorregadia trava as rodas e provoca derrapagem.",
        incidence: "media",
        difficulty: 2,
        image_url: ""
    },
    {
        id: "fr_09",
        category: "direcao-defensiva",
        statement: "O freio motor é uma técnica de direção defensiva empregada para conter a velocidade do veículo sem acionar o pedal de freio de serviço, evitando o superaquecimento. Seu acionamento é realizado EXCLUSIVAMENTE:",
        options: [
          "Pressionando o pedal de embreagem junto com o freio de mão",
          "Tirando o pé do acelerador e engrenando marchas mais reduzidas no câmbio",
          "Desligando a chave de ignição durante o percurso em declive",
          "Puxando alavanca do freio de estacionamento em pequenos intervalos"
        ],
        correctIndex: 1,
        explanation: "Freio motor: tire o pé do acelerador e engate marchas mais reduzidas.",
        incidence: "alta",
        difficulty: 2,
        image_url: ""
    },
    {
        id: "fr_10",
        category: "mecanica",
        statement: "Ao acionar com força o pedal do freio de serviço, o condutor constata que ele afunda até o assoalho sem oferecer resistência significativa, sem retorno hidráulico. Essa falha do sistema de frenagem associa-se APENAS a:",
        options: [
          "Vazamento do fluido de freio ou presença de ar nas tubulações hidráulicas",
          "Travamento mecânico exclusivo da alavanca do freio de mão",
          "Pressão excessiva de ar no interior dos pneus do eito traseiro",
          "Desgaste das lâmpadas das luzes de freio na traseira do veículo"
        ],
        correctIndex: 0,
        explanation: "Pedal que afunda = vazamento de fluido de freio ou ar no sistema hidráulico.",
        incidence: "media",
        difficulty: 2,
        image_url: ""
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
    return selected.sort(() => Math.random() - 0.5);
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
