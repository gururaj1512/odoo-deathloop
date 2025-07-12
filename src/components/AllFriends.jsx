import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db, getCurrentUser } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import PersonIcon from '@mui/icons-material/Person';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import StarIcon from '@mui/icons-material/Star';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PsychologyIcon from '@mui/icons-material/Psychology';
import SchoolIcon from '@mui/icons-material/School';

function AllFriends() {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUser = getCurrentUser();
  const navigate = useNavigate();

  // Helper functions for calculating ratings and swaps
  const getAvgRating = (ratings) => {
    if (!ratings || !ratings.length) return null;
    const sum = ratings.reduce((a, b) => a + (b.value || 0), 0);
    return (sum / ratings.length).toFixed(1);
  };

  const getNumSwaps = (user) => {
    if (!user.requests) return 0;
    return user.requests.filter(r => r.status === 'Accepted').length;
  };

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
      setFriends(userSnaps.filter(snap => snap.exists()).map(snap => ({ ...snap.data(), uid: snap.id })));
      setLoading(false);
    }
    fetchFriends();
  }, [currentUser]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="text-slate-700 text-2xl font-semibold animate-pulse">Loading...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 py-12 px-2">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-10">
          <PersonIcon className="text-slate-600 text-4xl" />
          <h2 className="text-slate-800 text-4xl font-bold tracking-wide">All Friends</h2>
        </div>
        {friends.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 40 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="flex flex-col items-center justify-center mt-32"
          >
            <EmojiPeopleIcon className="text-slate-400 text-7xl mb-4 animate-bounce" />
            <div className="text-slate-600 text-2xl font-semibold mb-2">No friends yet.</div>
            <div className="text-slate-500 text-lg">Start connecting and grow your SkillSwap network!</div>
          </motion.div>
        ) : (
          <div className="space-y-8">
            <AnimatePresence>
              {friends.map((friend, idx) => {
                const avgRating = getAvgRating(friend.ratings);
                const swaps = getNumSwaps(friend);
                const joinDate = friend.createdAt ? new Date(friend.createdAt).toLocaleDateString() : '';
                
                return (
                  <motion.div
                    key={friend.uid}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 40 }}
                    transition={{ delay: idx * 0.08, type: 'spring', stiffness: 80 }}
                    tabIndex={0}
                    className="bg-white hover:bg-slate-50 focus:bg-slate-100 transition-colors duration-200 border border-slate-200 rounded-2xl shadow-sm hover:shadow-md p-6 cursor-pointer outline-none focus:ring-2 focus:ring-slate-300 group"
                    onClick={() => navigate(`/chat/${friend.uid}`)}
                    onKeyDown={e => { if (e.key === 'Enter') navigate(`/chat/${friend.uid}`); }}
                    aria-label={`Chat with ${friend.username || 'friend'}`}
                  >
                    {/* Header with profile info and stats */}
                    <div className="flex items-start gap-6 mb-6">
                      <div className="relative flex-shrink-0">
                        <div className="w-20 h-20 rounded-full border-3 border-slate-200 bg-slate-100 flex items-center justify-center overflow-hidden shadow-sm group-hover:scale-105 group-hover:shadow-md transition-transform duration-200">
                          <img
                            src={friend.photoURL || 'https://randomuser.me/api/portraits/men/32.jpg'}
                            alt={friend.username ? `${friend.username}'s profile` : 'Profile'}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="absolute -bottom-1 -right-1 bg-slate-700 text-white px-2 py-1 rounded-full text-xs font-medium shadow-sm flex items-center gap-1">
                          <ChatBubbleOutlineIcon className="text-white text-sm" />
                        </span>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <h3 className="text-slate-800 text-xl font-semibold">{friend.username || 'No Name'}</h3>
                            <span className="bg-slate-100 text-slate-700 text-xs px-2 py-1 rounded-full font-medium">SkillSwapper</span>
                          </div>
                          
                          {/* Stats */}
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <StarIcon className="text-yellow-400" fontSize="small" />
                              <span className="font-semibold text-slate-700 text-sm">{avgRating || '-'}</span>
                            </div>
                            <div className="flex items-center gap-1 text-slate-600 font-medium text-sm">
                              <SwapHorizIcon fontSize="small" />
                              {swaps} swaps
                            </div>
                          </div>
                        </div>
                        
                        {/* Location */}
                        {friend.city && friend.state && (
                          <div className="flex items-center gap-1 text-slate-600 text-sm mb-2">
                            <LocationOnIcon fontSize="small" />
                            {friend.city}, {friend.state}
                          </div>
                        )}
                        
                        {/* Join date */}
                        {joinDate && (
                          <div className="flex items-center gap-1 text-slate-500 text-xs">
                            <CalendarMonthIcon fontSize="small" />
                            Joined {joinDate}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Bio */}
                    {friend.bio && (
                      <div className="bg-slate-50 rounded-xl px-4 py-3 text-slate-700 text-sm mb-4 font-medium">
                        {friend.bio}
                      </div>
                    )}

                    {/* Skills and Availability Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Skills Offered */}
                      <div>
                        <div className="font-semibold text-slate-700 text-sm mb-2 flex items-center gap-1">
                          <SchoolIcon fontSize="small" className="text-blue-600" />
                          Skills Offered
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          {friend.skillsOffered && friend.skillsOffered.length > 0 ? 
                            friend.skillsOffered.slice(0, 3).map(skill => (
                              <span key={skill} className="bg-blue-100 text-blue-700 rounded-lg px-2 py-1 text-xs font-medium">
                                {skill}
                              </span>
                            )) : 
                            <span className="text-slate-400 text-xs">None</span>
                          }
                          {friend.skillsOffered && friend.skillsOffered.length > 3 && (
                            <span className="text-slate-500 text-xs">+{friend.skillsOffered.length - 3} more</span>
                          )}
                        </div>
                      </div>

                      {/* Skills Wanted */}
                      <div>
                        <div className="font-semibold text-slate-700 text-sm mb-2 flex items-center gap-1">
                          <PsychologyIcon fontSize="small" className="text-orange-600" />
                          Looking For
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          {friend.skillsWanted && friend.skillsWanted.length > 0 ? 
                            friend.skillsWanted.slice(0, 3).map(skill => (
                              <span key={skill} className="bg-orange-100 text-orange-700 rounded-lg px-2 py-1 text-xs font-medium">
                                {skill}
                              </span>
                            )) : 
                            <span className="text-slate-400 text-xs">None</span>
                          }
                          {friend.skillsWanted && friend.skillsWanted.length > 3 && (
                            <span className="text-slate-500 text-xs">+{friend.skillsWanted.length - 3} more</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Availability */}
                    {friend.availability && (
                      <div className="mt-4">
                        <div className="font-semibold text-slate-700 text-sm mb-2 flex items-center gap-1">
                          <AccessTimeIcon fontSize="small" className="text-green-600" />
                          Availability
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          {friend.availability.split(',').map((a, i) => (
                            <span key={i} className="bg-green-100 text-green-700 rounded-lg px-2 py-1 text-xs font-medium">
                              {a.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}

export default AllFriends; 