import React, { useState, useEffect, useRef } from 'react';
import { 
  Leaf, ShoppingBag, Home, MessageSquare, Users, 
  CreditCard, Check, Sparkles, Droplets, Sun, 
  Activity, X, ChevronRight, Send, Loader2
} from 'lucide-react';

// --- CUSTOM HOOK: Local Storage ---
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
}

// --- DUMMY DATA ---
const PLANTS_DB = [
  { 
    id: 'p1', 
    name: 'Monstera Albo', 
    price: 150, 
    type: 'Tropical', 
    careLevel: 'Expert', 
    climate: 'High Humidity', 
    // Gambar Monstera Variegata (Albo) yang khas dengan warna putih
    image: 'https://images.pexels.com/photos/8284916/pexels-photo-8284916.jpeg?auto=compress&cs=tinysrgb&w=600' 
  },
  { 
    id: 'p2', 
    name: 'Philodendron Pink Princess', 
    price: 85, 
    type: 'Aroid', 
    careLevel: 'Intermediate', 
    climate: 'Warm Indoor', 
    // Gambar Philodendron dengan corak pink yang nyata
    image: 'https://images.pexels.com/photos/4530723/pexels-photo-4530723.jpeg?auto=compress&cs=tinysrgb&w=600' 
  },
  { 
    id: 'p3', 
    name: 'Anthurium Clarinervium', 
    price: 120, 
    type: 'Tropical', 
    careLevel: 'Advanced', 
    climate: 'High Humidity', 
    // Gambar Anthurium dengan urat daun putih yang tegas (Clarinervium)
    image: 'https://images.pexels.com/photos/7443109/pexels-photo-7443109.jpeg?auto=compress&cs=tinysrgb&w=600' 
  },
  { 
    id: 'p4', 
    name: 'Calathea Orbifolia', 
    price: 45, 
    type: 'Foliage', 
    careLevel: 'Intermediate', 
    climate: 'Medium Humidity', 
    // Gambar Calathea dengan motif daun bulat bergaris (Orbifolia)
    image: 'https://images.pexels.com/photos/16960870/pexels-photo-16960870.jpeg?auto=compress&cs=tinysrgb&w=600' 
  },
  { 
    id: 'p5', 
    name: 'Bonsai Ficus Retusa', 
    price: 200, 
    type: 'Bonsai', 
    careLevel: 'Expert', 
    climate: 'Stable Indoor', 
    // Gambar pohon Bonsai Ficus yang sudah terbentuk rapi
    image: 'https://images.pexels.com/photos/34551143/pexels-photo-34551143.jpeg?auto=compress&cs=tinysrgb&w=600' 
  },
  { 
    id: 'p6', 
    name: 'Neon Pothos', 
    price: 25, 
    type: 'Trailing', 
    careLevel: 'Beginner', 
    climate: 'Adaptable', 
    // Gambar Sirih Gading Neon (kuning cerah/stabil)
    image: 'https://images.pexels.com/photos/29139036/pexels-photo-29139036.jpeg?auto=compress&cs=tinysrgb&w=600' 
  },
];

const COMMUNITY_POSTS = [
  {
    id: 1,
    user: "UrbanJungle22",
    // Foto Sasha Kim: Orang sedang memindahkan tanaman (cocok untuk testimoni advice)
    image: "https://images.pexels.com/photos/9413766/pexels-photo-9413766.jpeg?auto=compress&cs=tinysrgb&w=600",
    text: "My Albo finally pushed out a half-moon leaf! Flora-Sensei's humidity advice was spot on."
  },
  {
    id: 2,
    user: "ZenGrower",
    // Foto cottonbro studio: Tanaman di pot tanah liat (nuansa minimalis/zen)
    image: "https://images.pexels.com/photos/4505178/pexels-photo-4505178.jpeg?auto=compress&cs=tinysrgb&w=600",
    text: "Balcony garden is thriving in the city smog thanks to the air-purifier plant recommendations."
  },
  {
    id: 3,
    user: "PlantMom_NYC",
    // Foto Gary Barnes: Tukang kebun dengan bunga merah di pot
    image: "https://images.pexels.com/photos/6231862/pexels-photo-6231862.jpeg?auto=compress&cs=tinysrgb&w=600",
    text: "Just got my Pink Princess from the shop. The vibrant roots are mesmerizing!"
  }
];

// --- MAIN APP COMPONENT ---
export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [cart, setCart] = useLocalStorage('flora_cart', []);
  const [garden, setGarden] = useLocalStorage('flora_garden', []);
  const [purchases, setPurchases] = useLocalStorage('flora_purchases', []);
  const [careLogs, setCareLogs] = useLocalStorage('flora_care_logs', []);
  
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckout, setIsCheckout] = useState(false);

  // Updated Theme for Premium, Polished Look (Aēsop / High-end Botanical Vibe)
  const theme = {
    bg: '#0a0a0a', 
    bgGradient: 'bg-[#0a0a0a]', 
    accent: '#A3B18A', 
    glass: 'bg-[#111312] border border-[#ffffff0a] shadow-sm', 
    glassNeon: 'bg-[#151a17] border border-[#A3B18A]/30 shadow-sm', 
    textNeon: 'text-[#A3B18A]', 
    buttonText: 'text-[#0a0a0a]' 
  };

  // --- ACTIONS ---
  const addToCart = (plant) => {
    setCart([...cart, plant]);
  };

  const removeFromCart = (index) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  const logCareAction = (plantId, action) => {
    const log = {
      id: Date.now(),
      plantId,
      plantName: garden.find(p => p.id === plantId)?.name,
      action,
      date: new Date().toISOString()
    };
    setCareLogs([log, ...careLogs]);
  };

  const processCheckout = (e) => {
    e.preventDefault();
    const newPurchase = {
      id: `ord_${Date.now()}`,
      date: new Date().toISOString(),
      items: cart,
      total: cart.reduce((sum, item) => sum + item.price, 0)
    };
    
    // Add to purchases and garden
    setPurchases([newPurchase, ...purchases]);
    setGarden([...garden, ...cart.map(item => ({ ...item, acquiredAt: new Date().toISOString() }))]);
    setCart([]);
    setIsCheckout(false);
    setIsCartOpen(false);
    alert('Payment successful! Your new plants have been added to your Digital Garden.');
    setActiveTab('dashboard');
  };

  const surpriseMe = () => {
    const unownedPlants = PLANTS_DB.filter(p => !garden.some(g => g.id === p.id));
    if (unownedPlants.length === 0) {
      alert("You already own all our rare plants, master botanist!");
      return;
    }
    const randomPlant = unownedPlants[Math.floor(Math.random() * unownedPlants.length)];
    addToCart(randomPlant);
    setIsCartOpen(true);
  };

  return (
    <div className={`min-h-screen text-neutral-300 ${theme.bgGradient} font-sans selection:bg-[#A3B18A] selection:text-[#0a0a0a] pb-20 md:pb-0`}>
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setActiveTab('home')}>
            <Leaf color={theme.accent} size={26} className="group-hover:scale-105 transition-transform duration-300" />
            <span className={`text-[17px] font-semibold tracking-[0.2em] text-neutral-100 uppercase`}>Flora-Tech</span>
          </div>
          
          <div className="hidden md:flex items-center gap-10">
            <NavLinks activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>

          <div className="flex items-center gap-4">
            <button onClick={() => setIsCartOpen(true)} className="relative p-2 hover:bg-white/5 rounded-full transition duration-300">
              <ShoppingBag size={22} className={cart.length > 0 ? "text-[#A3B18A]" : "text-neutral-400"} />
              {cart.length > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-[#A3B18A] text-[#0a0a0a] font-bold text-[10px] rounded-full flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 w-full z-50 bg-[#0a0a0a]/95 backdrop-blur-md border-t border-white/5 flex justify-around p-4">
        <NavLinks mobile activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* Main Content Area */}
      <main className="pt-24 min-h-screen">
        {activeTab === 'home' && <HomeView setActiveTab={setActiveTab} theme={theme} />}
        {activeTab === 'shop' && <ShopView addToCart={addToCart} surpriseMe={surpriseMe} theme={theme} />}
        {activeTab === 'dashboard' && <DashboardView garden={garden} careLogs={careLogs} logCareAction={logCareAction} theme={theme} />}
        {activeTab === 'community' && <CommunityView theme={theme} />}
        {activeTab === 'chat' && <ChatbotView garden={garden} purchases={purchases} careLogs={careLogs} theme={theme} />}
      </main>

      {/* Cart & Checkout Overlay */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex justify-end transition-opacity">
          <div className="w-full max-w-md bg-[#0a0a0a] h-full border-l border-white/5 p-8 flex flex-col shadow-2xl overflow-y-auto animate-fade-in">
            <div className="flex justify-between items-center mb-8">
              <h2 className={`text-xl font-medium text-neutral-100 tracking-wide`}>Your Cart</h2>
              <button onClick={() => { setIsCartOpen(false); setIsCheckout(false); }} className="p-2 hover:bg-white/5 rounded-full text-neutral-400 hover:text-white transition">
                <X size={20} />
              </button>
            </div>

            {!isCheckout ? (
              <>
                <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                  {cart.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-neutral-600 gap-4">
                      <ShoppingBag size={40} strokeWidth={1.5} />
                      <p className="font-light">Your botanical collection is empty.</p>
                    </div>
                  ) : (
                    cart.map((item, idx) => (
                      <div key={idx} className={`${theme.glass} p-4 rounded-xl flex items-center gap-5`}>
                        <img src={item.image} alt={item.name} className="w-20 h-20 rounded-lg object-cover opacity-90" />
                        <div className="flex-1">
                          <h4 className="font-medium text-neutral-200 leading-tight mb-1">{item.name}</h4>
                          <p className={theme.textNeon}>${item.price}</p>
                        </div>
                        <button onClick={() => removeFromCart(idx)} className="p-2 text-neutral-500 hover:text-[#A3B18A] hover:bg-[#A3B18A]/10 rounded-full transition">
                          <X size={18} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
                
                {cart.length > 0 && (
                  <div className="pt-8 border-t border-white/5 mt-auto">
                    <div className="flex justify-between text-lg font-medium mb-6 text-neutral-200">
                      <span>Subtotal</span>
                      <span className="font-medium">${cart.reduce((a, b) => a + b.price, 0)}</span>
                    </div>
                    <button onClick={() => setIsCheckout(true)} className={`w-full py-4 rounded-xl bg-[#A3B18A] ${theme.buttonText} font-medium text-lg hover:bg-[#8d9a77] transition-colors flex justify-center items-center gap-2`}>
                      Proceed to Checkout <ChevronRight size={20} />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <form onSubmit={processCheckout} className="flex-1 flex flex-col animate-fade-in">
                <h3 className="text-sm uppercase tracking-widest font-medium text-neutral-400 mb-6 flex items-center gap-3 border-b border-white/5 pb-4">
                  <CreditCard size={18} className={theme.textNeon} /> Secure Checkout
                </h3>
                <div className="space-y-5 flex-1">
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-medium text-neutral-500 mb-2">Card Number</label>
                    <input required type="text" placeholder="0000 0000 0000 0000" className="w-full bg-[#111312] border border-white/5 rounded-xl p-4 text-neutral-200 focus:outline-none focus:border-[#A3B18A] transition-colors" />
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-xs uppercase tracking-wider font-medium text-neutral-500 mb-2">Expiry</label>
                      <input required type="text" placeholder="MM/YY" className="w-full bg-[#111312] border border-white/5 rounded-xl p-4 text-neutral-200 focus:outline-none focus:border-[#A3B18A] transition-colors" />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs uppercase tracking-wider font-medium text-neutral-500 mb-2">CVC</label>
                      <input required type="text" placeholder="123" className="w-full bg-[#111312] border border-white/5 rounded-xl p-4 text-neutral-200 focus:outline-none focus:border-[#A3B18A] transition-colors" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-medium text-neutral-500 mb-2">Name on Card</label>
                    <input required type="text" placeholder="John Doe" className="w-full bg-[#111312] border border-white/5 rounded-xl p-4 text-neutral-200 focus:outline-none focus:border-[#A3B18A] transition-colors" />
                  </div>
                </div>
                <div className="pt-8 mt-auto">
                  <button type="submit" className={`w-full py-4 rounded-xl bg-[#A3B18A] ${theme.buttonText} font-medium text-lg hover:bg-[#8d9a77] transition-colors flex justify-center items-center gap-2 mb-4`}>
                    Pay ${cart.reduce((a, b) => a + b.price, 0)} <Check size={20} />
                  </button>
                  <button type="button" onClick={() => setIsCheckout(false)} className="w-full py-3 text-neutral-500 hover:text-neutral-300 transition-colors font-medium text-sm">Back to Cart</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// --- SUB-COMPONENTS ---

const NavLinks = ({ mobile, activeTab, setActiveTab }) => {
  const links = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'shop', icon: ShoppingBag, label: 'Shop' },
    { id: 'dashboard', icon: Activity, label: 'Dashboard' },
    { id: 'community', icon: Users, label: 'Community' },
    { id: 'chat', icon: MessageSquare, label: 'Flora-Sensei' },
  ];

  return links.map(link => {
    const Icon = link.icon;
    const isActive = activeTab === link.id;
    return (
      <button 
        key={link.id} 
        onClick={() => setActiveTab(link.id)}
        className={`flex ${mobile ? 'flex-col text-[11px] gap-1' : 'gap-2 text-sm'} items-center transition-colors duration-300 font-medium tracking-wide ${isActive ? 'text-[#A3B18A]' : 'text-neutral-500 hover:text-neutral-200'}`}
      >
        <Icon size={mobile ? 22 : 18} strokeWidth={isActive ? 2 : 1.5} />
        <span className={mobile ? 'hidden sm:block' : ''}>{link.label}</span>
      </button>
    );
  });
};

const HomeView = ({ setActiveTab, theme }) => (
  <div className="max-w-6xl mx-auto px-6 py-6 animate-fade-in flex flex-col gap-20">
    {/* Hero Section */}
    <div className="relative rounded-2xl overflow-hidden shadow-sm border border-white/5 group bg-[#111312]">
      <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/90 to-transparent z-10" />
      <img src="https://images.unsplash.com/photo-1614594975525-e45190c55d40?auto=format&fit=crop&w=1600&q=80" alt="Macro Plant" className="w-full h-[70vh] object-cover transition-transform duration-[30s] group-hover:scale-105 opacity-80" />
      <div className="absolute inset-0 z-20 flex flex-col justify-center p-8 md:p-20 w-full md:w-3/4 lg:w-2/3">
        <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-[#A3B18A]/10 text-[#A3B18A] text-[10px] font-semibold tracking-[0.2em] border border-[#A3B18A]/20 w-fit uppercase">
          Smart Urban Gardening
        </div>
        <h1 className="text-5xl md:text-7xl font-medium text-neutral-100 leading-[1.05] mb-8 tracking-tight">
          Cultivate Rare Beauty.<br/>
          <span className="text-[#A3B18A] font-serif italic">lia rahma.</span>
        </h1>
        <p className="text-lg md:text-xl text-neutral-400 mb-12 max-w-lg leading-relaxed font-light">
          Join Flora-Tech to grow exotic plants tailored to your city's climate, guided daily by our expert AI, Flora-Sensei.
        </p>
        <div className="flex flex-wrap gap-5">
          <button onClick={() => setActiveTab('shop')} className={`px-8 py-4 rounded-xl bg-[#A3B18A] ${theme.buttonText} font-medium text-lg hover:bg-[#8d9a77] transition-all duration-300`}>
            Explore Catalog
          </button>
          <button onClick={() => setActiveTab('chat')} className={`px-8 py-4 rounded-xl bg-[#111312] border border-white/5 text-neutral-300 font-medium text-lg hover:bg-white/5 transition-all duration-300 flex items-center gap-3`}>
            <MessageSquare size={20} className="text-[#A3B18A]" strokeWidth={1.5} /> Ask Flora-Sensei
          </button>
        </div>
      </div>
    </div>

    {/* Features */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {[
        { icon: Droplets, title: 'Smart Care Logging', desc: 'Track watering and nutrient schedules effortlessly.' },
        { icon: Sparkles, title: 'AI Recommendations', desc: 'Discover rare plants perfectly matched to your environment.' },
        { icon: Sun, title: 'Climate Simulation', desc: 'Adaptive care routines built around your local weather.' }
      ].map((feat, i) => (
        <div key={i} className={`${theme.glass} p-10 rounded-2xl hover:border-[#A3B18A]/20 transition-colors duration-500 group`}>
          <div className="w-12 h-12 rounded-xl bg-[#A3B18A]/10 flex items-center justify-center mb-8 group-hover:bg-[#A3B18A]/20 transition-colors duration-500">
            <feat.icon size={24} className="text-[#A3B18A]" strokeWidth={1.5} />
          </div>
          <h3 className="text-lg font-medium text-neutral-200 mb-3 tracking-wide">{feat.title}</h3>
          <p className="text-neutral-500 leading-relaxed font-light text-sm">{feat.desc}</p>
        </div>
      ))}
    </div>
  </div>
);

const ShopView = ({ addToCart, surpriseMe, theme }) => (
  <div className="max-w-6xl mx-auto px-6 py-6 animate-fade-in">
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6 border-b border-white/5 pb-8">
      <div>
        <h2 className="text-3xl font-medium text-neutral-100 mb-3 tracking-tight">Plant Catalog</h2>
        <p className="text-neutral-500 flex items-center gap-3 font-light text-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#A3B18A] opacity-20"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#A3B18A]"></span>
          </span>
          Climate Context: Urban Indoor / Moderate Humidity
        </p>
      </div>
      <button onClick={surpriseMe} className={`${theme.glassNeon} px-6 py-3 rounded-xl text-neutral-200 font-medium text-sm flex items-center gap-2 hover:bg-[#A3B18A]/10 transition-colors`}>
        <Sparkles className="text-[#A3B18A]" size={18} strokeWidth={1.5} /> Surprise My Garden
      </button>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {PLANTS_DB.map(plant => (
        <div key={plant.id} className={`${theme.glass} rounded-2xl overflow-hidden hover:-translate-y-1 hover:border-white/10 transition-all duration-500 flex flex-col group`}>
          <div className="relative h-80 overflow-hidden bg-[#111312]">
            <img src={plant.image} alt={plant.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90" />
            <div className="absolute top-4 right-4 bg-[#0a0a0a]/90 backdrop-blur-md px-3 py-1.5 rounded-md text-[10px] uppercase tracking-widest font-medium border border-white/5 text-neutral-300">
              {plant.climate}
            </div>
          </div>
          <div className="p-8 flex-1 flex flex-col">
            <div className="flex justify-between items-start mb-2 gap-4">
              <h3 className="text-lg font-medium text-neutral-200 leading-tight">{plant.name}</h3>
              <span className={`text-base font-medium ${theme.textNeon}`}>${plant.price}</span>
            </div>
            <p className="text-xs uppercase tracking-wider text-neutral-500 mb-8 font-medium">{plant.type} • {plant.careLevel} Care</p>
            <button onClick={() => addToCart(plant)} className="mt-auto w-full py-4 rounded-xl bg-[#111312] text-neutral-300 font-medium border border-white/5 hover:bg-[#A3B18A] hover:text-[#0a0a0a] hover:border-[#A3B18A] transition-all duration-300 flex justify-center items-center gap-2 text-sm">
              <ShoppingBag size={18} strokeWidth={1.5} /> Add to Cart
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const DashboardView = ({ garden, careLogs, logCareAction, theme }) => {
  const sortedLogs = [...careLogs].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

  return (
    <div className="max-w-6xl mx-auto px-6 py-6 animate-fade-in">
      <h2 className="text-3xl font-medium text-neutral-100 mb-10 tracking-tight border-b border-white/5 pb-8">My Digital Garden</h2>
      
      {garden.length === 0 ? (
        <div className={`${theme.glass} p-16 text-center rounded-2xl flex flex-col items-center justify-center min-h-[40vh]`}>
          <div className="w-20 h-20 rounded-full bg-[#111312] border border-white/5 flex items-center justify-center mb-6">
            <Leaf size={32} className="text-neutral-600" strokeWidth={1.5} />
          </div>
          <h3 className="text-xl font-medium text-neutral-200 mb-3 tracking-wide">Your garden is empty</h3>
          <p className="text-neutral-500 font-light text-sm">Visit the shop to curate your first rare plant.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Plants Grid */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {garden.map((plant, idx) => (
              <div key={idx} className={`${theme.glass} rounded-2xl p-6 flex flex-col hover:border-white/10 transition-colors`}>
                <div className="relative h-56 mb-6 rounded-xl overflow-hidden bg-[#111312]">
                   <img src={plant.image} alt={plant.name} className="absolute inset-0 w-full h-full object-cover opacity-90" />
                </div>
                <h3 className="text-lg font-medium text-neutral-200 mb-1">{plant.name}</h3>
                <p className="text-xs uppercase tracking-wider text-neutral-500 mb-8 font-medium">Care Level: <span className="text-neutral-400">{plant.careLevel}</span></p>
                
                <div className="flex gap-3 mt-auto">
                  <button onClick={() => logCareAction(plant.id, 'Watered')} className="flex-1 py-3 rounded-xl bg-[#111312] text-neutral-400 hover:text-blue-400 border border-white/5 hover:border-blue-500/30 transition-colors flex justify-center items-center gap-2 text-xs font-medium uppercase tracking-wider">
                    <Droplets size={16} strokeWidth={1.5} /> Water
                  </button>
                  <button onClick={() => logCareAction(plant.id, 'Fertilized')} className="flex-1 py-3 rounded-xl bg-[#111312] text-neutral-400 hover:text-[#A3B18A] border border-white/5 hover:border-[#A3B18A]/30 transition-colors flex justify-center items-center gap-2 text-xs font-medium uppercase tracking-wider">
                    <Sparkles size={16} strokeWidth={1.5} /> Fertilize
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Care History */}
          <div className={`${theme.glass} rounded-2xl p-8 h-fit sticky top-28`}>
            <h3 className="text-lg font-medium text-neutral-200 mb-8 flex items-center gap-3 border-b border-white/5 pb-4">
              <Activity className="text-[#A3B18A]" size={20} strokeWidth={1.5} /> Recent Activity
            </h3>
            {sortedLogs.length === 0 ? (
              <p className="text-neutral-600 text-sm font-light">No recent care logs recorded.</p>
            ) : (
              <div className="space-y-8">
                {sortedLogs.map(log => (
                  <div key={log.id} className="relative pl-6">
                    <span className="absolute left-0 top-1.5 w-1.5 h-1.5 rounded-full bg-[#A3B18A]"></span>
                    <span className="absolute left-[3px] top-4 bottom-[-2rem] w-[1px] bg-white/5 last:hidden"></span>
                    <p className="text-neutral-300 text-sm font-medium leading-relaxed">
                      {log.action} <span className="text-neutral-500 font-light">the</span> {log.plantName}
                    </p>
                    <p className="text-xs text-neutral-600 mt-1.5 font-light uppercase tracking-wider">{new Date(log.date).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' })}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const CommunityView = ({ theme }) => (
  <div className="max-w-6xl mx-auto px-6 py-6 animate-fade-in">
    <div className="text-center mb-16 max-w-2xl mx-auto">
      <h2 className="text-3xl font-medium text-neutral-100 mb-4 tracking-tight">Flora-Tech Community</h2>
      <p className="text-neutral-500 text-sm font-light leading-relaxed">Discover how other urban botanists are cultivating their rare collections.</p>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
      {COMMUNITY_POSTS.map(post => (
        <div key={post.id} className={`${theme.glass} rounded-2xl overflow-hidden hover:-translate-y-1 transition duration-500 flex flex-col`}>
          <img src={post.image} alt="User Plant" className="w-full h-80 object-cover bg-[#111312] opacity-90" />
          <div className="p-8 flex-1 flex flex-col">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 rounded-full bg-[#0a0a0a] border border-white/5 flex items-center justify-center text-sm font-medium text-[#A3B18A]">
                {post.user.charAt(0)}
              </div>
              <span className="font-medium text-neutral-300 text-sm">{post.user}</span>
            </div>
            <p className="text-neutral-400 text-sm leading-relaxed font-light">"{post.text}"</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const ChatbotView = ({ garden, purchases, careLogs, theme }) => {
  const [messages, setMessages] = useState([
    { role: 'model', text: "Welcome. I am Flora-Sensei. I sense the energy of your digital garden. How may I guide your botanical journey today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setIsLoading(true);

    try {
      // FIX 1: By leaving the apiKey empty, the Canvas environment's proxy will safely attach the key for you
      // This strictly prevents the CORS blocks and 'Failed to fetch' errors!
      const apiKey = "AIzaSyD_kwpGnvTpkCAMY6MsrnE_GJ1EJtytVlA"; 
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent?key=${apiKey}`;

      // Construct memory string from local storage state
      const gardenNames = garden.map(g => g.name).join(', ') || 'No plants yet';
      const recentCare = careLogs.slice(0,3).map(l => `${l.action} ${l.plantName}`).join(', ') || 'None recently';
      
      const systemPrompt = `You are Flora-Sensei, an expert botanist and 'plant doctor' AI for the company Flora-Tech. 
      Your tone is calm, Zen, highly informative, and encouraging. You frequently use gentle metaphors from nature.
      
      USER CONTEXT MEMORY (Read from local storage):
      - Plants currently in their Digital Garden: ${gardenNames}
      - Recent Care Actions: ${recentCare}
      - Skill Level Context: They are building an urban indoor garden.
      
      Use this context to personalize your advice. If they ask about a plant they own, acknowledge it. Keep responses concise, formatted nicely (using brief markdown if needed, but plain text works well), and practically helpful for plant care.`;

      // FIX 2: Sanitize history. Gemini will throw a 400 error if roles don't strictly alternate.
      // If a previous request failed, you might have multiple "user" roles back to back. 
      const apiHistory = [];
      messages.slice(1).forEach(msg => { // skip the initial hardcoded greeting
         if (apiHistory.length === 0 && msg.role !== 'user') return; // History MUST start with user
         
         if (apiHistory.length > 0 && apiHistory[apiHistory.length - 1].role === msg.role) {
             // Combine consecutive identical roles to prevent the 400 Alternating Roles Error
             apiHistory[apiHistory.length - 1].parts[0].text += `\n${msg.text}`;
         } else {
             apiHistory.push({ role: msg.role, parts: [{ text: msg.text }] });
         }
      });
      
      // Append the newest user message safely
      if (apiHistory.length > 0 && apiHistory[apiHistory.length - 1].role === 'user') {
          apiHistory[apiHistory.length - 1].parts[0].text += `\n${userText}`;
      } else {
          apiHistory.push({ role: 'user', parts: [{ text: userText }] });
      }

      const payload = {
        contents: apiHistory,
        systemInstruction: { parts: [{ text: systemPrompt }] }
      };

      const delays = [1000, 2000, 4000, 8000, 16000];
      let data = null;
      let lastError = null;

      for (let i = 0; i < 5; i++) {
        try {
          const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          
          data = await response.json();
          
          if (response.ok) {
            lastError = null;
            break; 
          } else {
            lastError = new Error(data.error?.message || "API Error");
          }
        } catch (err) {
          lastError = err; 
        }
        
        if (lastError && i < 4) {
           await new Promise(r => setTimeout(r, delays[i]));
        }
      }

      if (lastError) throw lastError;

      if (data && data.candidates && data.candidates[0].content.parts[0].text) {
        const botText = data.candidates[0].content.parts[0].text;
        setMessages(prev => [...prev, { role: 'model', text: botText }]);
      } else {
        throw new Error("Invalid response format");
      }

    } catch (error) {
      console.error("Chat API Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "The connection to the earth's network is momentarily disrupted. Please try speaking to me again in a moment." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-6 h-[calc(100vh-100px)] flex flex-col animate-fade-in">
      <div className={`${theme.glass} rounded-t-2xl p-6 border-b-0 flex items-center gap-4 z-10 relative shadow-none`}>
        <div className="w-12 h-12 rounded-xl bg-[#0a0a0a] border border-white/5 flex items-center justify-center">
          <Leaf className="text-[#A3B18A]" size={20} strokeWidth={1.5} />
        </div>
        <div>
          <h2 className="text-base font-medium text-neutral-200 tracking-wide">Flora-Sensei</h2>
          <p className="text-[10px] text-[#A3B18A] font-medium tracking-[0.2em] uppercase mt-1">AI Botanist</p>
        </div>
      </div>

      <div className={`flex-1 overflow-y-auto p-6 md:p-8 flex flex-col gap-6 bg-[#0a0a0a] border-x border-white/5`}>
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] md:max-w-[75%] rounded-2xl p-5 ${
              msg.role === 'user' 
                ? `bg-[#A3B18A] ${theme.buttonText} rounded-tr-sm` 
                : 'bg-[#111312] border border-white/5 text-neutral-300 rounded-tl-sm shadow-sm'
            }`}>
              <div className="whitespace-pre-wrap text-[14px] leading-relaxed font-light">{msg.text}</div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-[#111312] border border-white/5 text-neutral-500 rounded-2xl rounded-tl-sm p-5 flex items-center gap-3 font-light text-[14px]">
              <Loader2 size={16} className="animate-spin text-[#A3B18A]" /> Sensing the roots...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className={`${theme.glass} rounded-b-2xl p-4 flex gap-3 border-t-0 z-10 relative shadow-none`}>
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about your plants..."
          className="flex-1 bg-[#0a0a0a] border border-white/5 rounded-xl px-5 py-4 text-neutral-300 focus:outline-none focus:border-[#A3B18A] transition-colors font-light text-sm"
          disabled={isLoading}
        />
        <button 
          type="submit" 
          disabled={isLoading || !input.trim()}
          className={`bg-[#A3B18A] ${theme.buttonText} px-6 py-4 rounded-xl font-medium hover:bg-[#8d9a77] transition-colors disabled:opacity-50 flex items-center justify-center`}
        >
          <Send size={18} strokeWidth={1.5} />
        </button>
      </form>
    </div>
  );
};