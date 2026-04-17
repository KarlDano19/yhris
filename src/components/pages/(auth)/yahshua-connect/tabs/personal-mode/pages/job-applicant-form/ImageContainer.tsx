import Image from 'next/image';

function ImageContainer({ profilePhoto }: { profilePhoto: string | null }) {
  return (
    <>
      <Image
        src={profilePhoto || '/assets/no-user.png'}
        width={143}
        height={155}
        priority={true}
        alt='profile-logo'
        className='rounded object-cover max-w-[143px] h-[155px]'
      />
    </>
  );
}

export default ImageContainer;
