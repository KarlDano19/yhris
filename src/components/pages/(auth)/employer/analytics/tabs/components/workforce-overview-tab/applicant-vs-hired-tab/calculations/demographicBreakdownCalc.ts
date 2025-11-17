// Utility functions for demographic breakdown calculations

export interface DemographicDataItem {
    demographic: string;
    details: string;
  }
  
  export interface DemographicBreakdownData {
    femalePercentage: string;
    malePercentage: string;
    mostCommonRegion: string;
    mostCommonAgeGroup: string;
  }
  
  // Helper function to get region group
  const getRegionGroup = (region: string): string | null => {
    const regionGroups = {
      'Metro Manila': 'Metro Manila',
      'Luzon': 'Luzon',
      'Visayas': 'Visayas',
      'Mindanao': 'Mindanao'
    };
    
    // Try exact match first
    if (regionGroups[region as keyof typeof regionGroups]) {
      return regionGroups[region as keyof typeof regionGroups];
    }
    
    // Try partial match
    for (const [group, label] of Object.entries(regionGroups)) {
      if (region.toLowerCase().includes(group.toLowerCase())) {
        return label;
      }
    }
    
    return null;
  };
  
  export const calculateDemographicBreakdown = (
    appliedApplicantsData?: any[],
    jobPostData?: any,
    validRegions?: string[],
    selectedJobFilter?: string
  ): DemographicBreakdownData => {
    if (!appliedApplicantsData || !Array.isArray(appliedApplicantsData) || appliedApplicantsData.length === 0) {
      return {
        femalePercentage: '0%',
        malePercentage: '0%',
        mostCommonRegion: 'N/A',
        mostCommonAgeGroup: 'N/A'
      };
    }
  
    // Use applicants data passed from parent
    const filteredApplicants = appliedApplicantsData;
  
    const totalApplicants = filteredApplicants.length;
    if (totalApplicants === 0) {
      return {
        femalePercentage: '0%',
        malePercentage: '0%',
        mostCommonRegion: 'N/A',
        mostCommonAgeGroup: 'N/A'
      };
    }
  
    // Calculate gender distribution
    const genderCounts = filteredApplicants.reduce((acc: any, applicant: any) => {
      const gender = applicant.applicant?.gender || 'Unknown';
      acc[gender] = (acc[gender] || 0) + 1;
      return acc;
    }, {});
  
    const femaleCount = genderCounts['Female'] || 0;
    const maleCount = genderCounts['Male'] || 0;
    const femalePercentage = totalApplicants > 0 ? `${((femaleCount / totalApplicants) * 100).toFixed(0)}%` : '0%';
    const malePercentage = totalApplicants > 0 ? `${((maleCount / totalApplicants) * 100).toFixed(0)}%` : '0%';
  
  // Calculate most common regions using the same logic as DemographicBreakdown
  const regionGroupCounts: { [key: string]: number } = {};

  const incrementRegion = (region: string | undefined) => {
    if (!region || !validRegions || !validRegions.includes(region)) {
      return;
    }
    const regionGroup = getRegionGroup(region);
    if (regionGroup) {
      regionGroupCounts[regionGroup] = (regionGroupCounts[regionGroup] || 0) + 1;
    }
  };

  const incrementRegionsArray = (regions?: string[]) => {
    if (!regions || !Array.isArray(regions)) {
      return;
    }
    regions.forEach((region) => incrementRegion(region));
  };

  const processJobPosting = (job: any) => {
    if (!job) {
      return;
    }
    incrementRegion(job.advertise_to);
    incrementRegionsArray(job.advertise_options);
  };

  if (selectedJobFilter === 'All Jobs') {
    jobPostData?.records?.forEach(processJobPosting);
  } else {
    // For specific jobs, use the job data from applicant records
    filteredApplicants.forEach((applicant: any) => {
      if (applicant.job_posting) {
        processJobPosting(applicant.job_posting);
      }
    });

    // Also include the matching job posting from jobPostData if available
    const matchingJob =
      jobPostData?.records && Array.isArray(jobPostData.records)
        ? jobPostData.records.find(
            (job: any) => job.job_title === selectedJobFilter || job.id === selectedJobFilter
          )
        : null;

    if (matchingJob) {
      processJobPosting(matchingJob);
    }
  }
    
    // Always consider applicant addresses for region analysis
    filteredApplicants.forEach((applicant: any) => {
      // Handle different data structures - check both possible paths
      let address = '';
      
      // Try different possible paths for address
      if (applicant.applicant?.address) {
        address = applicant.applicant.address;
      } else if (applicant.address) {
        address = applicant.address;
      } else if (applicant.applicant_application_form?.address) {
        address = applicant.applicant_application_form.address;
      }
      
      if (address && validRegions) {
        // Try to match address with valid regions
        const matchedRegion = validRegions.find(region => 
          address.toLowerCase().includes(region.toLowerCase())
        );
        if (matchedRegion) {
          const regionGroup = getRegionGroup(matchedRegion);
          if (regionGroup) {
            regionGroupCounts[regionGroup] = (regionGroupCounts[regionGroup] || 0) + 1;
          }
        }
      }
    });
  
  const regionEntries = Object.entries(regionGroupCounts) as Array<[string, number]>;
  let mostCommonRegions: string[] = ['N/A'];

  if (regionEntries.length > 0) {
    const maxRegionCount = Math.max(...regionEntries.map(([, count]) => count));
    const advertiseOrder = ['Metro Manila', 'Luzon', 'Visayas', 'Mindanao'];

    const tiedRegions = regionEntries
      .filter(([, count]) => count === maxRegionCount)
      .map(([region, count]) => ({ region, count }));

    tiedRegions.sort((a, b) => {
      const aIndex = advertiseOrder.indexOf(a.region);
      const bIndex = advertiseOrder.indexOf(b.region);
      return (aIndex === -1 ? Number.MAX_SAFE_INTEGER : aIndex) - (bIndex === -1 ? Number.MAX_SAFE_INTEGER : bIndex);
    });

    mostCommonRegions = tiedRegions.map(({ region, count }) => `${region} (${count})`);
  }
  
  // Calculate age distribution dynamically from birth_date
  const ageGroups = filteredApplicants.reduce((acc: any, applicant: any) => {
    let age = null;
    
    // Calculate age from birth_date (prioritize this method)
    if (applicant.applicant?.birth_date) {
      const birthDate = new Date(applicant.applicant.birth_date);
      const today = new Date();
      age = today.getFullYear() - birthDate.getFullYear();
      
      // Adjust for cases where birthday hasn't occurred this year
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
    }
    // Fallback to stored age field if birth_date is not available
    else if (applicant.applicant?.age) {
      age = applicant.applicant.age;
    }
    
    if (age && age > 0) {
      let ageGroup;
      if (age >= 18 && age <= 25) ageGroup = '18-25';
      else if (age >= 26 && age <= 35) ageGroup = '26-35';
      else if (age >= 36 && age <= 45) ageGroup = '36-45';
      else if (age >= 46 && age <= 55) ageGroup = '46-55';
      else if (age >= 56) ageGroup = '56+';
      else ageGroup = 'Unknown';

      acc[ageGroup] = (acc[ageGroup] || 0) + 1;
    }
    return acc;
  }, {});

  // Find the most common age group
  const ageEntries = Object.entries(ageGroups) as Array<[string, number]>;
  let mostCommonAgeGroup = 'N/A';

  if (ageEntries.length > 0) {
    const maxAgeCount = Math.max(...ageEntries.map(([, count]) => count));
    const ageOrder = ['18-25', '26-35', '36-45', '46-55', '56+', 'Unknown'];

    const tiedAgeGroups = ageEntries
      .filter(([, count]) => count === maxAgeCount)
      .map(([ageGroup, count]) => ({ ageGroup, count }));

    const prioritizedAgeGroups = tiedAgeGroups.filter(({ ageGroup }) => ageGroup !== 'Unknown');
    const groupsToDisplay = prioritizedAgeGroups.length > 0 ? prioritizedAgeGroups : tiedAgeGroups;

    groupsToDisplay.sort((a, b) => {
      const aIndex = ageOrder.indexOf(a.ageGroup);
      const bIndex = ageOrder.indexOf(b.ageGroup);
      return (aIndex === -1 ? Number.MAX_SAFE_INTEGER : aIndex) - (bIndex === -1 ? Number.MAX_SAFE_INTEGER : bIndex);
    });

    mostCommonAgeGroup = groupsToDisplay.length > 0
      ? groupsToDisplay
          .map(({ ageGroup, count }) => `${ageGroup} (${count} applicant${count === 1 ? '' : 's'})`)
          .join(', ')
      : 'N/A';
  }
  
    return {
      femalePercentage,
      malePercentage,
      mostCommonRegion: mostCommonRegions.length > 0 ? mostCommonRegions.join(', ') : 'N/A',
      mostCommonAgeGroup
    };
  }; 