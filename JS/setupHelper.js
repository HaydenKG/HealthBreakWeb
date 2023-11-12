"use strict";
class setupData {
  selection = [];
  notificationInterval = 60;
  notificationType = "Popup";
}

const setupExtensionPanel = document.getElementById("setupPanel");
const setupContainer = document.getElementsByClassName("slidingContainer")[1];
let setupCounter = setupContainer.childElementCount;
let nextSetupCounter = 0;
let setupDataInstance = new setupData();

const customizeSetupBtn = document.getElementById("customizeSetupBtn");
const defaultSetupBtn = document.getElementById("defaultSetupBtn");
const setupNextButton = document.getElementById("setupNextButton");

customizeSetupBtn.addEventListener("click", () => nextSetupPanel());
setupNextButton.addEventListener("click", () => nextSetupPanel());
defaultSetupBtn.addEventListener("click", () => defaultSetup());

function defaultSetup() {
  saveSetup();
  console.debug("Default setup selected");
  showSetupPanel(false);
}

function nextSetupPanel() {
  if (nextSetupCounter == 0)
    document.getElementById("setupNextButton").style.display = "block";
  nextSetupCounter++;
  if (nextSetupCounter == setupCounter - 1) {
    document.getElementById("setupNextButton").innerText = "Done";
  }
  if (nextSetupCounter == setupCounter) {
    saveSetup();
    showSetupPanel(false);
  }
  if (nextSetupCounter < setupCounter)
    setupContainer.scrollTo(nextSetupCounter * setupContainer.clientWidth, 0);
}

function showSetupPanel(show) {
  if (show) setupExtensionPanel.classList.add("showPanel");
  else {
    setupExtensionPanel.classList.remove("showPanel");
  }
}

function saveSetup() {
  const selectionFormData = document.getElementById("exerciseSelection");
  setupDataInstance.selection = getSelection(selectionFormData);
  setupDataInstance.notificationInterval =
    new FormData(document.getElementById("intervalSetup")).get("interval") *
    60000;
  setupDataInstance.notificationType = new FormData(
    document.getElementById("notificationSetup")
  ).get("notification");
  console.log(JSON.stringify(setupDataInstance));
  localStorage.setItem("exerciseSelection", JSON.stringify(setupDataInstance));

  //show main window and enable notification
  //   setNotification(
  //     setupDataInstance.notificationInterval,
  //     setupDataInstance.notificationType
  //   );
}

function getSelection(dataSet) {
  const arrayOfdataSet = Array.from(dataSet);
  let selectionArray = [];
  for (let i = 0; i < arrayOfdataSet.length; i++) {
    let dataSet = {};
    dataSet[arrayOfdataSet[i].name] = arrayOfdataSet[i].checked;
    selectionArray.push(dataSet);
  }
  return selectionArray;
}
