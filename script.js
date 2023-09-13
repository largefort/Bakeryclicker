// Initialize variables
let bread = 0;
let cookies = 0;
let clickValue = 1;
let autoBakerCount = 0;
let autoBakerProduction = 1;

// Initialize real-time production counter
let realTimeProduction = 0;

// Open or create the IndexedDB database
const dbName = "bakeryClickerDB";
const dbVersion = 1;

let db;

const request = indexedDB.open(dbName, dbVersion);

request.onerror = function(event) {
    console.error("IndexedDB error: " + event.target.errorCode);
};

request.onsuccess = function(event) {
    db = event.target.result;
    loadGame(); // Load game data when the database is successfully opened
};

request.onupgradeneeded = function(event) {
    const db = event.target.result;
    if (!db.objectStoreNames.contains("gameData")) {
        db.createObjectStore("gameData", { keyPath: "id" });
    }
};

// Update the resource counts and display
function updateResources() {
    document.getElementById("bread").textContent = bread;
    document.getElementById("cookies").textContent = cookies;
    document.getElementById("realTimeProduction").textContent = realTimeProduction;
}

// Bake bread when clicked or tapped
document.getElementById("bake").addEventListener("click", bakeBread);
document.getElementById("bake").addEventListener("touchstart", bakeBread);

function bakeBread() {
    bread += clickValue;
    realTimeProduction += clickValue; // Update real-time production
    updateResources();
    saveGame(); // Save the game state when the player clicks
}

// Implement upgrades when buttons are clicked or tapped
document.getElementById("upgrade1").addEventListener("click", upgrade1);
document.getElementById("upgrade1").addEventListener("touchstart", upgrade1);

document.getElementById("upgrade2").addEventListener("click", upgrade2);
document.getElementById("upgrade2").addEventListener("touchstart", upgrade2);

document.getElementById("autoBaker").addEventListener("click", buyAutoBaker);
document.getElementById("autoBaker").addEventListener("touchstart", buyAutoBaker);

function upgrade1() {
    if (bread >= 10) {
        bread -= 10;
        clickValue += 1;
        realTimeProduction += 1; // Update real-time production
        updateResources();
        saveGame(); // Save the game state after an upgrade
    }
}

function upgrade2() {
    if (bread >= 20) {
        bread -= 20;
        clickValue += 2;
        realTimeProduction += 2; // Update real-time production
        updateResources();
        saveGame(); // Save the game state after an upgrade
    }
}

function buyAutoBaker() {
    const cost = 50 * (autoBakerCount + 1); // Increase cost with each purchase
    if (bread >= cost) {
        bread -= cost;
        autoBakerCount++;
        autoBakerProduction++;
        realTimeProduction += autoBakerProduction; // Update real-time production
        updateResources();
        saveGame(); // Save the game state after purchasing an auto-baker
    }
}

// Automatic production by auto-bakers
setInterval(function() {
    bread += autoBakerCount * autoBakerProduction;
    realTimeProduction += autoBakerCount * autoBakerProduction; // Update real-time production
    updateResources();
    saveGame(); // Save the game state periodically (e.g., every minute)
}, 60000); // Save the game every minute

// Function to save the game data
function saveGame() {
    const transaction = db.transaction(["gameData"], "readwrite");
    const objectStore = transaction.objectStore("gameData");

    const gameData = {
        id: 1, // Use a single entry for the game data
        bread: bread,
        cookies: cookies,
        clickValue: clickValue,
        autoBakerCount: autoBakerCount,
        autoBakerProduction: autoBakerProduction
    };

    const request = objectStore.put(gameData);

    request.onsuccess = function(event) {
        console.log("Game data saved successfully");
    };

    request.onerror = function(event) {
        console.error("Error saving game data: " + event.target.errorCode);
    };
}

// Function to load the game data
function loadGame() {
    const transaction = db.transaction(["gameData"], "readonly");
    const objectStore = transaction.objectStore("gameData");

    const request = objectStore.get(1); // Assuming the game data is stored with an ID of 1

    request.onsuccess = function(event) {
        const gameData = event.target.result;
        if (gameData) {
            // Load the saved game data
            bread = gameData.bread;
            cookies = gameData.cookies;
            clickValue = gameData.clickValue;
            autoBakerCount = gameData.autoBakerCount;
            autoBakerProduction = gameData.autoBakerProduction;
            updateResources(); // Update the displayed resources
        }
    };

    request.onerror = function(event) {
        console.error("Error loading game data: " + event.target.errorCode);
    };
}

// Start the game
updateResources();
