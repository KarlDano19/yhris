import MainHeader from '@/components/MainHeader';
import UnauthorizedHeader from '@/components/applicant-side-headers/UnauthorizedHeader';
import AuthorizedHeader from '@/components/applicant-side-headers/AuthorizedHeader';

function Header({ type }: { type: string }) {
  return (
    <>
      <UnauthorizedHeader />
      {type === 'employer' && <MainHeader />}
      {type === 'applicant' && <AuthorizedHeader />}
    </>
  );
}

export default Header;
