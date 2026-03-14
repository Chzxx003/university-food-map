import { useState } from 'react'
import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { Map, Trophy, Heart, Shuffle, Home, X, Menu } from 'lucide-react'
import RandomPickModal from './RandomPickModal'

const navItems = [
  { to: '/', icon: Home, label: '首页' },
  { to: '/rankings', icon: Trophy, label: '排行榜' },
  { to: '/favorites', icon: Heart, label: '收藏' },
]

export default function Layout() {
  const [showRandom, setShowRandom] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()

  return (
    <div className="min-h-screen bg-bg">
      {/* Desktop Header */}
      <header className="sticky top-0 z-40 glass-strong">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <NavLink to="/" className="flex items-center gap-2 cursor-pointer">
            <div className="w-9 h-9 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-sm">
              <Map className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-text hidden sm:block">大学城美食地图</span>
          </NavLink>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'glass-accent text-primary'
                      : 'text-text-secondary hover:bg-white/30 hover:text-text'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                {label}
              </NavLink>
            ))}
            <button
              onClick={() => setShowRandom(true)}
              className="flex items-center gap-2 px-5 py-2 rounded-2xl text-sm font-medium bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-200 cursor-pointer ml-2"
            >
              <Shuffle className="w-4 h-4" />
              帮我选
            </button>
          </nav>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-stone-100 cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Nav Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden glass-strong rounded-b-3xl px-4 pb-4 pt-2 space-y-1">
            {navItems.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                    isActive ? 'bg-primary/10 text-primary' : 'text-text-secondary hover:bg-stone-100'
                  }`
                }
              >
                <Icon className="w-5 h-5" />
                {label}
              </NavLink>
            ))}
            <button
              onClick={() => { setShowRandom(true); setMobileMenuOpen(false) }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium bg-accent/10 text-accent hover:bg-accent/20 transition-colors w-full cursor-pointer"
            >
              <Shuffle className="w-5 h-5" />
              今天吃什么？
            </button>
          </div>
        )}
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto">
        <Outlet />
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 glass-strong safe-area-pb">
        <div className="flex items-center justify-around h-16 relative">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 px-4 py-1.5 cursor-pointer transition-colors relative ${
                  isActive ? 'text-primary' : 'text-text-muted'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && <span className="absolute -top-0 left-1/2 -translate-x-1/2 w-8 h-[3px] bg-gradient-to-r from-primary to-secondary rounded-full" />}
                  <Icon className={`w-5 h-5 ${isActive ? 'fill-primary/20' : ''}`} />
                  <span className={`text-xs ${isActive ? 'font-medium' : ''}`}>{label}</span>
                </>
              )}
            </NavLink>
          ))}

          {/* FAB-style "帮我选" */}
          <button
            onClick={() => setShowRandom(true)}
            className="flex flex-col items-center cursor-pointer -mt-5"
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-xl shadow-primary/30 ring-4 ring-white/40 mb-0.5">
              <Shuffle className="w-5 h-5 text-white" />
            </div>
            <span className="text-xs text-primary font-medium">帮我选</span>
          </button>
        </div>
      </nav>

      {showRandom && <RandomPickModal onClose={() => setShowRandom(false)} />}
    </div>
  )
}
