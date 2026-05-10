import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

export function ProductCard({ product }) {

  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addItem } = useCart();

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { redirectTo: `/products/${product._id}` } });
      return;
    }
    await addItem(product._id, 1);
  };

  return (
    <Card className="overflow-hidden">
      <Link to={`/products/${product._id}`} className="block overflow-hidden">
        <img src={product.image} alt={product.name} className="h-56 w-full object-cover transition-transform duration-300 hover:scale-105" />
      </Link>
      <CardContent className="space-y-3 p-4">
        <div className="flex items-center justify-between gap-2">
          <Badge variant="secondary" className="capitalize">
            {product.category}
          </Badge>
          <span className="text-xs text-stone-500">Stock: {product.stock}</span>
        </div>

        <Link to={`/products/${product._id}`} className="block text-sm font-semibold text-stone-900 hover:text-stone-600">
          {product.name}
        </Link>
        <p className="line-clamp-2 text-sm text-stone-600">{product.description}</p>
        <p className="text-base font-semibold">{formatCurrency(product.price)}</p>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button className="w-full" onClick={handleAddToCart}>
          Add to cart
        </Button>
      </CardFooter>
    </Card>
  );
}