import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';

function Home() {
  const navigate = useNavigate();
  const [address, setAddress] = useState('');
  const [fromBlock, setFromBlock] = useState('0');
  const [untilBlock, setUntilBlock] = useState('latest');

  const isValidAddress = /^0x[a-fA-F0-9]{40}$/.test(address);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValidAddress) return;

    navigate({
      to: '/transactions',
      search: {
        address,
        from: fromBlock,
        until: untilBlock,
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-700 flex items-center justify-center p-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl max-w-2xl w-full">
        <h1 className="text-3xl font-bold text-white mb-6">
          Ethereum Transaction Explorer
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-300 mb-2">
              Ethereum Address *
            </label>
            <input
              id="address"
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="0x..."
              className={`w-full px-4 py-2 rounded-lg bg-gray-700 text-white border-2 transition-colors
                ${address === '' ? 'border-gray-600' : 
                  isValidAddress ? 'border-green-500' : 'border-red-500'}`}
            />
            <p className="mt-1 text-sm text-gray-400">
              Enter a valid Ethereum address (42 characters starting with 0x)
            </p>
          </div>

          {/* Optional fields - only shown if address is valid */}
          {isValidAddress && (
            <>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="fromBlock" className="block text-sm font-medium text-gray-300 mb-2">
                    From Block
                  </label>
                  <input
                    id="fromBlock"
                    type="number"
                    min="0"
                    value={fromBlock}
                    onChange={(e) => setFromBlock(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border-2 border-gray-600 focus:border-blue-500 transition-colors"
                  />
                  <p className="mt-1 text-sm text-gray-400">Default: 0</p>
                </div>

                {/* Until Block */}
                <div>
                  <label htmlFor="untilBlock" className="block text-sm font-medium text-gray-300 mb-2">
                    Until Block
                  </label>
                  <input
                    id="untilBlock"
                    type="text"
                    value={untilBlock}
                    onChange={(e) => setUntilBlock(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border-2 border-gray-600 focus:border-blue-500 transition-colors"
                  />
                  <p className="mt-1 text-sm text-gray-400">Default: "latest"</p>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Search Transactions
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}

export default Home;
