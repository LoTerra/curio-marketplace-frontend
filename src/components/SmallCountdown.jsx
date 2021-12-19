import { Clock, Flag } from 'phosphor-react'
import React, { useState, useEffect, useMemo } from 'react'
import { useTimer } from 'react-timer-hook'

export default function SmallCountdown(props) {
    const { expiryTimestamp, start } = props
    const [currentTime, setCurrentTime] = useState(Date.now())

    const timeBetween = expiryTimestamp * 1000 - currentTime
    const seconds = Math.floor((timeBetween / 1000) % 60)
    const minutes = Math.floor((timeBetween / 1000 / 60) % 60)
    const hours = Math.floor((timeBetween / (1000 * 60 * 60)) % 24)
    const days = Math.floor(timeBetween / (1000 * 60 * 60 * 24))

    const timeBetweenStart = start * 1000 - currentTime
    const secondsStart = Math.floor((timeBetweenStart / 1000) % 60)
    const minutesStart = Math.floor((timeBetweenStart / 1000 / 60) % 60)
    const hoursStart = Math.floor((timeBetweenStart / (1000 * 60 * 60)) % 24)
    const daysStart = Math.floor(timeBetweenStart / (1000 * 60 * 60 * 24))

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(Date.now())
            //   console.log(currentTime, expiryTimestamp)
        }, 1000)

        return () => clearInterval(interval)
    }, [])

    return (
        <div className="countdown-small">
            {start * 1000 > Date.now() && expiryTimestamp * 1000 > Date.now() && (
                <p>
                    <Flag size={16} style={{ marginTop: '-3px' }} />
                    {daysStart}d {hoursStart}h {minutesStart}m {secondsStart}s
                </p>
            )}
            {start * 1000 <= Date.now() && expiryTimestamp * 1000 > Date.now() && (
                <p>                    
                    <Clock size={16} style={{ marginTop: '-3px' }} />
                    {days}d {hours}h {minutes}m {seconds}s
                </p>
            )}
        </div>
    )
}
