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
        <div className='relative h-screen w-screen flex flex-col justify-center'>
            {
                meetingContext?.userStream ?
                    <div className='absolute ml-[50%]'>
                        <ReactPlayer
                            playing
                            url={meetingContext?.userStream}
                            height={'20vh'}
                            width={'30vw'} />
                    </div> : null
            } {
                meetingContext?.remoteStream ?
                    <div className='h-max w-[100%]'>
                        <ReactPlayer
                            playing
                            url={meetingContext?.remoteStream}
                            height={'80vh'}
                            width={'70vw'} />
                        <div className='absolute h-[10vh] w-[100%] gap-4 p-3 flex justify-center items-center'>
                            <Icon className='bg-teal-500 rounded-full p-2' icon="cil:mic" color='white' height={'5vh'} />
                            <Icon className='bg-teal-500 rounded-full p-2' icon="majesticons:video-line" color='white' height={'5vh'} />
                            <Icon className='bg-red-500 rounded-full p-2' icon="ic:round-call-end" color='white' height={'5vh'} />
                            <Icon className='bg-teal-500 rounded-full p-2' icon="basil:chat-outline" color='white' height={'5vh'} />
                        </div>
                    </div>
                    : null
            }
            <div className='h-[100vh] w-[100vw] md:w-[40vw] flex flex-col gap-3 p-3'>
                <div className='flex flex-col items-center gap-3 p-3'>
                    <p className='title font-medium bg-slate-800 text-lime-300'>Participants</p>
                    {
                        userContext?.currentuser && meetingContext?.remoteUser ?
                            <>
                                <p>{userContext?.currentuser?.firstname} {userContext?.currentuser?.lastname}</p>
                                <p>{meetingContext?.remoteUser?.firstname} {meetingContext?.remoteUser?.lastname}</p>
                            </>
                            : null
                    }
                </div>
                <div className='h-max w-max p-3 gap-4 flex flex-col'>
                    <div>
                        <span>Messages</span>
                        {
                            meetingContext?.myChatMeesage?.map((message: any) =>
                                <span className='ml-[100%] flex flex-col'>
                                    {message}
                                </span>
                            )
                        }
                        {
                            meetingContext?.remoteUserChatMeesage?.map((message: any) =>
                                <span className='mr-[100%] flex flex-col'>
                                    {message}
                                </span>
                            )
                        }
                    </div>
                    <div className='flex'>
                        <input type="text" placeholder='Enter Message' value={myMessage || ''} onChange={(e: ChangeEvent<HTMLInputElement>) => {setMyMessage(e.target.value)}} />
                        <Icon onClick={() => {meetingContext?.sendChat(myMessage)}} icon="cil:send" color='black' height='5vh' />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Room