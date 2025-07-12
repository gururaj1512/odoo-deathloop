import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, setDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db, getCurrentUser } from '../firebase';

const HAND_FONT = `'Comic Neue', 'Chalkboard SE', 'Comic Sans MS', cursive`;

function getChatId(uid1, uid2) {
  return [uid1, uid2].sort().join('_');
}

export default function Chat() {
  const { friendId } = useParams();
  const [friend, setFriend] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const currentUser = getCurrentUser();
  const chatRef = useRef();

  useEffect(() => {
    async function fetchFriend() {
      if (!friendId) return;
      const friendDoc = await getDoc(doc(db, 'users', friendId));
      if (friendDoc.exists()) setFriend(friendDoc.data());
    }
    fetchFriend();
  }, [friendId]);

  useEffect(() => {
    if (!currentUser || !friendId) return;
    const chatId = getChatId(currentUser.uid, friendId);
    const chatDocRef = doc(db, 'chats', chatId);
    // Listen for real-time updates
    const unsub = onSnapshot(chatDocRef, (snap) => {
      if (snap.exists()) {
        setMessages(snap.data().messages || []);
      } else {
        setMessages([]);
      }
      setLoading(false);
      setTimeout(() => {
        if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
      }, 100);
    });
    return () => unsub();
  }, [currentUser, friendId]);

  // On first open, if no chat exists, try to fetch the request message and add as first message
  useEffect(() => {
    async function maybeSeedFirstMessage() {
      if (!currentUser || !friendId) return;
      const chatId = getChatId(currentUser.uid, friendId);
      const chatDocRef = doc(db, 'chats', chatId);
      const chatSnap = await getDoc(chatDocRef);
      if (!chatSnap.exists()) {
        // Try to get the request message from the user's requests
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        const data = userDoc.exists() ? userDoc.data() : {};
        const req = (data.requests || []).find(r => r.fromUserId === friendId);
        if (req && req.message) {
          await setDoc(chatDocRef, {
            messages: [{ sender: friendId, text: req.message, timestamp: Date.now() }],
          });
        } else {
          await setDoc(chatDocRef, { messages: [] });
        }
      }
    }
    maybeSeedFirstMessage();
  }, [currentUser, friendId]);

  const sendMessage = async () => {
    if (!input.trim() || !currentUser) return;
    const chatId = getChatId(currentUser.uid, friendId);
    const chatDocRef = doc(db, 'chats', chatId);
    const chatSnap = await getDoc(chatDocRef);
    const prev = chatSnap.exists() ? chatSnap.data().messages || [] : [];
    const newMsg = { sender: currentUser.uid, text: input, timestamp: Date.now() };
    await updateDoc(chatDocRef, { messages: [...prev, newMsg] });
    setInput('');
    setTimeout(() => {
      if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }, 100);
  };

  if (!currentUser) return <div style={{color: 'white', textAlign: 'center', marginTop: 40, fontFamily: HAND_FONT, fontSize: 28}}>Please log in.</div>;
  if (loading) return <div style={{color: 'white', textAlign: 'center', marginTop: 40, fontFamily: HAND_FONT, fontSize: 28}}>Loading...</div>;

  return (
    <div style={{background: '#111', minHeight: '100vh', padding: '0', fontFamily: HAND_FONT, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <div style={{width: '100%', maxWidth: 600, margin: '40px auto 0 auto', border: '3px solid #fff', borderRadius: 32, background: 'rgba(24,28,32,0.95)', boxShadow: '0 4px 32px rgba(255,255,255,0.08)', padding: 0, overflow: 'hidden'}}>
        {/* Header */}
        <div style={{display: 'flex', alignItems: 'center', gap: 18, background: 'transparent', borderBottom: '2px solid #fff', padding: '18px 28px'}}>
          <div style={{width: 60, height: 60, border: '2.5px solid #fff', borderRadius: '50%', overflow: 'hidden', background: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <img src={friend?.photoURL || 'https://randomuser.me/api/portraits/men/32.jpg'} alt="Profile" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
          </div>
          <div style={{fontSize: 28, fontWeight: 700, color: 'white', fontFamily: HAND_FONT}}>{friend?.username || 'Friend'}</div>
        </div>
        {/* Chat messages */}
        <div ref={chatRef} style={{height: 420, overflowY: 'auto', background: 'transparent', padding: '28px 18px', display: 'flex', flexDirection: 'column', gap: 18}}>
          {messages.map((msg, i) => (
            <div key={i} style={{
              alignSelf: msg.sender === currentUser.uid ? 'flex-end' : 'flex-start',
              background: msg.sender === currentUser.uid ? 'rgba(162,89,236,0.18)' : 'rgba(255,255,255,0.10)',
              color: 'white',
              border: '2px solid #fff',
              borderRadius: 18,
              maxWidth: '70%',
              padding: '12px 20px',
              fontSize: 20,
              fontFamily: HAND_FONT,
              boxShadow: '0 2px 8px rgba(162,89,236,0.10)',
              marginLeft: msg.sender === currentUser.uid ? 40 : 0,
              marginRight: msg.sender === currentUser.uid ? 0 : 40,
              textAlign: 'left',
            }}>
              {msg.text}
            </div>
          ))}
        </div>
        {/* Input */}
        <div style={{display: 'flex', alignItems: 'center', borderTop: '2px solid #fff', padding: '18px 18px', background: 'transparent'}}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') sendMessage(); }}
            placeholder="Type a message..."
            style={{flex: 1, fontSize: 20, borderRadius: 14, border: '2px solid #fff', background: 'transparent', color: 'white', padding: '10px 18px', fontFamily: HAND_FONT, outline: 'none', marginRight: 12}}
          />
          <button onClick={sendMessage} style={{background: 'none', border: '2.5px solid #a259ec', color: '#a259ec', fontWeight: 800, fontSize: 22, fontFamily: HAND_FONT, borderRadius: 12, padding: '8px 24px', cursor: 'pointer', transition: 'background 0.2s', outline: 'none', boxShadow: '0 2px 8px #a259ec33'}} onMouseOver={e => e.target.style.background='#a259ec22'} onMouseOut={e => e.target.style.background='none'}>Send</button>
        </div>
      </div>
    </div>
  );
} 