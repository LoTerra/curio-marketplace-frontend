import React, { useState, useEffect, useMemo } from 'react'
import { useTimer } from 'react-timer-hook'

export default function Countdown(props){

    const { expiryTimestamp } = props

    const { seconds, minutes, hours, days, restart } = useTimer({
        autoStart: false,
        expiryTimestamp,
        onExpire: () => console.warn('onExpire called'),
    })   

    //console.log(percentageTillRebase)
    useEffect(() => {
        console.log(expiryTimestamp) 
        if (
            expiryTimestamp >
            1 /** in ordder to avoid unnecessary re-rendering/ layout */
        )
            restart(expiryTimestamp)
    }, [expiryTimestamp])


    return (
        <div className="countdown">
                    {expiryTimestamp > new Date() ? (
                       
                        <div className="row text-center">
                            <div className="col-12">
                            <p>
                            {expiryTimestamp > 1
                                        ? days.toString().padStart(2, 0)
                                        : '-'} <small>Days</small>
                                         {expiryTimestamp > 1
                                        ? hours.toString().padStart(2, 0)
                                        : '-'} <small>Hours</small>
                                         {expiryTimestamp > 1
                                        ? minutes.toString().padStart(2, 0)
                                        : '-'} <small>Minutes</small>
                                        {expiryTimestamp > 1
                                        ? seconds.toString().padStart(2, 0)
                                        : '-'} <small>Seconds</small>
                            </p>
                            </div>
                            
                        </div>
                    ) : (
                        <p className="text-muted py-2 text-center m-0">Auction finished</p>
                    )}
                </div>
    )
}