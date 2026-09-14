"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

export default function HeroBanner() {
  return (
    <section className="overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 md:py-20 lg:grid-cols-2 lg:px-8">
        {/* Content */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-xl"
        >
          <span className="mb-5 inline-flex items-center gap-2 rounded-full bg-indigo-100 px-4 py-2 text-xs font-semibold text-indigo-700">
            <Sparkles size={14} />
            New collection is here
          </span>

          <h1 className="text-4xl font-bold leading-tight tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            Discover Your
            <span className="block text-indigo-600">Perfect Style</span>
          </h1>

          <p className="mt-5 max-w-lg text-base leading-7 text-gray-600 sm:text-lg">
            Explore our curated collection of products designed to make
            everyday shopping simple, enjoyable, and inspiring.
          </p>

          <Link
            href="/shop"
            className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5 hover:bg-indigo-700"
          >
            Shop Now
            <ArrowRight size={17} />
          </Link>
        </motion.div>

        {/* Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="relative mx-auto w-full max-w-lg"
        >
          <div className="relative aspect-square overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200 shadow-2xl shadow-indigo-100">
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="text-center">
                <div className="mx-auto mb-5 flex h-24 w-24 items-center justify-center rounded-3xl bg-white/70 text-5xl shadow-xl backdrop-blur-sm">
                  🛍️
                </div>

                <p className="text-lg font-bold text-indigo-900">
                  Your Shopping Journey
                </p>

                <p className="mt-1 text-sm text-indigo-700">Starts Here</p>
              </div>
            </motion.div>

            <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-white/30 blur-2xl" />
            <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-purple-300/40 blur-2xl" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}