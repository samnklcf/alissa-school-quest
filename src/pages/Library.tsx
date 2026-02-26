import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { matieresAPI, eleveAPI } from '@/lib/api';
import { Resource } from '@/types';

const statusConfig: Record<string, { icon: string; bg: string; color: string; label: string }> = {
  nouveau: { icon: 'fa-file-pdf', bg: 'bg-secondary', color: 'text-primary', label: 'NOUVEAU' },
  non_lu: { icon: 'fa-file-lines', bg: 'bg-muted', color: 'text-inactive', label: 'NON LU' },
  lu: { icon: 'fa-file-lines', bg: 'bg-emerald-50', color: 'text-success', label: 'LU' },
};

const Library = () => {
  const { matiereId } = useParams();
  const navigate = useNavigate();
  const [viewing, setViewing] = useState<Resource | null>(null);

  const { data: profile } = useQuery({ queryKey: ['profile'], queryFn: () => eleveAPI.profile().then(r => r.data.data || r.data) });
  const { data: resources, isLoading } = useQuery({
    queryKey: ['resources', matiereId],
    queryFn: () => matieresAPI.ressources(matiereId!).then(r => r.data.data || r.data || []),
  });

  const matiere = profile?.matieres?.find((m: any) => m.id === matiereId);

  return (
    <div className="min-h-dvh bg-background">
      <div className="flex items-center gap-3 px-4 py-4">
        <button onClick={() => navigate(-1)} className="text-inactive"><i className="fa-solid fa-arrow-left" /></button>
        <h1 className="font-gaming text-lg text-foreground">Ma Librairie</h1>
        {matiere && <span className="font-gaming text-[11px] bg-secondary text-secondary-foreground px-2 py-1 rounded-full">{matiere.nom}</span>}
      </div>

      <div className="px-4">
        {isLoading ? (
          <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-16 bg-card rounded-xl animate-pulse" />)}</div>
        ) : !resources || resources.length === 0 ? (
          <div className="text-center py-16">
            <i className="fa-solid fa-folder-open text-dots-inactive text-6xl mb-4" />
            <h2 className="font-gaming text-base text-foreground mb-2">Aucune ressource disponible</h2>
            <p className="text-sm text-muted-foreground">L'administrateur n'a pas encore ajouté de ressources pour cette matière.</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {resources.map((r: Resource) => {
              const s = statusConfig[r.status || 'non_lu'] || statusConfig.non_lu;
              return (
                <button key={r.id} onClick={() => setViewing(r)} className="w-full bg-card border border-border rounded-xl p-4 flex items-center gap-3 text-left">
                  <div className={`w-11 h-11 ${s.bg} rounded-[10px] flex items-center justify-center`}>
                    <i className={`fa-solid ${s.icon} ${s.color} text-lg`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{r.titre}</p>
                    <span className={`text-[10px] ${s.bg} ${s.color} px-2 py-0.5 rounded-full mt-1 inline-block`}>{s.label}</span>
                  </div>
                  <i className="fa-solid fa-chevron-right text-dots-inactive text-sm" />
                </button>
              );
            })}
          </div>
        )}
      </div>

      {viewing && (
        <div className="fixed inset-0 bg-header z-[100] flex flex-col" style={{ maxWidth: 480, margin: '0 auto' }}>
          <div className="flex items-center gap-3 px-4 py-3">
            <button onClick={() => setViewing(null)}><i className="fa-solid fa-xmark text-primary-foreground text-lg" /></button>
            <p className="text-sm text-primary-foreground truncate flex-1">{viewing.titre}</p>
          </div>
          <iframe src={viewing.url} className="flex-1 bg-card" />
        </div>
      )}
    </div>
  );
};

export default Library;
