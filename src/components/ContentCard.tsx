import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getMovieVideos, getSeriesVideos } from '../services/api';

interface ContentCardProps {
    id: string;
    title: string;
    image: string;
    rating?: number;
    type?: string;
    year?: string;
    link?: string;
    badge?: string;
    isLive?: boolean;
    tmdbId?: number;
    mediaType?: 'movie' | 'tv';
}

export default function ContentCard({ id, title, image, rating, type, year, link, badge, isLive, tmdbId, mediaType }: ContentCardProps) {
    const [imgError, setImgError] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [trailerKey, setTrailerKey] = useState<string | null>(null);
    const [trailerLoaded, setTrailerLoaded] = useState(false);
    const hoverTimeout = useRef<NodeJS.Timeout | null>(null);

    // Fetch trailer on first hover
    useEffect(() => {
        if (isHovered && tmdbId && !trailerKey) {
            hoverTimeout.current = setTimeout(async () => {
                try {
                    const videos = mediaType === 'movie'
                        ? await getMovieVideos(tmdbId)
                        : await getSeriesVideos(tmdbId);

                    // Find trailer
                    const trailer = videos.find((v: any) => v.type === 'Trailer' && v.site === 'YouTube')
                        || videos.find((v: any) => v.type === 'Teaser' && v.site === 'YouTube')
                        || videos[0];

                    if (trailer?.key) {
                        setTrailerKey(trailer.key);
                    }
                } catch (err) {
                    console.log('No trailer found');
                }
            }, 600); // Delay before fetching trailer
        }

        return () => {
            if (hoverTimeout.current) {
                clearTimeout(hoverTimeout.current);
            }
        };
    }, [isHovered, tmdbId, trailerKey, mediaType]);

    // Reset trailer when mouse leaves
    const handleMouseLeave = () => {
        setIsHovered(false);
        setTrailerLoaded(false);
    };

    return (
        <Link
            to={link || `/watch/${id}-episode-1`}
            className="group block flex-shrink-0 w-36 md:w-44"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
        >
            <div className="relative aspect-[2/3] rounded-xl overflow-hidden mb-2 bg-gray-900 transition-all duration-300 group-hover:transform group-hover:scale-105 group-hover:shadow-[0_0_25px_rgba(139,92,246,0.4)] z-0">

                {/* Holographic Sheen Layer */}
                <div className="absolute inset-0 z-10 opacity-0 group-hover:opacity-30 pointer-events-none bg-gradient-to-tr from-transparent via-white to-transparent -translate-x-full group-hover:animate-holographic"></div>

                {/* Border Glow - Purple on hover */}
                <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-violet-500/50 transition-colors z-20"></div>

                {/* Image */}
                {!imgError ? (
                    <img
                        src={image}
                        alt={title}
                        className={`w-full h-full object-cover transition-all duration-700 ${isHovered ? 'scale-110' : 'scale-100'} ${trailerLoaded ? 'opacity-0' : 'opacity-100'}`}
                        loading="lazy"
                        onError={() => setImgError(true)}
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-800 text-gray-500 p-3 text-center">
                        <i className="ri-film-line text-3xl mb-2"></i>
                        <span className="text-[10px] font-medium line-clamp-2">{title}</span>
                    </div>
                )}

                {/* Trailer Video - Plays on hover after delay */}
                {isHovered && trailerKey && (
                    <div className={`absolute inset-0 z-5 transition-opacity duration-500 ${trailerLoaded ? 'opacity-100' : 'opacity-0'}`}>
                        <iframe
                            src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=1&controls=0&showinfo=0&rel=0&modestbranding=1&loop=1&playlist=${trailerKey}&start=5&vq=hd1080`}
                            className="w-full h-full object-cover scale-150"
                            allow="autoplay; encrypted-media"
                            allowFullScreen
                            onLoad={() => setTrailerLoaded(true)}
                            style={{ border: 'none', pointerEvents: 'none' }}
                        />
                    </div>
                )}

                {/* Hover Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'} z-10`} />

                {/* Live Badge */}
                {isLive && (
                    <div className="absolute top-2 left-2 flex items-center gap-1 z-30 px-2 py-0.5 rounded bg-red-600/90 backdrop-blur text-white text-[10px] font-bold shadow-lg shadow-red-500/20">
                        <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                        LIVE
                    </div>
                )}

                {/* Badge */}
                {badge && !isLive && (
                    <div className={`absolute top-2 left-2 z-30 px-2 py-0.5 rounded bg-violet-600/90 backdrop-blur text-white text-[10px] font-bold shadow-lg shadow-violet-500/20 transition-opacity ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
                        {badge}
                    </div>
                )}

                {/* NOVA+ Badge - Prime Video Style */}
                <div className="absolute bottom-3 right-3 z-30 flex items-center gap-1 opacity-90">
                    <div className="flex items-center gap-0.5 text-[#00a8e1]">
                        <span className="text-[10px] font-black tracking-tight">nova</span>
                        <span className="text-[10px] font-black text-white">+</span>
                    </div>
                </div>

                {/* Rating */}
                {rating && (
                    <div className={`absolute top-2 right-2 z-30 flex items-center gap-1 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur border border-white/10 transition-opacity ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
                        <i className="ri-star-fill text-amber-400 text-[10px]"></i>
                        <span className="text-white text-[10px] font-bold">{(rating * 10).toFixed(0)}%</span>
                    </div>
                )}

                {/* Play Button - Neon Style */}
                <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 z-30 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
                    <div className={`w-14 h-14 rounded-full bg-violet-500/30 backdrop-blur-md border-2 border-white/60 flex items-center justify-center shadow-[0_0_25px_rgba(139,92,246,0.5)] transition-transform duration-300 group-hover:scale-110`}>
                        <i className="ri-play-fill text-white text-3xl ml-1"></i>
                    </div>
                </div>

                {/* Loading Trailer Indicator */}
                {isHovered && trailerKey && !trailerLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center z-25">
                        <div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                )}

                {/* Bottom Actions */}
                <div className={`absolute bottom-0 left-0 right-0 p-2 z-30 flex items-center justify-center gap-2 transition-all duration-300 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    <button
                        onClick={(e) => { e.preventDefault(); }}
                        className="w-8 h-8 rounded-full bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center text-white hover:bg-violet-500 hover:border-violet-400 hover:shadow-[0_0_10px_rgba(139,92,246,0.4)] transition-all"
                    >
                        <i className="ri-add-line text-lg"></i>
                    </button>
                    <button
                        onClick={(e) => { e.preventDefault(); }}
                        className="w-8 h-8 rounded-full bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center text-white hover:bg-pink-500 hover:border-pink-400 hover:shadow-[0_0_10px_rgba(236,72,153,0.4)] transition-all"
                    >
                        <i className="ri-heart-line text-lg"></i>
                    </button>
                </div>
            </div>

            {/* Title & Info - Compact */}
            <div>
                <h3 className={`font-medium text-xs line-clamp-1 transition-colors duration-300 ${isHovered ? 'text-white' : 'text-gray-300'}`}>
                    {title}
                </h3>
                <div className="flex items-center gap-1.5 mt-0.5 text-gray-500 text-[10px]">
                    {year && <span>{year}</span>}
                    {type && (
                        <>
                            <span>•</span>
                            <span>{type}</span>
                        </>
                    )}
                </div>
            </div>
        </Link>
    );
}
