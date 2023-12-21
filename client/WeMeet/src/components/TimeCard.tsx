import React, { useContext } from 'react'
import { EventsContext } from '../contexts/EventsContext'

const TimeCard: React.FC<{ duration: any, notation: string }> = ({ duration, notation }: any) => {
  const eventContext = useContext(EventsContext)
  return (
    <div onClick={() => eventContext?.settiming(`${duration} : ${notation}`)} className='bg-slate-800 h-max md:w-[15vw] w-[50vw] rounded p-3 shadow-xl text-white text-center'>
      <p>{duration} {notation} </p>
    </div>
  )
}

export default TimeCard