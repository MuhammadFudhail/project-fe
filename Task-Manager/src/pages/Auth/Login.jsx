import React, { useContext, useState } from 'react';
import AuthLayout from '../../components/AuthLayout';
import { Link, useNavigate } from "react-router-dom";
import Input from '../../components/Inputs/Input';
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { UserContext } from '../../context/userContext';
import FullScreenLoader from '../../components/FullScreenLoader';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  // 🔹 Function to handle login
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setError("");
    setLoading(true);

    const startTime = Date.now(); // start counting loading time

    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });

      console.log("Login response:", response.data);

      const user = response.data;
      const { token, role, division } = user;

      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("role", role);
        localStorage.setItem("division", division);
        localStorage.setItem("user", JSON.stringify(user));
        updateUser(user);

        // Ensure minimum loading of 2 seconds
        const elapsed = Date.now() - startTime;
        const delay = elapsed < 2000 ? 2000 - elapsed : 0;

        setTimeout(() => {
          if (role === "admin") {
            navigate("/admin/dashboard");
          } else {
            navigate("/user/dashboard");
          }
        }, delay);
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("An error occurred. Please try again.");
      }
      setLoading(false); // stop loading if an error occurs
    }
  };

  return (
    <AuthLayout>
      {/* Loader shows when loading is true */}
      {loading && <FullScreenLoader message="Redirecting to dashboard..." />}

      <div className='lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center'>
        <form onSubmit={handleLogin}>
          <Input
            value={email}
            onChange={({ target }) => setEmail(target.value)}
            label="Email Address"
            placeholder="example@gmail.com"
            type="text"
          />

          <Input
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            label="Password"
            placeholder="Minimum 8 characters"
            type="password"
          />

          {error && <p className='text-red-600 text-xs pb-2.5'>{error}</p>}

          <button
            type="submit"
            disabled={loading} // prevent multiple clicks
            className={`w-full py-2 rounded-md bg-gradient-to-r from-red-500 to-red-700 
              hover:from-red-600 hover:to-red-800 text-white font-semibold transition-all duration-300 
              ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            {loading ? "Please wait..." : "LOGIN"}
          </button>

          <p className='text-[13px] text-slate-800 mt-3'>
            Don’t have an account?{" "}
            <Link className='font-medium text-red-600 underline' to="/signup">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default Login;
