import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Blog from "@/lib/models/Blog";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import slugify from "slugify";

// GET a single post by ID (for editing)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await dbConnect();
  try {
    const post = await Blog.findById(params.id);
    if (!post)
      return NextResponse.json(
        { success: false, error: "Post not found" },
        { status: 404 }
      );
    return NextResponse.json({ success: true, data: post });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 400 });
  }
}

// PUT (update) a post by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  await dbConnect();
  try {
    const body = await request.json();
    if (body.title) {
      body.slug = slugify(body.title, {
        lower: true,
        strict: true,
        trim: true,
      });
    }
    const updatedPost = await Blog.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    });
    if (!updatedPost)
      return NextResponse.json(
        { success: false, error: "Post not found" },
        { status: 404 }
      );
    return NextResponse.json({ success: true, data: updatedPost });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

// DELETE a post by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  await dbConnect();
  try {
    const deletedPost = await Blog.deleteOne({ _id: params.id });
    if (deletedPost.deletedCount === 0)
      return NextResponse.json(
        { success: false, error: "Post not found" },
        { status: 404 }
      );
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 400 });
  }
}
