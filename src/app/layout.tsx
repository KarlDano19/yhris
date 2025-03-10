import { Golos_Text } from 'next/font/google';

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
        <script type='text/javascript' id='hs-script-loader' async defer src='//js-na1.hs-scripts.com/23359629.js' />
        <script async src='https://www.googletagmanager.com/gtag/js?id=G-0B8QK4ZCEJ'></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-0B8QK4ZCEJ');
            `,
          }}
        />
      </body>
    </html>
  );
}
