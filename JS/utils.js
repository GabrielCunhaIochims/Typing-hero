async function sha256(str) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
}

function escapeHtml(text) {
  if (!text) return "";
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function showNotification(message, isError = true) {
  const existing = document.querySelector(".game-toast");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.className = "game-toast";
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%) translateY(100px);
    background: ${isError ? "rgba(255,0,80,0.9)" : "rgba(0,255,150,0.9)"};
    color: #fff; padding: 14px 28px; border-radius: 8px; font-weight: bold;
    z-index: 99999; transition: transform 0.3s ease; pointer-events: none;
    box-shadow: 0 4px 20px rgba(0,0,0,0.4);
  `;
  document.body.appendChild(toast);
  requestAnimationFrame(() => {
    toast.style.transform = "translateX(-50%) translateY(0)";
  });
  setTimeout(() => {
    toast.style.transform = "translateX(-50%) translateY(100px)";
  }, 3500);
  setTimeout(() => toast.remove(), 4000);
}

function getLoggedUser() {
  const storedUser =
    localStorage.getItem("currentUser") ||
    localStorage.getItem("user") ||
    localStorage.getItem("usuario") ||
    localStorage.getItem("logged_in_user");

  if (storedUser) {
    try {
      const parsed = JSON.parse(storedUser);
      if (typeof parsed === "object" && parsed !== null) return parsed;
      return { username: String(parsed) };
    } catch (e) {
      return { username: storedUser };
    }
  }

  const navUserEl = document.querySelector(".user-name, #userName, .profile-name, .user-info, header span");
  if (navUserEl && navUserEl.textContent.trim() !== "") {
    return { username: navUserEl.textContent.trim() };
  }

  const hasLogoutBtn = Array.from(document.querySelectorAll("button, a")).some(el => {
    const txt = el.textContent.trim().toUpperCase();
    return txt === "SAIR" || txt === "LOGOUT";
  });

  if (hasLogoutBtn) return { username: "INFAMOS" };
  return null;
}
