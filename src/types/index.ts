export interface User {
  id: string;
  nom: string;
  prenom: string;
  username: string;
  serie: string;
  etablissement_id: string;
  etablissement_nom?: string;
  telephone?: string;
  langue_gabonaise?: string;
  points_global: number;
  niveau_global: number;
  onboarding_completed: boolean;
  created_at?: string;
  badges_count?: number;
  matieres?: Matiere[];
}

export interface Matiere {
  id: string;
  nom: string;
  type: 'obligatoire_commune' | 'serie' | 'optionnelle';
  icon?: string;
  points?: number;
  niveau?: number;
  xp_current?: number;
  xp_next?: number;
  moyenne?: number;
  quiz_count?: number;
  last_quiz_score?: number;
}

export interface DashboardData {
  eleve: {
    prenom: string;
    serie: string;
    points_global: number;
    niveau_global: number;
  };
  quiz_en_attente: number;
  matieres: Matiere[];
  badges_recents: Badge[];
  videos_recentes: Video[];
}

export interface Badge {
  id: string;
  nom: string;
  description: string;
  icon: string;
  obtained: boolean;
  obtained_at?: string;
  condition?: string;
}

export interface Video {
  id?: string;
  youtube_id: string;
  titre: string;
  miniature: string;
  duree: string;
  vues: string;
}

export interface Course {
  id: string;
  titre: string;
  contenu: string;
  quiz_generated: boolean;
  quiz_id?: string;
  videos: Video[];
  created_at: string;
}

export interface Quiz {
  id: string;
  titre: string;
  source: 'cours' | 'admin' | 'mensuel';
  matiere_id: string;
  matiere_nom?: string;
  status: 'pending' | 'done';
  score?: number;
  total?: number;
  points_gagnes?: number;
  created_at: string;
  done_at?: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correct_answer?: number;
}

export interface QuizResult {
  score: number;
  total: number;
  points_gagnes: number;
  pourcentage: number;
  reponses_detaillees: any[];
  points_update: {
    newMatierePoints: number;
    newNiveau: number;
    newGlobalPoints: number;
  };
  nouveaux_badges: Badge[];
}

export interface Etablissement {
  id: string;
  nom: string;
  ville?: string;
}

export interface Resource {
  id: string;
  titre: string;
  type: string;
  url: string;
  status?: 'nouveau' | 'non_lu' | 'lu';
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface Quota {
  messages_used: number;
  messages_remaining: number;
  daily_limit: number;
  reset_at: string;
}
