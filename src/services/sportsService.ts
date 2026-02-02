import axios from 'axios';

// Streamed.pk API Configuration
// Streamed.pk API Configuration
const STREAMED_BASE_URL = '/api/sports';
const STREAMED_IMAGE_BASE = '/api/sports/images';

// Create Axios instance
const streamedApi = axios.create({
    baseURL: STREAMED_BASE_URL,
    timeout: 10000,
});

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
    return `${STREAMED_IMAGE_BASE}/badge/${badge}.webp`;
};

export const getMatchPosterUrl = (poster: string | undefined, match?: Match): string => {
    // If poster field is provided and starts with a path, use it directly
    if (poster && poster.startsWith('/')) {
        return `https://streamed.pk${poster}.webp`;
    }
    // Use proxy endpoint for poster ID
    if (poster) {
        return `${STREAMED_IMAGE_BASE}/proxy/${poster}.webp`;
    }
    // Fallback: Try to construct from team badges if available
    if (match?.teams?.home?.badge && match?.teams?.away?.badge) {
        return `${STREAMED_IMAGE_BASE}/poster/${match.teams.home.badge}/${match.teams.away.badge}.webp`;
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

/**
 * Get currently live matches
 */
export const getLiveMatches = async (): Promise<Match[]> => {
    try {
        const response = await streamedApi.get('/matches/live');
        return response.data || [];
    } catch (error) {
        console.error('Error fetching live matches:', error);
        return [];
    }
};

/**
 * Get today's matches
 */
export const getTodaysMatches = async (): Promise<Match[]> => {
    try {
        const response = await streamedApi.get('/matches/all-today');
        return response.data || [];
    } catch (error) {
        console.error("Error fetching today's matches:", error);
        return [];
    }
};

/**
 * Get popular matches across all sports
 */
export const getPopularMatches = async (): Promise<Match[]> => {
    try {
        const response = await streamedApi.get('/matches/all/popular');
        return response.data || [];
    } catch (error) {
        console.error('Error fetching popular matches:', error);
        return [];
    }
};

/**
 * Get matches for a specific sport
 */
export const getMatchesBySport = async (sport: string): Promise<Match[]> => {
    try {
        const response = await streamedApi.get(`/matches/${sport}`);
        return response.data || [];
    } catch (error) {
        console.error(`Error fetching ${sport} matches:`, error);
        return [];
    }
};

/**
 * Get stream links for a specific match source (Mock)
 */
/**
 * Get stream links for a specific match source
 */
export const getStreams = async (source: string, id: string): Promise<Stream[]> => {
    try {
        const response = await streamedApi.get(`/stream/${source}/${id}`);
        return response.data || [];
    } catch (error) {
        console.error('Error fetching streams:', error);
        return [];
    }
};

/**
 * Get all available sport categories
 */
export const getSportCategories = async (): Promise<Sport[]> => {
    try {
        const response = await streamedApi.get('/sports');
        return response.data || [];
    } catch (error) {
        console.error('Error fetching sport categories:', error);
        return [];
    }
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
