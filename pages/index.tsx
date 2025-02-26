import { useState, useEffect } from 'react'
import { useAccount, useWriteContract, usePublicClient } from 'wagmi'

const ERC721SwapABI = {
  abi: [
    // ABI 정의
    {
      name: "requestSwap",
      type: "function",
      inputs: [
        { name: "counterparty", type: "address" },
        { name: "requesterTokenContract", type: "address" },
        { name: "requesterTokenId", type: "uint256" },
        { name: "counterpartyTokenContract", type: "address" },
        { name: "counterpartyTokenId", type: "uint256" }
      ],
      outputs: []
    },
    {
      name: "executeSwap",
      type: "function",
      inputs: [{ name: "requestId", type: "uint256" }],
      outputs: []
    }
  ]
}

const SwapPage = () => {
  const { address } = useAccount()
  const publicClient = usePublicClient()
  
  const [swapRequests, setSwapRequests] = useState<any[]>([])
  const [formData, setFormData] = useState({
    counterparty: '',
    requesterTokenContract: '',
    requesterTokenId: '',
    counterpartyTokenContract: '',
    counterpartyTokenId: ''
  })

  const { writeContract: requestSwap } = useWriteContract()
  const { writeContract: executeSwapAsync } = useWriteContract()

  const createSwapRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const tx = await requestSwap({
        address: 'YOUR_DEPLOYED_CONTRACT_ADDRESS',
        abi: ERC721SwapABI.abi,
        functionName: 'requestSwap',
        args: [
          formData.counterparty,
          formData.requesterTokenContract,
          BigInt(formData.requesterTokenId),
          formData.counterpartyTokenContract,
          BigInt(formData.counterpartyTokenId)
        ]
      })
      await tx?.wait()
      alert('스왑 요청이 생성되었습니다!')
    } catch (err) {
      console.error(err)
      alert('스왑 요청 생성 실패')
    }
  }

  const executeSwap = async (requestId: number) => {
    try {
      const tx = await executeSwapAsync({
        address: 'YOUR_DEPLOYED_CONTRACT_ADDRESS',
        abi: ERC721SwapABI.abi,
        functionName: 'executeSwap',
        args: [BigInt(requestId)]
      })
      await tx?.wait()
      alert('스왑이 성공적으로 실행되었습니다!')
    } catch (err) {
      console.error(err)
      alert('스왑 실행 실패')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">NFT 스왑</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">새로운 스왑 요청</h2>
          <form onSubmit={createSwapRequest}>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="상대방 주소"
                onChange={(e) => setFormData({...formData, counterparty: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="text"
                placeholder="내 NFT 컨트랙트 주소"
                onChange={(e) => setFormData({...formData, requesterTokenContract: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="number"
                placeholder="내 NFT ID"
                onChange={(e) => setFormData({...formData, requesterTokenId: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="text"
                placeholder="상대방 NFT 컨트랙트 주소"
                onChange={(e) => setFormData({...formData, counterpartyTokenContract: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="number"
                placeholder="상대방 NFT ID"
                onChange={(e) => setFormData({...formData, counterpartyTokenId: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button 
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors duration-200"
              >
                스왑 요청하기
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">진행 중인 스왑 요청</h2>
          <div className="space-y-4">
            {swapRequests.map((request) => (
              <div key={request.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <p className="text-sm text-gray-600">요청자</p>
                    <p className="font-medium">{request.requester}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">상대방</p>
                    <p className="font-medium">{request.counterparty}</p>
                  </div>
                </div>
                <button
                  onClick={() => executeSwap(request.id)}
                  className="w-full mt-2 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors duration-200"
                >
                  스왑 실행하기
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SwapPage 