import React from 'react';
import { Atom } from 'lucide-react';

const Logo = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`flex flex-col items-center gap-3 font-bold tracking-tighter ${className}`}>
      <div className="bg-emerald-500/10 p-4 rounded-full border border-emerald-500/50 shadow-[0_0_20px_rgba(0,255,65,0.3)] animate-pulse">
        <Atom size={48} className="text-[#00FF41]" />
      </div>
      <span className="text-3xl text-white font-black">
        TECH<span className="text-[#00FF41]">FLOW</span>
      </span>
    </div>
  );
};

export default Logo;