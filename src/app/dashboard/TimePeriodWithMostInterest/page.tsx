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
} from 'chart.js';

// Register required components for Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function ProductInterestByTimePeriod() {
  interface Product {
    ProductID: string;
    Title: string;
  }

  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [interestData, setInterestData] = useState<{ labels: string[]; datasets: any[] } | null>(null);
  const [period, setPeriod] = useState('year');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Fetch product titles from the backend
  useEffect(() => {
    const fetchProductTitles = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/ProductTitles');
        const data = await response.json();
        setProducts(data.products || []);
        setFilteredProducts(data.products || []);
      } catch (error) {
        setError("Failed to fetch product titles.");
      } finally {
        setLoading(false);
      }
    };

    fetchProductTitles();
  }, []);

  // Fetch interest data for the selected product
  useEffect(() => {
    if (!selectedProduct) return;

    const fetchInterestData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/TimePeriodWithMostInterest?productId=${selectedProduct}&period=${period}`);
        const data = await response.json();

        if (response.ok) {
          const labels = data.data.map((item: { timePeriod: string }) => item.timePeriod);
          const interestValues = data.data.map((item: { interest: number }) => item.interest);

          setInterestData({
            labels,
            datasets: [
              {
                label: 'Product Interest',
                backgroundColor: '#42a5f5',
                borderColor: '#1D4ED8',
                data: interestValues,
              }
            ],
          });
        } else {
          setError(data.error);
        }
      } catch (error) {
        setError("Failed to fetch interest data.");
      } finally {
        setLoading(false);
      }
    };

    fetchInterestData();
  }, [selectedProduct, period]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = event.target.value.toLowerCase();
    setSearchTerm(searchValue);

    if (Array.isArray(products)) {
      const filtered = products.filter((product) =>
        product.Title && product.Title.toLowerCase().includes(searchValue)
      );
      setFilteredProducts(filtered);
    }

    setShowSuggestions(searchValue.length > 0);
  };

  const handleProductSelect = (productTitle: string, productId: string) => {
    setSearchTerm(productTitle);
    setSelectedProduct(productId);
    setShowSuggestions(false);
  };

  return (
    <div className="min-h-screen w-full bg-gray-900 text-gray-800 flex items-center justify-center flex-col">
      <div className="bg-white rounded-lg shadow p-6 w-3/4">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 text-center">Product Interest by Time Period</h2>

        <div className="mb-4 relative">
          <input
            type="text"
            placeholder="Search for a product"
            className="px-4 py-2 w-full rounded border border-gray-300"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          
          {showSuggestions && filteredProducts.length > 0 && (
            <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded mt-1 max-h-60 overflow-y-auto">
              {filteredProducts.map((product) => (
                <li
                  key={product.ProductID}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleProductSelect(product.Title, product.ProductID)}
                >
                  {product.Title}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mb-4 h-1/2">
          <label htmlFor="period" className="mr-2 text-gray-800">Select Time Period:</label>
          <select
            id="period"
            className="px-4 py-2 rounded border border-gray-300"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
          >
            <option value="year">Year</option>
            <option value="month">Month</option>
          </select>
        </div>

        <div className="bg-white rounded-lg shadow p-10 flex flex-col items-center justify-center">
          {loading && <p>Loading data...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {interestData && (
            <Bar 
              data={interestData} 
              options={{
                responsive: true,
                scales: {
                  x: { grid: { display: false } },
                  y: { grid: { display: false } },
                },
              }} 
              width={600} 
              height={300} 
            />
          )}
        </div>
      </div>
    </div>
  );
}
