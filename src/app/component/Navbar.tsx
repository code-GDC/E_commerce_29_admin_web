// components/TopBar.tsx
"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { MdLogout } from 'react-icons/md';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-hot-toast';

interface TopBarProps {
  adminImage: string;
}

const getAdminName = (): string => {
  if (typeof window === 'undefined') return 'Not Authorized';

  const adminData = localStorage.getItem('admin');
  console.log("🚀 ~ getAdminName ~ adminData:", adminData)
  if (!adminData) return 'Not Authorized';

  try {
    const decodedToken = jwt.decode(
      adminData
    ) as JwtPayload;
    console.log("🚀 ~ getAdminName ~ decodedToken:", decodedToken)

    return typeof decodedToken === 'object' && 'adminUserName' in decodedToken
      ? (decodedToken.adminUserName as string)
      : 'Not Authorized';
  } catch (error) {
    console.error('Invalid token', error);
    return 'Not Authorized';
  }
};

const TopBar: React.FC<TopBarProps> = ({ adminImage }) => {
  const [adminName, setAdminName] = useState<string>('Loading...');
  const router = useRouter();

  useEffect(() => {
    const name = getAdminName();
    setAdminName(name);
  }, []);

  const handleLogout = async () => {
    try {
      localStorage.removeItem('admin');
      await axios.post("/api/logout");
      toast.success("Logged out successfully");
      localStorage.setItem("isRegistered", "false");
      router.push("/");
    } catch (error: any) {
      toast.error("Failed to logout");
    }
  };

  return (
    <header className="text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center py-3 px-4 bg-black">
        <div className="flex items-center">
          <Image
            src="/shop.jpg"
            alt="Shopzy Logo"
            width={30}
            height={30}
            className="rounded-full"
          />
          <h1 className="text-2xl font-bold ml-3">Shopzy ADMIN</h1>
        </div>
        <div className="flex items-center space-x-3">

          <Image
            src="/admin.jpg"
            alt={adminName}
            width={30}
            height={30}
            className="rounded-full shadow-md"
          />

          <span className="text-md font-medium">{adminName}</span>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-1 border border-gray-700 rounded-md px-3 py-1 bg-gray-800 hover:bg-gray-700 transition-all duration-200"
          >
            <MdLogout className="w-5 h-5" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
