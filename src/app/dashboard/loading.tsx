export default function DashboardLoading() {
  return (
    <div className="flex flex-col gap-6 animate-pulse">
      <div className="h-6 w-32 rounded-full bg-zinc-100" />
      <div className="h-16 rounded-xl bg-zinc-100" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-3 rounded-xl border border-zinc-100 p-5">
            <div className="h-4 w-3/4 rounded-full bg-zinc-100" />
            <div className="h-3 w-full rounded-full bg-zinc-100" />
            <div className="h-3 w-2/3 rounded-full bg-zinc-100" />
            <div className="mt-2 h-px bg-zinc-100" />
            <div className="h-3 w-1/4 rounded-full bg-zinc-100" />
          </div>
        ))}
      </div>
    </div>
  );
}
