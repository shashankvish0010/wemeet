import { createContext, useState } from 'react'

interface ContextValue {
    event: eventType;
    handleSubmit: (e: React.FormEvent, id: string | undefined) => any;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    getEvents: (id: string) => void;
    message: string | undefined | null;
    userEvents: any
    time: number[]
    intervals: number[]
    timing: any
    settiming: any
}

interface eventType {
    id: string,
    name: string,
    duration: any,
    description: string
}
export const EventsContext = createContext<ContextValue | null>(null)
export const EventsContextProvider = ({ children }: any) => {
    const [userEvents, setUserEvents] = useState<eventType[]>([]);
    const [message, setMessage] = useState<string | undefined | null>();
    const [event, setEvent] = useState<eventType>(
        {
            id: '',
            name: '',
            duration: '',
            description: ''
        }
    );
    let time: any[] = [
        12 , 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11
    ]

    let intervals: number[] = [ 0o0, 15, 30, 45 ]

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEvent(event => ({
            ...event,
            [name]: value
        })
        )
    }

    const getEvents = async (id: string) => {
        try {
            const response = await fetch('/get/events/' + id, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json"
                }
            });
            if (response) {
                const data = await response.json();
                if (data.succes == true) {
                    // for (let i = 0; i < data.events.length; i++) {
                    //     setUserEvents((userEvents: any) => [
                    //         ...userEvents,
                    //         data.events[i]
                    //     ])
                    // }
                    setUserEvents((userEvents) => [...userEvents, ...data.events]);

                    console.log(data);

                } else {
                    console.log(data);
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    // const eventinfo = async (id: string) => {
    //     try {
    //         const response = await fetch('/event/'+id, {
    //             method: "GET",
    //             headers:{
    //                 "Content-Type": "application/json"
    //             }
    //         });
    //         if(response){
    //             const data = await response.json();
    //             if(data.success == true){
    //                 console.log(data);
    //             }else{
    //                 console.log(data);
    //             }
    //         }
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }

    const [timing, settiming] = useState<string>('')

    const handleSubmit = async (e: React.FormEvent, id: string | undefined) => {
        e.preventDefault();
        const { name, duration, description } = event;
        try {
            const response = await fetch('/create/event/' + id, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name, duration, description
                })
            })

            if (response) {
                const data = await response.json();
                if (data.success == true) {
                    console.log(data);
                } else {
                    console.log(data);
                    setMessage(data.message)
                }
            } else {
                console.log("Didn't Got any Response");
            }
        } catch (error) {
            console.log(error);
        }
    }
    const info: ContextValue = { event, handleChange, handleSubmit, getEvents, message, userEvents, time, intervals, timing, settiming }
    return (
        <EventsContext.Provider value={info}>
            {children}
        </EventsContext.Provider>
    )
}