import React from 'react';
import { Link } from 'react-router-dom';
import FavoriteIcon from '@mui/icons-material/Favorite';

function Footer() {
  return (
    <footer className="bg-[#151a23] text-gray-200 pt-12 pb-4 px-4 mt-16">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-12 md:gap-0">
        {/* Brand & Description */}
        <div className="flex-1 min-w-[220px] mb-8 md:mb-0">
          <div className="flex items-center gap-2 mb-3">
            <div className="bg-blue-600 rounded-lg w-9 h-9 flex items-center justify-center">
              <span className="text-white font-bold text-lg">SS</span>
            </div>
            <span className="font-bold text-xl text-white ml-1 tracking-tight">SkillSwap</span>
          </div>
          <p className="text-gray-300 mb-2 leading-relaxed">
            Connect with others to exchange knowledge and learn new skills. Build your expertise while helping others grow theirs.
          </p>
          <p className="text-gray-300 flex items-center gap-1">
            Made with <FavoriteIcon className="text-red-500" fontSize="small" /> for the learning community
          </p>
        </div>
        {/* Quick Links */}
        <div className="flex-1 min-w-[180px] mb-8 md:mb-0">
          <div className="font-bold text-lg text-white mb-3">Quick Links</div>
          <ul className="space-y-2">
            <li><Link to="/browse" className="hover:underline">Browse Skills</Link></li>
            <li><Link to="/profile" className="hover:underline">Create Profile</Link></li>
            <li><Link to="/how-it-works" className="hover:underline">How It Works</Link></li>
            <li><Link to="/success-stories" className="hover:underline">Success Stories</Link></li>
          </ul>
        </div>
        {/* Support */}
        <div className="flex-1 min-w-[180px]">
          <div className="font-bold text-lg text-white mb-3">Support</div>
          <ul className="space-y-2">
            <li><Link to="/help" className="hover:underline">Help Center</Link></li>
            <li><Link to="/guidelines" className="hover:underline">Community Guidelines</Link></li>
            <li><Link to="/contact" className="hover:underline">Contact Us</Link></li>
            <li><Link to="/privacy" className="hover:underline">Privacy Policy</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-700 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between text-sm text-gray-400 max-w-7xl mx-auto">
        <div>© {new Date().getFullYear()} SkillSwap. All rights reserved.</div>
        <div className="flex gap-6 mt-2 md:mt-0">
          <Link to="/terms" className="hover:underline">Terms of Service</Link>
          <Link to="/privacy" className="hover:underline">Privacy Policy</Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer; 