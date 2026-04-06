import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Upload from './pages/Upload';
import { Toaster } from 'sonner';

function App() {
  return (
    <Router>
      <div className="dark">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
        <Toaster theme="dark" position="top-center" />
      </div>
    </Router>
  );
}

export default App;