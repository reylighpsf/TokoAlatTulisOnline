/**
 * Halaman Produk dengan fungsionalitas keranjang
 */

import { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Product } from '../types';
import { Filter, Grid, List, Star, Heart, ShoppingCart, Loader2 } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useProductStore } from '../store/productStore';

export default function Products() {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'stationery' | 'printing' | 'copy'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'rating'>('name');
  const { addItem } = useCartStore();
  const { products: apiProducts, loading: productsLoading, fetchProducts } = useProductStore();

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts({ is_active: true });
  }, [fetchProducts]);

  // Combine static products with API products
  const staticProducts: (Product & { rating?: number; reviews?: number })[] = [
    {
      id: '1',
      name: 'Set Buku Catatan Premium',
      description: 'Set 3 buku catatan berkualitas tinggi dengan ukuran berbeda. Sempurna untuk pelajar dan profesional.',
      price: 25.99,
      category: 'stationery',
      image: 'https://pub-cdn.sider.ai/u/U09GHA636ZJ/web-coder/68f79c71126ded33f3b21fa2/resource/cc64623b-95d7-4ef2-8325-c34b5fc7160d.jpg',
      stock: 50,
      createdAt: '2024-01-15',
      rating: 4.8,
      reviews: 124
    },
    {
      id: '2',
      name: 'Paket Pulpen Profesional',
      description: '12 pulpen penulisan halus dengan warna tinta berbeda. Ideal untuk penggunaan kantor.',
      price: 15.50,
      category: 'stationery',
      image: 'https://pub-cdn.sider.ai/u/U09GHA636ZJ/web-coder/68f79c71126ded33f3b21fa2/resource/8cae7bfa-e2c1-4d9a-9e69-ce56444b11df.jpg',
      stock: 100,
      createdAt: '2024-01-14',
      rating: 4.6,
      reviews: 89
    },
    {
      id: '3',
      name: 'Cetak Warna - A4',
      description: 'Layanan cetak warna berkualitas tinggi dengan warna cerah dan detail tajam.',
      price: 0.25,
      category: 'printing',
      image: 'https://pub-cdn.sider.ai/u/U09GHA636ZJ/web-coder/68f79c71126ded33f3b21fa2/resource/3ececc61-048b-4352-a494-07c954ea79ae.jpg',
      stock: 999,
      createdAt: '2024-01-13',
      rating: 4.9,
      reviews: 256
    },
    {
      id: '4',
      name: 'Fotokopi Hitam Putih - A4',
      description: 'Layanan fotokopi standar hitam putih dengan teks yang jelas dan tajam.',
      price: 0.10,
      category: 'copy',
      image: 'https://pub-cdn.sider.ai/u/U09GHA636ZJ/web-coder/68f79c71126ded33f3b21fa2/resource/9a70d56e-0d01-441c-a317-559874cdf034.jpg',
      stock: 999,
      createdAt: '2024-01-12',
      rating: 4.7,
      reviews: 187
    },
    {
      id: '5',
      name: 'Set Spidol Artistik',
      description: '48 warna cerah untuk proyek kreatif dan karya seni profesional.',
      price: 34.99,
      category: 'stationery',
      image: 'https://pub-cdn.sider.ai/u/U09GHA636ZJ/web-coder/68f79c71126ded33f3b21fa2/resource/166d3a4f-5753-4342-8999-a657ee711279.jpg',
      stock: 25,
      createdAt: '2024-01-11',
      rating: 4.8,
      reviews: 67
    },
    {
      id: '6',
      name: 'Paket Sticky Notes',
      description: 'Sticky notes warna-warni dalam berbagai ukuran untuk organisasi dan pengingat.',
      price: 8.99,
      category: 'stationery',
      image: 'https://pub-cdn.sider.ai/u/U09GHA636ZJ/web-coder/68f79c71126ded33f3b21fa2/resource/99bc4e26-1f1d-43aa-b806-b4dd4aa556d8.jpg',
      stock: 75,
      createdAt: '2024-01-10',
      rating: 4.5,
      reviews: 42
    }
  ];

  // Combine API products with static products
  const allProducts = [
    ...apiProducts.map(product => ({
      ...product,
      rating: 4.5, // Default rating for API products
      reviews: 10, // Default reviews for API products
      category: product.category || 'stationery',
      createdAt: product.created_at || new Date().toISOString(),
      id: product.id.toString() // Convert id to string
    })),
    ...staticProducts
  ];

  const filteredProducts = selectedCategory === 'all'
    ? allProducts
    : allProducts.filter(product => product.category === selectedCategory);

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price') return a.price - b.price;
    if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
    return a.name.localeCompare(b.name);
  });

  const handleAddToCart = (product: Product) => {
    addItem(product);
    // Bisa tambahkan toast notification di sini
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Produk Kami</h1>
          <p className="text-xl text-gray-600">
            Temukan koleksi lengkap alat tulis dan layanan percetakan kami
          </p>
        </div>

        {/* Filters dan Controls */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {['all', 'stationery', 'printing', 'copy'].map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  className={`rounded-xl ${
                    selectedCategory === category 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-transparent border-gray-300 hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedCategory(category as any)}
                >
                  {category === 'all' ? 'Semua' : 
                   category === 'stationery' ? 'Alat Tulis' :
                   category === 'printing' ? 'Percetakan' : 'Fotokopi'}
                </Button>
              ))}
            </div>

            {/* View Controls */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg ${
                    viewMode === 'grid' ? 'bg-white shadow-sm' : 'text-gray-500'
                  }`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg ${
                    viewMode === 'list' ? 'bg-white shadow-sm' : 'text-gray-500'
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-white border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="name">Urutkan berdasarkan Nama</option>
                <option value="price">Urutkan berdasarkan Harga</option>
                <option value="rating">Urutkan berdasarkan Rating</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid/List */}
        <div className={
          viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            : "space-y-6"
        }>
          {sortedProducts.map((product) => (
            <div 
              key={product.id} 
              className={
                viewMode === 'grid'
                  ? "bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100 group"
                  : "bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 group flex"
              }
            >
              {/* Product Image */}
              <div className={
                viewMode === 'grid'
                  ? "relative aspect-square overflow-hidden"
                  : "relative w-48 flex-shrink-0"
              }>
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <button className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
                  <Heart className="h-4 w-4 text-gray-600" />
                </button>
                {product.stock < 10 && (
                  <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                    Stok Sedikit
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className={viewMode === 'grid' ? "p-6" : "p-6 flex-1"}>
                <div className="flex items-center gap-1 mb-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(product.rating || 0) 
                            ? 'text-yellow-400 fill-current' 
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 ml-1">
                    ({product.reviews || 0})
                  </span>
                </div>
                
                <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-gray-900">Rp {product.price.toLocaleString()}</span>
                    {product.category === 'printing' && (
                      <span className="text-sm text-gray-500">per halaman</span>
                    )}
                  </div>
                  <span className={`text-sm ${
                    product.stock > 10 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {product.stock > 10 ? 'Tersedia' : 'Stok Sedikit'}
                  </span>
                </div>
                
                <Button 
                  onClick={() => handleAddToCart(product)}
                  className="w-full bg-blue-600 hover:bg-blue-700 rounded-xl py-3 font-semibold flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="h-4 w-4" />
                  Tambah ke Keranjang
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button variant="outline" className="bg-transparent border-gray-300 rounded-xl px-8 py-3">
            Muat Lebih Banyak Produk
          </Button>
        </div>
      </div>
    </div>
  );
}