import { NavLink, Outlet } from "react-router-dom";
import { LogOut, ShoppingBag } from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const links = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/cart", label: "Cart" },
  { to: "/orders", label: "Orders" },
];

export function SiteLayout() {

  const { isAuthenticated, user, logout } = useAuth();

  const { cart } = useCart();

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900">
      <header className="sticky top-0 z-40 border-b border-stone-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-6">
          <NavLink to="/" className="flex items-center gap-2 text-lg font-semibold tracking-wide">
            <ShoppingBag className="h-5 w-5" />
            <span>shop store</span>
          </NavLink>

          <nav className="hidden items-center gap-5 md:flex">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  cn("text-sm font-medium text-stone-600 transition-colors hover:text-stone-900", isActive && "text-stone-900")
                }
              >
                {link.label}
                {link.to === "/cart" && cart.itemCount > 0 ? ` (${cart.itemCount})` : ""}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">

            {isAuthenticated ? (
              <>
                <span className="hidden text-sm text-stone-600 md:inline">{user?.name}</span>
                <Button variant="outline" size="sm" onClick={logout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <NavLink to="/login">
                  <Button variant="outline" size="sm">
                    Login
                  </Button>
                </NavLink>
                <NavLink to="/register" className="hidden sm:block">
                  <Button size="sm">Register</Button>
                </NavLink>
              </>
            )}
          </div>
        </div>
        

        <div className="mx-auto flex max-w-7xl items-center gap-4 overflow-x-auto px-4 pb-3 md:hidden">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                cn(
                  "whitespace-nowrap rounded-full border border-stone-200 px-3 py-1.5 text-xs font-semibold text-stone-600",
                  isActive && "border-stone-900 text-stone-900"
                )
              }
            >
              {link.label}
              {link.to === "/cart" && cart.itemCount > 0 ? ` (${cart.itemCount})` : ""}
            </NavLink>
          ))}
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 py-8 md:px-6 md:py-10">
        <Outlet />
      </main>
    </div>
  );
}