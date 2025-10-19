import { Link, useSearch } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import TransactionsTable from '../components/TransactionsTable';
import { getDefaultTransactionPayload } from '../utils/BackendPayloads';
import { BASE_URL, ENDPOINTS } from '../constants/api';


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
  const [direction, setDirection] = useState('out');
  const [currentPage, setCurrentPage] = useState(0);
  const [pageKeys, setPageKeys] = useState([null]); // Array de pageKeys, [0] = null (primera página)

  const fromBlock = from || '0';
  const untilBlock = until || 'latest';

  const { 
    data, 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['transactions', address, fromBlock, untilBlock, direction, currentPage],
    queryFn: async () => {
      const url = new URL(`${ENDPOINTS.TRANSACTIONS}/${address}`, BASE_URL);
      const pageKey = pageKeys[currentPage]; 
      const response = await fetch(url.href, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(getDefaultTransactionPayload(address, fromBlock, untilBlock, direction, pageKey))
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch transactions');
      }
      
      const result = await response.json();
      
      if (result.pageKey && !pageKeys[currentPage + 1]) {
        setPageKeys(prev => [...prev, result.pageKey]);
      }
      
      return result || [];
    },
    enabled: !!address, 
    staleTime: 60000, 
    retry: false,
  });

  const transactions = data?.transfers || [];
  const hasNextPage = !!data?.pageKey; 

  const handleDirectionChange = (newDirection) => {
    setDirection(newDirection);
    setCurrentPage(0);
    setPageKeys([null]);
  };

  const handleNextPage = () => {
    if (hasNextPage) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
  };

  return (
    // Back button and header
    <div className="w-full min-h-screen bg-gray-700 px-4 py-8 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Link 
            to="/" 
            className="text-blue-400 hover:text-blue-300 inline-flex items-center gap-2"
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

        {/* Loading Spinner */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <p className="text-gray-400 mt-4">Loading transactions...</p>
          </div>
        )}

        {/* Error Message with retry button */}
        {error && (
          <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded mb-6">
            <p className="font-medium">Error loading transactions</p>
            <p className="text-sm mb-3">{error.message}</p>
            <button
              onClick={() => refetch()}
              className="bg-red-700 hover:bg-red-600 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* No transactions found message */}
        {!isLoading && !error && transactions.length === 0 && address && (
          <div className="text-center py-12 text-gray-400">
            <p className="text-lg">No transactions found for this address</p>
          </div>
        )}

        {/* Transactions Table */}
        {!isLoading && !error && transactions.length > 0 && (
          <>
            <div className="mb-4 text-gray-400">
              Showing {transactions.length} transaction{transactions.length !== 1 ? 's' : ''} (Page {currentPage + 1})
            </div>
            <TransactionsTable 
              data={transactions} 
              direction={direction}
              onDirectionChange={handleDirectionChange}
            />
            
            {/* Pagination Controls */}
            <div className="mt-6 flex items-center justify-between bg-gray-800 px-6 py-4 rounded-lg">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 0 || isLoading}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentPage === 0 || isLoading
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {/* Icon for Previous Button */}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </button>
              {/* Page Number Display */}
              <div className="text-white font-medium">
                Page {currentPage + 1}
              </div>
              {/* Next Button */}
              <button
                onClick={handleNextPage}
                disabled={!hasNextPage || isLoading}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  !hasNextPage || isLoading
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                Next
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Transactions;
