import { LogOut, Moon, Sun } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useAuthContext } from '../../context/AuthContext'
import { ProfileModal } from '../Features/ProfileModal'

const DuoLogo = () => (
  <div className="flex items-center gap-2">
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="16" r="9" fill="#10B981" opacity="0.9"/>
      <circle cx="20" cy="16" r="9" fill="#34D399" opacity="0.7"/>
    </svg>
    <span className="text-lg font-bold text-white">
      Duo<span className="font-light text-emerald-400">Finanças</span>
    </span>
  </div>
)

const Avatar = ({ profile, user, onClick }) => {
  const name = profile?.full_name || user?.user_metadata?.full_name || user?.email || 'U'
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700/60 hover:border-emerald-500/40 transition-all group"
      title="Editar perfil"
    >
      <div className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0 ring-1 ring-slate-600 group-hover:ring-emerald-500/60 transition-all">
        {(user?.user_metadata?.avatar_url || profile?.avatar_url) ? (
          <img
            src={user?.user_metadata?.avatar_url || profile?.avatar_url}
            alt="avatar"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-emerald-500/20 flex items-center justify-center text-[11px] font-bold text-emerald-400">
            {initials}
          </div>
        )}
      </div>
      <span className="hidden sm:block text-sm text-slate-300 max-w-[120px] truncate group-hover:text-slate-100 transition-colors">
        {profile?.full_name || user?.email?.split('@')[0] || 'Usuário'}
      </span>
    </button>
  )
}

export const Header = ({ showNav = true }) => {
  const { user, profile, signOut } = useAuthContext()
  const [dark, setDark] = useState(true)
  const [profileOpen, setProfileOpen] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('theme')
    if (stored === 'light') {
      document.documentElement.classList.remove('dark')
      setDark(false)
    } else {
      document.documentElement.classList.add('dark')
      setDark(true)
    }
  }, [])

  const toggleTheme = () => {
    const next = !dark
    setDark(next)
    if (next) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <DuoLogo />
          {showNav && user && (
            <div className="flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
                title="Alternar tema"
              >
                {dark ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              <Avatar
                profile={profile}
                user={user}
                onClick={() => setProfileOpen(true)}
              />

              <button
                onClick={signOut}
                className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
                title="Sair"
              >
                <LogOut size={18} />
              </button>
            </div>
          )}
        </div>
      </header>

      <ProfileModal open={profileOpen} onClose={() => setProfileOpen(false)} />
    </>
  )
}
