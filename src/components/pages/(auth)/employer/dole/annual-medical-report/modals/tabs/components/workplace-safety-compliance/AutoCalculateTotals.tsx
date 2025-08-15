import { useEffect } from 'react';

interface AutoCalculateTotalsProps {
  watch: any;
  setValue: any;
}

// Define types for watch callback
interface WatchObserverParams {
  name?: string;
  type?: string;
  value?: any;
}

export function AutoCalculateTotals({ watch, setValue }: AutoCalculateTotalsProps) {
  useEffect(() => {
    // List of all base field names
    const fieldNames = [
      // Report of Occupational Accidents/Injuries
      'contusion_bruises_hematoma',
      'abrasions',
      'cuts_lacerations_punctures',
      'concussion',
      'avulsion',
      'amputation_loss_body_part',
      'crushing_injury',
      'spinal_injury',
      'cranial_injury',
      'sprain',
      'dislocation_fracture',
      'burns_injury',

      // Immunization Program (Indicate number immunized)
      'tetanus_toxoid_injection',
      'tetanus_antitoxin_injection',
      'tetanus_globulin_injection',
      'hepatitis_b_vaccination',
      'rabies_vaccination',
      'others_immunization',
    ];

    // Set up subscriptions for male and female fields
    const subscription = watch((value: any, { name, type }: WatchObserverParams) => {
      if (name && (name.endsWith('_male') || name.endsWith('_female'))) {
        // Extract the base field name
        const baseFieldName = name.replace(/_(male|female)$/, '');
        
        // If this is a field we care about, recalculate its total
        if (fieldNames.includes(baseFieldName)) {
          const maleValue = Number(watch(`${baseFieldName}_male`)) || 0;
          const femaleValue = Number(watch(`${baseFieldName}_female`)) || 0;
          setValue(`${baseFieldName}_total`, maleValue + femaleValue, { shouldValidate: false });
        }
      }
    });
    
    // Clean up subscription
    return () => subscription.unsubscribe();
  }, [watch, setValue]);

  // This component doesn't render anything visible
  return null;
}

export default AutoCalculateTotals;
