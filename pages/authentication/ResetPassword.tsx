import React, { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { resetPassword } from './services/passwordService';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get('token') || '';

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');


  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordChecks = {
    length: newPassword.length >= 8,
    uppercase: /[A-Z]/.test(newPassword),
    lowercase: /[a-z]/.test(newPassword),
    number: /[0-9]/.test(newPassword),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword),
    match: newPassword === confirmPassword && newPassword.length > 0,
  };

  const isValidPassword =
    passwordChecks.length &&
    passwordChecks.uppercase &&
    passwordChecks.lowercase &&
    passwordChecks.number &&
    passwordChecks.special;

  const canSubmit = isValidPassword && passwordChecks.match && !!token;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      setError('Invalid or missing token.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      await resetPassword(
        token,
        newPassword,
        confirmPassword,
      );

      setSubmitted(true);

      // redirect after 2 sec
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err: any) {
      setError(err?.response?.data?.message || 'Something went wrong.');
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-xl border border-gray-100">

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Reset Password</h2>
          <p className="text-gray-500 mt-2">
            Enter your new password
          </p>
        </div>

        {submitted ? (
          <div className="text-center">
            <div className="bg-green-50 text-green-700 p-4 rounded mb-6">
              Your password has been updated!
            </div>
            <Link to="/login" className="text-blue-600 hover:underline">
              Go to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">
                {error}
              </div>
            )}

            <TextField
              label="New Password"
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              required
              fullWidth
              variant="outlined"
              sx={{ mb: 3 }}
            />

            <TextField
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
              fullWidth
              variant="outlined"
            />

            <Button
              type="submit"
              fullWidth
              className="mt-4"
              disabled={!canSubmit}
            >
              Confirm
            </Button>

            <div className="mt-3 text-xs space-y-1">
              <div className={passwordChecks.length ? "text-green-600" : "text-gray-400"}>
                ✓ At least 8 characters
              </div>
              <div className={passwordChecks.uppercase ? "text-green-600" : "text-gray-400"}>
                ✓ One uppercase letter
              </div>
              <div className={passwordChecks.lowercase ? "text-green-600" : "text-gray-400"}>
                ✓ One lowercase letter
              </div>
              <div className={passwordChecks.number ? "text-green-600" : "text-gray-400"}>
                ✓ One number
              </div>
              <div className={passwordChecks.special ? "text-green-600" : "text-gray-400"}>
                ✓ One special character
              </div>
              <div className={passwordChecks.match ? "text-green-600" : "text-gray-400"}>
                ✓ Passwords match
              </div>
            </div>

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

export default ResetPassword;