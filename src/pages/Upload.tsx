"use client";

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import Logo from '../components/Logo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload as UploadIcon, FileText, LogOut, CheckCircle2, UploadCloud, Zap, ArrowLeft } from 'lucide-react';
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
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file || !user) return;
    setUploading(true);

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;

    // 1. Upload para o Storage
    const { error: uploadError } = await supabase.storage
      .from('trabalhos-arquivos')
      .upload(filePath, file);

    if (uploadError) {
      toast.error("Erro na transmissão: " + uploadError.message);
      setUploading(false);
      return;
    }

    // 2. Salvar metadados na techflow_storage
    const { error: dbError } = await supabase
      .from('techflow_storage')
      .insert([
        {
          name: file.name,
          size: file.size,
          type: file.type || 'application/octet-stream',
          path: filePath,
          user_id: user.id
        }
      ]);

    if (dbError) {
      toast.error("Erro ao registrar arquivo: " + dbError.message);
    } else {
      toast.success("Arquivo sincronizado com sucesso!");
      setTimeout(() => navigate('/drive'), 1500);
    }
    setUploading(false);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-zinc-300 p-6 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-emerald-500/5 blur-[120px] rounded-full opacity-50" />

      <header className="max-w-7xl mx-auto flex justify-between items-center mb-16 relative z-10">
        <div className="flex items-center gap-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/drive')}
            className="text-zinc-400 hover:text-emerald-400"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar ao Drive
          </Button>
          <Logo />
        </div>
        <Button 
          variant="outline" 
          onClick={() => supabase.auth.signOut().then(() => navigate('/login'))} 
          className="border-zinc-800 hover:border-red-500/50 hover:text-red-500"
        >
          <LogOut className="mr-2 h-4 w-4" /> Sair
        </Button>
      </header>

      <main className="max-w-3xl mx-auto relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="bg-zinc-900/30 border-zinc-800/50 backdrop-blur-xl shadow-2xl overflow-hidden">
            <CardHeader className="border-b border-zinc-800/50 pb-8">
              <CardTitle className="text-xl text-white flex items-center gap-3">
                <div className="p-2 bg-emerald-500/10 rounded-lg">
                  <UploadCloud className="text-emerald-500" size={20} />
                </div>
                Transmissão de Dados
              </CardTitle>
            </CardHeader>
            
            <CardContent className="p-8 space-y-8">
              <div 
                className={`group relative border-2 border-dashed rounded-2xl p-16 text-center transition-all duration-500 ${
                  file ? 'border-emerald-500 bg-emerald-500/5' : 'border-zinc-800 hover:border-emerald-500/40'
                }`}
              >
                <input type="file" id="file-upload" className="hidden" onChange={handleFileChange} />
                <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                  <AnimatePresence mode="wait">
                    {file ? (
                      <motion.div key="file" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                        <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mb-4">
                          <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                        </div>
                        <span className="text-white font-medium text-lg block">{file.name}</span>
                        <span className="text-zinc-500 text-xs font-mono uppercase tracking-widest">
                          {(file.size / 1024 / 1024).toFixed(2)} MB detectados
                        </span>
                      </motion.div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-zinc-950 rounded-full flex items-center justify-center mb-4 border border-zinc-800">
                          <FileText className="h-8 w-8 text-zinc-600" />
                        </div>
                        <span className="text-zinc-300 font-medium text-lg">Arraste qualquer arquivo</span>
                        <span className="text-zinc-500 text-sm mt-2 font-mono uppercase tracking-widest">Criptografia de ponta a ponta</span>
                      </div>
                    )}
                  </AnimatePresence>
                </label>
              </div>

              <Button 
                onClick={handleUpload}
                disabled={!file || uploading}
                className="w-full h-14 bg-emerald-500 text-black hover:bg-emerald-400 font-bold tracking-widest"
              >
                {uploading ? "SINCRONIZANDO..." : "INICIAR TRANSMISSÃO"}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default Upload;