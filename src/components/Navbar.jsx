import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

const navLinks = [
  { label: 'Home', to: '/dashboard', icon: <HomeOutlinedIcon fontSize="small" /> },
  { label: 'Browse', to: '/dashboard', icon: <GroupsOutlinedIcon fontSize="small" /> },
  { label: 'Requests', to: '/my-requests', icon: <ChatBubbleOutlineOutlinedIcon fontSize="small" /> },
  { label: 'Friends', to: '/friends', icon: <ChatBubbleOutlineOutlinedIcon fontSize="small" /> },
  { label: 'AI Skill Suggest', to: '/ai-skill-suggest', icon: <AutoAwesomeIcon fontSize="small" /> },
  { label: 'Roadmap', to: '/roadmap', icon: <AutoAwesomeIcon fontSize="small" /> },
  { label: 'Admin', to: '/admin', icon: <AdminPanelSettingsOutlinedIcon fontSize="small" /> },
];

function Navbar({ user, userRole, userData }) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 w-full bg-white border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-4">
        {/* Brand */}
        <div className="flex items-center gap-2 min-w-[160px]">
          <div className="bg-blue-600 rounded-lg w-9 h-9 flex items-center justify-center">
            <span className="text-white font-bold text-lg">SS</span>
          </div>
          <span className="font-bold text-xl text-gray-900 ml-1 tracking-tight">SkillSwap</span>
        </div>
        {/* Nav Links */}
        <div className="flex-1 flex items-center justify-center gap-2">
          {navLinks.map(link => {
            if (link.label === 'Admin' && userRole !== 'admin') return null;
            const isActive = location.pathname.startsWith(link.to) && link.to !== '/dashboard' ? true : location.pathname === link.to;
            return (
              <Link
                key={link.label}
                to={link.to}
                className={`flex items-center gap-1 px-4 py-2 rounded-xl font-medium transition-colors text-gray-700 hover:text-blue-600 hover:bg-blue-50 ${
                  isActive ? 'bg-blue-50 text-blue-600 font-semibold' : ''
                }`}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
        {/* Profile */}
        <div
          className="flex items-center gap-2 min-w-[160px] justify-end cursor-pointer"
          onClick={() => navigate('/profile')}
        >
          <Avatar
            src={userData?.photoURL || 'https://randomuser.me/api/portraits/men/32.jpg'}
            alt="Profile"
            sx={{ width: 32, height: 32 }}
          />
          <span className="text-gray-700 text-base font-normal ml-1">{userData?.username || user?.email}</span>
        </div>
      </div>
    </nav>
  );
}

export default Navbar; 