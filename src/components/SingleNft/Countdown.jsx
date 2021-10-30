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
        <div className="countdown col-12 col-md-10 mx-auto">
                    {expiryTimestamp > new Date() ? (
                        <div className="row text-center">
                            <div className="col px-1">
                                <div className="text-sm time-low">Days</div>
                                <div className="font-bold time" x-text="days">
                                    {expiryTimestamp > 1
                                        ? days.toString().padStart(2, 0)
                                        : '-'}
                                </div>
                            </div>
                            <div className="col px-1">
                                <span className="spacer">:</span>
                            </div>
                            <div className="col px-1">
                                <div className="text-sm time-low">Hours</div>
                                <div className="font-bold time" x-text="hours">
                                    {expiryTimestamp > 1
                                        ? hours.toString().padStart(2, 0)
                                        : '-'}
                                </div>
                            </div>
                            <div className="col px-1">
                                <span className="spacer">:</span>
                            </div>
                            <div className="col px-1">
                                <div className="text-sm time-low">Minutes</div>
                                <div
                                    className="font-bold time"
                                    x-text="minutes"
                                >
                                    {expiryTimestamp > 1
                                        ? minutes.toString().padStart(2, 0)
                                        : '-'}
                                </div>
                            </div>
                            <div className="col px-1">
                                <span className="spacer">:</span>
                            </div>
                            <div className="col px-1">
                                <div className="text-sm time-low">Seconds</div>
                                <div
                                    className="font-bold time"
                                    x-text="seconds"
                                >
                                    {expiryTimestamp > 1
                                        ? seconds.toString().padStart(2, 0)
                                        : '-'}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="row text-center">
                            <div className="col px-1">
                                <div className="font-bold time">
                                    <div>Auction expired</div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
    )
}