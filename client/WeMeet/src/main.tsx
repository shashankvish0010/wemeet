import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { UserAuthProvider } from './contexts/UserAuth.tsx'
import { EventsContextProvider } from './contexts/EventsContext.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <EventsContextProvider>

    <UserAuthProvider>
      <App />
    </UserAuthProvider>
  </EventsContextProvider>

)
