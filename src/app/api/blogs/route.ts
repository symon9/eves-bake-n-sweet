import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Blog from "@/lib/models/Blog";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/authOptions";
import slugify from "slugify";

// GET all blog posts with search and pagination
export async function GET(request: NextRequest) {
  await dbConnect();
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const search = searchParams.get("search") || "";
    const skip = (page - 1) * limit;

    const query: any = {};
    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    const [posts, totalPosts] = await Promise.all([
      Blog.find(query)
        .sort({ createdAt: -1 })
        .populate("author", "name")
        .skip(skip)
        .limit(limit),
      Blog.countDocuments(query),
    ]);

    const totalPages = Math.ceil(totalPosts / limit);

    return NextResponse.json({
      success: true,
      data: posts,
      pagination: {
        currentPage: page,
        totalPages,
        totalPosts,
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 400 });
  }
}

// POST a new blog post
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();
  try {
    const body = await request.json();
    const slug = slugify(body.title, { lower: true, strict: true, trim: true });

    const existingPost = await Blog.findOne({ slug });
    if (existingPost) {
      return NextResponse.json(
        { success: false, error: "A post with this title already exists." },
        { status: 409 }
      );
    }

    const newPost = await Blog.create({
      ...body,
      slug,
      author: (session.user as { id: string }).id,
    });
    return NextResponse.json({ success: true, data: newPost }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
