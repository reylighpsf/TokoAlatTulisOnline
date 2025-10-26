import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "../ui/sheet";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { Trash2 } from "lucide-react";
import { useCartStore } from "../../store/cartStore";
import { useAuthStore } from "../../store/authStore";
import { useNavigate } from "react-router-dom";

export default function CartDrawer() {
  const {
    items,
    removeItem,
    clearCart,
    getTotalPrice,
    isCartOpen,
    toggleCart,
  } = useCartStore();

  const { user } = useAuthStore();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) {
      navigate('/login');
      return;
    }

    navigate('/checkout');
  };

  return (
    <Sheet open={isCartOpen} onOpenChange={toggleCart}>
      <SheetContent
        side="right"
        className="fixed inset-y-0 right-0 z-[1000] w-full sm:max-w-md bg-white border-l border-gray-200 shadow-2xl p-0 transition-transform duration-300"
      >
        <SheetHeader className="p-4 border-b border-gray-200">
          <SheetTitle className="text-lg font-semibold text-gray-900 flex justify-between items-center">
            🛒 Keranjang Belanja
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-gray-500">
            <p>Keranjang Anda masih kosong</p>
          </div>
        ) : (
          <ScrollArea className="h-[65vh] px-4 py-4">
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex items-center justify-between bg-gray-50 p-3 rounded-xl border border-gray-200"
                >
                  <div className="flex items-center space-x-3">
                    {item.product.image && (
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-16 h-16 rounded-lg object-cover border"
                      />
                    )}
                    <div>
                      <h4 className="font-medium text-gray-800">
                        {item.product.name}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {item.quantity} x Rp
                        {item.product.price.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem(item.product.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}

        {items.length > 0 && (
          <SheetFooter className="p-4 border-t border-gray-200 space-y-3">
            <div className="flex justify-between text-sm text-gray-700">
              <span>Total</span>
              <span className="font-semibold text-gray-900">
                Rp{getTotalPrice().toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between space-x-2">
              <Button
                variant="outline"
                onClick={clearCart}
                className="flex-1 border-gray-300 hover:bg-gray-50"
              >
                Hapus Semua
              </Button>
              <Button
                onClick={handleCheckout}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                Checkout
              </Button>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
