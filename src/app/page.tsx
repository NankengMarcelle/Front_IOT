"use client";

import Link from 'next/link';
import { useTranslation } from '@/providers/TranslationProvider';
import { ArrowRight, Leaf, Cpu, BarChart3, Shield, Zap, Target, Globe, ChevronDown, Cloud, Brain, Smartphone, Radio, FileText, ArrowLeft, Play, Layout, Users } from 'lucide-react';
import React, { useState, useRef, RefObject } from 'react';
import SimpleFooter from '@/components/layout/SimpleFooter';

export default function LandingPage() {
    const { t, isLoading } = useTranslation();
    const [language, setLanguage] = useState('fr');
    const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);

    const statsRef = useRef<HTMLDivElement>(null);
    const solutionRef = useRef<HTMLDivElement>(null);
    const featuresRef = useRef<HTMLDivElement>(null);
    const technologiesRef = useRef<HTMLDivElement>(null);
    const ctaRef = useRef<HTMLDivElement>(null);

    const scrollToSection = (ref: RefObject<HTMLDivElement>) => {
        if (ref.current) {
            ref.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const technologies = [
        {
            icon: <Radio className="w-8 h-8" />,
            title: "Capteurs IoT",
            desc: "Capteurs LoRaWAN mesurant N, P, K, pH, humidité, température",
            details: "DevEUI unique • Longue portée"
        },
        {
            icon: <Brain className="w-8 h-8" />,
            title: "Intelligence IA",
            desc: "Algorithme Random Forest pour une précision maximale",
            details: "ML Avancé • Analyse 360°"
        },
        {
            icon: <Cloud className="w-8 h-8" />,
            title: "Cloud Scalable",
            desc: "Traitement des données en temps réel sur infrastructure cloud",
            details: "Haute Disponibilité"
        }
    ];

    const stats = [
        { value: "40%", label: "De Rendement En Plus", color: "text-emerald-500" },
        { value: "30%", label: "D'Économie d'Eau", color: "text-lime-500" },
        { value: "24/7", label: "Sûreté & Surveillance", color: "text-[#052E16]" }
    ];

    const features = [
        {
            icon: <Target className="w-8 h-8" />,
            title: "Agriculture de Précision",
            desc: "Apportez exactement ce que votre terre demande, au bon moment."
        },
        {
            icon: <Zap className="w-8 h-8" />,
            title: "Réactions Instantanées",
            desc: "Soyez alerté en temps réel pour prévenir tout risque sur vos cultures."
        },
        {
            icon: <Layout className="w-8 h-8" />,
            title: "Interface Intuitive",
            desc: "Une gestion simplifiée accessible depuis n'importe quel appareil."
        }
    ];

    const languages = [
        { code: 'fr', name: 'Français', flag: '🇫🇷' },
        { code: 'en', name: 'English', flag: '🇺🇸' }
    ];

    const currentLanguage = languages.find(lang => lang.code === language);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-[#052E16] font-black uppercase tracking-widest text-[10px]">Chargement...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col relative overflow-hidden bg-white">
            {/* Elite Background Glows (Matching Demo Style) */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-emerald-50 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 opacity-60"></div>
                <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-lime-50 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 opacity-60"></div>
            </div>

            {/* Premium Header/Nav */}
            <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-all duration-300 backdrop-blur-md bg-white/5">
                <div className="max-w-7xl mx-auto flex items-center justify-between bg-white/40 backdrop-blur-2xl rounded-[32px] px-8 py-4 border border-white/40 shadow-sm">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 bg-[#052E16] rounded-xl flex items-center justify-center group-hover:bg-[#1A4D2E] transition-all">
                            <Leaf className="w-6 h-6 text-emerald-400" />
                        </div>
                        <span className="text-[#052E16] text-xl font-black tracking-tighter">Smart Agro</span>
                    </Link>

                    <div className="hidden md:flex items-center gap-10">
                        <button onClick={() => scrollToSection(solutionRef)} className="text-[#052E16]/60 hover:text-emerald-600 font-black text-[10px] uppercase tracking-widest transition-colors">La Solution</button>
                        <button onClick={() => scrollToSection(featuresRef)} className="text-[#052E16]/60 hover:text-emerald-600 font-black text-[10px] uppercase tracking-widest transition-colors">Expertise</button>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative group/lang">
                            <button
                                onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                                className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-2xl hover:bg-emerald-100 transition-all font-black text-[10px] uppercase tracking-widest text-emerald-700"
                            >
                                <span>{currentLanguage?.flag}</span>
                                <ChevronDown className={`w-3 h-3 transition-transform ${showLanguageDropdown ? 'rotate-180' : ''}`} />
                            </button>
                            {showLanguageDropdown && (
                                <div className="absolute top-full right-0 mt-2 w-48 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-emerald-50 overflow-hidden animate-fadeIn p-2 z-50">
                                    {languages.map((lang) => (
                                        <button
                                            key={lang.code}
                                            onClick={() => { setLanguage(lang.code); setShowLanguageDropdown(false); }}
                                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-emerald-50 transition-all font-black text-[10px] uppercase tracking-widest text-[#052E16]"
                                        >
                                            {lang.flag} {lang.name}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        <Link href="/login" className="px-6 py-2.5 bg-[#052E16] text-white rounded-full font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-lg active:scale-95">
                            login
                        </Link>
                    </div>
                </div>
            </header>

            <main className="flex-grow pt-12">
                {/* SECTION 1: HERO (Side-by-side Inspired by Demo) */}
                <section className="relative px-6 py-20 lg:py-32">
                    <div className="max-w-7xl mx-auto h-full">
                        <div className="grid lg:grid-cols-2 gap-20 items-center">
                            <div className="relative z-10 text-left animate-fadeIn">
                                <div className="inline-flex items-center gap-2 bg-emerald-100/50 px-4 py-2 rounded-full mb-8 border border-emerald-200">
                                    <div className="w-2 h-2 bg-emerald-600 rounded-full animate-ping shadow-[0_0_15px_rgba(5,150,105,0.9)]"></div>
                                    <span className="text-emerald-900 text-[10px] font-black uppercase tracking-[0.3em]">Smart Agro Intelligence</span>
                                </div>

                                <h1 className="text-4xl xs:text-5xl sm:text-7xl md:text-8xl font-black text-[#052E16] mb-8 leading-[0.9] tracking-tighter">
                                    Cultivez le <br />
                                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 via-emerald-500 to-lime-500">
                                        Futur Digital.
                                    </span>
                                </h1>

                                <p className="text-xl text-emerald-900/60 font-medium max-w-xl mb-12 leading-relaxed">
                                    Dépassez les méthodes traditionnelles. Connectez vos sols à une intelligence prédictive qui révolutionne chaque récolte.
                                </p>

                                <div className="flex flex-col sm:flex-row gap-6">
                                    <Link
                                        href="/demo"
                                        className="group relative px-10 py-5 bg-[#052E16] text-white rounded-[24px] font-black uppercase tracking-widest text-[10px] overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_20px_40px_-15px_rgba(5,46,22,0.3)] flex items-center justify-center gap-3"
                                    >
                                        <Play className="w-4 h-4 fill-current" />
                                        Notre vision
                                    </Link>

                                    <button
                                        onClick={() => scrollToSection(solutionRef)}
                                        className="px-10 py-5 bg-white border-2 border-emerald-100 text-[#052E16] rounded-[24px] font-black uppercase tracking-widest text-[10px] transition-all hover:border-emerald-500 hover:bg-emerald-50 flex items-center justify-center gap-3"
                                    >
                                        Voir plus
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="relative group h-full flex items-center justify-center lg:justify-end">
                                <div className="absolute -inset-10 bg-emerald-100/40 rounded-full blur-[100px] z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                                <div className="relative bg-white p-4 rounded-[56px] shadow-[0_64px_96px_-24px_rgba(0,0,0,0.12)] border border-emerald-50 transform hover:-translate-y-8 transition-all duration-700 w-full max-w-lg aspect-[5/6] overflow-hidden">
                                    <img
                                        src="/strawberry-field.jpg"
                                        alt="Green field"
                                        className="w-full h-full object-cover rounded-[48px] brightness-110 hover:scale-110 transition-transform duration-[2s]"
                                    />
                                    <div className="absolute inset-x-8 bottom-8 p-8 bg-white/20 backdrop-blur-3xl rounded-[32px] border border-white/30 shadow-2xl flex items-center gap-6">
                                        <div className="w-16 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-xl">
                                            <BarChart3 className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <p className="text-white text-[10px] font-black uppercase tracking-widest opacity-80">Précision Actuelle</p>
                                            <p className="text-white text-3xl font-black">99.8%</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION 2: STATS */}
                <section ref={statsRef} className="py-24 bg-white relative">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                            {stats.map((stat, idx) => (
                                <div key={idx} className="group bg-slate-50 rounded-[48px] p-12 border border-emerald-50 transition-all hover:bg-white hover:shadow-2xl hover:border-emerald-200">
                                    <p className={`text-7xl font-black mb-4 tracking-tighter ${stat.color}`}>{stat.value}</p>
                                    <p className="text-[#052E16]/40 text-xs font-black uppercase tracking-[0.2em]">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* SECTION 3: THE SOLUTION / PROBLEM */}
                <section ref={solutionRef} className="py-32 bg-slate-50 relative overflow-hidden">
                    <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-24 items-center">
                        <div className="relative aspect-square">
                            <div className="absolute inset-0 bg-emerald-500 rounded-[56px] rotate-3 opacity-20 transform group-hover:rotate-6 transition-transform"></div>
                            <img
                                src="/handful-soil-being-sprinkled-agricultural-land.jpg"
                                className="relative w-full h-full object-cover rounded-[56px] shadow-2xl grayscale-[20%] hover:grayscale-0 transition-all duration-1000"
                            />
                            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/40 backdrop-blur-2xl rounded-[40px] border border-white/40 shadow-xl p-8 flex flex-col justify-center">
                                <p className="text-[#052E16] text-4xl font-black tracking-tighter">1.5M</p>
                                <p className="text-[#052E16]/40 text-[9px] font-black uppercase tracking-widest">Données/Heure</p>
                            </div>
                        </div>

                        <div className="space-y-10">
                            <span className="text-emerald-600 font-black text-xs uppercase tracking-[0.4em]">Notre Vocation</span>
                            <h2 className="text-4xl xs:text-5xl sm:text-7xl font-black text-[#052E16] leading-[0.9] tracking-tighter">
                                Ne plus jamais<br />marcher à l'aveugle.
                            </h2>
                            <p className="text-emerald-900/60 text-xl font-medium leading-relaxed">
                                L'agronomie traditionnelle est un art. Nous en faisons une science exact, propulsée par des capteurs de pointe qui scrutent l'invisible pour vous.
                            </p>

                            <div className="space-y-6">
                                {[
                                    { t: "Données Brutes vers Insight", d: "Transformez vos mesures N-P-K en recommandations concrètes." },
                                    { t: "Anticipation Climatique", d: "Prédiction Random Forest intégrant les flux météo à 7 jours." }
                                ].map((item, idx) => (
                                    <div key={idx} className="flex gap-6 items-start">
                                        <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 shrink-0">
                                            <CheckCircle2 className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className="text-[#052E16] font-black text-lg">{item.t}</h4>
                                            <p className="text-gray-400 font-medium text-sm">{item.d}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION 4: FEATURES */}
                <section ref={featuresRef} className="py-32 bg-white relative">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="text-center mb-24">
                            <span className="text-emerald-600 font-black text-xs uppercase tracking-[0.4em] mb-4 block">Expertise Technique</span>
                            <h2 className="text-4xl xs:text-6xl font-black text-[#052E16] tracking-tighter">Une Armée de Précision.</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {features.map((feature, idx) => (
                                <div key={idx} className="group bg-slate-50/50 p-12 rounded-[52px] border border-slate-100 transition-all hover:bg-white hover:shadow-2xl hover:border-emerald-100">
                                    <div className="w-20 h-20 bg-emerald-500 rounded-[28px] flex items-center justify-center text-white mb-10 shadow-lg group-hover:rotate-6 transition-transform">
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-[#052E16] font-black text-2xl mb-4 tracking-tight">{feature.title}</h3>
                                    <p className="text-gray-400 font-medium leading-relaxed">{feature.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* SECTION 5: TECH / CTA INTEGRATED */}
                <section ref={ctaRef} className="py-32 bg-[#052E16] relative overflow-hidden group">
                    {/* Premium CTA Background Image */}
                    <div className="absolute inset-0 z-0">
                        <img
                            src="/agriculture-healthy-food.jpg"
                            className="w-full h-full object-cover opacity-60 transform group-hover:scale-105 transition-transform duration-[4s]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#052E16] via-[#052E16]/60 to-transparent"></div>
                    </div>

                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-emerald-400 rounded-full blur-[150px] animate-pulse"></div>
                    </div>

                    <div className="max-w-7xl mx-auto px-6 relative z-10">
                        <div className="grid lg:grid-cols-2 gap-24 items-center">
                            <div className="space-y-12">
                                <h2 className="text-4xl xs:text-5xl sm:text-7xl font-black text-white leading-[0.9] tracking-tighter">
                                    Une Infrastructure<br />Infrangible.
                                </h2>
                                <div className="space-y-8">
                                    {technologies.map((tech, idx) => (
                                        <div key={idx} className="p-8 bg-white/5 backdrop-blur-3xl rounded-[32px] border border-white/10 flex gap-8 items-center group hover:bg-white/10 transition-all">
                                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-emerald-500 shadow-xl group-hover:scale-110 transition-transform">
                                                {tech.icon}
                                            </div>
                                            <div>
                                                <h4 className="text-white font-black text-xl mb-1">{tech.title}</h4>
                                                <p className="text-white/40 text-[10px] font-black uppercase tracking-widest">{tech.details}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="relative">
                                <div className="bg-white/90 backdrop-blur-2xl rounded-[64px] p-16 text-center border border-white/20 shadow-2xl relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl"></div>
                                    <h3 className="text-4xl font-black text-[#052E16] tracking-tighter mb-6 underline decoration-lime-500 decoration-8 underline-offset-8">Commencez Aujourd'hui.</h3>
                                    <p className="text-emerald-900/60 text-lg font-medium mb-12">Gratuit pendant 14 jours. Pas de carte bancaire requise.</p>
                                    <div className="flex flex-col gap-4">
                                        <Link href="/register" className="px-10 py-5 bg-[#052E16] text-white rounded-[24px] font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-all shadow-[0_20px_40px_-10px_rgba(5,46,22,0.4)] relative group/btn overflow-hidden">
                                            <span className="relative z-10">Rejoindre l'aventure</span>
                                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-lime-500 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500"></div>
                                        </Link>
                                        <Link href="/demo" className="px-10 py-5 bg-white border-2 border-emerald-100 text-[#052E16] rounded-[24px] font-black uppercase tracking-widest text-[10px] hover:bg-emerald-50 hover:border-emerald-500 transition-all">
                                            Notre vision
                                        </Link>
                                    </div>
                                </div>
                            </div>
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
            `}</style>
        </div>
    );
}

function CheckCircle2(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
            <path d="m9 12 2 2 4-4" />
        </svg>
    )
}