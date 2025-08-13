import React from 'react';

import DocumentPageOne from './print/DocumentPageOne';
import DocumentPageTwo from './print/DocumentPageTwo';
import DocumentPageThree from './print/DocumentPageThree';
import DocumentPageFour from './print/DocumentPageFour';
import DocumentPageFive from './print/DocumentPageFive';
import DocumentPageSix from './print/DocumentPageSix';

interface AnnualMedicalReportData {
  establishmentName: string;
  address: string;
  ownerManager: string;
  natureOfBusiness: string;
  totalEmployees: number;
  numberOfShifts: number;
  reportPeriod: {
    from: string;
    to: string;
  };
  shifts: {
    first: { male: number; female: number; total: number };
    second: { male: number; female: number; total: number };
    third: { male: number; female: number; total: number };
  };
  healthService: {
    organizedBy: 'establishment' | 'government' | 'other';
    otherSpecify?: string;
    serviceType: 'solely' | 'common';
  };
  occupationalHealthStaff: {
    consultant: { name: string; address: string };
    physician: { name: string; address: string };
    dentist: { name: string; address: string };
    nurse: { name: string; address: string };
    inspectionFrequency: 'other' | 'monthly' | 'quarterly' | 'biannual';
  };
  emergencyServices: {
    hasTreatmentRoom: boolean;
    otherDetails?: string;
  };
  workSchedule: {
    physician: { hours: number; shift: string };
    dentist: { hours: number; shift: string };
    practitioner: { hours: number; shift: string };
    nurse: { hours: number; shift: string };
  };
}

export const pageOne = (item: any, companyName?: string, reportPeriodFrom?: string, reportPeriodTo?: string): AnnualMedicalReportData => {
  return {
    establishmentName: companyName || '\u00A0',
    address: item.address || '\u00A0',
    ownerManager: item.name_of_owner_manager || '\u00A0',
    natureOfBusiness: item.type_of_industry || '\u00A0',
    totalEmployees: item.total_number_of_employees || 0,
    numberOfShifts: item.number_of_shifts || 0,
    reportPeriod: {
      from: reportPeriodFrom || '\u00A0',
      to: reportPeriodTo || '\u00A0',
    },
    shifts: {
      first: { 
        male: item.male_shop_workers_shift_1 || 0, 
        female: item.female_shop_workers_shift_1 || 0, 
        total: item.total_shop_workers_shift_1 || 0
      },
      second: { 
        male: item.male_shop_workers_shift_2 || 0, 
        female: item.female_shop_workers_shift_2 || 0, 
        total: item.total_shop_workers_shift_2 || 0
      },
      third: { 
        male: item.male_shop_workers_shift_3 || 0, 
        female: item.female_shop_workers_shift_3 || 0, 
        total: item.total_shop_workers_shift_3 || 0
      },
    },
    healthService: {
      organizedBy: item.occupational_health_services_by?.[0] === 'establishment/undertaking' ? 'establishment' : 
                   item.occupational_health_services_by?.[0] === 'government authority/institution' ? 'government' :
                   item.occupational_health_services_by?.[0] === 'other bodies/groups/institution' ? 'other' : 'establishment',
      otherSpecify: item.occupational_health_services_by_other_specification || '\u00A0',
      serviceType: item.occupational_health_services_as_a_service?.[0] === 'solely for the workers of the establishment/undertaking' ? 'solely' :
                   item.occupational_health_services_as_a_service?.[0] === 'common to a number of establishments/undertakings' ? 'common' : 'solely',
    },
    occupationalHealthStaff: {
      consultant: { 
        name: item.employer_engages_the_services_of?.[0] || '\u00A0', 
        address: '\u00A0' // Not available in the data
      },
      physician: { 
        name: '\u00A0', // Not available in the data
        address: '\u00A0' // Not available in the data
      },
      dentist: { 
        name: '\u00A0', // Not available in the data
        address: '\u00A0' // Not available in the data
      },
      nurse: { 
        name: '\u00A0', // Not available in the data
        address: '\u00A0' // Not available in the data
      },
      inspectionFrequency: item.conduct_inspection_of_workplace?.[0] || 'monthly',
    },
    emergencyServices: {
      hasTreatmentRoom: (Array.isArray(item.provided_treatment_room_medical_clinic) && item.provided_treatment_room_medical_clinic[0]?.includes('yes')) || (!Array.isArray(item.provided_treatment_room_medical_clinic) && item.provided_treatment_room_medical_clinic?.includes('yes')) || false,
      otherDetails: item.provided_treatment_room_medical_clinic_other_specification || '\u00A0',
    },
    workSchedule: {
      physician: { 
        hours: item.occupational_health_physician_hours_per_day || 0, 
        shift: item.occupational_health_physician_shift || '\u00A0' 
      },
      dentist: { 
        hours: item.occupational_health_dentist_hours_per_day || 0, 
        shift: item.occupational_health_dentist_shift || '\u00A0' 
      },
      practitioner: { 
        hours: item.occupational_health_practitioner_hours_per_day || 0, 
        shift: item.occupational_health_practitioner_shift || '\u00A0' 
      },
      nurse: { 
        hours: item.occupational_health_nurse_hours_per_day || 0, 
        shift: item.occupational_health_nurse_shift || '\u00A0' 
      },
    },
  };
};

export const createAnnualMedicalDocumentComponent = (item: any, companyName?: string, reportPeriodFrom?: string, reportPeriodTo?: string) => {
  // Prepare data for page one
  const pageOneData = pageOne(item, companyName, reportPeriodFrom, reportPeriodTo);
  
  // Use actual data from the API for page two (attendance, training, examinations, diseases)
  const pageTwoData = {
    attendanceSchedule: {
      firstShift: (Array.isArray(item.schedule_of_attendance_of_full_time_first_aider) && item.schedule_of_attendance_of_full_time_first_aider[0]?.includes('1st shift')) || (!Array.isArray(item.schedule_of_attendance_of_full_time_first_aider) && item.schedule_of_attendance_of_full_time_first_aider?.includes('1st shift')) ? 1 : 0,
      secondShift: (Array.isArray(item.schedule_of_attendance_of_full_time_first_aider) && item.schedule_of_attendance_of_full_time_first_aider[0]?.includes('2nd shift')) || (!Array.isArray(item.schedule_of_attendance_of_full_time_first_aider) && item.schedule_of_attendance_of_full_time_first_aider?.includes('2nd shift')) ? 1 : 0,
      thirdShift: (Array.isArray(item.schedule_of_attendance_of_full_time_first_aider) && item.schedule_of_attendance_of_full_time_first_aider[0]?.includes('3rd shift')) || (!Array.isArray(item.schedule_of_attendance_of_full_time_first_aider) && item.schedule_of_attendance_of_full_time_first_aider?.includes('3rd shift')) ? 1 : 0
    },
    occupationalHealthTraining: {
      physician: item.occupational_health_personnel_training?.includes('occupational health physician') || false,
      dentist: item.occupational_health_personnel_training?.includes('occupational health dentist') || false,
      nurse: item.occupational_health_personnel_training?.includes('occupational health nurse') || false,
      firstAider: item.occupational_health_personnel_training?.includes('first aider') || false,
      othersSpecify: item.occupational_health_personnel_training_other_specification || '\u00A0'
    },
    hasRegularAppraisal: item.sanitation_system_appraisal?.includes('yes') || false,
    physicalExam: {
      prePlacement: item.workers_pre_placement_physical_exam || 0,
      periodic: item.workers_periodic_physical_exam || 0,
      returnToWork: item.workers_return_to_work_physical_exam || 0,
      transfer: item.workers_transfer_physical_exam || 0,
      special: item.workers_special_physical_exam || 0,
      separation: item.workers_separation_physical_exam || 0
    },
    xRays: {
      prePlacement: item.workers_pre_placement_x_rays || 0,
      periodic: item.workers_periodic_x_rays || 0,
      returnToWork: item.workers_return_to_work_x_rays || 0,
      transfer: item.workers_transfer_x_rays || 0,
      special: item.workers_special_x_rays || 0,
      separation: item.workers_separation_x_rays || 0
    },
    urinalysis: {
      prePlacement: item.workers_pre_placement_urinalysis || 0,
      periodic: item.workers_periodic_urinalysis || 0,
      returnToWork: item.workers_return_to_work_urinalysis || 0,
      transfer: item.workers_transfer_urinalysis || 0,
      special: item.workers_special_urinalysis || 0,
      separation: item.workers_separation_urinalysis || 0
    },
    stoolExam: {
      prePlacement: item.total_workers_examination_stool_exam_pre_placement || 0,
      periodic: item.total_workers_examination_stool_exam_periodic || 0,
      returnToWork: item.total_workers_examination_stool_exam_return_to_work || 0,
      transfer: item.total_workers_examination_stool_exam_transfer || 0,
      special: item.total_workers_examination_stool_exam_special || 0,
      separation: item.total_workers_examination_stool_exam_separation || 0
    },
    bloodTest: {
      prePlacement: item.total_workers_examination_blood_test_pre_placement || 0,
      periodic: item.total_workers_examination_blood_test_periodic || 0,
      returnToWork: item.total_workers_examination_blood_test_return_to_work || 0,
      transfer: item.total_workers_examination_blood_test_transfer || 0,
      special: item.total_workers_examination_blood_test_special || 0,
      separation: item.total_workers_examination_blood_test_separation || 0
    },
    ecg: {
      prePlacement: item.total_workers_examination_ecg_pre_placement || 0,
      periodic: item.total_workers_examination_ecg_periodic || 0,
      returnToWork: item.total_workers_examination_ecg_return_to_work || 0,
      transfer: item.total_workers_examination_ecg_transfer || 0,
      special: item.total_workers_examination_ecg_special || 0,
      separation: item.total_workers_examination_ecg_separation || 0
    },
    others: {
      prePlacement: item.total_workers_examination_others_pre_placement || 0,
      periodic: item.total_workers_examination_others_periodic || 0,
      returnToWork: item.total_workers_examination_others_return_to_work || 0,
      transfer: item.total_workers_examination_others_transfer || 0,
      special: item.total_workers_examination_others_special || 0,
      separation: item.total_workers_examination_others_separation || 0
    },
    diseaseData: {
      skin: {
        allergy: { male: item.allergy_male || 0, female: item.allergy_female || 0 },
        dermatoses: { male: item.dermatoses_male || 0, female: item.dermatoses_female || 0 },
        infectionAsFolliculitisAbscessParonychia: { male: item.infection_as_folliculitis_abscess_paronychia_male || 0, female: item.infection_as_folliculitis_abscess_paronychia_female || 0 },
        abscessParoNychia: { male: item.infection_as_folliculitis_abscess_paronychia_male || 0, female: item.infection_as_folliculitis_abscess_paronychia_female || 0 },
        others: { male: item.others_skin_male || 0, female: item.others_skin_female || 0 }
      },
      head: {
        tensionHeadache: { male: item.tension_headache_male || 0, female: item.tension_headache_female || 0 },
        others: { male: item.others_head_male || 0, female: item.others_head_female || 0 }
      },
      eyes: {
        errorOfRefraction: { male: item.error_of_refraction_male || 0, female: item.error_of_refraction_female || 0 },
        bacterialViral: { male: item.bacterial_viral_conjunctivities_male || 0, female: item.bacterial_viral_conjunctivities_female || 0 },
        conjunctivitis: { male: item.bacterial_viral_conjunctivities_male || 0, female: item.bacterial_viral_conjunctivities_female || 0 },
        cataract: { male: item.cataract_male || 0, female: item.cataract_female || 0 },
        others: { male: item.others_eyes_male || 0, female: item.others_eyes_female || 0 }
      },
      mouthAndEnt: {
        gingivitis: { male: item.gingivitis_male || 0, female: item.gingivitis_female || 0 },
        herpesLabialesStomatitis: { male: item.herpes_labiales_nasalis_male || 0, female: item.herpes_labiales_nasalis_female || 0 },
        otitisMediaExterna: { male: item.otitis_media_externa_male || 0, female: item.otitis_media_externa_female || 0 },
        deafness: { male: item.deafness_male || 0, female: item.deafness_female || 0 },
        meniereSyndrome: { male: item.meniere_s_syndrome_vertigo_male || 0, female: item.meniere_s_syndrome_vertigo_female || 0 },
        rhinitisAllergic: { male: item.rhinitis_colds_male || 0, female: item.rhinitis_colds_female || 0 },
        nasalPolyps: { male: item.nasal_polyps_male || 0, female: item.nasal_polyps_female || 0 },
        sinusitis: { male: item.sinusitis_male || 0, female: item.sinusitis_female || 0 },
        tonsillopharyngitis: { male: item.tonsillapharyngitis_male || 0, female: item.tonsillapharyngitis_female || 0 }
      }
    }
  };

  const pageThreeData = {
    // Basic conditions
    laryngitis: { male: item.laryngitis_male || 0, female: item.laryngitis_female || 0 },
    others: { male: item.others_ent_male || 0, female: item.others_ent_female || 0 },
    
    // Respiratory conditions
    respiratory: {
        bronchitis: { male: item.bronchitis_male || 0, female: item.bronchitis_female || 0 },
        bronchialAsthma: { male: item.bronchial_asthma_male || 0, female: item.bronchial_asthma_female || 0 },
        pneumonia: { male: item.pneumonia_male || 0, female: item.pneumonia_female || 0 },
        tuberculosis: { male: item.tuberculosis_male || 0, female: item.tuberculosis_female || 0 },
        pneumoconiosis: { male: item.pneumoconiosis_male || 0, female: item.pneumoconiosis_female || 0 },
        others: { male: item.others_respiratory_male || 0, female: item.others_respiratory_female || 0 }
    },
    
    // Heart and Blood Vessel conditions
    heartAndBloodVessel: {
        hypertension: { male: item.hypertension_male || 0, female: item.hypertension_female || 0 },
        hypotension: { male: item.hypotension_male || 0, female: item.hypotension_female || 0 },
        anginaPectoris: { male: item.angina_pectoria_male || 0, female: item.angina_pectoria_female || 0 },
        myocardialInfarction: { male: item.myocardial_infarction_male || 0, female: item.myocardial_infarction_female || 0 },
        vascularDisturbances: { male: item.vascular_disturbance_male || 0, female: item.vascular_disturbance_female || 0 },
        others: { male: item.others_heart_male || 0, female: item.others_heart_female || 0 }
    },
    
    // Gastrointestinal conditions
    gastrointestinal: {
        gastroenteritisDiarrhea: { male: item.gastroenteritis_diarhea_male || 0, female: item.gastroenteritis_diarhea_female || 0 },
        amoebiasis: { male: item.amoebiasis_male || 0, female: item.amoebiasis_female || 0 },
        gastritisHyperacidity: { male: item.gastritis_hyperacidity_male || 0, female: item.gastritis_hyperacidity_female || 0 },
        appendicitis: { male: item.appendicitis_male || 0, female: item.appendicitis_female || 0 },
        cholecystitis: { male: item.infectious_hepatitis_male || 0, female: item.infectious_hepatitis_female || 0 },
        liverCirrhosis: { male: item.liver_cirrhosis_male || 0, female: item.liver_cirrhosis_female || 0 },
        hepaticAbscess: { male: item.hepatic_abscess_male || 0, female: item.hepatic_abscess_female || 0 },
        cancerHepaticGastric: { male: item.cancer_hepatic_gastric_male || 0, female: item.cancer_hepatic_gastric_female || 0 },
        ulcer: { male: item.ulcer_male || 0, female: item.ulcer_female || 0 },
        others: { male: item.others_gastrointestinal_male || 0, female: item.others_gastrointestinal_female || 0 }
    },
    
    // Genito Urinary conditions
    genitoUrinary: {
        urinaryTractInfection: { male: item.urinary_tract_infection_male || 0, female: item.urinary_tract_infection_female || 0 },
        stones: { male: item.stones_male || 0, female: item.stones_female || 0 },
        cancer: { male: item.cancer_male || 0, female: item.cancer_female || 0 },
        others: { male: item.others_genitourinary_male || 0, female: item.others_genitourinary_female || 0 }
    },
    
    // Reproductive conditions
    reproductive: {
        dysmenorrhea: { male: item.dysmenorrhea_male || 0, female: item.dysmenorrhea_female || 0 },
        infectionCervicitisVaginitis: { male: item.infection_cervicitis_vaginitis_male || 0, female: item.infection_cervicitis_vaginitis_female || 0 },
        abortionSpontaneousThreatened: { male: item.abortion_spontaneous_threatened_male || 0, female: item.abortion_spontaneous_threatened_female || 0 },
        hyperemesisGravidarium: { male: item.hyperemesis_gravidarum_male || 0, female: item.hyperemesis_gravidarum_female || 0 },
        uterineTumors: { male: item.uterine_tumors_male || 0, female: item.uterine_tumors_female || 0 },
        cervicalPolypCancer: { male: item.cervical_polyp_cancer_male || 0, female: item.cervical_polyp_cancer_female || 0 },
        ovarianCystTumors: { male: item.ovarian_cyst_tumors_male || 0, female: item.ovarian_cyst_tumors_female || 0 },
        sexuallyTransmittedDiseases: { male: item.sexually_transmitted_diseases_male || 0, female: item.sexually_transmitted_diseases_female || 0 },
        herniaInguinalFemoral: { male: item.hermia_inguinal_femoral_male || 0, female: item.hermia_inguinal_femoral_female || 0 },
        others: { male: item.others_reproductive_male || 0, female: item.others_reproductive_female || 0 }
    },
    
    // Neuromuscular/Skeletal/Joints conditions
    neuromuscular: {
        peripheralNeuritis: { male: item.peripheral_neuritis_male || 0, female: item.peripheral_neuritis_female || 0 },
        paralysis: { male: item.torticollis_male || 0, female: item.torticollis_female || 0 },
        arthritis: { male: item.arthritis_male || 0, female: item.arthritis_female || 0 },
        others: { male: item.others_skeletal_male || 0, female: item.others_skeletal_female || 0 }
    },
    
    // Lymphatics and Circulatory conditions
    lymphaticsAndCirculatory: {
        anemia: { male: item.anemia_male || 0, female: item.anemia_female || 0 },
        leukemia: { male: item.leukemia_male || 0, female: item.leukemia_female || 0 },
        cerebrovascularAccident: { male: item.cerebrovascular_accident_male || 0, female: item.cerebrovascular_accident_female || 0 }
    }
  };

  const pageFourData = {
    infectiousDiseases: {
      lymphadenitis: { male: item.lymphadenitis_male || 0, female: item.lymphadenitis_female || 0 },
      lymphoma: { male: item.lymphoma_male || 0, female: item.lymphoma_female || 0 },
      influenza: { male: item.influenza_male || 0, female: item.influenza_female || 0 },
      typhoidParatyphoid: { male: item.typhoid_fever_male || 0, female: item.typhoid_fever_female || 0 },
      cholera: { male: item.cholera_male || 0, female: item.cholera_female || 0 },
      measles: { male: item.measles_male || 0, female: item.measles_female || 0 },

      mumps: { male: 0, female: 0 }, // Not in data

      malaria: { male: item.malaria_male || 0, female: item.malaria_female || 0 },
      schistosomiasis: { male: item.schistosomiasis_male || 0, female: item.schistosomiasis_female || 0 },
      herpesZoster: { male: item.herpes_zoster_male || 0, female: item.herpes_zoster_female || 0 },
      chickenPox: { male: item.chicken_pox_male || 0, female: item.chicken_pox_female || 0 },
      germanMeasles: { male: item.german_measles_male || 0, female: item.german_measles_female || 0 },
      rabies: { male: item.rabies_male || 0, female: item.rabies_female || 0 },
      others: { male: item.others_infectious_male || 0, female: item.others_infectious_female || 0 }
    },
    physicalEnvironmentDiseases: {
      noiseVibration: {
        deafnessNoiseInduced: { male: item.deafness_noise_induced_male || 0, female: item.deafness_noise_induced_female || 0 },
        
        otosclerosis: { male: 0, female: 0 }, // Not in data
       
        musculoSkeletalDisturbances: { male: item.musculo_skeletal_disturbances_male || 0, female: item.musculo_skeletal_disturbances_female || 0 },
        fatigue: { male: item.fatigue_male || 0, female: item.fatigue_female || 0 }
      },
      temperatureHumidity: {
        heatStrokes: { male: item.heat_stroke_male || 0, female: item.heat_stroke_female || 0 },
        heatCramps: { male: item.heat_cramps_male || 0, female: item.heat_cramps_female || 0 },
        dehydration: { male: item.dehydration_male || 0, female: item.dehydration_female || 0 },
        heatExhaustion: { male: item.heat_exhaustion_male || 0, female: item.heat_exhaustion_female || 0 },
        others: { male: item.others_heat_male || 0, female: item.others_heat_female || 0 },

        coldTemperature: {
          chilblain: { male: 0, female: 0 }, // Not in data
          frostBite: { male: 0, female: 0 }, // Not in data
          immersionFoot: { male: 0, female: 0 }, // Not in data
          generalHypothermia: { male: 0, female: 0 }, // Not in data
          others: { male: 0, female: 0 } // Not in data
        }
      },
      pressureAbnormalities: {
        decompressionSickness: {
          airEmbolism: { male: item.air_embolism_male || 0, female: item.air_embolism_female || 0 },
          caissonsDisease: { male: item.bends_disease_male || 0, female: item.bends_disease_female || 0 }
        },
        barotrauma: { male: item.barotrauma_male || 0, female: item.barotrauma_female || 0 },
        hypoxia: { male: item.hypoxia_male || 0, female: item.hypoxia_female || 0 },
        altitudeSickness: { male: item.altitude_sickness_male || 0, female: item.altitude_sickness_female || 0 }
      },
      radiation: {
        cataracts: { male: item.cataract_radiation_male || 0, female: item.cataract_radiation_female || 0 },
        keratitis: { male: item.keratitis_male || 0, female: item.keratitis_female || 0 },
        burns: { male: item.burns_male || 0, female: item.burns_female || 0 },
        radiationRelatedCancers: { male: item.radiation_related_cancers_male || 0, female: item.radiation_related_cancers_female || 0 }
      }
    },
    occupationalAccidents: {
      contusionBruises: { male: item.contusion_bruises_hematoma_male || 0, female: item.contusion_bruises_hematoma_female || 0 },
      abrasions: { male: item.abrasions_male || 0, female: item.abrasions_female || 0 },
      cuts: { male: item.cuts_lacerations_punctures_male || 0, female: item.cuts_lacerations_punctures_female || 0 },
      
      concussion: { male: 0, female: 0 }, // Not in data
      
      avulsion: { male: item.avulsion_male || 0, female: item.avulsion_female || 0 }
    }
  };

  const pageFiveData = {
    additionalInjuries: {
      amputation: { male: item.amputation_loss_body_part_male || 0, female: item.amputation_loss_body_part_female || 0 },
      crushingInjuries: { male: item.crushing_injury_male || 0, female: item.crushing_injury_female || 0 },
      spinalInjuries: { male: item.spinal_injury_male || 0, female: item.spinal_injury_female || 0 },
      cranialInjuries: { male: item.cranial_injury_male || 0, female: item.cranial_injury_female || 0 },
      sprains: { male: item.sprain_male || 0, female: item.sprain_female || 0 },
      dislocationFractures: { male: item.dislocation_fracture_male || 0, female: item.dislocation_fracture_female || 0 },
      burns: { male: item.burns_injury_male || 0, female: item.burns_injury_female || 0 }
    },
    immunizationProgram: {
      tetanusToxoid: { male: item.tetanus_toxoid_injection_male || 0, female: item.tetanus_toxoid_injection_female || 0 },
      tetanusAntitoxin: { male: item.tetanus_antitoxin_injection_male || 0, female: item.tetanus_antitoxin_injection_female || 0 },
      tetanusGlobulin: { male: item.tetanus_globulin_injection_male || 0, female: item.tetanus_globulin_injection_female || 0 },
      hepatitisB: { male: item.hepatitis_b_vaccination_male || 0, female: item.hepatitis_b_vaccination_female || 0 },
      rabiesVaccine: { male: item.rabies_vaccination_male || 0, female: item.rabies_vaccination_female || 0 },
      
      covid19Vaccine: { male: 0, female: 0 }, // Not in data
      
      others: { male: item.others_immunization_male || 0, female: item.others_immunization_female || 0 }
    },
    medicalRecordsKeeping: {
      done: item.keeping_of_medical_records_of_workers?.includes('done') || false,
      notDone: !item.keeping_of_medical_records_of_workers?.includes('done') || false
    },
    healthEducation: {
      individual: item.health_education_and_counselling_by_health_and_safety_personnel?.includes('done_individually') || false,
      groupDiscussions: item.health_education_and_counselling_by_health_and_safety_personnel?.includes('done ') || false,
      visualDisplays: item.health_education_and_counselling_by_health_and_safety_personnel?.includes('done_visual_displays') || false
    },
    otherHealthPrograms: {
      nutrition: { 
        seminar: item.nutrition_program?.includes('seminars') || false, 
        visualAids: item.nutrition_program?.includes('visual_aids') || false, 
        counselling: item.nutrition_program?.includes('counselling') || false 
      },
      maternalChildCare: { 
        seminar: item.maternal_and_child_care_program?.includes('seminars') || false, 
        visualAids: item.maternal_and_child_care_program?.includes('visual_aids') || false, 
        counselling: item.maternal_and_child_care_program?.includes('counselling') || false 
      },
      familyPlanning: { 
        seminar: item.family_planning_program?.includes('seminars') || false, 
        visualAids: item.family_planning_program?.includes('visual_aids') || false, 
        counselling: item.family_planning_program?.includes('counselling') || false 
      },
      mentalHealth: { 
        seminar: item.mental_health_program?.includes('seminars') || false, 
        visualAids: item.mental_health_program?.includes('visual_aids') || false, 
        counselling: item.mental_health_program?.includes('counselling') || false 
      },
      personalHealthMaintenance: { 
        seminar: item.personal_health_maintenance?.includes('seminars') || false, 
        visualAids: item.personal_health_maintenance?.includes('visual_aids') || false, 
        counselling: item.personal_health_maintenance?.includes('counselling') || false 
      }
    },
    physicalFitnessProgram: {
      sportsActivities: { yes: item.sports_activities?.includes('yes') || false, no: item.sports_activities?.includes('no') || false },
      others: item.physical_fitness_program_others || '\u00A0'
    },
    chemicalHazards: {
      dust: { substance: item.dust_sources || '\u00A0', workers: item.dust_workers_exposed || 0 },
      liquids: { substance: item.liquids_sources || '\u00A0', workers: item.liquids_workers_exposed || 0 },
      mistFumes: { substance: item.mist_fumes_vapors_sources || '\u00A0', workers: item.mist_fumes_vapors_workers_exposed || 0 },
      gas: { substance: item.gas_sources || '\u00A0', workers: item.gas_workers_exposed || 0 },
      others: { substance: item.others_chemical_hazards_sources || '\u00A0', workers: item.others_chemical_hazards_workers_exposed || 0 }
    },
    physicalHazards: {
      noise: { substance: item.noise_sources || '\u00A0', workers: item.noise_workers_exposed || 0 },
      temperatureHumidity: { substance: item.temperature_humidity_sources || '\u00A0', workers: item.temperature_humidity_workers_exposed || 0 },
      pressure: { substance: item.pressure_sources || '\u00A0', workers: item.pressure_workers_exposed || 0 },
      illumination: { substance: item.illumination_sources || '\u00A0', workers: item.illumination_workers_exposed || 0 },
      radiationUltraviolet: { substance: item.radiation_ultraviolet_microwave_sources || '\u00A0', workers: item.radiation_ultraviolet_microwave_workers_exposed || 0 },
      vibration: { substance: item.vibration_sources || '\u00A0', workers: item.vibration_workers_exposed || 0 }
    }
  };

  const pageSixData = {
    physicalHazardsOthers: {
      substance: item.others_physical_hazards_sources || '\u00A0',
      workers: item.others_physical_hazards_workers_exposed || 0
    },
    biologicalHazards: {
      viral: { substance: item.viral_sources || '\u00A0', workers: item.viral_workers_exposed || 0 },
      bacterial: { substance: item.bacterial_sources || '\u00A0', workers: item.bacterial_workers_exposed || 0 },
      fungal: { substance: item.fungal_sources || '\u00A0', workers: item.fungal_workers_exposed || 0 },
      parasitic: { substance: item.parasitic_sources || '\u00A0', workers: item.parasitic_workers_exposed || 0 },
      others: { substance: item.others_biological_hazards_sources || '\u00A0', workers: item.others_biological_hazards_workers_exposed || 0 }
    },
    ergonomicStress: {
      exhaustingPhysicalWork: { substance: item.exhausting_physical_work_sources || '\u00A0', workers: item.exhausting_physical_work_workers_exposed || 0 },
      prolongedStanding: { substance: item.prolonged_standing_sources || '\u00A0', workers: item.prolonged_standing_workers_exposed || 0 },
      excessiveMentalEffort: { substance: item.excessive_mental_effort_sources || '\u00A0', workers: item.excessive_mental_effort_workers_exposed || 0 },
      unfavorableWorkPosture: { substance: item.unfavorable_work_posture_sources || '\u00A0', workers: item.unfavorable_work_posture_workers_exposed || 0 },
      staticMonotonousWork: { substance: item.static_monotonous_work_sources || '\u00A0', workers: item.static_monotonous_work_workers_exposed || 0 },
      othersSpecify: { substance: item.others_ergonomic_stress_sources || '\u00A0', workers: item.others_ergonomic_stress_workers_exposed || 0 }
    },
    submittedBy: {
      name: item.prepared_by || '\u00A0',
      signature: item.signature || '\u00A0',
      date: item.date_of_report || '\u00A0'
    },
    notedBy: {
      employer: item.noted_by || '\u00A0',
      signature: item.noted_signature || '\u00A0',
      date: item.date_of_report || '\u00A0'
    }
  };

  return (
    <div className="bg-white">
      <style jsx>{`
        .page-break {
          page-break-after: always;
          break-after: page;
        }
      `}</style>
      <DocumentPageOne data={pageOneData} />
      <div className="page-break" style={{ pageBreakAfter: 'always' }}></div>
      <DocumentPageTwo {...pageTwoData} />
      <div className="page-break" style={{ pageBreakAfter: 'always' }}></div>
      <DocumentPageThree data={pageThreeData} />
      <div className="page-break" style={{ pageBreakAfter: 'always' }}></div>
      <DocumentPageFour {...pageFourData} />
      <div className="page-break" style={{ pageBreakAfter: 'always' }}></div>
      <DocumentPageFive {...pageFiveData} />
      <div className="page-break" style={{ pageBreakAfter: 'always' }}></div>
      <DocumentPageSix {...pageSixData} />
    </div>
  );
};

export const generateAnnualMedicalFilename = (item: any) => {
  return `annual-medical-report-${item.id}-${new Date().toISOString().split('T')[0]}.pdf`;
};

export const handlePrintPDF = async (item: any, generatePDFLocally: (component: React.ReactElement, filename: string) => Promise<void>, companyName?: string, reportPeriodFrom?: string, reportPeriodTo?: string) => {
  // Create document component with all pages
  const documentComponent = createAnnualMedicalDocumentComponent(item, companyName, reportPeriodFrom, reportPeriodTo);
  
  const filename = generateAnnualMedicalFilename(item);
  
  // Generate PDF locally (opens print dialog)
  await generatePDFLocally(documentComponent, filename);
};

export type { AnnualMedicalReportData };
