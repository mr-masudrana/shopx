import type {
  Product,
  ProductsResponse,
} from "@/types/product";

const API_BASE_URL = "https://dummyjson.com";

export async function getProducts(): Promise<Product[]> {
  const response = await fetch(
    `${API_BASE_URL}/products?limit=100`,
    {
      next: {
        revalidate: 3600,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  const data: ProductsResponse = await response.json();

  return data.products;
}

export async function getProductById(
  id: string | number
): Promise<Product> {
  const response = await fetch(
    `${API_BASE_URL}/products/${id}`,
    {
      next: {
        revalidate: 3600,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Product not found");
  }

  return response.json();
}

export async function getCategories(): Promise<string[]> {
  const response = await fetch(
    `${API_BASE_URL}/products/categories`,
    {
      next: {
        revalidate: 3600,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }

  const data = await response.json();

  // পুরোনো API string array ফেরত দিতে পারে
  if (Array.isArray(data) && typeof data[0] === "string") {
    return data;
  }

  // নতুন API object array ফেরত দিলে
  if (Array.isArray(data)) {
    return data.map((item) => item.slug);
  }

  return [];
}

export async function getProductsByCategory(
  category: string
): Promise<ProductsResponse> {
  const response = await fetch(
    `${API_BASE_URL}/products/category/${encodeURIComponent(
      category
    )}?limit=100`,
    {
      next: {
        revalidate: 3600,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch category products");
  }

  return response.json();
}