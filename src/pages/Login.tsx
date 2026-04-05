"use client";

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Logo from '../components/Logo';
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
      toast.error("Erro ao entrar: " + error.message);
    } else {
      toast.success("Bem-vindo ao TechFlow!");
      navigate('/upload');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4 font-sans selection:bg-[#00FF41] selection:text-black">
      {/* Efeitos de fundo */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#00FF41]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#00FF41]/5 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-md z-10 space-y-8">
        <Logo />
        
        <Card className="bg-[#111111] border-[#00FF41]/30 border-2 shadow-[0_0_30px_rgba(0,255,65,0.1)] backdrop-blur-sm overflow-hidden">
          <CardContent className="p-8 pt-10">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">E-mail Acadêmico</label>
                <Input
                  type="email"
                  placeholder="usuario@if.edu.br"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Senha de Acesso</label>
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
                className="w-full font-black uppercase tracking-widest text-xs"
                disabled={loading}
              >
                {loading ? "Autenticando..." : "Entrar no Sistema"}
              </Button>
            </form>
            
            <div className="mt-8 pt-6 border-t border-slate-800 text-center">
              <p className="text-slate-500 text-xs">
                Portal de Ciência & Tecnologia • IF
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;