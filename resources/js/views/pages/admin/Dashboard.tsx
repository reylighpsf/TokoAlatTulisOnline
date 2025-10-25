/**
 * Dashboard Admin untuk mengelola toko
 */
import { useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { useAuthStore } from '../../store/authStore';
import { useProductStore } from '../../store/productStore';
import { Users, Package, Printer, DollarSign, TrendingUp, AlertCircle } from 'lucide-react';
import AdminNavbar from '../../components/admin/AdminNavbar'; // ✅ Tambahkan di sini
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  let navigate = useNavigate();
  const { products, fetchProducts } = useProductStore();
  const { user, isAdminAuthenticated, isLoading } = useAuthStore();

  // ⏳ Tampilkan loading sementara data auth belum siap
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Memuat dashboard...</p>
      </div>
    );
  }

  // 🚫 Jika bukan admin
  if (!isAdminAuthenticated && user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Akses Ditolak</h1>
          <p className="text-gray-600">Anda tidak memiliki akses ke halaman ini.</p>
        </div>
      </div>
    );
  }

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchProducts();
    }
  }, [user, fetchProducts]);

  const stats = [
    {
      title: 'Total Pengguna',
      value: '1,234',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Total Produk',
      value: products.length.toString(),
      icon: Package,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Pesanan Percetakan',
      value: '89',
      icon: Printer,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Pendapatan Bulan Ini',
      value: 'Rp 12.5M',
      icon: DollarSign,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  const recentOrders = [
    { id: 'ORD-001', customer: 'Budi Santoso', amount: 'Rp 250.000', status: 'Completed' },
    { id: 'ORD-002', customer: 'Sari Dewi', amount: 'Rp 150.000', status: 'Processing' },
    { id: 'ORD-003', customer: 'Ahmad Rizki', amount: 'Rp 75.000', status: 'Pending' },
    { id: 'ORD-004', customer: 'Maya Sari', amount: 'Rp 300.000', status: 'Completed' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ✅ Navbar Admin langsung di dalam halaman */}
      <AdminNavbar />

      <main className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Admin</h1>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
              <div className="flex items-center mt-4 text-sm text-green-600">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span>+12.5% dari bulan lalu</span>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Orders & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Pesanan Terbaru</h2>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-xl"
                >
                  <div>
                    <p className="font-semibold text-gray-900">{order.id}</p>
                    <p className="text-sm text-gray-600">{order.customer}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{order.amount}</p>
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === 'Completed'
                          ? 'bg-green-100 text-green-800'
                          : order.status === 'Processing'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4 bg-transparent border-gray-300">
              Lihat Semua Pesanan
            </Button>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Aksi Cepat</h2>
            <div className="grid grid-cols-2 gap-4">
              <Button
                className="h-16 bg-blue-600 hover:bg-blue-700 rounded-xl"
                onClick={() => navigate ('/admin/kelolaproducts')}
                >
                <Package className="h-5 w-5 mr-2" />
                Kelola Produk ({products.length})
              </Button>
              <Button variant="outline" className="h-16 bg-transparent border-gray-300 rounded-xl">
                <Users className="h-5 w-5 mr-2" />
                Kelola User
              </Button>
              <Button variant="outline" className="h-16 bg-transparent border-gray-300 rounded-xl">
                <Printer className="h-5 w-5 mr-2" />
                Layanan Percetakan
              </Button>
              <Button variant="outline" className="h-16 bg-transparent border-gray-300 rounded-xl">
                <DollarSign className="h-5 w-5 mr-2" />
                Laporan Keuangan
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
