"use client";
import react from "react"
import "../styles/History.css"

const TxHistory = () => {
    const transactions = [
        { amount: '1.5', recipient: 'example@email.com' },
        { amount: '1.5', recipient: 'example@email.com' },
        { amount: '1.5', recipient: 'example@email.com' },
        { amount: '1.5', recipient: 'example@email.com' },
      ];

  return (
    <div className="txbg">
     <div className="max-w-3xl mx-auto p-6 bg-gradient-to-br from-red-100 via-pink-100 to-purple-100 rounded-3xl shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
          <span className="font-semibold">User.Name</span>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-600">your overall balance</div>
          <div className="text-2xl font-bold text-purple-600">$22301044</div>
        </div>
      </div>
      
      <button className="bg-purple-500 text-white px-4 py-2 rounded-full text-sm mb-6">
        GIFT TOKEN
      </button>
      
      <div className="mb-4 font-medium">transaction history</div>
      
      <div className="space-y-3">
        {transactions.map((tx, index) => (
          <div key={index} className="flex justify-between items-center bg-white bg-opacity-50 p-3 rounded-xl">
            <div className="flex items-center space-x-3">
              <span className="font-semibold">{tx.amount}</span>
              <span className="text-gray-600">to</span>
              <span className="text-sm truncate max-w-[150px] sm:max-w-xs">
                {tx.recipient}
              </span>
            </div>
            <button className="bg-red-400 text-white px-3 py-1 rounded-full text-xs">
              View Tx
            </button>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
};
export default TxHistory;
