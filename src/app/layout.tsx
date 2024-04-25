import { Suspense } from 'react';

import { Toaster } from 'react-hot-toast';

import ReactQueryWrapper from '@/app/reactQueryWrapper';
import Auth from '@/app/auth';

import './quill-tooltips.css';
import './globals.css';

export const metadata = {
  title: 'Yahshua HRIS',
  description: 'HRIS',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body className='bg-gray-100'>
        <ReactQueryWrapper>
          <Suspense>
            <Auth>{children}</Auth>
          </Suspense>
        </ReactQueryWrapper>
        <Toaster position='top-right' />
      </body>
    </html>
  );
}
