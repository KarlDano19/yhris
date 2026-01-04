'use client';

import { useState } from 'react';
import { PencilIcon, CheckIcon } from '@heroicons/react/24/outline';

interface BasicInformation {
  fullName: string;
  email: string;
  phone: string;
  location: string;
}

interface ProfileProps {
  mode?: 'personal' | 'business';
  basicInfo?: BasicInformation;
  onSave?: (data: BasicInformation) => void;
}

const Profile = ({ 
  mode = 'personal',
  basicInfo = {
    fullName: 'John Doe',
    email: 'john.doe@email.com',
    phone: '+63 912 345 6789',
    location: 'Cagayan de Oro, Philippines',
  },
  onSave
}: ProfileProps) => {
  const [isEditingBasicInfo, setIsEditingBasicInfo] = useState(false);
  const [basicInfoData, setBasicInfoData] = useState<BasicInformation>(basicInfo);

  const handleBasicInfoEdit = () => {
    setIsEditingBasicInfo(true);
  };

  const handleBasicInfoSave = () => {
    if (onSave) {
      onSave(basicInfoData);
    }
    setIsEditingBasicInfo(false);
  };

  const handleBasicInfoChange = (field: keyof BasicInformation, value: string) => {
    setBasicInfoData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Basic Information Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-900">Basic Information</h2>
          <button
            onClick={isEditingBasicInfo ? handleBasicInfoSave : handleBasicInfoEdit}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label={isEditingBasicInfo ? 'Save changes' : 'Edit basic information'}
          >
            {isEditingBasicInfo ? (
              <CheckIcon className="h-5 w-5 text-green-600" />
            ) : (
              <PencilIcon className="h-5 w-5 text-gray-600" />
            )}
          </button>
        </div>

        <div className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            {isEditingBasicInfo ? (
              <input
                type="text"
                value={basicInfoData.fullName}
                onChange={(e) => handleBasicInfoChange('fullName', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-savoy-blue focus:border-transparent outline-none transition-all"
              />
            ) : (
              <p className="text-sm text-gray-900">{basicInfoData.fullName}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            {isEditingBasicInfo ? (
              <input
                type="email"
                value={basicInfoData.email}
                onChange={(e) => handleBasicInfoChange('email', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-savoy-blue focus:border-transparent outline-none transition-all"
              />
            ) : (
              <p className="text-sm text-gray-900">{basicInfoData.email}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            {isEditingBasicInfo ? (
              <input
                type="tel"
                value={basicInfoData.phone}
                onChange={(e) => handleBasicInfoChange('phone', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-savoy-blue focus:border-transparent outline-none transition-all"
              />
            ) : (
              <p className="text-sm text-gray-900">{basicInfoData.phone}</p>
            )}
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            {isEditingBasicInfo ? (
              <input
                type="text"
                value={basicInfoData.location}
                onChange={(e) => handleBasicInfoChange('location', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-savoy-blue focus:border-transparent outline-none transition-all"
              />
            ) : (
              <p className="text-sm text-gray-900">{basicInfoData.location}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

