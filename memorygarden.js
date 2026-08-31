const flowers = ["🌸", "🌹", "🌻", "🌺", "🌷", "🌼"];
let deck = [...flowers, ...flowers];
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;

const grid = document.getElementById("memory-grid");
const matchesDisplay = document.getElementById("matches-count");
const movesDisplay = document.getElementById("moves-count");
const winMessage = document.getElementById("win-message");
const resetBtn = document.getElementById("reset-btn");

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function createBoard() {
  grid.innerHTML = "";
  flippedCards = [];
  matchedPairs = 0;
  moves = 0;
  matchesDisplay.textContent = matchedPairs;
  movesDisplay.textContent = moves;
  winMessage.classList.add("hidden");

  const shuffledDeck = shuffle([...deck]);

  shuffledDeck.forEach((flower) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.flower = flower;

    const content = document.createElement("span");
    content.classList.add("content");
    content.textContent = flower;
    card.appendChild(content);

    card.addEventListener("click", () => handleCardClick(card));
    grid.appendChild(card);
  });
}

function handleCardClick(card) {
  if (
    card.classList.contains("flipped") ||
    card.classList.contains("matched") ||
    flippedCards.length === 2
  ) {
    return;
  }

  card.classList.add("flipped");
  flippedCards.push(card);

  if (flippedCards.length === 2) {
    moves++;
    movesDisplay.textContent = moves;
    checkMatch();
  }
}

function checkMatch() {
  const [card1, card2] = flippedCards;

  if (card1.dataset.flower === card2.dataset.flower) {
    card1.classList.add("matched");
    card2.classList.add("matched");
    matchedPairs++;
    matchesDisplay.textContent = matchedPairs;
    flippedCards = [];

    if (matchedPairs === flowers.length) {
      winMessage.classList.remove("hidden");
    }
  } else {
    setTimeout(() => {
      card1.classList.remove("flipped");
      card2.classList.remove("flipped");
      flippedCards = [];
    }, 900);
  }
}

resetBtn.addEventListener("click", createBoard);
createBoard();