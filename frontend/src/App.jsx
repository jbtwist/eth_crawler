import { useState, useEffect } from 'react'
import TransactionsTable from './components/TransactionsTable'
import './App.css'

function App() {
  const [transactions, setTransactions] = useState([])

  useEffect(() => {
    const sampleData = [
      {
        blockNum: '0x12a4b5c',
        uniqueId: '1',
        hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
        from: '0xabc123def456789012345678901234567890abcd',
        to: '0xdef456abc789012345678901234567890abcdef1',
        direction: 'incoming',
        value: '1.234567',
        asset: 'ETH',
      },
      {
        blockNum: '0x12a4b5d',
        uniqueId: '2',
        hash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
        from: '0xdef456abc789012345678901234567890abcdef1',
        to: '0xabc123def456789012345678901234567890abcd',
        direction: 'outgoing',
        value: '0.567890',
        asset: 'USDT',
      },
      {
        blockNum: '0x12a4b5e',
        uniqueId: '3',
        hash: '0x567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12345',
        from: '0xabc123def456789012345678901234567890abcd',
        to: '0x789012def456abc345678901234567890abcdef1',
        direction: 'outgoing',
        value: '2.500000',
        asset: 'ETH',
      },
    ]
    setTransactions(sampleData)
  }, [])

  return (
    <div className="min-h-screen bg-gray-700 p-8">
      <div className="max-w-7xl mx-auto bg-gray-700">
        <h1 className="text-3xl font-bold text-white mb-6">
          Transactions
        </h1>
        <TransactionsTable data={transactions} />
      </div>
    </div>
  )
}

export default App
