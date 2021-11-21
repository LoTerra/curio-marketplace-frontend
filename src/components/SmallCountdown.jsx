import { Clock } from 'phosphor-react';
import React, { useState, useEffect, useMemo } from 'react'
import { useTimer } from 'react-timer-hook'

export default function SmallCountdown(props){

    const { expiryTimestamp } = props
    const [currentTime, setCurrentTime] = useState(Date.now());

  const timeBetween = expiryTimestamp * 1000 - currentTime;
  const seconds = Math.floor((timeBetween / 1000) % 60);
  const minutes = Math.floor((timeBetween / 1000 / 60) % 60);
  const hours = Math.floor((timeBetween / (1000 * 60 * 60)) % 24);
  const days = Math.floor(timeBetween / (1000 * 60 * 60 * 24));

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    //   console.log(currentTime, expiryTimestamp)
    }, 1000);

    return () => clearInterval(interval);
  }, []);
    


    return (
        <div className="countdown-small">
            <small>TIME LEFT</small>
            <p>{days}d {hours}h {minutes}m {seconds}s</p>                   
        </div>
    )
}