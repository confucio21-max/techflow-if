"use client";

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import CTLogo from '../components/CTLogo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

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
      toast.error("Erro de autenticação: " + error.message);
    } else {
      toast.success("Acesso autorizado.");
      navigate('/upload');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md">
        <CTLogo />
        
        <Card className="bg-zinc-900/30 border-[#00FF41]/30 border-2 backdrop-blur-md shadow-[0_0_40px_rgba(0,255,65,0.05)] overflow-hidden">
          <CardContent className="p-8 pt-10">
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-mono text-zinc-500 uppercase tracking-widest ml-1">Identificação</label>
                <Input
                  type="email"
                  placeholder="usuario@instituto.edu.br"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-mono text-zinc-500 uppercase tracking-widest ml-1">Chave de Acesso</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full mt-4"
                disabled={loading}
              >
                {loading ? "PROCESSANDO..." : "INICIAR SESSÃO"}
              </Button>
            </form>
            
            <div className="mt-8 text-center">
              <p className="text-zinc-600 text-[10px] font-mono uppercase tracking-tighter">
                Sistema de Fluxo Tecnológico v1.0.4
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;