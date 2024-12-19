import React, { useEffect, useState } from 'react';

const CurrentDateTime = () => {
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setDateTime(new Date()); // Update the state every second
    }, 1000);

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  // Format the date and time as needed
  const formattedDateTime = dateTime.toLocaleString('en-US', {
    // weekday: 'short',
    // year: 'numeric',
    // month: 'short',
    // day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return <div style={{ fontSize: '12px' }} id="currentDateTime" className="text-dark">{formattedDateTime}</div>;
};

export default CurrentDateTime;
