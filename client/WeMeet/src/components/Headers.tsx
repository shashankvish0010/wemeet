import React from 'react'
import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';

const Headers: React.FC = () => {
  return (
    <div className='bg-transparent h-[10vh] w-screen flex flex-row items-center justify-around p-3'>
      <div className='h-max w-max flex gap-2 items-center'>
        <Icon icon="simple-icons:gotomeeting" height={'3vh'}/>
        <h1 className='logo md:text-2xl text-xl'>WeMeet</h1>
      </div>
      <div className='h-max w-max'>
        <ul className='hidden md:flex flex-row p-1 justify-evenly w-[30vw] font-medium'>
          <Link to='/'>Home</Link>
          <Link to='/'>About</Link>
          <Link to='/'>Contact</Link>
          {/* {/* : (
          <li className='hover:text-indigo-600'>
            <button onClick={() => { ({ type: "LOGOUT" }) }} className='bg-indigo-600 rounded-sm p-1 text-sm text-white hover:shadow-md'>Logout</button>
          </li>
          )     }        */}
        </ul>
      </div>
      <div className='h-max w-max'>
        <Link to='/register'>
          <button className='bg-slate-800 rounded-sm p-1 md:text-md font-medium text-white hover:shadow-md transition duration-300 ease-in-out transform hover:-translate-y+1 hover:scale-105'>Login/SignUp</button>
        </Link>
      </div>
    </div>
  )
}

export default Headers