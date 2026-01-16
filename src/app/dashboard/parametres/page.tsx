'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Settings, 
  Mail, 
  MessageSquare, 
  Bell, 
  CheckCircle,
  Smartphone,
  Send
} from 'lucide-react';
import DashboardHeader from '@/components/layout/Header';
import DashboardFooter from '@/components/layout/Footer';

// Type pour les méthodes de notification
type NotificationMethod = 'email' | 'sms' | 'whatsapp' | 'telegram';

interface NotificationSettings {
  email: boolean;
  sms: boolean;
  whatsapp: boolean;
  telegram: boolean;
  emailAddress?: string;
  phoneNumber?: string;
  telegramUsername?: string;
  whatsappNumber?: string;
}

export default function ParametresPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const [settings, setSettings] = useState<NotificationSettings>({
    email: true,
    sms: false,
    whatsapp: false,
    telegram: false,
    emailAddress: '',
    phoneNumber: '',
    telegramUsername: '',
    whatsappNumber: '',
  });

  // Charger les paramètres sauvegardés
  useEffect(() => {
    const loadSettings = () => {
      try {
        const saved = localStorage.getItem('notification_settings');
        if (saved) {
          setSettings(JSON.parse(saved));
        }
        // Simuler le chargement des données utilisateur
        const userEmail = localStorage.getItem('user_email');
        const userPhone = localStorage.getItem('user_phone');
        
        if (userEmail && !settings.emailAddress) {
          setSettings(prev => ({ ...prev, emailAddress: userEmail }));
        }
        if (userPhone && !settings.phoneNumber) {
          setSettings(prev => ({ ...prev, phoneNumber: userPhone }));
        }
      } catch (error) {
        console.error('Erreur lors du chargement des paramètres:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleMethodToggle = (method: NotificationMethod) => {
    setSettings(prev => ({
      ...prev,
      [method]: !prev[method]
    }));
  };

  const handleInputChange = (field: keyof NotificationSettings, value: string) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    setSaving(true);
    
    // Simuler une sauvegarde API
    setTimeout(() => {
      try {
        localStorage.setItem('notification_settings', JSON.stringify(settings));
        setSaveSuccess(true);
        
        // Cacher le message de succès après 3 secondes
        setTimeout(() => {
          setSaveSuccess(false);
        }, 3000);
      } catch (error) {
        console.error('Erreur lors de la sauvegarde:', error);
      } finally {
        setSaving(false);
      }
    }, 1000);
  };

  const notificationMethods = [
    {
      id: 'email' as NotificationMethod,
      name: 'Email',
      icon: Mail,
      description: 'Recevez les recommandations par email',
      requiredField: 'emailAddress',
      fieldLabel: 'Adresse email',
      fieldPlaceholder: 'votre@email.com',
    },
    {
      id: 'sms' as NotificationMethod,
      name: 'SMS',
      icon: MessageSquare,
      description: 'Recevez les recommandations par SMS',
      requiredField: 'phoneNumber',
      fieldLabel: 'Numéro de téléphone',
      fieldPlaceholder: '+33 6 12 34 56 78',
    },
    {
      id: 'whatsapp' as NotificationMethod,
      name: 'WhatsApp',
      icon: Smartphone,
      description: 'Recevez les recommandations sur WhatsApp',
      requiredField: 'whatsappNumber',
      fieldLabel: 'Numéro WhatsApp',
      fieldPlaceholder: '+33 6 12 34 56 78',
    },
    {
      id: 'telegram' as NotificationMethod,
      name: 'Telegram',
      icon: Send,
      description: 'Recevez les recommandations sur Telegram',
      requiredField: 'telegramUsername',
      fieldLabel: 'Nom d\'utilisateur Telegram',
      fieldPlaceholder: '@votre_nom',
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des paramètres...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <DashboardHeader />
      
      <main className="flex-1 py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Header de la page */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <Settings className="w-6 h-6 text-green-600" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Paramètres</h1>
          </div>
          <p className="text-gray-600">
            Gérez vos préférences de notification pour les recommandations agricoles
          </p>
        </div>

        {/* Carte des paramètres */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Bell className="w-6 h-6 text-green-600" />
            <h2 className="text-xl font-semibold text-gray-900">Préférences de notification</h2>
          </div>

          <p className="text-gray-600 mb-8">
            Choisissez comment vous souhaitez recevoir les recommandations agricoles, alertes météo et notifications importantes.
          </p>

          {/* Méthodes de notification */}
          <div className="space-y-6">
            {notificationMethods.map((method) => {
              const Icon = method.icon;
              const isActive = settings[method.id];
              const fieldValue = settings[method.requiredField as keyof NotificationSettings] as string;

              return (
                <div key={method.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${isActive ? 'bg-green-100' : 'bg-gray-100'}`}>
                        <Icon className={`w-5 h-5 ${isActive ? 'text-green-600' : 'text-gray-400'}`} />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{method.name}</h3>
                        <p className="text-sm text-gray-600">{method.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {/* Champ de saisie conditionnel */}
                      {isActive && (
                        <div className="flex-1 min-w-0">
                          <input
                            type="text"
                            value={fieldValue || ''}
                            onChange={(e) => handleInputChange(method.requiredField as keyof NotificationSettings, e.target.value)}
                            placeholder={method.fieldPlaceholder}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                          />
                        </div>
                      )}
                      
                      {/* Toggle switch */}
                      <button
                        onClick={() => handleMethodToggle(method.id)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isActive ? 'bg-green-600' : 'bg-gray-300'}`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isActive ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Note d'information */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              <strong>Note :</strong> Les recommandations incluent les alertes météo, conseils d'irrigation, 
              suggestions de fertilisation et notifications importantes pour vos parcelles.
            </p>
          </div>

          {/* Bouton de sauvegarde */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-end items-center">
            {saveSuccess && (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm font-medium">Paramètres sauvegardés avec succès !</span>
              </div>
            )}
            
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 min-w-[150px] justify-center"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Sauvegarde...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Sauvegarder les paramètres
                </>
              )}
            </button>
          </div>
        </div>

        {/* Section d'information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="font-semibold text-gray-900 mb-3">À propos des notifications</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5"></div>
                <span>Les notifications sont envoyées quotidiennement à 8h</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5"></div>
                <span>Vous recevrez des alertes urgentes immédiatement</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5"></div>
                <span>Vous pouvez désactiver temporairement les notifications</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="font-semibold text-gray-900 mb-3">Support technique</h3>
            <p className="text-sm text-gray-600 mb-3">
              Si vous rencontrez des problèmes avec les notifications, contactez notre support.
            </p>
            <button className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center gap-1">
              <MessageSquare className="w-4 h-4" />
              Contacter le support
            </button>
          </div>
        </div>
      </main>
      
      <DashboardFooter />
    </div>
  );
}