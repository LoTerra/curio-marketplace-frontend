import React, { useState, useEffect, useMemo } from 'react'
import { useTimer } from 'react-timer-hook'

export default function SmallCountdown(props){

    const { expiryTimestamp } = props


    const { seconds, minutes, hours, days, restart } = useTimer({
        autoStart: false,
        expiryTimestamp,
        onExpire: () => console.warn('onExpire called',expiryTimestamp),
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
        <div className="countdown-small">
                    { expiryTimestamp > new Date() &&
                        
                      
                            <p>{expiryTimestamp > 1
                                        ? days.toString().padStart(2, 0)
                                        : '-'} 
                                        :
                                        {expiryTimestamp > 1
                                        ? hours.toString().padStart(2, 0)
                                        : '-'}
                                        :
                                           {expiryTimestamp > 1
                                        ? minutes.toString().padStart(2, 0)
                                        : '-'}
                                        :
                                               {expiryTimestamp > 1
                                        ? seconds.toString().padStart(2, 0)
                                        : '-'}
                                        </p>
                            
                       
                    }
                </div>
    )
}