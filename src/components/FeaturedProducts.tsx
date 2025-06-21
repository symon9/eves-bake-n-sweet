import dbConnect from "@/lib/dbConnect";
import Product, { IProduct } from "@/lib/models/Product";
import FeaturedProductsClient from "./FeaturedProductsClient";

async function getFeaturedProducts() {
  await dbConnect();
  const products = await Product.find({}).sort({ createdAt: -1 }).limit(4);
  return JSON.parse(JSON.stringify(products));
}

const FeaturedProducts = async () => {
  const featuredProducts: IProduct[] = await getFeaturedProducts();

  return <FeaturedProductsClient products={featuredProducts} />;
};

export default FeaturedProducts;
