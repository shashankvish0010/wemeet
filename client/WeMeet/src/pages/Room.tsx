import React, { ChangeEvent, useContext, useEffect, useState } from 'react'
import ReactPlayer from 'react-player'
import { MeetingContext } from '../contexts/MeetingContext'
import { Icon } from '@iconify/react/dist/iconify.js'
import { userAuthContext } from '../contexts/UserAuth'

const Room: React.FC = () => {
    const userContext = useContext(userAuthContext)
    const meetingContext = useContext(MeetingContext);
    const [myMessage, setMyMessage] = useState<string | undefined>()

    useEffect(() => {
        meetingContext?.remoteSocketId ? console.log('User Joined with', meetingContext?.remoteSocketId) : null
    }, [meetingContext?.remoteSocketId])

    return (
        <div className='bg-slate-100 h-max h-screen w-screen flex md:flex-row flex-col justify-center'>
            <div className='md:h-[100vh] h-max md:w-[65vw] w-[100vw] flex flex-col items-center'>
                <button className='bg-lime-300 font-semibold text-black uppercase p-2 rounded' onClick={() => { meetingContext?.handleNegotiation() }}>Start Meeting</button>
                {
                    meetingContext?.userStream ?
                        <span className='rounded border-2 border-slate-100 h-[20vh] absolute w-[30vw] mt-[10%] md:mt-[5%] ml-[20%] md:ml-[40%]'>
                            <ReactPlayer
                                playing
                                url={meetingContext?.userStream}
                                height='100%'
                                width='100%' />
                        </span> : null
                } {
                    meetingContext?.remoteStream ?
                        <div className='rounded border-2 flex flex-col items-center border-lime-300 md:h-[70vh] md:w-[60vw] h-[80vh] w-[100vw]'>
                            <ReactPlayer
                                playing
                                url={meetingContext?.remoteStream}
                                height='100%'
                                width='100%' />
                            <div className='bg-slate-100 h-[10vh] w-max gap-4 p-3 flex justify-center items-center'>
                                <Icon onClick={() => { meetingContext?.toggleAudioMute() }} className='cursor-pointer bg-teal-500 rounded-full p-2' icon="cil:mic" color='white' height={'6vh'} />
                                <Icon onClick={() => { meetingContext?.toggleVideoMute() }} className='cursor-pointer bg-teal-500 rounded-full p-2' icon="majesticons:video-line" color='white' height={'6vh'} />
                                <Icon onClick={() => { meetingContext?.endMeeting() }} className='cursor-pointer bg-red-500 rounded-full p-2' icon="ic:round-call-end" color='white' height={'6vh'} />
                                <Icon className='bg-teal-500 rounded-full p-2' icon="basil:chat-outline" color='white' height={'6vh'} />
                            </div>
                        </div>
                        : null
                }
            </div>
            <div className='bg-white md:h-[100vh] h-max w-[100vw] md:w-[35vw] overflow-y-scroll flex flex-col gap-3 p-3 border-l-2 border-gray-200'>
                <div className='flex flex-col gap-3 p-3'>
                    <p className='text-xl h-max w-max font-bold bg-gray-200 p-2 rounded'>Participants</p>
                    <span className='h-[.25rem] rounded-xl w-[100%] bg-gray-200'></span>
                    {
                        userContext?.currentuser && meetingContext?.remoteUser ?
                            < div className='h-max w-max flex flex-col items-center gap-3 p-3'>
                                <p className='h-max w-[100%] title text-lg'>{userContext?.currentuser?.firstname} {userContext?.currentuser?.lastname}</p>
                                <p className='h-max w-[100%] title text-lg'>{meetingContext?.remoteUser?.firstname} {meetingContext?.remoteUser?.lastname}</p>
                            </div>
                            : null
                    }
                </div>
                <div className='hidden h-max w-[100%] p-3 gap-4 md:flex flex-col'>
                    <h2 className='text-xl h-max w-max font-bold bg-gray-200 p-2 rounded'>Messages</h2>
                    <span className='h-[.25rem] rounded-xl w-[100%] bg-gray-200'></span>
                    <div className='h-max w-[80%] flex flex-col gap-2'>
                        <p className='h-max w-[100%] title text-base'>Your Chat</p>
                        {
                            meetingContext?.ChatMessage.map((messageData: any) =>
                                messageData.sender == false ?
                                    <div className='h-max w-max chat bg-lime-300 p-2 text-base rounded-xl flex flex-col'>
                                        <p className='text-xs text-black'>{userContext?.currentuser.firstname}</p>
                                        {
                                            messageData.message.length > 15 ?
                                                <p className='h-max w-[25vw]'>{messageData.message}</p>
                                                :
                                                <p className='h-max w-max'>{messageData.message}</p>
                                        }
                                    </div>
                                    :
                                    <div className='h-max w-max chat bg-slate-800 text-white p-2 text-base rounded-xl flex flex-col'>
                                        <span className='text-xs text-white'>{meetingContext?.remoteUser?.firstname}</span>
                                        {
                                            messageData.message.length > 15 ?
                                                <p className='h-max w-[25vw]'>{messageData.message}</p>
                                                :
                                                <p className='h-max w-max'>{messageData.message}</p>
                                        }
                                    </div>
                            )
                        }
                    </div>
                    <div className='hidden md:flex flex-row items-center h-max w-[100%] gap-3'>
                        <input className='h-[8vh] w-[80%] rounded border-2 border-gray-200 p-2 text-base font-normal focus-visible:outline-none shadow-xl' type="text" placeholder='Type Your Message' value={myMessage || ''} onChange={(e: ChangeEvent<HTMLInputElement>) => { setMyMessage(e.target.value) }} />
                        <Icon className='bg-lime-300 rounded p-3 h-[8vh] w-max' onClick={() => { meetingContext?.sendChat(myMessage) }} icon="cil:send" color='black' height='5vh' />
                    </div>
                </div>
            </div>
        </div >
    )
}

export default Room