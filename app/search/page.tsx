import { Suspense } from "react";
import SearchPageContent from "./SearchPageContent";

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="animate-pulse text-zinc-500">
            Loading search...
          </div>
        </main>
      }
    >
      <SearchPageContent />
    </Suspense>
  );
}