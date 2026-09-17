import Link from "next/link";
import { ArrowLeft, PackagePlus } from "lucide-react";

import ProductForm from "@/components/admin/ProductForm";

export default function NewProductPage() {
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
          <PackagePlus size={22} />
        </div>

        <div>
          <h1 className="text-2xl font-bold">Add New Product</h1>
          <p className="mt-1 text-sm text-zinc-500">
            This saves directly to your database.
          </p>
        </div>
      </div>

      <ProductForm />
    </div>
  );
}
