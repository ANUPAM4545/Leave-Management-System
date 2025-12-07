🌟 Leave Management System (LMS)

A full-stack role-based Leave Management System built with Django REST + React.

<p align="center">
  <img src="https://img.shields.io/badge/Frontend-React-blue?style=flat-square" />
  <img src="https://img.shields.io/badge/Backend-Django%20REST%20Framework-green?style=flat-square" />
  <img src="https://img.shields.io/badge/Database-SQLite-lightgrey?style=flat-square" />
  <img src="https://img.shields.io/badge/Tests-100%25%20Passing-brightgreen?style=flat-square" />
</p>



⸻

🚀 1. Project Overview

The Leave Management System is a full-stack application featuring:
	1.	Role-Based Access Control
	2.	JWT Authentication
	3.	Leave Request + Approval System
	4.	Audit Logs for tracking changes
	5.	Email Notifications
	6.	Webhook Delivery System with HMAC security
	7.	16 Automated Backend Tests (all passing)

⸻

📁 2. Project Structure

lms-project/
├── backend/
│   ├── config/
│   ├── users/
│   ├── leaves/
│   ├── notifications/
│   └── db.sqlite3
│
└── frontend/
    ├── src/
    │   ├── api/
    │   ├── components/
    │   ├── context/
    │   └── pages/
    └── package.json


⸻

🖥️ 3. How to Run the Project

🟩 3.1 Backend (Django) — Port 8000

cd lms-project/backend
pip install -r requirements.txt
python3 manage.py migrate
python3 manage.py createsuperuser
python3 manage.py runserver

🟦 3.2 Frontend (React + Vite) — Port 5173

cd lms-project/frontend
npm install
npm run dev


⸻

🌐 4. Access URLs

Service	URL
Frontend App	http://localhost:5173/
Backend API	http://127.0.0.1:8000/
Admin Panel	http://127.0.0.1:8000/admin/


⸻

👥 5. User Roles

Role	Permissions
Employee	Create & view personal leaves
Manager	Approve or reject leaves
HR	Manage leave categories & view all leaves


⸻

⚙️ 6. Features

🔒 6.1 Authentication
	1.	JWT-based login
	2.	Email verification
	3.	Password reset flow

📝 6.2 Leave Workflow
	1.	Apply for leave
	2.	Manager approval or rejection
	3.	Status updates
	4.	History tracking

📧 6.3 Notifications
	1.	Email for leave created
	2.	Email for leave approved
	3.	Email for leave rejected

🔔 6.4 Webhooks
	1.	HMAC SHA256 signed payload
	2.	Delivery logs
	3.	Event triggers (created, approved, rejected)

🗂️ 6.5 Security
	1.	JWT
	2.	CORS configuration
	3.	Password hashing
	4.	Object-level permissions

⸻

🔌 7. API Endpoints

7.1 Auth

POST /api/auth/register/
POST /api/auth/token/
GET  /api/auth/me/

7.2 Leaves

GET    /api/leaves/
POST   /api/leaves/
POST   /api/leaves/{id}/action/

7.3 Manager

GET /api/manager-queue/
GET /api/manager-stats/


⸻

🔄 8. Core Workflows

🟪 8.1 Leave Creation
	1.	Employee submits leave
	2.	LeaveRequest created
	3.	Audit log entry added
	4.	Email notification sent
	5.	Webhook triggered

🟧 8.2 Leave Approval
	1.	Manager performs action
	2.	Status updated
	3.	Audit entry recorded
	4.	Email notification sent
	5.	Webhook triggered

⸻

🧪 9. Testing

Run backend tests:

cd backend
python3.manage.py test

Tests include:
	1.	Permission testing
	2.	Leave creation
	3.	Approval flow
	4.	Audit logs
	5.	Webhooks

⸻

🗄️ 10. Database Schema

CustomUser (role, email, username)
LeaveType (name, allowed_days)
LeaveRequest (user, type, dates, reason, status)
LeaveAuditLog (leave, action, old_status, new_status)
Webhook (event_type, url, secret)
WebhookDelivery (payload, response_status)


⸻

🎨 11. Frontend Pages

Page	Route	Role
Login	/login	All
Signup	/signup	All
Employee Dashboard	/employee	Employee
Create Leave	/create-leave	Employee
Manager Dashboard	/manager	Manager
Manager Queue	/manager-queue	Manager
HR Dashboard	/hr	HR


⸻

📬 12. Email Events
	1.	Leave created → Employee + Manager
	2.	Leave approved → Employee
	3.	Leave rejected → Employee

⸻

🔐 13. Environment Variables (Production)

DEBUG=False
SECRET_KEY=<your-secret-key>
ALLOWED_HOSTS=yourdomain.com
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password


⸻

📦 14. Deployment Checklist
	1.	DEBUG=False
	2.	SECRET_KEY configured
	3.	ALLOWED_HOSTS updated
	4.	SMTP email set up
	5.	Migrations applied
	6.	Superuser created
	7.	Frontend build generated
	8.	Gunicorn/uWSGI configured
	9.	Nginx + HTTPS enabled

⸻

👤 15. Test Users

Role	Username	Password
Employee	testemployee	test123
Manager	testmanager	test123


⸻

📘 16. Documentation
	•	TECHNICAL_DOCUMENTATION.md
	•	walkthrough.md
	•	README.md

⸻

📄 17. License

This project is for educational purposes.

