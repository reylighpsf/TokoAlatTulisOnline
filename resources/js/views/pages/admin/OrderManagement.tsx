import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { useOrderStore } from '../../store/orderStore';
import { Order } from '../../types';
import AdminNavbar from '../../components/admin/AdminNavbar';
import { Eye, Package, Truck, CheckCircle, XCircle, RefreshCw } from 'lucide-react';

export default function OrderManagement() {
  const { orders, loading, error, fetchAllOrders } = useOrderStore();
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  useEffect(() => {
    // Check if admin token exists before fetching
    const adminToken = localStorage.getItem('admin_auth_token') || sessionStorage.getItem('admin_auth_token');
    if (adminToken) {
      fetchAllOrders();
    } else {
      // If no admin token, redirect to login
      window.location.href = '/admin/login';
    }
  }, [fetchAllOrders]);

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

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    setUpdatingStatus(orderId);
    try {
      // Get CSRF token first
      await fetch('/sanctum/csrf-cookie');

      const response = await fetch(`/api/v1/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_auth_token')}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update order status');
      }

      // Refresh orders
      fetchAllOrders();
    } catch (error) {
      alert('Gagal mengupdate status pesanan');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const getStatusOptions = (currentStatus: string) => {
    const options = [
      { value: 'pending', label: 'Menunggu' },
      { value: 'processing', label: 'Diproses' },
      { value: 'shipped', label: 'Dikirim' },
      { value: 'delivered', label: 'Diterima' },
      { value: 'cancelled', label: 'Dibatalkan' },
    ];

    // Filter out invalid status transitions
    if (currentStatus === 'cancelled' || currentStatus === 'delivered') {
      return options.filter(option => option.value === currentStatus);
    }

    return options.filter(option => {
      if (currentStatus === 'pending') {
        return ['processing', 'cancelled'].includes(option.value);
      }
      if (currentStatus === 'processing') {
        return ['shipped', 'cancelled'].includes(option.value);
      }
      if (currentStatus === 'shipped') {
        return ['delivered'].includes(option.value);
      }
      return false;
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Memuat data pesanan...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-600">
          Error: {error}
          <Button onClick={fetchAllOrders} className="ml-4">
            <RefreshCw className="h-4 w-4 mr-2" />
            Coba Lagi
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Kelola Pesanan</h1>
        <p className="text-gray-600">Pantau dan kelola semua pesanan pelanggan</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Menunggu</p>
                <p className="text-2xl font-bold text-gray-900">
                  {orders.filter(order => order.status === 'pending').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <RefreshCw className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Diproses</p>
                <p className="text-2xl font-bold text-gray-900">
                  {orders.filter(order => order.status === 'processing').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Truck className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Dikirim</p>
                <p className="text-2xl font-bold text-gray-900">
                  {orders.filter(order => order.status === 'shipped').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Selesai</p>
                <p className="text-2xl font-bold text-gray-900">
                  {orders.filter(order => order.status === 'delivered').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Pesanan</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nomor Pesanan</TableHead>
                <TableHead>Pelanggan</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order: Order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">
                    #{order.order_number}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{order.shipping_name}</p>
                      <p className="text-sm text-gray-600">{order.user?.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(order.created_at).toLocaleDateString('id-ID', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </TableCell>
                  <TableCell className="font-semibold">
                    Rp{order.total_amount.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(order.status)}>
                        {getStatusText(order.status)}
                      </Badge>
                      {updatingStatus === order.id?.toString() && (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                      >
                        <a href={`/orders/${order.id}`} target="_blank">
                          <Eye className="h-4 w-4 mr-1" />
                          Lihat
                        </a>
                      </Button>

                      <Select
                        value={order.status}
                        onValueChange={(value) => handleStatusUpdate(order.id.toString(), value)}
                        disabled={updatingStatus === order.id?.toString()}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {getStatusOptions(order.status).map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {orders.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Belum ada pesanan
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
