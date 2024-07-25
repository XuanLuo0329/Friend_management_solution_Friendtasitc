import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import logo from '../assets/Logo.png';
import videoBackground from '../assets/videoBackground.mp4';

export default function Login() {
  const [data, setData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = ({ target }) => {
    setData({ ...data, [target.name]: target.value });
  };

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = `${API_BASE_URL}/api/auth/login`;
      const response = await axios.post(url, data);
      localStorage.setItem('token', response.data.token);
      window.location = '/';
    } catch (error) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        setError(error.response.data.message);
      }
    }
  };

  return (
    <div className="w-full h-screen flex font-quicksand">
      <div className="grid grid-cols-1 md:grid-cols-2 mx-auto h-[580px] shadow-lg shadow-gray-600 sm:max-w-[700px]">
        <div className="w-full h-[580px] hidden md:block">
          <video className="w-full h-full object-cover" autoPlay loop muted playsInline>
            <source src={videoBackground} type="video/mp4" />
          </video>
        </div>
        <div className="p-4 flex flex-col justify-around">

          <div className="flex items-center justify-center flex-col mt-8 mb-2">
            <Link className="w-3/5 h-auto" to="/home">
              <img src={logo} alt="Logo" />
            </Link>
          </div>
          <h1 className="text-2xl font-bold text-center text-indigo-600">Welcome to friendtastic!</h1>

          <form onSubmit={handleSubmit}>
            <div className="mb-2">
              <input
                className="border p-2 w-full"
                type="text"
                placeholder="Email"
                name="email"
                onChange={handleChange}
                value={data.email}
                required
              />
            </div>
            <div className="mb-2">
              <input
                className="border p-2 w-full"
                type="password"
                placeholder="Password"
                name="password"
                onChange={handleChange}
                value={data.password}
                required
              />
            </div>
            {error && (
              <div className="text-red-500 text-sm text-center mb-2">{error}</div>
            )}
            <button type="submit" className="rounded-md w-full py-2 my-4 bg-indigo-600 text-white font-bold hover:bg-indigo-500">
              Login
            </button>
            <p className="text-center text-gray-600 mb-2">New to friendtastic? Try <Link to="/signup" className="text-indigo-600">Sign Up</Link> here!</p>
          </form>
        </div>
      </div>
    </div>
  );
}
