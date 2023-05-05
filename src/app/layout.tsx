import MainHeader from '@/components/MainHeader'
import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

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
      <body className={`${inter.className} bg-gray-100`}>
       <MainHeader/>
       {children}
      </body>
    </html>
  )
}
