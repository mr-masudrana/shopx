"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Smartphone,
  Shirt,
  Sparkles,
  Home,
  Laptop,
  Watch,
} from "lucide-react";

const categories = [
  {
    name: "Smartphones",
    slug: "smartphones",
    icon: Smartphone,
  },
  {
    name: "Laptops",
    slug: "laptops",
    icon: Laptop,
  },
  {
    name: "Fashion",
    slug: "mens-shirts",
    icon: Shirt,
  },
  {
    name: "Beauty",
    slug: "beauty",
    icon: Sparkles,
  },
  {
    name: "Home",
    slug: "furniture",
    icon: Home,
  },
  {
    name: "Watches",
    slug: "mens-watches",
    icon: Watch,
  },
];

export default function Categories() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <p className="text-sm font-semibold text-indigo-600">
            EXPLORE
          </p>

          <h2 className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
            Shop by Category
          </h2>
        </div>

        <Link
          href="/shop"
          className="text-sm font-semibold text-indigo-600 transition hover:text-indigo-700"
        >
          See All →
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-3 sm:grid-cols-6 sm:gap-4">
        {categories.map((category, index) => {
          const Icon = category.icon;

          return (
            <motion.div
              key={category.slug}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.3,
                delay: index * 0.05,
              }}
            >
              <Link
                href={`/category/${encodeURIComponent(
                  category.slug
                )}`}
                className="group flex flex-col items-center rounded-2xl border border-gray-100 bg-white p-3 text-center shadow-sm transition-all hover:-translate-y-1 hover:border-indigo-100 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-indigo-900 sm:p-5"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white dark:bg-indigo-950/40 sm:h-14 sm:w-14">
                  <Icon size={24} />
                </div>

                <span className="mt-3 line-clamp-1 text-xs font-semibold text-gray-700 dark:text-zinc-200 sm:text-sm">
                  {category.name}
                </span>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}