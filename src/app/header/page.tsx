'use client';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import Link from 'next/link';

const Header = () => {
  const [date, setDate] = useState(new Date().toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' }));

  useEffect(() => {
    const timer = setInterval(() => {
      setDate(new Date().toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  
  return(
    <div className={'mx-auto flex items-center border-b-2 px-6 py-2'} style={{fontSize:'28px'}}>
    <div className='leftSide' style={{display: 'flex', alignItems: 'center', flexGrow: '1'}}>
      <img src='yahshua.png' style={{height:'33%',width:'3.5%', verticalAlign: 'middle', marginRight:'0.3em'}} />
      <h1 className='font-bold' style={{display:'flex'}}><p style={{color:'#2C3F58'}}>Yahshua</p> <p style={{color:'#FFC107',marginLeft: '0.5rem'}}>HRIS</p></h1>
    </div>
    <div className='grow'>
      <div className='flex items-center justify-center gap-2 md:gap-8'>
        <img src='user.png' height='29px' width='29px'/>
        <div className='currentDate'>{date}</div> 
      </div>
    </div>
  </div>

  )
}

export default Header;