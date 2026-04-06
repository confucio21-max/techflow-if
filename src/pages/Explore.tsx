"use client";

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import Logo from '../components/Logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Search, 
  Filter, 
  FileText, 
  Download, 
  User, 
  BookOpen, 
  Calendar,
  ArrowLeft,
  ExternalLink,
  Database
} from 'lucide-react';
import { toast } from 'sonner';

interface Documento {
  id: string;
  nome_arquivo: string;
  caminho_arquivo: string;
  semestre: string;
  materia: string;
  professor_nome: string;
  created_at: string;
}

const Explore = () => {
  const [docs, setDocs] = useState<Documento[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMateria, setFilterMateria] = useState('');
  const [filterSemestre, setFilterSemestre] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('trabalhos_arquivos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error("Erro ao acessar banco de dados: " + error.message);
    } else {
      setDocs(data || []);
    }
    setLoading(false);
  };

  const filteredDocs = docs.filter(doc => {
    const matchesSearch = 
      doc.nome_arquivo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.professor_nome.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMateria = filterMateria === '' || doc.materia === filterMateria;
    const matchesSemestre = filterSemestre === '' || doc.semestre === filterSemestre;
    
    return matchesSearch && matchesMateria && matchesSemestre;
  });

  const handleDownload = async (path: string, name: string) => {
    const { data, error } = await supabase.storage
      .from('trabalhos-arquivos')
      .download(path);

    if (error) {
      toast.error("Erro na transferência: " + error.message);
      return;
    }

    const url = window.URL.createObjectURL(data);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', name);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  // Extrair matérias únicas para o filtro
  const materias = Array.from(new Set(docs.map(d => d.materia))).filter(Boolean);
  const semestres = Array.from(new Set(docs.map(d => d.semestre))).filter(Boolean);

  return (
    <div className="min-h-screen bg-[#020202] text-zinc-300 p-6 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-emerald-500/5 blur-[120px] rounded-full opacity-30" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px]" />

      <header className="max-w-7xl mx-auto flex justify-between items-center mb-12 relative z-10">
        <div className="flex items-center gap-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/upload')}
            className="text-zinc-500 hover:text-emerald-400 hover:bg-emerald-500/5"
          >
            <ArrowLeft size={20} className="mr-2" /> Voltar
          </Button>
          <Logo />
        </div>
        
        <div className="flex items-center gap-3 px-4 py-2 bg-zinc-900/50 border border-emerald-500/20 rounded-full backdrop-blur-md">
          <Database size={14} className="text-emerald-500 animate-pulse" />
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-emerald-500/80">
            Arquivo Central Ativo
          </span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto relative z-10">
        {/* Filtros */}
        <Card className="bg-zinc-950/40 border-zinc-800/50 backdrop-blur-xl mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-emerald-500 transition-colors" size={18} />
                <Input 
                  placeholder="Buscar por arquivo ou professor..." 
                  className="bg-zinc-900/50 border-zinc-800 pl-10 focus:border-emerald-500/50"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="relative">
                <select 
                  className="w-full h-10 bg-zinc-900/50 border border-zinc-800 rounded-md px-3 text-sm focus:outline-none focus:border-emerald-500/50 appearance-none"
                  value={filterMateria}
                  onChange={(e) => setFilterMateria(e.target.value)}
                >
                  <option value="">Todas as Matérias</option>
                  {materias.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
                <BookOpen className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none" size={16} />
              </div>

              <div className="relative">
                <select 
                  className="w-full h-10 bg-zinc-900/50 border border-zinc-800 rounded-md px-3 text-sm focus:outline-none focus:border-emerald-500/50 appearance-none"
                  value={filterSemestre}
                  onChange={(e) => setFilterSemestre(e.target.value)}
                >
                  <option value="">Todos os Semestres</option>
                  {semestres.map(s => <option key={s} value={s}>{s}º Semestre</option>)}
                </select>
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none" size={16} />
              </div>

              <Button 
                onClick={fetchDocuments}
                className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 hover:bg-emerald-500/20"
              >
                <Filter size={18} className="mr-2" /> Sincronizar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Grid de Documentos */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
            <span className="font-mono text-xs uppercase tracking-widest text-zinc-500">Acessando Servidores...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredDocs.map((doc, index) => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="bg-zinc-900/30 border-zinc-800/50 hover:border-emerald-500/30 transition-all duration-500 group overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="p-3 bg-emerald-500/10 rounded-xl group-hover:bg-emerald-500/20 transition-colors">
                          <FileText className="text-emerald-500" size={24} />
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDownload(doc.caminho_arquivo, doc.nome_arquivo)}
                            className="h-8 w-8 text-zinc-500 hover:text-emerald-400"
                          >
                            <Download size={18} />
                          </Button>
                        </div>
                      </div>

                      <h3 className="text-white font-medium mb-4 line-clamp-1 group-hover:text-emerald-400 transition-colors">
                        {doc.nome_arquivo}
                      </h3>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs text-zinc-500">
                          <User size={12} className="text-emerald-500/50" />
                          <span className="font-mono uppercase tracking-tighter">Prof: {doc.professor_nome}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-zinc-500">
                          <BookOpen size={12} className="text-emerald-500/50" />
                          <span className="font-mono uppercase tracking-tighter">{doc.materia}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-zinc-500">
                          <Calendar size={12} className="text-emerald-500/50" />
                          <span className="font-mono uppercase tracking-tighter">{doc.semestre}º Semestre</span>
                        </div>
                      </div>

                      <div className="mt-6 pt-4 border-t border-zinc-800/50 flex justify-between items-center">
                        <span className="text-[10px] font-mono text-zinc-600">
                          ID: {doc.id.slice(0, 8)}
                        </span>
                        <Button 
                          variant="link" 
                          className="h-auto p-0 text-[10px] font-mono text-emerald-500/60 hover:text-emerald-400 uppercase tracking-widest"
                        >
                          Ver Detalhes <ExternalLink size={10} className="ml-1" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {!loading && filteredDocs.length === 0 && (
          <div className="text-center py-20 border-2 border-dashed border-zinc-800/50 rounded-3xl">
            <div className="inline-flex p-4 bg-zinc-900 rounded-full mb-4">
              <Search size={32} className="text-zinc-700" />
            </div>
            <h3 className="text-zinc-400 font-medium">Nenhum registro encontrado</h3>
            <p className="text-zinc-600 text-sm mt-2">Tente ajustar os parâmetros de busca ou filtros.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Explore;