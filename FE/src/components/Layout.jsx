import { NavLink, Outlet } from 'react-router-dom';
import { useAppContext } from '../context/useAppContext';
import Logo from './Logo';
import { HomeIcon, StatsIcon, SettingsIcon, LockIcon } from './NavIcons';

const navClass = ({ isActive }) =>
  `whitespace-nowrap rounded-md px-3 py-2 text-sm transition ${isActive
    ? 'font-bold'
    : 'font-normal hover:bg-honey/15 dark:hover:bg-gray-700'
  }`;
// da chinh sua 
const dockClass = ({ isActive }) =>
  `flex flex-1 items-center justify-center py-3 transition ${isActive
    ? 'text-honey-dark dark:text-honey'
    : 'text-gray-400 dark:text-gray-500'
  }`;

function Layout() {
  const { theme } = useAppContext();
  const isDark = theme === 'dark';

  return (
    <div className={isDark ? 'dark' : ''}>
      <div className="min-h-screen overflow-x-hidden bg-cream text-gray-900 transition-colors dark:bg-gray-900 dark:text-white">
        <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/95 backdrop-blur dark:border-gray-700 dark:bg-gray-800/95">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 sm:px-6 sm:py-4">
            <NavLink to="/" end className="flex items-center gap-2">
              <Logo className="h-8 w-8" />
              <span className="text-lg font-semibold text-cocoa">NoteWeb</span>
            </NavLink>
            <nav className="hidden gap-1 sm:flex sm:flex-wrap">
              <NavLink to="/" end className={navClass}>
                Trang chủ
              </NavLink>
              <NavLink to="/dashboard" className={navClass}>
                Thống kê
              </NavLink>
              <NavLink to="/settings" className={navClass}>
                Cài đặt
              </NavLink>
              <NavLink to="/private" className={navClass}>
                Vùng kín
              </NavLink>
            </nav>
          </div>
        </header>

        <main className="mx-auto max-w-6xl p-4 pb-24 sm:p-6">
          <Outlet />
        </main>

        <nav className="fixed inset-x-0 bottom-0 z-20 flex border-t border-gray-200 bg-white/95 backdrop-blur pb-[env(safe-area-inset-bottom)] sm:hidden dark:border-gray-700 dark:bg-gray-800/95">
          <NavLink to="/" end className={dockClass} aria-label="Trang chủ" title="Trang chủ">
            <HomeIcon />
          </NavLink>
          <NavLink to="/dashboard" className={dockClass} aria-label="Thống kê" title="Thống kê">
            <StatsIcon />
          </NavLink>
          <NavLink to="/settings" className={dockClass} aria-label="Cài đặt" title="Cài đặt">
            <SettingsIcon />
          </NavLink>
          <NavLink to="/private" className={dockClass} aria-label="Vùng kín" title="Vùng kín">
            <LockIcon />
          </NavLink>
        </nav>
      </div>
    </div>
  );
}

export default Layout;
