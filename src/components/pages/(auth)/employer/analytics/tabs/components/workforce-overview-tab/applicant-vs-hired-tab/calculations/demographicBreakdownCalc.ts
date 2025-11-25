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
    
    if (selectedJobFilter === 'All Jobs') {
      // For "All Jobs", consider both job posting regions and applicant addresses
      if (jobPostData?.records && Array.isArray(jobPostData.records)) {
        jobPostData.records.forEach((job: any) => {
          // Check advertise_to field (single region)
          if (job.advertise_to && validRegions && validRegions.includes(job.advertise_to)) {
            const regionGroup = getRegionGroup(job.advertise_to);
            if (regionGroup) {
              regionGroupCounts[regionGroup] = (regionGroupCounts[regionGroup] || 0) + 1;
            }
          }
          // Also check advertise_options field (multiple regions) if it exists
          if (job.advertise_options && Array.isArray(job.advertise_options)) {
            job.advertise_options.forEach((region: string) => {
              if (validRegions && validRegions.includes(region)) {
                const regionGroup = getRegionGroup(region);
                if (regionGroup) {
                  regionGroupCounts[regionGroup] = (regionGroupCounts[regionGroup] || 0) + 1;
                }
              }
            });
          }
        });
      }
    } else {
      // For specific jobs, use the job data from applicant records
      filteredApplicants.forEach((applicant: any) => {
        if (applicant.job_posting) {
          // Check advertise_to field (single region)
          if (applicant.job_posting.advertise_to && validRegions && validRegions.includes(applicant.job_posting.advertise_to)) {
            const regionGroup = getRegionGroup(applicant.job_posting.advertise_to);
            if (regionGroup) {
              regionGroupCounts[regionGroup] = (regionGroupCounts[regionGroup] || 0) + 1;
            }
          }
          // Also check advertise_options field (multiple regions) if it exists
          if (applicant.job_posting.advertise_options && Array.isArray(applicant.job_posting.advertise_options)) {
            applicant.job_posting.advertise_options.forEach((region: string) => {
              if (validRegions && validRegions.includes(region)) {
                const regionGroup = getRegionGroup(region);
                if (regionGroup) {
                  regionGroupCounts[regionGroup] = (regionGroupCounts[regionGroup] || 0) + 1;
                }
              }
            });
          }
        }
      });
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
  
    // Get top 3 most common region groups and sort by advertiseOptions order
    const sortedRegionGroups = Object.entries(regionGroupCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([regionGroup]) => regionGroup);
  
    // Sort regions by their order in advertiseOptions
    const advertiseOptions = [
      { label: 'Metro Manila' },
      { label: 'Luzon' },
      { label: 'Visayas' },
      { label: 'Mindanao' }
    ];
    
    const sortedByAdvertiseOrder = sortedRegionGroups.sort((a, b) => {
      const aIndex = advertiseOptions.findIndex(option => option.label === a);
      const bIndex = advertiseOptions.findIndex(option => option.label === b);
      return aIndex - bIndex;
    });
  
    const mostCommonRegions = sortedByAdvertiseOrder.length > 0 ? sortedByAdvertiseOrder.map(region => region.replace(/^- | -$/g, '')) : ['N/A'];
  
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
    const maxAgeCount = Math.max(...Object.values(ageGroups).map(count => count as number));
    const mostCommonAgeGroup = Object.entries(ageGroups)
      .filter(([_, count]) => (count as number) === maxAgeCount)
      .map(([ageGroup]) => ageGroup)
      .filter(ageGroup => ageGroup !== 'Unknown')[0] || 'N/A';
  
    return {
      femalePercentage,
      malePercentage,
      mostCommonRegion: mostCommonRegions.length > 0 ? mostCommonRegions.join(', ') : 'N/A',
      mostCommonAgeGroup
    };
  }; 