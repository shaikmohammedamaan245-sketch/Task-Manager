
# Task Manager App (MERN)

Features:
- User registration/login (JWT)
- Add, edit, delete tasks
- Task list view with pending/completed toggle
- MongoDB storage (Mongoose)
- Ready to deploy on Render (free tier)
- Clean docs and examples

## Local Dev
1. **Server**
```bash
cd server
npm install
cp .env.example .env
# fill MONGODB_URI and JWT_SECRET
npm run dev
```
2. **Client**
```bash
cd client
npm install
cp .env.example .env
npm run dev
```
Open http://localhost:5173

## Deploy (Render)
- Push this repo to GitHub.
- Create a new **Web Service** on Render from the repo.
- Root Directory: `/` (it will run `buildCommand` from render.yaml)
- Start command: `node src/index.js` (already set)
- Add env vars: `MONGODB_URI`, `JWT_SECRET`, `CLIENT_URL` (your client URL)

## Notes
- Replace the placeholder secrets in `.env.example`.
- For HTTPS-only CORS, set `CLIENT_URL` accordingly.
