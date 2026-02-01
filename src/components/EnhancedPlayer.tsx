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

            {/* Controls Overlay - Top Right Group */}
            <div className="absolute top-4 right-4 z-50 flex items-center gap-2 pointer-events-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300">

                {/* Status Indicator (Compact) */}
                <div className={`h-8 px-3 rounded-full backdrop-blur-md border text-[10px] font-black flex items-center gap-1.5 shadow-lg select-none ${isLocked
                    ? 'bg-black/60 border-nova-accent/30 text-nova-accent'
                    : 'bg-yellow-500/10 border-yellow-500/30 text-yellow-500'
                    }`}>
                    <i className={isLocked ? "ri-shield-check-fill" : "ri-shield-keyhole-line"}></i>
                    <span>{isLocked ? "SECURE" : "UNLOCKED"}</span>
                </div>

                {/* Unlock Toggle Button (Minimalist) */}
                <button
                    onClick={() => setIsLocked(!isLocked)}
                    className="h-8 px-3 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 rounded-full text-white text-xs font-bold transition-all flex items-center gap-2"
                    title={isLocked ? "Video issues? Click to unlock" : "Restore protection"}
                >
                    <i className={isLocked ? "ri-tools-fill" : "ri-lock-fill"}></i>
                    <span className="hidden group-hover:inline">{isLocked ? "Fix Video" : "Restore"}</span>
                </button>
            </div>
        </div>
    );
}
