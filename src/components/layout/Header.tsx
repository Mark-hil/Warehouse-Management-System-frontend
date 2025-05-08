import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, Menu, Moon, Sun, User } from 'lucide-react';
import { useUI } from '../../context/UIContext';
import { useAuth } from '../../context/AuthContext';

const Header: React.FC = () => {
  const { state: { theme, notifications }, toggleSidebar, toggleTheme, markNotificationRead } = useUI();
  const { state: { user } } = useAuth();
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [showUserMenu, setShowUserMenu] = React.useState(false);
  
  const notificationRef = React.useRef<HTMLDivElement>(null);
  const userMenuRef = React.useRef<HTMLDivElement>(null);
  
  const unreadNotifications = notifications.filter(notification => !notification.read);
  
  // Close dropdowns when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="fixed top-0 right-0 z-20 flex items-center justify-between w-full h-16 px-4 bg-white border-b border-gray-200 lg:pl-64">
      <div className="flex items-center">
        <button
          className="p-1 mr-4 text-gray-500 rounded-md lg:hidden hover:text-gray-700 hover:bg-gray-100"
          onClick={toggleSidebar}
        >
          <span className="sr-only">Open sidebar</span>
          <Menu size={24} />
        </button>
        
        <div className="hidden md:block">
          <h1 className="text-xl font-semibold text-gray-800">Warehouse Management System</h1>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <button
          className="p-1 text-gray-500 rounded-md hover:text-gray-700 hover:bg-gray-100"
          onClick={toggleTheme}
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
        
        <div className="relative" ref={notificationRef}>
          <button
            className="p-1 text-gray-500 rounded-md hover:text-gray-700 hover:bg-gray-100"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell size={20} />
            {unreadNotifications.length > 0 && (
              <span className="absolute top-0 right-0 flex items-center justify-center w-4 h-4 text-xs text-white bg-red-500 rounded-full">
                {unreadNotifications.length}
              </span>
            )}
          </button>
          
          {showNotifications && (
            <div className="absolute right-0 w-80 mt-2 bg-white rounded-md shadow-lg overflow-hidden z-50">
              <div className="p-3 border-b border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700">Notifications</h3>
              </div>
              
              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-4 text-sm text-gray-500 text-center">
                    No notifications
                  </div>
                ) : (
                  notifications.map(notification => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b border-gray-100 ${
                        !notification.read ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => markNotificationRead(notification.id)}
                    >
                      <div className="flex items-start">
                        <div className={`flex-shrink-0 w-2 h-2 mt-1 rounded-full ${
                          notification.type === 'info' ? 'bg-blue-500' :
                          notification.type === 'success' ? 'bg-green-500' :
                          notification.type === 'warning' ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}></div>
                        <div className="ml-3">
                          <p className="text-sm text-gray-800">{notification.message}</p>
                          <p className="mt-1 text-xs text-gray-500">
                            {new Date(notification.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              {notifications.length > 0 && (
                <div className="p-2 border-t border-gray-200">
                  <button
                    className="w-full px-4 py-2 text-xs text-blue-600 rounded-md hover:bg-blue-50"
                  >
                    Mark all as read
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="relative" ref={userMenuRef}>
          <button
            className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <span className="sr-only">Open user menu</span>
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
              <User size={16} />
            </div>
          </button>
          
          {showUserMenu && (
            <div className="absolute right-0 w-48 mt-2 bg-white rounded-md shadow-lg overflow-hidden z-50">
              <div className="p-3 border-b border-gray-200">
                <p className="text-sm font-semibold text-gray-700">{user?.firstName} {user?.lastName}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              
              <div className="py-1">
                <a
                  href="#profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Your Profile
                </a>
                <Link
                  to="/settings"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setShowUserMenu(false)}
                >
                  Settings
                </Link>
                <button
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;