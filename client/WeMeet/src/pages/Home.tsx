import React, { useContext, useEffect, useMemo, useState } from 'react'
import { Icon } from '@iconify/react'
import { useNavigate } from 'react-router'
import { userAuthContext } from '../contexts/UserAuth'
import HeadBanner from '../assets/wemeet-group-video-chat.avif'
import { EventsContext } from '../contexts/EventsContext'
import EventCard from '../components/EventCard'
import BookingCard from '../components/BookingCard'
import BenefitsCard from '../components/BenefitsCard'
import PricePlans from '../components/PricePlans'

interface meetingType {
  duration: string
  event_description: string
  event_name: string
  firstname: string
  scheduled_date: string
  scheduled_time: string
}

const Home: React.FC = () => {
  const navigate = useNavigate()
  const userContext = useContext(userAuthContext)
  const eventContext = useContext(EventsContext)
  useEffect(() => {
    userContext?.login == true ? eventContext?.getEvents(userContext?.currentuser?.id) : null
  }, [userContext?.login])

  const [userMeetings, setUserMeetings] = useState<meetingType[]>([])
  useMemo(() => userContext?.login == true ? eventContext?.getAllMeetings(userContext?.currentuser?.email).then((value: any) => {
    setUserMeetings(value)
  }).catch((error: Error) => console.log(error)) : null, [userContext?.login])

  return (
    <div className='bg-slate-100 h-max w-[100vw] flex flex-col gap-5 p-3 items-center'>
      <div className='flex md:flex-row flex-col items-center justify-evenly p-4'>
        <div className='h-[100%] md:w-[40%] p-4 rounded-md flex flex-col justify-evenly gap-2 items-center'>
          <h1 className='md:text-6xl text-2xl text-center md:text-start font-bold uppercase'>Simplifying your Meetings.</h1>
          <div className='h-max w-[100%] flex flex-col gap-2 p-3'>
            <li className='flex gap-2 items-center'>
              <Icon icon="mdi:star-three-points" height={'2vh'} />
              <p className='font-semibold text-md text-slate-800'>
                Schedule and host your meetings.
              </p>
            </li>
            <li className='flex gap-2 items-center'>
              <Icon icon="mdi:star-three-points" height={'2vh'} />
              <p className='font-semibold text-md text-slate-800'>
                Offers you immersive scheduling and group video chat experience.
              </p>
            </li>
          </div>
          <button className='text-md font-medium w-max rounded-full bg-slate-800 p-3 shadow-lg text-white'>GET STARTED</button>
        </div>
        <div className='md:w-[40%] w-[85vw] flex justify-center items-center'>
          <img className='rounded-2xl shadow-xl' src={HeadBanner} width={"400dvw"} />
        </div>
      </div>
      <div className='h-max w-screen flex items-center justify-center p-3'>
        <button onClick={() => { navigate('/add/event/' + userContext?.currentuser?.id) }} className='text-md font-medium w-max rounded-full bg-slate-800 p-3 shadow-lg text-white'>Add Your Events</button>
      </div>
      <div className='mt-5 h-max w-screen flex md:flex-row gap-3 flex-col items-center md:justify-evenly p-3'>
        {userContext?.login === true ?
          eventContext?.userEvents && eventContext.userEvents.length > 0
            ? eventContext.userEvents.map((current: any) => (
              <EventCard
                id={current.id}
                name={current.event_name}
                duration={current.duration}
                description={current.event_description}
              />
            ))
            : null
          : null}
      </div>
      <div className='bg-slate-800 mt-5 h-max md:w-[70vw] w-[90vw] flex flex-col justify-evenly gap-4 items-center p-3 rounded-b-full shadow-xl'>
        <span className='h-max w-[100%] flex flex-row items-center justify-center gap-2'>
          <Icon icon="gridicons:scheduled" color='cyan' height={'5vh'} />
          <p className='text-xl font-semibold text-white uppercase'>Upcoming Meetings</p>
        </span>
        {userContext?.login == true && userMeetings ?
          userMeetings.length > 0 ?
            userMeetings?.map((current: any) => (
              <BookingCard
                name={current.hostName}
                month={current.meetingMonth}
                date={current.meetingDate}
                time={current.meetingTime}
                description={current.eventDescription}
                username={userContext?.currentuser?.firstname}
              />
            ))
            : null
          : null
        }
        <button onClick={() => { navigate('/add/event/' + userContext?.currentuser?.id) }} className='text-md flex flex-row items-center gap-2 font-semibold w-max rounded-full bg-slate-100 p-3 shadow-lg'>See More <Icon icon="material-symbols:more-up" height={'3vh'} /></button>
      </div>
      <div className='h-max w-max flex flex-col p-3'>
        <div className='h-max w-[85vw] flex flex-col justify-evenly items-center p-3'>
          <span className='h-max w-[100%] p-3 flex items-center rounded-lg'>
            <p className='title h-[20vh] md:w-[50%] md:text-5xl bg-gradient-to-r from-slate-800 via-slate-600 to-slate-800 text-transparent bg-clip-text text-3xl'>We've got a plan that's perfect for you.</p>
          </span>
          <div className='h-max w-[100%] flex md:flex-row flex-col items-center md:justify-evenly md:gap-0 gap-10 p-5'>
            <PricePlans
              plan_name="Basic Plan"
              plan_price={0}
              feat_head="Everything in our free plan"
              features={["Access to basic features", "Access to basic features", "Access to basic features"]}
              color='white'
              headingColor='text-black'
              textGrade='text-gray-600'
              btnGrade='bg-slate-800'
              btnTxtcolor='text-white'
              distGrade='bg-slate-800'
            />
            <PricePlans
              plan_name="Business Plan"
              plan_price={20}
              feat_head="Everything in our business plan"
              features={["Access to basic features", "Access to basic features", "Access to basic features"]}
              color='bg-gradient-to-b from-slate-800 via-slate-600 to-slate-800'
              headingColor='text-white'
              textGrade='text-slate-300'
              btnGrade='bg-lime-300'
              btnTxtcolor='text-black'
              distGrade='bg-lime-300'
            />
          </div>
        </div>
      </div>
      <div className='h-max bg-gradient-to-b from-slate-800 via-slate-600 to-slate-800 text-white w-max p-3 flex flex-col items-center rounded-lg'>
        <div className='h-max w-[85vw] flex md:flex-row flex-col justify-evenly items-center p-3'>
          <span className='h-max w-[85vw] w-md:[22vw] flex flex-col gap-10 items-center'>
            <p className='title w-[100%] md:text-4xl text-lime-300 text-3xl font-semibold p-2'>Designed for those who conduct meetings at scale.</p>
            <span className='h-[150px] w-[150px] rounded-full bg-slate-800 flex flex-col justify-center items-center rotate-45 border-4 border-lime-300'>
              <Icon icon="radix-icons:arrow-up" color="white" height={'20vh'} />
            </span>
          </span>
          <div className='md:h-[45vh] md:w-[25vw] w-[80vw] flex flex-col justify-between md:items-start p-3'>
            <BenefitsCard icon='fa-regular:smile' color='#ffe505' content='Drive more retention' />
            <BenefitsCard icon='mdi:timer-sand' color='#ff9248' content='Speed up response times' />
          </div>
          <span className='md:h-[45vh] md:w-[0.3rem] h-[0.2rem] w-[105%] bg-lime-300 rounded'></span>
          <div className='md:h-[45vh] md:w-[25vw] w-[80vw] flex flex-col justify-between md:items-start p-3'>
            <BenefitsCard icon='uil:10-plus' color='yellow' content='Improve NPS' />
            <BenefitsCard icon='solar:health-linear' color='red' content='Improve customer health' />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home