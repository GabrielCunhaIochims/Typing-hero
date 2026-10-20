
# TypingHero

![TypingHero Banner](https://img.shields.io/badge/Style-Retro%20%2F%20Arcade-red?style=for-the-badge)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)

**TypingHero** é um jogo interativo de teste e treino de digitação no estilo retro/arcade. O projeto oferece feedback em tempo real para digitação, sistema de pontuações via Leaderboard, personalização de temas visuais (incluindo inspirações como *ULTRAKILL* e *Devil May Cry*) e autenticação de utilizadores.

---

## Funcionalidades

-  **Cálculo de Desempenho em Tempo Real**: Medição precisa de **WPM** (Palavras por Minuto) e **Precisão (%)**.
-  **Áudio Imersivo**: Efectos sonoros de digitação e trilha sonora retro (*Bitrush Overdrive*).
-  **Leaderboard Global**: Persistência de recordes e pontuações de jogadores integrados ao **Supabase**.
-  **Autenticação de Utilizadores**: Registo e login de contas com gestão de sessão segura.
-  **Personalização de Temas**: Suporte a múltiplos temas visuais e configurações de áudio/dificuldade.
-  **Interface Fluida**: Layout responsivo com estéticas estilizadas e animações dinâmicas.

---

## Tecnologias Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript (ES6 Modules)
- **Backend / Database**: [Supabase](https://supabase.com/) (Autenticação e Base de Dados PostgreSQL)
- **Áudio**: HTML5 Audio API

---

##  Estrutura do Projeto

```text
TypingHero/
├── index.html          # Página principal do jogo
├── auth.html           # Página de autenticação (Login / Registo)
├── favicon.ico         # Ícone do site
├── README.md           # Documentação do projeto
├── css/
│   ├── main.css        # Variáveis globais, fontes e temas
│   ├── game.css        # Layout e componentes do jogo
│   └── auth.css        # Estilização das telas de autenticação
├── js/
│   ├── config.js       # Chaves e URLs de configuração da API
│   ├── supabase.js     # Inicialização do cliente Supabase
│   ├── utils.js        # Funções utilitárias e ajudantes
│   ├── audio.js        # Gestão de som e efeitos áudio
│   ├── auth.js         # Lógica de utilizadores e sessões
│   ├── game.js         # Motor principal do jogo (WPM, tempo, texto)
│   ├── leaderboard.js  # Gestão de classificações e recordes
│   ├── settings.js     # Painel de definições e personalização
│   └── announcements.js# Popups e anúncios na interface
└── musicas/
    └── Bitrush Overdrive.mp3 # Trilha sonora principal
```

---



##  Como Jogar

1. Acesse o site e faça login na sua conta para guardar o seu progresso.
2. Escolha o tempo de teste ou nível de dificuldade nas configurações.
3. Comece a digitar o texto exibido na tela o mais rápido e preciso possível.
4. Veja as suas estatísticas de **WPM** e **Precisão** ao final e tente entrar para o **Top 10 do Leaderboard**!

