import React, { useEffect, useState } from 'react';
import { getCurrentUser, getUserRole, getUserData } from '../firebase';
import DashboardUsers from './DashboardUsers.jsx';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import { MenuItem, Select, InputAdornment, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const skillOptions = [
  'All Skills',
  'Python',
  'Data Science',
  'Spanish',
  'React',
  'Photography',
  'Guitar',
  'Web Development',
  'Japanese',
  'Cooking',
  'Guitar',
  'Music Theory',
  'Korean',
  'UI/UX Design',
  'Digital Marketing',
  'Yoga',
  // Add more as needed
];

function Dashboard() {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [userData, setUserData] = useState(null);
  const [search, setSearch] = useState('');
  const [skillFilter, setSkillFilter] = useState('All Skills');
const navigate = useNavigate();
  useEffect(() => {
    // Redirect to login if no token
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) {
      navigate('/login');
      return;
    }
    // Fetch user and role using token (user id)
    setUser({ uid: token });
    // You may want to fetch userRole and userData here using the token
    getUserRole(token).then(setUserRole);
    getUserData(token).then(setUserData);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-orange-50 flex flex-col items-center py-8 px-2">
      <div className="w-full max-w-7xl flex flex-col items-center">
        {/* Header */}
        <div className="w-full flex flex-col gap-2 md:gap-0 md:flex-row md:items-center md:justify-between mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-2 md:mb-0">Browse Skill Swappers</h1>
        </div>
        {/* Search and Filter Bar */}
        <div className="w-full flex flex-col md:flex-row gap-4 items-center mb-8 sticky top-0 z-20 bg-transparent">
          <TextField
            variant="outlined"
            placeholder="Search by name, skill, or location..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 bg-white rounded-xl shadow"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon className="text-blue-500" />
                </InputAdornment>
              ),
              style: { borderRadius: 16, background: 'white' },
            }}
            size="medium"
          />
          <Select
            value={skillFilter}
            onChange={e => setSkillFilter(e.target.value)}
            variant="outlined"
            className="min-w-[180px] bg-white rounded-xl shadow"
            startAdornment={<FilterListIcon className="text-blue-500 mr-2" />}
            sx={{ borderRadius: 2, background: 'white' }}
          >
            {skillOptions.map(skill => (
              <MenuItem key={skill} value={skill}>{skill}</MenuItem>
            ))}
          </Select>
        </div>
        {/* User Cards List */}
        <DashboardUsers search={search} skillFilter={skillFilter} />
      </div>
    </div>
  );
}

export default Dashboard; 