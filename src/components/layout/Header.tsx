import { Link, useLocation } from 'react-router-dom'
import { Home, BookText, Smile, Settings, TrendingUp, Stethoscope } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'
import { cn } from '@/lib/utils'

export function Header() {
  const location = useLocation()
  const pathname = location.pathname

  const navItems = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/journal', icon: BookText, label: 'Journal' },
    { href: '/mood', icon: Smile, label: 'Mood' },
    { href: '/health', icon: Stethoscope, label: 'Health' },
    { href: '/history', icon: TrendingUp, label: 'History' },
    { href: '/settings', icon: Settings, label: 'Settings' },
  ]

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm transition-colors duration-300 shadow-sm">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg text-gray-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <BookText className="h-5 w-5 text-white" />
          </div>
          <span className="hidden sm:inline bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">MindMate</span>
        </Link>
        <nav className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-2 text-sm font-medium transition-all duration-200 hover:scale-105 px-3 py-2 rounded-lg",
                  pathname === item.href 
                    ? "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20" 
                    : "text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </div>
          <ThemeToggle />
        </nav>
      </div>
      {/* Mobile Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700 md:hidden shadow-lg">
        <div className="grid grid-cols-6 gap-1 py-2 px-2 max-w-md mx-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex flex-col items-center gap-1 text-xs font-medium transition-all duration-200 hover:scale-105 min-h-[60px] justify-center rounded-lg p-2 touch-manipulation",
                pathname === item.href 
                  ? "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20" 
                  : "text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-gray-50 dark:hover:bg-gray-800/50"
              )}
            >
              <item.icon className={cn(
                "h-5 w-5 transition-colors",
                pathname === item.href ? "text-purple-600 dark:text-purple-400" : ""
              )} />
              <span className="leading-tight text-center">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </header>
  )
}