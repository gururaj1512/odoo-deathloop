import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, setDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db, getCurrentUser } from '../firebase';

function getChatId(uid1, uid2) {
  return [uid1, uid2].sort().join('_');
}

function Chat() {
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

  if (!currentUser) return <div style={{color: '#333', textAlign: 'center', marginTop: 40, fontSize: 22}}>Please log in.</div>;
  if (loading) return <div style={{color: '#333', textAlign: 'center', marginTop: 40, fontSize: 22}}>Loading...</div>;

  return (
    <div style={{
      background: 'linear-gradient(120deg, #f8fafc 0%, #f3e8ff 100%)',
      minHeight: '100vh',
      padding: '0',
      fontFamily: 'Inter, Segoe UI, Arial, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        width: '100%',
        maxWidth: 520,
        margin: '48px auto 0 auto',
        borderRadius: 28,
        background: '#fff',
        boxShadow: '0 4px 32px rgba(162,89,236,0.10)',
        padding: 0,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        minHeight: 600,
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 18,
          background: 'transparent',
          borderBottom: '1.5px solid #ede9fe',
          padding: '22px 32px 18px 32px',
        }}>
          <div style={{width: 56, height: 56, border: '2.5px solid #ede9fe', borderRadius: '50%', overflow: 'hidden', background: '#f3e8ff', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <img src={friend?.photoURL || 'https://randomuser.me/api/portraits/men/32.jpg'} alt="Profile" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
          </div>
          <div style={{fontSize: 22, fontWeight: 700, color: '#222', fontFamily: 'inherit'}}>{friend?.username || 'Friend'}</div>
        </div>
        {/* Chat messages */}
        <div ref={chatRef} style={{
          height: 400,
          overflowY: 'auto',
          background: 'transparent',
          padding: '32px 18px',
          display: 'flex',
          flexDirection: 'column',
          gap: 18,
        }}>
          {messages.map((msg, i) => (
            <div key={i} style={{
              alignSelf: msg.sender === currentUser.uid ? 'flex-end' : 'flex-start',
              background: msg.sender === currentUser.uid ? 'linear-gradient(90deg, #6366f1 0%, #2563eb 100%)' : '#f3f4f6',
              color: msg.sender === currentUser.uid ? 'white' : '#222',
              border: msg.sender === currentUser.uid ? 'none' : '1.5px solid #ede9fe',
              borderRadius: 18,
              maxWidth: '70%',
              padding: '12px 20px',
              fontSize: 17,
              fontFamily: 'inherit',
              boxShadow: msg.sender === currentUser.uid ? '0 2px 8px #6366f133' : '0 2px 8px #ede9fe33',
              marginLeft: msg.sender === currentUser.uid ? 40 : 0,
              marginRight: msg.sender === currentUser.uid ? 0 : 40,
              textAlign: 'left',
              wordBreak: 'break-word',
            }}>
              {msg.text}
            </div>
          ))}
        </div>
        {/* Input */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          borderTop: '1.5px solid #ede9fe',
          padding: '18px 18px',
          background: '#f8fafc',
        }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') sendMessage(); }}
            placeholder="Type a message..."
            style={{
              flex: 1,
              fontSize: 17,
              borderRadius: 14,
              border: '1.5px solid #ede9fe',
              background: 'white',
              color: '#222',
              padding: '10px 18px',
              fontFamily: 'inherit',
              outline: 'none',
              marginRight: 12,
              boxShadow: '0 1px 4px #ede9fe33',
            }}
          />
          <button onClick={sendMessage} style={{
            background: 'linear-gradient(90deg, #2563eb 0%, #6366f1 100%)',
            color: 'white',
            border: 'none',
            borderRadius: 12,
            fontWeight: 700,
            fontSize: 17,
            padding: '10px 28px',
            cursor: 'pointer',
            transition: 'background 0.2s',
            outline: 'none',
            boxShadow: '0 2px 8px #6366f133',
          }}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default Chat; 