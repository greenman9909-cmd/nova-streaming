import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    getLiveMatches,
    getTodaysMatches,
    getSportCategories,
    getMatchesBySport,
    Match,
    Sport,
    getSportIcon,
    getSportGradient,
    getTeamBadgeUrl,
    formatMatchTime,
} from '../services/sportsService';

// Default sport categories as fallback
const defaultCategories = [
    { id: 'all', name: 'All Sports' },
    { id: 'football', name: 'Football' },
    { id: 'basketball', name: 'Basketball' },
    { id: 'tennis', name: 'Tennis' },
    { id: 'cricket', name: 'Cricket' },
    { id: 'f1', name: 'Formula 1' },
    { id: 'boxing', name: 'Boxing' },
    { id: 'mma', name: 'MMA' },
];

export default function Deportes() {
    const navigate = useNavigate();
    const [selectedSport, setSelectedSport] = useState('all');
    const [liveMatches, setLiveMatches] = useState<Match[]>([]);
    const [upcomingMatches, setUpcomingMatches] = useState<Match[]>([]);
    const [sportCategories, setSportCategories] = useState<Sport[]>(defaultCategories);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch sport categories on mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const categories = await getSportCategories();
                if (categories.length > 0) {
                    setSportCategories([{ id: 'all', name: 'All Sports' }, ...categories]);
                }
            } catch (err) {
                console.error('Failed to fetch categories:', err);
            }
        };
        fetchCategories();
    }, []);

    // Fetch matches when sport selection changes
    useEffect(() => {
        const fetchMatches = async () => {
            setIsLoading(true);
            setError(null);

            try {
                let live: Match[] = [];
                let upcoming: Match[] = [];

                if (selectedSport === 'all') {
                    [live, upcoming] = await Promise.all([
                        getLiveMatches(),
                        getTodaysMatches()
                    ]);
                } else {
                    const sportMatches = await getMatchesBySport(selectedSport);
                    const now = Date.now();
                    live = sportMatches.filter((m: Match) => m.date <= now);
                    upcoming = sportMatches.filter((m: Match) => m.date > now);
                }

                setLiveMatches(live);
                setUpcomingMatches(upcoming);
            } catch (err) {
                console.error('Failed to fetch matches:', err);
                setError('Failed to load matches. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchMatches();
    }, [selectedSport]);

    const handleWatchMatch = (match: Match) => {
        if (match.sources && match.sources.length > 0) {
            const source = match.sources[0];
            navigate(`/deportes/watch/${source.source}/${source.id}?title=${encodeURIComponent(match.title)}&category=${match.category}`);
        }
    };

    return (
        <main className="min-h-screen bg-nova-bg pt-20">
            {/* Hero Banner */}
            <section className="relative h-[45vh] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/60 to-lime-900/40"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-nova-bg via-transparent to-transparent"></div>
                <div className="relative z-10 h-full flex flex-col justify-end p-8 max-w-7xl mx-auto">
                    <div className="flex items-center gap-3 mb-3">
                        {liveMatches.length > 0 && (
                            <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-bold animate-pulse flex items-center gap-2">
                                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                                {liveMatches.length} LIVE NOW
                            </span>
                        )}
                        <span className="text-nova-dim text-sm">
                            {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>
                    <h1 className="text-5xl font-bold text-white mb-2">Sports</h1>
                    <p className="text-nova-muted max-w-xl">Live events, highlights & replays from around the world</p>
                </div>
            </section>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 lg:px-6 py-8">
                {/* Sport Categories */}
                <div className="flex gap-3 mb-8 overflow-x-auto pb-2 scrollbar-hide">
                    {sportCategories.map((sport) => (
                        <button
                            key={sport.id}
                            onClick={() => setSelectedSport(sport.id)}
                            className={`px-5 py-3 rounded-full text-sm font-medium whitespace-nowrap transition-all flex items-center gap-2 ${selectedSport === sport.id
                                ? `bg-gradient-to-r ${getSportGradient(sport.id)} text-white shadow-lg`
                                : 'bg-white/5 text-nova-muted hover:text-white hover:bg-white/10'
                                }`}
                        >
                            <i className={getSportIcon(sport.id)}></i>
                            {sport.name}
                        </button>
                    ))}
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="text-center">
                            <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-nova-muted">Loading matches...</p>
                        </div>
                    </div>
                ) : error ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="text-center">
                            <i className="ri-error-warning-line text-5xl text-red-400 mb-4"></i>
                            <p className="text-white font-medium mb-2">{error}</p>
                            <button
                                onClick={() => setSelectedSport(selectedSport)}
                                className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm hover:bg-emerald-500 transition-colors"
                            >
                                Retry
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Live Now Section */}
                        {liveMatches.length > 0 && (
                            <section className="mb-10">
                                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                                    Live Now
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {liveMatches.map((match) => (
                                        <div
                                            key={match.id}
                                            className="group relative rounded-2xl overflow-hidden bg-nova-card hover:shadow-2xl hover:shadow-emerald-500/20 transition-all duration-300 cursor-pointer"
                                            onClick={() => handleWatchMatch(match)}
                                        >
                                            {/* Background Gradient */}
                                            <div className={`absolute inset-0 bg-gradient-to-br ${getSportGradient(match.category)} opacity-10`}></div>
                                            <div className="absolute inset-0 bg-gradient-to-t from-nova-card via-nova-card/80 to-transparent"></div>

                                            <div className="relative p-5">
                                                {/* Header */}
                                                <div className="flex items-center justify-between mb-4">
                                                    <span className="text-xs text-nova-dim flex items-center gap-2">
                                                        <i className={`${getSportIcon(match.category)} text-emerald-400`}></i>
                                                        <span className="capitalize">{match.category}</span>
                                                    </span>
                                                    <span className="px-2 py-1 rounded bg-red-500/20 text-red-400 text-xs font-bold flex items-center gap-1">
                                                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
                                                        LIVE
                                                    </span>
                                                </div>

                                                {/* Match Title / Teams */}
                                                {match.teams?.home && match.teams?.away ? (
                                                    <div className="flex items-center justify-between mb-4">
                                                        <div className="flex items-center gap-3">
                                                            {match.teams.home.badge && (
                                                                <img
                                                                    src={getTeamBadgeUrl(match.teams.home.badge)}
                                                                    alt=""
                                                                    className="w-10 h-10 object-contain"
                                                                    onError={(e) => (e.currentTarget.style.display = 'none')}
                                                                />
                                                            )}
                                                            <p className="text-white font-medium">{match.teams.home.name}</p>
                                                        </div>
                                                        <span className="text-nova-dim text-xl font-bold">VS</span>
                                                        <div className="flex items-center gap-3 text-right">
                                                            <p className="text-white font-medium">{match.teams.away.name}</p>
                                                            {match.teams.away.badge && (
                                                                <img
                                                                    src={getTeamBadgeUrl(match.teams.away.badge)}
                                                                    alt=""
                                                                    className="w-10 h-10 object-contain"
                                                                    onError={(e) => (e.currentTarget.style.display = 'none')}
                                                                />
                                                            )}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <h3 className="text-white font-semibold text-lg mb-4">{match.title}</h3>
                                                )}

                                                {/* Watch Button */}
                                                <button className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-lime-600 text-white font-semibold text-sm hover:shadow-lg hover:shadow-emerald-500/30 transition-all flex items-center justify-center gap-2">
                                                    <i className="ri-play-fill"></i>
                                                    Watch Live
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* No Live Matches Message */}
                        {liveMatches.length === 0 && (
                            <section className="mb-10">
                                <div className="bg-nova-card rounded-2xl p-8 text-center">
                                    <i className="ri-calendar-schedule-line text-5xl text-emerald-400 mb-4"></i>
                                    <h3 className="text-white font-semibold text-lg mb-2">No Live Events Right Now</h3>
                                    <p className="text-nova-muted text-sm">Check out the upcoming matches below or explore different sports categories.</p>
                                </div>
                            </section>
                        )}

                        {/* Upcoming Events */}
                        {upcomingMatches.length > 0 && (
                            <section>
                                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                    <i className="ri-calendar-line text-nova-accent"></i>
                                    Upcoming Events
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {upcomingMatches.slice(0, 12).map((match) => (
                                        <div
                                            key={match.id}
                                            className="glass rounded-xl p-4 hover:bg-white/10 transition-all cursor-pointer"
                                            onClick={() => handleWatchMatch(match)}
                                        >
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className={`text-xs px-2 py-0.5 rounded bg-gradient-to-r ${getSportGradient(match.category)} text-white`}>
                                                    {match.category}
                                                </span>
                                                {match.popular && (
                                                    <span className="text-xs text-amber-400">⭐ Popular</span>
                                                )}
                                            </div>
                                            <h3 className="text-white font-medium mb-2 line-clamp-2">{match.title}</h3>
                                            <p className="text-nova-dim text-sm flex items-center gap-1">
                                                <i className="ri-time-line"></i>
                                                {formatMatchTime(new Date(match.date))}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </>
                )}
            </div>
        </main>
    );
}
