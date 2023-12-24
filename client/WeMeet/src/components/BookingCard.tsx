import React from 'react'
import { Icon } from '@iconify/react';

const BookingCard: React.FC = () => {
    return (
        <div className='bg-slate-800 text-white h-[20vh] md:w-[44vw] p-2 shadow-2xl rounded-xl flex flex-row'>
            <div className='h-[100%] w-[10vw] p-2 flex flex-col items-center'>
                <span className='h-max w-[100%] p-1'>JAN</span>
                <span className='h-max w-[100%] bg-orange-400 text-center rounded-full'><p className='text-2xl text-white font-semibold p-2'>23</p></span>
            </div>
            <span className='w-[0.5rem] h-[100%] rounded bg-cyan-400'></span>
            <div className='h-[100%] w-max flex flex-row gap-3 p-2 items-center'>
                <div className='h-[100%] flex flex-col justify-evenly'>
                    <span className='flex flex-row gap-1 items-center'>
                        <Icon icon="basil:clock-solid" height="3vh"/>
                        9:00
                    </span>
                    <span className='flex flex-row gap-1 items-center'>
                        <Icon icon="mdi:location" height="3vh"/>
                        <p>Online</p>
                    </span>
                </div>
                <div className='h-[100%] w-[100%] flex flex-col gap-3'>
                    <span>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Laborum, ducimus repellendus. Aliquam eius minus suscipit cumque et delectus maxime corrupti!</p>
                    </span>
                </div>
            </div>
        </div>
    )
}

export default BookingCard