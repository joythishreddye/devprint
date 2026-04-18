export default function HomeLoading() {
  return (
    <div className="flex flex-col animate-pulse">
      {/* Hero skeleton */}
      <div className="bg-zinc-50 border-b border-zinc-200">
        <div className="mx-auto max-w-4xl px-4 py-24 sm:px-6 lg:px-8 text-center">
          <div className="mx-auto mb-4 h-4 w-40 rounded-full bg-zinc-200" />
          <div className="mx-auto h-12 w-3/4 rounded bg-zinc-200 mb-3" />
          <div className="mx-auto h-12 w-1/2 rounded bg-zinc-100 mb-6" />
          <div className="mx-auto h-4 w-2/3 rounded bg-zinc-100 mb-2" />
          <div className="mx-auto h-4 w-1/2 rounded bg-zinc-100 mb-10" />
          <div className="flex items-center justify-center gap-4">
            <div className="h-10 w-32 rounded-full bg-zinc-300" />
            <div className="h-10 w-40 rounded-full bg-zinc-200" />
          </div>
        </div>
      </div>
      {/* Cards skeleton */}
      <div className="bg-zinc-50 border-b border-zinc-200">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto mb-10 h-8 w-48 rounded bg-zinc-200" />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-zinc-200 bg-white p-5">
                <div className="mb-3 h-5 w-32 rounded bg-zinc-200" />
                <div className="space-y-2 mb-4">
                  <div className="h-3 w-full rounded bg-zinc-100" />
                  <div className="h-3 w-5/6 rounded bg-zinc-100" />
                </div>
                <div className="h-3 w-16 rounded bg-zinc-100" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
