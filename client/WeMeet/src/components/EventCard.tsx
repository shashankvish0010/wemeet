import React, { useState } from 'react'
import { Icon } from '@iconify/react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

interface CardType {
    id: string,
    name: string,
    duration: any,
    description: string
}

const EventCard: React.FC<CardType> = (props: CardType) => {
    const [state, setState] = useState<{ value: string, copied: boolean }>({
        value: '',
        copied: false
    })
    return (
        <div className='bg-white border-2 rounded-2xl shadow-xl h-max md:w-[35vw] w-[80vw] flex flex-col items-center overflow-x-hidden'>
            <span className='h-[0.6rem] w-[100%] bg-indigo-600'></span>
            <div className='h-[100%] w-[100%] flex flex-col justify-evenly p-3 gap-3'>
                <span className='w-[100%] flex justify-end items-center gap-2'>
                    <Icon icon="mdi:edit" color='orange' height={'1.5rem'} />
                    <Icon icon="mdi:delete" color='red' height={'1.5rem'} />
                </span>
                <p className='text-xl'>{props.name}</p>
                <p className='text-base'>{props.duration}min, {props.description}</p>
                <p className='cursor-pointer text-blue-500 text-lg'>View Booking Page</p>
            </div>
            <span className='bg-gray-200 h-[0.2rem] w-[100%] rounded'></span>
            <div className='flex justify-between items-center h-max w-[100%] p-3'>
                {
                    state.copied == false ?
                        <p className='text-base font-medium'>Copy Your Booking Link</p>
                        :
                        <span className='h-max w-max flex flex-row items-center gap-2'>
                            <Icon icon="subway:tick" height='1rem' color='green'/>
                            <p className='text-base font-medium'>Link Copied to clipboard</p>
                        </span>

                }
                <CopyToClipboard text={state.value} onCopy={() => setState({ value: `https://wemeet-psi.vercel.app/${props.duration}/${props.id}`, copied: true })}>
                    <Icon className='cursor-pointer' icon="ph:copy" color='#2196F3' height={'2rem'} />
                </CopyToClipboard>
            </div>
        </div>
    )
}

export default EventCard