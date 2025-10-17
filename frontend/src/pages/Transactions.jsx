import { useState, useEffect } from 'react';
import { Link, useSearch } from '@tanstack/react-router';
import TransactionsTable from '../components/TransactionsTable';

/**
 * Transactions Page
 * 
 * This component fetches and displays Ethereum transactions for a given address and block range.
 * It reads the address and block parameters from the URL query string.
 * While loading, it shows a spinner. If an error occurs, it displays an error message with a retry button.
 * If transactions are found, they are displayed in a table; otherwise, a "no transactions found" message is shown.
 */
function Transactions() {
  const { address, from, until } = useSearch({ from: '/transactions' });
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fromBlock = from || '0';
  const untilBlock = until || 'latest';

  // Function to fetch transactions from the backend API
  const fetchTransactions = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // TODO: Llamada a tu API backend
      const response = await fetch(
        `http://localhost:8000/get_transactions/${address}/${fromBlock}?to_block=${untilBlock}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch transactions');
      }
      
      const data = await response.json();
      setTransactions(data.transfers || []);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  /** Fetch transactions when component mounts or when parameters change 
   *  This could be a hook in a separated file, but to keep the application simple, I'll leave it here.
  */
  useEffect(() => {
    if (!address) return;
    fetchTransactions();
  }, [address, fromBlock, untilBlock]);

  return (
    // Back button and header
    <div className="min-h-screen bg-gray-700 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Link 
            to="/" 
            className="text-blue-400 hover:text-blue-300 flex items-center gap-2"
          >
            ← Back to search
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-white mb-4">
          Transactions
        </h1>
        {/* Display the address and block range */}
        {address && (
          <div className="bg-gray-800 p-4 rounded-lg mb-6">
            <p className="text-gray-400 text-sm mb-1">Address:</p>
            <p className="text-white font-mono break-all">{address}</p>
            <div className="flex gap-4 mt-3 text-sm">
              <div>
                <span className="text-gray-400">From Block: </span>
                <span className="text-white">{fromBlock}</span>
              </div>
              <div>
                <span className="text-gray-400">Until Block: </span>
                <span className="text-white">{untilBlock}</span>
              </div>
            </div>
          </div>
        )}
        {/* Loading spinner */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <p className="text-gray-400 mt-4">Loading transactions...</p>
          </div>
        )}
        {/* Error message with retry button */}
        {error && (
          <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded mb-6">
            <p className="font-medium">Error loading transactions</p>
            <p className="text-sm mb-3">{error}</p>
            <button
              onClick={fetchTransactions}
              className="bg-red-700 hover:bg-red-600 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* No transactions found message */}
        {!loading && !error && transactions.length === 0 && address && (
          <div className="text-center py-12 text-gray-400">
            <p className="text-lg">No transactions found for this address</p>
          </div>
        )}

        {/* Transactions table */}
        {!loading && !error && transactions.length > 0 && (
          <>
            <div className="mb-4 text-gray-400">
              Found {transactions.length} transaction{transactions.length !== 1 ? 's' : ''}
            </div>
            <TransactionsTable data={transactions} />
          </>
        )}
      </div>
    </div>
  );
}

export default Transactions;
