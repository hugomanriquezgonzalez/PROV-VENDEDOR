
import React, { useState, useMemo } from 'react';
import { AppUser, UserRole, CompanyInfo } from '../types';

interface SettingsProps { user: AppUser; }

type SettingsTab = 'general' | 'security' | 'legal';

const Settings: React.FC<SettingsProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');
  const isAdmin = user.role === UserRole.ADMIN;

  // Mock de información de empresa
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    name: 'DISTRIBUIDORA CENTRAL S.A.',
    rut: '96.555.444-K',
    giro: 'Venta mayorista de productos de consumo masivo',
    address: 'Av. Industrial 8842, Quilicura, Región Metropolitana',
    phone: '+56 2 2345 6789',
    email: 'contacto@prov.cl',
    logoUrl: 'https://www.prov.cl/wp-content/uploads/2026/01/cropped-prov.png'
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Estados para Cambio de Contraseña
  const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' });
  const [passError, setPassError] = useState('');

  const passwordRequirements = useMemo(() => {
    const p = passwordForm.new;
    return {
      length: p.length >= 8,
      lowercase: /[a-z]/.test(p),
      uppercase: /[A-Z]/.test(p),
      number: /[0-9]/.test(p),
      special: /[@$!%*?&._-]/.test(p)
    };
  }, [passwordForm.new]);

  const isPasswordValid = Object.values(passwordRequirements).every(Boolean);

  const handleCompanySave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 1200);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPasswordValid) {
      setPassError('La contraseña no cumple con los requisitos de seguridad');
      return;
    }
    if (passwordForm.new !== passwordForm.confirm) {
      setPassError('Las contraseñas no coinciden');
      return;
    }
    setIsSaving(true);
    setPassError('');
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setPasswordForm({ current: '', new: '', confirm: '' });
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 1500);
  };

  const renderGeneral = () => (
    <div className="space-y-8 animate-in">
      {/* Perfil del Usuario */}
      <section className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 md:p-10 flex flex-col md:flex-row items-center gap-8 bg-slate-50/50">
          <div className="relative group">
            <img 
              src={user.avatar} 
              className="w-32 h-32 rounded-[2rem] object-cover border-4 border-white shadow-xl group-hover:scale-105 transition-transform duration-300" 
              alt={user.name} 
            />
            <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-blue-600 text-white rounded-xl shadow-lg flex items-center justify-center hover:bg-blue-700 transition-colors">
              <span className="material-symbols-outlined text-lg">photo_camera</span>
            </button>
          </div>
          <div className="text-center md:text-left">
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-[10px] font-black uppercase tracking-widest rounded-lg mb-3">
              {user.role}
            </span>
            <h2 className="text-3xl font-black text-slate-800 tracking-tight leading-none">{user.name}</h2>
            <p className="text-slate-400 font-bold mt-2">{user.email}</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-6">
              <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
                <span className="material-symbols-outlined text-blue-600 text-sm">verified_user</span>
                <span className="text-[10px] font-black text-slate-600 uppercase">Estado: {user.status}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Configuración de Empresa (Admin) */}
      {isAdmin && (
        <section className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-slate-200 shadow-sm border-l-8 border-l-blue-600">
          <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight mb-8">Información Corporativa</h3>
          <form onSubmit={handleCompanySave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 opacity-60">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Razón Social (Bloqueado)</label>
                <input readOnly type="text" value={companyInfo.name} className="w-full h-14 px-5 bg-slate-100 border border-slate-200 rounded-2xl font-bold text-sm cursor-not-allowed" />
              </div>
              <div className="space-y-2 opacity-60">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">RUT (Bloqueado)</label>
                <input readOnly type="text" value={companyInfo.rut} className="w-full h-14 px-5 bg-slate-100 border border-slate-200 rounded-2xl font-bold text-sm cursor-not-allowed" />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Giro Comercial</label>
                <input type="text" name="giro" value={companyInfo.giro} onChange={(e) => setCompanyInfo({...companyInfo, giro: e.target.value})} className="w-full h-14 px-5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 font-bold text-sm transition-all" />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Dirección Legal</label>
                <input type="text" name="address" value={companyInfo.address} onChange={(e) => setCompanyInfo({...companyInfo, address: e.target.value})} className="w-full h-14 px-5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 font-bold text-sm transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Teléfono Central</label>
                <input type="text" name="phone" value={companyInfo.phone} onChange={(e) => setCompanyInfo({...companyInfo, phone: e.target.value})} className="w-full h-14 px-5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 font-bold text-sm transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Corporativo</label>
                <input type="email" name="email" value={companyInfo.email} onChange={(e) => setCompanyInfo({...companyInfo, email: e.target.value})} className="w-full h-14 px-5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 font-bold text-sm transition-all" />
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-4">
              <button type="submit" className="px-10 h-14 bg-slate-900 text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-black transition-all active:scale-95 flex items-center space-x-2">
                <span className="material-symbols-outlined text-lg">save</span>
                <span>{isSaving ? 'Guardando...' : 'Actualizar Datos Empresa'}</span>
              </button>
              {saveSuccess && (
                <div className="flex items-center space-x-2 text-green-600 animate-in">
                  <span className="material-symbols-outlined">verified</span>
                  <span className="text-[10px] font-black uppercase tracking-widest">Información Guardada</span>
                </div>
              )}
            </div>
          </form>
        </section>
      )}

      {/* Preferencias */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm">
          <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight mb-6 flex items-center">
            <span className="material-symbols-outlined text-blue-600 mr-2">notifications</span> Notificaciones
          </h3>
          <div className="space-y-4">
            {['Alertas de Stock', 'Confirmación de Pedido', 'Reportes Semanales'].map((p, i) => (
              <div key={i} className="flex justify-between items-center">
                <span className="text-sm font-bold text-slate-600">{p}</span>
                <div className="w-10 h-5 bg-blue-600 rounded-full relative">
                  <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm flex flex-col justify-center">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center mb-4">Versión del Sistema</p>
          <p className="text-3xl font-black text-slate-800 text-center">3.0.4 <span className="text-blue-600">PROV</span></p>
        </div>
      </div>
    </div>
  );

  const renderSecurity = () => (
    <div className="max-w-xl mx-auto space-y-8 animate-in">
      <section className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-slate-200 shadow-sm border-l-8 border-l-orange-500">
        <div className="flex items-center space-x-4 mb-8">
          <div className="w-14 h-14 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center">
            <span className="material-symbols-outlined text-3xl">lock_reset</span>
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Cambiar Contraseña</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Protege tu acceso a la plataforma</p>
          </div>
        </div>

        <form onSubmit={handlePasswordChange} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Contraseña Actual</label>
            <input 
              required
              type="password" 
              className="w-full h-14 px-5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-orange-500/10 font-bold text-sm"
              value={passwordForm.current}
              onChange={(e) => setPasswordForm({...passwordForm, current: e.target.value})}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nueva Contraseña</label>
            <input 
              required
              type="password" 
              className="w-full h-14 px-5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-orange-500/10 font-bold text-sm"
              value={passwordForm.new}
              onChange={(e) => setPasswordForm({...passwordForm, new: e.target.value})}
            />
            <div className="grid grid-cols-2 gap-2 mt-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              {[
                { label: '8+ Caracteres', met: passwordRequirements.length },
                { label: 'Minúscula', met: passwordRequirements.lowercase },
                { label: 'Mayúscula', met: passwordRequirements.uppercase },
                { label: 'Número', met: passwordRequirements.number },
                { label: 'Especial (@$!%*?&)', met: passwordRequirements.special },
              ].map((req, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <span className={`material-symbols-outlined text-lg ${req.met ? 'text-green-500' : 'text-slate-300'}`}>
                    {req.met ? 'check_circle' : 'circle'}
                  </span>
                  <span className={`text-[9px] font-black uppercase tracking-tight ${req.met ? 'text-green-600' : 'text-slate-400'}`}>
                    {req.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Confirmar Nueva Contraseña</label>
            <input 
              required
              type="password" 
              className={`w-full h-14 px-5 bg-slate-50 border rounded-2xl outline-none focus:ring-4 focus:ring-orange-500/10 font-bold text-sm ${passError ? 'border-red-500' : 'border-slate-200'}`}
              value={passwordForm.confirm}
              onChange={(e) => setPasswordForm({...passwordForm, confirm: e.target.value})}
            />
            {passError && <p className="text-[10px] font-black text-red-500 uppercase ml-1">{passError}</p>}
          </div>

          <button 
            type="submit" 
            disabled={isSaving || !isPasswordValid}
            className={`w-full h-16 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-xl transition-all active:scale-95 flex items-center justify-center space-x-3 ${
              isSaving || !isPasswordValid ? 'bg-slate-300 cursor-not-allowed' : 'bg-slate-900 hover:bg-black'
            }`}
          >
            {isSaving ? 'Actualizando...' : 'Actualizar Credenciales'}
          </button>
        </form>
      </section>
    </div>
  );

  const renderLegal = () => (
    <div className="animate-in">
      <section className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-200 shadow-sm max-w-3xl mx-auto">
        <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight mb-8">Términos y Condiciones</h3>
        <div className="prose prose-slate max-w-none space-y-6 text-slate-600 font-medium leading-relaxed overflow-y-auto max-h-[60vh] pr-4 custom-scrollbar">
          <h4 className="text-slate-900 font-black uppercase text-sm tracking-widest">1. Introducción</h4>
          <p>Bienvenido a la plataforma PROV Mayorista. Al acceder y utilizar este sistema, usted acepta cumplir con los siguientes términos y condiciones de uso destinados a regular la relación comercial entre los vendedores, administradores y la distribuidora.</p>
          <h4 className="text-slate-900 font-black uppercase text-sm tracking-widest">2. Uso de la Plataforma</h4>
          <p>Este sistema es de uso exclusivo para el personal autorizado de DISTRIBUIDORA CENTRAL S.A. Queda estrictamente prohibida la compartición de credenciales de acceso. Cada usuario es responsable de las transacciones y modificaciones realizadas bajo su identificador.</p>
          <h4 className="text-slate-900 font-black uppercase text-sm tracking-widest">3. Privacidad de Datos</h4>
          <p>PROV Mayorista cumple con la Ley N° 19.628 sobre protección de la vida privada en Chile. Los datos de clientes y transacciones son confidenciales y se utilizan únicamente para fines logísticos y comerciales internos.</p>
          <div className="pt-8 border-t border-slate-100 flex items-center justify-between opacity-50">
            <span className="text-[10px] font-black uppercase tracking-widest">Última actualización: Enero 2024</span>
            <span className="text-[10px] font-black uppercase tracking-widest">Versión Legal: 2.1</span>
          </div>
        </div>
      </section>
    </div>
  );

  const tabs = [
    { id: 'general', label: 'General', icon: 'settings', role: 'all' },
    { id: 'security', label: 'Seguridad', icon: 'security', role: 'all' },
    { id: 'legal', label: 'Términos', icon: 'description', role: 'all' },
  ];

  const filteredTabs = tabs.filter(tab => tab.role === 'all' || tab.role === user.role);

  return (
    <div className="max-w-7xl mx-auto pb-20 px-4">
      {/* Sub-Navegación de Ajustes */}
      <div className="flex items-center space-x-2 md:space-x-4 mb-8 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm overflow-x-auto no-scrollbar">
        {filteredTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as SettingsTab)}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all whitespace-nowrap ${
              activeTab === tab.id 
                ? 'bg-slate-900 text-white shadow-lg' 
                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
            }`}
          >
            <span className="material-symbols-outlined text-xl">{tab.icon}</span>
            <span className="text-[11px] font-black uppercase tracking-widest">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="min-h-[60vh]">
        {activeTab === 'general' && renderGeneral()}
        {activeTab === 'security' && renderSecurity()}
        {activeTab === 'legal' && renderLegal()}
      </div>

      <div className="mt-12 text-center opacity-30">
        <p className="text-[10px] font-black uppercase tracking-[0.4em]">PROV Mayorista Ecosystem v3.0.4 - Build #8271</p>
      </div>
    </div>
  );
};

export default Settings;
