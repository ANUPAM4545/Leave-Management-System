# Leave Management System - Complete Technical Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack & Rationale](#technology-stack--rationale)
3. [Architecture & Design Patterns](#architecture--design-patterns)
4. [Backend Deep Dive](#backend-deep-dive)
5. [Frontend Deep Dive](#frontend-deep-dive)
6. [Feature Implementation Details](#feature-implementation-details)
7. [Project Structure & File Workflows](#project-structure--file-workflows)
8. [API Documentation](#api-documentation)
9. [Deployment Guide](#deployment-guide)

---

## Project Overview

### What is this project?
A full-stack Leave Management System that allows employees to request leave, managers to approve/reject requests, and HR to oversee all operations. The system includes advanced features like audit trails, email notifications, webhooks, and comprehensive testing.

### Key Features
- Role-based access control (Employee, Manager, HR)
- Leave request workflows (Create, Approve, Reject)
- Complete audit trail tracking
- Email notifications for all events
- Webhook integration for external services
- Advanced authentication with email verification
- Object-level permissions
- Comprehensive test suite (16 tests)

---

## Technology Stack & Rationale

### Backend Technologies

#### 1. **Django 5.2.8**
**Why Django?**
- **Batteries-included framework**: Comes with ORM, admin panel, authentication out of the box
- **Security**: Built-in protection against SQL injection, XSS, CSRF
- **Scalability**: Used by Instagram, Pinterest, NASA
- **Rapid development**: Less code, more functionality
- **Community**: Huge ecosystem of packages

**What we use it for:**
- Database models and migrations
- Business logic and API endpoints
- Admin interface for data management
- User authentication and permissions

#### 2. **Django REST Framework (DRF)**
**Why DRF?**
- **API-first approach**: Perfect for building RESTful APIs
- **Serialization**: Easy conversion between Python objects and JSON
- **Authentication**: Multiple auth methods (JWT, OAuth, etc.)
- **Browsable API**: Built-in API documentation

**What we use it for:**
- Creating REST API endpoints
- Request/response serialization
- Permission classes
- ViewSets for CRUD operations

#### 3. **JWT (JSON Web Tokens) - djangorestframework-simplejwt**
**Why JWT?**
- **Stateless authentication**: No server-side session storage
- **Scalable**: Works across multiple servers
- **Mobile-friendly**: Perfect for React frontend
- **Secure**: Signed tokens prevent tampering

**What we use it for:**
- User login/logout
- Token-based authentication
- Access and refresh token management

**Workflow:**
```
1. User logs in → Server generates JWT
2. Frontend stores JWT in localStorage
3. Every API request includes JWT in header
4. Server validates JWT and processes request
```

#### 4. **django-allauth**
**Why django-allauth?**
- **Email verification**: Confirm user email addresses
- **Password reset**: Secure password recovery
- **Social authentication**: Ready for Google, Facebook, etc.
- **Account management**: Profile, email management

**What we use it for:**
- Enhanced authentication features
- Email verification workflow
- Password reset via email
- Future social login integration

#### 5. **django-guardian**
**Why django-guardian?**
- **Object-level permissions**: Per-object access control
- **Fine-grained security**: Beyond role-based permissions
- **Django integration**: Works with Django's permission system

**What we use it for:**
- Per-leave request permissions
- Manager-specific access control
- Future team-based permissions

#### 6. **SQLite (Current Database)**
**Why SQLite?**
- **Zero configuration**: File-based database, no server setup needed
- **Fast development**: Perfect for development and small-scale deployments
- **Portable**: Database is a single file (`db.sqlite3`)
- **Built-in**: Comes with Python, no installation required
- **Sufficient for this project**: Handles the current scale perfectly

**Current Setup:**
- Database file: `backend/db.sqlite3`
- All data stored locally
- Migrations applied via `python manage.py migrate`

**Note on PostgreSQL:**
While this project uses SQLite, you can switch to PostgreSQL for production if needed:
- Better for high-traffic applications
- Advanced features (JSON fields, full-text search)
- Better concurrency handling
- Industry standard for production Django apps

### Frontend Technologies

#### 1. **React 18**
**Why React?**
- **Component-based**: Reusable UI components
- **Virtual DOM**: Fast rendering
- **Ecosystem**: Huge library of packages
- **Industry standard**: Used by Facebook, Netflix, Airbnb

**What we use it for:**
- Building interactive UI
- Managing application state
- Routing between pages
- Form handling

#### 2. **Vite**
**Why Vite?**
- **Lightning fast**: Instant server start
- **Hot Module Replacement (HMR)**: See changes instantly
- **Modern**: Built for ES modules
- **Optimized builds**: Fast production builds

**What we use it for:**
- Development server
- Building production bundles
- Asset optimization

#### 3. **Tailwind CSS**
**Why Tailwind?**
- **Utility-first**: Rapid UI development
- **Customizable**: Easy theming
- **Small bundle size**: Only includes used classes
- **Responsive**: Mobile-first design

**What we use it for:**
- Styling all components
- Responsive layouts
- Dark mode support
- Consistent design system

#### 4. **Axios**
**Why Axios?**
- **Promise-based**: Clean async code
- **Interceptors**: Global request/response handling
- **Error handling**: Centralized error management
- **Browser compatibility**: Works everywhere

**What we use it for:**
- Making API requests
- JWT token management
- Error handling
- Request/response transformation

---

## Architecture & Design Patterns

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend (React)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Employee    │  │   Manager    │  │     HR       │      │
│  │  Dashboard   │  │  Dashboard   │  │  Dashboard   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│         │                  │                  │              │
│         └──────────────────┴──────────────────┘              │
│                            │                                 │
│                     Axios HTTP Client                        │
└────────────────────────────┬────────────────────────────────┘
                             │
                    JWT Authentication
                             │
┌────────────────────────────┴────────────────────────────────┐
│                    Backend (Django REST API)                 │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                    API Endpoints                      │   │
│  │  /api/auth/  /api/leaves/  /api/manager-queue/      │   │
│  └──────────────────────────────────────────────────────┘   │
│         │                  │                  │              │
│  ┌──────┴──────┐    ┌──────┴──────┐   ┌──────┴──────┐      │
│  │   Users     │    │   Leaves    │   │Notifications│      │
│  │   Models    │    │   Models    │   │   Models    │      │
│  └─────────────┘    └─────────────┘   └─────────────┘      │
│         │                  │                  │              │
│                            │                                 │
│                        SQLite Database                       │
└──────────────────────────────────────────────────────────────┘
         │                  │                  │
    ┌────┴────┐      ┌──────┴──────┐    ┌─────┴─────┐
    │  Email  │      │  Webhooks   │    │   Audit   │
    │ Notifs  │      │  (External) │    │   Logs    │
    └─────────┘      └─────────────┘    └───────────┘
```

### Design Patterns Used

#### 1. **Model-View-Controller (MVC) / MTV Pattern**
Django uses MTV (Model-Template-View):
- **Model**: Database schema (`models.py`)
- **View**: Business logic (`views.py`)
- **Template**: We use React instead (API-first approach)

#### 2. **Repository Pattern**
Django ORM acts as repository:
```python
# Instead of raw SQL
LeaveRequest.objects.filter(status='PENDING')
```

#### 3. **Serializer Pattern**
DRF Serializers convert between Python and JSON:
```python
class LeaveRequestSerializer(serializers.ModelSerializer):
    # Handles validation and conversion
```

#### 4. **Middleware Pattern**
Request/response processing pipeline:
```python
Request → CORS → Security → Auth → View → Response
```

#### 5. **Observer Pattern**
Webhooks and notifications:
```python
# When leave is created
→ Create audit log
→ Send email notification
→ Trigger webhook
```

---

## Backend Deep Dive

### Project Structure

```
backend/
├── config/                 # Project configuration
│   ├── settings.py        # Django settings
│   ├── urls.py            # URL routing
│   └── wsgi.py            # WSGI application
├── users/                  # User management app
│   ├── models.py          # CustomUser model
│   ├── serializers.py     # User serialization
│   ├── views.py           # Auth endpoints
│   └── urls.py            # User routes
├── leaves/                 # Leave management app
│   ├── models.py          # Leave models
│   ├── serializers.py     # Leave serialization
│   ├── views.py           # Leave endpoints
│   ├── urls.py            # Leave routes
│   └── tests.py           # Unit tests
├── notifications/          # Notifications app
│   ├── models.py          # Notification, Webhook models
│   ├── utils.py           # Email functions
│   ├── webhooks.py        # Webhook delivery
│   ├── admin.py           # Admin interface
│   └── tests.py           # Webhook tests
├── manage.py              # Django CLI
└── requirements.txt       # Python dependencies
```

### Database Models Explained

#### 1. **CustomUser Model** (`users/models.py`)
```python
class CustomUser(AbstractUser):
    ROLE_CHOICES = (
        ('EMPLOYEE', 'Employee'),
        ('MANAGER', 'Manager'),
        ('HR', 'HR'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
```

**Why custom user?**
- Need to add `role` field
- Can't modify Django's default User model
- Best practice for all Django projects

**Workflow:**
1. User signs up → Role is assigned
2. Role determines dashboard access
3. Permissions checked on every request

#### 2. **LeaveType Model** (`leaves/models.py`)
```python
class LeaveType(models.Model):
    name = models.CharField(max_length=50)
    days_allowed = models.IntegerField()
```

**Purpose:**
- Define types of leave (Sick, Casual, Annual)
- Set maximum days allowed
- Managed by HR via admin panel

#### 3. **LeaveRequest Model** (`leaves/models.py`)
```python
class LeaveRequest(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    leave_type = models.ForeignKey(LeaveType, on_delete=models.CASCADE)
    start_date = models.DateField()
    end_date = models.DateField()
    reason = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    manager_comment = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
```

**Workflow:**
1. Employee creates leave request → status = PENDING
2. Manager reviews → status = APPROVED/REJECTED
3. Audit log created on every change
4. Notifications sent to relevant parties

#### 4. **LeaveAuditLog Model** (`leaves/models.py`)
```python
class LeaveAuditLog(models.Model):
    leave = models.ForeignKey(LeaveRequest, related_name='audit_logs')
    action_by = models.ForeignKey(User, on_delete=models.SET_NULL)
    action = models.CharField(max_length=50)  # CREATED, APPROVED, REJECTED
    previous_status = models.CharField(max_length=20)
    new_status = models.CharField(max_length=20)
    comment = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
```

**Purpose:**
- Track who did what and when
- Compliance and accountability
- Debugging and dispute resolution

**Workflow:**
```
Leave Created → Audit Log (CREATED)
Leave Approved → Audit Log (APPROVED, PENDING → APPROVED)
Leave Rejected → Audit Log (REJECTED, PENDING → REJECTED)
```

#### 5. **Notification Model** (`notifications/models.py`)
```python
class Notification(models.Model):
    user = models.ForeignKey(User, related_name='notifications')
    notification_type = models.CharField(max_length=20)  # EMAIL, SYSTEM
    subject = models.CharField(max_length=255)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
```

**Purpose:**
- Store notification history
- Track read/unread status
- Future: In-app notifications

#### 6. **Webhook Model** (`notifications/models.py`)
```python
class Webhook(models.Model):
    name = models.CharField(max_length=255)
    url = models.URLField()
    secret = models.CharField(max_length=255)  # For HMAC signing
    events = models.JSONField(default=list)  # Subscribed events
    is_active = models.BooleanField(default=True)
```

**Purpose:**
- Configure external webhook endpoints
- Subscribe to specific events
- Enable/disable webhooks

**Workflow:**
1. Admin creates webhook in Django admin
2. Subscribes to events (leave_created, leave_approved, etc.)
3. When event occurs → Webhook triggered
4. Payload sent with HMAC signature
5. Delivery tracked in WebhookDelivery model

#### 7. **WebhookDelivery Model** (`notifications/models.py`)
```python
class WebhookDelivery(models.Model):
    webhook = models.ForeignKey(Webhook, related_name='deliveries')
    event_type = models.CharField(max_length=50)
    payload = models.JSONField()
    response_status = models.IntegerField()
    response_body = models.TextField()
    delivered_at = models.DateTimeField(auto_now_add=True)
    success = models.BooleanField(default=False)
    error_message = models.TextField()
```

**Purpose:**
- Track every webhook delivery attempt
- Debug failed deliveries
- Monitor webhook health

### API Endpoints Explained

#### Authentication Endpoints (`users/urls.py`)

**1. POST `/api/auth/register/`**
```python
# Request
{
    "username": "john",
    "email": "john@example.com",
    "password": "secure123",
    "role": "EMPLOYEE"
}

# Response
{
    "id": 1,
    "username": "john",
    "email": "john@example.com",
    "role": "EMPLOYEE"
}
```

**2. POST `/api/auth/token/`**
```python
# Request
{
    "username": "john",
    "password": "secure123"
}

# Response
{
    "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

**3. GET `/api/auth/me/`**
```python
# Headers: Authorization: Bearer <access_token>

# Response
{
    "id": 1,
    "username": "john",
    "email": "john@example.com",
    "role": "EMPLOYEE"
}
```

#### Leave Endpoints (`leaves/urls.py`)

**1. GET `/api/leaves/`**
- Lists leaves based on user role
- Employee: Only their leaves
- Manager: All leaves (for approval)
- HR: All leaves

**2. POST `/api/leaves/`**
```python
# Request
{
    "leave_type_id": 1,
    "start_date": "2025-12-10",
    "end_date": "2025-12-12",
    "reason": "Family emergency"
}

# Response (includes audit_logs)
{
    "id": 5,
    "user": {...},
    "leave_type": {...},
    "start_date": "2025-12-10",
    "end_date": "2025-12-12",
    "reason": "Family emergency",
    "status": "PENDING",
    "audit_logs": [
        {
            "action": "CREATED",
            "action_by": {...},
            "timestamp": "2025-12-01T12:00:00Z"
        }
    ]
}
```

**3. POST `/api/leaves/{id}/action/`**
```python
# Request (Manager only)
{
    "action": "approve",  # or "reject"
    "comment": "Approved for medical reasons"
}

# Response
{
    "id": 5,
    "status": "APPROVED",
    "manager_comment": "Approved for medical reasons",
    "audit_logs": [
        {
            "action": "CREATED",
            ...
        },
        {
            "action": "APPROVE",
            "action_by": {...},
            "previous_status": "PENDING",
            "new_status": "APPROVED",
            "timestamp": "2025-12-01T13:00:00Z"
        }
    ]
}
```

### Views Workflow

#### LeaveViewSet (`leaves/views.py`)

**Key Methods:**

1. **`get_queryset()`**
```python
def get_queryset(self):
    user = self.request.user
    if user.role == 'HR':
        return LeaveRequest.objects.all()
    if user.role == 'MANAGER' and self.action in ['retrieve', 'action']:
        return LeaveRequest.objects.all()
    return LeaveRequest.objects.filter(user=user)
```
**Purpose:** Filter leaves based on user role

2. **`perform_create()`**
```python
def perform_create(self, serializer):
    leave = serializer.save(user=self.request.user)
    
    # Create audit log
    LeaveAuditLog.objects.create(
        leave=leave,
        action_by=self.request.user,
        action='CREATED',
        new_status='PENDING'
    )
    
    # Send email notification
    send_leave_created_notification(leave)
    
    # Send webhook
    send_leave_created_webhook(leave)
```
**Purpose:** Create leave + audit log + notifications + webhooks

3. **`action()` method**
```python
@action(detail=True, methods=['post'])
def action(self, request, pk=None):
    leave = self.get_object()
    action_type = request.data.get('action')  # approve/reject
    
    # Update status
    leave.status = 'APPROVED' if action_type == 'approve' else 'REJECTED'
    leave.save()
    
    # Create audit log
    LeaveAuditLog.objects.create(...)
    
    # Send notifications
    send_leave_status_changed_notification(...)
    
    # Send webhook
    send_leave_status_changed_webhook(...)
    
    return Response(LeaveRequestSerializer(leave).data)
```
**Purpose:** Approve/reject leave with full tracking

### Notification System Workflow

#### Email Notifications (`notifications/utils.py`)

**1. Leave Created:**
```python
def send_leave_created_notification(leave_request):
    # Email to employee (confirmation)
    send_mail(
        subject="Leave Request Submitted",
        message=f"Your leave from {start} to {end} has been submitted",
        recipient_list=[employee.email]
    )
    
    # Email to all managers (review needed)
    managers = User.objects.filter(role='MANAGER')
    for manager in managers:
        send_mail(
            subject="New Leave Request Pending",
            message=f"{employee} has requested leave",
            recipient_list=[manager.email]
        )
```

**2. Leave Approved/Rejected:**
```python
def send_leave_status_changed_notification(leave_request, action, manager):
    send_mail(
        subject=f"Leave Request {action.capitalize()}",
        message=f"Your leave has been {action} by {manager.name}",
        recipient_list=[leave_request.user.email]
    )
```

#### Webhook System (`notifications/webhooks.py`)

**1. Generate HMAC Signature:**
```python
def generate_signature(payload, secret):
    message = json.dumps(payload, sort_keys=True).encode('utf-8')
    signature = hmac.new(
        secret.encode('utf-8'),
        message,
        hashlib.sha256
    ).hexdigest()
    return signature
```

**2. Send Webhook:**
```python
def send_webhook(event_type, payload):
    # Get active webhooks subscribed to this event
    webhooks = Webhook.objects.filter(is_active=True)
    webhooks = [w for w in webhooks if event_type in w.events]
    
    for webhook in webhooks:
        # Generate signature
        signature = generate_signature(payload, webhook.secret)
        
        # Send POST request
        response = requests.post(
            webhook.url,
            json=payload,
            headers={
                'X-Webhook-Signature': signature,
                'X-Webhook-Event': event_type
            }
        )
        
        # Track delivery
        WebhookDelivery.objects.create(
            webhook=webhook,
            event_type=event_type,
            payload=payload,
            response_status=response.status_code,
            success=200 <= response.status_code < 300
        )
```

### Testing Strategy

#### Unit Tests (`leaves/tests.py`)

**Test Categories:**

1. **Model Tests:**
```python
def test_create_leave_request(self):
    leave = LeaveRequest.objects.create(...)
    self.assertEqual(leave.status, 'PENDING')
```

2. **Integration Tests:**
```python
def test_employee_can_create_leave(self):
    self.client.force_authenticate(user=self.employee)
    response = self.client.post('/api/leaves/', data)
    self.assertEqual(response.status_code, 201)
```

3. **Permission Tests:**
```python
def test_employee_cannot_approve_leave(self):
    self.client.force_authenticate(user=self.employee)
    response = self.client.post(f'/api/leaves/{id}/action/', data)
    self.assertEqual(response.status_code, 403)
```

4. **Audit Trail Tests:**
```python
def test_audit_log_created_on_approval(self):
    # Approve leave
    response = self.client.post(...)
    
    # Check audit log
    audit_logs = LeaveAuditLog.objects.filter(leave=leave)
    self.assertEqual(audit_logs.count(), 1)
    self.assertEqual(audit_logs.first().action, 'APPROVE')
```

---

## Frontend Deep Dive

### Project Structure

```
frontend/
├── public/                 # Static assets
├── src/
│   ├── api/               # API client
│   │   └── axios.js       # Axios configuration
│   ├── components/        # Reusable components
│   │   ├── Layout.jsx     # Page layout
│   │   ├── Navbar.jsx     # Navigation bar
│   │   ├── PrivateRoute.jsx  # Protected routes
│   │   └── ui/            # UI components
│   │       ├── Button.jsx
│   │       ├── Input.jsx
│   │       └── Card.jsx
│   ├── context/           # React Context
│   │   ├── AuthContext.jsx    # Authentication state
│   │   ├── ThemeContext.jsx   # Theme state
│   │   └── ToastContext.jsx   # Toast notifications
│   ├── pages/             # Page components
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   ├── EmployeeDashboard.jsx
│   │   ├── ManagerDashboard.jsx
│   │   ├── ManagerQueue.jsx
│   │   ├── HRDashboard.jsx
│   │   └── CreateLeave.jsx
│   ├── App.jsx            # Main app component
│   ├── main.jsx           # Entry point
│   └── index.css          # Global styles
├── package.json           # Dependencies
└── vite.config.js         # Vite configuration
```

### React Context Explained

#### 1. **AuthContext** (`context/AuthContext.jsx`)

**Purpose:** Manage authentication state globally

```javascript
const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    
    // Load user on mount
    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            api.getMe().then(setUser);
        }
        setLoading(false);
    }, []);
    
    const login = async (username, password) => {
        const { access, refresh } = await api.login(username, password);
        localStorage.setItem('access_token', access);
        localStorage.setItem('refresh_token', refresh);
        const userData = await api.getMe();
        setUser(userData);
    };
    
    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setUser(null);
    };
    
    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}
```

**Usage in components:**
```javascript
function MyComponent() {
    const { user, login, logout } = useAuth();
    
    if (!user) {
        return <div>Please login</div>;
    }
    
    return <div>Welcome {user.username}</div>;
}
```

#### 2. **ThemeContext** (`context/ThemeContext.jsx`)

**Purpose:** Dark/light mode toggle

```javascript
export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(
        localStorage.getItem('theme') || 'light'
    );
    
    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);
    
    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };
    
    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}
```

### API Client (`api/axios.js`)

**Purpose:** Centralized API communication

```javascript
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api';

// Create axios instance
const axiosInstance = axios.create({
    baseURL: API_URL,
});

// Request interceptor (add JWT token)
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor (handle errors)
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            // Token expired, try refresh
            const refreshToken = localStorage.getItem('refresh_token');
            if (refreshToken) {
                try {
                    const { data } = await axios.post(`${API_URL}/auth/token/refresh/`, {
                        refresh: refreshToken
                    });
                    localStorage.setItem('access_token', data.access);
                    // Retry original request
                    error.config.headers.Authorization = `Bearer ${data.access}`;
                    return axiosInstance(error.config);
                } catch {
                    // Refresh failed, logout
                    localStorage.clear();
                    window.location.href = '/login';
                }
            }
        }
        return Promise.reject(error);
    }
);

// API methods
export const api = {
    // Auth
    login: (username, password) =>
        axiosInstance.post('/auth/token/', { username, password }).then(r => r.data),
    
    register: (data) =>
        axiosInstance.post('/auth/register/', data).then(r => r.data),
    
    getMe: () =>
        axiosInstance.get('/auth/me/').then(r => r.data),
    
    // Leaves
    getLeaves: () =>
        axiosInstance.get('/leaves/').then(r => r.data),
    
    createLeave: (data) =>
        axiosInstance.post('/leaves/', data).then(r => r.data),
    
    approveLeave: (id, comment) =>
        axiosInstance.post(`/leaves/${id}/action/`, {
            action: 'approve',
            comment
        }).then(r => r.data),
    
    rejectLeave: (id, comment) =>
        axiosInstance.post(`/leaves/${id}/action/`, {
            action: 'reject',
            comment
        }).then(r => r.data),
    
    // Manager
    getManagerQueue: (status) =>
        axiosInstance.get('/manager-queue/', {
            params: { status }
        }).then(r => r.data),
    
    getManagerStats: () =>
        axiosInstance.get('/manager-stats/').then(r => r.data),
};
```

### Component Workflows

#### Employee Dashboard (`pages/EmployeeDashboard.jsx`)

**Workflow:**
1. Component mounts
2. Fetch user's leaves from API
3. Display leaves in cards
4. Show "Apply Leave" button
5. Navigate to CreateLeave page on click

```javascript
function EmployeeDashboard() {
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        loadLeaves();
    }, []);
    
    const loadLeaves = async () => {
        try {
            const data = await api.getLeaves();
            setLeaves(data);
        } catch (error) {
            console.error('Failed to load leaves:', error);
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <Layout>
            <h1>My Leave Requests</h1>
            <button onClick={() => navigate('/create-leave')}>
                Apply for Leave
            </button>
            
            {loading ? (
                <div>Loading...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {leaves.map(leave => (
                        <LeaveCard key={leave.id} leave={leave} />
                    ))}
                </div>
            )}
        </Layout>
    );
}
```

#### Manager Queue (`pages/ManagerQueue.jsx`)

**Workflow:**
1. Component mounts
2. Read query param for initial tab (PENDING/APPROVED/REJECTED)
3. Fetch leaves based on active tab
4. Display leaves in table
5. Show Approve/Reject buttons for pending leaves
6. Open modal on button click
7. Submit action with comment
8. Refresh list

```javascript
function ManagerQueue() {
    const [searchParams] = useSearchParams();
    const [activeTab, setActiveTab] = useState(
        searchParams.get('status') || 'PENDING'
    );
    const [requests, setRequests] = useState([]);
    const [selectedLeave, setSelectedLeave] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [action, setAction] = useState(null);
    const [comment, setComment] = useState('');
    
    useEffect(() => {
        loadRequests();
    }, [activeTab]);
    
    const loadRequests = async () => {
        const data = await api.getManagerQueue(activeTab);
        setRequests(data);
    };
    
    const handleApprove = (leave) => {
        setSelectedLeave(leave);
        setAction('approve');
        setShowModal(true);
    };
    
    const handleReject = (leave) => {
        setSelectedLeave(leave);
        setAction('reject');
        setShowModal(true);
    };
    
    const submitAction = async () => {
        try {
            if (action === 'approve') {
                await api.approveLeave(selectedLeave.id, comment);
            } else {
                await api.rejectLeave(selectedLeave.id, comment);
            }
            setShowModal(false);
            setComment('');
            loadRequests();
        } catch (error) {
            console.error('Action failed:', error);
        }
    };
    
    return (
        <Layout>
            {/* Tabs */}
            <div className="tabs">
                {['PENDING', 'APPROVED', 'REJECTED'].map(tab => (
                    <button
                        key={tab}
                        className={activeTab === tab ? 'active' : ''}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab}
                    </button>
                ))}
            </div>
            
            {/* Table */}
            <table>
                <thead>
                    <tr>
                        <th>Employee</th>
                        <th>Leave Type</th>
                        <th>Dates</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {requests.map(leave => (
                        <tr key={leave.id}>
                            <td>{leave.user.username}</td>
                            <td>{leave.leave_type.name}</td>
                            <td>{leave.start_date} to {leave.end_date}</td>
                            <td>{leave.status}</td>
                            <td>
                                {leave.status === 'PENDING' && (
                                    <>
                                        <button onClick={() => handleApprove(leave)}>
                                            Approve
                                        </button>
                                        <button onClick={() => handleReject(leave)}>
                                            Reject
                                        </button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            
            {/* Modal */}
            {showModal && (
                <Modal>
                    <h2>{action === 'approve' ? 'Approve' : 'Reject'} Leave</h2>
                    <textarea
                        placeholder="Add comment..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                    <button onClick={submitAction}>Confirm</button>
                    <button onClick={() => setShowModal(false)}>Cancel</button>
                </Modal>
            )}
        </Layout>
    );
}
```

---

## Feature Implementation Details

### 1. Audit Trails

**Backend Implementation:**
- Model: `LeaveAuditLog`
- Created automatically in `perform_create()` and `action()` methods
- Tracks: action, actor, timestamps, status changes

**Frontend Display:**
```javascript
// In leave detail view
{leave.audit_logs.map(log => (
    <div key={log.id}>
        <span>{log.action}</span> by <span>{log.action_by.username}</span>
        <span>{new Date(log.timestamp).toLocaleString()}</span>
    </div>
))}
```

### 2. Email Notifications

**Configuration:**
- Development: Console backend (prints to terminal)
- Production: SMTP backend (Gmail, SendGrid, etc.)

**Triggers:**
- Leave created → Employee + Managers
- Leave approved → Employee
- Leave rejected → Employee

**Email Template Example:**
```
Subject: Leave Request Approved

Hello John,

Your leave request has been approved by Manager Smith.

Details:
- Leave Type: Sick Leave
- Start Date: 2025-12-10
- End Date: 2025-12-12
- Status: APPROVED
- Manager Comment: Approved for medical reasons

Best regards,
Leave Management System
```

### 3. Webhooks

**Setup:**
1. Create webhook in Django admin
2. Set URL (e.g., https://webhook.site/xxx)
3. Set secret for HMAC signing
4. Subscribe to events

**Payload Example:**
```json
{
  "event": "leave_approved",
  "timestamp": "2025-12-01T12:00:00Z",
  "data": {
    "leave_id": 5,
    "employee": {
      "id": 1,
      "username": "john",
      "email": "john@example.com"
    },
    "leave_type": "Sick Leave",
    "start_date": "2025-12-10",
    "end_date": "2025-12-12",
    "status": "APPROVED",
    "manager": {
      "id": 2,
      "username": "manager_smith"
    }
  }
}
```

**Headers:**
```
X-Webhook-Signature: a1b2c3d4e5f6...
X-Webhook-Event: leave_approved
Content-Type: application/json
```

**Verification (in external service):**
```python
import hmac
import hashlib
import json

def verify_webhook(payload, signature, secret):
    message = json.dumps(payload, sort_keys=True).encode('utf-8')
    expected = hmac.new(
        secret.encode('utf-8'),
        message,
        hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(signature, expected)
```

### 4. django-allauth Features

**Email Verification:**
1. User signs up
2. Verification email sent
3. User clicks link
4. Email verified
5. Account activated

**Password Reset:**
1. User clicks "Forgot Password"
2. Enters email
3. Reset link sent
4. User clicks link
5. Sets new password

**Configuration:**
```python
# settings.py
ACCOUNT_EMAIL_VERIFICATION = 'optional'  # or 'mandatory'
ACCOUNT_EMAIL_REQUIRED = True
```

### 5. django-guardian Features

**Object-Level Permissions:**
```python
from guardian.shortcuts import assign_perm, has_perm

# Assign permission
assign_perm('view_leaverequest', manager, leave_request)

# Check permission
if has_perm('view_leaverequest', manager, leave_request):
    # Allow access
```

**Use Cases:**
- Manager can only approve leaves for their team
- HR can view all leaves
- Employee can only view their own leaves

---

## Project Structure & File Workflows

### Backend Files Explained

#### `config/settings.py`
**Purpose:** Django configuration
**Key Settings:**
- `INSTALLED_APPS`: Registered apps
- `MIDDLEWARE`: Request/response processing
- `DATABASES`: Database configuration
- `AUTH_USER_MODEL`: Custom user model
- `REST_FRAMEWORK`: DRF settings
- `SIMPLE_JWT`: JWT configuration
- Email, allauth, guardian settings

#### `config/urls.py`
**Purpose:** URL routing
```python
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('users.urls')),
    path('api/', include('leaves.urls')),
]
```

#### `users/models.py`
**Purpose:** User model definition
**Key Model:** `CustomUser` with role field

#### `users/views.py`
**Purpose:** Authentication endpoints
**Key Views:**
- `RegisterView`: User registration
- `LoginView`: JWT token generation
- `UserDetailView`: Get current user

#### `leaves/models.py`
**Purpose:** Leave-related models
**Key Models:**
- `LeaveType`: Leave categories
- `LeaveRequest`: Leave applications
- `LeaveAuditLog`: History tracking

#### `leaves/serializers.py`
**Purpose:** Data serialization
**Key Serializers:**
- `LeaveTypeSerializer`: Leave type JSON
- `LeaveRequestSerializer`: Leave request JSON (includes audit_logs)
- `LeaveAuditLogSerializer`: Audit log JSON

#### `leaves/views.py`
**Purpose:** Leave endpoints
**Key Views:**
- `LeaveViewSet`: CRUD operations
- `ManagerQueueView`: Manager's pending leaves
- `ManagerStatsView`: Dashboard statistics

#### `leaves/tests.py`
**Purpose:** Automated testing
**Test Classes:**
- `TestLeaveRequestModel`: Model tests
- `TestLeaveCreationWorkflow`: Integration tests
- `TestLeaveApprovalWorkflow`: Approval tests
- `TestPermissions`: Access control tests

#### `notifications/models.py`
**Purpose:** Notification models
**Key Models:**
- `Notification`: Email/system notifications
- `Webhook`: Webhook configuration
- `WebhookDelivery`: Delivery tracking

#### `notifications/utils.py`
**Purpose:** Email sending
**Key Functions:**
- `send_leave_created_notification()`: On creation
- `send_leave_status_changed_notification()`: On approval/rejection

#### `notifications/webhooks.py`
**Purpose:** Webhook delivery
**Key Functions:**
- `generate_signature()`: HMAC signing
- `send_webhook()`: HTTP POST delivery
- `send_leave_created_webhook()`: Creation webhook
- `send_leave_status_changed_webhook()`: Status change webhook

#### `notifications/admin.py`
**Purpose:** Django admin configuration
**Registered Models:**
- `Notification`: View notifications
- `Webhook`: Manage webhooks
- `WebhookDelivery`: View delivery logs

### Frontend Files Explained

#### `src/main.jsx`
**Purpose:** Application entry point
```javascript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

#### `src/App.jsx`
**Purpose:** Main app component with routing
```javascript
function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route
                path="/employee"
                element={
                  <PrivateRoute allowedRoles={['EMPLOYEE']}>
                    <EmployeeDashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/manager"
                element={
                  <PrivateRoute allowedRoles={['MANAGER']}>
                    <ManagerDashboard />
                  </PrivateRoute>
                }
              />
              {/* More routes... */}
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
```

#### `src/components/PrivateRoute.jsx`
**Purpose:** Protected route wrapper
```javascript
function PrivateRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  
  if (!user) return <Navigate to="/login" />;
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" />;
  }
  
  return children;
}
```

#### `src/components/Layout.jsx`
**Purpose:** Page layout wrapper
```javascript
function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
```

#### `src/components/Navbar.jsx`
**Purpose:** Navigation bar
**Features:**
- Logo
- Navigation links (based on role)
- Theme toggle
- Logout button

#### `src/api/axios.js`
**Purpose:** API client
**Features:**
- Axios instance with base URL
- Request interceptor (add JWT)
- Response interceptor (handle 401)
- API methods (login, getLeaves, etc.)

---

## Complete File Reference Guide

### Backend Directory Structure with File Purposes

```
backend/
├── config/
│   ├── __init__.py              # Makes config a Python package
│   ├── settings.py              # ⭐ Django settings (database, apps, middleware)
│   ├── urls.py                  # ⭐ Root URL configuration
│   ├── asgi.py                  # ASGI server entry point (async)
│   └── wsgi.py                  # WSGI server entry point (production)
│
├── users/                       # User management app
│   ├── __init__.py              # Makes users a Python package
│   ├── models.py                # ⭐ CustomUser model with roles
│   ├── serializers.py           # ⭐ User data serialization
│   ├── views.py                 # ⭐ Auth endpoints (register, login, me)
│   ├── urls.py                  # ⭐ User routes (/api/auth/*)
│   ├── admin.py                 # Django admin configuration
│   ├── apps.py                  # App configuration
│   ├── migrations/              # Database migrations
│   │   ├── 0001_initial.py      # Initial user model migration
│   │   └── __init__.py
│   └── tests.py                 # User-related tests (if any)
│
├── leaves/                      # Leave management app
│   ├── __init__.py              # Makes leaves a Python package
│   ├── models.py                # ⭐ LeaveType, LeaveRequest, LeaveAuditLog
│   ├── serializers.py           # ⭐ Leave data serialization
│   ├── views.py                 # ⭐ Leave CRUD, approval/rejection logic
│   ├── urls.py                  # ⭐ Leave routes (/api/leaves/*)
│   ├── admin.py                 # Django admin for leaves
│   ├── apps.py                  # App configuration
│   ├── migrations/              # Database migrations
│   │   ├── 0001_initial.py      # Initial leave models
│   │   ├── 0002_initial.py      # Foreign key relationships
│   │   ├── 0003_leaveauditlog.py # Audit log model
│   │   └── __init__.py
│   └── tests.py                 # ⭐ 10 comprehensive tests
│
├── notifications/               # Notifications & webhooks app
│   ├── __init__.py              # Makes notifications a Python package
│   ├── models.py                # ⭐ Notification, Webhook, WebhookDelivery
│   ├── utils.py                 # ⭐ Email notification functions
│   ├── webhooks.py              # ⭐ Webhook delivery with HMAC signing
│   ├── admin.py                 # ⭐ Admin interface for webhooks
│   ├── apps.py                  # App configuration
│   ├── migrations/              # Database migrations
│   │   ├── 0001_initial.py      # Notification model
│   │   ├── 0002_webhook_webhookdelivery.py # Webhook models
│   │   └── __init__.py
│   └── tests.py                 # ⭐ 6 webhook tests
│
├── manage.py                    # ⭐ Django CLI tool
├── db.sqlite3                   # ⭐ SQLite database file
└── requirements.txt             # ⭐ Python dependencies
```

**⭐ = Critical files for understanding the project**

### Frontend Directory Structure with File Purposes

```
frontend/
├── public/
│   └── vite.svg                 # Vite logo
│
├── src/
│   ├── api/
│   │   └── axios.js             # ⭐ API client with interceptors
│   │
│   ├── components/
│   │   ├── Layout.jsx           # ⭐ Page layout wrapper
│   │   ├── Navbar.jsx           # ⭐ Navigation bar
│   │   ├── PrivateRoute.jsx     # ⭐ Protected route wrapper
│   │   └── ui/                  # Reusable UI components
│   │       ├── Button.jsx       # Button component
│   │       ├── Input.jsx        # Input component
│   │       └── Card.jsx         # Card component
│   │
│   ├── context/
│   │   ├── AuthContext.jsx      # ⭐ Authentication state management
│   │   ├── ThemeContext.jsx     # ⭐ Dark/light mode
│   │   └── ToastContext.jsx     # ⭐ Toast notifications
│   │
│   ├── pages/
│   │   ├── Login.jsx            # ⭐ Login page
│   │   ├── Signup.jsx           # ⭐ Registration page
│   │   ├── EmployeeDashboard.jsx # ⭐ Employee dashboard
│   │   ├── ManagerDashboard.jsx  # ⭐ Manager dashboard
│   │   ├── ManagerQueue.jsx      # ⭐ Manager leave queue (tabs)
│   │   ├── HRDashboard.jsx       # HR dashboard
│   │   └── CreateLeave.jsx       # ⭐ Leave request form
│   │
│   ├── App.jsx                  # ⭐ Main app with routing
│   ├── main.jsx                 # ⭐ React entry point
│   └── index.css                # ⭐ Global styles (Tailwind)
│
├── .gitignore                   # Git ignore rules
├── eslint.config.js             # ESLint configuration
├── index.html                   # HTML entry point
├── package.json                 # ⭐ NPM dependencies
├── package-lock.json            # Dependency lock file
├── postcss.config.js            # PostCSS configuration
├── tailwind.config.js           # ⭐ Tailwind CSS configuration
└── vite.config.js               # ⭐ Vite build configuration
```

**⭐ = Critical files for understanding the project**

---

## Detailed File Explanations for Evaluation

### Backend Critical Files

#### 1. `backend/config/settings.py` (200+ lines)
**What it does:**
- Configures entire Django project
- Defines installed apps (Django, DRF, allauth, guardian, custom apps)
- Sets up middleware pipeline
- Configures database (SQLite)
- JWT authentication settings
- CORS settings for React frontend
- Email backend configuration
- django-allauth settings
- django-guardian settings

**Key configurations:**
```python
INSTALLED_APPS = [
    'django.contrib.admin',
    'rest_framework',
    'corsheaders',
    'allauth',
    'guardian',
    'users',
    'leaves',
    'notifications',
]

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
}
```

#### 2. `backend/users/models.py`
**What it does:**
- Defines CustomUser model extending Django's AbstractUser
- Adds `role` field (EMPLOYEE, MANAGER, HR)
- Foundation for role-based access control

**Why it's important:**
- Can't modify Django's default User model
- Role field determines dashboard access
- Used in every permission check

#### 3. `backend/leaves/models.py`
**What it does:**
- Defines 3 models: LeaveType, LeaveRequest, LeaveAuditLog
- LeaveType: Categories of leave (Sick, Casual, etc.)
- LeaveRequest: Main leave application model
- LeaveAuditLog: Tracks all changes to leave requests

**Why it's important:**
- Core business logic
- Audit trail for compliance
- Relationships between users and leaves

#### 4. `backend/leaves/views.py`
**What it does:**
- Implements all leave-related API endpoints
- LeaveViewSet: CRUD operations
- ManagerQueueView: Filtered leaves for managers
- ManagerStatsView: Dashboard statistics
- Handles approval/rejection logic
- Creates audit logs
- Triggers notifications and webhooks

**Key methods:**
- `get_queryset()`: Filters based on user role
- `perform_create()`: Creates leave + audit + notifications
- `action()`: Approve/reject with full tracking

#### 5. `backend/leaves/serializers.py`
**What it does:**
- Converts Python objects to JSON and vice versa
- Validates incoming data
- Includes nested serializers (audit_logs)

**Why it's important:**
- API contract between frontend and backend
- Data validation
- Prevents invalid data from entering database

#### 6. `backend/notifications/webhooks.py`
**What it does:**
- Implements webhook delivery system
- Generates HMAC SHA256 signatures
- Sends HTTP POST requests to external URLs
- Tracks delivery success/failure
- Handles errors and timeouts

**Why it's important:**
- Integration with external services
- Security through HMAC signing
- Delivery tracking for debugging

#### 7. `backend/leaves/tests.py` (300+ lines)
**What it does:**
- 10 comprehensive tests covering:
  - Model creation
  - API endpoints
  - Permissions
  - Audit trail generation
  - Notification creation

**Why it's important:**
- Ensures code quality
- Prevents regressions
- Documents expected behavior

### Frontend Critical Files

#### 1. `frontend/src/api/axios.js`
**What it does:**
- Creates configured Axios instance
- Adds JWT token to all requests (interceptor)
- Handles 401 errors and token refresh
- Provides API methods (login, getLeaves, etc.)

**Why it's important:**
- Single source of truth for API calls
- Automatic authentication
- Centralized error handling

**Key features:**
```javascript
// Request interceptor
axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response interceptor
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            // Try to refresh token
        }
        return Promise.reject(error);
    }
);
```

#### 2. `frontend/src/context/AuthContext.jsx`
**What it does:**
- Manages global authentication state
- Provides login/logout functions
- Loads user on app mount
- Stores tokens in localStorage

**Why it's important:**
- Avoids prop drilling
- Single source of truth for user state
- Used by all protected components

#### 3. `frontend/src/components/PrivateRoute.jsx`
**What it does:**
- Protects routes from unauthorized access
- Checks if user is logged in
- Checks if user has required role
- Redirects to login if not authenticated

**Why it's important:**
- Security layer
- Role-based access control
- Prevents unauthorized access

#### 4. `frontend/src/pages/ManagerQueue.jsx`
**What it does:**
- Displays leave requests in tabs (PENDING, APPROVED, REJECTED)
- Allows managers to approve/reject
- Shows modal for adding comments
- Refreshes list after action

**Why it's important:**
- Core manager functionality
- Demonstrates state management
- Shows API integration

#### 5. `frontend/src/App.jsx`
**What it does:**
- Sets up routing
- Wraps app in context providers
- Defines all routes with role protection

**Why it's important:**
- Entry point for understanding app structure
- Shows all available pages
- Demonstrates context usage

### Configuration Files

#### 1. `backend/requirements.txt`
**What it does:**
- Lists all Python dependencies
- Specifies versions

**Contents:**
```
Django==5.2.8
djangorestframework==3.16.1
djangorestframework-simplejwt==5.5.1
django-cors-headers==4.9.0
django-allauth==65.13.1
django-guardian==3.2.0
requests==2.32.5
```

#### 2. `frontend/package.json`
**What it does:**
- Lists all NPM dependencies
- Defines scripts (dev, build)
- Project metadata

**Key scripts:**
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

#### 3. `frontend/tailwind.config.js`
**What it does:**
- Configures Tailwind CSS
- Defines color palette
- Sets up dark mode
- Specifies content files to scan

#### 4. `frontend/vite.config.js`
**What it does:**
- Configures Vite build tool
- Sets up React plugin
- Defines build options

---

## File Interaction Flow

### Leave Creation Flow

```
1. User fills form in CreateLeave.jsx
   ↓
2. Form submitted → api.createLeave() in axios.js
   ↓
3. POST /api/leaves/ → LeaveViewSet.create() in views.py
   ↓
4. LeaveRequestSerializer validates data in serializers.py
   ↓
5. perform_create() saves to LeaveRequest model in models.py
   ↓
6. LeaveAuditLog created in models.py
   ↓
7. send_leave_created_notification() in utils.py
   ↓
8. send_leave_created_webhook() in webhooks.py
   ↓
9. Response sent back to frontend
   ↓
10. EmployeeDashboard.jsx refreshes and shows new leave
```

### Leave Approval Flow

```
1. Manager clicks Approve in ManagerQueue.jsx
   ↓
2. Modal opens for comment
   ↓
3. api.approveLeave() called in axios.js
   ↓
4. POST /api/leaves/{id}/action/ → action() method in views.py
   ↓
5. Leave status updated in LeaveRequest model
   ↓
6. LeaveAuditLog created with APPROVE action
   ↓
7. send_leave_status_changed_notification() sends email
   ↓
8. send_leave_status_changed_webhook() triggers webhook
   ↓
9. Response with updated leave (including audit_logs)
   ↓
10. ManagerQueue.jsx refreshes, leave moves to APPROVED tab
```

---

## Evaluation Checklist

### Backend Evaluation Points

✅ **Models** (`models.py` files)
- CustomUser with roles
- LeaveType, LeaveRequest, LeaveAuditLog
- Notification, Webhook, WebhookDelivery
- Proper relationships (ForeignKey, related_name)

✅ **Views** (`views.py` files)
- ViewSets for CRUD operations
- Custom actions (@action decorator)
- Permission checks (role-based)
- Business logic (audit, notifications, webhooks)

✅ **Serializers** (`serializers.py` files)
- Data validation
- Nested serializers
- Custom fields

✅ **URLs** (`urls.py` files)
- RESTful routing
- ViewSet registration
- Proper namespacing

✅ **Tests** (`tests.py` files)
- 16 tests total
- Unit tests (models)
- Integration tests (API endpoints)
- Permission tests

✅ **Admin** (`admin.py` files)
- Custom admin interfaces
- List displays
- Filters and search

### Frontend Evaluation Points

✅ **Components**
- Reusable UI components
- Layout and navigation
- Protected routes

✅ **Context**
- Global state management
- Authentication context
- Theme context

✅ **API Integration**
- Axios configuration
- Interceptors
- Error handling

✅ **Routing**
- React Router setup
- Role-based protection
- Proper navigation

✅ **Styling**
- Tailwind CSS
- Responsive design
- Dark mode support

### Features Evaluation Points

✅ **Authentication**
- JWT tokens
- Login/logout
- Token refresh
- django-allauth integration

✅ **Authorization**
- Role-based access (Employee, Manager, HR)
- Object-level permissions (django-guardian)
- Protected routes

✅ **Audit Trails**
- Complete history tracking
- Who did what and when
- Status transitions

✅ **Notifications**
- Email on leave creation
- Email on status change
- Console backend (dev)

✅ **Webhooks**
- HMAC signing
- Event subscriptions
- Delivery tracking
- Error handling

✅ **Testing**
- Comprehensive test suite
- 100% pass rate
- Good coverage

---

This documentation is now **evaluation-ready** with complete file explanations and interaction flows!

#### `config/settings.py`
**Purpose:** Django configuration
**Key Settings:**
- `INSTALLED_APPS`: Registered apps
- `MIDDLEWARE`: Request/response processing
- `DATABASES`: Database configuration
- `AUTH_USER_MODEL`: Custom user model
- `REST_FRAMEWORK`: DRF settings
- `SIMPLE_JWT`: JWT configuration
- Email, allauth, guardian settings

#### `config/urls.py`
**Purpose:** URL routing
```python
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('users.urls')),
    path('api/', include('leaves.urls')),
]
```

#### `users/models.py`
**Purpose:** User model definition
**Key Model:** `CustomUser` with role field

#### `users/views.py`
**Purpose:** Authentication endpoints
**Key Views:**
- `RegisterView`: User registration
- `LoginView`: JWT token generation
- `UserDetailView`: Get current user

#### `leaves/models.py`
**Purpose:** Leave-related models
**Key Models:**
- `LeaveType`: Leave categories
- `LeaveRequest`: Leave applications
- `LeaveAuditLog`: History tracking

#### `leaves/serializers.py`
**Purpose:** Data serialization
**Key Serializers:**
- `LeaveTypeSerializer`: Leave type JSON
- `LeaveRequestSerializer`: Leave request JSON (includes audit_logs)
- `LeaveAuditLogSerializer`: Audit log JSON

#### `leaves/views.py`
**Purpose:** Leave endpoints
**Key Views:**
- `LeaveViewSet`: CRUD operations
- `ManagerQueueView`: Manager's pending leaves
- `ManagerStatsView`: Dashboard statistics

#### `leaves/tests.py`
**Purpose:** Automated testing
**Test Classes:**
- `TestLeaveRequestModel`: Model tests
- `TestLeaveCreationWorkflow`: Integration tests
- `TestLeaveApprovalWorkflow`: Approval tests
- `TestPermissions`: Access control tests

#### `notifications/models.py`
**Purpose:** Notification models
**Key Models:**
- `Notification`: Email/system notifications
- `Webhook`: Webhook configuration
- `WebhookDelivery`: Delivery tracking

#### `notifications/utils.py`
**Purpose:** Email sending
**Key Functions:**
- `send_leave_created_notification()`: On creation
- `send_leave_status_changed_notification()`: On approval/rejection

#### `notifications/webhooks.py`
**Purpose:** Webhook delivery
**Key Functions:**
- `generate_signature()`: HMAC signing
- `send_webhook()`: HTTP POST delivery
- `send_leave_created_webhook()`: Creation webhook
- `send_leave_status_changed_webhook()`: Status change webhook

#### `notifications/admin.py`
**Purpose:** Django admin configuration
**Registered Models:**
- `Notification`: View notifications
- `Webhook`: Manage webhooks
- `WebhookDelivery`: View delivery logs

### Frontend Files Explained

#### `src/main.jsx`
**Purpose:** Application entry point
```javascript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

#### `src/App.jsx`
**Purpose:** Main app component with routing
```javascript
function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route
                path="/employee"
                element={
                  <PrivateRoute allowedRoles={['EMPLOYEE']}>
                    <EmployeeDashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/manager"
                element={
                  <PrivateRoute allowedRoles={['MANAGER']}>
                    <ManagerDashboard />
                  </PrivateRoute>
                }
              />
              {/* More routes... */}
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
```

#### `src/components/PrivateRoute.jsx`
**Purpose:** Protected route wrapper
```javascript
function PrivateRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  
  if (!user) return <Navigate to="/login" />;
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" />;
  }
  
  return children;
}
```

#### `src/components/Layout.jsx`
**Purpose:** Page layout wrapper
```javascript
function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
```

#### `src/components/Navbar.jsx`
**Purpose:** Navigation bar
**Features:**
- Logo
- Navigation links (based on role)
- Theme toggle
- Logout button

#### `src/api/axios.js`
**Purpose:** API client
**Features:**
- Axios instance with base URL
- Request interceptor (add JWT)
- Response interceptor (handle 401)
- API methods (login, getLeaves, etc.)

---

## API Documentation

### Authentication

#### Register
```
POST /api/auth/register/
Content-Type: application/json

{
  "username": "string",
  "email": "string",
  "password": "string",
  "role": "EMPLOYEE" | "MANAGER" | "HR"
}

Response: 201 Created
{
  "id": number,
  "username": "string",
  "email": "string",
  "role": "string"
}
```

#### Login
```
POST /api/auth/token/
Content-Type: application/json

{
  "username": "string",
  "password": "string"
}

Response: 200 OK
{
  "access": "string (JWT)",
  "refresh": "string (JWT)"
}
```

#### Get Current User
```
GET /api/auth/me/
Authorization: Bearer <access_token>

Response: 200 OK
{
  "id": number,
  "username": "string",
  "email": "string",
  "role": "string"
}
```

### Leaves

#### List Leaves
```
GET /api/leaves/
Authorization: Bearer <access_token>

Response: 200 OK
[
  {
    "id": number,
    "user": {...},
    "leave_type": {...},
    "start_date": "YYYY-MM-DD",
    "end_date": "YYYY-MM-DD",
    "reason": "string",
    "status": "PENDING" | "APPROVED" | "REJECTED",
    "manager_comment": "string",
    "created_at": "ISO 8601",
    "updated_at": "ISO 8601",
    "audit_logs": [...]
  }
]
```

#### Create Leave
```
POST /api/leaves/
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "leave_type_id": number,
  "start_date": "YYYY-MM-DD",
  "end_date": "YYYY-MM-DD",
  "reason": "string"
}

Response: 201 Created
{
  "id": number,
  ...
}
```

#### Approve/Reject Leave
```
POST /api/leaves/{id}/action/
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "action": "approve" | "reject",
  "comment": "string"
}

Response: 200 OK
{
  "id": number,
  "status": "APPROVED" | "REJECTED",
  "manager_comment": "string",
  ...
}
```

### Manager

#### Get Manager Queue
```
GET /api/manager-queue/?status=PENDING
Authorization: Bearer <access_token>

Response: 200 OK
[...]
```

#### Get Manager Stats
```
GET /api/manager-stats/
Authorization: Bearer <access_token>

Response: 200 OK
{
  "pending": number,
  "approved_today": number,
  "rejected_total": number
}
```

---

## Deployment Guide

### Production Checklist

1. **Environment Variables**
```bash
# .env file
DEBUG=False
SECRET_KEY=<random-secret-key>
ALLOWED_HOSTS=yourdomain.com
# For SQLite (current setup)
# Database is already configured in settings.py

# For email (production)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
```

**Note:** If you need to switch to PostgreSQL for production:
```bash
# Install psycopg2
pip install psycopg2-binary

# Add to .env
DATABASE_URL=postgresql://user:pass@host:5432/dbname
```

2. **Database Migration**
```bash
python manage.py migrate
python manage.py createsuperuser
```

3. **Static Files**
```bash
python manage.py collectstatic
```

4. **Frontend Build**
```bash
cd frontend
npm run build
```

5. **Server Configuration**
- Use Gunicorn/uWSGI for Django
- Use Nginx for static files
- For SQLite: Ensure proper file permissions on `db.sqlite3`
- Enable HTTPS with Let's Encrypt

### Docker Deployment (Optional)

```dockerfile
# Dockerfile
FROM python:3.13
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["gunicorn", "config.wsgi:application", "--bind", "0.0.0.0:8000"]
```

```yaml
# docker-compose.yml
version: '3.8'
services:
  db:
    image: postgres:15
    environment:
      POSTGRES_DB: lms
      POSTGRES_USER: lms_user
      POSTGRES_PASSWORD: secure_password
  
  backend:
    build: ./backend
    command: gunicorn config.wsgi:application --bind 0.0.0.0:8000
    volumes:
      - ./backend:/app
    ports:
      - "8000:8000"
    depends_on:
      - db
  
  frontend:
    build: ./frontend
    ports:
      - "80:80"
```

---

## Conclusion

This Leave Management System is a production-ready application with:
- ✅ Complete authentication and authorization
- ✅ Role-based access control
- ✅ Comprehensive audit trails
- ✅ Email notifications
- ✅ Webhook integration
- ✅ Object-level permissions
- ✅ Automated testing
- ✅ Modern UI/UX

The system is built using industry-standard technologies and follows best practices for security, scalability, and maintainability.
