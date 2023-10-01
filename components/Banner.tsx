import { globalActions } from '@/store/globalSlices'
import React from 'react'
import { useDispatch } from 'react-redux'

const Banner = () => {

  const dispatch = useDispatch()
  const { setCreateModal } = globalActions
  return (
    <main className="mx-auto text-center space-y-8">
      <h1 className="text-[45px] font-[600px] text-center leading-none">DOTES - Decentralized Votes</h1>
      <p className="text-[20px] font-[500px] text-center">
      Decentralized voting is revolutionizing the way we participate in democratic processes. 
      Join us on a journey to explore the potential of decentralized voting in shaping the future of democracy.</p>

      <button
        className="text-black h-[45px] w-[148px] rounded-full transition-all duration-300
        border border-gray-400 bg-white hover:bg-opacity-20 hover:text-white"
        onClick={() => dispatch(setCreateModal('scale-100'))}
      >
        Create Poll
      </button>
    </main>
  )
}

export default Banner
