
import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ListingDetail from './pages/ListingDetail';
import Dashboard from './pages/Dashboard';
import CreateListing from './pages/CreateListing';
import Profile from './pages/Profile';
import { MOCK_USER, MOCK_LISTINGS } from './constants';
import { User, Listing } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState('home');
  const [selectedListingId, setSelectedListingId] = useState<string | null>(null);
  const [user, setUser] = useState<User>(MOCK_USER);

  const navigateTo = (view: string) => {
    setCurrentView(view);
    setSelectedListingId(null);
  };

  const handleSelectListing = (id: string) => {
    setSelectedListingId(id);
    setCurrentView('detail');
  };

  const handleBook = (data: any) => {
    alert(`Rezervace pro ${data.listingId} byla vyžádána. Přesměrovávám k platbě...`);
    setCurrentView('dashboard');
  };

  const handlePublish = (data: any) => {
    alert("Inzerát byl úspěšně publikován!");
    setCurrentView('home');
  };

  const renderContent = () => {
    switch (currentView) {
      case 'home':
        return <Home onSelectListing={handleSelectListing} />;
      case 'detail':
        const listing = MOCK_LISTINGS.find(l => l.id === selectedListingId);
        return listing ? (
          <ListingDetail 
            listing={listing} 
            onBack={() => setCurrentView('home')} 
            onBook={handleBook}
          />
        ) : <Home onSelectListing={handleSelectListing} />;
      case 'dashboard':
        return <Dashboard />;
      case 'create':
        return <CreateListing onCancel={() => setCurrentView('home')} onSubmit={handlePublish} />;
      case 'profile':
        return <Profile user={user} onVerify={() => {
          setUser({...user, isVerified: true});
          alert("Identita byla úspěšně ověřena přes BankID!");
        }} />;
      default:
        return <Home onSelectListing={handleSelectListing} />;
    }
  };

  return (
    <div className="min-h-screen pb-20">
      <Navbar user={user} onNavigate={navigateTo} />
      <main>
        {renderContent()}
      </main>

      {/* Mobile Sticky CTA */}
      {currentView === 'home' && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 md:hidden z-50">
          <button 
            onClick={() => setCurrentView('create')}
            className="bg-indigo-600 text-white px-8 py-4 rounded-full font-bold shadow-2xl flex items-center gap-2 border-2 border-white/20 backdrop-blur"
          >
            <i className="fas fa-plus"></i>
            Nabídnout věc
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
