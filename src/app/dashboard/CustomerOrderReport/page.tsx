"use client";
import { useState, useEffect } from 'react';

interface Product {
  ProductID: number;
  ProductName: string;
  QuantityOrdered: number;
}

interface Order {
  OrderID: number;
  OrderDate: string;
  UserID: number;
  CustomerName: string;
  OrderTotal: number;
  PaymentMethod: string;
  DeliveryType: string;
  Email: string;
  PhoneNumber: string;
  ShippingAddress: string;
  EstimateDate: string | null;
  Products: Product[]; // To store products per order
}

export default function CustomerOrderReport() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    const fetchOrderData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/CustomerOrderReport');
        console.log('Response:', response);

        if (response.ok) {
          const data = await response.json();
          console.log('Fetched data:', data);

          // Group products by OrderID
          const groupedOrders: { [key: number]: Order } = {};
          data.orders.forEach((order: any) => {
            if (!groupedOrders[order.OrderID]) {
              groupedOrders[order.OrderID] = {
                OrderID: order.OrderID,
                OrderDate: order.OrderDate,
                UserID: order.UserID,
                CustomerName: order.CustomerName,
                OrderTotal: parseFloat(order.OrderTotal), // Ensure it's a number
                PaymentMethod: order.PaymentMethod,
                DeliveryType: order.DeliveryType,
                Email: order.Email,
                PhoneNumber: order.PhoneNumber,
                ShippingAddress: order.ShippingAddress,
                EstimateDate: order.EstimateDate,
                Products: [] // Initialize as empty array
              };
            }
            // Add the product to the Products array
            groupedOrders[order.OrderID].Products.push({
              ProductID: order.ProductID,
              ProductName: order.ProductName,
              QuantityOrdered: order.QuantityOrdered
            });
          });

          // Convert the grouped object into an array
          setOrders(Object.values(groupedOrders));
        } else {
          const errorData = await response.json();
          setError(errorData.error);
          console.error('Error fetching orders:', errorData.error);
        }
      } catch (error) {
        console.error('Fetch error:', error);
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
    <div className="min-h-screen w-full bg-gray-900 text-gray-800 flex items-center justify-center flex-col">
      <div className="bg-white rounded-lg shadow p-6 w-full max-w-7xl">
        <h2 className="text-3xl font-semibold mb-6 text-gray-800 text-center">
          Customer Order Report
        </h2>
        {loading && <p>Loading data...</p>}
        {error && <p className="text-red-500">{error}</p>}
        
        {orders.length === 0 && !loading && !error && (
          <p>No orders found.</p>
        )}

        {orders.length > 0 && (
          <div className="overflow-x-auto max-h-64 overflow-y-scroll">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="px-4 py-3 border">Order ID</th>
                  <th className="px-4 py-3 border">Order Date</th>
                  <th className="px-4 py-3 border">Total Price (Rs)</th>
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
                    <td className="px-4 py-3 border">Rs {order.OrderTotal.toFixed(2)}</td>
                    <td className="px-4 py-3 border">{order.UserID}</td>
                    <td className="px-4 py-3 border">{order.CustomerName}</td>
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
            <h3 className="text-xl font-bold mb-4">Customer Information:</h3>
            <p><strong>Customer ID:</strong> {selectedOrder.UserID}</p>
            <p><strong>Customer Name:</strong> {selectedOrder.CustomerName}</p>
            <p><strong>Email Address:</strong> {selectedOrder.Email}</p>
            <p><strong>Phone Number:</strong> {selectedOrder.PhoneNumber}</p>
            <p><strong>Shipping Address:</strong> {selectedOrder.ShippingAddress}</p>

            <h3 className="text-xl font-bold mt-4 mb-4">Order Details:</h3>
            <p><strong>Order ID:</strong> {selectedOrder.OrderID}</p>
            <p><strong>Order Date:</strong> {new Date(selectedOrder.OrderDate).toLocaleDateString()}</p>
            <p><strong>Total Price:</strong> Rs {selectedOrder.OrderTotal.toFixed(2)}</p>
            <p><strong>Estimated Date:</strong> {selectedOrder.EstimateDate || "Not available"}</p>
            <p><strong>Payment Method:</strong> {selectedOrder.PaymentMethod}</p>

            <h3 className="text-xl font-bold mt-4 mb-4">Product Information:</h3>
            {selectedOrder.Products && selectedOrder.Products.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                  <thead>
                    <tr className="bg-gray-100 text-left">
                      <th className="px-4 py-3 border">Product ID</th>
                      <th className="px-4 py-3 border">Product Name</th>
                      <th className="px-4 py-3 border">Quantity Ordered</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.Products.map((product) => (
                      <tr key={product.ProductID} className="hover:bg-gray-50">
                        <td className="px-4 py-3 border">{product.ProductID}</td>
                        <td className="px-4 py-3 border">{product.ProductName}</td>
                        <td className="px-4 py-3 border">{product.QuantityOrdered}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>No products found for this order.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
