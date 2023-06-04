import React, { useState, useEffect } from 'react';

const Timer = () => {
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setDateTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return <>{dateTime.toLocaleString("en-GB")}</>;
}

export default Timer;
