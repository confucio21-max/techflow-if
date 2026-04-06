import React from 'react';
import { Atom } from 'lucide-react';

const CTLogo = () => {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        {/* Outer Glow */}
        <div className="absolute inset-0 bg-emerald-500 blur-2xl opacity-20 animate-pulse" />
        
        {/* Icon Container */}
        <div className="relative z-10 p-5 bg-zinc-900/50 rounded-2xl border border-emerald-500/20 backdrop-blur-sm">
          <Atom size={56} className="text-emerald-400" strokeWidth={1.5} />
        </div>
      </div>
      
      <div className="text-center space-y-1">
        <h2 className="text-emerald-400 font-mono text-3xl tracking-[0.4em] font-bold">
          TECHFLOW
        </h2>
        <div className="h-[2px] w-16 bg-emerald-500/30 mx-auto mt-2" />
      </div>
    </div>
  );
};

export default CTLogo;