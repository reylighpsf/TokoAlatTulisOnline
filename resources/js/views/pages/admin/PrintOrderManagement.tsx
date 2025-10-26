/**
 * Halaman Admin - Manajemen Pesanan Print
 */

import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog';
import { Textarea } from '../../components/ui/textarea';
import { useAuthStore } from '../../store/authStore';
import { api } from '../../lib/api';
import { PrintOrder } from '../../types';
import { Printer, Eye, Edit, Trash2, CheckCircle, XCircle, Clock, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import AdminNavbar from '../../components/admin/AdminNavbar';

export default function PrintOrderManagement() {
  const { user, isAdminAuthenticated, isLoading } = useAuthStore();
  const [printOrders, setPrintOrders] = useState<PrintOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<PrintOrder | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const [updateForm, setUpdateForm] = useState({
    status: '',
    payment_status: '',
    notes: ''
  });

  // ✅ Ambil role & token dari sessionStorage untuk fallback
  const storedRole = sessionStorage.getItem('role');
  const storedToken = sessionStorage.getItem('token');
  const role = user?.role || storedRole?.toLowerCase();

  // 🔄 Jika belum autentikasi dan tidak ada token → arahkan ke login admin
  if (!isAdminAuthenticated && !storedToken) {
    return <Navigate to="/admin" replace />;
  }

  // 🔄 Jika role bukan admin → tampilkan akses ditolak
  if (role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Akses Ditolak</h1>
          <p className="text-gray-600">
            Anda tidak memiliki izin untuk mengakses halaman ini.
          </p>
        </div>
      </div>
    );
  }

  useEffect(() => {
    fetchPrintOrders();
  }, [statusFilter, paymentFilter]);

  const fetchPrintOrders = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (paymentFilter !== 'all') params.append('payment_status', paymentFilter);

      const response = await api.get(`/v1/admin/print-orders?${params.toString()}`);
      setPrintOrders(response.data.data.data || []);
    } catch (error: any) {
      toast.error('Gagal mengambil data pesanan print');
      console.error('Error fetching print orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = (order: PrintOrder) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

  const handleUpdateOrder = (order: PrintOrder) => {
    setSelectedOrder(order);
    setUpdateForm({
      status: order.status,
      payment_status: order.payment_status,
      notes: order.notes || ''
    });
    setShowUpdateModal(true);
  };

  const handleUpdateSubmit = async () => {
    if (!selectedOrder) return;

    try {
      await api.patch(`/v1/admin/print-orders/${selectedOrder.id}/status`, updateForm);
      toast.success('Status pesanan berhasil diperbarui');
      setShowUpdateModal(false);
      fetchPrintOrders();
    } catch (error: any) {
      toast.error('Gagal memperbarui status pesanan');
      console.error('Error updating order:', error);
    }
  };

  const handleDeleteOrder = async (orderId: string | number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus pesanan ini?')) return;

    try {
      await api.delete(`/v1/print-orders/${orderId}`);
      toast.success('Pesanan berhasil dihapus');
      fetchPrintOrders();
    } catch (error: any) {
      toast.error('Gagal menghapus pesanan');
      console.error('Error deleting order:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'processing': return <AlertCircle className="h-4 w-4 text-blue-500" />;
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'cancelled': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return variants[status] || 'bg-gray-100 text-gray-800';
  };

  const getPaymentBadge = (status: string) => {
    const variants: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
    };
    return variants[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Kelola Pesanan Print</h1>
            <p className="text-gray-600">Kelola semua pesanan percetakan</p>
          </div>
          <Printer className="h-8 w-8 text-blue-600" />
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filter Pesanan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2">Status Pesanan</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="pending">Menunggu</SelectItem>
                    <SelectItem value="processing">Diproses</SelectItem>
                    <SelectItem value="completed">Selesai</SelectItem>
                    <SelectItem value="cancelled">Dibatalkan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2">Status Pembayaran</label>
                <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="pending">Menunggu Pembayaran</SelectItem>
                    <SelectItem value="paid">Sudah Dibayar</SelectItem>
                    <SelectItem value="failed">Pembayaran Gagal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Printer className="h-5 w-5 mr-2" />
              Daftar Pesanan Print ({printOrders.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                <span className="ml-2 text-gray-600">Memuat pesanan print...</span>
              </div>
            ) : printOrders.length === 0 ? (
              <div className="text-center py-8">
                <Printer className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada pesanan print</h3>
                <p className="text-gray-600">Pesanan print akan muncul di sini.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Pelanggan</TableHead>
                    <TableHead>File</TableHead>
                    <TableHead>Tipe Cetak</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Pembayaran</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {printOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>#{order.id}</TableCell>
                      <TableCell>{order.user?.name}</TableCell>
                      <TableCell className="max-w-xs truncate">{order.file_name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{order.print_type.toUpperCase()}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusBadge(order.status)}>
                          {getStatusIcon(order.status)}
                          <span className="ml-1 capitalize">{order.status}</span>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getPaymentBadge(order.payment_status)}>
                          {order.payment_status === 'paid' ? '✓' : order.payment_status === 'failed' ? '✗' : '○'}
                          <span className="ml-1 capitalize">{order.payment_status}</span>
                        </Badge>
                      </TableCell>
                      <TableCell>Rp {order.total_amount.toLocaleString()}</TableCell>
                      <TableCell>{new Date(order.created_at).toLocaleDateString('id-ID')}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetail(order)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUpdateOrder(order)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          {order.status === 'pending' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteOrder(order.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Detail Modal */}
        <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Detail Pesanan Print #{selectedOrder?.id}</DialogTitle>
            </DialogHeader>

            {selectedOrder && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Pelanggan</label>
                    <p className="text-sm text-gray-600">{selectedOrder.user?.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <p className="text-sm text-gray-600">{selectedOrder.user?.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">File</label>
                    <p className="text-sm text-gray-600">{selectedOrder.file_name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Tipe Cetak</label>
                    <p className="text-sm text-gray-600 capitalize">{selectedOrder.print_type}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Ukuran Kertas</label>
                    <p className="text-sm text-gray-600">{selectedOrder.paper_size}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Jumlah Copy</label>
                    <p className="text-sm text-gray-600">{selectedOrder.copies}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Total Halaman</label>
                    <p className="text-sm text-gray-600">{selectedOrder.total_pages}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Harga per Halaman</label>
                    <p className="text-sm text-gray-600">Rp {selectedOrder.price_per_page.toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Metode Pembayaran</label>
                    <p className="text-sm text-gray-600 capitalize">{selectedOrder.payment_method}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Total Amount</label>
                    <p className="text-sm font-bold text-blue-600">Rp {selectedOrder.total_amount.toLocaleString()}</p>
                  </div>
                </div>

                {selectedOrder.notes && (
                  <div>
                    <label className="text-sm font-medium">Catatan</label>
                    <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">{selectedOrder.notes}</p>
                  </div>
                )}

                <div className="flex gap-2">
                  <Badge className={getStatusBadge(selectedOrder.status)}>
                    Status: {selectedOrder.status}
                  </Badge>
                  <Badge className={getPaymentBadge(selectedOrder.payment_status)}>
                    Pembayaran: {selectedOrder.payment_status}
                  </Badge>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDetailModal(false)}>
                Tutup
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Update Modal */}
        <Dialog open={showUpdateModal} onOpenChange={setShowUpdateModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Status Pesanan #{selectedOrder?.id}</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Status Pesanan</label>
                <Select
                  value={updateForm.status}
                  onValueChange={(value) => setUpdateForm(prev => ({ ...prev, status: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Menunggu</SelectItem>
                    <SelectItem value="processing">Diproses</SelectItem>
                    <SelectItem value="completed">Selesai</SelectItem>
                    <SelectItem value="cancelled">Dibatalkan</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Status Pembayaran</label>
                <Select
                  value={updateForm.payment_status}
                  onValueChange={(value) => setUpdateForm(prev => ({ ...prev, payment_status: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Menunggu Pembayaran</SelectItem>
                    <SelectItem value="paid">Sudah Dibayar</SelectItem>
                    <SelectItem value="failed">Pembayaran Gagal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Catatan</label>
                <Textarea
                  value={updateForm.notes}
                  onChange={(e) => setUpdateForm(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Tambahkan catatan jika diperlukan..."
                  rows={3}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowUpdateModal(false)}>
                Batal
              </Button>
              <Button onClick={handleUpdateSubmit}>
                Update Status
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
