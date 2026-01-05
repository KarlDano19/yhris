import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { CheckCircleIcon as CheckCircleOutlineIcon } from '@heroicons/react/24/outline';

interface ChecklistItem {
  label: string;
  completed: boolean;
}

interface ProfileChecklistCardProps {
  items: ChecklistItem[];
  onCompleteProfile?: () => void;
}

const ProfileChecklistCard = ({ items, onCompleteProfile }: ProfileChecklistCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
      <h3 className="font-bold text-gray-900 mb-4">Your almost there!</h3>

      <div className="space-y-3 mb-4">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-3">
            {item.completed ? (
              <CheckCircleIcon className="h-5 w-5 text-green-500 flex-shrink-0" />
            ) : (
              <CheckCircleOutlineIcon className="h-5 w-5 text-gray-300 flex-shrink-0" />
            )}
            <span
              className={`text-sm ${
                item.completed ? 'text-gray-700 font-medium' : 'text-gray-500'
              }`}
            >
              {item.label}
            </span>
          </div>
        ))}
      </div>

      <button
        onClick={onCompleteProfile}
        className="w-full border border-savoy-blue text-savoy-blue py-2 px-4 rounded-lg font-medium text-sm hover:bg-blue-50 transition-colors"
      >
        Complete Profile
      </button>
    </div>
  );
};

export default ProfileChecklistCard;

