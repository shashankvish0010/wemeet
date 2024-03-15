import React from 'react';
import { Icon } from '@iconify/react/dist/iconify.js';
import AboutFeature from '../components/AboutFeature';

const About: React.FC = () => {
  return (
    <div className='title h-screen w-screen p-3 flex flex-col items-center gap-5'>
      <div className='h-max w-[90vw] flex flex-col p-8 rounded-xl shadow-md border-2 gap-5 m-5 border-gray-200'>
        <AboutFeature
          heading='Welcome to WeMeet'
          body='Welcome to WeMeet, your ultimate destination for seamless online meeting scheduling and hosting, all built on cutting-edge technology tailored to enhance your virtual collaboration experience.'
        />
        <AboutFeature
          heading='About'
          body="WeMeet is a complete solution for online meetings need it is designed to revolutionize the way you schedule and conduct online meetings. Whether you're organizing team sync-ups, client presentations, or virtual conferences, WeMeet ensures a secure, reliable, and user-friendly platform for all your meeting needs."
        />
        <div className='h-max w-max flex flex-col gap-1'>
          <h2 className='text-indigo-600 text-xl font-bold'>Features</h2>
          <p className='content flex gap-1 text-base font-normal'><h3 className='text-base title font-semibold'>Seamless Meeting Scheduling:</h3> Effortlessly schedule online meetings and manage your calendar with intuitive scheduling features.</p>
          <p className='content flex gap-1 text-base font-normal'><h3 className='text-base title font-semibold'>Integrated Video Conferencing:</h3> Host meetings directly within the application with integrated video conferencing capabilities, ensuring a smooth communication experience.</p>
          <p className='content flex gap-1 text-base font-normal'><h3 className='text-base title font-semibold'>Secure Authentication:</h3> Your account is safeguarded with robust authentication mechanisms, prioritizing your privacy and security.</p>
          <p className='content flex gap-1 text-base font-normal'><h3 className='text-base title font-semibold'>One-Time Password Verification:</h3> Verify your account quickly and conveniently using one-time passwords (OTP) for added security.</p>
          <p className='content flex gap-1 text-base font-normal'><h3 className='text-base title font-semibold'>Custom Meeting URLs:</h3> Each meeting generates a unique URL for easy access and sharing with participants, simplifying meeting management.</p>
          <p className='content flex gap-1 text-base font-normal'><h3 className='text-base title font-semibold'>Notification:</h3> Each time you schedule a meeting you will be get reminder updates.</p>
        </div>
        <AboutFeature
          heading="Future Enhancements & Room of Improvements"
          body="I'm committed to evolving WeMeet. In the near future, I planned to introduce additional features such as:

- Screen Sharing: Share your screen during meetings for enhanced collaboration.
- Interactive Whiteboard: Collaborate visually with an interactive whiteboard feature.
- More than just peer-to-peer, I mean more than two can join the meeting. It can be done through SFU like mediasoup and I'm working on it."
        />
        <div className='h-max w-[100%] flex flex-col gap-1'>
          <h2 className='text-xl font-bold'>Technology Stack</h2>
          <p>WeMeet leverages the following modern technology stack to deliver a seamless meeting experience:</p>
          <span className='h-max w-[100%] flex flex-col p-2 gap-1'><span className='flex items-center gap-2'><Icon icon="devicon:postgresql-wordmark" height='2rem'/><h3 className='text-base font-semibold'>PostgreSQL:</h3></span> <p className='content flex gap-1 text-base font-normal'> Backend database management for efficient data storage and retrieval.</p></span> 
          <span className='h-max w-[100%] flex flex-col p-2 gap-1'><span className='flex items-center gap-2'><Icon icon="skill-icons:expressjs-dark" height='2rem'/><h3 className='text-base font-semibold'>Express.js:</h3></span> <p className='content flex gap-1 text-base font-normal'> Robust backend framework ensuring account security and seamless integration with frontend components.</p></span> 
          <span className='h-max w-[100%] flex flex-col p-2 gap-1'><span className='flex items-center gap-2'><Icon icon="skill-icons:react-dark" height='2rem'/><h3 className='text-base font-semibold'>React:</h3></span> <p className='content flex gap-1 text-base font-normal'> Frontend framework for intuitive user interfaces and interactive meeting management.</p></span> 
          <span className='h-max w-[100%] flex flex-col p-2 gap-1'><span className='flex items-center gap-2'><Icon icon="logos:nodejs" height='2rem'/><h3 className='text-base font-semibold'>Node.js:</h3></span> <p className='content flex gap-1 text-base font-normal'> Server-side JavaScript runtime environment for efficient meeting scheduling and hosting.</p></span> 
          <span className='h-max w-[100%] flex flex-col p-2 gap-1'><span className='flex items-center gap-2'><Icon icon="devicon:socketio" height='2rem'/><h3 className='text-base font-semibold'>Socket.io:</h3></span> <p className='content flex gap-1 text-base font-normal'> Facilitating real-time, bidirectional communication between clients and servers, ensuring smooth meeting interactions.</p></span> 
          <span className='h-max w-[100%] flex flex-col p-2 gap-1'><span className='flex items-center gap-2'><Icon icon="logos:webrtc" height='2rem'/><h3 className='text-base font-semibold'>WebRTC:</h3></span> <p className='content flex gap-1 text-base font-normal'> Enabling seamless peer-to-peer audio and video communication for interactive online meetings.</p></span> 
          <span className='h-max w-[100%] flex flex-col p-2 gap-1'><span className='flex items-center gap-2'><Icon icon="devicon:redis" height='2rem'/><h3 className='text-base font-semibold'>Redis:</h3></span> <p className='content flex gap-1 text-base font-normal'> Utilized for caching and session management, Redis enhances WeMeet's scalability and performance, ensuring swift data retrieval and efficient session handling.</p></span> 
        </div>
        <AboutFeature
          heading="Development Journey"
          body="My journey of building WeMeet has been both challenging and rewarding. I welcome feedback and contributions from the community to help ME continually improve WeMeet and can learn to enhance my skills. Join me on this journey to redefine virtual collaboration."
        />
      </div>
    </div>
  );
};

export default About;