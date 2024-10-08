import React from 'react';
import Link from 'next/link';

const Sidebar = () => {
    const adminName = 'Admin Name'; // Replace with dynamic username if needed
    const adminPhoto = '/path-to-admin-photo.jpg'; // Replace with the actual photo path

    return (
        <div className="text-white p-6 shadow-lg flex flex-col justify-between h-full max-h-screen">
            {/* Admin info section */}
            <div className="flex flex-col items-center mb-8">
                <img
                    src={adminPhoto}
                    alt="Admin"
                    className="w-16 h-16 rounded-full mb-4 shadow-lg"
                />
                <span className="font-semibold" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    {adminName}
                </span>
            </div>

            {/* Navigation Links */}
            <div className="overflow-y-auto h-[calc(100vh-200px)] scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 scrollbar-thumb-rounded-full scrollbar-track-rounded-full">
                <ul className="space-y-4">
                    <li className="flex justify-center">
                        <Link href="/dashboard/QuarterlySalesReport">
                            <div className="bg-gray-700 p-4 rounded-lg shadow hover:bg-gray-600 transition-colors flex text-center items-center justify-center">
                                Quarterly Sales Report
                            </div>
                        </Link>
                    </li>
                    <li className="flex justify-center">
                        <Link href="/dashboard">
                            <div className="bg-gray-700 p-4 rounded-lg shadow hover:bg-gray-600 transition-colors flex items-center justify-center">
                                <span className="font-medium text-center" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                    Products with Most Sales
                                </span>
                            </div>
                        </Link>
                    </li>
                    <li className="flex justify-center">
                        <Link href="/dashboard/category-most-orders">
                            <div className="bg-gray-700 p-4 rounded-lg shadow hover:bg-gray-600 transition-colors flex items-center justify-center">
                                <span className="font-medium text-center" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                    Product Category with Most Orders
                                </span>
                            </div>
                        </Link>
                    </li>
                    <li className="flex justify-center">
                        <Link href="/dashboard/TimePeriodWithMostInterest">
                            <div className="bg-gray-700 p-4 rounded-lg shadow hover:bg-gray-600 transition-colors flex items-center justify-center">
                                <span className="font-medium text-center" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                    Product Interest by Time Period
                                </span>
                            </div>
                        </Link>
                    </li>
                    <li className="flex justify-center">
                        <Link href="/dashboard/CustomerOrderReport">
                            <div className="bg-gray-700 p-4 rounded-lg shadow hover:bg-gray-600 transition-colors flex items-center justify-center">
                                <span className="font-medium text-center" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                    Customer-Order Report
                                </span>
                            </div>
                        </Link>
                    </li>
                </ul>
            </div>

            {/* SHOPZY Button */}
            <div className="mt-8 flex justify-center">
                <a
                    href="https://shopzy.com" // Update with actual SHOPZY website link
                    className="bg-blue-600 hover:bg-blue-500 text-white font-medium p-4 rounded-lg shadow transition-colors flex items-center text-center justify-center w-full"
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                    Go to SHOPZY
                </a>
            </div>
        </div>
    );
};

export default Sidebar;
