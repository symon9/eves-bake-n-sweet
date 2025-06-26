import { NextRequest, NextResponse } from 'next/server'; 
import dbConnect from '@/lib/dbConnect';
import Order from '@/lib/models/Order';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

// GET all orders with search and pagination
export async function GET(request: NextRequest) { 
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();
  
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const search = searchParams.get('search') || '';

    const skip = (page - 1) * limit;

    const query: Record<string, unknown> = {};
    if (search) {
      // Search by customer name, email, or order ID (partial match, case-insensitive)
      query.$or = [
        { 'customer.name': { $regex: search, $options: 'i' } },
        { 'customer.email': { $regex: search, $options: 'i' } },
        // For simplicity, we'll stick to string fields for now.
      ];
    }

    const [orders, totalOrders] = await Promise.all([
      Order.find(query)
        .sort({ createdAt: -1 }) // Newest first
        .skip(skip)
        .limit(limit),
      Order.countDocuments(query)
    ]);

    const totalPages = Math.ceil(totalOrders / limit);

    return NextResponse.json({
      success: true,
      data: orders,
      pagination: {
        currentPage: page,
        totalPages,
        totalOrders,
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 400 });
  }
}

// POST a new order
export async function POST(request: Request) {
  await dbConnect();
  try {
    const body = await request.json();
    const order = await Order.create(body);
    return NextResponse.json({ success: true, data: order }, { status: 201 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 400 });
  }
}

// PUT to verify payment and update order status
export async function PUT(request: Request) {
  await dbConnect();
  try {
    const { orderId, reference } = await request.json();

    if (!orderId || !reference) {
      return NextResponse.json({ message: 'Missing orderId or reference' }, { status: 400 });
    }

    // --- PAYSTACK VERIFICATION ---
    const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      },
    });

    const verificationData = await response.json();

    if (verificationData.data && verificationData.data.status === 'success') {
      const order = await Order.findByIdAndUpdate(
        orderId,
        {
          status: 'paid',
          paymentReference: reference,
        },
        { new: true }
      );

      if (!order) {
        return NextResponse.json({ message: 'Order not found' }, { status: 404 });
      }

      return NextResponse.json({ success: true, data: order });
    } else {
      return NextResponse.json({ success: false, message: 'Payment verification failed' }, { status: 400 });
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}