export default function Loading(): React.ReactElement {
  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="mx-auto max-w-4xl animate-pulse px-4 py-10">
        <div className="mb-8">
          <div className="h-7 w-56 rounded bg-zinc-200" />
          <div className="mt-2 h-4 w-80 rounded bg-zinc-100" />
        </div>

        <div className="mb-8 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex gap-4">
            <div className="h-10 flex-1 rounded-lg bg-zinc-100" />
            <div className="h-10 flex-1 rounded-lg bg-zinc-100" />
          </div>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-4">
          {[0, 1].map((i) => (
            <div key={i} className="rounded-xl border border-zinc-200 bg-white p-5">
              <div className="mb-3 h-6 w-24 rounded bg-zinc-200" />
              <div className="mb-2 h-4 w-full rounded bg-zinc-100" />
              <div className="h-4 w-3/4 rounded bg-zinc-100" />
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-6">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="mb-4">
              <div className="mb-2 h-4 w-32 rounded bg-zinc-200" />
              <div className="grid grid-cols-2 gap-3">
                <div className="h-3 rounded-full bg-zinc-100" />
                <div className="h-3 rounded-full bg-zinc-100" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
