/**
 * Komponen Cart Button untuk navbar dengan badge counter
 */

import { Button } from '../ui/button';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';

interface CartButtonProps {
  onClick: () => void;
}

export default function CartButton({ onClick }: CartButtonProps) {
  const { getTotalItems } = useCartStore();
  const totalItems = getTotalItems();

  return (
    <Button
      variant="outline"
      onClick={onClick}
      className="bg-transparent border-gray-300 rounded-xl hover:bg-gray-50 relative group"
    >
      <ShoppingCart className="h-4 w-4 mr-2" />
      Keranjang
      {totalItems > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold animate-bounce">
          {totalItems}
        </span>
      )}
    </Button>
  );
}