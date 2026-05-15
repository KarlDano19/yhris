import { Metadata } from 'next';
import LpBlogContent from "@/components/pages/(un-auth)/blog/LpBlogContent";

export const metadata: Metadata = {
  title: 'Blog — HR Insights for Philippine Business Leaders | YAHSHUA HRIS',
  description: 'Practical guides on DOLE compliance, payroll, recruitment, and HR management for Philippine businesses. Written by the YAHSHUA HRIS team.',
  keywords: 'hr blog philippines, dole compliance guide, payroll tips, recruitment philippines, hr management',
  openGraph: {
    title: 'Blog — HR Insights for Philippine Business Leaders | YAHSHUA HRIS',
    description: 'Practical guides on DOLE compliance, payroll, recruitment, and HR management for Philippine businesses.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'YAHSHUA HRIS Blog — HR Insights',
    description: 'Practical HR guides for Philippine businesses.',
  },
  alternates: {
    canonical: 'https://yahshuahris.com/blog',
  },
};

const BlogPage = () => {
  return <LpBlogContent />;
};

export default BlogPage;
