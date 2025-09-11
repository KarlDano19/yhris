import React from 'react'

interface CircleArrowLeftIconProps {
    className?: string;
}

const CircleArrowLeftIcon: React.FC<CircleArrowLeftIconProps> = ({ className = "w-6 h-6" }) => {
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
                rx="18.9712" 
                stroke="#ACB9CB"
                fill="none"
            />
            <path 
                d="M23.5 12.5L15.5 19.5L23.5 26.5" 
                stroke="#2C3F58" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
            />
        </svg>
    )
}

export default CircleArrowLeftIcon 