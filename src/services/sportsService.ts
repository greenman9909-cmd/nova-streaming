import axios from 'axios';

// API Configuration (kept for image helpers, but logic is mocked)
const STREAMED_IMAGE_BASE = '/api/sports/images';

// Types
export interface MatchTeam {
    name: string;
    badge?: string;
}

export interface MatchSource {
    source: string;
    id: string;
}

export interface Match {
    id: string;
    title: string;
    category: string;
    date: number; // Unix timestamp in ms
    poster?: string;
    popular?: boolean;
    teams?: {
        home?: MatchTeam;
        away?: MatchTeam;
    };
    sources: MatchSource[];
}

export interface Stream {
    id: string;
    streamNo: number;
    language: string;
    hd: boolean;
    embedUrl: string;
    source: string;
}

export interface Sport {
    id: string;
    name: string;
}

// Image URL helpers
export const getTeamBadgeUrl = (badge: string | undefined): string => {
    if (!badge) return '';
    // Use a public placeholder or local asset if api proxy is not available
    // For now, we can try to use a generic sports API or just return a placeholder
    return `https://ui-avatars.com/api/?name=${badge}&background=random&color=fff&rounded=true&bold=true`;
};

export const getMatchPosterUrl = (poster: string | undefined, match?: Match): string => {
    // Fallback: Try to construct from team badges if available
    if (match?.teams?.home?.badge && match?.teams?.away?.badge) {
        return `https://ui-avatars.com/api/?name=${match.teams.home.name}+${match.teams.away.name}&background=0D0D11&color=fff&size=500`;
    }
    // Final fallback - sport-specific generic images
    const sportImages: Record<string, string> = {
        football: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=400&q=80',
        basketball: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&q=80',
        tennis: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=400&q=80',
        f1: 'https://images.unsplash.com/photo-1541889766-64879f48c8e4?w=400&q=80',
        motorsport: 'https://images.unsplash.com/photo-1541889766-64879f48c8e4?w=400&q=80',
        cricket: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400&q=80',
        golf: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=400&q=80',
        boxing: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=400&q=80',
        mma: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=400&q=80',
        default: 'https://images.unsplash.com/photo-1461896836934-0c0f71d2?w=400&q=80'
    };
    const category = match?.category?.toLowerCase() || 'default';
    return sportImages[category] || sportImages.default;
};

// Sport icon mapping
export const getSportIcon = (category: string): string => {
    const iconMap: Record<string, string> = {
        football: 'ri-football-line',
        basketball: 'ri-basketball-line',
        tennis: 'ri-ping-pong-line',
        cricket: 'ri-cricket-line',
        baseball: 'ri-baseball-line',
        hockey: 'ri-hockey-line',
        golf: 'ri-golf-line',
        boxing: 'ri-boxing-line',
        mma: 'ri-boxing-line',
        ufc: 'ri-boxing-line',
        motorsport: 'ri-speed-line',
        f1: 'ri-speed-line',
        rugby: 'ri-football-line',
        volleyball: 'ri-volleyball-line',
        handball: 'ri-hand-line',
        afl: 'ri-football-line',
        darts: 'ri-focus-3-line',
        fighting: 'ri-boxing-line',
        default: 'ri-trophy-line',
    };
    return iconMap[category.toLowerCase()] || iconMap.default;
};

// Sport color gradient mapping
export const getSportGradient = (category: string): string => {
    const gradientMap: Record<string, string> = {
        football: 'from-emerald-600 to-lime-600',
        basketball: 'from-orange-600 to-amber-600',
        tennis: 'from-lime-600 to-green-600',
        cricket: 'from-blue-600 to-cyan-600',
        baseball: 'from-red-600 to-rose-600',
        hockey: 'from-sky-600 to-blue-600',
        f1: 'from-red-600 to-orange-600',
        motorsport: 'from-red-600 to-orange-600',
        boxing: 'from-red-700 to-rose-700',
        mma: 'from-red-700 to-rose-700',
        ufc: 'from-red-700 to-rose-700',
        rugby: 'from-green-700 to-emerald-700',
        golf: 'from-green-600 to-lime-600',
        default: 'from-violet-600 to-fuchsia-600',
    };
    return gradientMap[category.toLowerCase()] || gradientMap.default;
};

// --- MOCK DATA GENERATOR ---

// Helper to get time relative to now
const getRelativeTime = (params: { hours?: number; minutes?: number }) => {
    const now = new Date();
    if (params.hours) now.setHours(now.getHours() + params.hours);
    if (params.minutes) now.setMinutes(now.getMinutes() + params.minutes);
    return now.getTime();
};

const generateMockMatches = (): Match[] => [
    {
        id: 'match-1',
        title: 'Real Madrid vs Barcelona',
        category: 'football',
        date: getRelativeTime({ minutes: -45 }),
        popular: true,
        teams: {
            home: { name: 'Real Madrid', badge: 'Real Madrid' },
            away: { name: 'Barcelona', badge: 'Barcelona' }
        },
        sources: [{ source: 'streamed', id: 'rm-vs-barca' }]
    },
    {
        id: 'match-2',
        title: 'Lakers vs Warriors',
        category: 'basketball',
        date: getRelativeTime({ minutes: -20 }),
        popular: true,
        teams: {
            home: { name: 'Lakers', badge: 'Lakers' },
            away: { name: 'Warriors', badge: 'Warriors' }
        },
        sources: [{ source: 'streamed', id: 'lakers-warriors' }]
    },
    {
        id: 'match-3',
        title: 'Man City vs Arsenal',
        category: 'football',
        date: getRelativeTime({ minutes: 15 }),
        popular: true,
        teams: {
            home: { name: 'Man City', badge: 'Man City' },
            away: { name: 'Arsenal', badge: 'Arsenal' }
        },
        sources: [{ source: 'streamed', id: 'mancity-arsenal' }]
    },
    {
        id: 'match-4',
        title: 'Ferrari vs Red Bull',
        category: 'f1',
        date: getRelativeTime({ minutes: -60 }),
        popular: true,
        teams: {
            home: { name: 'Ferrari', badge: 'Ferrari' },
            away: { name: 'Red Bull', badge: 'Red Bull' }
        },
        sources: [{ source: 'streamed', id: 'f1-gp' }]
    },
    {
        id: 'match-5',
        title: 'PSG vs Marseille',
        category: 'football',
        date: getRelativeTime({ minutes: 5 }),
        popular: false,
        teams: {
            home: { name: 'PSG', badge: 'PSG' },
            away: { name: 'Marseille', badge: 'Marseille' }
        },
        sources: [{ source: 'streamed', id: 'psg-om' }]
    },
    {
        id: 'match-6',
        title: 'UFC 300: Main Event',
        category: 'mma',
        date: getRelativeTime({ minutes: -90 }),
        popular: true,
        teams: {
            home: { name: 'Pereira', badge: 'ufc' },
            away: { name: 'Hill', badge: 'ufc' }
        },
        sources: [{ source: 'streamed', id: 'ufc-300' }]
    }
];

// --- CLIENT-SIDE SERVICE FUNCTIONS ---

/**
 * Get currently live matches (Mock)
 */
export const getLiveMatches = async (): Promise<Match[]> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Return mock data directly
    const matches = generateMockMatches();
    // Logic: Matches that started recently or fit the "Live" criteria
    return matches.filter(m => m.date <= Date.now() + 1000 * 60 * 15);
};

/**
 * Get today's matches (Mock)
 */
export const getTodaysMatches = async (): Promise<Match[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return generateMockMatches();
};

/**
 * Get popular matches (Mock)
 */
export const getPopularMatches = async (): Promise<Match[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return generateMockMatches().filter(m => m.popular);
};

/**
 * Get matches for a specific sport (Mock)
 */
export const getMatchesBySport = async (sport: string): Promise<Match[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const matches = generateMockMatches();
    if (sport === 'all') return matches;
    return matches.filter(m => m.category === sport);
};

/**
 * Get stream links for a specific match source (Mock)
 */
export const getStreams = async (source: string, id: string): Promise<Stream[]> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return [
        {
            id: 'stream-1',
            streamNo: 1,
            language: 'English',
            hd: true,
            embedUrl: 'https://vidsrc.to/embed/movie/385687', // Placeholder stream
            source: 'mock'
        },
        {
            id: 'stream-2',
            streamNo: 2,
            language: 'Spanish',
            hd: true,
            embedUrl: 'https://vidsrc.to/embed/movie/385687', // Placeholder stream
            source: 'mock'
        }
    ];
};

/**
 * Get all available sport categories
 */
export const getSportCategories = async (): Promise<Sport[]> => {
    return [
        { id: 'football', name: 'Football' },
        { id: 'basketball', name: 'Basketball' },
        { id: 'hockey', name: 'Hockey' },
        { id: 'tennis', name: 'Tennis' },
        { id: 'f1', name: 'Formula 1' },
        { id: 'mma', name: 'MMA/UFC' }
    ];
};

/**
 * Transform match to content row format for Home page
 */
export const matchToContent = (match: Match) => {
    const isLive = match.date <= Date.now();
    const matchTime = new Date(match.date);

    return {
        id: match.id,
        title: { english: match.title },
        image: getMatchPosterUrl(match.poster, match),
        rating: match.popular ? 95 : 80,
        type: 'Sports',
        releaseDate: isLive ? 'LIVE' : formatMatchTime(matchTime),
        isLive,
        category: match.category,
        teams: match.teams,
        sources: match.sources,
    };
};

/**
 * Format match time for display
 */
export const formatMatchTime = (date: Date): string => {
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (diff < 0) return 'LIVE';
    if (hours < 1) return `${minutes}m`;
    if (hours < 24) return `${hours}h ${minutes}m`;

    return date.toLocaleDateString('en-US', {
        weekday: 'short',
        hour: '2-digit',
        minute: '2-digit'
    });
};

export default streamedApi;
