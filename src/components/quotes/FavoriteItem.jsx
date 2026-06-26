import React from "react";
import { Heart, Share2 } from "lucide-react";
import { motion } from "framer-motion";

export default function FavoriteItem({ quote, onRemove, onShare, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="group relative border-b border-stone-100 last:border-0"
    >
      <div className="px-6 py-6 md:px-8 md:py-7">
        <p className="text-lg md:text-xl font-heading font-light leading-relaxed text-stone-800">
          "{quote.text}"
        </p>
        <div className="mt-3 flex items-center justify-between">
          <p className="text-xs tracking-widest uppercase text-stone-400">
            {quote.author}
          </p>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onShare(quote)}
              className="p-2 rounded-full hover:bg-sky-50 transition-colors"
            >
              <Share2 className="w-4 h-4 text-stone-400 hover:text-sky-500" />
            </button>
            <button
              onClick={() => onRemove(quote.id)}
              className="p-2 rounded-full hover:bg-rose-50 transition-colors"
            >
              <Heart className="w-4 h-4 fill-rose-500 text-rose-500 hover:fill-rose-600" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
