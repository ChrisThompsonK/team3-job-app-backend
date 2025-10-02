# Architecture Documentation

## 3-Tier Architecture Implementation

This project now implements a proper 3-tier architecture, separating concerns into distinct layers:

### 1. **Presentation Layer** (Controllers & Routes)
- **Location**: `src/controllers/` and `src/routes/`
- **Responsibility**: Handle HTTP requests/responses, input validation, and error handling
- **Files**:
  - `AppController.ts` - Handles application-level endpoints
  - `appRoutes.ts` - Defines application routes

### 2. **Business Logic Layer** (Services)
- **Location**: `src/services/`
- **Responsibility**: Business rules, data validation, and orchestration
- **Files**:
  - `AppService.ts` - Application-level business logic

### 3. **Data Access Layer** (Repositories & Models)
- **Location**: `src/repositories/` and `src/models/`
- **Responsibility**: Data persistence, retrieval, and model definitions
- **Files**:
  - `AppRepository.ts` - Application data access
  - `AppInfo.ts` - Application information model
  - `HealthInfo.ts` - Health status model

## API Endpoints

### Application Endpoints
- `GET /` - Get application information
- `GET /health` - Health check endpoint
- `GET /greeting?name=YourName` - Get personalized greeting

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