/**
 * Utility to handle oklch color format compatibility
 * This polyfill helps with browsers and libraries that don't support oklch colors
 */

const initColorPolyfill = () => {
  // Check if we need to add a warning class to the body
  const needsPolyfill = !CSS.supports('color', 'oklch(0.5 0.2 0)');
  
  if (needsPolyfill) {
    console.warn('OKLCH color format is not supported in this environment. Using fallback colors.');
    document.body.classList.add('no-oklch-support');
    
    // Add a style element with fallback colors
    const styleEl = document.createElement('style');
    styleEl.textContent = `
      .no-oklch-support * {
        /* Ensure text is readable */
        color: black !important;
      }
      
      /* Add specific overrides for different color values as needed */
      .no-oklch-support .text-black {
        color: #000000 !important;
      }
      
      .no-oklch-support .bg-white {
        background-color: #FFFFFF !important;
      }
      
      /* Add more fallbacks as needed for your specific design */
    `;
    document.head.appendChild(styleEl);
  }
  
  return needsPolyfill;
};

export default initColorPolyfill;