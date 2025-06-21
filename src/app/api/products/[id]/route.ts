import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Product from "@/lib/models/Product";

interface Params {
  params: { id: string };
}

// Create a product
export async function GET(request: Request, { params }: Params) {
  await dbConnect();
  try {
    const product = await Product.findById(params.id);
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
export async function PUT(request: Request, { params }: Params) {
  await dbConnect();
  try {
    const body = await request.json();
    const product = await Product.findByIdAndUpdate(params.id, body, {
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
export async function DELETE(request: Request, { params }: Params) {
  await dbConnect();
  try {
    const deletedProduct = await Product.deleteOne({ _id: params.id });
    if (!deletedProduct.deletedCount) {
      return NextResponse.json({ success: false }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 400 });
  }
}
