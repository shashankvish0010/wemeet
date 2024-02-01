import React, { useContext, useEffect } from 'react'
import ReactPlayer from 'react-player'
import { MeetingContext } from '../contexts/MeetingContext'

const Room: React.FC = () => {
    const meetingContext = useContext(MeetingContext)

    useEffect(() => {
        meetingContext?.remoteSocketId ? console.log('User Joined with', meetingContext?.remoteSocketId) : null
    }, [meetingContext?.remoteSocketId])

    return (
        <div className='h-screen w-screen flex flex-col justify-center items-center'>
            {
                meetingContext?.userStream ?
                    <div className='h-max w-max p-3'>
                        <ReactPlayer
                            playing
                            url={meetingContext?.userStream}
                            height={400}
                            width={500} />
                    </div> : null
            } {
                meetingContext?.remoteStream ?
                    <div className='h-max w-max p-3'>
                        <ReactPlayer
                            playing
                            url={meetingContext?.remoteStream}
                            height={400}
                            width={500} />
                    </div>
                    : null
            }
        </div>
    )
}

export default Room