document.addEventListener('DOMContentLoaded', () => {
    // DOM Elementleri
    const waterFillProgress = document.getElementById('waterFillProgress');
    const statusText = document.getElementById('status');
    const drinkButton = document.getElementById('drinkButton');
    const ayarlarButonu = document.getElementById('ayarlarButonu');             
    const ayarlarPaneli = document.getElementById('ayarlarPaneli');             
    const addAmountSelect = document.getElementById('addAmount');
    const maxAmountInput = document.getElementById('maxAmount');
    const darkModeToggle = document.getElementById('darkModeToggle');
    const kaydetAyarlarButonu = document.getElementById('kaydetAyarlarButonu'); 
    const sifirlaSuButonu = document.getElementById('sifirlaSuButonu');         
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
        const savedAddAmount = localStorage.getItem('addAmount'); // 'addAmount' olarak kaydetmiştik
        const savedDarkMode = localStorage.getItem('darkMode');

        if (savedWaterAmount !== null) {
            currentWaterAmount = parseInt(savedWaterAmount);
        }
        if (savedMaxAmount !== null) {
            maxWaterAmount = parseInt(savedMaxAmount);
        }
        if (savedAddAmount !== null) { // Eğer 'addAmount' kaydedilmişse kullan
            addWaterAmount = parseInt(savedAddAmount);
        }
        if (savedDarkMode !== null) {
            darkModeToggle.checked = (savedDarkMode === 'true');
        }

        addAmountSelect.value = addWaterAmount;
        maxAmountInput.value = maxWaterAmount;
        applyDarkMode(darkModeToggle.checked);
        updateWaterDisplay(); // Ekranı güncellemek için çağır
    }

    // Su seviyesini güncelle ve görüntüle
    function updateWaterDisplay() {
        const percentage = (currentWaterAmount / maxWaterAmount) * 100;
        waterFillProgress.style.height = `${percentage}%`;

        if (percentage >= 100) {
            statusText.textContent = `Tebrikler! Günlük hedefinize ulaştınız: ${currentWaterAmount} ml`; // Bu yazı değişmeden kalıyor
            statusText.style.color = 'var(--success-green)';
            waterFillProgress.style.backgroundColor = 'var(--success-green)';

            // Drink butonunu "Afiyet Olsun 🎉" yap ve yeşil arka plan ver
            drinkButton.textContent = 'Afiyet Olsun 🎉';
            drinkButton.disabled = true; // Butonu pasif yap
            drinkButton.classList.remove('app-button'); // Mevcut app-button stilini kaldır (geçici olarak)
            drinkButton.classList.add('success-button'); // Yeni başarı sınıfını ekle

        } else {
            statusText.textContent = `${currentWaterAmount} ml / ${maxWaterAmount} ml`;
            statusText.style.color = 'var(--text-color)';
            waterFillProgress.style.backgroundColor = 'var(--water-fill-color)';

            // Drink butonunu normal haline getir
            drinkButton.textContent = 'Drink'; // Burası başlangıçtaki hali
            drinkButton.disabled = false; // Butonu aktif yap
            drinkButton.classList.add('app-button'); // app-button stilini geri ekle
            drinkButton.classList.remove('success-button'); // Başarı sınıfını kaldır
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
        updateWaterDisplay(); // Temanın değişmesiyle metin ve buton renklerini yeniden ayarla
    }

    // Ayarları kaydet
    function saveSettings() {
        maxWaterAmount = parseInt(maxAmountInput.value);
        addWaterAmount = parseInt(addAmountSelect.value); // addAmount'ı select'ten al

        if (isNaN(maxWaterAmount) || maxWaterAmount < 500) {
            alert("Günlük hedef en az 500 ml olmalıdır!");
            maxWaterAmount = defaultMaxAmount; // Geçersizse varsayılana dön
            maxAmountInput.value = defaultMaxAmount;
        }

        localStorage.setItem('maxWaterAmount', maxWaterAmount);
        localStorage.setItem('addAmount', addWaterAmount); // 'addAmount' olarak kaydet
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
    ayarlarButonu.addEventListener('click', () => {
        ayarlarPaneli.style.display = ayarlarPaneli.style.display === 'block' ? 'none' : 'block';
    });
    kaydetAyarlarButonu.addEventListener('click', saveSettings);
    sifirlaSuButonu.addEventListener('click', resetWater);
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
