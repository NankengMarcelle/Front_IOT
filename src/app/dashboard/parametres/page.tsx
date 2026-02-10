'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UsersService } from '@/lib';
import { toast } from 'sonner';
import {
  Settings,
  Mail,
  MessageSquare,
  Bell,
  CheckCircle,
  Smartphone,
  Send,
  Loader2,
  Zap,
  ShieldCheck
} from 'lucide-react';

type NotificationMethod = 'email' | 'sms' | 'whatsapp' | 'telegram';
type Frequency = 'hebdo' | 'mensuel' | 'trimestriel' | 'none';

export default function ParametresPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Settings state: list of active notification modes
  const [activeModes, setActiveModes] = useState<string[]>([]);
  const [frequency, setFrequency] = useState<Frequency>('hebdo');

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const user = await UsersService.getMyProfileApiV1UsersMeGet();

        if (user.notification_modes) {
          setActiveModes(user.notification_modes);
        } else {
          // Default Fallback
          setActiveModes(['email']);
        }

        if (user.recommendation_frequency) {
          setFrequency(user.recommendation_frequency as Frequency);
        } else {
          // Check local storage for legacy fallback
          const savedFreq = localStorage.getItem('recommendation_frequency');
          if (savedFreq) setFrequency(savedFreq as Frequency);
        }

      } catch (error) {
        console.error('Erreur chargement profil:', error);
        toast.error("Impossible de charger vos préférences.");
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, []);

  const handleMethodToggle = (method: NotificationMethod) => {
    setActiveModes(prev => {
      if (prev.includes(method)) {
        return prev.filter(m => m !== method);
      } else {
        return [...prev, method];
      }
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Update Notification Settings
      await UsersService.updateNotificationSettingsApiV1UsersMeNotificationSettingsPut(activeModes);

      // Note: Recommendation frequency might need its own endpoint or be part of user update
      // user requested specific update for notification modes only for now.
      // If frequency needs to be saved to backend, we'd need another call or update user profile.
      // For now, let's persist frequency in local storage as before or assume it's handled if added to API later.
      localStorage.setItem('recommendation_frequency', frequency);

      toast.success("Préférences sauvegardées avec succès !");
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
      toast.error("Erreur lors de la sauvegarde.");
    } finally {
      setSaving(false);
    }
  };

  const notificationMethods = [
    { id: 'email' as NotificationMethod, name: 'Email Core', icon: Mail, desc: 'Rapports automatisés par email haute priorité' },
    { id: 'sms' as NotificationMethod, name: 'SMS Instant', icon: MessageSquare, desc: 'Alertes biométriques temps réel par SMS' },
    { id: 'whatsapp' as NotificationMethod, name: 'WhatsApp Bot', icon: Smartphone, desc: 'Diagnostic interactif sur WhatsApp Premium' },
    { id: 'telegram' as NotificationMethod, name: 'Telegram HQ', icon: Send, desc: 'Flux de données crypté via Telegram Secure' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAF9]">
        <Loader2 className="animate-spin text-emerald-600 w-12 h-12" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-emerald-50/50 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 opacity-60"></div>
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-lime-50/50 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 opacity-60"></div>
      </div>

      <main className="relative z-10 pt-8 md:pt-12 pb-16 md:pb-24 lg:pb-32 px-4 md:px-12 max-w-7xl mx-auto w-full">
        {/* Elite Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8 mb-10 md:mb-16">
          <div className="space-y-3 md:space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-xl md:rounded-2xl flex items-center justify-center text-emerald-600 shadow-xl border border-emerald-50">
                <Settings className="w-6 h-6 md:w-7 h-7" />
              </div>
              <p className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-[#052E16]/40">Système</p>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#052E16] tracking-tighter leading-[0.9]">
              Flux de <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-lime-500">Données.</span>
            </h1>
            <p className="text-[#052E16]/40 text-base md:text-lg font-medium italic">Gérez vos protocoles de communication et alertes critiques.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
          {/* Notification Controls */}
          <div className="lg:col-span-8 space-y-6 md:space-y-10">
            <div className="bg-white/40 backdrop-blur-3xl rounded-[32px] md:rounded-[48px] border border-emerald-50 shadow-2xl shadow-emerald-900/5 p-8 md:p-12 lg:p-16">
              <div className="flex items-center gap-4 mb-8 md:mb-12">
                <Bell className="w-6 h-6 md:w-8 md:h-8 text-emerald-600" />
                <h3 className="text-2xl md:text-3xl font-black text-[#052E16] tracking-tighter">Préférences de Notification.</h3>
              </div>

              <div className="space-y-4 md:space-y-6">
                {notificationMethods.map((method) => {
                  const Icon = method.icon;
                  const isActive = activeModes.includes(method.id);

                  return (
                    <div
                      key={method.id}
                      onClick={() => handleMethodToggle(method.id)}
                      className={`group cursor-pointer transition-all duration-500 ${isActive ? 'bg-white shadow-xl shadow-emerald-900/5 rounded-[28px] md:rounded-[40px] border-emerald-100 p-6 md:p-8' : 'bg-transparent border-b border-emerald-50 py-6 md:py-8 px-2 md:px-4 hover:bg-white/30 hover:px-6 hover:rounded-[24px]'}`}
                    >
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4 md:gap-6 w-full">
                          <div className={`w-12 h-12 md:w-16 md:h-16 rounded-2xl md:rounded-3xl flex items-center justify-center transition-all duration-500 ${isActive ? 'bg-[#052E16] text-white rotate-6' : 'bg-emerald-50 text-emerald-400 group-hover:bg-emerald-100'}`}>
                            <Icon className="w-6 h-6 md:w-8 md:h-8" />
                          </div>
                          <div>
                            <h4 className={`text-lg md:text-xl font-black tracking-tight ${isActive ? 'text-[#052E16]' : 'text-[#052E16]/40 group-hover:text-[#052E16]/70'}`}>{method.name}</h4>
                            <p className="text-[9px] md:text-[11px] font-black uppercase tracking-widest text-[#052E16]/30">{method.desc}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 md:gap-6 flex-shrink-0">
                          <div
                            className={`relative inline-flex h-8 w-14 md:h-9 md:w-16 items-center rounded-full transition-all duration-500 shrink-0 ${isActive ? 'bg-[#052E16]' : 'bg-emerald-100 group-hover:bg-emerald-200'}`}
                          >
                            <span className={`inline-block h-5 w-5 md:h-6 md:w-6 transform rounded-full bg-white transition-transform duration-500 shadow-lg ${isActive ? 'translate-x-7 md:translate-x-8 scale-90' : 'translate-x-1.5 md:translate-x-2'}`} />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-10 md:mt-16 flex flex-col sm:flex-row items-center justify-end gap-6">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full sm:w-auto bg-[#052E16] text-white px-8 md:px-12 py-4 md:py-6 rounded-xl md:rounded-[32px] font-black text-[10px] md:text-xs uppercase tracking-widest shadow-2xl shadow-emerald-900/40 hover:bg-emerald-800 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {saving ? <Loader2 className="animate-spin w-5 h-5" /> : <><ShieldCheck size={20} className="text-lime-400" /> Sauvegarder</>}
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="lg:col-span-4 space-y-8 md:space-y-10">
            <div className="bg-[#052E16] text-white rounded-[32px] md:rounded-[48px] p-8 md:p-10 shadow-2xl shadow-emerald-900/10">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-6 md:mb-8">
                <Zap className="w-6 h-6 md:w-8 md:h-8 text-lime-400" />
              </div>
              <h3 className="text-2xl md:text-3xl font-black tracking-tighter mb-4">Urgence Biométrique.</h3>
              <p className="text-xs md:text-sm font-medium opacity-60 leading-relaxed mb-6 md:mb-8">
                Les alertes critiques (gel, sécheresse extrême, nuisibles détectés) contourneront vos réglages standards pour être délivrées instantanément par tous les canaux actifs.
              </p>
              <div className="p-4 bg-white/5 rounded-xl md:rounded-2xl border border-white/10">
                <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-lime-400/60">Service Elite Actif</p>
              </div>
            </div>

            <div className="bg-white/40 backdrop-blur-md rounded-[32px] md:rounded-[40px] p-6 md:p-8 border border-emerald-50">
              <h4 className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-[#052E16]/30 mb-6">Fréquence des Recommandations</h4>

              <div className="space-y-3">
                {[
                  { id: 'hebdo', label: 'Hebdomadaire' },
                  { id: 'mensuel', label: 'Mensuel' },
                  { id: 'trimestriel', label: 'Trimestriel' },
                  { id: 'none', label: 'Désactivé' }
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setFrequency(opt.id as Frequency)}
                    className={`w-full py-4 px-6 rounded-2xl flex items-center justify-between group transition-all duration-300 border ${frequency === opt.id
                      ? 'bg-[#052E16] text-white border-[#052E16] shadow-lg shadow-emerald-900/20 transform scale-[1.02]'
                      : 'bg-white text-[#052E16] border-emerald-50 hover:bg-emerald-50 hover:border-emerald-100'
                      }`}
                  >
                    <span className={`font-black tracking-tight ${frequency === opt.id ? 'opacity-100' : 'opacity-60 group-hover:opacity-80'}`}>
                      {opt.label}
                    </span>
                    {frequency === opt.id && (
                      <CheckCircle className="w-5 h-5 text-lime-400" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}