# NetSecure — Backend Server

Backend Express.js avec MongoDB, auth JWT, WebSocket, firewall, alertes.

## Stack
- Node.js + Express
- MongoDB (Mongoose)
- JWT Auth
- WebSocket (ws)
- Mailjet (emails) + TextMagic (SMS)

## Setup

```bash
cp .env.template Config/.env
# Remplir les variables dans Config/.env
npm install
npm start
```

## Structure

```
Config/       — DB, rate limiting, CSP, WebSocket, cron
Controllers/  — Logique métier
Routes/       — Endpoints API
models/       — Schémas Mongoose
middlewares/  — Auth, blacklist tokens
services/     — Firewall
utils/        — Email, logs, validation
messaging/    — Mailjet, TextMagic
```
