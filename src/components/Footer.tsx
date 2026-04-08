"use client";

import React from 'react';

const Footer = () => {
  return (
    <footer className="fixed bottom-0 left-0 w-full py-4 px-6 z-50 pointer-events-none">
      <div className="max-w-7xl mx-auto flex justify-center items-center">
        <div className="bg-black/60 backdrop-blur-xl border border-[#00FF99]/20 px-8 py-2 rounded-full shadow-[0_0_30px_rgba(0,255,153,0.1)]">
          <p className="text-[10px] font-mono tracking-[0.3em] text-[#00FF99]/80 uppercase">
            Sistema de Gestão de Arquivos Protegido <span className="mx-4 text-zinc-800">|</span> 
            Criador: <span className="text-[#00FF99] font-bold drop-shadow-[0_0_5px_#00FF99]">Dante Dias Monteiro</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;