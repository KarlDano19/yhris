import { useMemo } from 'react';
import {
  filterEmployeesByDateAndDepartment,
  filterFrequentlyEvaluatedEmployees,
  filterIndividualResponses,
  getEmployeeScoresForCriterion,
} from '../../helpers/evaluationHelpers';
import { DateFilter } from '../types';

interface UseEvaluationDataProps {
  templateResponseDetails: any;
  templateDefinition: any;
  dateFilter: DateFilter;
  departmentFilter: string[];
}

export const useEvaluationData = ({
  templateResponseDetails,
  templateDefinition,
  dateFilter,
  departmentFilter,
}: UseEvaluationDataProps) => {
  // Extract criterion and section mappings from template definition
  const { activeCriterionIds, sectionTitleMap, criterionTitleMap } = useMemo(() => {
    if (!templateDefinition?.evaluation_criterion || !Array.isArray(templateDefinition.evaluation_criterion)) {
      return {
        activeCriterionIds: new Set<string>(),
        sectionTitleMap: new Map<string, { title?: string; description?: string }>(),
        criterionTitleMap: new Map<string, string>(),
      };
    }

    const ids = new Set<string>();
    const sectionMap = new Map<string, { title?: string; description?: string }>();
    const criterionMap = new Map<string, string>();

    templateDefinition.evaluation_criterion.forEach((section: any) => {
      if (!section || !Array.isArray(section.criterion)) {
        return;
      }

      sectionMap.set(section.id, {
        title: section.section_title,
        description: section.section_description,
      });

      section.criterion.forEach((criterion: any) => {
        if (criterion?.id) {
          ids.add(criterion.id);
          criterionMap.set(criterion.id, criterion.title);
        }
      });
    });

    return {
      activeCriterionIds: ids,
      sectionTitleMap: sectionMap,
      criterionTitleMap: criterionMap,
    };
  }, [templateDefinition]);

  const isValidCriterion = (criterion: any) => {
    if (!criterion) return false;
    const title = typeof criterion.title === 'string' ? criterion.title.trim() : '';
    return Boolean(title) && !/^untitled(\s+question)?$/i.test(title);
  };

  // Extract questions from individual responses
  const extractQuestionsFromIndividualResponses = useMemo(() => {
    const allResponses = templateResponseDetails?.individual_responses || [];
    if (!allResponses || allResponses.length === 0) {
      return [];
    }

    const sectionsMap = new Map<string, {
      id: string;
      section_title: string;
      section_description: string;
      criterion: Map<string, any>;
    }>();

    allResponses.forEach((response: any) => {
      const formData = response.form_data || [];
      if (!Array.isArray(formData)) return;

      formData.forEach((section: any) => {
        if (!section || !section.id) return;

        if (!sectionsMap.has(section.id)) {
          sectionsMap.set(section.id, {
            id: section.id,
            section_title: section.section_title || section.title || sectionTitleMap.get(section.id)?.title || 'Untitled Section',
            section_description: section.section_description || section.description || sectionTitleMap.get(section.id)?.description || '',
            criterion: new Map(),
          });
        }

        const sectionData = sectionsMap.get(section.id)!;
        const criteriaList = section.criterion || [];
        
        if (!Array.isArray(criteriaList)) return;

        criteriaList.forEach((criterion: any) => {
          if (!criterion || !isValidCriterion(criterion)) return;

          const criterionId = criterion.id || criterion.criterion_id;
          if (!criterionId) return;

          if (activeCriterionIds.size > 0 && !activeCriterionIds.has(criterionId)) {
            return;
          }

          if (!sectionData.criterion.has(criterionId)) {
            sectionData.criterion.set(criterionId, {
              id: criterionId,
              title: criterion.title || criterion.name || criterionTitleMap.get(criterionId) || 'Untitled',
              max_score: criterion.max_score || criterion.weight || criterion.maxScore || 0,
              type: criterion.type || 'rating',
            });
          } else {
            const existing = sectionData.criterion.get(criterionId)!;
            if ((!existing.title || existing.title === 'Untitled') && (criterion.title || criterion.name)) {
              existing.title = criterion.title || criterion.name || criterionTitleMap.get(criterionId) || existing.title;
            }
            if (existing.max_score === 0 && (criterion.max_score || criterion.weight || criterion.maxScore)) {
              existing.max_score = criterion.max_score || criterion.weight || criterion.maxScore || 0;
            }
          }
        });
      });
    });

    const sections: any[] = [];
    sectionsMap.forEach((sectionData, sectionIndex) => {
      const criteria: any[] = [];
      let criterionIndex = 0;
      
      sectionData.criterion.forEach((criterion) => {
        criteria.push({
          ...criterion,
          criterionIndex: criterionIndex++,
        });
      });

      if (criteria.length > 0) {
        sections.push({
          ...sectionData,
          criterion: criteria,
          sectionIndex,
        });
      }
    });

    return sections;
  }, [templateResponseDetails?.individual_responses, activeCriterionIds, sectionTitleMap, criterionTitleMap]);

  // Filter employees by date and department
  const filteredEmployees = useMemo(() => {
    const filtered = filterEmployeesByDateAndDepartment(
      templateResponseDetails?.employees_responded || [],
      dateFilter,
      departmentFilter
    );
    
    return filtered.sort((a, b) => {
      if (!a.date_completed) return 1;
      if (!b.date_completed) return -1;
      return new Date(b.date_completed).getTime() - new Date(a.date_completed).getTime();
    });
  }, [templateResponseDetails, dateFilter, departmentFilter]);

  // Get filtered individual responses
  const getFilteredIndividualResponses = () => {
    return filterIndividualResponses(
      templateResponseDetails?.individual_responses || [],
      templateResponseDetails?.employees_responded || [],
      dateFilter,
      departmentFilter
    );
  };

  // Get filtered frequently evaluated employees
  const getFilteredFrequentlyEvaluatedEmployees = () => {
    return filterFrequentlyEvaluatedEmployees(
      templateResponseDetails?.frequently_evaluated_employees || [],
      departmentFilter,
      templateResponseDetails?.individual_responses || [],
      dateFilter
    );
  };

  // Get employee scores for a specific criterion
  const getEmployeeScoresForCriterionWrapper = (sectionId: string, criterionId: string) => {
    const filteredResponses = getFilteredIndividualResponses();
    return getEmployeeScoresForCriterion(filteredResponses, sectionId, criterionId);
  };

  // Prepare question response data
  const prepareQuestionResponseData = () => {
    const questionsFromResponses = extractQuestionsFromIndividualResponses;
    
    if (!questionsFromResponses || questionsFromResponses.length === 0) {
      return [];
    }

    const allCriteria: any[] = [];

    questionsFromResponses.forEach((section: any) => {
      if (!section || !section.criterion || !Array.isArray(section.criterion)) {
        return;
      }

      section.criterion.forEach((criterion: any) => {
        if (!isValidCriterion(criterion)) {
          return;
        }

        const employeeScores = getEmployeeScoresForCriterionWrapper(section.id, criterion.id || criterion.criterion_id);

        allCriteria.push({
          sectionId: section.id,
          sectionTitle: section.section_title || 'Untitled Section',
          criterionId: criterion.id || criterion.criterion_id,
          title: criterion.title.trim(),
          max_score: criterion.max_score,
          sectionIndex: section.sectionIndex,
          criterionIndex: criterion.criterionIndex,
          employeeScores,
        });
      });
    });

    return allCriteria;
  };

  return {
    filteredEmployees,
    extractQuestionsFromIndividualResponses,
    getFilteredFrequentlyEvaluatedEmployees,
    getFilteredIndividualResponses,
    prepareQuestionResponseData,
  };
};

