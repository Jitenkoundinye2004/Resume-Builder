import { Lock, Eye, EyeOff } from 'lucide-react';
import React from 'react'
import toast from 'react-hot-toast';
import api from '../config/api.js';
import { useNavigate, useParams } from 'react-router-dom';

const ResetPassword = () => {
  const navigate = useNavigate()
  const { token } = useParams()
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const handleSubmit = async(e) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
      toast.error('Please fill all fields');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post(`/api/users/reset-password/${token}`, { password });
      toast.success(data.message);
      navigate('/login');
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex items-center justify-center min-h-screen bg-[#F7F4E8]'>
      <form
        onSubmit={handleSubmit}
        className="w-full sm:w-[400px] text-center border border-zinc-300/60 dark:border-transparent rounded-2xl px-8 bg-white dark:bg-[#385A3A]"
      >
        <h1 className="text-zinc-900 dark:text-[#ffffff] text-3xl mt-10 font-medium">
          Reset Password
        </h1>
        <p className="text-zinc-500 dark:text-[#ffffff] text-sm mt-2 pb-6">
          Enter your new password
        </p>

        <div className="flex items-center w-full mt-4 bg-zinc-100 dark:bg-[#F5F5DC] border border-zinc-300/80 dark:border-transparent h-12 rounded-full overflow-hidden pl-6 gap-2">
          <Lock size={16} className="text-gray-500 dark:text-[#333333]" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="New Password"
            className="bg-transparent text-zinc-600 dark:text-[#333333] placeholder-[#333333] dark:placeholder-black outline-none text-sm w-full h-full"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="pr-4 text-gray-500 dark:text-[#333333] hover:text-gray-700 dark:hover:text-[#000000] transition-colors"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        <div className="flex items-center w-full mt-4 bg-zinc-100 dark:bg-[#F5F5DC] border border-zinc-300/80 dark:border-transparent h-12 rounded-full overflow-hidden pl-6 gap-2">
          <Lock size={16} className="text-gray-500 dark:text-[#333333]" />
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            className="bg-transparent text-zinc-600 dark:text-[#333333] placeholder-[#333333] dark:placeholder-black outline-none text-sm w-full h-full"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="pr-4 text-gray-500 dark:text-[#333333] hover:text-gray-700 dark:hover:text-[#000000] transition-colors"
          >
            {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full h-11 rounded-full font-semibold text-white dark:bg-[#8BAD53] dark:text-[#ffffff] hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>

        <p className="text-zinc-500 dark:text-[#ffffff] text-sm mt-3 mb-11">
          Remember your password?
          <button
            type="button"
            className="font-medium dark:text-[#8BAD53] dark:hover:underline ml-1"
            onClick={() => navigate('/login')}
          >
            Login
          </button>
        </p>
      </form>
    </div>
  )
}

export default ResetPassword
