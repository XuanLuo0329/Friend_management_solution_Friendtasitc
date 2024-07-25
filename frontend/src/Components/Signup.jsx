import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import logo from '../assets/Logo.png'; // Import the logo image

const Signup = () => {
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = `${API_BASE_URL}/api/auth/register`;
      const { data: res } = await axios.post(url, data);
      navigate("/login");
      console.log(res.message);
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
      <div className="mx-auto h-[580px] shadow-lg shadow-gray-600 sm:max-w-[400px]">
        <div className="p-4 flex flex-col justify-around">

          <div className="flex items-center justify-center flex-col mt-5 mb-2">
            <Link className="w-2/5 h-auto" to="/home">
              <img src={logo} alt="Logo"/>
            </Link>
          </div>
          <h1 className="text-2xl font-bold text-center text-indigo-600 mt-2 mb-5">Register your new account</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
                type="text"
                placeholder="First Name"
                name="firstName"
                onChange={handleChange}
                value={data.firstName}
                required
                className="border p-2 w-full"
            />
            <input
                type="text"
                placeholder="Last Name"
                name="lastName"
                onChange={handleChange}
                value={data.lastName}
                required
                className="border p-2 w-full"
            />
            <input
                type="email"
                placeholder="Email"
                name="email"
                onChange={handleChange}
                value={data.email}
                required
                className="border p-2 w-full"
            />
            <input
                type="password"
                placeholder="Password"
                name="password"
                onChange={handleChange}
                value={data.password}
                required
                className="border p-2 w-full"
            />
            {error && (
                <div className="text-red-500 text-sm">{error}</div>
            )}
            <button type="submit"
                    className="rounded-md w-full py-2 my-4 bg-indigo-600 text-white font-bold hover:bg-indigo-500">
              Sign Up
            </button>
            <p className="text-center text-gray-600">
              Already have an account? Try {" "} <Link to="/login" className="text-indigo-600">Sign In</Link>{" "}here!
            </p>
          </form>

        </div>
      </div>

    </div>
  );
};

export default Signup;