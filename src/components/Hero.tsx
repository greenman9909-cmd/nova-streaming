import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import NovaLogo from './NovaLogo';
import { getHomePage } from '../services/animeService';

interface FeaturedContent {
    id: string;
    title: string;
    description: string;
    image: string;
    rating: number;
    year: string;
    episodes?: number;
    quality: string;
    type: 'anime' | 'movie' | 'series';
}

// Fallback featured content
const fallbackFeatured: FeaturedContent[] = [
    {
        id: 'solo-leveling-18718',
        title: 'Solo Leveling',
        description: 'In a world where hunters battle deadly monsters, Sung Jinwoo finds himself transformed from the weakest hunter to the most powerful being in existence.',
        image: 'https://s4.anilist.co/file/anilistcdn/media/anime/banner/151807-37yfQA3ym8PA.jpg',
        rating: 98,
        year: '2024',
        episodes: 12,
        quality: '4K HDR',
        type: 'anime'
    },
    {
        id: 'jujutsu-kaisen-2nd-season-17912',
        title: 'Jujutsu Kaisen',
        description: 'Yuji Itadori joins a secret organization to eliminate a powerful Curse named Ryomen Sukuna.',
        image: 'https://s4.anilist.co/file/anilistcdn/media/anime/banner/113415-jQBSkxWAAk83.jpg',
        rating: 88,
        year: '2023',
        episodes: 47,
        quality: '4K',
        type: 'anime'
    },
    {
        id: 'frieren-beyond-journeys-end-18542',
        title: "Frieren: Beyond Journey's End",
        description: 'After defeating the Demon King, the elven mage Frieren begins a new journey to understand humanity.',
        image: 'https://s4.anilist.co/file/anilistcdn/media/anime/banner/154587-ivXNJ23SM1xB.jpg',
        rating: 96,
        year: '2023',
        episodes: 28,
        quality: '4K',
        type: 'anime'
    }
];

export default function Hero() {
    const [featured, setFeatured] = useState<FeaturedContent[]>(fallbackFeatured);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        const fetchSpotlights = async () => {
            try {
                const homeData = await getHomePage();
                if (homeData?.spotlights && homeData.spotlights.length > 0) {
                    const spotlightData: FeaturedContent[] = homeData.spotlights.slice(0, 5).map((item: any) => ({
                        id: item.id || item.data_id,
                        title: item.title,
                        description: item.description?.slice(0, 150) + '...' || 'Watch now on NOVA',
                        image: item.poster,
                        rating: 95,
                        year: item.tvInfo?.year || '2024',
                        episodes: item.tvInfo?.eps,
                        quality: '4K HDR',
                        type: 'anime' as const
                    }));
                    setFeatured(spotlightData);
                }
            } catch (err) {
                console.error('Failed to fetch spotlights:', err);
            }
        };
        fetchSpotlights();
    }, []);

    const current = featured[currentIndex];

    useEffect(() => {
        if (isHovered) return;
        const interval = setInterval(() => {
            setIsTransitioning(true);
            setTimeout(() => {
                setCurrentIndex((prev) => (prev + 1) % featured.length);
                setIsTransitioning(false);
            }, 500);
        }, 6000);
        return () => clearInterval(interval);
    }, [isHovered, featured.length]);

    const goToSlide = (index: number) => {
        if (index === currentIndex) return;
        setIsTransitioning(true);
        setTimeout(() => {
            setCurrentIndex(index);
            setIsTransitioning(false);
        }, 500);
    };

    return (
        <section
            className="relative h-[60vh] min-h-[450px] max-h-[550px] overflow-hidden pt-20"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Background Image & Cosmic Overlays */}
            <div className={`absolute inset-0 transition-all duration-700 ${isTransitioning ? 'opacity-0 scale-105' : 'opacity-100 scale-100'}`}>
                <img
                    src={current.image}
                    alt={current.title}
                    className="w-full h-full object-cover object-center"
                />

                {/* Cosmic Overlays */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#020204] via-[#020204]/70 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020204] via-[#020204]/30 to-transparent" />

                {/* Nebula Effect */}
                <div className="absolute inset-0 opacity-40 mix-blend-screen pointer-events-none">
                    <div className="absolute top-[-20%] right-[-10%] w-[80%] h-[120%] bg-violet-600/20 blur-[120px] rounded-full animate-nebula-pulse" />
                    <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[100%] bg-fuchsia-600/10 blur-[100px] rounded-full animate-nebula-pulse-slow" />
                </div>

                {/* Shooting Stars in Hero */}
                <div className="hero-stars absolute inset-0 pointer-events-none opacity-40"></div>

                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#020204] to-transparent" />
            </div>

            {/* Content */}
            <div className="relative z-10 h-full flex items-center">
                <div className="w-full px-[5%]">
                    <div key={currentIndex} className="max-w-xl animate-fade-in-up">
                        {/* Compact Badges */}
                        <div className="flex flex-wrap items-center gap-3 mb-3">
                            <span className="px-2.5 py-1 rounded bg-gradient-to-r from-violet-600 to-purple-600 text-white text-[10px] font-bold uppercase tracking-wider">
                                Featured
                            </span>
                            <span className="text-emerald-400 font-bold text-sm">{current.rating}% Match</span>
                            <span className="text-gray-400 text-sm">{current.year}</span>
                            {current.episodes && (
                                <span className="px-2 py-0.5 rounded border border-gray-600 text-gray-400 text-xs">
                                    {current.episodes} EPS
                                </span>
                            )}
                        </div>

                        {/* Title */}
                        <h1 className="font-display font-black text-3xl md:text-5xl lg:text-5xl text-white mb-3 leading-[1.1] max-w-4xl line-clamp-3 overflow-hidden text-ellipsis">
                            {current.title}
                        </h1>

                        {/* Short Description */}
                        <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-5 max-w-lg line-clamp-2">
                            {current.description}
                        </p>

                        {/* Compact Action Buttons */}
                        <div className="flex items-center gap-3">
                            <Link
                                to={`/${current.type}/${current.id}`}
                                className="flex items-center gap-2 px-6 py-2.5 bg-white text-black font-bold text-sm rounded-lg hover:bg-gray-200 transition-all"
                            >
                                <i className="ri-play-fill text-lg"></i>
                                <span>Watch Now</span>
                            </Link>
                            <button className="flex items-center gap-2 px-6 py-2.5 bg-white/10 backdrop-blur text-white font-semibold text-sm rounded-lg border border-white/20 hover:bg-white/20 transition-all">
                                <i className="ri-add-line text-lg"></i>
                                <span>My List</span>
                            </button>
                            <button className="w-10 h-10 rounded-full bg-white/10 backdrop-blur flex items-center justify-center text-white border border-white/20 hover:bg-white/20 transition-all">
                                <i className="ri-information-line text-lg"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Slide Indicators - Bottom Right */}
            <div className="absolute bottom-6 right-6 flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                    {featured.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`h-1.5 rounded-full transition-all duration-300 ${index === currentIndex
                                ? 'bg-white w-6'
                                : 'bg-white/40 w-1.5 hover:bg-white/60'
                                }`}
                        />
                    ))}
                </div>
                <div className="relative group cursor-pointer">
                    <NovaLogo className="w-10 h-10 opacity-60 group-hover:opacity-100 transition-opacity" />
                </div>
            </div>

            {/* Scroll Hint */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-60 animate-bounce-soft">
                <span className="text-[10px] text-gray-400 uppercase tracking-widest">Scroll</span>
                <i className="ri-arrow-down-s-line text-gray-400"></i>
            </div>
        </section>
    );
}
