import React from 'react';

interface PlaceholderAvatarProps {
  width?: number;
  height?: number;
  className?: string;
  firstName?: string;
  lastName?: string;
}

const PlaceholderAvatar: React.FC<PlaceholderAvatarProps> = ({
  width = 100,
  height = 100,
  className = '',
  firstName = '',
  lastName = '',
}) => {
  // Generate initials from first and last name
  const getInitials = () => {
    const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : '';
    const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : '';
    return firstInitial + lastInitial || 'U'; // Default to 'U' for User if no names
  };

  // Generate a consistent color based on the name
  const getAvatarColor = () => {
    const colors = [
      '#3B82F6', // Blue
      '#10B981', // Emerald
      '#F59E0B', // Amber
      '#EF4444', // Red
      '#8B5CF6', // Violet
      '#06B6D4', // Cyan
      '#84CC16', // Lime
      '#F97316', // Orange
      '#EC4899', // Pink
      '#6366F1', // Indigo
    ];
    
    const name = (firstName + lastName).toLowerCase();
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const initials = getInitials();
  const bgColor = getAvatarColor();
  const fontSize = Math.max(width, height) * 0.45;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background circle/rectangle */}
      <rect
        width={width}
        height={height}
        rx={className.includes('rounded-full') ? width / 2 : width * 0.15}
        fill={bgColor}
      />
      
      {initials ? (
        // Show initials using SVG text (much more reliable for html2canvas)
        <text
          x="50%"
          y="50%"
          dy="0.1em"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="white"
          fontSize={fontSize}
          fontWeight="700"
          fontFamily="system-ui, -apple-system, sans-serif"
          style={{ userSelect: 'none' }}
        >
          {initials}
        </text>
      ) : (
        // Show person icon if no names available
        <g transform={`translate(${width * 0.2}, ${height * 0.2})`}>
          <svg
            width={width * 0.6}
            height={height * 0.6}
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z"
              fill="white"
              fillOpacity="0.8"
            />
            <path
              d="M12 14C7.58172 14 4 17.5817 4 22H20C20 17.5817 16.4183 14 12 14Z"
              fill="white"
              fillOpacity="0.8"
            />
          </svg>
        </g>
      )}
    </svg>
  );
};

export default PlaceholderAvatar;