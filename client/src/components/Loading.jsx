import React, { useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { useLocation } from 'react-router-dom';

const Loading = () => {
    const {navigate}=useAppContext();
    const {search}=useLocation();
    const query=new URLSearchParams(search);
    const nextUrl=query.get('next');

    useEffect(()=>{
        if(nextUrl){
            setTimeout(() => {
                navigate(`/${nextUrl}`);
            }, 5000);
        }
    })
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};

export default Loading;

