import type { Technology } from '@/types/database';

export interface TechnologyProsConsProps {
  technology: Pick<Technology, 'pros' | 'cons' | 'best_for'>;
}

interface ListSectionProps {
  title: string;
  items: string[];
  markerClass: string;
  headerClass: string;
}

function ListSection({ title, items, markerClass, headerClass }: ListSectionProps) {
  return (
    <div className="flex flex-col rounded-xl border border-zinc-200 bg-white shadow-sm overflow-hidden">
      <div className={`border-b border-zinc-100 px-5 py-3 ${headerClass}`}>
        <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
          {title}
        </h3>
      </div>
      <div className="px-5 py-4">
        {items.length === 0 ? (
          <p className="text-sm text-zinc-400">None listed.</p>
        ) : (
          <ul className="space-y-2.5">
            {items.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-zinc-700">
                <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${markerClass}`} />
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default function TechnologyProsCons({ technology }: TechnologyProsConsProps) {
  const { pros, cons, best_for } = technology;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <ListSection
        title="Pros"
        items={pros}
        markerClass="bg-green-400"
        headerClass="bg-zinc-50"
      />
      <ListSection
        title="Cons"
        items={cons}
        markerClass="bg-red-400"
        headerClass="bg-zinc-50"
      />
      <ListSection
        title="Best For"
        items={best_for}
        markerClass="bg-zinc-400"
        headerClass="bg-zinc-50"
      />
    </div>
  );
}
