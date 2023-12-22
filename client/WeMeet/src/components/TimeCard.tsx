import React from 'react'

const TimeCard: React.FC<{ action: any, duration: any, notation: string }> = ({ action, duration, notation }: any) => {
  return (
    <div onClick={()=> action} className='bg-slate-800 h-max md:w-[15vw] w-[50vw] rounded p-3 shadow-xl text-white text-center'>
      <p>{duration} {notation} </p>
    </div>
  )
}

export default TimeCard