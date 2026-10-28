const ShareArrowIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      className={className}
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth={2}
      strokeLinejoin='round'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path d='M14 4L21 11L14 18V14C9 14 5.5 15.5 3 20C3.5 13 7 8.5 14 8V4Z' />
    </svg>
  );
};

export default ShareArrowIcon;
