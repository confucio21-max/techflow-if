"use client";

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Logo from '../components/Logo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload as UploadIcon, FileText, LogOut, CheckCircle2 } from 'lucide-react';
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
        toast.error("Apenas arquivos PDF são permitidos.");
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);

    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('trabalhos-arquivos')
      .upload(filePath, file);

    if (uploadError) {
      toast.error("Erro no upload: " + uploadError.message);
    } else {
      toast.success("Trabalho enviado com sucesso!");
      setFile(null);
    }
    setUploading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-6">
      <header className="max-w-5xl mx-auto flex justify-between items-center mb-12">
        <Logo />
        <Button variant="ghost" onClick={handleLogout} className="text-slate-400 hover:text-emerald-400">
          <LogOut className="mr-2 h-4 w-4" /> Sair
        </Button>
      </header>

      <main className="max-w-2xl mx-auto">
        <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-xl text-white flex items-center gap-2">
              <UploadIcon className="text-emerald-400" /> Enviar Trabalho Acadêmico
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div 
              className={`border-2 border-dashed rounded-xl p-12 text-center transition-all ${
                file ? 'border-emerald-500 bg-emerald-500/5' : 'border-slate-700 hover:border-emerald-500/50'
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
                {file ? (
                  <>
                    <CheckCircle2 className="h-12 w-12 text-emerald-400 mb-4" />
                    <span className="text-white font-medium">{file.name}</span>
                    <span className="text-slate-400 text-sm mt-1">Clique para trocar o arquivo</span>
                  </>
                ) : (
                  <>
                    <FileText className="h-12 w-12 text-slate-600 mb-4" />
                    <span className="text-slate-300 font-medium">Selecione seu arquivo PDF</span>
                    <span className="text-slate-500 text-sm mt-1">Arraste ou clique para navegar</span>
                  </>
                )}
              </label>
            </div>

            <Button 
              onClick={handleUpload}
              disabled={!file || uploading}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-bold shadow-[0_0_15px_rgba(16,185,129,0.2)]"
            >
              {uploading ? "Enviando..." : "Confirmar Envio"}
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Upload;