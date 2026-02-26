import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { quizAPI, eleveAPI } from '@/lib/api';
import { Quiz } from '@/types';

const tabs = [
  { key: 'pending', label: 'En attente', icon: 'fa-clock' },
  { key: 'done', label: 'Terminés', icon: 'fa-circle-check' },
  { key: 'history', label: 'Historique', icon: 'fa-chart-bar' },
];

const sourceFilters = [
  { key: 'all', label: 'Tous' },
  { key: 'cours', label: 'Cours', icon: 'fa-brain' },
  { key: 'admin', label: 'Admin', icon: 'fa-user-shield' },
  { key: 'mensuel', label: 'Mensuel', icon: 'fa-calendar' },
];

const QuizList = () => {
  const { matiereId } = useParams();
  const navigate = useNavigate();
  const [tab, setTab] = useState('pending');
  const [sourceFilter, setSourceFilter] = useState('all');

  const { data: profile } = useQuery({ queryKey: ['profile'], queryFn: () => eleveAPI.profile().then(r => r.data.data || r.data) });
  const matiere = matiereId ? profile?.matieres?.find((m: any) => m.id === matiereId) : null;

  const { data: quizzes, isLoading } = useQuery({
    queryKey: ['quizList', tab, matiereId, sourceFilter],
    queryFn: () => {
      if (tab === 'history') return quizAPI.history().then(r => r.data.data || r.data || []);
      const params: any = { status: tab };
      if (matiereId) params.matiere_id = matiereId;
      if (sourceFilter !== 'all') params.source = sourceFilter;
      return quizAPI.list(params).then(r => r.data.data || r.data || []);
    },
  });

  const list: Quiz[] = Array.isArray(quizzes) ? quizzes : [];

  return (
    <div className="min-h-dvh bg-background">
      <div className="flex items-center gap-3 px-4 py-4">
        <button onClick={() => navigate(-1)} className="text-inactive"><i className="fa-solid fa-arrow-left" /></button>
        <h1 className="font-gaming text-lg text-foreground">Mes Quizzes</h1>
        {matiere && <span className="font-gaming text-[11px] bg-secondary text-secondary-foreground px-2 py-1 rounded-full">{matiere.nom}</span>}
      </div>

      <div className="flex border-b border-border mx-4 mb-4">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`flex-1 py-3 text-xs font-semibold flex items-center justify-center gap-1.5 border-b-2 transition-colors ${tab === t.key ? 'border-primary text-primary' : 'border-transparent text-inactive'}`}>
            <i className={`fa-solid ${t.icon}`} /> {t.label}
          </button>
        ))}
      </div>

      {tab === 'pending' && (
        <div className="flex gap-2 overflow-x-auto scrollbar-hide px-4 mb-4">
          {sourceFilters.map(f => (
            <button key={f.key} onClick={() => setSourceFilter(f.key)}
              className={`shrink-0 text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 ${sourceFilter === f.key ? 'bg-primary text-primary-foreground' : 'bg-card border border-border text-muted-foreground'}`}>
              {f.icon && <i className={`fa-solid ${f.icon}`} />} {f.label}
            </button>
          ))}
        </div>
      )}

      <div className="px-4">
        {isLoading ? (
          <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-20 bg-card rounded-xl animate-pulse" />)}</div>
        ) : list.length === 0 ? (
          <div className="text-center py-16">
            <i className="fa-solid fa-circle-question text-dots-inactive text-6xl mb-4" />
            <h2 className="font-gaming text-base text-foreground mb-2">Aucun quiz</h2>
            <p className="text-sm text-muted-foreground">{tab === 'pending' ? 'Génère un cours pour obtenir un quiz !' : "Tu n'as pas encore terminé de quiz."}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {list.map(q => {
              const pct = q.score != null ? (q.score / (q.total || 10)) * 100 : -1;
              const borderColor = tab === 'pending' ? 'border-l-primary' : pct >= 70 ? 'border-l-success' : pct >= 50 ? 'border-l-warning' : 'border-l-destructive';
              return (
                <button key={q.id} onClick={() => tab === 'pending' ? navigate(`/quiz/${q.id}`) : null}
                  className={`w-full bg-card border-l-4 ${borderColor} rounded-xl p-4 flex items-center gap-3 text-left`}>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{q.titre}</p>
                    <div className="flex gap-2 mt-1">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-gaming ${
                        q.source === 'cours' ? 'bg-secondary text-secondary-foreground' : q.source === 'admin' ? 'bg-orange-50 text-warning' : 'bg-emerald-50 text-success'
                      }`}>{q.source?.toUpperCase()}</span>
                      {q.matiere_nom && <span className="text-[10px] text-inactive">{q.matiere_nom}</span>}
                    </div>
                  </div>
                  {tab === 'pending' ? (
                    <i className="fa-solid fa-play-circle text-primary text-2xl" />
                  ) : q.score != null ? (
                    <div className="text-right">
                      <p className="font-gaming text-base">{q.score}/{q.total || 10}</p>
                      {q.points_gagnes != null && (
                        <p className={`text-xs ${q.points_gagnes >= 0 ? 'text-success' : 'text-destructive'}`}>
                          {q.points_gagnes >= 0 ? '+' : ''}{q.points_gagnes}
                        </p>
                      )}
                    </div>
                  ) : null}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizList;
