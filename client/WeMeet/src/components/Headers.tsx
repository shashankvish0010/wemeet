import React, { useContext } from 'react'
import { Icon } from '@iconify/react';
import { useNavigate, Link } from 'react-router-dom';
import { userAuthContext } from '../contexts/UserAuth';

const Headers: React.FC = () => {
  const navigate = useNavigate();
  const usercontext = useContext(userAuthContext)

  return (
    <div className='bg-slate-100 h-[10vh] w-[100vw] flex flex-row items-center justify-around p-3'>
      <div onClick={() => { navigate('/') }} className='cursor-pointer h-max w-max flex gap-2 items-center'>
        <Icon icon="simple-icons:gotomeeting" height={'3vh'} />
        <h1 className='logo md:text-2xl text-xl'>WeMeet</h1>
      </div>
      <div className='h-[10vh] w-max'>
        <ul className='hidden md:flex flex-row p-2 justify-evenly w-[30vw] font-medium bg-slate-800 text-white shadow-lg rounded-b-full'>
          <Link to='/'>Home</Link>
          <Link to='/'>About</Link>
          <Link to='/'>Contact</Link>
        </ul>
      </div>
      <div className='h-max w-max'>
        {usercontext?.login == true ?
          (<span className='flex flex-row items-center gap-2'>
            <Icon className='cursor-pointer' height={'6vh'} icon="prime:user" />
            <Icon className='cursor-pointer' height={'6vh'} icon="ri:logout-circle-r-line" onClick={() => { usercontext.dispatch({ type: "LOGOUT" }) }} />
          </span>)
          : (<Link to='/register'>
            <button className='bg-slate-800 rounded-sm p-1 md:text-md font-medium text-white hover:shadow-md transition duration-300 ease-in-out transform hover:-translate-y+1 hover:scale-105'>Login/SignUp</button>
          </Link>)
        }
      </div>
    </div>
  )
}

export default Headers