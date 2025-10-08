export interface JobRole {
  id?: number;
  roleName: string;
  location: string;
  closingDate: string;
  capabilityId: number;
  bandId: number;
}
export type JobRoleWithDetails = {
  jobRoleId: number;
  roleName: string;
  location: string;
  closingDate: string;
  capabilityName: string | null;
  bandName: string | null;
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
