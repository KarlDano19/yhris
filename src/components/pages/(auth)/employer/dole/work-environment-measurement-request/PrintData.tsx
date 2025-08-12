import React from 'react';
import DocumentPageOne from './print/DocumentPageOne';
import DocumentPageTwo from './print/DocumentPageTwo';

interface WemRequestData {
  dateOfApplication: string;
  companyName: string;
  address: string;
  region: string;
  emailAddress: string;
  telFaxNo: string;
  industryType: {
    manufacturing: boolean;
    manufacturingSpecify?: string;
    services: boolean;
    servicesSpecify?: string;
    others: boolean;
    othersSpecify?: string;
  };
  numberOfWorkers: {
    male: number;
    female: number;
    total: number;
  };
  riskClassification: 'low' | 'medium' | 'high';
  safetyOfficers: {
    names: string[];
    levels: {
      safetyOfficer1: boolean;
      safetyOfficer2: boolean;
      safetyOfficer3: boolean;
      accreditedSafetyOfficer3: boolean;
      safetyOfficer4: boolean;
    };
  };
  purposeOfWemRequest: {
    workplaceImprovement: boolean;
    clientRequirement: boolean;
    others: boolean;
    othersSpecify?: string;
    oshsCompliance: boolean;
    isoCompliance: boolean;
    requiredByLaborInspector: boolean;
  };
  wemMonitoringCapability: {
    internalMonitoringCapability: string;
    equipmentOwned: string;
    conductingInternalWem: boolean;
    dateOfInternalMonitoring?: string;
    personnelConductedWem?: string;
  };
  wemConductedBy: {
    oshc: boolean;
    oshcDate?: string;
    accreditedProvider: boolean;
    accreditedProviderDate?: string;
    accreditedProviderName?: string;
    none: boolean;
  };
}

interface WemRequestDataPageTwo {
  parametersToBeMeasured: {
    physicalHazards: {
      noise: boolean;
      vibration: boolean;
      illumination: boolean;
      heat: boolean;
    };
    chemicalHazards: {
      dust: boolean;
      heavyMetals: boolean;
      organicSolvents: boolean;
      acids: boolean;
      gases: boolean;
      others: boolean;
      othersSpecify: string;
    };
    ventilation: {
      generalVentilation: boolean;
      localExhaustVentilation: boolean;
    };
  };
  requestingPersonnel: {
    signature: string;
    name: string;
    position: string;
  };
}

export const prepareWemRequestData = (item: any): WemRequestData => {
  return {
    dateOfApplication: item.date_of_application || '\u00A0',
    companyName: item.company_name || '\u00A0',
    address: item.address || '\u00A0',
    region: item.region || '\u00A0',
    emailAddress: item.email_address || '\u00A0',
    telFaxNo: item.tel_fax_no || '\u00A0',
    industryType: {
      manufacturing: item.type_of_industry?.toLowerCase().includes('manufacturing') || false,
      manufacturingSpecify: item.type_of_industry || '\u00A0',
      services: item.type_of_industry?.toLowerCase().includes('service') || false,
      servicesSpecify: item.type_of_industry || '\u00A0',
      others: !item.type_of_industry?.toLowerCase().includes('manufacturing') && !item.type_of_industry?.toLowerCase().includes('service'),
      othersSpecify: item.type_of_industry || '\u00A0',
    },
    numberOfWorkers: {
      male: item.number_of_workers_male || '\u00A0',
      female: item.number_of_workers_female || '\u00A0',
      total: item.number_of_workers_total || '\u00A0',
    },
    riskClassification: item.risk_classification?.toLowerCase() || '\u00A0',
    safetyOfficers: {
      names: Array.isArray(item.name_of_safety_officer) ? item.name_of_safety_officer : [item.name_of_safety_officer || '\u00A0'],
      levels: {
        safetyOfficer1: item.safety_officer_levels?.some((level: string) => level.toLowerCase().includes('safety officer level 1') || level.toLowerCase().includes('safety_officer_1')) || false,
        safetyOfficer2: item.safety_officer_levels?.some((level: string) => level.toLowerCase().includes('safety officer level 2') || level.toLowerCase().includes('safety_officer_2')) || false,
        safetyOfficer3: item.safety_officer_levels?.some((level: string) => level.toLowerCase().includes('safety officer level 3') || level.toLowerCase().includes('safety_officer_3')) || false,
        accreditedSafetyOfficer3: item.safety_officer_levels?.some((level: string) => level.toLowerCase().includes('accredited safety officer 3') || level.toLowerCase().includes('accredited_safety_officer_3')) || false,
        safetyOfficer4: item.safety_officer_levels?.some((level: string) => level.toLowerCase().includes('safety officer level 4') || level.toLowerCase().includes('safety_officer_4')) || false,
      },
    },
    purposeOfWemRequest: {
      workplaceImprovement: Array.isArray(item.purpose_of_wem_request) ? item.purpose_of_wem_request.some((purpose: string) => purpose.toLowerCase().includes('workplace improvement') || purpose.toLowerCase().includes('workplace_improvement')) : false,
      clientRequirement: Array.isArray(item.purpose_of_wem_request) ? item.purpose_of_wem_request.some((purpose: string) => purpose.toLowerCase().includes('client requirement') || purpose.toLowerCase().includes('client_requirement')) : false,
      others: Array.isArray(item.purpose_of_wem_request) ? item.purpose_of_wem_request.some((purpose: string) => purpose.toLowerCase().includes('others')) : false,
      othersSpecify: item.purpose_of_wem_request_others || '\u00A0',
      oshsCompliance: Array.isArray(item.purpose_of_wem_request) ? item.purpose_of_wem_request.some((purpose: string) => purpose.toLowerCase().includes('oshs compliance') || purpose.toLowerCase().includes('oshs_compliance')) : false,
      isoCompliance: Array.isArray(item.purpose_of_wem_request) ? item.purpose_of_wem_request.some((purpose: string) => purpose.toLowerCase().includes('iso compliance') || purpose.toLowerCase().includes('iso_compliance')) : false,
      requiredByLaborInspector: Array.isArray(item.purpose_of_wem_request) ? item.purpose_of_wem_request.some((purpose: string) => purpose.toLowerCase().includes('required by labor inspector') || purpose.toLowerCase().includes('required_by_labor_inspector')) : false,
    },
    wemMonitoringCapability: {
      internalMonitoringCapability: item.wem_internal_monitoring_capability || '\u00A0',
      equipmentOwned: item.wem_equipment_owned_by_company || '\u00A0',
      conductingInternalWem: item.conducting_internal_wem || false,
      dateOfInternalMonitoring: item.date_of_internal_monitoring || '\u00A0',
      personnelConductedWem: item.personnel_who_conducted_wem || '\u00A0',
    },
    wemConductedBy: {
      oshc: Array.isArray(item.wem_conducted_by) ? item.wem_conducted_by.some((conducted: string) => conducted.toLowerCase().includes('oshc')) : false,
      oshcDate: item.last_wem_date || '\u00A0',
      accreditedProvider: Array.isArray(item.wem_conducted_by) ? item.wem_conducted_by.some((conducted: string) => conducted.toLowerCase().includes('accredited wem provider') || conducted.toLowerCase().includes('accredited_wem_provider')) : false,
      accreditedProviderDate: item.accredited_provider_date || '\u00A0',
      accreditedProviderName: item.accredited_provider_name || '\u00A0',
      none: Array.isArray(item.wem_conducted_by) ? item.wem_conducted_by.some((conducted: string) => conducted.toLowerCase().includes('none')) : false,
    },
  };
};

export const prepareWemRequestDataPageTwo = (item: any): WemRequestDataPageTwo => {
  return {
    parametersToBeMeasured: {
      physicalHazards: {
        noise: Array.isArray(item.hazards_purpose_of_wem_request) ? item.hazards_purpose_of_wem_request.some((hazard: string) => hazard.toLowerCase().includes('noise')) : false,
        vibration: Array.isArray(item.hazards_purpose_of_wem_request) ? item.hazards_purpose_of_wem_request.some((hazard: string) => hazard.toLowerCase().includes('vibration')) : false,
        illumination: Array.isArray(item.hazards_purpose_of_wem_request) ? item.hazards_purpose_of_wem_request.some((hazard: string) => hazard.toLowerCase().includes('illumination')) : false,
        heat: Array.isArray(item.hazards_purpose_of_wem_request) ? item.hazards_purpose_of_wem_request.some((hazard: string) => hazard.toLowerCase().includes('heat')) : false,
      },
      chemicalHazards: {
        dust: Array.isArray(item.chemical_hazards) ? item.chemical_hazards.some((hazard: string) => hazard.toLowerCase().includes('dust')) : false,
        heavyMetals: Array.isArray(item.chemical_hazards) ? item.chemical_hazards.some((hazard: string) => hazard.toLowerCase().includes('heavy metals') || hazard.toLowerCase().includes('heavy_metals')) : false,
        organicSolvents: Array.isArray(item.chemical_hazards) ? item.chemical_hazards.some((hazard: string) => hazard.toLowerCase().includes('organic solvents') || hazard.toLowerCase().includes('organic_solvents')) : false,
        acids: Array.isArray(item.chemical_hazards) ? item.chemical_hazards.some((hazard: string) => hazard.toLowerCase().includes('acids')) : false,
        gases: Array.isArray(item.chemical_hazards) ? item.chemical_hazards.some((hazard: string) => hazard.toLowerCase().includes('gases')) : false,
        others: Array.isArray(item.chemical_hazards) ? item.chemical_hazards.some((hazard: string) => hazard.toLowerCase().includes('others')) : false,
        othersSpecify: item.chemical_hazards_others || '',
      },
      ventilation: {
        generalVentilation: Array.isArray(item.ventilation) ? item.ventilation.some((vent: string) => vent.toLowerCase().includes('general ventilation') || vent.toLowerCase().includes('general_ventilation')) : false,
        localExhaustVentilation: Array.isArray(item.ventilation) ? item.ventilation.some((vent: string) => vent.toLowerCase().includes('local exhaust ventilation') || vent.toLowerCase().includes('local_exhaust_ventilation')) : false,
      },
    },
    requestingPersonnel: {
      signature: item.signature && item.signature !== 'Update' ? item.signature : '\u00A0',
      name: item.requesting_personnel_name && item.requesting_personnel_name !== 'Update' ? item.requesting_personnel_name : '\u00A0',
      position: item.requesting_personnel_position && item.requesting_personnel_position !== 'Update' ? item.requesting_personnel_position : '\u00A0',
    },
  };
};

export const createWemDocumentComponent = (wemRequestData: WemRequestData, wemRequestDataPageTwo: WemRequestDataPageTwo) => {
  return (
    <div className="bg-white">
      <style jsx>{`
        .page-break {
          page-break-after: always;
          break-after: page;
        }
      `}</style>
      <DocumentPageOne data={wemRequestData} />
      <div className="page-break" style={{ pageBreakAfter: 'always' }}></div>
      <DocumentPageTwo data={wemRequestDataPageTwo} />
    </div>
  );
};

export const generateWemFilename = (item: any) => {
  return `wem-request-${item.id}-${new Date().toISOString().split('T')[0]}.pdf`;
};

export const handlePrintPDF = async (item: any, generatePDFLocally: (component: React.ReactElement, filename: string) => Promise<void>) => {
  // Prepare data for WEM Request document (Page One)
  const wemRequestData = prepareWemRequestData(item);

  // Prepare data for WEM Request document (Page Two)
  const wemRequestDataPageTwo = prepareWemRequestDataPageTwo(item);

  // Create document component with both pages
  const documentComponent = createWemDocumentComponent(wemRequestData, wemRequestDataPageTwo);
  
  const filename = generateWemFilename(item);
  
  // Generate PDF locally (opens print dialog)
  await generatePDFLocally(documentComponent, filename);
};

export type { WemRequestData, WemRequestDataPageTwo };
