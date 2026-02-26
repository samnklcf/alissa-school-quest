import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { assistantAPI, eleveAPI } from '@/lib/api';
import { ChatMessage } from '@/types';
import TextRenderer from '@/components/TextRenderer';

const AssistantPage = () => {
  const { matiereId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: profile } = useQuery({ queryKey: ['profile'], queryFn: () => eleveAPI.profile().then(r => r.data.data || r.data) });
  const { data: quota } = useQuery({ queryKey: ['quota'], queryFn: () => assistantAPI.quota().then(r => r.data.data || r.data) });

  const matiere = matiereId ? profile?.matieres?.find((m: any) => m.id === matiereId) : null;
  const title = matiere ? `Alissa IA — ${matiere.nom}` : 'Alissa IA — Toutes matières';

  useEffect(() => {
    assistantAPI.history(matiereId).then(r => {
      const msgs = r.data.data || r.data || [];
      setMessages(Array.isArray(msgs) ? msgs : []);
    }).catch(() => {});
  }, [matiereId]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, sending]);

  const send = async () => {
    if (!input.trim() || sending || (quota && quota.messages_remaining <= 0)) return;
    const msg = input.trim();
    setInput('');
    setMessages(p => [...p, { role: 'user', content: msg }]);
    setSending(true);
    try {
      const { data } = await assistantAPI.chat({ message: msg, matiere_id: matiereId, history: messages.slice(-10) });
      setMessages(p => [...p, { role: 'assistant', content: data.data?.response || data.response }]);
      queryClient.invalidateQueries({ queryKey: ['quota'] });
    } catch {
      setMessages(p => [...p, { role: 'assistant', content: "Désolé, une erreur s'est produite." }]);
    } finally { setSending(false); }
  };

  const clearHistory = async () => {
    if (!confirm("Effacer l'historique de conversation ?")) return;
    await assistantAPI.clearHistory(matiereId).catch(() => {});
    setMessages([]);
  };

  const quickActions = matiereId
    ? ['Explique-moi le dernier cours', 'Donne-moi un exemple', 'Quiz rapide', 'Résume le chapitre']
    : ['Plan de révision', 'Quiz multi-matières', 'Ma matière la plus faible', 'Défi du jour'];

  const remaining = quota?.messages_remaining ?? 20;
  const quotaLow = remaining <= 5;

  return (
    <div className="flex flex-col h-dvh bg-background">
      <div className="bg-header px-4 py-3 flex items-center gap-3 shrink-0">
        <button onClick={() => navigate(-1)} className="text-inactive"><i className="fa-solid fa-arrow-left" /></button>
        <i className="fa-solid fa-robot text-primary text-lg animate-pulse-slow" />
        <h1 className="text-base font-semibold text-primary-foreground flex-1 truncate">{title}</h1>
        <span className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${quotaLow ? 'bg-red-50 text-destructive' : 'text-inactive'}`}>
          <i className="fa-solid fa-comment text-xs" /> {remaining} / 20
        </span>
        <button onClick={clearHistory} className="text-inactive"><i className="fa-solid fa-trash text-sm" /></button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.length === 0 && !sending && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <i className="fa-solid fa-robot text-primary text-5xl mb-4" />
            <h2 className="font-gaming text-base text-foreground mb-2">Pose ta première question</h2>
            <p className="text-sm text-muted-foreground">{matiere ? `Je suis spécialisé en ${matiere.nom}` : "Je peux t'aider dans toutes tes matières"}</p>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {m.role === 'assistant' && (
              <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center mr-2 shrink-0 mt-1">
                <i className="fa-solid fa-robot text-primary text-sm" />
              </div>
            )}
            <div className={`px-4 py-3 ${
              m.role === 'user'
                ? 'bg-primary text-primary-foreground rounded-[18px_18px_4px_18px] max-w-[75%]'
                : 'bg-card border border-border text-foreground rounded-[18px_18px_18px_4px] max-w-[80%]'
            }`}>
              {m.role === 'assistant' ? (
                <TextRenderer content={m.content} className="text-sm leading-relaxed" />
              ) : (
                <p className="text-sm leading-relaxed">{m.content}</p>
              )}
            </div>
          </div>
        ))}
        {sending && (
          <div className="flex justify-start">
            <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center mr-2 shrink-0">
              <i className="fa-solid fa-robot text-primary text-sm" />
            </div>
            <div className="bg-card border border-border rounded-[18px_18px_18px_4px] px-4 py-3 flex gap-1">
              {[0, 1, 2].map(i => (
                <div key={i} className="w-2 h-2 bg-inactive rounded-full animate-bounce-dot" style={{ animationDelay: `${i * 0.2}s` }} />
              ))}
            </div>
          </div>
        )}
      </div>

      {messages.length === 0 && (
        <div className="px-4 pb-2">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {quickActions.map((a, i) => (
              <button key={i} onClick={() => setInput(a)}
                className="shrink-0 bg-card border border-primary text-primary text-xs px-3.5 py-1.5 rounded-full whitespace-nowrap">{a}</button>
            ))}
          </div>
        </div>
      )}

      <div className="bg-card border-t border-border px-4 py-3 flex items-center gap-3 shrink-0">
        {remaining <= 0 ? (
          <p className="text-[13px] text-destructive flex-1 text-center">Quota journalier atteint — Reset à minuit</p>
        ) : (
          <>
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="Écris ta question..." disabled={remaining <= 0}
              className="flex-1 h-11 bg-background rounded-full px-4 text-sm text-foreground border-none focus:outline-none" />
            <button onClick={send} disabled={!input.trim() || sending || remaining <= 0}
              className="w-11 h-11 rounded-full bg-primary flex items-center justify-center disabled:opacity-50">
              <i className="fa-solid fa-paper-plane text-primary-foreground text-base" />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default AssistantPage;
