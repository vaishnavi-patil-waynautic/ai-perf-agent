import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authApi } from '../../services/api';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { forgotPassword } from './services/passwordService';
import { TextField } from '@mui/material';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError(null);
    setLoading(true);

    try {
      await forgotPassword(email);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Failed to send reset link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-xl border border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Forgot Password</h2>
          <p className="text-gray-500 mt-2">Enter your email to reset your password</p>
        </div>

        {/* {success ? (
          <div className="text-center">
            <div className="bg-green-50 text-green-700 p-4 rounded mb-6">
              Check your email for a reset link.
            </div>
            <Link to="/login" className="text-blue-600 hover:underline">Back to Login</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <TextField
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <Button type="submit" fullWidth className="mt-4">Send Reset Link</Button>

            <div className="mt-6 text-center">
              <Link to="/login" className="text-sm text-gray-600 hover:text-blue-600">
                &larr; Back to Login
              </Link>
            </div>
          </form>
        )} */}

        {success ? (
          <div className="text-center">
            <div className="bg-green-50 text-green-700 p-4 rounded mb-6">
              Check your email for a reset link.
            </div>
            <Link to="/login" className="text-blue-600 hover:underline">
              Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>

            {error && (
              <div className="bg-red-50 text-red-700 p-3 rounded mb-4 text-sm">
                {error}
              </div>
            )}

            <TextField
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
              variant="outlined"
              sx={{ mb: 2 }}
            />

            <Button
              type="submit"
              fullWidth
              className="mt-4"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </Button>

            <div className="mt-6 text-center">
              <Link
                to="/login"
                className="text-sm text-gray-600 hover:text-blue-600"
              >
                &larr; Back to Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;