import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

function getAvgRating(ratings) {
  if (!ratings || !ratings.length) return null;
  const sum = ratings.reduce((a, b) => a + (b.value || 0), 0);
  return (sum / ratings.length).toFixed(1);
}

function getNumSwaps(user) {
  // Count accepted requests for this user (if available)
  if (!user.requests) return 0;
  return user.requests.filter(r => r.status === 'Accepted').length;
}

function DashboardUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, 'users'));
      const usersList = [];
      querySnapshot.forEach(doc => {
        const data = doc.data();
        // Show if profileStatus is 'public' (case-insensitive) or missing
        if (!data.profileStatus || String(data.profileStatus).toLowerCase() === 'public') {
          usersList.push({ id: doc.id, ...data });
        }
      });
      setUsers(usersList);
      setLoading(false);
    }
    fetchUsers();
  }, []);

  if (loading) return <div style={{color: 'white', textAlign: 'center', marginTop: 40}}>Loading...</div>;

  return (
    <div style={{background: 'linear-gradient(120deg, #f8fafc 0%, #f3e8ff 100%)', minHeight: '100vh', padding: '48px 0', fontFamily: 'Inter, Segoe UI, Arial, sans-serif'}}>
      <div style={{
        maxWidth: '100vw',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'row',
        gap: 40,
        overflowX: 'auto',
        paddingBottom: 24,
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      }}>
        {users.map(user => {
          const avgRating = getAvgRating(user.ratings);
          const swaps = getNumSwaps(user);
          const joinDate = user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '';
          return (
            <div key={user.id} style={{
              width: 370,
              background: '#fff',
              borderRadius: 28,
              boxShadow: '0 4px 32px rgba(162,89,236,0.10)',
              padding: '32px 28px 24px 28px',
              marginBottom: 24,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'stretch',
              position: 'relative',
              border: '1.5px solid #ede9fe',
            }}>
              {/* Profile header */}
              <div style={{display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12}}>
                <div style={{position: 'relative'}}>
                  <img src={user.photoURL || 'https://randomuser.me/api/portraits/men/32.jpg'} alt="Profile" style={{width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', border: '2.5px solid #fff', boxShadow: '0 2px 8px #ede9fe'}} />
                  <span style={{position: 'absolute', right: 4, bottom: 4, width: 14, height: 14, background: '#22c55e', border: '2px solid #fff', borderRadius: '50%', display: 'block'}}></span>
                </div>
                <div style={{flex: 1}}>
                  <div style={{fontWeight: 800, fontSize: 22, color: '#222'}}>{user.username || 'No Name'}</div>
                  <div style={{color: '#888', fontSize: 15, fontWeight: 500}}>{user.city && user.state ? `${user.city}, ${user.state}` : ''}</div>
                </div>
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: 4}}>
                    <span style={{color: '#facc15', fontSize: 18, fontWeight: 700}}>★</span>
                    <span style={{fontWeight: 700, color: '#222', fontSize: 16}}>{avgRating || '-'}</span>
                  </div>
                  <div style={{color: '#6366f1', fontWeight: 700, fontSize: 14}}>{swaps} swaps</div>
                </div>
              </div>
              {/* Bio/description */}
              {user.bio || user.about ? (
                <div style={{background: '#f3f4f6', borderRadius: 14, padding: '12px 16px', color: '#444', fontSize: 15, marginBottom: 18, fontWeight: 500}}>
                  {user.bio || user.about}
                </div>
              ) : null}
              {/* Skills Offered */}
              <div style={{marginBottom: 10}}>
                <div style={{fontWeight: 700, color: '#2563eb', fontSize: 15, marginBottom: 6}}>Skills Offered</div>
                <div style={{display: 'flex', gap: 8, flexWrap: 'wrap'}}>
                  {user.skillsOffered && user.skillsOffered.length > 0 ? user.skillsOffered.map(skill => (
                    <span key={skill} style={{background: '#e0e7ff', color: '#2563eb', borderRadius: 14, padding: '4px 14px', fontWeight: 700, fontSize: 14}}>{skill}</span>
                  )) : <span style={{color: '#a259ec'}}>None</span>}
                </div>
              </div>
              {/* Skills Wanted */}
              <div style={{marginBottom: 10}}>
                <div style={{fontWeight: 700, color: '#fb923c', fontSize: 15, marginBottom: 6}}>Looking For</div>
                <div style={{display: 'flex', gap: 8, flexWrap: 'wrap'}}>
                  {user.skillsWanted && user.skillsWanted.length > 0 ? user.skillsWanted.map(skill => (
                    <span key={skill} style={{background: '#fef3c7', color: '#fb923c', borderRadius: 14, padding: '4px 14px', fontWeight: 700, fontSize: 14}}>{skill}</span>
                  )) : <span style={{color: '#a259ec'}}>None</span>}
                </div>
              </div>
              {/* Availability */}
              {user.availability && (
                <div style={{marginBottom: 10}}>
                  <div style={{fontWeight: 700, color: '#22c55e', fontSize: 15, marginBottom: 6}}>Availability</div>
                  <div style={{display: 'flex', gap: 8, flexWrap: 'wrap'}}>
                    {user.availability.split(',').map((a, i) => (
                      <span key={i} style={{background: '#dcfce7', color: '#22c55e', borderRadius: 14, padding: '4px 14px', fontWeight: 700, fontSize: 14}}>{a.trim()}</span>
                    ))}
                  </div>
                </div>
              )}
              {/* Join date */}
              {joinDate && (
                <div style={{color: '#888', fontSize: 13, marginBottom: 10, marginTop: 2}}>Joined {joinDate}</div>
              )}
              {/* Request button */}
              <button
                style={{
                  marginTop: 18,
                  background: 'linear-gradient(90deg, #2563eb 0%, #6366f1 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: 16,
                  fontSize: 18,
                  fontWeight: 700,
                  padding: '12px 0',
                  cursor: 'pointer',
                  boxShadow: '0 2px 12px rgba(37,99,235,0.10)',
                  outline: 'none',
                  transition: 'background 0.2s',
                  width: '100%',
                  letterSpacing: 0.5
                }}
                onClick={() => navigate(`/skillswap/${user.id}`)}
              >
                Send Swap Request
              </button>
            </div>
          );
        })}
      </div>
      <style>{`
        div[style*='overflow-x: auto']::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}

export default DashboardUsers; 