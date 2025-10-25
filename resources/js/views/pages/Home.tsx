/**
 * Halaman Beranda PrintShop
 */

import { Link } from 'react-router-dom'
import { Button } from '../components/ui/button';
import { ArrowRight, Star, Shield, Truck, Headphones } from 'lucide-react';

export default function Home() {
  const featuredProducts = [
    {
      id: '1',
      name: 'Set Buku Catatan Premium',
      price: 25.99,
      image: 'https://pub-cdn.sider.ai/u/U09GHA636ZJ/web-coder/68f79c71126ded33f3b21fa2/resource/02bc999f-8900-4854-b7c5-1cc27834fa26.jpg',
      rating: 4.8
    },
    {
      id: '2', 
      name: 'Paket Pulpen Profesional',
      price: 15.50,
      image: 'https://pub-cdn.sider.ai/u/U09GHA636ZJ/web-coder/68f79c71126ded33f3b21fa2/resource/94f3385c-7c10-4fe4-8c4f-a0b38b43b375.jpg',
      rating: 4.6
    },
    {
      id: '3',
      name: 'Set Spidol Artistik',
      price: 34.99,
      image: 'https://pub-cdn.sider.ai/u/U09GHA636ZJ/web-coder/68f79c71126ded33f3b21fa2/resource/0e506edc-9b3b-4a9e-9984-83d4dc59abd0.jpg',
      rating: 4.8
    }
  ];

  const services = [
    {
      icon: <Truck className="h-8 w-8" />,
      title: 'Gratis Ongkir',
      description: 'Gratis pengiriman untuk pembelian di atas Rp 100.000'
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: 'Garansi 100%',
      description: 'Garansi kepuasan 100% untuk semua produk'
    },
    {
      icon: <Headphones className="h-8 w-8" />,
      title: 'Support 24/7',
      description: 'Tim support siap membantu kapan saja'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Selamat Datang di{' '}
              <span className="text-yellow-300">PercetakanAkbar</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Tempat terbaik untuk alat tulis berkualitas dan layanan percetakan 
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/produk">
                <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold rounded-xl">
                  Belanja Sekarang
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/percetakan">
                <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white/20 px-8 py-3 text-lg font-semibold rounded-xl">
                  Layanan Percetakan
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Mengapa Memilih PrintShop?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Kami memberikan yang terbaik untuk kebutuhan alat tulis dan percetakan Anda
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-lg text-center hover:shadow-xl transition-shadow">
                <div className="text-blue-600 mb-4 flex justify-center">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-600">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Produk Unggulan
            </h2>
            <p className="text-xl text-gray-600">
              Temukan produk terbaik kami yang sudah teruji kualitasnya
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {featuredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group">
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-1 mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(product.rating) 
                              ? 'text-yellow-400 fill-current' 
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 ml-1">
                      ({product.rating})
                    </span>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-gray-900">
                      Rp {product.price.toLocaleString()}
                    </span>
                    <Link to="/produk">
                      <Button className="bg-blue-600 hover:bg-blue-700 rounded-xl">
                        Beli Sekarang
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link to="/produk">
              <Button variant="outline" className="bg-transparent border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3 text-lg font-semibold rounded-xl">
                Lihat Semua Produk
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Siap Memulai Proyek Percetakan Anda?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Upload file Anda sekarang dan dapatkan hasil cetak yang sempurna
          </p>
          <Link to="/percetakan">
            <Button className="bg-white text-green-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold rounded-xl">
              Mulai Percetakan
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}