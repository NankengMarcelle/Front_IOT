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
import { authService } from "@/features/auth/services/authService";
import { validatePassword, passwordsMatch } from '@/lib/utils/passwordValidator';
import { toast } from 'sonner';

const ProfileField = ({ label, value, icon: Icon, type = "text", error = "", isEditing, ...props }: {
  label: string,
  value: string,
  icon: any,
  type?: string,
  error?: string,
  isEditing: boolean,
  [key: string]: any
}) => {
  const [show, setShow] = useState(false);
  const inputType = type === "password" ? (show ? "text" : "password") : type;

  return (
    <div className="space-y-3 relative">
      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#052E16]/30 px-2 flex items-center gap-2">
        <Icon className="w-3 h-3" />
        {label}
      </label>
      <div className="relative">
        <input
          type={inputType}
          value={value}
          className={`w-full px-8 py-5 rounded-[24px] border ${error ? 'border-rose-300 bg-rose-50 text-rose-900' : 'border-emerald-50 bg-white/50 text-[#052E16]'} 
            focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-bold tracking-tight
            ${!isEditing && 'bg-emerald-50/20 text-[#052E16]/40 cursor-not-allowed'}`}
          {...props}
        />
        {type === "password" && isEditing && (
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute right-6 top-1/2 -translate-y-1/2 text-emerald-200 hover:text-emerald-500 transition-colors"
          >
            {show ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && <p className="text-[9px] font-black uppercase tracking-widest text-rose-500 px-2">{error}</p>}
    </div>
  );
};

type UserRole = "ADMIN" | "FARMER" | "AGENT" | "MANAGER" | "AGRICULTEUR" | "UTILISATEUR" | string;

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
  password?: string;
  confirmPassword?: string;
  oldPassword?: string;
  notifications: {
    email: boolean;
    sms: boolean;
    weeklyReport: boolean;
  };
  avatar?: string;
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
    id: "",
    email: "",
    nom: "",
    prenom: "",
    role: "AGRICULTEUR",
    phone: "",
    address: "Yaoundé, Cameroun",
    joinDate: "",
    langue: lang,
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

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const user = await authService.getProfile();
      setUserData(prev => ({
        ...prev,
        id: user.id,
        email: user.email,
        nom: user.nom || "",
        prenom: user.prenom || "",
        role: user.role,
        phone: user.telephone || "",
        joinDate: user.date_inscription ? new Date(user.date_inscription).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : "",
        // avatar handle
      }));
      if (user.avatar) setAvatarPreview(user.avatar);
    } catch (error) {
      console.error("Failed to fetch profile", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
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
    if (!userData.nom.trim()) { errors.nom = t('profil.error_nom_required'); isValid = false; }
    if (!userData.prenom.trim()) { errors.prenom = t('profil.error_prenom_required'); isValid = false; }

    if (userData.password) {
      const passwordError = validatePassword(userData.password);
      if (passwordError) {
        errors.password = passwordError;
        isValid = false;
      } else if (!passwordsMatch(userData.password, userData.confirmPassword || '')) {
        errors.confirmPassword = t('profil.error_password_mismatch');
        isValid = false;
      }
    }
    setFormErrors(errors);
    return isValid;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    const toastId = toast.loading(t('profil.toast_updating'));
    try {
      await authService.updateProfile({
        nom: userData.nom,
        prenom: userData.prenom,
        telephone: userData.phone,
        avatar: avatarPreview || undefined
      });

      setIsEditing(false);
      toast.success(t('profil.toast_success'), { id: toastId });

      // Refresh local data
      fetchProfile();

      // Reset password fields
      setUserData(prev => ({ ...prev, oldPassword: "", password: "", confirmPassword: "" }));
    } catch (error: any) {
      console.error("Failed to update profile", error);
      toast.error(error.message || t('profil.toast_error'), { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate Current Password
    if (!userData.oldPassword) {
      setFormErrors(prev => ({ ...prev, password: t('profil.error_old_password_required') }));
      return;
    }

    // Validate New Password
    const passwordError = validatePassword(userData.password || '');
    if (passwordError) {
      setFormErrors(prev => ({ ...prev, password: passwordError }));
      return;
    }

    // Validate Confirmation
    if (!passwordsMatch(userData.password || '', userData.confirmPassword || '')) {
      setFormErrors(prev => ({ ...prev, confirmPassword: t('profil.error_password_mismatch') }));
      return;
    }

    setLoading(true);
    const toastId = toast.loading(t('profil.toast_password_updating'));
    try {
      const { oldPassword, password } = userData;
      if (!oldPassword || !password) return;

      await authService.changePassword(oldPassword, password);
      toast.success(t('profil.toast_password_success'), { id: toastId });
      setUserData(prev => ({ ...prev, oldPassword: "", password: "", confirmPassword: "" }));
    } catch (error: unknown) {
      console.error("Password change failed", error);
      const errorMessage = (error as any).body?.detail || (error as any).message || "Erreur de changement de mot de passe.";
      toast.error(errorMessage, { id: toastId });
    } finally {
      setLoading(false);
    }
  };


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
                <p className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-[#052E16]/40">{t('profil.configuration_label')}</p>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#052E16] tracking-tighter leading-[0.9]">
                {t('profil.identity_title')} <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-lime-500">{t('profil.identity_highlight')}</span>
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
                <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-emerald-600 mb-6 md:mb-8">{userData.role || t('profil.expert_role')}</p>

                <div className="space-y-4 pt-6 md:pt-8 border-t border-emerald-50">
                  <div className="flex items-center justify-between text-left px-4 py-3 bg-emerald-50 rounded-2xl">
                    <p className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-[#052E16]/40">{t('profil.member_since')}</p>
                    <p className="text-[10px] md:text-xs font-bold text-[#052E16]">{userData.joinDate}</p>
                  </div>
                  <div className="flex items-center justify-between text-left px-4 py-3 bg-emerald-50 rounded-2xl">
                    <p className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-[#052E16]/40">{t('profil.status_label')}</p>
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
                        {loading ? <Loader2 className="animate-spin w-4 h-4" /> : t('profil.save_button')}
                      </button>
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          setUserData(prev => ({ ...prev, oldPassword: "", password: "", confirmPassword: "" }));
                        }}
                        className="w-full bg-rose-50 text-rose-600 py-4 md:py-5 rounded-xl md:rounded-[24px] font-black text-[10px] md:text-xs uppercase tracking-widest hover:bg-rose-100 transition-all"
                      >
                        {t('profil.cancel_button')}
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => setIsEditing(true)} className="w-full bg-[#052E16] text-white py-4 md:py-5 rounded-xl md:rounded-[24px] font-black text-[10px] md:text-xs uppercase tracking-widest shadow-xl shadow-emerald-900/20 hover:scale-[1.02] active:scale-95 transition-all">
                      {t('profil.edit_profile')}
                    </button>
                  )}
                </div>
              </div>

              <div className="bg-gradient-to-br from-emerald-600 to-lime-500 rounded-[32px] md:rounded-[40px] p-6 md:p-8 text-white shadow-2xl shadow-emerald-900/10">
                <div className="flex items-center gap-3 mb-4 md:mb-6">
                  <Shield className="w-5 h-5 md:w-6 md:h-6 opacity-60" />
                  <h3 className="text-lg md:text-xl font-black tracking-tighter">{t('profil.plan_title')}</h3>
                </div>
                <p className="text-xs md:text-sm font-medium leading-relaxed opacity-90 mb-4 md:mb-6">{t('profil.plan_desc')}</p>
                <button className="w-full py-3.5 md:py-4 bg-white/20 backdrop-blur-md rounded-xl md:rounded-2xl font-black text-[9px] md:text-[10px] uppercase tracking-widest hover:bg-white/30 transition-all">{t('profil.subscription_details')}</button>
              </div>
            </div>

            {/* Main Fields Form */}
            <div className="lg:col-span-8 space-y-6 md:space-y-8">
              <div className="bg-white/40 backdrop-blur-3xl rounded-[32px] md:rounded-[48px] border border-emerald-50 shadow-2xl shadow-emerald-900/5 overflow-hidden">
                <div className="flex border-b border-emerald-50">
                  <button type="button" onClick={() => setActiveTab('profile')} className={`flex-1 py-8 md:py-10 font-black text-[10px] md:text-[11px] uppercase tracking-[0.2em] md:tracking-[0.3em] transition-all relative ${activeTab === 'profile' ? 'text-[#052E16] bg-white/60' : 'text-[#052E16]/20 hover:text-[#052E16]/40 hover:bg-white/20'}`}>
                    {t('profil.tab_profile')}
                    {activeTab === 'profile' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-600 to-lime-500"></div>}
                  </button>
                  <button type="button" onClick={() => setActiveTab('security')} className={`flex-1 py-8 md:py-10 font-black text-[10px] md:text-[11px] uppercase tracking-[0.2em] md:tracking-[0.3em] transition-all relative ${activeTab === 'security' ? 'text-[#052E16] bg-white/60' : 'text-[#052E16]/20 hover:text-[#052E16]/40 hover:bg-white/20'}`}>
                    {t('profil.tab_security')}
                    {activeTab === 'security' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-600 to-lime-500"></div>}
                  </button>
                </div>

                <div className="p-8 md:p-12 lg:p-16">
                  {activeTab === 'profile' ? (
                    <div className="space-y-8 md:space-y-12">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                        <ProfileField label="Nom" value={userData.nom} icon={User} isEditing={isEditing} disabled={!isEditing} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUserData({ ...userData, nom: e.target.value })} error={formErrors.nom} />
                        <ProfileField label="Prénom" value={userData.prenom} icon={User} isEditing={isEditing} disabled={!isEditing} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUserData({ ...userData, prenom: e.target.value })} error={formErrors.prenom} />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                        <ProfileField label="Email" value={userData.email} icon={Mail} isEditing={false} disabled={true} />
                        <ProfileField label="Téléphone" value={userData.phone} icon={Phone} isEditing={isEditing} disabled={!isEditing} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUserData({ ...userData, phone: e.target.value })} error={formErrors.phone} />
                      </div>
                      <div className="pt-8 md:pt-12 border-t border-emerald-50">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-[#052E16]/30 mb-6 md:mb-8 flex items-center gap-3"><Globe className="w-3.5 h-3.5" /> {t('profil.lang_pref')}</h3>
                        <div className="flex flex-col sm:flex-row gap-4">
                          {[
                            { val: 'fr', label: 'Français', flag: '🇫🇷' },
                            { val: 'en', label: 'English', flag: '🇺🇸' }
                          ].map((opt) => (
                            <button
                              type="button"
                              key={opt.val}
                              onClick={() => setLang(opt.val as 'fr' | 'en')}
                              disabled={!isEditing}
                              className={`flex-1 px-6 md:px-8 py-4 md:py-5 rounded-xl md:rounded-[24px] border-2 transition-all flex items-center justify-center sm:justify-start gap-3 font-bold tracking-tight ${lang === opt.val ? 'border-emerald-600 bg-emerald-50 text-[#052E16]' : 'border-emerald-50/50 hover:border-emerald-100 text-[#052E16]/40'} ${!isEditing && 'opacity-50 cursor-not-allowed'}`}
                            >
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
                      <div className="p-6 md:p-8 bg-emerald-50/50 rounded-[28px] md:rounded-[32px] border border-emerald-50 flex items-start gap-4">
                        <Shield className="w-5 h-5 md:w-6 md:h-6 text-emerald-600 mt-1" />
                        <div>
                          <p className="font-black text-[#052E16] mb-2 text-sm md:text-base">{t('profil.security_critical')}</p>
                          <p className="text-xs md:text-sm font-medium text-[#052E16]/60 leading-relaxed">{t('profil.security_desc')}</p>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <ProfileField
                          label={t('profil.old_password')}
                          value={userData.oldPassword || ""}
                          type="password"
                          icon={Lock}
                          isEditing={isEditing}
                          disabled={!isEditing}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUserData({ ...userData, oldPassword: e.target.value })}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                          <div className="relative">
                            <ProfileField
                              label={t('profil.new_password')}
                              value={userData.password || ""}
                              type="password"
                              icon={Lock}
                              isEditing={isEditing}
                              disabled={!isEditing}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUserData({ ...userData, password: e.target.value })}
                              error={formErrors.password}
                            />
                          </div>
                          <ProfileField
                            label={t('profil.confirm_password')}
                            value={userData.confirmPassword || ""}
                            type="password"
                            icon={Lock}
                            isEditing={isEditing}
                            disabled={!isEditing}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUserData({ ...userData, confirmPassword: e.target.value })}
                            error={formErrors.confirmPassword}
                          />
                        </div>

                        {isEditing && (
                          <div className="pt-6">
                            <button
                              onClick={handleUpdatePassword}
                              disabled={loading || !userData.oldPassword || !userData.password}
                              className="w-full sm:w-auto px-10 py-4 bg-emerald-900 text-white rounded-[20px] font-black uppercase tracking-widest text-[10px] hover:bg-emerald-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                              {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                              {t('profil.update_password')}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Fin du contenu principal */}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}