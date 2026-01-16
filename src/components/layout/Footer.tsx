import Link from 'next/link';
import { useTranslation } from '@/providers/TranslationProvider';
import { 
  Leaf, 
  Map, 
  RadioTower, 
  Grid3x3, 
  Brain, 
  Sprout,
  HelpCircle,
  FileText,
  MessageSquare,
  Activity,
  Mail,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Shield,
  FileCheck,
  Scale
} from 'lucide-react';

export default function DashboardFooter() {
  const { t } = useTranslation();
  
  const navLinks = [
    { href: "/dashboard/farmer/terrains", label: t('footer.my_terrains'), icon: Map },
    { href: "/dashboard/parcelles", label: t('footer.my_parcels'), icon: Grid3x3 },
    { href: "/dashboard/predictions", label: t('footer.ai_prediction'), icon: Brain },
    { href: "/dashboard/farmer/parcelles", label: t('footer.recommendation'), icon: Sprout }
  ];

  const supportLinks = [
    { href: "#", label: t('footer.help_center'), icon: HelpCircle },
    { href: "#", label: t('footer.documentation'), icon: FileText },
    { href: "#", label: t('footer.contact_agronomist'), icon: MessageSquare },
    { href: "#", label: t('footer.service_status'), icon: Activity },
  ];

  const legalLinks = [
    { href: "#", label: t('footer.terms'), icon: FileCheck },
    { href: "#", label: t('footer.privacy'), icon: Shield },
    { href: "#", label: t('footer.legal'), icon: Scale },
  ];

  const socialLinks = [
    { href: "#", icon: Facebook, label: "Facebook" },
    { href: "#", icon: Twitter, label: "Twitter" },
    { href: "#", icon: Instagram, label: "Instagram" },
    { href: "#", icon: Linkedin, label: "LinkedIn" },
  ];

  return (
    <footer className="bg-gradient-to-b from-[#1B831B] to-[#146314] text-white pt-8 pb-6 px-4 sm:px-6 mt-auto w-full">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-8 sm:mb-10">
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-lg">
                <Leaf className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg sm:text-xl">Smart Agro</h3>
                <p className="text-xs text-green-100/80">Precision Farming Solutions</p>
              </div>
            </div>
            <p className="text-sm text-green-100/80 leading-relaxed">
              {t('footer.desc')}
            </p>
            
            {/* Social Links */}
            <div className="flex gap-2 sm:gap-3 pt-2">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <Link
                    key={index}
                    href={social.href}
                    className="p-1.5 sm:p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors group"
                    aria-label={social.label}
                  >
                    <Icon className="w-3 h-3 sm:w-4 sm:h-4 text-white group-hover:scale-110 transition-transform" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Navigation Column */}
          <div>
            <h4 className="font-bold mb-3 sm:mb-4 text-base sm:text-lg text-white underline decoration-white-4">
              {t('footer.nav_title')}
            </h4>
            <ul className="space-y-2 sm:space-y-3">
              {navLinks.map((link, index) => {
                const Icon = link.icon;
                return (
                  <li key={index}>
                    <Link 
                      href={link.href} 
                      className="flex items-center gap-2 sm:gap-3 text-green-100/80 hover:text-white transition-colors group text-sm"
                    >
                      <Icon className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
                      <span className="text-xs sm:text-sm">{link.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <h4 className="font-bold mb-3 sm:mb-4 text-base sm:text-lg text-white underline decoration-white-4">
              {t('footer.support_title')}
            </h4>
            <ul className="space-y-2 sm:space-y-3">
              {supportLinks.map((link, index) => {
                const Icon = link.icon;
                return (
                  <li key={index}>
                    <Link 
                      href={link.href} 
                      className="flex items-center gap-2 sm:gap-3 text-green-100/80 hover:text-white transition-colors group text-sm"
                    >
                      <Icon className="w-3 h-3 sm:w-4 sm:h-4 group-hover:scale-110 transition-transform" />
                      <span className="text-xs sm:text-sm">{link.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="space-y-3 sm:space-y-4">
            <div>
              <h4 className="font-bold mb-2 sm:mb-3 text-base sm:text-lg text-white flex items-center gap-2">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                {t('footer.stay_informed')}
              </h4>
              <p className="text-sm text-green-100/80 mb-3 sm:mb-4 leading-relaxed">
                {t('footer.newsletter_desc')}
              </p>
            </div>

            <form className="space-y-2 sm:space-y-3">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                <input
                  type="email"
                  placeholder={t('footer.email_placeholder')}
                  className="w-full bg-white text-gray-800 px-8 sm:px-10 py-2 sm:py-3 rounded-lg outline-none text-xs sm:text-sm placeholder:text-gray-400 border border-green-200 focus:border-[#22C55E] transition-colors"
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-gradient-to-r from-[#22C55E] to-emerald-500 hover:from-[#1B831B] hover:to-[#22C55E] text-white py-2 sm:py-3 rounded-lg text-xs sm:text-sm font-bold transition-all shadow-lg hover:shadow-xl active:scale-[0.98] flex items-center justify-center gap-1 sm:gap-2"
              >
                <Mail className="w-3 h-3 sm:w-4 sm:h-4" />
                {t('footer.subscribe')}
              </button>
            </form>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 pt-4 sm:pt-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
            {/* Copyright */}
            <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm text-green-100/70">
              <span>© {new Date().getFullYear()} Smart Agro</span>
              <span className="hidden sm:inline">•</span>
              <span>{t('footer.rights')}</span>
            </div>

            {/* Legal Links */}
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              {legalLinks.map((link, index) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={index}
                    href={link.href}
                    className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-green-100/70 hover:text-white transition-colors group"
                  >
                    <Icon className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}