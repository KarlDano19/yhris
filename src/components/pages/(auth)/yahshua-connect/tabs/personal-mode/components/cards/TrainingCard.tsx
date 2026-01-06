interface TrainingCardProps {
  title: string;
  duration: string;
  level: string;
  price: string;
  onStartCourse?: () => void;
}

const TrainingCard = ({ title, duration, level, price, onStartCourse }: TrainingCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
      <div className="mb-4">
        <h3 className="font-bold text-gray-900 mb-1">Recommended Training(s)</h3>
        <p className="text-sm text-gray-600">Start training to fill in knowledge & skill gaps.</p>
      </div>

      <div className="border-t border-gray-200 pt-4">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
            </svg>
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900">{title}</h4>
            <p className="text-xs text-gray-600 mb-2">
              {duration} | {level}
            </p>
            <div className="inline-block">
              <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">
                {price}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={onStartCourse}
          className="w-full bg-savoy-blue text-white py-2 px-4 rounded-lg font-medium text-sm hover:bg-blue-700 transition-colors"
        >
          Start Course
        </button>
      </div>
    </div>
  );
};

export default TrainingCard;

