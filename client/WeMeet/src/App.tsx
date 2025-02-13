import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Headers from './components/Headers';
import Register from './pages/Register';
import Login from './pages/Login';
import OtpVerification from './pages/OTP';
import Events from './pages/Events';
import Booking from './pages/Booking';
import Profile from './pages/Profile';
import PaySuccess from './pages/PaySuccess';
import PayCancel from './pages/PayCancel';
import Meeting from './pages/Meeting';
import Room from './pages/Room';
import About from './pages/About';

const App: React.FC = () => {
  return (
    <Router>
      <Headers />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/otp/verification/:id' element={<OtpVerification />} />
        <Route path='/add/event/:id' element={<Events />} />
        <Route path='/book/:duration/:id' element={<Booking />} />
        <Route path='/room' element={<Room />} />
        <Route path='/meeting/:id' element={<Meeting/>} />
        <Route path='/profile' element={<Profile/>} />
        <Route path='/success' element={<PaySuccess/>} />
        <Route path='/cancel' element={<PayCancel/>} />
        <Route path='/about' element={<About/>} />
      </Routes>
    </Router>
  )
}

export default App