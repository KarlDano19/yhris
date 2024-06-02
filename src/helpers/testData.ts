import { faL } from "@fortawesome/free-solid-svg-icons";

export const separationItems = [
  {
    id: 1,
    separationDate: '05/10/2023',
    name: 'Heather Sakitsaulo',
    reasonForLeaving: 'Resignation',
    department: '',
    position: '',
    acceptanceLetter: {
      date: '',
      to: '',
      message: '',
    },
    separationLetter: {
      date: '',
      to: '',
      message: '',
    },
    signDocuments: {
      template: '',
      to: '',
      message: '',
    },
    quitClaim: {
      template: '',
      to: '',
      message: '',
    },
    isLetterSent: true,
    isLetterReceived: true,
    letterReceivedDate: '05/10/2023',
    isDocumentsSent: false,
    isDocumentsReceived: false,
    documentReceivedDate: '',
    isLastPayReleased: false,
    isQuitclaimSigned: false,
    isQuitclaimReceived: false,
    quitclaimReceivedDate: '',
  },
  {
    id: 2,
    separationDate: '05/10/2023',
    name: 'Heather Sakitsaulo',
    reasonForLeaving: 'Resignation',
    department: '',
    position: '',
    acceptanceLetter: {
      date: '',
      to: '',
      message: '',
    },
    separationLetter: {
      date: '',
      to: '',
      message: '',
    },
    signDocuments: {
      template: '',
      to: '',
      message: '',
    },
    quitClaim: {
      template: '',
      to: '',
      message: '',
    },
    isLetterSent: false,
    isLetterReceived: false,
    letterReceivedDate: '',
    isDocumentsSent: false,
    isDocumentsReceived: false,
    documentReceivedDate: '',
    isLastPayReleased: false,
    isQuitclaimSigned: false,
    isQuitclaimReceived: false,
    quitclaimReceivedDate: '',
  },
];

export const employeeIssueItems = [
  {
    id: 1,
    incidentDate: '05/10/2023',
    name: 'Heather Sakitsaulo',
    incidentPlace: 'WFX',
    department: '',
    position: '',
    briefBackground: '',
    issueNTE: {
      date: '',
      to: '',
      message: '',
    },
    isNTESent: false,
    isNTEReceived: false,
    investigate: {
      date: '',
      witness: '',
      presider: '',
      isEmployeePresent: false,
      result: '',
      decision: '',
      attachment: '',
    },
    isInvestigated: false,
    investigatedDate: '05/10/2023',
    sendDecision: {
      template: '',
      to: '',
      message: '',
    },
    decisionSentDate: '05/10/2023',
    isDecisionSent: false,
    isDecisionReceived: false,
  },
];

export const createMemoPolicyItems = [
  {
    date: '05/10/2023',
    id: 1,
    type: 'memo',
    title: 'PHIC Update 2023',
    to: '',
    body: '',
    name: '',
    position: '',
    signature: '',
    qrCode: '',
    file: '',
    purpose: '',
    policy: '',
    procedure: '',
    withResponse: false,
    isDeleted: false,
  },
];

export const designBenefitsItems = [
  {
    id: 1,
    title: 'Birthday Leave',
    to: 'test@gmail.com',
    purpose: 'Lorem Ipsum Dolor',
    benefits: 'Lorem Ipsum Dolor',
    coverage: 'Lorem Ipsum Dolor',
    eligibility: 'Lorem Ipsum Dolor',
    date: '04/07/2023',
  },
];

export const jobPostHistory = [
  {
    id: 1,
    isActive: false,
    JobNo: "000001",
    country: "",
    language: "",
    jobTitle: "Accounting Officer",
    placeAdvertise: "Cagayan de Oro City",
    jobType: "Full-Time",
    schedule: "8 Hour shift",
    hireCount: 2,
    hireDate: "04/07/2023",
    salary: {
      salaryType: "Minimum Amount",
      salaryValue: "20,000",
    },
    rate: "",
    benefits: ["Work from home", "Paid Training", "Flexible Schedule"],
    jobDescription:
      "<p><strong>Ensuring the accounts of the company are accurate and free of error.</strong></p><p><br></p><ul><li>Must have at least 2 years of experience in accounting.</li><li>Any graduate of business course</li><li>Must have attention to details and a good communicator</li></ul>",
    jobDescriptionFile: "",
    postAs: "",
    postAsUpload: "",
    postIn: ["LinkedIn", "Facebook", "Indeed"],
  },

  {
    id: 2,
    date: "04/12/2023",
    isActive: true,
    JobNo: "000002",
    country: "",
    language: "",
    jobTitle: "Software Engineer",
    placeAdvertise: "Cagayan de Oro City",
    jobType: "Full-Time",
    schedule: "8 Hour shift",
    hireCount: 4,
    hireDate: "05/10/2023",
    salary: {
      salaryType: "Exact Amount",
      salaryValue: "20,000",
    },
    rate: "",
    benefits: ["Birthday Leave", "Meal Allowance", "Flexible Schedule"],
    jobDescription:
      "<p><strong>Ensuring the accounts of the company are accurate and free of error.</strong></p><p><br></p><ul><li>Must have at least 2 years of experience in accounting.</li><li>Any graduate of business course</li><li>Must have attention to details and a good communicator</li></ul>",
    jobDescriptionFile: "",
    postAs: "",
    postAsUpload: "",
    postIn: ["LinkedIn", "Facebook", "Indeed", "Twitter", "Instagram"],
  },
];

export const orientItems = [
  {
    id: 1,
    date: "04/12/2023",
    position: "Accounting Officer",
    email: "malinawon.henry19@gmail.com",
    name: "Juan Dela Cruz",
    sendContract: {
      template: "Please Sign & Comply: ABBA-YAHSHUA Employee Contract & Documents",
      to: "",
      message: "",
    },
    isContractSent: false,
    isContractReceived: false,
    contractReceivedDate: "04/12/2023",
    orient: {
      accountExist: false,
      integratedToDolo: false,
      loggedInToDolo: false,
      material: "New Hire Orientation",
      likeToSend: false,
      sendTo: null,
    },
    isOrientationSent: false,
    isNewHireOriented: false,
    introduce: {
      template: "",
      to: "",
      message: "",
    },
    isIntroduceSent: false,
    isSingedInToPayroll: false,
    isNewHireEnrolled: false,
  }
];

export const evaluationHistoryItems = [
  {
    id: 1,
    employee: 'Heather Sakitsaulo',
    eval_date: '05/10/2023',
    eval_period: '2023',
    eval_form: 'Performance Evaluation Form',
    status: 'Completed',
    overall_rating: '4.5',
  },
  {
    id: 2,
    employee: 'Heather Sakitsaulo',
    eval_date: '05/10/2023',
    eval_period: '2023',
    eval_form: 'Performance Evaluation Form',
    status: 'Completed',
    overall_rating: '4.5',
  }
];
