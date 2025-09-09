# Hospital Management System – Notes

## Overview
A MERN-stack style project with an Express/MongoDB backend and two Vite React frontends:
- `frontend/`: Patient-facing site (appointments, messaging, auth)
- `dashboard/`: Admin dashboard (manage doctors, view messages, appointments)

Backend exposes REST APIs under `/api/v1/*` with cookie-based JWT auth and role-based access control (Admin vs Patient). Cloudinary is used for doctor avatar uploads.

## Architecture
- `backend/app.js`: Express app setup, environment, CORS, parsers, file uploads, routes, DB init, error middleware
- `backend/server.js`: Starts server and configures Cloudinary using env vars
- `backend/router/`: Route modules
  - `userRouter.js`: Auth, user/admin/doctor endpoints
  - `appointmentRouter.js`: Appointment CRUD for patients/admins
  - `messageRouter.js`: Public message send, admin list
- `backend/controller/`: Request handlers
  - `userController.js`: Register/login, add admin/doctor, get details, logout
  - `appointmentController.js`: Create/list/update/delete appointments
  - `messageController.js`: Send and list messages
- `backend/models/`: Mongoose schemas
  - `userSchema.js`: User with role Patient/Doctor/Admin; password hashing; JWT helpers
  - `appointmentSchema.js`: Appointment record with patient/doctor linkage and status
  - `messageSchema.js`: Contact messages
- `backend/middlewares/`:
  - `auth.js`: `isAdminAuthenticated`, `isPatientAuthenticated`, `isAuthorized`
  - `catchAsyncErrors.js`, `errorMiddleware.js`: Async error wrapper and centralized error handling
- `backend/utlis/jwtToken.js`: Issues JWT and sets role-based cookie name
- `backend/database/dbConnection.js`: Mongo connection (see env)

## Key Environment Variables (found in `backend/Config/config.env`)
- `PORT=4000`
- `MONGO_URI=mongodb+srv://Mohit:uXDskTF9VKGzeWGY@cluster0.aqgwjgh.mongodb.net/webapp`
- `FRONTEND_URL=http://localhost:5173` ✅ Fixed
- `DASHBOARD_URL=http://localhost:5174` ✅ Fixed
- `JWT_SECRET_KEY=...`
- `JWT_EXPIRES=7d`
- `COOKIE_EXPIRE=7`
- Cloudinary: `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`

Security note: The `MONGO_URI` includes a hardcoded username/password. Move secrets to a local `.env` not committed to VCS.

## Auth Flow and Roles
- Login endpoint: `POST /api/v1/user/login` expects `{ email, password, confirmPassword, role }`.
  - Confirms `password === confirmPassword` and verifies user and role.
  - On success, issues JWT and sets role-based cookie:
    - Admin: `adminToken`
    - Patient: `patientToken`
- Middleware:
  - `isAdminAuthenticated`: reads `adminToken`, verifies JWT, ensures `role === "Admin"`
  - `isPatientAuthenticated`: reads `patientToken`, verifies JWT, ensures `role === "Patient"`
  - `isAuthorized(...roles)`: gate by roles if needed
- Logout endpoints clear cookies
  - Admin: `GET /api/v1/user/admin/logout` clears `admintoken` (case mismatch vs `adminToken` cookie in issuer; see Notes)
  - Patient: `GET /api/v1/user/patient/logout` clears `patientToken`

Notes:
- Cookie name mismatch: token is set as `adminToken` in `jwtToken.js` but logout clears `admintoken`. Standardize to `adminToken` in logout.
- CORS: `origin` reads `FRONTEND_URL` and `DASHBOARD_URL`. The `.env` values likely need `:` after `localhost` ports.

## Data Models and Types
- User (`backend/models/userSchema.js`)
  - firstName, lastName: String, min 3
  - email: String, validated
  - phone: String, exactly 11 chars
  - aadhar: String, exactly 12 digits with regex validation
  - dob: Date
  - gender: enum("Male","Female","Transgender")
  - password: String, min 8, select: false; hashed with bcrypt pre-save
  - role: enum("Patient","Doctor","Admin")
  - doctorDepartment: String (doctor only)
  - docAvatar: { public_id, url }
  - Methods: `comparePassword`, `generateJsonWebToken`

- Appointment (`backend/models/appointmentSchema.js`)
  - Patient details: names, email, phone (11), aadhar (12), dob, gender
  - appointment_date: Date
  - department: String
  - doctor: embedded names
  - hasVisited: Boolean
  - address: String
  - doctorId: ObjectId
  - patientId: ObjectId ref User
  - status: enum("Pending","Accepted","Rejected") default Pending

- Message (`backend/models/messageSchema.js`)
  - firstName, lastName: String, min 3
  - email: String, validated
  - phone: String, 11 chars
  - message: String, min 10

## API Endpoints
- User
  - `POST /api/v1/user/patient/register` – register new patient; logs in via cookie on success
  - `POST /api/v1/user/login` – login for Admin or Patient
  - `POST /api/v1/user/admin/addnew` – [Admin] create a new admin
  - `GET /api/v1/user/admin/me` – [Admin] get current admin details
  - `GET /api/v1/user/doctors` – [Admin] list doctors
  - `POST /api/v1/user/doctor/addnew` – [Admin] add doctor with avatar (Cloudinary upload)
  - `GET /api/v1/user/patient/me` – [Patient] get own patient details
  - `GET /api/v1/user/admin/logout` – [Admin] logout (see cookie-name note)
  - `GET /api/v1/user/patient/logout` – [Patient] logout

- Appointments
  - `POST /api/v1/appointment/post` – [Patient] create appointment
  - `GET /api/v1/appointment/getall` – [Admin] list all
  - `PUT /api/v1/appointment/update/:id` – [Admin] update status and fields
  - `DELETE /api/v1/appointment/delete/:id` – [Admin] delete

- Messages
  - `POST /api/v1/message/send` – public contact message
  - `GET /api/v1/message/getall` – [Admin] list all messages

## Frontend Flows
- Dashboard `Login.jsx` (Admin): posts to `/user/login` with role `Admin`, sets auth in context, redirects to `/` on success.
- Frontend `Login.jsx` (Patient): same endpoint with role `Patient`, sets auth and redirects.
- Both rely on `withCredentials: true` so cookies are stored for subsequent authorized calls.

## Features
- Patient registration and login
- Admin login
- Role-based protected routes for Admin and Patient
- Doctor management by Admin (including avatar upload to Cloudinary)
- Appointment creation by Patients; admin can list/update/delete appointments
- Public contact messages; admin can list messages
- Centralized error handling; async error wrapper

## Setup and Running Locally
1) Backend
- Ensure `backend/Config/config.env` has correct values (fix localhost URLs):
  - `FRONTEND_URL=http://localhost:5173`
  - `DASHBOARD_URL=http://localhost:5174`
- Install deps and run:
  - `cd backend`
  - `npm install`
  - `npm run dev` or `npm start`

2) Frontend (patient site)
- `cd frontend && npm install && npm run dev` (Vite default port 5173)

3) Dashboard (admin site)
- `cd dashboard && npm install && npm run dev` (suggested port 5174)

Make sure browsers are served from the URLs that match the backend CORS origins.

## Important Implementation Notes
- ✅ Cookie name mismatch fixed: admin logout now clears `adminToken` consistently.
- ✅ Password confirmation removed from login flow for better UX.
- ✅ NIC changed to Aadhar Number (12 digits) with proper validation.
- ✅ **Responsive Design**: Mobile-first CSS with fluid typography using `clamp()` functions.
- ✅ **Enhanced Navigation**: Improved mobile menu with smooth animations and better UX.
- ✅ **Accessibility**: Added focus styles, reduced motion support, and better contrast.
- File upload requires `docAvatar` in the multipart form-data and Cloudinary configured.

## Credentials Found (for development only)
- MongoDB URI includes username/password:
  - Username: `Mohit`
  - Password: `uXDskTF9VKGzeWGY`
- JWT secret and Cloudinary keys are present in `config.env`.

### Default Admin Account
- **Email**: `admin@hospital.com`
- **Password**: `Admin@123`
- **Role**: Admin

To create the default admin account, run:
```bash
cd backend
npm run create-admin
```

Do NOT use these in production. Rotate and store secrets in environment variables not committed to source control.

## Example Auth Requests
- Login (Admin):
```bash
curl -X POST http://localhost:4000/api/v1/user/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@hospital.com","password":"Admin@123","role":"Admin"}' \
  -i
```
- Create Appointment (Patient, cookie required):
```bash
curl -X POST http://localhost:4000/api/v1/appointment/post \
  -H "Content-Type: application/json" \
  -d '{"firstName":"John","lastName":"Doe", "email":"j@d.com", "phone":"03001234567", "aadhar":"123456789012", "dob":"1990-01-01", "gender":"Male", "appointment_date":"2025-09-01", "department":"Cardio", "doctor_firstName":"Alex", "doctor_lastName":"Smith", "hasVisited":false, "address":"Street 1"}' \
  -b cookies.txt -c cookies.txt
```

## Potential Improvements
- ✅ **Responsive Design**: Mobile-first approach with fluid typography and improved breakpoints
- ✅ **Better UX**: Enhanced hover effects, smooth transitions, and accessibility features
- ✅ **Clean Code**: Removed unused CSS, improved organization, and better maintainability
- Use HTTP-only, SameSite cookies and secure in production
- Add refresh tokens and token invalidation on logout
- Normalize phone/NIC validation and use country-aware rules
- Add pagination to list endpoints
- Add rate limiting and input sanitization
- Centralize role-based authorization with route-level policy config
- Use zod/joi for request validation

## Interview Questions Related to This Codebase
- Auth & Security
  - Why use cookies with JWT here instead of Authorization headers?
  - How would you handle token revocation and logout with JWT?
  - Identify and fix the admin cookie name mismatch bug.
  - What CORS settings are required for credentials, and how do you configure them?
  - Risks of committing secrets to VCS and how to mitigate?
- Backend Design
  - Explain the role-based middleware and how it protects routes.
  - Discuss the tradeoffs of embedding doctor names vs referencing the doctor by id in appointments.
  - How would you enforce unique email for users at the schema level?
  - Why is `select: false` used on password, and how do you query it when needed?
- Data Modeling
  - Validate and standardize phone/NIC fields—what would you change?
  - How to model appointments to avoid conflict with doctor schedules?
- File Uploads
  - How is Cloudinary integrated? What are error cases during upload?
- Frontend
  - How does `withCredentials` interact with CORS and cookie domains?
  - Why is `confirmPassword` included on login? Would you keep it?
- Operations
  - How would you set up environments (dev/staging/prod) securely?
  - What monitoring/logging would you add?

## Interview Questions and Answers
- Auth & Security
  - Why use cookies with JWT here instead of Authorization headers?
    - Cookies allow httpOnly storage, mitigating XSS. With `credentials: true` and proper CORS, the browser attaches cookies automatically to protected requests, simplifying clients. Headers are fine too, but require manual storage and injection, often in JS-accessible storage.
  - How would you handle token revocation and logout with JWT?
    - Use short-lived access tokens plus a server-tracked refresh token (DB/redis). On logout, invalidate the refresh token and clear cookies. Optionally keep a short blacklist for recently revoked access tokens until they expire.
  - Identify and fix the admin cookie name mismatch bug.
    - Issuer sets `adminToken`; logout clears `admintoken`. Fix by changing logout to clear `adminToken` consistently in `logoutAdmin`.
  - What CORS settings are required for credentials, and how do you configure them?
    - Set `credentials: true` on both client and server CORS, and specify exact `origin` values (not `*`). Also ensure cookie `SameSite` attributes align with your setup (e.g., `None; Secure` for cross-site in prod).
  - Risks of committing secrets to VCS and how to mitigate?
    - Leakage and compromise. Rotate credentials, move secrets to environment variables or a vault, remove from repo history, and use separate per-environment secrets.
- Backend Design
  - Explain the role-based middleware and how it protects routes.
    - `isAdminAuthenticated`/`isPatientAuthenticated` verify the JWT and user, then enforce the expected role, blocking access if mismatched. Routes are guarded by the appropriate middleware.
  - Discuss the tradeoffs of embedding doctor names vs referencing the doctor by id in appointments.
    - Embedding names preserves historical display data even if the doctor profile changes; referencing IDs ensures consistency and allows joins/populate. A hybrid is used here: embedded names plus `doctorId`.
  - How would you enforce unique email for users at the schema level?
    - Add `unique: true` index to `email`, ensure a supporting unique index in Mongo, and handle duplicate key errors on creation.
  - Why is `select: false` used on password, and how do you query it when needed?
    - Prevents accidental exposure in queries. Include explicitly when needed using `.select("+password")`.
- Data Modeling
  - Validate and standardize phone/NIC fields—what would you change?
    - Use consistent exact lengths (or regex) per locale, centralize constants, and align error messages with rules; consider storing as strings with normalization.
  - How to model appointments to avoid conflict with doctor schedules?
    - Add time slots and indexes on `(doctorId, appointment_date)`, enforce uniqueness per slot, and implement server-side conflict checks.
- File Uploads
  - How is Cloudinary integrated? What are error cases during upload?
    - Files are uploaded via `express-fileupload` to a temp path, then `cloudinary.uploader.upload` is called. Handle invalid mimetypes, network errors, and Cloudinary API errors; validate response before saving.
- Frontend
  - How does `withCredentials` interact with CORS and cookie domains?
    - The browser only sends cookies if the request origin matches allowed CORS origins and the server enables credentials; cookies must have compatible `SameSite` and domain settings.
  - Why is `confirmPassword` included on login? Would you keep it?
    - It’s unnecessary for login and adds friction. I would remove it from the login API and UI, keeping it only for registration.
- Operations
  - How would you set up environments (dev/staging/prod) securely?
    - Separate env files/secrets per environment, distinct DBs, restricted CORS origins, HTTPS, secure cookies, and CI/CD with secret management.
  - What monitoring/logging would you add?
    - Structured logs (request IDs), error tracking (Sentry), metrics (Prometheus/Grafana), health checks, and alerts on error rates/latency.

## Responsive Design Features
- **Mobile-First Approach**: CSS designed for mobile devices first, then enhanced for larger screens
- **Fluid Typography**: Uses `clamp()` functions for responsive font sizes that scale smoothly
- **Flexible Grids**: CSS Grid and Flexbox layouts that adapt to different screen sizes
- **Touch-Friendly**: Larger touch targets and improved mobile navigation
- **Performance**: Optimized animations and transitions with reduced motion support
- **Accessibility**: Proper focus states, semantic HTML, and screen reader support

### Breakpoints
- **Mobile**: < 768px (default)
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Key Responsive Features
- **Navigation**: Collapsible mobile menu with smooth animations
- **Forms**: Stack vertically on mobile, side-by-side on larger screens
- **Tables**: Horizontal scroll on mobile with fixed headers
- **Cards**: Responsive grid that adapts to screen size
- **Images**: Scale proportionally with max-width constraints

## Quick Reference
- Admin cookie: `adminToken` (issuer) – fix logout name
- Patient cookie: `patientToken`
- Ports: API 4000; Vite defaults 5173/5174
- Core URLs: `/api/v1/user`, `/api/v1/appointment`, `/api/v1/message`
