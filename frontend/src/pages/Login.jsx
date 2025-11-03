import { Lock, Mail, User2Icon } from 'lucide-react';
import React from 'react'
import { useDispatch } from 'react-redux';
import { login } from '../app/features/authSlice';
import toast from 'react-hot-toast';
import api from '../config/api.js';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const dispatch =useDispatch()
  const navigate = useNavigate()
    const query = new URLSearchParams(window.location.search)
    const urlState = query.get('state')
    const [state, setState] = React.useState(urlState || "login");


    const [formdata, setformData] = React.useState({
        name: "",
        email: "",
        password: "",
    });


    const onChangeHandler = (e) => {
        setformData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };


    const handleSubmit = async(e) => {
        e.preventDefault();
        try {
          const payload = state === "login" ? { email: formdata.email, password: formdata.password } : formdata;
          const {data: responseData}= await api.post(`/api/users/${state}`, payload)
          dispatch(login(responseData))
          localStorage.setItem('token',responseData.token)
          toast.success(responseData.message)
          // Redirect to dashboard after successful login/register
          navigate('/app')

        } catch (error) {
          toast.error(error?.response?.data?.message || error.message)

        }

    };
  return (
<div className='flex items-center justify-center min-h-screen bg-[#F7F4E8]'>
  <form
    onSubmit={handleSubmit}
    className="w-full sm:w-[400px] text-center border border-zinc-300/60 dark:border-transparent rounded-2xl px-8 bg-white dark:bg-[#385A3A]"
  >
    <h1 className="text-zinc-900 dark:text-[#ffffff] text-3xl mt-10 font-medium">
      {state === "login" ? "Login" : "Register"}
    </h1>
    <p className="text-zinc-500 dark:text-[#ffffff] text-sm mt-2 pb-6">
      Please {state === "login" ? "sign in" : "sign up"} to continue
    </p>

    {state !== "login" && (
      <div className="flex items-center w-full mt-4 bg-zinc-100 dark:bg-[#F5F5DC] border border-zinc-300/80 dark:border-transparent h-12 rounded-full overflow-hidden pl-6 gap-2">
        {/* User Icon */}
        <User2Icon size={16} className="text-gray-500 dark:text-[#333333]" />
        <input
          type="text"
          placeholder="Name"
          className="bg-transparent text-zinc-600 dark:text-[#333333] placeholder-[#333333] dark:placeholder-black  outline-none text-sm w-full h-full"
          name="name"
          value={formdata.name}
          onChange={onChangeHandler}
          required
        />
      </div>
    )}

    <div className="flex items-center w-full mt-4 bg-zinc-100 dark:bg-[#F5F5DC] border border-zinc-300/80 dark:border-transparent h-12 rounded-full overflow-hidden pl-6 gap-2">
      {/* Mail Icon */}
      <Mail size={16} className="text-gray-500 dark:text-[#333333]" />
      <input
        type="email"
        placeholder="Email id"
        className="bg-transparent text-zinc-600 dark:text-[#333333] placeholder-[#333333] dark:placeholder-black outline-none text-sm w-full h-full"
        name="email"
        value={formdata.email}
        onChange={onChangeHandler}
        required
      />
    </div>

    <div className="flex items-center mt-4 w-full bg-zinc-100 dark:bg-[#F5F5DC] border border-zinc-300/80 dark:border-transparent h-12 rounded-full overflow-hidden pl-6 gap-2">
      {/* Lock Icon */}
      <Lock size={16} className="text-gray-500 dark:text-[#333333]" />
      <input
        type="password"
        placeholder="Password"
        className="bg-transparent text-zinc-600 dark:text-[#333333] placeholder-[#333333] dark:placeholder-black outline-none text-sm w-full h-full"
        name="password"
        value={formdata.password}
        onChange={onChangeHandler}
        required
      />
    </div>

    <div className="mt-5 text-left">
      <a
        className="text-sm text-indigo-500 dark:text-[#ffffff] dark:hover:underline"
        href="#"
      >
        Forgot password?
      </a>
    </div>

    <button
      type="submit"
      className="mt-2 w-full h-11 rounded-full font-semibold text-white dark:bg-[#8BAD53] dark:text-[#ffffff] hover:opacity-90 transition-opacity"
    >
      {state === "login" ? "Login" : "Create Account"}
    </button>

    <p className="text-zinc-500 dark:text-[#ffffff] text-sm mt-3 mb-11">
      {state === "login"
        ? "Don't have an account? "
        : "Already have an account? "}
      <button
        type="button"
        className="font-medium dark:text-[#8BAD53] dark:hover:underline"
        onClick={() =>
          setState((prev) => (prev === "login" ? "register" : "login"))
        }
      >
        {state === "login" ? "Register" : "Login"}
      </button>
    </p>
  </form>
</div>
  )
}

export default Login
