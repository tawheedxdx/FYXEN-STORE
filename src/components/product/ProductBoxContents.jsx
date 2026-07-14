import * as Icons from 'lucide-react';

export default function ProductBoxContents({ boxContents }) {
  if (!boxContents || !Array.isArray(boxContents) || boxContents.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 pt-8 border-t border-primary-100 dark:border-white/10">
      <h3 className="text-xl font-bold text-primary-900 dark:text-white mb-6">What's inside the box</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {boxContents.map((item, index) => {
          const IconComponent = Icons[item.icon] || Icons.Package;
          
          return (
            <div key={index} className="flex items-center gap-4 bg-primary-50/50 dark:bg-white/5 p-4 rounded-xl border border-primary-100/50 dark:border-white/5 transition-all hover:scale-[1.01] hover:shadow-sm">
              <div className="bg-white dark:bg-primary-950 p-2 rounded-lg border border-primary-100 dark:border-white/10 flex items-center justify-center">
                <IconComponent className="w-5 h-5 text-primary-900 dark:text-white" />
              </div>
              <span className="text-primary-700 dark:text-primary-300 font-medium text-sm">
                {item.text}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
