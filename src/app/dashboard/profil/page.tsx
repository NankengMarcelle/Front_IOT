"use client";

import { useState, useEffect } from "react";
import {
  Eye,
  EyeOff,
  Camera,
  CheckCircle2,
  User,
  Mail,
  Phone,
  Lock,
  Globe,
  Save,
  X,
  Check,
  Shield,
  Bell,
  Calendar,
  Zap,
  Loader2
} from "lucide-react";
import { useLanguageStore } from '@/store/useUserStore';
import { useTranslation } from '@/providers/TranslationProvider';
import Link from "next/link";

type UserRole = "ADMIN" | "FARMER" | "AGENT" | "MANAGER" | string;

interface UserProfile {
  id: string;
  email: string;
  nom: string;
  prenom: string;
  role: UserRole | undefined;
  phone: string;
  address: string;
  joinDate: string;
  langue: "fr" | "en";
  password: string;
  confirmPassword: string;
  notifications: {
    email: boolean;
    sms: boolean;
    weeklyReport: boolean;
  };
}

export default function ProfilPage() {
  const { lang, setLang } = useLanguageStore();
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const [userData, setUserData] = useState<UserProfile>({
    id: "mock-id-123",
    email: "user@example.com",
    nom: "Dupont",
    prenom: "Jean",
    role: "AGRICULTEUR",
    phone: "+237 600 00 00 00",
    address: "Yaoundé, Cameroun",
    joinDate: "12 janvier 2024",
    langue: lang,
    password: "",
    confirmPassword: "",
    notifications: {
      email: true,
      sms: false,
      weeklyReport: true
    }
  });

  const [formErrors, setFormErrors] = useState({
    nom: "",
    prenom: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });

  useEffect(() => {
    const savedUser = localStorage.getItem('smartagro_user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        const nameParts = user.name ? user.name.split(' ') : [];
        setUserData(prev => ({
          ...prev,
          id: user.id || prev.id,
          email: user.email || prev.email,
          nom: nameParts.length > 1 ? nameParts.slice(1).join(' ') : (user.nom || prev.nom),
          prenom: nameParts.length > 0 ? nameParts[0] : (user.prenom || prev.prenom),
          role: user.role || prev.role,
        }));
      } catch (e) {
        console.error("Failed to parse saved user", e);
      }
    }
  }, []);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const errors = { nom: "", prenom: "", phone: "", password: "", confirmPassword: "" };
    let isValid = true;
    if (!userData.nom.trim()) { errors.nom = "Le nom est requis"; isValid = false; }
    if (!userData.prenom.trim()) { errors.prenom = "Le prénom est requis"; isValid = false; }
    if (userData.phone && !/^[+]?[\d\s-]{10,}$/.test(userData.phone)) { errors.phone = "Format invalide"; isValid = false; }
    if (userData.password) {
      if (userData.password.length < 8) { errors.password = "8+ caractères requis"; isValid = false; }
      if (userData.password !== userData.confirmPassword) { errors.confirmPassword = "Les mots de passe ne correspondent pas"; isValid = false; }
    }
    setFormErrors(errors);
    return isValid;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);

    // Simuler un appel API
    setTimeout(() => {
      setIsEditing(false);
      setShowSuccess(true);
      setLoading(false);

      // Réinitialiser les mots de passe après sauvegarde
      setUserData(prev => ({ ...prev, password: "", confirmPassword: "" }));

      // Mettre à jour le stockage local
      const updatedUser = {
        id: userData.id,
        email: userData.email,
        name: `${userData.prenom} ${userData.nom}`,
        role: userData.role,
        isActive: true
      };
      localStorage.setItem('smartagro_user', JSON.stringify(updatedUser));

      setTimeout(() => setShowSuccess(false), 3000);
    }, 1000);
  };

  const ProfileField = ({ label, value, icon: Icon, type = "text", error = "", ...props }: any) => (
    <div className="space-y-3">
      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#052E16]/30 px-2 flex items-center gap-2">
        <Icon className="w-3 h-3" />
        {label}
      </label>
      <input
        type={type}
        value={value}
        className={`w-full px-8 py-5 rounded-[24px] border ${error ? 'border-rose-300 bg-rose-50 text-rose-900' : 'border-emerald-50 bg-white/50 text-[#052E16]'} 
          focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-bold tracking-tight
          ${!isEditing && 'bg-emerald-50/20 text-[#052E16]/40 cursor-not-allowed'}`}
        {...props}
      />
      {error && <p className="text-[9px] font-black uppercase tracking-widest text-rose-500 px-2">{error}</p>}
    </div>
  );

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-emerald-50/50 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 opacity-60"></div>
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-lime-50/50 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 opacity-60"></div>
      </div>

      <main className="relative z-10 pt-8 md:pt-12 pb-16 md:pb-24">
        <div className="px-4 md:px-12 max-w-7xl mx-auto w-full">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8 mb-10 md:mb-16">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-50 rounded-xl md:rounded-2xl flex items-center justify-center text-emerald-600">
                  <User className="w-6 h-6 md:w-7 h-7" />
                </div>
                <p className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-[#052E16]/40">Configuration</p>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#052E16] tracking-tighter leading-[0.9]">
                Votre <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-lime-500">Identité.</span>
              </h1>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
            {/* Sidebar Stats */}
            <div className="lg:col-span-4 space-y-6 md:space-y-8">
              <div className="bg-white/60 backdrop-blur-3xl rounded-[32px] md:rounded-[48px] p-8 md:p-10 border border-white shadow-2xl shadow-emerald-900/5 text-center">
                <div className="relative mb-6 md:mb-8 inline-block">
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-[32px] md:rounded-[40px] bg-[#052E16] flex items-center justify-center text-3xl md:text-4xl font-black text-white shadow-2xl relative overflow-hidden group">
                    {avatarPreview ? (
                      <img src={avatarPreview} className="w-full h-full object-cover" />
                    ) : (
                      (userData.prenom?.charAt(0) || "U").toUpperCase()
                    )}
                    {isEditing && (
                      <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                        <Camera className="w-7 h-7 md:w-8 md:h-8 text-white" />
                        <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                      </label>
                    )}
                  </div>
                </div>

                <h2 className="text-2xl md:text-3xl font-black text-[#052E16] tracking-tighter mb-1">{userData.prenom} {userData.nom}</h2>
                <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-emerald-600 mb-6 md:mb-8">{userData.role || "Expert Agrosystème"}</p>

                <div className="space-y-4 pt-6 md:pt-8 border-t border-emerald-50">
                  <div className="flex items-center justify-between text-left px-4 py-3 bg-emerald-50 rounded-2xl">
                    <p className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-[#052E16]/40">Membre Depuis</p>
                    <p className="text-[10px] md:text-xs font-bold text-[#052E16]">{userData.joinDate}</p>
                  </div>
                  <div className="flex items-center justify-between text-left px-4 py-3 bg-emerald-50 rounded-2xl">
                    <p className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-[#052E16]/40">Status</p>
                    <div className="flex items-center gap-1.5 px-2 py-0.5 bg-lime-400 text-[#052E16] rounded-md">
                      <Zap size={10} className="fill-current" />
                      <span className="text-[8px] font-black uppercase">Elite</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 md:mt-10 pt-8 md:pt-10 border-t border-emerald-50">
                  {isEditing ? (
                    <div className="space-y-3">
                      <button onClick={handleSave} disabled={loading} className="w-full bg-[#052E16] text-white py-4 md:py-5 rounded-xl md:rounded-[24px] font-black text-[10px] md:text-xs uppercase tracking-widest shadow-xl hover:bg-emerald-800 transition-all flex items-center justify-center gap-2">
                        {loading ? <Loader2 className="animate-spin w-4 h-4" /> : "Enregistrer"}
                      </button>
                      <button onClick={() => setIsEditing(false)} className="w-full bg-rose-50 text-rose-600 py-4 md:py-5 rounded-xl md:rounded-[24px] font-black text-[10px] md:text-xs uppercase tracking-widest hover:bg-rose-100 transition-all">
                        Annuler
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => setIsEditing(true)} className="w-full bg-[#052E16] text-white py-4 md:py-5 rounded-xl md:rounded-[24px] font-black text-[10px] md:text-xs uppercase tracking-widest shadow-xl shadow-emerald-900/20 hover:scale-[1.02] active:scale-95 transition-all">
                      Modifier mon Profil
                    </button>
                  )}
                </div>
              </div>

              <div className="bg-gradient-to-br from-emerald-600 to-lime-500 rounded-[32px] md:rounded-[40px] p-6 md:p-8 text-white shadow-2xl shadow-emerald-900/10">
                <div className="flex items-center gap-3 mb-4 md:mb-6">
                  <Shield className="w-5 h-5 md:w-6 md:h-6 opacity-60" />
                  <h3 className="text-lg md:text-xl font-black tracking-tighter">Plan SmartAgro Pro</h3>
                </div>
                <p className="text-xs md:text-sm font-medium leading-relaxed opacity-90 mb-4 md:mb-6">Accédez à toutes les prédictions avancées et au support prioritaire 24/7.</p>
                <button className="w-full py-3.5 md:py-4 bg-white/20 backdrop-blur-md rounded-xl md:rounded-2xl font-black text-[9px] md:text-[10px] uppercase tracking-widest hover:bg-white/30 transition-all">Détails de l'abonnement</button>
              </div>
            </div>

            {/* Main Fields Form */}
            <div className="lg:col-span-8 space-y-6 md:space-y-8">
              <div className="bg-white/40 backdrop-blur-3xl rounded-[32px] md:rounded-[48px] border border-emerald-50 shadow-2xl shadow-emerald-900/5 overflow-hidden">
                <div className="flex border-b border-emerald-50">
                  <button type="button" onClick={() => setActiveTab('profile')} className={`flex-1 py-8 md:py-10 font-black text-[10px] md:text-[11px] uppercase tracking-[0.2em] md:tracking-[0.3em] transition-all relative ${activeTab === 'profile' ? 'text-[#052E16] bg-white/60' : 'text-[#052E16]/20 hover:text-[#052E16]/40 hover:bg-white/20'}`}>
                    Profil
                    {activeTab === 'profile' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-600 to-lime-500"></div>}
                  </button>
                  <button type="button" onClick={() => setActiveTab('security')} className={`flex-1 py-8 md:py-10 font-black text-[10px] md:text-[11px] uppercase tracking-[0.2em] md:tracking-[0.3em] transition-all relative ${activeTab === 'security' ? 'text-[#052E16] bg-white/60' : 'text-[#052E16]/20 hover:text-[#052E16]/40 hover:bg-white/20'}`}>
                    Sécurité
                    {activeTab === 'security' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-600 to-lime-500"></div>}
                  </button>
                </div>

                <div className="p-8 md:p-12 lg:p-16">
                  {activeTab === 'profile' ? (
                    <div className="space-y-8 md:space-y-12">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                        <ProfileField label="Nom" value={userData.nom} icon={User} disabled={!isEditing} onChange={(e: any) => setUserData({ ...userData, nom: e.target.value })} error={formErrors.nom} />
                        <ProfileField label="Prénom" value={userData.prenom} icon={User} disabled={!isEditing} onChange={(e: any) => setUserData({ ...userData, prenom: e.target.value })} error={formErrors.prenom} />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                        <ProfileField label="Email" value={userData.email} icon={Mail} disabled={true} />
                        <ProfileField label="Téléphone" value={userData.phone} icon={Phone} disabled={!isEditing} onChange={(e: any) => setUserData({ ...userData, phone: e.target.value })} error={formErrors.phone} />
                      </div>
                      <div className="pt-8 md:pt-12 border-t border-emerald-50">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-[#052E16]/30 mb-6 md:mb-8 flex items-center gap-3"><Globe className="w-3.5 h-3.5" /> Préférences de Langue</h3>
                        <div className="flex flex-col sm:flex-row gap-4">
                          {[
                            { val: 'fr', label: 'Français', flag: '🇫🇷' },
                            { val: 'en', label: 'English', flag: '🇺🇸' }
                          ].map(opt => (
                            <button type="button" key={opt.val} onClick={() => setLang(opt.val as any)} disabled={!isEditing} className={`flex-1 px-6 md:px-8 py-4 md:py-5 rounded-xl md:rounded-[24px] border-2 transition-all flex items-center justify-center sm:justify-start gap-3 font-bold tracking-tight ${lang === opt.val ? 'border-emerald-600 bg-emerald-50 text-[#052E16]' : 'border-emerald-50/50 hover:border-emerald-100 text-[#052E16]/40'} ${!isEditing && 'opacity-50 cursor-not-allowed'}`}>
                              <span className="text-xl">{opt.flag}</span>
                              {opt.label}
                              {lang === opt.val && <Check size={16} className="text-emerald-500" />}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-8 md:space-y-12">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                        <div className="relative">
                          <ProfileField label="Nouveau Mot de Passe" value={userData.password} type={showPass ? "text" : "password"} icon={Lock} disabled={!isEditing} onChange={(e: any) => setUserData({ ...userData, password: e.target.value })} error={formErrors.password} />
                          {isEditing && (
                            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-6 top-14 text-emerald-200 hover:text-emerald-500 transition-colors">
                              {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                          )}
                        </div>
                        <ProfileField label="Confirmation" value={userData.confirmPassword} type={showPass ? "text" : "password"} icon={Lock} disabled={!isEditing} onChange={(e: any) => setUserData({ ...userData, confirmPassword: e.target.value })} error={formErrors.confirmPassword} />
                      </div>
                      <div className="p-6 md:p-8 bg-emerald-50/50 rounded-[28px] md:rounded-[32px] border border-emerald-50">
                        <div className="flex items-start gap-4">
                          <Shield className="w-5 h-5 md:w-6 md:h-6 text-emerald-600 mt-1" />
                          <div>
                            <p className="font-black text-[#052E16] mb-2 text-sm md:text-base">Sécurité Critique</p>
                            <p className="text-xs md:text-sm font-medium text-[#052E16]/60 leading-relaxed">Votre mot de passe doit comporter au moins 12 caractères pour un niveau de protection Elite SmartAgro.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {showSuccess && (
                <div className="p-6 md:p-8 bg-emerald-600 text-white rounded-[32px] md:rounded-[40px] shadow-2xl flex items-center gap-4 animate-fadeIn">
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-white/20 rounded-xl md:rounded-2xl flex items-center justify-center">
                    <CheckCircle2 className="w-7 h-7 md:w-8 md:h-8" />
                  </div>
                  <div>
                    <h4 className="text-lg md:text-xl font-black tracking-tighter leading-none mb-1">Succès!</h4>
                    <p className="text-xs md:text-sm font-medium opacity-90">Vos réglages ont été synchronisés instantanément.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}