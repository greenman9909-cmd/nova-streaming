import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ContentRow from '../components/ContentRow';
import DynamicHeroBanner from '../components/DynamicHeroBanner';
import NovaLogo from '../components/NovaLogo';
import PremiumLoader from '../components/PremiumLoader';
import { getHomePage, animeToContent } from '../services/animeService';
import {
    getTrendingMovies,
    getTrendingSeries,
    getTopRatedMovies,
    getNowPlayingMovies,
    getTopRatedSeries,
    getPopularSeries,
    getMoviesByGenre,
    getImageUrl,
    TMDBMovie,
    TMDBSeries
} from '../services/api';
import { getLiveMatches, matchToContent } from '../services/sportsService';

// Transform TMDB movie to content format
const movieToContent = (movie: TMDBMovie) => ({
    id: movie.id,
    title: { english: movie.title },
    image: getImageUrl(movie.poster_path, 'w500'),
    rating: Math.round(movie.vote_average * 10),
    type: 'Movie',
    releaseDate: movie.release_date?.split('-')[0] || 'N/A',
});

// Transform TMDB series to content format
const seriesToContent = (series: TMDBSeries) => ({
    id: series.id,
    title: { english: series.name },
    image: getImageUrl(series.poster_path, 'w500'),
    rating: Math.round(series.vote_average * 10),
    type: 'TV',
    releaseDate: series.first_air_date?.split('-')[0] || 'N/A',
});

// Mock sports fallback for when API has no live data
const mockSportsFallback = [
    { id: 'no-live', title: { english: 'No Live Events' }, image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&q=90', rating: 0, type: 'Sports', releaseDate: 'Check Schedule', isLive: false },
];

// Category definitions
const categories = [
    { id: 'all', name: 'All', icon: 'ri-apps-line' },
    { id: 'anime', name: 'Anime', icon: 'ri-ghost-line', link: '/anime' },
    { id: 'movies', name: 'Movies', icon: 'ri-film-line', link: '/peliculas' },
    { id: 'series', name: 'Series', icon: 'ri-tv-line', link: '/series' },
    { id: 'sports', name: 'Sports', icon: 'ri-basketball-line', link: '/deportes' },
];

export default function Home() {
    const [trendingAnime, setTrendingAnime] = useState<any[]>([]);
    const [popularAnime, setPopularAnime] = useState<any[]>([]);
    const [latestAnime, setLatestAnime] = useState<any[]>([]);
    const [trendingMovies, setTrendingMovies] = useState<any[]>([]);
    const [topRatedMovies, setTopRatedMovies] = useState<any[]>([]);
    const [nowPlayingMovies, setNowPlayingMovies] = useState<any[]>([]);
    const [actionMovies, setActionMovies] = useState<any[]>([]);
    const [trendingSeries, setTrendingSeries] = useState<any[]>([]);
    const [topRatedSeries, setTopRatedSeries] = useState<any[]>([]);
    const [popularSeries, setPopularSeries] = useState<any[]>([]);
    const [liveSports, setLiveSports] = useState<any[]>([]);
    const [heroItems, setHeroItems] = useState<(TMDBMovie | TMDBSeries)[]>([]);
    const [activeCategory, setActiveCategory] = useState('all');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAllData = async () => {
            setIsLoading(true);
            try {
                // Fetch all data in parallel but handle failures individually
                const [
                    animeResult,
                    moviesResult,
                    seriesResult,
                    sportsResult,
                    topRatedMoviesRes,
                    nowPlayingMoviesRes,
                    topRatedSeriesRes,
                    popularSeriesRes,
                    actionMoviesRes
                ] = await Promise.allSettled([
                    getHomePage(),
                    getTrendingMovies(),
                    getTrendingSeries(),
                    getLiveMatches(),
                    getTopRatedMovies(),
                    getNowPlayingMovies(),
                    getTopRatedSeries(),
                    getPopularSeries(),
                    getMoviesByGenre(28) // Action Movies
                ]);

                // Handle Anime Data
                if (animeResult.status === 'fulfilled' && animeResult.value) {
                    const homeData = animeResult.value;
                    if (homeData.trending && Array.isArray(homeData.trending)) setTrendingAnime(homeData.trending.map(animeToContent));
                    if (homeData.mostPopular && Array.isArray(homeData.mostPopular)) setPopularAnime(homeData.mostPopular.map(animeToContent));
                    if (homeData.latestEpisodes && Array.isArray(homeData.latestEpisodes)) setLatestAnime(homeData.latestEpisodes.map(animeToContent));
                } else {
                    console.error("Anime fetch failed", animeResult.status === 'rejected' ? animeResult.reason : 'No data');
                }

                // Handle Movies Data
                if (moviesResult.status === 'fulfilled' && Array.isArray(moviesResult.value)) {
                    setTrendingMovies(moviesResult.value.slice(0, 10).map(movieToContent));
                }
                if (topRatedMoviesRes.status === 'fulfilled' && Array.isArray(topRatedMoviesRes.value)) {
                    setTopRatedMovies(topRatedMoviesRes.value.slice(0, 10).map(movieToContent));
                }
                if (nowPlayingMoviesRes.status === 'fulfilled' && Array.isArray(nowPlayingMoviesRes.value)) {
                    setNowPlayingMovies(nowPlayingMoviesRes.value.slice(0, 10).map(movieToContent));
                }
                if (actionMoviesRes.status === 'fulfilled' && Array.isArray(actionMoviesRes.value)) {
                    setActionMovies(actionMoviesRes.value.slice(0, 10).map(movieToContent));
                }

                // Handle Series Data
                if (seriesResult.status === 'fulfilled' && Array.isArray(seriesResult.value)) {
                    setTrendingSeries(seriesResult.value.slice(0, 10).map(seriesToContent));
                }
                if (topRatedSeriesRes.status === 'fulfilled' && Array.isArray(topRatedSeriesRes.value)) {
                    setTopRatedSeries(topRatedSeriesRes.value.slice(0, 10).map(seriesToContent));
                }
                if (popularSeriesRes.status === 'fulfilled' && Array.isArray(popularSeriesRes.value)) {
                    setPopularSeries(popularSeriesRes.value.slice(0, 10).map(seriesToContent));
                }

                // Handle Hero Items (Movies + Series)
                const movies = (moviesResult.status === 'fulfilled' && Array.isArray(moviesResult.value)) ? moviesResult.value : [];
                const series = (seriesResult.status === 'fulfilled' && Array.isArray(seriesResult.value)) ? seriesResult.value : [];
                setHeroItems([...movies.slice(0, 5), ...series.slice(0, 5)]);

                // Handle Sports Data
                if (sportsResult.status === 'fulfilled' && Array.isArray(sportsResult.value) && sportsResult.value.length > 0) {
                    setLiveSports(sportsResult.value.slice(0, 8).map(matchToContent));
                } else {
                    console.error("Sports fetch failed", sportsResult.status === 'rejected' ? sportsResult.reason : 'No/Invalid data');
                    setLiveSports(mockSportsFallback);
                }

            } catch (err) {
                console.error("Unexpected error in data fetch", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAllData();
    }, []);

    if (isLoading) return <PremiumLoader />;

    return (
        <main className="min-h-screen bg-transparent relative">
            <DynamicHeroBanner items={heroItems} />

            {/* Category Bar - Glass Effect */}
            <div className="z-40 bg-[#020204]/60 backdrop-blur-xl border-b border-white/5 supports-[backdrop-filter]:bg-[#020204]/60">
                <div className="w-full px-6 md:px-12">
                    <div className="flex items-center gap-3 py-3 overflow-x-auto scrollbar-hide">
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                className={`flex items-center gap-2.5 px-6 py-3 rounded-2xl text-xs font-display font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-300 border ${activeCategory === cat.id
                                    ? 'bg-white text-black border-white scale-105 shadow-[0_0_25px_rgba(255,255,255,0.25)]'
                                    : 'bg-white/5 text-gray-400 border-white/5 hover:bg-white/10 hover:text-white hover:border-white/20'
                                    }`}
                            >
                                <i className={`${cat.icon} text-lg`}></i>
                                <span>{cat.name}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content Sections - Tight Spacing */}
            <div className="relative z-10 pt-2 pb-16">
                {/* Trending Anime */}
                {(activeCategory === 'all' || activeCategory === 'anime') && trendingAnime.length > 0 && (
                    <ContentRow
                        title="Trending Now"
                        items={trendingAnime}
                        seeAllLink="/anime"
                        getLink={(item) => `/anime/watch/${item.id}`}
                        titleClassName="text-gradient"
                    />
                )}

                {/* Popular Anime */}
                {(activeCategory === 'all' || activeCategory === 'anime') && popularAnime.length > 0 && (
                    <ContentRow
                        title="Most Popular"
                        items={popularAnime}
                        seeAllLink="/anime"
                        getLink={(item) => `/anime/watch/${item.id}`}
                    />
                )}

                {/* Featured Movies - Trending */}
                {(activeCategory === 'all' || activeCategory === 'movies') && trendingMovies.length > 0 && (
                    <ContentRow
                        title="Featured Movies"
                        items={trendingMovies}
                        seeAllLink="/peliculas"
                        getLink={(item) => `/watch/movie/${item.id}`}
                    />
                )}

                {/* Now Playing Movies */}
                {(activeCategory === 'all' || activeCategory === 'movies') && nowPlayingMovies.length > 0 && (
                    <ContentRow
                        title="Now in Cinemas"
                        items={nowPlayingMovies}
                        seeAllLink="/peliculas"
                        getLink={(item) => `/watch/movie/${item.id}`}
                    />
                )}

                {/* Top Rated Movies */}
                {(activeCategory === 'all' || activeCategory === 'movies') && topRatedMovies.length > 0 && (
                    <ContentRow
                        title="Critically Acclaimed Movies"
                        items={topRatedMovies}
                        seeAllLink="/peliculas"
                        getLink={(item) => `/watch/movie/${item.id}`}
                    />
                )}

                {/* Action Movies */}
                {(activeCategory === 'all' || activeCategory === 'movies') && actionMovies.length > 0 && (
                    <ContentRow
                        title="Adrenaline Rush"
                        items={actionMovies}
                        seeAllLink="/peliculas"
                        getLink={(item) => `/watch/movie/${item.id}`}
                    />
                )}

                {/* Premium Series - Trending */}
                {(activeCategory === 'all' || activeCategory === 'series') && trendingSeries.length > 0 && (
                    <ContentRow
                        title="Premium Series"
                        items={trendingSeries}
                        seeAllLink="/series"
                        getLink={(item) => `/watch/tv/${item.id}`}
                        titleClassName="text-gradient-gold"
                    />
                )}

                {/* Top Rated Series */}
                {(activeCategory === 'all' || activeCategory === 'series') && topRatedSeries.length > 0 && (
                    <ContentRow
                        title="All-Time Best Series"
                        items={topRatedSeries}
                        seeAllLink="/series"
                        getLink={(item) => `/watch/tv/${item.id}`}
                    />
                )}

                {/* Popular Series */}
                {(activeCategory === 'all' || activeCategory === 'series') && popularSeries.length > 0 && (
                    <ContentRow
                        title="Most Watched Shows"
                        items={popularSeries}
                        seeAllLink="/series"
                        getLink={(item) => `/watch/tv/${item.id}`}
                    />
                )}

                {/* Latest Episodes */}
                {(activeCategory === 'all' || activeCategory === 'anime') && latestAnime.length > 0 && (
                    <ContentRow
                        title="New Anime Episodes"
                        items={latestAnime}
                        seeAllLink="/anime"
                        getLink={(item) => `/anime/watch/${item.id}`}
                    />
                )}

                {/* Live Sports */}
                {(activeCategory === 'all' || activeCategory === 'sports') && liveSports.length > 0 && (
                    <ContentRow
                        title="Live Sports"
                        items={liveSports}
                        seeAllLink="/deportes"
                        getLink={(item: any) => {
                            if (item.sources && item.sources.length > 0) {
                                const source = item.sources[0];
                                return `/deportes/watch/${source.source}/${source.id}?title=${encodeURIComponent(item.title?.english || '')}&category=${item.category || 'sports'}`;
                            }
                            return `/deportes`;
                        }}
                        variant="live"
                    />
                )}

                {/* Premium CTA - Cosmic Vibe */}
                <section className="w-full px-6 md:px-12 py-8">
                    <div className="relative bg-gradient-to-r from-[#0f0f13] to-[#16161c] rounded-3xl p-8 md:p-10 overflow-hidden border border-white/5 group hover:border-violet-500/30 transition-all duration-500 shadow-2xl shadow-black/50">
                        {/* Animated Background Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-r from-violet-600/10 via-fuchsia-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                        <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
                            <div className="flex items-center gap-6">
                                <div className="relative">
                                    <PremiumLoader />
                                </div>
                                <div>
                                    <h3 className="font-display font-black text-2xl text-white mb-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-violet-200 transition-all">
                                        Upgrade to Premium
                                    </h3>
                                    <p className="text-gray-400 text-sm font-medium tracking-wide">
                                        4K HDR • Zero Ads • Offline Downloads • <span className="text-violet-400">Early Access</span>
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <button className="px-8 py-3.5 rounded-xl bg-white text-black font-black text-sm hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)]">
                                    Try Free 7 Days
                                </button>
                                <button className="px-8 py-3.5 rounded-xl bg-white/5 text-white font-bold text-sm border border-white/10 hover:bg-white/10 hover:border-violet-500/50 transition-all backdrop-blur-md">
                                    View Plans
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            {/* Footer - Compact */}
            <footer className="border-t border-white/5 bg-[#050507]">
                <div className="w-full px-6 md:px-12 py-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-3">
                            <NovaLogo className="w-8 h-8" />
                            <span className="font-display font-bold text-xl text-white">NOVA</span>
                        </div>
                        <div className="flex items-center gap-6 text-sm text-gray-400">
                            <Link to="/anime" className="hover:text-white transition-colors">Anime</Link>
                            <Link to="/peliculas" className="hover:text-white transition-colors">Movies</Link>
                            <Link to="/series" className="hover:text-white transition-colors">Series</Link>
                            <Link to="/deportes" className="hover:text-white transition-colors">Sports</Link>
                        </div>
                        <div className="flex items-center gap-4 text-gray-500 text-sm">
                            <a href="#" className="hover:text-white transition-colors">Privacy</a>
                            <a href="#" className="hover:text-white transition-colors">Terms</a>
                            <span>© 2024 NOVA</span>
                        </div>
                    </div>
                </div>
            </footer>
        </main>
    );
}
