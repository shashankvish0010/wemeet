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
    array: any[]
    calcTime: (eventDuration: number) => void
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
        "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11"
    ]

    let intervals: any[] = [ "00", "15", "30", "45" ]

    let array: any[]=[];

    const calcTime = async (eventDuration: number) => {        
        if (eventDuration == 15) {
             time.map((time: number) => {     
                for(let i=0 ; i<intervals.length ; i++){
                    array.push(`${time}:${intervals[i]}`);
                }
                return array             
            })
        } else if (eventDuration == 30) {
            time.map((time: number) => {
                for(let i=0 ; i<3 ; i++){
                    i==0 || i==2 ?
                    array.push(`${time}:${intervals[i]}`)
                    :
                    null
                }
                return array             
            })
        } else if (eventDuration == 45) {
            time.map((time: number) => {
                for(let i=0 ; i<intervals.length ; i++){
                    i==0 || i==3 ?
                    array.push(`${time}:${intervals[i]}`)
                    :
                    null
                }
                return array             
            })
        } else {
            return 0
        }
    }

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
    const info: ContextValue = { event, handleChange, handleSubmit, getEvents, calcTime, array, message, userEvents, time, intervals, timing, settiming }
    return (
        <EventsContext.Provider value={info}>
            {children}
        </EventsContext.Provider>
    )
}