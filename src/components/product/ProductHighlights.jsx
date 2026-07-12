import * as Icons from 'lucide-react';

export default function ProductHighlights({ highlights }) {
  if (!highlights || !Array.isArray(highlights) || highlights.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 pt-8 border-t border-primary-100 dark:border-white/10">
      <h3 className="text-xl font-bold text-primary-900 dark:text-white mb-6">Product highlights</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {highlights.map((highlight, index) => {
          const IconComponent = Icons[highlight.icon] || Icons.Zap;
          
          return (
            <div key={index} className="flex items-center gap-4 group">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-xl transition-colors group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30">
                <IconComponent className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-primary-700 dark:text-primary-300 font-medium">
                {highlight.text}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
