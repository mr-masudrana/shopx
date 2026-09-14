"use client";

import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface SearchInputProps {
  compact?: boolean;
}

export default function SearchInput({
  compact = false,
}: SearchInputProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      router.push("/search");
      return;
    }

    router.push(
      `/search?q=${encodeURIComponent(trimmedQuery)}`
    );
  };

  const clearSearch = () => {
    setQuery("");
    router.push("/search");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`relative flex items-center ${
        compact ? "w-full" : "w-full max-w-xl"
      }`}
    >
      <Search
        size={19}
        className="absolute left-3 text-zinc-400"
      />

      <input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search products..."
        aria-label="Search products"
        className="w-full rounded-xl border border-zinc-200 bg-white py-3 pl-10 pr-24 text-sm outline-none transition focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-900"
      />

      {query.length > 0 && (
        <button
          type="button"
          onClick={clearSearch}
          className="absolute right-14 text-zinc-400 transition hover:text-zinc-700 dark:hover:text-zinc-200"
          aria-label="Clear search"
        >
          <X size={17} />
        </button>
      )}

      <button
        type="submit"
        className="absolute right-1.5 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-blue-700"
      >
        Search
      </button>
    </form>
  );
}