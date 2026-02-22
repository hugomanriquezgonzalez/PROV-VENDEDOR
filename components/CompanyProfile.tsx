
import React, { useState } from 'react';
import Documentation from './Documentation';
import Videos from './Videos';
import { AppUser, UserRole } from '../types';

interface CompanyProfileProps {
  user: AppUser;
}

type ProfileTab = 'docs' | 'videos' | 'reviews';

interface Review {
  id: string;
  user: string;
  rate: number;
  comment: string;
  date: string;
  response?: string;
}

const CompanyProfile: React.FC<CompanyProfileProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<ProfileTab>('docs');
  const isAdmin = user.role === UserRole.ADMIN;
  const companyName = "Distribuidora Central S.A.";

  const [reviews, setReviews] = useState<Review[]>([
    { id: 'R-01', user: 'Minimarket El Amanecer', rate: 5, comment: 'La logística de Distribuidora Central es impecable. El tour por sus bodegas nos dio la confianza para cerrar el contrato anual.', date: 'Hoy' },
    { id: 'R-02', user: 'Supermercado Central SpA', rate: 5, comment: 'Excelentes certificaciones sanitarias. Todo al día y transparente.', date: 'Ayer', response: 'Muchas gracias por su confianza. En Distribuidora Central trabajamos día a día por mantener los estándares más altos para nuestros socios.' },
    { id: 'R-03', user: 'Comercializadora del Sur', rate: 4, comment: 'Muy buena infraestructura, los videos de picking automatizado son impresionantes.', date: 'Hace 3 días' },
  ]);

  const [respondingTo, setRespondingTo] = useState<string | null>(null);
  const [responseText, setResponseText] = useState('');

  const handleSendResponse = (reviewId: string) => {
    setReviews(prev => prev.map(r => 
      r.id === reviewId ? { ...r, response: responseText } : r
    ));
    setRespondingTo(null);
    setResponseText('');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in pb-20 px-2">
      {/* Cabecera Institucional del Vendedor */}
      <section className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden p-8 md:p-12 flex flex-col md:flex-row items-center gap-10">
        <div className="w-32 h-32 md:w-40 md:h-40 bg-slate-50 rounded-[2.5rem] border border-slate-100 flex items-center justify-center p-6 shadow-inner">
          <img src="https://www.prov.cl/wp-content/uploads/2026/01/cropped-prov.png" className="w-full h-full object-contain" alt="Logo Empresa" />
        </div>
        <div className="text-center md:text-left flex-1">
          <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
            <h2 className="text-3xl md:text-4xl font-black text-slate-800 uppercase tracking-tighter">{companyName}</h2>
            <span className="inline-block px-3 py-1 bg-green-600 text-white text-[10px] font-black uppercase tracking-widest rounded-lg w-fit mx-auto md:mx-0">Empresa Certificada</span>
          </div>
          <p className="text-slate-500 font-medium text-lg leading-relaxed max-w-2xl">
            Conozca nuestro centro de distribución, estándares de calidad y la opinión de otros compradores que confían en nuestro suministro mayorista.
          </p>
        </div>
      </section>

      {/* Navegación PERFIL */}
      <div className="flex items-center space-x-2 md:space-x-4 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm overflow-x-auto no-scrollbar">
        {[
          { id: 'docs', label: 'Documentación y Certificados', icon: 'verified' },
          { id: 'videos', label: 'Nuestras Instalaciones', icon: 'domain' },
          { id: 'reviews', label: 'Experiencia del Comprador', icon: 'stars' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as ProfileTab)}
            className={`flex items-center space-x-2 px-8 py-4 rounded-xl transition-all whitespace-nowrap ${
              activeTab === tab.id 
                ? 'bg-slate-900 text-white shadow-lg' 
                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
            }`}
          >
            <span className="material-symbols-outlined text-xl">{tab.icon}</span>
            <span className="text-[11px] font-black uppercase tracking-widest">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Contenido Dinámico */}
      <div className="animate-in">
        {activeTab === 'docs' && <Documentation isAdmin={isAdmin} />}
        {activeTab === 'videos' && <Videos isAdmin={isAdmin} />}
        {activeTab === 'reviews' && (
          <div className="space-y-8">
            <section className="bg-white rounded-[2.5rem] p-10 border border-slate-200 shadow-sm border-l-8 border-l-purple-600">
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center">
                    <span className="material-symbols-outlined text-4xl">chat_bubble</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Voz del Comprador</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Lo que nuestros clientes dicen de Distribuidora Central</p>
                  </div>
                </div>
                {isAdmin && (
                  <div className="bg-purple-100 px-4 py-2 rounded-xl border border-purple-200">
                    <span className="text-[10px] font-black text-purple-700 uppercase">Gestión de Reputación</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 gap-6">
                {reviews.map((rev) => (
                  <div key={rev.id} className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 group hover:bg-white transition-all shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center font-black text-slate-500 text-sm">
                          {rev.user.substring(0, 1)}
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-800 uppercase tracking-tight">{rev.user}</p>
                          <div className="flex text-orange-400">
                            {Array.from({length: rev.rate}).map((_, idx) => <span key={idx} className="material-symbols-outlined text-sm">star</span>)}
                          </div>
                        </div>
                      </div>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{rev.date}</span>
                    </div>
                    <p className="text-base font-medium text-slate-600 leading-relaxed italic mb-6">"{rev.comment}"</p>
                    
                    {/* Respuesta de la Empresa Vendedora */}
                    {rev.response ? (
                      <div className="mt-4 p-6 bg-blue-50 border-l-4 border-blue-500 rounded-2xl animate-in">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="material-symbols-outlined text-blue-600 text-sm">verified_user</span>
                          <span className="text-[10px] font-black text-blue-700 uppercase tracking-widest">Respuesta de {companyName}</span>
                        </div>
                        <p className="text-sm text-blue-900 font-bold leading-relaxed">{rev.response}</p>
                      </div>
                    ) : (
                      isAdmin && respondingTo !== rev.id && (
                        <button 
                          onClick={() => setRespondingTo(rev.id)}
                          className="flex items-center space-x-2 text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline"
                        >
                          <span className="material-symbols-outlined text-sm">reply</span>
                          <span>Responder como Empresa</span>
                        </button>
                      )
                    )}

                    {respondingTo === rev.id && (
                      <div className="mt-4 space-y-3 animate-in">
                        <textarea 
                          autoFocus
                          className="w-full p-4 bg-white border border-blue-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 font-bold text-sm h-24"
                          placeholder="Escribe una respuesta profesional para tu cliente..."
                          value={responseText}
                          onChange={(e) => setResponseText(e.target.value)}
                        />
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => handleSendResponse(rev.id)}
                            className="px-6 py-2 bg-blue-600 text-white font-black text-[10px] uppercase rounded-xl shadow-lg"
                          >
                            Publicar Respuesta
                          </button>
                          <button 
                            onClick={() => {setRespondingTo(null); setResponseText('');}}
                            className="px-6 py-2 bg-slate-200 text-slate-600 font-black text-[10px] uppercase rounded-xl"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyProfile;
