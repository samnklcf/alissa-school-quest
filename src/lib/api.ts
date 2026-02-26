import axios from 'axios';

const API_BASE = 'https://sigfi.alissa-ia.ga/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const { data } = await axios.post(`${API_BASE}/auth/refresh`, { refreshToken });
          localStorage.setItem('access_token', data.tokens.accessToken);
          localStorage.setItem('refresh_token', data.tokens.refreshToken);
          originalRequest.headers.Authorization = `Bearer ${data.tokens.accessToken}`;
          return api(originalRequest);
        } catch {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/welcome';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;

export const authAPI = {
  register: (data: any) => api.post('/auth/register', data),
  login: (data: { username: string; password: string }) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  onboarding: (data: { matieres_ids: string[]; langue_gabonaise?: string }) => api.post('/auth/onboarding', data),
};

export const eleveAPI = {
  profile: () => api.get('/eleve/profile'),
  updateProfile: (data: any) => api.put('/eleve/profile', data),
  dashboard: () => api.get('/eleve/dashboard'),
  recommendations: () => api.get('/eleve/recommendations'),
  badges: () => api.get('/eleve/badges'),
};

export const matieresAPI = {
  list: (serie: string) => api.get(`/matieres?serie=${serie}`),
  etablissements: () => api.get('/matieres/etablissements'),
  ressources: (matiereId: string) => api.get(`/matieres/ressources?matiere_id=${matiereId}`),
};

export const coursAPI = {
  create: (data: { titre: string; matiere_id: string }) => api.post('/cours', data),
  list: (matiereId: string, page = 1) => api.get(`/cours?matiere_id=${matiereId}&page=${page}&limit=10`),
  get: (id: string) => api.get(`/cours/${id}`),
};

export const quizAPI = {
  list: (params?: any) => api.get('/quiz', { params }),
  get: (id: string) => api.get(`/quiz/${id}`),
  submit: (id: string, reponses: number[]) => api.post(`/quiz/${id}/submit`, { reponses }),
  history: () => api.get('/quiz/history/all'),
};

export const assistantAPI = {
  quota: () => api.get('/assistant/quota'),
  chat: (data: { message: string; matiere_id?: string; history: any[] }) => api.post('/assistant/chat', data),
  history: (matiereId?: string) => api.get(`/assistant/history${matiereId ? `?matiere_id=${matiereId}` : ''}`),
  clearHistory: (matiereId?: string) => api.delete(`/assistant/history${matiereId ? `?matiere_id=${matiereId}` : ''}`),
};
