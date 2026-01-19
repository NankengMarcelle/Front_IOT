export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  MANAGER = 'manager',
  VIEWER = 'viewer',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  PENDING = 'pending',
}

export enum TypeSol {
  ARGILEUX = 'argileux',
  SABLEUX = 'sableux',
  LIMONEUX = 'limoneux',
  HUMIF_RE = 'humifère',
  CALCAIRE = 'calcaire',
  TOURBEUX = 'tourbeux',
  NON_SP_CIFI_ = 'Non spécifié',
}

export enum StatutParcelle {
  ACTIVE = 'active',
  EN_CULTURE = 'en_culture',
  EN_JACH_RE = 'en_jachère',
  EN_PR_PARATION = 'en_préparation',
  R_COLTE_EN_COURS = 'récolte_en_cours',
}

export enum StatutTerrain {
  ACTIF = 'actif',
  EN_JACH_RE = 'en_jachère',
  EN_PR_PARATION = 'en_préparation',
  ABANDONN_ = 'abandonné',
}

export enum TypeTerrain {
  AGRICOLE = 'agricole',
  PASTORAL = 'pastoral',
  MIXTE = 'mixte',
  EXPERIMENTAL = 'experimental',
}

export type User = {
  id: string;
  email: string;
  name: string;
  role: UserRole | "ADMIN" | "AGRICULTEUR" | "UTILISATEUR";
  phone?: string;
  isActive: boolean;
  status?: UserStatus;
  createdAt: string; // ISO date
  updatedAt?: string;
  langue?: "fr" | "en";
};

export type Parcelle = {
  id: number | string;
  nom: string;
  superficie: number;
  terrainId: number | string;
  code: string;
  azote: number;
  phosphore: number;
  potassium: number;
  humidite: number;
  temperature: number;
  ph: number;
  culturePredite: string;
  description?: string;
  hasMeasurements?: boolean;
  capteursListe?: string;
};

export type Prediction = {
  N: number;
  P: number;
  K: number;
  Ph: number;
  Humidity: number;
  Temperature: number
};

export type Recommendation = {
  response: string;
};

export type Sensor = {
  id: number | string;
  parcelleId?: number | string;
  nom: string;
  typeMesure?: string;
}

export type Terrain = {
  id: number | string;
  nom: string;
  superficie: number;
  pays?: string;
  ville?: string;
  quartier?: string;
  type_terrain?: TypeTerrain;
  statut?: StatutTerrain;
  description?: string;
  superficie_totale?: number;
  localite_id?: string;
  perimetre?: number;
  pente?: number;
  date_acquisition?: string;
  nombre_parcelles?: number;
  created_at?: string;
};

export type langue = "fr" | "en";
export type Role = "ADMIN" | "AGRICULTEUR" | "UTILISATEUR";