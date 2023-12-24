import React from 'react'
import { Icon } from '@iconify/react';

const BookingCard: React.FC = () => {
    return (
        <div className='h-[20vh] md:w-[40vw] p-2 shadow-2xl rounded-xl flex flex-row'>
            <div className='h-[100%] w-[10vw] p-2 flex flex-col gap-4 justify-center'>
                <span><p>JAN</p></span>
                <span><p className='text-2xl font-semibold'>23</p></span>
            </div>
            <span className='w-[0.5rem] h-[100%] rounded bg-slate-800'></span>
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