
import React, { useState, useMemo } from 'react';
import { Product, Client, Order, OrderStatus, PriceList } from '../types';

// Generador de productos mejorado con mínimos realistas
const generateProductsPool = (): Product[] => {
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
  const moqPool = [1, 6, 10, 12, 24, 48]; // Formatos comunes de cajas/packs
  const products: Product[] = [];
  
  for (let i = 1; i <= 100; i++) {
    const catIdx = Math.floor((i - 1) / 10);
    const cat = categories[catIdx];
    const sub = cat.subs[Math.floor(Math.random() * cat.subs.length)];
    const brand = brandPool[Math.floor(Math.random() * brandPool.length)];
    const price = Math.floor(Math.random() * (120000 - 5000 + 1)) + 5000;
    const stock = Math.floor(Math.random() * 2000) + 100;
    const sku = `${cat.prefix}-${sub.substring(0, 3).toUpperCase()}-${String(i).padStart(3, '0')}`;
    const minOrder = moqPool[Math.floor(Math.random() * moqPool.length)];
    
    products.push({
      id: i.toString(),
      sku: sku,
      name: `${sub} ${brand} #${i}`,
      category: cat.name,
      subCategory: sub,
      price: price,
      stock: stock,
      minOrder: minOrder,
      image: `https://picsum.photos/200/200?random=${i}`,
      description: `Formato mayorista ideal para distribución. Pedido mínimo: ${minOrder} unidades.`,
      brand: brand
    });
  }
  return products;
};

const productsPool = generateProductsPool();

const clientsPool: Client[] = [
  { id: 'C001', name: 'Juan Pérez', company: 'Supermercado El Sol', rut: '76.123.456-7', giro: 'Venta de abarrotes al por menor', address: 'Av. Las Condes 1234, Las Condes', email: 'juan@elsol.cl', phone: '+56 9 1111 2222', totalSpent: 12500000, lastOrderDate: '2023-11-20', status: 'VIP', avatar: 'https://i.pravatar.cc/150?u=C001', priceListId: 'pl-vip' },
  { id: 'C002', name: 'María García', company: 'Minimarket Luna', rut: '12.456.789-0', giro: 'Minimarket y rotisería', address: 'Calle Valparaíso 456, Viña del Mar', email: 'm.garcia@luna.cl', phone: '+56 9 2222 3333', totalSpent: 4200000, lastOrderDate: '2023-11-18', status: 'Activo', avatar: 'https://i.pravatar.cc/150?u=C002', priceListId: 'pl-mayorista' },
  { id: 'C003', name: 'Carlos Ruiz', company: 'Casino Cordillera', rut: '88.222.333-K', giro: 'Servicios de alimentación', address: 'Paseo Ahumada 78, Santiago Centro', email: 'c.ruiz@casino.cl', phone: '+56 9 3333 4444', totalSpent: 8500000, lastOrderDate: '2023-11-22', status: 'Activo', avatar: 'https://i.pravatar.cc/150?u=C003', priceListId: 'pl-distribuidor' },
  { id: 'C004', name: 'Ana Morales', company: 'Pastelería Delicias', rut: '15.667.889-1', giro: 'Fabricación de pan y pasteles', address: 'Avenida Alemania 098, Temuco', email: 'ana.m@delicias.cl', phone: '+56 9 4444 5555', totalSpent: 2100000, lastOrderDate: '2023-11-15', status: 'Nuevo', avatar: 'https://i.pravatar.cc/150?u=C004', priceListId: 'pl-base' },
  { id: 'C005', name: 'Roberto Díaz', company: 'Frutos del Norte', rut: '77.890.123-2', giro: 'Comercialización de frutas y verduras', address: 'Prat 123, Antofagasta', email: 'r.diaz@norte.cl', phone: '+56 9 5555 6666', totalSpent: 15400000, lastOrderDate: '2023-11-21', status: 'VIP', avatar: 'https://i.pravatar.cc/150?u=C005', priceListId: 'pl-distribuidor' },
  { id: 'C006', name: 'Sofía Castro', company: 'Botillería Oasis', rut: '11.234.567-8', giro: 'Venta de bebidas alcohólicas', address: 'San Martín 556, Rancagua', email: 'sofia.c@oasis.cl', phone: '+56 9 6666 7777', totalSpent: 3800000, lastOrderDate: '2023-11-10', status: 'Activo', avatar: 'https://i.pravatar.cc/150?u=C006', priceListId: 'pl-mayorista' },
  { id: 'C007', name: 'Andrés López', company: 'Restaurante Mar y Tierra', rut: '99.111.222-3', giro: 'Restaurante y servicios de comida', address: 'Costanera 880, Coquimbo', email: 'alopez@marytierra.cl', phone: '+56 9 7777 8888', totalSpent: 9200000, lastOrderDate: '2023-11-19', status: 'Activo', avatar: 'https://i.pravatar.cc/150?u=C007', priceListId: 'pl-mayorista' },
  { id: 'C008', name: 'Lucía Méndez', company: 'Limpieza Total SpA', rut: '76.444.555-4', giro: 'Venta de artículos de limpieza', address: 'Vicuña Mackenna 1500, Ñuñoa', email: 'lucia.m@limpiezatotal.cl', phone: '+56 9 8888 9999', totalSpent: 1100000, lastOrderDate: '2023-11-05', status: 'Inactivo', avatar: 'https://i.pravatar.cc/150?u=C008', priceListId: 'pl-base' },
  { id: 'C009', name: 'Pedro Sánchez', company: 'Almacén de la Esquina', rut: '8.333.222-1', giro: 'Comercio al por menor', address: 'O’Higgins 44, Curicó', email: 'p.sanchez@almacen.cl', phone: '+56 9 9999 1111', totalSpent: 5600000, lastOrderDate: '2023-11-20', status: 'Activo', avatar: 'https://i.pravatar.cc/150?u=C009', priceListId: 'pl-mayorista' },
  { id: 'C010', name: 'Francisca Valdés', company: 'Hotel Estelar', rut: '77.555.666-5', giro: 'Hotelería y alojamiento', address: 'Paicaví 1240, Concepción', email: 'fvaldes@estelar.cl', phone: '+56 9 1212 2323', totalSpent: 18900000, lastOrderDate: '2023-11-22', status: 'VIP', avatar: 'https://i.pravatar.cc/150?u=C010', priceListId: 'pl-distribuidor' },
  { id: 'C011', name: 'Daniela Toro', company: 'Gimnasio FitLife', rut: '14.555.444-3', giro: 'Servicios deportivos', address: 'Av. Kennedy 4500, Vitacura', email: 'daniela.t@fitlife.cl', phone: '+56 9 2323 3434', totalSpent: 1400000, lastOrderDate: '2023-11-12', status: 'Nuevo', avatar: 'https://i.pravatar.cc/150?u=C011', priceListId: 'pl-base' },
  { id: 'C012', name: 'Jorge Herrera', company: 'Carnes Premium', rut: '10.999.888-7', giro: 'Venta de carnes al por mayor', address: 'Matadero 445, Santiago Centro', email: 'jherrera@premium.cl', phone: '+56 9 3434 4545', totalSpent: 25000000, lastOrderDate: '2023-11-21', status: 'VIP', avatar: 'https://i.pravatar.cc/150?u=C012', priceListId: 'pl-distribuidor' },
  { id: 'C013', name: 'Isabel Allende', company: 'Librería Horizonte', rut: '13.111.222-K', giro: 'Venta de libros y papelería', address: 'Barros Arana 330, Concepción', email: 'i.allende@horizonte.cl', phone: '+56 9 4545 5656', totalSpent: 900000, lastOrderDate: '2023-10-25', status: 'Inactivo', avatar: 'https://i.pravatar.cc/150?u=C013', priceListId: 'pl-base' },
  { id: 'C014', name: 'Miguel Bosé', company: 'Eventos del Sur', rut: '16.888.777-9', giro: 'Organización de eventos', address: 'Camino Pucón-Villarrica Km 5', email: 'mbose@sur.cl', phone: '+56 9 5656 6767', totalSpent: 6700000, lastOrderDate: '2023-11-14', status: 'Activo', avatar: 'https://i.pravatar.cc/150?u=C014', priceListId: 'pl-mayorista' },
  { id: 'C015', name: 'Verónica Castro', company: 'Tiendas Estilo SpA', rut: '76.999.888-1', giro: 'Comercio de vestuario', address: 'Mall Plaza Trébol, Talcahuano', email: 'v.castro@estilo.cl', phone: '+56 9 6767 7878', totalSpent: 3400000, lastOrderDate: '2023-11-08', status: 'Activo', avatar: 'https://i.pravatar.cc/150?u=C015', priceListId: 'pl-mayorista' },
  { id: 'C016', name: 'Luis Miguel', company: 'Sol de América Distribuciones', rut: '77.222.111-0', giro: 'Distribución nacional', address: 'Quilicura Industrial 44, Santiago', email: 'lm@soldelameric.cl', phone: '+56 9 7878 8989', totalSpent: 45000000, lastOrderDate: '2023-11-22', status: 'VIP', avatar: 'https://i.pravatar.cc/150?u=C016', priceListId: 'pl-distribuidor' },
  { id: 'C017', name: 'Camila Gallardo', company: 'Estudio de Música', rut: '19.333.444-5', giro: 'Servicios culturales', address: 'Baquedano 12, Iquique', email: 'camila@estudio.cl', phone: '+56 9 8989 9090', totalSpent: 500000, lastOrderDate: '2023-09-15', status: 'Nuevo', avatar: 'https://i.pravatar.cc/150?u=C017', priceListId: 'pl-base' },
  { id: 'C018', name: 'Pablo Neruda', company: 'Poesía Gourmet', rut: '5.111.000-8', giro: 'Cafetería y bistro', address: 'Isla Negra, El Quisco', email: 'pablo@gourmet.cl', phone: '+56 9 9090 0101', totalSpent: 2800000, lastOrderDate: '2023-11-20', status: 'Activo', avatar: 'https://i.pravatar.cc/150?u=C018', priceListId: 'pl-base' },
  { id: 'C019', name: 'Gabriela Mistral', company: 'Educación Siglo XXI', rut: '6.444.555-K', giro: 'Insumos educacionales', address: 'Vicuña 445, Valle de Elqui', email: 'gabriela@siglo21.cl', phone: '+56 9 0101 1212', totalSpent: 1200000, lastOrderDate: '2023-10-30', status: 'Inactivo', avatar: 'https://i.pravatar.cc/150?u=C019', priceListId: 'pl-base' },
  { id: 'C020', name: 'Alexis Sánchez', company: 'Tocopilla Export', rut: '17.777.888-2', giro: 'Servicios de transporte y exportación', address: 'Serrano 55, Tocopilla', email: 'alexis@export.cl', phone: '+56 9 1212 3434', totalSpent: 31000000, lastOrderDate: '2023-11-22', status: 'VIP', avatar: 'https://i.pravatar.cc/150?u=C020', priceListId: 'pl-distribuidor' },
];

const priceLists: PriceList[] = [
  { id: 'pl-base', name: 'Lista Base', discountPercentage: 0, color: 'slate' },
  { id: 'pl-mayorista', name: 'Mayorista Gral', discountPercentage: 10, color: 'blue' },
  { id: 'pl-vip', name: 'VIP Gold', discountPercentage: 20, color: 'purple' },
  { id: 'pl-distribuidor', name: 'Distribuidor Máster', discountPercentage: 35, color: 'orange' },
];

interface NewOrderProps {
  onSaveOrder: (order: Order) => void;
}

const NewOrder: React.FC<NewOrderProps> = ({ onSaveOrder }) => {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [clientSearchTerm, setClientSearchTerm] = useState(''); // Nuevo buscador de clientes
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [cart, setCart] = useState<{product: Product, quantity: number}[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = useMemo(() => {
    const cats = productsPool.map(p => p.category);
    return ['ALL', ...Array.from(new Set(cats))];
  }, []);

  const activePriceList = useMemo(() => {
    if (!selectedClient) return priceLists[0];
    return priceLists.find(pl => pl.id === selectedClient.priceListId) || priceLists[0];
  }, [selectedClient]);

  const calculateFinalPrice = (basePrice: number) => {
    return Math.round(basePrice * (1 - activePriceList.discountPercentage / 100));
  };

  const filteredClientsForSelection = useMemo(() => {
    return clientsPool.filter(c => 
      c.name.toLowerCase().includes(clientSearchTerm.toLowerCase()) ||
      c.company.toLowerCase().includes(clientSearchTerm.toLowerCase()) ||
      c.rut.includes(clientSearchTerm)
    );
  }, [clientSearchTerm]);

  const filteredProducts = productsPool.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         p.brand?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => item.product.id === product.id ? {...item, quantity: item.quantity + product.minOrder} : item);
      }
      return [...prev, { product, quantity: product.minOrder }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, isIncrement: boolean) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === productId);
      if (!existing) return prev;

      const step = existing.product.minOrder;
      const newQty = isIncrement ? existing.quantity + step : existing.quantity - step;
      
      if (!isIncrement && newQty < step) {
        return prev.filter(item => item.product.id !== productId);
      }

      return prev.map(item => {
        if (item.product.id === productId) {
          return { ...item, quantity: Math.max(step, newQty) };
        }
        return item;
      });
    });
  };

  const cartStats = useMemo(() => {
    const subtotal = cart.reduce((acc, item) => acc + (calculateFinalPrice(item.product.price) * item.quantity), 0);
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
    return { subtotal, totalItems };
  }, [cart, activePriceList]);

  const handleFinishOrder = () => {
    if (!selectedClient || cart.length === 0) return;
    setIsSubmitting(true);
    
    setTimeout(() => {
      const newOrder: Order = {
        id: `PED-${Math.floor(1000 + Math.random() * 9000)}`,
        customer: selectedClient.company,
        date: new Date().toISOString().split('T')[0],
        total: cartStats.subtotal,
        status: OrderStatus.PENDING,
        items: cartStats.totalItems,
        sellerId: 'PENDING'
      };
      onSaveOrder(newOrder);
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 animate-in pb-20">
      <div className="flex-1 space-y-8">
        {/* Selección de Cliente */}
        <section className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center space-x-3">
              <span className="material-symbols-outlined text-blue-600 bg-blue-50 p-2 rounded-xl">person_search</span>
              <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">1. Identificar Cliente</h3>
            </div>
            
            {!selectedClient && (
              <div className="relative w-full md:w-64">
                <input 
                  type="text" 
                  placeholder="Buscar por RUT o Nombre..." 
                  className="w-full h-12 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-blue-500/10 font-bold text-xs transition-all"
                  value={clientSearchTerm}
                  onChange={(e) => setClientSearchTerm(e.target.value)}
                />
                <span className="material-symbols-outlined absolute left-3 top-3 text-slate-400 text-lg">search</span>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-h-[320px] overflow-y-auto pr-2 custom-scrollbar">
            {!selectedClient ? (
              <>
                {filteredClientsForSelection.map(c => (
                  <button 
                    key={c.id}
                    onClick={() => {
                      setSelectedClient(c);
                      setClientSearchTerm(''); // Reset búsqueda al seleccionar
                    }}
                    className="flex items-center p-4 border-2 border-slate-50 rounded-2xl hover:border-blue-200 hover:bg-blue-50/30 transition-all text-left group"
                  >
                    <img src={c.avatar} className="w-10 h-10 rounded-xl border border-slate-100 mr-3 object-cover" />
                    <div className="flex-1 truncate">
                      <p className="text-[11px] font-black text-slate-800 tracking-tight truncate">{c.company}</p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase leading-none mt-1">{c.rut}</p>
                    </div>
                    <span className="material-symbols-outlined text-slate-200 group-hover:text-blue-500 transition-colors">check_circle</span>
                  </button>
                ))}
                {filteredClientsForSelection.length === 0 && (
                  <div className="col-span-full py-10 text-center opacity-30">
                    <span className="material-symbols-outlined text-4xl mb-2">person_off</span>
                    <p className="text-[10px] font-black uppercase tracking-widest">No se encontraron clientes</p>
                  </div>
                )}
              </>
            ) : (
              <div className="md:col-span-3 flex items-center justify-between p-5 bg-blue-600 rounded-3xl text-white shadow-xl shadow-blue-200 animate-in">
                <div className="flex items-center space-x-4">
                  <img src={selectedClient.avatar} className="w-12 h-12 rounded-xl border-2 border-white/20 object-cover" />
                  <div>
                    <p className="text-[10px] font-black uppercase opacity-60 tracking-widest leading-none mb-1">Cliente Seleccionado</p>
                    <div className="flex items-baseline space-x-2">
                      <p className="text-lg font-black tracking-tight">{selectedClient.company}</p>
                      <span className="text-[10px] opacity-70 font-bold">{selectedClient.rut}</span>
                    </div>
                    <div className="flex items-center mt-1">
                      <span className="text-[9px] font-black uppercase bg-white/20 px-2 py-0.5 rounded-lg border border-white/30">
                        {activePriceList.name} (-{activePriceList.discountPercentage}%)
                      </span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => { 
                    setSelectedClient(null); 
                    setCart([]); 
                    setClientSearchTerm('');
                  }} 
                  className="p-2 hover:bg-white/20 rounded-xl transition-all"
                >
                  <span className="material-symbols-outlined">refresh</span>
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Catálogo de Productos */}
        <section className={`bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm transition-opacity ${!selectedClient ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center space-x-3">
                <span className="material-symbols-outlined text-orange-600 bg-orange-50 p-2 rounded-xl">inventory_2</span>
                <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">2. Seleccionar Productos</h3>
              </div>
              <div className="relative w-full md:w-80">
                <input 
                  type="text" 
                  placeholder="Buscar SKU, marca o producto..."
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 font-bold text-xs"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-xl">search</span>
              </div>
            </div>

            {/* Selector de Categorías */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-hide">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border-2 ${
                    selectedCategory === cat 
                      ? 'bg-slate-900 border-slate-900 text-white' 
                      : 'bg-slate-50 border-slate-50 text-slate-400 hover:border-slate-200'
                  }`}
                >
                  {cat === 'ALL' ? 'Todos' : cat}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {filteredProducts.map(product => {
                const finalPrice = calculateFinalPrice(product.price);
                const hasDiscount = activePriceList.discountPercentage > 0;
                const cartItem = cart.find(item => item.product.id === product.id);

                return (
                  <div key={product.id} className={`p-4 border rounded-3xl transition-all flex items-center space-x-4 ${cartItem ? 'bg-blue-50/50 border-blue-200 shadow-sm' : 'bg-slate-50/30 border-slate-100 hover:border-blue-100 hover:shadow-md'}`}>
                    <img src={product.image} className="w-20 h-20 rounded-2xl object-cover border border-slate-50 shadow-sm" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-[9px] font-black text-blue-600 uppercase tracking-tighter truncate mr-2">{product.sku}</p>
                        <span className="text-[8px] font-black bg-white px-1.5 py-0.5 rounded border border-slate-100 text-slate-400 uppercase">{product.category}</span>
                      </div>
                      <h4 className="text-sm font-black text-slate-800 leading-tight mb-1 truncate">{product.name}</h4>
                      <div className="flex items-baseline space-x-2">
                        <span className="text-lg font-black text-slate-900">${finalPrice.toLocaleString('es-CL')}</span>
                        {hasDiscount && (
                          <span className="text-[10px] text-slate-400 line-through">${product.price.toLocaleString('es-CL')}</span>
                        )}
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <div className="flex flex-col">
                           <p className={`text-[10px] font-bold ${product.stock < 50 ? 'text-orange-500' : 'text-slate-400'}`}>
                             Stock: {product.stock} u.
                           </p>
                           <p className="text-[9px] font-black text-blue-500 uppercase">Min. Pedido: {product.minOrder} u.</p>
                        </div>
                        <p className="text-[9px] text-slate-300 font-black uppercase">{product.brand}</p>
                      </div>
                    </div>

                    {/* Selector de Cantidad Dual en Catálogo */}
                    <div className="flex flex-col items-center space-y-2">
                      {!cartItem ? (
                        <button 
                          onClick={() => addToCart(product)}
                          className="w-12 h-12 flex items-center justify-center bg-white text-blue-600 border border-blue-100 rounded-2xl hover:bg-blue-600 hover:text-white transition-all shadow-sm active:scale-95 group/btn"
                        >
                          <div className="flex flex-col items-center">
                            <span className="material-symbols-outlined font-black">add</span>
                            <span className="text-[8px] font-black group-hover/btn:text-white">+{product.minOrder}</span>
                          </div>
                        </button>
                      ) : (
                        <div className="flex flex-col items-center bg-white border border-blue-200 rounded-2xl p-1 shadow-sm">
                          <button 
                            onClick={() => updateQuantity(product.id, true)}
                            className="w-10 h-8 flex items-center justify-center text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                          >
                            <span className="material-symbols-outlined text-lg font-black">add</span>
                          </button>
                          
                          <div className="py-1 px-2 border-y border-slate-50 flex flex-col items-center min-w-[40px]">
                            <span className="text-xs font-black text-blue-600 leading-none">{cartItem.quantity}</span>
                            <span className="text-[7px] font-black text-slate-400 uppercase tracking-tighter">u.</span>
                          </div>

                          <button 
                            onClick={() => updateQuantity(product.id, false)}
                            className="w-10 h-8 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                          >
                            <span className="material-symbols-outlined text-lg font-black">remove</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              {filteredProducts.length === 0 && (
                <div className="col-span-full py-20 text-center opacity-30">
                  <span className="material-symbols-outlined text-5xl mb-3">search_off</span>
                  <p className="text-[10px] font-black uppercase tracking-widest">No se encontraron productos en esta categoría</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      {/* Carrito de Pedido (Sidebar) */}
      <div className="w-full lg:w-96 space-y-6">
        <aside className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl sticky top-24">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black uppercase tracking-tight">Resumen Pedido</h3>
            <span className="bg-blue-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">{cartStats.totalItems} ítems</span>
          </div>

          <div className="space-y-4 max-h-[400px] overflow-y-auto mb-8 pr-2 custom-scrollbar">
            {cart.length > 0 ? (
              cart.map(item => (
                <div key={item.product.id} className="flex flex-col p-3 bg-white/5 border border-white/10 rounded-2xl animate-in space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0 mr-3">
                      <p className="text-[11px] font-black truncate">{item.product.name}</p>
                      <p className="text-[9px] font-bold text-white/40 uppercase">${calculateFinalPrice(item.product.price).toLocaleString('es-CL')} c/u</p>
                    </div>
                    <button onClick={() => removeFromCart(item.product.id)} className="text-white/30 hover:text-red-400 transition-colors">
                      <span className="material-symbols-outlined text-lg">delete</span>
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between bg-white/10 rounded-xl p-1.5">
                    <button 
                      onClick={() => updateQuantity(item.product.id, false)} 
                      className="flex-1 flex flex-col items-center justify-center hover:bg-white/10 rounded-lg py-1 transition-all"
                    >
                      <span className="text-xs font-black">remove</span>
                      <span className="text-[8px] opacity-40">-{item.product.minOrder}</span>
                    </button>
                    
                    <div className="px-4 border-x border-white/10 flex flex-col items-center">
                      <span className="text-xs font-black">{item.quantity}</span>
                      <span className="text-[7px] uppercase font-bold opacity-30 tracking-widest">Unidades</span>
                    </div>

                    <button 
                      onClick={() => updateQuantity(item.product.id, true)} 
                      className="flex-1 flex flex-col items-center justify-center hover:bg-white/10 rounded-lg py-1 transition-all"
                    >
                      <span className="text-xs font-black">add</span>
                      <span className="text-[8px] opacity-40">+{item.product.minOrder}</span>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-10 text-center opacity-30">
                <span className="material-symbols-outlined text-5xl mb-3">shopping_cart_checkout</span>
                <p className="text-[10px] font-black uppercase tracking-widest">Carrito Vacío</p>
                <p className="text-[8px] mt-2 leading-relaxed px-4">Seleccione un cliente y luego añada productos para comenzar el pedido.</p>
              </div>
            )}
          </div>

          <div className="space-y-3 pt-6 border-t border-white/10">
            <div className="flex justify-between items-center text-white/60 text-[10px] font-black uppercase tracking-widest">
              <span>Subtotal Neto</span>
              <span>${Math.round(cartStats.subtotal / 1.19).toLocaleString('es-CL')}</span>
            </div>
            <div className="flex justify-between items-center text-white/60 text-[10px] font-black uppercase tracking-widest">
              <span>IVA (19%)</span>
              <span>${Math.round(cartStats.subtotal - (cartStats.subtotal / 1.19)).toLocaleString('es-CL')}</span>
            </div>
            <div className="flex justify-between items-center pt-3 mt-3 border-t border-white/20">
              <span className="text-sm font-black uppercase tracking-widest">Total Bruto</span>
              <span className="text-3xl font-black text-blue-400 tracking-tighter">${cartStats.subtotal.toLocaleString('es-CL')}</span>
            </div>
          </div>

          <button 
            disabled={cart.length === 0 || !selectedClient || isSubmitting}
            onClick={handleFinishOrder}
            className={`w-full mt-8 h-16 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center space-x-3 ${
              cart.length > 0 && selectedClient && !isSubmitting
                ? 'bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-900/40 text-white active:scale-95' 
                : 'bg-white/5 text-white/20 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                <span>Procesando...</span>
              </div>
            ) : (
              <>
                <span className="material-symbols-outlined">send</span>
                <span>Enviar Pedido</span>
              </>
            )}
          </button>
        </aside>

        {/* Info Alerta Stock */}
        <div className="bg-orange-50 border border-orange-100 p-6 rounded-[2rem]">
          <div className="flex items-start space-x-3">
            <span className="material-symbols-outlined text-orange-600">warning</span>
            <div>
              <p className="text-[10px] font-black text-orange-800 uppercase tracking-widest">Nota Vendedor</p>
              <p className="text-[10px] font-bold text-orange-700 mt-1 leading-relaxed">
                El sistema respeta los formatos de empaque mayorista. Solo puede añadir o quitar unidades según el Pack Mínimo de cada artículo.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewOrder;
