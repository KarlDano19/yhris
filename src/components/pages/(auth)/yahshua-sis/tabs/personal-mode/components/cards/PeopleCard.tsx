'use client';

interface Person {
  id: number;
  name: string;
  title: string;
  initials: string;
  color: string;
}

interface PeopleCardProps {
  people: Person[];
  onConnect?: (personId: number) => void;
}

const PeopleCard = ({ people, onConnect }: PeopleCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
      <h3 className="font-bold text-gray-900 mb-4">People You May Know</h3>

      <div className="space-y-4">
        {people.map((person) => (
          <div key={person.id} className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-full ${person.color} flex items-center justify-center text-white font-semibold text-sm flex-shrink-0`}
            >
              {person.initials}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-gray-900 truncate">{person.name}</h4>
              <p className="text-xs text-gray-600 truncate">{person.title}</p>
            </div>
            <button
              onClick={() => onConnect?.(person.id)}
              className="px-3 py-1 border border-savoy-blue text-savoy-blue text-xs rounded-lg font-medium hover:bg-blue-50 transition-colors whitespace-nowrap"
            >
              Connect +
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PeopleCard;

