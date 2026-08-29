// Estado global para controlar o critério de ordenação atual ('score' ou 'wpm')
let currentLeaderboardMetric = 'score';

// 1. Cria ou obtém o container do Leaderboard na DOM
// 1. Cria ou obtém o container do Leaderboard na DOM
function createLeaderboardUI() {
  let boardContainer = document.getElementById("leaderboardContainer");
  const mainContainer = document.querySelector(".song-selector-container");

  if (!boardContainer && mainContainer) {
    boardContainer = document.createElement("div");
    boardContainer.id = "leaderboardContainer";
    boardContainer.className = "leaderboard-section";
    
    // Anexa o leaderboard como segundo filho do container principal (ao lado da coluna esquerda)
    mainContainer.appendChild(boardContainer);
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

// 3. Busca as pontuações (Ordena por Pontos ou WPM no Supabase/LocalStorage)
async function fetchScoresForSong(songKey, metric = 'score') {
  let remoteScores = null;

  try {
    if (typeof _supabase !== "undefined" && _supabase) {
      const { data, error } = await _supabase
        .from("leaderboard")
        .select("*")
        .eq("song_key", songKey)
        .order(metric, { ascending: false })
        .limit(50); // <--- Aumentado para 50 resultados

      if (!error && data) remoteScores = data;
    }
  } catch (e) {
    console.error("Erro na conexão com Supabase:", e);
  }

  if (remoteScores && remoteScores.length > 0) return remoteScores;

  const allScores = JSON.parse(localStorage.getItem("typing_game_leaderboards")) || {};
  const localScores = allScores[songKey] || [];
  return localScores.sort((a, b) => (b[metric] || 0) - (a[metric] || 0)).slice(0, 50);
}
// 4. Salva a pontuação (Atualiza se bater o recorde de PONTOS OU WPM)
async function saveScoreForSong(songKey, newScore, rankName, wpm) {
  const parsedScore = Math.round(Number(newScore) || 0);
  const parsedWpm = Math.round(Number(wpm) || 0);

  if (parsedScore <= 0) return; // Ignora pontuações zeradas

  // 🔒 Apenas usuários logados podem salvar
  if (typeof currentUser === "undefined" || !currentUser) {
    console.warn("Pontuação não salva: Apenas usuários logados podem entrar na leaderboard.");
    return;
  }

  const userId = currentUser.id;
  const playerName = currentUser.user_metadata?.display_name || 
                     currentUser.email?.split("@")[0] || 
                     "Jogador";

  let recordUpdated = false;

  // A. Operações no Supabase
  if (typeof _supabase !== "undefined" && _supabase) {
    try {
      const { data: existingRecord, error: selectError } = await _supabase
        .from("leaderboard")
        .select("id, score, wpm")
        .eq("user_id", userId)
        .eq("song_key", songKey)
        .maybeSingle();

      if (selectError) {
        console.error("Erro ao consultar registro existente:", selectError.message);
      } else if (existingRecord) {
        // Atualiza se superou O PONTO OU O WPM anterior
        const isBetterScore = parsedScore > existingRecord.score;
        const isBetterWpm = parsedWpm > existingRecord.wpm;

        if (isBetterScore || isBetterWpm) {
          const updatePayload = {
            rank: rankName,
            player: playerName,
            // Mantém o maior valor de cada um caso melhore individualmente
            score: Math.max(parsedScore, existingRecord.score),
            wpm: Math.max(parsedWpm, existingRecord.wpm)
          };

          const { error: updateError } = await _supabase
            .from("leaderboard")
            .update(updatePayload)
            .eq("id", existingRecord.id);

          if (!updateError) {
            recordUpdated = true;
            console.log("🔥 Recorde atualizado no Supabase!");
          } else {
            console.error("Erro ao atualizar recorde no Supabase:", updateError.message);
          }
        }
      } else {
        // Primeiro registro do usuário nesta música
        const { error: insertError } = await _supabase
          .from("leaderboard")
          .insert([
            {
              user_id: userId,
              player: playerName,
              score: parsedScore,
              rank: rankName,
              wpm: parsedWpm,
              song_key: songKey
            }
          ]);

        if (!insertError) {
          recordUpdated = true;
          console.log("🎯 Primeiros pontos registrados para esta música!");
        } else {
          console.error("Erro ao gravar novo ranking no Supabase:", insertError.message);
        }
      }
    } catch (err) {
      console.error("Erro inesperado ao salvar no Supabase:", err);
    }
  }

  // B. Atualiza LocalStorage e a Tabela na Tela
  if (recordUpdated) {
    const allScores = JSON.parse(localStorage.getItem("typing_game_leaderboards")) || {};
    if (!allScores[songKey]) allScores[songKey] = [];

    const existingIndex = allScores[songKey].findIndex(item => item.player === playerName);

    const newEntry = {
      player: playerName,
      score: parsedScore,
      rank: rankName,
      wpm: parsedWpm,
      date: new Date().toLocaleDateString("pt-BR")
    };

    if (existingIndex !== -1) {
      // Atualiza mantendo os maiores valores
      const prev = allScores[songKey][existingIndex];
      allScores[songKey][existingIndex] = {
        ...newEntry,
        score: Math.max(parsedScore, prev.score || 0),
        wpm: Math.max(parsedWpm, prev.wpm || 0)
      };
    } else {
      allScores[songKey].push(newEntry);
    }

    localStorage.setItem("typing_game_leaderboards", JSON.stringify(allScores));

    // Recarrega a tabela respeitando o filtro atual
    await renderLeaderboard(songKey, currentLeaderboardMetric);
  }
}

// 5. Renderiza o Ranking na tela com controles de alternância e container com Scroll
async function renderLeaderboard(songKey, metric = currentLeaderboardMetric) {
  currentLeaderboardMetric = metric;
  const container = createLeaderboardUI();
  if (!container) return;

  const songTitle = typeof MUSIC_LIBRARY !== "undefined" && MUSIC_LIBRARY[songKey]
    ? MUSIC_LIBRARY[songKey].title
    : songKey;

  const tabsHtml = `
    <div class="leaderboard-header">
      <div class="leaderboard-title">🏆 TOP PLACAR: ${escapeHtml(songTitle)}</div>
      <div class="leaderboard-toggle-buttons">
        <button 
          onclick="changeLeaderboardMetric('${songKey}', 'score')" 
          class="lb-btn ${metric === 'score' ? 'active' : ''}"
        >
          Pontos
        </button>
        <button 
          onclick="changeLeaderboardMetric('${songKey}', 'wpm')" 
          class="lb-btn ${metric === 'wpm' ? 'active' : ''}"
        >
          WPM
        </button>
      </div>
    </div>
  `;

  container.innerHTML = `${tabsHtml}<div class="leaderboard-loading" style="padding: 10px; color: #888;">Carregando ranking...</div>`;

  const scores = await fetchScoresForSong(songKey, metric);

  if (!scores || scores.length === 0) {
    container.innerHTML = `
      ${tabsHtml}
      <div class="empty-board" style="padding: 15px; text-align: center; color: #888;">
        Nenhuma pontuação registrada. Seja o primeiro!
      </div>
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
        <td style="${metric === 'wpm' ? 'color: #00ffcc; font-weight: bold;' : ''}">${safeWpm} WPM</td>
        <td style="${metric === 'score' ? 'color: #00ffcc; font-weight: bold;' : ''}">${safeScore} pts</td>
      </tr>
    `;
  }).join("");

  // max-height de 180px força a rolagem aparecer mesmo com poucas linhas
  container.innerHTML = `
    ${tabsHtml}
    <div class="leaderboard-table-wrapper" style="max-height: 180px; overflow-y: scroll; overflow-x: hidden;">
      <table class="leaderboard-table">
        <thead>
          <tr>
            <th>#</th>
            <th>JOGADOR</th>
            <th>RANK</th>
            <th>WPM ${metric === 'wpm' ? '▼' : ''}</th>
            <th>PONTOS ${metric === 'score' ? '▼' : ''}</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>
    </div>
  `;
}

// 6. Função global acionada ao clicar nos botões de Pontos/WPM
window.changeLeaderboardMetric = function(songKey, metric) {
  renderLeaderboard(songKey, metric);
};

// 7. Event Listeners para recarregar ao trocar de música
document.addEventListener("DOMContentLoaded", () => {
  const songSelect = document.getElementById("songSelect");

  if (songSelect) {
    if (songSelect.value) {
      renderLeaderboard(songSelect.value, currentLeaderboardMetric);
    }

    songSelect.addEventListener("change", (e) => {
      renderLeaderboard(e.target.value, currentLeaderboardMetric);
    });
  }
});
