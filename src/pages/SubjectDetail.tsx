import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { eleveAPI, quizAPI, coursAPI } from '@/lib/api';
import { Video } from '@/types';

const SubjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [videoPlaying, setVideoPlaying] = useState<Video | null>(null);

  const { data: profile } = useQuery({ queryKey: ['profile'], queryFn: () => eleveAPI.profile().then(r => r.data.data || r.data) });
  const { data: quizzes } = useQuery({
    queryKey: ['quizzes-subject', id],
    queryFn: () => quizAPI.list({ matiere_id: id, status: 'done', limit: 3 }).then(r => r.data.data || r.data || []),
  });
  const { data: courses } = useQuery({
    queryKey: ['courses', id],
    queryFn: () => coursAPI.list(id!, 1).then(r => r.data.data || r.data || []),
  });

  const matiere = profile?.matieres?.find((m: any) => m.id === id);
  const videos: Video[] = (Array.isArray(courses) ? courses : []).flatMap((c: any) => c.videos || []);

  const actions = [
    { icon: 'fa-brain', bg: 'bg-secondary', color: 'text-primary', title: 'Résumer un cours', desc: 'Générer un résumé IA', path: `/course/new/${id}` },
    { icon: 'fa-book-open', bg: 'bg-blue-50', color: 'text-primary', title: 'Mes Cours', desc: 'Voir mes cours créés', path: `/courses/${id}` },
    { icon: 'fa-list-check', bg: 'bg-orange-50', color: 'text-warning', title: 'Mes Quizzes', desc: 'Voir tous mes quiz', path: `/quizzes/${id}` },
    { icon: 'fa-robot', bg: 'bg-emerald-50', color: 'text-success', title: 'Assistant', desc: 'Poser une question', path: `/assistant/${id}` },
    { icon: 'fa-folder-open', bg: 'bg-amber-50', color: 'text-accent', title: 'Ma Librairie', desc: 'PDFs et ressources', path: `/library/${id}` },
  ];

  if (!matiere && !profile) {
    return <div className="flex items-center justify-center min-h-dvh"><i className="fa-solid fa-spinner fa-spin text-primary text-2xl" /></div>;
  }

  return (
    <div className="min-h-dvh bg-background">
      <div className="bg-header rounded-b-[20px] px-4 py-5">
        <div className="flex items-center mb-3">
          <button onClick={() => navigate(-1)} className="text-inactive mr-3"><i className="fa-solid fa-arrow-left" /></button>
          <h1 className="text-lg font-semibold text-primary-foreground flex-1 text-center">{matiere?.nom || 'Matière'}</h1>
          <div className="w-6" />
        </div>
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="font-gaming text-[11px] px-3 py-1 rounded-full text-primary" style={{ background: 'rgba(51,142,200,0.2)' }}>Série {profile?.serie}</span>
          <span className="font-gaming text-[11px] px-3 py-1 rounded-full text-accent" style={{ background: 'rgba(245,198,58,0.15)' }}>LV {matiere?.niveau || 1}</span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
          <div className="h-full bg-primary rounded-full" style={{ width: `${((matiere?.points || 0) / 200) * 100}%` }} />
        </div>
        <p className="text-[11px] text-inactive text-right mt-1">{matiere?.points || 0} XP</p>
      </div>

      <div className="px-4 py-4">
        <div className="flex items-center gap-2 mb-3">
          <h2 className="font-gaming text-base text-foreground">Actions</h2>
          <div className="w-8 h-[3px] bg-accent rounded-full" />
        </div>
        <div className="grid grid-cols-2 gap-3 mb-6">
          {actions.map((a, i) => (
            <button key={i} onClick={() => navigate(a.path)} className="bg-card rounded-[14px] p-[18px] text-left active:shadow-md transition-shadow">
              <div className={`w-11 h-11 ${a.bg} rounded-[10px] flex items-center justify-center mb-3`}>
                <i className={`fa-solid ${a.icon} ${a.color} text-xl`} />
              </div>
              <p className="text-sm font-semibold text-foreground">{a.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{a.desc}</p>
            </button>
          ))}
        </div>

        {courses && (Array.isArray(courses) ? courses : []).length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-gaming text-base text-foreground">Cours Récents</h2>
              <button onClick={() => navigate(`/courses/${id}`)} className="text-xs text-primary flex items-center gap-1">
                Tous les cours <i className="fa-solid fa-arrow-right text-[10px]" />
              </button>
            </div>
            <div className="space-y-2">
              {(Array.isArray(courses) ? courses : []).slice(0, 3).map((c: any) => (
                <button key={c.id} onClick={() => navigate(`/course/${c.id}`)} className="w-full bg-card rounded-xl p-3.5 px-4 flex items-center gap-3 text-left">
                  <div className="w-10 h-10 bg-secondary rounded-[10px] flex items-center justify-center">
                    <i className="fa-solid fa-file-lines text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{c.titre}</p>
                    <p className="text-[11px] text-inactive">{new Date(c.created_at).toLocaleDateString('fr')}</p>
                  </div>
                  <i className="fa-solid fa-chevron-right text-xs text-muted-foreground" />
                </button>
              ))}
            </div>
          </div>
        )}

        {quizzes && quizzes.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-gaming text-base text-foreground">Quizzes Récents</h2>
              <button onClick={() => navigate(`/quizzes/${id}`)} className="text-xs text-primary flex items-center gap-1">
                Tous les quiz <i className="fa-solid fa-arrow-right text-[10px]" />
              </button>
            </div>
            <div className="space-y-2">
              {(Array.isArray(quizzes) ? quizzes : []).slice(0, 3).map((q: any) => {
                const pct = q.score != null ? (q.score / (q.total || 10)) * 100 : 0;
                const bg = pct >= 80 ? 'bg-emerald-50' : pct >= 50 ? 'bg-orange-50' : 'bg-red-50';
                const tc = pct >= 80 ? 'text-success' : pct >= 50 ? 'text-warning' : 'text-destructive';
                return (
                  <div key={q.id} className="bg-card rounded-xl p-3.5 px-4 flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-[10px] flex items-center justify-center ${bg}`}>
                      <i className={`fa-solid fa-circle-question ${tc}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{q.titre}</p>
                      <p className="text-[11px] text-inactive">{new Date(q.done_at || q.created_at).toLocaleDateString('fr')}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-gaming text-base">{q.score}/{q.total || 10}</p>
                      <p className={`text-xs ${(q.points_gagnes || 0) >= 0 ? 'text-success' : 'text-destructive'}`}>
                        {(q.points_gagnes || 0) >= 0 ? '+' : ''}{q.points_gagnes || 0}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {videos.length > 0 && (
          <div>
            <h2 className="font-gaming text-base text-foreground mb-3">Vidéos</h2>
            <div className="space-y-3">
              {videos.map((v, i) => (
                <button key={i} onClick={() => setVideoPlaying(v)} className="w-full bg-card rounded-xl overflow-hidden flex text-left">
                  <div className="relative w-[100px] h-[72px] shrink-0">
                    <img src={v.miniature} alt="" className="w-full h-full object-cover rounded-[10px]" />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center rounded-[10px]">
                      <i className="fa-solid fa-circle-play text-primary-foreground text-2xl" />
                    </div>
                  </div>
                  <div className="p-3 flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-foreground line-clamp-2">{v.titre}</p>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-inactive">
                      <span><i className="fa-solid fa-clock mr-1" />{v.duree}</span>
                      <span><i className="fa-solid fa-eye mr-1" />{v.vues}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {videoPlaying && (
        <div className="fixed inset-0 bg-black z-[100] flex flex-col items-center justify-center" style={{ maxWidth: 480, margin: '0 auto' }}>
          <button onClick={() => setVideoPlaying(null)} className="absolute top-4 left-4 w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.2)' }}>
            <i className="fa-solid fa-xmark text-primary-foreground text-lg" />
          </button>
          <iframe src={`https://www.youtube.com/embed/${videoPlaying.youtube_id}?autoplay=1`} className="w-full aspect-video" allow="autoplay; encrypted-media" allowFullScreen />
        </div>
      )}
    </div>
  );
};

export default SubjectDetail;
