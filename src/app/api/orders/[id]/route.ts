import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Order from "@/lib/models/Order";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/authOptions";

// Helper to extract id from the URL
function getIdFromRequest(request: Request) {
  const url = new URL(request.url);
  const id = url.pathname.split("/").pop();
  return id;
}

// GET a single order by ID
export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();
  const id = getIdFromRequest(request);
  try {
    const order = await Order.findById(id).populate(
      "items.productId",
      "imageUrls"
    );
    if (!order) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: order });
  } catch (error: any) {
    // Type error as 'any' to access .name and .message
    // Handle potential invalid ObjectId errors
    if (error.name === "CastError") {
      return NextResponse.json(
        { success: false, error: "Invalid Order ID format" },
        { status: 400 }
      );
    }
    return NextResponse.json({ success: false, error }, { status: 400 });
  }
}

// --- PUT HANDLER for updating status ---
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  try {
    const { status } = await request.json();

    if (
      !status ||
      !["pending", "paid", "shipped", "delivered", "cancelled"].includes(status)
    ) {
      return NextResponse.json(
        { success: false, error: "Invalid status provided" },
        { status: 400 }
      );
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      params.id,
      { status: status },
      { new: true }
    );

    if (!updatedOrder) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updatedOrder });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
