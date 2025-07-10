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
      // Skin
      'allergy',
      'dermatoses',
      'infection_as_folliculitis_abscess_paronychia',
      'others_skin',
      
      // Head
      'tension_headache',
      'others_head',
      
      // Eyes
      'cataract',
      'error_of_refraction',
      'bacterial_viral_conjunctivities',
      'others_eyes',
      
      // Mouth & ENT
      'gingivitis',
      'herpes_labiales_nasalis',
      'otitis_media_externa',
      'deafness',
      'meniere_s_syndrome_vertigo',
      'rhinitis_colds',
      'nasal_polyps',
      'sinusitis',
      'tonsillapharyngitis',
      'laryngitis',
      'others_ent',

      // Respiratory
      'bronchitis',
      'bronchial_asthma',
      'pneumonia',
      'tuberculosis',
      'pneumoconiosis',
      'others_respiratory',

      // Heart and Blood Vessels
      'hypertension',
      'hypotension',
      'angina_pectoria',
      'myocardial_infarction',
      'vascular_disturbance',
      'others_heart',

      // Gastrointestinal
      'gastroenteritis_diarhea',
      'amoebiasis',
      'gastritis_hyperacidity',
      'appendicitis',
      'infectious_hepatitis',
      'liver_cirrhosis',
      'hepatic_abscess',
      'cancer_hepatic_gastric',
      'ulcer',
      'others_gastrointestinal',

      // Genito Urinary
      'urinary_tract_infection',
      'stones',
      'cancer',
      'others_genitourinary',

      // Reproductive
      'dysmenorrhea',
      'infection_cervicitis_vaginitis',
      'abortion_spontaneous_threatened',
      'hyperemesis_gravidarum',
      'uterine_tumors',
      'cervical_polyp_cancer',
      'ovarian_cyst_tumors',
      'sexually_transmitted_diseases',
      'hermia_inguinal_femoral',
      'others_reproductive',

      // Neuromuscular / Skeletal / Joints
      'peripheral_neuritis',
      'torticollis',
      'arthritis',
      'others_skeletal',

      // Lymphatic and Immune System
      'anemia',
      'leukemia',
      'cerebrovascular_accident',
      'lymphadenitis',
      'lymphoma',

      // Infectious Diseases
      'influenza',
      'typhoid_fever',
      'cholera',
      'measles',
      'tetanus',
      'malaria',
      'schistosomiasis',
      'herpes_zoster',
      'chicken_pox',
      'german_measles',
      'rabies',
      'others_infectious',

      // Diseases due to Noise and Vibration
      'deafness_noise_induced',
      'white_fingers_disease',
      'musculo_skeletal_disturbances',
      'fatigue',

      // Diseases due to Temperature And Humidity abnormalities
      'heat_stroke',
      'heat_cramps',
      'dehydration',
      'heat_exhaustion',
      'others_heat',

      // Diseases due to Radiation
      'decompression_sickness',
      'air_embolism',
      'bends_disease',
      'barotrauma',
      'hypoxia',
      'altitude_sickness',
      'cataract_radiation',
      'keratitis',
      'burns',
      'radiation_related_cancers',
    ];

    // Calculate totals for all fields
    fieldNames.forEach(calculateTotal);
    
  }, [watch, setValue, watchedValues]);

  // This component doesn't render anything visible
  return null;
}

export default AutoCalculateTotals;
