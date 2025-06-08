document.addEventListener('DOMContentLoaded', () => {
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

    const defaultAddAmount = 250;
    const defaultMaxAmount = 2500;
    const defaultDarkMode = false;
    let currentWaterAmount = 0;
    let maxWaterAmount = defaultMaxAmount;
    let addWaterAmount = defaultAddAmount;

    function loadSettings() {
        const savedWaterAmount = localStorage.getItem('currentWaterAmount');
        const savedMaxAmount = localStorage.getItem('maxWaterAmount');
        const savedAddAmount = localStorage.getItem('addAmount');
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

    function updateWaterDisplay() {
        const percentage = (currentWaterAmount / maxWaterAmount) * 100;
        waterFillProgress.style.height = `${percentage}%`;

        if (percentage >= 100) {
            statusText.textContent = `Tebrikler! Günlük hedefinize ulaştınız: ${currentWaterAmount} ml`;
            statusText.style.color = 'var(--success-green)';
            waterFillProgress.style.backgroundColor = 'var(--success-green)';

            drinkButton.textContent = 'Afiyet Olsun 🎉';
            drinkButton.disabled = true;
            drinkButton.classList.add('success-button');

        } else {
            statusText.textContent = `${currentWaterAmount} ml / ${maxWaterAmount} ml`;
            statusText.style.color = 'var(--text-color)';
            waterFillProgress.style.backgroundColor = 'var(--water-fill-color)';

            drinkButton.textContent = 'Drink';
            drinkButton.disabled = false;
            drinkButton.classList.remove('success-button');
        }
    }

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

    function applyDarkMode(isDark) {
        if (isDark) {
            document.documentElement.classList.add('dark-mode');
            localStorage.setItem('darkMode', 'true');
        } else {
            document.documentElement.classList.remove('dark-mode');
            localStorage.setItem('darkMode', 'false');
        }
        updateWaterDisplay();
    }

    function saveSettings() {
        maxWaterAmount = parseInt(maxAmountInput.value);
        addWaterAmount = parseInt(addAmountSelect.value);

        if (isNaN(maxWaterAmount) || maxWaterAmount < 500) {
            alert("Günlük hedef en az 500 ml olmalıdır!");
            maxWaterAmount = defaultMaxAmount;
            maxAmountInput.value = defaultMaxAmount;
        }

        localStorage.setItem('maxWaterAmount', maxWaterAmount);
        localStorage.setItem('addAmount', addWaterAmount);
        localStorage.setItem('darkMode', darkModeToggle.checked);

        applyDarkMode(darkModeToggle.checked);
        updateWaterDisplay();
        ayarlarPaneli.style.display = 'none';
    }

    function resetWater() {
        currentWaterAmount = 0;
        localStorage.setItem('currentWaterAmount', currentWaterAmount);
        updateWaterDisplay();
    }

    drinkButton.addEventListener('click', addWater);
    ayarlarButonu.addEventListener('click', () => {
        ayarlarPaneli.style.display = ayarlarPaneli.style.display === 'block' ? 'none' : 'block';
    });
    kaydetAyarlarButonu.addEventListener('click', saveSettings);
    sifirlaSuButonu.addEventListener('click', resetWater);
    darkModeToggle.addEventListener('change', (event) => {
        applyDarkMode(event.target.checked);
    });

    loadSettings();

    suLogo.addEventListener('click', () => {
        suLogo.classList.add('active');
        setTimeout(() => {
            suLogo.classList.remove('active');
        }, 100);
    });
});
