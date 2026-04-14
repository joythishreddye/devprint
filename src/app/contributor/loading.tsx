export default function Loading() {
  return (
    <div className="flex flex-col gap-8">
      <div className="h-8 w-48 animate-pulse rounded bg-zinc-200" />
      <div className="flex flex-col gap-4">
        <div className="h-4 w-36 animate-pulse rounded bg-zinc-200" />
        <div className="h-64 animate-pulse rounded-xl bg-zinc-100" />
      </div>
    </div>
  );
}
