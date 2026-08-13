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
  
  // Busca as pontuações (Supabase + Fallback LocalStorage)
  async function fetchScoresForSong(songKey) {
    try {
      if (typeof _supabase !== "undefined") {
        const { data, error } = await _supabase
          .from('leaderboard')
          .select('*')
          .eq('song_key', songKey)
          .order('score', { ascending: false })
          .limit(10);
  
        if (!error && data && data.length > 0) {
          return data;
        }
      }
      const allScores = JSON.parse(localStorage.getItem("typing_game_leaderboards")) || {};
      return allScores[songKey] || [];
    } catch (e) {
      console.error("Erro ao buscar scores:", e);
      return [];
    }
  }
  
  // Salva a pontuação no banco do Supabase e no LocalStorage
  // Salva a pontuação no banco do Supabase e atualiza o ranking
async function saveScoreForSong(songKey, newScore, rankName, wpm) {
  let playerName = "Anônimo";
  let userId = null;

  // Usa currentUser se existir (declarado no auth.js)
  if (typeof currentUser !== "undefined" && currentUser) {
    userId = currentUser.id;
    playerName = currentUser.user_metadata?.display_name || currentUser.email.split('@')[0];
  } else {
    playerName = prompt("Digite seu nome para o ranking:", "Jogador") || "Anônimo";
  }

  let savedInSupabase = false;

  if (typeof _supabase !== "undefined") {
    const { data, error } = await _supabase
      .from('leaderboard')
      .insert([
        { 
          user_id: userId, 
          player: playerName, 
          score: newScore, 
          rank: rankName, 
          wpm: wpm, 
          song_key: songKey 
        }
      ]);

    if (error) {
      console.error("Erro RLS/Supabase ao salvar ranking:", error.message);
    } else {
      savedInSupabase = true;
    }
  }

  // Backup no LocalStorage apenas se o Supabase não responder
  if (!savedInSupabase) {
    const allScores = JSON.parse(localStorage.getItem("typing_game_leaderboards")) || {};
    if (!allScores[songKey]) allScores[songKey] = [];
    allScores[songKey].push({ player: playerName, score: newScore, rank: rankName, wpm: wpm, date: new Date().toLocaleDateString() });
    allScores[songKey].sort((a, b) => b.score - a.score);
    allScores[songKey] = allScores[songKey].slice(0, 10);
    localStorage.setItem("typing_game_leaderboards", JSON.stringify(allScores));
  }

  // Re-renderiza a tabela atualizada
  renderLeaderboard(songKey);
}
  
    // Backup no LocalStorage
    const allScores = JSON.parse(localStorage.getItem("typing_game_leaderboards")) || {};
    if (!allScores[songKey]) allScores[songKey] = [];
    allScores[songKey].push({ player: playerName, score: newScore, rank: rankName, wpm: wpm, date: new Date().toLocaleDateString() });
    allScores[songKey].sort((a, b) => b.score - a.score);
    allScores[songKey] = allScores[songKey].slice(0, 10);
    localStorage.setItem("typing_game_leaderboards", JSON.stringify(allScores));
  
    renderLeaderboard(songKey);
  }
  
  // Renderiza a Tabela de Pontuações na Tela
  async function renderLeaderboard(songKey) {
    const container = createLeaderboardUI();
    if (!container) return;
  
    const scores = await fetchScoresForSong(songKey);
    const songTitle = typeof MUSIC_LIBRARY !== "undefined" && MUSIC_LIBRARY[songKey] ? MUSIC_LIBRARY[songKey].title : songKey;
  
    if (scores.length === 0) {
      container.innerHTML = `
        <div class="leaderboard-title">🏆 Ranking: ${songTitle}</div>
        <div class="empty-board">Nenhuma pontuação registrada para esta faixa. Seja o primeiro!</div>
      `;
      return;
    }
  
    let rowsHtml = scores.map((item, index) => `
      <tr>
        <td>#${index + 1}</td>
        <td>${item.player}</td>
        <td><span style="color:#ffcc00">${item.rank}</span></td>
        <td>${item.wpm}</td>
        <td><strong>${item.score.toLocaleString()} pts</strong></td>
      </tr>
    `).join("");
  
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
