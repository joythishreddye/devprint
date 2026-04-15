export default function WizardLoading() {
  return (
    <div className="flex flex-col gap-6 animate-pulse">
      <div className="h-4 w-2/3 rounded-full bg-zinc-100" />
      <div className="h-2 w-full rounded-full bg-zinc-100" />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-40 rounded-xl bg-zinc-100" />
        ))}
      </div>
    </div>
  );
}
