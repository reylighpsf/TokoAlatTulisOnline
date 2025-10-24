/**
 * Komponen Form untuk membuat/mengedit produk
 */

import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';
import { Card, CardContent } from '../ui/card';
import { useProductStore, Product } from '../../store/productStore';
import { Upload, X, Loader2, Package } from 'lucide-react';

interface ProductFormProps {
  product?: Product | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function ProductForm({ product, onSuccess, onCancel }: ProductFormProps) {
  const { createProduct, updateProduct, loading } = useProductStore();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: 'none',
    is_active: true,
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const categories = [
    'Buku Tulis',
    'Alat Tulis',
    'Kertas',
    'Map',
    'Pensil',
    'Pulpen',
    'Penghapus',
    'Penggaris',
    'Lainnya'
  ];

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description || '',
        price: product.price.toString(),
        stock: product.stock.toString(),
        category: product.category || 'none',
        is_active: product.is_active,
      });

      if (product.image) {
        setImagePreview(`/storage/${product.image}`);
      }
    }
  }, [product]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedFile(null);
    setImagePreview(product?.image ? `/storage/${product.image}` : null);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nama produk wajib diisi';
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Harga harus lebih dari 0';
    }

    if (!formData.stock || parseInt(formData.stock) < 0) {
      newErrors.stock = 'Stok tidak boleh negatif';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('description', formData.description);
      submitData.append('price', formData.price);
      submitData.append('stock', formData.stock);
      submitData.append('category', formData.category);
      submitData.append('is_active', formData.is_active.toString());
      if (selectedFile) submitData.append('image', selectedFile);

      if (product) {
        await updateProduct(product.id, submitData);
      } else {
        await createProduct(submitData);
      }

      onSuccess();
    } catch (error: any) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Image Upload */}
      <Card className="bg-white shadow-md border border-gray-200">
        <CardContent className="pt-6">
          <Label className="text-base font-medium">Gambar Produk</Label>
          <div className="mt-2">
            {imagePreview ? (
              <div className="relative inline-block">
                <img
                  src={imagePreview}
                  alt="Product preview"
                  className="w-32 h-32 object-cover rounded-lg border border-gray-300 bg-gray-100"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute -top-2 -right-2 h-6 w-6 p-0"
                  onClick={removeImage}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-100">
                <Package className="h-8 w-8 text-gray-400" />
              </div>
            )}
          </div>

          <div className="mt-4">
            <Input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id="image-upload"
            />
            <Label
              htmlFor="image-upload"
              className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-lg cursor-pointer hover:bg-gray-300 transition-colors"
            >
              <Upload className="h-4 w-4 mr-2" />
              {imagePreview ? 'Ganti Gambar' : 'Pilih Gambar'}
            </Label>
            <p className="text-sm text-gray-500 mt-1">PNG, JPG, GIF hingga 2MB</p>
          </div>
        </CardContent>
      </Card>

      {/* Basic Information */}
      <Card className="bg-white shadow-md border border-gray-200">
        <CardContent className="pt-6 space-y-4">
          <div>
            <Label htmlFor="name">Nama Produk *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Masukkan nama produk"
              className={`bg-white border ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
          </div>

          <div>
            <Label htmlFor="description">Deskripsi</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Masukkan deskripsi produk"
              rows={3}
              className="bg-white border border-gray-300"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Harga (Rp) *</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                placeholder="0.00"
                className={`bg-white border ${errors.price ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.price && <p className="text-sm text-red-500 mt-1">{errors.price}</p>}
            </div>

            <div>
              <Label htmlFor="stock">Stok *</Label>
              <Input
                id="stock"
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => handleInputChange('stock', e.target.value)}
                placeholder="0"
                className={`bg-white border ${errors.stock ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.stock && <p className="text-sm text-red-500 mt-1">{errors.stock}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="category">Kategori</Label>
            <Select value={formData.category} onValueChange={(value: string) => handleInputChange('category', value)}>
              <SelectTrigger className="bg-white border border-gray-300">
                <SelectValue placeholder="Pilih kategori" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="none">Tidak ada kategori</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked: boolean) => handleInputChange('is_active', checked)}
            />
            <Label htmlFor="is_active">Produk aktif</Label>
          </div>
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Batal
        </Button>
        <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white">
          {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          {product ? 'Update Produk' : 'Simpan Produk'}
        </Button>
      </div>
    </form>
  );
}
