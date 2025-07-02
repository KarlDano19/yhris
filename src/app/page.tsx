import React from 'react'
import { Metadata } from 'next'

import Content from "@/components/pages/(un-auth)/landing-page/Content";

export const metadata: Metadata = {
  alternates: {
    canonical: 'https://yahshuahris.com'
  }
};

const LandingPage = () => {
  return <Content />;
};

export default LandingPage;
