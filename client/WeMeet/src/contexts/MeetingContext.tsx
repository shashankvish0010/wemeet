import { createContext, useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import peer from '../services/peer'
const socket = io('http://localhost:8000/')

interface Contextvalue {
    remoteStream: any
    LocalStream: any
    mycamera: boolean
    mymic: boolean
    calling: (zenNo: number | undefined) => void
    getZenList: (id: string | undefined) => void
    controlCamera: () => void
    controlMic: () => void
    zenList: any | undefined
    reciever: boolean
    pickCall: () => void
    picked: boolean
    setPicked: any
    getLocalStream: () => void
    localLiveStream: any
}

export const Socketcontext = createContext<Contextvalue | null>(null)
export const SocketProvider = (props: any) => {
    const [mycamera, setMyCamera] = useState<boolean>(true)
    const [mymic, setMyMic] = useState<boolean>(true)
    const [socketid, setSocketId] = useState<string>()
    const [caller, setCaller] = useState<boolean>(false)
    const [picked, setPicked] = useState<boolean>(false)
    const [LocalStream, setLocalStream] = useState<any>();
    const [startStream, setStartStream] = useState<boolean>(false);
    const [remoteStream, setRemoteStream] = useState<any>();

    function getSocketId(data: string) {
        setSocketId(data);
    }

    const controlCamera = () => {
        setMyCamera(!mycamera)
        console.log("cam", mycamera);
    }

    const controlMic = () => {
        setMyMic(!mymic)
        console.log("mic", mymic);
    }

    const streaming = () => {
        navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then((UsersStream) => {
            setLocalStream(UsersStream)
            // UsersStream.getTracks().forEach((track: any) => {
            //     peer.peer.addTrack(track, UsersStream)
            // })
            for (const track of UsersStream.getTracks()) {
                peer.peer.addTrack(track, UsersStream)
            }
        })
    }

    function videcall() {
        setStartStream(true)
        streaming()
    }

    const calling = async () => {
        const offer = await peer.generateOffer()
        socket.emit('call', socketid, offer)
        setCaller(true)
    }

    async function callaccepted(data: any) {
        const { answer } = data
        await peer.setRemoteDescription(answer)
        socket.emit('done')
    }

    const pickCall = () => {
        socket.emit('recieved')
    }

    async function recieverCall(data: any) {
        const { sendersOffer } = data
        const answer = await peer.generateAnswer(sendersOffer)
        socket.emit('callrecieved', answer)
    }

    async function handleNegotiation() {
        if (caller == true) {
            const offer = await peer.generateOffer();
            socket.emit('negotiation', offer)
        } else console.log("not a caller")
    }

    async function negotiationaccept(data: any) {
        const answer = await peer.generateAnswer(data.sendersNegoOffer)
        socket.emit('negotiationdone', answer)
    }

    async function acceptnegotiationanswer(data: any) {
        await peer.setRemoteDescription(data.receiverNegoAnswer).then(() => {
            socket.emit('done')
        })
    }

    useEffect(() => {
        peer.peer.addEventListener('negotiationneeded', handleNegotiation);
        return () => {
            peer.peer.removeEventListener('negotiationneeded', handleNegotiation)
        }
    }, [handleNegotiation])

    useEffect(() => {
        if (startStream == true) {
            peer.peer.addEventListener('track', async (event: any) => {
                const [remoteStream] = event.streams;
                setRemoteStream(remoteStream)
            });
        }
    }, [startStream])


    useEffect(() => {
        socket.on('hello', getSocketId)
        socket.on("pickcall", pickCall)
        socket.on('recieverCall', recieverCall)
        socket.on('callaccepted', callaccepted)
        socket.on('negotiationaccept', negotiationaccept)
        socket.on('acceptnegotiationanswer', acceptnegotiationanswer)
        socket.on('videocall', videcall)

        return () => {
            socket.off('hello', getSocketId)
            socket.off("callercalling", callercalling)
            socket.off('recieverCall', recieverCall)
            socket.off('callaccepted', callaccepted)
            socket.off('negotiationaccept', negotiationaccept)
            socket.off('acceptnegotiationanswer', acceptnegotiationanswer)
            socket.off('videocall', videcall)
        }
    }
        , [socket, getSocketId,
            callaccepted,
            negotiationaccept,
            acceptnegotiationanswer,
            videcall
        ])

    const info: Contextvalue = {
        LocalStream, remoteStream, mycamera, controlCamera, mymic, controlMic, setPicked,
    }
    return (
        <Socketcontext.Provider value={info}>
            {props.children}
        </Socketcontext.Provider>
    )
}