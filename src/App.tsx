import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'
import AdminPage from './components/layout/AdminPage';
import EventDiscovery from './components/home/EventDiscovery';
import UserRegistrationForm from './components/register/UserRegistrationForm';
import UserLoginForm from './components/login/UserLoginForm';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/register" element={<UserRegistrationForm />} />
          <Route path="/login" element={<UserLoginForm />} />
          <Route path="/" element={<EventDiscovery />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
