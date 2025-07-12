import React, { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, getCurrentUser } from '../firebase';

const HAND_FONT = `'Comic Neue', 'Chalkboard SE', 'Comic Sans MS', cursive`;

function MyRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [usersMap, setUsersMap] = useState({});
  const currentUser = getCurrentUser();
  const pageSize = 5;

  useEffect(() => {
    async function fetchRequests() {
      if (!currentUser) return;
      setLoading(true);
      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      const data = userDoc.exists() ? userDoc.data() : {};
      const reqs = (data.requests || []).map((r, i) => ({...r, _idx: i}));
      setRequests(reqs.reverse());
      // Fetch all requestor profiles
      const ids = Array.from(new Set(reqs.map(r => r.fromUserId)));
      const userSnaps = await Promise.all(ids.map(id => getDoc(doc(db, 'users', id))));
      const map = {};
      userSnaps.forEach((snap, i) => { if (snap.exists()) map[ids[i]] = snap.data(); });
      setUsersMap(map);
      setLoading(false);
    }
    fetchRequests();
  }, [currentUser]);

  const handleAccept = async (idx) => {
    if (!currentUser) return;
    const userDocRef = doc(db, 'users', currentUser.uid);
    const userDoc = await getDoc(userDocRef);
    if (!userDoc.exists()) return;
    const data = userDoc.data();
    const reqs = [...(data.requests || [])];
    const acceptedUserId = reqs[idx].fromUserId;
    // Remove the request
    reqs.splice(idx, 1);
    await updateDoc(userDocRef, { requests: reqs });
    setRequests(reqs.map((r, i) => ({...r, _idx: i})).reverse());
    // Add to myFriends
    const myFriends = Array.isArray(data.myFriends) ? data.myFriends : [];
    if (!myFriends.includes(acceptedUserId)) {
      await updateDoc(userDocRef, { myFriends: [...myFriends, acceptedUserId] });
    }
  };

  const handleReject = async (idx) => {
    if (!currentUser) return;
    const userDocRef = doc(db, 'users', currentUser.uid);
    const userDoc = await getDoc(userDocRef);
    if (!userDoc.exists()) return;
    const data = userDoc.data();
    const reqs = [...(data.requests || [])];
    // Remove the request
    reqs.splice(idx, 1);
    await updateDoc(userDocRef, { requests: reqs });
    setRequests(reqs.map((r, i) => ({...r, _idx: i})).reverse());
  };

  // Pagination
  const totalPages = Math.ceil(requests.length / pageSize);
  const pagedRequests = requests.slice((page-1)*pageSize, page*pageSize);

  if (loading) return <div style={{color: '#666', textAlign: 'center', marginTop: 40, fontFamily: HAND_FONT, fontSize: 20}}>Loading...</div>;

  return (
    <div style={{background: 'linear-gradient(120deg, #f8fafc 0%, #f3e8ff 100%)', minHeight: '100vh', padding: '32px 16px', fontFamily: HAND_FONT}}>
      <div style={{maxWidth: '100vw', margin: '0 auto'}}>
        <div style={{marginBottom: 32}}>
          <h2 style={{color: '#333', fontSize: 32, fontWeight: 700, letterSpacing: 0.5, fontFamily: HAND_FONT, margin: 0}}>My Requests</h2>
        </div>
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          gap: 32,
          overflowX: 'auto',
          paddingBottom: 24,
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}>
        {pagedRequests.map((req, i) => {
          const user = usersMap[req.fromUserId] || {};
          const rating = user.ratings && user.ratings.length ? (user.ratings.reduce((a,b)=>a+(b.value||0),0)/user.ratings.length).toFixed(1) : '0.0';
          return (
            <div key={i} style={{
              background: 'white',
              borderRadius: 16,
              minWidth: 420,
              maxWidth: 420,
              marginBottom: 24,
              padding: 24,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              border: '1px solid #e0e0e0',
              fontFamily: HAND_FONT,
              position: 'relative',
              flex: '0 0 auto',
            }}>
              {/* Header with profile and status */}
              <div style={{display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20}}>
                <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
                  <div style={{width: 60, height: 60, borderRadius: '50%', overflow: 'hidden', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    {user.photoURL ? (
                      <img src={user.photoURL} alt="Profile" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                    ) : (
                      <span style={{color: '#999', fontSize: 14, textAlign: 'center'}}>No Photo</span>
                    )}
                  </div>
                  <div>
                    <div style={{fontSize: 20, fontWeight: 700, color: '#333', marginBottom: 4, fontFamily: HAND_FONT}}>{user.username || 'Unknown User'}</div>
                    <div style={{color: '#666', fontSize: 14, fontFamily: HAND_FONT}}>⭐ {rating} rating</div>
                  </div>
                </div>
                <div style={{
                  background: '#fff3cd',
                  color: '#856404',
                  padding: '6px 12px',
                  borderRadius: 16,
                  fontSize: 14,
                  fontWeight: 600,
                  fontFamily: HAND_FONT,
                  border: '1px solid #ffeaa7'
                }}>
                  Pending
                </div>
              </div>

              {/* Skills section */}
              <div style={{marginBottom: 20}}>
                <div style={{display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12}}>
                  <span style={{color: '#ff6b35', fontSize: 16, fontWeight: 600, fontFamily: HAND_FONT}}>🎯 They offer:</span>
                  <span style={{
                    background: '#ff6b35',
                    color: 'white',
                    padding: '4px 12px',
                    borderRadius: 20,
                    fontSize: 14,
                    fontWeight: 600,
                    fontFamily: HAND_FONT
                  }}>
                    {req.offeredSkill}
                  </span>
                </div>
              </div>

              {/* Message section */}
              <div style={{marginBottom: 20}}>
                <div style={{color: '#666', fontSize: 14, fontWeight: 600, marginBottom: 8, fontFamily: HAND_FONT}}>💬 Message:</div>
                <div style={{color: '#333', fontSize: 16, fontFamily: HAND_FONT, lineHeight: 1.5}}>
                  {req.message || `Hi I'd love to learn ${req.wantedSkill} from you in exchange for ${req.offeredSkill} tutoring.`}
                </div>
              </div>

              {/* Timestamp */}
              <div style={{color: '#999', fontSize: 12, marginBottom: 20, fontFamily: HAND_FONT}}>
                📅 Requested on {req.timestamp ? new Date(req.timestamp.seconds * 1000).toLocaleDateString() : 'Unknown date'}
              </div>

              {/* Action buttons */}
              <div style={{display: 'flex', gap: 12, justifyContent: 'flex-end'}}>
                <button 
                  onClick={() => handleAccept(req._idx)} 
                  style={{
                    background: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: 8,
                    padding: '12px 24px',
                    fontSize: 16,
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontFamily: HAND_FONT,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    transition: 'background 0.2s'
                  }}
                  onMouseOver={e => e.target.style.background='#218838'}
                  onMouseOut={e => e.target.style.background='#28a745'}
                >
                  ✓ Accept
                </button>
                <button 
                  onClick={() => handleReject(req._idx)} 
                  style={{
                    background: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: 8,
                    padding: '12px 24px',
                    fontSize: 16,
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontFamily: HAND_FONT,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    transition: 'background 0.2s'
                  }}
                  onMouseOver={e => e.target.style.background='#c82333'}
                  onMouseOut={e => e.target.style.background='#dc3545'}
                >
                  ✕ Reject
                </button>
              </div>
            </div>
          );
        })}
        </div>
        <style>{`
          div[style*='overflow-x: auto']::-webkit-scrollbar { display: none; }
        `}</style>
        {/* Empty state */}
        {requests.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: 48,
            color: '#666',
            fontFamily: HAND_FONT,
            fontSize: 18
          }}>
            No requests yet. When someone wants to learn from you, their requests will appear here.
          </div>
        )}
        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{display: 'flex', justifyContent: 'center', gap: 16, marginTop: 32, fontFamily: HAND_FONT}}>
            <button 
              onClick={() => setPage(p => Math.max(1, p-1))} 
              disabled={page === 1} 
              style={{
                background: 'white',
                border: '1px solid #ddd',
                color: '#333',
                fontSize: 16,
                cursor: 'pointer',
                opacity: page === 1 ? 0.4 : 1,
                fontFamily: HAND_FONT,
                padding: '8px 16px',
                borderRadius: 8
              }}
            >
              &lt; Previous
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button 
                key={i} 
                onClick={() => setPage(i+1)} 
                style={{
                  background: page === i+1 ? '#007bff' : 'white',
                  border: '1px solid #ddd',
                  color: page === i+1 ? 'white' : '#333',
                  fontSize: 16,
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: HAND_FONT,
                  padding: '8px 16px',
                  borderRadius: 8,
                  minWidth: 40
                }}
              >
                {i+1}
              </button>
            ))}
            <button 
              onClick={() => setPage(p => Math.min(totalPages, p+1))} 
              disabled={page === totalPages} 
              style={{
                background: 'white',
                border: '1px solid #ddd',
                color: '#333',
                fontSize: 16,
                cursor: 'pointer',
                opacity: page === totalPages ? 0.4 : 1,
                fontFamily: HAND_FONT,
                padding: '8px 16px',
                borderRadius: 8
              }}
            >
              Next &gt;
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyRequests;