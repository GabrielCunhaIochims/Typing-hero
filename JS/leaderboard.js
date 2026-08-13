// JS/leaderboard.js

// 1. Cria ou obtém o container da Leaderboard na DOM
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

// 2. Busca as pontuações (Tenta Supabase primeiro, depois LocalStorage em caso de falha)
async function fetchScoresForSong(songKey) {
  try {
    if (typeof _supabase !== "undefined" && _supabase) {
      const { data, error } = await _supabase
        .from("leaderboard")
        .select("*")
        .eq("song_key", songKey)
        .order("score", { ascending: false })
        .limit(10);

      if (!error && data) {
        return data;
      }

      if (error) {
        console.warn("Aviso ao buscar scores do Supabase:", error.message);
      }
    }
  } catch (e) {
    console.error("Erro ao conectar com o Supabase:", e);
  }

  // Fallback para LocalStorage se o Supabase falhar ou estiver offline
  const allScores = JSON.parse(localStorage.getItem("typing_game_leaderboards")) || {};
  return allScores[songKey] || [];
}

// 3. Salva a nova pontuação (Supabase + LocalStorage)
async function saveScoreForSong(songKey, newScore, rankName, wpm) {
  let playerName = "Anônimo";
  let userId = null;

  // Identifica se o jogador está autenticado
  if (typeof currentUser !== "undefined" && currentUser) {
    userId = currentUser.id;
    playerName = currentUser.user_metadata?.display_name || currentUser.email.split("@")[0];
  } else {
    // Solicita o nome para convidados
    const inputName = prompt("Sua pontuação vai para o Ranking Global! Digite seu Nick:", "Convidado");
    playerName = inputName && inputName.trim() !== "" ? inputName.trim().substring(0, 15) : "Convidado";
  }

  let savedOnRemote = false;

  // Tentativa de gravação no Supabase
  if (typeof _supabase !== "undefined" && _supabase) {
    try {
      const { error } = await _supabase.from("leaderboard").insert([
        {
          user_id: userId,
          player: playerName,
          score: Math.round(newScore),
          rank: rankName,
          wpm: Math.round(wpm),
          song_key: songKey
        }
      ]);

      if (error) {
        console.error("Erro ao salvar no Supabase (verifique as políticas RLS):", error.message);
      } else {
        savedOnRemote = true;
      }
    } catch (err) {
      console.error("Erro inesperado ao salvar ponto:", err);
    }
  }

  // Gravação no LocalStorage (sempre mantém cópia local)
  const allScores = JSON.parse(localStorage.getItem("typing_game_leaderboards")) || {};
  if (!allScores[songKey]) allScores[songKey] = [];

  allScores[songKey].push({
    player: playerName,
    score: Math.round(newScore),
    rank: rankName,
    wpm: Math.round(wpm),
    date: new Date().toLocaleDateString("pt-BR")
  });

  allScores[songKey].sort((a, b) => b.score - a.score);
  allScores[songKey] = allScores[songKey].slice(0, 10);
  localStorage.setItem("typing_game_leaderboards", JSON.stringify(allScores));

  // Recarrega a tabela imediatamente na tela
  await renderLeaderboard(songKey);
}

// 4. Renderiza a tabela de pontuações na tela
async function renderLeaderboard(songKey) {
  const container = createLeaderboardUI();
  if (!container) return;

  // Exibe feedback visual de carregamento
  container.innerHTML = `<div class="leaderboard-loading">Carregando classificação...</div>`;

  const scores = await fetchScoresForSong(songKey);
  const songTitle = typeof MUSIC_LIBRARY !== "undefined" && MUSIC_LIBRARY[songKey]
    ? MUSIC_LIBRARY[songKey].title
    : songKey;

  if (!scores || scores.length === 0) {
    container.innerHTML = `
      <div class="leaderboard-title">🏆 Top Placar: ${songTitle}</div>
      <div class="empty-board">Nenhuma pontuação registrada para esta música. Seja o primeiro!</div>
    `;
    return;
  }

  let rowsHtml = scores.map((item, index) => {
    const isTopThree = index < 3 ? `top-${index + 1}` : '';
    return `
      <tr class="${isTopThree}">
        <td>#${index + 1}</td>
        <td><strong>${escapeHtml(item.player)}</strong></td>
        <td><span class="rank-badge rank-${item.rank}">${item.rank}</span></td>
        <td>${item.wpm} WPM</td>
        <td><strong>${Number(item.score).toLocaleString('pt-BR')} pts</strong></td>
      </tr>
    `;
  }).join("");

  container.innerHTML = `
    <div class="leaderboard-title">🏆 Top Placar: ${songTitle}</div>
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

// Auxiliar para evitar injeção de HTML nos nomes dos jogadores
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// 5. Inicialização e Event Listeners
document.addEventListener("DOMContentLoaded", () => {
  const songSelect = document.getElementById("songSelect");

  if (songSelect) {
    // Carrega o ranking da música inicialmente selecionada
    if (songSelect.value) {
      renderLeaderboard(songSelect.value);
    }

    // Atualiza o ranking sempre que a música/dificuldade mudar no seletor
    songSelect.addEventListener("change", (e) => {
      renderLeaderboard(e.target.value);
    });
  }
});
