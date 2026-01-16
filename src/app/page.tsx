"use client";

import Link from 'next/link';
import LanguageToggle from '@/components/ui/LanguageToggle';
import { useTranslation } from '@/providers/TranslationProvider';
import Footer from '@/components/layout/Footer';
import { ArrowRight, Leaf, Cpu, BarChart3, Shield, Zap, Users, Target } from 'lucide-react';

export default function LandingPage() {
    const { t, isLoading } = useTranslation();

    const team = [
        { name: "Dr. Marie Dubois", roleKey: "agronomist", img: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop&crop=face", expertise: "Agronomie durable" },
        { name: "Ing. Lucas Moreau", roleKey: "engineer", img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face", expertise: "IoT & Hardware" },
        { name: "Dr. Sophie Laurent", roleKey: "product_manager", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face", expertise: "Data Science" }
    ];

    const features = [
        {
            icon: <Leaf className="w-8 h-8" />,
            title: "Durabilité",
            desc: "Préserver le sol pour les générations futures."
        },
        {
            icon: <Cpu className="w-8 h-8" />,
            title: "Innovation IoT",
            desc: "Suivi en temps réel de vos parcelles."
        },
        {
            icon: <BarChart3 className="w-8 h-8" />,
            title: "Intelligence Artificielle",
            desc: "Prédictions précises pour chaque type de culture."
        },
        {
            icon: <Shield className="w-8 h-8" />,
            title: "Sécurité des Données",
            desc: "Protection avancée des données agricoles sensibles."
        },
        {
            icon: <Zap className="w-8 h-8" />,
            title: "Surveillance Continue",
            desc: "Monitoring 24h/24 des paramètres critiques."
        },
        {
            icon: <Target className="w-8 h-8" />,
            title: "Précision Maximale",
            desc: "Mesures exactes pour une agriculture optimisée."
        }
    ];

    const stats = [
        { value: "+40%", label: "Gain de Productivité" },
        { value: "24/7", label: "Surveillance Continue" },
        { value: "99.8%", label: "Précision des Mesures" }
    ];

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-agro-bg-gray">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-agro-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-agro-dark font-medium">Chargement...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-agro-primary/5 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#22C55E]/5 rounded-full blur-3xl"></div>
            </div>

            {/* Language Toggle */}
            <div className="absolute top-6 right-6 z-50">
                <div className="bg-white/80 backdrop-blur-sm rounded-full p-1 shadow-lg border border-gray-100">
                    <LanguageToggle />
                </div>
            </div>

            <main className="flex-grow relative z-10">
                {/* HERO SECTION */}
                <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
                    <div
                        className="absolute inset-0 bg-gradient-to-br from-agro-dark via-[#1A4D2E] to-agro-primary"
                        style={{
                            backgroundImage: `linear-gradient(rgba(5, 46, 22, 0.9), rgba(5, 46, 22, 0.9)), url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2832&auto=format&fit=crop')`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundBlendMode: 'overlay'
                        }}
                    />

                    {/* Animated gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-agro-dark/90 via-transparent to-transparent"></div>

                    {/* Floating elements */}
                    <div className="absolute top-1/4 left-10 w-4 h-4 bg-[#22C55E] rounded-full animate-pulse"></div>
                    <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-[#22C55E] rounded-full animate-pulse delay-300"></div>
                    <div className="absolute bottom-1/4 right-20 w-2 h-2 bg-[#22C55E] rounded-full animate-pulse delay-700"></div>

                    <div className="relative z-10 text-center px-6 max-w-6xl mx-auto">
                        <div className="mb-8 inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20">
                            <span className="w-2 h-2 bg-[#22C55E] rounded-full animate-pulse"></span>
                            <span className="text-white/90 text-sm font-semibold">IA • IoT • Agriculture 4.0</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-8 leading-tight tracking-tight">
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-[#b2f2bb] to-[#22C55E]">
                                Agriculture Intelligente
                            </span>
                        </h1>

                        <p className="text-xl md:text-2xl text-white/80 font-light leading-relaxed max-w-3xl mx-auto mb-12">
                            Optimisez vos récoltes avec notre plateforme IoT et IA
                        </p>
                    </div>

                    {/* Scroll indicator */}
                    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
                            <div className="w-1 h-3 bg-white/70 rounded-full mt-2"></div>
                        </div>
                    </div>
                </section>

                {/* STATS SECTION */}
                <section className="py-16 bg-gradient-to-b from-white to-agro-bg-gray">
                    <div className="max-w-6xl mx-auto px-8">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            {stats.map((stat, index) => (
                                <div
                                    key={index}
                                    className="text-center p-6 rounded-3xl bg-white/50 backdrop-blur-sm border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                                >
                                    <div className="text-4xl md:text-5xl font-black text-agro-dark mb-2">{stat.value}</div>
                                    <div className="text-gray-600 text-sm font-semibold uppercase tracking-wider">
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* FEATURES SECTION */}
                <section id="features" className="py-24 bg-gradient-to-b from-agro-bg-gray to-white">
                    <div className="max-w-7xl mx-auto px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-black text-agro-dark mb-6">
                                Notre Solution Complète
                            </h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                Une plateforme intégrée combinant technologies de pointe pour une agriculture intelligente
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {features.map((feature, index) => (
                                <div
                                    key={index}
                                    className="group bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:border-[#22C55E]/30"
                                >
                                    <div className="w-16 h-16 bg-gradient-to-br from-[#22C55E] to-agro-primary rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300">
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-agro-dark mb-4">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        {feature.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* MISSION SECTION */}
                <section className="py-24 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#F1F8F4] via-white to-[#F1F8F4]"></div>
                    <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-white/50 to-transparent"></div>

                    <div className="max-w-6xl mx-auto px-8 relative">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                            <div>
                                <div className="mb-8">
                                    <span className="inline-block px-4 py-2 bg-[#22C55E]/10 text-[#22C55E] rounded-full text-sm font-semibold mb-4">
                                        Notre Mission
                                    </span>
                                    <h2 className="text-4xl font-black text-agro-dark mb-6 leading-tight">
                                        Notre Mission
                                    </h2>
                                </div>

                                <div className="space-y-6">
                                    <p className="text-gray-600 text-lg leading-relaxed">
                                        Transformer l'agriculture traditionnelle en une agriculture de précision grâce à l'innovation technologique.
                                    </p>
                                    <p className="text-gray-600 text-lg leading-relaxed">
                                        Nous mettons à votre disposition des outils intelligents pour optimiser vos ressources, augmenter vos rendements et préserver l'environnement.
                                    </p>
                                </div>

                                <div className="mt-10 p-6 bg-gradient-to-r from-[#22C55E]/5 to-agro-primary/5 rounded-2xl border border-[#22C55E]/20">
                                    <div className="flex items-center gap-4">
                                        <Users className="w-8 h-8 text-agro-primary" />
                                        <div>
                                            <h4 className="font-bold text-agro-dark">Notre Engagement</h4>
                                            <p className="text-gray-600 text-sm mt-1">
                                                Accompagnement personnalisé et support technique 24/7
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="relative">
                                <div className="bg-white rounded-[40px] shadow-2xl border border-gray-100 p-10 transform rotate-1 hover:rotate-0 transition-transform duration-500">
                                    <div className="space-y-8">
                                        <div className="flex items-start gap-6">
                                            <div className="w-14 h-14 bg-gradient-to-br from-[#22C55E] to-agro-primary rounded-2xl flex items-center justify-center text-white flex-shrink-0">
                                                <Leaf className="w-7 h-7" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-800 text-lg">
                                                    Durabilité
                                                </h4>
                                                <p className="text-gray-500 mt-2">
                                                    Préserver le sol pour les générations futures.
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-6">
                                            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl flex items-center justify-center text-white flex-shrink-0">
                                                <Cpu className="w-7 h-7" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-800 text-lg">
                                                    Innovation IoT
                                                </h4>
                                                <p className="text-gray-500 mt-2">
                                                    Suivi en temps réel de vos parcelles.
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-6">
                                            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-400 rounded-2xl flex items-center justify-center text-white flex-shrink-0">
                                                <BarChart3 className="w-7 h-7" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-800 text-lg">
                                                    Intelligence Artificielle
                                                </h4>
                                                <p className="text-gray-500 mt-2">
                                                    Prédictions précises pour chaque type de culture.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Decorative elements */}
                                <div className="absolute -top-6 -right-6 w-32 h-32 bg-gradient-to-br from-[#22C55E] to-agro-primary rounded-3xl -z-10 blur-xl opacity-20"></div>
                                <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl -z-10 blur-xl opacity-20"></div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* TEAM SECTION */}
                <section className="py-24 bg-gradient-to-b from-white to-agro-bg-gray">
                    <div className="max-w-7xl mx-auto px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-black text-agro-dark mb-6">
                                Notre Équipe
                            </h2>
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                Rencontrez notre équipe d'experts dédiée à la révolution agricole
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {team.map((member, idx) => (
                                <div
                                    key={idx}
                                    className="group relative bg-white p-8 rounded-[32px] shadow-lg border border-gray-100 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2"
                                >
                                    {/* Background gradient on hover */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-[#F1F8F4] group-hover:from-[#22C55E]/5 group-hover:to-[#22C55E]/10 transition-all duration-500"></div>

                                    <div className="relative z-10">
                                        <div className="relative mb-8">
                                            <div className="w-40 h-40 rounded-full mx-auto overflow-hidden border-4 border-white shadow-xl">
                                                <img
                                                    src={member.img}
                                                    alt={member.name}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                            </div>
                                            <div className="absolute -bottom-2 right-1/3 w-6 h-6 bg-[#22C55E] rounded-full border-4 border-white"></div>
                                        </div>

                                        <h3 className="text-2xl font-bold text-agro-dark text-center mb-2">{member.name}</h3>
                                        <p className="text-agro-primary font-bold text-center mb-3">
                                            {member.roleKey === "agronomist" ? "Agronome" :
                                                member.roleKey === "engineer" ? "Ingénieur IoT" :
                                                    "Responsable Produit"}
                                        </p>
                                        <p className="text-gray-500 text-sm text-center font-medium">
                                            {member.expertise}
                                        </p>

                                        <div className="mt-6 pt-6 border-t border-gray-100">
                                            <div className="flex justify-center gap-4">
                                                <div className="w-2 h-2 bg-[#22C55E] rounded-full"></div>
                                                <div className="w-2 h-2 bg-[#22C55E] rounded-full"></div>
                                                <div className="w-2 h-2 bg-[#22C55E] rounded-full"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA SECTION */}
                <section className="py-24 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-agro-dark via-[#1A4D2E] to-agro-primary"></div>
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2832')] opacity-10 bg-cover bg-center"></div>

                    {/* Animated circles */}
                    <div className="absolute top-0 left-0 w-72 h-72 bg-[#22C55E] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                    <div className="absolute top-0 right-0 w-72 h-72 bg-agro-primary rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                    <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-[#12A125] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

                    <div className="relative z-10 max-w-4xl mx-auto px-8 text-center">
                        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-12 border border-white/20">
                            <h2 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight">
                                Prêt à révolutionner votre agriculture ?
                            </h2>

                            <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
                                Rejoignez la révolution agricole intelligente dès aujourd'hui
                            </p>

                            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                                <Link
                                    href="/register"
                                    className="group bg-white hover:bg-gray-50 text-agro-dark px-10 py-4 rounded-2xl text-lg font-bold transition-all duration-300 shadow-2xl hover:shadow-[0_20px_60px_-15px_rgba(255,255,255,0.5)] hover:-translate-y-1 active:scale-95 flex items-center gap-3 min-w-[200px] justify-center"
                                >
                                    <span>Commencer maintenant</span>
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Link>

                                <Link
                                    href="/demo"
                                    className="px-10 py-4 rounded-2xl text-lg font-semibold transition-all duration-300 border-2 border-white/30 hover:border-white/60 text-white hover:bg-white/5 backdrop-blur-sm min-w-[200px] text-center"
                                >
                                    Voir la démo
                                </Link>
                            </div>

                            <p className="text-white/60 text-sm mt-8">
                                Aucune carte bancaire requise • Essai gratuit de 14 jours
                            </p>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />

            {/* Animation keyframes for blob */}
            <style jsx>{`
                @keyframes blob {
                    0% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                    100% { transform: translate(0px, 0px) scale(1); }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
            `}</style>
        </div>
    );
}