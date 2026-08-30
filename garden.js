/* =========================================================
   GARDEN
   ========================================================= */


/* ---------------------------------------------------------
   GARDEN PROGRESS
   --------------------------------------------------------- */

const progressBar = document.getElementById("garden-progress");
const progressPercentage = document.getElementById("garden-percentage");


function updateGardenProgress(progress) {

    progress = Math.max(0, Math.min(100, progress));

    progressBar.style.width = progress + "%";
    progressPercentage.textContent = progress + "%";

}


/* ---------------------------------------------------------
   STARTING PROGRESS
   --------------------------------------------------------- */

let gardenProgress = 0;

updateGardenProgress(gardenProgress);