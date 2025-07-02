import { Golos_Text } from 'next/font/google';
import Script from 'next/script';
import 'react-quill/dist/quill.snow.css';

import { Toaster } from 'react-hot-toast';

import ReactQueryWrapper from '@/app/reactQueryWrapper';
import Auth from '@/app/auth';

import './quill-tooltips.css';
import './globals.css';

export const metadata = {
  title: 'Yahshua HRIS',
  description: 'HRIS',
};

const golos_text = Golos_Text({ subsets: ['latin'], display: 'swap', adjustFontFallback: false });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body className={`${golos_text.className}`}>
        <ReactQueryWrapper>
          <Auth>{children}</Auth>
        </ReactQueryWrapper>
        <Toaster position='top-right' />
        
        {/* HubSpot */}
        <Script
          id="hs-script-loader"
          src="//js-na1.hs-scripts.com/23359629.js"
          strategy="afterInteractive"
        />
        
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-0B8QK4ZCEJ"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-0B8QK4ZCEJ');
          `}
        </Script>
        
        {/* LinkedIn Insights */}
        <Script id="linkedin-insights-init" strategy="afterInteractive">
          {`
            _linkedin_partner_id = "7401380";
            window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
            window._linkedin_data_partner_ids.push(_linkedin_partner_id);
          `}
        </Script>
        <Script
          id="linkedin-insights"
          src="https://snap.licdn.com/li.lms-analytics/insight.min.js"
          strategy="afterInteractive"
        />
        
        <noscript>
          <img height="1" width="1" style={{display: 'none'}} alt="" src="https://px.ads.linkedin.com/collect/?pid=7401380&fmt=gif" />
        </noscript>
      </body>
    </html>
  );
}
