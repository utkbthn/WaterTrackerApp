document.addEventListener('DOMContentLoaded', () => {
    // === DOM Elementlerini Yakala ===
    // HTML dosyasındaki ID'leri kullanarak elementleri alıyoruz.
    const statusText = document.getElementById('statusText');
    const drinkButton = document.getElementById('drinkButton');
    const resetButton = document.getElementById('resetButton');
    const ayarlarPaneli = document.getElementById('ayarlarPaneli');
    const ayarlarButonu = document.getElementById('ayarlarButonu');
    const saveSettingsButton = document.getElementById('saveSettings');
    const maxAmountInput = document.getElementById('maxAmount');
    const addAmountSelect = document.getElementById('addAmount'); // Bu input'un tipi number
    const darkModeToggle = document.getElementById('darkModeToggle');
    const animatedWaterFill = document.getElementById('animatedWaterFill'); // SVG içindeki su dolgu rect'i

    // Hata ayıklama için (Console'da elementlerin yüklenip yüklenmediğini kontrol edin)
    // Eğer bu satırları tarayıcı konsolunda görmüyorsanız, script dosyası yüklenmiyor demektir.
    console.log("script.js yüklendi ve DOM hazır.");
    console.log("Yakalanan Elementler:");
    console.log("statusText:", statusText);
    console.log("drinkButton:", drinkButton);
    console.log("resetButton:", resetButton);
    console.log("ayarlarPaneli:", ayarlarPaneli);
    console.log("ayarlarButonu:", ayarlarButonu);
    console.log("saveSettingsButton:", saveSettingsButton);
    console.log("maxAmountInput:", maxAmountInput);
    console.log("addAmountSelect:", addAmountSelect);
    console.log("darkModeToggle:", darkModeToggle);
    console.log("animatedWaterFill:", animatedWaterFill);


    // === Değişkenleri Tanımla (localStorage'dan veya varsayılan değerlerle) ===
    // Uygulama kapatılıp açıldığında son durumu hatırlamak için localStorage kullanıyoruz.
    let currentWaterAmount = parseInt(localStorage.getItem('currentWaterAmount')) || 0;
    let maxWaterAmount = parseInt(localStorage.getItem('maxWaterAmount')) || 2500;
    let addWaterAmount = parseInt(localStorage.getItem('addWaterAmount')) || 250;
    let isDarkMode = (localStorage.getItem('darkMode') === 'true'); // 'true' stringi olarak saklandığı için kontrol

    // === Uygulamanın Başlangıç Ayarlarını Uygula ===
    // Sayfa yüklendiğinde veya ayarlar kaydedildiğinde çalışır.
    function applyInitialSettings() {
        // Ayarlar paneli inputlarını localStorage değerleriyle güncelleyin
        maxAmountInput.value = maxWaterAmount;
        addAmountSelect.value = addWaterAmount;
        darkModeToggle.checked = isDarkMode; // Karanlık mod anahtarını ayarla

        // Karanlık modu HTML'in root elementine uygulayın
        if (isDarkMode) {
            document.documentElement.classList.add('dark-mode');
        } else {
            document.documentElement.classList.remove('dark-mode');
        }
        // Su seviyesini ve görünümünü güncelleyin
        updateWaterDisplay();
    }

    // === Su Miktarını Ekleme Fonksiyonu ===
    function addWater() {
        // Hedefe ulaşıldıysa daha fazla su eklemeyi durdur
        if (currentWaterAmount >= maxWaterAmount) {
            return;
        }

        currentWaterAmount += addWaterAmount;

        // Miktarın maksimum hedefi aşmamasını sağla
        if (currentWaterAmount > maxWaterAmount) {
            currentWaterAmount = maxWaterAmount;
        }

        updateWaterDisplay(); // Su görünümünü güncelle
        saveWaterAmount();    // Değişiklikleri localStorage'a kaydet
    }

    // === Su Miktarını Sıfırlama Fonksiyonu ===
    function resetWater() {
        // Kullanıcıdan onay iste
        if (confirm("Tüm su miktarını sıfırlamak istediğinizden emin misiniz?")) {
            currentWaterAmount = 0; // Su miktarını sıfırla
            updateWaterDisplay();   // Görünümü güncelle
            saveWaterAmount();      // Değişiklikleri localStorage'a kaydet
        }
    }

    // === Su Miktarını Görüntüleme ve SVG Animasyon Fonksiyonu ===
    function updateWaterDisplay() {
        // Yüzdeyi hesapla
        const percentage = (currentWaterAmount / maxWaterAmount) * 100;
        
        // SVG'nin viewBox'ı 0 0 24 24 olduğu için, dolgu yüksekliğini bu aralıkta hesaplayacağız.
        const rectMaxHeight = 24; 
        
        // newFillHeight: Yüzdeye göre rect'in alacağı yükseklik
        const newFillHeight = (percentage / 100) * rectMaxHeight;
        
        // newFillY: rect'in Y koordinatı. Aşağıdan yukarıya dolması için, 
        // toplam yükseklikten dolgu yüksekliğini çıkararak Y konumunu buluruz.
        const newFillY = rectMaxHeight - newFillHeight; 

        // animatedWaterFill elementinin 'y' ve 'height' özniteliklerini güncelle
        // Bu, SVG içindeki suyun dolma animasyonunu sağlar.
        if (animatedWaterFill) { // Elementin var olduğundan emin ol
            animatedWaterFill.setAttribute('y', newFillY);
            animatedWaterFill.setAttribute('height', newFillHeight);
        }

        // Durum metnini güncelle (örneğin "1250 ml / 2500 ml")
        if (percentage >= 100) {
            statusText.textContent = `Tebrikler! Günlük hedefinize ulaştınız: ${currentWaterAmount} ml`;
            statusText.style.color = 'var(--success-green)'; // Başarı rengini uygula
            if (animatedWaterFill) {
                animatedWaterFill.setAttribute('fill', 'var(--success-green)'); // SVG suyunu yeşil yap
            }
            drinkButton.textContent = 'Afiyet Olsun 🎉';
            drinkButton.disabled = true; // Hedefe ulaşınca butonu devre dışı bırak
            drinkButton.classList.add('success-button'); // Yeşil stilini uygula

        } else {
            statusText.textContent = `${currentWaterAmount} ml / ${maxWaterAmount} ml`;
            statusText.style.color = 'var(--text-color)'; // Normal metin rengi
            if (animatedWaterFill) {
                animatedWaterFill.setAttribute('fill', 'var(--water-fill-color)'); // SVG suyunu normal mavi yap
            }
            drinkButton.textContent = 'Drink';
            drinkButton.disabled = false; // Butonu tekrar etkinleştir
            drinkButton.classList.remove('success-button'); // Yeşil stili kaldır
        }
    }

    // === Local Storage'a Verileri Kaydetme Fonksiyonu ===
    function saveWaterAmount() {
        localStorage.setItem('currentWaterAmount', currentWaterAmount);
        localStorage.setItem('maxWaterAmount', maxWaterAmount);
        localStorage.setItem('addWaterAmount', addWaterAmount);
        localStorage.setItem('darkMode', isDarkMode);
    }

    // === Ayarlar Paneli Açma/Kapama İşlemi ===
    if (ayarlarButonu) { // ayarlarButonu'nun var olduğundan emin ol
        ayarlarButonu.addEventListener('click', (event) => {
            event.stopPropagation(); // Bu, tıklamanın paneli kapatma olayını tetiklemesini engeller.
            
            if (ayarlarPaneli) { // ayarlarPaneli'nin var olduğundan emin ol
                // Panelin görünürlüğünü aç/kapat (display: block/none)
                ayarlarPaneli.style.display = ayarlarPaneli.style.display === 'block' ? 'none' : 'block';
                
                // Eğer panel açılıyorsa, mevcut değerleri inputlara yükle
                if (ayarlarPaneli.style.display === 'block') {
                    maxAmountInput.value = maxWaterAmount;
                    addAmountSelect.value = addWaterAmount;
                    darkModeToggle.checked = isDarkMode;
                }
            }
        });
    }


    // === Ayarlar Paneli Dışına Tıklayınca Kapatma ===
    // Sadece ayarlar paneli varsa bu dinleyiciyi ekle
    if (ayarlarPaneli && ayarlarButonu) {
        document.addEventListener('click', (event) => {
            // Eğer ayarlar paneli açıksa VE tıklanan yer panelin içinde değilse VE ayarlar butonunun içinde değilse
            if (ayarlarPaneli.style.display === 'block' && 
                !ayarlarPaneli.contains(event.target) && 
                !ayarlarButonu.contains(event.target) &&
                event.target !== saveSettingsButton && // Kaydet butonuna basıldığında kapanmasını engelle
                event.target !== resetButton // Sıfırla butonuna basıldığında kapanmasını engelle
            ) {
                // Ayarları kaydetmeden paneli kapatmadan önce inputları eski değerlerine döndür
                maxAmountInput.value = maxWaterAmount;
                addAmountSelect.value = addWaterAmount;
                darkModeToggle.checked = isDarkMode;
                ayarlarPaneli.style.display = 'none'; // Paneli kapat
            }
        });
    }

    // === Ayarları Kaydetme Fonksiyonu ===
    if (saveSettingsButton) { // saveSettingsButton'un var olduğundan emin ol
        saveSettingsButton.addEventListener('click', () => {
            const newMaxAmount = parseInt(maxAmountInput.value);
            const newAddAmount = parseInt(addAmountSelect.value);
            const newIsDarkMode = darkModeToggle.checked;

            // Geçerli sayı kontrolleri
            if (isNaN(newMaxAmount) || newMaxAmount <= 0) {
                alert('Lütfen geçerli bir günlük hedef miktarı girin (pozitif bir sayı).');
                return;
            }
            if (isNaN(newAddAmount) || newAddAmount <= 0) {
                alert('Lütfen geçerli bir içilen su miktarı girin (pozitif bir sayı).');
                return;
            }

            // Eğer yeni hedef mevcut içilen miktardan düşükse kullanıcıya sor
            if (newMaxAmount < currentWaterAmount && currentWaterAmount !== 0) {
                if (!confirm(`Yeni günlük hedef (${newMaxAmount} ml) mevcut içilen su miktarınızdan (${currentWaterAmount} ml) daha düşük. Mevcut su miktarınız sıfırlanacak. Devam etmek istiyor musunuz?`)) {
                    return; // Kullanıcı iptal ettiyse kaydetme işlemini durdur
                }
                currentWaterAmount = 0; // Onaylarsa mevcut su miktarını sıfırla
            }

            // Yeni ayarları uygula
            maxWaterAmount = newMaxAmount;
            addWaterAmount = newAddAmount;
            isDarkMode = newIsDarkMode;

            saveWaterAmount();        // Yeni ayarları localStorage'a kaydet
            applyInitialSettings();   // UI'yı ve karanlık modu yeni ayarlara göre güncelle
            
            if (ayarlarPaneli) { // ayarlarPaneli'nin var olduğundan emin ol
                ayarlarPaneli.style.display = 'none'; // Ayarlar panelini kapat
            }
        });
    }


    // === Event Dinleyicileri (Butonlara Tıklama) ===
    if (drinkButton) { // drinkButton'un var olduğundan emin ol
        drinkButton.addEventListener('click', addWater); // "Drink" butonuna tıklama olayını dinle
    }
    if (resetButton) { // resetButton'un var olduğundan emin ol
        resetButton.addEventListener('click', resetWater); // "Sıfırla" butonuna tıklama olayını dinle
    }

    // === Uygulama Yüklendiğinde İlk Kez Başlangıç Ayarlarını Uygula ===
    // Bu, sayfa ilk açıldığında localStorage'dan alınan değerleri ekrana yansıtır.
    applyInitialSettings();
});
