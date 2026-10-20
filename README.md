# Typing Hero

Jogo de digitação inspirado em Guitar Hero e Devil May Cry.

## Estrutura

```
TypingHero/
├── index.html          # Página principal do jogo
├── auth.html           # Login e cadastro
├── favicon.ico
├── css/
│   ├── main.css        # Estilos gerais e menu
│   ├── game.css        # Estilos da partida
│   └── auth.css        # Estilos da tela de autenticação
├── js/
│   ├── config.js       # Biblioteca de músicas, ranks e constantes
│   ├── utils.js        # Funções utilitárias (hash, escape, toast)
│   ├── supabase.js     # Cliente Supabase
│   ├── audio.js        # Música e efeitos sonoros
│   ├── auth.js         # Login, cadastro e sessão
│   ├── settings.js     # Acessibilidade e preferências
│   ├── leaderboard.js  # Ranking por música
│   ├── game.js         # Lógica principal da partida
│   └── announcements.js # Patch notes, admin e report de bugs
└── musicas/
    └── *.mp3
```

## Ordem dos scripts

`config` → `utils` → `supabase` → `audio` → `auth` → `settings` → `leaderboard` → `game` → `announcements`
