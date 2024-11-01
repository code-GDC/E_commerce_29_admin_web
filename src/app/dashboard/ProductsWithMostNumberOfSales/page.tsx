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

  // Calculate total quantities sold for each product
  const productTotals: { [key: string]: number } = {};
  products.forEach(product => {
    if (productTotals[product.productName]) {
      productTotals[product.productName] += product.totalQuantitySold;
    } else {
      productTotals[product.productName] = product.totalQuantitySold;
    }
  });

  // Prepare the chart data and x-axis labels (months)
  const chartData: { label: string; data: number[] }[] = [];
  const xLabels = Array.from(new Set(products.map(product => product.month))); // Extract unique months for x-axis

  // Organize data by product and month
  products.forEach(product => {
    const existingProduct = chartData.find(item => item.label === product.productName);
    if (existingProduct) {
      // Find the correct position of the month in the xLabels array and set the data accordingly
      const monthIndex = xLabels.indexOf(product.month);
      existingProduct.data[monthIndex] = product.totalQuantitySold;
    } else {
      // Initialize a new product with data array filled with 0s and set the current month's data
      const newProductData = new Array(xLabels.length).fill(0);
      const monthIndex = xLabels.indexOf(product.month);
      newProductData[monthIndex] = product.totalQuantitySold;

      chartData.push({
        label: product.productName,
        data: newProductData,
      });
    }
  });

  return (
    <div className="max-w-5xl mx-auto p-8 bg-gray-100 text-black rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-center mb-6">Most Sold Products</h1>
      <div className="flex flex-col sm:flex-row sm:justify-between mb-4">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="p-2 border border-gray-600 bg-gray-400 text-white rounded shadow focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2 sm:mb-0"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="p-2 border border-gray-600 bg-gray-400 text-white rounded shadow focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2 sm:mb-0"
        />
        <button
          onClick={fetchMostSoldProducts}
          className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700 transition duration-200 shadow-md"
        >
          Fetch Products
        </button>
      </div>

      {error && <p className="text-red-500 text-center">{error}</p>}

      {Object.entries(productTotals).length > 0 && (
        <>
          {/* Render the LineChart first */}
          <LineChart
            width={900}
            height={700}
            series={chartData.map((item) => ({
              label: item.label,
              data: item.data,
            }))}
            xAxis={[{ scaleType: 'point', data: xLabels }]}
          />

          {/* Render the product list below the chart */}
          <ul className="mt-4 border-t border-gray-600">
            {Object.keys(productTotals).sort().map(productName => (
              <li key={productName} className="py-3 border-b border-gray-600">
                <span className="font-semibold">{productName}</span> - Total Sold: {productTotals[productName]}
                <ul className="ml-4 mt-1 text-sm text-gray-700">
                  {products
                    .filter(product => product.productName === productName)
                    .map(product => (
                      <li key={`${product.productName}-${product.month}`}>
                        {product.month}: {product.totalQuantitySold} units
                      </li>
                    ))}
                </ul>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default MostSoldProducts;
