import React, { useContext, useEffect, useState } from 'react'
import { EventsContext } from '../contexts/EventsContext'
import TimeCard from '../components/TimeCard'
import { useParams } from 'react-router'
import { userAuthContext } from '../contexts/UserAuth'
import { useNavigate } from 'react-router'
const Booking: React.FC = () => {
    const [email, setEmail] = useState<string>('')
    const [date, setdate] = useState<string>('')
    const [time, setTime] = useState<string>('')
    const eventContext = useContext(EventsContext)
    const userContext = useContext(userAuthContext)
    const [enable, setEnable] = useState<boolean>()
    const params: any = useParams()
    const navigate = useNavigate()
    useEffect(() => {
        // const Time = new Date();
        // const currentTime = Time.toLocaleTimeString();
        eventContext?.calcTime(15);        
    }, [])
    const bookEvent = async (id: string) => {
        try {
            const response = await fetch('/schedule/event/' + id, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email, time, date
                })
            });
            if (response) {
                const data = await response.json();
                if (data.succes == true) {
                    console.log(data);

                } else {
                    console.log(data);
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        userContext?.login == true ?
            <div className='bg-slate-100 h-max w-screen flex flex-col gap-4 p-3'>
                <div className='w-screen h-max flex flex-col gap-5 items-center p-3'>
                    {/* <div className='h-max w-screen flex md:flex-row flex-col gap-4 items-center justify-evenly'>
                    <h1 className='text-xl font-semibold'>{eventData}</h1>
                    <p className='text-base font-medium'>{eventData}</p>
                </div> */}
                    <div className='w-max h-max'>
                        <input className='bg-white p-2 shadow-xl font-medium rounded uppercase date' type="date" value={date} onChange={(e) => setdate(e.target.value)} />
                    </div>
                    <div className='h-max w-screen flex flex-row justify-center gap-5 p-3'>
                        <button onClick={() => setEnable(true)} className='bg-slate-800 p-2 font-medium text-white rounded'>AM</button>
                        <button onClick={() => setEnable(false)} className='bg-slate-800 p-2 font-medium text-white rounded'>PM</button>
                    </div>
                    <div className='h-max w-max flex flex-col gap-3 items-center'>
                        {enable == true ?
                            eventContext?.array?.map((time: any) => Number(time.slice(0,2)) >= 12 ?
                                <TimeCard onClick={() => setTime(`${time}`)} duration={`${time}`} notation={'PM'} /> : null)
                            :

                            eventContext?.array?.map((time: any) => Number(time.slice(0,2)) <= 12 ?
                                <TimeCard onClick={() => setTime(`${time}`)} duration={time} notation={'AM'} /> : null)
                        }
                    </div>
                    <span className='flex flex-col gap-1'>
                        <p className='text-base text-center text-slate-800'>Enter Your Email</p>
                        <input className='px-2 h-[2.25rem] w-[75vw] md:w-[55vw] border rounded' type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </span>
                    <button onClick={() => bookEvent(params.id)} className='bg-slate-800 p-2 font-medium text-white rounded'>Book</button>
                </div>
            </div>
            :
            <div className='bg-slate-100 h-screen w-screen flex flex-col items-center justify-center p-3 gap-3'>
                <p className='text-xl font-semibold'>Please Login to Book Events</p>
                <button onClick={() => { navigate('/login') }} className='bg-slate-800 p-2 font-medium text-white rounded'>Login</button>
            </div>
    )
}

export default Booking