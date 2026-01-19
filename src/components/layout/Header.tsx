import Image from 'next/image';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useTranslation } from '@/providers/TranslationProvider';
import {
  User,
  LogOut,
  Home,
  Map,
  Grid3x3,
  RadioTower,
  Leaf,
  Menu,
  ChevronDown,
  Settings,
  Sparkles,
  Zap
} from 'lucide-react';
import { useState, useEffect } from 'react';

export default function DashboardHeader() {
  const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('smartagro_user');
      if (savedUser && savedUser !== "undefined") {
        try {
          return JSON.parse(savedUser);
        } catch (e) {
          return null;
        }
      }
    }
    return null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserInfo = () => {
      try {
        setLoading(true);
        const savedUser = localStorage.getItem('smartagro_user');
        if (savedUser && savedUser !== "undefined") {
          try {
            const parsed = JSON.parse(savedUser);
            setUserInfo(parsed);
          } catch (e) {
            router.push('/login');
          }
        } else {
          router.push('/login');
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserInfo();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('smartagro_token');
    localStorage.removeItem('smartagro_user');
    router.push('/login');
  };

  const navItems = [
    { href: "/dashboard/farmer", label: t('nav.dashboard'), icon: Home },
    { href: "/dashboard/terrains", label: t('nav.terrains'), icon: Map },
    { href: "/dashboard/parcelles", label: t('nav.parcelles'), icon: Grid3x3 },
    { href: "/dashboard/historiqueprediction", label: "Historique", icon: RadioTower },
    { href: "/dashboard/recommandations", label: "IA Chat", icon: Sparkles },
  ];

  const getInitial = () => {
    if (!userInfo) return "F";
    const name = userInfo.name || userInfo.nom || userInfo.prenom || "";
    return (name.charAt(0) || "F").toUpperCase();
  };

  const getFullName = () => {
    if (!userInfo) return "Chargement...";
    if (userInfo.name) return userInfo.name;
    const fullName = `${userInfo.prenom || ''} ${userInfo.nom || ''}`.trim();
    return fullName || "Expert Agro";
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] px-4 md:px-6 py-4 pointer-events-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between bg-white/70 backdrop-blur-3xl border border-white/50 rounded-[24px] md:rounded-[32px] px-4 md:px-8 py-2 md:py-3 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] pointer-events-auto transition-all duration-500">

        {/* Brand */}
        <Link href="/dashboard/farmer" className="flex items-center gap-2 md:gap-3 group">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-[#052E16] rounded-xl md:rounded-2xl flex items-center justify-center text-white shadow-xl shadow-emerald-900/40 group-hover:rotate-12 transition-transform">
            <Leaf className="w-5 h-5 md:w-7 md:h-7 text-lime-400" />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-[#052E16] text-lg md:text-xl tracking-tighter leading-none">SmartAgro</span>
            <span className="hidden xs:block text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] text-[#052E16]/30">Elite Intelligence</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={index}
                href={item.href}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all duration-300 font-black text-[10px] uppercase tracking-widest ${isActive
                  ? "bg-[#052E16] text-white shadow-lg shadow-emerald-900/10"
                  : "text-[#052E16]/40 hover:text-[#052E16] hover:bg-emerald-50"
                  }`}
              >
                <Icon className={`w-3 h-3 ${isActive ? 'text-lime-400' : ''}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Action Belt */}
        <div className="flex items-center gap-2 md:gap-4">

          <div className="w-px h-6 md:h-8 bg-emerald-100/50 hidden md:block"></div>

          {/* Profile Hub */}
          <div className="relative group/profile">
            <button className="flex items-center gap-2 md:gap-3 p-1 md:p-1.5 bg-slate-50/50 rounded-xl md:rounded-2xl hover:bg-white transition-all border border-transparent hover:border-emerald-100">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-[#052E16] rounded-lg md:rounded-xl flex items-center justify-center text-white font-black text-[10px] md:text-xs shadow-lg">
                {getInitial()}
              </div>
              <div className="hidden lg:block text-left pr-2">
                <p className="text-[10px] font-black text-[#052E16] uppercase tracking-widest">
                  {getFullName()}
                </p>
              </div>
              <ChevronDown className="w-3 h-3 md:w-4 md:h-4 text-[#052E16]/20 transition-transform group-hover/profile:rotate-180" />
            </button>

            {/* Elite Dropdown */}
            <div className="absolute right-0 top-[calc(100%+12px)] w-60 md:w-64 bg-white rounded-[24px] md:rounded-[32px] shadow-2xl shadow-emerald-900/10 border border-emerald-50 p-2 md:p-3 invisible opacity-0 translate-y-4 group-hover/profile:visible group-hover/profile:opacity-100 group-hover/profile:translate-y-0 transition-all duration-500 z-[101]">
              <Link
                href="/dashboard/profil"
                className="flex items-center gap-3 md:gap-4 p-3 md:p-4 hover:bg-emerald-50 rounded-[16px] md:rounded-[20px] transition-all group/item"
              >
                <div className="w-8 h-8 md:w-10 md:h-10 bg-emerald-50 rounded-lg md:rounded-xl flex items-center justify-center text-emerald-600 group-hover/item:bg-[#052E16] group-hover/item:text-white transition-all">
                  <User size={16} />
                </div>
                <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-[#052E16]">{t('nav.profile')}</span>
              </Link>
              <Link
                href="/dashboard/parametres"
                className="flex items-center gap-3 md:gap-4 p-3 md:p-4 hover:bg-emerald-50 rounded-[16px] md:rounded-[20px] transition-all group/item"
              >
                <div className="w-8 h-8 md:w-10 md:h-10 bg-emerald-50 rounded-lg md:rounded-xl flex items-center justify-center text-emerald-600 group-hover/item:bg-[#052E16] group-hover/item:text-white transition-all">
                  <Settings size={16} />
                </div>
                <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-[#052E16]">Paramètres</span>
              </Link>
              <div className="h-px bg-emerald-50 my-1 md:my-2 mx-4"></div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 md:gap-4 p-3 md:p-4 hover:bg-rose-50 rounded-[16px] md:rounded-[20px] transition-all group/logout"
              >
                <div className="w-8 h-8 md:w-10 md:h-10 bg-rose-50 rounded-lg md:rounded-xl flex items-center justify-center text-rose-500 group-hover/logout:bg-rose-500 group-hover/logout:text-white transition-all">
                  <LogOut size={16} />
                </div>
                <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-rose-600">Déconnexion</span>
              </button>
            </div>
          </div>

          {/* Burger */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-white border border-emerald-50 rounded-xl md:rounded-2xl text-[#052E16] hover:bg-emerald-50 transition-colors"
          >
            <Menu className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>
      </div>

      {/* Mobile Menu - Elite Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 top-[80px] md:top-[100px] z-[99] p-4 md:p-6 lg:hidden animate-fadeIn">
          <div className="absolute inset-x-4 md:inset-x-6 top-0 bg-white rounded-[32px] md:rounded-[48px] shadow-2xl border border-emerald-50 p-6 md:p-10 flex flex-col gap-4 md:gap-6 animate-slideDown">
            {navItems.map((item, id) => (
              <Link
                key={id}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-4 md:gap-6 p-4 md:p-6 bg-emerald-50/50 rounded-[24px] md:rounded-[32px] hover:bg-emerald-100 transition-all group"
              >
                <div className="w-12 h-12 md:w-14 md:h-14 bg-white rounded-xl md:rounded-2xl flex items-center justify-center text-[#052E16] shadow-sm group-hover:bg-[#052E16] group-hover:text-white transition-all">
                  <item.icon size={20} />
                </div>
                <span className="text-lg md:text-xl font-black tracking-tighter text-[#052E16]">{item.label}</span>
              </Link>
            ))}
          </div>
          {/* Backdrop Click-off */}
          <div className="fixed inset-0 -z-10 bg-black/5" onClick={() => setIsMenuOpen(false)}></div>
        </div>
      )}
    </header>
  );
}