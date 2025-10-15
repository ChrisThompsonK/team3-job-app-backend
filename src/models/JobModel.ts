// Base interface with all fields - standardized property names
export interface JobRole {
  id: number;
  name: string;
  location: string;
  closingDate: string;
  capabilityId: number | null;
  capabilityName: string | null;
  bandId: number | null;
  bandName: string | null;
  statusId: number | null;
  statusName: string | null;
}

// Full details (extends JobRole)
export interface JobRoleDetails extends JobRole {
  description: string | null;
  responsibilities: string | null;
  jobSpecUrl: string | null;
  openPositions: number;
}

// For creating (no id, IDs are required)
export interface JobRoleCreate {
  name: string;
  location: string;
  closingDate: string;
  capabilityId: number;
  bandId: number;
  statusId?: number;
  description?: string | null;
  responsibilities?: string | null;
  jobSpecUrl?: string | null;
  openPositions?: number;
}

// For updating (all optional except ID)
export interface JobRoleUpdate {
  name?: string;
  location?: string;
  closingDate?: string;
  capabilityId?: number;
  bandId?: number;
  statusId?: number;
  description?: string | null;
  responsibilities?: string | null;
  jobSpecUrl?: string | null;
  openPositions?: number;
}

// Capability and Band with standardized names
export interface Capability {
  id: number;
  name: string;
}

export interface Band {
  id: number;
  name: string;
}

// Status interface
export interface Status {
  id: number;
  name: string;
}
