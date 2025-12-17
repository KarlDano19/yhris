'use client';

interface ProfileCardProps {
  name: string;
  title: string;
  initial: string;
  profileCompletion: number;
}

const ProfileCard = ({ name, title, initial, profileCompletion }: ProfileCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Cover Image */}
      <div className="h-24 bg-gradient-to-r from-blue-400 to-cyan-300 relative">
        <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
          <div className="w-24 h-24 rounded-full border-4 border-white bg-gray-200 overflow-hidden">
            <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-3xl font-bold">
              {initial}
            </div>
          </div>
        </div>
      </div>

      {/* Profile Info */}
      <div className="pt-14 px-6 pb-6 text-center">
        <h3 className="text-lg font-bold text-indigo-dye mb-1">{name}</h3>
        <p className="text-sm text-gray-600 mb-3">{title}</p>

        {/* Profile Completion */}
        <div className="bg-yellow-50 rounded-lg p-3 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-700">Profile Completion</span>
            <span className="text-xs font-bold text-yellow-600">{profileCompletion}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-yellow-400 h-2 rounded-full transition-all"
              style={{ width: `${profileCompletion}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;

