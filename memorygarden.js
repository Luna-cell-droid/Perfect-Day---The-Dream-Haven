// 1. Flower dataset (6 matching pairs = 12 total cards)
const flowers = ["🌸", "🌹", "🌻", "🌺", "🌷", "🌼"];
let deck = [...flowers, ...flowers];

// 2. State variables
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;

// 3. DOM Elements
const grid = document.getElementById("memory-grid");
const matchesDisplay = document.getElementById("matches-count");
const movesDisplay = document.getElementById("moves-count");
const winMessage = document.getElementById("win-message");
const resetBtn = document.getElementById("reset-btn");

// 4. Shuffle algorithm (Randomizes flower positions on every reset)
function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

// 5. Initialize / Reset the game board
function createBoard() {
  grid.innerHTML = "";
  flippedCards = [];
  matchedPairs = 0;
  moves = 0;
  
  matchesDisplay.textContent = matchedPairs;
  movesDisplay.textContent = moves;
  winMessage.classList.add("hidden");

  // Shuffle deck so flowers appear in new positions
  const shuffledDeck = shuffle([...deck]);

  // Create 12 card elements dynamically
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

// 6. Card click handler
function handleCardClick(card) {
  // Prevent flipping already flipped/matched cards or selecting more than 2 at once
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

// 7. Check if two selected cards match
function checkMatch() {
  const [card1, card2] = flippedCards;

  if (card1.dataset.flower === card2.dataset.flower) {
    // Match found!
    card1.classList.add("matched");
    card2.classList.add("matched");
    matchedPairs++;
    matchesDisplay.textContent = matchedPairs;
    flippedCards = [];

    // Check win condition
    if (matchedPairs === flowers.length) {
      winMessage.classList.remove("hidden");
    }
  } else {
    // No match: Flip back after delay
    setTimeout(() => {
      card1.classList.remove("flipped");
      card2.classList.remove("flipped");
      flippedCards = [];
    }, 900);
  }
}

// 8. Event Listener & Initial Start
resetBtn.addEventListener("click", createBoard);
createBoard();