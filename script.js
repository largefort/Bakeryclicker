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

// Function to handle automatic bread production by auto-bakers
function autoBakerProduction() {
    bread += autoBakerCount * autoBakerProduction;
    realTimeProduction += autoBakerCount * autoBakerProduction;
    updateResources();
}

// Automatic production by auto-bakers
setInterval(autoBakerProduction, 1000); // Update every second

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

// Add event listener for Auto-Baker button
document.getElementById("autoBaker").addEventListener("click", buyAutoBaker);
document.getElementById("autoBaker").addEventListener("touchstart", buyAutoBaker);

// Handle tab switching
document.getElementById("homeTab").addEventListener("click", switchToHomeTab);
document.getElementById("upgradesTab").addEventListener("click", switchToUpgradesTab);

// Function to switch to the Home Tab
function switchToHomeTab() {
    document.getElementById("homeContent").style.display = "block";
    document.getElementById("upgradesContent").style.display = "none";
}

// Function to switch to the Upgrades Tab
function switchToUpgradesTab() {
    document.getElementById("homeContent").style.display = "none";
    document.getElementById("upgradesContent").style.display = "block";
}

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
