/**
 * Simplified Loops Integration for Free Accounts
 * Focuses on standard fields that work with free Loops accounts
 */

import { loopsService, LoopsContact } from '@/lib/loops';

/**
 * Simplified contact sync for free Loops accounts
 * Uses only essential fields and handles existing contacts
 */
export async function syncContactSimple(contactData: {
  email: string;
  name?: string;
  company?: string;
  source?: string;
}): Promise<boolean> {
  try {
    // First, try to update the existing contact
    const updateSuccess = await loopsService.updateContact(contactData.email, {
      name: contactData.name,
      company: contactData.company,
      userGroup: 'YAHSHUA HRIS',
      product: 'YHRIS',
      source: contactData.source || 'profile-setup',
    });

    if (updateSuccess) {
      return true;
    }

    // If update fails, try to create new contact
    const contact: LoopsContact = {
      email: contactData.email,
      name: contactData.name,
      company: contactData.company,
      userGroup: 'YAHSHUA HRIS',
      product: 'YHRIS',
      source: contactData.source || 'profile-setup',
    };
    
    const createSuccess = await loopsService.createOrUpdateContact(contact);
    
    if (createSuccess) {
      // Send a simple event
      await loopsService.sendEvent(contactData.email, 'yhrisNewUser', {
        companyName: contactData.company,
        source: contactData.source,
        timestamp: new Date().toISOString(),
      });
    }

    return createSuccess;
  } catch (error) {
    if (LOOPS_CONFIG.FEATURES.LOG_ERRORS) {
      console.error('Error syncing simplified contact:', error);
    }
    return false;
  }
}

/**
 * Store company data as contact properties (only essential fields)
 * This approach updates contact fields instead of creating events
 */
export async function syncCompanyViaEvent(email: string, companyData: any): Promise<boolean> {
  try {
    // Use the contact update approach with only essential fields
    return await loopsService.updateContact(email, {
      company: companyData.companyName,
      source: 'profile-setup',
    });
  } catch (error) {
    if (LOOPS_CONFIG.FEATURES.LOG_ERRORS) {
      console.error('Error updating contact with company data:', error);
    }
    return false;
  }
}
