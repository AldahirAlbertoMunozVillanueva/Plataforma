// Register.jsx
import React, { useState } from 'react';
import supabase from './client';
export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name },
        },
      });

      if (error) {
        console.error('Error during registration:', error);
        setError(`Registration failed: ${error.message}`);
      } else {
        alert('Registration successful! Check your email to confirm your account.');
      }
    } catch (err) {
      console.error('Unexpected error during registration:', err);
      setError('An unexpected error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center mt-10">
      <h1 className="text-4xl font-semibold mb-5">Add New User</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-gray-100 p-6 rounded-lg shadow-md">
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="mb-4">
          <label className="block text-lg font-medium mb-2">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name..."
            className="w-full p-3 border border-gray-300 rounded-lg"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-lg font-medium mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email..."
            className="w-full p-3 border border-gray-300 rounded-lg"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-lg font-medium mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password..."
            className="w-full p-3 border border-gray-300 rounded-lg"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 ${loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
}
