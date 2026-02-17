import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signup } from './services/signupService';
import Input from '../../components/Input';
import Button from '../../components/Button';

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await signup(email, firstName, lastName, password);
    setLoading(false);
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-50 items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-xl border border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>
          <p className="text-gray-500 mt-2">Join Waynautic today</p>
        </div>

        <form onSubmit={handleSignup}>
          <Input 
            label="Email Address" 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required
          />

          <Input 
            label="First Name" 
            type="text" 
            value={firstName} 
            onChange={(e) => setFirstName(e.target.value)} 
            required
          />

          <Input 
            label="Last Name" 
            type="text" 
            value={lastName} 
            onChange={(e) => setLastName(e.target.value)} 
            required
          />
          <Input 
            label="Password" 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required
          />
          {/* <Input 
            label="Confirm Password" 
            type="password" 
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)} 
            required
          /> */}

          <Button type="submit" fullWidth disabled={loading} className="mt-4">
            {loading ? 'Creating...' : 'Sign Up'}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Already have an account? 
          <Link to="/login" className="ml-1 text-blue-600 font-medium hover:underline">Log in</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;