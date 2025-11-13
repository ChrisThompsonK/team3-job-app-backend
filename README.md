[![Code Quality](https://github.com/ChrisThompsonK/team3-job-app-backend/actions/workflows/code-quality.yml/badge.svg)](https://github.com/ChrisThompsonK/team3-job-app-backend/actions/workflows/code-quality.yml)
[![Build & Push Docker](https://github.com/ChrisThompsonK/team3-job-app-backend/actions/workflows/build-push-docker.yml/badge.svg)](https://github.com/ChrisThompsonK/team3-job-app-backend/actions/workflows/build-push-docker.yml)

# Team 3 Job Application Backend

A TypeScript/Node.js backend service for the Team 3 job application system.

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm or yarn package manager

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Development

Start the development server with hot reload:

```bash
npm run dev
```

The server will start on `http://localhost:3000` (or the port specified in the `PORT` environment variable).

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the project for production
- `npm run start` - Start the production server
- `npm run clean` - Remove build artifacts
- `npm run type-check` - Run TypeScript type checking

### Database Scripts

- `npm run db:generate` - Generate new migration from schema changes
- `npm run db:migrate` - Apply pending migrations to the database
- `npm run db:push` - Push schema changes directly to database (dev only)
- `npm run db:studio` - Open Drizzle Studio GUI for database inspection
- `npm run seed` - Seed the database with initial data
- `npm run seed:capabilities` - Seed capabilities table
- `npm run seed:bands` - Seed bands table
- `npm run seed:jobroles` - Seed job roles table

## 🔧 Code Quality & Formatting

This project uses [Biome](https://biomejs.dev/) for code formatting, linting, and import organization.

### Code Quality Scripts

- `npm run format` - Format all files using Biome
- `npm run lint` - Lint all files and apply safe fixes
- `npm run check` - Format, lint, and organize imports all at once
- `npm run ci` - CI-optimized command for build pipelines

### Code Style

The project follows these formatting standards:
- **Indentation**: 2 spaces
- **Line width**: 100 characters
- **Quotes**: Single quotes for JavaScript/TypeScript, double quotes for JSX
- **Semicolons**: Always required
- **Trailing commas**: ES5 style

### Pre-commit Workflow

Before committing code, run:

```bash
npm run check
```

This will automatically:
- Format your code
- Fix linting issues
- Organize imports
- Report any remaining issues

### Editor Integration

For the best development experience, install the Biome extension for your editor:
- **VS Code**: Search for "Biome" in the Extensions marketplace
- **Other editors**: See [Biome editor integrations](https://biomejs.dev/guides/editors/first-party-extensions/)

## 📡 API Endpoints

### General
- `GET /` - Welcome message with service information
- `GET /health` - Health check endpoint

### Job Roles
- `GET /jobs` - Get all job roles
- `GET /jobs/:id` - Get job role by ID
- `POST /jobs` - Create a new job role
- `PUT /jobs/:id` - Update a job role
- `DELETE /jobs/:id` - Soft delete a job role

### Applications
- `POST /applications` - Submit a new application
- `GET /applications/my-applications?email={email}` - Get applications for a specific user by email
- `GET /applications/:id` - Get a specific application by ID
- `GET /applications` - Get all applications (admin)
- `GET /applications-with-roles` - Get all applications with job role details (admin)
- `PUT /applications/:id/status` - Update application status (admin)

## 🗄️ Database

This project uses SQLite with Drizzle ORM for database management.

### Initial Setup

After cloning the repository, run migrations to set up your database:

```bash
npm run db:migrate
```

### Making Schema Changes

1. Update the schema in `src/db/schema.ts`
2. Generate a migration: `npm run db:generate`
3. Apply the migration: `npm run db:migrate`
4. Commit both the schema changes and the generated migration files

## 📝 Logging

This application uses a structured logging system with environment-based configuration:

```bash
# Set log level: debug, info, warn, error
LOG_LEVEL=debug
```

```typescript
import { logger } from '../utils/logger.js';

logger.info('Application started');
logger.error('Something went wrong', error);
```

## 🏗️ Project Structure

```
.
├── src/
│   ├── index.ts          # Main application entry point
│   ├── db/
│   │   ├── database.ts   # Database connection
│   │   └── schema.ts     # Database schema definitions
│   └── seeds/            # Database seed scripts
├── drizzle/
│   └── migrations/       # Database migration files
├── dist/                 # Build output (auto-generated)
├── biome.json           # Biome configuration
├── drizzle.config.ts    # Drizzle ORM configuration
├── tsconfig.json        # TypeScript configuration
└── package.json         # Project dependencies and scripts
```

## 🛠️ Technology Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Code Quality**: Biome (formatting, linting, import organization)
- **Build Tool**: TypeScript Compiler (tsc)
- **Development**: tsx (TypeScript execution with hot reload)

## 📝 Environment Variables

- `PORT` - Server port (default: 3000)

## 🤝 Contributing

1. Ensure your code follows the project's formatting standards by running `npm run check`
2. All linting rules should pass
3. Add appropriate tests for new features
4. Update documentation as needed

## 🐳 Docker & Azure Container Registry

This project uses Docker for containerization and Azure Container Registry (ACR) for image storage.

### Local Development

Build and run the Docker image locally:

```bash
# Build image
docker build -t team3-job-app-backend:local .

# Run container
docker run -p 3000:3000 team3-job-app-backend:local
```

### CI/CD Pipeline

The project uses GitHub Actions for automated Docker builds and deployments:

#### On Pull Requests:
- ✅ Docker image is **built** and verified
- ❌ Image is **NOT pushed** to ACR
- 🏷️ Tagged as `pr-{number}-{sha}` for testing

#### On Main Branch:
- ✅ Docker image is **built and pushed** to ACR
- 🏷️ Tagged as `latest` and `{short-sha}`
- 🚀 Ready for deployment

### ACR Setup (For Maintainers)

**Authentication Method: Service Principal (Recommended)**

1. **Create Service Principal** with ACR push permissions:
   ```bash
   az ad sp create-for-rbac \
     --name github-acr-push \
     --role acrpush \
     --scopes /subscriptions/{subscription-id}/resourceGroups/{rg}/providers/Microsoft.ContainerRegistry/registries/{acr-name}
   ```

2. **Add GitHub Secrets:**
   - `ACR_REGISTRY`: Your ACR login server (e.g., `yourregistry.azurecr.io`)
   - `ACR_USERNAME`: Service Principal `appId`
   - `ACR_PASSWORD`: Service Principal `password`

3. **Verify in Azure:**
   ```bash
   # List images
   az acr repository list --name {registry-name}
   
   # View tags
   az acr repository show-tags --name {registry-name} --repository team3-job-app-backend
   
   # Pull image
   docker pull {registry}.azurecr.io/team3-job-app-backend:latest
   ```

### Image Tagging Strategy

| Branch/Event | Tags | Pushed to ACR? |
|-------------|------|----------------|
| Pull Request | `pr-{number}-{sha}` | ❌ No (build only) |
| Main branch | `latest`, `{short-sha}` | ✅ Yes |

## 🏗️ Infrastructure (Terraform)

This project uses Terraform for infrastructure as code to manage Azure resources.

### Directory Structure

```
terraform-infrastructure/
├── main.tf                          # Core infrastructure definition
├── variables.tf                     # Variable definitions
├── outputs.tf                       # Output values
├── terraform.dev.tfvars             # Dev environment configuration
├── terraform.prod.tfvars.example    # Prod template
└── .terraform/                      # Provider plugins
```

### Getting Started

1. Install Terraform CLI (>= 1.5.0)
2. Navigate to `terraform-infrastructure/` directory
3. Initialize: `terraform init`
4. Plan: `terraform plan -var-file=terraform.dev.tfvars`
5. Apply: `terraform apply -var-file=terraform.dev.tfvars`

### CI/CD Pipeline

The project includes GitHub Actions workflows for automated Terraform operations:
- **Plan on pull requests**: Preview infrastructure changes
- **Apply on main branch**: Deploy infrastructure changes
- **Environment-based naming**: Resources named as `{project}-{environment}-{resource-type}` (e.g., `team3-job-app-dev-rg`)

### Prerequisites for Pipeline

- Azure Storage Account for remote state: `aistatemgmt` (container: `terraform-tfstate-ai`)
- Service Principal with Contributor role
- GitHub Secrets: `AZURE_CLIENT_ID`, `AZURE_CLIENT_SECRET`, `AZURE_SUBSCRIPTION_ID`, `AZURE_TENANT_ID`

For detailed setup instructions, see [PIPELINE_README.md](./terraform-infrastructure/PIPELINE_README.md).

## 📄 License

MIT