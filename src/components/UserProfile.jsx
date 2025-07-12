/**
 * Professional User Profile UI, inspired by the provided image.
 * - Two-column grid for fields
 * - Profile image, name, email at top
 * - Edit button top right
 * - All your fields (name, email, state, city, location, skills, availability, profile status)
 */
import React, { useEffect, useState } from 'react';
import { getCurrentUser, getUserData, setUserProfile, logOut } from '../firebase';
import { useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import CircularProgress from '@mui/material/CircularProgress';
import { motion } from 'framer-motion';

const CLOUDINARY_UPLOAD_PRESET = 'sachin';
const CLOUDINARY_CLOUD_NAME = 'drxliiejo';

const STATES_AND_CITIES = {
  'Andhra Pradesh': ['Visakhapatnam', 'Vijayawada', 'Guntur'],
  'Arunachal Pradesh': ['Itanagar', 'Tawang', 'Naharlagun'],
  'Assam': ['Guwahati', 'Silchar', 'Dibrugarh'],
  'Bihar': ['Patna', 'Gaya', 'Bhagalpur'],
  'Chhattisgarh': ['Raipur', 'Bhilai', 'Bilaspur'],
  'Delhi': ['New Delhi', 'Dwarka', 'Rohini'],
  'Goa': ['Panaji', 'Margao', 'Vasco da Gama'],
  'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara'],
  'Haryana': ['Gurgaon', 'Faridabad', 'Panipat'],
  'Himachal Pradesh': ['Shimla', 'Manali', 'Dharamshala'],
  'Jharkhand': ['Ranchi', 'Jamshedpur', 'Dhanbad'],
  'Karnataka': ['Bangalore', 'Mysore', 'Mangalore'],
  'Kerala': ['Kochi', 'Thiruvananthapuram', 'Kozhikode'],
  'Madhya Pradesh': ['Indore', 'Bhopal', 'Gwalior'],
  'Maharashtra': ['Mumbai', 'Pune', 'Nagpur'],
  'Manipur': ['Imphal', 'Thoubal', 'Bishnupur'],
  'Meghalaya': ['Shillong', 'Tura', 'Jowai'],
  'Mizoram': ['Aizawl', 'Lunglei', 'Champhai'],
  'Nagaland': ['Kohima', 'Dimapur', 'Mokokchung'],
  'Odisha': ['Bhubaneswar', 'Cuttack', 'Rourkela'],
  'Punjab': ['Ludhiana', 'Amritsar', 'Jalandhar'],
  'Rajasthan': ['Jaipur', 'Jodhpur', 'Udaipur'],
  'Sikkim': ['Gangtok', 'Namchi', 'Geyzing'],
  'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai'],
  'Telangana': ['Hyderabad', 'Warangal', 'Nizamabad'],
  'Tripura': ['Agartala', 'Udaipur', 'Dharmanagar'],
  'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Varanasi'],
  'Uttarakhand': ['Dehradun', 'Haridwar', 'Nainital'],
  'West Bengal': ['Kolkata', 'Howrah', 'Durgapur'],
};

const defaultProfile = {
  username: '',
  email: '',
  photoURL: '',
  state: '',
  city: '',
  location: '',
  skillsOffered: [],
  skillsWanted: [],
  availability: '',
  profileStatus: 'public',
};

function UserProfile() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(defaultProfile);
  const [editMode, setEditMode] = useState(false);
  const [skillOfferedInput, setSkillOfferedInput] = useState('');
  const [skillWantedInput, setSkillWantedInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const u = getCurrentUser();
    if (!u) return;
    setUser(u);
    getUserData(u.uid).then(data => {
      setProfile({
        ...defaultProfile,
        ...data,
        email: u.email,
        location: data && data.state && data.city ? `${data.state}, ${data.city}` : '',
      });
      setLoading(false);
    });
  }, []);

  const handleEdit = () => setEditMode(true);
  const handleCancel = () => setEditMode(false);

  const handleChange = e => {
    let newProfile = { ...profile, [e.target.name]: e.target.value };
    if (e.target.name === 'state') {
      newProfile = { ...newProfile, state: e.target.value, city: '' };
    }
    if (e.target.name === 'state' || e.target.name === 'city') {
      newProfile.location = `${e.target.name === 'state' ? e.target.value : newProfile.state}${newProfile.city ? ', ' + newProfile.city : ''}`;
      if (e.target.name === 'city') {
        newProfile.location = `${newProfile.state}${e.target.value ? ', ' + e.target.value : ''}`;
      }
    }
    setProfile(newProfile);
  };

  const handleAddSkillOffered = () => {
    if (skillOfferedInput.trim() && !profile.skillsOffered.includes(skillOfferedInput.trim())) {
      setProfile({ ...profile, skillsOffered: [...profile.skillsOffered, skillOfferedInput.trim()] });
      setSkillOfferedInput('');
    }
  };
  const handleRemoveSkillOffered = skill => {
    setProfile({ ...profile, skillsOffered: profile.skillsOffered.filter(s => s !== skill) });
  };

  const handleAddSkillWanted = () => {
    if (skillWantedInput.trim() && !profile.skillsWanted.includes(skillWantedInput.trim())) {
      setProfile({ ...profile, skillsWanted: [...profile.skillsWanted, skillWantedInput.trim()] });
      setSkillWantedInput('');
    }
  };
  const handleRemoveSkillWanted = skill => {
    setProfile({ ...profile, skillsWanted: profile.skillsWanted.filter(s => s !== skill) });
  };

  const handleSave = async () => {
    const location = profile.state && profile.city ? `${profile.state}, ${profile.city}` : '';
    setLoading(true);
    await setUserProfile(user.uid, { ...profile, location });
    setEditMode(false);
    setLoading(false);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.secure_url) {
        setProfile(prev => ({ ...prev, photoURL: data.secure_url }));
      }
    } catch (err) {
      alert('Image upload failed.');
    }
    setUploading(false);
  };

  const handleLogout = async () => {
    localStorage.removeItem('token');
    await logOut();
    navigate('/login');
  };

  const stateOptions = Object.keys(STATES_AND_CITIES);
  const cityOptions = profile.state ? STATES_AND_CITIES[profile.state] : [];

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
      <CircularProgress color="primary" />
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-orange-50">
      <motion.div
        className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl p-0 md:p-12 flex flex-col items-center relative"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, type: 'spring' }}
      >
        {/* Top gradient overlay */}
        <div className="absolute left-0 top-0 w-full h-20 rounded-t-3xl bg-gradient-to-b from-purple-400/20 to-transparent z-10 pointer-events-none" />
        <div className="w-full flex flex-col md:flex-row items-center justify-between gap-8 px-8 pt-8">
          <div className="flex items-center gap-6">
            <Avatar
              src={profile.photoURL || 'https://randomuser.me/api/portraits/men/32.jpg'}
              alt="Profile"
              sx={{ width: 80, height: 80, border: '2px solid #e5e7eb' }}
            />
            <div>
              <div className="font-bold text-2xl text-gray-900">{profile.username || 'Your Name'}</div>
              <div className="text-gray-500 text-lg">{profile.email}</div>
            </div>
          </div>
          <div className="flex gap-3">
            {editMode ? (
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={handleSave}
                disabled={uploading}
                className="rounded-xl font-semibold shadow"
              >
                {uploading ? 'Saving...' : 'Save'}
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={handleEdit}
                className="rounded-xl font-semibold shadow"
              >
                Edit
              </Button>
            )}
            {editMode && (
              <Button
                variant="outlined"
                color="secondary"
                size="large"
                onClick={handleCancel}
                className="rounded-xl font-semibold shadow"
              >
                Cancel
              </Button>
            )}
            {/* Logout Button */}
            <Button
              variant="outlined"
              color="error"
              size="large"
              onClick={handleLogout}
              className="rounded-xl font-semibold shadow"
            >
              Logout
            </Button>
          </div>
        </div>
        <div className="w-full px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left column */}
            <div className="flex flex-col gap-6">
              <TextField
                label="Full Name"
                name="username"
                value={profile.username}
                onChange={handleChange}
                disabled={!editMode}
                fullWidth
                variant="outlined"
                size="medium"
                placeholder="Your Name"
              />
              <FormControl fullWidth>
                <InputLabel id="state-label">State</InputLabel>
                <Select
                  labelId="state-label"
                  name="state"
                  value={profile.state}
                  onChange={handleChange}
                  disabled={!editMode}
                  label="State"
                >
                  <MenuItem value="">Select State</MenuItem>
                  {stateOptions.map(state => (
                    <MenuItem key={state} value={state}>{state}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <div>
                <div className="mb-2 font-medium text-gray-700">Skills Offered</div>
                <div className="flex gap-2 mb-2">
                  <TextField
                    value={skillOfferedInput}
                    onChange={e => setSkillOfferedInput(e.target.value)}
                    disabled={!editMode}
                    placeholder="Add skill"
                    size="small"
                    className="flex-1"
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddSkillOffered}
                    disabled={!editMode || !skillOfferedInput.trim()}
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {profile.skillsOffered.map(skill => (
                    <Chip
                      key={skill}
                      label={skill}
                      color="primary"
                      onDelete={editMode ? () => handleRemoveSkillOffered(skill) : undefined}
                      className="mb-1"
                    />
                  ))}
                </div>
              </div>
              <TextField
                label="Availability"
                name="availability"
                value={profile.availability}
                onChange={handleChange}
                disabled={!editMode}
                fullWidth
                variant="outlined"
                size="medium"
                placeholder="e.g. Weekends, Evenings"
              />
            </div>
            {/* Right column */}
            <div className="flex flex-col gap-6">
              <TextField
                label="Email"
                name="email"
                value={profile.email}
                disabled
                fullWidth
                variant="outlined"
                size="medium"
              />
              <FormControl fullWidth>
                <InputLabel id="city-label">City</InputLabel>
                <Select
                  labelId="city-label"
                  name="city"
                  value={profile.city}
                  onChange={handleChange}
                  disabled={!editMode || !profile.state}
                  label="City"
                >
                  <MenuItem value="">{profile.state ? 'Select City' : 'Select State First'}</MenuItem>
                  {cityOptions.map(city => (
                    <MenuItem key={city} value={city}>{city}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <div>
                <div className="mb-2 font-medium text-gray-700">Skills Wanted</div>
                <div className="flex gap-2 mb-2">
                  <TextField
                    value={skillWantedInput}
                    onChange={e => setSkillWantedInput(e.target.value)}
                    disabled={!editMode}
                    placeholder="Add skill"
                    size="small"
                    className="flex-1"
                  />
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleAddSkillWanted}
                    disabled={!editMode || !skillWantedInput.trim()}
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {profile.skillsWanted.map(skill => (
                    <Chip
                      key={skill}
                      label={skill}
                      color="secondary"
                      onDelete={editMode ? () => handleRemoveSkillWanted(skill) : undefined}
                      className="mb-1"
                    />
                  ))}
                </div>
              </div>
              <FormControl fullWidth>
                <InputLabel id="profile-status-label">Profile Status</InputLabel>
                <Select
                  labelId="profile-status-label"
                  name="profileStatus"
                  value={profile.profileStatus}
                  onChange={handleChange}
                  disabled={!editMode}
                  label="Profile Status"
                >
                  <MenuItem value="public">Public</MenuItem>
                  <MenuItem value="private">Private</MenuItem>
                </Select>
              </FormControl>
            </div>
          </div>
          {/* Location field below grid */}
          <div className="mt-8">
            <TextField
              label="Location"
              name="location"
              value={profile.state && profile.city ? `${profile.state}, ${profile.city}` : ''}
              disabled
              fullWidth
              variant="outlined"
              size="medium"
            />
          </div>
          {/* Profile image upload below grid */}
          <div className="mt-8">
            <div className="mb-2 font-medium text-gray-700">Profile Image Upload</div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={!editMode || uploading}
              className="mb-2"
            />
            {uploading && <div className="text-gray-700 flex items-center gap-2"><CircularProgress size={20} /> Uploading...</div>}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default UserProfile; 