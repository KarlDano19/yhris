export type T_LetterModal = {
    type: acceptance | separation,
    id: number,
}

export type T_DocumentsModal = {
    isOpen: boolean,
    id: number,
}

export type T_LastPayModal = {
    isOpen: boolean,
    id: number,
}

export type T_QuitclaimModal = {
    isOpen: boolean,
    id: number,
}

export type T_Separation = {
    date: string;
    name: string;
    position: string;
    department: string;
    reason: string;
};

export type T_Login = {
    email: string;
    password: string;
}

export type T_Register = {
    accountType: string;
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export type T_EmployerDetails = {
    companyName: string;
    companyLogo: any;
    companyDescription: string;
    typeOfIndustry: string;
    noOfEmployees: string;
    workSetUp: string;
    email: string;
    mobileNumber: string;
    landlineNumber: string;
    building: string;
    street: string;
    locality: string;
    city: string;
    zipCode: string;
    country: string;
}

export type T_EmployerSettings = {
    language: string;
    currency: string;
}