 'use client';

import YahshuaHRISLogo from '@/svg/YahshuaHRISLogo';

type YahshuaLoadingLogoProps = {
  size?: number; // px
  durationMs?: number;
};

export default function YahshuaLoadingLogo({
  size = 96,
  durationMs = 1600,
}: YahshuaLoadingLogoProps) {
  const scale = size / 76;

  return (
    <div style={{ width: size, height: size, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 76 75"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
        className="yahshua-logo"
      >
        {/* Each path is treated as a separate piece and will animate from a scattered state into place */}
        <path className="piece p1" d="M57.289 72.6841C59.4316 69.5962 59.4316 64.5898 57.289 61.5018C55.1465 58.414 51.6728 58.414 49.5302 61.5018C47.3877 64.5898 47.3877 69.5962 49.5302 72.6841C51.6728 75.772 55.1465 75.772 57.289 72.6841Z" fill="#FFC107"/>
        <path className="piece p2" d="M28.1944 40.6346C31.4081 36.0027 31.4081 28.4932 28.1944 23.8612C24.9805 19.2295 19.7701 19.2295 16.5563 23.8612C13.3426 28.4932 13.3426 36.0027 16.5563 40.6346C19.7701 45.2663 24.9805 45.2663 28.1944 40.6346Z" fill="#FFC107"/>
        <path className="piece p3" d="M42.7422 57.6476C45.4202 53.7878 45.4202 47.5297 42.7422 43.6699C40.064 39.81 35.7219 39.81 33.0437 43.6699C30.3657 47.5297 30.3657 53.7878 33.0437 57.6476C35.7219 61.5074 40.064 61.5074 42.7422 57.6476Z" fill="#FFC107"/>
        <path className="piece p4" d="M11.707 57.6476C14.3851 53.7878 14.3851 47.5297 11.707 43.6699C9.02884 39.81 4.68673 39.81 2.0086 43.6699C-0.669534 47.5297 -0.669535 53.7878 2.0086 57.6476C4.68673 61.5074 9.02884 61.5074 11.707 57.6476Z" fill="#FFC107"/>
        <path className="piece p5" d="M26.2543 72.6841C28.3968 69.5962 28.3968 64.5898 26.2543 61.5018C24.1117 58.4141 20.638 58.4141 18.4956 61.5018C16.353 64.5898 16.353 69.5962 18.4956 72.6841C20.638 75.772 24.1117 75.772 26.2543 72.6841Z" fill="#FFC107"/>
        <path className="piece p6" d="M73.7768 57.6476C76.4548 53.7878 76.4548 47.5297 73.7768 43.6699C71.0986 39.81 66.7565 39.81 64.0783 43.6699C61.4003 47.5297 61.4003 53.7878 64.0783 57.6476C66.7565 61.5074 71.0986 61.5074 73.7768 57.6476Z" fill="#FFC107"/>
        <path className="piece p7" d="M43.7115 20.2473C46.9252 15.6154 46.9252 8.10562 43.7115 3.47391C40.4978 -1.15801 35.2872 -1.15801 32.0735 3.47391C28.8596 8.10562 28.8596 15.6154 32.0735 20.2473C35.2872 24.879 40.4978 24.879 43.7115 20.2473Z" fill="#FFC107"/>
        <path className="piece p8" d="M59.2287 40.6346C62.4426 36.0027 62.4426 28.4932 59.2287 23.8612C56.015 19.2295 50.8046 19.2295 47.5907 23.8612C44.377 28.4932 44.377 36.0027 47.5907 40.6346C50.8046 45.2663 56.015 45.2663 59.2287 40.6346Z" fill="#FFC107"/>
      </svg>

      <style jsx>{`
        .yahshua-logo { overflow: visible; }
        .piece {
          transform-origin: center;
          opacity: 0;
          --d: ${durationMs}ms;
          animation-name: assemble;
          animation-duration: var(--d);
          animation-timing-function: cubic-bezier(.2,.9,.2,1);
          animation-iteration-count: infinite;
          animation-direction: normal;
          animation-fill-mode: both;
        }

        /* individual start transforms and delays */
        .p1 { --start: translate(-40px,-28px) rotate(-22deg) scale(0.8); animation-delay: 0ms; }
        .p2 { --start: translate(36px,-36px) rotate(18deg) scale(0.85); animation-delay: 80ms; }
        .p3 { --start: translate(-32px,38px) rotate(14deg) scale(0.82); animation-delay: 160ms; }
        .p4 { --start: translate(38px,44px) rotate(-12deg) scale(0.86); animation-delay: 240ms; }
        .p5 { --start: translate(-50px,10px) rotate(28deg) scale(0.8); animation-delay: 320ms; }
        .p6 { --start: translate(50px,12px) rotate(-30deg) scale(0.8); animation-delay: 400ms; }
        .p7 { --start: translate(0px,-64px) rotate(6deg) scale(0.9); animation-delay: 480ms; }
        .p8 { --start: translate(0px,64px) rotate(-6deg) scale(0.9); animation-delay: 560ms; }

        @keyframes assemble {
          0% {
            transform: var(--start);
            opacity: 0;
            filter: blur(2px) saturate(0.8);
          }
          45% {
            transform: translate(0,0) rotate(0) scale(1.02);
            opacity: 1;
            filter: drop-shadow(0 6px 14px rgba(0,0,0,0.12)) saturate(1.05);
          }
          65% {
            transform: translate(0,0) rotate(0) scale(0.98);
            opacity: 1;
            filter: none;
          }
          100% {
            transform: var(--start);
            opacity: 0;
            filter: none;
          }
        }
      `}</style>
    </div>
  );
}

