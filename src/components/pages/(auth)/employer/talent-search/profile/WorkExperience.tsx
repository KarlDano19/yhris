'use client';

import React from 'react';

interface WorkExperienceItem {
  id?: number;
  position: string;
  majorRole?: string;
  companyOrg: string;
  dateFrom: string;
  dateTo: string;
  description?: string;
  responsibilities?: string; // Now contains HTML content
}

interface WorkExperienceProps {
  workExperience: WorkExperienceItem[];
}

function WorkExperience({ workExperience }: WorkExperienceProps) {
  if (!workExperience || workExperience.length === 0) {
    return (
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-4">Work Experience</h3>
        <div className="text-center text-gray-500 py-8">
          <p>No work experience available</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Work Experience</h3>
      <div className="space-y-6">
        {workExperience.map((experience, index) => (
          <div key={experience.id || index} className="border-l-4 border-blue-500 pl-4">
            <div className="mb-2">
              <h4 className="font-semibold text-lg text-gray-800">
                {experience.position}
              </h4>
              {experience.majorRole && (
                <p className="text-gray-600 font-medium text-sm">
                  {experience.majorRole}
                </p>
              )}
              <p className="text-blue-600 font-medium">
                {experience.companyOrg}
              </p>
              <p className="text-sm text-gray-500">
                {new Date(experience.dateFrom).toLocaleDateString('en-US', {
                  month: 'long',
                  year: 'numeric',
                })}{' '}
                -{' '}
                {experience.dateTo === 'Present' || experience.dateTo === 'present' || experience.dateTo === ''
                  ? 'Present'
                  : new Date(experience.dateTo).toLocaleDateString('en-US', {
                      month: 'long',
                      year: 'numeric',
                    })}
              </p>
            </div>
            
            {experience.description && (
              <div className="mb-3">
                <p className="text-gray-700 text-sm leading-relaxed">
                  {experience.description}
                </p>
              </div>
            )}
            
            {experience.responsibilities && (
              <div>
                <h5 className="font-medium text-gray-800 mb-2">Key Responsibilities:</h5>
                <div 
                  className="text-sm text-gray-700 [&>ul]:list-disc [&>ul]:list-inside [&>ul]:space-y-1 [&>ul>li]:text-gray-700"
                  dangerouslySetInnerHTML={{ __html: experience.responsibilities }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default WorkExperience;
