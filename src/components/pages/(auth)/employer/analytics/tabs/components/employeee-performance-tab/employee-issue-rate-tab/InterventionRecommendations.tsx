import React from 'react';

const InterventionRecommendations: React.FC = () => {
  const recommendations = [
    {
      category: 'For Tardiness (Repeated Cases)',
      recommendation: 'Implement attendance incentive program.'
    },
    {
      category: 'For Poor Performance',
      recommendation: 'Enroll employees in targeted training + bi-weekly check-ins.'
    },
    {
      category: 'For Insubordination',
      recommendation: 'Provide conflict resolution training for affected teams.'
    },
    {
      category: 'Employee (Mia Reyes)',
      recommendation: 'Weekly check-ins with supervisor + HR follow-up in 30 days.'
    }
  ];

  return (
    <div className="bg-white p-6 rounded-lg border-2 border-dashed border-[#A8B5C7]">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Intervention Recommendations</h3>
      
      <ul className="space-y-3">
        {recommendations.map((item, index) => (
          <li key={index} className="flex items-start">
            <span className="text-gray-400 mr-3 mt-1">•</span>
            <div>
              <span className="font-semibold text-gray-900">{item.category}:</span>
              <span className="text-gray-700 ml-1">{item.recommendation}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default InterventionRecommendations;
