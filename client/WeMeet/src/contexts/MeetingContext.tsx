import React, { createContext, useCallback, useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import peer from '../services/peer'
const socket = io('http://localhost:8080/')

interface Contextvalue {
    userStream: MediaStream | undefined
    remoteStream: MediaStream | undefined
    sendOffer: () => void
    acceptOffer: () => void
    host: boolean
    key: boolean,
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    handleSubmit: (userEmail: String) => void
    meetingCredentials: MeetingCred
}

interface MeetingCred {
    meetingId: string | undefined,
    meetingPassword: string | undefined
}

export const MeetingContext = createContext<Contextvalue | null>(null)
export const MeetingProvider = (props: any) => {
    const [UserSocketId, setUserSocketId] = useState<String>()
    const [userStream, setUserStream] = useState<MediaStream>();
    const [remoteStream, setRemoteStream] = useState<MediaStream>();
    const [connected, setConnected] = useState<boolean>();
    const [sendersOffer, setSenderOffer] = useState<any>();
    const [host, setHost] = useState<boolean>(false);
    const [key, setKey] = useState<boolean>(false)
    const [meetingCredentials, setMeetingCredentials] = useState<MeetingCred | any>({ meetingId: '', meetingPassword: '' })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setMeetingCredentials((meetingData: MeetingCred) => ({
            ...meetingData,
            [name]: value
        }))
    }

    const handleSubmit = async (userEmail: String) => {
        try {
            const { meetingId, meetingPassword } = meetingCredentials
            const response = await fetch('/get/meeting/cred/' + userEmail, ({
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    meetingId, meetingPassword
                })
            }))
            if (response) {
                const result = await response.json();
                if (result.success == true) {
                    setKey(true);
                    console.log(result);
                    result.host == true ? sendOffer() : acceptOffer()
                } else {
                    console.log(result);
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    const socketConfig = useCallback((data: String) => {
        setUserSocketId(data)
    }, [])

    const startStreaming = () => {
        navigator.mediaDevices.getUserMedia().then((stream: any) => {
            setUserStream(stream)
            stream.getTracks().forEcah((track: any) => {
                peer.peer.addTrack(track, stream)
            })
        })
    }

    const startMeeting = () => {
        setConnected(true);
        startStreaming()
    }

    const sendOffer = useCallback(async () => {
        const offer = await peer.generateOffer();
        offer ? socket.emit('offer', offer, UserSocketId, {meetingId: meetingCredentials?.meetingId}) : console.log("offer not generated");
    }, [])

    const storeOffer = useCallback(async (sendersOffer: RTCSessionDescription) => {
        setSenderOffer(sendersOffer)
        setHost(true)
    }, [])

    const acceptOffer = useCallback(async () => {
        if (sendersOffer && host == true) {
            const answer = await peer.generateAnswer(sendersOffer);
            answer ? socket.emit('answer', answer) : console.log("answer not generated");
        }
    }, [])

    const offeraccepted = useCallback(async (answer: RTCSessionDescription) => {
        if (answer) {
            await peer.setRemoteDescription(answer)
            socket.emit('connected')
        }
    }, [])

    useEffect(() => {
        if (connected == true) {
            peer.peer.addEventListener('track', (event: any) => {
                const [remote] = event.streams
                setRemoteStream(remote)
            })
        }
    }, [connected])

    useEffect(() => {
        socket.on('hello', socketConfig)
        socket.on('acceptOffer', storeOffer)
        socket.on('offeraccepted', offeraccepted)
        socket.on('startMeeting', startMeeting)

        return () => {
            socket.off('hello', socketConfig)
            socket.off('acceptOffer', acceptOffer)
            socket.off('offeraccepted', offeraccepted)
            socket.off('startMeeting', startMeeting)
        }
    }, [socket])

    const info: Contextvalue = {
        userStream, remoteStream, sendOffer, acceptOffer, host, key, handleChange, handleSubmit, meetingCredentials
    }
    return (
        <MeetingContext.Provider value={info}>
            {props.children}
        </MeetingContext.Provider>
    )
}