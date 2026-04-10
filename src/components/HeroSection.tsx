import { motion, AnimatePresence } from "framer-motion";
import { MONTH_THEMES } from "@/lib/dateHelpers";
import heroBanner from "@/assets/hero-banner.jpg";

interface HeroSectionProps {
  currentMonth: Date;
}

export function HeroSection({ currentMonth }: HeroSectionProps) {
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const monthName = currentMonth.toLocaleDateString("en-US", { month: "long" }).toUpperCase();
  const theme = MONTH_THEMES[month];

  return (
    <div className="relative w-full overflow-hidden">
      {/* Spiral binding effect */}
      <div className="relative z-10 flex justify-center gap-2.5 py-2 md:gap-3">
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: -12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: i * 0.025, duration: 0.3, type: "spring", stiffness: 300 }}
            className="h-3.5 w-3.5 rounded-full border-2 border-muted-foreground/25 bg-background shadow-sm md:h-4 md:w-4"
          />
        ))}
      </div>

      {/* Hero Image with animated gradient overlay */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${year}-${month}`}
          className="relative aspect-[2/1] w-full overflow-hidden md:aspect-[3/1]"
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Base image */}
          <img
            src={heroBanner}
            alt="Adventure landscape for the calendar"
            className="h-full w-full object-cover"
            width={1920}
            height={960}
          />

          {/* Animated gradient overlay per month */}
          <motion.div
            className={`absolute inset-0 bg-gradient-to-br ${theme.gradient} mix-blend-overlay`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ duration: 1 }}
          />

          {/* Dark cinematic overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

          {/* Animated particles/bokeh effect */}
          <div className="absolute inset-0 overflow-hidden">
            {Array.from({ length: 6 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-white/10"
                style={{
                  width: 8 + Math.random() * 20,
                  height: 8 + Math.random() * 20,
                  left: `${15 + Math.random() * 70}%`,
                  top: `${10 + Math.random() * 80}%`,
                }}
                animate={{
                  y: [0, -30, 0],
                  opacity: [0.1, 0.4, 0.1],
                  scale: [1, 1.3, 1],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: i * 0.5,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>

          {/* Blue geometric accent (matching reference) */}
          <motion.div
            className="absolute bottom-0 right-0"
            initial={{ x: 120, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <svg viewBox="0 0 300 200" className="h-28 w-44 md:h-44 md:w-64" preserveAspectRatio="none">
              <defs>
                <linearGradient id="triGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" className="[stop-color:hsl(from_var(--primary)_h_s_l)]" stopOpacity="0.9" />
                  <stop offset="100%" className="[stop-color:hsl(from_var(--primary)_h_s_calc(l+0.15))]" stopOpacity="1" />
                </linearGradient>
              </defs>
              <polygon points="300,0 300,200 0,200" fill="url(#triGrad)" className="fill-primary" />
            </svg>
          </motion.div>

          {/* Year + Month text */}
          <motion.div
            className="absolute bottom-4 right-4 z-10 text-right md:bottom-6 md:right-8"
            initial={{ y: 25, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <AnimatePresence mode="wait">
              <motion.div key={`${year}-${monthName}`}>
                <motion.p
                  initial={{ y: 12, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -12, opacity: 0 }}
                  className="text-lg font-light tracking-[0.2em] text-primary-foreground/90 md:text-2xl"
                >
                  {year}
                </motion.p>
                <motion.h1
                  initial={{ y: 12, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -12, opacity: 0 }}
                  transition={{ delay: 0.08 }}
                  className="text-3xl font-black tracking-tight text-primary-foreground drop-shadow-lg md:text-5xl"
                >
                  {monthName}
                </motion.h1>
                {/* Tagline */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="mt-1 text-xs font-medium tracking-wider text-primary-foreground/60 md:text-sm"
                >
                  {theme.accent} {theme.tagline}
                </motion.p>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
