import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar({ user, userRole, userData }) {
  const navigate = useNavigate();

  return (
    <nav className="dashboard-nav" style={{background: 'transparent', borderBottom: '2px solid #222', borderRadius: '24px 24px 0 0', padding: '18px 36px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
      <div className="nav-brand" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{
          background: '#ede9fe',
          color: '#222',
          borderRadius: '50%',
          width: 36,
          height: 36,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 700,
          fontSize: 18,
          border: '2px solid #a259ec',
        }}>
          SS
        </div>
        <span style={{ fontWeight: 800, fontSize: 26, marginLeft: 12, color: '#222', letterSpacing: 1 }}>Skill Swap Platform</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
        <button onClick={() => navigate('/dashboard')} style={{background: 'none', border: 'none', color: '#222', fontWeight: 700, fontSize: 20, cursor: 'pointer', borderBottom: '2.5px solid #222', padding: '0 8px', borderRadius: 0}}>Home</button>
        <button onClick={() => navigate('/my-requests')} style={{background: 'none', border: 'none', color: '#222', fontWeight: 700, fontSize: 20, cursor: 'pointer', padding: '0 8px'}}>My Requests</button>
        <button onClick={() => navigate('/friends')} style={{background: 'none', border: 'none', color: '#222', fontWeight: 700, fontSize: 20, cursor: 'pointer', padding: '0 8px'}}>All Friends</button>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }} onClick={() => navigate('/profile')}>
        <img
          src={userData?.photoURL || 'https://randomuser.me/api/portraits/men/32.jpg'}
          alt="Profile"
          style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', border: '2.5px solid #a259ec', background: '#ede9fe' }}
        />
      </div>
    </nav>
  );
}

export default Navbar; 