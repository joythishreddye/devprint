import type { Technology } from '@/types/database';

export interface TechnologyProsConsProps {
  technology: Pick<Technology, 'pros' | 'cons' | 'best_for'>;
}

interface ListSectionProps {
  title: string;
  items: string[];
  markerClass: string;
}

function ListSection({ title, items, markerClass }: ListSectionProps) {
  return (
    <div>
      <h3 className="text-sm font-semibold uppercase tracking-widest text-zinc-500 mb-4">
        {title}
      </h3>
      {items.length === 0 ? (
        <p className="text-sm text-zinc-400">None listed.</p>
      ) : (
        <ul className="space-y-2">
          {items.map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-zinc-700">
              <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${markerClass}`} />
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function TechnologyProsCons({ technology }: TechnologyProsConsProps) {
  const { pros, cons, best_for } = technology;

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
        <ListSection title="Pros" items={pros} markerClass="bg-green-500" />
        <ListSection title="Cons" items={cons} markerClass="bg-red-400" />
        <ListSection title="Best For" items={best_for} markerClass="bg-blue-400" />
      </div>
    </div>
  );
}
