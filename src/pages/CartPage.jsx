import { Link, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { formatCurrency } from "@/lib/utils";


export function CartPage() {

  const navigate = useNavigate();

  const { isAuthenticated } = useAuth();

  const { cart, loading, updateItem, removeItem } = useCart();



  const handleQuantityChange = (productId, stock, nextValue) => {

    const parsed = Number(nextValue);
    if (!Number.isFinite(parsed)) {
      return;
    }

    const clamped = Math.max(1, Math.min(stock, parsed));
    updateItem(productId, clamped);

  };


  if (!isAuthenticated) {
    return (
      <div className="space-y-4 rounded-xl border border-dashed border-stone-300 bg-white p-8 text-center">
        <p className="text-stone-700">Please login to view your cart.</p>
        <Link to="/login" className="text-sm font-medium text-stone-900 underline">
          Go to login
        </Link>
      </div>
    );
  }

  if (loading) {
    return <p className="text-sm text-stone-600">Loading cart...</p>;
  }

  if (cart.items.length === 0) {
    return (
      <div className="space-y-4 rounded-xl border border-dashed border-stone-300 bg-white p-8 text-center">
        <p className="text-stone-700">Your cart is empty.</p>
        <Link to="/shop" className="text-sm font-medium text-stone-900 underline">
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-4">
        {cart.items.map((item) => (
          <Card key={item.productId}>
            <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
              <img src={item.image} alt={item.name} className="h-24 w-24 rounded-md object-cover" />

              <div className="flex-1 space-y-1">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-sm text-stone-600">{formatCurrency(item.price)}</p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  max={item.stock}
                  value={item.quantity}
                  onChange={(event) =>
                    handleQuantityChange(item.productId, item.stock, event.target.value)
                  }
                  className="h-9 w-20 rounded-md border border-stone-200 px-2 text-sm"
                />
                <Button variant="ghost" onClick={() => removeItem(item.productId)}>
                  Remove
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="h-fit">
        <CardHeader>
          
          <CardTitle>Order summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-stone-600">Items ({cart.itemCount})</span>
            <span>{formatCurrency(cart.subtotal)}</span>
          </div>
          <div className="flex items-center justify-between border-t border-stone-200 pt-3 font-semibold">
            <span>Subtotal</span>
            <span>{formatCurrency(cart.subtotal)}</span>
          </div>
          <Button className="w-full" onClick={() => navigate("/checkout")}>
            Proceed to checkout
          </Button>
        </CardContent>



      </Card>
    </div>
  );
}
