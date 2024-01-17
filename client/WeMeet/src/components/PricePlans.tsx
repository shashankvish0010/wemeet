import React from 'react'
import { Icon } from '@iconify/react/dist/iconify.js'

interface CardType {
    plan_name: string,
    plan_price: string,
    feat_head: string,
    features: string[] | any
    color: string,
    textGrade: string
    headingColor: string
    btnGrade: string
    btnTxtcolor: string
}

const PricePlans: React.FC<CardType> = (props: CardType) => {
    const cardColor = `border-2 border-gray-300 ${props.color} md:h-[80vh] md:w-[25vw] h-[60vh] w-[70vw] rounded-3xl shadow-2xl flex flex-col gap-3 justify-around p-5`
    return (
        <div className={cardColor}>
            <p className={`text-xl font-semibold ${props.headingColor}`}>{props.plan_name}</p>
            <span className='flex items-center gap-2'>
                <p className={`text-5xl font-bold ${props.headingColor}`}>{props.plan_price}</p>
                <span className={`flex flex-col text-sm uppercase ${props.textGrade}`}>
                    <p>per user</p>
                    <p>per month</p>
                </span>
            </span>
            <p className={`${props.headingColor}`}>Basic features</p>
            <button className={`${props.btnGrade} ${props.btnTxtcolor} rounded-md p-2 text-white font-medium `}>Get Started</button>
            <span className='h-[0.2rem] w-[100%] bg-lime-300 rounded'></span>
            <span className='h-max w-[100%] flex flex-col gap-4'>
                <span className='flex flex-col gap-1'>
                    <p className={`text-sm font-semibold ${props.headingColor}`}>FEATURES</p>
                    <p className={`text-sm ${props.textGrade}`}>{props.feat_head}</p>
                </span>
                <span className='h-max w-[100%] flex flex-col gap-3 items-center'>
                    {props.features?.map((feature: any) => {
                        console.log(feature);
                        return (<span className='h-max w-[100%] flex items-center gap-1'>
                            <Icon className='bg-green-300 rounded-full p-1' icon="raphael:check" color="green" height={'4vh'} />
                            <p className={`text-sm ${props.textGrade}`}>{feature}</p>
                        </span>)
                    })
                    }
                </span>
            </span>
        </div>)
}

export default PricePlans