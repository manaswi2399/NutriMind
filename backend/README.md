# NutriMind Backend

FastAPI backend with Google Gemini AI integration.

## Quick Start

### 1. Get Gemini API Key

1. Go to: https://aistudio.google.com/app/apikey
2. Sign in with Google
3. Create API key
4. Copy the key (starts with `AIza...`)

### 2. Setup

```bash
# Create virtual environment
python3 -m venv venv

# Activate it
source venv/bin/activate  # Mac/Linux
# OR
venv\Scripts\activate     # Windows

# Install dependencies
pip install -r requirements.txt
```

### 3. Configure

```bash
# Create .env file
cp .env.example .env

# Edit .env and add your key
# GEMINI_API_KEY=AIza...your-key-here
```

### 4. Run

```bash
# Start server
python -m uvicorn app.main:app --reload

# Server runs at: http://localhost:8000
# API docs at: http://localhost:8000/docs
```

## API Endpoints

- `GET /` - Root
- `GET /api/health` - Health check
- `POST /api/meal-plan` - Generate meal plan
- `POST /api/recipes/search` - Search recipes
- `POST /api/chat` - AI chat
- `POST /api/nutrition-analysis` - Analyze nutrition

## Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py           # FastAPI app
│   ├── config.py         # Configuration
│   ├── models/           # Pydantic models
│   │   ├── request.py
│   │   └── response.py
│   ├── routes/           # API routes
│   │   ├── health.py
│   │   ├── meal_plan.py
│   │   └── recipes.py
│   └── services/         # Business logic
│       └── ai_service.py # Gemini AI
├── requirements.txt
├── .env.example
└── README.md
```

## Tech Stack

- FastAPI 0.109.0
- Google Generative AI 0.3.2
- Pydantic 2.5.3
- Uvicorn 0.27.0
- Python 3.11+

## Gemini Free Tier

- 60 requests/minute
- 1,500 requests/day
- 100,000 tokens/day

Perfect for development!
