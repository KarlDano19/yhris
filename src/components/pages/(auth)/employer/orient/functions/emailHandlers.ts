export type EmailType = 'contract' | 'introduce';

export interface EmailData {
  subject: string;
  email: string[];
  message: string;
  cc?: string[];
  bcc?: string[];
  attachment?: File | string; // Legacy support
  attachments?: (File | string)[]; // Multiple attachments
}

export interface OrientItem {
  id: string;
  email: string;
  sendContract: {
    subject: string;
    to: string[];
    message: string;
    cc?: string[];
    bcc?: string[];
    attachment?: File | string; // Legacy support
    attachments?: (File | string)[]; // Multiple attachments
  };
  introduceTeam: {
    subject: string;
    to: string[];
    message: string;
    cc?: string[];
    bcc?: string[];
    attachment?: File | string; // Legacy support
    attachments?: (File | string)[]; // Multiple attachments
  };
  isContractSent: boolean;
  isIntroduced: boolean;
  actionType: string;
  emailType: string;
}

/**
 * Handles email sending logic for both contract and introduction emails
 * @param data - Email form data
 * @param emailType - Type of email ('contract' or 'introduce')
 * @param orientItems - Array of orientation items
 * @param selectedOrientId - ID of the selected orientation item
 * @returns Updated orientation item ready for mutation
 */
export const handleEmailSending = (
  data: EmailData,
  emailType: EmailType,
  orientItems: OrientItem[],
  selectedOrientId: string
): OrientItem => {
  const itemIndex = orientItems.findIndex((item: any) => item.id === selectedOrientId);
  const orientItemCopy = JSON.parse(JSON.stringify(orientItems[itemIndex]));
  
  // Set email data based on type
  if (emailType === 'contract') {
    orientItemCopy.sendContract.subject = data.subject;
    orientItemCopy.sendContract.to = data.email;
    orientItemCopy.sendContract.message = data.message;
    if (data.cc) {
      orientItemCopy.sendContract.cc = data.cc;
    }
    if (data.bcc) {
      orientItemCopy.sendContract.bcc = data.bcc;
    }
    // Handle multiple attachments (new format)
    if (data.attachments && Array.isArray(data.attachments) && data.attachments.length > 0) {
      orientItemCopy.sendContract.attachments = data.attachments;
    }
    // Legacy support: single attachment
    else if (data.attachment) {
      orientItemCopy.sendContract.attachment = data.attachment;
    }
    orientItemCopy.isContractSent = true;
  } else if (emailType === 'introduce') {
    orientItemCopy.introduceTeam.subject = data.subject;
    orientItemCopy.introduceTeam.to = data.email;
    orientItemCopy.introduceTeam.message = data.message;
    if (data.cc) {
      orientItemCopy.introduceTeam.cc = data.cc;
    }
    if (data.bcc) {
      orientItemCopy.introduceTeam.bcc = data.bcc;
    }
    // Handle multiple attachments (new format)
    if (data.attachments && Array.isArray(data.attachments) && data.attachments.length > 0) {
      orientItemCopy.introduceTeam.attachments = data.attachments;
    }
    // Legacy support: single attachment
    else if (data.attachment) {
      orientItemCopy.introduceTeam.attachment = data.attachment;
    }
    orientItemCopy.isIntroduced = true;
  }
  
  // Set common fields
  orientItemCopy.actionType = 'sending';
  orientItemCopy.emailType = emailType;
  
  return orientItemCopy;
};

/**
 * Updates the orient items array with the updated item
 * @param orientItems - Current array of orientation items
 * @param updatedItem - The updated item to replace
 * @param selectedOrientId - ID of the selected orientation item
 * @returns Updated array of orientation items
 */
export const updateOrientItems = (
  orientItems: OrientItem[],
  updatedItem: OrientItem,
  selectedOrientId: string
): OrientItem[] => {
  return orientItems.map((item: any) => 
    item.id === selectedOrientId ? updatedItem : item
  );
};
