document.addEventListener("DOMContentLoaded", () => {

  const bugReportBtn = document.getElementById("bugReportBtn");
  const bugReportOverlay = document.getElementById("bugReportOverlay");
  const closeBugModalBtn = document.getElementById("closeBugModalBtn");
  const bugReportForm = document.getElementById("bugReportForm");
  const bugFeedbackMsg = document.getElementById("bugFeedbackMsg");

  if (bugReportBtn && bugReportOverlay) {
    bugReportBtn.addEventListener("click", () => {
      bugReportOverlay.classList.add("active");
    });
  }

  window.closeBugModal = function() {
    if (bugReportOverlay) {
      bugReportOverlay.classList.remove("active");
    }
  }

  if (closeBugModalBtn) {
    closeBugModalBtn.addEventListener("click", closeBugModal);
  }

  if (bugReportForm) {
    bugReportForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const { data: { user }, error: userError } = await _supabase.auth.getUser();
      
      if (userError || !user) {
        if (bugFeedbackMsg) {
          bugFeedbackMsg.textContent = "Sessão expirada. Faça login para reportar.";
          bugFeedbackMsg.style.color = "#ff0066";
        }
        if (typeof showNotification === "function") showNotification("Sessão expirada. Faça login novamente.", true);
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

      if (bugFeedbackMsg) {
        bugFeedbackMsg.textContent = "Enviando relatório...";
        bugFeedbackMsg.style.color = "#00ffcc";
      }

      const currentSong = typeof currentSongKey !== "undefined" ? currentSongKey : "Nenhuma";

      try {
        const { data, error } = await _supabase.functions.invoke('send-bug-report', {
          body: {
            category: category,
            description: description,
            currentSong: currentSong
          }
        });

        if (error) throw error;

        if (bugFeedbackMsg) {
          bugFeedbackMsg.textContent = "✓ Relatório enviado ao Discord com sucesso!";
          bugFeedbackMsg.className = "bug-feedback-msg success";
        }
        bugReportForm.reset();
        setTimeout(closeBugModal, 1500);

      } catch (error) {
        console.error("Erro ao enviar o bug:", error);
        if (bugFeedbackMsg) {
          bugFeedbackMsg.textContent = "Erro ao enviar o relato. Tente novamente.";
          bugFeedbackMsg.style.color = "#ff0066";
        }
      }
    });
  }

  const newsList = document.getElementById("newsList");
  const newsModalBtn = document.getElementById("newsModalBtn");
  const newsOverlay = document.getElementById("newsOverlay");
  const closeNewsModalBtn = document.getElementById("closeNewsModalBtn");
  const adminPostForm = document.getElementById("adminPostForm");
  const passwordOverlay = document.getElementById("passwordOverlay");
  const adminOverlay = document.getElementById("adminOverlay");
  const closePasswordModalBtn = document.getElementById("closePasswordModalBtn");
  const closeAdminModalBtn = document.getElementById("closeAdminModalBtn");
  const adminPasswordInput = document.getElementById("adminPasswordInput");
  const submitPasswordBtn = document.getElementById("submitPasswordBtn");

  const getSupabaseClient = () => {
    let client = (typeof supabase !== "undefined" ? supabase : null) || 
                 (typeof window._supabase !== "undefined" ? window._supabase : null);
    if (!client) return null;
    if (typeof client.from === "function") return client;
    if (typeof client.createClient === "function" && typeof SUPABASE_URL !== "undefined" && typeof SUPABASE_ANON_KEY !== "undefined") {
      if (!window._supabaseInstance) {
        window._supabaseInstance = client.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      }
      return window._supabaseInstance;
    }
    return null;
  };

  let announcements = window.announcements || [];

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
      console.error("Erro ao carregar anúncios:", err.message || err);
      return [];
    }
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
            <button data-id="${post.id}" class="delete-news-btn" title="Excluir mensagem" style="position: absolute; top: 10px; right: 10px; background: transparent; border: none; color: #ff0066; cursor: pointer; font-size: 1.1rem; font-weight: bold;">✕</button>
          ` : ''}
          <h4>${typeof escapeHtml === "function" ? escapeHtml(post.title) : post.title}</h4>
          <p>${typeof escapeHtml === "function" ? escapeHtml(post.content) : post.content}</p>
          <span class="news-date" style="display: block; margin-top: 8px; font-size: 0.75rem; color: #aaa;">📅 ${formattedDate}</span>
        </div>
      `;
    }).join("");
  }

  async function loadAndRenderAnnouncements() {
    announcements = await fetchAnnouncements();
    renderAnnouncements();
    checkUnreadNews();
  }

  if (newsList) {
    newsList.addEventListener("click", async (e) => {
      const deleteBtn = e.target.closest(".delete-news-btn");
      if (!deleteBtn) return;
      const id = deleteBtn.dataset.id;
      if (!id || !confirm("Tem certeza que deseja excluir esta mensagem do banco de dados?")) return;

      try {
        const client = getSupabaseClient();
        if (!client) throw new Error("Cliente Supabase não encontrado.");
        const { error } = await client.from("announcements").delete().eq("id", id);
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
      const titleInput = document.getElementById("postTitleInput");
      const contentInput = document.getElementById("postContentInput");
      const title = titleInput ? titleInput.value.trim() : "";
      const content = contentInput ? contentInput.value.trim() : "";

      if (!title || !content) {
        if (typeof showNotification === "function") showNotification("Preencha o título e o conteúdo!", true);
        return;
      }

      try {
        const client = getSupabaseClient();
        if (!client) throw new Error("Cliente Supabase não encontrado.");
        const { error } = await client.from("announcements").insert([{ title, content }]);
        if (error) throw error;
        adminPostForm.reset();
        if (adminOverlay) adminOverlay.classList.remove("active");
        if (typeof showNotification === "function") showNotification("Atualização publicada com sucesso!", false);
        await loadAndRenderAnnouncements();
      } catch (err) {
        console.error("Erro detalhado ao inserir anúncio:", err);
        alert(`Erro no Supabase: ${err.message || err.details || "Não foi possível salvar a mensagem."}`);
      }
    });
  }

  window.addEventListener("keydown", async (e) => {
    const activeElement = document.activeElement;
    const isTyping = activeElement && (activeElement.tagName === "INPUT" || activeElement.tagName === "TEXTAREA" || activeElement.tagName === "SELECT");
    if (isTyping) return;

    if (e.shiftKey && (e.key === "A" || e.key === "a")) {
      const { data: { user }, error } = await _supabase.auth.getUser();
      if (error || !user) {
        if (typeof showNotification === "function") showNotification("Acesso negado. Faça login para continuar.", true);
        return;
      }
      const displayName = user.user_metadata?.display_name || "";
      if (displayName.trim().toUpperCase() !== "INFAMOS") {
        if (typeof showNotification === "function") showNotification("Acesso negado. Apenas o Infamos pode acessar este painel.", true);
        return;
      }
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
    let user = typeof currentUser !== "undefined" ? currentUser : null;
    if (!user) {
      const { data } = await _supabase.auth.getUser();
      user = data?.user;
    }
    const displayName = user?.user_metadata?.display_name || "";
    if (!user || displayName.trim().toUpperCase() !== "INFAMOS") {
      if (typeof showNotification === "function") showNotification("Acesso negado.", true);
      if (passwordOverlay) passwordOverlay.classList.remove("active");
      return;
    }

    if (!adminPasswordInput) return;
    const typedPassword = adminPasswordInput.value;
    const hash = typeof sha256 === "function" ? await sha256(typedPassword) : typedPassword;

    if (hash === (typeof ADMIN_PASSWORD_HASH !== "undefined" ? ADMIN_PASSWORD_HASH : "")) {
      if (passwordOverlay) passwordOverlay.classList.remove("active");
      if (adminOverlay) adminOverlay.classList.add("active");
    } else {
      if (typeof showNotification === "function") showNotification("Senha incorreta!", true);
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

  loadAndRenderAnnouncements();
});
