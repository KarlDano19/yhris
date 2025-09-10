'use client';
import { useEffect } from 'react';

import { deleteCookie } from 'cookies-next';

import toast from 'react-hot-toast';

import CustomToast from '@/components/CustomToast';

const GlobalErrorHandler = () => {
  useEffect(() => {
    // Listen for token expiry events
    const handleTokenExpiry = () => {
      // Clear token
      deleteCookie('token');
      
      // Show user-friendly message
      toast.custom(() => <CustomToast message="Your session has expired. Please log in again." type="error" />, {
        duration: 4000,
      });
      
      // Redirect to login after a short delay
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    };

    // Listen for custom token expiry events
    window.addEventListener('token-expired', handleTokenExpiry);

    // Listen for unhandled promise rejections (your current error)
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      
      // Check if it's a token-related error
      if (
        (typeof reason === 'string' && reason.includes('TOKEN_EXPIRED')) ||
        (reason?.message && reason.message.includes('TOKEN_EXPIRED')) ||
        (reason?.detail && reason.detail.includes('Invalid token'))
      ) {
        event.preventDefault(); // Prevent the error from showing in console
        handleTokenExpiry();
      }
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('token-expired', handleTokenExpiry);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return null; // This component doesn't render anything
};

export default GlobalErrorHandler;