import { useState } from 'react';
import QRCode from 'qrcode';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md p-6 bg-white space-y-6">
                <h2 className="text-xl font-bold">Checkout</h2>

                <div className="space-y-2">
                    <div className="flex justify-between text-lg font-medium">
                        <span>Total Amount</span>
                        <span>₹{totalAmount.toFixed(2)}</span>
                    </div>
                </div>

                <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700">Payment Method</label>
                    <div className="grid grid-cols-2 gap-4">
                        <Button
                            variant={paymentMethod === 'cash' ? 'primary' : 'outline'}
                            onClick={() => setPaymentMethod('cash')}
                        >
                            Cash
                        </Button>
                        <Button
                            variant={paymentMethod === 'upi' ? 'primary' : 'outline'}
                            onClick={() => setPaymentMethod('upi')}
                        >
                            UPI / Online
                        </Button>
                    </div>
                </div>

                {paymentMethod === 'upi' && (
                    <div className="flex flex-col items-center justify-center p-4 border rounded-lg bg-gray-50">
                        {qrCodeUrl ? (
                            <img src={qrCodeUrl} alt="UPI QR Code" className="w-48 h-48" />
                        ) : (
                            <div className="w-48 h-48 bg-gray-200 animate-pulse" />
                        )}
                        <p className="mt-2 text-sm text-gray-500">Scan to Pay</p>
                    </div>
                )}

                <div className="flex space-x-3 pt-4">
                    <Button variant="outline" className="flex-1" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button className="flex-1 bg-green-600 hover:bg-green-700" onClick={() => onConfirm(paymentMethod)}>
                        Confirm Payment
                    </Button>
                </div>
            </Card>
        </div>
    );
}
