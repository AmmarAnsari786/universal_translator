<div align="center">

<div align="center">

# 🌐 Universal Video & Audio Translator

**AI-powered dubbing tool — translate any video or audio into 20+ languages automatically**

[![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688?style=flat&logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat&logo=vite)](https://vitejs.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791?style=flat&logo=postgresql)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat&logo=docker)](https://www.docker.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

[**Live Demo**](#) · **API Docs:** available at `/docs` after starting backend · [**Report Bug**](issues)

</div>

---

## ✨ Features

- 🎬 **Download** from YouTube, TikTok, Spotify, Vimeo, SoundCloud, Instagram, Facebook, and 1000+ platforms via `yt-dlp`
- 🎤 **Transcribe** audio locally with `faster-whisper` (Whisper AI — no cloud needed)
- 🌍 **Translate** into **20+ languages** via LibreTranslate
- 🔊 **Re-dub** with natural voices using Microsoft Edge TTS
- 🎞️ **Merge** new audio into original video with FFmpeg
- ⚡ **Real-time progress** tracking in the browser
- 📥 **Download** the final dubbed video or audio

---

## 🌐 Supported Languages

| Code | Language | Code | Language |
|------|----------|------|----------|
| `ar` | Arabic | `ja` | Japanese |
| `zh` | Chinese | `ko` | Korean |
| `en` | English | `ms` | Malay |
| `fr` | French | `pt` | Portuguese |
| `de` | German | `ru` | Russian |
| `hi` | Hindi | `es` | Spanish |
| `id` | Indonesian | `tr` | Turkish |
| `it` | Italian | `uk` | Ukrainian |
| `nl` | Dutch | `ur` | Urdu |
| `pl` | Polish | `sv` | Swedish |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | FastAPI, SQLAlchemy, Uvicorn |
| **Frontend** | React 18, Vite, Tailwind CSS |
| **Download** | yt-dlp |
| **Speech-to-Text** | faster-whisper (OpenAI Whisper) |
| **Translation** | LibreTranslate |
| **Text-to-Speech** | Microsoft Edge TTS |
| **Audio/Video** | FFmpeg |
| **Database** | PostgreSQL |
| **Cache/Queue** | Redis (optional, future Celery support) |

---

## 🚀 Quick Start

### Option 1: Windows (One-Click)

```bash
git clone https://github.com/USERNAME/universal_translator.git
cd universal_translator

# Make sure PostgreSQL is running on port 5432
# Double-click start_servers.bat
start_servers.bat
```

### Option 2: Docker Compose (Recommended)

```bash
git clone https://github.com/USERNAME/universal_translator.git
cd universal_translator
docker-compose up --build
```

Then open: **http://localhost:5173**

### Option 3: Manual Setup

#### Backend
```bash
cd backend

# Copy and configure environment variables
cp .env.example .env
# Edit .env with your PostgreSQL credentials

# Create virtual environment
python -m venv venv
venv\Scripts\activate       # Windows
# source venv/bin/activate  # Linux/Mac

# Install dependencies
pip install -r requirements.txt

# Initialize database
python init_db.py

# Start server
uvicorn main:app --reload --port 8000
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173** 🎉

## 📁 Project Structure

```
universal-translater/
├── 📄 README.md
├── 📄 docker-compose.yml
├── 📄 .gitignore
├── 📄 start_servers.bat          ← Windows quick-start
│
├── backend/
│   ├── main.py                   ← FastAPI app entry point
│   ├── init_db.py                ← Database initialization
│   ├── requirements.txt
│   ├── Dockerfile
│   ├── .env.example
│   └── app/
│       ├── config.py             ← Settings & languages list
│       ├── worker.py             ← Full translation pipeline
│       ├── api/routes.py         ← REST API endpoints
│       ├── models/database.py    ← SQLAlchemy models
│       ├── schemas/job.py        ← Pydantic schemas
│       └── services/
│           ├── downloader.py     ← yt-dlp wrapper
│           ├── transcriber.py    ← faster-whisper STT
│           ├── translator.py     ← LibreTranslate client
│           ├── synthesizer.py    ← Edge TTS
│           └── media_processor.py ← FFmpeg Audio/Video
│
└── frontend/
    ├── Dockerfile
    ├── nginx.conf
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── App.jsx
        ├── main.jsx
        ├── index.css
        ├── services/api.js       ← Axios API layer
        ├── components/Navbar.jsx
        └── pages/
            ├── LandingPage.jsx   ← Hero + features
            ├── TranslatorPage.jsx ← Form + live progress
            └── HistoryPage.jsx   ← Job history
```

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/jobs` | Create a new translation job |
| `GET` | `/api/v1/jobs/{id}` | Get job status & progress |
| `GET` | `/api/v1/jobs` | List all past jobs |
| `GET` | `/api/v1/download/{id}` | Download translated output |
| `GET` | `/api/v1/languages` | List supported languages |
| `GET` | `/health` | Health check |

Full interactive docs available at: `http://localhost:8000/docs`

## ⚙️ Environment Variables

Copy `backend/.env.example` to `backend/.env` and configure:

```env
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/universal_translator
REDIS_URL=redis://localhost:6379/0
SECRET_KEY=your-secret-key-here
LIBRETRANSLATE_URL=http://localhost:5000
DATA_DIR=./data
CORS_ORIGINS=["http://localhost:5173"]
```

## 📋 Prerequisites

| Tool | Version | Notes |
|------|---------|-------|
| Python | 3.10+ | |
| Node.js | 18+ | |
| PostgreSQL | 13+ | |
| FFmpeg | Latest | Must be in PATH |
| Redis | 6+ | Optional (for Celery) |

### Installing FFmpeg (Windows)
```bash
winget install ffmpeg
# OR download from https://ffmpeg.org/download.html
```

## 🗺️ Roadmap

- [x] Core translation pipeline (Download → Transcribe → Translate → TTS → Merge)
- [x] Real-time progress tracking
- [x] Job history with download links
- [x] Docker support
- [ ] WebSocket live progress updates
- [ ] Batch processing (playlist support)
- [ ] Voice cloning
- [ ] Subtitle (.srt) export
- [ ] User authentication

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

## 🙏 Acknowledgements

- [yt-dlp](https://github.com/yt-dlp/yt-dlp) — Media downloading
- [faster-whisper](https://github.com/SYSTRAN/faster-whisper) — Fast STT
- [LibreTranslate](https://github.com/LibreTranslate/LibreTranslate) — Open source translation
- [edge-tts](https://github.com/rany2/edge-tts) — Microsoft Edge TTS
- [FFmpeg](https://ffmpeg.org/) — Audio/video processing

---

<div align="center">
Made with ❤️ | Star ⭐ if you find it useful!
</div>
