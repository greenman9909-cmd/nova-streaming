import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import {
    getAnimeInfo,
    getAnimeEpisodes,
    getStreamUrl,
    getAnimeServers,
    AnimeResult,
    Episode,
    Server
} from '../services/animeService';
import EnhancedPlayer from '../components/EnhancedPlayer';

export default function AnimeWatch() {
    const { id } = useParams<{ id: string }>();
    const [searchParams] = useSearchParams();

    const [anime, setAnime] = useState<AnimeResult | null>(null);
    const [episodes, setEpisodes] = useState<Episode[]>([]);
    const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null);
    const [servers, setServers] = useState<Server[]>([]);
    const [currentServer, setCurrentServer] = useState<string>('hd-1');
    const [streamUrl, setStreamUrl] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Initial Fetch (Info + Episodes)
    useEffect(() => {
        if (!id) return;

        const init = async () => {
            setLoading(true);
            setError(null);
            try {
                // 1. Get Anime Info
                const info = await getAnimeInfo(id);
                if (!info) throw new Error('Anime not found');
                setAnime(info);

                // 2. Get Episodes
                const epData = await getAnimeEpisodes(id);
                setEpisodes(epData.episodes);

                // 3. Set Current Episode (Default to first or from URL?)
                if (epData.episodes.length > 0) {
                    // Reverse to show Ep 1 first if list is descending? 
                    // Usually GogoAnime is Ascending or Descending. Let's assume API gives correct order.
                    // Or check for "ep" query param? For now default to first.
                    const firstEp = epData.episodes[0];
                    setCurrentEpisode(firstEp);
                }
            } catch (err) {
                console.error("Error loading anime:", err);
                setError("Failed to load anime details.");
            } finally {
                setLoading(false);
            }
        };
        init();
    }, [id]);

    // Fetch Stream when Episode or Server changes
    useEffect(() => {
        if (!currentEpisode || !currentServer) return;

        const loadStream = async () => {
            try {
                // Determine Type (Sub/Dub) - Default to Sub for now
                // Ideally we check if server supports dub.
                const streamData = await getStreamUrl(currentEpisode.id, currentServer, 'sub');

                if (streamData?.results?.streamingLink?.link?.file) {
                    // If HLS
                    const file = streamData.results.streamingLink.link.file;
                    setStreamUrl(`https://plyr.link/p/player.html#${btoa(file)}`);
                } else if (streamData?.results?.streamingLink?.iframe) {
                    setStreamUrl(streamData.results.streamingLink.iframe);
                } else {
                    // Fallback or error
                    console.warn("No stream link found");
                }

                // Also fetch servers for this episode if not loaded
                // (Optimization: only fetch once per episode)
                const serversData = await getAnimeServers(currentEpisode.id);
                setServers(serversData);

            } catch (err) {
                console.error("Error loading stream:", err);
            }
        };
        loadStream();
    }, [currentEpisode, currentServer]);

    const handleEpisodeChange = (ep: Episode) => {
        setCurrentEpisode(ep);
        // Reset server to default on ep change?
        setCurrentServer('hd-1');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-nova-bg flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-nova-accent border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-nova-bg flex items-center justify-center text-white">
                <p>{error}</p>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-nova-bg pt-20 pb-12">
            <div className="max-w-screen-2xl mx-auto px-4 lg:px-6">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Main Content */}
                    <div className="flex-1 min-w-0">
                        {/* Player */}
                        {currentEpisode ? (
                            <EnhancedPlayer
                                src={streamUrl}
                                title={`${anime?.title} - EP ${currentEpisode.episode_no}`}
                                poster={anime?.poster}
                            />
                        ) : (
                            <div className="aspect-video bg-black/50 rounded-2xl flex items-center justify-center text-white">
                                Select an episode
                            </div>
                        )}

                        {/* Info */}
                        <div className="mb-8">
                            <h1 className="text-2xl md:text-3xl font-black text-white mb-2">
                                {anime?.title}
                            </h1>
                            <div className="flex items-center gap-4 text-nova-muted text-sm">
                                {currentEpisode && (
                                    <span className="text-nova-accent font-bold px-2 py-0.5 bg-nova-accent/10 rounded">
                                        EPISODE {currentEpisode.episode_no}
                                    </span>
                                )}
                                <span className="opacity-70">{anime?.japanese_title}</span>
                            </div>
                        </div>

                        {/* Server Selector */}
                        {servers.length > 0 && (
                            <div className="glass rounded-2xl p-4 mb-8 flex items-center gap-4 overflow-x-auto">
                                <span className="text-white font-bold flex items-center gap-2 shrink-0">
                                    <i className="ri-server-line text-nova-accent"></i>
                                    Source:
                                </span>
                                <div className="flex gap-2">
                                    {servers.map((srv) => (
                                        <button
                                            key={srv.serverName}
                                            onClick={() => setCurrentServer(srv.serverName)}
                                            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${currentServer === srv.serverName ? 'bg-nova-accent text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                                        >
                                            {srv.serverName}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar: Episodes */}
                    <div className="w-full lg:w-96 shrink-0">
                        <div className="glass rounded-2xl p-6 sticky top-24 max-h-[calc(100vh-120px)] flex flex-col border border-white/5">
                            <div className="mb-6 flex items-center justify-between">
                                <h3 className="text-white font-bold flex items-center gap-2">
                                    <i className="ri-play-list-2-line text-nova-accent"></i>
                                    Episodes
                                </h3>
                                <span className="text-nova-dim text-xs font-mono">{episodes.length} EPISODES</span>
                            </div>

                            <div className="overflow-y-auto pr-2 custom-scrollbar flex-1 space-y-2">
                                {episodes.map((ep) => (
                                    <button
                                        key={ep.id}
                                        onClick={() => handleEpisodeChange(ep)}
                                        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left group ${currentEpisode?.id === ep.id
                                            ? 'bg-nova-accent text-white shadow-lg shadow-nova-accent/20'
                                            : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                                            }`}
                                    >
                                        <div className="w-12 h-12 bg-black/40 rounded-lg flex items-center justify-center shrink-0 font-bold text-sm">
                                            {ep.episode_no}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h4 className="text-sm font-medium truncate leading-tight">
                                                Episode {ep.episode_no}
                                            </h4>
                                            <p className="text-[10px] opacity-60 truncate">{ep.title}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
