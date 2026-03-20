"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Leaf, User, Phone, Mail, Lock, ArrowRight, ArrowLeft, Loader2, CheckCircle2, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { validatePassword, passwordsMatch } from '@/lib/utils/passwordValidator';
import { authService } from '@/features/auth/services/authService';
import { toast } from "sonner";
import { useTranslation } from '@/providers/TranslationProvider';

export default function RegisterForm({ role }: { role: string | null }) {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({
    password: '',
    confirmPassword: '',
    general: ''
  });

  const isAdmin = role === 'admin';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear errors when user types
    if (name === 'password' || name === 'confirmPassword') {
      setErrors(prev => ({ ...prev, [name]: '', general: '' }));
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.prenom.trim() || !formData.nom.trim()) {
      const msg = t('auth.register.error_fields');
      setErrors(prev => ({ ...prev, general: msg }));
      toast.error(msg);
      return;
    }

    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      setErrors(prev => ({ ...prev, password: passwordError }));
      toast.error(passwordError);
      return;
    }

    if (!passwordsMatch(formData.password, formData.confirmPassword)) {
      const msg = t('auth.register.error_passwords_match');
      setErrors(prev => ({ ...prev, confirmPassword: msg }));
      toast.error(msg);
      return;
    }

    setLoading(true);
    const toastId = toast.loading(t('auth.register.toast_loading'));

    try {
      await authService.register({
        nom: formData.nom,
        prenom: formData.prenom,
        email: formData.email,
        telephone: formData.phone,
        password: formData.password
      }, isAdmin);

      toast.success(t('auth.register.toast_success'), { id: toastId });
      setLoading(false);
      window.location.href = '/login';
    } catch (error: any) {
      console.error("Registration failed:", error);
      const errorMsg = error.message || t('auth.register.registration_failed');
      setErrors(prev => ({ ...prev, general: errorMsg }));
      toast.error(errorMsg, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md animate-in fade-in zoom-in duration-700">
      <div className="bg-white/40 backdrop-blur-2xl rounded-[48px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] p-8 md:p-10 flex flex-col items-center border border-white/40 relative overflow-hidden group">
        {/* Decorative Glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-emerald-500/20 transition-colors duration-1000"></div>

        {/* Header */}
        <div className="w-full text-center mb-8 relative z-10">
          <Link href="/" className="inline-flex p-3 bg-white rounded-2xl shadow-sm mb-6 border border-emerald-50 hover:scale-110 transition-transform">
            <Leaf className="w-8 h-8 text-emerald-600" />
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-[#052E16] tracking-tighter">{t('auth.register.title')}</h1>
          <p className="text-emerald-900/40 text-[10px] font-black uppercase tracking-[0.2em] mt-2">
            {t('auth.register.step').replace('{{step}}', step.toString())}
          </p>
        </div>

        {/* Progress Dots */}
        <div className="flex gap-2 mb-10 relative z-10">
          <div className={`h-1.5 rounded-full transition-all duration-500 ${step === 1 ? 'w-8 bg-emerald-500' : 'w-4 bg-emerald-200'}`}></div>
          <div className={`h-1.5 rounded-full transition-all duration-500 ${step === 2 ? 'w-8 bg-emerald-500' : 'w-4 bg-emerald-200'}`}></div>
        </div>

        {errors.general && (
          <div className="w-full mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-600 animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-xs font-bold leading-tight">{errors.general}</p>
          </div>
        )}

        <form onSubmit={handleRegister} className="w-full flex flex-col gap-6 relative z-10">
          {step === 1 ? (
            /* ÉTAPE 1 : Informations Personnelles */
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[#052E16] font-black text-[10px] uppercase tracking-widest ml-1">{t('auth.register.firstname')}</label>
                  <div className="relative group/input">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-900/30 group-focus-within/input:text-emerald-600 transition-colors">
                      <User className="w-5 h-5" />
                    </div>
                    <input
                      type="text"
                      name="prenom"
                      value={formData.prenom}
                      onChange={handleInputChange}
                      placeholder={t('auth.register.firstname')}
                      className="w-full bg-white/60 border border-white/40 rounded-[20px] pl-12 pr-4 py-4 outline-none focus:bg-white focus:border-emerald-500/50 focus:shadow-[0_10px_20px_-10px_rgba(16,185,129,0.1)] transition-all font-medium text-[#052E16] placeholder:text-[#052E16]/20"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[#052E16] font-black text-[10px] uppercase tracking-widest ml-1">{t('auth.register.lastname')}</label>
                  <div className="relative group/input">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-900/30 group-focus-within/input:text-emerald-600 transition-colors">
                      <User className="w-5 h-5" />
                    </div>
                    <input
                      type="text"
                      name="nom"
                      value={formData.nom}
                      onChange={handleInputChange}
                      placeholder={t('auth.register.lastname')}
                      className="w-full bg-white/60 border border-white/40 rounded-[20px] pl-12 pr-4 py-4 outline-none focus:bg-white focus:border-emerald-500/50 focus:shadow-[0_10px_20px_-10px_rgba(16,185,129,0.1)] transition-all font-medium text-[#052E16] placeholder:text-[#052E16]/20"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[#052E16] font-black text-[10px] uppercase tracking-widest ml-1">{t('auth.register.phone')}</label>
                <div className="relative group/input">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-900/30 group-focus-within/input:text-emerald-600 transition-colors">
                    <Phone className="w-5 h-5" />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+237 ..."
                    className="w-full bg-white/60 border border-white/40 rounded-[20px] pl-12 pr-6 py-4 outline-none focus:bg-white focus:border-emerald-500/50 focus:shadow-[0_10px_20px_-10px_rgba(16,185,129,0.1)] transition-all font-medium text-[#052E16] placeholder:text-[#052E16]/20"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                className="group relative w-full bg-[#052E16] text-white font-black py-4 rounded-[20px] shadow-[0_20px_40px_-10px_rgba(5,46,22,0.3)] transition-all hover:scale-[1.02] active:scale-[0.98] mt-4 text-xs uppercase tracking-[0.2em] overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  {t('auth.register.continue')}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-lime-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </button>
            </div>
          ) : (
            /* ÉTAPE 2 : Identifiants & Sécurité */
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
              <div className="space-y-2">
                <label className="text-[#052E16] font-black text-[10px] uppercase tracking-widest ml-1">{t('auth.register.email_label')}</label>
                <div className="relative group/input">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-900/30 group-focus-within/input:text-emerald-600 transition-colors">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="votre@email.com"
                    className="w-full bg-white/60 border border-white/40 rounded-[20px] pl-12 pr-6 py-4 outline-none focus:bg-white focus:border-emerald-500/50 focus:shadow-[0_10px_20px_-10px_rgba(16,185,129,0.1)] transition-all font-medium text-[#052E16] placeholder:text-[#052E16]/20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[#052E16] font-black text-[10px] uppercase tracking-widest ml-1">{t('auth.register.password_label')}</label>
                <div className="relative group/input">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-900/30 group-focus-within/input:text-emerald-600 transition-colors">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className={`w-full bg-white/60 border ${errors.password ? 'border-rose-400' : 'border-white/40'} rounded-[20px] pl-12 pr-12 py-4 outline-none focus:bg-white focus:border-emerald-500/50 focus:shadow-[0_10px_20px_-10px_rgba(16,185,129,0.1)] transition-all font-medium text-[#052E16] placeholder:text-[#052E16]/20`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-900/30 hover:text-emerald-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-rose-500 ml-1 mt-1">
                    <AlertCircle className="w-3 h-3" /> {errors.password}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-[#052E16] font-black text-[10px] uppercase tracking-widest ml-1">{t('auth.register.confirm_password_label')}</label>
                <div className="relative group/input">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-900/30 group-focus-within/input:text-emerald-600 transition-colors">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className={`w-full bg-white/60 border ${errors.confirmPassword ? 'border-rose-400' : 'border-white/40'} rounded-[20px] pl-12 pr-12 py-4 outline-none focus:bg-white focus:border-emerald-500/50 focus:shadow-[0_10px_20px_-10px_rgba(16,185,129,0.1)] transition-all font-medium text-[#052E16] placeholder:text-[#052E16]/20`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-900/30 hover:text-emerald-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-rose-500 ml-1 mt-1">
                    <AlertCircle className="w-3 h-3" /> {errors.confirmPassword}
                  </p>
                )}
              </div>

              <div className="flex gap-4 mt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 bg-white/40 backdrop-blur-md border border-white/40 text-[#052E16] font-black py-4 rounded-[20px] hover:bg-white transition-all text-xs uppercase tracking-widest"
                >
                  <ArrowLeft className="w-4 h-4 mx-auto" />
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative flex-[3] bg-[#052E16] text-white font-black py-4 rounded-[20px] shadow-[0_20px_40px_-10px_rgba(5,46,22,0.3)] transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed text-xs uppercase tracking-[0.2em] overflow-hidden"
                >
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        {t('auth.register.submit')}
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-lime-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </button>
              </div>
            </div>
          )}
        </form>

        <div className="mt-10 text-[10px] font-black uppercase tracking-widest relative z-10">
          <span className="text-[#052E16]/40">{t('auth.register.already_have_account')}</span>
          <Link href={`/login?role=${role}`} className="text-emerald-600 hover:text-emerald-700 transition-colors">{t('auth.login.submit')}</Link>
        </div>
      </div>

      {/* Back to Home Button */}
      <div className="mt-8 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-white/60 backdrop-blur-md border border-white/40 rounded-2xl text-[#052E16] hover:bg-white hover:shadow-lg transition-all font-black text-[10px] uppercase tracking-[0.2em]"
        >
          <ArrowLeft className="w-3 h-3" />
          {t('auth.login.back_to_home')}
        </Link>
      </div>
    </div>
  );
}