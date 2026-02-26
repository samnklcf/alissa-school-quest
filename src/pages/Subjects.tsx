import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { eleveAPI } from '@/lib/api';

const Subjects = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: () => eleveAPI.profile().then(r => r.data.data || r.data),
  });

  const matieres = data?.matieres || [];

  return (
    <div className="px-4 py-4">
      <h1 className="font-gaming text-[22px] text-foreground mb-1">Mes Matières</h1>
      <div className="w-10 h-[3px] bg-accent rounded-full mb-2" />
      <p className="text-sm text-muted-foreground mb-6">{matieres.length} matières — Série {data?.serie || ''}</p>

      {isLoading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-40 bg-card rounded-2xl animate-pulse" />)}</div>
      ) : (
        <div className="space-y-3">
          {matieres.map((m: any) => (
            <button key={m.id} onClick={() => navigate(`/subject/${m.id}`)}
              className="w-full bg-card rounded-2xl p-[18px] text-left active:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 bg-secondary rounded-lg flex items-center justify-center">
                  <i className="fa-solid fa-book-open text-primary text-sm" />
                </div>
                <span className="text-base font-semibold text-foreground flex-1">{m.nom}</span>
                <span className="font-gaming text-[11px] text-accent bg-amber-50 px-2 py-1 rounded-full">LV {m.niveau || 1}</span>
              </div>
              <div className="flex items-center divide-x divide-border text-center mb-3">
                <div className="flex-1">
                  <div className="flex items-center justify-center gap-1">
                    <i className="fa-solid fa-star text-accent text-xs" />
                    <span className="font-gaming text-sm text-foreground">{m.points || 0}</span>
                  </div>
                  <span className="text-[11px] text-muted-foreground">XP</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-center gap-1">
                    <i className="fa-solid fa-chart-line text-primary text-xs" />
                    <span className="text-sm text-foreground">{m.moyenne || '-'}</span>
                  </div>
                  <span className="text-[11px] text-muted-foreground">Moyenne</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-center gap-1">
                    <i className="fa-solid fa-circle-question text-warning text-xs" />
                    <span className="text-sm text-foreground">{m.quiz_count || 0}</span>
                  </div>
                  <span className="text-[11px] text-muted-foreground">Quiz</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-[11px] text-inactive mb-1">
                <span>Progression</span>
                <span>{m.points || 0} / 200 XP</span>
              </div>
              <div className="h-2 bg-border rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: `${((m.points || 0) / 200) * 100}%` }} />
              </div>
              <span className={`inline-block mt-3 text-[11px] px-3 py-1 rounded-full ${m.type === 'optionnelle' ? 'bg-secondary text-secondary-foreground' : 'bg-emerald-50 text-success'}`}>
                {m.type === 'optionnelle' ? 'Optionnelle' : 'Obligatoire'}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Subjects;
