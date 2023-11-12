//extension dev links:
//https://developer.chrome.com/docs/extensions/reference/action/
//https://developer.chrome.com/docs/extensions/reference/#stable_apis

"use strict";

let nextCounter = 0;
let headingChanged = false;
let breathingCycleOn = false;
let breathingTimer;
let paused = false;
let currentAudio;
let soundEnabled = true;

const contentContainer = document.getElementsByClassName("slidingContainer")[0];
const options = new Map();
options.set("eyeClose", document.getElementById("eyeClose"));
options.set("eyeDistance", document.getElementById("eyeDistance"));
options.set("breathingCycle", document.getElementById("breathingCycle"));
options.set("wirstShake", document.getElementById("wristShake"));
options.set("relaxJaw", document.getElementById("relaxJaw"));
options.set("rotateShoulders", document.getElementById("rotateShoulders"));
options.set("alignPosture", document.getElementById("alignPosture"));
let optionsCount = options.size;

const nextBtn = document.getElementById("nextBtn");
const settingsBtn = document.getElementById("settingsIcon");
const pauseBtn = document.getElementById("pauseExtensionIcon");
const minimizePausePanelBtn = document.getElementById("minimizePausePanelBtn");
const setPauseExtBtn = document.getElementById("setPauseExtBtn");

const breahtingIndicator = document.getElementById("breathingIndicatorBar");
const pauseExtensionPanel = document.getElementById("pauseExtensionPanel");
const soundOffIcon = document.getElementById("soundOffIcon");
const soundOnIcon = document.getElementById("soundOnIcon");

soundOffIcon.style.display = "none";
let userSetupData = JSON.parse(localStorage.getItem("exerciseSelection"));
// let exerciseSelectionTest = [{eyeClose: true}, {eyeDistance: true}, {breathingCycle: true}, {wristShake: true}];
let exerciseSelection = userSetupData?.selection;
let notificationIntervall;

addEventListener("focus", (_event) => (document.title = "Health break"));

function restart() {
  nextCounter = 0;
  contentContainer.scrollTo(nextCounter * contentContainer.clientWidth, 0);
  nextBtn.onclick = () => scrollToNextSection();
  nextBtn.firstElementChild.setAttribute("src", "./media/images/NextArrow.svg");
}

function startInterval() {
  notificationIntervall = setInterval(() => {
    if (soundEnabled) {
      try {
        new Audio("./media/sounds/ShadowSoft.wav").play();
        changeHeading(true);
        restart();
      } catch (err) {
        console.warn(
          "Could not play notifcation sound because there was no initial interaction with the DOM"
        );
      }
    }
    document.title = "Break time 🌿";
  }, userSetupData.notificationInterval);
}

function scrollToNextSection() {
  if (nextCounter < optionsCount) nextCounter++;
  if (nextCounter > 0 && !headingChanged) changeHeading(false);

  contentContainer.scrollTo(nextCounter * contentContainer.clientWidth, 0);
  if (nextCounter == optionsCount) {
    nextBtn.firstElementChild.setAttribute(
      "src",
      "./media/images/restart_alt_MaterialIcon.svg"
    );
    nextBtn.onclick = () => restart();
    document.getElementById("nextBreakTime").innerText = getNextBreakTime();
  }
}

if (exerciseSelection == null) {
  showSetupPanel(true);
} else {
  showSetupPanel(false);
  startInterval();
  for (let i = 0; i < exerciseSelection.length; i++) {
    if (Object.values(exerciseSelection[i])[0] == false) {
      options.get(Object.keys(exerciseSelection[i])[0]).style.display = "none";
      optionsCount--;
    }
  }
}

function getNextBreakTime() {
  const expectedTime = new Date();
  expectedTime.setMinutes(
    expectedTime.getMinutes() + userSetupData.notificationInterval / 60000
  );
  return new Intl.DateTimeFormat("default", {
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  }).format(expectedTime);
}

function setSound(soundShallBeOn) {
  if (soundShallBeOn) {
    soundOffIcon.style.display = "none";
    soundOnIcon.style.display = "block";
  } else {
    soundOffIcon.style.display = "block";
    soundOnIcon.style.display = "none";
  }
  soundEnabled = soundShallBeOn;
}

function eyeDistanceTimer(button) {
  setTimeout(() => {
    button.previousElementSibling.innerText += "\n\n Perfect 😊";
    button.style.display = "none";
    if (soundEnabled) {
      new Audio("./media/sounds/ShadowSoft.wav").play();
    }
    setTimeout(() => {
      button.previousElementSibling.innerText =
        "Look into the distance for 20 seconds and follow an object with your eyes if you can";
      button.style.display = "block";
      button.disabled = false;
    }, 3000);
  }, 20000);
  button.setAttribute("disabled", "");
}

function breathingCycleTimer(button) {
  let breathingCounter = 0;
  let inhaleAudio = new Audio("./media/sounds/InhaleLofiPiano.wav");
  let exhaleAudio = new Audio("./media/sounds/ExhaleLofiPiano.wav");
  breathingTimer = setInterval(
    () => {
      breahtingIndicator.classList.add("breathingAnimation");
      breathingCounter++;
      if (
        breathingCounter == 1 ||
        breathingCounter == 10 ||
        breathingCounter == 19 ||
        breathingCounter == 28
      ) {
        if (soundEnabled) {
          inhaleAudio.play();
        }
      }
      if (
        breathingCounter == 4 ||
        breathingCounter == 13 ||
        breathingCounter == 22 ||
        breathingCounter == 31
      ) {
        if (soundEnabled) {
          exhaleAudio.play();
        }
      }
      if (breathingCounter >= 38) resetBreathing(button);
    },
    1000,
    inhaleAudio,
    exhaleAudio
  );

  button.innerText = "Stop"; // TODO: replace with icons
  button.onclick = () => {
    inhaleAudio.pause();
    exhaleAudio.pause();
    resetBreathing(button);
  };
}

function resetBreathing(button) {
  clearInterval(breathingTimer);
  breahtingIndicator.classList.remove("breathingAnimation");
  button.innerText = "Play";
  button.onclick = () => breathingCycleTimer(button);
}

function pauseExtension() {
  clearInterval(notificationIntervall);
  let durationToClose = new FormData(
    document.getElementById("pauseExtensionForm")
  ).get("pauseExtension");
  switch (durationToClose) {
    case "60":
      setTimeout(() => {
        startInterval();
      }, 1000 * 60 * 60);
      break;
    case "90":
      setTimeout(() => {
        startInterval();
      }, 1000 * 60 * 90);
      break;
    case "120":
      setTimeout(() => {
        startInterval();
      }, 1000 * 60 * 120);
      break;
    default:
      console.log("No case for: " + durationToClose);
  }
  showPauseExtensionPanel(false);
}

function changeHeading(showNeedBreakQuestion) {
  if (showNeedBreakQuestion) {
    document.getElementById("heading").innerHTML = "👋 Need a break?";
  } else {
    document.getElementById("heading").innerHTML =
      "🌿<span>Health</span> break";
  }
  headingChanged = true;
}

function showPauseExtensionPanel(show) {
  if (show) {
    pauseExtensionPanel.classList.add("showPanel");
  } else {
    pauseExtensionPanel.classList.remove("showPanel");
  }
}
