import { useState, useEffect } from 'react';
import { getMe, login, register, logout } from './adapters/auth-adapters';
import AuthPage from './components/AuthPage';
import TrackerPage from './components/TrackerPage';

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const checkForSession = async () => {
      const { data: user } = await getMe();
      setCurrentUser(user);
    };
    checkForSession();
  }, []);

  const handleLogin = async (username, password) => {
    const { data: user, error } = await login(username, password);
    if (error) return error;
    setCurrentUser(user);
  };

  const handleRegister = async (username, password) => {
    const { data: user, error } = await register(username, password);
    if (error) return error;
    setCurrentUser(user);
  };

  const handleLogout = async () => {
    await logout();
    setCurrentUser(null);
  };

  return (
    <>
      {currentUser
        ? <TrackerPage currentUser={currentUser} handleLogout={handleLogout} />
        : <AuthPage handleLogin={handleLogin} handleRegister={handleRegister} />
      }
    </>
  );
}

export default App;
