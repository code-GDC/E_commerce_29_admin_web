import { ReactElement } from 'react';

import React from 'react';
import 'tailwindcss/tailwind.css';

const Dashboard = (): ReactElement => {
    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-4">Advanced Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-2">Sales Report</h2>
                    <p className="text-gray-700">Detailed sales report for the current month.</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-2">User Activity</h2>
                    <p className="text-gray-700">Overview of user activity and engagement.</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-2">Inventory Status</h2>
                    <p className="text-gray-700">Current status of inventory and stock levels.</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;