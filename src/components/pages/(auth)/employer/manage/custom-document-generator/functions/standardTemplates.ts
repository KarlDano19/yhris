import { T_DocumentTemplate, T_StandardType, T_TemplateField, T_TemplateFieldType } from '@/types/custom-document-generator';

import { newField } from './templateFields';
import { PLACEHOLDER } from './renderTemplate';

// The built-in Document Generator documents (utils/employee_issue.py for the NTE, form-previews for the rest)
// as editable templates, so a company rearranges and restyles one instead of starting from a blank page.

const NTE_HTML = [
  '<h1 class="ql-align-center">NOTICE TO EXPLAIN</h1>',
  '<p class="ql-align-center">{{nte.place_of_incident}}</p>',
  '<p class="ql-align-right">Ref: {{nte.reference_no}}</p>',
  '<table><tbody>',
  '<tr><td><strong>Name of Employee:</strong> {{nte.employee_name}}</td><td><strong>Date Issued:</strong> {{nte.date_issued}}</td></tr>',
  '<tr><td><strong>Position:</strong> {{nte.position}}</td><td><strong>Company Name:</strong> {{nte.company_name}}</td></tr>',
  '<tr><td><strong>Department:</strong> {{nte.department}}</td><td><strong>Incident Date:</strong> {{nte.incident_date}}</td></tr>',
  '</tbody></table>',
  '<p><strong>Brief background:</strong></p>',
  '<p>{{nte.brief_background}}</p>',
  '<p><br></p>',
  '<p><strong>Prepared by:</strong></p>',
  '<p>{{nte.hr_signature}}</p>',
  '<p>{{nte.prepared_by}}</p>',
  '<p><strong>Reviewed by:</strong> {{nte.reviewed_by}}</p>',
  '<h3>I. Employee Explanation</h3>',
  '<p>{{nte.employee_explanation}}</p>',
  '<h3>II. Hearing</h3>',
  '<p><strong>Date:</strong> {{nte.investigation_date}}</p>',
  '<p><strong>Witness:</strong> {{nte.witness}}</p>',
  '<p><strong>Presider:</strong> {{nte.presider}}</p>',
  '<p><strong>Results:</strong></p>',
  '<p>{{nte.investigation_results}}</p>',
  '<p><strong>Decision:</strong> {{nte.investigation_decision}}</p>',
  '<h3>III. Management Decision</h3>',
  '<p>{{nte.management_decision}}</p>',
  '<p><br></p>',
  '<p>{{nte.employee_signature}}</p>',
  '<p>{{nte.employee_name}}</p>',
  '<p>Employee Signature</p>',
].join('');

const CERTIFICATE_HTML = [
  '<h1 class="ql-align-center">Certificate of Employment</h1>',
  '<p><br></p>',
  '<p>This is to certify that <strong>{{employee.full_name}}</strong> is currently employed by <strong>{{employer.name}}</strong> ',
  'as <strong>{{employee.position}}</strong> from <strong>{{employee.date_hired}}</strong> to <strong>{{end_date}}</strong>.</p>',
  '<p>This certificate is issued {{purpose}}.</p>',
  '<p>Issued this {{date_of_issuance}} in {{place_of_issuance}}.</p>',
  '<p><br></p>',
  '<p>{{signature}}</p>',
  '<p><strong>{{signatory_name}}</strong></p>',
  '<p>{{signatory_position}}</p>',
  '<p>{{employer.name}}</p>',
].join('');

const AGREEMENT_HTML = [
  '<h2 class="ql-align-center">{{employer.name}}</h2>',
  '<p class="ql-align-center">{{employer.address}}</p>',
  '<h1 class="ql-align-center">Employment Agreement</h1>',
  '<p>This Employment Agreement ("Agreement") is made and entered into on {{date_of_issuance}} in {{place_of_issuance}} between {{employer.name}} (hereinafter referred to as "Employer")</p>',
  '<p class="ql-align-center">and</p>',
  '<p>{{employee.full_name}} (hereinafter referred to as "Employee")</p>',
  '<p>In consideration of the mutual covenants set forth below, Employer agrees to hire Employee and Employee agrees to work for Employer as set forth in this Agreement.</p>',
  '<h3>1. Position and Employment Period</h3>',
  '<p>That the Employee is set to commence employment on {{start_date}} with {{probation_period}} months under Probationary status as {{employee.position}}.</p>',
  '<h3>2. Performance of Duties</h3>',
  '<p>The Employee agrees that during the Employment Period he/she shall devote his/her full working time, attention, knowledge and skills to the business affairs of the Employer and shall do so in good faith, with best efforts, and to the reasonable satisfaction of the Employer. The Employee shall also perform such other duties as are customarily performed by other persons in similar such positions, as well as such other duties as may be assigned from time to time by the Employer. Employee agrees to refrain from any interest, of any kind whatsoever, in any business competitive to Employer\'s business. The Employee further acknowledges they will not engage in any form of activity that produces a "conflict of interest" with those of the Employer unless agreed to in advance and in writing.</p>',
  '<h3>3. Performance Evaluations</h3>',
  '<p>Performance evaluations are conducted every month for the duration of the Probationary Period to discuss job responsibilities, standards, and performance requirements. Additional formal performance reviews are conducted to provide both the company and employees the opportunity to discuss job tasks, identify and correct performance deficiencies, encourage and recognize strengths, and discuss positive, purposeful approaches for meeting goals.</p>',
  '<h3>4. Place and Hours of Employment</h3>',
  '<p>Employee agrees that their duties shall be primarily rendered at Employer\'s business premises or at such other places as the Employer shall in good faith require. Full time service for the Employee is expected which requires a minimum of {{working_hours}} hours per day, exclusive of vacation, or any other form of leave as described within this Agreement.</p>',
  '<h3>5. Compensation Package</h3>',
  '<p>Employee agrees that Employer will pay him every 15th and 30th of the month his basic salary of Php {{daily_salary}} daily.</p>',
  '<h3>6. Salary Adjustment</h3>',
  '<p>Adjustments to salary and benefits are based on the value contributed by Employee to Employer. While salary adjustments are primarily based on merit, The Employer may at times adjust salaries depending on overall company performance, and/or the cost of living changes to salaries of similarity started employees in the company or industry.</p>',
  '<h3>7. Benefits</h3>',
  '<p>A. SSS, PhilHealth and Pagibig</p>',
  '<p>B. Employee may use the 5 days Service Incentive Leave (SIL) after one (1) year of service.</p>',
  '<h3>8. Covenants</h3>',
  '<p>A. Non-Disclosure of Trade Secrets, Customer Lists and Other Proprietary Information</p>',
  '<p>During and after the Employment Period, the Employee will not divulge or appropriate to his own use or to the use of others, in competition with the Company, any secret or confidential information or knowledge pertaining to the business of the Company, or of any of its subsidiaries, obtained by him in any way while he was employed by the Company or by any of its subsidiaries. Employee agrees not to use, disclose or communicate, in any manner, proprietary information about Employer, its operations, clientele, or any other proprietary information, that relate to the business of Employer. This includes, but is not limited to, the names of Employer\'s customers, its marketing strategies, operations, or any other information of any kind which would be deemed confidential or proprietary information of the Employer. Employee acknowledges that the above information is material and confidential and that it affects the profitability of the Employer. The Employee understands that any breach of this provision, or of any other Confidentiality and Non-Disclosure Agreement, is a material breach of this Agreement.</p>',
  '<p>B. Non-Solicitation Covenant</p>',
  '<p>Employee agrees that for a period of following termination of employment, for any reason whatsoever, Employee will not solicit customers or clients of the Employee. By agreeing to this covenant, Employee acknowledges that their contributions to Employer are unique to Employer\'s success and that they have significant access to Employer\'s trade secrets and other confidential or proprietary information regarding Employer\'s customers or clients.</p>',
  '<p>C. Non-Recruit Covenant</p>',
  '<p>Employee agrees not to recruit any of Employer\'s employees for the purpose of any outside business either during or for a period of 12 months after Employees tenure of employment with Employer. Employee agrees that such effort at recruitment also constitutes a violation of the non-solicitation covenant set forth above.</p>',
  '<p>D. Non-Compete Covenant</p>',
  '<p>During the period of his employment under this Agreement, the Employee shall not be employed by or otherwise engage in or be interested in any business in competition with the Company, or with any of its subsidiaries or affiliates.</p>',
  '<p>E. Remedies</p>',
  '<p>If at any time the Employee violates to a material extent any of the covenants or agreements set forth in sections C and D, the Company shall have the right to terminate all of its obligations to make further payments under this Agreement. The Employee acknowledges that the Company would be irreparably injured by a violation of sections C and D and agrees that the Company shall be entitled to an injunction restraining the Employee from any actual or threatened breach of sections C and D or to any other appropriate equitable remedy without any bond or other security being required.</p>',
  '<p>F. Adherence to Employer\'s Policies, Procedures, Rules and Regulations</p>',
  '<p>The Employee agrees to adhere to all of the policies, procedures, rules and regulations set forth by the employer. These policies, procedures, rules and regulations include, but are not limited to, those set forth within the Employee Handbook, any summary benefit plan descriptions, or any other personnel practices or policies or Employer. To the extent that the Employer\'s policies, procedures, rules and regulations conflict with the terms of this Agreement, the specific terms of this Agreement will control.</p>',
  '<p>G. Covenant to Notify Management of Unlawful Acts or Practices</p>',
  '<p>Employee agrees to abide by the legal and ethics policies of Employer as well as Employer\'s other rules, regulations, policies and procedures. The Employer intends to comply in full with all governmental laws and regulations as well as any ethics code applicable to their profession. In the event that the Employee is aware of the Employer, or any of its officers, agents or employees, violating any such laws, ethics codes, rules, violations to the attention of the Employer immediately so that matter may be properly investigated and appropriate action taken.</p>',
  '<h3>10. Property Rights</h3>',
  '<p>A. Existing Customers or Clientele of Employee</p>',
  '<p>Employer agrees that existing customers or clients of Employee will (become the property of Employer) (remain the property of the Employer) as the condition of employment.</p>',
  '<p>B. New Customers or clientele generated While at Work</p>',
  '<p>Employee agrees that any customers or clientele generated by Employee pursuant to employment with Employer are the customers and clientele of the Employer and subject to the non-disclosure and non-solicitation covenants set forth above.</p>',
  '<p>C. Records and Accounts</p>',
  '<p>The Employee agrees that all those records and accounts maintained during the course of employment are the property of the Employer, shall remain current and be maintained at the Employer\'s place of business.</p>',
  '<p>D. Return Upon Termination</p>',
  '<p>Employee agrees that upon termination they will return to Employer all of Employer\'s property, including, but not limited to, intellectual property, trade secret information, customer lists, operation manuals, employee handbook, records and accounts, materials subject to copyright, trademark, or patent protection, customer and Employer information, credit cards, business documents, reports, automobiles, keys, passes, and security devices.</p>',
  '<p>E. Copyrights, Inventions and Patents</p>',
  '<p>The Employee understands that any copyrights, inventions or patents created or obtained, in part or whole, by the Employee during the course of this Agreement are to be considered "work for hire" and the property of the Employer. Employee assigns to Employer all rights and interest in any copyright, invention, patents or other property related to business of the Employer.</p>',
  '<p><br></p>',
  '<p><strong>ACKNOWLEDGES THAT EMPLOYEE HAS READ, UNDERSTOOD, AND AGREES TO BE BOUND BY THE TERMS AND CONDITIONS CONTAINED IN THIS AGREEMENT.</strong></p>',
  '<p><br></p>',
  '<p>{{employee.full_name}}</p>',
  '<p>Employee</p>',
  '<p><br></p>',
  '<p>{{signature}}</p>',
  '<p>{{signatory_name}}</p>',
  '<p>{{signatory_position}}</p>',
  '<p>{{employer.name}}</p>',
  '<p><br></p>',
  '<p>Signed in the presence of:</p>',
  '<p>______________________ Witness</p>',
  '<p>______________________ Witness</p>',
].join('');

// Typed fields whose kind the starter knows; every other {{key}} gets newField's defaults
const FIELD_TYPES: Record<string, T_TemplateFieldType> = {
  signature: 'signature',
  start_date: 'date',
  end_date: 'date',
  date_of_issuance: 'date',
  probation_period: 'number',
  working_hours: 'number',
  daily_salary: 'number',
};

const fieldsOf = (html: string): T_TemplateField[] =>
  Array.from(new Set(Array.from(html.matchAll(PLACEHOLDER), (match) => match[1]))).map((key) => ({
    ...newField(key),
    ...(FIELD_TYPES[key] ? { type: FIELD_TYPES[key] } : {}),
  }));

const starter = (standard_type: T_StandardType, title: string, html: string): T_DocumentTemplate => ({
  title,
  html,
  fields: fieldsOf(html),
  standard_type,
});

// Same types and labels as STANDARD_TYPES in yahshua-hris-be/app/models/document_template.py
export const STANDARD_DOCUMENTS: { type: T_StandardType; label: string; starter: T_DocumentTemplate }[] = [
  {
    type: 'employee-certificate',
    label: 'Certificate of Employment',
    starter: starter('employee-certificate', 'Certificate of Employment', CERTIFICATE_HTML),
  },
  {
    type: 'employment-agreement',
    label: 'Employment Agreement',
    starter: starter('employment-agreement', 'Employment Agreement', AGREEMENT_HTML),
  },
  {
    type: 'notice-to-explain',
    label: 'Notice to Explain',
    starter: starter('notice-to-explain', 'Notice to Explain', NTE_HTML),
  },
];

export const standardLabel = (type?: string | null) =>
  STANDARD_DOCUMENTS.find((document) => document.type === type)?.label;
