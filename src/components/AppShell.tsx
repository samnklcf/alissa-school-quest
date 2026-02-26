import { useLocation, useNavigate, Outlet } from 'react-router-dom';

const tabs = [
  { icon: 'fa-house', label: 'Accueil', path: '/' },
  { icon: 'fa-book-open', label: 'Matières', path: '/subjects' },
  { icon: 'fa-trophy', label: 'Succès', path: '/achievements' },
  { icon: 'fa-robot', label: 'Assistant', path: '/assistant' },
  { icon: 'fa-circle-user', label: 'Profil', path: '/profile' },
];

const AppShell = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-dvh">
      {/* Header */}
      <header className="h-14 bg-header flex items-center justify-between px-4 shrink-0 z-50">
        <div className="flex items-center gap-2">
          <i className="fa-solid fa-bolt text-accent text-lg" />
          <span className="font-gaming text-base text-primary-foreground tracking-wide">ALISSA</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <i className="fa-solid fa-bell text-inactive text-lg" />
          </div>
          <i className="fa-solid fa-circle-user text-inactive text-lg cursor-pointer" onClick={() => navigate('/profile')} />
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto pb-20">
        <Outlet />
      </main>

      {/* Footer */}
      <nav className="h-16 bg-header flex items-center justify-around fixed bottom-0 left-1/2 -translate-x-1/2 w-full z-50" style={{ maxWidth: 480 }}>
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className="flex flex-col items-center gap-1 relative pt-2"
            >
              {isActive && <div className="absolute top-0 w-6 h-0.5 bg-primary rounded-full" />}
              <i className={`fa-solid ${tab.icon} text-xl ${isActive ? 'text-primary' : 'text-inactive'}`} />
              <span className={`text-[10px] font-body ${isActive ? 'text-primary' : 'text-inactive'}`}>{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default AppShell;
