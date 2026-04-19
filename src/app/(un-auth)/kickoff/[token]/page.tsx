import Content from '@/components/pages/(un-auth)/kickoff/Content';

export const metadata = {
  title: 'Client Kick-off | YAHSHUA HRIS',
  description: 'Complete your YAHSHUA HRIS kick-off acknowledgement',
};

const KickoffPage = ({ params }: { params: { token: string } }) => {
  return <Content token={params.token} />;
};

export default KickoffPage;
