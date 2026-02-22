
import React, { useState } from 'react';
import { geminiService } from '../services/geminiService';

const AIInsights: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [insight, setInsight] = useState<string | null>(null);

  const getSalesAnalysis = async () => {
    setLoading(true);
    const mockData = [
      { month: 'Octubre', sales: 42000 },
      { month: 'Noviembre', sales: 58000 }
    ];
    try {
      const result = await geminiService.analyzeSalesTrends(mockData);
      setInsight(result);
    } catch (e) {
      setInsight("Error al conectar con la IA de PROV.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-blue-700 via-blue-800 to-slate-900 rounded-3xl p-10 text-white relative overflow-hidden shadow-2xl border border-blue-500/20">
        <div className="relative z-10">
          <div className="inline-block px-3 py-1 bg-orange-500 text-[10px] font-black uppercase tracking-widest rounded-full mb-4">
            Powered by Gemini 2.0
          </div>
          <h2 className="text-4xl font-black mb-4 tracking-tight">Potencia tus Ventas ✨</h2>
          <p className="text-blue-100 max-w-xl text-lg font-medium leading-relaxed">
            Analiza patrones de compra, optimiza tu catálogo y recibe sugerencias inteligentes de precios para maximizar tu rentabilidad en PROV Mayorista.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <button 
              onClick={getSalesAnalysis}
              className="bg-white text-blue-700 px-8 py-3.5 rounded-2xl font-black hover:bg-orange-50 hover:text-orange-600 transition-all shadow-xl active:scale-95"
            >
              Análisis de Tendencias
            </button>
            <button className="bg-blue-600/30 border-2 border-blue-400/30 text-white px-8 py-3.5 rounded-2xl font-black hover:bg-blue-600/50 transition-all backdrop-blur-sm">
              Sugerir Precios por Volumen
            </button>
          </div>
        </div>
        <div className="absolute -bottom-10 -right-10 opacity-10 select-none">
          <div className="text-[200px] rotate-12">📦</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center uppercase tracking-tight">
            <span className="p-2 bg-blue-100 rounded-xl mr-3 text-blue-600">💡</span> 
            Insights Estratégicos
          </h3>
          <div className="min-h-[200px]">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-full space-y-4 py-10">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce"></div>
                  <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce [animation-delay:-.3s]"></div>
                  <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce [animation-delay:-.5s]"></div>
                </div>
                <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">IA Generando Estrategia...</span>
              </div>
            ) : insight ? (
              <div className="p-6 bg-slate-50 rounded-2xl border border-blue-100 text-slate-700 leading-relaxed whitespace-pre-wrap font-medium shadow-inner">
                {insight}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center py-10">
                <p className="text-slate-400 font-bold uppercase text-xs tracking-widest px-10">
                  Presiona un botón arriba para que Gemini analice tu desempeño actual
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center uppercase tracking-tight">
            <span className="p-2 bg-orange-100 rounded-xl mr-3 text-orange-600">📈</span> 
            Proyección del Sector
          </h3>
          <div className="space-y-4">
            {[
              { label: 'Granos y Semillas', level: 'Alta Demanda (+18%)', icon: '🌾', trend: 'up' },
              { label: 'Aceites Mayoristas', level: 'Mercado Estable', icon: '🛢️', trend: 'stable' },
              { label: 'Insumos de Panadería', level: 'Tendencia Creciente', icon: '🍞', trend: 'up' },
            ].map((pred, i) => (
              <div key={i} className="group flex items-center justify-between p-4 border border-slate-50 rounded-2xl hover:bg-slate-50 transition-all cursor-default">
                <div className="flex items-center space-x-4">
                  <span className="text-2xl bg-white p-2 rounded-xl shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">{pred.icon}</span>
                  <span className="font-black text-slate-700">{pred.label}</span>
                </div>
                <span className={`text-[10px] font-black px-3 py-1.5 rounded-xl uppercase tracking-wider ${pred.trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                  {pred.level}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-8 p-4 bg-orange-50 rounded-xl border border-orange-100">
            <p className="text-[11px] font-bold text-orange-700 uppercase leading-relaxed text-center">
              ⚠️ Alerta PROV: Se prevé aumento de demanda en aceites para la próxima semana. Considera ajustar stock.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIInsights;
