"use client";

import Link from 'next/link';
import { Leaf, ShieldCheck, Zap, Globe } from 'lucide-react';

export default function SimpleFooter() {
    const legalLinks = [
        { name: "Politique de Confidentialité", href: "#" },
        { name: "Conditions d'Utilisation", href: "#" },
        { name: "Support Technique", href: "#" },
    ];

    return (
        <footer className="relative bg-[#052E16] w-full overflow-hidden">
            {/* Subtle Glows */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-lime-500/5 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2"></div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 md:py-20">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-16 mb-12">

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
                        <p className="text-emerald-50/40 text-xs font-medium leading-relaxed max-w-[280px]">
                            Intelligence artificielle et IoT connectés pour une agriculture durable et haute performance.
                        </p>
                    </div>

                    {/* Column 2: Legal & Support */}
                    <div className="space-y-6">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400/30">Ressources</h4>
                        <nav className="flex flex-col gap-4">
                            {legalLinks.map((link, idx) => (
                                <Link key={idx} href={link.href} className="text-xs font-bold text-emerald-50/40 hover:text-white transition-all">
                                    {link.name}
                                </Link>
                            ))}
                        </nav>
                        <div className="pt-4 flex items-center gap-3 text-emerald-400/20">
                            <Globe size={16} />
                            <span className="text-[10px] font-black uppercase tracking-tighter">Global Service 24/7</span>
                        </div>
                    </div>

                    {/* Column 3: Elite Status Card */}
                    <div className="sm:col-span-2 lg:col-span-1">
                        <div className="bg-white/5 backdrop-blur-xl rounded-[32px] p-8 border border-white/10 space-y-4">
                            <div className="flex items-center gap-3">
                                <ShieldCheck className="text-lime-400 w-5 h-5" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-white">Noeud Sécurisé</span>
                            </div>
                            <p className="text-[10px] font-medium text-emerald-50/40 leading-relaxed">
                                Votre connexion est cryptée par le protocole SmartAgro Secure v2.
                            </p>
                            <div className="flex items-center gap-2 pt-2">
                                <div className="w-1.5 h-1.5 bg-lime-500 rounded-full animate-pulse"></div>
                                <span className="text-[9px] font-black uppercase tracking-widest text-lime-400/60">Système Opérationnel</span>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-[9px] font-black uppercase tracking-widest text-[#84CC16]/40">
                        © 2026 SmartAgro International
                    </p>
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-400/20 flex items-center gap-2">
                        <Zap className="w-3 h-3 text-lime-500" /> SmartAgro Dev-Elite
                    </p>
                </div>
            </div>
        </footer>
    );
}
