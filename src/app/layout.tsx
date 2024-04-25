import { Toaster } from 'react-hot-toast';

import { Golos_Text } from 'next/font/google'

import ReactQueryWrapper from '@/app/reactQueryWrapper';
import Auth from '@/app/auth';

import './quill-tooltips.css';
import './globals.css';

export const metadata = {
  title: 'Yahshua HRIS',
  description: 'HRIS',
};

const golos_text = Golos_Text({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body className={`${golos_text.className} bg-gray-100`}>
        <ReactQueryWrapper>
          <Auth>{children}</Auth>
        </ReactQueryWrapper>
        <Toaster position='top-right' />
      </body>
    </html>
  );
}
