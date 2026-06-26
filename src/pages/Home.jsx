import React, { useState, useCallback, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { getRandomQuote } from "@/lib/quotes";
import { Heart, Copy, Share2, Twitter, RefreshCw, Bookmark } from "lucide-react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

const FavoriteQuote = base44.entities.FavoriteQuote;

const THEMES = [
  { bg: "160deg, #f9eaff 0%, #fce8f3 50%, #ede8ff 100%", accent: "#a855f7", bar: "#d8b4fe", btn: "#c026d3, #9333ea" },
  { bg: "160deg, #fef3c7 0%, #fde68a 30%, #fef9ee 100%", accent: "#d97706", bar: "#fbbf24", btn: "#f59e0b, #d97706" },
  { bg: "160deg, #dcfce7 0%, #bbf7d0 30%, #ecfdf5 100%", accent: "#16a34a", bar: "#4ade80", btn: "#22c55e, #15803d" },
  { bg: "160deg, #dbeafe 0%, #bfdbfe 30%, #eff6ff 100%", accent: "#2563eb", bar: "#60a5fa", btn: "#3b82f6, #1d4ed8" },
  { bg: "160deg, #ffe4e6 0%, #fecdd3 30%, #fff1f2 100%", accent: "#e11d48", bar: "#fb7185", btn: "#f43f5e, #be123c" },
  { bg: "160deg, #e0f2fe 0%, #bae6fd 30%, #f0f9ff 100%", accent: "#0284c7", bar: "#38bdf8", btn: "#0ea5e9, #0369a1" },
  { bg: "160deg, #f0fdf4 0%, #d1fae5 30%, #ecfdf5 100%", accent: "#059669", bar: "#34d399", btn: "#10b981, #047857" },
  { bg: "160deg, #fdf4ff 0%, #f5d0fe 30%, #fae8ff 100%", accent: "#9333ea", bar: "#e879f9", btn: "#a855f7, #7c3aed" },
  { bg: "160deg, #fff7ed 0%, #fed7aa 30%, #fff8f0 100%", accent: "#ea580c", bar: "#fb923c", btn: "#f97316, #c2410c" },
  { bg: "160deg, #f8fafc 0%, #e2e8f0 30%, #f1f5f9 100%", accent: "#475569", bar: "#94a3b8", btn: "#64748b, #334155" },
];

let themeIndex = 0;
function getNextTheme() {
  themeIndex = (themeIndex + 1) % THEMES.length;
  return THEMES[themeIndex];
}

export default function Home() {
  const [quote, setQuote] = useState(() => getRandomQuote());
  const [theme, setTheme] = useState(THEMES[0]);
  const [favorites, setFavorites] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    FavoriteQuote.list().then(setFavorites);
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const isFavorited = favorites.some(
    (f) => f.text === quote.text && f.author === quote.author
  );

  const handleNewQuote = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      setQuote(getRandomQuote());
      setTheme(getNextTheme());
      setIsAnimating(false);
    }, 300);
  }, [isAnimating]);

  const handleToggleFavorite = async () => {
    if (isFavorited) {
      const fav = favorites.find(
        (f) => f.text === quote.text && f.author === quote.author
      );
      if (fav) {
        await FavoriteQuote.delete(fav.id);
        setFavorites((prev) => prev.filter((f) => f.id !== fav.id));
        showToast("Removed from saved");
      }
    } else {
      const created = await FavoriteQuote.create({ text: quote.text, author: quote.author });
      setFavorites((prev) => [...prev, created]);
      showToast("Quote saved!");
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(`"${quote.text}" — ${quote.author}`);
    setCopied(true);
    showToast("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    const text = `"${quote.text}" — ${quote.author}`;
    if (navigator.share) {
      try { await navigator.share({ text }); } catch (_) {}
    } else {
      await navigator.clipboard.writeText(text);
      showToast("Copied to clipboard!");
    }
  };

  const handleTwitter = () => {
    const text = encodeURIComponent(`"${quote.text}" — ${quote.author}`);
    window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
  };

  return (
    <div className="min-h-screen flex flex-col transition-all duration-700" style={{ background: `linear-gradient(${theme.bg})` }}>

      {/* Header */}
      <header className="flex items-center justify-between px-6 pt-8 pb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold" style={{ color: theme.accent }}>"</span>
          <span className="text-xs font-bold tracking-[0.25em] uppercase" style={{ color: theme.accent }}>
            Daily Wisdom
          </span>
        </div>
        <Link to="/favorites" className="relative">
          <div className="w-9 h-9 rounded-full border border-gray-200 bg-white/60 flex items-center justify-center shadow-sm">
            <Bookmark className="w-4 h-4 text-gray-500" />
          </div>
          {favorites.length > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-gray-900 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {favorites.length}
            </span>
          )}
        </Link>
      </header>

      {/* Quote area */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 pb-8">
        {/* Decorative quote bars */}
        <div className="w-full max-w-sm mb-4 flex gap-1.5 pl-1">
          <div className="w-1 h-8 rounded-full" style={{ background: theme.bar }} />
          <div className="w-1 h-8 rounded-full" style={{ background: theme.bar }} />
        </div>

        {/* White Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={quote.text}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-sm bg-white rounded-3xl shadow-lg px-7 py-8"
          >
            <p className="text-gray-900 text-xl font-semibold leading-snug">
              {quote.text}
            </p>
            <hr className="my-5 border-gray-100" />
            <p className="font-medium" style={{ color: theme.accent }}>
              — {quote.author}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Action icons */}
        <div className="flex items-center gap-5 mt-8">
          {[
            {
              icon: <Heart className={`w-5 h-5 ${isFavorited ? "fill-rose-500 text-rose-500" : "text-gray-400"}`} />,
              onClick: handleToggleFavorite,
            },
            {
              icon: <Copy className={`w-5 h-5 ${copied ? "text-purple-500" : "text-gray-400"}`} />,
              onClick: handleCopy,
            },
            {
              icon: <Share2 className="w-5 h-5 text-gray-400" />,
              onClick: handleShare,
            },
            {
              icon: <Twitter className="w-5 h-5 text-gray-400" />,
              onClick: handleTwitter,
            },
          ].map((btn, i) => (
            <motion.button
              key={i}
              whileTap={{ scale: 0.85 }}
              onClick={btn.onClick}
              className="w-12 h-12 rounded-full bg-white/70 border border-gray-100 shadow-sm flex items-center justify-center hover:bg-white transition-colors"
            >
              {btn.icon}
            </motion.button>
          ))}
        </div>

        {/* New Quote button */}
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={handleNewQuote}
          className="mt-6 flex items-center gap-3 px-10 py-4 rounded-full text-white font-semibold text-base shadow-lg"
          style={{ background: `linear-gradient(135deg, ${theme.btn})` }}
        >
          <RefreshCw className="w-4 h-4" />
          New Quote
        </motion.button>

        <p className="mt-5 text-xs text-gray-400 tracking-wide">
          50 quotes · swipe for next
        </p>
      </main>

      {/* Footer hint */}
      <p className="text-center text-xs tracking-widest uppercase text-gray-300 pb-6">
        Tap for inspiration
      </p>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            key="toast"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-sm font-medium px-5 py-3 rounded-full shadow-xl whitespace-nowrap"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}