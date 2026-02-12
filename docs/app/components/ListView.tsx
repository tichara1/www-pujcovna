
import React from 'react';
import { Listing } from '../types';
import { CATEGORIES } from '../constants';

interface ListViewProps {
  listings: Listing[];
  onSelectListing: (id: string) => void;
  sortConfig: { key: string; direction: 'asc' | 'desc' } | null;
  onSort: (key: string) => void;
}

const ListView: React.FC<ListViewProps> = ({ listings, onSelectListing, sortConfig, onSort }) => {
  const getEarliestDate = (listing: Listing) => {
    if (!listing.availability || listing.availability.length === 0) return 'Dostupné nyní';
    const sorted = [...listing.availability].sort();
    return new Date(sorted[0]).toLocaleDateString();
  };

  const SortIcon = ({ columnKey }: { columnKey: string }) => {
    if (sortConfig?.key !== columnKey) return <i className="fas fa-sort ml-2 text-slate-300"></i>;
    return sortConfig.direction === 'asc' 
      ? <i className="fas fa-sort-up ml-2 text-indigo-600"></i> 
      : <i className="fas fa-sort-down ml-2 text-indigo-600"></i>;
  };

  return (
    <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-slate-100">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">
                Informace o předmětu
              </th>
              <th 
                className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-widest text-slate-400 cursor-pointer hover:text-indigo-600 transition-colors"
                onClick={() => onSort('category')}
              >
                Kategorie <SortIcon columnKey="category" />
              </th>
              <th 
                className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-widest text-slate-400 cursor-pointer hover:text-indigo-600 transition-colors"
                onClick={() => onSort('price')}
              >
                Cena/Den <SortIcon columnKey="price" />
              </th>
              <th 
                className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-widest text-slate-400 cursor-pointer hover:text-indigo-600 transition-colors"
                onClick={() => onSort('availability')}
              >
                Dostupné od <SortIcon columnKey="availability" />
              </th>
              <th 
                className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-widest text-slate-400 cursor-pointer hover:text-indigo-600 transition-colors"
                onClick={() => onSort('createdAt')}
              >
                Vloženo <SortIcon columnKey="createdAt" />
              </th>
              <th className="px-6 py-5 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">
                Akce
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {listings.map((listing) => {
              const category = CATEGORIES.find(c => c.id === listing.category);
              return (
                <tr 
                  key={listing.id} 
                  className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
                  onClick={() => onSelectListing(listing.id)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 shadow-sm flex-shrink-0">
                        <img src={listing.images[0]} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-black text-slate-900 leading-none mb-1 group-hover:text-indigo-600 transition-colors">
                          {listing.title}
                        </p>
                        <p className="text-xs text-slate-400 truncate max-w-[200px]">{listing.location.address}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span 
                      className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest text-white shadow-sm"
                      style={{ backgroundColor: category?.color }}
                    >
                      {category?.label || listing.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-black text-slate-900">{listing.pricing.daily || listing.pricing.hourly} CZK</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-bold text-emerald-600">
                      {getEarliestDate(listing)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-xs text-slate-400 font-medium">
                      {new Date(listing.createdAt).toLocaleDateString()}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="w-10 h-10 rounded-xl bg-slate-100 text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                      <i className="fas fa-chevron-right"></i>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListView;
