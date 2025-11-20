/**
 * Helper functions for Evaluation History components
 */

/**
 * Get unique departments from employee responses
 */
export const getUniqueDepartments = (employeesResponded: any[]) => {
  if (!employeesResponded) return [];
  
  const departments = new Set<string>();
  employeesResponded.forEach((employee: any) => {
    if (employee.department && employee.department !== 'N/A') {
      departments.add(employee.department);
    }
  });
  
  return Array.from(departments).sort();
};

/**
 * Filter employees based on date range and department
 */
export const filterEmployeesByDateAndDepartment = (
  employees: any[],
  dateFilter: { from: any; to: any },
  departmentFilter: string[]
) => {
  if (!employees) return [];

  let filtered = [...employees];

  // Filter by date range
  if (dateFilter.from || dateFilter.to) {
    filtered = filtered.filter((employee: any) => {
      if (!employee.date_completed) return false;
      
      const employeeDate = new Date(employee.date_completed);
      
      if (dateFilter.from) {
        const fromDate = new Date(dateFilter.from);
        fromDate.setHours(0, 0, 0, 0);
        if (employeeDate < fromDate) return false;
      }
      
      if (dateFilter.to) {
        const toDate = new Date(dateFilter.to);
        toDate.setHours(23, 59, 59, 999);
        if (employeeDate > toDate) return false;
      }
      
      return true;
    });
  }

  // Filter by department
  if (departmentFilter && departmentFilter.length > 0) {
    filtered = filtered.filter((employee: any) => departmentFilter.includes(employee.department));
  }

  return filtered;
};

/**
 * Filter frequently evaluated employees by department and recalculate based on date-filtered responses
 */
export const filterFrequentlyEvaluatedEmployees = (
  frequentlyEvaluatedEmployees: any[],
  departmentFilter: string[],
  individualResponses?: any[],
  dateFilter?: { from: any; to: any }
) => {
  if (!frequentlyEvaluatedEmployees) return [];

  // If we have individual responses and date filter, recalculate analytics from filtered responses
  if (individualResponses && (dateFilter?.from || dateFilter?.to)) {
    // Filter individual responses by date
    let filteredResponses = [...individualResponses];
    
    if (dateFilter.from || dateFilter.to) {
      filteredResponses = filteredResponses.filter((response: any) => {
        const dateField = response.date_of_evaluation || response.date_completed;
        if (!dateField) return false;
        
        const responseDate = new Date(dateField);
        
        if (dateFilter.from) {
          const fromDate = new Date(dateFilter.from);
          fromDate.setHours(0, 0, 0, 0);
          if (responseDate < fromDate) return false;
        }
        
        if (dateFilter.to) {
          const toDate = new Date(dateFilter.to);
          toDate.setHours(23, 59, 59, 999);
          if (responseDate > toDate) return false;
        }
        
        return true;
      });
    }

    // Recalculate frequently evaluated employees from filtered responses
    const employeeStats: { [key: string]: { name: string; department: string; evaluation_count: number; total_score: number; scores: number[] } } = {};
    
    filteredResponses.forEach((response: any) => {
      const employeeName = response.employee_name;
      const totalScore = response.form_total_score || 0;
      
      // Find department from original data
      const originalEmployee = frequentlyEvaluatedEmployees.find((emp: any) => emp.name === employeeName);
      const department = originalEmployee?.department || 'N/A';
      
      if (!employeeStats[employeeName]) {
        employeeStats[employeeName] = {
          name: employeeName,
          department: department,
          evaluation_count: 0,
          total_score: 0,
          scores: []
        };
      }
      
      employeeStats[employeeName].evaluation_count += 1;
      employeeStats[employeeName].total_score += totalScore;
      employeeStats[employeeName].scores.push(totalScore);
    });

    // Convert to array and calculate averages
    let recalculatedEmployees = Object.values(employeeStats).map((emp: any) => ({
      name: emp.name,
      department: emp.department,
      evaluation_count: emp.evaluation_count,
      total_score: emp.total_score,
      average_score: emp.evaluation_count > 0 ? Math.round((emp.total_score / emp.evaluation_count) * 100) / 100 : 0,
      average_raw_score: emp.evaluation_count > 0 ? Math.round(emp.total_score / emp.evaluation_count * 100) / 100 : 0
    }));

    // Apply department filter
    if (departmentFilter && departmentFilter.length > 0) {
      recalculatedEmployees = recalculatedEmployees.filter((employee: any) => 
        departmentFilter.includes(employee.department)
      );
    }

    return recalculatedEmployees;
  }

  // No date filter - use original data with department filter only
  let filtered = [...frequentlyEvaluatedEmployees];

  // Apply department filter
  if (departmentFilter && departmentFilter.length > 0) {
    filtered = filtered.filter((employee: any) => departmentFilter.includes(employee.department));
  }

  return filtered;
};

/**
 * Filter individual responses based on department and date
 */
export const filterIndividualResponses = (
  individualResponses: any[],
  employeesResponded: any[],
  dateFilter: { from: any; to: any },
  departmentFilter: string[]
) => {
  if (!individualResponses) return [];

  let filtered = [...individualResponses];

  // Apply date filter
  if (dateFilter.from || dateFilter.to) {
    filtered = filtered.filter((response: any) => {
      // Use date_of_evaluation instead of date_completed for individual_responses
      const dateField = response.date_of_evaluation || response.date_completed;
      if (!dateField) return false;
      
      const responseDate = new Date(dateField);
      
      if (dateFilter.from) {
        const fromDate = new Date(dateFilter.from);
        fromDate.setHours(0, 0, 0, 0);
        if (responseDate < fromDate) return false;
      }
      
      if (dateFilter.to) {
        const toDate = new Date(dateFilter.to);
        toDate.setHours(23, 59, 59, 999);
        if (responseDate > toDate) return false;
      }
      
      return true;
    });
  }

  // Apply department filter
  if (departmentFilter && departmentFilter.length > 0) {
    filtered = filtered.filter((response: any) => {
      const employeeDept = employeesResponded?.find(
        (emp: any) => emp.name === response.employee_name
      )?.department;
      return departmentFilter.includes(employeeDept);
    });
  }
  return filtered;
};

/**
 * Calculate employee scores for a specific criterion
 */
const sanitizeKeyPart = (value: any) => {
  if (value === null || value === undefined) return '';
  return String(value).trim().toLowerCase();
};

const buildDeterministicId = (prefix: string, parts: string[]) => {
  const normalized = parts.filter(Boolean).join('|').trim();
  if (!normalized) {
    return null;
  }

  let hash = 0;
  for (let idx = 0; idx < normalized.length; idx += 1) {
    hash = (hash << 5) - hash + normalized.charCodeAt(idx);
    hash |= 0;
  }

  return `${prefix}-${Math.abs(hash).toString(36)}`;
};

export const normalizeFormSections = (formData: any) => {
  if (!formData) return [];

  if (Array.isArray(formData)) {
    return formData;
  }

  if (typeof formData === 'string') {
    try {
      const parsed = JSON.parse(formData);
      if (Array.isArray(parsed)) {
        return parsed;
      }
      if (parsed && Array.isArray(parsed.sections)) {
        return parsed.sections;
      }
      return [];
    } catch (_err) {
      return [];
    }
  }

  if (Array.isArray(formData.sections)) {
    return formData.sections;
  }

  return [];
};

export const getSectionIdentifier = (section: any) => {
  if (!section) return null;
  const explicitId =
    section.id ||
    section.section_id ||
    section.sectionId ||
    section.section_uuid ||
    section.sectionUUID ||
    section.uuid;

  if (explicitId) {
    return explicitId;
  }

  const fallback = buildDeterministicId('section', [
    sanitizeKeyPart(section.section_title || section.title),
    sanitizeKeyPart(section.section_description || section.description),
    sanitizeKeyPart(
      Array.isArray(section.criterion)
        ? section.criterion.map((crit: any) => crit?.title || crit?.name || '').join('|')
        : ''
    ),
  ]);

  return fallback;
};

export const getCriterionIdentifier = (criterion: any) => {
  if (!criterion) return null;
  const explicitId =
    criterion.id ||
    criterion.criterion_id ||
    criterion.criterionId ||
    criterion.uuid ||
    criterion.item_id;

  if (explicitId) {
    return explicitId;
  }

  const fallback = buildDeterministicId('criterion', [
    sanitizeKeyPart(criterion.title || criterion.name),
    sanitizeKeyPart(criterion.description || criterion.details || criterion.remark),
  ]);

  return fallback;
};

export const getEmployeeScoresForCriterion = (
  filteredResponses: any[],
  sectionId: string,
  criterionId: string
) => {
  if (filteredResponses.length === 0) return [];

  const employeeScores: { 
    [key: string]: { 
      name: string; 
      scores: number[]; 
      averageScore: number;
    } 
  } = {};

  // Process each individual response
  filteredResponses.forEach((response: any) => {
    const employeeName = response.employee_name;
    const formData = normalizeFormSections(response.form_data || []);
    
    // Find the section in the form data
    const section = formData.find((s: any) => getSectionIdentifier(s) === sectionId);

    if (section && section.criterion && Array.isArray(section.criterion)) {
      // Find criterion by ID instead of index for more reliable matching
      const criterion = section.criterion.find(
        (c: any) => getCriterionIdentifier(c) === criterionId
      );
      
      if (criterion && criterion.score !== undefined && criterion.score !== null) {
        const score = typeof criterion.score === 'number' ? criterion.score : parseFloat(criterion.score);
        
        // Allow score of 0, but filter out NaN and negative scores
        if (!isNaN(score) && score >= 0) {
          if (!employeeScores[employeeName]) {
            employeeScores[employeeName] = {
              name: employeeName,
              scores: [],
              averageScore: 0
            };
          }
          employeeScores[employeeName].scores.push(score);
        }
      }
    }
  });

  // Calculate average scores for each employee
  Object.values(employeeScores).forEach(employee => {
    if (employee.scores.length > 0) {
      employee.averageScore = employee.scores.reduce((sum, score) => sum + score, 0) / employee.scores.length;
    }
  });

  // Convert to array and sort by average score (descending)
  // Include employees with average score of 0 (they might have scored 0 on purpose)
  return Object.values(employeeScores)
    .filter(employee => employee.scores.length > 0)
    .sort((a, b) => b.averageScore - a.averageScore);
};


