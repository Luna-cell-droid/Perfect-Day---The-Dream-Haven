const dailyMessages = [
    {
        title: "A beautiful day",
        message: "Take your time today."
    },
    {
        title: "A fresh start",
        message: "One little step at a time."
    },
    {
        title: "Keep going",
        message: "You don't have to rush."
    },
    {
        title: "A little moment",
        message: "Notice something lovely today."
    },
    {
        title: "You made it",
        message: "Give yourself a moment to breathe."
    }
];
const randomMessage =
    dailyMessages[Math.floor(Math.random() * dailyMessages.length)];

document.getElementById("daily-title").textContent = randomMessage.title;
document.getElementById("daily-message").textContent = randomMessage.message;