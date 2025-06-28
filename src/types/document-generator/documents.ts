export interface EmployeeCertificateFormData {
    employeeName: string;
    companyName: string;
    position: string;
    startDate: string;
    endDate: string;
    purpose: string;
    dateOfIssuance: string;
    placeOfIssuance: string;
    signatoryName: string;
    signatoryPosition: string;
    letterheadImage: File | null;
    sampleLetterheadPath?: string;
    signature: string | File | null;
    documentTitle: string;
    borderColor: string;
    } 

export interface EmploymentAgreementFormData {
    employeeName: string;
    companyName: string;
    position: string;
    startDate: string;
    probationPeriod: string;
    workingHours: string;
    dailySalary: string;
    dateOfIssuance: string;
    placeOfIssuance: string;
    signatoryName: string;
    signatoryPosition: string;
    companyAddress: string;
    signature: File | string | null;
    }

export interface NoticeToExplainFormData {
    employeeName: string;
    position: string;
    dateIssued: string;
    companyName: string;
    dateOfIssuance: string;
    placeOfIssuance: string;
    signatoryName: string;
    signatoryPosition: string;
    incidentDate: string;
    incidentPlace: string;
    briefBackground: string;
    preparedBy: string;
    reviewedBy: string;
    receivedBy: string;
    employeeExplanation: string;
    hearingNotes: string;
    managementDecision: string;
    logoImage: File | null;
    sampleLogoPath: string;
    signature: File | string | null;
    borderColor: string;
    } 

export interface PrintOptions {
    elementId: string;
    title: string;
    fileName?: string;
  }