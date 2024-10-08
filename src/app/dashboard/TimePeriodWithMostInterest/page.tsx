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

// Register required components for Chart.js
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

export default function ProductInterestByTimePeriod() {
  interface Product {
    ProductID: string;
    Title: string;
  }

  const [products, setProducts] = useState<Product[]>([]); // Initialize as an empty array
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]); // Initialize as an empty array
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [interestData, setInterestData] = useState<{ labels: string[]; datasets: any[] } | null>(null);
  const [period, setPeriod] = useState('year'); // Default period
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
        setProducts(data.products || []); // Ensure the products data is an array
        setFilteredProducts(data.products || []); // Start with all products
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
                backgroundColor: '#4ADE80',
                borderColor: '#22C55E',
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

  // Handle input change in the search bar
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = event.target.value.toLowerCase();
    setSearchTerm(searchValue);

    // Ensure products is an array before filtering
    if (Array.isArray(products)) {
      const filtered = products.filter((product) =>
        product.Title.toLowerCase().includes(searchValue)
      );
      setFilteredProducts(filtered);
    }

    // Show suggestions if search term is not empty
    setShowSuggestions(searchValue.length > 0);
  };

  // Handle selecting a product from the suggestions
  const handleProductSelect = (productTitle: string, productId: string) => {
    setSearchTerm(productTitle);
    setSelectedProduct(productId);
    setShowSuggestions(false); // Hide suggestions after selection
  };

  return (
    <div className="min-h-screen w-full bg-gray-900  text-gray-800 flex items-center justify-center flex-col">
      <div className="bg-white rounded-lg shadow p-6 w-3/4">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 text-center">Product Interest by Time Period</h2>

        {/* Search bar */}
        <div className="mb-4 relative">
          <input
            type="text"
            placeholder="Search for a product"
            className="px-4 py-2 w-full rounded border border-gray-300"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          
          {/* Suggestions dropdown */}
          {showSuggestions && Array.isArray(filteredProducts) && filteredProducts.length > 0 && (
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

        {/* Time period selection */}
        <div className="mb-4">
          <label htmlFor="period" className="mr-2 text-gray-800">Select Time Period:</label>
          <select
            id="period"
            className="px-4 py-2 rounded border border-gray-300"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
          >
            <option value="year">Year</option>
            <option value="week">Week</option>
            {/* Add more options as needed */}
          </select>
        </div>

        {/* Chart for product interest */}
        <div className="bg-white rounded-lg shadow p-4 w-full flex flex-col items-center justify-center">
          {loading && <p>Loading data...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {interestData && <Bar data={interestData} />}
        </div>
      </div>
    </div>
  );
}
