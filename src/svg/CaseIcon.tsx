export default function CaseIcon({ className }: { className: any }) {
  return (
    <div className={className}>
      <svg
        viewBox="0 0 25 23"
        fill={className}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M15 4.84211V2.42105H10V4.84211H15ZM2.5 7.26316V20.5789H22.5V7.26316H2.5ZM22.5 4.84211C23.8875 4.84211 25 5.91947 25 7.26316V20.5789C25 21.9226 23.8875 23 22.5 23H2.5C1.1125 23 0 21.9226 0 20.5789L0.0125 7.26316C0.0125 5.91947 1.1125 4.84211 2.5 4.84211H7.5V2.42105C7.5 1.07737 8.6125 0 10 0H15C16.3875 0 17.5 1.07737 17.5 2.42105V4.84211H22.5Z"
        />
      </svg>
    </div>
  );
}
