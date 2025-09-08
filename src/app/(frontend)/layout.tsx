import React from 'react'
import { ThemeProvider } from 'next-themes'
import './styles.css'

export const metadata = {
  description: 'Chess Trading Card Game - Strategic card gameplay meets chess mechanics',
  title: 'Chess TCG',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="data-theme" defaultTheme="light" enableSystem>
          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  )
}
