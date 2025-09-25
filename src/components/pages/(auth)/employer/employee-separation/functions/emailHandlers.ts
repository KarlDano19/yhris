import { T_SeparationEmail } from '@/types/globals';

export type EmailType = 'sign documents' | 'last pay' | 'quit claim';

export interface EmailData {
  subject: string;
  email: string[];
  message: string;
  cc?: string[];
  bcc?: string[];
  template?: string;
}

export interface SeparationItem {
  id: string;
  email: string;
  actionType: string;
  emailType: string;
  separationLetter: {
    date: string;
    to: string;
    message: string;
  };
  signDocuments: {
    template: string;
    subject: string;
    to: string[];
    message: string;
    cc?: string[];
    bcc?: string[];
  };
  lastPay: {
    template: string;
    subject: string;
    to: string[];
    message: string;
    cc?: string[];
    bcc?: string[];
  };
  quitClaim: {
    template: string;
    subject: string;
    to: string[];
    message: string;
    cc?: string[];
    bcc?: string[];
  };
  isDocumentsSent: boolean;
  isLastPayReleased: boolean;
  isQuitclaimSigned: boolean;
  // Add other properties of SeparationItem as needed
  [key: string]: any; // For flexibility with other properties
}

/**
 * Handles the logic for preparing email data for sending, updating the relevant fields
 * in a copy of the separation item based on the email type.
 * @param data The email form data.
 * @param emailType The type of email being sent ('sign documents', 'last pay', or 'quit claim').
 * @param separationItems The current array of separation items.
 * @param selectedSeparationId The ID of the currently selected separation item.
 * @returns The updated separation item ready for mutation.
 */
export const handleEmailSending = (
  data: EmailData,
  emailType: EmailType,
  separationItems: SeparationItem[],
  selectedSeparationId: string | number
): T_SeparationEmail => {
  const itemIndex = separationItems.findIndex((item: any) => item.id === selectedSeparationId);
  const separationItemCopy = JSON.parse(JSON.stringify(separationItems[itemIndex])); // Deep copy to ensure immutability

  if (emailType === 'sign documents') {
    separationItemCopy.signDocuments.template = data.template || '';
    separationItemCopy.signDocuments.subject = data.subject;
    separationItemCopy.signDocuments.to = data.email;
    separationItemCopy.signDocuments.message = data.message;
    if (data.cc) {
      separationItemCopy.signDocuments.cc = data.cc;
    }
    if (data.bcc) {
      separationItemCopy.signDocuments.bcc = data.bcc;
    }
    separationItemCopy.isDocumentsSent = true;
  } else if (emailType === 'last pay') {
    separationItemCopy.lastPay.template = data.template || '';
    separationItemCopy.lastPay.subject = data.subject;
    separationItemCopy.lastPay.to = data.email;
    separationItemCopy.lastPay.message = data.message;
    if (data.cc) {
      separationItemCopy.lastPay.cc = data.cc;
    }
    if (data.bcc) {
      separationItemCopy.lastPay.bcc = data.bcc;
    }
    separationItemCopy.isLastPayReleased = true;
  } else if (emailType === 'quit claim') {
    separationItemCopy.quitClaim.template = data.template || '';
    separationItemCopy.quitClaim.subject = data.subject;
    separationItemCopy.quitClaim.to = data.email;
    separationItemCopy.quitClaim.message = data.message;
    if (data.cc) {
      separationItemCopy.quitClaim.cc = data.cc;
    }
    if (data.bcc) {
      separationItemCopy.quitClaim.bcc = data.bcc;
    }
    separationItemCopy.isQuitclaimSigned = true;
  }

  // Set common fields
  separationItemCopy.actionType = 'sending';
  separationItemCopy.emailType = emailType;

  return separationItemCopy;
};

/**
 * Updates the separation items array with a modified item, ensuring immutability.
 * @param currentSeparationItems The current array of separation items.
 * @param updatedItem The single separation item that has been updated.
 * @param selectedSeparationId The ID of the updated item.
 * @returns A new array of separation items with the specified item updated.
 */
export const updateSeparationItems = (
  currentSeparationItems: SeparationItem[],
  updatedItem: T_SeparationEmail,
  selectedSeparationId: string | number
): SeparationItem[] => {
  return currentSeparationItems.map((item: any) =>
    item.id === selectedSeparationId ? { ...item, ...updatedItem } : item
  );
};
