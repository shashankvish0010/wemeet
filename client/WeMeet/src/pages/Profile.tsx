import React, { useContext } from 'react'
import { userAuthContext } from '../contexts/UserAuth'
import { useNavigate } from 'react-router'

const Profile: React.FC = () => {
    const navigate = useNavigate()
    const userContext = useContext(userAuthContext)

    return (
        userContext?.login == true ?
            <div className='bg-slate-100 h-[100dvh] w-[100dvw] flex flex-col justify-center items-center p-3 gap-4'>
                <div className='bg-white h-max w-max p-3 rounded-xl shadow-xl flex md:flex-row gap-4 flex-col items-center justify-center'>
                    <span className='h-[100%] w-max rounded-r-full bg-slate-800 p-2'>
                        <div className='rounded-full h-max w-max border-2 border-green-400'>
                            <img width='100px' className='rounded-full' src="https://img.freepik.com/free-vector/mysterious-mafia-man-smoking-cigarette_52683-34828.jpg?size=626&ext=jpg&ga=GA1.1.1918017271.1700307860&semt=sph" alt="avatar_image" />
                        </div>
                    </span>
                    <div className='h-max w-max flex flex-col items-center justify-center'>
                        <span>
                            <h1 className='md:text-2xl text-lg font-semibold'>{userContext?.currentuser.firstname} {userContext?.currentuser.lastname}</h1>
                        </span>
                        <span>
                            <p className='text-base'>{userContext?.currentuser.email}</p>
                        </span>
                    </div>
                </div>
            </div>
            :
            <div className='bg-slate-100 h-screen w-screen flex flex-col items-center justify-center p-3 gap-3'>
                <p className='text-xl font-semibold'>Please Login</p>
                <button onClick={() => { navigate('/login') }} className='bg-slate-800 p-2 font-medium text-white rounded'>Login</button>
            </div>
    )
}

export default Profile