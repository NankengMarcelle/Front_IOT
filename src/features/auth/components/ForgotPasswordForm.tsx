"use client";

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { Leaf, Mail, ArrowRight, ArrowLeft, Send, CheckCircle2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from '@/providers/TranslationProvider';

export default function ForgotPasswordForm({ role }: { role: string | null }) {
  const { t } = useTranslation();
  const [isSent, setIsSent] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading(t('auth.forgot_password.toast_loading'));

    // Simulation envoi
    setTimeout(() => {
      console.log("Envoi du lien à :", email);
      toast.success("Lien envoyé ! Vérifiez votre boîte mail.", { id: toastId });
      setIsSent(true);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="w-full max-w-md animate-in fade-in zoom-in duration-700">
      <div className="bg-white/40 backdrop-blur-2xl rounded-[48px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] p-8 md:p-12 flex flex-col items-center border border-white/40 relative overflow-hidden group">
        {/* Decorative Glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-emerald-500/20 transition-colors duration-1000"></div>

        {/* Header */}
        <div className="w-full text-center mb-10 relative z-10">
          <Link href="/" className="inline-flex p-3 bg-white rounded-2xl shadow-sm mb-6 border border-emerald-50 hover:scale-110 transition-transform">
            <Leaf className="w-8 h-8 text-emerald-600" />
          </Link>
          <h1 className="text-3xl font-black text-[#052E16] tracking-tighter mb-2">
            {t('auth.forgot_password.title')}
          </h1>
          <p className="text-emerald-900/40 text-sm font-medium">{t('auth.forgot_password.subtitle')}</p>
        </div>

        {isSent ? (
          <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-700 relative z-10">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle2 className="w-10 h-10 text-emerald-600" />
            </div>
            <p className="text-[#052E16] font-bold text-lg mb-8 leading-relaxed">
              {t('auth.forgot_password.success_msg').replace('{{email}}', email)}
            </p>
            <Link
              href={`/login?role=${role}`}
              className="inline-flex items-center gap-2 text-emerald-600 font-black text-xs uppercase tracking-[0.2em] hover:text-emerald-700 transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              {t('auth.forgot_password.back_to_login')}
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6 relative z-10">
            <div className="space-y-2">
              <label className="text-[#052E16] font-black text-[10px] uppercase tracking-widest ml-1">{t('auth.forgot_password.email_label')}</label>
              <div className="relative group/input">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-900/30 group-focus-within/input:text-emerald-600 transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  className="w-full bg-white/60 border border-white/40 rounded-[20px] pl-12 pr-6 py-4 outline-none focus:bg-white focus:border-emerald-500/50 focus:shadow-[0_10px_20px_-10px_rgba(16,185,129,0.1)] transition-all font-medium text-[#052E16] placeholder:text-[#052E16]/20"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full bg-[#052E16] text-white font-black py-4 rounded-[20px] shadow-[0_20px_40px_-10px_rgba(5,46,22,0.3)] transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mt-4 text-[10px] uppercase tracking-[0.2em] overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                  <>
                    {t('auth.forgot_password.submit')}
                    <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </>
                )}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-lime-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </button>

            <div className="mt-8 text-center px-1">
              <Link
                href={`/login?role=${role}`}
                className="inline-flex items-center gap-2 text-[#052E16]/40 hover:text-emerald-600 text-[10px] font-black uppercase tracking-[0.2em] transition-all"
              >
                <ArrowLeft className="w-3 h-3" />
                {t('auth.forgot_password.back_to_login')}
              </Link>
            </div>
          </form>
        )}
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
