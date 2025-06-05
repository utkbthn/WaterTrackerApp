const DEFAULT_MAX_WATER_AMOUNT = 2500;
const DEFAULT_ADD_AMOUNT = 250;

let currentWaterAmount = parseInt(localStorage.getItem("water")) || 0;
let maxWaterGoal = parseInt(localStorage.getItem("maxWater")) || DEFAULT_MAX_WATER_AMOUNT;
let addWaterAmount = parseInt(localStorage.getItem("addAmount")) || DEFAULT_ADD_AMOUNT;

let isDarkMode = localStorage.getItem("darkMode") === "true";

const progressBar = document.getElementById("progressBar"); // Burası progressBar olarak doğru ayarlandı
const statusDisplay = document.getElementById("status");
const darkModeToggle = document.getElementById("darkModeToggle");    
const rootElement = document.documentElement;    

let lastResetDate = localStorage.getItem("lastResetDate");

function applyTheme() {
    if (isDarkMode) {
        rootElement.classList.add("dark-mode");
    } else {
        rootElement.classList.remove("dark-mode");
    }
}

// Tarihi YYYY-MM-DD formatında string olarak döndüren yardımcı fonksiyon
function getTodayDateString() {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Gün değiştiyse su miktarını sıfırlayan fonksiyon
function resetWaterIfNewDay() {
    const todayDate = getTodayDateString();
    if (lastResetDate !== todayDate) {
        resetWater(); // Su miktarını sıfırla
        lastResetDate = todayDate; // Son sıfırlama tarihini bugünün tarihi yap
        localStorage.setItem("lastResetDate", lastResetDate); // localStorage'a kaydet
    }
}

function updateDisplay() {
    let percent = (currentWaterAmount / maxWaterGoal) * 100;
    if (percent > 100) percent = 100;
    if (percent < 0) percent = 0;

    progressBar.style.width = percent + "%"; // ProgressBar için 'width' kullanıldı
    
    statusDisplay.innerText = `${currentWaterAmount} ml / ${maxWaterGoal} ml`;

    const drinkButton = document.getElementById("drinkButton");
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

// Su ekleme fonksiyonu
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

// Suyu sıfırlama fonksiyonu
function resetWater() {
    currentWaterAmount = 0;
    localStorage.setItem("water", currentWaterAmount);
    const drinkButton = document.getElementById("drinkButton");
    if (drinkButton) {
        drinkButton.innerText = "Drink";
        drinkButton.style.backgroundColor = "var(--primary-blue)";
        drinkButton.style.cursor = "pointer";
    }
    updateDisplay();
    if (document.getElementById("settingsPanel").style.display === "block") {
        document.getElementById("settingsPanel").style.display = "none";
    }
}

// Ayarlar panelini açma/kapatma fonksiyonu
function openSettings() {
    const settingsPanel = document.getElementById("settingsPanel");
    document.getElementById("maxAmount").value = maxWaterGoal;
    document.getElementById("addAmount").value = addWaterAmount;

    darkModeToggle.checked = isDarkMode;

    if (settingsPanel.style.display === "none" || settingsPanel.style.display === "") {
        settingsPanel.style.display = "block";
    } else {
        settingsPanel.style.display = "none";
    }
}

// Ayarları kaydetme ve paneli kapatma fonksiyonu
function saveAndCloseSettings() {
    const newMax = parseInt(document.getElementById("maxAmount").value);
    const newAdd = parseInt(document.getElementById("addAmount").value);

    if (isNaN(newMax) || newMax < 500) {
        alert("Günlük hedef en az 500 ml olmalı ve sayısal bir değer girilmelidir!");
        document.getElementById("maxAmount").value = maxWaterGoal;
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
    document.getElementById("settingsPanel").style.display = "none";
}

// Tips Baloncuğu Fonksiyonları
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
const tipBubble = document.getElementById("tipBubble");
const tipContent = document.getElementById("tipContent");

function showNextTip() {
    tipBubble.classList.remove('show');
    setTimeout(() => {
        currentTipIndex = (currentTipIndex + 1) % tips.length;
        tipContent.innerText = tips[currentTipIndex];
        tipBubble.classList.add('show');
    }, 500);
}

tipBubble.addEventListener('click', showNextTip);

// Sayfa yüklendiğinde çalışacak fonksiyon
window.onload = function () {
    resetWaterIfNewDay();
    updateDisplay();
    applyTheme();
    showNextTip();
    setInterval(showNextTip, 7200000); // 2 saatte bir ipucunu değiştir (7.200.000 ms)
};

// Karanlık mod anahtarı değiştiğinde temayı güncelle
darkModeToggle.addEventListener("change", () => {
    isDarkMode = darkModeToggle.checked;
    localStorage.setItem("darkMode", isDarkMode);
    applyTheme();
});
