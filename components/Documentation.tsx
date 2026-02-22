
import React, { useState, useMemo } from 'react';

interface DocItem {
  id: string;
  title: string;
  category: 'Certificación' | 'Ficha Técnica' | 'Legal' | 'Comercial';
  version: string;
  date: string;
  size: string;
  type: 'PDF' | 'Excel' | 'Word';
  verified: boolean;
}

interface DocumentationProps {
  isAdmin?: boolean;
}

const Documentation: React.FC<DocumentationProps> = ({ isAdmin }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('TODOS');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [documents, setDocuments] = useState<DocItem[]>([
    { id: 'DOC-01', title: 'Resolución Sanitaria SEREMI #2024', category: 'Legal', version: 'v2.0', date: '2024-01-15', size: '1.2 MB', type: 'PDF', verified: true },
    { id: 'DOC-02', title: 'Certificación ISO 9001:2015 Gestión de Calidad', category: 'Certificación', version: 'v1.4', date: '2023-11-20', size: '3.4 MB', type: 'PDF', verified: true },
    { id: 'DOC-03', title: 'Ficha Técnica Maíz Grano Selección', category: 'Ficha Técnica', version: 'v3.1', date: '2024-02-10', size: '850 KB', type: 'PDF', verified: true },
    { id: 'DOC-04', title: 'Manual de Buenas Prácticas de Manufactura (BPM)', category: 'Certificación', version: 'v2.2', date: '2023-08-05', size: '2.1 MB', type: 'PDF', verified: true },
    { id: 'DOC-05', title: 'Protocolo de Trazabilidad Distribuidora Central', category: 'Comercial', version: 'v1.0', date: '2024-03-01', size: '540 KB', type: 'PDF', verified: true },
    { id: 'DOC-06', title: 'Certificado de Origen - Granos Importados', category: 'Legal', version: 'v4.0', date: '2024-02-28', size: '1.8 MB', type: 'PDF', verified: true },
    { id: 'DOC-07', title: 'Ficha Técnica Aceite Maravilla Industrial', category: 'Ficha Técnica', version: 'v2.5', date: '2024-01-12', size: '920 KB', type: 'PDF', verified: true },
    { id: 'DOC-08', title: 'Política de Crédito y Cobranza Mayorista', category: 'Comercial', version: 'v5.2', date: '2024-01-01', size: '420 KB', type: 'PDF', verified: true },
  ]);

  const [newDoc, setNewDoc] = useState<Partial<DocItem>>({
    title: '', category: 'Ficha Técnica', version: 'v1.0', type: 'PDF'
  });

  const categories = ['TODOS', 'Certificación', 'Ficha Técnica', 'Legal', 'Comercial'];

  const filteredDocs = useMemo(() => {
    return documents.filter(doc => {
      const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCat = activeCategory === 'TODOS' || doc.category === activeCategory;
      return matchesSearch && matchesCat;
    });
  }, [searchTerm, activeCategory, documents]);

  const handleAddDoc = (e: React.FormEvent) => {
    e.preventDefault();
    const doc: DocItem = {
      id: `DOC-${Math.floor(100 + Math.random() * 900)}`,
      title: newDoc.title || 'Nuevo Documento',
      category: newDoc.category as any,
      version: newDoc.version || 'v1.0',
      date: new Date().toISOString().split('T')[0],
      size: '1.5 MB',
      type: newDoc.type as any,
      verified: true
    };
    setDocuments([doc, ...documents]);
    setIsModalOpen(false);
    setNewDoc({ title: '', category: 'Ficha Técnica', version: 'v1.0', type: 'PDF' });
  };

  return (
    <div className="space-y-8 animate-in pb-20">
      {/* Header Informativo del Vendedor */}
      <section className="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl">
            <h2 className="text-3xl font-black uppercase tracking-tight mb-4">Garantía de Calidad y Cumplimiento</h2>
            <p className="text-blue-100 font-medium leading-relaxed">
              Ponemos a su disposición toda nuestra documentación legal y técnica para respaldar la transparencia de nuestras operaciones y la calidad de nuestros productos.
            </p>
          </div>
          <div className="flex flex-col space-y-4 items-center">
            <div className="flex space-x-4">
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-3xl border border-white/10 text-center min-w-[120px]">
                <p className="text-2xl font-black">2024</p>
                <p className="text-[10px] font-black uppercase opacity-60">Vigencia</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-3xl border border-white/10 text-center min-w-[120px]">
                <p className="text-2xl font-black text-green-400">OK</p>
                <p className="text-[10px] font-black uppercase opacity-60">Auditoría</p>
              </div>
            </div>
            {isAdmin && (
              <button 
                onClick={() => setIsModalOpen(true)}
                className="w-full bg-blue-600 text-white px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 flex items-center justify-center space-x-2"
              >
                <span className="material-symbols-outlined">add_moderator</span>
                <span>Subir Nueva Credencial</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Modal Nueva Carga */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50">
              <div>
                <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">Publicar Certificado</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Respaldo Institucional para Compradores</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="w-12 h-12 flex items-center justify-center bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-colors">
                <span className="material-symbols-outlined text-slate-400">close</span>
              </button>
            </div>
            <form onSubmit={handleAddDoc} className="p-8 space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nombre del Documento</label>
                <input required type="text" className="w-full h-14 px-5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 font-bold text-sm" value={newDoc.title} onChange={(e) => setNewDoc({...newDoc, title: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Categoría B2B</label>
                  <select className="w-full h-14 px-5 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-sm appearance-none" value={newDoc.category} onChange={(e) => setNewDoc({...newDoc, category: e.target.value as any})}>
                    {categories.filter(c => c !== 'TODOS').map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Versión</label>
                  <input type="text" className="w-full h-14 px-5 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-sm" value={newDoc.version} onChange={(e) => setNewDoc({...newDoc, version: e.target.value})} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tipo de Archivo</label>
                <div className="flex gap-4">
                  {['PDF', 'Excel', 'Word'].map(t => (
                    <button key={t} type="button" onClick={() => setNewDoc({...newDoc, type: t as any})} className={`flex-1 h-14 rounded-xl font-black text-[10px] border-2 transition-all ${newDoc.type === t ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-100 text-slate-400'}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <button type="submit" className="w-full h-16 bg-slate-900 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-xl mt-4">Validar y Publicar</button>
            </form>
          </div>
        </div>
      )}

      {/* Herramientas de Filtro */}
      <div className="bg-white rounded-[2.5rem] p-6 border border-slate-200 shadow-sm flex flex-col lg:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <input 
            type="text" 
            placeholder="Buscar por nombre o certificación..."
            className="w-full h-14 pl-12 pr-6 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-sm focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="material-symbols-outlined absolute left-4 top-4 text-slate-400">search</span>
        </div>
        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar w-full lg:w-auto">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 h-14 rounded-2xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border-2 ${
                activeCategory === cat 
                  ? 'bg-blue-600 border-blue-600 text-white shadow-lg' 
                  : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid de Documentos */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredDocs.map((doc) => (
          <div key={doc.id} className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden flex flex-col h-full">
            <div className="flex justify-between items-start mb-6">
              <div className={`p-4 rounded-2xl bg-slate-50 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors`}>
                <span className="material-symbols-outlined text-3xl">
                  {doc.category === 'Ficha Técnica' ? 'inventory_2' : 
                   doc.category === 'Legal' ? 'gavel' : 
                   doc.category === 'Certificación' ? 'verified' : 'business_center'}
                </span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{doc.id}</span>
                {doc.verified && (
                  <div className="flex items-center space-x-1 mt-1">
                    <span className="material-symbols-outlined text-green-500 text-sm">check_circle</span>
                    <span className="text-[8px] font-black text-green-600 uppercase tracking-tighter">Documento Validado</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1">
              <span className="text-[9px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase mb-2 inline-block tracking-widest">
                {doc.category}
              </span>
              <h3 className="text-lg font-black text-slate-800 leading-tight mb-4 group-hover:text-blue-600 transition-colors">
                {doc.title}
              </h3>
              
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Versión</p>
                  <p className="text-xs font-bold text-slate-700">{doc.version}</p>
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Emisión</p>
                  <p className="text-xs font-bold text-slate-700">{doc.date}</p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-[10px] ${doc.type === 'PDF' ? 'bg-red-50 text-red-600' : doc.type === 'Excel' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
                  {doc.type}
                </div>
                <span className="text-[10px] font-black text-slate-400">{doc.size}</span>
              </div>
              <button className="flex items-center space-x-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-blue-600 transition-all active:scale-95 shadow-lg">
                <span className="material-symbols-outlined text-sm">visibility</span>
                <span>Ver Archivo</span>
              </button>
            </div>
            {isAdmin && (
              <button className="absolute top-4 left-20 opacity-0 group-hover:opacity-100 p-2 text-slate-300 hover:text-red-500 transition-all">
                <span className="material-symbols-outlined text-sm">delete_forever</span>
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Documentation;
