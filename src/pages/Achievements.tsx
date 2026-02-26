import { useQuery } from '@tanstack/react-query';
import { eleveAPI } from '@/lib/api';
import { Badge } from '@/types';
import { motion } from 'framer-motion';

const Achievements = () => {
  const { data, isLoading } = useQuery({ queryKey: ['badges'], queryFn: () => eleveAPI.badges().then(r => r.data.data || r.data) });
  const { data: profile } = useQuery({ queryKey: ['profile'], queryFn: () => eleveAPI.profile().then(r => r.data.data || r.data) });

  const badges: Badge[] = Array.isArray(data) ? data : [];
  const obtained = badges.filter(b => b.obtained);
  const locked = badges.filter(b => !b.obtained);

  return (
    <div className="pb-4">
      <div className="bg-header rounded-b-3xl px-5 py-6">
        <h1 className="font-gaming text-[22px] text-primary-foreground mb-4">Mes Succès</h1>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <i className="fa-solid fa-medal text-accent text-lg mb-1" />
            <p className="font-gaming text-xl text-primary-foreground">{obtained.length}</p>
            <p className="text-[11px] text-inactive">Badges</p>
          </div>
          <div>
            <i className="fa-solid fa-bolt text-primary text-lg mb-1" />
            <p className="font-gaming text-xl text-primary-foreground">{profile?.points_global || 0}</p>
            <p className="text-[11px] text-inactive">XP Total</p>
          </div>
          <div>
            <i className="fa-solid fa-star text-success text-lg mb-1" />
            <p className="font-gaming text-xl text-primary-foreground">{profile?.niveau_global || 1}</p>
            <p className="text-[11px] text-inactive">Niv. Moyen</p>
          </div>
        </div>
      </div>

      <div className="px-4 mt-4">
        {isLoading ? (
          <div className="grid grid-cols-2 gap-3">{[1,2,3,4].map(i => <div key={i} className="h-36 bg-card rounded-[14px] animate-pulse" />)}</div>
        ) : (
          <>
            <div className="flex items-center gap-2 mb-3">
              <h2 className="font-gaming text-base text-foreground">Obtenus</h2>
              <span className="font-gaming text-[11px] bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full">{obtained.length} / {badges.length}</span>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {obtained.map((b, i) => (
                <motion.div key={b.id} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: i * 0.1 }}
                  className="bg-card border border-accent rounded-[14px] p-4 text-center glow-gold">
                  <i className="fa-solid fa-medal text-accent text-3xl mb-2" />
                  <p className="font-gaming text-[13px] text-foreground">{b.nom}</p>
                  <p className="text-[11px] text-muted-foreground mt-1">{b.description}</p>
                  {b.obtained_at && <p className="text-[10px] text-inactive mt-2"><i className="fa-solid fa-calendar mr-1" />{new Date(b.obtained_at).toLocaleDateString('fr')}</p>}
                </motion.div>
              ))}
            </div>
            {locked.length > 0 && (
              <>
                <h2 className="font-gaming text-base text-inactive mb-3">À débloquer</h2>
                <div className="grid grid-cols-2 gap-3">
                  {locked.map(b => (
                    <div key={b.id} className="bg-muted border border-border rounded-[14px] p-4 text-center">
                      <i className="fa-solid fa-lock text-dots-inactive text-[28px] mb-2" />
                      <p className="font-gaming text-[13px] text-inactive">{b.nom}</p>
                      <p className="text-[11px] text-inactive mt-1">{b.condition || b.description}</p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Achievements;
