import React from 'react'
import { Icon } from '@iconify/react';
interface CardType {
    id: string,
    name: string,
    duration: any,
    description: string
}

const EventCard: React.FC<CardType> = (props: CardType) => {
    return (
        <div className='bg-slate-800 h-max text-white md:w-[25vw] w-[70vw]  flex flex-col rounded-2xl shadow-xl p-3 gap-4 justify-evenly items-center'>
            <span className='h-max w-[100%]'>
                <h1 className='text-2xl font-semibold'>{props.name}</h1>
            </span>
            <span className='w-[100%] h-[0.3rem] bg-cyan-400 rounded'></span>
            <div className='h-max w-[100%] flex flex-col justify-evenly gap-4 p-3'>
                <span className='flex flex-row items-center gap-2 md:text-xl text-base font-semibold'>
                    <span className='bg-cyan-400 rounded-full p-2'><Icon icon="ci:timer" color='black'/></span>
                    {props.duration} mins.
                </span>
                <span className='text-medium md:text-lg text-base font-normal'>
                    {props.description}
                </span>
            </div>
            <div className='flex flex-col gap-3 justify-evenly h-[100%] w-[100%]'>
            <span className='text-medium md:text-lg text-base font-semibold'>
                    Event scheduling URL:
                </span>                
                <span className='w-[100%] text-blue-300 text-medium md:text-base text-sm font-medium'>
                    {`http://localhost:5173/book/${props.duration}/${props.id}`}
                </span>
            </div>
        </div>
    )
}

export default EventCard