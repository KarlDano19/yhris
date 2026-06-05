import { Golos_Text } from 'next/font/google';
import Script from 'next/script';
import 'react-quill/dist/quill.snow.css';

import { Toaster } from 'react-hot-toast';

import { PostHogProvider } from '@/components/PostHogProvider';
import GlobalErrorHandler from '@/components/GlobalErrorHandler';
import ReactQueryWrapper from '@/app/reactQueryWrapper';
import GlobalLoadingSpinner from '@/components/GlobalLoadingSpinner';
import Auth from '@/app/auth';
import PixelEvents from '@/components/PixelEvents';
import NetworkStatusWatcher from '@/components/NetworkStatusWatcher';

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
        <PostHogProvider>
          <GlobalErrorHandler />
          <ReactQueryWrapper>
            <GlobalLoadingSpinner />
            <Auth>{children}</Auth>
          </ReactQueryWrapper>
          <PixelEvents />
          <NetworkStatusWatcher />
          <Toaster position='top-right' />
          
          {/* Google Tag Manager */}
          <Script id="google-tag-manager" strategy="afterInteractive">
            {`
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-MMRM9NHW');
            `}
          </Script>
          
          {/* Google Analytics */}
          <Script
            src="https://www.googletagmanager.com/gtag/js?id=G-WJXTBQ5XYH"
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-WJXTBQ5XYH');
            `}
          </Script>
          
          {/* Meta Pixel */}
          <Script id="meta-pixel" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '2144124972722813');
              fbq('track', 'PageView');
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
          
          {/* Google Tag Manager (noscript) */}
          <noscript>
            <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-MMRM9NHW"
            height="0" width="0" style={{display:'none',visibility:'hidden'}}></iframe>
          </noscript>
          
          <noscript>
            <img height="1" width="1" style={{display:'none'}} alt="" src="https://www.facebook.com/tr?id=2144124972722813&ev=PageView&noscript=1" />
          </noscript>
          
          <noscript>
            <img height="1" width="1" style={{display:'none'}} alt="" src="https://www.facebook.com/tr?id=1275455147702466&ev=PageView&noscript=1" />
          </noscript>
          
          <noscript>
            <img height="1" width="1" style={{display: 'none'}} alt="" src="https://px.ads.linkedin.com/collect/?pid=7401380&fmt=gif" />
          </noscript>
        </PostHogProvider>
      </body>
    </html>
  );
}