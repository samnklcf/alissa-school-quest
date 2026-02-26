import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(username, password);
      navigate('/');
    } catch (err: any) {
      toast({ title: 'Erreur', description: err.response?.data?.message || 'Identifiants incorrects', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-dvh bg-background px-4 pt-6">
      <button onClick={() => navigate('/welcome')} className="text-inactive mb-6">
        <i className="fa-solid fa-arrow-left text-lg" />
      </button>
      <div className="flex flex-col items-center mb-6">
        <i className="fa-solid fa-graduation-cap text-primary text-5xl mb-4" />
        <h1 className="font-gaming text-[22px] text-foreground">Se connecter</h1>
        <p className="text-sm text-muted-foreground mt-1">Content de te revoir !</p>
      </div>
      <form onSubmit={handleSubmit} className="bg-card rounded-2xl p-6 space-y-4">
        <div className="relative">
          <i className="fa-solid fa-at absolute left-4 top-1/2 -translate-y-1/2 text-inactive text-sm" />
          <input type="text" placeholder="Nom d'utilisateur" value={username} onChange={e => setUsername(e.target.value)}
            className="w-full h-12 pl-11 pr-4 rounded-xl border border-border bg-card text-foreground text-sm input-glow focus:outline-none" required />
        </div>
        <div className="relative">
          <i className="fa-solid fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-inactive text-sm" />
          <input type={showPw ? 'text' : 'password'} placeholder="Mot de passe" value={password} onChange={e => setPassword(e.target.value)}
            className="w-full h-12 pl-11 pr-11 rounded-xl border border-border bg-card text-foreground text-sm input-glow focus:outline-none" required />
          <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-inactive">
            <i className={`fa-solid ${showPw ? 'fa-eye-slash' : 'fa-eye'}`} />
          </button>
        </div>
        <button type="submit" disabled={loading}
          className="w-full h-[52px] bg-primary text-primary-foreground font-semibold rounded-xl flex items-center justify-center gap-2 disabled:opacity-50">
          {loading ? <i className="fa-solid fa-spinner fa-spin" /> : <><i className="fa-solid fa-right-to-bracket" /> Se connecter</>}
        </button>
      </form>
      <p className="text-center text-sm text-muted-foreground mt-6">
        Pas encore inscrit ?{' '}
        <button onClick={() => navigate('/register')} className="text-primary font-semibold">Créer un compte</button>
      </p>
    </div>
  );
};

export default Login;
