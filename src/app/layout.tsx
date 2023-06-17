import MainHeader from '@/components/MainHeader';
import './globals.css';
import "./quill-tooltips.css"
import { Toaster } from 'react-hot-toast';
import ReactQueryWrapper from './reactQueryWrapper';

export const metadata = {
  title: 'Home - Yahshua HRIS',
  description: 'HRIS',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body className="bg-gray-100">
        <ReactQueryWrapper>
          <MainHeader />
          {children}
        </ReactQueryWrapper>
        <Toaster position='top-right' />
      </body>
    </html>
  );
}
