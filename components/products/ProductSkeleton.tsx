export default function ProductSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white">
      {/* Image Skeleton */}
      <div className="aspect-square animate-pulse bg-gray-200" />

      {/* Content Skeleton */}
      <div className="space-y-3 p-4">
        <div className="h-3 w-20 animate-pulse rounded bg-gray-200" />

        <div className="h-4 w-full animate-pulse rounded bg-gray-200" />

        <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />

        <div className="flex items-center justify-between pt-2">
          <div className="h-5 w-20 animate-pulse rounded bg-gray-200" />

          <div className="h-8 w-8 animate-pulse rounded-lg bg-gray-200" />
        </div>
      </div>
    </div>
  );
}