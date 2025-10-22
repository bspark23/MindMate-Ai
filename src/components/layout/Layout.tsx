import { ReactNode } from 'react'
import { Header } from './Header'
import { Footer } from './Footer'
import { ThemeProvider } from '../providers/ThemeProvider'
import { Toaster } from '../ui/toaster'
import { AudioPlayer } from '../AudioPlayer'
import { FloatingRelaxationButton } from '../FloatingRelaxationButton'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300">
      <ThemeProvider>
        <Header />
        <main className="flex-grow container mx-auto px-4 py-4 sm:py-8 md:py-12 pb-20 md:pb-8">
          {children}
        </main>
        <Footer />
        <FloatingRelaxationButton />
        <Toaster />
        <AudioPlayer />
      </ThemeProvider>
    </div>
  )
}