
import React, { useState, useMemo } from 'react';

interface CompanyVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  category: 'Instalaciones' | 'Logística' | 'Calidad' | 'Institucional';
  tags: string[];
}

interface VideosProps {
  isAdmin?: boolean;
}

const Videos: React.FC<VideosProps> = ({ isAdmin }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('TODOS');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [companyVideos, setCompanyVideos] = useState<CompanyVideo[]>([
    {
      id: 'VID-01',
      title: 'Recorrido por nuestro CD Quilicura',
      description: 'Nuestras instalaciones de más de 10,000 m2 con tecnología de punta en almacenamiento y control de stock.',
      thumbnail: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800',
      duration: '4:15',
      category: 'Instalaciones',
      tags: ['Infraestructura', 'CD Principal']
    },
    {
      id: 'VID-02',
      title: 'Sistema de Picking Automatizado',
      description: 'Vea cómo garantizamos la precisión del 99.9% en la preparación de los pedidos de nuestros clientes.',
      thumbnail: 'https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&q=80&w=800',
      duration: '2:30',
      category: 'Logística',
      tags: ['Tecnología', 'Eficiencia']
    },
    {
      id: 'VID-03',
      title: 'Nuestros Protocolos de Inocuidad',
      description: 'Respaldo visual de cómo manejamos los alimentos para garantizar la seguridad sanitaria en su negocio.',
      thumbnail: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800',
      duration: '3:45',
      category: 'Calidad',
      tags: ['Seguridad', 'Higiene']
    },
    {
      id: 'VID-04',
      title: 'Nuestra Flota de Despacho Nacional',
      description: 'Contamos con vehículos propios equipados con cadena de frío para entregas en todo el territorio.',
      thumbnail: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&q=80&w=800',
      duration: '1:50',
      category: 'Logística',
      tags: ['Transporte', 'Cobertura']
    },
    {
      id: 'VID-05',
      title: 'Compromiso Distribuidora Central 2024',
      description: 'Nuestra misión es ser el socio estratégico para el crecimiento de su comercio.',
      thumbnail: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=80&w=800',
      duration: '5:20',
      category: 'Institucional',
      tags: ['Valores', 'Socio Comercial']
    }
  ]);

  const [newVideo, setNewVideo] = useState<Partial<CompanyVideo>>({
    title: '', description: '', category: 'Logística', duration: '2:00', tags: []
  });

  const categories = ['TODOS', 'Instalaciones', 'Logística', 'Calidad', 'Institucional'];

  const filteredVideos = useMemo(() => {
    return companyVideos.filter(v => {
      const matchesSearch = v.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           v.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCat = activeCategory === 'TODOS' || v.category === activeCategory;
      return matchesSearch && matchesCat;
    });
  }, [searchTerm, activeCategory, companyVideos]);

  const handleAddVideo = (e: React.FormEvent) => {
    e.preventDefault();
    const video: CompanyVideo = {
      id: `VID-${Math.floor(100 + Math.random() * 900)}`,
      title: newVideo.title || 'Video Sin Título',
      description: newVideo.description || '',
      thumbnail: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=80&w=800',
      duration: newVideo.duration || '0:00',
      category: newVideo.category as any,
      tags: ['Actualización', 'Instalaciones']
    };
    setCompanyVideos([video, ...companyVideos]);
    setIsModalOpen(false);
    setNewVideo({ title: '', description: '', category: 'Logística', duration: '2:00', tags: [] });
  };

  return (
    <div className="space-y-10 animate-in pb-20">
      {/* Banner Principal del Vendedor */}
      <section className="relative h-[400px] rounded-[3.5rem] overflow-hidden bg-slate-900 group shadow-2xl">
        <img 
          src="https://images.unsplash.com/photo-1493934558415-9d19f0b2b4d2?auto=format&fit=crop&q=80&w=2000" 
          className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-1000"
          alt="Banner Empresa"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent"></div>
        <div className="absolute inset-0 p-12 flex flex-col justify-end max-w-3xl">
          <div className="flex items-center space-x-2 mb-4">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400">Transparencia Operativa</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white leading-tight uppercase tracking-tighter">
            Conozca por qué <br/><span className="text-blue-500">somos su mejor aliado</span>
          </h2>
          <p className="text-slate-300 mt-4 text-lg font-medium">
            Visualice nuestra infraestructura y procesos certificados. {isAdmin ? 'Gestione los tours de bodega y videos institucionales.' : 'Vea cómo operamos para garantizar su éxito.'}
          </p>
          {isAdmin && (
            <button 
              onClick={() => setIsModalOpen(true)}
              className="mt-6 w-fit bg-white text-slate-900 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-xl flex items-center space-x-2 active:scale-95"
            >
              <span className="material-symbols-outlined">video_file</span>
              <span>Subir Video de Instalación</span>
            </button>
          )}
        </div>
      </section>

      {/* Modal Nuevo Video */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-sm animate-in">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50">
              <div>
                <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">Publicar Video/Tour</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Biblioteca para Compradores</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="w-12 h-12 flex items-center justify-center bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-colors">
                <span className="material-symbols-outlined text-slate-400">close</span>
              </button>
            </div>
            <form onSubmit={handleAddVideo} className="p-8 space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Título del Video</label>
                <input required type="text" className="w-full h-14 px-5 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-sm" value={newVideo.title} onChange={(e) => setNewVideo({...newVideo, title: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Descripción para el Cliente</label>
                <textarea required className="w-full h-24 p-5 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-sm resize-none" value={newVideo.description} onChange={(e) => setNewVideo({...newVideo, description: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Área Operativa</label>
                  <select className="w-full h-14 px-5 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-sm" value={newVideo.category} onChange={(e) => setNewVideo({...newVideo, category: e.target.value as any})}>
                    {categories.filter(c => c !== 'TODOS').map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Duración (mm:ss)</label>
                  <input type="text" className="w-full h-14 px-5 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-sm" value={newVideo.duration} onChange={(e) => setNewVideo({...newVideo, duration: e.target.value})} />
                </div>
              </div>
              <button type="submit" className="w-full h-16 bg-blue-600 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-xl mt-4">Confirmar y Publicar</button>
            </form>
          </div>
        </div>
      )}

      {/* Grid de Videos */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {filteredVideos.map((vid) => (
          <div key={vid.id} className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm hover:shadow-2xl transition-all group relative">
            <div className="relative aspect-video overflow-hidden">
              <img src={vid.thumbnail} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={vid.title} />
              <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-slate-900/40 transition-colors"></div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 scale-90 group-hover:scale-100 transition-transform">
                  <span className="material-symbols-outlined text-white text-3xl">play_circle</span>
                </div>
              </div>
              <div className="absolute bottom-4 right-4 px-2 py-1 bg-slate-950/80 backdrop-blur-sm text-white text-[10px] font-black rounded-lg">
                {vid.duration}
              </div>
              <div className="absolute top-4 left-4">
                <span className="bg-blue-600/90 backdrop-blur-sm text-white text-[8px] font-black uppercase px-2 py-1 rounded-md tracking-widest">
                  {vid.category}
                </span>
              </div>
            </div>
            
            <div className="p-8">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-black text-slate-800 leading-tight group-hover:text-blue-600 transition-colors">
                  {vid.title}
                </h3>
              </div>
              <p className="text-sm text-slate-500 font-medium leading-relaxed mb-6 h-10 overflow-hidden line-clamp-2">
                {vid.description}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {vid.tags.map(tag => (
                  <span key={tag} className="text-[9px] font-black text-slate-400 bg-slate-50 border border-slate-100 px-2 py-1 rounded-lg uppercase tracking-tighter">
                    #{tag}
                  </span>
                ))}
              </div>

              <button className="w-full py-4 bg-slate-900 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl hover:bg-blue-600 transition-all active:scale-95 flex items-center justify-center space-x-2">
                <span className="material-symbols-outlined text-lg">videocam</span>
                <span>Iniciar Tour Virtual</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Videos;
