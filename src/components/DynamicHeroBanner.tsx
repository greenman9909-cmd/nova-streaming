import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    getBackdropUrl,
    getMovieVideos,
    getSeriesVideos,
    TMDBMovie,
    TMDBSeries
} from '../services/api';

interface DynamicHeroBannerProps {
    items: (TMDBMovie | TMDBSeries)[];
}

const DynamicHeroBanner: React.FC<DynamicHeroBannerProps> = ({ items }) => {
    const navigate = useNavigate();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [videoKey, setVideoKey] = useState<string | null>(null);
    const [showVideo, setShowVideo] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    const videoTimerRef = useRef<NodeJS.Timeout | null>(null);
    const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

    const currentItem = items[currentIndex];
    const isMovie = currentItem ? 'title' in currentItem : false;
    const title = currentItem ? ('title' in currentItem ? currentItem.title : (currentItem as TMDBSeries).name) : '';

    // Auto-advance carousel
    useEffect(() => {
        if (items.length === 0) return;
        autoPlayRef.current = setInterval(() => {
            handleNext();
        }, 10000);
        return () => {
            if (autoPlayRef.current) clearInterval(autoPlayRef.current);
        };
    }, [currentIndex, items.length]);

    // Fetch video and handle delayed playback
    useEffect(() => {
        if (!currentItem) return;
        const fetchVideo = async () => {
            setShowVideo(false);
            setVideoKey(null);
            if (videoTimerRef.current) clearTimeout(videoTimerRef.current);
            try {
                const videos = isMovie
                    ? await getMovieVideos(currentItem.id)
                    : await getSeriesVideos(currentItem.id);

                // Prioritize: Official Trailer > Clip > Featurette > Any Trailer
                const youtubeVideos = videos.filter((v: any) => v.site === 'YouTube');
                const officialTrailer = youtubeVideos.find((v: any) => v.type === 'Trailer' && v.official === true);
                const clip = youtubeVideos.find((v: any) => v.type === 'Clip');
                const featurette = youtubeVideos.find((v: any) => v.type === 'Featurette');
                const anyTrailer = youtubeVideos.find((v: any) => v.type === 'Trailer');

                const bestVideo = officialTrailer || clip || featurette || anyTrailer;
                if (bestVideo) {
                    setVideoKey(bestVideo.key);
                    // Fast trailer loading - 1.5 seconds
                    videoTimerRef.current = setTimeout(() => {
                        setShowVideo(true);
                    }, 1500);
                }
            } catch (err) {
                console.error("Failed to fetch trailer", err);
            }
        };
        fetchVideo();
        return () => {
            if (videoTimerRef.current) clearTimeout(videoTimerRef.current);
        };
    }, [currentIndex, currentItem?.id, isMovie]);

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % items.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
    };

    if (!currentItem) return null;

    return (
        <section className="relative w-full h-[75vh] min-h-[550px] overflow-hidden bg-[#0a0a0f] text-white select-none" style={{ fontFamily: "'Amazon Ember', 'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
            {/* Background Layer */}
            <div className="absolute inset-0">
                <img
                    src={getBackdropUrl(currentItem.backdrop_path, 'original') || ''}
                    alt={title}
                    className={`w-full h-full object-cover object-top transition-opacity duration-1000 ${showVideo ? 'opacity-0' : 'opacity-100'}`}
                />
                {videoKey && showVideo && (
                    <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
                        <iframe
                            src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&mute=${isMuted ? 1 : 0}&controls=0&loop=1&playlist=${videoKey}&rel=0&showinfo=0&iv_load_policy=3&modestbranding=1&playsinline=1&vq=hd1080`}
                            className="absolute w-[180%] h-[180%] left-[-40%] top-[-40%] border-none"
                            allow="autoplay; encrypted-media"
                            title="Trailer"
                        />
                    </div>
                )}
                {/* Gradients for seamless blending with homepage */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0f] via-[#0a0a0f]/60 to-transparent" style={{ width: '65%' }} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0f] to-transparent" />
            </div>

            {/* Volume Button - Prime Video Style */}
            {showVideo && videoKey && (
                <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="absolute top-24 right-8 z-30 w-12 h-12 rounded-full bg-black/40 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white hover:bg-black/60 transition-all"
                >
                    <i className={`${isMuted ? 'ri-volume-mute-line' : 'ri-volume-up-line'} text-xl`}></i>
                </button>
            )}

            {/* Content */}
            <div className="relative z-20 h-full flex flex-col justify-end pb-20 px-[5%] max-w-3xl">
                {/* Title - Bebas Neue for Prime-style condensed bold */}
                <h1 className="text-[52px] md:text-[68px] font-normal uppercase tracking-wide leading-[1] mb-2" style={{ fontFamily: "'Bebas Neue', 'Impact', sans-serif", letterSpacing: '0.02em' }}>
                    {title}
                </h1>

                {/* Ranking Badge - #1 in Spain style */}
                <div className="flex items-center gap-2 mb-4">
                    <span className="text-[#f5c518] font-bold text-sm tracking-wide">#1 Trending</span>
                </div>

                {/* Description - EXACT MATCH */}
                <p className="text-[15px] md:text-[16px] text-white/90 leading-[1.5] mb-6 max-w-xl line-clamp-2" style={{ fontWeight: 400 }}>
                    {currentItem.overview}
                </p>

                {/* Action Buttons - EXACT PRIME STYLE */}
                <div className="flex items-center gap-3 mb-6">
                    {/* Play Button */}
                    <button
                        onClick={() => {
                            if (isMovie) {
                                navigate(`/watch/movie/${currentItem.id}`);
                            } else {
                                // Check if it's an Anime/Animation (Genre 16)
                                const isAnime = currentItem.genre_ids?.includes(16);
                                if (isAnime) {
                                    navigate(`/anime/watch/${currentItem.id}`);
                                } else {
                                    navigate(`/watch/tv/${currentItem.id}`);
                                }
                            }
                        }}
                        className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-white/90 text-black rounded-md font-semibold text-[15px] transition-all shadow-lg"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                        <span>Watch now</span>
                    </button>

                    {/* Add to Watchlist */}
                    <button className="flex items-center justify-center w-11 h-11 rounded-full bg-white/10 border-2 border-white/50 hover:bg-white/20 hover:border-white transition-all">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path d="M12 5v14M5 12h14" />
                        </svg>
                    </button>

                    {/* Info Button */}
                    <button className="flex items-center justify-center w-11 h-11 rounded-full bg-white/10 border-2 border-white/50 hover:bg-white/20 hover:border-white transition-all">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 16v-4M12 8h.01" />
                        </svg>
                    </button>
                </div>

                {/* Included with Prime - EXACT */}
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-[#00a8e1] flex items-center justify-center">
                        <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <span className="text-white text-[13px] font-medium">Included with Nova</span>
                </div>
            </div>

            {/* Pagination Dots - Prime Style */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 z-30">
                {items.slice(0, 6).map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrentIndex(i)}
                        className={`transition-all duration-300 rounded-sm ${i === currentIndex ? 'w-6 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/60'}`}
                    />
                ))}
            </div>

            {/* Age Rating Badge - Bottom Right */}
            <div className="absolute bottom-8 right-12 bg-black/50 backdrop-blur-sm border border-white/30 px-2.5 py-1 rounded text-[11px] font-bold text-white/90 z-30">
                16+
            </div>

            {/* Navigation Arrows */}
            <button
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-1 text-white/40 hover:text-white transition-all z-30"
            >
                <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path d="M15 19l-7-7 7-7" />
                </svg>
            </button>
            <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-white/40 hover:text-white transition-all z-30"
            >
                <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path d="M9 5l7 7-7 7" />
                </svg>
            </button>
        </section>
    );
};

export default DynamicHeroBanner;
