import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signIn } from '../firebase';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { motion } from 'framer-motion';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = await signIn(email, password);
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
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Login</h2>
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
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
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            className="mt-2 rounded-xl font-semibold shadow"
            fullWidth
          >
            Login
          </Button>
        </form>
        <p className="mt-6 text-gray-600 text-center">
          Don't have an account?{' '}
          <Link to="/signup" className="text-blue-600 font-semibold hover:underline">Sign Up</Link>
        </p>
        {error && <div className="mt-4 text-red-500 text-center font-medium">{error}</div>}
      </motion.div>
    </div>
  );
}

export default Login; 