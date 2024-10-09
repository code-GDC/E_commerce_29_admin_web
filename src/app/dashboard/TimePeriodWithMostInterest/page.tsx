"use client";
import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register required components for Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
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
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [interestData, setInterestData] = useState<{ labels: string[]; datasets: any[] } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mostInterestedPeriod, setMostInterestedPeriod] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Fetch product titles from the backend (dynamic search)
  useEffect(() => {
    const fetchProductTitles = async () => {
      setLoading(true);
      setError(null); // Reset error before fetch
      try {
        const response = await fetch(`/api/ProductTitles?search=${searchTerm}`);
        const data = await response.json();
        console.log("Fetched Products:", data); // Log the entire fetched data

        // Check if 'products' is in data
        if (Array.isArray(data) && data.length) {
          setProducts(data); // Set the products directly if the API returns the array
        } else {
          setProducts([]); // Reset products if no valid array found
        }
      } catch (error) {
        console.error(error); // Log error details
        setError("Failed to fetch product titles.");
      } finally {
        setLoading(false);
      }
    };

    // Fetch only when there's a search term
    if (searchTerm.length > 0) {
      fetchProductTitles();
    } else {
      setProducts([]); // Clear products if search term is empty
    }
  }, [searchTerm]);

  // Fetch interest data for the selected product
  useEffect(() => {
    if (!selectedProduct) return;

    const fetchInterestData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/ProductInterest?productId=${selectedProduct}`);
        const data = await response.json();

        if (response.ok) {
          const labels = data.data.map((item: { timePeriod: string }) => item.timePeriod);
          const interestValues = data.data.map((item: { interest: number }) => item.interest);

          // Calculate the most interested time period
          const maxInterest = Math.max(...interestValues);
          const maxIndex = interestValues.indexOf(maxInterest);
          setMostInterestedPeriod(labels[maxIndex]);

          setInterestData({
            labels,
            datasets: [
              {
                label: 'Product Interest Over Time',
                backgroundColor: '#4ADE80',
                borderColor: '#22C55E',
                data: interestValues,
                fill: false,
                borderWidth: 2,
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
  }, [selectedProduct]);

  // Handle input change in the search bar
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setShowSuggestions(true);
  };

  // Handle selecting a product from the suggestions
  const handleProductSelect = (productTitle: string, productId: string) => {
    setSearchTerm(productTitle);
    setSelectedProduct(productId);
    setShowSuggestions(false); // Hide suggestions after selection
  };

  return (
    <div className="min-h-screen w-full bg-gray-900 text-gray-800 flex items-center justify-center flex-col">
      <div className="bg-white rounded-lg shadow p-6 w-3/4">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 text-center">Product Interest Over Time</h2>

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
          {showSuggestions && products.length > 0 && (
            <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded mt-1 max-h-60 overflow-y-auto">
              {products.map((product) => (
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

          {/* Message when no products found */}
          {showSuggestions && products.length === 0 && !loading && (
            <p className="absolute z-10 w-full text-gray-500 text-center mt-1">
              No products found
            </p>
          )}
        </div>

        {/* Chart for product interest */}
        <div className="bg-white rounded-lg shadow p-4 w-full flex flex-col items-center justify-center">
          {loading && <p>Loading data...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {interestData && <Line data={interestData} />}
        </div>

        {/* Most interested period */}
        {mostInterestedPeriod && (
          <div className="mt-4">
            <p className="text-xl font-semibold text-gray-800 text-center">
              Most Interested Time Period: {mostInterestedPeriod}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
