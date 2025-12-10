# Backend Development Plan - Snuggly Jackrabbit Buzz

## 1️⃣ Executive Summary
This project builds the backend for **Snuggly Jackrabbit Buzz**, a Founder Clarity Diagnostic tool. The backend will handle lead capture, diagnostic response storage, result generation, and an admin dashboard for analytics.

**Constraints:**
- **Framework:** FastAPI (Python 3.13, Async)
- **Database:** MongoDB Atlas (Motor + Pydantic v2)
- **Deployment:** No Docker, local runner
- **Git:** Single branch `main`
- **Testing:** Manual UI verification per task
- **Sprints:** Dynamic (S0 to S3) to cover all features

---

## 2️⃣ In-Scope & Success Criteria

**In-Scope Features:**
- **Admin Auth:** Secure Signup/Login/Logout for dashboard access.
- **Public Founder Flow:**
  - Onboarding (Lead capture: Name, Email, Company Size).
  - Diagnostic Questionnaire (12 questions).
  - Results Generation (Rule-based or dummy logic for MVP).
- **Admin Dashboard:**
  - Statistics (Completion rate, CTA clicks).
  - Responses List (View user submissions).

**Success Criteria:**
- Admin can log in and view the dashboard populated with real data.
- Founders can complete the flow from Onboarding to Results without errors.
- All data is persisted in MongoDB Atlas.
- `/healthz` endpoint confirms database connectivity.

---

## 3️⃣ API Design

**Base Path:** `/api/v1`
**Error Format:** `{ "error": "message" }`

### **Auth (Admin)**
- `POST /auth/signup` - Register new admin.
- `POST /auth/login` - Authenticate & return JWT.
- `POST /auth/logout` - Clear session.
- `GET /auth/me` - Validate current session.

### **Public Diagnostic Flow**
- `POST /leads`
  - **Purpose:** Save founder contact info.
  - **Body:** `{ name, email, company_size }`
  - **Response:** `{ id: "lead_id" }`
- `POST /responses`
  - **Purpose:** Submit answers & generate results.
  - **Body:** `{ lead_id, answers: { "q1": "...", ... } }`
  - **Response:** `{ result_id, analysis: { mindset, operational, next_move } }`
- `GET /results/{result_id}`
  - **Purpose:** Retrieve previously generated results.

### **Admin Dashboard**
- `GET /admin/stats`
  - **Purpose:** Aggregate metrics for dashboard cards/charts.
  - **Response:** `{ total_completions, drop_off_rate, cta_clicks, monthly_completions: [] }`
- `GET /admin/responses`
  - **Purpose:** List recent diagnostic submissions.
  - **Response:** `[ { id, name, email, q1_answer, q2_answer, created_at } ]`

---

## 4️⃣ Data Model (MongoDB Atlas)

### **admins**
- `email` (string, unique, required)
- `password_hash` (string, required)
- `created_at` (datetime)
- **Example:** `{ "email": "admin@dyad.com", "password_hash": "$argon2...", "created_at": "..." }`

### **leads**
- `name` (string)
- `email` (string)
- `company_size` (string)
- `created_at` (datetime)
- **Example:** `{ "name": "Jane Doe", "email": "jane@startup.com", "company_size": "15-35" }`

### **responses**
- `lead_id` (ObjectId ref)
- `answers` (Map[string, string])
- `result_analysis` (Object)
- `created_at` (datetime)
- **Example:**
  ```json
  {
    "lead_id": "507f1f77bcf86cd799439011",
    "answers": { "q1": "Funding", "q2": "Very Confident" },
    "result_analysis": { "headline": "...", "next_move": "..." }
  }
  ```

---

## 5️⃣ Frontend Audit & Feature Map

| Page | Feature | Backend Needs | Auth |
| :--- | :--- | :--- | :--- |
| **Onboarding** | Capture Name/Email | `POST /leads` | Public |
| **Diagnostic** | Submit Answers | `POST /responses` | Public |
| **Results** | Show Analysis | `GET /results/{id}` (or from POST response) | Public |
| **Admin** | Dashboard Metrics | `GET /admin/stats` | **Admin Only** |
| **Admin** | Responses Table | `GET /admin/responses` | **Admin Only** |
| **Admin** | Login/Signup | `POST /auth/*` | Public |

---

## 6️⃣ Configuration & ENV Vars

- `APP_ENV`: `development`
- `PORT`: `8000`
- `MONGODB_URI`: `mongodb+srv://...`
- `JWT_SECRET`: `(random string)`
- `JWT_EXPIRES_IN`: `86400`
- `CORS_ORIGINS`: `http://localhost:5173`

---

## 7️⃣ Background Work
*None required. Result generation is lightweight and synchronous.*

---

## 8️⃣ Integrations
*None required for MVP.*

---

## 9️⃣ Testing Strategy (Manual)
- **Validation:** Frontend UI actions only.
- **Process:**
  1. Complete backend task.
  2. Perform **Manual Test Step** via Swagger or connected Frontend.
  3. Verify data in MongoDB Atlas if needed.
  4. **Commit & Push** upon success.

---

## 🔟 Dynamic Sprint Plan & Backlog

### 🧱 S0 – Environment Setup & Frontend Connection

**Objectives:**
- Initialize FastAPI project with `Motor` (MongoDB) and `Pydantic`.
- Setup `/api/v1` router and `/healthz` endpoint.
- Configure CORS for frontend (`localhost:5173`).
- **Git:** Initialize, `.gitignore`, and push to `main`.

**Tasks:**
1. **Scaffold Project**
   - Create `main.py`, `database.py`, `config.py`.
   - Implement `/healthz` to ping MongoDB.
   - **Manual Test Step:** Run `uvicorn main:app --reload`. Visit `http://localhost:8000/healthz`. Expect `{"status": "ok", "db": "connected"}`.
   - **User Test Prompt:** "Start the server and hit the health endpoint. Verify DB connection is successful."

2. **Git Initialization**
   - Init repo, add `.gitignore`, commit, and push.
   - **Manual Test Step:** Check GitHub repo for files.

**Definition of Done:**
- Backend running locally.
- DB connected.
- Code committed.

---

### 🧩 S1 – Admin Authentication

**Objectives:**
- Secure the Admin Dashboard.
- Implement JWT Signup/Login flows.

**Tasks:**
1. **Admin Model & Signup**
   - Create `Admin` model (email, password).
   - Implement `POST /auth/signup` with password hashing (Argon2).
   - **Manual Test Step:** Use Swagger UI to create an admin user. Check MongoDB Atlas for the document.
   - **User Test Prompt:** "Create a new admin user via Swagger and confirm the password is hashed in the DB."

2. **Login & JWT Issue**
   - Implement `POST /auth/login` returning access token.
   - **Manual Test Step:** Login with created credentials via Swagger. Expect JWT token string.
   - **User Test Prompt:** "Log in with the new user and confirm you receive a JWT token."

3. **Protect Admin Routes Stub**
   - Create a dummy protected route `GET /admin/me` requiring `Bearer` token.
   - **Manual Test Step:** access `/admin/me` without token (401) and with token (200).
   - **User Test Prompt:** "Try to access the protected route without a token, then with a token."

**Definition of Done:**
- Admin can register and login.
- Protected routes reject unauthenticated requests.

---

### 🚀 S2 – Founder Diagnostic Flow (Public)

**Objectives:**
- Connect the main user journey: Onboarding -> Questions -> Results.

**Tasks:**
1. **Lead Capture (Onboarding)**
   - Create `Lead` model.
   - Implement `POST /leads`.
   - Update Frontend `OnboardingForm.tsx` to call this API.
   - **Manual Test Step:** Fill "Onboarding" form on frontend. Click "Start". Check MongoDB `leads` collection.
   - **User Test Prompt:** "Go to Onboarding, enter details, submit. Confirm a new Lead document appears in Mongo."

2. **Response Submission & Result Gen**
   - Create `Response` model.
   - Implement `POST /responses`.
     - Logic: Save answers, link to Lead, generate static/random "Analysis" for MVP.
   - Update Frontend `QuestionContext.tsx` to submit at end of flow.
   - **Manual Test Step:** Complete diagnostic on frontend. Verify redirection to Results page. Check MongoDB `responses` collection.
   - **User Test Prompt:** "Complete the questions. Ensure the Results page loads and data is saved in DB."

3. **Fetch Results**
   - Implement `GET /results/{id}`.
   - Update Frontend `ResultsPage.tsx` to fetch data from API (instead of hardcoded).
   - **Manual Test Step:** Refresh Results page. Ensure data persists.
   - **User Test Prompt:** "Reload the results page and confirm the dynamic data still loads."

**Definition of Done:**
- Full user flow is functional and persistent.

---

### 📊 S3 – Admin Dashboard Data

**Objectives:**
- Populate Admin Dashboard with real data from `leads` and `responses`.

**Tasks:**
1. **Dashboard Statistics**
   - Implement `GET /admin/stats` (Calculate total completions, etc.).
   - Update Frontend `AdminPage.tsx` to fetch stats.
   - **Manual Test Step:** Login to Admin frontend. Verify numbers match DB counts.
   - **User Test Prompt:** "Check the Admin Dashboard metrics. They should match the number of records in the DB."

2. **Responses Table**
   - Implement `GET /admin/responses`.
   - Update Frontend `ResponsesTable.tsx` to fetch list.
   - **Manual Test Step:** Check the table on Admin page. Should show real names from S2 testing.
   - **User Test Prompt:** "Verify the Responses Table shows the users we created in the previous sprint."

**Definition of Done:**
- Admin Dashboard shows live backend data.
- Project complete.