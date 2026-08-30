/* =========================================================
   MUSIC PLAYER
   ========================================================= */


const audioPlayer = document.getElementById("audio-player");

const songImage = document.getElementById("song-image");
const songTitle = document.getElementById("song-title");
const songArtist = document.getElementById("song-artist");

const playButton = document.getElementById("play-button");
const previousButton = document.getElementById("previous-button");
const nextButton = document.getElementById("next-button");

const progressSlider = document.getElementById("song-progress");
const volumeControl = document.getElementById("volume-control");

const currentTimeDisplay = document.getElementById("current-time");
const durationDisplay = document.getElementById("song-duration");


/* =========================================================
   ALL SONG CARDS
   ========================================================= */

const songCards = document.querySelectorAll(".song-card");

let currentSongIndex = 0;


/* =========================================================
   LOAD SONG
   ========================================================= */

function loadSong(index) {

    const card = songCards[index];

    if (!card) {
        return;
    }

    currentSongIndex = index;

    const audio = card.dataset.audio;
    const image = card.dataset.image;
    const title = card.dataset.title;
    const artist = card.dataset.artist;


    audioPlayer.src = audio;

    songImage.src = image;
    songTitle.textContent = title;
    songArtist.textContent = artist;


    progressSlider.value = 0;

    currentTimeDisplay.textContent = "0:00";
    durationDisplay.textContent = "0:00";


    audioPlayer.load();
}


/* =========================================================
   PLAY / PAUSE
   ========================================================= */

function togglePlay() {

    if (audioPlayer.paused) {

        audioPlayer.play();

        playButton.textContent = "Ⅱ";

    } else {

        audioPlayer.pause();

        playButton.textContent = "▶";

    }

}


playButton.addEventListener("click", togglePlay);


/* =========================================================
   SONG CARDS
   ========================================================= */

songCards.forEach((card, index) => {

    card.addEventListener("click", () => {

        loadSong(index);

        audioPlayer.play();

        playButton.textContent = "Ⅱ";

    });

});


/* =========================================================
   NEXT SONG
   ========================================================= */

nextButton.addEventListener("click", () => {

    currentSongIndex++;

    if (currentSongIndex >= songCards.length) {
        currentSongIndex = 0;
    }

    loadSong(currentSongIndex);

    audioPlayer.play();

    playButton.textContent = "Ⅱ";

});


/* =========================================================
   PREVIOUS SONG
   ========================================================= */

previousButton.addEventListener("click", () => {

    currentSongIndex--;

    if (currentSongIndex < 0) {
        currentSongIndex = songCards.length - 1;
    }

    loadSong(currentSongIndex);

    audioPlayer.play();

    playButton.textContent = "Ⅱ";

});


/* =========================================================
   AUDIO PROGRESS
   ========================================================= */

audioPlayer.addEventListener("timeupdate", () => {

    if (!audioPlayer.duration) {
        return;
    }

    const progress =
        (audioPlayer.currentTime / audioPlayer.duration) * 100;

    progressSlider.value = progress;


    currentTimeDisplay.textContent =
        formatTime(audioPlayer.currentTime);

});


/* =========================================================
   SONG DURATION
   ========================================================= */

audioPlayer.addEventListener("loadedmetadata", () => {

    durationDisplay.textContent =
        formatTime(audioPlayer.duration);

});


/* =========================================================
   SEEK
   ========================================================= */

progressSlider.addEventListener("input", () => {

    if (!audioPlayer.duration) {
        return;
    }

    audioPlayer.currentTime =
        (progressSlider.value / 100) * audioPlayer.duration;

});


/* =========================================================
   VOLUME
   ========================================================= */

volumeControl.addEventListener("input", () => {

    audioPlayer.volume = volumeControl.value;

});


/* =========================================================
   AUTOMATICALLY PLAY NEXT SONG
   ========================================================= */

audioPlayer.addEventListener("ended", () => {

    currentSongIndex++;

    if (currentSongIndex >= songCards.length) {
        currentSongIndex = 0;
    }

    loadSong(currentSongIndex);

    audioPlayer.play();

});


/* =========================================================
   TIME FORMAT
   ========================================================= */

function formatTime(seconds) {

    if (isNaN(seconds)) {
        return "0:00";
    }

    const minutes = Math.floor(seconds / 60);

    const remainingSeconds =
        Math.floor(seconds % 60);

    return minutes + ":" +
        String(remainingSeconds).padStart(2, "0");

}


/* =========================================================
   FIRST SONG
   ========================================================= */

if (songCards.length > 0) {

    loadSong(0);

}