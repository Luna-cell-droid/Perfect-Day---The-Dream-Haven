const clouds = ["☁️", "🌧️", "🌩️", "🌤️", "☀️", "🌈"];
let deck = [...clouds, ...clouds];
let flipped = [];
let matchedCount = 0;

const grid = document.getElementById("cloud-grid");
const pairsDisplay = document.getElementById("pairs-count");
const winMessage = document.getElementById("win-message");
const resetBtn = document.getElementById("reset-btn");

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function initGame() {
  grid.innerHTML = "";
  flipped = [];
  matchedCount = 0;
  pairsDisplay.textContent = matchedCount;
  winMessage.classList.add("hidden");

  const shuffled = shuffle([...deck]);

  shuffled.forEach((item) => {
    const card = document.createElement("div");
    card.classList.add("cloud-card");
    card.dataset.symbol = item;

    const content = document.createElement("span");
    content.classList.add("content");
    content.textContent = item;
    card.appendChild(content);

    card.addEventListener("click", () => handleFlip(card));
    grid.appendChild(card);
  });
}

function handleFlip(card) {
  if (
    card.classList.contains("flipped") ||
    card.classList.contains("matched") ||
    flipped.length === 2
  ) {
    return;
  }

  card.classList.add("flipped");
  flipped.push(card);

  if (flipped.length === 2) {
    if (flipped[0].dataset.symbol === flipped[1].dataset.symbol) {
      flipped[0].classList.add("matched");
      flipped[1].classList.add("matched");
      matchedCount++;
      pairsDisplay.textContent = matchedCount;
      flipped = [];

      if (matchedCount === clouds.length) {
        winMessage.classList.remove("hidden");
      }
    } else {
      setTimeout(() => {
        flipped[0].classList.remove("flipped");
        flipped[1].classList.remove("flipped");
        flipped = [];
      }, 800);
    }
  }
}

resetBtn.addEventListener("click", initGame);
initGame();