import React from 'react'
import { Icon } from '@iconify/react'

interface CardType {
    icon: string,
    color: string,
    content: string
}
const BenefitsCard: React.FC<CardType> = (props: CardType) => {
  return (
    <span className='h-max w-max flex flex-row gap-2 p-3 items-center'>
    <Icon className='bg-slate-800 rounded-full p-1 border-2 border-lime-300' icon={props.icon} color={props.color} height={'6vh'}/>
    <p className='font-semibold text-xl'>{props.content}</p>
    </span>
  )
}

export default BenefitsCard