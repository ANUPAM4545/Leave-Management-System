# LMS Pro - Leave Management System

A premium, full-stack Leave Management System designed to empower modern workplaces. LMS Pro eliminates the friction of administrative overhead by providing frictionless application workflows, intelligent manager review queues, and beautiful interactive analytics.

## 🌟 Key Features

* **Premium UI Aesthetic:** Expertly crafted utilizing a luxurious Golden and True Black texture theme, achieving a bespoke carbon-matte feel with radiant glassmorphism overlays.
* **Flawless Mobile Responsiveness:** Features an elegant Off-Canvas Drawer architecture, ensuring data tables and layouts flawlessly adapt to any smartphone screen without sacrificing usability.
* **Role-Based Access Control:** Dedicated ecosystems isolating workflows for Employees, Managers, and HR Administrators safely and securely.
* **Advanced Analytics:** Real-time metrics and dynamic multi-colored charts tracing team availability and usage limits.
* **Seamless Landing Protocol:** Incorporates a high-performance anchored landing page with smooth-scroll features logic.

---

## 🛠 Tech Stack

**Frontend Framework**
* React 18 (Vite Fast Refresh)
* TailwindCSS (Fully Customized Theme Config)
* Framer Motion (Micro-animations & Component Exits)
* Recharts (Interactive SVG Analytics)
* React Router DOM (Protected Routes Management)

**Backend Architecture**
* Django 4.2+ (Core Routing & Logic)
* Django REST Framework (API Generation)
* JWT Authentication (Simple JWT for secure stateless auth)
* SQLite (Local Development) / PostgreSQL (Production ready)
* Django CORS Headers

---

## 🚀 Deployment Guide
LMS Pro is fully architected for continuous delivery on the market's best platforms.
- **Frontend Hosting:** Vercel
- **Backend & Database Hosting:** Render

Please carefully review the full instructional deployment guide before pushing to production:
👉 [**Read the Deployment Documentation (RENDER_DEPLOYMENT.md)**](./RENDER_DEPLOYMENT.md)

---

## 💻 Local Development Setup

### 1. Backend Synchronization (Django)
```bash
cd backend
python -m venv venv
source venv/bin/activate  # (or venv\Scripts\activate on Windows)
pip install -r requirements.txt

python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser  # Establish your HR Admin account
python manage.py runserver
```

### 2. Frontend Synchronization (React)
```bash
cd frontend
npm install
# To boot the beautiful Vite server:
npm run dev
```

The system will activate locally at `http://localhost:5173`.
