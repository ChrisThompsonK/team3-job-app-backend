import { client, db } from '../db/database.js';
import { jobRoles } from '../db/schema.js';

export async function seedJobRoles() {
  console.log('🌱 Seeding complete job roles...');

  const jobRolesData = [
    {
      roleName: 'Software Engineer',
      location: 'Belfast',
      capabilityId: 1, // Engineering
      bandId: 2, // Associate
      statusId: 1, // Open
      closingDate: '2025-10-31',
      description:
        'Join our dynamic engineering team to develop cutting-edge software solutions. You will work on full-stack development projects using modern technologies and contribute to our digital transformation initiatives.',
      responsibilities:
        'Develop and maintain web applications using TypeScript, React, and Node.js; Participate in code reviews and maintain high code quality standards; Collaborate with cross-functional teams to deliver project requirements; Write unit and integration tests; Participate in agile development processes.',
      jobSpecUrl: 'https://careers.kainos.com/jobs/software-engineer-belfast',
      openPositions: 3,
      deleted: 0,
    },
    {
      roleName: 'Software Engineer',
      location: 'Birmingham',
      capabilityId: 1, // Engineering
      bandId: 4, // Senior Consultant
      statusId: 1, // Open
      closingDate: '2025-11-15',
      description:
        'Lead technical initiatives and mentor junior developers while building scalable enterprise applications. This role requires strong technical leadership and expertise in modern software development practices.',
      responsibilities:
        'Lead technical design and architecture decisions; Mentor junior and mid-level developers; Collaborate with product managers and stakeholders; Implement complex features and integrations; Ensure code quality and best practices across the team.',
      jobSpecUrl: 'https://careers.kainos.com/jobs/senior-software-engineer-birmingham',
      openPositions: 2,
      deleted: 0,
    },
    {
      roleName: 'Data Engineer',
      location: 'London',
      capabilityId: 2, // Data & AI
      bandId: 3, // Consultant
      statusId: 1, // Open
      closingDate: '2025-10-25',
      description:
        'Build and maintain robust data pipelines and infrastructure to support our analytics and machine learning initiatives. Work with large-scale data processing using cloud technologies.',
      responsibilities:
        'Design and implement data pipelines using Apache Spark and cloud services; Optimize data storage and retrieval systems; Collaborate with data scientists to support ML model deployment; Monitor data quality and implement data governance practices; Work with SQL and NoSQL databases.',
      jobSpecUrl: 'https://careers.kainos.com/jobs/data-engineer-london',
      openPositions: 2,
      deleted: 0,
    },
    {
      roleName: 'Data Scientist',
      location: 'Manchester',
      capabilityId: 2, // Data & AI
      bandId: 5, // Principal Consultant
      statusId: 1, // Open
      closingDate: '2025-11-30',
      description:
        'Lead advanced analytics and machine learning projects to drive business insights and innovation. Apply statistical methods and AI techniques to solve complex business problems.',
      responsibilities:
        'Develop and deploy machine learning models; Conduct statistical analysis and data exploration; Present insights to stakeholders and senior management; Lead data science initiatives and mentor team members; Collaborate with engineering teams on model productionization.',
      jobSpecUrl: 'https://careers.kainos.com/jobs/principal-data-scientist-manchester',
      openPositions: 1,
      deleted: 0,
    },
    {
      roleName: 'DevOps Engineer',
      location: 'Belfast',
      capabilityId: 6, // DevOps
      bandId: 3, // Consultant
      statusId: 1, // Open
      closingDate: '2025-10-20',
      description:
        'Streamline our development and deployment processes through automation and infrastructure as code. Build and maintain CI/CD pipelines and cloud infrastructure.',
      responsibilities:
        'Design and maintain CI/CD pipelines using Jenkins, GitLab CI, or Azure DevOps; Implement infrastructure as code using Terraform or ARM templates; Monitor application performance and system health; Automate deployment processes; Manage cloud infrastructure on AWS/Azure.',
      jobSpecUrl: 'https://careers.kainos.com/jobs/devops-engineer-belfast',
      openPositions: 2,
      deleted: 0,
    },
    {
      roleName: 'Test Analyst',
      location: 'Glasgow',
      capabilityId: 5, // Testing
      bandId: 4, // Senior Consultant
      statusId: 1, // Open
      closingDate: '2025-11-10',
      description:
        'Lead testing initiatives and ensure high-quality software delivery through comprehensive test strategies. Drive automation and quality assurance best practices across projects.',
      responsibilities:
        'Develop comprehensive test strategies and plans; Lead test automation initiatives using tools like Selenium, Cypress, or Playwright; Perform manual and automated testing; Collaborate with development teams on quality standards; Mentor junior testers and drive testing best practices.',
      jobSpecUrl: 'https://careers.kainos.com/jobs/senior-test-analyst-glasgow',
      openPositions: 2,
      deleted: 0,
    },
    {
      roleName: 'Cyber Security Consultant',
      location: 'London',
      capabilityId: 7, // Cyber Security
      bandId: 3, // Consultant
      statusId: 1, // Open
      closingDate: '2025-12-01',
      description:
        'Protect our digital assets and client systems through comprehensive security assessments, risk analysis, and implementation of security best practices.',
      responsibilities:
        'Conduct security assessments and penetration testing; Develop security policies and procedures; Implement security controls and monitoring systems; Respond to security incidents; Provide security training and awareness programs.',
      jobSpecUrl: 'https://careers.kainos.com/jobs/cyber-security-consultant-london',
      openPositions: 2,
      deleted: 0,
    },
    {
      roleName: 'Business Analyst',
      location: 'Birmingham',
      capabilityId: 8, // Business Analysis
      bandId: 2, // Associate
      statusId: 1, // Open
      closingDate: '2025-10-28',
      description:
        'Bridge the gap between business needs and technical solutions by gathering requirements, analyzing processes, and facilitating stakeholder communication.',
      responsibilities:
        'Gather and document business requirements; Analyze current business processes and identify improvement opportunities; Create functional specifications and user stories; Facilitate workshops and stakeholder meetings; Support user acceptance testing and training.',
      jobSpecUrl: 'https://careers.kainos.com/jobs/business-analyst-birmingham',
      openPositions: 3,
      deleted: 0,
    },
    {
      roleName: 'UX Designer',
      location: 'Belfast',
      capabilityId: 11, // UX/UI Design
      bandId: 4, // Senior Consultant
      statusId: 1, // Open
      closingDate: '2025-11-05',
      description:
        'Create exceptional user experiences through research, design, and testing. Lead design thinking initiatives and collaborate with development teams to deliver user-centered solutions.',
      responsibilities:
        'Conduct user research and usability testing; Create wireframes, prototypes, and high-fidelity designs; Collaborate with developers on design implementation; Lead design thinking workshops; Maintain design systems and style guides.',
      jobSpecUrl: 'https://careers.kainos.com/jobs/senior-ux-designer-belfast',
      openPositions: 1,
      deleted: 0,
    },
    {
      roleName: 'Cloud Solutions Architect',
      location: 'London',
      capabilityId: 14, // Cloud Solutions
      bandId: 5, // Principal Consultant
      statusId: 1, // Open
      closingDate: '2025-11-20',
      description:
        'Design and lead the implementation of scalable cloud architectures. Drive cloud strategy and guide organizations through their digital transformation journey.',
      responsibilities:
        'Design cloud architecture solutions using AWS, Azure, or GCP; Lead cloud migration projects; Establish cloud governance and best practices; Mentor technical teams on cloud technologies; Collaborate with clients on cloud strategy and roadmap.',
      jobSpecUrl: 'https://careers.kainos.com/jobs/principal-cloud-architect-london',
      openPositions: 1,
      deleted: 0,
    },
    {
      roleName: 'Workday Technical Consultant',
      location: 'Manchester',
      capabilityId: 4, // Workday
      bandId: 3, // Consultant
      statusId: 1, // Open
      closingDate: '2025-10-15',
      description:
        'Implement and configure Workday solutions for HR and finance functions. Work with clients to optimize their Workday environments and integrations.',
      responsibilities:
        'Configure Workday HCM, Finance, and Payroll modules; Develop Workday reports and dashboards; Build integrations using Workday Studio and EIBs; Support Workday testing and deployment activities; Provide end-user training and support.',
      jobSpecUrl: 'https://careers.kainos.com/jobs/workday-consultant-manchester',
      openPositions: 2,
      deleted: 0,
    },
    {
      roleName: 'Graduate Software Engineer',
      location: 'Belfast',
      capabilityId: 1, // Engineering
      bandId: 1, // Trainee
      statusId: 1, // Open
      closingDate: '2025-12-15',
      description:
        'Start your career in software development with our comprehensive graduate program. Learn modern development practices while working on real client projects with full mentorship and support.',
      responsibilities:
        'Learn and apply software development best practices; Participate in our graduate training program; Work on client projects under supervision; Develop skills in multiple programming languages and frameworks; Participate in code reviews and pair programming sessions.',
      jobSpecUrl: 'https://careers.kainos.com/jobs/graduate-software-engineer-belfast',
      openPositions: 10,
      deleted: 0,
    },
    {
      roleName: 'Project Manager',
      location: 'Birmingham',
      capabilityId: 9, // Project Management
      bandId: 4, // Senior Consultant
      statusId: 1, // Open
      closingDate: '2025-11-25',
      description:
        'Lead complex technology projects from initiation to delivery. Manage project scope, timeline, and budget while ensuring high-quality outcomes and client satisfaction.',
      responsibilities:
        'Manage project lifecycle from planning to delivery; Coordinate cross-functional teams and stakeholders; Monitor project progress and manage risks; Ensure projects are delivered on time and within budget; Facilitate agile ceremonies and continuous improvement.',
      jobSpecUrl: 'https://careers.kainos.com/jobs/senior-project-manager-birmingham',
      openPositions: 2,
      deleted: 0,
    },
    {
      roleName: 'Platform Engineer',
      location: 'London',
      capabilityId: 12, // Platform Engineering
      bandId: 3, // Consultant
      statusId: 1, // Open
      closingDate: '2025-10-30',
      description:
        'Build and maintain the foundational platforms and tools that enable our development teams to deliver software efficiently and reliably.',
      responsibilities:
        'Design and implement developer platforms and tooling; Automate infrastructure provisioning and management; Implement monitoring and observability solutions; Support development teams with platform adoption; Ensure platform security and compliance.',
      jobSpecUrl: 'https://careers.kainos.com/jobs/platform-engineer-london',
      openPositions: 2,
      deleted: 0,
    },
    {
      roleName: 'ServiceNow Developer',
      location: 'Glasgow',
      capabilityId: 15, // ServiceNow
      bandId: 2, // Associate
      statusId: 1, // Open
      closingDate: '2025-11-12',
      description:
        'Develop and customize ServiceNow applications to support IT service management and business process automation for our clients.',
      responsibilities:
        'Develop ServiceNow applications and workflows; Customize ServiceNow modules including ITSM, ITOM, and CSM; Create reports and dashboards; Integrate ServiceNow with third-party systems; Support ServiceNow upgrades and maintenance activities.',
      jobSpecUrl: 'https://careers.kainos.com/jobs/servicenow-developer-glasgow',
      openPositions: 3,
      deleted: 0,
    },
  ];

  try {
    // Check if job roles already exist
    const existingJobRoles = await db.select().from(jobRoles);

    if (existingJobRoles.length > 0) {
      console.log(`Job roles already seeded (${existingJobRoles.length} found). Skipping...`);
      return;
    }

    await db.insert(jobRoles).values(jobRolesData);
    console.log(`✅ Successfully seeded ${jobRolesData.length} complete job roles`);
  } catch (error) {
    console.error('❌ Error seeding complete job roles:', error);
    throw error;
  }
}

// Run this file directly to seed complete job roles
if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    await seedJobRoles();
  } finally {
    // Close the database connection to ensure data is persisted
    client.close();
  }
}
