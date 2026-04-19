import React from 'react'

const OnboardingTrackerLogo = () => {
  return (
    <svg width="84" height="96" viewBox="0 0 84 96" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Clipboard body */}
      <rect x="6" y="12" width="69" height="83" rx="8" fill="#355FD0"/>
      <rect x="15" y="22" width="51" height="63" rx="5" fill="white"/>
      {/* Clip holder */}
      <rect x="24" y="3" width="36" height="23" rx="7" fill="#355FD0"/>
      <rect x="30" y="8" width="24" height="11" rx="3" fill="white"/>
      {/* Row 1 — completed */}
      <circle cx="25" cy="35" r="8" fill="#355FD0"/>
      <path d="M22 35 L24.5 38 L28 32" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="37" y="31" width="24" height="8" rx="4" fill="#355FD0"/>
      {/* Row 2 — completed */}
      <circle cx="25" cy="52" r="8" fill="#355FD0"/>
      <path d="M22 52 L24.5 55 L28 49" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="37" y="48" width="24" height="8" rx="4" fill="#355FD0"/>
      {/* Row 3 — pending */}
      <circle cx="25" cy="69" r="7" stroke="#355FD0" strokeWidth="3.5" fill="white"/>
      <rect x="37" y="65" width="16" height="8" rx="4" fill="#355FD0"/>
    </svg>
  )
}

export default OnboardingTrackerLogo
