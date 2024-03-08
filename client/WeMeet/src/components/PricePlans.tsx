import React, { useContext } from 'react'
import { Icon } from '@iconify/react/dist/iconify.js'
import { userAuthContext } from '../contexts/UserAuth'
import { useNavigate } from 'react-router'

interface CardType {
    plan_name: string,
    plan_price: any,
    feat_head: string,
    features: string[] | any
    color: string,
    textGrade: string
    headingColor: string
    btnGrade: string
    btnTxtcolor: string
    distGrade: string
}

const PricePlans: React.FC<CardType> = (props: CardType) => {
    const navigate = useNavigate()
    const userContext = useContext(userAuthContext)
    const cardColor = `border-2 ${props.color} md:h-[80vh] md:w-[25vw] h-[60vh] w-[70vw] rounded-3xl shadow-2xl flex flex-col gap-3 justify-around p-5`
    const checkout = async (plan_price: number, plan_name: string) => {
        try {
            const response = await fetch('/checkout/plan', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    plan_name, plan_price
                })
            })
            if (response) {
                const result = await response.json();
                window.location.href = result.url
            } else {
                console.log("No response from server at checkout");
            }
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <div
        className={cardColor}>
            <p className={`text-xl font-semibold ${props.headingColor}`}>{props.plan_name}</p>
            <span className='flex items-center gap-2'>
                <p className={`text-5xl font-bold ${props.headingColor}`}>${props.plan_price}</p>
                <span className={`flex flex-col text-sm uppercase ${props.textGrade}`}>
                    <p>per user</p>
                    <p>per month</p>
                </span>
            </span>
            <p className={`${props.headingColor}`}>Basic features</p>
            <button onClick={() => {
                userContext?.login === true ? checkout(props.plan_price, props.plan_name) : navigate('/login')
            }} className={`${props.btnGrade} ${props.btnTxtcolor} rounded-md p-2 font-medium `}>Get Started</button>
            <span className={`h-[0.2rem] w-[100%] ${props.distGrade} rounded`}></span>
            <span className='h-max w-[100%] flex flex-col gap-4'>
                <span className='flex flex-col gap-1'>
                    <p className={`text-sm font-semibold ${props.headingColor}`}>FEATURES</p>
                    <p className={`text-sm ${props.textGrade}`}>{props.feat_head}</p>
                </span>
                <span className='h-max w-[100%] flex flex-col gap-3 items-center'>
                    {props.features?.map((feature: any) => {
                        console.log(feature);
                        return (<span className='h-max w-[100%] flex gap-1'>
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