// src/components/admin/ProductForm.tsx
import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Checkbox } from '../ui/checkbox';
import { Textarea } from '../ui/textarea';
import { useProductStore, Product } from '../../store/productStore';
import { Loader2, Trash2 } from 'lucide-react';

interface ProductFormProps {
  product?: Product | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function ProductForm({ product = null, onSuccess, onCancel }: ProductFormProps) {
  const isEdit = !!product;

  const { createProduct, updateProduct, loading, error, clearError } = useProductStore();

  const [name, setName] = useState(product?.name || '');
  const [description, setDescription] = useState(product?.description || '');
  const [price, setPrice] = useState(product?.price || 0);
  const [stock, setStock] = useState(product?.stock || 0);
  const [category, setCategory] = useState(product?.category || '');
  const [isActive, setIsActive] = useState(product?.is_active ?? true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(product?.image ? `/storage/${product.image}` : '');

  // Reset preview jika user ganti image
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setPreviewUrl('');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (isEdit && product?.id) {
        await updateProduct(product.id, {
          name,
          description,
          price,
          stock,
          category,
          is_active: isActive,
          image: imageFile || undefined,
        });
      } else {
        await createProduct({
          name,
          description,
          price,
          stock,
          category,
          is_active: isActive,
          image: imageFile || undefined,
        });
      }
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    return () => {
      clearError?.();
      if (previewUrl && imageFile) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl, imageFile, clearError]);

  const categories = [
    'Buku Tulis', 'Alat Tulis', 'Kertas', 'Map', 'Pensil',
    'Pulpen', 'Penghapus', 'Penggaris', 'Lainnya'
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Error Alert */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 font-medium text-gray-700">Nama Produk</label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium text-gray-700">Kategori</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2"
            required
          >
            <option value="">Pilih Kategori</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block mb-1 font-medium text-gray-700">Deskripsi</label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block mb-1 font-medium text-gray-700">Harga</label>
          <Input
            type="number"
            min={0}
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium text-gray-700">Stok</label>
          <Input
            type="number"
            min={0}
            value={stock}
            onChange={(e) => setStock(Number(e.target.value))}
            required
          />
        </div>
        <div className="flex items-center mt-6">
          <Checkbox
            checked={isActive}
            onCheckedChange={(checked: any) => setIsActive(Boolean(checked))}
            id="isActive"
          />
          <label htmlFor="isActive" className="ml-2 text-gray-700">Aktif</label>
        </div>
      </div>

      <div>
        <label className="block mb-1 font-medium text-gray-700">Gambar</label>
        <div className="flex items-center gap-4">
          <input type="file" accept="image/*" onChange={handleImageChange} />
          {previewUrl && (
            <div className="relative">
              <img src={previewUrl} alt="Preview" className="w-24 h-24 object-cover rounded-lg border" />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-4">
        {onCancel && (
          <Button variant="outline" onClick={onCancel} type="button">
            Batal
          </Button>
        )}
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin inline-block" />}
          {isEdit ? 'Update Produk' : 'Tambah Produk'}
        </Button>
      </div>
    </form>
  );
}
