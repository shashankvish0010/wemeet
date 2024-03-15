import React, { useContext, useState } from 'react'
import { Icon } from '@iconify/react';
import { useNavigate, Link } from 'react-router-dom';
import { userAuthContext } from '../contexts/UserAuth';
import { motion } from 'framer-motion'
const Headers: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false)
  const navigate = useNavigate();
  const usercontext = useContext(userAuthContext)

  return (
    <>
      <div className='bg-slate-100 h-[10vh] w-[100vw] flex flex-row items-center md:justify-around justify-between p-3'>
        <div onClick={() => { navigate('/') }} className='cursor-pointer h-max w-max flex gap-2 items-center'>
          <Icon icon="simple-icons:gotomeeting" height={'3vh'} />
          <h1 className='logo md:text-2xl text-xl'>WeMeet</h1>
        </div>
        <motion.div initial={{ opacity: 0, y: -100 }} animate={{ opacity: 1, y: 0 }} transition={{ behaviour: "smooth", duration: 0.7 }}
          className='h-[10vh] w-max'>
          <ul className='hidden md:flex flex-row p-2 justify-evenly w-[30vw] font-medium bg-slate-800 text-white shadow-lg rounded-b-full'>
            <Link to='/'>Home</Link>
            <Link to='/about'>About</Link>
            <li onClick={() => window.location.href = 'https://portfolio-six-gold-87.vercel.app/'}>Contact</li>
          </ul>
        </motion.div>
        <div className='h-max w-max flex items-center gap-2'>
          {
            open == true ?
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, rotate: 90 }} transition={{ behaviour: "smooth" }}
                onClick={() => setOpen(!open)} className='md:hidden block h-max w-max'>
                <Icon icon="oui:cross" height={'2rem'} color='indigo' />
              </motion.div>
              :
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ behaviour: "smooth" }}
                onClick={() => setOpen(!open)} className='md:hidden block h-max w-max'>
                <Icon icon="quill:hamburger" height={'2rem'} color='indigo' />
              </motion.div>
          }
          {usercontext?.login == true ?
            (<span className='flex flex-row items-center'>
              <Icon className='lg:h-max md:h-max h-[4vh] cursor-pointer' height={'6vh'} icon="prime:user" onClick={() => { navigate('/profile') }} />
              <Icon className='lg:h-max md:h-max h-[4vh] cursor-pointer' height={'6vh'} icon="solar:logout-outline" onClick={() => { usercontext.dispatch({ type: "LOGOUT" }) }} />
            </span>)
            : (<Link to='/register'>
              <button className='md:block hidden bg-slate-800 rounded-sm p-2 md:text-md font-medium text-white hover:shadow-md transition duration-300 ease-in-out transform hover:-translate-y+1 hover:scale-105'>Login/SignUp</button>
            </Link>)
          }
        </div>
      </div>
      {
        open == true ?
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ behaviour: "smooth" }}
            className='absolute md:hidden block h-max w-screen bg-slate-800 items-center p-3'>
            <ul className='h-[25vh] text-white uppercase md:hidden flex flex-col justify-around text-sm'>
              <Link to='/'>Home</Link>
              <Link to='/about'>About</Link>
              <li onClick={() => window.location.href = '/https://portfolio-six-gold-87.vercel.app/'}>Contact</li>
              {
                usercontext?.login == true ?
                  <li onClick={() => { usercontext.dispatch({ type: "LOGOUT" }) }} >Logout</li> :
                  <Link to='/register'>Register</Link>
              }
            </ul>
          </motion.div>
          : null
      }
    </>
  )
}

export default Headers