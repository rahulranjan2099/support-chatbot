# Spur Chat Agent

Demo AI support chatbot with a React frontend, Express backend, Postgres, and Gemini.

## Setup

Install dependencies:

```bash
cd backend && npm install
cd ../frontend && npm install
```

Create `backend/.env`:

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/spurchat
SEQUELIZE_LOGGING=false

PORT=5000
GEMINI_PORT=5001
GEMINI_SERVICE_URL=http://localhost:5001
GEMINI_MODEL=gemini-2.5-flash
GEMINI_API_KEY=your_gemini_api_key
```

Create `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:5000
```

For production, set `VITE_API_BASE_URL` to your deployed conversation API URL.

## Database

Create DB and run migrations:

```bash
cd backend
npm run db:setup
```

Check migration status:

```bash
npm run db:status
```

Undo migrations:

```bash
npm run db:migrate:undo:all
```

## Development

Run conversation API:

```bash
cd backend
npm run dev:conversation
```

Run Gemini service in another terminal:

```bash
cd backend
npm run dev:gemini
```

Run frontend in another terminal:

```bash
cd frontend
npm run dev
```

Frontend: `http://localhost:5173`

## Build

```bash
cd backend && npm run build
cd ../frontend && npm run build
```
