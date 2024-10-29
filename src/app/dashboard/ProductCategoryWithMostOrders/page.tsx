"use client"; // Mark this file as a Client Component

import { useEffect, useState } from 'react';
import { BarChart } from '@mui/x-charts/BarChart'; // Ensure you have this import
import CircularProgress from '@mui/material/CircularProgress'; // Import CircularProgress

// Define the type for category order data
type CategoryOrderData = {
  categoryName: string;
  orderCount: number;
};

const ProductCategoryWithMostOrders = () => {
  const [data, setData] = useState<CategoryOrderData[]>([]); // Array of categories
  const [connectionStatus, setConnectionStatus] = useState(''); // Connection status
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/ProductCategoryWithMostOrders');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const result = await response.json();
        console.log('Fetched data:', result); // Debugging log

        // Normalize the data
        const normalizedData = result.data[0].map((item: any) => ({
          categoryName: item.CategoryName,
          orderCount: item.OrderCount,
        }));

        setData(normalizedData); // Update the state with normalized data
        setConnectionStatus(result.connectionStatus || 'Connected'); // Handle the connection status
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch data');
        setConnectionStatus('Disconnected');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  console.log('State data:', data); // Debugging log

  // Prepare data for the BarChart
  const chartData = data.map(category => ({
    categoryName: category.categoryName,
    orderCount: category.orderCount,
  }));

  // Bar chart settings
  const chartSetting = {
    yAxis: [
      {
        label: 'Order Count',
      },
    ],
    series: [{ dataKey: 'orderCount', label: 'Orders' }],
    height: 450,
    sx: {
      '& .MuiAxis-label': {
        transform: 'translateX(-10px)',
      },
    },
  };

  return (
    <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-5xl font-bold text-center mb-4 text-gray-700">Most Ordered Product Categories</h1>

      {loading ? (
        <div className="flex justify-center items-center h-48">
          <CircularProgress />
        </div>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : data.length > 0 ? (
        <div className="mb-6">
          <BarChart
            dataset={chartData}
            xAxis={[{ scaleType: 'band', dataKey: 'categoryName' }]}
            {...chartSetting}
          />
        </div>
      ) : (
        <p className="text-center text-gray-500">No data available</p>
      )}
    </div>
  );
};

export default ProductCategoryWithMostOrders;
