
import React from 'react';
import { User } from '../types';

interface ProfileProps {
  user: User;
  onVerify: () => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onVerify }) => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="h-32 bg-indigo-600"></div>
        <div className="px-8 pb-8">
          <div className="relative -mt-16 mb-6">
            <img 
              src={user.avatar} 
              className="w-32 h-32 rounded-3xl border-4 border-white shadow-xl" 
              alt={user.name} 
            />
            {user.isVerified && (
              <div className="absolute bottom-2 right-2 bg-blue-500 text-white w-8 h-8 rounded-full border-2 border-white flex items-center justify-center shadow-lg">
                <i className="fas fa-check text-sm"></i>
              </div>
            )}
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <h1 className="text-3xl font-black text-slate-900">{user.name}</h1>
              <p className="text-slate-500 font-medium">{user.email}</p>
            </div>
            {!user.isVerified ? (
              <button 
                onClick={onVerify}
                className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all"
              >
                <i className="fas fa-id-card"></i> Ověřit přes BankID
              </button>
            ) : (
              <div className="bg-green-50 text-green-700 px-4 py-2 rounded-xl border border-green-100 flex items-center gap-2 font-bold text-sm">
                <i className="fas fa-shield-check"></i> Identita ověřena
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4 border-t border-slate-100 pt-8">
            <div className="text-center">
              <p className="text-2xl font-black text-slate-900">4.9</p>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Hodnocení</p>
            </div>
            <div className="text-center border-x border-slate-100">
              <p className="text-2xl font-black text-slate-900">14</p>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Výpůjček</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-black text-slate-900">3</p>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Inzeráty</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 space-y-4">
        <h3 className="text-xl font-bold text-slate-900 px-2">Nastavení účtu</h3>
        <div className="bg-white rounded-2xl border border-slate-100 divide-y divide-slate-100 overflow-hidden">
          <div className="p-4 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500">
                <i className="fas fa-credit-card"></i>
              </div>
              <div>
                <p className="font-bold text-slate-800">Platební metody</p>
                <p className="text-xs text-slate-400">Správa karet a bankovních účtů</p>
              </div>
            </div>
            <i className="fas fa-chevron-right text-slate-300"></i>
          </div>
          <div className="p-4 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500">
                <i className="fas fa-bell"></i>
              </div>
              <div>
                <p className="font-bold text-slate-800">Upozornění</p>
                <p className="text-xs text-slate-400">Nastavení notifikací a zpráv</p>
              </div>
            </div>
            <i className="fas fa-chevron-right text-slate-300"></i>
          </div>
          <div className="p-4 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition-colors text-red-500">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
                <i className="fas fa-sign-out-alt"></i>
              </div>
              <p className="font-bold">Odhlásit se</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
