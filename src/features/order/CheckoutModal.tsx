import { useState } from 'react';
import QRCode from 'qrcode';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { X } from 'lucide-react';

interface CheckoutModalProps {
    totalAmount: number;
    onClose: () => void;
    onConfirm: (method: 'cash' | 'upi') => void;
}

export default function CheckoutModal({ totalAmount, onClose, onConfirm }: CheckoutModalProps) {
    const [paymentMethod, setPaymentMethod] = useState<'cash' | 'upi'>('cash');
    const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);

    const generateQR = async () => {
        try {
            // UPI ID format: upi://pay?pa=UPI_ID&pn=NAME&am=AMOUNT&cu=INR
            const upiUrl = `upi://pay?pa=shubhamreddy9172-2@okaxis&pn=Shubham Reddy&am=${totalAmount.toFixed(2)}&cu=INR`;
            const url = await QRCode.toDataURL(upiUrl);
            setQrCodeUrl(url);
        } catch (err) {
            console.error(err);
        }
    };

    // Generate QR when UPI is selected
    if (paymentMethod === 'upi' && !qrCodeUrl) {
        generateQR();
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md md:max-w-md mx-auto bg-white max-h-[90vh] overflow-y-auto">
                <div className="p-4 md:p-6 space-y-4 md:space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl md:text-2xl font-bold">Checkout</h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            aria-label="Close"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Total Amount */}
                    <div className="space-y-2">
                        <div className="flex justify-between text-lg md:text-xl font-medium">
                            <span>Total Amount</span>
                            <span>₹{totalAmount.toFixed(2)}</span>
                        </div>
                    </div>

                    {/* Payment Method */}
                    <div className="space-y-3 md:space-y-4">
                        <label className="block text-sm font-medium text-gray-700">Payment Method</label>
                        <div className="grid grid-cols-2 gap-3 md:gap-4">
                            <Button
                                variant={paymentMethod === 'cash' ? 'primary' : 'outline'}
                                onClick={() => setPaymentMethod('cash')}
                                className="h-11 md:h-12"
                            >
                                Cash
                            </Button>
                            <Button
                                variant={paymentMethod === 'upi' ? 'primary' : 'outline'}
                                onClick={() => setPaymentMethod('upi')}
                                className="h-11 md:h-12"
                            >
                                UPI / Online
                            </Button>
                        </div>
                    </div>

                    {/* QR Code */}
                    {paymentMethod === 'upi' && (
                        <div className="flex flex-col items-center justify-center p-4 md:p-6 border rounded-lg bg-gray-50">
                            {qrCodeUrl ? (
                                <img src={qrCodeUrl} alt="UPI QR Code" className="w-40 h-40 md:w-48 md:h-48" />
                            ) : (
                                <div className="w-40 h-40 md:w-48 md:h-48 bg-gray-200 animate-pulse rounded" />
                            )}
                            <p className="mt-3 text-sm text-gray-500">Scan to Pay</p>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-2 md:pt-4">
                        <Button
                            variant="outline"
                            className="flex-1 h-11 md:h-12"
                            onClick={onClose}
                        >
                            Cancel
                        </Button>
                        <Button
                            className="flex-1 bg-green-600 hover:bg-green-700 h-11 md:h-12"
                            onClick={() => onConfirm(paymentMethod)}
                        >
                            Confirm Payment
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
}
