import { useState, useEffect, useMemo } from 'react';
import { FilterGroup } from '@/components/common/Filter';
import { getUniqueDepartments as getUniqueDepts } from '../../helpers/evaluationHelpers';
import { DateFilter } from '../types';

interface UseEvaluationFiltersProps {
  employeesResponded: any[];
  templateResponseDetails: any;
}

export const useEvaluationFilters = ({
  employeesResponded,
  templateResponseDetails,
}: UseEvaluationFiltersProps) => {
  const [dateFilter, setDateFilter] = useState<DateFilter>({
    from: '',
    to: '',
  });
  const [departmentFilter, setDepartmentFilter] = useState<string[]>([]);

  const filterGroups: FilterGroup[] = useMemo(() => {
    const departments = getUniqueDepts(employeesResponded || []);
    return [
      {
        id: 'departments',
        title: 'Department',
        options: departments.map(dept => ({ label: dept, value: dept })),
        multiSelect: true,
        allowEmpty: true,
      },
    ];
  }, [employeesResponded, templateResponseDetails]);

  // Initialize department filter with all departments when template response details change
  useEffect(() => {
    if (templateResponseDetails?.employees_responded) {
      const allDepartments = getUniqueDepts(employeesResponded || []);
      setDepartmentFilter(allDepartments);
    }
  }, [templateResponseDetails, employeesResponded]);

  const handleDepartmentFilterChange = (filters: any) => {
    setDepartmentFilter(filters.departments || []);
  };

  const resetFilters = () => {
    setDateFilter({ from: '', to: '' });
    setDepartmentFilter([]);
  };

  return {
    dateFilter,
    setDateFilter,
    departmentFilter,
    setDepartmentFilter,
    filterGroups,
    handleDepartmentFilterChange,
    resetFilters,
  };
};

