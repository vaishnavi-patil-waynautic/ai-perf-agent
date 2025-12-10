import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { loginStart, loginSuccess, loginFailure } from '../store/authSlice';
import { authApi } from '../services/api';
import Input from '../components/Input';
import Button from '../components/Button';

const Login: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginStart());
    try {
      const data = await authApi.login(email, password);
      dispatch(loginSuccess(data));
      navigate('/');
    } catch (err) {
      setError('Invalid email or password.');
      dispatch(loginFailure());
    }
  };

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Left Side - Image */}
      <div className="hidden lg:flex lg:w-1/2 bg-blue-600 items-center justify-center relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-700 to-blue-900 opacity-90"></div>
        <img 
          src="https://picsum.photos/1000/1000?grayscale" 
          alt="Login Visual" 
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-40" 
        />
        <div className="relative z-10 text-white p-12">
          <h1 className="text-5xl font-bold mb-6">Waynautic AI Perf Agent</h1>
          <p className="text-xl font-light text-blue-100 max-w-md">
            The next-generation AI Performance Agent. Automate, Analyze, and Accelerate your performance engineering workflows.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-xl border border-gray-100">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-blue-800">Waynautic AI Perf Agent</h2>
            <p className="text-gray-500 mt-2">Sign in to access your dashboard</p>
          </div>

          {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm text-center border border-red-200">{error}</div>}

          <form onSubmit={handleLogin}>
            <Input 
              label="Email Address" 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="john@example.com"
              required
            />
            
            <div className="mb-6">
              <Input 
                label="Password" 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="••••••••"
                required
              />
              <div className="flex justify-end -mt-3">
                <Link to="/forgot-password" className="text-xs text-blue-600 hover:text-blue-800 hover:underline">
                  Forgot Password?
                </Link>
              </div>
            </div>

            <Button type="submit" fullWidth>Sign In</Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            Don't have an account? 
            <Link to="/signup" className="ml-1 text-blue-600 font-medium hover:underline">Sign up</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;