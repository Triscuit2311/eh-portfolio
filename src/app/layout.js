import { Inter } from 'next/font/google'
import styles from '@/styles/Global.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Eddie Householder',
  description: 'GFX Artist',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
