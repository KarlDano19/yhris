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
    return firstInitial + lastInitial || '';
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

  // Calculate border radius based on className
  // Tailwind CSS uses rem units, we'll convert based on standard 16px base
  const getBorderRadius = () => {
    // Circular avatar
    if (className.includes('rounded-full')) {
      return Math.min(width, height) / 2; // Makes it a perfect circle
    }
    
    // Square avatars with different rounded corner sizes
    // Tailwind CSS rounded classes (in rem, converted to pixels at 16px base)
    // We'll use a ratio that works well for most sizes
    const baseSize = Math.min(width, height);
    
    if (className.includes('rounded-3xl')) {
      return baseSize * (24 / 96); // 24px for 96px = 0.25 ratio
    }
    if (className.includes('rounded-2xl')) {
      return baseSize * (16 / 96); // 16px for 96px = 0.167 ratio
    }
    if (className.includes('rounded-xl')) {
      return baseSize * (12 / 96); // 12px for 96px = 0.125 ratio
    }
    if (className.includes('rounded-lg')) {
      return baseSize * (8 / 96); // 8px for 96px = 0.0833 ratio (0.5rem)
    }
    if (className.includes('rounded-md')) {
      return baseSize * (6 / 96); // 6px for 96px = 0.0625 ratio (0.375rem)
    }
    if (className.includes('rounded-sm')) {
      return baseSize * (2 / 96); // 2px for 96px = 0.0208 ratio (0.125rem)
    }
    if (className.includes('rounded')) {
      return baseSize * (4 / 96); // 4px for 96px = 0.0417 ratio (0.25rem)
    }
    
    // Default: slight rounding for square avatars
    return baseSize * 0.1;
  };

  const borderRadius = getBorderRadius();

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block', width: '100%', height: '100%' }}
    >
      {/* Background circle/rectangle */}
      <rect
        width={width}
        height={height}
        rx={borderRadius}
        ry={borderRadius}
        fill={bgColor}
      />
      
      {initials ? (
        // Show initials using SVG text (much more reliable for html2canvas)
        <text
          x={width / 2}
          y={height / 2}
          textAnchor="middle"
          dominantBaseline="central"
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