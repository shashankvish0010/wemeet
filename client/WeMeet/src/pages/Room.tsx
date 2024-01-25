import React, { useContext, useEffect } from 'react'
// import ReactPlayer from 'react-player'
import { MeetingContext } from '../contexts/MeetingContext'

const Room: React.FC = () => {
    const meetingContext = useContext(MeetingContext)

    useEffect(() => {
        meetingContext?.remoteSocketId ? console.log('User Joined with', meetingContext?.remoteSocketId) : null
    }, [meetingContext?.remoteSocketId])

    return (
        <div>
            {/* <div className='h-max w-max p-3'>
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
            </div> */}
        </div>
    )
}

export default Room