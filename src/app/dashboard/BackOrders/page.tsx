"use client";
import { useState, useEffect } from 'react';

interface BackOrder {
  VariantID: number;
  VariantName: string;
  totalQuantity: number;
}

const BackOrders: React.FC = () => {
const [backOrders, setBackOrders] = useState<BackOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBackOrders = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/backOrders');
        const data = await response.json();
        console.log('Fetched data:', data);  // Add this line

        if (response.ok) {
          setBackOrders(data.backorders);
        } else {
          setError(data.error);
        }
      } catch (error) {
        setError("Failed to fetch back orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchBackOrders();
  }, []);

  return (
    <div className="min-h-screen w-full bg-gray-900 text-gray-800 flex items-center justify-center flex-col">
      <div className="bg-white rounded-lg shadow p-6 w-full max-w-7xl">
        <h2 className="text-3xl font-semibold mb-6 text-gray-800 text-center">
          Back Orders
        </h2>
        {loading && <p>Loading data...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {backOrders.length > 0 && (
          <div className="overflow-x-auto max-h-64 overflow-y-scroll">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="px-4 py-3 border">Variant ID</th>
                  <th className="px-4 py-3 border">Variant Name</th>
                  <th className="px-4 py-3 border">Needed Amount</th>
                </tr>
              </thead>
              <tbody>
                {backOrders.map((order) => (
                  <tr key={order.VariantID} className="hover:bg-gray-50">
                    <td className="px-4 py-3 border">{order.VariantID}</td>
                    <td className="px-4 py-3 border">{order.VariantName}</td>
                    <td className="px-4 py-3 border">{order.totalQuantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default BackOrders;