"use client";

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import Logo from '../components/Logo';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  FileText, 
  Image as ImageIcon, 
  File as FileIcon, 
  Send, 
  Trash2, 
  Plus,
  HardDrive,
  Shield,
  Cpu
} from 'lucide-react';
import { toast } from 'sonner';

interface StorageFile {
  id: string;
  name: string;
  size: number;
  type: string;
  path: string;
  created_at: string;
  telegram_sent?: boolean;
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
      toast.error("Erro de sincronização: " + error.message);
    } else {
      setFiles(data || []);
    }
    setLoading(false);
  };

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return <FileText className="text-red-500" size={18} />;
    if (type.includes('image')) return <ImageIcon className="text-blue-400" size={18} />;
    return <FileIcon className="text-[#00FF99]" size={18} />;
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
      .createSignedUrl(file.path, 3600);

    if (error) {
      toast.error("Falha ao gerar link seguro");
      return;
    }

    const message = `⚡ *TECHFLOW SECURE LINK*\n\n📂 Arquivo: ${file.name}\n⚖️ Tamanho: ${formatSize(file.size)}\n🔗 Link: ${data.signedUrl}`;
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(data.signedUrl)}&text=${encodeURIComponent(message)}`;
    window.open(telegramUrl, '_blank');
    
    // Simula atualização de status
    toast.success("Link de transmissão preparado");
  };

  const handleDelete = async (file: StorageFile) => {
    const { error: storageError } = await supabase.storage
      .from('trabalhos-arquivos')
      .remove([file.path]);

    if (storageError) {
      toast.error("Erro ao deletar do storage");
      return;
    }

    const { error: dbError } = await supabase
      .from('techflow_storage')
      .delete()
      .eq('id', file.id);

    if (dbError) {
      toast.error("Erro ao limpar registro");
    } else {
      toast.success("Arquivo removido do sistema");
      fetchFiles();
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-zinc-300 p-6 pb-24 relative overflow-hidden">
      {/* Cyberpunk Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00FF9908_1px,transparent_1px),linear-gradient(to_bottom,#00FF9908_1px,transparent_1px)] bg-[size:40px_40px]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-[#00FF99]/5 blur-[120px] rounded-full opacity-20" />
      
      <header className="max-w-7xl mx-auto flex justify-between items-center mb-12 relative z-10">
        <Logo />
        <Button 
          onClick={() => navigate('/upload')}
          className="bg-[#00FF99] text-black hover:bg-[#00FF99]/80 font-bold shadow-[0_0_20px_rgba(0,255,153,0.3)] border-none"
        >
          <Plus size={18} className="mr-2" /> CARREGAR DADOS
        </Button>
      </header>

      <main className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="space-y-6">
            <Card className="bg-black/40 border-[#00FF99]/20 backdrop-blur-xl">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-3 text-[#00FF99]">
                  <HardDrive size={20} />
                  <span className="font-mono text-[10px] uppercase tracking-widest">Core Storage</span>
                </div>
                <div className="h-1.5 bg-zinc-900 rounded-full overflow-hidden border border-[#00FF99]/10">
                  <div className="h-full bg-[#00FF99] w-[22%] shadow-[0_0_10px_#00FF99]" />
                </div>
                <p className="text-[9px] font-mono text-zinc-500 uppercase">2.2 GB / 10 GB ENCRYPTED</p>
              </CardContent>
            </Card>

            <Card className="bg-black/40 border-[#00FF99]/20 backdrop-blur-xl">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-3 text-[#00FF99]">
                  <Shield size={20} />
                  <span className="font-mono text-[10px] uppercase tracking-widest">Security Status</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#00FF99] animate-pulse shadow-[0_0_8px_#00FF99]" />
                  <span className="text-[10px] font-mono text-zinc-400 uppercase">Firewall Active</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3">
            <Card className="bg-black/40 border-[#00FF99]/20 backdrop-blur-xl overflow-hidden">
              <div className="p-6 border-b border-[#00FF99]/10 flex justify-between items-center bg-[#00FF99]/5">
                <h2 className="font-mono text-xs uppercase tracking-[0.4em] text-[#00FF99]">Database Explorer</h2>
                <Cpu size={16} className="text-[#00FF99]/50 animate-spin-slow" />
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-[9px] font-mono text-zinc-500 uppercase tracking-[0.2em] border-b border-[#00FF99]/10">
                      <th className="p-5 font-medium">File Identity</th>
                      <th className="p-5 font-medium">Weight</th>
                      <th className="p-5 font-medium">Sync Date</th>
                      <th className="p-5 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#00FF99]/5">
                    {loading ? (
                      <tr>
                        <td colSpan={4} className="p-20 text-center">
                          <div className="animate-spin h-8 w-8 border-2 border-[#00FF99] border-t-transparent rounded-full mx-auto shadow-[0_0_15px_#00FF99]" />
                        </td>
                      </tr>
                    ) : files.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="p-20 text-center text-zinc-600 font-mono text-[10px] uppercase tracking-widest">
                          No data detected in current node
                        </td>
                      </tr>
                    ) : (
                      files.map((file) => (
                        <motion.tr 
                          key={file.id}
                          whileHover={{ backgroundColor: "rgba(0, 255, 153, 0.03)" }}
                          className="group transition-all duration-300 border-b border-[#00FF99]/5"
                        >
                          <td className="p-5">
                            <div className="flex items-center gap-4">
                              <div className="p-2 bg-zinc-900/50 rounded border border-[#00FF99]/10 group-hover:border-[#00FF99]/30 transition-colors">
                                {getFileIcon(file.type)}
                              </div>
                              <div className="flex flex-col">
                                <span className="text-sm text-zinc-200 group-hover:text-[#00FF99] transition-colors font-medium truncate max-w-[240px]">
                                  {file.name}
                                </span>
                                <span className="text-[9px] font-mono text-zinc-600 uppercase tracking-tighter">
                                  ID: {file.id.split('-')[0]}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="p-5 text-[10px] font-mono text-zinc-500">
                            {formatSize(file.size)}
                          </td>
                          <td className="p-5 text-[10px] font-mono text-zinc-500">
                            {new Date(file.created_at).toLocaleDateString()}
                          </td>
                          <td className="p-5 text-right">
                            <div className="flex justify-end gap-3">
                              <div className="relative group/tg">
                                <Send 
                                  size={16} 
                                  className={`cursor-pointer transition-all duration-500 ${
                                    file.telegram_sent 
                                      ? "text-blue-400 drop-shadow-[0_0_8px_#60a5fa]" 
                                      : "text-zinc-700 hover:text-blue-400/50"
                                  }`}
                                  onClick={() => handleShareTelegram(file)}
                                />
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black border border-blue-500/30 px-2 py-1 rounded text-[8px] font-mono text-blue-400 opacity-0 group-hover/tg:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                                  TELEGRAM SYNC
                                </div>
                              </div>
                              <Trash2 
                                size={16} 
                                className="text-zinc-700 hover:text-red-500 cursor-pointer transition-colors"
                                onClick={() => handleDelete(file)}
                              />
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