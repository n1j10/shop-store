import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ProductCard } from "@/components/common/ProductCard";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

export function HomePage() {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    let mounted = true;

    async function fetchFeatured() {
      try {
        const { data } = await api.get("/products", { params: { featured: true, sort: "latest" } });
        if (mounted) {
          setProducts(data.products.slice(0, 8));
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    fetchFeatured();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="space-y-10">
      <section className="overflow-hidden rounded-2xl border border-stone-200 bg-gradient-to-br from-stone-900 to-stone-700 px-6 py-12 text-white md:px-10 md:py-16">
        <p className="mb-3 text-sm uppercase tracking-[0.18em] text-stone-200">shop store</p>
        <h1 className="max-w-2xl text-3xl font-semibold leading-tight md:text-5xl">
          Functional shopping experience with a clean modern storefront.
        </h1>
        <p className="mt-4 max-w-xl text-sm text-stone-200 md:text-base">
          Browse products, manage your cart, and complete checkout with a fully connected MERN workflow.
        </p>
        <div className="mt-7">
          <Link to="/shop">
            <Button variant="secondary" size="lg">
              Explore products
            </Button>
          </Link>
        </div>
      </section>

      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Featured products</h2>
          <Link to="/shop" className="text-sm font-medium text-stone-600 hover:text-stone-900">
            View all
          </Link>
        </div>

        {loading ? (
          <div className="flex min-h-28 items-center justify-center">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}