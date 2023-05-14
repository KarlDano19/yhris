import MainHeader from '@/components/MainHeader'
import './globals.css'
import { Golos_Text } from 'next/font/google'
import { Toaster } from 'react-hot-toast';

const golos = Golos_Text({ subsets: ['latin'] })

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
      <body className={`${golos.className} bg-gray-100`}>
       <MainHeader/>
       {children}
       <Toaster position="top-right" />
      </body>
    </html>
  )
}
