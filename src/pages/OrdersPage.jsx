import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";

export function OrdersPage() {

  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function fetchOrders() {
      try {
        const { data } = await api.get("/orders");
        
        if (mounted) {
          setOrders(data.orders || []);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    fetchOrders();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return <p className="text-sm text-stone-600">Loading orders...</p>;
  }

  if (orders.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-stone-300 bg-white p-8 text-center text-stone-700">
        You have no orders yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Your orders</h1>

      {orders.map((order) => (
        <Card key={order._id}>
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <CardTitle className="text-base">Order #{order._id.slice(-6).toUpperCase()}</CardTitle>
              <Badge variant="secondary" className="capitalize">
                {order.status}
              </Badge>
            </div>
            <p className="text-sm text-stone-600">
              {new Date(order.createdAt).toLocaleString()} - {formatCurrency(order.subtotal)}
            </p>
          </CardHeader>

          <CardContent className="space-y-2 text-sm">
            {order.items.map((item) => (
              <div key={`${order._id}-${item.product}`} className="flex items-center justify-between gap-2">
                <span className="text-stone-700">
                  {item.name} x {item.quantity}
                </span>
                <span>{formatCurrency(item.price * item.quantity)}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}