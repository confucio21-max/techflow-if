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
import { ShieldCheck, Cpu } from 'lucide-react';

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
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#00FF41]/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#00FF41]/5 blur-[120px] rounded-full" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md z-10"
      >
        <CTLogo />
        
        <Card className="bg-zinc-900/40 border-[#00FF41]/20 border backdrop-blur-2xl shadow-2xl relative overflow-hidden group">
          {/* Gradient Border Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#00FF41]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <CardContent className="p-8 pt-10 relative z-10">
            <div className="flex items-center gap-2 mb-8 text-[#00FF41]/60">
              <ShieldCheck size={16} />
              <span className="text-[10px] font-mono uppercase tracking-[0.3em]">Terminal de Acesso Seguro</span>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest ml-1">Identificador de Usuário</label>
                <div className="relative">
                  <Input
                    type="email"
                    placeholder="nome@instituto.edu.br"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-zinc-950/50 border-zinc-800 focus:border-[#00FF41]/50 transition-all duration-300"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest ml-1">Chave Criptográfica</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-zinc-950/50 border-zinc-800 focus:border-[#00FF41]/50 transition-all duration-300"
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 bg-[#00FF41] text-black hover:bg-[#00FF41]/90 hover:shadow-[0_0_25px_rgba(0,255,65,0.3)] transition-all duration-300 font-bold tracking-widest"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <Cpu className="animate-spin h-4 w-4" />
                    <span>PROCESSANDO...</span>
                  </div>
                ) : "INICIAR SESSÃO"}
              </Button>
            </form>
            
            <div className="mt-10 pt-6 border-t border-zinc-800/50 flex justify-between items-center">
              <span className="text-zinc-600 text-[9px] font-mono uppercase tracking-tighter">
                v1.0.4-stable
              </span>
              <span className="text-zinc-600 text-[9px] font-mono uppercase tracking-tighter">
                IF-TECHFLOW-CORE
              </span>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;