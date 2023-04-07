//extension dev links:
//https://developer.chrome.com/docs/extensions/reference/action/
//https://developer.chrome.com/docs/extensions/reference/#stable_apis

'use strict';

let nextCounter = 0;
let headingChanged = false;
let breathingCycleOn = false;
let breathingCounter = 0;
let breathingTimer;
let paused = false;
let currentAudio;
let soundEnabled = false;

const contentContainer = document.getElementsByClassName('slidingContainer')[0];
const options = new Map();
options.set('eyeClose', document.getElementById('eyeClose'));
options.set('eyeDistance', document.getElementById('eyeDistance'));
options.set('breathingCycle', document.getElementById('breathingCycle'));
options.set('wirstShake', document.getElementById('wristShake'));
options.set('relaxJaw', document.getElementById('relaxJaw'));
options.set('rotateShoulders', document.getElementById('rotateShoulders'));
options.set('alignPosture', document.getElementById('alignPosture'));
let optionsCount = options.size;

const nextBtn = document.getElementById('nextBtn');
const settingsBtn = document.getElementById('settingsIcon');
const pauseBtn = document.getElementById('pauseExtensionIcon');
const minimizePausePanelBtn = document.getElementById(
  'minimizePauseExtensionPanelBtn'
);
const setPauseExtBtn = document.getElementById('setPauseExtBtn');

const breahtingIndicator = document.getElementById('breathingIndicatorBar');
const pauseExtensionPanel = document.getElementById('pauseExtensionPanel');
const soundOffIcon = document.getElementById("soundOffIcon");
const soundOnIcon = document.getElementById("soundOnIcon");

soundOffIcon.style.display = "none"
let userSetupData = JSON.parse(localStorage.getItem('exerciseSelection'));
// let exerciseSelectionTest = [{eyeClose: true}, {eyeDistance: true}, {breathingCycle: true}, {wristShake: true}];
let exerciseSelection = userSetupData?.selection;
let notificationIntervall;

addEventListener('focus', (_event) => (document.title = 'Health break'));

function restart() {
  nextCounter = 0;
  contentContainer.scrollTo(nextCounter * contentContainer.clientWidth, 0);
  nextBtn.onclick = () => scrollToNextSection();
  nextBtn.firstElementChild.setAttribute("src", "./media/images/NextArrow.svg");
}

function scrollToNextSection() {
  if (nextCounter < optionsCount) nextCounter++;
  if (nextCounter > 0 && !headingChanged) changeHeading();

  contentContainer.scrollTo(nextCounter * contentContainer.clientWidth, 0);
  if (nextCounter == optionsCount) {
    nextBtn.firstElementChild.setAttribute("src", "./media/images/restart_alt_MaterialIcon.svg");
    nextBtn.onclick = () => restart();
    document.getElementById('nextBreakTime').innerText = getNextBreakTime();
  }
}

if (exerciseSelection == null) {
  showSetupPanel(true);
} else {
  showSetupPanel(false);
  notificationIntervall = setInterval(() => {
    if(soundEnabled){
      try{
        new Audio("./media/sounds/ShadowSoft.wav").play();
      } catch (err){
        console.warn("Could not play notifcation sound because there was no initial interaction with the DOM");
      }
    }
    console.log('Interval called');
    document.title = 'Break time 🌿';
  }, userSetupData.notificationInterval);
  // setNotification(userSetupData.notificationInterval, userSetupData.notificationType);
  for (let i = 0; i < exerciseSelection.length; i++) {
    if (Object.values(exerciseSelection[i])[0] == false) {
      options.get(Object.keys(exerciseSelection[i])[0]).style.display = 'none';
      optionsCount--;
    }
  }
}

function getNextBreakTime() {
  const expectedTime = new Date();
  expectedTime.setMinutes(
    expectedTime.getMinutes() + userSetupData.notificationInterval / 1000
  );
  return new Intl.DateTimeFormat("default", {hour: "numeric", minute: "numeric", hour12: false}).format(expectedTime);
}

function setSound(soundShallBeOn){
  if(soundShallBeOn){
    soundOffIcon.style.display ="none";
    soundOnIcon.style.display ="block";
  } else {
    soundOffIcon.style.display ="block";
    soundOnIcon.style.display ="none";
  }
  soundEnabled = soundShallBeOn;
}

function eyeDistanceTimer(button) {
  setTimeout(() => {
    button.previousElementSibling.innerText += "\n\n Perfect 😊";
    button.style.display = "none";
    if(soundEnabled){
      new Audio("./media/sounds/ShadowSoft.wav").play();
    }
  }, 20000);
  button.setAttribute("disabled", "");
}

function breathingCycleTimer(button){
   breathingCycleOn = !breathingCycleOn;
    if (breathingCycleOn) {
      breathingTimer = setInterval(() => {
        if (paused) return;

        breathingCounter++;
        if (
          breathingCounter == 1 ||
          breathingCounter == 9 ||
          breathingCounter == 18 || 
          breathingCounter == 27

        ) {
          if(soundEnabled){
            currentAudio = new Audio('./media/sounds/InhaleLofiPiano.wav');
            currentAudio.play();
          }
        }
        if (
          breathingCounter == 3 ||
          breathingCounter == 12 ||
          breathingCounter == 21 ||
          breathingCounter == 30
        ) {
          if(soundEnabled){
            currentAudio = new Audio('./media/sounds/ExhaleLofiPiano.wav');
            currentAudio.play();
          }
        }
        if (breathingCounter >= 9 * 4) resetBreathing(button);
      }, 1000);

      //TODO: replace with stop for now because it causes too much trouble syncing the css animation with the sound after a pause
      button.innerText = 'Pause'; // TODO: replace with icons
      breahtingIndicator.style.animationPlayState = 'running';
      paused = false;
    } else {
      button.innerText = 'Go';
      breahtingIndicator.style.animationPlayState = 'paused';
      currentAudio.pause();
      paused = true;
    }
}

function pauseExtension() {
  let durationToClose = new FormData(
    document.getElementById('pauseExtensionForm')
  ).get('pauseExtension');
  switch (durationToClose) {
    case '60':
      console.log('60 min');
      break;
    case '90':
      console.log('120 min');
      break;
    default:
      console.log('whole day');
  }
  //TODO: implement pause of the timer that causes the popup to open
  closeWindow();
}

function resetBreathing(button) {
  button.innerText = 'again';
  clearInterval(breathingTimer);
  breathingCounter = 0;
  //TODO: figure out how to repeat the cycle. Remove animation and add it again?
}

function changeHeading() {
  document.getElementById('heading').innerHTML = '🌿<span>Health</span> break';
  headingChanged = true;
}

function showPauseExtensionPanel(show) {
  if (show) {
    pauseExtensionPanel.classList.add('showPanel');
  } else {
    pauseExtensionPanel.classList.remove('showPanel');
  }
}

function closeWindow() {
  nextCounter = 0;
  headingChanged = false;
  //IDEA: Close tab?
}
