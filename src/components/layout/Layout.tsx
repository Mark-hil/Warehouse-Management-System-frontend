import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useUI } from '../../context/UIContext';

const Layout: React.FC = () => {
  const { state: { sidebarOpen } } = useUI();

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className={`flex-1 transition-all duration-300 ${
        sidebarOpen ? 'lg:ml-64' : ''
      }`}>
        <Header />
        
        <main className="p-6 mt-16 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;