"use client";

import React from 'react';

const Footer = () => {
  return (
    <footer className="fixed bottom-0 left-0 w-full py-4 px-6 z-50 pointer-events-none">
      <div className="max-w-7xl mx-auto flex justify-center items-center">
        <div className="bg-black/40 backdrop-blur-md border border-[#00FF99]/10 px-6 py-2 rounded-full shadow-[0_0_20px_rgba(0,255,153,0.05)]">
          <p className="text-[10px] font-mono tracking-[0.2em] text-[#00FF99]/70 uppercase">
            © 2026 <span className="text-[#00FF99] font-bold">TechFlow</span> 
            <span className="mx-3 text-zinc-800">|</span> 
            Desenvolvido por <span className="text-[#00FF99]/90">Dante Dias Monteiro</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;