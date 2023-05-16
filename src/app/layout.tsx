import MainHeader from '@/components/MainHeader'
import './globals.css'
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: 'Home - Yahshua HRIS',
  description: 'HRIS',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`bg-gray-100`}>
       <MainHeader/>
       {children}
       <Toaster position="top-right" />
      </body>
    </html>
  )
}
