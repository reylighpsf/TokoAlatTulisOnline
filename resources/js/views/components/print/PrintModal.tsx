import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { usePrintStore } from '../../store/printStore';
import { useAuthStore } from '../../store/authStore';
import { Loader2, FileText, CreditCard } from 'lucide-react';

interface PrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedFile: File | null;
}

export default function PrintModal({ isOpen, onClose, selectedFile }: PrintModalProps) {
  const [printType, setPrintType] = useState<'color' | 'bw' | 'photo'>('bw');
  const [paperSize, setPaperSize] = useState<'A4' | 'A3' | 'Letter' | '4x6' | '5x7' | '8x10'>('A4');
  const [copies, setCopies] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bank_transfer'>('cod');
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'paid'>('pending');

  const { createPrintOrder, loading } = usePrintStore();
  const { user } = useAuthStore();

  const printOptions = {
    color: { price: 0.25, sizes: ['A4', 'A3', 'Letter'] },
    bw: { price: 0.10, sizes: ['A4', 'A3', 'Letter'] },
    photo: { price: 0.50, sizes: ['4x6', '5x7', '8x10'] },
  };

  const calculateTotal = () => {
    const pricePerPage = printOptions[printType].price;
    // Assuming 1 page per file for simplicity - in real app, you'd count pages
    const totalPages = 1;
    return pricePerPage * totalPages * copies;
  };

  const handleSubmit = async () => {
    if (!selectedFile || !user) return;

    const printData = {
      file_name: selectedFile.name,
      file_url: '', // This would be uploaded to server first
      print_type: printType,
      paper_size: paperSize,
      copies,
      total_pages: 1, // Would be calculated from file
      price_per_page: printOptions[printType].price,
      total_amount: calculateTotal(),
      payment_method: paymentMethod,
      payment_status: paymentStatus,
    };

    const result = await createPrintOrder(printData);
    if (result) {
      onClose();
      // Reset form
      setPrintType('bw');
      setPaperSize('A4');
      setCopies(1);
      setPaymentMethod('cod');
      setPaymentStatus('pending');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Konfirmasi Pesanan Print
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* File Info */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm font-medium">File yang dipilih:</p>
            <p className="text-sm text-gray-600">{selectedFile?.name}</p>
          </div>

          {/* Print Type */}
          <div>
            <Label className="text-sm font-medium">Tipe Cetakan</Label>
            <RadioGroup value={printType} onValueChange={(value: any) => setPrintType(value)} className="mt-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="bw" id="bw" />
                <Label htmlFor="bw">Hitam Putih - Rp 0.10/halaman</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="color" id="color" />
                <Label htmlFor="color">Warna - Rp 0.25/halaman</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="photo" id="photo" />
                <Label htmlFor="photo">Foto - Rp 0.50/halaman</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Paper Size */}
          <div>
            <Label className="text-sm font-medium">Ukuran Kertas</Label>
            <Select value={paperSize} onValueChange={(value: any) => setPaperSize(value)}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {printOptions[printType].sizes.map((size) => (
                  <SelectItem key={size} value={size}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Copies */}
          <div>
            <Label htmlFor="copies" className="text-sm font-medium">Jumlah Copy</Label>
            <Input
              id="copies"
              type="number"
              min="1"
              value={copies}
              onChange={(e) => setCopies(parseInt(e.target.value) || 1)}
              className="mt-1"
            />
          </div>

          {/* Payment Method */}
          <div>
            <Label className="text-sm font-medium">Metode Pembayaran</Label>
            <RadioGroup value={paymentMethod} onValueChange={(value: any) => setPaymentMethod(value)} className="mt-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="cod" id="cod" />
                <Label htmlFor="cod">Bayar di Tempat</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="bank_transfer" id="bank_transfer" />
                <Label htmlFor="bank_transfer">Transfer Bank</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Payment Status */}
          <div>
            <Label className="text-sm font-medium">Status Pembayaran</Label>
            <RadioGroup value={paymentStatus} onValueChange={(value: any) => setPaymentStatus(value)} className="mt-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pending" id="pending" />
                <Label htmlFor="pending">Menunggu Pembayaran</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="paid" id="paid" />
                <Label htmlFor="paid">Sudah Dibayar</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Total */}
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-medium">Total:</span>
              <span className="text-lg font-bold text-blue-600">
                Rp {calculateTotal().toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Batal
          </Button>
          <Button onClick={handleSubmit} disabled={loading || !selectedFile}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Memproses...
              </>
            ) : (
              <>
                <CreditCard className="h-4 w-4 mr-2" />
                Pesan Sekarang
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
