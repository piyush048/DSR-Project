## 📜 User API Routes

These endpoints handle user authentication, profile management, password reset, and OTP operations.

### 📝 Base URL

```
/api/v1/users
```

---

### 🔐 POST `/signup`

Registers a new user.

- **Body Parameters**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "yourPassword123"
  }
  ```
- **Validation**: `signupSchema`
- **Response**: Returns success message and auth token.

---

### 🔐 POST `/login`

Logs in an existing user.

- **Body Parameters**:
  ```json
  {
    "email": "john@example.com",
    "password": "yourPassword123"
  }
  ```
- **Validation**: `loginSchema`
- **Response**: Returns user info and auth token.

---

### 👤 GET `/profile`

Fetches the authenticated user's profile.

- **Auth Required**: Yes (`Bearer Token`)
- **Response**: User profile object

---

### ✏️ PATCH `/profile`

Updates the authenticated user's profile.

- **Auth Required**: Yes (`Bearer Token`)
- **Body Parameters**:
  ```json
  {
    "name": "Updated Name"
  }
  ```
- **Validation**: `updateProfileSchema`
- **Response**: Updated user profile

---

### 🔐 POST `/forget-password`

Initiates a password reset by email.

- **Body Parameters**:
  ```json
  {
    "email": "john@example.com"
  }
  ```
- **Validation**: `emailSchema`
- **Response**: Password reset link or OTP sent

---

### 🔄 POST `/send-otp`

Sends a one-time password (OTP) to user's email.

- **Body Parameters**:
  ```json
  {
    "email": "john@example.com"
  }
  ```
- **Validation**: `emailSchema`
- **Response**: OTP sent message

---

### ✅ POST `/verify-otp`

Verifies the one-time password (OTP) sent to user's email.

- **Body Parameters**:
  ```json
  {
    "email": "john@example.com",
    "otp": "123456"
  }
  ```
- **Validation**: `otpSchema`
- **Response**: OTP verification status

---

### 🛡️ Middleware Used

- `protect`: Verifies JWT token to allow access to protected routes.
- `validate(schema)`: Validates incoming request body using Joi schemas.





## 📑 DSR (Daily Status Report) API Routes

These endpoints manage Daily Status Reports (DSRs), including creating, updating, retrieving all reports, and fetching a report by ID.

### 📅 Base URL

```
/api/v1/dsrs
```

---

### ➕ POST `/`

Creates a new DSR entry.

- **Auth Required**: Yes (`Bearer Token`)
- **Validation**: `createDsrSchema`
- **Body Parameters** (example):
  ```json
  {
    "date": "2025-04-28",
    "tasks": [
      {
        "projectId": "abc123",
        "description": "Fixed login bug",
        "hours": 4
      },
      {
        "projectId": "def456",
        "description": "API testing",
        "hours": 4
      }
    ]
  }
  ```
- **Business Rule**: Max total hours must not exceed 8 per day.
- **Response**: Created DSR entry

---

### ✏️ PATCH `/`

Updates an existing DSR entry.

- **Auth Required**: Yes (`Bearer Token`)
- **Validation**: `updateDsrSchema`
- **Body Parameters** (example):
  ```json
  {
    "dsrId": "dsr123",
    "tasks": [
      {
        "projectId": "abc123",
        "description": "Improved dashboard UI",
        "hours": 6
      }
    ]
  }
  ```
- **Response**: Updated DSR entry

---

### 📃 GET `/`

Retrieves a paginated list of DSR entries for the authenticated user.

- **Auth Required**: Yes (`Bearer Token`)
- **Query Parameters** (optional):
  - `startDate`: Filter from date (`YYYY-MM-DD`)
  - `endDate`: Filter to date (`YYYY-MM-DD`)
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 10)
- **Response**: Paginated list of DSRs

---

### 👁️ GET `/:dsrId`

Fetches details of a single DSR by its ID.

- **Auth Required**: Yes (`Bearer Token`)
- **Route Parameter**:
  - `dsrId`: ID of the DSR to retrieve
- **Response**: DSR details

---

### 🛡️ Middleware Used

- `protect`: Verifies JWT token to ensure authenticated access.
- `validate(schema)`: Validates request body using Joi schemas.

