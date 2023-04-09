// Define DB name and version
const dbName = "snoke";
const dbVersion = 1;

// Initiate global time holders
let seconds = 0;
let minutes = 0;
let hours = 0;
let days = 0;

// Initiate global db holder
let db;

// Open database
const request = indexedDB.open(dbName, dbVersion);

// On creation/upgrade
// Create dbStore and index it
request.onupgradeneeded = function(event) {

  db = event.target.result;

  // Create dbStore "logs"
  const dbStore = db.createObjectStore("logs", { keyPath: "id", autoIncrement: true });

  // Indexes to search by (keys)
  dbStore.createIndex("smoke", "smoke", { unique: false });
  dbStore.createIndex("setting", "setting", { unique: false });
  
  // Create basic settings
  const dont = {
    setting: "dont",
    state: "on"
  };

  const broke = {
    setting: "broke",
    state: "off"
  };

  const snokingTimer = {
    setting: "snoking-timer",
    state: "off"
  };

  // And add the to the db
  dbStore.add(dont);
  dbStore.add(broke);
  dbStore.add(snokingTimer);

/////////////////////
///  DEMO VALUES  ///
/////////////////////

  const s0 = {date: new Date("04 April, 2023 16:41:59 GMT+0100 (British Summer Time)"),smoke: "Y"};
  const s1 = {date: new Date("04 April, 2023 16:41:59 GMT+0100 (British Summer Time)"),smoke: "Y"};
  const s2 = {date: new Date("05 April, 2023 16:41:59 GMT+0100 (British Summer Time)"),smoke: "Y"};
  const s3 = {date: new Date("05 April, 2023 16:41:59 GMT+0100 (British Summer Time)"),smoke: "Y"};
  const s4 = {date: new Date("06 April, 2023 16:41:59 GMT+0100 (British Summer Time)"),smoke: "Y"};
  const s5 = {date: new Date("06 April, 2023 16:41:59 GMT+0100 (British Summer Time)"),smoke: "Y"};
  const s6 = {date: new Date("06 April, 2023 16:41:59 GMT+0100 (British Summer Time)"),smoke: "Y"};
  const s7 = {date: new Date("06 April, 2023 16:41:59 GMT+0100 (British Summer Time)"),smoke: "Y"};
  const s8 = {date: new Date("07 April, 2023 16:41:59 GMT+0100 (British Summer Time)"),smoke: "Y"};
  const s9 = {date: new Date("07 April, 2023 16:41:59 GMT+0100 (British Summer Time)"),smoke: "Y"};
  const s10 = {date: new Date("07 April, 2023 16:41:59 GMT+0100 (British Summer Time)"),smoke: "Y"};

  // Leaving some out to demonstrate DB functions
  dbStore.add(s0);
  dbStore.add(s1);
  dbStore.add(s2);
  dbStore.add(s3);
  /* dbStore.add(s4);
  dbStore.add(s5);
  dbStore.add(s6);
  dbStore.add(s7); */
  dbStore.add(s8);
  dbStore.add(s9);
  dbStore.add(s10);

};

// On opening of the database
// Read settings and set accordingly
request.onsuccess = function(event) {

  // Locate DB
  db = event.target.result;

  // Connect
  const transaction = db.transaction(["logs"], "readwrite");
  const dbStore = transaction.objectStore("logs");
  const index = dbStore.index("setting");
  const checkRequest = index.openCursor();

  // On success check settings
  checkRequest.onsuccess = function(event) {

    const cursor = event.target.result;

    // For every setting
    if (cursor) {

      // if 1st setting off (Don't show left button modal)
      if (cursor.value.setting === "dont") {

        if (cursor.value.state === "off") {

          // Disable modal and set button functionality
          document.getElementById("dont-toggle").checked = false;
          document.getElementById("dont-modal").remove();
          document.getElementById("dont-button").onclick = function() { logSnoke(false) };
          addListenerToButton("dont-button", true);

        // If setting on, reset (Show left button modal)
        } else {
          addListenerToButton("didnt-button", true);
          addListenerToButton("dont-button", false);
        }
      }

      // Same for 2nd set of modal and buttons, but reverse logic
      if (cursor.value.setting === "broke") {

        if (cursor.value.state === "on") {

          document.getElementById("broke-toggle").checked = true;
          var newModal = modalBroke;
          document.getElementById("broke-button").onclick = function() { };
          document.getElementById("menu").insertAdjacentHTML( "afterend", newModal);
          addListenerToButton("broken-button", true);
          addListenerToButton("broke-button", false)

        } else {
          addListenerToButton("broke-button", true)
        }
      }
      
      // For last setting (Reset timer when "Snoking")
      if (cursor.value.setting === "snoking-timer") {

        // Toggle toggle and set time variables
        if (cursor.value.state === "on") {

          document.getElementById("snoke-timer-toggle").checked = true;
          getLastSmokeTime("N");

        } else {
          getLastSmokeTime("Y");
        }
      }

      // Continue searching
      cursor.continue();
    }
  };
};

// Handle errors
request.onerror = function(event) {
  console.log("DB error: " + event.target.errorCode);
};

// Retrieve time since last smoke
function getLastSmokeTime(sinceSmoke) {

  // Connect to DB
  const transaction = db.transaction(["logs"], "readwrite");
  const dbStore = transaction.objectStore("logs");
  const index = dbStore.index("smoke");
  var cursorRequest;

  // Based on setting, assign cursor
  if (sinceSmoke === "Y") {
    cursorRequest = index.openCursor(IDBKeyRange.only("Y"), "prev");
  } else {
    cursorRequest = index.openCursor(IDBKeyRange.only("N"), "prev");
  }

  cursorRequest.onsuccess = function(event) {

    const cursor = event.target.result;

    // Display time elapsed in app ("Snoke" or smoking entries)
    if (cursor) {

      const lastSmokeTime = new Date(cursor.value.date);
      const now = new Date();
      const elapsedTime = now - lastSmokeTime;

      days = Math.floor(elapsedTime / (1000 * 60 * 60 * 24));
      hours = Math.floor((elapsedTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      minutes = Math.floor((elapsedTime % (1000 * 60 * 60)) / (1000 * 60));
      seconds = Math.floor((elapsedTime % (1000 * 60)) / 1000);

    } else {
    
    // Define a date and boolean object to store
    const dateBoolean = {
      date: new Date(),
      smoke: sinceSmoke
    };

    // Add the date to DB
    const addRequest = dbStore.add(dateBoolean);

    // Handle errors
    addRequest.onerror = function(event) {
      console.log("Error adding date and boolean value: " + event.target.errorCode);
    };

    // Notify of success
    addRequest.onsuccess = function(event) {
      console.log("Date and boolean value added to database");
    };
    }
  };
};

// On swithcing settings
function modifySetting(setting, stateTo) {

  // Connect to DB
  const transaction = db.transaction(["logs"], "readwrite");
  const dbStore = transaction.objectStore("logs");

  // Find given setting
  const index = dbStore.index("setting");
  const keyRange = IDBKeyRange.only(setting);
  const cursorRequest = index.openCursor(keyRange);

  cursorRequest.onsuccess = function(event) {

    const cursor = event.target.result;

    if (cursor) {

      // Update value to new state and update
      const updateData = cursor.value;
      updateData.state = stateTo;
      const request = cursor.update(updateData);

      // Motify of success
      request.onsuccess = function() {
        console.log("Entry modified successfully");
      };

      // Handel errors
      request.onerror = function(event) {
        console.log("Error modifying entry", event.target.errorCode);
      };
    }
  };

  // Handle errors
  cursorRequest.onerror = function(event) {
    console.log("Error retrieving entry with setting = 'dont' and state = true", event.target.errorCode);
  };
};

// Turn main button listeners on and off
function addListenerToButton(targetButton, targetState) {

  // Find button (on main "logo" screen and in modals)
  const button = document.getElementById(targetButton);

  // Add/remove eventListeners based on input
  if (targetButton === "dont-button" || targetButton === "didnt-button") {
    if (targetState === true) {
      button.addEventListener("click", fakeWriteToDB, false);
    } else {
      button.removeEventListener("click", fakeWriteToDB, false);
    }
  } else {
    if (targetState === true) {
      button.addEventListener("click", writeToDB, false);
    } else {
      button.removeEventListener("click", writeToDB, false);
    }
  }
};

// Connect and write a smoke to DB
function writeToDB() {
    
  // Connect to DB
  const transaction = db.transaction(["logs"], "readwrite");
  const dbStore = transaction.objectStore("logs");

  // Create new entry for today/now
  const dateBoolean = {
    date: new Date(),
    smoke: "Y"
  };

  // Add to DB
  const addRequest = dbStore.add(dateBoolean);

  // Handle errors
  addRequest.onerror = function(event) {
    console.log("Error adding date and boolean value: " + event.target.errorCode);
  };

  // Notify of success
  addRequest.onsuccess = function(event) {
    console.log("Date and boolean value added to database");
  };
};

// Exact same but for Snoke
function fakeWriteToDB() {
    
  const transaction = db.transaction(["logs"], "readwrite");
  const dbStore = transaction.objectStore("logs");
  const dateBoolean = {
    date: new Date(),
    smoke: "N"
  };
  const addRequest = dbStore.add(dateBoolean);
  addRequest.onerror = function(event) {
    console.log("Error adding date and boolean value: " + event.target.errorCode);
  };
  addRequest.onsuccess = function(event) {
    console.log("Date and boolean value added to database");
  };
};

////////////////
///  CHART  ///
////////////////

// Access DB data for graphing
function getData() {

  // Wait for data to be returned to be passed to graph
  return new Promise((resolve, reject) => {

    const openDB = indexedDB.open("snoke", 1);

    openDB.onsuccess = () => {

      // Create holders for labels and skipped DB entries (system values)
      const times = [];
      let skipped = 0;

      // Search the DB for smoking entries
      const db = openDB.result;
      const transaction = db.transaction("logs", "readonly");
      const dbStore = transaction.objectStore("logs");
      const index = dbStore.index("smoke");
      const keyRange = index.openCursor(IDBKeyRange.only("Y"));

      keyRange.onsuccess = (event) => {

        const cursor = event.target.result;

        // For each result
        if (cursor) {

          // Get date
          const date = new Date(cursor.value.date);
          const dateString = date.toDateString();
  
          // Skip system value
          if (skipped < 1) {
            skipped++;
          } else {

            // If date already in graph, add 1 to it
            if (dateString in times) {
              times[dateString]++;

            // Else create a label and value
            } else {
              times[dateString] = 1;
            }
          }

          // Continue to next entry
          cursor.continue();

        // If result doesn't exist (After last element)
        // Convert data holder to an object and resolve
        } else {

          const result = Object.entries(times).map(([dateString, count]) => ({
            date: dateString,
            count: count
          }));

          resolve(result);
        }
      };
    };

    // Handle errors
    openDB.onerror = () => {
      reject("Failed to open database");
    };
  });
};

// Create chart when data available
// Calls await getData()
async function createChart() {

  // Upon receiving data
  const times = await getData();

  // Create object for graph.js
  const data = {
    labels: [],
    datasets: [
      {
        label: "Smokes",
        data: [],
        fill: false,
        borderColor: "#b91b1b",
        fill: false,
        tension: 0.4
      }
    ],
  };

  // Set date format
  const options = { weekday: 'short', day: 'numeric', month: 'numeric' };

  // For each item in data
  times.forEach(function(item, index) {

    // Get current item date
    var date = new Date(item.date);

    // Skip first element (system value)
    if (index !== 0) {

      // Get defference in days to previous date
      let compareDate = new Date(times[index - 1].date)
      let dateIterator = (date - compareDate) / 86400000

      // While more than 1, add a day to chart with value of 0
      while (dateIterator > 1) {

        insertDate = new Date(date.getTime() - ((24 * 60 * 60 * 1000) * (dateIterator - 1)))
        insertDate = insertDate.toLocaleDateString("en-GB", options).replace(',', '.');
        
        data.labels.push(insertDate);
        data.datasets[0].data.push(0);

        dateIterator--;
      }
    }

    // Add current item to graph 
    const formattedDate = date.toLocaleDateString("en-GB", options).replace(',', '.'); // "Sat 8. Apr. 2023"
    data.labels.push(formattedDate);
    data.datasets[0].data.push(item.count);

    // On last iteration
    if (index === times.length - 1) { 

      // Get todays date
      var today = new Date();

      // And difference to last DB entry
      let dateIterator = (today - date) / 86400000;

      // While last day is not today
      while (dateIterator > 1) {

        // Insert a day for every missing day till today
        insertDate = new Date(today.getTime() - ((24 * 60 * 60 * 1000) * (dateIterator - 1)))// "Sat 
        insertDate = insertDate.toLocaleDateString("en-GB", options).replace(',', '.'); // "Sat

        data.labels.push(insertDate);
        data.datasets[0].data.push(0);

        // Continue
        dateIterator--;
      }
    }
  });

  // Final object for Graph.js
  const config = {
    type: "line",
    data: data,
    options: {
      interaction: {
        intersect: false,
      },
      scales: {
        y: {
          suggestedMin: 0,
          suggestedMax: Math.max(...data.datasets[0].data)
        }
      },
      plugins: {
        legend: {
          display: false
        }
      }
    },
  };

  // Draw Chart
  const myChart = new Chart(document.getElementById("myChart"), config);
};

createChart();