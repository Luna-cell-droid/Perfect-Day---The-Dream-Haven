const sky = document.getElementById("night-sky");
const scoreDisplay = document.getElementById("score");
const timerDisplay = document.getElementById("timer");
const startBtn = document.getElementById("start-btn");

let score = 0;
let timeLeft = 20;
let gameInterval = null;
let fireflyTimeout = null;

function spawnFirefly() {
  sky.innerHTML = ""; // Clear existing firefly

  const firefly = document.createElement("div");
  firefly.classList.add("firefly");

  // Keep fireflies fully within bounds (card size minus margins)
  const maxX = sky.clientWidth - 30;
  const maxY = sky.clientHeight - 30;

  const randomX = Math.floor(Math.random() * maxX);
  const randomY = Math.floor(Math.random() * maxY);

  firefly.style.left = `${randomX}px`;
  firefly.style.top = `${randomY}px`;

  // Click handler to catch
  firefly.addEventListener("click", () => {
    score++;
    scoreDisplay.textContent = score;
    clearTimeout(fireflyTimeout);
    spawnFirefly();
  });

  sky.appendChild(firefly);

  // Automatically move the firefly after 1.2 seconds if not caught
  fireflyTimeout = setTimeout(spawnFirefly, 1200);
}

function startGame() {
  score = 0;
  timeLeft = 20;
  scoreDisplay.textContent = score;
  timerDisplay.textContent = timeLeft;
  startBtn.disabled = true;

  spawnFirefly();

  // Timer Countdown
  gameInterval = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(gameInterval);
      clearTimeout(fireflyTimeout);
      sky.innerHTML = `<div class="overlay-msg">✨ Time's up! You caught ${score} fireflies! ✨</div>`;
      startBtn.disabled = false;
    }
  }, 1000);
}

startBtn.addEventListener("click", startGame);