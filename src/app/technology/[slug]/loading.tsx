export default function Loading() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 animate-pulse">
      <div className="mb-10">
        <div className="h-5 w-28 rounded-full bg-zinc-200 mb-3" />
        <div className="h-9 w-64 rounded bg-zinc-200 mb-4" />
        <div className="space-y-2">
          <div className="h-4 w-full rounded bg-zinc-100" />
          <div className="h-4 w-5/6 rounded bg-zinc-100" />
          <div className="h-4 w-4/6 rounded bg-zinc-100" />
        </div>
      </div>
      <div className="mb-10 rounded-xl border border-zinc-200 bg-white p-6">
        <div className="h-4 w-24 rounded bg-zinc-200 mb-5" />
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-2">
              <div className="h-3 w-20 rounded bg-zinc-100" />
              <div className="h-4 w-16 rounded bg-zinc-200" />
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-xl border border-zinc-200 bg-white p-6">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="h-3 w-16 rounded bg-zinc-200" />
              {Array.from({ length: 3 }).map((__, j) => (
                <div key={j} className="h-3 rounded bg-zinc-100" />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
