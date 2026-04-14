# Deploying Both Frontend & Backend on Render

## Overview
You can deploy both the Django backend and React frontend on Render using **two separate services**.

---

## Option 1: Use render.yaml (Recommended - Easiest)

### Step 1: Deploy Using Blueprint

1. Go to [render.com](https://render.com) dashboard
2. Click **"New +"** → **"Blueprint"**
3. Connect your GitHub repository
4. Render will automatically detect `render.yaml`
5. Click **"Apply"**

Render will automatically create:
- ✅ **lms-backend** (Django service)
- ✅ **lms-frontend** (React static site)
- ✅ **lms-database** (PostgreSQL database)

### Step 2: Set Environment Variables

After deployment, you need to manually set these values:

**For lms-backend:**
- `ALLOWED_HOSTS` → Your backend Render URL (e.g., `lms-backend.onrender.com`)
- `CORS_ALLOWED_ORIGINS` → Your frontend Render URL (e.g., `https://lms-frontend.onrender.com`)

**For lms-frontend:**
- `VITE_API_URL` → Your backend Render URL (e.g., `https://lms-backend.onrender.com`)

### Step 3: Redeploy Both Services
- Go to each service
- Click "Manual Deploy" → "Deploy latest commit"

---

## Option 2: Manual Setup (If Blueprint doesn't work)

### Backend Service

1. **Create Web Service**
   - Click "New +" → "Web Service"
   - Connect GitHub repo
   - **Root Directory**: `backend`
   - **Runtime**: Python 3
   - **Build Command**: 
     ```
     pip install -r requirements.txt && python manage.py collectstatic --no-input && python manage.py migrate
     ```
   - **Start Command**: 
     ```
     gunicorn config.wsgi:application
     ```

2. **Add Environment Variables**:
   ```
   PYTHON_VERSION=3.9.18
   DEBUG=False
   SECRET_KEY=<generate-new-key>
   DATABASE_URL=<from-postgres-service>
   ALLOWED_HOSTS=<your-backend-url>.onrender.com
   CORS_ALLOWED_ORIGINS=https://<your-frontend-url>.onrender.com
   ```

### Frontend Service

1. **Create Static Site**
   - Click "New +" → "Static Site"
   - Connect GitHub repo
   - **Root Directory**: `frontend`
   - **Build Command**: 
     ```
     npm install && npm run build
     ```
   - **Publish Directory**: `dist`

2. **Add Environment Variable**:
   ```
   VITE_API_URL=https://<your-backend-url>.onrender.com
   ```

3. **Configure Routing** (for SPA):
   - Go to "Redirects/Rewrites"
   - Add rule:
     - **Source**: `/*`
     - **Destination**: `/index.html`
     - **Action**: Rewrite

### Database

1. **Create PostgreSQL**
   - Click "New +" → "PostgreSQL"
   - Name: `lms-database`
   - Copy **Internal Database URL**
   - Paste into backend's `DATABASE_URL` environment variable

---

## Important Notes

### Free Tier Limitations
- **Backend**: Spins down after 15 minutes of inactivity
- **Frontend**: Always available (static site)
- **Database**: 90 days free, then expires (backup your data!)

### URLs You'll Get
- **Backend**: `https://lms-backend.onrender.com`
- **Frontend**: `https://lms-frontend.onrender.com`
- **Database**: Internal URL (not publicly accessible)

### CORS Configuration
Make sure your backend's `CORS_ALLOWED_ORIGINS` includes your frontend URL, otherwise API calls will fail!

---

## Troubleshooting

### Backend Issues

**Problem: "Build failed"**
- Check that `rootDir` is set to `backend`
- Verify `requirements.txt` exists in backend folder
- Check build logs for specific errors

**Problem: "Application failed to start"**
- Verify `gunicorn` is in `requirements.txt`
- Check that `config.wsgi:application` path is correct
- Review application logs

**Problem: "Database connection error"**
- Make sure `DATABASE_URL` is set
- Use the **Internal Database URL**, not External
- Verify PostgreSQL service is running

### Frontend Issues

**Problem: "Build failed"**
- Check that `rootDir` is set to `frontend`
- Verify `package.json` exists in frontend folder
- Make sure `npm run build` works locally

**Problem: "404 on page refresh"**
- Add rewrite rule: `/*` → `/index.html`
- This is required for React Router to work

**Problem: "API calls failing"**
- Check `VITE_API_URL` is set correctly
- Verify backend CORS allows frontend domain
- Check browser console for CORS errors

---

## Deployment Checklist

### Before Deploying
- [ ] `render.yaml` is in repository root
- [ ] Both `backend/` and `frontend/` folders exist
- [ ] `requirements.txt` is complete
- [ ] `package.json` has correct build script
- [ ] `.env` files are NOT committed (use environment variables)

### After Deploying
- [ ] Backend service is running
- [ ] Frontend static site is deployed
- [ ] Database is connected
- [ ] Environment variables are set
- [ ] CORS is configured correctly
- [ ] Test login functionality
- [ ] Test API endpoints
- [ ] Check browser console for errors

---

## Cost Estimate

**Free Tier:**
- Backend: $0 (with spin-down)
- Frontend: $0 (static site)
- Database: $0 (first 90 days)

**Paid Tier (to avoid spin-down):**
- Backend: $7/month (Starter plan)
- Frontend: $0 (static site always free)
- Database: $7/month (after 90 days)

**Total: $0-14/month** depending on your needs

---

## Next Steps

1. Use the `render.yaml` blueprint to deploy
2. Set the required environment variables
3. Test your deployed application
4. Monitor logs for any errors

Your Leave Management System will be fully deployed on Render! 🚀
