// 1. Varsayılan Değerleri const ile tanımla
    const DEFAULT_MAX_WATER_AMOUNT = 2500; // Varsayılan günlük su hedefi (ml)
    const DEFAULT_ADD_AMOUNT = 250;       // Her tıklamada eklenecek varsayılan su miktarı (ml)

    // 2. Uygulama Durumunu Yansıtan Değişkenler (let ile)
    let currentWaterAmount = parseInt(localStorage.getItem("water")) || 0; // Mevcut içilen su miktarı

    // 3. Kullanıcının ayarladığı veya varsayılan hedef ve ekleme miktarları (let ile)
    let maxWaterGoal = parseInt(localStorage.getItem("maxWater")) || DEFAULT_MAX_WATER_AMOUNT;
    let addWaterAmount = parseInt(localStorage.getItem("addAmount")) || DEFAULT_ADD_AMOUNT;

    // 4. Diğer Uygulama Değişkenleri ve DOM Referansları
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
        console.log("Yeni güne geçildi, su miktarı sıfırlandı.");
      }
    }

    function updateDisplay() {
      const percent = (currentWaterAmount / maxWaterGoal) * 100;
      progressBar.style.width = percent + "%";
      statusDisplay.innerText = `${currentWaterAmount} ml / ${maxWaterGoal} ml`;
    }

    function addWater() {
      if (currentWaterAmount < maxWaterGoal) {
        currentWaterAmount += addWaterAmount;
        if (currentWaterAmount > maxWaterGoal) currentWaterAmount = maxWaterGoal; // Hedefi aşmaması için kontrol
        localStorage.setItem("water", currentWaterAmount);
        updateDisplay();
      }
    }

    function resetWater() {
      currentWaterAmount = 0;
      localStorage.setItem("water", currentWaterAmount);
      updateDisplay();
      // Ayarlar panelini kapat
      document.getElementById("settingsPanel").style.display = "none";
    }

    function openSettings() {
      const settingsPanel = document.getElementById("settingsPanel");
      if (settingsPanel.style.display === "block") {
        settingsPanel.style.display = "none";
      } else {
        settingsPanel.style.display = "block";
        // Ayarlar inputlarını mevcut değerlerle doldur
        document.getElementById("addAmount").value = addWaterAmount;
        document.getElementById("maxAmount").value = maxWaterGoal;
      }
    }

    function saveAndCloseSettings() {
      // Su Ekleme Miktarı için
      const newAddAmount = parseInt(document.getElementById("addAmount").value);
      if (!isNaN(newAddAmount) && newAddAmount > 0) {
        addWaterAmount = newAddAmount;
        localStorage.setItem("addAmount", addWaterAmount);
        console.log("Yeni ekleme miktarı kaydedildi:", addWaterAmount);
      } else {
        alert("Lütfen geçerli bir su ekleme miktarı girin (örneğin 100, 200).");
        return; // Hata durumunda fonksiyonu sonlandır
      }

      // Günlük Hedef Su Miktarı için
      const newMaxAmount = parseInt(document.getElementById("maxAmount").value);
      if (!isNaN(newMaxAmount) && newMaxAmount > 0) {
        maxWaterGoal = newMaxAmount;
        localStorage.setItem("maxWater", maxWaterGoal);
        console.log("Yeni günlük hedef miktarı kaydedildi:", newMaxAmount);
      } else {
        alert("Lütfen geçerli bir günlük hedef su miktarı girin (örneğin 2000, 3000).");
        return; // Hata durumunda fonksiyonu sonlandır
      }

      document.getElementById("settingsPanel").style.display = "none"; // Paneli gizle
      console.log("Ayarlar kaydedildi ve panel kapatıldı.");
      updateDisplay(); // Tüm değişikliklerden sonra ekranı güncelle
    }

    // Uygulama yüklendiğinde veya yenilendiğinde çalışacak ilk kodlar
    resetWaterIfNewDay();
    updateDisplay();
