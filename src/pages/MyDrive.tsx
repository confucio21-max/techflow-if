"use client";

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import Logo from '../components/Logo';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  FileText, 
  Image as ImageIcon, 
  File as FileIcon, 
  Download, 
  Send, 
  Trash2, 
  Plus,
  HardDrive,
  Clock,
  Shield
} from 'lucide-react';
import { toast } from 'sonner';

interface StorageFile {
  id: string;
  name: string;
  size: number;
  type: string;
  path: string;
  created_at: string;
}

const MyDrive = () => {
  const [files, setFiles] = useState<StorageFile[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('techflow_storage')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error("Erro ao sincronizar drive: " + error.message);
    } else {
      setFiles(data || []);
    }
    setLoading(false);
  };

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return <FileText className="text-red-400" />;
    if (type.includes('image')) return <ImageIcon className="text-blue-400" />;
    return <FileIcon className="text-emerald-400" />;
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleShareTelegram = async (file: StorageFile) => {
    const { data, error } = await supabase.storage
      .from('trabalhos-arquivos')
      .createSignedUrl(file.path, 3600); // Link válido por 1 hora

    if (error) {
      toast.error("Erro ao gerar link: " + error.message);
      return;
    }

    const message = `🚀 *TechFlow - Arquivo Compartilhado*\n\n📄 Nome: ${file.name}\n📦 Tamanho: ${formatSize(file.size)}\n🔗 Link (Expira em 1h): ${data.signedUrl}`;
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(data.signedUrl)}&text=${encodeURIComponent(message)}`;
    window.open(telegramUrl, '_blank');
  };

  const handleDelete = async (file: StorageFile) => {
    const { error: storageError } = await supabase.storage
      .from('trabalhos-arquivos')
      .remove([file.path]);

    if (storageError) {
      toast.error("Erro ao remover do storage");
      return;
    }

    const { error: dbError } = await supabase
      .from('techflow_storage')
      .delete()
      .eq('id', file.id);

    if (dbError) {
      toast.error("Erro ao remover registro");
    } else {
      toast.success("Arquivo deletado do sistema");
      fetchFiles();
    }
  };

  return (
    <div className="min-h-screen bg-[#020202] text-zinc-300 p-6 pb-24 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-emerald-500/5 blur-[120px] rounded-full opacity-30" />
      
      <header className="max-w-7xl mx-auto flex justify-between items-center mb-12 relative z-10">
        <Logo />
        <div className="flex gap-4">
          <Button 
            onClick={() => navigate('/upload')}
            className="bg-emerald-500 text-black hover:bg-emerald-400 font-bold"
          >
            <Plus size={18} className="mr-2" /> Novo Arquivo
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Stats */}
          <div className="space-y-6">
            <Card className="bg-zinc-900/40 border-zinc-800/50 backdrop-blur-xl">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-3 text-emerald-500">
                  <HardDrive size={20} />
                  <span className="font-mono text-xs uppercase tracking-widest">Armazenamento</span>
                </div>
                <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-[15%] shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                </div>
                <p className="text-[10px] font-mono text-zinc-500">1.2 GB de 10 GB utilizados</p>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900/40 border-zinc-800/50 backdrop-blur-xl">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-3 text-emerald-500">
                  <Shield size={20} />
                  <span className="font-mono text-xs uppercase tracking-widest">Segurança</span>
                </div>
                <p className="text-[10px] font-mono text-zinc-400 leading-relaxed">
                  Todos os arquivos são processados com criptografia AES-256.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* File List */}
          <div className="lg:col-span-3">
            <Card className="bg-zinc-950/40 border-zinc-800/50 backdrop-blur-xl overflow-hidden">
              <div className="p-6 border-b border-zinc-800/50 flex justify-between items-center">
                <h2 className="font-mono text-sm uppercase tracking-[0.3em] text-emerald-500">Meus Arquivos</h2>
                <div className="flex gap-2">
                  <Clock size={14} className="text-zinc-600" />
                  <span className="text-[10px] font-mono text-zinc-600 uppercase">Sincronizado agora</span>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest border-b border-zinc-800/30">
                      <th className="p-4 font-medium">Nome</th>
                      <th className="p-4 font-medium">Tamanho</th>
                      <th className="p-4 font-medium">Data</th>
                      <th className="p-4 font-medium text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={4} className="p-20 text-center">
                          <div className="animate-spin h-6 w-6 border-2 border-emerald-500 border-t-transparent rounded-full mx-auto" />
                        </td>
                      </tr>
                    ) : files.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="p-20 text-center text-zinc-600 font-mono text-xs uppercase tracking-widest">
                          Nenhum arquivo detectado no drive
                        </td>
                      </tr>
                    ) : (
                      files.map((file) => (
                        <motion.tr 
                          key={file.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="group hover:bg-emerald-500/5 transition-colors border-b border-zinc-800/20"
                        >
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              {getFileIcon(file.type)}
                              <span className="text-sm text-zinc-200 group-hover:text-emerald-400 transition-colors truncate max-w-[200px]">
                                {file.name}
                              </span>
                            </div>
                          </td>
                          <td className="p-4 text-xs font-mono text-zinc-500">
                            {formatSize(file.size)}
                          </td>
                          <td className="p-4 text-xs font-mono text-zinc-500">
                            {new Date(file.created_at).toLocaleDateString()}
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => handleShareTelegram(file)}
                                className="h-8 w-8 text-zinc-500 hover:text-blue-400 hover:bg-blue-400/10"
                                title="Compartilhar via Telegram"
                              >
                                <Send size={14} />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleDelete(file)}
                                className="h-8 w-8 text-zinc-500 hover:text-red-400 hover:bg-red-400/10"
                              >
                                <Trash2 size={14} />
                              </Button>
                            </div>
                          </td>
                        </motion.tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MyDrive;