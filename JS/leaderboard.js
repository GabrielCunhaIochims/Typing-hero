// JS/leaderboard.js

// 1. Cria ou obtém o container do Leaderboard na DOM
function createLeaderboardUI() {
  let boardContainer = document.getElementById("leaderboardContainer");
  const songSelect = document.getElementById("songSelect");

  if (!boardContainer && songSelect) {
    boardContainer = document.createElement("div");
    boardContainer.id = "leaderboardContainer";
    boardContainer.className = "leaderboard-section";
    songSelect.parentNode.insertBefore(boardContainer, songSelect.nextSibling);
  }

  return boardContainer;
}

// 2. Auxiliar para prevenir ataques XSS nos nicks dos jogadores
function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// 3. Busca as pontuações (Tenta Supabase; se não houver dados ou der erro, usa LocalStorage)
async function fetchScoresForSong(songKey) {
  let remoteScores = null;

  try {
    if (typeof _supabase !== "undefined" && _supabase) {
      const { data, error } = await _supabase
        .from("leaderboard")
        .select("*")
        .eq("song_key", songKey)
        .order("score", { ascending: false })
        .limit(10);

      if (!error && data) {
        remoteScores = data;
      } else if (error) {
        console.warn("Aviso ao buscar scores no Supabase:", error.message);
      }
    }
  } catch (e) {
    console.error("Erro na conexão com Supabase:", e);
  }

  // Se o Supabase encontrou registros, exibe o ranking global
  if (remoteScores && remoteScores.length > 0) {
    return remoteScores;
  }

  // Fallback: Busca do LocalStorage caso o Supabase falhe ou esteja sem dados nessa música
  const allScores = JSON.parse(localStorage.getItem("typing_game_leaderboards")) || {};
  return allScores[songKey] || [];
}

// 4. Salva a pontuação (Grava no LocalStorage + Supabase) e recarrega a UI
async function saveScoreForSong(songKey, newScore, rankName, wpm) {
  const parsedScore = Math.round(Number(newScore) || 0);
  const parsedWpm = Math.round(Number(wpm) || 0);

  if (parsedScore <= 0) return; // Ignora pontuações zeradas

  //  BLOQUEIO DE CONVIDADOS / NÃO LOGADOS
  if (typeof currentUser === "undefined" || !currentUser) {
    console.warn("Pontuação não salva: Apenas usuários logados podem entrar na leaderboard.");
    return; // Encerra a função sem pedir prompt e sem salvar no LocalStorage/Supabase
  }

  // Dados do usuário logado
  const userId = currentUser.id;
  const playerName = currentUser.user_metadata?.display_name || 
                     currentUser.email?.split("@")[0] || 
                     "Jogador";

  // A. Salva no LocalStorage (Apenas para o usuário logado)
  const allScores = JSON.parse(localStorage.getItem("typing_game_leaderboards")) || {};
  if (!allScores[songKey]) allScores[songKey] = [];

  allScores[songKey].push({
    player: playerName,
    score: parsedScore,
    rank: rankName,
    wpm: parsedWpm,
    date: new Date().toLocaleDateString("pt-BR")
  });

  allScores[songKey].sort((a, b) => b.score - a.score);
  allScores[songKey] = allScores[songKey].slice(0, 10);
  localStorage.setItem("typing_game_leaderboards", JSON.stringify(allScores));

  // B. Salva na Nuvem (Supabase)
  if (typeof _supabase !== "undefined" && _supabase) {
    try {
      const { error } = await _supabase.from("leaderboard").insert([
        {
          user_id: userId,
          player: playerName,
          score: parsedScore,
          rank: rankName,
          wpm: parsedWpm,
          song_key: songKey
        }
      ]);

      if (error) {
        console.error("Erro RLS/Supabase ao gravar ranking:", error.message);
      }
    } catch (err) {
      console.error("Erro inesperado ao salvar no Supabase:", err);
    }
  }

  // C. Atualiza a exibição na tela imediatamente
  await renderLeaderboard(songKey);
}

// 5. Renderiza o Ranking na tela
async function renderLeaderboard(songKey) {
  const container = createLeaderboardUI();
  if (!container) return;

  container.innerHTML = `<div class="leaderboard-loading" style="padding: 10px; color: #888;">Carregando ranking...</div>`;

  const scores = await fetchScoresForSong(songKey);
  const songTitle = typeof MUSIC_LIBRARY !== "undefined" && MUSIC_LIBRARY[songKey]
    ? MUSIC_LIBRARY[songKey].title
    : songKey;

  if (!scores || scores.length === 0) {
    container.innerHTML = `
      <div class="leaderboard-title">🏆 Top Placar: ${escapeHtml(songTitle)}</div>
      <div class="empty-board">Nenhuma pontuação registrada para esta música. Seja o primeiro!</div>
    `;
    return;
  }

  const rowsHtml = scores.map((item, index) => {
    const isTopThree = index < 3 ? `top-${index + 1}` : '';
    const safePlayer = escapeHtml(item.player || "Anônimo");
    const safeRank = escapeHtml(item.rank || "D");
    const safeScore = Number(item.score || 0).toLocaleString("pt-BR");
    const safeWpm = Number(item.wpm || 0);

    return `
      <tr class="${isTopThree}">
        <td>#${index + 1}</td>
        <td><strong>${safePlayer}</strong></td>
        <td><span class="rank-badge rank-${safeRank}">${safeRank}</span></td>
        <td>${safeWpm} WPM</td>
        <td><strong>${safeScore} pts</strong></td>
      </tr>
    `;
  }).join("");

  container.innerHTML = `
    <div class="leaderboard-title">🏆 Top Placar: ${escapeHtml(songTitle)}</div>
    <table class="leaderboard-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Jogador</th>
          <th>Rank</th>
          <th>WPM</th>
          <th>Pontos</th>
        </tr>
      </thead>
      <tbody>
        ${rowsHtml}
      </tbody>
    </table>
  `;
}

// 6. Event Listeners para recarregar ao trocar de música
document.addEventListener("DOMContentLoaded", () => {
  const songSelect = document.getElementById("songSelect");

  if (songSelect) {
    if (songSelect.value) {
      renderLeaderboard(songSelect.value);
    }

    songSelect.addEventListener("change", (e) => {
      renderLeaderboard(e.target.value);
    });
  }
});
