import React, { useContext, useState } from 'react';
import AuthLayout from '../../components/AuthLayout';
import { validateEmail } from '../../utils/helper';
import ProfilePhotoSelector from '../../components/Inputs/ProfilePhotoSelector';
import Input from '../../components/Inputs/Input';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { UserContext } from '../../context/userContext';
import uploadImage from '../../utils/uploadImage';
import { toast } from 'react-hot-toast'; // make sure this is imported

const SignUp = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminInviteToken, setAdminInviteToken] = useState('');

  // List of divisions + default PRQ
  const divisions = ["PRQ", "SSGS", "BS", "ES", "GS"];
  const [division, setDivision] = useState("PRQ");

  const [error, setError] = useState(null);

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    let profileImageUrl = '';

    // === Form validation ===
    if (!fullName.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password.trim()) {
      setError("Please enter your password.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (!division) {
      setError("Please select your division.");
      return;
    }

    setError("");

    try {
      // Upload profile picture if available
      if (profilePic) {
        const uploadedUrl = await uploadImage(profilePic);
        console.log("Image Upload Response:", imgUploadRes);
        profileImageUrl = uploadedUrl;
      }

      // === Send data to backend ===
      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        name: fullName,
        email,
        password,
        profileImageUrl,
        adminInviteToken,
        division, // send division to backend
      });

      const { token, role } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        updateUser(response.data);

        toast.success("Registration successful! Please login to continue.");
        navigate("/login");
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("An error occurred. Please try again.");
      }
    }
  };

  return (
    <AuthLayout>
      <div className='lg:w-[100%] h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center'>
        <form onSubmit={handleSignUp}>
          <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <Input
              value={fullName}
              onChange={({ target }) => setFullName(target.value)}
              label="Full Name"
              placeholder='Example'
              type='text'
            />

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

            {/* Division Dropdown (default PRQ) */}
            <div>
              <label className="block text-sm  text-gray mb-1 mt-1">
                Division
              </label>
              <select
                value={division}
                onChange={({ target }) => setDivision(target.value)}
                className="w-full flex justify-between gap-3 text-sm text-black bg-slate-100/50 rounded px-4 py-3 mb-4 mt-3 border border-slate-200 outline-none"
                required
              >
                {divisions.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <Input
              value={adminInviteToken}
              onChange={({ target }) => setAdminInviteToken(target.value)}
              label="Admin Invitation Code"
              placeholder="6-Digit Code"
              type="text"
            />
          </div>

          {error && <p className='text-red-600 text-xs pb-2.5'>{error}</p>}

          <button
            type='submit'
            className='w-full py-2 rounded-md bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors duration-300 mt-4'
          >
            SIGN UP
          </button>

          <p className='text-[13px] text-slate-800 mt-3'>
            Already have an account?{" "}
            <Link className='font-medium text-red-600 underline' to="/login">
              Login
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default SignUp;
