import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Order from "@/lib/models/Order";
import Product from "@/lib/models/Product";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const dateRange = searchParams.get("range") || "7d";

    const getStartDate = (range: string): Date => {
      const date = new Date();
      date.setHours(0, 0, 0, 0); // Start from the beginning of the day

      switch (range) {
        case "30d":
          date.setDate(date.getDate() - 30);
          break;
        case "90d":
          date.setMonth(date.getMonth() - 3);
          break;
        case "1y":
          date.setFullYear(date.getFullYear() - 1);
          break;
        case "7d":
        default:
          date.setDate(date.getDate() - 7);
          break;
      }
      return date;
    };

    const startDate = getStartDate(dateRange);

    // 1. Get simple counts
    const totalProductsPromise = Product.countDocuments();
    const totalOrdersPromise = Order.countDocuments();

    // 2. Calculate Total Revenue using an Aggregation Pipeline
    const totalRevenuePromise = Order.aggregate([
      { $match: { status: { $in: ["paid", "delivered", "shipped"] } } },
      { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } },
    ]);

    // 3. Get Recent Orders
    const recentOrdersPromise = Order.find({}).sort({ createdAt: -1 }).limit(5);

    // 4. Get Sales Data for the selected date range
    const salesDataPromise = Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          status: { $in: ["paid", "delivered", "shipped"] },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          totalSales: { $sum: "$totalAmount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Execute all promises in parallel
    const [totalProducts, totalOrders, revenueResult, recentOrders, salesData] =
      await Promise.all([
        totalProductsPromise,
        totalOrdersPromise,
        totalRevenuePromise,
        recentOrdersPromise,
        salesDataPromise,
      ]);

    const totalRevenue =
      revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    return NextResponse.json({
      success: true,
      data: {
        totalProducts,
        totalOrders,
        totalRevenue,
        recentOrders,
        salesData,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
