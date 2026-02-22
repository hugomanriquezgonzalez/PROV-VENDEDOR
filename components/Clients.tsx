
import React, { useState, useMemo } from 'react';
import { Client, PriceList, Order, OrderStatus, AppUser, UserRole } from '../types';

const priceLists: PriceList[] = [
  { id: 'pl-base', name: 'Lista Base', discountPercentage: 0, color: 'slate' },
  { id: 'pl-mayorista', name: 'Mayorista Gral', discountPercentage: 10, color: 'blue' },
  { id: 'pl-vip', name: 'VIP Gold', discountPercentage: 20, color: 'purple' },
  { id: 'pl-distribuidor', name: 'Distribuidor Máster', discountPercentage: 35, color: 'orange' },
];

const mockOrders: Order[] = [
  { id: '1001', customer: 'Juan Pérez', date: '2023-11-20', total: 1250000, status: OrderStatus.DELIVERED, items: 12, sellerId: 'USR-VENDEDOR-DEMO' },
  { id: '1005', customer: 'Juan Pérez', date: '2023-10-15', total: 850000, status: OrderStatus.SHIPPED, items: 8, sellerId: 'USR-VENDEDOR-DEMO' },
  { id: '1002', customer: 'María García', date: '2023-11-18', total: 420000, status: OrderStatus.DELIVERED, items: 4, sellerId: 'USR-VENDEDOR-DEMO' },
  { id: '1008', customer: 'María García', date: '2023-09-12', total: 1100000, status: OrderStatus.DELIVERED, items: 15, sellerId: 'USR-VENDEDOR-DEMO' },
  { id: '1003', customer: 'Roberto Smith', date: '2023-10-05', total: 890000, status: OrderStatus.CANCELLED, items: 10, sellerId: 'USR-VENDEDOR-DEMO' },
  { id: '1004', customer: 'Carolina Soto', date: '2023-11-21', total: 150000, status: OrderStatus.PENDING, items: 2, sellerId: 'USR-VENDEDOR-DEMO' },
];

const initialClients: Client[] = [
  { id: 'C001', name: 'Juan Pérez', company: 'Supermercado El Sol', rut: '76.123.456-7', giro: 'Venta de abarrotes al por menor', address: 'Av. Las Condes 1234, Las Condes', email: 'juan@elsol.cl', phone: '+56 9 1111 2222', totalSpent: 12500000, lastOrderDate: '2023-11-20', status: 'VIP', avatar: 'https://i.pravatar.cc/150?u=C001', priceListId: 'pl-vip' },
  { id: 'C002', name: 'María García', company: 'Minimarket Luna', rut: '12.456.789-0', giro: 'Minimarket y rotisería', address: 'Calle Valparaíso 456, Viña del Mar', email: 'm.garcia@luna.cl', phone: '+56 9 2222 3333', totalSpent: 4200000, lastOrderDate: '2023-11-18', status: 'Activo', avatar: 'https://i.pravatar.cc/150?u=C002', priceListId: 'pl-mayorista' },
  { id: 'C003', name: 'Carlos Ruiz', company: 'Casino Cordillera', rut: '88.222.333-K', giro: 'Servicios de alimentación', address: 'Paseo Ahumada 78, Santiago Centro', email: 'c.ruiz@casino.cl', phone: '+56 9 3333 4444', totalSpent: 8500000, lastOrderDate: '2023-11-22', status: 'Activo', avatar: 'https://i.pravatar.cc/150?u=C003', priceListId: 'pl-distribuidor' },
  { id: 'C004', name: 'Ana Morales', company: 'Pastelería Delicias', rut: '15.667.889-1', giro: 'Fabricación de pan y pasteles', address: 'Avenida Alemania 098, Temuco', email: 'ana.m@delicias.cl', phone: '+56 9 4444 5555', totalSpent: 2100000, lastOrderDate: '2023-11-15', status: 'Nuevo', avatar: 'https://i.pravatar.cc/150?u=C004', priceListId: 'pl-base' },
  { id: 'C005', name: 'Roberto Díaz', company: 'Frutos del Norte', rut: '77.890.123-2', giro: 'Comercialización de frutas y verduras', address: 'Prat 123, Antofagasta', email: 'r.diaz@norte.cl', phone: '+56 9 5555 6666', totalSpent: 15400000, lastOrderDate: '2023-11-21', status: 'VIP', avatar: 'https://i.pravatar.cc/150?u=C005', priceListId: 'pl-distribuidor' },
  { id: 'C020', name: 'Alexis Sánchez', company: 'Tocopilla Export', rut: '17.777.888-2', giro: 'Servicios de transporte y exportación', address: 'Serrano 55, Tocopilla', email: 'alexis@export.cl', phone: '+56 9 1212 3434', totalSpent: 31000000, lastOrderDate: '2023-11-22', status: 'VIP', avatar: 'https://i.pravatar.cc/150?u=C020', priceListId: 'pl-distribuidor' },
];

interface ClientsProps {
  user: AppUser;
}

const Clients: React.FC<ClientsProps> = ({ user }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [editingPriceList, setEditingPriceList] = useState<string | null>(null);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [isAddingClient, setIsAddingClient] = useState(false);
  const [viewingOrdersClient, setViewingOrdersClient] = useState<Client | null>(null);

  const canEditCommercialConditions = [UserRole.ADMIN, UserRole.JEFE_VENTAS].includes(user.role);

  const formatCLP = (value: number) => {
    return value.toLocaleString('es-CL', { style: 'currency', currency: 'CLP', minimumFractionDigits: 0 });
  };

  const formatRut = (value: string) => {
    let rut = value.replace(/[^\dkK]/g, '');
    if (rut.length <= 1) return rut;
    let result = rut.slice(-1);
    rut = rut.slice(0, -1);
    if (rut.length > 0) result = '-' + result;
    if (rut.length > 0) {
      const parts = [];
      for (let i = rut.length; i > 0; i -= 3) {
        parts.unshift(rut.slice(Math.max(0, i - 3), i));
      }
      result = parts.join('.') + result;
    }
    return result;
  };

  const handlePriceListChange = (clientId: string, listId: string) => {
    if (!canEditCommercialConditions) return;
    setClients(prev => prev.map(c => c.id === clientId ? { ...c, priceListId: listId } : c));
    setEditingPriceList(null);
  };

  const getStatusStyle = (status: Client['status']) => {
    switch (status) {
      case 'VIP': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Activo': return 'bg-green-100 text-green-700 border-green-200';
      case 'Inactivo': return 'bg-slate-100 text-slate-500 border-slate-200';
      case 'Nuevo': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getPriceListStyle = (color: string) => {
    const colors: Record<string, string> = {
      slate: 'bg-slate-100 text-slate-700 border-slate-200',
      blue: 'bg-blue-100 text-blue-700 border-blue-200',
      purple: 'bg-purple-100 text-purple-700 border-purple-200',
      orange: 'bg-orange-100 text-orange-700 border-orange-200',
    };
    return colors[color] || colors.slate;
  };

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.rut.includes(searchTerm)
  );

  return (
    <div className="space-y-6 animate-in">
      {/* KPIs Rápidos */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { label: 'Total Clientes', val: clients.length.toString(), sub: '+12 este mes', icon: 'groups', color: 'blue' },
          { label: 'Listas de Precios', val: priceLists.length.toString(), sub: '4 niveles activos', icon: 'sell', color: 'purple' },
          { label: 'Ticket Promedio', val: '$142k', sub: 'Estable', icon: 'receipt_long', color: 'orange' }
        ].map((kpi, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <span className={`material-symbols-outlined text-${kpi.color}-600 p-3 bg-${kpi.color}-50 rounded-2xl`}>
                {kpi.icon}
              </span>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{kpi.label}</span>
            </div>
            <p className="text-3xl font-black text-slate-800">{kpi.val}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* Tabla de Clientes */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 md:p-8 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">Cartera de Compradores</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Gestión de relaciones y condiciones comerciales</p>
          </div>
          <div className="flex w-full md:w-auto space-x-3">
            <div className="relative flex-1 md:w-64">
              <input 
                type="text" 
                placeholder="Buscar por cliente o RUT..." 
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-bold text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <span className="material-symbols-outlined absolute left-3 top-3 text-slate-400">search</span>
            </div>
            <button 
              onClick={() => setIsAddingClient(true)}
              className="flex items-center space-x-2 px-5 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95"
            >
              <span className="material-symbols-outlined text-xl">person_add</span>
              <span className="text-[10px] font-black uppercase tracking-widest">Nuevo Cliente</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto max-h-[600px] overflow-y-auto custom-scrollbar">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-[10px] uppercase font-black tracking-widest text-slate-400 border-b border-slate-100 sticky top-0 z-10">
              <tr>
                <th className="px-8 py-5">Comprador / RUT</th>
                <th className="px-6 py-5">Nivel de Precio</th>
                <th className="px-6 py-5">Volumen Total</th>
                <th className="px-6 py-5">Estado</th>
                <th className="px-8 py-5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredClients.map((client) => {
                const assignedList = priceLists.find(pl => pl.id === client.priceListId) || priceLists[0];
                return (
                  <tr key={client.id} className="hover:bg-blue-50/20 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center space-x-4">
                        <img src={client.avatar} alt={client.name} className="w-12 h-12 rounded-2xl object-cover border-2 border-slate-100 shadow-sm" />
                        <div>
                          <p className="text-sm font-black text-slate-800 tracking-tight">{client.company}</p>
                          <p className="text-[11px] font-bold text-slate-400 uppercase leading-none mt-1">{client.rut}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="relative">
                        {editingPriceList === client.id && canEditCommercialConditions ? (
                          <div className="flex flex-col space-y-1 animate-in">
                            <select 
                              autoFocus
                              onBlur={() => setEditingPriceList(null)}
                              onChange={(e) => handlePriceListChange(client.id, e.target.value)}
                              value={client.priceListId}
                              className="text-[10px] font-black uppercase tracking-wider px-3 py-2 rounded-xl border-2 border-blue-500 focus:outline-none bg-white shadow-xl"
                            >
                              {priceLists.map(pl => (
                                <option key={pl.id} value={pl.id}>{pl.name} (-{pl.discountPercentage}%)</option>
                              ))}
                            </select>
                            <p className="text-[8px] font-black text-blue-600 uppercase ml-1">Seleccionar nuevo nivel</p>
                          </div>
                        ) : (
                          <button 
                            disabled={!canEditCommercialConditions}
                            onClick={() => setEditingPriceList(client.id)}
                            className={`flex items-center space-x-2 text-[9px] font-black px-3 py-2 rounded-xl border uppercase tracking-wider transition-all ${canEditCommercialConditions ? 'hover:shadow-md hover:border-blue-300' : 'cursor-default'} ${getPriceListStyle(assignedList.color)}`}
                          >
                            <span>{assignedList.name}</span>
                            {canEditCommercialConditions && <span className="material-symbols-outlined text-[14px]">edit_note</span>}
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-sm font-black text-slate-800">${client.totalSpent.toLocaleString('es-CL')}</p>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter mt-0.5">-{assignedList.discountPercentage}% aplicado</p>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`text-[9px] font-black px-3 py-1.5 rounded-xl border uppercase tracking-wider ${getStatusStyle(client.status)}`}>
                        {client.status}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end space-x-2">
                        <button 
                          onClick={() => setEditingClient(client)}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all" 
                        >
                          <span className="material-symbols-outlined text-xl">account_circle</span>
                        </button>
                        <button 
                          onClick={() => setViewingOrdersClient(client)}
                          className="p-2 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all" 
                        >
                          <span className="material-symbols-outlined text-xl">history</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Clients;
