"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import type { Product } from "@/types/product";

interface ProductFormValues {
  title: string;
  description: string;
  category: string;
  price: string;
  stock: string;
  brand: string;
  tags: string;
  images: string;
}

function toFormValues(product?: Product): ProductFormValues {
  return {
    title: product?.title ?? "",
    description: product?.description ?? "",
    category: product?.category ?? "",
    price: product ? String(product.price) : "",
    stock: product ? String(product.stock) : "",
    brand: product?.brand ?? "",
    tags: product?.tags?.join(", ") ?? "",
    images: product?.images?.join(", ") ?? "",
  };
}

export default function ProductForm({ product }: { product?: Product }) {
  const router = useRouter();
  const isEditing = Boolean(product);

  const [form, setForm] = useState<ProductFormValues>(toFormValues(product));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const images = form.images
      .split(",")
      .map((url) => url.trim())
      .filter(Boolean);

    if (images.length === 0) {
      setError("At least one image URL is required.");
      return;
    }

    const price = Number(form.price);
    const stock = form.stock ? Number(form.stock) : 0;

    if (!Number.isFinite(price) || price < 0) {
      setError("Enter a valid price.");
      return;
    }

    setIsSubmitting(true);

    const payload = {
      title: form.title,
      description: form.description,
      category: form.category,
      price,
      stock,
      brand: form.brand || undefined,
      tags: form.tags
        ? form.tags.split(",").map((tag) => tag.trim()).filter(Boolean)
        : [],
      images,
    };

    try {
      const response = await fetch(
        isEditing ? `/api/products/${product!.id}` : "/api/products",
        {
          method: isEditing ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.error ?? "Failed to save product.");
      }

      toast.success(isEditing ? "Product updated!" : "Product added!");
      router.push("/admin/products");
      router.refresh();
    } catch (submitError) {
      const message =
        submitError instanceof Error ? submitError.message : "Something went wrong.";
      setError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-2xl border bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
    >
      <Field label="Title">
        <input
          required
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="e.g. Classic Cotton T-Shirt"
          className={inputClass}
        />
      </Field>

      <Field label="Description">
        <textarea
          required
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={4}
          placeholder="Short product description"
          className={inputClass}
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Category">
          <input
            required
            name="category"
            value={form.category}
            onChange={handleChange}
            placeholder="e.g. mens-shirts"
            className={inputClass}
          />
        </Field>

        <Field label="Brand (optional)">
          <input
            name="brand"
            value={form.brand}
            onChange={handleChange}
            placeholder="e.g. NexMart"
            className={inputClass}
          />
        </Field>

        <Field label="Price (USD)">
          <input
            required
            type="number"
            min="0"
            step="0.01"
            name="price"
            value={form.price}
            onChange={handleChange}
            placeholder="29.99"
            className={inputClass}
          />
        </Field>

        <Field label="Stock">
          <input
            type="number"
            min="0"
            step="1"
            name="stock"
            value={form.stock}
            onChange={handleChange}
            placeholder="100"
            className={inputClass}
          />
        </Field>
      </div>

      <Field label="Tags (comma separated, optional)">
        <input
          name="tags"
          value={form.tags}
          onChange={handleChange}
          placeholder="cotton, casual, summer"
          className={inputClass}
        />
      </Field>

      <Field label="Image URLs (comma separated)">
        <textarea
          required
          name="images"
          value={form.images}
          onChange={handleChange}
          rows={2}
          placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
          className={inputClass}
        />
      </Field>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900 dark:bg-red-950/30">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Saving..." : isEditing ? "Save Changes" : "Save Product"}
      </button>
    </form>
  );
}

const inputClass =
  "w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-zinc-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:ring-blue-950";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium">{label}</span>
      {children}
    </label>
  );
}
