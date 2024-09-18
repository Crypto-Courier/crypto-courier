import React from 'react';
import { X, Copy } from 'lucide-react';

// Define the types for the component props
interface WalletProps {
  isOpen: boolean;
  onClose: () => void;
}
const Wallet: React.FC<WalletProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mr-2">
              <span className="text-white text-xl">≡</span>
            </div>
            <h2 className="text-xl font-bold">Transfer Wallet</h2>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        
        <p className="text-sm text-gray-600 mb-4">
          You Can Bring Your Account With You To Another Site Using An External Wallet.
        </p>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-start">
            <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center mr-2 mt-1">
              <span className="text-white font-bold">1</span>
            </div>
            <p className="text-sm">Click "Copy Key" below to copy your account key to your clipboard.</p>
          </div>
          <div className="flex items-start">
            <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center mr-2 mt-1">
              <span className="text-white font-bold">2</span>
            </div>
            <p className="text-sm">Copy The Key Into Your Wallet.</p>
          </div>
        </div>
        
        <button className="w-full bg-blue-500 text-white py-2 rounded-full flex items-center justify-center mb-4">
          <Copy size={18} className="mr-2" />
          Copy Key
        </button>
        
        <div className="bg-red-100 border border-red-300 rounded-lg p-3">
          <p className="text-sm text-red-700">
            Warning: Never share your private key or recovery phrase with anyone.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Wallet;