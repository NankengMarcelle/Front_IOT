"use client";

import Link from 'next/link';
import { useTranslation } from '@/providers/TranslationProvider';
import Footer from '@/components/layout/Footer';
import { ArrowLeft, Play, Pause, SkipBack, SkipForward, Maximize2, Settings, Download, Share2, BarChart3, Cpu, Leaf, Zap, Target, Shield, Clock, Users, CheckCircle, ChevronRight, Globe, ChevronDown, Radio, Brain, Cloud, WifiIcon, FileText, Smartphone, Database, ArrowRight } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export default function DemoPage() {
    const { t, isLoading } = useTranslation();
    const [language, setLanguage] = useState('fr');
    const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [activeFeature, setActiveFeature] = useState(0);
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
            description: "Visualisez toutes vos données en temps réel sur une interface unique.",
            color: "from-[#22C55E] to-[#16A34A]"
        },
        {
            icon: <Cpu className="w-6 h-6" />,
            title: "Contrôle IoT",
            description: "Gérez vos capteurs et équipements à distance en un clic.",
            color: "from-[#84CC16] to-[#65A30D]"
        },
        {
            icon: <Brain className="w-6 h-6" />,
            title: "Analyse IA",
            description: "Recevez des recommandations personnalisées pour vos cultures.",
            color: "from-[#10B981] to-[#059669]"
        },
        {
            icon: <Zap className="w-6 h-6" />,
            title: "Alertes Intelligentes",
            description: "Soyez averti des anomalies et des actions nécessaires.",
            color: "from-[#CA8A04] to-[#A16207]"
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

    const demoSteps = [
        {
            title: "Collecte des Données",
            description: "Les capteurs IoT mesurent en temps réel les paramètres du sol",
            icon: <Radio className="w-6 h-6" />
        },
        {
            title: "Analyse IA",
            description: "Le modèle Random Forest analyse les données collectées",
            icon: <Brain className="w-6 h-6" />
        },
        {
            title: "Recommandations",
            description: "Génération de recommandations personnalisées",
            icon: <FileText className="w-6 h-6" />
        },
        {
            title: "Visualisation",
            description: "Accès aux résultats sur le dashboard intuitif",
            icon: <Smartphone className="w-6 h-6" />
        }
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

    useEffect(() => {
        // Animation automatique des features
        const interval = setInterval(() => {
            setActiveFeature((prev) => (prev + 1) % demoFeatures.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

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
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F0FDF4] to-[#DCFCE7]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-[#22C55E] border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-[#166534] font-medium">Chargement...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#22C55E]/5 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#16A34A]/5 rounded-full blur-3xl"></div>
            </div>

            {/* Header avec navigation */}
            <header className="relative z-50">
                <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6">
                    <div className="flex items-center justify-between">
                        {/* Logo et retour */}
                        <div className="flex items-center gap-4">
                            <Link
                                href="/"
                                className="flex items-center gap-2 sm:gap-3 text-white hover:text-[#b2f2bb] transition-colors group"
                            >
                                <div className="bg-white/10 backdrop-blur-sm rounded-full p-2 sm:p-3 border border-white/20 group-hover:bg-white/15 transition-all">
                                    <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform" />
                                </div>
                                <span className="font-semibold text-sm sm:text-base">Retour à l'accueil</span>
                            </Link>

                            <div className="hidden sm:flex items-center gap-3 ml-4">
                                <div className="w-10 h-10 bg-gradient-to-br from-[#22C55E] to-[#16A34A] rounded-xl flex items-center justify-center">
                                    <Leaf className="w-6 h-6 text-white" />
                                </div>
                                <span className="text-white text-xl font-bold tracking-tight">Smart Agro</span>
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
                                                className={`w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 hover:bg-[#F0FDF4] transition-all duration-200 ${language === lang.code ? 'bg-[#F0FDF4]' : ''}`}
                                            >
                                                <Globe className="w-3 h-3 sm:w-4 sm:h-4 text-gray-700 flex-shrink-0" />
                                                <span className={`text-sm sm:text-base font-medium ${language === lang.code ? 'text-[#22C55E]' : 'text-gray-700'} flex-shrink-0`}>
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
                {/* Hero Section - Même style que landing page */}
                <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0">
                        <img
                            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2832&auto=format&fit=crop&crop=focalpoint&fp-y=.35"
                            alt="Tableau de bord agricole"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-br from-[#052E16]/95 via-[#14532D]/90 to-[#166534]/85"></div>
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-t from-[#052E16]/90 via-transparent to-transparent"></div>

                    {/* Floating elements */}
                    <div className="absolute top-1/4 left-10 w-4 h-4 bg-[#22C55E] rounded-full animate-pulse"></div>
                    <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-[#22C55E] rounded-full animate-pulse delay-300"></div>
                    <div className="absolute bottom-1/4 right-20 w-2 h-2 bg-[#22C55E] rounded-full animate-pulse delay-700"></div>

                    <div className="relative z-10 text-center px-4 sm:px-6 w-full">
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 sm:px-6 sm:py-3 border border-white/20 mb-6">
                            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-[#22C55E] rounded-full animate-pulse"></div>
                            <span className="text-white/90 text-sm sm:text-base font-medium">DÉMO INTERACTIVE</span>
                        </div>

                        <h1 className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white mb-6 md:mb-8 leading-tight tracking-tight">
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-[#b2f2bb] to-[#22C55E]">
                                Découvrez Smart Agro en Action
                            </span>
                        </h1>

                        <p className="text-lg sm:text-xl md:text-2xl text-white/90 font-light max-w-3xl mx-auto mb-8 px-4">
                            Explorez notre plateforme d'agriculture intelligente à travers cette démo interactive
                        </p>
                    </div>
                </section>

                {/* Demo Video Section */}
                <section className="py-16 sm:py-20 md:py-24 bg-gradient-to-b from-[#F0FDF4] via-[#DCFCE7] to-[#BBF7D0]">
                    <div className="container mx-auto px-4 sm:px-6">
                        <div className="max-w-6xl mx-auto">
                            <div className="text-center mb-12 sm:mb-16">
                                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#166534] mb-4 sm:mb-6">
                                    Démonstration Interactive
                                </h2>
                                <p className="text-lg sm:text-xl text-[#15803D] max-w-2xl mx-auto">
                                    Regardez comment notre plateforme transforme la gestion de votre exploitation agricole
                                </p>
                            </div>

                            {/* Video Player - Style amélioré */}
                            <div className="relative bg-gradient-to-br from-[#052E16] to-[#14532D] rounded-3xl overflow-hidden shadow-2xl mb-12 sm:mb-16">
                                {/* Video Placeholder avec interface Smart Agro */}
                                <div
                                    ref={videoRef as any}
                                    className="relative aspect-video bg-gradient-to-br from-[#052E16] to-[#1A4D2E] flex items-center justify-center"
                                >
                                    {/* Simulation de l'interface Smart Agro */}
                                    <div className="absolute inset-0">
                                        {/* Header de l'interface */}
                                        <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-[#22C55E]/20 to-[#16A34A]/20 backdrop-blur-sm border-b border-white/10 p-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-gradient-to-br from-[#22C55E] to-[#16A34A] rounded-lg flex items-center justify-center">
                                                        <Leaf className="w-4 h-4 text-white" />
                                                    </div>
                                                    <span className="text-white font-bold">Smart Agro Dashboard</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 bg-[#22C55E] rounded-full animate-pulse"></div>
                                                    <span className="text-white/80 text-sm">EN TEMPS RÉEL</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Contenu principal */}
                                        <div className="absolute inset-0 top-16 flex items-center justify-center">
                                            <div className="text-center">
                                                <div className="relative inline-block">
                                                    <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-[#22C55E] to-[#16A34A] rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                                                        <Play className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
                                                    </div>
                                                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-[#84CC16] to-[#65A30D] rounded-full flex items-center justify-center">
                                                        <div className="w-4 h-4 bg-white rounded-full"></div>
                                                    </div>
                                                </div>
                                                <h3 className="text-white text-2xl sm:text-3xl font-bold mb-3">Smart Agro Platform</h3>
                                                <p className="text-white/70 text-lg">Démo interactive en cours de chargement...</p>
                                            </div>
                                        </div>

                                        {/* Widgets de démo */}
                                        <div className="absolute bottom-4 left-4 right-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                                            {demoFeatures.map((feature, idx) => (
                                                <div
                                                    key={idx}
                                                    className={`bg-gradient-to-br ${feature.color} backdrop-blur-sm rounded-xl p-3 border border-white/20 transition-all duration-300 ${activeFeature === idx ? 'scale-105 shadow-lg' : 'opacity-80'}`}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                                                            {feature.icon}
                                                        </div>
                                                        <span className="text-white text-sm font-medium truncate">{feature.title}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Overlay UI Elements */}
                                    <div className="absolute top-4 left-4">
                                        <div className="bg-black/50 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/10">
                                            <span className="text-white text-sm font-semibold">DÉMO EN DIRECT</span>
                                        </div>
                                    </div>

                                    <div className="absolute top-4 right-4">
                                        <div className="flex gap-2">
                                            <button className="bg-black/50 backdrop-blur-sm rounded-xl p-3 hover:bg-black/70 transition-colors border border-white/10">
                                                <Settings className="w-5 h-5 text-white" />
                                            </button>
                                            <button
                                                onClick={handleFullscreen}
                                                className="bg-black/50 backdrop-blur-sm rounded-xl p-3 hover:bg-black/70 transition-colors border border-white/10"
                                            >
                                                <Maximize2 className="w-5 h-5 text-white" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6">
                                        <div className="mb-3">
                                            <input
                                                type="range"
                                                min="0"
                                                max="100"
                                                value={currentTime}
                                                onChange={handleSeek}
                                                className="w-full h-2 bg-white/20 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#22C55E] [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg"
                                            />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <button
                                                    onClick={handlePlayPause}
                                                    className="bg-gradient-to-br from-[#22C55E] to-[#16A34A] hover:from-[#16A34A] hover:to-[#15803D] text-white rounded-full p-4 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1"
                                                >
                                                    {isPlaying ? (
                                                        <Pause className="w-6 h-6" />
                                                    ) : (
                                                        <Play className="w-6 h-6" />
                                                    )}
                                                </button>

                                                <div className="hidden sm:flex items-center gap-3">
                                                    <button className="text-white/70 hover:text-white transition-colors hover:bg-white/10 p-2 rounded-lg">
                                                        <SkipBack className="w-5 h-5" />
                                                    </button>
                                                    <button className="text-white/70 hover:text-white transition-colors hover:bg-white/10 p-2 rounded-lg">
                                                        <SkipForward className="w-5 h-5" />
                                                    </button>
                                                </div>

                                                <div className="text-white text-lg font-medium">
                                                    {formatTime(currentTime)} / 3:00
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <button className="text-white/70 hover:text-white transition-colors hover:bg-white/10 p-3 rounded-xl hidden sm:block">
                                                    <Download className="w-5 h-5" />
                                                </button>
                                                <button className="text-white/70 hover:text-white transition-colors hover:bg-white/10 p-3 rounded-xl">
                                                    <Share2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Features Overview - Style harmonisé */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                                {demoFeatures.map((feature, index) => (
                                    <div
                                        key={index}
                                        className="group bg-white/95 backdrop-blur-sm p-8 rounded-3xl border-2 border-[#22C55E]/30 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                                    >
                                        <div className="flex items-start gap-6">
                                            <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center text-white flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                                                {feature.icon}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-[#166534] text-xl mb-3">{feature.title}</h3>
                                                <p className="text-[#15803D] text-lg">{feature.description}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Process Steps */}
                            <div className="bg-gradient-to-r from-[#22C55E]/15 to-[#16A34A]/15 rounded-3xl p-8 border-2 border-[#22C55E]/30 backdrop-blur-sm mb-12">
                                <h3 className="text-2xl font-bold text-[#166534] mb-8 text-center">
                                    Comment ça marche ?
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {demoSteps.map((step, idx) => (
                                        <div key={idx} className="relative">
                                            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 border-2 border-[#22C55E]/30 text-center">
                                                <div className="w-12 h-12 bg-gradient-to-br from-[#22C55E] to-[#16A34A] rounded-xl flex items-center justify-center text-white mx-auto mb-4">
                                                    {step.icon}
                                                </div>
                                                <h4 className="font-bold text-[#166534] text-lg mb-2">{step.title}</h4>
                                                <p className="text-[#15803D]">{step.description}</p>
                                            </div>
                                            {idx < demoSteps.length - 1 && (
                                                <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                                                    <ChevronRight className="w-6 h-6 text-[#22C55E]/50" />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Benefits Section - Style harmonisé */}
                <section className="py-16 sm:py-20 md:py-24 bg-gradient-to-b from-[#F7FEE7] via-[#ECFCCB] to-[#D9F99D]">
                    <div className="container mx-auto px-4 sm:px-6">
                        <div className="max-w-6xl mx-auto">
                            <div className="text-center mb-12 sm:mb-16">
                                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#713F12] mb-4 sm:mb-6">
                                    Avantages Concrets
                                </h2>
                                <p className="text-lg sm:text-xl text-[#854D0E] max-w-2xl mx-auto">
                                    Découvrez comment Smart Agro peut transformer votre exploitation
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                                {benefits.map((benefit, index) => (
                                    <div
                                        key={index}
                                        className="group bg-white/95 backdrop-blur-sm p-6 rounded-2xl border-2 border-[#CA8A04]/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                                    >
                                        <div className="flex items-start gap-3">
                                            <CheckCircle className="w-6 h-6 text-[#CA8A04] flex-shrink-0 mt-0.5" />
                                            <p className="text-[#854D0E] font-medium text-lg">{benefit}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQ Section - Style harmonisé */}
                <section className="py-16 sm:py-20 md:py-24 bg-gradient-to-b from-[#ECFDF5] via-[#D1FAE5] to-[#A7F3D0]">
                    <div className="container mx-auto px-4 sm:px-6">
                        <div className="max-w-4xl mx-auto">
                            <div className="text-center mb-12 sm:mb-16">
                                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#065F46] mb-4 sm:mb-6">
                                    Questions Fréquentes
                                </h2>
                                <p className="text-lg sm:text-xl text-[#047857] max-w-2xl mx-auto">
                                    Tout ce que vous devez savoir sur notre démo et notre plateforme
                                </p>
                            </div>

                            <div className="space-y-6">
                                {[
                                    {
                                        question: "Combien de temps dure l'essai gratuit ?",
                                        answer: "L'essai gratuit dure 14 jours. Pendant cette période, vous avez accès à toutes les fonctionnalités de la plateforme sans aucune limitation."
                                    },
                                    {
                                        question: "Ai-je besoin de matériel spécifique ?",
                                        answer: "Notre solution est compatible avec la plupart des capteurs IoT standards du marché. Nous pouvons vous conseiller sur le matériel adapté à votre exploitation."
                                    },
                                    {
                                        question: "Puis-je annuler à tout moment ?",
                                        answer: "Oui, vous pouvez annuler votre abonnement à tout moment. Aucun engagement à long terme n'est requis."
                                    }
                                ].map((faq, idx) => (
                                    <div
                                        key={idx}
                                        className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 border-2 border-[#10B981]/30 shadow-lg hover:shadow-xl transition-all duration-300"
                                    >
                                        <h3 className="font-bold text-[#065F46] text-xl mb-4">{faq.question}</h3>
                                        <p className="text-[#047857] text-lg leading-relaxed">{faq.answer}</p>
                                    </div>
                                ))}
                            </div>
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