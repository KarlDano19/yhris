import VsSproutContent from "@/components/pages/(un-auth)/(landing-page)/vs-sprout/VsSproutContent";
import PixelEvents from '@/components/PixelEvents';

export default function VsSprout() {
  return (
    <>
      <PixelEvents viewContent={{ content_name: 'YAHSHUA vs Sprout', content_category: 'comparison' }} />
      <VsSproutContent />
    </>
  );
}