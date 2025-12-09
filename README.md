# 🥗 NutriMind - AI-Powered Meal & Recipe Planner

![NutriMind Banner](https://img.shields.io/badge/NutriMind-AI%20Nutrition-orange?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react)
![FastAPI](https://img.shields.io/badge/FastAPI-0.124-009688?style=for-the-badge&logo=fastapi)
![Claude AI](https://img.shields.io/badge/Claude-AI-7C3AED?style=for-the-badge)

NutriMind is an intelligent web application that revolutionizes meal planning and recipe discovery using advanced AI. Built with React, FastAPI, and Claude AI, it provides personalized nutrition guidance and creative recipe suggestions.

## ✨ Features

### Core Features
- **🎯 AI Meal Planning**: Generate personalized meal plans based on dietary goals, calorie targets, and restrictions
- **🔍 Smart Recipe Finder**: Discover creative recipes based on available ingredients
- **📊 Nutritional Insights**: Detailed macronutrient breakdowns for every meal
- **🎨 Stunning UI**: Beautiful, modern interface with smooth animations
- **♿ Accessible Design**: WCAG 2.1 Level AA compliant
- **📱 Responsive**: Optimized for desktop, tablet, and mobile devices

### Technical Highlights
- Real-time AI-powered suggestions using Claude Sonnet 4
- Type-safe React with TypeScript
- RESTful API with FastAPI
- Smooth animations with Framer Motion
- Glassmorphism design with modern CSS

## 🏗️ Project Structure

```
nutrimind/
├── frontend/                 # React TypeScript Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/      # React Components
│   │   │   ├── Hero.tsx
│   │   │   ├── Hero.css
│   │   │   ├── Navigation.tsx
│   │   │   ├── Navigation.css
│   │   │   ├── DietForm.tsx
│   │   │   ├── DietForm.css
│   │   │   ├── IngredientForm.tsx
│   │   │   ├── IngredientForm.css
│   │   │   ├── RecipeCards.tsx
│   │   │   └── RecipeCards.css
│   │   ├── App.tsx          # Main App Component
│   │   ├── App.css          # Global Styles
│   │   └── index.tsx        # Entry Point
│   ├── package.json
│   └── tsconfig.json
│
└── backend/                 # FastAPI Backend
    ├── main.py             # FastAPI Application
    ├── requirements.txt    # Python Dependencies
    ├── .env.example       # Environment Template
    └── README.md          # Backend Documentation
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **Python** (v3.10 or higher)
- **Anthropic API Key** (Get from [Anthropic Console](https://console.anthropic.com/))

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Create virtual environment**
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Anthropic API key:
   ```
   ANTHROPIC_API_KEY=your_actual_api_key_here
   ```

5. **Run the backend server**
   ```bash
   python main.py
   ```
   
   Backend will be available at: `http://localhost:8000`
   
   API Documentation: `http://localhost:8000/docs`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```
   
   Frontend will be available at: `http://localhost:3000`

## 📡 API Endpoints

### POST /api/meal-plan
Generate a personalized meal plan

**Request Body:**
```json
{
  "dietType": "balanced",
  "calories": 2000,
  "protein": "moderate",
  "restrictions": "no nuts, dairy-free",
  "meals": 3
}
```

**Response:**
```json
{
  "meals": [
    {
      "id": "meal-1",
      "name": "Grilled Chicken Power Bowl",
      "description": "Protein-packed bowl with fresh vegetables",
      "calories": 450,
      "protein": 35,
      "carbs": 40,
      "fat": 15,
      "ingredients": ["chicken breast", "quinoa", "broccoli"],
      "instructions": ["Grill chicken...", "Cook quinoa..."],
      "cookTime": "25 mins",
      "servings": 1
    }
  ],
  "success": true
}
```

### POST /api/recipes
Find recipes based on ingredients

**Request Body:**
```json
{
  "ingredients": ["chicken", "rice", "tomatoes"],
  "cuisine": "italian",
  "difficulty": "medium"
}
```

**Response:**
```json
{
  "recipes": [
    {
      "id": "recipe-1",
      "name": "Tuscan Chicken Rice",
      "description": "A comforting Italian-inspired dish",
      "calories": 520,
      "protein": 38,
      "carbs": 55,
      "fat": 12,
      "ingredients": ["2 chicken breasts", "1 cup rice"],
      "instructions": ["Season chicken...", "Cook rice..."],
      "cookTime": "35 mins",
      "servings": 2
    }
  ],
  "success": true
}
```

## 🎨 Design Philosophy

NutriMind features a unique design approach inspired by modern web aesthetics:

- **Typography**: Playfair Display for headlines, Work Sans for body text
- **Color Palette**: Vibrant gradients (purple to pink) with amber accents
- **Glassmorphism**: Frosted glass effects for cards and containers
- **Animations**: Smooth transitions using Framer Motion
- **Accessibility**: Keyboard navigation, screen reader support, high contrast

## 🧪 Testing

### Frontend Testing
```bash
cd frontend
npm test
```

### Backend Testing
```bash
cd backend
pytest
```

## 📊 Performance Metrics

### Target Metrics (from proposal)
- ✅ **Accessibility**: WCAG 2.1 Level AA compliance
- ✅ **Performance**: Lighthouse score ≥ 90 (desktop), ≥ 80 (mobile)
- ✅ **Core Web Vitals**: LCP < 2.5s, CLS < 0.1
- ✅ **AI Accuracy**: 85%+ match rate for dietary preferences
- ✅ **Uptime**: 99%+ on Netlify deployment

## 🚢 Deployment

### Frontend (Netlify)
1. Push code to GitHub
2. Connect repository to Netlify
3. Set build command: `npm run build`
4. Set publish directory: `build/`
5. Deploy!

### Backend (Options)
- **Railway**: Connect GitHub repo, auto-deploy
- **Render**: Free tier available, easy setup
- **AWS EC2**: More control, requires configuration
- **Google Cloud Run**: Serverless, pay-per-use

## 🔐 Security

- API keys stored in environment variables
- CORS configured for specific origins
- Input validation using Pydantic
- No sensitive data stored in localStorage
- Rate limiting (recommended for production)

## 🤝 Contributing

This is a student project for CMPE 280 at SJSU. Team members:
- Shravani Surendra Chandratre
- Manaswi Rajesh Lukkad
- Parth Prasanna Mhakavekar
- Prem Jitendra Jadhav

## 📝 License

This project is created for educational purposes as part of CMPE 280 coursework.

## 🙏 Acknowledgments

- **Claude AI** by Anthropic for intelligent meal planning
- **React** team for the amazing framework
- **FastAPI** for the modern Python API framework
- **Framer Motion** for smooth animations
- **Material-UI** for UI components

## 📞 Support

For issues or questions about the project, please contact the team members via email listed in the project proposal.

---

**Built with ❤️ by Team UIBot**
