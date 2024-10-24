// components/TopBar.tsx
import React from 'react';
import Image from 'next/image';
import { MdLogout } from 'react-icons/md';

interface TopBarProps {
  adminName: string;
  adminImage: string;
}

const TopBar: React.FC<TopBarProps> = ({ adminName, adminImage }) => {
  return (
    <header className="text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center py-3 px-4  bg-black ">
        {/* Left section: Logo and title */}
        <div className="flex items-center">
          <Image src="/shop.jpg" alt="Shopzy Logo" width={30} height={30} className="rounded-full" />
          <h1 className="text-2xl font-bold ml-3">Shopzy</h1>
        </div>

        {/* Right section: Admin info and logout */}
        <div className="flex items-center space-x-3">
          <Image src={adminImage} alt={adminName} width={30} height={30} className="rounded-full shadow-md" />
          <span className="text-md font-medium">{adminName}</span>
          <button className="flex items-center space-x-1 border border-gray-700 rounded-md px-3 py-1 bg-gray-800 hover:bg-gray-700 transition-all duration-200">
            <MdLogout className="w-5 h-5" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
