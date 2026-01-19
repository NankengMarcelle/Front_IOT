"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Leaf, User, UserCircle, Phone, Mail, Lock, ArrowRight, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';

export default function RegisterForm({ role }: { role: string | null }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const isAdmin = role === 'admin';

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulation inscription
    setTimeout(() => {
      localStorage.setItem('smartagro_user', JSON.stringify({
        email: 'nouveau@user.com',
        name: 'Nouveau User',
        role: isAdmin ? 'ADMIN' : 'AGRICULTEUR'
      }));
      localStorage.setItem('smartagro_token', 'simulated-jwt-token-' + Date.now());
      setLoading(false);
      window.location.href = isAdmin ? '/dashboard/admin' : '/dashboard/farmer';
    }, 1500);
  };

  return (
    <div className="w-full max-w-md animate-in fade-in zoom-in duration-700">
      <div className="bg-white/40 backdrop-blur-2xl rounded-[48px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] p-8 md:p-10 flex flex-col items-center border border-white/40 relative overflow-hidden group">
        {/* Decorative Glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-emerald-500/20 transition-colors duration-1000"></div>

        {/* Header */}
        <div className="w-full text-center mb-8 relative z-10">
          <div className="inline-flex p-3 bg-white rounded-2xl shadow-sm mb-6 border border-emerald-50">
            <Leaf className="w-8 h-8 text-emerald-600" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#052E16] tracking-tighter">Créer un compte</h1>
          <p className="text-emerald-900/40 text-[10px] font-black uppercase tracking-[0.2em] mt-2">Étape {step} sur 2</p>
        </div>

        {/* Progress Dots */}
        <div className="flex gap-2 mb-10 relative z-10">
          <div className={`h-1.5 rounded-full transition-all duration-500 ${step === 1 ? 'w-8 bg-emerald-500' : 'w-4 bg-emerald-200'}`}></div>
          <div className={`h-1.5 rounded-full transition-all duration-500 ${step === 2 ? 'w-8 bg-emerald-500' : 'w-4 bg-emerald-200'}`}></div>
        </div>

        <form onSubmit={handleRegister} className="w-full flex flex-col gap-6 relative z-10">
          {step === 1 ? (
            /* ÉTAPE 1 : Informations Personnelles */
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
              <div className="space-y-2">
                <label className="text-[#052E16] font-black text-[10px] uppercase tracking-widest ml-1">Nom Complet</label>
                <div className="relative group/input">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-900/30 group-focus-within/input:text-emerald-600 transition-colors">
                    <User className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    placeholder="Votre nom"
                    className="w-full bg-white/60 border border-white/40 rounded-[20px] pl-12 pr-6 py-4 outline-none focus:bg-white focus:border-emerald-500/50 focus:shadow-[0_10px_20px_-10px_rgba(16,185,129,0.1)] transition-all font-medium text-[#052E16] placeholder:text-[#052E16]/20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[#052E16] font-black text-[10px] uppercase tracking-widest ml-1">Pseudonyme</label>
                <div className="relative group/input">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-900/30 group-focus-within/input:text-emerald-600 transition-colors">
                    <UserCircle className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    placeholder="Nom d'utilisateur"
                    className="w-full bg-white/60 border border-white/40 rounded-[20px] pl-12 pr-6 py-4 outline-none focus:bg-white focus:border-emerald-500/50 focus:shadow-[0_10px_20px_-10px_rgba(16,185,129,0.1)] transition-all font-medium text-[#052E16] placeholder:text-[#052E16]/20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[#052E16] font-black text-[10px] uppercase tracking-widest ml-1">Téléphone</label>
                <div className="relative group/input">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-900/30 group-focus-within/input:text-emerald-600 transition-colors">
                    <Phone className="w-5 h-5" />
                  </div>
                  <input
                    type="tel"
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
                  Continuer
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-lime-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </button>
            </div>
          ) : (
            /* ÉTAPE 2 : Identifiants & Sécurité */
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
              <div className="space-y-2">
                <label className="text-[#052E16] font-black text-[10px] uppercase tracking-widest ml-1">Email</label>
                <div className="relative group/input">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-900/30 group-focus-within/input:text-emerald-600 transition-colors">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input
                    type="email"
                    placeholder="votre@email.com"
                    className="w-full bg-white/60 border border-white/40 rounded-[20px] pl-12 pr-6 py-4 outline-none focus:bg-white focus:border-emerald-500/50 focus:shadow-[0_10px_20px_-10px_rgba(16,185,129,0.1)] transition-all font-medium text-[#052E16] placeholder:text-[#052E16]/20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[#052E16] font-black text-[10px] uppercase tracking-widest ml-1">Mot de passe</label>
                <div className="relative group/input">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-900/30 group-focus-within/input:text-emerald-600 transition-colors">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full bg-white/60 border border-white/40 rounded-[20px] pl-12 pr-6 py-4 outline-none focus:bg-white focus:border-emerald-500/50 focus:shadow-[0_10px_20px_-10px_rgba(16,185,129,0.1)] transition-all font-medium text-[#052E16] placeholder:text-[#052E16]/20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[#052E16] font-black text-[10px] uppercase tracking-widest ml-1">Confirmer</label>
                <div className="relative group/input">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-900/30 group-focus-within/input:text-emerald-600 transition-colors">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full bg-white/60 border border-white/40 rounded-[20px] pl-12 pr-6 py-4 outline-none focus:bg-white focus:border-emerald-500/50 focus:shadow-[0_10px_20px_-10px_rgba(16,185,129,0.1)] transition-all font-medium text-[#052E16] placeholder:text-[#052E16]/20"
                  />
                </div>
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
                        S'inscrire
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
          <span className="text-[#052E16]/40">Déjà un compte ? </span>
          <Link href={`/login?role=${role}`} className="text-emerald-600 hover:text-emerald-700 transition-colors">Se connecter</Link>
        </div>
      </div>
    </div>
  );
}