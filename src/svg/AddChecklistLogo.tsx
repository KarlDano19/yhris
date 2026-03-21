import React from 'react'

const AddChecklistLogo = () => {
  return (
    <svg width="73" height="73" viewBox="0 0 73 73" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Clipboard body */}
      <rect x="7" y="15" width="44" height="52" rx="4" fill="#355FD0" fillOpacity="0.12" stroke="#355FD0" strokeWidth="3"/>
      {/* Clip at top */}
      <rect x="20" y="8" width="18" height="11" rx="3" fill="#355FD0"/>
      {/* Text lines */}
      <line x1="17" y1="33" x2="41" y2="33" stroke="#355FD0" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="17" y1="43" x2="41" y2="43" stroke="#355FD0" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="17" y1="53" x2="32" y2="53" stroke="#355FD0" strokeWidth="2.5" strokeLinecap="round"/>
      {/* Plus badge */}
      <circle cx="57" cy="57" r="14" fill="white"/>
      <circle cx="57" cy="57" r="11" fill="#355FD0"/>
      <line x1="57" y1="51" x2="57" y2="63" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="51" y1="57" x2="63" y2="57" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  )
}

export default AddChecklistLogo
