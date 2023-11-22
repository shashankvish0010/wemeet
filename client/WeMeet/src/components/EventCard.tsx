import React from 'react'

interface CardType {
    name: string,
    duration: any,
    description: string
}

const EventCard: React.FC<CardType> = (props: CardType) => {
  return (
    <div className='h-max w-[30vw] flex flex-col rounded-2xl shadow-xl p-3 items-center'>
        <span className='h-max w-[100%]'>
            <h1 className='text-2xl font-semibold'>{props.name}</h1>
        </span>
        <span className='w-[100%] h-[0.3rem] bg-slate-800 rounded'></span>
        <div className='h-max w-[100%]'>
            <span className='text-medium text-xl'>
                {props.duration}
            </span>
            <span className='text-medium text-xl'>
                {props.description}
            </span>
        </div>
    </div>
  )
}

export default EventCard