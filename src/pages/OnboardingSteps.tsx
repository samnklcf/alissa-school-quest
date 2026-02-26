import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { matieresAPI } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { Matiere } from '@/types';

const seriesList = [
  { code: 'A', name: 'Lettres & Sciences Humaines' },
  { code: 'B', name: 'Économie & Sciences Sociales' },
  { code: 'C', name: 'Mathématiques & Sciences' },
  { code: 'D', name: 'Sciences & Techniques' },
  { code: 'G', name: 'Gestion & Commerce' },
];

const langues = ['Fang', 'Myene', 'Punu', 'Nzebi', 'Kota'];

const OnboardingSteps = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { register, completeOnboarding, user } = useAuth();
  const { toast } = useToast();

  const regData = (location.state as any)?.registrationData;

  // If already onboarded, go home
  if (user?.onboarding_completed) return <Navigate to="/" replace />;

  const initialStep = user && !regData ? 2 : 1;
  const [step, setStep] = useState(initialStep);
  const [serie, setSerie] = useState(user?.serie || '');
  const [loading, setLoading] = useState(false);
  const [matieres, setMatieres] = useState<Matiere[]>([]);
  const [selectedOptional, setSelectedOptional] = useState<string[]>([]);
  const [langue, setLangue] = useState('');
  const [loadingMatieres, setLoadingMatieres] = useState(false);

  // If no auth and no reg data, redirect
  if (!user && !regData) return <Navigate to="/register" replace />;

  const totalSteps = regData ? 3 : 2;
  const displayStep = regData ? step : step - 1;

  useEffect(() => {
    if (step === 2) {
      const s = serie || user?.serie;
      if (s) {
        setLoadingMatieres(true);
        matieresAPI.list(s).then(r => setMatieres(r.data.data || r.data || []))
          .catch(() => {}).finally(() => setLoadingMatieres(false));
      }
    }
  }, [step, serie, user?.serie]);

  const handleStep1 = async () => {
    if (!serie) return;
    if (regData) {
      setLoading(true);
      try {
        await register({ ...regData, serie, etablissement_custom: null });
        setStep(2);
      } catch (err: any) {
        toast({ title: 'Erreur', description: err.response?.data?.message || "Erreur lors de l'inscription", variant: 'destructive' });
      } finally { setLoading(false); }
    } else {
      setStep(2);
    }
  };

  const handleStep3 = async () => {
    setLoading(true);
    try {
      await completeOnboarding({ matieres_ids: selectedOptional, langue_gabonaise: langue || undefined });
      navigate('/');
    } catch (err: any) {
      toast({ title: 'Erreur', description: err.response?.data?.message || "Erreur", variant: 'destructive' });
    } finally { setLoading(false); }
  };

  const toggleOptional = (id: string) => setSelectedOptional(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  const obligatoires = matieres.filter(m => m.type !== 'optionnelle');
  const optionnelles = matieres.filter(m => m.type === 'optionnelle');
  const progress = (displayStep / totalSteps) * 100;

  return (
    <div className="min-h-dvh bg-background px-4 pt-4 pb-8">
      <div className="mb-4">
        <div className="h-1.5 bg-border rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
        <p className="text-xs text-inactive text-right mt-1">Étape {displayStep} / {totalSteps}</p>
      </div>

      <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
        {step === 1 && (
          <div>
            <h1 className="font-gaming text-xl text-foreground mb-2">Quelle est ta série ?</h1>
            <p className="text-sm text-muted-foreground mb-6">Ton programme sera adapté automatiquement.</p>
            <div className="grid grid-cols-3 gap-3">
              {seriesList.map((s) => (
                <button key={s.code} onClick={() => setSerie(s.code)}
                  className={`bg-card rounded-2xl p-4 text-center border-2 transition-all ${serie === s.code ? 'border-primary glow-blue' : 'border-border'}`}>
                  <div className="font-gaming text-2xl text-primary">{s.code}</div>
                  <div className="text-xs text-muted-foreground mt-1">{s.name}</div>
                </button>
              ))}
            </div>
            <button onClick={handleStep1} disabled={!serie || loading}
              className="w-full h-[52px] bg-primary text-primary-foreground font-semibold rounded-xl flex items-center justify-center gap-2 mt-8 disabled:opacity-50">
              {loading ? <i className="fa-solid fa-spinner fa-spin" /> : <>Continuer <i className="fa-solid fa-arrow-right" /></>}
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <h1 className="font-gaming text-xl text-foreground mb-2">Tes matières</h1>
            <p className="text-sm text-muted-foreground mb-6">Les matières obligatoires sont déjà incluses.</p>
            {loadingMatieres ? (
              <div className="space-y-3">{[1,2,3,4].map(i => <div key={i} className="h-14 bg-card rounded-xl animate-pulse" />)}</div>
            ) : (
              <>
                {obligatoires.length > 0 && (
                  <div className="mb-6">
                    <h2 className="text-sm font-semibold text-foreground mb-3">Incluses automatiquement</h2>
                    <div className="space-y-2">
                      {obligatoires.map(m => (
                        <div key={m.id} className="bg-muted rounded-xl p-3 flex items-center gap-3">
                          <i className="fa-solid fa-circle-check text-success text-sm" />
                          <span className="text-sm text-foreground flex-1">{m.nom}</span>
                          <span className="text-[10px] bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full font-gaming">AUTO</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {optionnelles.length > 0 && (
                  <div>
                    <h2 className="text-sm font-semibold text-foreground mb-3">Choisir mes optionnelles</h2>
                    <div className="space-y-2">
                      {optionnelles.map(m => (
                        <button key={m.id} onClick={() => toggleOptional(m.id)}
                          className={`w-full bg-card rounded-xl p-3 flex items-center gap-3 border-2 transition-all text-left ${selectedOptional.includes(m.id) ? 'border-primary glow-blue' : 'border-border'}`}>
                          <i className={`fa-solid ${selectedOptional.includes(m.id) ? 'fa-circle-check text-primary' : 'fa-circle text-inactive'} text-sm`} />
                          <span className="text-sm text-foreground">{m.nom}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
            <button onClick={() => setStep(3)} className="w-full h-[52px] bg-primary text-primary-foreground font-semibold rounded-xl flex items-center justify-center gap-2 mt-8">
              Continuer <i className="fa-solid fa-arrow-right" />
            </button>
            <button onClick={() => setStep(3)} className="w-full text-center text-sm text-primary mt-3">Passer cette étape</button>
          </div>
        )}

        {step === 3 && (
          <div>
            <h1 className="font-gaming text-xl text-foreground mb-2">Ta langue gabonaise</h1>
            <p className="text-sm text-muted-foreground mb-6">Personnalise ton expérience culturelle.</p>
            <div className="grid grid-cols-2 gap-3">
              {langues.map(l => (
                <button key={l} onClick={() => setLangue(l)}
                  className={`bg-card rounded-2xl p-4 flex items-center gap-3 border-2 transition-all ${langue === l ? 'border-primary glow-blue' : 'border-border'}`}>
                  <i className="fa-solid fa-comments text-primary text-lg" />
                  <span className="text-sm text-foreground font-medium">{l}</span>
                </button>
              ))}
            </div>
            <button onClick={() => setLangue('')} className="w-full text-center text-sm text-muted-foreground mt-4">Préférer ne pas préciser</button>
            <button onClick={handleStep3} disabled={loading}
              className="w-full h-[52px] bg-primary text-primary-foreground font-semibold rounded-xl flex items-center justify-center gap-2 mt-8 disabled:opacity-50">
              {loading ? <i className="fa-solid fa-spinner fa-spin" /> : <><i className="fa-solid fa-rocket" /> Lancer Alissa !</>}
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default OnboardingSteps;
