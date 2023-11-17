import React from 'react'
import { Icon } from '@iconify/react'

const Home: React.FC = () => {
  return (
    <div className='h-screen w-screen flex flex-col gap-5 p-3'>
      <div className='h-max flex md:flex-row flex-col items-center justify-evenly p-4'>
        <div className='h-[100%] md:w-[40%] p-4 rounded-md flex flex-col justify-evenly items-center'>
          <h1 className='md:text-6xl text-2xl text-center md:text-start font-bold uppercase'>Simplifying your Meetings.</h1>
          <div className='h-max w-[100%] flex flex-col gap-2 p-3'>
            <span className='flex flex-row items-center gap-2'>
              <Icon icon="mdi:star-three-points" height={'2vh'}/>
              <p className='font-semibold text-md text-gray-800'>
                Schedule and host your meetings.
              </p>
            </span>
            <span className='flex flex-row items-center gap-2'>
            <Icon icon="mdi:star-three-points" height={'2vh'}/>
              <p className='font-semibold text-md text-gray-800'>
                Offers you immersive scheduling and group video chat experience.
              </p>
            </span>
          </div>
          <button className='text-md font-medium w-max rounded-full bg-slate-800 p-3 text-white'>GET STARTED</button>
        </div>
        <div className='w-[40%]'>
          <img src='https://remoters.net/wp-content/uploads/2020/11/online-appointment-scheduling-tools.jpg' />
        </div>
      </div>
    </div>
  )
}

export default Home