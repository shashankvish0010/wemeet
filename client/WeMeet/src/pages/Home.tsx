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
import { motion } from 'framer-motion'
import working from '../utils/working.json'
import Login_img from '../assets/3d-render-secure-login-password-illustration.jpg'
import Events_img from '../assets/add_event.jpg'
import Book_Meetings from '../assets/meeting.jpg'
import Call from '../assets/onetoone.jpg'
import Footer from '../components/Footer'

interface meetingType {
  duration: string
  event_description: string
  event_name: string
  firstname: string
  scheduled_date: string
  scheduled_time: string
}

const Home: React.FC = () => {
  const images = [Login_img, Book_Meetings, Events_img, Call]
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
    <>
    <div className='bg-slate-100 h-max w-[100vw] flex flex-col gap-5 p-3 items-center'>
      <div className='flex md:flex-row flex-col items-center justify-evenly p-4'>
        <motion.div initial={{ opacity: 0, x: -100 }} animate={{ opacity: 1, x: 0 }} transition={{ behaviour: "smooth", duration: 0.7 }}
          className='h-[100%] md:w-[40%] p-4 rounded-md flex flex-col justify-evenly gap-2 items-center'>
          <h1 className='md:text-6xl text-2xl text-center md:text-start font-bold uppercase'>Simplifying your Meetings.</h1>
          <div className='h-max w-[100%] flex flex-col gap-2 p-3'>
            <li className='md:w-max w-[80vw] flex gap-2 items-center'>
              <Icon icon="mdi:star-three-points" height={'1rem'} />
              <p className='font-semibold text-md text-slate-800'>
                Schedule and host your meetings.
              </p>
            </li>
            <li className='md:w-max w-[80vw] flex gap-2 items-center'>
              <Icon icon="mdi:star-three-points" height={'1rem'} />
              <p className='font-semibold w-[100%] text-md text-slate-800'>
                Offers you immersive scheduling and video chat experience.
              </p>
            </li>
          </div>
          <button className='text-md font-medium w-max rounded-full bg-slate-800 p-3 shadow-lg text-white'>GET STARTED</button>
        </motion.div>
        <div className='md:w-[40%] w-[85vw] flex justify-center items-center'>
          <motion.img initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} transition={{ behaviour: "smooth", duration: 0.7 }}
            className='rounded-2xl shadow-xl' src={HeadBanner} width={"400vw"} />
        </div>
      </div>
      {
        userContext?.login == true ?
          <span className='w-[85vw] p-3'>
            <p className='title md:text-3xl bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 text-transparent bg-clip-text text-2xl'>Your Event Updates</p>
          </span>
          :
          <div className='flex flex-col items-center w-screen h-max'>
            <span className='w-[85vw] p-3 text-center'>
              <p className='title md:text-3xl bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 text-transparent bg-clip-text text-2xl'>How WeMeet Works?</p>
            </span>
            <div className='h-max w-[85vw] flex flex-col items-center gap-5 p-3'>
              {
                working?.map((data, index) =>
                  <div className='h-max w-[85vw] flex md:flex-row flex-col justify-evenly items-center gap-5 p-3'>
                    <motion.div initial={{ opacity: 0, x: -100 }} animate={{ opacity: 1, x: 0 }} transition={{ behaviour: "smooth", duration: 0.7 }}
                      className='text-black h-max md:w-[40%] w-[85vw] p-3 flex flex-col gap-3'>
                      <span className='text-blue-600 font-medium md:text-xl text-base uppercase'>{data.step}</span>
                      <h1 className='title md:text-3xl text-xl'>{data.title}</h1>
                      <p className='md:text-xl text-base font-thin'>
                        {data.description}
                      </p>
                    </motion.div>
                    <div
                      className='md:w-[40%] w-[85vw] flex justify-center items-center'>
                      <motion.img initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} transition={{ behaviour: "smooth", duration: 0.7 }}
                        className='rounded-2xl shadow-xl' src={images[index]} width={"250rem"} />
                    </div>
                  </div>
                )
              }
            </div>
          </div>
      }
      <div className='h-max w-screen flex md:flex-row gap-3 flex-col items-center md:justify-evenly p-3'>
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
      <div className='h-max w-screen flex items-center justify-center p-3'>
        <button onClick={() => { navigate('/add/event/' + userContext?.currentuser?.id) }} className='text-md font-medium w-max rounded-full bg-slate-800 p-3 shadow-lg text-white'>Add Your Events</button>
      </div>
      <div className='bg-lime-300 mt-5 h-max w-max flex flex-col justify-evenly gap-4 items-center p-3 rounded-3xl shadow-xl'>
        <span className='h-max w-[85vw] p-3'>
          <p className='title md:text-3xl bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 text-transparent bg-clip-text text-2xl'>Your upcoming meetings.</p>
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
            <p className='title h-[20vh] md:w-[50%] md:text-5xl bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 text-transparent bg-clip-text text-3xl'>We've got a plan that's perfect for you.</p>
          </span>
          <div className='h-max w-[100%] flex md:flex-row flex-col items-center md:justify-evenly md:gap-0 gap-10 p-5'>
            <PricePlans
              plan_name="Basic Plan"
              plan_price={0}
              feat_head="Everything in our free plan"
              features={["Access to basic features", "Single event access", "Yet to work on this."]}
              color='bg-white'
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
              features={["Access to basic features", "Access to add more events", "More features are yet to be added"]}
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
      <div className='h-max bg-gradient-to-b from-slate-800 via-slate-600 to-slate-800 text-white w-max p-3 flex flex-col items-center rounded-3xl shadow-2xl mb-5'>
        <div className='h-max w-[85vw] flex md:flex-row flex-col justify-evenly items-center p-3'>
          <span className='h-max w-[85vw] w-md:[22vw] flex flex-col gap-10 items-center'>
            <p className='title w-[100%] md:text-4xl text-lime-300 text-3xl p-2'>Designed for those who conduct meetings at scale.</p>
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
          <Footer/>
        </>
  )
}

export default Home