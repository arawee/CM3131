///////////////////////
///  GENERAL START  ///
///////////////////////

// Turn off menu and smoothly scroll to selected heading [only called when menu is open]
  // Call toggleMenu(); 
function scrollToHeading(heading) {

  toggleMenu()

  document.getElementById(heading).scrollIntoView({
    behavior: 'smooth'
  });
}

// Toggle main menu  opacity on burger click and exit
function toggleMenu() {

  // Menu, Burger icon and "Close menu" icon
  const menu = document.getElementById("menu");
  const burger = document.getElementById("top-burger");
  const star = document.getElementById("top-star");

  // read current opacity of menu
  const menuVal = menu.style.opacity;

  // if opacity style doesn't exist or menu is "off" (opacity 0)
    // turn on
  if (!menuVal || menuVal === "0") {
    menu.style.opacity = "1";
    menu.style.pointerEvents = "initial"
    burger.style.opacity = "0";
    star.style.opacity = "1";

    //else turn off
  } else {
    menu.style.opacity = "0";
    menu.style.pointerEvents = "none"
    burger.style.opacity = "1";
    star.style.opacity = "0";
  }
};

var modal = document.querySelector('ion-modal');

// Manually close modal
function manualDismiss(target) {
  var targetModal = document.getElementById(target);
  targetModal.dismiss();
}

// Handles main button functions (only mid-step)
function logSnoke(modalOn) {

  if (document.getElementById("snoke-timer-toggle").checked === true) {
    resetCounter();
  }

  if (modalOn) {
    manualDismiss("dont-modal");
    getTip();
  }
}

function logSmoking(modalOn) {

  resetCounter();

  if (modalOn) {
    manualDismiss("broke-modal");
    getTip();
  }
}

///////////////////////
///  COUNTER START  ///
///////////////////////

// Constants for time text
const counterDays = document.getElementById("counter-days");
const counterMore = document.getElementById("counter-more");

// Update text of counter
function updateCounter() {
  counterDays.textContent = `${days} ${days == 1 ? 'Day' : 'Days'}`;
  counterMore.textContent = `${hours} ${hours == 1 ? 'hour' : 'hours'}, ${minutes} ${minutes == 1 ? 'minute' : 'minutes'} and ${seconds} ${seconds == 1 ? 'second' : 'seconds'}`;
}

// Add a second to counter every second (add 1 to seconds and process)
  // Call updateCounter();
setInterval(function updateTime() {

  seconds++;

  if (seconds === 60) {
    minutes++;
    seconds = 0;
  } if (minutes === 60) {
    hours++;
    minutes = 0;
  } if (hours === 24) {
    days++;
    hours = 0;
  }

  updateCounter();

}, 1000);

// Reset time constants to 0
  // Call updateCounter();
function resetCounter() {

  seconds = 0;
  minutes = 0;
  hours = 0;
  days = 0;

  updateCounter();

}

///////////////////
///  API START  ///
///////////////////

// API url + query for "Quit Smoking: Conversation Starters"
const url = "https://health.gov//myhealthfinder/api/v3/topicsearch.json"
          + "?topicId=30588"
          + "&lang=en";

// Return a response JSON
function getJson(aResponse){
  return aResponse.json();
}

// Process response JSON, update response and random illustration in modal
function updateTip(jsonObj) {
  
  // Initialise array for processed tip texts
  var tips = [];

  
  // Locate, split and slice response
  var response = jsonObj.Result.Resources.Resource[0].Sections.section[0].Content;

  response = response.split('li>');

  for (let i = 1; i < response.length; i+=2) {
    responsePost = response[i].slice(1, -3);
    tips.push(responsePost);
  }

  // Update tip text with random from the first 10 valid responses
  var tipContainer = document.getElementById("tip-text");
  var tip = tips[Math.floor(Math.random() * 10)];
  tipContainer.textContent = tip;

  // Update illustration on random
  var iconContainer = document.getElementById("random-tip-img");
  var imgSrc = "./assets/tipart/icon-0" + Math.floor(Math.random() * 5) + ".svg";
  iconContainer.src = imgSrc;
};

// Catch function (sometimes intentionally drops)
function reportError(anError){
  //console.log(anError);
};

// Full API and tip update call
function getTip () {
  fetch(url)
    .then(getJson)
    .then(updateTip)
    .catch(reportError);
}

// And finally, call it
  // Calls getJson(), updateTip() and reportError()
getTip();

////////////////////////
///  SETTINGS START  ///
////////////////////////

// Modal remove necessary for ionic
document.getElementById("broke-modal").remove();

// Save modals code
var modalDont = '<ion-modal id="dont-modal" trigger="dont-button"><ion-button id="popup-button" style="--background: translucent;" onclick="manualDismiss(`dont-modal`)"><ion-img id="close-popup-icon" src="./assets/close-star.svg"></ion-img></ion-button><ion-item style="--background: translucent; pointer-events: none;"><ion-img id="random-tip-img" class="invert"></ion-img></ion-item><ion-item style="--background: translucent;"><ion-text id="tip-container" color="primary"><p id="tip-text"></p></ion-text></ion-item><ion-item style="--background: translucent;"><ion-button id="didnt-button" class="broke-button" style="--background:#00000000" onclick="logSnoke(true)" shape="round">Log my Snoke!</ion-button></ion-item></ion-modal>';
var modalBroke = '<ion-modal id="broke-modal" trigger="broke-button"><ion-button id="popup-button" style="--background: translucent;" onclick="manualDismiss(`broke-modal`)"><ion-img id="close-popup-icon" src="./assets/close-star.svg"></ion-img></ion-button><ion-item style="--background: translucent; pointer-events: none;"><ion-img id="random-tip-img" class="invert"></ion-img></ion-item><ion-item style="--background: translucent;"><ion-text id="tip-container" color="primary"><p id="tip-text"></p></ion-text></ion-item><ion-item style="--background: translucent;"><ion-button id="broken-button" class="broke-button" style="--background:#00000000" onclick="logSmoking(true)" shape="round">Still smoking.</ion-button></ion-item></ion-modal>';

// When a setting is toggled
function changeSetting(toggle, setting) {

  // Allocate vars based on setting
  if (setting === "dont") {
    var targetModal = document.getElementById("dont-modal");
    var triggerButton = document.getElementById("dont-button");
    var newModal = modalDont;
  }
  if (setting === "broke") {
    var targetModal = document.getElementById("broke-modal");
    var triggerButton = document.getElementById("broke-button");
    var newModal = modalBroke;
  }

  const menu = document.getElementById("menu");

  // When turning setting off
  if (toggle.checked !== false) {

    // Modify DB entry
    modifySetting(setting, "off");
    
    // Change modal and button settings
    if (setting === "dont") {
      targetModal.remove();
      triggerButton.onclick = function() { logSnoke(false) };
      addListenerToButton("dont-button", true);
    } else if (setting === "broke") {
      targetModal.remove();
      triggerButton.onclick = function() { logSmoking(false) };
      addListenerToButton("broke-button", true);
    } else if (setting === "snoking-timer") {
      // For scaling
      // console.log("switching snoking to Y!")
    }

// When turning setting on
  } else {

    // Modify DB entry
    modifySetting(setting, "on");

    // For main buttons
    if (setting === "dont" || setting === "broke") {

      // Allocate vars
      menu.insertAdjacentHTML( "afterend", newModal);
      var buttonStr = setting + "-button"
      triggerButton = document.getElementById(buttonStr);
      triggerButton.onclick = function() { };
    
      // Activate modal and buttons
      if (setting === "dont") {
        addListenerToButton("didnt-button", true);

        const brokeToggle = document.getElementById("broke-toggle");
        addListenerToButton("dont-button", false);
        
        // Reset other toggle
        if (brokeToggle.checked) {
          modifySetting("broke", "off");
          addListenerToButton("broke-button", true);

          brokeToggle.checked = false;
          document.getElementById("broke-modal").remove();
          
          document.getElementById("broke-button").onclick = function() { logSmoking() };
        }

        // Do the same for setting === "broke" 
      } else {
        const dontToggle = document.getElementById("dont-toggle");
        addListenerToButton("broke-button", false);
        addListenerToButton("broken-button", true);

        if (dontToggle.checked) {
          modifySetting("dont", "off");
          addListenerToButton("dont-button", true);

          dontToggle.checked = false;
          document.getElementById("dont-modal").remove();
          document.getElementById("dont-button").onclick = function() { logSnoke() };
        }
      }
      
      // Refresh tip (illustration and text)
      getTip();

    } else if (setting === "snoking-timer") {
      // For scaling
      // console.log("switching snoking to N!")
    }
  }
};
