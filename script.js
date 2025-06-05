const DEFAULT_MAX_WATER_AMOUNT = 2500;
const DEFAULT_ADD_AMOUNT = 250;

let currentWaterAmount = parseInt(localStorage.getItem("water")) || 0;
let maxWaterGoal = parseInt(localStorage.getItem("maxWater")) || DEFAULT_MAX_WATER_AMOUNT;
let addWaterAmount = parseInt(localStorage.getItem("addAmount")) || DEFAULT_ADD_AMOUNT;

// Karanlık mod değişkeni ve localStorage'dan oku
// Eğer 'darkMode' localStorage'da yoksa veya 'false' ise, isDarkMode da false olur.
let isDarkMode = localStorage.getItem("darkMode") === "true";

// HTML elementlerine referanslar
const progressBar = document.getElementById("progressBar");
const statusDisplay = document.getElementById("status");
const darkModeToggle = document.getElementById("darkModeToggle"); // HTML'den karanlık mod checkbox'ını al
const body = document.body; // HTML'deki body etiketine referans

let lastResetDate = localStorage.getItem("lastResetDate");

// --- Yeni Fonksiyon: applyTheme() ---
// Bu fonksiyon, isDarkMode değişkenine göre body etiketine "dark-mode" sınıfını ekler veya kaldırır.
function applyTheme() {
    if (isDarkMode) {
        body.classList.add("dark-mode");
    } else {
        body.classList.remove("dark-mode");
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

// Ekranı güncelleyen fonksiyon (ilerleme çubuğu ve metin)
function updateDisplay() {
    let percent = (currentWaterAmount / maxWaterGoal) * 100;
    if (percent > 100) percent = 100; // %100'ü geçmesin
    if (percent < 0) percent = 0;   // %0'ın altına inmesin

    progressBar.style.width = percent + "%";
    statusDisplay.innerText = `${currentWaterAmount} ml / ${maxWaterGoal} ml`;

    const drinkButton = document.getElementById("drinkButton");
    if (drinkButton) {
        if (currentWaterAmount >= maxWaterGoal) {
            drinkButton.innerText = "Afiyet Olsun! 🎉";
            drinkButton.style.backgroundColor = "var(--success-green)"; // Hedefe ulaşıldığında yeşil buton
            drinkButton.style.cursor = "default"; // Tıklanamaz yapsak daha iyi
        } else {
            drinkButton.innerText = "Drink";
            drinkButton.style.backgroundColor = "var(--primary-blue)"; // Normal mavi buton
            drinkButton.style.cursor = "pointer";
        }
    }
}

// Su ekleme fonksiyonu
function addWater() {
    if (currentWaterAmount < maxWaterGoal) { // Hedefe ulaşılmadıysa ekleme yap
        currentWaterAmount += addWaterAmount;
        if (currentWaterAmount > maxWaterGoal) { // Hedefi aşarsa hedef miktarına sabitle
            currentWaterAmount = maxWaterGoal;
        }
        localStorage.setItem("water", currentWaterAmount); // localStorage'a kaydet
        updateDisplay(); // Ekranı güncelle
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
    updateDisplay(); // Ekranı güncelle
    // Ayarlar paneli açıksa kapat
    if (document.getElementById("settingsPanel").style.display === "block") {
        document.getElementById("settingsPanel").style.display = "none";
    }
}

// Ayarlar panelini açma/kapatma fonksiyonu
function openSettings() {
    const settingsPanel = document.getElementById("settingsPanel");
    document.getElementById("maxAmount").value = maxWaterGoal;
    document.getElementById("addAmount").value = addWaterAmount;

    // --- Güncelleme: Karanlık mod anahtarının durumunu güncelle ---
    darkModeToggle.checked = isDarkMode; // Checkbox'ın mevcut tema durumunu yansıtmasını sağlar

    if (settingsPanel.style.display === "none" || settingsPanel.style.display === "") {
        settingsPanel.style.display = "block"; // Paneli göster
    } else {
        settingsPanel.style.display = "none"; // Paneli gizle
    }
}

// Ayarları kaydetme ve paneli kapatma fonksiyonu
function saveAndCloseSettings() {
    const newMax = parseInt(document.getElementById("maxAmount").value);
    const newAdd = parseInt(document.getElementById("addAmount").value);

    // Günlük hedef doğrulama
    if (isNaN(newMax) || newMax < 500) {
        alert("Günlük hedef en az 500 ml olmalı ve sayısal bir değer girilmelidir!");
        document.getElementById("maxAmount").value = maxWaterGoal; // Geçersiz değeri geri yükle
        return; // Fonksiyondan çık
    }

    maxWaterGoal = newMax;
    localStorage.setItem("maxWater", maxWaterGoal); // localStorage'a kaydet

    // İçilecek miktar doğrulama
    if (!isNaN(newAdd)) {
        addWaterAmount = newAdd;
        localStorage.setItem("addAmount", addWaterAmount); // localStorage'a kaydet
    }

    // --- Güncelleme: Karanlık mod tercihini kaydet ve uygula ---
    isDarkMode = darkModeToggle.checked; // Checkbox'ın mevcut durumunu al
    localStorage.setItem("darkMode", isDarkMode); // Durumu localStorage'a kaydet
    applyTheme(); // Yeni temayı hemen uygula

    updateDisplay(); // Ekranı güncelle
    document.getElementById("settingsPanel").style.display = "none"; // Paneli kapat
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
    tipBubble.classList.remove('show'); // Baloncuğu gizle
    setTimeout(() => {
        currentTipIndex = (currentTipIndex + 1) % tips.length; // Bir sonraki ipucuna geç
        tipContent.innerText = tips[currentTipIndex]; // İçeriği güncelle
        tipBubble.classList.add('show'); // Baloncuğu tekrar göster
    }, 500); // Geçiş süresi kadar bekle (CSS transition ile aynı olmalı)
}

// Kullanıcı baloncuğa tıklarsa, bir sonraki ipucuna geçsin
tipBubble.addEventListener('click', showNextTip);

// Sayfa yüklendiğinde çalışacak fonksiyon
window.onload = function () {
    resetWaterIfNewDay(); // Yeni gün kontrolü ve sıfırlama
    updateDisplay(); // Ekranı güncelle
    applyTheme(); // --- Yeni: Sayfa yüklendiğinde kaydedilmiş temayı uygula ---
    showNextTip(); // İlk ipucunu göster
    setInterval(showNextTip, 7200000); // 2 saatte bir ipucunu değiştir (7.200.000 ms)
};

// --- Yeni: Karanlık mod anahtarı değiştiğinde temayı güncelle ---
darkModeToggle.addEventListener("change", () => {
    isDarkMode = darkModeToggle.checked; // Checkbox'ın yeni durumunu al
    localStorage.setItem("darkMode", isDarkMode); // Durumu localStorage'a kaydet
    applyTheme(); // Yeni temayı hemen uygula
});
