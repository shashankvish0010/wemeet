import React from 'react'
import { Icon } from '@iconify/react'
import HeadBanner from '../assets/wemeet-group-video-chat.avif'

const Home: React.FC = () => {
  return (
    <div className='bg-slate-100 h-screen w-[100vw] flex flex-col gap-5 p-3'>
      <div className='flex md:flex-row flex-col items-center justify-evenly p-4 rounded-2xl border-slate-800'>
        <div className='h-[100%] md:w-[40%] p-4 rounded-md flex flex-col justify-evenly gap-2 items-center'>
          <h1 className='md:text-6xl text-2xl text-center md:text-start font-bold uppercase'>Simplifying your Meetings.</h1>
          <div className='h-max w-[100%] flex flex-col gap-2 p-3'>
              <li className='flex gap-2 items-center'>
              <Icon icon="mdi:star-three-points" height={'2vh'}/>
              <p className='font-semibold text-md text-gray-800'>
                Schedule and host your meetings.
              </p>
              </li>
              <li className='flex gap-2 items-center'>
              <Icon icon="mdi:star-three-points" height={'2vh'}/>
              <p className='font-semibold text-md text-gray-800'>
                Offers you immersive scheduling and group video chat experience.
              </p>
              </li>
          </div>
          <button className='text-md font-medium w-max rounded-full bg-slate-800 p-3 shadow-lg text-white'>GET STARTED</button>
        </div>
        <div className='md:w-[40%] w-[85vw] flex justify-center items-center'>
          <img className='rounded-2xl shadow-xl' src={HeadBanner} width={"400dvw"}/>
        </div>
      </div>
    </div>
  )
}

export default Home