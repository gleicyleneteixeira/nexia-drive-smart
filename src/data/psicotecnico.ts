export interface MemoryElement {
  id: string;
  name: string;
  aliases: string[];
}

export const COMPLETE_MEMORY_ELEMENTS: MemoryElement[] = [
  // --- ZONA AÉREA E CÉU ---
  { id: 'aviao', name: 'Avião', aliases: ['aviao', 'avioes', 'aeroplano', 'jatinho'] },
  { id: 'balao', name: 'Balão', aliases: ['balao', 'baloes', 'aerostato'] },
  { id: 'helicoptero', name: 'Helicóptero', aliases: ['helicoptero', 'helicopteros', 'coptero'] },
  { id: 'paraquedas', name: 'Paraquedas', aliases: ['paraquedas', 'paraquedista', 'para queda', 'para quedas'] },
  { id: 'foguete', name: 'Foguete', aliases: ['foguete', 'foguetes', 'nave', 'nave espacial', 'míssil', 'missil'] },
  { id: 'sol', name: 'Sol', aliases: ['sol', 'dia ensolarado'] },
  { id: 'nuvem', name: 'Nuvem', aliases: ['nuvem', 'nuvens'] },
  { id: 'passaro', name: 'Pássaro', aliases: ['passaro', 'passaros', 'aves', 'ave', 'gaivota', 'gaivotas'] },
  { id: 'pipa', name: 'Pipa', aliases: ['pipa', 'pipas', 'papagaio', 'pandorga', 'raia', 'cafifa'] },

  // --- ZONA DA CASA E CONSTRUÇÕES ---
  { id: 'casa', name: 'Casa', aliases: ['casa', 'casas', 'residencia', 'sobrado', 'lar'] },
  { id: 'chamine', name: 'Chaminé', aliases: ['chamine', 'chamines', 'chaminé de fumaça'] },
  { id: 'fumaca', name: 'Fumaça', aliases: ['fumaca', 'fumacas'] },
  { id: 'janela', name: 'Janela', aliases: ['janela', 'janelas', 'vidraça'] },
  { id: 'telhado', name: 'Telhado', aliases: ['telhado', 'telhados', 'teto', 'coberta'] },
  { id: 'porta', name: 'Porta', aliases: ['porta', 'portas', 'portao'] },
  { id: 'caminho', name: 'Caminho', aliases: ['caminho', 'caminhos', 'estrada', 'trilha', 'rua', 'passarela', 'calçada', 'calcada'] },
  { id: 'poco', name: 'Poço', aliases: ['poco', 'pocos', 'poço de agua', 'poco de agua'] },

  // --- ZONA DE PARQUE E LAZER ---
  { id: 'escorregador', name: 'Escorregador', aliases: ['escorregador', 'escorregadores', 'toboga', 'escorrega'] },
  { id: 'balanco', name: 'Balanço', aliases: ['balanco', 'balancinho', 'balanços'] },
  { id: 'gangorra', name: 'Gangorra', aliases: ['gangorra', 'gangorras'] },
  { id: 'basquete', name: 'Tabela de Basquete', aliases: ['tabela de basquete', 'basquete', 'cesta de basquete', 'cesta', 'arremesso'] },
  { id: 'bola', name: 'Bola', aliases: ['bola', 'bolas', 'pelota', 'bola de basquete'] },
  { id: 'mesa_cadeiras', name: 'Mesa e Cadeiras', aliases: ['mesa', 'mesas', 'cadeira', 'cadeiras', 'conjunto de mesa', 'mesa com cadeiras'] },

  // --- ZONA DE TRANSPORTE E TERRENO ---
  { id: 'carro', name: 'Carro', aliases: ['carro', 'carros', 'automovel', 'veiculo', 'fusca'] },
  { id: 'arco_iris', name: 'Arco-íris', aliases: ['arco iris', 'arco-iris', 'arcoiris'] },
  { id: 'trampolim', name: 'Prancha de Salto / Trampolim', aliases: ['trampolim', 'prancha', 'prancha de salto', 'plataforma', 'rampa', 'deck'] },
  { id: 'lancha', name: 'Lancha / Jet Ski', aliases: ['lancha', 'jet ski', 'jetski', 'barco a motor', 'bote'] },
  { id: 'barco', name: 'Barco a Vela', aliases: ['barco', 'barco a vela', 'veleiro', 'canoa', 'bote'] },
  { id: 'surfista', name: 'Prancha de Surf / Surfista', aliases: ['surfista', 'prancha de surf', 'surf', 'marujo'] },

  // --- ZONA DE ACAMPAMENTO E NATUREZA ---
  { id: 'barraca', name: 'Barraca / Tenda', aliases: ['barraca', 'barracas', 'tenda', 'acampamento', 'barraca de camping'] },
  { id: 'fogueira', name: 'Fogueira', aliases: ['fogueira', 'fogueiras', 'fogo', 'chama'] },
  { id: 'arvore', name: 'Árvore', aliases: ['arvore', 'arvores', 'planta', 'arbusto'] },
  { id: 'pescador', name: 'Pescador', aliases: ['pescador', 'pescaria', 'homem pescando', 'pesca'] },
  { id: 'peixe', name: 'Peixe', aliases: ['peixe', 'peixes', 'peixinho'] }
];
