import dbConnect from "@/lib/dbConnect";
import Blog, { IBlog } from "@/lib/models/Blog";
import BlogPreviewClient from "./BlogPreviewClient";

async function getLatestPosts() {
  await dbConnect();
  const posts = await Blog.find({}).sort({ createdAt: -1 }).limit(3);
  return JSON.parse(JSON.stringify(posts));
}

const BlogPreview = async () => {
  const latestPosts: IBlog[] = await getLatestPosts();

  if (!latestPosts || latestPosts.length === 0) {
    return null;
  }

  return <BlogPreviewClient posts={latestPosts} />;
};

export default BlogPreview;
