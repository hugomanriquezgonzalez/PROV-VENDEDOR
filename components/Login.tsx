
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BrandLogo from './BrandLogo';
import { AppUser, UserRole } from '../types';

interface LoginProps {
  onLogin: (user: AppUser) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  // Cambiado de UserRole.VENDEDOR a UserRole.ADMIN como predeterminado
  const [role, setRole] = useState<UserRole>(UserRole.ADMIN);
  const [showPassword, setShowPassword] = useState(false);

  const formatPhone = (value: string) => {
    const clean = value.replace(/\D/g, '');
    let formatted = '';
    if (clean.length > 0) formatted += clean.substring(0, 1);
    if (clean.length > 1) formatted += ' ' + clean.substring(1, 5);
    if (clean.length > 5) formatted += ' ' + clean.substring(5, 9);
    return formatted;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    if (formatted.length <= 11) {
      setPhone(formatted);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Generar un ID estable para el demo de visualización de ventas
    const demoId = role === UserRole.VENDEDOR ? 'USR-VENDEDOR-DEMO' : role === UserRole.ADMIN ? 'USR-ADMIN-DEMO' : `USR-${role.substring(0,3).toUpperCase()}`;

    const mockUser: AppUser = {
      id: demoId,
      name: `Usuario ${role}`,
      email: `${role.toLowerCase().replace(' ', '.')}@prov.cl`,
      role: role,
      avatar: `https://picsum.photos/100/100?u=${demoId}`,
      status: 'Activo'
    };

    onLogin(mockUser);
    navigate('/');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full px-6 py-12 bg-slate-50 overflow-hidden">
      <div className="w-full max-w-md bg-white p-8 md:p-10 rounded-[2.5rem] shadow-2xl shadow-blue-900/10 border border-slate-100 animate-in">
        <div className="flex flex-col items-center mb-8">
          <BrandLogo className="h-14 mb-4" />
          <div className="text-center">
            <h1 className="text-2xl font-black tracking-tight text-slate-900 mb-1 leading-none">Bienvenidos</h1>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Acceso a Plataforma PROV</p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Perfil de Acceso (Demo)</label>
            <select 
              className="w-full h-14 px-5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-sm appearance-none"
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
            >
              {Object.values(UserRole).map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Teléfono Móvil</label>
            <div className="relative flex items-center">
              <div className="absolute left-4 flex items-center gap-2 pointer-events-none z-10">
                <div className="w-6 h-4 border border-slate-100 rounded-sm chile-flag overflow-hidden shadow-sm"></div>
                <span className="text-slate-600 font-black text-sm">+56</span>
              </div>
              <input 
                className="w-full h-14 pl-24 pr-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-slate-300 font-bold text-sm" 
                placeholder="9 1234 5678" 
                type="tel"
                value={phone}
                onChange={handlePhoneChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Contraseña</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl z-10">lock</span>
              <input 
                className="w-full h-14 pl-12 pr-12 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-slate-300 font-bold text-sm" 
                placeholder="••••••••" 
                type={showPassword ? "text" : "password"}
                required
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors z-10"
              >
                <span className="material-symbols-outlined text-xl">
                  {showPassword ? 'visibility' : 'visibility_off'}
                </span>
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full h-14 bg-blue-600 text-white font-black text-sm uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-blue-500/20 hover:bg-blue-700 hover:shadow-blue-500/30 active:scale-[0.98] transition-all mt-4"
          >
            Entrar como {role}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-50 text-center">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
            PROV Mayorista Ecosystem v3.0
          </p>
        </div>
      </div>
      
      <p className="mt-8 text-[9px] font-bold text-slate-300 uppercase tracking-[0.4em]">
        DISTRIBUIDORA CENTRAL S.A. © 2024
      </p>
    </div>
  );
};

export default Login;
