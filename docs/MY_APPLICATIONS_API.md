# View My Applications API Documentation

## Endpoint: Get Applications by Email

### Description
Retrieves all job applications submitted by a specific user (identified by their email address). This endpoint is used to display "My Applications" to logged-in users on the frontend.

### Endpoint
```
GET /applications/my-applications
```

### Query Parameters
| Parameter | Type   | Required | Description                              |
|-----------|--------|----------|------------------------------------------|
| email     | string | Yes      | Email address of the logged-in user     |

### Request Example
```bash
GET /applications/my-applications?email=user@example.com
```

### Response Format

#### Success Response (200 OK)
Returns an array of application objects with job role information:

```json
[
  {
    "applicationID": 1,
    "jobRoleId": 5,
    "phoneNumber": "+1 (555) 123-4567",
    "emailAddress": "user@example.com",
    "status": "Pending",
    "coverLetter": "I am very interested in this position...",
    "notes": null,
    "createdAt": "2025-10-15T10:30:00.000Z",
    "updatedAt": "2025-10-15T10:30:00.000Z",
    "jobRoleName": "Software Engineer",
    "jobRoleLocation": "Belfast"
  },
  {
    "applicationID": 2,
    "jobRoleId": 8,
    "phoneNumber": "+44 20 7946 0958",
    "emailAddress": "user@example.com",
    "status": "Reviewed",
    "coverLetter": "I believe my skills are a perfect match...",
    "notes": "Interview scheduled for next week",
    "createdAt": "2025-10-10T14:20:00.000Z",
    "updatedAt": "2025-10-14T09:15:00.000Z",
    "jobRoleName": "Data Analyst",
    "jobRoleLocation": "London"
  }
]
```

#### Error Responses

**400 Bad Request** - Missing or invalid email parameter
```json
{
  "error": "Bad request",
  "message": "Email address is required as a query parameter"
}
```

**500 Internal Server Error** - Server-side error
```json
{
  "error": "Internal server error",
  "message": "Failed to fetch applications"
}
```

### Response Fields

| Field           | Type    | Description                                          |
|-----------------|---------|------------------------------------------------------|
| applicationID   | number  | Unique identifier for the application               |
| jobRoleId       | number  | ID of the job role applied for                      |
| phoneNumber     | string  | Applicant's phone number (can include +, -, etc.)   |
| emailAddress    | string  | Applicant's email address                           |
| status          | string  | Application status (Pending, Reviewed, Accepted, Rejected) |
| coverLetter     | string  | Cover letter text (optional, may be null)           |
| notes           | string  | Admin notes (optional, may be null)                 |
| createdAt       | string  | ISO timestamp when application was created          |
| updatedAt       | string  | ISO timestamp when application was last updated     |
| jobRoleName     | string  | Name of the job role (from job_roles table)         |
| jobRoleLocation | string  | Location of the job role (from job_roles table)     |

### Application Status Values

The `status` field can have the following values:
- **Pending**: Application has been submitted and is awaiting review
- **Reviewed**: Application has been reviewed by HR/hiring manager
- **Accepted**: Applicant has been hired/offered the position
- **Rejected**: Application has been declined

### Frontend Implementation Example

```javascript
async function getMyApplications(userEmail) {
  try {
    const response = await fetch(
      `/applications/my-applications?email=${encodeURIComponent(userEmail)}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch applications');
    }
    
    const applications = await response.json();
    return applications;
  } catch (error) {
    console.error('Error fetching applications:', error);
    throw error;
  }
}
```

### Frontend Display Requirements

Based on your requirements, the frontend should:

1. **List Page**: Display all applications for the logged-in user with:
   - Role name (as a link to the job details page: `/jobs/${jobRoleId}`)
   - Status (displayed as a badge with appropriate styling)
   - Application date (formatted from `createdAt`)
   - Location (from `jobRoleLocation`)

2. **Status Styling Suggestions**:
   - **Pending**: Blue/Info color
   - **Reviewed**: Yellow/Warning color  
   - **Accepted**: Green/Success color
   - **Rejected**: Red/Danger color

3. **Navigation**: Add a link from the home page to the "My Applications" page

### Notes

- The endpoint returns an empty array `[]` if the user has not submitted any applications
- Applications are ordered by the database default order (typically by application ID)
- The email parameter is case-sensitive
- Make sure to URL-encode the email parameter when making requests
