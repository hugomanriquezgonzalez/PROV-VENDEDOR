
import React, { useState } from 'react';
import { AppUser } from '../types';

interface SupportProps {
  user: AppUser;
}

const Support: React.FC<SupportProps> = ({ user }) => {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  const tutorialVideos = [
    { title: 'Cómo Crear un Nuevo Pedido', duration: '2:15', category: 'Ventas', thumb: 'https://picsum.photos/seed/pedidos/400/225' },
    { title: 'Gestión de Inventario y Stock', duration: '3:40', category: 'Bodega', thumb: 'https://picsum.photos/seed/stock/400/225' },
    { title: 'Uso de la IA para Precios', duration: '1:50', category: 'Estrategia', thumb: 'https://picsum.photos/seed/ia/400/225' },
    { title: 'Gestión de Listas de Precios', duration: '2:10', category: 'Admin', thumb: 'https://picsum.photos/seed/precios/400/225' },
    { title: 'Análisis de Dashboard de Ventas', duration: '4:20', category: 'Reportes', thumb: 'https://picsum.photos/seed/stats/400/225' },
    { title: 'Sincronización de Datos Cloud', duration: '1:30', category: 'Técnico', thumb: 'https://picsum.photos/seed/cloud/400/225' },
    { title: 'Configuración de Impresoras', duration: '2:50', category: 'Técnico', thumb: 'https://picsum.photos/seed/print/400/225' },
    { title: 'Manejo de Devoluciones', duration: '3:15', category: 'Bodega', thumb: 'https://picsum.photos/seed/return/400/225' },
    { title: 'Optimización de Rutas de Venta', duration: '5:10', category: 'Ventas', thumb: 'https://picsum.photos/seed/route/400/225' },
  ];

  return (
    <div className="space-y-12 animate-in pb-20">
      {/* Centro de Ayuda Principal */}
      <section className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-200 shadow-sm border-t-8 border-t-blue-600">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h3 className="text-3xl font-black text-slate-800 uppercase tracking-tight">Centro de Soporte PROV</h3>
          <p className="text-slate-400 font-bold mt-2 text-lg">Estamos aquí para ayudarte a optimizar tu operación mayorista.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: 'chat', label: 'WhatsApp Directo', sub: '+56 9 1234 5678', color: 'text-green-600', bg: 'bg-green-50' },
            { icon: 'mail', label: 'Mesa de Ayuda', sub: 'soporte@prov.cl', color: 'text-blue-600', bg: 'bg-blue-50' },
            { icon: 'headset_mic', label: 'Central Telefónica', sub: '600 400 5000', color: 'text-orange-600', bg: 'bg-orange-50' },
          ].map((item, i) => (
            <div key={i} className="p-8 bg-slate-50 rounded-3xl border border-slate-100 flex flex-col items-center text-center group hover:bg-white hover:shadow-xl transition-all">
              <span className={`material-symbols-outlined text-4xl mb-4 ${item.color} ${item.bg} p-4 rounded-2xl transition-transform group-hover:scale-110`}>{item.icon}</span>
              <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight">{item.label}</h4>
              <p className="text-xs font-bold text-slate-500 mt-2">{item.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECCIÓN DE VIDEOS TUTORIALES */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-lg">
              <span className="material-symbols-outlined text-2xl">play_circle</span>
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Videos Tutoriales</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Aprende a usar PROV en pocos minutos</p>
            </div>
          </div>
          <button 
            onClick={() => setIsGalleryOpen(true)}
            className="flex items-center space-x-2 px-6 py-3 bg-white border-2 border-slate-100 rounded-2xl text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] hover:border-blue-100 hover:bg-blue-50 transition-all group"
          >
            <span>Ver todos los videos</span>
            <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_right_alt</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tutorialVideos.slice(0, 3).map((video, idx) => (
            <div key={idx} className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all group flex flex-col">
              <div className="relative aspect-video bg-slate-900 overflow-hidden">
                <img src={video.thumb} className="w-full h-full object-cover opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all duration-500" alt={video.title} />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 backdrop-blur-[2px]">
                   <span className="material-symbols-outlined text-white text-6xl drop-shadow-lg scale-90 group-hover:scale-100 transition-transform">play_circle</span>
                </div>
                <div className="absolute bottom-4 right-4 px-2 py-1 bg-black/70 text-white text-[10px] font-black rounded-lg">{video.duration}</div>
              </div>
              <div className="p-8 flex-1 flex flex-col justify-between">
                <div>
                  <span className="inline-block px-2 py-0.5 bg-blue-50 text-blue-600 text-[8px] font-black uppercase rounded-md mb-2">{video.category}</span>
                  <h4 className="text-base font-black text-slate-800 leading-tight group-hover:text-blue-600 transition-colors">{video.title}</h4>
                </div>
                <button className="mt-6 flex items-center text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors group/btn">
                  <span>Ver ahora</span>
                  <span className="material-symbols-outlined text-sm ml-1 group-hover/btn:translate-x-1 transition-transform">arrow_forward</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MODAL GALERÍA COMPLETA */}
      {isGalleryOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md animate-in">
          <div className="bg-slate-50 w-full max-w-6xl h-full max-h-[90vh] rounded-[3rem] shadow-2xl overflow-hidden flex flex-col">
            <div className="p-8 border-b border-slate-200 flex justify-between items-center bg-white">
              <div className="flex items-center space-x-4">
                <span className="material-symbols-outlined text-3xl text-blue-600">movie</span>
                <div>
                  <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Galería de Tutoriales</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Aprende a dominar cada herramienta de PROV</p>
                </div>
              </div>
              <button 
                onClick={() => setIsGalleryOpen(false)}
                className="w-14 h-14 flex items-center justify-center bg-slate-100 border border-slate-200 rounded-2xl hover:bg-slate-200 transition-colors active:scale-95"
              >
                <span className="material-symbols-outlined text-slate-600">close</span>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {tutorialVideos.map((video, idx) => (
                  <div key={idx} className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all group flex flex-col h-full animate-in" style={{ animationDelay: `${idx * 50}ms` }}>
                    <div className="relative aspect-video bg-slate-900 overflow-hidden">
                      <img src={video.thumb} className="w-full h-full object-cover opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all duration-500" alt={video.title} />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 backdrop-blur-[2px]">
                         <span className="material-symbols-outlined text-white text-6xl drop-shadow-lg">play_circle</span>
                      </div>
                      <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/70 text-white text-[10px] font-black rounded-lg">{video.duration}</div>
                    </div>
                    <div className="p-6">
                      <span className="inline-block px-2 py-0.5 bg-blue-50 text-blue-600 text-[8px] font-black uppercase rounded-md mb-2">{video.category}</span>
                      <h4 className="text-sm font-black text-slate-800 leading-tight group-hover:text-blue-600 transition-colors">{video.title}</h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-8 bg-white border-t border-slate-200 text-center">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">PROV Knowledge Base - Soporte Técnico Oficial</p>
            </div>
          </div>
        </div>
      )}

      {/* FORMULARIO DE TICKET */}
      <div className="mt-12 p-10 bg-slate-900 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        <div className="relative z-10">
          <h4 className="text-2xl font-black uppercase tracking-tight mb-8 flex items-center">
            <span className="material-symbols-outlined mr-4 text-blue-400 text-3xl">confirmation_number</span>
            Enviar Ticket de Soporte
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Asunto</label>
              <input type="text" placeholder="¿En qué podemos ayudarte?" className="w-full h-14 px-6 bg-white/5 border border-white/10 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/30 font-bold text-sm text-white transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Categoría</label>
              <select className="w-full h-14 px-6 bg-white/5 border border-white/10 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/30 font-bold text-sm text-white transition-all">
                <option className="text-slate-900">Problema Técnico</option>
                <option className="text-slate-900">Duda Comercial</option>
                <option className="text-slate-900">Error en Pedido</option>
                <option className="text-slate-900">Sugerencia de Mejora</option>
              </select>
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Descripción del Problema</label>
              <textarea placeholder="Explícanos con detalle para darte una solución rápida..." className="w-full p-6 bg-white/5 border border-white/10 rounded-3xl outline-none focus:ring-4 focus:ring-blue-500/30 font-bold text-sm text-white h-40 resize-none transition-all"></textarea>
            </div>
            <button className="md:col-span-2 h-16 bg-blue-600 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-xl hover:bg-blue-700 transition-all active:scale-95 mt-4">Enviar Requerimiento</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
