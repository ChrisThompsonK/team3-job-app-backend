CREATE TABLE 'Applicants' (
      'applicantID' integer PRIMARY KEY AUTOINCREMENT NOT NULL,
      'username' text NOT NULL,
      'password' text NOT NULL,
      'firstName' text NOT NULL,
      'surname' text NOT NULL,
      'phoneNumber' int NOT NULL,
      'emailAddress' text NOT NULL,
      'homeAddress' text NOT NULL
);