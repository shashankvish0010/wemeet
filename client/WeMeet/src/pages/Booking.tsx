import React, { useContext, useEffect, useState } from 'react'
import { EventsContext } from '../contexts/EventsContext'
import TimeCard from '../components/TimeCard'
import { useParams } from 'react-router'
import { userAuthContext } from '../contexts/UserAuth'
import { useNavigate } from 'react-router'
const Booking: React.FC = () => {
    let array: any[];
    const [eventData, setEventData] = useState<any[]>([]);
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
    const calcTime = (eventDuration: number) => {
        if (eventDuration == 15) {
            eventContext?.time.map((time: number) => {
                array.push(`${time}:${eventContext?.intervals[0]}`);
                array.push(`${time}:${eventContext?.intervals[1]}`);
                array.push(`${time}:${eventContext?.intervals[2]}`);
                array.push(`${time}:${eventContext?.intervals[3]}`);
            })
        } else if (eventDuration == 30) {
            eventContext?.time.map((time: number) => {
                array.push(`${time}:${eventContext?.intervals[0]}`);
                array.push(`${time}:${eventContext?.intervals[2]}`);
            })
        } else if (eventDuration == 45) {
            eventContext?.time.map((time: number) => {
                array.push(`${time}:${eventContext?.intervals[0]}`);
                array.push(`${time}:${eventContext?.intervals[3]}`);
            })
        } else {
            return 0
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
                            array = eventContext?.time?.map((time: any, index: number) => time >= 12 ?
                                <TimeCard onClick={() => setTime(`${time}`)} duration={`${time}:${index}${index}`} notation={'PM'} /> : null)
                            :

                            eventContext?.time?.map((time: any) => time <= 12 ?
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