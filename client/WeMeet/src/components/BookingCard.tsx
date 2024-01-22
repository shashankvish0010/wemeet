import React from 'react'
import { Icon } from '@iconify/react';

interface CardType {
    name: string,
    username: string
    month: string,
    date: string,
    time: string,
    description: string,
}

const BookingCard: React.FC<CardType> = (props: CardType) => {    
    return (
        <div className='bg-slate-100 h-[25vh] md:w-[45vw] w-[80vw] md:p-3 p-2 shadow-2xl rounded-xl flex flex-row md:gap-3 gap-2'>
            <div className='h-[100%] w-[12dvw] p-2 flex flex-col items-center justify-evenly'>
                <span><p className='text-base p-1 font-semibold uppercase'>{`${props.month}`.slice(0,3)}</p></span>
                <span><p className='text-2xl bg-orange-400 rounded-full px-2 py-1 text-center font-semibold'>{props.date}</p></span>
            </div>
            <span className='w-[0.5rem] h-[100%] rounded bg-orange-400'></span>
            <div className='h-[100%] w-max flex flex-row gap-3 p-2 items-center'>
                <div className='h-[100%] flex flex-col justify-around gap-4'>
                    <span className='flex flex-row gap-1 items-center md:text-base text-sm'>
                        <Icon icon="basil:clock-solid" height="3vh"/>
                        {props.time}
                    </span>
                    <span className='flex flex-row gap-1 items-center md:text-base text-sm'>
                        <Icon icon="mdi:location" height="3vh"/>
                        <p>Online</p>
                    </span>
                </div>
                <div className='h-[100%] w-[100%] flex flex-col p-2 justify-around gap-4'>
                    <span>
                        <p className='md:text-base text-sm'>{props.description.slice(0,80)}</p>
                    </span>
                    <span>
                        <p className='md:text-base text-sm font-medium'>{props.username} {'<>'} {props.name}</p>
                    </span>
                </div>
            </div>
        </div>
    )
}

export default BookingCard