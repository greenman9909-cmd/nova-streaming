import { Link } from 'react-router-dom';
import GlowingButton from '../components/GlowingButton';

export default function Plans() {
    const plans = [
        {
            name: 'NOVA LITE',
            price: 'Free',
            period: 'forever',
            features: [
                'Access to standard library',
                'SD streaming quality',
                'Watch on 1 device',
                'Ad-supported viewing',
                'Community chat access',
            ],
            cta: 'Start Now',
            color: '#a78bfa',
            popular: false,
        },
        {
            name: 'NOVA STANDARD',
            price: '€9.99',
            period: '/month',
            features: [
                'Full premium library',
                'Full HD streaming',
                'Watch on 3 devices',
                'No ads experience',
                'Offline downloads',
                'Priority support',
            ],
            cta: 'Get Standard',
            color: '#c084fc',
            popular: true,
        },
        {
            name: 'NOVA ULTRA',
            price: '€19.99',
            period: '/month',
            features: [
                'Ultimate cosmic library',
                '4K Ultra HD + HDR',
                'Watch on 6 devices',
                'Early access to releases',
                'AI content curator',
                'Family sharing (5 profiles)',
            ],
            cta: 'Get Premium',
            color: '#e879f9',
            popular: false,
        },
    ];

    return (
        <div className="min-h-screen bg-[#060608] pt-32 pb-16 px-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-violet-900/10 rounded-full blur-[160px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-900/10 rounded-full blur-[160px]" />
            </div>

            <main className="max-w-7xl mx-auto relative z-10">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
                        Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">Nova</span> Experience
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto font-medium">
                        Elevate your entertainment with premium streaming.
                        No commitments, cancel your subscription at any time.
                    </p>
                </div>

                <div className="flex flex-wrap justify-center items-stretch gap-8">
                    {plans.map((plan, index) => (
                        <div
                            key={plan.name}
                            className={`relative flex flex-col flex-1 min-w-[300px] max-w-[380px] rounded-[32px] p-8 transition-all duration-500 hover:-translate-y-3 ${plan.popular
                                ? 'bg-[#14141c]/80 border border-violet-500/30 shadow-[0_0_40px_rgba(139,92,246,0.2)]'
                                : 'bg-[#12121780] backdrop-blur-lg border border-white/5 hover:border-white/15'
                                }`}
                        >
                            {plan.popular && (
                                <div className="absolute top-6 right-6 px-4 py-1.5 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-xs font-bold shadow-lg">
                                    BEST VALUE
                                </div>
                            )}

                            <span className="text-sm font-bold tracking-[0.2em] mb-4 uppercase" style={{ color: plan.color }}>
                                {plan.name}
                            </span>

                            <div className="flex items-baseline mb-8">
                                <span className="text-5xl font-extrabold text-white">{plan.price}</span>
                                {plan.price !== 'Free' && <span className="text-gray-500 ml-2 font-semibold">{plan.period}</span>}
                            </div>

                            <ul className="space-y-4 flex-1 mb-8">
                                {plan.features.map((feature) => (
                                    <li key={feature} className="flex items-center gap-3 text-gray-300">
                                        <i className="ri-checkbox-circle-fill text-violet-500"></i>
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <div className="mt-auto">
                                <Link to="/login" className="block w-full">
                                    <GlowingButton
                                        text={plan.cta}
                                        variant={index === 0 ? 'blue' : index === 1 ? 'gold' : 'purple'}
                                    />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
