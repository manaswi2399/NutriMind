# 🚀 Quick Start Guide

## Setup (3 minutes)

### 1. Get Gemini API Key (FREE)

```
Visit: https://aistudio.google.com/app/apikey
→ Sign in with Google
→ Click "Create API Key"
→ Copy your key (starts with AIza...)
```

### 2. Install & Configure

```bash
# Run setup script
./setup.sh

# Add your API key to .env
# Edit .env and add:
GEMINI_API_KEY=AIza...your-actual-key
```

### 3. Start Server

```bash
# Activate virtual environment
source venv/bin/activate  # Mac/Linux
# OR
venv\Scripts\activate     # Windows

# Start server
python -m uvicorn app.main:app --reload
```

### 4. Test It

```bash
# Open in browser:
http://localhost:8000/docs

# Or test with curl:
curl http://localhost:8000/api/health
```

## Done! 🎉

Your backend is running at:
- **API**: http://localhost:8000
- **Docs**: http://localhost:8000/docs
- **Health**: http://localhost:8000/api/health

## Daily Usage

```bash
# Start server (every time)
cd backend
source venv/bin/activate
python -m uvicorn app.main:app --reload
```

## Troubleshooting

**Module not found?**
```bash
pip install -r requirements.txt
```

**API key error?**
```bash
# Check .env file has:
GEMINI_API_KEY=AIza...
```

**Port in use?**
```bash
lsof -ti:8000 | xargs kill -9
```

## Need Help?

See `README.md` for detailed documentation.
