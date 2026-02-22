
import React, { useState, useMemo } from 'react';
import { Order, OrderStatus, AppUser, UserRole } from '../types';

interface OrdersProps {
  externalOrders?: Order[];
  currentUser: AppUser;
}

const Orders: React.FC<OrdersProps> = ({ externalOrders, currentUser }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [sellerFilter, setSellerFilter] = useState<string>('ALL');
  const [dateStart, setDateStart] = useState<string>('');
  const [dateEnd, setDateEnd] = useState<string>('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  // REGLA: Jefe de Ventas, Administrador y Bodega pueden ver TODO.
  const canSeeAll = [UserRole.ADMIN, UserRole.JEFE_VENTAS, UserRole.BODEGA].includes(currentUser.role);

  // Obtener lista única de vendedores para el filtro (solo si es admin/jefe)
  const availableSellers = useMemo(() => {
    const list = externalOrders || [];
    const sellers = list.map(o => o.sellerId);
    return Array.from(new Set(sellers)).sort();
  }, [externalOrders]);

  const orders = useMemo(() => {
    const list = externalOrders || [];
    if (canSeeAll) return list;
    return list.filter(o => o.sellerId === currentUser.id);
  }, [externalOrders, currentUser, canSeeAll]);

  const formatCLP = (value: number) => {
    return value.toLocaleString('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 });
  };

  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const matchesSearch = o.customer.toLowerCase().includes(searchTerm.toLowerCase()) || o.id.includes(searchTerm);
      const matchesStatus = statusFilter === 'ALL' || o.status === statusFilter;
      const matchesSeller = sellerFilter === 'ALL' || o.sellerId === sellerFilter;
      
      let matchesDate = true;
      if (dateStart) matchesDate = matchesDate && o.date >= dateStart;
      if (dateEnd) matchesDate = matchesDate && o.date <= dateEnd;

      return matchesSearch && matchesStatus && matchesSeller && matchesDate;
    });
  }, [searchTerm, statusFilter, sellerFilter, dateStart, dateEnd, orders]);

  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('ALL');
    setSellerFilter('ALL');
    setDateStart('');
    setDateEnd('');
  };

  const exportToCSV = () => {
    const headers = "ID Pedido,Cliente,Fecha,Articulos,Total,Estado,Vendedor\n";
    const csvContent = filteredOrders.map(o => 
      `${o.id},${o.customer},${o.date},${o.items},${o.total},${o.status},${o.sellerId}`
    ).join("\n");
    
    const blob = new Blob([headers + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `pedidos_prov_${new Date().toISOString().split('T')[0]}.csv`);
    link.click();
  };

  const handleDownloadPDF = () => {
    if (!selectedOrder) return;
    setIsGeneratingPDF(true);
    const originalTitle = document.title;
    document.title = `Pedido_${selectedOrder.id}_${selectedOrder.customer.replace(/\s+/g, '_')}_PROV`;
    setTimeout(() => {
      window.print();
      setIsGeneratingPDF(false);
      setTimeout(() => {
        document.title = originalTitle;
      }, 500);
    }, 600);
  };

  const getStatusStyle = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING: return 'bg-amber-50 text-amber-600 border-amber-200';
      case OrderStatus.PREPARING: return 'bg-blue-50 text-blue-600 border-blue-200';
      case OrderStatus.SHIPPED: return 'bg-indigo-50 text-indigo-600 border-indigo-200';
      case OrderStatus.DELIVERED: return 'bg-green-50 text-green-600 border-green-200';
      case OrderStatus.CANCELLED: return 'bg-red-50 text-red-600 border-red-200';
      default: return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  const handleOpenOrder = (order: Order) => {
    if (!order.lineItems) {
      const q1 = Math.floor(order.items / 2) || 1;
      const q2 = Math.ceil(order.items / 2) || 1;
      order.lineItems = [
        { id: 'm1', name: 'Producto Mayorista A', sku: 'SKU-A', quantity: q1, originalQuantity: q1, pricePerUnit: Math.round(order.total / (order.items || 1)), image: 'https://picsum.photos/100/100?random=1' },
        { id: 'm2', name: 'Producto Mayorista B', sku: 'SKU-B', quantity: q2, originalQuantity: q2, pricePerUnit: Math.round(order.total / (order.items || 1)), image: 'https://picsum.photos/100/100?random=2' }
      ];
    }
    setSelectedOrder(order);
  };

  return (
    <div className="space-y-6 animate-in">
      <style>{`
        @media print {
          @page { size: A4; margin: 15mm; }
          body > *:not(#printable-order) { display: none !important; }
          #root { display: none !important; }
          #printable-order { display: block !important; visibility: visible !important; position: absolute; left: 0; top: 0; width: 100%; background: white; color: black; padding: 0; margin: 0; }
          .no-print { display: none !important; }
        }
      `}</style>

      {/* Template de Impresión */}
      <div id="printable-order" className="hidden print:block font-sans text-slate-900 bg-white p-10">
        {selectedOrder && (
          <div className="w-full">
            <h1 className="text-3xl font-black uppercase">Orden de Pedido</h1>
            <div className="mt-8 flex justify-between border-b pb-8">
              <div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Pedido ID</p>
                <p className="text-xl font-black">#{selectedOrder.id}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Fecha</p>
                <p className="text-xl font-black">{selectedOrder.date}</p>
              </div>
            </div>
            <div className="mt-8">
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Cliente</p>
              <p className="text-2xl font-black">{selectedOrder.customer}</p>
              <p className="text-sm font-bold text-slate-500 mt-1">Vendedor: {selectedOrder.sellerId}</p>
            </div>
            <table className="w-full mt-10">
              <thead>
                <tr className="text-left font-black text-[10px] uppercase tracking-widest text-slate-400 border-b border-slate-100">
                  <th className="py-4">Descripción</th>
                  <th className="py-4 text-center">Cant</th>
                  <th className="py-4 text-right">Precio Unit.</th>
                  <th className="py-4 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {selectedOrder.lineItems?.map(item => (
                  <tr key={item.id}>
                    <td className="py-4 font-bold">{item.name}</td>
                    <td className="py-4 text-center font-bold">{item.quantity}</td>
                    <td className="py-4 text-right font-bold">{formatCLP(item.pricePerUnit)}</td>
                    <td className="py-4 text-right font-black">{formatCLP(item.pricePerUnit * item.quantity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-10 border-t pt-8 flex justify-end">
              <div className="text-right">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Monto Total Bruto</p>
                <p className="text-4xl font-black text-slate-900">{formatCLP(selectedOrder.total)}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal Detalle Pedido */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in no-print">
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Pedido #{selectedOrder.id}</h3>
              <button onClick={() => setSelectedOrder(null)} className="w-12 h-12 flex items-center justify-center bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 shadow-sm transition-all active:scale-95">
                <span className="material-symbols-outlined text-slate-400">close</span>
              </button>
            </div>
            <div className="p-8 overflow-y-auto">
              <div className="grid grid-cols-2 gap-8 mb-6">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cliente</p>
                  <p className="text-lg font-black text-slate-800">{selectedOrder.customer}</p>
                  <p className="text-[10px] font-bold text-blue-600 uppercase mt-1">Vend. ID: {selectedOrder.sellerId}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total</p>
                  <p className="text-2xl font-black text-blue-700">{formatCLP(selectedOrder.total)}</p>
                </div>
              </div>
              <div className="space-y-3">
                {selectedOrder.lineItems?.map(item => (
                  <div key={item.id} className="flex justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-white rounded-xl border border-slate-100 flex items-center justify-center font-black text-[10px] text-slate-400">IMG</div>
                      <div>
                        <span className="text-xs font-black text-slate-800 block">{item.name}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Cant: {item.quantity} u.</span>
                      </div>
                    </div>
                    <span className="text-xs font-black text-slate-800">{formatCLP(item.pricePerUnit * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <button 
                onClick={handleDownloadPDF} 
                className="w-full mt-8 py-4 bg-slate-900 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-black transition-all active:scale-95 flex items-center justify-center space-x-2"
              >
                <span className="material-symbols-outlined">print</span>
                <span>Generar PDF para Impresión</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Panel de Filtros Avanzados */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden no-print">
        <div className="p-6 md:p-8 space-y-6">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            <div className="w-full lg:w-1/3">
              <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">Gestión Operativa</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                {canSeeAll ? 'Filtros globales de administración' : 'Filtros de ventas personales'}
              </p>
            </div>
            <div className="flex flex-col md:flex-row w-full lg:w-2/3 items-center gap-4">
              <div className="relative flex-1 w-full">
                <input 
                  type="text" 
                  placeholder="Buscar por cliente o ID de pedido..." 
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-bold text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <span className="material-symbols-outlined absolute left-4 top-4 text-slate-400">search</span>
              </div>
              <button onClick={exportToCSV} className="w-full md:w-auto px-8 py-4 bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-black flex items-center justify-center space-x-2 shadow-lg transition-all active:scale-95">
                <span className="material-symbols-outlined text-lg">download</span>
                <span>Exportar CSV</span>
              </button>
            </div>
          </div>

          {/* Barra de Selectores de Filtro */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-slate-100">
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Estado de Pedido</label>
              <div className="relative">
                <select 
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold text-xs appearance-none"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="ALL">Todos los Estados</option>
                  {Object.values(OrderStatus).map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-lg">filter_list</span>
              </div>
            </div>

            {canSeeAll && (
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Vendedor</label>
                <div className="relative">
                  <select 
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold text-xs appearance-none"
                    value={sellerFilter}
                    onChange={(e) => setSellerFilter(e.target.value)}
                  >
                    <option value="ALL">Todos los Vendedores</option>
                    {availableSellers.map(sellerId => (
                      <option key={sellerId} value={sellerId}>{sellerId.replace('USR-', '')}</option>
                    ))}
                  </select>
                  <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-lg">person</span>
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Fecha Desde</label>
              <div className="relative">
                <input 
                  type="date" 
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold text-xs"
                  value={dateStart}
                  onChange={(e) => setDateStart(e.target.value)}
                />
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-lg">calendar_today</span>
              </div>
            </div>

            <div className="space-y-1.5 relative">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Fecha Hasta</label>
              <div className="relative">
                <input 
                  type="date" 
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold text-xs"
                  value={dateEnd}
                  onChange={(e) => setDateEnd(e.target.value)}
                />
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-lg">event</span>
              </div>
              <button 
                onClick={resetFilters}
                className="absolute -right-0 -bottom-1 text-[9px] font-black text-blue-600 hover:text-blue-800 uppercase tracking-tighter"
              >
                Limpiar Filtros
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de Resultados */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden no-print">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-[10px] uppercase font-black tracking-widest text-slate-400 border-b border-slate-100">
              <tr>
                <th className="px-8 py-6">ID Pedido</th>
                <th className="px-6 py-6">Cliente</th>
                {canSeeAll && <th className="px-6 py-6">Vendedor</th>}
                <th className="px-6 py-6 text-center">Fecha</th>
                <th className="px-6 py-6">Total Bruto</th>
                <th className="px-6 py-6">Estado</th>
                <th className="px-8 py-6 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-blue-50/20 transition-colors group">
                    <td className="px-8 py-5">
                      <span className="font-mono text-xs font-black text-blue-600 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-100 shadow-sm">#{o.id}</span>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-sm font-black text-slate-800 tracking-tight">{o.customer}</span>
                    </td>
                    {canSeeAll && (
                      <td className="px-6 py-5">
                        <span className="text-[10px] font-black text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl uppercase tracking-tighter">{o.sellerId.replace('USR-', '')}</span>
                      </td>
                    )}
                    <td className="px-6 py-5 text-center text-xs font-bold text-slate-500">{o.date}</td>
                    <td className="px-6 py-5 font-black text-slate-800">{formatCLP(o.total)}</td>
                    <td className="px-6 py-5">
                      <span className={`text-[9px] font-black px-3 py-1.5 rounded-xl border uppercase tracking-wider ${getStatusStyle(o.status)}`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button 
                        onClick={() => handleOpenOrder(o)} 
                        className="text-[10px] font-black text-blue-600 uppercase border-2 border-blue-50 bg-white hover:border-blue-100 hover:bg-blue-50 rounded-xl px-5 py-2.5 transition-all active:scale-95 shadow-sm"
                      >
                        Ver Detalle
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={canSeeAll ? 7 : 6} className="px-8 py-24 text-center">
                    <div className="flex flex-col items-center opacity-30">
                      <span className="material-symbols-outlined text-7xl mb-4 text-slate-300">manage_search</span>
                      <p className="text-xs font-black uppercase tracking-widest text-slate-500">Sin resultados para los filtros aplicados</p>
                      <button 
                        onClick={resetFilters}
                        className="mt-4 text-[10px] font-black text-blue-600 underline uppercase tracking-widest"
                      >
                        Restablecer todos los filtros
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Info Footer de Tabla */}
        <div className="bg-slate-50 p-6 border-t border-slate-100 flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
          <div>Mostrando {filteredOrders.length} de {orders.length} pedidos</div>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
              <span>{filteredOrders.filter(o => o.status === OrderStatus.PENDING).length} Pendientes</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>{filteredOrders.filter(o => o.status === OrderStatus.DELIVERED).length} Entregados</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;
