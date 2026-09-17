import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Pencil } from "lucide-react";

import { getProductById } from "@/lib/products";
import ProductForm from "@/components/admin/ProductForm";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let product;
  try {
    product = await getProductById(id);
  } catch {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href="/admin/products"
        className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:underline"
      >
        <ArrowLeft size={16} />
        Back to Products
      </Link>

      <div className="mb-8 flex items-center gap-3">
        <div className="rounded-xl bg-blue-100 p-2 text-blue-600 dark:bg-blue-950">
          <Pencil size={22} />
        </div>

        <div>
          <h1 className="text-2xl font-bold">Edit Product</h1>
          <p className="mt-1 text-sm text-zinc-500">{product.title}</p>
        </div>
      </div>

      <ProductForm product={product} />
    </div>
  );
}
