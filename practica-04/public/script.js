let timer;
let timeLeft;
let isRunning = false;
let quotes = [];
let focus = false;
let mins;
let secs;

const documentBody = document.body;
const buttons = document.querySelectorAll("button");
const inputs = document.querySelectorAll("input");
const statusDisplay = document.getElementById("status");
const timerDisplay = document.getElementById("timer");
const startButton = document.getElementById("start");
const resetButton = document.getElementById("reset");
const minutesInput = document.getElementById("mins");
const secondsInput = document.getElementById("secs");
const quoteDisplay = document.getElementById("quote");
const authorDisplay = document.getElementById("author");
const blockquoteDisplay = document.getElementById("blockquote");
const notificationSound = new Audio("notification.mp3");

minutesInput.addEventListener("keypress", () => {
  mins = Number(minutesInput.value);
  updateTimerDisplay();
});

secondsInput.addEventListener("keypress", () => {
  secs = Number(secondsInput.value);
  updateTimerDisplay();
});

minutesInput.addEventListener("change", () => {
  mins = Number(minutesInput.value);
  updateTimerDisplay();
});

secondsInput.addEventListener("change", () => {
  secs = Number(secondsInput.value);
  updateTimerDisplay();
});

minutesInput.addEventListener("input", () => {
  mins = Number(minutesInput.value);
  updateTimerDisplay();
});

secondsInput.addEventListener("input", () => {
  secs = Number(secondsInput.value);
  updateTimerDisplay();
});

startButton.addEventListener("click", () => {
  if (!isRunning) {
    startTimer();
    startButton.textContent = "Pause";
  } else {
    pauseTimer();
    startButton.textContent = "Resume";
  }
});

resetButton.addEventListener("click", () => {
  resetTimer();
  startButton.textContent = "Start";
});

function startTimer() {
  isRunning = true;

  timer = setInterval(() => {
    secs -= 1;
    if (secs < 0) {
      if (mins === 0) {
        notify();
        switchState();
        return;
      }
      secs = 59;
      mins -= 1;
    }
    updateTimerDisplay();
  }, 1000);
}

function pauseTimer() {
  clearInterval(timer);
  isRunning = false;
}

function switchState() {
  if (focus) {
    statusDisplay.textContent = "Focus";
    documentBody.classList.remove("green-mode");
    documentBody.classList.add("red-mode");
    buttons.forEach((button) => {
      button.classList.remove("button-green-mode");
      button.classList.add("button-red-mode");
    });
    inputs.forEach((input) => {
      input.classList.remove("input-green-mode");
      input.classList.add("input-red-mode");
    });
    setTime(Number(minutesInput.value), Number(secondsInput.value));
  } else {
    statusDisplay.textContent = "Break";
    documentBody.classList.remove("red-mode");
    documentBody.classList.add("green-mode");
    buttons.forEach((button) => {
      button.classList.remove("button-red-mode");
      button.classList.add("button-green-mode");
    });
    inputs.forEach((input) => {
      input.classList.remove("input-red-mode");
      input.classList.add("input-green-mode");
    });
    setTime(5, 0);
  }
  resetTimer(
    !focus ? 5 : Number(minutesInput.value),
    !focus ? 0 : Number(secondsInput.value),
  );
  focus = !focus;
}

function setTime(m, s) {
  mins = m;
  secs = s;
}

function resetTimer(m, s) {
  isRunning = false;
  startButton.textContent = "Start";
  const mins = m ?? Number(minutesInput.value);
  const secs = s ?? Number(secondsInput.value);
  minutesInput.value = mins;
  secondsInput.value = secs;
  clearInterval(timer);
  setTime(mins, secs);
  updateTimerDisplay();
}

function updateTimerDisplay() {
  validateInput();
  timerDisplay.textContent = `${formatTime(mins)}:${formatTime(secs)}`;
}

function formatTime(time) {
  return time < 10 ? `0${time}` : time;
}

function validateInput() {
  if (secs > 59) {
    secondsInput.value = 59;
    secs = 59;
  } else if (secs < 0) {
    secondsInput.value = 0;
    secs = 0;
  }

  if (mins < 0) {
    minutesInput.value = 0;
    mins = 0;
  }
}

function getQuote() {
  fetch("https://type.fit/api/quotes")
    .then(function (response) {
      if (response.ok) {
        return response.json();
      }
      throw new Error("Network response failed");
    })
    .then(function (data) {
      let random = Math.floor(Math.random() * data.length);
      blockquoteDisplay.removeAttribute("hidden");
      quoteDisplay.textContent = data[random].text;
      authorDisplay.textContent = `- ${data[random].author.split(", ")[0]}`;
    })
    .catch(function (error) {
      console.error("Error:", error);
    });
}

function notify() {
  notificationSound.loop = true;
  notificationSound.play();
  document.addEventListener("keydown", stopNotificationLoop);
}

function stopNotificationLoop() {
  notificationSound.pause();
  notificationSound.currentTime = 0;
  notificationSound.loop = false;
  document.removeEventListener("keydown", stopNotificationLoop);
}

resetTimer();
getQuote();
