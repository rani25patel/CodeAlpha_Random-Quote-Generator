import React from "react";
import { Heart, Share2, Quote } from "lucide-react";
import { motion } from "framer-motion";

export default function QuoteCard({ quote, isFavorited, onToggleFavorite, onShare }) {
  return (
    <motion.div
      key={quote.text}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="relative px-8 py-12 md:px-14 md:py-16">
        <Quote className="absolute top-4 left-4 w-10 h-10 text-stone-200" />
        
        <p className="text-2xl md:text-3xl lg:text-4xl font-heading font-light leading-relaxed tracking-tight text-stone-800 text-center">
          {quote.text}
        </p>

        <div className="mt-8 flex items-center justify-center gap-2">
          <div className="w-8 h-px bg-stone-300" />
          <p className="text-sm md:text-base font-body tracking-widest uppercase text-stone-400">
            {quote.author}
          </p>
          <div className="w-8 h-px bg-stone-300" />
        </div>

        <div className="mt-10 flex items-center justify-center gap-3">
          <button
            onClick={onToggleFavorite}
            className="group p-3 rounded-full transition-all duration-300 hover:bg-rose-50 active:scale-90"
          >
            <Heart
              className={`w-5 h-5 transition-all duration-300 ${
                isFavorited
                  ? "fill-rose-500 text-rose-500 scale-110"
                  : "text-stone-400 group-hover:text-rose-400"
              }`}
            />
          </button>
          <button
            onClick={onShare}
            className="group p-3 rounded-full transition-all duration-300 hover:bg-sky-50 active:scale-90"
          >
            <Share2 className="w-5 h-5 text-stone-400 transition-colors group-hover:text-sky-500" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}