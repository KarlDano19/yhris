export const separationItems = [
    {
        id: 1,
        separationDate: '04/07/2023',
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
        quitclaim: {
            template: '',
            to: '',
            message: '',
        },
        isLetterSent: true,
        isLetterReceived: true,
        letterReceivedDate: "04/07/2023",
        isDocumentsSent: false,
        isDocumentsReceived: false,
        documentReceivedDate: "",
        isLastPayReleased: false,
        isQuitclaimSigned: false,
        isQuitclaimReceived: false,
        quitclaimReceivedDate: "",
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
        quitclaim: {
            template: '',
            to: '',
            message: '',
        },
        isLetterSent: false,
        isLetterReceived: false,
        letterReceivedDate: "",
        isDocumentsSent: false,
        isDocumentsReceived: false,
        documentReceivedDate: "",
        isLastPayReleased: false,
        isQuitclaimSigned: false,
        isQuitclaimReceived: false,
        quitclaimReceivedDate: "",
    },
]

export const employeeIssueItems = [
    {
        id: 1,
        incidentDate: '04/07/2023',
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
        sendDecision: {
            date: '',
            to: '',
            message: '',
        },
        isDecisionSent: false,
        isDecisionReceived: false,
    }
];

export const createMemoPolicyItems = [
    {
        id: 1,
        type: 'memo',
        title: '',
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
        title: '',
        to: '',
        purpose: '',
        benefits: '',
        coverage: '',
        eligibility: '',
    }
];