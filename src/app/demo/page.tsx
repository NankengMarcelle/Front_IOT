"use client";

import Link from 'next/link';
import { useTranslation } from '@/providers/TranslationProvider';
import Footer from '@/components/layout/Footer';
import { ArrowLeft, Play, Pause, SkipBack, SkipForward, Maximize2, Settings, Download, Share2, BarChart3, Cpu, Leaf, Zap, Target, Shield, Clock, Users, CheckCircle, ChevronRight, Globe, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export default function DemoPage() {
    const { t, isLoading } = useTranslation();
    const [language, setLanguage] = useState('fr');
    const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    const languages = [
        { code: 'fr', name: 'Français', flag: '🇫🇷' },
        { code: 'en', name: 'English', flag: '🇺🇸' }
    ];

    const currentLanguage = languages.find(lang => lang.code === language);

    const demoFeatures = [
        {
            icon: <BarChart3 className="w-6 h-6" />,
            title: "Tableau de Bord Intuitif",
            description: "Visualisez toutes vos données en temps réel sur une interface unique."
        },
        {
            icon: <Cpu className="w-6 h-6" />,
            title: "Contrôle IoT",
            description: "Gérez vos capteurs et équipements à distance en un clic."
        },
        {
            icon: <Leaf className="w-6 h-6" />,
            title: "Analyse IA",
            description: "Recevez des recommandations personnalisées pour vos cultures."
        },
        {
            icon: <Zap className="w-6 h-6" />,
            title: "Alertes Intelligentes",
            description: "Soyez averti des anomalies et des actions nécessaires."
        }
    ];

    const benefits = [
        "Augmentation moyenne de 40% des rendements",
        "Réduction de 30% de la consommation d'eau",
        "Surveillance 24h/24 de vos parcelles",
        "Prédictions précises à 99,8%",
        "Support technique dédié 7j/7",
        "Formation et accompagnement inclus"
    ];

    useEffect(() => {
        // Simuler une lecture vidéo
        let interval: NodeJS.Timeout;
        if (isPlaying) {
            interval = setInterval(() => {
                setCurrentTime(prev => {
                    if (prev >= 100) {
                        setIsPlaying(false);
                        return 0;
                    }
                    return prev + 1;
                });
            }, 100);
        }
        return () => clearInterval(interval);
    }, [isPlaying]);

    const handlePlayPause = () => {
        setIsPlaying(!isPlaying);
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        setCurrentTime(value);
    };

    const handleFullscreen = () => {
        setIsFullscreen(!isFullscreen);
        if (videoRef.current) {
            if (!document.fullscreenElement) {
                videoRef.current.requestFullscreen();
            } else {
                document.exitFullscreen();
            }
        }
    };

    const formatTime = (percent: number) => {
        const totalSeconds = 180; // 3 minutes
        const seconds = Math.floor((percent / 100) * totalSeconds);
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

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

            {/* Header avec navigation */}
            <header className="relative z-50">
                <div className="container mx-auto px-4 sm:px-6 py-4">
                    <div className="flex items-center justify-between">
                        {/* Logo et retour */}
                        <div className="flex items-center gap-4">
                            <Link
                                href="/"
                                className="flex items-center gap-2 text-white hover:text-[#b2f2bb] transition-colors group"
                            >
                                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                                <span className="font-semibold">Retour</span>
                            </Link>

                            <div className="hidden sm:flex items-center gap-3">
                                <div className="w-8 h-8 bg-gradient-to-br from-[#22C55E] to-agro-primary rounded-lg flex items-center justify-center">
                                    <Leaf className="w-4 h-4 text-white" />
                                </div>
                                <span className="text-white text-xl font-bold">Smart Agro</span>
                            </div>
                        </div>

                        {/* Language Toggle */}
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
                </div>

                {/* Fermer le dropdown en cliquant ailleurs */}
                {showLanguageDropdown && (
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setShowLanguageDropdown(false)}
                    />
                )}
            </header>

            <main className="flex-grow relative z-10">
                {/* Hero Section */}
                <section className="relative py-12 sm:py-16 md:py-20 bg-gradient-to-br from-agro-dark via-[#1A4D2E] to-agro-primary">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2832')] opacity-10 bg-cover bg-center"></div>

                    <div className="container mx-auto px-4 sm:px-6 relative z-10">
                        <div className="max-w-6xl mx-auto text-center">
                            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20 mb-6">
                                <div className="w-2 h-2 bg-[#22C55E] rounded-full animate-pulse"></div>
                                <span className="text-white/90 text-sm font-medium">DÉMO INTERACTIVE</span>
                            </div>

                            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-[#b2f2bb] to-[#22C55E]">
                                    Découvrez Smart Agro en Action
                                </span>
                            </h1>

                            <p className="text-lg sm:text-xl md:text-2xl text-white/80 font-light max-w-3xl mx-auto mb-8">
                                Explorez notre plateforme d'agriculture intelligente à travers cette démo interactive
                            </p>
                        </div>
                    </div>
                </section>

                {/* Demo Video Section */}
                <section className="py-12 sm:py-16 md:py-20 bg-white">
                    <div className="container mx-auto px-4 sm:px-6">
                        <div className="max-w-6xl mx-auto">
                            <div className="mb-10 text-center">
                                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-agro-dark mb-4">
                                    Démonstration Interactive
                                </h2>
                                <p className="text-gray-600 max-w-2xl mx-auto">
                                    Regardez comment notre plateforme transforme la gestion de votre exploitation agricole
                                </p>
                            </div>

                            {/* Video Player */}
                            <div className="relative bg-gradient-to-br from-gray-900 to-agro-dark rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl mb-10">
                                {/* Video Placeholder */}
                                <div
                                    ref={videoRef as any}
                                    className="relative aspect-video bg-gradient-to-br from-gray-800 to-agro-dark flex items-center justify-center"
                                >
                                    {/* Simulation de l'interface Smart Agro */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="text-center">
                                            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-[#22C55E] to-agro-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                                                <Play className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
                                            </div>
                                            <h3 className="text-white text-xl sm:text-2xl font-bold mb-2">Smart Agro Platform</h3>
                                            <p className="text-white/70">Démo interactive en cours de chargement...</p>
                                        </div>
                                    </div>

                                    {/* Overlay UI Elements */}
                                    <div className="absolute top-4 left-4">
                                        <div className="bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2">
                                            <span className="text-white text-sm font-semibold">EN DIRECT</span>
                                        </div>
                                    </div>

                                    <div className="absolute top-4 right-4">
                                        <div className="flex gap-2">
                                            <button className="bg-black/50 backdrop-blur-sm rounded-lg p-2 hover:bg-black/70 transition-colors">
                                                <Settings className="w-5 h-5 text-white" />
                                            </button>
                                            <button
                                                onClick={handleFullscreen}
                                                className="bg-black/50 backdrop-blur-sm rounded-lg p-2 hover:bg-black/70 transition-colors"
                                            >
                                                <Maximize2 className="w-5 h-5 text-white" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Progress Bar Simulation */}
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                                        <div className="mb-2">
                                            <input
                                                type="range"
                                                min="0"
                                                max="100"
                                                value={currentTime}
                                                onChange={handleSeek}
                                                className="w-full h-1.5 bg-white/20 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#22C55E] [&::-webkit-slider-thumb]:cursor-pointer"
                                            />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <button
                                                    onClick={handlePlayPause}
                                                    className="bg-white hover:bg-gray-100 text-agro-dark rounded-full p-3 shadow-lg hover:shadow-xl transition-all"
                                                >
                                                    {isPlaying ? (
                                                        <Pause className="w-5 h-5" />
                                                    ) : (
                                                        <Play className="w-5 h-5" />
                                                    )}
                                                </button>

                                                <div className="hidden sm:flex items-center gap-2">
                                                    <button className="text-white/70 hover:text-white transition-colors">
                                                        <SkipBack className="w-5 h-5" />
                                                    </button>
                                                    <button className="text-white/70 hover:text-white transition-colors">
                                                        <SkipForward className="w-5 h-5" />
                                                    </button>
                                                </div>

                                                <div className="text-white text-sm font-medium">
                                                    {formatTime(currentTime)} / 3:00
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <button className="text-white/70 hover:text-white transition-colors hidden sm:block">
                                                    <Download className="w-5 h-5" />
                                                </button>
                                                <button className="text-white/70 hover:text-white transition-colors">
                                                    <Share2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Features Overview */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                                {demoFeatures.map((feature, index) => (
                                    <div
                                        key={index}
                                        className="group bg-white p-6 rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 bg-gradient-to-br from-[#22C55E] to-agro-primary rounded-xl flex items-center justify-center text-white flex-shrink-0">
                                                {feature.icon}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-agro-dark text-lg mb-2">{feature.title}</h3>
                                                <p className="text-gray-600">{feature.description}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Benefits Section */}
                <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-agro-bg-gray to-white">
                    <div className="container mx-auto px-4 sm:px-6">
                        <div className="max-w-6xl mx-auto">
                            <div className="text-center mb-12">
                                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-agro-dark mb-4">
                                    Avantages Concrets
                                </h2>
                                <p className="text-gray-600 max-w-2xl mx-auto">
                                    Découvrez comment Smart Agro peut transformer votre exploitation
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                                {benefits.map((benefit, index) => (
                                    <div
                                        key={index}
                                        className="group bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300"
                                    >
                                        <div className="flex items-start gap-3">
                                            <CheckCircle className="w-6 h-6 text-[#22C55E] flex-shrink-0 mt-0.5" />
                                            <p className="text-gray-800 font-medium">{benefit}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Stats */}
                            <div className="bg-gradient-to-r from-[#22C55E]/5 to-agro-primary/5 rounded-2xl p-8 border border-[#22C55E]/20">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                    <div className="text-center">
                                        <div className="text-3xl sm:text-4xl font-black text-agro-dark mb-2">+40%</div>
                                        <div className="text-gray-600 text-sm font-medium">Productivité</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-3xl sm:text-4xl font-black text-agro-dark mb-2">-30%</div>
                                        <div className="text-gray-600 text-sm font-medium">Consommation d'eau</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-3xl sm:text-4xl font-black text-agro-dark mb-2">24/7</div>
                                        <div className="text-gray-600 text-sm font-medium">Surveillance</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-3xl sm:text-4xl font-black text-agro-dark mb-2">99.8%</div>
                                        <div className="text-gray-600 text-sm font-medium">Précision</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-agro-dark via-[#1A4D2E] to-agro-primary">
                    <div className="container mx-auto px-4 sm:px-6">
                        <div className="max-w-4xl mx-auto text-center">
                            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 sm:p-10 md:p-12 border border-white/20">
                                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-6">
                                    Prêt à Essayer par Vous-Même ?
                                </h2>

                                <p className="text-lg sm:text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                                    Inscrivez-vous pour un essai gratuit de 14 jours et découvrez comment Smart Agro peut révolutionner votre agriculture.
                                </p>

                                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                                    <Link
                                        href="/register"
                                        className="group bg-white hover:bg-gray-50 text-agro-dark px-8 py-4 rounded-xl sm:rounded-2xl text-lg font-bold transition-all duration-300 shadow-2xl hover:shadow-[0_20px_60px_-15px_rgba(255,255,255,0.5)] hover:-translate-y-1 active:scale-95 flex items-center gap-3 min-w-[200px] justify-center"
                                    >
                                        <span>Commencer l'essai gratuit</span>
                                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </Link>

                                    <Link
                                        href="/contact"
                                        className="px-8 py-4 rounded-xl sm:rounded-2xl text-lg font-semibold transition-all duration-300 border-2 border-white/30 hover:border-white/60 text-white hover:bg-white/5 backdrop-blur-sm min-w-[200px] text-center"
                                    >
                                        Contactez-nous
                                    </Link>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-white/60">
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="w-2 h-2 bg-[#22C55E] rounded-full"></div>
                                        <span>Aucun engagement</span>
                                    </div>
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="w-2 h-2 bg-[#22C55E] rounded-full"></div>
                                        <span>Support dédié</span>
                                    </div>
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="w-2 h-2 bg-[#22C55E] rounded-full"></div>
                                        <span>Configuration assistée</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="py-12 sm:py-16 md:py-20 bg-white">
                    <div className="container mx-auto px-4 sm:px-6">
                        <div className="max-w-4xl mx-auto">
                            <div className="text-center mb-12">
                                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-agro-dark mb-4">
                                    Questions Fréquentes
                                </h2>
                                <p className="text-gray-600 max-w-2xl mx-auto">
                                    Tout ce que vous devez savoir sur notre démo et notre plateforme
                                </p>
                            </div>

                            <div className="space-y-6">
                                <div className="bg-gray-50 rounded-2xl p-6">
                                    <h3 className="font-bold text-agro-dark text-lg mb-3">
                                        Combien de temps dure l'essai gratuit ?
                                    </h3>
                                    <p className="text-gray-600">
                                        L'essai gratuit dure 14 jours. Pendant cette période, vous avez accès à toutes les fonctionnalités de la plateforme sans aucune limitation.
                                    </p>
                                </div>

                                <div className="bg-gray-50 rounded-2xl p-6">
                                    <h3 className="font-bold text-agro-dark text-lg mb-3">
                                        Ai-je besoin de matériel spécifique ?
                                    </h3>
                                    <p className="text-gray-600">
                                        Notre solution est compatible avec la plupart des capteurs IoT standards du marché. Nous pouvons vous conseiller sur le matériel adapté à votre exploitation.
                                    </p>
                                </div>

                                <div className="bg-gray-50 rounded-2xl p-6">
                                    <h3 className="font-bold text-agro-dark text-lg mb-3">
                                        Puis-je annuler à tout moment ?
                                    </h3>
                                    <p className="text-gray-600">
                                        Oui, vous pouvez annuler votre abonnement à tout moment. Aucun engagement à long terme n'est requis.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />

            {/* Animation keyframes */}
            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.2s ease-out;
                }
            `}</style>
        </div>
    );
}