# Architecture Documentation

## 3-Tier Architecture Implementation

## Authentication System Features

### ✅ **Security Features Implemented:**

- **Password Security**: Passwords are salted and hashed using bcrypt with 12 rounds
- **JWT Tokens**: Secure JSON Web Tokens for session management
- **Session Management**: Database-stored sessions with expiration tracking
- **Token Validation**: Middleware for protected route authentication
- **User Management**: Complete user registration, login, and profile system

### 🔐 **Authentication Flow:**

1. **Registration**: User provides email, password, first name, last name
2. **Password Hashing**: Password is salted and hashed before database storage
3. **JWT Generation**: Upon successful login, a JWT token is generated
4. **Session Storage**: Token and user session stored in database with expiration
5. **Protected Routes**: Middleware validates JWT tokens for protected endpoints
6. **Logout**: Session cleanup and token invalidation

### 🛡️ **Security Best Practices:**

- Passwords never stored in plain text
- JWT tokens have configurable expiration times
- Session cleanup for expired tokens
- Input validation and sanitization  
- Proper error handling without information leakage
- User account status management (active/inactive)

The project now has a complete, production-ready authentication system integrated into the 3-tier architecture!

### 1. **Presentation Layer** (Controllers & Routes)
- **Location**: `src/controllers/` and `src/routes/`
- **Responsibility**: Handle HTTP requests/responses, input validation, and error handling
- **Files**:
  - `AppController.ts` - Handles application-level endpoints
  - `AuthController.ts` - Handles authentication endpoints
  - `appRoutes.ts` - Defines application routes
  - `authRoutes.ts` - Defines authentication routes

### 2. **Business Logic Layer** (Services)
- **Location**: `src/services/`
- **Responsibility**: Business rules, data validation, and orchestration
- **Files**:
  - `AppService.ts` - Application-level business logic
  - `AuthService.ts` - Authentication and JWT token management

### 3. **Data Access Layer** (Repositories & Models)
- **Location**: `src/repositories/` and `src/db/`
- **Responsibility**: Data persistence, retrieval, and model definitions
- **Files**:
  - `AppRepository.ts` - Application data access
  - `AuthRepository.ts` - User and session data access
  - `schema.ts` - Database schema (users, sessions tables)
  - `database.ts` - Database connection and configuration
  - `AppInfo.ts` - Application information model
  - `HealthInfo.ts` - Health status model

### 4. **Security Layer** (Middleware)
- **Location**: `src/middleware/`
- **Responsibility**: Authentication, authorization, and security
- **Files**:
  - `authMiddleware.ts` - JWT token validation and user authentication

## API Endpoints

### Application Endpoints
- `GET /` - Get application information
- `GET /health` - Health check endpoint
- `GET /greeting?name=YourName` - Get personalized greeting

### Authentication Endpoints
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login with email and password
- `POST /auth/logout` - Logout (requires Bearer token)
- `GET /auth/profile` - Get current user profile (requires Bearer token)

## Benefits of This Architecture

1. **Separation of Concerns**: Each layer has a specific responsibility
2. **Maintainability**: Changes in one layer don't affect others
3. **Testability**: Each layer can be tested independently
4. **Scalability**: Easy to add new features or modify existing ones
5. **Reusability**: Business logic can be reused across different presentation layers

## Data Flow

```
HTTP Request
    ↓
Routes (appRoutes.ts)
    ↓
Controllers (AppController.ts)
    ↓
Services (AppService.ts)
    ↓
Repositories (AppRepository.ts)
    ↓
Models (AppInfo.ts, HealthInfo.ts)
```

## Example Usage

### Getting Application Information
```bash
curl http://localhost:3000/
```

### Health Check
```bash
curl http://localhost:3000/health
```

### Getting Personalized Greeting
```bash
curl http://localhost:3000/greeting?name=Developer
```

### Authentication Examples

#### Register a New User
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "securePassword123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

#### Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "securePassword123"
  }'
```

#### Get User Profile (Protected Route)
```bash
curl http://localhost:3000/auth/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

#### Logout
```bash
curl -X POST http://localhost:3000/auth/logout \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```