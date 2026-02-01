import { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import NovaLogo from './NovaLogo';
import { searchMulti, MultiSearchResult, getImageUrl } from '../services/api';

export default function Navbar() {
    const [searchOpen, setSearchOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<MultiSearchResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const lastScrollY = useRef(0);
    const location = useLocation();
    const navigate = useNavigate();

    // Scroll direction detection for collapsible navbar
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            const scrollDiff = currentScrollY - lastScrollY.current;

            // Collapse when scrolling down past 100px threshold
            if (scrollDiff > 5 && currentScrollY > 100) {
                setIsCollapsed(true);
            }
            // Expand when scrolling up OR at top
            else if (scrollDiff < -5 || currentScrollY < 50) {
                setIsCollapsed(false);
            }

            lastScrollY.current = currentScrollY;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Debounced live search - TMDB only
    useEffect(() => {
        if (!searchQuery.trim() || searchQuery.length < 2) {
            setSearchResults([]);
            return;
        }

        const debounceTimer = setTimeout(async () => {
            setIsSearching(true);
            try {
                const results = await searchMulti(searchQuery);
                setSearchResults(results.slice(0, 8));
            } catch (error) {
                console.error('Search error:', error);
                setSearchResults([]);
            } finally {
                setIsSearching(false);
            }
        }, 300);

        return () => clearTimeout(debounceTimer);
    }, [searchQuery]);

    const handleSearch = useCallback((query: string) => {
        if (!query.trim()) return;
        setSearchOpen(false);
        setSearchQuery('');
        setSearchResults([]);
        navigate(`/search?q=${encodeURIComponent(query)}`);
    }, [navigate]);

    const handleResultClick = useCallback((id: string, type: 'movie' | 'tv') => {
        setSearchOpen(false);
        setSearchQuery('');
        setSearchResults([]);
        if (type === 'movie') {
            navigate(`/watch/movie/${id}`);
        } else {
            navigate(`/watch/tv/${id}`);
        }
    }, [navigate]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setSearchOpen(false);
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setSearchOpen(true);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    useEffect(() => setMobileMenuOpen(false), [location]);

    // Section-specific glow colors
    const sectionConfig: Record<string, { glow: string; gradient: string; border: string }> = {
        '/': { glow: 'rgba(255,255,255,0.35)', gradient: 'from-white/20 to-gray-400/20', border: 'rgba(255,255,255,0.15)' },
        '/peliculas': { glow: 'rgba(124,92,255,0.40)', gradient: 'from-[#7C5CFF] to-[#5B8CFF]', border: 'rgba(124,92,255,0.3)' },
        '/series': { glow: 'rgba(59,130,246,0.40)', gradient: 'from-blue-500 to-blue-400', border: 'rgba(59,130,246,0.3)' },
        '/anime': { glow: 'rgba(34,211,238,0.40)', gradient: 'from-cyan-400 to-cyan-300', border: 'rgba(34,211,238,0.3)' },
        '/deportes': { glow: 'rgba(74,222,128,0.40)', gradient: 'from-green-400 to-emerald-300', border: 'rgba(74,222,128,0.3)' },
    };


    const navItems = [
        {
            path: '/',
            label: 'Inicio',
            activeColor: 'text-white',
            iconLine: 'ri-home-5-line',
            iconFill: 'ri-home-5-fill'
        },
        {
            path: '/peliculas',
            label: 'Películas',
            activeColor: 'text-violet-300',
            iconLine: 'ri-film-line',
            iconFill: 'ri-film-fill'
        },
        {
            path: '/series',
            label: 'Series',
            activeColor: 'text-blue-300',
            iconLine: 'ri-tv-2-line',
            iconFill: 'ri-tv-2-fill'
        },
        {
            path: '/anime',
            label: 'Anime',
            activeColor: 'text-cyan-300',
            iconLine: 'ri-sparkling-2-line',
            iconFill: 'ri-sparkling-2-fill'
        },
        {
            path: '/deportes',
            label: 'Deportes',
            activeColor: 'text-green-300',
            iconLine: 'ri-trophy-line',
            iconFill: 'ri-trophy-fill'
        },
    ];

    const isActive = (path: string) => path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);
    if (location.pathname === '/login') return null;

    return (
        <>
            {/* Main Navbar - Slides up when collapsed */}
            <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out
                ${isCollapsed ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'}`}>
                <nav className="w-full px-[5%] h-16 md:h-[72px] flex items-center justify-between gap-4">
                    {/* Left: Logo */}
                    <Link to="/" className="relative flex items-center gap-2.5 group z-50 flex-shrink-0">
                        <NovaLogo className="w-8 h-8 lg:w-9 lg:h-9 transition-transform duration-300 group-hover:scale-110" />
                        <div className="flex flex-col">
                            <h1 className="text-base lg:text-lg font-black font-display tracking-tight leading-none text-white">
                                NOVA
                            </h1>
                            <span className="text-[0.4rem] font-semibold tracking-[0.12em] text-gray-500 uppercase">Stream</span>
                        </div>
                    </Link>

                    {/* Center: Clean Floating Navigation */}
                    <div className="hidden lg:flex items-center justify-center flex-1">
                        <div className="relative flex items-center gap-1 px-3 py-2 rounded-full bg-[#0a0a0f]/70 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
                            {navItems.map((item) => {
                                const active = isActive(item.path);
                                const config = sectionConfig[item.path];

                                return (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        className={`relative flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-400 group
                                        ${active ? 'text-white' : 'text-gray-400 hover:text-white'}`}
                                    >
                                        {/* Active Background */}
                                        <div
                                            className={`absolute inset-0 rounded-full transition-all duration-400 ease-out
                                            ${active ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
                                        >
                                            <div className={`absolute inset-0 bg-gradient-to-r ${config.gradient} opacity-25 rounded-full`} />
                                            <div className="absolute inset-0 rounded-full border border-white/15"
                                                style={{ boxShadow: `inset 0 0 12px ${config.glow.replace('0.40', '0.2')}` }} />
                                        </div>

                                        {/* Icon */}
                                        <div className="relative z-10 flex items-center justify-center w-4 h-4">
                                            <i className={`${active ? item.iconFill : item.iconLine} text-base transition-all duration-300 ${active ? item.activeColor : ''}`}></i>
                                        </div>

                                        {/* Label */}
                                        <span className="relative z-10 text-sm font-medium">
                                            {item.label}
                                        </span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2 md:gap-3">
                        {/* NOVA+ Badge with Prime-style Blue Glow */}
                        <Link
                            to="/plans"
                            className="hidden md:flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-[#00a8e1] to-[#0080b3] text-white text-sm font-bold hover:shadow-[0_0_25px_rgba(0,168,225,0.6)] hover:scale-105 transition-all duration-300 group relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-white/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <i className="ri-vip-crown-fill text-sm relative z-10"></i>
                            <span className="relative z-10">NOVA+</span>
                        </Link>


                        {/* Search with Pulse Effect */}
                        <div className={`search-bar-container relative flex flex-col transition-all duration-500 ${searchOpen ? 'w-[380px]' : 'w-10'
                            }`}>
                            <div className={`relative flex items-center w-full h-10 transition-all duration-500 ${searchOpen
                                ? 'bg-[#0a0a12]/95 backdrop-blur-xl rounded-xl border border-violet-500/30 shadow-[0_0_30px_rgba(139,92,246,0.15)]'
                                : 'bg-transparent'
                                }`}>
                                <button
                                    onClick={() => setSearchOpen(!searchOpen)}
                                    className={`w-10 h-10 flex-shrink-0 flex items-center justify-center transition-all duration-300 group ${searchOpen
                                        ? 'text-violet-400'
                                        : 'rounded-xl bg-white/[0.03] border border-white/[0.06] text-gray-400 hover:text-white hover:border-white/20 hover:bg-white/[0.08] hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                                        }`}
                                >
                                    <svg className={`w-[18px] h-[18px] transition-transform duration-300 ${!searchOpen ? 'group-hover:scale-110 group-hover:rotate-12' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        {searchOpen ? (
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        ) : (
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        )}
                                    </svg>
                                </button>

                                {searchOpen && (
                                    <div className="flex-1 flex items-center gap-2 pr-3 animate-fade-in">
                                        <input
                                            type="text"
                                            placeholder="Search anime..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && searchQuery.trim()) handleSearch(searchQuery);
                                                if (e.key === 'Escape') setSearchOpen(false);
                                            }}
                                            autoFocus
                                            className="flex-1 bg-transparent border-none text-white text-sm py-2 focus:outline-none placeholder-gray-500 font-medium"
                                        />
                                        {isSearching && (
                                            <div className="w-4 h-4 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
                                        )}
                                        <button
                                            onClick={() => searchQuery.trim() && handleSearch(searchQuery)}
                                            className="w-7 h-7 rounded-lg bg-gradient-to-r from-violet-500 to-fuchsia-500 flex items-center justify-center text-white hover:scale-110 hover:shadow-lg hover:shadow-violet-500/50 transition-all duration-300 icon-bounce"
                                        >
                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                            </svg>
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Live Results Dropdown */}
                            {searchOpen && searchResults.length > 0 && (
                                <div className="absolute top-11 left-0 right-0 bg-[#0a0a12]/98 backdrop-blur-xl rounded-xl border border-violet-500/20 overflow-hidden shadow-2xl z-50 animate-slide-up-fade">
                                    <div className="max-h-[400px] overflow-y-auto">
                                        {searchResults.map((item, index) => (
                                            <button
                                                key={`result-${item.id}-${index}`}
                                                onClick={() => handleResultClick(String(item.id), item.media_type === 'movie' ? 'movie' : 'tv')}
                                                className="w-full flex items-center gap-3 p-3 hover:bg-white/5 transition-all group border-b border-white/5 last:border-b-0"
                                                style={{ animationDelay: `${index * 40}ms` }}
                                            >
                                                <div className="w-10 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-white/5 relative shadow-md group-hover:shadow-violet-500/20 transition-all">
                                                    <img
                                                        src={getImageUrl(item.poster_path)}
                                                        alt={item.title || item.name}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                    />
                                                </div>
                                                <div className="flex-1 text-left min-w-0">
                                                    <h4 className="text-white font-medium text-sm truncate group-hover:text-violet-300 transition-colors">
                                                        {item.title || item.name}
                                                    </h4>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${item.media_type === 'movie' ? 'bg-blue-500/20 text-blue-300' : 'bg-green-500/20 text-green-300'}`}>
                                                            {item.media_type === 'movie' ? 'Movie' : 'Series'}
                                                        </span>
                                                        <span className="text-[10px] text-gray-500">{(item.release_date || item.first_air_date)?.split('-')[0]}</span>
                                                        {item.vote_average > 0 && (
                                                            <span className="text-[10px] text-amber-400 flex items-center gap-0.5">
                                                                <i className="ri-star-fill text-[8px]"></i>
                                                                {Math.round(item.vote_average * 10)}%
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <svg className="w-4 h-4 text-gray-600 group-hover:text-violet-400 group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </button>
                                        ))}
                                    </div>
                                    <button
                                        onClick={() => handleSearch(searchQuery)}
                                        className="w-full p-2.5 text-center text-xs text-violet-400 hover:text-white hover:bg-violet-500/10 transition-all border-t border-white/5 font-medium"
                                    >
                                        Ver todos los resultados →
                                    </button>
                                </div>
                            )}

                            {searchOpen && searchQuery.length >= 2 && !isSearching && searchResults.length === 0 && (
                                <div className="absolute top-11 left-0 right-0 bg-[#0a0a12]/98 backdrop-blur-xl rounded-xl border border-white/10 p-4 text-center animate-fade-in">
                                    <p className="text-gray-500 text-sm">No se encontraron resultados</p>
                                </div>
                            )}
                        </div>

                        {/* Login Button - Better Visibility */}
                        <Link
                            to="/login"
                            className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/20 hover:border-white/40 hover:shadow-[0_0_15px_rgba(255,255,255,0.15)] transition-all duration-300 group"
                        >
                            <i className="ri-user-3-line text-lg text-gray-300 group-hover:text-white transition-colors"></i>
                        </Link>

                        {/* Expandable Social Icons - Better Visibility */}
                        <div className="hidden md:flex items-center relative group/socials">
                            <div className="flex items-center gap-0 overflow-hidden transition-all duration-500 rounded-full bg-white/10 border border-white/20 group-hover/socials:gap-1 group-hover/socials:pr-2 group-hover/socials:border-white/30">
                                {/* Main Share Icon */}
                                <button className="w-10 h-10 flex items-center justify-center text-gray-300 group-hover/socials:text-white transition-colors">
                                    <i className="ri-share-line text-lg"></i>
                                </button>

                                {/* Expandable Social Icons */}
                                <div className="flex items-center gap-1 max-w-0 opacity-0 group-hover/socials:max-w-[200px] group-hover/socials:opacity-100 transition-all duration-500 overflow-hidden">
                                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                                        className="w-8 h-8 rounded-full flex items-center justify-center text-pink-400 hover:text-pink-300 hover:bg-pink-500/20 transition-all">
                                        <i className="ri-instagram-line text-base"></i>
                                    </a>
                                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                                        className="w-8 h-8 rounded-full flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/10 transition-all">
                                        <i className="ri-twitter-x-line text-base"></i>
                                    </a>
                                    <a href="https://youtube.com" target="_blank" rel="noopener noreferrer"
                                        className="w-8 h-8 rounded-full flex items-center justify-center text-red-400 hover:text-red-300 hover:bg-red-500/20 transition-all">
                                        <i className="ri-youtube-line text-base"></i>
                                    </a>
                                    <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer"
                                        className="w-8 h-8 rounded-full flex items-center justify-center text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/20 transition-all">
                                        <i className="ri-tiktok-line text-base"></i>
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-white/[0.03] border border-white/[0.06] text-gray-400"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                {mobileMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </nav>
            </header>

            {/* Floating Collapsed Pill - Appears at bottom when scrolling down */}
            <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ease-out
                ${isCollapsed ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-24 opacity-0 scale-75 pointer-events-none'}`}>
                <div className="relative flex items-center gap-1 px-2 py-2 rounded-full bg-[#0a0a0f]/90 backdrop-blur-2xl border border-white/15 shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_60px_rgba(0,0,0,0.2)]">
                    {/* Logo Icon - Same as top navbar */}
                    <Link
                        to="/"
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="flex items-center gap-2 px-2 py-1 mr-1 hover:scale-105 transition-transform"
                    >
                        <NovaLogo className="w-7 h-7" />
                    </Link>

                    {/* Nav Icons */}
                    {navItems.map((item) => {
                        const active = isActive(item.path);
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 group
                                    ${active ? 'bg-white/15 text-white' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}
                            >
                                <i className={`${active ? item.iconFill : item.iconLine} text-lg ${active ? item.activeColor : ''}`}></i>

                                {/* Tooltip */}
                                <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-[#0a0a0f] text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all whitespace-nowrap border border-white/10">
                                    {item.label}
                                </span>
                            </Link>
                        );
                    })}

                    {/* Search Icon */}
                    <button
                        onClick={() => { setIsCollapsed(false); setTimeout(() => setSearchOpen(true), 300); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        className="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                    >
                        <i className="ri-search-line text-lg"></i>
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`fixed inset-0 z-40 lg:hidden transition-all duration-500 ${mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}>
                <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={() => setMobileMenuOpen(false)} />
                <div className={`absolute top-20 left-4 right-4 bg-[#0B0D12] rounded-2xl border border-white/10 p-4 transition-all duration-500 ${mobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
                    }`}>
                    {navItems.map((item) => {
                        const active = isActive(item.path);
                        const config = sectionConfig[item.path];
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setMobileMenuOpen(false)}
                                className={`flex items-center gap-3 p-4 rounded-xl transition-all mb-1 ${active
                                    ? `bg-gradient-to-r ${config.gradient} text-white`
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <span className={active ? 'text-white' : 'text-gray-500'}>
                                    <i className={`${active ? item.iconFill : item.iconLine} text-xl`}></i>
                                </span>
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </>
    );
}
