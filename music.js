document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       PLAYER ELEMENTS
    ===================================================== */

    const songImageContainer = document.getElementById("song-image-container");
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
       EXPANDED SVG GENERATOR FOR SONG ARTWORK
    ===================================================== */

    function generateDynamicSVG(seedInput) {
        let hash = 0;
        const str = String(seedInput);
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }

        function seededRandom(offset = 0) {
            const x = Math.sin(hash + offset) * 10000;
            return x - Math.floor(x);
        }

        const colorPalettes = [
            ["#23192e", "#443453", "#745b88", "#a890bd", "#e3cded", "#f3ebf7"],
            ["#1c1626", "#3b2a4a", "#63477b", "#9073aa", "#caafd8", "#f0e6f5"],
            ["#2b182b", "#522f52", "#804c80", "#b37bb3", "#e0b3e0", "#f7e6f7"],
            ["#251d38", "#42335e", "#68528f", "#937bc2", "#c4b4eb", "#ece4fb"]
        ];

        const paletteIndex = Math.floor(seededRandom(1) * colorPalettes.length);
        const palette = colorPalettes[paletteIndex];

        const gradAngle = Math.floor(seededRandom(2) * 360);
        // 8 types: Flower, Star, Moon, Heart, Butterfly, Music Note, Diamond Sparkle, Planet Orbit
        const mainShapeType = Math.floor(seededRandom(3) * 8);

        const gradId = "grad_" + Math.abs(hash);

        // Background Gradient
        let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="100%" height="100%">
            <defs>
                <linearGradient id="${gradId}" x1="0%" y1="0%" x2="100%" y2="100%" gradientTransform="rotate(${gradAngle})">
                    <stop offset="0%" stop-color="${palette[0]}" />
                    <stop offset="50%" stop-color="${palette[1]}" />
                    <stop offset="100%" stop-color="${palette[2]}" />
                </linearGradient>
            </defs>
            <rect width="300" height="300" fill="url(#${gradId})" />`;

        // Secondary background ambient glow
        const glowX = 50 + seededRandom(4) * 200;
        const glowY = 50 + seededRandom(5) * 200;
        const glowR = 80 + seededRandom(6) * 80;
        svg += `<circle cx="${glowX}" cy="${glowY}" r="${glowR}" fill="${palette[3]}" opacity="0.22" />`;

        // Background floating cloud curves
        if (seededRandom(15) > 0.4) {
            svg += `<g opacity="0.15" fill="${palette[4]}">
                <path d="M 20,240 Q 60,200 120,230 Q 180,260 240,210 Q 280,240 300,220 L 300,300 L 0,300 Z" />
            </g>`;
        }

        // Background floating sparkle dots
        const sparkCount = 5 + Math.floor(seededRandom(7) * 4);
        for (let i = 0; i < sparkCount; i++) {
            const sx = 30 + seededRandom(10 + i) * 240;
            const sy = 30 + seededRandom(20 + i) * 240;
            const size = 3 + seededRandom(30 + i) * 5;
            const sparkOp = 0.35 + seededRandom(40 + i) * 0.5;

            svg += `<g transform="translate(${sx}, ${sy})" opacity="${sparkOp}">
                <path d="M0,-${size} Q0,0 ${size},0 Q0,0 0,${size} Q0,0 -${size},0 Q0,0 0,-${size}" fill="${palette[5]}" />
            </g>`;
        }

        // Main Center Hero Elements
        const centerX = 150;
        const centerY = 150;
        const mainColor = palette[4];
        const strokeColor = palette[5];

        if (mainShapeType === 0) {
            // 1. Flower
            const petalCount = 5 + Math.floor(seededRandom(8) * 3);
            const petalRadius = 28 + seededRandom(9) * 10;
            const centerR = 14 + seededRandom(10) * 6;

            svg += `<g transform="translate(${centerX}, ${centerY})">`;
            for (let i = 0; i < petalCount; i++) {
                const angle = (i * 360) / petalCount;
                const rad = (angle * Math.PI) / 180;
                const px = Math.cos(rad) * petalRadius;
                const py = Math.sin(rad) * petalRadius;
                svg += `<circle cx="${px}" cy="${py}" r="${petalRadius * 0.85}" fill="${mainColor}" opacity="0.85" />`;
            }
            svg += `<circle cx="0" cy="0" r="${centerR}" fill="${palette[1]}" stroke="${strokeColor}" stroke-width="3" />`;
            svg += `</g>`;

        } else if (mainShapeType === 1) {
            // 2. Star
            const starSize = 45 + seededRandom(8) * 15;
            svg += `<g transform="translate(${centerX}, ${centerY})" opacity="0.9">
                <path d="M0,-${starSize} Q0,0 ${starSize},0 Q0,0 0,${starSize} Q0,0 -${starSize},0 Q0,0 0,-${starSize}" fill="${mainColor}" stroke="${strokeColor}" stroke-width="2" />
            </g>`;

        } else if (mainShapeType === 2) {
            // 3. Moon
            svg += `<g transform="translate(${centerX}, ${centerY}) rotate(-20)">
                <path d="M 0,-45 A 45 45 0 1 0 45,0 A 35 35 0 1 1 0,-45 Z" fill="${mainColor}" opacity="0.9" />
            </g>`;

        } else if (mainShapeType === 3) {
            // 4. Heart
            svg += `<g transform="translate(${centerX}, ${centerY - 10}) scale(1.6)" opacity="0.85">
                <path d="M 0,20 C -20,0 -30,-15 -15,-25 C -5,-32 0,-15 0,-10 C 0,-15 5,-32 15,-25 C 30,-15 20,0 0,20 Z" fill="${mainColor}" stroke="${strokeColor}" stroke-width="1.5" />
            </g>`;

        } else if (mainShapeType === 4) {
            // 5. Butterfly
            svg += `<g transform="translate(${centerX}, ${centerY})" opacity="0.9">
                <!-- Left Upper Wing -->
                <path d="M 0,-5 C -25,-45 -65,-30 -40,10 C -20,30 0,5 0,-5 Z" fill="${mainColor}" />
                <!-- Right Upper Wing -->
                <path d="M 0,-5 C 25,-45 65,-30 40,10 C 20,30 0,5 0,-5 Z" fill="${mainColor}" />
                <!-- Left Lower Wing -->
                <path d="M 0,5 C -35,15 -45,45 -15,40 C 0,35 0,5 0,5 Z" fill="${palette[3]}" />
                <!-- Right Lower Wing -->
                <path d="M 0,5 C 35,15 45,45 15,40 C 0,35 0,5 0,5 Z" fill="${palette[3]}" />
                <!-- Body -->
                <ellipse cx="0" cy="2" rx="3" ry="22" fill="${strokeColor}" />
                <!-- Antennae -->
                <path d="M -1,-18 Q -10,-30 -18,-28 M 1,-18 Q 10,-30 18,-28" stroke="${strokeColor}" stroke-width="2" fill="none" stroke-linecap="round" />
            </g>`;

        } else if (mainShapeType === 5) {
            // 6. Music Note (Eighth Notes Joined)
            svg += `<g transform="translate(${centerX - 15}, ${centerY - 25}) scale(1.2)" opacity="0.9">
                <!-- Left Note Head -->
                <ellipse cx="10" cy="40" rx="9" ry="6" transform="rotate(-20 10 40)" fill="${mainColor}" />
                <!-- Right Note Head -->
                <ellipse cx="38" cy="32" rx="9" ry="6" transform="rotate(-20 38 32)" fill="${mainColor}" />
                <!-- Stems -->
                <rect x="16" y="8" width="4" height="32" fill="${mainColor}" />
                <rect x="44" y="0" width="4" height="32" fill="${mainColor}" />
                <!-- Beam -->
                <polygon points="16,8 48,0 48,8 16,16" fill="${strokeColor}" />
            </g>`;

        } else if (mainShapeType === 6) {
            // 7. Sparkling Diamond
            svg += `<g transform="translate(${centerX}, ${centerY})" opacity="0.9">
                <polygon points="0,-45 35,0 0,45 -35,0" fill="${mainColor}" stroke="${strokeColor}" stroke-width="2" />
                <polygon points="0,-45 15,0 0,45 -15,0" fill="${palette[3]}" opacity="0.5" />
                <line x1="-35" y1="0" x2="35" y2="0" stroke="${strokeColor}" stroke-width="1.5" />
            </g>`;

        } else {
            // 8. Celestial Planet & Ring
            svg += `<g transform="translate(${centerX}, ${centerY})" opacity="0.9">
                <!-- Orbit Ring Back -->
                <path d="M -55,0 A 55 18 0 0 1 55,0" fill="none" stroke="${palette[3]}" stroke-width="5" opacity="0.5" />
                <!-- Central Planet Body -->
                <circle cx="0" cy="0" r="28" fill="${mainColor}" />
                <circle cx="-8" cy="-8" r="22" fill="${palette[5]}" opacity="0.2" />
                <!-- Orbit Ring Front -->
                <path d="M 55,0 A 55 18 0 0 1 -55,0" fill="none" stroke="${strokeColor}" stroke-width="5" />
            </g>`;
        }

        // Corner Accent Sparkle
        const cornerSparkleX = 40 + seededRandom(80) * 20;
        const cornerSparkleY = 40 + seededRandom(81) * 20;
        svg += `<g transform="translate(${cornerSparkleX}, ${cornerSparkleY})" opacity="0.8">
            <path d="M0,-12 Q0,0 12,0 Q0,0 0,12 Q0,0 -12,0 Q0,0 0,-12" fill="${palette[5]}" />
        </g>`;

        svg += `</svg>`;
        return svg;
    }


    /* =====================================================
       POPULATE ALL CARD ARTWORKS
    ===================================================== */

    songCards.forEach(function (card, index) {
        const artContainer = card.querySelector(".card-art");
        if (artContainer) {
            const seed = card.dataset.title || index;
            artContainer.innerHTML = generateDynamicSVG(seed);
        }
    });


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

    let youtubeContainer = document.getElementById("youtube-player");

    if (!youtubeContainer) {
        youtubeContainer = document.createElement("div");
        youtubeContainer.id = "youtube-player";
        document.body.appendChild(youtubeContainer);
    }

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

                    if (event.data === YT.PlayerState.PLAYING) {
                        playButton.textContent = "Ⅱ";
                        startProgress();
                    }

                    if (event.data === YT.PlayerState.PAUSED) {
                        playButton.textContent = "▶";
                        stopProgress();
                    }

                    if (event.data === YT.PlayerState.ENDED) {
                        playButton.textContent = "▶";
                        stopProgress();
                        playNextSong();
                    }

                },

                onError: function (event) {
                    console.error("YouTube player error:", event.data);
                }

            }

        });

    };


    /* =====================================================
       ADD YOUTUBE API SCRIPT
    ===================================================== */

    const youtubeScript = document.createElement("script");
    youtubeScript.src = "https://www.youtube.com/iframe_api";
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

        songCards.forEach(function (item) {
            item.classList.remove("active");
        });

        card.classList.add("active");

        const youtubeID = card.dataset.youtube;
        const title = card.dataset.title;
        const artist = card.dataset.artist;

        if (songImageContainer) {
            const seed = title || index;
            songImageContainer.innerHTML = generateDynamicSVG(seed);
        }

        if (title) {
            songTitle.textContent = title;
        }

        if (artist) {
            songArtist.textContent = artist;
        }

        progressSlider.value = 0;
        currentTimeDisplay.textContent = "0:00";
        durationDisplay.textContent = "0:00";

        stopProgress();

        if (!playerReady || !player) {
            console.log("YouTube player isn't ready yet.");
            return;
        }

        player.cueVideoById(youtubeID);

        if (playImmediately) {
            player.playVideo();
        }

    }


    /* =====================================================
       PLAY / PAUSE
    ===================================================== */

    playButton.addEventListener("click", function () {

        if (!playerReady || !player) {
            console.log("YouTube player is not ready.");
            return;
        }

        const state = player.getPlayerState();

        if (state === YT.PlayerState.PLAYING) {
            player.pauseVideo();
        } else {
            player.playVideo();
        }

    });


    /* =====================================================
       SONG CARD CLICK
    ===================================================== */

    songCards.forEach(function (card, index) {

        card.addEventListener("click", function () {
            loadSong(index, true);
        });

    });


    /* =====================================================
       NEXT / PREVIOUS
    ===================================================== */

    nextButton.addEventListener("click", function () {
        playNextSong();
    });

    function playNextSong() {
        currentSongIndex = (currentSongIndex + 1) % songCards.length;
        loadSong(currentSongIndex, true);
    }

    previousButton.addEventListener("click", function () {
        currentSongIndex = (currentSongIndex - 1 + songCards.length) % songCards.length;
        loadSong(currentSongIndex, true);
    });


    /* =====================================================
       PROGRESS & SEEK
    ===================================================== */

    function startProgress() {

        stopProgress();

        progressInterval = setInterval(function () {

            if (!playerReady || !player) {
                return;
            }

            const current = player.getCurrentTime();
            const duration = player.getDuration();

            if (!duration) {
                return;
            }

            const percentage = (current / duration) * 100;
            progressSlider.value = percentage;

            currentTimeDisplay.textContent = formatTime(current);
            durationDisplay.textContent = formatTime(duration);

        }, 250);

    }

    function stopProgress() {
        if (progressInterval) {
            clearInterval(progressInterval);
            progressInterval = null;
        }
    }

    progressSlider.addEventListener("input", function () {

        if (!playerReady || !player) {
            return;
        }

        const duration = player.getDuration();

        if (!duration) {
            return;
        }

        const newTime = (progressSlider.value / 100) * duration;
        player.seekTo(newTime, true);

    });


    /* =====================================================
       VOLUME
    ===================================================== */

    volumeControl.addEventListener("input", function () {

        if (!playerReady || !player) {
            return;
        }

        player.setVolume(Number(this.value));

    });


    /* =====================================================
       FORMAT TIME
    ===================================================== */

    function formatTime(seconds) {

        if (!seconds || isNaN(seconds)) {
            return "0:00";
        }

        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);

        return minutes + ":" + String(remainingSeconds).padStart(2, "0");

    }


    /* =====================================================
       INITIAL SONG
    ===================================================== */

    loadSong(0, false);

});