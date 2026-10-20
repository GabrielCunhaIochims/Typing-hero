const MUSIC_LIBRARY = {
  "9_circles_of_hell": {
    sectionName: "Infernal Descent",
    tracks: {
      "limbo": {
        title: "Limbo Echoes",
        url: "musicas/Limbo Echoes.mp3",
        multiplier: 1.0,
        phrases: [
          "A névoa esconde o abismo, mas a batida ecoa nas profundezas.",
          "O Primeiro Círculo sussurra a promessa da dor eterna.",
          "Sem esperança, mas com o ritmo gravado na alma dos esquecidos.",
          "A pulsação do inferno ressoa na penumbra dos filósofos.",
          "Sinta o pulso sombrio antes de despencar no abismo de fogo.",
          "Um lugar sem salvação, onde o tempo é ditado pela frequência do caos.",
          "A luz da razão se apaga na batida do inferno.",
          "Suspiros sem lamento ecoam pelos prados da eternidade.",
          "Passos lentos sobre a penumbra de uma paz ilusória."
        ]
      },
      "lust": {
        title: "Winds of Francesca WIP",
        url: "musicas/Winds of Francesca.mp3",
        multiplier: 1.15,
        phrases: ["a"]
      }
    }
  },
  "cyber_overdrive": {
    sectionName: "Cybernetic Protocol",
    tracks: {
      "hellfire": {
        title: "Hellfire Overdrive",
        url: "musicas/Hellfire Overdrive.mp3",
        multiplier: 1.5,
        phrases: [
          "Metal queimando no asfalto, neon sangrando no horizonte.",
          "Acelere até o motor virar fumaça e a alma virar código.",
          "Sem freios, sem limites, sem salvação: bem-vindo ao Hellfire Overdrive.",
          "Onde o cromo derrete e a velocidade domina o caos.",
          "Sinta o peso do aço, o calor do fogo e a força da distorção.",
          "Modo Overdrive Ativado: Sobrecarga nos sistemas",
          "Sangue de óleo, coração de nitroglicerina.",
          "Ultrapasse a velocidade da morte.",
          "Conexão neural queimada a 10.000 RPM.",
          "Injetando caos diretamente no barramento de dados.",
          "As ruas de cromo não perdoam quem tem medo de pisar no fundo.",
          "Guitarras distorcidas ecoando nas ruínas de uma metrópole esquecida.",
          "Se o futuro é sombrio, nós o iluminaremos com o fogo dos nossos motores.",
          "Na fronteira entre o circuito e a carne, apenas o ritmo do metal permanece.",
          "Nossa liberdade não é programada, é conquistada na rotação máxima."
        ]
      },
      "code_master": {
        title: "Bitrush_Overdrive",
        url: "musicas/Bitrush Overdrive.mp3",
        multiplier: 1.25,
        phrases: [
          "let pontos = 0;",
          "const nome = 'Jogador 1';",
          "console.log('Iniciando o jogo...');",
          "let vidas = 3;",
          "vidas -= 1;",
          "const ativo = true;",
          "if (combo >= 10) { multiplicador = 2; }",
          "function somarPontos(atual, bonus) { return atual + bonus; }",
          "for (let i = 0; i < 5; i++) { criarInimigo(); }",
          "const lista = ['fácil', 'médio', 'difícil'];",
          "const doubleScore = (score) => score * 2;",
          "const player = { name: 'Hero', hp: 100, isAlive: true };",
          "const speed = wpm > 80 ? 'Ultra Fast' : 'Normal';",
          "const arr = [1, 2, 3].map((num) => num * 10);",
          "setTimeout(() => { alert('Tempo esgotado!'); }, 3000);",
          "const { combo, multiplier } = gameState;"
        ]
      }
    }
  }
};

const ADMIN_PASSWORD_HASH = "0fc38699678759bfc9d851f132fca6824f6eb0c98f6122acdfaa83c9df3a44fc";

const RANKS = [
  { name: "D", min: 0, color: "#888888" },
  { name: "C", min: 10, color: "#00ccff" },
  { name: "B", min: 25, color: "#00ff88" },
  { name: "A", min: 45, color: "#ffcc00" },
  { name: "S", min: 70, color: "#ff9900" },
  { name: "SS", min: 100, color: "#ff0066" },
  { name: "SSS", min: 135, color: "#ff00cc" },
  { name: "HERO", min: 180, color: "#ffffff" }
];

const MAX_COMBO = 8;
const MAX_TIME = 60;
