export default function Loading() {
  return (
    <div className="flex flex-col gap-6">
      <div className="h-8 w-36 animate-pulse rounded bg-zinc-200" />
      <div className="grid grid-cols-3 gap-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-20 animate-pulse rounded-xl bg-zinc-100" />
        ))}
      </div>
      <div className="h-64 animate-pulse rounded-xl bg-zinc-100" />
    </div>
  );
}
