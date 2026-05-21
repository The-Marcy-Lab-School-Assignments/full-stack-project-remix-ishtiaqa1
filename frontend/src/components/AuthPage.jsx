import { useState } from 'react';

function LoginForm({ handleLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = await handleLogin(username, password);
    if (error) setErrorMessage('Invalid username or password.');
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2>Sign In</h2>
      <p className="auth-subtitle">Welcome back</p>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      {errorMessage && <p className="error">{errorMessage}</p>}
      <button type="submit" className="btn-primary">Sign In</button>
    </form>
  );
}

function RegisterForm({ handleRegister }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = await handleRegister(username, password);
    if (error) setErrorMessage('Could not register. Username may already be taken.');
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2>Create Account</h2>
      <p className="auth-subtitle">Start tracking attendance</p>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      {errorMessage && <p className="error">{errorMessage}</p>}
      <button type="submit" className="btn-primary">Create Account</button>
    </form>
  );
}

function AuthPage({ handleLogin, handleRegister }) {
  return (
    <div className="auth-page">
      <div className="auth-hero">
        <div className="auth-hero-icon">📋</div>
        <h1 className="auth-hero-title">AttendanceIQ</h1>
        <p className="auth-hero-sub">Track your classes. Own your attendance.</p>
      </div>
      <div className="auth-forms">
        <LoginForm handleLogin={handleLogin} />
        <div className="auth-divider" />
        <RegisterForm handleRegister={handleRegister} />
      </div>
    </div>
  );
}

export default AuthPage;
