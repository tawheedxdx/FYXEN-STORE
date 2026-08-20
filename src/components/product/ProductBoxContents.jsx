import * as Icons from 'lucide-react';

export default function ProductBoxContents({ boxContents }) {
  if (!boxContents || !Array.isArray(boxContents) || boxContents.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 pt-8 border-t border-neutral-200/80 dark:border-neutral-800">
      <h3 className="text-lg font-bold text-neutral-950 dark:text-white mb-4">In The Box</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {boxContents.map((item, index) => {
          const IconComponent = Icons[item.icon] || Icons.Package;
          
          return (
            <div
              key={index}
              className="flex items-center gap-3.5 bg-neutral-50 dark:bg-neutral-900/60 p-3.5 rounded-2xl border border-neutral-200/60 dark:border-neutral-800 transition-all hover:border-neutral-400 dark:hover:border-neutral-700"
            >
              <div className="bg-white dark:bg-neutral-800 p-2 rounded-xl border border-neutral-200 dark:border-neutral-700 flex items-center justify-center text-[#c6a87c]">
                <IconComponent className="w-4 h-4" />
              </div>
              <span className="text-neutral-700 dark:text-neutral-300 font-medium text-xs">
                {item.text}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
