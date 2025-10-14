// Base interface for Application data
export interface Application {
  applicationID: number;
  jobRoleId: number;
  phoneNumber: number;
  emailAddress: string;
  status: string;
  coverLetter?: string | null;
  notes?: string | null;
  createdAt: string;
}

// For creating a new application (no ID, no timestamp)
export interface ApplicationCreate {
  jobRoleId: number;
  phoneNumber: number;
  emailAddress: string;
  coverLetter?: string;
  notes?: string;
}

// Application with job role details (for display purposes)
export interface ApplicationWithJobRole extends Application {
  jobRoleName?: string | null;
  jobRoleLocation?: string | null;
}

// Response when creating an application
export interface ApplicationResponse {
  success: boolean;
  applicationID?: number;
  message?: string;
}
