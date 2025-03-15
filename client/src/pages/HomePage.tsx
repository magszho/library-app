import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import AdminVerification from '../components/AdminVerification';
import { useAdmin } from '../contexts/AdminContext';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  const { currentUser, signIn, logout } = useAuth();
  const { isAdmin } = useAdmin();

  const handleGoogleSignIn = () => {
    // Simulating Google sign in with a mock email
    signIn('test@example.com');
  };

  if (!currentUser) {
    return (
      <div className="container">
        <h1>Welcome to Library App</h1>
        <button onClick={handleGoogleSignIn}>Sign in with Google</button>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="user-info">
        <h2>Welcome, {currentUser.email}</h2>
        <button onClick={logout}>Sign Out</button>
      </div>

      {isAdmin ? (
        <div className="admin-section">
          <p>You have admin access!</p>
          <Link to="/admin">
            <button>Go to Admin Dashboard</button>
          </Link>
        </div>
      ) : (
        <div className="admin-section">
          <h3>Request Admin Access</h3>
          <AdminVerification email={currentUser.email} />
        </div>
      )}
    </div>
  );
};

export default HomePage; 