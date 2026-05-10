import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { api } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";

export function ProductPage() {

  const { id } = useParams();

  const navigate = useNavigate();

  const { isAuthenticated } = useAuth();
  const { addItem } = useCart();

  const [product, setProduct] = useState(null);

  const [quantity, setQuantity] = useState(1);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function fetchProduct() {
      try {
        const { data } = await api.get(`/products/${id}`);

        if (mounted) {
          setProduct(data.product);
        }
      } catch {
        if (mounted) {
          setProduct(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    fetchProduct();

    return () => {
      mounted = false;
    };
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) {
      return;
    }

    if (!isAuthenticated) {
      navigate("/login", { state: { redirectTo: `/products/${id}` } });
      return;
    }
    await addItem(product._id, quantity);
    navigate("/cart");
  };

  if (loading) {
    return (
      <div className="flex min-h-40 items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="space-y-4 rounded-xl border border-dashed border-stone-300 bg-white p-8 text-center">
        <p className="text-stone-700">Product not found.</p>
        <Link to="/shop" className="text-sm font-medium text-stone-900 underline">
          Back to shop
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="overflow-hidden rounded-xl border border-stone-200 bg-white">
        <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
      </div>

      <div className="space-y-5">
        <Badge variant="secondary" className="capitalize">
          {product.category}
        </Badge>

        <h1 className="text-3xl font-semibold">{product.name}</h1>
        <p className="text-stone-600">{product.description}</p>

        <div className="space-y-1">
          <p className="text-2xl font-semibold">{formatCurrency(product.price)}</p>
          <p className="text-sm text-stone-600">Available stock: {product.stock}</p>
        </div>

        <div className="flex items-center gap-3">
          <label htmlFor="qty" className="text-sm font-medium text-stone-700">
            Quantity
          </label>
          <input
            id="qty"
            type="number"
            min={1}
            max={product.stock}
            value={quantity}
            onChange={(event) => {
              const parsed = Number(event.target.value);

              if (!Number.isFinite(parsed)) {
                return;
              }

              const clamped = Math.max(1, Math.min(product.stock, parsed));
              setQuantity(clamped);
            }}
            className="h-10 w-24 rounded-md border border-stone-200 px-3 text-sm"
          />
        </div>

        <Button onClick={handleAddToCart} disabled={product.stock === 0} className="w-full sm:w-auto">
          {product.stock === 0 ? "Out of stock" : "Add to cart"}
        </Button>
      </div>
    </div>
  );
}
