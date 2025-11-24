import React, { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

interface CachedProfileData {
  time_format?: string;
}

const Timer = () => {
  const [dateTime, setDateTime] = useState(new Date());
  const queryClient = useQueryClient();
  const cachedProfile = queryClient.getQueryCache().find(['employerProfileCache']) as { state: { data: CachedProfileData } | undefined };
  
  const timeFormat = cachedProfile?.state?.data?.time_format || '12hr';

  useEffect(() => {
    const interval = setInterval(() => {
      setDateTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatDateTime = (date: Date) => {
    // Format date as MM/DD/YYYY
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    const dateStr = `${month}/${day}/${year}`;
    
    if (timeFormat === '24hr') {
      // 24-hour format: MM/DD/YYYY, HH:MM:SS
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      return `${dateStr}, ${hours}:${minutes}:${seconds}`;
    } else {
      // 12-hour format: MM/DD/YYYY, HH:MM:SS AM/PM
      const hours = date.getHours();
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours % 12 || 12;
      return `${dateStr}, ${String(displayHours).padStart(2, '0')}:${minutes}:${seconds} ${ampm}`;
    }
  };

  return <>{formatDateTime(dateTime)}</>;
}

export default Timer;
