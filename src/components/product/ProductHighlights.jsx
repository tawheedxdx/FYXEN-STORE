import * as Icons from 'lucide-react';

export default function ProductHighlights({ highlights }) {
  if (!highlights || !Array.isArray(highlights) || highlights.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 pt-8 border-t border-neutral-200/80 dark:border-neutral-800">
      <h3 className="text-lg font-bold text-neutral-950 dark:text-white mb-4">Key Specifications &amp; Features</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {highlights.map((highlight, index) => {
          const IconComponent = Icons[highlight.icon] || Icons.Zap;
          
          return (
            <div key={index} className="flex items-center gap-3.5 group p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-200/60 dark:border-neutral-800">
              <div className="bg-[#c6a87c]/10 text-[#c6a87c] p-2.5 rounded-xl">
                <IconComponent className="w-4 h-4" />
              </div>
              <span className="text-neutral-700 dark:text-neutral-300 font-medium text-xs">
                {highlight.text}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
