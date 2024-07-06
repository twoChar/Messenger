import './styles/App.css';
import { Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { apiLink } from './apiLink';

function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || '');

  // Socket setup
  const socket = io(apiLink, {
    autoConnect: false,
    auth: {
      token: user.token,
      user: user._id,
    },
  });

  // Connect to socket if user is logged in
  useEffect(() => {
    if (user) {
      socket.connect();
    }
  }, [socket, user]);

  // Handle logging out
  const handleLogout = () => {
    localStorage.clear();
    setUser('');
    socket.disconnect();
  };

  return (
    <>
      <Outlet context={{ user, setUser, handleLogout, socket }} />
    </>
  );
}

export default App;