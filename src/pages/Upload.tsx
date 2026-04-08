"use client";

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import Logo from '../components/Logo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UploadCloud, FileText, LogOut, CheckCircle2, ArrowLeft, Zap } from 'lucide-react';
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

  const sendTelegramNotification = async (fileName: string, fileId: string) => {
    try {
      // 1. Buscar configurações do Telegram
      const { data: config, error: configError } = await supabase
        .from('telegram_config')
        .select('bot_token, chat_id')
        .single();

      if (configError || !config) {
        console.error("Erro ao carregar configuração do Telegram:", configError);
        return;
      }

      // 2. Disparar mensagem via API do Telegram
      const message = `📁 TECHFLOW VAULT | Novo arquivo detectado: ${fileName}. Autor: Dante Dias Monteiro`;
      const telegramUrl = `https://api.telegram.org/bot${config.bot_token}/sendMessage`;

      const response = await fetch(telegramUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: config.chat_id,
          text: message,
          parse_mode: 'Markdown'
        })
      });

      if (response.ok) {
        // 3. Atualizar status na tabela techflow_storage usando o ID único
        await supabase
          .from('techflow_storage')
          .update({ telegram_sent: true })
          .eq('id', fileId);
      }

    } catch (err) {
      console.error("Falha na notificação do Telegram:", err);
    }
  };

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
      toast.error("Falha na transmissão de dados");
      setUploading(false);
      return;
    }

    // 2. Salvar metadados na techflow_storage e obter o ID inserido
    const { data: insertData, error: dbError } = await supabase
      .from('techflow_storage')
      .insert([
        {
          name: file.name,
          size: file.size,
          type: file.type || 'application/octet-stream',
          path: filePath,
          user_id: user.id,
          telegram_sent: false
        }
      ])
      .select();

    if (dbError) {
      toast.error("Erro ao registrar metadados");
    } else {
      toast.success("Sincronização concluída com sucesso");
      
      // 3. Disparar notificação do Telegram se o registro foi criado
      if (insertData && insertData[0]) {
        sendTelegramNotification(file.name, insertData[0].id);
      }
      
      setTimeout(() => navigate('/drive'), 1000);
    }
    setUploading(false);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-zinc-300 p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00FF9905_1px,transparent_1px),linear-gradient(to_bottom,#00FF9905_1px,transparent_1px)] bg-[size:60px_60px]" />
      
      <header className="max-w-7xl mx-auto flex justify-between items-center mb-16 relative z-10">
        <div className="flex items-center gap-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/drive')}
            className="text-zinc-500 hover:text-[#00FF99] hover:bg-[#00FF99]/5"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> BACK TO NODE
          </Button>
          <Logo />
        </div>
        <Button 
          variant="outline" 
          onClick={() => supabase.auth.signOut().then(() => navigate('/login'))} 
          className="border-zinc-800 hover:border-red-500/50 hover:text-red-500 font-mono text-[10px] tracking-widest"
        >
          <LogOut className="mr-2 h-3 w-3" /> TERMINATE SESSION
        </Button>
      </header>

      <main className="max-w-2xl mx-auto relative z-10">
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
          <Card className="bg-black/60 border-[#00FF99]/20 backdrop-blur-2xl shadow-[0_0_50px_rgba(0,255,153,0.05)]">
            <CardHeader className="border-b border-[#00FF99]/10 pb-8">
              <CardTitle className="text-lg text-white font-mono tracking-[0.2em] flex items-center gap-3">
                <Zap className="text-[#00FF99]" size={18} />
                DATA UPLOAD PROTOCOL
              </CardTitle>
            </CardHeader>
            
            <CardContent className="p-10 space-y-8">
              <div 
                className={`group relative border-2 border-dashed rounded-3xl p-20 text-center transition-all duration-700 ${
                  file ? 'border-[#00FF99] bg-[#00FF99]/5 shadow-[0_0_30px_rgba(0,255,153,0.1)]' : 'border-zinc-800 hover:border-[#00FF99]/40'
                }`}
              >
                <input type="file" id="file-upload" className="hidden" onChange={handleFileChange} />
                <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                  <AnimatePresence mode="wait">
                    {file ? (
                      <motion.div key="file" initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                        <div className="w-20 h-20 bg-[#00FF99]/10 rounded-2xl flex items-center justify-center mb-6 border border-[#00FF99]/30">
                          <CheckCircle2 className="h-10 w-10 text-[#00FF99]" />
                        </div>
                        <span className="text-white font-mono text-sm block mb-2">{file.name}</span>
                        <span className="text-[#00FF99]/60 text-[10px] font-mono uppercase tracking-[0.3em]">
                          {(file.size / 1024 / 1024).toFixed(2)} MB READY
                        </span>
                      </motion.div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <div className="w-20 h-20 bg-zinc-900/50 rounded-2xl flex items-center justify-center mb-6 border border-zinc-800 group-hover:border-[#00FF99]/30 transition-all">
                          <FileText className="h-10 w-10 text-zinc-700 group-hover:text-[#00FF99]/50" />
                        </div>
                        <span className="text-zinc-400 font-mono text-xs uppercase tracking-[0.2em]">Inject Data Stream</span>
                        <span className="text-zinc-600 text-[9px] mt-3 font-mono uppercase tracking-widest">AES-256 Encryption Enabled</span>
                      </div>
                    )}
                  </AnimatePresence>
                </label>
              </div>

              <Button 
                onClick={handleUpload}
                disabled={!file || uploading}
                className="w-full h-16 bg-[#00FF99] text-black hover:bg-[#00FF99]/80 font-bold tracking-[0.3em] text-xs shadow-[0_0_25px_rgba(0,255,153,0.2)] border-none"
              >
                {uploading ? "SYNCHRONIZING..." : "EXECUTE TRANSMISSION"}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default Upload;