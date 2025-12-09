# 🚀 NutriMind Deployment Guide

Complete guide to deploying NutriMind to production.

## 📋 Pre-Deployment Checklist

- [ ] All features tested locally
- [ ] API key secured in environment variables
- [ ] Frontend builds successfully
- [ ] Backend runs without errors
- [ ] CORS configured for production URLs
- [ ] Error handling implemented
- [ ] Performance optimized (Lighthouse check)
- [ ] Accessibility verified (WAVE/axe)

## 🌐 Frontend Deployment (Netlify)

### Method 1: Git Integration (Recommended)

1. **Push to GitHub**

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/manaswi2399/NutriMind
   git push -u origin main
   ```

2. **Connect to Netlify**

   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub repository
   - Configure build settings:
     ```
     Base directory: frontend
     Build command: npm run build
     Publish directory: frontend/build
     ```

3. **Environment Variables**

   - No frontend environment variables needed
   - Backend URL will be configured after backend deployment

4. **Deploy!**
   - Click "Deploy site"
   - Netlify will build and deploy automatically

### Method 2: Manual Deploy

```bash
cd frontend
npm run build
npx netlify-cli deploy --prod --dir=build
```

### Custom Domain (Optional)

1. In Netlify: Domain settings → Add custom domain
2. Update DNS records as instructed
3. Enable HTTPS (automatic with Netlify)

## 🔧 Backend Deployment

### Option 1: Railway (Recommended)

1. **Sign up at [railway.app](https://railway.app)**

2. **Create New Project**

   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Select `backend` directory as root

3. **Configure Environment Variables**

   ```
   ANTHROPIC_API_KEY=your_actual_api_key
   PORT=8000
   FRONTEND_URL=https://your-netlify-site.netlify.app
   ```

4. **Deploy Settings**

   - Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - Railway will auto-detect Python and install requirements

5. **Get Your Backend URL**
   - Copy the generated Railway URL
   - Update frontend API calls to use this URL

### Option 2: Render

1. **Create Web Service**

   - Go to [render.com](https://render.com)
   - New → Web Service
   - Connect GitHub repository

2. **Configure**

   ```
   Name: nutrimind-backend
   Root Directory: backend
   Environment: Python 3
   Build Command: pip install -r requirements.txt
   Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT
   ```

3. **Environment Variables**

   - Add `ANTHROPIC_API_KEY`
   - Add `FRONTEND_URL`

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment

### Option 3: Docker + AWS

1. **Create Dockerfile** (already in backend/)

2. **Build and Push to ECR**

   ```bash
   aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin your-account.dkr.ecr.us-east-1.amazonaws.com
   docker build -t nutrimind-backend ./backend
   docker tag nutrimind-backend:latest your-account.dkr.ecr.us-east-1.amazonaws.com/nutrimind-backend:latest
   docker push your-account.dkr.ecr.us-east-1.amazonaws.com/nutrimind-backend:latest
   ```

3. **Deploy to ECS/Fargate**
   - Create ECS cluster
   - Create task definition
   - Create service
   - Configure load balancer

## 🔗 Connecting Frontend to Backend

After deploying backend, update frontend:

1. **Update API URL in frontend**

   Create `frontend/src/config.ts`:

   ```typescript
   export const API_URL =
     process.env.REACT_APP_API_URL || "http://localhost:8000";
   ```

2. **Update fetch calls**

   ```typescript
   import { API_URL } from "./config";

   const response = await fetch(`${API_URL}/api/meal-plan`, {
     method: "POST",
     headers: { "Content-Type": "application/json" },
     body: JSON.stringify(dietData),
   });
   ```

3. **Set environment variable in Netlify**

   - Site settings → Environment variables
   - Add: `REACT_APP_API_URL=https://your-railway-backend.up.railway.app`

4. **Redeploy frontend**
   ```bash
   git add .
   git commit -m "Update API URL"
   git push
   ```

## 🔐 Security Configuration

### Backend CORS Update

Update `main.py`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://your-site.netlify.app",
        "http://localhost:3000"  # Keep for local dev
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### API Key Security

- ✅ Store API keys in environment variables
- ✅ Never commit `.env` file
- ✅ Use different keys for dev/prod
- ✅ Rotate keys regularly
- ✅ Set up API key restrictions if available

## 📊 Post-Deployment Checks

1. **Functionality**

   - [ ] Homepage loads correctly
   - [ ] Navigation works
   - [ ] Meal plan generation works
   - [ ] Recipe finder works
   - [ ] Error messages display properly

2. **Performance**

   - [ ] Run Lighthouse audit (target: 90+ desktop, 80+ mobile)
   - [ ] Check Core Web Vitals
   - [ ] Verify fast load times

3. **Accessibility**

   - [ ] Run WAVE accessibility check
   - [ ] Test keyboard navigation
   - [ ] Verify screen reader compatibility

4. **Cross-Browser Testing**

   - [ ] Chrome
   - [ ] Firefox
   - [ ] Safari
   - [ ] Edge

5. **Mobile Testing**
   - [ ] iOS Safari
   - [ ] Android Chrome
   - [ ] Responsive design working

## 🔄 Continuous Deployment

Both Netlify and Railway support automatic deployments:

1. **Push to main branch** → Automatically deploys
2. **Create pull request** → Generates preview deployment
3. **Merge PR** → Production deployment

### GitHub Actions (Optional)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  test-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Test Frontend
        run: |
          cd frontend
          npm install
          npm test
      - name: Build Frontend
        run: |
          cd frontend
          npm run build
```

## 📈 Monitoring

### Frontend Monitoring

- **Netlify Analytics**: Built-in
- **Google Analytics**: Add tracking code
- **Sentry**: For error tracking

### Backend Monitoring

- **Railway Metrics**: Built-in
- **Uptime Robot**: Free uptime monitoring
- **Sentry**: For error tracking

## 🆘 Troubleshooting

### Build Fails

```bash
# Clear cache and rebuild
rm -rf node_modules package-lock.json
npm install
npm run build
```

### CORS Errors

- Verify backend URL in frontend config
- Check CORS origins in backend
- Ensure HTTPS on both ends

### API Errors

- Check environment variables
- Verify API key is correct
- Check backend logs
- Test API with curl/Postman

## 📞 Support

For deployment issues:

1. Check service status pages
2. Review deployment logs
3. Consult service documentation
4. Contact team members

---

**Deployment Complete! 🎉**

Your NutriMind application is now live and helping users plan healthy meals!
