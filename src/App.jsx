import React, { useState, useEffect, createContext, useContext } from 'react';
import './App.css';

// ✅ Context for Authentication
const AuthContext = createContext();

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
    if (existingUser) throw new Error('Email already in use');

    const newUser = {
      ...userData,
      id: Date.now(),
      passwordHash: btoa(password),
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    
    return newUser;
  };

  const login = (email, password) => {
    const user = users.find(
      u => u.email === email && u.passwordHash === btoa(password)
    );
    if (!user) throw new Error('Invalid email or password');

    setUser(user);
    localStorage.setItem('user', JSON.stringify(user));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const deleteAccount = () => {
    if (user) {
      const updatedUsers = users.filter(u => u.email !== user.email);
      setUsers(updatedUsers);
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      logout();
    }
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

// ✅ Navbar Component with Dropdown
const Navbar = () => {
  const { user, logout, deleteAccount } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  if (!user) return null;

  return (
    <div className="navbar">
      <div className="navbar-left">
      <div className="navbar-logo">Dashboard</div>
      </div>
      <div className="navbar-right">
        <div className="navbar-user" onClick={() => setDropdownOpen(!dropdownOpen)}>
        ☰
        </div>
        {dropdownOpen && (
          <div className="dropdown-menu">
            <button onClick={() => setMenuOpen(!menuOpen)}>Profile</button>
            {menuOpen && (
              <div className="dropdown-content">
                <strong>{user.name}</strong>
                <p>{user.email}</p>
              </div>
            )}
            <button onClick={logout}>Logout</button>
            <button onClick={deleteAccount}>Delete Account</button>
          </div>
        )}
    </div>
    </div>
  );
};

// ✅ Sidebar Component
const Sidebar = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="sidebar">
      <p>Dashboard</p>
      <p>Settings</p>
    </div>
  );
};

// ✅ DataTable Component with Sorting and Pagination
// ✅ DataTable Component with Sorting, Pagination, and CRUD Operations
const DataTable = () => {
  const [data, setData] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Manager' },
  ]);

  // State for form inputs and editing
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  // Sorting and pagination states
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;

  // Sorting function
  const sortedData = React.useMemo(() => {
    let sortableData = [...data];
    if (sortConfig.key !== null) {
      sortableData.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableData;
  }, [data, sortConfig]);

  // Filtering function
  const filteredData = sortedData.filter(item => 
    Object.values(item).some(val => 
      val.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Pagination
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );

  // Sorting handler
  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Add/Edit form input handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Add new record
  const handleAddRecord = () => {
    const newRecord = {
      ...formData,
      id: Date.now() // Generate unique ID
    };

    setData(prev => [...prev, newRecord]);
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      role: ''
    });
  };

  // Edit record
  const handleEditRecord = () => {
    setData(prev => 
      prev.map(item => 
        item.id === currentId 
          ? { ...item, ...formData } 
          : item
      )
    );

    // Reset editing state
    setIsEditing(false);
    setCurrentId(null);
    setFormData({
      name: '',
      email: '',
      role: ''
    });
  };

  // Prepare edit
  const prepareEdit = (item) => {
    setIsEditing(true);
    setCurrentId(item.id);
    setFormData({
      name: item.name,
      email: item.email,
      role: item.role
    });
  };

  // Delete record
  const handleDeleteRecord = (id) => {
    setData(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="data-table">
      {/* Add/Edit Form */}
      <div className="data-form">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleInputChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleInputChange}
        />
        <select
          name="role"
          value={formData.role}
          onChange={handleInputChange}
        >
          <option value="">Select Role</option>
          <option value="Admin">Admin</option>
          <option value="User">User</option>
          <option value="Manager">Manager</option>
        </select>
        {isEditing ? (
          <button onClick={handleEditRecord}>Update</button>
        ) : (
          <button onClick={handleAddRecord}>Add Record</button>
        )}
      </div>

      {/* Table Controls */}
      <div className="table-controls">
        <input 
          type="text" 
          placeholder="Search..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="sort-dropdown">
          <select onChange={(e) => handleSort(e.target.value)}>
            <option value="">Sort By</option>
            <option value="name">Name</option>
            <option value="email">Email</option>
            <option value="role">Role</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map(item => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.email}</td>
              <td>{item.role}</td>
              <td>
                <button onClick={() => prepareEdit(item)}>Edit</button>
                <button onClick={() => handleDeleteRecord(item.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="pagination">
        <button 
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>Page {currentPage}</span>
        <button 
          onClick={() => setCurrentPage(prev => 
            prev * itemsPerPage < filteredData.length ? prev + 1 : prev
          )}
          disabled={currentPage * itemsPerPage >= filteredData.length}
        >
          Next
        </button>
      </div>
    </div>
  );
};

// ✅ Login Form
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

// ✅ Signup Form with Confirmation
const SignupForm = ({ onLoginClick }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [signupSuccess, setSignupSuccess] = useState(false);
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
      setSignupSuccess(true);
      // Redirect to login after 2 seconds
      setTimeout(() => {
        onLoginClick();
      }, 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="form-box">
      <h2>Sign Up</h2>
      {signupSuccess && (
        <div className="signup-success">
          Signup successful! Redirecting to login...
        </div>
      )}
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

// ✅ App Component
const App = () => {
  const { user } = useAuth();
  const [isLogin, setIsLogin] = useState(true);

  return user ? (
    <div className="app">
      <Navbar />
      <div className="app-body">
        <Sidebar />
        <div className="content">
          <DataTable />
        </div>
      </div>
    </div>
  ) : (
    <div className="auth-container">
      {isLogin ? (
        <LoginForm onSignupClick={() => setIsLogin(false)} />
      ) : (
        <SignupForm onLoginClick={() => setIsLogin(true)} />
      )}
    </div>
  );
};

// Wrap the entire app with AuthProvider
const AppWrapper = () => {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
};

export default AppWrapper;