
import React, { useState, useMemo } from 'react';
import { Listing } from '../types';
import { CATEGORIES } from '../constants';

interface ListingDetailProps {
  listing: Listing;
  onBack: () => void;
  onBook: (bookingData: any) => void;
}

type BookingStep = 'selecting' | 'terms' | 'payment';

const TermsStep: React.FC<{ onNext: () => void; onBack: () => void; color: string }> = ({ onNext, onBack, color }) => {
  const [agreed, setAgreed] = useState(false);
  return (
    <div className="p-8 space-y-6 animate-in slide-in-from-right-8 duration-300">
      <div className="space-y-4">
        <h3 className="text-xl font-black text-slate-900">Smlouva o pronájmu</h3>
        <div className="max-h-60 overflow-y-auto pr-2 space-y-3 text-sm text-slate-500 leading-relaxed scrollbar-thin">
          <p>Pokračováním v této rezervaci souhlasíte s následujícími podmínkami:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Stav předmětu:</strong> Musíte vrátit předmět ve stejném stavu, v jakém jste jej převzali.</li>
            <li><strong>Kauce:</strong> Kauce bude blokována a uvolněna do 48 hodin poté, co majitel potvrdí vrácení.</li>
            <li><strong>Pojištění:</strong> Tento pronájem je kryt ShareIt Basic Protection.</li>
            <li><strong>Poškození:</strong> Odpovídáte za jakékoli poškození přesahující výši kauce.</li>
            <li><strong>Pozdní vrácení:</strong> Vrácení předmětu po dohodnutém čase může mít za následek další denní poplatky.</li>
          </ul>
        </div>
      </div>
      <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl cursor-pointer" onClick={() => setAgreed(!agreed)}>
        <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${agreed ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300'}`}>
          {agreed && <i className="fas fa-check text-white text-xs"></i>}
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold text-slate-800">Souhlasím s podmínkami pronájmu</p>
          <p className="text-xs text-slate-400">a potvrzuji, že jsem si přečetl bezpečnostní manuál.</p>
        </div>
      </div>
      <div className="flex gap-3 pt-4 border-t border-slate-100">
        <button onClick={onBack} className="flex-1 py-4 rounded-2xl font-bold text-slate-500 hover:bg-slate-50 transition-all">Zpět</button>
        <button 
          onClick={onNext}
          disabled={!agreed}
          className="flex-[2] py-4 rounded-2xl font-bold text-white transition-all disabled:opacity-50 disabled:grayscale"
          style={{ backgroundColor: color }}
        >
          Pokračovat k platbě
        </button>
      </div>
    </div>
  );
};

const PaymentStep: React.FC<{ onConfirm: () => void; onBack: () => void; amount: number; color: string }> = ({ onConfirm, onBack, amount, color }) => {
  const [loading, setLoading] = useState(false);
  const handlePay = () => {
    setLoading(true);
    setTimeout(onConfirm, 1500);
  };

  return (
    <div className="p-8 space-y-6 animate-in slide-in-from-right-8 duration-300">
      <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-2xl relative overflow-hidden group">
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
        <div className="flex justify-between items-start mb-12">
          <i className="fas fa-microchip text-3xl text-yellow-500/80"></i>
          <div className="text-right">
            <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Zabezpečené připojení</p>
            <i className="fab fa-cc-visa text-2xl"></i>
          </div>
        </div>
        <div className="space-y-4">
          <p className="text-xl font-mono tracking-[0.2em]">**** **** **** 4242</p>
          <div className="flex justify-between items-end">
            <div>
              <p className="text-[8px] uppercase tracking-widest opacity-50 mb-1">Držitel karty</p>
              <p className="text-sm font-bold uppercase">Jakub Novák</p>
            </div>
            <div className="text-right">
              <p className="text-[8px] uppercase tracking-widest opacity-50 mb-1">Expirace</p>
              <p className="text-sm font-bold">12/28</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center px-1">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Celková částka k úhradě</span>
          <span className="text-lg font-black text-slate-900">{amount} CZK</span>
        </div>
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
            <i className="fab fa-apple-pay text-2xl text-slate-900"></i>
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-slate-800">Apple Pay</p>
            <p className="text-[10px] text-slate-400">Zabezpečená platba aktivní</p>
          </div>
          <i className="fas fa-check-circle text-indigo-600"></i>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-100">
        <button 
          onClick={handlePay}
          disabled={loading}
          className="w-full py-5 rounded-2xl font-black text-lg text-white shadow-xl transition-all flex items-center justify-center gap-3"
          style={{ backgroundColor: color, boxShadow: `0 20px 25px -5px ${color}40` }}
        >
          {loading ? <i className="fas fa-spinner fa-spin"></i> : `Zaplatit a potvrdit rezervaci`}
        </button>
        <button onClick={onBack} className="w-full py-3 mt-2 text-slate-400 font-bold text-xs uppercase tracking-widest hover:text-slate-600 transition-all">Zpět</button>
      </div>
    </div>
  );
};

const BookingModal: React.FC<{ 
  listing: Listing; 
  onClose: () => void; 
  onConfirm: (data: any) => void 
}> = ({ listing, onClose, onConfirm }) => {
  const [step, setStep] = useState<BookingStep>('selecting');
  const isHourly = !!listing.pricing.hourly && !listing.pricing.daily;
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [startTime, setStartTime] = useState<string>("09:00");
  const [endTime, setEndTime] = useState<string>("17:00");

  const category = CATEGORIES.find(c => c.id === listing.category);
  const color = category?.color || '#4f46e5';

  const busyDays = ['2024-05-15', '2024-05-16', '2024-05-20'];
  
  const calculateTotal = useMemo(() => {
    if (isHourly) {
      const start = parseInt(startTime.split(':')[0]);
      const end = parseInt(endTime.split(':')[0]);
      const hours = Math.max(1, end - start);
      return (listing.pricing.hourly || 0) * hours;
    } else {
      if (!startDate || !endDate) return 0;
      const s = new Date(startDate);
      const e = new Date(endDate);
      const diff = Math.ceil((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      return (listing.pricing.daily || 0) * Math.max(1, diff);
    }
  }, [startDate, endDate, startTime, endTime, isHourly, listing.pricing]);

  const handleConfirm = () => {
    onConfirm({
      listingId: listing.id,
      totalRent: calculateTotal,
      deposit: listing.deposit,
      start: isHourly ? `${startDate} ${startTime}` : startDate,
      end: isHourly ? `${startDate} ${endTime}` : endDate,
    });
  };

  const renderStep = () => {
    switch(step) {
      case 'selecting':
        return (
          <div className="p-8 space-y-6 animate-in slide-in-from-left-8 duration-300">
            {isHourly ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2">Vyberte den</label>
                  <input 
                    type="date" 
                    style={{ colorScheme: 'light' }}
                    className="w-full px-4 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none bg-white text-slate-900 font-semibold transition-all shadow-sm"
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2">Čas od</label>
                    <select 
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full px-4 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none bg-white text-slate-900 font-semibold shadow-sm cursor-pointer"
                    >
                      {[...Array(13)].map((_, i) => (
                        <option key={i} value={`${i+8}:00`}>{i+8}:00</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2">Čas do</label>
                    <select 
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full px-4 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none bg-white text-slate-900 font-semibold shadow-sm cursor-pointer"
                    >
                      {[...Array(13)].map((_, i) => (
                        <option key={i} value={`${i+9}:00`}>{i+9}:00</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2">Datum od</label>
                    <input 
                      type="date" 
                      min={new Date().toISOString().split('T')[0]}
                      style={{ colorScheme: 'light' }}
                      className="w-full px-4 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none bg-white text-slate-900 font-semibold shadow-sm"
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2">Datum do</label>
                    <input 
                      type="date" 
                      min={startDate || new Date().toISOString().split('T')[0]}
                      style={{ colorScheme: 'light' }}
                      className="w-full px-4 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none bg-white text-slate-900 font-semibold shadow-sm"
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-200/60 shadow-inner">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 text-center">Přehled kalendáře</p>
                  <div className="grid grid-cols-7 gap-1.5 text-center">
                    {['P','Ú','S','Č','P','S','N'].map((d, i) => (
                      <div key={i} className="text-[9px] text-slate-300 font-black mb-1">{d}</div>
                    ))}
                    {[...Array(31)].map((_, i) => {
                      const day = i + 1;
                      const isBusy = busyDays.includes(`2024-05-${day < 10 ? '0' + day : day}`);
                      return (
                        <div 
                          key={i} 
                          className={`aspect-square flex items-center justify-center rounded-xl text-xs font-black transition-all border-2 ${isBusy ? 'bg-slate-200 text-slate-500 border-slate-300 cursor-not-allowed' : 'bg-white border-white text-slate-700 hover:border-indigo-200 hover:bg-indigo-50 cursor-pointer shadow-sm'}`}
                          title={isBusy ? 'Obsazeno' : 'Dostupné'}
                        >
                          {day}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            <div className="pt-6 border-t border-slate-100">
              <div className="flex justify-between items-center mb-6 px-1">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Celkem k platbě</p>
                  <p className="text-3xl font-black text-indigo-600">{calculateTotal + listing.deposit} <span className="text-sm font-bold text-slate-400">CZK</span></p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500 font-bold">Půjčovné: {calculateTotal} CZK</p>
                  <p className="text-xs text-slate-500 font-bold">Kauce: {listing.deposit} CZK</p>
                </div>
              </div>

              <button 
                onClick={() => setStep('terms')}
                className="w-full bg-slate-900 text-white py-5 rounded-[2rem] font-black text-lg hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-3 group"
              >
                Zkontrolovat podmínky
                <i className="fas fa-arrow-right text-sm group-hover:translate-x-1 transition-transform"></i>
              </button>
            </div>
          </div>
        );
      case 'terms':
        return <TermsStep onBack={() => setStep('selecting')} onNext={() => setStep('payment')} color={color} />;
      case 'payment':
        return <PaymentStep amount={calculateTotal + listing.deposit} onBack={() => setStep('terms')} onConfirm={handleConfirm} color={color} />;
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-10 duration-500">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <div className="flex items-center gap-3 mb-1">
               {step !== 'selecting' && (
                 <button onClick={() => setStep(step === 'payment' ? 'terms' : 'selecting')} className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors">
                   <i className="fas fa-arrow-left text-sm"></i>
                 </button>
               )}
               <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                {step === 'selecting' ? 'Rezervace' : step === 'terms' ? 'Podmínky' : 'Platba'}
               </h2>
            </div>
            <p className="text-slate-500 text-sm font-medium">
              {step === 'selecting' ? `Potvrďte vaše ${isHourly ? 'hodiny' : 'data'}` : step === 'terms' ? 'Zkontrolujte a souhlaste s podmínkami' : 'Dokončete vaši rezervaci'}
            </p>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-slate-400 hover:text-red-500 transition-all">
            <i className="fas fa-times text-lg"></i>
          </button>
        </div>

        {renderStep()}
      </div>
    </div>
  );
};

const ListingDetail: React.FC<ListingDetailProps> = ({ listing, onBack, onBook }) => {
  const [showModal, setShowModal] = useState(false);
  const [days, setDays] = useState(1);
  const totalRent = (listing.pricing.daily || listing.pricing.hourly || 0) * days;
  const grandTotal = totalRent + listing.deposit;

  const category = CATEGORIES.find(c => c.id === listing.category);
  const color = category?.color || '#4f46e5';

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {showModal && (
        <BookingModal 
          listing={listing} 
          onClose={() => setShowModal(false)} 
          onConfirm={(data) => {
            setShowModal(false);
            onBook(data);
          }}
        />
      )}

      <button 
        onClick={onBack}
        className="mb-8 flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-bold uppercase text-xs tracking-widest transition-all"
      >
        <i className="fas fa-chevron-left"></i>
        Zpět k hledání
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <div className="rounded-[3rem] overflow-hidden aspect-video bg-slate-200 shadow-2xl group relative">
            <img 
              src={listing.images[0]} 
              alt={listing.title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
            />
            <div className="absolute top-6 left-6">
              <span 
                className="px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-lg backdrop-blur-sm"
                style={{ backgroundColor: `${color}CC` }}
              >
                {category?.label || listing.category}
              </span>
            </div>
          </div>

          <div className="px-2">
            <div className="flex items-center gap-4 mb-4">
              <span className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                <i className="far fa-calendar-alt text-indigo-400"></i> Publikováno {new Date(listing.createdAt).toLocaleDateString()}
              </span>
              <span className="w-1 h-1 rounded-full bg-slate-200"></span>
              <span className="flex items-center gap-2 text-emerald-500 text-[10px] font-bold uppercase tracking-widest">
                <i className="fas fa-check-circle"></i> Dostupné nyní
              </span>
            </div>
            <h1 className="text-5xl font-black text-slate-900 mb-6 tracking-tight leading-none">{listing.title}</h1>
            <p className="text-xl text-slate-500 leading-relaxed border-b border-slate-100 pb-10 mb-10">
              {listing.description}
            </p>

            <div className="space-y-8">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Podmínky a Poloha</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-8 bg-white rounded-[2.5rem] border border-slate-100 flex items-center gap-6 hover:shadow-xl hover:border-indigo-100 transition-all group">
                  <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    <i className="fas fa-shield-halved"></i>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.15em] mb-1">Vratná kauce</p>
                    <p className="text-2xl font-black text-slate-800">{listing.deposit} CZK</p>
                  </div>
                </div>
                <div className="p-8 bg-white rounded-[2.5rem] border border-slate-100 flex items-center gap-6 hover:shadow-xl hover:border-indigo-100 transition-all group">
                  <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    <i className="fas fa-location-dot"></i>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.15em] mb-1">Lokalita vyzvednutí</p>
                    <p className="text-2xl font-black text-slate-800 truncate max-w-[150px]">{listing.location.address}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24 glass-effect p-10 rounded-[3rem] border border-white shadow-2xl shadow-indigo-100/50">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-2">Cena za půjčení</p>
                <p className="text-5xl font-black text-slate-900 leading-none">{listing.pricing.daily || listing.pricing.hourly} <span className="text-lg text-slate-400 font-bold uppercase tracking-widest">CZK</span></p>
              </div>
              <div className="text-right">
                <div className="flex items-center justify-end text-yellow-400 gap-1.5 mb-1.5">
                  <i className="fas fa-star text-base"></i>
                  <span className="text-slate-900 font-black text-lg">4.9</span>
                </div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">12 recenzí</p>
              </div>
            </div>

            <div className="space-y-6 mb-10">
              <div className="p-6 bg-slate-50/50 rounded-3xl border border-slate-200/50">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 text-center">Doba nájmu (Dny)</label>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setDays(Math.max(1, days - 1))}
                    className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-300 shadow-sm transition-all active:scale-95"
                  ><i className="fas fa-minus text-sm"></i></button>
                  <div className="flex-1 text-center font-black text-3xl text-slate-900">{days}</div>
                  <button 
                    onClick={() => setDays(days + 1)}
                    className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-300 shadow-sm transition-all active:scale-95"
                  ><i className="fas fa-plus text-sm"></i></button>
                </div>
              </div>
            </div>

            <div className="space-y-5 py-8 border-y border-slate-100 mb-10">
              <div className="flex justify-between text-slate-500 font-bold text-sm">
                <span>Půjčovné ({days} dny)</span>
                <span className="text-slate-900">{totalRent} CZK</span>
              </div>
              <div className="flex justify-between text-slate-500 font-bold text-sm">
                <span>Vratná kauce</span>
                <span className="text-slate-900">{listing.deposit} CZK</span>
              </div>
              <div className="flex justify-between items-end pt-6">
                <span className="font-black text-slate-400 uppercase text-[10px] tracking-[0.2em]">Odhad celkem</span>
                <span className="text-4xl font-black text-indigo-600 leading-none">{grandTotal} CZK</span>
              </div>
            </div>

            <button 
              onClick={() => setShowModal(true)}
              className="w-full text-white py-6 rounded-[2rem] font-black text-xl hover:brightness-110 transition-all shadow-2xl group relative overflow-hidden active:scale-[0.98]"
              style={{ backgroundColor: color, boxShadow: `0 25px 35px -5px ${color}50` }}
            >
              <span className="relative z-10">Rezervovat předmět</span>
              <i className="fas fa-arrow-right ml-3 group-hover:translate-x-1.5 transition-transform relative z-10"></i>
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>
            
            <button className="w-full mt-6 flex items-center justify-center gap-2.5 text-slate-400 hover:text-slate-900 font-black text-[10px] transition-colors py-2 uppercase tracking-[0.2em]">
              <i className="far fa-comment-dots text-sm"></i>
              Kontaktovat majitele
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetail;
