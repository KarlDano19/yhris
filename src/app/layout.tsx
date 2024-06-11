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
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function (w, d, s) {
                var a = d.getElementsByTagName('head')[0];
                var r = d.createElement('script');
                r.async = 1;
                r.src = s;
                r.setAttribute('id', 'usetifulScript');
                r.dataset.token = "cfa81b468ad851421f13a6228543f669";
                a.appendChild(r);
              })(window, document, "https://www.usetiful.com/dist/usetiful.js");
            `,
          }}
        />
      </body>
    </html>
  );
}
