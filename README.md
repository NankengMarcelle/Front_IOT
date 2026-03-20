# 🌱 SmartAgro - Agriculture de Précision Connectée

**SmartAgro** est une plateforme SaaS innovante conçue pour moderniser l'agriculture traditionnelle en la transformant en une science exacte. En combinant la puissance de l'**Internet des Objets (IoT)** et de l'**Intelligence Artificielle (IA)**, elle permet aux agriculteurs de maximiser leurs rendements tout en préservant les ressources naturelles.

---

## 🚀 Vision du Projet
L'agronomie ne doit plus être un art incertain. SmartAgro propose une infrastructure technologique qui scrute l'invisible (nutriments du sol, humidité, climat) pour offrir des **insights exploitables** et des **prédictions précises**.

- **Précision** : Apportez exactement ce que votre terre demande, au bon moment.
- **Anticipation** : Prévoyez les besoins de vos cultures grâce au Machine Learning.
- **Simplicité** : Gérez vos exploitations via une interface intuitive et responsive.

---

## ✨ Fonctionnalités Clés

### 📊 Tableau de Bord Intégré
- **Monitoring en Temps Réel** : Visualisation des niveaux d'Azote (N), Phosphore (P), Potassium (K) et pH.
- **Analyses Métriques** : Tendances climatiques (température, humidité) et santé du sol sur 6 mois.
- **Alertes Intelligentes** : Notifications en cas de forte chaleur, sol acide ou besoin d'irrigation.

### 🗺️ Gestion du Patrimoine Foncier
- **Gestion des Terrains** : Organisez vos sites d'exploitation par zones géographiques.
- **Segmentation en Parcelles** : Divisez vos terrains pour un suivi ultra-précis par unité de culture.

### 🤖 Intelligence Artificielle & IoT
- **Capteurs IoT LoRaWAN** : Intégration de capteurs de pointe pour des relevés constants sans fil.
- **Assistant IA (Random Forest)** : Recommandations de cultures basées sur la composition du sol et les flux météo.
- **Chat Expert IA** : Consultation interactive avec un agent intelligent pour des conseils agronomiques personnalisés.

### 🌍 Internationalisation (i18n)
- Support complet du **Français** et de l'**Anglais**.
- Interface responsive optimisée pour mobile, tablette et desktop.

---

## 🛠️ Pile Technologique

- **Frontend** : [Next.js](https://nextjs.org/) (App Router), [React](https://react.dev/), [Typescript](https://www.typescriptlang.org/).
- **Styling** : [Tailwind CSS](https://tailwindcss.com/) pour un design premium et adaptatif.
- **Gestion d'État** : [Zustand](https://github.com/pmndrs/zustand).
- **Visualisation** : [Recharts](https://recharts.org/) pour des graphiques dynamiques.
- **Icônes** : [Lucide React](https://lucide.dev/).
- **Composants UI** : [NextUI](https://nextui.org/) & [Headless UI](https://headlessui.com/).

---

## ⚙️ Configuration & Installation

### Prérequis
- Node.js (v18+)
- NPM, Yarn, PNPM ou Bun

### 1. Clonage et Installation
```bash
git clone <repository-url>
cd Front_IOT
npm install
```

### 2. Variables d'Environnement
Créez un fichier `.env` à la racine et configurez les services backend :
```env
NEXT_PUBLIC_API_URL=https://votre-api-iot.com
NEXT_PUBLIC_PREDICTION_API_URL=https://votre-api-ia.com
NEXT_PUBLIC_EXPERT_SYSTEM_API_URL=https://votre-systeme-expert.com
```

### 3. Lancement
```bash
# Développement
npm run dev

# Construction Production
npm run build
npm run start
```

---

## 📐 Architecture Simplifiée
```
src/
├── app/              # Routes et Pages (Dashboard, Login, Profil, etc.)
├── components/       # Composants réutilisables (Layout, UI, Forms)
├── features/         # Logique métier découpée par domaines (Auth, Parcels, IoT)
├── lib/              # Services API et utilitaires
├── providers/        # Context Providers (Translation, Auth)
└── store/            # État global (Zustand)
```

---

## 👥 Auteurs & Licence
Développé par l'équipe **Elite Intelligence** pour **SmartAgro**.
© 2026 SmartAgro – Tous droits réservés.
