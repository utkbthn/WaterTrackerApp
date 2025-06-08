document.addEventListener('DOMContentLoaded', () => {
    // DOM Elementleri
    const waterFillProgress = document.getElementById('waterFillProgress');
    const statusText = document.getElementById('status');
    const drinkButton = document.getElementById('drinkButton');
    const ayarlarButonu = document.getElementById('ayarlarButonu');             // Değişti: settingsButton -> ayarlarButonu
    const ayarlarPaneli = document.getElementById('ayarlarPaneli');             // Değişti: settingsPanel -> ayarlarPaneli
    const addAmountSelect = document.getElementById('addAmount');
    const maxAmountInput = document.getElementById('maxAmount');
    const darkModeToggle = document.getElementById('darkModeToggle');
    const kaydetAyarlarButonu = document.getElementById('kaydetAyarlarButonu'); // Değişti: saveSettingsButton -> kaydetAyarlarButonu
    const sifirlaSuButonu = document.getElementById('sifirlaSuButonu');         // Değişti: resetWaterButton -> sifirlaSuButonu
    const suLogo = document.querySelector('.su-logo');

    // Varsayılan Değerler
    const defaultAddAmount = 250;
    const defaultMaxAmount = 2500;
    const defaultDarkMode = false;
    let currentWaterAmount = 0;
    let maxWaterAmount = defaultMaxAmount;
    let addWaterAmount = defaultAddAmount;

    // Local Storage'dan ayarları yükle
    function loadSettings() {
        const savedWaterAmount = localStorage.getItem('currentWaterAmount');
        const savedMaxAmount = localStorage.getItem('maxWaterAmount');
        const savedAddAmount = localStorage.getItem('addWaterAmount');
        const savedDarkMode = localStorage.getItem('darkMode');

        if (savedWaterAmount !== null) {
            currentWaterAmount = parseInt(savedWaterAmount);
        }
        if (savedMaxAmount !== null) {
            maxWaterAmount = parseInt(savedMaxAmount);
        }
        if (savedAddAmount !== null) {
            addWaterAmount = parseInt(savedAddAmount);
        }
        if (savedDarkMode !== null) {
            darkModeToggle.checked = (savedDarkMode === 'true');
        }

        addAmountSelect.value = addWaterAmount;
        maxAmountInput.value = maxWaterAmount;
        applyDarkMode(darkModeToggle.checked);
        updateWaterDisplay();
    }

    // Su seviyesini güncelle ve görüntüle
    function updateWaterDisplay() {
        const percentage = (currentWaterAmount / maxWaterAmount) * 100;
        waterFillProgress.style.height = `${percentage}%`;

        if (percentage >= 100) {
            statusText.textContent = `Tebrikler! Günlük hedefinize ulaştınız: ${currentWaterAmount} ml`;
            statusText.style.color = 'var(--success-green)';
            waterFillProgress.style.backgroundColor = 'var(--success-green)';
        } else {
            statusText.textContent = `${currentWaterAmount} ml / ${maxWaterAmount} ml`;
            statusText.style.color = 'var(--text-color)';
            waterFillProgress.style.backgroundColor = 'var(--water-fill-color)';
        }
    }

    // Su ekle
    function addWater() {
        if (currentWaterAmount < maxWaterAmount) {
            currentWaterAmount += addWaterAmount;
            if (currentWaterAmount > maxWaterAmount) {
                currentWaterAmount = maxWaterAmount;
            }
            localStorage.setItem('currentWaterAmount', currentWaterAmount);
            updateWaterDisplay();
        }
    }

    // Karanlık mod uygula/kaldır
    function applyDarkMode(isDark) {
        if (isDark) {
            document.documentElement.classList.add('dark-mode');
            localStorage.setItem('darkMode', 'true');
        } else {
            document.documentElement.classList.remove('dark-mode');
            localStorage.setItem('darkMode', 'false');
        }
        // Temanın değişmesiyle metin rengini yeniden ayarla
        updateWaterDisplay();
    }

    // Ayarları kaydet
    function saveSettings() {
        maxWaterAmount = parseInt(maxAmountInput.value);
        addWaterAmount = parseInt(addAmountSelect.value);

        if (isNaN(maxWaterAmount) || maxWaterAmount < 500) {
            alert("Günlük hedef en az 500 ml olmalıdır!");
            maxWaterAmount = defaultMaxAmount; // Geçersizse varsayılana dön
            maxAmountInput.value = defaultMaxAmount;
        }

        localStorage.setItem('maxWaterAmount', maxWaterAmount);
        localStorage.setItem('addWaterAmount', addWaterAmount);
        localStorage.setItem('darkMode', darkModeToggle.checked);

        applyDarkMode(darkModeToggle.checked);
        updateWaterDisplay();
        ayarlarPaneli.style.display = 'none'; // Ayarları kaydettikten sonra paneli kapat
    }

    // Suyu sıfırla
    function resetWater() {
        currentWaterAmount = 0;
        localStorage.setItem('currentWaterAmount', currentWaterAmount);
        updateWaterDisplay();
    }

    // Olay Dinleyicileri
    drinkButton.addEventListener('click', addWater);
    ayarlarButonu.addEventListener('click', () => { // Değişti: settingsButton -> ayarlarButonu
        ayarlarPaneli.style.display = ayarlarPaneli.style.display === 'block' ? 'none' : 'block'; // Değişti: settingsPanel -> ayarlarPaneli
    });
    kaydetAyarlarButonu.addEventListener('click', saveSettings); // Değişti: saveSettingsButton -> kaydetAyarlarButonu
    sifirlaSuButonu.addEventListener('click', resetWater);     // Değişti: resetWaterButton -> sifirlaSuButonu
    darkModeToggle.addEventListener('change', (event) => {
        applyDarkMode(event.target.checked);
    });

    // Başlangıçta ayarları yükle
    loadSettings();

    // Su logosuna tıklama animasyonu
    suLogo.addEventListener('click', () => {
        suLogo.classList.add('active'); // Animasyon sınıfını ekle
        setTimeout(() => {
            suLogo.classList.remove('active'); // Animasyon bitince sınıfı kaldır
        }, 100); // CSS transition süresiyle eşleşmeli (0.1s = 100ms)
    });
});
