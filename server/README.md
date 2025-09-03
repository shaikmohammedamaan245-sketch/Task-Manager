
# Task Manager API (Express + MongoDB)

## Quick Start
```bash
cd server
npm install
cp .env.example .env # fill values
npm run dev
```
## Endpoints
- `POST /api/auth/register` { name, email, password }
- `POST /api/auth/login` { email, password }
- `GET /api/tasks` (auth) `?status=pending|completed`
- `POST /api/tasks` (auth) { title, description?, dueDate? }
- `PUT /api/tasks/:id` (auth) Update fields
- `PATCH /api/tasks/:id/toggle` (auth) Toggle completed
- `DELETE /api/tasks/:id` (auth)
