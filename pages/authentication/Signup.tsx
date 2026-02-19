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
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
const [nameError, setNameError] = useState('');
const [passwordError, setPasswordError] = useState('');

const handleSignup = async (e: React.FormEvent) => {
  e.preventDefault();

  setLoading(true);

  // Clear old errors
  setError('');
  setEmailError('');
  setNameError('');
  setPasswordError('');

  try {
    await signup(email, firstName, lastName, password);
    navigate('/login');
  } catch (err: any) {
    console.error("Signup error:", err);

    const errors =
      err?.errors ||          // from improved service
      err?.data?.errors ||    // your current backend shape
      null;

    if (errors) {
      // Handle field-wise errors safely
      if (errors.email) setEmailError(errors.email);

      // Backend may send firstName / lastName / name / non_field_errors
      if (errors.firstName || errors.lastName || errors.name) {
        setNameError(
          errors.firstName ||
          errors.lastName ||
          errors.name
        );
      }

      if (errors.password) setPasswordError(errors.password);

      // If any unknown field errors exist → show generic box
      const knownFields = ['email', 'password', 'firstName', 'lastName', 'name'];
      const otherErrors = Object.keys(errors)
        .filter(k => !knownFields.includes(k))
        .map(k => errors[k]);

      if (otherErrors.length > 0) {
        setError(otherErrors.join("\n"));
      }
    } else {
      // Generic / network / unexpected error
      setError(err?.message || "Something went wrong. Please try again.");
    }
  } finally {
    setLoading(false);
  }
};



//   const handleSignup = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);



//     try {
//       await signup(email, firstName, lastName, password);
//       setLoading(false);
//       navigate('/login');

//     }  catch (err: any) {
//   console.error("Signup error:", err);

//   // If backend returned validation errors
//   if (err?.data?.errors) {
//     const errorsObj = err.data.errors;

//     // Convert {email: "...", password: "..."} -> single string
//     const formatted = Object.entries(errorsObj)
//       .map(([field, message]) => `${field}: ${message}`)
//       .join("\n");

//     setError(formatted);
//   } 
//   // fallback
//   else {
//     setError(err?.message || "Error while signing up");
//   }
// }

//   };

  return (
    <div className="flex h-screen bg-gray-50 items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-xl border border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>
          <p className="text-gray-500 mt-2">Join Waynautic today</p>
        </div>

        {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm text-center border border-red-200">{error}</div>}


        <form onSubmit={handleSignup}>
          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}

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

          { nameError && <p className="text-red-500 text-sm mt-1">{nameError}</p> }
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
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