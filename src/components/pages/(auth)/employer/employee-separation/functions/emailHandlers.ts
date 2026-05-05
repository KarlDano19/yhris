import { T_SeparationEmail } from '@/types/globals';

export type EmailType = 'letters' | 'sign documents' | 'last pay' | 'quit claim';

export interface EmailData {
  subject: string;
  email: string[];
  message: string;
  cc?: string[];
  bcc?: string[];
  template?: string;
  attachment?: File | string;
  attachments?: (File | string)[];  // For multiple attachments (sign documents)
}

export interface LetterData {
  date: string;
  email: string;
  message: string;
  subject: string;
  cc?: string[];
  bcc?: string[];
  attachment?: File | string;
}

export interface SeparationItem {
  id: string;
  email: string;
  actionType: string;
  emailType: string;
  separationLetter: {
    to: string | string[];
    message: string;
    subject: string;
    type?: string;
    cc?: string[];
    bcc?: string[];
    attachment?: File | string;
  };
  signDocuments: {
    template: string;
    subject: string;
    to: string[];
    message: string;
    cc?: string[];
    bcc?: string[];
    attachment?: File | string;  // Keep for backward compatibility
    attachments?: (File | string)[];  // For multiple attachments
  };
  lastPay: {
    template: string;
    subject: string;
    to: string[];
    message: string;
    cc?: string[];
    bcc?: string[];
    attachment?: File | string;
  };
  quitClaim: {
    template: string;
    subject: string;
    to: string[];
    message: string;
    cc?: string[];
    bcc?: string[];
    attachment?: File | string;
  };
  isLetterSent: boolean;
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

  if (emailType === 'letters') {
    // Letters are handled by handleLetterSending function
    throw new Error('Letters should be handled by handleLetterSending function');
  } else if (emailType === 'sign documents') {
    if (!separationItemCopy.signDocuments) separationItemCopy.signDocuments = {};
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
    // Handle multiple attachments for sign documents
    if (data.attachments && Array.isArray(data.attachments) && data.attachments.length > 0) {
      separationItemCopy.signDocuments.attachments = data.attachments;
    } else if (data.attachment) {
      // Backward compatibility: single attachment
      separationItemCopy.signDocuments.attachment = data.attachment;
    }
    separationItemCopy.isDocumentsSent = true;
  } else if (emailType === 'last pay') {
    if (!separationItemCopy.lastPay) separationItemCopy.lastPay = {};
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
    // Handle multiple attachments
    if (data.attachments && Array.isArray(data.attachments) && data.attachments.length > 0) {
      separationItemCopy.lastPay.attachments = data.attachments;
    } else if (data.attachment) {
      separationItemCopy.lastPay.attachment = data.attachment;
    }
    separationItemCopy.isLastPayReleased = true;
  } else if (emailType === 'quit claim') {
    if (!separationItemCopy.quitClaim) separationItemCopy.quitClaim = {};
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
    // Handle multiple attachments
    if (data.attachments && Array.isArray(data.attachments) && data.attachments.length > 0) {
      separationItemCopy.quitClaim.attachments = data.attachments;
    } else if (data.attachment) {
      separationItemCopy.quitClaim.attachment = data.attachment;
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

/**
 * Handles the logic for preparing letter data for sending, updating the relevant fields
 * in a copy of the separation item for letter type emails.
 * @param data The letter form data (EmailData format from SendEmailModal).
 * @param separationItems The current array of separation items.
 * @param selectedSeparationId The ID of the currently selected separation item.
 * @param letterType The type of letter being sent.
 * @returns The updated separation item ready for mutation.
 */
export const handleLetterSending = (
  data: EmailData,
  separationItems: SeparationItem[],
  selectedSeparationId: string | number,
  letterType?: string
): T_SeparationEmail => {
  const itemIndex = separationItems.findIndex((item: any) => item.id === selectedSeparationId);
  const separationItemCopy = JSON.parse(JSON.stringify(separationItems[itemIndex])); // Deep copy to ensure immutability

  // Initialize separationLetter if not present (API response may not include it)
  if (!separationItemCopy.separationLetter) {
    separationItemCopy.separationLetter = {};
  }

  // Update letter-specific fields
  separationItemCopy.separationLetter.subject = data.subject;
  separationItemCopy.separationLetter.to = data.email;
  separationItemCopy.separationLetter.message = data.message;
  if (data.cc) {
    separationItemCopy.separationLetter.cc = data.cc;
  }
  if (data.bcc) {
    separationItemCopy.separationLetter.bcc = data.bcc;
  }
  if (data.attachment) {
    separationItemCopy.separationLetter.attachment = data.attachment;
  }
  if (letterType) {
    separationItemCopy.separationLetter.type = letterType;
  }
  separationItemCopy.isLetterSent = true;

  // Set common fields
  separationItemCopy.actionType = 'sending';
  separationItemCopy.emailType = 'letters';

  return separationItemCopy;
};
