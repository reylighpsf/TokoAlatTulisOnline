import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { useOrderStore } from '../store/orderStore';
import { Order, OrderItem } from '../types';
import { ArrowLeft, MapPin, Phone, User, Package, Truck, CheckCircle, XCircle } from 'lucide-react';

export default function OrderDetails() {
  const { id } = useParams<{ id: string }>();
  const { currentOrder, loading, error, getOrder, cancelOrder } = useOrderStore();
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (id) {
      getOrder(id);
    }
  }, [id, getOrder]);

  const handleCancelOrder = async () => {
    if (!id || !currentOrder) return;

    if (!confirm('Apakah Anda yakin ingin membatalkan pesanan ini?')) {
      return;
    }

    setCancelling(true);
    const success = await cancelOrder(id);
    if (success) {
      // Refresh order data
      getOrder(id);
    }
    setCancelling(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Menunggu';
      case 'processing':
        return 'Diproses';
      case 'shipped':
        return 'Dikirim';
      case 'delivered':
        return 'Diterima';
      case 'cancelled':
        return 'Dibatalkan';
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Package className="h-5 w-5" />;
      case 'processing':
        return <Package className="h-5 w-5" />;
      case 'shipped':
        return <Truck className="h-5 w-5" />;
      case 'delivered':
        return <CheckCircle className="h-5 w-5" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5" />;
      default:
        return <Package className="h-5 w-5" />;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Memuat detail pesanan...</div>
      </div>
    );
  }

  if (error || !currentOrder) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-600">
          {error || 'Pesanan tidak ditemukan'}
        </div>
        <Button asChild className="mt-4">
          <Link to="/orders">Kembali ke Riwayat Pesanan</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button asChild variant="ghost" className="mb-4">
          <Link to="/orders">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Riwayat Pesanan
          </Link>
        </Button>

        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Detail Pesanan #{currentOrder.order_number}
            </h1>
            <p className="text-gray-600">
              Dipesan pada {new Date(currentOrder.created_at).toLocaleDateString('id-ID', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge className={`${getStatusColor(currentOrder.status)} flex items-center gap-2`}>
              {getStatusIcon(currentOrder.status)}
              {getStatusText(currentOrder.status)}
            </Badge>
            {currentOrder.status === 'pending' && (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleCancelOrder}
                disabled={cancelling}
              >
                {cancelling ? 'Membatalkan...' : 'Batalkan Pesanan'}
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Items */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Detail Produk</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {currentOrder.items?.map((item: OrderItem) => (
                <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                  {item.product_image && (
                    <img
                      src={item.product_image}
                      alt={item.product_name}
                      className="w-16 h-16 rounded-lg object-cover border"
                    />
                  )}
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{item.product_name}</h4>
                    <p className="text-sm text-gray-600">
                      {item.quantity} x Rp{item.price.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      Rp{item.total.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Order Summary & Shipping */}
        <div className="space-y-6">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Ringkasan Pesanan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>Rp{currentOrder.total_amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Metode Pembayaran</span>
                <span className="capitalize">{currentOrder.payment_method}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>Rp{currentOrder.total_amount.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Information */}
          <Card>
            <CardHeader>
              <CardTitle>Informasi Pengiriman</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-gray-500" />
                <span>{currentOrder.shipping_name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <span>{currentOrder.shipping_phone}</span>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                <div>
                  <p>{currentOrder.shipping_address}</p>
                  <p>{currentOrder.shipping_city}</p>
                  {currentOrder.shipping_postal_code && (
                    <p>Kode Pos: {currentOrder.shipping_postal_code}</p>
                  )}
                </div>
              </div>
              {currentOrder.notes && (
                <div>
                  <p className="text-sm font-medium text-gray-700">Catatan:</p>
                  <p className="text-sm text-gray-600">{currentOrder.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
