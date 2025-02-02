import React from 'react';

interface NavBarProps {
  activeTab: 'book' | 'myReservations' | 'login';
  onTabChange: (tab: 'book' | 'myReservations' | 'login') => void;
  isLoggedIn: boolean;
}

export const NavBar: React.FC<NavBarProps> = ({ 
  activeTab, 
  onTabChange,
  isLoggedIn 
}) => {
  return (
    <div className="mb-6 flex space-x-4 border-b">
      <button
        className={`py-2 px-4 ${
          activeTab === 'book' 
            ? 'border-b-2 border-blue-500 text-blue-600' 
            : 'text-gray-500 hover:text-gray-700'
        }`}
        onClick={() => onTabChange('book')}
      >
        Book a Room
      </button>
      {isLoggedIn ? (
        <button
          className={`py-2 px-4 ${
            activeTab === 'myReservations' 
              ? 'border-b-2 border-blue-500 text-blue-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => onTabChange('myReservations')}
        >
          My Reservations
        </button>
      ) : (
        <button
          className={`py-2 px-4 ${
            activeTab === 'login' 
              ? 'border-b-2 border-blue-500 text-blue-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => onTabChange('login')}
        >
          Sign In
        </button>
      )}
    </div>
  );
}; 