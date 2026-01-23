'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Check, Zap, TrendingUp, Shield, Plus } from 'lucide-react';

interface TokenPackage {
  id: string;
  name: string;
  tokens: number;
  price: number;
  popular?: boolean;
  savings?: string;
}

const tokenPackages: TokenPackage[] = [
  {
    id: 'starter',
    name: 'Starter Pack',
    tokens: 50000,
    price: 15,
  },
  {
    id: 'professional',
    name: 'Professional Pack',
    tokens: 150000,
    price: 39,
    popular: true,
    savings: 'Save 13%',
  },
  {
    id: 'enterprise',
    name: 'Enterprise Pack',
    tokens: 500000,
    price: 119,
    savings: 'Save 20%',
  },
];

export function PurchaseTokensDialog() {
  const [open, setOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<string>('professional');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'invoice'>('card');
  const [customTokens, setCustomTokens] = useState<string>('100000');

  // Calculate custom package price (base rate: $0.30 per 1000 tokens)
  const getCustomPrice = () => {
    const tokens = parseInt(customTokens) || 0;
    return ((tokens / 1000) * 0.30).toFixed(2);
  };

  const getCurrentPackageInfo = () => {
    if (selectedPackage === 'custom') {
      return {
        name: 'Custom Package',
        tokens: parseInt(customTokens) || 0,
        price: parseFloat(getCustomPrice()),
      };
    }
    return tokenPackages.find((p) => p.id === selectedPackage);
  };

  const handlePurchase = () => {
    const pkg = getCurrentPackageInfo();
    alert(`Processing purchase of ${pkg?.name} for $${pkg?.price}...`);
    setOpen(false);
  };

  return (
    <>
      {/* Trigger Button */}
      <Button
        onClick={() => setOpen(true)}
        className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2"
        size="lg"
      >
        <Plus className="w-4 h-4" />
        Purchase Tokens
      </Button>

      {/* Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="!w-[70vw] !h-auto !max-h-[90vh] !max-w-none sm:!max-w-none md:!max-w-none lg:!max-w-none overflow-y-auto p-8">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold flex items-center gap-2">
              <Zap className="w-6 h-6 text-yellow-500" />
              Purchase Additional Tokens
            </DialogTitle>
            <p className="text-sm text-gray-600 mt-1">
              Increase your token quota to continue using the DE&I add-in
            </p>
          </DialogHeader>

          <div className="mt-6">
            {/* Token Packages */}
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Select Token Package</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {tokenPackages.map((pkg) => (
                  <button
                    key={pkg.id}
                    onClick={() => setSelectedPackage(pkg.id)}
                    className={`relative p-6 rounded-lg border-2 transition-all text-left ${
                      selectedPackage === pkg.id
                        ? 'border-indigo-600 bg-indigo-50'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    {pkg.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <Badge className="bg-indigo-600 text-white">Most Popular</Badge>
                      </div>
                    )}

                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">{pkg.name}</h4>
                      {selectedPackage === pkg.id && (
                        <div className="w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>

                    <div className="mb-3">
                      <p className="text-3xl font-bold text-gray-900">${pkg.price}</p>
                      {pkg.savings && (
                        <Badge variant="outline" className="mt-1 text-green-600 border-green-200">
                          {pkg.savings}
                        </Badge>
                      )}
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold text-gray-900">
                          {pkg.tokens.toLocaleString()}
                        </span>{' '}
                        tokens
                      </p>
                      <p className="text-xs text-gray-500">
                        ${((pkg.price / pkg.tokens) * 1000).toFixed(2)} per 1,000 tokens
                      </p>
                    </div>

                    <ul className="mt-4 space-y-2">
                      <li className="flex items-start gap-2 text-sm text-gray-600">
                        <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>Never expires</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-gray-600">
                        <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>Rollover unused tokens</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-gray-600">
                        <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>All features included</span>
                      </li>
                    </ul>
                  </button>
                ))}

                {/* Custom Package Option */}
                <button
                  onClick={() => setSelectedPackage('custom')}
                  className={`relative p-6 rounded-lg border-2 transition-all text-left ${
                    selectedPackage === 'custom'
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">Custom</h4>
                    {selectedPackage === 'custom' && (
                      <div className="w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>

                  <div className="mb-3">
                    <p className="text-3xl font-bold text-gray-900">${getCustomPrice()}</p>
                    <Badge variant="outline" className="mt-1 text-gray-600 border-gray-200">
                      Custom Amount
                    </Badge>
                  </div>

                  <div className="space-y-2 mb-4">
                    <label className="text-sm font-medium text-gray-600">Token Amount</label>
                    <input
                      type="number"
                      value={customTokens}
                      onChange={(e) => setCustomTokens(e.target.value)}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPackage('custom');
                      }}
                      min="10000"
                      step="10000"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Enter tokens"
                    />
                    <p className="text-xs text-gray-500">
                      $0.30 per 1,000 tokens
                    </p>
                  </div>

                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-sm text-gray-600">
                      <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Flexible amount</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-gray-600">
                      <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Minimum 10,000 tokens</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm text-gray-600">
                      <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>All features included</span>
                    </li>
                  </ul>
                </button>
              </div>
            </div>

            {/* Payment Method */}
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Payment Method</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => setPaymentMethod('card')}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    paymentMethod === 'card'
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-gray-600" />
                      <h4 className="font-semibold text-gray-900">Credit Card</h4>
                    </div>
                    {paymentMethod === 'card' && (
                      <div className="w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">Instant activation</p>
                </button>

                <button
                  onClick={() => setPaymentMethod('invoice')}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    paymentMethod === 'invoice'
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-gray-600" />
                      <h4 className="font-semibold text-gray-900">Invoice / PO</h4>
                    </div>
                    {paymentMethod === 'invoice' && (
                      <div className="w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">For enterprise customers</p>
                </button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Order Summary</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    {getCurrentPackageInfo()?.name}
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    ${getCurrentPackageInfo()?.price}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Tokens</span>
                  <span className="text-sm font-medium text-gray-900">
                    {getCurrentPackageInfo()?.tokens.toLocaleString()}
                  </span>
                </div>
                <div className="border-t pt-3 flex items-center justify-between">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="text-xl font-bold text-gray-900">
                    ${getCurrentPackageInfo()?.price}
                  </span>
                </div>
              </div>
            </div>

            {/* Security Notice */}
            <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg mb-6">
              <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-900">Secure Payment</p>
                <p className="text-xs text-blue-700 mt-1">
                  Your payment information is encrypted and processed securely. We never store your credit card details.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <Button
                onClick={handlePurchase}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white gap-2"
                size="lg"
              >
                <CreditCard className="w-4 h-4" />
                {paymentMethod === 'card' ? 'Complete Purchase' : 'Request Invoice'}
              </Button>
              <Button variant="outline" size="lg" onClick={() => setOpen(false)}>
                Cancel
              </Button>
            </div>

            {/* Additional Info */}
            <p className="text-xs text-gray-500 text-center mt-4">
              By completing this purchase, you agree to our Terms of Service and Privacy Policy.
              Tokens will be added to your account immediately upon payment confirmation.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
