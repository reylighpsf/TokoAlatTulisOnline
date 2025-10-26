import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useAuthStore } from "../../store/authStore";
import {
  LogOut,
  User,
  Settings,
  BarChart3,
  Package,
  Users,
  Printer,
  ShoppingCart,
} from "lucide-react";

export default function AdminNavbar() {
  const { admin, logoutAdmin, isAdminAuthenticated } = useAuthStore();
  let navigate = useNavigate();
  const location = useLocation();

 const handleLogout = async () => {
    if (confirm("Apakah Anda yakin ingin logout?")) {
      await logoutAdmin();
      navigate('/login', { replace: true });
    }
  };

  const adminNavigation = [
    { name: "Dashboard", href: "/admin", icon: BarChart3 },
    { name: 'Kelola Produk', href: '/admin/kelolaproducts', icon: Package },
    { name: 'Kelola Pesanan', href: '/admin/orders', icon: ShoppingCart },
    { name: "Kelola User", href: "/admin/users", icon: Users },
    { name: "Layanan Percetakan", href: "/admin/print-orders", icon: Printer },
  ];

  return (
    <nav className="bg-gray-900 shadow-lg border-b border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Admin */}
          <Link to="/admin" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-red-600 to-orange-600 rounded-xl flex items-center justify-center">
              <Settings className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Admin Panel</h1>
              <p className="text-xs text-gray-400">PercetakanAkbar</p>
            </div>
          </Link>

          {/* Navigasi */}
          <div className="hidden md:flex items-center space-x-4">
            {adminNavigation.map((item) => {
              const isActive = location.pathname.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-gray-800 text-white"
                      : "text-gray-300 hover:text-white hover:bg-gray-800"
                  }`}
                >
                  <item.icon className="h-4 w-4 mr-2" />
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Info Admin + Logout */}
          <div className="flex items-center space-x-4">
            {isAdminAuthenticated && (
              <div className="hidden md:flex items-center space-x-2 text-sm">
                <User className="h-4 w-4 text-gray-400" />
                <span className="text-gray-300">{admin?.name || "Admin"}</span>
                <span className="text-xs bg-red-600 text-white px-2 py-1 rounded-full">
                  Admin
                </span>
              </div>
            )}

            <Button
              variant="outline"
              onClick={handleLogout}
              className="bg-transparent border-red-500 text-red-400 hover:bg-red-500 hover:text-white rounded-lg"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
