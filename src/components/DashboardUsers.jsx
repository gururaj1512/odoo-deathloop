import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import StarIcon from '@mui/icons-material/Star';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

function getAvgRating(ratings) {
  if (!ratings || !ratings.length) return null;
  const sum = ratings.reduce((a, b) => a + (b.value || 0), 0);
  return (sum / ratings.length).toFixed(1);
}

function getNumSwaps(user) {
  if (!user.requests) return 0;
  return user.requests.filter(r => r.status === 'Accepted').length;
}

function DashboardUsers({ search = '', skillFilter = 'All Skills' }) {
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
        if (!data.profileStatus || String(data.profileStatus).toLowerCase() === 'public') {
          usersList.push({ id: doc.id, ...data });
        }
      });
      setUsers(usersList);
      setLoading(false);
    }
    fetchUsers();
  }, []);

  // Filtering logic
  const filteredUsers = users.filter(user => {
    const searchLower = search.toLowerCase();
    const matchesSearch =
      !search ||
      (user.username && user.username.toLowerCase().includes(searchLower)) ||
      (user.city && user.city.toLowerCase().includes(searchLower)) ||
      (user.state && user.state.toLowerCase().includes(searchLower)) ||
      (user.skillsOffered && user.skillsOffered.some(skill => skill.toLowerCase().includes(searchLower))) ||
      (user.skillsWanted && user.skillsWanted.some(skill => skill.toLowerCase().includes(searchLower)));
    const matchesSkill =
      skillFilter === 'All Skills' ||
      (user.skillsOffered && user.skillsOffered.includes(skillFilter)) ||
      (user.skillsWanted && user.skillsWanted.includes(skillFilter));
    return matchesSearch && matchesSkill;
  });

  if (loading) return <div className="text-center text-gray-500 mt-12 text-lg">Loading...</div>;

  return (
    <div className="w-full flex flex-wrap justify-center gap-10">
      {filteredUsers.map(user => {
        const avgRating = getAvgRating(user.ratings);
        const swaps = getNumSwaps(user);
        const joinDate = user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '';
        return (
          <div
            key={user.id}
            className="w-full max-w-sm bg-white rounded-3xl shadow-lg p-8 flex flex-col items-stretch border border-gray-100 hover:shadow-2xl transition-all mb-8"
            style={{ minWidth: 340 }}
          >
            {/* Profile header */}
            <div className="flex items-center gap-4 mb-4">
              <div className="relative">
                <img
                  src={user.photoURL || 'https://randomuser.me/api/portraits/men/32.jpg'}
                  alt="Profile"
                  className="w-16 h-16 rounded-full object-cover border-2 border-white shadow"
                />
                <span className="absolute right-0 bottom-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
              </div>
              <div className="flex-1">
                <div className="font-extrabold text-xl text-gray-900 leading-tight">{user.username || 'No Name'}</div>
                <div className="flex items-center gap-1 text-gray-500 text-sm font-medium">
                  <LocationOnIcon fontSize="small" className="-ml-1" />
                  {user.city && user.state ? `${user.city}, ${user.state}` : ''}
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <div className="flex items-center gap-1">
                  <StarIcon className="text-yellow-400" fontSize="small" />
                  <span className="font-bold text-gray-800 text-base">{avgRating || '-'}</span>
                </div>
                <div className="flex items-center gap-1 text-blue-600 font-bold text-xs">
                  <SwapHorizIcon fontSize="small" />
                  {swaps} swaps
                </div>
              </div>
            </div>
            {/* Bio/description */}
            {user.bio || user.about ? (
              <div className="bg-gray-100 rounded-xl px-5 py-4 text-gray-700 text-base mb-5 font-medium">
                {user.bio || user.about}
              </div>
            ) : null}
            {/* Skills Offered */}
            <div className="mb-3">
              <div className="font-bold text-blue-700 text-base mb-2 flex items-center gap-1">
                <FiberManualRecordIcon className="text-blue-600" fontSize="small" /> Skills Offered
              </div>
              <div className="flex gap-2 flex-wrap">
                {user.skillsOffered && user.skillsOffered.length > 0 ? user.skillsOffered.map(skill => (
                  <span key={skill} className="bg-blue-100 text-blue-600 rounded-xl px-4 py-1 font-semibold text-sm shadow-sm">{skill}</span>
                )) : <span className="text-violet-400">None</span>}
              </div>
            </div>
            {/* Skills Wanted */}
            <div className="mb-3">
              <div className="font-bold text-orange-500 text-base mb-2 flex items-center gap-1">
                <FiberManualRecordIcon className="text-orange-400" fontSize="small" /> Looking For
              </div>
              <div className="flex gap-2 flex-wrap">
                {user.skillsWanted && user.skillsWanted.length > 0 ? user.skillsWanted.map(skill => (
                  <span key={skill} className="bg-orange-100 text-orange-500 rounded-xl px-4 py-1 font-semibold text-sm shadow-sm">{skill}</span>
                )) : <span className="text-violet-400">None</span>}
              </div>
            </div>
            {/* Availability */}
            {user.availability && (
              <div className="mb-3">
                <div className="font-bold text-green-600 text-base mb-2 flex items-center gap-1">
                  <FiberManualRecordIcon className="text-green-500" fontSize="small" /> Availability
                </div>
                <div className="flex gap-2 flex-wrap">
                  {user.availability.split(',').map((a, i) => (
                    <span key={i} className="bg-green-100 text-green-600 rounded-xl px-4 py-1 font-semibold text-sm shadow-sm">{a.trim()}</span>
                  ))}
                </div>
              </div>
            )}
            {/* Join date */}
            {joinDate && (
              <div className="text-gray-400 text-xs flex items-center gap-1 mb-2 mt-1">
                <CalendarMonthIcon fontSize="small" /> Joined {joinDate}
              </div>
            )}
            {/* Request button */}
            <button
              className="mt-6 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-lg font-bold py-3 w-full shadow-md flex items-center justify-center gap-2 transition-all"
              onClick={() => navigate(`/skillswap/${user.id}`)}
              style={{ boxShadow: '0 4px 16px 0 rgba(37,99,235,0.10)' }}
            >
              <SwapHorizIcon /> Send Swap Request
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default DashboardUsers; 