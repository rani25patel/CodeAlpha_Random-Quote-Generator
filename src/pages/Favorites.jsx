import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { ArrowLeft, Heart, Share2, Bookmark, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

const FavoriteQuote = base44.entities.FavoriteQuote;

const cardColors = [
  { bg: "from-violet-500 to-purple-600" },
  { bg: "from-rose-500 to-pink-600" },
  { bg: "from-sky-500 to-blue-600" },
  { bg: "from-emerald-500 to-teal-600" },
  { bg: "from-amber-500 to-orange-600" },
  { bg: "from-indigo-500 to-violet-600" },
];

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    FavoriteQuote.list("-created_date").then((data) => {
      setFavorites(data);
      setLoading(false);
    });
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const handleRemove = async (id) => {
    await FavoriteQuote.delete(id);
    setFavorites((prev) => prev.filter((f) => f.id !== id));
    showToast("Removed from saved quotes");
  };

  const handleShare = async (quote) => {
    const shareText = `"${quote.text}"\n— ${quote.author}`;
    if (navigator.share) {
      try { await navigator.share({ text: shareText }); } catch (_) {}
    } else {
      await navigator.clipboard.writeText(shareText);
      showToast("Copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-2xl mx-auto flex items-center gap-3 px-5 py-4">
          <Link
            to="/"
            className="p-2 -ml-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div className="flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-violet-500" />
            <h1 className="text-base font-semibold text-gray-800">
              Saved Quotes
            </h1>
          </div>
          {favorites.length > 0 && (
            <span className="ml-auto text-xs font-medium text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
              {favorites.length} {favorites.length === 1 ? "quote" : "quotes"}
            </span>
          )}
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 max-w-2xl w-full mx-auto px-5 py-6">
        {loading ? (
          <div className="flex items-center justify-center py-40">
            <div className="w-8 h-8 border-3 border-violet-200 border-t-violet-500 rounded-full animate-spin" />
          </div>
        ) : favorites.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-32 text-center"
          >
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-violet-100 to-pink-100 flex items-center justify-center mb-5 shadow-inner">
              <Heart className="w-9 h-9 text-violet-400" />
            </div>
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              No saved quotes yet
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Tap the heart on any quote to save it here for later
            </p>
            <Link
              to="/"
              className="mt-7 px-6 py-2.5 rounded-full bg-gradient-to-r from-violet-500 to-purple-600 text-white text-sm font-medium shadow-lg shadow-violet-200 hover:shadow-violet-300 transition-shadow"
            >
              Browse Quotes
            </Link>
          </motion.div>
        ) : (
          <AnimatePresence>
            <div className="grid gap-4">
              {favorites.map((fav, i) => {
                const color = cardColors[i % cardColors.length];
                return (
                  <motion.div
                    key={fav.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -30, scale: 0.95 }}
                    transition={{ duration: 0.35, delay: i * 0.04 }}
                    className={`relative rounded-2xl bg-gradient-to-br ${color.bg} p-6 shadow-md overflow-hidden`}
                  >
                    {/* Decorative quote mark */}
                    <div className="absolute top-0 right-4 text-white/10 text-8xl font-serif leading-none select-none">
                      "
                    </div>

                    <p className="relative text-white text-base md:text-lg font-light leading-relaxed">
                      "{fav.text}"
                    </p>
                    <div className="flex items-center justify-between mt-4">
                      <p className="text-white/70 text-xs tracking-widest uppercase font-medium">
                        — {fav.author}
                      </p>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleShare(fav)}
                          className="p-2 rounded-full bg-white/15 hover:bg-white/25 transition-colors"
                        >
                          <Share2 className="w-3.5 h-3.5 text-white" />
                        </button>
                        <button
                          onClick={() => handleRemove(fav.id)}
                          className="p-2 rounded-full bg-white/15 hover:bg-white/25 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-white" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </AnimatePresence>
        )}
      </main>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            key="toast"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-sm font-medium px-5 py-3 rounded-full shadow-xl"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
