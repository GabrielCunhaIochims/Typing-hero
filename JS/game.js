// ==========================================
// CONFIGURAÇÕES, SEGURANÇA E BIBLIOTECA
// ==========================================

const MUSIC_LIBRARY = {
  "9_circles_of_hell": {
    sectionName: "Infernal Descent",
    tracks: {
      "limbo": {
        title: "Limbo Echoes",
        url: "musicas/Limbo Echoes.mp3",
        multiplier: 1.0,
        phrases: [
          "A névoa esconde o abismo, mas a batida ecoa nas profundezas.",
          "O Primeiro Círculo sussurra a promessa da dor eterna.",
          "Sem esperança, mas com o ritmo gravado na alma dos esquecidos.",
          "A pulsação do inferno ressoa na penumbra dos filósofos.",
          "Sinta o pulso sombrio antes de despencar no abismo de fogo.",
          "Um lugar sem salvação, onde o tempo é ditado pela frequência do caos.",
          "A luz da razão se apaga na batida do inferno.",
          "Suspiros sem lamento ecoam pelos prados da eternidade.",
          "Passos lentos sobre a penumbra de uma paz ilusória."
        ]
      },
      "lust": {
        title: "Winds of Francesca WIP",
        url: "musicas/Winds of Francesca.mp3",
        multiplier: 1.15,
        phrases: [
          "a"
        ]
      }
    }
  },
  "cyber_overdrive": {
    sectionName: "Cybernetic Protocol",
    tracks: {
      "hellfire": {
        title: "Hellfire Overdrive",
        url: "musicas/Hellfire Overdrive.mp3",
        multiplier: 1.5,
        phrases: [
          "Metal queimando no asfalto, neon sangrando no horizonte.",
          "Acelere até o motor virar fumaça e a alma virar código.",
          "Sem freios, sem limites, sem salvação: bem-vindo ao Hellfire Overdrive.",
          "Onde o cromo derrete e a velocidade domina o caos.",
          "Sinta o peso do aço, o calor do fogo e a força da distorção.",
          "Modo Overdrive Ativado: Sobrecarga nos sistemas",
          "Sangue de óleo, coração de nitroglicerina.",
          "Ultrapasse a velocidade da morte.",
          "Conexão neural queimada a 10.000 RPM.",
          "Injetando caos diretamente no barramento de dados.",
          "As ruas de cromo não perdoam quem tem medo de pisar no fundo.",
          "Guitarras distorcidas ecoando nas ruínas de uma metrópole esquecida.",
          "Se o futuro é sombrio, nós o iluminaremos com o fogo dos nossos motores.",
          "Na fronteira entre o circuito e a carne, apenas o ritmo do metal permanece.",
          "Nossa liberdade não é programada, é conquistada na rotação máxima."
        ]
      },
      "code_master": {
        title: "Bitrush_Overdrive",
        url: "musicas/Bitrush Overdrive.mp3",
        multiplier: 1.25,
        phrases: [
          "let pontos = 0;",
          "const nome = 'Jogador 1';",
          "console.log('Iniciando o jogo...');",
          "let vidas = 3;",
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
    }
  }
};

const ADMIN_PASSWORD_HASH = "0fc38699678759bfc9d851f132fca6824f6eb0c98f6122acdfaa83c9df3a44fc";
// ==========================================
// CONFIGURAÇÕES, ESTADOS E CONSTANTES
// ==========================================
const RANKS = [
  { name: "D", minScore: 0, color: "#888888" },
  { name: "C", minScore: 1000, color: "#4caf50" },
  { name: "B", minScore: 3000, color: "#2196f3" },
  { name: "A", minScore: 6000, color: "#9c27b0" },
  { name: "S", minScore: 10000, color: "#ff9800" },
  { name: "SS", minScore: 15000, color: "#e91e63" },
  { name: "SSS", minScore: 22000, color: "#f44336" }
];

// Exemplo SHA-256

let text = "Typing Hero é um jogo de digitação dinâmico focado em precisão e agilidade.";
let gameActive = false;
let timerInterval = null;
let timeLeft = 60;
let maxTime = 60;

let score = 0;
let combo = 0;
let maxCombo = 0;
let hypePoints = 0;
let charCount = 0;
let maxWpm = 0;
let previousRankIndex = 0;
let currentRankIndex = 0;
let highestRankIndex = 0;

let cachedCharSpans = [];
let currentSongKey = "default";
let announcements = [];

// Seletores do DOM
const game = document.getElementById("game");
const input = document.getElementById("input");
const playBtn = document.getElementById("playBtn");
const restartBtn = document.getElementById("restartBtn");
const menuBtn = document.getElementById("menuBtn");
const quitBtn = document.getElementById("quitBtn");
const songSelect = document.getElementById("songSelect");

const scoreValue = document.getElementById("scoreValue");
const comboValue = document.getElementById("comboValue");
const wpmValue = document.getElementById("wpmValue");
const rankValue = document.getElementById("rankValue");
const timerFill = document.getElementById("timerFill");
const overlay = document.getElementById("overlay");

// Modais e Forms
const bugReportBtn = document.getElementById("bugReportBtn");
const bugReportOverlay = document.getElementById("bugReportOverlay");
const closeBugModalBtn = document.getElementById("closeBugModalBtn");
const bugReportForm = document.getElementById("bugReportForm");
const bugFeedbackMsg = document.getElementById("bugFeedbackMsg");

const newsModalBtn = document.getElementById("newsModalBtn");
const newsOverlay = document.getElementById("newsOverlay");
const newsList = document.getElementById("newsList");
const closeNewsModalBtn = document.getElementById("closeNewsModalBtn");

const passwordOverlay = document.getElementById("passwordOverlay");
const adminPasswordInput = document.getElementById("adminPasswordInput");
const submitPasswordBtn = document.getElementById("submitPasswordBtn");
const closePasswordModalBtn = document.getElementById("closePasswordModalBtn");

const adminOverlay = document.getElementById("adminOverlay");
const adminPostForm = document.getElementById("adminPostForm");
const postTitleInput = document.getElementById("postTitleInput");
const postContentInput = document.getElementById("postContentInput");
const closeAdminModalBtn = document.getElementById("closeAdminModalBtn");

// ==========================================
// EFEITOS VISUAIS E ANIMAÇÕES (FLOATING TEXT)
// ==========================================

function showFloatingText(strText, color, isError = false) {
  if (!game) return;
  const floatEl = document.createElement("div");
  floatEl.className = `floating-text ${isError ? "error" : ""}`;
  floatEl.textContent = strText;
  floatEl.style.color = color;

  // Posição levemente aleatória em volta do centro
  const randomX = (Math.random() - 0.5) * 60;
  floatEl.style.transform = `translate(${randomX}px, 0px)`;

  game.appendChild(floatEl);
  setTimeout(() => floatEl.remove(), 800);
}

function triggerSRankEffects(active) {
  if (active) {
    document.body.classList.add("s-rank-active");
  } else {
    document.body.classList.remove("s-rank-active");
  }
}

function animateFinalScore(targetScore) {
  const finalScoreEl = document.getElementById("finalScore");
  if (!finalScoreEl) return;
  
  let current = 0;
  const increment = Math.max(1, Math.floor(targetScore / 40));
  const timer = setInterval(() => {
    current += increment;
    if (current >= targetScore) {
      current = targetScore;
      clearInterval(timer);
    }
    finalScoreEl.textContent = current;
  }, 20);
}

function showNotification(msg, isError = false) {
  const notif = document.createElement("div");
  notif.className = `notification ${isError ? "error" : "success"}`;
  notif.textContent = msg;
  document.body.appendChild(notif);
  setTimeout(() => notif.remove(), 3000);
}

// SHA-256 Auxiliar para o painel admin
async function sha256(str) {
  const buf = await crypto.subcrypto ? crypto.subtle.digest("SHA-256", new TextEncoder().encode(str)) : null;
  if (!buf) return "";
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
}

function getLoggedUser() {
  try {
    return JSON.parse(localStorage.getItem("user")) || null;
  } catch {
    return null;
  }
}

// ==========================================
// RENDERIZAÇÃO DE TEXTO E LÓGICA DO JOGO
// ==========================================

function renderText() {
  if (!game) return;
  game.innerHTML = "";
  cachedCharSpans = [];

  const container = document.createElement("div");
  container.style.display = "inline-flex";
  container.style.alignItems = "center";
  container.style.justifyContent = "center";
  container.style.whiteSpace = "nowrap";

  const words = text.split(" ");

  words.forEach((word, wordIndex) => {
    const wordSpan = document.createElement("span");
    wordSpan.style.display = "inline-flex";

    word.split("").forEach((char) => {
      const charSpan = document.createElement("span");
      charSpan.className = "char pending";
      charSpan.textContent = char;

      wordSpan.appendChild(charSpan);
      cachedCharSpans.push(charSpan);
    });

    container.appendChild(wordSpan);

    if (wordIndex < words.length - 1) {
      const spaceSpan = document.createElement("span");
      spaceSpan.className = "char pending space";
      spaceSpan.style.display = "inline-block";
      spaceSpan.style.width = "0.4em";
      spaceSpan.innerHTML = "&nbsp;";

      container.appendChild(spaceSpan);
      cachedCharSpans.push(spaceSpan);
    }
  });

  game.appendChild(container);

  if (cachedCharSpans.length > 0) {
    cachedCharSpans[0].classList.remove("pending");
    cachedCharSpans[0].classList.add("current");
  }
}

function updateStats() {
  if (scoreValue) scoreValue.textContent = score;
  if (comboValue) comboValue.textContent = combo;

  // Cálculo de WPM
  const currentWpm = Math.round((charCount / 5));
  if (currentWpm > maxWpm) maxWpm = currentWpm;
  if (wpmValue) wpmValue.textContent = currentWpm;

  // Cálculo de Rank
  let currentRank = RANKS[0];
  RANKS.forEach((r, idx) => {
    if (score >= r.minScore) {
      currentRank = r;
      currentRankIndex = idx;
    }
  });

  if (currentRankIndex > highestRankIndex) {
    highestRankIndex = currentRankIndex;
  }

  if (rankValue) {
    rankValue.textContent = currentRank.name;
    rankValue.style.color = currentRank.color;
  }

  if (currentRank.name === "S" || currentRank.name === "SS" || currentRank.name === "SSS") {
    triggerSRankEffects(true);
  }
}

function handleInput(e) {
  if (!gameActive) return;

  const typedVal = input.value;
  const currentCharSpan = cachedCharSpans[charCount];

  if (!currentCharSpan) return;

  const expectedChar = currentCharSpan.classList.contains("space") ? " " : currentCharSpan.textContent;
  const lastTypedChar = typedVal.slice(-1);

  if (lastTypedChar === expectedChar) {
    // ACERTO
    currentCharSpan.classList.remove("current", "pending", "wrong");
    currentCharSpan.classList.add("correct");

    combo++;
    if (combo > maxCombo) maxCombo = combo;

    // Ganho de pontos com base no combo
    const pointsGained = 10 + Math.floor(combo / 5) * 5;
    score += pointsGained;
    charCount++;

    // Bônus de tempo a cada 20 acertos no combo (+2 segundos)
    if (combo > 0 && combo % 20 === 0) {
      timeLeft = Math.min(maxTime, timeLeft + 2);
      showFloatingText("+2s Tempo!", "#00ffcc");
    } else {
      showFloatingText(`+${pointsGained}`, "#00ffcc");
    }

    // Avançar Cursor
    if (charCount < cachedCharSpans.length) {
      cachedCharSpans[charCount].classList.remove("pending");
      cachedCharSpans[charCount].classList.add("current");
    } else {
      // Loop do texto caso finalize a frase antes do tempo acabar
      charCount = 0;
      renderText();
    }
  } else {
    // ERRO: Perde combo e sofre penalidade de tempo (-1.5 segundos)
    combo = 0;
    timeLeft = Math.max(0, timeLeft - 1.5);
    currentCharSpan.classList.add("wrong");

    showFloatingText("-1.5s Erro!", "#ff0066", true);
  }

  input.value = "";
  updateStats();
}

function updateTimer() {
  timeLeft -= 0.1;
  if (timerFill) {
    const percentage = Math.max(0, (timeLeft / maxTime) * 100);
    timerFill.style.width = `${percentage}%`;
  }

  if (timeLeft <= 0) {
    timeLeft = 0;
    endGame();
  }
}

function startGame() {
  gameActive = true;
  score = 0;
  combo = 0;
  maxCombo = 0;
  charCount = 0;
  maxWpm = 0;
  timeLeft = 60;
  maxTime = 60;
  highestRankIndex = 0;

  if (overlay) overlay.classList.remove("active");
  if (playBtn) playBtn.style.display = "none";
  if (quitBtn) quitBtn.style.display = "inline-block";
  if (songSelect) songSelect.disabled = true;

  if (input) {
    input.disabled = false;
    input.value = "";
    input.focus();
  }

  renderText();
  updateStats();

  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(updateTimer, 100);
}

function endGame() {
  gameActive = false;
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }

  if (input) {
    input.disabled = true;
    input.blur();
  }
  if (songSelect) songSelect.disabled = false;
  if (quitBtn) quitBtn.style.display = "none";
  document.body.classList.remove("frenzy");
  triggerSRankEffects(false);

  if (typeof playMenuMusic === "function") playMenuMusic();

  const finalRankName = RANKS[highestRankIndex].name;
  animateFinalScore(score);

  const finalRankEl = document.getElementById("finalRank");
  if (finalRankEl) {
    finalRankEl.textContent = finalRankName;
    finalRankEl.style.color = RANKS[highestRankIndex].color;
  }
  const finalWpmEl = document.getElementById("finalWpm");
  if (finalWpmEl) finalWpmEl.textContent = maxWpm;

  if (overlay) overlay.classList.add("active");

  setTimeout(() => {
    if (typeof saveScoreForSong === "function") {
      saveScoreForSong(currentSongKey, score, finalRankName, maxWpm);
    }
  }, 500);
}

function returnToMenu() {
  gameActive = false;
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }

  if (overlay) overlay.classList.remove("active");
  if (playBtn) playBtn.style.display = "inline-block";
  if (quitBtn) quitBtn.style.display = "none";

  if (input) {
    input.disabled = true;
    input.blur();
    input.value = "";
    input.placeholder = "Clique em PLAY para começar...";
  }

  if (game) game.innerHTML = "";
  if (songSelect) songSelect.disabled = false;

  score = 0;
  hypePoints = 0;
  combo = 0;
  previousRankIndex = 0;
  currentRankIndex = 0;
  charCount = 0;
  cachedCharSpans = [];

  if (wpmValue) wpmValue.textContent = "0";
  if (timerFill) timerFill.style.width = "100%";

  document.body.classList.remove("frenzy");
  triggerSRankEffects(false);
  updateStats();
  if (typeof playMenuMusic === "function") playMenuMusic();
}

// Eventos de entrada
if (input) input.addEventListener("input", handleInput);
if (playBtn) playBtn.addEventListener("click", startGame);
if (restartBtn) restartBtn.addEventListener("click", startGame);
if (menuBtn) menuBtn.addEventListener("click", returnToMenu);
if (quitBtn) quitBtn.addEventListener("click", returnToMenu);

window.addEventListener("keydown", (e) => {
  if (!gameActive && overlay && overlay.classList.contains("active") && (e.key === "Enter" || e.key === " ")) {
    e.preventDefault();
    startGame();
  }
});

// ==========================================
// REPORT DE BUGS & DISCORD WEBHOOK
// ==========================================

if (bugReportBtn && bugReportOverlay) {
  bugReportBtn.addEventListener("click", () => {
    const user = getLoggedUser();
    if (!user) {
      showNotification("ACESSO NEGADO: Você precisa estar logado para reportar um bug!", true);
      return;
    }
    bugReportOverlay.classList.add("active");
    if (input) input.blur();
  });
}

function closeBugModal() {
  if (bugReportOverlay) {
    bugReportOverlay.classList.remove("active");
    if (bugReportForm) bugReportForm.reset();
    if (bugFeedbackMsg) {
      bugFeedbackMsg.textContent = "";
      bugFeedbackMsg.className = "bug-feedback-msg";
    }
  }
}

if (closeBugModalBtn) closeBugModalBtn.addEventListener("click", closeBugModal);

if (bugReportForm) {
  bugReportForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const user = getLoggedUser();
    if (!user) {
      if (bugFeedbackMsg) {
        bugFeedbackMsg.textContent = "Sessão expirada. Faça login para reportar.";
        bugFeedbackMsg.style.color = "#ff0066";
      }
      showNotification("Sessão expirada. Faça login novamente.", true);
      return;
    }

    const categoryEl = document.getElementById("bugCategory");
    const descriptionEl = document.getElementById("bugDescription");
    const category = categoryEl ? categoryEl.value : "Geral";
    const description = descriptionEl ? descriptionEl.value : "";

    if (!description.trim()) {
      if (bugFeedbackMsg) {
        bugFeedbackMsg.textContent = "Por favor, descreva o problema.";
        bugFeedbackMsg.style.color = "#ff0066";
      }
      return;
    }

    const DISCORD_WEBHOOK_URL = "SUA_DISCORD_WEBHOOK_URL_AQUI";

    if (bugFeedbackMsg) {
      bugFeedbackMsg.textContent = "Enviando relatório...";
      bugFeedbackMsg.style.color = "#00ffcc";
    }

    const username = user.username || user.name || user.email || "Usuário Autenticado";
    const userId = user.id || user.uid || "N/A";
    const currentSong = typeof currentSongKey !== "undefined" ? currentSongKey : "Nenhuma";

    const payload = {
      username: "Bug Reporter Bot",
      avatar_url: "https://cdn-icons-png.flaticon.com/512/682/682009.png",
      embeds: [{
        title: "Novo Bug Reportado!",
        color: 16711782,
        fields: [
          { name: "Enviado por", value: `${username} (ID: ${userId})`, inline: false },
          { name: "Música Selecionada", value: currentSong, inline: true },
          { name: "Categoria", value: category, inline: true },
          { name: "Descrição / Relato", value: description }
        ],
        footer: { text: "Sistema de Report de Bugs • Typing Hero" },
        timestamp: new Date().toISOString()
      }]
    };

    try {
      const response = await fetch(DISCORD_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        if (bugFeedbackMsg) {
          bugFeedbackMsg.textContent = "✓ Relatório enviado ao Discord com sucesso!";
          bugFeedbackMsg.className = "bug-feedback-msg success";
        }
        bugReportForm.reset();
        setTimeout(closeBugModal, 1500);
      } else {
        throw new Error("Erro na resposta do Webhook");
      }
    } catch (error) {
      console.error("Erro ao enviar o bug:", error);
      if (bugFeedbackMsg) {
        bugFeedbackMsg.textContent = "Erro ao enviar o relato. Tente novamente.";
        bugFeedbackMsg.style.color = "#ff0066";
      }
    }
  });
}

// ==========================================
// INTEGRAÇÃO DE ANÚNCIOS (SUPABASE)
// ==========================================

const getSupabaseClient = () => {
  let client = (typeof supabase !== "undefined" ? supabase : null) || 
               (typeof window._supabase !== "undefined" ? window._supabase : null);

  if (!client) return null;

  if (typeof client.from === "function") {
    return client;
  }

  if (typeof client.createClient === "function" && typeof SUPABASE_URL !== "undefined" && typeof SUPABASE_ANON_KEY !== "undefined") {
    if (!window._supabaseInstance) {
      window._supabaseInstance = client.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }
    return window._supabaseInstance;
  }

  return null;
};

announcements = window.announcements || [];

async function fetchAnnouncements() {
  try {
    const client = getSupabaseClient();
    if (!client) return [];

    const { data, error } = await client
      .from("announcements")
      .select("id, title, content, created_at")
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error("Erro ao carregar anúncios do Supabase:", err.message || err);
    return [];
  }
}

async function loadAndRenderAnnouncements() {
  announcements = await fetchAnnouncements();
  renderAnnouncements();
  checkUnreadNews();
}

function renderAnnouncements() {
  if (!newsList) return;

  if (announcements.length === 0) {
    newsList.innerHTML = `<div style="color: #666; font-size: 0.85rem; padding: 10px; text-align: center;">Nenhuma atualização publicada ainda.</div>`;
    return;
  }

  const user = typeof getLoggedUser === "function" ? getLoggedUser() : null;
  const isUserAdmin = user && (user.username === "INFAMOS" || user.name === "INFAMOS");

  newsList.innerHTML = announcements.map(post => {
    const dateObj = new Date(post.created_at);
    const formattedDate = dateObj.toLocaleDateString("pt-BR") + " às " + dateObj.toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' });

    return `
      <div class="news-card" style="position: relative;">
        ${isUserAdmin ? `
          <button 
            data-id="${post.id}" 
            class="delete-news-btn"
            title="Excluir mensagem"
            style="position: absolute; top: 10px; right: 10px; background: transparent; border: none; color: #ff0066; cursor: pointer; font-size: 1.1rem; font-weight: bold;"
          >
            ✕
          </button>
        ` : ''}
        <h4>${typeof escapeHtml === "function" ? escapeHtml(post.title) : post.title}</h4>
        <p>${typeof escapeHtml === "function" ? escapeHtml(post.content) : post.content}</p>
        <span class="news-date" style="display: block; margin-top: 8px; font-size: 0.75rem; color: #aaa;">📅 ${formattedDate}</span>
      </div>
    `;
  }).join("");
}

if (newsList) {
  newsList.addEventListener("click", async (e) => {
    const deleteBtn = e.target.closest(".delete-news-btn");
    if (!deleteBtn) return;

    const id = deleteBtn.dataset.id;
    if (!id) return;

    if (!confirm("Tem certeza que deseja excluir esta mensagem do banco de dados?")) return;

    try {
      const client = getSupabaseClient();
      if (!client) throw new Error("Cliente Supabase não encontrado.");

      const { error } = await client
        .from("announcements")
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      if (typeof showNotification === "function") showNotification("Mensagem removida com sucesso!", false);
      await loadAndRenderAnnouncements();
    } catch (err) {
      console.error("Erro ao deletar anúncio:", err);
      alert(`Erro ao excluir anúncio: ${err.message || "Falha na requisição"}`);
    }
  });
}

function checkUnreadNews() {
  const lastRead = parseInt(localStorage.getItem("last_read_news_count") || "0", 10);
  if (announcements.length > lastRead && newsModalBtn) {
    newsModalBtn.classList.add("has-unread-news");
  } else if (newsModalBtn) {
    newsModalBtn.classList.remove("has-unread-news");
  }
}

if (newsModalBtn) {
  newsModalBtn.addEventListener("click", () => {
    if (newsOverlay) newsOverlay.classList.add("active");
    renderAnnouncements();
    localStorage.setItem("last_read_news_count", announcements.length.toString());
    newsModalBtn.classList.remove("has-unread-news");
  });
}

if (adminPostForm) {
  adminPostForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = typeof postTitleInput !== "undefined" && postTitleInput ? postTitleInput.value.trim() : "";
    const content = typeof postContentInput !== "undefined" && postContentInput ? postContentInput.value.trim() : "";

    if (!title || !content) {
      if (typeof showNotification === "function") showNotification("Preencha o título e o conteúdo!", true);
      return;
    }

    try {
      const client = getSupabaseClient();
      if (!client) throw new Error("Cliente Supabase não encontrado.");

      const { error } = await client
        .from("announcements")
        .insert([{ title, content }]);

      if (error) throw error;

      adminPostForm.reset();
      if (typeof adminOverlay !== "undefined" && adminOverlay) adminOverlay.classList.remove("active");
      if (typeof showNotification === "function") showNotification("Atualização publicada com sucesso!", false);

      await loadAndRenderAnnouncements();
    } catch (err) {
      console.error("Erro ao inserir anúncio:", err);
      alert(`Erro no Supabase: ${err.message || "Não foi possível salvar."}`);
    }
  });
}

// ==========================================
// PAINEL ADMIN (SHIFT + A) E MODAIS
// ==========================================

window.addEventListener("keydown", (e) => {
  const activeElement = document.activeElement;
  const isTyping = activeElement && (
    activeElement.tagName === "INPUT" ||
    activeElement.tagName === "TEXTAREA" ||
    activeElement.tagName === "SELECT"
  );

  if (isTyping) return;

  if (e.shiftKey && (e.key === "A" || e.key === "a")) {
    if (passwordOverlay) {
      passwordOverlay.classList.add("active");
      if (adminPasswordInput) {
        adminPasswordInput.value = "";
        adminPasswordInput.focus();
      }
    }
  }
});

async function verifyPassword() {
  if (!adminPasswordInput) return;
  const typedPassword = adminPasswordInput.value;
  const hash = await sha256(typedPassword);

  if (hash === ADMIN_PASSWORD_HASH) {
    if (passwordOverlay) passwordOverlay.classList.remove("active");
    if (adminOverlay) adminOverlay.classList.add("active");
  } else {
    showNotification("Senha incorreta!", true);
    adminPasswordInput.value = "";
  }
}

if (submitPasswordBtn) submitPasswordBtn.addEventListener("click", verifyPassword);
if (adminPasswordInput) {
  adminPasswordInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") verifyPassword();
  });
}

if (closeNewsModalBtn) closeNewsModalBtn.addEventListener("click", () => newsOverlay && newsOverlay.classList.remove("active"));
if (closePasswordModalBtn) closePasswordModalBtn.addEventListener("click", () => passwordOverlay && passwordOverlay.classList.remove("active"));
if (closeAdminModalBtn) closeAdminModalBtn.addEventListener("click", () => adminOverlay && adminOverlay.classList.remove("active"));

window.addEventListener("click", (e) => {
  if (newsOverlay && e.target === newsOverlay) newsOverlay.classList.remove("active");
  if (passwordOverlay && e.target === passwordOverlay) passwordOverlay.classList.remove("active");
  if (adminOverlay && e.target === adminOverlay) adminOverlay.classList.remove("active");
  if (bugReportOverlay && e.target === bugReportOverlay) closeBugModal();
});

// Inicialização
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", loadAndRenderAnnouncements);
} else {
  loadAndRenderAnnouncements();
}
// Inicializa a chamada dos anúncios no Supabase
fetchAnnouncements();
