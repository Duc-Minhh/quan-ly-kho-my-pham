import React, { useState } from 'react';

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  maxWidth?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({ content, children, maxWidth = 'max-w-xs' }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-40 ${maxWidth} w-max p-2.5 text-xs text-slate-100 bg-slate-900 rounded-lg shadow-xl border border-slate-700 pointer-events-none transition-opacity duration-200`}>
          <div className="leading-relaxed whitespace-normal break-words font-normal">
            {content}
          </div>
          {/* Arrow */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900" />
        </div>
      )}
    </div>
  );
};
