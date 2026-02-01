// Anime API Service - connects to anime streaming API
const API_BASE_URL = '/api';

//Types
export interface AnimeResult {
    id: string;
    data_id?: string;
    title: string;
    japanese_title?: string;
    poster: string;
    description?: string;
    tvInfo?: {
        showType: string;
        duration?: string;
        rating?: string;
        sub: number;
        dub: number;
        eps: number;
    };
}

export interface Episode {
    episode_no: number;
    id: string;
    title: string;
    japanese_title?: string;
    filler: boolean;
}

export interface Server {
    type: 'sub' | 'dub';
    data_id: string;
    server_id: string;
    serverName: string;
}

export interface StreamingLink {
    id: string;
    type: 'sub' | 'dub';
    link: { file: string; type: string };
    tracks: Array<{ file: string; label: string; kind: string; default?: boolean }>;
    intro: { start: number; end: number };
    outro: { start: number; end: number };
    iframe: string;
    server: string;
}

export interface StreamResponse {
    success: boolean;
    results: {
        streamingLink: StreamingLink;
        servers: Server[];
    };
}

export interface HomePageData {
    spotlights: AnimeResult[];
    trending: AnimeResult[];
    topAiring: AnimeResult[];
    mostPopular: AnimeResult[];
    latestEpisodes: AnimeResult[];
    genres: string[];
}

// API Functions
export async function getHomePage(): Promise<HomePageData | null> {
    try {
        const response = await fetch(`${API_BASE_URL}/home`);
        if (!response.ok) throw new Error('Failed to fetch home page');
        const data = await response.json();
        return data.results || null;
    } catch (error) {
        console.error('Home page fetch error:', error);
        return null;
    }
}

export async function searchAnime(query: string): Promise<AnimeResult[]> {
    try {
        const response = await fetch(`${API_BASE_URL}/search?keyword=${encodeURIComponent(query)}`);
        if (!response.ok) throw new Error('Failed to search anime');
        const data = await response.json();

        let rawResults: any[] = [];
        if (data.results?.data && Array.isArray(data.results.data)) {
            rawResults = data.results.data;
        } else if (Array.isArray(data.results)) {
            rawResults = data.results;
        }

        // Normalize title from object to string
        return rawResults.map((item: any) => ({
            ...item,
            title: typeof item.title === 'object'
                ? (item.title?.english || item.title?.native || item.title?.romaji || 'Unknown')
                : (item.title || 'Unknown'),
            poster: item.poster || item.image || '',
        }));
    } catch (error) {
        console.error('Anime search error:', error);
        return [];
    }
}

export async function getAnimeInfo(animeId: string): Promise<AnimeResult | null> {
    try {
        const response = await fetch(`${API_BASE_URL}/info?id=${encodeURIComponent(animeId)}`);
        if (!response.ok) throw new Error('Failed to fetch anime info');
        const data = await response.json();
        return data.results || null;
    } catch (error) {
        console.error('Anime info fetch error:', error);
        return null;
    }
}

export async function getAnimeEpisodes(animeId: string): Promise<{ totalEpisodes: number; episodes: Episode[] }> {
    try {
        const response = await fetch(`${API_BASE_URL}/episodes/${encodeURIComponent(animeId)}`);
        if (!response.ok) throw new Error('Failed to fetch episodes');
        const data = await response.json();
        if (data.results) {
            return {
                totalEpisodes: data.results.totalEpisodes || 0,
                episodes: data.results.episodes || []
            };
        }
        return { totalEpisodes: 0, episodes: [] };
    } catch (error) {
        console.error('Episodes fetch error:', error);
        return { totalEpisodes: 0, episodes: [] };
    }
}

export async function getAnimeServers(episodeId: string): Promise<Server[]> {
    try {
        const response = await fetch(`${API_BASE_URL}/servers/${encodeURIComponent(episodeId)}`);
        if (!response.ok) throw new Error('Failed to fetch servers');
        const data = await response.json();
        return data.results || [];
    } catch (error) {
        console.error('Servers fetch error:', error);
        return [];
    }
}

export async function getStreamUrl(
    episodeId: string,
    server: string = 'hd-1',
    type: 'sub' | 'dub' = 'sub'
): Promise<StreamResponse | null> {
    try {
        const response = await fetch(
            `${API_BASE_URL}/stream?id=${encodeURIComponent(episodeId)}&server=${server}&type=${type}`
        );
        if (!response.ok) throw new Error('Failed to fetch stream');
        const data = await response.json();
        return data as StreamResponse;
    } catch (error) {
        console.error('Stream fetch error:', error);
        return null;
    }
}

export function animeToContent(anime: AnimeResult): any {
    return {
        id: anime.id,
        title: { english: anime.title, native: anime.japanese_title },
        image: anime.poster,
        rating: 85 + Math.floor(Math.random() * 15), // Random rating 85-100
        type: anime.tvInfo?.showType || 'TV',
        releaseDate: '2024',
    };
}
