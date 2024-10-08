"use client";
import { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
} from 'chart.js';

// Register required components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

export default function SalesData() {
  const [selectedYear, setSelectedYear] = useState(2024); // Default year
  const [selectedCategory, setSelectedCategory] = useState('Electronics'); // Default category
  const [isAllTime, setIsAllTime] = useState(false); // Toggle for "All Time"
  const [isAllProducts, setIsAllProducts] = useState(false); // Toggle for "All Products"
  const [salesData, setSalesData] = useState<{ labels: string[]; datasets: { label: string; backgroundColor: string; borderColor: string; data: number[]; }[] } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch sales data from backend when year or category changes
  useEffect(() => {
    const fetchSalesData = async () => {
      setLoading(true);
      setError(null);

      // Construct the query parameters based on the selection
      let query = `/api/QuarterlySalesReport?`;
      if (!isAllTime) query += `year=${selectedYear}&`; // Include year unless "All Time" is selected
      if (!isAllProducts) query += `category=${selectedCategory}`; // Include category unless "All Products" is selected

      try {
        const response = await fetch(query);
        const data = await response.json();

        console.log("API Response:", data);

        if (response.ok) {
          const salesDataArray = Array(4).fill(0); // Default to 0 for all quarters

  // Populate the salesDataArray based on the API response
          data.sales.forEach((item: { quarter: string; sales: string }) => {
            const quarterIndex = parseInt(item.quarter.replace('Q', '')) - 1; // Convert Q1, Q2, ... to 0, 1, ...
            salesDataArray[quarterIndex] = parseInt(item.sales); // Ensure sales is a number
              });
          if (!data.sales || data.sales.length === 0) {
            setError("No sales data available for the selected filters.");
            return;
          }
          const formattedData = {
            labels: ['Q1', 'Q2', 'Q3', 'Q4'], // Assuming sales data is per quarter
            datasets: [
              {
                label: isAllProducts ? `All Products Sales in ${isAllTime ? "All Time" : selectedYear}` : `${selectedCategory} Sales in ${isAllTime ? "All Time" : selectedYear}`,
                backgroundColor: '#4ADE80',
                borderColor: '#22C55E',
                data: data.sales, // assuming 'data.sales' contains sales numbers
                
              },
            ],
          };

          setSalesData(formattedData);
        } else {
          setError(data.error);
        }
      } catch (error) {
        setError("Failed to fetch sales data.");
      } finally {
        setLoading(false);
      }
    };

    fetchSalesData();
  }, [selectedYear, selectedCategory, isAllTime, isAllProducts]);

  return (
    <div className="min-h-screen w-full bg-gray-900 flex items-center justify-center flex-col">
      {/* Year Selection */}
      <div className="mb-4 flex space-x-2">
        {[2020, 2021, 2022, 2023, 2024].map(year => (
          <button
            key={year}
            onClick={() => { 
              setSelectedYear(year); 
              setIsAllTime(false); // Reset "All Time" selection when a year is selected
            }}
            className={`px-4 py-2 rounded ${selectedYear === year && !isAllTime ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-800'}`}
          >
            {year}
          </button>
        ))}
        {/* "All Time" button */}
        <button
          onClick={() => setIsAllTime(true)}
          className={`px-4 py-2 rounded ${isAllTime ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-800'}`}
        >
          All Time
        </button>
      </div>

      {/* Category Selection */}
      <div className="mb-4 flex space-x-1">

        {['Electronics', 'Toys'].map(category => (
          <button
            key={category}
            onClick={() => {
              setSelectedCategory(category);
              setIsAllProducts(false); // Reset "All Products" selection when a specific category is selected
            }}
            className={`px-4 py-2 rounded ${selectedCategory === category && !isAllProducts ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
          >
            {category}
          </button>
        ))}
        {/* "All Products" button */}
        <button
          onClick={() => setIsAllProducts(true)}
          className={`px-4 py-2 rounded ${isAllProducts ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
        >
          All Products
        </button>
      </div>

      {/* Quarterly Sales Report */}
      <div className="bg-white rounded-lg shadow p-4 w-1/2 flex flex-col items-center justify-center">
        <h2 className="text-xl font-semibold mb-2 text-gray-800 text-center">
          {isAllProducts
            ? `All Products Sales Report for ${isAllTime ? "All Time" : selectedYear}`
            : `${selectedCategory} Sales Report for ${isAllTime ? "All Time" : selectedYear}`}
        </h2>
        <div className="w-96 h-[450px] flex items-center justify-center">
          {loading && <p>Loading data...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {salesData && <Bar data={salesData} />}
        </div>
      </div>
    </div>
  );
}
