import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Blog from '@/lib/models/Blog';

// Helper to extract slug from the URL
function getSlugFromRequest(request: NextRequest) {
  const slug = request.nextUrl.pathname.split("/").pop();
  return slug;
}

// GET a single post by its slug AND recommended posts
export async function GET(request: NextRequest) {
  await dbConnect();
  const slug = getSlugFromRequest(request);
  try {
    // 1. Find the main post
    const post = await Blog.findOne({ slug }).populate('author', 'name email');
    
    if (!post) {
      return NextResponse.json({ success: false, error: 'Post not found' }, { status: 404 });
    }

    // 2. Find 3 random recommended posts, excluding the current one
    const recommendedPosts = await Blog.aggregate([
      { $match: { _id: { $ne: post._id } } }, // Exclude the current post
      { $sample: { size: 3 } }, // Get 3 random documents
      { $project: { title: 1, slug: 1, featuredMediaUrl: 1, excerpt: 1 } } // Only fetch needed fields
    ]);

    // 3. Combine them into a single response
    return NextResponse.json({ 
      success: true, 
      data: {
        mainPost: post,
        recommendedPosts: recommendedPosts
      } 
    });
  } catch (error) {
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}