import { NextRequest, NextResponse } from "next/server";
import { getSalesInterest } from '../../models/TimePeriodWithMostInterest/getOrderTime';  

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId');
    const period = searchParams.get('period');

    try {
        const data = await getSalesInterest(productId, period);
        return NextResponse.json({ data });
    } catch (error: any) {
        console.error('Database error:', error);  // Log the actual error message
        return NextResponse.json({ error: 'Database error occurred while fetching sales interest data.' }, { status: 500 });
    }
}
