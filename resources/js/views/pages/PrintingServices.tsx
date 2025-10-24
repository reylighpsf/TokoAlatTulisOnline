/**
 * Halaman Layanan Percetakan
 */

import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Upload, FileText, Printer } from 'lucide-react';

export default function PrintingServices() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const printingOptions = [
    {
      type: 'Cetak Warna',
      sizes: ['A4', 'A3', 'Letter'],
      pricePerPage: 0.25,
      description: 'Cetak warna berkualitas tinggi'
    },
    {
      type: 'Hitam Putih',
      sizes: ['A4', 'A3', 'Letter'],
      pricePerPage: 0.10,
      description: 'Cetak standar hitam dan putih'
    },
    {
      type: 'Cetak Foto',
      sizes: ['4x6', '5x7', '8x10'],
      pricePerPage: 0.50,
      description: 'Cetak kualitas foto premium'
    }
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Printer className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Layanan Percetakan</h1>
          <p className="text-gray-600 text-lg">
            Unggah file Anda dan dapatkan hasil cetakan dengan layanan profesional kami
          </p>
        </div>

        {/* Section Unggah File */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Unggah File Anda</h2>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">
              {selectedFile ? selectedFile.name : 'Seret dan lepas file Anda di sini, atau klik untuk memilih'}
            </p>
            <input
              type="file"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <Button asChild variant="outline" className="bg-transparent">
              <label htmlFor="file-upload" className="cursor-pointer">
                Pilih File
              </label>
            </Button>
          </div>
        </div>

        {/* Opsi Percetakan */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {printingOptions.map((option, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <FileText className="h-8 w-8 text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">{option.type}</h3>
              <p className="text-gray-600 text-sm mb-4">{option.description}</p>
              <div className="mb-4">
                <p className="font-medium mb-2">Ukuran Tersedia:</p>
                <div className="flex flex-wrap gap-2">
                  {option.sizes.map((size) => (
                    <span key={size} className="px-2 py-1 bg-gray-100 rounded text-sm">
                      {size}
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-2xl font-bold text-blue-600 mb-4">
                Rp {option.pricePerPage.toLocaleString()}/halaman
              </p>
              <Button className="w-full">Pilih Opsi</Button>
            </div>
          ))}
        </div>

        {/* Layanan Tambahan */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Layanan Tambahan</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">Layanan Jilid</h3>
              <p className="text-gray-600 text-sm mb-2">Jilid spiral, comb, atau thermal</p>
              <p className="text-blue-600 font-semibold">Mulai dari Rp 2.000</p>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">Laminasi</h3>
              <p className="text-gray-600 text-sm mb-2">Lindungi dokumen Anda</p>
              <p className="text-blue-600 font-semibold">Mulai dari Rp 1.500/halaman</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}