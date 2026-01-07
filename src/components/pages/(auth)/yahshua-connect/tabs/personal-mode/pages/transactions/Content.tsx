'use client';

import { CurrencyDollarIcon } from '@heroicons/react/24/outline';

const Content = () => {

  const transactions = [
    {
      id: 1,
      description: 'Fix Leaking Sink - Maria Santos',
      amount: 1000,
      date: 'Dec 12, 2025',
      category: 'Service',
    },
    {
      id: 2,
      description: 'Install Ceiling Fan - Juan Cruz',
      amount: 750,
      date: 'Dec 10, 2025',
      category: 'Service',
    },
    {
      id: 3,
      description: 'Hired: Home Cleaning Service',
      amount: -800,
      date: 'Dec 3, 2025',
      category: 'Hired Service',
    },
  ];

  const totalEarnings = transactions
    .filter((t) => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);
  const totalSpent = Math.abs(
    transactions.filter((t) => t.amount < 0).reduce((sum, t) => sum + t.amount, 0)
  );
  const netBalance = totalEarnings - totalSpent;


  return (
    <div className="space-y-6">
      {/* Transaction History Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
                <h2 className="text-lg font-bold text-gray-900 mb-6">Transaction History</h2>

                {/* Summary Cards */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                    <p className="text-sm text-gray-600 mb-1">Total Earnings</p>
                    <p className="text-2xl font-bold text-green-600">₱{totalEarnings.toLocaleString()}</p>
                  </div>
                  <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                    <p className="text-sm text-gray-600 mb-1">Total Spent</p>
                    <p className="text-2xl font-bold text-red-600">₱{totalSpent.toLocaleString()}</p>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                    <p className="text-sm text-gray-600 mb-1">Net Balance</p>
                    <p className="text-2xl font-bold text-blue-600">₱{netBalance.toLocaleString()}</p>
                  </div>
                </div>

                {/* Transaction List */}
                <div className="space-y-3">
                  {transactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            transaction.amount > 0
                              ? 'bg-green-100 text-green-600'
                              : 'bg-red-100 text-red-600'
                          }`}
                        >
                          <CurrencyDollarIcon className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{transaction.description}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm text-gray-500">{transaction.date}</span>
                            <span
                              className={`px-2 py-0.5 rounded text-xs font-medium ${
                                transaction.category === 'Service'
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-blue-100 text-blue-700'
                              }`}
                            >
                              {transaction.category}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p
                        className={`font-semibold text-lg ${
                          transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {transaction.amount > 0 ? '+' : ''}₱{Math.abs(transaction.amount).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
    </div>
  );
};

export default Content;
