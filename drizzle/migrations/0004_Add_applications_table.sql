CREATE TABLE 'Applications'(
      'applicationID' integer PRIMARY KEY AUTOINCREMENT NOT NULL,
      'jobRoleId' integer NOT NULL,
      'phoneNumber' integer NOT NULL,
      'emailAddress' text NOT NULL,
      'status' text DEFAULT 'Pending' NOT NULL,
      'coverLetter' text,
      'notes' text,
      'createdAt' text NOT NULL,
      'updatedAt' text NOT NULL,
      FOREIGN KEY ('jobRoleId') REFERENCES 'job_roles'('jobRoleId')
);