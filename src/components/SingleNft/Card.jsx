import React, { useState, useEffect } from 'react'
import { useStore } from '../../store'
import Tilt from 'react-tilt'
import Countdown from './Countdown';



export default function Card(props) {
    const { state, dispatch } = useStore()

    const {index, data, nft, type, expiryTimestamp} = props;
    console.log("data-props")
    console.log(data)
    return (<>{ data &&
        <>
        <Tilt className="Tilt" options={{
            glare: true,
            maxGlare: .5,
            max: 20,
            scale: type == 'xl' ? 1.0 : 1.05,
            transition: true,
            reset: true,
            easing: "cubic-bezier(.03,.98,.52,.99)"
        }}>
            <div className="Tilt-inner">
            <div className="nft-preview ratio ratio-1x1">
                <img src={nft ? nft.image : 'https://i.pinimg.com/736x/1d/00/6c/1d006cafea4ebb657e1bee4d38043569.jpg'} />
        
            </div>                
            </div>
        </Tilt>
       
    </>
}</>
    )
}