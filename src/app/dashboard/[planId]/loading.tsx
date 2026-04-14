export default function PlanDetailLoading() {
  return (
    <div className="flex flex-col gap-6 animate-pulse">
      <div className="flex items-center gap-2">
        <div className="h-3 w-20 rounded-full bg-zinc-100" />
      </div>
      <div className="h-7 w-1/2 rounded-full bg-zinc-100" />
      <div className="h-4 w-2/3 rounded-full bg-zinc-100" />
      <div className="flex flex-col gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-zinc-100 overflow-hidden">
            <div className="h-10 bg-zinc-100" />
            <div className="h-32 bg-white" />
          </div>
        ))}
      </div>
    </div>
  );
}
