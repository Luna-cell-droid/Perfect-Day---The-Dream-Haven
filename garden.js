/* =========================================================
   GARDEN
   ========================================================= */


/* ---------------------------------------------------------
   GARDEN PROGRESS
   --------------------------------------------------------- */

const progressBar = document.getElementById("garden-progress");
const progressPercentage = document.getElementById("garden-percentage");
const gardenMessage = document.querySelector(".progress-text h2");


/* ---------------------------------------------------------
   GET SAVED PROGRESS
   --------------------------------------------------------- */

let gardenProgress = Number(
    localStorage.getItem("gardenProgress")
) || 0;


/* ---------------------------------------------------------
   UPDATE GARDEN
   --------------------------------------------------------- */

function updateGardenProgress(progress) {

    progress = Math.max(0, Math.min(100, progress));

    gardenProgress = progress;

    progressBar.style.width = progress + "%";
    progressPercentage.textContent = progress + "%";

    localStorage.setItem("gardenProgress", progress);


    /* Change message depending on growth */

    if (progress === 0) {

        gardenMessage.textContent =
            "Something is waiting to grow...";

    } else if (progress < 25) {

        gardenMessage.textContent =
            "A little sprout is appearing...";

    } else if (progress < 50) {

        gardenMessage.textContent =
            "Your garden is starting to grow!";

    } else if (progress < 75) {

        gardenMessage.textContent =
            "Look at your garden growing!";

    } else if (progress < 100) {

        gardenMessage.textContent =
            "Your garden is almost flourishing...";

    } else {

        gardenMessage.textContent =
            "Your garden is fully grown! ✨";

    }

}


/* ---------------------------------------------------------
   WATER THE GARDEN
   --------------------------------------------------------- */

function waterGarden(amount) {

    const newProgress = gardenProgress + amount;

    updateGardenProgress(newProgress);

}


/* ---------------------------------------------------------
   RESET GARDEN
   --------------------------------------------------------- */

function resetGarden() {

    updateGardenProgress(0);

}


/* ---------------------------------------------------------
   START GARDEN
   --------------------------------------------------------- */

updateGardenProgress(gardenProgress);