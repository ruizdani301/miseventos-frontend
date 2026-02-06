import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'
import AdminPage from './components/layout/AdminPage';
import EventDiscovery from './components/home/EventDiscovery';
import UserRegistrationForm from './components/register/UserRegistrationForm';
import UserLoginForm from './components/login/UserLoginForm';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<UserLoginForm />} />
            <Route path="/register" element={<UserRegistrationForm />} />

            {/* Protected Routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <EventDiscovery />
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminPage />
              </ProtectedRoute>
            } />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </div>
  )
}

export default App
