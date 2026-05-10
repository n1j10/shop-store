import { useEffect, useMemo, useState } from "react";

import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ProductCard } from "@/components/common/ProductCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";

export function ShopPage() {
  const [products, setProducts] = useState([]);

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("latest");

  const query = useMemo(
    () => ({
      q: search || undefined,
      category,
      sort,
    }),
    [search, category, sort]
  );

  useEffect(() => {
    let mounted = true;

    async function fetchProducts() {
      setLoading(true);
      try {
        const { data } = await api.get("/products", { params: query });

        if (mounted) {
          setProducts(data.products || []);
          setCategories(data.categories || []);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    fetchProducts();

    return () => {
      mounted = false;
    };
  }, [query]);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Shop</h1>
        <p className="text-sm text-stone-600">Browse all available products.</p>
      </div>

      <div className="grid gap-4 rounded-xl border border-stone-200 bg-white p-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="search">Search</Label>
          <Input
            id="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by product name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <select
            id="category"
            className="h-10 w-full rounded-md border border-stone-200 bg-white px-3 text-sm"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            <option value="all">All categories</option>
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="sort">Sort</Label>
          <select
            id="sort"
            className="h-10 w-full rounded-md border border-stone-200 bg-white px-3 text-sm"
            value={sort}
            onChange={(event) => setSort(event.target.value)}
          >
            <option value="latest">Latest</option>
            <option value="price_asc">Price: Low to high</option>
            <option value="price_desc">Price: High to low</option>
            <option value="name_asc">Name: A to Z</option>
            <option value="name_desc">Name: Z to A</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex min-h-28 items-center justify-center">
          <LoadingSpinner />
        </div>
      ) : products.length === 0 ? (
        <div className="rounded-xl border border-dashed border-stone-300 bg-white p-8 text-center text-stone-600">
          No products found.
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}