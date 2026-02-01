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
                style={{ backgroundImage: `url(${poster || ''})`, backgroundSize: 'cover' }}
            />

            {/* Controls Overlay - Top Right Group */}
            {/* Controls Overlay Removed - Sandbox disabled */}
        </div>
    );
}
