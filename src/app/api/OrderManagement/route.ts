import { NextRequest, NextResponse } from 'next/server';
import { getOrders, removeOrder } from '../../models/OrderManagement/orderManagement';  // Import the functions

// API handler function to get orders
export async function GET(req: NextRequest) {
  try {
    const orders = await getOrders();  // Call the function to get the orders
    return NextResponse.json({ orders });  // Return the data as JSON
  } catch (error: any) {
    console.error('Database error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// API handler function to remove an order
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get('orderId');

  if (!orderId) {
    return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
  }

  try {
    await removeOrder(Number(orderId));  // Call the function to remove the order
    return NextResponse.json({ message: 'Order removed successfully' });
  } catch (error: any) {
    console.error('Database error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}