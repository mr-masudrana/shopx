import { notFound } from "next/navigation";
import ProductDetails from "@/components/products/ProductDetails";
import { getProductById } from "@/lib/products";

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductPage({
  params,
}: ProductPageProps) {
  const { id } = await params;

  try {
    const product = await getProductById(id);

    return <ProductDetails product={product} />;
  } catch {
    notFound();
  }
}