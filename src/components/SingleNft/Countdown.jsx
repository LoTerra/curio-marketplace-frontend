import React, { useState, useEffect, useMemo } from 'react'

export default function Countdown(props) {
    const { expiryTimestamp, start, end } = props
    const [currentTime, setCurrentTime] = useState(Date.now())

    const timeBetween = expiryTimestamp - currentTime
    const seconds = Math.floor((timeBetween / 1000) % 60)
    const minutes = Math.floor((timeBetween / 1000 / 60) % 60)
    const hours = Math.floor((timeBetween / (1000 * 60 * 60)) % 24)
    const days = Math.floor(timeBetween / (1000 * 60 * 60 * 24))

    const timeBetweenStart = start * 1000 - currentTime
    const secondsStart = Math.floor((timeBetweenStart / 1000) % 60)
    const minutesStart = Math.floor((timeBetweenStart / 1000 / 60) % 60)
    const hoursStart = Math.floor((timeBetweenStart / (1000 * 60 * 60)) % 24)
    const daysStart = Math.floor(timeBetweenStart / (1000 * 60 * 60 * 24))

    function nftValid(end, start) {
        let ending = parseInt(end) * 1000
        let starting = parseInt(start) * 1000
        let now = Date.now()
        //console.log(ending,starting,now)
        if (starting > now) {
            return false
        }
        if (ending < now) {
            return false
        }
        return true
    }

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(Date.now())
            //   console.log(currentTime, expiryTimestamp)
        }, 1000)

        return () => clearInterval(interval)
    }, [])

    return (
        <div className="countdown">
            {end > 1 && nftValid(end, start) ? (
                <div className="row text-center">
                    <div className="col-12">
                        <p>
                            {expiryTimestamp > 1 ? days : '-'}{' '}
                            <small>Days</small>
                            {expiryTimestamp > 1 ? hours : '-'}{' '}
                            <small>Hours</small>
                            {expiryTimestamp > 1 ? minutes : '-'}{' '}
                            <small>Minutes</small>
                            {expiryTimestamp > 1 ? seconds : '-'}{' '}
                            <small>Seconds</small>
                        </p>
                    </div>
                </div>
            ) : (
                <p className="text-muted py-2 text-center m-0"></p>
            )}
            {start * 1000 > Date.now() && (
                <div className="row text-center">
                    <div className="col-12">
                        <p>
                            <small className="d-block">STARTS IN</small>
                            {expiryTimestamp > 1 ? daysStart : '-'}{' '}
                            <small>Days</small>
                            {expiryTimestamp > 1 ? hoursStart : '-'}{' '}
                            <small>Hours</small>
                            {expiryTimestamp > 1 ? minutesStart : '-'}{' '}
                            <small>Minutes</small>
                            {expiryTimestamp > 1 ? secondsStart : '-'}{' '}
                            <small>Seconds</small>
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
}
