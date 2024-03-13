import React, { useContext } from 'react'
import { useNavigate } from 'react-router';
import { useParams } from 'react-router';
import { EventsContext } from '../contexts/EventsContext'
import { userAuthContext } from '../contexts/UserAuth';

const EventsEdit: React.FC = () => {
    const navigate = useNavigate()
    const params = useParams()
    const eventContext = useContext(EventsContext);
    const userContext = useContext(userAuthContext)
    return (
        userContext?.login == true ?
            <div className='bg-slate-100 h-screen w-screen flex flex-col gap-4 p-3 items-center justify-center'>
                {
                    eventContext?.message ?
                        <span className='shadow p-1 font-medium bg-slate-800 text-white'>{eventContext.message}</span>
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
                                        <input className='px-2 h-[2.25rem] w-[65vw] md:w-[35vw] border rounded' type="text" name='name' defaultValue={event?.name} value={event?.name} onChange={eventContext?.handleChange} />
                                    </span>
                                    <span className='flex flex-col gap-1'>
                                        <p className='text-sm text-gray-600'>Duration - in miunutes</p>
                                        <input className='px-2 h-[2.25rem] w-[65vw] md:w-[35vw] border rounded' type="number" name='duration' defaultValue={event?.duration}  value={event?.duration} onChange={eventContext?.handleChange} />
                                    </span>
                                    <span className='flex flex-col gap-1'>
                                        <p className='text-sm text-gray-600'>Description</p>
                                        <input className='px-2 h-[2.25rem] w-[65vw] md:w-[35vw] border rounded' type="text" name='description' defaultValue={event?.description}  value={event?.description} onChange={eventContext?.handleChange} />
                                    </span>
                                </form>
                                <button onClick={(e) => { e.preventDefault(); eventContext?.handleEditSubmit(e, params.id) }} className='bg-slate-800 p-2 font-medium text-white rounded'>Create Event</button>
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