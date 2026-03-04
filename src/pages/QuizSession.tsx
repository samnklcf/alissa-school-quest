import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { quizAPI } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { QuizQuestion, QuizResult } from '@/types';

const QuizSession = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<any>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    quizAPI.get(id!).then(r => {
      const d = r.data.data || r.data;
      setQuiz(d);
      setQuestions(d.questions || []);
      setLoading(false);
    });
  }, [id]);

  const handleAnswer = (index: number) => {
    if (showFeedback) return;
    setSelected(index);
    setShowFeedback(true);
    const newAnswers = [...answers, index];
    setAnswers(newAnswers);
    setTimeout(() => {
      if (current < questions.length - 1) {
        setCurrent(c => c + 1);
        setSelected(null);
        setShowFeedback(false);
      } else {
        setSubmitting(true);
        quizAPI.submit(id!, newAnswers).then(r => { setResult(r.data.data || r.data); setSubmitting(false); }).catch(() => setSubmitting(false));
      }
    }, 1200);
  };

  if (loading || submitting) return (
    <div className="flex flex-col items-center justify-center min-h-dvh gap-3">
      <i className="fa-solid fa-spinner fa-spin text-primary text-2xl" />
      {submitting && <p className="text-sm text-muted-foreground">Envoi des réponses...</p>}
    </div>
  );

  if (result) {
    const pct = result.pourcentage;
    const color = pct >= 70 ? 'text-success' : pct >= 50 ? 'text-warning' : 'text-destructive';
    const icon = pct >= 70 ? 'fa-star' : pct >= 50 ? 'fa-face-meh' : 'fa-face-sad-cry';
    return (
      <div className="min-h-dvh bg-background">
        <div className="bg-header p-8 text-center">
          <i className={`fa-solid ${icon} text-5xl ${color} mb-4`} />
          <div className="flex items-baseline justify-center">
            <span className={`font-gaming text-5xl ${color}`}>{result.score}</span>
            <span className="font-gaming text-xl text-inactive ml-1">/ {result.total}</span>
          </div>
        </div>
        <div className="px-4 -mt-4 space-y-4">
          <div className="bg-card rounded-2xl p-5 text-center">
            {result.points_gagnes >= 0 ? (
              <div className="flex items-center justify-center gap-2">
                <i className="fa-solid fa-arrow-trend-up text-success text-xl" />
                <span className="font-gaming text-[28px] text-success">+{result.points_gagnes} XP</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <i className="fa-solid fa-arrow-trend-down text-destructive text-xl" />
                <span className="font-gaming text-[28px] text-destructive">{result.points_gagnes} XP</span>
              </div>
            )}
          </div>
          {result.points_update && (
            <div className="bg-card rounded-2xl p-5">
              <p className="text-sm text-muted-foreground mb-2">Progression matière</p>
              <p className="font-gaming text-lg text-foreground">{result.points_update.newMatierePoints} XP — LV {result.points_update.newNiveau}</p>
              <div className="h-2 bg-border rounded-full mt-2 overflow-hidden">
                <motion.div className="h-full bg-primary rounded-full" initial={{ width: '0%' }}
                  animate={{ width: `${(result.points_update.newMatierePoints % 200) / 200 * 100}%` }} transition={{ duration: 1 }} />
              </div>
            </div>
          )}
          {result.nouveaux_badges && result.nouveaux_badges.length > 0 && (
            <div className="space-y-2">
              {result.nouveaux_badges.map((b, i) => (
                <motion.div key={i} initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: i * 0.2, duration: 0.45, type: 'spring' }}
                  className="bg-amber-50 border border-accent rounded-xl p-4 flex items-center gap-3 glow-gold">
                  <i className="fa-solid fa-medal text-accent text-3xl" />
                  <div>
                    <p className="font-gaming text-sm text-foreground">{b.nom}</p>
                    <p className="text-xs text-muted-foreground">{b.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
          <button onClick={() => navigate(-1)} className="w-full h-[52px] bg-primary text-primary-foreground font-semibold rounded-xl flex items-center justify-center gap-2">
            <i className="fa-solid fa-arrow-left" /> Retour à la matière
          </button>
        </div>
      </div>
    );
  }

  const q = questions[current];
  const correctAnswer = q?.correct_answer;
  const sourceChip = quiz?.source === 'cours' ? { text: 'COURS', bg: 'bg-secondary', color: 'text-secondary-foreground' } :
    quiz?.source === 'admin' ? { text: 'ADMIN', bg: 'bg-orange-50', color: 'text-warning' } :
    { text: 'MENSUEL', bg: 'bg-emerald-50', color: 'text-success' };

  return (
    <div className="min-h-dvh bg-background">
      <div className="bg-header px-4 py-4">
        <div className="flex items-center mb-3">
          <button onClick={() => navigate(-1)} className="text-inactive"><i className="fa-solid fa-xmark" /></button>
          <p className="text-sm text-primary-foreground flex-1 text-center truncate">{quiz?.titre}</p>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
          <div className="h-full bg-accent rounded-full transition-all" style={{ width: `${((current + 1) / questions.length) * 100}%` }} />
        </div>
        <p className="font-gaming text-[13px] text-accent text-right mt-1">{current + 1} / {questions.length}</p>
      </div>
      <div className="px-5 py-5">
        <span className={`${sourceChip.bg} ${sourceChip.color} text-[11px] font-gaming px-3 py-1 rounded-full`}>{sourceChip.text}</span>
        <AnimatePresence mode="wait">
          <motion.div key={current} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="bg-card rounded-[14px] p-5 border border-border mt-4 mb-5">
              <p className="text-[17px] font-semibold text-foreground leading-relaxed">{q?.question}</p>
            </div>
            <div className="space-y-2.5">
              {q?.options.map((opt, i) => {
                const letter = ['A', 'B', 'C', 'D'][i];
                let optClass = 'bg-card border-border';
                let letterClass = 'bg-background text-muted-foreground';
                let endIcon = null;
                if (showFeedback) {
                  if (i === correctAnswer) {
                    optClass = 'bg-emerald-50 border-success';
                    letterClass = 'bg-success text-primary-foreground';
                    if (selected === i) endIcon = <i className="fa-solid fa-circle-check text-success animate-pop-in" />;
                  } else if (i === selected && i !== correctAnswer) {
                    optClass = 'bg-red-50 border-destructive';
                    letterClass = 'bg-destructive text-primary-foreground';
                    endIcon = <i className="fa-solid fa-circle-xmark text-destructive animate-pop-in" />;
                  }
                }
                return (
                  <button key={i} onClick={() => handleAnswer(i)} disabled={showFeedback}
                    className={`w-full ${optClass} border rounded-xl p-4 flex items-center gap-3 transition-all`}>
                    <div className={`w-8 h-8 rounded-lg ${letterClass} flex items-center justify-center font-gaming text-[13px]`}>{letter}</div>
                    <span className="text-sm text-foreground text-left flex-1">{opt}</span>
                    {endIcon}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default QuizSession;
