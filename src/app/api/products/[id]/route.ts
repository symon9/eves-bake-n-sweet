import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Product from "@/lib/models/Product";

// Helper to extract id from the URL
function getIdFromRequest(request: Request) {
  const url = new URL(request.url);
  const id = url.pathname.split("/").pop();
  return id;
}

// GET a single product by ID
export async function GET(request: Request) {
  await dbConnect();
  const id = getIdFromRequest(request);
  try {
    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 400 });
  }
}

// Update a product
export async function PUT(request: Request) {
  await dbConnect();
  const id = getIdFromRequest(request);
  try {
    const body = await request.json();
    const product = await Product.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    if (!product) {
      return NextResponse.json({ success: false }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 400 });
  }
}

// Delete a product
export async function DELETE(request: Request) {
  await dbConnect();
  const id = getIdFromRequest(request);
  try {
    const deletedProduct = await Product.deleteOne({ _id: id });
    if (!deletedProduct.deletedCount) {
      return NextResponse.json({ success: false }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 400 });
  }
}
