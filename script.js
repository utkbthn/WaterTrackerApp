document.addEventListener('DOMContentLoaded', () => {
    const statusDisplay = document.getElementById('status');
    const progressBar = document.getElementById('progressBar');
    const maxAmountInput = document.getElementById('maxAmount');
    const addAmountInput = document.getElementById('addAmount');
    const darkModeToggle = document.getElementById('darkModeToggle');
    const settingsPanel = document.getElementById('settingsPanel');

    let currentWater = 0;
    let maxWater = 2500; // Varsayılan günlük hedef (ml)
    let addAmount = 250; // Varsayılan eklenecek miktar (ml)

    // localStorage'dan verileri yükle
    function loadData() {
        const savedWater = localStorage.getItem('currentWater');
        const savedMaxWater = localStorage.getItem('maxWater');
        const savedAddAmount = localStorage.getItem('addAmount');
        const savedDarkMode = localStorage.getItem('darkMode');
        const lastResetDate = localStorage.getItem('lastResetDate');

        if (savedWater !== null) {
            currentWater = parseInt(savedWater);
        }
        if (savedMaxWater !== null) {
            maxWater = parseInt(savedMaxWater);
        }
        if (savedAddAmount !== null) {
            addAmount = parseInt(savedAddAmount);
        }

        // Günlük sıfırlama kontrolü
        const today = new Date().toDateString();
        if (lastResetDate !== today) {
            currentWater = 0; // Yeni günse suyu sıfırla
            localStorage.setItem('currentWater', 0);
            localStorage.setItem('lastResetDate', today);
        }

        // Ayarlar panelindeki inputları güncelle
        maxAmountInput.value = maxWater;
        addAmountInput.value = addAmount;

        // Karanlık mod ayarını yükle
        if (savedDarkMode === 'enabled') {
            document.documentElement.classList.add('dark-mode');
            darkModeToggle.checked = true;
        } else {
            document.documentElement.classList.remove('dark-mode');
            darkModeToggle.checked = false;
        }
    }

    // Verileri localStorage'a kaydet
    function saveData() {
        localStorage.setItem('currentWater', currentWater);
        localStorage.setItem('maxWater', maxWater);
        localStorage.setItem('addAmount', addAmount);
    }

    // Ekranı güncelle
    function updateDisplay() {
        const percentage = (currentWater / maxWater) * 100;
        progressBar.style.height = `${Math.min(percentage, 100)}%`; // %100'ü geçmesin

        if (currentWater >= maxWater) {
            statusDisplay.textContent = `Goal Reached! ${currentWater}ml / ${maxWater}ml`;
            statusDisplay.style.color = 'var(--success-green)'; // Hedefe ulaşınca yeşil
        } else {
            statusDisplay.textContent = `${currentWater}ml / ${maxWater}ml`;
            statusDisplay.style.color = 'var(--text-color)'; // Normalde varsayılan renk
        }
    }

    // Su ekleme fonksiyonu
    window.addWater = () => {
        currentWater += addAmount;
        saveData();
        updateDisplay();
    };

    // Su miktarını sıfırlama fonksiyonu
    window.resetWater = () => {
        if (confirm('Are you sure you want to reset your water intake for today?')) {
            currentWater = 0;
            localStorage.setItem('lastResetDate', new Date().toDateString()); // Sıfırlama tarihini güncelle
            saveData();
            updateDisplay();
            closeSettings(); // Ayarları sıfırladıktan sonra kapat
        }
    };

    // Ayarlar panelini aç/kapat
    window.openSettings = () => {
        settingsPanel.style.display = settingsPanel.style.display === 'block' ? 'none' : 'block';
    };

    window.closeSettings = () => {
        settingsPanel.style.display = 'none';
    };

    // Ayarları kaydet ve paneli kapat
    window.saveAndCloseSettings = () => {
        const newMaxAmount = parseInt(maxAmountInput.value);
        const newAddAmount = parseInt(addAmountInput.value);

        if (isNaN(newMaxAmount) || newMaxAmount < 100) {
            alert('Daily Goal must be a number and at least 100ml.');
            maxAmountInput.value = maxWater; // Eski değeri geri yükle
            return;
        }
        if (isNaN(newAddAmount) || newAddAmount < 10) {
            alert('Add Amount must be a number and at least 10ml.');
            addAmountInput.value = addAmount; // Eski değeri geri yükle
            return;
        }

        maxWater = newMaxAmount;
        addAmount = newAddAmount;
        saveData();
        updateDisplay();
        closeSettings();
    };

    // Karanlık mod geçişini yönet
    darkModeToggle.addEventListener('change', () => {
        if (darkModeToggle.checked) {
            document.documentElement.classList.add('dark-mode');
            localStorage.setItem('darkMode', 'enabled');
        } else {
            document.documentElement.classList.remove('dark-mode');
            localStorage.setItem('darkMode', 'disabled');
        }
    });

    // Sayfa yüklendiğinde verileri yükle ve ekranı güncelle
    loadData();
    updateDisplay();
});
