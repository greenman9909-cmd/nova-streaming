import { useState } from 'react';

interface EnhancedPlayerProps {
    src: string;
    title: string;
    poster?: string | null | undefined;
}

export default function EnhancedPlayer({ src, title, poster }: EnhancedPlayerProps) {
    // Default to STRICT sandbox (No popups) to satisfy "Remove Redirects" request
    // Allow user to toggle if stream fails
    const [isLocked, setIsLocked] = useState(true);

    const sandboxRules = isLocked
        ? "allow-forms allow-pointer-lock allow-same-origin allow-scripts allow-top-navigation-by-user-activation" // No allow-popups
        : "allow-forms allow-pointer-lock allow-same-origin allow-scripts allow-top-navigation-by-user-activation allow-popups"; // Allow popups (needed for some servers)

    return (
        <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl mb-6 relative group border border-white/5">
            <iframe
                src={src}
                className="w-full h-full border-0 rounded-2xl bg-black"
                allowFullScreen
                title={title}
                referrerPolicy="origin"
                sandbox={sandboxRules}
                style={{ backgroundImage: `url(${poster || ''})`, backgroundSize: 'cover' }}
            />

            {/* Controls Overlay */}
            <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 items-end pointer-events-none">
                {/* Status Indicator */}
                <div className={`px-3 py-1.5 rounded-full backdrop-blur-md border text-[10px] font-black flex items-center gap-1.5 shadow-lg transition-all ${isLocked
                    ? 'bg-black/60 border-nova-accent/30 text-nova-accent shadow-nova-accent/10'
                    : 'bg-yellow-500/10 border-yellow-500/30 text-yellow-500'
                    }`}>
                    <i className={isLocked ? "ri-shield-check-fill" : "ri-shield-keyhole-line"}></i>
                    {isLocked ? "AD-BLOCK ACTIVE" : "ADS UNLOCKED"}
                </div>
            </div>

            {/* Unlock Switch - Visible on Hover or if stream might be broken */}
            <div className="absolute bottom-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={() => setIsLocked(!isLocked)}
                    className="pointer-events-auto flex items-center gap-2 px-3 py-2 bg-black/80 backdrop-blur-md border border-white/10 hover:bg-white/10 rounded-xl text-xs font-bold text-white transition-all hover:scale-105 active:scale-95"
                    title={isLocked ? "Click if video doesn't load" : "Click to block ads again"}
                >
                    <i className={isLocked ? "ri-lock-unlock-line" : "ri-lock-fill"}></i>
                    {isLocked ? "Video not loading? Unlock" : "Restore Ad-Block"}
                </button>
            </div>
        </div>
    );
}
