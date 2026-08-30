document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       PLAYER ELEMENTS
    ===================================================== */

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

    const songCards = document.querySelectorAll(".song-card");


    /* =====================================================
       VARIABLES
    ===================================================== */

    let currentSongIndex = 0;
    let player = null;
    let playerReady = false;
    let progressInterval = null;


    /* =====================================================
       CHECK ELEMENTS
    ===================================================== */

    if (!playButton) {
        console.error("play-button was not found.");
        return;
    }

    if (!songCards.length) {
        console.error("No song cards were found.");
        return;
    }


    /* =====================================================
       CREATE YOUTUBE PLAYER CONTAINER
    ===================================================== */

    let youtubeContainer =
        document.getElementById("youtube-player");

    if (!youtubeContainer) {

        youtubeContainer =
            document.createElement("div");

        youtubeContainer.id = "youtube-player";

        document.body.appendChild(youtubeContainer);
    }


    /*
       Hide the actual YouTube player.

       Your own player controls are what the user sees.
    */

    youtubeContainer.style.position = "fixed";
    youtubeContainer.style.width = "1px";
    youtubeContainer.style.height = "1px";
    youtubeContainer.style.left = "-1000px";
    youtubeContainer.style.top = "-1000px";
    youtubeContainer.style.opacity = "0";
    youtubeContainer.style.pointerEvents = "none";


    /* =====================================================
       LOAD YOUTUBE API
    ===================================================== */

    window.onYouTubeIframeAPIReady = function () {

        player = new YT.Player("youtube-player", {

            width: "1",
            height: "1",

            videoId: "",

            playerVars: {
                autoplay: 0,
                controls: 0,
                rel: 0,
                modestbranding: 1,
                playsinline: 1
            },

            events: {

                onReady: function () {

                    playerReady = true;

                    player.setVolume(100);

                    console.log("YouTube player is ready!");

                },

                onStateChange: function (event) {

                    /* PLAYING */

                    if (
                        event.data ===
                        YT.PlayerState.PLAYING
                    ) {

                        playButton.textContent = "Ⅱ";

                        startProgress();

                    }


                    /* PAUSED */

                    if (
                        event.data ===
                        YT.PlayerState.PAUSED
                    ) {

                        playButton.textContent = "▶";

                        stopProgress();

                    }


                    /* ENDED */

                    if (
                        event.data ===
                        YT.PlayerState.ENDED
                    ) {

                        playButton.textContent = "▶";

                        stopProgress();

                        playNextSong();

                    }

                },

                onError: function (event) {

                    console.error(
                        "YouTube player error:",
                        event.data
                    );

                }

            }

        });

    };


    /* =====================================================
       ADD YOUTUBE API SCRIPT
    ===================================================== */

    const youtubeScript =
        document.createElement("script");

    youtubeScript.src =
        "https://www.youtube.com/iframe_api";

    document.head.appendChild(youtubeScript);


    /* =====================================================
       LOAD SONG
    ===================================================== */

    function loadSong(index, playImmediately = false) {

        const card = songCards[index];

        if (!card) {
            return;
        }


        currentSongIndex = index;


        /* Remove active class */

        songCards.forEach(function (item) {

            item.classList.remove("active");

        });


        /* Add active class */

        card.classList.add("active");


        /* Get information */

        const youtubeID =
            card.dataset.youtube;

        const image =
            card.dataset.image;

        const title =
            card.dataset.title;

        const artist =
            card.dataset.artist;


        console.log("Loading song:", youtubeID);


        /* Update player */

        if (image) {
            songImage.src = image;
        }

        if (title) {
            songTitle.textContent = title;
        }

        if (artist) {
            songArtist.textContent = artist;
        }


        /* Reset progress */

        progressSlider.value = 0;

        currentTimeDisplay.textContent =
            "0:00";

        durationDisplay.textContent =
            "0:00";


        /* Stop old song */

        stopProgress();


        if (!playerReady || !player) {

            console.log(
                "YouTube player isn't ready yet."
            );

            return;
        }


        /* Load YouTube video */

        player.cueVideoById(youtubeID);


        /*
           IMPORTANT:
           If the user clicked the card,
           play immediately.
        */

        if (playImmediately) {

            player.playVideo();

        }

    }


    /* =====================================================
       PLAY / PAUSE
    ===================================================== */

    playButton.addEventListener(
        "click",
        function () {

            if (!playerReady || !player) {

                console.log(
                    "YouTube player is not ready."
                );

                return;
            }


            const state =
                player.getPlayerState();


            /* Currently playing */

            if (
                state === YT.PlayerState.PLAYING
            ) {

                player.pauseVideo();

            }


            /* Currently paused / ready */

            else {

                player.playVideo();

            }

        }
    );


    /* =====================================================
       SONG CARD CLICK
    ===================================================== */

    songCards.forEach(function (card, index) {

        card.addEventListener(
            "click",
            function () {

                console.log(
                    "Card clicked:",
                    card.dataset.title
                );

                loadSong(index, true);

            }
        );

    });


    /* =====================================================
       NEXT
    ===================================================== */

    nextButton.addEventListener(
        "click",
        function () {

            playNextSong();

        }
    );


    function playNextSong() {

        currentSongIndex =
            (currentSongIndex + 1)
            % songCards.length;

        loadSong(currentSongIndex, true);

    }


    /* =====================================================
       PREVIOUS
    ===================================================== */

    previousButton.addEventListener(
        "click",
        function () {

            currentSongIndex =
                (currentSongIndex - 1 +
                songCards.length)
                % songCards.length;

            loadSong(currentSongIndex, true);

        }
    );


    /* =====================================================
       PROGRESS
    ===================================================== */

    function startProgress() {

        stopProgress();

        progressInterval =
            setInterval(function () {

                if (!playerReady || !player) {
                    return;
                }


                const current =
                    player.getCurrentTime();

                const duration =
                    player.getDuration();


                if (!duration) {
                    return;
                }


                const percentage =
                    (current / duration) * 100;


                progressSlider.value =
                    percentage;


                currentTimeDisplay.textContent =
                    formatTime(current);

                durationDisplay.textContent =
                    formatTime(duration);

            }, 250);

    }


    /* =====================================================
       STOP PROGRESS
    ===================================================== */

    function stopProgress() {

        if (progressInterval) {

            clearInterval(progressInterval);

            progressInterval = null;

        }

    }


    /* =====================================================
       SEEK
    ===================================================== */

    progressSlider.addEventListener(
        "input",
        function () {

            if (!playerReady || !player) {
                return;
            }

            const duration =
                player.getDuration();

            if (!duration) {
                return;
            }

            const newTime =
                (progressSlider.value / 100)
                * duration;

            player.seekTo(
                newTime,
                true
            );

        }
    );


    /* =====================================================
       VOLUME
    ===================================================== */

    volumeControl.addEventListener(
        "input",
        function () {

            if (!playerReady || !player) {
                return;
            }

            player.setVolume(
                Number(this.value)
            );

        }
    );


    /* =====================================================
       FORMAT TIME
    ===================================================== */

    function formatTime(seconds) {

        if (
            !seconds ||
            isNaN(seconds)
        ) {

            return "0:00";

        }


        const minutes =
            Math.floor(seconds / 60);

        const remainingSeconds =
            Math.floor(seconds % 60);


        return (
            minutes +
            ":" +
            String(
                remainingSeconds
            ).padStart(2, "0")
        );

    }


    /* =====================================================
       INITIAL SONG
    ===================================================== */

    loadSong(0, false);

});