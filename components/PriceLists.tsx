
import React, { useState, useMemo } from 'react';
import { PriceList, AppUser, UserRole, Product } from '../types';

// Importamos el pool de productos (simulado para este componente)
const productsPool: Product[] = Array.from({ length: 20 }).map((_, i) => ({
  id: `p-${i}`,
  name: `Producto Mayorista ${i + 1}`,
  sku: `SKU-${1000 + i}`,
  category: 'Abarrotes',
  subCategory: 'Varios',
  price: 5000 + (i * 1200),
  stock: 100,
  minOrder: 1,
  image: `https://picsum.photos/100/100?random=${i}`,
  description: '',
  brand: 'Distribuidora Central'
}));

const initialPriceLists: PriceList[] = [
  { id: 'pl-base', name: 'Lista Base', discountPercentage: 0, color: 'slate' },
  { id: 'pl-mayorista', name: 'Mayorista Gral', discountPercentage: 10, color: 'blue' },
  { id: 'pl-vip', name: 'VIP Gold', discountPercentage: 20, color: 'purple' },
  { id: 'pl-distribuidor', name: 'Distribuidor Máster', discountPercentage: 35, color: 'orange' },
];

interface PriceListsProps {
  user: AppUser;
}

const PriceLists: React.FC<PriceListsProps> = ({ user }) => {
  const [lists, setLists] = useState<PriceList[]>(initialPriceLists);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingListId, setEditingListId] = useState<string | null>(null);
  const [pricingListView, setPricingListView] = useState<PriceList | null>(null);
  const [pricingSearch, setPricingSearch] = useState('');
  
  const [listForm, setListForm] = useState({
    name: '',
    discount: 0,
    color: 'slate'
  });

  const canEdit = [UserRole.ADMIN, UserRole.JEFE_VENTAS].includes(user.role);

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue': return 'bg-blue-600 shadow-blue-200';
      case 'purple': return 'bg-purple-600 shadow-purple-200';
      case 'orange': return 'bg-orange-500 shadow-orange-200';
      case 'slate': return 'bg-slate-600 shadow-slate-200';
      default: return 'bg-slate-500 shadow-slate-200';
    }
  };

  const calculateFinalPrice = (basePrice: number, discount: number) => {
    return Math.round(basePrice * (1 - discount / 100));
  };

  const handleOpenCreate = () => {
    if (!canEdit) return;
    setEditingListId(null);
    setListForm({ name: '', discount: 0, color: 'slate' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (list: PriceList) => {
    if (!canEdit) return;
    setEditingListId(list.id);
    setListForm({
      name: list.name,
      discount: list.discountPercentage,
      color: list.color
    });
    setIsModalOpen(true);
  };

  const handleSaveList = (e: React.FormEvent) => {
    e.preventDefault();
    if (!listForm.name || !canEdit) return;

    if (editingListId) {
      setLists(prev => prev.map(l => l.id === editingListId ? {
        ...l,
        name: listForm.name,
        discountPercentage: Number(listForm.discount),
        color: listForm.color
      } : l));
    } else {
      const createdList: PriceList = {
        id: `pl-${Date.now()}`,
        name: listForm.name,
        discountPercentage: Number(listForm.discount),
        color: listForm.color
      };
      setLists([...lists, createdList]);
    }
    setIsModalOpen(false);
  };

  const filteredPricingProducts = useMemo(() => {
    return productsPool.filter(p => 
      p.name.toLowerCase().includes(pricingSearch.toLowerCase()) || 
      p.sku.toLowerCase().includes(pricingSearch.toLowerCase())
    );
  }, [pricingSearch]);

  if (pricingListView) {
    return (
      <div className="space-y-6 animate-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm gap-4">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setPricingListView(null)}
              className="w-12 h-12 flex items-center justify-center bg-slate-100 rounded-2xl hover:bg-slate-200 transition-colors"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <div>
              <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Editor de Precios: {pricingListView.name}</h2>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Descuento aplicado: {pricingListView.discountPercentage}%</p>
            </div>
          </div>
          <div className="relative w-full md:w-80">
            <input 
              type="text" 
              placeholder="Buscar producto o código..."
              className="w-full h-12 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/10 font-bold text-xs"
              value={pricingSearch}
              onChange={(e) => setPricingSearch(e.target.value)}
            />
            <span className="material-symbols-outlined absolute left-3 top-3 text-slate-400 text-lg">search</span>
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-[10px] uppercase font-black tracking-widest text-slate-400 border-b border-slate-100">
                <tr>
                  <th className="px-8 py-5">Producto</th>
                  <th className="px-6 py-5">Código SKU</th>
                  <th className="px-6 py-5">Precio Base (Neto)</th>
                  <th className="px-6 py-5">Descuento</th>
                  <th className="px-8 py-5 text-right">Precio de Venta Final</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPricingProducts.map(product => (
                  <tr key={product.id} className="hover:bg-blue-50/20 transition-colors group">
                    <td className="px-8 py-4">
                      <div className="flex items-center space-x-4">
                        <img src={product.image} className="w-10 h-10 rounded-xl object-cover border border-slate-100" />
                        <span className="text-sm font-black text-slate-800 tracking-tight">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-mono font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-lg uppercase">{product.sku}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-slate-500">${product.price.toLocaleString('es-CL')}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] font-black text-orange-600 bg-orange-50 px-2 py-1 rounded-lg uppercase">
                        -${(product.price - calculateFinalPrice(product.price, pricingListView.discountPercentage)).toLocaleString('es-CL')}
                      </span>
                    </td>
                    <td className="px-8 py-4 text-right">
                      <span className="text-lg font-black text-slate-900">
                        ${calculateFinalPrice(product.price, pricingListView.discountPercentage).toLocaleString('es-CL')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in">
      {/* Modal Nueva/Editar Tarifa */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in">
          <div className="bg-white w-full max-md rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50">
              <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">{editingListId ? 'Configurar Lista' : 'Nueva Tarifa'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="material-symbols-outlined text-slate-400">close</button>
            </div>
            <form onSubmit={handleSaveList} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nombre</label>
                <input required type="text" className="w-full h-14 px-5 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-sm" value={listForm.name} onChange={(e) => setListForm({...listForm, name: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">% Descuento Global</label>
                <input required type="number" className="w-full h-14 px-5 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-black text-sm" value={listForm.discount} onChange={(e) => setListForm({...listForm, discount: Number(e.target.value)})} />
              </div>
              <button type="submit" className="w-full h-14 bg-blue-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl">Guardar Cambios</button>
            </form>
          </div>
        </div>
      )}

      {/* Header Seccional */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center space-x-5">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-200">
            <span className="material-symbols-outlined text-3xl">sell</span>
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Estrategia Comercial</h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Gestión de precios por segmento de cliente</p>
          </div>
        </div>
        {canEdit && (
          <button 
            onClick={handleOpenCreate}
            className="flex items-center space-x-2 px-8 py-4 bg-slate-900 text-white rounded-2xl hover:bg-black transition-all shadow-xl font-black text-xs uppercase tracking-[0.2em]"
          >
            <span className="material-symbols-outlined">add_circle</span>
            <span>Nueva Lista de Precios</span>
          </button>
        )}
      </div>

      {/* Grid de Listas */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 pb-12">
        {lists.map((list) => (
          <div key={list.id} className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all group flex flex-col h-full border-b-8" style={{ borderBottomColor: list.color === 'slate' ? '#475569' : list.color === 'blue' ? '#2563eb' : list.color === 'purple' ? '#9333ea' : '#f97316' }}>
            <div className="p-8 flex-1">
              <div className="flex justify-between items-start mb-6">
                <span className="material-symbols-outlined text-2xl text-slate-400">payments</span>
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">ID: {list.id}</span>
              </div>
              <h3 className="text-xl font-black text-slate-800 mb-1 leading-tight">{list.name}</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mb-6">Descuento: {list.discountPercentage}%</p>
              
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 text-center mb-6">
                <p className="text-xs font-black text-blue-600 uppercase tracking-widest mb-1">Impacto Medio</p>
                <p className="text-2xl font-black text-slate-900">-${(15000 * (list.discountPercentage/100)).toLocaleString('es-CL')}</p>
                <p className="text-[8px] font-bold text-slate-400 uppercase mt-1">Ahorro estimado por cada $15k</p>
              </div>

              <div className="space-y-3">
                <button 
                  onClick={() => setPricingListView(list)}
                  className="w-full py-3 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all flex items-center justify-center space-x-2"
                >
                  <span className="material-symbols-outlined text-sm">table_chart</span>
                  <span>Gestionar Precios SKU</span>
                </button>
                {canEdit && (
                  <button 
                    onClick={() => handleOpenEdit(list)}
                    className="w-full py-3 bg-slate-100 text-slate-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all"
                  >
                    Configurar Descuento
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PriceLists;
