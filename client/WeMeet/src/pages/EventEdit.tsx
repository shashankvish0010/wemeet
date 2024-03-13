import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router';
import { useParams } from 'react-router';
import { EventsContext } from '../contexts/EventsContext'
import { userAuthContext } from '../contexts/UserAuth';

const EventsEdit: React.FC = () => {
    const navigate = useNavigate()
    const params = useParams()
    const eventContext = useContext(EventsContext);
    const userContext = useContext(userAuthContext);
    const [message, setMessage] = useState<string | undefined | null>();
    const [editEvent, setEditEvent] = useState<{
        name: string | undefined,
        duration: Number | undefined,
        description: string | undefined
    }>({
        name: '',
        duration: undefined,
        description: ''
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditEvent(event => ({
            ...event,
            [name]: value
        })
        )
    }

    const handleEditSubmit = async (e: React.FormEvent, id: string | undefined) => {
        e.preventDefault();
        const { name, duration, description } = editEvent;
        try {
            const response = await fetch('https://wemeet-backend.onrender.com/put/event/' + id, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name, duration, description
                })
            })
            if (response) {
                const data = await response.json();
                if (data.success == true) {
                    console.log(data);
                } else {
                    console.log(data);
                    setMessage(data.message)
                }
            } else {
                console.log("Didn't Got any Response");
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        userContext?.login == true ?
            <div className='bg-slate-100 h-screen w-screen flex flex-col gap-4 p-3 items-center justify-center'>
                {
                    message ?
                        <span className='shadow p-1 font-medium bg-slate-800 text-white'>{message}</span>
                        : null
                }
                {
                    eventContext?.userEvents?.map((event: any) => (
                        event.id == params.id ? (
                            <div className='bg-white border-2 rounded-xl w-max h-max flex flex-col justify-evenly gap-5 p-5 shadow'>
                                <h1 className='text-2xl font-semibold'>Edit Event</h1>
                                <span className='w-[100%] h-[0.2rem] bg-slate-800 rounded'></span>
                                <form method='POST' className='flex flex-col justify-arounf items-center gap-3'>
                                    <span className='flex flex-col gap-1'>
                                        <p className='text-sm text-gray-600'>Event Name</p>
                                        <input className='px-2 h-[2.25rem] w-[65vw] md:w-[35vw] border rounded' type="text" name='name' defaultValue={event?.event_name} value={editEvent?.name} onChange={handleChange} />
                                    </span>
                                    <span className='flex flex-col gap-1'>
                                        <p className='text-sm text-gray-600'>Duration - in miunutes</p>
                                        <input className='px-2 h-[2.25rem] w-[65vw] md:w-[35vw] border rounded' type="number" name='duration' defaultValue={event?.duration} value={editEvent?.name} onChange={handleChange} />
                                    </span>
                                    <span className='flex flex-col gap-1'>
                                        <p className='text-sm text-gray-600'>Description</p>
                                        <input className='px-2 h-[2.25rem] w-[65vw] md:w-[35vw] border rounded' type="text" name='description' defaultValue={event?.event_description} value={editEvent?.description} onChange={handleChange} />
                                    </span>
                                </form>
                                <button onClick={(e) => { e.preventDefault(); handleEditSubmit(e, params.id) }} className='bg-slate-800 p-2 font-medium text-white rounded'>Create Event</button>
                            </div>

                        ) : null
                    ))
                }
            </div>
            :
            <div className='bg-slate-100 h-screen w-screen flex flex-col items-center justify-center p-3 gap-3'>
                <p className='text-xl font-semibold'>Please Login to Add Events</p>
                <button onClick={() => { navigate('/login') }} className='bg-slate-800 p-2 font-medium text-white rounded'>Login</button>
            </div>

    )
}

export default EventsEdit