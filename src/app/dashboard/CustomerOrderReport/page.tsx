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
    OrderStatus: string;
    ShippingCost: number;
    TaxAmount: number;
  }

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null); // To handle order details

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

  const handleSelectOrder = (order: Order) => {
    setSelectedOrder(order);
  };

  return (
    <div className="min-h-screen w-full bg-gray-900  text-gray-800 flex items-center justify-center flex-col">
      <div className="bg-white rounded-lg shadow p-6 w-full max-w-7xl">
        <h2 className="text-3xl font-semibold mb-6 text-gray-800 text-center">
          Customer Order Report
        </h2>
        {loading && <p>Loading data...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {orders.length > 0 && (
          <div className="overflow-x-auto max-h-64 overflow-y-scroll"> {/* Scrollable container */}
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="px-4 py-3 border">Order ID</th>
                  <th className="px-4 py-3 border">Customer Name</th>
                  <th className="px-4 py-3 border">Order Date</th>
                  <th className="px-4 py-3 border">Order Total</th>
                  <th className="px-4 py-3 border">Order Status</th>
                  <th className="px-4 py-3 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.OrderID} className="hover:bg-gray-50">
                    <td className="px-4 py-3 border">{order.OrderID}</td>
                    <td className="px-4 py-3 border">{order.CustomerName}</td>
                    <td className="px-4 py-3 border">
                      {new Date(order.OrderDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 border">${order.OrderTotal}</td>
                    <td className="px-4 py-3 border">{order.OrderStatus}</td>
                    <td className="px-4 py-3 border">
                      <button
                        onClick={() => handleSelectOrder(order)}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {selectedOrder && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg shadow-lg w-full">
            <h3 className="text-xl font-bold mb-4">Order Details for #{selectedOrder.OrderID}</h3>
            <p><strong>Customer Name:</strong> {selectedOrder.CustomerName}</p>
            <p><strong>Email:</strong> example@example.com</p> {/* Add email from actual data */}
            <p><strong>Shipping Address:</strong> Address details here</p> {/* Add from actual data */}
            <p><strong>Billing Address:</strong> Address details here</p> {/* Add from actual data */}
            <p><strong>Order Total:</strong> ${selectedOrder.OrderTotal}</p>
            <p><strong>Tax Amount:</strong> ${selectedOrder.TaxAmount}</p>
            <p><strong>Shipping Cost:</strong> ${selectedOrder.ShippingCost}</p>
            <p><strong>Payment Method:</strong> {selectedOrder.PaymentMethod}</p>
            <p><strong>Delivery Type:</strong> {selectedOrder.DeliveryType}</p>
            <p><strong>Order Status:</strong> {selectedOrder.OrderStatus}</p>
          </div>
        )}
      </div>
    </div>
  );
}
