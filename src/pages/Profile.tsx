import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { eleveAPI } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const Profile = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ telephone: '', langue_gabonaise: '' });
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const { data: profile } = useQuery({ queryKey: ['profile'], queryFn: () => eleveAPI.profile().then(r => r.data.data || r.data) });

  const handleLogout = async () => { await logout(); navigate('/welcome'); };
  const openEdit = () => { setEditForm({ telephone: profile?.telephone || '', langue_gabonaise: profile?.langue_gabonaise || '' }); setEditing(true); };
  const saveEdit = async () => {
    try { await eleveAPI.updateProfile(editForm); queryClient.invalidateQueries({ queryKey: ['profile'] }); setEditing(false); toast({ title: 'Profil mis à jour' }); }
    catch { toast({ title: 'Erreur', variant: 'destructive' }); }
  };

  const initials = `${(profile?.prenom || '')[0] || ''}${(profile?.nom || '')[0] || ''}`.toUpperCase();

  const infoRows = [
    { icon: 'fa-graduation-cap', label: 'Série', value: profile?.serie },
    { icon: 'fa-building-columns', label: 'Établissement', value: profile?.etablissement_nom || '-' },
    { icon: 'fa-comments', label: 'Langue gabonaise', value: profile?.langue_gabonaise || '-' },
    { icon: 'fa-calendar', label: "Date d'inscription", value: profile?.created_at ? new Date(profile.created_at).toLocaleDateString('fr') : '-' },
    { icon: 'fa-phone', label: 'Téléphone', value: profile?.telephone || '-' },
  ];

  return (
    <div className="pb-4">
      <div className="bg-header rounded-b-3xl px-5 py-8 text-center">
        <div className="w-20 h-20 rounded-full bg-primary border-[3px] border-accent flex items-center justify-center mx-auto mb-3">
          <span className="font-gaming text-[28px] text-primary-foreground">{initials}</span>
        </div>
        <h1 className="font-gaming text-xl text-primary-foreground">{profile?.prenom} {profile?.nom}</h1>
        <span className="font-gaming text-xs px-3 py-1 rounded-full mt-2 inline-block text-primary" style={{ background: 'rgba(51,142,200,0.3)' }}>Série {profile?.serie}</span>
        <div className="mt-4">
          <p className="text-xs text-inactive">XP Global</p>
          <p className="font-gaming text-base text-accent">{profile?.points_global || 0}</p>
          <div className="h-2.5 rounded-full mt-2 overflow-hidden max-w-[200px] mx-auto" style={{ background: 'rgba(255,255,255,0.1)' }}>
            <div className="h-full bg-accent rounded-full" style={{ width: `${((profile?.points_global || 0) % 200) / 200 * 100}%` }} />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-5 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <div><i className="fa-solid fa-shield-halved text-primary mb-1" /><p className="font-gaming text-lg text-primary-foreground">{profile?.niveau_global || 1}</p><p className="text-[11px] text-inactive">Niveau</p></div>
          <div><i className="fa-solid fa-medal text-accent mb-1" /><p className="font-gaming text-lg text-primary-foreground">{profile?.badges_count || 0}</p><p className="text-[11px] text-inactive">Badges</p></div>
          <div><i className="fa-solid fa-book-open text-success mb-1" /><p className="font-gaming text-lg text-primary-foreground">{profile?.matieres?.length || 0}</p><p className="text-[11px] text-inactive">Matières</p></div>
        </div>
      </div>

      <div className="mx-4 mt-4 bg-card border border-border rounded-2xl overflow-hidden">
        <div className="px-4 py-3 flex items-center gap-2">
          <i className="fa-solid fa-circle-info text-primary" />
          <span className="text-base font-semibold text-foreground">Informations</span>
        </div>
        {infoRows.map((row, i) => (
          <div key={i} className="flex items-center justify-between px-4 py-3.5 border-t border-border">
            <div className="flex items-center gap-2">
              <i className={`fa-solid ${row.icon} text-inactive text-sm`} />
              <span className="text-sm text-muted-foreground">{row.label}</span>
            </div>
            <span className="text-sm font-semibold text-foreground">{row.value}</span>
          </div>
        ))}
      </div>

      <div className="mx-4 mt-4 bg-card border border-border rounded-2xl overflow-hidden">
        <button onClick={openEdit} className="w-full flex items-center gap-3 px-4 py-3.5">
          <div className="w-9 h-9 bg-secondary rounded-lg flex items-center justify-center"><i className="fa-solid fa-pen-to-square text-primary text-sm" /></div>
          <span className="text-sm font-semibold text-foreground flex-1 text-left">Modifier mes informations</span>
          <i className="fa-solid fa-chevron-right text-dots-inactive text-sm" />
        </button>
        <div className="border-t border-border" />
        <button onClick={() => setShowLogoutConfirm(true)} className="w-full flex items-center gap-3 px-4 py-3.5">
          <div className="w-9 h-9 bg-red-50 rounded-lg flex items-center justify-center"><i className="fa-solid fa-right-from-bracket text-destructive text-sm" /></div>
          <span className="text-sm font-semibold text-destructive flex-1 text-left">Se déconnecter</span>
          <i className="fa-solid fa-chevron-right text-dots-inactive text-sm" />
        </button>
      </div>

      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-8" style={{ maxWidth: 480, margin: '0 auto' }}>
          <div className="bg-card rounded-2xl p-6 w-full text-center">
            <i className="fa-solid fa-right-from-bracket text-destructive text-3xl mb-3" />
            <h3 className="font-gaming text-base text-foreground mb-2">Se déconnecter ?</h3>
            <p className="text-sm text-muted-foreground mb-6">Tu devras te reconnecter pour accéder à ton compte.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowLogoutConfirm(false)} className="flex-1 h-11 border border-border rounded-xl text-sm text-foreground">Annuler</button>
              <button onClick={handleLogout} className="flex-1 h-11 bg-destructive text-primary-foreground rounded-xl text-sm font-semibold">Déconnexion</button>
            </div>
          </div>
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50" style={{ maxWidth: 480, margin: '0 auto' }}>
          <div className="bg-card rounded-t-2xl p-6 w-full">
            <h3 className="font-gaming text-base text-foreground mb-4">Modifier mes informations</h3>
            <div className="space-y-3 mb-6">
              <input value={editForm.telephone} onChange={e => setEditForm(p => ({ ...p, telephone: e.target.value }))}
                placeholder="Téléphone" className="w-full h-12 rounded-xl border border-border px-4 text-sm input-glow focus:outline-none" />
              <select value={editForm.langue_gabonaise} onChange={e => setEditForm(p => ({ ...p, langue_gabonaise: e.target.value }))}
                className="w-full h-12 rounded-xl border border-border px-4 text-sm input-glow focus:outline-none appearance-none">
                <option value="">Langue gabonaise</option>
                {['Fang', 'Myene', 'Punu', 'Nzebi', 'Kota'].map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setEditing(false)} className="flex-1 h-11 border border-border rounded-xl text-sm">Annuler</button>
              <button onClick={saveEdit} className="flex-1 h-11 bg-primary text-primary-foreground rounded-xl text-sm font-semibold">Enregistrer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
