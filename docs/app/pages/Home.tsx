
import React, { useState, useMemo, useEffect } from 'react';
import { CATEGORIES, MOCK_LISTINGS } from '../constants';
import ListingCard from '../components/ListingCard';
import MapView from '../components/MapView';
import ListView from '../components/ListView';

interface HomeProps {
  onSelectListing: (id: string) => void;
}

const ITEMS_PER_PAGE = 8;

// Haversine formula to calculate distance between two points in km
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const Home: React.FC<HomeProps> = ({ onSelectListing }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [viewType, setViewType] = useState<'grid' | 'map' | 'list'>('grid');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>({ key: 'createdAt', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);

  // Location filtering state
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [maxDistance, setMaxDistance] = useState<number>(50); // Default 50km
  const [isLocationFilterActive, setIsLocationFilterActive] = useState(false);

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getUserLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolokace není vaším prohlížečem podporována.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setIsLocationFilterActive(true);
      },
      () => {
        alert("Nepodařilo se získat vaši polohu. Zkontrolujte prosím oprávnění.");
      }
    );
  };

  const filteredAndSortedListings = useMemo(() => {
    let result = MOCK_LISTINGS.filter(l => {
      const matchesCat = selectedCategory ? l.category === selectedCategory : true;
      const matchesSearch = l.title.toLowerCase().includes(search.toLowerCase());
      
      let matchesDistance = true;
      if (isLocationFilterActive && userCoords) {
        const dist = calculateDistance(userCoords.lat, userCoords.lng, l.location.lat, l.location.lng);
        matchesDistance = dist <= maxDistance;
      }
      
      return matchesCat && matchesSearch && matchesDistance;
    });

    if (sortConfig) {
      result = [...result].sort((a, b) => {
        let valA: any, valB: any;

        switch (sortConfig.key) {
          case 'price':
            valA = a.pricing.daily || a.pricing.hourly || 0;
            valB = b.pricing.daily || b.pricing.hourly || 0;
            break;
          case 'createdAt':
            valA = new Date(a.createdAt).getTime();
            valB = new Date(b.createdAt).getTime();
            break;
          case 'category':
            valA = a.category;
            valB = b.category;
            break;
          case 'availability':
            const earliestA = a.availability?.[0] ? new Date(a.availability[0]).getTime() : Infinity;
            const earliestB = b.availability?.[0] ? new Date(b.availability[0]).getTime() : Infinity;
            valA = earliestA;
            valB = earliestB;
            break;
          default:
            valA = a[sortConfig.key];
            valB = b[sortConfig.key];
        }

        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [selectedCategory, search, sortConfig, userCoords, maxDistance, isLocationFilterActive]);

  const totalPages = Math.ceil(filteredAndSortedListings.length / ITEMS_PER_PAGE);
  const paginatedListings = filteredAndSortedListings.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Vše, co potřebujete,<br /><span className="text-indigo-600">vlastní váš soused.</span>
          </h1>
          <p className="text-slate-500 text-lg max-w-2xl font-medium">
            Zabezpečená, ověřená a komunitní platforma pro sdílení vybavení. Šetřete peníze, prostor a sdílejte s důvěrou.
          </p>
        </div>
        
        <div className="flex p-1.5 bg-slate-200/80 backdrop-blur rounded-[2rem] shadow-inner">
          <button 
            onClick={() => { setViewType('grid'); setCurrentPage(1); }}
            className={`px-6 py-3 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest flex items-center gap-2 transition-all ${viewType === 'grid' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <i className="fas fa-th-large text-sm"></i> Karty
          </button>
          <button 
            onClick={() => { setViewType('list'); setCurrentPage(1); }}
            className={`px-6 py-3 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest flex items-center gap-2 transition-all ${viewType === 'list' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <i className="fas fa-list text-sm"></i> Seznam
          </button>
          <button 
            onClick={() => { setViewType('map'); setCurrentPage(1); }}
            className={`px-6 py-3 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest flex items-center gap-2 transition-all ${viewType === 'map' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <i className="fas fa-map text-sm"></i> Mapa
          </button>
        </div>
      </div>

      {/* Advanced Filters Section */}
      <div className="space-y-6 mb-14 pb-8 border-b border-slate-100">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 relative group">
            <i className="fas fa-search absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors"></i>
            <input 
              type="text" 
              placeholder="Hledejte nářadí, elektroniku, kempingové vybavení..."
              className="w-full pl-14 pr-6 py-5 rounded-[2rem] border-none ring-1 ring-slate-200 focus:ring-4 focus:ring-indigo-100 bg-white shadow-sm transition-all outline-none font-medium"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            />
          </div>

          <div className="lg:w-1/3 flex flex-col sm:flex-row items-center gap-4 bg-white p-2 rounded-[2rem] ring-1 ring-slate-200 shadow-sm px-6">
             <button 
                onClick={getUserLocation}
                className={`flex items-center gap-2 px-4 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${isLocationFilterActive ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
             >
                <i className={`fas ${isLocationFilterActive ? 'fa-location-crosshairs' : 'fa-location-dot'}`}></i>
                {isLocationFilterActive ? 'Zaměřeno' : 'Moje poloha'}
             </button>
             
             <div className="flex-1 w-full px-2 py-1">
                <div className="flex justify-between mb-1">
                   <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Maximální vzdálenost</span>
                   <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest">{isLocationFilterActive ? `${maxDistance} km` : 'Vypnuto'}</span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="100" 
                  step="1"
                  disabled={!isLocationFilterActive}
                  value={maxDistance}
                  onChange={(e) => setMaxDistance(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600 disabled:opacity-30"
                />
             </div>
             
             {isLocationFilterActive && (
               <button 
                 onClick={() => { setIsLocationFilterActive(false); setUserCoords(null); }}
                 className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors"
               >
                 <i className="fas fa-times"></i>
               </button>
             )}
          </div>
        </div>

        <div className="flex overflow-x-auto gap-3 pb-2 hide-scrollbar scroll-smooth items-center">
          <button 
            onClick={() => { setSelectedCategory(null); setCurrentPage(1); }}
            className={`whitespace-nowrap px-8 py-5 rounded-[2rem] font-black text-[10px] uppercase tracking-widest transition-all border-b-4 ${!selectedCategory ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100 border-indigo-700' : 'bg-white text-slate-600 ring-1 ring-slate-200 border-transparent hover:ring-indigo-300'}`}
          >
            Všechno
          </button>
          {CATEGORIES.map(cat => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button 
                key={cat.id}
                onClick={() => { setSelectedCategory(cat.id); setCurrentPage(1); }}
                className={`whitespace-nowrap px-8 py-5 rounded-[2rem] font-black text-[10px] uppercase tracking-widest flex items-center gap-2 transition-all border-b-4 ${isSelected ? 'text-white shadow-xl' : 'bg-white text-slate-600 ring-1 ring-slate-200 border-transparent hover:ring-indigo-300'}`}
                style={{ 
                  backgroundColor: isSelected ? cat.color : undefined,
                  borderColor: isSelected ? 'rgba(0,0,0,0.2)' : undefined,
                  boxShadow: isSelected ? `0 15px 25px -5px ${cat.color}40` : undefined
                }}
              >
                {cat.icon}
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* View Logic */}
      {viewType === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {paginatedListings.length > 0 ? (
            paginatedListings.map(listing => (
              <div key={listing.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <ListingCard 
                  listing={listing} 
                  onClick={() => onSelectListing(listing.id)} 
                />
              </div>
            ))
          ) : (
            <div className="col-span-full py-24 text-center">
              <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300 text-4xl">
                <i className="fas fa-search-location"></i>
              </div>
              <p className="text-slate-500 font-black uppercase tracking-widest">Nebyly nalezeny žádné výsledky v této lokalitě</p>
              <button 
                onClick={() => { setIsLocationFilterActive(false); setSelectedCategory(null); setSearch(''); }}
                className="mt-4 text-indigo-600 font-bold text-sm hover:underline"
              >
                Zrušit všechny filtry
              </button>
            </div>
          )}
        </div>
      )}

      {viewType === 'list' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {paginatedListings.length > 0 ? (
            <ListView 
              listings={paginatedListings} 
              onSelectListing={onSelectListing} 
              sortConfig={sortConfig}
              onSort={handleSort}
            />
          ) : (
            <div className="py-24 text-center bg-white rounded-[2.5rem] border border-dashed border-slate-200">
              <p className="text-slate-500 font-black uppercase tracking-widest">Nebyly nalezeny žádné výsledky</p>
            </div>
          )}
        </div>
      )}

      {viewType === 'map' && (
        <div className="animate-in fade-in zoom-in-95 duration-500">
           <MapView listings={filteredAndSortedListings} onSelectListing={onSelectListing} />
        </div>
      )}

      {/* Stránkování */}
      {viewType !== 'map' && totalPages > 1 && (
        <div className="mt-16 flex items-center justify-center gap-2">
          <button 
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
            className="w-12 h-12 rounded-2xl bg-white border border-slate-200 text-slate-400 flex items-center justify-center hover:border-indigo-600 hover:text-indigo-600 transition-all disabled:opacity-30 disabled:hover:border-slate-200 disabled:hover:text-slate-400"
          >
            <i className="fas fa-chevron-left"></i>
          </button>
          
          {[...Array(totalPages)].map((_, i) => (
            <button 
              key={i}
              onClick={() => handlePageChange(i + 1)}
              className={`w-12 h-12 rounded-2xl font-black transition-all ${currentPage === i + 1 ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-white border border-slate-200 text-slate-400 hover:border-indigo-600 hover:text-indigo-600'}`}
            >
              {i + 1}
            </button>
          ))}

          <button 
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
            className="w-12 h-12 rounded-2xl bg-white border border-slate-200 text-slate-400 flex items-center justify-center hover:border-indigo-600 hover:text-indigo-600 transition-all disabled:opacity-30 disabled:hover:border-slate-200 disabled:hover:text-slate-400"
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
