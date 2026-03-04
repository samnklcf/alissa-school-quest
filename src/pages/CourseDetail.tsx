import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { coursAPI } from '@/lib/api';
import TextRenderer from '@/components/TextRenderer';
import { Video } from '@/types';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [videoPlaying, setVideoPlaying] = useState<Video | null>(null);

  const { data: course, isLoading } = useQuery({
    queryKey: ['course', id],
    queryFn: () => coursAPI.get(id!).then(r => r.data.data || r.data),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-dvh">
        <i className="fa-solid fa-spinner fa-spin text-primary text-2xl" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-dvh bg-background px-4 py-6 text-center">
        <p className="text-muted-foreground">Cours introuvable.</p>
        <button onClick={() => navigate(-1)} className="text-primary mt-4 text-sm">Retour</button>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-background">
      <div className="flex items-center gap-3 px-4 py-4">
        <button onClick={() => navigate(-1)} className="text-inactive">
          <i className="fa-solid fa-arrow-left" />
        </button>
        <h1 className="font-gaming text-lg text-foreground flex-1 truncate">{course.titre}</h1>
      </div>

      <div className="px-4 pb-8">
        <div className="bg-card rounded-2xl p-5 border-l-4 border-primary mb-4">
          <TextRenderer content={course.contenu} />
        </div>

        {course.quiz_id && (
          <button
            onClick={() => navigate(`/quiz/${course.quiz_id}`)}
            className="w-full h-[52px] bg-success text-primary-foreground font-semibold rounded-xl flex items-center justify-center gap-2 mb-4"
          >
            <i className="fa-solid fa-play" /> Passer au Quiz
          </button>
        )}

        {course.videos && course.videos.length > 0 && (
          <div className="mt-4">
            <h3 className="font-gaming text-base text-foreground mb-3">Vidéos</h3>
            <div className="space-y-3">
              {course.videos.map((v: Video, i: number) => (
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

export default CourseDetail;
