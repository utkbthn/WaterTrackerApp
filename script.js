
        const DEFAULT_MAX_WATER_AMOUNT = 2500;
        const DEFAULT_ADD_AMOUNT = 250;

        let currentWaterAmount = parseInt(localStorage.getItem("water")) || 0;
        let maxWaterGoal = parseInt(localStorage.getItem("maxWater")) || DEFAULT_MAX_WATER_AMOUNT;
        let addWaterAmount = parseInt(localStorage.getItem("addAmount")) || DEFAULT_ADD_AMOUNT;

        const progressBar = document.getElementById("progressBar");
        const statusDisplay = document.getElementById("status");
        let lastResetDate = localStorage.getItem("lastResetDate");

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
                resetWater();
                lastResetDate = todayDate;
                localStorage.setItem("lastResetDate", lastResetDate);
            }
        }

        function updateDisplay() {
            let percent = (currentWaterAmount / maxWaterGoal) * 100;
            if (percent > 100) percent = 100;
            if (percent < 0) percent = 0;

            progressBar.style.width = percent + "%";
            statusDisplay.innerText = `${currentWaterAmount} ml / ${maxWaterGoal} ml`;

            const drinkButton = document.getElementById("drinkButton");
            if (drinkButton) {
                if (currentWaterAmount >= maxWaterGoal) {
                    drinkButton.innerText = "Afiyet Olsun! 🎉";
                    drinkButton.style.backgroundColor = "var(--success-green)";
                    drinkButton.style.cursor = "pointer";
                } else {
                    drinkButton.innerText = "Drink";
                    drinkButton.style.backgroundColor = "var(--primary-blue)";
                    drinkButton.style.cursor = "pointer";
                }
            }
        }

        function addWater() {
            if (currentWaterAmount < maxWaterGoal) {
                currentWaterAmount += addWaterAmount;
                if (currentWaterAmount > maxWaterGoal) currentWaterAmount = maxWaterGoal;
                localStorage.setItem("water", currentWaterAmount);
                updateDisplay();
            }
        }

        function resetWater() {
            currentWaterAmount = 0;
            localStorage.setItem("water", currentWaterAmount);
            const drinkButton = document.getElementById("drinkButton");
            if (drinkButton) {
                drinkButton.innerText = "Drink";
                drinkButton.style.backgroundColor = "var(--primary-blue)";
                drinkButton.style.cursor = "pointer";
            }
            updateDisplay();
            document.getElementById("settingsPanel").style.display = "none";
        }

        function openSettings() {
            const settingsPanel = document.getElementById("settingsPanel");
            document.getElementById("maxAmount").value = maxWaterGoal;
            document.getElementById("addAmount").value = addWaterAmount;

            if (settingsPanel.style.display === "none" || settingsPanel.style.display === "") {
                settingsPanel.style.display = "block";
            } else {
                settingsPanel.style.display = "none";
            }
        }

        function saveAndCloseSettings() {
            const newMax = parseInt(document.getElementById("maxAmount").value);
            const newAdd = parseInt(document.getElementById("addAmount").value);

            if (isNaN(newMax) || newMax < 500) {
                alert("Günlük hedef en az 500 ml olmalı ve sayısal bir değer girilmelidir!");
                document.getElementById("maxAmount").value = maxWaterGoal;
                return;
            }

            maxWaterGoal = newMax;
            localStorage.setItem("maxWater", maxWaterGoal);

            if (!isNaN(newAdd)) {
                addWaterAmount = newAdd;
                localStorage.setItem("addAmount", addWaterAmount);
            }

            updateDisplay();
            document.getElementById("settingsPanel").style.display = "none";
        }

        window.onload = function () {
            resetWaterIfNewDay();
            updateDisplay();
        };
    
