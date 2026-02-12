
import React, { useState } from 'react';
import { BookingStatus } from '../types';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'borrowing' | 'lending'>('borrowing');

  // Simulovaná data
  const bookings = [
    {
      id: 'b-1',
      item: 'Dron DJI Mini 3 Pro',
      status: 'ACTIVE' as BookingStatus,
      price: 800,
      dates: '24. říj - 26. říj',
      owner: 'Karel Svoboda'
    },
    {
      id: 'b-2',
      item: 'Tlaková myčka',
      status: 'HANDOVER_IN' as BookingStatus,
      price: 450,
      dates: '28. říj',
      owner: 'Marek Tichý'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 mb-2">Moje aktivita</h1>
          <p className="text-slate-500">Spravujte své výpůjčky a nabízené věci.</p>
        </div>
      </div>

      <div className="flex gap-2 p-1 bg-slate-200 rounded-2xl w-fit mb-8">
        <button 
          onClick={() => setActiveTab('borrowing')}
          className={`px-6 py-2 rounded-xl font-bold text-sm transition-all ${activeTab === 'borrowing' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Moje výpůjčky
        </button>
        <button 
          onClick={() => setActiveTab('lending')}
          className={`px-6 py-2 rounded-xl font-bold text-sm transition-all ${activeTab === 'lending' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Moje inzeráty
        </button>
      </div>

      <div className="space-y-4">
        {activeTab === 'borrowing' ? (
          bookings.map(b => (
            <div key={b.id} className="bg-white p-6 rounded-3xl border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 overflow-hidden">
                   <img src={`https://picsum.photos/seed/${b.id}/200/200`} alt={b.item} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-lg">{b.item}</h4>
                  <p className="text-sm text-slate-500 flex items-center gap-2">
                    <i className="far fa-calendar"></i> {b.dates}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <div className="text-right mr-4 hidden sm:block">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Celková cena</p>
                  <p className="font-bold text-slate-900">{b.price} CZK</p>
                </div>
                
                {b.status === 'ACTIVE' && (
                  <span className="bg-green-50 text-green-600 px-4 py-2 rounded-xl text-xs font-bold border border-green-100">
                    Právě půjčeno
                  </span>
                )}
                {b.status === 'HANDOVER_IN' && (
                  <span className="bg-amber-50 text-amber-600 px-4 py-2 rounded-xl text-xs font-bold border border-amber-100 flex items-center gap-2">
                    <i className="fas fa-camera"></i> Připraveno k převzetí
                  </span>
                )}

                <button className="px-6 py-3 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-colors">
                  Podrobnosti
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mx-auto mb-4">
              <i className="fas fa-plus text-2xl"></i>
            </div>
            <p className="text-slate-500 mb-6">Zatím jste nevložili žádný inzerát.</p>
            <button className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
              Vložit první inzerát
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
