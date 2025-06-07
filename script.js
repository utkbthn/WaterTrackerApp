const DEFAULT_MAX_WATER_AMOUNT = 2500;
const DEFAULT_ADD_AMOUNT = 250;

let currentWaterAmount;
let maxWaterGoal;
let addWaterAmount;
let isDarkMode;

const statusDisplay = document.getElementById("status");
const darkModeToggle = document.getElementById("darkModeToggle");
const rootElement = document.documentElement;
const settingsPanel = document.getElementById("settingsPanel");
const addAmountSelect = document.getElementById("addAmount");
const maxAmountInput = document.getElementById("maxAmount");
const drinkButton = document.getElementById("drinkButton");
const settingsButton = document.getElementById("settingsButton");
const saveSettingsButton = document.getElementById("saveSettingsButton");
const resetWaterButton = document.getElementById("resetWaterButton");
const tipBubble = document.getElementById("tipBubble");
const tipContent = document.getElementById("tipContent");

const waterFillProgress = document.getElementById("waterFillProgress");

let lastResetDate;

function loadInitialSettings() {
    currentWaterAmount = Number(localStorage.getItem("water"));
    if (isNaN(currentWaterAmount)) currentWaterAmount = 0;

    maxWaterGoal = Number(localStorage.getItem("maxWater"));
    if (isNaN(maxWaterGoal) || maxWaterGoal < 500) maxWaterGoal = DEFAULT_MAX_WATER_AMOUNT;

    addWaterAmount = Number(localStorage.getItem("addAmount"));
    if (isNaN(addWaterAmount)) addWaterAmount = DEFAULT_ADD_AMOUNT;

    isDarkMode = localStorage.getItem("darkMode") === "true";
    lastResetDate = localStorage.getItem("lastResetDate");
}

function applyTheme() {
    if (isDarkMode) {
        rootElement.classList.add("dark-mode");
    } else {
        rootElement.classList.remove("dark-mode");
    }
    if (darkModeToggle) {
        darkModeToggle.checked = isDarkMode;
    }
}

function getTodayDateString() {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function resetWaterIfNewDay() {
    const todayDate = getTodayDateString();
    if (lastResetDate !== todayDate) {
        resetWater(true);
        lastResetDate = todayDate;
        localStorage.setItem("lastResetDate", lastResetDate);
    }
}

function updateDisplay() {
    let percent = (currentWaterAmount / maxWaterGoal) * 100;
    percent = Math.min(Math.max(percent, 0), 100);

    waterFillProgress.style.height = percent + "%";
    statusDisplay.innerText = `${currentWaterAmount} ml / ${maxWaterGoal} ml`;

    if (drinkButton) {
        if (currentWaterAmount >= maxWaterGoal) {
            drinkButton.innerText = "Afiyet Olsun! 🎉";
            drinkButton.style.backgroundColor = "var(--success-green)";
            drinkButton.style.cursor = "default";

            // ***** SADECE AFİYET OLSUN! 🎉 YAZISI İÇİN BOYUT AYARLAMALARI BAŞLANGICI *****
            // MacBook Air ve genel büyük ekranlar için varsayılan Afiyet Olsun stili
            drinkButton.style.fontSize = "12px";
            drinkButton.style.paddingLeft = "7px";
            drinkButton.style.paddingRight = "7px";

            // iPhone 13 dikey ve benzeri küçük ekranlar için özel Afiyet Olsun stili
            const width = window.innerWidth;
            if (width <= 375) {
                drinkButton.style.fontSize = "10.5px";
                drinkButton.style.paddingLeft = "5px";
                drinkButton.style.paddingRight = "5px";
            }
            // ***** SADEFE AFİYET OLSUN! 🎉 YAZISI İÇİN BOYUT AYARLAMALARI SONU *****

        } else {
            drinkButton.innerText = "Drink";
            drinkButton.style.backgroundColor = "var(--primary-blue)";
            drinkButton.style.cursor = "pointer";

            // ***** SADECE DRINK YAZISI İÇİN BOYUT AYARLAMALARI BAŞLANGICI *****
            // CSS'ten gelecek varsayılan değerlere sıfırlamak en iyisidir.
            // Bu, MacBook Air ve diğer büyük ekranlarda CSS'teki .app-button font-size ve padding'ini kullanır.
            drinkButton.style.fontSize = "";
            drinkButton.style.paddingLeft = "";
            drinkButton.style.paddingRight = "";
            drinkButton.style.paddingTop = "";
            drinkButton.style.paddingBottom = "";

            // iPhone 13 dikey ve benzeri küçük ekranlar için CSS'teki .app-button medya sorgusunu kullanır.
            // Bu kısımda JavaScript ile özel bir ayar yapmaya gerek yok, CSS zaten halledecek.
            // ***** SADECE DRINK YAZISI İÇİN BOYUT AYARLAMALARI SONU *****
        }
    }
}

function addWater() {
    if (currentWaterAmount < maxWaterGoal) {
        currentWaterAmount += addWaterAmount;
        if (currentWaterAmount > maxWaterGoal) {
            currentWaterAmount = maxWaterGoal;
        }
        localStorage.setItem("water", currentWaterAmount);
        updateDisplay();
    }
}

function resetWater(isAutoReset = false) {
    currentWaterAmount = 0;
    localStorage.setItem("water", currentWaterAmount);
    if (drinkButton) {
        drinkButton.innerText = "Drink";
        drinkButton.style.backgroundColor = "var(--primary-blue)";
        drinkButton.style.cursor = "pointer";
        drinkButton.style.fontSize = "";
        drinkButton.style.paddingLeft = "";
        drinkButton.style.paddingRight = "";
        drinkButton.style.paddingTop = "";
        drinkButton.style.paddingBottom = "";
    }
    updateDisplay();
    if (!isAutoReset && settingsPanel.style.display === "block") {
        settingsPanel.style.display = "none";
    }
}

function toggleSettings() {
    if (settingsPanel.style.display === "none" || settingsPanel.style.display === "") {
        maxAmountInput.value = maxWaterGoal;
        addAmountSelect.value = addWaterAmount;
        darkModeToggle.checked = isDarkMode;
        settingsPanel.style.display = "block";
    } else {
        settingsPanel.style.display = "none";
    }
}

function saveAndCloseSettings() {
    const newMax = Number(maxAmountInput.value);
    const newAdd = Number(addAmountSelect.value);

    if (isNaN(newMax) || newMax < 500) {
        alert("Günlük hedef en az 500 ml olmalı ve sayısal bir değer girilmelidir!");
        maxAmountInput.value = maxWaterGoal;
        return;
    }

    maxWaterGoal = newMax;
    localStorage.setItem("maxWater", maxWaterGoal);

    if (!isNaN(newAdd)) {
        addWaterAmount = newAdd;
        localStorage.setItem("addAmount", newAdd);
    }

    isDarkMode = darkModeToggle.checked;
    localStorage.setItem("darkMode", isDarkMode);
    applyTheme();

    updateDisplay();
    settingsPanel.style.display = "none";
}

// Event Listeners
drinkButton.addEventListener('click', addWater);
settingsButton.addEventListener('click', toggleSettings);
saveSettingsButton.addEventListener('click', saveAndCloseSettings);
resetWaterButton.addEventListener('click', () => resetWater(false));

darkModeToggle.addEventListener("change", () => {
    isDarkMode = darkModeToggle.checked;
    localStorage.setItem("darkMode", isDarkMode);
    applyTheme();
});

// Sayfa yüklendiğinde ve boyut değiştiğinde
window.onload = function () {
    loadInitialSettings();
    resetWaterIfNewDay();
    updateDisplay();
    applyTheme();
    settingsPanel.style.display = "none";
};

// Ekran boyutu değiştiğinde de updateDisplay'i çağır
window.addEventListener('resize', updateDisplay);
