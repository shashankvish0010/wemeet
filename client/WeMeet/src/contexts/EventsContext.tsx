import { createContext, useState } from 'react'

interface ContextValue {
    event: eventType;
    handleSubmit: (e: React.FormEvent, id: string | undefined) => any;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    getEvents: (id: string) => void;
    message: string | undefined | null;
}

interface eventType {
    name: string,
    duration: any,
    description: string
}
export const EventsContext = createContext<ContextValue | null>(null)
export const EventsContextProvider = ({children}: any) => {
    const [userEvents, setUserEvents] = useState<any>();
    const [message, setMessage] = useState<string | undefined | null>()
    const [event, setEvent] = useState<eventType>(
        {
            name: '',
            duration: '',
            description: ''
        }
    );

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
            const response = await fetch('/get/events/'+id, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json"
                }
            });
            if(response){
                const data = await response.json();
                if(data.succes == true){
                    setUserEvents((userEvents: any) => [
                        ...userEvents,
                        data.events
                    ])
                }else{
                    console.log(data);
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleSubmit = async (e: React.FormEvent, id: string | undefined) => {
        e.preventDefault();        
        const { name, duration, description } = event;
        try {
            const response = await fetch('/create/event/'+id, {
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
    const info: ContextValue = { event, handleChange, handleSubmit, getEvents, message, eventsArray }
    return (
        <EventsContext.Provider value={info}>
            {children}
        </EventsContext.Provider>
    )
}