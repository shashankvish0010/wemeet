import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import peer from '../services/peer'
import { userAuthContext } from './UserAuth'
const socket = io('http://localhost:8080/')

interface Contextvalue {
    userStream: MediaStream | undefined
    remoteStream: MediaStream | undefined
    key: boolean,
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    handleSubmit: (userEmail: String) => void
    meetingCredentials: MeetingCred
    remoteSocketId: string | undefined
    remoteUser: { firstname: string, lastname: string } | undefined
    myMessage: string | undefined
    setMyMessage: any
    myChatMeesage: string[] | undefined
    remoteUserChatMeesage: string[] | undefined
    sendChat: () => void
}

interface MeetingCred {
    meetingId: string | undefined,
    meetingPassword: string | undefined
}

export const MeetingContext = createContext<Contextvalue | null>(null)
export const MeetingProvider = (props: any) => {
    const userContext = useContext(userAuthContext)
    let UserSocketId: string | undefined
    let remoteSocketId: string | undefined
    let remoteUserEmailAddress: string | undefined
    let host: boolean = false

    const [key, setKey] = useState<boolean>(false)
    const [remoteUser, setRemUser] = useState<{ firstname: string, lastname: string } | undefined>()
    const [userStream, setUserStream] = useState<MediaStream>();
    const [remoteStream, setRemoteStream] = useState<MediaStream>();
    const [connected, setConnected] = useState<boolean>();
    const [meetingCredentials, setMeetingCredentials] = useState<MeetingCred | any>({ meetingId: '', meetingPassword: '' })
    const [myMessage, setMyMessage] = useState<string | undefined>()
    const myChatMeesage: any[] = [] 
    const remoteUserChatMeesage: any[] = [] 

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setMeetingCredentials((meetingData: MeetingCred) => ({
            ...meetingData,
            [name]: value
        }))
    }

    const handleSubmit = async (userEmail: String) => {
        console.log(userEmail);
        const { meetingId, meetingPassword } = meetingCredentials
        socket.emit('meetingCredential', { meetingId, meetingPassword, userEmail })
        // const response = await fetch('/get/meeting/cred/' + userEmail, ({
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify({
        //         meetingId, meetingPassword
        //     })
        // }))
        // if (response) {
        //     const result = await response.json();
        //     if (result.success == true) {
        //         setKey(true);
        //         console.log(result);
        //         result.host == true ? sendOffer() : acceptOffer()
        //     } else {
        //         console.log(result);
        //     }
    }

    const validcred = () => {
        setKey(true)
    }

    const socketConfig = useCallback((data: string) => {
        UserSocketId = data
        console.log(data);
    }, [])

    const userJoinedMeeting = useCallback((data: { socket_ID: string, email_address: string, host: boolean }) => {
        remoteSocketId = data.socket_ID
        remoteUserEmailAddress = data.email_address
        data.host == false ?
            sendOffer() : null
    }, [])

    const startStreaming = () => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream: any) => {
            setUserStream(stream)
            stream.getTracks().forEach((track: any) => {
                peer.peer.addTrack(track, stream)
            })
        })
    }

    const startMeeting = () => {
        setConnected(true);
        startStreaming()
    }

    const sendOffer = useCallback(async () => {
        host = true
        const offer = await peer.generateOffer();
        console.log("offer", offer, UserSocketId, remoteSocketId);
        offer ? socket.emit('offer', { offer, UserSocketId, remoteSocketId, meetingId: meetingCredentials?.meetingId }, { id: userContext?.currentuser.id }) : console.log("offer not generated");
    }, [])

    const acceptOffer = useCallback(async (sendersOffer: any) => {
        if (sendersOffer) {
            const answer = await peer.generateAnswer(sendersOffer);
            console.log("answer", answer);
            answer ? socket.emit('answer', answer) : console.log("answer not generated");
        }
    }, [])

    const offeraccepted = useCallback(async (data: any) => {
        if (data.answer) {
            console.log("offeraccepted answer", data.answer);
            peer.setRemoteDescription(data.answer).then(() => {
                socket.emit('connected')
            }).catch((error) => console.log(error))
        }
    }, [])

    const handleNegotiation = async () => {
        if (host == true) {
            const offer = await peer.generateOffer();
            socket.emit('negotiaionOffer', offer)
        }
    }

    const negotiationaccept = async (data: any) => {
        const answer = await peer.generateAnswer(data.sendersNegoOffer)
        socket.emit('negotiationdone', answer);
        setUsersData()
    }

    const acceptnegotiationanswer = async (data: any) => {
        await peer.setRemoteDescription(data.receiverNegoAnswer).then(() => {
            socket.emit('connected')
        }).catch((error) => console.log(error))
    }

    const setUsersData = () => {
        socket.emit('getRemoteUser', { email: remoteUserEmailAddress })
    }

    const setremoteUser = (remoteUser: { firstname: string, lastname: string }) => {
        setRemUser(remoteUser)
    }

    const sendChat = async () => {
        myChatMeesage.push(myMessage)
        socket.emit('send', { message: myChatMeesage, socketId: UserSocketId })
    }

    const messageFromRemote = (data: any) => {
        remoteUserChatMeesage.push(data.message)
    }

    useEffect(() => {
        peer.peer.addEventListener('negotiationneeded', handleNegotiation);
        return () => {
            peer.peer.addEventListener('negotiationneeded', handleNegotiation);
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
        socket.on('validcred', validcred)
        socket.on('userJoinedMeeting', userJoinedMeeting)
        socket.on('acceptOffer', acceptOffer)
        socket.on('offeraccepted', offeraccepted)
        socket.on('startMeeting', startMeeting)
        socket.on('negotiationaccept', negotiationaccept)
        socket.on('acceptnegotiationanswer', acceptnegotiationanswer)
        socket.on('remoteUser', setremoteUser)
        socket.on('messageFromRemote', messageFromRemote)

        return () => {
            socket.off('hello', socketConfig)
            socket.off('validcred', validcred)
            socket.off('userJoinedMeeting', userJoinedMeeting)
            socket.off('acceptOffer', acceptOffer)
            socket.off('offeraccepted', offeraccepted)
            socket.off('startMeeting', startMeeting)
            socket.off('negotiationaccept', negotiationaccept)
            socket.off('acceptnegotiationanswer', acceptnegotiationanswer)
            socket.off('remoteUser', setremoteUser)
            socket.off('messageFromRemote', messageFromRemote)
        }
    }, [socket])

    const info: Contextvalue = {
        userStream, remoteStream, remoteSocketId, key, handleChange, handleSubmit, sendChat, meetingCredentials, remoteUser, myChatMeesage, setMyMessage, remoteUserChatMeesage,
        myMessage
    }
    return (
        <MeetingContext.Provider value={info}>
            {props.children}
        </MeetingContext.Provider>
    )
}