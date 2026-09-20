# FoxCord 🦊

Chat em tempo real inspirado no Discord, com salas, histórico temporário e chamadas WebRTC.

## Rodar

Requer Node.js 20+.

```bash
npm install
npm start
```

Abra `http://localhost:3000`.

Desenvolvimento: `npm run dev`.

## Hospedagem

O projeto está pronto para Render: o `render.yaml` usa `npm install`, `npm start` e `/health`.

## Recursos

- salas por URL (`?room=geral`)
- múltiplos usuários e mensagens em tempo real
- nome editável e salvo no navegador
- últimas 100 mensagens por sala enquanto o servidor estiver ativo
- chamada de áudio/vídeo e compartilhamento de tela via WebRTC

O histórico fica em memória e é perdido ao reiniciar o servidor. Para persistência, adicione PostgreSQL. Algumas redes exigem TURN para WebRTC.
