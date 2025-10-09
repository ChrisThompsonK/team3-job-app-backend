export interface JobRole {
  id?: number;
  roleName: string;
  location: string;
  closingDate: string;
  capabilityId: number;
  bandId: number;
  description?: string;
  responsibilities?: string;
  jobSpecUrl?: string;
  status?: string;
  openPositions?: number;
}
export type JobRoleWithDetails = {
  jobRoleId: number;
  roleName: string;
  location: string;
  closingDate: string;
  capabilityName: string | null;
  bandName: string | null;
};

export type JobRoleCreated = {
  jobRoleId: number;
  roleName: string;
  location: string;
  capabilityId: number | null;
  bandId: number | null;
  capabilityName: string | null;
  bandName: string | null;
  closingDate: string;
};

export type JobRoleDetail = {
  jobRoleId: number;
  roleName: string;
  location: string;
  capabilityName: string | null;
  bandName: string | null;
  closingDate: string;
  description: string | null;
  responsibilities: string | null;
  jobSpecUrl: string | null;
  status: string;
  openPositions: number;
};

export interface Capability {
  capabilityId: number;
  capabilityName: string;
}

export interface Band {
  bandId: number;
  bandName: string;
}
