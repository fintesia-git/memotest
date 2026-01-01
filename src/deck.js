export function generateDeck() {
  const palos = ["oros", "copas", "espadas", "bastos"];
  const valores = Array.from({ length: 12 }, (_, i) => i + 1);

  const deck = [];

  // Dos mazos → dos copias de cada carta
  for (let mazo = 1; mazo <= 2; mazo++) {
    for (let palo of palos) {
      for (let valor of valores) {
        const padded = String(valor).padStart(2, "0");
        const code = `${padded}-${palo}`;
        const matchKey = `${padded}-${palo}`;

        deck.push({
          code,
          matchKey,
          faceUp: false,
          removed: false
        });
      }
    }
  }

  // Añadir 4 jokers que emparejan entre sí (cualquiera con cualquiera)
  for (let i = 0; i < 4; i++) {
    deck.push({
      code: `joker`,
      matchKey: `joker`,
      faceUp: false,
      removed: false
    });
  }

  return deck;
}

export function shuffle(array) {
  const arr = [...array];

  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  return arr;
}

export function buildBoard() {
  const deck = shuffle(generateDeck());

  // Crear tablero fijo de 10x10 (100 cartas)
  const rows = 10;
  const cols = 10;
  const board = [];
  let index = 0;

  for (let row = 0; row < rows; row++) {
    const rowArr = [];
    for (let col = 0; col < cols; col++) {
      rowArr.push(deck[index++]);
    }
    board.push(rowArr);
  }

  return board;
}

export function getCardLabel(code) {
  const [valor, palo] = code.split("-");

  const palos = {
    oros: "Oros",
    copas: "Copas",
    espadas: "Espadas",
    bastos: "Bastos"
  };

  return `${valor} de ${palos[palo]}`;
}

export function getCardImage(code) {
  if (code === 'joker' || code.startsWith('joker')) return `/cards/joker.png`;
  return `/cards/${code}.png`;
}
