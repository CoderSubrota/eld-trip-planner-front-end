# ELD Trip Planner — Django + React (Vite)

This project contains **backend/** (Django REST API) and **frontend/** (React + Leaflet) in separate folders.

## Run locally
### Backend
```bash
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
python manage.py runserver 0.0.0.0:8000
```

### Frontend
```bash
cd frontend
npm i
# Set VITE_API_BASE in .env (see .env.example)
npm run dev
```

## Deploy
- **Backend (Vercel)**: uses `vercel.json`, Start Command `gunicorn server.wsgi`
- **Frontend (Vercel)**: set `VITE_API_BASE=https://<your-backend>/api`, then `npm run build`
