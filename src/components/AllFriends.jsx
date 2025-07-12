import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db, getCurrentUser } from '../firebase';
import { useNavigate } from 'react-router-dom';

function AllFriends() {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUser = getCurrentUser();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchFriends() {
      if (!currentUser) return;
      setLoading(true);
      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      const data = userDoc.exists() ? userDoc.data() : {};
      const ids = Array.isArray(data.myFriends) ? data.myFriends : [];
      if (ids.length === 0) {
        setFriends([]);
        setLoading(false);
        return;
      }
      const userSnaps = await Promise.all(ids.map(id => getDoc(doc(db, 'users', id))));
      setFriends(userSnaps.filter(snap => snap.exists()).map(snap => snap.data()));
      setLoading(false);
    }
    fetchFriends();
  }, [currentUser]);

  if (loading) return <div style={{color: 'white', textAlign: 'center', marginTop: 40}}>Loading...</div>;

  return (
    <div style={{background: '#18181b', minHeight: '100vh', padding: '48px 0'}}>
      <div style={{maxWidth: 900, margin: '0 auto'}}>
        <h2 style={{color: 'white', fontSize: 32, fontWeight: 800, letterSpacing: 1, marginBottom: 32}}>All Friends</h2>
        {friends.length === 0 ? (
          <div style={{color: '#a259ec', fontSize: 22, textAlign: 'center', marginTop: 80}}>No friends yet.</div>
        ) : friends.map(friend => (
          <div key={friend.uid} style={{
            border: '2.5px solid #fff',
            borderRadius: 32,
            marginBottom: 40,
            padding: 32,
            background: 'rgba(24,28,32,0.95)',
            color: 'white',
            position: 'relative',
            boxShadow: '0 4px 32px rgba(0,0,0,0.25)',
            fontFamily: 'inherit',
            display: 'flex',
            alignItems: 'center',
            gap: 32,
            cursor: 'pointer',
            transition: 'background 0.2s',
          }}
          onClick={() => navigate(`/chat/${friend.uid}`)}
          >
            <div style={{flexShrink: 0}}>
              <div style={{width: 110, height: 110, border: '3px solid #fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', background: '#222'}}>
                <img src={friend.photoURL || 'https://randomuser.me/api/portraits/men/32.jpg'} alt="Profile" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
              </div>
            </div>
            <div style={{flex: 1}}>
              <div style={{fontSize: 26, fontWeight: 700, marginBottom: 8, color: 'white'}}>{friend.username || 'name'}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AllFriends; 