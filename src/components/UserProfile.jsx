/**
 * Professional User Profile UI, inspired by the provided image.
 * - Two-column grid for fields
 * - Profile image, name, email at top
 * - Edit button top right
 * - All your fields (name, email, state, city, location, skills, availability, profile status)
 */
import React, { useEffect, useState } from 'react';
import { getCurrentUser, getUserData, setUserProfile } from '../firebase';

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

  const stateOptions = Object.keys(STATES_AND_CITIES);
  const cityOptions = profile.state ? STATES_AND_CITIES[profile.state] : [];

  if (loading) return <div style={{textAlign:'center',marginTop:40, color: 'black'}}>Loading...</div>;

  return (
    <div style={{
      background: 'linear-gradient(120deg, #e0e7ff 0%, #fdf6e3 100%)',
      padding: 0,
      margin: 0,
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        width: 1100,
        background: '#fff',
        borderRadius: 36,
        boxShadow: '0 8px 40px rgba(0,0,0,0.10)',
        padding: 0,
        margin: '64px 0',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
      }}>
        {/* Top purple gradient overlay */}
        <div style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: '100%',
          height: 80,
          background: 'linear-gradient(to bottom, rgba(128,90,213,0.18) 0%, rgba(255,255,255,0) 100%)',
          borderTopLeftRadius: 36,
          borderTopRightRadius: 36,
          zIndex: 1,
          pointerEvents: 'none',
        }} />
        <div style={{padding: '32px 40px 0 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 24}}>
            <img src={profile.photoURL || 'https://randomuser.me/api/portraits/men/32.jpg'} alt="Profile" style={{width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', border: '2px solid #ddd'}} />
            <div>
              <div style={{fontWeight: 700, fontSize: 22, color: '#222'}}>{profile.username || 'Your Name'}</div>
              <div style={{color: '#888', fontSize: 16}}>{profile.email}</div>
            </div>
          </div>
          <div>
            {editMode ? (
              <button className="btn-primary" style={{padding: '10px 28px', fontWeight: 600, fontSize: 16, borderRadius: 12}} onClick={handleSave} disabled={uploading}>{uploading ? 'Saving...' : 'Save'}</button>
            ) : (
              <button className="btn-primary" style={{padding: '10px 28px', fontWeight: 600, fontSize: 16, borderRadius: 12}} onClick={handleEdit}>Edit</button>
            )}
            {editMode && (
              <button className="btn-secondary" style={{marginLeft: 12, padding: '10px 20px', fontWeight: 600, fontSize: 16, borderRadius: 12}} onClick={handleCancel}>Cancel</button>
            )}
          </div>
        </div>
        <div style={{padding: '32px 40px', width: '100%'}}>
          <div style={{display: 'flex', gap: 32}}>
            {/* Left column */}
            <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: 24}}>
              <div>
                <label style={{color:'#222', fontWeight:500, marginBottom:8, display:'block'}}>Full Name</label>
                <input name="username" value={profile.username} onChange={handleChange} disabled={!editMode} style={{width:'100%',padding:14,borderRadius:18,border:'1px solid #e5e7eb',background:'#f8fafc',fontSize:16,color:'#222'}} placeholder="Your Name" />
              </div>
              <div>
                <label style={{color:'#222', fontWeight:500, marginBottom:8, display:'block'}}>State</label>
                <select name="state" value={profile.state} onChange={handleChange} disabled={!editMode} style={{width:'100%',padding:14,borderRadius:18,border:'1px solid #e5e7eb',background:'#f8fafc',fontSize:16,color:'#222'}}>
                  <option value="">Select State</option>
                  {stateOptions.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{color:'#222', fontWeight:500, marginBottom:8, display:'block'}}>Skills Offered</label>
                <div style={{display:'flex',gap:8,marginBottom:8}}>
                  <input value={skillOfferedInput} onChange={e=>setSkillOfferedInput(e.target.value)} disabled={!editMode} placeholder="Add skill" style={{flex:1,padding:14,borderRadius:18,border:'1px solid #e5e7eb',background:'#f8fafc',fontSize:16,color:'#222'}} />
                  <button type="button" className="btn-primary" onClick={handleAddSkillOffered} disabled={!editMode} style={{borderRadius: 12}}>Add</button>
                </div>
                <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
                  {profile.skillsOffered.map(skill => (
                    <span key={skill} style={{background:'#e0e7ff',padding:'6px 16px',borderRadius:18,display:'flex',alignItems:'center',gap:4,color:'#222',fontWeight:500}}>
                      {skill}
                      {editMode && <button type="button" onClick={()=>handleRemoveSkillOffered(skill)} style={{marginLeft:4,background:'none',border:'none',color:'#f87171',cursor:'pointer',fontSize:18}}>×</button>}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <label style={{color:'#222', fontWeight:500, marginBottom:8, display:'block'}}>Availability</label>
                <input name="availability" value={profile.availability} onChange={handleChange} disabled={!editMode} style={{width:'100%',padding:14,borderRadius:18,border:'1px solid #e5e7eb',background:'#f8fafc',fontSize:16,color:'#222'}} placeholder="e.g. Weekends, Evenings" />
              </div>
            </div>
            {/* Right column */}
            <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: 24}}>
              <div>
                <label style={{color:'#222', fontWeight:500, marginBottom:8, display:'block'}}>Email</label>
                <input name="email" value={profile.email} disabled readOnly style={{width:'100%',padding:14,borderRadius:18,border:'1px solid #e5e7eb',background:'#f8fafc',fontSize:16,color:'#888'}} />
              </div>
              <div>
                <label style={{color:'#222', fontWeight:500, marginBottom:8, display:'block'}}>City</label>
                <select name="city" value={profile.city} onChange={handleChange} disabled={!editMode || !profile.state} style={{width:'100%',padding:14,borderRadius:18,border:'1px solid #e5e7eb',background:'#f8fafc',fontSize:16,color:'#222'}}>
                  <option value="">{profile.state ? 'Select City' : 'Select State First'}</option>
                  {cityOptions.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{color:'#222', fontWeight:500, marginBottom:8, display:'block'}}>Skills Wanted</label>
                <div style={{display:'flex',gap:8,marginBottom:8}}>
                  <input value={skillWantedInput} onChange={e=>setSkillWantedInput(e.target.value)} disabled={!editMode} placeholder="Add skill" style={{flex:1,padding:14,borderRadius:18,border:'1px solid #e5e7eb',background:'#f8fafc',fontSize:16,color:'#222'}} />
                  <button type="button" className="btn-primary" onClick={handleAddSkillWanted} disabled={!editMode} style={{borderRadius: 12}}>Add</button>
                </div>
                <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
                  {profile.skillsWanted.map(skill => (
                    <span key={skill} style={{background:'#fee2e2',padding:'6px 16px',borderRadius:18,display:'flex',alignItems:'center',gap:4,color:'#222',fontWeight:500}}>
                      {skill}
                      {editMode && <button type="button" onClick={()=>handleRemoveSkillWanted(skill)} style={{marginLeft:4,background:'none',border:'none',color:'#f87171',cursor:'pointer',fontSize:18}}>×</button>}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <label style={{color:'#222', fontWeight:500, marginBottom:8, display:'block'}}>Profile Status</label>
                <select name="profileStatus" value={profile.profileStatus} onChange={handleChange} disabled={!editMode} style={{width:'100%',padding:14,borderRadius:18,border:'1px solid #e5e7eb',background:'#f8fafc',fontSize:16,color:'#222'}}>
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                </select>
              </div>
            </div>
          </div>
          {/* Location field below grid */}
          <div style={{marginTop:32}}>
            <label style={{color:'#222', fontWeight:500, marginBottom:8, display:'block'}}>Location</label>
            <input name="location" value={profile.state && profile.city ? `${profile.state}, ${profile.city}` : ''} readOnly style={{width:'100%',padding:14,borderRadius:18,border:'1px solid #e5e7eb',background:'#f8fafc',fontSize:16,color:'#222'}} />
          </div>
          {/* Profile image upload below grid */}
          <div style={{marginTop:32}}>
            <label style={{color:'#222', fontWeight:500, marginBottom:8, display:'block'}}>Profile Image Upload</label>
            <input type="file" accept="image/*" onChange={handleImageUpload} disabled={!editMode || uploading} style={{marginBottom:8, borderRadius: 12}} />
            {uploading && <div style={{color:'#222'}}>Uploading...</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile; 