"use client";
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { People, MonetizationOn, ShoppingCart } from '@mui/icons-material';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const DashboardPage: React.FC = () => {
    const [totalRevenue, setTotalRevenue] = useState<number | null>(null);
    const [userCount, setUserCount] = useState<number | null>(null);
    const [totalDeals, setTotalDeals] = useState<number | null>(null);  // New state for total deals

    useEffect(() => {
        // Fetch total revenue from API
        const fetchRevenue = async () => {
            try {
                const response = await fetch('/api/getRevenue');
                if (!response.ok) {
                    throw new Error('Failed to fetch revenue');
                }
                const data = await response.json();
                console.log('Fetched total revenue:', data);  // Debugging log
                setTotalRevenue(data.totalRevenue || 0);  // Set a fallback value if undefined
            } catch (error) {
                console.error('Failed to fetch total revenue:', error);
            }
        };
        

        // Fetch total user count from API
        const fetchUserCount = async () => {
            try {
                const response = await fetch('/api/getUserCount');
                const data = await response.json();
                console.log('Fetched user count:', data);  // Debugging log
                setUserCount(data.userCount);
            } catch (error) {
                console.error('Failed to fetch user count:', error);
            }
        };

        // Fetch total deals (order count) from API
        const fetchDeals = async () => {
            try {
                const response = await fetch('/api/getDeals');
                const data = await response.json();
                console.log('Fetched total deals:', data);  // Debugging log
                setTotalDeals(data.totalDeals);
            } catch (error) {
                console.error('Failed to fetch total deals:', error);
            }
        };

        fetchRevenue();  // Fetch revenue data
        fetchUserCount();  // Fetch user count data
        fetchDeals();  // Fetch total deals data
    }, []);

    const chartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
            {
                label: 'Top Gross',
                data: [50, 100, 150, 125, 175, 200, 150, 130, 140, 160, 170, 190],
                fill: false,
                borderColor: '#4bc0c0',
                tension: 0.4,  // Smooth curve
            },
            {
                label: 'First Half',
                data: [40, 90, 130, 100, 140, 160, 120, 110, 130, 150, 160, 180],
                fill: false,
                borderColor: '#565656',
                tension: 0.4,  // Smooth curve
            },
        ],
    };

    return (
        <div className="p-5 bg-gray-300 min-h-screen text-gray-950">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {/* Total Customers Card */}
                <div className="bg-teal-100 rounded-xl shadow-lg p-5">
                    <div className="flex items-center">
                        <People className="text-5xl text-teal-700" />
                        <div className="ml-4">
                            <h6 className="text-lg">Total Customers</h6>
                            <h4 className="text-2xl font-bold">{userCount !== null ? `${userCount}` : 'Loading...'}</h4>
                        </div>
                    </div>
                </div>

                {/* Total Revenue Card */}
                <div className="bg-green-100 rounded-xl shadow-lg p-5">
                <div className="flex items-center">
                    <MonetizationOn className="text-5xl text-green-600" />
                <div className="ml-4">
                <h6 className="text-lg">Total Revenue</h6>
                <h4 className="text-2xl font-bold">{totalRevenue !== null ? `Rs: ${totalRevenue}` : 'Loading...'}</h4>
                </div>
                </div>
                </div>


                {/* Total Deals Card */}
                <div className="bg-yellow-50 rounded-xl shadow-lg p-5">
                    <div className="flex items-center">
                        <ShoppingCart className="text-5xl text-yellow-700" />
                        <div className="ml-4">
                            <h6 className="text-lg">Total Deals</h6>
                            <h4 className="text-2xl font-bold">{totalDeals !== null ? `${totalDeals}` : 'Loading...'}</h4>  {/* Display Total Deals */}
                        </div>
                    </div>
                </div>

                {/* Earnings Chart */}
                <div className="col-span-1 sm:col-span-3 bg-white rounded-xl shadow-lg p-5">
                    <h6 className="text-lg mb-4">Earnings</h6>
                    <Line data={chartData} />
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
