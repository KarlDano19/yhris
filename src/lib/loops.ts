/**
 * Loops.so Integration Service
 * Handles user registration and profile updates to Loops email marketing platform
 */

import { LOOPS_CONFIG } from './loopsConfig';

export interface LoopsContact {
  email: string;
  name?: string; // Full name field
  company?: string;
  userGroup?: string;
  product?: string;
  source?: string;
}

class LoopsService {
  private apiUrl: string;

  constructor() {
    // Use internal API routes instead of direct Loops API calls
    this.apiUrl = '/api/loops';
  }

  /**
   * Create or update a contact in Loops
   */
  async createOrUpdateContact(contact: LoopsContact): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiUrl}/contacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: contact.email,
          name: contact.name,
          company: contact.company,
          userGroup: contact.userGroup || LOOPS_CONFIG.DEFAULT_VALUES.userGroup,
          product: contact.product || LOOPS_CONFIG.DEFAULT_VALUES.product,
          source: contact.source,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (LOOPS_CONFIG.FEATURES.LOG_ERRORS) {
          console.error('Loops API error:', errorData);
        }
        return false;
      }

      const result = await response.json();
      return true;
    } catch (error) {
      if (LOOPS_CONFIG.FEATURES.LOG_ERRORS) {
        console.error('Error syncing to Loops:', error);
      }
      return false;
    }
  }

  /**
   * Update contact properties
   */
  async updateContact(email: string, properties: Partial<LoopsContact>): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiUrl}/contacts/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          ...properties,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (LOOPS_CONFIG.FEATURES.LOG_ERRORS) {
          console.error('Loops API error:', errorData);
        }
        return false;
      }

      return true;
    } catch (error) {
      if (LOOPS_CONFIG.FEATURES.LOG_ERRORS) {
        console.error('Error updating contact in Loops:', error);
      }
      return false;
    }
  }

  /**
   * Send event to trigger automation
   */
  async sendEvent(email: string, eventName: string, eventProperties?: Record<string, any>): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiUrl}/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          eventName: eventName,
          eventProperties: eventProperties,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (LOOPS_CONFIG.FEATURES.LOG_ERRORS) {
          console.error('Loops event error:', errorData);
        }
        return false;
      }

      return true;
    } catch (error) {
      if (LOOPS_CONFIG.FEATURES.LOG_ERRORS) {
        console.error('Error sending event to Loops:', error);
      }
      return false;
    }
  }
}

export const loopsService = new LoopsService();
