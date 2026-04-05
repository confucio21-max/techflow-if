import React from 'react';
import { Atom } from 'lucide-react';

const CTLogo = () => {
  return (
    <div className="flex flex-col items-center gap-3 mb-6">
      <div className="relative">
        <div className="absolute inset-0 bg-[#00FF41] blur-xl opacity-20 animate-pulse" />
        <Atom size={64} className="text-[#00FF41] relative z-10" strokeWidth={1.5} />
      </div>
      <h2 className="text-[#00FF41] font-mono text-xl tracking-[0.2em] font-bold">
        C&T PORTAL
      </h2>
    </div>
  );
};

export default CTLogo;