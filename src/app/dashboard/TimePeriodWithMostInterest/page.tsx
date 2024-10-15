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
  const [interestData, setInterestData] = useState<InterestData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mostInterestedPeriod, setMostInterestedPeriod] = useState<string | null>(null);

  // Fetch all product titles
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/ProductTitles');
        if (!response.ok) throw new Error('Failed to fetch product titles.');
        const data = await response.json();
        setProducts(data.products || []);
      } catch (error) {
        setError('Failed to fetch product titles.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Fetch interest data for the selected product
  useEffect(() => {
    if (!selectedProduct) return;

    const fetchInterestData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/TimePeriodWithMostInterest?productId=${selectedProduct}`);
        if (!response.ok) throw new Error('Failed to fetch interest data.');
        const data = await response.json();

        if (data.data.length === 0) {
          setError('No interest data found for the selected product.');
          return;
        }

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
      } catch (error) {
        setError('Failed to fetch interest data.');
      } finally {
        setLoading(false);
      }
    };

    fetchInterestData();
  }, [selectedProduct]);

  const handleProductSelect = (productId: string) => {
    setSelectedProduct(productId);
  };

  return (
    <div className="min-h-screen w-full bg-gray-900 text-gray-800 flex items-center justify-center flex-col">
      <div className="bg-white rounded-lg shadow p-6 w-3/4">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 text-center">Product Interest Over Time</h2>

        <div className="mb-4">
          <select
            onChange={(e) => handleProductSelect(e.target.value)}
            className="px-4 py-2 w-full rounded border border-gray-300"
          >
            <option value="">Select a product</option>
            {products.map((product) => (
              <option key={product.ProductID} value={product.ProductID}>
                {product.Title}
              </option>
            ))}
          </select>
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
