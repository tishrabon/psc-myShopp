import React from 'react'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const ScrollTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname.startsWith('/product') || pathname.startsWith('/updateuser') || pathname.startsWith('/user') || pathname.startsWith('/cart') || pathname.startsWith('/orderHistory') || pathname.startsWith('/contact') ) {

    }
    window.scrollTo(0, 0);
  
  }, [pathname])


  return null;
};

export default ScrollTop