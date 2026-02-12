
import React from 'react';
import { Listing } from '../types';
import { CATEGORIES } from '../constants';

interface ListingCardProps {
  listing: Listing;
  onClick: () => void;
}

const ListingCard: React.FC<ListingCardProps> = ({ listing, onClick }) => {
  const category = CATEGORIES.find(c => c.id === listing.category);
  const color = category?.color || '#4f46e5';

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all border border-slate-100 cursor-pointer group flex flex-col h-full"
    >
      <div className="relative h-56 w-full overflow-hidden">
        <img 
          src={listing.images[0]} 
          alt={listing.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div 
          className="absolute top-4 right-4 backdrop-blur-md px-3 py-1.5 rounded-xl text-[10px] font-black text-white shadow-lg uppercase tracking-widest border border-white/20"
          style={{ backgroundColor: `${color}CC` }} 
        >
          {category?.label || listing.category}
        </div>
      </div>
      <div className="p-6 flex flex-col flex-1">
        <h3 className="font-black text-xl text-slate-900 line-clamp-2 mb-2 leading-tight group-hover:text-indigo-600 transition-colors">
          {listing.title}
        </h3>
        <p className="text-slate-400 text-sm flex items-center gap-2 mb-6">
          <i className="fas fa-location-dot text-indigo-400"></i>
          <span className="font-medium">{listing.location.address}</span>
        </p>
        
        <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
          <div>
            <span className="block text-[10px] text-slate-400 font-black uppercase tracking-[0.15em] mb-1">Cena od</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-slate-900 leading-none">
                {listing.pricing.daily || listing.pricing.hourly}
              </span>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                CZK/{listing.pricing.daily ? 'den' : 'hod'}
              </span>
            </div>
          </div>
          <div 
            className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all group-hover:translate-x-1"
            style={{ backgroundColor: `${color}10`, color: color }} 
          >
            <i className="fas fa-chevron-right"></i>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingCard;
