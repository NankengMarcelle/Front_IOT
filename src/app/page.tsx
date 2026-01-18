"use client";

import Link from 'next/link';
import { useTranslation } from '@/providers/TranslationProvider';
import Footer from '@/components/layout/Footer';
import { ArrowRight, Leaf, Cpu, BarChart3, Shield, Zap, Users, Target, Globe, ChevronDown, Cloud, Wifi, Database, Brain, Smartphone, Radio, Cpu as CpuIcon, FileText, Wifi as WifiIcon, ChevronUp } from 'lucide-react';
import { useState, useRef, RefObject } from 'react';

export default function LandingPage() {
    const { t, isLoading } = useTranslation();
    const [language, setLanguage] = useState('fr');
    const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
    const statsRef = useRef<HTMLDivElement>(null);
    const solutionRef = useRef<HTMLDivElement>(null);
    const featuresRef = useRef<HTMLDivElement>(null);
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
            details: "DevEUI unique • Longue portée • Faible consommation"
        },
        {
            icon: <Brain className="w-8 h-8" />,
            title: "Modèle Random Forest",
            desc: "Algorithme ML pour prédiction des cultures optimales",
            details: "Haute précision • Analyse multi-paramètres • Apprentissage continu"
        },
        {
            icon: <Cloud className="w-8 h-8" />,
            title: "Plateforme Cloud",
            desc: "Serveur ChripStack pour stockage et traitement des données",
            details: "Scalable • Sécurisé • Temps réel"
        },
        {
            icon: <WifiIcon className="w-8 h-8" />,
            title: "Réseau LoRaWAN",
            desc: "Communication longue distance pour zones rurales",
            details: "Portée étendue • Autonomie maximale • Faible coût"
        },
        {
            icon: <FileText className="w-8 h-8" />,
            title: "Système Expert",
            desc: "Recommandations basées sur données météo et sol",
            details: "Prévisions 7 jours • Actions préventives • Personnalisé"
        },
        {
            icon: <Smartphone className="w-8 h-8" />,
            title: "Dashboard Intuitif",
            desc: "Interface utilisateur pour gestion et visualisation",
            details: "Temps réel • Multi-utilisateurs • Rapports détaillés"
        }
    ];

    const stats = [
        { value: "+40%", label: "Gain de Productivité" },
        { value: "24/7", label: "Surveillance Continue" },
        { value: "99.8%", label: "Précision des Mesures" }
    ];

    const features = [
        {
            icon: <Leaf className="w-8 h-8" />,
            title: "Recommandations Intelligentes",
            desc: "Système expert basé sur Random Forest pour sélection optimale des cultures"
        },
        {
            icon: <Cpu className="w-8 h-8" />,
            title: "Capteurs LoRaWAN",
            desc: "Mesure en temps réel des paramètres du sol (N, P, K, pH, humidité, température)"
        },
        {
            icon: <BarChart3 className="w-8 h-8" />,
            title: "Analyse Prédictive",
            desc: "Prédictions basées sur données sol et prévisions météorologiques"
        },
        {
            icon: <Shield className="w-8 h-8" />,
            title: "Gestion Centralisée",
            desc: "Dashboard pour gestion des utilisateurs, parcelles et capteurs"
        },
        {
            icon: <Zap className="w-8 h-8" />,
            title: "Connectivité Étendue",
            desc: "Communication longue distance adaptée aux zones rurales"
        },
        {
            icon: <Target className="w-8 h-8" />,
            title: "Agriculture de Précision",
            desc: "Optimisation des ressources et préservation environnementale"
        }
    ];

    const languages = [
        { code: 'fr', name: 'Français', flag: '🇫🇷' },
        { code: 'en', name: 'English', flag: '🇺🇸' }
    ];

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

    const currentLanguage = languages.find(lang => lang.code === language);

    return (
        <div className="min-h-screen flex flex-col relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#22C55E]/5 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#16A34A]/5 rounded-full blur-3xl"></div>
            </div>

            {/* Logo Smart Agro en haut à gauche */}
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

            {/* Language Toggle */}
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

                    {showLanguageDropdown && (
                        <div className="absolute top-full right-0 mt-2 w-40 sm:w-48 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-[#E5E7EB] overflow-hidden animate-fadeIn">
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
                                        <Globe className="w-3 h-3 sm:w-4 sm:h-4 text-[#374151] flex-shrink-0" />
                                        <span className={`text-sm sm:text-base font-medium ${language === lang.code ? 'text-[#22C55E]' : 'text-[#374151]'} flex-shrink-0`}>
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
                {/* SECTION 1: HERO - Vert foncé avec blanc */}
                <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#052E16] via-[#14532D] to-[#166534]">
                    <div
                        className="absolute inset-0"
                        style={{
                            backgroundImage: `linear-gradient(rgba(5, 46, 22, 0.9), rgba(5, 46, 22, 0.9)), url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2832&auto=format&fit=crop')`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundBlendMode: 'overlay'
                        }}
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-[#052E16]/90 via-transparent to-transparent"></div>

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
                            Système IoT intelligent recommandant la culture optimale basée sur l'analyse du sol et les prévisions météorologiques
                        </p>

                        {/* Bouton pour aller à la section CTA */}
                        <button
                            onClick={() => scrollToSection(ctaRef)}
                            className="mt-8 sm:mt-12 inline-flex items-center gap-2 px-6 py-3 sm:px-8 sm:py-4 bg-white/10 backdrop-blur-sm border border-white/30 hover:border-white/50 text-white rounded-xl sm:rounded-2xl font-medium hover:bg-white/15 transition-all duration-300 group"
                        >
                            <span>Découvrir la solution</span>
                            <ChevronDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
                        </button>
                    </div>

                    {/* SCROLL INDICATOR À LA FIN DE LA ZONE - Ramène aux statistiques */}
                    <button
                        onClick={() => scrollToSection(statsRef)}
                        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce cursor-pointer z-20"
                    >
                        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center hover:border-white/80 transition-colors">
                            <div className="w-1 h-3 bg-white/70 rounded-full mt-2"></div>
                        </div>
                    </button>
                </section>

                {/* SECTION 2: STATISTIQUES - Blanc et vert clair */}
                <section ref={statsRef} className="py-16 sm:py-20 bg-gradient-to-b from-white via-[#F7FEE7] to-[#ECFCCB]">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 md:gap-10">
                            {stats.map((stat, index) => (
                                <div
                                    key={index}
                                    className="text-center p-6 sm:p-8 md:p-10 rounded-2xl sm:rounded-3xl bg-white/95 backdrop-blur-sm border border-[#84CC16]/30 shadow-lg hover:shadow-xl sm:hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 sm:hover:-translate-y-2"
                                >
                                    <div
                                        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-4 sm:mb-6 leading-none"
                                        style={{
                                            background: 'linear-gradient(135deg, #84CC16 0%, #65A30D 100%)',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                            backgroundClip: 'text'
                                        }}
                                    >
                                        {stat.value}
                                    </div>
                                    <div className="text-[#166534] text-base sm:text-lg font-bold mb-2">
                                        {stat.label}
                                    </div>
                                    <div className="mt-4 sm:mt-6 md:mt-8 pt-4 sm:pt-6 border-t border-[#84CC16]/30">
                                        <div className="text-xs sm:text-sm text-[#65A30D] font-medium">
                                            Performance moyenne
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* SECTION 3: DÉFI - Blanc et vert olive */}
                <section ref={solutionRef} className="py-16 sm:py-20 md:py-24 bg-gradient-to-b from-white via-[#FEFCE8] to-[#F7FEE7]">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 md:gap-16 items-center">
                            {/* Image à gauche - Agriculture traditionnelle */}
                            <div className="relative">
                                <div className="rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border-2 border-[#84CC16]/20">
                                    <img
                                        src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2070&auto=format&fit=crop"
                                        alt="Agriculture traditionnelle"
                                        className="w-full h-64 sm:h-80 md:h-96 object-cover transform hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                                    <div className="absolute bottom-6 left-6 right-6">
                                        <span className="inline-block px-4 py-2 bg-gradient-to-r from-[#84CC16] to-[#65A30D] backdrop-blur-sm text-white rounded-full text-sm font-semibold">
                                            Problématique Actuelle
                                        </span>
                                    </div>
                                </div>
                                <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-[#84CC16] to-[#65A30D] rounded-full -z-10 blur-xl opacity-20"></div>
                            </div>

                            {/* Solution à droite */}
                            <div>
                                <div className="mb-6 sm:mb-8">
                                    <h2 className="text-3xl sm:text-4xl font-black text-[#166534] mb-4 sm:mb-6 leading-tight">
                                        Défi de l'Agriculture Traditionnelle
                                    </h2>
                                </div>

                                <div className="space-y-4 sm:space-y-6">
                                    <div className="flex items-start gap-3 sm:gap-4 p-4 bg-white/90 backdrop-blur-sm rounded-xl border border-[#84CC16]/30">
                                        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-[#84CC16] to-[#65A30D] flex items-center justify-center flex-shrink-0">
                                            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-white rounded-full"></div>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-[#166534] text-base sm:text-lg mb-1">Décisions Empiriques</h4>
                                            <p className="text-[#15803D] text-sm sm:text-base">
                                                Choix des cultures basés sur l'expérience plutôt que sur des données scientifiques
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3 sm:gap-4 p-4 bg-white/90 backdrop-blur-sm rounded-xl border border-[#84CC16]/30">
                                        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-[#84CC16] to-[#65A30D] flex items-center justify-center flex-shrink-0">
                                            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-white rounded-full"></div>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-[#166534] text-base sm:text-lg mb-1">Gaspillage des Ressources</h4>
                                            <p className="text-[#15803D] text-sm sm:text-base">
                                                Irrigation et fertilisation non optimisées entraînant des pertes économiques
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3 sm:gap-4 p-4 bg-white/90 backdrop-blur-sm rounded-xl border border-[#84CC16]/30">
                                        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-[#84CC16] to-[#65A30D] flex items-center justify-center flex-shrink-0">
                                            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-white rounded-full"></div>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-[#166534] text-base sm:text-lg mb-1">Connectivité Limitée</h4>
                                            <p className="text-[#15803D] text-sm sm:text-base">
                                                Absence de monitoring en temps réel dans les zones rurales isolées
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="relative w-full h-[40vh] sm:h-[50vh] md:h-[60vh] overflow-hidden">
                    <div className="absolute inset-0">
                        <img
                            src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2070&auto=format&fit=crop&crop=center"
                            alt="Agriculteur utilisant la technologie IoT et IA dans son champ"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#052E16]/80 via-[#052E16]/60 to-transparent"></div>
                    </div>

                    {/* Overlay visuel avec éléments IoT/IA */}
                    <div className="absolute inset-0">
                        {/* Éléments flottants IoT */}
                        <div className="absolute top-1/4 left-1/4 w-12 h-12 sm:w-16 sm:h-16 bg-white/20 backdrop-blur-sm rounded-full border-2 border-[#22C55E] animate-pulse">
                            <div className="absolute inset-2 bg-[#22C55E]/30 rounded-full"></div>
                        </div>
                        <div className="absolute top-1/3 right-1/3 w-10 h-10 sm:w-14 sm:h-14 bg-white/20 backdrop-blur-sm rounded-full border-2 border-[#3B82F6] animate-pulse delay-300">
                            <div className="absolute inset-2 bg-[#3B82F6]/30 rounded-full"></div>
                        </div>
                        <div className="absolute bottom-1/4 left-1/3 w-8 h-8 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-sm rounded-full border-2 border-[#8B5CF6] animate-pulse delay-700">
                            <div className="absolute inset-2 bg-[#8B5CF6]/30 rounded-full"></div>
                        </div>

                        {/* Réseau de connexion */}
                        <div className="absolute top-0 left-0 right-0 bottom-0">
                            <svg className="w-full h-full">
                                {/* Lignes de connexion entre les éléments IoT */}
                                <line x1="25%" y1="25%" x2="33%" y2="33%" stroke="#22C55E" strokeWidth="2" strokeDasharray="5,5" opacity="0.5" />
                                <line x1="33%" y1="33%" x2="67%" y2="33%" stroke="#3B82F6" strokeWidth="2" strokeDasharray="5,5" opacity="0.5" />
                                <line x1="33%" y1="33%" x2="33%" y2="67%" stroke="#8B5CF6" strokeWidth="2" strokeDasharray="5,5" opacity="0.5" />
                            </svg>
                        </div>

                        {/* Texte minimal avec icônes */}
                        <div className="absolute bottom-10 left-10 right-10 flex flex-col items-center">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30">
                                    <Brain className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                                </div>
                                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                                    +
                                </div>
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30">
                                    <Wifi className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                                </div>
                                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                                    =
                                </div>
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#22C55E] to-[#16A34A] rounded-xl flex items-center justify-center">
                                    <Leaf className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-white/90 text-sm sm:text-base font-light">
                                    L'agriculture du futur commence ici
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION 4: SOLUTION COMPLÈTE - Blanc et vert moyen */}
                <section ref={featuresRef} id="features" className="py-16 sm:py-20 md:py-24 bg-gradient-to-b from-white via-[#F0FDF4] to-[#DCFCE7]">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                        <div className="text-center mb-12 sm:mb-16">
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#166534] mb-4 sm:mb-6">
                                Notre Solution Complète
                            </h2>
                            <p className="text-lg sm:text-xl text-[#15803D] max-w-3xl mx-auto px-4">
                                Une plateforme intégrée combinant technologies de pointe pour une agriculture intelligente
                            </p>
                        </div>

                        {/* Image à droite, texte à gauche */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 md:gap-16 items-center mb-12 sm:mb-16">
                            {/* Texte à GAUCHE */}
                            <div className="order-2 lg:order-1">
                                <div className="space-y-6 sm:space-y-8">
                                    <div className="p-6 sm:p-8 bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl border border-[#22C55E]/30 shadow-lg">
                                        <h3 className="text-xl sm:text-2xl font-bold text-[#166534] mb-3 sm:mb-4">
                                            Collecte de Données Intelligente
                                        </h3>
                                        <p className="text-[#15803D] leading-relaxed">
                                            Capteurs IoT LoRaWAN mesurent en temps réel les paramètres essentiels du sol : azote (N), phosphore (P), potassium (K), pH, humidité et température.
                                        </p>
                                    </div>

                                    <div className="p-6 sm:p-8 bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl border border-[#22C55E]/30 shadow-lg">
                                        <h3 className="text-xl sm:text-2xl font-bold text-[#166534] mb-3 sm:mb-4">
                                            Intelligence Artificielle Avancée
                                        </h3>
                                        <p className="text-[#15803D] leading-relaxed">
                                            Modèle Random Forest analyse les données pour prédire la culture optimale et générer des recommandations basées sur les prévisions météo sur 7 jours.
                                        </p>
                                    </div>

                                    <div className="p-6 sm:p-8 bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl border border-[#22C55E]/30 shadow-lg">
                                        <h3 className="text-xl sm:text-2xl font-bold text-[#166534] mb-3 sm:mb-4">
                                            Dashboard Complet
                                        </h3>
                                        <p className="text-[#15803D] leading-relaxed">
                                            Interface intuitive permettant la gestion des utilisateurs, parcelles, capteurs et la réception des recommandations personnalisées en temps réel.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Image à DROITE */}
                            <div className="relative order-1 lg:order-2">
                                <div className="rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border-2 border-[#22C55E]/30">
                                    <img
                                        src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop"
                                        alt="Agriculture intelligente combinant IA et IoT"
                                        className="w-full h-64 sm:h-80 md:h-96 object-cover transform hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                                    <div className="absolute bottom-6 left-6 right-6">
                                        <span className="inline-block px-4 py-2 bg-gradient-to-r from-[#22C55E] to-[#16A34A] backdrop-blur-sm text-white rounded-full text-sm font-semibold">
                                            IA + IoT = Agriculture Intelligente
                                        </span>
                                    </div>
                                </div>
                                <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-br from-[#22C55E] to-[#16A34A] rounded-full -z-10 blur-xl opacity-20"></div>
                                <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-gradient-to-br from-[#84CC16] to-[#65A30D] rounded-full -z-10 blur-xl opacity-20"></div>
                            </div>
                        </div>

                        {/* Features grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                            {features.map((feature, index) => (
                                <div
                                    key={index}
                                    className="group bg-white/95 backdrop-blur-sm p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-[#22C55E]/30 shadow-sm hover:shadow-xl sm:hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 sm:hover:-translate-y-2 hover:border-[#22C55E]/50"
                                >
                                    <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-[#22C55E] to-[#16A34A] rounded-xl sm:rounded-2xl flex items-center justify-center text-white mb-4 sm:mb-6 group-hover:scale-105 sm:group-hover:scale-110 transition-transform duration-300">
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-lg sm:text-xl font-bold text-[#166534] mb-3 sm:mb-4">
                                        {feature.title}
                                    </h3>
                                    <p className="text-[#15803D] leading-relaxed text-sm sm:text-base">
                                        {feature.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* SECTION 5: TECHNOLOGIES - Blanc et vert émeraude */}
                <section className="py-16 sm:py-20 md:py-24 bg-gradient-to-b from-white via-[#ECFDF5] to-[#D1FAE5]">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                        <div className="text-center mb-12 sm:mb-16">
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#065F46] mb-4 sm:mb-6">
                                Outils et Technologies
                            </h2>
                            <p className="text-lg sm:text-xl text-[#047857] max-w-2xl mx-auto px-4">
                                Stack technologique complète basée sur votre cahier d'analyse IoT
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                            {technologies.map((tech, idx) => (
                                <div
                                    key={idx}
                                    className="group relative bg-white/95 backdrop-blur-sm p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-[#10B981]/30 shadow-lg overflow-hidden transition-all duration-500 hover:shadow-xl sm:hover:shadow-2xl hover:-translate-y-1 sm:hover:-translate-y-2"
                                >
                                    {/* Background gradient on hover */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-[#A7F3D0] group-hover:from-[#10B981]/10 group-hover:to-[#10B981]/20 transition-all duration-500"></div>

                                    <div className="relative z-10">
                                        <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-xl sm:rounded-2xl flex items-center justify-center text-white mb-4 sm:mb-6 group-hover:scale-105 sm:group-hover:scale-110 transition-transform duration-300">
                                            {tech.icon}
                                        </div>

                                        <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-[#065F46] mb-2 sm:mb-3">{tech.title}</h3>
                                        <p className="text-[#047857] text-sm sm:text-base mb-3 sm:mb-4">
                                            {tech.desc}
                                        </p>
                                        <p className="text-[#059669] font-semibold text-xs sm:text-sm">
                                            {tech.details}
                                        </p>

                                        <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-[#10B981]/30">
                                            <div className="flex gap-1 sm:gap-2">
                                                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#10B981] rounded-full"></div>
                                                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#10B981] rounded-full"></div>
                                                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#10B981] rounded-full"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Architecture overview */}
                        <div className="mt-16 sm:mt-20 bg-gradient-to-r from-[#10B981]/15 to-[#059669]/15 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 border border-[#10B981]/30 backdrop-blur-sm">
                            <h3 className="text-xl sm:text-2xl font-bold text-[#065F46] mb-6 text-center">
                                Architecture du Système (Diagramme de Package)
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                                <div className="text-center">
                                    <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-4 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-xl flex items-center justify-center text-white">
                                        <Shield className="w-6 h-6 sm:w-7 sm:h-7" />
                                    </div>
                                    <h4 className="font-bold text-[#065F46] text-lg sm:text-xl mb-2">Authentification</h4>
                                    <p className="text-[#047857] text-sm sm:text-base">
                                        Sécurisation de l'accès à la plateforme
                                    </p>
                                </div>
                                <div className="text-center">
                                    <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-4 bg-gradient-to-br from-[#22C55E] to-[#16A34A] rounded-xl flex items-center justify-center text-white">
                                        <Brain className="w-6 h-6 sm:w-7 sm:h-7" />
                                    </div>
                                    <h4 className="font-bold text-[#065F46] text-lg sm:text-xl mb-2">Système Expert & ML</h4>
                                    <p className="text-[#047857] text-sm sm:text-base">
                                        Prédiction Random Forest et recommandations
                                    </p>
                                </div>
                                <div className="text-center">
                                    <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-4 bg-gradient-to-br from-[#84CC16] to-[#65A30D] rounded-xl flex items-center justify-center text-white">
                                        <Users className="w-6 h-6 sm:w-7 sm:h-7" />
                                    </div>
                                    <h4 className="font-bold text-[#065F46] text-lg sm:text-xl mb-2">Gestion</h4>
                                    <p className="text-[#047857] text-sm sm:text-base">
                                        Utilisateurs, parcelles et capteurs
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-16 sm:py-20 md:py-24 bg-gradient-to-b from-white via-white to-[#F0FDF4]">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 relative">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-12 md:gap-16 items-center">
                            <div>
                                <div className="mb-6 sm:mb-8">
                                    <span className="inline-block px-3 py-1 sm:px-4 sm:py-2 bg-gradient-to-r from-white to-[#F0FDF4] text-[#166534] rounded-full text-xs sm:text-sm font-semibold mb-3 sm:mb-4 border border-[#22C55E]/30 shadow-sm">
                                        Notre Mission
                                    </span>
                                    <h2 className="text-3xl sm:text-4xl font-black text-[#052E16] mb-4 sm:mb-6 leading-tight">
                                        Objectif du Projet
                                    </h2>
                                </div>

                                <div className="space-y-4 sm:space-y-6">
                                    <p className="text-gray-700 leading-relaxed text-base sm:text-lg bg-white/80 p-4 rounded-xl border border-[#22C55E]/20">
                                        Conception d'un système IoT intelligent capable de recommander la culture la plus adaptée à un sol donné, basé sur l'analyse des paramètres du sol et les prévisions météorologiques.
                                    </p>
                                    <p className="text-gray-700 leading-relaxed text-base sm:text-lg bg-white/80 p-4 rounded-xl border border-[#22C55E]/20">
                                        Aider les agriculteurs à prendre de meilleures décisions de sélection des cultures en optimisant la production tout en préservant les ressources naturelles.
                                    </p>
                                </div>

                                <div className="mt-8 sm:mt-10 p-4 sm:p-6 bg-gradient-to-r from-white to-[#F0FDF4] rounded-xl sm:rounded-2xl border border-[#22C55E]/30 shadow-lg">
                                    <div className="flex items-start sm:items-center gap-3 sm:gap-4">
                                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-white to-[#22C55E] flex items-center justify-center flex-shrink-0 border border-[#22C55E]/30">
                                            <Target className="w-5 h-5 sm:w-6 sm:h-6 text-[#166534]" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-[#052E16] text-base sm:text-lg mb-1">Fonctions Clés</h4>
                                            <ul className="text-gray-600 text-xs sm:text-sm space-y-1">
                                                <li className="flex items-start gap-1">
                                                    <span className="text-[#22C55E] mt-0.5">•</span>
                                                    <span>Prédiction de la meilleure culture adaptée (Random Forest)</span>
                                                </li>
                                                <li className="flex items-start gap-1">
                                                    <span className="text-[#22C55E] mt-0.5">•</span>
                                                    <span>Prise en compte des prévisions météorologiques sur 7 jours</span>
                                                </li>
                                                <li className="flex items-start gap-1">
                                                    <span className="text-[#22C55E] mt-0.5">•</span>
                                                    <span>Recommandations d'actions préventives en temps réel</span>
                                                </li>
                                                <li className="flex items-start gap-1">
                                                    <span className="text-[#22C55E] mt-0.5">•</span>
                                                    <span>Communication longue distance via LoRaWAN</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="relative">
                                <div className="bg-white rounded-2xl sm:rounded-3xl md:rounded-[40px] shadow-xl sm:shadow-2xl border border-[#22C55E]/30 p-6 sm:p-8 md:p-10 transition-all duration-500 hover:shadow-2xl sm:hover:shadow-3xl">
                                    <div className="space-y-6 sm:space-y-8">
                                        <div className="flex items-start gap-4 sm:gap-6">
                                            <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-gradient-to-br from-white to-[#22C55E] rounded-xl sm:rounded-2xl flex items-center justify-center text-[#166534] flex-shrink-0 border border-[#22C55E]/30">
                                                <Brain className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-[#052E16] text-base sm:text-lg md:text-xl">
                                                    Modèle Random Forest
                                                </h4>
                                                <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
                                                    Haute précision pour la prédiction des cultures optimales
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-4 sm:gap-6">
                                            <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-gradient-to-br from-white to-[#22C55E] rounded-xl sm:rounded-2xl flex items-center justify-center text-[#166534] flex-shrink-0 border border-[#22C55E]/30">
                                                <WifiIcon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-[#052E16] text-base sm:text-lg md:text-xl">
                                                    Connectivité LoRaWAN
                                                </h4>
                                                <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
                                                    Portée étendue pour zones rurales, faible consommation
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-4 sm:gap-6">
                                            <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-gradient-to-br from-white to-[#16A34A] rounded-xl sm:rounded-2xl flex items-center justify-center text-[#166534] flex-shrink-0 border border-[#16A34A]/30">
                                                <FileText className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-[#052E16] text-base sm:text-lg md:text-xl">
                                                    Dashboard Complet
                                                </h4>
                                                <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
                                                    Gestion des utilisateurs, parcelles, capteurs et recommandations
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Decorative elements */}
                                <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-white to-[#22C55E]/30 rounded-2xl -z-10 blur-xl opacity-40"></div>
                                <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-gradient-to-br from-white to-[#16A34A]/30 rounded-2xl -z-10 blur-xl opacity-40"></div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION 7: CTA - Vert foncé avec blanc */}
                <section ref={ctaRef} className="py-16 sm:py-20 md:py-24 relative overflow-hidden bg-gradient-to-br from-[#052E16] via-[#14532D] to-[#166534]">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2832')] opacity-10 bg-cover bg-center"></div>

                    {/* Animated circles */}
                    <div className="absolute top-0 left-0 w-48 h-48 sm:w-60 sm:h-60 md:w-72 md:h-72 bg-[#22C55E] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                    <div className="absolute top-0 right-0 w-48 h-48 sm:w-60 sm:h-60 md:w-72 md:h-72 bg-[#16A34A] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                    <div className="absolute -bottom-6 left-1/2 w-48 h-48 sm:w-60 sm:h-60 md:w-72 md:h-72 bg-[#15803D] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

                    <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 md:px-8 text-center">
                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-8 sm:p-10 md:p-12 border border-white/20">
                            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4 sm:mb-6 leading-tight">
                                Prêt à révolutionner votre agriculture ?
                            </h2>

                            <p className="text-lg sm:text-xl text-white/80 mb-6 sm:mb-8 md:mb-10 max-w-2xl mx-auto">
                                Découvrez comment notre système IoT intelligent peut optimiser vos cultures
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-6 sm:mb-8 md:mb-10">
                                <Link
                                    href="/register"
                                    className="group bg-white hover:bg-gray-50 text-[#052E16] px-6 sm:px-8 md:px-10 py-3 sm:py-4 rounded-xl sm:rounded-2xl text-base sm:text-lg font-bold transition-all duration-300 shadow-xl sm:shadow-2xl hover:shadow-[0_20px_60px_-15px_rgba(255,255,255,0.5)] hover:-translate-y-1 active:scale-95 flex items-center gap-2 sm:gap-3 min-w-[180px] sm:min-w-[200px] justify-center"
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