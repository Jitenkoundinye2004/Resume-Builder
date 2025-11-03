import { Mail } from 'lucide-react';
import React from 'react'
import toast from 'react-hot-toast';
import api from '../config/api.js';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const navigate = useNavigate()
  const [email, setEmail] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async(e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email');
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post('/api/users/forgot-password', { email });
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
          Forgot Password
        </h1>
        <p className="text-zinc-500 dark:text-[#ffffff] text-sm mt-2 pb-6">
          Enter your email to reset your password
        </p>

        <div className="flex items-center w-full mt-4 bg-zinc-100 dark:bg-[#F5F5DC] border border-zinc-300/80 dark:border-transparent h-12 rounded-full overflow-hidden pl-6 gap-2">
          <Mail size={16} className="text-gray-500 dark:text-[#333333]" />
          <input
            type="email"
            placeholder="Email id"
            className="bg-transparent text-zinc-600 dark:text-[#333333] placeholder-[#333333] dark:placeholder-black outline-none text-sm w-full h-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full h-11 rounded-full font-semibold text-white dark:bg-[#8BAD53] dark:text-[#ffffff] hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {loading ? 'Sending...' : 'Send Reset Link'}
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

export default ForgotPassword
