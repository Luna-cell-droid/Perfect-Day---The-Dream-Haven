document.addEventListener("DOMContentLoaded", () => {

    const moodCards = document.querySelectorAll(".mood-card");

    const moodTitle = document.getElementById("mood-title");
    const moodMessage = document.getElementById("mood-message");
    const moodHistory = document.getElementById("mood-history");


    /* =========================================
       MOOD INFORMATION
       ========================================= */

    const moods = {

        happy: {
            title: "A little sunshine today ☀",
            message: "Hold onto that feeling. Let yourself enjoy the little things that made today brighter."
        },

        calm: {
            title: "A quiet moment 🌙",
            message: "There's something beautiful about slowing down. You don't have to rush through today."
        },

        excited: {
            title: "Something feels exciting ✦",
            message: "Enjoy the anticipation. Let yourself look forward to whatever is making your heart happy."
        },

        tired: {
            title: "You deserve a softer day ☾",
            message: "You don't have to do everything at once. Give yourself permission to slow down."
        },

        sad: {
            title: "It's okay to have softer days ☂",
            message: "You don't need to force yourself to feel different. Be gentle with yourself today."
        },

        overwhelmed: {
            title: "One little thing at a time",
            message: "You don't have to figure everything out right now. Pick one small thing and start there."
        }

    };


    /* =========================================
       LOAD SAVED MOODS
       ========================================= */

    let moodHistoryData =
        JSON.parse(localStorage.getItem("perfectDayMoods")) || [];


    /* =========================================
       SELECT A MOOD
       ========================================= */

    moodCards.forEach(card => {

        card.addEventListener("click", () => {

            const selectedMood =
                card.dataset.mood;

            const mood =
                moods[selectedMood];


            /* Remove previous selection */

            moodCards.forEach(otherCard => {
                otherCard.classList.remove("selected");
            });


            /* Highlight selected mood */

            card.classList.add("selected");


            /* Change response */

            moodTitle.textContent =
                mood.title;

            moodMessage.textContent =
                mood.message;


            /* Save mood */

            const today =
                new Date().toLocaleDateString();


            const existingEntry =
                moodHistoryData.find(
                    entry => entry.date === today
                );


            if (existingEntry) {

                existingEntry.mood =
                    selectedMood;

            } else {

                moodHistoryData.push({
                    mood: selectedMood,
                    date: today
                });

            }


            /* Save to browser */

            localStorage.setItem(
                "perfectDayMoods",
                JSON.stringify(moodHistoryData)
            );


            /* Update history */

            displayMoodHistory();

        });

    });


    /* =========================================
       DISPLAY MOOD HISTORY
       ========================================= */

    function displayMoodHistory() {

        if (moodHistoryData.length === 0) {

            moodHistory.innerHTML =
                "<p>No moods recorded yet.</p>";

            return;
        }


        moodHistory.innerHTML = "";


        moodHistoryData
            .slice()
            .reverse()
            .forEach(entry => {

                const mood =
                    moods[entry.mood];

                const moodEntry =
                    document.createElement("div");

                moodEntry.classList.add("history-entry");


                const date =
                    document.createElement("span");

                date.textContent =
                    entry.date;


                const moodName =
                    document.createElement("strong");

                moodName.textContent =
                    entry.mood.charAt(0).toUpperCase() +
                    entry.mood.slice(1);


                moodEntry.appendChild(date);
                moodEntry.appendChild(moodName);

                moodHistory.appendChild(moodEntry);

            });

    }


    /* =========================================
       LOAD TODAY'S MOOD
       ========================================= */

    function loadTodaysMood() {

        const today =
            new Date().toLocaleDateString();

        const todaysMood =
            moodHistoryData.find(
                entry => entry.date === today
            );


        if (!todaysMood) {
            return;
        }


        const savedCard =
            document.querySelector(
                `[data-mood="${todaysMood.mood}"]`
            );


        if (savedCard) {

            savedCard.classList.add("selected");

            const mood =
                moods[todaysMood.mood];

            moodTitle.textContent =
                mood.title;

            moodMessage.textContent =
                mood.message;

        }

    }


    /* =========================================
       START
       ========================================= */

    displayMoodHistory();
    loadTodaysMood();

});