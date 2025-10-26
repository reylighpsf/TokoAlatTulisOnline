import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Separator } from '../components/ui/separator';
import { useCartStore } from '../store/cartStore';
import { useOrderStore } from '../store/orderStore';
import { useAuthStore } from '../store/authStore';
import { User } from '../types';
import { ArrowLeft, CreditCard, Truck, MapPin } from 'lucide-react';

export default function Checkout() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const { createOrder } = useOrderStore();

  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    shipping_name: '',
    shipping_phone: '',
    shipping_address: '',
    shipping_city: '',
    shipping_postal_code: '',
    payment_method: 'cod',
    notes: '',
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (items.length === 0) {
      navigate('/produk');
      return;
    }

    // Pre-fill form with user data
    setFormData({
      shipping_name: user.name || '',
      shipping_phone: user.phone || '',
      shipping_address: user.address || '',
      shipping_city: user.city || '',
      shipping_postal_code: user.postal_code || '',
      payment_method: 'cod',
      notes: '',
    });
  }, [user, items, navigate]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;

    setIsProcessing(true);
    try {
      const orderData = {
        items: items.map(item => ({
          product_id: item.product.id,
          quantity: item.quantity,
        })),
        ...formData,
      };

      const order = await createOrder(orderData);

      if (order) {
        clearCart();
        alert(`Pesanan berhasil dibuat! Nomor pesanan: ${order.order_number}`);
        navigate(`/orders/${order.id}`);
      }
    } catch (error) {
      alert('Gagal membuat pesanan. Silakan coba lagi.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!user || items.length === 0) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button asChild variant="ghost" className="mb-4">
          <div onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali
          </div>
        </Button>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
        <p className="text-gray-600">Selesaikan pesanan Anda</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Shipping & Payment Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Informasi Pengiriman
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="shipping_name">Nama Lengkap *</Label>
                  <Input
                    id="shipping_name"
                    value={formData.shipping_name}
                    onChange={(e) => handleInputChange('shipping_name', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="shipping_phone">Nomor Telepon *</Label>
                  <Input
                    id="shipping_phone"
                    type="tel"
                    value={formData.shipping_phone}
                    onChange={(e) => handleInputChange('shipping_phone', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="shipping_address">Alamat Lengkap *</Label>
                <Textarea
                  id="shipping_address"
                  value={formData.shipping_address}
                  onChange={(e) => handleInputChange('shipping_address', e.target.value)}
                  placeholder="Masukkan alamat lengkap pengiriman"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="shipping_city">Kota *</Label>
                  <Input
                    id="shipping_city"
                    value={formData.shipping_city}
                    onChange={(e) => handleInputChange('shipping_city', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="shipping_postal_code">Kode Pos</Label>
                  <Input
                    id="shipping_postal_code"
                    value={formData.shipping_postal_code}
                    onChange={(e) => handleInputChange('shipping_postal_code', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Catatan (Opsional)</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Tambahkan catatan untuk pesanan Anda"
                />
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                Metode Pembayaran
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={formData.payment_method}
                onValueChange={(value) => handleInputChange('payment_method', value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cod" id="cod" />
                  <Label htmlFor="cod" className="flex items-center">
                    <Truck className="h-4 w-4 mr-2" />
                    Bayar di Tempat (COD)
                  </Label>
                </div>
                <p className="text-sm text-gray-600 ml-6">
                  Bayar tunai saat barang diterima
                </p>
              </RadioGroup>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Ringkasan Pesanan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.product.id} className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      {item.product.image && (
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      )}
                      <div>
                        <p className="font-medium text-sm">{item.product.name}</p>
                        <p className="text-xs text-gray-600">
                          {item.quantity} x Rp{item.product.price.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <p className="font-semibold">
                      Rp{(item.product.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>Rp{getTotalPrice().toLocaleString()}</span>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isProcessing}
                size="lg"
              >
                {isProcessing ? 'Memproses Pesanan...' : 'Buat Pesanan'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}
