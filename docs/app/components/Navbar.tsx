
import React from 'react';
import { User } from '../types';

interface NavbarProps {
  user: User;
  onNavigate: (view: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onNavigate }) => {
  return (
    <nav className="sticky top-0 z-50 glass-effect border-b border-slate-200 px-4 py-3 flex items-center justify-between">
      <div 
        className="flex items-center gap-2 cursor-pointer" 
        onClick={() => onNavigate('home')}
      >
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
          <i className="fas fa-share-alt text-xl"></i>
        </div>
        <span className="text-2xl font-bold tracking-tight text-indigo-900">SdílejTo</span>
      </div>

      <div className="hidden md:flex items-center gap-8 text-slate-600 font-medium">
        <button onClick={() => onNavigate('home')} className="hover:text-indigo-600 transition-colors">Prozkoumat</button>
        <button onClick={() => onNavigate('dashboard')} className="hover:text-indigo-600 transition-colors">Přehled</button>
        <button onClick={() => onNavigate('create')} className="bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100">
          + Pronajmout věc
        </button>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-semibold text-slate-900">{user.name}</p>
          <div className="flex items-center justify-end gap-1">
            {user.isVerified && <i className="fas fa-check-circle text-blue-500 text-[10px]"></i>}
            <span className="text-[10px] text-slate-400 uppercase tracking-widest">Ověřeno</span>
          </div>
        </div>
        <img 
          src={user.avatar} 
          alt="Avatar" 
          className="w-10 h-10 rounded-full border-2 border-white shadow-sm cursor-pointer"
          onClick={() => onNavigate('profile')}
        />
      </div>
    </nav>
  );
};

export default Navbar;
