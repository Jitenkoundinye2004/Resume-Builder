import Home from './pages/Home';
import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from './pages/Layout';
import Dashboard from './pages/Dashboard';
import ResumeBuilder from './pages/ResumeBuilder';
import Preview from './pages/Preview';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import { useDispatch } from 'react-redux';
import api from './config/api.js';
import {login, setLoading } from './app/features/authSlice';
import {Toaster} from 'react-hot-toast'
const App = () => {
  const dispatch = useDispatch();

  const getUserData = async (params) => {
    const token = localStorage.getItem('token');
    try {
      if (token) {
        const { data } = await api.get('/api/users/data', { headers: { Authorization: `Bearer ${token}` } });
        if (data.user) {
          dispatch(login({ token, user: data.user }));
        }
        dispatch(setLoading(false));
      }else {
          dispatch(setLoading(false));
        }
      }catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
      }
      dispatch(setLoading(false));
      // console.log(error.message);
    }
  };

  useEffect(()=>{
    getUserData();
  },[])

  return (
    <>
    <Toaster/>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="app" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="builder/:resumeId" element={<ResumeBuilder />} />
        </Route>

        <Route path="view/:resumeId" element={<Preview />} />

        <Route path="login" element={<Login />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="reset-password/:token" element={<ResetPassword />} />
      </Routes>
    </>
  );
};

export default App;