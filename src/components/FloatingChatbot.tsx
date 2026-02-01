import { useState, useRef, useEffect } from 'react';

interface Message {
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

export default function FloatingChatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'assistant',
            content: '¡Hola! 👋 Soy Nova AI, tu asistente personal. ¿Buscas tu próxima obsesión o necesitas ayuda con la plataforma? 🎬✨',
            timestamp: new Date()
        }
    ]);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping, isOpen]);

    const quickActions = [
        { emoji: '🔥', label: 'Tendencias', action: '¿Qué está rompiendo internet?' },
        { emoji: '💎', label: 'Joyas Ocultas', action: 'Sorpréndeme con algo único' },
        { emoji: '🍿', label: 'Cine 4K', action: 'Películas mejor valoradas' },
        { emoji: '🎌', label: 'Top Anime', action: 'Obras maestras del anime' },
    ];

    const aiResponses: { [key: string]: string } = {
        '¿Qué está rompiendo internet?': '🔥 **Viral Ahora Mismo:**\n\n1. **Solo Leveling** ⚔️ — Acción pura.\n2. **Dune: Part Two** 🏜️ — Una obra maestra visual.\n3. **Shōgun** 🏯 — Política y honor.\n\n¿Te interesa ver algo de esto?',
        'Sorpréndeme con algo único': '💎 **Joyas que quizás no conoces:**\n\n1. 🎹 **Blue Giant** — Jazz animado increíble.\n2. 🚀 **Scavengers Reign** — Sci-fi biológico único.\n3. 🕵️‍♂️ **Pluto** — Misterio y robots.\n\n¿Te atreves con algo diferente?',
        'Películas mejor valoradas': '🍿 **Cine de Culto Moderno:**\n\n1. 🕷️ **Spider-Verse** — Animación revolucionaria.\n2. 💣 **Oppenheimer** — Drama histórico intenso.\n3. 🚗 **Gran Turismo** — Velocidad pura.\n\nDisponibles en calidad NOVA IMAX. ✨',
        'Obras maestras del anime': '🎌 **El Olimpo del Anime:**\n\n1. 🦾 **Fullmetal Alchemist: Brotherhood**\n2. 🗡️ **Attack on Titan**\n3. 🏴‍☠️ **One Piece**\n\nClásicos que nunca fallan.',
    };

    const handleSend = (text?: string) => {
        const messageText = text || inputValue.trim();
        if (!messageText) return;

        const userMessage: Message = {
            role: 'user',
            content: messageText,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsTyping(true);

        // Simulate AI thinking time
        const thinkTime = Math.random() * 1000 + 1000; // 1-2 seconds

        setTimeout(() => {
            const response = aiResponses[messageText] ||
                `🤔 Entiendo, buscas "${messageText}".\n\nEstoy analizando nuestra base de datos neuronal... 🧬\n\n¡Encontré algo para ti! ¿Te lo muestro?`;

            const assistantMessage: Message = {
                role: 'assistant',
                content: response,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, assistantMessage]);
            setIsTyping(false);
        }, thinkTime);
    };

    const handleClearChat = () => {
        setMessages([{
            role: 'assistant',
            content: '🧹 Chat limpiado. ¿En qué más puedo ayudarte hoy? ✨',
            timestamp: new Date()
        }]);
    };

    return (
        <>
            {/* Floating Button - Updated Colors for NOVA Theme */}
            <div className="fixed bottom-6 right-6 z-[200]">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="uiverse-trigger group relative outline-none transition-transform active:scale-95"
                    aria-label="Toggle AI Assistant"
                >
                    <div className={`loader ${isOpen ? 'active-chat' : ''}`}>
                        <div className="box"></div>
                        <svg width="100" height="100" viewBox="0 0 100 100">
                            <defs>
                                <mask id="clipping">
                                    <polygon points="0,0 100,0 100,100 0,100" fill="black"></polygon>
                                    <polygon points="25,25 75,25 50,75" fill="white"></polygon>
                                    <polygon points="50,25 75,75 25,75" fill="white"></polygon>
                                    <polygon points="35,35 65,35 50,65" fill="white"></polygon>
                                    <polygon points="35,35 65,35 50,65" fill="white"></polygon>
                                    <polygon points="35,35 65,35 50,65" fill="white"></polygon>
                                    <polygon points="35,35 65,35 50,65" fill="white"></polygon>
                                </mask>
                            </defs>
                        </svg>

                        {/* Updated Center Icon Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center z-20 transition-transform duration-500 group-hover:scale-110">
                            {isOpen ? (
                                <i className="ri-close-line text-2xl text-white drop-shadow-md"></i>
                            ) : (
                                <i className="ri-sparkling-2-fill text-3xl text-white drop-shadow-[0_0_15px_rgba(139,92,246,0.8)] animate-pulse"></i>
                            )}
                        </div>
                    </div>

                    {/* Clean Notification Tooltip */}
                    {!isOpen && (
                        <div className="absolute -top-10 right-0 bg-[#0B0D12] border border-white/10 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 shadow-xl shadow-violet-900/20 pointer-events-none">
                            NOVA ASSISTANT
                        </div>
                    )}
                </button>
            </div>

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-28 right-6 z-[200] w-[360px] md:w-[400px] max-h-[650px] flex flex-col glass-premium rounded-3xl overflow-hidden animate-scale-in shadow-2xl shadow-violet-500/10 border border-white/10 origin-bottom-right">

                    {/* Header */}
                    <div className="relative overflow-hidden bg-[#0B0D12]/60 p-5 border-b border-white/5 backdrop-blur-md">
                        {/* Background Effects */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/20 rounded-full blur-[50px] -translate-y-1/2 translate-x-1/2" />
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-[40px] translate-y-1/2 -translate-x-1/2" />

                        <div className="relative z-10 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-violet-500/20">
                                    <i className="ri-sparkling-2-fill text-white text-xl"></i>
                                </div>
                                <div className="flex flex-col">
                                    <h3 className="text-white font-bold text-base leading-tight tracking-wide">
                                        NOVA AI
                                    </h3>
                                    <p className="text-xs text-gray-400 font-medium flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                        Online & Ready
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={handleClearChat}
                                className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                                title="Limpiar chat"
                            >
                                <i className="ri-delete-bin-line"></i>
                            </button>
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div className="h-[350px] overflow-y-auto px-5 py-4 space-y-5 scrollbar-thin scrollbar-thumb-white/10 hover:scrollbar-thumb-white/20 scrollbar-track-transparent bg-[#030305]/40">
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}
                                style={{ animationDelay: `${idx * 50}ms` }}
                            >
                                {msg.role === 'assistant' && (
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500/20 to-cyan-500/20 border border-white/5 flex items-center justify-center mr-3 flex-shrink-0 mt-1">
                                        <i className="ri-sparkling-fill text-xs text-violet-300"></i>
                                    </div>
                                )}
                                <div
                                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${msg.role === 'user'
                                        ? 'bg-gradient-to-br from-violet-600 to-indigo-600 text-white rounded-br-none shadow-violet-500/10'
                                        : 'bg-white/5 border border-white/5 text-gray-200 rounded-bl-none backdrop-blur-sm'
                                        }`}
                                >
                                    <div className="whitespace-pre-wrap">{msg.content}</div>
                                    <span className="text-[9px] opacity-40 block text-right mt-1 font-mono">
                                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </div>
                        ))}

                        {/* Typing Indicator */}
                        {isTyping && (
                            <div className="flex items-center gap-2 animate-fade-in">
                                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center mr-1">
                                    <i className="ri-more-fill text-gray-400"></i>
                                </div>
                                <div className="bg-white/5 border border-white/5 rounded-2xl rounded-bl-none px-4 py-3 flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Suggestions / Footer */}
                    <div className="bg-[#0B0D12]/90 border-t border-white/5 backdrop-blur-xl">
                        {/* Suggestions Carousel */}
                        <div className="px-4 py-3 overflow-x-auto scrollbar-hide flex gap-2 border-b border-white/5">
                            {quickActions.map((action) => (
                                <button
                                    key={action.label}
                                    onClick={() => handleSend(action.action)}
                                    className="flex-shrink-0 px-3 py-1.5 rounded-full bg-white/5 border border-white/5 hover:border-violet-500/40 hover:bg-violet-500/10 transition-all duration-300 flex items-center gap-2 group active:scale-95"
                                >
                                    <span className="text-xs group-hover:scale-110 transition-transform block">{action.emoji}</span>
                                    <span className="text-[11px] font-medium text-gray-400 group-hover:text-violet-200 whitespace-nowrap">{action.label}</span>
                                </button>
                            ))}
                        </div>

                        {/* Input Area */}
                        <div className="p-4">
                            <div className="flex items-center gap-2 bg-[#030305] border border-white/10 rounded-xl p-1.5 pl-4 focus-within:border-violet-500/50 focus-within:shadow-[0_0_15px_rgba(139,92,246,0.1)] transition-all">
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="En qué puedo ayudarte..."
                                    className="flex-1 bg-transparent text-white text-sm placeholder:text-gray-600 focus:outline-none py-1"
                                />
                                <button
                                    onClick={() => handleSend()}
                                    disabled={!inputValue.trim()}
                                    className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300 ${inputValue.trim()
                                        ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/20 hover:scale-105 active:scale-95'
                                        : 'bg-white/5 text-gray-600 cursor-not-allowed'
                                        }`}
                                >
                                    <i className="ri-send-plane-fill text-lg"></i>
                                </button>
                            </div>
                            <div className="flex justify-between items-center mt-2 px-1">
                                <span className="text-[10px] text-gray-600">NOVA Neural Engine v2.0</span>
                                <span className="flex items-center gap-1 text-[10px] text-gray-600">
                                    <i className="ri-shield-check-line"></i> Secure
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                /* Updated Loader Animation Colors for NOVA Theme */
                .loader {
                    --color-one: #8b5cf6; /* Violet */
                    --color-two: #22d3ee; /* Cyan */
                    --color-three: rgba(139, 92, 246, 0.5);
                    --color-four: rgba(34, 211, 238, 0.5);
                    --color-five: rgba(139, 92, 246, 0.2);
                    --time-animation: 2s;
                    --size: 0.65;
                    position: relative;
                    width: 100px;
                    height: 100px;
                    border-radius: 50%;
                    transform: scale(var(--size));
                    box-shadow: 0 0 25px 0 var(--color-three);
                    animation: colorize calc(var(--time-animation) * 4) ease-in-out infinite;
                    transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
                    background: rgba(11, 13, 18, 0.6);
                    backdrop-filter: blur(12px);
                }

                .loader.active-chat {
                    --size: 0.55;
                    box-shadow: none;
                    transform: scale(var(--size)) rotate(45deg); /* Subtle twist when active */
                }
                
                .loader.active-chat .box {
                    opacity: 0; /* Hide internal box when active for cleaner look */
                    transition: opacity 0.3s;
                }

                .loader::before {
                    content: "";
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100px;
                    height: 100px;
                    border-radius: 50%;
                    border-top: solid 1px var(--color-one);
                    border-bottom: solid 1px var(--color-two);
                    background: linear-gradient(180deg, var(--color-five), var(--color-four));
                    box-shadow:
                        inset 0 10px 10px 0 var(--color-three),
                        inset 0 -10px 10px 0 var(--color-four);
                }

                .loader .box {
                    width: 100px;
                    height: 100px;
                    background: linear-gradient(
                        180deg,
                        var(--color-one) 30%,
                        var(--color-two) 70%
                    );
                    mask: url(#clipping);
                    -webkit-mask: url(#clipping);
                }

                .loader svg {
                    position: absolute;
                    visibility: hidden;
                    width: 0;
                    height: 0;
                }

                .loader svg #clipping {
                    filter: contrast(15);
                    animation: roundness calc(var(--time-animation) / 2) linear infinite;
                }

                .loader svg #clipping polygon {
                    filter: blur(7px);
                }

                @keyframes rotation {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                @keyframes roundness {
                    0%, 100% { filter: contrast(15); }
                    20%, 40% { filter: contrast(3); }
                    60% { filter: contrast(15); }
                }

                @keyframes colorize {
                    0%, 100% { filter: hue-rotate(0deg); }
                    50% { filter: hue-rotate(30deg); }
                }
            `}</style>
        </>
    );
}
