import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import './App.css';
import LoginForm from './pages/LoginForm';
import SignupForm from './pages/SignupForm';
import WelcomePage from './pages/WelcomePage';

function App() {
  return (
   <Router>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/signup" element={<SignupForm />} />
          <Route path="/login" element={<LoginForm />} /> 
      </Routes>
    </Router>
  );
}

export default App;
