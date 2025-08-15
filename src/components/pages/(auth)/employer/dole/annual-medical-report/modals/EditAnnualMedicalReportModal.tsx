import { Dispatch, Fragment, useRef, useEffect, useState } from "react";

import { Dialog, Transition } from "@headlessui/react";
import toast from "react-hot-toast";

import classNames from "@/helpers/classNames";
import GeneralInfo from "./tabs/GeneralInfo";
import PreventiveAndEmergency from "./tabs/PreventiveAndEmergency";
import EmergencyOccupational from "./tabs/EmergencyOccupational";
import OccupationalHealthService from "./tabs/OccupationalHealthService";
import ReportOfDisease from "./tabs/ReportOfDisease";
import WorkplaceSafetyCompliance from "./tabs/WorkplaceSafetyCompliance";
import WorkplaceHazards from "./tabs/WorkplaceHazards";
import WorkplaceWelfare from "./tabs/WorkplaceWelfare";

import { XCircleIcon } from "@heroicons/react/24/solid";
import CustomToast from "@/components/CustomToast";
import useGetAnnualMedicalReportDetails from "../hooks/useGetAnnualMedicalReportDetails";
import useUpdateAnnualMedicalReport from "../hooks/useUpdateAnnualMedicalReport";

type T_ModalData = {
    id: number;
  open: boolean;
};

function EditAnnualMedicalReportModal({
  refetch,
  isOpen,
  setIsOpen,
  formMethods,
}: {
  refetch: any;
  isOpen: T_ModalData;
  setIsOpen: Dispatch<T_ModalData | null>;
  formMethods: any;
}) {
  const cancelButtonRef = useRef(null);
  const {
    data: annualMedicalReportData,
    refetch: refetchAnnualMedicalReport,
    remove: removeAnnualMedicalReport,
  } = useGetAnnualMedicalReportDetails(isOpen.id);
  const { register, handleSubmit, reset, control, setValue, getValues, watch, formState: { errors }, setError, clearErrors } = formMethods;
  const {
    mutate: updateAnnualMedicalReport,
    isLoading: isLoadingUpdateAnnualMedicalReport,
  } = useUpdateAnnualMedicalReport();
  const [selectedTab, setSelectedTab] = useState(1);

  const customCloseModal = () => {
    reset();
    removeAnnualMedicalReport();
    setIsOpen(null);
  };

  useEffect(() => {
    if (isOpen) {
      refetchAnnualMedicalReport();
    }
  }, [isOpen]);

  useEffect(() => {
    if (annualMedicalReportData) {
      // Helper to always return an array of strings
      const parseArrayField = (field: any) => {
        if (Array.isArray(field) && field.length === 1 && typeof field[0] === "string" && field[0].includes(",")) {
          return field[0].split(",").map((s: string) => s.trim());
        }
        return field;
      };

      // General Information
      setValue("name_of_establishment", annualMedicalReportData.name_of_establishment);
      setValue("name_of_owner_manager", annualMedicalReportData.name_of_owner_manager);
      setValue("address", annualMedicalReportData.address);
      setValue("type_of_industry", annualMedicalReportData.type_of_industry);
      setValue("total_number_of_employees", annualMedicalReportData.total_number_of_employees);
      setValue("number_of_shifts", annualMedicalReportData.number_of_shifts);
      setValue("male_office_workers", annualMedicalReportData.male_office_workers);
      setValue("male_shop_workers_shift_1", annualMedicalReportData.male_shop_workers_shift_1);
      setValue("male_shop_workers_shift_2", annualMedicalReportData.male_shop_workers_shift_2);
      setValue("male_shop_workers_shift_3", annualMedicalReportData.male_shop_workers_shift_3);
      setValue("female_office_workers", annualMedicalReportData.female_office_workers);
      setValue("female_shop_workers_shift_1", annualMedicalReportData.female_shop_workers_shift_1);
      setValue("female_shop_workers_shift_2", annualMedicalReportData.female_shop_workers_shift_2);
      setValue("female_shop_workers_shift_3", annualMedicalReportData.female_shop_workers_shift_3);
      setValue("total_office_workers", annualMedicalReportData.total_office_workers);
      setValue("total_shop_workers_shift_1", annualMedicalReportData.total_shop_workers_shift_1);
      setValue("total_shop_workers_shift_2", annualMedicalReportData.total_shop_workers_shift_2);
      setValue("total_shop_workers_shift_3", annualMedicalReportData.total_shop_workers_shift_3);

      // Preventive and Emergency
      setValue("occupational_health_services_by", parseArrayField(annualMedicalReportData.occupational_health_services_by));
      setValue("occupational_health_services_by_other_specification", annualMedicalReportData.occupational_health_services_by_other_specification);
      setValue("occupational_health_services_as_a_service", parseArrayField(annualMedicalReportData.occupational_health_services_as_a_service));
      setValue("employer_engages_the_services_of", parseArrayField(annualMedicalReportData.employer_engages_the_services_of));
      setValue("conduct_inspection_of_workplace", parseArrayField(annualMedicalReportData.conduct_inspection_of_workplace));
      setValue("conduct_inspection_of_workplace_other_specification", annualMedicalReportData.conduct_inspection_of_workplace_other_specification);

      // Emergency Occupational
      // Handle radio button input (needs to be a single string, not an array)
      setValue("provided_treatment_room_medical_clinic", Array.isArray(annualMedicalReportData.provided_treatment_room_medical_clinic) 
        ? annualMedicalReportData.provided_treatment_room_medical_clinic[0] 
        : annualMedicalReportData.provided_treatment_room_medical_clinic?.split(',')[0] || "");
      setValue("provided_treatment_room_medical_clinic_other_specification", annualMedicalReportData.provided_treatment_room_medical_clinic_other_specification);
      setValue("occupational_health_physician_hours_per_day", annualMedicalReportData.occupational_health_physician_hours_per_day);
      setValue("occupational_health_physician_shift", annualMedicalReportData.occupational_health_physician_shift);
      setValue("occupational_health_dentist_hours_per_day", annualMedicalReportData.occupational_health_dentist_hours_per_day);
      setValue("occupational_health_dentist_shift", annualMedicalReportData.occupational_health_dentist_shift);
      setValue("occupational_health_practitioner_hours_per_day", annualMedicalReportData.occupational_health_practitioner_hours_per_day);
      setValue("occupational_health_practitioner_shift", annualMedicalReportData.occupational_health_practitioner_shift);
      setValue("occupational_health_nurse_hours_per_day", annualMedicalReportData.occupational_health_nurse_hours_per_day);
      setValue("occupational_health_nurse_shift", annualMedicalReportData.occupational_health_nurse_shift);
      setValue("schedule_of_attendance_of_full_time_first_aider", parseArrayField(annualMedicalReportData.schedule_of_attendance_of_full_time_first_aider));
      setValue("occupational_health_personnel_training", parseArrayField(annualMedicalReportData.occupational_health_personnel_training));
      setValue("occupational_health_personnel_training_other_specification", annualMedicalReportData.occupational_health_personnel_training_other_specification);

      // Occupational Health Services
      // Handle radio button input (needs to be a single string, not an array)
      setValue("sanitation_system_appraisal", Array.isArray(annualMedicalReportData.sanitation_system_appraisal) 
        ? annualMedicalReportData.sanitation_system_appraisal[0] 
        : annualMedicalReportData.sanitation_system_appraisal?.split(',')[0] || "");
      setValue("workers_pre_placement_physical_exam", annualMedicalReportData.workers_pre_placement_physical_exam);
      setValue("workers_pre_placement_x_rays", annualMedicalReportData.workers_pre_placement_x_rays);
      setValue("workers_pre_placement_urinalysis", annualMedicalReportData.workers_pre_placement_urinalysis);
      setValue("workers_periodic_physical_exam", annualMedicalReportData.workers_periodic_physical_exam);
      setValue("workers_periodic_x_rays", annualMedicalReportData.workers_periodic_x_rays);
      setValue("workers_periodic_urinalysis", annualMedicalReportData.workers_periodic_urinalysis);
      setValue("workers_return_to_work_physical_exam", annualMedicalReportData.workers_return_to_work_physical_exam);
      setValue("workers_return_to_work_x_rays", annualMedicalReportData.workers_return_to_work_x_rays);
      setValue("workers_return_to_work_urinalysis", annualMedicalReportData.workers_return_to_work_urinalysis);
      setValue("workers_transfer_physical_exam", annualMedicalReportData.workers_transfer_physical_exam);
      setValue("workers_transfer_x_rays", annualMedicalReportData.workers_transfer_x_rays);
      setValue("workers_transfer_urinalysis", annualMedicalReportData.workers_transfer_urinalysis);
      setValue("workers_special_physical_exam", annualMedicalReportData.workers_special_physical_exam);
      setValue("workers_special_x_rays", annualMedicalReportData.workers_special_x_rays);
      setValue("workers_special_urinalysis", annualMedicalReportData.workers_special_urinalysis);
      setValue("workers_separation_physical_exam", annualMedicalReportData.workers_separation_physical_exam);
      setValue("workers_separation_x_rays", annualMedicalReportData.workers_separation_x_rays);
      setValue("workers_separation_urinalysis", annualMedicalReportData.workers_separation_urinalysis);
      setValue("total_workers_examination_stool_exam_pre_placement", annualMedicalReportData.total_workers_examination_stool_exam_pre_placement);
      setValue("total_workers_examination_blood_test_pre_placement", annualMedicalReportData.total_workers_examination_blood_test_pre_placement);
      setValue("total_workers_examination_ecg_pre_placement", annualMedicalReportData.total_workers_examination_ecg_pre_placement);
      setValue("total_workers_examination_others_pre_placement", annualMedicalReportData.total_workers_examination_others_pre_placement);
      setValue("total_workers_examination_stool_exam_periodic", annualMedicalReportData.total_workers_examination_stool_exam_periodic);
      setValue("total_workers_examination_blood_test_periodic", annualMedicalReportData.total_workers_examination_blood_test_periodic);
      setValue("total_workers_examination_ecg_periodic", annualMedicalReportData.total_workers_examination_ecg_periodic);
      setValue("total_workers_examination_others_periodic", annualMedicalReportData.total_workers_examination_others_periodic);
      setValue("total_workers_examination_stool_exam_return_to_work", annualMedicalReportData.total_workers_examination_stool_exam_return_to_work);
      setValue("total_workers_examination_blood_test_return_to_work", annualMedicalReportData.total_workers_examination_blood_test_return_to_work);
      setValue("total_workers_examination_ecg_return_to_work", annualMedicalReportData.total_workers_examination_ecg_return_to_work);
      setValue("total_workers_examination_others_return_to_work", annualMedicalReportData.total_workers_examination_others_return_to_work);
      setValue("total_workers_examination_stool_exam_transfer", annualMedicalReportData.total_workers_examination_stool_exam_transfer);
      setValue("total_workers_examination_blood_test_transfer", annualMedicalReportData.total_workers_examination_blood_test_transfer);
      setValue("total_workers_examination_ecg_transfer", annualMedicalReportData.total_workers_examination_ecg_transfer);
      setValue("total_workers_examination_others_transfer", annualMedicalReportData.total_workers_examination_others_transfer);
      setValue("total_workers_examination_stool_exam_special", annualMedicalReportData.total_workers_examination_stool_exam_special);
      setValue("total_workers_examination_blood_test_special", annualMedicalReportData.total_workers_examination_blood_test_special);
      setValue("total_workers_examination_ecg_special", annualMedicalReportData.total_workers_examination_ecg_special);
      setValue("total_workers_examination_others_special", annualMedicalReportData.total_workers_examination_others_special);
      setValue("total_workers_examination_stool_exam_separation", annualMedicalReportData.total_workers_examination_stool_exam_separation);
      setValue("total_workers_examination_blood_test_separation", annualMedicalReportData.total_workers_examination_blood_test_separation);
      setValue("total_workers_examination_ecg_separation", annualMedicalReportData.total_workers_examination_ecg_separation);
      setValue("total_workers_examination_others_separation", annualMedicalReportData.total_workers_examination_others_separation);
      
      // Report of Disease
        //Skin
        setValue("allergy_male", annualMedicalReportData.allergy_male);
        setValue("allergy_female", annualMedicalReportData.allergy_female);
        setValue("allergy_total", annualMedicalReportData.allergy_total);
        setValue("dermatoses_male", annualMedicalReportData.dermatoses_male);
        setValue("dermatoses_female", annualMedicalReportData.dermatoses_female);
        setValue("dermatoses_total", annualMedicalReportData.dermatoses_total);
        setValue("infection_as_folliculitis_abscess_paronychia_male", annualMedicalReportData.infection_as_folliculitis_abscess_paronychia_male);
        setValue("infection_as_folliculitis_abscess_paronychia_female", annualMedicalReportData.infection_as_folliculitis_abscess_paronychia_female);
        setValue("infection_as_folliculitis_abscess_paronychia_total", annualMedicalReportData.infection_as_folliculitis_abscess_paronychia_total);
        setValue("others_skin_male", annualMedicalReportData.others_skin_male);
        setValue("others_skin_female", annualMedicalReportData.others_skin_female);
        setValue("others_skin_total", annualMedicalReportData.others_skin_total);

        // Head
        setValue("tension_headache_male", annualMedicalReportData.tension_headache_male);
        setValue("tension_headache_female", annualMedicalReportData.tension_headache_female);
        setValue("tension_headache_total", annualMedicalReportData.tension_headache_total);
        setValue("others_head_male", annualMedicalReportData.others_head_male);
        setValue("others_head_female", annualMedicalReportData.others_head_female);
        setValue("others_head_total", annualMedicalReportData.others_head_total);

        // Eyes
        setValue("cataract_male", annualMedicalReportData.cataract_male);
        setValue("cataract_female", annualMedicalReportData.cataract_female);
        setValue("cataract_total", annualMedicalReportData.cataract_total);
        setValue("error_of_refraction_male", annualMedicalReportData.error_of_refraction_male);
        setValue("error_of_refraction_female", annualMedicalReportData.error_of_refraction_female);
        setValue("error_of_refraction_total", annualMedicalReportData.error_of_refraction_total);
        setValue("bacterial_viral_conjunctivities_male", annualMedicalReportData.bacterial_viral_conjunctivities_male);
        setValue("bacterial_viral_conjunctivities_female", annualMedicalReportData.bacterial_viral_conjunctivities_female);
        setValue("bacterial_viral_conjunctivities_total", annualMedicalReportData.bacterial_viral_conjunctivities_total);
        setValue("others_eyes_male", annualMedicalReportData.others_eyes_male);
        setValue("others_eyes_female", annualMedicalReportData.others_eyes_female);
        setValue("others_eyes_total", annualMedicalReportData.others_eyes_total);

        // Mouth & ENT
        setValue("gingivitis_male", annualMedicalReportData.gingivitis_male);
        setValue("gingivitis_female", annualMedicalReportData.gingivitis_female);
        setValue("gingivitis_total", annualMedicalReportData.gingivitis_total);
        setValue("herpes_labiales_nasalis_male", annualMedicalReportData.herpes_labiales_nasalis_male);
        setValue("herpes_labiales_nasalis_female", annualMedicalReportData.herpes_labiales_nasalis_female);
        setValue("herpes_labiales_nasalis_total", annualMedicalReportData.herpes_labiales_nasalis_total);
        setValue("otitis_media_externa_male", annualMedicalReportData.otitis_media_externa_male);
        setValue("otitis_media_externa_female", annualMedicalReportData.otitis_media_externa_female);
        setValue("otitis_media_externa_total", annualMedicalReportData.otitis_media_externa_total);
        setValue("deafness_male", annualMedicalReportData.deafness_male);
        setValue("deafness_female", annualMedicalReportData.deafness_female);
        setValue("deafness_total", annualMedicalReportData.deafness_total);
        setValue("meniere_s_syndrome_vertigo_male", annualMedicalReportData.meniere_s_syndrome_vertigo_male);
        setValue("meniere_s_syndrome_vertigo_female", annualMedicalReportData.meniere_s_syndrome_vertigo_female);
        setValue("meniere_s_syndrome_vertigo_total", annualMedicalReportData.meniere_s_syndrome_vertigo_total);
        setValue("rhinitis_colds_male", annualMedicalReportData.rhinitis_colds_male);
        setValue("rhinitis_colds_female", annualMedicalReportData.rhinitis_colds_female);
        setValue("rhinitis_colds_total", annualMedicalReportData.rhinitis_colds_total);
        setValue("nasal_polyps_male", annualMedicalReportData.nasal_polyps_male);
        setValue("nasal_polyps_female", annualMedicalReportData.nasal_polyps_female);
        setValue("nasal_polyps_total", annualMedicalReportData.nasal_polyps_total);
        setValue("sinusitis_male", annualMedicalReportData.sinusitis_male);
        setValue("sinusitis_female", annualMedicalReportData.sinusitis_female);
        setValue("sinusitis_total", annualMedicalReportData.sinusitis_total);
        setValue("tonsillapharyngitis_male", annualMedicalReportData.tonsillapharyngitis_male);
        setValue("tonsillapharyngitis_female", annualMedicalReportData.tonsillapharyngitis_female);
        setValue("tonsillapharyngitis_total", annualMedicalReportData.tonsillapharyngitis_total);
        setValue("laryngitis_male", annualMedicalReportData.laryngitis_male);
        setValue("laryngitis_female", annualMedicalReportData.laryngitis_female);
        setValue("laryngitis_total", annualMedicalReportData.laryngitis_total);
        setValue("others_ent_male", annualMedicalReportData.others_ent_male);
        setValue("others_ent_female", annualMedicalReportData.others_ent_female);
        setValue("others_ent_total", annualMedicalReportData.others_ent_total);

        // Respiratory
        setValue("bronchitis_male", annualMedicalReportData.bronchitis_male);
        setValue("bronchitis_female", annualMedicalReportData.bronchitis_female);
        setValue("bronchitis_total", annualMedicalReportData.bronchitis_total);
        setValue("bronchial_asthma_male", annualMedicalReportData.bronchial_asthma_male);
        setValue("bronchial_asthma_female", annualMedicalReportData.bronchial_asthma_female);
        setValue("bronchial_asthma_total", annualMedicalReportData.bronchial_asthma_total);
        setValue("pneumonia_male", annualMedicalReportData.pneumonia_male);
        setValue("pneumonia_female", annualMedicalReportData.pneumonia_female);
        setValue("pneumonia_total", annualMedicalReportData.pneumonia_total);
        setValue("tuberculosis_male", annualMedicalReportData.tuberculosis_male);
        setValue("tuberculosis_female", annualMedicalReportData.tuberculosis_female);
        setValue("tuberculosis_total", annualMedicalReportData.tuberculosis_total);
        setValue("pneumoconiosis_male", annualMedicalReportData.pneumoconiosis_male);
        setValue("pneumoconiosis_female", annualMedicalReportData.pneumoconiosis_female);
        setValue("pneumoconiosis_total", annualMedicalReportData.pneumoconiosis_total);
        setValue("others_respiratory_male", annualMedicalReportData.others_respiratory_male);
        setValue("others_respiratory_female", annualMedicalReportData.others_respiratory_female);
        setValue("others_respiratory_total", annualMedicalReportData.others_respiratory_total);

        // Heart
        setValue("hypertension_male", annualMedicalReportData.hypertension_male);
        setValue("hypertension_female", annualMedicalReportData.hypertension_female);
        setValue("hypertension_total", annualMedicalReportData.hypertension_total);
        setValue("hypotension_male", annualMedicalReportData.hypotension_male);
        setValue("hypotension_female", annualMedicalReportData.hypotension_female);
        setValue("hypotension_total", annualMedicalReportData.hypotension_total);
        setValue("angina_pectoria_male", annualMedicalReportData.angina_pectoria_male);
        setValue("angina_pectoria_female", annualMedicalReportData.angina_pectoria_female);
        setValue("angina_pectoria_total", annualMedicalReportData.angina_pectoria_total);
        setValue("myocardial_infarction_male", annualMedicalReportData.myocardial_infarction_male);
        setValue("myocardial_infarction_female", annualMedicalReportData.myocardial_infarction_female);
        setValue("myocardial_infarction_total", annualMedicalReportData.myocardial_infarction_total);
        setValue("vascular_disturbance_male", annualMedicalReportData.vascular_disturbance_male);
        setValue("vascular_disturbance_female", annualMedicalReportData.vascular_disturbance_female);
        setValue("vascular_disturbance_total", annualMedicalReportData.vascular_disturbance_total);
        setValue("others_heart_male", annualMedicalReportData.others_heart_male);
        setValue("others_heart_female", annualMedicalReportData.others_heart_female);
        setValue("others_heart_total", annualMedicalReportData.others_heart_total);

        // Gastrointestinal
        setValue("gastroenteritis_diarhea_male", annualMedicalReportData.gastroenteritis_diarhea_male);
        setValue("gastroenteritis_diarhea_female", annualMedicalReportData.gastroenteritis_diarhea_female);
        setValue("gastroenteritis_diarhea_total", annualMedicalReportData.gastroenteritis_diarhea_total);
        setValue("amoebiasis_male", annualMedicalReportData.amoebiasis_male);
        setValue("amoebiasis_female", annualMedicalReportData.amoebiasis_female);
        setValue("amoebiasis_total", annualMedicalReportData.amoebiasis_total);
        setValue("gastritis_hyperacidity_male", annualMedicalReportData.gastritis_hyperacidity_male);
        setValue("gastritis_hyperacidity_female", annualMedicalReportData.gastritis_hyperacidity_female);
        setValue("gastritis_hyperacidity_total", annualMedicalReportData.gastritis_hyperacidity_total);
        setValue("appendicitis_male", annualMedicalReportData.appendicitis_male);
        setValue("appendicitis_female", annualMedicalReportData.appendicitis_female);
        setValue("appendicitis_total", annualMedicalReportData.appendicitis_total);
        setValue("infectious_hepatitis_male", annualMedicalReportData.infectious_hepatitis_male);
        setValue("infectious_hepatitis_female", annualMedicalReportData.infectious_hepatitis_female);
        setValue("infectious_hepatitis_total", annualMedicalReportData.infectious_hepatitis_total);
        setValue("liver_cirrhosis_male", annualMedicalReportData.liver_cirrhosis_male);
        setValue("liver_cirrhosis_female", annualMedicalReportData.liver_cirrhosis_female);
        setValue("liver_cirrhosis_total", annualMedicalReportData.liver_cirrhosis_total);
        setValue("hepatic_abscess_male", annualMedicalReportData.hepatic_abscess_male);
        setValue("hepatic_abscess_female", annualMedicalReportData.hepatic_abscess_female);
        setValue("hepatic_abscess_total", annualMedicalReportData.hepatic_abscess_total);
        setValue("cancer_hepatic_gastric_male", annualMedicalReportData.cancer_hepatic_gastric_male);
        setValue("cancer_hepatic_gastric_female", annualMedicalReportData.cancer_hepatic_gastric_female);
        setValue("cancer_hepatic_gastric_total", annualMedicalReportData.cancer_hepatic_gastric_total);
        setValue("ulcer_male", annualMedicalReportData.ulcer_male);
        setValue("ulcer_female", annualMedicalReportData.ulcer_female);
        setValue("ulcer_total", annualMedicalReportData.ulcer_total);
        setValue("others_gastrointestinal_male", annualMedicalReportData.others_gastrointestinal_male);
        setValue("others_gastrointestinal_female", annualMedicalReportData.others_gastrointestinal_female);
        setValue("others_gastrointestinal_total", annualMedicalReportData.others_gastrointestinal_total);

        // Genito Urinary
        setValue("urinary_tract_infection_male", annualMedicalReportData.urinary_tract_infection_male);
        setValue("urinary_tract_infection_female", annualMedicalReportData.urinary_tract_infection_female);
        setValue("urinary_tract_infection_total", annualMedicalReportData.urinary_tract_infection_total);
        setValue("stones_male", annualMedicalReportData.stones_male);
        setValue("stones_female", annualMedicalReportData.stones_female);
        setValue("stones_total", annualMedicalReportData.stones_total);
        setValue("cancer_male", annualMedicalReportData.cancer_male);
        setValue("cancer_female", annualMedicalReportData.cancer_female);
        setValue("cancer_total", annualMedicalReportData.cancer_total);
        setValue("others_genitourinary_male", annualMedicalReportData.others_genitourinary_male);
        setValue("others_genitourinary_female", annualMedicalReportData.others_genitourinary_female);
        setValue("others_genitourinary_total", annualMedicalReportData.others_genitourinary_total);

        // Reproductive
        setValue("dysmenorrhea_male", annualMedicalReportData.dysmenorrhea_male);
        setValue("dysmenorrhea_female", annualMedicalReportData.dysmenorrhea_female);
        setValue("dysmenorrhea_total", annualMedicalReportData.dysmenorrhea_total);
        setValue("infection_cervicitis_vaginitis_male", annualMedicalReportData.infection_cervicitis_vaginitis_male);
        setValue("infection_cervicitis_vaginitis_female", annualMedicalReportData.infection_cervicitis_vaginitis_female);
        setValue("infection_cervicitis_vaginitis_total", annualMedicalReportData.infection_cervicitis_vaginitis_total);
        setValue("abortion_spontaneous_threatened_male", annualMedicalReportData.abortion_spontaneous_threatened_male);
        setValue("abortion_spontaneous_threatened_female", annualMedicalReportData.abortion_spontaneous_threatened_female);
        setValue("abortion_spontaneous_threatened_total", annualMedicalReportData.abortion_spontaneous_threatened_total);
        setValue("hyperemesis_gravidarum_male", annualMedicalReportData.hyperemesis_gravidarum_male);
        setValue("hyperemesis_gravidarum_female", annualMedicalReportData.hyperemesis_gravidarum_female);
        setValue("hyperemesis_gravidarum_total", annualMedicalReportData.hyperemesis_gravidarum_total);
        setValue("uterine_tumors_male", annualMedicalReportData.uterine_tumors_male);
        setValue("uterine_tumors_female", annualMedicalReportData.uterine_tumors_female);
        setValue("uterine_tumors_total", annualMedicalReportData.uterine_tumors_total);
        setValue("cervical_polyp_cancer_male", annualMedicalReportData.cervical_polyp_cancer_male);
        setValue("cervical_polyp_cancer_female", annualMedicalReportData.cervical_polyp_cancer_female);
        setValue("cervical_polyp_cancer_total", annualMedicalReportData.cervical_polyp_cancer_total);
        setValue("ovarian_cyst_tumors_male", annualMedicalReportData.ovarian_cyst_tumors_male);
        setValue("ovarian_cyst_tumors_female", annualMedicalReportData.ovarian_cyst_tumors_female);
        setValue("ovarian_cyst_tumors_total", annualMedicalReportData.ovarian_cyst_tumors_total);
        setValue("sexually_transmitted_diseases_male", annualMedicalReportData.sexually_transmitted_diseases_male);
        setValue("sexually_transmitted_diseases_female", annualMedicalReportData.sexually_transmitted_diseases_female);
        setValue("sexually_transmitted_diseases_total", annualMedicalReportData.sexually_transmitted_diseases_total);
        setValue("hermia_inguinal_femoral_male", annualMedicalReportData.hermia_inguinal_femoral_male);
        setValue("hermia_inguinal_femoral_female", annualMedicalReportData.hermia_inguinal_femoral_female);
        setValue("hermia_inguinal_femoral_total", annualMedicalReportData.hermia_inguinal_femoral_total);
        setValue("others_reproductive_male", annualMedicalReportData.others_reproductive_male);
        setValue("others_reproductive_female", annualMedicalReportData.others_reproductive_female);
        setValue("others_reproductive_total", annualMedicalReportData.others_reproductive_total);

        // Neuromuscular / Skeletal / Joints
        setValue("peripheral_neuritis_male", annualMedicalReportData.peripheral_neuritis_male);
        setValue("peripheral_neuritis_female", annualMedicalReportData.peripheral_neuritis_female);
        setValue("peripheral_neuritis_total", annualMedicalReportData.peripheral_neuritis_total);
        setValue("torticollis_male", annualMedicalReportData.torticollis_male);
        setValue("torticollis_female", annualMedicalReportData.torticollis_female);
        setValue("torticollis_total", annualMedicalReportData.torticollis_total);
        setValue("arthritis_male", annualMedicalReportData.arthritis_male);
        setValue("arthritis_female", annualMedicalReportData.arthritis_female);
        setValue("arthritis_total", annualMedicalReportData.arthritis_total);
        setValue("others_skeletal_male", annualMedicalReportData.others_skeletal_male);
        setValue("others_skeletal_female", annualMedicalReportData.others_skeletal_female);
        setValue("others_skeletal_total", annualMedicalReportData.others_skeletal_total);

        // Lymphatic and Immune System
        setValue("anemia_male", annualMedicalReportData.anemia_male);
        setValue("anemia_female", annualMedicalReportData.anemia_female);
        setValue("anemia_total", annualMedicalReportData.anemia_total);
        setValue("leukemia_male", annualMedicalReportData.leukemia_male);
        setValue("leukemia_female", annualMedicalReportData.leukemia_female);
        setValue("leukemia_total", annualMedicalReportData.leukemia_total);
        setValue("cerebrovascular_accident_male", annualMedicalReportData.cerebrovascular_accident_male);
        setValue("cerebrovascular_accident_female", annualMedicalReportData.cerebrovascular_accident_female);
        setValue("cerebrovascular_accident_total", annualMedicalReportData.cerebrovascular_accident_total);
        setValue("lymphadenitis_male", annualMedicalReportData.lymphadenitis_male);
        setValue("lymphadenitis_female", annualMedicalReportData.lymphadenitis_female);
        setValue("lymphadenitis_total", annualMedicalReportData.lymphadenitis_total);
        setValue("lymphoma_male", annualMedicalReportData.lymphoma_male);
        setValue("lymphoma_female", annualMedicalReportData.lymphoma_female);
        setValue("lymphoma_total", annualMedicalReportData.lymphoma_total);

        // Infectious Diseases
        setValue("influenza_male", annualMedicalReportData.influenza_male);
        setValue("influenza_female", annualMedicalReportData.influenza_female);
        setValue("influenza_total", annualMedicalReportData.influenza_total);
        setValue("typhoid_fever_male", annualMedicalReportData.typhoid_fever_male);
        setValue("typhoid_fever_female", annualMedicalReportData.typhoid_fever_female);
        setValue("typhoid_fever_total", annualMedicalReportData.typhoid_fever_total);
        setValue("cholera_male", annualMedicalReportData.cholera_male);
        setValue("cholera_female", annualMedicalReportData.cholera_female);
        setValue("cholera_total", annualMedicalReportData.cholera_total);
        setValue("measles_male", annualMedicalReportData.measles_male);
        setValue("measles_female", annualMedicalReportData.measles_female);
        setValue("measles_total", annualMedicalReportData.measles_total);
        setValue("tetanus_male", annualMedicalReportData.tetanus_male);
        setValue("tetanus_female", annualMedicalReportData.tetanus_female);
        setValue("tetanus_total", annualMedicalReportData.tetanus_total);
        setValue("malaria_male", annualMedicalReportData.malaria_male);
        setValue("malaria_female", annualMedicalReportData.malaria_female);
        setValue("malaria_total", annualMedicalReportData.malaria_total);
        setValue("schistosomiasis_male", annualMedicalReportData.schistosomiasis_male);
        setValue("schistosomiasis_female", annualMedicalReportData.schistosomiasis_female);
        setValue("schistosomiasis_total", annualMedicalReportData.schistosomiasis_total);
        setValue("herpes_zoster_male", annualMedicalReportData.herpes_zoster_male);
        setValue("herpes_zoster_female", annualMedicalReportData.herpes_zoster_female);
        setValue("herpes_zoster_total", annualMedicalReportData.herpes_zoster_total);
        setValue("chicken_pox_male", annualMedicalReportData.chicken_pox_male);
        setValue("chicken_pox_female", annualMedicalReportData.chicken_pox_female);
        setValue("chicken_pox_total", annualMedicalReportData.chicken_pox_total);
        setValue("german_measles_male", annualMedicalReportData.german_measles_male);
        setValue("german_measles_female", annualMedicalReportData.german_measles_female);
        setValue("german_measles_total", annualMedicalReportData.german_measles_total);
        setValue("rabies_male", annualMedicalReportData.rabies_male);
        setValue("rabies_female", annualMedicalReportData.rabies_female);
        setValue("rabies_total", annualMedicalReportData.rabies_total);
        setValue("others_infectious_male", annualMedicalReportData.others_infectious_male);
        setValue("others_infectious_female", annualMedicalReportData.others_infectious_female);
        setValue("others_infectious_total", annualMedicalReportData.others_infectious_total);

        // Diseases due to Noise and Vibration
        setValue("deafness_noise_induced_male", annualMedicalReportData.deafness_noise_induced_male);
        setValue("deafness_noise_induced_female", annualMedicalReportData.deafness_noise_induced_female);
        setValue("deafness_noise_induced_total", annualMedicalReportData.deafness_noise_induced_total);
        setValue("white_fingers_disease_male", annualMedicalReportData.white_fingers_disease_male);
        setValue("white_fingers_disease_female", annualMedicalReportData.white_fingers_disease_female);
        setValue("white_fingers_disease_total", annualMedicalReportData.white_fingers_disease_total);
        setValue("musculo_skeletal_disturbances_male", annualMedicalReportData.musculo_skeletal_disturbances_male);
        setValue("musculo_skeletal_disturbances_female", annualMedicalReportData.musculo_skeletal_disturbances_female);
        setValue("musculo_skeletal_disturbances_total", annualMedicalReportData.musculo_skeletal_disturbances_total);
        setValue("fatigue_male", annualMedicalReportData.fatigue_male);
        setValue("fatigue_female", annualMedicalReportData.fatigue_female);
        setValue("fatigue_total", annualMedicalReportData.fatigue_total);

        // Diseases due to Temperature And Humidity abnormalities
        setValue("heat_stroke_male", annualMedicalReportData.heat_stroke_male);
        setValue("heat_stroke_female", annualMedicalReportData.heat_stroke_female);
        setValue("heat_stroke_total", annualMedicalReportData.heat_stroke_total);
        setValue("heat_cramps_male", annualMedicalReportData.heat_cramps_male);
        setValue("heat_cramps_female", annualMedicalReportData.heat_cramps_female);
        setValue("heat_cramps_total", annualMedicalReportData.heat_cramps_total);
        setValue("dehydration_male", annualMedicalReportData.dehydration_male);
        setValue("dehydration_female", annualMedicalReportData.dehydration_female);
        setValue("dehydration_total", annualMedicalReportData.dehydration_total);
        setValue("heat_exhaustion_male", annualMedicalReportData.heat_exhaustion_male);
        setValue("heat_exhaustion_female", annualMedicalReportData.heat_exhaustion_female);
        setValue("heat_exhaustion_total", annualMedicalReportData.heat_exhaustion_total);
        setValue("others_heat_male", annualMedicalReportData.others_heat_male);
        setValue("others_heat_female", annualMedicalReportData.others_heat_female);
        setValue("others_heat_total", annualMedicalReportData.others_heat_total);

        // Diseases due to Pressure Abnormalities
        setValue("chilblain_male", annualMedicalReportData.chilblain_male);
        setValue("chilblain_female", annualMedicalReportData.chilblain_female);
        setValue("chilblain_total", annualMedicalReportData.chilblain_total);
        setValue("frost_bite_male", annualMedicalReportData.frost_bite_male);
        setValue("frost_bite_female", annualMedicalReportData.frost_bite_female);
        setValue("frost_bite_total", annualMedicalReportData.frost_bite_total);
        setValue("immersion_foot_male", annualMedicalReportData.immersion_foot_male);
        setValue("immersion_foot_female", annualMedicalReportData.immersion_foot_female);
        setValue("immersion_foot_total", annualMedicalReportData.immersion_foot_total);
        setValue("general_hypothermia_male", annualMedicalReportData.general_hypothermia_male);
        setValue("general_hypothermia_female", annualMedicalReportData.general_hypothermia_female);
        setValue("general_hypothermia_total", annualMedicalReportData.general_hypothermia_total);
        setValue("others_cold_temperature_male", annualMedicalReportData.others_cold_temperature_male);
        setValue("others_cold_temperature_female", annualMedicalReportData.others_cold_temperature_female);
        setValue("others_cold_temperature_total", annualMedicalReportData.others_cold_temperature_total);

        // Diseases due to Pressure Abnormalities
        setValue("air_embolism_male", annualMedicalReportData.air_embolism_male);
        setValue("air_embolism_female", annualMedicalReportData.air_embolism_female);
        setValue("air_embolism_total", annualMedicalReportData.air_embolism_total);
        setValue("bends_disease_male", annualMedicalReportData.bends_disease_male);
        setValue("bends_disease_female", annualMedicalReportData.bends_disease_female);
        setValue("bends_disease_total", annualMedicalReportData.bends_disease_total);
        setValue("barotrauma_male", annualMedicalReportData.barotrauma_male);
        setValue("barotrauma_female", annualMedicalReportData.barotrauma_female);
        setValue("barotrauma_total", annualMedicalReportData.barotrauma_total);
        setValue("hypoxia_male", annualMedicalReportData.hypoxia_male);
        setValue("hypoxia_female", annualMedicalReportData.hypoxia_female);
        setValue("hypoxia_total", annualMedicalReportData.hypoxia_total);
        setValue("altitude_sickness_male", annualMedicalReportData.altitude_sickness_male);
        setValue("altitude_sickness_female", annualMedicalReportData.altitude_sickness_female);
        setValue("altitude_sickness_total", annualMedicalReportData.altitude_sickness_total);

        // Diseases due to Radiation
        setValue("cataract_radiation_male", annualMedicalReportData.cataract_radiation_male);
        setValue("cataract_radiation_female", annualMedicalReportData.cataract_radiation_female);
        setValue("cataract_radiation_total", annualMedicalReportData.cataract_radiation_total);
        setValue("keratitis_male", annualMedicalReportData.keratitis_male);
        setValue("keratitis_female", annualMedicalReportData.keratitis_female);
        setValue("keratitis_total", annualMedicalReportData.keratitis_total);
        setValue("burns_male", annualMedicalReportData.burns_male);
        setValue("burns_female", annualMedicalReportData.burns_female);
        setValue("burns_total", annualMedicalReportData.burns_total);
        setValue("radiation_related_cancers_male", annualMedicalReportData.radiation_related_cancers_male);
        setValue("radiation_related_cancers_female", annualMedicalReportData.radiation_related_cancers_female);
        setValue("radiation_related_cancers_total", annualMedicalReportData.radiation_related_cancers_total);

        // TOTAL NUMBER OF CASES - Physical Environment
        setValue("physical_environment_total_male", annualMedicalReportData.physical_environment_total_male);
        setValue("physical_environment_total_female", annualMedicalReportData.physical_environment_total_female);
        setValue("physical_environment_total", annualMedicalReportData.physical_environment_total);

      // Workplace Safety Compliance
        // Report of Occupational Accidents/Injuries
        setValue("contusion_bruises_hematoma_male", annualMedicalReportData.contusion_bruises_hematoma_male);
        setValue("contusion_bruises_hematoma_female", annualMedicalReportData.contusion_bruises_hematoma_female);
        setValue("contusion_bruises_hematoma_total", annualMedicalReportData.contusion_bruises_hematoma_total);
        setValue("abrasions_male", annualMedicalReportData.abrasions_male);
        setValue("abrasions_female", annualMedicalReportData.abrasions_female);
        setValue("abrasions_total", annualMedicalReportData.abrasions_total);
        setValue("cuts_lacerations_punctures_male", annualMedicalReportData.cuts_lacerations_punctures_male);
        setValue("cuts_lacerations_punctures_female", annualMedicalReportData.cuts_lacerations_punctures_female);
        setValue("cuts_lacerations_punctures_total", annualMedicalReportData.cuts_lacerations_punctures_total);
        setValue("concussion_male", annualMedicalReportData.concussion_male);
        setValue("concussion_female", annualMedicalReportData.concussion_female);
        setValue("concussion_total", annualMedicalReportData.concussion_total);
        setValue("avulsion_male", annualMedicalReportData.avulsion_male);
        setValue("avulsion_female", annualMedicalReportData.avulsion_female);
        setValue("avulsion_total", annualMedicalReportData.avulsion_total);
        setValue("amputation_loss_body_part_male", annualMedicalReportData.amputation_loss_body_part_male);
        setValue("amputation_loss_body_part_female", annualMedicalReportData.amputation_loss_body_part_female);
        setValue("amputation_loss_body_part_total", annualMedicalReportData.amputation_loss_body_part_total);
        setValue("crushing_injury_male", annualMedicalReportData.crushing_injury_male);
        setValue("crushing_injury_female", annualMedicalReportData.crushing_injury_female);
        setValue("crushing_injury_total", annualMedicalReportData.crushing_injury_total);
        setValue("spinal_injury_male", annualMedicalReportData.spinal_injury_male);
        setValue("spinal_injury_female", annualMedicalReportData.spinal_injury_female);
        setValue("spinal_injury_total", annualMedicalReportData.spinal_injury_total);
        setValue("cranial_injury_male", annualMedicalReportData.cranial_injury_male);
        setValue("cranial_injury_female", annualMedicalReportData.cranial_injury_female);
        setValue("cranial_injury_total", annualMedicalReportData.cranial_injury_total);
        setValue("sprain_male", annualMedicalReportData.sprain_male);
        setValue("sprain_female", annualMedicalReportData.sprain_female);
        setValue("sprain_total", annualMedicalReportData.sprain_total);
        setValue("dislocation_fracture_male", annualMedicalReportData.dislocation_fracture_male);
        setValue("dislocation_fracture_female", annualMedicalReportData.dislocation_fracture_female);
        setValue("dislocation_fracture_total", annualMedicalReportData.dislocation_fracture_total);
        setValue("burns_injury_male", annualMedicalReportData.burns_injury_male);
        setValue("burns_injury_female", annualMedicalReportData.burns_injury_female);
        setValue("burns_injury_total", annualMedicalReportData.burns_injury_total);

        // Immunization Program (Indicate number immunized)
        setValue("tetanus_toxoid_injection_male", annualMedicalReportData.tetanus_toxoid_injection_male);
        setValue("tetanus_toxoid_injection_female", annualMedicalReportData.tetanus_toxoid_injection_female);
        setValue("tetanus_toxoid_injection_total", annualMedicalReportData.tetanus_toxoid_injection_total);
        setValue("tetanus_antitoxin_injection_male", annualMedicalReportData.tetanus_antitoxin_injection_male);
        setValue("tetanus_antitoxin_injection_female", annualMedicalReportData.tetanus_antitoxin_injection_female);
        setValue("tetanus_antitoxin_injection_total", annualMedicalReportData.tetanus_antitoxin_injection_total);
        setValue("tetanus_globulin_injection_male", annualMedicalReportData.tetanus_globulin_injection_male);
        setValue("tetanus_globulin_injection_female", annualMedicalReportData.tetanus_globulin_injection_female);
        setValue("tetanus_globulin_injection_total", annualMedicalReportData.tetanus_globulin_injection_total);
        setValue("hepatitis_b_vaccination_male", annualMedicalReportData.hepatitis_b_vaccination_male);
        setValue("hepatitis_b_vaccination_female", annualMedicalReportData.hepatitis_b_vaccination_female);
        setValue("hepatitis_b_vaccination_total", annualMedicalReportData.hepatitis_b_vaccination_total);
        setValue("rabies_vaccination_male", annualMedicalReportData.rabies_vaccination_male);
        setValue("rabies_vaccination_female", annualMedicalReportData.rabies_vaccination_female);
        setValue("rabies_vaccination_total", annualMedicalReportData.rabies_vaccination_total);
        setValue("others_immunization_male", annualMedicalReportData.others_immunization_male);
        setValue("others_immunization_female", annualMedicalReportData.others_immunization_female);
        setValue("others_immunization_total", annualMedicalReportData.others_immunization_total);

      // Workplace Welfare
      // Handle radio button input (needs to be a single string, not an array)
      setValue("keeping_of_medical_records_of_workers", Array.isArray(annualMedicalReportData.keeping_of_medical_records_of_workers) 
        ? annualMedicalReportData.keeping_of_medical_records_of_workers[0] 
        : annualMedicalReportData.keeping_of_medical_records_of_workers?.split(',')[0] || "");
      setValue("health_education_and_counselling_by_health_and_safety_personnel", parseArrayField(annualMedicalReportData.health_education_and_counselling_by_health_and_safety_personnel));
      setValue("nutrition_program", parseArrayField(annualMedicalReportData.nutrition_program));
      setValue("maternal_and_child_care_program", parseArrayField(annualMedicalReportData.maternal_and_child_care_program));
      setValue("family_planning_program", parseArrayField(annualMedicalReportData.family_planning_program));
      setValue("mental_health_program", parseArrayField(annualMedicalReportData.mental_health_program));
      setValue("personal_health_maintenance", parseArrayField(annualMedicalReportData.personal_health_maintenance));
      // Handle radio button input (needs to be a single string, not an array)
      setValue("sports_activities", Array.isArray(annualMedicalReportData.sports_activities) 
        ? annualMedicalReportData.sports_activities[0] 
        : annualMedicalReportData.sports_activities?.split(',')[0] || "");
      setValue("physical_fitness_program_others", annualMedicalReportData.physical_fitness_program_others);

      // Workplace Hazards

      // Chemical Hazards
      setValue("dust_sources", annualMedicalReportData.dust_sources);
      setValue("dust_workers_exposed", annualMedicalReportData.dust_workers_exposed);
      setValue("liquids_sources", annualMedicalReportData.liquids_sources);
      setValue("liquids_workers_exposed", annualMedicalReportData.liquids_workers_exposed);
      setValue("mist_fumes_vapors_sources", annualMedicalReportData.mist_fumes_vapors_sources);
      setValue("mist_fumes_vapors_workers_exposed", annualMedicalReportData.mist_fumes_vapors_workers_exposed);
      setValue("gas_sources", annualMedicalReportData.gas_sources);
      setValue("gas_workers_exposed", annualMedicalReportData.gas_workers_exposed);
      setValue("others_chemical_hazards_sources", annualMedicalReportData.others_chemical_hazards_sources);
      setValue("others_chemical_hazards_workers_exposed", annualMedicalReportData.others_chemical_hazards_workers_exposed);

      // Physical Hazards
      setValue("noise_sources", annualMedicalReportData.noise_sources);
      setValue("noise_workers_exposed", annualMedicalReportData.noise_workers_exposed);
      setValue("temperature_humidity_sources", annualMedicalReportData.temperature_humidity_sources);
      setValue("temperature_humidity_workers_exposed", annualMedicalReportData.temperature_humidity_workers_exposed);
      setValue("pressure_sources", annualMedicalReportData.pressure_sources);
      setValue("pressure_workers_exposed", annualMedicalReportData.pressure_workers_exposed);
      setValue("illumination_sources", annualMedicalReportData.illumination_sources);
      setValue("illumination_workers_exposed", annualMedicalReportData.illumination_workers_exposed);
      setValue("radiation_ultraviolet_microwave_sources", annualMedicalReportData.radiation_ultraviolet_microwave_sources);
      setValue("radiation_ultraviolet_microwave_workers_exposed", annualMedicalReportData.radiation_ultraviolet_microwave_workers_exposed);
      setValue("vibration_sources", annualMedicalReportData.vibration_sources);
      setValue("vibration_workers_exposed", annualMedicalReportData.vibration_workers_exposed);
      setValue("others_physical_hazards_sources", annualMedicalReportData.others_physical_hazards_sources);
      setValue("others_physical_hazards_workers_exposed", annualMedicalReportData.others_physical_hazards_workers_exposed);

      // Biological Hazards
      setValue("viral_sources", annualMedicalReportData.viral_sources);
      setValue("viral_workers_exposed", annualMedicalReportData.viral_workers_exposed);
      setValue("bacterial_sources", annualMedicalReportData.bacterial_sources);
      setValue("bacterial_workers_exposed", annualMedicalReportData.bacterial_workers_exposed);
      setValue("fungal_sources", annualMedicalReportData.fungal_sources);
      setValue("fungal_workers_exposed", annualMedicalReportData.fungal_workers_exposed);
      setValue("parasitic_sources", annualMedicalReportData.parasitic_sources);
      setValue("parasitic_workers_exposed", annualMedicalReportData.parasitic_workers_exposed);
      setValue("others_biological_hazards_sources", annualMedicalReportData.others_biological_hazards_sources);
      setValue("others_biological_hazards_workers_exposed", annualMedicalReportData.others_biological_hazards_workers_exposed);

      // Ergonomic Stress
      setValue("exhausting_physical_work_sources", annualMedicalReportData.exhausting_physical_work_sources);
      setValue("exhausting_physical_work_workers_exposed", annualMedicalReportData.exhausting_physical_work_workers_exposed);
      setValue("prolonged_standing_sources", annualMedicalReportData.prolonged_standing_sources);
      setValue("prolonged_standing_workers_exposed", annualMedicalReportData.prolonged_standing_workers_exposed);
      setValue("excessive_mental_effort_sources", annualMedicalReportData.excessive_mental_effort_sources);
      setValue("excessive_mental_effort_workers_exposed", annualMedicalReportData.excessive_mental_effort_workers_exposed);
      setValue("unfavorable_work_posture_sources", annualMedicalReportData.unfavorable_work_posture_sources);
      setValue("unfavorable_work_posture_workers_exposed", annualMedicalReportData.unfavorable_work_posture_workers_exposed);
      setValue("static_monotonous_work_sources", annualMedicalReportData.static_monotonous_work_sources);
      setValue("static_monotonous_work_workers_exposed", annualMedicalReportData.static_monotonous_work_workers_exposed);
      setValue("others_ergonomic_stress_sources", annualMedicalReportData.others_ergonomic_stress_sources);
      setValue("others_ergonomic_stress_workers_exposed", annualMedicalReportData.others_ergonomic_stress_workers_exposed);

      // Report Details
      setValue("prepared_by", annualMedicalReportData.prepared_by);
      setValue("signature", annualMedicalReportData.signature);
      setValue("noted_by", annualMedicalReportData.noted_by);
      setValue("noted_signature", annualMedicalReportData.noted_signature);
      setValue("date_of_report", annualMedicalReportData.date_of_report);
    }
  }, [annualMedicalReportData]);

  const onSubmit = handleSubmit((data: any) => {
    const callbackReq = {
      onSuccess: (data: any) => {
        toast.custom(
          () => <CustomToast message={data.message} type="success" />,
          { duration: 5000 }
        );
        customCloseModal();
        refetch();
      },
      onError: (err: any) => {
        toast.custom(() => <CustomToast message={err} type="error" />, {
          duration: 7000,
        });
      },
    }
    updateAnnualMedicalReport({ annual_medical_report_id: isOpen.id, data: data }, callbackReq);
  });

  return (
    <Transition.Root show={isOpen.open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={() => customCloseModal()}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-visible rounded-lg bg-white pb-4 text-left shadow-xl transition-all my-0 md:my-8 w-full md:max-w-5xl">
                <div className="flex bg-savoy-blue p-2 items-center">
                  <h3 className="flex-1 text-white ml-2 font-semibold">
                    Edit Work Accident/Illness Report
                  </h3>
                  <XCircleIcon
                    className="w-8 h-8 text-white cursor-pointer"
                    onClick={customCloseModal}
                  />
                </div>
                <div>
                  <div className="pt-4 pb-2 pl-4 pr-4 flex flex-row overflow-x-auto whitespace-nowrap space-x-4 scrollbar-hide">
                    <div 
                      className="flex space-x-2 cursor-pointer hover:opacity-80 transition-opacity shrink-0"
                      onClick={() => setSelectedTab(1)}
                    >
                      <h1 className={classNames('text-sm md:text-base font-semibold border-2 py-1 px-2 md:px-3 rounded-full', selectedTab === 1 ? 'text-savoy-blue border-savoy-blue' : 'text-gray-500 border-gray-500')}>1</h1>
                      <h1 className={classNames('self-center text-sm md:text-base font-semibold', selectedTab === 1 ? 'text-savoy-blue' : 'hidden')}>General Information</h1>
                    </div>
                    <div 
                      className="flex space-x-2 cursor-pointer hover:opacity-80 transition-opacity shrink-0"
                      onClick={() => setSelectedTab(2)}
                    >
                      <h1 className={classNames('text-sm md:text-base font-semibold border-2 py-1 px-2 md:px-3 rounded-full', selectedTab === 2 ? 'text-savoy-blue border-savoy-blue' : 'text-gray-500 border-gray-500')}>2</h1>
                      <h1 className={classNames('self-center text-sm md:text-base font-semibold', selectedTab === 2 ? 'text-savoy-blue' : 'hidden')}>Preventive and Emergency Health Services</h1>
                    </div>
                    <div 
                      className="flex space-x-2 cursor-pointer hover:opacity-80 transition-opacity shrink-0"
                      onClick={() => setSelectedTab(3)}
                    >
                      <h1 className={classNames('text-sm md:text-base font-semibold border-2 py-1 px-2 md:px-3 rounded-full', selectedTab === 3 ? 'text-savoy-blue border-savoy-blue' : 'text-gray-500 border-gray-500')}>3</h1>
                      <h1 className={classNames('self-center text-sm md:text-base font-semibold', selectedTab === 3 ? 'text-savoy-blue' : 'hidden')}>Emergency Occupational Health Services</h1>
                    </div>
                    <div 
                      className="flex space-x-2 cursor-pointer hover:opacity-80 transition-opacity shrink-0"
                      onClick={() => setSelectedTab(4)}
                    >
                      <h1 className={classNames('text-sm md:text-base font-semibold border-2 py-1 px-2 md:px-3 rounded-full', selectedTab === 4 ? 'text-savoy-blue border-savoy-blue' : 'text-gray-500 border-gray-500')}>4</h1>
                      <h1 className={classNames('self-center text-sm md:text-base font-semibold', selectedTab === 4 ? 'text-savoy-blue' : 'hidden')}>Occupational Health Services</h1>
                    </div>
                    <div 
                      className="flex space-x-2 cursor-pointer hover:opacity-80 transition-opacity shrink-0"
                      onClick={() => setSelectedTab(5)}
                    >
                      <h1 className={classNames('text-sm md:text-base font-semibold border-2 py-1 px-2 md:px-3 rounded-full', selectedTab === 5 ? 'text-savoy-blue border-savoy-blue' : 'text-gray-500 border-gray-500')}>5</h1>
                      <h1 className={classNames('self-center text-sm md:text-base font-semibold', selectedTab === 5 ? 'text-savoy-blue' : 'hidden')}>Report of Disease</h1>
                    </div>
                    <div 
                      className="flex space-x-2 cursor-pointer hover:opacity-80 transition-opacity shrink-0"
                      onClick={() => setSelectedTab(6)}
                    >
                      <h1 className={classNames('text-sm md:text-base font-semibold border-2 py-1 px-2 md:px-3 rounded-full', selectedTab === 6 ? 'text-savoy-blue border-savoy-blue' : 'text-gray-500 border-gray-500')}>6</h1>
                      <h1 className={classNames('self-center text-sm md:text-base font-semibold', selectedTab === 6 ? 'text-savoy-blue' : 'hidden')}>Workplace Safety Compliance</h1>
                    </div>
                    <div 
                      className="flex space-x-2 cursor-pointer hover:opacity-80 transition-opacity shrink-0"
                      onClick={() => setSelectedTab(7)}
                    >
                      <h1 className={classNames('text-sm md:text-base font-semibold border-2 py-1 px-2 md:px-3 rounded-full', selectedTab === 7 ? 'text-savoy-blue border-savoy-blue' : 'text-gray-500 border-gray-500')}>7</h1>
                      <h1 className={classNames('self-center text-sm md:text-base font-semibold', selectedTab === 7 ? 'text-savoy-blue' : 'hidden')}>Workplace Welfare</h1>
                    </div>
                    <div 
                      className="flex space-x-2 cursor-pointer hover:opacity-80 transition-opacity shrink-0"
                      onClick={() => setSelectedTab(8)}
                    >
                      <h1 className={classNames('text-sm md:text-base font-semibold border-2 py-1 px-2 md:px-3 rounded-full', selectedTab === 8 ? 'text-savoy-blue border-savoy-blue' : 'text-gray-500 border-gray-500')}>8</h1>
                      <h1 className={classNames('self-center text-sm md:text-base font-semibold', selectedTab === 8 ? 'text-savoy-blue' : 'hidden')}>Workplace Hazards</h1>
                    </div>
                  </div>
                  <div className="pl-4">
                    <h1 className="text-sm font-semibold text-gray-500">Step {selectedTab} out of 8</h1>
                  </div>
                </div>
                {selectedTab === 1 && (
                  <GeneralInfo
                    control={control}
                    register={register}
                    handleSubmit={handleSubmit}
                    setSelectedTab={setSelectedTab}
                    setValue={setValue}
                    watch={watch}
                  />
                )}
                {selectedTab === 2 && (
                  <PreventiveAndEmergency
                    register={register}
                    handleSubmit={handleSubmit}
                    setSelectedTab={setSelectedTab}
                    watch={watch}
                    errors={errors}
                    setError={setError}
                    clearErrors={clearErrors}
                  />
                )}
                {selectedTab === 3 && (
                  <EmergencyOccupational
                    register={register}
                    handleSubmit={handleSubmit}
                    setSelectedTab={setSelectedTab}
                    watch={watch}
                    errors={errors}
                    setError={setError}
                    clearErrors={clearErrors}
                    setValue={setValue}
                  />
                )}
                {selectedTab === 4 && (
                  <OccupationalHealthService
                    register={register}
                    handleSubmit={handleSubmit}
                    setSelectedTab={setSelectedTab}
                    watch={watch}
                    errors={errors}
                    setError={setError}
                    clearErrors={clearErrors}
                    setValue={setValue}
                  />
                )}
                {selectedTab === 5 && (
                  <ReportOfDisease
                    register={register}
                    handleSubmit={handleSubmit}
                    setSelectedTab={setSelectedTab}
                    setValue={setValue}
                    watch={watch}
                  />
                )}
                {selectedTab === 6 && (
                  <WorkplaceSafetyCompliance
                    register={register}
                    handleSubmit={handleSubmit}
                    setSelectedTab={setSelectedTab}
                    setValue={setValue}
                    watch={watch}
                  />
                )}
                {selectedTab === 7 && (
                  <WorkplaceWelfare
                    register={register}
                    handleSubmit={handleSubmit}
                    setSelectedTab={setSelectedTab}
                    watch={watch}
                    errors={errors}
                    setError={setError}
                    clearErrors={clearErrors}
                    setValue={setValue}
                  />
                )}
                {selectedTab === 8 && (
                  <WorkplaceHazards
                    control={control}
                    register={register}
                    onSubmit={onSubmit}
                    setSelectedTab={setSelectedTab}
                    isLoading={isLoadingUpdateAnnualMedicalReport}
                    setValue={setValue}
                    watch={watch}
                  />
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

export default EditAnnualMedicalReportModal;
