import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import slugify from "slugify";

import { authOptions } from "../../auth/[...nextauth]/authOptions";
import dbConnect from "@/lib/dbConnect";
import Blog from "@/lib/models/Blog";

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
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  try {
    // Step 1: Fetch the existing document
    const postToUpdate = await Blog.findById(params.id);

    if (!postToUpdate) {
      return NextResponse.json(
        { success: false, error: "Blog post not found." },
        { status: 404 }
      );
    }

    const body = await request.json();

    // Step 2: Manually merge the changes from the request body
    Object.keys(body).forEach((key) => {
      // Use a type assertion to allow dynamic key access
      (postToUpdate as any)[key] = body[key];
    });

    // If the title was part of the update, regenerate the slug
    if (body.title) {
      postToUpdate.slug = slugify(body.title, {
        lower: true,
        strict: true,
        trim: true,
      });
    }

    // Step 3: Save the fully merged and updated document
    const updatedPost = await postToUpdate.save();

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
