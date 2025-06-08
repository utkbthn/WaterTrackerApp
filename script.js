document.addEventListener('DOMContentLoaded', () => {
    // DOM Elementlerini Yakala
    const statusText = document.getElementById('statusText');
    const drinkButton = document.getElementById('drinkButton');
    const resetButton = document.getElementById('resetButton');
    const ayarlarPaneli = document.getElementById('ayarlarPaneli');
    const ayarlarButonu = document.getElementById('ayarlarButonu'); // Ayarlar butonunu yakala
    const saveSettingsButton = document.getElementById('saveSettings');
    const maxAmountInput = document.getElementById('maxAmount');
    const addAmountSelect = document.getElementById('addAmount');
    const darkModeToggle = document.getElementById('darkModeToggle');
    // Yeni SVG animasyon elementini yakala
    const animatedWaterFill = document.getElementById('animatedWaterFill'); 

    // Değişkenleri tanımla (localStorage'dan veya varsayılan değerlerle)
    let currentWaterAmount = parseInt(localStorage.getItem('currentWaterAmount')) || 0;
    let maxWaterAmount = parseInt(localStorage.getItem('maxWaterAmount')) || 2500;
    let addWaterAmount = parseInt(localStorage.getItem('addWaterAmount')) || 250;
    let isDarkMode = (localStorage.getItem('darkMode') === 'true'); // String olarak saklandığı için 'true' stringine eşit mi diye kontrol et

    // Uygulamanın Başlangıç Ayarları
    maxAmountInput.value = maxWaterAmount;
    addAmountSelect.value = addWaterAmount;
    darkModeToggle.checked = isDarkMode; // Toggle'ı localStorage'daki değere göre ayarla

    // Karanlık Modu Uygula
    if (isDarkMode) {
        document.documentElement.classList.add('dark-mode');
    } else {
        document.documentElement.classList.remove('dark-mode');
    }

    // Su Miktarını Ekleme Fonksiyonu
    function addWater() {
        // Eğer hedef aşıldıysa, daha fazla ekleme
        if (currentWaterAmount >= maxWaterAmount) {
            return;
        }

        currentWaterAmount += addWaterAmount;

        // Hedefi aşmamak için kontrol
        if (currentWaterAmount > maxWaterAmount) {
            currentWaterAmount = maxWaterAmount;
        }

        updateWaterDisplay();
        saveWaterAmount();
    }

    // Su Miktarını Sıfırlama Fonksiyonu
    function resetWater() {
        if (confirm("Tüm su miktarını sıfırlamak istediğinizden emin misiniz?")) {
            currentWaterAmount = 0;
            updateWaterDisplay();
            saveWaterAmount();
        }
    }

    // Su Miktarını Görüntüleme ve Animasyon Fonksiyonu
    function updateWaterDisplay() {
        const percentage = (currentWaterAmount / maxWaterAmount) * 100;
        
        // Önemli Değişiklik: animatedWaterFill'in yüksekliğini ve rengini güncelliyoruz
        // SVG'de 'height' attribute'unu ayarlayarak animasyon sağlıyoruz.
        // viewBox 0 0 24 24 olduğu için, %'yi 24'e oranla hesaplamamız gerekebilir
        // Ancak 'height' özniteliği yüzde değerini de alabilir, deneyelim.
        // animatedWaterFill.setAttribute('height', `${percentage}%`); // Bu direct yüzde olarak çalışmazsa
        // SVG'nin 'height' değeri bottom'dan yukarı doğru artmalı.
        // rect'in y değeri de değişmeli ki aşağıdan yukarıya dolsun.
        // Dolgunun yüksekliğini 0'dan 24'e kadar ayarlayacağız
        // ve y konumunu (24 - dolguYüksekliği) olarak ayarlayacağız.
        
        const fillHeight = (percentage / 100) * 24; // 24 birimlik viewBox içinde ne kadar dolacak
        const fillY = 24 - fillHeight; // Dolgunun y başlangıç noktası (aşağıdan yukarıya doğru)

        animatedWaterFill.setAttribute('y', `${fillY}`);
        animatedWaterFill.setAttribute('height', `${fillHeight}`);

        if (percentage >= 100) {
            statusText.textContent = `Tebrikler! Günlük hedefinize ulaştınız: ${currentWaterAmount} ml`;
            statusText.style.color = 'var(--success-green)';
            
            // Başarı durumunda SVG dolgusunun rengini değiştir
            animatedWaterFill.setAttribute('fill', 'var(--success-green)');
            
            drinkButton.textContent = 'Afiyet Olsun 🎉';
            drinkButton.disabled = true;
            drinkButton.classList.add('success-button');

        } else {
            statusText.textContent = `${currentWaterAmount} ml / ${maxWaterAmount} ml`;
            statusText.style.color = 'var(--text-color)';
            
            // Normal durumda SVG dolgusunun rengini değiştir
            animatedWaterFill.setAttribute('fill', 'var(--water-fill-color)');
            
            drinkButton.textContent = 'Drink';
            drinkButton.disabled = false;
            drinkButton.classList.remove('success-button');
        }
    }

    // Local Storage'a kaydetme fonksiyonu
    function saveWaterAmount() {
        localStorage.setItem('currentWaterAmount', currentWaterAmount);
        localStorage.setItem('maxWaterAmount', maxWaterAmount);
        localStorage.setItem('addWaterAmount', addWaterAmount);
        localStorage.setItem('darkMode', isDarkMode);
    }

    // Ayarlar Paneli Açma/Kapama
    ayarlarButonu.addEventListener('click', () => {
        ayarlarPaneli.style.display = ayarlarPaneli.style.display === 'block' ? 'none' : 'block';
        // Ayarlar panelini açarken mevcut değerleri inputlara yükle
        if (ayarlarPaneli.style.display === 'block') {
            maxAmountInput.value = maxWaterAmount;
            addAmountSelect.value = addWaterAmount;
            darkModeToggle.checked = isDarkMode;
        }
    });

    // Ayarlar Paneli Dışına Tıklayınca Kapatma ve İptal Etme
    document.addEventListener('click', (event) => {
        // Eğer tıklanan yer panelin veya ayarlar butonunun içinde değilse ve panel açıksa
        if (!ayarlarPaneli.contains(event.target) && !ayarlarButonu.contains(event.target) && ayarlarPaneli.style.display === 'block') {
            // Değişiklikleri iptal et, inputları son kaydedilen değerlere geri döndür
            maxAmountInput.value = maxWaterAmount; 
            addAmountSelect.value = addWaterAmount; 
            darkModeToggle.checked = isDarkMode; 
            
            ayarlarPaneli.style.display = 'none'; // Paneli kapat
        }
    });

    // Ayarları Kaydetme Fonksiyonu
    saveSettingsButton.addEventListener('click', () => {
        const newMaxAmount = parseInt(maxAmountInput.value);
        const newAddAmount = parseInt(addAmountSelect.value);
        const newIsDarkMode = darkModeToggle.checked;

        // Geçerli sayı kontrolü
        if (isNaN(newMaxAmount) || newMaxAmount <= 0) {
            alert('Lütfen geçerli bir günlük hedef miktarı girin (pozitif bir sayı).');
            return;
        }

        // Eğer yeni hedef mevcut miktardan küçükse ve mevcut miktar sıfırdan farklıysa uyar
        if (newMaxAmount < currentWaterAmount && currentWaterAmount !== 0) {
            if (!confirm(`Yeni günlük hedef (${newMaxAmount} ml) mevcut içilen su miktarınızdan (${currentWaterAmount} ml) daha düşük. Mevcut su miktarınız sıfırlanacak. Devam etmek istiyor musunuz?`)) {
                return; // Kullanıcı iptal etti
            }
            currentWaterAmount = 0; // Mevcut su miktarını sıfırla
        }

        maxWaterAmount = newMaxAmount;
        addWaterAmount = newAddAmount;
        isDarkMode = newIsDarkMode;

        saveWaterAmount(); // Yeni ayarları kaydet
        updateWaterDisplay(); // Ekranı güncelle
        
        // Karanlık modu anında uygula
        if (isDarkMode) {
            document.documentElement.classList.add('dark-mode');
        } else {
            document.documentElement.classList.remove('dark-mode');
        }

        ayarlarPaneli.style.display = 'none'; // Ayarlar panelini kapat
    });

    // Event Dinleyicileri
    drinkButton.addEventListener('click', addWater);
    resetButton.addEventListener('click', resetWater);

    // Uygulama yüklendiğinde ilk kez görüntüle
    updateWaterDisplay();
});
