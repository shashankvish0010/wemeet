import React, { useContext, useState, useMemo, useEffect } from 'react'
import { EventsContext } from '../contexts/EventsContext'
import TimeCard from '../components/TimeCard'
import { useParams } from 'react-router'
import { userAuthContext } from '../contexts/UserAuth'
import { useNavigate } from 'react-router'
import { Icon } from '@iconify/react'
import 'react-calendar/dist/Calendar.css';
import Calendar from 'react-calendar';

interface eventDataType {
    firstname: string,
    lastname: string,
    event_name: string,
    duration: any,
    event_description: string
}
type Value = Date | null | [Date | null, Date | null];

const Booking: React.FC = () => {
    const activeDate = new Date()
    const [email, setEmail] = useState<string>('')
    const eventContext = useContext(EventsContext)
    const userContext = useContext(userAuthContext)
    const [currentEvent, setCurrentEvent] = useState<eventDataType[]>([])
    const [message, setMessage] = useState<string>('')
    const [enableTime, setEnableTime] = useState<boolean>(false)
    const [enableInfo, setEnableInfo] = useState<boolean>(false)
    const [enable, setEnable] = useState<boolean>()
    const [date, onChange] = useState<Value>(new Date(activeDate.getFullYear(), activeDate.getMonth(), activeDate.getDate()));
    const params: any = useParams()
    const navigate = useNavigate()

    let temparray: any | string[] | void | undefined = useMemo(() => eventContext?.calcTime(params.duration), []);

    const getEventDetails = async (meetingId: string) => {
        try {
            const response = await fetch('/event/' + meetingId, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json"
                }
            });
            if (response) {
                const data = await response.json();
                if (data.success == true) {
                    setCurrentEvent(data.eventdata)
                } else {
                    console.log(data);
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => { getEventDetails(params.id); setEmail(userContext?.currentuser?.email) }, [])

    const bookEvent = async (id: string) => {
        const time = eventContext?.bookTime
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
                    setMessage(data.message)
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        userContext?.login == true ?
            <div className='bg-slate-100 h-max w-screen flex flex-col p-3'>
                <div className='h-max w-screen flex md:flex-row flex-col justify-evenly p-4'>
                    <div className='md:w-[30dvw] w-[85dvw] md:h-[70vh] h-max p-3'>
                        <div className='h-max w-[100%] flex flex-col justify-center gap-4'>
                            <h1 className='text-xl font-semibold'>{`${currentEvent[0]?.firstname} ${currentEvent[0]?.lastname}`}</h1>
                            <p className='text-base font-medium'>{`${currentEvent[0]?.event_name}`}</p>
                            <span className='flex flex-row gap-1 items-center'>
                                <Icon icon="ci:timer" />
                                <p className='text-base font-medium'>{`${currentEvent[0]?.duration} minutes`}</p>
                            </span>
                            <p className='text-base font-medium'>{`${currentEvent[0]?.event_description}`}</p>
                            <span className='h-max flex gap-1'><p className='text-base font-medium'>{`${currentEvent[0]?.event_name} will host on`}</p><p className='flex items-center logo text-base'>WeMeet</p></span>
                        </div>
                    </div>
                    <div className='md:w-[30dvw] w-[85dvw] md:h-[70vh] h-max flex flex-col gap-5 items-center p-3'>
                        {message ?
                            <span className='shadow p-1 font-medium bg-red-600 text-white'>{message}</span>
                            : null
                        }
                        <div className='md:text-2xl text-2xl text-center md:text-start font-bold'>
                            Select an appointment date
                        </div>
                        <div className='w-max h-max'>
                            <Calendar onChange={onChange} value={date} />
                        </div>
                    </div>
                    <div className='h-[70vh] md:w-[30dvw] w-[85dvw] flex flex-col gap-5 items-center'>
                        <div className='md:text-2xl text-2xl text-center md:text-start font-bold'>
                            Select an appointment time
                        </div>
                        <div className='h-max w-screen flex flex-row justify-center gap-5 p-3'>
                            <button onClick={() => setEnable(true)} className='bg-slate-800 p-2 font-medium text-white rounded'>AM</button>
                            <button onClick={() => setEnable(false)} className='bg-slate-800 p-2 font-medium text-white rounded'>PM</button>
                        </div>
                        <div className='h-[35vh] scroll-smooth overflow-y-scroll w-max flex flex-col gap-3 items-center'>
                            {enable == true ?
                                temparray?.map((time: any) => Number(time.slice(0, 2)) <= 12 ?
                                    <TimeCard duration={`${time}`} notation={'AM'} />
                                    : null)
                                :

                                temparray?.map((time: any) => Number(time.slice(0, 2)) >= 12 ?
                                    <TimeCard duration={`${time}`} notation={'PM'} />
                                    : null)
                            }
                        </div>
                        <button onClick={() => { setEnableInfo(true); setEnableTime(false) }} className='bg-slate-800 p-2 font-medium text-white rounded'>Proceed</button>
                    </div>
                </div>
                <div className='bg-slate-800 w-[100vw] flex justify-center items-center p-3'>
                    {
                        enableInfo == true && enableTime == false ?
                            <div className='w-[100vw] flex justify-evenly items-center h-[10vh]'>
                                <span className='flex flex-col gap-1'>
                                    <p className='text-base text-center text-white'>Enter Your Email</p>
                                    <input className='focus:outline-none px-2 h-[2.25rem] w-[75vw] md:w-[55vw] border rounded' type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
                                </span>
                                <button onClick={() => bookEvent(params.id)} className='bg-slate-100 p-2 font-medium rounded'>Book</button>
                            </div>
                            : null
                    }
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