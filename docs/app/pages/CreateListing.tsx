
import React, { useState } from 'react';
import { CATEGORIES } from '../constants';
import { optimizeListing, generateListingImage } from '../services/geminiService';

interface CreateListingProps {
  onCancel: () => void;
  onSubmit: (listing: any) => void;
}

const CreateListing: React.FC<CreateListingProps> = ({ onCancel, onSubmit }) => {
  const [loading, setLoading] = useState(false);
  const [imgLoading, setImgLoading] = useState(false);
  const [pricingType, setPricingType] = useState<'daily' | 'hourly'>('daily');
  const [isAlwaysAvailable, setIsAlwaysAvailable] = useState(true);
  const [manualType, setManualType] = useState<'none' | 'link' | 'pdf' | 'text'>('none');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'tools',
    price: '',
    deposit: '',
    address: 'Praha, Česká republika',
    availableFrom: new Date().toISOString().split('T')[0],
    availableTo: '',
    manualData: '',
    images: [] as string[]
  });

  const handleAIHelp = async () => {
    if (!formData.title) {
       alert("Nejdříve zadejte název, aby vám AI mohla pomoci!");
       return;
    }
    setLoading(true);
    const suggestion = await optimizeListing(formData.title, formData.category);
    if (suggestion) {
      setFormData(prev => ({
        ...prev,
        description: suggestion.suggestedDescription,
        deposit: suggestion.suggestedDeposit.toString(),
        price: pricingType === 'daily' 
          ? suggestion.suggestedPricing.daily?.toString() || suggestion.suggestedPricing.hourly?.toString() || ''
          : suggestion.suggestedPricing.hourly?.toString() || ''
      }));
    }
    setLoading(false);
  };

  const handleGenerateImage = async () => {
    if (!formData.title) {
      alert("Nejdříve zadejte název!");
      return;
    }
    setImgLoading(true);
    const imgData = await generateListingImage(formData.title, formData.category);
    if (imgData) {
      setFormData(prev => ({
        ...prev,
        images: [imgData, ...prev.images]
      }));
    } else {
      alert("Generování obrázku selhalo. Zkuste to prosím znovu.");
    }
    setImgLoading(false);
  };

  const handleFormSubmit = () => {
    if (!formData.title || !formData.price || !formData.deposit) {
      alert("Prosím vyplňte název, cenu a kauci.");
      return;
    }

    const finalListing = {
      ...formData,
      pricing: pricingType === 'daily' ? { daily: Number(formData.price) } : { hourly: Number(formData.price) },
      availability: isAlwaysAvailable ? [] : [formData.availableFrom, formData.availableTo].filter(Boolean),
      manual: manualType !== 'none' ? { type: manualType, content: formData.manualData } : null
    };
    onSubmit(finalListing);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-12 flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">Nabídněte věc k pronájmu</h1>
          <p className="text-slate-500 text-lg">Sdílejte své vybavení s komunitou a vydělávejte.</p>
        </div>
        <button onClick={onCancel} className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-200 transition-all">
          <i className="fas fa-times text-xl"></i>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-10">
            {/* Základní info */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-slate-900 border-b border-slate-50 pb-4">Základní informace</h2>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2.5 ml-1">Název inzerátu</label>
                <input 
                  type="text" 
                  placeholder="např. Vrtací kladivo Bosch GBH 2-28 s příslušenstvím"
                  className="w-full px-6 py-4 rounded-2xl border-2 border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all text-slate-900 font-bold placeholder:text-slate-300 bg-white"
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-3 ml-1">Kategorie</label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {CATEGORIES.map(cat => {
                    const isSelected = formData.category === cat.id;
                    return (
                      <button 
                        key={cat.id}
                        type="button"
                        onClick={() => setFormData({...formData, category: cat.id})}
                        className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${isSelected ? 'text-white border-transparent' : 'bg-white border-slate-100 text-slate-500 hover:border-indigo-100 hover:bg-indigo-50/30'}`}
                        style={{ 
                          backgroundColor: isSelected ? cat.color : undefined,
                          boxShadow: isSelected ? `0 12px 20px -5px ${cat.color}60` : undefined
                        }}
                      >
                        <span className="text-xl">{cat.icon}</span>
                        <span className="text-[10px] font-black uppercase tracking-widest">{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Cena a Dostupnost - Zarovnáno */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-slate-900 border-b border-slate-50 pb-4">Cena a Dostupnost</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                {/* Sloupec 1: Typ a Cena */}
                <div className="space-y-4">
                  <label className="block text-sm font-bold text-slate-700 ml-1">Typ pronájmu</label>
                  <div className="flex p-1.5 bg-slate-100 rounded-2xl">
                    <button 
                      onClick={() => setPricingType('daily')}
                      className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${pricingType === 'daily' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}
                    >Denní</button>
                    <button 
                      onClick={() => setPricingType('hourly')}
                      className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${pricingType === 'hourly' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}
                    >Hodinový</button>
                  </div>
                  <div className="relative">
                    <input 
                      type="number" 
                      placeholder="0"
                      className="w-full pl-6 pr-16 py-4 rounded-2xl border-2 border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all text-slate-900 font-black text-2xl bg-white"
                      value={formData.price}
                      onChange={e => setFormData({...formData, price: e.target.value})}
                    />
                    <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                      CZK / {pricingType === 'daily' ? 'den' : 'hod'}
                    </span>
                  </div>
                </div>

                {/* Sloupec 2: Kauce - Zarovnáno se vstupem ceny */}
                <div className="space-y-4">
                  <label className="block text-sm font-bold text-slate-700 ml-1">Vratná kauce</label>
                  <div className="hidden md:block h-[50px]"></div> {/* Zarovnání s přepínačem typu */}
                  <div className="relative">
                    <input 
                      type="number" 
                      placeholder="0"
                      className="w-full px-6 py-4 rounded-2xl border-2 border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all text-slate-900 font-black text-2xl bg-white"
                      value={formData.deposit}
                      onChange={e => setFormData({...formData, deposit: e.target.value})}
                    />
                    <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-[10px] uppercase tracking-widest">CZK</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-4">
                <div className="flex items-center justify-between">
                   <label className="text-sm font-bold text-slate-700">Časová dostupnost</label>
                   <label className="flex items-center gap-2 cursor-pointer group">
                      <span className="text-xs font-bold text-slate-500 group-hover:text-indigo-600 transition-colors">Dostupné kdykoliv od dneška</span>
                      <div 
                        onClick={() => setIsAlwaysAvailable(!isAlwaysAvailable)}
                        className={`w-12 h-6 rounded-full relative transition-all ${isAlwaysAvailable ? 'bg-indigo-600' : 'bg-slate-300'}`}
                      >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isAlwaysAvailable ? 'left-7' : 'left-1'}`}></div>
                      </div>
                   </label>
                </div>
                
                {!isAlwaysAvailable && (
                  <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-top-2 duration-300">
                    <input 
                      type="date" 
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-indigo-500 outline-none font-bold text-slate-900"
                      value={formData.availableFrom}
                      onChange={e => setFormData({...formData, availableFrom: e.target.value})}
                    />
                    <input 
                      type="date" 
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-indigo-500 outline-none font-bold text-slate-900"
                      value={formData.availableTo}
                      onChange={e => setFormData({...formData, availableTo: e.target.value})}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Nová sekce: Manuál a dokumentace */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-slate-900 border-b border-slate-50 pb-4">Manuál a dokumentace</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                 {[
                   { id: 'none', label: 'Bez manuálu', icon: 'fa-ban' },
                   { id: 'link', label: 'Odkaz (URL)', icon: 'fa-link' },
                   { id: 'pdf', label: 'PDF Soubor', icon: 'fa-file-pdf' },
                   { id: 'text', label: 'Textový popis', icon: 'fa-align-left' }
                 ].map(type => (
                   <button 
                     key={type.id}
                     onClick={() => { setManualType(type.id as any); setFormData({...formData, manualData: ''}); }}
                     className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${manualType === type.id ? 'bg-indigo-50 border-indigo-500 text-indigo-600' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'}`}
                   >
                     <i className={`fas ${type.icon} text-lg`}></i>
                     <span className="text-[10px] font-black uppercase tracking-widest">{type.label}</span>
                   </button>
                 ))}
              </div>

              {manualType !== 'none' && (
                <div className="animate-in slide-in-from-top-2 duration-300">
                  {manualType === 'link' && (
                    <input 
                      type="url" 
                      placeholder="https://vyrobce.cz/navod-k-pouziti"
                      className="w-full px-6 py-4 rounded-2xl border-2 border-slate-200 focus:border-indigo-500 outline-none font-medium text-slate-900 bg-slate-50/50"
                      value={formData.manualData}
                      onChange={e => setFormData({...formData, manualData: e.target.value})}
                    />
                  )}
                  {manualType === 'pdf' && (
                    <div className="flex items-center gap-4 p-6 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50 cursor-pointer hover:bg-slate-50 transition-colors">
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-red-500 shadow-sm">
                        <i className="fas fa-file-pdf text-xl"></i>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-700">Vybrat PDF soubor</p>
                        <p className="text-xs text-slate-400">Maximální velikost 10MB</p>
                      </div>
                    </div>
                  )}
                  {manualType === 'text' && (
                    <textarea 
                      rows={4}
                      placeholder="Zadejte pokyny pro bezpečné používání..."
                      className="w-full px-6 py-4 rounded-2xl border-2 border-slate-200 focus:border-indigo-500 outline-none font-medium text-slate-900 bg-slate-50/50"
                      value={formData.manualData}
                      onChange={e => setFormData({...formData, manualData: e.target.value})}
                    ></textarea>
                  )}
                </div>
              )}
            </div>

            {/* Popis předmětu */}
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-50 pb-4">
                <h2 className="text-xl font-bold text-slate-900">Popis předmětu</h2>
                <button 
                  onClick={handleAIHelp}
                  disabled={loading}
                  className="bg-indigo-600 text-white px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest hover:bg-indigo-700 flex items-center gap-2 disabled:opacity-50 transition-all shadow-lg shadow-indigo-100"
                >
                  <i className={`fas ${loading ? 'fa-spinner fa-spin' : 'fa-magic'}`}></i>
                  {loading ? 'Přemýšlím...' : 'AI pomocník'}
                </button>
              </div>
              <textarea 
                rows={5}
                placeholder="Popište vaši věc, její technický stav a co všechno půjčujete..."
                className="w-full px-6 py-4 rounded-2xl border-2 border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all text-slate-900 font-medium placeholder:text-slate-300 bg-white leading-relaxed text-lg"
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
              ></textarea>
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <section className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
            
            <div className="flex items-center justify-between mb-6 relative z-10">
              <h3 className="text-xl font-bold">Fotografie</h3>
              <button 
                onClick={handleGenerateImage}
                disabled={imgLoading}
                className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-50 border border-white/10"
              >
                <i className={`fas ${imgLoading ? 'fa-spinner fa-spin' : 'fa-camera-retro'} mr-2`}></i>
                {imgLoading ? 'Kreslím...' : 'AI Náhled'}
              </button>
            </div>
            
            <div className="space-y-4 relative z-10">
              {formData.images.length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                  {formData.images.map((img, idx) => (
                    <div key={idx} className="aspect-square rounded-2xl overflow-hidden border-2 border-white/10 group relative shadow-lg">
                      <img src={img} alt={`${formData.title} ${idx + 1}`} className="w-full h-full object-cover" />
                      <button 
                        onClick={() => setFormData(p => ({...p, images: p.images.filter((_, i) => i !== idx)}))}
                        className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                      >
                        <i className="fas fa-trash-can text-xs"></i>
                      </button>
                    </div>
                  ))}
                  <div className="aspect-square bg-white/5 rounded-2xl border-2 border-dashed border-white/20 flex items-center justify-center cursor-pointer hover:bg-white/10 transition-all group">
                    <i className="fas fa-plus text-white/30 group-hover:text-white transition-colors text-xl"></i>
                  </div>
                </div>
              ) : (
                <div className="aspect-video bg-white/5 rounded-[2rem] border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-white/10 transition-all p-6 text-center">
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center">
                    <i className="fas fa-cloud-arrow-up text-2xl text-indigo-400"></i>
                  </div>
                  <div>
                    <span className="block text-sm font-bold">Nahrajte fotku</span>
                    <span className="text-[10px] text-white/40 uppercase font-bold tracking-widest mt-1">Nebo AI náhled</span>
                  </div>
                </div>
              )}
            </div>
          </section>

          <div className="p-8 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm space-y-6">
            <div className="flex items-center gap-4 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
              <div className="w-10 h-10 bg-emerald-500 text-white rounded-xl flex items-center justify-center shadow-md shadow-emerald-200">
                <i className="fas fa-user-check"></i>
              </div>
              <div>
                <p className="text-xs font-black text-emerald-800 uppercase tracking-widest">Bezpečné sdílení</p>
                <p className="text-[11px] text-emerald-600 font-medium">Pouze pro ověřené uživatele.</p>
              </div>
            </div>
            
            <button 
              onClick={handleFormSubmit}
              className="w-full bg-indigo-600 text-white py-6 rounded-[2rem] font-black text-xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 group active:scale-[0.98]"
            >
              Publikovat inzerát
              <i className="fas fa-paper-plane text-sm group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"></i>
            </button>
            
            <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">Souhlasíte se zásadami komunity</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateListing;
