// components/MostSoldProducts.tsx
"use client";

import { useState } from 'react';
import { LineChart } from '@mui/x-charts/LineChart';

type ProductSalesData = {
  productName: string;
  month: string; // Month in 'YYYY-MM' format
  totalQuantitySold: number;
};

const MostSoldProducts = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [products, setProducts] = useState<ProductSalesData[]>([]);
  const [error, setError] = useState('');

  const fetchMostSoldProducts = async () => {
    setError('');
    if (!startDate || !endDate) {
      setError('Please provide both start and end dates.');
      return;
    }

    try {
      const response = await fetch(`/api/ProductsWithMostNumberOfSales?startDate=${startDate}&endDate=${endDate}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }
      const data = await response.json();
      setProducts(data.data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
    }
  };

  // Prepare data for the chart and total quantity for the product list
  const productTotals: Record<string, number> = {};
  const chartData = products.reduce((acc, product) => {
    // Aggregate total quantity sold for each product
    productTotals[product.productName] = (productTotals[product.productName] || 0) + product.totalQuantitySold;

    // Prepare chart data
    const existing = acc.find(item => item.label === product.productName);
    if (existing) {
      existing.data.push(product.totalQuantitySold);
    } else {
      acc.push({
        label: product.productName,
        data: [product.totalQuantitySold]
      });
    }
    return acc;
  }, [] as { label: string; data: number[] }[]);

  // Prepare xLabels as an array of months for the x-axis
  const xLabels = Array.from(new Set(products.map(product => product.month)));

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gradient-to-r from-white-100 to-gray-300 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Most Sold Products</h1>
      <div className="flex flex-col sm:flex-row sm:justify-between mb-4">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="p-2 border border-gray-300 rounded shadow focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2 sm:mb-0"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="p-2 border border-gray-300 rounded shadow focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2 sm:mb-0"
        />
        <button
          onClick={fetchMostSoldProducts}
          className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700 transition duration-200 shadow-md"
        >
          Fetch Products
        </button>
      </div>

      {error && <p className="text-red-500 text-center">{error}</p>}

      {products.length > 0 && (
        <>
          <ul className="mt-4 border-t border-gray-300">
            {Object.entries(productTotals).map(([productName, totalSold]) => (
              <li key={productName} className="flex justify-between py-3 border-b border-gray-200">
                <span className="font-semibold text-gray-800">{productName}</span>
                <span className="text-gray-600">{totalSold} sold</span> {/* Correct total quantity displayed */}
              </li>
            ))}
          </ul>

          {/* Render the LineChart here */}
          <LineChart
            width={750}
            height={450}
            series={chartData} // Ensure this is the correct type for LineChart
            xAxis={[{ scaleType: 'point', data: xLabels }]} // Use unique month labels for x-axis
          />
        </>
      )}
    </div>
  );
};

export default MostSoldProducts;
