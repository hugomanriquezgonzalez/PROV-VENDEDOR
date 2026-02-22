
import React, { useState } from 'react';
import { AppUser, UserRole } from '../types';

const initialUsers: AppUser[] = [
  { id: 'U100', name: 'Admin Principal', email: 'admin@prov.cl', role: UserRole.ADMIN, status: 'Activo', avatar: 'https://i.pravatar.cc/150?u=U100' },
  { id: 'U101', name: 'Jefe Almacén', email: 'bodega@prov.cl', role: UserRole.BODEGA, status: 'Activo', avatar: 'https://i.pravatar.cc/150?u=U101' },
  { id: 'U102', name: 'Gerente Comercial', email: 'ventas@prov.cl', role: UserRole.JEFE_VENTAS, status: 'Activo', avatar: 'https://i.pravatar.cc/150?u=U102' },
  { id: 'U103', name: 'Vendedor Senior', email: 'vendedor1@prov.cl', role: UserRole.VENDEDOR, status: 'Activo', avatar: 'https://i.pravatar.cc/150?u=U103' },
  { id: 'U104', name: 'Vendedor Junior', email: 'vendedor2@prov.cl', role: UserRole.VENDEDOR, status: 'Inactivo', avatar: 'https://i.pravatar.cc/150?u=U104' },
];

interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  type: 'security' | 'inventory' | 'sales' | 'system';
  status: 'success' | 'alert' | 'info';
}

const mockAuditLogs: AuditLog[] = [
  { id: 'L-001', timestamp: '2024-01-20 14:30:12', userId: 'U100', userName: 'Admin Principal', action: 'Cambio de parámetros de seguridad global', type: 'security', status: 'success' },
  { id: 'L-002', timestamp: '2024-01-20 13:15:05', userId: 'U102', userName: 'Gerente Comercial', action: 'Actualización masiva de Lista de Precios VIP', type: 'sales', status: 'success' },
  { id: 'L-003', timestamp: '2024-01-20 12:45:22', userId: 'U101', userName: 'Jefe Almacén', action: 'Ajuste manual de stock SKU-BE-CER-005', type: 'inventory', status: 'alert' },
  { id: 'L-004', timestamp: '2024-01-20 11:10:00', userId: 'U103', userName: 'Vendedor Senior', action: 'Anulación de pedido #PED-4492', type: 'sales', status: 'info' },
  { id: 'L-005', timestamp: '2024-01-20 10:05:45', userId: 'U100', userName: 'Admin Principal', action: 'Creación de nuevo usuario U105 (Bodega)', type: 'system', status: 'success' },
  { id: 'L-006', timestamp: '2024-01-19 17:55:12', userId: 'U104', userName: 'Vendedor Junior', action: 'Intento fallido de acceso a configuración de empresa', type: 'security', status: 'alert' },
  { id: 'L-007', timestamp: '2024-01-19 16:30:00', userId: 'U101', userName: 'Jefe Almacén', action: 'Exportación completa de inventario a Excel', type: 'system', status: 'info' },
];

const Users: React.FC = () => {
  const [users, setUsers] = useState<AppUser[]>(initialUsers);
  const [editingUser, setEditingUser] = useState<AppUser | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFullAudit, setShowFullAudit] = useState(false);

  const handleUpdateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setUsers(prev => prev.map(u => u.id === editingUser.id ? editingUser : u));
    setEditingUser(null);
  };

  const getRoleBadgeStyle = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN: return 'bg-red-50 text-red-600 border-red-100';
      case UserRole.BODEGA: return 'bg-orange-50 text-orange-600 border-orange-100';
      case UserRole.JEFE_VENTAS: return 'bg-purple-50 text-purple-600 border-purple-100';
      case UserRole.VENDEDOR: return 'bg-blue-50 text-blue-600 border-blue-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in">
      {/* Modal Editar Usuario */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50">
              <div>
                <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">Gestionar Perfil</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">ID: {editingUser.id}</p>
              </div>
              <button onClick={() => setEditingUser(null)} className="w-12 h-12 flex items-center justify-center bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-colors">
                <span className="material-symbols-outlined text-slate-400">close</span>
              </button>
            </div>
            <form onSubmit={handleUpdateUser} className="p-8 space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nombre Funcionario</label>
                <input 
                  required
                  type="text" 
                  className="w-full h-14 px-5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 font-bold text-sm"
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Correo Corporativo</label>
                <input 
                  required
                  type="email" 
                  className="w-full h-14 px-5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 font-bold text-sm"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Rol en Sistema</label>
                  <select 
                    className="w-full h-14 px-5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 font-bold text-sm"
                    value={editingUser.role}
                    onChange={(e) => setEditingUser({...editingUser, role: e.target.value as UserRole})}
                  >
                    {Object.values(UserRole).map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Estado Cuenta</label>
                  <select 
                    className="w-full h-14 px-5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 font-bold text-sm"
                    value={editingUser.status}
                    onChange={(e) => setEditingUser({...editingUser, status: e.target.value as any})}
                  >
                    <option value="Activo">Activo</option>
                    <option value="Inactivo">Inactivo</option>
                  </select>
                </div>
              </div>
              <button 
                type="submit"
                className="w-full h-14 bg-slate-900 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-xl hover:bg-black transition-all active:scale-95"
              >
                Guardar Cambios de Perfil
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Header Seccional */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Equipo de Trabajo PROV</h2>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Gestión administrativa de accesos y perfiles</p>
        </div>
        <div className="flex w-full md:w-auto gap-3">
          <div className="relative flex-1 md:w-64">
            <input 
              type="text" 
              placeholder="Buscar por nombre o rol..." 
              className="w-full pl-10 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-bold text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="material-symbols-outlined absolute left-3 top-4 text-slate-400">person_search</span>
          </div>
          <button className="px-6 py-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all shadow-xl font-black text-[10px] uppercase tracking-widest flex items-center space-x-2">
            <span className="material-symbols-outlined text-lg">add_moderator</span>
            <span>Nuevo Usuario</span>
          </button>
        </div>
      </div>

      {/* Grid de Usuarios */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-6">
        {filteredUsers.map((u) => (
          <div key={u.id} className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-16 h-16 opacity-5 flex items-center justify-center -translate-y-4 translate-x-4 group-hover:scale-150 transition-transform`}>
              <span className="material-symbols-outlined text-6xl">verified_user</span>
            </div>
            
            <div className="flex items-center space-x-5 mb-8">
              <div className="relative">
                <img src={u.avatar} className="w-16 h-16 rounded-3xl object-cover border-2 border-slate-100 shadow-sm" />
                <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-4 border-white ${u.status === 'Activo' ? 'bg-green-500' : 'bg-slate-300'}`}></div>
              </div>
              <div>
                <h4 className="text-lg font-black text-slate-800 tracking-tight">{u.name}</h4>
                <p className="text-xs font-bold text-slate-400">{u.email}</p>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rol Asignado</span>
                <span className={`text-[9px] font-black px-3 py-1.5 rounded-xl border uppercase tracking-wider ${getRoleBadgeStyle(u.role)}`}>
                  {u.role}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Antigüedad</span>
                <span className="text-[10px] font-bold text-slate-700">14 meses</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => setEditingUser(u)}
                className="flex-1 py-3 bg-slate-50 text-slate-600 font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-slate-100 transition-colors border border-slate-100 flex items-center justify-center space-x-2"
              >
                <span className="material-symbols-outlined text-lg">edit</span>
                <span>Editar</span>
              </button>
              <button className="w-12 h-12 flex items-center justify-center bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors border border-slate-100">
                <span className="material-symbols-outlined text-xl">block</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Stats Administrador con Auditoría Expandible */}
      <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl transition-all duration-500">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="space-y-4">
            <h3 className="text-2xl font-black uppercase tracking-tight">Estado Global de Accesos</h3>
            <div className="flex gap-10">
              <div>
                <p className="text-4xl font-black text-blue-400">14</p>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mt-1">Conectados hoy</p>
              </div>
              <div>
                <p className="text-4xl font-black text-orange-400">2</p>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mt-1">Intentos fallidos</p>
              </div>
            </div>
          </div>
          
          <div className="w-full md:w-1/3 bg-slate-800/50 p-6 rounded-3xl border border-slate-700/50 backdrop-blur-sm flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Auditoría Reciente</p>
              <button 
                onClick={() => setShowFullAudit(!showFullAudit)}
                className="text-[9px] font-black text-blue-400 hover:text-blue-300 uppercase tracking-widest border border-blue-400/30 px-2 py-1 rounded-lg transition-colors"
              >
                {showFullAudit ? 'Contraer Informe' : 'Ver Informe Completo'}
              </button>
            </div>
            <div className="space-y-2">
              <p className="text-[10px] font-bold text-blue-300">U102 cambió precios de 'Lista VIP'</p>
              <p className="text-[10px] font-bold text-slate-400">U101 reportó stock bajo en HAR-002</p>
              <p className="text-[10px] font-bold text-green-300">Admin autorizó retiro de U104</p>
            </div>
          </div>
        </div>

        {/* Panel Desplegable de Auditoría Detallada */}
        {showFullAudit && (
          <div className="mt-10 pt-10 border-t border-slate-800 animate-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
              <div>
                <h4 className="text-xl font-black uppercase tracking-tight text-blue-400">Informe de Auditoría Detallado</h4>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Logs de actividad crítica del sistema</p>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-slate-800 text-[9px] font-black uppercase rounded-xl border border-slate-700 hover:bg-slate-700 transition-colors">Descargar Log</button>
                <button className="px-4 py-2 bg-slate-800 text-[9px] font-black uppercase rounded-xl border border-slate-700 hover:bg-slate-700 transition-colors">Filtrar por Fecha</button>
              </div>
            </div>

            <div className="bg-slate-800/30 border border-slate-800 rounded-3xl overflow-hidden backdrop-blur-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[9px] font-black uppercase tracking-widest text-slate-500 border-b border-slate-800">
                      <th className="px-6 py-4">Estampa Temporal</th>
                      <th className="px-6 py-4">Usuario</th>
                      <th className="px-6 py-4">Acción Realizada</th>
                      <th className="px-6 py-4">Tipo</th>
                      <th className="px-6 py-4 text-right">Resultado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {mockAuditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-white/5 transition-colors group">
                        <td className="px-6 py-4 text-[10px] font-mono text-slate-400">{log.timestamp}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <span className="text-[10px] font-black text-blue-300 bg-blue-400/10 px-2 py-0.5 rounded-lg border border-blue-400/20">{log.userId}</span>
                            <span className="text-[10px] font-bold text-slate-300">{log.userName}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-[10px] font-medium text-slate-100">{log.action}</td>
                        <td className="px-6 py-4">
                          <span className={`text-[8px] font-black uppercase px-2 py-1 rounded-md tracking-tighter ${
                            log.type === 'security' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                            log.type === 'inventory' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' :
                            log.type === 'sales' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                            'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                          }`}>
                            {log.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className={`flex items-center justify-end space-x-1.5`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${
                              log.status === 'success' ? 'bg-green-500' :
                              log.status === 'alert' ? 'bg-orange-500 animate-pulse' :
                              'bg-blue-400'
                            }`}></div>
                            <span className={`text-[9px] font-black uppercase ${
                              log.status === 'success' ? 'text-green-400' :
                              log.status === 'alert' ? 'text-orange-400' :
                              'text-blue-400'
                            }`}>{log.status}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-4 bg-slate-800/50 text-center border-t border-slate-800">
                <button className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-slate-300 transition-colors">Cargar Registros Anteriores</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;
