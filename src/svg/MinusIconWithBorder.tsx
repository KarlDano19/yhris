import React from 'react'

interface MinusIconWithBorderProps {
    className?: string;
}

const MinusIconWithBorder: React.FC<MinusIconWithBorderProps> = ({ className = "w-6 h-6" }) => {
  return (
    <svg 
      width="39" 
      height="39" 
      viewBox="0 0 39 39" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect 
        x="0.5" 
        y="0.5" 
        width="37.9423" 
        height="37.9423" 
        rx="4.5" 
        stroke="#ACB9CB"
        fill="none"
      />
      <rect 
        x="12" 
        y="18.5" 
        width="15" 
        height="2" 
        fill="#2C3F58"
      />
    </svg>
  )
}

export default MinusIconWithBorder 