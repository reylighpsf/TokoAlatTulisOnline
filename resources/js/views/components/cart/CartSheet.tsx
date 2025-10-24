/**
 * Komponen Cart Sheet/Sidebar untuk menampilkan keranjang belanja
 */

import { Button } from '../ui/button';
import { useCartStore } from '../../store/cartStore';
import { Minus, Plus, Trash2, ShoppingBag, X } from 'lucide-react';
import { useState } from 'react';

interface CartSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartSheet({ isOpen, onClose }: CartSheetProps) {
  const { items, updateQuantity, removeItem, getTotalPrice, getTotalItems, clearCart } = useCartStore();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = () => {
    setIsCheckingOut(true);
    // Simulasi proses checkout
    setTimeout(() => {
      clearCart();
      setIsCheckingOut(false);
      onClose();
      alert('Pesanan berhasil dibuat! Terima kasih telah berbelanja di PrintShop.');
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      {/* Cart Panel */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">
              Keranjang Belanja ({getTotalItems()})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Keranjang Kosong</h3>
              <p className="text-gray-500 mb-6">Tambahkan produk ke keranjang untuk mulai berbelanja</p>
              <Button onClick={onClose} className="bg-blue-600 hover:bg-blue-700">
                Lanjutkan Belanja
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.product.id} className="flex items-center space-x-4 bg-gray-50 rounded-2xl p-4">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded-xl"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 truncate">{item.product.name}</h4>
                    <p className="text-sm text-gray-600">Rp {item.product.price.toLocaleString()}</p>
                    
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="p-1 hover:bg-white rounded-lg transition-colors"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="p-1 hover:bg-white rounded-lg transition-colors"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      
                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-200 p-6 space-y-4">
            <div className="flex justify-between items-center text-lg font-semibold">
              <span>Total Belanja:</span>
              <span className="text-blue-600">Rp {getTotalPrice().toLocaleString()}</span>
            </div>
            
            <Button
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className="w-full bg-green-600 hover:bg-green-700 py-3 text-lg font-semibold"
            >
              {isCheckingOut ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Memproses...</span>
                </div>
              ) : (
                'Lanjut ke Checkout'
              )}
            </Button>
            
            <Button
              onClick={clearCart}
              variant="outline"
              className="w-full bg-transparent border-red-300 text-red-600 hover:bg-red-50"
            >
              Kosongkan Keranjang
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}