# Architecture Documentation

## 3-Tier Architecture Implementation

This project now implements a proper 3-tier architecture, separating concerns into distinct layers:

### 1. **Presentation Layer** (Controllers & Routes)
- **Location**: `src/controllers/` and `src/routes/`
- **Responsibility**: Handle HTTP requests/responses, input validation, and error handling
- **Files**:
  - `AppController.ts` - Handles application-level endpoints
  - `UserController.ts` - Handles user-related endpoints
  - `appRoutes.ts` - Defines application routes
  - `userRoutes.ts` - Defines user management routes

### 2. **Business Logic Layer** (Services)
- **Location**: `src/services/`
- **Responsibility**: Business rules, data validation, and orchestration
- **Files**:
  - `AppService.ts` - Application-level business logic
  - `UserService.ts` - User management business logic

### 3. **Data Access Layer** (Repositories & Models)
- **Location**: `src/repositories/` and `src/models/`
- **Responsibility**: Data persistence, retrieval, and model definitions
- **Files**:
  - `AppRepository.ts` - Application data access
  - `UserRepository.ts` - User data access (in-memory storage)
  - `AppInfo.ts` - Application information model
  - `HealthInfo.ts` - Health status model
  - `User.ts` - User entity model

## API Endpoints

### Application Endpoints
- `GET /` - Get application information
- `GET /health` - Health check endpoint
- `GET /greeting?name=YourName` - Get personalized greeting

### User Management Endpoints
- `POST /users` - Create a new user
- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user
- `GET /users/filter/adults` - Get adult users only
- `GET /users/stats/overview` - Get user statistics

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
Routes (appRoutes.ts, userRoutes.ts)
    ↓
Controllers (AppController.ts, UserController.ts)
    ↓
Services (AppService.ts, UserService.ts)
    ↓
Repositories (AppRepository.ts, UserRepository.ts)
    ↓
Models (AppInfo.ts, HealthInfo.ts, User.ts)
```

## Example Usage

### Creating a User
```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "age": 25}'
```

### Getting User Statistics
```bash
curl http://localhost:3000/users/stats/overview
```

### Getting Adult Users Only
```bash
curl http://localhost:3000/users/filter/adults
```