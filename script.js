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
const tipBubble = document.getElementById("tipBubble"); // HTML'de display: none olduğu için hala burada kalabilir.
const tipContent = document.getElementById("tipContent"); // tipBubble ile birlikte kalabilir.

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
            // Normal (varsayılan) görünüm için - Önceki 13px -> 12px, Önceki 8px -> 7px
            drinkButton.style.fontSize = "12px"; // Afiyet Olsun için varsayılan font boyutu (1px düşürüldü)
            drinkButton.style.paddingLeft = "7px"; // (1px düşürüldü)
            drinkButton.style.paddingRight = "7px"; // (1px düşürüldü)
            // Dikey paddingleri değiştirmene gerek kalmaz, butonun yüksekliği CSS'ten sabit.

            // Telefon/Medya Sorguları için Özel Boyutlandırmalar (JavaScript ile)
            const width = window.innerWidth;
            const height = window.innerHeight;

            // Küçük ekranlar (max-width: 375px) - Önceki 11.5px -> 10.5px, Önceki 6px -> 5px
            if (width <= 375) {
                drinkButton.style.fontSize = "10.5px"; // (1px düşürüldü)
                drinkButton.style.paddingLeft = "5px"; // (1px düşürüldü)
                drinkButton.style.paddingRight = "5px"; // (1px düşürüldü)
            }
            // Büyük ekranlar (min-width: 414px) - Önceki 14px -> 13px, Önceki 13px -> 12px
            else if (width >= 414) {
                drinkButton.style.fontSize = "13px"; // Büyük ekranlarda Afiyet Olsun için biraz daha büyük font (1px düşürüldü)
                drinkButton.style.paddingLeft = "12px"; // (1px düşürüldü)
                drinkButton.style.paddingRight = "12px"; // (1px düşürüldü)
            }

            // Yatay konum ve küçük yükseklik (orientation: landscape and max-height: 500px)
            // Cihazın yatay konumda olup olmadığını ve yüksekliğinin düşük olup olmadığını kontrol et
            // Önceki 11.5px -> 10.5px, Önceki 6px -> 5px
            if (height <= 500 && width > height) { // Genişlik yükseklikten fazlaysa yataydır
                drinkButton.style.fontSize = "10.5px"; // (1px düşürüldü)
                drinkButton.style.paddingLeft = "5px"; // (1px düşürüldü)
                drinkButton.style.paddingRight = "5px"; // (1px düşürüldü)
            }
            // ***** SADECE AFİYET OLSUN! 🎉 YAZISI İÇİN BOYUT AYARLAMALARI SONU *****

        } else {
            drinkButton.innerText = "Drink";
            drinkButton.style.backgroundColor = "var(--primary-blue)";
            drinkButton.style.cursor = "pointer";

            // ***** SADECE DRINK YAZISI İÇİN BOYUT AYARLAMALARI BAŞLANGICI *****
            // CSS'ten gelecek varsayılan değerlere sıfırlamak en iyisidir.
            // Bunun için inline style'ları temizleyebiliriz.
            drinkButton.style.fontSize = ""; // CSS'teki varsayılan boyutu kullanır
            drinkButton.style.paddingLeft = ""; // CSS'teki varsayılan padding'i kullanır
            drinkButton.style.paddingRight = ""; // CSS'teki varsayılan padding'i kullanır
            drinkButton.style.paddingTop = ""; // CSS'teki varsayılan padding'i kullanır
            drinkButton.style.paddingBottom = ""; // CSS'teki varsayılan padding'i kullanır


            // Medya Sorguları ile CSS'te belirlenen "Drink" boyutlarını tekrar uygulamak için
            // Aslında yukarıdaki boş string atamaları yeterli olur, çünkü tarayıcı CSS'teki medya sorgularını uygular.
            // Ancak garanti olması için veya özel durumlar için JavaScript ile de belirtebiliriz.
            const width = window.innerWidth;
            const height = window.innerHeight;

            if (width <= 375) { // Küçük ekranlar
                // drinkButton.style.fontSize = "14px"; // Zaten CSS'ten gelmeli, istersen buraya ekle
                // drinkButton.style.paddingLeft = "10px";
                // drinkButton.style.paddingRight = "10px";
            } else if (width >= 414) { // Büyük ekranlar
                // drinkButton.style.fontSize = "17px"; // Zaten CSS'ten gelmeli, istersen buraya ekle
                // drinkButton.style.paddingLeft = "18px";
                // drinkButton.style.paddingRight = "18px";
            }

            if (height <= 500 && width > height) { // Yatay küçük ekranlar
                // drinkButton.style.fontSize = "14px"; // Zaten CSS'ten gelmeli, istersen buraya ekle
                // drinkButton.style.paddingLeft = "10px";
                // drinkButton.style.paddingRight = "10px";
            }
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
    // Reset yapıldığında butonu "Drink" durumuna döndür ve stilini sıfırla
    if (drinkButton) {
        drinkButton.innerText = "Drink";
        drinkButton.style.backgroundColor = "var(--primary-blue)";
        drinkButton.style.cursor = "pointer";
        // Stil sıfırlama (CSS'e geri dönmesini sağlar)
        drinkButton.style.fontSize = "";
        drinkButton.style.paddingLeft = "";
        drinkButton.style.paddingRight = "";
        drinkButton.style.paddingTop = "";
        drinkButton.style.paddingBottom = "";
    }
    updateDisplay(); // Bu çağrı içindeki stil ayarlamaları da tekrar çalışacak
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

    updateDisplay(); // Yeni hedefle ekranı güncelle, buton stilini de günceller
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

// Sayfa yüklendiğinde ve boyut değiştiğinde veya yön değiştirildiğinde
window.onload = function () {
    loadInitialSettings();
    resetWaterIfNewDay();
    updateDisplay(); // İlk yüklemede ve boyut değişikliklerinde stil doğru ayarlanır
    applyTheme();
    settingsPanel.style.display = "none";
};

// Ekran boyutu değiştiğinde veya cihaz yönü değiştiğinde de updateDisplay'i çağır
window.addEventListener('resize', updateDisplay);
