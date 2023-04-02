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

const breahtingIndicator = document.getElementsByClassName(
  'breathingIndicatorBar'
)[0];
const pauseExtensionPanel = document.getElementById('pauseExtensionPanel');

let userSetupData = JSON.parse(localStorage.getItem('exerciseSelection'));
// let exerciseSelectionTest = [{eyeClose: true}, {eyeDistance: true}, {breathingCycle: true}, {wristShake: true}];
let exerciseSelection = userSetupData?.selection;
let notificationIntervall;

addEventListener('focus', (_event) => (document.title = 'Health break'));

function restart() {
  nextCounter = 0;
  contentContainer.scrollTo(nextCounter * contentContainer.clientWidth, 0);
  nextBtn.onclick = () => scrollToNextSection();
  nextBtn.innerText = 'next';
}

function scrollToNextSection() {
  if (nextCounter < optionsCount) nextCounter++;
  if (nextCounter > 0 && !headingChanged) changeHeading();

  contentContainer.scrollTo(nextCounter * contentContainer.clientWidth, 0);
  if (nextCounter == optionsCount) {
    nextBtn.innerText = 'restart';
    nextBtn.onclick = () => restart();
    document.getElementById('nextBreakTime').innerText = getNextBreakTime();
  }
}

if (exerciseSelection == null) {
  showSetupPanel(true);
} else {
  showSetupPanel(false);
  //trigger notification
  notificationIntervall = setInterval(() => {
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
    expectedTime.getMinutes() + userSetupData.notificationInterval / 60000
  );
  return `${expectedTime.getHours()}:${expectedTime.getMinutes()}`;
}

settingsBtn.addEventListener('click', () =>
  console.log('TODO: settings to be implemented')
);
pauseBtn.addEventListener('click', () => showPauseExtensionPanel(true));
minimizePausePanelBtn.addEventListener('click', () =>
  showPauseExtensionPanel(false)
);
setPauseExtBtn.addEventListener('click', () => pauseExtension());

document
  .getElementById('lookDistanceTimerBtn')
  .addEventListener('click', function () {
    setTimeout(() => {
      this.previousElementSibling.innerText += '\n\n Perfect 😊';
      this.style.display = 'none';
      new Audio('./media/sounds/ShadowSoft.wav').play();
    }, 2000);
    this.setAttribute('disabled', '');
  });

document
  .getElementById('breathingCycleBtn')
  .addEventListener('click', function () {
    breathingCycleOn = !breathingCycleOn;
    if (breathingCycleOn) {
      breathingTimer = setInterval(() => {
        if (paused) return;

        breathingCounter++;
        if (
          breathingCounter == 1 ||
          breathingCounter == 9 ||
          breathingCounter == 18
        ) {
          currentAudio = new Audio('./media/sounds/InhaleLofiPiano.wav');
          currentAudio.play();
        }
        if (
          breathingCounter == 3 ||
          breathingCounter == 12 ||
          breathingCounter == 21
        ) {
          currentAudio = new Audio('./media/sounds/ExhaleLofiPiano.wav');
          currentAudio.play();
        }
        if (breathingCounter >= 9 * 5) resetBreathing(this);
      }, 1000);

      //TODO: replace with stop for now because it causes too much trouble syncing the css animation with the sound after a pause
      this.innerText = 'Pause'; // TODO: replace with icons
      breahtingIndicator.style.animationPlayState = 'running';
      paused = false;
    } else {
      this.innerText = 'Go';
      breahtingIndicator.style.animationPlayState = 'paused';
      currentAudio.pause();
      paused = true;
    }
  });

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
