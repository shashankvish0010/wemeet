import React from 'react'
import { Icon } from '@iconify/react';

const BookingCard: React.FC = () => {
    return (
        <div className='bg-slate-100 h-[25vh] md:w-[45vw] w-[80vw] p-3 shadow-2xl rounded-xl flex flex-row gap-3'>
            <div className='h-[100%] w-[12dvw] p-2 flex flex-col items-center gap-3'>
                <span className='h-max w-[100%]'><p className='text-base p-1'>jan</p></span>
                <span><p className='text-2xl bg-orange-400 rounded-full px-2 py-1 text-center font-semibold'>23</p></span>
            </div>
            <span className='w-[0.5rem] h-[100%] rounded bg-orange-400'></span>
            <div className='h-[100%] w-max flex flex-row gap-3 p-2 items-center'>
                <div className='h-[100%] flex flex-col justify-evenly gap-3'>
                    <span className='flex flex-row gap-1 items-center md:text-base text-sm'>
                        <Icon icon="basil:clock-solid" height="3vh"/>
                        9:00
                    </span>
                    <span className='flex flex-row gap-1 items-center md:text-base text-sm'>
                        <Icon icon="mdi:location" height="3vh"/>
                        <p>Online</p>
                    </span>
                </div>
                <div className='h-[100%] w-[100%] flex flex-col p-2 justify-evenly gap-4'>
                    <span>
                        <p className='md:text-base text-sm'>{("Lorem ipsum dolor sit amet consectetur adipisicing elit. Laborum, ducimus repellendus. Aliquam eius minus suscipit cumque et delectus maxime corrupti!").slice(0,50)}</p>
                    </span>
                    <span>
                        <p className='md:text-base text-sm font-medium'>Shashank {'<>'} Aditya</p>
                    </span>
                </div>
            </div>
        </div>
    )
}

export default BookingCard