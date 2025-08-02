import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/login';
import Chat from './components/chat';
import Register from './components/register';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
