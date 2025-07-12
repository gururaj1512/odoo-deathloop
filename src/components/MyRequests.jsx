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

  if (loading) return <div style={{color: 'white', textAlign: 'center', marginTop: 40, fontFamily: HAND_FONT, fontSize: 28}}>Loading...</div>;

  return (
    <div style={{background: '#111', minHeight: '100vh', padding: '48px 0', fontFamily: HAND_FONT}}>
      <div style={{maxWidth: 900, margin: '0 auto'}}>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32}}>
          <h2 style={{color: 'white', fontSize: 38, fontWeight: 800, letterSpacing: 1, fontFamily: HAND_FONT, marginLeft: 8}}>My Requests</h2>
        </div>
        {pagedRequests.map((req, i) => {
          const user = usersMap[req.fromUserId] || {};
          const rating = user.ratings && user.ratings.length ? (user.ratings.reduce((a,b)=>a+(b.value||0),0)/user.ratings.length).toFixed(1) : '-';
          return (
            <div key={i} style={{
              border: '3px solid #fff',
              borderRadius: 32,
              marginBottom: 40,
              padding: 32,
              background: 'transparent',
              color: 'white',
              position: 'relative',
              boxShadow: '0 4px 32px rgba(255,255,255,0.08)',
              fontFamily: HAND_FONT,
              display: 'flex',
              alignItems: 'center',
              gap: 32,
            }}>
              <div style={{flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <div style={{width: 120, height: 120, border: '3px solid #fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', background: '#222', position: 'relative'}}>
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="Profile" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                  ) : (
                    <span style={{color: 'white', fontSize: 20, position: 'absolute', textAlign: 'center', width: '100%'}}>Profile Photo</span>
                  )}
                </div>
                <div style={{marginTop: 8, color: 'white', fontSize: 20, fontFamily: HAND_FONT}}>rating {rating}/5</div>
              </div>
              <div style={{flex: 1}}>
                <div style={{fontSize: 28, fontWeight: 700, marginBottom: 8, color: 'white', fontFamily: HAND_FONT}}>{user.username || 'name'}</div>
                <div style={{marginBottom: 8, display: 'flex', alignItems: 'center', gap: 12}}>
                  <span style={{color: '#22c55e', fontWeight: 600, fontSize: 20, fontFamily: HAND_FONT}}>Skills Offered =&gt;</span>
                  <span style={{display: 'inline-block', background: 'transparent', border: '2.5px solid #fff', borderRadius: 18, padding: '4px 18px', color: 'white', fontSize: 18, fontFamily: HAND_FONT, marginLeft: 8}}>{req.offeredSkill}</span>
                </div>
                <div style={{marginBottom: 8, display: 'flex', alignItems: 'center', gap: 12}}>
                  <span style={{color: '#38bdf8', fontWeight: 600, fontSize: 20, fontFamily: HAND_FONT}}>Skill wanted =&gt;</span>
                  <span style={{display: 'inline-block', background: 'transparent', border: '2.5px solid #fff', borderRadius: 18, padding: '4px 18px', color: 'white', fontSize: 18, fontFamily: HAND_FONT, marginLeft: 8}}>{req.wantedSkill}</span>
                </div>
              </div>
              <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 16, minWidth: 180}}>
                <div style={{fontSize: 28, fontWeight: 800, color: '#7c7c9a', fontFamily: HAND_FONT, marginBottom: 8}}>Status <span>Pending</span></div>
                <div style={{display: 'flex', gap: 18, marginTop: 8}}>
                  <button onClick={() => handleAccept(req._idx)} style={{background: 'none', border: '2.5px solid #22c55e', color: '#22c55e', fontWeight: 800, fontSize: 26, fontFamily: HAND_FONT, borderRadius: 12, padding: '4px 24px', cursor: 'pointer', transition: 'background 0.2s', outline: 'none', boxShadow: '0 2px 8px #22c55e33'}} onMouseOver={e => e.target.style.background='#22c55e22'} onMouseOut={e => e.target.style.background='none'}>Accept</button>
                  <button onClick={() => handleReject(req._idx)} style={{background: 'none', border: '2.5px solid #ef4444', color: '#ef4444', fontWeight: 800, fontSize: 26, fontFamily: HAND_FONT, borderRadius: 12, padding: '4px 24px', cursor: 'pointer', transition: 'background 0.2s', outline: 'none', boxShadow: '0 2px 8px #ef444433'}} onMouseOver={e => e.target.style.background='#ef444422'} onMouseOut={e => e.target.style.background='none'}>Reject</button>
                </div>
              </div>
            </div>
          );
        })}
        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{display: 'flex', justifyContent: 'center', gap: 16, marginTop: 32, fontFamily: HAND_FONT}}>
            <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1} style={{background: 'none', border: 'none', color: 'white', fontSize: 36, cursor: 'pointer', opacity: page === 1 ? 0.4 : 1, fontFamily: HAND_FONT}}>&lt;</button>
            {[...Array(totalPages)].map((_, i) => (
              <button key={i} onClick={() => setPage(i+1)} style={{background: 'none', border: 'none', color: page === i+1 ? '#fff' : '#aaa', fontSize: 32, fontWeight: 800, cursor: 'pointer', fontFamily: HAND_FONT, textDecoration: page === i+1 ? 'underline' : 'none'}}>{i+1}</button>
            ))}
            <button onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page === totalPages} style={{background: 'none', border: 'none', color: 'white', fontSize: 36, cursor: 'pointer', opacity: page === totalPages ? 0.4 : 1, fontFamily: HAND_FONT}}>&gt;</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyRequests; 