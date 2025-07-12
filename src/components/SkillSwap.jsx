import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db, getCurrentUser } from '../firebase';
import { motion, AnimatePresence } from 'framer-motion';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SchoolIcon from '@mui/icons-material/School';
import PsychologyIcon from '@mui/icons-material/Psychology';
import PersonIcon from '@mui/icons-material/Person';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RateReviewIcon from '@mui/icons-material/RateReview';
import SendIcon from '@mui/icons-material/Send';

function StarRating({ value, onChange, max = 5, readOnly = false, size = 'large' }) {
  return (
    <div className="flex gap-1">
      {[...Array(max)].map((_, i) => (
        <motion.div
          key={i}
          whileHover={!readOnly ? { scale: 1.1 } : {}}
          whileTap={!readOnly ? { scale: 0.95 } : {}}
          className={`cursor-${readOnly ? 'default' : 'pointer'} transition-colors duration-200`}
          onClick={() => !readOnly && onChange(i + 1)}
        >
          {i < value ? (
            <StarIcon className="text-yellow-400" fontSize={size} />
          ) : (
            <StarBorderIcon className="text-slate-300" fontSize={size} />
          )}
        </motion.div>
      ))}
    </div>
  );
}

function SkillSwap() {
  const { userId } = useParams();
  const navigate = useNavigate();
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

  // Helper functions
  const getNumSwaps = (user) => {
    if (!user.requests) return 0;
    return user.requests.filter(r => r.status === 'Accepted').length;
  };

  const getJoinDate = (user) => {
    return user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }) : null;
  };

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
    alert('Request sent successfully!');
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="text-slate-700 text-2xl font-semibold animate-pulse">Loading...</div>
    </div>
  );

  if (!user) return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="text-slate-700 text-2xl font-semibold">User not found.</div>
    </div>
  );

  const swaps = getNumSwaps(user);
  const joinDate = getJoinDate(user);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-800 mb-6 transition-colors duration-200"
        >
          <ArrowBackIcon />
          <span className="font-medium">Back</span>
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden"
        >
          {/* Header Section */}
          <div className="bg-gradient-to-r from-slate-700 to-slate-800 text-white p-8">
            <div className="flex flex-col lg:flex-row items-center gap-8">
              {/* Profile Image */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="relative flex-shrink-0"
              >
                <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-slate-100">
                  <img
                    src={user.photoURL || 'https://randomuser.me/api/portraits/men/32.jpg'}
                    alt={user.username ? `${user.username}'s profile` : 'Profile'}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-green-500 w-6 h-6 rounded-full border-2 border-white"></div>
              </motion.div>

              {/* User Info */}
              <div className="flex-1 text-center lg:text-left">
                <h1 className="text-3xl font-bold mb-2">{user.username || 'No Name'}</h1>
                {user.city && user.state && (
                  <div className="flex items-center justify-center lg:justify-start gap-1 text-slate-300 mb-2">
                    <LocationOnIcon fontSize="small" />
                    {user.city}, {user.state}
                  </div>
                )}
                <div className="flex items-center justify-center lg:justify-start gap-4 text-sm text-slate-300">
                  {joinDate && (
                    <div className="flex items-center gap-1">
                      <CalendarMonthIcon fontSize="small" />
                      Joined {joinDate}
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <SwapHorizIcon fontSize="small" />
                    {swaps} swaps
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="flex flex-col items-center gap-4">
                <div className="text-center">
                  <div className="flex items-center gap-1 mb-1">
                    <StarIcon className="text-yellow-400" />
                    <span className="font-bold text-xl">{avgRating.toFixed(1)}</span>
                  </div>
                  <div className="text-slate-300 text-sm">
                    {ratings.length} rating{ratings.length !== 1 ? 's' : ''}
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowRequestModal(true)}
                  className="bg-white text-slate-800 px-6 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-shadow duration-200 flex items-center gap-2"
                >
                  <SwapHorizIcon />
                  Send Request
                </motion.button>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-8">
            {/* Bio */}
            {user.bio && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-50 rounded-xl p-6 mb-8"
              >
                <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                  <PersonIcon className="text-slate-600" />
                  About
                </h3>
                <p className="text-slate-700 leading-relaxed">{user.bio}</p>
              </motion.div>
            )}

            {/* Skills Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Skills Offered */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6"
              >
                <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <SchoolIcon className="text-blue-600" />
                  Skills Offered
                </h3>
                <div className="flex flex-wrap gap-2">
                  {user.skillsOffered && user.skillsOffered.length > 0 ? 
                    user.skillsOffered.map(skill => (
                      <span key={skill} className="bg-blue-200 text-blue-800 px-3 py-1 rounded-lg text-sm font-medium">
                        {skill}
                      </span>
                    )) : 
                    <span className="text-slate-500 text-sm">No skills offered</span>
                  }
                </div>
              </motion.div>

              {/* Skills Wanted */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6"
              >
                <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <PsychologyIcon className="text-orange-600" />
                  Looking For
                </h3>
                <div className="flex flex-wrap gap-2">
                  {user.skillsWanted && user.skillsWanted.length > 0 ? 
                    user.skillsWanted.map(skill => (
                      <span key={skill} className="bg-orange-200 text-orange-800 px-3 py-1 rounded-lg text-sm font-medium">
                        {skill}
                      </span>
                    )) : 
                    <span className="text-slate-500 text-sm">No skills wanted</span>
                  }
                </div>
              </motion.div>
            </div>

            {/* Availability */}
            {user.availability && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 mb-8"
              >
                <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <AccessTimeIcon className="text-green-600" />
                  Availability
                </h3>
                <div className="flex flex-wrap gap-2">
                  {user.availability.split(',').map((a, i) => (
                    <span key={i} className="bg-green-200 text-green-800 px-3 py-1 rounded-lg text-sm font-medium">
                      {a.trim()}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Rating Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-50 rounded-xl p-6"
            >
              <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <RateReviewIcon className="text-slate-600" />
                Leave a Rating
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <StarRating value={rating} onChange={setRating} />
                  <span className="text-slate-600 text-sm">Click to rate</span>
                </div>
                
                <textarea
                  value={feedback}
                  onChange={e => setFeedback(e.target.value)}
                  placeholder="Share your experience with this user (optional)"
                  className="w-full min-h-[100px] p-4 border border-slate-300 rounded-lg resize-none focus:ring-2 focus:ring-slate-400 focus:border-transparent"
                  disabled={submitting}
                />
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubmitRating}
                  disabled={submitting || !rating}
                  className="bg-slate-700 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-800 transition-colors duration-200 flex items-center gap-2"
                >
                  <SendIcon />
                  Submit Rating
                </motion.button>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Request Modal */}
        <AnimatePresence>
          {showRequestModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
              onClick={() => setShowRequestModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
                onClick={e => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-slate-800">Send Skill Swap Request</h2>
                  <button
                    onClick={() => setShowRequestModal(false)}
                    className="text-slate-400 hover:text-slate-600 transition-colors duration-200"
                  >
                    <CloseIcon />
                  </button>
                </div>

                <form onSubmit={handleRequestSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Your Skill to Offer
                    </label>
                    <select
                      value={requestOfferedSkill}
                      onChange={e => setRequestOfferedSkill(e.target.value)}
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-400 focus:border-transparent"
                      required
                    >
                      <option value="">Select a skill</option>
                      {(currentUserProfile?.skillsOffered || []).map(skill => (
                        <option key={skill} value={skill}>{skill}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Skill You Want to Learn
                    </label>
                    <select
                      value={requestWantedSkill}
                      onChange={e => setRequestWantedSkill(e.target.value)}
                      className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-400 focus:border-transparent"
                      required
                    >
                      <option value="">Select a skill</option>
                      {(user?.skillsWanted || []).map(skill => (
                        <option key={skill} value={skill}>{skill}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Message (Optional)
                    </label>
                    <textarea
                      value={requestMessage}
                      onChange={e => setRequestMessage(e.target.value)}
                      placeholder="Introduce yourself and explain your request..."
                      className="w-full p-3 border border-slate-300 rounded-lg resize-none focus:ring-2 focus:ring-slate-400 focus:border-transparent"
                      rows={4}
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={requestLoading}
                    className="w-full bg-slate-700 text-white py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-800 transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    <SendIcon />
                    {requestLoading ? 'Sending...' : 'Send Request'}
                  </motion.button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default SkillSwap; 