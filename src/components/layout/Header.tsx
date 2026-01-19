import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  Settings
} from 'lucide-react';
import { useState, useEffect } from 'react';

export default function DashboardHeader() {
  const { t } = useTranslation();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserInfo = () => {
      try {
        setLoading(true);
        const savedUser = localStorage.getItem('smartagro_user');
        if (savedUser && savedUser !== "undefined") {
          try {
            setUserInfo(JSON.parse(savedUser));
          } catch (e) {
            console.error("Invalid user data in localStorage");
            router.push('/login');
          }
        } else {
          // Fallback or redirect if no user info
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
    { href: "/dashboard/parcelles", label: t('nav.parcelles'), icon: Grid3x3 }
  ];

  const getInitial = () => {
    if (!userInfo) return "F";
    return (userInfo.nom?.charAt(0) || userInfo.prenom?.charAt(0) || "F").toUpperCase();
  };

  const getFullName = () => {
    if (!userInfo) return "Farmer Profile";
    return `${userInfo.prenom || ''} ${userInfo.nom || ''}`.trim() || "Farmer Profile";
  };

  return (
    <header className="w-full bg-white border-b border-green-100 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between shadow-sm sticky top-0 z-50">
      {/* Logo */}
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="relative w-8 h-8 sm:w-10 sm:h-10">
          <Leaf className="w-6 h-6 sm:w-8 sm:h-8 text-[#1B831B]" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-[#1B831B] text-lg sm:text-xl">Smart Agro</span>
          <span className="text-xs text-gray-500 -mt-1 hidden sm:block">Agricultural Intelligence</span>
        </div>
      </div>

      {/* Navigation Desktop */}
      <nav className="hidden lg:flex items-center gap-1">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <Link
              key={index}
              href={item.href}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg hover:bg-green-50 text-gray-700 hover:text-[#1B831B] transition-all duration-200 group"
            >
              <Icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Right Section */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Profile Dropdown */}
        <div className="relative group">
          <button className="flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg hover:bg-green-50 transition-colors">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base">
              {loading ? "..." : getInitial()}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-semibold text-gray-800">
                {loading ? "Chargement..." : getFullName()}
              </p>
              <p className="text-xs text-gray-500">
                {loading ? "" : userInfo?.role ? `${userInfo.role}` : "Member"}
              </p>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400 hidden md:block" />
          </button>

          {/* Dropdown Menu */}
          <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200 z-50">
            <Link
              href="/dashboard/profil"
              className="flex items-center gap-3 px-4 py-3 hover:bg-green-50 text-gray-700 transition-colors"
            >
              <User className="w-4 h-4" />
              <span className="text-sm">{t('nav.profile')}</span>
            </Link>
            {/* Nouveau lien pour les paramètres */}
            <Link
              href="/dashboard/parametres"
              className="flex items-center gap-3 px-4 py-3 hover:bg-green-50 text-gray-700 transition-colors"
            >
              <Settings className="w-4 h-4" />
              <span className="text-sm">Paramètres</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 hover:bg-red-50 text-red-600 w-full transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm">{t('nav.logout')}</span>
            </button>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="lg:hidden p-1.5 sm:p-2 rounded-lg hover:bg-green-50 transition-colors"
        >
          <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border-b border-green-100 shadow-lg lg:hidden z-40">
          <div className="px-4 sm:px-6 py-3">
            <div className="space-y-1">
              {navItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={index}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg hover:bg-green-50 text-gray-700 hover:text-[#1B831B] transition-colors text-sm sm:text-base"
                  >
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
              {/* Ajout des liens du menu déroulant dans le menu mobile */}
              <div className="border-t border-gray-100 pt-2 mt-2">
                <Link
                  href="/dashboard/profil"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg hover:bg-green-50 text-gray-700 transition-colors text-sm sm:text-base"
                >
                  <User className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="font-medium">{t('nav.profile')}</span>
                </Link>
                <Link
                  href="/dashboard/parametres"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg hover:bg-green-50 text-gray-700 transition-colors text-sm sm:text-base"
                >
                  <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="font-medium">Paramètres</span>
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg hover:bg-red-50 text-red-600 w-full transition-colors text-sm sm:text-base text-left"
                >
                  <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="font-medium">{t('nav.logout')}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}