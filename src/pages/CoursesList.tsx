import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { coursAPI, eleveAPI } from '@/lib/api';

const CoursesList = () => {
  const { matiereId } = useParams();
  const navigate = useNavigate();

  const { data: profile } = useQuery({ queryKey: ['profile'], queryFn: () => eleveAPI.profile().then(r => r.data.data || r.data) });
  const matiere = profile?.matieres?.find((m: any) => m.id === matiereId);

  const { data: courses, isLoading } = useQuery({
    queryKey: ['courses', matiereId],
    queryFn: () => coursAPI.list(matiereId!, 1).then(r => r.data.data || r.data || []),
  });

  const list = Array.isArray(courses) ? courses : [];

  return (
    <div className="min-h-dvh bg-background">
      <div className="flex items-center gap-3 px-4 py-4">
        <button onClick={() => navigate(-1)} className="text-inactive">
          <i className="fa-solid fa-arrow-left" />
        </button>
        <h1 className="font-gaming text-lg text-foreground">Mes Cours</h1>
        {matiere && <span className="font-gaming text-[11px] bg-secondary text-secondary-foreground px-2 py-1 rounded-full">{matiere.nom}</span>}
      </div>

      <div className="px-4 pb-8">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <i className="fa-solid fa-spinner fa-spin text-primary text-2xl" />
          </div>
        ) : list.length === 0 ? (
          <div className="bg-card rounded-2xl p-8 text-center">
            <i className="fa-solid fa-book-open text-muted-foreground text-4xl mb-3" />
            <p className="text-sm text-muted-foreground">Aucun cours créé pour le moment.</p>
            <button onClick={() => navigate(`/course/new/${matiereId}`)} className="mt-4 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-semibold">
              <i className="fa-solid fa-plus mr-2" />Créer un cours
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {list.map((c: any) => (
              <button key={c.id} onClick={() => navigate(`/course/${c.id}`)} className="w-full bg-card rounded-xl p-4 text-left flex items-center gap-3">
                <div className="w-11 h-11 bg-secondary rounded-[10px] flex items-center justify-center shrink-0">
                  <i className="fa-solid fa-file-lines text-primary text-lg" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{c.titre}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {new Date(c.created_at).toLocaleDateString('fr')}
                    {c.quiz_generated && <span className="ml-2 text-success"><i className="fa-solid fa-check-circle mr-0.5" />Quiz dispo</span>}
                  </p>
                </div>
                <i className="fa-solid fa-chevron-right text-xs text-muted-foreground" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesList;
