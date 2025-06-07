const DEFAULT_MAX_WATER_AMOUNT = 2500;
const DEFAULT_ADD_AMOUNT = 250;

let currentWaterAmount;
let maxWaterGoal;
let addWaterAmount;
let isDarkMode;

// const progressBar = document.getElementById("progressBar"); // Kaldırıldı - Bu zaten yorum satırıydı, tamamen silebiliriz.
const statusDisplay = document.getElementById("status");
const darkModeToggle = document.getElementById("darkModeToggle");
const rootElement = document.documentElement;
const settingsPanel = document.getElementById("settingsPanel");
const addAmountSelect = document.getElementById("addAmount");
const maxAmountInput = document.getElementById("maxAmount");
const drinkButton = document.getElementById("drinkButton");
// settingsButton'ın ID'si HTML'de aynı kaldı, bu yüzden burada değişiklik yok.
const settingsButton = document.getElementById("settingsButton");
const saveSettingsButton = document.getElementById("saveSettingsButton");
const resetWaterButton = document.getElementById("resetWaterButton");
const tipBubble = document.getElementById("tipBubble");
const tipContent = document.getElementById("tipContent");

// Yeni element: Kare progress bar
const waterFillProgress = document.getElementById("waterFillProgress");
// const waterIconContainer = document.querySelector(".water-icon-container"); // Kullanılmadığı için kaldırıldı

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

    waterFillProgress.style.height = percent + "%"; // Yeni: Yükseklik değişimi

    statusDisplay.innerText = `${currentWaterAmount} ml / ${maxWaterGoal} ml`;

    if (drinkButton) {
        if (currentWaterAmount >= maxWaterGoal) {
            drinkButton.innerText = "Afiyet Olsun! 🎉";
            drinkButton.style.backgroundColor = "var(--success-green)";
            drinkButton.style.cursor = "default";
        } else {
            drinkButton.innerText = "Drink";
            drinkButton.style.backgroundColor = "var(--primary-blue)";
            drinkButton.style.cursor = "pointer";
        }
    }
}

function addWater() {
    if (currentWaterAmount < maxWaterGoal) {
        currentWaterAmount += addWaterAmount;
        // Hedefi aşarsa, maksimum hedefe sabitle
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
    }
    updateDisplay();
    if (!isAutoReset && settingsPanel.style.display === "block") {
        settingsPanel.style.display = "none"; // Ayarlar panelini kapat
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
        maxAmountInput.value = maxWaterGoal; // Geçersizse eski değeri geri yükle
        return;
    }

    maxWaterGoal = newMax;
    localStorage.setItem("maxWater", maxWaterGoal);

    if (!isNaN(newAdd)) { // addAmountSelect'ten gelen değer zaten sayısal olmalı ama kontrol etmekte fayda var.
        addWaterAmount = newAdd;
        localStorage.setItem("addAmount", addWaterAmount);
    }
    
    isDarkMode = darkModeToggle.checked;
    localStorage.setItem("darkMode", isDarkMode);
    applyTheme(); // Tema ayarını hemen uygula

    updateDisplay(); // Yeni hedefle ekranı güncelle
    settingsPanel.style.display = "none"; // Ayarlar panelini kapat
}

// Event Listeners
drinkButton.addEventListener('click', addWater);
// settingsButton'ın ID'si HTML'de değişmediği için bu satır aynı kalabilir.
settingsButton.addEventListener('click', toggleSettings);
saveSettingsButton.addEventListener('click', saveAndCloseSettings);
resetWaterButton.addEventListener('click', () => resetWater(false)); // Manuel sıfırlama için

darkModeToggle.addEventListener("change", () => {
    isDarkMode = darkModeToggle.checked;
    localStorage.setItem("darkMode", isDarkMode);
    applyTheme();
});

// Sayfa yüklendiğinde
window.onload = function () {
    loadInitialSettings();
    resetWaterIfNewDay(); // Gün değiştiyse suyu sıfırla
    updateDisplay(); // Ekranı ilk yüklemede güncelle
    applyTheme(); // Temayı uygula
    settingsPanel.style.display = "none"; // Başlangıçta ayarlar panelini gizle
};
