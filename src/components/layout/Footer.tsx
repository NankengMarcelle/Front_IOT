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
        { name: t('nav.ia_chat'), href: '/dashboard/recommandations', icon: Brain },
    ];

    const legalLinks = [
        { name: t('footer.privacy'), href: "#" },
        { name: t('footer.terms'), href: "#" },
        { name: t('footer.tech_support'), href: "#" },
    ];

    return (
        <footer className="relative bg-[#052E16] w-full overflow-hidden">
            {/* Subtle Glows */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-lime-500/5 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2"></div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 md:py-20">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-16 mb-12">

                    {/* Column 1: Brand */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center text-white border border-white/10 shadow-xl">
                                <Leaf className="w-7 h-7 text-lime-400" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black tracking-tighter text-white">SmartAgro</h3>
                                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400/40 italic">Elite Systems</p>
                            </div>
                        </div>
                        <p className="text-emerald-50/40 text-xs font-medium leading-relaxed max-w-[240px]">
                            {t('footer.desc')}
                        </p>
                    </div>

                    {/* Column 2: Navigation */}
                    <div className="space-y-6">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400/30">{t('footer.nav_title')}</h4>
                        <nav className="flex flex-col gap-4">
                            {navLinks.map((link, idx) => (
                                <Link key={idx} href={link.href} className="flex items-center gap-3 text-xs font-bold text-emerald-50/60 hover:text-lime-400 transition-all group">
                                    <link.icon className="w-4 h-4 text-emerald-500 group-hover:scale-110 group-hover:text-lime-400 transition-all" />
                                    {link.name}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* Column 3: Legal & Support */}
                    <div className="space-y-6">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400/30">{t('footer.resources')}</h4>
                        <nav className="flex flex-col gap-4">
                            {legalLinks.map((link, idx) => (
                                <Link key={idx} href={link.href} className="text-xs font-bold text-emerald-50/40 hover:text-white transition-all">
                                    {link.name}
                                </Link>
                            ))}
                        </nav>
                        <div className="pt-4 flex items-center gap-3 text-emerald-400/20">
                            <Globe size={16} />
                            <span className="text-[10px] font-black uppercase tracking-tighter">{t('footer.global_service')}</span>
                        </div>
                    </div>

                    {/* Column 4: Elite Status Card */}
                    <div>
                        <div className="bg-white/5 backdrop-blur-xl rounded-[32px] p-8 border border-white/10 space-y-4">
                            <div className="flex items-center gap-3">
                                <ShieldCheck className="text-lime-400 w-5 h-5" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-white">{t('footer.secure_node')}</span>
                            </div>
                            <p className="text-[10px] font-medium text-emerald-50/40 leading-relaxed">
                                {t('footer.secure_desc')}
                            </p>
                            <div className="flex items-center gap-2 pt-2">
                                <div className="w-1.5 h-1.5 bg-lime-500 rounded-full animate-pulse"></div>
                                <span className="text-[9px] font-black uppercase tracking-widest text-lime-400/60">{t('footer.system_status')}</span>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-[9px] font-black uppercase tracking-widest text-[#84CC16]/40">
                        {t('footer.rights')}
                    </p>
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-400/20 flex items-center gap-2">
                        <Zap className="w-3 h-3 text-lime-500" /> SmartAgro Dev-Elite
                    </p>
                </div>
            </div>
        </footer>
    );
}
