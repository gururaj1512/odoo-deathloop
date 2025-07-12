import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase';
import { getCurrentUser } from '../firebase';

function StarRating({ value, onChange, max = 5, readOnly = false }) {
  return (
    <div style={{display: 'flex', gap: 4, fontSize: 32, cursor: readOnly ? 'default' : 'pointer'}}>
      {[...Array(max)].map((_, i) => (
        <span
          key={i}
          style={{color: i < value ? '#a259ec' : '#e0e0e0', transition: 'color 0.2s'}}
          onClick={() => !readOnly && onChange(i + 1)}
        >
          ★
        </span>
      ))}
    </div>
  );
}

function SkillSwap() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [avgRating, setAvgRating] = useState(0);
  const [ratings, setRatings] = useState([]);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestOfferedSkill, setRequestOfferedSkill] = useState('');
  const [requestWantedSkill, setRequestWantedSkill] = useState('');
  const [requestMessage, setRequestMessage] = useState('');
  const [requestLoading, setRequestLoading] = useState(false);
  const [currentUserProfile, setCurrentUserProfile] = useState(null);
  const currentUser = getCurrentUser();

  useEffect(() => {
    async function fetchUser() {
      setLoading(true);
      const docRef = doc(db, 'users', userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setUser(data);
        setRatings(data.ratings || []);
        if (data.ratings && data.ratings.length > 0) {
          const avg = data.ratings.reduce((sum, r) => sum + (r.value || 0), 0) / data.ratings.length;
          setAvgRating(avg);
        } else {
          setAvgRating(0);
        }
      }
      setLoading(false);
    }
    fetchUser();
  }, [userId]);

  // Fetch logged-in user's profile for skillsOffered
  useEffect(() => {
    async function fetchCurrentUserProfile() {
      if (!currentUser) return;
      const docRef = doc(db, 'users', currentUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setCurrentUserProfile(docSnap.data());
      }
    }
    fetchCurrentUserProfile();
  }, [currentUser]);

  const handleSubmitRating = async () => {
    if (!rating) return;
    setSubmitting(true);
    const docRef = doc(db, 'users', userId);
    const newRating = {
      userId: currentUser ? currentUser.uid : 'anon',
      value: rating,
      feedback,
      date: new Date().toISOString(),
    };
    await updateDoc(docRef, {
      ratings: arrayUnion(newRating),
    });
    setRatings(prev => [...prev, newRating]);
    setAvgRating((prev * ratings.length + rating) / (ratings.length + 1));
    setRating(0);
    setFeedback('');
    setSubmitting(false);
  };

  // Handle skill swap request submit
  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    if (!requestOfferedSkill || !requestWantedSkill) return;
    setRequestLoading(true);
    const docRef = doc(db, 'users', userId);
    const requestObj = {
      fromUserId: currentUser?.uid,
      fromUserName: currentUserProfile?.username || currentUser?.email,
      offeredSkill: requestOfferedSkill,
      wantedSkill: requestWantedSkill,
      message: requestMessage,
      date: new Date().toISOString(),
      status: 'pending',
    };
    await updateDoc(docRef, {
      requests: arrayUnion(requestObj),
    });
    setRequestLoading(false);
    setShowRequestModal(false);
    setRequestOfferedSkill('');
    setRequestWantedSkill('');
    setRequestMessage('');
    alert('Request sent!');
  };

  if (loading) return <div style={{color: '#a259ec', textAlign: 'center', marginTop: 40, fontSize: 24}}>Loading...</div>;
  if (!user) return <div style={{color: '#a259ec', textAlign: 'center', marginTop: 40, fontSize: 24}}>User not found.</div>;

  return (
    <div style={{
      background: 'linear-gradient(120deg, #e0e7ff 0%, #a259ec 100%)',
      minHeight: '100vh',
      padding: '48px 0',
      fontFamily: 'Inter, Segoe UI, Arial, sans-serif',
      color: '#222',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        maxWidth: 1000,
        width: '100%',
        margin: '0 auto',
        borderRadius: 36,
        background: 'linear-gradient(120deg, #fff 60%, #ede9fe 100%)',
        boxShadow: '0 8px 40px rgba(162,89,236,0.10)',
        padding: 56,
        position: 'relative',
        display: 'flex',
        gap: 56,
        alignItems: 'center',
      }}>
        <div style={{flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%'}}>
          <div style={{width: 240, height: 240, border: '4px solid #a259ec', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', background: '#ede9fe', boxShadow: '0 4px 24px rgba(162,89,236,0.10)'}}>
            <img src={user.photoURL || 'https://randomuser.me/api/portraits/men/32.jpg'} alt="Profile" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
          </div>
        </div>
        <div style={{flex: 1, minWidth: 0}}>
          <div style={{fontSize: 40, fontWeight: 800, marginBottom: 28, color: '#a259ec', textAlign: 'center', letterSpacing: 1}}>{user.username || 'No Name'}</div>
          <div style={{marginBottom: 32, textAlign: 'center'}}>
            <div style={{fontSize: 22, marginBottom: 10, color: '#6d28d9', fontWeight: 600}}>Skills Offered</div>
            <div style={{display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center'}}>
              {user.skillsOffered && user.skillsOffered.length > 0 ? user.skillsOffered.map(skill => (
                <span key={skill} style={{display: 'inline-block', background: 'linear-gradient(90deg, #ede9fe 0%, #fff 100%)', border: '2px solid #a259ec', borderRadius: 20, padding: '6px 20px', color: '#6d28d9', fontSize: 18, fontWeight: 700, boxShadow: '0 2px 8px rgba(162,89,236,0.08)'}}>{skill}</span>
              )) : <span style={{color: '#a259ec'}}>None</span>}
            </div>
          </div>
          <div style={{marginBottom: 32, textAlign: 'center'}}>
            <div style={{fontSize: 22, marginBottom: 10, color: '#6d28d9', fontWeight: 600}}>Skills Wanted</div>
            <div style={{display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center'}}>
              {user.skillsWanted && user.skillsWanted.length > 0 ? user.skillsWanted.map(skill => (
                <span key={skill} style={{display: 'inline-block', background: 'linear-gradient(90deg, #f3e8ff 0%, #fff 100%)', border: '2px solid #a259ec', borderRadius: 20, padding: '6px 20px', color: '#a259ec', fontSize: 18, fontWeight: 700, boxShadow: '0 2px 8px rgba(162,89,236,0.08)'}}>{skill}</span>
              )) : <span style={{color: '#a259ec'}}>None</span>}
            </div>
          </div>
          <div style={{marginTop: 40, fontSize: 24, color: '#6d28d9', textAlign: 'center', fontWeight: 700}}>Rating and Feedback</div>
          <div style={{margin: '18px 0', textAlign: 'center'}}>
            <StarRating value={avgRating} max={5} readOnly />
            <div style={{fontSize: 19, color: '#a259ec', fontWeight: 600}}>{ratings.length > 0 ? `${avgRating.toFixed(2)} / 5 (${ratings.length} ratings)` : 'No ratings yet'}</div>
          </div>
          <div style={{marginTop: 18, textAlign: 'center'}}>
            <div style={{fontSize: 19, marginBottom: 10, color: '#6d28d9', fontWeight: 600}}>Leave a Rating:</div>
            <StarRating value={rating} onChange={setRating} max={5} />
            <textarea
              value={feedback}
              onChange={e => setFeedback(e.target.value)}
              placeholder="Leave feedback (optional)"
              style={{width: '100%', minHeight: 70, borderRadius: 16, border: '2px solid #a259ec', background: '#f3e8ff', color: '#6d28d9', fontSize: 17, marginTop: 10, padding: 10, fontFamily: 'inherit', fontWeight: 500}}
              disabled={submitting}
            />
            <button
              style={{marginTop: 14, background: 'linear-gradient(90deg, #a259ec 0%, #6d28d9 100%)', color: 'white', border: 'none', borderRadius: 20, fontSize: 19, fontWeight: 700, padding: '10px 32px', cursor: 'pointer', boxShadow: '0 2px 12px rgba(162,89,236,0.18)', outline: 'none', transition: 'background 0.2s'}}
              onClick={handleSubmitRating}
              disabled={submitting || !rating}
            >
              Submit Rating
            </button>
          </div>
        </div>
        <div style={{position: 'absolute', left: 56, top: 56}}>
          <button
            style={{
              background: 'linear-gradient(90deg, #a259ec 0%, #6d28d9 100%)',
              color: 'white',
              border: 'none',
              borderRadius: 20,
              fontSize: 22,
              fontWeight: 700,
              padding: '12px 36px',
              cursor: 'pointer',
              boxShadow: '0 2px 12px rgba(162,89,236,0.18)',
              outline: 'none',
              transition: 'background 0.2s',
              letterSpacing: 1
            }}
            onClick={() => setShowRequestModal(true)}
          >
            Request
          </button>
        </div>
        {/* Modal Popup for Skill Swap Request */}
        {showRequestModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.5)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
            onClick={() => setShowRequestModal(false)}
          >
            <div
              style={{
                background: 'linear-gradient(120deg, #18181b 60%, #a259ec 100%)',
                color: 'white',
                border: '3px solid #a259ec',
                borderRadius: 28,
                padding: '40px 36px 36px 36px',
                minWidth: 420,
                maxWidth: '90vw',
                boxShadow: '0 8px 40px rgba(0,0,0,0.18)',
                position: 'relative',
                fontFamily: 'Inter, Segoe UI, Arial, sans-serif',
              }}
              onClick={e => e.stopPropagation()}
            >
              <button
                style={{position: 'absolute', top: 12, right: 18, background: 'none', border: 'none', color: 'white', fontSize: 32, cursor: 'pointer'}}
                onClick={() => setShowRequestModal(false)}
                aria-label="Close"
              >×</button>
              <form onSubmit={handleRequestSubmit}>
                <div style={{marginBottom: 28}}>
                  <label style={{fontSize: 22, marginBottom: 10, display: 'block', fontWeight: 600}}>Choose one of your offered skills</label>
                  <select
                    value={requestOfferedSkill}
                    onChange={e => setRequestOfferedSkill(e.target.value)}
                    style={{width: '100%', fontSize: 20, borderRadius: 14, padding: '12px 18px', border: '2px solid #a259ec', background: 'rgba(255,255,255,0.08)', color: 'white', marginTop: 8, fontWeight: 600}}
                    required
                  >
                    <option value="" disabled>Select a skill</option>
                    {(currentUserProfile?.skillsOffered || []).map(skill => (
                      <option key={skill} value={skill}>{skill}</option>
                    ))}
                  </select>
                </div>
                <div style={{marginBottom: 28}}>
                  <label style={{fontSize: 22, marginBottom: 10, display: 'block', fontWeight: 600}}>Choose one of their wanted skills</label>
                  <select
                    value={requestWantedSkill}
                    onChange={e => setRequestWantedSkill(e.target.value)}
                    style={{width: '100%', fontSize: 20, borderRadius: 14, padding: '12px 18px', border: '2px solid #a259ec', background: 'rgba(255,255,255,0.08)', color: 'white', marginTop: 8, fontWeight: 600}}
                    required
                  >
                    <option value="" disabled>Select a skill</option>
                    {(user?.skillsWanted || []).map(skill => (
                      <option key={skill} value={skill}>{skill}</option>
                    ))}
                  </select>
                </div>
                <div style={{marginBottom: 28}}>
                  <label style={{fontSize: 20, marginBottom: 10, display: 'block', fontWeight: 600}}>Message</label>
                  <textarea
                    value={requestMessage}
                    onChange={e => setRequestMessage(e.target.value)}
                    style={{width: '100%', minHeight: 100, borderRadius: 16, border: '2px solid #a259ec', background: 'rgba(255,255,255,0.08)', color: 'white', fontSize: 18, padding: 14, fontFamily: 'inherit', fontWeight: 500}}
                    placeholder="Type your message..."
                  />
                </div>
                <div style={{textAlign: 'center'}}>
                  <button
                    type="submit"
                    disabled={requestLoading}
                    style={{background: 'linear-gradient(90deg, #a259ec 0%, #6d28d9 100%)', color: 'white', border: 'none', borderRadius: 18, fontSize: 22, fontWeight: 700, padding: '10px 44px', cursor: 'pointer', marginTop: 8, boxShadow: '0 2px 12px rgba(162,89,236,0.18)'}}
                  >
                    {requestLoading ? 'Submitting...' : 'Submit'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SkillSwap; 