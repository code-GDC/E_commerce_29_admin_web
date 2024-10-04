import React from 'react';
import Link from 'next/link';

const Sidebar = () => {
    const adminName = 'Admin Name'; // Replace with dynamic username if needed
    const adminPhoto = '/path-to-admin-photo.jpg'; // Replace with the actual photo path

    return (
        <div className="w-64 h-screen bg-gray-800 text-white p-6 shadow-lg flex flex-col justify-between">
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
            <ul className="space-y-4">
                <li className="flex justify-center">
                    <Link href="/dashboard/quarterly-sales">
                        <div className="bg-gray-700 p-4 rounded-lg shadow hover:bg-gray-600 transition-colors flex items-center justify-center">
                            <span className="font-medium" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                Quarterly Sales Report
                            </span>
                        </div>
                    </Link>
                </li>
                <li className="flex justify-center">
                    <Link href="/dashboard">
                        <div className="bg-gray-700 p-4 rounded-lg shadow hover:bg-gray-600 transition-colors flex items-center justify-center">
                            <span className="font-medium" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                Products with Most Sales
                            </span>
                        </div>
                    </Link>
                </li>
                <li className="flex justify-center">
                    <Link href="/dashboard/category-most-orders">
                        <div className="bg-gray-700 p-4 rounded-lg shadow hover:bg-gray-600 transition-colors flex items-center justify-center">
                            <span className="font-medium" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                Product Category with Most Orders
                            </span>
                        </div>
                    </Link>
                </li>
                <li className="flex justify-center">
                    <Link href="/dashboard/product-interest">
                        <div className="bg-gray-700 p-4 rounded-lg shadow hover:bg-gray-600 transition-colors flex items-center justify-center">
                            <span className="font-medium" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                Product Interest by Time Period
                            </span>
                        </div>
                    </Link>
                </li>
                <li className="flex justify-center">
                    <Link href="/dashboard/customer-orders">
                        <div className="bg-gray-700 p-4 rounded-lg shadow hover:bg-gray-600 transition-colors flex items-center justify-center">
                            <span className="font-medium" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                Customer-Order Report
                            </span>
                        </div>
                    </Link>
                </li>
            </ul>

            {/* SHOPZY Button */}
            <div className="mt-8 flex justify-center">
                <a
                    href="https://shopzy.com" // Update with actual SHOPZY website link
                    className="bg-blue-600 hover:bg-blue-500 text-white font-medium p-4 rounded-lg shadow transition-colors flex items-center justify-center w-full"
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                    Go to SHOPZY
                </a>
            </div>
        </div>
    );
};

export default Sidebar;
