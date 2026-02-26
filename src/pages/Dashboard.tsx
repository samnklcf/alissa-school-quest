import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { eleveAPI } from '@/lib/api';
import { DashboardData } from '@/types';

const Dashboard = () => {
  const navigate = useNavigate();
  const { data: dashData, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => eleveAPI.dashboard().then(r => r.data.data || r.data),
  });
  const { data: reco } = useQuery({
    queryKey: ['recommendations'],
    queryFn: () => eleveAPI.recommendations().then(r => r.data.data || r.data),
  });

  const d = dashData as DashboardData | undefined;
  const hour = new Date().getHours();
  const greeting = hour < 18 ? 'Bonjour' : 'Bonsoir';

  if (isLoading) {
    return (
      <div className="px-4 py-4 space-y-4">
        {[1,2,3,4].map(i => <div key={i} className="h-32 bg-card rounded-2xl animate-pulse" />)}
      </div>
    );
  }

  const xpForLevel = 200;
  const xpCurrent = d ? d.eleve.points_global % xpForLevel : 0;
  const nextLevel = d ? d.eleve.niveau_global + 1 : 2;

  return (
    <div className="pb-4">
      {/* Header greeting */}
      <div className="bg-card px-4 py-5 flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm text-muted-foreground">{greeting}</p>
          <h1 className="font-gaming text-[22px] text-foreground truncate">{d?.eleve.prenom || 'Élève'}</h1>
          {reco?.message_motivation && (
            <p className="text-[13px] text-muted-foreground italic truncate mt-1">{reco.message_motivation}</p>
          )}
        </div>
        <i className="fa-solid fa-hand text-accent text-[28px] animate-pulse-slow" />
      </div>

      {/* Player card */}
      <div className="px-4 mt-4">
        <div className="bg-card rounded-2xl p-5">
          <div className="flex gap-2 mb-4">
            <span className="font-gaming text-xs bg-secondary text-secondary-foreground px-3 py-1 rounded-full">Série {d?.eleve.serie}</span>
            <span className="font-gaming text-xs bg-amber-50 text-accent px-3 py-1 rounded-full">LV {d?.eleve.niveau_global}</span>
          </div>
          <p className="text-xs text-muted-foreground">Points Global</p>
          <p className="font-gaming text-lg text-foreground">{d?.eleve.points_global || 0}</p>
          <div className="h-2 bg-border rounded-full mt-2 overflow-hidden">
            <div className="h-full bg-accent rounded-full transition-all" style={{ width: `${(xpCurrent / xpForLevel) * 100}%` }} />
          </div>
          <p className="text-[11px] text-inactive mt-1">{xpCurrent} / {xpForLevel} XP pour LV {nextLevel}</p>
          <div className="border-t border-border mt-4 pt-3 flex items-center gap-3">
            <i className="fa-solid fa-crosshairs text-primary text-sm" />
            <p className="text-[13px] text-text-dark flex-1 truncate">{reco?.defi_du_jour || 'Complète un quiz aujourd\'hui !'}</p>
            <button onClick={() => navigate('/subjects')} className="bg-primary text-primary-foreground text-xs px-3 py-1.5 rounded-lg flex items-center gap-1">
              Aller <i className="fa-solid fa-arrow-right text-[10px]" />
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="px-4 mt-6">
        <div className="flex items-center gap-2 mb-3">
          <h2 className="font-gaming text-base text-foreground">Mes Stats</h2>
          <div className="w-8 h-[3px] bg-accent rounded-full" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: 'fa-book-open', bg: 'bg-secondary', color: 'text-primary', value: d?.matieres?.length || 0, label: 'Matières' },
            { icon: 'fa-trophy', bg: 'bg-amber-50', color: 'text-accent', value: d?.badges_recents?.length || 0, label: 'Badges' },
            { icon: 'fa-circle-question', bg: 'bg-orange-50', color: 'text-warning', value: d?.quiz_en_attente || 0, label: 'En attente' },
            { icon: 'fa-star', bg: 'bg-emerald-50', color: 'text-success', value: d?.eleve.niveau_global || 1, label: 'Niveau' },
          ].map((s, i) => (
            <div key={i} className="bg-card rounded-xl p-4">
              <div className={`w-10 h-10 ${s.bg} rounded-[10px] flex items-center justify-center mb-2`}>
                <i className={`fa-solid ${s.icon} ${s.color} text-xl`} />
              </div>
              <p className="font-gaming text-[22px] text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Matières horizontal scroll */}
      {d?.matieres && d.matieres.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center justify-between px-4 mb-3">
            <div className="flex items-center gap-2">
              <h2 className="font-gaming text-base text-foreground">Mes Matières</h2>
              <div className="w-8 h-[3px] bg-accent rounded-full" />
            </div>
            <button onClick={() => navigate('/subjects')} className="text-xs text-primary flex items-center gap-1">
              Voir tout <i className="fa-solid fa-arrow-right text-[10px]" />
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide px-4 snap-x snap-mandatory">
            {d.matieres.map((m) => (
              <button key={m.id} onClick={() => navigate(`/subject/${m.id}`)}
                className="min-w-[200px] bg-card rounded-[14px] p-4 snap-start text-left">
                <div className="w-9 h-9 bg-secondary rounded-lg flex items-center justify-center mb-2">
                  <i className="fa-solid fa-book-open text-primary text-sm" />
                </div>
                <p className="text-sm font-semibold text-foreground truncate">{m.nom}</p>
                <span className="font-gaming text-[10px] text-accent bg-amber-50 px-2 py-0.5 rounded-full mt-1 inline-block">LV {m.niveau || 1}</span>
                <div className="h-1.5 bg-border rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${((m.points || 0) / 200) * 100}%` }} />
                </div>
                <p className="text-[11px] text-inactive mt-1">{m.points || 0} XP</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Recent badges */}
      {d?.badges_recents && d.badges_recents.length > 0 && (
        <div className="px-4 mt-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <h2 className="font-gaming text-base text-foreground">Derniers Succès</h2>
              <div className="w-8 h-[3px] bg-accent rounded-full" />
            </div>
            <button onClick={() => navigate('/achievements')} className="text-xs text-primary">Voir tout</button>
          </div>
          <div className="space-y-2">
            {d.badges_recents.slice(0, 3).map((b, i) => (
              <div key={i} className="bg-card rounded-xl p-3 px-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-50 rounded-[10px] flex items-center justify-center glow-gold">
                  <i className="fa-solid fa-medal text-accent text-lg" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{b.nom}</p>
                  <p className="text-xs text-muted-foreground truncate">{b.description}</p>
                </div>
                <span className="text-[11px] text-inactive shrink-0">
                  {b.obtained_at ? new Date(b.obtained_at).toLocaleDateString('fr') : ''}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
