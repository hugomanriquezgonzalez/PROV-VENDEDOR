
import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Inventory from './components/Inventory';
import Orders from './components/Orders';
import Clients from './components/Clients';
import PriceLists from './components/PriceLists';
import Users from './components/Users';
import Support from './components/Support';
import Settings from './components/Settings';
import NewOrder from './components/NewOrder';
import CompanyProfile from './components/CompanyProfile';
import BrandLogo from './components/BrandLogo';
import Login from './components/Login';
import { AppUser, UserRole, Order, OrderStatus } from './types';

const initialMockOrders: Order[] = [
  { id: '1001', customer: 'Supermercado Sol', date: '2023-11-20', total: 1250000, status: OrderStatus.PENDING, items: 12, sellerId: 'USR-VENDEDOR-DEMO' },
  { id: '1002', customer: 'Panadería Luna', date: '2023-11-21', total: 450500, status: OrderStatus.PREPARING, items: 4, sellerId: 'USR-ADMIN-DEMO' },
  { id: '1003', customer: 'Restaurante El Gaucho', date: '2023-11-21', total: 2800000, status: OrderStatus.SHIPPED, items: 25, sellerId: 'USR-VENDEDOR-DEMO' },
  { id: '1004', customer: 'Minimarket Central', date: '2023-11-22', total: 890000, status: OrderStatus.DELIVERED, items: 15, sellerId: 'USR-VENDEDOR-2' },
  { id: '1005', customer: 'Distribuidora Hnos', date: '2023-11-22', total: 3450000, status: OrderStatus.PENDING, items: 50, sellerId: 'USR-VENDEDOR-2' },
  { id: '1006', customer: 'Casino Cordillera', date: '2023-11-23', total: 1200000, status: OrderStatus.PREPARING, items: 20, sellerId: 'USR-ADMIN-DEMO' },
  { id: '1007', customer: 'Hotel Estelar', date: '2023-11-23', total: 4500000, status: OrderStatus.SHIPPED, items: 45, sellerId: 'USR-VENDEDOR-DEMO' },
  { id: '1008', customer: 'Botillería Oasis', date: '2023-11-24', total: 720000, status: OrderStatus.DELIVERED, items: 10, sellerId: 'USR-VENDEDOR-2' },
  { id: '1009', customer: 'Minimarket Pepe', date: '2023-11-24', total: 310000, status: OrderStatus.CANCELLED, items: 5, sellerId: 'USR-VENDEDOR-DEMO' },
  { id: '1010', customer: 'Supermercado Ahorro', date: '2023-11-25', total: 6700000, status: OrderStatus.PENDING, items: 80, sellerId: 'USR-ADMIN-DEMO' },
  { id: '1011', customer: 'Panadería Tradición', date: '2023-11-25', total: 220000, status: OrderStatus.PREPARING, items: 3, sellerId: 'USR-VENDEDOR-2' },
  { id: '1012', customer: 'Restaurante Mar y Tierra', date: '2023-11-26', total: 1560000, status: OrderStatus.SHIPPED, items: 18, sellerId: 'USR-VENDEDOR-DEMO' },
  { id: '1013', customer: 'Tienda La Esquina', date: '2023-11-26', total: 480000, status: OrderStatus.DELIVERED, items: 8, sellerId: 'USR-VENDEDOR-2' },
  { id: '1014', customer: 'Casino Express', date: '2023-11-27', total: 950000, status: OrderStatus.PENDING, items: 14, sellerId: 'USR-ADMIN-DEMO' },
  { id: '1015', customer: 'Frutos del Norte', date: '2023-11-27', total: 2300000, status: OrderStatus.PREPARING, items: 22, sellerId: 'USR-VENDEDOR-DEMO' },
  { id: '1016', customer: 'Almacén Don Mario', date: '2023-11-28', total: 125000, status: OrderStatus.SHIPPED, items: 2, sellerId: 'USR-VENDEDOR-2' },
  { id: '1017', customer: 'Super Gourmet', date: '2023-11-28', total: 3900000, status: OrderStatus.DELIVERED, items: 35, sellerId: 'USR-ADMIN-DEMO' },
  { id: '1018', customer: 'Catering Premium', date: '2023-11-29', total: 560000, status: OrderStatus.PENDING, items: 9, sellerId: 'USR-VENDEDOR-DEMO' },
  { id: '1019', customer: 'Minimarket Las Lomas', date: '2023-11-29', total: 440000, status: OrderStatus.PREPARING, items: 7, sellerId: 'USR-VENDEDOR-2' },
  { id: '1020', customer: 'Hostal Patagonia', date: '2023-11-30', total: 1800000, status: OrderStatus.SHIPPED, items: 15, sellerId: 'USR-ADMIN-DEMO' },
  { id: '1021', customer: 'Vinos y Licores SpA', date: '2023-11-30', total: 2100000, status: OrderStatus.DELIVERED, items: 12, sellerId: 'USR-VENDEDOR-DEMO' },
];

const MainLayout: React.FC<{ user: AppUser; onLogout: () => void }> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [orders, setOrders] = useState<Order[]>(initialMockOrders);

  const hasAccess = (tab: string) => {
    switch (tab) {
      case 'dashboard': 
        return [UserRole.ADMIN, UserRole.JEFE_VENTAS, UserRole.VENDEDOR].includes(user.role);
      case 'new-order': 
        return [UserRole.ADMIN, UserRole.JEFE_VENTAS, UserRole.VENDEDOR].includes(user.role);
      case 'inventory': 
        return [UserRole.ADMIN, UserRole.BODEGA].includes(user.role);
      case 'orders': 
        return true; 
      case 'clients': 
        return [UserRole.ADMIN, UserRole.JEFE_VENTAS, UserRole.VENDEDOR].includes(user.role);
      case 'pricelists': 
        return [UserRole.ADMIN, UserRole.JEFE_VENTAS].includes(user.role);
      case 'company-profile':
        return [UserRole.ADMIN, UserRole.JEFE_VENTAS, UserRole.VENDEDOR].includes(user.role);
      case 'users': 
        return user.role === UserRole.ADMIN;
      case 'support':
        return true;
      case 'settings': 
        return true; 
      default: 
        return false;
    }
  };

  React.useEffect(() => {
    if (!hasAccess(activeTab)) {
      if (user.role === UserRole.BODEGA) setActiveTab('inventory');
      else setActiveTab('dashboard'); 
    }
  }, [user.role]);

  const handleSaveOrder = (newOrder: Order) => {
    const orderWithSeller = { ...newOrder, sellerId: user.id };
    setOrders([orderWithSeller, ...orders]);
    setActiveTab('orders');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard user={user} orders={orders} />;
      case 'new-order': return <NewOrder onSaveOrder={handleSaveOrder} />;
      case 'inventory': return <Inventory />;
      case 'orders': return <Orders externalOrders={orders} currentUser={user} />;
      case 'clients': return <Clients user={user} />;
      case 'pricelists': return <PriceLists user={user} />;
      case 'company-profile': return <CompanyProfile user={user} />;
      case 'users': return <Users />;
      case 'support': return <Support user={user} />;
      case 'settings': return <Settings user={user} />;
      default: return <div className="p-20 text-center text-slate-400 font-bold uppercase tracking-widest">Vista no disponible</div>;
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-slate-50 w-full overflow-hidden relative">
      <Sidebar 
        user={user}
        activeTab={activeTab} 
        setActiveTab={handleTabChange} 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
        onLogout={onLogout}
      />

      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <main className="flex-1 overflow-y-auto flex flex-col h-screen w-full">
        <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm flex-shrink-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors active:scale-95"
              >
                <span className="material-symbols-outlined text-2xl">menu</span>
              </button>
              
              <div className="flex items-center">
                <div className="lg:hidden flex items-center">
                  <BrandLogo className="h-6 mr-3" />
                </div>
                <h1 className="text-lg md:text-xl font-black text-slate-800 uppercase tracking-tight truncate max-w-[150px] sm:max-w-none">
                  {activeTab === 'dashboard' && 'Panel de Control'}
                  {activeTab === 'new-order' && 'Nuevo Pedido'}
                  {activeTab === 'inventory' && 'Inventario'}
                  {activeTab === 'orders' && 'Pedidos'}
                  {activeTab === 'clients' && 'Mis Clientes'}
                  {activeTab === 'pricelists' && 'Lista de Precios'}
                  {activeTab === 'company-profile' && 'Perfil Empresa'}
                  {activeTab === 'users' && 'Gestión de Usuarios'}
                  {activeTab === 'support' && 'Soporte'}
                  {activeTab === 'settings' && 'Ajustes'}
                </h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 md:space-x-4">
              <div className="text-right hidden sm:block">
                <p className="text-[10px] font-black text-blue-700 leading-none mb-1 uppercase">{user.role}</p>
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">{user.name}</p>
              </div>
              <div className="w-10 h-10 rounded-xl border-2 border-orange-100 overflow-hidden shadow-inner bg-slate-100 flex-shrink-0">
                <img 
                  src={user.avatar} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </header>
        
        <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);

  const handleLogin = (user: AppUser) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={!currentUser ? <Login onLogin={handleLogin} /> : <Navigate to="/" replace />} 
        />
        <Route 
          path="/*" 
          element={currentUser ? <MainLayout user={currentUser} onLogout={handleLogout} /> : <Navigate to="/login" replace />} 
        />
      </Routes>
    </Router>
  );
};

export default App;
