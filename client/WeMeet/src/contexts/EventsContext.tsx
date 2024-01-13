import { createContext, useState } from 'react'

interface ContextValue {
    event: eventType
    handleSubmit: (e: React.FormEvent, id: string | undefined) => any
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    getEvents: (id: string) => void
    getAllMeetings: (userEmail: string) => any
    message: string | undefined | null
    userEvents: any
    time: number[]
    intervals: number[]
    bookTime: string
    setBookTime: any
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

    let intervals: any[] = ["00", "15", "30", "45"]

    const [bookTime, setBookTime] = useState<string>('')

    const calcTime = (eventDuration: number) => {
        let array: any[] = [];
        if (eventDuration == 15) {
            time.map((time: number) => {
                for (let i = 0; i < intervals.length; i++) {
                    array.push(`${time}:${intervals[i]}`);
                }
            })
        } else if (eventDuration == 30) {
            time.map((time: number) => {
                for (let i = 0; i < 3; i++) {
                    i == 0 || i == 2 ?
                        array.push(`${time}:${intervals[i]}`)
                        :
                        null
                }
            })
        } else if (eventDuration == 45) {
            time.map((time: number) => {
                for (let i = 0; i < intervals.length; i++) {
                    i == 0 || i == 3 ?
                        array.push(`${time}:${intervals[i]}`)
                        :
                        null
                }
            })
        } else {
            return 0
        }
        return array
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
                    setUserEvents(data.events)
                    console.log(data);

                } else {
                    console.log(data);
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

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

    let months: string[] = [
        "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
    ]

    const filterMeetingData = (meetingData: any) => {
        const filteredData: any [] = []
        let monthNo: number;
        let date: number
        let month: string | undefined
        console.log("meetingData");
        
        for (let x=0 ; x<meetingData.length ; x++) {
            monthNo = Number(`${meetingData[x].scheduled_date}`.slice(5,7)) - 1;
            date = Number(`${meetingData[x].scheduled_date}`.slice(8,10)) - 1;
            months.map((monthValue: string, index: number)=>{
                if(index == monthNo){
                    month = monthValue
                }
            })
                filteredData.push({
                    eventName: meetingData[x].event_name,
                    eventDescription: meetingData[x].event_description,
                    eventDuration: meetingData[x].duration,
                    hostName: meetingData[x].firstname,
                    meetingDate: date,
                    meetingMonth: month,
                    meetingTime: meetingData[x].scheduled_time,
                })
            }        
            return filteredData    
        }

    const getAllMeetings = async (userEmail: string) => {
        console.log("enter", userEmail);
        try {
            const response = await fetch('/fetch/meetings/' + userEmail, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });
            if (response) {
                const data = await response.json();
                if (data.success == true) { 
                    console.log(data);
                                          
                 return filterMeetingData(data.meetingData)
                } else {
                    console.log(data);
                }
            }else{
                console.log("Didn't Got any Response");   
            }
        } catch (error) {
            console.log(error);
        }
    }

    const info: ContextValue = { event, handleChange, handleSubmit, getEvents, calcTime, getAllMeetings, bookTime, setBookTime, message, userEvents, time, intervals, timing, settiming }
    return (
        <EventsContext.Provider value={info}>
            {children}
        </EventsContext.Provider>
    )
}