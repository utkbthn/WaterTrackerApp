const DEFAULT_MAX_WATER_AMOUNT = 2500;
const DEFAULT_ADD_AMOUNT = 250;

let currentWaterAmount;
let maxWaterGoal;
let addWaterAmount;
let isDarkMode;

const progressBar = document.getElementById("progressBar");
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

    progressBar.style.width = percent + "%";
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
        localStorage.setItem("addAmount", addWaterAmount);
    }
    
    isDarkMode = darkModeToggle.checked;
    localStorage.setItem("darkMode", isDarkMode);
    applyTheme();

    updateDisplay();
    settingsPanel.style.display = "none";
}

const tips = [
    "Su içmeyi unutmayın! Günde en az 8 bardak su hedefini deneyin.",
    "Susuzluk hissettiğinizde, vücudunuz zaten hafifçe susuz kalmıştır. Düzenli su için.",
    "Egzersiz yapıyorsanız daha fazla suya ihtiyacınız olabilir.",
    "Yemeklerden önce bir bardak su içmek iştahınızı kontrol etmenize yardımcı olabilir.",
    "Sık sık baş ağrısı çekiyorsanız, dehidrasyonun bir nedeni olup olmadığını kontrol edin.",
    "Meyve ve sebzeler de su içerir. Dengeli beslenmeye özen gösterin.",
    "Kahve ve alkol vücudunuzdan su atılmasına neden olabilir, tüketiminizi dengeleyin.",
    "Gün içinde küçük yudumlarla su içmek, büyük miktarlarda bir anda içmekten daha faydalıdır.",
    "Su şişenizi yanınızda taşıyarak su içme alışkanlığınızı pekiştirin."
];

let currentTipIndex = 0;

function showNextTip() {
    tipBubble.classList.remove('show');
    setTimeout(() => {
        currentTipIndex = (currentTipIndex + 1) % tips.length;
        tipContent.innerText = tips[currentTipIndex];
        tipBubble.classList.add('show');
    }, 500);
}

drinkButton.addEventListener('click', addWater);
settingsButton.addEventListener('click', toggleSettings);
saveSettingsButton.addEventListener('click', saveAndCloseSettings);
resetWaterButton.addEventListener('click', () => resetWater(false));
darkModeToggle.addEventListener("change", applyTheme);
tipBubble.addEventListener('click', showNextTip);

window.onload = function () {
    loadInitialSettings();
    resetWaterIfNewDay();
    updateDisplay();
    applyTheme();
    showNextTip();
    setInterval(showNextTip, 7200000);
};
