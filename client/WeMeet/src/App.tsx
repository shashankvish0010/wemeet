import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Headers from './components/Headers';
import Register from './pages/Register';
import Login from './pages/Login';
import OtpVerification from './pages/OTP';
import Events from './pages/Events';


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
      </Routes>
    </Router>
  )
}

export default App