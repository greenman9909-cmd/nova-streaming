import { useEffect, useRef } from 'react';
import Hls from 'hls.js';

interface EnhancedPlayerProps {
    src: string;
    title: string;
    poster?: string | null | undefined;
}

export default function EnhancedPlayer({ src, title, poster }: EnhancedPlayerProps) {
    const videoRef = useRef<HTMLVideoElement>(null);

    const isHls = src.includes('.m3u8');

    useEffect(() => {
        if (!videoRef.current || !isHls || !src) return;

        let hls: Hls;

        if (Hls.isSupported()) {
            hls = new Hls({
                enableWorker: true,
                lowLatencyMode: true,
            });
            hls.loadSource(src);
            hls.attachMedia(videoRef.current);
        } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
            // Safari native HLS
            videoRef.current.src = src;
        }

        return () => {
            if (hls) {
                hls.destroy();
            }
        };
    }, [src, isHls]);

    return (
        <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl mb-6 relative group border border-white/5">
            {isHls ? (
                <video
                    ref={videoRef}
                    className="w-full h-full object-contain"
                    controls
                    poster={poster || undefined}
                    playsInline
                    title={title}
                />
            ) : (
                <iframe
                    src={src}
                    className="w-full h-full border-0 rounded-2xl bg-black"
                    allowFullScreen
                    title={title}
                    referrerPolicy="origin"
                    style={{ backgroundImage: `url(${poster || ''})`, backgroundSize: 'cover' }}
                />
            )}
        </div>
    );
}
