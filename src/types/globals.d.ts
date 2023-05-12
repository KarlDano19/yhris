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

export type T_IncidentReport = {
    date: string;
    name: string;
    position: string;
    department: string;
    incidentDate: string;
    incidentPlace: string;
    briefBackground: string;
};