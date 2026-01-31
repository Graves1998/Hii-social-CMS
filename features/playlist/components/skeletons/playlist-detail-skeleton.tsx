/**
 * Playlist Detail Skeleton
 *
 * Loading skeleton for playlist detail page
 * Shows form fields, video list, and player area
 */
export function PlaylistDetailSkeleton() {
  return (
    <div className="flex h-full flex-col gap-6">
      {/* Header Skeleton */}
      <div className="flex items-center gap-4 border-b border-white/10 pb-6">
        {/* Back Button */}
        <div className="h-10 w-10 animate-pulse bg-zinc-800" />
        {/* Title */}
        <div className="h-6 w-48 animate-pulse bg-zinc-800" />
      </div>

      <div className="grid flex-1 grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left Column - Video Player & List */}
        <div className="flex flex-col gap-6">
          {/* Video Player Skeleton */}
          <div className="aspect-video w-full animate-pulse bg-black">
            <div className="flex h-full items-center justify-center">
              <div className="h-16 w-16 rounded-full bg-zinc-800" />
            </div>
          </div>

          {/* Video Info Skeleton */}
          <div className="space-y-3 border-b border-white/10 pb-6">
            <div className="h-5 w-3/4 animate-pulse bg-zinc-800" />
            <div className="flex items-center gap-4">
              <div className="h-3 w-20 animate-pulse bg-zinc-800" />
              <div className="h-3 w-24 animate-pulse bg-zinc-800" />
            </div>
          </div>

          {/* Video List Skeleton */}
          <div className="space-y-2">
            <div className="h-4 w-32 animate-pulse bg-zinc-800" />
            <div className="space-y-2">
              {[...Array(4)].map((_, i) => (
                <div
                  key={`video-item-${i + 1}`}
                  className="flex items-center gap-3 border border-white/10 bg-zinc-900 p-3"
                >
                  {/* Drag Handle */}
                  <div className="h-5 w-5 animate-pulse bg-zinc-800" />
                  {/* Thumbnail */}
                  <div className="h-16 w-28 flex-shrink-0 animate-pulse bg-zinc-800" />
                  {/* Info */}
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-3/4 animate-pulse bg-zinc-800" />
                    <div className="h-3 w-1/2 animate-pulse bg-zinc-800" />
                  </div>
                  {/* Actions */}
                  <div className="flex gap-2">
                    <div className="h-8 w-8 animate-pulse bg-zinc-800" />
                    <div className="h-8 w-8 animate-pulse bg-zinc-800" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Form */}
        <div className="flex flex-col gap-6">
          <div className="rounded-none border border-white/10 bg-zinc-900 p-6">
            <div className="space-y-6">
              {/* Name Field */}
              <div className="space-y-2">
                <div className="h-3 w-24 animate-pulse bg-zinc-800" />
                <div className="h-10 w-full animate-pulse bg-zinc-800" />
              </div>

              {/* Description Field */}
              <div className="space-y-2">
                <div className="h-3 w-16 animate-pulse bg-zinc-800" />
                <div className="h-24 w-full animate-pulse bg-zinc-800" />
              </div>

              {/* Thumbnail Field */}
              <div className="space-y-2">
                <div className="h-3 w-20 animate-pulse bg-zinc-800" />
                <div className="h-40 w-full animate-pulse bg-zinc-800" />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 border-t border-white/10 pt-6">
                <div className="h-10 w-24 animate-pulse bg-zinc-800" />
                <div className="h-10 w-32 animate-pulse bg-zinc-800" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlaylistDetailSkeleton;
