console.log("script.js yüklendi!"); // BU SATIRI EKLEYİN

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elementlerini Yakala
    const statusText = document.getElementById('statusText');
    const drinkButton = document.getElementById('drinkButton');
    const resetButton = document.getElementById('resetButton');
    const ayarlarPaneli = document.getElementById('ayarlarPaneli');
    const ayarlarButonu = document.getElementById('ayarlarButonu');
    const saveSettingsButton = document.getElementById('saveSettings');
    const maxAmountInput = document.getElementById('maxAmount');
    const addAmountSelect = document.getElementById('addAmount'); // Bu input'un tipi number oldu
    const darkModeToggle = document.getElementById('darkModeToggle');
    const animatedWaterFill = document.getElementById('animatedWaterFill');

    // ... (Kalan tüm JavaScript kodu, en son verdiğim gibi) ...

    // Event Dinleyicileri
    drinkButton.addEventListener('click', addWater);
    resetButton.addEventListener('click', resetWater);

    ayarlarButonu.addEventListener('click', (event) => { // Bu kısım çok önemli
        event.stopPropagation();
        ayarlarPaneli.style.display = ayarlarPaneli.style.display === 'block' ? 'none' : 'block';
        if (ayarlarPaneli.style.display === 'block') {
            maxAmountInput.value = maxWaterAmount;
            addAmountSelect.value = addWaterAmount;
            darkModeToggle.checked = isDarkMode;
        }
    });

    document.addEventListener('click', (event) => { // Bu da önemli
        if (ayarlarPaneli.style.display === 'block' && !ayarlarPaneli.contains(event.target) && !ayarlarButonu.contains(event.target)) {
            maxAmountInput.value = maxWaterAmount;
            addAmountSelect.value = addWaterAmount;
            darkModeToggle.checked = isDarkMode;
            ayarlarPaneli.style.display = 'none';
        }
    });

    saveSettingsButton.addEventListener('click', () => { /* ... */ });

    applyInitialSettings();
});
