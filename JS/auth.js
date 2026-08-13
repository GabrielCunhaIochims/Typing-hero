// JS/auth.js

let currentUser = null;

// 1. Alterna entre as abas 'login' e 'register'
function switchTab(tab) {
  const formLogin = document.getElementById('formLogin');
  const formRegister = document.getElementById('formRegister');
  const tabLogin = document.getElementById('tabLogin');
  const tabRegister = document.getElementById('tabRegister');

  if (!formLogin || !formRegister) return;

  // Limpa mensagens
  document.getElementById('loginError').textContent = '';
  document.getElementById('regError').textContent = '';
  document.getElementById('regSuccess').textContent = '';

  if (tab === 'login') {
    formLogin.classList.add('active');
    formRegister.classList.remove('active');
    tabLogin.classList.add('active');
    tabRegister.classList.remove('active');
  } else {
    formRegister.classList.add('active');
    formLogin.classList.remove('active');
    tabRegister.classList.add('active');
    tabLogin.classList.remove('active');
  }
}

// 2. Manipula o formulário de Login
async function handleLogin(event) {
  event.preventDefault();

  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  const errorMsg = document.getElementById('loginError');
  const btnLogin = document.getElementById('btnLogin');

  errorMsg.textContent = '';
  btnLogin.disabled = true;
  btnLogin.textContent = 'CARREGANDO...';

  try {
    const { data, error } = await _supabase.auth.signInWithPassword({
      email: email,
      password: password
    });

    if (error) throw error;

    // Entra no jogo
    window.location.href = 'index.html';
  } catch (err) {
    errorMsg.textContent = translateError(err.message);
  } finally {
    btnLogin.disabled = false;
    btnLogin.textContent = 'ENTRAR NO JOGO';
  }
}

// 3. Manipula o formulário de Cadastro
async function handleRegister(event) {
  event.preventDefault();

  const name = document.getElementById('regName').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const password = document.getElementById('regPassword').value;
  const errorMsg = document.getElementById('regError');
  const successMsg = document.getElementById('regSuccess');
  const btnRegister = document.getElementById('btnRegister');

  errorMsg.textContent = '';
  successMsg.textContent = '';
  btnRegister.disabled = true;
  btnRegister.textContent = 'CRIANDO CONTA...';

  try {
    const { data, error } = await _supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          display_name: name
        }
      }
    });

    if (error) throw error;

    // Se o usuário já tiver uma sessão ativa (confirmação de email desativada)
    if (data.session) {
      window.location.href = 'index.html';
    } else {
      // Se a confirmação por e-mail estiver ativa no Supabase
      successMsg.textContent = 'Conta criada! Verifique seu e-mail para confirmar a conta antes de entrar.';
      document.getElementById('formRegister').reset();
    }
  } catch (err) {
    errorMsg.textContent = translateError(err.message);
  } finally {
    btnRegister.disabled = false;
    btnRegister.textContent = 'CRIAR CONTA';
  }
}

// 4. Verifica a sessão atual (usado nas páginas do jogo)
async function checkUserSession() {
  const userInfo = document.getElementById('userInfo');
  const authActionBtn = document.getElementById('authActionBtn');

  try {
    const { data: { user }, error } = await _supabase.auth.getUser();

    if (error) throw error;

    if (user) {
      currentUser = user;
      const nick = user.user_metadata?.display_name || user.email.split('@')[0];

      if (userInfo) userInfo.textContent = `🎮 ${nick}`;
      if (authActionBtn) {
        authActionBtn.textContent = 'Sair';
        authActionBtn.href = '#';
        authActionBtn.onclick = async (e) => {
          e.preventDefault();
          await _supabase.auth.signOut();
          window.location.reload();
        };
      }
    } else {
      setGuestUI(userInfo, authActionBtn);
    }
  } catch (err) {
    setGuestUI(userInfo, authActionBtn);
  }
}

// Auxiliar para reset de convidado
function setGuestUI(userInfo, authActionBtn) {
  currentUser = null;
  if (userInfo) userInfo.textContent = '👤 Convidado';
  if (authActionBtn) {
    authActionBtn.innerHTML = '<span>Entrar / Cadastrar</span>';
    authActionBtn.href = 'auth.html';
    authActionBtn.onclick = null;
  }
}

// Tradutor de erros em inglês do Supabase
function translateError(message) {
  if (message.includes('Invalid login credentials')) return 'E-mail ou senha incorretos.';
  if (message.includes('User already registered')) return 'Este e-mail já está cadastrado.';
  if (message.includes('Password should be at least')) return 'A senha deve ter no mínimo 6 caracteres.';
  return message;
}

document.addEventListener('DOMContentLoaded', checkUserSession);
