import React from 'react'

const OnboardingTrackerLogo = () => {
  return (
    <svg width="73" height="73" viewBox="0 0 73 73" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Clipboard body */}
      <rect x="7" y="15" width="44" height="52" rx="4" fill="#355FD0" fillOpacity="0.12" stroke="#355FD0" strokeWidth="3"/>
      {/* Clip at top */}
      <rect x="20" y="8" width="18" height="11" rx="3" fill="#355FD0"/>
      {/* Checkmark row 1 */}
      <circle cx="20" cy="33" r="4" fill="#355FD0" fillOpacity="0.2" stroke="#355FD0" strokeWidth="1.5"/>
      <polyline points="17.5,33 19.5,35 22.5,31" stroke="#355FD0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="27" y1="33" x2="41" y2="33" stroke="#355FD0" strokeWidth="2.5" strokeLinecap="round"/>
      {/* Checkmark row 2 */}
      <circle cx="20" cy="43" r="4" fill="#355FD0" fillOpacity="0.2" stroke="#355FD0" strokeWidth="1.5"/>
      <polyline points="17.5,43 19.5,45 22.5,41" stroke="#355FD0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="27" y1="43" x2="41" y2="43" stroke="#355FD0" strokeWidth="2.5" strokeLinecap="round"/>
      {/* Empty row 3 */}
      <circle cx="20" cy="53" r="4" fill="none" stroke="#355FD0" strokeWidth="1.5" strokeDasharray="3 2"/>
      <line x1="27" y1="53" x2="36" y2="53" stroke="#355FD0" strokeWidth="2.5" strokeLinecap="round"/>
      {/* Progress badge */}
      <circle cx="57" cy="57" r="14" fill="white"/>
      <circle cx="57" cy="57" r="11" fill="#355FD0"/>
      <text x="57" y="61" textAnchor="middle" fontSize="10" fontWeight="bold" fill="white">%</text>
    </svg>
  )
}

export default OnboardingTrackerLogo
