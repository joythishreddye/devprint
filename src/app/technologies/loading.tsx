export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 animate-pulse">
      <div className="mb-10">
        <div className="h-9 w-64 rounded bg-zinc-200 mb-3" />
        <div className="h-4 w-96 rounded bg-zinc-100" />
      </div>
      {/* Category pill skeletons */}
      <div className="mb-8 flex flex-wrap gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-8 w-24 rounded-full bg-zinc-200" />
        ))}
      </div>
      {/* Card skeletons */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-zinc-200 bg-white p-5">
            <div className="flex items-start justify-between gap-2 mb-3">
              <div className="h-5 w-24 rounded bg-zinc-200" />
              <div className="h-5 w-20 rounded-full bg-zinc-100" />
            </div>
            <div className="space-y-2 mb-4">
              <div className="h-3 w-full rounded bg-zinc-100" />
              <div className="h-3 w-5/6 rounded bg-zinc-100" />
            </div>
            <div className="flex gap-3">
              <div className="h-3 w-16 rounded bg-zinc-100" />
              <div className="h-3 w-12 rounded bg-zinc-100" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
