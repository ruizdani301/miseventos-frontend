import './App.css'
import CreatedEvent from  "./components/CreatedEvent"
import ScheduleForm from './components/ScheduleForm';
import SpeakerForm from "./components/SpeakerForm"
import SessionForm from './components/SessionForm';
import AssignmentForm from './components/AssignmentForm';
import 'bootstrap/dist/css/bootstrap.min.css';



function App() {

  return (
    <>
   <CreatedEvent/>
   <ScheduleForm/>
   <SpeakerForm/>
   <SessionForm/>
   <AssignmentForm/>
    </>
  )
}

export default App
