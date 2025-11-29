import { useNavigate, useLocation } from "react-router-dom";

export default function Header1() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-[1000] py-3 md:py-4 px-2 md:px-4 bg-black border-b border-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto">
        <nav className="flex flex-row items-center justify-between gap-3 md:gap-6">
          {/* Left: Both Logos */}
          <div 
            className="flex flex-row items-center gap-2 md:gap-4 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <img
              src="/images/MorsliSportLogo.png"
              alt="Morsli Sport Logo"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
              className="h-9 sm:h-11 md:h-12 w-auto max-w-[100px] sm:max-w-[140px] md:max-w-[160px] object-contain drop-shadow-[0_4px_12px_rgba(0,212,255,0.3)] transition-transform duration-300 hover:scale-105"
            />
            <img
              src="/images/areasportLogo.png"
              alt="Area Sport Logo"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
              className="h-9 sm:h-11 md:h-12 w-auto max-w-[100px] sm:max-w-[140px] md:max-w-[160px] object-contain rounded sm:rounded-md drop-shadow-[0_4px_12px_rgba(0,212,255,0.3)] transition-transform duration-300 hover:scale-105"
            />
          </div>

          {/* Right: Navigation */}
          <div className="flex flex-row items-center gap-2">
            <button
              onClick={() => navigate('/contact')}
              className={`px-3 md:px-4 py-2 rounded-lg transition-all duration-300 text-sm md:text-base ${
                location.pathname === '/contact'
                  ? 'text-primary font-bold'
                  : 'text-slate-400 font-medium hover:text-primary hover:bg-primary/10'
              }`}
            >
              Contact Us
            </button>
            <button
              onClick={() => navigate('/avis-client')}
              className={`px-3 md:px-4 py-2 rounded-lg transition-all duration-300 text-sm md:text-base ${
                location.pathname === '/avis-client'
                  ? 'text-primary font-bold'
                  : 'text-slate-400 font-medium hover:text-primary hover:bg-primary/10'
              }`}
            >
              Avis Clients
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}
