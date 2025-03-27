import React, { useState, useEffect, createContext, useContext } from 'react';
import './App.css';

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');

    if (storedUser) setUser(JSON.parse(storedUser));
    setUsers(storedUsers);
  }, []);

  const signup = (userData, password) => {
    const existingUser = users.find(u => u.email === userData.email);
    if (existingUser) {
      throw new Error('Email already in use');
    }

    const newUser = {
      ...userData,
      id: Date.now(),
      passwordHash: btoa(password),
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    login(userData.email, password);
  };

  const login = (email, password) => {
    const user = users.find(u => u.email === email && u.passwordHash === btoa(password));
    if (!user) throw new Error('Invalid email or password');

    setUser(user);
    localStorage.setItem('user', JSON.stringify(user));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const deleteAccount = () => {
    const updatedUsers = users.filter(u => u.email !== user.email);
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    logout();
  };

  return (
    <AuthContext.Provider value={{ user, signup, login, logout, deleteAccount }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

const LoginForm = ({ onSignupClick }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    try {
      login(email, password);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="form-box">
      <h2>Login</h2>
      {error && <p className="form-error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          className="form-input"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email Address"
          required
        />
        <input
          className="form-input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button className="login-button" type="submit">Login</button>
      </form>
      <p className="form-text">
        Don't have an account?{' '}
        <button className="signup-button" onClick={onSignupClick}>
          Sign Up
        </button>
      </p>
    </div>
  );
};

const SignupForm = ({ onLoginClick }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { signup } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      signup({ name, email }, password);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="form-box">
      <h2>Sign Up</h2>
      {error && <p className="form-error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          className="form-input"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Full Name"
          required
        />
        <input
          className="form-input"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          className="form-input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <input
          className="form-input"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm Password"
          required
        />
        <button className="login-button" type="submit">Sign Up</button>
      </form>
      <p className="form-text">
        Already have an account?{' '}
        <button className="signup-button" onClick={onLoginClick}>
          Login
        </button>
      </p>
    </div>
  );
};

const Navbar = () => {
  const { user, logout, deleteAccount } = useAuth();

  return (
    <div className="navbar">
      {user && (
        <div className="navbar-user">
          <span>{user.name}</span>
          <div>
            <button className="logout-button" onClick={logout}>
              Logout
            </button>
            <button className="delete-button" onClick={deleteAccount}>
              Delete Account
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const DataTable = () => {
  const mockData = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
  ];

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const filteredData = mockData.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = () => setCurrentPage(1);

  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div className="table-container">
      <input
        type="text"
        className="search-input"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <table>
        <thead>
          <tr>
            <th>ID</th><th>Name</th><th>Email</th><th>Role</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((row) => (
            <tr key={row.id}>
              <td>{row.id}</td><td>{row.name}</td><td>{row.email}</td><td>{row.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const App = () => {
  const { user } = useAuth();
  const [showSignup, setShowSignup] = useState(false);

  return user ? (
    <>
      <Navbar />
      <DataTable />
    </>
  ) : showSignup ? (
    <SignupForm onLoginClick={() => setShowSignup(false)} />
  ) : (
    <LoginForm onSignupClick={() => setShowSignup(true)} />
  );
};

const AppWrapper = () => (
  <AuthProvider>
    <App />
  </AuthProvider>
);

export default AppWrapper;
