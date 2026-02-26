import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { matieresAPI } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Etablissement } from '@/types';

const Register = () => {
  const [form, setForm] = useState({ prenom: '', nom: '', username: '', telephone: '', etablissement_id: '', password: '', confirmPassword: '' });
  const [showPw, setShowPw] = useState(false);
  const [etabs, setEtabs] = useState<Etablissement[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    matieresAPI.etablissements().then(r => setEtabs(r.data.data || r.data || [])).catch(() => {});
  }, []);

  const update = (key: string, val: string) => setForm(p => ({ ...p, [key]: val }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast({ title: 'Erreur', description: 'Les mots de passe ne correspondent pas', variant: 'destructive' });
      return;
    }
    navigate('/onboarding', { state: { registrationData: { ...form } } });
  };

  const fields = [
    { key: 'prenom', icon: 'fa-user', placeholder: 'Prénom', type: 'text' },
    { key: 'nom', icon: 'fa-user', placeholder: 'Nom', type: 'text' },
    { key: 'username', icon: 'fa-at', placeholder: "Nom d'utilisateur", type: 'text' },
    { key: 'telephone', icon: 'fa-phone', placeholder: 'Téléphone', type: 'tel' },
  ];

  return (
    <div className="min-h-dvh bg-background px-4 pt-6 pb-8">
      <button onClick={() => navigate('/welcome')} className="text-inactive mb-6">
        <i className="fa-solid fa-arrow-left text-lg" />
      </button>
      <div className="flex flex-col items-center mb-6">
        <i className="fa-solid fa-graduation-cap text-primary text-5xl mb-4" />
        <h1 className="font-gaming text-[22px] text-foreground">Créer ton compte</h1>
        <p className="text-sm text-muted-foreground mt-1">Commence ton aventure</p>
      </div>
      <form onSubmit={handleSubmit} className="bg-card rounded-2xl p-6 space-y-4">
        {fields.map(f => (
          <div key={f.key} className="relative">
            <i className={`fa-solid ${f.icon} absolute left-4 top-1/2 -translate-y-1/2 text-inactive text-sm`} />
            <input type={f.type} placeholder={f.placeholder} value={(form as any)[f.key]} onChange={e => update(f.key, e.target.value)}
              className="w-full h-12 pl-11 pr-4 rounded-xl border border-border bg-card text-foreground text-sm input-glow focus:outline-none" required />
          </div>
        ))}
        <div className="relative">
          <i className="fa-solid fa-building-columns absolute left-4 top-1/2 -translate-y-1/2 text-inactive text-sm z-10" />
          <select value={form.etablissement_id} onChange={e => update('etablissement_id', e.target.value)}
            className="w-full h-12 pl-11 pr-4 rounded-xl border border-border bg-card text-foreground text-sm input-glow focus:outline-none appearance-none" required>
            <option value="">Établissement</option>
            {etabs.map(e => <option key={e.id} value={e.id}>{e.nom}</option>)}
          </select>
        </div>
        <div className="relative">
          <i className="fa-solid fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-inactive text-sm" />
          <input type={showPw ? 'text' : 'password'} placeholder="Mot de passe" value={form.password} onChange={e => update('password', e.target.value)}
            className="w-full h-12 pl-11 pr-11 rounded-xl border border-border bg-card text-foreground text-sm input-glow focus:outline-none" required />
          <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-inactive">
            <i className={`fa-solid ${showPw ? 'fa-eye-slash' : 'fa-eye'}`} />
          </button>
        </div>
        <div className="relative">
          <i className="fa-solid fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-inactive text-sm" />
          <input type={showPw ? 'text' : 'password'} placeholder="Confirmation mot de passe" value={form.confirmPassword} onChange={e => update('confirmPassword', e.target.value)}
            className="w-full h-12 pl-11 pr-4 rounded-xl border border-border bg-card text-foreground text-sm input-glow focus:outline-none" required />
        </div>
        <button type="submit" className="w-full h-[52px] bg-primary text-primary-foreground font-semibold rounded-xl flex items-center justify-center gap-2">
          <i className="fa-solid fa-user-plus" /> Créer mon compte
        </button>
      </form>
      <p className="text-center text-sm text-muted-foreground mt-6">
        Déjà inscrit ?{' '}
        <button onClick={() => navigate('/login')} className="text-primary font-semibold">Se connecter</button>
      </p>
    </div>
  );
};

export default Register;
