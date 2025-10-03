# Database Seeds 🌱

This folder contains seed files to populate the database with realistic Kainos job role data.

## Files

- **`seedCapabilities.ts`** - Seeds the capabilities table with Kainos capability areas
- **`seedBands.ts`** - Seeds the bands table with Kainos career progression levels  
- **`seedJobRoles.ts`** - Seeds job roles table with realistic Kainos positions
- **`index.ts`** - Main seed file that runs all seeds in correct order

## Available NPM Scripts

```bash
# Run all seeds (recommended)
npm run seed

# Run individual seeds
npm run seed:capabilities
npm run seed:bands  
npm run seed:jobroles
```

## Seed Data Overview

### Capabilities (15 total)
- Engineering, Data & AI, Digital Services, Workday
- Testing, DevOps, Cyber Security, Business Analysis
- Project Management, Architecture, UX/UI Design
- Platform Engineering, Quality Assurance, Cloud Solutions, ServiceNow

### Bands (9 total)
- Trainee → Associate → Consultant → Senior Consultant
- Principal Consultant → Managing Consultant → Senior Manager
- Principal → Director

### Job Roles (15 total)
- Realistic Kainos positions across all capabilities
- Multiple locations: Belfast, Birmingham, London, Manchester, Glasgow
- Various experience levels from Graduate to Principal
- Closing dates ranging from Oct 2025 to Dec 2025

## Usage Notes

- Seeds should be run **after** database migrations
- Seeds use foreign key relationships (capabilities & bands must be seeded before job roles)
- Running seeds multiple times will create duplicate data (no deduplication logic)
- To reset data, truncate tables and re-run seeds

## Example Data

```sql
-- Sample job role with relationships
Engineering | Senior Consultant | Senior Software Engineer (.NET) | Birmingham
Data & AI   | Principal Consultant | Principal Data Scientist | Manchester  
DevOps      | Consultant | DevOps Engineer | Belfast
```