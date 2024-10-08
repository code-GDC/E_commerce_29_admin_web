"use client";
import { useState, useEffect } from 'react';

export default function CustomerOrderReport() {
  interface Order {
    OrderID: number;
    OrderDate: string;
    UserID: number;
    CustomerName: string;
    OrderTotal: number;
    PaymentMethod: string;
    DeliveryType: string;
  }

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch order data when the component is mounted
  useEffect(() => {
    const fetchOrderData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/CustomerOrderReport');
        const data = await response.json();

        if (response.ok) {
          setOrders(data.orders);
        } else {
          setError(data.error);
        }
      } catch (error) {
        setError("Failed to fetch order data.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderData();
  }, []);

  return (
    <div className="min-h-screen w-full bg-gray-900 flex items-center text-gray-800 justify-center flex-col">
      <div className="bg-white rounded-lg shadow p-6 w-3/4">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 text-center">Customer Order Report</h2>
        {loading && <p>Loading data...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {orders.length > 0 && (
          <div className="overflow-y-auto h-96"> {/* Make the table scrollable with a fixed height */}
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 border">Order ID</th>
                  <th className="px-4 py-2 border">Order Date</th>
                  <th className="px-4 py-2 border">User ID</th>
                  <th className="px-4 py-2 border">Customer Name</th>
                  <th className="px-4 py-2 border">Order Total</th>
                  <th className="px-4 py-2 border">Payment Method</th>
                  <th className="px-4 py-2 border">Delivery Type</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.OrderID}>
                    <td className="px-4 py-2 border">{order.OrderID}</td>
                    <td className="px-4 py-2 border">{new Date(order.OrderDate).toLocaleDateString()}</td>
                    <td className="px-4 py-2 border">{order.UserID}</td>
                    <td className="px-4 py-2 border">{order.CustomerName}</td>
                    <td className="px-4 py-2 border">${order.OrderTotal}</td>
                    <td className="px-4 py-2 border">{order.PaymentMethod}</td>
                    <td className="px-4 py-2 border">{order.DeliveryType}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
