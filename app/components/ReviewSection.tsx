import { PencilLine } from 'lucide-react';

interface ReviewSectionProps {
  step: number;
  icon: React.ReactNode;
  title: string;
  color: string;
  fields: { label: string; value?: string }[];
  isDocuments?: boolean;
  onEdit: () => void;
}

const colorMap: Record<string, { pill: string; icon: string; editBtn: string }> = {
  blue:    { pill: 'bg-blue-50 text-blue-600 border-blue-100',          icon: 'bg-blue-100 text-blue-600',        editBtn: 'text-blue-500 hover:text-blue-700 hover:bg-blue-50'          },
  violet:  { pill: 'bg-violet-50 text-violet-600 border-violet-100',    icon: 'bg-violet-100 text-violet-600',    editBtn: 'text-violet-500 hover:text-violet-700 hover:bg-violet-50'    },
  emerald: { pill: 'bg-emerald-50 text-emerald-600 border-emerald-100', icon: 'bg-emerald-100 text-emerald-600',  editBtn: 'text-emerald-500 hover:text-emerald-700 hover:bg-emerald-50' },
  amber:   { pill: 'bg-amber-50 text-amber-600 border-amber-100',       icon: 'bg-amber-100 text-amber-600',      editBtn: 'text-amber-500 hover:text-amber-700 hover:bg-amber-50'       },
};

export function ReviewSection({ step, icon, title, color, fields, isDocuments, onEdit }: ReviewSectionProps) {
  const c = colorMap[color];

  return (
    <div className="group border border-zinc-100 rounded-2xl overflow-hidden hover:border-zinc-200 hover:shadow-sm transition-all duration-200">
      {/* Section Header */}
      <div className="flex items-center justify-between px-5 py-4 bg-zinc-50/60 border-b border-zinc-100">
        <div className="flex items-center gap-3">
          <span className={`w-7 h-7 rounded-lg flex items-center justify-center ${c.icon}`}>
            {icon}
          </span>
          <div>
            <span className="text-sm font-semibold text-zinc-800">{title}</span>
            <span className={`ml-2 text-[11px] font-medium px-2 py-0.5 rounded-full border ${c.pill}`}>
              Step {step}
            </span>
          </div>
        </div>
        <button
          onClick={onEdit}
          className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-all ${c.editBtn}`}
        >
          <PencilLine className="w-3 h-3" />
          Edit
        </button>
      </div>

      {/* Section Body */}
      <div className="px-5 py-4">
        {!isDocuments ? (
          <div className="grid grid-cols-2 gap-x-8 gap-y-3">
            {fields.filter(f => f.value).map((field) => (
              <div key={field.label} className="flex flex-col gap-0.5">
                <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wide">{field.label}</span>
                <span className="text-sm text-zinc-800 font-medium">{field.value}</span>
              </div>
            ))}
            {fields.filter(f => f.value).length === 0 && (
              <p className="text-sm text-zinc-400 col-span-2 italic">No information provided yet.</p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {/* Documents section - simplified for now */}
            <p className="text-sm text-zinc-600">Documents review...</p>
          </div>
        )}
      </div>
    </div>
  );
}