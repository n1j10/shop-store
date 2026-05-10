import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { api, parseApiError } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";

const initialForm = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  country: "",
  zipCode: "",
};

export function CheckoutPage() {

  const navigate = useNavigate();

  const { user } = useAuth();

  const { cart, loading, fetchCart } = useCart();

  const [form, setForm] = useState({
    ...initialForm,
    fullName: user?.name || "",
    email: user?.email || "",
  });

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);


  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await api.post("/orders/checkout", form);
      await fetchCart();
      navigate("/orders");
    } catch (requestError) {
      setError(parseApiError(requestError, "Checkout failed."));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-xl border border-dashed border-stone-300 bg-white p-8 text-center text-stone-700">
        Loading checkout...
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-stone-300 bg-white p-8 text-center text-stone-700">
        Your cart is empty.
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-stone-200 bg-white p-5">
        <h1 className="text-2xl font-semibold">Checkout</h1>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full name</Label>
            <Input id="fullName" name="fullName" value={form.fullName} onChange={handleChange} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" value={form.email} onChange={handleChange} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" name="phone" value={form.phone} onChange={handleChange} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input id="city" name="city" value={form.city} onChange={handleChange} required />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="address">Address</Label>
            <Input id="address" name="address" value={form.address} onChange={handleChange} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Input id="country" name="country" value={form.country} onChange={handleChange} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="zipCode">Zip code</Label>
            <Input id="zipCode" name="zipCode" value={form.zipCode} onChange={handleChange} required />
          </div>
        </div>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        <Button type="submit" disabled={submitting}>
          {submitting ? "Placing order..." : "Place order"}
        </Button>
      </form>

      <Card className="h-fit">
        <CardHeader>
          <CardTitle>Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          {cart.items.map((item) => (
            <div key={item.productId} className="flex items-center justify-between gap-2">
              <span className="text-stone-600">
                {item.name} x {item.quantity}
              </span>
              <span>{formatCurrency(item.lineTotal)}</span>
            </div>
          ))}
          <div className="mt-3 flex items-center justify-between border-t border-stone-200 pt-3 font-semibold">
            <span>Subtotal</span>
            <span>{formatCurrency(cart.subtotal)}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
