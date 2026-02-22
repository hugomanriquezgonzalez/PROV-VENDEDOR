
import React from 'react';
import BrandLogo from './BrandLogo';
import { AppUser, UserRole } from '../types';

interface SidebarProps {
  user: AppUser;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ user, activeTab, setActiveTab, isOpen, onClose, onLogout }) => {
  const allMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', roles: [UserRole.ADMIN, UserRole.JEFE_VENTAS, UserRole.VENDEDOR] },
    { id: 'new-order', label: 'Nuevo Pedido', icon: 'add_shopping_cart', roles: [UserRole.ADMIN, UserRole.JEFE_VENTAS, UserRole.VENDEDOR] },
    { id: 'inventory', label: 'Inventario', icon: '📦', roles: [UserRole.ADMIN, UserRole.BODEGA] },
    { id: 'orders', label: 'Pedidos', icon: '🛒', roles: [UserRole.ADMIN, UserRole.BODEGA, UserRole.JEFE_VENTAS, UserRole.VENDEDOR] },
    { id: 'clients', label: 'Clientes', icon: '👥', roles: [UserRole.ADMIN, UserRole.JEFE_VENTAS, UserRole.VENDEDOR] },
    { id: 'pricelists', label: 'Lista Precios', icon: 'sell', roles: [UserRole.ADMIN, UserRole.JEFE_VENTAS] },
    { id: 'company-profile', label: 'PERFIL', icon: 'business_center', roles: [UserRole.ADMIN, UserRole.JEFE_VENTAS, UserRole.VENDEDOR] },
    { id: 'users', label: 'Usuarios', icon: 'manage_accounts', roles: [UserRole.ADMIN] },
    { id: 'support', label: 'Soporte', icon: 'support_agent', roles: [UserRole.ADMIN, UserRole.BODEGA, UserRole.JEFE_VENTAS, UserRole.VENDEDOR] },
    { id: 'settings', label: 'Ajustes', icon: 'settings', roles: [UserRole.ADMIN, UserRole.BODEGA, UserRole.JEFE_VENTAS, UserRole.VENDEDOR] },
  ];

  const menuItems = allMenuItems.filter(item => item.roles.includes(user.role));

  const sidebarClasses = `
    fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 text-slate-300 flex flex-col transform transition-transform duration-300 ease-in-out
    lg:translate-x-0 lg:static lg:flex-shrink-0
    ${isOpen ? 'translate-x-0 shadow-2xl shadow-black/50' : '-translate-x-full'}
  `;

  return (
    <aside className={sidebarClasses}>
      <div className="p-6 flex items-center justify-between">
        <div className="flex flex-col items-start space-y-1">
          <BrandLogo className="h-10" />
          <span className="text-orange-400 text-[10px] font-black tracking-[0.2em] uppercase ml-1">
            {user.role}
          </span>
        </div>
        
        <button 
          onClick={onClose}
          className="lg:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>

      <nav className="flex-1 mt-6 px-4 space-y-2 overflow-y-auto custom-scrollbar">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center space-x-4 px-5 py-4 rounded-2xl transition-all duration-200 group ${
              activeTab === item.id 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/60 translate-x-1' 
                : 'hover:bg-slate-800 hover:text-white'
            }`}
          >
            {['new-order', 'pricelists', 'users', 'settings', 'support', 'company-profile'].includes(item.id) ? (
              <span className={`material-symbols-outlined text-2xl transition-transform group-hover:scale-110 ${activeTab === item.id ? 'scale-110' : ''}`}>
                {item.icon}
              </span>
            ) : (
              <span className={`text-2xl transition-transform group-hover:scale-110 ${activeTab === item.id ? 'scale-110' : ''}`}>
                {item.icon}
              </span>
            )}
            <span className="font-bold tracking-tight text-sm uppercase">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-6 border-t border-slate-800/50 mt-auto">
        <div className="bg-slate-800/40 rounded-2xl p-4 mb-6 border border-slate-700/30">
          <p className="text-[10px] uppercase font-black text-slate-500 mb-1 tracking-widest">Identidad PROV</p>
          <p className="text-xs font-bold text-white truncate">{user.name}</p>
          <p className="text-[9px] text-blue-400 font-black mt-1 uppercase tracking-tighter">{user.role}</p>
        </div>
        
        <button 
          onClick={onLogout}
          className="w-full flex items-center justify-center space-x-2 py-3 text-xs text-slate-400 hover:text-orange-400 hover:bg-orange-500/10 rounded-xl transition-all font-black uppercase tracking-widest"
        >
          <span className="material-symbols-outlined text-lg">logout</span>
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
