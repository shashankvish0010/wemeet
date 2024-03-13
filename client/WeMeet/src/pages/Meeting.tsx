import React, { useContext, useEffect } from 'react'
import { MeetingContext } from '../contexts/MeetingContext'
import { userAuthContext } from '../contexts/UserAuth'
import { useNavigate } from 'react-router'

const Meeting: React.FC = () => {
    const meetingContext = useContext(MeetingContext)
    const userContext = useContext(userAuthContext)
    const navigate = useNavigate()

    useEffect(() => {
        meetingContext?.key == true ? navigate('/room') : null
    }, [meetingContext?.key])

    return (
        <div className='bg-slate-100 h-screen w-screen flex flex-col p-3 gap-4 justify-center items-center'>
            {userContext?.login == true ?
                <div className='bg-white border-2 rounded-xl w-max h-max flex flex-col justify-evenly gap-5 p-5 shadow'>
                    <h1 className='text-2xl font-semibold'>Enter Meeting Details</h1>
                    <span className='w-[100%] h-[0.2rem] bg-slate-800 rounded'></span>
                    <form method='POST' className='flex flex-col justify-around items-center gap-3'>
                        <span className='flex flex-col gap-1'>
                            <p className='text-sm text-gray-600'>Meeting Id</p>
                            <input className='px-2 h-[2.25rem] w-[65vw] md:w-[35vw] border rounded' type="text" name='meetingId' value={meetingContext?.meetingCredentials?.meetingId} onChange={meetingContext?.handleChange} />
                        </span>
                        <span className='flex flex-col gap-1'>
                            <p className='text-sm text-gray-600'>Meeting Password</p>
                            <input className='px-2 h-[2.25rem] w-[65vw] md:w-[35vw] border rounded' type="password" name='meetingPassword' value={meetingContext?.meetingCredentials?.meetingPassword} onChange={meetingContext?.handleChange} />
                        </span>
                    </form>
                    <button onClick={() => { meetingContext?.handleSubmit(userContext?.currentuser.email) }} className='bg-slate-800 p-2 font-medium text-white rounded'>Join</button>
                </div>
                :
                <div className='bg-slate-100 h-screen w-screen flex flex-col items-center justify-center p-3 gap-3'>
                    <p className='text-xl font-semibold'>Please Login to Join Meeting</p>
                    <button onClick={() => { navigate('/login') }} className='bg-slate-800 p-2 font-medium text-white rounded'>Login</button>
                </div>
            }
        </div>
    )
}

export default Meeting