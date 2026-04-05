import React from 'react';
import { Terminal } from 'lucide-react';

const Logo = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`flex items-center gap-2 font-bold tracking-tighter ${className}`}>
      <div className="bg-emerald-500 p-1.5 rounded-lg shadow-[0_0_15px_rgba(16,185,129,0.5)]">
        <Terminal size={24} className="text-black" />
      </div>
      <span className="text-2xl text-white">
        TechFlow<span className="text-emerald-400">IF</span>
      </span>
    </div>
  );
};

export default Logo;