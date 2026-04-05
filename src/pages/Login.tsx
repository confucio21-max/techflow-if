"use client";

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import CTLogo from '../components/CTLogo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { ShieldCheck, Cpu, Lock, Mail } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error("Falha na autenticação: " + error.message);
    } else {
      toast.success("Acesso autorizado com sucesso.");
      navigate('/upload');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#020202] relative overflow-hidden font-sans">
      {/* Background High-Tech Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-900 via-black to-black" />
      
      {/* Animated Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      {/* Glowing Orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-[420px] z-10 px-4"
      >
        <div className="flex flex-col items-center mb-8">
          <CTLogo />
        </div>
        
        <Card className="bg-zinc-950/40 border-emerald-500/20 border backdrop-blur-xl shadow-[0_0_50px_-12px_rgba(16,185,129,0.2)] relative overflow-hidden">
          {/* Top Accent Line */}
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
          
          <CardContent className="p-8 pt-10">
            <div className="flex items-center gap-2 mb-8 text-emerald-500/60 justify-center">
              <ShieldCheck size={14} className="animate-pulse" />
              <span className="text-[10px] font-mono uppercase tracking-[0.4em]">Sistema de Autenticação Seguro</span>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest ml-1">Credencial de Acesso</label>
                <div className="relative group">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-emerald-500 transition-colors">
                    <Mail size={18} />
                  </div>
                  <Input
                    type="email"
                    placeholder="usuario@instituto.edu.br"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-zinc-900/50 border-zinc-800 pl-10 h-12 focus:border-emerald-500/50 focus:ring-emerald-500/20 transition-all duration-300 text-zinc-200 placeholder:text-zinc-600"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest ml-1">Chave de Segurança</label>
                <div className="relative group">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-emerald-500 transition-colors">
                    <Lock size={18} />
                  </div>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-zinc-900/50 border-zinc-800 pl-10 h-12 focus:border-emerald-500/50 focus:ring-emerald-500/20 transition-all duration-300 text-zinc-200 placeholder:text-zinc-600"
                    required
                  />
                </div>
              </div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  type="submit" 
                  className="w-full h-12 bg-gradient-to-r from-emerald-600 to-emerald-400 text-black hover:from-emerald-500 hover:to-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all duration-300 font-bold tracking-widest border-none"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <Cpu className="animate-spin h-4 w-4" />
                      <span>VALIDANDO...</span>
                    </div>
                  ) : "INICIAR SESSÃO"}
                </Button>
              </motion.div>
            </form>
            
            <div className="mt-10 pt-6 border-t border-zinc-800/50 flex justify-between items-center opacity-40">
              <span className="text-zinc-500 text-[9px] font-mono uppercase tracking-tighter">
                Terminal v1.0.4
              </span>
              <div className="flex gap-2">
                <div className="w-1 h-1 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-zinc-500 text-[9px] font-mono uppercase tracking-tighter">
                  Encrypted Link
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;