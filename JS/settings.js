const settingsModal = document.getElementById('settingsOverlay');
const settingsBtn = document.getElementById('settingsModalBtn');
const closeSettingsBtn = document.getElementById('closeSettingsModalBtn');

const cfgCleanFont = document.getElementById('cfgCleanFont');
const cfgDisableBlink = document.getElementById('cfgDisableBlink');
const cfgDisableGlow = document.getElementById('cfgDisableGlow');
const cfgScreenShake = document.getElementById('cfgScreenShake');
const cfgHighContrast = document.getElementById('cfgHighContrast');

settingsBtn?.addEventListener('click', () => settingsModal?.classList.add('active'));
closeSettingsBtn?.addEventListener('click', () => settingsModal?.classList.remove('active'));

settingsModal?.addEventListener('click', (e) => {
  if (e.target === settingsModal) {
    settingsModal.classList.remove('active');
  }
});

function applyPreferences() {
  const cleanFont = localStorage.getItem('cfgCleanFont') === 'true';
  const disableBlink = localStorage.getItem('cfgDisableBlink') === 'true';
  const disableGlow = localStorage.getItem('cfgDisableGlow') === 'true';
  const screenShake = localStorage.getItem('cfgScreenShake') !== 'false';
  const highContrast = localStorage.getItem('cfgHighContrast') === 'true';

  document.body.classList.toggle('clean-font', cleanFont);
  document.body.classList.toggle('disable-blink', disableBlink);
  document.body.classList.toggle('disable-glow', disableGlow);
  document.body.classList.toggle('no-shake', !screenShake);
  document.body.classList.toggle('high-contrast', highContrast);

  if (cfgCleanFont) cfgCleanFont.checked = cleanFont;
  if (cfgDisableBlink) cfgDisableBlink.checked = disableBlink;
  if (cfgDisableGlow) cfgDisableGlow.checked = disableGlow;
  if (cfgScreenShake) cfgScreenShake.checked = screenShake;
  if (cfgHighContrast) cfgHighContrast.checked = highContrast;
}

cfgCleanFont?.addEventListener('change', (e) => {
  localStorage.setItem('cfgCleanFont', e.target.checked);
  applyPreferences();
});

cfgDisableBlink?.addEventListener('change', (e) => {
  localStorage.setItem('cfgDisableBlink', e.target.checked);
  applyPreferences();
});

cfgDisableGlow?.addEventListener('change', (e) => {
  localStorage.setItem('cfgDisableGlow', e.target.checked);
  applyPreferences();
});

cfgScreenShake?.addEventListener('change', (e) => {
  localStorage.setItem('cfgScreenShake', e.target.checked);
  applyPreferences();
});

cfgHighContrast?.addEventListener('change', (e) => {
  localStorage.setItem('cfgHighContrast', e.target.checked);
  applyPreferences();
});

let currentFontSize = parseFloat(localStorage.getItem('typingFontSize')) || 1.25;

const baseFontSize = 1.25;

function updateFontSize(size) {
  
  currentFontSize = Math.min(Math.max(size, 1.0), 2.2);

  document.documentElement.style.setProperty('--typing-font-size', `${currentFontSize}rem`);
  localStorage.setItem('typingFontSize', currentFontSize);

  const resetBtn = document.getElementById('btnResetFont');
  if (resetBtn) {
    const percentage = Math.round((currentFontSize / baseFontSize) * 100);
    resetBtn.textContent = `${percentage}%`;
  }
}

document.getElementById('btnIncreaseFont')?.addEventListener('click', () => updateFontSize(currentFontSize + 0.2));
document.getElementById('btnDecreaseFont')?.addEventListener('click', () => updateFontSize(currentFontSize - 0.2));
document.getElementById('btnResetFont')?.addEventListener('click', () => updateFontSize(baseFontSize));

document.addEventListener("DOMContentLoaded", () => {
  applyPreferences();
  updateFontSize(currentFontSize);

  const songSelect = document.getElementById("songSelect");
  if (songSelect) {
    if (songSelect.value) {
      renderLeaderboard(songSelect.value, currentLeaderboardMetric);
      updateUserPBDisplay(songSelect.value);
    }

    songSelect.addEventListener("change", (e) => {
      renderLeaderboard(e.target.value, currentLeaderboardMetric);
      updateUserPBDisplay(e.target.value);
    });
  }
});
