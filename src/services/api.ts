import axios from 'axios';

// TMDB API Configuration
const TMDB_API_KEY = '729a93cf0fdc25dce3300573d5c1f211';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';

// Create Axios instance with interceptor
const tmdbApi = axios.create({
    baseURL: TMDB_BASE_URL,
    params: {
        api_key: TMDB_API_KEY,
        language: 'en-US'
    }
});

// Image URL helpers
export const getImageUrl = (path: string | null, size: 'w500' | 'w780' | 'original' = 'w500') => {
    if (!path) return 'https://via.placeholder.com/500x750?text=No+Image';
    return `${TMDB_IMAGE_BASE}/${size}${path}`;
};

export const getBackdropUrl = (path: string | null, size: 'w780' | 'w1280' | 'original' = 'w1280') => {
    if (!path) return null;
    return `${TMDB_IMAGE_BASE}/${size}${path}`;
};

// Types
export interface TMDBMovie {
    id: number;
    title: string;
    overview: string;
    poster_path: string | null;
    backdrop_path: string | null;
    release_date: string;
    vote_average: number;
    genre_ids: number[];
    genres?: { id: number; name: string }[];
    runtime?: number;
}

export interface TMDBSeries {
    id: number;
    name: string;
    overview: string;
    poster_path: string | null;
    backdrop_path: string | null;
    first_air_date: string;
    vote_average: number;
    genre_ids: number[];
    number_of_seasons?: number;
}

export interface MultiSearchResult {
    id: number;
    media_type: 'movie' | 'tv' | 'person';
    title?: string;
    name?: string;
    poster_path: string | null;
    backdrop_path: string | null;
    release_date?: string;
    first_air_date?: string;
    vote_average: number;
}

export interface TMDBSeason {
    id: number;
    name: string;
    season_number: number;
    episode_count: number;
    poster_path: string | null;
}

export interface TMDBEpisode {
    id: number;
    name: string;
    episode_number: number;
    season_number: number;
    still_path: string | null;
    overview: string;
    air_date: string;
}

export interface TMDBSeriesDetails extends TMDBSeries {
    seasons: TMDBSeason[];
    genres: { id: number; name: string }[];
    number_of_episodes: number;
}

// Genre mappings
export const movieGenres: Record<number, string> = {
    28: 'Acción', 12: 'Aventura', 16: 'Animación', 35: 'Comedia',
    80: 'Crimen', 99: 'Documental', 18: 'Drama', 10751: 'Familia',
    14: 'Fantasía', 36: 'Historia', 27: 'Terror', 10402: 'Música',
    9648: 'Misterio', 10749: 'Romance', 878: 'Sci-Fi', 10770: 'TV Movie',
    53: 'Thriller', 10752: 'Guerra', 37: 'Western'
};

export const seriesGenres: Record<number, string> = {
    10759: 'Acción', 16: 'Animación', 35: 'Comedia', 80: 'Crimen',
    99: 'Documental', 18: 'Drama', 10751: 'Familia', 10762: 'Kids',
    9648: 'Misterio', 10763: 'News', 10764: 'Reality', 10765: 'Sci-Fi',
    10766: 'Soap', 10767: 'Talk', 10768: 'War', 37: 'Western'
};

// API Functions

/**
 * Get trending movies (week)
 */
export const getTrendingMovies = async (): Promise<TMDBMovie[]> => {
    try {
        const response = await tmdbApi.get('/trending/movie/week');
        return response.data.results;
    } catch (error) {
        console.error('Error fetching trending movies:', error);
        return [];
    }
};

/**
 * Get trending TV series (week)
 */
export const getTrendingSeries = async (): Promise<TMDBSeries[]> => {
    try {
        const response = await tmdbApi.get('/trending/tv/week');
        return response.data.results;
    } catch (error) {
        console.error('Error fetching trending series:', error);
        return [];
    }
};

/**
 * Get popular movies
 */
export const getPopularMovies = async (page: number = 1): Promise<TMDBMovie[]> => {
    try {
        const response = await tmdbApi.get('/movie/popular', { params: { page } });
        return response.data.results;
    } catch (error) {
        console.error('Error fetching popular movies:', error);
        return [];
    }
};

/**
 * Get popular TV series
 */
export const getPopularSeries = async (page: number = 1): Promise<TMDBSeries[]> => {
    try {
        const response = await tmdbApi.get('/tv/popular', { params: { page } });
        return response.data.results;
    } catch (error) {
        console.error('Error fetching popular series:', error);
        return [];
    }
};

/**
 * Get now playing movies
 */
export const getNowPlayingMovies = async (): Promise<TMDBMovie[]> => {
    try {
        const response = await tmdbApi.get('/movie/now_playing');
        return response.data.results;
    } catch (error) {
        console.error('Error fetching now playing movies:', error);
        return [];
    }
};

/**
 * Get top rated movies
 */
export const getTopRatedMovies = async (): Promise<TMDBMovie[]> => {
    try {
        const response = await tmdbApi.get('/movie/top_rated');
        return response.data.results;
    } catch (error) {
        console.error('Error fetching top rated movies:', error);
        return [];
    }
};

/**
 * Get top rated TV series
 */
export const getTopRatedSeries = async (): Promise<TMDBSeries[]> => {
    try {
        const response = await tmdbApi.get('/tv/top_rated');
        return response.data.results;
    } catch (error) {
        console.error('Error fetching top rated series:', error);
        return [];
    }
};

/**
 * Get movie details
 */
export const getMovieDetails = async (id: number): Promise<TMDBMovie | null> => {
    try {
        const response = await tmdbApi.get(`/movie/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching movie details:', error);
        return null;
    }
};

/**
 * Get TV series details with seasons
 */
export const getSeriesDetails = async (id: number): Promise<TMDBSeriesDetails | null> => {
    try {
        const response = await tmdbApi.get(`/tv/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching series details:', error);
        return null;
    }
};

/**
 * Get episodes for a specific season
 */
export const getSeasonEpisodes = async (seriesId: number, seasonNumber: number): Promise<TMDBEpisode[]> => {
    try {
        const response = await tmdbApi.get(`/tv/${seriesId}/season/${seasonNumber}`);
        return response.data.episodes || [];
    } catch (error) {
        console.error('Error fetching season episodes:', error);
        return [];
    }
};

/**
 * Search movies
 */
export const searchMovies = async (query: string): Promise<TMDBMovie[]> => {
    try {
        const response = await tmdbApi.get('/search/movie', { params: { query } });
        return response.data.results;
    } catch (error) {
        console.error('Error searching movies:', error);
        return [];
    }
};

/**
 * Search TV series
 */
export const searchSeries = async (query: string): Promise<TMDBSeries[]> => {
    try {
        const response = await tmdbApi.get('/search/tv', { params: { query } });
        return response.data.results;
    } catch (error) {
        console.error('Error searching series:', error);
        return [];
    }
};

/**
 * Search across movies, TV shows and people
 */
export const searchMulti = async (query: string): Promise<MultiSearchResult[]> => {
    try {
        const response = await tmdbApi.get('/search/multi', { params: { query } });
        return response.data.results;
    } catch (error) {
        console.error('Error searching multi:', error);
        return [];
    }
};

/**
 * Get videos for a movie
 */
export const getMovieVideos = async (id: number) => {
    try {
        const response = await tmdbApi.get(`/movie/${id}/videos`);
        return response.data.results;
    } catch (error) {
        console.error('Error fetching movie videos:', error);
        return [];
    }
};

/**
 * Get videos for a TV series
 */
export const getSeriesVideos = async (id: number) => {
    try {
        const response = await tmdbApi.get(`/tv/${id}/videos`);
        return response.data.results;
    } catch (error) {
        console.error('Error fetching series videos:', error);
        return [];
    }
};

/**
 * Get movies by genre
 */
export const getMoviesByGenre = async (genreId: number, page: number = 1): Promise<TMDBMovie[]> => {
    try {
        const response = await tmdbApi.get('/discover/movie', {
            params: { with_genres: genreId, page, sort_by: 'popularity.desc' }
        });
        return response.data.results;
    } catch (error) {
        console.error('Error fetching movies by genre:', error);
        return [];
    }
};

/**
 * Get series by genre
 */
export const getSeriesByGenre = async (genreId: number, page: number = 1): Promise<TMDBSeries[]> => {
    try {
        const response = await tmdbApi.get('/discover/tv', {
            params: { with_genres: genreId, page, sort_by: 'popularity.desc' }
        });
        return response.data.results;
    } catch (error) {
        console.error('Error fetching series by genre:', error);
        return [];
    }
};

/**
 * Get trending anime (Animation genre + Japanese language)
 */
export const getTrendingAnime = async (): Promise<TMDBMovie[]> => {
    try {
        const response = await tmdbApi.get('/discover/movie', {
            params: {
                with_genres: 16,
                with_original_language: 'ja',
                sort_by: 'popularity.desc'
            }
        });
        return response.data.results;
    } catch (error) {
        console.error('Error fetching trending anime:', error);
        return [];
    }
};

/**
 * Get popular anime series (Animation genre + Japanese language)
 */
export const getPopularAnime = async (): Promise<TMDBSeries[]> => {
    try {
        const response = await tmdbApi.get('/discover/tv', {
            params: {
                with_genres: 16,
                with_original_language: 'ja',
                sort_by: 'popularity.desc'
            }
        });
        return response.data.results;
    } catch (error) {
        console.error('Error fetching popular anime:', error);
        return [];
    }
};

// VidSrc URL helpers for streaming
export const getVidSrcMovieUrl = (tmdbId: number): string => {
    return `https://vidsrcme.su/embed/movie/${tmdbId}`;
};

export const getVidSrcSeriesUrl = (tmdbId: number, season: number, episode: number): string => {
    return `https://vidsrcme.su/embed/tv/${tmdbId}/${season}/${episode}`;
};

export default tmdbApi;
