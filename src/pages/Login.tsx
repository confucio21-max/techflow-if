"use client";

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Logo from '../components/Logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
      toast.success("Bem-vindo ao TechFlow IF!");
      navigate('/upload');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Efeito de brilho no fundo */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-emerald-500/10 rounded-full blur-[120px]" />

      <Logo className="mb-8" />
      
      <Card className="w-full max-w-md bg-slate-900/50 border-slate-800 backdrop-blur-xl shadow-2xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-white text-center">Acesso ao Portal</CardTitle>
          <CardDescription className="text-slate-400 text-center">
            Entre com suas credenciais acadêmicas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="seu.email@if.edu.br"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-slate-950 border-slate-800 text-white focus-visible:ring-emerald-500"
                required
              />
            </div>
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-slate-950 border-slate-800 text-white focus-visible:ring-emerald-500"
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-bold transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)]"
              disabled={loading}
            >
              {loading ? "Carregando..." : "Entrar"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;