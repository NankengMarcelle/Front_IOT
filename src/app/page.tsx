"use client";

import Link from 'next/link';
import { useTranslation } from '@/providers/TranslationProvider';
import Footer from '@/components/layout/Footer';
import { ArrowRight, Leaf, Cpu, BarChart3, Shield, Zap, Users, Target, Globe, ChevronDown } from 'lucide-react';
import { useState } from 'react';

export default function LandingPage() {
    const { t, isLoading } = useTranslation();
    const [language, setLanguage] = useState('fr');
    const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);

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

    const languages = [
        { code: 'fr', name: 'Français', flag: '🇫🇷' },
        { code: 'en', name: 'English', flag: '🇺🇸' }
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

    const currentLanguage = languages.find(lang => lang.code === language);

    return (
        <div className="min-h-screen flex flex-col relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-agro-primary/5 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#22C55E]/5 rounded-full blur-3xl"></div>
            </div>

            {/* Logo Smart Agro en haut à gauche - RESPONSIVE FIX */}
            <div className="absolute top-4 sm:top-6 left-3 sm:left-6 z-50 max-w-[50%]">
                <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl flex items-center justify-center border border-white/20 group-hover:bg-white/20 transition-all duration-300 flex-shrink-0">
                        <Leaf className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div className="flex flex-col overflow-hidden">
                        <span className="text-white text-sm sm:text-xl font-bold tracking-tight whitespace-nowrap truncate">
                            Smart Agro
                        </span>
                    </div>
                </Link>
            </div>

            {/* Language Toggle amélioré avec dropdown - RESPONSIVE FIX */}
            <div className="absolute top-4 sm:top-6 right-3 sm:right-6 z-50">
                <div className="relative">
                    <button
                        onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                        className="bg-white/10 backdrop-blur-sm rounded-full p-2 sm:p-3 shadow-lg border border-white/20 hover:shadow-xl hover:border-white/30 transition-all duration-300 flex items-center gap-1 sm:gap-2 group"
                    >
                        <div className="flex items-center gap-1 sm:gap-2">
                            <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-white group-hover:text-[#b2f2bb] transition-colors" />
                            <span className="text-xs sm:text-sm font-semibold text-white group-hover:text-[#b2f2bb] transition-colors whitespace-nowrap">
                                {currentLanguage?.flag} <span className="hidden xs:inline">{currentLanguage?.name}</span>
                            </span>
                        </div>
                        <ChevronDown className={`w-3 h-3 sm:w-4 sm:h-4 text-white/70 group-hover:text-[#b2f2bb] transition-all duration-300 ${showLanguageDropdown ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Dropdown menu */}
                    {showLanguageDropdown && (
                        <div className="absolute top-full right-0 mt-2 w-40 sm:w-48 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-gray-100 overflow-hidden animate-fadeIn">
                            <div className="py-2">
                                {languages.map((lang) => (
                                    <button
                                        key={lang.code}
                                        onClick={() => {
                                            setLanguage(lang.code);
                                            setShowLanguageDropdown(false);
                                        }}
                                        className={`w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 hover:bg-agro-bg-gray transition-all duration-200 ${language === lang.code ? 'bg-agro-bg-gray' : ''}`}
                                    >
                                        <Globe className="w-3 h-3 sm:w-4 sm:h-4 text-agro-dark flex-shrink-0" />
                                        <span className={`text-sm sm:text-base font-medium ${language === lang.code ? 'text-agro-primary' : 'text-gray-700'} flex-shrink-0`}>
                                            {lang.flag} {lang.name}
                                        </span>
                                        {language === lang.code && (
                                            <div className="ml-auto w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#22C55E] rounded-full flex-shrink-0"></div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Fermer le dropdown en cliquant ailleurs */}
            {showLanguageDropdown && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowLanguageDropdown(false)}
                />
            )}

            <main className="flex-grow relative z-10">
                {/* HERO SECTION - Agriculture Intelligente sur la même ligne */}
                <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
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

                    <div className="relative z-10 text-center px-4 sm:px-6 w-full">
                        <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 md:mb-8 leading-tight tracking-tight whitespace-normal sm:whitespace-nowrap">
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-[#b2f2bb] to-[#22C55E]">
                                Agriculture Intelligente
                            </span>
                        </h1>

                        <p className="text-base xs:text-lg sm:text-xl md:text-2xl text-white/80 font-light leading-relaxed max-w-3xl mx-auto mb-8 sm:mb-12 px-4">
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

                {/* STATS SECTION - Responsive */}
                <section className="py-16 sm:py-20 bg-gradient-to-b from-white to-agro-bg-gray">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 md:gap-10">
                            {stats.map((stat, index) => (
                                <div
                                    key={index}
                                    className="text-center p-6 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl bg-white/90 backdrop-blur-sm border border-gray-100 shadow-lg hover:shadow-xl sm:hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 sm:hover:-translate-y-2"
                                    style={{
                                        background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248, 250, 252, 0.95) 100%)',
                                        boxShadow: '0 10px 30px rgba(34, 197, 94, 0.1), 0 1px 2px rgba(0, 0, 0, 0.05)'
                                    }}
                                >
                                    <div
                                        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-4 sm:mb-6 leading-none"
                                        style={{
                                            background: 'linear-gradient(135deg, #22C55E 0%, #15803D 100%)',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                            backgroundClip: 'text'
                                        }}
                                    >
                                        {stat.value}
                                    </div>
                                    <div className="text-gray-800 text-base sm:text-lg font-bold mb-2">
                                        {stat.label}
                                    </div>
                                    <div className="mt-4 sm:mt-6 md:mt-8 pt-4 sm:pt-6 border-t border-gray-100">
                                        <div className="text-xs sm:text-sm text-[#22C55E] font-medium">
                                            Performance moyenne
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* FEATURES SECTION - Responsive */}
                <section id="features" className="py-16 sm:py-20 md:py-24 bg-gradient-to-b from-agro-bg-gray to-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                        <div className="text-center mb-12 sm:mb-16">
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-agro-dark mb-4 sm:mb-6">
                                Notre Solution Complète
                            </h2>
                            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">
                                Une plateforme intégrée combinant technologies de pointe pour une agriculture intelligente
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                            {features.map((feature, index) => (
                                <div
                                    key={index}
                                    className="group bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl sm:hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 sm:hover:-translate-y-2 hover:border-[#22C55E]/30"
                                >
                                    <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-[#22C55E] to-agro-primary rounded-xl sm:rounded-2xl flex items-center justify-center text-white mb-4 sm:mb-6 group-hover:scale-105 sm:group-hover:scale-110 transition-transform duration-300">
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-lg sm:text-xl font-bold text-agro-dark mb-3 sm:mb-4">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                                        {feature.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* MISSION SECTION - Responsive */}
                <section className="py-16 sm:py-20 md:py-24 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#F1F8F4] via-white to-[#F1F8F4]"></div>
                    <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-white/50 to-transparent"></div>

                    <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 relative">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-12 md:gap-16 items-center">
                            <div>
                                <div className="mb-6 sm:mb-8">
                                    <span className="inline-block px-3 py-1 sm:px-4 sm:py-2 bg-[#22C55E]/10 text-[#22C55E] rounded-full text-xs sm:text-sm font-semibold mb-3 sm:mb-4">
                                        Notre Mission
                                    </span>
                                    <h2 className="text-3xl sm:text-4xl font-black text-agro-dark mb-4 sm:mb-6 leading-tight">
                                        Notre Mission
                                    </h2>
                                </div>

                                <div className="space-y-4 sm:space-y-6">
                                    <p className="text-gray-600 leading-relaxed text-base sm:text-lg">
                                        Transformer l'agriculture traditionnelle en une agriculture de précision grâce à l'innovation technologique.
                                    </p>
                                    <p className="text-gray-600 leading-relaxed text-base sm:text-lg">
                                        Nous mettons à votre disposition des outils intelligents pour optimiser vos ressources, augmenter vos rendements et préserver l'environnement.
                                    </p>
                                </div>

                                <div className="mt-8 sm:mt-10 p-4 sm:p-6 bg-gradient-to-r from-[#22C55E]/5 to-agro-primary/5 rounded-xl sm:rounded-2xl border border-[#22C55E]/20">
                                    <div className="flex items-start sm:items-center gap-3 sm:gap-4">
                                        <Users className="w-6 h-6 sm:w-8 sm:h-8 text-agro-primary flex-shrink-0" />
                                        <div>
                                            <h4 className="font-bold text-agro-dark text-base sm:text-lg mb-1">Notre Engagement</h4>
                                            <p className="text-gray-600 text-xs sm:text-sm">
                                                Accompagnement personnalisé et support technique 24/7
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="relative">
                                <div className="bg-white rounded-2xl sm:rounded-3xl md:rounded-[40px] shadow-xl sm:shadow-2xl border border-gray-100 p-6 sm:p-8 md:p-10 transition-all duration-500 hover:shadow-2xl sm:hover:shadow-3xl">
                                    <div className="space-y-6 sm:space-y-8">
                                        <div className="flex items-start gap-4 sm:gap-6">
                                            <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-gradient-to-br from-[#22C55E] to-agro-primary rounded-xl sm:rounded-2xl flex items-center justify-center text-white flex-shrink-0">
                                                <Leaf className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-800 text-base sm:text-lg md:text-xl">
                                                    Durabilité
                                                </h4>
                                                <p className="text-gray-500 mt-1 sm:mt-2 text-sm sm:text-base">
                                                    Préserver le sol pour les générations futures.
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-4 sm:gap-6">
                                            <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl sm:rounded-2xl flex items-center justify-center text-white flex-shrink-0">
                                                <Cpu className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-800 text-base sm:text-lg md:text-xl">
                                                    Innovation IoT
                                                </h4>
                                                <p className="text-gray-500 mt-1 sm:mt-2 text-sm sm:text-base">
                                                    Suivi en temps réel de vos parcelles.
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-4 sm:gap-6">
                                            <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-gradient-to-br from-purple-500 to-pink-400 rounded-xl sm:rounded-2xl flex items-center justify-center text-white flex-shrink-0">
                                                <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-800 text-base sm:text-lg md:text-xl">
                                                    Intelligence Artificielle
                                                </h4>
                                                <p className="text-gray-500 mt-1 sm:mt-2 text-sm sm:text-base">
                                                    Prédictions précises pour chaque type de culture.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Decorative elements */}
                                <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-[#22C55E] to-agro-primary rounded-2xl -z-10 blur-xl opacity-20"></div>
                                <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl -z-10 blur-xl opacity-20"></div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* TEAM SECTION - Responsive */}
                <section className="py-16 sm:py-20 md:py-24 bg-gradient-to-b from-white to-agro-bg-gray">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                        <div className="text-center mb-12 sm:mb-16">
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-agro-dark mb-4 sm:mb-6">
                                Notre Équipe
                            </h2>
                            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto px-4">
                                Rencontrez notre équipe d'experts dédiée à la révolution agricole
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                            {team.map((member, idx) => (
                                <div
                                    key={idx}
                                    className="group relative bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-gray-100 shadow-lg overflow-hidden transition-all duration-500 hover:shadow-xl sm:hover:shadow-2xl hover:-translate-y-1 sm:hover:-translate-y-2"
                                >
                                    {/* Background gradient on hover */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-[#F1F8F4] group-hover:from-[#22C55E]/5 group-hover:to-[#22C55E]/10 transition-all duration-500"></div>

                                    <div className="relative z-10">
                                        <div className="relative mb-6 sm:mb-8">
                                            <div className="w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-full mx-auto overflow-hidden border-4 border-white shadow-lg sm:shadow-xl">
                                                <img
                                                    src={member.img}
                                                    alt={member.name}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                            </div>
                                            <div className="absolute -bottom-1 sm:-bottom-2 right-1/4 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 bg-[#22C55E] rounded-full border-4 border-white"></div>
                                        </div>

                                        <h3 className="text-xl sm:text-2xl font-bold text-agro-dark text-center mb-2">{member.name}</h3>
                                        <p className="text-agro-primary font-bold text-center mb-2 sm:mb-3 text-sm sm:text-base">
                                            {member.roleKey === "agronomist" ? "Agronome" :
                                                member.roleKey === "engineer" ? "Ingénieur IoT" :
                                                    "Responsable Produit"}
                                        </p>
                                        <p className="text-gray-500 text-xs sm:text-sm text-center font-medium mb-4 sm:mb-6">
                                            {member.expertise}
                                        </p>

                                        <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-100">
                                            <div className="flex justify-center gap-3 sm:gap-4">
                                                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#22C55E] rounded-full"></div>
                                                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#22C55E] rounded-full"></div>
                                                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#22C55E] rounded-full"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA SECTION - Responsive */}
                <section className="py-16 sm:py-20 md:py-24 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-agro-dark via-[#1A4D2E] to-agro-primary"></div>
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2832')] opacity-10 bg-cover bg-center"></div>

                    {/* Animated circles */}
                    <div className="absolute top-0 left-0 w-48 h-48 sm:w-60 sm:h-60 md:w-72 md:h-72 bg-[#22C55E] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                    <div className="absolute top-0 right-0 w-48 h-48 sm:w-60 sm:h-60 md:w-72 md:h-72 bg-agro-primary rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                    <div className="absolute -bottom-6 left-1/2 w-48 h-48 sm:w-60 sm:h-60 md:w-72 md:h-72 bg-[#12A125] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

                    <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 md:px-8 text-center">
                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-8 sm:p-10 md:p-12 border border-white/20">
                            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4 sm:mb-6 leading-tight">
                                Prêt à révolutionner votre agriculture ?
                            </h2>

                            <p className="text-lg sm:text-xl text-white/80 mb-6 sm:mb-8 md:mb-10 max-w-2xl mx-auto">
                                Rejoignez la révolution agricole intelligente dès aujourd'hui
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-6 sm:mb-8 md:mb-10">
                                <Link
                                    href="/register"
                                    className="group bg-white hover:bg-gray-50 text-agro-dark px-6 sm:px-8 md:px-10 py-3 sm:py-4 rounded-xl sm:rounded-2xl text-base sm:text-lg font-bold transition-all duration-300 shadow-xl sm:shadow-2xl hover:shadow-[0_20px_60px_-15px_rgba(255,255,255,0.5)] hover:-translate-y-1 active:scale-95 flex items-center gap-2 sm:gap-3 min-w-[180px] sm:min-w-[200px] justify-center"
                                >
                                    <span>Commencer maintenant</span>
                                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                                </Link>

                                <Link
                                    href="/demo"
                                    className="px-6 sm:px-8 md:px-10 py-3 sm:py-4 rounded-xl sm:rounded-2xl text-base sm:text-lg font-semibold transition-all duration-300 border-2 border-white/30 hover:border-white/60 text-white hover:bg-white/5 backdrop-blur-sm min-w-[180px] sm:min-w-[200px] text-center"
                                >
                                    Voir la démo
                                </Link>
                            </div>

                            <p className="text-white/60 text-xs sm:text-sm mt-6 sm:mt-8">
                                Aucune carte bancaire requise • Essai gratuit de 14 jours
                            </p>
                        </div>
                    </div>
                </section>
            </main>

            {/* Animation keyframes */}
            <style jsx>{`
                @keyframes blob {
                    0% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                    100% { transform: translate(0px, 0px) scale(1); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animate-fadeIn {
                    animation: fadeIn 0.2s ease-out;
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