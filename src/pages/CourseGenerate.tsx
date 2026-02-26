import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { coursAPI, eleveAPI } from '@/lib/api';
import TextRenderer from '@/components/TextRenderer';
import { Video, Course } from '@/types';

const CourseGenerate = () => {
  const { matiereId } = useParams();
  const navigate = useNavigate();
  const [titre, setTitre] = useState('');
  const [state, setState] = useState<'form' | 'loading' | 'result'>('form');
  const [course, setCourse] = useState<Course | null>(null);
  const [quizReady, setQuizReady] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState<Video | null>(null);

  const { data: profile } = useQuery({ queryKey: ['profile'], queryFn: () => eleveAPI.profile().then(r => r.data.data || r.data) });
  const matiere = profile?.matieres?.find((m: any) => m.id === matiereId);

  const generate = async () => {
    if (!titre.trim()) return;
    setState('loading');
    try {
      const { data } = await coursAPI.create({ titre: titre.trim(), matiere_id: matiereId! });
      const c = data.data;
      setCourse(c);
      setState('result');
      if (!c.quiz_generated) {
        const poll = setInterval(async () => {
          try {
            const { data: updated } = await coursAPI.get(c.id);
            if (updated.data?.quiz_generated) {
              setCourse(updated.data);
              setQuizReady(true);
              clearInterval(poll);
            }
          } catch { clearInterval(poll); }
        }, 3000);
      } else { setQuizReady(true); }
    } catch { setState('form'); }
  };

  return (
    <div className="min-h-dvh bg-background">
      <div className="flex items-center gap-3 px-4 py-4">
        <button onClick={() => navigate(-1)} className="text-inactive"><i className="fa-solid fa-arrow-left" /></button>
        <h1 className="font-gaming text-lg text-foreground">Nouveau Cours</h1>
        {matiere && <span className="font-gaming text-[11px] bg-secondary text-secondary-foreground px-2 py-1 rounded-full">{matiere.nom}</span>}
      </div>

      {state === 'form' && (
        <div className="px-4">
          <div className="bg-card rounded-2xl p-6">
            <label className="text-sm font-semibold text-foreground block mb-2">Titre du chapitre ou thème à résumer</label>
            <input value={titre} onChange={e => setTitre(e.target.value)} placeholder="Ex : La photosynthèse, Les dérivées..."
              className="w-full h-[52px] rounded-xl border border-border px-4 text-sm text-foreground input-glow focus:outline-none" />
            <div className="bg-secondary rounded-[10px] p-3 mt-4 flex items-start gap-2">
              <i className="fa-solid fa-circle-info text-primary text-sm mt-0.5" />
              <p className="text-[13px] text-text-dark">L'IA va générer un résumé structuré et chercher des vidéos YouTube associées.</p>
            </div>
            <button onClick={generate} disabled={!titre.trim()} className="w-full h-[52px] bg-primary text-primary-foreground font-semibold rounded-xl flex items-center justify-center gap-2 mt-6 disabled:opacity-50">
              Générer le résumé <i className="fa-solid fa-wand-magic-sparkles" />
            </button>
          </div>
        </div>
      )}

      {state === 'loading' && (
        <div className="px-4 mt-8">
          <div className="bg-card rounded-2xl p-8 text-center">
            <i className="fa-solid fa-robot text-primary text-5xl animate-pulse-slow mb-4" />
            <h2 className="font-gaming text-base text-foreground mb-3">Alissa génère ton cours...</h2>
            <div className="h-1 bg-border rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full animate-pulse" style={{ width: '60%' }} />
            </div>
            <p className="text-[13px] text-muted-foreground mt-3">Le résumé arrive en premier — Les vidéos et le quiz suivront</p>
          </div>
        </div>
      )}

      {state === 'result' && course && (
        <div className="px-4 pb-8">
          <div className="bg-card rounded-2xl p-5 border-l-4 border-primary mb-4">
            <h2 className="font-gaming text-lg text-foreground mb-4">{course.titre}</h2>
            <TextRenderer content={course.contenu} />
          </div>
          <button onClick={() => quizReady && course.quiz_id ? navigate(`/quiz/${course.quiz_id}`) : null} disabled={!quizReady}
            className={`w-full h-[52px] font-semibold rounded-xl flex items-center justify-center gap-2 ${quizReady ? 'bg-success text-primary-foreground glow-gold' : 'bg-muted text-inactive'}`}>
            {quizReady ? <><i className="fa-solid fa-play" /> Passer au Quiz</> : <><i className="fa-solid fa-spinner fa-spin" /> Quiz en préparation...</>}
          </button>
          {course.videos && course.videos.length > 0 && (
            <div className="mt-6">
              <h3 className="font-gaming text-base text-foreground mb-3">Vidéos</h3>
              <div className="space-y-3">
                {course.videos.map((v, i) => (
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
      )}

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

export default CourseGenerate;
