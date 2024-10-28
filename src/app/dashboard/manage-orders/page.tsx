"use client";
import { useState, useEffect } from 'react';

interface Order {
  OrderID: number;
  OrderDate: string;
  UserID: number;
  CustomerName: string;
  OrderTotal: number;
  PaymentMethod: string;
  DeliveryType: string;
}

export default function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrderData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/OrderManagement');
        const data = await response.json();
        console.log('Fetched data:', data);  // Add this line

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

  const handleRemoveOrder = async (orderId: number) => {
    try {
      const response = await fetch(`/api/OrderManagement?orderId=${orderId}`, {
        method: 'DELETE',
      });
      const data = await response.json();

      if (response.ok) {
        setOrders(orders.filter(order => order.OrderID !== orderId));
      } else {
        setError(data.error);
      }
    } catch (error) {
      setError("Failed to remove order.");
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-900 text-gray-800 flex items-center justify-center flex-col">
      <div className="bg-white rounded-lg shadow p-6 w-full max-w-7xl">
        <h2 className="text-3xl font-semibold mb-6 text-gray-800 text-center">
          Order Management
        </h2>
        {loading && <p>Loading data...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {orders.length > 0 && (
          <div className="overflow-x-auto max-h-64 overflow-y-scroll">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="px-4 py-3 border">Order ID</th>
                  <th className="px-4 py-3 border">Order Date</th>
                  <th className="px-4 py-3 border">Customer ID</th>
                  <th className="px-4 py-3 border">Customer Name</th>
                  <th className="px-4 py-3 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.OrderID} className="hover:bg-gray-50">
                    <td className="px-4 py-3 border">{order.OrderID}</td>
                    <td className="px-4 py-3 border">
                      {new Date(order.OrderDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 border">{order.UserID}</td>
                    <td className="px-4 py-3 border">{order.CustomerName}</td>
                    <td className="px-4 py-3 border">
                      <button
                        onClick={() => handleRemoveOrder(order.OrderID)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Remove Order
                      </button>
                    </td>
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