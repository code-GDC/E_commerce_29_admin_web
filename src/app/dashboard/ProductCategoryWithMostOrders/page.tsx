"use client"; // Mark this file as a Client Component

import { useEffect, useState } from 'react';

type CategoryOrderData = {
  categoryName: string;
  orderCount: number;
};

const ProductCategoryWithMostOrders = () => {
  const [data, setData] = useState<CategoryOrderData | null>(null); // Set initial state as null
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

  return (
    <div>
      <h1>Most Ordered Product Category</h1>
      <p>Connection Status: {connectionStatus}</p>
      {data ? (
        <div>
          <h2>Category: {data.categoryName}</h2>
          <p>Order Count: {data.orderCount}</p>
        </div>
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
};

export default ProductCategoryWithMostOrders;
