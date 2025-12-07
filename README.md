🌟 Leave Management System (LMS)

A production-ready, role-based leave management system built with Django REST Framework, React (Vite), and SQLite, featuring automated workflows, audit logs, email notifications, and webhook integrations.

⸻


<p align="center">
  <img src="https://img.shields.io/badge/Backend-Django%20REST%20Framework-092E20?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Database-SQLite-003B57?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Authentication-JWT-orange?style=for-the-badge" />
</p>



⸻

✨ Features

🧑‍💼 User Roles & Access Control
	•	Employee, Manager & HR roles
	•	Role-based permissions
	•	Object-level access using django-guardian

📝 Leave Management
	•	Apply, approve, reject leaves
	•	Manager comments
	•	Audit history for every action
	•	Dashboard statistics for managers

📧 Email Notifications
	•	Leave created → Employee + Manager
	•	Leave approved → Employee
	•	Leave rejected → Employee
	•	SMTP-ready (Gmail, Zoho, Outlook, etc.)

🔔 Webhooks
	•	Event triggers:
	•	leave_created
	•	leave_approved
	•	leave_rejected
	•	HMAC SHA-256 signature
	•	Delivery logs stored in DB

📊 Audit Trails
	•	Tracks every update
	•	Shows previous → new status
	•	Timestamped logs

🎨 Modern Frontend UI
	•	Built with React 18 + Vite
	•	TailwindCSS styling
	•	Context-based authentication
	•	Protected routes

⸻

🛠 Tech Stack

Category	Technology
Backend Framework	Django 5 + Django REST Framework
Authentication	SimpleJWT + django-allauth
Permissions	Django-Guardian (Object-Level)
Frontend	React 18 + Vite + Tailwind CSS
Database	SQLite (dev), PostgreSQL (prod)
API Client	Axios
Routing	React Router v6
Notifications	Django Email Backend
Webhooks	Custom HMAC-Signed Delivery System


⸻

📥 Installation

Clone the project:

git clone <repository-url>
cd lms-project


⸻

🟩 Backend Setup (Django)

cd backend
pip install -r requirements.txt
python3 manage.py migrate
python3.manage.py createsuperuser
python3 manage.py runserver

Backend runs on:

http://127.0.0.1:8000/


⸻

🟦 Frontend Setup (React + Vite)

cd frontend
npm install
npm run dev

Frontend runs on:

http://localhost:5173/


⸻

📡 API Endpoints Overview

Authentication

POST /api/auth/register/
POST /api/auth/token/
GET  /api/auth/me/

Leaves

GET    /api/leaves/
POST   /api/leaves/
POST   /api/leaves/{id}/action/

Manager Tools

GET /api/manager-queue/
GET /api/manager-stats/


⸻

📊 Database Schema (Core Models)

Model	Description
CustomUser	Employee, Manager, HR roles
LeaveType	Leave categories (Sick, Casual, etc.)
LeaveRequest	Leave applications & workflow state
LeaveAuditLog	Tracks all changes with timestamps
Webhook	URL + secret key + subscribed events
WebhookDelivery	Logs of attempts + responses


⸻

▶️ Running the Project

Start both servers in separate terminals:

1. Backend

python3 manage.py runserver

2. Frontend

npm run dev

Open browser:

http://localhost:5173/


⸻

🧪 Running Tests

cd backend
python3 manage.py test

Includes:
	•	Role-based permission tests
	•	Leave creation workflow
	•	Approve/reject flows
	•	Audit log tests
	•	Webhook signature validation tests

⸻

🔧 Environment Variables (Production)

DEBUG=False
SECRET_KEY=<your-secret>
ALLOWED_HOSTS=yourdomain.com

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password


⸻

🔒 Security
	•	JWT authentication
	•	Role-based permissions
	•	Object-level permissions
	•	Password hashing
	•	CORS-protected API
	•	Signed webhooks (HMAC SHA256)

⸻

👤 Test Users

Role	Username	Password
Employee	testemployee	test123
Manager	testmanager	test123


⸻

📦 Deployment Checklist
	1.	Set DEBUG=False
	2.	Configure SECRET_KEY
	3.	Setup ALLOWED_HOSTS
	4.	Configure SMTP
	5.	Apply database migrations
	6.	Create superuser
	7.	Build frontend (npm run build)
	8.	Setup Gunicorn / uWSGI
	9.	Configure Nginx + HTTPS

⸻

📜 License

This project is for educational purposes.



Just tell me!
