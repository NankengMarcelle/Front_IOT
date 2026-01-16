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
  Settings,
  Calendar,
  MapPin,
  Building
} from "lucide-react";
import DashboardHeader from '@/components/layout/Header';
import DashboardFooter from '@/components/layout/Footer';
import { UsersService } from "@/lib/services/UsersService";
import { AuthenticationService } from "@/lib/services/AuthenticationService";
import { useLanguageStore } from '@/store/useUserStore';
import { useTranslation } from '@/providers/TranslationProvider';
import Link from "next/link";

// Définir le type pour le rôle utilisateur
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
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const [userData, setUserData] = useState<UserProfile>({
    id: "",
    email: "",
    nom: "",
    prenom: "",
    role: undefined,
    phone: "",
    address: "",
    joinDate: "",
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
    const fetchProfile = async () => {
      try {
        const profile = await UsersService.getMyProfileApiV1UsersMeGet();
        const formattedDate = profile.created_at 
          ? new Date(profile.created_at).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })
          : "";
        
        // Correction du type pour role
        const roleString = profile.role ? String(profile.role) : "";
        
        setUserData(prev => ({
          ...prev,
          id: profile.id,
          email: profile.email,
          nom: profile.nom || "",
          prenom: profile.prenom || "",
          role: roleString as UserRole,
          phone: profile.telephone || "",
          joinDate: formattedDate,
          langue: lang
        }));
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchProfile();
  }, [lang]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const errors = {
      nom: "",
      prenom: "",
      phone: "",
      password: "",
      confirmPassword: ""
    };
    let isValid = true;

    if (!userData.nom.trim()) {
      errors.nom = "Le nom est requis";
      isValid = false;
    }

    if (!userData.prenom.trim()) {
      errors.prenom = "Le prénom est requis";
      isValid = false;
    }

    if (userData.phone && !/^[+]?[\d\s-]{10,}$/.test(userData.phone)) {
      errors.phone = "Numéro de téléphone invalide";
      isValid = false;
    }

    if (userData.password) {
      if (userData.password.length < 8) {
        errors.password = "Le mot de passe doit contenir au moins 8 caractères";
        isValid = false;
      }
      if (userData.password !== userData.confirmPassword) {
        errors.confirmPassword = "Les mots de passe ne correspondent pas";
        isValid = false;
      }
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Mettre à jour le profil
      await UsersService.updateMyProfileApiV1UsersMePut({
        nom: userData.nom.trim(),
        prenom: userData.prenom.trim(),
        telephone: userData.phone.trim()
      });

      // Mettre à jour le mot de passe si fourni
      if (userData.password) {
        await AuthenticationService.changePasswordApiV1AuthChangePasswordPost({
          new_password: userData.password,
          old_password: "" // À compléter avec un champ pour l'ancien mot de passe
        });
      }

      setIsEditing(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      
      // Réinitialiser les mots de passe
      setUserData(prev => ({ ...prev, password: "", confirmPassword: "" }));
    } catch (error: any) {
      alert(error.body?.detail || "Une erreur est survenue lors de l'enregistrement.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageChange = (newLang: "fr" | "en") => {
    setLang(newLang);
    setUserData(prev => ({ ...prev, langue: newLang }));
  };

  const ProfileField = ({ 
    label, 
    value, 
    icon: Icon,
    type = "text",
    required = false,
    error = "",
    ...props 
  }: any) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
        <Icon className="w-4 h-4" />
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        value={value}
        className={`w-full px-4 py-3 rounded-xl border ${error ? 'border-red-300' : 'border-gray-300'} 
          focus:ring-2 focus:ring-[#1B831B]/30 focus:border-[#1B831B] outline-none transition-all
          ${!isEditing && 'bg-gray-50 text-gray-600'}`}
        {...props}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
      <DashboardHeader />

      <main className="flex-grow py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Notification de succès */}
          {showSuccess && (
            <div className="fixed top-20 right-4 bg-gradient-to-r from-[#1B831B] to-[#146314] text-white px-4 py-3 rounded-lg shadow-xl flex items-center gap-2 z-50 animate-in fade-in slide-in-from-right-5">
              <CheckCircle2 className="w-5 h-5" />
              <span className="font-medium">Profil mis à jour avec succès !</span>
            </div>
          )}

          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Mon Profil</h1>
            <p className="text-gray-600">Gérez vos informations personnelles et vos préférences</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Colonne de gauche - Vue d'ensemble */}
            <div className="space-y-6">
              {/* Carte profil */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <div className="relative mb-6">
                  <div className="w-24 h-24 mx-auto rounded-full border-4 border-white shadow-lg bg-gradient-to-br from-[#1B831B] to-[#146314] flex items-center justify-center text-3xl font-bold text-white">
                    {avatarPreview ? (
                      <img 
                        src={avatarPreview} 
                        alt="Avatar" 
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      (userData.nom?.charAt(0) || userData.prenom?.charAt(0) || "U").toUpperCase()
                    )}
                  </div>
                  {isEditing && (
                    <label className="absolute bottom-0 right-1/2 translate-x-1/2 bg-white p-2 rounded-full border-2 border-[#1B831B] cursor-pointer shadow-md hover:bg-gray-50 transition-colors">
                      <Camera className="w-4 h-4 text-[#1B831B]" />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarChange}
                      />
                    </label>
                  )}
                </div>

                <div className="text-center space-y-3">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {userData.prenom} {userData.nom}
                    </h2>
                    <p className="text-[#1B831B] text-sm font-medium">
                      {userData.role || "Utilisateur"}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-center gap-2 text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">{userData.email}</span>
                  </div>

                  {userData.phone && (
                    <div className="flex items-center justify-center gap-2 text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span className="text-sm">{userData.phone}</span>
                    </div>
                  )}
                </div>

                <div className="mt-6 space-y-3">
                  {isEditing ? (
                    <>
                      <button
                        onClick={handleSave}
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-[#1B831B] to-[#146314] hover:from-[#146314] hover:to-[#1B831B] text-white py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                            Sauvegarde...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4" />
                            Sauvegarder les modifications
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          setFormErrors({ nom: "", prenom: "", phone: "", password: "", confirmPassword: "" });
                        }}
                        className="w-full border border-gray-300 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                      >
                        <X className="w-4 h-4" />
                        Annuler
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="w-full bg-gradient-to-r from-[#1B831B] to-[#146314] hover:from-[#146314] hover:to-[#1B831B] text-white py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <User className="w-4 h-4" />
                      Modifier le profil
                    </button>
                  )}
                </div>
              </div>

              {/* Statistiques rapides */}
              <div className="bg-gradient-to-br from-[#1B831B] to-[#146314] rounded-2xl p-6 text-white">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Informations
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-green-100 text-sm">Membre depuis</p>
                    <p className="font-medium">{userData.joinDate || "Date non disponible"}</p>
                  </div>
                </div>
              </div>

              {/* Lien vers paramètres de notification */}
              <Link 
                href="/dashboard/parametres"
                className="block bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:border-[#1B831B]/30 hover:shadow-md transition-all duration-200 group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#1B831B]/10 rounded-lg group-hover:bg-[#1B831B]/20 transition-colors">
                    <Bell className="w-5 h-5 text-[#1B831B]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Paramètres de notification</h3>
                    <p className="text-sm text-gray-600">Configurez SMS, Email, WhatsApp</p>
                  </div>
                </div>
              </Link>
            </div>

            {/* Colonne principale - Formulaire */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                {/* En-tête avec onglets */}
                <div className="border-b border-gray-200">
                  <div className="flex">
                    <button
                      onClick={() => setActiveTab('profile')}
                      className={`flex-1 py-4 px-6 text-center font-medium ${activeTab === 'profile'
                        ? 'border-b-2 border-[#1B831B] text-[#1B831B] bg-[#1B831B]/10'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      } transition-colors`}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <User className="w-4 h-4" />
                        Informations personnelles
                      </div>
                    </button>
                    <button
                      onClick={() => setActiveTab('security')}
                      className={`flex-1 py-4 px-6 text-center font-medium ${activeTab === 'security'
                        ? 'border-b-2 border-[#1B831B] text-[#1B831B] bg-[#1B831B]/10'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      } transition-colors`}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <Shield className="w-4 h-4" />
                        Sécurité
                      </div>
                    </button>
                  </div>
                </div>

                {/* Contenu des onglets */}
                <div className="p-6 lg:p-8">
                  {activeTab === 'profile' && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Détails du compte</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <ProfileField
                            label="Nom"
                            value={userData.nom}
                            icon={User}
                            required
                            disabled={!isEditing}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                              setUserData({ ...userData, nom: e.target.value })
                            }
                            error={formErrors.nom}
                          />
                          <ProfileField
                            label="Prénom"
                            value={userData.prenom}
                            icon={User}
                            required
                            disabled={!isEditing}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                              setUserData({ ...userData, prenom: e.target.value })
                            }
                            error={formErrors.prenom}
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                          <ProfileField
                            label="Email"
                            value={userData.email}
                            icon={Mail}
                            disabled
                            readOnly
                          />
                          <ProfileField
                            label="Téléphone"
                            value={userData.phone}
                            icon={Phone}
                            disabled={!isEditing}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                              setUserData({ ...userData, phone: e.target.value })
                            }
                            placeholder="+33 6 12 34 56 78"
                            error={formErrors.phone}
                          />
                        </div>
                      </div>

                      <div className="pt-6 border-t border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Langue</h3>
                        <div className="flex flex-wrap gap-3">
                          {[
                            { value: 'fr', label: 'Français', flag: '🇫🇷' },
                            { value: 'en', label: 'English', flag: '🇺🇸' }
                          ].map((option) => (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() => handleLanguageChange(option.value as "fr" | "en")}
                              className={`flex items-center gap-2 px-4 py-3 rounded-lg border ${lang === option.value
                                ? 'border-[#1B831B] bg-[#1B831B]/10 text-[#1B831B]'
                                : 'border-gray-300 hover:border-[#1B831B]/30 hover:bg-gray-50'
                              } transition-colors`}
                            >
                              <span className="text-lg">{option.flag}</span>
                              <span className="font-medium">{option.label}</span>
                              {lang === option.value && (
                                <Check className="w-4 h-4 text-[#1B831B]" />
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'security' && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Changer le mot de passe</h3>
                        <p className="text-gray-600 mb-6">
                          Assurez-vous d'utiliser un mot de passe long et aléatoire pour rester en sécurité.
                        </p>
                        
                        <div className="space-y-4">
                          <div className="relative">
                            <ProfileField
                              label="Nouveau mot de passe"
                              value={userData.password}
                              icon={Lock}
                              type={showPass ? "text" : "password"}
                              disabled={!isEditing}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                                setUserData({ ...userData, password: e.target.value })
                              }
                              error={formErrors.password}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPass(!showPass)}
                              className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                            >
                              {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>

                          <div>
                            <ProfileField
                              label="Confirmer le mot de passe"
                              value={userData.confirmPassword}
                              icon={Lock}
                              type={showPass ? "text" : "password"}
                              disabled={!isEditing}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                                setUserData({ ...userData, confirmPassword: e.target.value })
                              }
                              error={formErrors.confirmPassword}
                            />
                          </div>

                          {userData.password && (
                            <div className="mt-2">
                              <div className="flex items-center gap-2 mb-1">
                                <div className={`h-1 flex-1 rounded-full ${userData.password.length >= 8 ? 'bg-[#1B831B]' : 'bg-gray-200'}`}></div>
                                <div className={`h-1 flex-1 rounded-full ${/[A-Z]/.test(userData.password) ? 'bg-[#1B831B]' : 'bg-gray-200'}`}></div>
                                <div className={`h-1 flex-1 rounded-full ${/[0-9]/.test(userData.password) ? 'bg-[#1B831B]' : 'bg-gray-200'}`}></div>
                                <div className={`h-1 flex-1 rounded-full ${/[^A-Za-z0-9]/.test(userData.password) ? 'bg-[#1B831B]' : 'bg-gray-200'}`}></div>
                              </div>
                              <p className="text-xs text-gray-500">
                                Le mot de passe doit contenir au moins 8 caractères, une majuscule, un chiffre et un caractère spécial
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="pt-6 border-t border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Sécurité du compte</h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                              <p className="font-medium text-gray-900">Sessions actives</p>
                              <p className="text-sm text-gray-600">Gérez vos sessions connectées</p>
                            </div>
                            <button className="text-sm text-[#1B831B] hover:text-[#146314] font-medium">
                              Voir toutes
                            </button>
                          </div>
                          
                          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                              <p className="font-medium text-gray-900">Authentification à deux facteurs</p>
                              <p className="text-sm text-gray-600">Ajoutez une couche de sécurité supplémentaire</p>
                            </div>
                            <button className="text-sm text-[#1B831B] hover:text-[#146314] font-medium">
                              Activer
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Conseils de sécurité */}
              {isEditing && (
                <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-blue-800 mb-1">Conseils de sécurité</p>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Votre mot de passe doit être unique et différent des autres comptes</li>
                        <li>• Évitez d'utiliser des informations personnelles facilement devinables</li>
                        <li>• Changez régulièrement votre mot de passe</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <DashboardFooter />
    </div>
  );
}