const SplitLayout = ({
  left,
  right,
  leftBG,
}: {
  left: any;
  right: any;
  leftBG: any;
}) => {
  return (
    <div className='flex flex-wrap sm:flex-row-reverse items-stretch h-screen'>
      <div
        className='w-full md:w-1/2 xl:w-3/5 bg-cover flex'
        style={{ backgroundImage: `url('${leftBG.src}')` }}
      >
        {left}
      </div>
      <div className='bg-white w-full flex-1 bg-blue-lightest p-4'>
        {right}
      </div>
    </div>
  );
};

export default SplitLayout;
