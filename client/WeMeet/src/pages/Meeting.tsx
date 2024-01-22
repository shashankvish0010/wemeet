import React, { useContext, useState } from 'react'
import ReactPlayer from 'react-player'
import { MeetingContext } from '../contexts/MeetingContext'
import { userAuthContext } from '../contexts/UserAuth'

interface MeetingCred {
    meetingId: String,
    meetingPassword: String
}

const Meeting: React.FC = () => {
    const meetingContext = useContext(MeetingContext)
    const userContext = useContext(userAuthContext)

    return (
        <div className='h-screen w-screen flex flex-col p-3 gap-4 justify-center items-center'>
            {meetingContext?.key == true ?
                meetingContext?.host == true ?
                    <>

                        <div className='h-max w-max p-3'>
                            <ReactPlayer
                                playing
                                url={meetingContext?.userStream}
                                height={400}
                                width={500} />
                        </div>
                        <div className='h-max w-max p-3'>
                            <ReactPlayer
                                playing
                                url={meetingContext?.remoteStream}
                                height={400}
                                width={500} />
                        </div>
                    </>
                    :
                    <>
                        <div className='h-screen w-screen flex justify-center items-center'>
                            <p>Please wait for the host to start the meeting.</p>
                        </div>
                    </>

                :
                <>
                    <div className='w-max h-max flex flex-col justify-evenly gap-5 p-5 shadow'>
                        <h1 className='text-2xl font-semibold'>Enter Meeting Details</h1>
                        <span className='w-[100%] h-[0.2rem] bg-slate-800 rounded'></span>
                        <form method='POST' className='flex flex-col justify-arounf items-center gap-3'>
                            <span className='flex flex-col gap-1'>
                                <p className='text-sm text-gray-600'>Meeting Id</p>
                                <input className='px-2 h-[2.25rem] w-[65vw] md:w-[35vw] border rounded' type="text" name='meetingId' value={meetingContext?.meetingCredentials?.meetingId} onChange={meetingContext?.handleChange} />
                            </span>
                            <span className='flex flex-col gap-1'>
                                <p className='text-sm text-gray-600'>Meeting Password</p>
                                <input className='px-2 h-[2.25rem] w-[65vw] md:w-[35vw] border rounded' type="password" name='meetingPassword' value={meetingContext?.meetingCredentials?.meetingPassword} onChange={meetingContext?.handleChange} />
                            </span>
                        </form>
                        <button onClick={() => { meetingContext?.handleSubmit(userContext?.currentuser.email) }} className='bg-slate-800 p-2 font-medium text-white rounded'>Log In</button>
                    </div>
                </>

            }
        </div>
    )
}

export default Meeting