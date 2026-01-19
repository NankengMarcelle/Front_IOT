import Link from 'next/link';
import { useTranslation } from '@/providers/TranslationProvider';
import {
    Leaf,
    Zap,
    Layout,
    Map,
    Grid3x3,
    Brain,
    ShieldCheck,
    MessageSquare,
    Globe
} from 'lucide-react';

export default function DashboardFooter() {
    const { t } = useTranslation();

    const navLinks = [
        { name: t('nav.dashboard'), href: '/dashboard/farmer', icon: Layout },
        { name: t('nav.terrains'), href: '/dashboard/terrains', icon: Map },
        { name: t('nav.parcelles'), href: '/dashboard/parcelles', icon: Grid3x3 },
        { name: "IA Chat", href: '/dashboard/recommandations', icon: Brain },
    ];

    const legalLinks = [
        { name: "Politique de Confidentialité", href: "#" },
        { name: "Conditions d'Utilisation", href: "#" },
        { name: "Support Technique", href: "#" },
    ];

    return (
        <footer className="relative pb-8 md:pb-12 px-4 md:px-6">
            <div className="max-w-7xl mx-auto">
                <div className="bg-[#052E16] rounded-[32px] md:rounded-[48px] p-8 md:p-12 lg:p-16 shadow-2xl shadow-emerald-950/20 border border-white/5 relative overflow-hidden">
                    {/* Subtle Glows */}
                    <div className="absolute top-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-emerald-500/10 rounded-full blur-[80px] md:blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-48 md:w-64 h-48 md:h-64 bg-lime-500/5 rounded-full blur-[60px] md:blur-[80px] translate-y-1/2 -translate-x-1/2"></div>

                    <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12 lg:gap-8">

                        {/* Column 1: Brand */}
                        <div className="space-y-4 md:space-y-6">
                            <div className="flex items-center gap-3 md:gap-4">
                                <div className="w-12 h-12 md:w-14 md:h-14 bg-white/10 backdrop-blur-xl rounded-xl md:rounded-2xl flex items-center justify-center text-white border border-white/10 shadow-xl">
                                    <Leaf className="w-6 h-6 md:w-7 md:h-7 text-lime-400" />
                                </div>
                                <div>
                                    <h3 className="text-xl md:text-2xl font-black tracking-tighter text-white">SmartAgro</h3>
                                    <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-emerald-400/40 italic">Elite Systems</p>
                                </div>
                            </div>
                            <p className="text-emerald-50/40 text-[11px] md:text-xs font-medium leading-relaxed max-w-[240px]">
                                Intelligence artificielle et IoT connectés pour une agriculture durable et haute performance.
                            </p>
                            <div className="pt-2 md:pt-4">
                                <p className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-[#84CC16]/40">© 2026 SmartAgro International</p>
                            </div>
                        </div>

                        {/* Column 2: Navigation */}
                        <div className="space-y-4 md:space-y-6">
                            <h4 className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400/30">Navigation Rapide</h4>
                            <nav className="flex flex-col gap-3 md:gap-4">
                                {navLinks.map((link, idx) => (
                                    <Link key={idx} href={link.href} className="flex items-center gap-3 text-[11px] md:text-xs font-bold text-emerald-50/60 hover:text-lime-400 transition-all group">
                                        <link.icon className="w-3.5 h-3.5 md:w-4 md:h-4 text-emerald-500 group-hover:scale-110 group-hover:text-lime-400 transition-all" />
                                        {link.name}
                                    </Link>
                                ))}
                            </nav>
                        </div>

                        {/* Column 3: Legal & Support */}
                        <div className="space-y-4 md:space-y-6">
                            <h4 className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400/30">Ressources</h4>
                            <nav className="flex flex-col gap-3 md:gap-4">
                                {legalLinks.map((link, idx) => (
                                    <Link key={idx} href={link.href} className="text-[11px] md:text-xs font-bold text-emerald-50/40 hover:text-white transition-all">
                                        {link.name}
                                    </Link>
                                ))}
                            </nav>
                            <div className="pt-2 md:pt-4 flex items-center gap-3 text-emerald-400/20">
                                <Globe size={14} className="md:w-4 md:h-4" />
                                <span className="text-[9px] md:text-[10px] font-black uppercase tracking-tighter">Global Service 24/7</span>
                            </div>
                        </div>

                        {/* Column 4: Elite Status Card */}
                        <div className="sm:col-span-2 lg:col-span-1 lg:pl-4">
                            <div className="bg-white/5 backdrop-blur-xl rounded-[24px] md:rounded-[32px] p-6 md:p-8 border border-white/10 space-y-3 md:space-y-4">
                                <div className="flex items-center gap-2 md:gap-3">
                                    <ShieldCheck className="text-lime-400 w-4 h-4 md:w-5 md:h-5" />
                                    <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-white">Noeud Sécurisé</span>
                                </div>
                                <p className="text-[10px] md:text-[10px] font-medium text-emerald-50/40 leading-relaxed">
                                    Votre connexion est cryptée par le protocole SmartAgro Secure v2.
                                </p>
                                <div className="flex items-center gap-2 pt-1 md:pt-2">
                                    <div className="w-1 h-1 md:w-1.5 md:h-1.5 bg-lime-500 rounded-full animate-pulse"></div>
                                    <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-lime-400/60">Système Opérationnel</span>
                                </div>
                            </div>

                            <div className="mt-6 md:mt-8 flex justify-end">
                                <p className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] text-emerald-400/20 flex items-center gap-2">
                                    <Zap className="w-2.5 h-2.5 md:w-3 md:h-3 text-lime-500" /> SmartAgro Dev-Elite
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </footer>
    );
}
