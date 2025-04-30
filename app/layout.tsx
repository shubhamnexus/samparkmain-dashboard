import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Sampark Dashboard',
  description: 'Sampark Dashboard Application',
  icons: {
    icon: '/favicon.ico',
    apple: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
