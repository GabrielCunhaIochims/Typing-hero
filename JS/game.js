const MUSIC_LIBRARY = {
    "hellfire": {
      title: "Hellfire Overdrive (Cyberpunk/Metal)",
      url: "https://cdn.discordapp.com/attachments/1534234222217134191/1534236824875040768/Hellfire_Overdrive.mp3?ex=6a872b63&is=6a85d9e3&hm=e27c4d7b54d0b8f152d74213a5f1f044127225c95a842055c2e04e6408f1adb4&",
      multiplier: 1.5,
      phrases: [
        "Metal queimando no asfalto, neon sangrando no horizonte.",
        "Acelere até o motor virar fumaça e a alma virar código.",
        "Sem freios, sem limites, sem salvação: bem-vindo ao Hellfire Overdrive.",
        "Onde o cromo derrete e a velocidade domina o caos.",
        "Sinta o peso do aço, o calor do fogo e a força da distorção.",
        ""
      ]
    },
    "nature": {
      title: "Nature Balance (Zen/Relaxante)",
      url: "https://cdn.discordapp.com/attachments/1534234222217134191/1534236824875040768/Hellfire_Overdrive.mp3",
      multiplier: 1.0,
      phrases: [
        "Encontre a paz na cadência fluida do teclado.",
        "Respire fundo e mantenha o ritmo constante."
      ]
    },
    "code_master": {
      title: "Bitrush_Overdrive (Synthwave / Tech)",
      url: "https://cdn.discordapp.com/attachments/1534234222217134191/1534261673173713046/Bitrush_Overdrive.mp3?ex=6a87eb48&is=6a8699c8&hm=ba4d38bbd5a69061265bc5cada65460e353c6016da1b2a97cd4e4c354b67291f&",
      multiplier: 1.25,
      phrases: [
        "let pontos = 0;",
        "const nome = 'Jogador 1';",
        "console.log('Iniciando o jogo...');",
        "let vidas = 3;"
        "vidas -= 1;",
        "const ativo = true;",
        "if (combo >= 10) { multiplicador = 2; }",
        "function somarPontos(atual, bonus) { return atual + bonus; }",
        "for (let i = 0; i < 5; i++) { criarInimigo(); }",
        "const lista = ['fácil', 'médio', 'difícil'];",
        "const doubleScore = (score) => score * 2;",
        "const player = { name: 'Hero', hp: 100, isAlive: true };",
        "const speed = wpm > 80 ? 'Ultra Fast' : 'Normal';",
        "const arr = [1, 2, 3].map((num) => num * 10);",
        "setTimeout(() => { alert('Tempo esgotado!'); }, 3000);",
        "const { combo, multiplier } = gameState;"  
      ]
    }
  };
  
  const songSelect = document.getElementById("songSelect");
  const screenFlash = document.getElementById("screenFlash");
  
  const game = document.getElementById("game");
  const scoreValue = document.getElementById("scoreValue");
  const hypeValue = document.getElementById("hypeValue");
  const comboValue = document.getElementById("comboValue");
  const wpmValue = document.getElementById("wpmValue");
  const hypeBar = document.getElementById("hypeBar");
  const input = document.getElementById("playerInput");
  const playBtn = document.getElementById("playBtn");
  const timerFill = document.getElementById("timerFill");
  const overlay = document.getElementById("gameOverOverlay");
  const restartBtn = document.getElementById("restartBtn");
  const menuBtn = document.getElementById("menuBtn");
  const quitBtn = document.getElementById("quitBtn");
  
  const rankUpOverlay = document.getElementById("rankUpOverlay");
  const rankUpBadge = document.getElementById("rankUpBadge");
  const rankBadgeContainer = document.getElementById("rankBadgeContainer");
  const rankUpShockwave = document.getElementById("rankUpShockwave");
  
  // Preenche a seleção de músicas
  Object.keys(MUSIC_LIBRARY).forEach(key => {
    const opt = document.createElement("option");
    opt.value = key;
    opt.textContent = `${MUSIC_LIBRARY[key].title} (x${MUSIC_LIBRARY[key].multiplier})`;
    songSelect.appendChild(opt);
  });
  
  let currentSongKey = songSelect.value;
  
  function applySelectedSong(key) {
    currentSongKey = key;
    const songData = MUSIC_LIBRARY[key];
    if (typeof menuMusic !== "undefined" && menuMusic) menuMusic.src = songData.url;
    if (typeof gameMusic !== "undefined" && gameMusic) gameMusic.src = songData.url;
    renderLeaderboard(key);
  }
  
  applySelectedSong(currentSongKey);
  
  songSelect.addEventListener("change", (e) => {
    applySelectedSong(e.target.value);
    if (!gameActive) {
      playMenuMusic();
    }
  });
  
  let score = 0;
  let hypePoints = 0;
  let combo = 0;
  const MAX_COMBO = 8;
  let text = "";
  let gameActive = false;
  let startTime = null;
  let charCount = 0;
  let maxWpm = 0;
  let timerInterval = null;
  let timeLeft = 60;
  let maxTime = 60;
  let correctCharsCount = 0;
  let isSRankActive = false;
  
  const RANKS = [
    { name: "D", min: 0, color: "#888888" },
    { name: "C", min: 10, color: "#00ccff" },
    { name: "B", min: 25, color: "#00ff88" },
    { name: "A", min: 45, color: "#ffcc00" },
    { name: "S", min: 70, color: "#ff9900" },
    { name: "SS", min: 100, color: "#ff0066" },
    { name: "SSS", min: 135, color: "#ff00cc" },
    { name: "HERO", min: 180, color: "#ffffff" }
  ];
  
  let highestRankIndex = 0;
  let currentRankIndex = 0;
  let previousRankIndex = 0;
  
  function getCurrentRank() {
    for (let i = RANKS.length - 1; i >= 0; i--) {
      if (hypePoints >= RANKS[i].min) {
        highestRankIndex = Math.max(highestRankIndex, i);
        currentRankIndex = i;
        return { ...RANKS[i], index: i };
      }
    }
    currentRankIndex = 0;
    return { ...RANKS[0], index: 0 };
  }
  
  function triggerRankUpAnimation(rank) {
    rankUpBadge.textContent = rank.name;
    rankUpBadge.style.color = rank.color;
    rankUpOverlay.style.setProperty('--rank-color', rank.color);
  
    if (rank.index >= 4) {
      rankBadgeContainer.classList.add('is-rank-s');
    } else {
      rankBadgeContainer.classList.remove('is-rank-s');
    }
  
    if (rank.index >= 4) {
      document.body.classList.add('mega-shake');
      setTimeout(() => document.body.classList.remove('mega-shake'), 600);
    } else {
      document.body.classList.add('screen-shake');
      setTimeout(() => document.body.classList.remove('screen-shake'), 400);
    }
  
    if (rank.index >= 4) {
      screenFlash.classList.add('active');
      setTimeout(() => screenFlash.classList.remove('active'), 200);
    }
  
    const rect = rankBadgeContainer.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const particleCount = 16 + (rank.index * 8);
  
    for (let i = 0; i < particleCount; i++) {
      spawnParticle(centerX, centerY, rank.color, 50 + rank.index * 20, Math.random() * 8 + 4);
    }
  
    rankUpOverlay.classList.remove('active');
    rankUpShockwave.style.animation = 'none';
    void rankUpShockwave.offsetWidth; 
    rankUpShockwave.style.animation = 'shockwave-expand 0.6s cubic-bezier(0.1, 0.8, 0.3, 1) forwards';
    rankUpOverlay.classList.add('active');
  
    playRankUpSound(rank.index);
  
    setTimeout(() => {
      rankUpOverlay.classList.remove('active');
    }, 1500);
  }
  
  function renderText() {
    game.innerHTML = "";
    for (let i = 0; i < text.length; i++) {
      const span = document.createElement("span");
      span.className = "char pending";
      span.textContent = text[i] === " " ? "\u00A0" : text[i];
      game.appendChild(span);
    }
  }
  
  function triggerSRankEffects(isActivating) {
    if (isActivating && !isSRankActive) {
      isSRankActive = true;
      fadeAudioVolume(gameMusic, MAX_VOLUME, 500); 
  
      game.classList.add('s-rank-active');
      input.classList.add('s-rank-active');
  
    } else if (!isActivating && isSRankActive) {
      isSRankActive = false;
      fadeAudioVolume(gameMusic, BASE_VOLUME, 500);
  
      game.classList.remove('s-rank-active');
      input.classList.remove('s-rank-active');
    }
  }
  
  function updateStats() {
    scoreValue.textContent = score.toLocaleString();
    comboValue.textContent = combo + "x";
  
    const currentRank = getCurrentRank();
    
    if (currentRank.index > previousRankIndex && gameActive) {
      triggerRankUpAnimation(currentRank);
    }
    previousRankIndex = currentRank.index;
  
    if (currentRank.index >= 4) {
      triggerSRankEffects(true);
    } else {
      triggerSRankEffects(false);
    }
  
    if (hypeValue.textContent !== currentRank.name) {
      hypeValue.textContent = currentRank.name;
      hypeValue.style.transform = "scale(1.5)";
      setTimeout(() => hypeValue.style.transform = "scale(1)", 150);
    }
    hypeValue.style.color = currentRank.color;
  
    const nextRank = RANKS[currentRank.index + 1] || currentRank;
    const currentMin = currentRank.min;
    const currentMax = nextRank.min === currentMin ? currentMin + 30 : nextRank.min;
    const pct = Math.min(100, Math.max(0, ((hypePoints - currentMin) / (currentMax - currentMin)) * 100));
    hypeBar.style.width = pct + "%";
  
    if (currentRank.name === "HERO") {
      document.body.classList.add("frenzy");
    } else {
      document.body.classList.remove("frenzy");
    }
  
    if (startTime && charCount > 0) {
      const minutes = (Date.now() - startTime) / 60000;
      const wpm = Math.round((charCount / 5) / Math.max(minutes, 0.01));
      wpmValue.textContent = wpm;
      maxWpm = Math.max(maxWpm, wpm);
    }
  }
  
  function spawnParticle(x, y, color = "#00ff88", distance = 40, size = 6) {
    const p = document.createElement("div");
    p.className = "particle";
    p.style.width = size + "px";
    p.style.height = size + "px";
    p.style.background = color;
    p.style.boxShadow = `0 0 10px ${color}`;
    p.style.left = x + "px";
    p.style.top = y + "px";
  
    const angle = Math.random() * Math.PI * 2;
    const dist = distance * (0.6 + Math.random() * 0.8);
    p.style.setProperty("--tx", Math.cos(angle) * dist + "px");
    p.style.setProperty("--ty", Math.sin(angle) * dist + "px");
  
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 750);
  }
  
  function spawnParticles(x, y, color = "#00ff88", count = 6) {
    for (let i = 0; i < count; i++) {
      spawnParticle(x, y, color, 35, Math.random() * 5 + 3);
    }
  }
  
  function showScorePopup(x, y, pointsGained) {
    const p = document.createElement("div");
    p.className = "time-pop positive";
    p.textContent = `+${pointsGained}`;
    p.style.color = "#00ffcc";
    p.style.fontSize = "1.1rem";
    p.style.fontWeight = "bold";
    p.style.left = (x + 20) + "px";
    p.style.top = (y - 35) + "px";
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 700);
  }
  
  function showTimePopup(x, y, amount, isPositive) {
    const p = document.createElement("div");
    p.className = `time-pop ${isPositive ? "positive" : "negative"}`;
    p.textContent = `${isPositive ? "+" : ""}${amount}s`;
    p.style.left = x + "px";
    p.style.top = (y - 15) + "px";
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 700);
  }
  
  function showComboPopup(textStr) {
    const popup = document.createElement("div");
    popup.className = "combo-popup";
    popup.textContent = textStr;
    popup.style.left = "50%";
    popup.style.top = "38%";
    popup.style.transform = "translateX(-50%) scale(1.2)";
    document.body.appendChild(popup);
    setTimeout(() => popup.remove(), 800);
  }
  
  function nextText() {
    const currentPhrases = MUSIC_LIBRARY[currentSongKey].phrases;
    text = currentPhrases[Math.floor(Math.random() * currentPhrases.length)];
    
    renderText();
    input.value = "";
    correctCharsCount = 0;
    input.disabled = false;
    input.classList.remove("error");
    
    setTimeout(() => input.focus(), 50);
    
    timeLeft = Math.min(maxTime, timeLeft + 4);
  }
  
  game.addEventListener("click", () => {
    if (gameActive && !input.disabled) {
      input.focus();
    }
  });
  
  function startGame() {
    initAudio();
    playGameMusic();
  
    score = 0;
    hypePoints = 0;
    combo = 0;
    highestRankIndex = 0;
    currentRankIndex = 0;
    previousRankIndex = 0;
    charCount = 0;
    maxWpm = 0;
    timeLeft = maxTime;
    correctCharsCount = 0;
    gameActive = true;
    isSRankActive = false;
    startTime = Date.now();
    overlay.classList.remove("active");
    
    songSelect.disabled = true;
    quitBtn.style.display = "block";
    nextText();
    playBtn.style.display = "none";
    triggerSRankEffects(false);
    
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      timeLeft -= 0.1;
      const pct = Math.max(0, (timeLeft / maxTime) * 100);
      timerFill.style.width = pct + "%";
      timerFill.classList.toggle("danger", pct < 25);
      
      if (hypePoints > 0) {
        hypePoints = Math.max(0, hypePoints - 0.08);
        updateStats();
      }
  
      if (timeLeft <= 0) {
        endGame();
      }
    }, 100);
  }
  
  function animateFinalScore(targetScore) {
    const el = document.getElementById("finalScore");
    let current = 0;
    const duration = 1200;
    const stepTime = 20;
    const steps = duration / stepTime;
    const increment = targetScore / steps;
  
    const timer = setInterval(() => {
      current += increment;
      if (current >= targetScore) {
        current = targetScore;
        clearInterval(timer);
      }
      el.textContent = Math.round(current).toLocaleString();
    }, stepTime);
  }
  
  function endGame() {
    gameActive = false;
    clearInterval(timerInterval);
    input.disabled = true;
    input.blur();
    songSelect.disabled = false;
    quitBtn.style.display = "none";
    document.body.classList.remove("frenzy");
    triggerSRankEffects(false);
    
    playMenuMusic();
  
    const finalRankName = RANKS[highestRankIndex].name;
    
    animateFinalScore(score);
    document.getElementById("finalRank").textContent = finalRankName;
    document.getElementById("finalRank").style.color = RANKS[highestRankIndex].color;
    document.getElementById("finalWpm").textContent = maxWpm;
  
    overlay.classList.add("active");
  
    setTimeout(() => {
      saveScoreForSong(currentSongKey, score, finalRankName, maxWpm);
    }, 500);
  }
  
  function returnToMenu() {
    gameActive = false;
    clearInterval(timerInterval);
    
    overlay.classList.remove("active");
    playBtn.style.display = "inline-block";
    quitBtn.style.display = "none";
    input.disabled = true;
    input.blur();
    input.value = "";
    input.placeholder = "Clique em PLAY para começar...";
    game.innerHTML = "";
    songSelect.disabled = false;
    
    score = 0;
    hypePoints = 0;
    combo = 0;
    previousRankIndex = 0;
    currentRankIndex = 0;
    charCount = 0;
    wpmValue.textContent = "0";
    timerFill.style.width = "100%";
    
    document.body.classList.remove("frenzy");
    triggerSRankEffects(false);
    updateStats();
    playMenuMusic();
  }
  
  playBtn.addEventListener("click", startGame);
  restartBtn.addEventListener("click", startGame);
  menuBtn.addEventListener("click", returnToMenu);
  
  window.addEventListener("keydown", (e) => {
    if (!gameActive && overlay.classList.contains("active") && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      startGame();
    }
  });
  
  input.addEventListener("keydown", (e) => {
    if (!gameActive) return;
    if (e.key === "Backspace" && input.value.length <= correctCharsCount) {
      e.preventDefault();
    }
  });
  
  input.addEventListener("input", () => {
    if (!gameActive) return;
  
    const typed = input.value;
    const chars = game.querySelectorAll(".char");
  
    if (typed.length < correctCharsCount) {
      input.value = text.substring(0, correctCharsCount);
      return;
    }
  
    if (typed.length > correctCharsCount) {
      const index = typed.length - 1;
      const typedChar = typed[index];
      const expectedChar = text[index];
      const charSpan = chars[index];
  
      if (typedChar === expectedChar) {
        correctCharsCount++;
        combo = Math.min(MAX_COMBO, combo + 1);
        hypePoints += 1.2;
        charCount++;
  
        const songMultiplier = MUSIC_LIBRARY[currentSongKey].multiplier || 1.0;
        const basePoints = 15;
        const comboMult = 1 + (combo * 0.15); 
        const currentRank = getCurrentRank();
        const rankMult = 1 + (currentRank.index * 0.25);
        
        const pointsGained = Math.round(basePoints * comboMult * rankMult * songMultiplier);
        score += pointsGained;
  
        timeLeft = Math.min(maxTime, timeLeft + 0.3);
  
        playSuccessSound(combo);
  
        if (charSpan) {
          const rect = charSpan.getBoundingClientRect();
          spawnParticles(rect.left + rect.width / 2, rect.top + rect.height / 2, currentRank.color, 5 + combo);
          showTimePopup(rect.left + rect.width / 2, rect.top, "0.3", true);
          showScorePopup(rect.left + rect.width / 2, rect.top, pointsGained);
        }
  
        if (combo === MAX_COMBO && typed.length % 5 === 0) {
          showComboPopup("MAX COMBO 8x!");
        }
  
      } else {
        combo = 0; 
        
        const currentRank = getCurrentRank();
        if (currentRank.index > 0) {
          const previousRank = RANKS[currentRank.index - 1];
          hypePoints = previousRank.min;
        } else {
          hypePoints = 0;
        }
  
        timeLeft = Math.max(0, timeLeft - 2.0);
  
        playErrorSound();
  
        if (charSpan) {
          charSpan.classList.remove("pending", "current");
          charSpan.classList.add("wrong");
          const rect = charSpan.getBoundingClientRect();
          spawnParticles(rect.left + rect.width / 2, rect.top + rect.height / 2, "#ff3333", 8);
          showTimePopup(rect.left + rect.width / 2, rect.top, "-2", false);
          
          setTimeout(() => {
            if (charSpan.classList.contains("wrong")) {
              charSpan.classList.remove("wrong");
              charSpan.classList.add("current");
            }
          }, 300);
        }
  
        input.value = typed.substring(0, index);
  
        input.classList.add("error");
        setTimeout(() => input.classList.remove("error"), 250);
      }
    }
  
    for (let i = 0; i < text.length; i++) {
      const charSpan = chars[i];
      if (!charSpan) continue;
  
      const expected = text[i];
      const actual = input.value[i];
  
      if (charSpan.classList.contains("wrong")) continue;
  
      charSpan.classList.remove("pending", "correct", "current");
  
      if (i < input.value.length) {
        if (actual === expected) {
          charSpan.classList.add("correct");
        }
      } else if (i === input.value.length) {
        charSpan.classList.add("current");
      } else {
        charSpan.classList.add("pending");
      }
    }
  
    if (input.value === text) {
      nextText();
    }
  
    updateStats();
  });
  
  input.addEventListener("paste", (e) => e.preventDefault());
