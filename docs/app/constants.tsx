
import React from 'react';

export const CATEGORIES = [
  { id: 'tools', label: 'Nářadí', icon: <i className="fas fa-hammer"></i>, color: '#6366f1' }, 
  { id: 'electronics', label: 'Elektronika', icon: <i className="fas fa-laptop"></i>, color: '#f59e0b' }, 
  { id: 'outdoor', label: 'Outdoor', icon: <i className="fas fa-mountain"></i>, color: '#10b981' }, 
  { id: 'party', label: 'Párty', icon: <i className="fas fa-cocktail"></i>, color: '#ec4899' }, 
  { id: 'garden', label: 'Zahrada', icon: <i className="fas fa-seedling"></i>, color: '#84cc16' }, 
];

export const MOCK_USER: any = {
  id: 'user-1',
  name: 'Jakub Novák',
  email: 'jakub@sdilejto.cz',
  isVerified: true,
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&h=200&auto=format&fit=crop'
};

const getFutureDate = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
};

const getPastDate = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
};

export const MOCK_LISTINGS: any[] = [
  {
    id: 'l-1',
    ownerId: 'user-2',
    title: 'Profesionální sada vrtaček',
    description: 'Vrtačka DeWalt 20V Max XR, obsahuje 2 baterie a nabíječku. Ideální pro domácí rekonstrukce.',
    category: 'tools',
    pricing: { daily: 300 },
    deposit: 2000,
    location: { lat: 50.0755, lng: 14.4378, address: 'Praha 1, Můstek' },
    images: ['https://images.unsplash.com/photo-1581147036324-c17ac41dfa6c?q=80&w=1000&auto=format&fit=crop'],
    availability: [getFutureDate(1), getFutureDate(2)],
    createdAt: getPastDate(10)
  },
  {
    id: 'l-2',
    ownerId: 'user-1',
    title: 'Dron DJI Mini 3 Pro',
    description: 'Extrémně lehký a skládací dron s 4K/60fps videem. Dodáváno se 3 bateriemi a ND filtry.',
    category: 'electronics',
    pricing: { daily: 800 },
    deposit: 10000,
    location: { lat: 50.1018, lng: 14.4502, address: 'Praha 7, Holešovice' },
    images: ['https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?q=80&w=1000&auto=format&fit=crop'],
    availability: [getFutureDate(0)],
    createdAt: getPastDate(2)
  },
  {
    id: 'l-3',
    ownerId: 'user-3',
    title: 'JBL PartyBox 310',
    description: 'Výkonný přenosný párty reproduktor se světelnými efekty a hlubokými basy. Skvělé pro oslavy.',
    category: 'party',
    pricing: { daily: 600 },
    deposit: 5000,
    location: { lat: 50.0521, lng: 14.4308, address: 'Praha 4, Pankrác' },
    images: ['https://images.unsplash.com/photo-1545454675-3531b543be5d?q=80&w=1000&auto=format&fit=crop'],
    availability: [getFutureDate(5)],
    createdAt: getPastDate(15)
  },
  {
    id: 'l-4',
    ownerId: 'user-4',
    title: 'Horský stan pro 3 osoby',
    description: 'Husky Fighter 3-4. Stan z řady extreme, ideální do vysokohorského terénu a sněhu.',
    category: 'outdoor',
    pricing: { daily: 250 },
    deposit: 2500,
    location: { lat: 50.1118, lng: 14.4902, address: 'Praha 9, Vysočany' },
    images: ['https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=1000&auto=format&fit=crop'],
    availability: [getFutureDate(1)],
    createdAt: getPastDate(1)
  },
  {
    id: 'l-5',
    ownerId: 'user-5',
    title: 'Sekačka Bosch Rotak 32',
    description: 'Kompaktní a výkonná elektrická sekačka pro malé a střední zahrady.',
    category: 'garden',
    pricing: { daily: 350 },
    deposit: 1500,
    location: { lat: 50.1015, lng: 14.3562, address: 'Praha 6, Dejvice' },
    images: ['https://images.unsplash.com/photo-1592419044706-39796d40f98c?q=80&w=1000&auto=format&fit=crop'],
    availability: [getFutureDate(2)],
    createdAt: getPastDate(30)
  },
  {
    id: 'l-6',
    ownerId: 'user-2',
    title: 'Kávovar DeLonghi Espresso',
    description: 'Pákový kávovar. Připraví kávu jako v kavárně přímo u vás doma.',
    category: 'electronics',
    pricing: { daily: 400 },
    deposit: 4000,
    location: { lat: 50.0763, lng: 14.4182, address: 'Praha 2, Vinohrady' },
    images: ['https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?q=80&w=1000&auto=format&fit=crop'],
    availability: [getFutureDate(0)],
    createdAt: getPastDate(5)
  },
  {
    id: 'l-7',
    ownerId: 'user-6',
    title: 'Nafukovací paddleboard set',
    description: 'Kompletní SUP set: board, pádlo, pumpa a přepravní vak.',
    category: 'outdoor',
    pricing: { daily: 500 },
    deposit: 3000,
    location: { lat: 50.0384, lng: 14.4057, address: 'Praha 5, Smíchov' },
    images: ['https://images.unsplash.com/photo-1520116468816-95b69f847357?q=80&w=1000&auto=format&fit=crop'],
    availability: [getFutureDate(10)],
    createdAt: getPastDate(3)
  },
  {
    id: 'l-8',
    ownerId: 'user-7',
    title: 'Okružní pila Makita',
    description: 'Vysoce výkonná kotoučová pila s 190mm kotoučem.',
    category: 'tools',
    pricing: { daily: 250 },
    deposit: 2500,
    location: { lat: 50.1264, lng: 14.4719, address: 'Praha 8, Kobylisy' },
    images: ['https://images.unsplash.com/photo-1502444330042-d1a1ddf9bb5b?q=80&w=1000&auto=format&fit=crop'],
    availability: [getFutureDate(1)],
    createdAt: getPastDate(20)
  },
  {
    id: 'l-9',
    ownerId: 'user-8',
    title: 'Projektor Epson 4K',
    description: 'Domácí kino projektor s 4K rozlišením.',
    category: 'electronics',
    pricing: { daily: 700 },
    deposit: 8000,
    location: { lat: 50.0632, lng: 14.5204, address: 'Praha 10, Strašnice' },
    images: ['https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=1000&auto=format&fit=crop'],
    availability: [getFutureDate(0)],
    createdAt: getPastDate(8)
  },
  {
    id: 'l-10',
    ownerId: 'user-4',
    title: 'Snowboard Nitro Prime 155',
    description: 'All-mountain snowboard včetně vázání. Velikost 155cm.',
    category: 'outdoor',
    pricing: { daily: 450 },
    deposit: 4000,
    location: { lat: 50.12, lng: 14.5, address: 'Praha 9, Prosek' },
    images: ['https://images.unsplash.com/photo-1520627977056-c307aeb9a625?q=80&w=1000&auto=format&fit=crop'],
    availability: [getFutureDate(2)],
    createdAt: getPastDate(4)
  },
  {
    id: 'l-11',
    ownerId: 'user-3',
    title: 'Elektrická kytara Fender Strat',
    description: 'Krásná kytara Fender Stratocaster. Součástí je malé 15W kombo.',
    category: 'electronics',
    pricing: { daily: 350 },
    deposit: 6000,
    location: { lat: 50.08, lng: 14.42, address: 'Praha 1, Staré Město' },
    images: ['https://images.unsplash.com/photo-1550291652-6ea9114a47b1?q=80&w=1000&auto=format&fit=crop'],
    availability: [getFutureDate(7)],
    createdAt: getPastDate(25)
  },
  {
    id: 'l-12',
    ownerId: 'user-5',
    title: 'Vysokotlaký čistič Karcher',
    description: 'Karcher K4 Full Control. Skvělý na mytí aut a teras.',
    category: 'garden',
    pricing: { daily: 400 },
    deposit: 2000,
    location: { lat: 50.06, lng: 14.38, address: 'Praha 5, Košíře' },
    images: ['https://images.unsplash.com/photo-1592365559101-19adfefdf294?q=80&w=1000&auto=format&fit=crop'],
    availability: [getFutureDate(3)],
    createdAt: getPastDate(12)
  }
];
