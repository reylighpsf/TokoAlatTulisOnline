import { Link, useLocation } from "react-router-dom";
import { Button } from "../ui/button";
import { useAuthStore } from "../../store/authStore";
import { useCartStore } from "../../store/cartStore";
import { Menu, X, User, LogOut, ShoppingCart } from "lucide-react";
import { useState } from "react";
import CartDrawer from "./cart"; // ✅ pastikan kapital & file sesuai

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logoutUser } = useAuthStore();

  // ✅ Subscribe to cart state for automatic updates
  const { toggleCart, items } = useCartStore();

  const location = useLocation();

  // Calculate total items from cart state
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  const handleLogout = async () => {
    if (confirm("Apakah Anda yakin ingin logout?")) {
      await logoutUser();
      window.location.href = "/login";
    }
  };

  const navigation = [
    { name: "Beranda", href: "/", current: location.pathname === "/" },
    { name: "Produk", href: "/produk", current: location.pathname === "/produk" },
    { name: "Percetakan", href: "/percetakan", current: location.pathname === "/percetakan" },
    { name: "Riwayat Pesanan", href: "/orders", current: location.pathname === "/orders" },
  ];

  return (
    <>
      <nav className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            {/* 🖼️ Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">PercetakanAkbar</h1>
                <p className="text-xs text-gray-500">Alat Tulis & Percetakan</p>
              </div>
            </Link>

            {/* 🧭 Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                    item.current
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* 🧰 Desktop Actions */}
            <div className="hidden md:flex items-center space-x-4">
              {/* 🛒 Tombol Cart */}
              <button
                onClick={() => toggleCart(true)}
                className="relative p-2 rounded-xl text-gray-700 hover:bg-gray-100 transition"
              >
                <ShoppingCart className="h-6 w-6" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* 👤 User / Auth */}
              {user ? (
                <div className="flex items-center space-x-3">
                  <Link to="/profil">
                    <Button variant="outline" className="bg-transparent border-gray-300 rounded-xl">
                      <User className="h-4 w-4 mr-2" />
                      {user.name}
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    onClick={handleLogout}
                    className="bg-transparent border-red-300 text-red-600 hover:bg-red-50 rounded-xl"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link to="/login">
                    <Button variant="outline" className="bg-transparent border-gray-300 rounded-xl">
                      Masuk
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button className="bg-blue-600 hover:bg-blue-700 rounded-xl">
                      Daftar
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* 📱 Mobile Menu */}
            <div className="md:hidden flex items-center space-x-2">
              <button
                onClick={() => toggleCart(true)}
                className="relative p-2 rounded-xl text-gray-700 hover:bg-gray-100 transition"
              >
                <ShoppingCart className="h-6 w-6" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5">
                    {totalItems}
                  </span>
                )}
              </button>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-xl text-gray-700 hover:bg-gray-100 transition"
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* 🛒 Drawer Cart */}
      <CartDrawer />
    </>
  );
}
