document.addEventListener('DOMContentLoaded', () => {
    const statusText = document.getElementById('statusText');
    const drinkButton = document.getElementById('drinkButton');
    const resetButton = document.getElementById('resetButton');
    const ayarlarPaneli = document.getElementById('ayarlarPaneli');
    const ayarlarButonu = document.getElementById('ayarlarButonu');
    const saveSettingsButton = document.getElementById('saveSettings');
    const maxAmountInput = document.getElementById('maxAmount');
    const addAmountSelect = document.getElementById('addAmount');
    const darkModeToggle = document.getElementById('darkModeToggle');
    const animatedWaterFill = document.getElementById('animatedWaterFill');

    let currentWaterAmount = parseInt(localStorage.getItem('currentWaterAmount')) || 0;
    let maxWaterAmount = parseInt(localStorage.getItem('maxWaterAmount')) || 2500;
    let addWaterAmount = parseInt(localStorage.getItem('addWaterAmount')) || 250;
    let isDarkMode = (localStorage.getItem('darkMode') === 'true');

    function applyInitialSettings() {
        maxAmountInput.value = maxWaterAmount;
        addAmountSelect.value = addWaterAmount;
        darkModeToggle.checked = isDarkMode;

        if (isDarkMode) {
            document.documentElement.classList.add('dark-mode');
        } else {
            document.documentElement.classList.remove('dark-mode');
        }
        updateWaterDisplay();
    }

    function addWater() {
        if (currentWaterAmount >= maxWaterAmount) {
            return;
        }

        currentWaterAmount += addWaterAmount;
        if (currentWaterAmount > maxWaterAmount) {
            currentWaterAmount = maxWaterAmount;
        }

        updateWaterDisplay();
        saveWaterAmount();
    }

    function resetWater() {
        currentWaterAmount = 0;
        updateWaterDisplay();
        saveWaterAmount();
    }

    function updateWaterDisplay() {
        const percentage = (currentWaterAmount / maxWaterAmount) * 100;
        
        const rectMaxHeight = 24; 
        const newFillHeight = (percentage / 100) * rectMaxHeight;
        const newFillY = rectMaxHeight - newFillHeight; 

        if (animatedWaterFill) {
            animatedWaterFill.setAttribute('y', newFillY);
            animatedWaterFill.setAttribute('height', newFillHeight);
        }

        if (percentage >= 100) {
            statusText.textContent = `Tebrikler! Günlük hedefinize ulaştınız: ${currentWaterAmount} ml`;
            statusText.style.color = 'var(--success-green)';
            if (animatedWaterFill) {
                animatedWaterFill.setAttribute('fill', 'var(--success-green)');
            }
            drinkButton.textContent = 'Afiyet Olsun 🎉';
            drinkButton.disabled = true;
            drinkButton.classList.add('success-button');
        } else {
            statusText.textContent = `${currentWaterAmount} ml / ${maxWaterAmount} ml`;
            statusText.style.color = 'var(--text-color)';
            if (animatedWaterFill) {
                animatedWaterFill.setAttribute('fill', 'var(--water-fill-color)');
            }
            drinkButton.textContent = 'Drink';
            drinkButton.disabled = false;
            drinkButton.classList.remove('success-button');
        }
    }

    function saveWaterAmount() {
        localStorage.setItem('currentWaterAmount', currentWaterAmount);
        localStorage.setItem('maxWaterAmount', maxWaterAmount);
        localStorage.setItem('addWaterAmount', addWaterAmount);
        localStorage.setItem('darkMode', isDarkMode);
    }

    if (ayarlarButonu) {
        ayarlarButonu.addEventListener('click', (event) => {
            event.stopPropagation();
            
            if (ayarlarPaneli) {
                ayarlarPaneli.style.display = ayarlarPaneli.style.display === 'block' ? 'none' : 'block';
                
                if (ayarlarPaneli.style.display === 'block') {
                    maxAmountInput.value = maxWaterAmount;
                    addAmountSelect.value = addWaterAmount;
                    darkModeToggle.checked = isDarkMode;
                }
            }
        });
    }

    if (ayarlarPaneli && ayarlarButonu) {
        document.addEventListener('click', (event) => {
            if (ayarlarPaneli.style.display === 'block' && 
                !ayarlarPaneli.contains(event.target) && 
                !ayarlarButonu.contains(event.target) &&
                event.target !== saveSettingsButton && 
                event.target !== resetButton 
            ) {
                maxAmountInput.value = maxWaterAmount;
                addAmountSelect.value = addWaterAmount;
                darkModeToggle.checked = isDarkMode;
                ayarlarPaneli.style.display = 'none';
            }
        });
    }

    if (saveSettingsButton) {
        saveSettingsButton.addEventListener('click', () => {
            const newMaxAmount = parseInt(maxAmountInput.value);
            const newAddAmount = parseInt(addAmountSelect.value);
            const newIsDarkMode = darkModeToggle.checked;

            if (isNaN(newMaxAmount) || newMaxAmount <= 0) {
                alert('Lütfen geçerli bir günlük hedef miktarı girin (pozitif bir sayı).');
                return;
            }
            if (isNaN(newAddAmount) || newAddAmount <= 0) {
                alert('Lütfen geçerli bir içilen su miktarı girin (pozitif bir sayı).');
                return;
            }

            if (newMaxAmount < currentWaterAmount && currentWaterAmount !== 0) {
                if (!confirm(`Yeni günlük hedef (${newMaxAmount} ml) mevcut içilen su miktarınızdan (${currentWaterAmount} ml) daha düşük. Mevcut su miktarınız sıfırlanacak. Devam etmek istiyor musunuz?`)) {
                    return;
                }
                currentWaterAmount = 0;
            }

            maxWaterAmount = newMaxAmount;
            addWaterAmount = newAddAmount;
            isDarkMode = newIsDarkMode;

            saveWaterAmount();
            applyInitialSettings();
            
            if (ayarlarPaneli) {
                ayarlarPaneli.style.display = 'none';
            }
        });
    }

    if (drinkButton) {
        drinkButton.addEventListener('click', addWater);
    }
    if (resetButton) {
        resetButton.addEventListener('click', resetWater);
    }

    applyInitialSettings();
});
