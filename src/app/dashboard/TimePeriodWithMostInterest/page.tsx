// src/app/dashboard/TimePeriodWithMostInterest/page.tsx

"use client";

import { useState, useEffect, useRef } from 'react';
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface Product {
  ProductID: string;
  Title: string;
}

interface InterestData {
  labels: string[];
  datasets: any[];
}

export default function ProductInterestByTimePeriod() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');  // Initialized as an empty string
  const [interestData, setInterestData] = useState<InterestData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mostInterestedPeriod, setMostInterestedPeriod] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const suggestionsRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const fetchProductTitles = async () => {
      setLoading(true);
      setError(null);
      console.log('Fetching products for search term:', searchTerm);

      try {
        const response = await fetch(`/api/ProductTitles?search=${searchTerm}`);
        const data = await response.json();
        console.log('Product titles fetched:', data);

        if (Array.isArray(data.products) && data.products.length > 0) {
          setProducts(data.products);
          setShowSuggestions(true);
        } else {
          setProducts([]);
          setShowSuggestions(false);
        }
      } catch (error) {
        console.error("Error fetching product titles:", error);
        setError("Failed to fetch product titles.");
      } finally {
        setLoading(false);
      }
    };

    // Ensure that searchTerm is a string and check its length
    if (typeof searchTerm === 'string' && searchTerm.length > 0) {
      fetchProductTitles();
    } else {
      setProducts([]);
    }
  }, [searchTerm]);

  useEffect(() => {
    if (!selectedProduct) return;

    const fetchInterestData = async () => {
      setLoading(true);
      setError(null);
      console.log('Fetching interest data for product ID:', selectedProduct);

      try {
        const response = await fetch(`/api/ProductInterest?productId=${selectedProduct}`);
        const data = await response.json();
        console.log('Interest data fetched:', data);

        if (response.ok) {
          const labels = data.data.map((item: { timePeriod: string }) => item.timePeriod);
          const interestValues = data.data.map((item: { interest: number }) => item.interest);

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
        console.error("Error fetching interest data:", error);
        setError("Failed to fetch interest data.");
      } finally {
        setLoading(false);
      }
    };

    fetchInterestData();
  }, [selectedProduct]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setShowSuggestions(true);
  };

  const handleProductSelect = (productTitle: string, productId: string) => {
    setSearchTerm(productTitle);
    setSelectedProduct(productId);
    setShowSuggestions(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
      setShowSuggestions(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="min-h-screen w-full bg-gray-900 text-gray-800 flex items-center justify-center flex-col">
      <div className="bg-white rounded-lg shadow p-6 w-3/4">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 text-center">Product Interest Over Time</h2>

        <div className="mb-4 relative">
          <input
            type="text"
            placeholder="Search for a product"
            className="px-4 py-2 w-full rounded border border-gray-300"
            value={searchTerm}
            onChange={handleSearchChange}
          />

            {showSuggestions && products.length > 0 && (
            <ul ref={suggestionsRef} className="absolute z-10 w-full text-gray-800 bg-white border border-gray-300 rounded mt-1 max-h-60 overflow-y-auto">
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

          {showSuggestions && products.length === 0 && !loading && (
            <p className="absolute z-10 w-full text-gray-500 text-center mt-1">No products found</p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-4 w-full flex flex-col items-center justify-center">
          {loading && <p>Loading data...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {interestData && <Line data={interestData} />}
        </div>

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
