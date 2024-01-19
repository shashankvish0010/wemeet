import React from 'react'
import paymentBanner from '../assets/pay_success.avif'
import { useNavigate } from 'react-router'

const PaySuccess: React.FC = () => {
    const navigate = useNavigate()

    return (
        <div className='h-screen w-screen bg-slate-100 flex flex-col items-center p-3'>
            <div className='h-max w-[90vw] p-3 flex flex-col items-center gap-5'>
                <img className='rounded-xl shadow-xl' width='300px' src={paymentBanner} />
                <p className='md:text-2xl text-xl font-semibold'>Your Payment is Successfull</p>
                <p className='md:text-xl text-center text-base font-semibold text-gray-500'>Thank you for your payment, now you can access the business plan</p>
            </div>
            <div>
                <p onClick={()=>navigate('/')}  className='cursor-pointer text-base text-lime-400 underline'>Back to home</p>
            </div>
        </div>
    )
}

export default PaySuccess