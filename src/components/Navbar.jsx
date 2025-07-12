import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar({ user, userRole, userData }) {
  const navigate = useNavigate();

  return (
    <nav className="dashboard-nav">
      <div className="nav-brand" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{
          background: '#2563eb',
          color: 'white',
          borderRadius: '50%',
          width: 36,
          height: 36,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 700,
          fontSize: 18
        }}>
          SS
        </div>
        <span style={{ fontWeight: 700, fontSize: 20, marginLeft: 8 }}>SkillSwap</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
        <Link to="/dashboard" className="nav-link"><span role="img" aria-label="home">🏠</span> Home</Link>
        <Link to="#" className="nav-link"><span role="img" aria-label="browse">👤</span> Browse</Link>
        <Link to="#" className="nav-link"><span role="img" aria-label="requests">💬</span> Requests</Link>
        {userRole === 'admin' && <Link to="#" className="nav-link"><span role="img" aria-label="admin">🛡️</span> Admin</Link>}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }} onClick={() => navigate('/profile')}>
        <img
          src={userData?.photoURL || 'https://randomuser.me/api/portraits/men/32.jpg'}
          alt="Profile"
          style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', border: '2px solid #ddd' }}
        />
        <span style={{ fontWeight: 600 }}>{userData?.username || user?.email}</span>
      </div>
    </nav>
  );
}

export default Navbar; 