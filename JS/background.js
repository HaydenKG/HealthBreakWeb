//Handles the alarm listener
//TODO: Make popup open automatically when listener is triggered
//add notification point to setup: Only in browser, system notification

//TODO: Do I have to move all this stuff here so it loads automatically upon chrome startup? 

'use strict';

// chrome.action.setBadgeText({text: "Loaded"});

let notificationMethod = "Popup";

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("message received: " + message);
  console.log(typeof(message) == "object");
  if(typeof(message) == "object"){
    //init notification
    console.log(message.time, message.way);
    //TODO: Continue here to set the alarm
    // chrome.alarms.create("drink", {delayInMinutes: 1, periodInMinutes: 1});
  }
  if (message === 'get-user-data') {
    sendResponse("Loading the user data caused problems. Therefore I still load it in the content script");
  }
  if(message === "clearBadge"){
    chrome.action.setBadgeText({text: ""});
  }

  //TODO: add stopping of alarm for x time
  //creating a new alarm with the delay in minutes 
  //chrome.alarms.create("drink", {delayInMinutes: 1});
});

chrome.alarms.onAlarm.addListener(() => {
    console.log("alarm listener triggered")
    /*chrome.notifications.create({
      type: 'basic',
      iconUrl: 'stay_hydrated.png',
      title: 'Time to Hydrate',
      message: 'Everyday I\'m Guzzlin\'!',
      buttons: [
        { title: 'Keep it Flowing.' }
      ],
      priority: 0
    });*/

    chrome.action.setBadgeText({text: "Break?"});
    if (typeof chrome.action.openPopup === 'function') {
      console.log("Open the popup");
      chrome.action.openPopup({}, function() {
        console.log("Popup opened");
      });
    }
    else {
      console.log("chrome.action.openPopup() not supported");
      return;
      chrome.windows.create({
        focused: true,
        width: 400,
        height: 600,
        type: 'popup',
        url: './popup.html',
        top: 0,
        left: 0
      },
      () => {})
    }

    const options = {
      badge: './../images/icon-128.png',
      body: 'A few quick exercises can help you improve posture and focus :]',
      icon: './../images/icon-128.png',
      actions: [
          {
            action: 'someAction',
            type: 'button',
            title: 'Start',
          }
      ]
  };

    // registration.showNotification(title, options);
});



