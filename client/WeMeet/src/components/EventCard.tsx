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
        <div className='bg-white h-max md:w-[25vw] w-[70vw]  flex flex-col rounded-2xl shadow-xl p-3 gap-4 justify-evenly items-center'>
            <span className='h-max w-[100%]'>
                <h1 className='text-2xl font-semibold'>{props.name}</h1>
            </span>
            <span className='w-[100%] h-[0.3rem] bg-slate-800 rounded'></span>
            <div className='h-max w-[100%] flex flex-col justify-evenly gap-4 p-3'>
                <span className='flex flex-row items-center gap-2 text-medium md:text-xl text-base font-normal'>
                    <Icon icon="ci:timer" />
                    {props.duration} minutes
                </span>
                <span className='text-medium md:text-xl text-base font-normal'>
                    {props.description}
                </span>
            </div>
            <div className='flex flex-col gap-3 justify-evenly h-[100%] w-[100%]'>
            <span className='text-medium md:text-xl text-base font-semibold'>
                    Event scheduling URL:
                </span>                <span className='w-[100%] text-medium md:text-base text-sm font-normal'>
                    {`http://localhost:5173/book/${props.duration}/${props.id}`}
                </span>
            </div>
        </div>
    )
}

export default EventCard