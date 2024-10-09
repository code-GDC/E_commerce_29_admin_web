"use client"; // Mark this file as a Client Component

import { useEffect, useState } from 'react';
import { BarChart } from '@mui/x-charts/BarChart'; // Ensure you have this import
import { axisClasses } from '@mui/x-charts/ChartsAxis';

// Define the type for category order data
type CategoryOrderData = {
  categoryName: string;
  orderCount: number;
};

const ProductCategoryWithMostOrders = () => {
  const [data, setData] = useState<CategoryOrderData[]>([]); // Array of categories
  const [connectionStatus, setConnectionStatus] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/ProductCategoryWithMostOrders');
        const result = await response.json();
        setData(result.data); // Access the data property from the result
        setConnectionStatus(result.connectionStatus || 'Connected'); // Handle the connection status
      } catch (error) {
        console.error('Error fetching data:', error);
        setConnectionStatus('Disconnected');
      }
    };

    fetchData();
  }, []);

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
      <div className="text-center mb-6">
        
      </div>

      {/* Bar Chart */}
      {data.length > 0 ? (
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

      {/* List of Categories */}
      
    </div>
  );
};

export default ProductCategoryWithMostOrders;
