export type GravidadeInfracao = "leve" | "media" | "grave" | "gravissima";

export interface Infracao {
  id: string;
  artigo: string;
  descricao: string;
  gravidade: GravidadeInfracao;
  multiplicador?: number;
  fatorMulta?: string;
  multaBase?: number;
  pontuacao?: string;
  penalidade: string;
  medidaAdministrativa: string;
  pegadinha: string;
  termosBusca: string;
}

export const INFRACOES: Infracao[] = [
  {
    id: "162-i",
    artigo: "Art. 162, I",
    descricao: "Dirigir sem possuir CNH, Permissão para Dirigir ou ACC.",
    gravidade: "gravissima",
    multiplicador: 3,
    penalidade: "Multa (3x).",
    medidaAdministrativa: "Retenção do veículo até a apresentação de condutor habilitado.",
    pegadinha:
      "Não confunda com dirigir com CNH vencida há mais de 30 dias: essa é outra infração.",
    termosBusca: "sem habilitação não tem cnh permissão para dirigir acc",
  },
  {
    id: "162-ii",
    artigo: "Art. 162, II",
    descricao: "Dirigir com CNH, PPD ou ACC cassada ou com o direito de dirigir suspenso.",
    gravidade: "gravissima",
    multiplicador: 3,
    penalidade: "Multa (3x).",
    medidaAdministrativa:
      "Recolhimento do documento e retenção até a apresentação de condutor habilitado.",
    pegadinha:
      "Suspensão e cassação não são sinônimos; ambas se enquadram neste inciso quando a pessoa dirige.",
    termosBusca: "suspensão cassada carteira cnh",
  },
  {
    id: "162-iii",
    artigo: "Art. 162, III",
    descricao: "Dirigir com CNH ou PPD de categoria diferente da do veículo.",
    gravidade: "gravissima",
    multiplicador: 2,
    penalidade: "Multa (2x).",
    medidaAdministrativa: "Retenção do veículo até a apresentação de condutor habilitado.",
    pegadinha:
      "Categoria incompatível é diferente de não possuir habilitação: os multiplicadores não são iguais.",
    termosBusca: "categoria diferente incompatível cnh carteira",
  },
  {
    id: "162-v",
    artigo: "Art. 162, V",
    descricao: "Dirigir com a CNH vencida há mais de 30 dias.",
    gravidade: "gravissima",
    penalidade: "Multa.",
    medidaAdministrativa: "Retenção do veículo até a apresentação de condutor habilitado.",
    pegadinha: "O prazo é superior a 30 dias, não 30 dias ou mais.",
    termosBusca: "cnh vencida validade expirada",
  },
  {
    id: "162-vi",
    artigo: "Art. 162, VI",
    descricao:
      "Dirigir sem usar lentes corretoras, aparelho auxiliar ou adaptação imposta na habilitação.",
    gravidade: "gravissima",
    penalidade: "Multa.",
    medidaAdministrativa:
      "Retenção do veículo até sanar a irregularidade ou apresentação de condutor habilitado.",
    pegadinha: "A infração depende de restrição anotada na habilitação.",
    termosBusca: "óculos lente corretora restrição cnh",
  },
  {
    id: "163",
    artigo: "Art. 163 c/c art. 162",
    descricao: "Entregar a direção do veículo a pessoa nas condições previstas no art. 162.",
    gravidade: "gravissima",
    fatorMulta: "conforme o enquadramento do art. 162",
    penalidade: "Multa conforme a condição de habilitação do condutor (art. 162).",
    medidaAdministrativa: "Retenção do veículo até a apresentação de condutor habilitado.",
    pegadinha:
      "Entregar o veículo é diferente de permitir que a pessoa assuma a direção (art. 164).",
    termosBusca: "entregar veículo pessoa sem habilitação proprietário",
  },
  {
    id: "164",
    artigo: "Art. 164 c/c art. 162",
    descricao:
      "Permitir que pessoa nas condições do art. 162 tome posse do veículo e passe a conduzi-lo.",
    gravidade: "gravissima",
    fatorMulta: "conforme o enquadramento do art. 162",
    penalidade: "Multa conforme a condição de habilitação do condutor (art. 162).",
    medidaAdministrativa: "Retenção do veículo até a apresentação de condutor habilitado.",
    pegadinha:
      "A prova costuma contrastar permitir que conduza com entregar a direção; ambos remetem ao art. 162.",
    termosBusca: "permitir conduzir veículo proprietário sem cnh",
  },
  {
    id: "165",
    artigo: "Art. 165",
    descricao: "Dirigir sob a influência de álcool ou de outra substância psicoativa.",
    gravidade: "gravissima",
    multiplicador: 10,
    pontuacao: "suspensiva · sem pontos",
    penalidade:
      "Multa (10x) e suspensão do direito de dirigir por 12 meses; em reincidência em até 12 meses, multa em dobro.",
    medidaAdministrativa:
      "Recolhimento da habilitação e retenção do veículo, observadas as regras do CTB.",
    pegadinha:
      "A infração administrativa não exige atingir o limite de crime; recusar o teste é enquadramento próprio (art. 165-A).",
    termosBusca: "álcool bebida embriaguez bafômetro substância psicoativa dirigir",
  },
  {
    id: "165-a",
    artigo: "Art. 165-A",
    descricao:
      "Recusar teste, exame clínico, perícia ou outro procedimento para verificar álcool ou substância psicoativa.",
    gravidade: "gravissima",
    multiplicador: 10,
    pontuacao: "suspensiva · sem pontos",
    penalidade:
      "Multa (10x) e suspensão do direito de dirigir por 12 meses; multa em dobro na reincidência em até 12 meses.",
    medidaAdministrativa: "Recolhimento da habilitação e retenção do veículo, conforme o CTB.",
    pegadinha:
      "A recusa tem enquadramento e penalidade próprios, mesmo sem resultado positivo no teste.",
    termosBusca: "recusar bafômetro teste etilômetro exame",
  },
  {
    id: "166",
    artigo: "Art. 166",
    descricao:
      "Confiar ou entregar a direção a pessoa que, mesmo habilitada, não esteja em condições de dirigir com segurança.",
    gravidade: "gravissima",
    penalidade: "Multa.",
    medidaAdministrativa: "Não especificada no artigo.",
    pegadinha:
      "O condutor pode ser habilitado: o foco é não estar em condições seguras para dirigir.",
    termosBusca: "confiar entregar direção pessoa sem condições segurança",
  },
  {
    id: "167",
    artigo: "Art. 167",
    descricao: "Deixar o condutor ou passageiro de usar o cinto de segurança.",
    gravidade: "grave",
    penalidade: "Multa.",
    medidaAdministrativa: "Retenção do veículo até a colocação do cinto pelo infrator.",
    pegadinha: "A infração é grave, não gravíssima; alcança condutor e passageiro.",
    termosBusca: "cinto segurança passageiro",
  },
  {
    id: "168",
    artigo: "Art. 168",
    descricao: "Transportar criança sem observar as normas especiais de segurança.",
    gravidade: "gravissima",
    penalidade: "Multa.",
    medidaAdministrativa: "Retenção do veículo até sanar a irregularidade.",
    pegadinha:
      "Não basta a criança estar no banco traseiro: devem ser observadas as regras de retenção adequadas.",
    termosBusca: "criança bebê cadeirinha dispositivo retenção banco traseiro",
  },
  {
    id: "169",
    artigo: "Art. 169",
    descricao: "Dirigir sem atenção ou sem os cuidados indispensáveis à segurança.",
    gravidade: "leve",
    penalidade: "Multa.",
    medidaAdministrativa: "Não especificada no artigo.",
    pegadinha: "É uma infração leve, embora a conduta possa parecer grave no enunciado.",
    termosBusca: "desatenção cuidado direção distraído",
  },
  {
    id: "170",
    artigo: "Art. 170",
    descricao: "Dirigir ameaçando pedestres que estejam atravessando a via ou os demais veículos.",
    gravidade: "gravissima",
    pontuacao: "suspensiva · sem pontos",
    penalidade: "Multa e suspensão do direito de dirigir.",
    medidaAdministrativa: "Retenção do veículo e recolhimento da habilitação.",
    pegadinha:
      "Além da multa, há suspensão; a ameaça precisa ser dirigida a pedestre ou outro veículo.",
    termosBusca: "ameaçar pedestre veículo direção perigosa",
  },
  {
    id: "171",
    artigo: "Art. 171",
    descricao: "Usar o veículo para arremessar água ou detritos sobre pedestres ou veículos.",
    gravidade: "media",
    penalidade: "Multa.",
    medidaAdministrativa: "Não especificada no artigo.",
    pegadinha:
      "Arremessar água ou detritos é infração média; não confundir com atirar objetos (art. 172).",
    termosBusca: "água poça detritos jogar pedestre",
  },
  {
    id: "172",
    artigo: "Art. 172",
    descricao: "Atirar do veículo ou abandonar na via objetos ou substâncias.",
    gravidade: "media",
    penalidade: "Multa.",
    medidaAdministrativa: "Não especificada no artigo.",
    pegadinha:
      "A infração trata de objetos ou substâncias; água/detritos arremessados sobre alguém são art. 171.",
    termosBusca: "lixo jogar objeto abandonar via janela",
  },
  {
    id: "173",
    artigo: "Art. 173",
    descricao: "Disputar corrida por espírito de emulação em via pública (racha).",
    gravidade: "gravissima",
    multiplicador: 10,
    pontuacao: "suspensiva · sem pontos",
    penalidade:
      "Multa (10x), suspensão do direito de dirigir e apreensão do veículo; multa em dobro na reincidência em até 12 meses.",
    medidaAdministrativa: "Recolhimento da habilitação e remoção do veículo.",
    pegadinha:
      "Racha é infração administrativa gravíssima multiplicada por 10 e também pode configurar crime.",
    termosBusca: "racha corrida disputa emulação via pública",
  },
  {
    id: "174",
    artigo: "Art. 174",
    descricao:
      "Promover ou participar, como condutor, de competição, evento organizado ou exibição de perícia sem autorização.",
    gravidade: "gravissima",
    multiplicador: 10,
    pontuacao: "suspensiva · sem pontos",
    penalidade:
      "Multa (10x), suspensão do direito de dirigir e apreensão do veículo; multa em dobro na reincidência em até 12 meses.",
    medidaAdministrativa: "Recolhimento da habilitação e remoção do veículo.",
    pegadinha: "O artigo alcança tanto quem promove quanto quem participa como condutor.",
    termosBusca: "competição evento exibição perícia manobra sem autorização",
  },
  {
    id: "175",
    artigo: "Art. 175",
    descricao:
      "Utilizar o veículo para demonstrar ou exibir manobra perigosa, mediante arrancada brusca, derrapagem ou frenagem com deslizamento.",
    gravidade: "gravissima",
    multiplicador: 10,
    pontuacao: "suspensiva · sem pontos",
    penalidade:
      "Multa (10x), suspensão do direito de dirigir e apreensão do veículo; multa em dobro na reincidência em até 12 meses.",
    medidaAdministrativa: "Recolhimento da habilitação e remoção do veículo.",
    pegadinha: "Manobra perigosa para exibição é art. 175; disputa/racha é art. 173.",
    termosBusca: "cavalo de pau arrancada brusca derrapagem pneu freada manobra",
  },
  {
    id: "181-i",
    artigo: "Art. 181, I",
    descricao:
      "Estacionar nas esquinas ou a menos de cinco metros do bordo do alinhamento da via transversal.",
    gravidade: "media",
    penalidade: "Multa.",
    medidaAdministrativa: "Remoção do veículo.",
    pegadinha: "O limite é cinco metros a partir do bordo do alinhamento da via transversal.",
    termosBusca: "estacionar esquina cruzamento cinco metros",
  },
  {
    id: "181-viii",
    artigo: "Art. 181, VIII",
    descricao:
      "Estacionar sobre passeio, faixa de pedestres, ciclovia, ciclofaixa, ilha, refúgio ou canteiro central.",
    gravidade: "grave",
    penalidade: "Multa.",
    medidaAdministrativa: "Remoção do veículo.",
    pegadinha:
      "Estacionar sobre passeio é grave; parar sobre passeio (art. 182) tem enquadramento diferente.",
    termosBusca: "estacionar calçada passeio faixa pedestre ciclovia ciclofaixa",
  },
  {
    id: "181-xvii",
    artigo: "Art. 181, XVII",
    descricao:
      "Estacionar em desacordo com as condições regulamentadas especificamente pela sinalização (placa — Estacionamento Regulamentado).",
    gravidade: "grave",
    penalidade: "Multa.",
    medidaAdministrativa: "Remoção do veículo.",
    pegadinha: "Observe a sinalização e a condição indicada, como horário ou tipo de vaga.",
    termosBusca: "estacionamento regulamentado placa zona azul horário",
  },
  {
    id: "182-vi",
    artigo: "Art. 182, VI e XI",
    descricao:
      "Parar o veículo no passeio, sobre faixa de pedestres, ilha/refúgio ou sobre ciclovia e ciclofaixa.",
    gravidade: "leve",
    penalidade: "Multa.",
    medidaAdministrativa: "Não especificada no artigo.",
    pegadinha:
      "Parar nessas áreas é leve; estacionar sobre passeio, faixa de pedestres ou ciclovia é grave (art. 181, VIII).",
    termosBusca: "parar calçada passeio faixa pedestre ciclovia ciclofaixa",
  },
  {
    id: "184-iii",
    artigo: "Art. 184, III",
    descricao:
      "Transitar em faixa ou via de circulação exclusiva para transporte público coletivo, salvo força maior ou autorização.",
    gravidade: "gravissima",
    pontuacao: "7 pts",
    penalidade: "Multa e apreensão do veículo.",
    medidaAdministrativa: "Remoção do veículo.",
    pegadinha:
      "A faixa exclusiva de transporte coletivo está no inciso III; os incisos I e II tratam de faixas exclusivas para outros tipos de veículo.",
    termosBusca: "faixa exclusiva ônibus corredor transporte público",
  },
  {
    id: "186-i",
    artigo: "Art. 186, I",
    descricao:
      "Transitar pela contramão em via de duplo sentido, salvo para ultrapassar e apenas pelo tempo necessário, respeitadas as regras.",
    gravidade: "grave",
    penalidade: "Multa.",
    medidaAdministrativa: "Não especificada no artigo.",
    pegadinha:
      "Em via de duplo sentido, a contramão é grave; em via de sentido único, o inciso II prevê gravíssima.",
    termosBusca: "contramão sentido duplo mão direção",
  },
  {
    id: "186-ii",
    artigo: "Art. 186, II",
    descricao:
      "Transitar pela contramão em via com sinalização de regulamentação de sentido único.",
    gravidade: "gravissima",
    penalidade: "Multa.",
    medidaAdministrativa: "Não especificada no artigo.",
    pegadinha: "A gravidade muda conforme o tipo de via: sentido único é gravíssima.",
    termosBusca: "contramão mão única sentido único",
  },
  {
    id: "191",
    artigo: "Art. 191",
    descricao:
      "Forçar passagem entre veículos que, em sentidos opostos, estejam na iminência de passar um pelo outro ao realizar ultrapassagem.",
    gravidade: "gravissima",
    multiplicador: 10,
    pontuacao: "suspensiva · sem pontos",
    penalidade:
      "Multa (10x) e suspensão do direito de dirigir; multa em dobro na reincidência em até 12 meses.",
    medidaAdministrativa: "Não especificada no artigo.",
    pegadinha: "É a manobra de forçar passagem entre veículos em sentidos opostos; a multa é 10x.",
    termosBusca: "forçar passagem ultrapassagem sentidos opostos",
  },
  {
    id: "192",
    artigo: "Art. 192",
    descricao:
      "Deixar de guardar distância de segurança lateral e frontal entre o veículo e os demais, bem como em relação ao bordo da pista.",
    gravidade: "grave",
    penalidade: "Multa.",
    medidaAdministrativa: "Não especificada no artigo.",
    pegadinha:
      "Distância de segurança é infração grave; não confundir com a distância mínima lateral de 1,5 m ao ultrapassar bicicleta.",
    termosBusca: "distância segurança lateral frontal veículo",
  },
  {
    id: "193",
    artigo: "Art. 193",
    descricao:
      "Transitar com o veículo em calçadas, passeios, ciclovias, ciclofaixas, ilhas, refúgios ou canteiros centrais, entre outros locais.",
    gravidade: "gravissima",
    multiplicador: 3,
    penalidade: "Multa (3x).",
    medidaAdministrativa: "Não especificada no artigo.",
    pegadinha:
      "Transitar nesses locais é gravíssima com multa triplicada; estacionar sobre eles tem outro artigo.",
    termosBusca: "transitar calçada passeio ciclovia canteiro central",
  },
  {
    id: "195",
    artigo: "Art. 195",
    descricao:
      "Desobedecer às ordens emanadas da autoridade competente de trânsito ou de seus agentes.",
    gravidade: "grave",
    penalidade: "Multa.",
    medidaAdministrativa: "Não especificada no artigo.",
    pegadinha:
      "Desobedecer ordem de agente é grave; avançar sinal vermelho é enquadramento próprio (art. 208).",
    termosBusca: "desobedecer ordem agente autoridade sinal",
  },
  {
    id: "201",
    artigo: "Art. 201",
    descricao: "Deixar de guardar a distância lateral de 1,5 m ao passar ou ultrapassar bicicleta.",
    gravidade: "media",
    penalidade: "Multa.",
    medidaAdministrativa: "Não especificada no artigo.",
    pegadinha: "A distância cobrada é lateral e de, no mínimo, 1,5 metro.",
    termosBusca: "bicicleta ciclista 1,5 m ultrapassar lateral",
  },
  {
    id: "203",
    artigo: "Art. 203",
    descricao:
      "Ultrapassar pela contramão em locais proibidos, como curvas, aclives sem visibilidade, faixas de pedestres e interseções.",
    gravidade: "gravissima",
    multiplicador: 5,
    penalidade: "Multa (5x).",
    medidaAdministrativa: "Não especificada no artigo.",
    pegadinha:
      "Ultrapassagem em local proibido é gravíssima com multa 5x; o art. 191 trata de forçar passagem.",
    termosBusca: "ultrapassagem contramão curva aclive faixa pedestre cruzamento",
  },
  {
    id: "208",
    artigo: "Art. 208",
    descricao:
      "Avançar o sinal vermelho do semáforo ou o de parada obrigatória, salvo a conversão à direita permitida.",
    gravidade: "gravissima",
    penalidade: "Multa.",
    medidaAdministrativa: "Não especificada no artigo.",
    pegadinha:
      "A conversão à direita no vermelho só é permitida onde houver sinalização autorizando.",
    termosBusca: "sinal vermelho semáforo parar obrigatório avançar",
  },
  {
    id: "209",
    artigo: "Art. 209",
    descricao:
      "Transpor, sem autorização, bloqueio viário com ou sem sinalização ou dispositivo auxiliar.",
    gravidade: "grave",
    penalidade: "Multa.",
    medidaAdministrativa: "Não especificada no artigo.",
    pegadinha:
      "Transpor bloqueio viário é diferente de desobedecer ordem direta do agente (art. 195).",
    termosBusca: "bloqueio viário barreira barreira policial transpor",
  },
  {
    id: "210",
    artigo: "Art. 210",
    descricao: "Transpor, sem autorização, bloqueio viário policial.",
    gravidade: "gravissima",
    penalidade: "Multa, apreensão do veículo e suspensão do direito de dirigir.",
    pontuacao: "suspensiva · sem pontos",
    medidaAdministrativa: "Remoção do veículo e recolhimento da habilitação.",
    pegadinha:
      "Se o bloqueio é policial, aplica-se o art. 210: gravíssima e suspensão; bloqueio viário comum está no art. 209.",
    termosBusca: "bloqueio policial barreira transpor fuga blitz",
  },
  {
    id: "214-i",
    artigo: "Art. 214, I",
    descricao: "Deixar de dar preferência a pedestre que esteja na faixa a ele destinada.",
    gravidade: "gravissima",
    penalidade: "Multa.",
    medidaAdministrativa: "Não especificada no artigo.",
    pegadinha:
      "O inciso I trata do pedestre na faixa; outros incisos tratam de situações diferentes de travessia.",
    termosBusca: "pedestre faixa preferência atravessar",
  },
  {
    id: "218-i",
    artigo: "Art. 218, I",
    descricao: "Transitar em velocidade superior à máxima permitida em até 20%.",
    gravidade: "media",
    penalidade: "Multa.",
    medidaAdministrativa: "Não especificada no artigo.",
    pegadinha: "Até 20%, inclusive, é média; a partir de mais de 20% passa a grave.",
    termosBusca: "velocidade radar limite excesso até 20%",
  },
  {
    id: "218-ii",
    artigo: "Art. 218, II",
    descricao: "Transitar em velocidade superior à máxima permitida em mais de 20% até 50%.",
    gravidade: "grave",
    penalidade: "Multa.",
    medidaAdministrativa: "Não especificada no artigo.",
    pegadinha: "Mais de 20% até 50%, inclusive, é grave.",
    termosBusca: "velocidade radar limite excesso 20 50%",
  },
  {
    id: "218-iii",
    artigo: "Art. 218, III",
    descricao: "Transitar em velocidade superior à máxima permitida em mais de 50%.",
    gravidade: "gravissima",
    multiplicador: 3,
    pontuacao: "suspensiva · sem pontos",
    penalidade: "Multa (3x) e suspensão do direito de dirigir.",
    medidaAdministrativa: "Recolhimento da habilitação.",
    pegadinha: "Somente mais de 50% é gravíssima; exatamente 50% permanece no inciso II.",
    termosBusca: "velocidade radar limite excesso mais de 50% suspensão",
  },
  {
    id: "220-xiv",
    artigo: "Art. 220, XIV",
    descricao:
      "Deixar de reduzir a velocidade ao aproximar-se de escolas, hospitais, estações de embarque e desembarque ou locais com intensa movimentação de pedestres.",
    gravidade: "gravissima",
    penalidade: "Multa.",
    medidaAdministrativa: "Não especificada no artigo.",
    pegadinha:
      "A questão cobra reduzir a velocidade de forma compatível com a segurança, mesmo sem placa indicando limite específico.",
    termosBusca: "escola hospital pedestre reduzir velocidade faixa",
  },
  {
    id: "230-v",
    artigo: "Art. 230, V",
    descricao: "Conduzir veículo que não esteja registrado e devidamente licenciado.",
    gravidade: "gravissima",
    penalidade: "Multa.",
    medidaAdministrativa: "Remoção do veículo.",
    pegadinha:
      "Licenciamento irregular é gravíssima; o prazo e a forma de regularização não mudam a classificação.",
    termosBusca: "licenciamento licenciado registro documento crlv atrasado",
  },
  {
    id: "230-xi",
    artigo: "Art. 230, XI",
    descricao:
      "Conduzir veículo com descarga livre ou silenciador de motor defeituoso, deficiente ou inoperante.",
    gravidade: "grave",
    penalidade: "Multa.",
    medidaAdministrativa: "Retenção do veículo para regularização.",
    pegadinha: "Escapamento irregular/silenciador inoperante é grave, não média.",
    termosBusca: "escapamento descarga livre silenciador barulho",
  },
  {
    id: "230-xviii",
    artigo: "Art. 230, XVIII",
    descricao:
      "Conduzir veículo em mau estado de conservação, comprometendo a segurança, ou reprovado na avaliação de inspeção de segurança e de emissão de poluentes e ruído.",
    gravidade: "grave",
    penalidade: "Multa.",
    medidaAdministrativa: "Retenção do veículo para regularização.",
    pegadinha:
      "O mau estado precisa comprometer a segurança; o enunciado pode mencionar inspeção reprovada.",
    termosBusca: "mau estado conservação segurança inspeção poluentes ruído",
  },
  {
    id: "231-v",
    artigo: "Art. 231, V",
    descricao: "Transitar com excesso de peso, admitido percentual de tolerância quando aplicável.",
    gravidade: "media",
    penalidade: "Multa calculada conforme o excesso apurado.",
    medidaAdministrativa: "Retenção do veículo e transbordo da carga excedente.",
    pegadinha:
      "O valor pode ser calculado por faixa de excesso; não confunda excesso de peso com dimensão excedente.",
    termosBusca: "peso carga excesso balança embarcador transportador",
  },
  {
    id: "232",
    artigo: "Art. 232",
    descricao: "Conduzir veículo sem os documentos de porte obrigatório referidos no CTB.",
    gravidade: "leve",
    pontuacao: "sem pontos na CNH",
    penalidade: "Multa.",
    medidaAdministrativa: "Retenção do veículo até a apresentação do documento.",
    pegadinha:
      "A infração é leve; deixar de licenciar o veículo é outra conduta, prevista no art. 230, V.",
    termosBusca: "documento porte obrigatório documento CNH CRLV esquecimento",
  },
  {
    id: "244-i",
    artigo: "Art. 244, I",
    descricao:
      "Conduzir motocicleta, motoneta ou ciclomotor sem capacete de segurança ou sem vestuário exigido.",
    gravidade: "gravissima",
    penalidade: "Multa e suspensão do direito de dirigir.",
    pontuacao: "suspensiva · sem pontos",
    medidaAdministrativa: "Recolhimento da habilitação e retenção do veículo até regularização.",
    pegadinha:
      "A falta de capacete gera suspensão; capacete sem viseira ou óculos adequados tem enquadramento próprio.",
    termosBusca: "moto motocicleta motoneta ciclomotor capacete vestuário",
  },
  {
    id: "244-ii",
    artigo: "Art. 244, II",
    descricao:
      "Conduzir motocicleta, motoneta ou ciclomotor transportando passageiro sem capacete ou fora do assento suplementar.",
    gravidade: "gravissima",
    penalidade: "Multa e suspensão do direito de dirigir.",
    pontuacao: "suspensiva · sem pontos",
    medidaAdministrativa: "Recolhimento da habilitação e retenção do veículo até regularização.",
    pegadinha: "As regras de segurança também se aplicam ao passageiro transportado.",
    termosBusca: "moto garupa passageiro capacete assento",
  },
  {
    id: "244-v",
    artigo: "Art. 244, V",
    descricao:
      "Conduzir motocicleta, motoneta ou ciclomotor transportando criança menor de 10 anos ou que não tenha condições de cuidar da própria segurança.",
    gravidade: "gravissima",
    penalidade: "Multa e suspensão do direito de dirigir.",
    pontuacao: "suspensiva · sem pontos",
    medidaAdministrativa: "Retenção do veículo até regularização e recolhimento da habilitação.",
    pegadinha:
      "O critério é menor de 10 anos (ou sem condições de segurança), não menor de 7 anos.",
    termosBusca: "moto criança idade 10 anos passageiro garupa",
  },
  {
    id: "250-i",
    artigo: "Art. 250, I",
    descricao:
      "Deixar de manter acesa a luz baixa nas situações exigidas pelo CTB, como à noite e em túneis.",
    gravidade: "media",
    penalidade: "Multa.",
    medidaAdministrativa: "Não especificada no artigo.",
    pegadinha:
      "A obrigatoriedade de luz baixa durante o dia em rodovias depende das condições legais do veículo e da via.",
    termosBusca: "farol luz baixa noite túnel rodovia iluminação",
  },
  {
    id: "252-iv",
    artigo: "Art. 252, IV",
    descricao:
      "Dirigir usando calçado que não se firme nos pés ou comprometa a utilização dos pedais.",
    gravidade: "media",
    penalidade: "Multa.",
    medidaAdministrativa: "Não especificada no artigo.",
    pegadinha:
      "Dirigir descalço não é infração por si só; o calçado é irregular quando compromete os pedais ou não se firma.",
    termosBusca: "chinelo calçado descalço sapato pedais",
  },
  {
    id: "252-vi",
    artigo: "Art. 252, VI",
    descricao:
      "Dirigir usando fones nos ouvidos conectados a aparelhagem sonora ou telefone celular.",
    gravidade: "media",
    penalidade: "Multa.",
    medidaAdministrativa: "Não especificada no artigo.",
    pegadinha:
      "Usar fone é média; segurar ou manusear o celular ao dirigir é gravíssima (art. 252, parágrafo único).",
    termosBusca: "fone ouvido celular telefone dirigir música",
  },
  {
    id: "252-pu",
    artigo: "Art. 252, parágrafo único",
    descricao: "Dirigir segurando ou manuseando telefone celular.",
    gravidade: "gravissima",
    penalidade: "Multa.",
    medidaAdministrativa: "Não especificada no artigo.",
    pegadinha:
      "Segurar ou manusear o celular é gravíssima; utilizar fones conectados é média pelo inciso VI.",
    termosBusca: "celular telefone whatsapp segurando digitando manuseando",
  },
  {
    id: "253-a",
    artigo: "Art. 253-A",
    descricao:
      "Usar veículo para, deliberadamente, interromper, restringir ou perturbar a circulação na via sem autorização.",
    gravidade: "gravissima",
    multiplicador: 20,
    pontuacao: "suspensiva · sem pontos",
    penalidade:
      "Multa (20x) e suspensão por 12 meses; 60x para organizadores e multa em dobro na reincidência em até 12 meses.",
    medidaAdministrativa: "Remoção do veículo.",
    pegadinha:
      "O multiplicador é 20x para o condutor; a lei prevê tratamento distinto para organizadores.",
    termosBusca: "bloqueio via manifestação interromper restringir perturbar circulação",
  },
  {
    id: "254",
    artigo: "Art. 254",
    descricao:
      "O pedestre não pode andar na pista de rolamento, cruzar em local proibido ou fora da faixa/passarela, entre outras condutas previstas no artigo.",
    gravidade: "leve",
    multaBase: 44.19,
    pontuacao: "sem pontos na CNH",
    penalidade: "Multa de 50% do valor da infração de natureza leve.",
    medidaAdministrativa: "Não especificada no artigo.",
    pegadinha:
      "A multa do pedestre corresponde a 50% do valor da infração leve; não gera pontos na CNH.",
    termosBusca: "pedestre pista faixa atravessar multa",
  },
];

export const GRAVIDADE_META: Record<
  GravidadeInfracao,
  { label: string; pontos: number; multaBase: number; className: string }
> = {
  leve: {
    label: "Leve",
    pontos: 3,
    multaBase: 88.38,
    className: "border-emerald-400/40 bg-emerald-400/10 text-emerald-300",
  },
  media: {
    label: "Média",
    pontos: 4,
    multaBase: 130.16,
    className: "border-sky-400/40 bg-sky-400/10 text-sky-300",
  },
  grave: {
    label: "Grave",
    pontos: 5,
    multaBase: 195.23,
    className: "border-amber-400/40 bg-amber-400/10 text-amber-300",
  },
  gravissima: {
    label: "Gravíssima",
    pontos: 7,
    multaBase: 293.47,
    className: "border-rose-400/40 bg-rose-400/10 text-rose-300",
  },
};
