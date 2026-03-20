"use client";

import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import ForgotPasswordForm from '@/features/auth/components/ForgotPasswordForm';
import { Suspense } from 'react';

function ForgotPasswordContent() {
  const searchParams = useSearchParams();
  const role = searchParams.get('role');
  return <ForgotPasswordForm role={role} />;
}

export default function ForgotPasswordPage() {
  return (
    <main className="relative min-h-screen w-full flex items-center justify-center p-4 overflow-hidden">
      {/* Premium Background handling */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/strawberry-field.jpg"
          alt="Smart Agro Background"
          fill
          className="object-cover scale-105"
          priority
        />
        <div className="absolute inset-0 bg-[#052E16]/40 backdrop-blur-[2px]" />
        <div className="absolute inset-0 bg-gradient-to-tr from-[#052E16] via-transparent to-transparent opacity-60" />
      </div>

      {/* Decorative Animated Glows */}
      <div className="absolute top-1/4 -right-10 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] animate-pulse z-10 pointer-events-none" />

      <div className="relative z-20 w-full flex justify-center items-center">
        <Suspense fallback={
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-white font-black text-[10px] uppercase tracking-widest">Initialisation...</p>
          </div>
        }>
          <ForgotPasswordContent />
        </Suspense>
      </div>
    </main>
  );
}