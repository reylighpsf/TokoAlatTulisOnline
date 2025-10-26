/**
 * Halaman Profil Pengguna
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { useAuthStore } from '../store/authStore';
import { useOrderStore } from '../store/orderStore';
import { User, Mail, Edit3, Save, X, ShoppingBag, Package, CreditCard } from 'lucide-react';

export default function Profile() {
  const { user, updateProfile } = useAuthStore();
  const { orders, fetchOrders } = useOrderStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user, fetchOrders]);

  const handleSave = () => {
    if (formData.name.trim() && formData.email.trim()) {
      updateProfile(formData);
      setIsEditing(false);
    } else {
      alert('Nama dan email tidak boleh kosong');
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
    });
    setIsEditing(false);
  };

  const totalSpent = orders.reduce((sum, order) => sum + order.total_amount, 0);
  const completedOrders = orders.filter(order => order.status === 'delivered').length;

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Anda harus login untuk melihat profil</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                  <User className="h-10 w-10" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{user.name}</h1>
                  <p className="text-blue-100">{user.email}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="px-2 py-1 bg-white/20 rounded-full text-sm">
                      {user.role === 'admin' ? 'Administrator' : 'Pelanggan'}
                    </span>
                  </div>
                </div>
              </div>
              <Button
                onClick={() => setIsEditing(!isEditing)}
                variant="outline"
                className="bg-transparent border-white text-white hover:bg-white/20"
              >
                {isEditing ? (
                  <X className="h-4 w-4 mr-2" />
                ) : (
                  <Edit3 className="h-4 w-4 mr-2" />
                )}
                {isEditing ? 'Batal' : 'Edit Profil'}
              </Button>
            </div>
          </div>

          {/* Profile Form */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="h-4 w-4 inline mr-2" />
                  Nama Lengkap
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="px-3 py-2 bg-gray-50 rounded-xl">{user.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="h-4 w-4 inline mr-2" />
                  Email
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="px-3 py-2 bg-gray-50 rounded-xl">{user.email}</p>
                )}
              </div>
            </div>

            {isEditing && (
              <div className="flex justify-end space-x-3 mt-6">
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  className="bg-transparent border-gray-300"
                >
                  Batal
                </Button>
                <Button
                  onClick={handleSave}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Simpan Perubahan
                </Button>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="border-t border-gray-200 px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <Button asChild className="w-full">
                <Link to="/produk">
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Belanja Sekarang
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link to="/orders">
                  <Package className="h-4 w-4 mr-2" />
                  Riwayat Pesanan
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link to="/checkout">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Checkout
                </Link>
              </Button>
            </div>
          </div>

          {/* Account Stats */}
          <div className="border-t border-gray-200 px-6 py-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-blue-600">{orders.length}</p>
                <p className="text-sm text-gray-600">Total Pesanan</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">Rp {totalSpent.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Total Belanja</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-600">{completedOrders}</p>
                <p className="text-sm text-gray-600">Pesanan Selesai</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-600">
                  {user.created_at ? new Date(user.created_at).getFullYear() : '2024'}
                </p>
                <p className="text-sm text-gray-600">Member Sejak</p>
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="border-t border-gray-200 px-6 py-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Pesanan Terbaru</span>
                  <Button asChild variant="outline" size="sm">
                    <Link to="/orders">Lihat Semua</Link>
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium">Belum ada pesanan</p>
                    <p className="text-sm">Mulai berbelanja untuk melihat riwayat pesanan Anda</p>
                    <Button asChild className="mt-4">
                      <Link to="/produk">Mulai Belanja</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {orders.slice(0, 3).map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">#{order.order_number}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(order.created_at).toLocaleDateString('id-ID')}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">Rp{order.total_amount.toLocaleString()}</p>
                          <p className={`text-sm ${
                            order.status === 'delivered' ? 'text-green-600' :
                            order.status === 'pending' ? 'text-yellow-600' :
                            order.status === 'processing' ? 'text-blue-600' :
                            order.status === 'shipped' ? 'text-purple-600' :
                            'text-red-600'
                          }`}>
                            {order.status === 'delivered' ? 'Selesai' :
                             order.status === 'pending' ? 'Menunggu' :
                             order.status === 'processing' ? 'Diproses' :
                             order.status === 'shipped' ? 'Dikirim' :
                             'Dibatalkan'}
                          </p>
                        </div>
                        <Button asChild variant="outline" size="sm">
                          <Link to={`/orders/${order.id}`}>Detail</Link>
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
