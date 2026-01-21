"use client";

import Link from 'next/link';
import { useTranslation } from '@/providers/TranslationProvider';
import SimpleFooter from '@/components/layout/SimpleFooter';
import { ArrowLeft, Play, Pause, SkipBack, SkipForward, Maximize2, Settings, Download, Share2, BarChart3, Cpu, Leaf, Zap, Target, Shield, Clock, Users, CheckCircle, ChevronRight, Globe, ChevronDown, Radio, Brain, Cloud, WifiIcon, FileText, Smartphone, Database, ArrowRight, ChevronUp } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';

export default function DemoPage() {
    const { t, isLoading } = useTranslation();
    const [language, setLanguage] = useState('fr');
    const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [activeFeature, setActiveFeature] = useState(0);
    const videoRef = useRef<HTMLVideoElement>(null);
    const demoRef = useRef<HTMLDivElement>(null);

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
            color: "from-emerald-400 to-emerald-600",
            bgColor: "bg-white/60",
            borderColor: "border-emerald-200/50"
        },
        {
            icon: <Cpu className="w-6 h-6" />,
            title: "Contrôle IoT",
            description: "Gérez vos capteurs et équipements à distance en un clic.",
            color: "from-lime-400 to-lime-600",
            bgColor: "bg-white/40",
            borderColor: "border-lime-200/50"
        },
        {
            icon: <Brain className="w-6 h-6" />,
            title: "Analyse IA",
            description: "Recevez des recommandations personnalisées pour vos cultures.",
            color: "from-teal-400 to-teal-600",
            bgColor: "bg-white/60",
            borderColor: "border-teal-200/50"
        },
        {
            icon: <Zap className="w-6 h-6" />,
            title: "Alertes Intelligentes",
            description: "Soyez averti des anomalies et des actions nécessaires.",
            color: "from-amber-400 to-amber-600",
            bgColor: "bg-white/40",
            borderColor: "border-amber-200/50"
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
            icon: <Radio className="w-6 h-6" />,
            bgColor: "bg-white/80",
            borderColor: "border-emerald-100"
        },
        {
            title: "Analyse IA",
            description: "Le modèle Random Forest analyse les données collectées",
            icon: <Brain className="w-6 h-6" />,
            bgColor: "bg-emerald-50/50",
            borderColor: "border-emerald-200"
        },
        {
            title: "Recommandations",
            description: "Génération de recommandations personnalisées",
            icon: <FileText className="w-6 h-6" />,
            bgColor: "bg-white/80",
            borderColor: "border-emerald-100"
        },
        {
            title: "Visualisation",
            description: "Accès aux résultats sur le dashboard intuitif",
            icon: <Smartphone className="w-6 h-6" />,
            bgColor: "bg-emerald-50/50",
            borderColor: "border-emerald-200"
        }
    ];

    const scrollToDemo = () => {
        if (demoRef.current) {
            demoRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    useEffect(() => {
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
        const totalSeconds = 180;
        const seconds = Math.floor((percent / 100) * totalSeconds);
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-[#F0FDF4]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-[#22C55E] border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-[#166534] font-medium">Chargement...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col relative overflow-hidden bg-white">
            {/* Background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-50 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 opacity-60"></div>
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-lime-50 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 opacity-60"></div>
            </div>

            {/* Logo Smart Agro */}
            <div className="absolute top-4 sm:top-6 left-3 sm:left-6 z-50">
                <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
                    <div className="w-8 h-8 sm:w-12 sm:h-12 bg-[#052E16] rounded-xl flex items-center justify-center border border-white/10 group-hover:bg-[#1A4D2E] transition-all duration-300">
                        <Leaf className="w-4 h-4 sm:w-6 sm:h-6 text-emerald-400" />
                    </div>
                    <span className="text-[#052E16] text-sm sm:text-2xl font-black tracking-tighter">
                        Smart Agro
                    </span>
                </Link>
            </div>

            {/* Language Toggle */}
            <div className="absolute top-4 sm:top-6 right-3 sm:right-6 z-50">
                <div className="relative">
                    <button
                        onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                        className="bg-white/80 backdrop-blur-xl rounded-full p-2 sm:p-3 shadow-sm border border-emerald-100 hover:shadow-md transition-all duration-300 flex items-center gap-2 group"
                    >
                        <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-[#052E16] group-hover:text-emerald-600 transition-colors" />
                        <span className="text-xs sm:text-sm font-black text-[#052E16] whitespace-nowrap hidden xs:inline">
                            {currentLanguage?.flag} {currentLanguage?.name}
                        </span>
                        <ChevronDown className={`w-3 h-3 sm:w-4 sm:h-4 text-emerald-600/50 transition-transform duration-300 ${showLanguageDropdown ? 'rotate-180' : ''}`} />
                    </button>

                    {showLanguageDropdown && (
                        <div className="absolute top-full right-0 mt-2 w-48 bg-white/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-emerald-50 overflow-hidden animate-fadeIn z-50">
                            <div className="p-2">
                                {languages.map((lang) => (
                                    <button
                                        key={lang.code}
                                        onClick={() => {
                                            setLanguage(lang.code);
                                            setShowLanguageDropdown(false);
                                        }}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-emerald-50 transition-all duration-200 ${language === lang.code ? 'bg-emerald-50' : ''}`}
                                    >
                                        <span className="text-lg">{lang.flag}</span>
                                        <span className={`text-sm font-bold ${language === lang.code ? 'text-emerald-700' : 'text-gray-700'}`}>
                                            {lang.name}
                                        </span>
                                        {language === lang.code && <div className="ml-auto w-1.5 h-1.5 bg-emerald-500 rounded-full" />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <main className="flex-grow pt-32">
                {/* Hero Section Refined */}
                <section className="relative px-6 pb-20 overflow-hidden">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid lg:grid-cols-2 gap-20 items-center">
                            <div className="relative z-10 text-left">
                                <div className="inline-flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-full mb-8 border border-emerald-100">
                                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
                                    <span className="text-emerald-800 text-[10px] font-black uppercase tracking-[0.2em]">Expérience Live</span>
                                </div>

                                <h1 className="text-6xl sm:text-8xl font-black text-[#052E16] mb-8 leading-[0.9] tracking-tighter">
                                    La Data au<br />
                                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 via-emerald-500 to-lime-500">
                                        Cœur de la Terre.
                                    </span>
                                </h1>

                                <p className="text-xl text-emerald-900/70 font-medium max-w-xl mb-12 leading-relaxed">
                                    Découvrez comment nous fusionnons l'agronomie et le numérique pour transformer chaque parcelle en un écosystème intelligent hautement productif.
                                </p>

                                <div className="flex flex-col sm:flex-row gap-6">
                                    <button
                                        onClick={scrollToDemo}
                                        className="group relative px-10 py-5 bg-[#052E16] text-white rounded-[24px] font-black uppercase tracking-widest text-[10px] overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_20px_40px_-15px_rgba(5,46,22,0.3)]"
                                    >
                                        <span className="relative z-10 flex items-center justify-center gap-3">
                                            <Play className="w-4 h-4 fill-current" />
                                            Démarrer le voyage
                                        </span>
                                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-lime-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    </button>

                                    <Link
                                        href="/register"
                                        className="px-10 py-5 bg-white border-2 border-emerald-100 text-[#052E16] rounded-[24px] font-black uppercase tracking-widest text-[10px] transition-all hover:border-emerald-500 hover:bg-emerald-50 flex items-center justify-center gap-3"
                                    >
                                        Créer un compte
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>

                            <div className="relative group">
                                <div className="absolute -inset-10 bg-emerald-100/50 rounded-full blur-[80px] group-hover:bg-emerald-200/50 transition-colors duration-1000"></div>
                                <div className="relative bg-white p-4 rounded-[48px] shadow-[0_48px_80px_-20px_rgba(0,0,0,0.1)] border border-emerald-50">
                                    <div className="aspect-[4/5] rounded-[36px] overflow-hidden relative">
                                        <img
                                            src="/handful-soil-being-sprinkled-agricultural-land.jpg"
                                            alt="Soil sprinkling"
                                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/60 via-transparent to-transparent"></div>
                                        <div className="absolute bottom-8 left-8 right-8 p-6 bg-white/20 backdrop-blur-2xl rounded-3xl border border-white/30">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-lg">
                                                    <BarChart3 className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <p className="text-white text-[10px] font-black uppercase tracking-widest opacity-80">Rendement estimé</p>
                                                    <p className="text-white text-2xl font-black">+42.5%</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Video Demo Overhaul */}
                <section ref={demoRef} className="py-24 bg-[#052E16] relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#22C55E_0%,transparent_70%)]"></div>
                    </div>

                    <div className="max-w-7xl mx-auto px-6 relative z-10">
                        <div className="text-center mb-20">
                            <span className="text-emerald-400 font-black text-xs uppercase tracking-[0.4em] mb-4 block">Interactive Demo</span>
                            <h2 className="text-5xl sm:text-7xl font-black text-white leading-[0.9] tracking-tighter mb-8">
                                Redéfinir l'Expérience Agricole.
                            </h2>
                        </div>

                        <div className="relative group max-w-5xl mx-auto mb-24">
                            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-lime-500 rounded-[52px] blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
                            <div className="relative bg-black rounded-[48px] overflow-hidden shadow-2xl border border-white/5 aspect-video flex flex-col">
                                {/* Custom Video Header */}
                                <div className="p-6 bg-black/40 backdrop-blur-xl border-b border-white/10 flex items-center justify-between z-20">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                                            <Leaf className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-white font-black text-sm uppercase tracking-wider">Dashboard Smart Agro</h3>
                                            <p className="text-emerald-400 text-[10px] font-bold">● LIVE SIMULATION</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <button className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-white transition-all">
                                            <Settings className="w-5 h-5" />
                                        </button>
                                        <button onClick={handleFullscreen} className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-white transition-all">
                                            <Maximize2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                {/* Main Video Content (Simulated) */}
                                <div className="flex-grow flex items-center justify-center relative overflow-hidden bg-[url('/fond.jpg')] bg-cover bg-center">
                                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>

                                    <div className="text-center z-10 transition-all duration-700" style={{ transform: isPlaying ? 'scale(0.8) translateY(-20px)' : 'scale(1) translateY(0)' }}>
                                        <button
                                            onClick={handlePlayPause}
                                            className="w-24 h-24 bg-white/10 backdrop-blur-3xl border border-white/20 rounded-full flex items-center justify-center group/play hover:bg-white/20 active:scale-90 transition-all shadow-2xl"
                                        >
                                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-xl group-hover/play:scale-110 transition-transform">
                                                {isPlaying ? <Pause className="w-8 h-8 text-[#052E16] fill-current" /> : <Play className="w-8 h-8 text-[#052E16] fill-current ml-1" />}
                                            </div>
                                        </button>
                                        <h3 className="text-white text-3xl font-black mt-8 tracking-tighter">Visionnez le Futur</h3>
                                        <p className="text-white/60 font-medium">180 secondes pour tout changer</p>
                                    </div>

                                    {/* Real-time floating badges when playing */}
                                    <div className={`absolute bottom-28 left-8 space-y-3 transition-all duration-1000 ${isPlaying ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                                        <div className="bg-white/10 backdrop-blur-xl border border-white/20 px-4 py-2 rounded-2xl flex items-center gap-3">
                                            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                                            <span className="text-white text-[10px] font-black tracking-widest">N-P-K: OPTIMAL</span>
                                        </div>
                                        <div className="bg-white/10 backdrop-blur-xl border border-white/20 px-4 py-2 rounded-2xl flex items-center gap-3">
                                            <div className="w-2 h-2 bg-lime-400 rounded-full animate-pulse"></div>
                                            <span className="text-white text-[10px] font-black tracking-widest">PH: 6.8 (STABLE)</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Custom Video Controls */}
                                <div className="p-8 bg-black/60 backdrop-blur-3xl border-t border-white/10 z-20">
                                    <div className="flex flex-col gap-6">
                                        <div className="relative group/range">
                                            <input
                                                type="range"
                                                min="0"
                                                max="100"
                                                value={currentTime}
                                                onChange={handleSeek}
                                                className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer outline-none overflow-hidden"
                                                style={{
                                                    background: `linear-gradient(to right, #10b981 ${currentTime}%, rgba(255,255,255,0.1) ${currentTime}%)`
                                                }}
                                            />
                                            <div className="absolute -top-8 bg-emerald-500 text-white text-[10px] font-black px-2 py-1 rounded opacity-0 group-hover/range:opacity-100 transition-opacity" style={{ left: `${currentTime}%`, transform: 'translateX(-50%)' }}>
                                                {formatTime(currentTime)}
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-8">
                                                <button onClick={handlePlayPause} className="text-white hover:text-emerald-400 transition-colors transform active:scale-95">
                                                    {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
                                                </button>
                                                <div className="flex items-center gap-4">
                                                    <button className="text-white/40 hover:text-white transition-colors"><SkipBack className="w-5 h-5" /></button>
                                                    <button className="text-white/40 hover:text-white transition-colors"><SkipForward className="w-5 h-5" /></button>
                                                </div>
                                                <span className="text-white/80 font-black text-xs tracking-widest">
                                                    {formatTime(currentTime)} / 03:00
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-6">
                                                <button className="group flex items-center gap-2 text-white/40 hover:text-white transition-colors">
                                                    <Download className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
                                                    <span className="text-[10px] font-black">RESOURCES (.PDF)</span>
                                                </button>
                                                <button className="p-3 bg-emerald-500 text-white rounded-xl shadow-lg hover:shadow-emerald-500/50 hover:bg-emerald-400 transition-all flex items-center gap-2">
                                                    <Share2 className="w-4 h-4" />
                                                    <span className="text-[10px] font-black">PARTAGER</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Feature Cards Glassmorphism */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {demoFeatures.map((feature, idx) => (
                                <div
                                    key={idx}
                                    className={`group relative ${feature.bgColor} backdrop-blur-xl p-8 rounded-[40px] border border-white/10 transition-all duration-500 hover:-translate-y-4 hover:shadow-2xl overflow-hidden`}
                                >
                                    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${feature.color} opacity-10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700`}></div>

                                    <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center text-white mb-8 shadow-xl group-hover:rotate-6 transition-all`}>
                                        {feature.icon}
                                    </div>

                                    <h3 className="text-white font-black text-xl mb-4 leading-tight group-hover:text-emerald-100 transition-colors">
                                        {feature.title}
                                    </h3>

                                    <p className="text-white/50 text-sm font-medium leading-relaxed">
                                        {feature.description}
                                    </p>

                                    <div className="mt-8 flex items-center gap-2 text-[10px] font-black text-emerald-400 tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span>Détails</span>
                                        <ArrowRight className="w-3 h-3" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Benefits Section Refined */}
                <section className="py-32 bg-slate-50 relative overflow-hidden">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="flex flex-col lg:flex-row gap-20">
                            <div className="lg:w-1/2">
                                <h2 className="text-5xl sm:text-7xl font-black text-[#052E16] leading-[0.9] tracking-tighter mb-12">
                                    Une Croissance<br />Mesurable.
                                </h2>
                                <p className="text-emerald-900/60 text-xl font-medium mb-12">
                                    Nous ne nous contentons pas de connecter vos champs. Nous augmentons leur intelligence naturelle.
                                </p>

                                <div className="space-y-6">
                                    {benefits.map((benefit, idx) => (
                                        <div key={idx} className="flex items-center gap-5 p-4 bg-white rounded-3xl border border-emerald-50 shadow-sm transition-all hover:translate-x-4">
                                            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-lg">
                                                <CheckCircle className="w-5 h-5" />
                                            </div>
                                            <span className="text-[#052E16] font-bold text-lg">{benefit}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="lg:w-1/2 relative">
                                <div className="grid grid-cols-2 gap-8 h-full">
                                    <div className="space-y-8 mt-12">
                                        <div className="bg-emerald-600 p-10 rounded-[48px] text-white shadow-2xl relative overflow-hidden group">
                                            <div className="absolute top-0 right-0 p-8 opacity-20"><BarChart3 className="w-20 h-20" /></div>
                                            <p className="text-4xl font-black mb-2 tracking-tighter">40%</p>
                                            <p className="text-emerald-100 text-xs font-black uppercase tracking-widest">Gain Rendement</p>
                                        </div>
                                        <div className="bg-white p-10 rounded-[48px] text-[#052E16] border border-emerald-100 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.06)] group">
                                            <p className="text-4xl font-black mb-2 tracking-tighter text-emerald-600">30%</p>
                                            <p className="text-gray-400 text-xs font-black uppercase tracking-widest">Économie Eau</p>
                                        </div>
                                    </div>
                                    <div className="space-y-8">
                                        <div className="bg-[#F0FDF4] p-10 rounded-[48px] text-[#052E16] border border-emerald-200 shadow-xl group">
                                            <p className="text-4xl font-black mb-2 tracking-tighter text-lime-600">24/7</p>
                                            <p className="text-gray-400 text-xs font-black uppercase tracking-widest">Surveillance</p>
                                        </div>
                                        <div className="bg-emerald-900 p-10 rounded-[48px] text-white shadow-2xl group">
                                            <p className="text-4xl font-black mb-2 tracking-tighter text-emerald-400">99.8%</p>
                                            <p className="text-emerald-100/50 text-xs font-black uppercase tracking-widest">Précision IA</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQ Section Premium */}
                <section className="py-32 bg-white relative">
                    <div className="max-w-4xl mx-auto px-6">
                        <div className="text-center mb-20">
                            <span className="text-emerald-600 font-black text-xs uppercase tracking-[0.4em] mb-4 block">Knowledge Center</span>
                            <h2 className="text-5xl font-black text-[#052E16] tracking-tighter mb-4">Questions Fréquentes</h2>
                        </div>

                        <div className="grid gap-6">
                            {[
                                {
                                    q: "Combien de temps dure l'essai gratuit ?",
                                    a: "L'essai gratuit dure 14 jours. Pendant cette période, vous avez accès à toutes les fonctionnalités de la plateforme sans aucune limitation.",
                                    icon: <Clock className="w-6 h-6" />
                                },
                                {
                                    q: "Ai-je besoin de matériel spécifique ?",
                                    a: "Notre solution est compatible avec la plupart des capteurs IoT standards. Nous préconisons la gamme LoRaWAN pour une portée maximale.",
                                    icon: <Cpu className="w-6 h-6" />
                                },
                                {
                                    q: "Puis-je annuler à tout moment ?",
                                    a: "Absolument. Nos offres sont sans engagement. Vous gérez votre abonnement en toute autonomie depuis votre espace client.",
                                    icon: <Shield className="w-6 h-6" />
                                }
                            ].map((item, idx) => (
                                <div key={idx} className="group bg-slate-50 rounded-[40px] p-10 border border-slate-100 transition-all hover:bg-white hover:shadow-2xl hover:border-emerald-100">
                                    <div className="flex gap-8">
                                        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm group-hover:bg-emerald-500 group-hover:text-white transition-all">
                                            {item.icon}
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-black text-[#052E16] mb-4 tracking-tight">{item.q}</h3>
                                            <p className="text-gray-500 font-medium leading-relaxed">{item.a}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            <SimpleFooter />

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.8s ease-out forwards;
                }
                input[type=range]::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 20px;
                    height: 20px;
                    background: #ffffff;
                    border: 4px solid #10b981;
                    border-radius: 50%;
                    cursor: pointer;
                    box-shadow: 0 0 20px rgba(16, 185, 129, 0.4);
                    transition: all 0.2s;
                }
                input[type=range]::-webkit-slider-thumb:hover {
                    transform: scale(1.2);
                    box-shadow: 0 0 30px rgba(16, 185, 129, 0.6);
                }
            `}</style>
        </div>
    );
}