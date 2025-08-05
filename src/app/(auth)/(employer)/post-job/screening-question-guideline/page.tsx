import React from 'react';
import ScreeningQuestionGuidelines from '@/components/pages/(auth)/employer/post-job/ScreeningQuestionGuidelines';

export const metadata = {
  title: 'Screening Question Guidelines - Yahshua HRIS',
  description: 'HRIS',
  alternates: {
    canonical: 'https://yahshuahris.com/screening-question-guideline'
  }
};

const ScreeningQuestionGuidelinePage = async () => {
  return <ScreeningQuestionGuidelines />;
};

export default ScreeningQuestionGuidelinePage;