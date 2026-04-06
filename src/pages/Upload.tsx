"use client";

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import Logo from '../components/Logo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload as UploadIcon, FileText, LogOut, CheckCircle2, UploadCloud, Zap, Search } from 'lucide-react';
import { toast } from 'sonner';

const Upload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) navigate('/login');
      setUser(user);
    };
    checkUser();
  }, [navigate]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== 'application/pdf') {
        toast.error("Apenas arquivos PDF são permitidos no sistema.");
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file || !user) return;
    setUploading(true);

    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('trabalhos-arquivos')
      .upload(filePath, file);

    if (uploadError) {
      toast.error("Erro na transmissão: " + uploadError.message);
    } else {
      toast.success("Documento sincronizado com sucesso!");
      setFile(null);
    }
    setUploading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-zinc-300 p-6 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-[#00FF41]/5 blur-[120px] rounded-full opacity-50" />

      <header className="max-w-6xl mx-auto flex justify-between items-center mb-16 relative z-10">
        <Logo />
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/explore')}
            className="text-zinc-400 hover:text-emerald-400 hover:bg-emerald-500/5"
          >
            <Search className="mr-2 h-4 w-4" /> Explorar Arquivos
          </Button>
          <div className="hidden md:flex flex-col items-end mr-4">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Operador Ativo</span>
            <span className="text-xs text-zinc-300">{user?.email}</span>
          </div>
          <Button 
            variant="outline" 
            onClick={handleLogout} 
            className="border-zinc-800 hover:border-red-500/50 hover:text-red-500 transition-all duration-300"
          >
            <LogOut className="mr-2 h-4 w-4" /> Sair
          </Button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-zinc-900/30 border-zinc-800/50 backdrop-blur-xl shadow-2xl overflow-hidden">
            <CardHeader className="border-b border-zinc-800/50 pb-8">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl text-white flex items-center gap-3">
                  <div className="p-2 bg-[#00FF41]/10 rounded-lg">
                    <UploadCloud className="text-[#00FF41]" size={20} />
                  </div>
                  Upload de Documentação
                </CardTitle>
                <div className="flex items-center gap-2 px-3 py-1 bg-zinc-950 rounded-full border border-zinc-800">
                  <Zap size={12} className="text-[#00FF41]" />
                  <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">Fast Sync</span>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-8 space-y-8">
              <div 
                className={`group relative border-2 border-dashed rounded-2xl p-16 text-center transition-all duration-500 ${
                  file 
                    ? 'border-[#00FF41] bg-[#00FF41]/5' 
                    : 'border-zinc-800 hover:border-[#00FF41]/40 hover:bg-zinc-900/50'
                }`}
              >
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  accept=".pdf"
                  onChange={handleFileChange}
                />
                <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                  <AnimatePresence mode="wait">
                    {file ? (
                      <motion.div
                        key="file-selected"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        className="flex flex-col items-center"
                      >
                        <div className="w-16 h-16 bg-[#00FF41]/20 rounded-full flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(0,255,65,0.2)]">
                          <CheckCircle2 className="h-8 w-8 text-[#00FF41]" />
                        </div>
                        <span className="text-white font-medium text-lg mb-1">{file.name}</span>
                        <span className="text-zinc-500 text-sm font-mono uppercase tracking-widest">Pronto para transmissão</span>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="no-file"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center"
                      >
                        <div className="w-16 h-16 bg-zinc-950 rounded-full flex items-center justify-center mb-4 border border-zinc-800 group-hover:border-[#00FF41]/50 transition-colors">
                          <FileText className="h-8 w-8 text-zinc-600 group-hover:text-[#00FF41]/70 transition-colors" />
                        </div>
                        <span className="text-zinc-300 font-medium text-lg">Arraste seu PDF aqui</span>
                        <span className="text-zinc-500 text-sm mt-2 font-mono uppercase tracking-widest">Limite: 50MB por arquivo</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </label>
              </div>

              <div className="flex flex-col gap-4">
                <Button 
                  onClick={handleUpload}
                  disabled={!file || uploading}
                  className="w-full h-14 bg-[#00FF41] text-black hover:bg-[#00FF41]/90 hover:shadow-[0_0_30px_rgba(0,255,65,0.3)] transition-all duration-300 font-bold text-base tracking-widest disabled:opacity-20"
                >
                  {uploading ? (
                    <div className="flex items-center gap-3">
                      <div className="h-4 w-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      <span>SINCRONIZANDO...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <UploadIcon size={18} />
                      <span>CONFIRMAR TRANSMISSÃO</span>
                    </div>
                  )}
                </Button>
                
                <p className="text-center text-[10px] font-mono text-zinc-600 uppercase tracking-[0.2em]">
                  Todos os envios são criptografados de ponta a ponta
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default Upload;