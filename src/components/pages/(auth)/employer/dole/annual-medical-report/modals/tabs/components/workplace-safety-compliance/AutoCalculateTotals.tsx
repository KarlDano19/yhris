import { useEffect } from 'react';

interface AutoCalculateTotalsProps {
  watch: any;
  setValue: any;
}

export function AutoCalculateTotals({ watch, setValue }: AutoCalculateTotalsProps) {
  // Watch all fields
  const watchedValues = watch();
  
  useEffect(() => {
    // Helper function to calculate totals
    const calculateTotal = (baseFieldName: string) => {
      const maleValue = Number(watchedValues[`${baseFieldName}_male`]) || 0;
      const femaleValue = Number(watchedValues[`${baseFieldName}_female`]) || 0;
      setValue(`${baseFieldName}_total`, maleValue + femaleValue);
    };

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

    // Calculate totals for all fields
    fieldNames.forEach(calculateTotal);
    
  }, [watch, setValue, watchedValues]);

  // This component doesn't render anything visible
  return null;
}

export default AutoCalculateTotals;
