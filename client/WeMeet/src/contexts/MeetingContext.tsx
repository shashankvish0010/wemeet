import { createContext, useCallback, useEffect, useState } from 'react'
import { Socket, io } from 'socket.io-client'
import peer from '../services/peer'
const socket = io('http://localhost:8000/')

interface Contextvalue {
    userStream: MediaStream
    remoteStream: MediaStream    
}

export const MeetingContext = createContext<Contextvalue | null>(null)
export const MeetingProvider = (props: any) => {
    const [UserSocketId, setUserSocketId] = useState<String>()
    const [userStream, setUserStream] = useState<MediaStream>();
    const [remoteStream, setRemoteStream] = useState<MediaStream>();

    const socketConfig = useCallback((data: String) => {
        setUserSocketId(data)
    }, [])

    const sendOffer = useCallback(async () => {
        const offer = await peer.generateOffer();
        socket.emit('offer', offer, UserSocketId)
    }, [])
    

    useEffect(()=> {
        socket.on('hello', socketConfig)
    }, [socket])
  
    const info: Contextvalue = {
    }
    return (
        <MeetingContext.Provider value={info}>
            {props.children}
        </MeetingContext.Provider>
    )
}