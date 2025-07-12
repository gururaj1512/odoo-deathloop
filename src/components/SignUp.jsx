import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signUp } from '../firebase';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { motion } from 'framer-motion';

function SignUp() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!username.trim()) {
      setError('Username is required');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    const selectedRole = role || 'user';
    const result = await signUp(email, password, selectedRole, username);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-orange-50">
      <motion.div
        className="bg-white rounded-3xl shadow-2xl px-10 py-12 w-full max-w-md flex flex-col items-center"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, type: 'spring' }}
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Sign Up</h2>
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
          <TextField
            label="Username"
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            fullWidth
            variant="outlined"
            size="medium"
            inputProps={{ minLength: 3 }}
            placeholder="Enter your username"
          />
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            fullWidth
            variant="outlined"
            size="medium"
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            fullWidth
            variant="outlined"
            size="medium"
            inputProps={{ minLength: 6 }}
          />
          <TextField
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            required
            fullWidth
            variant="outlined"
            size="medium"
            inputProps={{ minLength: 6 }}
          />
          <FormControl fullWidth>
            <InputLabel id="role-label">Role</InputLabel>
            <Select
              labelId="role-label"
              id="role"
              value={role}
              label="Role"
              onChange={e => setRole(e.target.value)}
            >
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            className="mt-2 rounded-xl font-semibold shadow"
            fullWidth
          >
            Sign Up
          </Button>
        </form>
        <p className="mt-6 text-gray-600 text-center">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 font-semibold hover:underline">Login</Link>
        </p>
        {error && <div className="mt-4 text-red-500 text-center font-medium">{error}</div>}
      </motion.div>
    </div>
  );
}

export default SignUp; 