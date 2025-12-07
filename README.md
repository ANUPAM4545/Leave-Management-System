# Leave Management System - Quick Reference

##  Project Overview

A full-stack Leave Management System with role-based access control, audit trails, email notifications, and webhook integration.

**Tech Stack:** Django REST Framework + React + SQLite



## 🚀 How to Run the Servers

You need to open **Two Separate Terminals** to run this project.

### 1. Start the Backend (Django)
This runs on port `8000`.

```bash
# Open Terminal 1
cd backend
python3 -m pip install -r requirements.txt
python3 manage.py migrate
python3 manage.py runserver
```

### 2. Start the Frontend (React)
This runs on port `5173`.

```bash
# Open Terminal 2
cd frontend
npm install
npm run dev
```

### 3. Access the Project
- **Main App**: [http://localhost:5173/](http://localhost:5173/)
- **Backend API**: [http://127.0.0.1:8000/](http://127.0.0.1:8000/)
- **Admin Panel**: [http://127.0.0.1:8000/admin/](http://127.0.0.1:8000/admin/)

---

##  User Roles

| Role | Permissions |
|------|-------------|
| **Employee** | Create leave requests, view own leaves |
| **Manager** | Approve/reject leaves, view all leaves |
| **HR** | View all leaves, manage leave types |

---

##  Key Features

###  Implemented Features
1. **Authentication** - JWT-based with django-allauth
2. **Authorization** - Role-based + object-level (django-guardian)
3. **Leave Management** - Create, approve, reject workflows
4. **Audit Trails** - Complete history of all changes
5. **Email Notifications** - Automated emails on events
6. **Webhooks** - HMAC-signed HTTP callbacks
7. **Testing** - 16 automated tests (100% passing)

---

##  Project Structure

```
lms-project/
├── backend/                 # Django REST API
│   ├── config/             # Settings, URLs
│   ├── users/              # User management
│   ├── leaves/             # Leave logic
│   ├── notifications/      # Emails & webhooks
│   └── db.sqlite3          # Database
│
└── frontend/               # React UI
    ├── src/
    │   ├── api/           # API client
    │   ├── components/    # Reusable components
    │   ├── context/       # State management
    │   └── pages/         # Page components
    └── package.json
```

---

##  Core Models

### Backend Models
- **CustomUser** - User with role (EMPLOYEE/MANAGER/HR)
- **LeaveType** - Leave categories (Sick, Casual, etc.)
- **LeaveRequest** - Leave applications
- **LeaveAuditLog** - Change history
- **Webhook** - Webhook configuration
- **WebhookDelivery** - Delivery tracking

---

##  API Endpoints

### Authentication
```
POST /api/auth/register/     # Register user
POST /api/auth/token/        # Login (get JWT)
GET  /api/auth/me/           # Get current user
```

### Leaves
```
GET    /api/leaves/          # List leaves
POST   /api/leaves/          # Create leave
POST   /api/leaves/{id}/action/  # Approve/reject
```

### Manager
```
GET /api/manager-queue/      # Pending leaves
GET /api/manager-stats/      # Dashboard stats
```

---

##  Workflows

### Leave Creation
1. Employee fills form → POST /api/leaves/
2. Backend creates LeaveRequest
3. Audit log created
4. Email sent to employee + managers
5. Webhook triggered (if configured)

### Leave Approval
1. Manager clicks Approve → POST /api/leaves/{id}/action/
2. Status updated to APPROVED
3. Audit log created
4. Email sent to employee
5. Webhook triggered



##  Technology Details

### Backend
- **Django 5.2.8** - Web framework
- **Django REST Framework** - API
- **djangorestframework-simplejwt** - JWT auth
- **django-allauth** - Email verification, password reset
- **django-guardian** - Object-level permissions
- **SQLite** - Database

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **React Router** - Routing

---

##  Email Notifications

**Development:** Console backend (prints to terminal)
**Production:** Configure SMTP in settings.py

**Events:**
- Leave created → Employee + Managers
- Leave approved → Employee
- Leave rejected → Employee

---

##  Webhooks

**Setup:**
1. Create webhook in Django admin
2. Set URL and secret key
3. Subscribe to events (leave_created, leave_approved, leave_rejected)

**Security:** HMAC SHA256 signature in `X-Webhook-Signature` header

**Payload Example:**
```json
{
  "event": "leave_approved",
  "timestamp": "2025-12-01T12:00:00Z",
  "data": {
    "leave_id": 5,
    "employee": {...},
    "status": "APPROVED"
  }
}
```

---

##  Testing

**Run Tests:**
```bash
cd backend
python3 manage.py test
```

**Test Coverage:**
- 16 tests total
- Leave creation workflow
- Approval/rejection flows
- Permissions
- Audit trails
- Webhooks

---

##  Database Schema

```
CustomUser
├── id, username, email, role

LeaveType
├── id, name, days_allowed

LeaveRequest
├── id, user_id, leave_type_id
├── start_date, end_date, reason
├── status, manager_comment
└── created_at, updated_at

LeaveAuditLog
├── id, leave_id, action_by_id
├── action, previous_status, new_status
├── comment, timestamp

Webhook
├── id, webhook_id, event_type
├── payload, response_status
└── success, delivered_at
```

---

##  Frontend Pages

| Page | Route | Role | Description |
|------|-------|------|-------------|
| Login | `/login` | All | User login |
| Signup | `/signup` | All | Registration |
| Employee Dashboard | `/employee` | Employee | View own leaves |
| Create Leave | `/create-leave` | Employee | Request leave |
| Manager Dashboard | `/manager` | Manager | Overview |
| Manager Queue | `/manager-queue` | Manager | Approve/reject |
| HR Dashboard | `/hr` | HR | All leaves |

---

##  Security Features

-  JWT authentication
-  Role-based access control
-  Object-level permissions
-  CSRF protection
-  CORS configuration
-  HMAC webhook signing
-  Password hashing (Django default)

---

##  Environment Variables

**Development:** No .env needed (uses defaults)

**Production:**
```bash
DEBUG=False
SECRET_KEY=<random-secret-key>
ALLOWED_HOSTS=yourdomain.com
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
```



##  Common Issues & Solutions

### Issue: "Module not found"
**Solution:** Install dependencies
```bash
cd backend && pip install -r requirements.txt
cd frontend && npm install
```

### Issue: "Database is locked"
**Solution:** Close other Django processes
```bash
pkill -f runserver
```

### Issue: "CORS error"
**Solution:** Check CORS_ALLOWED_ORIGINS in settings.py

### Issue: "401 Unauthorized"
**Solution:** Check JWT token in localStorage

---

##  Documentation Files

- **TECHNICAL_DOCUMENTATION.md** - Complete technical guide (2000+ lines)
- **README.md** - This file (quick reference)
- **walkthrough.md** - Feature testing results

---

##  Evaluation Points

### Backend
 - Django models with relationships
 - REST API with DRF
 - JWT authentication
 -  Role-based permissions
 - Audit trail implementation
 - Email notifications
 - Webhook delivery system
 -  Comprehensive tests (16 tests)

### Frontend
 React components
 Context API for state
 Protected routes
 API integration
 Responsive design
 Dark mode support

### Features
 Complete CRUD operations
 Approval workflow
 Real-time notifications
 External integrations (webhooks)
 Security best practices



##  Deployment Checklistc

- [ ] Set DEBUG=False
- [ ] Configure SECRET_KEY
- [ ] Set ALLOWED_HOSTS
- [ ] Configure email (SMTP)
- [ ] Run migrations
- [ ] Create superuser
- [ ] Collect static files
- [ ] Build frontend (npm run build)
- [ ] Set up Gunicorn/uWSGI
- [ ] Configure Nginx
- [ ] Enable HTTPS



##  Support

For detailed documentation, see **TECHNICAL_DOCUMENTATION.md**

**Test Users:**
- Username: `testemployee` / Password: `test123` (Employee)
- Username: `testmanager` / Password: `test123` (Manager)



##  License

This project is for educational purposes.


**Last Updated:** December 2025
**Version:** 1.0.0
# Leave-Management-System
# Leave-Management-System
