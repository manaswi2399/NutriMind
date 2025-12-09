#!/bin/bash

echo "🍽️  NutriMind Backend Setup"
echo "============================="
echo ""

# Check Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 not found. Please install Python 3.11+"
    exit 1
fi

echo "✅ Python found: $(python3 --version)"
echo ""

# Create venv
echo "📦 Creating virtual environment..."
python3 -m venv venv
echo "✅ Virtual environment created"
echo ""

# Activate and install
echo "📦 Installing dependencies..."
source venv/bin/activate 2>/dev/null || source venv/Scripts/activate 2>/dev/null
pip install --upgrade pip --quiet
pip install -r requirements.txt --quiet
echo "✅ Dependencies installed"
echo ""

# Setup .env
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "✅ .env file created"
    echo ""
    echo "⚠️  IMPORTANT: Add your Gemini API key to .env"
    echo ""
    echo "Steps:"
    echo "1. Go to: https://aistudio.google.com/app/apikey"
    echo "2. Create an API key"
    echo "3. Edit .env and add: GEMINI_API_KEY=AIza...your-key"
    echo ""
else
    echo "✅ .env file already exists"
fi

echo "============================="
echo "🎉 Setup Complete!"
echo "============================="
echo ""
echo "To start the server:"
echo ""
echo "  source venv/bin/activate  # Mac/Linux"
echo "  python -m uvicorn app.main:app --reload"
echo ""
echo "Server will run at: http://localhost:8000"
echo "API docs at: http://localhost:8000/docs"
echo ""
