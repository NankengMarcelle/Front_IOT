"use client";

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Leaf, Mail, Lock, ShieldCheck, ArrowRight, ArrowLeft, Loader2, Eye, EyeOff } from 'lucide-react';
import { authService } from '../services/authService';

interface LoginFormProps {
  role: string | null;
}

export default function LoginForm({ role }: LoginFormProps) {
  const router = useRouter();
  const isAdmin = role === 'admin';
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // LE CODE ADMINISTRATEUR FIXE
  const ADMIN_SECRET_CODE = "SA-2025-ADMIN";

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const adminCode = formData.get('adminCode');

    // 1. Validation du code fixe pour l'administrateur
    if (isAdmin) {
      if (adminCode !== ADMIN_SECRET_CODE) {
        setError("Code de sécurité administrateur incorrect.");
        setLoading(false);
        return;
      }
    }

    // 2. Authentification réelle via le backend
    try {
      const user = await authService.login(email, password);

      // 3. Vérification du rôle (optionnelle : si l'admin doit avoir un rôle spécifique)
      // L'API a déjà renvoyé le profil

      setLoading(false);
      router.push(isAdmin ? '/dashboard/admin' : '/dashboard/farmer');
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Identifiants invalides");
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md animate-in fade-in zoom-in duration-700">
      <div className="bg-white/40 backdrop-blur-2xl rounded-[48px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] p-8 md:p-12 flex flex-col items-center border border-white/40 relative overflow-hidden group">
        {/* Decorative Glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-emerald-500/20 transition-colors duration-1000"></div>

        {/* Header Section */}
        <div className="w-full text-center mb-10 relative z-10">
          <div className="inline-flex p-3 bg-white rounded-2xl shadow-sm mb-6 border border-emerald-50">
            <Leaf className="w-8 h-8 text-emerald-600" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#052E16] tracking-tighter mb-2">
            Bon retour
          </h1>
          <p className="text-emerald-900/40 text-sm font-medium">Connectez-vous à votre écosystème</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="w-full bg-red-50/80 backdrop-blur-sm text-red-600 border border-red-100 p-4 rounded-2xl text-xs mb-8 text-center font-bold animate-shake">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6 relative z-10">
          {/* Email Input */}
          <div className="space-y-2">
            <label className="text-[#052E16] font-black text-[10px] uppercase tracking-widest ml-1">Email</label>
            <div className="relative group/input">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-900/30 group-focus-within/input:text-emerald-600 transition-colors">
                <Mail className="w-5 h-5" />
              </div>
              <input
                name="email"
                type="email"
                required
                placeholder="votre@email.com"
                className="w-full bg-white/60 border border-white/40 rounded-[20px] pl-12 pr-6 py-4 outline-none focus:bg-white focus:border-emerald-500/50 focus:shadow-[0_10px_20px_-10px_rgba(16,185,129,0.1)] transition-all font-medium text-[#052E16] placeholder:text-[#052E16]/20"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <label className="text-[#052E16] font-black text-[10px] uppercase tracking-widest">Mot de passe</label>
            </div>
            <div className="relative group/input">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-900/30 group-focus-within/input:text-emerald-600 transition-colors">
                <Lock className="w-5 h-5" />
              </div>
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                className="w-full bg-white/60 border border-white/40 rounded-[20px] pl-12 pr-12 py-4 outline-none focus:bg-white focus:border-emerald-500/50 focus:shadow-[0_10px_20px_-10px_rgba(16,185,129,0.1)] transition-all font-medium text-[#052E16] placeholder:text-[#052E16]/20"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-900/30 hover:text-emerald-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Admin Code Input (Conditional) */}
          {isAdmin && (
            <div className="space-y-2 animate-in slide-in-from-top-4 duration-500">
              <label className="text-emerald-600 font-black text-[10px] uppercase tracking-widest ml-1">Code Administrateur</label>
              <div className="relative group/input">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600/30 group-focus-within/input:text-emerald-600 transition-colors">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <input
                  name="adminCode"
                  type="password"
                  required
                  placeholder="SA-XXXX-XXXX"
                  className="w-full bg-emerald-50/30 border border-emerald-100 rounded-[20px] pl-12 pr-6 py-4 outline-none focus:bg-white focus:border-emerald-500/50 focus:shadow-[0_10px_20px_-10px_rgba(16,185,129,0.1)] transition-all font-medium text-emerald-900 placeholder:text-emerald-900/20"
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="group relative w-full bg-[#052E16] text-white font-black py-4 rounded-[20px] shadow-[0_20px_40px_-10px_rgba(5,46,22,0.3)] transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mt-4 text-xs uppercase tracking-[0.2em] overflow-hidden"
          >
            <span className="relative z-10 flex items-center justify-center gap-3">
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Authentification...
                </>
              ) : (
                <>
                  Se connecter
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-lime-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </button>
        </form>

        {/* Footer Links */}
        <div className="w-full flex justify-between mt-10 text-[10px] font-black uppercase tracking-widest relative z-10 px-2">
          <Link
            href={`/forgot-password?role=${role}`}
            className="text-[#052E16]/40 hover:text-emerald-600 transition-colors"
          >
            Mot de passe oublié ?
          </Link>
          <Link
            href={`/register?role=${role}`}
            className="text-[#052E16]/40 hover:text-emerald-600 transition-colors"
          >
            Créer un compte
          </Link>
        </div>
      </div>

      {/* Social Login / Back to home hint */}
      <div className="mt-8 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[#052E16]/40 hover:text-[#052E16] text-[10px] font-black uppercase tracking-[0.2em] transition-all"
        >
          <ArrowLeft className="w-3 h-3" />
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}