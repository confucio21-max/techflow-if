import React from 'react';
import { Terminal } from 'lucide-react';

const Logo = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`flex items-center gap-3 font-bold tracking-tighter ${className}`}>
      <div className="bg-emerald-500 p-2 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.4)]">
        <Terminal size={28} className="text-black" />
      </div>
      <span className="text-3xl text-white font-mono tracking-[0.1em]">
        TECH<span className="text-emerald-400">FLOW</span>
      </span>
    </div>
  );
};

export default Logo;