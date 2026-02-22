
import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Cell } from 'recharts';
import { AppUser, UserRole, Order } from '../types';

interface DashboardProps {
  user: AppUser;
  orders: Order[];
}

const mockChartData = [
  { month: 'Ene', sales: 45000, orders: 120 },
  { month: 'Feb', sales: 52000, orders: 145 },
  { month: 'Mar', sales: 48000, orders: 130 },
  { month: 'Abr', sales: 61000, orders: 180 },
  { month: 'May', sales: 55000, orders: 160 },
  { month: 'Jun', sales: 67000, orders: 195 },
];

type StatType = 'ventas' | 'pedidos' | 'clientes' | 'stock';

const Dashboard: React.FC<DashboardProps> = ({ user, orders }) => {
  const [selectedStat, setSelectedStat] = useState<StatType>('ventas');

  const isVendedor = user.role === UserRole.VENDEDOR;
  const filteredOrders = useMemo(() => {
    return isVendedor ? orders.filter(o => o.sellerId === user.id) : orders;
  }, [orders, user, isVendedor]);

  const totalSalesValue = useMemo(() => {
    const sum = filteredOrders.reduce((acc, o) => acc + o.total, 0);
    return `$${(sum / 1000).toFixed(1)}k`;
  }, [filteredOrders]);

  const stats = [
    { id: 'ventas' as StatType, label: isVendedor ? 'Mis Ventas' : 'Ventas Totales', value: totalSalesValue, change: '+12.5%', icon: '💰', color: 'text-blue-600', bgColor: 'bg-blue-50' },
    { id: 'pedidos' as StatType, label: isVendedor ? 'Mis Pedidos' : 'Pedidos Nuevos', value: filteredOrders.length.toString(), change: '+8%', icon: '📥', color: 'text-indigo-600', bgColor: 'bg-indigo-50' },
    { id: 'clientes' as StatType, label: 'Clientes Activos', value: isVendedor ? '24' : '156', change: '+4%', icon: '👥', color: 'text-purple-600', bgColor: 'bg-purple-50' },
    { id: 'stock' as StatType, label: 'Stock Bajo', value: '12', change: 'Atención', icon: '⚠️', color: 'text-orange-600', bgColor: 'bg-orange-50' },
  ];

  const renderDetailContent = () => {
    switch (selectedStat) {
      case 'ventas':
        return (
          <div className="animate-in grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { cat: 'Granos', val: isVendedor ? '$42k' : '$142k', p: '43%' },
              { cat: 'Aceites', val: isVendedor ? '$28k' : '$98k', p: '30%' },
              { cat: 'Otros', val: isVendedor ? '$18k' : '$88k', p: '27%' }
            ].map((item, i) => (
              <div key={i} className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{item.cat}</p>
                <p className="text-lg font-black text-slate-800">{item.val}</p>
                <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-blue-600 h-full" style={{ width: item.p }}></div>
                </div>
              </div>
            ))}
          </div>
        );
      case 'pedidos':
        return (
          <div className="animate-in space-y-3">
            {filteredOrders.slice(0, 3).map((order, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center space-x-3">
                  <span className="font-mono text-[10px] font-black text-indigo-600">#{order.id}</span>
                  <span className="text-xs font-bold text-slate-700">{order.customer}</span>
                </div>
                <span className="text-[9px] font-black uppercase px-2 py-1 bg-white border border-slate-200 rounded-lg text-slate-500">{order.status}</span>
              </div>
            ))}
            {filteredOrders.length === 0 && <p className="text-xs text-slate-400 text-center py-4">No hay pedidos registrados.</p>}
          </div>
        );
      case 'clientes':
        return (
          <div className="animate-in flex flex-wrap gap-3">
            {[
              { name: 'Distribuidora Hnos', vol: 'High' },
              { name: 'Minimarket Pepe', vol: 'Medium' },
              { name: 'Casino Central', vol: 'High' }
            ].map((client, i) => (
              <div key={i} className="flex-1 min-w-[140px] bg-white p-3 rounded-xl border-2 border-slate-50 shadow-sm flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-black text-xs">
                  {client.name[0]}
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-800 leading-none">{client.name}</p>
                  <p className="text-[9px] text-purple-500 font-bold uppercase mt-1">Vol: {client.vol}</p>
                </div>
              </div>
            ))}
          </div>
        );
      case 'stock':
        return (
          <div className="animate-in grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { prod: 'Harina 000 25kg', q: '8 u.', status: 'Crítico' },
              { prod: 'Arroz G1 50kg', q: '12 u.', status: 'Alerta' }
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-orange-50 rounded-xl border border-orange-100">
                <div>
                  <p className="text-xs font-black text-slate-800">{item.prod}</p>
                  <p className="text-[10px] text-orange-600 font-bold uppercase">Quedan: {item.q}</p>
                </div>
                <span className="text-[9px] font-black uppercase px-2 py-1 bg-orange-600 text-white rounded-lg animate-pulse">{item.status}</span>
              </div>
            ))}
          </div>
        );
    }
  };

  return (
    <div className="space-y-6 animate-in">
      {/* Grid de Estadísticas con Interacción */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat) => (
          <button 
            key={stat.id} 
            onClick={() => setSelectedStat(stat.id)}
            className={`text-left bg-white p-5 md:p-6 rounded-2xl border transition-all duration-200 group active:scale-[0.97] ${
              selectedStat === stat.id 
                ? 'border-blue-500 ring-4 ring-blue-500/10 shadow-lg shadow-blue-900/5 translate-y-[-4px]' 
                : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-slate-500">{stat.label}</p>
                <p className={`text-2xl font-black mt-1 ${stat.color}`}>{stat.value}</p>
              </div>
              <div className={`p-2.5 rounded-xl transition-transform group-hover:scale-110 ${stat.bgColor} ${stat.color}`}>
                <span className="text-xl">{stat.icon}</span>
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${stat.id === 'stock' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>
                {stat.change}
              </span>
              <span className="text-slate-400 text-[10px] ml-2 font-bold uppercase tracking-tight">Detalles →</span>
            </div>
          </button>
        ))}
      </div>

      {/* Panel de Detalle Operativo */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm border-l-4 border-l-blue-600">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-inner ${stats.find(s => s.id === selectedStat)?.bgColor}`}>
              {stats.find(s => s.id === selectedStat)?.icon}
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">
                Detalle de {stats.find(s => s.id === selectedStat)?.label}
              </h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {isVendedor ? 'Rendimiento individual' : 'Información operativa global'}
              </p>
            </div>
          </div>
          <button className="text-[10px] font-black text-blue-600 uppercase border-2 border-blue-50 border-dashed px-4 py-2 rounded-xl hover:bg-blue-50 transition-colors">
            Ver Reporte Completo
          </button>
        </div>
        
        <div className="min-h-[120px]">
          {renderDetailContent()}
        </div>
      </div>

      {/* Gráficos de Tendencias */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-10">
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center">
            <span className="w-1.5 h-6 bg-blue-600 rounded-full mr-3"></span>
            Tendencia de Ventas
          </h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 700}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 700}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 800, fontSize: '12px'}}
                />
                <Bar dataKey="sales" fill="#2563eb" radius={[4, 4, 0, 0]}>
                   {mockChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === mockChartData.length - 1 ? '#2563eb' : '#93c5fd'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center">
            <span className="w-1.5 h-6 bg-orange-500 rounded-full mr-3"></span>
            Volumen de Pedidos
          </h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 700}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 700}} />
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 800, fontSize: '12px'}}
                />
                <Line type="monotone" dataKey="orders" stroke="#f97316" strokeWidth={3} dot={{r: 4, fill: '#f97316', strokeWidth: 2, stroke: '#fff'}} activeDot={{r: 7}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
