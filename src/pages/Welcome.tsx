import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const slides = [
  {
    icon: 'fa-graduation-cap',
    iconBg: 'bg-secondary',
    iconColor: 'text-primary',
    chip: 'ALISSA SCHOOL',
    title: "Prépare ton Bac\navec l'IA",
    lineColor: 'bg-accent',
    subtitle: "La plateforme éducative conçue pour les Terminales du Gabon",
  },
  {
    icon: 'fa-robot',
    iconBg: 'bg-secondary',
    iconColor: 'text-primary',
    pulse: true,
    chips: [
      { text: 'ALISSA IA', bg: 'bg-secondary', color: 'text-primary' },
      { text: 'GPT-4o', bg: 'bg-emerald-50', color: 'text-success' },
    ],
    title: "Ton assistant\nintelligent",
    lineColor: 'bg-accent',
    features: [
      "Résumés de cours générés à la demande",
      "Quiz adaptatifs par matière et par série",
      "20 questions par jour, reset à minuit",
    ],
  },
  {
    icon: 'fa-trophy',
    iconBg: 'bg-amber-50',
    iconColor: 'text-accent',
    glow: true,
    title: "Monte en niveau",
    lineColor: 'bg-primary',
    levels: [
      { lv: 1, name: 'Apprenti' },
      { lv: 3, name: 'Maître', active: true },
      { lv: 5, name: 'Génie' },
    ],
  },
];

const Welcome = () => {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();
  const slide = slides[current];

  return (
    <div className="min-h-dvh bg-background flex flex-col relative overflow-hidden">
      {/* Background decorations */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.05 }}>
        <polygon points="60,10 90,30 90,70 60,90 30,70 30,30" fill="none" stroke="hsl(204 60% 49%)" strokeWidth="1" />
        <polygon points="350,80 380,100 380,140 350,160 320,140 320,100" fill="none" stroke="hsl(204 60% 49%)" strokeWidth="1" />
        <line x1="0" y1="200" x2="120" y2="160" stroke="hsl(204 60% 49%)" strokeWidth="0.5" />
        <polygon points="280,500 310,520 310,560 280,580 250,560 250,520" fill="none" stroke="hsl(204 60% 49%)" strokeWidth="1" />
        <line x1="400" y1="400" x2="300" y2="450" stroke="hsl(204 60% 49%)" strokeWidth="0.5" />
      </svg>

      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center text-center w-full"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className={`w-20 h-20 rounded-full ${slide.iconBg} flex items-center justify-center mb-5 ${'glow' in slide && slide.glow ? 'glow-gold' : ''}`}
            >
              <i className={`fa-solid ${slide.icon} text-4xl ${slide.iconColor} ${'pulse' in slide && slide.pulse ? 'animate-pulse-slow' : ''}`} />
            </motion.div>

            {'chip' in slide && slide.chip && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                className="bg-secondary text-secondary-foreground font-gaming text-[11px] px-4 py-1.5 rounded-full mb-4"
              >{slide.chip}</motion.div>
            )}

            {'chips' in slide && slide.chips && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="flex gap-2 mb-4">
                {slide.chips.map((c, i) => (
                  <span key={i} className={`${c.bg} ${c.color} font-gaming text-[11px] px-3 py-1.5 rounded-full`}>{c.text}</span>
                ))}
              </motion.div>
            )}

            <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="font-gaming text-[28px] text-foreground leading-tight mb-3 whitespace-pre-line"
            >{slide.title}</motion.h1>

            <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.4 }}
              className={`w-12 h-[3px] ${slide.lineColor} rounded-full mb-4`}
            />

            {'subtitle' in slide && slide.subtitle && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                className="text-[15px] text-muted-foreground"
              >{slide.subtitle}</motion.p>
            )}

            {'features' in slide && slide.features && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                className="bg-card rounded-xl p-4 w-full mt-4 space-y-3"
              >
                {slide.features.map((f, i) => (
                  <div key={i} className="flex items-center gap-3 text-left">
                    <i className="fa-solid fa-circle-check text-success text-sm shrink-0" />
                    <span className="text-sm text-foreground">{f}</span>
                  </div>
                ))}
              </motion.div>
            )}

            {'levels' in slide && slide.levels && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                className="flex gap-3 mt-6"
              >
                {slide.levels.map((l, i) => (
                  <div key={i} className={`rounded-xl px-5 py-3 text-center ${l.active ? 'border-2 border-primary glow-blue scale-110' : 'border border-border bg-card'}`}>
                    <div className="font-gaming text-xs text-primary">LV {l.lv}</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">{l.name}</div>
                  </div>
                ))}
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom */}
      <div className="px-6 pb-8 space-y-4">
        <div className="flex items-center justify-center gap-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className={`rounded-full transition-all duration-300 ${i === current ? 'w-2.5 h-2.5 bg-primary' : 'w-2 h-2 bg-dots-inactive'}`} />
          ))}
        </div>

        {current < 2 ? (
          <button onClick={() => setCurrent(current + 1)}
            className="w-full h-[50px] bg-primary text-primary-foreground font-semibold rounded-xl flex items-center justify-center gap-2"
          >Suivant <i className="fa-solid fa-arrow-right" /></button>
        ) : (
          <div className="space-y-3">
            <button onClick={() => navigate('/register')}
              className="w-full h-[50px] bg-primary text-primary-foreground font-semibold rounded-xl flex items-center justify-center gap-2"
            ><i className="fa-solid fa-user-plus" /> Créer un compte</button>
            <button onClick={() => navigate('/login')}
              className="w-full h-[50px] bg-transparent border-2 border-primary text-primary font-semibold rounded-xl flex items-center justify-center gap-2"
            ><i className="fa-solid fa-right-to-bracket" /> Se connecter</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Welcome;
