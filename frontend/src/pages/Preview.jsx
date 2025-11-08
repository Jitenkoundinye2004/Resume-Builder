import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { dummyResumeData } from '../assets/assets';
import { ArrowLeft, ArrowLeftIcon } from 'lucide-react';
import ResumePreview from "../Components/ResumePreview";
import Loader from '../Components/Loader'; 
import API from '../config/api';

const Preview = () => {
  const { resumeId } = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [resumeData, setResumeData] = useState(null);

  const loadResume = async () => {
    if (!resumeId) {
      console.error('No resume ID provided');
      setIsLoading(false);
      return;
    }

    try {
      console.log('Loading resume with ID:', resumeId);
      const url = '/api/resumes/public/' + resumeId;
      console.log('API URL:', url);
      console.log('Full URL:', API.defaults.baseURL + url);
      
      const {data} = await API.get(url);
      console.log('Resume data received:', data);
      
      if (data && data.resume) {
        setResumeData(data.resume);
      } else {
        console.error('Invalid response format:', data);
      }
    } catch (error) {
      console.error('=== Error loading resume ===');
      console.error('Error object:', error);
      console.error('Error message:', error.message);
      console.error('Response data:', error.response?.data);
      console.error('Response status:', error.response?.status);
      console.error('Response headers:', error.response?.headers);
      console.error('Request URL:', error.config?.url);
      console.error('Request base URL:', error.config?.baseURL);
      console.error('Resume ID:', resumeId);
      
      // Don't set resumeData to null here, let it stay null so error UI shows
    } finally {
       setIsLoading(false)
    }
  };

  useEffect(() => {
    loadResume();
  }, []);

  return resumeData ? (
    <div className="bg-slate-100">
      <div className="max-w-3xl mx-auto py-10">
        <ResumePreview
          data={resumeData}
          template={resumeData.template}
          accentColor={resumeData.accent_color}
          classes="py-4 bg-white"
        />
      </div>
    </div>
  ) : (
    <div>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="flex flex-col items-center justify-center h-screen">
          <p className="text-center text-6xl text-slate-400 font-medium">Resume not found</p>
          <a
            href="/"
            className="mt-6 bg-green-500 hover:bg-green-600 text-white rounded-full px-6 h-9 m-1 ring-offset-1
            ring-1 ring-green-400 flex items-center transition-colors"
          >
            <ArrowLeftIcon className="mr-2 size-4" /> Go to home page
          </a>
        </div>
      )}
    </div>
  );
};

export default Preview;
