
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

const quotes = [
  "The secret of getting ahead is getting started.",
  "Small daily improvements are the key to staggering long-term results.",
  "The only way to do great work is to love what you do.",
  "Take care of your body. It's the only place you have to live.",
  "Your mind will take the shape of what you frequently hold in thought.",
  "Learning is not attained by chance, it must be sought for with ardor and diligence.",
  "The time to relax is when you don't have time for it.",
  "Self-care is not self-indulgence, it is self-preservation.",
  "Happiness can be found even in the darkest of times, if one only remembers to turn on the light.",
  "You are never too old to set another goal or to dream a new dream."
];

const authors = [
  "Mark Twain",
  "Robin Sharma",
  "Steve Jobs",
  "Jim Rohn",
  "Marcus Aurelius",
  "Abigail Adams",
  "Sydney J. Harris",
  "Audre Lorde",
  "Albus Dumbledore",
  "C.S. Lewis"
];

const QuoteDisplay = () => {
  const [index, setIndex] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFadeIn(false);
      setTimeout(() => {
        setIndex((prevIndex) => (prevIndex + 1) % quotes.length);
        setFadeIn(true);
      }, 1000);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const variants = {
    visible: { opacity: 1, y: 0 },
    hidden: { opacity: 0, y: 20 }
  };

  return (
    <div className="glass-panel rounded-2xl p-6 my-8">
      <div className="flex items-start space-x-4">
        <div className="p-3 bg-primary/10 rounded-full text-primary">
          <Quote className="w-5 h-5" />
        </div>
        
        <motion.div
          animate={fadeIn ? "visible" : "hidden"}
          variants={variants}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="flex-1"
        >
          <p className="text-lg font-medium text-foreground mb-2">
            "{quotes[index]}"
          </p>
          <p className="text-muted-foreground text-sm">— {authors[index]}</p>
        </motion.div>
      </div>
    </div>
  );
};

export default QuoteDisplay;
