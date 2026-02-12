
import React, { useEffect, useRef } from 'react';
import { Listing } from '../types';
import { CATEGORIES } from '../constants';

interface MapViewProps {
  listings: Listing[];
  onSelectListing: (id: string) => void;
}

const MapView: React.FC<MapViewProps> = ({ listings, onSelectListing }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<any>(null);

  useEffect(() => {
    if (!mapRef.current || leafletMap.current) return;

    // @ts-ignore
    const L = window.L;
    if (!L) return;

    // Initialize map
    const map = L.map(mapRef.current, {
      zoomControl: false
    }).setView([50.0755, 14.4378], 12);
    
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Add light themed tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(map);

    leafletMap.current = map;

    setTimeout(() => {
      map.invalidateSize();
    }, 100);

    return () => {
      if (leafletMap.current) {
        leafletMap.current.remove();
        leafletMap.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const map = leafletMap.current;
    if (!map) return;
    
    // @ts-ignore
    const L = window.L;
    if (!L) return;

    // Clear existing markers
    map.eachLayer((layer: any) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    listings.forEach(listing => {
      const category = CATEGORIES.find(c => c.id === listing.category);
      const color = category?.color || '#4f46e5';

      // Logic for earliest availability
      let availabilityText = "Available Now";
      if (listing.availability && listing.availability.length > 0) {
        const sortedDates = [...listing.availability].sort();
        const earliest = new Date(sortedDates[0]);
        const today = new Date();
        if (earliest > today) {
          availabilityText = earliest.toLocaleDateString();
        }
      }

      const customIcon = L.divIcon({
        html: `<div class="map-marker-container">
                 <div class="map-marker-circle" style="border-color: ${color}">
                   <img src="${listing.images[0]}" alt="${listing.title}" />
                 </div>
               </div>`,
        className: 'custom-div-icon',
        iconSize: [48, 48],
        iconAnchor: [24, 24],
        popupAnchor: [0, -24]
      });

      const popupContent = `
        <div class="custom-popup">
          <div class="relative h-28 overflow-hidden">
            <img src="${listing.images[0]}" class="w-full h-full object-cover" />
            <div class="absolute bottom-2 left-2 flex gap-1">
               <span class="bg-white/90 backdrop-blur px-2 py-0.5 rounded text-[10px] font-black uppercase text-slate-800 shadow-sm">${listing.category}</span>
            </div>
          </div>
          <div class="p-4">
            <h4 class="font-black text-slate-900 leading-tight mb-2 text-sm">${listing.title}</h4>
            
            <div class="space-y-2 mb-4">
              <div class="flex items-center justify-between">
                <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Price</span>
                <span class="text-indigo-600 font-black text-sm">${listing.pricing.daily || listing.pricing.hourly} CZK</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Earliest Start</span>
                <span class="text-emerald-600 font-bold text-[11px]">${availabilityText}</span>
              </div>
            </div>

            <button 
               id="popup-btn-${listing.id}"
               class="w-full bg-slate-900 text-white text-[10px] font-black uppercase py-2.5 rounded-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
            >
               View Details
               <i class="fas fa-arrow-right"></i>
            </button>
          </div>
        </div>
      `;

      const marker = L.marker([listing.location.lat, listing.location.lng], {
        icon: customIcon
      }).addTo(map);

      marker.bindPopup(popupContent, { 
        className: 'custom-popup',
        closeButton: false,
        offset: [0, -10]
      });

      marker.on('popupopen', () => {
        const btn = document.getElementById(`popup-btn-${listing.id}`);
        if (btn) {
          btn.onclick = (e) => {
            e.stopPropagation();
            onSelectListing(listing.id);
          };
        }
      });
    });

    if (listings.length > 0) {
      const latLngs = listings.map(l => [l.location.lat, l.location.lng]);
      // @ts-ignore
      map.fitBounds(L.latLngBounds(latLngs).pad(0.3));
    }
  }, [listings, onSelectListing]);

  return (
    <div className="w-full h-[600px] relative rounded-[2.5rem] overflow-hidden shadow-2xl border border-white">
      <div ref={mapRef} className="w-full h-full" />
      
      {/* Legend Overlay */}
      <div className="absolute top-6 left-6 z-[1000] flex flex-col gap-2">
        <div className="bg-white/90 backdrop-blur p-4 rounded-3xl border border-white shadow-xl max-w-[180px]">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Categories</p>
          <div className="space-y-2">
            {CATEGORIES.map(cat => (
              <div key={cat.id} className="flex items-center gap-2.5 group">
                <div className="w-3 h-3 rounded-full shadow-sm ring-2 ring-white" style={{ backgroundColor: cat.color }}></div>
                <span className="text-[11px] font-bold text-slate-600">{cat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating UI info */}
      <div className="absolute bottom-6 left-6 z-[1000] hidden md:block">
        <div className="bg-slate-900/80 backdrop-blur-md text-white px-5 py-3 rounded-2xl border border-white/10 shadow-2xl">
          <p className="text-xs font-medium opacity-80">Click on an item image to see rental details</p>
        </div>
      </div>
    </div>
  );
};

export default MapView;
