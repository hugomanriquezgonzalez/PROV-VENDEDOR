
import React, { useState, useRef, useMemo } from 'react';
import { Product } from '../types';
import { geminiService } from '../services/geminiService';

// Generador de datos masivos para el inventario
const generateProducts = (): Product[] => {
  const categories = [
    { name: 'Abarrotes', subs: ['Granos', 'Pastas', 'Conservas', 'Aceites'], prefix: 'AB' },
    { name: 'Bebidas', subs: ['Aguas', 'Bebidas', 'Jugos', 'Cervezas'], prefix: 'BE' },
    { name: 'Lácteos', subs: ['Leches', 'Quesos', 'Yogurts', 'Mantequillas'], prefix: 'LA' },
    { name: 'Carnes', subs: ['Vacuno', 'Pollo', 'Cerdo', 'Embutidos'], prefix: 'CA' },
    { name: 'Limpieza', subs: ['Detergentes', 'Desinfectantes', 'Papelería'], prefix: 'LI' },
    { name: 'Higiene', subs: ['Jabones', 'Shampoos', 'Cuidado Bucal'], prefix: 'HI' },
    { name: 'Congelados', subs: ['Verduras', 'Pre-fritos', 'Carnes Congeladas'], prefix: 'CO' },
    { name: 'Panadería', subs: ['Harinas', 'Levaduras', 'Insumos'], prefix: 'PA' },
    { name: 'Mascotas', subs: ['Perros', 'Gatos', 'Accesorios'], prefix: 'MA' },
    { name: 'Salsas', subs: ['Condimentos', 'Salsas', 'Aderezos'], prefix: 'SA' }
  ];

  const brandPool = ['Prov Select', 'Distribuidora Central', 'Calidad Master', 'Ahorro Pack', 'Premium Food', 'Industrial Net'];
  
  const products: Product[] = [];
  
  for (let i = 1; i <= 100; i++) {
    const catIdx = Math.floor((i - 1) / 10);
    const cat = categories[catIdx];
    const sub = cat.subs[Math.floor(Math.random() * cat.subs.length)];
    const brand = brandPool[Math.floor(Math.random() * brandPool.length)];
    const price = Math.floor(Math.random() * (120000 - 5000 + 1)) + 5000;
    const stock = Math.floor(Math.random() * 500);
    const sku = `${cat.prefix}-${sub.substring(0, 3).toUpperCase()}-${String(i).padStart(3, '0')}`;
    
    products.push({
      id: i.toString(),
      sku: sku,
      name: `${sub} ${brand} Formato Mayorista #${i}`,
      category: cat.name,
      subCategory: sub,
      price: price,
      stock: stock,
      minOrder: Math.floor(Math.random() * 20) + 1,
      image: `https://picsum.photos/200/200?random=${i}`,
      description: `Producto de alta calidad para distribución mayorista. Ideal para retail y canal HORECA. Marca: ${brand}.`,
      brand: brand
    });
  }
  
  return products;
};

const initialProducts: Product[] = generateProducts();

const Inventory: React.FC = () => {
  const [products, setProducts] = useState(initialProducts);
  const [optimizingId, setOptimizingId] = useState<string | null>(null);
  const [showImportTools, setShowImportTools] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '', sku: '', category: '', subCategory: '', price: 0, stock: 0, minOrder: 1, description: '', brand: ''
  });

  const [totalPriceWithIVA, setTotalPriceWithIVA] = useState<number>(0);
  const [isNewCategory, setIsNewCategory] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const productImgInputRef = useRef<HTMLInputElement>(null);

  const existingCategories = useMemo(() => {
    const cats = products.map(p => p.category);
    return Array.from(new Set(cats)).filter(Boolean).sort();
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           p.brand?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'ALL' || p.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, categoryFilter, products]);

  const formatCLP = (value: number | string) => {
    const num = typeof value === 'string' ? parseInt(value.replace(/\D/g, '')) : value;
    if (isNaN(num)) return '';
    return num.toLocaleString('es-CL');
  };

  const handleNetPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    const net = parseInt(rawValue) || 0;
    const total = Math.round(net * 1.19);
    setFormData(prev => ({ ...prev, price: net }));
    setTotalPriceWithIVA(total);
  };

  const handleTotalPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    const total = parseInt(rawValue) || 0;
    const net = Math.round(total / 1.19);
    setTotalPriceWithIVA(total);
    setFormData(prev => ({ ...prev, price: net }));
  };

  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
    setFormData({ ...product });
    setTotalPriceWithIVA(Math.round(product.price * 1.19));
    setImagePreview(product.image);
    setIsFormOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedProduct: Product = {
      id: editingProduct ? editingProduct.id : `prod-${Date.now()}`,
      sku: formData.sku || `AUTO-${Date.now()}`,
      name: formData.name || '',
      category: formData.category || 'Varios',
      subCategory: formData.subCategory || '',
      price: Number(formData.price) || 0,
      stock: Number(formData.stock) || 0,
      minOrder: Number(formData.minOrder) || 1,
      image: imagePreview || 'https://picsum.photos/200/200',
      description: formData.description || '',
      brand: formData.brand
    };
    
    if (editingProduct) {
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? updatedProduct : p));
    } else {
      setProducts([updatedProduct, ...products]);
    }
    setIsFormOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({ name: '', sku: '', category: '', subCategory: '', price: 0, stock: 0, minOrder: 1, description: '', brand: '' });
    setImagePreview(null);
    setTotalPriceWithIVA(0);
    setIsNewCategory(false);
    setEditingProduct(null);
  };

  return (
    <div className="space-y-6 animate-in">
      {/* Modal de Producto */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in">
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight">
                {editingProduct ? 'Editar SKU' : 'Añadir al Catálogo'}
              </h3>
              <button onClick={() => { setIsFormOpen(false); resetForm(); }} className="w-12 h-12 flex items-center justify-center bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-colors">
                <span className="material-symbols-outlined text-slate-400">close</span>
              </button>
            </div>
            <form onSubmit={handleSaveProduct} className="p-8 overflow-y-auto space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nombre Comercial</label>
                  <input required type="text" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none font-bold text-sm" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Código SKU</label>
                  <input type="text" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-sm" value={formData.sku} onChange={(e) => setFormData({...formData, sku: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Categoría</label>
                  <select className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-sm" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                    <option value="">Seleccionar</option>
                    {existingCategories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Precio Neto (CLP)</label>
                  <input type="text" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-black text-sm" value={formatCLP(formData.price || 0)} onChange={handleNetPriceChange} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Stock Actual</label>
                  <input type="number" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-sm" value={formData.stock} onChange={(e) => setFormData({...formData, stock: Number(e.target.value)})} />
                </div>
              </div>
              <div className="flex gap-4">
                <button type="button" onClick={() => setIsFormOpen(false)} className="flex-1 py-4 bg-slate-100 text-slate-600 font-black text-xs uppercase rounded-2xl">Cancelar</button>
                <button type="submit" className="flex-[2] py-4 bg-blue-600 text-white font-black text-xs uppercase rounded-2xl shadow-xl shadow-blue-200">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Herramientas de Filtro y Busqueda */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-6 md:p-8">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
          <div className="flex flex-col md:flex-row w-full gap-4">
            <div className="relative flex-1">
              <input 
                type="text" 
                placeholder="Buscar por nombre, SKU o marca..." 
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-bold text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <span className="material-symbols-outlined absolute left-4 top-4 text-slate-400">search</span>
            </div>
            
            <div className="relative md:w-64">
              <select 
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 appearance-none transition-all font-bold text-sm"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="ALL">Todas las Categorías</option>
                {existingCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
              <span className="material-symbols-outlined absolute left-4 top-4 text-slate-400">category</span>
              <span className="material-symbols-outlined absolute right-4 top-4 text-slate-400 pointer-events-none">expand_more</span>
            </div>
          </div>

          <div className="flex items-center space-x-3 w-full lg:w-auto">
            <button 
              onClick={() => setIsFormOpen(true)}
              className="flex-1 lg:flex-none px-8 py-4 bg-blue-600 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 flex items-center justify-center space-x-2"
            >
              <span className="material-symbols-outlined text-lg">add</span>
              <span>Nuevo</span>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase tracking-[0.2em] font-black border-b border-slate-100 sticky top-0 z-10">
              <tr>
                <th className="px-8 py-5">SKU / Producto</th>
                <th className="px-6 py-5">Categoría / Sub</th>
                <th className="px-6 py-5 text-center">Stock</th>
                <th className="px-6 py-5">Precio Mayorista</th>
                <th className="px-8 py-5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-blue-50/20 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center space-x-4">
                      <img src={p.image} className="w-12 h-12 rounded-xl object-cover border border-slate-100 shadow-sm" />
                      <div>
                        <div className="text-[9px] text-blue-600 font-black uppercase tracking-tighter mb-0.5">{p.sku}</div>
                        <div className="text-sm font-black text-slate-800 tracking-tight">{p.name}</div>
                        <div className="text-[9px] text-slate-400 font-bold uppercase">{p.brand}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-slate-800 uppercase tracking-widest">{p.category}</span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter mt-1">Sub: {p.subCategory}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className="inline-flex flex-col items-center">
                      <span className={`text-sm font-black ${p.stock < 50 ? 'text-orange-600' : 'text-slate-800'}`}>
                        {p.stock} u.
                      </span>
                      <div className="w-16 h-1 bg-slate-100 rounded-full mt-2 overflow-hidden">
                        <div 
                          className={`h-full ${p.stock < 50 ? 'bg-orange-500' : 'bg-green-500'}`} 
                          style={{ width: `${Math.min((p.stock / 500) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="text-sm font-black text-blue-700">${formatCLP(p.price)}</div>
                    <div className="text-[9px] font-black text-slate-300 uppercase mt-0.5">IVA Inc: ${formatCLP(Math.round(p.price * 1.19))}</div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end items-center space-x-2">
                      <button onClick={() => handleEditClick(p)} className="p-2 text-slate-400 hover:text-slate-600 rounded-xl transition-all">
                        <span className="material-symbols-outlined text-xl">edit_square</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="bg-slate-50 p-6 border-t border-slate-100 flex justify-between items-center">
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Mostrando {filteredProducts.length} de {products.length} productos en catálogo
          </div>
          <div className="flex space-x-2">
             <div className="flex items-center space-x-1">
               <div className="w-3 h-3 bg-green-500 rounded-full"></div>
               <span className="text-[9px] font-black uppercase text-slate-500">Stock Óptimo</span>
             </div>
             <div className="flex items-center space-x-1 ml-4">
               <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
               <span className="text-[9px] font-black uppercase text-slate-500">Reponer pronto</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
