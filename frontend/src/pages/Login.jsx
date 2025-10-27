import { Lock, Mail, User2Icon } from 'lucide-react';
import React from 'react'

const Login = () => {
    const query = new URLSearchParams(window.location.search)
    const urlState =query.get('state  ')
    const [state, setState] = React.useState( urlState  ||"login");


    const [data, setData] = React.useState({
        name: "",
        email: "",
        password: "",
    });


    const onChangeHandler = (e) => {
        setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };


    const handleSubmit = (e) => {
        e.preventDefault();


    };
  return (
<div className='flex items-center justify-center min-h-screen bg-[#F5F5DC]'>
  <form
    onSubmit={handleSubmit}
    className="w-full sm:w-[400px] text-center border border-zinc-300/60 dark:border-transparent rounded-2xl px-8 bg-white dark:bg-[#388E3C]"
  >
    <h1 className="text-zinc-900 dark:text-[#F5F5DC] text-3xl mt-10 font-medium">
      {state === "login" ? "Login" : "Register"}
    </h1>
    <p className="text-zinc-500 dark:text-[#D7CCC8] text-sm mt-2 pb-6">
      Please {state === "login" ? "sign in" : "sign up"} to continue
    </p>

    {state !== "login" && (
      <div className="flex items-center w-full mt-4 bg-zinc-100 dark:bg-[#2D482E] border border-zinc-300/80 dark:border-transparent h-12 rounded-full overflow-hidden pl-6 gap-2">
        {/* User Icon */}
        <User2Icon size={16} className="text-gray-500 dark:text-[#D7CCC8]" />
        <input
          type="text"
          placeholder="Name"
          className="bg-transparent text-zinc-600 dark:text-[#F5F5DC] placeholder-zinc-500 dark:placeholder-[#D7CCC8] outline-none text-sm w-full h-full"
          name="name"
          value={data.name}
          onChange={onChangeHandler}
          required
        />
      </div>
    )}

    <div className="flex items-center w-full mt-4 bg-zinc-100 dark:bg-[#2D482E] border border-zinc-300/80 dark:border-transparent h-12 rounded-full overflow-hidden pl-6 gap-2">
      {/* Mail Icon */}
      <Mail size={16} className="text-gray-500 dark:text-[#D7CCC8]" />
      <input
        type="email"
        placeholder="Email id"
        className="bg-transparent text-zinc-600 dark:text-[#F5F5DC] placeholder-zinc-500 dark:placeholder-[#D7CCC8] outline-none text-sm w-full h-full"
        name="email"
        value={data.email}
        onChange={onChangeHandler}
        required
      />
    </div>

    <div className="flex items-center mt-4 w-full bg-zinc-100 dark:bg-[#2D482E] border border-zinc-300/80 dark:border-transparent h-12 rounded-full overflow-hidden pl-6 gap-2">
      {/* Lock Icon */}
      <Lock size={16} className="text-gray-500 dark:text-[#D7CCC8]" />
      <input
        type="password"
        placeholder="Password"
        className="bg-transparent text-zinc-600 dark:text-[#F5F5DC] placeholder-zinc-500 dark:placeholder-[#D7CCC8] outline-none text-sm w-full h-full"
        name="password"
        value={data.password}
        onChange={onChangeHandler}
        required
      />
    </div>

    <div className="mt-5 text-left">
      <a
        className="text-sm text-indigo-500 dark:text-[#F5F5DC] dark:hover:underline"
        href="#"
      >
        Forgot password?
      </a>
    </div>

    <button
      type="submit"
      className="mt-2 w-full h-11 rounded-full font-semibold text-white bg-indigo-500 dark:bg-[#F5F5DC] dark:text-[#388E3C] hover:opacity-90 transition-opacity"
    >
      {state === "login" ? "Login" : "Create Account"}
    </button>

    <p className="text-zinc-500 dark:text-[#D7CCC8] text-sm mt-3 mb-11">
      {state === "login"
        ? "Don't have an account? "
        : "Already have an account? "}
      <button
        type="button"
        className="font-medium text-indigo-500 dark:text-[#F5F5DC] dark:hover:underline"
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
