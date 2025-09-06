import React from 'react';
import DocumentPageOne from './print/DocumentPageOne';
import DocumentPageTwo from './print/DocumentPageTwo';

export const createWemRequestDocumentComponent = (item: any) => {
  
  // Page One Data
  const pageOneData = {
    dateOfApplication: item.date_of_application || '\u00A0',
    companyName: item.company_name || '\u00A0',
    address: item.address || '\u00A0',
    region: item.region || '\u00A0',
    emailAddress: item.email_address || '\u00A0',
    telFaxNo: item.tel_fax_no || '\u00A0',
    typeOfIndustry: {
      manufacturing: (() => {
        const industryValue = item.type_of_industry || '';
        if (industryValue.startsWith('Manufacturing of:')) {
          return {
            checked: true,
            details: industryValue.replace('Manufacturing of:', '').trim() || '\u00A0'
          };
        }
        return { checked: false, details: '\u00A0' };
      })(),
      service: (() => {
        const industryValue = item.type_of_industry || '';
        if (industryValue.startsWith('Service/s:')) {
          return {
            checked: true,
            details: industryValue.replace('Service/s:', '').trim() || '\u00A0'
          };
        }
        return { checked: false, details: '\u00A0' };
      })(),
      others: (() => {
        const industryValue = item.type_of_industry || '';
        if (industryValue.startsWith('Others:')) {
          return {
            checked: true,
            details: industryValue.replace('Others:', '').trim() || '\u00A0'
          };
        }
        return { checked: false, details: '\u00A0' };
      })(),
    },
    numberOfWorkers: {
      male: item.number_of_workers_male || '\u00A0',
      female: item.number_of_workers_female || '\u00A0',
      total: item.number_of_workers_total || '\u00A0',
    },
    riskClassification: item.risk_classification?.toLowerCase() || '\u00A0',
    safetyOfficers: {
      names: (() => {
        if (Array.isArray(item.name_of_safety_officer) && item.name_of_safety_officer.length > 0) {
          // Handle comma-separated string in array
          if (item.name_of_safety_officer[0].includes(',')) {
            return item.name_of_safety_officer[0].split(',').map((name: string) => name.trim());
          }
          return item.name_of_safety_officer;
        }
        return [item.name_of_safety_officer || '\u00A0'];
      })(),
      levels: {
        safetyOfficer1: Array.isArray(item.safety_officer_levels) && item.safety_officer_levels.length > 0 ? 
          item.safety_officer_levels[0].toLowerCase().includes('safety officer level 1') || item.safety_officer_levels[0].toLowerCase().includes('safety_officer_1') : false,
        safetyOfficer2: Array.isArray(item.safety_officer_levels) && item.safety_officer_levels.length > 0 ? 
          item.safety_officer_levels[0].toLowerCase().includes('safety officer level 2') || item.safety_officer_levels[0].toLowerCase().includes('safety_officer_2') : false,
        safetyOfficer3: Array.isArray(item.safety_officer_levels) && item.safety_officer_levels.length > 0 ? 
          item.safety_officer_levels[0].toLowerCase().includes('safety officer level 3') || item.safety_officer_levels[0].toLowerCase().includes('safety_officer_3') : false,
        accreditedSafetyOfficer3: Array.isArray(item.safety_officer_levels) && item.safety_officer_levels.length > 0 ? 
          item.safety_officer_levels[0].toLowerCase().includes('accredited safety officer level 3') || item.safety_officer_levels[0].toLowerCase().includes('accredited safety officer 3') || item.safety_officer_levels[0].toLowerCase().includes('accredited_safety_officer_3') : false,
        safetyOfficer4: Array.isArray(item.safety_officer_levels) && item.safety_officer_levels.length > 0 ? 
          item.safety_officer_levels[0].toLowerCase().includes('safety officer level 4') || item.safety_officer_levels[0].toLowerCase().includes('safety_officer_4') : false,
      },
    },
    purposeOfWemRequest: {
      workplaceImprovement: Array.isArray(item.purpose_of_wem_request) && item.purpose_of_wem_request.length > 0 ? 
        item.purpose_of_wem_request[0].toLowerCase().includes('workplace improvement') || item.purpose_of_wem_request[0].toLowerCase().includes('workplace_improvement') : false,
      clientRequirement: Array.isArray(item.purpose_of_wem_request) && item.purpose_of_wem_request.length > 0 ? 
        item.purpose_of_wem_request[0].toLowerCase().includes('client/customer requirement') || item.purpose_of_wem_request[0].toLowerCase().includes('client requirement') || item.purpose_of_wem_request[0].toLowerCase().includes('client_requirement') : false,
      others: Array.isArray(item.purpose_of_wem_request) && item.purpose_of_wem_request.length > 0 ? 
        item.purpose_of_wem_request[0].toLowerCase().includes('others') : false,
      othersSpecify: (() => {
        if (Array.isArray(item.purpose_of_wem_request) && item.purpose_of_wem_request.length > 0) {
          const othersValue = item.purpose_of_wem_request[0].match(/others:\s*(.+)/i);
          return othersValue ? othersValue[1].trim() : '\u00A0';
        }
        return '\u00A0';
      })(),
      oshsCompliance: Array.isArray(item.purpose_of_wem_request) && item.purpose_of_wem_request.length > 0 ? 
        item.purpose_of_wem_request[0].toLowerCase().includes('oshs compliance') || item.purpose_of_wem_request[0].toLowerCase().includes('oshs_compliance') : false,
      isoCompliance: Array.isArray(item.purpose_of_wem_request) && item.purpose_of_wem_request.length > 0 ? 
        item.purpose_of_wem_request[0].toLowerCase().includes('iso compliance') || item.purpose_of_wem_request[0].toLowerCase().includes('iso_compliance') : false,
      requiredByLaborInspector: Array.isArray(item.purpose_of_wem_request) && item.purpose_of_wem_request.length > 0 ? 
        item.purpose_of_wem_request[0].toLowerCase().includes('required by labor inspector') || item.purpose_of_wem_request[0].toLowerCase().includes('required_by_labor_inspector') : false,
    },
    wemMonitoringCapability: {
      internalMonitoringCapability: item.wem_internal_monitoring_capability || '\u00A0',
      equipmentOwned: item.wem_equipment_owned_by_company || '\u00A0',
      conductingInternalWem: item.conducting_internal_wem || false,
      dateOfInternalMonitoring: item.date_of_internal_monitoring || '\u00A0',
      personnelConductedWem: item.personnel_who_conducted_wem || '\u00A0',
    },
    wemConductedBy: {
      oshc: Array.isArray(item.wem_conducted_by) && item.wem_conducted_by.length > 0 ? item.wem_conducted_by[0].toLowerCase().includes('oshc') : false,
      oshcDate: item.last_wem_date || '\u00A0',
      accreditedProvider: Array.isArray(item.wem_conducted_by) && item.wem_conducted_by.length > 0 ? 
        (item.wem_conducted_by[0].toLowerCase().includes('accredited wem provider') || 
         item.wem_conducted_by[0].toLowerCase().includes('accredited_wem_provider') ||
         item.wem_conducted_by[0].toLowerCase().includes('accredited wem officer')) : false,
      accreditedProviderDate: item.accredited_provider_date || '\u00A0',
      accreditedProviderName: item.accredited_provider_name || '\u00A0',
      none: Array.isArray(item.wem_conducted_by) && item.wem_conducted_by.length > 0 ? item.wem_conducted_by[0].toLowerCase().includes('none') : false,
    },
  };

  // Page Two Data
  const pageTwoData = {
    parametersToBeMeasured: {
      physicalHazards: {
        noise: Array.isArray(item.hazards_purpose_of_wem_request) && item.hazards_purpose_of_wem_request.length > 0 ? 
          item.hazards_purpose_of_wem_request[0].toLowerCase().includes('noise') : false,
        vibration: Array.isArray(item.hazards_purpose_of_wem_request) && item.hazards_purpose_of_wem_request.length > 0 ? 
          item.hazards_purpose_of_wem_request[0].toLowerCase().includes('vibration') : false,
        illumination: Array.isArray(item.hazards_purpose_of_wem_request) && item.hazards_purpose_of_wem_request.length > 0 ? 
          item.hazards_purpose_of_wem_request[0].toLowerCase().includes('illumination') : false,
        heat: Array.isArray(item.hazards_purpose_of_wem_request) && item.hazards_purpose_of_wem_request.length > 0 ? 
          item.hazards_purpose_of_wem_request[0].toLowerCase().includes('heat') : false,
      },
      chemicalHazards: {
        dust: Array.isArray(item.chemical_hazards) && item.chemical_hazards.length > 0 ? 
          item.chemical_hazards[0].toLowerCase().includes('dust') : false,
        heavyMetals: Array.isArray(item.chemical_hazards) && item.chemical_hazards.length > 0 ? 
          item.chemical_hazards[0].toLowerCase().includes('heavy metals') || item.chemical_hazards[0].toLowerCase().includes('heavy_metals') : false,
        organicSolvents: Array.isArray(item.chemical_hazards) && item.chemical_hazards.length > 0 ? 
          item.chemical_hazards[0].toLowerCase().includes('organic solvents') || item.chemical_hazards[0].toLowerCase().includes('organic_solvents') : false,
        acids: Array.isArray(item.chemical_hazards) && item.chemical_hazards.length > 0 ? 
          item.chemical_hazards[0].toLowerCase().includes('acids') : false,
        gases: Array.isArray(item.chemical_hazards) && item.chemical_hazards.length > 0 ? 
          item.chemical_hazards[0].toLowerCase().includes('gases') : false,
        others: Array.isArray(item.chemical_hazards) && item.chemical_hazards.length > 0 ? 
          item.chemical_hazards[0].toLowerCase().includes('other') : false,
        othersSpecify: (() => {
          if (Array.isArray(item.chemical_hazards) && item.chemical_hazards.length > 0) {
            const otherValue = item.chemical_hazards[0].match(/other:\s*(.+)/i);
            return otherValue ? otherValue[1].trim() : '\u00A0';
          }
          return '\u00A0';
        })(),
      },
      ventilation: {
        generalVentilation: Array.isArray(item.ventilation) && item.ventilation.length > 0 ? 
          item.ventilation[0].toLowerCase().includes('general ventilation') || item.ventilation[0].toLowerCase().includes('general_ventilation') : false,
        localExhaustVentilation: Array.isArray(item.ventilation) && item.ventilation.length > 0 ? 
          item.ventilation[0].toLowerCase().includes('local exhaust ventilation') || item.ventilation[0].toLowerCase().includes('local_exhaust_ventilation') : false,
      },
    },
    requestingPersonnel: {
      signature: item.signature && item.signature !== 'Update' ? item.signature : '\u00A0',
      name: item.requesting_personnel_name && item.requesting_personnel_name !== 'Update' ? item.requesting_personnel_name : '\u00A0',
      position: item.requesting_personnel_position && item.requesting_personnel_position !== 'Update' ? item.requesting_personnel_position : '\u00A0',
    },
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
      <DocumentPageTwo data={pageTwoData} />
    </div>
  );
};

export const generateWemFilename = (item: any) => {
  return `wem-request-${item.id}-${new Date().toISOString().split('T')[0]}.pdf`;
};

export const handlePrintPDF = async (item: any, generatePDFLocally: (component: React.ReactElement, filename: string) => Promise<void>) => {
  // Create document component with all pages
  const documentComponent = createWemRequestDocumentComponent(item);
  
  const filename = generateWemFilename(item);
  
  // Generate PDF locally (opens print dialog)
  await generatePDFLocally(documentComponent, filename);
};
