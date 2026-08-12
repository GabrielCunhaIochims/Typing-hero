
const menuMusic = document.getElementById("menuMusic");
const gameMusic = document.getElementById("gameMusic");

const BASE_VOLUME = 0.3;
const MAX_VOLUME = 1.0;

if (menuMusic) menuMusic.volume = BASE_VOLUME;
if (gameMusic) gameMusic.volume = BASE_VOLUME;

function fadeAudioVolume(audioElement, targetVolume, duration) {
  if (!audioElement) return;
  const step = 0.05;
  const intervalTime = duration / ((Math.abs(targetVolume - audioElement.volume)) / step);
  
  let fadeInterval = setInterval(() => {
    if (audioElement.volume < targetVolume) {
      audioElement.volume = Math.min(targetVolume, audioElement.volume + step);
    } else if (audioElement.volume > targetVolume) {
      audioElement.volume = Math.max(targetVolume, audioElement.volume - step);
    }

    if (Math.abs(audioElement.volume - targetVolume) < 0.01) {
      clearInterval(fadeInterval);
    }
  }, intervalTime);
}

function playMenuMusic() {
  if (!menuMusic || !gameMusic) return;
  gameMusic.pause();
  gameMusic.currentTime = 0;
  menuMusic.play().catch(e => console.log("Aguardando interação"));
}

function playGameMusic() {
  if (!menuMusic || !gameMusic) return;
  menuMusic.pause();
  menuMusic.currentTime = 0;
  gameMusic.play().catch(e => console.log("Erro áudio:", e));
}

window.addEventListener("click", function initMenuAudioOnFirstClick() {
  if (menuMusic && menuMusic.paused && typeof gameActive !== "undefined" && !gameActive) {
    playMenuMusic();
  }
  window.removeEventListener("click", initMenuAudioOnFirstClick);
});

let audioCtx = null;

function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
}

function playSuccessSound(pitchBoost = 0) {
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = "sine";
  const baseFreq = 520 + (pitchBoost * 35);
  osc.frequency.setValueAtTime(baseFreq, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.3, audioCtx.currentTime + 0.05);

  gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start();
  osc.stop(audioCtx.currentTime + 0.05);
}

function playErrorSound() {
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(180, audioCtx.currentTime);
  osc.frequency.linearRampToValueAtTime(60, audioCtx.currentTime + 0.12);

  gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.12);

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start();
  osc.stop(audioCtx.currentTime + 0.12);
}

function playRankUpSound(rankIndex) {
  if (!audioCtx) return;

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = rankIndex >= 4 ? "triangle" : "sine";
  const startFreq = 300 + (rankIndex * 120);
  const endFreq = startFreq * 2.2;

  osc.frequency.setValueAtTime(startFreq, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(endFreq, audioCtx.currentTime + 0.4);

  gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.6);

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start();
  osc.stop(audioCtx.currentTime + 0.6);
}