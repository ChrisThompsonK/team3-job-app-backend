CREATE TABLE 'Applications'(
      'applicationID' integer PRIMARY KEY AUTOINCREMENT NOT NULL,
      'applicantID' integer NOT NULL,
      'jobRoleId' integer NOT NULL,
      'dateApplied' text NOT NULL,
      'status' text DEFAULT 'Pending' NOT NULL,
      'coverLetter' text,
      'notes' text,
      'createdAt' text NOT NULL,
      FOREIGN KEY ('applicantID') REFERENCES 'Applicants'('applicantID'),
      FOREIGN KEY ('jobRoleId') REFERENCES 'job_roles'('jobRoleId')
);