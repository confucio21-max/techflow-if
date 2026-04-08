"use client";

import React from 'react';

const Footer = () => {
  return (
    <footer className="fixed bottom-0 left-0 w-full py-4 px-6 z-50 pointer-events-none">
      <div className="max-w-7xl mx-auto flex justify-center items-center">
        <div className="bg-black/40 backdrop-blur-md border border-emerald-500/10 px-6 py-2 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.05)]">
          <p className="text-[10px] font-mono tracking-[0.2em] text-emerald-400/70 uppercase">
            TechFlow v1.0 <span className="mx-3 text-zinc-800">|</span> 
            Autoria: <span className="text-emerald-400 font-bold">Dante Dias Monteiro</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;