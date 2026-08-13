

let currentUser = null;

async function checkUserSession() {
  const userInfo = document.getElementById("userInfo");
  const authActionBtn = document.getElementById("authActionBtn");

  try {
    const { data: { user }, error } = await _supabase.auth.getUser();

    if (error) throw error;

    if (user) {
      currentUser = user;
      const nick = user.user_metadata?.display_name || user.email.split('@')[0];

      if (userInfo) userInfo.textContent = `🎮 ${nick}`;
      if (authActionBtn) {
        authActionBtn.textContent = "Sair";
        authActionBtn.href = "#";
        authActionBtn.onclick = async (e) => {
          e.preventDefault();
          await _supabase.auth.signOut();
          window.location.reload();
        };
      }
    } else {
      currentUser = null;
      if (userInfo) userInfo.textContent = "👤 Convidado";
      if (authActionBtn) {
        authActionBtn.innerHTML = "<span>Entrar / Cadastrar</span>";
        authActionBtn.href = "auth.html";
        authActionBtn.onclick = null;
      }
    }
  } catch (err) {
    console.error("Erro na verificação de sessão:", err);
    if (userInfo) userInfo.textContent = "👤 Convidado";
  }
}

document.addEventListener("DOMContentLoaded", checkUserSession);
