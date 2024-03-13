import React, { createContext, useCallback, useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import Peerconnection from '../services/peer'
// import { userAuthContext } from './UserAuth'
const socket = io('https://wemeet-backend.onrender.com/')

interface Contextvalue {
    userStream: MediaStream | undefined
    remoteStream: MediaStream | undefined
    key: boolean,
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    handleSubmit: (userEmail: String) => void
    meetingCredentials: MeetingCred
    remoteSocketId: string | undefined
    remoteUser: { firstname: string, lastname: string } | undefined
    ChatMessage: string[] | any
    sendChat: (myMessage: any) => void
    handleNegotiation: () => void
    endMeeting: () => void
    toggleVideoMute: () => void
    toggleAudioMute: () => void
}

interface MeetingCred {
    meetingId: string | undefined,
    meetingPassword: string | undefined
}

export const MeetingContext = createContext<Contextvalue | null>(null)
export const MeetingProvider = (props: any) => {
    // const userContext = useContext(userAuthContext)
    let UserSocketId: string | undefined
    let remoteSocketId: string | undefined
    let host: boolean = false

    const [key, setKey] = useState<boolean>(false)
    const [remoteUser, setRemUser] = useState<{ firstname: string, lastname: string } | undefined>()
    const [userStream, setUserStream] = useState<MediaStream | any>();
    const [remoteStream, setRemoteStream] = useState<MediaStream | any>();
    const [connected, setConnected] = useState<boolean>();
    const [meetingCredentials, setMeetingCredentials] = useState<MeetingCred | any>({ meetingId: '', meetingPassword: '' })
    const [ChatMessage, setChatMessage] = useState<string[] | any[]>([])
    const [isVideoMuted, setIsVideoMuted] = useState(false);
    const [isAudioMuted, setIsAudioMuted] = useState(false);

    //******************** Meeting Controller ************************/

    const toggleVideoMute = () => {
        if (userStream) {
            userStream.getVideoTracks().forEach((track: any) => {
                track.enabled = !isVideoMuted;
            });
            setIsVideoMuted(!isVideoMuted);
        }
    };

    const toggleAudioMute = () => {
        if (userStream) {
            userStream.getAudioTracks().forEach((track: any) => {
                track.enabled = !isAudioMuted;
            });
            setIsAudioMuted(!isAudioMuted);
        }
    };

    const endMeeting = () => {
        const userMediaTracks = userStream.getTracks();
        userMediaTracks.forEach((track: any) => track.stop());
        setUserStream(null);
        setRemoteStream(null);
        // Close the connection
        Peerconnection.peer.close();
        window.location.href = '/'
    }

    //******************** Video Chat Meeting ************************/


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
    }

    const validcred = () => {
        setKey(true)
    }

    const socketConfig = useCallback((data: string) => {
        UserSocketId = data
        console.log(data);
    }, [])

    const userJoinedMeeting = useCallback((data: { socket_ID: string, email_address: string, firstname: string, lastname: string, host: boolean }) => {
        remoteSocketId = data.socket_ID
        setRemUser({
            firstname: data.firstname, lastname: data.lastname
        })
        data.host == false ?
            sendOffer() : null
    }, [])

    const startStreaming = useCallback(() => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
            setUserStream(stream)
            stream?.getTracks().forEach((track: any) => {
                Peerconnection.peer.addTrack(track, stream)
            })
        }).catch((error) => console.log(error))
    }, [userStream, connected])

    const startMeeting = useCallback(() => {
        startStreaming()
        setConnected(true)
    }, [])

    const sendOffer = useCallback(async () => {
        host = true
        const offer = await Peerconnection.generateOffer();
        offer ? socket.emit('offer', { offer, UserSocketId, remoteSocketId, meetingId: meetingCredentials?.meetingId }) : console.log("offer not generated");
    }, [])

    const acceptOffer = useCallback(async (sendersOffer: any) => {
        if (sendersOffer) {
            await Peerconnection.generateAnswer(sendersOffer).then((answer) => {
                answer ? socket.emit('answer', answer) : console.log("answer not generated");
            }).catch((error) => console.log(error))
        }
    }, [])

    const offeraccepted = useCallback(async (data: any) => {
        if (data.answer) {
            console.log("offeraccepted answer", data.answer);
            await Peerconnection.setRemoteDescription(data.answer).then(async () => {
                socket.emit('connected')
            }).catch((error) => console.log(error))
        }
    }, [])

    const handleNegotiation = useCallback(async () => {
        console.log("call:NEGO");
        if (host === true) {
            sendOffer()
        } else {
            acceptOffer
        }
    }, [])

    //********************************* Chat Messages ******************************************/

    const sendChat = useCallback(async (myMessage: any) => {
        setChatMessage(prevMessage => [...prevMessage, { message: myMessage, sender: false }])
        socket.emit('send', { message: myMessage })
    }, [socket])

    const messageFromRemote = (data: any) => {
        setChatMessage(prevMessage => [...prevMessage, { message: data.message, sender: data.sender }])
        console.log("remotearray", ChatMessage);
    }

    useEffect(() => {
        if (connected == true) {
            Peerconnection.peer.addEventListener('track', (event: any) => {
                let [remote] = event.streams
                setRemoteStream(remote)
            })
        }
    }, [remoteStream, connected])

    useEffect(() => {
        socket.on('hello', socketConfig)
        socket.on('validcred', validcred)
        socket.on('userJoinedMeeting', userJoinedMeeting)
        socket.on('acceptOffer', acceptOffer)
        socket.on('offeraccepted', offeraccepted)
        socket.on('startMeeting', startMeeting)
        socket.on('messageFromRemote', messageFromRemote)

        return () => {
            socket.off('hello', socketConfig)
            socket.off('validcred', validcred)
            socket.off('userJoinedMeeting', userJoinedMeeting)
            socket.off('acceptOffer', acceptOffer)
            socket.off('offeraccepted', offeraccepted)
            socket.off('startMeeting', startMeeting)
            socket.off('messageFromRemote', messageFromRemote)
        }
    }, [socket])

    const info: Contextvalue = {
        userStream, remoteStream, remoteSocketId, key, toggleAudioMute, toggleVideoMute, endMeeting, handleChange, handleSubmit, sendChat, meetingCredentials, remoteUser, ChatMessage, handleNegotiation
    }
    return (
        <MeetingContext.Provider value={info}>
            {props.children}
        </MeetingContext.Provider>
    )
}